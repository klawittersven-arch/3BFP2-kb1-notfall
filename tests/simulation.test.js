/* Test der Notfall-Simulation (AA4) in Handygröße 390 × 844.
 * Start: cd tests && node simulation.test.js
 * Prüft: Übersicht, idealer Ablauf in allen drei Varianten bis zur Nachbesprechung,
 * Rückmeldung und Werteverlauf bei Fehlern, „nicht erlaubt“, Bewusstlosigkeit in Variante C,
 * Merksatz nach drei Varianten, keine Konsolenfehler. Screenshots in tests/ergebnisse/. */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium, serverStarten, pruefe, ergebnis, MOBIL, beobachten, DOCS } = require('./hilfen');

const ERGEBNISSE = path.join(__dirname, 'ergebnisse');
fs.mkdirSync(ERGEBNISSE, { recursive: true });

// Nur falls docs/inhalte.js (noch) fehlt: kleiner Ersatz mit den Texten, die die Simulation braucht.
const ERSATZ_INHALTE = `var INHALTE = {
  allgemein: { kopfzeile: 'KB I – Notfallsituationen · Woche 2', merksatzUeberschrift: 'Ihr Merksatz',
    merksatzHinweis: 'Jetzt aufs Arbeitsblatt: Ergänzen Sie die Lücken im Kasten „{titel}“!', fortschritt: '{x} von {y} gelöst',
    durchklickenTitel: 'Hey, nicht einfach durchklicken!', durchklickenText: '{x} {y} {z}', durchklickenKnopf: 'Neu starten' },
  merksaetze: { aa4: ['Anaphylaxie: Allergen ', { l: 'stoppen' }, ', Hilfe holen, lagern nach ', { l: 'Leitsymptom' }, ', ', { l: 'Adrenalin' }, ' i. m. nach Anordnung oder SOP, überwachen und ', { l: 'dokumentieren' }, '.'] },
  melden: {}
};`;
const echteInhalte = fs.existsSync(path.join(DOCS, 'inhalte.js'));

async function aktion(seite, id) {
  await seite.click(`button[data-aktion="${id}"]`);
}
async function text(seite, sel) {
  return (await seite.textContent(sel)) || '';
}
async function wert(seite, klasse) {
  const t = await text(seite, `.sim-wert.${klasse} .sim-wert-zahl`);
  return t;
}
async function bisEnde(seite, wartenId, max = 15) {
  for (let i = 0; i < max; i++) {
    if (await seite.$('.sim-nachbesprechung')) return true;
    await aktion(seite, wartenId);
  }
  return !!(await seite.$('.sim-nachbesprechung'));
}
async function variante(seite, id) {
  await seite.click(`.sim-variante[data-variante="${id}"] button`);
  await seite.waitForSelector('.sim-monitor');
}
async function zurUebersicht(seite) {
  await seite.click('.sim-kopf .textknopf');
  await seite.waitForSelector('.sim-varianten');
}

(async () => {
  console.log(`Simulation (AA4) – ${echteInhalte ? 'mit docs/inhalte.js' : 'mit Ersatz für inhalte.js'}`);
  const { server, basis } = await serverStarten();
  const browser = await chromium.launch();
  const kontext = await browser.newContext(MOBIL);
  const seite = await kontext.newPage();
  const protokoll = { konsole: [], extern: [] };
  beobachten(seite, protokoll, 'simulation');
  if (!echteInhalte) {
    await seite.route('**/inhalte.js', (r) => r.fulfill({ status: 200, contentType: 'text/javascript; charset=utf-8', body: ERSATZ_INHALTE }));
  }
  await seite.goto(basis + 'w2-simulation.html');
  await seite.waitForSelector('.sim-varianten');

  /* ---------- Übersicht ---------- */
  pruefe((await seite.$$('.sim-variante')).length === 3, 'Übersicht zeigt drei Varianten');
  pruefe((await text(seite, '#fortschritt-text')).includes('0 von 3'), 'Fortschritt 0 von 3', await text(seite, '#fortschritt-text'));
  pruefe((await seite.$$('.sim-rollen-liste li')).length === 3, 'Rollen werden erklärt');

  /* ---------- A: Fehler – Schocklage bei Atemnot ---------- */
  await variante(seite, 'A');
  pruefe((await wert(seite, 'spo2')) === '92', 'A: Monitor läuft von Anfang an (SpO₂ 92)');
  await seite.screenshot({ path: path.join(ERGEBNISSE, 'simulation_monitor.png'), fullPage: false });
  await aktion(seite, 'a_beine');
  pruefe(!!(await seite.$('.sim-rueck-karte.bew-gefaehrlich')), 'A: Beine hoch bei Atemnot → „gefährlich“');
  await aktion(seite, 'a_warten');
  await aktion(seite, 'a_warten');
  const spo2Fehler = Number(await wert(seite, 'spo2'));
  pruefe(spo2Fehler <= 84, 'A: SpO₂ fällt deutlich bei falscher Lagerung', spo2Fehler);
  pruefe((await text(seite, '.sim-sprechblase')).includes('keine Luft') || (await text(seite, '.sim-sprechblase')).includes('Luft'), 'A: Aussage passt zur Atemnot', await text(seite, '.sim-sprechblase'));
  await zurUebersicht(seite);

  /* ---------- A: idealer Ablauf ---------- */
  await variante(seite, 'A');
  for (const id of ['a_stopp', 'a_hilfe', 'a_ok', 'a_adrenalin', 'a_sauerstoff', 'a_doku', 'a_messen']) await aktion(seite, id);
  pruefe(await seite.$eval('button[data-aktion="a_adrenalin"]', (b) => b.disabled), 'A: einmalige Handlung danach gesperrt');
  pruefe(await bisEnde(seite, 'a_warten'), 'A: Notfallteam trifft ein → Nachbesprechung');
  const checkA = await seite.$$eval('.sim-checkliste li', (l) => l.map((x) => x.className));
  pruefe(checkA.length === 7 && checkA.every((c) => c.includes('check-ja')), 'A: Checkliste vollständig erledigt', checkA);
  pruefe((await seite.$$('.sim-zeitstrahl tbody tr')).length >= 8, 'A: Zeitstrahl mit allen Handlungen');
  pruefe((await text(seite, '.sim-protokoll-hinweis')).includes('Notfallprotokoll'), 'A: Hinweis auf das Notfallprotokoll');
  await seite.screenshot({ path: path.join(ERGEBNISSE, 'simulation_nachbesprechung.png'), fullPage: true });
  await seite.click('.sim-ende-knoepfe .sim-start');
  await seite.waitForSelector('.sim-varianten');
  pruefe((await text(seite, '#fortschritt-text')).includes('1 von 3'), 'Fortschritt 1 von 3 nach Variante A');

  /* ---------- B: „nicht erlaubt“ ---------- */
  await variante(seite, 'B');
  pruefe((await wert(seite, 'hf')) === '–', 'B: Werte erst nach dem Messen sichtbar');
  await aktion(seite, 'b_adrenalin');
  pruefe(!!(await seite.$('.sim-rueck-karte.bew-verboten')), 'B: Adrenalin ohne Anordnung → „nicht erlaubt“');
  pruefe((await text(seite, '.sim-kuerzel')).includes('✗'), 'B: Kürzel ✗ angezeigt');
  await aktion(seite, 'b_toilette');
  pruefe((await text(seite, '.sim-beobachtung')).includes('bewusstlos'), 'B: Toilettengang → Kollaps, bewusstlos');
  await zurUebersicht(seite);

  /* ---------- B: idealer Ablauf ---------- */
  await variante(seite, 'B');
  await aktion(seite, 'b_hilfe');
  await aktion(seite, 'b_beine');
  await aktion(seite, 'b_messen');
  pruefe((await wert(seite, 'hf')) !== '–' && (await text(seite, '.sim-monitor-fuss')).includes('gemessen um'), 'B: Werte nach dem Messen mit Uhrzeit');
  for (const id of ['b_plan', 'b_doku', 'b_messen']) await aktion(seite, id);
  pruefe(await bisEnde(seite, 'b_warten'), 'B: Notärztin trifft ein → Nachbesprechung');
  const checkB = await seite.$$eval('.sim-checkliste li', (l) => l.map((x) => x.className));
  pruefe(checkB.every((c) => c.includes('check-ja')), 'B: Checkliste vollständig erledigt', checkB);
  await seite.click('.sim-ende-knoepfe .sim-start');
  await seite.waitForSelector('.sim-varianten');

  /* ---------- C: Bewusstlosigkeit ohne Adrenalin ---------- */
  await variante(seite, 'C');
  await aktion(seite, 'c_hilfe');
  await aktion(seite, 'c_warten');
  await aktion(seite, 'c_warten');
  pruefe((await text(seite, '.sim-beobachtung')).includes('bewusstlos'), 'C: ohne Adrenalin nach 2 Minuten bewusstlos');
  pruefe(!!(await seite.$('.sim-ereignis')), 'C: Ereignis wird gemeldet');
  await aktion(seite, 'c_seite');
  pruefe(!!(await seite.$('.sim-rueck-karte.bew-gut')), 'C: stabile Seitenlage bei Bewusstlosigkeit → „sinnvoll“');
  await aktion(seite, 'c_autoinjektor');
  await aktion(seite, 'c_warten');
  await aktion(seite, 'c_warten');
  pruefe(!(await text(seite, '.sim-beobachtung')).includes('bewusstlos –'), 'C: nach Adrenalin wieder ansprechbar', await text(seite, '.sim-beobachtung'));
  await zurUebersicht(seite);

  /* ---------- C: idealer Ablauf ---------- */
  await variante(seite, 'C');
  for (const id of ['c_hilfe', 'c_autoinjektor', 'c_stachel', 'c_messen', 'c_doku']) await aktion(seite, id);
  pruefe(await bisEnde(seite, 'c_warten'), 'C: Notarzt trifft ein → Nachbesprechung');
  const checkC = await seite.$$eval('.sim-checkliste li', (l) => l.map((x) => x.className));
  pruefe(checkC.every((c) => c.includes('check-ja') || c.includes('check-entfaellt')) && checkC.some((c) => c.includes('check-entfaellt')), 'C: Checkliste erledigt, Seitenlage entfällt', checkC);
  await seite.click('.sim-ende-knoepfe .sim-start');
  await seite.waitForSelector('.sim-varianten');

  /* ---------- Merksatz ---------- */
  pruefe((await text(seite, '#fortschritt-text')).includes('3 von 3'), 'Fortschritt 3 von 3', await text(seite, '#fortschritt-text'));
  pruefe(!!(await seite.$('.merksatz')), 'Merksatz AA4 erscheint nach drei Varianten');
  pruefe((await text(seite, '.merksatz-text')).includes('Adrenalin'), 'Merksatz enthält „Adrenalin“');
  await seite.screenshot({ path: path.join(ERGEBNISSE, 'simulation_merksatz.png'), fullPage: true });

  /* ---------- Neuladen ---------- */
  await seite.reload();
  await seite.waitForSelector('.sim-varianten');
  pruefe((await text(seite, '#fortschritt-text')).includes('3 von 3'), 'Neuladen: Stand bleibt erhalten');

  /* ---------- Durchklicken-Schutz ---------- */
  await variante(seite, 'B');
  for (const id of ['b_adrenalin', 'b_antihist', 'b_hausarzt', 'b_hilfe']) await aktion(seite, id);
  await bisEnde(seite, 'b_warten');
  pruefe(!!(await seite.$('.sim-nachbesprechung .durchklicken')), 'Durchklicken-Schutz bei ≥ 3 gefährlichen/nicht erlaubten Handlungen');

  pruefe(protokoll.konsole.length === 0, 'keine Konsolenfehler', protokoll.konsole);
  pruefe(protokoll.extern.length === 0, 'keine Anfragen an fremde Adressen', protokoll.extern);

  await browser.close();
  server.close();
  const ok = ergebnis();
  fs.writeFileSync(path.join(ERGEBNISSE, 'simulation.txt'), `Simulationstest ${new Date().toISOString()} – ${ok ? 'bestanden' : 'FEHLER'} (${echteInhalte ? 'echte inhalte.js' : 'Ersatz-inhalte.js'})\n`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });

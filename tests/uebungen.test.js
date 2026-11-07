/* Test: Übungen von Woche 2 in Handygröße (390 × 844) durchspielen – ohne Worker.
 * Start (im Ordner tests/): node uebungen.test.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium, serverStarten, pruefe, ergebnis, MOBIL, beobachten } = require('./hilfen');

const ORDNER = path.join(__dirname, 'ergebnisse');
fs.mkdirSync(ORDNER, { recursive: true });

(async () => {
  const { server, basis } = await serverStarten();
  const browser = await chromium.launch();
  const kontext = await browser.newContext({ ...MOBIL, deviceScaleFactor: 1 });
  const protokoll = { konsole: [], extern: [] };
  const INHALTE = await (async () => {
    const s = await kontext.newPage();
    await s.goto(basis + 'index.html');
    const i = await s.evaluate(() => window.INHALTE);
    await s.close();
    return i;
  })();

  /* ---------- Startseite ---------- */
  console.log('Startseite');
  let s = await kontext.newPage();
  beobachten(s, protokoll, 'index');
  await s.goto(basis + 'index.html');
  pruefe((await s.$$('a')).length === 0, 'Startseite ohne Links (nur über QR-Codes zu den Übungen)');
  const seiten = ['w2-markieren.html?fall=a', 'w2-detektiv.html', 'w2-lagerung.html', 'w2-raster.html', 'w2-transfer.html'];
  for (const l of seiten) {
    const r = await s.request.get(basis + l);
    pruefe(r.status() === 200, `Seite erreichbar: ${l}`);
  }
  await s.close();

  /* ---------- Ohne Parameter aus dem QR-Code: keine Auswahl ---------- */
  console.log('Aufruf ohne QR-Parameter');
  s = await kontext.newPage();
  beobachten(s, protokoll, 'ohne-parameter');
  await s.goto(basis + 'w2-markieren.html');
  pruefe((await s.$$('#uebung button')).length === 0 && (await s.textContent('#uebung')).includes(INHALTE.markieren.ohneQr), 'Markieren ohne ?fall: nur Hinweis, keine Fallauswahl');
  await s.close();

  /* ---------- AA1 Markieren ---------- */
  for (const fall of ['a', 'b', 'c']) {
    console.log(`AA1 Markieren – Fall ${fall}`);
    s = await kontext.newPage();
    beobachten(s, protokoll, 'markieren-' + fall);
    await s.goto(basis + `w2-markieren.html?fall=${fall}`);
    const teile = INHALTE.markieren.faelle[fall].teile.filter((t) => typeof t === 'object');
    const knoepfe = await s.$$('.markierbar');
    pruefe(knoepfe.length === teile.length, `${teile.length} antippbare Stellen`);
    const ablenker = teile.filter((t) => !t.k).length;
    pruefe(ablenker === 3, `Fall ${fall}: ${ablenker} Sätze, die nicht dazugehören (3 Ablenker)`);
    // Raten: alles antippen → Hinweis, alle Markierungen weg, nichts verraten
    if (fall === 'a') {
      for (const k of knoepfe) await k.click();
      await s.click('button:has-text(\"' + INHALTE.markieren.pruefen + '\")');
      pruefe((await s.textContent('#uebung')).includes(INHALTE.markieren.ratenTitel), 'alles angetippt → „Bitte nicht raten!“');
      pruefe((await s.$$('.markierbar.gewaehlt')).length === 0 && (await s.$$('.markierbar.ok, .markierbar.falsch, .markierbar.fehlt')).length === 0, 'Markierungen gelöscht, keine Lösung verraten');
    }
    // erst eine falsche + eine richtige Stelle, prüfen
    const iFalsch = teile.findIndex((t) => !t.k);
    const iRichtig = teile.findIndex((t) => t.k === 'ursache' || t.k === 'begleit');
    await knoepfe[iFalsch].click();
    await knoepfe[iRichtig].click();
    await s.click('button:has-text(\"' + INHALTE.markieren.pruefen + '\")');
    pruefe(await s.$('.markierbar.falsch') !== null, 'falsche Markierung wird grau durchgestrichen');
    pruefe(await s.$('.markierbar.fehlt') !== null, 'übersehene Stellen werden orange markiert');
    pruefe((await s.textContent('#uebung')).includes('noch kein Zeichen des Kreislaufs'), 'Hinweis „kein Kreislaufzeichen“');
    // korrigieren: falsche weg, alle richtigen an
    await knoepfe[iFalsch].click();
    for (let i = 0; i < teile.length; i++) if (teile[i].k && i !== iRichtig) await knoepfe[i].click();
    await s.click('button:has-text(\"' + INHALTE.markieren.pruefen + '\")');
    await s.waitForSelector('.merksatz');
    pruefe((await s.textContent('.merksatz')).includes('Kreislaufs'), 'Merksatz AA1 erscheint');
    if (fall === 'a') await s.screenshot({ path: path.join(ORDNER, 'markieren_fertig.png'), fullPage: true });
    await s.close();
  }

  /* ---------- AA2 Detektiv ---------- */
  console.log('AA2 Detektiv');
  s = await kontext.newPage();
  beobachten(s, protokoll, 'detektiv');
  await s.goto(basis + 'w2-detektiv.html');
  const D = INHALTE.detektiv;
  const pruefenD = () => s.click('button:has-text(\"' + D.pruefen + '\")');
  const text = () => s.textContent('#uebung');
  for (let n = 0; n < D.faelle.length; n++) {
    const f = D.faelle[n];
    const formText = D.formen.find((x) => x.kuerzel === f.form).text;
    const falschForm = D.formen.find((x) => x.kuerzel !== f.form).text;
    const teile = f.teile.filter((t) => typeof t === 'object');
    const belege = teile.map((t, i) => (t.b === 'beleg' ? i : -1)).filter((i) => i >= 0);
    const iSchock = teile.findIndex((t) => t.b === 'schock');
    const btn = await s.$$('.markierbar');
    if (n === 0) {
      pruefe(!(await btn[belege[0]].isDisabled()), 'Befunde sind sofort antippbar (vor der Schockform)');
      await pruefenD();
      pruefe((await text()).includes(D.auswahlFehlt), 'ohne Auswahl: Hinweis statt Prüfung');
      await btn[iSchock].click(); await btn[belege[0]].click();
      await s.click(`.antwort:has-text("${falschForm}")`);
      await pruefenD();
      pruefe((await text()).includes(D.zuSchnell), 'zu schnell geprüft: Hinweis, kein Versuch verbraucht');
      await s.goto(basis + 'w2-detektiv.html?lesezeit=0');   // Stand bleibt im Tab erhalten
      await pruefenD();
      pruefe((await text()).includes(f.tipp) && (await text()).includes(D.belegSchock), '1. Versuch falsch: Tipp zur Form und Hinweis „zeigt Schock, aber nicht die Form“');
      pruefe((await text()).includes(D.zweiterVersuch), 'noch ein Versuch');
      const btn2 = await s.$$('.markierbar');
      await btn2[belege[1]].click();
      await s.click(`.antwort:has-text("${formText}")`);
      await pruefenD();
      pruefe((await text()).includes(D.belegRichtig), 'Fall 1: im 2. Versuch richtig');
    } else if (n === 2) {
      // 1. Versuch: falsche Form, ein Beleg + ein Schockzeichen
      await s.click(`.antwort:has-text("${falschForm}")`);
      await btn[belege[0]].click(); await btn[iSchock].click();
      await pruefenD();
      pruefe((await text()).includes(D.zweiterVersuch), 'Fall 3: 1. Versuch falsch');
      // 2. Versuch: wieder falsche Form, dazu ein Satz, der nicht zum Notfall gehört
      const b3 = await s.$$('.markierbar');
      const frei = teile.findIndex((t) => !t.b);
      await b3[frei].click();
      await s.click(`.antwort:has-text("${falschForm}")`);
      await pruefenD();
      pruefe((await text()).includes(D.loesungGezeigt), 'Fall 3: nach 2 falschen Versuchen kommt die Lösung');
      pruefe((await s.$$('.markierbar.ok')).length >= 2, 'Fall 3: die passenden Befunde werden gezeigt');
    } else {
      // Reihenfolge egal: erst die Befunde, dann die Form
      for (const i of belege.slice(0, 2)) await btn[i].click();
      await s.click(`.antwort:has-text("${formText}")`);
      await pruefenD();
      pruefe((await text()).includes(D.belegRichtig), `Fall ${n + 1}: richtig belegt`);
    }
    await s.click('button:has-text(\"' + INHALTE.allgemein.weiter + '\")');
  }
  // Fall 1 und 3 nicht beim ersten Versuch → zu wenige → „Nicht einfach durchklicken“
  await s.waitForSelector('.durchklicken');
  pruefe((await text()).includes(INHALTE.allgemein.durchklickenTitel) && !(await text()).includes(D.geschafftTitel), `nur 2 von ${D.faelle.length} beim ersten Versuch → „Nicht einfach durchklicken“`);
  pruefe(await s.$('.monitorvergleich') === null && await s.$('.merksatz') === null, 'kein Patientenvergleich und kein Merksatz AA2 mehr');
  await s.click('button:has-text("' + INHALTE.allgemein.durchklickenKnopf + '")');
  for (const f of D.faelle) {
    const teile = f.teile.filter((t) => typeof t === 'object');
    const belege = teile.map((t, i) => (t.b === 'beleg' ? i : -1)).filter((i) => i >= 0);
    const btn = await s.$$('.markierbar');
    for (const i of belege.slice(0, 2)) await btn[i].click();
    await s.click(`.antwort:has-text("${D.formen.find((x) => x.kuerzel === f.form).text}")`);
    await pruefenD();
    await s.click('button:has-text(\"' + INHALTE.allgemein.weiter + '\")');
  }
  await s.waitForSelector('.detektiv-ende');
  pruefe((await text()).includes(D.geschafftTitel) && (await text()).includes(`${D.faelle.length} von ${D.faelle.length}`), 'neu gestartet, alle beim ersten Versuch → „Geschafft!“');
  await s.screenshot({ path: path.join(ORDNER, 'detektiv_fertig.png'), fullPage: true });
  await s.close();

  /* ---------- AA3 Lagerung ---------- */
  console.log('AA3 Lagerungs-Quiz');
  s = await kontext.newPage();
  beobachten(s, protokoll, 'lagerung');
  await s.goto(basis + 'w2-lagerung.html');
  const L = INHALTE.lagerung;
  for (let n = 0; n < L.karten.length; n++) {
    const k = L.karten[n];
    if (n === 0) {
      pruefe(await s.$('.timer') === null && !/Sekunden|Rollen tauschen/.test(await s.textContent('#uebung')), 'Quiz allein: kein Timer, kein Rollentausch');
      pruefe(!(await s.textContent('#uebung')).includes('Etwas anderes') && (await s.textContent('#uebung')).includes('Reanimation beginnen'), 'Auswahl wie im Entscheidungsweg (Reanimation statt „Etwas anderes“)');
      await s.click('.lager-bilder summary');
      pruefe(await s.$$eval('.lager-bild img', (b) => b.length === 4 && b.every((x) => x.complete && x.naturalWidth > 0)), 'Hilfe: die vier Lagerungen mit Bildern am Handy');
      await s.screenshot({ path: path.join(ORDNER, 'lagerung_karte.png'), fullPage: true });
    }
    const opt = L.optionen.find((o) => o.kuerzel === k.richtig).text;
    await s.click(`.antwort:has-text("${opt}")`);
    await s.click('button:has-text(\"' + L.aufdecken + '\")');
    pruefe((await s.textContent('#uebung')).includes(k.warum), `Karte ${n + 1}: Begründung sichtbar`);
    await s.click('button:has-text(\"' + L.naechste + '\")');
  }
  await s.waitForSelector('.merksatz');
  pruefe((await s.textContent('.merksatz')).includes('Leitsymptom'), 'Merksatz AA3 erscheint');
  await s.close();

  /* ---------- AA6 Raster ---------- */
  console.log('AA5 Bewertungsraster');
  s = await kontext.newPage();
  beobachten(s, protokoll, 'raster');
  await s.goto(basis + 'w2-raster.html');
  const kr = await s.$$('.kriterium input');
  for (const c of kr.slice(0, 9)) await c.check();      // alle 9 Sofortmaßnahmen → max 5
  pruefe((await s.textContent('.gesamtpunkte')).includes('5 von 7'), 'Obergrenze 5 Punkte bei Sofortmaßnahmen', await s.textContent('.gesamtpunkte'));
  await kr[9].check();   // Begründung
  pruefe((await s.textContent('.gesamtpunkte')).includes('6 von 7'), 'Begründung zählt');
  await s.check('.fehlerbox .kriterium:has-text("Schocklage") input');
  pruefe((await s.textContent('.gesamtpunkte')).includes('5 von 7'), 'Fehler „Schocklage“ sperrt Lagerung und Begründung', await s.textContent('.gesamtpunkte'));
  pruefe(!(await s.textContent('#uebung')).includes('6.3') && (await s.textContent('#uebung')).includes('5.2 Kennzeichnung'), 'Raster nur noch 5.1 und 5.2 (ohne Dokumentationsaufgabe)');
  await s.screenshot({ path: path.join(ORDNER, 'raster.png'), fullPage: true });
  await s.close();

  /* ---------- Hausaufgabe ---------- */
  console.log('Hausaufgabe Selbstkontrolle');
  s = await kontext.newPage();
  beobachten(s, protokoll, 'transfer');
  await s.goto(basis + 'w2-transfer.html');
  pruefe(await s.$('.muster') === null, 'Musterlösung zunächst verborgen');
  const knopfText = INHALTE.transfer.erstSchreiben;
  for (let i = 0; i < INHALTE.transfer.aufgaben.length; i++) await s.click(`button:has-text("${knopfText}") >> nth=0`);
  pruefe((await s.$$('.muster')).length === 3, 'alle Musterlösungen aufgedeckt (1.1, 2.1, 2.2)');
  for (const c of await s.$$('.kriterium input')) await c.check();
  pruefe((await s.textContent('.gesamtpunkte')).includes('13 von 13'), 'volle Punktzahl 13', await s.textContent('.gesamtpunkte'));
  // 1.1 wie im KA-Erwartungshorizont: ohne Kreislaufzeichen höchstens 3 von 4 Punkten
  await s.uncheck('.kriterium:has-text("Kreislauf: Puls") input');
  pruefe((await s.textContent('.gesamtpunkte')).includes('12 von 13'), '1.1 ohne Kreislaufzeichen: höchstens 3 Punkte', await s.textContent('.gesamtpunkte'));
  pruefe((await s.textContent('#uebung')).includes('Ohne Kreislaufzeichen höchstens 3 Punkte'), 'Hinweis zur Kreislauf-Pflicht sichtbar');
  await s.close();

  pruefe(protokoll.konsole.length === 0, 'keine Fehler in der Konsole', protokoll.konsole);
  pruefe(protokoll.extern.length === 0, 'keine Anfragen an fremde Adressen', protokoll.extern);

  await browser.close();
  server.close();
  const ok = ergebnis();
  fs.writeFileSync(path.join(ORDNER, 'uebungen.txt'), `Stand: ${new Date().toISOString()}\nErgebnis: ${ok ? 'bestanden' : 'FEHLER'}\n`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });

/* Woche 4 – automatische Tests (unabhängig von den Tests der Wochen 1 und 2).
 *   1. Inhalte und Arbeitsblatt: Messkarten, Szenen, verbotene Wörter, Lösungen nur in der LV, 6 Seiten, QR-Codes
 *   2. Woche 2 unverändert: Geändert sind nur Dateien der Woche 4
 *   3. Handy-Übungen in Handygröße (390 × 844), ohne Worker: durchspielen, gewinnen und verlieren
 *   4. Lehreransicht mit lokalem Worker (wrangler dev --config worker-w4/wrangler.jsonc): Raum, Meldung, Tabelle
 * Start (im Ordner tests/): node w4.test.js   ·   Voraussetzung: im Ordner worker/ einmal „npm install“ (für wrangler) */
'use strict';
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, execSync } = require('child_process');
const { chromium } = require('playwright');

const WURZEL = path.resolve(__dirname, '..');
const DOCS = path.join(WURZEL, 'docs');
const ERG = path.join(__dirname, 'ergebnisse');
const W4 = require('../docs/w4/inhalte.js');
const MOBIL = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true };

let zahl = 0, fehler = 0;
function pruefe(ok, text, details) {
  zahl++;
  if (ok) console.log('  ✓ ' + text);
  else { fehler++; console.log('  ✗ ' + text + (details !== undefined ? '  → ' + JSON.stringify(details) : '')); }
}

/* ---------- Hilfen ---------- */
const TYPEN = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };
function serverStarten(workerUrl) {
  return new Promise((ok) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const datei = path.join(DOCS, p);
      if (!datei.startsWith(DOCS) || !fs.existsSync(datei) || fs.statSync(datei).isDirectory()) { res.writeHead(404); res.end('nicht gefunden'); return; }
      res.writeHead(200, { 'Content-Type': TYPEN[path.extname(datei)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      if (p === '/w4/config.js') { res.end(fs.readFileSync(datei, 'utf8').replace(/WORKER_URL: '[^']*'/, `WORKER_URL: '${workerUrl}'`)); return; }
      fs.createReadStream(datei).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => ok({ server, basis: `http://127.0.0.1:${server.address().port}/` }));
  });
}
function workerStarten(port) {
  const WRANGLER = path.join(WURZEL, 'worker', 'node_modules', '.bin', 'wrangler');
  const zustand = fs.mkdtempSync(path.join(os.tmpdir(), 'kb1-w4-wrangler-'));
  const kind = spawn(WRANGLER, ['dev', '--config', path.join(WURZEL, 'worker-w4', 'wrangler.jsonc'), '--port', String(port), '--ip', '127.0.0.1', '--persist-to', zustand, '--show-interactive-dev-session=false'],
    { cwd: WURZEL, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: '1' } });
  let log = ''; kind.stdout.on('data', (d) => { log += d; }); kind.stderr.on('data', (d) => { log += d; });
  const url = `http://127.0.0.1:${port}`;
  return new Promise((ok, nein) => {
    const start = Date.now();
    (function warten() {
      fetch(url + '/').then((r) => (r.ok ? ok({ url, beenden: () => kind.kill('SIGTERM') }) : setTimeout(warten, 300)))
        .catch(() => { if (Date.now() - start > 60000) { kind.kill('SIGTERM'); nein(new Error('Worker startet nicht:\n' + log)); } else setTimeout(warten, 300); });
    })();
  });
}
function beobachten(seite, protokoll, name, erlaubt = []) {
  seite.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) protokoll.konsole.push(`[${name}] ${m.text()}`); });
  seite.on('pageerror', (e) => protokoll.konsole.push(`[${name}] ${e.message}`));
  seite.on('request', (r) => { const u = r.url(); if (!u.startsWith('http://127.0.0.1') && !u.startsWith('data:') && !erlaubt.some((e) => u.startsWith(e))) protokoll.extern.push(u); });
}
const docxText = (datei) => execSync(`unzip -p "${datei}" word/document.xml`, { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
const nurText = (xml) => xml.replace(/<w:tab\/>/g, ' ').replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '');

(async () => {
  /* ===================== 1. Inhalte und Arbeitsblatt ===================== */
  console.log('\n== Inhalte (docs/w4/inhalte.js)');
  const V = W4.verlauf;
  pruefe(V.karten.length === 6 && V.karten.map((k) => k.nr).join() === '1,2,3,4,5,6', 'Live-Verlauf: 6 Messkarten');
  pruefe(V.karten.filter((k) => k.richtig === 'rot').length === 1 && V.karten[5].richtig === 'rot' && V.karten[5].wer === 'finn', 'genau ein Notfall: Finn, Karte 6');
  pruefe(V.karten.some((k) => k.richtig === 'gruen' && k.wer === 'finn') && V.karten.some((k) => k.richtig === 'gelb' && k.wer === 'finn'), 'Finn auch mit 🟢 (zu früh) und 🟡 (Trend) – Aufstehen ist nicht immer richtig');
  pruefe(V.karten.some((k) => k.wer === 'jana' && k.richtig === 'gruen' && k.rr[0] < 100), 'Falle Einzelwert: Jana mit RR < 100 ist 🟢');
  pruefe(V.karten[5].puls / V.karten[5].rr[0] < 1, 'Karte 6: Notfall trotz Schockindex unter 1');
  const S = W4.speisesaal;
  pruefe(S.szenen.length === 6 && S.szenen.filter((z) => z.schwer).length === 3, 'Speisesaal: 6 Szenen, 3 schwere');
  pruefe(S.szenen[0].leitfall && S.szenen[0].schwer === false && S.szenen[0].richtig === 'husten', 'Szene 1 = Frau Maler wie im Leitfall: leichte Verlegung, husten lassen');
  pruefe(S.szenen.every((z) => z.wahl.length === 4 && z.wahl.includes(z.richtig) && z.wahl.every((o) => S.optionen[o] && z.rueckmeldung[o])), 'jede Szene: 4 Antworten mit Rückmeldung, richtige enthalten');
  pruefe(S.szenen.filter((z) => z.schwer).every((z) => !z.wahl.includes('ruecken') && z.richtig === 'hilfe'), 'schwere Verlegung: „auf den Rücken klopfen“ nie als (falsche) Wahl, richtig ist „Hilfe rufen“ (Leitlinien, Woche 5)');
  pruefe(S.szenen.filter((z) => !z.schwer).every((z) => z.richtig === 'husten' && z.wahl.includes('hilfe')), 'leichte Verlegung: „Hilfe rufen“ als Fehlalarm-Falle');
  const T4 = require('../werkzeuge/ab_w4_texte.js');
  const speicher = T4.B3.aa1.wortspeicher.replace(/^Wortspeicher: /, '').split(' · ');
  const fallText = T4.B1.fall.join(' ');
  const stelle = T4.B1.aa1.loesung.map((spalte) => Math.min(...spalte.map(([, wort]) => fallText.indexOf(wort))));
  const rang = stelle.map((x) => stelle.filter((y) => y < x).length);
  pruefe(stelle.every((x) => x >= 0) && rang.every((r, i) => r !== i), 'Blatt 1, AA1: Tabellenspalten nicht in der Reihenfolge des Falls', T4.B1.aa1.spalten.join(' | '));
  const mess = T4.B2.aa1.messungen.map((m) => (m.karte ? W4.verlauf.karten.find((k) => k.nr === m.karte) : m));
  const stufe = { gruen: 0, gelb: 1, rot: 2 };
  pruefe(mess.length === 5 && mess[0].wer === 'kurz' && mess[0].richtig === 'gelb' && mess[3].richtig === 'gruen' && mess[4].wer === 'finn' && mess[4].richtig === 'rot' && mess.some((m, i) => i && stufe[m.richtig] < stufe[mess[i - 1].richtig]) && mess.every((m, i) => !i || m.zeit > mess[i - 1].zeit), 'Blatt 2, AA1 analog: Dringlichkeit steigt nicht wie eine Treppe (Herr Kurz 🟡 zuerst, 🟢 direkt vor Finns Notfall), Zeiten aufsteigend');
  const LT = W4.verlegung.absaetze.join(' ');
  const ATB = require('../docs/w4/atemwege_bild.js');
  const lueckenWoerter = W4.atemwegeText.absaetze.flatMap((a) => (a.match(/\*\*[^*]+\*\*/g) || []).map((w) => w.slice(2, -2)));
  const tippSvg = ATB.svg({ tippen: true });
  pruefe(W4.anatomie.teile.map((t) => t.id).join() === ATB.TEILE.join() && ATB.TEILE.every((id) => tippSvg.includes(`data-teil="${id}"`)) && !ATB.svg({ nummern: true }).includes('data-teil'), 'Wo ist was?: sechs antippbare Teile im Bild (nur auf dem Handy)');
  pruefe(lueckenWoerter.length === 8 && lueckenWoerter.slice().sort((a, b) => a.localeCompare(b, 'de')).join() !== lueckenWoerter.join(), 'Lückentext Blatt 3: acht Fachwörter; am Handy alphabetisch, nicht in Textreihenfolge');
  pruefe(W4.verlegung.absaetze.length === 4 && LT.indexOf('um Hilfe') < LT.indexOf('an den Hals') && LT.indexOf('an den Hals') < LT.indexOf('Husten wird schwach') && LT.indexOf('**schwere Verlegung**') < LT.indexOf('**leichten Verlegung**') && /Parkinson/.test(W4.verlegung.absaetze[0]), 'Blatt 3, Lesetext: nicht in Tabellenreihenfolge (schwer zuerst, Handeln vor den Zeichen), Absatz 1 als Ablenker');
  pruefe(T4.B3.aufgaben.length === 1 && T4.B3.aufgaben[0].nr === '3.1' && T4.B3.aufgaben[0].zeilen >= 8 && T4.B3.schnelle.aufgaben.map((a) => a.nr).join() === '3.2,3.3,3.4', 'Blatt 3: AA3 nur 3.1 (mind. 8 Zeilen), 3.2–3.4 „Für die Schnellen“');
  pruefe(speicher.length === 6 && speicher.every((w) => T4.B3.aa1.begriffe.includes(w)) && speicher.every((w, i) => w !== T4.B3.aa1.begriffe[i]), 'Blatt 3: Wortspeicher enthält alle Begriffe, aber keinen an der Stelle seiner Nummer');
  pruefe(W4.rueckenmark.karten.length === 8 && W4.trend.reihen.length === 5 && W4.atemweg.karten.length === 6, 'Schon fertig?: 8 + 5 + 6 Karten');

  console.log('\n== Verbotene Wörter in Texten für die SuS');
  const VERBOTEN = /Klausur|Klassenarbeit|Examen|Prüfung|Woche [5-9]/i;
  for (const d of ['inhalte.js', 'w4.js', 'verlegung.js', 'verlegung.html', 'anatomie.js', 'anatomie.html', 'atemwege_bild.js', 'verlauf.js', 'speisesaal.js', 'rueckenmark.js', 'trend.js', 'atemweg.js', 'verlauf.html', 'speisesaal.html', 'rueckenmark.html', 'trend.html', 'atemweg.html']) {
    const m = fs.readFileSync(path.join(DOCS, 'w4', d), 'utf8').match(VERBOTEN);
    pruefe(!m, `docs/w4/${d}: kein „Klausur/Examen/Prüfung/spätere Woche“`, m && m[0]);
  }
  for (const fassung of ['analog', 'digital']) {
  console.log(`\n== Arbeitsblatt, ${fassung}e Fassung`);
  const SV = path.join(WURZEL, 'arbeitsblatt', `KB1_W4_Wirbelsaeule_Blutung_${fassung}_SV.docx`);
  const LV = path.join(WURZEL, 'arbeitsblatt', `KB1_W4_Wirbelsaeule_Blutung_${fassung}_LV_LSG.docx`);
  const svXml = docxText(SV), svText = nurText(svXml);
  const m = svText.match(VERBOTEN);
  pruefe(!m, 'Schülerversion: kein „Klausur/Examen/Prüfung/spätere Woche“', m && m[0]);
  pruefe(!/w:highlight/.test(svXml), 'Schülerversion: keine gelben Lösungen');
  pruefe(/w:highlight w:val="yellow"/.test(docxText(LV)), 'Lehrerversion: Lösungen gelb markiert');
  pruefe(['Wirbelsäulenverletzung: nicht bewegen', 'Innere Blutung: den Verlauf im Blick', 'Atemwege: wenn etwas im Hals stecken bleibt'].every((t) => svText.includes(t)), 'drei Blätter mit eigener Überschrift');
  const nummern = [...svText.matchAll(/\b(AA\d):/g)].map((x) => x[1]);
  pruefe(nummern.join() === 'AA1,AA2,AA3,AA4,AA1,AA2,AA1,AA2,AA3', 'Nummerierung beginnt auf jedem Blatt bei AA1', nummern.join());
  pruefe(/Begründen Sie, warum Herr Pfeiffer möglichst nicht bewegt werden soll, und beschreiben Sie eine Maßnahme dazu\./.test(svText), 'Blatt 1: Aufgabe nach Muster KA 5.3');
  pruefe(!/Er kann doch die Beine bewegen/.test(svText) && !/\n4\.2\n/.test(svText), 'Blatt 1: Aufgabe 4.2 (Beurteilen) gestrichen – AA4 nur 4.1');
  pruefe((T4.B1.aufgaben.find((x) => x.nr === '4.1') || {}).zeilen >= 8, 'Blatt 1: viel Schreibraum für 4.1 (mind. 8 Zeilen)');
  pruefe(/Unterscheiden Sie anhand der Situation eine leichte von einer schweren Atemwegsverlegung\./.test(svText), 'Blatt 3: Aufgabe nach Muster KA 4.1');
  pruefe(/Beim Frühstück verschluckte sie sich am Kaffee und hustete kräftig\. Ich ließ sie husten, und nach kurzer Zeit war alles wieder gut\./.test(svText), 'Leitfall wörtlich wie im Fallbeispiel');
  pruefe(!/Schockindex rechnen|Werte lesen und mit dem Vorwert vergleichen\. \*\*2/.test(svText) && !/Schockindex rechnen/.test(svText), 'Blatt 2, AA1: keine Schrittfolge mehr (kein „Schockindex rechnen“)');
  pruefe(!/Aufgaben mit Punkten/.test(svText) && !/\nPunkte\n/.test(svText) && !/(^|[^_])___ \/ \d/.test(svText), 'Schülerversion: keine Punkte bei den Aufgaben, kein „Aufgaben mit Punkten“');
  pruefe(/\n2 P\.\n/.test(nurText(docxText(LV))), 'Lehrerversion: Punkte bei den Aufgaben');
  pruefe(/So wäre es um 8 Uhr gewesen/.test(svText) && /Puls 124\/min · Blutdruck 102\/86 mmHg/.test(svText) && /Tragen Sie auch diese Werte in die Kurve ein/.test(svText), 'Blatt 2: Werte für 08:00 Uhr auf dem Blatt – die Kurve lässt sich vollständig ausfüllen');
  pruefe(!/Berücksichtigen Sie die Vorwerte/.test(svText), 'Blatt 2, 2.1: ohne Hinweis „Berücksichtigen Sie die Vorwerte“');
  pruefe(/Tragen Sie die Informationen in Stichworten in die Tabelle ein/.test(svText) && /Nicht alles im Text gehört in die Tabelle/.test(svText) && !/1–4 Fingern|sechs kurze Szenen spielen/.test(svText.slice(0, svText.lastIndexOf('Für die Schnellen'))), 'Blatt 3, AA2: Informationen aus einem Lesetext in die Tabelle');
  pruefe((svText.match(/^Merksatz$/gm) || []).length === 3 && !/Leichte Verlegung: kräftiger, wirksamer Husten/.test(svText), 'Blatt 3: kein Merksatz zu leicht/schwer (sonst würde nur abgeschrieben)');
  pruefe(/Für die Schnellen/.test(svText) && /Extrablatt/.test(svText.slice(svText.lastIndexOf('Für die Schnellen'))) && /3\.2 +Erklären Sie, warum Herr Roth/.test(svText) && /3\.3 +Eine Pflegehelferin sagt/.test(svText), 'Blatt 3: 3.2 und 3.3 „Für die Schnellen“ (Antworten auf ein Extrablatt)');
  pruefe(!/Rückenschläge|Oberbauchkompression/.test(svText), 'Schülerversion: kein Vorgehen bei schwerer Verlegung (Planung: Woche 5)');
  pruefe((svText.match(/Schon fertig\?/g) || []).length === 2 && (svText.match(/Für die Schnellen/g) || []).length === 1, 'Blatt 1 und 2 enden mit „Schon fertig?“, Blatt 3 mit „Für die Schnellen“');
  pruefe(/SpO₂ 98 %/.test(svText) && /Blutzucker 96 mg\/dl/.test(svText) && /trockene Schürfwunde/.test(svText) && /Kein Hinweis auf eine innere Blutung/.test(nurText(docxText(LV))), 'Blatt 2, 2.1: Ablenker im Fall (normale Werte, Schürfwunde) – nicht alles ist ein Hinweis');
  pruefe(/Parkinson-Krankheit; seine Hände zittern leicht, wie immer/.test(svText) && /Kein Merkmal einer Atemwegsverlegung/.test(nurText(docxText(LV))), 'Blatt 3, 3.1: Ablenker im Fall (Zittern, Brille, Tee, Lachen am Nachbartisch)');
  if (fassung === 'analog') {
    const x = svText.match(/Handy|Smartphone|QR|scann|Link:/i);
    pruefe(!x, 'analoge Fassung: kein Handy, kein QR-Code', x && x[0]);
    pruefe(/Kreuzen Sie bei jeder Messung an/.test(svText) && ['05:50 Uhr', '06:00 Uhr', '07:00 Uhr', '07:10 Uhr', '07:20 Uhr'].every((z, i, a) => svText.includes(z) && (!i || svText.indexOf(a[i - 1]) < svText.indexOf(z))) && !/sitzen bleiben|aufstehen 🔴|Messkarte/.test(svText), 'analoge Fassung, Blatt 2: Ankreuz-Aufgabe (5 Messungen, zeitlich geordnet) statt Messkarten und Aufstehen');
    const lvText = nurText(docxText(LV));
    pruefe(!/Anhang [AB]|Messkarten für den Live-Verlauf|Entscheidungsspiel nach/.test(lvText), 'analoge Lehrerversion: kein Anhang mehr (kein Messkarten-, kein Entscheidungsspiel-Anhang)');
    pruefe(/Kann die Person nicht mehr sprechen/.test(svText) && /3\.4 +Warum soll man einer Person, die kräftig hustet/.test(svText) && !/speisesaal/.test(svText), 'analoge Fassung: Lesetext auf dem Blatt; „Für die Schnellen“ mit 3.2–3.4, ohne Simulation');
    pruefe(/Wortspeicher:/.test(svText) && /Text lesen, Bild beschriften/.test(svText) && /in den Rachen\./.test(svText) && !/_{18}/.test(svText.slice(svText.indexOf('Atemwege und Ventilation'), svText.indexOf('Wortspeicher'))), 'analoge Fassung, Blatt 3 AA1: Infotext vollständig, Bild mit Wortspeicher');
  } else {
    const x = svText.match(/sitzen bleiben|Hand heben|aufstehen\b|Ohne Handy|liest .{0,30}vor|Fingern|Ihre Lehrkraft zeigt/i);
    pruefe(!x, 'digitale Fassung: keine analogen Alternativen genannt', x && x[0]);
    pruefe((svText.match(/Kein QR-Scanner\?/g) || []).length === 7 && /verlegung\.html/.test(svText) && /anatomie\.html/.test(svText) && !/Kann die Person nicht mehr sprechen/.test(svText), 'digitale Fassung: 7 QR-Kästen (Live-Verlauf, Wo ist was?, Lesetext, 2 × „Schon fertig?“, Atemweg-Check, Simulation); Lesetext nur am Handy');
    const info = svText.slice(svText.indexOf('Atemwege und Ventilation – Lückentext'), svText.indexOf('Merksatz', svText.indexOf('Atemwege und Ventilation – Lückentext')));
    const lvTextD = nurText(docxText(LV));
    pruefe(!/Wortspeicher/.test(svText) && (info.match(/_{18}/g) || []).length === 8 && !/in den Rachen|heißt Ventilation|In den Lungenbläschen|Hustenreflex/.test(info) && lueckenWoerter.every((w) => lvTextD.includes(w)), 'digitale Fassung, Blatt 3 AA1: Infotext als Lückentext (8 Lücken, Wörter nur in der Lehrerversion), kein Wortspeicher');
    pruefe(!/3\.4 /.test(svText), 'digitale Fassung: „Für die Schnellen“ ohne 3.4 (dafür Atemweg-Check)');
    pruefe(svText.lastIndexOf('Für die Schnellen') > svText.lastIndexOf('Schon fertig?') && /speisesaal\.html/.test(svText.slice(svText.lastIndexOf('Für die Schnellen'))), 'digitale Fassung: Simulation ganz unten auf Blatt 3 („Für die Schnellen“)');
  }
  const PDF = SV.replace(/\.docx$/, '.pdf');
  if (fs.existsSync(PDF) && fs.statSync(PDF).mtimeMs >= fs.statSync(SV).mtimeMs - 1000) {
    const seiten = Number((execSync(`pdfinfo "${PDF}"`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().match(/Pages:\s+(\d+)/) || [])[1]);
    const sollSeiten = fassung === 'analog' ? 7 : 6;
    pruefe(seiten === sollSeiten, `Schülerversion (PDF): ${sollSeiten} Seiten`, seiten);
    const seite = (n) => execSync(`pdftotext -f ${n} -l ${n} "${PDF}" -`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    pruefe(seite(1).includes('Wirbelsäulenverletzung: nicht bewegen') && seite(3).includes('Innere Blutung: den Verlauf') && seite(5).includes('Atemwege: wenn etwas im Hals'), 'jedes Blatt beginnt auf einer ungeraden Seite (1, 3, 5) – beidseitig kopierbar');
  } else console.log('  (PDF fehlt oder ist älter als die .docx – Seitenprüfung übersprungen)');
  const MK = SV.replace(/_SV\.docx$/, '_SV_markiert.docx');
  const mkXml = docxText(MK), mkText = nurText(mkXml);
  pruefe(/w:highlight w:val="yellow"/.test(mkXml) && /w:highlight w:val="magenta"/.test(mkXml) && /Ansichtsexemplar \(nicht austeilen\)/.test(mkText), 'Ansichtsexemplar: gelb (klausurrelevant) und pink (könnte weg) markiert, Legende vorhanden');
  pruefe(mkText.split('\n').filter((z) => !/^Ansichtsexemplar/.test(z)).join('\n') === svText, 'Ansichtsexemplar: gleicher Text wie die Schülerversion (nur Markierungen und Legende)');
  const MKPDF = MK.replace(/\.docx$/, '.pdf');
  if (fs.existsSync(MKPDF) && fs.statSync(MKPDF).mtimeMs >= fs.statSync(MK).mtimeMs - 1000) {
    const seiten = Number((execSync(`pdfinfo "${MKPDF}"`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().match(/Pages:\s+(\d+)/) || [])[1]);
    pruefe(seiten === (fassung === 'analog' ? 7 : 6), 'Ansichtsexemplar (PDF): gleiche Seitenzahl wie die Schülerversion', seiten);
  }
  }
  console.log('\n== QR-Codes');
  for (const n of ['verlauf', 'speisesaal', 'rueckenmark', 'trend', 'atemweg', 'verlegung', 'anatomie']) {
    const datei = path.join(WURZEL, 'qr', `qr_w4_${n}.png`);
    let text = null;
    try { text = execSync(`python3 -c "import zxingcpp,sys;from PIL import Image;print(zxingcpp.read_barcodes(Image.open(sys.argv[1]))[0].text)" "${datei}"`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch (e) { text = null; }
    if (text === null) pruefe(fs.existsSync(datei), `QR-Code vorhanden: qr_w4_${n}.png (Inhalt nicht geprüft – zxing-cpp fehlt)`);
    else pruefe(text === `${W4.basis}${n}.html` && fs.existsSync(path.join(DOCS, 'w4', n + '.html')), `QR-Code qr_w4_${n}.png → w4/${n}.html`, text);
  }

  /* ===================== 2. Woche 2 unverändert ===================== */
  console.log('\n== Woche 2 unverändert');
  let geaendert = [];
  try {
    execSync('git rev-parse --verify origin/main', { cwd: WURZEL, stdio: 'ignore' });
    geaendert = execSync('git diff --name-only origin/main', { cwd: WURZEL }).toString().split('\n')
      .concat(execSync('git ls-files --others --exclude-standard', { cwd: WURZEL }).toString().split('\n')).filter(Boolean);
    const erlaubt = /^(docs\/w4\/|worker-w4\/|wrangler-w4\.jsonc$|werkzeuge\/(ab_w4|ab_w4_texte|w4_bilder|qr_w4)\.js$|werkzeuge\/bilder\/w4_|qr\/qr_w4_|arbeitsblatt\/KB1_W4_|tests\/w4\.test\.js$|tests\/ergebnisse\/w4_|README_W4\.md$)/;
    const fremd = geaendert.filter((d) => !erlaubt.test(d));
    pruefe(fremd.length === 0, `nur Dateien der Woche 4 geändert (${geaendert.length} Dateien)`, fremd);
  } catch (e) { console.log('  (origin/main nicht verfügbar – übersprungen)'); }

  /* ===================== 3. Handy-Übungen ohne Worker ===================== */
  const P = { konsole: [], extern: [] };
  const browser = await chromium.launch();
  const { server, basis } = await serverStarten('');
  fs.mkdirSync(ERG, { recursive: true });
  const neueSeite = async (name, o = {}) => { const ctx = await browser.newContext(MOBIL); const s = await ctx.newPage(); beobachten(s, P, name, o.erlaubt || []); if (o.uhr) await s.clock.install(); return s; };
  const start = (s) => s.locator('button.knopf').first().click();

  console.log('\n== Live-Verlauf am Handy (verlauf.html)');
  let s = await neueSeite('verlauf');
  await s.goto(basis + 'w4/verlauf.html');
  await start(s);
  for (const k of V.karten) {
    await s.locator(`.ampel button[data-stufe="${k.richtig}"]`).click();
    if (k.nr === 1) await s.screenshot({ path: path.join(ERG, 'w4_verlauf_karte.png') });
    await s.locator('button.knopf').last().click();
  }
  let text = await s.locator('main').innerText();
  pruefe(/Gewonnen!/.test(text) && /Punkte: 6 \/ 6/.test(text) && /Finn ist gerettet/.test(text), 'alles richtig → „Gewonnen!“, 6/6, Finn gerettet');
  await s.screenshot({ path: path.join(ERG, 'w4_verlauf_ergebnis.png'), fullPage: true });
  await s.locator('button.knopf.zweit').click();   // „Noch einmal“ beginnt direkt mit Karte 1
  for (let i = 0; i < 6; i++) { await s.locator('.ampel button[data-stufe="rot"]').click(); await s.locator('button.knopf').last().click(); }
  text = await s.locator('main').innerText();
  pruefe(/Nicht gewonnen/.test(text) && /Fehlalarme: 5/.test(text), 'immer aufstehen (🔴) → „Nicht gewonnen“, 5 Fehlalarme');
  await s.context().close();
  s = await neueSeite('verlauf-nie', { uhr: true });
  await s.goto(basis + 'w4/verlauf.html');
  await start(s);
  await s.clock.runFor((V.sekunden + 1) * 1000);
  pruefe(/Zeit abgelaufen/.test(await s.locator('main').innerText()), 'Zeit abgelaufen → zählt wie 🟢');
  for (let i = 0; i < 6; i++) { if (i) await s.clock.runFor((V.sekunden + 1) * 1000); await s.locator('button.knopf').last().click(); }
  text = await s.locator('main').innerText();
  pruefe(/Nicht gewonnen/.test(text) && /So wäre es um 8 Uhr gewesen/.test(text) && /Finn rechtzeitig gemeldet: nein/.test(text), 'nie melden → Finn übersehen, Auflösungskarte 08:00');
  await s.context().close();

  console.log('\n== Simulation Speisesaal (speisesaal.html)');
  s = await neueSeite('speisesaal');
  await s.goto(basis + 'w4/speisesaal.html');
  await start(s);
  const reihe = [];
  for (let i = 0; i < 6; i++) {
    const id = await s.locator('[data-szene]').getAttribute('data-szene');
    reihe.push(id);
    const z = S.szenen.find((x) => x.id === id);
    if (i === 2) await s.screenshot({ path: path.join(ERG, 'w4_speisesaal_szene.png') });
    await s.locator(`button.wahl[data-opt="${z.richtig}"]`).click();
    await s.locator('button.knopf').last().click();
  }
  text = await s.locator('main').innerText();
  pruefe(reihe.slice(0, 3).join() === 'maler,roth1,roth2', 'Szenen 1–3 fest: Frau Maler, Herr Roth leicht, Herr Roth schwer', reihe);
  pruefe(/Bestanden!/.test(text) && /Punkte: 12 \/ 12/.test(text), 'alles richtig → „Bestanden!“, 12/12');
  await s.screenshot({ path: path.join(ERG, 'w4_speisesaal_ergebnis.png'), fullPage: true });
  await s.context().close();
  s = await neueSeite('speisesaal-zoegern', { uhr: true });
  await s.goto(basis + 'w4/speisesaal.html');
  await start(s);
  await s.locator('button.wahl[data-opt="hilfe"]').click();
  pruefe(/Fehlalarm/.test(await s.locator('main').innerText()), 'Frau Maler: Notruf bei kräftigem Husten = Fehlalarm');
  await s.locator('button.wahl[data-opt="husten"]').click();
  await s.locator('button.knopf').last().click();
  await s.locator('button.wahl[data-opt="husten"]').click();
  await s.locator('button.knopf').last().click();
  const spo2Vorher = Number(await s.locator('.spo2').innerText());
  await s.clock.runFor(10000);
  const spo2Nachher = Number(await s.locator('.spo2').innerText());
  pruefe(spo2Nachher < spo2Vorher, 'schwere Verlegung: Sättigung sinkt beim Zögern', [spo2Vorher, spo2Nachher]);
  await s.clock.runFor(40000);
  text = await s.locator('main').innerText();
  pruefe(/bewusstlos/.test(text), 'zu lange gezögert → bewusstlos (Szene verloren)');
  await s.screenshot({ path: path.join(ERG, 'w4_speisesaal_bewusstlos.png') });
  for (let i = 3; i < 6; i++) {
    await s.locator('button.knopf').last().click();
    const id = await s.locator('[data-szene]').getAttribute('data-szene');
    await s.locator(`button.wahl[data-opt="${S.szenen.find((x) => x.id === id).richtig}"]`).click();
  }
  await s.locator('button.knopf').last().click();
  text = await s.locator('main').innerText();
  pruefe(/Nicht bestanden/.test(text) && /bewusstlos: 1/.test(text) && /Fehlalarme: 1/.test(text), 'Ergebnis: nicht bestanden (1 bewusstlos, 1 Fehlalarm)');
  await s.context().close();

  console.log('\n== Lesetext am Handy (verlegung.html)');
  s = await neueSeite('verlegung');
  await s.goto(basis + 'w4/verlegung.html');
  const lese = await s.evaluate(() => ({ p: document.querySelectorAll('.lesetext p').length, bilder: document.querySelectorAll('.bild svg[role="img"]').length, breit: document.documentElement.scrollWidth <= document.documentElement.clientWidth, text: document.querySelector('main').innerText }));
  pruefe(lese.p === 4 && lese.bilder === 3 && lese.breit && lese.text.includes('Kann die Person nicht mehr sprechen') && /Tabelle auf dem Arbeitsblatt/.test(lese.text), 'Lesetext: 4 Absätze, 3 Bilder, passt in Handybreite, Auftrag am Ende');
  await s.screenshot({ path: path.join(ERG, 'w4_verlegung.png'), fullPage: true });
  await s.context().close();

  console.log('\n== Wo ist was? am Handy (anatomie.html)');
  s = await neueSeite('anatomie');
  await s.goto(basis + 'w4/anatomie.html');
  await start(s);
  const gesucht = async () => { const f = await s.locator('.frage').innerText(); return W4.anatomie.teile.find((t) => f.includes(t.frage.replace(/\*\*/g, ''))).id; };
  // sichtbare Form des Teils antippen (die Tipp-Fläche liegt im selben <g>)
  const tippe = (id) => s.locator(`[data-teil="${id}"] :not(.tippflaeche)`).first().click({ force: true });
  let ziel = await gesucht();
  await tippe(W4.anatomie.teile.find((t) => t.id !== ziel).id);
  pruefe(/Leider falsch/.test(await s.locator('main').innerText()) && (await s.locator('.teil.falsch').count()) === 1 && (await s.locator('.teil.zeigen').count()) === 1, 'Wo ist was?: falscher Tipp → rot/grün markiert');
  await s.locator('button.knopf', { hasText: 'Von vorn' }).click();
  pruefe(/^1 \/ 6/.test(await s.locator('.fortschritt').innerText()) && /Versuch 2/.test(await s.locator('.versuch').innerText()), 'Wo ist was?: nach einem Fehler von vorn (Frage 1 / 6, Versuch 2)');
  for (let k = 0; k < 6; k++) { ziel = await gesucht(); await tippe(ziel); await s.waitForTimeout(800); }
  const anaText = await s.locator('main').innerText();
  const chips = await s.locator('.woerter li').allInnerTexts();
  pruefe(/Geschafft/.test(anaText) && chips.join() === lueckenWoerter.slice().sort((a, b) => a.localeCompare(b, 'de')).join() && /Lücken im „Informationstext/.test(anaText), 'Wo ist was?: alles richtig → acht Lückenwörter und Auftrag');
  pruefe(await s.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'Wo ist was?: passt in Handybreite');
  await s.screenshot({ path: path.join(ERG, 'w4_anatomie_ende.png'), fullPage: true });
  await s.context().close();

  console.log('\n== Schon fertig? (rueckenmark, trend, atemweg)');
  s = await neueSeite('rueckenmark');
  await s.goto(basis + 'w4/rueckenmark.html');
  await start(s);
  for (const k of W4.rueckenmark.karten) {
    if (k.typ === 'hoehe') await s.locator(`button.wahl[data-id="${k.richtig}"]`).click();
    else await s.locator('button.wahl').nth(k.richtig).click();
    await s.locator('button.knopf').last().click();
  }
  pruefe(/8 \/ 8/.test(await s.locator('main').innerText()), 'Rückenmark-Check: alles richtig → 8/8');
  await s.context().close();
  s = await neueSeite('trend');
  await s.goto(basis + 'w4/trend.html');
  await start(s);
  for (let i = 0; i < W4.trend.reihen.length; i++) {
    const name = await s.locator('section.karte h2').innerText();
    const r = W4.trend.reihen.find((x) => x.name === name);
    await s.locator(`.ampel button[data-stufe="${r.richtig}"]`).click();
    await s.locator('button.knopf').last().click();
  }
  pruefe(/5 \/ 5/.test(await s.locator('main').innerText()), 'Trend-Detektiv: alles richtig → 5/5');
  await s.context().close();
  s = await neueSeite('atemweg');
  await s.goto(basis + 'w4/atemweg.html');
  await start(s);
  for (const k of W4.atemweg.karten) {
    if (k.typ === 'reihe') { for (const t of k.teile) await s.locator('.chips button', { hasText: new RegExp('^' + t + '$') }).click(); }
    else await s.locator('button.wahl').nth(k.richtig).click();
    await s.locator('button.knopf').last().click();
  }
  pruefe(/6 \/ 6/.test(await s.locator('main').innerText()), 'Atemweg-Check: alles richtig → 6/6');
  await s.screenshot({ path: path.join(ERG, 'w4_atemweg_ergebnis.png') });
  await s.context().close();

  console.log('\n== Lehreransicht ohne Server (Probeansicht, Messkarten groß)');
  s = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  beobachten(s, P, 'lehrer-demo');
  await s.goto(basis + 'w4/lehrer.html?demo=1');
  text = await s.locator('main').innerText();
  pruefe(/4821/.test(text) && /Tisch 2/.test(text) && /Häufige Fehlentscheidungen/.test(text) && /Karte 1 \(Finn Albers, 06:00\)/.test(text), 'Probeansicht: Code, Gruppen, häufige Fehlentscheidungen lesbar');
  await s.screenshot({ path: path.join(ERG, 'w4_lehrer_demo.png'), fullPage: true });
  await s.getByText('Messkarten groß').click();
  await s.keyboard.press('ArrowRight');
  await s.keyboard.press('l');
  text = await s.locator('main').innerText();
  pruefe(/Messkarte 2/.test(text) && /Jana Kraus/.test(text) && /Richtig: 🟢/.test(text), 'Messkarten groß: blättern (→) und Lösung (L)');
  await s.screenshot({ path: path.join(ERG, 'w4_lehrer_messkarte.png') });
  await s.context().close();
  server.close();

  /* ===================== 4. Lehreransicht mit lokalem Worker ===================== */
  console.log('\n== Worker (worker-w4/wrangler.jsonc) und Lehreransicht');
  let worker = null;
  try { worker = await workerStarten(8796); } catch (e) { console.log('  (Worker startet nicht – „npm install“ im Ordner worker/? übersprungen)'); }
  if (worker) {
    const U = worker.url;
    const post = (weg, d) => fetch(U + weg, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }).then(async (r) => ({ status: r.status, d: await r.json() }));
    const { d: raum } = await post('/api/raum', {});
    pruefe(/^\d{4}$/.test(raum.raum) && raum.schluessel.length >= 20, 'Raum angelegt');
    pruefe((await (await fetch(U + '/api/pruefen?raum=' + raum.raum)).json()).ok === true, 'Raumcode prüfbar');
    pruefe((await post('/api/melden', { raum: raum.raum, geraet: 'x', uebung: 'verlauf', punkte: 1, max: 6 })).status === 400, 'ungültige Meldung wird abgelehnt');
    pruefe((await post('/api/melden', { raum: raum.raum, geraet: 'abcdefghijkl', gruppe: '<b>', uebung: 'verlauf', punkte: 1, max: 6 })).status === 400, 'ungültiger Gruppenname wird abgelehnt');
    pruefe((await fetch(`${U}/api/stand?raum=${raum.raum}&schluessel=${'X'.repeat(32)}`)).status === 403, 'Stand ohne Schlüssel wird abgelehnt');
    const { server: s2, basis: b2 } = await serverStarten(U);
    const lehrer = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
    beobachten(lehrer, P, 'lehrer', [U]);
    await lehrer.goto(b2 + 'w4/lehrer.html');
    await lehrer.getByText('Neuen Raum starten').click();
    await lehrer.locator('.code').waitFor();
    const code = (await lehrer.locator('.code').innerText()).trim();
    pruefe(/^\d{4}$/.test(code), 'Lehreransicht: Raum gestartet, Code ' + code);
    const handy = await neueSeite('handy-raum', { erlaubt: [U] });
    await handy.goto(b2 + 'w4/verlauf.html');
    await handy.locator('details.raum summary').click();
    await handy.fill('#raumcode', code);
    await handy.fill('#gruppe', 'Tisch 3');
    await start(handy);
    await handy.locator('.ampel button').first().waitFor();
    for (const k of V.karten) { await handy.locator(`.ampel button[data-stufe="${k.richtig}"]`).click(); await handy.locator('button.knopf').last().click(); }
    await handy.waitForTimeout(500);
    await lehrer.waitForFunction(() => /Tisch 3/.test(document.body.innerText) && /6\/6 · 🏆/.test(document.body.innerText), null, { timeout: 15000 }).then(() => pruefe(true, 'Lehreransicht zeigt „Tisch 3: 6/6 · 🏆“')).catch(() => pruefe(false, 'Lehreransicht zeigt „Tisch 3: 6/6 · 🏆“'));
    await lehrer.screenshot({ path: path.join(ERG, 'w4_lehrer_raum.png'), fullPage: true });
    const handy2 = await neueSeite('handy-falscher-code', { erlaubt: [U] });
    await handy2.goto(b2 + 'w4/trend.html');
    await handy2.locator('details.raum summary').click();
    await handy2.fill('#raumcode', '0000');
    await start(handy2);
    await handy2.locator('.ampel button').first().waitFor({ timeout: 8000 }).then(() => pruefe(true, 'falscher Raumcode: Übung startet trotzdem')).catch(() => pruefe(false, 'falscher Raumcode: Übung startet trotzdem'));
    s2.close();
    worker.beenden();
  }
  await browser.close();

  console.log('\n== Konsole und fremde Adressen');
  pruefe(P.konsole.length === 0, 'keine Fehler in der Konsole', P.konsole.slice(0, 5));
  pruefe(P.extern.length === 0, 'keine Anfragen an fremde Adressen', P.extern.slice(0, 5));

  console.log(`\n${zahl - fehler} von ${zahl} Prüfungen bestanden.`);
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

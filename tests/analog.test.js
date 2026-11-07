/* Analoge Fassung ohne Handys und Beamer (werkzeuge/ab_w2_analog.js).
 * Baut die drei Word-Dateien in einen temporären Ordner und prüft ihren Text:
 *   – Schülerversion ohne Handy, QR-Code, Beamer und ohne Klausur-Wörter,
 *   – inhaltlich dieselbe Stunde wie die digitale Fassung (Aufgaben, Merksätze, Fälle, Lösungen),
 *   – Lösungskarten ohne Punkte-Hinweise, Loskarten passend zu den Klassen.
 * Start (im Ordner tests/): node analog.test.js */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const { pruefe, ergebnis } = require('./hilfen');

const WURZEL = path.resolve(__dirname, '..');
const GEN = path.join(WURZEL, 'werkzeuge', 'ab_w2_analog.js');
const T = require(path.join(WURZEL, 'werkzeuge', 'ab_w2_texte.js'));
const A = require(GEN);
const lade = (datei, name) => { const k = {}; vm.createContext(k); vm.runInContext(fs.readFileSync(path.join(WURZEL, 'docs', datei), 'utf8') + `\nthis.__x = ${name};`, k); return k.__x; };
const I = lade('inhalte.js', 'INHALTE');
const S = lade('inhalte_stunde.js', 'STUNDE');

// Text einer Word-Datei: Absätze mit zusammengefügten Textläufen
function text(datei) {
  const xml = execFileSync('unzip', ['-p', datei, 'word/document.xml'], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
  const absaetze = xml.split('</w:p>').map((p) => (p.match(/<w:t[^>]*>[^<]*<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, '')).join(''));
  return absaetze.join('\n').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/­/g, '');
}
const ohneFett = (s) => s.replace(/\*\*/g, '');
const merksatz = (key) => T.MERKSAETZE[key].map((x) => (typeof x === 'string' ? x : x.l)).join('');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'analog-'));
execFileSync('node', [GEN, tmp], { stdio: 'ignore' });
const SV = text(path.join(tmp, 'KB1_W2_Schockformen_analog_SV.docx'));
const AN = text(path.join(tmp, 'KB1_W2_Schockformen_analog_Anlagen.docx'));
const LV = text(path.join(tmp, 'KB1_W2_Schockformen_analog_LV_LSG.docx'));

console.log('Schülerversion: ohne Handy und Beamer');
// Ausnahme: der Ablenker-Satz im Fall von Herrn Weber („… sein Handy gesehen hat“) gehört zum Fall
const ohneAblenker = (s) => s.split('Er fragt, ob jemand sein Handy gesehen hat.').join('');
pruefe(!/Handy|Smartphone|QR|\bApp\b|Beamer|scannen|tippen/i.test(ohneAblenker(SV)), 'kein Handy, QR-Code, Beamer oder Tippen in der Schülerversion', (ohneAblenker(SV).match(/.{30}(Handy|Smartphone|QR|\bApp\b|Beamer|scannen|tippen).{30}/i) || [])[0]);
pruefe(!/Handy|Smartphone|QR|\bApp\b|Beamer|scannen/i.test(ohneAblenker(AN)), 'kein Handy, QR-Code oder Beamer in den Anlagen', (ohneAblenker(AN).match(/.{30}(Handy|Smartphone|QR|\bApp\b|Beamer|scannen).{30}/i) || [])[0]);
pruefe(!/Klausur|Klassenarbeit|Examen|freiwillig|Ich kann/i.test(SV + AN), 'keine Klausur-/Examens-Wörter, kein „freiwillig“, keine Ich-kann-Liste für die SuS');
pruefe(!/Woche [3-9]|nächste Woche/i.test(SV + AN), 'kein Hinweis auf spätere Wochen');
pruefe([1, 2, 3].every((n) => SV.includes('Schockformen: ' + S.folien.find((f) => f.typ === 'blatt' && f.nr === n).ueberschrift)) && SV.includes('Schockformen: Korrektur und Selbstkontrolle'), 'Überschriften „Schockformen: …“ wie in der digitalen Fassung (AB1–AB3, Korrekturbogen)');

console.log('\nInhaltlich dieselbe Stunde wie die digitale Fassung');
pruefe(SV.includes(T.LERNZIEL) && SV.includes(T.LEITFRAGE) && T.FALLBEZUG.absaetze.every((a) => SV.includes(a)), 'Lernziel, Fallbezug Frau Maler und Leitfrage');
const fehlt = Object.values(T.AUFGABEN).filter((a) => !SV.includes(a.text) || (a.vorsatz && !SV.includes(a.vorsatz))).map((a) => a.nr);
pruefe(!fehlt.length, 'alle Schreibaufgaben 2.1–5.2 wortgleich', fehlt);
const H = T.HAUSAUFGABE;
pruefe([H.aufgabe1, ...H.aufgaben2].every((a) => SV.includes(a.text)) && H.situation.every((x) => SV.includes(x)), 'Hausaufgabe wortgleich (Ausgangssituation, 1.1, 2.1, 2.2)');
pruefe(['aa1', 'aa3', 'aa4'].every((k) => SV.includes(merksatz(k))), 'Merksätze AA1, AA3 und AA4 fertig auf dem AB');
pruefe(SV.indexOf(merksatz('aa3')) < SV.indexOf('Lagerungs-Quiz'), 'Merksatz AA3 steht vor dem Lagerungs-Quiz');
pruefe(T.VERGLEICH.every((z) => SV.includes(z[0])) && T.TRANSFERFALL.every((x) => SV.includes(x)), 'Vergleichstabelle (alle Zeilen) und Transferfall');
pruefe(T.ENTSCHEIDUNG.every((e) => SV.includes(e.frage)), 'Einstieg und Check-out: alle vier Notfälle auf dem AB (Spalten Anfang und Ende)');
pruefe(I.detektiv.faelle.every((f) => f.teile.every((t) => SV.includes(typeof t === 'string' ? t.trim() : t.t))), 'Schockform-Detektiv: alle vier Fälle wortgleich');
pruefe(I.lagerung.karten.every((c) => SV.includes(c.text)), 'Lagerungs-Quiz: alle Situationen wortgleich');
pruefe(S.folien.find((f) => f.id === 'aa4a').massnahmen.every((m) => SV.includes(m.text)), 'Wer darf was?: alle sechs Maßnahmen zum Ankreuzen');
pruefe([1, 2, 3, 4].every((n) => S.folien.find((f) => f.id === 'lagerung-' + n).so.every((s) => SV.includes(ohneFett(s)))), 'Lagerungen mit „So geht’s“ wie auf den Lagerungsfolien');
pruefe(I.raster.gruppen.every((g) => g.kriterien.every((k) => SV.includes(k.text))) && I.transfer.aufgaben.every((a) => a.kriterien.every((k) => SV.includes(k.text))), 'Korrekturbogen: Bewertungsraster AA5 und Selbstkontrolle der Hausaufgabe wie am Handy');

console.log('\nAnlagen');
pruefe(['a', 'b', 'c'].every((x) => T.EXPERTEN[x].info.every((p) => AN.includes(p)) && T.EXPERTEN[x].fall.every((p) => AN.includes(p))), 'Expertenblätter: Infotext und Fall wortgleich');
pruefe(['A', 'B', 'C'].every((x) => S.check[x].every((q) => AN.includes(q.frage))), 'Expertenblätter: Experten-Check (je drei Fragen)');
pruefe(['a', 'b', 'c'].every((x) => I.markieren.faelle[x].teile.filter((t) => typeof t !== 'string').every((t) => AN.includes(t.t) && AN.includes(t.w))), 'Kontrollkarten: jede Stelle des Falls mit Erklärung');
const karten = AN.slice(AN.indexOf('Lösungskarte 1'), AN.indexOf('Loskarten'));
pruefe(karten.length > 0 && !/\d\s*P\./.test(karten), 'Lösungskarten ohne Hinweise zur Punktevergabe', (karten.match(/.{30}\d\s*P\..{10}/) || [])[0]);
pruefe(['2.1', '2.2', '3.1', '3.2', '4.1'].every((nr) => karten.includes(T.AUFGABEN[nr].text)), 'Lösungskarten 2–4 zu 2.1/2.2, 3.1/3.2 und 4.1');
pruefe(/\(Beurteilung 1 P\./.test(LV), 'Lehrerversion behält die Punktevergabe');

console.log('\nGemischte Antworten auf Papier');
pruefe(new Set(A.EINSTIEG.map((e) => e.richtig)).size > 1, 'Einstieg: richtige Antwort nicht immer derselbe Buchstabe', A.EINSTIEG.map((e) => e.richtig));
pruefe(A.EINSTIEG.every((e, i) => { const o = T.ENTSCHEIDUNG[i]; return e.optionen.find((x) => x.b === e.richtig).t === o.optionen.find((x) => x.startsWith(o.richtig + ' ')).slice(2); }), 'Einstieg: die richtige Antwort ist dieselbe wie am Handy');
pruefe(['A', 'B', 'C'].every((x) => A.CHECK[x].every((q, j) => q.optionen[['a', 'b', 'c'].indexOf(q.richtig)] === S.check[x][j].optionen[S.check[x][j].richtig]) && new Set(A.CHECK[x].map((q) => q.richtig)).size > 1), 'Experten-Check: richtige Antwort wie am Handy, Buchstaben gemischt');

console.log('\nLoskarten');
for (const kl of A.KLASSEN) {
  const k = A.lose(kl);
  const n = kl.stamm.reduce((s, x) => s + x, 0);
  const stammOk = kl.stamm.every((g, i) => { const l = k.filter((c) => c.stamm === i + 1).map((c) => c.x).sort().join(''); return l === (g === 3 ? 'ABC' : 'ABBC'); });
  const doppelB = kl.stamm.every((g, i) => g === 3 || new Set(k.filter((c) => c.stamm === i + 1 && c.x === 'B').map((c) => c.team)).size === 2);
  const groessen = A.teamsVon(kl).map((t) => k.filter((c) => c.team === t).length);
  pruefe(k.length === n && stammOk && doppelB && groessen.every((g) => g >= 3 && g <= 4), `${kl.name}: ${n} Karten, Stammgruppen A+B+C (Vierer mit doppeltem B in verschiedenen Teams), Expertenteams zu 3–4`, groessen);
  pruefe((AN.match(new RegExp(kl.name.replace('.', '\\.') + ' · Loskarte', 'g')) || []).length === n, `${kl.name}: alle Loskarten in den Anlagen`);
}

console.log('\nLehrerversion');
pruefe(/127–135/.test(LV) && /vor der Stunde/.test(LV) && /Tafelbild/.test(LV) && /Material und Kopien/.test(LV), 'Verlaufsplan (0–135 min), Tafelbild und Kopierliste');
pruefe(/Lösungen für die Auflösung im Plenum/.test(LV) && I.detektiv.faelle.every((f) => LV.includes(f.erklaerung)) && T.LAGERUNGSKARTEN.every((c) => LV.includes(c.warum)), 'Lösungen fürs Plenum: Einstieg/Check-out, Detektiv, Lagerungs-Quiz, Wer darf was?');

fs.rmSync(tmp, { recursive: true, force: true });
process.exit(ergebnis() ? 0 : 1);

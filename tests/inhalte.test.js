/* Prüft ohne Browser, dass Arbeitsblatt und App dieselben Texte verwenden
 * (Merksätze, Entscheidungsfragen, Lagerungskarten) und dass der Offline-Speicher (sw.js) alle Dateien kennt.
 * Start (im Ordner tests/): node inhalte.test.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pruefe, ergebnis } = require('./hilfen');

const WURZEL = path.resolve(__dirname, '..');
const DOCS = path.join(WURZEL, 'docs');
const AB = require(path.join(WURZEL, 'werkzeuge', 'ab_w2_texte.js'));

const kontext = {};
vm.createContext(kontext);
vm.runInContext(fs.readFileSync(path.join(DOCS, 'inhalte.js'), 'utf8') + '\nthis.INHALTE = INHALTE;', kontext);
vm.runInContext(fs.readFileSync(path.join(DOCS, 'inhalte_simulation.js'), 'utf8'), kontext);
const I = kontext.INHALTE;
const gleich = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('Merksätze');
for (const k of Object.keys(AB.MERKSAETZE)) pruefe(gleich(AB.MERKSAETZE[k], I.merksaetze[k]), `Merksatz ${k} gleich in AB und App`);

console.log('Entscheidungsfragen');
pruefe(gleich(AB.ENTSCHEIDUNG, I.entscheidung.fragen), 'Fragen, Optionen, Lösungen und Erklärungen gleich');

console.log('Lagerungskarten');
pruefe(AB.LAGERUNGSKARTEN.length === I.lagerung.karten.length, 'gleiche Anzahl Karten');
AB.LAGERUNGSKARTEN.forEach((k, i) => {
  const a = I.lagerung.karten[i] || {};
  pruefe(k.titel === a.titel && k.text === a.text && k.loesung === a.loesung && k.warum === a.warum, `Karte ${i + 1} (${k.titel}) gleich`);
});
const kuerzel = I.lagerung.optionen.map((o) => o.kuerzel);
pruefe(I.lagerung.karten.every((k) => kuerzel.includes(k.richtig)), 'jede Karte hat eine gültige Lösung');

console.log('Markieren und Detektiv');
for (const f of ['a', 'b', 'c']) {
  const teile = I.markieren.faelle[f].teile.filter((t) => typeof t === 'object');
  pruefe(teile.some((t) => t.k === 'schock') && teile.some((t) => !t.k), `Fall ${f}: hat Schockzeichen und Ablenker`);
  pruefe(teile.every((t) => typeof t.w === 'string' && t.w.length > 5), `Fall ${f}: jede Stelle hat eine Erklärung`);
}
I.detektiv.faelle.forEach((f, i) => {
  pruefe(f.teile.filter((t) => typeof t === 'object' && t.b === 'beleg').length >= 2, `Detektiv-Fall ${i + 1}: mindestens 2 Belege`);
});
pruefe(I.detektiv.monitor.zeilen.filter((z) => z.richtig).length === 2, 'Monitorvergleich: genau 2 richtige Zeilen');

console.log('Raster');
const transferMax = I.transfer.aufgaben.reduce((s, a) => s + a.max, 0);
pruefe(transferMax === 20, 'Hausaufgabe: 20 Punkte', transferMax);
const rasterMax = I.raster.gruppen.reduce((s, g) => s + g.max, 0);
pruefe(rasterMax === 10, 'AA6: 10 Punkte', rasterMax);

console.log('Offline-Speicher (sw.js)');
const sw = fs.readFileSync(path.join(DOCS, 'sw.js'), 'utf8');
const liste = (sw.match(/var DATEIEN = \[([\s\S]*?)\];/) || [])[1] || '';
const dateien = [...liste.matchAll(/'([^']+)'/g)].map((m) => m[1]).filter((d) => d !== './');
for (const d of dateien) pruefe(fs.existsSync(path.join(DOCS, d)), `sw.js: ${d} existiert`);
const vorhanden = fs.readdirSync(DOCS).filter((d) => /\.(html|js|css)$/.test(d) && d !== 'sw.js');
const fehlend = vorhanden.filter((d) => !dateien.includes(d));
pruefe(fehlend.length === 0, 'alle Seiten, Skripte und Stile stehen in sw.js', fehlend);

console.log('QR-Codes');
const qr = fs.readdirSync(path.join(WURZEL, 'qr'));
for (const s of Object.values(AB.SEITEN)) {
  const zusatz = (s.match(/\?[a-z]+=([a-z0-9]+)/) || [])[1];
  const seite = s.replace(/\.html.*$/, '');
  const name = 'qr_w2_' + (seite === 'w2' ? 'stunde' : seite.replace(/^w2-/, '')) + (zusatz ? '_' + zusatz : '') + '.png';
  pruefe(qr.includes(name), `QR-Code vorhanden: ${name}`);
  pruefe(fs.existsSync(path.join(DOCS, s.split('?')[0])), `Zielseite existiert: ${s}`);
}
const qrDateien = qr.filter((d) => d.endsWith('.png'));
const erwartet = Object.values(AB.SEITEN).length;
pruefe(qrDateien.length === erwartet, `genau ${erwartet} QR-Codes, keine veralteten`, qrDateien);

console.log('Beamer-Stunde (inhalte_stunde.js)');
vm.runInContext(fs.readFileSync(path.join(DOCS, 'inhalte_stunde.js'), 'utf8') + '\nthis.STUNDE = STUNDE;', kontext);
const S = kontext.STUNDE;
const ids = S.folien.map((f) => f.id);
pruefe(new Set(ids).size === ids.length, 'jede Folie hat eine eigene Kennung');
const workerLogik = fs.readFileSync(path.join(WURZEL, 'worker', 'src', 'stunde.js'), 'utf8');
for (const k of ['FOLIE_EXPERTEN', 'FOLIE_STAMM', 'FOLIE_ENDE']) {
  const id = (workerLogik.match(new RegExp(k + " = '([a-z0-9-]+)'")) || [])[1];
  pruefe(ids.includes(id), `Worker-Folie ${k} = „${id}“ gibt es im Foliensatz`);
}
pruefe(ids[ids.length - 1] === 'ende', 'letzte Folie „ende“ gibt die Nachlese frei');
const beamerJs = fs.readFileSync(path.join(DOCS, 'beamer.js'), 'utf8');
const handyJs = fs.readFileSync(path.join(DOCS, 'stunde.js'), 'utf8');
for (const f of S.folien) {
  pruefe(new RegExp('\\b' + f.typ + ': folie').test(beamerJs), `Folie ${f.id}: Beamer kennt den Typ „${f.typ}“`);
  const h = f.handy || {};
  pruefe(['vorne', 'entscheidung', 'murmeln', 'gruppe', 'experte', 'stamm', 'modul', 'papier', 'aufstellung', 'ende'].includes(h.typ), `Folie ${f.id}: Handy-Bildschirm „${h.typ}“ ist bekannt`);
  if (h.modul) pruefe(fs.existsSync(path.join(DOCS, h.modul + '.js')), `Folie ${f.id}: Übung ${h.modul}.js existiert`);
  (f.uhr || []).forEach((u) => pruefe(Number.isInteger(u.sek) && u.sek >= 5 && u.sek <= 3600, `Folie ${f.id}: Uhr „${u.label}“ zwischen 5 s und 60 min`));
  if (f.uhr) pruefe(f.uhr.length <= 6, `Folie ${f.id}: höchstens 6 Uhr-Abschnitte`);
}
pruefe(/stamm: zeigeStamm/.test(handyJs), 'Handy kennt den Stammgruppen-Bildschirm');
pruefe(S.gruppen.length >= 10 && new Set(S.gruppen.map((g) => g.name)).size === S.gruppen.length, '10 verschiedene Stammgruppen-Namen');
['A', 'B', 'C'].forEach((b) => {
  pruefe(S.check[b].length === 3 && S.check[b].every((q) => q.optionen[q.richtig]), `Experten-Check ${b}: 3 Fragen mit gültiger Lösung`);
  const r = S.rollen[b];
  pruefe(gleich(S.experten[r.fall].info, AB.EXPERTEN[r.fall].info) && S.experten[r.fall].woerter === AB.EXPERTEN[r.fall].woerter, `Expertentext ${b} gleich in App und Arbeitsblatt`);
});
const aa5 = S.folien.find((f) => f.id === 'aa5a');
pruefe(aa5.massnahmen.every((m) => m.ecke >= 0 && m.ecke < aa5.ecken.length), 'AA5a: jede Maßnahme hat eine gültige Ecke');

console.log('Nachlese (inhalte_nachlesen.js, aus dem Arbeitsblatt erzeugt)');
vm.runInContext(fs.readFileSync(path.join(DOCS, 'inhalte_nachlesen.js'), 'utf8') + '\nthis.NACHLESEN = NACHLESEN;', kontext);
const NL = kontext.NACHLESEN;
for (const nr of ['1.1', '2.1', '2.2', '3.1', '3.2', '4.1', '5.1', '6.1', '6.2', '6.3', '7.1', '7.2']) pruefe(!!NL.aufgaben[nr], `Aufgabe ${nr} vorhanden`);
for (const k of ['1.1', '2.1', '2.2', '3.1', '3.2', '4.1', '5.1', '6.1 und 6.2', '6.3', '7.1', '7.2']) pruefe(Array.isArray(NL.loesungen[k]) && NL.loesungen[k].length > 0, `Lösung ${k} vorhanden`);
pruefe(!Object.keys(NL.loesungen).some((k) => /^Aufgabe/.test(k)), 'keine Hausaufgaben-Lösungen auf der Nachlese-Seite');
pruefe(NL.vergleich.length === 6 && NL.pikto.length === 4 && NL.weg.length === 5 && NL.werDarfWas.length === 3, 'Tabelle, Lagerung und Verantwortung vollständig');

console.log('Keine Wege zwischen den Übungen');
const startseite = fs.readFileSync(path.join(DOCS, 'index.html'), 'utf8');
pruefe(!/w2-[a-z]+\.html/.test(startseite) && !I.start.links, 'Startseite enthält keine Links zu den Übungen');
for (const d of fs.readdirSync(DOCS).filter((x) => /^w2-.*\.html$/.test(x))) {
  const html = fs.readFileSync(path.join(DOCS, d), 'utf8');
  pruefe(!/<a\s/i.test(html), `${d}: keine Links`);
}
for (const d of fs.readdirSync(DOCS).filter((x) => /\.js$/.test(x) && x !== 'sw.js')) {
  const js = fs.readFileSync(path.join(DOCS, d), 'utf8');
  pruefe(!/\.href\s*=|location\.(assign|replace)|location\.href\s*=|window\.open\(/.test(js), `${d}: keine Weiterleitung auf andere Seiten`);
}

process.exit(ergebnis() ? 0 : 1);

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
  const name = 'qr_w2_' + s.replace(/\.html.*$/, '').replace(/^w2-/, '') + (zusatz ? '_' + zusatz : '') + '.png';
  pruefe(qr.includes(name), `QR-Code vorhanden: ${name}`);
  pruefe(fs.existsSync(path.join(DOCS, s.split('?')[0])), `Zielseite existiert: ${s}`);
}
const qrDateien = qr.filter((d) => d.endsWith('.png'));
const erwartet = Object.values(AB.SEITEN).length;
pruefe(qrDateien.length === erwartet, `genau ${erwartet} QR-Codes, keine veralteten`, qrDateien);

console.log('Keine Wege zwischen den Übungen');
const startseite = fs.readFileSync(path.join(DOCS, 'index.html'), 'utf8');
pruefe(!/w2-[a-z]+\.html/.test(startseite) && !I.start.links, 'Startseite enthält keine Links zu den Übungen');
for (const d of fs.readdirSync(DOCS).filter((x) => /^w2-.*\.html$/.test(x))) {
  const html = fs.readFileSync(path.join(DOCS, d), 'utf8');
  pruefe(!/<a\s/i.test(html), `${d}: keine Links`);
}
for (const d of fs.readdirSync(DOCS).filter((x) => /\.js$/.test(x) && !['fortschritt.js', 'sw.js'].includes(x))) {
  const js = fs.readFileSync(path.join(DOCS, d), 'utf8');
  pruefe(!/\.href\s*=|location\.(assign|replace)|location\.href\s*=|window\.open\(/.test(js), `${d}: keine Weiterleitung auf andere Seiten`);
}

process.exit(ergebnis() ? 0 : 1);

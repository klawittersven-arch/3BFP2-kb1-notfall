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
const I = kontext.INHALTE;
const gleich = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('Merksätze');
for (const k of Object.keys(AB.MERKSAETZE)) pruefe(gleich(AB.MERKSAETZE[k], I.merksaetze[k]), `Merksatz ${k} gleich in AB und App`);

console.log('Entscheidungsfragen');
pruefe(gleich(AB.ENTSCHEIDUNG, I.entscheidung.fragen), 'Fragen, Optionen, Lösungen und Erklärungen gleich');
pruefe(I.entscheidung.fragen.length === 4 && I.entscheidung.fragen.map((f) => f.nr).join() === 'E1,E2,E3,E4', 'vier Notfälle E1–E4');
pruefe(/Frau Maler/.test(I.entscheidung.fragen[3].frage), 'der letzte Notfall (E4) ist die Leitfrage zu Frau Maler');
pruefe(!I.entscheidung.fragen.some((f) => /Infusion stoppen|Sauerstoff geben/.test(f.frage + f.optionen.join())), 'Infusion und Sauerstoff nur noch in „Wer darf was?“');

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
  pruefe(teile.some((t) => t.k === 'schock') && teile.filter((t) => !t.k).length === 3, `Fall ${f}: hat Schockzeichen und genau 3 Ablenker`);
  pruefe(teile.every((t) => typeof t.w === 'string' && t.w.length > 5), `Fall ${f}: jede Stelle hat eine Erklärung`);
}
I.detektiv.faelle.forEach((f, i) => {
  pruefe(f.teile.filter((t) => typeof t === 'object' && t.b === 'beleg').length >= 2, `Detektiv-Fall ${i + 1}: mindestens 2 Belege`);
});
pruefe(I.markieren.hoechstensFalsch < 3, 'Schutz gegen Raten: weniger falsche Markierungen erlaubt als Ablenker im Fall');
pruefe(I.detektiv.faelle.length === 4 && ['H', 'A', 'N'].every((x) => I.detektiv.faelle.some((f) => f.form === x)), 'Detektiv: 4 Fälle, jede Schockform mindestens einmal');
pruefe(!I.detektiv.monitor && !/Vergleich/.test(I.detektiv.anweisung), 'Detektiv: kein Patientenvergleich mehr');
pruefe(I.detektiv.mindestensErsterVersuch <= I.detektiv.faelle.length, 'Detektiv: Mindestzahl erreichbar');
pruefe(!I.merksaetze.aa2 && !AB.MERKSAETZE.aa2, 'kein Merksatz AA2 mehr');

console.log('Raster');
const transferMax = I.transfer.aufgaben.reduce((s, a) => s + a.max, 0);
pruefe(transferMax === 13 && I.transfer.aufgaben.map((a) => a.nr).join() === '1.1,2.1,2.2', 'Hausaufgabe: 1.1, 2.1, 2.2 mit 13 Punkten', transferMax);
const rasterMax = I.raster.gruppen.reduce((s, g) => s + g.max, 0);
pruefe(rasterMax === 7, 'AA5 (5.1 und 5.2): 7 Punkte', rasterMax);

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
for (const k of ['FOLIE_EXPERTEN', 'FOLIE_NACH_EXPERTEN', 'FOLIE_ENDE']) {
  const id = (workerLogik.match(new RegExp(k + " = '([a-z0-9-]+)'")) || [])[1];
  pruefe(ids.includes(id), `Worker-Folie ${k} = „${id}“ gibt es im Foliensatz`);
}
pruefe(ids[ids.length - 1] === 'ende', 'letzte Folie „ende“ gibt die Nachlese frei');
const beamerJs = fs.readFileSync(path.join(DOCS, 'beamer.js'), 'utf8');
const handyJs = fs.readFileSync(path.join(DOCS, 'stunde.js'), 'utf8');
for (const f of S.folien) {
  pruefe(new RegExp('\\b' + f.typ + ': folie').test(beamerJs), `Folie ${f.id}: Beamer kennt den Typ „${f.typ}“`);
  const h = f.handy || {};
  pruefe(['vorne', 'bild', 'abstimmung', 'bilanz', 'murmeln', 'gruppe', 'experte', 'stamm', 'modul', 'papier', 'faelle', 'aufstellung', 'ende'].includes(h.typ), `Folie ${f.id}: Handy-Bildschirm „${h.typ}“ ist bekannt`);
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
  pruefe(!('nennen' in S.experten[r.fall]) && !('nennen' in AB.EXPERTEN[r.fall]), 'Experte ' + b + ': keine Klausuraufgabe 1.1 mehr');
  const ueberschrift = AB.EXPERTEN[r.fall].info.filter((x) => /\*\*|Ursache|Entstehung|typische Zeichen|Darauf achte/i.test(x));
  pruefe(ueberschrift.length === 0, 'Infotext ' + b + ': keine Überschriften und keine Namen der Tabellenzeilen', ueberschrift);
  const fallApp = I.markieren.faelle[r.fall].teile.map((t) => (typeof t === 'string' ? t : t.t)).join('').split('\n').map((x) => x.trim());
  pruefe(gleich(fallApp, AB.EXPERTEN[r.fall].fall), 'Fall ' + b + ': Expertenblatt (Papier) und Markier-Übung haben denselben Text');
});
const aa4 = S.folien.find((f) => f.id === 'aa4a');
pruefe(aa4.massnahmen.length === 6 && aa4.massnahmen.every((m) => m.ecke >= 0 && m.ecke < aa4.ecken.length), 'AA4a: 6 Maßnahmen mit gültiger Ecke');
pruefe(aa4.runde === 3 && aa4.ecken.length === 3 && aa4.massnahmen.length <= 9, 'AA4a: Abstimmung am Handy (Runde 3, höchstens 9 Maßnahmen)');
pruefe(!ids.includes('pause'), 'keine Pausenfolie');
// Hausaufgabe: Tipp, vorher die Merksätze zu lesen (sonst fehlen die Sofortmaßnahmen für 2.1)
pruefe(/Merksätze AA1, AA3 und AA4/.test(JSON.stringify(S.folien.find((f) => f.id === 'ende'))) && /Merksätze AA1, AA3 und AA4/.test(fs.readFileSync(path.join(WURZEL, 'werkzeuge', 'ab_w2.js'), 'utf8')), 'Hausaufgabe: Hinweis auf die Merksätze (Folie, Handy, AB)');
// Transferfall: nur mit vorher Gelerntem lösbar – Merksätze AA3/AA4 sind als Hilfe erlaubt
pruefe(/Merksatz AA3/.test(S.folien.find((f) => f.id === 'aa5').los) && /Merksatz AA4/.test(S.folien.find((f) => f.id === 'aa5').los), 'AA5: Merksätze AA3 und AA4 als Hilfe genannt');
pruefe(I.merksaetze.aa4.filter((t) => typeof t === 'object').length >= 4 && I.merksaetze.aa4.map((t) => (typeof t === 'string' ? t : t.l)).join('').split(',').length >= 5, 'Merksatz AA4 nennt mindestens 5 Sofortmaßnahmen');
// Musterlösungen groß: je Folie höchstens eine Aufgabe (5.1/5.2 gehören zusammen und stehen auf zwei Folien)
S.folien.filter((f) => f.typ === 'loesung').forEach((f) => pruefe((f.aufgaben || []).length === 1 && (typeof f.aufgaben[0] === 'string' || f.aufgaben[0].zeilen), `Musterlösung ${f.id}: eine Aufgabe je Folie`));
pruefe(['aa2c-loesung-21', 'aa2c-loesung-22', 'aa3b-loesung-31', 'aa3b-loesung-32', 'aa5-peer', 'aa5-peer-2'].every((id) => ids.includes(id)) && S.folien.find((f) => f.id === 'aa5-peer-2').uhrVon === 'aa5-peer', 'Musterlösungen 2.1/2.2/3.1/3.2 einzeln, AA5 auf zwei Folien mit derselben Uhr');
pruefe(!/Nennen Sie 1 Befund/.test(fs.readFileSync(path.join(WURZEL, 'werkzeuge', 'ab_w2.js'), 'utf8')) && /Erklären Sie diesen Unterschied/.test(fs.readFileSync(path.join(WURZEL, 'werkzeuge', 'ab_w2.js'), 'utf8')), '2.2: Befund vorgegeben (Puls), nur noch die Erklärung gefragt');
// Keine Bezeichnung „Klausurtraining“: Sonst wirken die anderen Aufgaben weniger wichtig
for (const d of ['inhalte.js', 'inhalte_stunde.js', 'nachlesen.js', 'stunde.js']) pruefe(!/Klausurtraining/.test(fs.readFileSync(path.join(DOCS, d), 'utf8')), `${d}: keine Bezeichnung „Klausurtraining“`);
pruefe(!/Klausurtraining|wie in der KA/.test(fs.readFileSync(path.join(WURZEL, 'werkzeuge', 'ab_w2.js'), 'utf8')), 'Arbeitsblatt: keine Bezeichnung „Klausurtraining“');
// Was die SuS sehen (Texte in App, Folien, Nachlese), verweist nicht auf Klausur/Klassenarbeit – sonst wirken andere Aufgaben unwichtiger
pruefe(!/Klausur|Klassenarbeit|Erwartungshorizont|\bKA\b/.test(JSON.stringify(I) + JSON.stringify(S) + fs.readFileSync(path.join(DOCS, 'inhalte_nachlesen.js'), 'utf8')), 'App, Folien und Nachlese: kein Verweis auf Klausur oder Klassenarbeit');
const tab = S.folien.filter((f) => f.typ === 'tabelle');
pruefe(tab.map((f) => f.spalte).join('') === 'ABC' && tab.filter((f) => f.gemeinsamkeit).length === 1 && tab[2].gemeinsamkeit && ids.indexOf(tab[0].id) === ids.indexOf('aa2a') + 1 && ids.indexOf(tab[2].id) === ids.indexOf(tab[0].id) + 2, 'Tabelle sichern: drei Folien nacheinander (A, B, C – Gemeinsamkeit bei C)');
// Die drei Blätter werden nacheinander ausgeteilt – je eine Folie „Sie erhalten jetzt Blatt …“
const blaetter = S.folien.filter((f) => f.typ === 'blatt');
pruefe(blaetter.length === 3 && blaetter.every((f, i) => f.nr === i + 1 && f.von === 3 && f.ueberschrift && f.punkte.length >= 3 && f.handy.typ === 'vorne'), 'drei Austeil-Folien Blatt 1–3 mit Überschrift und Aufgaben');
pruefe(ids.indexOf('blatt1') === ids.indexOf('start') + 1, 'Blatt 1 gleich nach „Willkommen“');
pruefe(ids.indexOf('blatt2') === ids.indexOf('aa2c') - 1, 'Blatt 2 vor den Schreibaufgaben 2.1/2.2');
pruefe(ids.indexOf('blatt3') === ids.indexOf('aa4b') - 1 && ids.indexOf('aa4-merksatz') === ids.indexOf('aa4a') + 1, 'Merksatz AA4 nach „Wer darf was?“ (Blatt 2), dann Blatt 3 vor AA4 b');
const abQuelle = fs.readFileSync(path.join(WURZEL, 'werkzeuge', 'ab_w2.js'), 'utf8');
pruefe([1, 2, 3].every((n) => abQuelle.includes('blattKopf(B, ' + n)), 'Arbeitsblatt: Überschrift für Blatt 1, 2 und 3 (aus den Austeil-Folien)');
for (const d of fs.readdirSync(DOCS).filter((x) => /\.(js|html)$/.test(x))) {
  pruefe(!/Woche [3-9]/.test(fs.readFileSync(path.join(DOCS, d), 'utf8')), `${d}: kein Hinweis auf spätere Wochen`);
}
pruefe(!/Woche [3-9]/.test(fs.readFileSync(path.join(WURZEL, 'werkzeuge', 'ab_w2.js'), 'utf8') + fs.readFileSync(path.join(WURZEL, 'werkzeuge', 'ab_w2_texte.js'), 'utf8')), 'Arbeitsblatt: kein Hinweis auf spätere Wochen');
['einstieg', 'checkout'].forEach((id, i) => {
  const f = S.folien.find((x) => x.id === id);
  pruefe(f.typ === 'abstimmung' && f.runde === i + 1 && f.handy.typ === 'abstimmung', id + ': Notfall für Notfall am Beamer, Abstimmung am Handy (Runde ' + (i + 1) + ')');
});
pruefe(ids.indexOf('checkout-intro') === ids.indexOf('checkout') - 1, 'vor dem Check-out: Erklärfolie „Was haben wir heute gelernt?“');
pruefe(!fs.existsSync(path.join(DOCS, 'entscheidung.js')), 'kein Modul mehr, das alle sechs Fragen auf einmal stellt');
pruefe(!ids.includes('ikl') && !/Ich-kann|Nächste Woche/i.test(JSON.stringify(S.folien)), 'keine Ich-kann-Liste und kein Ausblick auf nächste Woche');
pruefe(S.folien[S.folien.length - 1].typ === 'ende' && /Hausaufgabe/.test(JSON.stringify(S.folien[S.folien.length - 1])), 'letzte Folie: Hausaufgabe und Nachlesen (gibt die Nachlese frei)');
for (const d of fs.readdirSync(DOCS).filter((x) => /\.(js|html|css)$/.test(x))) {
  pruefe(!/Ich-kann/i.test(fs.readFileSync(path.join(DOCS, d), 'utf8')), `${d}: kein Hinweis auf die Ich-kann-Liste`);
}
pruefe(S.folien.indexOf(S.folien.find((f) => f.id === 'aa1-merksatz')) === S.folien.indexOf(S.folien.find((f) => f.id === 'aa1')) + 1, 'nach der Expertenrunde folgt der Merksatz AA1 (automatischer Wechsel)');
pruefe(!S.folien.some((f) => (f.handy || {}).modul === 'simulation') && !fs.existsSync(path.join(DOCS, 'simulation.js')), 'keine Notfall-Simulation mehr');
['aa1', 'aa3', 'aa4'].forEach((k) => {
  const m = S.folien.filter((f) => f.typ === 'merksatz' && f.merksatz === k);
  pruefe(m.length === 1 && I.merksaetze[k].some((t) => typeof t === 'object') && m[0].handy.typ === 'vorne' && /Lesen Sie mit/.test(m[0].text), 'Merksatz ' + k.toUpperCase() + ': genau eine Lesefolie');
});
const lagFolien = S.folien.filter((f) => f.typ === 'lagerung');
pruefe(lagFolien.length === 4 && lagFolien.every((f, i) => f.nr === i + 1), 'vier Lagerungsfolien, nummeriert 1–4');
lagFolien.forEach((f) => {
  pruefe(fs.existsSync(path.join(DOCS, f.bild)) && f.handy.bild === f.bild, `Lagerungsfolie ${f.nr}: Bild ${f.bild} vorhanden (Beamer und Handy)`);
  pruefe(f.wann.length && f.warum.length && f.so.length, `Lagerungsfolie ${f.nr}: Wann, Warum, So geht’s`);
});
pruefe(lagFolien.map((f) => f.id).join() === S.folien.slice(S.folien.findIndex((f) => f.id === 'aa3-impuls') + 1).slice(0, 4).map((f) => f.id).join(), 'Lagerungsfolien direkt nach „Beine hoch?“');
pruefe(!S.folien.some((f) => f.typ === 'merksatz' && f.merksatz === 'aa2'), 'keine Folie zum Merksatz AA2');
// Merksätze stehen fertig auf dem AB: nirgends die Aufforderung, Lücken zu ergänzen
const alleTexte = ['inhalte.js', 'inhalte_stunde.js'].map((d) => fs.readFileSync(path.join(DOCS, d), 'utf8')).join('\n') + fs.readFileSync(path.join(WURZEL, 'werkzeuge', 'ab_w2.js'), 'utf8');
pruefe(!/Merksatz[^.'\n]{0,40}ergänz|Lücken im Kasten|richtig notiert|Lücke anklicken/i.test(alleTexte), 'keine Aufforderung mehr, Merksatz-Lücken zu ergänzen');
pruefe(/B\.b\(x\.l\)/.test(fs.readFileSync(path.join(WURZEL, 'werkzeuge', 'ab_bausteine.js'), 'utf8')), 'Arbeitsblatt: Merksätze fertig ausgefüllt, Schlüsselwörter fett');
pruefe(/^\*\*a\)\*\* Infotext/.test(S.handy.expAuftraege[0]) && /^\*\*b\)\*\* Fall markieren/.test(S.handy.expAuftraege[1]) && /^a\)/.test(S.handy.expInfo) && /^b\)/.test(S.handy.expFall), 'Expertenrunde: a) Infotext, b) Fall markieren');
pruefe(I.lagerung.bilder.length === 4 && I.lagerung.bilder.every((b) => fs.existsSync(path.join(DOCS, b.bild))), 'Lagerungs-Quiz: Bilder der vier Lagerungen am Handy');
pruefe(!/timer|Rollen tauschen|Rollentausch|Matte/i.test(JSON.stringify(I.lagerung) + fs.readFileSync(path.join(DOCS, 'lagerung.js'), 'utf8')), 'Lagerungs-Quiz: allein am Handy – kein Timer, keine Matte, kein Rollentausch');
pruefe(!ids.includes('aa3bc') && !ids.includes('aa3c-loesung') && !/Entscheidungsweg|Parcours|Yogamatte/.test(JSON.stringify(S.folien)), 'kein Entscheidungsweg und kein Parcours mehr');
pruefe(S.folien.find((f) => f.id === 'aa1').uhr[0].sek === 900, 'Expertenrunde: 15 Minuten');
pruefe(S.folien.find((f) => f.id === 'aa5').uhr[0].sek === 480, 'Transferfall: 8 Minuten schreiben');
['a', 'b', 'c'].forEach((f) => {
  const woerter = (x) => x.join(' ').split(/\s+/).length;
  pruefe(woerter(S.experten[f].info) <= 160, `Infotext ${f}: höchstens 160 Wörter (gekürzt)`, woerter(S.experten[f].info));
});
pruefe(!I.lagerung.optionen.some((o) => /anderes/i.test(o.text)) && I.lagerung.karten.every((k) => I.lagerung.optionen.some((o) => o.kuerzel === k.richtig)), 'Lagerungs-Quiz: kein „Etwas anderes“, jede Lösung ist eine der Optionen');
for (const d of fs.readdirSync(DOCS).filter((x) => /\.(js|html)$/.test(x))) {
  pruefe(!/Examen/.test(fs.readFileSync(path.join(DOCS, d), 'utf8')), `${d}: kein Hinweis auf das Examen`);
}

console.log('Nachlese (inhalte_nachlesen.js, aus dem Arbeitsblatt erzeugt)');
vm.runInContext(fs.readFileSync(path.join(DOCS, 'inhalte_nachlesen.js'), 'utf8') + '\nthis.NACHLESEN = NACHLESEN;', kontext);
const NL = kontext.NACHLESEN;
for (const nr of ['2.1', '2.2', '3.1', '3.2', '4.1', '5.1', '5.2']) pruefe(!!NL.aufgaben[nr], `Aufgabe ${nr} vorhanden`);
pruefe(!NL.aufgaben['1.1'] && !NL.loesungen['1.1'], 'Aufgabe 1.1 gestrichen');
for (const k of ['2.1', '2.2', '3.1', '3.2', '4.1', '5.1 und 5.2', 'Kausalkette', 'Leitfrage']) pruefe(Array.isArray(NL.loesungen[k]) && NL.loesungen[k].length > 0, `Lösung ${k} vorhanden`);
pruefe(Object.keys(NL.aufgaben).length === 7 && !NL.aufgaben['6.1'] && !NL.aufgaben['6.2'] && !NL.loesungen['6.1'], 'keine gestrichenen Aufgaben mehr (6.1/6.2 zu Frau Maler)');
pruefe(!Object.keys(NL.loesungen).some((k) => /^Aufgabe/.test(k)), 'keine Hausaufgaben-Lösungen auf der Nachlese-Seite');
pruefe(NL.vergleich.length === 6 && NL.pikto.length === 4 && NL.werDarfWas.length === 3, 'Tabelle, Lagerung und Verantwortung vollständig');
pruefe(!NL.weg && !NL.adrenalin && NL.verantwortung.length === 3 && NL.adrenalinText.length === 2, 'kein Entscheidungsweg; Verantwortung in 3 Zeilen, Adrenalin in 2 Sätzen');
S.folien.find((f) => f.id === 'aa2c').handy.aufgaben.forEach((a) => pruefe(NL.aufgaben[a.nr] && NL.aufgaben[a.nr].text.startsWith(a.text), 'Handy-Text zu ' + a.nr + ' wie im Arbeitsblatt'));
S.folien.filter((f) => f.typ === 'loesung').forEach((f) => {
  (f.aufgaben || []).forEach((a) => {
    const nrs = typeof a === 'string' ? [a] : a.nrs;
    const lsg = typeof a === 'string' ? a : a.loesung;
    pruefe(nrs.every((nr) => NL.aufgaben[nr]) && NL.loesungen[lsg] && NL.loesungen[lsg].length > 0, 'Lösungsfolie ' + f.id + ': Aufgabe und Lösung ' + lsg + ' wie im Arbeitsblatt');
  });
});
S.folien.filter((f) => f.typ === 'aufgabe').forEach((f) => {
  pruefe(f.los && (f.uhr || []).length > 0 && f.handy, 'Aufgabenfolie ' + f.id + ': Auftrag „Bearbeiten Sie jetzt …“ mit Uhr');
  f.bloecke.forEach((b) => {
    if (b.art === 'aufgaben') pruefe(b.nrs.every((nr) => NL.aufgaben[nr]), 'Aufgabenfolie ' + f.id + ': Aufgaben ' + b.nrs.join(', ') + ' wie im Arbeitsblatt');
    if (b.art === 'fall') pruefe(Array.isArray(NL[b.schluessel]) && NL[b.schluessel].length > 0, 'Aufgabenfolie ' + f.id + ': Fall aus dem Arbeitsblatt');
    if (b.art === 'dialog') pruefe((f.sprecher || []).length === 2, 'Aufgabenfolie ' + f.id + ': Dialog');
  });
  const folgend = S.folien[S.folien.indexOf(f) + 1];
  pruefe(folgend && folgend.typ === 'loesung', 'nach der Aufgabenfolie ' + f.id + ' kommt eine Musterlösung');
});

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

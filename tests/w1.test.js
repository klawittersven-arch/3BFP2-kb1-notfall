/* Woche 1 („Wenn der Kreislauf kämpft“): Texte von Arbeitsblatt und App gleich, Foliensatz stimmig,
 * Übungen in Handygröße (390 × 844) durchspielen – ohne Worker (Testgerüst tests/seiten/w1-uebung.html).
 * Die Folien selbst prüft: node folien.test.js w1
 * Start (im Ordner tests/): node w1.test.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { chromium, serverStarten, pruefe, ergebnis, MOBIL, beobachten } = require('./hilfen');

const WURZEL = path.resolve(__dirname, '..');
const DOCS = path.join(WURZEL, 'docs');
const ORDNER = path.join(__dirname, 'ergebnisse');
fs.mkdirSync(ORDNER, { recursive: true });
const AB = require(path.join(WURZEL, 'werkzeuge', 'ab_w1_texte.js'));

const k = { window: {} };
vm.createContext(k);
for (const d of ['w1/inhalte.js', 'w1/inhalte_stunde.js', 'w1/inhalte_nachlesen.js']) vm.runInContext(fs.readFileSync(path.join(DOCS, d), 'utf8'), k);
vm.runInContext('this.I = INHALTE; this.S = STUNDE; this.N = NACHLESEN;', k);
const { I, S, N } = k;
const gleich = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const nurText = (teile) => teile.map((t) => (typeof t === 'string' ? t : t.t || t.l)).join('');

/* ---------------- ohne Browser ---------------- */
console.log('Arbeitsblatt und App');
for (const m of Object.keys(AB.MERKSAETZE)) pruefe(gleich(AB.MERKSAETZE[m], I.merksaetze[m]), `Merksatz ${m} gleich in AB und App`);
pruefe(Object.keys(I.merksaetze).join() === 'aa1,aa2,aa3,aa4', 'App: Merksätze AA1–AA4');
pruefe(gleich(AB.ENTSCHEIDUNG, I.entscheidung.fragen), 'Einstiegsfragen E1–E3 gleich (Frage, Optionen, Lösung, Erklärung)');
const fall = I.markieren.faelle.maler;
const fallText = nurText(fall.teile);
pruefe(fallText.includes(AB.FALL.zitat.replace(/^„|“$/g, '')), 'Markieren: Christins Bericht wörtlich wie auf dem Arbeitsblatt');
const w2Stunde = fs.readFileSync(path.join(DOCS, 'inhalte_stunde.js'), 'utf8');
pruefe(w2Stunde.includes(AB.FALL.zitat.replace(/^„|“$/g, '')), 'derselbe Wortlaut wie im Fallauszug von Woche 2');

console.log('Markieren (AA1)');
const stellen = fall.teile.filter((t) => typeof t === 'object');
const hinweise = stellen.filter((t) => t.k);
pruefe(hinweise.length === 7 && stellen.length - hinweise.length === 7, '7 Frühzeichen, 7 Sätze ohne Frühzeichen', [hinweise.length, stellen.length]);
pruefe(['verhalten', 'beobachtung', 'messwert'].every((x) => hinweise.some((t) => t.k === x)), 'alle drei Kategorien kommen vor');
pruefe(hinweise.every((t) => I.markieren.kategorien[t.k]), 'jede Kategorie hat eine Beschriftung');
pruefe(stellen.every((t) => typeof t.w === 'string' && t.w.length > 5), 'jede Stelle hat eine Erklärung');
pruefe(I.markieren.hoechstensFalsch < stellen.length - hinweise.length, 'Schutz gegen Raten greift');

console.log('Ketten (AA2 a, AA3)');
for (const [name, seite, merksatz] of [['regelkreis', 'w1-regelkreis', 'aa2'], ['spirale', 'w1-spirale', 'aa3']]) {
  const kt = I.kette.ketten[name];
  pruefe(kt && kt.seite === seite && kt.merksatz === merksatz, `${name}: Seite ${seite}, Merksatz ${merksatz}`);
  pruefe(kt.schritte.length === 7, `${name}: 7 Schritte`);
  const ids = kt.schritte.map((s) => s.id).concat(kt.ablenker.map((a) => a.id));
  pruefe(new Set(ids).size === ids.length && ids.every((id) => /^[a-z0-9-]{1,16}$/.test(id)), `${name}: Kennungen eindeutig und für den Worker gültig`);
  pruefe(kt.ablenker.every((a) => a.warum && a.bei.length && a.bei.every((b) => b >= 1 && b < kt.schritte.length)), `${name}: jede Fehlerkarte mit Begründung und gültigem Schritt`);
  pruefe(kt.schritte.slice(1).every((s) => s.tipp), `${name}: jeder Schritt hat einen Tipp`);
  pruefe(kt.mindestensErsterVersuch <= kt.schritte.length - 1, `${name}: Mindestzahl erreichbar`);
}

console.log('Quiz (AA4 a)');
const q = I.karten.quiz.frueh;
pruefe(q.seite === 'w1-frueh' && q.merksatz === 'aa4', 'Seite w1-frueh, Merksatz aa4');
pruefe(q.karten.length === 9 && q.karten.every((c) => q.optionen.some((o) => o.k === c.richtig) && c.warum), '9 Karten, jede mit gültiger Lösung und Erklärung');
pruefe(q.karten.some((c) => c.richtig === 'F') && q.karten.some((c) => c.richtig === 'S'), 'Früh- und Spätzeichen kommen vor');
pruefe(!q.karten.some((c) => /Puls 1[01]\d\b/.test(c.text) && c.richtig === 'S'), 'kein Puls zwischen 100 und 119 als Spätzeichen');

console.log('Raster (AA5)');
pruefe(I.raster.gruppen.reduce((s, g) => s + g.max, 0) === 7, 'AA5: 7 Punkte');
const nr = I.raster.gruppen.map((g) => g.titel.slice(0, 3));
pruefe(nr.join() === '5.1,5.2,5.3', 'Gruppen 5.1, 5.2, 5.3');
I.raster.gruppen.forEach((g, i) => {
  const a = N.aufgaben[nr[i]];
  pruefe(a && a.punkte === g.max, `${nr[i]}: Punkte wie auf dem Arbeitsblatt`, [a && a.punkte, g.max]);
  pruefe(g.kriterien.reduce((s, x) => s + x.punkte, 0) >= g.max, `${nr[i]}: Höchstpunktzahl erreichbar`);
});
pruefe(I.raster.speicher === 'kb1nf_w1_raster', 'eigener Speicher (nicht der von Woche 2)');
pruefe(/112\/90/.test(N.aufgaben['5.2'].text) && !/in dieser Phase/.test(N.aufgaben['5.2'].text), '5.2 ähnlich, aber nicht wortgleich mit der Klassenarbeit');

console.log('Foliensatz (w1/inhalte_stunde.js)');
const ids = S.folien.map((f) => f.id);
pruefe(new Set(ids).size === ids.length, 'jede Folie hat eine eigene Kennung');
pruefe(!ids.includes('aa1') && ids.every((id) => /^[a-z0-9-]{1,24}$/.test(id)), 'Kennungen gültig, keine Sonderfolie „aa1“ aus Woche 2');
pruefe(ids[ids.length - 1] === 'ende', 'letzte Folie „ende“');
pruefe(S.handySeite === 'w1.html' && S.speicher === 'w1', 'eigene Handyseite und eigener Raumspeicher');
const start = S.folien[0];
pruefe(start.id === 'start' && start.sprung && start.sprung.folie === 'blatt2' && ids.includes('blatt2'), 'Willkommen: Knopf „Heute mit Arbeitsblatt 2 beginnen“ führt zu blatt2');
const ergebnisFolie = S.folien.find((f) => f.id === 'checkout-ergebnis');
pruefe(ergebnisFolie.titelNurEnde && ergebnisFolie.unterNurEnde && ergebnisFolie.handy.textNurEnde && S.handy.bilanzNurEnde, 'Check-out auch ohne Stimmen vom Einstieg (Stunde geteilt)');
const beamerJs = fs.readFileSync(path.join(DOCS, 'beamer.js'), 'utf8');
const modulSeiten = { markieren: I.markieren.seite, kette: null, karten: null, raster: null };
for (const f of S.folien) {
  pruefe(new RegExp('\\b' + f.typ + ': folie').test(beamerJs), `Folie ${f.id}: Typ „${f.typ}“ bekannt`);
  const h = f.handy || {};
  if (h.modul) pruefe(Object.prototype.hasOwnProperty.call(modulSeiten, h.modul) && fs.existsSync(path.join(DOCS, h.modul + '.js')), `Folie ${f.id}: Übung ${h.modul}.js`);
  (f.aufgaben || []).forEach((a) => {
    const nrs = typeof a === 'string' ? [a] : a.nrs;
    const loes = typeof a === 'string' ? a : a.loesung;
    pruefe(nrs.every((x) => N.aufgaben[x]), `Folie ${f.id}: Aufgabe ${nrs.join(', ')} im Nachlesen`);
    if (f.typ === 'loesung') pruefe(!!N.loesungen[loes], `Folie ${f.id}: Lösung „${loes}“ im Nachlesen`);
  });
  if (f.typ === 'fortschritt' && f.fehlerArt) {
    const erwartet = { markieren: [I.markieren.seite, hinweise.length], kette: f.kette && [I.kette.ketten[f.kette].seite, I.kette.ketten[f.kette].schritte.length - 1], karten: f.quiz && [I.karten.quiz[f.quiz].seite, I.karten.quiz[f.quiz].karten.length] }[f.fehlerArt];
    pruefe(erwartet && f.seite === erwartet[0] && f.gesamt === erwartet[1], `Folie ${f.id}: Seite und Schrittzahl wie in der Übung`, [f.seite, f.gesamt, erwartet]);
    const p = f.handy && f.handy.params || {};
    pruefe((p.kette || p.quiz || p.fall) === (f.kette || f.quiz || f.fall), `Folie ${f.id}: Handy öffnet dieselbe Übung`);
  }
}

console.log('Keine Hinweise für Lehrkräfte in den Schülerdateien');
for (const d of ['w1/inhalte.js', 'w1/inhalte_stunde.js', 'w1/inhalte_nachlesen.js', 'w1.html', 'beamer-w1.html']) {
  const t = fs.readFileSync(path.join(DOCS, d), 'utf8').replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$|,\s+\/\/.*$|<!--[\s\S]*?-->/gm, ',');
  const treffer = t.match(/Examen|Ich-kann|Klausurtraining|Erwartungshorizont|Woche [2-9]|\bSeite \d|\bS\. \d|Klassenarbeit/g);
  pruefe(!treffer, `${d}: keine Seitenzahlen, kein Examen/Ich-kann/Klassenarbeit`, treffer);
}

console.log('Offline-Speicher und QR-Code');
const sw = fs.readFileSync(path.join(DOCS, 'sw.js'), 'utf8');
for (const d of ['w1.html', 'beamer-w1.html', 'w1/inhalte.js', 'w1/inhalte_stunde.js', 'w1/inhalte_nachlesen.js', 'kette.js', 'karten.js']) pruefe(sw.includes(`'${d}'`), `sw.js kennt ${d}`);
pruefe(fs.existsSync(path.join(WURZEL, 'qr', 'qr_w1_stunde.png')), 'QR-Code qr/qr_w1_stunde.png vorhanden');
pruefe(fs.existsSync(path.join(DOCS, AB.SEITEN.stunde)), `Ziel des QR-Codes existiert: ${AB.SEITEN.stunde}`);

/* ---------------- im Browser (Handygröße) ---------------- */
(async () => {
  const { server, basis } = await serverStarten();
  const browser = await chromium.launch();
  const kontext = await browser.newContext({ ...MOBIL, deviceScaleFactor: 1 });
  const protokoll = { konsole: [], extern: [] };
  let ok = false;
  const breitOk = (s) => s.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  const meldungen = (s) => s.evaluate(() => window.MELDUNGEN);
  try {
    /* AA1 Markieren */
    console.log('Handy: AA1 Frühzeichen markieren');
    let s = await kontext.newPage();
    beobachten(s, protokoll, 'markieren');
    await s.goto(basis + 'w1-uebung.html?modul=markieren&fall=maler');
    const knoepfe = await s.$$('.markierbar');
    pruefe(knoepfe.length === stellen.length, `${stellen.length} antippbare Stellen`);
    pruefe(await breitOk(s), 'nichts ragt seitlich heraus');
    // erster Versuch: ein Ablenker markiert, der Blutdruck übersehen
    const iAblenker = stellen.findIndex((t) => !t.k);
    const iRR = stellen.findIndex((t) => /Blutdruck/.test(t.t));
    for (let i = 0; i < stellen.length; i++) if ((stellen[i].k && i !== iRR) || i === iAblenker) await knoepfe[i].click();
    await s.click(`button:has-text("${I.markieren.pruefen}")`);
    let m = await meldungen(s);
    let letzte = m[m.length - 1];
    const teilIndex = (j) => fall.teile.indexOf(stellen[j]);
    pruefe(letzte[0] === 'w1-befunde' && letzte[3] === 'arbeitet', 'Meldung an den Beamer: Seite w1-befunde, arbeitet', letzte);
    pruefe(gleich((letzte[4] || []).slice().sort(), ['u' + teilIndex(iRR), 'x' + teilIndex(iAblenker)].sort()), 'erster Versuch: falsch markiert (x…) und übersehen (u…) gemeldet', letzte[4]);
    pruefe((await s.textContent('.herzen')) === '❤️🤍', 'Prüfen mit Fehlern → ein Leben weg (❤️🤍)');
    // korrigieren
    await (await s.$$('.markierbar'))[iAblenker].click();
    await (await s.$$('.markierbar'))[iRR].click();
    await s.click(`button:has-text("${I.markieren.pruefen}")`);
    await s.waitForSelector('.merksatz');
    pruefe((await s.textContent('.merksatz')).includes('Aussagen und Verhalten'), 'fertig → Merksatz AA1');
    m = await meldungen(s); letzte = m[m.length - 1];
    pruefe(letzte[1] === 7 && letzte[2] === 7 && letzte[3] === 'fertig' && letzte[4].length === 2, 'Meldung: 7 von 7, fertig, Fehler des ersten Versuchs bleiben', letzte);
    await s.screenshot({ path: path.join(ORDNER, 'w1_markieren.png'), fullPage: true });
    await s.close();

    /* AA2 a Regelkreis: einmal falsch, sonst richtig */
    // Regelkreis: ein Fehler (ein Leben weg), sonst richtig
    {
      const name = 'regelkreis', kt = I.kette.ketten[name];
      console.log('Handy: Kette regelkreis');
      s = await kontext.newPage();
      beobachten(s, protokoll, 'kette-' + name);
      await s.goto(basis + `w1-uebung.html?modul=kette&kette=${name}`);
      pruefe((await s.textContent('h1')) === kt.titel, 'Titel der Kette');
      pruefe((await s.textContent('.schutz-regel')).includes('2 Leben') && (await s.textContent('.herzen')) === '❤️❤️', 'Regel „2 Leben“ und ❤️❤️ sichtbar');
      pruefe(!(await s.$('.knopf-leise')), 'kein „Noch einmal üben“ mitten in der Aufgabe');
      let fehlerkarte = false, zuFrueh = false;
      for (let schritt = 1; schritt < kt.schritte.length; schritt++) {
        const opt = await s.$$eval('.reihe-auswahl button', (b) => b.map((x) => x.dataset.karte));
        pruefe(opt.length === 3 && opt.includes(kt.schritte[schritt].id), `Schritt ${schritt + 1}: drei Karten, die richtige ist dabei`);
        if (schritt === 1) {
          const falsch = opt.find((id) => id !== kt.schritte[schritt].id);
          await s.click(`.reihe-auswahl button[data-karte="${falsch}"]`);
          const rm = await s.textContent('.rueckmeldung.ist-falsch');
          if (rm.includes(I.kette.fehlerkarte)) fehlerkarte = true; else zuFrueh = true;
          pruefe((await s.textContent('.herzen')) === '❤️🤍', 'Fehler → ein Leben weg (❤️🤍)');
        }
        await s.click(`.reihe-auswahl button[data-karte="${kt.schritte[schritt].id}"]`);
      }
      pruefe(await breitOk(s), 'nichts ragt seitlich heraus');
      m = await meldungen(s); letzte = m[m.length - 1];
      pruefe(fehlerkarte || zuFrueh, 'falsche Karte → Rückmeldung mit Begründung oder Tipp');
      await s.waitForSelector('.merksatz');
      pruefe((await s.textContent('.merksatz')).includes(I.merksaetze[kt.merksatz][1].l), 'fertig → Merksatz AA2');
      pruefe(letzte[0] === kt.seite && letzte[1] === 6 && letzte[2] === 6 && letzte[3] === 'fertig' && letzte[4].length === 1, 'Meldung: 6 von 6, fertig, ein Fehler', letzte);
      pruefe(!!(await s.$('.knopf-leise')), 'nach dem Merksatz: „Noch einmal üben“');
      await s.screenshot({ path: path.join(ORDNER, 'w1_kette_regelkreis.png'), fullPage: true });
      await s.close();
    }

    // Schockspirale: drei Fehler → alle Leben verbraucht → Lesepause → von vorn
    {
      const name = 'spirale', kt = I.kette.ketten[name];
      console.log('Handy: Kette spirale (3 Fehler → Lesepause → von vorn)');
      s = await kontext.newPage();
      beobachten(s, protokoll, 'kette-' + name);
      await s.goto(basis + `w1-uebung.html?modul=kette&kette=${name}`);
      const gewaehlt = [];
      for (let schritt = 1; schritt <= 3; schritt++) {
        const opt = await s.$$eval('.reihe-auswahl button', (b) => b.map((x) => x.dataset.karte));
        const falsch = opt.find((id) => id !== kt.schritte[schritt].id);
        gewaehlt.push(falsch);
        await s.click(`.reihe-auswahl button[data-karte="${falsch}"]`);
        if (schritt < 3) await s.click(`.reihe-auswahl button[data-karte="${kt.schritte[schritt].id}"]`);
      }
      await s.waitForSelector('.schutz-pause');
      pruefe((await s.textContent('.schutz-pause h2')).includes('Zu viele Fehler') && (await s.textContent('.schutz-pause')).includes('Informationstext 2'), '3. Fehler → Lesepause mit Hinweis „Informationstext 2“');
      m = await meldungen(s); letzte = m[m.length - 1];
      pruefe(letzte[3] === 'durchklicken' && gleich(letzte[4], [...new Set(gewaehlt)]), 'Beamer: „↻ neu“ (durchklicken), Fehler gemeldet', letzte);
      await s.screenshot({ path: path.join(ORDNER, 'w1_lesepause.png') });
      await s.click('.schutz-pause button');
      await s.waitForSelector('.reihe-auswahl');
      pruefe((await s.$$eval('.reihe-gelegt li', (l) => l.length)) === 1 && (await s.textContent('.herzen')) === '❤️❤️', 'nach der Pause: von vorn, wieder ❤️❤️');
      for (let schritt = 1; schritt < kt.schritte.length; schritt++) await s.click(`.reihe-auswahl button[data-karte="${kt.schritte[schritt].id}"]`);
      await s.waitForSelector('.merksatz');
      m = await meldungen(s); letzte = m[m.length - 1];
      pruefe(letzte[3] === 'fertig' && gleich(letzte[4], [...new Set(gewaehlt)]), 'zweiter Durchgang richtig → fertig, Fehler des ersten Durchgangs bleiben', letzte);
      await s.close();
    }

    // Zu schnell getippt (Lesezeit wie im Unterricht): Warnung, Wahl zählt nicht; 3× → kurze Lesepause, dann dieselbe Stelle
    {
      console.log('Handy: zu schnell getippt (Lesezeiten wie im Unterricht)');
      s = await kontext.newPage();
      beobachten(s, protokoll, 'zu-schnell');
      await s.goto(basis + 'w1-uebung.html?modul=karten&quiz=frueh&zeit=1');
      await s.click('.quiz-optionen button >> nth=0');
      pruefe((await s.textContent('.schutz-warnung')).includes('Langsam') && (await s.textContent('.schutz-warnung')).includes('Warnung 1 von 3'), 'sofort getippt → „Langsam! … Warnung 1 von 3“');
      pruefe(!(await s.$('.quiz-karte .rueckmeldung:not(.schutz-warnung)')) && (await meldungen(s)).every((x) => x[1] === 0), 'die Antwort zählt nicht');
      await s.click('.quiz-optionen button >> nth=0');
      await s.click('.quiz-optionen button >> nth=0');
      await s.waitForSelector('.schutz-pause');
      pruefe((await s.textContent('.schutz-pause h2')).includes('Zu schnell') && await s.isDisabled('.schutz-pause button'), '3× zu schnell → Lesepause, Knopf gesperrt');
      pruefe(/noch \d+ Sekunden/.test(await s.textContent('.schutz-countdown')), 'Countdown der Lesepause');
      await s.screenshot({ path: path.join(ORDNER, 'w1_zu_schnell.png') });
      await s.close();
      // Markieren: „Prüfen“ sofort → Warnung, nichts geprüft
      s = await kontext.newPage();
      beobachten(s, protokoll, 'zu-schnell-markieren');
      await s.goto(basis + 'w1-uebung.html?modul=markieren&fall=maler&zeit=1');
      await s.click(`button:has-text("${I.markieren.pruefen}")`);
      pruefe((await s.textContent('.schutz-warnung')).includes('Langsam') && !(await s.$('.markierbar.fehlt')), 'Markieren: sofort „Prüfen“ → Warnung, nichts verraten');
      await s.close();
    }

    /* AA4 a Quiz */
    console.log('Handy: AA4 a Früh- oder Spätzeichen');
    s = await kontext.newPage();
    beobachten(s, protokoll, 'karten');
    await s.goto(basis + 'w1-uebung.html?modul=karten&quiz=frueh');
    for (let i = 0; i < q.karten.length; i++) {
      const c = q.karten[i];
      const wahl = i === 0 ? q.optionen.find((o) => o.k !== c.richtig).k : c.richtig;
      await s.click(`.quiz-optionen button[data-option="${wahl}"]`);
      const rm = await s.$eval('.rueckmeldung', (e) => e.className);
      pruefe(rm.includes(i === 0 ? 'ist-falsch' : 'ist-richtig'), `Karte ${i + 1}: ${i === 0 ? 'falsch → Rückmeldung mit Lösung' : 'richtig'}`);
      if (i === 0) await s.screenshot({ path: path.join(ORDNER, 'w1_quiz_falsch.png') });
      await s.click('.quiz-weiter');
    }
    await s.waitForSelector('.merksatz');
    pruefe((await s.textContent('.merksatz')).includes('Schockindex'), 'fertig → Merksatz AA4');
    pruefe(await breitOk(s), 'nichts ragt seitlich heraus');
    m = await meldungen(s); letzte = m[m.length - 1];
    pruefe(letzte[0] === 'w1-frueh' && letzte[1] === 9 && letzte[3] === 'fertig' && gleich(letzte[4], [q.karten[0].id]), 'Meldung: 9 von 9, fertig, Fehler = erste Karte', letzte);
    await s.close();

    /* AA5 Raster */
    console.log('Handy: AA5 Bewertungsraster');
    s = await kontext.newPage();
    beobachten(s, protokoll, 'raster');
    await s.goto(basis + 'w1-uebung.html?modul=raster');
    pruefe((await s.$$('.karte.raster h2')).length === 4, 'drei Aufgaben und der Kasten „Fehler“');
    for (const cb of await s.$$('.kriterien input[type=checkbox]')) await cb.check();
    pruefe((await s.textContent('.gesamtpunkte')).includes('7'), 'alles abgehakt → 7 Punkte', await s.textContent('.gesamtpunkte'));
    await s.check('.fehlerbox input[type=checkbox]');
    const nachFehler = await s.textContent('.gesamtpunkte');
    pruefe(/\b5\b/.test(nachFehler), 'Fehler „Blutdruck normal = kein Schock“ sperrt Begründung und Bewertung → 5 Punkte', nachFehler);
    pruefe(await breitOk(s), 'nichts ragt seitlich heraus');
    await s.screenshot({ path: path.join(ORDNER, 'w1_raster.png'), fullPage: true });
    await s.close();

    pruefe(protokoll.konsole.length === 0, 'keine Fehler in der Konsole', protokoll.konsole);
    pruefe(protokoll.extern.length === 0, 'keine Anfragen an fremde Adressen', protokoll.extern);
    ok = ergebnis();
  } finally {
    await browser.close();
    server.close();
  }
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });

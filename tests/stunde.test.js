/* Beamer-Stunde – Ende-zu-Ende-Test mit lokalem Cloudflare-Worker (wrangler dev).
 * Ein „Laptop“ (1600 × 900) steuert die Folien, sechs „Handys“ (390 × 844) folgen.
 * Ein Handy meldet sich wie mit dem Arbeitsblatt-QR-Code an (Raumcode von Hand) und nutzt die
 * Reserve ohne Live-Verbindung (?verbindung=abfrage).
 * Voraussetzung: im Ordner worker/ einmal „npm install“. Start (im Ordner tests/): node stunde.test.js */
'use strict';
const path = require('path');
const fs = require('fs');
const H = require('./hilfen');

const ORDNER = path.join(__dirname, 'ergebnisse');
async function bis(seite, fn, arg, ms = 15000) {
  try { await seite.waitForFunction(fn, arg, { timeout: ms, polling: 200 }); return true; } catch (e) { return false; }
}
const folieIst = (lap, id) => bis(lap, (x) => { const f = document.querySelector('.folie'); return f && f.dataset.folie === x; }, id);
const titelIst = (h, text) => bis(h, (t) => document.getElementById('titel').textContent.includes(t), text);
const textDa = (h, text) => bis(h, (t) => document.body.innerText.includes(t), text);

(async () => {
  const worker = await H.workerStarten(8795);
  const { server, basis } = await H.serverStarten({ fortschrittUrl: worker.url });
  const browser = await H.chromium.launch();
  const protokoll = { konsole: [], extern: [] };
  let ok = false;
  try {
    const S = await (async () => {
      const p = await browser.newPage();
      await p.goto(basis + 'w2-nachlesen.html');
      const s = await p.evaluate(() => ({ folien: STUNDE.folien, check: STUNDE.check, fragen: INHALTE.entscheidung.fragen, handy: STUNDE.handy }));
      await p.close();
      return s;
    })();

    console.log('\n== Beamer: Raum starten');
    const lctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
    const lap = await lctx.newPage();
    H.beobachten(lap, protokoll, 'beamer');
    await lap.goto(basis + 'beamer.html');
    await lap.click('#starten');
    H.pruefe(await folieIst(lap, 'start'), 'Folie 1: Willkommen mit QR-Code');
    const raum = await lap.evaluate(() => JSON.parse(localStorage.getItem('kb1nf_lehrer_raum')).raum);
    H.pruefe(/^\d{4}$/.test(raum) && (await lap.$$('.qr-gross canvas, .qr-gross img')).length > 0, `QR-Code mit Raumcode ${raum}`);
    const weiter = async () => { await lap.click('#weiter'); };

    console.log('\n== Nachlese ist während der Stunde gesperrt');
    const nctx = await browser.newContext(H.MOBIL);
    const nach = await nctx.newPage();
    H.beobachten(nach, protokoll, 'nachlese');
    await nach.goto(basis + 'w2-nachlesen.html');
    H.pruefe(await textDa(nach, 'Noch gesperrt'), 'Nachlese-Seite zeigt „Noch gesperrt“');
    H.pruefe((await nach.$$('.abschnitt')).length === 0, 'keine Inhalte sichtbar, solange die Stunde läuft');

    console.log('\n== Handys melden sich an');
    const namen = ['Mia', 'Ben', 'Lea', 'Tom', 'Ayse', 'Jonas'];
    const handys = [];
    for (let i = 0; i < namen.length; i++) {
      const ctx = await browser.newContext(H.MOBIL);
      const h = await ctx.newPage();
      H.beobachten(h, protokoll, namen[i]);
      if (i < 5) {
        await h.goto(basis + 'w2.html?raum=' + raum);
        H.pruefe(i > 0 || (await h.$('#anmelde-raum')) === null, 'QR-Code am Beamer: nur der Vorname wird abgefragt');
      } else {
        await h.goto(basis + 'w2.html?verbindung=abfrage');
        await h.fill('#anmelde-raum', raum);
      }
      await h.fill('#anmelde-name', namen[i]);
      await h.click('.anmelde-los');
      handys.push(h);
    }
    for (const h of handys) await textDa(h, 'Sie sind dabei');
    H.pruefe(await textDa(handys[0], 'Sie sind dabei, Mia'), 'Handy: „Sie sind dabei, Mia!“');
    H.pruefe(await textDa(handys[5], 'Sie sind dabei, Jonas'), 'Handy mit Raumcode von Hand und ohne Live-Verbindung ist dabei');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.name-chip').length === 6), 'Beamer zeigt 6 Namen');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_01_start.png') });

    console.log('\n== Blatt 1 austeilen, Einstieg');
    await weiter();
    H.pruefe(await folieIst(lap, 'blatt1') && (await lap.textContent('.blatt-nr')) === '1', 'Weiter → „Sie erhalten jetzt Blatt 1“');
    H.pruefe(await textDa(handys[0], 'Blatt 1'), 'Handy: Blatt 1 kommt');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_02_blatt1.png') });
    await weiter();
    H.pruefe(await folieIst(lap, 'fall'), 'Weiter → Frau Maler');
    H.pruefe(await textDa(handys[0], 'Leitfrage'), 'Handy zeigt die Leitfrage');
    H.pruefe(await textDa(handys[5], 'Leitfrage'), 'Handy ohne Live-Verbindung folgt ebenfalls');
    await weiter();
    H.pruefe(await folieIst(lap, 'einstieg'), 'Folie 3: Wie hätten Sie gehandelt?');
    H.pruefe(await textDa(handys[0], 'ersten Notfall'), 'Handy: gleich kommt der erste Notfall');
    // Notfall für Notfall: die Lehrkraft zeigt ihn, alle stimmen gleichzeitig ab, dann „Ergebnisse anzeigen“
    // (gerade Handys tippen falsch und „vermute nur“, ungerade richtig und „sicher“)
    for (let j = 0; j < S.fragen.length; j++) {
      const f = S.fragen[j];
      await weiter();
      if (j === 0) {
        H.pruefe(await bis(lap, () => !!document.querySelector('.notfall-frage')) && (await lap.$$('.abst-zahl')).length === 0, 'Beamer: Notfall 1 groß, noch keine Verteilung');
        H.pruefe((await lap.textContent('#weiter')).includes('Ergebnisse anzeigen'), 'Weiter-Knopf: „Ergebnisse anzeigen“');
      }
      for (let i = 0; i < handys.length; i++) {
        const h = handys[i];
        const da = await textDa(h, 'Notfall ' + (j + 1) + ' von ' + S.fragen.length);
        if (j === 0) H.pruefe(da, namen[i] + ': Notfall 1 am Handy');
        const b = i % 2 ? f.richtig : f.optionen.find((o) => o.charAt(0) !== f.richtig).charAt(0);
        await h.click('.notfall-antworten .antwort[data-option="' + b + '"]');
        await h.click('.sicher-knoepfe .antwort[data-sicher="' + (i % 2) + '"]');
      }
      H.pruefe(await bis(lap, () => /^6 von \d+ haben abgestimmt/.test((document.querySelector('.abgestimmt') || {}).textContent || '')), 'Notfall ' + (j + 1) + ': „6 von … haben abgestimmt“');
      if (j === 0) await lap.screenshot({ path: path.join(ORDNER, 'stunde_03_notfall.png') });
      await weiter();
      if (j === 0) {
        H.pruefe(await bis(lap, () => !!document.querySelector('.abst-frage.gross')) && (await lap.$$('.abst-option.richtig')).length === 0, 'Ergebnisse anzeigen: Verteilung, keine Auflösung');
        H.pruefe(await textDa(handys[0], 'Auflösung gibt es am Ende'), 'Handy: Ergebnis vorne, Auflösung erst am Ende');
        H.pruefe(await textDa(handys[0], 'Ihre Vermutung:'), 'Handy zeigt die eigene Vermutung');
        await lap.screenshot({ path: path.join(ORDNER, 'stunde_03_ergebnis.png') });
        await handys[0].screenshot({ path: path.join(ORDNER, 'handy_03_notfall.png'), fullPage: true });
      }
    }
    await weiter();
    H.pruefe(await folieIst(lap, 'einstieg-ergebnis'), 'Folie 4: Ergebnis');
    H.pruefe(S.fragen.length === 4 && (await lap.$$('.abst-frage')).length === 4 && (await lap.$$('.abst-frage.stern')).length === 1, '4 Karten, eine als „größte Uneinigkeit“ markiert');
    H.pruefe((await lap.$$('.abst-option.richtig')).length === 0, 'Einstieg: keine Auflösung');
    await lap.click('.abst-frage >> nth=3');
    H.pruefe((await lap.$$('.abst-frage.gross')).length === 1, 'Karte anklicken → groß');
    await lap.keyboard.press('Escape');
    H.pruefe((await lap.$$('.abst-frage')).length === 4, 'Esc → zurück zu allen Karten');
    await weiter();
    H.pruefe(await folieIst(lap, 'murmeln'), 'Folie 5: Murmeln');
    H.pruefe(await bis(lap, () => /Murmeln/i.test((document.querySelector('.uhr-label') || {}).textContent || '')), 'Murmel-Uhr startet automatisch');
    H.pruefe(await textDa(handys[0], 'Ihre Vermutung:'), 'Handy zeigt die Murmel-Frage mit der eigenen Vermutung');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_05_murmeln.png') });
    await handys[0].screenshot({ path: path.join(ORDNER, 'handy_05_murmeln.png') });
    await weiter();
    H.pruefe(await folieIst(lap, 'ziel'), 'Folie 6: Lernziel und Fahrplan');

    console.log('\n== Gruppenpuzzle');
    await weiter();
    H.pruefe(await folieIst(lap, 'puzzle'), 'Folie 7: Gruppen einteilen');
    H.pruefe(await textDa(handys[0], 'Gleich teilt Ihre Lehrkraft'), 'Handy wartet auf die Einteilung');
    await lap.click('button:has-text("+ Person ohne Handy")');
    await lap.fill('#ebene input', 'Karl');
    await lap.click('#ebene button[type=submit]');
    await lap.click('button:has-text("Gruppen zufällig einteilen")');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.g-karte').length === 2), '7 Personen → 2 Stammgruppen am Beamer');
    H.pruefe(await textDa(lap, 'Karl'), 'Person ohne Handy steht in einer Gruppe');
    H.pruefe(await bis(handys[0], () => !!document.querySelector('.gruppe-gross')), 'Handy zeigt die eigene Stammgruppe in Gruppenfarbe');
    const gruppeMia = await handys[0].$eval('.gruppe-gross .name', (e) => e.textContent);
    await handys[0].screenshot({ path: path.join(ORDNER, 'handy_07_gruppe.png') });
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_07_gruppen.png') });

    await weiter();
    H.pruefe(await folieIst(lap, 'aa1'), 'Folie 8: Expertenteams');
    for (let i = 0; i < handys.length; i++) {
      const h = handys[i];
      H.pruefe(await bis(h, () => !!document.querySelector('.team-kasten') && document.querySelectorAll('.markierbar').length > 0), `${namen[i]}: Expertenteam und Fall zum Markieren`);
    }
    H.pruefe(await textDa(handys[0], 'Setzen Sie sich mit') || await textDa(handys[0], 'allein in Ihrem Team'), 'Handy nennt die Namen des Expertenteams');
    H.pruefe(await handys[0].evaluate(() => {
      const info = document.querySelector('#vor-uebung details.info'), fall = document.querySelector('.markierbar');
      return !!info && info.open && /^a\) Infotext/.test(info.querySelector('summary').textContent) && !!(info.compareDocumentPosition(fall) & Node.DOCUMENT_POSITION_FOLLOWING);
    }), 'Expertenrunde: a) Infotext (offen) steht vor b) Fall markieren');
    const fertigKnopf = await handys[0].$('#fertig-team');
    H.pruefe(fertigKnopf && await fertigKnopf.isDisabled(), '„Unsere Spalte ist fertig“ erst nach dem Experten-Check');
    for (let i = 0; i < handys.length; i++) {
      const h = handys[i];
      const rolle = await h.evaluate(() => JSON.parse(sessionStorage.getItem('kb1nf_stunde_stand')).stand.puzzle.rolle);
      for (let q = 0; q < 3; q++) {
        const frage = S.check[rolle][q];
        const k = await h.$$('.check-frage');
        if (i === 0 && q === 0) {
          const falsch = (frage.richtig + 1) % frage.optionen.length;
          await (await k[q].$$('.antwort'))[falsch].click();
          H.pruefe(await textDa(h, 'Noch nicht'), 'Experten-Check: falsche Antwort → Hinweis');
        }
        const k2 = await h.$$('.check-frage');
        await (await k2[q].$$('.antwort'))[frage.richtig].click();
      }
      H.pruefe(await bis(h, () => { const b = document.getElementById('fertig-team'); return b && !b.disabled; }), `${namen[i]}: Experten-Check bestanden → Fertig-Knopf frei`);
      if (i === 0) await h.screenshot({ path: path.join(ORDNER, 'handy_08_experte.png'), fullPage: true });
      await h.click('#fertig-team');
      if (i === 0) {
        H.pruefe(await textDa(h, 'Warten Sie auf die anderen Teams'), 'nach „fertig“: warten auf die anderen Teams');
        H.pruefe(await bis(lap, () => document.querySelectorAll('.t-karte .haken').length >= 1), 'Beamer zeigt den Haken');
      }
    }
    H.pruefe(await folieIst(lap, 'aa1-merksatz'), 'alle Teams fertig → Beamer wechselt automatisch zu „Merksatz AA1 lesen“');
    H.pruefe(await textDa(handys[0], 'Lesen Sie mit'), 'Handy: Merksatz AA1 auf dem Arbeitsblatt mitlesen');
    H.pruefe((await lap.$$('.merksatz-satz .merksatz-wort')).length === 3 && (await lap.$$('.merksatz-satz .aufdeck')).length === 0, 'Lesefolie: ganzer Merksatz, 3 Schlüsselwörter hervorgehoben, nichts zum Aufdecken');
    await lap.click('.merksatz-folie');
    H.pruefe(await bis(lap, () => !!document.querySelector('.gross-merksatz')), 'Merksatz anklicken → groß');
    await lap.keyboard.press('Escape');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_09_merksatz.png') });
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2a'), 'Weiter: Stammgruppen');
    H.pruefe(await bis(handys[0], () => !!document.querySelector('.stamm-kopf')), 'Handys zeigen die Stammgruppe');
    H.pruefe((await handys[0].$eval('.stamm-kopf .name', (e) => e.textContent)) === gruppeMia, 'dieselbe Stammgruppe wie bei der Einteilung');
    await lap.click('button:has-text("Erklär-Uhr starten")');
    H.pruefe(await textDa(handys[0], 'erklärt') || await textDa(handys[0], 'Sie sind dran'), 'Handy zeigt, wer gerade erklärt');
    await handys[0].screenshot({ path: path.join(ORDNER, 'handy_09_stamm.png'), fullPage: true });
    for (const h of handys) await h.click('#fertig-stamm');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.g-karte.fertig').length === 2), 'Beamer: beide Stammgruppen „fertig“');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_09_stamm.png') });

    console.log('\n== Tabelle sichern (aufdecken am Beamer)');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2a-sichern-a'), 'nach den Stammgruppen: Tabelle sichern, Spalte A');
    H.pruefe((await lap.$$('.tabelle-spalte .aufdeck')).length === 6 && (await lap.$$('.tabelle-spalte .aufdeck.offen')).length === 0 && (await lap.textContent('.spalte-marke')) === 'A hypovolämisch', 'Spalte A: 6 Zeilen wie im AB, alle verdeckt');
    const mass = await lap.evaluate(() => { const t = document.querySelector('.tabelle-spalte'); return { schrift: parseFloat(getComputedStyle(document.querySelector('.ts-zelle')).fontSize) * (parseFloat(t.style.zoom) || 1), breite: t.offsetWidth }; });
    H.pruefe(mass.schrift >= 26 && mass.breite > 1300, 'große Schrift, die Spalte nutzt die ganze Breite', mass);
    await lap.click('.tabelle-spalte .aufdeck >> nth=0');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.tabelle-spalte .aufdeck.offen').length === 1), 'Zelle anklicken deckt die Lösung auf');
    await lap.click('.tabelle-spalte .aufdeck.offen');
    H.pruefe(await bis(lap, () => !document.getElementById('ebene').hidden && !!document.querySelector('.gross-ansicht .gross-text')), 'noch einmal anklicken: Lösung groß zum Abschreiben');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_10_zelle_gross.png') });
    await lap.keyboard.press('Escape');
    H.pruefe(await bis(lap, () => document.getElementById('ebene').hidden), 'Esc schließt die Großansicht');
    await lap.click('button:has-text("Alle aufdecken")');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_10_tabelle_a.png') });
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2a-sichern-b') && (await lap.$$('.tabelle-spalte .aufdeck')).length === 6 && (await lap.textContent('.spalte-marke')) === 'B anaphylaktisch', 'dann Spalte B (6 Zeilen)');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2a-sichern-c') && (await lap.$$('.tabelle-spalte .aufdeck')).length === 7 && (await lap.textContent('.tabelle-spalte')).includes('Gemeinsamkeit'), 'dann Spalte C mit der Gemeinsamkeit (7 Zeilen)');
    await lap.click('button:has-text("Alle aufdecken")');
    H.pruefe(await lap.evaluate(() => { const g = document.getElementById('inhalt').getBoundingClientRect().bottom + 2; return [...document.querySelectorAll('.folie *')].every((e) => e.getBoundingClientRect().bottom <= g); }), 'Spalte C aufgedeckt passt auf die Folie');
    H.pruefe(await lap.evaluate(() => !(parseFloat(document.querySelector('.tabelle-spalte').style.zoom) < 0.9)), 'Spalte C (mit Gemeinsamkeit) aufgedeckt höchstens leicht verkleinert');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_10_tabelle_c.png') });
    H.pruefe(await textDa(handys[0], 'Musterlösung vorne'), 'Handy: Tabelle mit der Musterlösung am Beamer vergleichen');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2b-intro') && (await lap.$$('.warum-box')).length === 1, 'Erklärfolie zum Schockform-Detektiv (was und warum)');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_11_detektiv_erklaerung.png') });

    console.log('\n== Übungen folgen der Folie');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2b'), 'Schockform-Detektiv');
    H.pruefe(await titelIst(handys[0], 'Detektiv'), 'Handy lädt den Schockform-Detektiv');
    H.pruefe(await bis(handys[0], () => !!document.querySelector('.gruppe-mini')), 'Handy zeigt dazu die Stammgruppe');
    await weiter();
    H.pruefe(await folieIst(lap, 'blatt2') && (await lap.textContent('.folie')).includes('Lagerung nach Leitsymptom'), 'nach dem Detektiv: „Sie erhalten jetzt Blatt 2“ (kein Merksatz AA2)');
    H.pruefe(await textDa(handys[0], 'Blatt 2'), 'Handy: Blatt 2 kommt');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2c'), 'dann Schreibaufgaben 2.1/2.2');
    // im Browser prüfen (die Folie kann gerade neu gezeichnet werden – dann wären gemerkte Elemente veraltet)
    H.pruefe(await bis(lap, () => document.querySelectorAll('.a-tabelle .a-nr').length === 2 && !document.querySelector('.aufgabe-los')), 'Aufgabenfolie: erst die Aufgaben wie im AB, noch ohne Auftrag');
    H.pruefe(await textDa(handys[0], 'erklärt gleich die Aufgabe'), 'Handy: nach vorne schauen, die Lehrkraft erklärt');
    H.pruefe((await lap.textContent('#weiter')).includes('Jetzt bearbeiten'), 'Weiter-Knopf heißt „Jetzt bearbeiten“');
    await weiter();
    H.pruefe(await bis(lap, () => { const l = document.querySelector('.aufgabe-los'); return l && l.textContent.includes('Bearbeiten Sie jetzt') && l.textContent.includes('neu starten'); }), 'Jetzt bearbeiten: Auftrag erscheint, die Uhr läuft von selbst');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_15_aufgabe.png') });
    H.pruefe(await bis(handys[0], () => document.querySelectorAll('details.info').length === 3), 'Handy zeigt die Fälle Mia, Herr Weber und Herr Albrecht zum Nachlesen');
    H.pruefe(!(await lap.textContent('.folie')).includes('Expertin/Experte B'), 'keine Expertenkorrektur mehr');
    await handys[0].screenshot({ path: path.join(ORDNER, 'handy_13_faelle.png'), fullPage: true });
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2c-loesung-21') && (await lap.$$('.loesung-aufgabe')).length === 1, 'Musterlösung 2.1 – eine Aufgabe je Folie');
    H.pruefe(await bis(lap, () => { const e = document.querySelector('.l-zeile'), l = document.querySelector('.loesungen'); return !!e && e.isConnected && parseFloat(getComputedStyle(e).fontSize) * (parseFloat(l.style.zoom) || 1) >= 28; }), 'Lösungszeilen groß (mind. 28 px)');
    const zeilenL = (await lap.$$('.loesungen .aufdeck')).length;
    await lap.click('button:has-text("Alle aufdecken")');
    H.pruefe(await bis(lap, (n) => document.querySelectorAll('.loesungen .aufdeck.offen').length === n, zeilenL), 'Alle aufdecken zeigt alle ' + zeilenL + ' Lösungszeilen');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_14_musterloesung.png') });
    await lap.reload();
    H.pruefe(await bis(lap, (n) => document.querySelectorAll('.loesungen .aufdeck.offen').length === n, zeilenL), 'aufgedeckt bleibt aufgedeckt (auch nach Neuladen)');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2c-loesung-22') && (await lap.textContent('.loesung-aufgabe')).includes('116/min'), 'dann Musterlösung 2.2 (Puls-Unterschied)');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa3-impuls'), 'weiter zu „Schock → Beine hoch?“');

    console.log('\n== Vier Lagerungen, Quiz, Merksatz, Aufgaben');
    await weiter();
    H.pruefe(await folieIst(lap, 'lagerung-1'), 'danach: Lagerung 1 von 4');
    H.pruefe(await bis(lap, () => { const b = document.querySelector('.lagerung-bild'); return b && b.complete && b.naturalWidth > 0; }), 'Beamer: Bild der Lagerung wird angezeigt');
    H.pruefe(await bis(handys[0], () => { const b = document.querySelector('.handy-bild'); return b && b.complete && b.naturalWidth > 0; }), 'Handy: dasselbe Bild');
    for (let n = 2; n <= 4; n++) { await weiter(); H.pruefe(await folieIst(lap, 'lagerung-' + n), 'Lagerung ' + n + ' von 4'); }
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_21_lagerung.png') });
    await weiter();
    H.pruefe(await titelIst(handys[1], 'Lagerungs-Quiz'), 'Handy lädt das Lagerungs-Quiz');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa3-merksatz'), 'nach dem Quiz: Merksatz AA3 lesen');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa3b') && (await lap.$$('.a-tabelle .a-nr')).length === 2 && (await lap.$$('.weg')).length === 0, 'AA3 b): nur 3.1/3.2 wie im AB, kein Entscheidungsweg');
    await weiter();
    H.pruefe(await bis(handys[2], () => document.body.innerText.includes('3.1 und 3.2')), 'Handy: jetzt auf dem Arbeitsblatt arbeiten');

    console.log('\n== Zurück, Menü, Unterschritte');
    await lap.click('#zurueck');
    H.pruefe(await bis(lap, () => !document.querySelector('.aufgabe-los')) && await textDa(handys[2], 'erklärt gleich die Aufgabe'), 'Zurück: Auftrag wieder ausgeblendet, Handys schauen nach vorne');
    await lap.click('#zurueck');
    H.pruefe(await folieIst(lap, 'aa3-merksatz'), 'Zurück: eine Folie zurück');
    await lap.click('#menue-knopf');
    await lap.click('.menue-folie:has-text("Musterlösung 3.2")');
    H.pruefe(await folieIst(lap, 'aa3b-loesung-32') && (await lap.$$('.loesungen .aufdeck')).length > 0, 'Menü: Sprung zur Musterlösung 3.2');
    await lap.click('#menue-knopf');
    await lap.click('.menue-folie:has-text("Wer darf was?")');
    H.pruefe(await folieIst(lap, 'aa4a'), 'Menü: Sprung zu „Wer darf was?“');
    await weiter();
    H.pruefe(await bis(lap, () => !!document.querySelector('.massnahme-text')), 'Weiter deckt die erste Maßnahme auf');
    const aa4 = S.folien.find((f) => f.id === 'aa4a');
    H.pruefe(await textDa(handys[3], aa4.massnahmen[0].text), 'Handy zeigt dieselbe Maßnahme');
    const richtigB = 'ABC'.charAt(aa4.massnahmen[0].ecke);
    const falschB = 'ABC'.charAt((aa4.massnahmen[0].ecke + 1) % 3);
    for (const h of handys.slice(0, 3)) await bis(h, () => document.querySelectorAll('.ecken-handy .antwort').length === 3);
    H.pruefe((await handys[0].$$('.ecken-handy .antwort')).length === 3, 'Handy: drei Knöpfe 🟢 / 🟡 / 🔴 statt Aufstehen');
    await handys[0].click('.ecken-handy .antwort[data-ecke="' + richtigB + '"]');
    await handys[1].click('.ecken-handy .antwort[data-ecke="' + richtigB + '"]');
    await handys[1].click('.ecken-handy .antwort[data-ecke="' + falschB + '"]');   // Wahl ändern
    await handys[2].click('.ecken-handy .antwort[data-ecke="' + richtigB + '"]');
    H.pruefe(await bis(handys[1], (b) => !!document.querySelector('.ecken-handy .antwort.gewaehlt[data-ecke="' + b + '"]'), falschB), 'Handy: gewählte Kategorie markiert, Wahl änderbar');
    H.pruefe(await bis(lap, () => /^3 von \d+ haben abgestimmt/.test((document.querySelector('.abgestimmt') || {}).textContent || '')), 'Beamer: „3 von … haben abgestimmt“');
    H.pruefe((await lap.$$('.ecke-zahl, .ecke-balken')).length === 0, 'vor der Lösung: keine Verteilung am Beamer (niemand folgt der Mehrheit)');
    await weiter();
    H.pruefe(await bis(lap, () => [...document.querySelectorAll('.ecke-zahl')].map((e) => e.textContent).join('|').includes('2 Stimmen')), 'mit der Lösung: Stimmen je Kategorie');
    H.pruefe(await bis(lap, () => !!document.querySelector('.ecke.richtig')), 'nächster Klick zeigt die richtige Kategorie');
    H.pruefe(await bis(lap, () => ((document.querySelector('.abgestimmt.ergebnis') || {}).textContent || '').includes('2 von 3 richtig')), 'Beamer: „Das hatten 2 von 3 richtig!“');
    H.pruefe(await textDa(handys[0], S.handy.aufstellungRichtig), 'Handy: Rückmeldung „richtig“');
    H.pruefe(await textDa(handys[1], 'Nicht ganz'), 'Handy: Rückmeldung „nicht ganz“ mit der richtigen Kategorie');
    H.pruefe(await textDa(handys[3], 'nicht abgestimmt'), 'Handy ohne Stimme: Hinweis und Lösung');
    await handys[1].screenshot({ path: path.join(ORDNER, 'handy_27_wer_darf_was.png') });
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_16_aufstellung.png') });

    console.log('\n== Beamer neu laden');
    await lap.reload();
    H.pruefe(await folieIst(lap, 'aa4a'), 'nach dem Neuladen: dieselbe Folie (Raum bleibt gespeichert)');

    console.log('\n== Check-out');
    await lap.click('#menue-knopf');
    await lap.click('.menue-folie:has-text("Was haben wir heute gelernt?")');
    H.pruefe(await folieIst(lap, 'checkout-intro') && (await lap.$$('.warum-box')).length === 1, 'vor dem Check-out: „Was haben wir heute gelernt?“');
    await weiter();
    H.pruefe(await folieIst(lap, 'checkout'), 'Check-out: Hätten Sie richtig gehandelt?');
    // alle entscheiden jetzt richtig und „sicher“
    for (let j = 0; j < S.fragen.length; j++) {
      const f = S.fragen[j];
      await weiter();
      for (const h of handys) {
        await textDa(h, 'Notfall ' + (j + 1) + ' von ' + S.fragen.length);
        await h.click('.notfall-antworten .antwort[data-option="' + f.richtig + '"]');
        await h.click('.sicher-knoepfe .antwort[data-sicher="1"]');
      }
      H.pruefe(await bis(lap, () => /^6 von \d+ haben abgestimmt/.test((document.querySelector('.abgestimmt') || {}).textContent || '')), 'Check-out Notfall ' + (j + 1) + ': alle haben abgestimmt');
      if (j === 0) H.pruefe((await lap.textContent('#weiter')).includes('Auflösung zeigen'), 'Weiter-Knopf: „Auflösung zeigen“');
      await weiter();
      if (j === 0) {
        H.pruefe(await bis(lap, () => document.querySelectorAll('.abst-frage.gross .abst-option.richtig').length === 1 && document.querySelectorAll('.abst-frage.gross .abst-kopf').length === 3), 'Auflösung: richtige Antwort, Beginn und Ende nebeneinander');
        H.pruefe(await textDa(handys[0], 'Richtig ist:') && await textDa(handys[0], 'Ihre Vermutung zu Beginn'), 'Handy: Auflösung mit eigener Vermutung (Beginn) und Entscheidung (jetzt)');
        await lap.screenshot({ path: path.join(ORDNER, 'stunde_check_aufloesung.png') });
        await handys[0].screenshot({ path: path.join(ORDNER, 'handy_check_aufloesung.png'), fullPage: true });
      }
    }
    await weiter();
    H.pruefe(await folieIst(lap, 'checkout-ergebnis'), 'vorher – nachher');
    H.pruefe((await lap.$$('.abst-option.richtig')).length === S.fragen.length, 'Lösung ist markiert');
    H.pruefe((await lap.$$('.abst-kopf')).length >= 2 * S.fragen.length, 'zwei Spalten je Karte (Beginn, Ende)');
    H.pruefe(await textDa(handys[0], 'Richtig zu Beginn: 0 von 4 · jetzt: 4 von 4') && await textDa(handys[1], 'Richtig zu Beginn: 4 von 4 · jetzt: 4 von 4'), 'Handy: eigene Bilanz (Beginn und jetzt)');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_23_vorher_nachher.png') });

    console.log('\n== Ende gibt die Nachlese frei');
    await weiter();
    H.pruefe(await folieIst(lap, 'ende'), 'letzte Folie: Ende');
    H.pruefe(await lap.$eval('#weiter', (b) => b.disabled), 'auf der letzten Folie gibt es kein Weiter');
    H.pruefe(await textDa(handys[0], 'Die Stunde ist beendet'), 'Handy: „Die Stunde ist beendet“');
    await nach.reload();
    H.pruefe(await bis(nach, () => document.querySelectorAll('.abschnitt').length >= 10), 'Nachlese-Seite ist jetzt offen');
    H.pruefe(await textDa(nach, 'Vergleichstabelle') && await textDa(nach, 'Antwort auf die Leitfrage'), 'Nachlese enthält Tabelle und Auflösung');
    await nach.screenshot({ path: path.join(ORDNER, 'nachlese.png') });

    console.log('\n== Entfernen');
    await lap.click('#menue-knopf');
    await lap.click('button:has-text("Angemeldete verwalten")');
    await lap.click('.tn-liste li:has-text("Tom") button');
    await lap.click('#ebene .knopf-gross');
    H.pruefe(await textDa(handys[3], S.handy.fehlerEntfernt), 'entferntes Handy sieht die Anmeldung mit Hinweis');

    H.pruefe(protokoll.konsole.length === 0, 'keine Fehler in der Konsole', protokoll.konsole);
    H.pruefe(protokoll.extern.length === 0, 'keine Anfragen an fremde Adressen', protokoll.extern);
    ok = H.ergebnis();
  } finally {
    await browser.close();
    server.close();
    worker.beenden();
  }
  fs.writeFileSync(path.join(ORDNER, 'stunde.txt'), `Stand: ${new Date().toISOString()}\nErgebnis: ${ok ? 'bestanden' : 'FEHLER'}\n`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });

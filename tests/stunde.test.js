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

    console.log('\n== Einstieg');
    await weiter();
    H.pruefe(await folieIst(lap, 'fall'), 'Weiter → Folie 2: Frau Maler');
    H.pruefe(await textDa(handys[0], 'Leitfrage'), 'Handy zeigt die Leitfrage');
    H.pruefe(await textDa(handys[5], 'Leitfrage'), 'Handy ohne Live-Verbindung folgt ebenfalls');
    await weiter();
    H.pruefe(await folieIst(lap, 'einstieg'), 'Folie 3: Wie hätten Sie gehandelt?');
    for (let i = 0; i < handys.length; i++) {
      const h = handys[i];
      H.pruefe(await bis(h, (n) => document.querySelectorAll('.frage').length === n, S.fragen.length), `${namen[i]}: ${S.fragen.length} Fragen am Handy`);
      const boxen = await h.$$('.frage');
      for (let j = 0; j < S.fragen.length; j++) {
        const f = S.fragen[j];
        const opt = i % 2 ? f.optionen.find((o) => o.charAt(0) === f.richtig) : f.optionen.find((o) => o.charAt(0) !== f.richtig);
        await (await boxen[j].$(`.antwort:has-text("${opt}")`)).click();
        await (await boxen[j].$('.klein-knopf >> nth=1')).click();
      }
      await h.click('button.knopf-breit');
    }
    H.pruefe(await bis(lap, () => document.querySelector('.zaehl-gross').textContent.startsWith('6 von 6')), 'Beamer: „6 von 6 haben abgestimmt“');
    await weiter();
    H.pruefe(await folieIst(lap, 'einstieg-ergebnis'), 'Folie 4: Ergebnis');
    H.pruefe((await lap.$$('.abst-frage')).length === 6 && (await lap.$$('.abst-frage.stern')).length === 1, '6 Karten, eine als „größte Uneinigkeit“ markiert');
    H.pruefe((await lap.$$('.abst-option.richtig')).length === 0, 'Einstieg: keine Auflösung');
    await lap.click('.abst-frage >> nth=5');
    H.pruefe((await lap.$$('.abst-frage.gross')).length === 1, 'Karte anklicken → groß');
    await lap.keyboard.press('Escape');
    H.pruefe((await lap.$$('.abst-frage')).length === 6, 'Esc → zurück zu allen Karten');
    await weiter();
    H.pruefe(await folieIst(lap, 'murmeln'), 'Folie 5: Murmeln');
    H.pruefe(await bis(lap, () => /Murmeln/i.test(document.querySelector('.uhr-label').textContent)), 'Murmel-Uhr startet automatisch');
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
    H.pruefe(await folieIst(lap, 'aa2a'), 'alle Teams fertig → Beamer wechselt automatisch zu Folie 9');
    H.pruefe(await bis(handys[0], () => !!document.querySelector('.stamm-kopf')), 'Handys zeigen automatisch die Stammgruppe');
    H.pruefe((await handys[0].$eval('.stamm-kopf .name', (e) => e.textContent)) === gruppeMia, 'dieselbe Stammgruppe wie bei der Einteilung');
    await lap.click('button:has-text("Erklär-Uhr starten")');
    H.pruefe(await textDa(handys[0], 'erklärt') || await textDa(handys[0], 'Sie sind dran'), 'Handy zeigt, wer gerade erklärt');
    await handys[0].screenshot({ path: path.join(ORDNER, 'handy_09_stamm.png'), fullPage: true });
    for (const h of handys) await h.click('#fertig-stamm');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.g-karte.fertig').length === 2), 'Beamer: beide Stammgruppen „fertig“');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_09_stamm.png') });

    console.log('\n== Tabelle sichern (aufdecken am Beamer)');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2a-sichern'), 'nach den Stammgruppen: Folie „Tabelle sichern“');
    H.pruefe((await lap.$$('.vergleich .aufdeck')).length === 19 && (await lap.$$('.vergleich .aufdeck.offen')).length === 0, 'Vergleichstabelle wie im AB, alle Zellen verdeckt');
    await lap.click('.vergleich .aufdeck >> nth=0');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.vergleich .aufdeck.offen').length === 1), 'Zelle anklicken deckt die Lösung auf');
    H.pruefe(await textDa(handys[0], 'Musterlösung vorne'), 'Handy: Tabelle mit der Musterlösung am Beamer vergleichen');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_10_tabelle.png') });
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2b-intro') && (await lap.$$('.warum-box')).length === 1, 'Erklärfolie zum Schockform-Detektiv (was und warum)');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_11_detektiv_erklaerung.png') });

    console.log('\n== Übungen folgen der Folie');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2b'), 'Schockform-Detektiv');
    H.pruefe(await titelIst(handys[0], 'Detektiv'), 'Handy lädt den Schockform-Detektiv');
    H.pruefe(await bis(handys[0], () => !!document.querySelector('.gruppe-mini')), 'Handy zeigt dazu die Stammgruppe');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2c'), 'Klausurtraining 2.1/2.2');
    H.pruefe(await bis(handys[0], () => document.querySelectorAll('details.info').length === 3), 'Handy zeigt die Fälle Mia, Herr Weber und Herr Albrecht zum Nachlesen');
    H.pruefe(!(await lap.textContent('.folie')).includes('Expertin/Experte B'), 'keine Expertenkorrektur mehr');
    await handys[0].screenshot({ path: path.join(ORDNER, 'handy_13_faelle.png'), fullPage: true });
    await weiter();
    H.pruefe(await folieIst(lap, 'aa2c-loesung'), 'Musterlösung 2.1/2.2');
    const zeilenL = (await lap.$$('.loesungen .aufdeck')).length;
    await lap.click('button:has-text("Alle aufdecken")');
    H.pruefe(await bis(lap, (n) => document.querySelectorAll('.loesungen .aufdeck.offen').length === n, zeilenL), 'Alle aufdecken zeigt alle ' + zeilenL + ' Lösungszeilen');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_14_musterloesung.png') });
    await lap.reload();
    H.pruefe(await bis(lap, (n) => document.querySelectorAll('.loesungen .aufdeck.offen').length === n, zeilenL), 'aufgedeckt bleibt aufgedeckt (auch nach Neuladen)');
    await weiter();
    H.pruefe(await folieIst(lap, 'aa3-impuls'), 'weiter zu „Schock → Beine hoch?“');
    await weiter();
    H.pruefe(await titelIst(handys[1], 'Lagerung'), 'Handy lädt den Lagerungsparcours');
    await weiter();
    H.pruefe(await titelIst(handys[2], 'Simulation'), 'Handy lädt die Simulation');

    console.log('\n== Zurück, Menü, Unterschritte');
    await lap.click('#zurueck');
    H.pruefe(await folieIst(lap, 'aa3') && await titelIst(handys[2], 'Lagerung'), 'Zurück: Beamer und Handys gehen eine Folie zurück');
    await lap.click('#menue-knopf');
    await lap.click('.menue-folie:has-text("Wer darf was?")');
    H.pruefe(await folieIst(lap, 'aa5a'), 'Menü: Sprung zu „Wer darf was?“');
    await weiter();
    H.pruefe(await bis(lap, () => !!document.querySelector('.massnahme-text')), 'Weiter deckt die erste Maßnahme auf');
    const aa5 = S.folien.find((f) => f.id === 'aa5a');
    H.pruefe(await textDa(handys[3], aa5.massnahmen[0].text), 'Handy zeigt dieselbe Maßnahme');
    await weiter();
    H.pruefe(await bis(lap, () => !!document.querySelector('.ecke.richtig')), 'nächster Klick zeigt die richtige Ecke');
    H.pruefe(await textDa(handys[3], 'Lösung:'), 'Handy zeigt die Lösung');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_16_aufstellung.png') });

    console.log('\n== Beamer neu laden');
    await lap.reload();
    H.pruefe(await folieIst(lap, 'aa5a'), 'nach dem Neuladen: dieselbe Folie (Raum bleibt gespeichert)');

    console.log('\n== Check-out');
    await lap.click('#menue-knopf');
    await lap.click('.menue-folie:has-text("Hätten Sie richtig gehandelt?")');
    H.pruefe(await folieIst(lap, 'checkout'), 'Folie 22: Check-out');
    for (const h of handys) {
      await bis(h, () => document.getElementById('titel').textContent.includes('richtig gehandelt'));
      const boxen = await h.$$('.frage');
      for (let j = 0; j < S.fragen.length; j++) {
        const f = S.fragen[j];
        await (await boxen[j].$(`.antwort:has-text("${f.optionen.find((o) => o.charAt(0) === f.richtig)}")`)).click();
        await (await boxen[j].$('.klein-knopf >> nth=0')).click();
      }
      await h.click('button.knopf-breit');
    }
    H.pruefe(await textDa(handys[0], 'Ihre Vermutung (Beginn)'), 'Handy: Auflösung mit Vermutung (Beginn) und Entscheidung (Ende)');
    await weiter();
    H.pruefe(await folieIst(lap, 'checkout-ergebnis'), 'Folie 23: vorher – nachher');
    H.pruefe((await lap.$$('.abst-option.richtig')).length === S.fragen.length, 'Lösung ist markiert');
    H.pruefe((await lap.$$('.abst-kopf')).length >= 12, 'zwei Spalten je Karte (Beginn, Ende)');
    await lap.screenshot({ path: path.join(ORDNER, 'stunde_23_vorher_nachher.png') });

    console.log('\n== Ende gibt die Nachlese frei');
    await weiter();
    await weiter();
    H.pruefe(await folieIst(lap, 'ende'), 'Folie 25: Ende');
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

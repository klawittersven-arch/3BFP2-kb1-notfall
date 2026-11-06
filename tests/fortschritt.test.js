/* Fortschritt und Abstimmung am Beamer – Ende-zu-Ende-Test mit lokalem Cloudflare-Worker (wrangler dev).
 * Zwei „Handys“ (390 × 844) und ein „Laptop“ (1600 × 900).
 * Voraussetzung: im Ordner worker/ einmal „npm install“. Start (im Ordner tests/): node fortschritt.test.js */
'use strict';
const path = require('path');
const fs = require('fs');
const H = require('./hilfen');

const ORDNER = path.join(__dirname, 'ergebnisse');
async function bis(seite, fn, arg, ms = 15000) {
  try { await seite.waitForFunction(fn, arg, { timeout: ms, polling: 250 }); return true; } catch (e) { return false; }
}

(async () => {
  const worker = await H.workerStarten(8792);
  const { server, basis } = await H.serverStarten({ fortschrittUrl: worker.url });
  const browser = await H.chromium.launch();
  const protokoll = { konsole: [], extern: [] };
  let ok = false;
  try {
    console.log('\n== Beamer: Raum starten');
    const lctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
    const laptop = await lctx.newPage();
    H.beobachten(laptop, protokoll, 'laptop');
    await laptop.goto(basis + 'fortschritt.html');
    await laptop.click('#starten');
    await laptop.waitForSelector('#tafel:not([hidden])');
    const raum = (await laptop.locator('#raum-code').innerText()).trim();
    H.pruefe(/^\d{4}$/.test(raum), `Raumcode angezeigt: ${raum}`);
    const spalten = await laptop.evaluate(() => INHALTE.start.spalten.map((s) => s.kurz));
    H.pruefe(spalten.join() === 'AA1,AA2,AA3,AA4', 'Beamer-Spalten AA1–AA4', spalten);

    const handys = [];
    for (const [name, wahl] of [['Mia', 'falsch'], ['Ben', 'richtig']]) {
      console.log(`\n== Handy ${name}: anmelden und abstimmen`);
      const ctx = await browser.newContext(H.MOBIL);
      const h = await ctx.newPage();
      H.beobachten(h, protokoll, name);
      await h.goto(basis + 'w2-entscheidung.html?runde=1');
      await h.fill('#anmelde-name', name);
      await h.fill('#anmelde-raum', raum);
      await h.click('.anmelde-los');
      H.pruefe(await bis(h, () => !!document.querySelector('.anmeldung.angemeldet')), `${name}: angemeldet`);
      const E = await h.evaluate(() => INHALTE.entscheidung);
      for (const runde of [1, 2]) {
        // Runde kommt aus dem QR-Code (Einstieg: ?runde=1, Check-out: ?runde=2)
        if (runde === 2) await h.goto(basis + 'w2-entscheidung.html?runde=2');
        const boxen = await h.$$('.frage');
        for (let i = 0; i < E.fragen.length; i++) {
          const f = E.fragen[i];
          const opt = (wahl === 'richtig' || runde === 2) ? f.optionen.find((o) => o.charAt(0) === f.richtig) : f.optionen.find((o) => o.charAt(0) !== f.richtig);
          await (await boxen[i].$(`.antwort:has-text("${opt}")`)).click();
          await (await boxen[i].$(`.klein-knopf:has-text("${runde === 2 ? E.sicher : E.unsicher}")`)).click();
        }
        await h.click(`button:has-text("${runde === 1 ? E.abschicken1 : E.abschicken2}")`);
        H.pruefe(await bis(h, (t) => document.getElementById('uebung').textContent.includes(t), E.gesendet), `${name}: Runde ${runde} am Beamer angekommen`);
      }
      handys.push(h);
    }

    console.log('\n== Handy Mia: AA1 vollständig → Fortschritt');
    const mia = handys[0];
    await mia.goto(basis + 'w2-markieren.html?fall=b');
    const teile = (await mia.evaluate(() => INHALTE.markieren.faelle.b.teile)).filter((t) => typeof t === 'object');
    const kn = await mia.$$('.markierbar');
    for (let i = 0; i < teile.length; i++) if (teile[i].k) await kn[i].click();
    await mia.click('button:has-text("Prüfen")');
    await mia.waitForSelector('.merksatz');
    H.pruefe(await bis(laptop, () => [...document.querySelectorAll('.s-karte')].some((k) => k.textContent.includes('Mia') && k.querySelector('[data-seite="w2-markieren"] .s-zahl.fertig'))), 'Beamer: Mia hat AA1 fertig');
    await laptop.screenshot({ path: path.join(ORDNER, 'beamer_fortschritt.png') });

    console.log('\n== Beamer: Abstimmung');
    await laptop.click('#ansicht');
    const NF = await laptop.evaluate(() => INHALTE.entscheidung.fragen.length);
    H.pruefe(NF === 6 && await bis(laptop, (n) => document.querySelectorAll('.abst-frage').length === n, NF), '6 Fragen in der Abstimmungsansicht (E6 = Frau Maler)');
    const zusammen = await laptop.locator('#zusammenfassung').innerText();
    H.pruefe(zusammen.includes('Vermutungen (Beginn): 2') && zusammen.includes('Entscheidungen (Ende): 2'), 'je 2 Stimmen beim Einstieg und beim Check-out', zusammen);
    const koepfe = await laptop.$$eval('.abst-frage:first-child .abst-kopf', (k) => k.map((x) => x.textContent));
    H.pruefe(koepfe.includes('Vermutung (Beginn)') && koepfe.includes('Entscheidung (Ende)'), 'Spalten „Vermutung (Beginn)“ und „Entscheidung (Ende)“', koepfe);
    const alleSichtbar = await laptop.$$eval('.abst-frage', (k) => { const box = document.getElementById('abstimmung').getBoundingClientRect(); return k.every((e) => e.getBoundingClientRect().bottom <= box.bottom + 1); });
    H.pruefe(alleSichtbar, 'alle 6 Karten passen ohne Scrollen auf den Beamer (1600 × 900)');
    H.pruefe((await laptop.$$('.abst-option.richtig')).length === 0, 'Lösung zunächst verborgen');
    await laptop.click('#loesung');
    H.pruefe((await laptop.$$('.abst-option.richtig')).length === NF, '„Lösung zeigen“ markiert die richtigen Antworten');
    const zahlen = await laptop.$$eval('.abst-frage:first-child .abst-zahl', (z) => z.map((x) => x.textContent));
    H.pruefe(zahlen.some((t) => t.startsWith('2')), 'Runde 2: beide richtig (2 Stimmen)', zahlen);
    await laptop.screenshot({ path: path.join(ORDNER, 'beamer_abstimmung.png') });
    const html = await laptop.content();
    H.pruefe(!/Mia|Ben/.test(await laptop.locator('#abstimmung').innerText()), 'Abstimmung zeigt keine Namen');

    // Probeansicht
    const demo = await lctx.newPage();
    H.beobachten(demo, protokoll, 'demo');
    await demo.goto(basis + 'fortschritt.html?demo=1');
    await demo.waitForSelector('#tafel:not([hidden])');
    await demo.click('#ansicht');
    H.pruefe((await demo.$$('.abst-frage')).length === NF, 'Probeansicht: Abstimmung mit erfundenen Daten');

    console.log('\n== Beamer: eine Frage groß anzeigen');
    await demo.click('.abst-frage >> nth=0');
    H.pruefe((await demo.$$('.abst-frage')).length === 1 && (await demo.$$('.abst-frage.gross')).length === 1, 'Klick auf E1: nur diese Karte, groß');
    H.pruefe((await demo.locator('.abst-frage.gross h2').innerText()).startsWith('E1'), 'groß gezeigt: E1');
    const kleinH = await demo.evaluate(() => 0);
    const groesse = await demo.$eval('.abst-frage.gross .abst-option', (e) => parseFloat(getComputedStyle(e).fontSize));
    H.pruefe(groesse >= 28, `Antworttext groß lesbar (${groesse}px bei 900px Höhe)`, groesse);
    const passt = () => demo.$eval('.abst-frage.gross', (e) => e.scrollHeight <= e.clientHeight + 1);
    H.pruefe(await passt(), 'große Karte passt ohne Abschneiden auf den Bildschirm');
    await demo.screenshot({ path: path.join(ORDNER, 'beamer_abstimmung_gross.png') });
    await demo.keyboard.press('ArrowRight');
    H.pruefe((await demo.locator('.abst-frage.gross h2').innerText()).startsWith('E2'), 'Pfeil rechts → E2');
    await demo.click('.abst-nav button:has-text("Nächste Frage")');
    H.pruefe((await demo.locator('.abst-frage.gross h2').innerText()).startsWith('E3'), '„Nächste Frage“ → E3');
    await demo.click('#loesung');
    H.pruefe((await demo.$$('.abst-option.richtig')).length === 1 && (await demo.$$('.abst-frage.gross .abst-erklaerung')).length === 1, 'Lösung zeigen: richtige Antwort und Erklärung in der großen Ansicht');
    await demo.click('.abst-nav button:has-text("Nächste Frage")');
    H.pruefe(await passt(), 'E4 (längste Antworten) mit Lösung passt ohne Abschneiden');
    await demo.screenshot({ path: path.join(ORDNER, 'beamer_abstimmung_gross_loesung.png') });
    await demo.click('.abst-nav button:has-text("Vorherige Frage")');
    await demo.waitForTimeout(3500);
    H.pruefe((await demo.locator('.abst-frage.gross h2').innerText()).startsWith('E3'), 'große Ansicht bleibt bei der nächsten Aktualisierung erhalten');
    await demo.keyboard.press('Escape');
    H.pruefe((await demo.$$('.abst-frage')).length === NF, 'Esc → zurück zu allen sechs Karten');

    console.log('\n== Beamer: Murmeln – E6 groß mit eingeblendeter Anweisung');
    await demo.click('.abst-frage >> nth=5');
    H.pruefe((await demo.locator('.abst-frage.gross h2').innerText()).startsWith('E6'), 'groß gezeigt: E6 (Frau Maler)');
    await demo.click('.anweisung-knopf:has-text("Murmeln")');
    H.pruefe((await demo.locator('.anweisung').innerText()).startsWith('Murmeln'), 'Anweisung „Murmeln“ eingeblendet');
    H.pruefe(await passt(), 'E6 groß passt auch mit eingeblendeter Anweisung ohne Abschneiden');
    await demo.screenshot({ path: path.join(ORDNER, 'beamer_murmeln.png') });
    await demo.click('.anweisung-knopf:has-text("Murmeln")');
    await demo.click('.abst-frage.gross');
    H.pruefe((await demo.$$('.abst-frage')).length === NF, 'Klick auf die große Karte → zurück zu allen Karten');
    void html; void kleinH;

    H.pruefe(protokoll.konsole.length === 0, 'keine Fehler in der Konsole', protokoll.konsole);
    H.pruefe(protokoll.extern.length === 0, 'keine Anfragen an fremde Adressen', protokoll.extern);
    ok = H.ergebnis();
  } finally {
    await browser.close();
    server.close();
    worker.beenden();
  }
  fs.writeFileSync(path.join(ORDNER, 'fortschritt.txt'), `Stand: ${new Date().toISOString()}\nErgebnis: ${ok ? 'bestanden' : 'FEHLER'}\n`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });

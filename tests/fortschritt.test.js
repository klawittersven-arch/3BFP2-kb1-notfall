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
        await h.click(`button:has-text("${E.abschicken}")`);
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
    H.pruefe(await bis(laptop, () => document.querySelectorAll('.abst-frage').length === 5), '5 Fragen in der Abstimmungsansicht');
    const zusammen = await laptop.locator('#zusammenfassung').innerText();
    H.pruefe(zusammen.includes('Runde 1: 2') && zusammen.includes('Runde 2: 2'), 'je 2 Stimmen in Runde 1 und 2', zusammen);
    H.pruefe((await laptop.$$('.abst-option.richtig')).length === 0, 'Lösung zunächst verborgen');
    await laptop.click('#loesung');
    H.pruefe((await laptop.$$('.abst-option.richtig')).length === 5, '„Lösung zeigen“ markiert die richtigen Antworten');
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
    H.pruefe((await demo.$$('.abst-frage')).length === 5, 'Probeansicht: Abstimmung mit erfundenen Daten');
    void html;

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

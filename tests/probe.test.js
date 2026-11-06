/* Probestunde – der Laptop spielt 20 erfundene Schülerinnen und Schüler, die Lehrkraft macht mit
 * einem Handy mit. Lokaler Worker (wrangler dev), schneller Takt (beamer.html?takt=250).
 * Start (im Ordner tests/): node probe.test.js */
'use strict';
const path = require('path');
const H = require('./hilfen');

const ORDNER = path.join(__dirname, 'ergebnisse');
async function bis(seite, fn, arg, ms = 30000) {
  try { await seite.waitForFunction(fn, arg, { timeout: ms, polling: 250 }); return true; } catch (e) { return false; }
}
const folieIst = (lap, id, ms) => bis(lap, (x) => { const f = document.querySelector('.folie'); return f && f.dataset.folie === x; }, id, ms);

(async () => {
  const worker = await H.workerStarten(8796);
  const { server, basis } = await H.serverStarten({ fortschrittUrl: worker.url });
  const browser = await H.chromium.launch();
  const protokoll = { konsole: [], extern: [] };
  let ok = false;
  try {
    console.log('\n== Probestunde starten');
    const lap = await (await browser.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
    H.beobachten(lap, protokoll, 'beamer');
    await lap.goto(basis + 'beamer.html?takt=250');
    await lap.click('#probe-starten');
    H.pruefe(await folieIst(lap, 'start'), 'Probestunde: Folie 1 mit QR-Code');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.name-chip').length === 20), '20 erfundene Schülerinnen und Schüler melden sich an');
    H.pruefe(await bis(lap, () => document.getElementById('kopf-raum').textContent.includes('Probestunde')), 'Kopfzeile zeigt „Probestunde“');
    const raum = await lap.evaluate(() => JSON.parse(localStorage.getItem('kb1nf_lehrer_raum')).raum);

    console.log('\n== Lehrkraft macht mit dem Handy mit');
    const h = await (await browser.newContext(H.MOBIL)).newPage();
    H.beobachten(h, protokoll, 'handy');
    await h.goto(basis + 'w2.html?raum=' + raum);
    await h.fill('#anmelde-name', 'Frau Test');
    await h.click('.anmelde-los');
    H.pruefe(await bis(h, () => document.body.innerText.includes('Sie sind dabei')), 'Handy der Lehrkraft ist dabei');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.name-chip').length === 21), 'Beamer: 21 Namen');
    H.pruefe(await bis(lap, () => /^1 Handy \+ 20 erfundene$/.test(document.getElementById('kopf-handys').textContent)), 'Kopfzeile: „1 Handy + 20 erfundene“');

    console.log('\n== Erfundene Klasse stimmt ab');
    await lap.click('#weiter');
    await lap.click('#weiter');
    H.pruefe(await folieIst(lap, 'einstieg'), 'Folie 3: Abstimmung');
    H.pruefe(await bis(lap, () => /^(1[5-9]|20) von 21/.test(document.querySelector('.zaehl-gross').textContent)), 'erfundene Stimmen laufen ein');
    await lap.click('#weiter');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.abst-frage.stern').length === 1), 'Ergebnis mit „größter Uneinigkeit“');

    console.log('\n== Gruppen mit erfundenen Namen');
    await lap.click('#menue-knopf');
    await lap.click('.menue-folie:has-text("Gruppen einteilen")');
    await lap.click('button:has-text("Gruppen zufällig einteilen")');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.g-karte').length === 7), '21 Personen → 7 Stammgruppen');
    H.pruefe((await lap.$$('.g-mitglied.offline')).length === 0, 'erfundene Personen erscheinen nicht als „offline“');
    H.pruefe(await bis(h, () => !!document.querySelector('.gruppe-gross')), 'Handy der Lehrkraft: eigene Stammgruppe');
    const mitglieder = await h.$$eval('.gruppe-gross .chip', (c) => c.length);
    H.pruefe(mitglieder >= 3, `Handy zeigt die Mitglieder (${mitglieder}) – erfundene Namen`, mitglieder);
    await h.screenshot({ path: path.join(ORDNER, 'probe_handy_gruppe.png') });

    console.log('\n== Expertenrunde: erfundene Teams werden fertig, dann die Lehrkraft');
    await lap.click('#weiter');
    H.pruefe(await folieIst(lap, 'aa1'), 'Folie 8: Expertenteams');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.t-karte .haken').length >= 5, null, 60000), 'erfundene Expertinnen und Experten melden „fertig“');
    await lap.screenshot({ path: path.join(ORDNER, 'probe_beamer_experten.png') });
    const rolle = await h.evaluate(() => JSON.parse(sessionStorage.getItem('kb1nf_stunde_stand')).stand.puzzle.rolle);
    const check = await h.evaluate((r) => STUNDE.check[r], rolle);
    for (let q = 0; q < 3; q++) {
      await h.waitForSelector('.check-frage');
      const k = await h.$$('.check-frage');
      await (await k[q].$$('.antwort'))[check[q].richtig].click();
    }
    await bis(h, () => { const b = document.getElementById('fertig-team'); return b && !b.disabled; });
    await h.click('#fertig-team');
    H.pruefe(await folieIst(lap, 'aa2a', 60000), 'alle fertig → automatisch Stammgruppen');
    H.pruefe(await bis(h, () => !!document.querySelector('.stamm-kopf')), 'Handy der Lehrkraft: Stammgruppe mit erfundenen Namen');
    H.pruefe(await bis(lap, () => document.querySelectorAll('.g-karte .haken').length >= 3, null, 60000), 'erfundene Stammgruppen-Mitglieder melden „fertig“');

    console.log('\n== Übungsfortschritt der erfundenen Klasse');
    await lap.click('#weiter');
    H.pruefe(await folieIst(lap, 'aa2b'), 'Folie 10: Detektiv');
    H.pruefe(await bis(lap, () => [...document.querySelectorAll('.g-zahl')].some((z) => /^[1-9]\//.test(z.textContent) || z.textContent === '✓')), 'Fortschrittsbalken der erfundenen Klasse bewegen sich');

    console.log('\n== Beamer neu laden: Probestunde läuft weiter');
    await lap.reload();
    H.pruefe(await folieIst(lap, 'aa2b'), 'nach dem Neuladen dieselbe Folie');
    H.pruefe(await bis(lap, () => document.getElementById('kopf-raum').textContent.includes('Probestunde')), 'weiterhin als Probestunde gekennzeichnet');

    H.pruefe(protokoll.konsole.length === 0, 'keine Fehler in der Konsole', protokoll.konsole);
    H.pruefe(protokoll.extern.length === 0, 'keine Anfragen an fremde Adressen', protokoll.extern);
    ok = H.ergebnis();
  } finally {
    await browser.close();
    server.close();
    worker.beenden();
  }
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });

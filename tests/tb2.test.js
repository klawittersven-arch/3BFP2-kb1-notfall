/* Test der Handy-Übungen „TB 2 neu ab KW 49“ (docs/tb2) in Handygröße – Playwright, Chromium, nachgebildeter Server.
 * Aufruf (im Repository-Ordner):  node tests/tb2.test.js
 * Prüft je Übung: Namenseingabe mit Klassenwahl, alle Karten lösen, Merksatz, Senden an den Raum der Woche (k2-kb1w1, k2-kb1w2 …),
 * kein waagerechtes Scrollen bei 360 px, keine fremden Anfragen; dazu die Lehrerseiten 3BFP2/2 je Woche
 * und dass Name/Klasse mit den KB-II-Übungen geteilt werden (gleicher Speicher-Schlüssel). */
'use strict';
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DOCS = path.join(__dirname, '..', 'docs', 'tb2');
const TYPEN = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const SERVER = 'https://fortschritt.test';
const IDS = ['kb1ab02', 'kb1ab03', 'kb1ab04', 'kb1ab05', 'kb1ab06', 'kb1ab07'];

function webserver() {
  return new Promise((ok) => {
    const s = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(DOCS, p);
      if (!f.startsWith(DOCS) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TYPEN[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    }).listen(0, () => ok(s));
  });
}

(async () => {
  global.window = {};
  eval(fs.readFileSync(path.join(DOCS, 'inhalte.js'), 'utf8') + ';global.I = INHALTE;');
  const s = await webserver();
  const basis = `http://127.0.0.1:${s.address().port}/`;
  const browser = await chromium.launch();
  let ok = 0, nok = 0;
  const pruefe = (bed, text) => { if (bed) ok++; else { nok++; console.log('  ✗ ' + text); } };

  const raeume = {}, posts = [];
  const kopf = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  await ctx.route('**/einstellungen.js', async (route) => {
    const antwort = await route.fetch();
    let text = await antwort.text();
    text = text.replace(/serverAdresse: '[^']*'/, `serverAdresse: '${SERVER}/'`)
      .replace(/sperreNachFehlerSekunden: \d+/, 'sperreNachFehlerSekunden: 0')
      .replace(/zuSchnell: \{ fehler: \d+/, 'zuSchnell: { fehler: 0');
    await route.fulfill({ response: antwort, body: text });
  });
  await ctx.route(SERVER + '/**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (req.method() === 'POST' && url.pathname === '/fortschritt') {
      const d = JSON.parse(req.postData());
      posts.push(d);
      const r = raeume[d.raum] = raeume[d.raum] || {};
      const p = r[d.geraet] = r[d.geraet] || { id: 'id' + Object.keys(r).length, uebungen: {} };
      p.name = d.name; p.t = Date.now();
      p.uebungen[d.uebung] = { geloest: d.geloest, gesamt: d.gesamt, erster: d.erster, neu: d.neu || 0, falsch: d.falsch, t: Date.now() };
      return route.fulfill({ status: 204, headers: kopf });
    }
    if (req.method() === 'GET' && url.pathname === '/stand') {
      const r = raeume[url.searchParams.get('raum')] || {};
      return route.fulfill({ status: 200, headers: kopf, body: JSON.stringify({ jetzt: Date.now(), eintraege: Object.values(r) }) });
    }
    return route.fulfill({ status: 404, headers: kopf });
  });
  const page = await ctx.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text()); });
  page.on('request', (r) => { if (!r.url().startsWith(basis) && !r.url().startsWith(SERVER)) fehler.push('fremde Anfrage: ' + r.url()); });

  for (const [n, id] of IDS.entries()) {
    const U = I[id];
    await page.goto(basis + id + '.html');
    if (n === 0) {
      pruefe(await page.locator('#name-feld').count() === 1, `${id}: Namenseingabe beim ersten Öffnen`);
      await page.fill('#name-feld', 'Lena Kraus');
      await page.check('input[name=klasse][value=k2]');
      await page.click('#name-form button[type=submit]');
    }
    await page.waitForSelector('.karte');
    pruefe((await page.locator('#kopfzeile').innerText()).startsWith('KB I – Notfallsituationen'), `${id}: Kopfzeile KB I`);
    const karten = page.locator('.karte');
    pruefe(await karten.count() === U.karten.length, `${id}: ${U.karten.length} Karten`);
    for (let i = 0; i < U.karten.length; i++) {
      await karten.nth(i).locator(`button[data-kuerzel="${[].concat(U.karten[i].richtig)[0]}"]`).click();
    }
    await page.waitForSelector('#merksatz-bereich:not([hidden])');
    pruefe((await page.locator('#merksatz-bereich').innerText()).includes('abgeschlossen'), `${id}: abgeschlossen + Merksatz`);
    const breit = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    pruefe(breit, `${id}: kein waagerechtes Scrollen bei 360 px`);
    await page.waitForTimeout(300);
    const letzte = posts.filter((p) => p.uebung === id).pop();
    pruefe(letzte && letzte.raum === 'k2-' + U.raum && letzte.name === 'Lena K.' && letzte.geloest === U.karten.length, `${id}: an k2-${U.raum} gesendet: ` + JSON.stringify(letzte));
    await page.screenshot({ path: path.join(__dirname, `handy-tb2-${id}.png`) });
  }
  // Name und Klasse werden mit KB II geteilt (gleiche Adresse klawittersven-arch.github.io)
  const gemeinsam = await page.evaluate(() => [localStorage.getItem('kb2-notfall-name'), localStorage.getItem('kb2-notfall-klasse')]);
  pruefe(gemeinsam[0] && gemeinsam[0].indexOf('Lena') >= 0 && gemeinsam[1] === 'k2', 'Name und Klasse im gemeinsamen Speicher (kb2-notfall-…)');

  await page.setViewportSize({ width: 1280, height: 800 });
  for (const woche of [...new Set(IDS.map((id) => I[id].raum))]) {
    const ids = IDS.filter((id) => I[id].raum === woche);
    await page.goto(basis + `lehrer-3bfp2-2-${woche}.html`);
    await page.waitForSelector(`.l-karte[data-uebung="${ids[ids.length - 1]}"]`);
    const lehrer = await page.locator('#l-inhalt').innerText();
    pruefe(ids.every((id) => lehrer.includes(I[id].titel)), `Lehrerseite ${woche}: alle Übungen der Woche`);
    pruefe(IDS.filter((id) => I[id].raum !== woche).every((id) => !lehrer.includes(I[id].titel)), `Lehrerseite ${woche}: keine Übungen anderer Wochen`);
    pruefe(lehrer.includes('Lena K.'), `Lehrerseite ${woche}: Name erscheint`);
    await page.screenshot({ path: path.join(__dirname, `lehrer-tb2-${woche}.png`) });
  }
  pruefe(fehler.length === 0, 'keine Konsolenfehler / fremden Anfragen: ' + fehler.join(' | '));

  await browser.close();
  s.close();
  console.log(`${ok} Prüfungen bestanden, ${nok} fehlgeschlagen`);
  process.exit(nok ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

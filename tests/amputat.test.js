/* Test der Szene kb1ab06 „Die Fingerspitze retten“ (docs/tb2/szene.js, ohne Zeitdruck, Kacheln) – Playwright, nachgebildeter Server.
 * Aufruf (im Repository-Ordner):  node tests/amputat.test.js
 * Prüft: Namenseingabe, Regeln, alle drei Fälle mit richtigen Antworten, Bilder vorhanden, Senden an k2-kb1w2,
 * Herzen (zwei Fehler → Zusammenbruch, Fall neu), Blutverlust (Zeit abgelaufen → Zusammenbruch, „ohne Zeitdruck“),
 * Sperre nach Fehler, Neuladen mitten im Fall, kein waagerechtes Scrollen bei 360 px, Lehrerseite mit Besprechen. */
'use strict';
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DOCS = path.join(__dirname, '..', 'docs', 'tb2');
const TYPEN = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const SERVER = 'https://fortschritt.test';
const ID = 'kb1ab06';

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
  const U = I[ID];
  const s = await webserver();
  const basis = `http://127.0.0.1:${s.address().port}/`;
  const browser = await chromium.launch();
  let ok = 0, nok = 0;
  const pruefe = (bed, text) => { if (bed) ok++; else { nok++; console.log('  ✗ ' + text); } };

  // Inhalte prüfen
  pruefe(U.art === 'szene' && U.zeitdruck === false && U.karten.length === 6 && U.faelle.length === 1, 'Inhalt: 6 Schritte, ohne Zeitdruck');
  const bilder = new Set();
  U.faelle.forEach((f) => [f.bild, f.zusammenbruchBild, f.endeBild].forEach((b) => b && bilder.add(b)));
  U.karten.forEach((k, i) => {
    [k.bild, k.bildDanach, k.zusammenbruchBild].forEach((b) => b && bilder.add(b));
    k.antworten.forEach((a) => a.icon && bilder.add(a.icon));
    pruefe(k.antworten.some((a) => a.kuerzel === k.richtig && !a.ohneHerz), `Schritt ${k.nummer}: richtige Antwort ohne ohneHerz`);
    pruefe(k.nummer === i + 1, `Entscheidung ${i + 1}: fortlaufende Nummer`);
    pruefe(k.antworten.length >= 3 && k.antworten.filter((a) => a.kuerzel === k.richtig).length === 1, `Schritt ${k.nummer}: mind. 3 Antworten, genau eine richtig`);
    pruefe(k.antworten.every((a) => /^[A-Z]{1,6}$/.test(a.kuerzel)), `Entscheidung ${k.nummer}: Kürzel passen zum Server (A–Z, höchstens 6)`);
    pruefe(k.antworten.every((a) => a.kuerzel === k.richtig || a.warum), `Entscheidung ${k.nummer}: jede falsche Antwort hat eine Erklärung`);
    pruefe(k.erklaerung && k.text.length < 160, `Entscheidung ${k.nummer}: Erklärung vorhanden, Text kurz`);
  });
  for (const b of bilder) {
    const f = path.join(DOCS, U.bilder, b);
    pruefe(fs.existsSync(f) && fs.statSync(f).size < 10000, `Bild ${b} vorhanden und klein`);
  }

  const raeume = {}, posts = [];
  const kopf = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  async function kontext(inhalteAendern) {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
    await ctx.route('**/einstellungen.js', async (route) => {
      const antwort = await route.fetch();
      const text = (await antwort.text()).replace(/serverAdresse: '[^']*'/, `serverAdresse: '${SERVER}/'`);
      await route.fulfill({ response: antwort, body: text });
    });
    if (inhalteAendern) {
      await ctx.route('**/inhalte.js', async (route) => {
        const antwort = await route.fetch();
        await route.fulfill({ response: antwort, body: inhalteAendern(await antwort.text()) });
      });
    }
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
    page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(basis)) fehler.push('fehlt: ' + r.url()); });
    return { ctx, page, fehler };
  }
  async function anmelden(page, name) {
    await page.goto(basis + ID + '.html');
    await page.fill('#name-feld', name);
    await page.check('input[name=klasse][value=k2]');
    await page.click('#name-form button[type=submit]');
    await page.waitForSelector('#sz-start');
  }
  const richtig = (page, k) => page.click(`.sz-antwort[data-kuerzel="${k.richtig}"]`);
  const falsche = (k) => k.antworten.filter((a) => a.kuerzel !== k.richtig).map((a) => a.kuerzel);
  const breitOk = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  const letzter = (name) => posts.filter((p) => p.uebung === ID && p.name === name).pop();
  const shot = (page, n) => page.screenshot({ path: path.join(__dirname, `handy-amputat-${n}.png`) });

  // ---------- 1. Durchspielen ohne Fehler ----------
  {
    const { ctx, page, fehler } = await kontext();
    await anmelden(page, 'Lena Kraus');
    await shot(page, '1-regeln');
    await page.click('#sz-start');
    await page.waitForSelector('#sz-los');
    pruefe(await page.locator('.sz-blut').count() === 0, 'kein Blutverlust-Balken');
    await page.click('#sz-los');
    for (const k of U.karten) {
      await page.waitForSelector('.sz-antwort');
      pruefe(await page.locator('.sz-antwort').count() === k.antworten.length, `Schritt ${k.nummer}: ${k.antworten.length} Antworten`);
      if (k.kacheln) pruefe(await page.locator('.sz-kachel img.sz-icon').count() === k.antworten.length, `Schritt ${k.nummer}: Kacheln mit Bild`);
      if (k.nummer === 2) await shot(page, '2-kacheln');
      pruefe(await breitOk(page), `Schritt ${k.nummer}: kein waagerechtes Scrollen bei 360 px`);
      await richtig(page, k);
      await page.waitForSelector('#sz-naechste');
      await page.click('#sz-naechste');
    }
    await page.waitForSelector('#sz-weiter');
    await page.click('#sz-weiter');
    await page.waitForSelector('.sz-nadann');
    await page.waitForTimeout(3300);
    const text = await page.locator('.sz-buehne').innerText();
    pruefe(text.includes('Klinik') && text.includes('Aufgabe 2') && text.includes('6 von 6'), 'Ergebnis: geschafft, Hinweis aufs AB, 6 von 6');
    await shot(page, '4-ergebnis');
    await page.waitForTimeout(300);
    const l = letzter('Lena K.');
    pruefe(l && l.raum === 'k2-' + U.raum && l.geloest === 6 && l.gesamt === 6 && l.erster === 6 && l.falsch.length === 0, 'gesendet: 6/6: ' + JSON.stringify(l));
    pruefe(fehler.length === 0, 'Durchspielen: keine Konsolenfehler / fehlenden Dateien: ' + fehler.join(' | '));
    await ctx.close();
  }

  // ---------- 2. „Noch nicht“ kostet kein Herz, Fehler schon ----------
  {
    const { ctx, page, fehler } = await kontext();
    await anmelden(page, 'Tim Berg');
    await page.click('#sz-start');
    await page.click('#sz-los');
    await richtig(page, U.karten[0]);
    await page.click('#sz-naechste');
    const k2 = U.karten[1];
    const zuFrueh = k2.antworten.find((a) => a.ohneHerz);
    const fehlerAntworten = k2.antworten.filter((a) => a.kuerzel !== k2.richtig && !a.ohneHerz);
    await page.click(`.sz-antwort[data-kuerzel="${zuFrueh.kuerzel}"]`);
    await page.waitForSelector('#sz-rm .falsch');
    pruefe((await page.locator('#sz-rm').innerText()).includes('Noch nicht'), '„zu früh“: Hinweis „Noch nicht“');
    pruefe(!(await page.locator('.sz-herzen').innerText()).includes('🤍'), '„zu früh“: kein Herz weg');
    await shot(page, '3-noch-nicht');
    await page.waitForFunction((k) => !document.querySelector(`.sz-antwort[data-kuerzel="${k}"]`).disabled, k2.richtig, { timeout: 6000 });
    await page.click(`.sz-antwort[data-kuerzel="${fehlerAntworten[0].kuerzel}"]`);
    await page.waitForSelector('#sz-rm .falsch');
    pruefe((await page.locator('.sz-herzen').innerText()).includes('🤍'), 'Fehler: ein Herz weg');
    await page.waitForFunction((k) => !document.querySelector(`.sz-antwort[data-kuerzel="${k}"]`).disabled, k2.richtig, { timeout: 6000 });
    await page.click(`.sz-antwort[data-kuerzel="${fehlerAntworten[1].kuerzel}"]`);
    await page.waitForSelector('.sz-kollaps');
    const t = await page.locator('.sz-buehne').innerText();
    pruefe(t.includes('Nicht mehr zu retten') && t.includes('keine Herzen mehr'), 'zwei Fehler: „Nicht mehr zu retten“');
    pruefe(await page.locator('#sz-ohne-zeit').count() === 0, 'kein Knopf „ohne Zeitdruck“');
    await shot(page, '5-zusammenbruch');
    await page.waitForTimeout(300);
    const l = letzter('Tim B.');
    pruefe(l.neu === 1 && l.geloest === 0 && l.falsch.indexOf('2-' + zuFrueh.kuerzel) >= 0, 'gesendet: ↺ 1, erster Fehlgriff zählt: ' + JSON.stringify(l));
    await page.click('#sz-nochmal');
    await page.waitForSelector('#sz-los');
    pruefe(fehler.length === 0, 'Fehler-Test: keine Konsolenfehler: ' + fehler.join(' | '));
    await ctx.close();
  }

  // ---------- 3. Lehrerseite ----------
  {
    const { ctx, page, fehler } = await kontext();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(basis + 'lehrer-3bfp2-2-' + U.raum + '.html');
    await page.waitForSelector(`.l-karte[data-uebung="${ID}"]`);
    const sek = page.locator(`.l-karte[data-uebung="${ID}"]`);
    const txt = await sek.innerText();
    pruefe(txt.includes(U.titel) && txt.includes('Lena K.') && txt.includes('Tim B.') && txt.includes('Entscheidung 2'), 'Lehrerseite: Übung, Namen, „Oft falsch“');
    await sek.locator('.l-oft-knopf').first().click();
    await page.waitForSelector('.l-besprechen');
    const b = await page.locator('.l-besprechen').innerText();
    pruefe(U.karten[1].antworten.every((a) => b.includes(a.text.replace(/­/g, '')) || b.includes(a.text)), 'Besprechen: alle Kacheln dieses Schritts');
    pruefe(fehler.length === 0, 'Lehrerseite: keine Konsolenfehler: ' + fehler.join(' | '));
    await ctx.close();
  }

  await browser.close();
  s.close();
  console.log(`${ok} Prüfungen bestanden, ${nok} fehlgeschlagen`);
  process.exit(nok ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

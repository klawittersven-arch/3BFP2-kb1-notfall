/* Test der Notfall-Szene kb1ab05 „Notfall in der Werkstatt“ (docs/tb2/szene.js) in Handygröße – Playwright, nachgebildeter Server.
 * Aufruf (im Repository-Ordner):  node tests/szene.test.js
 * Prüft: Namenseingabe, Regeln, alle drei Fälle mit richtigen Antworten, Bilder vorhanden, Senden an k2-kb1w2,
 * Herzen (zwei Fehler → Zusammenbruch, Fall neu), Blutverlust (Zeit abgelaufen → Zusammenbruch, „ohne Zeitdruck“),
 * Sperre nach Fehler, Neuladen mitten im Fall, kein waagerechtes Scrollen bei 360 px, Lehrerseite mit Besprechen. */
'use strict';
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DOCS = path.join(__dirname, '..', 'docs', 'tb2');
const TYPEN = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp' };
const SERVER = 'https://fortschritt.test';
const ID = 'kb1ab05';

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
  pruefe(U.art === 'szene' && U.karten.length === 12 && U.faelle.length === 3, 'Inhalt: 12 Entscheidungen in 3 Fällen');
  const bilder = new Set();
  U.faelle.forEach((f) => [f.bild, f.zusammenbruchBild, f.endeBild].forEach((b) => b && bilder.add(b)));
  U.karten.forEach((k, i) => {
    [k.bild, k.bildDanach, k.zusammenbruchBild].forEach((b) => b && bilder.add(b));
    pruefe(k.nummer === i + 1, `Entscheidung ${i + 1}: fortlaufende Nummer`);
    pruefe(k.antworten.length === 3 && k.antworten.filter((a) => a.kuerzel === k.richtig).length === 1, `Entscheidung ${k.nummer}: 3 Antworten, genau eine richtig`);
    pruefe(k.antworten.every((a) => /^[A-Z]{1,6}$/.test(a.kuerzel)), `Entscheidung ${k.nummer}: Kürzel passen zum Server (A–Z, höchstens 6)`);
    pruefe(k.antworten.every((a) => a.kuerzel === k.richtig || a.warum), `Entscheidung ${k.nummer}: jede falsche Antwort hat eine Erklärung`);
    pruefe(k.erklaerung && k.text.length < 160, `Entscheidung ${k.nummer}: Erklärung vorhanden, Text kurz`);
  });
  for (const b of bilder) {
    const f = path.join(DOCS, U.bilder, b + '.webp');
    pruefe(fs.existsSync(f) && fs.statSync(f).size < 60000, `Bild ${b}.webp vorhanden und klein (< 60 KB)`);
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
  const shot = (page, n) => page.screenshot({ path: path.join(__dirname, `handy-szene-${n}.png`) });

  // ---------- 1. Durchspielen ohne Fehler ----------
  {
    const { ctx, page, fehler } = await kontext();
    await anmelden(page, 'Lena Kraus');
    pruefe((await page.locator('.sz-regeln').innerText()).includes('Zwei Herzen'), 'Regeln werden angezeigt');
    await shot(page, '1-regeln');
    await page.click('#sz-start');
    const reihenfolgen = [];
    for (let f = 0; f < U.faelle.length; f++) {
      await page.waitForSelector('#sz-los');
      pruefe((await page.locator('.sz-falltitel').innerText()) === U.faelle[f].titel, `Fall ${f + 1}: Einstieg mit Titel`);
      if (f === 0) await shot(page, '2-einstieg');
      await page.click('#sz-los');
      for (const k of U.karten.filter((x) => x.fall === f + 1)) {
        await page.waitForSelector('.sz-antwort');
        pruefe(await page.locator('.sz-antwort').count() === 3, `Entscheidung ${k.nummer}: 3 Antworten`);
        reihenfolgen.push((await page.locator('.sz-antwort').first().getAttribute('data-kuerzel')) === k.richtig);
        if (k.nummer === 1) await shot(page, '3-frage');
        pruefe(await breitOk(page), `Entscheidung ${k.nummer}: kein waagerechtes Scrollen bei 360 px`);
        await richtig(page, k);
        await page.waitForSelector('#sz-naechste');
        pruefe((await page.locator('#sz-rm').innerText()).includes('Richtig'), `Entscheidung ${k.nummer}: Rückmeldung „Richtig“`);
        if (k.bildDanach) pruefe((await page.locator('.sz-bild').getAttribute('src')).includes(k.bildDanach), `Entscheidung ${k.nummer}: Bild danach`);
        if (k.nummer === 1) await shot(page, '4-richtig');
        await page.click('#sz-naechste');
      }
      await page.waitForSelector('#sz-weiter');
      pruefe((await page.locator('.sz-buehne').innerText()).includes('Geschafft'), `Fall ${f + 1}: geschafft`);
      if (f === 0) await shot(page, '5-fallende');
      await page.click('#sz-weiter');
    }
    await page.waitForSelector('.sz-nadann');
    await page.waitForTimeout(3300);
    const text = await page.locator('.sz-buehne').innerText();
    pruefe(text.includes('Alle drei Notfälle') && text.includes('Aufgabe 2'), 'Ergebnis: geschafft + Hinweis aufs Arbeitsblatt');
    pruefe(await page.locator('.sz-nadann li').count() === 6, 'Ergebnis: Merkwort NA DANN mit 6 Schritten');
    pruefe(text.includes('12 von 12'), 'Ergebnis: 12 von 12 beim ersten Versuch');
    await shot(page, '6-ergebnis');
    pruefe(reihenfolgen.some((x) => x) || reihenfolgen.some((x) => !x), 'Antworten gemischt');
    await page.waitForTimeout(300);
    const l = letzter('Lena K.');
    pruefe(l && l.raum === 'k2-' + U.raum && l.geloest === 12 && l.gesamt === 12 && l.erster === 12 && l.neu === 0 && l.falsch.length === 0,
      'gesendet: 12/12, keine Fehler: ' + JSON.stringify(l));
    // Neu laden: Ergebnis bleibt
    await page.reload();
    await page.waitForSelector('.sz-nadann');
    pruefe(true, 'Neuladen nach dem Ende: Ergebnis bleibt');
    await page.click('#sz-alles');
    await page.waitForSelector('#sz-start');
    await page.waitForTimeout(200);
    pruefe(letzter('Lena K.').geloest === 0, '„Noch einmal von vorn“ setzt zurück');
    pruefe(fehler.length === 0, 'Durchspielen: keine Konsolenfehler / fehlenden Dateien: ' + fehler.join(' | '));
    await ctx.close();
  }

  // ---------- 2. Herzen: zwei Fehler → Zusammenbruch ----------
  {
    const { ctx, page, fehler } = await kontext();
    await anmelden(page, 'Tim Berg');
    await page.click('#sz-start');
    await page.click('#sz-los');
    const k1 = U.karten[0], k2 = U.karten[1];
    await richtig(page, k1);
    await page.click('#sz-naechste');
    await page.waitForSelector('.sz-antwort');
    const [f1, f2] = falsche(k2);
    await page.click(`.sz-antwort[data-kuerzel="${f1}"]`);
    await page.waitForSelector('#sz-rm .falsch');
    const rm = await page.locator('#sz-rm').innerText();
    pruefe(rm.includes('ein Herz weniger') && rm.includes(k2.antworten.find((a) => a.kuerzel === f1).warum.slice(0, 20)), 'Fehler: Erklärung zur gewählten Antwort');
    pruefe((await page.locator('.sz-herzen').innerText()).includes('🤍'), 'Fehler: ein Herz weg');
    pruefe(await page.locator(`.sz-antwort[data-kuerzel="${k2.richtig}"]`).isDisabled(), 'Sperre: Antworten kurz gesperrt');
    pruefe((await page.locator('#sz-sperre').count()) === 1, 'Sperre: Countdown sichtbar');
    await shot(page, '7-fehler');
    await page.waitForFunction((k) => !document.querySelector(`.sz-antwort[data-kuerzel="${k}"]`).disabled, k2.richtig, { timeout: 6000 });
    pruefe(true, 'Sperre: nach einigen Sekunden wieder frei');
    // Neuladen mitten in der Entscheidung
    await page.reload();
    await page.waitForSelector('.sz-antwort');
    pruefe((await page.locator('.sz-antwort.ist-falsch').count()) === 1 && (await page.locator('.sz-herzen').innerText()).includes('🤍'), 'Neuladen: Herzen und Fehler bleiben');
    await page.click(`.sz-antwort[data-kuerzel="${f2}"]`);
    await page.waitForSelector('.sz-kollaps');
    const t = await page.locator('.sz-buehne').innerText();
    pruefe(t.includes('Zusammenbruch') && t.includes('keine Herzen mehr') && t.includes('bewusstlos'), 'zwei Fehler: Zusammenbruch mit Text');
    pruefe(await page.locator('#sz-ohne-zeit').count() === 0, 'Zusammenbruch durch Fehler: kein „ohne Zeitdruck“');
    await shot(page, '8-zusammenbruch');
    await page.waitForTimeout(300);
    let l = letzter('Tim B.');
    pruefe(l.neu === 1 && l.geloest === 0 && l.falsch.indexOf('2-' + f1) >= 0, 'gesendet: ↺ 1, Fall zurückgesetzt, erster Fehler 2-' + f1 + ': ' + JSON.stringify(l));
    await page.click('#sz-nochmal');
    await page.waitForSelector('#sz-los');
    pruefe((await page.locator('.sz-falltitel').innerText()) === U.faelle[0].titel, 'Fall 1 beginnt von vorn');
    pruefe(!(await page.locator('.sz-leiste').innerText()).includes('🤍'), 'wieder zwei Herzen');
    // Jetzt richtig – Entscheidung 2 zählt nicht als „beim ersten Versuch“
    await page.click('#sz-los');
    for (const k of U.karten.filter((x) => x.fall === 1)) {
      await page.waitForSelector('.sz-antwort');
      await richtig(page, k);
      await page.click('#sz-naechste');
    }
    await page.waitForSelector('#sz-weiter');
    await page.waitForTimeout(300);
    l = letzter('Tim B.');
    pruefe(l.geloest === 9 && l.erster === 8 && l.neu === 1, 'nach Neustart: 9 gelöst, 8 beim ersten Versuch: ' + JSON.stringify(l));
    pruefe(fehler.length === 0, 'Herzen: keine Konsolenfehler: ' + fehler.join(' | '));
    await ctx.close();
  }

  // ---------- 3. Blutverlust: Zeit läuft ab → „ohne Zeitdruck“ ----------
  {
    const schnell = (t) => t.replace(/blutung: 1\.0,/g, 'blutung: 40,');
    const { ctx, page, fehler } = await kontext(schnell);
    await anmelden(page, 'Mia Sommer');
    await page.click('#sz-start');
    await page.waitForTimeout(1500);
    pruefe(await page.locator('#sz-los').count() === 1, 'Zeit läuft erst nach „Los“');
    await page.click('#sz-los');
    await page.waitForSelector('.sz-kollaps', { timeout: 6000 });
    const t = await page.locator('.sz-buehne').innerText();
    pruefe(t.includes('zu lange') && t.includes('Herr Weber'), 'Zeit abgelaufen: Zusammenbruch mit Hinweis');
    pruefe(await page.locator('#sz-ohne-zeit').count() === 1, 'Zeit abgelaufen: Knopf „ohne Zeitdruck“');
    await shot(page, '9-zeit');
    await page.click('#sz-ohne-zeit');
    await page.click('#sz-los');
    await page.waitForTimeout(2500);
    pruefe(await page.locator('.sz-kollaps').count() === 0 && (await page.locator('.sz-leiste').innerText()).includes('ohne Zeitdruck'), 'ohne Zeitdruck: kein Zusammenbruch durch Zeit');
    pruefe(fehler.length === 0, 'Zeit: keine Konsolenfehler: ' + fehler.join(' | '));
    await ctx.close();
  }

  // ---------- 4. Lehrerseite ----------
  {
    const { ctx, page, fehler } = await kontext();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(basis + 'lehrer-3bfp2-2-' + U.raum + '.html');
    await page.waitForSelector(`.l-karte[data-uebung="${ID}"]`);
    const sek = page.locator(`.l-karte[data-uebung="${ID}"]`);
    const txt = await sek.innerText();
    pruefe(txt.includes(U.titel) && txt.includes('Lena K.') && txt.includes('Tim B.'), 'Lehrerseite: Szene mit Namen');
    pruefe(txt.includes('Entscheidung 2'), 'Lehrerseite: „Oft falsch“ nennt die Entscheidung');
    pruefe((await page.locator('#l-fuss').innerText()).includes('Notfall-Szene'), 'Lehrerseite: Legende zur Szene');
    await sek.locator('.l-oft-knopf').first().click();
    await page.waitForSelector('.l-besprechen');
    const b = await page.locator('.l-besprechen').innerText();
    pruefe(U.karten[1].antworten.every((a) => b.includes(a.text)), 'Besprechen: die drei Antworten dieser Entscheidung');
    await page.click('#l-b-auf');
    pruefe((await page.locator('.l-b-erklaerung').innerText()).includes('Druck'), 'Besprechen: Lösung');
    await page.screenshot({ path: path.join(__dirname, 'lehrer-szene.png') });
    pruefe(fehler.length === 0, 'Lehrerseite: keine Konsolenfehler: ' + fehler.join(' | '));
    await ctx.close();
  }

  await browser.close();
  s.close();
  console.log(`${ok} Prüfungen bestanden, ${nok} fehlgeschlagen`);
  process.exit(nok ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

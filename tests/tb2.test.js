/* Test der Handy-Übungen „TB 2 neu ab KW 49“ (docs/tb2) in Handygröße – Playwright, Chromium, nachgebildeter Server.
 * Aufruf (im Repository-Ordner):  node tests/tb2.test.js
 * Seit 26.11.2026 Kartenstapel wie bei KB II (Technik: Kopie von 3BFP2_KB2_Notfall/docs/app.js, Präfix „kb1-tb2-“).
 * Teil A:  je Übung Namenseingabe (einmal), Aufwärmen, Tipp, Sperre, Schritt 2, Sterne, Merksatz, Bonus-Fall,
 *          Senden an den Raum der Woche (k2-kb1w1 …), Links nur zur Challenge, 360 px, keine fremden Anfragen.
 * Teil A2: zufällige Reihenfolge – je Handy anders, beim Neuladen gleich, nie im Wechsel/sortiert/mehr als 3 gleiche.
 * Teil A3: Herzen weg → Lesepause → Neustart mit neuer Mischung, ↺ wird gesendet.
 * Teil B:  Name/Klasse gemeinsam mit KB II; Lehrerseiten je Woche mit Sternen und Bestenliste.
 * Teil F:  Wochen-Challenge (kb1w1) und TB2-Challenge (kb1w5) mit Bestenliste und Siegerehrung.
 * Die Lesezeit ist ausgeschaltet (sonst würden die schnellen Testklicks Warnungen auslösen). */
'use strict';
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DOCS = path.join(__dirname, '..', 'docs', 'tb2');
const TYPEN = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const SERVER = 'https://fortschritt.test';
const P = 'kb1-tb2-';
const SPERRE = 1650;
const HANDY = { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true };
const BEAMER = { viewport: { width: 1280, height: 800 } };

global.window = {};
eval(fs.readFileSync(path.join(DOCS, 'inhalte.js'), 'utf8') + ';global.I = INHALTE;');
const IDS = Object.keys(I).filter(k => I[k] && I[k].karten);
const richtigeVon = k => [].concat(k.richtig);
const falscheVon = (U, k) => U.knoepfe.map(b => b.kuerzel).filter(x => !richtigeVon(k).includes(x));
const ohneSterne = s => String(s).replace(/\*\*?/g, '');
const challengePunkte = (r, g, sek) => 100 * r + Math.round(500 * (g ? r / g : 0) * Math.max(0, 1 - sek / 600));
function laengsterLauf(f) { let m = f.length ? 1 : 0, l = 1; for (let i = 1; i < f.length; i++) { l = f[i] === f[i - 1] ? l + 1 : 1; m = Math.max(m, l); } return m; }
function auffaellig(f, kz) { // wie in docs/tb2/app.js
  const p = kz.length;
  let periodisch = f.length > p, sortiert = true, verschieden = false;
  for (let i = 1; i < f.length; i++) {
    if (i >= p && f[i] !== f[i - p]) periodisch = false;
    if (kz.indexOf(f[i]) < kz.indexOf(f[i - 1])) sortiert = false;
    if (f[i] !== f[0]) verschieden = true;
  }
  return laengsterLauf(f) > 3 || (verschieden && (periodisch || sortiert));
}
function einstellungen(text, server, o = {}) {
  text = text.replace(/serverAdresse: '[^']*'/, `serverAdresse: '${server}'`)
    .replace(/lesezeit: (true|false)/, 'lesezeit: false')
    .replace(/leerePauseSekunden: [\d.]+/, `leerePauseSekunden: ${o.leer || 1}`);
  return text;
}

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

// Nachgebildeter Server (gleiche Schnittstelle wie der KB-II-Worker)
function fortschrittsServer() {
  const raeume = {}, challenge = {}, posts = [], chPosts = [];
  let nr = 0;
  const kopf = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  const bestenliste = r => Object.values(challenge[r] || {}).map(p => Object.assign({}, p))
    .sort((a, b) => b.punkte - a.punkte || a.dauer - b.dauer || a.name.localeCompare(b.name, 'de'));
  return {
    raeume, challenge, posts, chPosts,
    async route(route) {
      const req = route.request();
      const url = new URL(req.url());
      const d = req.method() === 'POST' ? JSON.parse(req.postData()) : null;
      if (url.pathname === '/fortschritt') {
        posts.push(d);
        const r = raeume[d.raum] = raeume[d.raum] || {};
        const p = r[d.geraet] = r[d.geraet] || { id: 'id' + (++nr), uebungen: {} };
        p.name = d.name; p.t = Date.now();
        p.uebungen[d.uebung] = { geloest: d.geloest, gesamt: d.gesamt, erster: d.erster, neu: d.neu || 0, falsch: d.falsch, t: Date.now() };
        if (d.sterne) p.uebungen[d.uebung].sterne = d.sterne;
        return route.fulfill({ status: 204, headers: kopf });
      }
      if (url.pathname === '/challenge') {
        chPosts.push(d);
        if (d.dauer < d.gesamt) return route.fulfill({ status: 400, headers: kopf });
        const r = challenge[d.raum] = challenge[d.raum] || {};
        const punkte = challengePunkte(d.richtig, d.gesamt, d.dauer);
        const p = r[d.geraet] = r[d.geraet] || { id: 'ch' + (++nr), punkte: -1 };
        p.name = d.name; p.t = Date.now(); p.runden = (p.runden || 0) + 1;
        if (punkte > p.punkte) Object.assign(p, { punkte, richtig: d.richtig, gesamt: d.gesamt, dauer: d.dauer });
        return route.fulfill({ status: 204, headers: kopf });
      }
      if (url.pathname === '/challenge-leeren') { challenge[d.raum] = {}; return route.fulfill({ status: 204, headers: kopf }); }
      if (req.method() === 'GET' && url.pathname === '/stand') {
        const raum = url.searchParams.get('raum');
        return route.fulfill({ status: 200, headers: kopf, body: JSON.stringify({ jetzt: Date.now(), eintraege: Object.values(raeume[raum] || {}), challenge: bestenliste(raum) }) });
      }
      return route.fulfill({ status: 404, headers: kopf });
    }
  };
}

(async () => {
  const s = await webserver();
  const basis = `http://127.0.0.1:${s.address().port}/`;
  const browser = await chromium.launch();
  let ok = 0, nok = 0;
  const pruefe = (bed, text) => { if (bed) ok++; else { nok++; console.log('  ✗ ' + text); } };
  const srv = fortschrittsServer();

  async function kontext(optionen, o) {
    const ctx = await browser.newContext(optionen);
    await ctx.route('**/einstellungen.js', async (route) => {
      const antwort = await route.fetch();
      await route.fulfill({ response: antwort, body: einstellungen(await antwort.text(), SERVER + '/', o) });
    });
    await ctx.route(SERVER + '/**', r => srv.route(r));
    return ctx;
  }
  function beobachte(page, fehler) {
    page.on('pageerror', (e) => fehler.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text()); });
    page.on('request', (r) => { if (!r.url().startsWith(basis) && !r.url().startsWith(SERVER)) fehler.push('fremde Anfrage: ' + r.url()); });
  }
  async function anmelden(p, n, klasse) {
    await p.fill('#name-feld', n);
    await p.check(`input[name=klasse][value=${klasse}]`);
    await p.click('#name-form button[type=submit]');
  }
  const text = (p, sel) => p.locator(sel).innerText();
  const herzWeg = p => p.locator('#herzen .herz-weg').count();
  const karteJetzt = p => p.locator('#karten .karte[data-index]');
  async function indexJetzt(p) { await karteJetzt(p).waitFor(); return Number(await karteJetzt(p).getAttribute('data-index')); }
  const sitzung = (p, k) => p.evaluate(x => JSON.parse(sessionStorage.getItem(x) || 'null'), k);
  const breitOk = p => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  async function spiele(p, U, o = {}) {
    if (U.aufwaermen && await p.locator('[data-aufwaermen]').count()) {
      for (let j = 0; j < U.aufwaermen.schritte.length; j++) await p.click(`.reihe-teil[data-schritt="${j}"]`);
      await p.click('#aufw-los');
    }
    const anzahl = o.bis || (U.karten.length - Number((await text(p, '#fortschritt-text')).split(' ')[0]));
    for (let n = 0; n < anzahl; n++) {
      const K = U.karten[await indexJetzt(p)], karte = karteJetzt(p);
      if (o.fehler && o.fehler.has(K.nummer)) {
        await karte.locator(`button[data-kuerzel="${falscheVon(U, K)[0]}"]`).click();
        await p.waitForTimeout(SPERRE);
      }
      const r = richtigeVon(K)[0];
      await karte.locator(`button[data-kuerzel="${r}"]`).click();
      if (K.schritt2 && (!K.schritt2.nur || K.schritt2.nur.includes(r))) {
        if (o.fehler2 && o.fehler2.has(K.nummer)) {
          await karte.locator(`.option[data-option="${K.schritt2.richtig === 0 ? 1 : 0}"]`).click();
          await p.waitForTimeout(SPERRE);
        }
        await karte.locator(`.option[data-option="${K.schritt2.richtig}"]`).click();
      }
      await p.click('#weiter-knopf');
    }
  }

  /* ---------------- Teil A: jede Übung ---------------- */
  const ctx = await kontext(HANDY);
  const page = await ctx.newPage();
  const fehler = [];
  beobachte(page, fehler);
  const geschafft = new Set();
  for (const [n, id] of IDS.entries()) {
    const U = I[id], N = U.karten.length;
    await page.goto(basis + id + '.html');
    if (n === 0) {
      pruefe(await page.locator('#name-feld').count() === 1, `${id}: Namenseingabe beim ersten Öffnen`);
      await anmelden(page, 'Lena Kraus', 'k2');
    }
    pruefe((await text(page, '#kopfzeile')).startsWith('KB I – Notfallsituationen'), `${id}: Kopfzeile KB I`);
    pruefe(await page.locator('#karten .karte').count() === 1 && await page.locator('#herzen .herz').count() === 3, `${id}: eine Karte, drei Herzen`);
    if (U.aufwaermen) {
      pruefe(await page.locator('[data-aufwaermen]').isVisible(), `${id}: Aufwärmen kommt zuerst`);
      for (let j = 0; j < U.aufwaermen.schritte.length; j++) await page.click(`.reihe-teil[data-schritt="${j}"]`);
      await page.screenshot({ path: path.join(__dirname, `handy-tb2-${id}-aufwaermen.png`) });
      await page.click('#aufw-los');
    }
    const K0 = U.karten[await indexJetzt(page)], karte = karteJetzt(page);
    pruefe((await text(page, '.karte-kopf')).includes('1 von ' + N) && !(await text(page, '.karte-text')).includes('*'), `${id}: „1 von ${N}“, keine Sternchen`);
    await karte.locator(`button[data-kuerzel="${falscheVon(U, K0)[0]}"]`).click();
    pruefe(await karte.locator(`button[data-kuerzel="${richtigeVon(K0)[0]}"]`).isDisabled() && (await text(page, '.rueckmeldung.falsch')).includes(ohneSterne(K0.tipp).slice(0, 20)) && await herzWeg(page) === 1, `${id}: Tipp, Herz weg, kurz gesperrt`);
    await page.waitForTimeout(SPERRE);
    await karte.locator(`button[data-kuerzel="${richtigeVon(K0)[0]}"]`).click();
    if (K0.schritt2) await karte.locator(`.option[data-option="${K0.schritt2.richtig}"]`).click();
    pruefe((await text(page, '#fortschritt-text')).startsWith('1 von') && await page.locator('#weiter-knopf').isVisible(), `${id}: Karte gelöst, „Weiter“`);
    await page.click('#weiter-knopf');
    const s2 = U.karten.filter(k => k.schritt2 && k !== K0).map(k => k.nummer);
    if (s2.length) {
      // Schritt 2 sichtbar prüfen, sobald eine Karte damit kommt
      while (!U.karten[await indexJetzt(page)].schritt2) await spiele(page, U, { bis: 1 });
      const K = U.karten[await indexJetzt(page)];
      await karteJetzt(page).locator(`button[data-kuerzel="${richtigeVon(K)[0]}"]`).click();
      pruefe(await page.locator('.s1-ok').isVisible() && (await text(page, '.schritt2-frage')).includes(ohneSterne(K.schritt2.frage).slice(0, 15)) && await page.locator('#weiter-knopf').count() === 0, `${id}: Schritt 2 (Begründung) nach der richtigen Antwort`);
      await page.screenshot({ path: path.join(__dirname, `handy-tb2-${id}-schritt2.png`) });
      await karteJetzt(page).locator(`.option[data-option="${K.schritt2.richtig === 0 ? 1 : 0}"]`).click();
      pruefe(await herzWeg(page) === 2 && (await text(page, '.rueckmeldung.falsch')).includes(ohneSterne(K.schritt2.tipp || K.tipp).slice(0, 15)), `${id}: falsche Begründung → Tipp, Herz weg`);
      await page.waitForTimeout(SPERRE);
      await karteJetzt(page).locator(`.option[data-option="${K.schritt2.richtig}"]`).click();
      pruefe((await text(page, '.rueckmeldung.richtig')).includes(ohneSterne(K.schritt2.erklaerung || K.erklaerung).slice(0, 15)), `${id}: richtige Begründung → Erklärung`);
      await page.click('#weiter-knopf');
    }
    await spiele(page, U, {});
    const fehlerZahl = 1 + (s2.length ? 1 : 0);
    pruefe((await text(page, '#merksatz-bereich')).includes('abgeschlossen') && (await text(page, '#merksatz-bereich')).includes(ohneSterne(U.merksatz).slice(0, 25)), `${id}: abgeschlossen + Merksatz`);
    pruefe((await text(page, '.sterne')) === '★★☆' && (await text(page, '.erster-versuch')).includes(`${N - fehlerZahl} von ${N}`), `${id}: ${fehlerZahl} Fehler → ★★☆`);
    geschafft.add(id);
    const erwartet = /^kb1w[1-4]$/.test(U.raum) && IDS.filter(k => I[k].raum === U.raum).every(k => geschafft.has(k)) ? ['challenge-' + U.raum + '.html'] : [];
    const links = await page.locator('a[href]').evaluateAll(a => a.map(x => x.getAttribute('href')));
    pruefe(links.join() === erwartet.join(), `${id}: Links nur zur Challenge, sobald die Woche geschafft ist (${links.join() || 'keine'})`);
    pruefe(await breitOk(page), `${id}: kein waagerechtes Scrollen bei 360 px`);
    await page.screenshot({ path: path.join(__dirname, `handy-tb2-${id}.png`), fullPage: true });
    if (U.bonus) {
      const F = U.bonus;
      await page.click('#bonus-start');
      for (let j = 0; j < F.schritte.length; j++) {
        const S = F.schritte[j];
        if (j === 0) {
          const fj = S.optionen.findIndex(o => !o.richtig);
          await page.click(`[data-bonus="${fj}"]`);
          pruefe((await text(page, '.bonus .rueckmeldung.falsch')).includes(ohneSterne(S.optionen[fj].reaktion).slice(0, 20)), `${id}: Bonus – Reaktion auf falsche Wahl`);
        }
        await page.click(`[data-bonus="${S.optionen.findIndex(o => o.richtig)}"]`);
        await page.click('#bonus-weiter');
      }
      await page.screenshot({ path: path.join(__dirname, `handy-tb2-${id}-bonus.png`) });
      await page.click('#bonus-zurueck');
      pruefe(await page.locator('.bonus-fertig').isVisible(), `${id}: Bonus-Fall geschafft`);
    }
    await page.waitForTimeout(300);
    const letzte = srv.posts.filter((p) => p.uebung === id).pop();
    pruefe(letzte && letzte.raum === 'k2-' + U.raum && letzte.name === 'Lena K.' && letzte.geloest === N && letzte.sterne === 2, `${id}: an k2-${U.raum} gesendet (mit ★★): ` + JSON.stringify(letzte));
  }

  /* ---------------- Teil A2: Reihenfolge ---------------- */
  for (const id of IDS) {
    const U = I[id], n = U.karten.length, kz = U.knoepfe.map((b) => b.kuerzel);
    const folgen = new Set();
    let gueltig = true, unauffaellig = true;
    for (let v = 0; v < 8; v++) {
      await page.goto(basis + id + '.html');
      await page.evaluate(() => sessionStorage.clear());
      await page.reload();
      const r = await sitzung(page, P + id + '-reihenfolge');
      if (!r || [...r].sort((x, y) => x - y).join() !== [...Array(n).keys()].join()) gueltig = false;
      if (!U.aufwaermen && Number(await karteJetzt(page).getAttribute('data-index')) !== r[0]) gueltig = false;
      if (auffaellig(r.map((i) => richtigeVon(U.karten[i])[0]), kz)) unauffaellig = false;
      folgen.add(r.join());
    }
    pruefe(gueltig, `${id}: jede Karte genau einmal, Stapel beginnt mit der ersten Karte der Reihenfolge`);
    pruefe(unauffaellig, `${id}: keine Antwortfolge im Wechsel, sortiert oder mit mehr als 3 gleichen hintereinander`);
    pruefe(folgen.size >= 2, `${id}: Reihenfolge zufällig (${folgen.size} verschiedene bei 8 Aufrufen)`);
    const vorher = (await sitzung(page, P + id + '-reihenfolge')).join();
    await page.reload();
    pruefe((await sitzung(page, P + id + '-reihenfolge')).join() === vorher, `${id}: Reihenfolge bleibt beim Neuladen gleich`);
  }

  /* ---------------- Teil A3: Herzen weg → Lesepause → Neustart ---------------- */
  {
    const U = I[IDS[0]];
    await page.goto(basis + IDS[0] + '.html');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    const r1 = await sitzung(page, P + IDS[0] + '-reihenfolge');
    await spiele(page, U, { bis: 2, fehler: new Set(U.karten.map(k => k.nummer)) });
    const K = U.karten[await indexJetzt(page)];
    await karteJetzt(page).locator(`button[data-kuerzel="${falscheVon(U, K)[0]}"]`).click();
    pruefe(await page.locator('.pause-leer').isVisible() && (await text(page, '.pause')).includes('Keine Herzen mehr'), 'A3: drittes Herz weg → Lesepause');
    await page.screenshot({ path: path.join(__dirname, 'handy-tb2-herzen-leer.png') });
    await page.waitForTimeout(1800);
    pruefe((await text(page, '#fortschritt-text')).startsWith('0 von') && await herzWeg(page) === 0 && (await sitzung(page, P + IDS[0] + '-reihenfolge')).join() !== r1.join(), 'A3: Neustart mit 3 Herzen und neu gemischten Karten');
    await page.waitForTimeout(300);
    const l = srv.posts.filter(p => p.uebung === IDS[0]).pop();
    pruefe(l.neu === 1 && l.geloest === 0, 'A3: ↺ wird gesendet (neu = 1)');
  }

  /* ---------------- Teil B: gemeinsamer Name, Lehrerseiten je Woche ---------------- */
  const gemeinsam = await page.evaluate(() => [localStorage.getItem('kb2-notfall-name'), localStorage.getItem('kb2-notfall-klasse')]);
  pruefe(gemeinsam[0] && gemeinsam[0].indexOf('Lena') >= 0 && gemeinsam[1] === 'k2', 'Name und Klasse im gemeinsamen Speicher (kb2-notfall-…)');
  pruefe(fehler.length === 0, 'Teil A: keine Konsolenfehler / fremden Anfragen: ' + fehler.join(' | '));

  /* ---------------- Teil F: Wochen-Challenge auf dem Handy ---------------- */
  async function challengeLauf(p, falschBei, anzahl) {
    const gezogen = [];
    for (let pos = 0; pos < anzahl; pos++) {
      const k = p.locator('#karten .karte[data-uebung]');
      await k.waitFor();
      const u = await k.getAttribute('data-uebung'), i = Number(await k.getAttribute('data-karte'));
      const U = I[u], K = U.karten[i];
      gezogen.push({ u, r: richtigeVon(K)[0] });
      await p.waitForTimeout(150);
      await k.locator(`button[data-kuerzel="${falschBei.includes(pos) ? falscheVon(U, K)[0] : richtigeVon(K)[0]}"]`).click();
      await p.waitForFunction(x => { const e = document.querySelector('#karten .karte[data-uebung]'); return !e || Number(e.getAttribute('data-index')) === x; }, pos + 1, { timeout: 5000 });
    }
    await p.waitForSelector('.ch-ergebnis');
    await p.waitForTimeout(300);
    return gezogen;
  }
  {
    const woche = IDS.filter(k => I[k].raum === 'kb1w1');
    await page.goto(basis + 'challenge-kb1w1.html'); // freigeschaltet, weil alle Übungen der Woche in Teil A geschafft wurden
    await page.waitForSelector('#ch-start');
    pruefe((await text(page, '#titel')).includes('Challenge') && (await text(page, '#anweisung')).includes('15 Karten'), 'F: Wochen-Challenge kb1w1 freigeschaltet, 15 Karten');
    await page.click('#ch-start');
    const gezogen = await challengeLauf(page, [0], 15);
    pruefe(gezogen.every(g => woche.includes(g.u)) && new Set(gezogen.map(g => g.u)).size === woche.length && laengsterLauf(gezogen.map(g => g.r)) <= 3, 'F: Karten aus allen Übungen der Woche, nie mehr als 3 gleiche hintereinander');
    const post = srv.chPosts[srv.chPosts.length - 1];
    pruefe(post && post.raum === 'k2-kb1w1' && post.richtig === 14 && post.gesamt === 15 && post.name === 'Lena K.', 'F: Ergebnis an k2-kb1w1 gesendet: ' + JSON.stringify(post));
    pruefe((await text(page, '.ch-punkte')).includes(challengePunkte(14, 15, post.dauer).toLocaleString('de-DE')) && await page.locator('.ch-loesung').count() === 1, 'F: Punkte und die falsche Karte mit Lösung');
    pruefe(Number(await page.evaluate(k => localStorage.getItem(k), P + 'challenge-kb1w1-best')) > 0, 'F: Bestleistung im KB-I-Speicher');
    await page.screenshot({ path: path.join(__dirname, 'handy-tb2-challenge.png'), fullPage: true });
    // TB2-Challenge: offen, aus allen Übungen der 4 Wochen
    await page.goto(basis + 'challenge-kb1w5.html');
    await page.click('#ch-start');
    const tb2 = await challengeLauf(page, [], 20);
    const alle = IDS.filter(k => /^kb1w[1-4]$/.test(I[k].raum));
    pruefe(tb2.every(g => alle.includes(g.u)) && new Set(tb2.map(g => g.u)).size === Math.min(20, alle.length), 'F: TB2-Challenge zieht gleichmäßig aus allen Wochen');
    pruefe(srv.chPosts[srv.chPosts.length - 1].raum === 'k2-kb1w5', 'F: TB2-Challenge an k2-kb1w5 gesendet');
    pruefe(fehler.length === 0, 'Teil F: keine Konsolenfehler / fremden Anfragen: ' + fehler.join(' | '));
  }
  await ctx.close();

  /* ---------------- Lehrerseiten je Woche ---------------- */
  {
    const c2 = await kontext(BEAMER);
    const p2 = await c2.newPage();
    const f2 = [];
    beobachte(p2, f2);
    p2.on('dialog', d => d.accept());
    for (const woche of [...new Set(IDS.map((id) => I[id].raum))]) {
      const ids = IDS.filter((id) => I[id].raum === woche);
      await p2.goto(basis + `lehrer-3bfp2-2-${woche}.html`);
      await p2.waitForSelector(`.l-karte[data-uebung="${ids[ids.length - 1]}"] .l-pille`);
      const lehrer = await text(p2, '#l-inhalt');
      pruefe(ids.every((id) => lehrer.includes(I[id].titel)), `Lehrerseite ${woche}: alle Übungen der Woche`);
      pruefe(IDS.filter((id) => I[id].raum !== woche).every((id) => !lehrer.includes(I[id].titel)), `Lehrerseite ${woche}: keine Übungen anderer Wochen`);
      pruefe((await p2.locator(`.l-karte[data-uebung="${ids[ids.length - 1]}"] .l-pille`, { hasText: 'Lena K.' }).innerText()).includes('★★☆'), `Lehrerseite ${woche}: Lena K. mit ★★☆`);
      pruefe(await p2.locator('.l-challenge').count() === 1 && (await text(p2, '.l-challenge')).includes('Wochen-Challenge'), `Lehrerseite ${woche}: Bereich Wochen-Challenge`);
      await p2.screenshot({ path: path.join(__dirname, `lehrer-tb2-${woche}.png`), fullPage: true });
    }
    await p2.goto(basis + 'lehrer-3bfp2-2-kb1w1.html');
    await p2.waitForSelector('.l-ch-zeile');
    pruefe((await text(p2, '.l-ch-zeile')).includes('Lena K.'), 'Lehrerseite kb1w1: Lena K. in der Bestenliste');
    await p2.click('#l-ch-ehrung');
    pruefe((await text(p2, '.l-podest-1')).includes('Lena K.'), 'Lehrerseite kb1w1: Siegerehrung');
    await p2.keyboard.press('Escape');
    await p2.click('#l-ch-qr');
    pruefe(await p2.locator('.l-qr svg').count() === 1 && (await text(p2, '.l-qr-url')).endsWith('/challenge-kb1w1.html?offen=1'), 'Lehrerseite kb1w1: QR-Code zur offenen Challenge');
    await p2.keyboard.press('Escape');
    await p2.goto(basis + 'lehrer-3bfp2-2-kb1w5.html');
    await p2.waitForSelector('.l-challenge');
    pruefe((await text(p2, '.l-challenge')).includes('TB2-Challenge') && (await text(p2, '.l-challenge')).includes('Lena K.'), 'Lehrerseite kb1w5: TB2-Challenge mit Bestenliste');
    await p2.screenshot({ path: path.join(__dirname, 'lehrer-tb2-kb1w5.png'), fullPage: true });
    pruefe(f2.length === 0, 'Lehrerseiten: keine Konsolenfehler / fremden Anfragen: ' + f2.join(' | '));
    await c2.close();
  }

  await browser.close();
  s.close();
  console.log(`${ok} Prüfungen bestanden, ${nok} fehlgeschlagen`);
  process.exit(nok ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

/* KB I · Woche 4 (3BFP2) – eigener Cloudflare-Worker für die optionale Lehreransicht.
 * Unabhängig vom Worker der Woche 2 (worker/, wrangler.jsonc): eigener Name, eigener Speicher.
 *
 *   POST /api/raum                         neuen Raum anlegen → { raum, schluessel, laeuftAb }
 *   GET  /api/pruefen?raum=1234            gibt es den Raum? → { ok }
 *   POST /api/melden { raum, geraet, gruppe, uebung, punkte, max, fertig, fehlalarme?, uebersehen?, gewonnen?, fehler? }
 *   GET  /api/stand?raum=&schluessel=      alle Meldungen des Raums (nur mit Schlüssel)
 *
 * Datensparsamkeit: Zufalls-Geräte-ID, freiwilliger Gruppenname (kein echter Name nötig), je Übung Punkte,
 * Fehlalarme und Kennungen falscher Entscheidungen (z. B. „k5-rot“). Nach LEBENSDAUER_MINUTEN löscht ein
 * Alarm den ganzen Raum. Keine Protokolle (observability aus). */
import { DurableObject } from 'cloudflare:workers';

const RAUM_MUSTER = /^\d{4}$/;
const GERAET_MUSTER = /^[a-z0-9]{10,40}$/;
const SCHLUESSEL_MUSTER = /^[A-Za-z0-9]{20,64}$/;
const GRUPPE_MUSTER = /^[A-Za-z0-9ÄÖÜäöüß .-]{0,20}$/;
const UEBUNGEN = ['verlauf', 'speisesaal', 'rueckenmark', 'trend', 'atemweg'];
const FEHLER_MUSTER = /^[a-z0-9-]{1,24}$/;
const MAX_GERAETE = 80;
const MAX_KOERPER = 2000;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};
function antwort(daten, status = 200) {
  return new Response(JSON.stringify(daten), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS } });
}
function zufall(n, zeichen) {
  const z = crypto.getRandomValues(new Uint32Array(n));
  return Array.from(z, (x) => zeichen[x % zeichen.length]).join('');
}
function gleich(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
const ganz = (x, max) => (Number.isInteger(x) && x >= 0 && x <= max ? x : null);
async function jsonLesen(request) {
  const text = await request.text();
  if (text.length > MAX_KOERPER) return null;
  try { return JSON.parse(text); } catch (e) { return null; }
}
function meldungPruefen(d) {
  if (!d || typeof d !== 'object') return null;
  const m = {
    raum: String(d.raum ?? ''), geraet: String(d.geraet ?? ''), gruppe: String(d.gruppe ?? '').trim(), uebung: String(d.uebung ?? ''),
    punkte: ganz(d.punkte, 100), max: ganz(d.max, 100), fertig: d.fertig === true,
    fehlalarme: ganz(d.fehlalarme ?? 0, 50), uebersehen: ganz(d.uebersehen ?? 0, 50), gewonnen: d.gewonnen === true
  };
  if (!RAUM_MUSTER.test(m.raum) || !GERAET_MUSTER.test(m.geraet) || !GRUPPE_MUSTER.test(m.gruppe) || !UEBUNGEN.includes(m.uebung)) return null;
  if (m.punkte === null || m.max === null || m.punkte > m.max || m.fehlalarme === null || m.uebersehen === null) return null;
  const f = Array.isArray(d.fehler) ? d.fehler : [];
  if (f.length > 20 || !f.every((x) => typeof x === 'string' && FEHLER_MUSTER.test(x))) return null;
  m.fehler = f;
  return m;
}
const raumStub = (env, raum) => env.RAUM.get(env.RAUM.idFromName('w4-' + raum));
const lebensdauerMs = (env) => Math.max(5, Math.min(24 * 60, Number(env.LEBENSDAUER_MINUTEN) || 360)) * 60000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const weg = url.pathname.replace(/\/+$/, '') || '/';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    try {
      if (weg === '/' && request.method === 'GET') return antwort({ dienst: 'KB1 Woche 4 (3BFP2) – Lehreransicht', ok: true });
      if (weg === '/api/raum' && request.method === 'POST') {
        const schluessel = zufall(32, 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789');
        for (let versuch = 0; versuch < 12; versuch++) {
          const raum = String(1000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 9000));
          const erg = await raumStub(env, raum).anlegen(raum, schluessel, lebensdauerMs(env));
          if (erg.ok) return antwort({ ok: true, raum, schluessel, laeuftAb: erg.laeuftAb });
        }
        return antwort({ ok: false, grund: 'kein-code-frei' }, 503);
      }
      if (weg === '/api/pruefen' && request.method === 'GET') {
        const raum = url.searchParams.get('raum') || '';
        if (!RAUM_MUSTER.test(raum)) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        return antwort({ ok: await raumStub(env, raum).gibtEs() });
      }
      if (weg === '/api/stand' && request.method === 'GET') {
        const raum = url.searchParams.get('raum') || '';
        const schluessel = url.searchParams.get('schluessel') || '';
        if (!RAUM_MUSTER.test(raum) || !SCHLUESSEL_MUSTER.test(schluessel)) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        const erg = await raumStub(env, raum).stand(schluessel);
        return antwort(erg, erg.ok ? 200 : (erg.grund === 'schluessel' ? 403 : 404));
      }
      if (weg === '/api/melden' && request.method === 'POST') {
        const m = meldungPruefen(await jsonLesen(request));
        if (!m) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        const erg = await raumStub(env, m.raum).melden(m);
        return antwort(erg, erg.ok ? 200 : (erg.grund === 'voll' ? 429 : 404));
      }
      return antwort({ ok: false, grund: 'nicht-gefunden' }, 404);
    } catch (e) {
      return antwort({ ok: false, grund: 'serverfehler' }, 500);
    }
  }
};

/* Ein Raum. Speicher: meta { raum, schluessel, angelegt, laeuftAb } · g:<geraet> { gruppe, um, uebungen: { <uebung>: {…} } } */
export class Raum extends DurableObject {
  async gueltigeMeta() {
    const meta = await this.ctx.storage.get('meta');
    if (!meta || Date.now() >= meta.laeuftAb) return null;
    return meta;
  }
  async anlegen(raum, schluessel, dauerMs) {
    if (await this.gueltigeMeta()) return { ok: false, grund: 'belegt' };
    await this.ctx.storage.deleteAll();
    const jetzt = Date.now();
    const meta = { raum, schluessel, angelegt: jetzt, laeuftAb: jetzt + dauerMs };
    await this.ctx.storage.put('meta', meta);
    await this.ctx.storage.setAlarm(meta.laeuftAb);
    return { ok: true, laeuftAb: meta.laeuftAb };
  }
  async gibtEs() { return !!(await this.gueltigeMeta()); }
  async melden(m) {
    if (!(await this.gueltigeMeta())) return { ok: false, grund: 'unbekannt' };
    const schl = 'g:' + m.geraet;
    let g = await this.ctx.storage.get(schl);
    if (!g) {
      const anzahl = (await this.ctx.storage.list({ prefix: 'g:' })).size;
      if (anzahl >= MAX_GERAETE) return { ok: false, grund: 'voll' };
      g = { gruppe: '', uebungen: {} };
    }
    const jetzt = Date.now();
    g.gruppe = m.gruppe;
    g.um = jetzt;
    g.uebungen[m.uebung] = { punkte: m.punkte, max: m.max, fertig: m.fertig, fehlalarme: m.fehlalarme, uebersehen: m.uebersehen, gewonnen: m.gewonnen, fehler: m.fehler, um: jetzt };
    await this.ctx.storage.put(schl, g);
    return { ok: true };
  }
  async stand(schluessel) {
    const meta = await this.gueltigeMeta();
    if (!meta) return { ok: false, grund: 'unbekannt' };
    if (!gleich(meta.schluessel, schluessel)) return { ok: false, grund: 'schluessel' };
    const geraete = [];
    for (const [k, v] of await this.ctx.storage.list({ prefix: 'g:' })) geraete.push({ geraet: k.slice(2), ...v });
    geraete.sort((a, b) => (a.gruppe || '~').localeCompare(b.gruppe || '~', 'de') || a.geraet.localeCompare(b.geraet));
    return { ok: true, raum: meta.raum, laeuftAb: meta.laeuftAb, jetzt: Date.now(), geraete };
  }
  async alarm() {
    await this.ctx.storage.deleteAll();
  }
}

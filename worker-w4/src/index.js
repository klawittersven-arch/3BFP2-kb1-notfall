/* KB I · Woche 4 (3BFP2) – eigener Cloudflare-Worker für die freiwillige Lehreransicht.
 * Unabhängig vom Worker der Woche 2 (worker/, wrangler.jsonc): eigener Name, eigener Speicher.
 * Ohne Raumcode und ohne Namen: Die Handy-Übungen melden nur, wie weit ein Handy ist.
 *
 *   POST /api/fortschritt { geraet, uebung, schritt, von, fertig }   Stand eines Handys in einer Übung
 *   GET  /api/fortschritt?minuten=45                                   alle Stände der letzten N Minuten (ohne Geräte-ID)
 *
 * Datensparsamkeit: zufällige Geräte-ID (nur zum Zusammenfassen, wird nie ausgegeben), Übung, Schritt x von n, fertig.
 * Keine Namen, keine Punkte, keine Antworten. Einträge werden LOESCHEN_NACH_MINUTEN nach der letzten Meldung gelöscht.
 * Keine Protokolle (observability aus). */
import { DurableObject } from 'cloudflare:workers';

const GERAET_MUSTER = /^[a-z0-9]{10,40}$/;
const UEBUNGEN = ['rueckenmark', 'verlauf', 'trend', 'anatomie', 'atemweg', 'speisesaal'];
const MAX_EINTRAEGE = 600;
const MAX_KOERPER = 500;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};
function antwort(daten, status = 200) {
  return new Response(JSON.stringify(daten), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS } });
}
const ganz = (x, min, max) => (Number.isInteger(x) && x >= min && x <= max ? x : null);
async function jsonLesen(request) {
  const text = await request.text();
  if (text.length > MAX_KOERPER) return null;
  try { return JSON.parse(text); } catch (e) { return null; }
}
function meldungPruefen(d) {
  if (!d || typeof d !== 'object') return null;
  const m = { geraet: String(d.geraet ?? ''), uebung: String(d.uebung ?? ''), schritt: ganz(d.schritt, 0, 50), von: ganz(d.von, 1, 50), fertig: d.fertig === true };
  if (!GERAET_MUSTER.test(m.geraet) || !UEBUNGEN.includes(m.uebung) || m.schritt === null || m.von === null || m.schritt > m.von) return null;
  return m;
}
const speicher = (env) => env.FORTSCHRITT.get(env.FORTSCHRITT.idFromName('w4-fortschritt'));
const loeschenNachMs = (env) => Math.max(15, Math.min(24 * 60, Number(env.LOESCHEN_NACH_MINUTEN) || 60)) * 60000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const weg = url.pathname.replace(/\/+$/, '') || '/';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    try {
      if (weg === '/' && request.method === 'GET') return antwort({ dienst: 'KB1 Woche 4 (3BFP2) – Lehreransicht', ok: true });
      if (weg === '/api/fortschritt' && request.method === 'POST') {
        const m = meldungPruefen(await jsonLesen(request));
        if (!m) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        const erg = await speicher(env).melden(m, loeschenNachMs(env));
        return antwort(erg, erg.ok ? 200 : 429);
      }
      if (weg === '/api/fortschritt' && request.method === 'GET') {
        const minuten = ganz(Number(url.searchParams.get('minuten') || 45), 1, 60);
        if (minuten === null) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        return antwort(await speicher(env).stand(minuten));
      }
      return antwort({ ok: false, grund: 'nicht-gefunden' }, 404);
    } catch (e) {
      return antwort({ ok: false, grund: 'serverfehler' }, 500);
    }
  }
};

/* Ein gemeinsamer Speicher für alle Handys. Schlüssel „<uebung>|<geraet>“ → { schritt, von, fertig, um }.
   „fertig“ bleibt bestehen, bis der Eintrag gelöscht wird: Wer abgeschlossen hat und noch einmal übt, zählt weiter als fertig. */
export class Fortschritt extends DurableObject {
  async melden(m, loeschenNach) {
    const schl = m.uebung + '|' + m.geraet;
    const alt = await this.ctx.storage.get(schl);
    if (!alt) {
      const anzahl = (await this.ctx.storage.list({ limit: MAX_EINTRAEGE + 1 })).size;
      if (anzahl >= MAX_EINTRAEGE) { await this.aufraeumen(loeschenNach); return { ok: false, grund: 'voll' }; }
    }
    const fertig = !!(m.fertig || (alt && alt.fertig));
    await this.ctx.storage.put(schl, { schritt: fertig ? m.von : m.schritt, von: m.von, fertig, um: Date.now(), loeschenNach });
    if (!(await this.ctx.storage.getAlarm())) await this.ctx.storage.setAlarm(Date.now() + 15 * 60000);
    return { ok: true };
  }
  async stand(minuten) {
    const jetzt = Date.now(), ab = jetzt - minuten * 60000;
    const uebungen = {};
    UEBUNGEN.forEach((u) => { uebungen[u] = []; });
    for (const [k, v] of await this.ctx.storage.list()) {
      const u = k.split('|')[0];
      if (!uebungen[u] || v.um < ab) continue;
      uebungen[u].push({ schritt: v.schritt, von: v.von, fertig: v.fertig, vorSek: Math.round((jetzt - v.um) / 1000) });
    }
    UEBUNGEN.forEach((u) => uebungen[u].sort((a, b) => (b.fertig - a.fertig) || (b.schritt / b.von - a.schritt / a.von)));
    return { ok: true, jetzt, minuten, uebungen };
  }
  async aufraeumen(standard) {
    const jetzt = Date.now();
    const weg = [];
    for (const [k, v] of await this.ctx.storage.list()) if (jetzt - v.um > (v.loeschenNach || standard || 3600000)) weg.push(k);
    for (let i = 0; i < weg.length; i += 128) await this.ctx.storage.delete(weg.slice(i, i + 128));
  }
  async alarm() {
    await this.aufraeumen();
    const rest = (await this.ctx.storage.list({ limit: 1 })).size;
    if (rest) await this.ctx.storage.setAlarm(Date.now() + 15 * 60000);
  }
}

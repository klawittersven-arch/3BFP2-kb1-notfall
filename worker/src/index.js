/* KB I · Notfallsituationen (3BFP2) – Cloudflare-Worker für die Beamer-Stunde.
 *
 * Ein Raum = ein Durable Object „Raum“ (vierstelliger Code, 6 Stunden gültig).
 * Der Laptop am Beamer steuert die Folien; die Handys folgen automatisch.
 *
 *   POST /api/raum                         neuen Raum anlegen → { raum, schluessel }
 *   GET  /api/ws?raum=&schluessel=         Live-Verbindung des Beamers
 *   GET  /api/ws?raum=&geraeteId=          Live-Verbindung eines Handys
 *   GET  /api/stand?raum=&schluessel=      Beamer-Stand (Reserve ohne Live-Verbindung)
 *   GET  /api/zustand?raum=&geraeteId=     Handy-Stand (Reserve ohne Live-Verbindung)
 *   POST /api/lehrer   { raum, schluessel, typ, … }   Folie, Uhr, Gruppen einteilen …
 *   POST /api/anmelden { raum, geraeteId, name }
 *   POST /api/aktion   { raum, geraeteId, typ: 'fertig', schritt: 'team'|'stamm', wert }
 *   POST /api/melden   { raum, geraeteId, name, seite, geloest, gesamt, status }   Fortschritt einer Übung
 *   POST /api/stimme   { raum, geraeteId, runde, antworten, sicher }               Abstimmung ohne Namen
 *   GET  /api/nachlesen                    { frei }: gesperrt, solange irgendwo eine Beamer-Stunde läuft
 *
 * Datensparsamkeit: Zufalls-Geräte-ID, Vorname, je Übung „x von y“, Gruppeneinteilung.
 * Nach LEBENSDAUER_MINUTEN löscht ein Alarm den ganzen Raum. Den Stand mit allen Namen
 * bekommt nur, wer den geheimen Schlüssel des Raums hat (der Laptop, der ihn gestartet hat);
 * ein Handy sieht nur die Vornamen der eigenen Stammgruppe und des eigenen Expertenteams.
 */
import { DurableObject } from 'cloudflare:workers';
import * as S from './stunde.js';

const MAX_GERAETE = 80;
const MAX_OHNE_HANDY = 20;
const MAX_SEITEN = 8;
const MAX_KOERPER = 2000;
const STATUS = ['arbeitet', 'fertig', 'durchklicken'];
const RAUM_MUSTER = /^\d{4}$/;
const ID_MUSTER = /^[a-z0-9]{8,40}$/;
const PERSON_MUSTER = /^[a-z0-9]{8,40}$/;
const SEITE_MUSTER = /^[a-z0-9-]{1,30}$/;
const SCHLUESSEL_MUSTER = /^[A-Za-z0-9]{20,64}$/;
const NAME_MUSTER = /^[A-Za-z0-9ÄÖÜäöüßÀ-ÖØ-öø-ÿ _.-]+$/;
const FRAGE_MUSTER = /^E[1-9]$/;
const ANTWORT_MUSTER = /^[A-D]$/;
const ONLINE_ABFRAGE_MS = 12000;      // so lange gilt ein Handy im Abfrage-Modus als verbunden
const PULS_ABSTAND_MS = 60000;        // Beamer meldet sich höchstens einmal pro Minute bei der Zentrale
const PULS_GUELTIG_MS = 10 * 60000;   // ohne Beamer-Puls gilt die Stunde nach 10 Minuten als vorbei

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

function antwort(daten, status = 200) {
  return new Response(JSON.stringify(daten), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS }
  });
}

function fehlerStatus(erg) {
  if (erg.ok) return 200;
  return { unbekannt: 404, schluessel: 403, entfernt: 410, voll: 409, ungueltig: 400 }[erg.grund] || 409;
}

function lebensdauerMs(env) {
  const min = Number(env.LEBENSDAUER_MINUTEN);
  return (Number.isFinite(min) && min > 0 ? min : 360) * 60000;
}

function zufall(laenge, zeichen) {
  const zahlen = new Uint8Array(laenge);
  crypto.getRandomValues(zahlen);
  let aus = '';
  for (let i = 0; i < laenge; i++) aus += zeichen[zahlen[i] % zeichen.length];
  return aus;
}

async function jsonLesen(request) {
  const text = await request.text();
  if (text.length > MAX_KOERPER) return null;
  try { return JSON.parse(text); } catch (e) { return null; }
}

function ganzzahl(w, min, max) {
  const n = Number(w);
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
}

export function namePruefen(n) {
  const name = String(n ?? '').trim().replace(/\s+/g, ' ');
  return name.length >= 2 && name.length <= 20 && NAME_MUSTER.test(name) ? name : null;
}

// Prüft eine Fortschrittsmeldung vom Handy; liefert die bereinigte Meldung oder null.
export function meldungPruefen(d) {
  if (!d || typeof d !== 'object') return null;
  const raum = String(d.raum ?? '');
  const geraeteId = String(d.geraeteId ?? '');
  const name = namePruefen(d.name);
  const seite = String(d.seite ?? '');
  const gesamt = ganzzahl(d.gesamt, 1, 200);
  const geloest = ganzzahl(d.geloest, 0, 200);
  const status = STATUS.includes(d.status) ? d.status : null;
  if (!RAUM_MUSTER.test(raum) || !ID_MUSTER.test(geraeteId) || !SEITE_MUSTER.test(seite) || !name) return null;
  if (gesamt === null || geloest === null || geloest > gesamt || !status) return null;
  return { raum, geraeteId, name, seite, geloest, gesamt, status };
}

// Prüft eine Stimme vom Handy; liefert die bereinigte Stimme oder null.
export function stimmePruefen(d) {
  if (!d || typeof d !== 'object') return null;
  const raum = String(d.raum ?? '');
  const geraeteId = String(d.geraeteId ?? '');
  const runde = ganzzahl(d.runde, 1, 2);
  if (!RAUM_MUSTER.test(raum) || !ID_MUSTER.test(geraeteId) || runde === null) return null;
  if (!d.antworten || typeof d.antworten !== 'object') return null;
  const antworten = {};
  const sicher = {};
  const fragen = Object.keys(d.antworten);
  if (!fragen.length || fragen.length > 9) return null;
  for (const f of fragen) {
    const a = String(d.antworten[f]);
    if (!FRAGE_MUSTER.test(f) || !ANTWORT_MUSTER.test(a)) return null;
    antworten[f] = a;
    sicher[f] = d.sicher && (d.sicher[f] === 1 || d.sicher[f] === true) ? 1 : 0;
  }
  return { raum, geraeteId, runde, antworten, sicher };
}

function gleich(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let u = 0;
  for (let i = 0; i < a.length; i++) u |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return u === 0;
}

function senden(ws, daten) {
  try { ws.send(typeof daten === 'string' ? daten : JSON.stringify(daten)); } catch (e) { /* Verbindung schon zu */ }
}

function anhang(ws) {
  try { return ws.deserializeAttachment() || {}; } catch (e) { return {}; }
}

const raumStub = (env, raum) => env.RAUM.get(env.RAUM.idFromName('raum-' + raum));
const zentraleStub = (env) => env.ZENTRALE.get(env.ZENTRALE.idFromName('zentrale'));

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const weg = url.pathname.replace(/\/+$/, '') || '/';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    try {
      if (weg === '/' && request.method === 'GET') {
        return antwort({ dienst: 'KB1 Notfallsituationen (3BFP2) – Beamer-Stunde', ok: true });
      }

      if (weg === '/api/ws') {
        const raum = url.searchParams.get('raum') || '';
        if (!RAUM_MUSTER.test(raum)) return new Response('ungültig', { status: 400 });
        return raumStub(env, raum).fetch(request);
      }

      if (weg === '/api/nachlesen' && request.method === 'GET') {
        return antwort({ ok: true, ...(await zentraleStub(env).frei()) });
      }

      // Neuen Raum anlegen (freien vierstelligen Code suchen)
      if (weg === '/api/raum' && request.method === 'POST') {
        const schluessel = zufall(32, 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789');
        for (let versuch = 0; versuch < 12; versuch++) {
          const raum = String(1000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 9000));
          const erg = await raumStub(env, raum).anlegen(raum, schluessel, lebensdauerMs(env));
          if (erg.ok) return antwort({ ok: true, raum, schluessel, laeuftAb: erg.laeuftAb });
        }
        return antwort({ ok: false, grund: 'kein-code-frei' }, 503);
      }

      if (weg === '/api/stand' && request.method === 'GET') {
        const raum = url.searchParams.get('raum') || '';
        const schluessel = url.searchParams.get('schluessel') || '';
        if (!RAUM_MUSTER.test(raum) || !SCHLUESSEL_MUSTER.test(schluessel)) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        const erg = await raumStub(env, raum).stand(schluessel);
        return antwort(erg, fehlerStatus(erg));
      }

      if (weg === '/api/zustand' && request.method === 'GET') {
        const raum = url.searchParams.get('raum') || '';
        const geraeteId = url.searchParams.get('geraeteId') || '';
        if (!RAUM_MUSTER.test(raum) || !ID_MUSTER.test(geraeteId)) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        const erg = await raumStub(env, raum).zustand(geraeteId);
        return antwort(erg, fehlerStatus(erg));
      }

      if (request.method === 'POST' && ['/api/lehrer', '/api/anmelden', '/api/aktion', '/api/melden', '/api/stimme'].includes(weg)) {
        const d = await jsonLesen(request);
        if (!d || typeof d !== 'object') return antwort({ ok: false, grund: 'ungueltig' }, 400);
        const raum = String(d.raum ?? '');
        if (!RAUM_MUSTER.test(raum)) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        const stub = raumStub(env, raum);
        let erg;
        if (weg === '/api/lehrer') {
          if (!SCHLUESSEL_MUSTER.test(String(d.schluessel ?? ''))) return antwort({ ok: false, grund: 'ungueltig' }, 400);
          erg = await stub.lehrer(String(d.schluessel), d);
        } else if (weg === '/api/anmelden') {
          const name = namePruefen(d.name);
          const geraeteId = String(d.geraeteId ?? '');
          if (!name || !ID_MUSTER.test(geraeteId)) return antwort({ ok: false, grund: 'ungueltig' }, 400);
          erg = await stub.anmelden(geraeteId, name);
        } else if (weg === '/api/aktion') {
          const geraeteId = String(d.geraeteId ?? '');
          if (!ID_MUSTER.test(geraeteId)) return antwort({ ok: false, grund: 'ungueltig' }, 400);
          erg = await stub.aktion(geraeteId, d);
        } else if (weg === '/api/melden') {
          const m = meldungPruefen(d);
          if (!m) return antwort({ ok: false, grund: 'ungueltig' }, 400);
          erg = await stub.melden(m);
        } else {
          const st = stimmePruefen(d);
          if (!st) return antwort({ ok: false, grund: 'ungueltig' }, 400);
          erg = await stub.stimmen(st);
        }
        return antwort(erg, fehlerStatus(erg));
      }

      return antwort({ ok: false, grund: 'nicht-gefunden' }, 404);
    } catch (e) {
      return antwort({ ok: false, grund: 'serverfehler' }, 500);
    }
  }
};

/* Ein Raum. Schlüssel im Speicher:
 *   meta          { raum, schluessel, angelegt, laeuftAb }
 *   stunde        { folie, schritt, uhr, frage, version }
 *   puzzle        Gruppeneinteilung (siehe stunde.js)
 *   ohne          [{ id, name }]   Personen ohne Handy (von der Lehrkraft eingetragen)
 *   g:<geraeteId> { name, seiten: { <seite>: { geloest, gesamt, status, um } }, um }
 *   x:<geraeteId> true   (von der Lehrkraft entfernt)
 *   s<runde>:<geraeteId> { antworten, sicher }   (Abstimmung, ohne Namen) */
export class Raum extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.env = env;
    this.abfragen = new Map();   // geraeteId → Zeitpunkt der letzten Abfrage (Reserve-Modus)
    this.letzterPuls = 0;
    this.timer = null;
    this.alleOffen = false;
    try { ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong')); } catch (e) { /* ältere Laufzeit */ }
  }

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
    await this.ctx.storage.put('stunde', S.neueStunde());
    await this.ctx.storage.setAlarm(meta.laeuftAb);
    return { ok: true, laeuftAb: meta.laeuftAb };
  }

  // Alles laden, was für die Ansichten gebraucht wird
  async laden() {
    const meta = await this.gueltigeMeta();
    if (!meta) return null;
    const stunde = (await this.ctx.storage.get('stunde')) || S.neueStunde();
    const puzzle = (await this.ctx.storage.get('puzzle')) || null;
    const ohne = (await this.ctx.storage.get('ohne')) || [];
    const geraete = new Map();
    const namen = {};
    for (const [k, v] of await this.ctx.storage.list({ prefix: 'g:' })) {
      geraete.set(k.slice(2), v);
      namen[k.slice(2)] = v.name;
    }
    for (const o of ohne) namen[o.id] = o.name;
    return { meta, stunde, puzzle, ohne, geraete, namen };
  }

  online() {
    const s = new Set();
    for (const ws of this.ctx.getWebSockets('tn')) {
      const a = anhang(ws);
      if (a.id) s.add(a.id);
    }
    const jetzt = Date.now();
    for (const [id, t] of this.abfragen) {
      if (jetzt - t < ONLINE_ABFRAGE_MS) s.add(id); else this.abfragen.delete(id);
    }
    return s;
  }

  handyAnsicht(id, d) {
    const g = d.geraete.get(id);
    const st = d.stunde;
    return {
      ok: true, typ: 'stand', jetzt: Date.now(),
      folie: st.folie, schritt: st.schritt, uhr: st.uhr, frage: st.frage, version: st.version,
      ich: g ? { name: g.name } : null,
      puzzle: S.puzzleFuerHandy(d.puzzle, id, d.namen)
    };
  }

  async beamerAnsicht(d) {
    const online = this.online();
    const geraete = [];
    for (const [id, v] of d.geraete) geraete.push({ geraeteId: id, name: v.name, seiten: v.seiten, um: v.um, online: online.has(id) });
    return {
      ok: true, typ: 'beamer', jetzt: Date.now(), raum: d.meta.raum, laeuftAb: d.meta.laeuftAb,
      stunde: d.stunde, geraete, ohne: d.ohne, online: geraete.filter((g) => g.online).length,
      stimmen: await this.auszaehlen(),
      puzzle: S.puzzleFuerBeamer(d.puzzle, d.namen, online)
    };
  }

  // Änderungen an alle Verbindungen schicken (gebündelt). alle = false: nur an den Beamer.
  planen(alle) {
    this.alleOffen = this.alleOffen || !!alle;
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      const a = this.alleOffen;
      this.alleOffen = false;
      this.verteilen(a).catch(() => {});
    }, alle ? 30 : 400);
  }

  async verteilen(alle) {
    const d = await this.laden();
    if (!d) return;
    const lehrer = this.ctx.getWebSockets('lehrer');
    if (lehrer.length) {
      const text = JSON.stringify(await this.beamerAnsicht(d));
      lehrer.forEach((ws) => senden(ws, text));
    }
    if (!alle) return;
    for (const ws of this.ctx.getWebSockets('tn')) {
      const a = anhang(ws);
      if (a.id) senden(ws, this.handyAnsicht(a.id, d));
    }
  }

  // Beamer lebt: bei der Zentrale melden (sperrt die Nachlese-Seite), am Ende abmelden
  async puls(d, sofort) {
    if (!d || !d.meta.raum || !this.env.ZENTRALE) return;
    const jetzt = Date.now();
    if (!sofort && jetzt - this.letzterPuls < PULS_ABSTAND_MS) return;
    this.letzterPuls = jetzt;
    try {
      const z = zentraleStub(this.env);
      if (d.stunde.folie === S.FOLIE_ENDE) await z.abmelden(d.meta.raum);
      else await z.melden(d.meta.raum, jetzt + PULS_GUELTIG_MS);
    } catch (e) { /* Zentrale nicht erreichbar – nächster Versuch beim nächsten Puls */ }
  }

  /* ---------- Live-Verbindungen ---------- */
  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('WebSocket erwartet', { status: 426 });
    const url = new URL(request.url);
    const d = await this.laden();
    if (!d) return new Response('unbekannt', { status: 404 });
    const schluessel = url.searchParams.get('schluessel');
    const id = url.searchParams.get('geraeteId') || '';
    if (schluessel ? !gleich(d.meta.schluessel, schluessel) : !ID_MUSTER.test(id)) return new Response('ungültig', { status: 403 });
    const paar = new WebSocketPair();
    const [client, server] = Object.values(paar);
    if (schluessel) {
      this.ctx.acceptWebSocket(server, ['lehrer']);
      server.serializeAttachment({ rolle: 'lehrer' });
      senden(server, await this.beamerAnsicht(d));
      await this.puls(d, true);
    } else {
      this.ctx.acceptWebSocket(server, ['tn', 'tn:' + id]);
      server.serializeAttachment({ rolle: 'tn', id });
      senden(server, this.handyAnsicht(id, d));
      this.planen(false);
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, nachricht) {
    let m = null;
    try { m = JSON.parse(typeof nachricht === 'string' ? nachricht : new TextDecoder().decode(nachricht)); } catch (e) { return; }
    if (!m || typeof m !== 'object') return;
    const a = anhang(ws);
    const d = await this.laden();
    if (!d) { try { ws.close(4004, 'unbekannt'); } catch (e) { /* schon zu */ } return; }
    if (a.rolle === 'lehrer' && m.typ === 'puls') await this.puls(d, false);
    if (a.rolle === 'tn' && m.typ === 'hallo') senden(ws, this.handyAnsicht(a.id, d));
  }

  async webSocketClose(ws, code) {
    try { ws.close(code === 1005 ? 1000 : code, 'tschüss'); } catch (e) { /* schon zu */ }
    this.planen(false);
  }

  async webSocketError() {
    this.planen(false);
  }

  /* ---------- Reserve: Abfragen ohne Live-Verbindung ---------- */
  async stand(schluessel) {
    const d = await this.laden();
    if (!d) return { ok: false, grund: 'unbekannt' };
    if (!gleich(d.meta.schluessel, schluessel)) return { ok: false, grund: 'schluessel' };
    await this.puls(d, false);
    return this.beamerAnsicht(d);
  }

  async zustand(id) {
    const d = await this.laden();
    if (!d) return { ok: false, grund: 'unbekannt' };
    if (await this.ctx.storage.get('x:' + id)) return { ok: false, grund: 'entfernt' };
    const neu = !this.online().has(id);
    this.abfragen.set(id, Date.now());
    if (neu) this.planen(false);
    return this.handyAnsicht(id, d);
  }

  /* ---------- Handy ---------- */
  async anmelden(id, name) {
    const d = await this.laden();
    if (!d) return { ok: false, grund: 'unbekannt' };
    if (await this.ctx.storage.get('x:' + id)) return { ok: false, grund: 'entfernt' };
    let g = d.geraete.get(id);
    if (!g) {
      if (d.geraete.size >= MAX_GERAETE) return { ok: false, grund: 'voll' };
      g = { name, seiten: {}, um: Date.now() };
    }
    g.name = name;
    g.um = Date.now();
    await this.ctx.storage.put('g:' + id, g);
    d.geraete.set(id, g);
    d.namen[id] = name;
    let alle = false;
    if (d.puzzle && S.nachzueglerEinteilen(d.puzzle, id)) {
      await this.ctx.storage.put('puzzle', d.puzzle);
      alle = true;
    }
    this.planen(alle);
    return this.handyAnsicht(id, d);
  }

  async aktion(id, m) {
    const d = await this.laden();
    if (!d) return { ok: false, grund: 'unbekannt' };
    if (m.typ !== 'fertig' || !['team', 'stamm'].includes(m.schritt)) return { ok: false, grund: 'ungueltig' };
    const p = d.puzzle;
    if (!p || !p.rolle[id]) return { ok: false, grund: 'ungueltig' };
    const haken = m.schritt === 'team' ? p.fertigTeam : p.fertigStamm;
    if (m.wert === false) delete haken[id]; else haken[id] = Date.now();
    await this.ctx.storage.put('puzzle', p);
    // Alle Expertenteams fertig → automatisch weiter (Merksatz AA1, danach Stammgruppen)
    if (m.schritt === 'team' && d.stunde.folie === S.FOLIE_EXPERTEN && S.alleTeamsFertig(p)) {
      d.stunde.folie = S.FOLIE_NACH_EXPERTEN;
      d.stunde.schritt = 0;
      d.stunde.version++;
      await this.ctx.storage.put('stunde', d.stunde);
    }
    this.planen(true);
    return this.handyAnsicht(id, d);
  }

  async melden(m) {
    const meta = await this.gueltigeMeta();
    if (!meta) return { ok: false, grund: 'unbekannt' };
    if (await this.ctx.storage.get('x:' + m.geraeteId)) return { ok: false, grund: 'entfernt' };
    const schl = 'g:' + m.geraeteId;
    let eintrag = await this.ctx.storage.get(schl);
    if (!eintrag) {
      const anzahl = (await this.ctx.storage.list({ prefix: 'g:' })).size;
      if (anzahl >= MAX_GERAETE) return { ok: false, grund: 'voll' };
      eintrag = { name: m.name, seiten: {} };
    }
    if (!eintrag.seiten[m.seite] && Object.keys(eintrag.seiten).length >= MAX_SEITEN) return { ok: false, grund: 'ungueltig' };
    const jetzt = Date.now();
    eintrag.seiten[m.seite] = { geloest: m.geloest, gesamt: m.gesamt, status: m.status, um: jetzt };
    eintrag.um = jetzt;
    await this.ctx.storage.put(schl, eintrag);
    this.planen(false);
    return { ok: true };
  }

  async stimmen(st) {
    if (!(await this.gueltigeMeta())) return { ok: false, grund: 'unbekannt' };
    const schl = 's' + st.runde + ':' + st.geraeteId;
    if (!(await this.ctx.storage.get(schl))) {
      const anzahl = (await this.ctx.storage.list({ prefix: 's' + st.runde + ':' })).size;
      if (anzahl >= MAX_GERAETE) return { ok: false, grund: 'voll' };
    }
    await this.ctx.storage.put(schl, { antworten: st.antworten, sicher: st.sicher });
    this.planen(false);
    return { ok: true };
  }

  // Zählt die Stimmen je Runde: { 1: { n, fragen: { E1: { A: { sicher, unsicher }, … } } }, 2: … }
  async auszaehlen() {
    const aus = {};
    for (const runde of [1, 2]) {
      const fragen = {};
      const eintraege = await this.ctx.storage.list({ prefix: 's' + runde + ':' });
      for (const [, v] of eintraege) {
        for (const f of Object.keys(v.antworten || {})) {
          const a = v.antworten[f];
          fragen[f] = fragen[f] || {};
          fragen[f][a] = fragen[f][a] || { sicher: 0, unsicher: 0 };
          fragen[f][a][v.sicher && v.sicher[f] ? 'sicher' : 'unsicher']++;
        }
      }
      aus[runde] = { n: eintraege.size, fragen };
    }
    return aus;
  }

  /* ---------- Lehrkraft ---------- */
  async lehrer(schluessel, m) {
    const d = await this.laden();
    if (!d) return { ok: false, grund: 'unbekannt' };
    if (!gleich(d.meta.schluessel, schluessel)) return { ok: false, grund: 'schluessel' };
    const st = d.stunde;
    let puzzleNeu = false;
    let ohneNeu = false;
    let stundeNeu = false;

    switch (m.typ) {
      case 'folie': {
        const folie = String(m.folie ?? '');
        const schritt = ganzzahl(m.schritt ?? 0, 0, 60);
        if (!S.FOLIE_MUSTER.test(folie) || schritt === null) return { ok: false, grund: 'ungueltig' };
        const endeVorher = st.folie === S.FOLIE_ENDE;
        st.folie = folie;
        st.schritt = schritt;
        st.version++;
        stundeNeu = true;
        if (endeVorher !== (folie === S.FOLIE_ENDE)) this.letzterPuls = 0;
        break;
      }
      case 'uhr': {
        const uhr = S.uhrPruefen(m.uhr, Date.now());
        if (uhr === undefined) return { ok: false, grund: 'ungueltig' };
        st.uhr = uhr;
        stundeNeu = true;
        break;
      }
      case 'frage': {
        if (m.nr !== null && !FRAGE_MUSTER.test(String(m.nr))) return { ok: false, grund: 'ungueltig' };
        st.frage = m.nr;
        stundeNeu = true;
        break;
      }
      case 'einteilen': {
        const ids = Array.from(d.geraete.keys()).concat(d.ohne.map((o) => o.id));
        d.puzzle = S.einteilen(ids);
        puzzleNeu = true;
        break;
      }
      case 'verschieben': {
        if (!S.verschieben(d.puzzle, String(m.id ?? ''))) return { ok: false, grund: 'ungueltig' };
        puzzleNeu = true;
        break;
      }
      case 'ohneHandy': {
        const name = namePruefen(m.name);
        if (!name || d.ohne.length >= MAX_OHNE_HANDY) return { ok: false, grund: 'ungueltig' };
        const id = 'oh' + zufall(10, 'abcdefghijkmnpqrstuvwxyz23456789');
        d.ohne.push({ id, name });
        d.namen[id] = name;
        ohneNeu = true;
        if (d.puzzle) puzzleNeu = S.nachzueglerEinteilen(d.puzzle, id);
        break;
      }
      case 'entfernen': {
        const id = String(m.id ?? '');
        if (!PERSON_MUSTER.test(id)) return { ok: false, grund: 'ungueltig' };
        if (S.ohneHandy(id)) {
          d.ohne = d.ohne.filter((o) => o.id !== id);
          ohneNeu = true;
        } else {
          await this.ctx.storage.delete('g:' + id);
          await this.ctx.storage.put('x:' + id, true);
          d.geraete.delete(id);
          for (const ws of this.ctx.getWebSockets('tn:' + id)) { try { ws.close(4010, 'entfernt'); } catch (e) { /* schon zu */ } }
        }
        puzzleNeu = S.entfernenAusPuzzle(d.puzzle, id);
        break;
      }
      case 'abfrage':
        break;
      default:
        return { ok: false, grund: 'ungueltig' };
    }
    if (stundeNeu) await this.ctx.storage.put('stunde', st);
    if (puzzleNeu) await this.ctx.storage.put('puzzle', d.puzzle);
    if (ohneNeu) await this.ctx.storage.put('ohne', d.ohne);
    if (stundeNeu || puzzleNeu || ohneNeu) this.planen(true);
    await this.puls(d, false);
    return this.beamerAnsicht(d);
  }

  async alarm() {
    const meta = await this.ctx.storage.get('meta');
    if (meta && meta.raum && this.env.ZENTRALE) {
      try { await zentraleStub(this.env).abmelden(meta.raum); } catch (e) { /* egal */ }
    }
    for (const ws of this.ctx.getWebSockets()) { try { ws.close(4004, 'abgelaufen'); } catch (e) { /* schon zu */ } }
    await this.ctx.storage.deleteAll();
  }
}

/* Zentrale: merkt sich, in welchen Räumen gerade eine Beamer-Stunde läuft (nur Raumcode und Ablaufzeit).
 * Solange das irgendwo der Fall ist, bleibt die Nachlese-Seite gesperrt. */
export class Zentrale extends DurableObject {
  async melden(raum, bis) {
    await this.ctx.storage.put('r:' + raum, bis);
  }

  async abmelden(raum) {
    await this.ctx.storage.delete('r:' + raum);
  }

  async frei() {
    const jetzt = Date.now();
    let frei = true;
    let bis = 0;
    const alt = [];
    for (const [k, b] of await this.ctx.storage.list({ prefix: 'r:' })) {
      if (b > jetzt) { frei = false; bis = Math.max(bis, b); } else alt.push(k);
    }
    if (alt.length) await this.ctx.storage.delete(alt);
    return { frei };
  }
}

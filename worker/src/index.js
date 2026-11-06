/* Fortschrittsanzeige am Beamer – Cloudflare-Worker mit einem Durable Object je Raum.
 *
 * Ablauf
 *   1. Die Lehrkraft startet auf fortschritt.html einen Raum:  POST /api/raum
 *      → { raum: '4821', schluessel: '…' }   (der Schlüssel bleibt im Browser der Lehrkraft)
 *   2. Die Handys melden ihren Stand:                          POST /api/melden
 *      { raum, geraeteId, name, seite, geloest, gesamt, status }
 *   3. Die Beamer-Seite fragt alle paar Sekunden ab:           GET  /api/stand?raum=…&schluessel=…
 *   4. Moderation (nur mit Schlüssel):                         POST /api/entfernen, POST /api/leeren
 *   5. Abstimmung „Wie hätten Sie gehandelt?“ (ohne Namen):    POST /api/stimme
 *      { raum, geraeteId, runde: 1|2, antworten: { E1: 'B', … }, sicher: { E1: 1, … } }
 *      /api/stand liefert dazu nur die ausgezählten Stimmen (keine Geräte-IDs).
 *
 * Datensparsamkeit: gespeichert werden nur Zufalls-Geräte-ID, Vorname und je Übung
 * „x von y gelöst“ + Status. Nach LEBENSDAUER_MINUTEN (Standard 6 Stunden) löscht
 * ein Alarm den ganzen Raum. Lesen kann nur, wer den Schlüssel des Raums hat.
 */
import { DurableObject } from 'cloudflare:workers';

const MAX_GERAETE = 80;      // Einträge je Raum
const MAX_SEITEN = 6;        // Übungen je Gerät
const MAX_KOERPER = 2000;    // Bytes je Anfrage
const STATUS = ['arbeitet', 'fertig', 'durchklicken'];
const RAUM_MUSTER = /^\d{4}$/;
const ID_MUSTER = /^[a-z0-9]{8,40}$/;
const SEITE_MUSTER = /^[a-z0-9-]{1,30}$/;
const SCHLUESSEL_MUSTER = /^[A-Za-z0-9]{20,64}$/;
const NAME_MUSTER = /^[A-Za-z0-9ÄÖÜäöüßÀ-ÖØ-öø-ÿ _-]+$/;
const FRAGE_MUSTER = /^E[1-9]$/;
const ANTWORT_MUSTER = /^[A-D]$/;

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

// Prüft eine Meldung vom Handy; liefert die bereinigte Meldung oder null.
export function meldungPruefen(d) {
  if (!d || typeof d !== 'object') return null;
  const raum = String(d.raum ?? '');
  const geraeteId = String(d.geraeteId ?? '');
  const name = String(d.name ?? '').trim().replace(/\s+/g, ' ');
  const seite = String(d.seite ?? '');
  const gesamt = ganzzahl(d.gesamt, 1, 200);
  const geloest = ganzzahl(d.geloest, 0, 200);
  const status = STATUS.includes(d.status) ? d.status : null;
  if (!RAUM_MUSTER.test(raum) || !ID_MUSTER.test(geraeteId) || !SEITE_MUSTER.test(seite)) return null;
  if (name.length < 2 || name.length > 20 || !NAME_MUSTER.test(name)) return null;
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

const raumStub = (env, raum) => env.RAUM.get(env.RAUM.idFromName('raum-' + raum));

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const weg = url.pathname.replace(/\/+$/, '') || '/';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    try {
      if (weg === '/' && request.method === 'GET') {
        return antwort({ dienst: 'KB1 Notfallsituationen (3BFP2) – Fortschritt und Abstimmung', ok: true });
      }

      // Neuen Raum anlegen (freien vierstelligen Code suchen)
      if (weg === '/api/raum' && request.method === 'POST') {
        const schluessel = zufall(32, 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789');
        for (let versuch = 0; versuch < 12; versuch++) {
          const raum = String(1000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 9000));
          const erg = await raumStub(env, raum).anlegen(schluessel, lebensdauerMs(env));
          if (erg.ok) return antwort({ ok: true, raum, schluessel, laeuftAb: erg.laeuftAb });
        }
        return antwort({ ok: false, grund: 'kein-code-frei' }, 503);
      }

      if (weg === '/api/melden' && request.method === 'POST') {
        const m = meldungPruefen(await jsonLesen(request));
        if (!m) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        const erg = await raumStub(env, m.raum).melden(m);
        return antwort(erg, erg.ok ? 200 : (erg.grund === 'unbekannt' ? 404 : erg.grund === 'entfernt' ? 410 : 409));
      }

      if (weg === '/api/stimme' && request.method === 'POST') {
        const st = stimmePruefen(await jsonLesen(request));
        if (!st) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        const erg = await raumStub(env, st.raum).stimmen(st);
        return antwort(erg, erg.ok ? 200 : (erg.grund === 'unbekannt' ? 404 : 409));
      }

      if (weg === '/api/stand' && request.method === 'GET') {
        const raum = url.searchParams.get('raum') || '';
        const schluessel = url.searchParams.get('schluessel') || '';
        if (!RAUM_MUSTER.test(raum) || !SCHLUESSEL_MUSTER.test(schluessel)) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        const erg = await raumStub(env, raum).stand(schluessel);
        return antwort(erg, erg.ok ? 200 : (erg.grund === 'unbekannt' ? 404 : 403));
      }

      if ((weg === '/api/entfernen' || weg === '/api/leeren') && request.method === 'POST') {
        const d = await jsonLesen(request);
        const raum = String(d?.raum ?? '');
        const schluessel = String(d?.schluessel ?? '');
        if (!RAUM_MUSTER.test(raum) || !SCHLUESSEL_MUSTER.test(schluessel)) return antwort({ ok: false, grund: 'ungueltig' }, 400);
        const stub = raumStub(env, raum);
        let erg;
        if (weg === '/api/leeren') {
          erg = await stub.leeren(schluessel);
        } else {
          const geraeteId = String(d?.geraeteId ?? '');
          if (!ID_MUSTER.test(geraeteId)) return antwort({ ok: false, grund: 'ungueltig' }, 400);
          erg = await stub.entfernen(schluessel, geraeteId);
        }
        return antwort(erg, erg.ok ? 200 : (erg.grund === 'unbekannt' ? 404 : 403));
      }

      return antwort({ ok: false, grund: 'nicht-gefunden' }, 404);
    } catch (e) {
      return antwort({ ok: false, grund: 'serverfehler' }, 500);
    }
  }
};

/* Ein Raum = ein Durable Object. Schlüssel im Speicher:
 *   meta          { schluessel, angelegt, laeuftAb }
 *   g:<geraeteId> { name, seiten: { <seite>: { geloest, gesamt, status, um } }, um }
 *   x:<geraeteId> true   (von der Lehrkraft entfernt – weitere Meldungen werden abgelehnt)
 *   s<runde>:<geraeteId> { antworten, sicher }   (Abstimmung, ohne Namen) */
export class Raum extends DurableObject {
  async gueltigeMeta() {
    const meta = await this.ctx.storage.get('meta');
    if (!meta || Date.now() >= meta.laeuftAb) return null;
    return meta;
  }

  async anlegen(schluessel, dauerMs) {
    if (await this.gueltigeMeta()) return { ok: false, grund: 'belegt' };
    await this.ctx.storage.deleteAll();
    const jetzt = Date.now();
    const meta = { schluessel, angelegt: jetzt, laeuftAb: jetzt + dauerMs };
    await this.ctx.storage.put('meta', meta);
    await this.ctx.storage.setAlarm(meta.laeuftAb);
    return { ok: true, laeuftAb: meta.laeuftAb };
  }

  async melden(m) {
    if (!(await this.gueltigeMeta())) return { ok: false, grund: 'unbekannt' };
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
    eintrag.name = m.name;
    eintrag.seiten[m.seite] = { geloest: m.geloest, gesamt: m.gesamt, status: m.status, um: jetzt };
    eintrag.um = jetzt;
    await this.ctx.storage.put(schl, eintrag);
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

  async pruefen(schluessel) {
    const meta = await this.gueltigeMeta();
    if (!meta) return { fehler: { ok: false, grund: 'unbekannt' } };
    if (!gleich(meta.schluessel, schluessel)) return { fehler: { ok: false, grund: 'schluessel' } };
    return { meta };
  }

  async stand(schluessel) {
    const { meta, fehler } = await this.pruefen(schluessel);
    if (fehler) return fehler;
    const eintraege = await this.ctx.storage.list({ prefix: 'g:' });
    const geraete = [];
    for (const [k, v] of eintraege) geraete.push({ geraeteId: k.slice(2), name: v.name, seiten: v.seiten, um: v.um });
    return { ok: true, jetzt: Date.now(), laeuftAb: meta.laeuftAb, geraete, stimmen: await this.auszaehlen() };
  }

  async entfernen(schluessel, geraeteId) {
    const { fehler } = await this.pruefen(schluessel);
    if (fehler) return fehler;
    await this.ctx.storage.delete('g:' + geraeteId);
    await this.ctx.storage.put('x:' + geraeteId, true);
    return { ok: true };
  }

  async leeren(schluessel) {
    const { fehler } = await this.pruefen(schluessel);
    if (fehler) return fehler;
    const schluesselListe = [];
    for (const praefix of ['g:', 'x:']) {
      for (const k of (await this.ctx.storage.list({ prefix: praefix })).keys()) schluesselListe.push(k);
    }
    for (let i = 0; i < schluesselListe.length; i += 100) await this.ctx.storage.delete(schluesselListe.slice(i, i + 100));
    return { ok: true };
  }

  async alarm() {
    await this.ctx.storage.deleteAll();
  }
}

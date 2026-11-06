/* Logik der Beamer-Stunde ohne Cloudflare-Bezug (lässt sich einzeln testen).
 *
 * Gruppenpuzzle
 *   - Stammgruppen zu 3 (A, B, C); geht es nicht auf, Vierergruppen mit doppeltem B.
 *   - Expertenteams: alle mit demselben Buchstaben, je etwa 3 Personen (Rest → 4er-Teams).
 *     Zwei B-Expertinnen aus derselben Stammgruppe landen in verschiedenen Teams.
 *   - Wer später kommt, füllt zuerst eine Lücke (fehlender Buchstabe), sonst die kleinste Gruppe.
 *   - Personen ohne Handy (von der Lehrkraft eingetragen) haben IDs, die mit „oh“ beginnen;
 *     sie können nichts abhaken und zählen deshalb beim „fertig“ nicht mit.
 *
 * Zustand (im Durable Object gespeichert)
 *   stunde = { folie, schritt, uhr, frage, version }
 *   puzzle = { eingeteilt, gruppen: [{ nr, mitglieder: [id] }], teams: [{ id, b, mitglieder }],
 *              rolle: { id: 'A'|'B'|'C' }, fertigTeam: { id: ms }, fertigStamm: { id: ms } }
 */

export const ROLLEN = ['A', 'B', 'C'];
export const MAX_GRUPPEN = 10;
export const FOLIE_MUSTER = /^[a-z0-9-]{1,24}$/;
// Folien, an denen der Server selbst etwas tut (müssen zu docs/inhalte_stunde.js passen)
export const FOLIE_EXPERTEN = 'aa1';
export const FOLIE_NACH_EXPERTEN = 'aa1-merksatz';   // sind alle Expertenteams fertig, geht es hierhin
export const FOLIE_ENDE = 'ende';

export function neueStunde() {
  return { folie: 'start', schritt: 0, uhr: null, frage: null, version: 0 };
}

export function ohneHandy(id) {
  return typeof id === 'string' && id.indexOf('oh') === 0;
}

export function mischen(liste, zufall) {
  const a = liste.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

export function zufallKrypto() {
  return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
}

// Rollen einer Stammgruppe nach Größe: 3 → A B C, 4 → A B B C, 5 → A A B B C
export function rollenFuer(groesse) {
  if (groesse <= 1) return ['B'];
  if (groesse === 2) return ['A', 'B'];
  const r = ['A', 'B', 'C'];
  const extra = ['B', 'A', 'C'];
  for (let i = 3; i < groesse; i++) r.push(extra[(i - 3) % 3]);
  return r.sort();
}

export function teamsBilden(gruppen, rolle) {
  const teams = [];
  for (const b of ROLLEN) {
    const liste = [];
    gruppen.forEach((g) => g.mitglieder.forEach((id) => { if (rolle[id] === b) liste.push(id); }));
    if (!liste.length) continue;
    const anzahl = Math.max(1, Math.floor(liste.length / 3));
    const neu = [];
    for (let i = 0; i < anzahl; i++) neu.push({ id: b + (i + 1), b, mitglieder: [] });
    liste.forEach((id, i) => neu[i % anzahl].mitglieder.push(id));
    teams.push(...neu);
  }
  return teams;
}

export function einteilen(ids, zufall = zufallKrypto, jetzt = Date.now()) {
  const p = mischen(ids, zufall);
  const n = p.length;
  const puzzle = { eingeteilt: jetzt, gruppen: [], teams: [], rolle: {}, fertigTeam: {}, fertigStamm: {} };
  if (!n) return puzzle;
  const anzahl = Math.min(MAX_GRUPPEN, Math.max(1, Math.floor(n / 3)));
  const groessen = new Array(anzahl).fill(Math.floor(n / anzahl));
  for (let i = 0; i < n % anzahl; i++) groessen[i]++;
  let k = 0;
  groessen.forEach((g, nr) => {
    const mitglieder = p.slice(k, k + g);
    k += g;
    const rollen = rollenFuer(g);
    mitglieder.forEach((id, i) => { puzzle.rolle[id] = rollen[i]; });
    puzzle.gruppen.push({ nr, mitglieder });
  });
  puzzle.teams = teamsBilden(puzzle.gruppen, puzzle.rolle);
  return puzzle;
}

function nachGroesse(a, b) { return a.mitglieder.length - b.mitglieder.length || a.nr - b.nr; }

function teamZuordnen(puzzle, id) {
  const b = puzzle.rolle[id];
  const passend = puzzle.teams.filter((t) => t.b === b).sort((x, y) => x.mitglieder.length - y.mitglieder.length);
  if (passend.length) { passend[0].mitglieder.push(id); return; }
  puzzle.teams.push({ id: b + '1', b, mitglieder: [id] });
  puzzle.teams.sort((x, y) => (x.id < y.id ? -1 : 1));
}

// Nachzügler: füllt zuerst eine Gruppe, der ein Buchstabe fehlt, sonst die kleinste (dann als B)
export function nachzueglerEinteilen(puzzle, id) {
  if (!puzzle || puzzle.rolle[id]) return false;
  if (!puzzle.gruppen.length) puzzle.gruppen.push({ nr: 0, mitglieder: [] });
  let ziel = null;
  let rolle = null;
  for (const b of ['C', 'A', 'B']) {
    const luecken = puzzle.gruppen.filter((g) => !g.mitglieder.some((m) => puzzle.rolle[m] === b)).sort(nachGroesse);
    if (luecken.length) { ziel = luecken[0]; rolle = b; break; }
  }
  if (!ziel) {
    ziel = puzzle.gruppen.slice().sort(nachGroesse)[0];
    rolle = 'B';
  }
  ziel.mitglieder.push(id);
  puzzle.rolle[id] = rolle;
  teamZuordnen(puzzle, id);
  return true;
}

export function entfernenAusPuzzle(puzzle, id) {
  if (!puzzle || !puzzle.rolle[id]) return false;
  puzzle.gruppen.forEach((g) => { g.mitglieder = g.mitglieder.filter((m) => m !== id); });
  puzzle.teams.forEach((t) => { t.mitglieder = t.mitglieder.filter((m) => m !== id); });
  puzzle.teams = puzzle.teams.filter((t) => t.mitglieder.length);
  delete puzzle.rolle[id];
  delete puzzle.fertigTeam[id];
  delete puzzle.fertigStamm[id];
  return true;
}

// Person in die nächste Stammgruppe schieben (Buchstabe und Expertenteam bleiben)
export function verschieben(puzzle, id) {
  if (!puzzle || !puzzle.rolle[id] || puzzle.gruppen.length < 2) return false;
  const von = puzzle.gruppen.findIndex((g) => g.mitglieder.includes(id));
  if (von < 0) return false;
  puzzle.gruppen[von].mitglieder = puzzle.gruppen[von].mitglieder.filter((m) => m !== id);
  puzzle.gruppen[(von + 1) % puzzle.gruppen.length].mitglieder.push(id);
  delete puzzle.fertigStamm[id];
  return true;
}

// Fertig = alle Mitglieder mit Handy haben abgehakt (eine Gruppe nur aus Personen ohne Handy gilt als fertig)
function alleFertig(mitglieder, haken) {
  return mitglieder.filter((m) => !ohneHandy(m)).every((m) => !!haken[m]);
}

export function teamFertig(puzzle, team) { return alleFertig(team.mitglieder, puzzle.fertigTeam); }
export function gruppeFertig(puzzle, gruppe) { return alleFertig(gruppe.mitglieder, puzzle.fertigStamm); }
export function alleTeamsFertig(puzzle) {
  return !!puzzle && puzzle.teams.length > 0 && puzzle.teams.every((t) => teamFertig(puzzle, t));
}

/* ---------- Ansichten ---------- */

// Für das Handy: nur die eigene Gruppe und das eigene Team, mit Vornamen
export function puzzleFuerHandy(puzzle, id, namen) {
  if (!puzzle || !puzzle.rolle[id]) return null;
  const gruppe = puzzle.gruppen.find((g) => g.mitglieder.includes(id));
  const team = puzzle.teams.find((t) => t.mitglieder.includes(id));
  const person = (m, haken) => ({ name: namen[m] || '?', rolle: puzzle.rolle[m], ich: m === id, fertig: !!haken[m], ohneHandy: ohneHandy(m) });
  return {
    rolle: puzzle.rolle[id],
    gruppe: gruppe ? { nr: gruppe.nr, mitglieder: gruppe.mitglieder.map((m) => person(m, puzzle.fertigStamm)), fertig: gruppeFertig(puzzle, gruppe) } : null,
    team: team ? { id: team.id, mitglieder: team.mitglieder.map((m) => person(m, puzzle.fertigTeam)), fertig: teamFertig(puzzle, team) } : null,
    ichTeamFertig: !!puzzle.fertigTeam[id],
    ichStammFertig: !!puzzle.fertigStamm[id],
    teamsFertig: puzzle.teams.filter((t) => teamFertig(puzzle, t)).length,
    teamsGesamt: puzzle.teams.length,
    alleTeamsFertig: alleTeamsFertig(puzzle)
  };
}

// Für den Beamer: alles mit Namen
export function puzzleFuerBeamer(puzzle, namen, online) {
  if (!puzzle) return null;
  const person = (m, haken) => ({ id: m, name: namen[m] || '?', rolle: puzzle.rolle[m], fertig: !!haken[m], ohneHandy: ohneHandy(m), online: ohneHandy(m) || online.has(m) });
  return {
    eingeteilt: puzzle.eingeteilt,
    gruppen: puzzle.gruppen.map((g) => ({ nr: g.nr, mitglieder: g.mitglieder.map((m) => person(m, puzzle.fertigStamm)), fertig: gruppeFertig(puzzle, g) })),
    teams: puzzle.teams.map((t) => ({ id: t.id, b: t.b, mitglieder: t.mitglieder.map((m) => person(m, puzzle.fertigTeam)), fertig: teamFertig(puzzle, t) })),
    alleTeamsFertig: alleTeamsFertig(puzzle)
  };
}

/* ---------- Eingaben der Lehrkraft prüfen ---------- */

export function uhrPruefen(u, jetzt) {
  if (u === null) return null;
  if (!u || typeof u !== 'object' || !Array.isArray(u.segmente) || !FOLIE_MUSTER.test(String(u.folie || ''))) return undefined;
  if (!u.segmente.length || u.segmente.length > 6) return undefined;
  const segmente = [];
  for (const s of u.segmente) {
    const sek = Number(s && s.sek);
    const label = String((s && s.label) || '').slice(0, 40);
    if (!Number.isInteger(sek) || sek < 5 || sek > 3600) return undefined;
    segmente.push({ label, sek });
  }
  return { folie: u.folie, start: jetzt, segmente };
}

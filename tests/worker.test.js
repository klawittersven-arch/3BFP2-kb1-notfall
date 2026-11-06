/* Worker der Beamer-Stunde – Schnittstellen-Test ohne Browser (lokaler wrangler dev).
 * Prüft Raum, Anmeldung, Live-Verbindung, Folienwechsel, Gruppeneinteilung, Fertig-Meldungen,
 * automatischen Wechsel in die Stammgruppen und die Sperre der Nachlese-Seite.
 * Start (im Ordner tests/): node worker.test.js */
'use strict';
const H = require('./hilfen');

const warte = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const worker = await H.workerStarten(8793);
  const U = worker.url;
  const post = (weg, d) => fetch(U + weg, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
    .then(async (r) => ({ status: r.status, d: await r.json() }));
  const get = (weg) => fetch(U + weg).then(async (r) => ({ status: r.status, d: await r.json() }));
  let ok = false;
  try {
    console.log('\n== Raum und Nachlese-Sperre');
    let n = await get('/api/nachlesen');
    H.pruefe(n.d.frei === true, 'ohne laufende Stunde: Nachlesen frei');
    const { d: raum } = await post('/api/raum', {});
    H.pruefe(/^\d{4}$/.test(raum.raum), 'Raum angelegt: ' + raum.raum);
    const L = (typ, x = {}) => post('/api/lehrer', { raum: raum.raum, schluessel: raum.schluessel, typ, ...x });

    // Beamer live verbinden
    const beamerNachrichten = [];
    const ws = new WebSocket(U.replace('http', 'ws') + `/api/ws?raum=${raum.raum}&schluessel=${raum.schluessel}`);
    ws.onmessage = (e) => beamerNachrichten.push(JSON.parse(e.data));
    await new Promise((r) => { ws.onopen = r; });
    await warte(300);
    H.pruefe(beamerNachrichten.length >= 1 && beamerNachrichten[0].typ === 'beamer', 'Beamer: Live-Verbindung liefert den Stand');
    n = await get('/api/nachlesen');
    H.pruefe(n.d.frei === false, 'Beamer-Stunde läuft: Nachlesen gesperrt');

    console.log('\n== Handys anmelden');
    const ids = [];
    const handyWs = [];
    for (let i = 0; i < 7; i++) {
      const id = 'geraet' + String(i).padStart(4, '0') + 'x';
      ids.push(id);
      const a = await post('/api/anmelden', { raum: raum.raum, geraeteId: id, name: 'Person ' + (i + 1) });
      if (i === 0) H.pruefe(a.status === 200 && a.d.ich && a.d.ich.name === 'Person 1' && a.d.folie === 'start', 'Anmeldung liefert Handy-Stand');
      const h = { nachrichten: [] };
      h.ws = new WebSocket(U.replace('http', 'ws') + `/api/ws?raum=${raum.raum}&geraeteId=${id}`);
      h.ws.onmessage = (e) => h.nachrichten.push(JSON.parse(e.data));
      handyWs.push(h);
    }
    await warte(800);
    const letzte = (h) => h.nachrichten[h.nachrichten.length - 1];
    H.pruefe(handyWs.every((h) => letzte(h) && letzte(h).typ === 'stand'), 'alle Handys live verbunden');
    let b = beamerNachrichten[beamerNachrichten.length - 1];
    H.pruefe(b.geraete.length === 7 && b.online === 7, 'Beamer sieht 7 Handys online', { n: b.geraete.length, online: b.online });
    const falsch = await post('/api/anmelden', { raum: raum.raum, geraeteId: 'abcdefgh1', name: '<b>' });
    H.pruefe(falsch.status === 400, 'ungültiger Name wird abgelehnt');
    const fremd = await post('/api/lehrer', { raum: raum.raum, schluessel: 'X'.repeat(32), typ: 'folie', folie: 'fall' });
    H.pruefe(fremd.status === 403, 'Folienwechsel ohne Schlüssel wird abgelehnt');

    console.log('\n== Folienwechsel');
    await L('folie', { folie: 'fall', schritt: 0 });
    await warte(400);
    H.pruefe(handyWs.every((h) => letzte(h).folie === 'fall'), 'alle Handys folgen der Folie „fall“');
    await L('uhr', { uhr: { folie: 'murmeln', segmente: [{ label: 'Murmeln', sek: 60 }] } });
    await warte(300);
    H.pruefe(letzte(handyWs[0]).uhr && letzte(handyWs[0]).uhr.segmente[0].sek === 60, 'Uhr kommt auf dem Handy an');
    const schlechteUhr = await L('uhr', { uhr: { folie: 'x', segmente: [{ label: 'x', sek: 99999 }] } });
    H.pruefe(schlechteUhr.status === 400, 'unsinnige Uhr wird abgelehnt');

    console.log('\n== Gruppenpuzzle');
    await L('ohneHandy', { name: 'Ohne Handy' });
    const e = await L('einteilen');
    const p = e.d.puzzle;
    const groessen = p.gruppen.map((g) => g.mitglieder.length).sort().join();
    H.pruefe(p.gruppen.length === 2 && groessen === '4,4', '8 Personen → 2 Stammgruppen à 4', groessen);
    const rollenOk = p.gruppen.every((g) => g.mitglieder.map((m) => m.rolle).sort().join('') === 'ABBC');
    H.pruefe(rollenOk, 'Vierergruppen: A, B, B, C');
    H.pruefe(p.teams.map((t) => t.id).join() === 'A1,B1,C1', 'Expertenteams A1, B1, C1', p.teams.map((t) => t.id));
    await warte(300);
    const h0 = letzte(handyWs[0]);
    H.pruefe(h0.puzzle && h0.puzzle.gruppe.mitglieder.length === 4 && h0.puzzle.gruppe.mitglieder.some((m) => m.ich), 'Handy kennt seine Stammgruppe (mit sich selbst)');
    H.pruefe(h0.puzzle.team && h0.puzzle.team.mitglieder.every((m) => m.rolle === h0.puzzle.rolle), 'Handy kennt sein Expertenteam (gleicher Buchstabe)');
    H.pruefe(!JSON.stringify(h0).includes('geraet'), 'Handy sieht keine fremden Geräte-IDs');

    console.log('\n== Nachzügler');
    const spaet = 'spaetkommerx1';
    const ns = await post('/api/anmelden', { raum: raum.raum, geraeteId: spaet, name: 'Spät' });
    H.pruefe(ns.d.puzzle && ns.d.puzzle.gruppe && ns.d.puzzle.team, 'Nachzügler wird automatisch eingeteilt', ns.d.puzzle);

    console.log('\n== Expertenteams fertig → automatisch Stammgruppen');
    await L('folie', { folie: 'aa1', schritt: 0 });
    const alle = ids.concat([spaet]);
    for (let i = 0; i < alle.length; i++) {
      const r = await post('/api/aktion', { raum: raum.raum, geraeteId: alle[i], typ: 'fertig', schritt: 'team' });
      if (i === 0) H.pruefe(r.d.puzzle.ichTeamFertig === true, 'Fertig-Meldung kommt an');
    }
    await warte(400);
    b = beamerNachrichten[beamerNachrichten.length - 1];
    H.pruefe(b.puzzle.alleTeamsFertig && b.stunde.folie === 'aa2a', 'alle Teams fertig (ohne die Person ohne Handy) → Folie „aa2a“', b.stunde.folie);
    H.pruefe(letzte(handyWs[3]).folie === 'aa2a', 'Handys wechseln mit in die Stammgruppen');
    for (const id of alle) await post('/api/aktion', { raum: raum.raum, geraeteId: id, typ: 'fertig', schritt: 'stamm' });
    await warte(400);
    b = beamerNachrichten[beamerNachrichten.length - 1];
    H.pruefe(b.puzzle.gruppen.every((g) => g.fertig), 'Beamer: alle Stammgruppen fertig');

    console.log('\n== Verschieben, Entfernen');
    const vorher = b.puzzle.gruppen[0].mitglieder.length;
    const v = await L('verschieben', { id: b.puzzle.gruppen[0].mitglieder[0].id });
    H.pruefe(v.d.puzzle.gruppen[0].mitglieder.length === vorher - 1, 'Name anklicken schiebt in die nächste Gruppe');
    const ent = await L('entfernen', { id: ids[6] });
    H.pruefe(!ent.d.geraete.some((g) => g.geraeteId === ids[6]) && !JSON.stringify(ent.d.puzzle).includes(ids[6]), 'Entfernen nimmt das Handy auch aus den Gruppen');
    const wieder = await post('/api/anmelden', { raum: raum.raum, geraeteId: ids[6], name: 'Person 7' });
    H.pruefe(wieder.status === 410, 'entferntes Handy kann sich mit derselben ID nicht wieder anmelden');

    console.log('\n== Reserve ohne Live-Verbindung');
    const z = await get(`/api/zustand?raum=${raum.raum}&geraeteId=${ids[1]}`);
    H.pruefe(z.status === 200 && z.d.folie === 'aa2a' && z.d.puzzle, 'Abfrage liefert denselben Handy-Stand');
    const s = await get(`/api/stand?raum=${raum.raum}&schluessel=${raum.schluessel}`);
    H.pruefe(s.status === 200 && s.d.typ === 'beamer', 'Abfrage liefert den Beamer-Stand');

    console.log('\n== Stundenende gibt Nachlesen frei');
    await L('folie', { folie: 'ende', schritt: 0 });
    n = await get('/api/nachlesen');
    H.pruefe(n.d.frei === true, 'letzte Folie erreicht → Nachlesen frei');
    await L('folie', { folie: 'checkout', schritt: 0 });
    n = await get('/api/nachlesen');
    H.pruefe(n.d.frei === false, 'zurück in die Stunde → wieder gesperrt');

    ws.close();
    handyWs.forEach((h) => h.ws.close());
    ok = H.ergebnis();
  } finally {
    worker.beenden();
  }
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });

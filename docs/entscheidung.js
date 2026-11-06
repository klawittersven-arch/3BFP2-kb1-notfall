/* Einstieg & Check-out · „Ihre Entscheidung, bitte!“ (Programmlogik – Texte in inhalte.js → entscheidung).
   Runde 1 (Stundenbeginn): abstimmen, keine Auflösung. Runde 2 (Stundenende): abstimmen, dann Auflösung
   mit den eigenen Antworten aus beiden Runden. Mit Raumcode-Anmeldung gehen die Stimmen OHNE Namen an
   den Beamer (POST /api/stimme): nur Geräte-ID (Zufall), Runde, Antwortbuchstaben und „sicher/unsicher“. */
(function () {
  'use strict';
  var K = window.KB1;
  var el = K.element;
  var T = K.seiteVorbereiten('entscheidung');
  var C = window.CONFIG || {};
  var BASIS = String(C.FORTSCHRITT_URL || '').replace(/\/+$/, '');
  var SCHL = 'kb1nf_entscheidung';
  var platz = document.getElementById('uebung');
  var GUELTIG_MS = (Number(C.RAUMCODE_GUELTIG_STUNDEN) || 3) * 3600000;

  var z = K.Speicher.dauer.lesen(SCHL);
  if (!z || typeof z !== 'object' || !z.runden) z = { runde: null, runden: { 1: null, 2: null }, entwurf: {}, gesendet: { 1: false, 2: false } };
  function speichern() { K.Speicher.dauer.schreiben(SCHL, z); }

  function anmeldung() {
    var a = K.Speicher.dauer.lesen('kb1nf_anmeldung');
    if (!a || typeof a !== 'object' || typeof a.um !== 'number' || Date.now() - a.um > GUELTIG_MS) return null;
    if (!/^\d{4}$/.test(a.raum) || !/^[a-z0-9]{8,40}$/.test(String(a.geraeteId || ''))) return null;
    return a;
  }

  /* ---------- Senden (mit Wiederholung) ---------- */
  var versuche = 0, timer = null;
  function senden(runde, statusEl) {
    var a = anmeldung();
    var d = z.runden[runde];
    if (!BASIS || !a || !d) return;
    var koerper = { raum: a.raum, geraeteId: a.geraeteId, runde: runde, antworten: d.antworten, sicher: d.sicher };
    fetch(BASIS + '/api/stimme', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(koerper), mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer' })
      .then(function (r) {
        if (r.status === 200) { z.gesendet[runde] = true; speichern(); if (statusEl) statusEl.textContent = T.gesendet; return; }
        if (r.status >= 500) throw new Error('server');
        if (statusEl) statusEl.textContent = T.ohneRaum; // Raum unbekannt o. Ä.
      })
      .catch(function () {
        if (statusEl) statusEl.textContent = T.nichtGesendet;
        if (versuche++ < 6) { clearTimeout(timer); timer = setTimeout(function () { senden(runde, statusEl); }, 5000 * versuche); }
      });
  }

  /* ---------- Ohne Runde in der Adresse ----------
     Die Runde kommt NUR aus dem QR-Code (…?runde=1 beim Einstieg, …?runde=2 beim Check-out).
     Es gibt bewusst keine Auswahl und keinen Wechsel zwischen den Runden in der App. */
  function ohneQr() {
    platz.textContent = '';
    var box = el('section', 'karte');
    box.appendChild(el('p', null, T.ohneQr));
    platz.appendChild(box);
    K.fortschrittSetzen(0, 1);
  }

  /* ---------- Fragen ---------- */
  function fragen() {
    var r = z.runde;
    if (z.runden[r] && !z.bearbeiten) return danach();
    platz.textContent = '';
    var entwurf = z.entwurf[r] || (z.runden[r] ? JSON.parse(JSON.stringify(z.runden[r])) : { antworten: {}, sicher: {} });
    z.entwurf[r] = entwurf;
    var kopf = el('p', 'rundenkopf', r === 1 ? T.runde1 : T.runde2);
    platz.appendChild(kopf);
    if (!anmeldung()) platz.appendChild(el('p', 'hinweis', T.ohneRaum));

    T.fragen.forEach(function (f) {
      var box = el('section', 'karte frage');
      box.appendChild(el('h2', null, f.nr));
      box.appendChild(el('p', null, f.frage));
      var ant = el('div', 'antworten');
      f.optionen.forEach(function (o) {
        var k = o.charAt(0);
        var b = K.knopf(o, 'antwort', function () { entwurf.antworten[f.nr] = k; speichern(); zeichnen(); });
        b.dataset.k = k;
        ant.appendChild(b);
      });
      box.appendChild(ant);
      var s = el('div', 'sicherheit');
      s.appendChild(el('span', null, T.sicherFrage + ' '));
      [['1', T.sicher], ['0', T.unsicher]].forEach(function (x) {
        var b = K.knopf(x[1], 'klein-knopf', function () { entwurf.sicher[f.nr] = Number(x[0]); speichern(); zeichnen(); });
        b.dataset.s = x[0];
        s.appendChild(b);
      });
      box.appendChild(s);
      platz.appendChild(box);
      function zeichnen() {
        Array.prototype.forEach.call(ant.children, function (b) { b.classList.toggle('gewaehlt', entwurf.antworten[f.nr] === b.dataset.k); b.setAttribute('aria-pressed', entwurf.antworten[f.nr] === b.dataset.k ? 'true' : 'false'); });
        Array.prototype.forEach.call(s.querySelectorAll('button'), function (b) { var an = String(entwurf.sicher[f.nr]) === b.dataset.s; b.classList.toggle('gewaehlt', an); b.setAttribute('aria-pressed', an ? 'true' : 'false'); });
      }
      zeichnen();
    });
    var fehler = el('p', 'rueckmeldung falsch');
    fehler.hidden = true;
    platz.appendChild(fehler);
    platz.appendChild(K.knopf(T.abschicken, 'knopf-breit', function () {
      var vollstaendig = T.fragen.every(function (f) { return entwurf.antworten[f.nr] && (entwurf.sicher[f.nr] === 0 || entwurf.sicher[f.nr] === 1); });
      if (!vollstaendig) { fehler.hidden = false; fehler.textContent = T.nochOffen; K.scrollen(fehler); return; }
      z.runden[r] = { antworten: entwurf.antworten, sicher: entwurf.sicher };
      z.gesendet[r] = false;
      z.bearbeiten = false;
      delete z.entwurf[r];
      speichern();
      danach();
    }));
    K.fortschrittSetzen(Object.keys(entwurf.antworten).length, T.fragen.length);
  }

  /* ---------- Nach dem Abschicken ---------- */
  function danach() {
    var r = z.runde;
    platz.textContent = '';
    var status = el('p', 'klein');
    var box = el('section', 'karte');
    box.appendChild(el('p', 'rueckmeldung richtig', r === 1 ? T.danke1 : T.danke2));
    box.appendChild(status);
    platz.appendChild(box);
    if (anmeldung()) { status.textContent = z.gesendet[r] ? T.gesendet : '…'; if (!z.gesendet[r]) senden(r, status); }
    else status.textContent = T.ohneRaum;

    if (r === 2) {
      T.fragen.forEach(function (f) {
        var k = el('section', 'karte frage aufloesung');
        k.appendChild(el('h2', null, f.nr));
        k.appendChild(el('p', null, f.frage));
        var richtigText = f.optionen.filter(function (o) { return o.charAt(0) === f.richtig; })[0];
        k.appendChild(el('p', 'rueckmeldung richtig', '✓ ' + richtigText));
        k.appendChild(el('p', null, f.erklaerung));
        [1, 2].forEach(function (rr) {
          var d = z.runden[rr];
          if (!d) return;
          var a = d.antworten[f.nr];
          k.appendChild(el('p', 'klein ' + (a === f.richtig ? 'ok-text' : 'falsch-text'), K.ersetzen(rr === 1 ? T.ihreRunde1 : T.ihreRunde2, { a: a + (a === f.richtig ? ' (' + T.richtig + ')' : '') + ' · ' + (d.sicher[f.nr] ? T.sicher : T.unsicher) })));
        });
        platz.appendChild(k);
      });
    }
    platz.appendChild(K.knopf(T.neu, 'knopf-leise', function () { z.bearbeiten = true; speichern(); fragen(); }));
    K.fortschrittSetzen((z.runden[1] ? 1 : 0) + (z.runden[2] ? 1 : 0), 2);
    if (z.runden[1] && z.runden[2]) K.Erledigt.merken('w2-entscheidung');
  }

  // Wer sich erst nach dem Abstimmen anmeldet: Stimmen nachreichen
  setInterval(function () {
    var r = z.runde;
    if (r && z.runden[r] && !z.gesendet[r] && anmeldung() && versuche === 0) senden(r, document.querySelector('#uebung .karte .klein'));
  }, 4000);

  window.addEventListener('online', function () { if (z.runde && z.runden[z.runde] && !z.gesendet[z.runde]) { versuche = 0; senden(z.runde, null); } });

  // Für die Anmeldung am Beamer (Zahl der Angemeldeten): Stand dieser Seite melden – x von 2 Runden
  function rundenStand() {
    var n = (z.runden[1] ? 1 : 0) + (z.runden[2] ? 1 : 0);
    K.melden('w2-entscheidung', n, 2, n === 2 ? 'fertig' : 'arbeitet');
  }
  rundenStand();
  var altDanach = danach;
  danach = function () { altDanach(); rundenStand(); };

  // Runde aus dem QR-Code: w2-entscheidung.html?runde=1 bzw. ?runde=2
  var rundeAusQr = Number(K.urlParam('runde'));
  z.runde = rundeAusQr === 1 || rundeAusQr === 2 ? rundeAusQr : null;
  z.bearbeiten = false;
  speichern();
  if (!z.runde) ohneQr(); else fragen();
})();

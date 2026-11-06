/* Live-Verbindung zum Worker – für Beamer und Handys (Programmlogik, keine Texte).
 *
 * Zuerst WebSocket (Folienwechsel kommen sofort an). Klappt der zweimal nicht (manche WLANs
 * sperren ihn), fragt die Seite alle paar Sekunden nach (Reserve) und versucht es jede Minute
 * wieder live. Nach dem Entsperren des Handys wird sofort neu verbunden.
 *
 *   KB1Verbindung.starten({ basis, raum, geraeteId | schluessel, onStand, onStatus, onFehler })
 *     onStand(stand)      jeder neue Stand vom Worker
 *     onStatus(verbunden) true/false (für die Anzeige „Verbindung unterbrochen“)
 *     onFehler(grund)     'unbekannt' (Raum gibt es nicht mehr), 'entfernt', 'schluessel'
 *   → { jetzt(), neu(), stopp() }   jetzt() = Uhrzeit des Workers (für Uhren)
 */
(function () {
  'use strict';

  var ABFRAGE_MS = 2500;
  var PING_MS = 25000;

  function starten(o) {
    var lehrer = !!o.schluessel;
    var nurAbfrage = false;
    try { nurAbfrage = new URLSearchParams(location.search).get('verbindung') === 'abfrage'; } catch (e) { /* alt */ }
    var ws = null, wsFehler = 0, wsTimer = null, pingTimer = null, abfrageTimer = null, wsVersuchTimer = null;
    var modus = nurAbfrage ? 'abfrage' : 'ws';
    var versatz = 0;       // Worker-Zeit minus eigene Zeit
    var aus = false;
    var verbunden = null;

    function status(v) {
      if (v === verbunden) return;
      verbunden = v;
      if (o.onStatus) o.onStatus(v);
    }

    function ankommen(m) {
      if (!m || typeof m !== 'object') return;
      if (m.ok === false) {
        if (m.grund === 'unbekannt' || m.grund === 'entfernt' || m.grund === 'schluessel') { stopp(); if (o.onFehler) o.onFehler(m.grund); }
        return;
      }
      if (typeof m.jetzt === 'number') versatz = m.jetzt - Date.now();
      status(true);
      if (o.onStand) o.onStand(m);
    }

    function adresse(weg) {
      var p = 'raum=' + encodeURIComponent(o.raum) + (lehrer ? '&schluessel=' + encodeURIComponent(o.schluessel) : '&geraeteId=' + encodeURIComponent(o.geraeteId));
      return o.basis + weg + '?' + p;
    }

    /* ---------- WebSocket ---------- */
    function wsStarten() {
      if (aus) return;
      clearTimeout(wsTimer);
      var url = adresse('/api/ws').replace(/^http/, 'ws');
      var w;
      try { w = new WebSocket(url); } catch (e) { wsFehlgeschlagen(); return; }
      ws = w;
      var offen = false;
      var zeitlimit = setTimeout(function () { if (!offen && ws === w) { try { w.close(); } catch (e) { /* egal */ } } }, 6000);
      w.onopen = function () {
        offen = true;
        clearTimeout(zeitlimit);
        wsFehler = 0;
        clearInterval(pingTimer);
        pingTimer = setInterval(function () {
          try { w.send('ping'); if (lehrer) w.send(JSON.stringify({ typ: 'puls' })); } catch (e) { /* zu */ }
        }, PING_MS);
      };
      w.onmessage = function (e) {
        if (e.data === 'pong') return;
        var m = null;
        try { m = JSON.parse(e.data); } catch (x) { return; }
        ankommen(m);
      };
      w.onclose = function (e) {
        clearTimeout(zeitlimit);
        clearInterval(pingTimer);
        if (ws !== w || aus) return;
        ws = null;
        if (e && e.code === 4010) { stopp(); if (o.onFehler) o.onFehler('entfernt'); return; }
        if (e && e.code === 4004) { stopp(); if (o.onFehler) o.onFehler('unbekannt'); return; }
        status(false);
        if (!offen) wsFehlgeschlagen(); else wsTimer = setTimeout(wsStarten, 1000);
      };
      w.onerror = function () { /* onclose folgt */ };
    }

    function wsFehlgeschlagen() {
      wsFehler++;
      // Nach zwei Fehlversuchen: Reserve (Abfragen) – und jede Minute wieder live versuchen.
      // Eine Abfrage klärt außerdem, ob es den Raum überhaupt noch gibt.
      if (wsFehler >= 2) {
        modus = 'abfrage';
        abfragen();
        clearTimeout(wsVersuchTimer);
        wsVersuchTimer = setTimeout(function () { if (!aus && modus === 'abfrage' && !nurAbfrage) { modus = 'ws'; clearTimeout(abfrageTimer); wsFehler = 1; wsStarten(); } }, 60000);
      } else {
        wsTimer = setTimeout(wsStarten, 1500);
      }
    }

    /* ---------- Reserve: Abfragen ---------- */
    function abfragen() {
      if (aus || modus !== 'abfrage') return;
      clearTimeout(abfrageTimer);
      fetch(adresse(lehrer ? '/api/stand' : '/api/zustand'), { cache: 'no-store', mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer' })
        .then(function (r) { return r.json().then(function (d) { return { status: r.status, d: d }; }); })
        .then(function (x) {
          if (x.status === 404) x.d = { ok: false, grund: 'unbekannt' };
          if (x.status === 410) x.d = { ok: false, grund: 'entfernt' };
          if (x.status === 403) x.d = { ok: false, grund: 'schluessel' };
          ankommen(x.d);
        })
        .catch(function () { status(false); })
        .then(function () { if (!aus && modus === 'abfrage') abfrageTimer = setTimeout(abfragen, document.visibilityState === 'hidden' ? ABFRAGE_MS * 4 : ABFRAGE_MS); });
    }

    function neu() {
      if (aus) return;
      if (modus === 'abfrage') { abfragen(); return; }
      if (!ws) { wsFehler = 0; wsStarten(); return; }
      try { ws.send(JSON.stringify({ typ: lehrer ? 'puls' : 'hallo' })); } catch (e) { /* zu */ }
    }

    function stopp() {
      aus = true;
      clearTimeout(wsTimer); clearTimeout(abfrageTimer); clearTimeout(wsVersuchTimer); clearInterval(pingTimer);
      if (ws) { var w = ws; ws = null; try { w.close(1000); } catch (e) { /* egal */ } }
    }

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible' || aus) return;
      if (modus === 'abfrage') abfragen();
      else if (!ws || ws.readyState > 1) { wsFehler = 0; wsStarten(); }
      else neu();
    });
    window.addEventListener('online', function () { if (!aus) { if (modus === 'abfrage') abfragen(); else if (!ws) wsStarten(); } });

    if (modus === 'abfrage') abfragen(); else wsStarten();
    return { jetzt: function () { return Date.now() + versatz; }, neu: neu, stopp: stopp };
  }

  // Anfrage an den Worker (POST, JSON) → Promise { status, d }
  function senden(basis, weg, koerper) {
    return fetch(basis + weg, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(koerper),
      mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer'
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { return { status: r.status, d: d }; });
    });
  }

  window.KB1Verbindung = { starten: starten, senden: senden };
})();

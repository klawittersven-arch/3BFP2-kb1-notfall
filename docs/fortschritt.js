/* Fortschritt am Beamer – Seite für die Lehrkraft (Programmlogik, Texte in inhalte.js → beamer).
 *
 * „Neuen Raum starten“ legt beim Cloudflare-Worker einen Raum an. Raumcode und Schlüssel
 * bleiben nur in diesem Browser (localStorage). Danach fragt die Seite alle
 * CONFIG.ABFRAGE_SEKUNDEN Sekunden den Stand ab.
 *
 * Adresszusätze:  ?demo=1  Probeansicht mit erfundenen Namen (ohne Netz)
 *                 ?neu=1   sofort die Startseite zeigen (gespeicherten Raum vergessen)
 */
(function () {
  'use strict';

  var K = window.KB1;
  var el = K.element;
  var C = window.CONFIG || {};
  var T = INHALTE.beamer;
  var SPALTEN = INHALTE.start.spalten || INHALTE.start.links;   // [{ seite, kurz }]
  var FRAGEN = (INHALTE.entscheidung && INHALTE.entscheidung.fragen) || [];
  var BASIS = String(C.FORTSCHRITT_URL || '').replace(/\/+$/, '');
  var ABFRAGE_MS = Math.max(2, Number(C.ABFRAGE_SEKUNDEN) || 3) * 1000;
  var RUHIG_MS = (Number(C.RUHIG_MINUTEN) || 10) * 60000;
  var SCHL = 'kb1nf_lehrer_raum';
  var SCHL_ANWEISUNG = 'kb1nf_lehrer_anweisung';
  var ANWEISUNGEN = Array.isArray(T.anweisungen) ? T.anweisungen : [];   // [{ knopf, text }]

  var params;
  try { params = new URLSearchParams(location.search); } catch (e) { params = { get: function () { return null; } }; }
  var demo = params.get('demo') === '1';

  var raum = null;            // { raum, schluessel, laeuftAb }
  var geraete = [];           // vom Worker
  var bekannt = {};           // geraeteId → true (für die Einblend-Animation)
  var namenVerborgen = false;
  var anweisung = null;       // Nummer der eingeblendeten Anweisung oder null
  var stimmen = null;         // ausgezählte Abstimmung vom Worker
  var ansicht = 'fortschritt';  // 'fortschritt' | 'abstimmung'
  var grossIndex = null;        // Abstimmung: Nummer der groß gezeigten Frage oder null (alle Karten)
  var loesungAn = false;
  var abfrageTimer = null;
  var laeuft = false;

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- feste Texte ---------- */
  document.title = T.startTitel + ' – ' + INHALTE.allgemein.kopfzeile;
  $('start-titel').textContent = T.startTitel;
  $('start-text').textContent = T.startText;
  $('starten').textContent = T.starten;
  $('tafel-titel').textContent = T.titel;
  $('raum-label').textContent = T.raumcode;
  $('raum-hinweis').textContent = T.raumHinweis;
  $('warten').textContent = T.warten;
  $('legende').textContent = T.legendeFertig + '   ·   ' + T.legendeDurch;
  $('leeren').textContent = T.leeren;
  $('neuer-raum').textContent = T.neuerRaum;
  $('demo-hinweis').textContent = T.demo;
  $('ansicht').textContent = T.ansichtAbstimmung;
  $('loesung').textContent = T.loesungZeigen;

  /* ---------- Anfragen an den Worker ---------- */
  function api(weg, optionen) {
    return fetch(BASIS + weg, Object.assign({ mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store' }, optionen || {}))
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) { d.code = r.status; return d; });
      });
  }
  function postJson(weg, daten) {
    return api(weg, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(daten) });
  }

  /* ---------- Start ---------- */
  function startZeigen(fehler) {
    laeuft = false;
    clearTimeout(abfrageTimer);
    $('tafel').hidden = true;
    $('start').hidden = false;
    var f = fehler || '';
    if (!BASIS) f = T.nichtEingerichtet;
    $('start-fehler').textContent = f;
    $('starten').disabled = !BASIS;
  }

  $('starten').addEventListener('click', function () {
    var knopf = $('starten');
    knopf.disabled = true;
    $('start-fehler').textContent = '';
    postJson('/api/raum', {}).then(function (d) {
      knopf.disabled = false;
      if (d.code !== 200 || !d.ok) { $('start-fehler').textContent = T.startFehler; return; }
      raum = { raum: d.raum, schluessel: d.schluessel, laeuftAb: d.laeuftAb };
      K.Speicher.dauer.schreiben(SCHL, raum);
      geraete = [];
      bekannt = {};
      tafelZeigen();
    }).catch(function () {
      knopf.disabled = false;
      $('start-fehler').textContent = T.startFehler;
    });
  });

  function tafelZeigen() {
    $('start').hidden = true;
    $('tafel').hidden = false;
    $('raum-code').textContent = raum.raum;
    $('demo-hinweis').hidden = !demo;
    anweisungZeigen();
    zeichnen();
    laeuft = true;
    abfragen();
    wachHalten();
  }

  /* ---------- Abfragen ---------- */
  function statusSetzen(ok) {
    $('status-punkt').className = 'punkt ' + (ok ? 'bereit' : 'getrennt');
    if (ok) {
      var d = new Date();
      var zwei = function (n) { return (n < 10 ? '0' : '') + n; };
      $('status-text').textContent = K.ersetzen(T.aktualisiert, { uhr: zwei(d.getHours()) + ':' + zwei(d.getMinutes()) + ':' + zwei(d.getSeconds()) });
    } else {
      $('status-text').textContent = T.getrennt;
    }
  }

  function abfragen() {
    clearTimeout(abfrageTimer);
    if (!laeuft) return;
    if (demo) {
      demoSchritt();
      statusSetzen(true);
      zeichnen();
      abfrageTimer = setTimeout(abfragen, ABFRAGE_MS);
      return;
    }
    api('/api/stand?raum=' + encodeURIComponent(raum.raum) + '&schluessel=' + encodeURIComponent(raum.schluessel))
      .then(function (d) {
        if (!laeuft) return;
        if (d.code === 404 || d.code === 403) {
          K.Speicher.dauer.schreiben(SCHL, null);
          startZeigen(T.abgelaufen);
          return;
        }
        if (d.code !== 200 || !d.ok) throw new Error('Antwort ' + d.code);
        geraete = Array.isArray(d.geraete) ? d.geraete : [];
        stimmen = d.stimmen || null;
        statusSetzen(true);
        zeichnen();
        abfrageTimer = setTimeout(abfragen, ABFRAGE_MS);
      })
      .catch(function () {
        if (!laeuft) return;
        statusSetzen(false);
        abfrageTimer = setTimeout(abfragen, ABFRAGE_MS);
      });
  }

  /* ---------- Darstellung ---------- */
  function vergleich(a, b) {
    var n = String(a.name).localeCompare(String(b.name), 'de', { sensitivity: 'base' });
    return n !== 0 ? n : (a.geraeteId < b.geraeteId ? -1 : 1);
  }

  function anzeigeListe() {
    var liste = geraete.slice().sort(vergleich);
    // gleiche Vornamen unterscheiden: „Mia“, „Mia (2)“
    var zaehler = {};
    liste.forEach(function (g) {
      var k = String(g.name).toLowerCase();
      zaehler[k] = (zaehler[k] || 0) + 1;
      g.anzeige = zaehler[k] > 1 ? g.name + ' (' + zaehler[k] + ')' : g.name;
    });
    if (namenVerborgen) {
      liste.sort(function (a, b) { return a.geraeteId < b.geraeteId ? -1 : 1; });
      liste.forEach(function (g, i) { g.anzeige = K.ersetzen(T.person, { n: i + 1 }); });
    }
    return liste;
  }

  // Höhe des Kartenbereichs in vh – wird gemessen, weil eine eingeblendete Anweisung Platz braucht
  function verfuegbareHoehe() {
    var h = $('raster').parentNode.clientHeight / (window.innerHeight || 1) * 100;
    return h > 10 ? h : 72;
  }

  function rasterMasse(n) {
    var spalten = n <= 4 ? 2 : n <= 9 ? 3 : n <= 16 ? 4 : n <= 30 ? 5 : 6;
    var zeilen = Math.max(1, Math.ceil(n / spalten));
    // Karten füllen den verfügbaren Platz (1vh Abstand je Zeile), sind aber nie höher als 15vh
    var h = Math.min(15, (verfuegbareHoehe() - (zeilen - 1)) / zeilen);
    return { spalten: spalten, h: Math.max(5.5, h) };
  }

  /* ---------- Abstimmung „Ihre Entscheidung, bitte!“ ---------- */
  function abstimmungZeichnen() {
    var box = $('abstimmung');
    box.textContent = '';
    var r1 = (stimmen && stimmen[1]) || { n: 0, fragen: {} };
    var r2 = (stimmen && stimmen[2]) || { n: 0, fragen: {} };
    $('zusammenfassung').textContent = K.ersetzen(T.stimmenZahl, { a: r1.n, b: r2.n });
    if (!r1.n && !r2.n) { box.appendChild(el('p', 'abst-leer', T.keineStimmen)); return; }
    // Einzelansicht: nur eine Frage groß (Klick auf eine Karte); sonst alle fünf Karten
    var einzeln = grossIndex !== null && !!FRAGEN[grossIndex];
    box.classList.toggle('einzeln', einzeln);
    if (!einzeln) $('zusammenfassung').textContent += '   ·   ' + T.vergroessernHinweis;
    FRAGEN.forEach(function (f, i) {
      if (einzeln && i !== grossIndex) return;
      var karte = el('section', 'abst-frage' + (einzeln ? ' gross' : ''));
      karte.tabIndex = 0;
      karte.setAttribute('role', 'button');
      karte.title = einzeln ? T.verkleinernTipp : T.vergroessernTipp;
      karte.addEventListener('click', function () { grossSetzen(einzeln ? null : i); });
      karte.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); grossSetzen(einzeln ? null : i); }
      });
      karte.appendChild(el('h2', null, f.nr + ' · ' + f.frage));
      var tab = el('div', 'abst-raster');
      tab.appendChild(el('span', 'abst-kopf', ''));
      tab.appendChild(el('span', 'abst-kopf', T.runde1));
      tab.appendChild(el('span', 'abst-kopf', T.runde2));
      f.optionen.forEach(function (o) {
        var k = o.charAt(0);
        var richtig = loesungAn && k === f.richtig;
        tab.appendChild(el('span', 'abst-option' + (richtig ? ' richtig' : ''), (richtig ? '✓ ' : '') + o));
        [r1, r2].forEach(function (r) {
          var werte = (r.fragen[f.nr] && r.fragen[f.nr][k]) || { sicher: 0, unsicher: 0 };
          var n = werte.sicher + werte.unsicher;
          var gesamt = r.n || 1;
          var zelle = el('span', 'abst-zelle');
          var spur = el('span', 'abst-spur');
          var balken = el('span', 'abst-balken' + (richtig ? ' richtig' : ''));
          balken.style.width = Math.round(100 * n / gesamt) + '%';
          var sicher = el('span', 'abst-sicher');
          sicher.style.width = (n ? Math.round(100 * werte.sicher / n) : 0) + '%';
          balken.appendChild(sicher);
          spur.appendChild(balken);
          zelle.appendChild(spur);
          zelle.appendChild(el('span', 'abst-zahl', n + (n ? ' (' + K.ersetzen(T.sicherAnteil, { n: werte.sicher }) + ')' : '')));
          tab.appendChild(zelle);
        });
      });
      karte.appendChild(tab);
      if (loesungAn) karte.appendChild(el('p', 'abst-erklaerung', f.erklaerung));
      box.appendChild(karte);
    });
    if (einzeln) {
      var nav = el('div', 'abst-nav');
      var zurueck = el('button', 'leise', '← ' + T.vorherigeFrage);
      zurueck.type = 'button';
      zurueck.disabled = grossIndex === 0;
      zurueck.addEventListener('click', function () { grossSetzen(grossIndex - 1); });
      var alle = el('button', 'leise', T.alleFragen);
      alle.type = 'button';
      alle.addEventListener('click', function () { grossSetzen(null); });
      var vor = el('button', 'leise', T.naechsteFrage + ' →');
      vor.type = 'button';
      vor.disabled = grossIndex === FRAGEN.length - 1;
      vor.addEventListener('click', function () { grossSetzen(grossIndex + 1); });
      nav.appendChild(zurueck);
      nav.appendChild(alle);
      nav.appendChild(vor);
      box.appendChild(nav);
    }
  }

  // Eine Frage groß zeigen (Index) oder zurück zu allen Karten (null)
  function grossSetzen(i) {
    if (i !== null && (i < 0 || i >= FRAGEN.length)) return;
    grossIndex = i;
    abstimmungZeichnen();
    var fokus = document.querySelector('#abstimmung .abst-frage');
    if (fokus && grossIndex !== null) fokus.focus({ preventScroll: true });
  }

  function ansichtSetzen(neu) {
    ansicht = neu;
    $('ansicht').textContent = ansicht === 'fortschritt' ? T.ansichtAbstimmung : T.ansichtFortschritt;
    $('loesung').hidden = ansicht !== 'abstimmung';
    $('loesung').textContent = loesungAn ? T.loesungVerbergen : T.loesungZeigen;
    $('abstimmung').hidden = ansicht !== 'abstimmung';
    $('raster').hidden = ansicht !== 'fortschritt';
    $('legende').hidden = ansicht !== 'fortschritt';
    zeichnen();
  }

  function zeichnen() {
    if (ansicht === 'abstimmung') { $('warten').hidden = true; abstimmungZeichnen(); return; }
    var liste = anzeigeListe();
    var raster = $('raster');
    $('warten').hidden = liste.length > 0;
    $('namen').textContent = namenVerborgen ? T.namenZeigen : T.namenVerbergen;
    $('vollbild').textContent = document.fullscreenElement ? T.vollbildAus : T.vollbild;

    // Zusammenfassung
    var teile = [K.ersetzen(T.angemeldet, { n: liste.length })];
    SPALTEN.forEach(function (s) {
      var x = liste.filter(function (g) { return g.seiten && g.seiten[s.seite] && g.seiten[s.seite].status === 'fertig'; }).length;
      teile.push(K.ersetzen(T.fertigZahl, { kurz: s.kurz, x: x }));
    });
    $('zusammenfassung').textContent = teile.join('   ·   ');

    var m = rasterMasse(liste.length);
    raster.style.gridTemplateColumns = 'repeat(' + m.spalten + ', minmax(0, 1fr))';
    raster.style.setProperty('--h', m.h.toFixed(2));
    // Schriftgröße so wählen, dass Name + ein Balken je Übung in die Karte passen
    raster.style.setProperty('--fs', (m.h / (2 + 1.6 * SPALTEN.length)).toFixed(3));
    raster.textContent = '';
    var jetzt = Date.now();

    liste.forEach(function (g) {
      var karte = el('button', 's-karte');
      karte.type = 'button';
      karte.setAttribute('data-geraet', g.geraeteId);
      var alleFertig = SPALTEN.every(function (s) { return g.seiten && g.seiten[s.seite] && g.seiten[s.seite].status === 'fertig'; });
      if (alleFertig) karte.classList.add('alles-fertig');
      if (jetzt - (g.um || 0) > RUHIG_MS) karte.classList.add('ruhig');
      if (!bekannt[g.geraeteId]) { karte.classList.add('neu'); bekannt[g.geraeteId] = true; }

      karte.appendChild(el('span', 's-name', g.anzeige));
      var zeilen = el('span', 's-zeilen');
      SPALTEN.forEach(function (s) {
        var st = g.seiten && g.seiten[s.seite];
        var z = el('span', 's-zeile');
        z.setAttribute('data-seite', s.seite);
        z.title = s.text || s.kurz;
        z.appendChild(el('span', 's-kurz', s.kurz));
        var spur = el('span', 's-spur');
        var balken = el('span', 's-balken' + (st ? ' ' + st.status : ''));
        balken.style.width = st ? Math.round(st.geloest / st.gesamt * 100) + '%' : '0';
        spur.appendChild(balken);
        z.appendChild(spur);
        var zahl = st ? st.geloest + '/' + st.gesamt + (st.status === 'fertig' ? ' ✓' : st.status === 'durchklicken' ? ' ⚠' : '') : '–';
        z.appendChild(el('span', 's-zahl ' + (st ? st.status : 'leer'), zahl));
        zeilen.appendChild(z);
      });
      karte.appendChild(zeilen);
      karte.addEventListener('click', function () {
        frage(K.ersetzen(T.entfernenFrage, { name: g.anzeige }), T.entfernen, function () { entfernen(g.geraeteId); });
      });
      raster.appendChild(karte);
    });
  }

  /* ---------- Moderation ---------- */
  function frage(text, jaText, aktion) {
    var dialog = $('dialog');
    $('dialog-text').textContent = text;
    var k = $('dialog-knoepfe');
    k.textContent = '';
    var ja = el('button', 'knopf', jaText);
    ja.type = 'button';
    ja.id = 'dialog-ja';
    ja.addEventListener('click', function () { dialog.hidden = true; aktion(); });
    var nein = el('button', 'knopf knopf-zweit', T.abbrechen);
    nein.type = 'button';
    nein.addEventListener('click', function () { dialog.hidden = true; });
    k.appendChild(ja);
    k.appendChild(nein);
    dialog.hidden = false;
    ja.focus();
  }

  function entfernen(geraeteId) {
    geraete = geraete.filter(function (g) { return g.geraeteId !== geraeteId; });
    zeichnen();
    if (demo) return;
    postJson('/api/entfernen', { raum: raum.raum, schluessel: raum.schluessel, geraeteId: geraeteId })
      .then(function () { abfragen(); }).catch(function () { /* nächste Abfrage zeigt den Stand */ });
  }

  $('leeren').addEventListener('click', function () {
    frage(T.leerenFrage, T.ja, function () {
      geraete = [];
      zeichnen();
      if (demo) return;
      postJson('/api/leeren', { raum: raum.raum, schluessel: raum.schluessel })
        .then(function () { abfragen(); }).catch(function () {});
    });
  });

  $('neuer-raum').addEventListener('click', function () {
    frage(T.neuerRaumFrage, T.ja, function () {
      K.Speicher.dauer.schreiben(SCHL, null);
      raum = null;
      anweisungSetzen(null);
      if (demo) { location.href = location.pathname; return; }
      startZeigen('');
    });
  });

  $('namen').addEventListener('click', function () {
    namenVerborgen = !namenVerborgen;
    zeichnen();
  });

  $('ansicht').addEventListener('click', function () { ansichtSetzen(ansicht === 'fortschritt' ? 'abstimmung' : 'fortschritt'); });
  $('loesung').addEventListener('click', function () { loesungAn = !loesungAn; ansichtSetzen(ansicht); });

  $('vollbild').addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
  });
  document.addEventListener('fullscreenchange', function () {
    $('vollbild').textContent = document.fullscreenElement ? T.vollbildAus : T.vollbild;
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') $('dialog').hidden = true;
    // Abstimmung in der Einzelansicht: Pfeiltasten blättern, Esc zurück zu allen Karten
    if (ansicht === 'abstimmung' && grossIndex !== null) {
      if (e.key === 'ArrowRight' && grossIndex < FRAGEN.length - 1) grossSetzen(grossIndex + 1);
      else if (e.key === 'ArrowLeft' && grossIndex > 0) grossSetzen(grossIndex - 1);
      else if (e.key === 'Escape') grossSetzen(null);
    }
  });

  /* ---------- Anweisung für die Klasse (groß über den Karten) ---------- */
  function anweisungZeigen() {
    var an = anweisung !== null;
    var box = $('anweisung');
    box.textContent = an ? ANWEISUNGEN[anweisung].text : '';
    box.hidden = !an;
    $('tafel').classList.toggle('mit-anweisung', an);
    Array.prototype.forEach.call(document.querySelectorAll('.anweisung-knopf'), function (k) {
      k.setAttribute('aria-pressed', String(Number(k.getAttribute('data-anweisung')) === anweisung));
    });
  }

  function anweisungSetzen(nr) {
    anweisung = nr;
    K.Speicher.sitzung.schreiben(SCHL_ANWEISUNG, nr);   // übersteht ein Neuladen der Seite
    anweisungZeigen();
    if (laeuft) zeichnen();                              // Karten an den übrigen Platz anpassen
  }

  ANWEISUNGEN.forEach(function (a, nr) {
    var knopf = el('button', 'leise anweisung-knopf', a.knopf);
    knopf.type = 'button';
    knopf.title = T.anweisungTipp || '';
    knopf.setAttribute('data-anweisung', nr);
    knopf.addEventListener('click', function () { anweisungSetzen(anweisung === nr ? null : nr); });
    $('anweisung-knoepfe').appendChild(knopf);
  });

  var gemerkt = K.Speicher.sitzung.lesen(SCHL_ANWEISUNG);
  if (typeof gemerkt === 'number' && ANWEISUNGEN[gemerkt]) anweisung = gemerkt;

  // Fenstergröße geändert (z. B. Beamer angeschlossen) → Karten neu einpassen
  var groesseTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(groesseTimer);
    groesseTimer = setTimeout(function () { if (laeuft) zeichnen(); }, 150);
  });

  /* ---------- Bildschirm wach halten ---------- */
  var sperre = null;
  function wachHalten() {
    if (!('wakeLock' in navigator) || document.visibilityState !== 'visible' || sperre) return;
    navigator.wakeLock.request('screen').then(function (s) {
      sperre = s;
      s.addEventListener('release', function () { sperre = null; });
    }).catch(function () {});
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && laeuft) { wachHalten(); abfragen(); }
  });

  /* ---------- Probeansicht ---------- */
  var DEMO_NAMEN = ['Mia', 'Ben', 'Lea', 'Jonas', 'Emma', 'Noah', 'Hannah', 'Elias', 'Sophie', 'Luca', 'Marie', 'Finn',
    'Lina', 'Paul', 'Emilia', 'Leon', 'Clara', 'Felix', 'Mia', 'Amira', 'Tim', 'Selin', 'Jan-Ole', 'Lea Sophie'];
  function demoStart() {
    var jetzt = Date.now();
    geraete = DEMO_NAMEN.map(function (n, i) {
      var g = { geraeteId: 'demo' + (100 + i), name: n, seiten: {}, um: jetzt - (i === 5 ? 15 * 60000 : 0) };
      var a = Math.floor(Math.random() * 12);
      g.seiten['w2-markieren'] = { geloest: a, gesamt: 11, status: a === 11 ? (i % 7 === 3 ? 'durchklicken' : 'fertig') : 'arbeitet' };
      if (a === 11 && i % 2 === 0) g.seiten['w2-detektiv'] = { geloest: Math.floor(Math.random() * 8), gesamt: 7, status: 'arbeitet' };
      return g;
    });
    stimmen = { 1: { n: 0, fragen: {} }, 2: { n: 0, fragen: {} } };
    // erfundene Abstimmung: Runde 1 mit typischen Fehlvorstellungen, Runde 2 besser
    var falschQuote = { 1: 0.55, 2: 0.15 };
    [1, 2].forEach(function (r) {
      var anzahl = r === 1 ? 22 : 21;
      stimmen[r].n = anzahl;
      FRAGEN.forEach(function (f) {
        var verteilung = {};
        for (var k = 0; k < anzahl; k++) {
          var wahl = Math.random() < falschQuote[r] ? f.optionen[Math.floor(Math.random() * f.optionen.length)].charAt(0) : f.richtig;
          verteilung[wahl] = verteilung[wahl] || { sicher: 0, unsicher: 0 };
          verteilung[wahl][Math.random() < (r === 1 ? 0.4 : 0.75) ? 'sicher' : 'unsicher']++;
        }
        stimmen[r].fragen[f.nr] = verteilung;
      });
    });
  }
  function demoSchritt() {
    geraete.forEach(function (g, i) {
      if (i === 5 || Math.random() > 0.35) return;
      var reihe = [['w2-markieren', 11], ['w2-detektiv', 7], ['w2-lagerung', 9], ['w2-simulation', 3]];
      for (var j = 0; j < reihe.length; j++) {
        var s = g.seiten[reihe[j][0]] || (g.seiten[reihe[j][0]] = { geloest: 0, gesamt: reihe[j][1], status: 'arbeitet' });
        if (s.geloest < s.gesamt) { s.geloest++; if (s.geloest === s.gesamt && s.status !== 'durchklicken') s.status = 'fertig'; break; }
      }
      g.um = Date.now();
    });
  }

  /* ---------- Los geht's ---------- */
  if (demo) {
    raum = { raum: '4821', schluessel: 'demo' };
    demoStart();
    tafelZeigen();
    return;
  }
  if (params.get('neu') === '1') K.Speicher.dauer.schreiben(SCHL, null);
  var gespeichert = K.Speicher.dauer.lesen(SCHL);
  if (BASIS && gespeichert && /^\d{4}$/.test(gespeichert.raum) && typeof gespeichert.schluessel === 'string' &&
      (!gespeichert.laeuftAb || gespeichert.laeuftAb > Date.now())) {
    raum = gespeichert;
    tafelZeigen();
  } else {
    startZeigen('');
  }
})();

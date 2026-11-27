/* KB I · TB 2 – Notfall-Szene (z. B. kb1ab05 „Notfall in der Werkstatt“).
 * Ablauf: Regeln → je Fall: Einstieg → Entscheidungen (je 3 Antworten, gemischt) → Fallende → Ergebnis mit Merkwort.
 * Zwei Herzen je Fall, Blutverlust-Balken (läuft nur, solange eine Entscheidung offen ist).
 * Alle Texte stehen in inhalte.js. Name, Klasse und Fortschrittsanzeige wie in app.js (gleicher Server, gleiche Schlüssel). */
(function () {
  'use strict';

  var A = INHALTE.allgemein;
  var E = window.EINSTELLUNGEN || {};
  var id = document.body.getAttribute('data-uebung');
  var U = INHALTE[id];
  var T = U.texte;
  var KARTEN = U.karten;
  var FAELLE = U.faelle;
  var HERZEN = U.herzen || 2;
  var FEHLER_BLUT = typeof U.fehlerBlut === 'number' ? U.fehlerBlut : 10;

  var PRAEFIX = 'kb1-tb2-';
  var GEMEINSAM = 'kb2-notfall-';
  var SPEICHER = PRAEFIX + id + '-szene';
  var GELOEST = PRAEFIX + 'geloest';
  var NAME = GEMEINSAM + 'name';
  var KLASSE = GEMEINSAM + 'klasse';
  var GERAET = GEMEINSAM + 'geraet';
  var SERVER = String(E.serverAdresse || '').replace(/\/+$/, '');
  var KLASSEN = E.klassen || [];
  // Nach einer falschen Antwort: so lange Erklärung lesen (höchstens 4 s, Wert aus einstellungen.js)
  var SPERRE_MS = 1000 * Math.min(4, typeof E.sperreNachFehlerSekunden === 'number' ? Math.max(0, E.sperreNachFehlerSekunden) : 4);

  // ---------- Hilfsfunktionen ----------
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmt(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>'); }
  function ersetze(s, w) { return String(s).replace(/\{(\w)\}/g, function (m, k) { return w[k] !== undefined ? w[k] : m; }); }
  function lade(schluessel, art) {
    try { var s = (art || window.sessionStorage).getItem(schluessel); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  }
  function speichere(schluessel, wert, art) {
    try { (art || window.sessionStorage).setItem(schluessel, JSON.stringify(wert)); } catch (e) { /* ohne Speicher geht es auch */ }
  }
  function lokal() { try { return window.localStorage; } catch (e) { return null; } }
  function gespeichert(schluessel) { var l = lokal(); try { return l ? l.getItem(schluessel) : null; } catch (e) { return null; } }
  function klasseName(kuerzel) {
    var k = KLASSEN.filter(function (x) { return x.kuerzel === kuerzel; })[0];
    return k ? k.name : null;
  }
  function mische(liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function bildUrl(name) { return U.bilder + name + '.webp'; }
  function vorladen(namen) {
    namen.forEach(function (n) { if (n) { var b = new Image(); b.src = bildUrl(n); } });
  }
  function kartenDesFalls(f) {
    return KARTEN.map(function (k, i) { return i; }).filter(function (i) { return KARTEN[i].fall === f + 1; });
  }
  function antwortVon(karte, kuerzel) { return karte.antworten.filter(function (a) { return a.kuerzel === kuerzel; })[0]; }

  // ---------- Name und Fortschrittsanzeige (wie app.js) ----------
  function normalisiereName(roh) {
    var t = String(roh || '').replace(/\s+/g, ' ').trim();
    var m = t.match(/^(.+) (\S)[^ ]*$/);
    if (!m) return null;
    var vor = m[1].charAt(0).toUpperCase() + m[1].slice(1);
    var name = vor + ' ' + m[2].toUpperCase() + '.';
    if (name.length > 24 || !/^\p{L}[\p{L}' -]*\p{L} \p{L}\.$/u.test(name)) return null;
    var flach = name.toLowerCase().replace(/[^\p{L}]/gu, '');
    var sperr = (E.sperrwoerter || []).some(function (w) { return flach.indexOf(w) >= 0; });
    return sperr ? null : name;
  }
  function geraetId() {
    var l = lokal(), g = null;
    try { g = l && l.getItem(GERAET); } catch (e) { g = null; }
    if (g && /^[a-f0-9]{16,64}$/.test(g)) return g;
    var b = new Uint8Array(16);
    try { window.crypto.getRandomValues(b); } catch (e) { for (var i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256); }
    g = Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    try { if (l) l.setItem(GERAET, g); } catch (e) { /* egal */ }
    return g;
  }
  var name = SERVER ? normalisiereName(gespeichert(NAME)) : null;
  var klasse = SERVER ? gespeichert(KLASSE) : null;
  if (!klasseName(klasse)) klasse = null;
  var wiederholung = null;

  function anzahlGeloest() { return z.geloest.filter(Boolean).length; }
  function anzahlErster() { return z.geloest.filter(function (g, i) { return g && !z.ersteFalsch[KARTEN[i].nummer]; }).length; }
  function sende() {
    if (!SERVER || !name || !klasse || !U.raum) return;
    var daten = {
      raum: klasse + '-' + U.raum, uebung: id, geraet: geraetId(), name: name,
      geloest: anzahlGeloest(), gesamt: KARTEN.length, erster: anzahlErster(), neu: Math.min(99, z.neu),
      // je Entscheidung die zuerst gewählte falsche Antwort, z. B. "5-NEU" (für die Besprechung am Beamer)
      falsch: Object.keys(z.ersteFalsch).map(function (nr) { return nr + '-' + z.ersteFalsch[nr]; })
    };
    var ok = function (r) { if (!r.ok) throw new Error('Status ' + r.status); };
    try {
      fetch(SERVER + '/fortschritt', {
        method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(daten), keepalive: true
      }).then(ok).catch(spaeter);
    } catch (e) { spaeter(); }
  }
  function spaeter() {
    if (wiederholung) return;
    wiederholung = setTimeout(function () { wiederholung = null; sende(); }, 10000);
  }

  // ---------- Zustand ----------
  // phase: regeln | einstieg | frage | fallende | zusammenbruch | fertig
  function neuerZustand() {
    return {
      v: 1, phase: 'regeln', fall: 0, k: -1, herzen: HERZEN, blut: 0, gestoppt: false,
      reihenfolge: [], falschJetzt: [], beantwortet: false, sperreBis: 0, letzteFalsch: null, ursache: '',
      geloest: KARTEN.map(function () { return false; }), ersteFalsch: {}, neu: 0, ohneZeit: false
    };
  }
  var z = lade(SPEICHER);
  if (!z || z.v !== 1 || !z.geloest || z.geloest.length !== KARTEN.length) z = neuerZustand();
  function sichern() { speichere(SPEICHER, z); }

  // ---------- Seite ----------
  document.title = U.titel + ' – ' + A.kopfzeile;
  document.getElementById('kopfzeile').textContent = A.kopfzeile + ' · ' + U.ab;
  document.getElementById('titel').textContent = U.titel;
  var leiste = document.getElementById('sz-leiste');
  var buehne = document.getElementById('sz-buehne');
  var nameBereich = document.getElementById('name-bereich');
  var nameZeile = document.getElementById('name-zeile');
  var uebungTeil = document.getElementById('uebung-teil');

  function zeichneLeiste() {
    var imFall = z.phase === 'frage' || z.phase === 'einstieg';
    leiste.hidden = !imFall;
    if (!imFall) return;
    var herzen = '';
    for (var i = 0; i < HERZEN; i++) herzen += '<span class="sz-herz' + (i < z.herzen ? '' : ' sz-herz-weg') + '">' + (i < z.herzen ? '❤️' : '🤍') + '</span>';
    var ids = kartenDesFalls(z.fall);
    var nr = z.phase === 'frage' ? ids.indexOf(z.k) + 1 : 0;
    var blutText = z.gestoppt ? '✓ ' + T.gestopptLabel : (z.ohneZeit ? T.blutLabel + ' · ' + T.ohneZeitLabel : T.blutLabel);
    leiste.innerHTML =
      '<div class="sz-zeile"><span class="sz-herzen" aria-label="' + z.herzen + ' von ' + HERZEN + ' Herzen">' + herzen + '</span>' +
      '<span class="sz-stand">' + esc(ersetze(T.fortschritt, { x: z.fall + 1, y: FAELLE.length, a: nr || '–', b: ids.length })) + '</span></div>' +
      '<div class="sz-blut' + (z.gestoppt ? ' sz-gestoppt' : '') + (z.ohneZeit ? ' sz-ohne-zeit' : '') + '">' +
      '<span class="sz-blut-text">' + esc(blutText) + '</span>' +
      '<span class="sz-blut-spur" role="progressbar" aria-label="' + esc(T.blutLabel) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(z.blut) + '">' +
      '<span class="sz-blut-balken" id="sz-blut-balken" style="width:' + Math.min(100, z.blut) + '%"></span></span></div>';
  }
  function aktualisiereBalken() {
    var b = document.getElementById('sz-blut-balken');
    if (b) {
      b.style.width = Math.min(100, z.blut) + '%';
      b.parentNode.setAttribute('aria-valuenow', Math.round(z.blut));
      b.classList.toggle('sz-kritisch', z.blut >= 70);
    }
  }
  function bild(name, klein) {
    return name ? '<img class="sz-bild' + (klein ? ' sz-bild-klein' : '') + '" src="' + esc(bildUrl(name)) + '" width="480" height="480" alt="">' : '';
  }
  function knopf(text, idName, art) {
    return '<button type="button" class="knopf sz-knopf' + (art ? ' ' + art : '') + '" id="' + idName + '">' + esc(text) + '</button>';
  }
  function nachOben() { try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { window.scrollTo(0, 0); } }
  // Bei einer Entscheidung den Seitenkopf wegscrollen, damit Bild, Frage und alle Antworten auf den Bildschirm passen
  function zurFrage() {
    var kopf = document.querySelector('.kopf');
    var y = kopf ? kopf.offsetHeight : 0;
    try { window.scrollTo({ top: y, behavior: 'auto' }); } catch (e) { window.scrollTo(0, y); }
  }
  function zeigeUnten(el) {
    setTimeout(function () { try { el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { el.scrollIntoView(false); } }, 80);
  }

  function zeichne() {
    zeichneLeiste();
    var f = FAELLE[z.fall];
    if (z.phase === 'regeln') {
      buehne.innerHTML =
        '<p class="anweisung">' + fmt(U.anweisung) + '</p>' +
        '<div class="sz-regeln"><h2>' + esc(T.regelnTitel) + '</h2><ul>' +
        U.regeln.map(function (r) { return '<li>' + fmt(r) + '</li>'; }).join('') + '</ul></div>' +
        knopf(T.startKnopf, 'sz-start');
      document.getElementById('sz-start').addEventListener('click', function () { starteFall(0); });
      vorladen([FAELLE[0].bild]);
    } else if (z.phase === 'einstieg') {
      buehne.innerHTML =
        '<h2 class="sz-falltitel">' + esc(f.titel) + '</h2>' + bild(f.bild) +
        '<p class="sz-text">' + fmt(f.text) + '</p>' + knopf(T.losKnopf, 'sz-los');
      document.getElementById('sz-los').addEventListener('click', function () { zeigeFrage(kartenDesFalls(z.fall)[0]); });
      var erste = KARTEN[kartenDesFalls(z.fall)[0]];
      vorladen([erste.bild, erste.bildDanach]);
    } else if (z.phase === 'frage') {
      zeichneFrage();
    } else if (z.phase === 'fallende') {
      var letzter = z.fall === FAELLE.length - 1;
      buehne.innerHTML =
        '<div class="sz-geschafft"><p class="sz-geschafft-titel"><span aria-hidden="true">✓</span> ' + esc(T.fallGeschafft) + '</p></div>' +
        bild(f.endeBild) + '<p class="sz-text">' + fmt(f.ende) + '</p>' +
        knopf(letzter ? T.ergebnisKnopf : ersetze(T.naechsterFall, { x: z.fall + 2 }), 'sz-weiter');
      document.getElementById('sz-weiter').addEventListener('click', function () {
        if (letzter) { z.phase = 'fertig'; sichern(); merkeGeloest(); zeichne(); nachOben(); } else starteFall(z.fall + 1);
      });
      if (!letzter) vorladen([FAELLE[z.fall + 1].bild]);
    } else if (z.phase === 'zusammenbruch') {
      var karte = KARTEN[z.k] || {};
      var ursache = z.ursache === 'zeit' ? ersetze(T.ursacheZeit, { x: f.patient }) : T.ursacheFehler;
      var falsch = z.letzteFalsch ? antwortVon(karte, z.letzteFalsch) : null;
      buehne.innerHTML =
        '<div class="sz-kollaps" role="alert"><h2>' + esc(T.zusammenbruchTitel) + '</h2><p><strong>' + esc(ursache) + '</strong></p>' +
        (falsch && falsch.warum ? '<p class="sz-kollaps-warum"><span class="sz-durch">' + esc(falsch.text) + '</span><br>' + fmt(falsch.warum) + '</p>' : '') +
        '</div>' + bild(karte.zusammenbruchBild || f.zusammenbruchBild) +
        '<p class="sz-text">' + fmt(f.zusammenbruch) + '</p>' +
        knopf(ersetze(T.nochmalFall, { x: z.fall + 1 }), 'sz-nochmal') +
        (z.ursache === 'zeit' && !z.ohneZeit ? '<p class="hinweis-klein">' + esc(T.ohneZeitHinweis) + '</p>' + knopf(T.ohneZeitKnopf, 'sz-ohne-zeit', 'knopf-zweit') : '');
      document.getElementById('sz-nochmal').addEventListener('click', function () { starteFall(z.fall); });
      var oz = document.getElementById('sz-ohne-zeit');
      if (oz) oz.addEventListener('click', function () { z.ohneZeit = true; starteFall(z.fall); });
    } else if (z.phase === 'fertig') {
      var n = KARTEN.length;
      buehne.innerHTML =
        '<div class="weiter" role="status"><p class="weiter-titel"><span aria-hidden="true">✓</span> ' + esc(T.fertigTitel) + '</p>' +
        (U.danach ? '<p class="weiter-text">' + fmt(U.danach) + '</p>' : '') + '</div>' +
        '<div class="merksatz sz-merkwort"><h2>' + esc(T.merkwortTitel) + '</h2><ol class="sz-nadann">' +
        U.merkwort.map(function (m, i) {
          return '<li style="--i:' + i + '"><span class="sz-b" aria-hidden="true">' + esc(m.b) + '</span>' +
            '<span class="sz-m"><strong>' + esc(m.wort) + '</strong><br>' + fmt(m.text) + '</span></li>';
        }).join('') + '</ol>' +
        '<p class="merksatz-text">' + fmt(U.merksatz) + '</p>' +
        '<p class="erster-versuch">' + esc(ersetze(T.ersterVersuch, { x: anzahlErster(), y: n })) + '</p></div>' +
        knopf(T.nochmalAlles, 'sz-alles', 'knopf-zweit');
      document.getElementById('sz-alles').addEventListener('click', function () {
        z = neuerZustand(); sichern(); vergissGeloest(); sende(); zeichne(); nachOben();
      });
    }
  }

  function zeichneFrage() {
    var karte = KARTEN[z.k];
    var gesperrt = z.sperreBis && Date.now() < z.sperreBis;
    var reihen = z.reihenfolge.length === karte.antworten.length ? z.reihenfolge : karte.antworten.map(function (a) { return a.kuerzel; });
    var zeigeBild = z.beantwortet && karte.bildDanach ? karte.bildDanach : karte.bild;
    var knoepfe = reihen.map(function (ku) {
      var a = antwortVon(karte, ku);
      var istFalsch = z.falschJetzt.indexOf(ku) >= 0;
      var istRichtig = z.beantwortet && ku === karte.richtig;
      var cls = 'antwort sz-antwort' + (istFalsch ? ' ist-falsch' : '') + (istRichtig ? ' ist-richtig' : '');
      var aus = istFalsch || z.beantwortet || gesperrt;
      return '<button type="button" class="' + cls + '" data-kuerzel="' + esc(ku) + '"' + (aus ? ' disabled' : '') + '>' +
        '<span class="symbol" aria-hidden="true">' + (istFalsch ? '✗' : (istRichtig ? '✓' : '')) + '</span>' +
        '<span class="beschriftung">' + esc(a.text) + '</span></button>';
    }).join('');
    var rm = '';
    if (z.beantwortet) {
      rm = '<div class="rueckmeldung richtig" role="status"><p class="rm-kopf"><span aria-hidden="true">✓</span> ' + esc(T.richtigText) + '</p>' +
        '<p>' + fmt(karte.erklaerung) + '</p></div>' + knopf(T.weiterKnopf, 'sz-naechste');
    } else if (z.letzteFalsch) {
      var a = antwortVon(karte, z.letzteFalsch);
      rm = '<div class="rueckmeldung falsch" role="status"><p class="rm-kopf"><span aria-hidden="true">✗</span> ' + esc(T.falschText) + '</p>' +
        '<p>' + fmt(a.warum || '') + '</p>' +
        (gesperrt ? '<p class="sperre" id="sz-sperre">' + esc(ersetze(T.sperreText, { x: Math.ceil((z.sperreBis - Date.now()) / 1000) })) + '</p>' : '') + '</div>';
    }
    buehne.innerHTML = bild(zeigeBild, true) +
      '<p class="sz-text sz-frage">' + fmt(karte.text) + '</p>' +
      '<div class="sz-antworten" role="group">' + knoepfe + '</div>' +
      '<div id="sz-rm">' + rm + '</div>';
    Array.prototype.forEach.call(buehne.querySelectorAll('.sz-antwort'), function (b) {
      b.addEventListener('click', function () { antworte(b.getAttribute('data-kuerzel')); });
    });
    var w = document.getElementById('sz-naechste');
    if (w) w.addEventListener('click', weiter);
  }

  // ---------- Ablauf ----------
  function starteFall(f) {
    z.fall = f;
    z.phase = 'einstieg';
    z.k = -1;
    z.herzen = HERZEN;
    z.blut = FAELLE[f].start || 0;
    z.gestoppt = false;
    z.falschJetzt = []; z.beantwortet = false; z.sperreBis = 0; z.letzteFalsch = null; z.ursache = '';
    kartenDesFalls(f).forEach(function (i) { z.geloest[i] = false; });
    sichern();
    zeichne();
    nachOben();
  }
  function zeigeFrage(i) {
    z.phase = 'frage';
    z.k = i;
    z.reihenfolge = mische(KARTEN[i].antworten.map(function (a) { return a.kuerzel; }));
    z.falschJetzt = []; z.beantwortet = false; z.sperreBis = 0; z.letzteFalsch = null;
    sichern();
    zeichne();
    zurFrage();
    var ids = kartenDesFalls(z.fall), p = ids.indexOf(i), naechste = KARTEN[ids[p + 1]];
    vorladen([KARTEN[i].bildDanach, naechste && naechste.bild, naechste && naechste.bildDanach,
      KARTEN[i].zusammenbruchBild || FAELLE[z.fall].zusammenbruchBild]);
  }
  function antworte(ku) {
    if (z.phase !== 'frage' || z.beantwortet || z.falschJetzt.indexOf(ku) >= 0) return;
    if (z.sperreBis && Date.now() < z.sperreBis) return;
    var karte = KARTEN[z.k];
    if (ku === karte.richtig) {
      z.beantwortet = true;
      z.sperreBis = 0;
      z.geloest[z.k] = true;
      if (karte.stopp) z.gestoppt = true;
      sichern();
      zeichne();
      sende();
      zeigeUnten(document.getElementById('sz-naechste'));
      return;
    }
    z.falschJetzt.push(ku);
    z.letzteFalsch = ku;
    if (!z.ersteFalsch[karte.nummer]) z.ersteFalsch[karte.nummer] = ku;
    z.herzen = Math.max(0, z.herzen - 1);
    if (!z.ohneZeit && !z.gestoppt) z.blut = Math.min(100, z.blut + FEHLER_BLUT);
    if (z.herzen <= 0) return zusammenbruch('fehler');
    if (!z.ohneZeit && !z.gestoppt && z.blut >= 100) return zusammenbruch('zeit');
    if (SPERRE_MS) z.sperreBis = Date.now() + SPERRE_MS;
    sichern();
    zeichne();
    var herzEl = leiste.querySelector('.sz-herzen');
    if (herzEl) herzEl.classList.add('sz-wackeln');
    sende();
    zeigeUnten(document.getElementById('sz-rm'));
  }
  function weiter() {
    var ids = kartenDesFalls(z.fall), p = ids.indexOf(z.k);
    if (p < ids.length - 1) zeigeFrage(ids[p + 1]);
    else { z.phase = 'fallende'; sichern(); zeichne(); nachOben(); }
  }
  function zusammenbruch(ursache) {
    z.phase = 'zusammenbruch';
    z.ursache = ursache;
    z.neu = Math.min(99, (z.neu || 0) + 1);
    kartenDesFalls(z.fall).forEach(function (i) { z.geloest[i] = false; });
    sichern();
    zeichne();
    sende();
    nachOben();
  }
  function merkeGeloest() {
    var l = lokal();
    if (!l) return;
    var g = lade(GELOEST, l) || {};
    g[id] = Date.now();
    speichere(GELOEST, g, l);
  }
  function vergissGeloest() {
    var l = lokal();
    if (!l) return;
    var g = lade(GELOEST, l) || {};
    delete g[id];
    speichere(GELOEST, g, l);
  }

  // Blutverlust: läuft nur bei offener Entscheidung, nicht während einer Erklärung und nicht im Hintergrund
  var letzterTakt = Date.now(), letztesSichern = 0;
  setInterval(function () {
    var jetzt = Date.now(), dt = Math.min(1, (jetzt - letzterTakt) / 1000);
    letzterTakt = jetzt;
    if (z.phase !== 'frage') return;
    var gesperrt = z.sperreBis && jetzt < z.sperreBis;
    if (z.sperreBis && !gesperrt) { // Sperre vorbei: Knöpfe wieder freigeben
      z.sperreBis = 0;
      sichern();
      zeichneFrage();
    } else if (gesperrt) {
      var s = document.getElementById('sz-sperre');
      if (s) s.textContent = ersetze(T.sperreText, { x: Math.ceil((z.sperreBis - jetzt) / 1000) });
    }
    if (z.beantwortet || gesperrt || z.ohneZeit || z.gestoppt || document.hidden) return;
    z.blut = Math.min(100, z.blut + (KARTEN[z.k].blutung || 0) * dt);
    aktualisiereBalken();
    if (z.blut >= 100) { zusammenbruch('zeit'); return; }
    if (jetzt - letztesSichern > 1000) { letztesSichern = jetzt; sichern(); }
  }, 200);

  // ---------- Namenseingabe mit Klassenwahl (wie app.js) ----------
  function zeigeName() {
    nameZeile.hidden = false;
    nameZeile.innerHTML = esc(ersetze(A.nameAnzeige, { x: name, y: klasseName(klasse) })) +
      ' · <button type="button" class="link-knopf" id="name-aendern">' + esc(A.nameAendern) + '</button>';
    document.getElementById('name-aendern').addEventListener('click', frageName);
  }
  function frageName() {
    uebungTeil.hidden = true;
    leiste.hidden = true;
    nameZeile.hidden = true;
    nameBereich.hidden = false;
    var klassenHtml = KLASSEN.map(function (k) {
      return '<label class="klasse-wahl"><input type="radio" name="klasse" value="' + esc(k.kuerzel) + '"' +
        (k.kuerzel === klasse ? ' checked' : '') + '><span>' + esc(k.name) + '</span></label>';
    }).join('');
    nameBereich.innerHTML = '<h2>' + esc(A.nameTitel) + '</h2><p>' + fmt(A.nameText) + '</p>' +
      '<form id="name-form" novalidate><label for="name-feld" class="unsichtbar">Name</label>' +
      '<input id="name-feld" type="text" autocomplete="off" autocapitalize="words" spellcheck="false" maxlength="30" placeholder="' + esc(A.nameBeispiel) + '" value="' + esc(name || '') + '">' +
      '<fieldset class="klassen"><legend>' + esc(A.klasseFrage) + '</legend>' + klassenHtml + '</fieldset>' +
      '<p class="name-fehler" id="name-fehler" role="alert" hidden></p>' +
      '<button type="submit" class="knopf">' + esc(A.nameKnopf) + '</button></form>' +
      '<p class="hinweis-klein">' + esc(A.nameDatenschutz) + '</p>';
    var feld = document.getElementById('name-feld');
    document.getElementById('name-form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var n = normalisiereName(feld.value);
      var gewaehlt = nameBereich.querySelector('input[name=klasse]:checked');
      var fe = document.getElementById('name-fehler');
      if (!n) { fe.textContent = A.nameFehler; fe.hidden = false; feld.focus(); return; }
      if (!gewaehlt || !klasseName(gewaehlt.value)) { fe.textContent = A.klasseFehler; fe.hidden = false; return; }
      name = n;
      klasse = gewaehlt.value;
      var l = lokal();
      try { if (l) { l.setItem(NAME, n); l.setItem(KLASSE, klasse); } } catch (e) { /* egal */ }
      nameBereich.hidden = true;
      nameBereich.innerHTML = '';
      uebungTeil.hidden = false;
      zeigeName();
      zeichne();
      sende();
    });
  }

  zeichne();
  if (SERVER) {
    if (name && klasse) { zeigeName(); sende(); } else { frageName(); }
  }
})();

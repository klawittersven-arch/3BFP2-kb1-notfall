/* Beamer-Stunde: Foliensatz mit „Weiter“ und „Zurück“ (Programmlogik – Texte in inhalte_stunde.js).
 *
 * Der Laptop startet einen Raum, zeigt pro Unterrichtsabschnitt eine Folie und schickt jeden
 * Folienwechsel an den Worker. Die Handys folgen automatisch (siehe stunde.js).
 * Tasten: → / Bild↓ / Leertaste = weiter, ← / Bild↑ = zurück, F = Vollbild, Esc = schließen.
 * Probeansicht ohne Internet: beamer.html?demo=1 (erfundene Namen, alles nur in diesem Browser). */
(function () {
  'use strict';

  var K = window.KB1;
  var el = K.element;
  var fmt = K.formatiert;
  var S = window.STUNDE;
  var T = S.beamer;
  var FOLIEN = S.folien;
  var FRAGEN = (INHALTE.entscheidung && INHALTE.entscheidung.fragen) || [];
  var C = window.CONFIG || {};
  var BASIS = String(C.FORTSCHRITT_URL || '').replace(/\/+$/, '');
  var SCHL_RAUM = 'kb1nf_lehrer_raum';
  var SCHL_NAMEN = 'kb1nf_lehrer_namen_aus';
  var demo = K.urlParam('demo') === '1';

  var $ = function (id) { return document.getElementById(id); };
  var raum = null;          // { raum, schluessel, laeuftAb }
  var verbindung = null;
  var stand = null;         // letzter Stand vom Worker (oder Probeansicht)
  var gross = null;         // { folie, index } – vergrößerte Ergebniskarte
  var loesungAn = {};       // folie → true/false
  var namenAus = K.Speicher.dauer.lesen(SCHL_NAMEN) === true;
  var bekannt = {};         // geraeteId → true (für die Einblend-Animation der Namen)
  var qrGross = null, qrMini = null, qrRaum = null;
  var uhrTon = {};          // Uhr-Start → zuletzt angekündigter Abschnitt

  /* ---------- Bühne einpassen ---------- */
  function skalieren() {
    var f = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    $('buehne').style.transform = 'translate(-50%, -50%) scale(' + f + ')';
  }
  window.addEventListener('resize', skalieren);
  skalieren();

  $('kopf-titel').textContent = S.kopfzeile;
  $('kopf-unter').textContent = S.titel;
  document.title = 'Beamer – ' + S.titel;

  /* ---------- Hilfen ---------- */
  function jetzt() { return verbindung ? verbindung.jetzt() : Date.now(); }
  function index() {
    var id = stand && stand.stunde ? stand.stunde.folie : 'start';
    for (var i = 0; i < FOLIEN.length; i++) if (FOLIEN[i].id === id) return i;
    return 0;
  }
  function folie() { return FOLIEN[index()]; }
  function schritt() { return (stand && stand.stunde && stand.stunde.schritt) || 0; }
  function maxSchritt(f) {
    if (f.typ === 'aufstellung') return f.massnahmen.length * 2;
    if (f.typ === 'kausalkette') return f.kette.length + 1;
    return 0;
  }
  function gruppenInfo(nr) { return S.gruppen[nr % S.gruppen.length]; }
  function personenNummer() {
    var n = {};
    (stand && stand.geraete || []).forEach(function (g, i) { n[g.geraeteId] = i + 1; });
    (stand && stand.ohne || []).forEach(function (o, i) { n[o.id] = (stand.geraete.length + i + 1); });
    return n;
  }
  function anzeigeName(id, name) {
    if (!namenAus) return name;
    return K.ersetzen(T.person, { n: personenNummer()[id] || '?' });
  }
  function geraet(id) {
    var g = (stand && stand.geraete) || [];
    for (var i = 0; i < g.length; i++) if (g[i].geraeteId === id) return g[i];
    return null;
  }
  function absatz(text, klasse) { return fmt('p', klasse || 'f-text', text); }
  function punkteListe(liste) {
    var ul = el('ul', 'punkte');
    (liste || []).forEach(function (p) { ul.appendChild(fmt('li', null, p)); });
    return ul;
  }
  function knopf(text, klasse, aktion) {
    var b = el('button', klasse || 'knopf-klein', text);
    b.type = 'button';
    b.addEventListener('click', aktion);
    return b;
  }
  function titel(f, unter) {
    var w = document.createDocumentFragment();
    w.appendChild(fmt('h1', 'f-titel', f.titel));
    if (unter) w.appendChild(fmt('p', 'f-unter', unter));
    return w;
  }

  /* ---------- Worker ---------- */
  function lehrer(typ, daten) {
    daten = daten || {};
    if (demo) { Demo.aktion(typ, daten); zeichnen(); return Promise.resolve(); }
    var koerper = { raum: raum.raum, schluessel: raum.schluessel, typ: typ };
    Object.keys(daten).forEach(function (k) { koerper[k] = daten[k]; });
    return KB1Verbindung.senden(BASIS, '/api/lehrer', koerper).then(function (x) {
      if (x.status === 200 && x.d && x.d.typ === 'beamer') { stand = x.d; zeichnen(); }
      else if (x.status === 404 || x.status === 403) abgelaufen();
    }).catch(function () { $('kopf-punkt').className = 'punkt weg'; });
  }

  function folieSetzen(id, s) {
    // sofort anzeigen, der Worker bestätigt gleich
    if (stand && stand.stunde) { stand.stunde.folie = id; stand.stunde.schritt = s; }
    gross = null;
    zeichnen();
    return lehrer('folie', { folie: id, schritt: s });
  }

  function gehe(i) {
    if (i < 0 || i >= FOLIEN.length) return;
    var f = FOLIEN[i];
    folieSetzen(f.id, 0).then(function () { beimBetreten(f); });
  }

  function beimBetreten(f) {
    if (f.typ === 'murmeln') lehrer('frage', { nr: umstrittenste() });
    if (f.autoUhr && f.uhr) uhrStarten(f);
  }

  function weiter() {
    var f = folie();
    var s = schritt();
    if (s < maxSchritt(f)) { folieSetzen(f.id, s + 1); return; }
    gehe(index() + 1);
  }

  function zurueck() {
    var f = folie();
    var s = schritt();
    if (s > 0) { folieSetzen(f.id, s - 1); return; }
    if (index() > 0) folieSetzen(FOLIEN[index() - 1].id, 0);
  }

  function uhrStarten(f) {
    lehrer('uhr', { uhr: { folie: f.id, segmente: f.uhr } });
  }

  /* ---------- Abstimmung: umstrittenste Frage ---------- */
  function umstrittenste() {
    var r = stand && stand.stimmen && stand.stimmen[1];
    var beste = FRAGEN.length ? FRAGEN[0].nr : null, wert = -1;
    FRAGEN.forEach(function (f) {
      var v = (r && r.fragen[f.nr]) || {};
      var summe = 0, max = 0;
      Object.keys(v).forEach(function (k) { var n = v[k].sicher + v[k].unsicher; summe += n; max = Math.max(max, n); });
      var uneinig = summe ? 1 - max / summe : 0;
      if (uneinig > wert + 1e-9) { wert = uneinig; beste = f.nr; }
    });
    return beste;
  }

  /* ---------- Zeichnen ---------- */
  function zeichnen() {
    if (!stand) return;
    var f = folie();
    var i = index();
    var inhalt = $('inhalt');
    inhalt.textContent = '';
    var bau = {
      start: folieStart, fall: folieFall, abstimmung: folieAbstimmung, ergebnis: folieErgebnis, murmeln: folieMurmeln,
      fahrplan: folieFahrplan, puzzle: foliePuzzle, experten: folieExperten, stamm: folieStamm, fortschritt: folieFortschritt,
      papier: foliePapier, impuls: folieImpuls, aufstellung: folieAufstellung, dialog: folieDialog, kausalkette: folieKausalkette, ende: folieEnde,
      tabelle: folieTabelle, loesung: folieLoesung, info: folieInfo
    }[f.typ] || folieImpuls;
    var wurzel = el('section', 'folie folie-' + f.typ);
    wurzel.setAttribute('data-folie', f.id);
    bau(f, wurzel);
    inhalt.appendChild(wurzel);

    // Kopf
    $('kopf-abschnitt').hidden = !f.abschnitt;
    $('kopf-abschnitt').textContent = f.abschnitt || '';
    $('kopf-raum').hidden = false;
    $('kopf-raum').textContent = '';
    if (raum.probe) $('kopf-raum').appendChild(el('span', 'probe-chip', T.probeChip));
    $('kopf-raum').appendChild(document.createTextNode(T.raumcode + ' '));
    $('kopf-raum').appendChild(el('b', null, raum.raum));
    $('kopf-zaehler').hidden = false;
    var handys = stand.online === 1 ? T.handyEins : K.ersetzen(T.handys, { n: stand.online || 0 });
    $('kopf-handys').textContent = raum.probe ? K.ersetzen(T.handysProbe, { handys: handys, f: Probe.anzahl() }) : handys;

    // Fuß
    $('fuss').hidden = false;
    $('zurueck').textContent = '← ' + T.zurueck;
    $('zurueck').disabled = i === 0 && schritt() === 0;
    $('seitenzahl').textContent = (i + 1) + ' / ' + FOLIEN.length;
    var w = $('weiter');
    w.className = 'weiter';
    w.disabled = false;
    var s = schritt();
    if (s < maxSchritt(f)) {
      if (f.typ === 'aufstellung') w.textContent = s === 0 ? f.naechste : (s % 2 === 1 ? f.zeigen : f.naechste);
      else w.textContent = s === f.kette.length ? f.antwortTitel : f.aufdecken;
    } else if (i < FOLIEN.length - 1) {
      w.textContent = K.ersetzen(T.weiter, { kurz: FOLIEN[i + 1].kurz });
    } else {
      w.textContent = T.letzte;
      w.className = 'weiter letzte';
      w.disabled = true;
    }
    if (f.typ === 'experten' && stand.puzzle && stand.puzzle.alleTeamsFertig) w.className += ' pulsiert';
    $('mini').hidden = f.typ === 'start';
    if (f.typ !== 'start') qrEinsetzen($('mini-qr'), 'mini');
    $('mini-text').textContent = '';
    $('mini-text').appendChild(document.createTextNode('Später dazu? QR-Code scannen · '));
    $('mini-text').appendChild(el('b', null, raum.raum));
    uhrenAktualisieren();
  }

  /* ---------- QR-Code (Handy-Adresse mit Raumcode) ---------- */
  function handyAdresse() {
    return new URL('w2.html?raum=' + raum.raum, location.href).href;
  }
  function qrBauen(groesse) {
    var d = el('div');
    if (typeof QRCode === 'undefined') { d.textContent = handyAdresse(); return d; }
    new QRCode(d, { text: handyAdresse(), width: groesse, height: groesse, correctLevel: QRCode.CorrectLevel.M });
    return d;
  }
  function qrEinsetzen(platz, art) {
    if (qrRaum !== raum.raum) { qrGross = null; qrMini = null; qrRaum = raum.raum; }
    if (art === 'gross') { qrGross = qrGross || qrBauen(440); platz.appendChild(qrGross); }
    else { qrMini = qrMini || qrBauen(140); if (qrMini.parentNode !== platz) { platz.textContent = ''; platz.appendChild(qrMini); } }
  }

  /* ---------- Uhr ---------- */
  function uhrZustand(f) {
    var u = stand && stand.stunde && stand.stunde.uhr;
    var seg = f.uhr || [];
    if (!u || u.folie !== f.id) return { laeuft: false, segmente: seg, nr: 0, rest: seg.length ? seg[0].sek : 0 };
    var vergangen = (jetzt() - u.start) / 1000;
    var summe = 0;
    for (var i = 0; i < u.segmente.length; i++) {
      if (vergangen < summe + u.segmente[i].sek) return { laeuft: true, segmente: u.segmente, nr: i, rest: summe + u.segmente[i].sek - vergangen, start: u.start };
      summe += u.segmente[i].sek;
    }
    return { laeuft: true, um: true, segmente: u.segmente, nr: u.segmente.length - 1, rest: 0, start: u.start };
  }
  function zeitText(sek) {
    sek = Math.max(0, Math.ceil(sek));
    return Math.floor(sek / 60) + ':' + ('0' + (sek % 60)).slice(-2);
  }
  function uhrElement(f, ohneKnoepfe) {
    var box = el('div', 'uhr');
    box.setAttribute('data-uhr', f.id);
    box.appendChild(el('div', 'uhr-label'));
    box.appendChild(el('div', 'uhr-zeit'));
    var segs = el('div', 'uhr-segmente');
    (f.uhr || []).forEach(function () { segs.appendChild(el('span', 'uhr-segment')); });
    if ((f.uhr || []).length > 1) box.appendChild(segs);
    if (!ohneKnoepfe) {
      var k = el('div', 'uhr-knoepfe');
      var z = uhrZustand(f);
      if (!z.laeuft) k.appendChild(knopf(f.uhrKnopf || T.uhrStarten, 'knopf-klein', function () { uhrStarten(f); }));
      else {
        k.appendChild(knopf(T.uhrNeu, 'knopf-klein', function () { uhrStarten(f); }));
        k.appendChild(knopf(T.uhrStoppen, 'knopf-klein', function () { lehrer('uhr', { uhr: null }); }));
      }
      box.appendChild(k);
    }
    return box;
  }
  function uhrenAktualisieren() {
    var f = folie();
    var boxen = document.querySelectorAll('[data-uhr]');
    if (!boxen.length) return;
    var z = uhrZustand(f);
    Array.prototype.forEach.call(boxen, function (box) {
      box.querySelector('.uhr-label').textContent = z.um ? 'Zeit ist um' : (z.segmente[z.nr] ? z.segmente[z.nr].label : '');
      box.querySelector('.uhr-zeit').textContent = zeitText(z.rest);
      box.classList.toggle('um', !!z.um);
      box.classList.toggle('wenig', z.laeuft && !z.um && z.rest <= 30);
      Array.prototype.forEach.call(box.querySelectorAll('.uhr-segment'), function (s, i) {
        s.className = 'uhr-segment' + (z.laeuft && (i < z.nr || z.um) ? ' vorbei' : '') + (z.laeuft && !z.um && i === z.nr ? ' jetzt' : '');
      });
    });
    var jetztEl = document.querySelector('.jetzt-erklaert');
    if (jetztEl) jetztEl.textContent = z.laeuft && !z.um && z.segmente[z.nr] ? K.ersetzen(T.jetztErklaert, { label: z.segmente[z.nr].label }) : '';
    // Ton beim Wechsel eines Abschnitts und am Ende
    if (z.laeuft) {
      var schl = z.start + ':' + f.id;
      var stufe = z.um ? z.segmente.length : z.nr;
      if (uhrTon[schl] === undefined) uhrTon[schl] = stufe;
      else if (uhrTon[schl] !== stufe) { uhrTon[schl] = stufe; gong(); }
    }
  }
  var audio = null;
  function gong() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      var o = audio.createOscillator(), g = audio.createGain();
      o.type = 'sine'; o.frequency.value = 660;
      g.gain.setValueAtTime(0.0001, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.25, audio.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 1.2);
      o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime + 1.25);
    } catch (e) { /* ohne Ton */ }
  }
  setInterval(uhrenAktualisieren, 250);

  /* ---------- Folien ---------- */
  function folieStart(f, w) {
    var box = el('div', 'start');
    var karte = el('div', 'qr-karte');
    var qr = el('div', 'qr-gross');
    qrEinsetzen(qr, 'gross');
    karte.appendChild(qr);
    var r = el('div', 'qr-raum');
    r.appendChild(document.createTextNode(T.raumcode + ' '));
    r.appendChild(el('b', null, raum.raum));
    karte.appendChild(r);
    karte.appendChild(el('div', 'qr-adresse', handyAdresse().replace(/^https?:\/\//, '')));
    box.appendChild(karte);
    var rechts = el('div');
    rechts.appendChild(fmt('h1', 'f-titel', f.titel));
    var ol = el('ol', 'schritte');
    f.schritte.forEach(function (s) { ol.appendChild(fmt('li', null, s)); });
    rechts.appendChild(ol);
    var g = stand.geraete || [];
    rechts.appendChild(el('p', 'dabei', K.ersetzen(T.schonDabei, { n: g.length })));
    var namen = el('div', 'namen');
    g.forEach(function (x) {
      var c = el('span', 'name-chip' + (bekannt[x.geraeteId] ? '' : ' neu'), anzeigeName(x.geraeteId, x.name));
      bekannt[x.geraeteId] = true;
      namen.appendChild(c);
    });
    rechts.appendChild(namen);
    box.appendChild(rechts);
    w.appendChild(box);
  }

  function folieFall(f, w) {
    w.appendChild(titel(f));
    var box = el('div', 'fall');
    var karte = el('div', 'fall-karte');
    karte.appendChild(fmt('p', null, f.einleitung));
    karte.appendChild(fmt('p', 'zitat', f.zitat));
    karte.appendChild(el('p', 'zitat-wer', '– ' + f.zitatWer));
    box.appendChild(karte);
    var b = el('div', 'blase');
    b.appendChild(el('div', 'blase-label', 'Leitfrage'));
    b.appendChild(fmt('div', null, f.leitfrage));
    box.appendChild(b);
    w.appendChild(box);
  }

  function folieAbstimmung(f, w) {
    w.appendChild(titel(f, f.unter));
    w.appendChild(punkteListe(f.punkte));
    var r = (stand.stimmen && stand.stimmen[f.runde]) || { n: 0 };
    var y = (stand.geraete || []).length;
    w.appendChild(el('div', 'zaehl-gross', K.ersetzen(f.zaehler, { x: r.n, y: y })));
    var b = el('div', 'balken-gross');
    var s = el('span');
    s.style.width = (y ? Math.min(100, Math.round(100 * r.n / y)) : 0) + '%';
    b.appendChild(s);
    w.appendChild(b);
  }

  // Eine Abstimmungskarte; runden = [1] oder [1, 2]
  function abstKarte(frage, runden, loesung, istGross, stern) {
    var karte = el('section', 'abst-frage' + (istGross ? ' gross' : '') + (stern ? ' stern' : ''));
    if (stern && !istGross) karte.appendChild(el('span', 'abst-stern', T.groessteUneinigkeit));
    karte.appendChild(el('h2', null, frage.nr + ' · ' + frage.frage));
    var tab = el('div', 'abst-raster' + (runden.length === 1 ? ' eine' : ''));
    tab.appendChild(el('span', 'abst-kopf', ''));
    runden.forEach(function (r) { tab.appendChild(el('span', 'abst-kopf', r === 1 ? T.runde1 : T.runde2)); });
    frage.optionen.forEach(function (o) {
      var k = o.charAt(0);
      var richtig = loesung && k === frage.richtig;
      tab.appendChild(el('span', 'abst-option' + (richtig ? ' richtig' : ''), (richtig ? '✓ ' : '') + o));
      runden.forEach(function (rn) {
        var r = (stand.stimmen && stand.stimmen[rn]) || { n: 0, fragen: {} };
        var werte = (r.fragen[frage.nr] && r.fragen[frage.nr][k]) || { sicher: 0, unsicher: 0 };
        var n = werte.sicher + werte.unsicher;
        var zelle = el('span', 'abst-zelle');
        var spur = el('span', 'abst-spur');
        var balken = el('span', 'abst-balken' + (richtig ? ' richtig' : ''));
        balken.style.width = Math.round(100 * n / (r.n || 1)) + '%';
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
    if (loesung) karte.appendChild(el('p', 'abst-erklaerung', frage.erklaerung));
    return karte;
  }

  function folieErgebnis(f, w) {
    var runden = f.runde === 2 ? [1, 2] : [1];
    var loesung = loesungAn[f.id] !== undefined ? loesungAn[f.id] : !!f.loesung;
    var kopf = el('div', 'ergebnis-kopf');
    kopf.appendChild(fmt('h1', 'f-titel', f.titel));
    kopf.appendChild(fmt('p', 'f-unter', f.unter));
    if (f.runde === 2) kopf.appendChild(knopf(loesung ? T.loesungVerbergen : T.loesungZeigen, 'knopf-klein', function () { loesungAn[f.id] = !loesung; zeichnen(); }));
    w.appendChild(kopf);
    var stern = f.runde === 1 ? umstrittenste() : null;
    if (gross && gross.folie === f.id && FRAGEN[gross.index]) {
      var wrap = el('div', 'gross-wrap');
      var k = abstKarte(FRAGEN[gross.index], runden, loesung, true, false);
      k.addEventListener('click', function () { gross = null; zeichnen(); });
      wrap.appendChild(k);
      var nav = el('div', 'abst-nav');
      var a = knopf(T.vorherigeFrage, 'knopf-klein', function () { gross.index--; zeichnen(); });
      a.disabled = gross.index === 0;
      var b = knopf(T.naechsteFrage, 'knopf-klein', function () { gross.index++; zeichnen(); });
      b.disabled = gross.index === FRAGEN.length - 1;
      nav.appendChild(a);
      nav.appendChild(knopf(T.alleFragen, 'knopf-klein', function () { gross = null; zeichnen(); }));
      nav.appendChild(b);
      wrap.appendChild(nav);
      w.appendChild(wrap);
      return;
    }
    var r1 = stand.stimmen && stand.stimmen[1];
    if (!r1 || !r1.n) { w.appendChild(absatz(T.keineStimmen)); return; }
    var raster = el('div', 'abst ohne-erklaerung' + (runden.length === 2 ? ' zwei' : ''));
    FRAGEN.forEach(function (fr, i) {
      var k = abstKarte(fr, runden, loesung, false, fr.nr === stern);
      k.addEventListener('click', function () { gross = { folie: f.id, index: i }; zeichnen(); });
      raster.appendChild(k);
    });
    w.appendChild(raster);
  }

  function folieMurmeln(f, w) {
    var nr = (stand.stunde && stand.stunde.frage) || umstrittenste();
    var i = 0;
    FRAGEN.forEach(function (fr, j) { if (fr.nr === nr) i = j; });
    var box = el('div', 'murmeln');
    var links = el('div', 'gross-wrap');
    if (FRAGEN[i]) links.appendChild(abstKarte(FRAGEN[i], [1], false, true, false));
    var nav = el('div', 'abst-nav');
    var a = knopf(T.vorherigeFrage, 'knopf-klein', function () { lehrer('frage', { nr: FRAGEN[i - 1].nr }); });
    a.disabled = i === 0;
    var b = knopf(T.naechsteFrage, 'knopf-klein', function () { lehrer('frage', { nr: FRAGEN[i + 1].nr }); });
    b.disabled = i === FRAGEN.length - 1;
    nav.appendChild(a); nav.appendChild(b);
    links.appendChild(nav);
    box.appendChild(links);
    var rechts = el('div', 'murmeln-rechts');
    rechts.appendChild(fmt('h1', 'f-titel', f.titel));
    rechts.appendChild(fmt('p', 'murmeln-text', f.text));
    rechts.appendChild(uhrElement(f));
    box.appendChild(rechts);
    w.appendChild(box);
  }

  function folieFahrplan(f, w) {
    w.appendChild(titel(f));
    w.appendChild(fmt('p', 'impuls', f.impuls));
    w.appendChild(fmt('p', 'lernziel', '🎯 ' + f.lernziel));
    var plan = el('div', 'plan');
    f.plan.forEach(function (p) {
      var s = el('div', 'plan-schritt');
      s.appendChild(el('div', 'plan-emoji', p.emoji));
      s.appendChild(el('div', 'plan-text', p.text));
      s.appendChild(el('div', 'plan-zeit', p.zeit));
      plan.appendChild(s);
    });
    w.appendChild(plan);
  }

  function buchstabe(b, klein) { return el('span', 'buchstabe ' + b + (klein ? ' klein' : ''), b); }

  // Karten der Stammgruppen. art: 'einteilen' (Name anklicken = verschieben), 'stamm' (Haken), Seite (Fortschritt)
  function gruppenKarten(art) {
    var p = stand.puzzle;
    var raster = el('div', 'gruppen' + (p.gruppen.length <= 4 ? ' wenige' : ''));
    p.gruppen.forEach(function (g) {
      var info = gruppenInfo(g.nr);
      var karte = el('div', 'g-karte' + (art === 'stamm' && g.fertig ? ' fertig' : ''));
      karte.style.setProperty('--farbe', info.farbe);
      var kopf = el('div', 'g-kopf');
      kopf.appendChild(el('span', 'g-emoji', info.emoji));
      kopf.appendChild(el('span', 'g-name', info.name));
      if (art === 'stamm') {
        var mitHandy = g.mitglieder.filter(function (m) { return !m.ohneHandy; });
        var fertige = mitHandy.filter(function (m) { return m.fertig; }).length;
        kopf.appendChild(el('span', 'g-status', g.fertig ? '✓' : fertige + '/' + mitHandy.length));
      } else kopf.appendChild(el('span', 'g-status', g.mitglieder.length + ' 👤'));
      karte.appendChild(kopf);
      if (art === 'stamm' && g.fertig) karte.appendChild(el('div', 'fertig-band', '✓ ' + T.gruppeFertig));
      var ul = el('ul', 'g-mitglieder');
      g.mitglieder.slice().sort(function (a, b) { return a.rolle < b.rolle ? -1 : a.rolle > b.rolle ? 1 : 0; }).forEach(function (m) {
        var li = el('li', 'g-mitglied' + (m.online || Probe.ist(m.id) ? '' : ' offline'));
        var inhalt = art === 'einteilen' ? el('button') : li;
        if (art === 'einteilen') {
          inhalt.type = 'button';
          inhalt.title = S.folien[index()].verschiebenTipp || '';
          inhalt.addEventListener('click', function () { lehrer('verschieben', { id: m.id }); });
          li.appendChild(inhalt);
        }
        inhalt.appendChild(buchstabe(m.rolle, true));
        inhalt.appendChild(el('span', null, anzeigeName(m.id, m.name)));
        if (m.ohneHandy) inhalt.appendChild(el('span', 'ohne', T.ohneHandyKurz));
        if (art === 'stamm' && m.fertig) inhalt.appendChild(el('span', 'haken', '✓'));
        if (art !== 'einteilen' && art !== 'stamm') fortschrittBalken(inhalt, m.id, art);
        ul.appendChild(li);
      });
      karte.appendChild(ul);
      raster.appendChild(karte);
    });
    return raster;
  }

  function fortschrittBalken(platz, id, seite) {
    var g = geraet(id);
    var s = g && g.seiten && g.seiten[seite];
    var b = el('span', 'g-balken');
    var i = el('span', s && s.status === 'fertig' ? 'fertig' : '');
    i.style.width = s ? Math.round(100 * s.geloest / s.gesamt) + '%' : '0%';
    b.appendChild(i);
    platz.appendChild(b);
    platz.appendChild(el('span', 'g-zahl', s ? (s.status === 'fertig' ? '✓' : s.geloest + '/' + s.gesamt) : '–'));
  }

  function folieePuzzleKnoepfe(f, w, eingeteilt) {
    var reihe = el('div', 'knopf-reihe');
    reihe.appendChild(knopf(eingeteilt ? f.neuEinteilen : f.einteilen, eingeteilt ? 'knopf-klein' : 'knopf-gross', function () {
      if (eingeteilt) frage(f.neuFrage, [[T.abbrechen, null], [T.ja, true]]).then(function (ja) { if (ja) lehrer('einteilen'); });
      else lehrer('einteilen');
    }));
    reihe.appendChild(knopf(f.ohneHandy, 'knopf-klein', function () {
      eingabe(f.ohneHandyFrage).then(function (name) { if (name) lehrer('ohneHandy', { name: name }); });
    }));
    if (eingeteilt) reihe.appendChild(el('span', 'tipp', f.verschiebenTipp));
    else reihe.appendChild(el('span', 'tipp', K.ersetzen(T.schonDabei, { n: (stand.geraete || []).length + (stand.ohne || []).length })));
    w.appendChild(reihe);
  }

  function foliePuzzle(f, w) {
    w.appendChild(titel(f));
    var eingeteilt = !!(stand.puzzle && stand.puzzle.gruppen.length);
    if (!eingeteilt) {
      var ablauf = el('div', 'puzzle-ablauf');
      f.schritte.forEach(function (s, i) {
        var b = el('div', i === 1 ? 'puzzle-pfeil' : 'puzzle-schritt');
        b.appendChild(el('div', 'emoji', s.emoji));
        if (i === 1) { b.appendChild(el('div', null, s.titel)); ablauf.appendChild(b); return; }
        b.appendChild(el('h3', null, s.titel));
        b.appendChild(fmt('p', null, s.text));
        if (s.zeit) b.appendChild(el('div', 'zeit', s.zeit));
        ablauf.appendChild(b);
      });
      w.appendChild(ablauf);
      var rollen = el('div', 'rollen-zeile');
      ['A', 'B', 'C'].forEach(function (b) {
        var r = el('span', 'rolle');
        r.appendChild(buchstabe(b));
        r.appendChild(el('span', null, S.rollen[b].form));
        rollen.appendChild(r);
      });
      w.appendChild(rollen);
      folieePuzzleKnoepfe(f, w, false);
      return;
    }
    folieePuzzleKnoepfe(f, w, true);
    var abstand = el('div');
    abstand.style.height = '16px';
    w.appendChild(abstand);
    w.appendChild(gruppenKarten('einteilen'));
  }

  function nichtEingeteilt(w) {
    w.appendChild(absatz(T.nochNichtEingeteilt));
  }

  function folieExperten(f, w) {
    w.appendChild(titel(f));
    var p = stand.puzzle;
    var box = el('div', 'seite-mit-uhr');
    var links = el('div');
    links.appendChild(fmt('p', 'f-text', f.text));
    if (!p || !p.teams.length) { nichtEingeteilt(links); }
    else {
      var fertig = p.teams.filter(function (t) { return t.fertig; }).length;
      var st = el('div', 'status-zeile');
      st.appendChild(el('span', 'status-zahl', K.ersetzen(T.teamsFertig, { x: fertig, y: p.teams.length })));
      if (p.alleTeamsFertig) st.appendChild(el('span', 'hinweis-band', f.alleFertig));
      links.appendChild(st);
      var teams = el('div', 'teams');
      p.teams.forEach(function (t) {
        var k = el('div', 't-karte ' + t.b + (t.fertig ? ' fertig' : ''));
        var kopf = el('div', 't-kopf');
        kopf.appendChild(buchstabe(t.b));
        kopf.appendChild(el('span', 't-name', t.id));
        var mitHandy = t.mitglieder.filter(function (m) { return !m.ohneHandy; });
        kopf.appendChild(el('span', 't-status', t.fertig ? '✓' : mitHandy.filter(function (m) { return m.fertig; }).length + '/' + mitHandy.length));
        k.appendChild(kopf);
        if (t.fertig) k.appendChild(el('div', 'fertig-band', '✓ ' + T.teamFertig));
        var ul = el('ul', 'g-mitglieder');
        t.mitglieder.forEach(function (m) {
          var li = el('li', 'g-mitglied' + (m.online || Probe.ist(m.id) ? '' : ' offline'));
          li.appendChild(el('span', null, anzeigeName(m.id, m.name)));
          if (m.ohneHandy) li.appendChild(el('span', 'ohne', T.ohneHandyKurz));
          if (m.fertig) li.appendChild(el('span', 'haken', '✓'));
          else if (!m.ohneHandy) fortschrittBalken(li, m.id, 'w2-markieren');
          ul.appendChild(li);
        });
        k.appendChild(ul);
        teams.appendChild(k);
      });
      links.appendChild(teams);
    }
    box.appendChild(links);
    var rechts = el('div');
    rechts.appendChild(uhrElement(f));
    var aufl = el('ol', 'auftraege');
    f.auftraege.forEach(function (a) { aufl.appendChild(fmt('li', null, a)); });
    var abst = el('div');
    abst.style.height = '18px';
    rechts.appendChild(abst);
    rechts.appendChild(aufl);
    box.appendChild(rechts);
    w.appendChild(box);
  }

  function folieStamm(f, w) {
    w.appendChild(titel(f));
    var p = stand.puzzle;
    var box = el('div', 'seite-mit-uhr');
    var links = el('div');
    links.appendChild(fmt('p', 'f-text', f.text));
    if (!p || !p.gruppen.length) nichtEingeteilt(links);
    else {
      var fertig = p.gruppen.filter(function (g) { return g.fertig; }).length;
      var st = el('div', 'status-zeile');
      st.appendChild(el('span', 'status-zahl', K.ersetzen(T.gruppenFertig, { x: fertig, y: p.gruppen.length })));
      links.appendChild(st);
      links.appendChild(gruppenKarten('stamm'));
    }
    box.appendChild(links);
    var rechts = el('div');
    rechts.appendChild(uhrElement(f));
    var j = el('div', 'jetzt-erklaert');
    j.style.marginTop = '18px';
    rechts.appendChild(j);
    box.appendChild(rechts);
    w.appendChild(box);
  }

  // Fortschritt einer Übung: Auftrag oben (Text) bzw. rechts (Stichpunkte), darunter je Stammgruppe oder je Person
  function folieFortschritt(f, w) {
    w.appendChild(titel(f));
    if (f.text) w.appendChild(fmt('p', 'f-text', f.text));
    var box = el('div', f.punkte ? 'seite-mit-punkten' : '');
    var links = el('div');
    var p = stand.puzzle;
    var g = stand.geraete || [];
    var fertig = g.filter(function (x) { return x.seiten && x.seiten[f.seite] && x.seiten[f.seite].status === 'fertig'; }).length;
    var st = el('div', 'status-zeile');
    st.appendChild(el('span', 'status-zahl', K.ersetzen(T.personFertig, { x: fertig, y: g.length })));
    links.appendChild(st);
    if (f.jeGruppe && p && p.gruppen.length) links.appendChild(gruppenKarten(f.seite));
    else {
      var liste = el('div', 'personen');
      g.forEach(function (x) {
        var z = el('div', 'p-zeile');
        z.appendChild(el('span', 'p-name', anzeigeName(x.geraeteId, x.name)));
        fortschrittBalken(z, x.geraeteId, f.seite);
        liste.appendChild(z);
      });
      links.appendChild(liste);
    }
    box.appendChild(links);
    if (f.punkte) box.appendChild(punkteListe(f.punkte));
    w.appendChild(box);
  }

  function foliePapier(f, w) {
    w.appendChild(titel(f));
    if (!f.uhr) { w.appendChild(punkteListe(f.punkte)); return; }
    var box = el('div', 'seite-mit-uhr');
    var links = el('div');
    links.appendChild(punkteListe(f.punkte));
    box.appendChild(links);
    var rechts = el('div');
    rechts.appendChild(uhrElement(f));
    box.appendChild(rechts);
    w.appendChild(box);
  }

  function folieImpuls(f, w) {
    var box = el('div', 'impuls-gross');
    box.appendChild(fmt('h1', 'f-titel', f.titel));
    if (f.text) box.appendChild(fmt('p', 'f-text', f.text));
    if (f.uhr) box.appendChild(uhrElement(f));
    w.appendChild(box);
  }

  function folieAufstellung(f, w) {
    w.appendChild(titel(f));
    var s = schritt();
    var nr = Math.ceil(s / 2);              // 1 … n
    var loesung = s > 0 && s % 2 === 0;
    var m = nr ? f.massnahmen[nr - 1] : null;
    var ecken = el('div', 'ecken');
    f.ecken.forEach(function (e, i) {
      var k = el('div', 'ecke' + (loesung ? (i === m.ecke ? ' richtig' : ' blass') : ''));
      k.appendChild(el('span', 'emoji', e.emoji));
      k.appendChild(document.createTextNode(e.text));
      ecken.appendChild(k);
    });
    w.appendChild(ecken);
    if (!m) { w.appendChild(fmt('p', 'f-text', f.text)); return; }
    var box = el('div', 'massnahme');
    box.appendChild(el('div', 'massnahme-nr', 'Maßnahme ' + nr + ' von ' + f.massnahmen.length));
    box.appendChild(el('div', 'massnahme-text', m.text));
    if (loesung) box.appendChild(el('div', 'massnahme-warum', f.ecken[m.ecke].emoji + ' ' + m.warum));
    w.appendChild(box);
  }

  function folieDialog(f, w) {
    w.appendChild(titel(f));
    var box = el('div', 'seite-mit-uhr');
    var links = el('div');
    var bl = el('div', 'dialog-blasen');
    f.sprecher.forEach(function (sp) {
      var b = el('div', 'sprechblase');
      b.appendChild(el('div', 'wer', '💬 ' + sp.wer));
      b.appendChild(el('div', 'was', sp.text));
      bl.appendChild(b);
    });
    links.appendChild(bl);
    links.appendChild(punkteListe(f.punkte));
    box.appendChild(links);
    var rechts = el('div');
    rechts.appendChild(uhrElement(f));
    box.appendChild(rechts);
    w.appendChild(box);
  }

  function folieKausalkette(f, w) {
    w.appendChild(titel(f));
    var s = schritt();
    var kette = el('div', 'kette');
    f.kette.forEach(function (g, i) {
      var b = el('div', 'glied' + (i < s ? '' : ' verdeckt'));
      b.appendChild(el('div', 'glied-titel', g.titel));
      b.appendChild(el('div', 'glied-text', g.text));
      kette.appendChild(b);
    });
    w.appendChild(kette);
    if (s > f.kette.length) {
      var a = el('div', 'antwort-karte');
      a.appendChild(el('h3', null, f.antwortTitel));
      a.appendChild(fmt('div', null, f.antwort));
      w.appendChild(a);
    }
  }

  function folieEnde(f, w) {
    var box = el('div', 'impuls-gross');
    box.appendChild(fmt('h1', 'f-titel', f.titel));
    box.appendChild(fmt('p', 'f-text', f.text));
    box.appendChild(fmt('p', 'ende-frei', f.frei));
    w.appendChild(box);
  }

  /* ---------- Aufdecken (Tabelle sichern, Musterlösungen) ----------
     Welche Zellen aufgedeckt sind, merkt sich der Laptop je Raum (übersteht Neuladen). */
  var SCHL_AUFGEDECKT = 'kb1nf_lehrer_aufgedeckt';
  function aufgedeckt() {
    var a = K.Speicher.dauer.lesen(SCHL_AUFGEDECKT);
    return a && raum && a.raum === raum.raum ? a : { raum: raum ? raum.raum : '', zellen: {} };
  }
  function aufdeckenSetzen(schluessel, wert) {
    var a = aufgedeckt();
    if (Array.isArray(schluessel)) schluessel.forEach(function (x) { a.zellen[x] = wert; }); else a.zellen[schluessel] = wert;
    K.Speicher.dauer.schreiben(SCHL_AUFGEDECKT, a);
    zeichnen();
  }
  function aufdeckZelle(schluessel, inhalt, klasse) {
    var offen = !!aufgedeckt().zellen[schluessel];
    var b = el('button', 'aufdeck ' + (klasse || '') + (offen ? ' offen' : ''));
    b.type = 'button';
    b.setAttribute('data-aufdeck', schluessel);
    if (offen) b.appendChild(fmt('span', null, inhalt)); else b.appendChild(el('span', 'verdeckt', T.verdeckt));
    b.addEventListener('click', function () { aufdeckenSetzen(schluessel, !offen); });
    return b;
  }
  function aufdeckKnoepfe(f, alle) {
    var r = el('div', 'knopf-reihe aufdeck-knoepfe');
    r.appendChild(el('span', 'tipp', f.tipp || ''));
    r.appendChild(knopf(T.alleAufdecken, 'knopf-klein', function () { aufdeckenSetzen(alle, true); }));
    r.appendChild(knopf(T.alleVerdecken, 'knopf-klein', function () { aufdeckenSetzen(alle, false); }));
    return r;
  }

  // Vergleichstabelle wie auf dem Arbeitsblatt; Zelle anklicken = Lösung aufdecken
  function folieTabelle(f, w) {
    var NL = window.NACHLESEN || {};
    var kopf = el('div', 'ergebnis-kopf');
    kopf.appendChild(fmt('h1', 'f-titel', f.titel));
    kopf.appendChild(fmt('p', 'f-unter', f.text));
    w.appendChild(kopf);
    var alle = [];
    var tab = el('div', 'vergleich');
    ['', 'A hypovolämisch', 'B anaphylaktisch', 'C neurogen'].forEach(function (t, i) {
      var z = el('div', 'v-kopf' + (i ? ' ' + 'ABC'.charAt(i - 1) : ''), t);
      tab.appendChild(z);
    });
    (NL.vergleich || []).forEach(function (zeile, r) {
      tab.appendChild(el('div', 'v-zeilenkopf', zeile[0]));
      for (var c = 1; c <= 3; c++) {
        var schl = f.id + ':' + r + ':' + c;
        alle.push(schl);
        tab.appendChild(aufdeckZelle(schl, zeile[c], 'v-zelle'));
      }
    });
    tab.appendChild(el('div', 'v-zeilenkopf', 'Gemeinsamkeit'));
    var g = aufdeckZelle(f.id + ':gemeinsam', NL.gemeinsamkeit || '', 'v-zelle v-breit');
    alle.push(f.id + ':gemeinsam');
    tab.appendChild(g);
    w.appendChild(tab);
    w.appendChild(aufdeckKnoepfe(f, alle));
  }

  // Musterlösung zu Klausuraufgaben; jede Zeile einzeln aufdecken
  function folieLoesung(f, w) {
    var NL = window.NACHLESEN || {};
    w.appendChild(titel(f));
    var alle = [];
    var box = el('div', 'loesungen');
    (f.aufgaben || []).forEach(function (nr) {
      var a = (NL.aufgaben || {})[nr] || {};
      var teil = el('section', 'loesung-teil');
      var kopf = el('p', 'loesung-aufgabe');
      kopf.appendChild(el('strong', null, nr + ' '));
      kopf.appendChild(document.createTextNode(a.text || ''));
      if (a.punkte) kopf.appendChild(el('span', 'loesung-punkte', ' (' + a.punkte + ' P.)'));
      teil.appendChild(kopf);
      ((NL.loesungen || {})[nr] || []).forEach(function (zeile, i) {
        var schl = f.id + ':' + nr + ':' + i;
        alle.push(schl);
        teil.appendChild(aufdeckZelle(schl, zeile, 'l-zeile'));
      });
      box.appendChild(teil);
    });
    w.appendChild(box);
    w.appendChild(aufdeckKnoepfe(f, alle));
  }

  // Erklärfolie: was kommt – und warum
  function folieInfo(f, w) {
    var box = el('div', 'info-folie');
    var links = el('div');
    links.appendChild(titel(f, f.unter));
    links.appendChild(punkteListe(f.punkte));
    box.appendChild(links);
    var rechts = el('div', 'info-rechts');
    if (f.emoji) rechts.appendChild(el('div', 'info-emoji', f.emoji));
    if (f.warum) {
      var wb = el('div', 'warum-box');
      wb.appendChild(el('h2', null, f.warumTitel || ''));
      var ul = el('ul');
      f.warum.forEach(function (x) { ul.appendChild(fmt('li', null, x)); });
      wb.appendChild(ul);
      rechts.appendChild(wb);
    }
    box.appendChild(rechts);
    w.appendChild(box);
  }

  /* ---------- Menü und kleine Dialoge ---------- */
  function ebeneZeigen(karte) {
    var e = $('ebene');
    e.textContent = '';
    e.appendChild(karte);
    e.hidden = false;
  }
  function ebeneZu() { $('ebene').hidden = true; $('ebene').textContent = ''; }
  $('ebene').addEventListener('click', function (ev) { if (ev.target === $('ebene')) ebeneZu(); });

  function frage(text, knoepfe) {
    return new Promise(function (ok) {
      var k = el('div', 'ebene-karte dialog-karte');
      k.appendChild(el('p', null, text));
      var r = el('div', 'ebene-knoepfe');
      knoepfe.forEach(function (x, i) {
        r.appendChild(knopf(x[0], i === knoepfe.length - 1 ? 'knopf-gross' : 'knopf-klein', function () { ebeneZu(); ok(x[1]); }));
      });
      k.appendChild(r);
      ebeneZeigen(k);
    });
  }
  function eingabe(text) {
    return new Promise(function (ok) {
      var k = el('form', 'ebene-karte dialog-karte');
      k.appendChild(el('p', null, text));
      var i = el('input');
      i.maxLength = 20;
      k.appendChild(i);
      var r = el('div', 'ebene-knoepfe');
      r.appendChild(knopf(T.abbrechen, 'knopf-klein', function () { ebeneZu(); ok(null); }));
      var los = el('button', 'knopf-gross', T.ok);
      los.type = 'submit';
      r.appendChild(los);
      k.appendChild(r);
      k.addEventListener('submit', function (ev) { ev.preventDefault(); var n = i.value.trim(); ebeneZu(); ok(n || null); });
      ebeneZeigen(k);
      i.focus();
    });
  }

  function menue() {
    var k = el('div', 'ebene-karte');
    k.appendChild(el('h2', null, T.menueTitel));
    var liste = el('div', 'menue-folien');
    FOLIEN.forEach(function (f, i) {
      var b = el('button', 'menue-folie' + (i === index() ? ' aktiv' : ''));
      b.type = 'button';
      b.appendChild(el('small', null, (i + 1) + ' · ' + (f.abschnitt || '')));
      b.appendChild(document.createTextNode(f.kurz));
      b.addEventListener('click', function () { ebeneZu(); gehe(i); });
      liste.appendChild(b);
    });
    k.appendChild(liste);
    var r = el('div', 'ebene-knoepfe');
    r.appendChild(knopf(T.menueVollbild, 'knopf-klein', function () { ebeneZu(); vollbild(); }));
    r.appendChild(knopf(namenAus ? T.menueNamenZeigen : T.menueNamen, 'knopf-klein', function () {
      namenAus = !namenAus; K.Speicher.dauer.schreiben(SCHL_NAMEN, namenAus); ebeneZu(); zeichnen();
    }));
    r.appendChild(knopf(T.menueTeilnehmende, 'knopf-klein', function () { teilnehmende(); }));
    if (!demo) r.appendChild(knopf(T.menueNeuerRaum, 'knopf-klein', function () {
      frage(T.neuerRaumFrage, [[T.abbrechen, false], [T.ja, true]]).then(function (ja) { if (ja) raumStarten(false); });
    }));
    if (!demo) r.appendChild(knopf(T.menueProbe, 'knopf-klein', function () {
      frage(T.probeFrage, [[T.abbrechen, false], [T.ja, true]]).then(function (ja) { if (ja) raumStarten(true); });
    }));
    k.appendChild(r);
    k.appendChild(el('p', 'tipp', T.tastenTipp));
    ebeneZeigen(k);
  }

  function teilnehmende() {
    var k = el('div', 'ebene-karte');
    k.appendChild(el('h2', null, T.menueTeilnehmende));
    var ul = el('ul', 'tn-liste');
    var alle = (stand.geraete || []).map(function (g) { return { id: g.geraeteId, name: g.name, ohne: false }; })
      .concat((stand.ohne || []).map(function (o) { return { id: o.id, name: o.name, ohne: true }; }));
    alle.forEach(function (p) {
      var li = el('li');
      li.appendChild(el('span', null, p.name + (p.ohne ? ' (' + T.ohneHandyKurz + ')' : '')));
      li.appendChild(knopf(T.entfernen, null, function () {
        frage(K.ersetzen(T.entfernenFrage, { name: p.name }), [[T.abbrechen, false], [T.entfernen, true]]).then(function (ja) {
          if (ja) lehrer('entfernen', { id: p.id }).then(teilnehmende); else teilnehmende();
        });
      }));
      ul.appendChild(li);
    });
    k.appendChild(ul);
    var r = el('div', 'ebene-knoepfe');
    r.appendChild(knopf(FOLIEN.filter(function (f) { return f.typ === 'puzzle'; })[0].ohneHandy, 'knopf-klein', function () {
      eingabe(FOLIEN.filter(function (f) { return f.typ === 'puzzle'; })[0].ohneHandyFrage).then(function (name) { if (name) lehrer('ohneHandy', { name: name }).then(teilnehmende); else teilnehmende(); });
    }));
    r.appendChild(knopf(T.ok, 'knopf-gross', ebeneZu));
    k.appendChild(r);
    ebeneZeigen(k);
  }

  function vollbild() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } catch (e) { /* nicht möglich */ }
  }

  $('weiter').addEventListener('click', weiter);
  $('zurueck').addEventListener('click', zurueck);
  $('menue-knopf').addEventListener('click', menue);
  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (!stand) return;
    if (e.key === 'Escape') { if (!$('ebene').hidden) ebeneZu(); else if (gross) { gross = null; zeichnen(); } return; }
    if (!$('ebene').hidden) return;
    if (gross && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      var n = gross.index + (e.key === 'ArrowRight' ? 1 : -1);
      if (n >= 0 && n < FRAGEN.length) { gross.index = n; zeichnen(); }
      e.preventDefault();
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); weiter(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); zurueck(); }
    else if (e.key === 'f' || e.key === 'F') vollbild();
  });

  /* ---------- Raum ---------- */
  function startBildschirm(meldung) {
    $('fuss').hidden = true;
    $('kopf-abschnitt').hidden = true;
    $('kopf-raum').hidden = true;
    $('kopf-zaehler').hidden = true;
    var inhalt = $('inhalt');
    inhalt.textContent = '';
    var box = el('div', 'start-raum');
    var k = el('div', 'karte');
    k.appendChild(el('h1', 'f-titel', S.titel));
    k.appendChild(el('p', 'f-text', T.startText));
    var fehler = el('p', 'fehler', meldung || (BASIS ? '' : T.nichtEingerichtet));
    k.appendChild(fehler);
    var b = knopf(T.starten, 'knopf-gross', function () { raumStarten(false); });
    b.id = 'starten';
    b.disabled = !BASIS;
    k.appendChild(b);
    var probe = el('div', 'probe-start');
    var pb = knopf(T.probeStarten, 'knopf-klein', function () { raumStarten(true); });
    pb.id = 'probe-starten';
    pb.disabled = !BASIS;
    probe.appendChild(pb);
    probe.appendChild(el('p', 'tipp', T.probeText));
    k.appendChild(probe);
    box.appendChild(k);
    inhalt.appendChild(box);
  }

  function raumStarten(probe) {
    if (verbindung) { verbindung.stopp(); verbindung = null; }
    Probe.stopp();
    KB1Verbindung.senden(BASIS, '/api/raum', {}).then(function (x) {
      if (x.status !== 200 || !x.d.ok) { startBildschirm(T.startFehler); return; }
      raum = { raum: x.d.raum, schluessel: x.d.schluessel, laeuftAb: x.d.laeuftAb, probe: !!probe };
      K.Speicher.dauer.schreiben(SCHL_RAUM, raum);
      bekannt = {};
      if (probe) Probe.starten(true);
      verbinden();
    }).catch(function () { startBildschirm(T.startFehler); });
  }

  function abgelaufen() {
    if (verbindung) { verbindung.stopp(); verbindung = null; }
    Probe.stopp();
    K.Speicher.dauer.schreiben(SCHL_RAUM, null);
    raum = null;
    stand = null;
    startBildschirm(T.abgelaufen);
  }

  function verbinden() {
    verbindung = KB1Verbindung.starten({
      basis: BASIS, raum: raum.raum, schluessel: raum.schluessel,
      onStand: function (m) { if (m.typ === 'beamer') { stand = m; if ($('ebene').hidden || !document.querySelector('#ebene input')) zeichnen(); } },
      onStatus: function (ok) { $('kopf-punkt').className = 'punkt' + (ok ? '' : ' weg'); },
      onFehler: function () { abgelaufen(); }
    });
  }

  /* ---------- Probeansicht (ohne Worker) ---------- */
  var Demo = {
    namen: ['Mia', 'Ben', 'Lea', 'Tom', 'Ayşe', 'Jonas', 'Emma', 'Noah', 'Lina', 'Elias', 'Sofia', 'Paul', 'Hannah', 'Luca', 'Marie', 'David', 'Zoe', 'Finn', 'Clara', 'Ali', 'Nora', 'Leon', 'Ida'],
    start: function () {
      raum = { raum: '0000', schluessel: '' };
      var g = Demo.namen.map(function (n, i) { return { geraeteId: 'demo' + i, name: n, seiten: {}, online: i !== 5 }; });
      var stimmen = { 1: { n: 0, fragen: {} }, 2: { n: 0, fragen: {} } };
      [1, 2].forEach(function (r) {
        var anzahl = r === 1 ? 22 : 21;
        stimmen[r].n = anzahl;
        FRAGEN.forEach(function (f, fi) {
          var v = {};
          var quote = r === 1 ? (fi === 0 || fi === 5 ? 0.6 : 0.4) : 0.12;
          for (var k = 0; k < anzahl; k++) {
            var wahl = Math.random() < quote ? f.optionen[Math.floor(Math.random() * f.optionen.length)].charAt(0) : f.richtig;
            v[wahl] = v[wahl] || { sicher: 0, unsicher: 0 };
            v[wahl][Math.random() < (r === 1 ? 0.4 : 0.75) ? 'sicher' : 'unsicher']++;
          }
          stimmen[r].fragen[f.nr] = v;
        });
      });
      stand = { typ: 'beamer', raum: '0000', geraete: g, ohne: [], online: 22, stimmen: stimmen, puzzle: null,
        stunde: { folie: 'start', schritt: 0, uhr: null, frage: null } };
      setInterval(Demo.schritt, 1500);
      zeichnen();
    },
    aktion: function (typ, d) {
      var st = stand.stunde;
      if (typ === 'folie') { st.folie = d.folie; st.schritt = d.schritt; }
      if (typ === 'uhr') st.uhr = d.uhr ? { folie: d.uhr.folie, start: Date.now(), segmente: d.uhr.segmente } : null;
      if (typ === 'frage') st.frage = d.nr;
      if (typ === 'einteilen') Demo.einteilen();
      if (typ === 'verschieben' && stand.puzzle) {
        var p = stand.puzzle, von = -1, wer = null;
        p.gruppen.forEach(function (g, i) { g.mitglieder.forEach(function (m) { if (m.id === d.id) { von = i; wer = m; } }); });
        if (von >= 0 && p.gruppen.length > 1) {
          p.gruppen[von].mitglieder = p.gruppen[von].mitglieder.filter(function (m) { return m !== wer; });
          p.gruppen[(von + 1) % p.gruppen.length].mitglieder.push(wer);
        }
      }
      if (typ === 'ohneHandy') stand.ohne.push({ id: 'oh' + stand.ohne.length + 'demo', name: d.name });
      if (typ === 'entfernen') {
        stand.geraete = stand.geraete.filter(function (g) { return g.geraeteId !== d.id; });
        stand.ohne = stand.ohne.filter(function (g) { return g.id !== d.id; });
      }
    },
    einteilen: function () {
      var leute = stand.geraete.map(function (g) { return { id: g.geraeteId, name: g.name, online: g.online }; })
        .concat(stand.ohne.map(function (o) { return { id: o.id, name: o.name, ohneHandy: true, online: true }; }));
      leute = K.mischen(leute);
      var n = leute.length, anzahl = Math.max(1, Math.floor(n / 3)), k = 0, gruppen = [];
      for (var i = 0; i < anzahl; i++) {
        var gr = Math.floor(n / anzahl) + (i < n % anzahl ? 1 : 0);
        var rollen = gr >= 4 ? ['A', 'B', 'B', 'C'] : ['A', 'B', 'C'];
        var m = leute.slice(k, k + gr).map(function (p, j) { p.rolle = rollen[j] || 'B'; p.fertig = false; return p; });
        k += gr;
        gruppen.push({ nr: i, mitglieder: m, fertig: false });
      }
      var teams = [];
      ['A', 'B', 'C'].forEach(function (b) {
        var liste = [];
        gruppen.forEach(function (g) { g.mitglieder.forEach(function (m) { if (m.rolle === b) liste.push(m); }); });
        var t = Math.max(1, Math.floor(liste.length / 3));
        for (var x = 0; x < t; x++) teams.push({ id: b + (x + 1), b: b, mitglieder: [], fertig: false });
        liste.forEach(function (m, j) { teams[teams.length - t + (j % t)].mitglieder.push({ id: m.id, name: m.name, ohneHandy: m.ohneHandy, online: true, fertig: false }); });
      });
      stand.puzzle = { gruppen: gruppen, teams: teams, alleTeamsFertig: false };
    },
    schritt: function () {
      var f = folie();
      if (f.seite || f.typ === 'experten') {
        var seite = f.seite || 'w2-markieren';
        var gesamt = { 'w2-markieren': 11, 'w2-detektiv': 7, 'w2-lagerung': 9, 'w2-simulation': 3 }[seite] || 5;
        stand.geraete.forEach(function (g) {
          if (Math.random() > 0.3) return;
          var s = g.seiten[seite] || (g.seiten[seite] = { geloest: 0, gesamt: gesamt, status: 'arbeitet' });
          if (s.geloest < s.gesamt) s.geloest++;
          if (s.geloest === s.gesamt) s.status = 'fertig';
        });
      }
      var p = stand.puzzle;
      if (p && f.typ === 'experten') {
        p.teams.forEach(function (t) { t.mitglieder.forEach(function (m) { if (!m.ohneHandy && Math.random() < 0.08) m.fertig = true; }); t.fertig = t.mitglieder.every(function (m) { return m.ohneHandy || m.fertig; }); });
        p.alleTeamsFertig = p.teams.every(function (t) { return t.fertig; });
      }
      if (p && f.typ === 'stamm') {
        p.gruppen.forEach(function (g) { g.mitglieder.forEach(function (m) { if (!m.ohneHandy && Math.random() < 0.08) m.fertig = true; }); g.fertig = g.mitglieder.every(function (m) { return m.ohneHandy || m.fertig; }); });
      }
      if ($('ebene').hidden) zeichnen();
    }
  };

  /* ---------- Probestunde: Der Laptop spielt eine erfundene Klasse ----------
     Die erfundenen Handys melden sich über die normalen Schnittstellen an, stimmen ab, melden Fortschritt
     und „fertig“ – je nachdem, welche Folie gerade läuft. Die Lehrkraft macht mit dem eigenen Handy mit
     und wird wie alle anderen eingeteilt. Takt für Tests: beamer.html?takt=300 (Millisekunden). */
  var Probe = (function () {
    var SCHL = 'kb1nf_probe';
    var TAKT = Number(K.urlParam('takt')) || 2500;
    var z = null, timer = null;
    function speichern() { K.Speicher.dauer.schreiben(SCHL, z); }
    function post(weg, d) { d.raum = raum.raum; return KB1Verbindung.senden(BASIS, weg, d).catch(function () { return null; }); }
    function auswahl(liste, n) { return K.mischen(liste).slice(0, n); }
    function rolle(id) {
      var r = null;
      ((stand && stand.puzzle && stand.puzzle.teams) || []).forEach(function (t) { t.mitglieder.forEach(function (m) { if (m.id === id) r = t.b; }); });
      return r;
    }
    function gesamt(seite, id) {
      if (seite === 'w2-markieren') {
        var fall = rolle(id) ? S.rollen[rolle(id)].fall : 'a';
        return INHALTE.markieren.faelle[fall].teile.filter(function (t) { return typeof t === 'object' && t.k; }).length;
      }
      return { 'w2-detektiv': INHALTE.detektiv.faelle.length + 1, 'w2-lagerung': INHALTE.lagerung.karten.length, 'w2-simulation': 3 }[seite] || 5;
    }
    function abstimmen(p, runde) {
      var antworten = {}, sicher = {};
      FRAGEN.forEach(function (f, i) {
        // Beginn: typische Fehlvorstellungen (besonders E1 und E6), Ende: meist richtig
        var quote = runde === 2 ? 0.85 : (i === 0 || i === FRAGEN.length - 1 ? 0.35 : 0.55);
        antworten[f.nr] = Math.random() < quote ? f.richtig : f.optionen[Math.floor(Math.random() * f.optionen.length)].charAt(0);
        sicher[f.nr] = Math.random() < (runde === 2 ? 0.75 : 0.4) ? 1 : 0;
      });
      post('/api/stimme', { geraeteId: p.id, runde: runde, antworten: antworten, sicher: sicher });
    }
    function takt() {
      if (!raum || !raum.probe || !stand || !z) return;
      var f = folie();
      if (z.folie !== f.id) { z.folie = f.id; z.seit = Date.now(); }
      var eingeteilt = stand.puzzle ? stand.puzzle.eingeteilt : null;
      if (z.eingeteilt !== eingeteilt) { z.eingeteilt = eingeteilt; z.ft = {}; z.fs = {}; }   // neu gemischt → Haken weg
      var draussen = z.leute.filter(function (p) { return !z.an[p.id]; });
      if (draussen.length) {
        auswahl(draussen, 4).forEach(function (p) { z.an[p.id] = true; post('/api/anmelden', { geraeteId: p.id, name: p.name }); });
        speichern();
        return;
      }
      if (f.typ === 'abstimmung') {
        var schon = f.runde === 2 ? z.s2 : z.s1;
        auswahl(z.leute.filter(function (p) { return !schon[p.id]; }), 3).forEach(function (p) { schon[p.id] = true; abstimmen(p, f.runde); });
      }
      var seite = f.seite || (f.typ === 'experten' ? 'w2-markieren' : null);
      if (seite) {
        auswahl(z.leute, 5).forEach(function (p) {
          var g = gesamt(seite, p.id), schl = seite + ':' + p.id;
          var x = Math.min(g, (z.prog[schl] || 0) + 1);
          z.prog[schl] = x;
          post('/api/melden', { geraeteId: p.id, name: p.name, seite: seite, geloest: x, gesamt: g, status: x >= g ? 'fertig' : 'arbeitet' });
        });
      }
      if (f.typ === 'experten') {
        z.leute.forEach(function (p) {
          if (z.ft[p.id] || !rolle(p.id) || (z.prog['w2-markieren:' + p.id] || 0) < gesamt('w2-markieren', p.id) || Math.random() > 0.3) return;
          z.ft[p.id] = true;
          post('/api/aktion', { geraeteId: p.id, typ: 'fertig', schritt: 'team' });
        });
      }
      if (f.typ === 'stamm' && Date.now() - z.seit > 8 * TAKT) {
        z.leute.forEach(function (p) {
          if (z.fs[p.id] || !rolle(p.id) || Math.random() > 0.15) return;
          z.fs[p.id] = true;
          post('/api/aktion', { geraeteId: p.id, typ: 'fertig', schritt: 'stamm' });
        });
      }
      speichern();
    }
    return {
      starten: function (neu) {
        if (neu) {
          z = { raum: raum.raum, leute: T.probeNamen.map(function (n) { return { id: 'probe' + K.zufallsId(12), name: n }; }), an: {}, s1: {}, s2: {}, prog: {}, ft: {}, fs: {}, folie: null, seit: 0, eingeteilt: null };
          speichern();
        } else {
          var g = K.Speicher.dauer.lesen(SCHL);
          z = g && raum && g.raum === raum.raum ? g : null;
        }
        clearInterval(timer);
        if (raum && raum.probe && z) timer = setInterval(takt, TAKT);
      },
      stopp: function () { clearInterval(timer); timer = null; },
      ist: function (id) { return !!(raum && raum.probe && z) && z.leute.some(function (p) { return p.id === id; }); },
      anzahl: function () { return z ? z.leute.length : 0; }
    };
  })();

  /* ---------- Start ---------- */
  if (demo) { Demo.start(); return; }
  var gespeichert = K.Speicher.dauer.lesen(SCHL_RAUM);
  if (BASIS && gespeichert && /^\d{4}$/.test(gespeichert.raum) && gespeichert.schluessel && (!gespeichert.laeuftAb || gespeichert.laeuftAb > Date.now())) {
    raum = gespeichert;
    if (raum.probe) Probe.starten(false);
    verbinden();
  } else startBildschirm();
})();

/* Handy-App der Beamer-Stunde (w2.html) – Programmlogik, Texte in inhalte_stunde.js.
 *
 * Ein QR-Code für die ganze Stunde. Das Handy meldet sich mit Vornamen im Raum an und zeigt
 * dann immer den Bildschirm, der zur Folie am Beamer passt. Übungen (Abstimmung, Markieren,
 * Detektiv, Lagerung, Simulation, Raster) werden als fertige Module eingebunden: Wechselt die
 * Folie zu einer anderen Übung, lädt die Seite neu (der letzte Stand liegt im Tab-Speicher).
 * Springen zwischen Übungen ist so nicht möglich – das Handy folgt nur dem Beamer. */
(function () {
  'use strict';

  var K = window.KB1;
  var el = K.element;
  var fmt = K.formatiert;
  var S = window.STUNDE;
  var H = S.handy;
  var C = window.CONFIG || {};
  var BASIS = String(C.FORTSCHRITT_URL || '').replace(/\/+$/, '');
  var SCHL_ANMELDUNG = 'kb1nf_anmeldung';
  var SCHL_GERAET = 'kb1nf_geraet';
  var SCHL_STAND = 'kb1nf_stunde_stand';
  var SCHL_CHECK = 'kb1nf_check';
  var GUELTIG_MS = (Number(C.RAUMCODE_GUELTIG_STUNDEN) || 3) * 3600000;

  var $ = function (id) { return document.getElementById(id); };
  var uebung = $('uebung'), vor = $('vor-uebung'), nach = $('nach-uebung');
  var verbindung = null;
  var stand = null;
  var modulSchluessel = null;     // gerade eingebundenes Übungsmodul (z. B. 'modul:markieren:b')
  var bildschirmSchluessel = null;
  var letzterInhalt = null;       // zuletzt gezeichneter einfacher Bildschirm
  var ankunft = 0;                // Uhrzeit der letzten Nachricht (für die Uhr)
  var versatz = 0;

  $('kopfzeile').textContent = (INHALTE.allgemein && INHALTE.allgemein.kopfzeile) || S.kopfzeile;
  var infoOffen = true;           // Infotext im Expertenteam auf- oder zugeklappt

  /* ---------- Speicher ---------- */
  function geraeteId(neu) {
    var id = neu ? null : K.Speicher.dauer.lesen(SCHL_GERAET);
    if (typeof id !== 'string' || !/^[a-z0-9]{8,40}$/.test(id)) {
      id = K.zufallsId(16);
      K.Speicher.dauer.schreiben(SCHL_GERAET, id);
    }
    return id;
  }
  function anmeldung() {
    var a = K.Speicher.dauer.lesen(SCHL_ANMELDUNG);
    if (!a || typeof a !== 'object' || typeof a.um !== 'number' || Date.now() - a.um > GUELTIG_MS) return null;
    if (!/^\d{4}$/.test(a.raum) || K.namePruefen(a.name) !== '' || !/^[a-z0-9]{8,40}$/.test(String(a.geraeteId || ''))) return null;
    return a;
  }
  function anmeldungAuffrischen() {
    var a = anmeldung();
    if (a) { a.um = Date.now(); K.Speicher.dauer.schreiben(SCHL_ANMELDUNG, a); }
  }
  var raumAusQr = (function () { var r = K.urlParam('raum'); return r && /^\d{4}$/.test(r) ? r : null; })();

  /* ---------- Fortschritt der Übungen an den Worker (für die Beamer-Folien) ---------- */
  var offen = {}, sendetGerade = false, sendeTimer = null, wartezeit = 0;
  function meldenSenden() {
    var a = anmeldung();
    var seiten = Object.keys(offen);
    if (!a || !seiten.length || sendetGerade) return;
    var seite = seiten[0], s = offen[seite];
    sendetGerade = true;
    KB1Verbindung.senden(BASIS, '/api/melden', { raum: a.raum, geraeteId: a.geraeteId, name: a.name, seite: seite, geloest: s.geloest, gesamt: s.gesamt, status: s.status })
      .then(function (x) {
        sendetGerade = false;
        if (x.status >= 500) throw new Error('später');
        if (offen[seite] === s) delete offen[seite];
        wartezeit = 0;
        if (Object.keys(offen).length) planen(50);
      })
      .catch(function () {
        sendetGerade = false;
        wartezeit = Math.min(wartezeit ? wartezeit * 2 : 3000, 30000);
        planen(wartezeit);
      });
  }
  function planen(ms) { clearTimeout(sendeTimer); sendeTimer = setTimeout(meldenSenden, ms); }
  window.KB1Melden = {
    stand: function (seite, geloest, gesamt, status) {
      offen[seite] = { geloest: geloest, gesamt: gesamt, status: status };
      planen(300);
    }
  };

  /* ---------- Folien ---------- */
  function folieVon(id) {
    for (var i = 0; i < S.folien.length; i++) if (S.folien[i].id === id) return S.folien[i];
    return S.folien[0];
  }
  function gruppeInfo(nr) { return S.gruppen[nr % S.gruppen.length]; }
  function jetzt() { return Date.now() + versatz; }

  // Welcher Bildschirm gehört zum Stand? Übungen bekommen einen eigenen Schlüssel (→ Neuladen beim Wechsel).
  function bildschirmVon(m) {
    if (!m || !m.ich) return { schl: 'anmelden' };
    var f = folieVon(m.folie);
    var h = f.handy || { typ: 'vorne' };
    if (h.typ === 'entscheidung') return { schl: 'modul:entscheidung:' + h.runde, modul: 'entscheidung', params: { runde: h.runde } };
    if (h.typ === 'experte') {
      if (!m.puzzle) return { schl: 'warten' };
      if (m.puzzle.alleTeamsFertig) return { schl: 'stamm' };
      var fall = S.rollen[m.puzzle.rolle].fall;
      return { schl: 'modul:markieren:' + fall, modul: 'markieren', params: { fall: fall }, extra: 'experte' };
    }
    if (h.typ === 'modul') return { schl: 'modul:' + h.modul, modul: h.modul, params: {}, extra: h.gruppeZeigen ? 'gruppe' : null };
    return { schl: h.typ };
  }

  /* ---------- Anzeige allgemein ---------- */
  function leeren() {
    vor.textContent = '';
    uebung.textContent = '';
    nach.textContent = '';
    $('anweisung').hidden = true;
    $('fortschritt').hidden = true;
  }
  function kopf(text) {
    $('titel').textContent = text;
    document.title = text + ' – ' + S.kopfzeile;
  }
  function leisteZeigen() {
    var a = anmeldung();
    $('app-leiste').hidden = !a || !stand || !stand.ich;
    if (!a) return;
    $('app-wer').textContent = '👤 ' + a.name;
    var g = $('app-gruppe');
    g.textContent = '';
    var p = stand && stand.puzzle;
    if (p && p.gruppe) {
      var info = gruppeInfo(p.gruppe.nr);
      g.textContent = info.emoji + ' ' + info.name + ' · ' + p.rolle;
      g.style.background = info.farbe;
    }
  }
  function namenListe(mitglieder) {
    var andere = mitglieder.filter(function (m) { return !m.ich; }).map(function (m) { return m.name; });
    if (andere.length <= 1) return andere.join('');
    return andere.slice(0, -1).join(', ') + ' und ' + andere[andere.length - 1];
  }

  /* ---------- Uhr der aktuellen Folie ---------- */
  function uhrZustand() {
    var u = stand && stand.uhr;
    if (!u || u.folie !== stand.folie) return null;
    var vergangen = (jetzt() - u.start) / 1000, summe = 0;
    for (var i = 0; i < u.segmente.length; i++) {
      if (vergangen < summe + u.segmente[i].sek) return { nr: i, label: u.segmente[i].label, rest: summe + u.segmente[i].sek - vergangen };
      summe += u.segmente[i].sek;
    }
    return { um: true, nr: u.segmente.length - 1, rest: 0 };
  }
  function zeitText(sek) {
    sek = Math.max(0, Math.ceil(sek));
    return Math.floor(sek / 60) + ':' + ('0' + (sek % 60)).slice(-2);
  }
  function uhrZeile() {
    var z = el('p', 'uhr-zeile');
    z.setAttribute('data-uhr', '1');
    return z;
  }
  function uhrenAktualisieren() {
    var z = uhrZustand();
    Array.prototype.forEach.call(document.querySelectorAll('[data-uhr]'), function (e) {
      e.textContent = '';
      if (!z) return;
      if (z.um) { e.textContent = '⏱ ' + H.zeitUm; return; }
      e.appendChild(document.createTextNode('⏱ ' + (z.label ? z.label + ' · ' : '')));
      e.appendChild(el('span', 'zeit', zeitText(z.rest)));
    });
    var dran = $('dran-band');
    if (dran) stammDranAktualisieren(dran);
  }
  setInterval(uhrenAktualisieren, 500);

  /* ---------- Anmeldung ---------- */
  function anmeldenZeigen(meldung) {
    modulSchluessel = null;
    bildschirmSchluessel = 'anmelden';
    letzterInhalt = null;
    leeren();
    kopf(S.titel);
    $('app-leiste').hidden = true;
    var alt = K.Speicher.dauer.lesen(SCHL_ANMELDUNG) || {};
    var form = el('form', 'anmelde-karte');
    form.noValidate = true;
    form.appendChild(el('h2', null, H.anmeldenTitel));
    form.appendChild(el('p', null, H.anmeldenText));
    form.appendChild(feld('anmelde-name', H.nameLabel, alt.name || '', false));
    if (!raumAusQr) form.appendChild(feld('anmelde-raum', H.raumLabel, alt.raum || '', true));
    var fehler = el('p', 'app-fehler', meldung || '');
    fehler.setAttribute('role', 'alert');
    form.appendChild(fehler);
    var los = el('button', 'knopf knopf-breit anmelde-los', H.los);
    los.type = 'submit';
    form.appendChild(los);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = $('anmelde-name').value.trim().replace(/\s+/g, ' ');
      var raum = raumAusQr || $('anmelde-raum').value.trim();
      var f = K.namePruefen(name);
      var text = f ? INHALTE.melden[f === 'laenge' ? 'fehlerNameLaenge' : f === 'zeichen' ? 'fehlerNameZeichen' : 'fehlerNameWort'] : (!/^\d{4}$/.test(raum) ? H.fehlerRaum : '');
      if (text) { fehler.textContent = text; return; }
      los.disabled = true;
      anmelden(name, raum).then(function (ergebnis) {
        los.disabled = false;
        if (ergebnis) fehler.textContent = ergebnis;
      });
    });
    uebung.appendChild(form);
  }
  function feld(id, label, wert, code) {
    var w = el('div', 'feld');
    var l = el('label', null, label);
    l.setAttribute('for', id);
    var i = el('input');
    i.id = id; i.type = 'text'; i.value = wert; i.autocomplete = 'off';
    if (code) { i.inputMode = 'numeric'; i.maxLength = 4; i.className = 'code'; }
    else { i.maxLength = 20; i.setAttribute('autocapitalize', 'words'); i.spellcheck = false; }
    w.appendChild(l); w.appendChild(i);
    return w;
  }

  // → Promise: '' (geklappt) oder Fehlermeldung
  function anmelden(name, raum, zweiterVersuch) {
    var id = geraeteId(false);
    return KB1Verbindung.senden(BASIS, '/api/anmelden', { raum: raum, geraeteId: id, name: name }).then(function (x) {
      if (x.status === 410 && !zweiterVersuch) { geraeteId(true); return anmelden(name, raum, true); }
      if (x.status === 404) return H.fehlerUnbekannt;
      if (x.status === 409) return H.fehlerVoll;
      if (x.status === 400) return INHALTE.melden.fehlerNameZeichen;
      if (x.status !== 200) return H.fehlerNetz;
      K.Speicher.dauer.schreiben(SCHL_ANMELDUNG, { name: name, raum: raum, geraeteId: id, um: Date.now() });
      neuerStand(x.d);
      verbinden();
      return '';
    }).catch(function () { return H.fehlerNetz; });
  }

  /* ---------- Verbindung ---------- */
  function verbinden() {
    var a = anmeldung();
    if (!a) return;
    if (verbindung) verbindung.stopp();
    verbindung = KB1Verbindung.starten({
      basis: BASIS, raum: a.raum, geraeteId: a.geraeteId,
      onStand: function (m) { if (m.typ === 'stand') neuerStand(m); },
      onStatus: function (ok) {
        $('app-punkt').className = 'app-punkt' + (ok ? '' : ' weg');
        $('app-getrennt').hidden = ok;
        $('app-getrennt').textContent = H.getrennt;
      },
      onFehler: function (grund) {
        verbindung = null;
        K.Speicher.sitzung.schreiben(SCHL_STAND, null);
        if (grund === 'entfernt') { geraeteId(true); K.Speicher.dauer.schreiben(SCHL_ANMELDUNG, null); anmeldenZeigen(H.fehlerEntfernt); }
        else { K.Speicher.dauer.schreiben(SCHL_ANMELDUNG, null); anmeldenZeigen(H.fehlerUnbekannt); }
      }
    });
  }

  var neuAnmeldenLaeuft = false;
  function neuerStand(m) {
    if (typeof m.jetzt === 'number') versatz = m.jetzt - Date.now();
    ankunft = Date.now();
    // Der Worker kennt das Handy nicht (mehr) – mit gespeichertem Namen still neu anmelden
    if (!m.ich) {
      var a = anmeldung();
      if (a && !neuAnmeldenLaeuft) {
        neuAnmeldenLaeuft = true;
        KB1Verbindung.senden(BASIS, '/api/anmelden', { raum: a.raum, geraeteId: a.geraeteId, name: a.name })
          .then(function (x) { neuAnmeldenLaeuft = false; if (x.status === 200) neuerStand(x.d); })
          .catch(function () { neuAnmeldenLaeuft = false; });
      }
      return;
    }
    stand = m;
    anmeldungAuffrischen();
    K.Speicher.sitzung.schreiben(SCHL_STAND, { raum: (anmeldung() || {}).raum, stand: m });
    zeigen();
  }

  /* ---------- Bildschirm wählen ---------- */
  function zeigen() {
    var b = bildschirmVon(stand);
    leisteZeigen();
    // Eine Übung ist eingebunden und es kommt etwas anderes → neu laden (sauberer Zustand)
    if (modulSchluessel && b.schl !== modulSchluessel) { location.reload(); return; }
    if (b.modul) {
      if (!modulSchluessel) modulEinbinden(b);
      zusatzZeichnen(b);
      bildschirmSchluessel = b.schl;
      return;
    }
    bildschirmSchluessel = b.schl;
    // Unveränderter Stand → nicht neu zeichnen (sonst gingen Antippen während einer Aktualisierung verloren)
    var inhaltSchluessel = b.schl + '|' + JSON.stringify([stand.folie, stand.schritt, stand.frage, stand.uhr, stand.puzzle, stand.ich]);
    if (inhaltSchluessel === letzterInhalt) { uhrenAktualisieren(); return; }
    letzterInhalt = inhaltSchluessel;
    leeren();
    var f = folieVon(stand.folie);
    var h = f.handy || {};
    ({
      vorne: zeigeVorne, murmeln: zeigeMurmeln, gruppe: zeigeGruppe, warten: zeigeWarten, stamm: zeigeStamm,
      papier: zeigePapier, aufstellung: zeigeAufstellung, ende: zeigeEnde, faelle: zeigeFaelle
    }[b.schl] || zeigeVorne)(f, h);
    uhrenAktualisieren();
  }

  function modulEinbinden(b) {
    modulSchluessel = b.schl;
    leeren();
    $('anweisung').hidden = false;
    $('fortschritt').hidden = false;
    window.KB1_PARAMS = b.params || {};
    var s = document.createElement('script');
    s.src = b.modul + '.js';
    document.body.appendChild(s);
  }

  // Teile um die eingebundene Übung herum (Expertenteam, Infotext, Check, Stammgruppe)
  function zusatzZeichnen(b) {
    var p = stand.puzzle;
    if (b.extra === 'experte' && p) { experteZeichnen(p); uhrenAktualisieren(); return; }
    vor.textContent = '';
    nach.textContent = '';
    if (b.extra === 'gruppe' && p && p.gruppe) {
      var info = gruppeInfo(p.gruppe.nr);
      var g = el('div', 'gruppe-mini');
      g.style.setProperty('--farbe', info.farbe);
      g.textContent = info.emoji + ' ' + info.name + ': ' + p.gruppe.mitglieder.map(function (m) { return m.name + (m.ich ? ' ' + H.du : ''); }).join(', ');
      vor.appendChild(g);
    }
    vor.appendChild(uhrZeile());
    uhrenAktualisieren();
  }

  /* ---------- Einfache Bildschirme ---------- */
  function bildschirm(emoji, titelText, text) {
    var box = el('section', 'bildschirm');
    if (emoji) box.appendChild(el('div', 'bildschirm-emoji', emoji));
    if (titelText) box.appendChild(fmt('h2', null, titelText));
    if (text) box.appendChild(fmt('p', null, text));
    uebung.appendChild(box);
    return box;
  }
  function mitName(t) { return K.ersetzen(t || '', { name: stand.ich ? stand.ich.name : '' }); }

  function zeigeVorne(f, h) {
    kopf(f.kurz);
    var box = bildschirm('📺', mitName(h.titel || f.titel), mitName(h.text || H.vorneStandard));
    box.appendChild(uhrZeile());
    box.appendChild(el('span', 'vorne-hinweis', H.vorneStandard));
  }

  function zeigeWarten(f) {
    kopf(f.kurz);
    bildschirm('⏳', H.nichtEingeteilt, '');
  }

  function zeigeEnde(f, h) {
    kopf(f.kurz);
    bildschirm('🎉', h.titel, h.text);
  }

  function zeigePapier(f, h) {
    kopf(f.kurz);
    var box = bildschirm('✍️', h.titel, h.text);
    box.insertBefore(el('span', 'vorne-hinweis', H.papier), box.children[1]);
    box.appendChild(uhrZeile());
  }

  // Klausurtraining 2.1/2.2: Aufgaben mit den Fällen zum Nachlesen (alle drei, auch die fremden)
  function fallText(fall) {
    return INHALTE.markieren.faelle[fall].teile.map(function (t) { return typeof t === 'string' ? t : t.t; }).join('');
  }
  function zeigeFaelle(f, h) {
    kopf(f.kurz);
    var box = bildschirm('✍️', h.titel, h.text);
    box.insertBefore(el('span', 'vorne-hinweis', H.papier), box.children[1]);
    box.appendChild(uhrZeile());
    (h.aufgaben || []).forEach(function (a) {
      var k = el('section', 'schritt-karte');
      k.appendChild(fmt('p', null, '**' + a.nr + '** ' + a.text));
      a.faelle.forEach(function (fall) {
        var d = el('details', 'info');
        d.open = true;
        var titelText = INHALTE.markieren.faelle[fall].titel.split('·').pop().trim();
        d.appendChild(el('summary', null, 'Fall: ' + titelText));
        fallText(fall).split('\n').forEach(function (x) { if (x.trim()) d.appendChild(el('p', null, x.trim())); });
        k.appendChild(d);
      });
      uebung.appendChild(k);
    });
  }

  function zeigeMurmeln(f, h) {
    kopf(f.kurz);
    var nr = stand.frage;
    var frage = null;
    (INHALTE.entscheidung.fragen || []).forEach(function (x) { if (x.nr === nr) frage = x; });
    var box = bildschirm('🗣️', h.titel, h.text);
    box.appendChild(uhrZeile());
    if (!frage) return;
    var k = el('section', 'karte');
    k.style.textAlign = 'left';
    k.appendChild(el('h2', null, frage.nr));
    k.appendChild(el('p', null, frage.frage));
    var z = K.Speicher.dauer.lesen('kb1nf_entscheidung');
    var a = z && z.runden && z.runden[1] && z.runden[1].antworten && z.runden[1].antworten[frage.nr];
    var opt = frage.optionen.filter(function (o) { return o.charAt(0) === a; })[0];
    k.appendChild(fmt('p', null, opt ? '**' + K.ersetzen(h.ihre, { a: opt }) + '**' : h.keine));
    uebung.appendChild(k);
  }

  function zeigeGruppe(f, h) {
    kopf(f.kurz);
    var p = stand.puzzle;
    if (!p || !p.gruppe) { bildschirm('🧩', h.warten, ''); return; }
    var info = gruppeInfo(p.gruppe.nr);
    var g = el('section', 'gruppe-gross');
    g.style.setProperty('--farbe', info.farbe);
    g.appendChild(el('div', 'emoji', info.emoji));
    g.appendChild(el('div', 'label', h.deine));
    g.appendChild(el('div', 'name', info.name));
    var chips = el('div', 'chips');
    p.gruppe.mitglieder.forEach(function (m) {
      var c = el('span', 'chip' + (m.ich ? ' ich' : ''));
      c.appendChild(el('span', 'buchstabe ' + m.rolle, m.rolle));
      c.appendChild(document.createTextNode(m.name + (m.ich ? ' ' + H.du : '')));
      chips.appendChild(c);
    });
    g.appendChild(chips);
    uebung.appendChild(g);
    var r = S.rollen[p.rolle];
    var z = el('div', 'bildschirm');
    var zeile = fmt('p', 'rolle-zeile', K.ersetzen(h.experte, { b: p.rolle, form: r.form }));
    zeile.insertBefore(el('span', 'buchstabe gross ' + p.rolle, p.rolle), zeile.firstChild);
    zeile.insertBefore(document.createTextNode(' '), zeile.children[1]);
    z.appendChild(zeile);
    if (p.team) z.appendChild(fmt('p', null, K.ersetzen(h.team, { team: p.team.id })));
    uebung.appendChild(z);
  }

  /* ---------- Expertenteam (AA1) ---------- */
  function checkStand() {
    var c = K.Speicher.dauer.lesen(SCHL_CHECK);
    return c && typeof c === 'object' ? c : {};
  }
  function checkBestanden(rolle) {
    var c = checkStand()[rolle] || {};
    return (S.check[rolle] || []).every(function (q, i) { return c[i] === true; });
  }

  // Expertenteam: Infotext und Check werden nur einmal aufgebaut; bei neuen Ständen ändern sich
  // nur Team-Kasten und Fertig-Bereich (sonst gingen Antippen während einer Aktualisierung verloren).
  var zuletzt = {};
  function teilErneuern(id, schluessel, bauen) {
    var platz = document.getElementById(id);
    if (!platz || zuletzt[id] === schluessel) return;
    zuletzt[id] = schluessel;
    platz.textContent = '';
    platz.appendChild(bauen());
  }

  function experteZeichnen(p) {
    var r = S.rollen[p.rolle];
    if (!document.getElementById('exp-team')) {
      zuletzt = {};
      vor.textContent = '';
      nach.textContent = '';
      var team = el('div'); team.id = 'exp-team'; vor.appendChild(team);
      vor.appendChild(uhrZeile());
      vor.appendChild(el('h2', null, K.ersetzen(H.expFall, { person: r.person })));
      var e = S.experten[r.fall];
      // Reihenfolge wie im Arbeitsblatt: a) Fall + Merksatz AA1 → b) 1.1 → c) Infotext → d) Check → e) Tabellenspalte
      nach.appendChild(fmt('p', 'weiter-hinweis', K.ersetzen(H.expWeiter, { b: p.rolle, form: r.form })));
      var k11 = el('section', 'schritt-karte');
      k11.appendChild(el('h2', null, H.exp11Titel));
      k11.appendChild(fmt('p', null, K.ersetzen(H.exp11Text, { person: r.personDativ, adjektiv: r.adjektiv })));
      k11.appendChild(el('p', 'klein-grau', H.exp11Tipp));
      nach.appendChild(k11);
      var d = el('details', 'info');
      d.open = infoOffen;
      d.addEventListener('toggle', function () { infoOffen = d.open; });
      d.appendChild(el('summary', null, K.ersetzen(H.expInfo, { form: r.form })));
      e.info.forEach(function (x) { d.appendChild(fmt('p', null, x)); });
      d.appendChild(fmt('p', 'woerter', '**' + H.expWoerter + ':** ' + e.woerter.split(' | ').join(' · ')));
      nach.appendChild(d);
      nach.appendChild(el('p', 'papier-hinweis', '📄 ' + K.ersetzen(H.expPapier, { b: p.rolle, form: r.form })));
      var c = el('div'); c.id = 'exp-check'; nach.appendChild(c);
      var tab = el('section', 'schritt-karte tabelle-karte');
      tab.appendChild(el('h2', null, H.expTabelleTitel));
      tab.appendChild(fmt('p', null, K.ersetzen(H.expTabelleText, { b: p.rolle, kurz: r.kurz })));
      tab.appendChild(fmt('p', null, '**' + H.expTabelleFertig + '**'));
      nach.appendChild(tab);
      var f = el('div'); f.id = 'exp-fertig'; nach.appendChild(f);
    }
    // oben: Team, Tisch, Aufträge (ändert sich, wenn jemand im Team „fertig“ meldet)
    teilErneuern('exp-team', JSON.stringify(p.team), function () {
      var t = el('section', 'team-kasten ' + p.rolle);
      var h2 = el('h2');
      h2.appendChild(el('span', 'buchstabe gross ' + p.rolle, p.rolle));
      h2.appendChild(document.createTextNode(K.ersetzen(H.expTitel, { team: p.team ? p.team.id : '' }) + ' · ' + r.form));
      t.appendChild(h2);
      var andere = p.team ? namenListe(p.team.mitglieder) : '';
      t.appendChild(fmt('p', 'setzen', andere ? K.ersetzen(H.expSetzen, { namen: andere }) : H.expAllein));
      if (p.team) t.appendChild(mitgliederListe(p.team.mitglieder, false));
      var ol = el('ul', 'auftraege');
      H.expAuftraege.forEach(function (a) { ol.appendChild(fmt('li', null, K.ersetzen(a, { b: p.rolle }))); });
      t.appendChild(ol);
      return t;
    });
    // unten: Experten-Check (nur bei eigener Antwort neu) und Fertig-Bereich
    teilErneuern('exp-check', JSON.stringify(checkStand()[p.rolle] || {}), function () { return checkZeichnen(p.rolle); });
    var bestanden = checkBestanden(p.rolle);
    teilErneuern('exp-fertig', [p.ichTeamFertig, p.teamsFertig, p.teamsGesamt, bestanden].join('|'), function () {
      var box = fertigBereich('team', p.ichTeamFertig, bestanden, K.ersetzen(H.teamFertigText, { x: p.teamsFertig, y: p.teamsGesamt }), H.fertigTeam, H.fertigTeamGesperrt);
      // Während des Wartens: Selbstkontrolle zur Klausuraufgabe 1.1
      if (p.ichTeamFertig) {
        var k = el('section', 'schritt-karte');
        k.appendChild(fmt('p', null, '**' + H.exp11Kontrolle + '**'));
        var ul = el('ul', 'auftraege');
        (S.experten[r.fall].nennen || []).forEach(function (x) { ul.appendChild(el('li', null, x)); });
        k.appendChild(ul);
        box.insertBefore(k, box.lastChild);
      }
      return box;
    });
  }

  function mitgliederListe(mitglieder, mitRolle, dranRolle) {
    var ul = el('ul', 'mitglieder');
    mitglieder.forEach(function (m) {
      var li = el('li', (m.ich ? 'ich' : '') + (dranRolle && m.rolle === dranRolle ? ' dran' : ''));
      if (mitRolle) li.appendChild(el('span', 'buchstabe ' + m.rolle, m.rolle));
      li.appendChild(document.createTextNode(m.name + (m.ich ? ' ' + H.du : '') + (mitRolle ? ' · ' + S.rollen[m.rolle].kurz : '')));
      if (m.fertig) li.appendChild(el('span', 'haken', '✓'));
      ul.appendChild(li);
    });
    return ul;
  }

  function checkZeichnen(rolle) {
    var box = el('section', 'check');
    box.appendChild(el('h2', null, H.checkTitel));
    box.appendChild(el('p', null, H.checkText));
    var fragen = S.check[rolle] || [];
    fragen.forEach(function (q, i) {
      var c = checkStand();
      var schon = c[rolle] && c[rolle][i] === true;
      var k = el('div', 'check-frage');
      k.appendChild(el('p', null, (i + 1) + '. ' + q.frage));
      var opt = el('div', 'check-optionen');
      var rueck = el('p', 'check-rueck');
      q.optionen.forEach(function (o, j) {
        var b = K.knopf(o, 'antwort' + (schon && j === q.richtig ? ' richtig' : ''), function () {
          var cs = checkStand();
          cs[rolle] = cs[rolle] || {};
          cs[rolle][i] = j === q.richtig;
          K.Speicher.dauer.schreiben(SCHL_CHECK, cs);
          if (stand && stand.puzzle) experteZeichnen(stand.puzzle);
        });
        b.disabled = schon;
        opt.appendChild(b);
      });
      k.appendChild(opt);
      var c2 = checkStand()[rolle] || {};
      if (schon) { rueck.className = 'check-rueck ok'; rueck.textContent = '✓ ' + H.checkRichtig; }
      else if (c2[i] === false) { rueck.className = 'check-rueck nein'; rueck.textContent = H.checkFalsch; }
      k.appendChild(rueck);
      box.appendChild(k);
    });
    if (checkBestanden(rolle)) box.appendChild(el('p', 'check-bestanden', H.checkFertig));
    return box;
  }

  function fertigBereich(schritt, ichFertig, darf, fertigText, knopfText, gesperrtText) {
    var box = el('section');
    if (ichFertig) {
      box.appendChild(fmt('p', 'fertig-text', fertigText));
      box.appendChild(K.knopf(H.nochNichtFertig, 'textknopf-leise', function () { fertigMelden(schritt, false); }));
      return box;
    }
    var b = K.knopf(darf ? knopfText : gesperrtText, 'fertig-knopf', function () { fertigMelden(schritt, true); });
    b.disabled = !darf;
    b.id = 'fertig-' + schritt;
    box.appendChild(b);
    return box;
  }

  function fertigMelden(schritt, wert) {
    var a = anmeldung();
    if (!a) return;
    KB1Verbindung.senden(BASIS, '/api/aktion', { raum: a.raum, geraeteId: a.geraeteId, typ: 'fertig', schritt: schritt, wert: wert })
      .then(function (x) { if (x.status === 200) neuerStand(x.d); });
  }

  /* ---------- Stammgruppe (AA2a) ---------- */
  function zeigeStamm() {
    var f = folieVon('aa2a');
    kopf(f.kurz);
    var p = stand.puzzle;
    if (!p || !p.gruppe) { bildschirm('⏳', H.nichtEingeteilt, ''); return; }
    var info = gruppeInfo(p.gruppe.nr);
    var k = el('section', 'stamm-kopf');
    k.style.setProperty('--farbe', info.farbe);
    k.appendChild(el('span', 'emoji', info.emoji));
    var t = el('div');
    t.appendChild(el('div', 'label', H.ihreGruppe));
    t.appendChild(el('div', 'name', info.name));
    k.appendChild(t);
    uebung.appendChild(k);
    var andere = namenListe(p.gruppe.mitglieder);
    if (andere) uebung.appendChild(fmt('p', 'setzen', K.ersetzen(H.stammSetzen, { namen: andere })));
    var dran = el('p', 'dran-band');
    dran.id = 'dran-band';
    uebung.appendChild(dran);
    uebung.appendChild(mitgliederListe(p.gruppe.mitglieder, true, null));
    uebung.appendChild(fmt('p', null, H.stammAuftrag));
    uebung.appendChild(uhrZeile());
    var x = p.gruppe.mitglieder.filter(function (m) { return !m.ohneHandy && m.fertig; }).length;
    var y = p.gruppe.mitglieder.filter(function (m) { return !m.ohneHandy; }).length;
    uebung.appendChild(fertigBereich('stamm', p.ichStammFertig, true,
      p.gruppe.fertig ? H.gruppeFertig : K.ersetzen(H.stammFertigText, { x: x, y: y }), H.fertigStamm, H.fertigStamm));
    stammDranAktualisieren(dran);
  }

  // „Jetzt erklärt: …“ aus der Erklär-Uhr (Abschnitte A, B, C)
  function stammDranAktualisieren(dran) {
    var p = stand && stand.puzzle;
    var z = uhrZustand();
    dran.textContent = '';
    if (!p || !p.gruppe || !z || z.um || z.nr > 2 || stand.folie !== 'aa2a') return;
    var b = ['A', 'B', 'C'][z.nr];
    var wer = p.gruppe.mitglieder.filter(function (m) { return m.rolle === b; });
    if (wer.some(function (m) { return m.ich; })) dran.textContent = '🎤 ' + H.stammDran;
    else dran.textContent = K.ersetzen(H.stammJetzt, { wer: b + ' – ' + wer.map(function (m) { return m.name; }).join(', ') });
    Array.prototype.forEach.call(document.querySelectorAll('.mitglieder li'), function (li, i) {
      var m = p.gruppe.mitglieder[i];
      if (m) li.classList.toggle('dran', m.rolle === b);
    });
  }

  /* ---------- Aufstellung (AA5a) ---------- */
  function zeigeAufstellung(f, h) {
    kopf(f.kurz);
    var s = stand.schritt || 0;
    var nr = Math.ceil(s / 2);
    if (!nr) { bildschirm('🚶', h.titel, h.start); return; }
    var m = f.massnahmen[nr - 1];
    var box = bildschirm('🚶', '', '');
    box.appendChild(el('p', null, 'Maßnahme ' + nr + ' von ' + f.massnahmen.length));
    box.appendChild(el('p', 'massnahme-handy', m.text));
    if (s % 2 === 0) {
      var e = f.ecken[m.ecke];
      box.appendChild(el('div', 'ecke-gross', K.ersetzen(H.aufstellungLoesung, { ecke: e.emoji + ' ' + e.text })));
      box.appendChild(el('p', null, m.warum));
    } else {
      box.appendChild(fmt('p', null, f.text));
    }
  }

  /* ---------- Start ---------- */
  if (!BASIS) { anmeldenZeigen(S.beamer.nichtEingerichtet); return; }
  var a = anmeldung();
  if (a && raumAusQr && a.raum !== raumAusQr) a = null;       // anderer Raum (z. B. Parallelklasse) → neu anmelden
  if (!a) { anmeldenZeigen(''); return; }
  var gemerkt = K.Speicher.sitzung.lesen(SCHL_STAND);
  if (gemerkt && gemerkt.raum === a.raum && gemerkt.stand) { stand = gemerkt.stand; zeigen(); }
  else { kopf(S.titel); bildschirm('📡', H.verbinden, ''); }
  verbinden();
})();

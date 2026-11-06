/* AA2 · Schockform-Detektiv (Programmlogik – Texte in inhalte.js → detektiv).
   Je Fall: zwei Befunde antippen und die Schockform wählen (Reihenfolge egal) → „Prüfen“.
   Schutz gegen Raten: „Prüfen“ zählt erst nach einer Mindest-Lesezeit; höchstens zwei Versuche je Fall,
   danach wird die Lösung gezeigt. Merksatz AA2 nur, wenn genug Fälle beim ersten Versuch stimmen.
   Zum Schluss: zwei Patienten im Vergleich – die zwei Zeilen wählen, die die Formen sicher unterscheiden. */
(function () {
  'use strict';
  var K = window.KB1;
  var el = K.element;
  var T = K.seiteVorbereiten('detektiv');
  var SEITE = 'w2-detektiv';
  var SCHL = 'kb1nf_detektiv2';
  var platz = document.getElementById('uebung');
  var N = T.faelle.length;
  var GESAMT = N + 1; // Fälle + Vergleich
  var MAX_VERSUCHE = 2;

  function leer() {
    return {
      fall: 0,
      faelle: T.faelle.map(function () { return { form: null, belege: [], versuche: 0, geloest: false, gezeigt: false, meldung: null }; }),
      vergleich: { gewaehlt: [], versuche: 0, geloest: false, gezeigt: false, meldung: null }
    };
  }
  var z = K.Speicher.sitzung.lesen(SCHL);
  if (!z || !Array.isArray(z.faelle) || z.faelle.length !== N || !z.vergleich) z = leer();
  function speichern() { K.Speicher.sitzung.schreiben(SCHL, z); }

  function erledigt(f) { return f.geloest || f.gezeigt; }
  function bearbeitet() {
    return z.faelle.filter(erledigt).length + (erledigt(z.vergleich) ? 1 : 0);
  }
  function ersterVersuch() {
    return z.faelle.filter(function (f) { return f.geloest && f.versuche === 1; }).length;
  }
  function stand() {
    var g = bearbeitet();
    K.fortschrittSetzen(g, GESAMT);
    var fertig = g === GESAMT;
    var status = fertig ? (ersterVersuch() >= T.mindestensErsterVersuch ? 'fertig' : 'durchklicken') : 'arbeitet';
    K.melden(SEITE, g, GESAMT, status);
  }
  function formText(k) { return T.formen.filter(function (f) { return f.kuerzel === k; })[0].text; }
  function neuStart() { z = leer(); speichern(); stand(); fallZeigen(); }

  // „Prüfen“ zu früh? (Zeit seit dem Anzeigen der Aufgabe)
  var angezeigt = Date.now();
  function zuSchnell() {
    var w = K.urlParam('lesezeit');   // nur für die automatischen Tests (?lesezeit=0)
    var sek = w !== null && w !== '' ? Number(w) : Number(T.mindestLeseSekunden) || 0;
    return Date.now() - angezeigt < sek * 1000;
  }

  /* ---------- Ein Fall ---------- */
  function fallZeigen() {
    platz.textContent = '';
    angezeigt = Date.now();
    var i = z.fall;
    var fall = T.faelle[i];
    var fz = z.faelle[i];
    var karte = el('section', 'karte');
    karte.appendChild(el('p', 'klein', K.ersetzen(T.fallTitel, { n: i + 1, y: N })));
    karte.appendChild(el('p', 'klein', T.belegFrage));
    var text = el('p', 'markiertext');
    var knoepfe = [];
    fall.teile.forEach(function (teil, j) {
      if (typeof teil === 'string') { text.appendChild(document.createTextNode(teil)); knoepfe.push(null); return; }
      var b = el('button', 'markierbar', teil.t);
      b.type = 'button';
      b.addEventListener('click', function () { belegTippen(j); });
      text.appendChild(b);
      knoepfe.push(b);
    });
    karte.appendChild(text);
    platz.appendChild(karte);

    var formBox = el('section', 'karte');
    formBox.appendChild(el('h2', null, T.formFrage));
    var formKnoepfe = el('div', 'antworten');
    T.formen.forEach(function (f) {
      var b = K.knopf(f.text, 'antwort', function () { formWaehlen(f.kuerzel); });
      b.dataset.kuerzel = f.kuerzel;
      formKnoepfe.appendChild(b);
    });
    formBox.appendChild(formKnoepfe);
    platz.appendChild(formBox);

    var pruefKnopf = K.knopf(T.pruefen, 'knopf-breit', pruefen);
    platz.appendChild(pruefKnopf);
    var rueck = el('div');
    rueck.setAttribute('aria-live', 'polite');
    platz.appendChild(rueck);
    var weiter = K.knopf(INHALTE.allgemein.weiter + ' →', '', function () {
      z.fall = i + 1;
      speichern();
      if (z.fall < N) fallZeigen(); else vergleichZeigen();
      K.scrollen(document.querySelector('.inhalt'));
    });
    platz.appendChild(weiter);

    function formWaehlen(k) {
      if (erledigt(fz)) return;
      fz.form = fz.form === k ? null : k;
      fz.meldung = null;
      speichern();
      darstellen();
    }
    function belegTippen(j) {
      if (erledigt(fz)) return;
      var pos = fz.belege.indexOf(j);
      if (pos >= 0) fz.belege.splice(pos, 1); else if (fz.belege.length < 2) fz.belege.push(j);
      fz.meldung = null;
      speichern();
      darstellen();
    }
    function pruefen() {
      if (erledigt(fz)) return;
      if (!fz.form || fz.belege.length !== 2) { fz.meldung = { art: 'fehlt' }; darstellen(); return; }
      if (zuSchnell()) { fz.meldung = { art: 'schnell' }; darstellen(); return; }
      fz.versuche++;
      var formOk = fz.form === fall.form;
      var falsche = fz.belege.filter(function (x) { return fall.teile[x].b !== 'beleg'; });
      if (formOk && !falsche.length) fz.geloest = true;
      else if (fz.versuche >= MAX_VERSUCHE) fz.gezeigt = true;
      else {
        fz.meldung = { art: 'falsch', formOk: formOk, falsche: falsche };
        // Richtiges bleibt stehen, Falsches wird entfernt
        if (!formOk) fz.form = null;
        fz.belege = fz.belege.filter(function (x) { return falsche.indexOf(x) === -1; });
      }
      speichern();
      darstellen();
      stand();
      if (erledigt(fz)) K.scrollen(rueck);
    }
    function darstellen() {
      var richtigeBelege = [];
      fall.teile.forEach(function (t, j) { if (typeof t === 'object' && t.b === 'beleg') richtigeBelege.push(j); });
      Array.prototype.forEach.call(formKnoepfe.children, function (b) {
        var k = b.dataset.kuerzel;
        b.className = 'knopf antwort';
        if (erledigt(fz)) { if (k === fall.form) b.classList.add('richtig'); }
        else if (fz.form === k) b.classList.add('gewaehlt');
        b.setAttribute('aria-pressed', fz.form === k ? 'true' : 'false');
        b.disabled = erledigt(fz);
      });
      knoepfe.forEach(function (b, j) {
        if (!b) return;
        b.className = 'markierbar';
        b.disabled = erledigt(fz);
        if (erledigt(fz)) { if (richtigeBelege.indexOf(j) >= 0) b.classList.add('ok'); }
        else if (fz.belege.indexOf(j) >= 0) b.classList.add('gewaehlt');
        if (!erledigt(fz) && fz.meldung && fz.meldung.falsche && fz.meldung.falsche.indexOf(j) >= 0) b.classList.add('falsch');
      });
      rueck.textContent = '';
      var m = fz.meldung;
      if (m && m.art === 'fehlt') rueck.appendChild(el('p', 'rueckmeldung falsch', T.auswahlFehlt));
      if (m && m.art === 'schnell') rueck.appendChild(el('p', 'rueckmeldung falsch', '✋ ' + T.zuSchnell));
      if (m && m.art === 'falsch') {
        if (!m.formOk) {
          var p = el('p', 'rueckmeldung falsch');
          p.appendChild(el('strong', null, '✗ ' + T.formFalsch + ' ' + INHALTE.allgemein.tippVorwort + ' '));
          p.appendChild(document.createTextNode(fall.tipp));
          rueck.appendChild(p);
        }
        m.falsche.forEach(function (j) {
          rueck.appendChild(el('p', 'rueckmeldung falsch', '✗ „' + fall.teile[j].t + '“ – ' + (fall.teile[j].b === 'schock' ? T.belegSchock : T.belegLeer)));
        });
        rueck.appendChild(el('p', null, T.zweiterVersuch));
      }
      if (fz.geloest) {
        rueck.appendChild(el('p', 'rueckmeldung richtig', '✓ ' + INHALTE.allgemein.richtigText + ' ' + formText(fall.form) + ' – ' + T.belegRichtig));
        rueck.appendChild(el('p', null, fall.erklaerung));
      }
      if (fz.gezeigt) {
        rueck.appendChild(el('p', 'rueckmeldung falsch', T.loesungGezeigt + ' ' + formText(fall.form) + '.'));
        rueck.appendChild(el('p', null, fall.erklaerung));
      }
      pruefKnopf.hidden = erledigt(fz);
      weiter.hidden = !erledigt(fz);
    }
    darstellen();
  }

  /* ---------- Zwei Patienten im Vergleich ---------- */
  function vergleichZeigen() {
    platz.textContent = '';
    angezeigt = Date.now();
    var M = T.monitor;
    var vz = z.vergleich;
    var box = el('section', 'karte');
    box.appendChild(el('h2', null, M.titel));
    box.appendChild(K.formatiert('p', null, M.text));
    var tab = el('div', 'monitorvergleich');
    var kopf = el('div', 'mv-zeile mv-kopf');
    kopf.appendChild(el('span', null, ''));
    kopf.appendChild(el('span', null, M.links));
    kopf.appendChild(el('span', null, M.rechts));
    tab.appendChild(kopf);
    var zeilen = M.zeilen.map(function (zz, i) {
      var b = el('button', 'mv-zeile');
      b.type = 'button';
      b.appendChild(el('strong', null, zz.name));
      b.appendChild(el('span', null, zz.l));
      b.appendChild(el('span', null, zz.r));
      b.addEventListener('click', function () { tippen(i); });
      tab.appendChild(b);
      return b;
    });
    box.appendChild(tab);
    var pruefKnopf = K.knopf(T.pruefen, 'knopf-breit', pruefen);
    box.appendChild(pruefKnopf);
    var rueck = el('div');
    rueck.setAttribute('aria-live', 'polite');
    box.appendChild(rueck);
    platz.appendChild(box);
    var ende = el('div');
    platz.appendChild(ende);
    platz.appendChild(K.knopf(INHALTE.allgemein.nochEinmal, 'knopf-leise', neuStart));

    function tippen(i) {
      if (erledigt(vz)) return;
      var pos = vz.gewaehlt.indexOf(i);
      if (pos >= 0) vz.gewaehlt.splice(pos, 1); else if (vz.gewaehlt.length < 2) vz.gewaehlt.push(i);
      vz.meldung = null;
      speichern();
      darstellen(false);
    }
    function pruefen() {
      if (erledigt(vz)) return;
      if (vz.gewaehlt.length !== 2) { vz.meldung = { art: 'fehlt' }; darstellen(false); return; }
      if (zuSchnell()) { vz.meldung = { art: 'schnell' }; darstellen(false); return; }
      vz.versuche++;
      var falsche = vz.gewaehlt.filter(function (x) { return !M.zeilen[x].richtig; });
      if (!falsche.length) vz.geloest = true;
      else if (vz.versuche >= MAX_VERSUCHE) vz.gezeigt = true;
      else { vz.meldung = { art: 'falsch', falsche: falsche }; vz.gewaehlt = vz.gewaehlt.filter(function (x) { return falsche.indexOf(x) === -1; }); }
      speichern();
      darstellen(true);
      stand();
    }
    function darstellen(gerade) {
      zeilen.forEach(function (b, i) {
        b.className = 'mv-zeile';
        if (erledigt(vz)) { if (M.zeilen[i].richtig) b.classList.add('ok'); }
        else if (vz.gewaehlt.indexOf(i) >= 0) b.classList.add('gewaehlt');
        if (!erledigt(vz) && vz.meldung && vz.meldung.falsche && vz.meldung.falsche.indexOf(i) >= 0) b.classList.add('falsch');
        b.disabled = erledigt(vz);
      });
      rueck.textContent = '';
      var m = vz.meldung;
      if (m && m.art === 'fehlt') rueck.appendChild(el('p', 'rueckmeldung falsch', T.auswahlFehlt.replace('die Schockform und genau zwei Befunde', 'genau zwei Zeilen')));
      if (m && m.art === 'schnell') rueck.appendChild(el('p', 'rueckmeldung falsch', '✋ ' + T.zuSchnell));
      if (m && m.art === 'falsch') {
        m.falsche.forEach(function (i) { rueck.appendChild(el('p', 'rueckmeldung falsch', M.zeilen[i].name + ': ' + M.zeilen[i].w)); });
        rueck.appendChild(el('p', null, T.zweiterVersuch));
      }
      pruefKnopf.hidden = erledigt(vz);
      ende.textContent = '';
      if (erledigt(vz)) {
        rueck.appendChild(el('p', vz.geloest ? 'rueckmeldung richtig' : 'rueckmeldung falsch', vz.geloest ? '✓ ' + M.fertig : T.loesungGezeigt));
        M.zeilen.filter(function (x) { return x.richtig; }).forEach(function (x) { rueck.appendChild(el('p', null, x.name + ': ' + x.w)); });
        if (ersterVersuch() >= T.mindestensErsterVersuch) {
          var mk = K.merksatzElement('aa2', 'Merksatz AA2');
          ende.appendChild(mk);
          K.Erledigt.merken(SEITE);
          if (gerade) setTimeout(function () { K.scrollen(mk); }, 50);
        } else {
          ende.appendChild(K.durchklickenElement(ersterVersuch(), N, T.mindestensErsterVersuch, neuStart));
        }
      }
    }
    darstellen(false);
  }

  stand();
  if (z.fall < N) fallZeigen(); else vergleichZeigen();
})();

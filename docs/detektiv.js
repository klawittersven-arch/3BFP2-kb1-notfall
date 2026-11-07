/* AA2 · Schockform-Detektiv (Programmlogik – Texte in inhalte.js → detektiv).
   Je Fall: zwei Befunde antippen und die Schockform wählen (Reihenfolge egal) → „Prüfen“.
   Schutz gegen Raten: „Prüfen“ zählt erst nach einer Mindest-Lesezeit; höchstens zwei Versuche je Fall,
   danach wird die Lösung gezeigt. „Geschafft“ nur, wenn genug Fälle beim ersten Versuch stimmen. */
(function () {
  'use strict';
  var K = window.KB1;
  var el = K.element;
  var T = K.seiteVorbereiten('detektiv');
  var SEITE = 'w2-detektiv';
  var SCHL = 'kb1nf_detektiv3';
  var platz = document.getElementById('uebung');
  var N = T.faelle.length;
  var MAX_VERSUCHE = 2;

  function leer() {
    return {
      fall: 0,
      faelle: T.faelle.map(function () { return { form: null, belege: [], versuche: 0, geloest: false, gezeigt: false, meldung: null }; })
    };
  }
  var z = K.Speicher.sitzung.lesen(SCHL);
  if (!z || !Array.isArray(z.faelle) || z.faelle.length !== N) z = leer();
  function speichern() { K.Speicher.sitzung.schreiben(SCHL, z); }

  function erledigt(f) { return f.geloest || f.gezeigt; }
  function bearbeitet() { return z.faelle.filter(erledigt).length; }
  function ersterVersuch() {
    return z.faelle.filter(function (f) { return f.geloest && f.versuche === 1; }).length;
  }
  function stand() {
    var g = bearbeitet();
    K.fortschrittSetzen(g, N);
    var fertig = g === N;
    var status = fertig ? (ersterVersuch() >= T.mindestensErsterVersuch ? 'fertig' : 'durchklicken') : 'arbeitet';
    K.melden(SEITE, g, N, status);
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
      if (z.fall < N) fallZeigen(); else ende();
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

  /* ---------- Ende: geschafft oder noch einmal ---------- */
  function ende() {
    platz.textContent = '';
    var box = el('section', 'karte detektiv-ende');
    if (ersterVersuch() >= T.mindestensErsterVersuch) {
      box.appendChild(el('h2', null, T.geschafftTitel));
      box.appendChild(el('p', 'rueckmeldung richtig', K.ersetzen(INHALTE.allgemein.ersterVersuch, { x: ersterVersuch(), y: N })));
      box.appendChild(K.formatiert('p', null, T.geschafftText));
      K.Erledigt.merken(SEITE);
      platz.appendChild(box);
    } else {
      platz.appendChild(K.durchklickenElement(ersterVersuch(), N, T.mindestensErsterVersuch, neuStart, T.durchklickenText));
    }
    platz.appendChild(K.knopf(INHALTE.allgemein.nochEinmal, 'knopf-leise', neuStart));
  }

  stand();
  if (z.fall < N) fallZeigen(); else ende();
})();

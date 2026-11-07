/* AA3 · Lagerungs-Quiz (Programmlogik – Texte in inhalte.js → lagerung).
   Je Situation: lesen → Lagerung antippen → Aufdecken (Lösung und Begründung) → nächste Situation
   → am Ende Merksatz AA3 (nur, wenn genug beim ersten Versuch richtig sind). */
(function () {
  'use strict';
  var K = window.KB1;
  var el = K.element;
  var T = K.seiteVorbereiten('lagerung');
  var SEITE = 'w2-lagerung';
  var SCHL = 'kb1nf_lagerung';
  var platz = document.getElementById('uebung');
  var N = T.karten.length;

  function leer() { return { karte: 0, wahl: T.karten.map(function () { return null; }), offen: T.karten.map(function () { return false; }) }; }
  var z = K.Speicher.sitzung.lesen(SCHL);
  if (!z || !Array.isArray(z.wahl) || z.wahl.length !== N) z = leer();
  function speichern() { K.Speicher.sitzung.schreiben(SCHL, z); }

  function aufgedeckt() { return z.offen.filter(Boolean).length; }
  function richtig() { return T.karten.filter(function (k, i) { return z.offen[i] && z.wahl[i] === k.richtig; }).length; }
  function optionText(k) { return T.optionen.filter(function (o) { return o.kuerzel === k; })[0].text; }
  function stand() {
    K.fortschrittSetzen(aufgedeckt(), N);
    var fertig = aufgedeckt() === N;
    K.melden(SEITE, aufgedeckt(), N, fertig ? (richtig() >= T.mindestensErsterVersuch ? 'fertig' : 'durchklicken') : 'arbeitet');
  }

  // Hilfe: die vier Lagerungen mit Bildern (dieselben Bilder wie im Arbeitsblatt, S. 4)
  var bilderOffen = false;
  function bilderHilfe() {
    var d = el('details', 'info lager-bilder');
    d.open = bilderOffen;
    d.addEventListener('toggle', function () { bilderOffen = d.open; });
    d.appendChild(el('summary', null, T.bilderTitel));
    d.appendChild(el('p', 'klein', T.bilderHinweis));
    T.bilder.forEach(function (b) {
      var fig = el('figure', 'lager-bild');
      var img = el('img');
      img.src = b.bild;
      img.alt = b.titel;
      img.loading = 'lazy';
      fig.appendChild(img);
      var cap = el('figcaption');
      cap.appendChild(el('strong', null, b.titel));
      cap.appendChild(document.createTextNode(' – ' + b.wann));
      fig.appendChild(cap);
      d.appendChild(fig);
    });
    return d;
  }

  function karteZeigen() {
    platz.textContent = '';
    if (z.karte >= N) return ende();
    var i = z.karte;
    var k = T.karten[i];
    var box = el('section', 'karte lagerkarte' + (k.profi ? ' profi' : ''));
    box.appendChild(el('p', 'klein', K.ersetzen(T.karteVon, { n: i + 1, y: N }) + (k.profi ? ' · ' + T.profi : '')));
    box.appendChild(el('h2', null, k.titel));
    box.appendChild(el('p', 'situation', k.text));
    platz.appendChild(box);

    var wahlBox = el('section', 'karte');
    wahlBox.appendChild(el('h2', null, T.wahlFrage));
    var antworten = el('div', 'antworten');
    T.optionen.forEach(function (o) {
      var b = K.knopf(o.text, 'antwort', function () {
        if (z.offen[i]) return;
        z.wahl[i] = o.kuerzel;
        speichern();
        darstellen();
      });
      b.dataset.kuerzel = o.kuerzel;
      antworten.appendChild(b);
    });
    wahlBox.appendChild(antworten);
    platz.appendChild(wahlBox);
    platz.appendChild(bilderHilfe());
    var aufdecken = K.knopf(T.aufdecken, '', function () {
      z.offen[i] = true;
      speichern();
      darstellen();
      stand();
      K.scrollen(loesung);
    });
    platz.appendChild(aufdecken);
    var loesung = el('section', 'karte loesung');
    loesung.setAttribute('aria-live', 'polite');
    platz.appendChild(loesung);
    var weiter = K.knopf(T.naechste, '', function () { z.karte = i + 1; speichern(); karteZeigen(); K.scrollen(document.querySelector('.inhalt')); });
    platz.appendChild(weiter);

    function darstellen() {
      Array.prototype.forEach.call(antworten.children, function (b) {
        var kz = b.dataset.kuerzel;
        b.className = 'knopf antwort';
        if (z.wahl[i] === kz) b.classList.add('gewaehlt');
        if (z.offen[i] && kz === k.richtig) b.classList.add('richtig');
        if (z.offen[i] && z.wahl[i] === kz && kz !== k.richtig) b.classList.add('falsch');
        b.disabled = z.offen[i];
      });
      aufdecken.hidden = z.offen[i];
      aufdecken.disabled = !z.wahl[i];
      loesung.hidden = !z.offen[i];
      weiter.hidden = !z.offen[i];
      loesung.textContent = '';
      if (z.offen[i]) {
        loesung.appendChild(el('p', 'rueckmeldung ' + (z.wahl[i] === k.richtig ? 'richtig' : 'falsch'), z.wahl[i] === k.richtig ? T.richtigGewaehlt : T.falschGewaehlt));
        var p = el('p');
        p.appendChild(el('strong', null, T.loesung + ' '));
        p.appendChild(document.createTextNode(k.loesung + (k.richtig === 'REA' ? '' : ' (' + optionText(k.richtig) + ')')));
        loesung.appendChild(p);
        var w = el('p');
        w.appendChild(el('strong', null, T.warum + ' '));
        w.appendChild(document.createTextNode(k.warum));
        loesung.appendChild(w);
      }
    }
    darstellen();
  }

  function ende() {
    var box = el('div');
    if (richtig() >= T.mindestensErsterVersuch) {
      box.appendChild(el('p', 'rueckmeldung richtig', K.ersetzen(INHALTE.allgemein.ersterVersuch, { x: richtig(), y: N })));
      box.appendChild(K.merksatzElement('aa3', 'Merksatz AA3'));
      K.Erledigt.merken(SEITE);
    } else {
      box.appendChild(K.durchklickenElement(richtig(), N, T.mindestensErsterVersuch, neu));
    }
    box.appendChild(K.knopf(INHALTE.allgemein.nochEinmal, 'knopf-leise', neu));
    platz.appendChild(box);
  }
  function neu() { z = leer(); speichern(); stand(); karteZeigen(); }

  stand();
  karteZeigen();
})();

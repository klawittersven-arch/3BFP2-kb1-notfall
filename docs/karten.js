/* Karten-Quiz (Programmlogik – Texte in inhalte.js → karten; Woche 1: w1/inhalte.js).
   Woche 1: AA4 „Frühzeichen oder Spätzeichen?“. Welches Quiz: KB1_PARAMS.quiz (aus der Stunden-App).
   Ablauf: eine Karte nach der anderen, Antwort antippen → sofort Rückmeldung mit Begründung → nächste Karte.
   Es zählt die erste Antwort. Am Ende: Merksatz (wie auf dem Arbeitsblatt) oder – bei zu vielen
   Fehlern – neu starten. Falsch beantwortete Karten gehen an den Beamer („Häufige Fehler“). */
(function () {
  'use strict';
  var K = window.KB1;
  var el = K.element;
  var T = K.seiteVorbereiten('karten');
  var platz = document.getElementById('uebung');
  var name = K.urlParam('quiz');
  var Q = T.quiz && T.quiz[name];

  if (!Q) {
    platz.textContent = '';
    platz.appendChild(el('section', 'karte', T.ohneQuiz));
    K.fortschrittSetzen(0, 1);
    return;
  }

  var h1 = document.getElementById('titel');
  if (h1) h1.textContent = Q.titel;
  document.title = Q.titel;
  var an = document.getElementById('anweisung');
  if (an && Q.anweisung) { an.textContent = ''; an.appendChild(K.formatiert('span', null, Q.anweisung)); }

  var SEITE = Q.seite;
  var SCHL = 'kb1nf_karten_' + name;
  var N = Q.karten.length;

  function leer() { return { karte: 0, wahl: Q.karten.map(function () { return null; }), fehler: [] }; }
  var z = K.Speicher.sitzung.lesen(SCHL);
  if (!z || !Array.isArray(z.wahl) || z.wahl.length !== N) z = leer();
  function speichern() { K.Speicher.sitzung.schreiben(SCHL, z); }

  function beantwortet() { return z.wahl.filter(function (w) { return w !== null; }).length; }
  function richtig() { return Q.karten.filter(function (k, i) { return z.wahl[i] === k.richtig; }).length; }
  function optionText(kz) { var o = Q.optionen.filter(function (x) { return x.k === kz; })[0]; return o ? o.text : ''; }
  function fertig() { return beantwortet() === N; }
  function melden() {
    var status = fertig() ? (richtig() >= Q.mindestensErsterVersuch ? 'fertig' : 'durchklicken') : 'arbeitet';
    K.melden(SEITE, beantwortet(), N, status, z.fehler);
  }

  function zeigen() {
    platz.textContent = '';
    K.fortschrittSetzen(beantwortet(), N);
    if (z.karte >= N) { endeZeigen(); return; }
    var i = z.karte;
    var k = Q.karten[i];
    var box = el('section', 'karte quiz-karte');
    box.appendChild(el('p', 'klein', K.ersetzen(T.karteVon, { n: i + 1, y: N })));
    box.appendChild(K.formatiert('p', 'quiz-text', k.text));
    var opt = el('div', 'antworten quiz-optionen');
    var gewaehlt = z.wahl[i];
    Q.optionen.forEach(function (o) {
      var klasse = 'antwort';
      if (gewaehlt !== null) {
        if (o.k === k.richtig) klasse += ' richtig';
        else if (o.k === gewaehlt) klasse += ' falsch';
      }
      var b = K.knopf(o.text, klasse, function () {
        if (z.wahl[i] !== null) return;
        z.wahl[i] = o.k;
        if (o.k !== k.richtig && z.fehler.indexOf(k.id) < 0) z.fehler.push(k.id);
        speichern();
        zeigen();
        melden();
      });
      b.disabled = gewaehlt !== null;
      b.setAttribute('data-option', o.k);
      opt.appendChild(b);
    });
    box.appendChild(opt);
    if (gewaehlt !== null) {
      var ok = gewaehlt === k.richtig;
      var rm = el('div', 'rueckmeldung ' + (ok ? 'ist-richtig' : 'ist-falsch'));
      rm.setAttribute('aria-live', 'polite');
      rm.appendChild(el('p', 'rueck-titel', ok ? '✓ ' + T.richtig : '✗ ' + K.ersetzen(T.falsch, { a: optionText(k.richtig) })));
      rm.appendChild(K.formatiert('p', null, k.warum));
      box.appendChild(rm);
      box.appendChild(K.knopf(i + 1 < N ? T.naechste : T.auswerten, 'knopf-breit quiz-weiter', function () {
        z.karte = i + 1;
        speichern();
        zeigen();
        K.scrollen(document.querySelector('.inhalt'));
      }));
    }
    platz.appendChild(box);
    if (gewaehlt !== null) K.scrollen(box.querySelector('.rueckmeldung'));
  }

  function endeZeigen() {
    var box = el('section');
    box.appendChild(el('p', 'rueckmeldung ' + (richtig() >= Q.mindestensErsterVersuch ? 'richtig' : 'falsch'), K.ersetzen(INHALTE.allgemein.ersterVersuch, { x: richtig(), y: N })));
    if (richtig() >= Q.mindestensErsterVersuch) {
      var m = K.merksatzElement(Q.merksatz, Q.merksatzTitel);
      box.appendChild(m);
      box.appendChild(K.formatiert('p', 'klein', T.warten));
      K.Erledigt.merken(SEITE);
      platz.appendChild(box);
      setTimeout(function () { K.scrollen(m); }, 50);
    } else {
      box.appendChild(K.durchklickenElement(richtig(), N, Q.mindestensErsterVersuch, neu, T.durchklickenText));
      platz.appendChild(box);
    }
    var p = el('p', 'klein');
    p.appendChild(K.knopf(INHALTE.allgemein.nochEinmal, 'knopf-leise', neu));
    platz.appendChild(p);
  }

  function neu() { var f = z.fehler; z = leer(); z.fehler = f; speichern(); zeigen(); melden(); K.scrollen(document.querySelector('.inhalt')); }

  zeigen();
  melden();
})();

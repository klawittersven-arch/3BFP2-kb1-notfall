/* Kette bauen (Programmlogik – Texte in inhalte.js → kette; Woche 1: w1/inhalte.js).
   Woche 1: AA2 a „Regelkreis“ und AA3 „Schockspirale“. Welche Kette: KB1_PARAMS.kette (aus der Stunden-App).
   Ablauf: Der erste Schritt steht fest. Bei jedem weiteren Schritt stehen drei Karten zur Wahl:
   der richtige nächste Schritt, ein späterer Schritt (zu früh, frühestens der übernächste) und – wo es passt – eine Fehlerkarte.
   Richtig → die Karte wandert in die Kette. Falsch → Begründung, noch einmal wählen.
   Am Ende: Merksatz (wie auf dem Arbeitsblatt). Schutz gegen Durchklicken: zu wenige Schritte beim
   ersten Versuch richtig → neu starten. Fehler beim ersten Versuch gehen an den Beamer („Häufige Fehler“). */
(function () {
  'use strict';
  var K = window.KB1;
  var el = K.element;
  var T = K.seiteVorbereiten('kette');
  var platz = document.getElementById('uebung');
  var name = K.urlParam('kette');
  var KT = T.ketten && T.ketten[name];

  if (!KT) {
    platz.textContent = '';
    platz.appendChild(el('section', 'karte', T.ohneKette));
    K.fortschrittSetzen(0, 1);
    return;
  }

  // Titel und Auftrag der gewählten Kette
  var h1 = document.getElementById('titel');
  if (h1) h1.textContent = KT.titel;
  document.title = KT.titel;
  var an = document.getElementById('anweisung');
  if (an && KT.anweisung) { an.textContent = ''; an.appendChild(K.formatiert('span', null, KT.anweisung)); }

  var SEITE = KT.seite;
  var SCHL = 'kb1nf_kette_' + name;
  var S = KT.schritte;
  var N = S.length - 1;                    // zu wählende Schritte (der erste steht fest)

  function leer() { return { k: 1, optionen: {}, falsch: {}, ersteRichtig: 0, fehler: [], fertig: false }; }
  var z = K.Speicher.sitzung.lesen(SCHL);
  if (!z || typeof z.k !== 'number' || z.k < 1 || z.k > S.length) z = leer();
  function speichern() { K.Speicher.sitzung.schreiben(SCHL, z); }

  function karte(id) {
    for (var i = 0; i < S.length; i++) if (S[i].id === id) return { karte: S[i], nr: i, fehler: false };
    for (var j = 0; j < (KT.ablenker || []).length; j++) if (KT.ablenker[j].id === id) return { karte: KT.ablenker[j], nr: -1, fehler: true };
    return null;
  }

  // Drei Karten für Schritt k: richtig, ein späterer Schritt, eine Fehlerkarte (oder ein zweiter späterer Schritt)
  function optionenFuer(k) {
    if (z.optionen[k]) return z.optionen[k];
    var ids = [S[k].id];
    // „zu früh“: frühestens der übernächste Schritt (der nächste kann fast gleichzeitig passieren)
    var spaeter = K.mischen(S.slice(k + 2)).map(function (s) { return s.id; });
    var fehler = K.mischen((KT.ablenker || []).filter(function (a) { return (a.bei || []).indexOf(k) >= 0; })).map(function (a) { return a.id; });
    if (spaeter.length) ids.push(spaeter.shift());
    if (fehler.length) ids.push(fehler.shift());
    var rest = spaeter.concat(fehler, K.mischen((KT.ablenker || []).map(function (a) { return a.id; })));
    while (ids.length < 3 && rest.length) { var x = rest.shift(); if (ids.indexOf(x) < 0) ids.push(x); }
    z.optionen[k] = K.mischen(ids);
    speichern();
    return z.optionen[k];
  }

  function melden() {
    var status = z.fertig ? (z.ersteRichtig >= KT.mindestensErsterVersuch ? 'fertig' : 'durchklicken') : 'arbeitet';
    K.melden(SEITE, Math.min(z.k - 1, N), N, status, z.fehler);
  }

  function waehlen(k, id) {
    if (z.fertig || k !== z.k) return;
    var falsch = z.falsch[k] = z.falsch[k] || [];
    if (id === S[k].id) {
      if (!falsch.length) z.ersteRichtig++;
      z.k++;
      if (z.k > N) z.fertig = true;
      speichern();
      zeigen(true);
      melden();
      return;
    }
    if (falsch.indexOf(id) < 0) {
      if (!falsch.length && z.fehler.indexOf(id) < 0) z.fehler.push(id);   // nur der erste Fehlversuch je Schritt zählt
      falsch.push(id);
    }
    speichern();
    zeigen(false, id);
    melden();
  }

  function zeigen(nachRichtig, zuletztFalsch) {
    platz.textContent = '';
    K.fortschrittSetzen(Math.min(z.k - 1, N), N);
    var box = el('section', 'reihe' + (z.fertig ? ' ist-richtig' : ''));
    box.appendChild(el('p', 'reihe-label', KT.ketteTitel || T.ketteTitel));
    var ol = el('ol', 'reihe-gelegt');
    for (var i = 0; i < Math.min(z.k, S.length); i++) {
      var li = el('li', 'gelegt');
      li.appendChild(el('span', 'gelegt-nummer', String(i + 1)));
      var t = el('span', 'gelegt-text');
      t.appendChild(K.formatiert('span', null, S[i].text));
      if (S[i].warum && i > 0) t.appendChild(K.formatiert('small', 'gelegt-warum', S[i].warum));
      li.appendChild(t);
      ol.appendChild(li);
    }
    box.appendChild(ol);
    if (z.fertig && KT.ende) box.appendChild(K.formatiert('p', 'kette-ende', KT.ende));
    platz.appendChild(box);

    if (z.fertig) { endeZeigen(); return; }

    var k = z.k;
    var frage = el('section', 'karte');
    frage.appendChild(el('h2', null, K.ersetzen(T.frage, { n: k + 1 })));
    var opt = el('div', 'reihe-auswahl');
    var falsch = z.falsch[k] || [];
    optionenFuer(k).forEach(function (id) {
      var x = karte(id);
      if (!x) return;
      var ist = falsch.indexOf(id) >= 0;
      var b = K.knopf('', 'antwort' + (ist ? ' falsch' : ''), function () { waehlen(k, id); });
      b.appendChild(K.formatiert('span', null, x.karte.text));
      b.disabled = ist;
      b.setAttribute('data-karte', id);
      opt.appendChild(b);
    });
    frage.appendChild(opt);
    if (zuletztFalsch) {
      var x = karte(zuletztFalsch);
      var rm = el('div', 'rueckmeldung ist-falsch');
      rm.setAttribute('aria-live', 'polite');
      rm.appendChild(el('p', 'rueck-titel', '✗ ' + (x && x.fehler ? T.fehlerkarte : T.zuFrueh)));
      if (x && x.fehler && x.karte.warum) rm.appendChild(K.formatiert('p', null, x.karte.warum));
      else if (S[k].tipp) rm.appendChild(K.formatiert('p', null, T.tippVorwort + ' ' + S[k].tipp));
      frage.appendChild(rm);
    } else if (nachRichtig && k > 1) {
      var ok = el('p', 'rueckmeldung ist-richtig', '✓ ' + T.richtig);
      frage.insertBefore(ok, opt);
    }
    platz.appendChild(frage);
    if (zuletztFalsch || nachRichtig) K.scrollen(frage);
    unten();
  }

  function endeZeigen() {
    var box = el('section');
    if (z.ersteRichtig >= KT.mindestensErsterVersuch) {
      box.appendChild(el('p', 'rueckmeldung richtig', K.ersetzen(INHALTE.allgemein.ersterVersuch, { x: z.ersteRichtig, y: N })));
      var m = K.merksatzElement(KT.merksatz, KT.merksatzTitel);
      box.appendChild(m);
      box.appendChild(K.formatiert('p', 'klein', T.warten));
      K.Erledigt.merken(SEITE);
      platz.appendChild(box);
      setTimeout(function () { K.scrollen(m); }, 50);
    } else {
      box.appendChild(K.durchklickenElement(z.ersteRichtig, N, KT.mindestensErsterVersuch, neu, T.durchklickenText));
      platz.appendChild(box);
    }
    unten();
  }

  function neu() { var f = z.fehler; z = leer(); z.fehler = f; speichern(); zeigen(); melden(); K.scrollen(document.querySelector('.inhalt')); }
  function unten() {
    var p = el('p', 'klein');
    p.appendChild(K.knopf(INHALTE.allgemein.nochEinmal, 'knopf-leise', neu));
    platz.appendChild(p);
  }

  zeigen();
  melden();
})();

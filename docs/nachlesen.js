/* Nachlese-Seite (w2-nachlesen.html): alle Inhalte der Stunde zum Wiederholen – Programmlogik.
 * Texte: inhalte.js, inhalte_stunde.js und inhalte_nachlesen.js (aus dem Arbeitsblatt erzeugt).
 * Gesperrt, solange irgendwo eine Beamer-Stunde läuft (Abfrage beim Worker, alle 30 Sekunden neu). */
(function () {
  'use strict';

  var K = window.KB1;
  var el = K.element;
  var fmt = K.formatiert;
  var I = window.INHALTE, S = window.STUNDE, N = window.NACHLESEN;
  var C = window.CONFIG || {};
  var BASIS = String(C.FORTSCHRITT_URL || '').replace(/\/+$/, '');
  var inhalt = document.getElementById('inhalt');

  document.getElementById('kopfzeile').textContent = I.allgemein.kopfzeile;
  document.getElementById('titel').textContent = 'Nachlesen: ' + S.titel;
  document.title = 'Nachlesen – ' + S.titel;

  function folie(id) { return S.folien.filter(function (f) { return f.id === id; })[0]; }
  function p(text, klasse) { return fmt('p', klasse || null, text); }
  function box(klasse, kinder) {
    var b = el('div', klasse);
    kinder.forEach(function (k) { if (k) b.appendChild(typeof k === 'string' ? p(k) : k); });
    return b;
  }
  function aufgabe(nr) {
    var a = N.aufgaben[nr];
    var w = document.createDocumentFragment();
    if (!a) return w;
    if (a.vorsatz) w.appendChild(p(a.vorsatz, 'vorsatz'));
    var t = el('p', 'aufgabe');
    t.appendChild(document.createTextNode(a.nr + ' ' + a.text + ' '));
    t.appendChild(el('span', 'punkte', '(' + a.punkte + ' P.)'));
    w.appendChild(t);
    return w;
  }
  function loesung(schluessel) {
    var z = N.loesungen[schluessel];
    if (!z) {
      Object.keys(N.loesungen).forEach(function (k) { if (k.indexOf(schluessel) === 0) z = N.loesungen[k]; });
    }
    return box('loesung', (z || []).map(function (x) { return p(x); }));
  }
  function merksatz(teile) {
    return teile.map(function (t) { return typeof t === 'string' ? t : '**' + t.l + '**'; }).join('');
  }

  var abschnitte = [];
  function abschnitt(titel, bau) { abschnitte.push({ titel: titel, bau: bau }); }

  /* ---------- Inhalte ---------- */
  abschnitt('Leitfall: Frau Maler', function (w) {
    var f = folie('fall'), a = folie('aufloesung');
    w.appendChild(box('box', [f.einleitung, f.zitat + ' – ' + f.zitatWer]));
    w.appendChild(p('**Leitfrage:** ' + f.leitfrage, 'leitfrage'));
    w.appendChild(el('h3', null, 'Die Kausalkette'));
    var ol = el('ol', 'kette');
    a.kette.forEach(function (g) { var li = el('li'); li.appendChild(fmt('strong', null, g.titel)); li.appendChild(document.createTextNode(' – ' + g.text)); ol.appendChild(li); });
    w.appendChild(ol);
    w.appendChild(box('loesung', ['**' + a.antwortTitel + ':** ' + a.antwort]));
    w.appendChild(el('h3', null, 'Placemat: die vier Zeitpunkte'));
    w.appendChild(box('box', N.placemat));
    w.appendChild(el('h3', null, 'Klausurtraining'));
    ['7.1', '7.2'].forEach(function (nr) { w.appendChild(aufgabe(nr)); w.appendChild(loesung(nr)); });
  });

  abschnitt('Einstieg: Wie hätten Sie gehandelt?', function (w) {
    I.entscheidung.fragen.forEach(function (f) {
      var k = el('div', 'zeile-karte');
      k.appendChild(el('h4', null, f.nr));
      k.appendChild(p(f.frage));
      var r = f.optionen.filter(function (o) { return o.charAt(0) === f.richtig; })[0];
      k.appendChild(el('p', 'richtig-antwort', '✓ ' + r));
      k.appendChild(p(f.erklaerung));
      w.appendChild(k);
    });
  });

  abschnitt('Gruppenpuzzle: drei Schockformen', function (w) {
    ['A', 'B', 'C'].forEach(function (b) {
      var r = S.rollen[b], e = N.experten[r.fall], info = S.experten[r.fall];
      w.appendChild(el('h3', null, b + ' · ' + r.form));
      w.appendChild(el('h4', null, 'Fallsituation'));
      w.appendChild(box('box', e.fall));
      w.appendChild(el('h4', null, 'Hinweise im Fall'));
      var ul = el('ul', 'hinweise');
      I.markieren.faelle[r.fall].teile.forEach(function (t) {
        if (typeof t !== 'object' || !t.k) return;
        var li = el('li');
        li.appendChild(el('span', 'kat ' + t.k, I.markieren.kategorien[t.k]));
        var zitat = /^[„"]/.test(t.t) ? t.t : '„' + t.t + '“';
        li.appendChild(document.createTextNode(' ' + zitat + ' – ' + t.w));
        ul.appendChild(li);
      });
      w.appendChild(ul);
      w.appendChild(el('h4', null, 'Infotext'));
      w.appendChild(box('box', info.info.concat(['**Wörterhilfe:** ' + info.woerter.split(' | ').join(' · ')])));
      w.appendChild(el('h4', null, 'Experten-Check'));
      S.check[b].forEach(function (q, i) {
        w.appendChild(box('zeile-karte', [(i + 1) + '. ' + q.frage, el('p', 'richtig-antwort', '✓ ' + q.optionen[q.richtig])]));
      });
      w.appendChild(el('h4', null, 'Klausuraufgabe 1.1 – mögliche Symptome'));
      w.appendChild(box('loesung', e.nennen));
    });
    w.appendChild(aufgabe('1.1'));
    w.appendChild(box('loesung', [N.loesungen['1.1'][3]]));
  });

  abschnitt('Vergleichstabelle', function (w) {
    N.vergleich.forEach(function (z) {
      w.appendChild(box('zeile-karte', [el('h4', null, z[0]), '**A hypovolämisch:** ' + z[1], '**B anaphylaktisch:** ' + z[2], '**C neurogen:** ' + z[3]]));
    });
    w.appendChild(box('loesung', ['**Gemeinsamkeit:** ' + N.gemeinsamkeit]));
  });

  abschnitt('Merksätze', function (w) {
    [['aa1', 'Merksatz AA1'], ['aa2', 'Merksatz AA2'], ['aa3', 'Merksatz AA3'], ['aa4', 'Merksatz AA4']].forEach(function (m) {
      w.appendChild(box('box', ['**' + m[1] + ':** ' + merksatz(I.merksaetze[m[0]])]));
    });
  });

  abschnitt('Schockform-Detektiv', function (w) {
    var formen = {};
    I.detektiv.formen.forEach(function (f) { formen[f.kuerzel] = f.text; });
    I.detektiv.faelle.forEach(function (f, i) {
      var text = f.teile.map(function (t) { return typeof t === 'string' ? t : t.t; }).join('');
      var belege = f.teile.filter(function (t) { return typeof t === 'object' && t.b === 'beleg'; }).map(function (t) { return '„' + t.t + '“'; });
      w.appendChild(box('zeile-karte', [el('h4', null, 'Fall ' + (i + 1)), text,
        el('p', 'richtig-antwort', '✓ ' + formen[f.form] + 'er Schock'), '**Belege:** ' + belege.join(' · '), f.erklaerung]));
    });
    var m = I.detektiv.monitor;
    var k = box('zeile-karte', [el('h4', null, m.titel), '**Links:** ' + m.links + ' · **Rechts:** ' + m.rechts]);
    m.zeilen.forEach(function (z) {
      k.appendChild(p((z.richtig ? '✓ ' : '') + '**' + z.name + ':** ' + z.l + ' | ' + z.r + ' – ' + z.w));
    });
    w.appendChild(k);
    w.appendChild(el('h3', null, 'Klausurtraining'));
    ['2.1', '2.2'].forEach(function (nr) { w.appendChild(aufgabe(nr)); w.appendChild(loesung(nr)); });
  });

  abschnitt('Lagerung nach Leitsymptom', function (w) {
    N.pikto.forEach(function (x) {
      var d = el('div', 'pikto');
      var img = el('img');
      img.src = 'bilder/' + x.bild;
      img.alt = x.titel;
      d.appendChild(img);
      d.appendChild(box(null, ['**' + x.titel + '**', x.wann, x.warum]));
      w.appendChild(d);
    });
    w.appendChild(el('h3', null, 'Entscheidungsweg – von oben nach unten prüfen'));
    w.appendChild(box('box', N.weg.map(function (z) { return z.frage + ' → **' + z.antwort + '**'; })));
    w.appendChild(el('h3', null, 'Lagerungskarten'));
    I.lagerung.karten.forEach(function (c) {
      w.appendChild(box('zeile-karte', [el('h4', null, c.titel), c.text, el('p', 'richtig-antwort', '✓ ' + c.loesung), c.warum]));
    });
    w.appendChild(el('h3', null, 'Klausurtraining'));
    ['3.1', '3.2'].forEach(function (nr) { w.appendChild(aufgabe(nr)); w.appendChild(loesung(nr)); });
  });

  abschnitt('Notfall-Simulation (Anaphylaxie)', function (w) {
    N.drehbuch.forEach(function (z) {
      w.appendChild(box('zeile-karte', [z[0], '**Richtig:** ' + z[1], '**Typische Fehler:** ' + z[2]]));
    });
    w.appendChild(el('h3', null, 'Nachbesprechung: Warum unterschiedlich gelagert?'));
    w.appendChild(loesung('**b) Nachbesprechung'));
    w.appendChild(el('h3', null, 'Klausurtraining'));
    w.appendChild(aufgabe('4.1'));
    w.appendChild(loesung('4.1'));
  });

  abschnitt('Wer darf was?', function (w) {
    var e = folie('aa5a').ecken;
    N.werDarfWas.forEach(function (t, i) { w.appendChild(box('zeile-karte', ['**' + e[i].emoji + ' ' + e[i].text + ':** ' + t])); });
    w.appendChild(box('box', N.verantwortung));
    w.appendChild(el('h3', null, 'Adrenalin oder Antihistaminikum?'));
    w.appendChild(box('box', N.adrenalin.map(function (z) { return z[0] + ' → ' + z[1]; }).concat(N.adrenalinText)));
    folie('aa5b').sprecher.forEach(function (sp) { w.appendChild(p('💬 **' + sp.wer + ':** ' + sp.text)); });
    w.appendChild(aufgabe('5.1'));
    w.appendChild(loesung('5.1'));
  });

  abschnitt('Klausurtraining wie in der KA (AA6)', function (w) {
    w.appendChild(box('box', N.transferfall));
    ['6.1', '6.2'].forEach(function (nr) { w.appendChild(aufgabe(nr)); });
    w.appendChild(loesung('6.1 und 6.2'));
    w.appendChild(aufgabe('6.3'));
    w.appendChild(loesung('6.3'));
  });

  abschnitt('Ich-kann-Liste', function (w) {
    var t = el('table', 'ikl');
    var kopf = el('tr');
    kopf.appendChild(el('th', null, 'Ich kann …'));
    kopf.appendChild(el('th', null, 'Nachlesen in …'));
    t.appendChild(kopf);
    N.ikl.forEach(function (z) {
      var tr = el('tr');
      tr.appendChild(el('td', null, z[0]));
      tr.appendChild(el('td', null, z[1]));
      t.appendChild(tr);
    });
    w.appendChild(t);
    w.appendChild(el('p', 'klein-grau', 'Quellen: S2k-Leitlinie Akuttherapie und Management der Anaphylaxie (AWMF 061-025, 2021); MSD Manual Profi-Ausgabe: Schock; Ich-kann-Liste KB I; sprachlich vereinfacht.'));
  });

  /* ---------- Anzeige ---------- */
  function zeigen() {
    inhalt.textContent = '';
    var iv = el('nav', 'inhaltsverzeichnis');
    iv.appendChild(el('h2', null, 'Inhalt'));
    var ol = el('ol');
    var ziele = [];
    abschnitte.forEach(function (a, i) {
      var li = el('li');
      var b = K.knopf(a.titel, 'textknopf-leise', function () { ziele[i].scrollIntoView({ behavior: 'smooth' }); });
      li.appendChild(b);
      ol.appendChild(li);
    });
    iv.appendChild(ol);
    inhalt.appendChild(iv);
    abschnitte.forEach(function (a) {
      var s = el('section', 'abschnitt');
      var h = el('h2', null, a.titel);
      s.appendChild(h);
      ziele.push(h);
      a.bau(s);
      inhalt.appendChild(s);
    });
  }

  function gesperrt(text) {
    inhalt.textContent = '';
    var g = el('section', 'gesperrt');
    g.appendChild(el('div', 'emoji', '🔒'));
    g.appendChild(el('h2', null, 'Noch gesperrt'));
    g.appendChild(el('p', null, text));
    inhalt.appendChild(g);
  }

  var timer = null;
  function pruefen() {
    clearTimeout(timer);
    if (!BASIS) { zeigen(); return; }
    fetch(BASIS + '/api/nachlesen', { cache: 'no-store', mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.frei) zeigen();
        else { gesperrt('Die Stunde läuft gerade noch. Diese Seite öffnet sich automatisch, sobald die Stunde am Beamer beendet ist.'); timer = setTimeout(pruefen, 30000); }
      })
      .catch(function () { gesperrt('Keine Verbindung. Bitte öffnen Sie die Seite mit Internet – sie prüft, ob die Stunde schon beendet ist.'); timer = setTimeout(pruefen, 15000); });
  }
  pruefen();
})();

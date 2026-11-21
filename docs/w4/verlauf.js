/* Blatt 2 · Live-Verlauf am Handy: „Frühdienst – drei Patienten, eine Ampel“.
   Die Messkarten kommen nacheinander, je Karte läuft eine Uhr (Lesen und Entscheiden).
   Läuft die Zeit ab, zählt das wie 🟢 („nichts unternommen“). */
'use strict';
(function () {
  var V = W4.verlauf, AMP = W4.ampel, el = A.el;
  var STUFE = { gruen: 0, gelb: 1, rot: 2 };
  var person = {};
  V.patienten.forEach(function (p) { person[p.id] = p; });

  var wahl, i;
  function neu() { wahl = []; i = 0; melden(false); karte(); }

  // Bewertet eine Entscheidung: { art: 'richtig'|'fehlalarm'|'vorsichtig'|'zuspaet'|'trend', text }
  function bewerten(gewaehlt, richtig) {
    if (gewaehlt === richtig) return { art: 'richtig', titel: '✓ Richtig' };
    if (gewaehlt === 'rot') return { art: 'fehlalarm', titel: '✗ Fehlalarm – das ist (noch) kein Notfall' };
    if (STUFE[gewaehlt] > STUFE[richtig]) return { art: 'vorsichtig', titel: '◐ Zu vorsichtig – kein Fehlalarm, aber kein Punkt' };
    if (richtig === 'rot') return { art: 'zuspaet', titel: '✗ Zu spät – das ist ein Notfall!' };
    return { art: 'trend', titel: '✗ Hier hätten Sie genauer hinsehen müssen' };
  }

  function karte() {
    var h = A.haupt();
    if (i >= V.karten.length) return ende();
    var k = V.karten[i], p = person[k.wer];
    var anz = A.uhrAnzeige(V.sekunden);
    var knoepfe = el('div', { klasse: 'ampel' });
    var box = el('section', { klasse: 'karte' },
      el('div', { klasse: 'zeit', text: k.zeit + ' Uhr' }),
      el('div', { klasse: 'person', text: 'Karte ' + k.nr + ' · ' + p.name }),
      el('div', { klasse: 'leise', text: p.kurz }),
      el('div', { klasse: 'werte' },
        el('div', null, el('b', { text: String(k.puls) }), el('span', { text: 'Puls /min' })),
        el('div', null, el('b', { text: k.rr[0] + '/' + k.rr[1] }), el('span', { text: 'RR mmHg' })),
        el('div', null, el('b', { text: String(k.af) }), el('span', { text: 'Atemzüge /min' }))),
      k.vorwert ? el('p', { klasse: 'vorwert', text: 'Vorwert: ' + k.vorwert }) : null,
      el('p', { text: k.beobachtung }),
      el('p', { klasse: 'zitat', text: k.aussage }),
      anz.box,
      knoepfe);
    h.appendChild(A.fortschritt(i + 1, V.karten.length));
    h.appendChild(box);
    var u;
    function entscheiden(stufe) {
      u.stop();
      Array.prototype.forEach.call(knoepfe.children, function (b) { b.disabled = true; if (b.dataset.stufe === stufe) b.classList.add('gewaehlt'); });
      var b = bewerten(stufe || 'gruen', k.richtig);
      wahl.push({ nr: k.nr, wer: k.wer, gewaehlt: stufe || 'gruen', zeitAus: !stufe, richtig: k.richtig, art: b.art });
      var klasse = b.art === 'richtig' ? 'ok' : (b.art === 'vorsichtig' ? 'mittel' : 'nein');
      box.appendChild(el('div', { klasse: 'rueck ' + klasse },
        el('strong', { text: (stufe ? '' : '⏱ Zeit abgelaufen – das zählt wie 🟢. ') + b.titel }),
        el('span', { text: 'Richtig ist ' + AMP[k.richtig].zeichen + ' ' + AMP[k.richtig].kurz + '. ' + k.begruendung })));
      if (k.wer === 'finn') box.appendChild(el('div', { klasse: 'hinweis', text: '✍️ Tragen Sie Finns Puls und Blutdruck (' + k.zeit + ' Uhr) in die Kurve auf dem Arbeitsblatt ein.' }));
      var w = el('button', { klasse: 'knopf', type: 'button', text: i + 1 < V.karten.length ? 'Nächste Messkarte' : 'Auflösung' });
      w.addEventListener('click', function () { i++; karte(); window.scrollTo(0, 0); });
      box.appendChild(w);
      melden(false);
    }
    ['gruen', 'gelb', 'rot'].forEach(function (s) {
      var b = el('button', { klasse: s, type: 'button', 'data-stufe': s },
        el('span', { klasse: 'z', text: AMP[s].zeichen }), el('span', { text: AMP[s].lang }));
      b.addEventListener('click', function () { entscheiden(s); });
      knoepfe.appendChild(b);
    });
    u = A.uhr(V.sekunden, anz.setzen, function () { entscheiden(null); });
  }

  function stand() {
    var punkte = wahl.filter(function (w) { return w.art === 'richtig'; }).length;
    var fehlalarme = wahl.filter(function (w) { return w.art === 'fehlalarm'; }).length;
    var letzteFinn = wahl.filter(function (w) { return w.nr === 6; })[0];
    var finn = !!(letzteFinn && letzteFinn.gewaehlt === 'rot');
    return { punkte: punkte, fehlalarme: fehlalarme, finn: finn, gewonnen: finn && fehlalarme <= 1 };
  }
  // anonymer Fortschritt für die freiwillige Lehreransicht: entschiedene Karten von 6, fertig ja/nein
  function melden(fertig) {
    A.fortschrittMelden('verlauf', wahl.length, V.karten.length, fertig);
  }


  // Finns Werte als kleine Kurve (Puls ●, Blutdruck als Balken von unten nach oben)
  function kurve(mitAcht) {
    var punkte = V.karten.filter(function (k) { return k.wer === 'finn'; }).map(function (k) { return { zeit: k.zeit, puls: k.puls, rr: k.rr }; });
    if (mitAcht) punkte.push({ zeit: V.aufloesung.zeit, puls: V.aufloesung.puls, rr: V.aufloesung.rr });
    var B = 320, H = 190, l = 34, r = 10, o = 10, u = 24, min = 60, max = 140;
    var x = function (j) { return l + (j + 0.5) * (B - l - r) / punkte.length; };
    var y = function (v) { return o + (max - v) * (H - o - u) / (max - min); };
    var s = '<svg viewBox="0 0 ' + B + ' ' + H + '" width="100%" role="img" aria-label="Kurve: Puls steigt, Blutdruck fällt">';
    for (var v = min; v <= max; v += 20) s += '<line x1="' + l + '" x2="' + (B - r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#d5dde0"/><text x="' + (l - 4) + '" y="' + (y(v) + 4) + '" font-size="10" text-anchor="end" fill="#56656c">' + v + '</text>';
    var linie = '';
    punkte.forEach(function (p, j) {
      s += '<line x1="' + x(j) + '" x2="' + x(j) + '" y1="' + y(p.rr[0]) + '" y2="' + y(p.rr[1]) + '" stroke="#2e75b6" stroke-width="7" stroke-linecap="round" opacity=".55"/>';
      s += '<text x="' + x(j) + '" y="' + (H - 8) + '" font-size="11" text-anchor="middle" fill="#1d2a30">' + p.zeit + '</text>';
      linie += (j ? ' L' : 'M') + x(j) + ' ' + y(p.puls);
    });
    s += '<path d="' + linie + '" fill="none" stroke="#c0392b" stroke-width="2.5"/>';
    punkte.forEach(function (p, j) { s += '<circle cx="' + x(j) + '" cy="' + y(p.puls) + '" r="5" fill="#c0392b"/>'; });
    s += '</svg>';
    var d = el('div');
    d.innerHTML = s;
    return el('div', null, d, el('p', { klasse: 'leise', text: '● rot = Puls · blauer Balken = Blutdruck (oben systolisch, unten diastolisch). Puls und systolischer Wert laufen wie eine Schere aufeinander zu.' }));
  }

  function ende() {
    var h = A.haupt(), s = stand(), A8 = V.aufloesung;
    melden(true);
    h.appendChild(el('section', { klasse: 'karte' },
      el('h2', { text: s.finn ? 'Finn ist gerettet' : A8.titel }),
      s.finn ? el('p', { text: A8.gerettet })
        : el('div', null,
          el('div', { klasse: 'werte' },
            el('div', null, el('b', { text: String(A8.puls) }), el('span', { text: 'Puls /min' })),
            el('div', null, el('b', { text: A8.rr[0] + '/' + A8.rr[1] }), el('span', { text: 'RR mmHg' })),
            el('div', null, el('b', { text: String(A8.af) }), el('span', { text: 'Atemzüge /min' }))),
          el('p', { text: A8.beobachtung + ' ' + A8.aussage }),
          el('p', { text: A8.text })),
      el('h3', { text: 'Finns Verlauf' }),
      kurve(!s.finn)));
    var tab = el('table', { klasse: 'tab' }, el('tr', null, el('th', { text: 'Karte' }), el('th', { text: 'Person' }), el('th', { text: 'Ihre Wahl' }), el('th', { text: 'richtig' })));
    wahl.forEach(function (w) {
      tab.appendChild(el('tr', null, el('td', { text: String(w.nr) }), el('td', { text: person[w.wer].name.replace(/ \(.*/, '') }),
        el('td', { text: AMP[w.gewaehlt].zeichen + (w.zeitAus ? ' (Zeit)' : '') }), el('td', { text: AMP[w.richtig].zeichen + (w.art === 'richtig' ? ' ✓' : '') })));
    });
    var text = s.gewonnen ? V.ergebnis.gewonnen : (!s.finn ? V.ergebnis.uebersehen : V.ergebnis.fehlalarme);
    h.appendChild(el('section', { klasse: 'karte ergebnis' },
      el('h2', { text: 'Ergebnis' }),
      el('div', { klasse: 'gross ' + (s.gewonnen ? 'sieg' : 'niederlage'), text: s.gewonnen ? 'Gewonnen!' : 'Nicht gewonnen' }),
      el('p', { text: text }),
      el('p', { text: 'Punkte: ' + s.punkte + ' / ' + V.karten.length + ' · Fehlalarme: ' + s.fehlalarme + ' · Finn rechtzeitig gemeldet: ' + (s.finn ? 'ja' : 'nein') }),
      tab,
      el('div', { klasse: 'hinweis', text: '✍️ Übertragen Sie Ihre Entscheidungen in die Tabelle auf dem Arbeitsblatt und haken Sie ab, was richtig war.' }),
      el('button', { klasse: 'knopf zweit', type: 'button', text: 'Noch einmal spielen', onclick: function () { neu(); window.scrollTo(0, 0); } })));
  }

  A.start({
    titel: V.titel,
    absaetze: [
      V.einleitung,
      el('ul', { klasse: 'liste' }, V.patienten.map(function (p) { return el('li', null, el('strong', { text: p.name + ': ' }), p.kurz); })),
      el('ul', { klasse: 'liste' }, ['gruen', 'gelb', 'rot'].map(function (s) { return el('li', { text: AMP[s].zeichen + ' ' + AMP[s].lang }); })),
      'Pro Karte haben Sie **' + V.sekunden + ' Sekunden**. Rechnen Sie den Schockindex im Kopf oder auf dem Blatt (Puls : systolischer Blutdruck).'
    ],
    regel: V.regel,
    knopf: 'Frühdienst beginnen',
    los: neu
  });
})();

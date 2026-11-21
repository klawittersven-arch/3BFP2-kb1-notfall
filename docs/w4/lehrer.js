/* Lehreransicht Woche 4 (freiwillig):
   1. „Fortschritt“: ohne Raumcode und ohne Namen – je Übung ein Balken pro Handy, das sich in den letzten
      FORTSCHRITT_MINUTEN (Standard 45) gemeldet hat; grün = fertig (eigener Worker, siehe config.js).
   2. „Messkarten groß“: die Messkarten des Live-Verlaufs groß zeigen (Besprechung) – ganz ohne Server.
   ?demo=1 zeigt die Fortschritts-Ansicht mit erfundenen Daten (ohne Internet). */
'use strict';
(function () {
  var el = A.el, CFG = A.CFG;
  var DEMO = new URLSearchParams(location.search).get('demo') === '1';
  var MINUTEN = Math.max(5, Math.min(60, Number(CFG.FORTSCHRITT_MINUTEN) || 45));
  var UEB = [
    { id: 'rueckenmark', name: 'Rückenmark-Check', wo: 'Blatt 1 · AA2' },
    { id: 'verlauf', name: 'Frühdienst mit Ampel', wo: 'Blatt 2 · AA1' },
    { id: 'trend', name: 'Trend-Detektiv', wo: 'Blatt 2 · Schon fertig?' },
    { id: 'anatomie', name: 'Wo ist was? Die Atemwege', wo: 'Blatt 3 · AA1' },
    { id: 'atemweg', name: 'Atemweg-Check', wo: 'Blatt 3 · Für die Schnellen' },
    { id: 'speisesaal', name: 'Notfall-Ampel im Speisesaal', wo: 'Blatt 3 · Für die Schnellen' }
  ];
  var ansicht = 'fortschritt', timer = null;
  A.kopf('Lehreransicht Woche 4');

  function rahmen() {
    var h = A.haupt();
    var r = el('div', { klasse: 'reiter' },
      el('button', { type: 'button', klasse: ansicht === 'fortschritt' ? 'an' : '', text: 'Fortschritt (letzte ' + MINUTEN + ' Minuten)', onclick: function () { ansicht = 'fortschritt'; zeigen(); } }),
      el('button', { type: 'button', klasse: ansicht === 'karten' ? 'an' : '', text: 'Messkarten groß (Blatt 2)', onclick: function () { ansicht = 'karten'; zeigen(); } }));
    h.appendChild(r);
    return h;
  }
  function zeigen() {
    if (timer) { clearInterval(timer); timer = null; }
    if (ansicht === 'karten') return karten(0, false);
    fortschrittAnsicht();
  }

  /* ---------- Fortschritt (anonym) ---------- */
  function uhrzeit(ms) { return new Date(ms).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); }
  function fortschrittAnsicht() {
    var h = rahmen();
    var kopf = el('section', { klasse: 'karte' },
      el('h2', { text: 'Wer ist wie weit? (letzte ' + MINUTEN + ' Minuten)' }),
      el('p', { text: 'Ohne Raumcode und ohne Namen: Jeder Balken ist ein Handy, das eine Übung geöffnet hat. Grün = abgeschlossen. Die Handys melden nur „Schritt x von n“ – keine Antworten.' }),
      el('p', { klasse: 'leise', id: 'stand', text: DEMO ? 'Probeansicht mit erfundenen Daten.' : 'Wird geladen …' }));
    var box = el('div', { klasse: 'uebungen' });
    h.appendChild(kopf); h.appendChild(box);
    if (DEMO) { balken(box, demoDaten()); return; }
    if (!CFG.WORKER_URL) { kopf.appendChild(el('p', { text: 'Die Lehreransicht ist ausgeschaltet (WORKER_URL in config.js ist leer). Die Übungen laufen trotzdem.' })); return; }
    var stand = kopf.querySelector('#stand');
    var laden = function () {
      fetch(CFG.WORKER_URL + '/api/fortschritt?minuten=' + MINUTEN, { cache: 'no-store' }).then(function (x) { return x.json(); }).then(function (d) {
        if (!d || !d.ok) throw new Error('antwort');
        A.leeren(box); balken(box, d.uebungen);
        stand.textContent = 'Stand: ' + uhrzeit(d.jetzt) + ' Uhr · aktualisiert sich alle ' + (CFG.ABFRAGE_SEKUNDEN || 10) + ' Sekunden.';
      }).catch(function () { stand.textContent = 'Der Dienst ist gerade nicht erreichbar (Worker eingerichtet? siehe README_W4.md). Die Übungen laufen trotzdem.'; });
    };
    laden();
    timer = setInterval(laden, (CFG.ABFRAGE_SEKUNDEN || 10) * 1000);
  }

  function balken(ziel, daten) {
    UEB.forEach(function (u) {
      var liste = (daten && daten[u.id]) || [];
      var fertig = liste.filter(function (e) { return e.fertig; }).length;
      var karte = el('section', { klasse: 'karte uebung' },
        el('div', { klasse: 'u-kopf' },
          el('h3', { text: u.name }),
          el('span', { klasse: 'leise', text: u.wo })),
        el('p', { klasse: 'u-zahl', fett: liste.length ? '**✓ ' + fertig + ' fertig** · ' + (liste.length - fertig) + ' in Arbeit' : 'noch niemand' }));
      liste.forEach(function (e) {
        var pz = Math.round(100 * e.schritt / e.von);
        karte.appendChild(el('div', { klasse: 'b-zeile' + (e.fertig ? ' fertig' : ''), title: e.fertig ? 'fertig' : e.schritt + ' von ' + e.von },
          el('span', { klasse: 'b-spur' }, el('span', { klasse: 'b-fuell', style: 'width:' + Math.max(e.fertig ? 100 : 3, pz) + '%' })),
          el('span', { klasse: 'b-text', text: e.fertig ? '✓' : e.schritt + '/' + e.von })));
      });
      ziel.appendChild(karte);
    });
  }

  function demoDaten() {
    var r = function (n, von, fertigAnzahl, teile) {
      var l = [];
      for (var i = 0; i < n; i++) l.push(i < fertigAnzahl ? { schritt: von, von: von, fertig: true } : { schritt: teile[i % teile.length], von: von, fertig: false });
      return l;
    };
    return { rueckenmark: r(5, 8, 3, [5, 2]), verlauf: r(12, 6, 7, [4, 2, 5]), trend: r(2, 5, 0, [3, 1]), anatomie: r(11, 6, 6, [2, 0, 4]), atemweg: r(1, 6, 1, []), speisesaal: [] };
  }

  /* ---------- Messkarten groß (Besprechung von Blatt 2) ---------- */
  function karten(n, loesung) {
    var h = rahmen(), V = W4.verlauf, alle = V.karten.concat([null]);
    var k = alle[n];
    var box = el('section', { klasse: 'karte mk' });
    if (k) {
      var p = V.patienten.filter(function (x) { return x.id === k.wer; })[0];
      box.appendChild(el('div', { klasse: 'zeit', text: k.zeit + ' Uhr' }));
      box.appendChild(el('div', { klasse: 'person', text: 'Messkarte ' + k.nr + ' · ' + p.name }));
      box.appendChild(el('div', { klasse: 'werte' },
        el('div', null, el('b', { text: String(k.puls) }), el('span', { text: 'Puls /min' })),
        el('div', null, el('b', { text: k.rr[0] + '/' + k.rr[1] }), el('span', { text: 'RR mmHg' })),
        el('div', null, el('b', { text: String(k.af) }), el('span', { text: 'Atemzüge /min' }))));
      if (k.vorwert) box.appendChild(el('p', { text: 'Vorwert: ' + k.vorwert }));
      box.appendChild(el('p', { text: k.beobachtung }));
      box.appendChild(el('p', { klasse: 'zitat', text: k.aussage }));
      if (loesung) box.appendChild(el('div', { klasse: 'rueck ok' }, el('strong', { text: 'Richtig: ' + W4.ampel[k.richtig].zeichen + ' ' + W4.ampel[k.richtig].kurz }), el('span', { text: k.begruendung })));
    } else {
      var a = V.aufloesung;
      box.appendChild(el('div', { klasse: 'zeit', text: a.zeit + ' Uhr' }));
      box.appendChild(el('div', { klasse: 'person', text: a.titel }));
      box.appendChild(el('div', { klasse: 'werte' },
        el('div', null, el('b', { text: String(a.puls) }), el('span', { text: 'Puls /min' })),
        el('div', null, el('b', { text: a.rr[0] + '/' + a.rr[1] }), el('span', { text: 'RR mmHg' })),
        el('div', null, el('b', { text: String(a.af) }), el('span', { text: 'Atemzüge /min' }))));
      box.appendChild(el('p', { text: a.beobachtung + ' ' + a.aussage }));
      box.appendChild(el('p', { text: a.text }));
    }
    var navi = el('div', { klasse: 'navi' },
      el('button', { klasse: 'knopf zweit', type: 'button', text: '← Zurück', onclick: function () { karten(Math.max(0, n - 1), false); } }),
      k ? el('button', { klasse: 'knopf zweit', type: 'button', text: loesung ? 'Lösung ausblenden' : 'Lösung zeigen', onclick: function () { karten(n, !loesung); } }) : null,
      el('button', { klasse: 'knopf', type: 'button', text: n + 1 < alle.length ? 'Nächste Karte →' : 'Von vorn', onclick: function () { karten(n + 1 < alle.length ? n + 1 : 0, false); } }));
    h.appendChild(box);
    h.appendChild(navi);
    h.appendChild(el('p', { klasse: 'leise', text: 'Besprechung: Karte zeigen → „Was haben Sie gewählt?“ → 1–2 Begründungen → Lösung zeigen. Tasten: ← →, L = Lösung.' }));
    document.onkeydown = function (e) {
      if (ansicht !== 'karten') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') karten(n + 1 < alle.length ? n + 1 : n, false);
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') karten(Math.max(0, n - 1), false);
      else if ((e.key === 'l' || e.key === 'L') && k) karten(n, !loesung);
    };
  }

  zeigen();
})();

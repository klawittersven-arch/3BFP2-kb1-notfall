/* Lehreransicht Woche 4 (optional):
   1. „Ergebnisse“: Raum starten, Code zeigen, Punkte je Gruppe und häufige Fehlentscheidungen (eigener Worker).
   2. „Messkarten groß“: die Messkarten des Live-Verlaufs groß zeigen (Besprechung) – ganz ohne Server.
   ?demo=1 zeigt die Ergebnis-Ansicht mit erfundenen Gruppen (ohne Internet). */
'use strict';
(function () {
  var el = A.el, CFG = A.CFG;
  var DEMO = new URLSearchParams(location.search).get('demo') === '1';
  var UEB = [
    { id: 'verlauf', name: 'Live-Verlauf (Blatt 2)' },
    { id: 'speisesaal', name: 'Speisesaal (Blatt 3)' },
    { id: 'rueckenmark', name: 'Rückenmark-Check' },
    { id: 'trend', name: 'Trend-Detektiv' },
    { id: 'atemweg', name: 'Atemweg-Check' }
  ];
  var ansicht = 'ergebnisse', timer = null;
  A.kopf('Lehreransicht Woche 4');

  function rahmen() {
    var h = A.haupt();
    var r = el('div', { klasse: 'reiter' },
      el('button', { type: 'button', klasse: ansicht === 'ergebnisse' ? 'an' : '', text: 'Ergebnisse der Gruppen', onclick: function () { ansicht = 'ergebnisse'; zeigen(); } }),
      el('button', { type: 'button', klasse: ansicht === 'karten' ? 'an' : '', text: 'Messkarten groß (Blatt 2)', onclick: function () { ansicht = 'karten'; zeigen(); } }));
    h.appendChild(r);
    return h;
  }
  function zeigen() {
    if (timer) { clearInterval(timer); timer = null; }
    if (ansicht === 'karten') return karten(0, false);
    ergebnisse();
  }

  /* ---------- Fehlerkennungen lesbar machen ---------- */
  function fehlerText(uebung, f) {
    if (uebung === 'verlauf') {
      var m = /^k(\d)-(\w+)$/.exec(f); if (!m) return f;
      var k = W4.verlauf.karten[Number(m[1]) - 1]; if (!k) return f;
      var p = W4.verlauf.patienten.filter(function (x) { return x.id === k.wer; })[0];
      return 'Karte ' + k.nr + ' (' + p.name.replace(/ \(.*/, '') + ', ' + k.zeit + '): ' + W4.ampel[m[2]].zeichen + ' statt ' + W4.ampel[k.richtig].zeichen;
    }
    if (uebung === 'speisesaal') {
      var t = f.split('-'); var sz = W4.speisesaal.szenen.filter(function (x) { return x.id === t[0]; })[0];
      return sz ? sz.person.replace(/ \(.*/, '') + ': „' + (W4.speisesaal.optionen[t[1]] || { kurz: t[1] }).kurz + '“' : f;
    }
    var liste = uebung === 'rueckenmark' ? W4.rueckenmark.karten : uebung === 'trend' ? W4.trend.reihen : W4.atemweg.karten;
    var n = Number(f.slice(1)); var x = liste[n - 1];
    if (!x) return f;
    return (x.name || x.text).replace(/\*\*/g, '').slice(0, 70) + (((x.name || x.text).length > 70) ? ' …' : '');
  }

  /* ---------- Ergebnisse ---------- */
  function lehrerRaum() { var r = A.lesen('lehrer'); return r && r.laeuftAb > Date.now() ? r : null; }
  function ergebnisse() {
    var h = rahmen();
    if (DEMO) return tabelle(h, { raum: '4821', laeuftAb: Date.now() + 5 * 3600000 }, demoDaten());
    if (!CFG.WORKER_URL) { h.appendChild(el('section', { klasse: 'karte' }, el('p', { text: 'Die Lehreransicht ist ausgeschaltet (WORKER_URL in config.js ist leer). Die Übungen laufen trotzdem.' }))); return; }
    var r = lehrerRaum();
    if (!r) {
      var meldung = el('p', { klasse: 'leise' });
      var k = el('button', { klasse: 'knopf', type: 'button', text: 'Neuen Raum starten' });
      k.addEventListener('click', function () {
        k.disabled = true; meldung.textContent = 'Raum wird angelegt …';
        fetch(CFG.WORKER_URL + '/api/raum', { method: 'POST' }).then(function (x) { return x.json(); }).then(function (d) {
          if (!d.ok) throw new Error(d.grund);
          A.schreiben('lehrer', { raum: d.raum, schluessel: d.schluessel, laeuftAb: d.laeuftAb });
          ergebnisse();
        }).catch(function () { k.disabled = false; meldung.textContent = 'Der Dienst ist nicht erreichbar. Ist der Worker eingerichtet (README_W4.md)? Die Übungen laufen auch ohne Lehreransicht.'; });
      });
      h.appendChild(el('section', { klasse: 'karte' },
        el('h2', { text: 'Ergebnisse der Gruppen (freiwillig)' }),
        el('p', { text: 'Starten Sie einen Raum. Die SuS tippen den Code auf dem Startbildschirm der Übung ein („Ihre Lehrkraft zeigt einen Raumcode?“) und wählen einen Gruppennamen. Ohne Code laufen die Übungen ganz normal.' }),
        k, meldung,
        el('p', { klasse: 'leise', text: 'Probeansicht ohne Internet: lehrer.html?demo=1' })));
      return;
    }
    var box = el('div'); h.appendChild(box);
    var laden = function () {
      fetch(CFG.WORKER_URL + '/api/stand?raum=' + r.raum + '&schluessel=' + r.schluessel, { cache: 'no-store' }).then(function (x) { return x.json(); }).then(function (d) {
        if (!d.ok) { A.schreiben('lehrer', null); if (timer) clearInterval(timer); ergebnisse(); return; }
        A.leeren(box); tabelle(box, r, d.geraete);
      }).catch(function () { /* nächster Versuch */ });
    };
    laden();
    timer = setInterval(laden, (CFG.ABFRAGE_SEKUNDEN || 4) * 1000);
  }

  function tabelle(ziel, r, geraete) {
    ziel.appendChild(el('section', { klasse: 'karte' },
      el('div', { klasse: 'leise', text: 'Raumcode für die SuS' + (DEMO ? ' (Probeansicht mit erfundenen Gruppen)' : '') }),
      el('div', { klasse: 'code', text: r.raum }),
      el('p', { klasse: 'leise', text: 'Gültig bis ' + new Date(r.laeuftAb).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr. Danach wird alles automatisch gelöscht.' }),
      DEMO ? null : el('button', { klasse: 'knopf zweit', type: 'button', text: 'Raum hier vergessen (neuer Raum)', onclick: function () { A.schreiben('lehrer', null); ergebnisse(); } })));
    var tab = el('table', { klasse: 'tab' }, el('tr', null, el('th', { text: 'Gruppe' }), UEB.map(function (u) { return el('th', { text: u.name }); })));
    var nr = 0;
    geraete.forEach(function (g) {
      nr++;
      tab.appendChild(el('tr', null, el('td', { text: g.gruppe || ('ohne Namen ' + nr) }), UEB.map(function (u) {
        var e = g.uebungen && g.uebungen[u.id];
        if (!e) return el('td', { text: '–' });
        var teile = [e.punkte + '/' + e.max];
        if (e.fertig) teile.push(e.gewonnen ? '🏆' : '✗');
        if (e.fehlalarme) teile.push('⚠ ' + e.fehlalarme + ' Fehlalarm' + (e.fehlalarme > 1 ? 'e' : ''));
        if (e.uebersehen) teile.push('✗ ' + (u.id === 'speisesaal' ? e.uebersehen + ' bewusstlos' : 'Finn übersehen'));
        return el('td', { klasse: e.fertig ? (e.gewonnen ? 'zelle-ok' : 'zelle-nein') : 'zelle-lauf', text: teile.join(' · ') + (e.fertig ? '' : ' (läuft)') });
      })));
    });
    ziel.appendChild(el('section', { klasse: 'karte' }, el('h2', { text: 'Gruppen (' + geraete.length + ')' }),
      geraete.length ? tab : el('p', { klasse: 'leise', text: 'Noch keine Meldungen. Die SuS geben den Raumcode auf dem Startbildschirm der Übung ein.' }),
      el('p', { klasse: 'leise', text: '🏆 gewonnen/bestanden · ✗ nicht gewonnen · gelb = läuft noch' })));
    // häufige Fehlentscheidungen
    var fehlerBox = el('section', { klasse: 'karte' }, el('h2', { text: 'Häufige Fehlentscheidungen (für die Auswertung)' }));
    UEB.forEach(function (u) {
      var zaehl = {};
      geraete.forEach(function (g) { var e = g.uebungen && g.uebungen[u.id]; if (e && e.fehler) e.fehler.forEach(function (f) { zaehl[f] = (zaehl[f] || 0) + 1; }); });
      var liste = Object.keys(zaehl).sort(function (a, b) { return zaehl[b] - zaehl[a]; }).slice(0, 5);
      if (!liste.length) return;
      fehlerBox.appendChild(el('h3', { text: u.name }));
      fehlerBox.appendChild(el('ul', { klasse: 'liste' }, liste.map(function (f) { return el('li', { text: zaehl[f] + ' × ' + fehlerText(u.id, f) }); })));
    });
    if (fehlerBox.children.length > 1) ziel.appendChild(fehlerBox);
  }

  function demoDaten() {
    var g = function (name, u) { return { gruppe: name, geraet: name.replace(/\W/g, '').toLowerCase() + 'demo00', uebungen: u }; };
    return [
      g('Tisch 1', { verlauf: { punkte: 5, max: 6, fertig: true, gewonnen: true, fehlalarme: 0, uebersehen: 0, fehler: ['k2-gelb'] }, speisesaal: { punkte: 10, max: 12, fertig: true, gewonnen: true, fehlalarme: 1, uebersehen: 0, fehler: ['brueckner-hilfe'] } }),
      g('Tisch 2', { verlauf: { punkte: 2, max: 6, fertig: true, gewonnen: false, fehlalarme: 3, uebersehen: 0, fehler: ['k1-rot', 'k2-rot', 'k3-rot', 'k5-rot'] }, speisesaal: { punkte: 7, max: 12, fertig: true, gewonnen: false, fehlalarme: 0, uebersehen: 1, fehler: ['vogt-warten', 'vogt-husten'] } }),
      g('Tisch 3', { verlauf: { punkte: 4, max: 6, fertig: true, gewonnen: false, fehlalarme: 0, uebersehen: 1, fehler: ['k5-gruen', 'k6-gelb'] }, trend: { punkte: 3, max: 5, fertig: false, fehler: ['t3'] } }),
      g('Tisch 4', { speisesaal: { punkte: 4, max: 12, fertig: false, fehlalarme: 0, uebersehen: 0, fehler: ['maler-wasser'] }, rueckenmark: { punkte: 7, max: 8, fertig: true, gewonnen: true, fehler: ['r7'] } })
    ];
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

/* Blatt 3 · Simulation „Notfall-Ampel im Speisesaal“.
   Leichte Verlegung: keine Gefahr durch Zögern – aber ein Notruf ist ein Fehlalarm.
   Schwere Verlegung: Nach der Lesezeit sinkt die SpO₂ jede Sekunde; falsche Wahl kostet zusätzlich.
   Unter W4.speisesaal.bewusstlosUnter wird die Person bewusstlos → Szene verloren. */
'use strict';
(function () {
  var S = W4.speisesaal, el = A.el, OPT = S.optionen;
  var reihe, i, ergebnisse;

  function neu() {
    var fest = S.szenen.slice(0, S.feste), rest = A.mischen(S.szenen.slice(S.feste));
    reihe = fest.concat(rest); i = 0; ergebnisse = [];
    szene();
  }

  // Gesicht: Lippenfarbe von rosa (gut) nach blau (schlecht)
  function gesicht() {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 64 64'); svg.setAttribute('width', '64'); svg.setAttribute('height', '64'); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<circle cx="32" cy="32" r="28" fill="#f2d2b6" id="haut"/><circle cx="22" cy="27" r="3.2" fill="#1d2a30"/><circle cx="42" cy="27" r="3.2" fill="#1d2a30"/>' +
      '<ellipse cx="32" cy="45" rx="9" ry="4.5" fill="#d9777f" id="lippen"/>';
    return {
      svg: svg,
      setzen: function (spo2) {
        var t = Math.max(0, Math.min(1, (95 - spo2) / 30));      // 0 = gut, 1 = sehr schlecht
        var misch = function (a, b) { return Math.round(a + (b - a) * t); };
        svg.querySelector('#lippen').setAttribute('fill', 'rgb(' + misch(217, 80) + ',' + misch(119, 100) + ',' + misch(127, 190) + ')');
        svg.querySelector('#haut').setAttribute('fill', 'rgb(' + misch(242, 200) + ',' + misch(210, 205) + ',' + misch(182, 215) + ')');
      }
    };
  }

  function szene() {
    var h = A.haupt();
    if (i >= reihe.length) return ende();
    var z = reihe[i], spo2 = z.spo2, versuche = 0, fertig = false, timer = null, lesen = null;
    var g = gesicht();
    var zahl = el('span', { klasse: 'spo2', text: String(spo2) });
    var status = el('div', { klasse: 'status', text: z.schwer ? 'Lesen Sie schnell – gleich zählt jede Sekunde.' : '' });
    var monitor = el('div', { klasse: 'monitor', 'aria-live': 'polite' }, g.svg, el('div', null, el('div', null, zahl, el('span', { klasse: 'einheit', text: ' % SpO₂' })), status));
    var anz = A.uhrAnzeige(S.sekundenLeicht);
    var knoepfe = el('div');
    var rueck = el('div');
    var box = el('section', { klasse: 'karte', 'data-szene': z.id },
      el('div', { klasse: 'leise', text: 'Szene ' + (i + 1) + ' von ' + reihe.length + ' · ' + z.ort + (z.leitfall ? ' · aus dem Fall „Reanimation – und nicht nur ich war hilflos“' : '') }),
      el('h2', { text: z.person }),
      el('p', { text: z.text }),
      monitor,
      z.schwer ? null : anz.box,
      knoepfe, rueck);
    h.appendChild(A.fortschritt(i + 1, reihe.length));
    h.appendChild(box);
    function anzeigen() {
      zahl.textContent = String(Math.max(0, Math.round(spo2)));
      zahl.className = 'spo2 ' + (spo2 >= 90 ? 'gut' : spo2 >= 80 ? 'mittel' : 'schlecht');
      g.setzen(spo2);
    }
    anzeigen();
    function abschliessen(art, text) {
      fertig = true;
      if (timer) clearInterval(timer);
      if (lesen) clearTimeout(lesen);
      if (zeitUhr) zeitUhr.stop();
      Array.prototype.forEach.call(knoepfe.children, function (b) { b.disabled = true; if (b.dataset.opt === z.richtig) b.classList.add('richtig'); });
      var punkte = art === 'richtig' ? (versuche <= 1 ? 2 : 1) : 0;
      ergebnisse.push({ id: z.id, person: z.person, schwer: z.schwer, art: art, punkte: punkte, fehlalarme: fehlalarmeHier, fehler: fehlerHier });
      rueck.appendChild(el('div', { klasse: 'rueck ' + (art === 'richtig' ? 'ok' : 'nein') },
        el('strong', { text: art === 'richtig' ? '✓ Richtig (' + punkte + ' Punkte)' : art === 'bewusstlos' ? '✗ ' + z.person.replace(/ \(.*/, '') + ' ist bewusstlos geworden' : '⏱ Zeit abgelaufen' }),
        el('span', { text: text })));
      var w = el('button', { klasse: 'knopf', type: 'button', text: i + 1 < reihe.length ? 'Nächste Szene' : 'Ergebnis' });
      w.addEventListener('click', function () { i++; szene(); window.scrollTo(0, 0); });
      rueck.appendChild(w);
      melden(false);
    }
    var fehlalarmeHier = 0, fehlerHier = [];
    z.wahl.forEach(function (o) {
      var b = el('button', { klasse: 'wahl', type: 'button', 'data-opt': o, text: OPT[o].text.replace('ihr/ihm', z.person.indexOf('Frau') === 0 ? 'ihr' : 'ihm').replace('sie/er', z.person.indexOf('Frau') === 0 ? 'sie' : 'er') });
      b.addEventListener('click', function () {
        if (fertig) return;
        versuche++;
        if (o === z.richtig) return abschliessen('richtig', z.rueckmeldung[o]);
        b.disabled = true; b.classList.add('falsch');
        fehlerHier.push(z.id + '-' + o);
        if (o === 'hilfe' && !z.schwer) fehlalarmeHier++;
        if (z.schwer) spo2 -= S.abfallFehler; else if (o === 'wasser') spo2 -= 4; else if (o === 'ruecken') spo2 -= 2;
        anzeigen();
        A.leeren(rueck).appendChild(el('div', { klasse: 'rueck nein' }, el('strong', { text: o === 'hilfe' && !z.schwer ? '✗ Fehlalarm' : '✗ Nicht richtig' }), el('span', { text: z.rueckmeldung[o] })));
        if (z.schwer && spo2 < S.bewusstlosUnter) bewusstlos();
      });
      knoepfe.appendChild(b);
    });
    function bewusstlos() {
      spo2 = Math.min(spo2, S.bewusstlosUnter - 1); anzeigen();
      status.textContent = 'bewusstlos';
      A.leeren(rueck);
      abschliessen('bewusstlos', 'Jetzt wäre eine Reanimation nötig. Richtig gewesen wäre: ' + OPT.hilfe.kurz + ' – sofort, ohne zu zögern. ' + z.rueckmeldung.hilfe.replace(/^Richtig: /, ''));
    }
    var zeitUhr = null;
    if (z.schwer) {
      lesen = setTimeout(function () {
        if (fertig) return;
        status.textContent = 'Die Sättigung sinkt …';
        timer = setInterval(function () {
          if (fertig) return;
          spo2 -= S.abfallProSekunde; anzeigen();
          if (spo2 < S.bewusstlosUnter) { clearInterval(timer); bewusstlos(); }
        }, 1000);
      }, S.lesezeit * 1000);
    } else {
      zeitUhr = A.uhr(S.sekundenLeicht, anz.setzen, function () {
        if (fertig) return;
        A.leeren(rueck);
        abschliessen('zeit', 'Sie haben nicht entschieden. Richtig wäre: ' + OPT[z.richtig].kurz + '. ' + z.rueckmeldung[z.richtig]);
      });
    }
  }

  function stand() {
    var punkte = 0, fehlalarme = 0, bewusstlos = 0, fehler = [];
    ergebnisse.forEach(function (e) { punkte += e.punkte; fehlalarme += e.fehlalarme; if (e.art === 'bewusstlos') bewusstlos++; fehler = fehler.concat(e.fehler); });
    return { punkte: punkte, fehlalarme: fehlalarme, bewusstlos: bewusstlos, fehler: fehler, bestanden: bewusstlos === 0 && fehlalarme <= 1 };
  }
  function melden(fertig) {
    var s = stand();
    A.melden('speisesaal', { punkte: s.punkte, max: 2 * S.szenen.length, fertig: fertig, fehlalarme: s.fehlalarme, uebersehen: s.bewusstlos, gewonnen: fertig ? s.bestanden : false, fehler: s.fehler.slice(0, 20) });
  }

  function ende() {
    var h = A.haupt(), s = stand();
    melden(true);
    var text = s.bestanden ? S.ergebnis.bestanden : (s.bewusstlos ? S.ergebnis.bewusstlos : S.ergebnis.fehlalarme);
    var tab = el('table', { klasse: 'tab' }, el('tr', null, el('th', { text: 'Person' }), el('th', { text: 'Verlegung' }), el('th', { text: 'Ergebnis' })));
    ergebnisse.forEach(function (e) {
      tab.appendChild(el('tr', null, el('td', { text: e.person }), el('td', { text: e.schwer ? 'schwer' : 'leicht' }),
        el('td', { text: (e.art === 'richtig' ? '✓ ' + e.punkte + ' P.' : e.art === 'bewusstlos' ? '✗ bewusstlos' : '✗ Zeit') + (e.fehlalarme ? ' · Fehlalarm' : '') })));
    });
    h.appendChild(el('section', { klasse: 'karte ergebnis' },
      el('h2', { text: 'Ergebnis' }),
      el('div', { klasse: 'gross ' + (s.bestanden ? 'sieg' : 'niederlage'), text: s.bestanden ? 'Bestanden!' : 'Nicht bestanden' }),
      el('p', { text: text }),
      el('p', { text: 'Punkte: ' + s.punkte + ' / ' + (2 * S.szenen.length) + ' · Fehlalarme: ' + s.fehlalarme + ' · bewusstlos: ' + s.bewusstlos }),
      tab,
      el('div', { klasse: 'hinweis', text: '✍️ Füllen Sie jetzt die Tabelle „leicht oder schwer?“ auf dem Arbeitsblatt aus.' }),
      el('button', { klasse: 'knopf zweit', type: 'button', text: 'Noch einmal (neue Reihenfolge)', onclick: function () { neu(); window.scrollTo(0, 0); } })));
  }

  A.start({
    titel: S.titel,
    absaetze: [S.einleitung, el('p', { klasse: 'leise', text: S.hinweisSpO2 })],
    regel: S.regel,
    knopf: 'Simulation starten',
    los: neu
  });
})();

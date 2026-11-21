/* Blatt 3 · AA1 (digitale Fassung): „Wo ist was? Die Atemwege“.
   Die SuS tippen bei jeder Frage den richtigen Teil im Bild an (Reihenfolge zufällig).
   Ein Fehler → die Übung beginnt von vorn. Alles richtig → die Wörter für den Lückentext auf dem Arbeitsblatt
   (alle **Wörter** aus W4.atemwegeText, alphabetisch). Keine Daten, kein Server. */
'use strict';
(function () {
  var AN = W4.anatomie, el = A.el;
  var name = {};
  AN.teile.forEach(function (t) { name[t.id] = t.name; });
  // Lückenwörter = fett markierte Fachwörter im Informationstext (eine Quelle mit dem Arbeitsblatt)
  var woerter = [];
  W4.atemwegeText.absaetze.forEach(function (a) { (a.match(/\*\*[^*]+\*\*/g) || []).forEach(function (w) { woerter.push(w.slice(2, -2)); }); });
  woerter.sort(function (a, b) { return a.localeCompare(b, 'de'); });

  var reihe = [], i = 0, versuch = 0;

  function bild(o) {
    var d = el('div', { klasse: 'anatomie' });
    d.innerHTML = ATEMWEGE_BILD.svg(o);
    var svg = d.querySelector('svg');
    svg.removeAttribute('width'); svg.removeAttribute('height');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Atemwege von vorn: Kehldeckel, Kehlkopf, Luftröhre, Hauptbronchien, Lungenbläschen');
    return d;
  }

  function neu() {
    versuch++;
    reihe = A.mischen(AN.teile);
    i = 0;
    frage();
  }

  function frage() {
    var h = A.haupt(), t = reihe[i], gesperrt = false;
    var b = bild({ tippen: true });
    var rueck = el('div');
    h.appendChild(A.fortschritt(i + 1, reihe.length));
    h.appendChild(el('section', { klasse: 'karte' },
      el('p', { klasse: 'frage', fett: t.frage }),
      el('p', { klasse: 'versuch', text: 'Versuch ' + versuch + ' · ' + AN.tippRechtsLinks }),
      b, rueck));
    b.querySelector('svg').addEventListener('click', function (e) {
      if (gesperrt) return;
      var g = e.target.closest ? e.target.closest('[data-teil]') : null;
      if (!g) return;                                   // daneben getippt: kein Fehler, einfach noch einmal
      gesperrt = true;
      var id = g.getAttribute('data-teil');
      if (id === t.id) {
        g.classList.add('ok');
        rueck.appendChild(el('div', { klasse: 'rueck ok' }, el('strong', { text: '✓ Richtig: ' + t.name })));
        setTimeout(function () { i++; if (i < reihe.length) frage(); else ende(); }, 700);
      } else {
        g.classList.add('falsch');
        var richtig = b.querySelector('[data-teil="' + t.id + '"]');
        if (richtig) richtig.classList.add('zeigen');
        rueck.appendChild(el('div', { klasse: 'rueck nein' },
          el('strong', { text: '✗ Leider falsch' }),
          el('span', { fett: 'Sie haben **' + name[id] + '** angetippt (rot). Gesucht war: **' + t.name + '** (grün). Sie beginnen wieder von vorn.' })));
        rueck.appendChild(el('button', { klasse: 'knopf', type: 'button', text: 'Von vorn beginnen', onclick: function () { neu(); window.scrollTo(0, 0); } }));
      }
    });
  }

  function ende() {
    var h = A.haupt();
    h.appendChild(el('section', { klasse: 'karte ergebnis' },
      el('h2', { text: AN.geschafft }),
      el('p', { text: versuch === 1 ? 'Sie haben es im ersten Versuch geschafft.' : 'Sie haben es im ' + versuch + '. Versuch geschafft.' }),
      bild({ nummern: true, begriffe: true }),
      el('h3', { text: AN.woerterKopf }),
      el('ul', { klasse: 'woerter' }, woerter.map(function (w) { return el('li', { text: w }); })),
      el('div', { klasse: 'hinweis', text: AN.auftrag }),
      el('button', { klasse: 'knopf zweit', type: 'button', text: 'Noch einmal üben', onclick: function () { versuch = 0; neu(); window.scrollTo(0, 0); } })));
  }

  // Startbildschirm (ohne Raumcode – diese Übung meldet nichts an die Lehreransicht)
  A.kopf(AN.titel);
  var h = A.haupt();
  h.appendChild(el('section', { klasse: 'karte' },
    el('h2', { text: AN.titel }),
    el('p', { fett: AN.einleitung }),
    el('div', { klasse: 'hinweis', text: AN.tippRechtsLinks }),
    el('button', { klasse: 'knopf', type: 'button', text: 'Los geht’s', onclick: neu })));
})();

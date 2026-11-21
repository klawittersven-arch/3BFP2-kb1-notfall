/* Blatt 2 · Schon fertig? „Trend-Detektiv“: Verlauf lesen, mit der Ampel entscheiden. */
'use strict';
(function () {
  var T = W4.trend, AMP = W4.ampel, el = A.el;
  A.quiz({
    uebung: 'trend', titel: T.titel, einleitung: T.einleitung, karten: T.reihen, mischen: true,
    kennung: function (r) { return 't' + (T.reihen.indexOf(r) + 1); },
    zeigen: function (r, box, fertig) {
      box.appendChild(el('h2', { text: r.name }));
      box.appendChild(el('p', { klasse: 'leise', text: r.info }));
      var tab = el('table', { klasse: 'tab' }, el('tr', null, el('th', { text: 'Uhrzeit' }), el('th', { text: 'Puls /min' }), el('th', { text: 'RR mmHg' })));
      r.zeiten.forEach(function (z, j) { tab.appendChild(el('tr', null, el('td', { text: z }), el('td', { text: String(r.puls[j]) }), el('td', { text: r.rr[j] }))); });
      box.appendChild(tab);
      box.appendChild(el('p', { text: 'Jetzt: ' + r.zusatz }));
      var knoepfe = el('div', { klasse: 'ampel' });
      var erledigt = false;
      ['gruen', 'gelb', 'rot'].forEach(function (s) {
        knoepfe.appendChild(el('button', { klasse: s, type: 'button', 'data-stufe': s, onclick: function () {
          if (erledigt) return; erledigt = true;
          Array.prototype.forEach.call(knoepfe.children, function (b) { b.disabled = true; if (b.dataset.stufe === s) b.classList.add('gewaehlt'); });
          fertig(s === r.richtig, 'Richtig ist ' + AMP[r.richtig].zeichen + ' ' + AMP[r.richtig].kurz + '. ' + r.erklaerung);
        } }, el('span', { klasse: 'z', text: AMP[s].zeichen }), el('span', { text: AMP[s].lang })));
      });
      box.appendChild(knoepfe);
    }
  });
})();

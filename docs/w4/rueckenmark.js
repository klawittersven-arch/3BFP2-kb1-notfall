/* Blatt 1 · Schon fertig? „Rückenmark-Check“: Höhe der Verletzung an der Wirbelsäule antippen, Maßnahmen wählen. */
'use strict';
(function () {
  var R = W4.rueckenmark, el = A.el;

  // Wirbelsäule mit drei antippbaren Bereichen (sehr hohe HWS, HWS, BWS/LWS)
  function wirbelsaeule(waehlen) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 150 300'); svg.setAttribute('width', '125'); svg.setAttribute('height', '275'); svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', 'Wirbelsäule');
    var s = '<rect x="52" y="6" width="16" height="286" rx="8" fill="#fae2d5"/>';
    var y = 10;
    var bereiche = [
      { id: 'hoch', n: 4, h: 10, farbe: '#c0392b', text: 'HWS hoch' },
      { id: 'hws', n: 4, h: 10, farbe: '#e67e22', text: 'HWS' },
      { id: 'bws', n: 17, h: 12, farbe: '#2e75b6', text: 'BWS/LWS' }
    ];
    bereiche.forEach(function (b) {
      var start = y;
      for (var k = 0; k < b.n; k++) { s += '<rect x="44" y="' + y + '" width="32" height="' + (b.h - 2) + '" rx="3" fill="' + b.farbe + '" opacity=".85"/>'; y += b.h; }
      s += '<g class="zone" data-id="' + b.id + '" style="cursor:pointer"><rect x="0" y="' + (start - 2) + '" width="150" height="' + (y - start + 2) + '" fill="transparent"/>' +
        '<text x="82" y="' + ((start + y) / 2 + 4) + '" font-size="11" fill="#1d2a30">' + b.text + '</text></g>';
      y += 2;
    });
    svg.innerHTML = s;
    Array.prototype.forEach.call(svg.querySelectorAll('.zone'), function (z) { z.addEventListener('click', function () { waehlen(z.getAttribute('data-id')); }); });
    return svg;
  }

  A.quiz({
    uebung: 'rueckenmark', titel: R.titel, einleitung: R.einleitung, karten: R.karten, mischen: false,
    kennung: function (k) { return 'r' + (R.karten.indexOf(k) + 1); },
    zeigen: function (k, box, fertig) {
      box.appendChild(el('p', { fett: k.text }));
      var erledigt = false;
      if (k.typ === 'hoehe') {
        box.appendChild(el('p', { klasse: 'leise', text: 'Wo liegt die Verletzung? Tippen Sie auf die Wirbelsäule oder einen Knopf.' }));
        var knoepfe = el('div', { klasse: 'knoepfe' });
        var waehlen = function (id) {
          if (erledigt) return; erledigt = true;
          Array.prototype.forEach.call(knoepfe.children, function (b) { b.disabled = true; if (b.dataset.id === k.richtig) b.classList.add('richtig'); else if (b.dataset.id === id) b.classList.add('falsch'); });
          fertig(id === k.richtig, k.erklaerung);
        };
        ['hoch', 'hws', 'bws'].forEach(function (id) {
          knoepfe.appendChild(el('button', { klasse: 'wahl', type: 'button', 'data-id': id, text: R.hoehen[id], onclick: function () { waehlen(id); } }));
        });
        box.appendChild(el('div', { klasse: 'wirbel' }, wirbelsaeule(waehlen), knoepfe));
      } else {
        var liste = el('div');
        k.optionen.forEach(function (o, j) {
          liste.appendChild(el('button', { klasse: 'wahl', type: 'button', text: o, onclick: function () {
            if (erledigt) return; erledigt = true;
            Array.prototype.forEach.call(liste.children, function (b, m) { b.disabled = true; if (m === k.richtig) b.classList.add('richtig'); else if (m === j) b.classList.add('falsch'); });
            fertig(j === k.richtig, k.erklaerung);
          } }));
        });
        box.appendChild(liste);
      }
    }
  });
})();

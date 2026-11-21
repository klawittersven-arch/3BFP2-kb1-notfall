/* Blatt 3 · Schon fertig? „Atemweg-Check“: Reihenfolgen antippen und Fragen zu Atemwegen und Sauerstoffmangel. */
'use strict';
(function () {
  var W = W4.atemweg, el = A.el;
  A.quiz({
    uebung: 'atemweg', titel: W.titel, einleitung: W.einleitung, karten: W.karten, mischen: false,
    kennung: function (k) { return 'a' + (W.karten.indexOf(k) + 1); },
    zeigen: function (k, box, fertig) {
      box.appendChild(el('p', { fett: k.text }));
      var erledigt = false;
      if (k.typ === 'reihe') {
        var ziel = el('div', { klasse: 'reihe-ziel', 'aria-live': 'polite' });
        var chips = el('div', { klasse: 'chips' });
        var naechster = 0, fehler = 0;
        A.mischen(k.teile).forEach(function (t) {
          var b = el('button', { type: 'button', text: t });
          b.addEventListener('click', function () {
            if (erledigt || b.classList.contains('gesetzt')) return;
            if (t === k.teile[naechster]) {
              b.classList.add('gesetzt'); b.disabled = true;
              ziel.textContent = k.teile.slice(0, naechster + 1).join(' → ');
              naechster++;
              if (naechster === k.teile.length) { erledigt = true; fertig(fehler === 0, (fehler ? 'Sie hatten ' + fehler + ' Fehlversuch(e). ' : '') + k.erklaerung); }
            } else {
              fehler++;
              b.classList.remove('wackeln'); void b.offsetWidth; b.classList.add('wackeln');
            }
          });
          chips.appendChild(b);
        });
        box.appendChild(chips);
        box.appendChild(ziel);
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

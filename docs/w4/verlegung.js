/* Blatt 3 · AA2 (digitale Fassung): Lesetext „Wenn etwas im Hals stecken bleibt“ mit Bildern.
   Text aus inhalte.js (W4.verlegung) – dieselbe Quelle wie der Text auf dem analogen Arbeitsblatt.
   Reine Leseseite: keine Eingaben, keine Daten, kein Server. */
'use strict';
(function () {
  var V = W4.verlegung, el = A.el;
  var HAUT = '#f2d2b6', HAAR = '#6b4f3a', HEMD = '#5b8fa8', DUNKEL = '#1d2a30', MUND = '#8a4b52', GRAU = '#8c8c8c', ROT = '#c0392b';

  // Oberkörper mit Kopf (gemeinsam für beide Personen)
  function koerper() {
    return '<path d="M45 150 C45 116 70 104 100 104 C130 104 155 116 155 150 Z" fill="' + HEMD + '"/>' +
      '<rect x="89" y="84" width="22" height="26" rx="6" fill="' + HAUT + '"/>' +
      '<circle cx="100" cy="58" r="32" fill="' + HAUT + '"/>' +
      '<path d="M67 58 C64 14 136 14 133 58 C126 42 112 36 100 36 C88 36 74 42 67 58 Z" fill="' + HAAR + '"/>';
  }
  var BILDER = {
    // schwere Verlegung: beide Hände am Hals, Sprechblase durchgestrichen
    schwer: '<svg viewBox="0 0 200 150" width="200" height="150">' +
      '<path d="M146 38 L136 54 L160 40 Z" fill="#fff" stroke="' + GRAU + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<rect x="134" y="8" width="58" height="34" rx="10" fill="#fff" stroke="' + GRAU + '" stroke-width="2"/>' +
      '<text x="163" y="30" text-anchor="middle" font-family="sans-serif" font-size="18" fill="' + GRAU + '">…</text>' +
      '<path d="M148 15 L178 35 M178 15 L148 35" stroke="' + ROT + '" stroke-width="3.5" stroke-linecap="round"/>' +
      koerper() +
      '<path d="M58 146 C58 120 70 106 86 100" stroke="' + HEMD + '" stroke-width="16" stroke-linecap="round" fill="none"/>' +
      '<path d="M142 146 C142 120 130 106 114 100" stroke="' + HEMD + '" stroke-width="16" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="90" cy="96" rx="11" ry="8" fill="' + HAUT + '" stroke="#c9a68a" stroke-width="1.5"/>' +
      '<ellipse cx="110" cy="96" rx="11" ry="8" fill="' + HAUT + '" stroke="#c9a68a" stroke-width="1.5"/>' +
      '<circle cx="89" cy="58" r="3.5" fill="' + DUNKEL + '"/><circle cx="111" cy="58" r="3.5" fill="' + DUNKEL + '"/>' +
      '<path d="M80 50 L93 46 M120 50 L107 46" stroke="' + DUNKEL + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<ellipse cx="100" cy="75" rx="5" ry="6" fill="' + MUND + '"/></svg>',
    // leichte Verlegung: hustet kräftig, rotes Gesicht, kann sprechen
    leicht: '<svg viewBox="0 0 200 150" width="200" height="150">' +
      '<path d="M58 36 L72 52 L72 36 Z" fill="#fff" stroke="' + GRAU + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<rect x="4" y="6" width="86" height="32" rx="10" fill="#fff" stroke="' + GRAU + '" stroke-width="2"/>' +
      '<text x="47" y="27" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="' + DUNKEL + '">Geht schon!</text>' +
      koerper() +
      '<path d="M84 58 q5 -5 10 0 M106 58 q5 -5 10 0" stroke="' + DUNKEL + '" stroke-width="2.5" stroke-linecap="round" fill="none"/>' +
      '<circle cx="81" cy="69" r="7" fill="#e07a7a" opacity=".55"/><circle cx="119" cy="69" r="7" fill="#e07a7a" opacity=".55"/>' +
      '<ellipse cx="100" cy="76" rx="9" ry="7" fill="' + MUND + '"/>' +
      '<path d="M140 66 q8 8 0 16 M150 60 q12 14 0 28 M160 54 q16 20 0 40" stroke="' + HEMD + '" stroke-width="3" stroke-linecap="round" fill="none"/></svg>',
    // Lippenfarbe: von rosig zu blau – erst spät
    lippen: (function () {
      var farben = ['#d9777f', '#b47b98', '#8c7fb3', '#5f74c4'], s = '<svg viewBox="0 0 220 96" width="260" height="114">';
      farben.forEach(function (f, i) {
        var x = 30 + i * 53;
        s += '<circle cx="' + x + '" cy="32" r="22" fill="' + HAUT + '"/>' +
          '<circle cx="' + (x - 8) + '" cy="27" r="2.6" fill="' + DUNKEL + '"/><circle cx="' + (x + 8) + '" cy="27" r="2.6" fill="' + DUNKEL + '"/>' +
          '<ellipse cx="' + x + '" cy="42" rx="8" ry="4" fill="' + f + '"/>';
      });
      return s + '<line x1="10" y1="68" x2="204" y2="68" stroke="#6b7a80" stroke-width="2"/><polygon points="204,63 214,68 204,73" fill="#6b7a80"/>' +
        '<text x="30" y="88" text-anchor="middle" font-family="sans-serif" font-size="12" fill="' + DUNKEL + '">rosig</text>' +
        '<text x="189" y="88" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="700" fill="' + ROT + '">blau = spät</text></svg>';
    })()
  };

  function bild(b) {
    var f = el('figure', { klasse: 'bild' });
    f.innerHTML = BILDER[b.bild];
    var svg = f.querySelector('svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', b.text);
    f.appendChild(el('figcaption', { text: b.text }));
    return f;
  }

  A.kopf(V.titel);
  var h = A.haupt();
  var karte = el('section', { klasse: 'karte lesetext' });
  V.absaetze.forEach(function (t, i) {
    karte.appendChild(el('p', { fett: t }));
    V.bilder.filter(function (b) { return b.nach === i; }).forEach(function (b) { karte.appendChild(bild(b)); });
  });
  karte.appendChild(el('div', { klasse: 'hinweis', text: V.auftrag }));
  h.appendChild(karte);
})();

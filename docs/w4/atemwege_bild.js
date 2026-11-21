/* KB I · Woche 4 – Bild „Atemwege (Sicht von vorn)“ als SVG. Eine Quelle für:
   - das Arbeitsblatt (werkzeuge/w4_bilder.js → werkzeuge/bilder/w4_atemwege.png, mit Nummern 1–6)
   - die Handy-Übung „Wo ist was?“ (docs/w4/anatomie.html, ohne Nummern, mit Tipp-Bereichen).
   o.nummern: Nummern 1–6 mit Linien · o.begriffe: Begriffe neben den Nummern · o.tippen: Teile antippbar
   (<g data-teil="…">, unsichtbar vergrößerte Tipp-Flächen). */
'use strict';
var ATEMWEGE_BILD = (function () {
  var TEILE = ['kehldeckel', 'kehlkopf', 'luftroehre', 'bronchus_re', 'bronchus_li', 'blaeschen'];

  function svg(o) {
    o = o || {};
    var B = 470, H = 470, c = 235, s = '';
    var schrift = 'font-family="Calibri, Carlito, Arial, sans-serif"';
    // unsichtbare, größere Tipp-Fläche (nur im Tipp-Modus)
    function tipp(form) { return o.tippen ? form.replace('/>', ' class="tippflaeche" fill="none" stroke="none" pointer-events="all"/>') : ''; }
    function teil(id, inhalt) { return o.tippen ? '<g class="teil" data-teil="' + id + '">' + inhalt + '</g>' : inhalt; }

    // mit Begriffen (Handy, Schlussbild): Rand links/rechts/unten für die Beschriftung
    var vb = o.begriffe ? '-80 0 ' + (B + 215) + ' ' + (H + 26) : '0 0 ' + B + ' ' + H;
    s += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" width="' + (o.begriffe ? B + 215 : B) + '" height="' + (o.begriffe ? H + 26 : H) + '" ' + schrift + '>' +
      (o.begriffe ? '<rect x="-80" width="' + (B + 215) + '" height="' + (H + 26) + '" fill="#fff"/>' : '<rect width="' + B + '" height="' + H + '" fill="#fff"/>');
    // Kehldeckel (Blatt, oberhalb des Kehlkopfs)
    s += teil('kehldeckel', tipp('<circle cx="' + c + '" cy="28" r="24"/>') +
      '<path d="M' + (c - 22) + ' 46 Q' + c + ' 6 ' + (c + 22) + ' 46 Q' + c + ' 34 ' + (c - 22) + ' 46 Z" fill="#e8a0a8" stroke="#a5525c" stroke-width="2"/>');
    // Kehlkopf
    s += teil('kehlkopf', '<path d="M' + (c - 40) + ' 50 L' + (c + 40) + ' 50 L' + (c + 26) + ' 116 L' + (c - 26) + ' 116 Z" fill="#f3c9b5" stroke="#8a5a44" stroke-width="2.5"/>' +
      '<path d="M' + (c - 14) + ' 60 L' + c + ' 92 L' + (c + 14) + ' 60" fill="none" stroke="#8a5a44" stroke-width="2"/>');
    // Luftröhre mit Knorpelspangen
    var lr = tipp('<rect x="' + (c - 34) + '" y="118" width="68" height="116"/>') +
      '<rect x="' + (c - 20) + '" y="116" width="40" height="124" fill="#f7dccf" stroke="#8a5a44" stroke-width="2.5"/>';
    for (var yy = 124; yy < 238; yy += 12) lr += '<path d="M' + (c - 20) + ' ' + yy + ' Q' + c + ' ' + (yy + 6) + ' ' + (c + 20) + ' ' + yy + '" fill="none" stroke="#c59a85" stroke-width="3"/>';
    s += teil('luftroehre', lr);
    // Hauptbronchien: rechts (Bildseite links) kürzer, weiter, steiler; links (Bildseite rechts) länger, enger, flacher.
    // Tipp-Flächen beginnen unterhalb der Luftröhre, damit ein Tipp unten auf die Luftröhre nicht als Bronchus zählt.
    s += teil('bronchus_re', tipp('<path d="M' + (c - 22) + ' 264 L' + (c - 49) + ' 326" stroke-width="40" stroke-linecap="round"/>') +
      '<path d="M' + (c - 20) + ' 236 L' + (c - 62) + ' 322 L' + (c - 36) + ' 330 L' + (c - 4) + ' 254 Z" fill="#f7dccf" stroke="#8a5a44" stroke-width="2.5"/>');
    s += teil('bronchus_li', tipp('<path d="M' + (c + 36) + ' 260 L' + (c + 116) + ' 304" stroke-width="36" stroke-linecap="round"/>') +
      '<path d="M' + (c + 18) + ' 236 L' + (c + 120) + ' 296 L' + (c + 112) + ' 312 L' + (c + 6) + ' 254 Z" fill="#f7dccf" stroke="#8a5a44" stroke-width="2.5"/>');
    // kleinere Bronchien (nicht antippbar)
    function ast(x1, y1, x2, y2, w) { s += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#c59a85" stroke-width="' + w + '" stroke-linecap="round"/>'; }
    ast(c - 50, 324, c - 92, 372, 8); ast(c - 50, 324, c - 40, 386, 8); ast(c - 92, 372, c - 120, 392, 5); ast(c - 92, 372, c - 98, 410, 5);
    ast(c + 116, 304, c + 150, 352, 7); ast(c + 116, 304, c + 104, 360, 6); ast(c + 150, 352, c + 176, 372, 4); ast(c + 150, 352, c + 152, 396, 4);
    // Lungenbläschen (Trauben)
    var bl = '';
    function traube(x0, y0) {
      bl += tipp('<circle cx="' + (x0 + 2) + '" cy="' + (y0 + 8) + '" r="22"/>');
      [[0, 0], [9, 4], [-8, 6], [3, 12], [12, 14], [-5, 17]].forEach(function (d) { bl += '<circle cx="' + (x0 + d[0]) + '" cy="' + (y0 + d[1]) + '" r="7" fill="#f2b8c0" stroke="#b5606c" stroke-width="1.5"/>'; });
    }
    traube(c - 124, 396); traube(c - 100, 414); traube(c - 40, 392); traube(c + 180, 376); traube(c + 154, 400); traube(c + 104, 364);
    s += teil('blaeschen', bl);
    // Nummern mit Linien (Arbeitsblatt)
    function nummer(n, tx, ty, zx, zy, begriff, anker) {
      anker = anker || 'start';
      s += '<line x1="' + tx + '" y1="' + ty + '" x2="' + zx + '" y2="' + zy + '" stroke="#333" stroke-width="1.5"/>';
      s += '<circle cx="' + tx + '" cy="' + ty + '" r="15" fill="#fff" stroke="#333" stroke-width="2"/><text x="' + tx + '" y="' + (ty + 6) + '" font-size="18" font-weight="bold" text-anchor="middle">' + n + '</text>';
      if (o.begriffe) s += '<text x="' + (anker === 'end' ? tx - 22 : tx + 22) + '" y="' + (ty + 6) + '" font-size="17" text-anchor="' + anker + '" fill="#1f4e9c" font-weight="bold">' + begriff + '</text>';
    }
    if (o.nummern) {
      nummer(1, c + 120, 28, c + 16, 30, 'Kehldeckel');
      nummer(2, c - 120, 82, c - 32, 82, 'Kehlkopf', 'end');
      nummer(3, c + 120, 172, c + 20, 172, 'Luftröhre');
      nummer(4, c - 140, 262, c - 40, 284, 'rechter Haupt-', 'end');
      if (o.begriffe) s += '<text x="' + (c - 162) + '" y="290" font-size="17" text-anchor="end" fill="#1f4e9c" font-weight="bold">bronchus</text>';
      nummer(5, c + 150, 252, c + 80, 278, 'linker Hauptbronchus');
      nummer(6, c - 10, 446, c - 36, 404, 'Lungenbläschen');
    }
    // Orientierung
    var yo = o.begriffe ? H + 16 : H - 10;
    s += '<text x="18" y="' + yo + '" font-size="16" fill="#555">◀ rechte Seite der Person</text>';
    s += '<text x="' + (B - 18) + '" y="' + yo + '" font-size="16" text-anchor="end" fill="#555">linke Seite ▶</text>';
    return s + '</svg>';
  }

  return { svg: svg, TEILE: TEILE };
})();
if (typeof module !== 'undefined') module.exports = ATEMWEGE_BILD;

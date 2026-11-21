/* Bilder für die Arbeitsblätter der Woche 4 (SVG → PNG mit Playwright):
     werkzeuge/bilder/w4_kurve_leer.png, w4_kurve_lsg.png   Pflegekurve für Finn (Blatt 2)
     werkzeuge/bilder/w4_wirbelsaeule.png                  Wirbelsäule mit Höhen (Blatt 1)
     werkzeuge/bilder/w4_atemwege.png                     Atemwege zum Beschriften (Blatt 3; Lösung in der LSG-Tabelle)
   Die Werte der Kurve kommen aus docs/w4/inhalte.js (eine Quelle für Handy und Arbeitsblatt).
   Aufruf (im Hauptverzeichnis): node werkzeuge/w4_bilder.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const W4 = require('../docs/w4/inhalte.js');

const ZIEL = path.join(__dirname, 'bilder');
const SCHRIFT = 'font-family="Calibri, Carlito, Arial, sans-serif"';

/* ---------- Pflegekurve ---------- */
function kurve(mitWerten) {
  const finn = W4.verlauf.karten.filter((k) => k.wer === 'finn').map((k) => ({ zeit: k.zeit, puls: k.puls, rr: k.rr }));
  const a = W4.verlauf.aufloesung;
  const spalten = [...finn, { zeit: a.zeit, puls: a.puls, rr: a.rr, grau: true }];
  const B = 560, H = 380, l = 58, r = 12, o = 40, u = 52, min = 40, max = 150;
  const sw = (B - l - r) / spalten.length;
  const x = (j) => l + (j + 0.5) * sw;
  const y = (v) => o + (max - v) * (H - o - u) / (max - min);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${B} ${H}" width="${B}" height="${H}" ${SCHRIFT}>`;
  s += `<rect width="${B}" height="${H}" fill="#fff"/>`;
  for (let v = min; v <= max; v += 10) {
    const stark = v % 20 === 0;
    s += `<line x1="${l}" x2="${B - r}" y1="${y(v)}" y2="${y(v)}" stroke="${stark ? '#9aa7ad' : '#d5dde0'}" stroke-width="${stark ? 1.2 : 0.8}"/>`;
    if (stark) s += `<text x="${l - 8}" y="${y(v) + 5}" font-size="15" text-anchor="end" fill="#333">${v}</text>`;
  }
  spalten.forEach((p, j) => {
    s += `<line x1="${l + j * sw}" x2="${l + j * sw}" y1="${o - 26}" y2="${H - u}" stroke="#9aa7ad"/>`;
    s += `<text x="${x(j)}" y="${o - 9}" font-size="17" font-weight="bold" text-anchor="middle" fill="${p.grau ? '#777' : '#000'}">${p.zeit}</text>`;
  });
  s += `<line x1="${B - r}" x2="${B - r}" y1="${o - 26}" y2="${H - u}" stroke="#9aa7ad"/>`;
  s += `<line x1="${l}" x2="${B - r}" y1="${o - 26}" y2="${o - 26}" stroke="#9aa7ad"/>`;
  s += `<text x="${l - 8}" y="${o - 9}" font-size="13" text-anchor="end" fill="#333">Uhr</text>`;
  if (mitWerten) {
    let linie = '';
    spalten.forEach((p, j) => {
      const g = p.grau ? ' opacity=".45"' : '';
      s += `<line x1="${x(j)}" x2="${x(j)}" y1="${y(p.rr[0])}" y2="${y(p.rr[1])}" stroke="#1f4e9c" stroke-width="2"${g}/>`;
      s += `<path d="M${x(j) - 9} ${y(p.rr[0]) - 9} L${x(j)} ${y(p.rr[0])} L${x(j) + 9} ${y(p.rr[0]) - 9}" fill="none" stroke="#1f4e9c" stroke-width="3"${g}/>`;
      s += `<path d="M${x(j) - 9} ${y(p.rr[1]) + 9} L${x(j)} ${y(p.rr[1])} L${x(j) + 9} ${y(p.rr[1]) + 9}" fill="none" stroke="#1f4e9c" stroke-width="3"${g}/>`;
      linie += `${j ? 'L' : 'M'}${x(j) + 22} ${y(p.puls)} `;
    });
    s += `<path d="${linie}" fill="none" stroke="#c0392b" stroke-width="2.5" stroke-dasharray="${''}"/>`;
    spalten.forEach((p, j) => { s += `<circle cx="${x(j) + 22}" cy="${y(p.puls)}" r="7" fill="#c0392b"${p.grau ? ' opacity=".45"' : ''}/><text x="${x(j) + 34}" y="${y(p.puls) + 5}" font-size="14" fill="#c0392b">${p.puls}</text>`; });
  }
  // Legende
  const ly = H - 20;
  s += `<circle cx="${l + 8}" cy="${ly - 5}" r="7" fill="#c0392b"/><text x="${l + 22}" y="${ly}" font-size="16">Puls</text>`;
  s += `<path d="M${l + 92} ${ly - 14} L${l + 101} ${ly - 5} L${l + 110} ${ly - 14}" fill="none" stroke="#1f4e9c" stroke-width="3"/>`;
  s += `<text x="${l + 118}" y="${ly}" font-size="16">systolisch</text>`;
  s += `<path d="M${l + 214} ${ly + 2} L${l + 223} ${ly - 7} L${l + 232} ${ly + 2}" fill="none" stroke="#1f4e9c" stroke-width="3"/>`;
  s += `<text x="${l + 240}" y="${ly}" font-size="16">diastolisch</text>`;
  s += `<text x="${B - r}" y="${ly}" font-size="14" text-anchor="end" fill="#555">08:00 = Auflösung</text>`;
  return s + '</svg>';
}

/* ---------- Wirbelsäule (vereinfacht, große Schrift; Farben wie die Zeilen der Tabelle auf Blatt 1) ---------- */
function wirbelsaeule() {
  const B = 300, H = 440;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${B} ${H}" width="${B}" height="${H}" ${SCHRIFT}><rect width="${B}" height="${H}" fill="#fff"/>`;
  const cx = 90; let y = 10;
  const zonen = [
    { n: 4, h: 16, w: 48, farbe: '#d64541' },   // C1–C4: sehr hohe HWS
    { n: 3, h: 16, w: 50, farbe: '#f0932b' },   // C5–C7: HWS
    { n: 12, h: 18, w: 60, farbe: '#3a78c9' },  // Th1–Th12
    { n: 5, h: 22, w: 70, farbe: '#3a78c9' }    // L1–L5
  ];
  const grenzen = [];
  zonen.forEach((z) => {
    const start = y;
    for (let k = 0; k < z.n; k++) { s += `<rect x="${cx - z.w / 2}" y="${y}" width="${z.w}" height="${z.h - 3}" rx="4" fill="${z.farbe}"/>`; y += z.h; }
    grenzen.push([start, y - 3]);
  });
  s += `<path d="M${cx - 36} ${y + 2} L${cx + 36} ${y + 2} L${cx} ${y + 50} Z" fill="#b8c2c7"/>`;
  s += `<line x1="${cx}" y1="6" x2="${cx}" y2="${grenzen[3][0] + 26}" stroke="#f6d55c" stroke-width="8" stroke-linecap="round"/>`;
  const klammer = (a, b, text, farbe) => {
    s += `<path d="M${cx + 44} ${a} h12 V${b} h-12" fill="none" stroke="#333" stroke-width="3"/>`;
    s += `<text x="${cx + 66}" y="${(a + b) / 2 + 14}" font-size="40" font-weight="bold" fill="${farbe}">${text}</text>`;
  };
  klammer(grenzen[0][0], grenzen[1][1], 'HWS', '#c0392b');
  klammer(grenzen[2][0], grenzen[2][1], 'BWS', '#1f4e9c');
  klammer(grenzen[3][0], grenzen[3][1], 'LWS', '#1f4e9c');
  return s + '</svg>';
}

/* ---------- Atemwege (Sicht von vorn) ---------- */
function atemwege(mitBegriffen) {
  const B = 470, H = 470;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${B} ${H}" width="${B}" height="${H}" ${SCHRIFT}><rect width="${B}" height="${H}" fill="#fff"/>`;
  const c = 235;
  // Kehldeckel (Blatt, oberhalb des Kehlkopfs)
  s += `<path d="M${c - 22} 46 Q${c} 6 ${c + 22} 46 Q${c} 34 ${c - 22} 46 Z" fill="#e8a0a8" stroke="#a5525c" stroke-width="2"/>`;
  // Kehlkopf
  s += `<path d="M${c - 40} 50 L${c + 40} 50 L${c + 26} 116 L${c - 26} 116 Z" fill="#f3c9b5" stroke="#8a5a44" stroke-width="2.5"/>`;
  s += `<path d="M${c - 14} 60 L${c} 92 L${c + 14} 60" fill="none" stroke="#8a5a44" stroke-width="2"/>`;
  // Luftröhre mit Knorpelspangen
  s += `<rect x="${c - 20}" y="116" width="40" height="124" fill="#f7dccf" stroke="#8a5a44" stroke-width="2.5"/>`;
  for (let yy = 124; yy < 238; yy += 12) s += `<path d="M${c - 20} ${yy} Q${c} ${yy + 6} ${c + 20} ${yy}" fill="none" stroke="#c59a85" stroke-width="3"/>`;
  // Hauptbronchien: rechts (Bildseite links) kürzer, weiter, steiler; links (Bildseite rechts) länger, enger, flacher
  s += `<path d="M${c - 20} 236 L${c - 62} 322 L${c - 36} 330 L${c - 4} 254 Z" fill="#f7dccf" stroke="#8a5a44" stroke-width="2.5"/>`;
  s += `<path d="M${c + 18} 236 L${c + 120} 296 L${c + 112} 312 L${c + 6} 254 Z" fill="#f7dccf" stroke="#8a5a44" stroke-width="2.5"/>`;
  // kleinere Bronchien
  const ast = (x1, y1, x2, y2, w) => { s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c59a85" stroke-width="${w}" stroke-linecap="round"/>`; };
  ast(c - 50, 324, c - 92, 372, 8); ast(c - 50, 324, c - 40, 386, 8); ast(c - 92, 372, c - 120, 392, 5); ast(c - 92, 372, c - 98, 410, 5);
  ast(c + 116, 304, c + 150, 352, 7); ast(c + 116, 304, c + 104, 360, 6); ast(c + 150, 352, c + 176, 372, 4); ast(c + 150, 352, c + 152, 396, 4);
  // Lungenbläschen (Trauben)
  const traube = (x0, y0) => { [[0, 0], [9, 4], [-8, 6], [3, 12], [12, 14], [-5, 17]].forEach(([dx, dy]) => { s += `<circle cx="${x0 + dx}" cy="${y0 + dy}" r="7" fill="#f2b8c0" stroke="#b5606c" stroke-width="1.5"/>`; }); };
  traube(c - 124, 396); traube(c - 100, 414); traube(c - 40, 392); traube(c + 180, 376); traube(c + 154, 400); traube(c + 104, 364);
  // Nummern mit Linien
  const nummer = (n, tx, ty, zx, zy, begriff, anker = 'start') => {
    s += `<line x1="${tx}" y1="${ty}" x2="${zx}" y2="${zy}" stroke="#333" stroke-width="1.5"/>`;
    s += `<circle cx="${tx}" cy="${ty}" r="15" fill="#fff" stroke="#333" stroke-width="2"/><text x="${tx}" y="${ty + 6}" font-size="18" font-weight="bold" text-anchor="middle">${n}</text>`;
    if (mitBegriffen) s += `<text x="${anker === 'end' ? tx - 22 : tx + 22}" y="${ty + 6}" font-size="17" text-anchor="${anker}" fill="#1f4e9c" font-weight="bold">${begriff}</text>`;
  };
  nummer(1, c + 120, 28, c + 16, 30, 'Kehldeckel');
  nummer(2, c - 120, 82, c - 32, 82, 'Kehlkopf', 'end');
  nummer(3, c + 120, 172, c + 20, 172, 'Luftröhre');
  nummer(4, c - 140, 262, c - 40, 284, 'rechter Haupt-', 'end');
  if (mitBegriffen) s += `<text x="${c - 162}" y="${290}" font-size="17" text-anchor="end" fill="#1f4e9c" font-weight="bold">bronchus</text>`;
  nummer(5, c + 150, 252, c + 80, 278, 'linker Hauptbronchus');
  nummer(6, c - 10, 446, c - 36, 404, 'Lungenbläschen');
  // Orientierung
  s += `<text x="18" y="${H - 10}" font-size="16" fill="#555">◀ rechte Seite der Person</text>`;
  s += `<text x="${B - 18}" y="${H - 10}" font-size="16" text-anchor="end" fill="#555">linke Seite ▶</text>`;
  return s + '</svg>';
}

(async () => {
  const browser = await chromium.launch();
  const seite = await browser.newPage({ deviceScaleFactor: 2 });
  const bilder = {
    w4_kurve_leer: kurve(false), w4_kurve_lsg: kurve(true), w4_wirbelsaeule: wirbelsaeule(),
    w4_atemwege: atemwege(false)
  };
  for (const [name, svg] of Object.entries(bilder)) {
    await seite.setContent(`<style>html,body{margin:0;background:#fff}svg{display:block}</style>${svg}`);
    const datei = path.join(ZIEL, name + '.png');
    await seite.locator('svg').screenshot({ path: datei });
    console.log('geschrieben:', datei);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });

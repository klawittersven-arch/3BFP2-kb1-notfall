/* Tischkarten für die Stammgruppen (Emoji + Name), zum Falten: arbeitsblatt/KB1_W2_Tischkarten.pdf
   Eine Karte pro A4-Seite (quer). Die obere Hälfte steht auf dem Kopf – in der Mitte falten,
   dann ist der Name von beiden Seiten lesbar. Namen und Farben aus docs/inhalte_stunde.js.
   Aufruf (im Hauptverzeichnis): node werkzeuge/tischkarten.js   (braucht Playwright mit Chromium) */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { chromium } = require('playwright');

const WURZEL = path.resolve(__dirname, '..');
const kontext = {};
vm.runInNewContext(fs.readFileSync(path.join(WURZEL, 'docs', 'inhalte_stunde.js'), 'utf8') + ';this.S = STUNDE;', kontext);
const S = kontext.S;

const halbe = (g) => `<div class="halb"><div class="emoji">${g.emoji}</div><div class="name">${g.name}</div><div class="unter">Stammgruppe · KB I Woche 2</div></div>`;
const seiten = S.gruppen.map((g) => `<section class="karte" style="--farbe:${g.farbe}"><div class="oben">${halbe(g)}</div><div class="falz"></div><div class="unten">${halbe(g)}</div></section>`).join('');
const html = `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><style>
@page { size: A4 landscape; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: "Liberation Sans", "DejaVu Sans", Arial, sans-serif; }
.karte { width: 297mm; height: 209mm; overflow: hidden; display: grid; grid-template-rows: 1fr 0 1fr; page-break-after: always; }
.oben { transform: rotate(180deg); }
.oben, .unten { display: grid; place-items: center; border: 6mm solid var(--farbe); }
.falz { border-top: 0.4mm dashed #888; }
.halb { text-align: center; }
.emoji { font-size: 46mm; line-height: 1; font-family: "Noto Color Emoji", sans-serif; }
.name { font-size: 20mm; font-weight: 800; color: var(--farbe); margin-top: 3mm; }
.unter { font-size: 5mm; color: #555; margin-top: 2mm; }
</style></head><body>${seiten}</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setContent(html, { waitUntil: 'load' });
  const ziel = path.join(WURZEL, 'arbeitsblatt', 'KB1_W2_Tischkarten.pdf');
  await p.pdf({ path: ziel, landscape: true, format: 'A4', printBackground: true });
  await b.close();
  console.log('geschrieben:', ziel);
})();

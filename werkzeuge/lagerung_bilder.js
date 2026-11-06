/* Lagerungsbilder fürs Arbeitsblatt: docs/bilder/lagerung_*.svg → werkzeuge/bilder/lagerung_*.png
 * Die Beschriftungen (class="beschriftung") werden ausgeblendet – im kleinen AB-Bild wären sie
 * unlesbar; die Erklärung steht dort in der Tabelle. Beamer, Handy und Nachlese nutzen die SVGs.
 * Aufruf: node werkzeuge/lagerung_bilder.js  (braucht Playwright mit Chromium) */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const QUELLE = path.join(__dirname, '..', 'docs', 'bilder');
const ZIEL = path.join(__dirname, 'bilder');
const NAMEN = ['oberkoerper_hoch', 'beine_hoch', 'seitenlage', 'nicht_bewegen'];

(async () => {
  const browser = await chromium.launch();
  const seite = await browser.newPage({ viewport: { width: 800, height: 450 }, deviceScaleFactor: 1.5 });
  for (const n of NAMEN) {
    const svg = fs.readFileSync(path.join(QUELLE, `lagerung_${n}.svg`), 'utf8');
    await seite.setContent(`<style>html,body{margin:0}svg{display:block;width:800px;height:450px}.beschriftung{display:none}</style>${svg}`);
    const datei = path.join(ZIEL, `lagerung_${n}.png`);
    await seite.locator('svg').screenshot({ path: datei });
    console.log('geschrieben:', datei);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });

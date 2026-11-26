/* QR-Codes für die Handy-Übungen „Für die Schnellen“ (TB 2 neu ab KW 49) – KB I (docs/tb2) und KB II (Repository 3BFP2_KB2_Notfall).
   Gleiche Technik wie werkzeuge/qr_w4.js im KB-I-Repository (qrcode.min.js, Fehlerkorrektur M, Ruhezone). */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const KB1 = 'https://klawittersven-arch.github.io/3BFP2-kb1-notfall/tb2/';
const KB2 = 'https://klawittersven-arch.github.io/3BFP2_KB2_Notfall/';
const SEITEN = {
  kb1ab02: KB1 + 'kb1ab02.html', kb1ab03: KB1 + 'kb1ab03.html', kb1ab04: KB1 + 'kb1ab04.html',
  kb2ab02: KB2 + 'kb2ab02.html', kb2ab03: KB2 + 'kb2ab03.html'
};
const AUS = process.argv[2] || path.join(__dirname, '..', 'qr');

(async () => {
  const browser = await chromium.launch();
  const seite = await browser.newPage();
  await seite.setContent('<!DOCTYPE html><html><body style="margin:0;background:#fff"><div id="q"></div></body></html>');
  await seite.addScriptTag({ path: path.join(__dirname, '..', 'docs', 'vendor', 'qrcode.min.js') });
  fs.mkdirSync(AUS, { recursive: true });
  for (const [name, adresse] of Object.entries(SEITEN)) {
    const daten = await seite.evaluate((text) => {
      const q = document.getElementById('q');
      q.textContent = '';
      // eslint-disable-next-line no-undef
      new QRCode(q, { text, width: 560, height: 560, colorDark: '#000000', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
      const c = q.querySelector('canvas');
      const rand = 40;
      const aus = document.createElement('canvas');
      aus.width = c.width + 2 * rand; aus.height = c.height + 2 * rand;
      const g = aus.getContext('2d');
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, aus.width, aus.height);
      g.imageSmoothingEnabled = false;
      g.drawImage(c, rand, rand);
      return aus.toDataURL('image/png');
    }, adresse);
    fs.writeFileSync(path.join(AUS, `qr_${name}.png`), Buffer.from(daten.split(',')[1], 'base64'));
    console.log('qr_' + name + '.png →', adresse);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });

/* QR-Code für das Arbeitsblatt von Woche 1 erzeugen: qr/qr_w1_stunde.png → w1.html
   (Ersatz für den QR-Code am Beamer: Die SuS geben dann den Raumcode von Hand ein).
   Ohne Python-Pakete: Der Code wird mit derselben Bibliothek gezeichnet, die auch der Beamer benutzt
   (docs/vendor/qrcode.min.js, Fehlerkorrektur M), in Chromium (Playwright) – mit Ruhezone, 640 × 640 px.
   Aufruf (im Hauptverzeichnis): node werkzeuge/qr_w1.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const WURZEL = path.resolve(__dirname, '..');
const BASIS = 'https://klawittersven-arch.github.io/3BFP2-kb1-notfall/';
const SEITEN = { w1_stunde: 'w1.html' };

(async () => {
  const browser = await chromium.launch();
  const seite = await browser.newPage();
  await seite.setContent('<!DOCTYPE html><html><body style="margin:0;background:#fff"><div id="q"></div></body></html>');
  await seite.addScriptTag({ path: path.join(WURZEL, 'docs', 'vendor', 'qrcode.min.js') });
  fs.mkdirSync(path.join(WURZEL, 'qr'), { recursive: true });
  for (const [name, ziel] of Object.entries(SEITEN)) {
    const adresse = BASIS + ziel;
    const daten = await seite.evaluate((text) => {
      const q = document.getElementById('q');
      q.textContent = '';
      // eslint-disable-next-line no-undef
      new QRCode(q, { text, width: 560, height: 560, colorDark: '#000000', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
      const c = q.querySelector('canvas');
      // Ruhezone (weißer Rand) ergänzen
      const rand = 40;
      const aus = document.createElement('canvas');
      aus.width = c.width + 2 * rand; aus.height = c.height + 2 * rand;
      const g = aus.getContext('2d');
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, aus.width, aus.height);
      g.imageSmoothingEnabled = false;
      g.drawImage(c, rand, rand);
      return aus.toDataURL('image/png');
    }, adresse);
    const datei = path.join(WURZEL, 'qr', `qr_${name}.png`);
    fs.writeFileSync(datei, Buffer.from(daten.split(',')[1], 'base64'));
    console.log('geschrieben:', datei, '→', adresse);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });

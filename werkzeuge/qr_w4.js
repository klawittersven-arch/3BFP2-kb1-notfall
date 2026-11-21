/* QR-Codes für die Arbeitsblätter von Woche 4 erzeugen: qr/qr_w4_<übung>.png → w4/<übung>.html
   (Handy-Übungen ohne Anmeldung; Raumcode für die Lehreransicht ist freiwillig).
   Ohne Python-Pakete: Der Code wird mit derselben Bibliothek gezeichnet, die auch der Beamer benutzt
   (docs/vendor/qrcode.min.js, Fehlerkorrektur M), in Chromium (Playwright) – mit Ruhezone, 640 × 640 px.
   Aufruf (im Hauptverzeichnis): node werkzeuge/qr_w4.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const WURZEL = path.resolve(__dirname, '..');
const BASIS = 'https://klawittersven-arch.github.io/3BFP2-kb1-notfall/';
const SEITEN = { w4_verlauf: 'w4/verlauf.html', w4_speisesaal: 'w4/speisesaal.html', w4_rueckenmark: 'w4/rueckenmark.html', w4_trend: 'w4/trend.html', w4_atemweg: 'w4/atemweg.html', w4_verlegung: 'w4/verlegung.html' };

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

/* Alle Folien passen auf die Beamer-Bühne (1600 × 900) – auch mit allen Unterschritten und
 * vollständig aufgedeckten Lösungen. Läuft im Vorführmodus (beamer.html?demo=1), ohne Worker.
 * Start (im Ordner tests/): node folien.test.js */
'use strict';
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const H = require('./hilfen');

const ORDNER = path.join(__dirname, 'ergebnisse');
const k = { window: {} };
vm.createContext(k);
vm.runInContext(fs.readFileSync(path.join(H.DOCS, 'inhalte_stunde.js'), 'utf8') + '\nthis.STUNDE = STUNDE;', k);
const F = k.STUNDE.folien;

(async () => {
  const { server, basis } = await H.serverStarten({});
  const browser = await H.chromium.launch();
  const protokoll = { konsole: [], extern: [] };
  let ok = false;
  try {
    const p = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    H.beobachten(p, protokoll, 'beamer');
    await p.goto(basis + 'beamer.html?demo=1');
    for (let i = 0; i < F.length; i++) {
      const f = F[i];
      await p.click('#menue-knopf');
      await p.click(`.menue-folie >> nth=${i}`);
      await p.waitForFunction((id) => { const x = document.querySelector('.folie'); return x && x.dataset.folie === id; }, f.id);
      // bis zum letzten Unterschritt und alles aufdecken – das ist der längste Zustand der Folie
      // (der Weiter-Knopf heißt bei Unterschritten anders, z. B. „Nächste Maßnahme“; „Weiter: …“ führt zur nächsten Folie)
      for (let s = 0; s < 20 && (await p.$eval('#weiter', (b) => !b.textContent.startsWith('Weiter') && !b.disabled)); s++) await p.click('#weiter');
      H.pruefe(await p.evaluate((id) => document.querySelector('.folie').dataset.folie === id, f.id), `Folie ${i + 1} „${f.kurz}“: alle Unterschritte`);
      if (await p.$('button:has-text("Alle aufdecken")')) await p.click('button:has-text("Alle aufdecken")');
      await p.waitForTimeout(80);
      const m = await p.evaluate(() => {
        const wurzel = document.querySelector('.folie');
        const grenze = document.getElementById('inhalt').getBoundingClientRect().bottom + 2;
        let unten = 0;
        wurzel.querySelectorAll('*').forEach((e) => { unten = Math.max(unten, e.getBoundingClientRect().bottom); });
        const bilder = [...wurzel.querySelectorAll('img')].filter((b) => !b.closest('#mini'));
        return { passt: unten <= grenze, ueber: Math.round(unten - grenze), bilder: bilder.every((b) => b.complete && b.naturalWidth > 0) };
      });
      H.pruefe(m.passt, `Folie ${i + 1} „${f.kurz}“ passt auf die Bühne`, m.passt ? '' : m.ueber + ' px zu hoch');
      // aufgedeckte Lösung noch einmal anklicken → groß; die Großansicht passt auf die Bühne
      const offen = await p.$('.folie .aufdeck.offen, .folie button.glied');
      if (offen) {
        await offen.click();
        const g = await p.evaluate(() => {
          const e = document.getElementById('ebene');
          const k = document.querySelector('.gross-ansicht');
          if (e.hidden || !k) return null;
          const r = k.getBoundingClientRect(), b = document.getElementById('buehne').getBoundingClientRect();
          return r.top >= b.top - 1 && r.bottom <= b.bottom + 1;
        });
        H.pruefe(g === true, `Folie ${i + 1}: aufgedeckte Lösung groß (passt auf die Bühne)`);
        await p.keyboard.press('Escape');
      }
      if (f.typ === 'lagerung') {
        H.pruefe(m.bilder, `Folie ${i + 1}: Bild geladen`);
        if (f.nr === 3) await p.screenshot({ path: path.join(ORDNER, 'folie_seitenlage.png') });
      }
    }
    H.pruefe(protokoll.konsole.length === 0, 'keine Fehler in der Konsole', protokoll.konsole);
    H.pruefe(protokoll.extern.length === 0, 'keine Anfragen an fremde Adressen', protokoll.extern);
    ok = H.ergebnis();
  } finally {
    await browser.close();
    server.close();
  }
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });

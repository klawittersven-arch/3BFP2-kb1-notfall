/* Erstellt die Unterlagen für KB I, Themenblock 2, Woche 1 (SW 6):
     arbeitsblatt/KB1_W1_Kreislauf_Schock_SV.docx       Schülerversion: 2 Blätter (AB 1 und AB 2), 4 Seiten
     arbeitsblatt/KB1_W1_Kreislauf_Schock_LV_LSG.docx   Lehrerversion: Verlaufsplan (90 min), Hinweise, Lösungen
     docs/w1/inhalte_nachlesen.js                        Aufgaben und Musterlösungen für die Beamer-Folien
   Aufruf (im Hauptverzeichnis): node werkzeuge/ab_w1.js
   Voraussetzung: QR-Code qr/qr_w1_stunde.png (node werkzeuge/qr_w1.js). */
'use strict';
const fs = require('fs');
const path = require('path');
const D = require('docx');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType, VerticalAlign, TableLayoutType, HeightRule } = D;
const { bausteine, kopf, fuss, bild, F, SEITE_HOCH, SEITE_QUER, STILE, WURZEL, rahmen, keinRand, linie } = require('./ab_bausteine');
const T = require('./ab_w1_texte');
// Foliennummern für den Verlaufsplan direkt aus dem Foliensatz der App (docs/w1/inhalte_stunde.js)
const STUNDE = (() => { const k = {}; require('vm').runInNewContext(fs.readFileSync(path.join(WURZEL, 'docs', 'w1', 'inhalte_stunde.js'), 'utf8') + ';this.S = STUNDE;', k); return k.S; })();
const FN = (id) => { const i = STUNDE.folien.findIndex((f) => f.id === id); if (i < 0) throw new Error('Folie fehlt: ' + id); return i + 1; };
const FOLIE = (id) => `**Folie ${FN(id)}:**`;
const FOLIEN = (a, b) => `**Folien ${FN(a)}–${FN(b)}:**`;
// ohne Fettdruck – für B.meta (kursiver Hinweis ohne **-Auswertung)
const FOLIE_T = (id) => `Folie ${FN(id)}`;
const FOLIEN_T = (a, b) => `Folien ${FN(a)}–${FN(b)}`;
const BLATT = (nr) => { const f = STUNDE.folien.find((x) => x.typ === 'blatt' && x.nr === nr); if (!f) throw new Error('Blatt-Folie fehlt: ' + nr); return f; };

const AUS = process.argv[2] || path.join(WURZEL, 'arbeitsblatt');
const QR = path.join(WURZEL, 'qr', 'qr_w1_stunde.png');
const FUSS = 'KB I · Woche 1 · Wenn der Kreislauf kämpft';
const BREITE_HOCH = 11906 - 2 * 1134;   // 9638
const BREITE_QUER = 16838 - 2 * 1134;   // 14570
const IC = { lesen: 'icon_lesen.png', markieren: 'icon_markieren.png', schreiben: 'icon_schreiben.png', handy: 'icon_handy.png', stift: 'icon_stift.png', beurteilen: 'icon_beurteilen.png' };

/* Sammelt die Aufgaben und Lösungstexte für die Beamer-Folien (docs/w1/inhalte_nachlesen.js) */
const N = { aufgaben: {}, loesungen: {} };

function blattKopf(B, nr, o = {}) {
  const f = BLATT(nr);
  return new Paragraph({
    keepNext: true, spacing: { before: 0, after: 80 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: '2E75B6' },
    children: [B.emoji(' 📄 ', { size: 24 }), B.b(`Schock: ${f.ueberschrift}`, { size: 25, color: 'FFFFFF' })],
    ...o
  });
}

/* =====================================================================
   SCHÜLERVERSION (mit lsg = true: Lösungsteil der Lehrerversion)
   ===================================================================== */
function schuelerTeil(B, { lsg }) {
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  const merk = (titel, key) => B.merksatz(titel, [T.MERKSAETZE[key]]);
  const L = (wort, n) => B.luecke(wort, n);
  // Aufgabe für die Folien registrieren (Text wie auf dem AB)
  const auf = (nr, text, punkte, vorsatz) => { N.aufgaben[nr] = { nr, text, ...(punkte ? { punkte } : {}), ...(vorsatz ? { vorsatz } : {}) }; };
  const loes = (nr, zeilen) => { N.loesungen[nr] = zeilen; };
  const klein = (text) => new Paragraph({ spacing: { after: 60, line: 240 }, children: B.runs(text, { size: 17, color: F.GRAU_T }) });

  /* ---------- Seite 1: Fall, Leitfrage, Einstieg, AA1 ---------- */
  push(
    blattKopf(B, 1),
    B.titel('Wenn der Kreislauf kämpft – vom Ausgleich zur Schockspirale', lsg ? '[LSG]' : null),
    new Paragraph({ spacing: { after: 100, line: 264 }, children: [B.emoji('🎯 '), B.b('Lernziel: '), ...B.runs('Sie erklären, wie der Körper den Blutdruck regelt, und leiten daraus Kompensation und Dekompensation im Schock ab. Sie erkennen Frühzeichen eines Schocks in einem Fall – auch bei fast normalem Blutdruck – und bewerten den Schockindex.')] }),
    new Paragraph({ spacing: { after: 100 }, children: [bild(IC.handy, 0.5, 0.5), B.t(' = am Smartphone (Stunden-App)      ', { size: 19 }), bild(IC.stift, 0.5, 0.5), B.t(' = auf Papier', { size: 19 })] }),
    B.kasten([
      B.p(T.FALL.einleitung),
      B.p('Schülerin Christin berichtet: ' + T.FALL.zitat, { spacing: { after: 0, line: 264 } })
    ], { kopf: 'Fallbezug: „Reanimation – und nicht nur ich war hilflos“ (Auszug)', fill: 'FFFFFF', kopfFill: 'FFFFFF', rand: '000000' }),
    B.leer(80),
    B.leitfrage(T.LEITFRAGE),
    new Paragraph({ spacing: { before: 100, after: 40 }, keepNext: true, children: [B.b('Antwort auf die Leitfrage '), B.i('(am Ende der Stunde, nach AA4 b):', { size: 19 })] }),
    new Paragraph({ spacing: { after: 120, line: 360 }, children: [
      B.t('Frau Maler ist in Gefahr, weil ihr Körper den Blutdruck nur durch '), L('Kompensation', 18), B.t(' hält. Das zeigen ihr Puls von '), L('118/min', 9),
      B.t(', die blasse Haut und der '), L('kalte Schweiß', 16), B.t('. Ihr Schockindex ist '), L('1,1', 6), B.t(' – also über 1.')
    ] }),
    B.meta(`Die SuS füllen den Lückensatz nach AA4 b aus (${FOLIE_T('w1-aa4b')}: Auftrag, ${FOLIE_T('w1-leitfrage')}: Lösung).`),
    B.handy(T.SEITEN.stunde, [
      B.p('**So läuft die Stunde:** Scannen Sie den QR-Code **am Beamer** und geben Sie Ihren Vornamen ein. Ihr Handy wechselt dann **automatisch mit dem Beamer**.'),
      B.p('Nur falls das nicht klappt: diesen QR-Code scannen und den **Raumcode vom Beamer** eingeben.', { spacing: { after: 0, line: 264 } })
    ], { linkBasis: T.LINK_BASIS, qrDatei: QR, qrCm: 2.2 }),
    B.aa([IC.handy], 'Einstieg: Was meinen Sie?', '**Drei kurze Fragen** zu Frau Maler am Handy. Tippen Sie Ihre Vermutung an. **Falsch liegen ist erlaubt!** Aufgelöst wird am Ende der Stunde.', { spacing: { before: 140, after: 60, line: 264 } }),
    B.meta(`5 min · Einzelarbeit (Handy) → Plenum · AFB I · Vorwissen aus dem Selbstlernpaket aktivieren; Check-out am Ende mit denselben Fragen (vorher/nachher) · ${FOLIEN_T('fall', 'ziel')}`)
  );
  if (lsg) {
    push(B.tabelle([{ text: 'Nr.', w: 700 }, { text: 'Richtig', w: 3200 }, { text: 'Begründung', w: BREITE_HOCH - 3900 }],
      T.ENTSCHEIDUNG.map((e) => [e.nr, { lsg: e.optionen.find((o) => o.startsWith(e.richtig)) }, { lsg: e.erklaerung }]), { schrift: 18 }));
  }
  const aa1Text = 'Tragen Sie die Frühzeichen von Frau Maler in die Tabelle ein: Aussagen und Verhalten · Beobachtungen · Messwerte.';
  auf('AA1', aa1Text);
  loes('AA1', ['**Aussagen und Verhalten:** unruhig; „sie bekomme schlecht Luft“', '**Beobachtungen:** atmet schnell; blass; kalter Schweiß auf der Stirn', '**Messwerte:** Puls 118/min; Blutdruck 105/70 mmHg']);
  const w3 = Math.floor(BREITE_HOCH / 3);
  push(
    B.aa([IC.handy, IC.markieren], 'AA1: Identifizieren – Frühzeichen finden:', '**a)** Tippen Sie am Handy in Christins Bericht alle Stellen an, die zeigen: **Kreislauf oder Atmung verändern sich.** **b)** ' + aa1Text),
    B.meta(`10 min (6 min Handy, 3 min Tabelle sichern, 1 min Merksatz) · Einzelarbeit (Handy) → Einzelarbeit → Plenum · AFB I · Ich-kann-Liste W1 Nr. 1 · KA-Bezug KB 1, Aufg. 5.4 (Befunde in der Fortsetzung des Falls) · ${FOLIEN_T('w1-aa1', 'w1-aa1-merksatz')} · der Beamer zeigt die häufigsten Fehler`),
    B.tabelle(
      [{ text: 'Aussagen und Verhalten', w: w3 }, { text: 'Beobachtungen', w: w3 }, { text: 'Messwerte', w: BREITE_HOCH - 2 * w3 }],
      [
        [lsg ? 'unruhig' : 'z. B. unruhig', lsg ? 'blass' : 'z. B. blass', lsg ? 'Puls 118/min' : 'z. B. Puls 118/min'],
        [{ lsg: '„sie bekomme schlecht Luft“' }, { lsg: 'atmet schnell' }, { lsg: 'Blutdruck 105/70 mmHg' }],
        [{ lsg: '' }, { lsg: 'kalter Schweiß auf der Stirn' }, { lsg: '' }]
      ],
      { hoehe: 440, schrift: 20 }
    ),
    B.leer(60),
    merk('Merksatz AA1', 'aa1')
  );

  /* ---------- Seite 2: Informationstext 1, AA2 Regelkreis und Befunde erklären ---------- */
  push(
    B.kasten([
      ...T.INFO1.map((x, i) => B.p(x, { spacing: { after: i === T.INFO1.length - 1 ? 40 : 30, line: 252 }, ...(x.startsWith('•') ? { indent: { left: 200 } } : {}) })),
      new Paragraph({ spacing: { after: 0 }, children: [B.i('Quelle: nach Lecturio (2023): Regulation des arteriellen Blutdrucks; MSD Manual Profi-Ausgabe (2025): Schock; sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] })
    ], { kopf: 'Informationstext 1: So hält der Körper den Blutdruck' }),
    new Paragraph({ spacing: { before: 40, after: 60 }, children: [B.b('Wörterhilfe: ', { size: 17 }), B.t(T.WOERTER1, { size: 17 })] })
  );
  pageBreakVor(k, 0);   // Informationstext 1 beginnt Seite 2
  const aa2aText = 'Füllen Sie die Lücken im Regelkreis aus. Wortspeicher: Kompensation · eng · Sympathikus · Wasser · Barorezeptoren · Zentralisation · schneller';
  auf('AA2 a', aa2aText);
  loes('AA2 a', ['② Die **Barorezeptoren** melden: „Der Druck sinkt.“', '③ Das Gehirn macht den **Sympathikus** aktiv.', '④ Das Herz schlägt **schneller** → HZV ↑', '⑤ Die Gefäße in Haut, Muskeln, Niere und Darm werden **eng** = **Zentralisation**', '⑥ RAAS und ADH halten **Wasser** und Natrium zurück', '⑦ Der Blutdruck bleibt fast normal = **Kompensation**', '⑦ → ② Die Barorezeptoren messen weiter: Ist der Druck noch zu niedrig, bleibt der Sympathikus aktiv – ein **Regelkreis**.']);
  push(
    B.aa([IC.handy, IC.schreiben], 'AA2: Erklären – So hält der Körper den Blutdruck:', '**a)** Bauen Sie am Handy den **Regelkreis**. Dann: ' + aa2aText.replace('Wortspeicher:', '**Wortspeicher:**')),
    B.meta(`17 min (4 min Infotext lesen, 5 min Handy, 3 min Regelkreis sichern, 4 min AA2 b mit Lösung, 1 min Merksatz) · PA (Lesen) → EA (Handy) → EA → Plenum · AFB I–II · Ich-kann-Liste W1 Nr. 2 · KA-Bezug KB 1, Aufg. 5.4 · ${FOLIEN_T('w1-info1', 'w1-aa2-merksatz')}`),
    regelkreis(B, L)
  );
  const zuord = [
    ['1  Puls 118/min', 'C', 'A  Der Ausgleich wirkt noch: Kompensation.'],
    ['2  blass', 'B', 'B  Die Gefäße der Haut sind eng: Zentralisation.'],
    ['3  kalter Schweiß auf der Stirn', 'E', 'C  Der Sympathikus lässt das Herz schneller schlagen.'],
    ['4  Blutdruck 105/70 (fast normal)', 'A', 'D  Stresshormone; das Gehirn bekommt weniger Sauerstoff.'],
    ['5  unruhig', 'D', 'E  Der Sympathikus regt die Schweißdrüsen an.']
  ];
  const aa2bText = 'Ordnen Sie zu: Welche Erklärung passt zu welchem Befund von Frau Maler? Schreiben Sie den Buchstaben.';
  auf('AA2 b', aa2bText);
  loes('AA2 b', zuord.map((z) => {
    const e = zuord.find((x) => x[2].charAt(0) === z[1])[2];
    return `${z[0].replace(/^\d\s+/, '')} → **${z[1]}**: ${e.slice(3)}`;
  }));
  push(
    B.teil([IC.schreiben], '**b)** ' + aa2bText),
    B.tabelle([{ text: 'Befund von Frau Maler', w: 3300 }, { text: 'Buchstabe', w: 1150 }, { text: 'Erklärung', w: BREITE_HOCH - 4450 }],
      zuord.map((z) => [z[0], { lsg: z[1], mitte: true }, z[2]]), { schrift: 19 }),
    B.leer(60),
    merk('Merksatz AA2', 'aa2')
  );

  /* ---------- Seite 3: Informationstext 2, Schockformen, AA3 Schockspirale ---------- */
  const formenText = 'Schreiben Sie den Namen der Schockform in die erste Spalte. Wortspeicher: kardiogen · obstruktiv · hypovolämisch · distributiv';
  auf('Schockformen', formenText);
  loes('Schockformen', T.SCHOCKFORMEN.map((z) => `**${z[0]}** – ${z[1]} (z. B. ${z[2]})`));
  push(
    blattKopf(B, 2, { pageBreakBefore: true }),
    // derselbe QR-Code wie auf Blatt 1 – falls die Stunde mit Blatt 2 beginnt und Blatt 1 nicht dabei ist
    B.handy(T.SEITEN.stunde, [
      B.p('**Stunden-App:** Scannen Sie den QR-Code **am Beamer** und geben Sie Ihren Vornamen ein. Nur falls das nicht klappt: diesen QR-Code scannen und den **Raumcode vom Beamer** eingeben.', { spacing: { after: 0, line: 252 } })
    ], { linkBasis: T.LINK_BASIS, qrDatei: QR, qrCm: 1.7 }),
    B.kasten([
      ...T.INFO2.map((x, i) => B.p(x, { spacing: { after: 50, line: 252 } })),
      new Paragraph({ spacing: { after: 0 }, children: [B.i('Quelle: nach MSD Manual Profi-Ausgabe (2025): Schock; Lecturio (2023): Schock – Überblick; sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] })
    ], { kopf: 'Informationstext 2: Schock und Schockspirale' }),
    new Paragraph({ spacing: { before: 40, after: 60 }, children: [B.b('Wörterhilfe: ', { size: 17 }), B.t(T.WOERTER2, { size: 17 })] }),
    B.teil([IC.schreiben], '**Die vier Schockformen:** ' + formenText.replace('Wortspeicher:', '**Wortspeicher:**')),
    B.meta(`7 min (5 min lesen und ausfüllen, 2 min Lösung) · PA → Plenum · AFB I · Ich-kann-Liste W1 Nr. 3 · ${FOLIEN_T('w1-info2', 'w1-formen-loesung')}`),
    B.tabelle([{ text: 'Schockform', w: 2200 }, { text: 'Das Problem – Beispiele', w: BREITE_HOCH - 2200 }],
      T.SCHOCKFORMEN.map((z) => [{ lsg: z[0] }, `**${z[1]}** – z. B. ${z[2]}`]), { schrift: 19 })
  );
  auf('AA3', 'Füllen Sie die Lücken in der Schockspirale aus. Wortspeicher: versackt · Laktat · Dekompensation · Urin · sauer · Zentralisation · weit');
  loes('AA3', ['② Gefäße in Haut, Muskeln und Darm werden eng = **Zentralisation**', '③ es entsteht **Laktat** → das Blut wird **sauer** (Laktatazidose)', '④ die Gefäße werden **weit** und durchlässig → das Blut **versackt** → der Blutdruck fällt = **Dekompensation**', '⑤ Niere: kaum **Urin** · Lunge: Atemnot · Gehirn: Verwirrtheit, Bewusstlosigkeit']);
  push(
    B.aa([IC.handy, IC.schreiben], 'AA3: Beschreiben – die Schockspirale:', 'Bauen Sie am Handy die **Schockspirale** (Achtung: Fehlerkarten!). Dann: Füllen Sie die Lücken aus. **Wortspeicher:** versackt · Laktat · Dekompensation · Urin · sauer · Zentralisation · weit'),
    B.meta(`10 min (6 min Handy, 3 min sichern, 1 min Merksatz) · EA (Handy) → EA → Plenum · AFB I–II · Ich-kann-Liste W1 Nr. 4 · Fehlerkarten nach Lohner („Spirale schließen“) · ${FOLIEN_T('w1-aa3', 'w1-aa3-merksatz')}`),
    spirale(B, L),
    B.leer(20),
    merk('Merksatz AA3', 'aa3')
  );

  /* ---------- Seite 4: AA4 Früh-/Spätzeichen und Schockindex, AA5 neuer Fall ---------- */
  push(
    B.aa([IC.handy, IC.beurteilen], 'AA4: Frühzeichen und Schockindex:', '**a)** Quiz am Handy: **Früh- oder Spätzeichen?** Hilfe: Tabelle.', { pageBreakBefore: true, spacing: { before: 0, after: 40, line: 252 } }),
    B.meta(`9 min (4 min Quiz, 1 min Merksatz, 3 min AA4 b und Leitfrage, Lösungen) · EA (Handy) → EA → Plenum · AFB II–III · Ich-kann-Liste W1 Nr. 5 · ${FOLIEN_T('w1-aa4', 'w1-leitfrage')}`),
    B.tabelle([{ text: '', w: 2000 }, { text: '🟡 Frühzeichen (Kompensation)', w: 3819 }, { text: '🔴 Spätzeichen (Dekompensation)', w: BREITE_HOCH - 5819 }],
      [...T.FRUEH_SPAET.map((z) => [{ text: `**${z[0]}**`, fill: F.LACHS }, z[1], z[2]]),
        [{ colSpan: 3, text: 'Quelle: nach Pflegias – Generalistische Pflegeausbildung, Band 2 (Cornelsen), S. 801, Tab. 1 „Typische Symptome bei Schock“ (Erwachsene).', o: { size: 14, color: F.GRAU_T } }]], { schrift: 18 })
  );

  push(merk('Merksatz AA4', 'aa4'));
  auf('AA4 b', 'Berechnen und bewerten Sie den Schockindex von Frau Maler um 11 Uhr (Puls 118/min, Blutdruck 105/70 mmHg).');
  loes('AA4 b', ['Schockindex = 118 : 105 ≈ **1,1**', '→ über 1 (normal ca. 0,5) → **spricht für einen Schock** – obwohl der Blutdruck fast normal ist.']);
  auf('Leitfrage', T.LEITFRAGE);
  loes('Leitfrage', ['Frau Maler ist in Gefahr, weil ihr Körper den Blutdruck nur durch **Kompensation** hält.', 'Das zeigen ihr Puls von **118/min**, die blasse Haut und der **kalte Schweiß** (dazu Unruhe und schnelle Atmung).', 'Ihr Schockindex ist **1,1** – also über 1. Reicht der Ausgleich nicht mehr, fällt der Blutdruck: Schockspirale.']);
  const kreuz = (an) => (lsg && an ? B.loes('☒') : B.t('☐'));
  push(
    B.teil([IC.schreiben], '**b)** Berechnen und bewerten Sie den **Schockindex** von Frau Maler um 11 Uhr.', { spacing: { before: 80, after: 20, line: 252 }, keepNext: true }),
    new Paragraph({ spacing: { before: 20, after: 40 }, children: [
      B.b('Schockindex = '), L('118', 6), B.t(' : '), L('105', 6), B.t(' ≈ '), L('1,1', 6), B.t('   →   '), kreuz(false), B.t(' normal    '), kreuz(true), B.t(' spricht für einen Schock')
    ] })
  );
  push(
    B.aa([IC.schreiben], 'AA5: Ein neuer Fall:', '**Allein** (9 Min.), Hilfe: nur **Merksatz AA2 und AA4**. Dann Peer-Korrektur.', { spacing: { before: 120, after: 40, line: 252 } }),
    B.meta('14 min (9 min schreiben, 5 min Peer-Korrektur) · EA → PA mit App-Raster und Musterlösung am Beamer · AFB I–III · Aufgabenform und Operatoren wie KA KB 1, Aufg. 5.4 (5.2 fast wortgleich, anderer Fall) · Fall nach Lohner (Frau Berger) · Examensvorbild 5.1: „Nennen Sie vier in der Fallsituation beschriebene Symptome, die auf … hinweisen“ (Mai 2023 Tag 3, 4.2)'),
    B.kasten(T.TRANSFERFALL.map((x, i) => B.p((i ? '' : '**Fallsituation:** ') + x, i === T.TRANSFERFALL.length - 1 ? { spacing: { after: 0, line: 252 } } : { spacing: { after: 60, line: 252 } })), { fill: F.GRAU_HELL, rand: F.GRAU_R }),
    B.leer(40)
  );
  const a51 = { nr: '5.1', text: 'Nennen Sie vier Befunde aus der Situation um 10:30 Uhr, die auf einen beginnenden Schock hinweisen. Berücksichtigen Sie die Vorwerte.', punkte: 2 };
  const a52 = { nr: '5.2', text: 'Erläutern Sie, wie der Körper von Frau Berger um 10:30 Uhr den Blutdruck aufrechterhält. Begründen Sie, warum ein Blutdruck von 112/90 mmHg einen Schock nicht ausschließt.', punkte: 3 };
  const a53 = { nr: '5.3', text: 'Bewerten Sie den Schockindex von Frau Berger um 10:30 Uhr.', punkte: 2 };
  [a51, a52, a53].forEach((a) => auf(a.nr, a.text, a.punkte));
  const l51 = ['z. B.: ängstlich, „Mir ist so komisch.“ (Unruhe) · Durst: fragt mehrmals, ob sie etwas trinken darf · Haut blass und feucht, Hände kalt · Puls von 84 auf 118/min gestiegen · Blutdruck von 135/80 auf 112/90 mmHg gefallen – die Blutdruckamplitude ist von 55 auf 22 mmHg kleiner geworden · Atemfrequenz 24/min.', '(je Befund 0,5 P., max. 2 P.; Messwerte nur mit Vorwert voll werten)'];
  const l52 = ['Die Barorezeptoren (Aortenbogen, Halsschlagader) melden den Druckabfall, der Sympathikus wird aktiviert (Adrenalin, Noradrenalin): Die Herzfrequenz steigt (118/min), die Gefäße in Haut, Muskeln und Darm werden eng (Zentralisation) → blasse, kalte, feuchte Haut.', 'RAAS und ADH halten Wasser und Natrium zurück und verengen die Gefäße (Durst).', 'Durch diese Kompensation bleibt der Blutdruck anfangs fast normal; er fällt erst, wenn der Ausgleich nicht mehr reicht. Der Blutdruck ist deshalb ein Spätzeichen – Frühzeichen sind Tachykardie, schnelle Atmung, Unruhe, Blässe und kalter Schweiß.', '(je schlüssiger Aspekt 1 P., max. 3 P.; ohne Begründung „Blutdruck fällt spät“ max. 2 P.)'];
  const l53 = ['Schockindex = 118 : 112 ≈ 1,05 → über 1 (normal ca. 0,5) → spricht für einen Schock. Sofort die Pflegefachkraft bzw. Ärztin oder Arzt informieren und engmaschig überwachen (Verdacht auf Nachblutung).', '(Rechnung 1 P., Bewertung 1 P.)'];
  loes('5.1', l51); loes('5.2', l52); loes('5.3', l53);
  loes('5.1 und 5.2', [...l51.map((z) => '5.1 ' + z), ...l52.map((z, i) => (i ? '' : '5.2 ') + z)]);
  push(
    aufgabenMitSumme(B, [a51, a52, a53]),
    ...(lsg
      ? [zw(B, '5.1'), linien(B, 2, l51), zw(B, '5.2'), linien(B, 4, l52), zw(B, '5.3'), linien(B, 1, l53)]
      : [linienMitNr(B, [['5.1', 2], ['5.2', 4], ['5.3', 1]])])
  );
  return k;
}
// Schreiblinien etwas enger als in ab_bausteine (Seite 4 muss reichen); in der LSG: Lösung im Kasten
// nr (nur SV): Aufgabennummer fett am Anfang der ersten Linie – spart eine eigene Zeile über den Linien
function linien(B, anzahl, loesung, nr, hoehe = 400) {
  if (B.lsg && loesung.length) return B.linien(anzahl, loesung);
  const rl = { style: D.BorderStyle.SINGLE, size: 4, color: '8C8C8C' };
  const inhalt = (i) => new Paragraph({ spacing: { after: 0 }, children: i === 0 && nr ? [B.b(nr + ' ', { size: 20 })] : [] });
  return new Table({
    width: { size: BREITE_HOCH, type: WidthType.DXA }, columnWidths: [BREITE_HOCH], layout: TableLayoutType.FIXED,
    rows: Array.from({ length: anzahl }, (_, i) => new TableRow({ height: { value: hoehe, rule: HeightRule.EXACT }, children: [new TableCell({ width: { size: BREITE_HOCH, type: WidthType.DXA }, verticalAlign: VerticalAlign.BOTTOM, borders: { top: keinRand, left: keinRand, right: keinRand, bottom: rl }, children: [inhalt(i)] })] }))
  });
}
// Alle Schreiblinien in einer Tabelle (ohne Abstand dazwischen); die Nummer steht fett am Anfang der ersten Linie
function linienMitNr(B, teile, hoehe = 400) {
  const rl = { style: D.BorderStyle.SINGLE, size: 4, color: '8C8C8C' };
  const zeilen = [];
  teile.forEach(([nr, anzahl]) => {
    for (let i = 0; i < anzahl; i++) {
      zeilen.push(new TableRow({ cantSplit: true, height: { value: hoehe, rule: HeightRule.EXACT }, children: [new TableCell({
        width: { size: BREITE_HOCH, type: WidthType.DXA }, verticalAlign: VerticalAlign.BOTTOM, borders: { top: keinRand, left: keinRand, right: keinRand, bottom: rl },
        children: [new Paragraph({ spacing: { after: 0 }, children: i === 0 ? [B.b(nr + ' ', { size: 20 })] : [] })]
      })] }));
    }
  });
  return new Table({ width: { size: BREITE_HOCH, type: WidthType.DXA }, columnWidths: [BREITE_HOCH], layout: TableLayoutType.FIXED, rows: zeilen });
}
// Aufgabentabelle wie B.aufgaben, mit Zeile „Punkte gesamt“
function aufgabenMitSumme(B, liste) {
  const w1 = 620, w3 = 1150, w2 = BREITE_HOCH - w1 - w3;
  const summe = liste.reduce((x, a) => x + a.punkte, 0);
  return B.tabelle(
    [{ text: 'Nr.', w: w1 }, { text: 'Aufgabe', w: w2 }, { text: 'Punkte', w: w3 }],
    [...liste.map((a) => [{ text: `**${a.nr}**` }, a.text, `___ / ${a.punkte}`]), ['', '**Punkte gesamt**', `**___ / ${summe}**`]],
    { kopfFill: F.LACHS_KOPF }
  );
}
function zw(B, text, rechts) {
  return new Paragraph({
    children: [B.b(text, { size: 20 }), ...(rechts ? [new TextRun({ children: [new D.Tab()], font: 'Calibri' }), B.b(rechts, { size: 20 })] : [])],
    tabStops: [{ type: D.TabStopType.RIGHT, position: BREITE_HOCH }],
    spacing: { before: 60, after: 0 }, keepNext: true
  });
}

// Seitenumbruch vor dem Element an Position i (ab dem Ende der Liste gezählt: 0 = vorletztes Element)
function pageBreakVor(liste, rueckwaerts) {
  const el = liste[liste.length - 2 - rueckwaerts];
  if (el) el.__umbruchVor = true;
}

/* ---------- Regelkreis: 7 Kästen in zwei Reihen (→ … ↓ … ←), Lücken mit Wortspeicher ---------- */
function regelkreis(B, L) {
  const wK = 2150, wP = 346;
  const blau = rahmen('2E75B6', 8);
  const sz = 18;
  const kasten = (teile, fill = F.BLAU_HELL) => B.zelle([new Paragraph({ spacing: { after: 0, line: 240 }, children: teile.flatMap((t) => (typeof t === 'string' ? B.runs(t, { size: sz }) : [t])) })], wK,
    { borders: blau, shading: { type: ShadingType.CLEAR, color: 'auto', fill }, verticalAlign: VerticalAlign.CENTER });
  const pfeil = (z) => B.zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.b(z, { size: 28, color: '2E75B6' })] })], wP,
    { borders: { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand }, verticalAlign: VerticalAlign.CENTER });
  const leer = (w) => B.zelle([new Paragraph({ spacing: { after: 0 }, children: [] })], w, { borders: { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand } });
  const lz = L;
  const k1 = kasten(['**①** Der Blutdruck **fällt**.'], F.LACHS_HELL);
  const k2 = kasten(['**②** Die ', lz('Barorezeptoren', 14), ' melden: „Der Druck sinkt.“']);
  const k3 = kasten(['**③** Das Gehirn macht den ', lz('Sympathikus', 12), ' aktiv.']);
  const k4 = kasten(['**④** Das Herz schlägt ', lz('schneller', 10), ' → HZV ↑']);
  const k5 = kasten(['**⑤** Die Gefäße in Haut, Muskeln, Niere und Darm werden ', lz('eng', 6), ' = ', lz('Zentralisation', 13)]);
  const k6 = kasten(['**⑥** RAAS und ADH halten ', lz('Wasser', 9), ' und Natrium zurück → Durst, wenig Urin']);
  const k7 = kasten(['**⑦** Der Blutdruck bleibt fast normal = ', lz('Kompensation', 13)], 'E2F3E7');
  const ohne = { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand };
  // Der Kreis schließt sich: ⑦ → ② (die Barorezeptoren messen weiter). ① steht außerhalb – der Auslöser.
  const hoch = B.zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.b('↑', { size: 28, color: '2E75B6' }), B.t(' messen weiter', { size: 16, color: '2E75B6' })] })], wK, { borders: ohne, verticalAlign: VerticalAlign.CENTER });
  const mitte = B.zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.b('Regelkreis', { size: 22, color: '2E75B6' })] })], wP + wK + wP, { borders: ohne, verticalAlign: VerticalAlign.CENTER, columnSpan: 3 });
  const runter = B.zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.b('↓', { size: 28, color: '2E75B6' })] })], wK, { borders: ohne });
  const breiten = [wK, wP, wK, wP, wK, wP, wK];
  return new Table({
    width: { size: breiten.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: breiten, layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({ cantSplit: true, height: { value: 760, rule: HeightRule.ATLEAST }, children: [k1, pfeil('→'), k2, pfeil('→'), k3, pfeil('→'), k4] }),
      new TableRow({ cantSplit: true, children: [leer(wK), leer(wP), hoch, mitte, runter] }),
      new TableRow({ cantSplit: true, height: { value: 760, rule: HeightRule.ATLEAST }, children: [leer(wK), leer(wP), k7, pfeil('←'), k6, pfeil('←'), k5] })
    ]
  });
}

/* ---------- Schockspirale: 5 Schritte, links kompensiert/dekompensiert, rechts Teufelskreis ---------- */
function spirale(B, L) {
  const wL = 1650, wR = 1250, wM = BREITE_HOCH - wL - wR;
  const sz = 18;
  const ohne = { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand };
  const schritt = (teile) => B.zelle([new Paragraph({ spacing: { after: 0, line: 240 }, children: teile.flatMap((t) => (typeof t === 'string' ? B.runs(t, { size: sz }) : [t])) })], wM,
    { borders: rahmen('2E75B6', 8), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.BLAU_HELL }, verticalAlign: VerticalAlign.CENTER });
  const seite = (zeilen, fill, rowSpan) => B.zelle(zeilen.map((z, i) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: i === zeilen.length - 1 ? 0 : 40, line: 230 }, children: B.runs(z, { size: 17 }) })), wL,
    { borders: rahmen(F.GRAU_R, 4), shading: { type: ShadingType.CLEAR, color: 'auto', fill }, verticalAlign: VerticalAlign.CENTER, rowSpan });
  const rechts = B.zelle([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [B.b('↻', { size: 40, color: 'C00000' })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: 230 }, children: B.runs('Jede Folge verstärkt die Ursache: **Teufelskreis**', { size: 17 }) })
  ], wR, { borders: ohne, verticalAlign: VerticalAlign.CENTER, rowSpan: 5 });
  const s1 = schritt(['**①** Volumenmangel oder Kreislaufstörung → der Blutdruck droht zu fallen.']);
  const s2 = schritt(['**②** Puls ↑, die Gefäße in Haut, Muskeln und Darm werden eng (', L('Zentralisation', 14), ') → Haut blass, kalt, schweißig. Herz und Gehirn bleiben versorgt.']);
  const s3 = schritt(['**③** Das Gewebe bekommt zu wenig Sauerstoff → es entsteht ', L('Laktat', 9), ' → das Blut wird ', L('sauer', 7), ' (Laktatazidose).']);
  const s4 = schritt(['**④** Die Gefäße werden ', L('weit', 6), ' und durchlässig → das Blut ', L('versackt', 9), ' → der Blutdruck fällt = ', L('Dekompensation', 14), '.']);
  const s5 = schritt(['**⑤** Die Organe versagen: Niere – kaum ', L('Urin', 6), ' · Lunge – Atemnot · Gehirn – Verwirrtheit, Bewusstlosigkeit → ohne Behandlung Tod.']);
  const breiten = [wL, wM, wR];
  return new Table({
    width: { size: BREITE_HOCH, type: WidthType.DXA }, columnWidths: breiten, layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({ cantSplit: true, children: [seite(['**kompensierter Schock**', 'Blutdruck fast normal'], 'E2F3E7', 2), s1, rechts] }),
      new TableRow({ cantSplit: true, children: [s2] }),
      new TableRow({ cantSplit: true, children: [seite(['**dekompensierter Schock**', 'der Ausgleich reicht nicht mehr – der Blutdruck fällt'], 'FBE3E3', 3), s3] }),
      new TableRow({ cantSplit: true, children: [s4] }),
      new TableRow({ cantSplit: true, children: [s5] })
    ]
  });
}

/* =====================================================================
   LEHRERVERSION: Verlaufsplan (quer) + Hinweise
   ===================================================================== */
function verlaufsplan(B) {
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  push(
    B.titel('Wenn der Kreislauf kämpft – vom Ausgleich zur Schockspirale'),
    new Paragraph({ spacing: { after: 80 }, children: [B.emoji('🎯 '), B.b('Lernziel: '), ...B.runs('Die Lernenden erklären die Blutdruckregulation und leiten daraus Kompensation und Dekompensation im Schock ab. Sie erkennen Schockfrühzeichen in einer Fallsituation auch bei (fast) normalem Blutdruck und bewerten den Schockindex.')] }),
    B.p('**Rahmen:** KB I · Woche 1 (SW 6) · **90 min** (Planung: 3 UStd. – für die 3BFP2/2 auf 2 UStd. gerafft) · Leitfall „Frau Maler“ (11 Uhr) · Vorwissen: Selbstlernpaket Herz-Kreislauf (HZV, Barorezeptoren, Sympathikus, RAAS), Vitalzeichen (CE 02), Einführung des Leitfalls · Ich-kann-Liste KB I, Woche 1, Nr. 1–5 · KA-Bezug: KB 1, Aufg. 5.4 · AB: 2 Blätter (4 Seiten), nacheinander austeilen'),
    B.p('**Kompetenzbezug:** Anlage 1 PflAPrV I.2.a/b, I.2.f, I.4.a · Landeslehrplan CE 06 „In Akutsituationen sicher handeln“ (Schockzustände erkennen)')
  );
  const sp = [
    { text: 'Zeit', w: 900 }, { text: 'Phase', w: 1800 }, { text: 'Lehrerhandeln', w: 3500 }, { text: 'Schülerhandeln', w: 3000 },
    { text: 'Sozialform', w: 1150 }, { text: 'Material', w: 1400 }, { text: 'Didaktische Funktion', w: 0 }
  ];
  sp[6].w = BREITE_QUER - sp.slice(0, 6).reduce((s, x) => s + x.w, 0);
  const z = (zeit, phase, l, s, soz, mat, fkt) => [zeit, `**${phase}**`, l, s, soz, mat, fkt];
  const ueber = (text) => [{ colSpan: 7, text, fill: F.GRAU_HELL, o: { italics: true } }];
  const zeilen = [
    z('vor der Stunde', 'Vorbereitung', `AB als **zwei einzelne Blätter** (je beidseitig) kopieren. Am Laptop **beamer-w1.html** öffnen → „Neuen Raum starten“ (Probe vorher: „Probestunde mit erfundener Klasse“).`, '–', '–', 'Beamer, Blatt 1 und 2', 'Ablauf ohne Umbaupausen; Blatt 2 erst nach AA2'),
    z('0–4', `Ankommen (${FOLIEN('start', 'blatt1')})`, `${FOLIE('start')} QR-Code am Beamer, Namen erscheinen. ${FOLIE('blatt1')} **Blatt 1 austeilen.**`, 'QR-Code scannen, Vornamen eingeben.', 'EA', 'Beamer, Handy, Blatt 1', 'Technik einmal für die ganze Stunde'),
    z('4–10', `Problemorientierter Einstieg (${FOLIEN('fall', 'ziel')})`, `${FOLIE('fall')} Fallauszug vorlesen, Leitfrage. ${FOLIE('einstieg')} Frage für Frage: „Weiter“ zeigt die Frage, die SuS stimmen ab (sicher / vermute nur), „Ergebnisse anzeigen“ zeigt die Verteilung – **ohne Auflösung**. ${FOLIE('einstieg-ergebnis')} Übersicht (★ = größte Uneinigkeit). ${FOLIE('ziel')} Lernziel und Fahrplan.`, 'Vermutungen am Handy; Ergebnis der Klasse ansehen.', 'EA → Plenum', 'Handy, Beamer', 'Vorwissen (Selbstlernpaket) aktivieren, Fehlvorstellung „Blutdruck normal = alles gut“ sichtbar machen; kognitiver Konflikt. AFB I'),
    ueber('„Sie sind geteilter Meinung – genau das klären wir heute. Am Ende prüfen Sie Ihre Vermutungen.“'),
    z('10–20', `Erarbeitung I: Frühzeichen finden (AA1, ${FOLIEN('w1-aa1', 'w1-aa1-merksatz')})`, `${FOLIE('w1-aa1')} Uhr starten (6 min); Fortschritt je Person und **häufige Fehler** am Beamer beobachten (übersehen / falsch markiert). ${FOLIE('w1-aa1-loesung')} Tabelle sichern: SuS aufrufen, Zeilen aufdecken; dabei die häufigsten Fehler ansprechen (z. B. „Wade dick“ ist kein Schockzeichen – aber wichtig!). ${FOLIE('w1-aa1-merksatz')} Merksatz AA1 lesen.`, 'Christins Bericht am Handy lesen, Befunde antippen, prüfen, verbessern (Schutz gegen Raten); Befunde in die Tabelle AA1 eintragen; vergleichen.', 'EA (Handy) → EA → Plenum', 'Handy, AB S. 1', 'Befunde im Fließtext identifizieren und ordnen (IKL Nr. 1; Klausurformat „Fließtext mit verteilten Befunden“). AFB I'),
    z('20–37', `Erarbeitung II: Regelkreis (AA2, ${FOLIEN('w1-info1', 'w1-aa2-merksatz')})`, `${FOLIE('w1-info1')} Infotext 1 zu zweit lesen (Uhr 4 min). ${FOLIE('w1-aa2a')} Regelkreis am Handy (Uhr 5 min), häufige Fehler beobachten. ${FOLIE('w1-aa2a-loesung')} Lücken im Regelkreis sichern. ${FOLIE('w1-aa2b')} AA2 b zeigen, „Jetzt bearbeiten“ (Uhr 2,5 min). ${FOLIE('w1-aa2b-loesung')} Lösung aufdecken: Jeder Befund wird mit dem Mechanismus erklärt. ${FOLIE('w1-aa2-merksatz')} Merksatz AA2 lesen.`, 'Infotext lesen und Fachwörter unterstreichen; Kette am Handy bauen (Fehlerkarten mit Begründung); Lücken füllen (Wortspeicher); Befunde den Erklärungen zuordnen.', 'PA → EA (Handy) → EA → Plenum', 'AB S. 2, Handy', 'Blutdruckregulation erklären (IKL Nr. 2); Mechanismus ↔ Befund verknüpfen – Kern von KA 5.4. AFB I–II'),
    ueber('„Der Körper ist ein guter Ausgleicher – aber Ausgleich kostet. Was passiert, wenn die Ursache weiterbesteht?“'),
    z('37–54', `Erarbeitung III: Schock, Schockformen, Schockspirale (AA3, ${FOLIEN('blatt2', 'w1-aa3-merksatz')})`, `${FOLIE('blatt2')} **Blatt 2 austeilen.** ${FOLIE('w1-info2')} Infotext 2 zu zweit lesen, Schockformen eintragen (Uhr 5 min). ${FOLIE('w1-formen-loesung')} Lösung. ${FOLIE('w1-aa3')} Schockspirale am Handy (Uhr 6 min), häufige Fehler (Fehlerkarten). ${FOLIE('w1-aa3-loesung')} Lücken sichern; Wendepunkt Kompensation → Dekompensation zeigen. ${FOLIE('w1-aa3-merksatz')} Merksatz AA3.`, 'Lesen, Schockformen mit Wortspeicher und Wörterhilfe benennen; Spirale am Handy bauen, Fehlerkarten erkennen; Lücken füllen.', 'PA → EA (Handy) → Plenum', 'AB S. 3, Handy', 'Schockdefinition und Schockformen (IKL Nr. 3); Schockspirale in Schritten (IKL Nr. 4), Organfolgen. AFB I–II'),
    z('54–63', `Erarbeitung IV: Früh-/Spätzeichen, Schockindex (AA4, ${FOLIEN('w1-aa4', 'w1-leitfrage')})`, `${FOLIE('w1-aa4')} Quiz am Handy (Uhr 4 min), häufige Fehler. ${FOLIE('w1-aa4-merksatz')} Merksatz AA4. ${FOLIE('w1-aa4b')} „Jetzt bearbeiten“: Schockindex Frau Maler, dann Lückensatz zur Leitfrage auf Blatt 1 (Uhr 3 min). ${FOLIE('w1-aa4b-loesung')} und ${FOLIE('w1-leitfrage')} Lösungen aufdecken.`, 'Karten zuordnen (Tabelle als Hilfe); Schockindex berechnen und bewerten; Leitfrage im Lückensatz beantworten.', 'EA (Handy) → EA → Plenum', 'AB S. 4 und S. 1, Handy', 'Frühzeichen (Pflegias) und Schockindex bewerten (IKL Nr. 5); Leitfrage beantworten. AFB II–III'),
    ueber('„Jetzt wenden Sie alles an: ein neuer Fall – allein, nur mit den Merksätzen AA2 und AA4, mit Punkten.“'),
    z('63–77', `Sicherung: ein neuer Fall (AA5, ${FOLIEN('w1-aa5', 'w1-aa5-peer-2')})`, `${FOLIE('w1-aa5')} Fall und Aufgaben zeigen, „Jetzt bearbeiten“: Countdown 9 min. ${FOLIE('w1-aa5-peer')} Tausch mit der Nachbarin oder dem Nachbarn; das Raster erscheint am Handy (Uhr 5 min); Musterlösung 5.1/5.2 aufdecken. ${FOLIE('w1-aa5-peer-2')} Musterlösung 5.3 (die Uhr läuft weiter).`, '5.1–5.3 allein schreiben; Lösung der Partnerin oder des Partners mit dem App-Raster bewerten (Punkte wie im Erwartungshorizont), Rückmeldung in einem Satz.', 'EA → PA', 'AB S. 4, Handy', 'Transfer auf einen unbekannten Fall im KA-Format; 5.2 ist fast wortgleich mit KA 5.4 (anderer Fall). AFB I–III'),
    z('77–82', `Abschlusssicherung: Hatten Sie recht? (${FOLIEN('checkout-intro', 'ende')})`, `${FOLIE('checkout-intro')} kurz zusammenfassen. ${FOLIE('checkout')} Frage für Frage: abstimmen, „Auflösung zeigen“ (Anfang und jetzt nebeneinander). ${FOLIE('checkout-ergebnis')} Vorher – nachher. ${FOLIE('ende')} Ende.`, 'Dieselben Fragen erneut entscheiden; eigene Bilanz am Handy.', 'EA (Handy) → Plenum', 'Handy, Beamer', 'Vermutungen überprüfen, Lernzuwachs sichtbar machen; Lernstandsdiagnose.'),
    z('82–90', 'Puffer (ca. 8 min)', 'Reserve für langsames Lesen und Schreiben und für die Sicherungsfolien. **Wird es knapp:** den Check-out (Folien ' + FN('checkout-intro') + '–' + FN('checkout-ergebnis') + ') weglassen oder die Peer-Korrektur von 5.3 im Plenum machen.', '–', '–', '–', 'Zeitreserve, kein neuer Inhalt')
  ];
  push(B.tabelle(sp, zeilen, { kopfFill: F.BLAU_D, kopfFarbe: 'FFFFFF', schrift: 16 }));
  return k;
}

function hinweise(B) {
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  const punkt = (text) => new Paragraph({ bullet: { level: 0 }, spacing: { after: 50, line: 252 }, children: B.runs(text, { size: 19 }) });
  push(
    B.abschnitt('Vorbereitung und Hinweise'),
    B.zwischen('Technik (Stunden-App wie in Woche 2)'),
    punkt('**Beamer:** https://klawittersven-arch.github.io/3BFP2-kb1-notfall/beamer-w1.html → „Neuen Raum starten“. Die SuS scannen den QR-Code am Beamer (öffnet **w1.html** mit dem Raumcode) und geben den Vornamen ein. Der QR-Code auf Blatt 1 ist nur Ersatz (Raumcode dann von Hand).'),
    punkt('**Probe:** beamer-w1.html?demo=1 zeigt alle Folien mit erfundenen Namen und Fehlern (ohne Internet). „Probestunde mit erfundener Klasse“ startet einen echten Raum mit 20 erfundenen SuS – mit dem eigenen Handy mitmachen.'),
    punkt('**Häufige Fehler:** Auf den Folien zu AA1, AA2 a, AA3 und AA4 a zeigt der Beamer rechts die häufigsten Fehler beim ersten Versuch (falsch markiert / übersehen / Fehlerkarte gewählt / falsch zugeordnet). Sie eignen sich als Impuls für die anschließende Sicherung. **↻ neu** hinter einem Namen: alle Leben verbraucht (2 Fehler sind erlaubt, beim 3. kommt eine Lesepause von 20 Sekunden) – die Übung beginnt danach am Handy von vorn. Wer schneller tippt, als man lesen kann, bekommt eine Warnung; nach 3 Warnungen gibt es 15 Sekunden Lesepause.'),
    punkt('**Stunde geteilt (Blatt 1 heute, Blatt 2 nächste Woche):** Nächste Woche einfach einen **neuen Raum** starten (der alte ist nach 6 Stunden gelöscht) und auf der Willkommensfolie **„Heute mit Arbeitsblatt 2 beginnen“** wählen. Die SuS scannen den QR-Code **am Beamer** (Blatt 1 brauchen sie dafür nicht; Ersatz-QR auch auf Blatt 2). Der Check-out zeigt dann nur die Entscheidungen „jetzt“ (die Vermutungen vom Einstieg lagen im alten Raum). Sinnvoller Schnitt: nach Merksatz AA2 (Folie ' + FN('w1-aa2-merksatz') + '); Blatt 2 beginnt mit Folie ' + FN('blatt2') + '.'),
    punkt('**Ohne Handy:** Alle Handy-Aufgaben lassen sich auch auf Papier lösen (AA1: Fallauszug auf S. 1; AA2 a, AA3: Lückentexte mit Wortspeicher; AA4 a: Tabelle). SuS ohne Handy arbeiten mit einer Partnerin oder einem Partner.'),
    B.zwischen('Bezug zur Klassenarbeit und zum Examen (nur für Lehrkräfte)'),
    punkt('**KA KB 1, Aufg. 5.4** („Erläutern Sie, wie der Körper … in dieser Phase den Blutdruck aufrechterhält. Begründen Sie, warum der fast normale Blutdruck einen Schock nicht ausschließt.“): Das Wissen bauen AA2 (Regelkreis, Befunde erklären) und AA4 (Spätzeichen Blutdruck, Schockindex) auf; **AA5, 5.2** übt eine fast gleich formulierte Aufgabe an einem anderen Fall (Frau Berger, Nachblutung nach Cholezystektomie, mit Vorwerten). Der KA-Fall (Sturz, Heckenschere) wird nicht vorweggenommen.'),
    punkt('**Ich-kann-Liste W1:** Nr. 1 → AA1, AA5 (5.1) · Nr. 2 → Informationstext 1, AA2 · Nr. 3 → Informationstext 2 (Schockformen) · Nr. 4 → AA3 · Nr. 5 → AA4, AA5 (5.2, 5.3).'),
    punkt('**Examen (BW):** Operatoren wie im Leitfaden (identifizieren/nennen, erklären/erläutern, begründen, bewerten); 5.1 nach dem Muster „Nennen Sie vier in der Fallsituation beschriebene Symptome, die auf … hinweisen“ (Mai 2023, Tag 3, Aufg. 4.2); Fließtext mit Uhrzeiten und Vorwerten.'),
    punkt('**Aus dem Entwurf von K. Lohner (KB1_W1_Schockspirale) übernommen:** Informationstexte (gekürzt und vereinfacht), Fehlerkarten der Schockspirale, Aussagen „Stimmt das?“ (als Fehlerkarten und Check-out-Fragen), Transferfall Frau Berger. Weggelassen wegen 90 min: Video, Organ-Expertise mit Elevator Pitch, Kartenspiel zum Ausschneiden.'),
    B.zwischen('Fachliche Hinweise'),
    punkt('**Schockindex** nach Ich-kann-Liste: Puls : systolischer Blutdruck, normal ca. 0,5, über 1 spricht für einen Schock. Frau Maler: 118 : 105 ≈ 1,1; Frau Berger: 118 : 112 ≈ 1,05.'),
    punkt('**Frühzeichen/Spätzeichen:** Tabelle nach Pflegias Band 2, S. 801, Tab. 1 (Früh-/Spätphase, Erwachsene). Das Quiz verwendet bewusst keinen Puls zwischen 100 und 120/min als „Spätzeichen“, damit es nicht mit der KA (Puls 124/min bei fast normalem Blutdruck = Kompensation) kollidiert.'),
    punkt('**Kompensation/Dekompensation** in der Spirale wie in der LSG von K. Lohner: Die Kompensation endet, wenn das Gewebe zu wenig Sauerstoff bekommt und Laktat entsteht (Schritt ③); der Blutdruck fällt in Schritt ④.'),
    punkt('**Frau Malers Luftnot** (Lungenembolie, obstruktiver Schock) bleibt offen – sie wird in Woche 2 geklärt. In AA1 heißt es zur dicken Wade nur: kein Schockzeichen, aber sofort weitergeben.'),
    B.zwischen('Quellen'),
    punkt('Pflegias – Generalistische Pflegeausbildung, Band 2 (Cornelsen): S. 418 (Schockformen), S. 801 (Typische Symptome bei Schock) · MSD Manual Profi-Ausgabe: Schock (2025) · Lecturio: Regulation des arteriellen Blutdrucks; Schock – Überblick (2023) · Ich-kann-Liste KB I (Lohner/Klawitter) · BW-Abschlussprüfungen 2023–2026 und Leitfaden zur Erstellung von Prüfungsaufgaben (Operatoren)')
  );
  return k;
}

/* =====================================================================
   Dokumente bauen
   ===================================================================== */
function trenne(children) {
  const out = [];
  for (const c of children) {
    if (c instanceof Table && out.length && out[out.length - 1] instanceof Table) out.push(new Paragraph({ spacing: { after: 0, line: 160 }, children: [new TextRun({ text: '', size: 8 })] }));
    out.push(c);
  }
  return out;
}
const sektionHoch = (children) => ({ properties: { page: SEITE_HOCH }, headers: { default: kopf(BREITE_HOCH) }, footers: { default: fuss(FUSS) }, children: trenne(children) });

/* Zeilenabstand für Word festschreiben: docx schreibt „line“ ohne lineRule. LibreOffice liest das als „genau“,
   Word als „mehrfach“ (Faktor × natürliche Zeilenhöhe von Calibri) – in Word wird das Blatt dann rund 12 % länger
   (7 statt 4 Seiten). Deshalb überall ausdrücklich: „genau“ (exact); Absätze mit Bildern (Symbole, QR-Code)
   „mindestens“ (atLeast), damit Word die Bilder nicht abschneidet. */
function zeilenabstandFest(xml) {
  return xml.replace(/<w:p(?=[ >])[\s\S]*?<\/w:p>/g, (absatz) => {
    // größte Schrift im Absatz (halbe Punkt; ohne Angabe 11 pt) – ist sie zu groß für „genau“, ebenfalls „mindestens“
    const groessen = [...absatz.matchAll(/<w:sz w:val="(\d+)"\/>/g)].map((m) => Number(m[1]) / 2);
    const zeile = Number((absatz.match(/\bw:line="(\d+)"/) || [])[1] || 0) / 20;
    const zuGross = groessen.some((g) => g * 1.15 > zeile);
    const regel = /<w:drawing[ >]/.test(absatz) || /Segoe UI (Emoji|Symbol)/.test(absatz) || zuGross ? 'atLeast' : 'exact';
    return absatz.replace(/<w:spacing ((?:(?!\/>)[^>])*?\bw:line="\d+"(?:(?!\/>)[^>])*?)\/>/g, (sp, attr) => (/w:lineRule=/.test(attr) ? sp : `<w:spacing ${attr} w:lineRule="${regel}"/>`));
  });
}

// Zellen: Innenabstand oben/unten 3 pt → 2 pt (Woche 1 braucht den Platz; links/rechts unverändert)
function zellraender(xml) {
  return xml.replace(/<w:(top|bottom) w:type="dxa" w:w="60"\/>/g, '<w:$1 w:type="dxa" w:w="40"/>');
}

async function speichern(doc, name) {
  const zip = Packer.compiler.compile(doc, undefined, []);
  for (const datei of Object.keys(zip.files).filter((n) => /^word\/(document|header\d*|footer\d*)\.xml$/.test(n))) {
    zip.file(datei, zellraender(zeilenabstandFest(await zip.file(datei).async('string'))));
  }
  const buf = await zip.generateAsync({ type: 'nodebuffer', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', compression: 'DEFLATE' });
  fs.mkdirSync(AUS, { recursive: true });
  fs.writeFileSync(path.join(AUS, name), buf);
  console.log('geschrieben:', path.join(AUS, name));
}

// Seitenumbruch vor Informationstext 1 (Seite 2): als eigener Absatz mit pageBreakBefore
function mitUmbruechen(liste) {
  const out = [];
  for (const c of liste) {
    if (c && c.__umbruchVor) out.push(new Paragraph({ pageBreakBefore: true, spacing: { after: 0, line: 120 }, children: [new TextRun({ text: '', size: 4 })] }));
    out.push(c);
  }
  return out;
}

function ohnePunkte(loesungen) {
  const aus = {};
  for (const [k, zeilen] of Object.entries(loesungen)) {
    aus[k] = zeilen
      .map((z) => z.replace(/\s*\([^()]*\d\s*P\.[^()]*\)/g, '').trim())
      .filter((z) => z && !/\d\s*P\./.test(z));
  }
  return aus;
}

/* Woche 1: Symbole kleiner als in Woche 2. Bilder stehen in der Zeile; Word macht diese Zeile so hoch wie das
   Bild (Zeilenabstand „mindestens“, siehe zeilenabstandFest) – kleine Symbole sparen auf jeder Seite Platz. */
function kleineSymbole(B) {
  B.aa = (symbole, kopfText, text, o = {}) => new Paragraph({
    keepNext: true, spacing: { before: 160, after: 60, line: 264 },
    children: [...symbole.flatMap((x) => [bild(x, 0.55, 0.55), B.t(' ')]), B.b(kopfText + ' '), ...B.runs(text)], ...o
  });
  B.teil = (symbole, text, o = {}) => new Paragraph({
    keepNext: true, spacing: { before: 100, after: 60, line: 264 },
    children: [...symbole.flatMap((x) => [bild(x, 0.48, 0.48), B.t(' ')]), ...B.runs(text)], ...o
  });
  return B;
}

async function main() {
  const SV = kleineSymbole(bausteine({ lsg: false, breite: BREITE_HOCH }));
  await speichern(new Document({ creator: 'KB I · 3BFP2', title: 'KB1 W1 Kreislauf und Schock – Schülerversion', styles: STILE, sections: [sektionHoch(mitUmbruechen(schuelerTeil(SV, { lsg: false })))] }), 'KB1_W1_Kreislauf_Schock_SV.docx');

  const LQ = kleineSymbole(bausteine({ lsg: true, breite: BREITE_QUER }));
  const LH = kleineSymbole(bausteine({ lsg: true, breite: BREITE_HOCH }));
  await speichern(new Document({
    creator: 'KB I · 3BFP2', title: 'KB1 W1 Kreislauf und Schock – Lehrerversion mit Lösungen', styles: STILE,
    numbering: { config: [] },
    sections: [
      { properties: { page: SEITE_QUER }, headers: { default: kopf(BREITE_QUER) }, footers: { default: fuss(FUSS + ' · Lehrerversion') }, children: trenne([...verlaufsplan(LQ), ...hinweise(LQ)]) },
      sektionHoch(mitUmbruechen(schuelerTeil(LH, { lsg: true })))
    ]
  }), 'KB1_W1_Kreislauf_Schock_LV_LSG.docx');

  const daten = { transferfall: T.TRANSFERFALL, aufgaben: N.aufgaben, loesungen: ohnePunkte(N.loesungen) };
  const ziel = path.join(WURZEL, 'docs', 'w1', 'inhalte_nachlesen.js');
  fs.writeFileSync(ziel, '/* Automatisch erzeugt von werkzeuge/ab_w1.js – bitte nicht von Hand ändern.\n' +
    '   Aufgaben und Musterlösungen aus dem Arbeitsblatt von Woche 1 für die Beamer-Folien (beamer-w1.html). */\n' +
    'var NACHLESEN = ' + JSON.stringify(daten, null, 1) + ';\n');
  console.log('geschrieben:', ziel);
}

main().catch((e) => { console.error(e); process.exit(1); });

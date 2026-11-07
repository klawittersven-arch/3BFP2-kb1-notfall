/* Erstellt die Unterlagen für KB I, Themenblock 2, Woche 2 (SW 7):
     arbeitsblatt/KB1_W2_Schockformen_SV.docx        Schülerversion (AB mit AA1–AA6 und Hausaufgabe, 6 Seiten)
     arbeitsblatt/KB1_W2_Schockformen_Anlagen.docx   Expertenblätter A/B/C (nur Reserve, falls Handys oder WLAN ausfallen)
     arbeitsblatt/KB1_W2_Schockformen_LV_LSG.docx    Lehrerversion: Verlaufsplan, Hinweise, Lösungen
   Aufruf (im Hauptverzeichnis): node werkzeuge/ab_w2.js
   Voraussetzung: QR-Codes in qr/ (python werkzeuge/qr_erzeugen.py) und Piktogramme (python werkzeuge/piktogramme.py). */
'use strict';
const fs = require('fs');
const path = require('path');
const D = require('docx');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType, VerticalAlign, TableLayoutType, HeightRule, PageOrientation } = D;
const { bausteine, kopf, fuss, bild, F, SEITE_HOCH, SEITE_QUER, STILE, WURZEL, rahmen, keinRand, ohneRaender, linie, ohnePunkte: ohnePunkteZeilen } = require('./ab_bausteine');
const T = require('./ab_w2_texte');
// Foliennummern für den Verlaufsplan direkt aus dem Foliensatz der App (docs/inhalte_stunde.js)
const STUNDE = (() => { const k = {}; require('vm').runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'docs', 'inhalte_stunde.js'), 'utf8') + ';this.S = STUNDE;', k); return k.S; })();
const FN = (id) => { const i = STUNDE.folien.findIndex((f) => f.id === id); if (i < 0) throw new Error('Folie fehlt: ' + id); return i + 1; };
const FOLIE = (id) => `**Folie ${FN(id)}:**`;
// Die drei Blätter werden nacheinander ausgeteilt: Überschrift wie auf der Folie „Weiter mit Arbeitsblatt …“
const BLATT = (nr) => { const f = STUNDE.folien.find((x) => x.typ === 'blatt' && x.nr === nr); if (!f) throw new Error('Blatt-Folie fehlt: ' + nr); return f; };
function blattKopf(B, nr, o = {}) {
  const f = BLATT(nr);
  return new Paragraph({
    keepNext: true, spacing: { before: 0, after: 100 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: '2E75B6' },
    children: [B.emoji(' 📄 ', { size: 24 }), B.b(`Schockformen: ${f.ueberschrift}`, { size: 25, color: 'FFFFFF' })],
    ...o
  });
}

const AUS = process.argv[2] || path.join(WURZEL, 'arbeitsblatt');
// Dateiname des QR-Codes: w2.html → qr_w2_stunde.png, w2-transfer.html → qr_w2_transfer.png
const QR = (seite) => {
  const zusatz = (seite.match(/\?[a-z]+=([a-z0-9]+)/) || [])[1];
  const name = seite.replace(/\.html.*$/, '');
  return path.join(WURZEL, 'qr', 'qr_w2_' + (name === 'w2' ? 'stunde' : name.replace(/^w2-/, '')) + (zusatz ? '_' + zusatz : '') + '.png');
};
const FUSS = 'KB I · Woche 2 · Schock ist nicht gleich Schock';
const BREITE_HOCH = 11906 - 2 * 1134;   // 9638 (Rand links/rechts 2 cm)
const BREITE_QUER = 16838 - 2 * 1134;   // 14570

/* Sammelt beim Erzeugen die Lösungstexte für die Nachlese-Seite der App (docs/inhalte_nachlesen.js).
   So stehen Arbeitsblatt-Lösungen und Nachlese-Seite nur an einer Stelle. */
const N = { aufgaben: {}, loesungen: {} };
let sammelnAn = true;
let aktuellerTeil = '';
const sammle = (schl, wert) => { N[schl] = wert; return wert; };
function sammleText(B, schl, text, o) {
  const liste = N[schl] = N[schl] || [];
  if (!liste.includes(text)) liste.push(text);
  return B.p(text, o);
}

const IC = { lesen: 'icon_lesen.png', markieren: 'icon_markieren.png', schreiben: 'icon_schreiben.png', handy: 'icon_handy.png', stift: 'icon_stift.png', beurteilen: 'icon_beurteilen.png', checkout: 'icon_checkout.png', schere: 'icon_schere.png' };

/* =====================================================================
   SCHÜLERVERSION (mit lsg = true: Lösungsteil der Lehrerversion)
   ===================================================================== */
function schuelerTeil(B, { lsg }) {
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  const handy = (seite, absaetze) => B.handy(seite, absaetze, { linkBasis: T.LINK_BASIS, qrDatei: QR(seite) });
  const merk = (titel, key) => B.merksatz(titel, [T.MERKSAETZE[key]]);
  sammelnAn = true;
  const L = (zeilen) => { if (sammelnAn && aktuellerTeil) N.loesungen[aktuellerTeil] = zeilen; return lsg ? zeilen : []; };
  const zw = (text) => { aktuellerTeil = text; return B.zwischen(text); };
  const teil = (sym, text) => { aktuellerTeil = text; return B.teil(sym, text); };
  const aufg = (liste) => { if (liste.length === 1) aktuellerTeil = liste[0].nr; if (sammelnAn) liste.forEach((a) => { N.aufgaben[a.nr] = a; }); return B.aufgaben(liste); };
  const pS = (schl, text, o) => sammleText(B, schl, text, o);
  // Aufgabe aus ab_w2_texte.js (ohne Erwartungshorizont – der steht unter den Schreiblinien)
  const A = (nr) => { const { loesung, ...aufgabe } = T.AUFGABEN[nr]; return aufgabe; };

  /* ---------- Seite 1: Lernziel, Frau Maler, Leitfrage, Kausalkette (am Ende der Stunde), Einstieg ---------- */
  const kette = T.KETTE;
  const luecke = '_'.repeat(12);
  push(
    blattKopf(B, 1),
    B.titel('Schock ist nicht gleich Schock – vergleichen und nach Leitsymptom handeln', lsg ? '[LSG]' : null),
    new Paragraph({ spacing: { after: 120, line: 264 }, children: [B.emoji('🎯 '), B.b('Lernziel: '), ...B.runs(T.LERNZIEL)] }),
    new Paragraph({ spacing: { after: 140 }, children: [bild(IC.handy, 0.5, 0.5), B.t(' = am Smartphone (Stunden-App)      ', { size: 19 }), bild(IC.stift, 0.5, 0.5), B.t(' = auf Papier', { size: 19 })] }),
    B.kasten([
      B.p(T.FALLBEZUG.absaetze[0]),
      B.p(T.FALLBEZUG.absaetze[1], { spacing: { after: 0, line: 264 } })
    ], { kopf: T.FALLBEZUG.kopf, fill: 'FFFFFF', kopfFill: 'FFFFFF', rand: '000000' }),
    B.leer(100),
    B.leitfrage(T.LEITFRAGE),
    B.aa([IC.lesen, IC.schreiben], 'AA6 · Am Ende der Stunde:', 'Ihre Lehrkraft deckt die **Kausalkette** am Beamer Schritt für Schritt auf. Ergänzen Sie die Lücken und beantworten Sie dann die Leitfrage.'),
    B.meta(`5 min · Plenum (Unterrichtsgespräch) · AFB II–III · Folie ${FN('aufloesung')} · die SuS tragen die Kette hier auf S. 1 ein`),
    (aktuellerTeil = 'Kausalkette', L([kette]), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 100 }, children: [B.b(lsg ? kette : `Immobilität → ${luecke} → ${luecke} → ${luecke} → Kreislaufstillstand`, { size: 21 })] })),
    (aktuellerTeil = 'Leitfrage', new Paragraph({ spacing: { before: 40, after: 0 }, keepNext: true, children: [B.b('Antwort auf die Leitfrage:')] })),
    B.linien(2, L([T.LEITFRAGE_ANTWORT])),
    B.leer(140),
    handy(T.SEITEN.stunde, [
      B.p('**So läuft die Stunde:** Scannen Sie den QR-Code **am Beamer** und geben Sie Ihren Vornamen ein. Ihr Handy wechselt dann **automatisch mit dem Beamer**.'),
      B.p('Nur falls das nicht klappt: diesen QR-Code scannen und den **Raumcode vom Beamer** eingeben.')
    ]),
    B.aa([IC.handy], 'Einstieg: Wie hätten Sie gehandelt?', ''),
    B.meta('10 min · Einzelarbeit → Murmeln (PA) → Plenum · AFB I · Vorwissen aktivieren, Vermutungen bilden, Fehlvorstellungen sichtbar machen; im Check-out werden die Vermutungen überprüft (vorher/nachher)'),
    B.app([
      B.p('**Vier kurze Notfälle** – der letzte ist Frau Maler um 11 Uhr. Tippen Sie am Handy Ihre Vermutung an. **Falsch liegen ist erlaubt!** Aufgelöst wird erst am Ende der Stunde.'),
      B.p('**Murmeln (1 Minute):** Überzeugen Sie Ihre Nachbarin oder Ihren Nachbarn: Warum würden Sie so handeln?', { spacing: { after: 0, line: 264 } })
    ])
  );
  if (lsg) {
    push(B.tabelle([{ text: 'Nr.', w: 700 }, { text: 'Richtig', w: 1500 }, { text: 'Begründung', w: BREITE_HOCH - 2200 }],
      T.ENTSCHEIDUNG.map((e) => [e.nr, { lsg: e.optionen.find((o) => o.startsWith(e.richtig)) }, { lsg: e.erklaerung }]), { schrift: 19 }));
    push(B.meta('Ablauf: Notfall für Notfall – „Weiter“ zeigt den Notfall, die SuS stimmen am Handy ab, „Ergebnisse anzeigen“ zeigt die Verteilung ohne Auflösung (je ca. 45 s) → Übersicht mit der Frage der größten Uneinigkeit (★) → „Murmeln“ (1 min) → 2–3 Begründungen hören, nicht auflösen. Impuls: „Bei E… sind Sie geteilter Meinung – genau das klären wir heute. Am Ende prüfen Sie Ihre Vermutungen.“ E4 ist die Leitfrage; sie wird in AA6 geklärt. Der Check-out am Ende läuft nur am Beamer und am Handy (nicht auf dem AB).'));
  }

  /* ---------- Seite 2: Teil A – Expertenteam ---------- */
  push(
    B.abschnitt('Teil A · Drei Wege in den Schock (Gruppenpuzzle)', { pageBreakBefore: true }),
    B.p('Ihr Handy zeigt, **wer mit wem** arbeitet. **A** = hypovolämischer, **B** = anaphylaktischer, **C** = neurogener Schock.'),
    puzzleGrafik(B),
    new Paragraph({ spacing: { before: 120, after: 100 }, children: [B.b('Ich bin Expertin/Experte für:  '), B.t('☐ A   ☐ B   ☐ C    '), B.b('Expertenteam: '), B.t('_'.repeat(5) + '   '), B.b('Stammgruppe: '), B.t('_'.repeat(8))] }),
    B.aa([IC.lesen, IC.markieren], 'AA1: Identifizieren – Expertenteam:', '🚶 Setzen Sie sich mit Ihrem **Expertenteam** zusammen. Ihr Handy führt Sie durch die Schritte: **a)** Infotext lesen. **b)** Fall markieren – der Infotext hilft. **c)** Experten-Check. **d)** Gemeinsam **Ihre Spalte** der Vergleichstabelle ausfüllen und „Unsere Spalte ist fertig“ tippen.'),
    B.meta(`15 min (+ 1 min Merksatz AA1 lesen) · Einzelarbeit → Gruppenarbeit (Expertenteam, 3–4) · AFB I–II · KA-Bezug KB 1, Aufg. 3.1 (Befunde im Fall erkennen und zuordnen; schriftlich in der Hausaufgabe 1.1) · Folie ${FN('aa1')} zeigt am Beamer, welche Teams fertig sind`),
  );
  const sw = Math.round((BREITE_HOCH - 1700) / 3);
  const zeilenAA2 = sammle('vergleich', T.VERGLEICH);
  push(
    B.leer(60),
    merk('Merksatz AA1', 'aa1'),
    new Paragraph({ spacing: { before: 160, after: 60 }, keepNext: true, children: B.runs('**Vergleichstabelle** – AA1 d): Ihre Spalte im Expertenteam · AA2 a): die anderen Spalten in der Stammgruppe') }),
    B.tabelle(
      [{ text: '', w: 1700 }, { text: 'A hypovolämisch', w: sw }, { text: 'B anaphylaktisch', w: sw }, { text: 'C neurogen', w: BREITE_HOCH - 1700 - 2 * sw }],
      [
        ...zeilenAA2.map((z) => [{ text: `**${z[0]}**`, fill: F.LACHS }, { lsg: z[1] }, { lsg: z[2] }, { lsg: z[3] }]),
        [{ text: '**Gemeinsamkeit**', fill: F.LACHS }, { colSpan: 3, lsg: sammle('gemeinsamkeit', T.GEMEINSAMKEIT) }]
      ],
      { hoehe: 640, schrift: 19 }
    )
  );

  /* ---------- Seite 3: AA2 Stammgruppe, Detektiv, 2.1/2.2; AA3 Lagerungsbilder ---------- */
  push(
    B.aa([IC.schreiben], 'AA2: Vergleichen – Stammgruppe:', '**a)** 🚶 **Umsetzen** in die **Stammgruppe**. Erklären Sie reihum **A → B → C** (je 3 Minuten). Die anderen füllen ihre Spalten der Tabelle aus. Zum Schluss: die Gemeinsamkeit.'),
    B.meta(`31 min (a mit Sicherung 17 min, b und c mit Musterlösung 14 min) · Gruppenarbeit (Stammgruppe 3–4) → Plenum → Einzelarbeit · AFB II · KA-Bezug KB 1, Aufg. 3.2 und 5.5 · Folien ${FN('aa2a')}–${FN('aa2c-loesung-22')}`),
    teil([IC.handy], '**b) Schockform-Detektiv:**'),
    B.app([B.p('Bestimmen Sie bei **vier kurzen Fällen** die **Schockform** und tippen Sie die **zwei Befunde** an, die sie belegen – dann „Prüfen“.', { spacing: { after: 0, line: 264 } })]),
    blattKopf(B, 2, { pageBreakBefore: true }),
    teil([IC.schreiben], '**AA2 c) Schreibaufgaben** (allein – die Fälle stehen am Handy):'),
    aufg([A('2.1'), A('2.2')]),
    zw('2.1'),
    B.linien(3, L(T.AUFGABEN['2.1'].loesung)),
    zw('2.2'),
    B.linien(3, L(T.AUFGABEN['2.2'].loesung))
  );

  /* ---------- AA3 ---------- */
  push(
    B.aa([IC.lesen], 'AA3: Begründen – Lagerung (Positionierung) nach Leitsymptom:', 'Schock → immer Beine hoch? Nein! Entscheidend ist das **Leitsymptom** – das Zeichen, das die Person gerade am meisten gefährdet.'),
    B.meta(`18 min (Impuls, vier Lagerungsfolien, Quiz, Merksatz, 3.1/3.2 mit Musterlösung) · Plenum → Einzelarbeit (Handy) → Einzelarbeit → Plenum · AFB II · KA-Bezug KB 1, Aufg. 3.3 · Folien ${FN('aa3-impuls')}–${FN('aa3b-loesung-32')}`)
  );
  const pw = Math.floor(BREITE_HOCH / 4);
  const pikto = sammle('pikto', T.PIKTO);
  push(new Table({
    width: { size: pw * 4, type: WidthType.DXA }, columnWidths: [pw, pw, pw, pw], layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({ tableHeader: false, cantSplit: true, children: pikto.map((x) => B.zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [bild(x[0], 3.4, 1.91)] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [B.b(x[1], { size: 20 })] }), new Paragraph({ spacing: { after: 30 }, children: B.runs(x[2], { size: 18 }) }), new Paragraph({ spacing: { after: 0 }, children: B.runs(x[3], { size: 18 }) })], pw, { borders: rahmen(F.ORANGE_D, 6), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS } })) })
    ]
  }));
  push(
    new Paragraph({ spacing: { before: 60, after: 60 }, children: [B.emoji('⚠️ '), ...B.runs(T.ANAPHYLAXIE_LAGERUNG, { size: 19 })] }),
    lsg ? new Paragraph({ spacing: { after: 80 }, children: [B.i('Quelle: nach S2k-Leitlinie Akuttherapie und Management der Anaphylaxie (AWMF 061-025, 2021); sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] }) : null,
    teil([IC.handy], '**a) Lagerungs-Quiz** (allein am Handy):'),
    B.app([B.p('Was ist das **Leitsymptom**? Tippen Sie an, wie Sie lagern, und decken Sie auf. Hilfe: die **Bilder oben** und der **Merksatz AA3**.', { spacing: { after: 0, line: 264 } })]),
    B.leer(60),
    merk('Merksatz AA3', 'aa3'),
    teil([IC.schreiben], '**b) Schreibaufgaben:**'),
    aufg([A('3.1'), A('3.2')]),
    zw('3.1'),
    B.linien(3, L(T.AUFGABEN['3.1'].loesung)),
    zw('3.2'),
    B.linien(3, L(T.AUFGABEN['3.2'].loesung))
  );

  /* ---------- Teil B · AA4 ---------- */
  push(
    B.abschnitt('Teil B · Anaphylaxie – wer darf was?'),
    B.aa([IC.beurteilen, IC.handy], 'AA4: Unterscheiden – Wer darf was?', '**a) Abstimmung am Handy:** Ihre Lehrkraft zeigt Maßnahmen am Beamer. Tippen Sie an, wer sie durchführen darf. Die Tabelle hilft Ihnen.'),
    B.meta(`13 min (a mit Merksatz AA4 als Lesefolie, Blatt 3 austeilen, b mit Musterlösung) · Einzelarbeit (Abstimmung am Handy) → Plenum → Partnerarbeit → Plenum · AFB II–III · KA-Bezug KB 1, Aufg. 3.3 · Kompetenz III.2.b · Folien ${FN('aa4a')}–${FN('aa4b-loesung')}`)
  );
  // Wer darf was? – fertig ausgefüllt (enthält auch die Punkte des früheren Kastens „Info: Verantwortung im Notfall“)
  const WER_DARF_WAS = sammle('werDarfWas', T.WER_DARF_WAS);
  const AZUBI = sammle('werDarfWasAzubi', T.AZUBI);
  const vw = Math.floor(BREITE_HOCH / 3);
  const liste = (punkte) => ({ absaetze: punkte.map((t, i) => new Paragraph({ spacing: { after: i === punkte.length - 1 ? 0 : 30, line: 240 }, children: [B.t('• ', { size: 19 }), ...B.runs(t, { size: 19 })] })) });
  push(B.tabelle([{ text: T.WER_DARF_WAS_KOPF[0], w: vw }, { text: T.WER_DARF_WAS_KOPF[1], w: vw }, { text: T.WER_DARF_WAS_KOPF[2], w: BREITE_HOCH - 2 * vw }], [
    WER_DARF_WAS.map(liste),
    [{ colSpan: 3, text: AZUBI }]
  ], { schrift: 19, kopfFill: F.LACHS_KOPF }));
  push(
    B.leer(100),
    merk('Merksatz AA4 – Sofortmaßnahmen bei Anaphylaxie', 'aa4'),
    blattKopf(B, 3, { pageBreakBefore: true }),
    teil([IC.beurteilen], '**AA4 b) Wer hat recht?** **Think** (2,5 Min.): allein schreiben. **Pair** (1,5 Min.): zu zweit vergleichen.'),
    pS('adrenalinText', T.ADRENALIN_TEXT[0], { spacing: { after: 40, line: 264 } }),
    pS('adrenalinText', T.ADRENALIN_TEXT[1], { spacing: { after: 100, line: 264 } })
  );
  const dw = Math.floor(BREITE_HOCH / 2) - 100;
  const blase = (wer, text) => B.zelle([new Paragraph({ spacing: { after: 40 }, children: [B.b(wer, { size: 19 })] }), new Paragraph({ spacing: { after: 0 }, children: [B.i(text)] })], dw, { borders: rahmen(F.ORANGE_D, 6), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS_HELL } });
  push(
    new Table({ width: { size: dw * 2 + 200, type: WidthType.DXA }, columnWidths: [dw, 200, dw], layout: TableLayoutType.FIXED, rows: [new TableRow({ cantSplit: true, children: [
      blase(T.DIALOG[0].wer, T.DIALOG[0].text),
      new TableCell({ width: { size: 200, type: WidthType.DXA }, borders: { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand }, children: [new Paragraph({ children: [] })] }),
      blase(T.DIALOG[1].wer, T.DIALOG[1].text)
    ] })] }),
    aufg([A('4.1')]),
    B.linien(3, L(T.AUFGABEN['4.1'].loesung))
  );

  /* ---------- AA5 Transferfall ---------- */
  push(
    B.aa([IC.schreiben], 'AA5: Transferfall – Wissen anwenden:', '**Allein** (8 Min.) – Hilfe: nur **Merksatz AA3 und AA4**. Dann Peer-Korrektur mit dem **Raster am Handy**.', { spacing: { before: 100, after: 60, line: 264 } }),
    B.meta('13 min (8 min schreiben, 4 min Peer-Korrektur) · Einzelarbeit → Peer-Korrektur mit App-Raster und Musterlösung am Beamer · AFB I–III · KA-Format (KB 1, Aufg. 3.3) · Examensvorbild: Mai 2024 Tag 3, Aufg. 8.2; Mai 2026 Tag 1, Aufg. 3.2'),
    B.kasten([
      pS('transferfall', T.TRANSFERFALL[0]),
      pS('transferfall', T.TRANSFERFALL[1], { spacing: { after: 0, line: 264 } })
    ], { kopf: 'Fallsituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    new Paragraph({ spacing: { before: 80, after: 60 }, children: [B.i(T.TRANSFER_RAHMEN)] }),
    aufg([A('5.1'), A('5.2')]),
    (aktuellerTeil = '5.1 und 5.2', null),   // ohne Zwischenüberschrift: die Linien stehen direkt unter den Aufgaben
    B.linien(7, L(T.LOESUNG_5))
  );

  /* ---------- Seite 6: Hausaufgabe ---------- */
  sammelnAn = false;   // Lösungen der Hausaufgabe gehören nicht auf die Nachlese-Seite (eigene Selbstkontrolle)
  push(
    B.abschnitt(T.HAUSAUFGABE.titel, { pageBreakBefore: true }),
    B.p(T.HAUSAUFGABE.hinweis, { spacing: { after: 60, line: 252 } }),
    B.meta('ca. 17 min (1,3 min je Punkt wie im Examen) · Einzelarbeit zu Hause · AFB I–III · Examensformat: Ausgangssituation, Rahmensatz je Aufgabe, Situationswechsel im Aufgabenstamm (vgl. Mai 2024 Tag 1, 1.2; Mai 2024 Tag 3, 8.1–8.2; Mai 2026 Tag 1, 1.3)'),
    B.kasten([
      B.p(T.HAUSAUFGABE.situation[0]),
      B.p(T.HAUSAUFGABE.situation[1], { spacing: { after: 0, line: 264 } })
    ], { kopf: 'Ausgangssituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    new Paragraph({ spacing: { before: 120, after: 60 }, keepNext: true, children: [B.i(T.HAUSAUFGABE.rahmen1)] }),
    aufg([T.HAUSAUFGABE.aufgabe1]),
    B.linien(3, L(T.HAUSAUFGABE.loesung1)),
    new Paragraph({ spacing: { before: 120, after: 60 }, keepNext: true, children: [B.i(T.HAUSAUFGABE.rahmen2)] }),
    aufg(T.HAUSAUFGABE.aufgaben2),
    B.linien(6, L(T.HAUSAUFGABE.loesung2)),
    // Zwei QR-Kästen nebeneinander: Selbstkontrolle (mit Punktezeile) und Nachlesen
    B.leer(20),
    qrZeile(B, [
      { seite: T.SEITEN.transfer, absaetze: [B.p('✅ **Selbstkontrolle:** Erst schreiben, dann scannen – die App zeigt die Lösung und zählt die Punkte.'), B.p('**Meine Punkte: ____ / 13**', { spacing: { after: 0 } })] },
      { seite: T.SEITEN.nachlesen, absaetze: [B.p('📖 **Nachlesen:** alles aus der Stunde. **Erst nach der Stunde** scannen – vorher gesperrt.', { spacing: { after: 0, line: 252 } })] }
    ])
  );
  return k;
}

// Zwei QR-Kästen nebeneinander in EINER Tabelle (Text | QR | Abstand | Text | QR) – ohne verschachtelte Tabellen,
// die LibreOffice am Seitenende unzuverlässig umbricht
function qrZeile(B, eintraege) {
  const abstand = 200, qrW = 1420;
  const textW = Math.floor((BREITE_HOCH - abstand) / 2) - qrW;
  const blau = linie('2E75B6', 6);
  const fill = { type: ShadingType.CLEAR, color: 'auto', fill: F.BLAU_HELL };
  const zellen = [];
  eintraege.forEach((e, i) => {
    if (i) zellen.push(new TableCell({ width: { size: abstand, type: WidthType.DXA }, borders: { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand }, children: [new Paragraph({ children: [] })] }));
    zellen.push(B.zelle([...e.absaetze, new Paragraph({ spacing: { before: 40, after: 0 }, children: [B.t('Kein QR-Scanner? Link: ', { size: 16, color: F.GRAU_T }), B.t(T.LINK_BASIS + e.seite, { size: 16, color: F.GRAU_T })] })], textW,
      { borders: { top: blau, bottom: blau, left: blau, right: keinRand }, shading: fill, verticalAlign: VerticalAlign.CENTER }));
    zellen.push(B.zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [bild(QR(e.seite), 2.1, 2.1)] })], qrW,
      { borders: { top: blau, bottom: blau, right: blau, left: keinRand }, shading: fill, verticalAlign: VerticalAlign.CENTER }));
  });
  const breiten = eintraege.flatMap((e, i) => (i ? [abstand, textW, qrW] : [textW, qrW]));
  return new Table({ width: { size: breiten.reduce((x, y) => x + y, 0), type: WidthType.DXA }, columnWidths: breiten, layout: TableLayoutType.FIXED, rows: [new TableRow({ cantSplit: true, children: zellen })] });
}

// Ablauf des Gruppenpuzzles: ① Expertenteam → umsetzen → ② Stammgruppe
function puzzleGrafik(B) {
  const w = [3900, BREITE_HOCH - 7800, 3900];
  const kasten = (titel, zeilen, fill) => B.zelle([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [B.b(titel, { size: 22 })] }),
    ...zeilen.map((z) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: B.runs(z, { size: 18 }) }))
  ], w[0], { borders: rahmen('2E75B6', 8), shading: { type: ShadingType.CLEAR, color: 'auto', fill }, verticalAlign: VerticalAlign.CENTER });
  const mitte = B.zelle([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.emoji('🚶')] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.b('umsetzen!', { size: 20, color: F.ORANGE_D })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.b('→', { size: 36, color: F.ORANGE_D })] })
  ], w[1], { borders: { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand }, verticalAlign: VerticalAlign.CENTER });
  return new Table({
    width: { size: BREITE_HOCH, type: WidthType.DXA }, columnWidths: w, layout: TableLayoutType.FIXED,
    rows: [new TableRow({ cantSplit: true, children: [
      kasten('① Expertenteam (15 min)', ['👥 gleicher Buchstabe: **A + A + A**', 'Infotext · Fall markieren · **Ihre Spalte** der Tabelle', '✓ „Unsere Spalte ist fertig“'], F.BLAU_HELL),
      mitte,
      kasten('② Stammgruppe (11 min)', ['🧩 **A + B + C** an einem Tisch', 'reihum erklären · **Tabelle vollständig**', '✓ „Unsere Tabelle ist vollständig“'], F.LACHS_HELL)
    ] })]
  });
}

/* =====================================================================
   ANLAGEN: Expertenblätter A/B/C
   ===================================================================== */
function expertenblatt(B, key) {
  const e = T.EXPERTEN[key];
  return [
    B.titel(`Expertenblatt ${e.buchstabe} · ${e.form}`),
    B.p('**Reserve ohne Handy:** Normalerweise arbeiten Sie in der Stunden-App am Handy. Dieses Blatt brauchen Sie nur, wenn die App nicht funktioniert: Lesen Sie den Infotext und markieren Sie dann im Fall.'),
    B.kasten(e.fall.map((x, i) => B.p(x, i === e.fall.length - 1 ? { spacing: { after: 0, line: 264 } } : {})), { kopf: 'Fallsituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    B.leer(120),
    B.kasten([...e.info.map((x) => B.p(x)), new Paragraph({ spacing: { after: 0 }, children: [B.i('Quelle: nach MSD Manual Profi-Ausgabe: Schock; S2k-Leitlinie Anaphylaxie (AWMF 061-025, 2021); sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] })], { kopf: `Informationstext ${e.buchstabe}: ${e.form}` }),
    new Paragraph({ spacing: { before: 40, after: 100 }, children: [B.b('Wörterhilfe: ', { size: 17 }), B.t(e.woerter, { size: 17 })] })
  ];
}

/* =====================================================================
   LEHRERVERSION: Verlaufsplan (quer) + Hinweise
   ===================================================================== */
function verlaufsplan(B) {
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  push(
    B.titel('Schock ist nicht gleich Schock – vergleichen und nach Leitsymptom handeln'),
    new Paragraph({ spacing: { after: 80 }, children: [B.emoji('🎯 '), B.b('Lernziel: '), ...B.runs('Die Lernenden vergleichen die drei Schockformen und begründen Sofortmaßnahmen und Lagerung anhand des Leitsymptoms. Sie grenzen eigenverantwortliche von ärztlich angeordneten Maßnahmen ab und korrigieren typische Fehlvorstellungen (Schocklage bei Atemnot, Antihistaminikum statt Adrenalin).')] }),
    B.p('**Rahmen:** KB I · Woche 2 (SW 7) · 3 UE (135 min) · Leitfall „Frau Maler“ (11 Uhr, Kausalkette) · Vorwissen: Woche 1 (Kompensation, Schockspirale, Schockindex), Erste-Hilfe-Kurs und Positionierung (1. AJ), Thromboseprophylaxe (1. AJ) · KA-Bezug: KB 1, Aufg. 3.1–3.3 und 5.5 · AB: 3 Blätter (6 Seiten), gerafft für langsam lesende Klassen'),
    B.p('**Kompetenzbezug:** Anlage 1 PflAPrV I.1.d, I.4.a, I.4.c, III.2.b · Landeslehrplan CE 06 „In Akutsituationen sicher handeln“ (1./2. AD: „Sofortmaßnahmen bei Schockzuständen“, „Verabreichung von Notfallmedikamenten nach ärztlicher Anordnung“, „Sofortmaßnahmen bei Verdacht auf … Lungenembolie“)')
  );
  const sp = [
    { text: 'Zeit', w: 900 }, { text: 'Phase', w: 1700 }, { text: 'Lehrerhandeln', w: 3300 }, { text: 'Schülerhandeln', w: 3200 },
    { text: 'Sozialform', w: 1250 }, { text: 'Material', w: 1500 }, { text: 'Didaktische Funktion', w: 0 }
  ];
  sp[6].w = BREITE_QUER - sp.slice(0, 6).reduce((s, x) => s + x.w, 0);
  const z = (zeit, phase, l, s, soz, mat, fkt) => [zeit, `**${phase}**`, l, s, soz, mat, fkt];
  const ueber = (text) => [{ colSpan: 7, text, fill: F.GRAU_HELL, o: { italics: true } }];
  const zeilen = [
    z('vor der Stunde', 'Vorbereitung', 'AB als **drei einzelne Blätter** (je beidseitig) kopieren und getrennt bereitlegen; **beamer.html** öffnen → „Neuen Raum starten“.', '–', '–', 'Beamer, Blatt 1–3', 'Ablauf ohne Umbaupausen; die Blätter kommen nacheinander – die SuS sehen immer nur, woran gerade gearbeitet wird'),
    z('0–10', `Problemorientierter Einstieg: „Wie hätten Sie gehandelt?“ (Folien ${FN('start')}–${FN('ziel')})`, `${FOLIE('start')} QR-Code am Beamer, die Namen der Angemeldeten erscheinen. ${FOLIE('blatt1')} **Blatt 1 austeilen.** ${FOLIE('fall')} Fallauszug und Leitfrage; Vermutung aus W1 kurz abrufen. ${FOLIE('einstieg')} Auftrag zeigen („Falsch liegen ist erlaubt.“), dann Notfall für Notfall (4 Notfälle): „Weiter“ zeigt den Notfall, die SuS stimmen am Handy ab (sicher / vermute nur), „Ergebnisse anzeigen“ zeigt die Verteilung – ohne Auflösung (je ca. 45 s). ${FOLIE('einstieg-ergebnis')} Übersicht (★ = größte Uneinigkeit, Karte anklicken = groß). ${FOLIE('murmeln')} Murmeln – die Uhr (1 min) startet automatisch; 2–3 Begründungen hören, nicht auflösen. ${FOLIE('ziel')} Lernziel und Fahrplan.`, 'Mit Vornamen anmelden; Notfall für Notfall am Handy vermuten (sicher / vermute nur), auch zur Leitfrage (E4); Ergebnis der Klasse ansehen; die Nachbarin oder den Nachbarn von der eigenen Wahl überzeugen.', 'EA → PA (Murmeln) → Plenum', 'Beamer, Handy, Blatt 1', 'Vorwissen aktivieren, Vermutungen bilden, Fehlvorstellungen sichtbar machen; kognitiver Konflikt; die Vermutungen werden im Check-out überprüft (vorher/nachher). AFB I'),
    ueber('„Bei E… sind Sie geteilter Meinung – genau das klären wir heute. In Woche 1 haben Sie gesehen, wie der Körper einen Schock ausgleicht. Heute geht es um die Frage: Ist jeder Schock gleich – und muss ich deshalb immer gleich handeln? Am Ende der Stunde prüfen Sie Ihre Vermutungen.“'),
    z('10–27', `Erarbeitung I: Expertenteams (AA1, Folien ${FN('puzzle')}–${FN('aa1-merksatz')})`, `${FOLIE('puzzle')} Ablauf zeigen; Personen ohne Handy mit „+ Person ohne Handy“ eintragen; **„Gruppen zufällig einteilen“** (Name anklicken = in die nächste Gruppe). ${FOLIE('aa1')} Uhr starten (15 min); die Teams finden sich über die Namen am Handy und setzen sich selbstständig zusammen; Status je Team am Beamer („Tabelle fertig!“). Sind alle Teams fertig, wechseln Beamer und Handys **automatisch** zu Folie ${FN('aa1-merksatz')}: Merksatz AA1 gemeinsam lesen (Lesefolie, ca. 1 min; Merksatz anklicken = groß).`, 'Infotext lesen (kurze Sätze, ohne Überschriften – selbst zuordnen); mit dem Infotext den Fall am Handy markieren (3 Ablenker, Schutz gegen Raten); Experten-Check; im Team die eigene Spalte der Vergleichstabelle ausfüllen; „Unsere Spalte ist fertig“; Merksatz AA1 mitlesen.', 'EA → GA (Expertenteam 3–4) → Plenum', 'Handy, AB S. 2', 'Befunde im Fließtext identifizieren und Relevantes von Irrelevantem unterscheiden (KA 3.1); Informationen selbst den Tabellenzeilen zuordnen; der Experten-Check sichert, dass jede Person erklären kann. AFB I–II'),
    z('27–44', `Erarbeitung II: Stammgruppe (AA2 a, Folien ${FN('aa2a')}–${FN('aa2a-sichern-c')})`, `${FOLIE('aa2a')} „Umsetzen!“ – die Handys zeigen Stammgruppe und Namen; **Erklär-Uhr** starten (A → B → C je 3 min, Ton beim Wechsel, dazu 2 min Gemeinsamkeit); Status je Gruppe. **Folien ${FN('aa2a-sichern-a')}–${FN('aa2a-sichern-c')}:** Tabelle sichern, **Spalte für Spalte** (A, B, C – bei C dazu die Gemeinsamkeit), groß am Beamer: SuS aufrufen, bei richtiger Antwort die Zelle anklicken und aufdecken; noch einmal anklicken = groß.`, 'Reihum erklären, die Spalten der anderen ausfüllen, „Unsere Tabelle ist vollständig“; Tabelle mit der Musterlösung vergleichen und verbessern.', 'GA (Stammgruppe 3–4) → Plenum', 'AB S. 2, Handy', 'Vergleichen; Ergebnissicherung im Plenum. AFB II'),
    z('44–58', `Erarbeitung III: Schockform-Detektiv und Schreibaufgaben (AA2 b/c, Folien ${FN('aa2b-intro')}–${FN('aa2c-loesung-22')})`, `${FOLIE('aa2b-intro')} Erklärfolie: Was ist der Schockform-Detektiv – und warum braucht man das? ${FOLIE('aa2b')} Detektiv (4 Fälle), Fortschritt je Stammgruppe. ${FOLIE('blatt2')} **Blatt 2 austeilen.** ${FOLIE('aa2c')} 2.1/2.2 zeigen und erklären; „Jetzt bearbeiten“ blendet den Auftrag ein und startet die Uhr (5 min); die Fälle stehen am Handy. **Folien ${FN('aa2c-loesung-21')}–${FN('aa2c-loesung-22')}:** Musterlösung 2.1 und 2.2 (je eine Folie): SuS aufrufen, passende Zeilen aufdecken.`, 'Schockform-Detektiv allein am Handy; 2.1 und 2.2 allein schreiben, mit der Musterlösung vergleichen und verbessern.', 'EA (Handy) → EA → Plenum', 'Handy, Blatt 2 (S. 3)', 'Aus Befunden auf die Schockform schließen; Pathophysiologie erläutern (KA 3.2), Unterschied neurogen (KA 5.5). AFB II'),
    ueber('„Sie wissen jetzt, wie sich die Schockformen unterscheiden. Aber wie lagern Sie? Aus dem Erste-Hilfe-Kurs kennen Sie: ‚Beine hoch.‘ Prüfen wir, ob das immer stimmt.“'),
    z('58–76', `Erarbeitung IV: Lagerung nach Leitsymptom (AA3, Folien ${FN('aa3-impuls')}–${FN('aa3b-loesung-32')})`, `${FOLIE('aa3-impuls')} Impuls „Bei einem Schock immer Beine hoch?“ – Meinungen sammeln. **Folien ${FN('lagerung-1')}–${FN('lagerung-4')}:** die vier Lagerungen mit Bild, Wann? Warum? So geht’s (je ca. 1 min). ${FOLIE('aa3')} Lagerungs-Quiz allein am Handy (ca. 4 min), Fortschritt am Beamer. ${FOLIE('aa3-merksatz')} Merksatz AA3 gemeinsam lesen (Lesefolie). ${FOLIE('aa3b')} 3.1/3.2 zeigen und erklären, „Jetzt bearbeiten“ (Uhr 5 min). **Folien ${FN('aa3b-loesung-31')}–${FN('aa3b-loesung-32')}:** Musterlösung 3.1 und 3.2 (je eine Folie) aufdecken.`, 'Lagerungen ansehen; Quiz am Handy: Leitsymptom erkennen, Lagerung wählen, aufdecken (Bilder auf dem AB und am Handy); Merksatz AA3 mitlesen; 3.1/3.2 allein, mit der Musterlösung vergleichen und verbessern.', 'Plenum → EA (Handy) → EA → Plenum', 'Handy, Blatt 2', 'Fehlvorstellung „immer Beine hoch“ korrigieren; Lagerungsbegründung als K.-o.-Kriterium in KA 3.3; 3.2 übt das Korrigieren falscher Aussagen. AFB II'),
    ueber(`Pause (falls im Stundenraster vorgesehen). – „Sie wissen jetzt, wie Sie lagern. Aber was dürfen Sie im Notfall selbst – und wofür brauchen Sie eine Anordnung?“`),
    z('76–89', `Vertiefung: Wer darf was? (AA4, Folien ${FN('aa4a')}–${FN('aa4b-loesung')})`, `${FOLIE('aa4a')} Jeder Klick zeigt die nächste Maßnahme; die SuS stimmen am Handy ab (🟢/🟡/🔴), der Beamer zeigt nur, wie viele schon abgestimmt haben. Der nächste Klick zeigt die Lösung mit der Verteilung der Stimmen und „Das hatten X von Y richtig!“, die Handys melden richtig/falsch zurück (6 Maßnahmen); bei vielen falschen Stimmen nachfragen und begründen lassen; die Lösung steht vorausgefüllt in der Tabelle auf dem AB. ${FOLIE('aa4-merksatz')} Merksatz AA4 gemeinsam lesen (Lesefolie) – er bündelt die Tabelle. ${FOLIE('blatt3')} **Blatt 3 austeilen.** ${FOLIE('aa4b')} Dialog und 4.1 zeigen, „Jetzt bearbeiten“: Think 2,5 min, Pair 1,5 min (Uhr). ${FOLIE('aa4b-loesung')} Musterlösung 4.1 aufdecken.`, 'Am Handy abstimmen (die Tabelle auf dem AB hilft), die Wahl begründen; Merksatz AA4 mitlesen; Stellungnahme zu Herrn Brandt schreiben, zu zweit vergleichen, mit der Musterlösung verbessern.', 'EA (Handy) → Plenum → PA → Plenum', 'Blatt 2 (S. 4), Blatt 3, Handy', 'Verantwortungsgrenzen (III.2.b; KA 3.3: „n. ä. A./SOP“); Fehlvorstellung „Antihistaminikum statt Adrenalin“ korrigieren (KA 3.3); Merksatz bündelt die Sofortmaßnahmen. AFB II–III'),
    ueber('„Jetzt wenden Sie alles an: ein neuer Fall – allein, nur mit den Merksätzen AA3 und AA4, mit Punkten.“'),
    z('89–102', `Sicherung: Transferfall – Wissen anwenden (AA5, Folien ${FN('aa5')}–${FN('aa5-peer-2')})`, `${FOLIE('aa5')} Transferfall zeigen, „Jetzt bearbeiten“: Countdown 8 min. ${FOLIE('aa5-peer')} Tauschpartnerin oder Tauschpartner aus einer anderen Stammgruppe; das Raster erscheint am Handy (Uhr 4 min); dazu die Musterlösung Zeile für Zeile aufdecken – sie steht groß auf zwei Folien, die Uhr läuft auf der zweiten weiter; Rückmeldesatz einfordern.`, 'Transferfall (5.1, 5.2) allein lösen; Lösung der Partnerin oder des Partners mit dem App-Raster bewerten und mit der Musterlösung vergleichen.', 'EA → PA', 'Blatt 3, Handy', 'Transfer auf einen neuen Fall im KA-Format (KA 3.3); Peer-Feedback nach Erwartungshorizont. AFB III'),
    z('102–107', `Transfer: Zurück zu Frau Maler (AA6, Folie ${FN('aufloesung')})`, `${FOLIE('aufloesung')} Kausalkette im Unterrichtsgespräch: vor jedem Klick fragen „Was kommt als Nächstes?“, dann aufdecken; zum Schluss die Antwort auf die Leitfrage.`, 'Nächstes Glied vermuten, Kausalkette auf S. 1 ergänzen, Leitfrage beantworten.', 'Plenum', 'Blatt 1 (S. 1)', 'Leitfall abschließen; Brücke zur Thromboseprophylaxe (1. AJ). AFB II–III'),
    z('107–125', 'Puffer (ca. 18 min)', 'Bewusst eingeplante Reserve: für langsames Lesen und Schreiben und für die Sicherungsfolien (Merksätze, Tabelle, Musterlösungen) – mit Aufrufen dauern sie oft länger als geplant. Bleibt Zeit: mit der Hausaufgabe beginnen.', '–', '–', '–', 'Zeitreserve, kein neuer Inhalt'),
    z('125–135', `Abschlusssicherung: „Hätten Sie richtig gehandelt?“ (Folien ${FN('checkout-intro')}–${FN('ende')})`, `${FOLIE('checkout-intro')} „Was haben wir heute gelernt?“ – kurz zusammenfassen und überleiten: dieselben Notfälle, jetzt mit neuem Fachwissen. ${FOLIE('checkout')} Notfall für Notfall: zeigen, abstimmen lassen, „Auflösung zeigen“ – richtige Antwort, Erklärung und die Klasse am Anfang und jetzt nebeneinander; nachfragen, wo sich viel verändert hat. ${FOLIE('checkout-ergebnis')} Vorher – nachher im Überblick; größte Veränderung besprechen (v. a. E4 = Leitfrage). ${FOLIE('ende')} Hausaufgabe und Nachlesen – damit wird die Nachlese-Seite freigeschaltet.`, 'Dieselben Notfälle erneut am Handy entscheiden; Auflösung mit der eigenen Vermutung vergleichen; eigene Bilanz am Handy.', 'EA (Handy) → Plenum', 'Handy, Beamer', 'Vermutungen überprüfen, Lernzuwachs sichtbar machen (vorher/nachher); Lernstandsdiagnose.'),
  ];
  push(B.tabelle(sp, zeilen, { kopfFill: F.BLAU_D, kopfFarbe: 'FFFFFF', schrift: 17 }));
  return k;
}

function hinweise(B) {
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  const punkt = (text) => new Paragraph({ bullet: { level: 0 }, spacing: { after: 50, line: 252 }, children: B.runs(text, { size: 20 }) });
  push(
    B.abschnitt('Vorbereitung und Hinweise'),
    B.zwischen('Gruppeneinteilung'),
    punkt(`**Per Knopfdruck am Beamer (Folie ${FN('puzzle')}):** Stammgruppen zu 3 (A, B, C); geht es nicht auf, Vierergruppen mit doppeltem B (Anaphylaxie ist Klausurschwerpunkt). Expertenteams zu 3, Rest zu 4; zwei B-Expertinnen derselben Stammgruppe kommen in verschiedene Teams. Wer später kommt, wird automatisch eingeteilt; Personen ohne Handy trägt die Lehrkraft vorher mit „+ Person ohne Handy“ ein.`),
    punkt('**3BFP2.1 (23 SuS):** 7 Stammgruppen (5 × 3, 2 × 4) · Expertenteams A1–A2, B1–B3, C1–C2. **3BFP2.2 (20 SuS):** 6 Stammgruppen (4 × 3, 2 × 4) · Expertenteams A1–A2, B1–B2, C1–C2.'),
    B.zwischen('Material und Technik'),
    punkt(`Kopien: AB (SV) für alle als **drei einzelne Blätter**, je beidseitig (Blatt 1 = S. 1–2, Blatt 2 = S. 3–4, Blatt 3 = S. 5–6), getrennt bereitlegen. Sie werden **nacheinander** ausgeteilt – jeweils mit einer Folie „Weiter mit Arbeitsblatt …“ (Folien ${FN('blatt1')}, ${FN('blatt2')} und ${FN('blatt3')}), die Überschrift und Aufgaben des Blattes zeigt. Die Expertenblätter (Anlagen) müssen **nicht** gedruckt werden – die SuS arbeiten am Handy; sie sind nur Reserve, falls Handys oder WLAN ausfallen.`),
    punkt('**Beamer:** **beamer.html** öffnen → „Neuen Raum starten“. Unten rechts **Weiter**, links **Zurück** (auch Pfeiltasten, Presenter); Menü ⚙ unten links: zu jeder Folie springen, Vollbild, Namen verbergen, Angemeldete verwalten, neuer Raum für die Parallelklasse. Die Handys wechseln automatisch mit; ein QR-Code unten auf jeder Folie lässt Nachzügler einsteigen (**anklicken = groß**). Probeansicht ohne Internet: beamer.html?demo=1.'),
    punkt(`**Nicht fertig geworden?** In der Folgewoche geht es mit Arbeitsblatt 2 oder 3 weiter: beamer.html → „Neuen Raum starten“ → Menü ⚙ → Folie „Weiter mit Arbeitsblatt 2“ (Folie ${FN('blatt2')}) bzw. „… 3“ (Folie ${FN('blatt3')}). Den kleinen QR-Code unten links anklicken – er wird groß, die SuS scannen ihn. Alle Übungen danach brauchen keine Gruppen aus der Vorwoche. Nur der Vergleich mit dem Einstieg entfällt: Der Check-out zeigt dann nur die Entscheidung am Ende.`),
    punkt(`**Nachlese-Seite** (QR-Code auf der letzten AB-Seite): alle Inhalte und Lösungen der Stunde zum Wiederholen. Sie ist gesperrt, solange irgendwo eine Beamer-Stunde läuft – bis Folie ${FN('ende')} erreicht ist oder 10 Minuten nach dem Schließen des Beamers.`),
    punkt('**Zeitplan und Puffer:** Für langsam lesende Klassen gerafft – 4 statt 6 Einstiegsnotfälle, kürzere Infotexte mit kurzen Sätzen, nur 3 Ablenker im Expertenfall, Detektiv mit 4 Fällen, Lagerungs-Quiz allein am Handy (keine Matten), kein Entscheidungsweg, kein Check-out und keine Zusatzaufgaben auf dem AB. Alle Aufgaben im KA-Format (2.1–5.2, Hausaufgabe) bleiben. Dadurch bleiben rund **18 Minuten Puffer** (107–125) für langsames Lesen und die Sicherungsfolien.'),
    punkt('**Merksätze:** Sie stehen fertig auf dem AB (Schlüsselwörter fett) – kein Abschreiben vom Handy, kein Wechsel zwischen Handy und Blatt. Die Merksatz-Folien sind **Lesefolien** (ca. 1 min): vorlesen oder vorlesen lassen; das spart gegenüber dem Lückentext rund 5 Minuten. Das Handy zeigt den Merksatz am Ende der Übung nur noch zur Bestätigung.'),
    punkt('**Sicherungsfolien:** Nach jeder Papieraufgabe eine Aufgabenfolie (erst erklären, dann „Jetzt bearbeiten“ – das startet die Uhr) und eine Musterlösung zum Aufdecken. Die Handys zeigen dazu passende Hinweise. Aufgedecktes bleibt aufgedeckt, auch nach dem Neuladen.'),
    punkt('Ohne WLAN oder Handys: Expertenblätter (Anlagen) drucken; Abstimmungen (Einstieg, „Wer darf was?“) per Handzeichen/Ampelkarten; Lagerungs-Situationen aus der Liste unten vorlesen; Merksätze und Musterlösungen aus dieser Lehrerversion vorlesen.'),
    punkt('Schutz gegen Durchklicken wie gewohnt: Am Handy erscheinen Merksatz bzw. „Geschafft!“ nur, wenn genug Aufgaben beim ersten Versuch richtig sind – sonst „Nicht einfach durchklicken“ (am Beamer sichtbar).'),
    B.zwischen('Inhaltliche Hinweise'),
    punkt('**Einstieg und Check-out („Wie hätten Sie gehandelt?“):** Sie zeigen die vier Notfälle nacheinander, die Klasse stimmt jeweils gleichzeitig am Handy ab – ohne Namen. Falsch liegen ist ausdrücklich erlaubt; die Sicherheit („sicher“ / „vermute nur“) macht Fehlvorstellungen sichtbar, die mit Überzeugung vertreten werden. Beim Einstieg zeigt „Ergebnisse anzeigen“ nur die Verteilung – nichts auflösen, auch nicht beim Murmeln. Im Check-out (nach der Folie „Was haben wir heute gelernt?“) dieselben Notfälle noch einmal, jetzt mit „Auflösung zeigen“: richtige Antwort, Erklärung und die Klasse am Anfang und jetzt nebeneinander. E4 ist die Leitfrage (Frau Maler um 11 Uhr); sie wird in AA6 geklärt (Kausalkette auf S. 1 des AB). Der Check-out steht nicht auf dem AB.'),
    punkt(T.LV_HINWEISE.leitlinie),
    punkt(T.LV_HINWEISE.adrenalin),
    punkt(T.LV_HINWEISE.leitfall),
    punkt(T.LV_HINWEISE.uebungsfaelle),
    B.zwischen('Nicht enthalten (andere Kompetenzbereiche/Fächer)'),
    punkt(T.LV_HINWEISE.nichtEnthalten),
    B.zwischen('„Wer darf was?“ (AA4a) – Lösung'),
    punkt('🟢 selbst: Infusion stoppen, Zugang belassen · nach Leitsymptom lagern'),
    punkt('🟡 n. ä. A./SOP: Adrenalin i. m. · Sauerstoff · Antihistaminikum'),
    punkt('🔴 ärztlich: Diagnose „anaphylaktischer Schock“ stellen'),
    B.zwischen('Lagerungs-Quiz (AA3 a) – zum Vorlesen ohne App')
  );
  push(B.tabelle([{ text: 'Karte', w: 2000 }, { text: 'Situation', w: 3900 }, { text: 'Lösung und Begründung', w: B.breite - 5900 }],
    T.LAGERUNGSKARTEN.map((c) => [`**${c.titel}**${c.dilemma ? ' (Dilemma)' : ''}`, c.text, `**${c.loesung}** – ${c.warum}`]), { schrift: 17 }));
  push(B.zwischen('Quellen'), punkt(T.LV_HINWEISE.quellen));
  return k;
}

/* =====================================================================
   Dokumente bauen
   ===================================================================== */
// Zwei Tabellen direkt hintereinander verschmelzen in Word/LibreOffice zu einer – deshalb ein kleiner Absatz dazwischen.
function trenne(children) {
  const out = [];
  for (const c of children) {
    if (c instanceof Table && out.length && out[out.length - 1] instanceof Table) out.push(new Paragraph({ spacing: { after: 0, line: 160 }, children: [new TextRun({ text: '', size: 8 })] }));
    out.push(c);
  }
  return out;
}
const sektionHoch = (children, lehrkraft) => ({ properties: { page: SEITE_HOCH }, headers: { default: kopf(BREITE_HOCH, { lehrkraft }) }, footers: { default: fuss(FUSS) }, children: trenne(children) });

async function speichern(doc, name) {
  const buf = await Packer.toBuffer(doc);
  fs.mkdirSync(AUS, { recursive: true });
  fs.writeFileSync(path.join(AUS, name), buf);
  console.log('geschrieben:', path.join(AUS, name));
}

async function main() {
  const SV = bausteine({ lsg: false, breite: BREITE_HOCH });
  await speichern(new Document({ creator: 'KB I · 3BFP2', title: 'KB1 W2 Schockformen – Schülerversion', styles: STILE, sections: [sektionHoch(schuelerTeil(SV, { lsg: false }))] }), 'KB1_W2_Schockformen_SV.docx');

  const anl = (B) => [
    ...['a', 'b', 'c'].flatMap((x, i) => [...(i ? [B.umbruch()] : []), ...expertenblatt(B, x)])
  ];
  const AN = bausteine({ lsg: false, breite: BREITE_HOCH });
  await speichern(new Document({
    creator: 'KB I · 3BFP2', title: 'KB1 W2 Schockformen – Anlagen', styles: STILE,
    sections: [
      sektionHoch([...anl(AN)])
    ]
  }), 'KB1_W2_Schockformen_Anlagen.docx');

  const LQ = bausteine({ lsg: true, breite: BREITE_QUER });
  const LH = bausteine({ lsg: true, breite: BREITE_HOCH });
  await speichern(new Document({
    creator: 'KB I · 3BFP2', title: 'KB1 W2 Schockformen – Lehrerversion mit Lösungen', styles: STILE,
    numbering: { config: [] },
    sections: [
      { properties: { page: SEITE_QUER }, headers: { default: kopf(BREITE_QUER) }, footers: { default: fuss(FUSS + ' · Lehrerversion') }, children: trenne([...verlaufsplan(LQ), ...hinweise(LQ)]) },
      sektionHoch([...schuelerTeil(LH, { lsg: true })])
    ]
  }), 'KB1_W2_Schockformen_LV_LSG.docx');

  nachleseSchreiben();
}

// Folien und Nachlese zeigen die Musterlösungen ohne Hinweise zur Punktevergabe – die stehen nur in der Lehrerversion.
// Entfernt werden Klammern mit Punkten, z. B. „(Beurteilung 1 P., Begründung 1 P.)“, und reine Bewertungszeilen.
function ohnePunkte(loesungen) {
  const aus = {};
  for (const [k, zeilen] of Object.entries(loesungen)) aus[k] = ohnePunkteZeilen(zeilen);
  return aus;
}

// docs/inhalte_nachlesen.js: Lösungstexte aus dem Arbeitsblatt für die Nachlese-Seite der App
function nachleseSchreiben() {
  const daten = {
    experten: Object.fromEntries(['a', 'b', 'c'].map((k) => [k, { buchstabe: T.EXPERTEN[k].buchstabe, form: T.EXPERTEN[k].form, fall: T.EXPERTEN[k].fall }])),
    vergleich: N.vergleich, gemeinsamkeit: N.gemeinsamkeit,
    pikto: N.pikto.map((x) => ({ bild: x[0], titel: x[1], wann: x[2], warum: x[3] })),
    werDarfWas: N.werDarfWas.map((l) => l.join(' · ')), werDarfWasAzubi: N.werDarfWasAzubi, adrenalinText: N.adrenalinText,
    transferfall: N.transferfall,
    aufgaben: N.aufgaben, loesungen: ohnePunkte(N.loesungen)
  };
  const ziel = path.join(WURZEL, 'docs', 'inhalte_nachlesen.js');
  fs.writeFileSync(ziel, '/* Automatisch erzeugt von werkzeuge/ab_w2.js – bitte nicht von Hand ändern.\n' +
    '   Lösungstexte aus dem Arbeitsblatt für die Nachlese-Seite (w2-nachlesen.html). */\n' +
    'var NACHLESEN = ' + JSON.stringify(daten, null, 1) + ';\n');
  console.log('geschrieben:', ziel);
}

main().catch((e) => { console.error(e); process.exit(1); });

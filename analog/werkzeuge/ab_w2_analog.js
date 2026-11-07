/* Erstellt die ANALOGE Fassung der Stunde KB I · Woche 2 (SW 7) „Schock ist nicht gleich Schock“:
   ohne Smartphones und ohne Beamer – alles auf Papier, Sicherung an der Tafel und mit Lösungskarten.
   Eigenständiges Projekt im Ordner analog/ – nutzt keine Datei der digitalen Fassung.
     analog/arbeitsblatt/KB1_W2_Schockformen_analog_SV.docx       Schülerversion: AB1 (S. 1–4), AB2 (S. 5–8), AB3 (S. 9–10),
                                                           Korrekturbogen (S. 11–12)
     analog/arbeitsblatt/KB1_W2_Schockformen_analog_Anlagen.docx  Expertenblätter, Kontrollkarten, Lösungskarten, Loskarten, Tischschilder
     analog/arbeitsblatt/KB1_W2_Schockformen_analog_LV_LSG.docx   Lehrerversion: Verlaufsplan, Tafelbild, Kopierliste,
                                                           Lösungen fürs Plenum, Arbeitsblatt mit Lösungen
   Inhaltlich dieselbe Stunde wie die digitale Fassung: Fälle, Aufgaben, Lösungen und Merksätze stehen in
   analog/daten/texte.js, die Übungen (Experten-Check, Fall markieren, Detektiv, Lagerungs-Quiz, Wer darf was?,
   Bewertungsraster, Selbstkontrolle) in analog/daten/inhalte.js und inhalte_stunde.js – Kopien vom 7.11.2026.
   Aufruf (im Ordner analog/): node werkzeuge/ab_w2_analog.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType, VerticalAlign, TableLayoutType, HeightRule, BorderStyle } = require('docx');
const { bausteine, kopf, fuss, bild, F, SEITE_HOCH, SEITE_QUER, STILE, WURZEL, rahmen, keinRand, ohnePunkte } = require('./bausteine');
const T = require('../daten/texte');

// Übungsdaten (Kopie der App-Inhalte) – dieselben Fälle, Fragen und Lösungen wie am Handy
const lade = (datei, name) => { const k = {}; vm.createContext(k); vm.runInContext(fs.readFileSync(path.join(WURZEL, 'daten', datei), 'utf8') + `\nthis.__x = ${name};`, k); return k.__x; };
const I = lade('inhalte.js', 'INHALTE');
const S = lade('inhalte_stunde.js', 'STUNDE');
const folie = (id) => { const f = S.folien.find((x) => x.id === id); if (!f) throw new Error('Folie fehlt: ' + id); return f; };
const ohneTrenn = (s) => s.replace(/­/g, '');
const BLATT = (nr) => S.folien.find((x) => x.typ === 'blatt' && x.nr === nr).ueberschrift;

const AUS = process.argv[2] || path.join(WURZEL, 'arbeitsblatt');
const FUSS = 'KB I · Woche 2 · Schock ist nicht gleich Schock';
const BREITE_HOCH = 11906 - 2 * 1134;   // 9638
const BREITE_QUER = 16838 - 2 * 1134;   // 14570
const BOX = '☐';
const KREUZ = '☒';
const IC = { lesen: 'icon_lesen.png', markieren: 'icon_markieren.png', schreiben: 'icon_schreiben.png', stift: 'icon_stift.png', beurteilen: 'icon_beurteilen.png', checkout: 'icon_checkout.png', schere: 'icon_schere.png' };
const BUCHST = ['A', 'B', 'C'];
const KLEIN = ['a', 'b', 'c'];
const FORM = { A: 'hypovolämischer Schock', B: 'anaphylaktischer Schock', C: 'neurogener Schock' };

/* ---------- Einstieg und Check-out: dieselben vier Notfälle, auf Papier in anderer Reihenfolge der
   Antworten – sonst wäre jedes Mal „B“ richtig (am Handy fällt das nicht auf, auf Papier schon). ---------- */
const REIHENFOLGE = { E1: [0, 2, 1], E2: [1, 0, 2], E3: [0, 1], E4: [1, 2, 0] };
const EINSTIEG = T.ENTSCHEIDUNG.map((e) => {
  const texte = e.optionen.map((o) => o.replace(/^[A-C] /, ''));
  const alt = e.optionen.findIndex((o) => o.startsWith(e.richtig + ' '));
  const r = REIHENFOLGE[e.nr];
  return { nr: e.nr, frage: e.frage, optionen: r.map((i, k) => ({ b: BUCHST[k], t: texte[i] })), richtig: BUCHST[r.indexOf(alt)], erklaerung: e.erklaerung };
});

/* ---------- Experten-Check auf Papier: Antworten gemischt (sonst immer a, b, c der Reihe nach) ---------- */
const CHECK_REIHENFOLGE = { A: [[1, 0, 2], [2, 0, 1], [2, 1, 0]], B: [[1, 2, 0], [1, 0, 2], [0, 2, 1]], C: [[2, 0, 1], [0, 2, 1], [2, 0, 1]] };
const CHECK = Object.fromEntries(BUCHST.map((x) => [x, S.check[x].map((q, j) => {
  const r = CHECK_REIHENFOLGE[x][j];
  return { frage: q.frage, optionen: r.map((i) => q.optionen[i]), richtig: KLEIN[r.indexOf(q.richtig)] };
})]));

/* ---------- Gruppeneinteilung per Loskarte (wie die Einteilung am Beamer):
   Stammgruppen zu 3 (A, B, C), Vierergruppen mit doppeltem B; Expertenteams zu 3–4;
   zwei B derselben Stammgruppe kommen in verschiedene Expertenteams. ---------- */
const KLASSEN = [
  { name: '3BFP2.1', stamm: [3, 3, 3, 3, 3, 4, 4], teams: { A: 2, B: 3, C: 2 } },
  { name: '3BFP2.2', stamm: [3, 3, 3, 3, 4, 4], teams: { A: 2, B: 2, C: 2 } }
];
function lose(klasse) {
  const karten = [];
  klasse.stamm.forEach((n, i) => (n === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'B', 'C']).forEach((x) => karten.push({ stamm: i + 1, x })));
  for (const x of BUCHST) karten.filter((k) => k.x === x).forEach((k, j) => { k.team = x + ((j % klasse.teams[x]) + 1); });
  return karten;
}
const teamsVon = (klasse) => BUCHST.flatMap((x) => Array.from({ length: klasse.teams[x] }, (_, j) => x + (j + 1)));

/* ---------- Bausteine ---------- */
function blattKopf(B, text, o = {}) {
  return new Paragraph({
    keepNext: true, spacing: { before: 0, after: 100 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: '2E75B6' },
    children: [B.emoji(' 📄 ', { size: 24 }), B.b(`Schockformen: ${text}`, { size: 25, color: 'FFFFFF' })],
    ...o
  });
}
const P = (B, text, o = {}, lauf = {}) => new Paragraph({ spacing: { after: 40, line: 252 }, ...o, children: B.runs(text, lauf) });
const mitte = (B, kinder, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, ...o, children: kinder });
const fallText = (teile) => teile.map((t) => (typeof t === 'string' ? t : t.t)).join('').replace(/\s*\n\s*/g, '\n');
// Lösungs-Kasten (Lösungskarten): Musterlösung ohne Hinweise zur Punktevergabe
const GRUEN_HELL = 'E2EFDA', GRUEN = '548235';
const loesungKasten = (B, zeilen, kopfText, groesse) => B.kasten(ohnePunkte(zeilen).map((z) => P(B, z, { spacing: { after: groesse ? 30 : 60, line: groesse ? 240 : 264 } }, groesse ? { size: groesse } : {})), { kopf: kopfText, fill: 'FFFFFF', kopfFill: GRUEN_HELL, rand: GRUEN });

/* =====================================================================
   SCHÜLERVERSION (lsg = true: mit Lösungen für die Lehrerversion)
   ===================================================================== */
function schueler(B, { lsg }) {
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  const L = (zeilen) => (lsg ? zeilen : []);
  const merk = (titel, key) => B.merksatz(titel, [T.MERKSAETZE[key]]);
  const A = (nr) => { const { loesung, ...a } = T.AUFGABEN[nr]; return a; };
  const anderFarbe = (text) => new Paragraph({ spacing: { before: 60, after: 60 }, children: [B.emoji('✅ '), ...B.runs(text, { size: 19 })] });

  /* ---------- AB1 · S. 1: Lernziel, Frau Maler, Leitfrage, Kausalkette (am Ende), Einstieg ---------- */
  const luecke = '_'.repeat(12);
  push(
    blattKopf(B, BLATT(1)),
    B.titel('Schock ist nicht gleich Schock – vergleichen und nach Leitsymptom handeln', lsg ? '[LSG]' : null),
    new Paragraph({ spacing: { after: 120, line: 264 }, children: [B.emoji('🎯 '), B.b('Lernziel: '), ...B.runs(T.LERNZIEL)] }),
    B.kasten([B.p(T.FALLBEZUG.absaetze[0]), B.p(T.FALLBEZUG.absaetze[1], { spacing: { after: 0, line: 264 } })], { kopf: T.FALLBEZUG.kopf, fill: 'FFFFFF', kopfFill: 'FFFFFF', rand: '000000' }),
    B.leer(100),
    B.leitfrage(T.LEITFRAGE),
    B.aa([IC.lesen, IC.schreiben], 'AA6 · Am Ende der Stunde:', 'Ihre Lehrkraft entwickelt die **Kausalkette** an der Tafel Schritt für Schritt. Ergänzen Sie die Lücken und beantworten Sie dann die Leitfrage.'),
    B.meta('6 min · Plenum (Unterrichtsgespräch an der Tafel) · AFB II–III · die SuS tragen die Kette hier auf S. 1 ein'),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 100 }, children: [lsg ? B.loes(T.KETTE, { bold: true, size: 21 }) : B.b(`Immobilität → ${luecke} → ${luecke} → ${luecke} → Kreislaufstillstand`, { size: 21 })] }),
    new Paragraph({ spacing: { before: 40, after: 0 }, keepNext: true, children: [B.b('Antwort auf die Leitfrage:')] }),
    B.linien(2, L([T.LEITFRAGE_ANTWORT])),
    B.aa([IC.stift], 'Einstieg: Wie hätten Sie gehandelt?', '**Vier kurze Notfälle** – der letzte ist Frau Maler um 11 Uhr. Kreuzen Sie in der Spalte **Anfang** Ihre Vermutung an – und ob Sie sich **sicher** sind. **Falsch liegen ist erlaubt!** Aufgelöst wird erst am Ende der Stunde.', { spacing: { before: 160, after: 60, line: 264 } }),
    B.meta('12 min · Einzelarbeit → Murmeln (PA) → Plenum (Handzeichen, Strichliste an der Tafel) · AFB I · Vorwissen aktivieren, Vermutungen bilden, Fehlvorstellungen sichtbar machen; im Check-out (Spalte „Ende“) werden die Vermutungen überprüft')
  );
  const ew = 560, ab = 1700, fw = BREITE_HOCH - ew - 2 * ab;
  const kreuze = (e, ende) => ({ mitte: true, absaetze: [
    mitte(B, B.runs(e.optionen.map((o) => `${BOX} ${o.b}`).join('  '), { size: 20 })),
    mitte(B, B.runs(`${BOX} sicher`, { size: 18 }), { spacing: { before: 40, after: 0 } }),
    ...(lsg && ende ? [mitte(B, [B.loes(`richtig: ${e.richtig}`, { size: 18, bold: true })], { spacing: { before: 40, after: 0 } })] : [])
  ] });
  push(
    B.tabelle([{ text: 'Nr.', w: ew }, { text: 'Notfall – wie handeln Sie?', w: fw }, { text: 'Anfang', w: ab }, { text: 'Ende der Stunde', w: ab }],
      EINSTIEG.map((e) => [
        { text: `**${e.nr}**`, mitte: true },
        { absaetze: [P(B, e.frage, {}, { size: 19 }), P(B, e.optionen.map((o) => `**${o.b}**\u00A0${o.t}`).join('   ·   '), { spacing: { after: 0, line: 252 } }, { size: 19 })] },
        kreuze(e, false), kreuze(e, true)
      ]), { schrift: 19 }),
    new Paragraph({ spacing: { before: 80, after: 0 }, children: B.runs('**Murmeln (1 Minute):** Überzeugen Sie Ihre Nachbarin oder Ihren Nachbarn: Warum würden Sie so handeln?', { size: 20 }) })
  );

  /* ---------- AB1 · S. 2: Teil A – Expertenteam, Merksatz AA1, Vergleichstabelle ---------- */
  push(
    B.abschnitt('Teil A · Drei Wege in den Schock (Gruppenpuzzle)', { pageBreakBefore: true }),
    B.p('Ihre **Loskarte** zeigt, **wer mit wem** arbeitet. **A** = hypovolämischer, **B** = anaphylaktischer, **C** = neurogener Schock.'),
    puzzleGrafik(B),
    new Paragraph({ spacing: { before: 120, after: 100 }, children: [B.b('Ich bin Expertin/Experte für:  '), B.t(`${BOX} A   ${BOX} B   ${BOX} C    `), B.b('Expertenteam: '), B.t('_'.repeat(5) + '   '), B.b('Stammgruppe: '), B.t('_'.repeat(8))] }),
    B.aa([IC.lesen, IC.markieren], 'AA1: Identifizieren – Expertenteam:', '🚶 Setzen Sie sich an den Tisch Ihres **Expertenteams**. Arbeiten Sie mit Ihrem **Expertenblatt**: **a)** Infotext lesen. **b)** Im Fall alle Hinweise **unterstreichen** – der Infotext hilft. **c)** Experten-Check ankreuzen. Dann vergleichen Sie mit der **Kontrollkarte** auf Ihrem Tisch. **d)** Gemeinsam **Ihre Spalte** der Vergleichstabelle ausfüllen. Fertig? Heben Sie die Hand.'),
    B.meta('15 min (+ 1 min Merksatz AA1 lesen) · Einzelarbeit → Gruppenarbeit (Expertenteam, 3–4) · AFB I–II · KA-Bezug KB 1, Aufg. 3.1 (Befunde im Fall erkennen und zuordnen; schriftlich in der Hausaufgabe 1.1)'),
    B.leer(60),
    merk('Merksatz AA1', 'aa1'),
    new Paragraph({ spacing: { before: 160, after: 60 }, keepNext: true, children: B.runs('**Vergleichstabelle** – AA1 d): Ihre Spalte im Expertenteam · AA2 a): die anderen Spalten in der Stammgruppe') })
  );
  const sw = Math.round((BREITE_HOCH - 1700) / 3);
  push(B.tabelle(
    [{ text: '', w: 1700 }, { text: 'A hypovolämisch', w: sw }, { text: 'B anaphylaktisch', w: sw }, { text: 'C neurogen', w: BREITE_HOCH - 1700 - 2 * sw }],
    [
      ...T.VERGLEICH.map((z) => [{ text: `**${z[0]}**`, fill: F.LACHS }, { lsg: z[1] }, { lsg: z[2] }, { lsg: z[3] }]),
      [{ text: '**Gemeinsamkeit**', fill: F.LACHS }, { colSpan: 3, lsg: T.GEMEINSAMKEIT }]
    ],
    { hoehe: 640, schrift: 19 }
  ));

  /* ---------- AB1 · S. 3: AA2 a) Stammgruppe, b) Schockform-Detektiv ---------- */
  const intro = folie('aa2b-intro');
  push(
    B.aa([IC.schreiben], 'AA2: Vergleichen – Stammgruppe:', '**a)** 🚶 **Umsetzen** in die **Stammgruppe**. Erklären Sie reihum **A → B → C** (je 3 Minuten). Die anderen füllen ihre Spalten der Tabelle aus. Zum Schluss: die Gemeinsamkeit.', { pageBreakBefore: true }),
    B.meta('17 min (a mit Lösungskarte 1) · Gruppenarbeit (Stammgruppe 3–4) → Plenum · AFB II · KA-Bezug KB 1, Aufg. 3.2 und 5.5'),
    anderFarbe('Dann bekommt Ihre Stammgruppe die **Lösungskarte 1**. Vergleichen Sie und verbessern Sie Ihre Tabelle mit einer **anderen Farbe**.'),
    B.teil([IC.markieren], '**b) Schockform-Detektiv** (allein):'),
    B.meta('7 min (4 min allein, 3 min Auflösung im Plenum) · Einzelarbeit → Plenum · AFB II · aus Befunden auf die Schockform schließen'),
    B.kasten([P(B, `**${intro.warumTitel}** ${intro.warum.join(' ')}`, { spacing: { after: 0, line: 252 } }, { size: 19 })], { fill: F.GRAU_HELL, rand: F.GRAU_R }),
    new Paragraph({ spacing: { before: 100, after: 80, line: 264 }, children: B.runs('Lesen Sie jeden Fall genau. Kreuzen Sie die **Schockform** an und **unterstreichen** Sie die **zwei Befunde**, die genau diese Schockform belegen. Befund = was Sie beobachten oder messen.') })
  );
  const formName = Object.fromEntries(I.detektiv.formen.map((f) => [f.kuerzel, f.text]));
  I.detektiv.faelle.forEach((fall, i) => {
    const belege = fall.teile.filter((t) => typeof t !== 'string' && t.b === 'beleg').map((t) => t.t);
    push(
      B.kasten([
        P(B, fallText(fall.teile), { spacing: { after: 80, line: 340 } }),
        P(B, `**Schockform:**   ${BOX} hypovolämisch    ${BOX} anaphylaktisch    ${BOX} neurogen`, { spacing: { after: 0 } }, { size: 20 }),
        B.lp(`**Lösung:** ${formName[fall.form]} · **Belege** (zwei davon): ${belege.join(' · ')} – ${fall.erklaerung}`, { spacing: { before: 60, after: 0, line: 252 } })
      ], { kopf: `Fall ${i + 1}`, fill: 'FFFFFF', kopfFill: F.LACHS, rand: F.ORANGE_D }),
      B.leer(80)
    );
  });

  /* ---------- AB1 · S. 4: AA2 c) Schreibaufgaben mit den drei Fällen zum Nachlesen ---------- */
  const fallKurz = (x) => {
    const titel = I.markieren.faelle[x].titel.split('·').pop().trim();
    return P(B, `**${titel}:** ${T.EXPERTEN[x].fall.join(' ')}`, { spacing: { after: 70, line: 240 } }, { size: 17 });
  };
  push(
    B.teil([IC.schreiben], '**AA2 c) Schreibaufgaben** (allein):', { pageBreakBefore: true }),
    B.meta('9 min (6 min schreiben, 3 min Lösungskarte 2) · Einzelarbeit → Vergleich in der Stammgruppe · AFB II · KA-Bezug KB 1, Aufg. 3.2 und 5.5'),
    B.aufgaben([A('2.1'), A('2.2')]),
    B.leer(80),
    B.kasten([fallKurz('b'), fallKurz('a'), fallKurz('c')], { kopf: 'Die drei Fälle zum Nachlesen', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    B.zwischen('2.1'),
    B.linien(6, L(T.AUFGABEN['2.1'].loesung)),
    B.zwischen('2.2'),
    B.linien(5, L(T.AUFGABEN['2.2'].loesung)),
    anderFarbe('Danach bekommt Ihre Stammgruppe die **Lösungskarte 2**. Vergleichen Sie und verbessern Sie mit einer **anderen Farbe**.')
  );

  /* ---------- AB2 · S. 5: AA3 – die vier Lagerungen ---------- */
  push(
    blattKopf(B, BLATT(2), { pageBreakBefore: true }),
    B.aa([IC.lesen], 'AA3: Begründen – Lagerung (Positionierung) nach Leitsymptom:', 'Schock → immer Beine hoch? Nein! Entscheidend ist das **Leitsymptom** – das Zeichen, das die Person gerade am meisten gefährdet.'),
    B.meta('21 min (Impuls, die vier Lagerungen, Merksatz, Quiz mit Auflösung, 3.1/3.2 mit Lösungskarte 3) · Plenum → Einzelarbeit → Plenum → Einzelarbeit · AFB II · KA-Bezug KB 1, Aufg. 3.3'),
    new Paragraph({ spacing: { before: 60, after: 100 }, children: B.runs('Die **vier wichtigen Lagerungen** bei Schock:') })
  );
  const hw = Math.floor(BREITE_HOCH / 2);
  const lagerZelle = (x, n) => {
    const so = folie(`lagerung-${n}`).so;
    return B.zelle([
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [bild(x[0], 4.4, 2.47)] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 50 }, children: [B.b(x[1], { size: 22 })] }),
      P(B, x[2], { spacing: { after: 30, line: 240 } }, { size: 19 }),
      P(B, x[3], { spacing: { after: 30, line: 240 } }, { size: 19 }),
      P(B, '**So geht’s:**', { spacing: { after: 10, line: 240 } }, { size: 19 }),
      ...so.map((s, i) => P(B, `• ${s}`, { spacing: { after: i === so.length - 1 ? 0 : 10, line: 240 } }, { size: 18 }))
    ], hw, { borders: rahmen(F.ORANGE_D, 6), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS } });
  };
  push(new Table({
    width: { size: hw * 2, type: WidthType.DXA }, columnWidths: [hw, hw], layout: TableLayoutType.FIXED,
    rows: [0, 2].map((i) => new TableRow({ cantSplit: true, children: [lagerZelle(T.PIKTO[i], i + 1), lagerZelle(T.PIKTO[i + 1], i + 2)] }))
  }));
  push(
    new Paragraph({ spacing: { before: 80, after: 60 }, children: [B.emoji('⚠️ '), ...B.runs(T.ANAPHYLAXIE_LAGERUNG, { size: 19 })] }),
    lsg ? new Paragraph({ spacing: { after: 80 }, children: [B.i('Quelle: nach S2k-Leitlinie Akuttherapie und Management der Anaphylaxie (AWMF 061-025, 2021); sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] }) : null
  );

  /* ---------- AB2 · S. 6: Merksatz AA3 (hilft beim Quiz), a) Lagerungs-Quiz ---------- */
  const opt = I.lagerung.optionen;
  const ow = 920, nw = 400, qw = BREITE_HOCH - nw - opt.length * ow;
  // kurze Spaltenköpfe, damit nichts mitten im Wort umbricht
  // \u00AD = weicher Trennstrich (trennt nur, wenn das Wort nicht in die schmale Spalte passt)
  const KOPF = { OK: 'Ober\u00ADkörper hoch', BH: 'flach, Beine hoch', SSL: 'stabile Seiten\u00ADlage', NB: 'nicht bewegen, Kopf halten', REA: 'Reani\u00ADmation' };
  push(
    merk('Merksatz AA3', 'aa3'),
    B.teil([IC.stift], '**a) Lagerungs-Quiz** (allein):'),
    new Paragraph({ spacing: { after: 80, line: 264 }, keepNext: true, children: B.runs('Was ist das **Leitsymptom**? Kreuzen Sie an, wie Sie lagern. Hilfe: die **Bilder** und der **Merksatz AA3**. Danach lösen wir gemeinsam auf.') }),
    B.tabelle(
      [{ text: '', w: nw }, { text: 'Situation', w: qw }, ...opt.map((o) => ({ text: KOPF[o.kuerzel], w: ow }))],
      I.lagerung.karten.map((c, i) => [
        { text: `**${i + 1}**`, mitte: true },
        { absaetze: [P(B, `**${c.titel}:** ${c.text}`, { spacing: { after: 0, line: 240 } }, { size: 18 })] },
        ...opt.map((o) => ({ mitte: true, absaetze: [mitte(B, [lsg && o.kuerzel === c.richtig ? B.loes(KREUZ, { size: 26 }) : B.t(BOX, { size: 26 })])] }))
      ]),
      { schrift: 15 }
    )
  );

  /* ---------- AB2 · S. 7: b) Schreibaufgaben 3.1 und 3.2 ---------- */
  push(
    B.teil([IC.schreiben], '**b) Schreibaufgaben** (allein) – danach bekommt Ihre Stammgruppe die **Lösungskarte 3**: vergleichen, mit **anderer Farbe** verbessern.'),
    B.aufgaben([A('3.1'), A('3.2')]),
    B.zwischen('3.1'),
    B.linien(4, L(T.AUFGABEN['3.1'].loesung)),
    B.zwischen('3.2'),
    B.linien(4, L(T.AUFGABEN['3.2'].loesung))
  );

  /* ---------- AB2 · S. 7–8: Teil B · AA4 a) Wer darf was? ---------- */
  const aa4 = folie('aa4a');
  const mw = 4300, kw = Math.floor((BREITE_HOCH - mw) / 3);
  push(
    B.abschnitt('Teil B · Anaphylaxie – wer darf was?', { pageBreakBefore: true }),
    B.aa([IC.beurteilen], 'AA4: Unterscheiden – Wer darf was?', '**a) Ankreuzen:** Wer darf diese Maßnahmen durchführen? Kreuzen Sie an. Die **Tabelle** darunter hilft Ihnen. Danach besprechen wir die Lösung gemeinsam.'),
    B.meta('14 min (a mit Auflösung im Plenum und Merksatz AA4, b mit Lösungskarte 4) · Einzelarbeit → Plenum → Partnerarbeit → Vergleich · AFB II–III · KA-Bezug KB 1, Aufg. 3.3 · Kompetenz III.2.b'),
    B.tabelle(
      [{ text: 'Maßnahme', w: mw }, ...aa4.ecken.map((e, i) => ({ text: `${e.emoji} ${e.text}`, w: i === 2 ? BREITE_HOCH - mw - 2 * kw : kw }))],
      aa4.massnahmen.map((m) => [
        { text: m.text },
        ...aa4.ecken.map((e, i) => ({ mitte: true, absaetze: [mitte(B, [lsg && i === m.ecke ? B.loes(KREUZ, { size: 26 }) : B.t(BOX, { size: 26 })])] }))
      ]),
      { schrift: 19 }
    ),
    B.leer(120)
  );
  const vw = Math.floor(BREITE_HOCH / 3);
  const liste = (punkte) => ({ absaetze: punkte.map((t, i) => new Paragraph({ spacing: { after: i === punkte.length - 1 ? 0 : 30, line: 240 }, children: [B.t('• ', { size: 19 }), ...B.runs(t, { size: 19 })] })) });
  push(
    B.tabelle([{ text: T.WER_DARF_WAS_KOPF[0], w: vw }, { text: T.WER_DARF_WAS_KOPF[1], w: vw }, { text: T.WER_DARF_WAS_KOPF[2], w: BREITE_HOCH - 2 * vw }], [
      T.WER_DARF_WAS.map(liste),
      [{ colSpan: 3, text: T.AZUBI }]
    ], { schrift: 19, kopfFill: F.LACHS_KOPF }),
    B.leer(100),
    merk('Merksatz AA4 – Sofortmaßnahmen bei Anaphylaxie', 'aa4')
  );

  /* ---------- AB2 · S. 8: AA4 b) Wer hat recht? ---------- */
  const dw = Math.floor(BREITE_HOCH / 2) - 100;
  const blase = (wer, text) => B.zelle([new Paragraph({ spacing: { after: 40 }, children: [B.b(wer, { size: 19 })] }), new Paragraph({ spacing: { after: 0 }, children: [B.i(text)] })], dw, { borders: rahmen(F.ORANGE_D, 6), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS_HELL } });
  push(
    B.teil([IC.beurteilen], '**AA4 b) Wer hat recht?** **Think** (2,5 Min.): allein schreiben. **Pair** (1,5 Min.): zu zweit vergleichen.', { pageBreakBefore: true }),
    P(B, T.ADRENALIN_TEXT[0], { spacing: { after: 40, line: 264 } }),
    P(B, T.ADRENALIN_TEXT[1], { spacing: { after: 100, line: 264 } }),
    new Table({ width: { size: dw * 2 + 200, type: WidthType.DXA }, columnWidths: [dw, 200, dw], layout: TableLayoutType.FIXED, rows: [new TableRow({ cantSplit: true, children: [
      blase(T.DIALOG[0].wer, T.DIALOG[0].text),
      new TableCell({ width: { size: 200, type: WidthType.DXA }, borders: { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand }, children: [new Paragraph({ children: [] })] }),
      blase(T.DIALOG[1].wer, T.DIALOG[1].text)
    ] })] }),
    B.leer(60),
    B.aufgaben([A('4.1')]),
    B.linien(7, L(T.AUFGABEN['4.1'].loesung)),
    anderFarbe('Danach bekommt Ihre Stammgruppe die **Lösungskarte 4**. Vergleichen Sie und verbessern Sie mit einer **anderen Farbe**.')
  );

  /* ---------- AB3 · S. 9: AA5 Transferfall ---------- */
  push(
    blattKopf(B, BLATT(3), { pageBreakBefore: true }),
    B.aa([IC.schreiben], 'AA5: Transferfall – Wissen anwenden:', '**Allein** (8 Min.) – Hilfe: nur **Merksatz AA3 und AA4**. Dann Peer-Korrektur mit dem **Korrekturbogen**.', { spacing: { before: 100, after: 60, line: 264 } }),
    B.meta('14 min (8 min schreiben, 5 min Peer-Korrektur mit Raster und Musterlösung auf dem Korrekturbogen) · Einzelarbeit → Partnerarbeit · AFB I–III · KA-Format (KB 1, Aufg. 3.3) · Examensvorbild: Mai 2024 Tag 3, Aufg. 8.2; Mai 2026 Tag 1, Aufg. 3.2'),
    B.kasten([B.p(T.TRANSFERFALL[0]), B.p(T.TRANSFERFALL[1], { spacing: { after: 0, line: 264 } })], { kopf: 'Fallsituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    new Paragraph({ spacing: { before: 80, after: 60 }, children: [B.i(T.TRANSFER_RAHMEN)] }),
    B.aufgaben([A('5.1'), A('5.2')]),
    B.linien(14, L(T.LOESUNG_5))
  );

  /* ---------- AB3 · S. 10: Hausaufgabe ---------- */
  const H = T.HAUSAUFGABE;
  push(
    B.abschnitt(H.titel, { pageBreakBefore: true }),
    B.p(H.hinweis, { spacing: { after: 60, line: 252 } }),
    B.meta('ca. 17 min (1,3 min je Punkt wie im Examen) · Einzelarbeit zu Hause · AFB I–III · Selbstkontrolle mit der Rückseite des Korrekturbogens'),
    B.kasten([B.p(H.situation[0]), B.p(H.situation[1], { spacing: { after: 0, line: 264 } })], { kopf: 'Ausgangssituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    new Paragraph({ spacing: { before: 120, after: 60 }, keepNext: true, children: [B.i(H.rahmen1)] }),
    B.aufgaben([H.aufgabe1]),
    B.linien(4, L(H.loesung1)),
    new Paragraph({ spacing: { before: 120, after: 60 }, keepNext: true, children: [B.i(H.rahmen2)] }),
    B.aufgaben(H.aufgaben2),
    B.linien(9, L(H.loesung2)),
    new Paragraph({ spacing: { before: 100, after: 0 }, children: [B.emoji('✅ '), ...B.runs('**Selbstkontrolle:** Erst schreiben – dann mit der **Rückseite des Korrekturbogens** prüfen und Ihre Punkte zählen.', { size: 19 })] })
  );

  /* ---------- Korrekturbogen · S. 11: Peer-Korrektur AA5 ---------- */
  push(...korrekturbogen(B, { lsg }));
  return k;
}

// Ablauf des Gruppenpuzzles: ① Expertenteam → umsetzen → ② Stammgruppe
function puzzleGrafik(B) {
  const w = [3900, BREITE_HOCH - 7800, 3900];
  const kasten = (titel, zeilen, fill) => B.zelle([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [B.b(titel, { size: 22 })] }),
    ...zeilen.map((z) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: B.runs(z, { size: 18 }) }))
  ], w[0], { borders: rahmen('2E75B6', 8), shading: { type: ShadingType.CLEAR, color: 'auto', fill }, verticalAlign: VerticalAlign.CENTER });
  const mitteZelle = B.zelle([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.emoji('🚶')] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.b('umsetzen!', { size: 20, color: F.ORANGE_D })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.b('→', { size: 36, color: F.ORANGE_D })] })
  ], w[1], { borders: { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand }, verticalAlign: VerticalAlign.CENTER });
  return new Table({
    width: { size: BREITE_HOCH, type: WidthType.DXA }, columnWidths: w, layout: TableLayoutType.FIXED,
    rows: [new TableRow({ cantSplit: true, children: [
      kasten('① Expertenteam (15 min)', ['👥 gleicher Buchstabe: **A + A + A**', 'Expertenblatt: Infotext · Fall · Check', '**Ihre Spalte** der Tabelle'], F.BLAU_HELL),
      mitteZelle,
      kasten('② Stammgruppe (11 min)', ['🧩 **A + B + C** an einem Tisch', 'reihum erklären · **Tabelle vollständig**', '✅ mit der **Lösungskarte** vergleichen'], F.LACHS_HELL)
    ] })]
  });
}

/* ---------- Korrekturbogen: Vorderseite Peer-Korrektur AA5, Rückseite Selbstkontrolle der Hausaufgabe ---------- */
function korrekturbogen(B, { lsg }) {
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  const R = I.raster;
  const kurz = Object.fromEntries(R.gruppen.flatMap((g) => g.kriterien).map((x) => [x.id, x.text.split(/ [(–]/)[0]]));
  const kw = 520, pw = 800, tw = BREITE_HOCH - kw - pw;
  const zeilen = [];
  for (const g of R.gruppen) {
    zeilen.push([{ colSpan: 3, text: `**${g.titel}**`, fill: F.LACHS }]);
    for (const x of g.kriterien) zeilen.push([{ mitte: true, absaetze: [mitte(B, [B.t(BOX, { size: 20 })])] }, x.text, { text: `${x.punkte} P.`, mitte: true }]);
  }
  push(
    blattKopf(B, 'Korrektur und Selbstkontrolle', { pageBreakBefore: true }),
    new Paragraph({ spacing: { after: 60, line: 252 }, children: B.runs('**AA5 · Peer-Korrektur:** Tauschen Sie Ihr Arbeitsblatt mit einer Person aus einer **anderen Stammgruppe**. Lesen Sie ihre Antwort zu 5.1 und 5.2. **Haken Sie an, was dort steht.** Die Musterlösung unten hilft Ihnen.') }),
    new Paragraph({ spacing: { after: 100 }, children: [B.b('Lösung von: '), B.t('_'.repeat(22) + '      '), B.b('korrigiert von: '), B.t('_'.repeat(22))] }),
    B.tabelle([{ text: '✓', w: kw }, { text: 'Das steht in der Antwort', w: tw }, { text: 'Punkte', w: pw }], zeilen, { schrift: 18 }),
    B.leer(40),
    B.kasten([
      P(B, `**${R.fehlerTitel}**`, { spacing: { after: 40 } }, { size: 19 }),
      ...R.fehler.map((f) => P(B, `${BOX} ${f.text} → dann zählt nicht: ${f.sperrt.map((id) => `„${kurz[id]}“`).join(' und ')}`, { spacing: { after: 30, line: 240 } }, { size: 19 }))
    ], { fill: F.GELB_HELL, rand: F.ORANGE_D }),
    new Paragraph({ spacing: { before: 100, after: 60 }, children: B.runs('**Punkte:**  5.1 Maßnahmen (höchstens 5): ____   Begründung: ____   5.2: ____   **Gesamt: ____ / 7**', { size: 20 }) }),
    new Paragraph({ spacing: { before: 60, after: 0 }, keepNext: true, children: B.runs(`**Rückmeldung:** ${R.rueckmeldung.replace('Geben Sie jetzt eine Rückmeldung in einem Satz: ', '')}`, { size: 20 }) }),
    B.linien(2),
    B.leer(60),
    loesungKasten(B, T.LOESUNG_5, 'Musterlösung 5.1 und 5.2', 18)
  );

  /* Rückseite: Selbstkontrolle der Hausaufgabe (wie die Selbstkontrolle am Handy) */
  const TR = I.transfer;
  push(
    B.abschnitt('Hausaufgabe · Selbstkontrolle', { pageBreakBefore: true }),
    new Paragraph({ spacing: { after: 80, line: 264 }, children: [B.emoji('✋ '), ...B.runs('**Erst die Hausaufgabe schreiben – dann hier weiterlesen.** Haken Sie **ehrlich** an, was in Ihrer Antwort steht, und zählen Sie Ihre Punkte.')] })
  );
  for (const a of TR.aufgaben) {
    const regel = [a.pflichtHinweis, a.maxMassnahmen ? `Maßnahmen höchstens ${a.maxMassnahmen} Punkte, dazu 1 Punkt für die Begründung.` : null].filter(Boolean).join(' ');
    push(
      B.zwischen(`${a.nr} ${a.titel}`),
      B.kasten(a.muster.split('\n').map((z) => P(B, z, { spacing: { after: 0, line: 228 } }, { size: 17 })), { kopf: 'Musterlösung', fill: 'FFFFFF', kopfFill: GRUEN_HELL, rand: GRUEN }),
      ...a.kriterien.map((x) => P(B, `${BOX} ${x.text} (${x.punkte} P.)`, { spacing: { before: 20, after: 0, line: 228 } }, { size: 18 })),
      regel ? P(B, `**Achtung:** ${regel}`, { spacing: { before: 40, after: 0, line: 240 } }, { size: 18 }) : null,
      P(B, `**Punkte: ____ / ${a.max}**`, { spacing: { before: 40, after: 0 } }, { size: 19 })
    );
  }
  const gesamt = TR.aufgaben.reduce((s, a) => s + a.max, 0);
  push(
    new Paragraph({ spacing: { before: 140, after: 60 }, children: B.runs(`**Meine Punkte: ____ / ${gesamt}**   ·   **Das muss ich noch üben:**`, { size: 21 }) }),
    B.linien(2)
  );
  return k;
}

/* =====================================================================
   ANLAGEN
   ===================================================================== */
function expertenblatt(B, x) {
  const X = x.toUpperCase();
  const e = T.EXPERTEN[x];
  const check = CHECK[X];
  return [
    B.titel(`Expertenblatt ${e.buchstabe} · ${e.form}`),
    B.kasten([
      P(B, '**a)** Lesen Sie den **Infotext**.'),
      P(B, '**b)** Unterstreichen Sie im **Fall** alle Stellen, die auf einen **Schock** oder seine **Ursache** hinweisen. Achtung: Nicht jeder Satz gehört dazu! Der Infotext hilft.'),
      P(B, '**c)** Kreuzen Sie den **Experten-Check** an. Vergleichen Sie dann mit der **Kontrollkarte** auf Ihrem Tisch.'),
      P(B, `**d)** Füllen Sie gemeinsam **Spalte ${e.buchstabe}** der Vergleichstabelle auf Arbeitsblatt 1 aus, alle sechs Zeilen: **Ursache · Entstehung (kurz) · Puls · Haut · weitere typische Zeichen · Darauf achte ich besonders**. Fertig? Hand heben.`, { spacing: { after: 0, line: 252 } })
    ], { kopf: 'So arbeiten Sie im Expertenteam (15 Minuten)', fill: F.BLAU_HELL, kopfFill: F.BLAU_HELL, rand: '2E75B6' }),
    B.leer(100),
    B.kasten([...e.info.map((t) => B.p(t)), new Paragraph({ spacing: { after: 0 }, children: [B.i('Quelle: nach MSD Manual Profi-Ausgabe: Schock; S2k-Leitlinie Anaphylaxie (AWMF 061-025, 2021); sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] })], { kopf: `a) Infotext ${e.buchstabe}: ${e.form}` }),
    new Paragraph({ spacing: { before: 40, after: 120 }, children: [B.b('Wörterhilfe: ', { size: 17 }), B.t(e.woerter, { size: 17 })] }),
    B.kasten(e.fall.map((t, i) => B.p(t, { spacing: { after: i === e.fall.length - 1 ? 0 : 100, line: 360 } })), { kopf: 'b) Fall – unterstreichen Sie alle Hinweise', fill: 'FFFFFF', kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    B.abschnitt('c) Experten-Check – kreuzen Sie an', { pageBreakBefore: true }),
    ...check.flatMap((q, j) => [
      new Paragraph({ spacing: { before: 100, after: 40 }, keepNext: true, children: B.runs(`**${j + 1}.** ${q.frage}`) }),
      ...q.optionen.map((o, i) => new Paragraph({ spacing: { after: 20 }, indent: { left: 360 }, keepNext: i < q.optionen.length - 1, children: B.runs(`${BOX} ${KLEIN[i]}) ${o}`, { size: 21 }) }))
    ])
  ];
}

function kontrollkarte(B, x) {
  const X = x.toUpperCase();
  const e = T.EXPERTEN[x];
  const teile = I.markieren.faelle[x].teile.filter((t) => typeof t !== 'string');
  const kat = I.markieren.kategorien;
  const dazu = teile.filter((t) => t.k);
  const nicht = teile.filter((t) => !t.k);
  const w1 = 3900, w2 = 1700, w3 = BREITE_HOCH - w1 - w2;
  return [
    B.titel(`Kontrollkarte Expertenteam ${e.buchstabe} · ${e.form}`),
    new Paragraph({ spacing: { after: 100 }, children: [B.emoji('✋ '), ...B.runs('**Erst umdrehen, wenn alle im Team unterstrichen und angekreuzt haben.** Vergleichen Sie und ergänzen Sie, was fehlt.')] }),
    B.zwischen('b) Diese Stellen gehören dazu'),
    B.tabelle([{ text: 'Stelle im Fall', w: w1 }, { text: 'Hinweis auf …', w: w2 }, { text: 'Warum?', w: w3 }],
      dazu.map((t) => [t.t, kat[t.k], t.w]), { schrift: 18 }),
    B.zwischen('Diese Sätze gehören nicht dazu'),
    ...nicht.map((t) => P(B, `✗ ${t.t} – ${t.w}`, { spacing: { after: 30, line: 240 } }, { size: 19 })),
    B.zwischen('c) Experten-Check'),
    ...CHECK[X].map((q, j) => P(B, `**${j + 1}. ${q.richtig})** ${q.optionen[KLEIN.indexOf(q.richtig)]}`, { spacing: { after: 40, line: 252 } }, { size: 20 })),
    new Paragraph({ spacing: { before: 120, after: 0 }, children: B.runs(`**Weiter:** Füllen Sie jetzt gemeinsam **Spalte ${e.buchstabe}** der Vergleichstabelle auf Arbeitsblatt 1 aus.`) })
  ];
}

function loesungskarte(B, nr, titel, inhalt) {
  return [
    new Paragraph({ spacing: { after: 100 }, shading: { type: ShadingType.CLEAR, color: 'auto', fill: '548235' }, children: [B.emoji(' ✅ ', { size: 24 }), B.b(`Lösungskarte ${nr} · ${titel}`, { size: 25, color: 'FFFFFF' })] }),
    new Paragraph({ spacing: { after: 120, line: 264 }, children: B.runs('Vergleichen Sie mit Ihrer Lösung. Verbessern und ergänzen Sie mit einer **anderen Farbe**. Fragen? Melden Sie sich.') }),
    ...inhalt
  ];
}

function loesungskarten(B) {
  const sw = Math.round((BREITE_HOCH - 1700) / 3);
  const aufgabe = (nr) => {
    const a = T.AUFGABEN[nr];
    return [
      a.vorsatz ? new Paragraph({ spacing: { before: 160, after: 40, line: 252 }, keepNext: true, children: [B.i(a.vorsatz, { size: 20 })] }) : null,
      new Paragraph({ spacing: { before: a.vorsatz ? 0 : 160, after: 60, line: 252 }, keepNext: true, children: B.runs(`**${a.nr}**  ${a.text}`) }),
      loesungKasten(B, a.loesung, 'Musterlösung'),
      B.leer(100)
    ].filter(Boolean);
  };
  return [
    ...loesungskarte(B, 1, 'Vergleichstabelle (AA2 a)', [
      B.tabelle(
        [{ text: '', w: 1700 }, { text: 'A hypovolämisch', w: sw }, { text: 'B anaphylaktisch', w: sw }, { text: 'C neurogen', w: BREITE_HOCH - 1700 - 2 * sw }],
        [...T.VERGLEICH.map((z) => [{ text: `**${z[0]}**`, fill: F.LACHS }, z[1], z[2], z[3]]), [{ text: '**Gemeinsamkeit**', fill: F.LACHS }, { colSpan: 3, text: T.GEMEINSAMKEIT }]],
        { hoehe: 640, schrift: 20 }
      )
    ]),
    B.umbruch(),
    ...loesungskarte(B, 2, 'Schreibaufgaben 2.1 und 2.2 (AA2 c)', [...aufgabe('2.1'), ...aufgabe('2.2')]),
    B.umbruch(),
    ...loesungskarte(B, 3, 'Schreibaufgaben 3.1 und 3.2 (AA3 b)', [...aufgabe('3.1'), ...aufgabe('3.2')]),
    B.umbruch(),
    ...loesungskarte(B, 4, 'Wer hat recht? 4.1 (AA4 b)', [...aufgabe('4.1')])
  ];
}

// Loskarten zum Ausschneiden: je Person eine Karte mit Stammgruppe, Buchstabe und Expertenteam
function loskarten(B, klasse) {
  const karten = lose(klasse);
  const sp = 3, w = Math.floor(BREITE_HOCH / sp);
  const gestrichelt = { style: BorderStyle.DASHED, size: 6, color: '7F7F7F' };
  const zellen = karten.map((c) => B.zelle([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 }, children: [B.t(`${klasse.name} · Loskarte`, { size: 15, color: F.GRAU_T })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [B.b(`Stammgruppe ${c.stamm}`, { size: 30 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: B.runs(`Expertin/Experte **${c.x}** · ${FORM[c.x]}`, { size: 18 }) }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: B.runs(`Expertenteam **${c.team}**`, { size: 22 }) })
  ], w, { borders: { top: gestrichelt, bottom: gestrichelt, left: gestrichelt, right: gestrichelt }, verticalAlign: VerticalAlign.CENTER }));
  const reihen = [];
  for (let i = 0; i < zellen.length; i += sp) {
    const z = zellen.slice(i, i + sp);
    while (z.length < sp) z.push(B.zelle([new Paragraph({ children: [] })], w, { borders: { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand } }));
    reihen.push(new TableRow({ cantSplit: true, height: { value: 1450, rule: HeightRule.ATLEAST }, children: z }));
  }
  return [
    B.abschnitt(`Loskarten ${klasse.name} (${karten.length} Personen)`, { spacing: { before: 0, after: 100 } }),
    new Paragraph({ spacing: { after: 100 }, children: [bild(IC.schere, 0.6, 0.6), B.t('  '), ...B.runs(`Ausschneiden, mischen, ziehen lassen. ${klasse.stamm.length} Stammgruppen · Expertenteams ${teamsVon(klasse).join(', ')}.`, { size: 19 })] }),
    new Table({ width: { size: w * sp, type: WidthType.DXA }, columnWidths: Array(sp).fill(w), layout: TableLayoutType.FIXED, rows: reihen })
  ];
}

// Tischschilder: Expertenteams und Stammgruppen (für die größere Klasse; die kleinere braucht weniger)
function tischschilder(B) {
  const gross = KLASSEN[0];
  const schilder = [
    ...teamsVon(gross).map((t) => ({ oben: 'Expertenteam', gross: t, unten: FORM[t[0]] })),
    ...gross.stamm.map((_, i) => ({ oben: 'Stammgruppe', gross: String(i + 1), unten: 'A + B + C' }))
  ];
  const w = Math.floor(BREITE_HOCH / 2);
  const gestrichelt = { style: BorderStyle.DASHED, size: 6, color: '7F7F7F' };
  const zellen = schilder.map((s) => B.zelle([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.t(s.oben, { size: 28, color: F.GRAU_T })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.b(s.gross, { size: 110 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.t(s.unten, { size: 24 })] })
  ], w, { borders: { top: gestrichelt, bottom: gestrichelt, left: gestrichelt, right: gestrichelt }, verticalAlign: VerticalAlign.CENTER }));
  const reihen = [];
  for (let i = 0; i < zellen.length; i += 2) {
    const z = zellen.slice(i, i + 2);
    while (z.length < 2) z.push(B.zelle([new Paragraph({ children: [] })], w, { borders: { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand } }));
    reihen.push(new TableRow({ cantSplit: true, height: { value: 3000, rule: HeightRule.ATLEAST }, children: z }));
  }
  return [
    B.titel('Tischschilder'),
    new Paragraph({ spacing: { after: 100 }, children: [bild(IC.schere, 0.6, 0.6), B.t('  '), ...B.runs(`Ausschneiden und vor der Stunde auf die Tische stellen – erst die Expertenteams, nach dem Umsetzen die Stammgruppen (Schild umdrehen oder austauschen). Für ${KLASSEN[1].name} entfallen ${teamsVon(gross).filter((t) => !teamsVon(KLASSEN[1]).includes(t)).join(', ')} und Stammgruppe ${gross.stamm.length}.`, { size: 19 })] }),
    new Table({ width: { size: w * 2, type: WidthType.DXA }, columnWidths: [w, w], layout: TableLayoutType.FIXED, rows: reihen })
  ];
}

/* =====================================================================
   LEHRERVERSION
   ===================================================================== */
function verlaufsplan(B) {
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  push(
    B.titel('Schock ist nicht gleich Schock – analoge Fassung (ohne Handys und Beamer)'),
    new Paragraph({ spacing: { after: 80 }, children: [B.emoji('🎯 '), B.b('Lernziel: '), ...B.runs('Die Lernenden vergleichen die drei Schockformen und begründen Sofortmaßnahmen und Lagerung anhand des Leitsymptoms. Sie grenzen eigenverantwortliche von ärztlich angeordneten Maßnahmen ab und korrigieren typische Fehlvorstellungen (Schocklage bei Atemnot, Antihistaminikum statt Adrenalin).')] }),
    B.p('**Rahmen:** KB I · Woche 2 (SW 7) · 3 UE (135 min) · Leitfall „Frau Maler“ (11 Uhr, Kausalkette) · **ohne Smartphones und ohne Beamer:** Arbeitsblatt, Expertenblätter, Kontroll- und Lösungskarten, Tafel · inhaltlich wie die digitale Fassung: dieselben Fälle, Aufgaben, Lösungen und Merksätze, alle Aufgaben im KA-Format (2.1–5.2, Hausaufgabe) · KA-Bezug: KB 1, Aufg. 3.1–3.3 und 5.5'),
    B.p('**Was die App sonst übernimmt, übernimmt hier Papier:** Abstimmungen → Ankreuzen auf dem AB und Handzeichen · Fall markieren → Unterstreichen auf dem Expertenblatt · Rückmeldung am Handy → Kontrollkarte bzw. Auflösung im Plenum · Musterlösungen am Beamer → Lösungskarten je Stammgruppe · Gruppeneinteilung per Knopfdruck → Loskarten · Erklär-Uhr → Uhr/Kurzzeitwecker der Lehrkraft · Bewertungsraster und Selbstkontrolle am Handy → Korrekturbogen.'),
    B.p('**Kompetenzbezug:** Anlage 1 PflAPrV I.1.d, I.4.a, I.4.c, III.2.b · Landeslehrplan CE 06 „In Akutsituationen sicher handeln“ (1./2. AD: „Sofortmaßnahmen bei Schockzuständen“, „Verabreichung von Notfallmedikamenten nach ärztlicher Anordnung“, „Sofortmaßnahmen bei Verdacht auf … Lungenembolie“)')
  );
  const sp = [
    { text: 'Zeit', w: 900 }, { text: 'Phase', w: 1700 }, { text: 'Lehrerhandeln', w: 3500 }, { text: 'Schülerhandeln', w: 3100 },
    { text: 'Sozialform', w: 1250 }, { text: 'Material', w: 1500 }, { text: 'Didaktische Funktion', w: 0 }
  ];
  sp[6].w = BREITE_QUER - sp.slice(0, 6).reduce((s, x) => s + x.w, 0);
  const z = (zeit, phase, l, s, soz, mat, fkt) => [zeit, `**${phase}**`, l, s, soz, mat, fkt];
  const ueber = (text) => [{ colSpan: 7, text, fill: F.GRAU_HELL, o: { italics: true } }];
  const zeilen = [
    z('vor der Stunde', 'Vorbereitung', '**Tische** für die Expertenteams stellen und **Tischschilder** aufstellen. Auf jeden Expertentisch: Expertenblätter dieses Buchstabens (eins pro Person) und **eine Kontrollkarte umgedreht**. **Loskarten** mischen. Material nach Phasen stapeln: AB1 · Lösungskarten 1–4 (je ein Stapel, eine Karte pro Stammgruppe) · AB2 · AB3 · Korrekturbogen. **Tafel:** Leitfrage, Fahrplan, Strichliste E1–E4 (siehe Tafelbild). Uhr oder Kurzzeitwecker bereitlegen.', '–', '–', 'Tafel, Tischschilder, Loskarten, Stapel', 'Ablauf ohne Umbaupausen; jede Gruppe findet alles am Tisch'),
    z('0–12', 'Problemorientierter Einstieg: „Wie hätten Sie gehandelt?“', '**AB1 austeilen.** Fallauszug Frau Maler vorlesen (lassen), Leitfrage an der Tafel; Vermutung aus W1 kurz abrufen. Einstieg erklären („Falsch liegen ist erlaubt.“), 3 min ankreuzen lassen (Spalte „Anfang“). Dann **Notfall für Notfall per Handzeichen**: „Wer hat A? B? C?“ – Strichliste an der Tafel, **nicht auflösen**. **Murmeln** (1 min, Uhr), 2–3 Begründungen hören. Lernziel und Fahrplan an der Tafel.', 'Fall lesen; vier Notfälle ankreuzen (Vermutung, sicher?), auch zur Leitfrage (E4); per Handzeichen abstimmen; die Nachbarin oder den Nachbarn von der eigenen Wahl überzeugen.', 'EA → PA (Murmeln) → Plenum', 'AB1 (S. 1), Tafel', 'Vorwissen aktivieren, Vermutungen bilden, Fehlvorstellungen sichtbar machen; kognitiver Konflikt; die Vermutungen werden im Check-out überprüft (vorher/nachher). AFB I'),
    ueber('„Bei E… sind Sie geteilter Meinung – genau das klären wir heute. In Woche 1 haben Sie gesehen, wie der Körper einen Schock ausgleicht. Heute geht es um die Frage: Ist jeder Schock gleich – und muss ich deshalb immer gleich handeln? Am Ende der Stunde prüfen Sie Ihre Vermutungen.“'),
    z('12–31', 'Erarbeitung I: Expertenteams (AA1)', '**Loskarten ziehen lassen** (Buchstabe, Expertenteam, Stammgruppe auf S. 2 eintragen). Die SuS gehen an den Tisch ihres **Expertenteams** (Tischschild). Uhr starten (15 min), herumgehen: Wer liest noch, wer unterstreicht? Hinweis: Die **Kontrollkarte** erst umdrehen, wenn alle unterstrichen und angekreuzt haben. Teams melden sich mit Handzeichen, wenn ihre Spalte fertig ist – kurz drüberschauen (alle sechs Zeilen?). Zum Schluss **Merksatz AA1** gemeinsam lesen (1 min).', 'Infotext lesen (kurze Sätze, ohne Überschriften – selbst zuordnen); im Fall alle Hinweise unterstreichen (3 Ablenker); Experten-Check ankreuzen; mit der Kontrollkarte vergleichen und ergänzen; im Team die eigene Spalte der Vergleichstabelle ausfüllen; Merksatz AA1 mitlesen.', 'EA → GA (Expertenteam 3–4) → Plenum', 'Loskarten, Expertenblätter, Kontrollkarten, AB1 (S. 2)', 'Befunde im Fließtext identifizieren und Relevantes von Irrelevantem unterscheiden (KA 3.1); Informationen selbst den Tabellenzeilen zuordnen; die Kontrollkarte gibt sofort Rückmeldung wie sonst das Handy. AFB I–II'),
    z('31–48', 'Erarbeitung II: Stammgruppe (AA2 a)', '„**Umsetzen!**“ – an die Tische der Stammgruppen (Tischschilder 1–7). Erklär-Runde mit der Uhr: **A → B → C je 3 min**, Wechsel laut ansagen, dazu 2 min Gemeinsamkeit. Dann **Lösungskarte 1** je Stammgruppe austeilen (4 min vergleichen, mit anderer Farbe verbessern). Plenum (2 min), Kontrastfragen: „Warum ist der Puls bei Herrn Weber langsam?“ – „Warum ist seine Haut warm?“', 'Reihum erklären, die Spalten der anderen ausfüllen, Gemeinsamkeit formulieren; mit der Lösungskarte vergleichen und verbessern.', 'GA (Stammgruppe 3–4) → Plenum', 'AB1 (S. 2–3), Lösungskarte 1, Uhr', 'Vergleichen; Ergebnissicherung. AFB II'),
    z('48–64', 'Erarbeitung III: Schockform-Detektiv und Schreibaufgaben (AA2 b/c)', 'Detektiv erklären (Kasten „Warum brauche ich das?“ vorlesen), 4 min allein. **Auflösung im Plenum** Fall für Fall: „Welche Schockform? Welche zwei Befunde belegen sie?“ (Lösung unten). Dann 2.1/2.2 allein (6 min) – die drei Fälle stehen auf S. 4. **Lösungskarte 2** je Stammgruppe (3 min).', 'Detektiv allein (ankreuzen, unterstreichen), Lösung vortragen und begründen; 2.1 und 2.2 allein schreiben, mit der Lösungskarte vergleichen und verbessern.', 'EA → Plenum → EA → Vergleich in der GA', 'AB1 (S. 3–4), Lösungskarte 2', 'Aus Befunden auf die Schockform schließen; Pathophysiologie erläutern (KA 3.2), Unterschied neurogen (KA 5.5). AFB II'),
    ueber('„Sie wissen jetzt, wie sich die Schockformen unterscheiden. Aber wie lagern Sie? Aus dem Erste-Hilfe-Kurs kennen Sie: ‚Beine hoch.‘ Prüfen wir, ob das immer stimmt.“'),
    z('64–85', 'Erarbeitung IV: Lagerung nach Leitsymptom (AA3)', '**AB2 austeilen.** Impuls an der Tafel: „Bei einem Schock immer Beine hoch?“ – Meinungen sammeln (2 min). Die **vier Lagerungen** auf S. 5 gemeinsam lesen: Wann? Warum? So geht’s – gern von zwei SuS am Stuhl oder auf der Liege zeigen lassen (4 min). **Merksatz AA3** lesen (1 min). **Lagerungs-Quiz** allein ankreuzen (4 min), dann **Auflösung** Situation für Situation: „Was ist das Leitsymptom? Wie lagern Sie?“ (3 min, Lösung unten). 3.1/3.2 allein (5 min), **Lösungskarte 3** (2 min).', 'Lagerungen lesen und zeigen; Quiz: Leitsymptom erkennen, Lagerung ankreuzen, in der Auflösung begründen; Merksatz AA3 mitlesen; 3.1/3.2 allein, mit der Lösungskarte verbessern.', 'Plenum → EA → Plenum → EA → Vergleich', 'AB2 (S. 5–7), Lösungskarte 3', 'Fehlvorstellung „immer Beine hoch“ korrigieren; Lagerungsbegründung als K.-o.-Kriterium in KA 3.3; 3.2 übt das Korrigieren falscher Aussagen. AFB II'),
    ueber('Pause (falls im Stundenraster vorgesehen). – „Sie wissen jetzt, wie Sie lagern. Aber was dürfen Sie im Notfall selbst – und wofür brauchen Sie eine Anordnung?“'),
    z('85–99', 'Vertiefung: Wer darf was? (AA4)', 'a) 2 min ankreuzen lassen (die Tabelle auf dem AB hilft). **Auflösung Maßnahme für Maßnahme per Handzeichen** („Wer hat grün? gelb? rot?“), bei Uneinigkeit begründen lassen (4 min, Lösung unten). **Merksatz AA4** lesen (1 min). b) Dialog vorlesen lassen, **Think** 2,5 min, **Pair** 1,5 min (Uhr), dann **Lösungskarte 4** (2 min).', 'Ankreuzen und begründen; Merksatz AA4 mitlesen; Stellungnahme zu Herrn Brandt schreiben, zu zweit vergleichen, mit der Lösungskarte verbessern.', 'EA → Plenum → PA → Vergleich', 'AB2 (S. 7–8), Lösungskarte 4', 'Verantwortungsgrenzen (III.2.b; KA 3.3: „n. ä. A./SOP“); Fehlvorstellung „Antihistaminikum statt Adrenalin“ korrigieren (KA 3.3); Merksatz bündelt die Sofortmaßnahmen. AFB II–III'),
    ueber('„Jetzt wenden Sie alles an: ein neuer Fall – allein, nur mit den Merksätzen AA3 und AA4, mit Punkten.“'),
    z('99–113', 'Sicherung: Transferfall – Wissen anwenden (AA5)', '**AB3 austeilen.** Transferfall vorlesen (lassen), Uhr: **8 min** allein schreiben. Dann **Korrekturbogen** austeilen: Tausch mit einer Person aus einer **anderen Stammgruppe**, 5 min Raster abhaken und Punkte zählen (Musterlösung auf dem Bogen), Rückmeldesatz einfordern, Blätter zurückgeben.', 'Transferfall (5.1, 5.2) allein lösen; Lösung der Partnerin oder des Partners mit dem Raster bewerten und mit der Musterlösung vergleichen; Rückmeldung in einem Satz.', 'EA → PA', 'AB3 (S. 9), Korrekturbogen (S. 11)', 'Transfer auf einen neuen Fall im KA-Format (KA 3.3); Peer-Feedback nach Erwartungshorizont. AFB III'),
    z('113–119', 'Transfer: Zurück zu Frau Maler (AA6)', '**Kausalkette an der Tafel** entwickeln: vor jedem Glied fragen „Was kommt als Nächstes?“, dann anschreiben (Tafelbild rechts); zum Schluss die Antwort auf die Leitfrage gemeinsam formulieren.', 'Nächstes Glied vermuten, Kausalkette auf S. 1 ergänzen, Leitfrage beantworten.', 'Plenum', 'AB1 (S. 1), Tafel', 'Leitfall abschließen; Brücke zur Thromboseprophylaxe (1. AJ). AFB II–III'),
    z('119–127', 'Puffer (ca. 8 min)', 'Reserve für langsames Lesen und Schreiben und für das Vergleichen mit den Lösungskarten. Wird es knapp, siehe „Kürzen, wenn die Zeit knapp wird“. Bleibt Zeit: mit der Hausaufgabe beginnen.', '–', '–', '–', 'Zeitreserve, kein neuer Inhalt'),
    z('127–135', 'Abschlusssicherung: „Hätten Sie richtig gehandelt?“', '„Was haben wir heute gelernt?“ – die vier Punkte (siehe unten) kurz zusammenfassen. SuS kreuzen E1–E4 erneut an (Spalte **„Ende“**, 2 min). **Auflösung** Notfall für Notfall mit Erklärung (Lösung unten); Handzeichen: „Wer hat seine Meinung geändert?“ – v. a. bei E4 (Leitfrage). **Hausaufgabe** ansagen: S. 10, Selbstkontrolle mit der Rückseite des Korrekturbogens.', 'Dieselben Notfälle erneut entscheiden; mit der eigenen Vermutung vom Anfang vergleichen (vorher/nachher auf S. 1).', 'EA → Plenum', 'AB1 (S. 1), Tafel', 'Vermutungen überprüfen, Lernzuwachs sichtbar machen (vorher/nachher); Lernstandsdiagnose.')
  ];
  push(B.tabelle(sp, zeilen, { kopfFill: F.BLAU_D, kopfFarbe: 'FFFFFF', schrift: 17 }));
  return k;
}

function hinweise(B) {
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  const punkt = (text) => new Paragraph({ bullet: { level: 0 }, spacing: { after: 50, line: 252 }, children: B.runs(text, { size: 20 }) });
  const gross = KLASSEN[0], klein = KLASSEN[1];
  const anzahl = (kl, x) => lose(kl).filter((c) => c.x === x).length;
  const nTeams = (kl, x) => kl.teams[x];
  const personen = (kl) => kl.stamm.reduce((s, n) => s + n, 0);

  /* Tafelbild */
  push(
    B.abschnitt('Tafelbild (wächst mit der Stunde)'),
    B.tabelle([{ text: 'links: Leitfrage und Fahrplan', w: 4700 }, { text: 'Mitte: Einstieg und Check-out (Strichliste)', w: 4700 }, { text: 'rechts: AA6 · Kausalkette (am Ende)', w: BREITE_QUER - 9400 }], [[
      { absaetze: [
        P(B, `**Leitfrage:** ${T.LEITFRAGE}`, {}, { size: 19 }),
        P(B, `**Impuls:** ${folie('ziel').impuls}`, {}, { size: 19 }),
        P(B, '**Fahrplan:**', { spacing: { after: 20 } }, { size: 19 }),
        ...folie('ziel').plan.map((x) => P(B, `${x.emoji} ${x.text}`, { spacing: { after: 10, line: 240 } }, { size: 19 }))
      ] },
      { absaetze: [
        P(B, 'Zeilen E1–E4, Spalten **A · B · C**, je Anfang | Ende:', {}, { size: 19 }),
        P(B, 'E1  A ||||   B ||   C |||||||   →   Ende …', { spacing: { after: 20 } }, { size: 19, font: 'Consolas' }),
        P(B, 'Nicht auflösen! Erst im Check-out: Ende-Striche dazuschreiben und auflösen.', {}, { size: 19 }),
        P(B, '**Lagerung (AA3):** „Bei einem Schock immer Beine hoch?“ – Meinungen als Stichworte.', {}, { size: 19 })
      ] },
      { absaetze: [
        ...folie('aufloesung').kette.map((g, i) => P(B, `${i ? '↓ ' : ''}**${ohneTrenn(g.titel)}** – ${g.text}`, { spacing: { after: 20, line: 240 } }, { size: 19 })),
        P(B, `**Antwort:** ${folie('aufloesung').antwort}`, { spacing: { before: 60 } }, { size: 19 })
      ] }
    ]], { kopfFill: F.BLAU_HELL })
  );

  /* Material und Kopien */
  const z = (was, wofuer, a, b, wann) => [was, wofuer, { text: a, mitte: true }, { text: b, mitte: true }, wann];
  push(
    B.abschnitt('Material und Kopien'),
    B.tabelle([{ text: 'Material', w: 3300 }, { text: 'Inhalt', w: 3900 }, { text: gross.name, w: 1200 }, { text: klein.name, w: 1200 }, { text: 'Wann?', w: BREITE_QUER - 9600 }], [
      z('**AB1** (S. 1–4, 2 Blätter beidseitig, geheftet)', 'Einstieg, Kausalkette, Gruppenpuzzle, Vergleichstabelle, Detektiv, 2.1/2.2', String(personen(gross)), String(personen(klein)), 'zu Beginn'),
      z('**AB2** (S. 5–8, 2 Blätter beidseitig, geheftet)', 'Lagerung, Lagerungs-Quiz, 3.1/3.2, Wer darf was?, 4.1', String(personen(gross)), String(personen(klein)), 'vor AA3 (ca. Minute 64)'),
      z('**AB3** (S. 9–10, 1 Blatt beidseitig)', 'Transferfall 5.1/5.2, Hausaufgabe', String(personen(gross)), String(personen(klein)), 'vor AA5 (ca. Minute 99)'),
      z('**Korrekturbogen** (S. 11–12, 1 Blatt beidseitig)', 'Peer-Korrektur AA5 · Rückseite: Selbstkontrolle der Hausaufgabe', String(personen(gross)), String(personen(klein)), 'erst **nach** der Schreibzeit von AA5'),
      ...BUCHST.map((x) => z(`**Expertenblatt ${x}** (Anlagen)`, `Infotext, Fall zum Unterstreichen, Experten-Check · ${FORM[x]}`, String(anzahl(gross, x)), String(anzahl(klein, x)), 'vor der Stunde auf die Expertentische')),
      ...BUCHST.map((x) => z(`**Kontrollkarte ${x}** (Anlagen)`, 'Lösung zum Unterstreichen und zum Experten-Check', String(nTeams(gross, x)), String(nTeams(klein, x)), 'umgedreht auf die Expertentische')),
      z('**Lösungskarten 1–4** (Anlagen)', '1 Vergleichstabelle · 2 Aufgaben 2.1/2.2 · 3 Aufgaben 3.1/3.2 · 4 Aufgabe 4.1', `je ${gross.stamm.length}`, `je ${klein.stamm.length}`, 'je Stammgruppe nach der Aufgabe'),
      z('**Loskarten** (Anlagen)', 'Stammgruppe, Buchstabe, Expertenteam', '1 Satz', '1 Satz', 'zu Beginn von AA1 ziehen lassen'),
      z('**Tischschilder** (Anlagen)', 'Expertenteams und Stammgruppen', '1 Satz', '1 Satz', 'vor der Stunde aufstellen'),
      z('Tafel, Uhr oder Kurzzeitwecker, Kreide/Marker', 'Tafelbild, Erklär-Runde, Schreibzeiten', '', '', 'die ganze Stunde'),
      z('Bunte Stifte (bringen die SuS mit)', 'Unterstreichen, Verbessern mit anderer Farbe', '', '', '')
    ], { schrift: 18, kopfFill: F.BLAU_HELL })
  );

  push(
    B.abschnitt('Vorbereitung und Hinweise'),
    B.zwischen('Gruppeneinteilung mit Loskarten'),
    punkt(`Die Loskarten sind fertig eingeteilt wie die Einteilung am Beamer: Stammgruppen zu 3 (A, B, C); Vierergruppen mit doppeltem B (Anaphylaxie ist Klausurschwerpunkt). Expertenteams zu 3–4; zwei B-Expertinnen derselben Stammgruppe sind in verschiedenen Teams.`),
    punkt(`**${gross.name} (${personen(gross)} SuS):** ${gross.stamm.length} Stammgruppen · Expertenteams ${teamsVon(gross).join(', ')}. **${klein.name} (${personen(klein)} SuS):** ${klein.stamm.length} Stammgruppen · Expertenteams ${teamsVon(klein).join(', ')}.`),
    punkt('**Fehlen SuS:** pro fehlender Person eine Karte herausnehmen – zuerst die zweiten B-Karten der Vierergruppen (höchste Stammgruppe zuerst), dann ganze Stammgruppen von hinten. Bleibt eine Stammgruppe unvollständig, setzen sich ihre Mitglieder als vierte Person in eine andere Stammgruppe (ihr Buchstabe ist dort doppelt). **Kommt jemand später:** als zweite B-Person in ein B-Expertenteam und danach in eine Dreier-Stammgruppe.'),
    B.zwischen('Damit es für die Lehrkraft entspannt bleibt'),
    punkt('**Alles liegt bereit:** Expertenblätter und Kontrollkarten liegen vor der Stunde auf den Expertentischen; die Lösungskarten liegen als Stapel am Pult und werden pro Stammgruppe ausgeteilt, sobald die Gruppe fertig ist (Handzeichen).'),
    punkt('**Selbstkontrolle statt Nachkontrolle:** Die Kontrollkarten (AA1) und die Lösungskarten 1–4 geben den SuS die Rückmeldung, die sonst das Handy gibt. Die Lehrkraft geht herum und klärt Fragen. Aufgelöst im Plenum werden nur die kurzen Ankreuz-Übungen (Detektiv, Lagerungs-Quiz, Wer darf was?, Einstieg/Check-out) – die Lösungen stehen unten zum Vorlesen.'),
    punkt('**Ankreuzen statt Abstimmen:** Alle Abstimmungen stehen auf dem AB. Die Handzeichen danach machen Uneinigkeit sichtbar, ohne dass jemand bloßgestellt wird (wer unsicher ist, kreuzt „sicher“ einfach nicht an).'),
    punkt('**Merksätze:** stehen fertig auf dem AB (Schlüsselwörter fett) – kein Abschreiben. Gemeinsam lesen (vorlesen oder vorlesen lassen, je ca. 1 min). Merksatz AA3 steht **vor** dem Lagerungs-Quiz, weil er beim Lösen hilft.'),
    punkt('**Korrekturbogen erst nach der Schreibzeit von AA5 austeilen** – sonst sehen die SuS Raster und Musterlösung beim Schreiben. Die Rückseite enthält die Selbstkontrolle der Hausaufgabe: erst nach dem Schreiben lesen (wie sonst der QR-Code).'),
    B.zwischen('Kürzen, wenn die Zeit knapp wird'),
    punkt('Detektiv: nur Fall 1 und 3 auflösen · Lagerungs-Quiz: nur die Dilemma-Situation (Frau Yıldız) und Herrn Ivo besprechen · 3.2 als Hausaufgabe · AA4 b: Pair weglassen · Check-out: nur E1 und E4 auflösen. Nicht kürzen: die Schreibaufgaben 2.1, 3.1, 4.1, 5.1/5.2 – sie trainieren das KA-Format.'),
    B.zwischen('Inhaltliche Hinweise'),
    punkt(T.LV_HINWEISE.leitlinie),
    punkt(T.LV_HINWEISE.adrenalin),
    punkt(T.LV_HINWEISE.leitfall),
    punkt(T.LV_HINWEISE.uebungsfaelle),
    B.zwischen('Nicht enthalten (andere Kompetenzbereiche/Fächer)'),
    punkt(T.LV_HINWEISE.nichtEnthalten)
  );

  /* Lösungen für die Auflösung im Plenum */
  push(
    B.abschnitt('Lösungen für die Auflösung im Plenum'),
    B.zwischen('Einstieg und Check-out (AB S. 1) – auf Papier sind die Antworten anders sortiert als am Handy'),
    B.tabelle([{ text: 'Nr.', w: 700 }, { text: 'Richtig', w: 3300 }, { text: 'Erklärung', w: BREITE_QUER - 4000 }],
      EINSTIEG.map((e) => [e.nr, `**${e.richtig}** ${e.optionen.find((o) => o.b === e.richtig).t}`, e.erklaerung]), { schrift: 18 }),
    P(B, `**„Was haben wir heute gelernt?“** ${folie('checkout-intro').warum.join(' · ')}`, { spacing: { before: 80, after: 80 } }, { size: 19 }),
    B.zwischen('Schockform-Detektiv (AA2 b, AB S. 3)'),
    B.tabelle([{ text: 'Fall', w: 700 }, { text: 'Schockform', w: 1700 }, { text: 'Belege (zwei davon reichen)', w: 6000 }, { text: 'Erklärung', w: BREITE_QUER - 8400 }],
      I.detektiv.faelle.map((f, i) => [String(i + 1), `**${I.detektiv.formen.find((x) => x.kuerzel === f.form).text}**`, f.teile.filter((t) => typeof t !== 'string' && t.b === 'beleg').map((t) => t.t).join(' · '), f.erklaerung]), { schrift: 18 }),
    B.zwischen('Lagerungs-Quiz (AA3 a, AB S. 6)'),
    B.tabelle([{ text: 'Situation', w: 2600 }, { text: 'Lösung', w: 2600 }, { text: 'Warum?', w: BREITE_QUER - 5200 }],
      T.LAGERUNGSKARTEN.map((c, i) => [`**${i + 1} · ${c.titel}**${c.dilemma ? ' (Dilemma)' : ''}`, `**${c.loesung}**`, c.warum]), { schrift: 18 }),
    B.zwischen('Wer darf was? (AA4 a, AB S. 7)'),
    B.tabelle([{ text: 'Maßnahme', w: 4200 }, { text: 'Lösung', w: 2600 }, { text: 'Warum?', w: BREITE_QUER - 6800 }],
      folie('aa4a').massnahmen.map((m) => [m.text, `**${folie('aa4a').ecken[m.ecke].emoji} ${folie('aa4a').ecken[m.ecke].text}**`, m.warum]), { schrift: 18 }),
    B.zwischen('Quellen'),
    punkt(T.LV_HINWEISE.quellen)
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
const sektionHoch = (children, fussText = FUSS) => ({ properties: { page: SEITE_HOCH }, headers: { default: kopf(BREITE_HOCH) }, footers: { default: fuss(fussText) }, children: trenne(children) });

async function speichern(doc, name) {
  const buf = await Packer.toBuffer(doc);
  fs.mkdirSync(AUS, { recursive: true });
  fs.writeFileSync(path.join(AUS, name), buf);
  console.log('geschrieben:', path.join(AUS, name));
}

async function main() {
  const SV = bausteine({ lsg: false, breite: BREITE_HOCH });
  await speichern(new Document({ creator: 'KB I · 3BFP2', title: 'KB1 W2 Schockformen – Schülerversion (ohne Handys)', styles: STILE, sections: [sektionHoch(schueler(SV, { lsg: false }))] }), 'KB1_W2_Schockformen_analog_SV.docx');

  const AN = bausteine({ lsg: false, breite: BREITE_HOCH });
  const anlagen = [
    ...['a', 'b', 'c'].flatMap((x, i) => [...(i ? [AN.umbruch()] : []), ...expertenblatt(AN, x)]),
    ...['a', 'b', 'c'].flatMap((x) => [AN.umbruch(), ...kontrollkarte(AN, x)]),
    AN.umbruch(), ...loesungskarten(AN),
    ...KLASSEN.flatMap((kl) => [AN.umbruch(), ...loskarten(AN, kl)]),
    AN.umbruch(), ...tischschilder(AN)
  ];
  await speichern(new Document({ creator: 'KB I · 3BFP2', title: 'KB1 W2 Schockformen – Anlagen (ohne Handys)', styles: STILE, sections: [sektionHoch(anlagen)] }), 'KB1_W2_Schockformen_analog_Anlagen.docx');

  const LQ = bausteine({ lsg: true, breite: BREITE_QUER });
  const LH = bausteine({ lsg: true, breite: BREITE_HOCH });
  await speichern(new Document({
    creator: 'KB I · 3BFP2', title: 'KB1 W2 Schockformen – Lehrerversion mit Lösungen (ohne Handys)', styles: STILE,
    numbering: { config: [] },
    sections: [
      { properties: { page: SEITE_QUER }, headers: { default: kopf(BREITE_QUER) }, footers: { default: fuss(FUSS + ' · Lehrerversion (ohne Handys)') }, children: trenne([...verlaufsplan(LQ), ...hinweise(LQ)]) },
      sektionHoch(schueler(LH, { lsg: true }), FUSS + ' · Lehrerversion (ohne Handys)')
    ]
  }), 'KB1_W2_Schockformen_analog_LV_LSG.docx');
}

// Direkt aufgerufen: Dokumente bauen. Von analog/tests/analog.test.js geladen: nur die Daten der Papierfassung.
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
module.exports = { EINSTIEG, CHECK, KLASSEN, lose, teamsVon };

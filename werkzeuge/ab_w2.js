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
const { bausteine, kopf, fuss, bild, F, SEITE_HOCH, SEITE_QUER, STILE, WURZEL, rahmen, keinRand, ohneRaender, linie } = require('./ab_bausteine');
const T = require('./ab_w2_texte');
// Foliennummern für den Verlaufsplan direkt aus dem Foliensatz der App (docs/inhalte_stunde.js)
const STUNDE = (() => { const k = {}; require('vm').runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'docs', 'inhalte_stunde.js'), 'utf8') + ';this.S = STUNDE;', k); return k.S; })();
const FN = (id) => { const i = STUNDE.folien.findIndex((f) => f.id === id); if (i < 0) throw new Error('Folie fehlt: ' + id); return i + 1; };
const FOLIE = (id) => `**Folie ${FN(id)}:**`;
// Die drei Blätter werden nacheinander ausgeteilt: Überschrift wie auf der Folie „Sie erhalten jetzt Blatt …“
const BLATT = (nr) => { const f = STUNDE.folien.find((x) => x.typ === 'blatt' && x.nr === nr); if (!f) throw new Error('Blatt-Folie fehlt: ' + nr); return f; };
function blattKopf(B, nr, o = {}) {
  const f = BLATT(nr);
  return new Paragraph({
    keepNext: true, spacing: { before: 0, after: 100 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: '2E75B6' },
    children: [B.emoji(' 📄 ', { size: 24 }), B.b(`Blatt ${nr} von ${f.von} · ${f.ueberschrift}`, { size: 25, color: 'FFFFFF' })],
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

  /* ---------- Seite 1: Lernziel, Frau Maler, Leitfrage, Kausalkette (am Ende der Stunde), Einstieg ---------- */
  const kette = 'Immobilität → tiefe Beinvenenthrombose → Lungenembolie → obstruktiver Schock → Kreislaufstillstand';
  const luecke = '_'.repeat(12);
  push(
    blattKopf(B, 1),
    B.titel('Schock ist nicht gleich Schock – vergleichen und nach Leitsymptom handeln', lsg ? '[LSG]' : null),
    new Paragraph({ spacing: { after: 120, line: 264 }, children: [B.emoji('🎯 '), B.b('Lernziel: '), ...B.runs('Sie vergleichen den hypovolämischen, den anaphylaktischen und den neurogenen Schock und begründen Sofortmaßnahmen und Lagerung (Positionierung) anhand des Leitsymptoms. Sie unterscheiden, was Sie selbst tun dürfen und was nur nach ärztlicher Anordnung.')] }),
    new Paragraph({ spacing: { after: 140 }, children: [bild(IC.handy, 0.5, 0.5), B.t(' = am Smartphone (Stunden-App)      ', { size: 19 }), bild(IC.stift, 0.5, 0.5), B.t(' = auf Papier', { size: 19 })] }),
    B.kasten([
      B.p('Frau Maler (71) ist seit gestern neu im Pflegeheim. Vor drei Wochen bekam sie nach einem Oberschenkelhalsbruch eine Hüft-TEP. Seitdem liegt sie fast nur im Bett.'),
      B.p('Schülerin Christin berichtet: „Gegen elf Uhr war sie unruhig, atmete schnell und bekam schlecht Luft. Sie war blass und hatte kalten Schweiß auf der Stirn. Puls 118/min, Blutdruck 105/70 mmHg. Ich dachte, sie sei nur aufgeregt.“', { spacing: { after: 0, line: 264 } })
    ], { kopf: 'Fallbezug: „Reanimation – und nicht nur ich war hilflos“ (Auszug)', fill: 'FFFFFF', kopfFill: 'FFFFFF', rand: '000000' }),
    B.leer(100),
    B.leitfrage('Woher kommt Frau Malers Luftnot – und wie hätte man sie um 11 Uhr lagern müssen?'),
    B.aa([IC.lesen, IC.schreiben], 'AA6 · Am Ende der Stunde:', 'Ihre Lehrkraft deckt die **Kausalkette** am Beamer Schritt für Schritt auf. Ergänzen Sie die Lücken und beantworten Sie dann die Leitfrage.'),
    B.meta(`5 min · Plenum (Unterrichtsgespräch) · AFB II–III · Folie ${FN('aufloesung')} · die SuS tragen die Kette hier auf S. 1 ein`),
    (aktuellerTeil = 'Kausalkette', L([kette]), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 100 }, children: [B.b(lsg ? kette : `Immobilität → ${luecke} → ${luecke} → ${luecke} → Kreislaufstillstand`, { size: 21 })] })),
    (aktuellerTeil = 'Leitfrage', new Paragraph({ spacing: { before: 40, after: 0 }, keepNext: true, children: [B.b('Antwort auf die Leitfrage:')] })),
    B.linien(2, L(['Die Luftnot kommt von einer Lungenembolie: Ein Gerinnsel aus der Beinvene hat die Lungenstrombahn verlegt → obstruktiver Schock. Um 11 Uhr: Oberkörper hoch (Luftnot im Vordergrund), nicht mobilisieren, nicht allein lassen, sofort Hilfe holen und engmaschig überwachen.'])),
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
  const zeilenAA2 = sammle('vergleich', [
    ['Ursache', 'Blut- oder Flüssigkeitsverlust (Blutung, z. B. Magen-Darm-Blutung; Verbrennung; Durchfall, Erbrechen)', 'allergische Sofortreaktion auf Medikament, Insektengift oder Nahrungsmittel', 'Verletzung des Rückenmarks (meist Halswirbelsäule), z. B. Kopfsprung, Sturz aus der Höhe'],
    ['Entstehung (kurz)', 'Volumen ↓ → Rückstrom zum Herzen ↓ → Blutdruck ↓; Sympathikus gleicht aus: Puls ↑, Zentralisation', 'Histamin → Gefäße weit und durchlässig → relativer Volumenmangel → Blutdruck ↓; Bronchien eng', 'Sympathikus fällt aus → Gefäße weit, Blut versackt → Blutdruck ↓; keine Gegenregulation (Puls steigt nicht)'],
    ['Puls', 'schnell, schwach', 'schnell', 'langsam oder normal'],
    ['Haut', 'blass, kalt, schweißig (Zentralisation)', 'Juckreiz, Rötung, Quaddeln, Schwellungen (kann auch blass sein)', 'unterhalb der Verletzung warm, trocken, rosig'],
    ['weitere typische Zeichen', 'Durst, Unruhe, schnelle Atmung, wenig Urin; ggf. sichtbares Blut, Teerstuhl', 'Heiserkeit, Atemnot, Übelkeit, Erbrechen, Bauchkrämpfe, Schwindel', 'Lähmungen, Kribbeln, Taubheit, Nacken-/Rückenschmerz, flache Atmung, Auskühlung'],
    ['Darauf achte ich besonders', 'Blutungsquelle; Puls und Blutdruck im Verlauf (Schockindex); Bewusstsein; Urin', 'Atemwege und Atmung (Heiserkeit, SpO₂); Kreislauf; zweite Reaktion nach Stunden möglich', 'Atmung; Blutdruck und Puls; Temperatur; nicht bewegen']
  ]);
  push(
    B.leer(60),
    merk('Merksatz AA1', 'aa1'),
    new Paragraph({ spacing: { before: 160, after: 60 }, keepNext: true, children: B.runs('**Vergleichstabelle** – AA1 d): Ihre Spalte im Expertenteam · AA2 a): die anderen Spalten in der Stammgruppe') }),
    B.tabelle(
      [{ text: '', w: 1700 }, { text: 'A hypovolämisch', w: sw }, { text: 'B anaphylaktisch', w: sw }, { text: 'C neurogen', w: BREITE_HOCH - 1700 - 2 * sw }],
      [
        ...zeilenAA2.map((z) => [{ text: `**${z[0]}**`, fill: F.LACHS }, { lsg: z[1] }, { lsg: z[2] }, { lsg: z[3] }]),
        [{ text: '**Gemeinsamkeit**', fill: F.LACHS }, { colSpan: 3, lsg: sammle('gemeinsamkeit', 'Bei allen drei Formen fällt der Blutdruck, die Organe werden schlecht durchblutet → Sauerstoffmangel → Lebensgefahr. Anaphylaktischer und neurogener Schock sind distributive Schockformen: Die Gefäße sind weit gestellt (relativer Volumenmangel).') }]
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
    aufg([
      { nr: '2.1', text: 'Erläutern Sie, wie es bei Mia zum Schock kommt. Nutzen Sie die Vergleichstabelle (Seite 2, Spalte B, Zeile „Entstehung“). Nennen Sie dazu passende Befunde aus Mias Fall.', punkte: 3 },
      { nr: '2.2', text: 'Herr Albrecht hat einen schnellen Puls (116/min), Herr Weber einen langsamen Puls (52/min). Erklären Sie diesen Unterschied.', punkte: 2 }
    ]),
    zw('2.1'),
    B.linien(3, L(['Die Haselnuss (Allergen) löst eine allergische Sofortreaktion aus: Mastzellen setzen Histamin und weitere Botenstoffe frei.', 'Die Gefäße werden weit und durchlässig: Flüssigkeit tritt ins Gewebe (Quaddeln, Schwellung von Lippen und Lidern), im Gefäßsystem fehlt Volumen → der Blutdruck fällt (88/50 mmHg), das Herz gleicht mit 128/min aus.', 'Zusätzlich schwellen die Schleimhäute an (Heiserkeit) und die Bronchien verengen sich → Atemnot, Sauerstoffmangel (SpO₂ 93 %).', '(je schlüssiger Schritt 1 P.)'])),
    zw('2.2'),
    B.linien(3, L(['Herr Albrecht verliert Blut (Volumenmangel). Der Sympathikus wird aktiviert und steigert den Puls, um den Blutdruck zu halten (Ausgleich). (1 P.)', 'Bei Herrn Weber ist das Rückenmark verletzt, der Sympathikus fällt aus. Der Körper kann nicht gegensteuern: Der Puls steigt nicht, er ist sogar langsam. (1 P.)']))
  );

  /* ---------- AA3 ---------- */
  push(
    B.aa([IC.lesen], 'AA3: Begründen – Lagerung (Positionierung) nach Leitsymptom:', 'Schock → immer Beine hoch? Nein! Entscheidend ist das **Leitsymptom** – das Zeichen, das die Person gerade am meisten gefährdet.'),
    B.meta(`18 min (Impuls, vier Lagerungsfolien, Quiz, Merksatz, 3.1/3.2 mit Musterlösung) · Plenum → Einzelarbeit (Handy) → Einzelarbeit → Plenum · AFB II · KA-Bezug KB 1, Aufg. 3.3 · Folien ${FN('aa3-impuls')}–${FN('aa3b-loesung-32')}`)
  );
  const pw = Math.floor(BREITE_HOCH / 4);
  const pikto = sammle('pikto', [
    ['lagerung_oberkoerper_hoch.png', 'Oberkörper hoch (halbsitzend)', '**Wann?** Atemnot steht im Vordergrund.', '**Warum?** Die Atemhilfsmuskulatur kann besser arbeiten.'],
    ['lagerung_beine_hoch.png', 'Flach, Beine hoch (Schocklage)', '**Wann?** Schockzeichen ohne Atemnot.', '**Warum?** Blut aus den Beinen fließt zum Herzen. Nicht bei Atemnot oder Verletzungen an Beinen, Becken, Wirbelsäule.'],
    ['lagerung_seitenlage.png', 'Stabile Seitenlage', '**Wann?** Bewusstlos, Atmung normal.', '**Warum?** Die Atemwege bleiben frei, Erbrochenes kann abfließen.'],
    ['lagerung_nicht_bewegen.png', 'Nicht bewegen', '**Wann?** Verdacht auf Wirbelsäulenverletzung.', '**Warum?** Jede Bewegung kann das Rückenmark schädigen. Kopf mit beiden Händen halten.']
  ]);
  push(new Table({
    width: { size: pw * 4, type: WidthType.DXA }, columnWidths: [pw, pw, pw, pw], layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({ tableHeader: false, cantSplit: true, children: pikto.map((x) => B.zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [bild(x[0], 3.4, 1.91)] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [B.b(x[1], { size: 20 })] }), new Paragraph({ spacing: { after: 30 }, children: B.runs(x[2], { size: 18 }) }), new Paragraph({ spacing: { after: 0 }, children: B.runs(x[3], { size: 18 }) })], pw, { borders: rahmen(F.ORANGE_D, 6), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS } })) })
    ]
  }));
  push(
    new Paragraph({ spacing: { before: 60, after: 60 }, children: [B.emoji('⚠️ '), ...B.runs('**Bei Anaphylaxie:** nicht aufsetzen oder aufstehen lassen. **Atmet die Person nicht normal → Reanimation** (KB III).', { size: 19 })] }),
    lsg ? new Paragraph({ spacing: { after: 80 }, children: [B.i('Quelle: nach S2k-Leitlinie Akuttherapie und Management der Anaphylaxie (AWMF 061-025, 2021); sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] }) : null,
    teil([IC.handy], '**a) Lagerungs-Quiz** (allein am Handy):'),
    B.app([B.p('Was ist das **Leitsymptom**? Tippen Sie an, wie Sie lagern, und decken Sie auf. Hilfe: die **Bilder oben**.', { spacing: { after: 0, line: 264 } })]),
    B.leer(60),
    merk('Merksatz AA3', 'aa3'),
    teil([IC.schreiben], '**b) Schreibaufgaben:**'),
    aufg([
      { nr: '3.1', vorsatz: 'Frau Carla Yıldız (55) hat in der Radiologie Kontrastmittel erhalten. Sie ist heiser und atmet pfeifend mit 30 Atemzügen pro Minute. Ihr Blutdruck liegt bei 90/55 mmHg.', text: 'Begründen Sie, warum Sie Frau Yıldız trotz des niedrigen Blutdrucks mit erhöhtem Oberkörper lagern.', punkte: 2 },
      { nr: '3.2', text: 'Nehmen Sie Stellung zu der Aussage: „Bei einem Schock legt man immer die Beine hoch.“', punkte: 2 }
    ]),
    zw('3.1'),
    B.linien(3, L(['Bei Frau Yıldız steht die Atemnot im Vordergrund (Heiserkeit, pfeifende Atmung, 30/min). Mit erhöhtem Oberkörper kann sie die Atemhilfsmuskulatur einsetzen, die Bauchorgane drücken nicht gegen das Zwerchfell.', 'Flach mit Beinen hoch würde die Atemnot verstärken. Nicht aufsetzen oder aufstehen lassen, Kreislauf engmaschig überwachen. (je schlüssiges Argument 1 P.)'])),
    zw('3.2'),
    B.linien(3, L(['Die Aussage ist falsch. Die Schocklage hilft nur bei Schockzeichen ohne Atemnot, weil Blut aus den Beinen zum Herzen fließt.', 'Entscheidend ist das Leitsymptom: bei Atemnot Oberkörper hoch, bei Bewusstlosigkeit mit normaler Atmung stabile Seitenlage, bei Verdacht auf Wirbelsäulenverletzung nicht bewegen; bei Verletzungen an Beinen oder Becken keine Schocklage. (Beurteilung 1 P., Begründung mit Gegenbeispiel 1 P.)']))
  );

  /* ---------- Teil B · AA4 ---------- */
  push(
    B.abschnitt('Teil B · Anaphylaxie – wer darf was?'),
    B.aa([IC.beurteilen, IC.handy], 'AA4: Unterscheiden – Wer darf was?', '**a) Abstimmung am Handy:** Ihre Lehrkraft zeigt Maßnahmen am Beamer. Tippen Sie an, wer sie durchführen darf. **Begründen** Sie Ihre Wahl, wenn Sie aufgerufen werden. Tragen Sie jede Maßnahme nach der Lösung in die Tabelle ein.'),
    B.meta(`13 min (a mit Merksatz AA4 als Lesefolie, Blatt 3 austeilen, b mit Musterlösung) · Einzelarbeit (Abstimmung am Handy) → Plenum → Partnerarbeit → Plenum · AFB II–III · KA-Bezug KB 1, Aufg. 3.3 · Kompetenz III.2.b · Folien ${FN('aa4a')}–${FN('aa4b-loesung')}`)
  );
  const vw = Math.floor(BREITE_HOCH / 3);
  push(B.tabelle([{ text: '🟢 mache ich selbst (eigenverantwortlich)', w: vw }, { text: '🟡 nur nach ärztlicher Anordnung (n. ä. A.) oder SOP', w: vw }, { text: '🔴 ärztliche Aufgabe', w: BREITE_HOCH - 2 * vw }], sammle('werDarfWas', [[
    { lsg: 'Infusion stoppen, Zugang belassen; nach Leitsymptom lagern' },
    { lsg: 'Adrenalin i. m.; Sauerstoff; Antihistaminikum' },
    { lsg: 'Diagnose „anaphylaktischer Schock“ stellen' }
  ]]), { hoehe: 900, schrift: 19, kopfFill: F.LACHS_KOPF }));
  push(
    B.leer(80),
    B.kasten([
      pS('verantwortung', '**Selbst:** Gefahr erkennen, Hilfe holen, Allergen stoppen, lagern, überwachen, dokumentieren.'),
      pS('verantwortung', '**Nur n. ä. A. oder SOP:** Medikamente – auch Adrenalin –, Sauerstoff, Infusionen. **SOP** = schriftliche, ärztlich freigegebene Notfall-Anweisung.'),
      pS('verantwortung', '**Als Auszubildende/r:** unter Anleitung handeln und sofort eine Pflegefachperson holen.', { spacing: { after: 0 } })
    ], { kopf: 'Info: Verantwortung im Notfall' }),
    B.leer(100),
    merk('Merksatz AA4 – Sofortmaßnahmen bei Anaphylaxie', 'aa4'),
    blattKopf(B, 3, { pageBreakBefore: true }),
    teil([IC.beurteilen], '**AA4 b) Wer hat recht?** **Think** (2,5 Min.): allein schreiben. **Pair** (1,5 Min.): zu zweit vergleichen.'),
    pS('adrenalinText', '**Adrenalin i. m.** ist das Mittel der ersten Wahl: Es wirkt am schnellsten, stellt die Gefäße eng (Blutdruck ↑), lässt Schleimhäute abschwellen, weitet die Bronchien.', { spacing: { after: 40, line: 264 } }),
    pS('adrenalinText', '**Antihistaminika** und **Kortison** wirken langsamer und zu schwach – sie kommen erst **nach** Adrenalin.', { spacing: { after: 100, line: 264 } })
  );
  const dw = Math.floor(BREITE_HOCH / 2) - 100;
  const blase = (wer, text) => B.zelle([new Paragraph({ spacing: { after: 40 }, children: [B.b(wer, { size: 19 })] }), new Paragraph({ spacing: { after: 0 }, children: [B.i(text)] })], dw, { borders: rahmen(F.ORANGE_D, 6), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS_HELL } });
  push(
    new Table({ width: { size: dw * 2 + 200, type: WidthType.DXA }, columnWidths: [dw, 200, dw], layout: TableLayoutType.FIXED, rows: [new TableRow({ cantSplit: true, children: [
      blase('💬 Herr Brandt, Pflegefachkraft:', '„Geben Sie ihr erst mal das Antihistaminikum aus dem Notfallkoffer. Adrenalin ist mir zu heftig.“'),
      new TableCell({ width: { size: 200, type: WidthType.DXA }, borders: { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand }, children: [new Paragraph({ children: [] })] }),
      blase('💬 Lina, Auszubildende:', '„Aber in unserer Notfall-SOP steht Adrenalin ganz oben …“')
    ] })] }),
    aufg([{ nr: '4.1', text: 'Nehmen Sie Stellung zu der Aussage von Herrn Brandt.', punkte: 3 }]),
    B.linien(3, L(['Die Aussage ist fachlich falsch. Beim anaphylaktischen Schock ist Adrenalin i. m. das Mittel der ersten Wahl (nach SOP bzw. ärztlicher Anordnung): Es stellt die Gefäße eng und hebt den Blutdruck, lässt die Schleimhäute abschwellen, weitet die Bronchien und wirkt am schnellsten.', 'Ein Antihistaminikum blockiert nur Histamin, wirkt langsamer und hebt weder den Blutdruck noch weitet es die Bronchien. Es darf Adrenalin nicht verzögern und kann danach gegeben werden.', 'Lina sollte die SOP ansprechen und sofort das Notfallteam bzw. die Ärztin einbeziehen. (Beurteilung 1 P., je fachliches Argument 1 P., max. 3 P.)']))
  );

  /* ---------- AA5 Transferfall ---------- */
  push(
    B.aa([IC.schreiben], 'AA5: Transferfall – Wissen anwenden:', '**Allein** (8 Min.) – Hilfe: nur **Merksatz AA3 und AA4**. Dann Peer-Korrektur mit dem **Raster am Handy**.', { spacing: { before: 100, after: 60, line: 264 } }),
    B.meta('13 min (8 min schreiben, 4 min Peer-Korrektur) · Einzelarbeit → Peer-Korrektur mit App-Raster und Musterlösung am Beamer · AFB I–III · KA-Format (KB 1, Aufg. 3.3) · Examensvorbild: Mai 2024 Tag 3, Aufg. 8.2; Mai 2026 Tag 1, Aufg. 3.2'),
    B.kasten([
      pS('transferfall', 'Sie sind in der Tagespflege „Sonnenhof“ eingesetzt. Herr Klaus Martens (74) hat einen Diabetes mellitus Typ 2 und eine Herzinsuffizienz. Gegen 14:15 Uhr sitzt er mit anderen Gästen auf der Terrasse beim Kaffee. Plötzlich schreit er auf: Eine Wespe hat ihn in die Oberlippe gestochen.'),
      pS('transferfall', 'Nach etwa fünf Minuten ist seine Oberlippe stark geschwollen, am Hals bilden sich Quaddeln. Mit kloßiger Stimme sagt er: „Mir ist so eng im Hals.“ Beim Einatmen hören Sie ein pfeifendes Geräusch. Sie messen: Atemfrequenz 28/min, Puls 124/min, Blutdruck 92/60 mmHg (am Morgen: 150/85 mmHg). In der Tagespflege ist keine Ärztin anwesend. Ein Notfallset hat Herr Martens nicht dabei.', { spacing: { after: 0, line: 264 } })
    ], { kopf: 'Fallsituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    new Paragraph({ spacing: { before: 80, after: 60 }, children: [B.i('Pflegefachpersonen leiten in lebensbedrohlichen Situationen lebenserhaltende Sofortmaßnahmen ein.')] }),
    aufg([
      { nr: '5.1', text: 'Beschreiben Sie stichwortartig 5 Sofortmaßnahmen, die Sie bei Herrn Martens bis zum Eintreffen des Rettungsdienstes einleiten. Begründen Sie dabei die Positionierung von Herrn Martens.', punkte: 6 },
      { nr: '5.2', text: 'Kennzeichnen Sie in Ihrer Antwort zu 5.1 jede Maßnahme, die Sie nur nach ärztlicher Anordnung durchführen dürfen, mit „n. ä. A.“.', punkte: 1 }
    ]),
    (aktuellerTeil = '5.1 und 5.2', null),   // ohne Zwischenüberschrift: die Linien stehen direkt unter den Aufgaben
    B.linien(7, L([
      'z. B.: Hilfe holen: eine Kollegin setzt den Notruf 112 ab (Notärztin nötig); Herrn Martens nicht allein lassen.',
      'Oberkörper hoch (halbsitzend), weil Atemnot und Schwellung im Vordergrund stehen (Kloßgefühl, pfeifende Einatmung, 28/min): Die Atemhilfsmuskulatur kann arbeiten. Keine Schocklage – auch wegen der Herzinsuffizienz. Nicht aufstehen oder gehen lassen.',
      'Vitalzeichen engmaschig überwachen: Atmung, Puls, Blutdruck, Bewusstsein, wenn vorhanden SpO₂ (Schockindex 124 : 92 ≈ 1,3).',
      'Beengende Kleidung am Hals öffnen; Einstichstelle zusätzlich kühlen (Kühlpack in ein Tuch gewickelt).',
      'Nichts zu essen oder zu trinken geben (Schwellung, Aspirationsgefahr).',
      'Adrenalin i. m. (n. ä. A.) – gibt hier die Notärztin, da keine Anordnung und kein Notfallset vorliegen; Sauerstoff (n. ä. A.).',
      'Uhrzeit, Werte und Maßnahmen notieren; bei Bewusstlosigkeit mit normaler Atmung stabile Seitenlage, ohne normale Atmung Reanimation (KB III).',
      '5.1: je beschriebene Maßnahme 1 P. (max. 5), Begründung der Positionierung 1 P.; Schocklage trotz Atemnot oder Antihistaminikum statt Adrenalin wird nicht gewertet. 5.2: 1 P., wenn alle Medikamenten- und Sauerstoff-Maßnahmen mit „n. ä. A.“ gekennzeichnet sind.'
    ]))
  );

  /* ---------- Seite 6: Hausaufgabe ---------- */
  sammelnAn = false;   // Lösungen der Hausaufgabe gehören nicht auf die Nachlese-Seite (eigene Selbstkontrolle)
  push(
    B.abschnitt('Hausaufgabe · Ein neuer Fall (ca. 17 Minuten · 13 Punkte)', { pageBreakBefore: true }),
    B.p('Lesen Sie vorher die **Merksätze AA1, AA3 und AA4**. Dann schreiben Sie ohne Hilfsmittel.', { spacing: { after: 60, line: 252 } }),
    B.meta('ca. 17 min (1,3 min je Punkt wie im Examen) · Einzelarbeit zu Hause · AFB I–III · Examensformat: Ausgangssituation, Rahmensatz je Aufgabe, Situationswechsel im Aufgabenstamm (vgl. Mai 2024 Tag 1, 1.2; Mai 2024 Tag 3, 8.1–8.2; Mai 2026 Tag 1, 1.3)'),
    B.kasten([
      B.p('Sie sind Auszubildende bzw. Auszubildender in der Rehaklinik „Talblick“. Frau Sabine Lorenz (52) ist seit einer Woche nach einer Bandscheibenoperation bei Ihnen. In ihrem Allergiepass steht eine Fischallergie.'),
      B.p('Um 12:20 Uhr isst sie Gemüsecurry mit Fischsauce. Um 12:35 Uhr klingelt sie. Sie kratzt sich an den Händen und an der Kopfhaut, am Bauch sind Quaddeln. „Mir ist so schwindelig und übel.“ Sie ist blass und unruhig. Puls 124/min, Blutdruck 86/52 mmHg (am Morgen: Puls 72/min, Blutdruck 128/78 mmHg), Atemfrequenz 20/min, Sauerstoffsättigung 96 %. Ihre Stimme klingt normal, sie hat keine Atemnot. Die Stationsärztin ist im Haus; es gibt eine Notfall-SOP für allergische Notfälle.', { spacing: { after: 0, line: 264 } })
    ], { kopf: 'Ausgangssituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    new Paragraph({ spacing: { before: 120, after: 60 }, keepNext: true, children: [B.i('Pflegefachpersonen schätzen akute Situationen anhand von Beobachtungen und Messwerten ein.')] }),
    aufg([{ nr: '1.1', text: 'Begründen Sie anhand von 4 Symptomen aus der Situation, dass bei Frau Lorenz ein anaphylaktischer Schock vorliegt.', punkte: 4 }]),
    B.linien(3, L([
      'z. B. (je Symptom mit Zuordnung 1 P.): zeitlicher Zusammenhang – Beginn 15 Min. nach dem Essen mit Fischsauce bei bekannter Fischallergie · Haut – Juckreiz an Händen und Kopfhaut, Quaddeln am Bauch · Kreislauf – Puls 124/min, Blutdruckabfall von 128/78 auf 86/52 mmHg, Blässe, Schwindel · Magen-Darm – Übelkeit · Gehirn – Unruhe (Minderdurchblutung).',
      'Für die volle Punktzahl muss die Kreislaufbeteiligung genannt sein – ein Schock zeigt sich immer am Kreislauf.'
    ])),
    new Paragraph({ spacing: { before: 120, after: 60 }, keepNext: true, children: [B.i('Pflegefachpersonen leiten in lebensbedrohlichen Situationen Sofortmaßnahmen ein.')] }),
    aufg([
      { nr: '2.1', text: 'Beschreiben Sie stichwortartig 6 Sofortmaßnahmen, die Sie bei Frau Lorenz einleiten. Begründen Sie die Positionierung.', punkte: 7 },
      { nr: '2.2', vorsatz: 'Fünf Minuten später ist Frau Lorenz heiser und sagt: „Ich krieg so schlecht Luft.“ Die Sauerstoffsättigung sinkt auf 90 %.', text: 'Begründen Sie, wie Sie Frau Lorenz jetzt positionieren.', punkte: 2 }
    ]),
    B.linien(6, L([
      '2.1 z. B.: nicht weiteressen (Allergen stoppen) · Hilfe holen: Stationsärztin bzw. Notfallteam alarmieren, Frau Lorenz nicht allein lassen · flach lagern, Beine hoch, weil Kreislaufzeichen ohne Atemnot im Vordergrund stehen → mehr Blut zum Herzen; nicht aufsetzen oder aufstehen lassen · Adrenalin i. m. nach Notfall-SOP bzw. ärztlicher Anordnung vorbereiten/verabreichen (Außenseite Oberschenkel) · venösen Zugang und Volumengabe n. ä. A. vorbereiten · Sauerstoff n. ä. A./SOP · Vitalzeichen engmaschig (Puls, Blutdruck, Atmung, SpO₂, Bewusstsein) · Uhrzeit, Symptome und Maßnahmen dokumentieren.',
      '(je Maßnahme 1 P., max. 6 P.; Begründung der Positionierung 1 P.; Antihistaminikum statt Adrenalin wird nicht gewertet)',
      '2.2 Jetzt Oberkörper hoch (halbsitzend), weil die Atemnot im Vordergrund steht (Heiserkeit = Schleimhautschwellung, SpO₂ 90 %): Die Atemhilfsmuskulatur kann arbeiten. Trotzdem nicht auf die Bettkante setzen oder aufstehen lassen; Kreislauf weiter überwachen und die Ärztin über die Verschlechterung informieren. (Positionierung 1 P., Begründung 1 P.)'
    ])),
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
    z('76–89', `Vertiefung: Wer darf was? (AA4, Folien ${FN('aa4a')}–${FN('aa4b-loesung')})`, `${FOLIE('aa4a')} Jeder Klick zeigt die nächste Maßnahme; die SuS stimmen am Handy ab (🟢/🟡/🔴), der Beamer zeigt nur, wie viele schon abgestimmt haben. Der nächste Klick zeigt die Lösung mit der Verteilung der Stimmen und „Das hatten X von Y richtig!“, die Handys melden richtig/falsch zurück (6 Maßnahmen); bei vielen falschen Stimmen nachfragen und begründen lassen; nach jeder Lösung eintragen lassen. ${FOLIE('aa4-merksatz')} Merksatz AA4 gemeinsam lesen (Lesefolie) – er bündelt Tabelle und Info. ${FOLIE('blatt3')} **Blatt 3 austeilen.** ${FOLIE('aa4b')} Dialog und 4.1 zeigen, „Jetzt bearbeiten“: Think 2,5 min, Pair 1,5 min (Uhr). ${FOLIE('aa4b-loesung')} Musterlösung 4.1 aufdecken.`, 'Am Handy abstimmen, die Wahl begründen, jede Maßnahme in die Tabelle eintragen; Merksatz AA4 mitlesen; Stellungnahme zu Herrn Brandt schreiben, zu zweit vergleichen, mit der Musterlösung verbessern.', 'EA (Handy) → Plenum → PA → Plenum', 'Blatt 2 (S. 4), Blatt 3, Handy', 'Verantwortungsgrenzen (III.2.b; KA 3.3: „n. ä. A./SOP“); Fehlvorstellung „Antihistaminikum statt Adrenalin“ korrigieren (KA 3.3); Merksatz bündelt die Sofortmaßnahmen. AFB II–III'),
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
    punkt(`Kopien: AB (SV) für alle als **drei einzelne Blätter**, je beidseitig (Blatt 1 = S. 1–2, Blatt 2 = S. 3–4, Blatt 3 = S. 5–6), getrennt bereitlegen. Sie werden **nacheinander** ausgeteilt – jeweils mit einer Folie „Sie erhalten jetzt Blatt …“ (Folien ${FN('blatt1')}, ${FN('blatt2')} und ${FN('blatt3')}), die Überschrift und Aufgaben des Blattes zeigt. Die Expertenblätter (Anlagen) müssen **nicht** gedruckt werden – die SuS arbeiten am Handy; sie sind nur Reserve, falls Handys oder WLAN ausfallen.`),
    punkt('**Beamer:** **beamer.html** öffnen → „Neuen Raum starten“. Unten rechts **Weiter**, links **Zurück** (auch Pfeiltasten, Presenter); Menü ⚙ unten links: zu jeder Folie springen, Vollbild, Namen verbergen, Angemeldete verwalten, neuer Raum für die Parallelklasse. Die Handys wechseln automatisch mit; ein QR-Code unten auf jeder Folie lässt Nachzügler einsteigen. Probeansicht ohne Internet: beamer.html?demo=1.'),
    punkt(`**Nachlese-Seite** (QR-Code auf der letzten AB-Seite): alle Inhalte und Lösungen der Stunde zum Wiederholen. Sie ist gesperrt, solange irgendwo eine Beamer-Stunde läuft – bis Folie ${FN('ende')} erreicht ist oder 10 Minuten nach dem Schließen des Beamers.`),
    punkt('**Zeitplan und Puffer:** Für langsam lesende Klassen gerafft – 4 statt 6 Einstiegsnotfälle, kürzere Infotexte mit kurzen Sätzen, nur 3 Ablenker im Expertenfall, Detektiv mit 4 Fällen, Lagerungs-Quiz allein am Handy (keine Matten), kein Entscheidungsweg, kein Check-out und keine Zusatzaufgaben auf dem AB. Alle Aufgaben im KA-Format (2.1–5.2, Hausaufgabe) bleiben. Dadurch bleiben rund **18 Minuten Puffer** (107–125) für langsames Lesen und die Sicherungsfolien.'),
    punkt('**Merksätze:** Sie stehen fertig auf dem AB (Schlüsselwörter fett) – kein Abschreiben vom Handy, kein Wechsel zwischen Handy und Blatt. Die Merksatz-Folien sind **Lesefolien** (ca. 1 min): vorlesen oder vorlesen lassen; das spart gegenüber dem Lückentext rund 5 Minuten. Das Handy zeigt den Merksatz am Ende der Übung nur noch zur Bestätigung.'),
    punkt('**Sicherungsfolien:** Nach jeder Papieraufgabe eine Aufgabenfolie (erst erklären, dann „Jetzt bearbeiten“ – das startet die Uhr) und eine Musterlösung zum Aufdecken. Die Handys zeigen dazu passende Hinweise. Aufgedecktes bleibt aufgedeckt, auch nach dem Neuladen.'),
    punkt('Ohne WLAN oder Handys: Expertenblätter (Anlagen) drucken; Abstimmungen (Einstieg, „Wer darf was?“) per Handzeichen/Ampelkarten; Lagerungs-Situationen aus der Liste unten vorlesen; Merksätze und Musterlösungen aus dieser Lehrerversion vorlesen.'),
    punkt('Schutz gegen Durchklicken wie gewohnt: Am Handy erscheinen Merksatz bzw. „Geschafft!“ nur, wenn genug Aufgaben beim ersten Versuch richtig sind – sonst „Nicht einfach durchklicken“ (am Beamer sichtbar).'),
    B.zwischen('Inhaltliche Hinweise'),
    punkt('**Einstieg und Check-out („Wie hätten Sie gehandelt?“):** Sie zeigen die vier Notfälle nacheinander, die Klasse stimmt jeweils gleichzeitig am Handy ab – ohne Namen. Falsch liegen ist ausdrücklich erlaubt; die Sicherheit („sicher“ / „vermute nur“) macht Fehlvorstellungen sichtbar, die mit Überzeugung vertreten werden. Beim Einstieg zeigt „Ergebnisse anzeigen“ nur die Verteilung – nichts auflösen, auch nicht beim Murmeln. Im Check-out (nach der Folie „Was haben wir heute gelernt?“) dieselben Notfälle noch einmal, jetzt mit „Auflösung zeigen“: richtige Antwort, Erklärung und die Klasse am Anfang und jetzt nebeneinander. E4 ist die Leitfrage (Frau Maler um 11 Uhr); sie wird in AA6 geklärt (Kausalkette auf S. 1 des AB). Der Check-out steht nicht auf dem AB.'),
    punkt('Die Lagerungsempfehlungen folgen der S2k-Leitlinie Anaphylaxie (AWMF 061-025, 2021): symptomorientiert; Flachlagerung und Vermeiden abrupter Lageveränderungen (Aufsitzen, Aufstehen) als Grundstrategie; bei führender Atemnot (halb-)sitzend; bei eingeschränktem Bewusstsein und intaktem Kreislauf stabile Seitenlage; zur Kreislaufverbesserung Beine hoch.'),
    punkt('Adrenalin i. m. laut Leitlinie 0,15–0,6 mg in die Außenseite des Oberschenkels, Autoinjektoren 0,15/0,3/0,5 mg, Wiederholung nach ca. 5–10 min. Antihistaminika: langsamerer Wirkungseintritt, Wirkung auf Kreislauf und Bronchokonstriktion nicht belegt, lebensrettende Sofortmaßnahmen dürfen nicht verzögert werden. Glukokortikoide: untergeordnete Rolle in der Akutphase. Die KA-Lösung nennt „Erwachsene 0,5 mg“ – das liegt in diesem Bereich.'),
    punkt('Der Leitfall ist belastend (Christin, Reanimation). AA6 bleibt bewusst fachlich (Kausalkette, verpasste Chancen) und bewertet Christin nicht; Erleben, Hilflosigkeit und Verarbeitung sind Thema in KB II und KB V.'),
    punkt('Die Übungsfälle vermeiden bewusst die Personen und Auslöser der Klassenarbeit (Frau Sommer, Herr Brenner, Antibiotika-Kurzinfusion), damit die KA den Transfer prüft.'),
    B.zwischen('Nicht enthalten (andere Kompetenzbereiche/Fächer)'),
    punkt('KB II: psychologische Erste Hilfe, Beruhigen, Notfalleinwilligung, SPIKES/NURSE, SAfE · KB III: Reanimation, ABCDE-Schema, Notaufnahme/Triage, PTBS (nur Verweise) · KB IV: Delegationsrecht, Haftung, unterlassene Hilfeleistung, Ersthelferschutz, Patientenverfügung · KB V: eigene Überforderung · Deutsch: Notruf absetzen, SBAR · Pädiatrie (3. AJ): Anaphylaxie bei Kindern · Anatomie: Pathophysiologie der Lungenembolie (1. AJ, nur aktiviert).'),
    B.zwischen('„Wer darf was?“ (AA4a) – Lösung'),
    punkt('🟢 selbst: Infusion stoppen, Zugang belassen · nach Leitsymptom lagern'),
    punkt('🟡 n. ä. A./SOP: Adrenalin i. m. · Sauerstoff · Antihistaminikum'),
    punkt('🔴 ärztlich: Diagnose „anaphylaktischer Schock“ stellen'),
    B.zwischen('Lagerungs-Quiz (AA3 a) – zum Vorlesen ohne App')
  );
  push(B.tabelle([{ text: 'Karte', w: 2000 }, { text: 'Situation', w: 3900 }, { text: 'Lösung und Begründung', w: B.breite - 5900 }],
    T.LAGERUNGSKARTEN.map((c) => [`**${c.titel}**${c.dilemma ? ' (Dilemma)' : ''}`, c.text, `**${c.loesung}** – ${c.warum}`]), { schrift: 17 }));
  push(B.zwischen('Quellen'), punkt('S2k-Leitlinie Akuttherapie und Management der Anaphylaxie, AWMF 061-025, Update 2021 (Ring et al., Allergo J Int 2021;30:1–25) · MSD Manual Profi-Ausgabe: Schock · Landeslehrplan Berufsfachschule Pflege BW, CE 06 · BW-Abschlussprüfungen Mai 2023–Mai 2026 (Operatoren, Aufgabenformat)'));
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

// docs/inhalte_nachlesen.js: Lösungstexte aus dem Arbeitsblatt für die Nachlese-Seite der App
function nachleseSchreiben() {
  const daten = {
    experten: Object.fromEntries(['a', 'b', 'c'].map((k) => [k, { buchstabe: T.EXPERTEN[k].buchstabe, form: T.EXPERTEN[k].form, fall: T.EXPERTEN[k].fall }])),
    vergleich: N.vergleich, gemeinsamkeit: N.gemeinsamkeit,
    pikto: N.pikto.map((x) => ({ bild: x[0], titel: x[1], wann: x[2], warum: x[3] })),
    werDarfWas: N.werDarfWas[0].map((c) => c.lsg),
    verantwortung: N.verantwortung, adrenalinText: N.adrenalinText,
    transferfall: N.transferfall,
    aufgaben: N.aufgaben, loesungen: N.loesungen
  };
  const ziel = path.join(WURZEL, 'docs', 'inhalte_nachlesen.js');
  fs.writeFileSync(ziel, '/* Automatisch erzeugt von werkzeuge/ab_w2.js – bitte nicht von Hand ändern.\n' +
    '   Lösungstexte aus dem Arbeitsblatt für die Nachlese-Seite (w2-nachlesen.html). */\n' +
    'var NACHLESEN = ' + JSON.stringify(daten, null, 1) + ';\n');
  console.log('geschrieben:', ziel);
}

main().catch((e) => { console.error(e); process.exit(1); });

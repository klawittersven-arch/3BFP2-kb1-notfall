/* Erstellt die Unterlagen für KB I, Themenblock 2, Woche 2 (SW 7):
     arbeitsblatt/KB1_W2_Schockformen_SV.docx        Schülerversion (AB mit AA1–AA6, Check-out, Hausaufgabe)
     arbeitsblatt/KB1_W2_Schockformen_Anlagen.docx   Expertenblätter A/B/C, Schilder
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

const AUS = process.argv[2] || path.join(WURZEL, 'arbeitsblatt');
// Dateiname des QR-Codes: w2.html → qr_w2_stunde.png, w2-transfer.html → qr_w2_transfer.png
const QR = (seite) => {
  const zusatz = (seite.match(/\?[a-z]+=([a-z0-9]+)/) || [])[1];
  const name = seite.replace(/\.html.*$/, '');
  return path.join(WURZEL, 'qr', 'qr_w2_' + (name === 'w2' ? 'stunde' : name.replace(/^w2-/, '')) + (zusatz ? '_' + zusatz : '') + '.png');
};
const FUSS = 'KB I · Woche 2 · Schock ist nicht gleich Schock';
const BREITE_HOCH = 11906 - 2 * 1417;   // 9072
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

  /* ---------- Kopf ---------- */
  push(
    B.titel('Schock ist nicht gleich Schock – vergleichen und nach Leitsymptom handeln', lsg ? '[LSG]' : null),
    new Paragraph({ spacing: { after: 120, line: 264 }, children: [B.emoji('🎯 '), B.b('Lernziel: '), ...B.runs('Sie vergleichen den hypovolämischen, den anaphylaktischen und den neurogenen Schock und begründen Sofortmaßnahmen und Lagerung (Positionierung) anhand des Leitsymptoms. Sie grenzen eigenverantwortliche von ärztlich angeordneten Maßnahmen ab und korrigieren typische Fehlvorstellungen.')] }),
    new Paragraph({ spacing: { after: 140 }, children: [bild(IC.handy, 0.5, 0.5), B.t(' = am Smartphone (Stunden-App)      ', { size: 19 }), bild(IC.stift, 0.5, 0.5), B.t(' = auf Papier', { size: 19 })] }),
    B.kasten([
      B.p('Frau Maler, 71 Jahre, ist seit gestern neu im Pflegeheim. Vor drei Wochen erhielt sie nach einer Schenkelhalsfraktur eine Hüft-TEP. Seit der Entlassung liegt sie die meiste Zeit im Bett.'),
      B.p('Schülerin Christin berichtet: „Gegen elf Uhr wirkte sie unruhig, atmete schnell und sagte, sie bekomme schlecht Luft. Sie war blass, hatte kalten Schweiß auf der Stirn, ihr Puls lag bei 118/min und der Blutdruck bei 105/70 mmHg. Ich dachte, sie sei nur aufgeregt, weil alles neu für sie ist.“'),
      new Paragraph({ spacing: { after: 0, line: 264 }, children: [...B.runs('Aus Woche 1 wissen Sie: Frau Maler war um 11 Uhr im kompensierten Schock (Schockindex ≈ 1,1). Offen blieb, woher die Luftnot kommt. **Meine Vermutung zur Schockform (AA3a, Woche 1):** '), lsg ? B.loes('offen – wird in AA7 geklärt (obstruktiver Schock durch Lungenembolie)') : B.t('_'.repeat(30))] })
    ], { kopf: 'Fallbezug: „Reanimation – und nicht nur ich war hilflos“ (Auszug)', fill: 'FFFFFF', kopfFill: 'FFFFFF', rand: '000000' }),
    B.leer(120),
    B.leitfrage('Woher kommt Frau Malers Luftnot – und wie hätte man sie um 11 Uhr lagern müssen?'),
    B.leer(120)
  );

  /* ---------- Einstieg ---------- */
  push(
    handy(T.SEITEN.stunde, [
      B.p('**So läuft die Stunde:** Scannen Sie den QR-Code **am Beamer** und geben Sie Ihren Vornamen ein. Ihr Handy wechselt dann **automatisch mit dem Beamer** – Sie müssen nichts weiter aufrufen.'),
      B.p('Nur falls das nicht klappt: diesen QR-Code scannen und zusätzlich den **Raumcode vom Beamer** eingeben.')
    ]),
    B.leer(100),
    B.aa([IC.handy], 'Einstieg: Wie hätten Sie gehandelt? – Ihre Vermutungen, bitte!', ''),
    B.meta('8 min · Einzelarbeit → Murmeln (PA) → Plenum · AFB I · Ich-kann-Liste W2 Nr. 4 · Vorwissen aktivieren, Vermutungen bilden, Fehlvorstellungen sichtbar machen; im Check-out werden die Vermutungen überprüft (vorher/nachher)'),
    B.app([
      B.p('Sechs kurze Notfälle – der letzte ist Frau Maler um 11 Uhr: Wie würden Sie handeln? Tippen Sie Ihre Vermutung an und geben Sie an, ob Sie sich sicher sind oder nur vermuten.'),
      B.p('**Falsch liegen ist jetzt ausdrücklich erlaubt:** Genau diese Entscheidungen lernen Sie heute. Am Ende der Stunde stimmen Sie noch einmal ab und prüfen: Hätte ich richtig gehandelt?'),
      B.p('**Murmeln (1 Minute):** Am Beamer sehen Sie, wie die Klasse vermutet – ohne Namen. Wo die Klasse am meisten uneinig ist, überzeugen Sie Ihre Nachbarin oder Ihren Nachbarn: Warum würden Sie so handeln? Aufgelöst wird noch nicht.')
    ])
  );
  if (lsg) {
    push(B.tabelle([{ text: 'Nr.', w: 700 }, { text: 'Richtig', w: 1500 }, { text: 'Begründung', w: BREITE_HOCH - 2200 }],
      T.ENTSCHEIDUNG.map((e) => [e.nr, { lsg: e.optionen.find((o) => o.startsWith(e.richtig)) }, { lsg: e.erklaerung }]), { schrift: 19 }));
    push(B.meta('Ablauf: Abstimmen (ca. 4 min) → am Beamer die Frage mit der größten Uneinigkeit anklicken (groß) und „Murmeln“ einblenden (1 min) → 2–3 Begründungen hören, nicht auflösen. Impuls: „Bei E… sind Sie geteilter Meinung – genau das klären wir heute. Am Ende prüfen Sie Ihre Vermutungen.“ E6 ist die Leitfrage; sie wird in AA7 geklärt.'));
  }

  /* ---------- Teil A ---------- */
  push(
    B.abschnitt('Teil A · Drei Wege in den Schock (Gruppenpuzzle)'),
    B.p('Das Gruppenpuzzle hat **zwei Runden**. Ihre Lehrkraft teilt die Gruppen am Beamer zufällig ein – **wer mit wem** arbeitet, zeigt Ihr Handy. Expertinnen und Experten gibt es für **A** (hypovolämischer Schock), **B** (anaphylaktischer Schock) und **C** (neurogener Schock).'),
    puzzleGrafik(B),
    new Paragraph({ spacing: { before: 120, after: 100 }, children: [B.b('Ich bin Expertin/Experte für:  '), B.t('☐ A   ☐ B   ☐ C    '), B.b('Expertenteam: '), B.t('_'.repeat(5) + '   '), B.b('Stammgruppe: '), B.t('_'.repeat(8))] }),
    B.aa([IC.lesen, IC.markieren], 'AA1: Identifizieren – Expertenteam:', '🚶 Setzen Sie sich mit Ihrem **Expertenteam** zusammen – die Namen stehen auf Ihrem Handy. Ihr Handy führt Sie durch die Schritte: **a)** Fall markieren, dann den **Merksatz AA1** (unten) ergänzen. **b)** Klausuraufgabe **1.1** allein bearbeiten. **c)** Infotext lesen (Handy; auf Papier freiwillig am Pult). **d)** Experten-Check am Handy. **e)** Gemeinsam **Ihre Spalte** der Vergleichstabelle ausfüllen und am Handy „Unsere Spalte ist fertig“ tippen.'),
    B.meta(`15 min · Einzelarbeit → Gruppenarbeit (Expertenteam, 3–4) · AFB I–II · Ich-kann-Liste W2 Nr. 1 · KA-Bezug KB 1, Aufg. 3.1 (1.1 wörtlich) · Folie ${FN('aa1')} zeigt am Beamer, welche Teams fertig sind`),
  );
  const sw = Math.round((BREITE_HOCH - 1700) / 3);
  const zeilenAA2 = sammle('vergleich', [
    ['Ursache', 'Blut- oder Flüssigkeitsverlust (Blutung, z. B. Magen-Darm-Blutung; Verbrennung; Durchfall, Erbrechen)', 'allergische Sofortreaktion auf Medikament, Insektengift oder Nahrungsmittel', 'Verletzung des Rückenmarks (meist Halswirbelsäule), z. B. Kopfsprung, Sturz aus der Höhe'],
    ['Entstehung (kurz)', 'Volumen ↓ → Rückstrom zum Herzen ↓ → Schlagvolumen ↓ → Blutdruck ↓', 'Histamin → Gefäße weit und durchlässig → relativer Volumenmangel → Blutdruck ↓; Bronchien eng', 'Sympathikus fällt aus → Gefäße weit, Blut versackt → Blutdruck ↓; keine Gegenregulation'],
    ['Puls', 'schnell, schwach', 'schnell', 'langsam oder normal'],
    ['Haut', 'blass, kalt, schweißig (Zentralisation)', 'Juckreiz, Rötung, Quaddeln, Schwellungen (kann auch blass sein)', 'unterhalb der Verletzung warm, trocken, rosig'],
    ['weitere typische Zeichen', 'Durst, Unruhe, schnelle Atmung, wenig Urin; ggf. sichtbares Blut, Teerstuhl', 'Heiserkeit, Atemnot, Übelkeit, Erbrechen, Bauchkrämpfe, Schwindel', 'Lähmungen, Kribbeln, Taubheit, Nacken-/Rückenschmerz, flache Atmung, Auskühlung'],
    ['Darauf achte ich besonders', 'Blutungsquelle; Puls und Blutdruck im Verlauf (Schockindex); Bewusstsein; Urin', 'Atemwege und Atmung (Heiserkeit, SpO₂); Kreislauf; zweite Reaktion nach Stunden möglich', 'Atmung; Blutdruck und Puls; Temperatur; nicht bewegen']
  ]);
  push(
    B.leer(60),
    merk('Merksatz AA1', 'aa1'),
    B.leer(60),
    aufg([{ nr: '1.1', text: 'Begründen Sie anhand von 4 Symptomen aus Ihrem Expertenfall (am Handy: A Herr Albrecht · B Mia · C Herr Weber), dass bei der Person ein hypovolämischer, anaphylaktischer bzw. neurogener Schock vorliegt.', punkte: 4 }]),
    new Paragraph({ spacing: { before: 40, after: 40 }, children: [B.i('Tipp wie in der Klassenarbeit: Ordnen Sie jedes Symptom zu (z. B. Kreislauf, Haut, Atemwege) und erklären Sie kurz, was es zeigt. Ohne Kreislaufzeichen gibt es nicht die volle Punktzahl.', { size: 18 })] }),
    (aktuellerTeil = '1.1', B.linien(8, L(['A) Herr Albrecht: ' + T.EXPERTEN.a.nennen.join(' · '), 'B) Mia: ' + T.EXPERTEN.b.nennen.join(' · '), 'C) Herr Weber: ' + T.EXPERTEN.c.nennen.join(' · '), '(je Symptom mit Zuordnung 1 P.; Werte nur mit Vorwert-Vergleich voll werten; für die volle Punktzahl muss die Kreislaufbeteiligung genannt sein – vgl. Erwartungshorizont KA, Aufg. 3.1)'])))
  );
  push(B.umbruch(), new Paragraph({ spacing: { before: 0, after: 60 }, children: B.runs('**Vergleichstabelle** – AA1 e): Ihre Spalte im Expertenteam · AA2 a): die anderen Spalten in der Stammgruppe') }));
  push(B.tabelle(
    [{ text: '', w: 1700 }, { text: 'A hypovolämisch', w: sw }, { text: 'B anaphylaktisch', w: sw }, { text: 'C neurogen', w: BREITE_HOCH - 1700 - 2 * sw }],
    [
      ...zeilenAA2.map((z) => [{ text: `**${z[0]}**`, fill: F.LACHS }, { lsg: z[1] }, { lsg: z[2] }, { lsg: z[3] }]),
      [{ text: '**Gemeinsamkeit**', fill: F.LACHS }, { colSpan: 3, lsg: sammle('gemeinsamkeit', 'Bei allen drei Formen fällt der Blutdruck, die Organe werden schlecht durchblutet → Sauerstoffmangel → Lebensgefahr. Anaphylaktischer und neurogener Schock sind distributive Schockformen: Die Gefäße sind weit gestellt (relativer Volumenmangel).') }]
    ],
    { hoehe: 640, schrift: 19 }
  ));
  push(
    B.leer(120),
    B.aa([IC.schreiben], 'AA2: Vergleichen – Stammgruppe:', '**a)** 🚶 **Umsetzen!** Setzen Sie sich mit Ihrer **Stammgruppe** an einen Tisch – die Namen zeigt Ihr Handy. Erklären Sie reihum **A → B → C** (je 3 Minuten, die Uhr läuft am Beamer). Die anderen füllen ihre Spalten der Vergleichstabelle aus. Zum Schluss gemeinsam: die Gemeinsamkeit. Dann am Handy: „Unsere Tabelle ist vollständig“. Danach sichern wir die Tabelle gemeinsam am Beamer.'),
    B.meta(`30 min (a–c mit Sicherung am Beamer) · Gruppenarbeit (Stammgruppe 3–4) → Plenum → Einzelarbeit · AFB II · Ich-kann-Liste W2 Nr. 1 · KA-Bezug KB 1, Aufg. 3.2 und 5.5 · Folien ${FN('aa2a')}–${FN('aa2c-loesung')}`),
    teil([IC.handy], '**b) Schockform-Detektiv:**'),
    B.app([
      B.p('Bestimmen Sie bei sechs kurzen Fällen die **Schockform** und tippen Sie die **zwei Befunde** an, die sie belegen – dann „Prüfen“. Zum Schluss vergleichen Sie **zwei Patienten**: Woran unterscheiden Sie die Schockformen am sichersten?'),
      B.p('**Am Ende:** Ergänzen Sie den Merksatz.')
    ]),
    B.leer(80),
    merk('Merksatz AA2', 'aa2'),
    teil([IC.schreiben], '**c) Klausurtraining:** Bearbeiten Sie die Aufgaben allein. Die Fälle von Mia, Herrn Weber und Herrn Albrecht können Sie dabei auf dem Handy nachlesen. Danach vergleichen wir mit der Musterlösung am Beamer.'),
    aufg([
      { nr: '2.1', text: 'Erläutern Sie, wie es bei Mia zum Schock kommt.\nTipp: Denken Sie in einer Pfeilkette – Auslöser → Botenstoff → Gefäße → Blutdruck; die Atemwege extra.'.split('\n').join(' – '), punkte: 3 },
      { nr: '2.2', text: 'Nennen Sie 1 Befund, der bei Herrn Weber anders ist als bei Herrn Albrecht. Begründen Sie den Unterschied.', punkte: 2 }
    ]),
    zw('2.1'),
    B.linien(4, L(['Die Haselnuss (Allergen) löst eine allergische Sofortreaktion aus: Mastzellen setzen Histamin und weitere Botenstoffe frei.', 'Die Gefäße werden weit und durchlässig: Flüssigkeit tritt ins Gewebe (Quaddeln, Schwellung von Lippen und Lidern), im Gefäßsystem fehlt Volumen → der Blutdruck fällt (88/50 mmHg), das Herz gleicht mit 128/min aus.', 'Zusätzlich schwellen die Schleimhäute an (Heiserkeit) und die Bronchien verengen sich → Atemnot, Sauerstoffmangel (SpO₂ 93 %).', '(je schlüssiger Schritt 1 P.)'])),
    zw('2.2'),
    B.linien(3, L(['Befund: Herr Weber hat einen langsamen Puls (52/min), Herr Albrecht einen schnellen (116/min). – oder: Herr Webers Haut ist warm, trocken, rosig, Herrn Albrechts Haut blass, kalt, schweißig.', 'Begründung: Bei Herrn Weber ist das Rückenmark verletzt, der Sympathikus fällt aus. Der Körper kann nicht gegenregulieren: kein Pulsanstieg, keine Zentralisation. (Befund 1 P., Begründung 1 P.)']))
  );

  /* ---------- AA3 ---------- */
  push(
    B.aa([IC.lesen], 'AA3: Begründen – Lagerung (Positionierung) nach Leitsymptom:', 'Aus dem Erste-Hilfe-Kurs kennen viele: Schock → Beine hoch. Das stimmt nicht immer. Entscheidend ist das **Leitsymptom** – das Zeichen, das die Person gerade am meisten gefährdet.'),
    B.meta(`23 min (Impuls, vier Lagerungsfolien, Parcours, Merksatz, b und c mit Musterlösung) · Plenum → Partnerarbeit (Yogamatte) → Einzelarbeit → Plenum · AFB II · Ich-kann-Liste W2 Nr. 2 und 4 · KA-Bezug KB 1, Aufg. 3.3 · Folien ${FN('aa3-impuls')}–${FN('aa3c-loesung')}`)
  );
  const pw = Math.floor(BREITE_HOCH / 4);
  const pikto = sammle('pikto', [
    ['lagerung_oberkoerper_hoch.png', 'Oberkörper hoch (halbsitzend)', '**Wann?** Atemnot steht im Vordergrund.', '**Warum?** Die Atemhilfsmuskulatur kann besser arbeiten, die Bauchorgane drücken nicht gegen das Zwerchfell.'],
    ['lagerung_beine_hoch.png', 'Flach, Beine hoch (Schocklage)', '**Wann?** Schockzeichen ohne Atemnot.', '**Warum?** Blut aus den Beinen fließt zum Körperstamm, das Herz bekommt mehr Blut. Nicht bei Atemnot und nicht bei Verletzungen an Beinen, Becken oder Wirbelsäule.'],
    ['lagerung_seitenlage.png', 'Stabile Seitenlage', '**Wann?** Bewusstlos, Atmung normal.', '**Warum?** Die Atemwege bleiben frei, Erbrochenes kann abfließen. Nach einem Unfall nur achsengerecht drehen.'],
    ['lagerung_nicht_bewegen.png', 'Nicht bewegen', '**Wann?** Verdacht auf Wirbelsäulenverletzung.', '**Warum?** Jede Bewegung kann das Rückenmark weiter schädigen. Kopf mit beiden Händen halten (Woche 4).']
  ]);
  push(new Table({
    width: { size: pw * 4, type: WidthType.DXA }, columnWidths: [pw, pw, pw, pw], layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({ tableHeader: false, cantSplit: true, children: pikto.map((x) => B.zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [bild(x[0], 3.9, 2.19)] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [B.b(x[1], { size: 20 })] }), new Paragraph({ spacing: { after: 30 }, children: B.runs(x[2], { size: 18 }) }), new Paragraph({ spacing: { after: 0 }, children: B.runs(x[3], { size: 18 }) })], pw, { borders: rahmen(F.ORANGE_D, 6), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS } })) })
    ]
  }));
  push(
    new Paragraph({ spacing: { before: 60, after: 60 }, children: [B.emoji('⚠️ '), ...B.runs('**Bei Anaphylaxie:** nicht aufsitzen, aufstehen oder gehen lassen – das Blut kann „versacken“, ein Kreislaufstillstand droht. **Atmet die Person nicht normal → Reanimation** (KB III).', { size: 19 })] }),
    new Paragraph({ spacing: { after: 80 }, children: [B.i('Quelle: nach S2k-Leitlinie Akuttherapie und Management der Anaphylaxie (AWMF 061-025, 2021); Ich-kann-Liste KB I; sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] }),
    teil([IC.handy], '**a) Lagerungsparcours** (Partnerarbeit auf der Yogamatte):'),
    B.app([
      B.p('Die App zieht eine Situationskarte. **Person A lagert Person B** innerhalb von 60 Sekunden und begründet: „Ich lagere …, weil …“. Dann tippen Sie auf **Aufdecken** und vergleichen. Wechseln Sie nach jeder Karte die Rollen. Hilfe: die **Bilder oben** – Ihr Handy zeigt sie auch.'),
      B.p('Sicherheit: behutsam lagern, nicht heben. Wer nicht gelagert werden möchte, übernimmt die Begründung. **Am Ende:** Ergänzen Sie den Merksatz.')
    ]),
    B.leer(80),
    merk('Merksatz AA3', 'aa3'),
    teil([IC.schreiben], '**b) Entscheidungsweg:** Ergänzen Sie, wie Sie lagern. Prüfen Sie die Fragen **von oben nach unten** – die erste Frage, die Sie mit „Ja“ beantworten, entscheidet.')
  );
  const wegW = [5600, BREITE_HOCH - 5600];
  push(B.tabelle([{ text: 'Frage', w: wegW[0] }, { text: '„Ja“ → so handle bzw. lagere ich', w: wegW[1] }], sammle('weg', [
    ['1. Atmet die Person **nicht normal**?', { lsg: 'Reanimation beginnen (KB III)' }],
    ['2. Ist sie **bewusstlos**, atmet aber normal?', { lsg: 'stabile Seitenlage (nach Unfall achsengerecht)' }],
    ['3. Gibt es Hinweise auf eine **Wirbelsäulenverletzung**?', { lsg: 'nicht bewegen, Kopf mit beiden Händen halten' }],
    ['4. Steht **Atemnot** im Vordergrund?', { lsg: 'Oberkörper hoch (halbsitzend)' }],
    ['5. **Schockzeichen** ohne Atemnot?', { lsg: 'flach, Beine hoch' }]
  ]), { hoehe: 420, schrift: 20 }));
  push(
    teil([IC.schreiben], '**c) Klausurtraining:**'),
    aufg([
      { nr: '3.1', vorsatz: 'Frau Carla Yıldız (55) hat in der Radiologie Kontrastmittel erhalten. Sie ist heiser und atmet pfeifend mit 30 Atemzügen pro Minute. Ihr Blutdruck liegt bei 90/55 mmHg.', text: 'Begründen Sie, warum Sie Frau Yıldız trotz des niedrigen Blutdrucks mit erhöhtem Oberkörper lagern.', punkte: 2 },
      { nr: '3.2', text: 'Nehmen Sie Stellung zu der Aussage: „Bei einem Schock legt man immer die Beine hoch.“', punkte: 2 }
    ]),
    zw('3.1'),
    B.linien(3, L(['Bei Frau Yıldız steht die Atemnot im Vordergrund (Heiserkeit, pfeifende Atmung, 30/min). Mit erhöhtem Oberkörper kann sie die Atemhilfsmuskulatur einsetzen, die Bauchorgane drücken nicht gegen das Zwerchfell.', 'Flach mit Beinen hoch würde die Atemnot verstärken. Nicht aufsetzen oder aufstehen lassen, Kreislauf engmaschig überwachen. (je schlüssiges Argument 1 P.)'])),
    zw('3.2'),
    B.linien(3, L(['Die Aussage ist falsch. Die Schocklage hilft nur bei Schockzeichen ohne Atemnot, weil Blut aus den Beinen zum Herzen fließt.', 'Entscheidend ist das Leitsymptom: bei Atemnot Oberkörper hoch, bei Bewusstlosigkeit mit normaler Atmung stabile Seitenlage, bei Verdacht auf Wirbelsäulenverletzung nicht bewegen; bei Verletzungen an Beinen oder Becken keine Schocklage. (Beurteilung 1 P., Begründung mit Gegenbeispiel 1 P.)']))
  );

  /* ---------- Teil B ---------- */
  push(B.abschnitt('Teil B · Anaphylaxie – wer darf was?'));

  /* ---------- AA4 ---------- */
  push(
    B.aa([IC.beurteilen], 'AA4: Unterscheiden – Wer darf was?', '**a) Aufstellung:** Ihre Lehrkraft zeigt Maßnahmen am Beamer. Stellen Sie sich in die passende Ecke des Raums und **begründen** Sie Ihre Wahl. Tragen Sie jede Maßnahme nach der Auflösung in die Tabelle ein.'),
    B.meta(`14 min (a, b mit Musterlösung, Merksatz) · Plenum (Aufstellung) → Einzelarbeit → Partnerarbeit → Plenum · AFB II–III · Ich-kann-Liste W2 Nr. 3 und 4 · KA-Bezug KB 1, Aufg. 3.3 · Kompetenz III.2.b · Folien ${FN('aa4a')}–${FN('aa4-merksatz')}`),
    B.kasten([B.p('Infusion stoppen, Zugang belassen · Adrenalin i. m. geben · nach Leitsymptom lagern · Sauerstoff geben · Antihistaminikum geben · Diagnose „anaphylaktischer Schock“ stellen', { spacing: { after: 0, line: 276 } })], { kopf: 'Wortspeicher', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R })
  );
  const vw = Math.floor(BREITE_HOCH / 3);
  push(B.tabelle([{ text: '🟢 mache ich selbst (eigenverantwortlich)', w: vw }, { text: '🟡 nur nach ärztlicher Anordnung (n. ä. A.) oder SOP', w: vw }, { text: '🔴 ärztliche Aufgabe', w: BREITE_HOCH - 2 * vw }], sammle('werDarfWas', [[
    { lsg: 'Infusion stoppen, Zugang belassen; nach Leitsymptom lagern' },
    { lsg: 'Adrenalin i. m.; Sauerstoff; Antihistaminikum' },
    { lsg: 'Diagnose „anaphylaktischer Schock“ stellen' }
  ]]), { hoehe: 1200, schrift: 19, kopfFill: F.LACHS_KOPF }));
  push(
    B.leer(80),
    B.kasten([
      new Paragraph({ spacing: { after: 60, line: 264 }, children: [B.i('„[Pflegefachpersonen] treffen in lebensbedrohlichen Situationen erforderliche Interventionsentscheidungen und leiten lebenserhaltende Sofortmaßnahmen bis zum Eintreffen der Ärztin oder des Arztes ein.“'), B.t(' (PflAPrV, Anlage 1, I.4.a; vgl. § 5 PflBG)', { size: 18 })] }),
      pS('verantwortung', '**Eigenverantwortlich:** Gefahr erkennen, Hilfe holen, Allergen stoppen, lagern, überwachen, dokumentieren.'),
      pS('verantwortung', '**Nur nach ärztlicher Anordnung (n. ä. A.) oder SOP:** Medikamente – auch Adrenalin –, Sauerstoff und Infusionen. Eine **Notfall-SOP** ist eine schriftliche, ärztlich freigegebene Handlungsanweisung der Einrichtung für eine bestimmte Notfallsituation. Pflegende „wirken … an der Durchführung ärztlich veranlasster Maßnahmen … mit“ (III.2.b).'),
      pS('verantwortung', '**Als Auszubildende/r:** unter Anleitung handeln, sofort eine Pflegefachperson holen, die eigenen Grenzen kennen.', { spacing: { after: 0 } })
    ], { kopf: 'Informationstext: Verantwortung im Notfall' }),
    teil([IC.beurteilen], '**b) Adrenalin oder Antihistaminikum?** Lesen Sie den Informationstext und den Dialog.')
  );
  const aw = [3900, BREITE_HOCH - 3900];
  push(
    B.tabelle([{ text: 'Problem bei der Anaphylaxie', w: aw[0] }, { text: 'Wirkung von Adrenalin', w: aw[1] }], sammle('adrenalin', [
      ['Gefäße weit → Blutdruck fällt', 'Gefäße eng → Blutdruck steigt'],
      ['Schleimhäute geschwollen (Kehlkopf, Lippen)', 'Schleimhäute schwellen ab'],
      ['Bronchien eng → Atemnot', 'Bronchien weit'],
      ['Herz muss mehr leisten', 'Herz schlägt kräftiger'],
      ['Mastzellen setzen weiter Histamin frei', 'weniger Histamin wird freigesetzt']
    ]), { schrift: 19 }),
    pS('adrenalinText', 'Adrenalin wirkt von allen Notfallmedikamenten bei Anaphylaxie **am schnellsten**. Erwachsene erhalten 0,3–0,5 mg in den Muskel an der **Außenseite des Oberschenkels** (auch als Fertigspritze, sog. Autoinjektor); nach 5–10 Minuten kann die Gabe wiederholt werden. **Antihistaminika** blockieren nur die Histamin-Wirkung, wirken langsamer und haben keine belegte Wirkung auf Kreislauf und Bronchien. **Glukokortikoide** (Kortison) wirken erst nach Stunden. Beide kommen erst **nach** Adrenalin – sie ersetzen es nicht.', { spacing: { before: 80, after: 40, line: 264 } }),
    new Paragraph({ spacing: { after: 100 }, children: [B.i('Quelle: nach S2k-Leitlinie Akuttherapie und Management der Anaphylaxie (AWMF 061-025, 2021); sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] })
  );
  const dw = Math.floor(BREITE_HOCH / 2) - 100;
  const blase = (wer, text) => B.zelle([new Paragraph({ spacing: { after: 40 }, children: [B.b(wer, { size: 19 })] }), new Paragraph({ spacing: { after: 0 }, children: [B.i(text)] })], dw, { borders: rahmen(F.ORANGE_D, 6), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS_HELL } });
  push(
    new Table({ width: { size: dw * 2 + 200, type: WidthType.DXA }, columnWidths: [dw, 200, dw], layout: TableLayoutType.FIXED, rows: [new TableRow({ cantSplit: true, children: [
      blase('💬 Herr Brandt, Pflegefachkraft:', '„Geben Sie ihr erst mal das Antihistaminikum aus dem Notfallkoffer. Adrenalin ist mir zu heftig.“'),
      new TableCell({ width: { size: 200, type: WidthType.DXA }, borders: { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand }, children: [new Paragraph({ children: [] })] }),
      blase('💬 Lina, Auszubildende:', '„Aber in unserer Notfall-SOP steht Adrenalin ganz oben …“')
    ] })] }),
    B.p('**Think** (2,5 Min.): Wer hat recht? Schreiben Sie Ihre Stellungnahme zu 4.1 allein. **Pair** (1,5 Min.): Vergleichen und ergänzen Sie zu zweit. Danach vergleichen wir mit der Musterlösung am Beamer.', { spacing: { before: 100, after: 80 } }),
    aufg([{ nr: '4.1', text: 'Nehmen Sie Stellung zu der Aussage von Herrn Brandt.', punkte: 3 }]),
    B.linien(4, L(['Die Aussage ist fachlich falsch. Beim anaphylaktischen Schock ist Adrenalin i. m. das Mittel der ersten Wahl (nach SOP bzw. ärztlicher Anordnung): Es stellt die Gefäße eng und hebt den Blutdruck, lässt die Schleimhäute abschwellen, weitet die Bronchien und wirkt am schnellsten.', 'Ein Antihistaminikum blockiert nur Histamin, wirkt langsamer und hebt weder den Blutdruck noch weitet es die Bronchien. Es darf Adrenalin nicht verzögern und kann danach gegeben werden.', 'Lina sollte die SOP ansprechen und sofort das Notfallteam bzw. die Ärztin einbeziehen. (Beurteilung 1 P., je fachliches Argument 1 P., max. 3 P.)'])),
    B.p('**Zum Schluss:** Ergänzen Sie den Merksatz AA4 – danach decken wir ihn gemeinsam am Beamer auf.', { spacing: { before: 120, after: 60 }, keepNext: true }),
    merk('Merksatz AA4', 'aa4')
  );

  /* ---------- AA5 Klausurtraining ---------- */
  push(
    B.abschnitt('Klausurtraining: Sofortmaßnahmen ableiten und begründen'),
    B.aa([IC.schreiben], 'AA5: Klausurtraining – Transferfall:', 'Lösen Sie die Aufgaben **allein und ohne Unterlagen** (ca. 6 Minuten). Tauschen Sie dann mit einer Person aus einer **anderen** Stammgruppe. Bewerten Sie deren Lösung mit dem **Bewertungsraster in der App** – die Musterlösung steht dabei am Beamer – und geben Sie eine Rückmeldung in einem Satz.'),
    B.meta('11 min · Einzelarbeit → Peer-Korrektur mit App-Raster und Musterlösung am Beamer · AFB I–III · KA-Format (KB 1, Aufg. 3.3) · Examensvorbild: Mai 2024 Tag 3, Aufg. 8.2; Mai 2026 Tag 1, Aufg. 3.2'),
    B.kasten([
      pS('transferfall', 'Sie sind in der Tagespflege „Sonnenhof“ eingesetzt. Herr Klaus Martens (74) hat einen Diabetes mellitus Typ 2 und eine Herzinsuffizienz. Gegen 14:15 Uhr sitzt er mit anderen Gästen auf der Terrasse beim Kaffee. Plötzlich schreit er auf: Eine Wespe hat ihn in die Oberlippe gestochen.'),
      pS('transferfall', 'Nach etwa fünf Minuten ist seine Oberlippe stark geschwollen, am Hals bilden sich Quaddeln. Mit kloßiger Stimme sagt er: „Mir ist so eng im Hals.“ Beim Einatmen hören Sie ein pfeifendes Geräusch. Sie messen: Atemfrequenz 28/min, Puls 124/min, Blutdruck 92/60 mmHg (am Morgen: 150/85 mmHg). In der Tagespflege ist keine Ärztin anwesend. Ein Notfallset hat Herr Martens nicht dabei.', { spacing: { after: 0, line: 264 } })
    ], { kopf: 'Fallsituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    B.leer(80),
    new Paragraph({ spacing: { after: 60 }, children: [B.i('Pflegefachpersonen treffen in lebensbedrohlichen Situationen erforderliche Interventionsentscheidungen und leiten lebenserhaltende Sofortmaßnahmen ein.')] }),
    aufg([
      { nr: '5.1', text: 'Beschreiben Sie stichwortartig 5 Sofortmaßnahmen, die Sie bei Herrn Martens bis zum Eintreffen des Rettungsdienstes einleiten. Begründen Sie dabei die Positionierung von Herrn Martens.', punkte: 6 },
      { nr: '5.2', text: 'Kennzeichnen Sie in Ihrer Antwort zu 5.1 jede Maßnahme, die Sie nur nach ärztlicher Anordnung durchführen dürfen, mit „n. ä. A.“.', punkte: 1 }
    ]),
    zw('5.1 und 5.2'),
    B.linien(8, L([
      'z. B.: Hilfe holen: eine Kollegin setzt den Notruf 112 ab (Notärztin nötig); Herrn Martens nicht allein lassen.',
      'Oberkörper hoch (halbsitzend), weil Atemnot und Schwellung im Vordergrund stehen (Kloßgefühl, pfeifende Einatmung, 28/min): Die Atemhilfsmuskulatur kann arbeiten. Keine Schocklage – auch wegen der Herzinsuffizienz. Nicht aufstehen oder gehen lassen.',
      'Vitalzeichen engmaschig überwachen: Atmung, Puls, Blutdruck, Bewusstsein, wenn vorhanden SpO₂ (Schockindex 124 : 92 ≈ 1,3).',
      'Beengende Kleidung am Hals öffnen; Einstichstelle zusätzlich kühlen (Kühlpack in ein Tuch gewickelt).',
      'Nichts zu essen oder zu trinken geben (Schwellung, Aspirationsgefahr).',
      'Adrenalin i. m. (n. ä. A.) – gibt hier die Notärztin, da keine Anordnung und kein Notfallset vorliegen; Sauerstoff (n. ä. A.).',
      'Uhrzeit, Werte und Maßnahmen notieren; bei Bewusstlosigkeit mit normaler Atmung stabile Seitenlage, ohne normale Atmung Reanimation (KB III).',
      '5.1: je beschriebene Maßnahme 1 P. (max. 5), Begründung der Positionierung 1 P.; Schocklage trotz Atemnot oder Antihistaminikum statt Adrenalin wird nicht gewertet. 5.2: 1 P., wenn alle Medikamenten- und Sauerstoff-Maßnahmen mit „n. ä. A.“ gekennzeichnet sind.'
    ])),
    B.app([B.p('**Peer-Korrektur:** Das Bewertungsraster erscheint auf Ihrem Handy. Haken Sie ab, was Ihre Partnerin oder Ihr Partner geschrieben hat. Die App zählt die Punkte – wie im Erwartungshorizont der Klassenarbeit. Die Musterlösung steht dabei am Beamer.')]),
    B.punktezeile(7)
  );

  /* ---------- AA6 ---------- */
  const kette = 'Immobilität → tiefe Beinvenenthrombose → Lungenembolie → obstruktiver Schock → Kreislaufstillstand';
  const luecke = '_'.repeat(12);
  push(
    B.abschnitt('Teil C · Zurück zu Frau Maler'),
    B.aa([IC.lesen, IC.schreiben], 'AA6: Erklären – Woher kam Frau Malers Luftnot?', 'Ihre Lehrkraft deckt die **Kausalkette** am Beamer Schritt für Schritt auf. Überlegen Sie vorher jeweils: Was kommt als Nächstes? **Ergänzen Sie die Kette** und beantworten Sie die Leitfrage. **Tipp:** Erinnern Sie sich an die Thromboseprophylaxe aus dem 1. Ausbildungsjahr.'),
    B.meta(`5 min · Plenum (Unterrichtsgespräch) · AFB II–III · Ich-kann-Liste W2 Nr. 5 · Brücke zu Woche 7 (Thrombose) · Folie ${FN('aufloesung')}`),
    (aktuellerTeil = 'Kausalkette', L([kette]), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 120 }, children: [B.b(lsg ? kette : `Immobilität → ${luecke} → ${luecke} → ${luecke} → Kreislaufstillstand`, { size: 22 })] })),
    (aktuellerTeil = 'Leitfrage', new Paragraph({ spacing: { before: 120, after: 60 }, children: [B.b('Antwort auf die Leitfrage: '), B.i('Woher kommt Frau Malers Luftnot – und wie hätte man sie um 11 Uhr lagern müssen?')] })),
    B.linien(3, L(['Die Luftnot kommt von einer Lungenembolie: Ein Gerinnsel aus der Beinvene hat die Lungenstrombahn verlegt → obstruktiver Schock. Um 11 Uhr: Oberkörper hoch (Luftnot im Vordergrund), nicht mobilisieren, nicht allein lassen, sofort Hilfe holen und engmaschig überwachen.']))
  );
  push(
    teil([IC.schreiben], '**Freiwillig zu Hause – Klausurtraining** (die Lösung finden Sie nach der Stunde in der Nachlese):'),
    new Paragraph({ spacing: { after: 60 }, children: [B.i('Frau Maler zeigte bereits Stunden vor dem Kreislaufstillstand Warnzeichen.')] }),
    aufg([
      { nr: '6.1', text: 'Erläutern Sie in Bezug auf die Situation von Frau Maler, wie es von ihrer Immobilität bis zum Kreislaufstillstand kommen konnte.', punkte: 5 },
      { nr: '6.2', text: 'Beschreiben Sie 3 Maßnahmen, die um 11 Uhr hätten eingeleitet werden müssen. Begründen Sie die Positionierung von Frau Maler.', punkte: 4 }
    ]),
    zw('6.1'),
    B.linien(5, L([
      'Nach der Hüft-TEP liegt Frau Maler aus Angst vor einer Luxation fast nur im Bett (Immobilität) → das Blut fließt in den Beinvenen langsamer und gerinnt nach der Operation leichter → tiefe Beinvenenthrombose (rechte Wade dick, schmerzt beim Auftreten) – trotz Heparin.',
      'Ein Teil des Gerinnsels löst sich (möglicherweise beim Aufsetzen an der Bettkante) und wird über das rechte Herz in die Lungenarterie geschwemmt → Lungenembolie: Das Blut kann nicht mehr ungehindert durch die Lunge fließen.',
      'Das linke Herz bekommt zu wenig Blut, das Herzzeitvolumen sinkt → obstruktiver Schock (11 Uhr: Luftnot, Puls 118/min, Blässe, kalter Schweiß, Unruhe; Schockindex ≈ 1,1).',
      'Ohne Behandlung dekompensiert der Kreislauf → Kreislaufstillstand (Mittag: Zyanose, kein Puls). (je schlüssiges Glied mit Fallbezug 1 P., max. 5 P.)'
    ])),
    zw('6.2'),
    B.linien(4, L([
      'z. B.: Sofort eine Pflegefachkraft holen bzw. Ärztin oder Notruf – Verdacht auf Lungenembolie mit Schockzeichen, nicht abwarten.',
      'Oberkörper hoch lagern, weil die Luftnot im Vordergrund steht (Atemhilfsmuskulatur); keine Schocklage.',
      'Nicht aufstehen oder mobilisieren lassen (weitere Gerinnsel könnten sich lösen); nicht allein lassen.',
      'Vitalzeichen engmaschig: Puls, Blutdruck, Atemfrequenz, SpO₂, Bewusstsein; Sauerstoff n. ä. A. oder SOP; Beobachtungen mit Uhrzeit dokumentieren und weitergeben.',
      '(je Maßnahme 1 P., Begründung der Positionierung 1 P.)'
    ]))
  );

  /* ---------- Check-out ---------- */
  push(
    B.umbruch(),
    B.aa([IC.checkout, IC.handy], 'Check-out: Hätten Sie richtig gehandelt? – Prüfen Sie Ihre Vermutungen', ''),
    B.meta('5 min · Einzelarbeit → Plenum · Vermutungen überprüfen (vorher/nachher), Lernzuwachs sichtbar machen, Lernstandsdiagnose; Verbindung zur Klausurvorbereitung'),
    B.app([
      B.p('Jetzt wissen Sie mehr. Entscheiden Sie **dieselben sechs Notfälle** noch einmal – Ihr Handy zeigt sie automatisch. Danach sehen Sie die Auflösung – und Ihre Vermutungen vom Stundenbeginn daneben.'),
      B.p('Vergleichen Sie am Beamer: Bei welcher Frage hat sich die Klasse am stärksten verändert?')
    ]),
    new Paragraph({ spacing: { before: 80, after: 80 }, children: [B.b('Ich-kann-Liste Woche 2: '), B.t('Schätzen Sie sich ein: '), B.emoji('☺'), B.t(' sicher · '), B.emoji('😐'), B.t(' teilweise · '), B.emoji('☹'), B.t(' noch nicht. Bei 😐 oder ☹ notieren Sie, wo Sie nachlesen.')] })
  );
  const ikl = sammle('ikl', [
    ['1. … den hypovolämischen, den anaphylaktischen und den neurogenen Schock vergleichen.', 'AA1, AA2'],
    ['2. … die Lagerung nach Leitsymptom beschreiben und begründen.', 'AA3, Merksatz AA3'],
    ['3. … Sofortmaßnahmen bei einem anaphylaktischen Schock ableiten und meine Verantwortung beschreiben.', 'AA4, Merksatz AA4, AA5'],
    ['4. … falsche Aussagen zum Schock identifizieren und die Korrektur fachlich begründen.', 'Einstieg, 3.2, 4.1'],
    ['5. … am Fall Frau Maler die Kausalkette bis zum Kreislaufstillstand erklären.', 'AA6']
  ]);
  push(B.tabelle([{ text: 'Ich kann …', w: 5300 }, { text: '☺ 😐 ☹', w: 1100 }, { text: 'Nachlesen in …', w: BREITE_HOCH - 6400 }], ikl.map((z) => [z[0], '', lsg ? { lsg: z[1] } : ''])  , { hoehe: 480, schrift: 19 }));
  /* ---------- Hausaufgabe ---------- */
  sammelnAn = false;   // Lösungen der Hausaufgabe gehören nicht auf die Nachlese-Seite (eigene Selbstkontrolle)
  push(B.umbruch());
  push(
    B.abschnitt('Hausaufgabe · Klausurtraining'),
    new Paragraph({ spacing: { after: 100 }, children: [B.b('Bearbeitungszeit: ca. 26 Minuten · Hilfsmittel: keine · 20 Punkte'), B.t(' – Lösen Sie die Aufgaben wie in einer Prüfung. Kontrollieren Sie sich danach selbst mit der App.')] }),
    B.meta('ca. 26 min (1,3 min je Punkt wie im Examen) · Einzelarbeit zu Hause · AFB I–III · Examensformat: Ausgangssituation, Rahmensatz je Aufgabe, Situationswechsel im Aufgabenstamm (vgl. Mai 2024 Tag 1, 1.2; Mai 2024 Tag 3, 8.1–8.2; Mai 2026 Tag 1, 1.3)'),
    B.kasten([
      B.p('Sie arbeiten als Auszubildende bzw. Auszubildender im zweiten Ausbildungsdrittel in der orthopädischen Rehabilitationsklinik „Talblick“. Frau Sabine Lorenz (52) ist seit einer Woche nach einer Bandscheibenoperation an der Lendenwirbelsäule bei Ihnen. Sie ist verheiratet, arbeitet als Bankkauffrau und möchte „so schnell wie möglich wieder fit sein“. In ihrem Allergiepass steht eine Fischallergie. Ihr Notfallset hat sie zu Hause vergessen.'),
      B.p('Beim Mittagessen um 12:20 Uhr isst sie Gemüsecurry. Erst später stellt sich heraus, dass die Soße mit Fischsauce gewürzt war. Um 12:35 Uhr klingelt Frau Lorenz. Sie kratzt sich an den Händen und an der Kopfhaut, am Bauch sind Quaddeln zu sehen. Sie sagt: „Mir ist so schwindelig und übel.“ Sie ist blass und unruhig. Sie messen: Puls 124/min, Blutdruck 86/52 mmHg, Atemfrequenz 20/min, Sauerstoffsättigung 96 %. Bei der Morgenrunde lagen der Blutdruck bei 128/78 mmHg und der Puls bei 72/min. Ihre Stimme klingt normal, sie hat keine Atemnot. Die Stationsärztin ist im Haus erreichbar; für allergische Notfälle gibt es eine Notfall-SOP.', { spacing: { after: 0, line: 264 } })
    ], { kopf: 'Ausgangssituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    zw('Aufgabe 1 (7 Punkte)'),
    new Paragraph({ spacing: { after: 60 }, children: [B.i('Pflegefachpersonen schätzen akute Situationen anhand von Beobachtungen und Messwerten ein.')] }),
    aufg([
      { nr: '1.1', text: 'Beurteilen Sie aus pflegerischer Perspektive die im vorliegenden Fall beschriebenen Messdaten von Frau Lorenz: a) Puls b) Blutdruck', punkte: 3 },
      { nr: '1.2', text: 'Begründen Sie anhand von 4 Symptomen aus der Situation, dass bei Frau Lorenz ein anaphylaktischer Schock vorliegt.', punkte: 4 }
    ]),
    B.linien(7, L([
      '1.1 a) Puls 124/min: deutlich erhöht (Tachykardie), Anstieg von 72/min → der Kreislauf versucht auszugleichen. (1,5 P.)',
      '1.1 b) Blutdruck 86/52 mmHg: zu niedrig, deutlicher Abfall vom Vorwert 128/78 mmHg; Schockindex 124 : 86 ≈ 1,4 (über 1) → spricht für einen Schock. (1,5 P.)',
      '1.2 z. B. (je Symptom mit Zuordnung 1 P.): zeitlicher Zusammenhang – Beginn 15 Min. nach dem Essen mit Fischsauce bei bekannter Fischallergie · Haut – Juckreiz an Händen und Kopfhaut, Quaddeln am Bauch · Kreislauf – Puls 124/min, Blutdruckabfall von 128/78 auf 86/52 mmHg, Blässe, Schwindel · Magen-Darm – Übelkeit · Gehirn – Unruhe (Minderdurchblutung).',
      'Für die volle Punktzahl muss die Kreislaufbeteiligung genannt sein (wie in der Klassenarbeit).'
    ])),
    zw('Aufgabe 2 (9 Punkte)'),
    new Paragraph({ spacing: { after: 60 }, children: [B.i('Pflegefachpersonen treffen in lebensbedrohlichen Situationen erforderliche Interventionsentscheidungen und leiten Sofortmaßnahmen ein.')] }),
    aufg([
      { nr: '2.1', text: 'Beschreiben Sie stichwortartig 6 Sofortmaßnahmen, die Sie bei Frau Lorenz einleiten. Begründen Sie die Positionierung.', punkte: 7 },
      { nr: '2.2', vorsatz: 'Fünf Minuten später ist Frau Lorenz heiser und sagt: „Ich krieg so schlecht Luft.“ Die Sauerstoffsättigung sinkt auf 90 %.', text: 'Begründen Sie, wie Sie Frau Lorenz jetzt positionieren.', punkte: 2 }
    ]),
    B.linien(8, L([
      '2.1 z. B.: nicht weiteressen (Allergen stoppen) · Hilfe holen: Stationsärztin bzw. Notfallteam alarmieren, Frau Lorenz nicht allein lassen · flach lagern, Beine hoch, weil Kreislaufzeichen ohne Atemnot im Vordergrund stehen → mehr Blut zum Herzen; nicht aufsetzen oder aufstehen lassen · Adrenalin i. m. nach Notfall-SOP bzw. ärztlicher Anordnung vorbereiten/verabreichen (Außenseite Oberschenkel) · venösen Zugang und Volumengabe n. ä. A. vorbereiten · Sauerstoff n. ä. A./SOP · Vitalzeichen engmaschig (Puls, Blutdruck, Atmung, SpO₂, Bewusstsein) · Uhrzeit, Symptome und Maßnahmen dokumentieren.',
      '(je Maßnahme 1 P., max. 6 P.; Begründung der Positionierung 1 P.; Antihistaminikum statt Adrenalin wird nicht gewertet)',
      '2.2 Jetzt Oberkörper hoch (halbsitzend), weil die Atemnot im Vordergrund steht (Heiserkeit = Schleimhautschwellung, SpO₂ 90 %): Die Atemhilfsmuskulatur kann arbeiten. Trotzdem nicht auf die Bettkante setzen oder aufstehen lassen; Kreislauf weiter überwachen und die Ärztin über die Verschlechterung informieren. (Positionierung 1 P., Begründung 1 P.)'
    ])),
    zw('Aufgabe 3 (4 Punkte)'),
    new Paragraph({ spacing: { after: 60 }, children: [B.i('Pflegefachpersonen steuern den Pflegeprozess auch nach einem Notfall.')] }),
    aufg([{ nr: '3.1', vorsatz: 'Frau Lorenz geht es nach der Behandlung besser. Die Ärztin ordnet an, sie 24 Stunden lang zu überwachen.', text: 'Formulieren Sie 1 Pflegeproblem von Frau Lorenz im PESR-Format.', punkte: 4 }]),
    B.linien(5, L([
      'P: Frau Lorenz ist gefährdet, erneut eine anaphylaktische Reaktion bis hin zum Schock zu entwickeln (zweigipfliger Verlauf möglich).',
      'E: Fischallergie; anaphylaktischer Schock um 12:35 Uhr nach Fischsauce; Notfallset nicht vorhanden.',
      'S: (Risiko – darauf wird geachtet) Juckreiz, Quaddeln, Heiserkeit, Atemnot, Schwindel, Puls ↑, Blutdruck ↓.',
      'R: kennt ihre Allergie und hat einen Allergiepass; ist wach und kann Beschwerden sofort mitteilen; möchte rasch wieder gesund werden. (je P, E, S, R 1 P.)'
    ])),
    handy(T.SEITEN.transfer, [B.p('**Selbstkontrolle:** Die App zeigt die Musterlösung erst, wenn Sie bestätigen, dass Ihre Antwort auf dem Papier steht. Dann haken Sie ab und zählen Ihre Punkte.')]),
    B.punktezeile(20),
    B.leer(240),
    handy(T.SEITEN.nachlesen, [
      B.p('📖 **Nachlesen:** Alles aus dieser Stunde – Expertentexte, Merksätze, Lösungen der Übungen und Klausuraufgaben – zum Wiederholen vor der Klassenarbeit.'),
      B.p('**Erst nach der Stunde scannen:** Solange die Stunde am Beamer läuft, ist die Seite gesperrt.')
    ])
  );
  return k;
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
      kasten('① Expertenteam (15 min)', ['👥 gleicher Buchstabe: **A + A + A**', 'Fall markieren · Infotext · **Ihre Spalte** der Tabelle · 1.1', '✓ „Unsere Spalte ist fertig“'], F.BLAU_HELL),
      mitte,
      kasten('② Stammgruppe (12 min)', ['🧩 **A + B + C** an einem Tisch', 'reihum erklären · **Tabelle vollständig**', '✓ „Unsere Tabelle ist vollständig“'], F.LACHS_HELL)
    ] })]
  });
}

/* =====================================================================
   ANLAGEN: Expertenblätter A/B/C, Schilder
   ===================================================================== */
function expertenblatt(B, key) {
  const e = T.EXPERTEN[key];
  return [
    B.titel(`Expertenblatt ${e.buchstabe} · ${e.form}`),
    B.p('**Papierfassung (freiwillig):** Die Aufträge, den Fall zum Markieren und den Experten-Check finden Sie in der Stunden-App auf Ihrem Handy. Hier können Sie Fall und Infotext zusätzlich auf Papier lesen und markieren.'),
    B.kasten(e.fall.map((x, i) => B.p(x, i === e.fall.length - 1 ? { spacing: { after: 0, line: 264 } } : {})), { kopf: 'Fallsituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    B.leer(120),
    B.kasten([...e.info.map((x) => B.p(x)), new Paragraph({ spacing: { after: 0 }, children: [B.i('Quelle: nach MSD Manual Profi-Ausgabe: Schock; S2k-Leitlinie Anaphylaxie (AWMF 061-025, 2021); Ich-kann-Liste KB I; sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] })], { kopf: `Informationstext ${e.buchstabe}: ${e.form}` }),
    new Paragraph({ spacing: { before: 40, after: 100 }, children: [B.b('Wörterhilfe: ', { size: 17 }), B.t(e.woerter, { size: 17 })] })
  ];
}

function schild(B, emoji, titel, unter) {
  return [
    B.leer(1600),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: emoji, font: 'Segoe UI Emoji', size: 160 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: titel, font: 'Calibri Light', bold: true, size: 96 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: unter, font: 'Calibri', size: 44 })] })
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
    B.p('**Rahmen:** KB I · Woche 2 (SW 7) · 3 UE (135 min) · Leitfall „Frau Maler“ (11 Uhr, Kausalkette) · Vorwissen: Woche 1 (Kompensation, Schockspirale, Schockindex), Erste-Hilfe-Kurs und Positionierung (1. AJ), Thromboseprophylaxe (1. AJ), PESR (1. AJ) · Ich-kann-Liste KB I, Woche 2, Nr. 1–5 · KA-Bezug: KB 1, Aufg. 3.1–3.3 und 5.5'),
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
    z('vor der Stunde', 'Vorbereitung', 'Yogamatten auslegen; 3 Schilder in die Raumecken (Anlage); wenige Expertenblätter A/B/C ans Pult; **beamer.html** öffnen → „Neuen Raum starten“.', '–', '–', 'Matten, Schilder, Beamer', 'Ablauf ohne Umbaupausen'),
    z('0–8', `Problemorientierter Einstieg: „Wie hätten Sie gehandelt?“ (Folien ${FN('start')}–${FN('ziel')})`, `${FOLIE('start')} QR-Code am Beamer, die Namen der Angemeldeten erscheinen. ${FOLIE('fall')} Fallauszug und Leitfrage; Vermutung aus W1 (AA3a) kurz abrufen. ${FOLIE('einstieg')} Abstimmung freigeben: „Falsch liegen ist erlaubt.“ ${FOLIE('einstieg-ergebnis')} Ergebnis (★ = größte Uneinigkeit, Karte anklicken = groß). ${FOLIE('murmeln')} Murmeln – die Uhr (1 min) startet automatisch; 2–3 Begründungen hören, nicht auflösen. ${FOLIE('ziel')} Lernziel und Fahrplan.`, 'Mit Vornamen anmelden; Vermutungen am Handy abgeben (sicher / vermute nur), auch zur Leitfrage (E6); die Nachbarin oder den Nachbarn von der eigenen Wahl überzeugen.', 'EA → PA (Murmeln) → Plenum', 'Beamer, Handy, AB S. 1', 'Vorwissen aktivieren, Vermutungen bilden, Fehlvorstellungen sichtbar machen (IKL Nr. 4); kognitiver Konflikt; die Vermutungen werden im Check-out überprüft (vorher/nachher). AFB I'),
    ueber('„Bei E… sind Sie geteilter Meinung – genau das klären wir heute. In Woche 1 haben Sie gesehen, wie der Körper einen Schock ausgleicht. Heute geht es um die Frage: Ist jeder Schock gleich – und muss ich deshalb immer gleich handeln? Am Ende der Stunde prüfen Sie Ihre Vermutungen.“'),
    z('8–25', `Erarbeitung I: Expertenteams (AA1, Folien ${FN('puzzle')}–${FN('aa1-merksatz')})`, `${FOLIE('puzzle')} Ablauf zeigen; Personen ohne Handy mit „+ Person ohne Handy“ eintragen; **„Gruppen zufällig einteilen“** (Name anklicken = in die nächste Gruppe). ${FOLIE('aa1')} Uhr starten; die Teams finden sich über die Namen am Handy und setzen sich selbstständig zusammen; Status je Team am Beamer („Tabelle fertig!“). Sind alle Teams fertig, wechseln Beamer und Handys **automatisch** zu Folie ${FN('aa1-merksatz')}: Merksatz AA1 prüfen – SuS aufrufen, Lücke anklicken = aufdecken.`, 'Fall am Handy markieren (Schutz gegen Raten), Merksatz AA1; Klausuraufgabe 1.1 allein (Wortlaut KA 3.1); Infotext lesen (ohne Überschriften – selbst zuordnen); Experten-Check; im Team die eigene Spalte der Vergleichstabelle ausfüllen; „Unsere Spalte ist fertig“; während des Wartens Selbstkontrolle zu 1.1; Merksatz mit dem Beamer vergleichen.', 'EA → GA (Expertenteam 3–4) → Plenum', 'Handy, AB S. 2–3, Expertenblätter (freiwillig)', 'Befunde im Fließtext identifizieren und Relevantes von Irrelevantem unterscheiden (KA 3.1); Informationen selbst den Tabellenzeilen zuordnen; der Experten-Check sichert, dass jede Person erklären kann. AFB I–II'),
    z('25–60', `Erarbeitung II: Stammgruppe (AA2, Folien ${FN('aa2a')}–${FN('aa2c-loesung')})`, `${FOLIE('aa2a')} „Umsetzen!“ – die Handys zeigen Stammgruppe und Namen; **Erklär-Uhr** starten (A → B → C je 3 min, Ton beim Wechsel, dazu 2 min Gemeinsamkeit); Status je Gruppe. ${FOLIE('aa2a-sichern')} Tabelle sichern: SuS aufrufen, bei richtiger Antwort die Zelle anklicken und aufdecken. ${FOLIE('aa2b-intro')} Erklärfolie: Was ist der Schockform-Detektiv – und warum braucht man das? ${FOLIE('aa2b')} Detektiv, Fortschritt je Stammgruppe. ${FOLIE('aa2b-merksatz')} Merksatz AA2 prüfen. ${FOLIE('aa2c')} 2.1/2.2 zeigen und erklären; „Jetzt bearbeiten“ blendet den Auftrag ein und startet die Uhr (5 min); die Fälle stehen am Handy. ${FOLIE('aa2c-loesung')} Musterlösung: SuS aufrufen, passende Zeilen aufdecken.`, 'Reihum erklären, die Spalten der anderen ausfüllen, „Unsere Tabelle ist vollständig“; Tabelle mit der Musterlösung vergleichen und verbessern; Schockform-Detektiv, Merksatz AA2 ergänzen und vergleichen; 2.1 und 2.2 allein schreiben, mit der Musterlösung vergleichen und verbessern.', 'GA (Stammgruppe 3–4) → Plenum → EA → Plenum', 'AB S. 3–4, Handy', 'Vergleichen (IKL Nr. 1); Ergebnissicherung im Plenum; Pathophysiologie erläutern (KA 3.2), Unterschied neurogen (KA 5.5). AFB II'),
    ueber('„Sie wissen jetzt, wie sich die Schockformen unterscheiden. Aber wie lagern Sie? Aus dem Erste-Hilfe-Kurs kennen Sie: ‚Beine hoch.‘ Prüfen wir, ob das immer stimmt.“'),
    z('60–83', `Erarbeitung III: Lagerung nach Leitsymptom (AA3, Folien ${FN('aa3-impuls')}–${FN('aa3c-loesung')})`, `${FOLIE('aa3-impuls')} Impuls „Bei einem Schock immer Beine hoch?“ – Meinungen sammeln. **Folien ${FN('lagerung-1')}–${FN('lagerung-4')}:** die vier Lagerungen mit Bild, Wann? Warum? So geht’s (je ca. 1 min, bei Bedarf kurz vormachen lassen). ${FOLIE('aa3')} Paare bilden, Sicherheit ansprechen; Fortschritt am Beamer. ${FOLIE('aa3-merksatz')} Merksatz AA3 prüfen. ${FOLIE('aa3bc')} Entscheidungsweg und 3.1/3.2 zeigen und erklären, „Jetzt bearbeiten“ (Uhr 5 min). **Folien ${FN('aa3b-loesung')}–${FN('aa3c-loesung')}:** Musterlösungen aufdecken.`, 'Lagerungen ansehen; Karten am Handy ziehen, lagern und begründen, aufdecken, Rollen tauschen (Bilder auf dem AB und am Handy); Merksatz AA3; Entscheidungsweg und 3.1/3.2 allein, mit der Musterlösung vergleichen und verbessern.', 'Plenum → PA → EA → Plenum', 'Yogamatten, Kissen, Handy, AB S. 4–5', 'Handlungsorientiert; Fehlvorstellung „immer Beine hoch“ korrigieren; Lagerungsbegründung als K.-o.-Kriterium in KA 3.3; 3.2 übt das Korrigieren falscher Aussagen (IKL Nr. 4). AFB II'),
    ueber(`Pause (falls im Stundenraster vorgesehen: Folie ${FN('pause')} mit Uhr, sonst überspringen). – „Sie wissen jetzt, wie Sie lagern. Aber was dürfen Sie im Notfall selbst – und wofür brauchen Sie eine Anordnung?“`),
    z('83–97', `Vertiefung: Wer darf was? (AA4, Folien ${FN('aa4a')}–${FN('aa4-merksatz')})`, `${FOLIE('aa4a')} Jeder Klick deckt die nächste Maßnahme auf, der nächste zeigt die Lösung (6 Maßnahmen); bei Uneinigkeit nachfragen; nach jeder Lösung eintragen lassen. ${FOLIE('aa4b')} Dialog und 4.1 zeigen, „Jetzt bearbeiten“: Think 2,5 min, Pair 1,5 min (Uhr). ${FOLIE('aa4b-loesung')} Musterlösung 4.1 aufdecken. ${FOLIE('aa4-merksatz')} Merksatz AA4 ergänzen lassen, dann aufdecken.`, 'In die passende Ecke gehen und begründen, jede Maßnahme in die Tabelle eintragen; Stellungnahme zu Herrn Brandt schreiben, zu zweit vergleichen, mit der Musterlösung verbessern; Merksatz AA4 ergänzen und vergleichen.', 'Plenum (Bewegung) → EA → PA → Plenum', 'Schilder (Anlage), AB, Handy', 'Verantwortungsgrenzen (III.2.b; KA 3.3: „n. ä. A./SOP“); Fehlvorstellung „Antihistaminikum statt Adrenalin“ korrigieren (KA 3.3, IKL Nr. 4); Merksatz bündelt die Sofortmaßnahmen. AFB II–III'),
    ueber('„Jetzt wie in der Klassenarbeit: allein, ohne Unterlagen, mit Punkten.“'),
    z('97–108', `Sicherung: Klausurtraining (AA5, Folien ${FN('aa5')}–${FN('aa5-peer')})`, `${FOLIE('aa5')} Transferfall zeigen, „Jetzt bearbeiten“: Countdown 6 min. ${FOLIE('aa5-peer')} Tauschpartnerin oder Tauschpartner aus einer anderen Stammgruppe; das Raster erscheint am Handy (Uhr 4 min); dazu die Musterlösung Zeile für Zeile aufdecken; Rückmeldesatz einfordern.`, 'Transferfall (5.1, 5.2) allein lösen; Lösung der Partnerin oder des Partners mit dem App-Raster bewerten und mit der Musterlösung vergleichen.', 'EA → PA', 'AB, Handy', 'Transfer auf einen neuen Fall im KA-Format (KA 3.3); Peer-Feedback nach Erwartungshorizont. AFB III'),
    z('108–113', `Transfer: Zurück zu Frau Maler (AA6, Folie ${FN('aufloesung')})`, `${FOLIE('aufloesung')} Kausalkette im Unterrichtsgespräch: vor jedem Klick fragen „Was kommt als Nächstes?“, dann aufdecken; zum Schluss die Antwort auf die Leitfrage. 6.1/6.2 als freiwillige Hausaufgabe nennen (Lösung in der Nachlese).`, 'Nächstes Glied vermuten, Kausalkette auf dem AB ergänzen, Leitfrage beantworten.', 'Plenum', 'AB', 'Leitfall abschließen (IKL Nr. 5); Brücke zur Thromboseprophylaxe (1. AJ) und zu Woche 7. AFB II–III'),
    z('113–125', 'Puffer (ca. 12 min)', 'Reserve für die Sicherungsfolien (Merksätze, Tabelle, Musterlösungen) – mit Aufrufen dauern sie oft länger als geplant. Bleibt Zeit: 6.1/6.2 zu Frau Maler in der Stunde beginnen oder mit der Hausaufgabe anfangen.', '–', '–', '–', 'Zeitreserve, kein neuer Inhalt'),
    z('125–135', `Abschlusssicherung: „Hätten Sie richtig gehandelt?“ (Folien ${FN('checkout')}–${FN('ende')})`, `${FOLIE('checkout')} Check-out-Abstimmung. ${FOLIE('checkout-ergebnis')} Vermutung (Beginn) und Entscheidung (Ende) mit Lösung; größte Veränderung besprechen (v. a. E6 = Leitfrage). ${FOLIE('ikl')} Ich-kann-Liste, Hausaufgabe. ${FOLIE('ende')} Ausblick – damit wird die Nachlese-Seite freigeschaltet.`, 'Dieselben Fragen erneut entscheiden, Auflösung mit der eigenen Vermutung vergleichen; Ich-kann-Liste (Ampel); Leitfrage beantworten.', 'EA → Plenum', 'Handy, Beamer, Ich-kann-Liste', 'Vermutungen überprüfen, Lernzuwachs sichtbar machen (vorher/nachher); Lernstandsdiagnose.'),
    ueber('„Nächste Woche geht es darum, wie man eine starke Blutung stoppt – damit es gar nicht erst zum hypovolämischen Schock kommt.“')
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
    punkt('**Per Knopfdruck am Beamer (Folie 7):** Stammgruppen zu 3 (A, B, C); geht es nicht auf, Vierergruppen mit doppeltem B (Anaphylaxie ist Klausurschwerpunkt). Expertenteams zu 3, Rest zu 4; zwei B-Expertinnen derselben Stammgruppe kommen in verschiedene Teams. Wer später kommt, wird automatisch eingeteilt; Personen ohne Handy trägt die Lehrkraft vorher mit „+ Person ohne Handy“ ein.'),
    punkt('**3BFP2.1 (23 SuS):** 7 Stammgruppen (5 × 3, 2 × 4) · Expertenteams A1–A2, B1–B3, C1–C2 · Lagerungsparcours: 10 Paare + 1 Dreiergruppe (11 Matten). **3BFP2.2 (20 SuS):** 6 Stammgruppen (4 × 3, 2 × 4) · Expertenteams A1–A2, B1–B2, C1–C2 · 10 Paare (10 Matten).'),
    B.zwischen('Material und Technik'),
    punkt('Kopien: AB (SV) für alle; Expertenblätter A/B/C nur zum Auslegen am Pult (freiwillig, z. B. je 3); drei Schilder für die Raumecken. Yogamatten, einige Kissen/Decken als Polster.'),
    punkt('**Beamer:** **beamer.html** öffnen → „Neuen Raum starten“. Unten rechts **Weiter**, links **Zurück** (auch Pfeiltasten, Presenter); Menü ⚙ unten links: zu jeder Folie springen, Vollbild, Namen verbergen, Angemeldete verwalten, neuer Raum für die Parallelklasse. Die Handys wechseln automatisch mit; ein QR-Code unten auf jeder Folie lässt Nachzügler einsteigen. Probeansicht ohne Internet: beamer.html?demo=1.'),
    punkt(`**Nachlese-Seite** (QR-Code auf der letzten AB-Seite): alle Inhalte und Lösungen der Stunde zum Wiederholen. Sie ist gesperrt, solange irgendwo eine Beamer-Stunde läuft – bis Folie ${FN('ende')} erreicht ist oder 10 Minuten nach dem Schließen des Beamers.`),
    punkt('**Zeitplan und Puffer:** Die Notfall-Simulation ist gestrichen – die Sofortmaßnahmen üben AA4 (Wer darf was?, Merksatz AA4) und AA5 (Transferfall im KA-Format). Dadurch bleiben rund **12 Minuten Puffer** (113–125) für die Sicherungsfolien: Merksätze und Musterlösungen mit Aufrufen dauern oft länger als geplant.'),
    punkt('**Sicherungsfolien:** Nach jedem Merksatz kommt eine Folie, auf der Sie die Lücken per Klick aufdecken; nach jeder Papieraufgabe eine Aufgabenfolie (erst erklären, dann „Jetzt bearbeiten“ – das startet die Uhr) und eine Musterlösung zum Aufdecken. Die Handys zeigen dazu passende Hinweise. Aufgedecktes bleibt aufgedeckt, auch nach dem Neuladen.'),
    punkt('Ohne WLAN oder Handys: Abstimmung per Handzeichen/Ampelkarten; Lagerungskarten aus der Liste unten vorlesen; Merksätze und Musterlösungen aus dieser Lehrerversion vorlesen.'),
    punkt('Schutz gegen Durchklicken wie gewohnt: Merksätze erscheinen nur, wenn genug Aufgaben beim ersten Versuch richtig sind.'),
    B.zwischen('Inhaltliche Hinweise'),
    punkt('**Einstieg und Check-out („Wie hätten Sie gehandelt?“):** Zu Beginn geben die SuS Vermutungen ab – falsch liegen ist ausdrücklich erlaubt, die Sicherheit („sicher“ / „vermute nur“) macht Fehlvorstellungen sichtbar, die mit Überzeugung vertreten werden. Beim Einstieg nichts auflösen, auch nicht beim Murmeln. Im Check-out entscheiden die SuS dieselben sechs Fragen erneut und sehen danach die Auflösung neben ihrer Vermutung. E6 ist die Leitfrage (Frau Maler um 11 Uhr); sie wird in AA7 geklärt.'),
    punkt('Die Lagerungsempfehlungen folgen der S2k-Leitlinie Anaphylaxie (AWMF 061-025, 2021): symptomorientiert; Flachlagerung und Vermeiden abrupter Lageveränderungen (Aufsitzen, Aufstehen) als Grundstrategie; bei führender Atemnot (halb-)sitzend; bei eingeschränktem Bewusstsein und intaktem Kreislauf stabile Seitenlage; zur Kreislaufverbesserung Beine hoch.'),
    punkt('Adrenalin i. m. laut Leitlinie 0,15–0,6 mg in die Außenseite des Oberschenkels, Autoinjektoren 0,15/0,3/0,5 mg, Wiederholung nach ca. 5–10 min. Antihistaminika: langsamerer Wirkungseintritt, Wirkung auf Kreislauf und Bronchokonstriktion nicht belegt, lebensrettende Sofortmaßnahmen dürfen nicht verzögert werden. Glukokortikoide: untergeordnete Rolle in der Akutphase. Die KA-Lösung nennt „Erwachsene 0,5 mg“ – das liegt in diesem Bereich.'),
    punkt('Der Leitfall ist belastend (Christin, Reanimation). AA6 bleibt bewusst fachlich (Kausalkette, verpasste Chancen) und bewertet Christin nicht; Erleben, Hilflosigkeit und Verarbeitung sind Thema in KB II und KB V.'),
    punkt('Die Übungsfälle vermeiden bewusst die Personen und Auslöser der Klassenarbeit (Frau Sommer, Herr Brenner, Antibiotika-Kurzinfusion), damit die KA den Transfer prüft.'),
    B.zwischen('Nicht enthalten (andere Kompetenzbereiche/Fächer)'),
    punkt('KB II: psychologische Erste Hilfe, Beruhigen, Notfalleinwilligung, SPIKES/NURSE, SAfE · KB III: Reanimation, ABCDE-Schema, Notaufnahme/Triage, PTBS (nur Verweise) · KB IV: Delegationsrecht, Haftung, unterlassene Hilfeleistung, Ersthelferschutz, Patientenverfügung · KB V: eigene Überforderung · Deutsch: Notruf absetzen, SBAR · Pädiatrie (3. AJ): Anaphylaxie bei Kindern · Anatomie: Pathophysiologie der Lungenembolie (1. AJ, nur aktiviert).'),
    B.zwischen('Liste für die Aufstellung (AA4a) – Lösung'),
    punkt('🟢 selbst: Infusion stoppen, Zugang belassen · nach Leitsymptom lagern'),
    punkt('🟡 n. ä. A./SOP: Adrenalin i. m. · Sauerstoff · Antihistaminikum'),
    punkt('🔴 ärztlich: Diagnose „anaphylaktischer Schock“ stellen'),
    B.zwischen('Lagerungskarten (AA3a) – zum Vorlesen ohne App')
  );
  push(B.tabelle([{ text: 'Karte', w: 2000 }, { text: 'Situation', w: 3900 }, { text: 'Lösung und Begründung', w: B.breite - 5900 }],
    T.LAGERUNGSKARTEN.map((c) => [`**${c.titel}**${c.dilemma ? ' (Dilemma)' : ''}`, c.text, `**${c.loesung}** – ${c.warum}`]), { schrift: 17 }));
  push(B.zwischen('Quellen'), punkt('S2k-Leitlinie Akuttherapie und Management der Anaphylaxie, AWMF 061-025, Update 2021 (Ring et al., Allergo J Int 2021;30:1–25) · MSD Manual Profi-Ausgabe: Schock · Landeslehrplan Berufsfachschule Pflege BW, CE 06 · Ich-kann-Liste KB I (3BFP2) · BW-Abschlussprüfungen Mai 2023–Mai 2026 (Operatoren, Aufgabenformat)'));
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
      sektionHoch([...anl(AN)]),
      { properties: { page: SEITE_QUER }, children: [...schild(bausteine({ breite: BREITE_QUER }), '🟢', 'mache ich selbst', 'eigenverantwortlich'), new Paragraph({ children: [new D.PageBreak()] }), ...schild(bausteine({ breite: BREITE_QUER }), '🟡', 'nur n. ä. A. oder SOP', 'nach ärztlicher Anordnung oder Notfall-SOP'), new Paragraph({ children: [new D.PageBreak()] }), ...schild(bausteine({ breite: BREITE_QUER }), '🔴', 'ärztliche Aufgabe', 'Diagnose, Therapieentscheidung, Anordnung')] }
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
    experten: Object.fromEntries(['a', 'b', 'c'].map((k) => [k, { buchstabe: T.EXPERTEN[k].buchstabe, form: T.EXPERTEN[k].form, fall: T.EXPERTEN[k].fall, nennen: T.EXPERTEN[k].nennen }])),
    vergleich: N.vergleich, gemeinsamkeit: N.gemeinsamkeit,
    pikto: N.pikto.map((x) => ({ bild: x[0], titel: x[1], wann: x[2], warum: x[3] })),
    weg: N.weg.map((z) => ({ frage: z[0], antwort: z[1].lsg })),
    werDarfWas: N.werDarfWas[0].map((c) => c.lsg),
    verantwortung: N.verantwortung, adrenalin: N.adrenalin, adrenalinText: N.adrenalinText,
    transferfall: N.transferfall,
    ikl: N.ikl, aufgaben: N.aufgaben, loesungen: N.loesungen
  };
  const ziel = path.join(WURZEL, 'docs', 'inhalte_nachlesen.js');
  fs.writeFileSync(ziel, '/* Automatisch erzeugt von werkzeuge/ab_w2.js – bitte nicht von Hand ändern.\n' +
    '   Lösungstexte aus dem Arbeitsblatt für die Nachlese-Seite (w2-nachlesen.html). */\n' +
    'var NACHLESEN = ' + JSON.stringify(daten, null, 1) + ';\n');
  console.log('geschrieben:', ziel);
}

main().catch((e) => { console.error(e); process.exit(1); });

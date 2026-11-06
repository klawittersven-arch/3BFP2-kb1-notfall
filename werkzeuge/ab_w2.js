/* Erstellt die Unterlagen für KB I, Themenblock 2, Woche 2 (SW 7):
     arbeitsblatt/KB1_W2_Schockformen_SV.docx        Schülerversion (AB mit AA1–AA7, Check-out, Hausaufgabe)
     arbeitsblatt/KB1_W2_Schockformen_Anlagen.docx   Expertenblätter A/B/C, Notfallprotokoll, Placemat, Schilder
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

const AUS = process.argv[2] || path.join(WURZEL, 'arbeitsblatt');
// Dateiname des QR-Codes: w2-markieren.html?fall=a → qr_w2_markieren_a.png, w2-entscheidung.html?runde=2 → qr_w2_entscheidung_2.png
const QR = (seite) => {
  const zusatz = (seite.match(/\?[a-z]+=([a-z0-9]+)/) || [])[1];
  return path.join(WURZEL, 'qr', 'qr_w2_' + seite.replace(/\.html.*$/, '').replace(/^w2-/, '') + (zusatz ? '_' + zusatz : '') + '.png');
};
const FUSS = 'KB I · Woche 2 · Schock ist nicht gleich Schock';
const BREITE_HOCH = 11906 - 2 * 1417;   // 9072
const BREITE_QUER = 16838 - 2 * 1134;   // 14570

const IC = { lesen: 'icon_lesen.png', markieren: 'icon_markieren.png', schreiben: 'icon_schreiben.png', handy: 'icon_handy.png', stift: 'icon_stift.png', beurteilen: 'icon_beurteilen.png', checkout: 'icon_checkout.png', schere: 'icon_schere.png' };

/* =====================================================================
   SCHÜLERVERSION (mit lsg = true: Lösungsteil der Lehrerversion)
   ===================================================================== */
function schuelerTeil(B, { lsg }) {
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  const handy = (seite, absaetze) => B.handy(seite, absaetze, { linkBasis: T.LINK_BASIS, qrDatei: QR(seite) });
  const merk = (titel, key) => B.merksatz(titel, [T.MERKSAETZE[key]]);
  const L = (zeilen) => (lsg ? zeilen : []);

  /* ---------- Kopf ---------- */
  push(
    B.titel('Schock ist nicht gleich Schock – vergleichen und nach Leitsymptom handeln', lsg ? '[LSG]' : null),
    new Paragraph({ spacing: { after: 120, line: 264 }, children: [B.emoji('🎯 '), B.b('Lernziel: '), ...B.runs('Sie vergleichen den hypovolämischen, den anaphylaktischen und den neurogenen Schock und begründen Sofortmaßnahmen und Lagerung (Positionierung) anhand des Leitsymptoms. Sie grenzen eigenverantwortliche von ärztlich angeordneten Maßnahmen ab und korrigieren typische Fehlvorstellungen.')] }),
    new Paragraph({ spacing: { after: 140 }, children: [bild(IC.handy, 0.5, 0.5), B.t(' = am Smartphone (QR-Code scannen)      ', { size: 19 }), bild(IC.stift, 0.5, 0.5), B.t(' = auf Papier', { size: 19 })] }),
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
    B.aa([IC.handy], 'Einstieg: Wie hätten Sie gehandelt? – Ihre Vermutungen, bitte!', ''),
    B.meta('8 min · Einzelarbeit → Murmeln (PA) → Plenum · AFB I · Ich-kann-Liste W2 Nr. 4 · Vorwissen aktivieren, Vermutungen bilden, Fehlvorstellungen sichtbar machen; im Check-out werden die Vermutungen überprüft (vorher/nachher)'),
    handy(T.SEITEN.entscheidung1, [
      B.p('Scannen Sie den QR-Code und tragen Sie oben **Vorname + Raumcode vom Beamer** ein. Sechs kurze Notfälle – der letzte ist Frau Maler um 11 Uhr: Wie würden Sie handeln? Tippen Sie Ihre Vermutung an und geben Sie an, ob Sie sich sicher sind oder nur vermuten.'),
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
    B.p('Ihre Lehrkraft teilt Sie in **Stammgruppen** ein. In jeder Stammgruppe gibt es Expertinnen und Experten für **A** (hypovolämischer Schock), **B** (anaphylaktischer Schock) und **C** (neurogener Schock). Ihr Expertenblatt erhalten Sie gesondert.'),
    new Paragraph({ spacing: { after: 100 }, children: [B.b('Ich bin Expertin/Experte für:  '), B.t('☐ A    ☐ B    ☐ C          '), B.b('Meine Stammgruppe: '), B.t('_'.repeat(14))] }),
    B.aa([IC.lesen, IC.markieren], 'AA1: Identifizieren – Expertenrunde:', 'Bearbeiten Sie in Ihrer **Expertengruppe** die Aufträge a–c auf Ihrem Expertenblatt: Fall lesen und Befunde am Smartphone markieren, die Schockform anhand von Symptomen **begründen**, Expertenkarte ausfüllen. Üben Sie zum Schluss: Erklären Sie Ihrer Nachbarin oder Ihrem Nachbarn Ihre Schockform in 60 Sekunden.'),
    B.meta('15 min · Einzelarbeit → Gruppenarbeit (Expertengruppe) · AFB I · Ich-kann-Liste W2 Nr. 1 · KA-Bezug KB 1, Aufg. 3.1'),
    lsg ? B.lp('Lösungen zu AA1 a–c: siehe Lösung der Expertenblätter (am Ende dieser Lehrerversion).') : null,

    B.umbruch(),
    B.aa([IC.schreiben], 'AA2: Vergleichen – Stammgruppe:', '**a)** Erklären Sie reihum Ihre Schockform (je 3 Minuten). Die anderen **ergänzen** die Tabelle.'),
    B.meta('20 min (a–c) · Gruppenarbeit (Stammgruppe 3–4) · AFB II · Ich-kann-Liste W2 Nr. 1 · KA-Bezug KB 1, Aufg. 3.2 und 5.5')
  );
  const sw = Math.round((BREITE_HOCH - 1700) / 3);
  const zeilenAA2 = [
    ['Ursache', 'Blut- oder Flüssigkeitsverlust (Blutung, z. B. Magen-Darm-Blutung; Verbrennung; Durchfall, Erbrechen)', 'allergische Sofortreaktion auf Medikament, Insektengift oder Nahrungsmittel', 'Verletzung des Rückenmarks (meist Halswirbelsäule), z. B. Kopfsprung, Sturz aus der Höhe'],
    ['Entstehung (kurz)', 'Volumen ↓ → Rückstrom zum Herzen ↓ → Schlagvolumen ↓ → Blutdruck ↓', 'Histamin → Gefäße weit und durchlässig → relativer Volumenmangel → Blutdruck ↓; Bronchien eng', 'Sympathikus fällt aus → Gefäße weit, Blut versackt → Blutdruck ↓; keine Gegenregulation'],
    ['Puls', 'schnell, schwach', 'schnell', 'langsam oder normal'],
    ['Haut', 'blass, kalt, schweißig (Zentralisation)', 'Juckreiz, Rötung, Quaddeln, Schwellungen (kann auch blass sein)', 'unterhalb der Verletzung warm, trocken, rosig'],
    ['weitere typische Zeichen', 'Durst, Unruhe, schnelle Atmung, wenig Urin; ggf. sichtbares Blut, Teerstuhl', 'Heiserkeit, Atemnot, Übelkeit, Erbrechen, Bauchkrämpfe, Schwindel', 'Lähmungen, Kribbeln, Taubheit, Nacken-/Rückenschmerz, flache Atmung, Auskühlung'],
    ['Darauf achte ich besonders', 'Blutungsquelle; Puls und Blutdruck im Verlauf (Schockindex); Bewusstsein; Urin', 'Atemwege und Atmung (Heiserkeit, SpO₂); Kreislauf; zweite Reaktion nach Stunden möglich', 'Atmung; Blutdruck und Puls; Temperatur; nicht bewegen']
  ];
  push(B.tabelle(
    [{ text: '', w: 1700 }, { text: 'A hypovolämisch', w: sw }, { text: 'B anaphylaktisch', w: sw }, { text: 'C neurogen', w: BREITE_HOCH - 1700 - 2 * sw }],
    [
      ...zeilenAA2.map((z) => [{ text: `**${z[0]}**`, fill: F.LACHS }, { lsg: z[1] }, { lsg: z[2] }, { lsg: z[3] }]),
      [{ text: '**Gemeinsamkeit**', fill: F.LACHS }, { colSpan: 3, lsg: 'Bei allen drei Formen fällt der Blutdruck, die Organe werden schlecht durchblutet → Sauerstoffmangel → Lebensgefahr. Anaphylaktischer und neurogener Schock sind distributive Schockformen: Die Gefäße sind weit gestellt (relativer Volumenmangel).' }]
    ],
    { hoehe: 640, schrift: 19 }
  ));
  push(
    B.teil([IC.handy], '**b) Schockform-Detektiv:**'),
    handy(T.SEITEN.detektiv, [
      B.p('Bestimmen Sie bei sechs kurzen Fällen die Schockform und markieren Sie die **zwei Befunde**, die Ihre Entscheidung belegen. Im **Monitorvergleich** finden Sie die Unterschiede zwischen zwei Patienten.'),
      B.p('**Am Ende:** Ergänzen Sie den Merksatz.')
    ]),
    B.leer(80),
    merk('Merksatz AA2', 'aa2'),
    B.teil([IC.schreiben], '**c) Klausurtraining:** Bearbeiten Sie die Aufgaben allein. Danach prüft **Expertin/Experte B** Ihre Antwort zu 2.1 und **Expertin/Experte C** Ihre Antwort zu 2.2.'),
    B.aufgaben([
      { nr: '2.1', text: 'Erläutern Sie, wie es bei Mia zum Schock kommt.\nTipp: Denken Sie in einer Pfeilkette – Auslöser → Botenstoff → Gefäße → Blutdruck; die Atemwege extra.'.split('\n').join(' – '), punkte: 3 },
      { nr: '2.2', text: 'Nennen Sie 1 Befund, der bei Herrn Weber anders ist als bei Herrn Albrecht. Begründen Sie den Unterschied.', punkte: 2 }
    ]),
    B.zwischen('2.1'),
    B.linien(4, L(['Die Haselnuss (Allergen) löst eine allergische Sofortreaktion aus: Mastzellen setzen Histamin und weitere Botenstoffe frei.', 'Die Gefäße werden weit und durchlässig: Flüssigkeit tritt ins Gewebe (Quaddeln, Schwellung von Lippen und Lidern), im Gefäßsystem fehlt Volumen → der Blutdruck fällt (88/50 mmHg), das Herz gleicht mit 128/min aus.', 'Zusätzlich schwellen die Schleimhäute an (Heiserkeit) und die Bronchien verengen sich → Atemnot, Sauerstoffmangel (SpO₂ 93 %).', '(je schlüssiger Schritt 1 P.)'])),
    B.zwischen('2.2'),
    B.linien(3, L(['Befund: Herr Weber hat einen langsamen Puls (52/min), Herr Albrecht einen schnellen (116/min). – oder: Herr Webers Haut ist warm, trocken, rosig, Herrn Albrechts Haut blass, kalt, schweißig.', 'Begründung: Bei Herrn Weber ist das Rückenmark verletzt, der Sympathikus fällt aus. Der Körper kann nicht gegenregulieren: kein Pulsanstieg, keine Zentralisation. (Befund 1 P., Begründung 1 P.)']))
  );

  /* ---------- AA3 ---------- */
  push(
    B.aa([IC.lesen], 'AA3: Begründen – Lagerung (Positionierung) nach Leitsymptom:', 'Aus dem Erste-Hilfe-Kurs kennen viele: Schock → Beine hoch. Das stimmt nicht immer. Entscheidend ist das **Leitsymptom** – das Zeichen, das die Person gerade am meisten gefährdet.'),
    B.meta('20 min · Partnerarbeit (Yogamatte) → Einzelarbeit · AFB II · Ich-kann-Liste W2 Nr. 2 und 4 · KA-Bezug KB 1, Aufg. 3.3')
  );
  const pw = Math.floor(BREITE_HOCH / 4);
  const pikto = [
    ['lagerung_oberkoerper_hoch.png', 'Oberkörper hoch (halbsitzend)', '**Wann?** Atemnot steht im Vordergrund.', '**Warum?** Die Atemhilfsmuskulatur kann besser arbeiten, die Bauchorgane drücken nicht gegen das Zwerchfell.'],
    ['lagerung_beine_hoch.png', 'Flach, Beine hoch (Schocklage)', '**Wann?** Schockzeichen ohne Atemnot.', '**Warum?** Blut aus den Beinen fließt zum Körperstamm, das Herz bekommt mehr Blut. Nicht bei Atemnot und nicht bei Verletzungen an Beinen, Becken oder Wirbelsäule.'],
    ['lagerung_seitenlage.png', 'Stabile Seitenlage', '**Wann?** Bewusstlos, Atmung normal.', '**Warum?** Die Atemwege bleiben frei, Erbrochenes kann abfließen. Nach einem Unfall nur achsengerecht drehen.'],
    ['lagerung_nicht_bewegen.png', 'Nicht bewegen', '**Wann?** Verdacht auf Wirbelsäulenverletzung.', '**Warum?** Jede Bewegung kann das Rückenmark weiter schädigen. Kopf mit beiden Händen halten (Woche 4).']
  ];
  push(new Table({
    width: { size: pw * 4, type: WidthType.DXA }, columnWidths: [pw, pw, pw, pw], layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({ tableHeader: false, cantSplit: true, children: pikto.map((x) => B.zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [bild(x[0], 3.4, 1.93)] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [B.b(x[1], { size: 20 })] }), new Paragraph({ spacing: { after: 30 }, children: B.runs(x[2], { size: 18 }) }), new Paragraph({ spacing: { after: 0 }, children: B.runs(x[3], { size: 18 }) })], pw, { borders: rahmen(F.ORANGE_D, 6), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS } })) })
    ]
  }));
  push(
    new Paragraph({ spacing: { before: 60, after: 60 }, children: [B.emoji('⚠️ '), ...B.runs('**Bei Anaphylaxie:** nicht aufsitzen, aufstehen oder gehen lassen – das Blut kann „versacken“, ein Kreislaufstillstand droht. **Atmet die Person nicht normal → Reanimation** (KB III).', { size: 19 })] }),
    new Paragraph({ spacing: { after: 80 }, children: [B.i('Quelle: nach S2k-Leitlinie Akuttherapie und Management der Anaphylaxie (AWMF 061-025, 2021); Ich-kann-Liste KB I; sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] }),
    B.teil([IC.handy], '**a) Lagerungsparcours** (Partnerarbeit auf der Yogamatte):'),
    handy(T.SEITEN.lagerung, [
      B.p('Die App zieht eine Situationskarte. **Person A lagert Person B** innerhalb von 60 Sekunden und begründet: „Ich lagere …, weil …“. Dann tippen Sie auf **Aufdecken** und vergleichen. Wechseln Sie nach jeder Karte die Rollen.'),
      B.p('Sicherheit: behutsam lagern, nicht heben. Wer nicht gelagert werden möchte, übernimmt die Begründung. **Am Ende:** Ergänzen Sie den Merksatz.')
    ]),
    B.leer(80),
    merk('Merksatz AA3', 'aa3'),
    B.teil([IC.schreiben], '**b) Entscheidungsweg:** Ergänzen Sie, wie Sie lagern. Prüfen Sie die Fragen **von oben nach unten** – die erste Frage, die Sie mit „Ja“ beantworten, entscheidet.')
  );
  const wegW = [5600, BREITE_HOCH - 5600];
  push(B.tabelle([{ text: 'Frage', w: wegW[0] }, { text: '„Ja“ → so handle bzw. lagere ich', w: wegW[1] }], [
    ['1. Atmet die Person **nicht normal**?', { lsg: 'Reanimation beginnen (KB III)' }],
    ['2. Ist sie **bewusstlos**, atmet aber normal?', { lsg: 'stabile Seitenlage (nach Unfall achsengerecht)' }],
    ['3. Gibt es Hinweise auf eine **Wirbelsäulenverletzung**?', { lsg: 'nicht bewegen, Kopf mit beiden Händen halten' }],
    ['4. Steht **Atemnot** im Vordergrund?', { lsg: 'Oberkörper hoch (halbsitzend)' }],
    ['5. **Schockzeichen** ohne Atemnot?', { lsg: 'flach, Beine hoch' }]
  ], { hoehe: 420, schrift: 20 }));
  push(
    B.teil([IC.schreiben], '**c) Klausurtraining:**'),
    B.aufgaben([
      { nr: '3.1', vorsatz: 'Frau Carla Yıldız (55) hat in der Radiologie Kontrastmittel erhalten. Sie ist heiser und atmet pfeifend mit 30 Atemzügen pro Minute. Ihr Blutdruck liegt bei 90/55 mmHg.', text: 'Begründen Sie, warum Sie Frau Yıldız trotz des niedrigen Blutdrucks mit erhöhtem Oberkörper lagern.', punkte: 2 },
      { nr: '3.2', text: 'Nehmen Sie Stellung zu der Aussage: „Bei einem Schock legt man immer die Beine hoch.“', punkte: 2 }
    ]),
    B.zwischen('3.1'),
    B.linien(3, L(['Bei Frau Yıldız steht die Atemnot im Vordergrund (Heiserkeit, pfeifende Atmung, 30/min). Mit erhöhtem Oberkörper kann sie die Atemhilfsmuskulatur einsetzen, die Bauchorgane drücken nicht gegen das Zwerchfell.', 'Flach mit Beinen hoch würde die Atemnot verstärken. Nicht aufsetzen oder aufstehen lassen, Kreislauf engmaschig überwachen. (je schlüssiges Argument 1 P.)'])),
    B.zwischen('3.2'),
    B.linien(3, L(['Die Aussage ist falsch. Die Schocklage hilft nur bei Schockzeichen ohne Atemnot, weil Blut aus den Beinen zum Herzen fließt.', 'Entscheidend ist das Leitsymptom: bei Atemnot Oberkörper hoch, bei Bewusstlosigkeit mit normaler Atmung stabile Seitenlage, bei Verdacht auf Wirbelsäulenverletzung nicht bewegen; bei Verletzungen an Beinen oder Becken keine Schocklage. (Beurteilung 1 P., Begründung mit Gegenbeispiel 1 P.)']))
  );

  /* ---------- Teil B ---------- */
  push(
    B.abschnitt('Teil B · Anaphylaxie – im Team handeln'),
    B.aa([IC.handy], 'AA4: Ableiten – Notfall-Simulation:', 'Sie arbeiten in Ihrer Stammgruppe. Die App spielt die Patientin oder den Patienten und zeigt einen Monitor. **Was Sie tun, verändert die Werte.** Verteilen Sie die Rollen:'),
    B.meta('25 min · Gruppenarbeit (Stammgruppe 3–4) → Plenum · AFB II · Ich-kann-Liste W2 Nr. 3 · Lehrplan CE 06: Simulation von Notfallsituationen, I.4.a')
  );
  const rw = Math.floor(BREITE_HOCH / 3);
  push(B.tabelle([{ text: '🩺 Pflegefachperson', w: rw }, { text: '📟 Monitor & Stimme', w: rw }, { text: '📝 Protokoll', w: BREITE_HOCH - 2 * rw }], [[
    'Entscheidet und wählt in der App die Handlungen aus. Sagt laut, was sie tut und warum.',
    'Bedient das Handy, liest die Aussagen der Patientin/des Patienten und die Werte laut vor.',
    'Führt das Notfallprotokoll (Anlage): Uhrzeit, Werte, Maßnahme, Grundlage. In 4er-Gruppen zusätzlich: Beobachtung (Lagerung, Verantwortung).'
  ]], { schrift: 19 }));
  push(
    handy(T.SEITEN.simulation, [
      B.p('Spielen Sie die drei Varianten nacheinander (je ca. 6 Minuten) und **wechseln Sie nach jeder Runde die Rollen**:'),
      B.p('**A – Klinik:** Herr Kaiser (58), Eisen-Kurzinfusion · **B – Pflegeheim:** Frau Gruber (84), neues Schmerzmittel · **C – ambulante Pflege:** Herr Hager (66), Bienenstich, eigenes Notfallset'),
      B.p('Nach jeder Runde zeigt die App einen **Zeitstrahl**. Vergleichen Sie ihn mit Ihrem Protokoll. Nach der dritten Runde: Ergänzen Sie den Merksatz.')
    ]),
    B.leer(80),
    merk('Merksatz AA4', 'aa4'),
    B.teil([IC.schreiben], '**b) Nachbesprechung:** Es war jedes Mal ein anaphylaktischer Schock. **Begründen** Sie, warum Sie in den drei Varianten trotzdem unterschiedlich gelagert haben.'),
    B.linien(3, L(['Die Lagerung richtet sich nach dem Leitsymptom: A (Herr Kaiser) Atemnot → Oberkörper hoch; B (Frau Gruber) Kreislaufzeichen ohne Atemnot → flach, Beine hoch; C (Herr Hager) bewusstlos mit normaler Atmung → stabile Seitenlage.'])),
    B.teil([IC.schreiben], '**c) Klausurtraining:** Vergleichen Sie die Klinik (Variante A) mit dem Pflegeheim (Variante B).'),
    B.aufgaben([{ nr: '4.1', text: 'Nennen Sie 3 Maßnahmen, die Sie bei Herrn Kaiser zusätzlich zu den Maßnahmen bei Frau Gruber durchführen dürfen oder müssen. Begründen Sie jede Maßnahme.', punkte: 3 }]),
    B.linien(5, L([
      'z. B.: Infusion sofort stoppen, venösen Zugang belassen – das Allergen fließt sonst weiter; den Zugang braucht das Notfallteam für Medikamente und Volumen.',
      'Adrenalin 0,5 mg i. m. in die Außenseite des Oberschenkels nach Notfall-SOP – die SOP erlaubt Pflegefachpersonen die Gabe (bei Frau Gruber gibt es keine Anordnung und keine SOP).',
      'Sauerstoff nach SOP (Maske mit Reservoir) – Atemnot, SpO₂ ↓; die SOP erlaubt die Gabe.',
      'Volumengabe nach ärztlicher Anordnung vorbereiten – der Zugang liegt bereits.',
      'Notfallteam der Klinik statt Notruf 112 – Ärztin ist im Haus und schnell da.',
      '(je Maßnahme mit Begründung 1 P., max. 3 P.)'
    ]))
  );

  /* ---------- AA5 ---------- */
  push(
    B.aa([IC.beurteilen], 'AA5: Unterscheiden – Wer darf was?', '**a) Aufstellung:** Ihre Lehrkraft liest Maßnahmen vor. Stellen Sie sich in die passende Ecke des Raums und **begründen** Sie Ihre Wahl. Tragen Sie danach die Maßnahmen aus dem Wortspeicher in die Tabelle ein.'),
    B.meta('12 min (a und b) · Plenum (Aufstellung) → Einzelarbeit → Partnerarbeit → Plenum · AFB II–III · Ich-kann-Liste W2 Nr. 3 und 4 · Kompetenz III.2.b'),
    B.kasten([B.p('Infusion stoppen, Zugang belassen · Hilfe holen (Notfallteam bzw. 112) · nach Leitsymptom lagern · Puls, Blutdruck, Atmung, SpO₂ messen · Adrenalin i. m. geben · Sauerstoff geben · Antihistaminikum geben · Infusion zur Volumengabe anschließen · eigenen Autoinjektor nach dem ärztlichen Notfallplan anwenden · Diagnose „anaphylaktischer Schock“ stellen · Ereignis dokumentieren · über weitere Therapie und Dauer der Überwachung entscheiden', { spacing: { after: 0, line: 276 } })], { kopf: 'Wortspeicher', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R })
  );
  const vw = Math.floor(BREITE_HOCH / 3);
  push(B.tabelle([{ text: '🟢 mache ich selbst (eigenverantwortlich)', w: vw }, { text: '🟡 nur nach ärztlicher Anordnung (n. ä. A.) oder SOP', w: vw }, { text: '🔴 ärztliche Aufgabe', w: BREITE_HOCH - 2 * vw }], [[
    { lsg: 'Infusion stoppen, Zugang belassen; Hilfe holen (Notfallteam bzw. 112); nach Leitsymptom lagern; Puls, Blutdruck, Atmung, SpO₂ messen; Ereignis dokumentieren' },
    { lsg: 'Adrenalin i. m.; Sauerstoff; Antihistaminikum; Infusion zur Volumengabe; eigenen Autoinjektor nach dem Notfallplan (der Plan ist die ärztliche Anordnung für diese Person)' },
    { lsg: 'Diagnose stellen; über weitere Therapie und Dauer der Überwachung entscheiden; Medikamente anordnen' }
  ]], { hoehe: 2000, schrift: 19, kopfFill: F.LACHS_KOPF }));
  push(
    B.leer(80),
    B.kasten([
      new Paragraph({ spacing: { after: 60, line: 264 }, children: [B.i('„[Pflegefachpersonen] treffen in lebensbedrohlichen Situationen erforderliche Interventionsentscheidungen und leiten lebenserhaltende Sofortmaßnahmen bis zum Eintreffen der Ärztin oder des Arztes ein.“'), B.t(' (PflAPrV, Anlage 1, I.4.a; vgl. § 5 PflBG)', { size: 18 })] }),
      B.p('**Eigenverantwortlich:** Gefahr erkennen, Hilfe holen, Allergen stoppen, lagern, überwachen, dokumentieren.'),
      B.p('**Nur nach ärztlicher Anordnung (n. ä. A.) oder SOP:** Medikamente – auch Adrenalin –, Sauerstoff und Infusionen. Eine **Notfall-SOP** ist eine schriftliche, ärztlich freigegebene Handlungsanweisung der Einrichtung für eine bestimmte Notfallsituation. Pflegende „wirken … an der Durchführung ärztlich veranlasster Maßnahmen … mit“ (III.2.b).'),
      B.p('**Als Auszubildende/r:** unter Anleitung handeln, sofort eine Pflegefachperson holen, die eigenen Grenzen kennen.', { spacing: { after: 0 } })
    ], { kopf: 'Informationstext: Verantwortung im Notfall' }),
    B.teil([IC.beurteilen], '**b) Adrenalin oder Antihistaminikum?** Lesen Sie den Informationstext und den Dialog.')
  );
  const aw = [3900, BREITE_HOCH - 3900];
  push(
    B.tabelle([{ text: 'Problem bei der Anaphylaxie', w: aw[0] }, { text: 'Wirkung von Adrenalin', w: aw[1] }], [
      ['Gefäße weit → Blutdruck fällt', 'Gefäße eng → Blutdruck steigt'],
      ['Schleimhäute geschwollen (Kehlkopf, Lippen)', 'Schleimhäute schwellen ab'],
      ['Bronchien eng → Atemnot', 'Bronchien weit'],
      ['Herz muss mehr leisten', 'Herz schlägt kräftiger'],
      ['Mastzellen setzen weiter Histamin frei', 'weniger Histamin wird freigesetzt']
    ], { schrift: 19 }),
    B.p('Adrenalin wirkt von allen Notfallmedikamenten bei Anaphylaxie **am schnellsten**. Erwachsene erhalten 0,3–0,5 mg in den Muskel an der **Außenseite des Oberschenkels** (auch als Fertigspritze, sog. Autoinjektor); nach 5–10 Minuten kann die Gabe wiederholt werden. **Antihistaminika** blockieren nur die Histamin-Wirkung, wirken langsamer und haben keine belegte Wirkung auf Kreislauf und Bronchien. **Glukokortikoide** (Kortison) wirken erst nach Stunden. Beide kommen erst **nach** Adrenalin – sie ersetzen es nicht.', { spacing: { before: 80, after: 40, line: 264 } }),
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
    B.p('**Think:** Wer hat recht? Notieren Sie zwei Argumente (2 Min.). **Pair:** Vergleichen Sie mit Ihrer Partnerin oder Ihrem Partner (2 Min.). **Share:** Einige Paare stellen vor.', { spacing: { before: 100, after: 80 } }),
    B.aufgaben([{ nr: '5.1', text: 'Nehmen Sie Stellung zu der Aussage von Herrn Brandt.', punkte: 3 }]),
    B.linien(4, L(['Die Aussage ist fachlich falsch. Beim anaphylaktischen Schock ist Adrenalin i. m. das Mittel der ersten Wahl (nach SOP bzw. ärztlicher Anordnung): Es stellt die Gefäße eng und hebt den Blutdruck, lässt die Schleimhäute abschwellen, weitet die Bronchien und wirkt am schnellsten.', 'Ein Antihistaminikum blockiert nur Histamin, wirkt langsamer und hebt weder den Blutdruck noch weitet es die Bronchien. Es darf Adrenalin nicht verzögern und kann danach gegeben werden.', 'Lina sollte die SOP ansprechen und sofort das Notfallteam bzw. die Ärztin einbeziehen. (Beurteilung 1 P., je fachliches Argument 1 P., max. 3 P.)']))
  );

  /* ---------- AA6 Klausurtraining ---------- */
  push(
    B.abschnitt('Klausurtraining: Sofortmaßnahmen ableiten und dokumentieren'),
    B.aa([IC.schreiben], 'AA6: Klausurtraining – Transferfall:', 'Lösen Sie die Aufgaben **allein und ohne Unterlagen** (ca. 8 Minuten). Tauschen Sie dann mit einer Person aus einer **anderen** Stammgruppe. Bewerten Sie deren Lösung mit dem **Bewertungsraster in der App** und geben Sie eine Rückmeldung in einem Satz.'),
    B.meta('15 min · Einzelarbeit → Peer-Korrektur mit App-Raster · AFB I–III · KA-Format (KB 1, Aufg. 3.3) · Examensvorbild: Mai 2024 Tag 3, Aufg. 8.2; Mai 2026 Tag 1, Aufg. 3.2'),
    B.kasten([
      B.p('Sie sind in der Tagespflege „Sonnenhof“ eingesetzt. Herr Klaus Martens (74) hat einen Diabetes mellitus Typ 2 und eine Herzinsuffizienz. Gegen 14:15 Uhr sitzt er mit anderen Gästen auf der Terrasse beim Kaffee. Plötzlich schreit er auf: Eine Wespe hat ihn in die Oberlippe gestochen.'),
      B.p('Nach etwa fünf Minuten ist seine Oberlippe stark geschwollen, am Hals bilden sich Quaddeln. Mit kloßiger Stimme sagt er: „Mir ist so eng im Hals.“ Beim Einatmen hören Sie ein pfeifendes Geräusch. Sie messen: Atemfrequenz 28/min, Puls 124/min, Blutdruck 92/60 mmHg (am Morgen: 150/85 mmHg). In der Tagespflege ist keine Ärztin anwesend. Ein Notfallset hat Herr Martens nicht dabei.', { spacing: { after: 0, line: 264 } })
    ], { kopf: 'Fallsituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    B.leer(80),
    new Paragraph({ spacing: { after: 60 }, children: [B.i('Pflegefachpersonen treffen in lebensbedrohlichen Situationen erforderliche Interventionsentscheidungen und leiten lebenserhaltende Sofortmaßnahmen ein.')] }),
    B.aufgaben([
      { nr: '6.1', text: 'Beschreiben Sie stichwortartig 5 Sofortmaßnahmen, die Sie bei Herrn Martens bis zum Eintreffen des Rettungsdienstes einleiten. Begründen Sie dabei die Positionierung von Herrn Martens.', punkte: 6 },
      { nr: '6.2', text: 'Kennzeichnen Sie in Ihrer Antwort zu 6.1 jede Maßnahme, die Sie nur nach ärztlicher Anordnung durchführen dürfen, mit „n. ä. A.“.', punkte: 1 },
      { nr: '6.3', vorsatz: 'Der Rettungsdienst hat Herrn Martens übernommen.', text: 'Nennen Sie 6 Informationen, die Sie in der Pflegedokumentation festhalten.', punkte: 3 }
    ]),
    B.zwischen('6.1 und 6.2'),
    B.linien(8, L([
      'z. B.: Hilfe holen: eine Kollegin setzt den Notruf 112 ab (Notärztin nötig); Herrn Martens nicht allein lassen.',
      'Oberkörper hoch (halbsitzend), weil Atemnot und Schwellung im Vordergrund stehen (Kloßgefühl, pfeifende Einatmung, 28/min): Die Atemhilfsmuskulatur kann arbeiten. Keine Schocklage – auch wegen der Herzinsuffizienz. Nicht aufstehen oder gehen lassen.',
      'Vitalzeichen engmaschig überwachen: Atmung, Puls, Blutdruck, Bewusstsein, wenn vorhanden SpO₂ (Schockindex 124 : 92 ≈ 1,3).',
      'Beengende Kleidung am Hals öffnen; Einstichstelle zusätzlich kühlen (Kühlpack in ein Tuch gewickelt).',
      'Nichts zu essen oder zu trinken geben (Schwellung, Aspirationsgefahr).',
      'Adrenalin i. m. (n. ä. A.) – gibt hier die Notärztin, da keine Anordnung und kein Notfallset vorliegen; Sauerstoff (n. ä. A.).',
      'Uhrzeit, Werte und Maßnahmen notieren; bei Bewusstlosigkeit mit normaler Atmung stabile Seitenlage, ohne normale Atmung Reanimation (KB III).',
      '6.1: je beschriebene Maßnahme 1 P. (max. 5), Begründung der Positionierung 1 P.; Schocklage trotz Atemnot oder Antihistaminikum statt Adrenalin wird nicht gewertet. 6.2: 1 P., wenn alle Medikamenten- und Sauerstoff-Maßnahmen mit „n. ä. A.“ gekennzeichnet sind.'
    ])),
    B.zwischen('6.3'),
    B.linien(4, L([
      'z. B. (je 0,5 P.): Uhrzeit des Stichs und Beginn der Beschwerden · Auslöser (Wespenstich Oberlippe) · Symptome (Lippenschwellung, Quaddeln, Kloßgefühl, pfeifende Atmung) · Vitalwerte mit Uhrzeit (AF 28/min, Puls 124/min, RR 92/60 mmHg, Vorwert 150/85) · Maßnahmen mit Uhrzeit und Namenskürzel (Notruf, Lagerung, Überwachung) · Übergabe an den Rettungsdienst (Uhrzeit, Zielklinik) · Information der Angehörigen bzw. Hausärztin · Insektengiftallergie in der Akte vermerken · Hinweis auf Nachbeobachtung wegen möglicher zweiter Reaktion (zweigipfliger Verlauf) weitergeben.'
    ])),
    handy(T.SEITEN.raster, [B.p('**Peer-Korrektur:** Öffnen Sie das Bewertungsraster, haken Sie ab, was Ihre Partnerin oder Ihr Partner geschrieben hat. Die App zählt die Punkte – wie im Erwartungshorizont der Klassenarbeit.')]),
    B.punktezeile(10)
  );

  /* ---------- AA7 ---------- */
  push(
    B.abschnitt('Teil C · Zurück zu Frau Maler'),
    B.aa([IC.lesen, IC.schreiben], 'AA7: Erklären – Placemat:', 'Arbeiten Sie zu viert mit der Placemat (A3). Jede Person übernimmt ein **Außenfeld** – einen Zeitpunkt aus Christins Bericht – und notiert still: Was steckt dahinter? Gehört es zur Kette? Was hätte Christin selbst tun können? (3 Min.) Drehen Sie die Placemat und lesen Sie die anderen Felder (3 Min.). **Einigen Sie sich in der Mitte** auf die Kausalkette und beantworten Sie gemeinsam die Leitfrage (4 Min.).'),
    B.meta('15 min · Gruppenarbeit (4er, Placemat) → Plenum · AFB III · Ich-kann-Liste W2 Nr. 5 · Brücke zu Woche 4 (Aspiration) und Woche 7 (Thrombose)'),
    B.p('**Tipp:** Erinnern Sie sich an die Thromboseprophylaxe aus dem 1. Ausbildungsjahr. Nicht jeder Zeitpunkt gehört zur Kette!'),
    lsg ? B.kasten([
      B.p('**Feld Wade (morgens):** Wade dick, Schmerz beim Auftreten → Verdacht auf tiefe Beinvenenthrombose (Immobilität nach Hüft-TEP, Angst vor Luxation). Gehört zur Kette. Christin: sofort weitergeben, nicht massieren, nicht mobilisieren bis zur ärztlichen Abklärung.'),
      B.p('**Feld Frühstück:** verschluckt sich, hustet kräftig → leichte Atemwegsverlegung; Husten lassen war richtig. Gehört **nicht** zur Kette (Woche 4).'),
      B.p('**Feld 11 Uhr:** Luftnot, P 118, RR 105/70, blass, kaltschweißig, unruhig → Lungenembolie mit obstruktivem Schock (kompensiert, Schockindex ≈ 1,1). Sofort Hilfe holen, Oberkörper hoch, nicht mobilisieren, nicht allein lassen, überwachen.'),
      B.p('**Feld Mittag:** zyanotisch, keine Reaktion, kein Puls → Kreislaufstillstand; Hilfe rufen, Reanimation (KB III).'),
      B.p('**Mitte (Kette):** Immobilität → tiefe Beinvenenthrombose → Lungenembolie → obstruktiver Schock → Kreislaufstillstand.', { spacing: { after: 0 } })
    ], { kopf: 'Lösung Placemat', fill: 'FFFFFF', kopfFill: 'FFF2CC', rand: F.GRAU_R }) : null,
    B.teil([IC.schreiben], '**Klausurtraining** (in der Stunde beginnen, zu Hause fertigstellen):'),
    new Paragraph({ spacing: { after: 60 }, children: [B.i('Frau Maler zeigte bereits Stunden vor dem Kreislaufstillstand Warnzeichen.')] }),
    B.aufgaben([
      { nr: '7.1', text: 'Erläutern Sie in Bezug auf die Situation von Frau Maler, wie es von ihrer Immobilität bis zum Kreislaufstillstand kommen konnte.', punkte: 5 },
      { nr: '7.2', text: 'Beschreiben Sie 3 Maßnahmen, die um 11 Uhr hätten eingeleitet werden müssen. Begründen Sie die Positionierung von Frau Maler.', punkte: 4 }
    ]),
    B.zwischen('7.1'),
    B.linien(5, L([
      'Nach der Hüft-TEP liegt Frau Maler aus Angst vor einer Luxation fast nur im Bett (Immobilität) → das Blut fließt in den Beinvenen langsamer und gerinnt nach der Operation leichter → tiefe Beinvenenthrombose (rechte Wade dick, schmerzt beim Auftreten) – trotz Heparin.',
      'Ein Teil des Gerinnsels löst sich (möglicherweise beim Aufsetzen an der Bettkante) und wird über das rechte Herz in die Lungenarterie geschwemmt → Lungenembolie: Das Blut kann nicht mehr ungehindert durch die Lunge fließen.',
      'Das linke Herz bekommt zu wenig Blut, das Herzzeitvolumen sinkt → obstruktiver Schock (11 Uhr: Luftnot, Puls 118/min, Blässe, kalter Schweiß, Unruhe; Schockindex ≈ 1,1).',
      'Ohne Behandlung dekompensiert der Kreislauf → Kreislaufstillstand (Mittag: Zyanose, kein Puls). (je schlüssiges Glied mit Fallbezug 1 P., max. 5 P.)'
    ])),
    B.zwischen('7.2'),
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
    handy(T.SEITEN.entscheidung2, [
      B.p('Jetzt wissen Sie mehr. Scannen Sie diesen QR-Code und entscheiden Sie **dieselben sechs Notfälle** noch einmal. Danach sehen Sie die Auflösung – und Ihre Vermutungen vom Stundenbeginn daneben.'),
      B.p('Vergleichen Sie am Beamer: Bei welcher Frage hat sich die Klasse am stärksten verändert?')
    ]),
    new Paragraph({ spacing: { before: 80, after: 80 }, children: [B.b('Ich-kann-Liste Woche 2: '), B.t('Schätzen Sie sich ein: '), B.emoji('☺'), B.t(' sicher · '), B.emoji('😐'), B.t(' teilweise · '), B.emoji('☹'), B.t(' noch nicht. Bei 😐 oder ☹ notieren Sie, wo Sie nachlesen.')] })
  );
  const ikl = [
    ['1. … den hypovolämischen, den anaphylaktischen und den neurogenen Schock vergleichen.', 'Expertenblätter, AA2'],
    ['2. … die Lagerung nach Leitsymptom beschreiben und begründen.', 'AA3, AA4b'],
    ['3. … Sofortmaßnahmen bei einem anaphylaktischen Schock ableiten und meine Verantwortung beschreiben.', 'AA4, AA5, AA6'],
    ['4. … falsche Aussagen zum Schock identifizieren und die Korrektur fachlich begründen.', 'Einstieg, AA3.2, AA5.1'],
    ['5. … am Fall Frau Maler die Kausalkette bis zum Kreislaufstillstand erklären.', 'AA7']
  ];
  push(B.tabelle([{ text: 'Ich kann …', w: 5300 }, { text: '☺ 😐 ☹', w: 1100 }, { text: 'Nachlesen in …', w: BREITE_HOCH - 6400 }], ikl.map((z) => [z[0], '', lsg ? { lsg: z[1] } : ''])  , { hoehe: 480, schrift: 19 }));
  push(
    new Paragraph({ spacing: { before: 160, after: 60 }, children: [B.b('Zurück zur Leitfrage: '), B.i('Woher kommt Frau Malers Luftnot – und wie hätte man sie um 11 Uhr lagern müssen?')] }),
    B.linien(2, L(['Die Luftnot kommt von einer Lungenembolie: Ein Gerinnsel aus der Beinvene hat die Lungenstrombahn verlegt → obstruktiver Schock. Um 11 Uhr: Oberkörper hoch (Luftnot im Vordergrund), nicht mobilisieren, nicht allein lassen, sofort Hilfe holen und engmaschig überwachen.']))
  );

  /* ---------- Hausaufgabe ---------- */
  push(B.umbruch());
  push(
    B.abschnitt('Hausaufgabe · Klausurtraining wie im Examen'),
    new Paragraph({ spacing: { after: 100 }, children: [B.b('Bearbeitungszeit: ca. 26 Minuten · Hilfsmittel: keine · 20 Punkte'), B.t(' – Lösen Sie die Aufgaben wie in einer Prüfung. Kontrollieren Sie sich danach selbst mit der App.')] }),
    B.meta('ca. 26 min (1,3 min je Punkt wie im Examen) · Einzelarbeit zu Hause · AFB I–III · Examensformat: Ausgangssituation, Rahmensatz je Aufgabe, Situationswechsel im Aufgabenstamm (vgl. Mai 2024 Tag 1, 1.2; Mai 2024 Tag 3, 8.1–8.2; Mai 2026 Tag 1, 1.3)'),
    B.kasten([
      B.p('Sie arbeiten als Auszubildende bzw. Auszubildender im zweiten Ausbildungsdrittel in der orthopädischen Rehabilitationsklinik „Talblick“. Frau Sabine Lorenz (52) ist seit einer Woche nach einer Bandscheibenoperation an der Lendenwirbelsäule bei Ihnen. Sie ist verheiratet, arbeitet als Bankkauffrau und möchte „so schnell wie möglich wieder fit sein“. In ihrem Allergiepass steht eine Fischallergie. Ihr Notfallset hat sie zu Hause vergessen.'),
      B.p('Beim Mittagessen um 12:20 Uhr isst sie Gemüsecurry. Erst später stellt sich heraus, dass die Soße mit Fischsauce gewürzt war. Um 12:35 Uhr klingelt Frau Lorenz. Sie kratzt sich an den Händen und an der Kopfhaut, am Bauch sind Quaddeln zu sehen. Sie sagt: „Mir ist so schwindelig und übel.“ Sie ist blass und unruhig. Sie messen: Puls 124/min, Blutdruck 86/52 mmHg, Atemfrequenz 20/min, Sauerstoffsättigung 96 %. Bei der Morgenrunde lagen der Blutdruck bei 128/78 mmHg und der Puls bei 72/min. Ihre Stimme klingt normal, sie hat keine Atemnot. Die Stationsärztin ist im Haus erreichbar; für allergische Notfälle gibt es eine Notfall-SOP.', { spacing: { after: 0, line: 264 } })
    ], { kopf: 'Ausgangssituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    B.zwischen('Aufgabe 1 (7 Punkte)'),
    new Paragraph({ spacing: { after: 60 }, children: [B.i('Pflegefachpersonen schätzen akute Situationen anhand von Beobachtungen und Messwerten ein.')] }),
    B.aufgaben([
      { nr: '1.1', text: 'Beurteilen Sie aus pflegerischer Perspektive die im vorliegenden Fall beschriebenen Messdaten von Frau Lorenz: a) Puls b) Blutdruck', punkte: 3 },
      { nr: '1.2', text: 'Begründen Sie anhand von 4 Symptomen aus der Situation, dass bei Frau Lorenz ein anaphylaktischer Schock vorliegt.', punkte: 4 }
    ]),
    B.linien(7, L([
      '1.1 a) Puls 124/min: deutlich erhöht (Tachykardie), Anstieg von 72/min → der Kreislauf versucht auszugleichen. (1,5 P.)',
      '1.1 b) Blutdruck 86/52 mmHg: zu niedrig, deutlicher Abfall vom Vorwert 128/78 mmHg; Schockindex 124 : 86 ≈ 1,4 (über 1) → spricht für einen Schock. (1,5 P.)',
      '1.2 z. B. (je Symptom mit Zuordnung 1 P.): zeitlicher Zusammenhang – Beginn 15 Min. nach dem Essen mit Fischsauce bei bekannter Fischallergie · Haut – Juckreiz an Händen und Kopfhaut, Quaddeln am Bauch · Kreislauf – Puls 124/min, Blutdruckabfall von 128/78 auf 86/52 mmHg, Blässe, Schwindel · Magen-Darm – Übelkeit · Gehirn – Unruhe (Minderdurchblutung).',
      'Für die volle Punktzahl muss die Kreislaufbeteiligung genannt sein (wie in der Klassenarbeit).'
    ])),
    B.zwischen('Aufgabe 2 (9 Punkte)'),
    new Paragraph({ spacing: { after: 60 }, children: [B.i('Pflegefachpersonen treffen in lebensbedrohlichen Situationen erforderliche Interventionsentscheidungen und leiten Sofortmaßnahmen ein.')] }),
    B.aufgaben([
      { nr: '2.1', text: 'Beschreiben Sie stichwortartig 6 Sofortmaßnahmen, die Sie bei Frau Lorenz einleiten. Begründen Sie die Positionierung.', punkte: 7 },
      { nr: '2.2', vorsatz: 'Fünf Minuten später ist Frau Lorenz heiser und sagt: „Ich krieg so schlecht Luft.“ Die Sauerstoffsättigung sinkt auf 90 %.', text: 'Begründen Sie, wie Sie Frau Lorenz jetzt positionieren.', punkte: 2 }
    ]),
    B.linien(8, L([
      '2.1 z. B.: nicht weiteressen (Allergen stoppen) · Hilfe holen: Stationsärztin bzw. Notfallteam alarmieren, Frau Lorenz nicht allein lassen · flach lagern, Beine hoch, weil Kreislaufzeichen ohne Atemnot im Vordergrund stehen → mehr Blut zum Herzen; nicht aufsetzen oder aufstehen lassen · Adrenalin i. m. nach Notfall-SOP bzw. ärztlicher Anordnung vorbereiten/verabreichen (Außenseite Oberschenkel) · venösen Zugang und Volumengabe n. ä. A. vorbereiten · Sauerstoff n. ä. A./SOP · Vitalzeichen engmaschig (Puls, Blutdruck, Atmung, SpO₂, Bewusstsein) · Uhrzeit, Symptome und Maßnahmen dokumentieren.',
      '(je Maßnahme 1 P., max. 6 P.; Begründung der Positionierung 1 P.; Antihistaminikum statt Adrenalin wird nicht gewertet)',
      '2.2 Jetzt Oberkörper hoch (halbsitzend), weil die Atemnot im Vordergrund steht (Heiserkeit = Schleimhautschwellung, SpO₂ 90 %): Die Atemhilfsmuskulatur kann arbeiten. Trotzdem nicht auf die Bettkante setzen oder aufstehen lassen; Kreislauf weiter überwachen und die Ärztin über die Verschlechterung informieren. (Positionierung 1 P., Begründung 1 P.)'
    ])),
    B.zwischen('Aufgabe 3 (4 Punkte)'),
    new Paragraph({ spacing: { after: 60 }, children: [B.i('Pflegefachpersonen steuern den Pflegeprozess auch nach einem Notfall.')] }),
    B.aufgaben([{ nr: '3.1', vorsatz: 'Frau Lorenz geht es nach der Behandlung besser. Die Ärztin ordnet an, sie 24 Stunden lang zu überwachen.', text: 'Formulieren Sie 1 Pflegeproblem von Frau Lorenz im PESR-Format.', punkte: 4 }]),
    B.linien(5, L([
      'P: Frau Lorenz ist gefährdet, erneut eine anaphylaktische Reaktion bis hin zum Schock zu entwickeln (zweigipfliger Verlauf möglich).',
      'E: Fischallergie; anaphylaktischer Schock um 12:35 Uhr nach Fischsauce; Notfallset nicht vorhanden.',
      'S: (Risiko – darauf wird geachtet) Juckreiz, Quaddeln, Heiserkeit, Atemnot, Schwindel, Puls ↑, Blutdruck ↓.',
      'R: kennt ihre Allergie und hat einen Allergiepass; ist wach und kann Beschwerden sofort mitteilen; möchte rasch wieder gesund werden. (je P, E, S, R 1 P.)'
    ])),
    handy(T.SEITEN.transfer, [B.p('**Selbstkontrolle:** Die App zeigt die Musterlösung erst, wenn Sie bestätigen, dass Ihre Antwort auf dem Papier steht. Dann haken Sie ab und zählen Ihre Punkte.')]),
    B.punktezeile(20)
  );
  return k;
}

/* =====================================================================
   ANLAGEN: Expertenblätter A/B/C, Notfallprotokoll, Placemat, Schilder
   ===================================================================== */
function expertenblatt(B, key, { lsg }) {
  const e = T.EXPERTEN[key];
  const k = [];
  const push = (...x) => k.push(...x.filter(Boolean));
  const seite = T.SEITEN['markieren' + e.buchstabe];
  push(
    B.titel(`Expertenblatt ${e.buchstabe} · ${e.form}`, lsg ? '[LSG]' : null),
    B.p('**Ihre Aufgabe als Expertin oder Experte:** Gleich erklären Sie Ihrer Stammgruppe Ihre Schockform. Bearbeiten Sie dafür die Aufträge a–c in Ihrer Expertengruppe.'),
    B.kasten(e.fall.map((x, i) => B.p(x, i === e.fall.length - 1 ? { spacing: { after: 0, line: 264 } } : {})), { kopf: 'Fallsituation', fill: F.GRAU_HELL, kopfFill: F.GRAU_HELL, rand: F.GRAU_R }),
    B.teil([IC.handy, IC.markieren], '**a) Identifizieren:** Markieren Sie in der App alle Stellen im Fall, die auf einen Schock hinweisen.'),
    B.handy(seite, [B.p('Scannen Sie den QR-Code und tragen Sie **Vorname + Raumcode** ein. Tippen Sie im Fall alle Hinweise auf einen Schock an. Die App zeigt Ihnen, was Sie übersehen haben. **Am Ende:** Ergänzen Sie den Merksatz.')], { linkBasis: T.LINK_BASIS, qrDatei: QR(seite) }),
    B.leer(60),
    B.merksatz('Merksatz AA1', [T.MERKSAETZE.aa1]),
    B.leer(100),
    B.kasten([...e.info.map((x) => B.p(x)), new Paragraph({ spacing: { after: 0 }, children: [B.i('Quelle: nach MSD Manual Profi-Ausgabe: Schock; S2k-Leitlinie Anaphylaxie (AWMF 061-025, 2021); Ich-kann-Liste KB I; sprachlich vereinfacht.', { size: 15, color: F.GRAU_T })] })], { kopf: `Informationstext ${e.buchstabe}: ${e.form}` }),
    new Paragraph({ spacing: { before: 40, after: 100 }, children: [B.b('Wörterhilfe: ', { size: 17 }), B.t(e.woerter, { size: 17 })] }),
    B.teil([IC.schreiben], `**b) Klausurtraining:**`),
    B.aufgaben([{ nr: 'b', text: `Begründen Sie anhand von 4 Symptomen aus der Situation, dass bei ${e.person} ein ${e.adjektiv} Schock vorliegt.`, punkte: 4 }]),
    new Paragraph({ spacing: { before: 40, after: 40 }, children: [B.i('Tipp wie in der Klassenarbeit: Ordnen Sie jedes Symptom zu (z. B. Kreislauf, Haut, Atemwege) und erklären Sie kurz, was es zeigt. Ohne Kreislaufzeichen gibt es nicht die volle Punktzahl.', { size: 18 })] }),
    B.linien(5, lsg ? ['z. B. (je Symptom mit Zuordnung 1 P.): ' + e.nennen.join(' · '), 'Werte nur mit Vorwert-Vergleich voll werten; für die volle Punktzahl muss die Kreislaufbeteiligung genannt sein (vgl. Erwartungshorizont KA, Aufg. 3.1).'] : []),
    B.teil([IC.schreiben], '**c) Expertenkarte:** Fassen Sie zusammen, was Ihre Stammgruppe wissen muss. Damit erklären Sie gleich.')
  );
  const kw = [2600, B.breite - 2600];
  const kk = e.karte;
  push(B.tabelle([{ text: 'Meine Schockform', w: kw[0] }, { text: e.form, w: kw[1] }], [
    ['**Ursache**', { lsg: kk.ursache }],
    ['**Entstehung** (in Pfeilen)', { lsg: kk.entstehung }],
    ['**Puls · Haut · weitere Zeichen**', { lsg: kk.zeichen }],
    ['**Das gibt es nur bei meiner Schockform**', { lsg: kk.nur }],
    ['**Darauf achte ich besonders**', { lsg: kk.achten }],
    ['**Lagerung und erste Sofortmaßnahme**', { lsg: kk.erstes }]
  ], { hoehe: 700, schrift: 19 }));
  return k;
}

function notfallprotokoll(B) {
  const k = [B.titel('Notfallprotokoll · AA4 Simulation'), B.p('Die Person mit der Rolle **Protokoll** füllt in jeder Runde eine Tabelle aus. Grundlage: **E** = eigenverantwortlich · **A** = nach ärztlicher Anordnung (n. ä. A.) · **S** = nach Notfall-SOP.')];
  const sp = [{ text: 'Uhrzeit (Sim.)', w: 1200 }, { text: 'Beobachtung / Werte', w: 3300 }, { text: 'Maßnahme', w: 3100 }, { text: 'E / A / S', w: B.breite - 7600 }];
  for (const [v, titel] of [['A', 'Klinik – Herr Kaiser (58)'], ['B', 'Pflegeheim – Frau Gruber (84)'], ['C', 'Ambulante Pflege – Herr Hager (66)']]) {
    k.push(B.zwischen(`Runde ${'ABC'.indexOf(v) + 1} · Variante ${v}: ${titel}   ·   Protokoll: ${'_'.repeat(16)}`));
    k.push(B.tabelle(sp, Array.from({ length: 6 }, () => ['', '', '', '']), { hoehe: 400, schrift: 18 }));
  }
  k.push(B.p('**Nach jeder Runde:** Vergleichen Sie Ihr Protokoll mit dem Zeitstrahl in der App. Fehlt etwas, das in die Dokumentation gehört (z. B. Allergie vermerken, Nachbeobachtung)?', { spacing: { before: 120 } }));
  return k;
}

function placemat(B) {
  const w = B.breite;
  const r = rahmen('000000', 8);
  const feld = (titel, zitat, w2, o = {}) => B.zelle([
    new Paragraph({ spacing: { after: 40 }, children: [B.b(titel, { size: 20 })] }),
    new Paragraph({ spacing: { after: 60 }, children: [B.i(zitat, { size: 18 })] }),
    new Paragraph({ spacing: { after: 0 }, children: [B.t('Was steckt dahinter? · Gehört es zur Kette? · Was hätte Christin selbst tun können?', { size: 15, color: F.GRAU_T })] })
  ], w2, { borders: r, ...o });
  const seit = 2700, mitte = w - 2 * seit;
  return [
    B.titel('Placemat · AA7 „Zurück zu Frau Maler“'),
    B.p('Auf **A3** kopieren. Jede Person schreibt in ihr Außenfeld, danach einigt sich die Gruppe in der Mitte.', { alignment: AlignmentType.CENTER }),
    new Table({
      width: { size: w, type: WidthType.DXA }, columnWidths: [seit, mitte, seit], layout: TableLayoutType.FIXED,
      rows: [
        new TableRow({ height: { value: 3000, rule: HeightRule.ATLEAST }, children: [feld('Feld 1 · Morgens bei der Körperpflege', '„… klagte sie, ihre rechte Wade sei seit gestern dick und tue beim Auftreten weh.“', w, { columnSpan: 3 })] }),
        new TableRow({ height: { value: 5200, rule: HeightRule.ATLEAST }, children: [
          feld('Feld 4 · Zum Mittagessen', '„Frau Maler war blau angelaufen, ihre Augen waren starr nach oben gerichtet … ansprechen und den Puls zu fühlen. Beides ohne Erfolg.“', seit),
          B.zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [B.b('MITTE: Unsere Kausalkette', { size: 22 })] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [B.t('Immobilität → … → … → … → Kreislaufstillstand', { size: 18, color: F.GRAU_T })] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.b('Leitfrage: ', { size: 18 }), B.i('Woher kommt die Luftnot – und wie hätte man Frau Maler um 11 Uhr lagern müssen?', { size: 18 })] })], mitte, { borders: rahmen('C55A11', 16), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS_HELL }, verticalAlign: VerticalAlign.TOP }),
          feld('Feld 2 · Beim Frühstück', '„Beim Frühstück verschluckte sie sich am Kaffee und hustete kräftig. Ich ließ sie husten, und nach kurzer Zeit war alles wieder gut.“', seit)
        ] }),
        new TableRow({ height: { value: 3000, rule: HeightRule.ATLEAST }, children: [feld('Feld 3 · Gegen 11 Uhr', '„… wirkte sie unruhig, atmete schnell und sagte, sie bekomme schlecht Luft. Sie war blass, hatte kalten Schweiß auf der Stirn, ihr Puls lag bei 118/min und der Blutdruck bei 105/70 mmHg.“', w, { columnSpan: 3 })] })
      ]
    })
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
    B.p('**Kompetenzbezug:** Anlage 1 PflAPrV I.1.d, I.4.a, I.4.c, III.2.b · Landeslehrplan CE 06 „In Akutsituationen sicher handeln“ (1./2. AD: „Sofortmaßnahmen bei Schockzuständen“, „Verabreichung von Notfallmedikamenten nach ärztlicher Anordnung“, „Sofortmaßnahmen bei Verdacht auf … Lungenembolie“, Simulation von Notfallsituationen)')
  );
  const sp = [
    { text: 'Zeit', w: 900 }, { text: 'Phase', w: 1700 }, { text: 'Lehrerhandeln', w: 3300 }, { text: 'Schülerhandeln', w: 3200 },
    { text: 'Sozialform', w: 1250 }, { text: 'Material', w: 1500 }, { text: 'Didaktische Funktion', w: 0 }
  ];
  sp[6].w = BREITE_QUER - sp.slice(0, 6).reduce((s, x) => s + x.w, 0);
  const z = (zeit, phase, l, s, soz, mat, fkt) => [zeit, `**${phase}**`, l, s, soz, mat, fkt];
  const ueber = (text) => [{ colSpan: 7, text, fill: F.GRAU_HELL, o: { italics: true } }];
  const zeilen = [
    z('vor der Stunde', 'Vorbereitung', 'Yogamatten auslegen; 3 Schilder in Raumecken (Anlage); Stammgruppen-Liste am Beamer; fortschritt.html öffnen → „Neuen Raum starten“.', '–', '–', 'Matten, Schilder, Beamer', 'Ablauf ohne Umbaupausen'),
    z('0–8', 'Problemorientierter Einstieg: „Wie hätten Sie gehandelt?“', 'An den Schlusssatz von Woche 1 anknüpfen; Fallauszug und Leitfrage (Sprechblase) an die Tafel; Vermutung aus W1 (AA3a) kurz abrufen; Abstimmung (Einstieg) freigeben: „Falsch liegen ist erlaubt.“ Ergebnis am Beamer zeigen, Frage mit der größten Uneinigkeit groß anzeigen (Karte anklicken), „Murmeln“ einblenden (1 min); 2–3 Begründungen hören, nicht auflösen.', 'Vermutungen am Handy abgeben (sicher / vermute nur), auch zur Leitfrage (E6); die Nachbarin oder den Nachbarn von der eigenen Wahl überzeugen.', 'EA → PA (Murmeln) → Plenum', 'AB S. 1, Handy, Beamer', 'Vorwissen aktivieren, Vermutungen bilden, Fehlvorstellungen sichtbar machen (IKL Nr. 4); kognitiver Konflikt; die Vermutungen werden im Check-out überprüft (vorher/nachher). AFB I'),
    ueber('„Bei E… sind Sie geteilter Meinung – genau das klären wir heute. In Woche 1 haben Sie gesehen, wie der Körper einen Schock ausgleicht. Heute geht es um die Frage: Ist jeder Schock gleich – und muss ich deshalb immer gleich handeln? Am Ende der Stunde prüfen Sie Ihre Vermutungen.“'),
    z('8–23', 'Erarbeitung I: Expertenrunde (AA1)', 'Stammgruppen und Expertenrollen einteilen (siehe Hinweise), Expertenblätter A/B/C austeilen, Zeit ansagen; Fortschritt am Beamer beobachten.', 'Fall lesen, Befunde in der App markieren, Infotext lesen, Schockform anhand von 4 Symptomen begründen (Wortlaut KA 3.1), Expertenkarte ausfüllen, 60-Sekunden-Erklärprobe.', 'EA → GA (Experten)', 'Expertenblätter, Handy', 'Befunde im Fließtext identifizieren wie in KA 3.1; Expertenwissen aufbauen. AFB I'),
    z('23–43', 'Erarbeitung II: Stammgruppe (AA2)', 'Zeitsignal alle 3 min; Hilfekarten bei Bedarf; Expertinnen und Experten an ihre Prüferrolle erinnern.', 'Reihum erklären, Vergleichstabelle ergänzen, Schockform-Detektiv, Merksatz; 2.1 und 2.2 schreiben, Expertenkorrektur.', 'GA (3–4)', 'AB S. 2–3, Handy', 'Vergleichen (IKL Nr. 1); Pathophysiologie erläutern (KA 3.2), Unterschied neurogen (KA 5.5). AFB II'),
    ueber('„Sie wissen jetzt, wie sich die Schockformen unterscheiden. Aber wie lagern Sie? Aus dem Erste-Hilfe-Kurs kennen Sie: ‚Beine hoch.‘ Prüfen wir, ob das immer stimmt.“'),
    z('43–63', 'Erarbeitung III: Lagerungsparcours (AA3)', 'Paare bilden, eine Karte gemeinsam vormachen (Ablauf, Sicherheit); Paare begleiten; Entscheidungsweg kurz sichern.', 'Karten ziehen, lagern und begründen, aufdecken, Rollen tauschen; Merksatz; Entscheidungsweg; 3.1 und 3.2.', 'PA → EA', 'Yogamatten, Kissen, Handy, AB S. 3–4', 'Handlungsorientiert; Fehlvorstellung „immer Beine hoch“ korrigieren; Lagerungsbegründung als K.-o.-Kriterium in KA 3.3. AFB II'),
    z('63–88', 'Erarbeitung IV: Notfall-Simulation (AA4)', 'Rollen erklären, Start gemeinsam, Gruppen begleiten, Rollenwechsel einfordern; Plenum: Warum unterschiedliche Lagerung?', 'Drei Varianten spielen, protokollieren, Zeitstrahl mit Protokoll vergleichen; 4b und 4.1 (Vergleich Klinik – Pflegeheim) beantworten.', 'GA (3–4) → Plenum', 'Handy (1 je Gruppe), Notfallprotokoll (Anlage)', 'Sofortmaßnahmen in Entscheidungen umsetzen (I.4.a); Dokumentation; 4.1 übt die KA-Punkte „Infusion stoppen, Zugang belassen“, „Adrenalin/Sauerstoff nach SOP“ schriftlich (KA 3.3). AFB II'),
    ueber('Pause (falls im Stundenraster vorgesehen). – „In der Simulation mussten Sie entscheiden: Darf ich das – oder brauche ich eine Anordnung?“'),
    z('88–100', 'Vertiefung: Wer darf was? (AA5)', 'Maßnahmen vorlesen (Liste in den Hinweisen), bei Uneinigkeit nachfragen; Dialog zeigen, Think-Pair-Share moderieren.', 'Positionieren und begründen, Tabelle ausfüllen; Stellungnahme zu Herrn Brandt schreiben.', 'Plenum (Bewegung) → EA → PA', 'Schilder, AB S. 4–5', 'Verantwortungsgrenzen (III.2.b); Fehlvorstellung Antihistaminikum (IKL Nr. 3–4). AFB II–III'),
    ueber('„Jetzt wie in der Klassenarbeit: allein, ohne Unterlagen, mit Punkten.“'),
    z('100–115', 'Sicherung: Klausurtraining (AA6)', 'Zeit stoppen (8 min), Tauschpartner aus anderer Stammgruppe zuweisen, Raster am Handy, Rückmeldesatz einfordern.', 'Transferfall lösen; Lösung der Partnerin/des Partners mit App-Raster bewerten.', 'EA → PA', 'AB S. 5–6, Handy', 'Transfer auf neuen Fall wie in der KA (3.3); Examensformat. AFB III'),
    z('115–130', 'Transfer: Zurück zu Frau Maler (AA7)', 'Placemats austeilen, Zeiten ansagen (3/3/4 min), eine Gruppe stellt vor; Auflösung: obstruktiver Schock, Lagerung um 11 Uhr.', 'Placemat bearbeiten, Kausalkette in der Mitte, Leitfrage beantworten; 7.1/7.2 beginnen.', 'GA (4) → Plenum', 'Placemat A3', 'Kausalkette (IKL Nr. 5); offene Frage aus W1 klären; Brücke zu W4 und W7. AFB III'),
    z('130–135', 'Abschlusssicherung: „Hätten Sie richtig gehandelt?“', 'Abstimmung (Check-out) freigeben; am Beamer Vermutung (Beginn) und Entscheidung (Ende) vergleichen, „Lösung zeigen“, größte Veränderung kurz besprechen (v. a. E6 = Leitfrage); Hausaufgabe erteilen.', 'Dieselben Fragen erneut entscheiden, Auflösung mit der eigenen Vermutung vergleichen; Ich-kann-Liste (Ampel); Leitfrage beantworten.', 'EA → Plenum', 'Handy, Beamer, Ich-kann-Liste', 'Vermutungen überprüfen, Lernzuwachs sichtbar machen (vorher/nachher); Lernstandsdiagnose.'),
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
    punkt('**3BFP2.1 (23 SuS):** 7 Stammgruppen – 5 Dreiergruppen (A, B, C) und 2 Vierergruppen (A, B, B, C; Anaphylaxie ist Klausurschwerpunkt). Expertengruppen: A = 7 (4 + 3), B = 9 (3 × 3), C = 7 (4 + 3). Lagerungsparcours: 10 Paare + 1 Dreiergruppe (11 Matten). Placemat: 5 Vierergruppen + 1 Dreiergruppe (eine Person übernimmt zwei Felder).'),
    punkt('**3BFP2.2 (20 SuS):** 6 Stammgruppen – 4 Dreiergruppen und 2 Vierergruppen (A, B, B, C). Expertengruppen: A = 6 (3 + 3), B = 8 (4 + 4), C = 6 (3 + 3). Lagerungsparcours: 10 Paare (10 Matten). Placemat: 5 Vierergruppen.'),
    punkt('Die Simulation (AA4) läuft in den Stammgruppen; in Vierergruppen übernimmt die vierte Person die Beobachtung (Lagerung, Verantwortung) und gibt nach jeder Runde einen Hinweis.'),
    B.zwischen('Material und Technik'),
    punkt('Kopien: AB (SV) für alle; Expertenblätter A/B/C nach Einteilung; Notfallprotokoll 1 je Stammgruppe; Placemat auf A3 (1 je Vierergruppe); drei Schilder (Anlage) für die Raumecken. Yogamatten, einige Kissen/Decken als Polster.'),
    punkt('Beamer: **fortschritt.html** öffnen → „Neuen Raum starten“ → Raumcode zeigen. Die Seite zeigt den Fortschritt (AA1a, AA2b, AA3a) und unter **„Abstimmung“** die Vermutungen (Einstieg) und Entscheidungen (Check-out) ohne Namen nebeneinander. Ein Klick auf eine Karte zeigt die Frage groß – z. B. für das Murmeln. Unten blendet „Murmeln“ die Anweisung groß ein. Namen lassen sich verbergen; nach 6 Stunden wird alles gelöscht.'),
    punkt('Ohne WLAN oder Handys: Abstimmung per Handzeichen/Ampelkarten; Lagerungskarten aus der Liste unten vorlesen; Simulation als Fallkarte – die Lehrkraft spielt „Monitor“ und nennt die Werte nach den Entscheidungen der Gruppe (Drehbuch unten).'),
    punkt('Schutz gegen Durchklicken wie gewohnt: Merksätze erscheinen nur, wenn genug Aufgaben beim ersten Versuch richtig sind.'),
    B.zwischen('Inhaltliche Hinweise'),
    punkt('**Einstieg und Check-out („Wie hätten Sie gehandelt?“):** Zu Beginn geben die SuS Vermutungen ab – falsch liegen ist ausdrücklich erlaubt, die Sicherheit („sicher“ / „vermute nur“) macht Fehlvorstellungen sichtbar, die mit Überzeugung vertreten werden. Beim Einstieg nichts auflösen, auch nicht beim Murmeln. Im Check-out entscheiden die SuS dieselben sechs Fragen erneut und sehen danach die Auflösung neben ihrer Vermutung. E6 ist die Leitfrage (Frau Maler um 11 Uhr); sie wird in AA7 geklärt.'),
    punkt('Die Lagerungsempfehlungen folgen der S2k-Leitlinie Anaphylaxie (AWMF 061-025, 2021): symptomorientiert; Flachlagerung und Vermeiden abrupter Lageveränderungen (Aufsitzen, Aufstehen) als Grundstrategie; bei führender Atemnot (halb-)sitzend; bei eingeschränktem Bewusstsein und intaktem Kreislauf stabile Seitenlage; zur Kreislaufverbesserung Beine hoch.'),
    punkt('Adrenalin i. m. laut Leitlinie 0,15–0,6 mg in die Außenseite des Oberschenkels, Autoinjektoren 0,15/0,3/0,5 mg, Wiederholung nach ca. 5–10 min. Antihistaminika: langsamerer Wirkungseintritt, Wirkung auf Kreislauf und Bronchokonstriktion nicht belegt, lebensrettende Sofortmaßnahmen dürfen nicht verzögert werden. Glukokortikoide: untergeordnete Rolle in der Akutphase. Die KA-Lösung nennt „Erwachsene 0,5 mg“ – das liegt in diesem Bereich.'),
    punkt('Der Leitfall ist belastend (Christin, Reanimation). AA7 bleibt bewusst fachlich (Kausalkette, verpasste Chancen) und bewertet Christin nicht; Erleben, Hilflosigkeit und Verarbeitung sind Thema in KB II und KB V.'),
    punkt('Die Übungsfälle vermeiden bewusst die Personen und Auslöser der Klassenarbeit (Frau Sommer, Herr Brenner, Antibiotika-Kurzinfusion), damit die KA den Transfer prüft.'),
    B.zwischen('Nicht enthalten (andere Kompetenzbereiche/Fächer)'),
    punkt('KB II: psychologische Erste Hilfe, Beruhigen, Notfalleinwilligung, SPIKES/NURSE, SAfE · KB III: Reanimation, ABCDE-Schema, Notaufnahme/Triage, PTBS (nur Verweise) · KB IV: Delegationsrecht, Haftung, unterlassene Hilfeleistung, Ersthelferschutz, Patientenverfügung · KB V: eigene Überforderung · Deutsch: Notruf absetzen, SBAR · Pädiatrie (3. AJ): Anaphylaxie bei Kindern · Anatomie: Pathophysiologie der Lungenembolie (1. AJ, nur aktiviert).'),
    B.zwischen('Liste für die Aufstellung (AA5a) – Lösung'),
    punkt('🟢 selbst: Infusion stoppen, Zugang belassen · Hilfe holen · nach Leitsymptom lagern · Vitalzeichen messen · dokumentieren'),
    punkt('🟡 n. ä. A./SOP: Adrenalin i. m. · Sauerstoff · Antihistaminikum · Volumengabe · eigener Autoinjektor nach ärztlichem Notfallplan (der Plan ist die Anordnung)'),
    punkt('🔴 ärztlich: Diagnose stellen · über weitere Therapie und Überwachungsdauer entscheiden'),
    B.zwischen('Lagerungskarten (AA3a) – zum Vorlesen ohne App')
  );
  push(B.tabelle([{ text: 'Karte', w: 2000 }, { text: 'Situation', w: 3900 }, { text: 'Lösung und Begründung', w: B.breite - 5900 }],
    T.LAGERUNGSKARTEN.map((c) => [`**${c.titel}**${c.dilemma ? ' (Dilemma)' : ''}`, c.text, `**${c.loesung}** – ${c.warum}`]), { schrift: 17 }));
  push(B.zwischen('Drehbuch der Simulation (AA4) – idealer Ablauf und typische Fehler'));
  push(B.tabelle([{ text: 'Variante', w: 1700 }, { text: 'Leitsymptom und richtige Schritte', w: 4500 }, { text: 'Typische Fehler und ihre Folgen in der App', w: B.breite - 6200 }], [
    ['**A Klinik** – Herr Kaiser (58), Eisen-Kurzinfusion, Notfall-SOP', 'Atemnot (Heiserkeit, pfeifende Atmung, SpO₂ ↓) → Infusion stoppen, Zugang belassen · Notfallteam rufen · Oberkörper hoch · Adrenalin i. m. nach SOP · Sauerstoff nach SOP · Vitalzeichen · dokumentieren, Allergie vermerken, Nachbeobachtung', 'Zugang ziehen (kein Weg für Medikamente) · Beine hoch (Atemnot nimmt zu) · Antihistaminikum statt Adrenalin (keine Besserung) · allein lassen'],
    ['**B Pflegeheim** – Frau Gruber (84), neues Schmerzmittel (Tablette), keine Ärztin im Haus, keine SOP', 'Kreislauf ohne Atemnot (Schwindel, RR ↓, Puls ↑) → Hilfe holen: Pflegefachkraft, Notruf 112 · flach, Beine hoch · nicht aufsetzen · überwachen · keine Medikamente ohne Anordnung · Übergabe an Notärztin, dokumentieren', 'Zur Toilette begleiten/aufsetzen (Kollaps) · Adrenalin aus dem Notfallkoffer ohne Anordnung · etwas zu trinken geben'],
    ['**C ambulant** – Herr Hager (66), Bienenstich, eigenes Notfallset mit ärztlichem Notfallplan', 'Heiserkeit, dann Bewusstseinstrübung bei erhaltener Atmung → Notruf 112 · Autoinjektor aus dem Notfallset nach Notfallplan (Außenseite Oberschenkel) · bei Bewusstlosigkeit mit normaler Atmung stabile Seitenlage · Atmung überwachen · Stachel abstreifen (Biene) · Uhrzeit notieren', 'Tropfen aus dem Notfallset zuerst (Antihistaminikum; Aspirationsgefahr) · aufrichten · Autoinjektor nicht nutzen und nur warten']
  ], { schrift: 17 }));
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

  const anl = (B, lsg) => [
    ...['a', 'b', 'c'].flatMap((x, i) => [...(i ? [B.umbruch()] : []), ...expertenblatt(B, x, { lsg })])
  ];
  const AN = bausteine({ lsg: false, breite: BREITE_HOCH });
  await speichern(new Document({
    creator: 'KB I · 3BFP2', title: 'KB1 W2 Schockformen – Anlagen', styles: STILE,
    sections: [
      sektionHoch([...anl(AN, false), AN.umbruch(), ...notfallprotokoll(AN), AN.umbruch(), ...placemat(AN)]),
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
      sektionHoch([...schuelerTeil(LH, { lsg: true })]),
      sektionHoch([...anl(LH, true)])
    ]
  }), 'KB1_W2_Schockformen_LV_LSG.docx');
}

main().catch((e) => { console.error(e); process.exit(1); });

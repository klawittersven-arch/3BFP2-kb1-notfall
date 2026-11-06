/* ==========================================================================
   TEXTE DER BEAMER-STUNDE · Woche 2 „Schock ist nicht gleich Schock“
   ==========================================================================
   Hier stehen alle Folien (Beamer) und die passenden Bildschirme der Handys.

   So ändern Sie einen Text sicher:
   - Nur den Text ZWISCHEN den Hochkommas '…' ändern.
   - **Wort** = fett. Ein Apostroph im Text: ’ (typografisch) verwenden.
   - Reihenfolge der Folien = Reihenfolge in der Liste „folien“.
   - Die Kennungen (id: 'aa1' …) nicht ändern – der Worker und die Handys erkennen
     die Folien daran ('aa1' → 'aa2a' wechselt automatisch, 'ende' gibt die Nachlese frei).

   Die Expertentexte (unten, „experten“) stehen auch im Arbeitsblatt
   (werkzeuge/ab_w2_texte.js). tests/inhalte.test.js meldet Abweichungen.
   ========================================================================== */

var STUNDE = {

  titel: 'Schock ist nicht gleich Schock',
  untertitel: 'KB I · Woche 2 · Notfallsituationen',
  kopfzeile: 'KB I · Notfallsituationen',

  /* ---------- Stammgruppen (in dieser Reihenfolge vergeben) ---------- */
  gruppen: [
    { emoji: '🐘', name: 'Blaue Elefanten', farbe: '#2F6DB5' },
    { emoji: '🐝', name: 'Gelbe Bienen', farbe: '#D49A00' },
    { emoji: '🐞', name: 'Rote Marienkäfer', farbe: '#C9372C' },
    { emoji: '🐸', name: 'Grüne Frösche', farbe: '#2E8B4E' },
    { emoji: '🦊', name: 'Orange Füchse', farbe: '#E06A1B' },
    { emoji: '🦩', name: 'Rosa Flamingos', farbe: '#D24D8A' },
    { emoji: '🐙', name: 'Lila Kraken', farbe: '#7A4BB0' },
    { emoji: '🐧', name: 'Schwarze Pinguine', farbe: '#2E3440' },
    { emoji: '🐢', name: 'Türkise Schildkröten', farbe: '#138A8A' },
    { emoji: '🐻', name: 'Braune Bären', farbe: '#7B4B2A' }
  ],

  /* ---------- Expertinnen und Experten ---------- */
  rollen: {
    A: { form: 'Hypovolämischer Schock', kurz: 'hypovolämisch', person: 'Herr Albrecht', fall: 'a' },
    B: { form: 'Anaphylaktischer Schock', kurz: 'anaphylaktisch', person: 'Mia', fall: 'b' },
    C: { form: 'Neurogener Schock', kurz: 'neurogen', person: 'Herr Weber', fall: 'c' }
  },

  /* ---------- Folien ----------
     typ (Beamer): start, fall, abstimmung, ergebnis, murmeln, fahrplan, puzzle, experten, stamm,
                   fortschritt, papier, impuls, aufstellung, dialog, kausalkette, ende
     handy.typ:    vorne, entscheidung, murmeln, gruppe, experte, stamm, modul, papier, aufstellung, ende
     uhr:          Abschnitte der Uhr (Sekunden). autoUhr: true = startet beim Öffnen der Folie. */
  folien: [
    {
      id: 'start', abschnitt: 'Ankommen', kurz: 'Willkommen', typ: 'start',
      titel: 'Willkommen!',
      schritte: ['Scannen Sie den QR-Code.', 'Geben Sie Ihren **Vornamen** ein.', 'Fertig – Ihr Handy wechselt ab jetzt **automatisch mit dem Beamer**.'],
      handy: { typ: 'vorne', titel: 'Sie sind dabei, {name}!', text: 'Ihr Handy wechselt ab jetzt automatisch mit dem Beamer. Schauen Sie nach vorne.' }
    },
    {
      id: 'fall', abschnitt: 'Einstieg', kurz: 'Frau Maler', typ: 'fall',
      titel: 'Reanimation – und nicht nur ich war hilflos',
      einleitung: 'Frau Maler, 71 Jahre, ist seit gestern neu im Pflegeheim. Vor drei Wochen erhielt sie nach einer Schenkelhalsfraktur eine Hüft-TEP. Seit der Entlassung liegt sie die meiste Zeit im Bett.',
      zitat: '„Gegen elf Uhr wirkte sie unruhig, atmete schnell und sagte, sie bekomme schlecht Luft. Sie war blass, hatte kalten Schweiß auf der Stirn, ihr Puls lag bei 118/min und der Blutdruck bei 105/70 mmHg. Ich dachte, sie sei nur aufgeregt, weil alles neu für sie ist.“',
      zitatWer: 'Schülerin Christin',
      leitfrage: 'Woher kommt Frau Malers Luftnot – und wie hätte man sie um 11 Uhr lagern müssen?',
      handy: { typ: 'vorne', titel: 'Frau Maler, 11 Uhr', text: '**Leitfrage:** Woher kommt Frau Malers Luftnot – und wie hätte man sie um 11 Uhr lagern müssen?' }
    },
    {
      id: 'einstieg', abschnitt: 'Einstieg', kurz: 'Wie hätten Sie gehandelt?', typ: 'abstimmung', runde: 1,
      titel: 'Wie hätten Sie gehandelt?',
      unter: 'Ihre Vermutungen, bitte!',
      punkte: ['Sechs kurze Notfälle – der letzte ist **Frau Maler um 11 Uhr**.', 'Tippen Sie Ihre Vermutung an – und ob Sie sich **sicher** sind oder **nur vermuten**.', '**Falsch liegen ist ausdrücklich erlaubt:** Genau diese Entscheidungen lernen Sie heute.'],
      zaehler: '{x} von {y} haben abgestimmt',
      handy: { typ: 'entscheidung', runde: 1 }
    },
    {
      id: 'einstieg-ergebnis', abschnitt: 'Einstieg', kurz: 'Ergebnis', typ: 'ergebnis', runde: 1,
      titel: 'So hat die Klasse vermutet',
      unter: 'Karte anklicken = groß · ★ = größte Uneinigkeit',
      handy: { typ: 'vorne', titel: 'Das Ergebnis steht vorne', text: 'Noch keine Auflösung – ob Sie richtig lagen, prüfen Sie am Ende der Stunde.' }
    },
    {
      id: 'murmeln', abschnitt: 'Einstieg', kurz: 'Murmeln', typ: 'murmeln',
      titel: 'Murmeln: Wer hat recht?',
      text: 'Überzeugen Sie Ihre Nachbarin oder Ihren Nachbarn: **Warum würden Sie so handeln?** Noch keine Auflösung!',
      uhr: [{ label: 'Murmeln', sek: 60 }], autoUhr: true,
      handy: { typ: 'murmeln', titel: 'Murmeln: Wer hat recht?', text: 'Überzeugen Sie Ihre Nachbarin oder Ihren Nachbarn: Warum würden Sie so handeln?', ihre: 'Ihre Vermutung: {a}', keine: 'Sie haben bei dieser Frage noch nicht abgestimmt.' }
    },
    {
      id: 'ziel', abschnitt: 'Einstieg', kurz: 'Lernziel', typ: 'fahrplan',
      titel: 'Schock ist nicht gleich Schock',
      impuls: '„Ist jeder Schock gleich – und muss ich deshalb immer gleich handeln?“',
      lernziel: 'Sie vergleichen den hypovolämischen, den anaphylaktischen und den neurogenen Schock und begründen Sofortmaßnahmen und Lagerung anhand des Leitsymptoms. Sie unterscheiden, was Sie selbst tun dürfen und was nur nach ärztlicher Anordnung.',
      plan: [
        { emoji: '🧩', text: 'Gruppenpuzzle: drei Schockformen', zeit: '35 min' },
        { emoji: '🧘', text: 'Lagerungsparcours auf der Matte', zeit: '20 min' },
        { emoji: '🚨', text: 'Notfall-Simulation', zeit: '25 min' },
        { emoji: '⚖️', text: 'Wer darf was?', zeit: '12 min' },
        { emoji: '📝', text: 'Klausurtraining wie in der KA', zeit: '15 min' },
        { emoji: '🔎', text: 'Zurück zu Frau Maler', zeit: '15 min' },
        { emoji: '✅', text: 'Hätten Sie richtig gehandelt?', zeit: '5 min' }
      ],
      handy: { typ: 'vorne', titel: 'Heute: Schock ist nicht gleich Schock', text: 'Schauen Sie nach vorne – gleich geht es mit dem Gruppenpuzzle los.' }
    },
    {
      id: 'puzzle', abschnitt: 'Gruppenpuzzle', kurz: 'Gruppen einteilen', typ: 'puzzle',
      titel: 'Gruppenpuzzle: Drei Wege in den Schock',
      schritte: [
        { emoji: '👥', titel: '1 · Expertenteam', text: 'Alle mit **demselben Buchstaben**: Fall markieren, Infotext lesen, **Ihre Spalte** der Tabelle ausfüllen.', zeit: '15 min' },
        { emoji: '🚶', titel: 'Umsetzen!', text: 'Ab in die Stammgruppe – die Namen stehen auf dem Handy.', zeit: '' },
        { emoji: '🧩', titel: '2 · Stammgruppe', text: '**A + B + C** an einem Tisch: reihum erklären, Tabelle vollständig ausfüllen.', zeit: '12 min' }
      ],
      einteilen: 'Gruppen zufällig einteilen',
      neuEinteilen: 'Neu mischen',
      neuFrage: 'Gruppen neu mischen? Bisherige Fertig-Meldungen werden gelöscht.',
      ohneHandy: '+ Person ohne Handy',
      ohneHandyFrage: 'Vorname der Person ohne Handy:',
      verschiebenTipp: 'Name anklicken = in die nächste Gruppe',
      handy: { typ: 'gruppe', warten: 'Gleich teilt Ihre Lehrkraft die Gruppen ein …', deine: 'Ihre Stammgruppe', experte: 'Sie sind Expertin/Experte **{b}**: {form}', team: 'Zuerst treffen Sie sich mit Ihrem Expertenteam {team}.' }
    },
    {
      id: 'aa1', abschnitt: 'Gruppenpuzzle', kurz: 'Expertenrunde (AA1)', typ: 'experten',
      titel: 'AA1 · Expertenteams',
      text: '🚶 **Setzen Sie sich mit Ihrem Expertenteam zusammen** – die Namen stehen auf Ihrem Handy.',
      auftraege: ['Fall markieren (Handy)', 'Infotext lesen (Handy)', 'Ihre **Spalte** der Tabelle ausfüllen (AB)', 'Klausuraufgabe 1.1 (AB)', 'Experten-Check (Handy) → „Unsere Spalte ist fertig“'],
      uhr: [{ label: 'Expertenrunde', sek: 900 }],
      alleFertig: 'Alle Expertenteams fertig – die Handys zeigen jetzt die Stammgruppen.',
      handy: { typ: 'experte' }
    },
    {
      id: 'aa2a', abschnitt: 'Gruppenpuzzle', kurz: 'Stammgruppen (AA2a)', typ: 'stamm',
      titel: 'AA2a · Stammgruppen',
      text: '🚶 **Umsetzen!** Erklären Sie reihum **A → B → C** (je 3 Minuten). Die anderen füllen ihre Spalten aus. Zum Schluss gemeinsam: Gemeinsamkeit.',
      uhr: [{ label: 'A erklärt', sek: 180 }, { label: 'B erklärt', sek: 180 }, { label: 'C erklärt', sek: 180 }, { label: 'Gemeinsamkeit', sek: 120 }],
      uhrKnopf: '▶ Erklär-Uhr starten',
      handy: { typ: 'stamm' }
    },
    {
      id: 'aa2b', abschnitt: 'Gruppenpuzzle', kurz: 'Schockform-Detektiv (AA2b)', typ: 'fortschritt', seite: 'w2-detektiv', jeGruppe: true,
      titel: 'AA2b · Schockform-Detektiv',
      text: 'Sechs kurze Fälle: **Schockform bestimmen** und die **zwei Befunde** markieren, die sie belegen. Jede Person am eigenen Handy – sitzen bleiben in der Stammgruppe.',
      handy: { typ: 'modul', modul: 'detektiv', gruppeZeigen: true }
    },
    {
      id: 'aa2c', abschnitt: 'Gruppenpuzzle', kurz: 'Klausurtraining 2.1/2.2', typ: 'papier',
      titel: 'AA2c · Klausurtraining',
      punkte: ['Bearbeiten Sie **2.1 und 2.2 allein** auf dem Arbeitsblatt.', 'Danach prüft **Expertin/Experte B** Ihre 2.1 und **Expertin/Experte C** Ihre 2.2.'],
      uhr: [{ label: 'Schreiben', sek: 360 }, { label: 'Expertenkorrektur', sek: 180 }],
      handy: { typ: 'papier', titel: 'Auf Papier: 2.1 und 2.2', text: 'Schreiben Sie allein. Danach prüft Expertin/Experte B Ihre 2.1 und Expertin/Experte C Ihre 2.2.' }
    },
    {
      id: 'aa3-impuls', abschnitt: 'Lagerung', kurz: 'Schock → Beine hoch?', typ: 'impuls',
      titel: '„Bei einem Schock legt man immer die Beine hoch.“',
      text: 'So lernt man es im Erste-Hilfe-Kurs. **Stimmt das immer?**',
      handy: { typ: 'vorne', titel: 'Stimmt das?', text: '„Bei einem Schock legt man immer die Beine hoch.“' }
    },
    {
      id: 'aa3', abschnitt: 'Lagerung', kurz: 'Lagerungsparcours (AA3)', typ: 'fortschritt', seite: 'w2-lagerung',
      titel: 'AA3 · Lagerungsparcours',
      punkte: ['Zu zweit auf der Yogamatte: Das Handy zieht eine **Situationskarte**.', 'Person A lagert Person B in 60 Sekunden und begründet: „Ich lagere …, **weil** …“', 'Aufdecken, vergleichen, **Rollen tauschen**.', 'Sicherheit: behutsam lagern, nicht heben. Wer nicht gelagert werden möchte, begründet.'],
      handy: { typ: 'modul', modul: 'lagerung' }
    },
    {
      id: 'aa4', abschnitt: 'Simulation', kurz: 'Notfall-Simulation (AA4)', typ: 'fortschritt', seite: 'w2-simulation', jeGruppe: true,
      titel: 'AA4 · Notfall-Simulation in der Stammgruppe',
      punkte: ['🩺 **Pflegefachperson** entscheidet und sagt laut, was sie tut und warum.', '📟 **Monitor & Stimme** bedient das Handy und liest vor.', '📝 **Protokoll** füllt das Notfallprotokoll aus.', 'Drei Varianten – **nach jeder Runde Rollen wechseln!**'],
      handy: { typ: 'modul', modul: 'simulation', gruppeZeigen: true }
    },
    {
      id: 'pause', abschnitt: 'Simulation', kurz: 'Pause', typ: 'impuls',
      titel: 'Pause',
      text: 'Bis gleich!',
      uhr: [{ label: 'Pause', sek: 600 }],
      handy: { typ: 'vorne', titel: 'Pause', text: 'Bis gleich!' }
    },
    {
      id: 'aa5a', abschnitt: 'Verantwortung', kurz: 'Wer darf was? (AA5a)', typ: 'aufstellung',
      titel: 'AA5a · Wer darf was?',
      text: 'Gehen Sie in die passende **Ecke** – und begründen Sie Ihre Wahl.',
      ecken: [
        { emoji: '🟢', text: 'mache ich selbst' },
        { emoji: '🟡', text: 'nur n. ä. A. oder SOP' },
        { emoji: '🔴', text: 'ärztliche Aufgabe' }
      ],
      massnahmen: [
        { text: 'Infusion stoppen, Zugang belassen', ecke: 0, warum: 'Allergen sofort stoppen – den Zugang braucht das Notfallteam.' },
        { text: 'Adrenalin i. m. geben', ecke: 1, warum: 'Medikament: nur nach ärztlicher Anordnung oder Notfall-SOP – dann aber sofort.' },
        { text: 'Hilfe holen (Notfallteam bzw. 112)', ecke: 0, warum: 'Erkennen und Hilfe holen ist immer eigenverantwortlich.' },
        { text: 'Antihistaminikum geben', ecke: 1, warum: 'Medikament: nur nach Anordnung oder SOP – und erst nach Adrenalin.' },
        { text: 'Diagnose „anaphylaktischer Schock“ stellen', ecke: 2, warum: 'Diagnosen stellt die Ärztin oder der Arzt.' },
        { text: 'Sauerstoff geben', ecke: 1, warum: 'Sauerstoff ist ein Arzneimittel.' },
        { text: 'Eigenen Autoinjektor nach dem ärztlichen Notfallplan anwenden', ecke: 1, warum: 'Der Notfallplan ist die ärztliche Anordnung für diese Person.' },
        { text: 'Über die Dauer der Überwachung entscheiden', ecke: 2, warum: 'Therapieentscheidungen trifft die Ärztin oder der Arzt.' }
      ],
      zeigen: 'Lösung zeigen',
      naechste: 'Nächste Maßnahme',
      handy: { typ: 'aufstellung', titel: 'Wer darf was?', start: 'Gleich liest Ihre Lehrkraft Maßnahmen vor. Gehen Sie dann in die passende Ecke.' }
    },
    {
      id: 'aa5b', abschnitt: 'Verantwortung', kurz: 'Adrenalin oder Antihistaminikum? (AA5b)', typ: 'dialog',
      titel: 'AA5b · Wer hat recht?',
      sprecher: [
        { wer: 'Herr Brandt, Pflegefachkraft', text: '„Geben Sie ihr erst mal das Antihistaminikum aus dem Notfallkoffer. Adrenalin ist mir zu heftig.“' },
        { wer: 'Lina, Auszubildende', text: '„Aber in unserer Notfall-SOP steht Adrenalin ganz oben …“' }
      ],
      punkte: ['**Think:** zwei Argumente notieren (2 Min.)', '**Pair:** mit der Partnerin oder dem Partner vergleichen (2 Min.)', '**Share:** einige Paare stellen vor – danach 5.1 schriftlich'],
      uhr: [{ label: 'Think', sek: 120 }, { label: 'Pair', sek: 120 }],
      handy: { typ: 'papier', titel: 'Wer hat recht?', text: 'Lesen Sie Informationstext und Dialog (AB). Notieren Sie zwei Argumente – danach 5.1 schriftlich.' }
    },
    {
      id: 'aa6', abschnitt: 'Klausurtraining', kurz: 'Transferfall (AA6)', typ: 'papier',
      titel: 'AA6 · Klausurtraining wie in der KA',
      punkte: ['**Allein und ohne Unterlagen** – 8 Minuten.', 'Herr Martens, Wespenstich in der Tagespflege: **6.1 bis 6.3**.', 'Handy umgedreht hinlegen.'],
      uhr: [{ label: 'Klausurtraining', sek: 480 }],
      handy: { typ: 'papier', titel: 'Klausurtraining: 6.1 bis 6.3', text: 'Allein und ohne Unterlagen. Legen Sie das Handy umgedreht hin – die Zeit läuft vorne.' }
    },
    {
      id: 'aa6-peer', abschnitt: 'Klausurtraining', kurz: 'Peer-Korrektur (AA6)', typ: 'papier',
      titel: 'AA6 · Peer-Korrektur',
      punkte: ['Tauschen Sie mit einer Person aus einer **anderen Stammgruppe**.', 'Haken Sie im **Bewertungsraster am Handy** ab, was geschrieben wurde – die App zählt die Punkte.', 'Geben Sie eine Rückmeldung in **einem Satz**.'],
      uhr: [{ label: 'Peer-Korrektur', sek: 420 }],
      handy: { typ: 'modul', modul: 'raster' }
    },
    {
      id: 'aa7', abschnitt: 'Frau Maler', kurz: 'Placemat (AA7)', typ: 'papier',
      titel: 'AA7 · Zurück zu Frau Maler',
      punkte: ['Zu viert mit der **Placemat** (A3): Jede Person übernimmt ein Außenfeld.', '**Allein:** Was steckt dahinter? Gehört es zur Kette?', '**Drehen und lesen**, dann in der **Mitte** auf die Kausalkette einigen.', 'Tipp: Thromboseprophylaxe aus dem 1. Ausbildungsjahr. Nicht jeder Zeitpunkt gehört zur Kette!'],
      uhr: [{ label: 'Allein: Außenfeld', sek: 180 }, { label: 'Drehen und lesen', sek: 180 }, { label: 'Mitte: einigen', sek: 240 }],
      handy: { typ: 'papier', titel: 'Placemat: Zurück zu Frau Maler', text: 'Arbeiten Sie auf der Placemat. Die Zeit für jeden Schritt läuft vorne.' }
    },
    {
      id: 'aufloesung', abschnitt: 'Frau Maler', kurz: 'Auflösung', typ: 'kausalkette',
      titel: 'Woher kam Frau Malers Luftnot?',
      kette: [
        { titel: 'Immobilität', text: 'Nach der Hüft-TEP liegt sie aus Angst vor einer Luxation fast nur im Bett.' },
        { titel: 'Tiefe Beinvenenthrombose', text: 'Morgens: rechte Wade dick, Schmerz beim Auftreten.' },
        { titel: 'Lungenembolie', text: 'Ein Teil des Gerinnsels gelangt über das rechte Herz in die Lungenarterie.' },
        { titel: 'Obstruktiver Schock', text: '11 Uhr: Luftnot, Puls 118/min, blass, kalter Schweiß, Unruhe (Schockindex ≈ 1,1).' },
        { titel: 'Kreislaufstillstand', text: 'Mittag: zyanotisch, keine Reaktion, kein Puls.' }
      ],
      antwortTitel: 'Antwort auf die Leitfrage',
      antwort: 'Die Luftnot kam von einer **Lungenembolie**. Um 11 Uhr: **Oberkörper hoch** (Luftnot steht im Vordergrund), **nicht mobilisieren**, nicht allein lassen, **sofort Hilfe holen** und engmaschig überwachen.',
      aufdecken: 'Nächster Schritt',
      handy: { typ: 'vorne', titel: 'Auflösung vorne', text: 'Vergleichen Sie mit Ihrer Placemat.' }
    },
    {
      id: 'checkout', abschnitt: 'Abschluss', kurz: 'Hätten Sie richtig gehandelt?', typ: 'abstimmung', runde: 2,
      titel: 'Hätten Sie richtig gehandelt?',
      unter: 'Prüfen Sie Ihre Vermutungen',
      punkte: ['Jetzt wissen Sie mehr: Entscheiden Sie **dieselben sechs Notfälle** noch einmal.', 'Danach sehen Sie die Auflösung – und Ihre Vermutungen vom Stundenbeginn daneben.'],
      zaehler: '{x} von {y} haben abgestimmt',
      handy: { typ: 'entscheidung', runde: 2 }
    },
    {
      id: 'checkout-ergebnis', abschnitt: 'Abschluss', kurz: 'Vorher – nachher', typ: 'ergebnis', runde: 2, loesung: true,
      titel: 'Vorher – nachher',
      unter: 'Karte anklicken = groß, mit Erklärung',
      handy: { typ: 'entscheidung', runde: 2 }
    },
    {
      id: 'ikl', abschnitt: 'Abschluss', kurz: 'Ich-kann-Liste', typ: 'papier',
      titel: 'Was kann ich jetzt?',
      punkte: ['Füllen Sie die **Ich-kann-Liste** aus: ☺ sicher · 😐 teilweise · ☹ noch nicht.', '**Hausaufgabe:** Mini-Examen (20 Punkte) – Selbstkontrolle über den QR-Code im Arbeitsblatt.', '**Nachlesen:** Alles aus dieser Stunde über den QR-Code auf der letzten Seite – freigeschaltet nach der Stunde.'],
      handy: { typ: 'papier', titel: 'Ich-kann-Liste', text: 'Füllen Sie die Ich-kann-Liste auf dem Arbeitsblatt aus.' }
    },
    {
      id: 'ende', abschnitt: 'Abschluss', kurz: 'Ende', typ: 'ende',
      titel: 'Nächste Woche: Blutung stoppen',
      text: '… damit es gar nicht erst zum hypovolämischen Schock kommt.',
      frei: '📖 Die Nachlese-Seite ist jetzt freigeschaltet (QR-Code auf der letzten Seite).',
      handy: { typ: 'ende', titel: 'Die Stunde ist beendet', text: 'Alles aus dieser Stunde können Sie jetzt nachlesen: QR-Code auf der letzten Seite des Arbeitsblatts.' }
    }
  ],

  /* ---------- Beamer: feste Texte ---------- */
  beamer: {
    zurueck: 'Zurück',
    weiter: 'Weiter: {kurz}',
    letzte: 'Stunde beendet',
    menue: 'Menü',
    handys: '{n} Handys',
    handyEins: '1 Handy',
    raumcode: 'Raumcode',
    starten: 'Neuen Raum starten',
    startText: 'Der Laptop am Beamer steuert die Stunde. Die Handys der Schülerinnen und Schüler wechseln automatisch mit.',
    startFehler: 'Der Raum konnte nicht gestartet werden. Bitte prüfen Sie die Internetverbindung.',
    nichtEingerichtet: 'In docs/config.js fehlt die Adresse des Workers (FORTSCHRITT_URL).',
    schonDabei: 'Schon dabei: {n}',
    qrHinweis: 'oder: Raumcode {raum} im Arbeitsblatt-QR eingeben',
    getrennt: 'Verbindung unterbrochen – neuer Versuch …',
    uhrStarten: '▶ Uhr starten',
    uhrStoppen: '■ Uhr stoppen',
    uhrNeu: '↻ Uhr neu starten',
    loesungZeigen: 'Lösung zeigen',
    loesungVerbergen: 'Lösung verbergen',
    keineStimmen: 'Noch keine Stimmen.',
    runde1: 'Vermutung (Beginn)',
    runde2: 'Entscheidung (Ende)',
    sicherAnteil: 'davon sicher: {n}',
    vorherigeFrage: '← Vorherige',
    naechsteFrage: 'Nächste →',
    alleFragen: 'Alle Fragen',
    groessteUneinigkeit: '★ größte Uneinigkeit',
    nochNichtEingeteilt: 'Noch nicht eingeteilt.',
    teams: 'Expertenteams',
    teamsFertig: '{x} von {y} Teams fertig',
    gruppenFertig: '{x} von {y} Stammgruppen fertig',
    fertig: 'fertig',
    ohneHandyKurz: 'ohne Handy',
    jetztErklaert: 'Jetzt: {label}',
    fortschrittLeer: 'Noch keine Rückmeldungen.',
    personFertig: '{x} von {y} fertig',
    menueTitel: 'Folien',
    menueVollbild: 'Vollbild',
    menueNamen: 'Namen verbergen',
    menueNamenZeigen: 'Namen zeigen',
    menueNeuerRaum: 'Neuer Raum (Parallelklasse)',
    // Probestunde: Der Laptop spielt eine erfundene Klasse, die Lehrkraft macht mit dem eigenen Handy mit
    probeStarten: 'Probestunde mit erfundener Klasse',
    probeText: 'Zum Ausprobieren: 20 erfundene Schülerinnen und Schüler machen mit – sie stimmen ab, bearbeiten die Übungen und melden „fertig“. Scannen Sie mit Ihrem eigenen Handy den QR-Code und machen Sie als Schülerin oder Schüler mit.',
    probeFrage: 'Probestunde starten? Es wird ein neuer Raum mit 20 erfundenen Schülerinnen und Schülern angelegt.',
    probeChip: 'Probestunde',
    handysProbe: '{handys} + {f} erfundene',
    menueProbe: 'Probestunde (erfundene Klasse)',
    probeNamen: ['Lena', 'Paul', 'Emily', 'Noah', 'Hannah', 'Luis', 'Sophie', 'Elias', 'Marie', 'Ben', 'Lina', 'Jonas', 'Emma', 'Leon', 'Mila', 'Finn', 'Clara', 'Ali', 'Zeynep', 'David'],
    neuerRaumFrage: 'Neuen Raum starten? Alle Handys müssen dann den neuen QR-Code scannen.',
    menueTeilnehmende: 'Angemeldete verwalten',
    entfernenFrage: '„{name}“ entfernen?',
    entfernen: 'Entfernen',
    abbrechen: 'Abbrechen',
    ja: 'Ja',
    ok: 'OK',
    person: 'Person {n}',
    abgelaufen: 'Der Raum ist abgelaufen. Bitte starten Sie einen neuen Raum.',
    tastenTipp: 'Tasten: → / Bild↓ weiter · ← / Bild↑ zurück',
    demo: 'Probeansicht mit erfundenen Namen'
  },

  /* ---------- Handy: feste Texte ---------- */
  handy: {
    anmeldenTitel: 'Willkommen!',
    anmeldenText: 'Geben Sie Ihren Vornamen ein. Danach wechselt Ihr Handy automatisch mit dem Beamer.',
    nameLabel: 'Vorname',
    raumLabel: 'Raumcode (steht am Beamer)',
    los: 'Mitmachen',
    fehlerRaum: 'Bitte geben Sie den vierstelligen Raumcode vom Beamer ein.',
    fehlerUnbekannt: 'Diesen Raumcode gibt es nicht (mehr). Bitte prüfen Sie den Code am Beamer.',
    fehlerVoll: 'Der Raum ist voll. Bitte melden Sie sich bei Ihrer Lehrkraft.',
    fehlerEntfernt: 'Ihre Lehrkraft hat Sie aus dem Raum genommen. Melden Sie sich bitte neu an.',
    fehlerNetz: 'Keine Verbindung. Bitte prüfen Sie das WLAN und versuchen Sie es noch einmal.',
    verbinden: 'Verbindung wird hergestellt …',
    getrennt: 'Keine Verbindung – neuer Versuch läuft …',
    anderer: 'Nicht Sie?',
    vorneStandard: 'Schauen Sie nach vorne.',
    ihreGruppe: 'Ihre Stammgruppe',
    expertin: 'Expertin/Experte {b}',
    noch: 'noch {zeit}',
    zeitUm: 'Zeit ist um',
    papier: '✍️ Auf Papier',
    // Expertenteam (AA1)
    expTitel: 'Ihr Expertenteam {team}',
    expSetzen: '🚶 **Setzen Sie sich mit {namen} an einen Tisch.**',
    expAllein: '🚶 Sie sind allein in Ihrem Team – arbeiten Sie die Aufträge allein durch.',
    expAuftraege: ['**a)** Markieren Sie im Fall alle Hinweise auf einen Schock (unten).', '**b)** Lesen Sie den Infotext.', '**c)** Füllen Sie gemeinsam **Ihre Spalte {b}** der Vergleichstabelle auf dem Arbeitsblatt aus. Bearbeiten Sie die Klausuraufgabe 1.1.', '**d)** Machen Sie den Experten-Check – dann: „Unsere Spalte ist fertig“.'],
    expFall: 'a) Fall: {person}',
    expInfo: 'b) Infotext: {form}',
    expWoerter: 'Wörterhilfe',
    expPapier: 'Lieber auf Papier? Das Expertenblatt liegt am Pult (freiwillig).',
    checkTitel: 'd) Experten-Check',
    checkText: 'Können Sie Ihre Schockform erklären? Beantworten Sie alle drei Fragen richtig.',
    checkRichtig: 'Richtig!',
    checkFalsch: 'Noch nicht – lesen Sie im Infotext nach und versuchen Sie es noch einmal.',
    checkFertig: 'Experten-Check bestanden ✓',
    fertigTeam: 'Unsere Spalte ist fertig',
    fertigTeamGesperrt: 'Erst den Experten-Check bestehen',
    teamFertigText: '✓ Gemeldet! Warten Sie auf die anderen Teams ({x} von {y} fertig). Üben Sie solange: Erklären Sie Ihre Schockform in 60 Sekunden.',
    nochNichtFertig: 'Doch noch nicht fertig',
    // Stammgruppe (AA2a)
    stammSetzen: '🚶 **Umsetzen! Setzen Sie sich mit {namen} an einen Tisch.**',
    stammTischkarte: 'Ihr Tisch: Tischkarte {emoji}',
    stammAuftrag: 'Erklären Sie sich reihum Ihre Schockform (**A → B → C**, je 3 Minuten). Die anderen füllen ihre Spalten der Tabelle aus. Zum Schluss gemeinsam: Gemeinsamkeit.',
    stammDran: 'Sie sind dran: Erklären Sie Ihre Schockform!',
    stammJetzt: 'Jetzt erklärt: {wer}',
    fertigStamm: 'Unsere Tabelle ist vollständig',
    stammFertigText: '✓ Gemeldet! Ihre Gruppe: {x} von {y} fertig.',
    mitglied: '{name} · {b} {form}',
    du: '(Sie)',
    gruppeFertig: '✓ Ihre ganze Gruppe ist fertig.',
    aufstellungLoesung: 'Lösung: {ecke}',
    nichtEingeteilt: 'Sie sind noch keiner Gruppe zugeteilt. Bitte melden Sie sich bei Ihrer Lehrkraft.'
  },

  /* ---------- Experten-Check (AA1): drei Fragen je Schockform ---------- */
  check: {
    A: [
      { frage: 'Warum ist der Puls beim hypovolämischen Schock schnell?', optionen: ['Der Sympathikus gleicht den Volumenmangel aus.', 'Histamin regt das Herz an.', 'Die Blutung schädigt den Herzmuskel.'], richtig: 0 },
      { frage: 'Herr Albrecht hat einen Blutdruck von 98/72 mmHg. Warum ist er trotzdem im Schock?', optionen: ['Ab 100 mmHg systolisch ist es immer ein Schock.', 'Entscheidend ist der Vergleich mit dem Vorwert (145/85 mmHg) und der Schockindex ≈ 1,2.', 'Weil er Durst hat.'], richtig: 1 },
      { frage: 'Woran erkennen Sie eine verborgene Blutung im Magen-Darm-Trakt?', optionen: ['An Quaddeln am Bauch', 'An warmer, rosiger Haut', 'An schwarzem, klebrigem Stuhl (Teerstuhl)'], richtig: 2 }
    ],
    B: [
      { frage: 'Was stellt die Gefäße beim anaphylaktischen Schock weit?', optionen: ['Histamin und weitere Botenstoffe aus den Mastzellen', 'Ein Blutverlust', 'Der Ausfall des Sympathikus'], richtig: 0 },
      { frage: 'Welches Zeichen zeigt bei Mia, dass die Atemwege betroffen sind?', optionen: ['Die Bauchkrämpfe', 'Die heisere Stimme', 'Der Juckreiz an den Händen'], richtig: 1 },
      { frage: 'Warum braucht eine Person nach einer Anaphylaxie eine Nachbeobachtung?', optionen: ['Weil die Quaddeln sonst Narben bilden', 'Weil Adrenalin sofort nachdosiert werden muss', 'Nach Stunden kann eine zweite Reaktion folgen (zweigipfliger Verlauf).'], richtig: 2 }
    ],
    C: [
      { frage: 'Warum ist der Puls beim neurogenen Schock langsam oder normal?', optionen: ['Der Sympathikus fällt aus – der Körper kann nicht gegensteuern.', 'Weil die Person viel Blut verloren hat', 'Weil Histamin das Herz bremst'], richtig: 0 },
      { frage: 'Warum ist die Haut an Herrn Webers Beinen warm, trocken und rosig?', optionen: ['Wegen der Sonnencreme', 'Die Gefäße sind weit gestellt – es gibt keine Zentralisation.', 'Weil er Fieber hat'], richtig: 1 },
      { frage: 'Was tun Sie bei Verdacht auf eine Verletzung der Halswirbelsäule?', optionen: ['Flach lagern, Beine hoch', 'In die stabile Seitenlage drehen', 'Den Kopf mit beiden Händen in der vorgefundenen Lage halten, nicht bewegen'], richtig: 2 }
    ]
  },

  /* ---------- Expertentexte (gleich wie im Arbeitsblatt: werkzeuge/ab_w2_texte.js → EXPERTEN) ---------- */
  experten: {
    a: {
      info: [
        '**Ursache:** Dem Gefäßsystem fehlt Volumen, weil Blut oder Flüssigkeit verloren geht, z. B. durch eine Blutung (sichtbar nach außen oder verborgen im Körper wie bei einer Magen-Darm-Blutung), durch Verbrennungen oder durch starken Durchfall und Erbrechen. Gerinnungshemmer erhöhen das Blutungsrisiko. Schwarzer, klebriger Stuhl (Teerstuhl) ist ein Hinweis auf eine Blutung im Magen oder Zwölffingerdarm.',
        '**Entstehung:** Weniger Volumen → weniger Blut fließt zum Herzen zurück → das Herz kann weniger auswerfen (Schlagvolumen sinkt) → der Blutdruck droht zu fallen. Der Sympathikus gleicht aus: Der Puls steigt, die Gefäße in Haut, Muskeln, Niere und Darm verengen sich (Zentralisation, siehe Woche 1). Hält der Verlust an, gerät der Körper in die Schockspirale.',
        '**Typische Zeichen:** schneller, schwacher Puls; blasse, kalte, schweißige Haut; Durst; Unruhe, Angst, Verwirrtheit; schnelle Atmung; wenig Urin. Der Blutdruck fällt erst spät – entscheidend ist der Vergleich mit dem Vorwert (Schockindex).',
        '**Darauf achte ich besonders:** Blutungsquelle (Stuhl, Erbrochenes, Verband, Drainage), Puls und Blutdruck im Verlauf, Bewusstsein, Urinausscheidung.',
        '**Erste Schritte:** Hilfe holen, Ärztin oder Arzt informieren; nicht aufsetzen oder aufstehen lassen; flach lagern, Beine hoch (wenn keine Atemnot); Wärme erhalten; nichts essen oder trinken lassen (mögliche Untersuchung oder Operation); engmaschig überwachen; Volumengabe nur nach ärztlicher Anordnung.'
      ],
      woerter: 'hypovolämisch = mit zu wenig Volumen | Teerstuhl = schwarzer Stuhl durch verdautes Blut | Zentralisation = Umverteilung des Blutes zu Gehirn und Herz'
    },
    b: {
      info: [
        '**Ursache:** Allergische Sofortreaktion des Immunsystems auf einen eigentlich harmlosen Stoff (Allergen), z. B. Medikamente, Insektengift (Wespe, Biene) oder Nahrungsmittel (Nüsse, Erdnüsse, Sellerie, Fisch). Die Reaktion beginnt Sekunden bis Minuten nach dem Kontakt.',
        '**Entstehung:** Das Allergen bringt Mastzellen dazu, schlagartig Histamin und weitere Botenstoffe freizusetzen. Die Gefäße werden weit und durchlässig: Flüssigkeit tritt ins Gewebe aus (Quaddeln, Schwellungen), im Gefäßsystem fehlt Volumen (relativer Volumenmangel) → der Blutdruck fällt. Gleichzeitig schwellen die Schleimhäute an (z. B. im Kehlkopf) und die Bronchien verengen sich → Atemnot und Sauerstoffmangel. Das Herz versucht mit einem schnellen Puls auszugleichen.',
        '**Typische Zeichen** – oft an mehreren Organen gleichzeitig: Haut (Juckreiz, Rötung, Quaddeln, Schwellungen); Atemwege (Heiserkeit, Kloßgefühl, pfeifende Atmung, Atemnot, sinkende Sauerstoffsättigung); Kreislauf (schneller Puls, Blutdruckabfall, Schwindel, Bewusstseinsstörung); Magen-Darm (Übelkeit, Erbrechen, Bauchkrämpfe). Achtung: Die Haut kann auch blass sein – Hautzeichen sind nicht immer deutlich.',
        '**Darauf achte ich besonders:** Atemwege und Atmung (Heiserkeit, Atemfrequenz, Sauerstoffsättigung), Kreislauf. Nach Stunden kann eine zweite Reaktion folgen (zweigipfliger Verlauf) – deshalb Nachbeobachtung.',
        '**Erste Schritte:** Allergen stoppen, Hilfe holen, lagern nach Leitsymptom, Adrenalin i. m. nach Anordnung oder SOP (Mittel der ersten Wahl), überwachen, dokumentieren – mehr dazu in AA3 bis AA5.'
      ],
      woerter: 'Allergen = Auslöser einer Allergie | Mastzellen = Abwehrzellen im Gewebe, die Histamin speichern | Quaddeln = juckende, erhabene Hautschwellungen | anaphylaktisch = durch eine schwere allergische Reaktion'
    },
    c: {
      info: [
        '**Ursache:** Verletzung des Rückenmarks, meist im Bereich der Halswirbelsäule oder der oberen Brustwirbelsäule, z. B. durch einen Kopfsprung in flaches Wasser, einen Sturz aus der Höhe oder einen Verkehrsunfall.',
        '**Entstehung:** Im Rückenmark verlaufen auch die Nervenbahnen des Sympathikus. Sind sie unterbrochen, fehlt den Gefäßen unterhalb der Verletzung die Spannung: Sie werden weit, das Blut „versackt“, es entsteht ein relativer Volumenmangel → der Blutdruck fällt. Weil der Sympathikus ausfällt, kann der Körper nicht gegensteuern: Der Puls steigt nicht an (oft ist er sogar langsam), und es gibt keine Zentralisation.',
        '**Typische Zeichen:** niedriger Blutdruck bei langsamem oder normalem Puls; Haut unterhalb der Verletzung warm, trocken und rosig; Lähmungen und Gefühlsstörungen (Kribbeln, Taubheit) unterhalb der Verletzung; Nacken- oder Rückenschmerzen; der Körper kühlt leicht aus; bei sehr hoher Verletzung ist auch die Atmung gestört. Achtung: Die Person wirkt „stabil“ – ruhiger Puls, rosige Haut –, ist aber im Schock.',
        '**Darauf achte ich besonders:** Atmung, Blutdruck und Puls im Verlauf, Körpertemperatur, Lähmungen und Gefühl im Verlauf. Nach einem Unfall kann zusätzlich eine Blutung vorliegen.',
        '**Erste Schritte:** Notruf veranlassen; den Kopf mit beiden Händen in der vorgefundenen Lage halten; nicht aufsetzen, nicht bewegen; Wärme erhalten; Atmung und Puls überwachen (mehr in Woche 4).'
      ],
      woerter: 'neurogen = vom Nervensystem ausgehend | Rückenmark = Nervenstrang im Wirbelkanal | Sympathikus = Teil des Nervensystems, der Puls und Gefäßspannung steigert'
    }
  }
};

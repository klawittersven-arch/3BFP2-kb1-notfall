/* ==========================================================================
   INHALTE – KB I · Notfallsituationen (3BFP2) · TB 2 neu ab KW 49 (Klassenarbeit am 12.01.2027)
   Woche 1 (raum 'kb1w1'): „Schock: Schockspirale und Schockzeichen“, „Schockformen und Lagerung nach
   Leitsymptom“, „Anaphylaktischer Schock“ – je eine Übung „Für die Schnellen“ (freiwillig).
   Woche 2 (raum 'kb1w2'): „Starke Blutung stillen“, „Offene Fraktur und Amputationsverletzung“, „Vom Auffinden bis
   zum Eintreffen des Rettungsdienstes“.
   Woche 3 (raum 'kb1w3'): „Fremdkörperaspiration“, „Frakturzeichen und Sofortmaßnahmen nach einem Sturz“, „DMS-Kontrolle
   und Alarmzeichen“.
   ==========================================================================

   Gleicher Aufbau wie im Repository 3BFP2_KB2_Notfall (docs/inhalte.js) – dort steht die ausführliche
   Anleitung. Kurz: Nur Text ZWISCHEN den Hochkommas ' … ' ändern; **fett** ist erlaubt.
     raum        – Woche ('kb1w1', später 'kb1w2' …) → Lehrerseite lehrer-3bfp2-1-kb1w1.html usw.
     knoepfe     – Antwortknöpfe (kuerzel nur GROSSBUCHSTABEN, höchstens 6 Zeichen)
     mindestens  – so viele Karten müssen beim ERSTEN Versuch richtig sein
     karten      – nummer, text, richtig, erklaerung, tipp
   Ausnahmen kb1ab05 und kb1ab06: Notfall-Szenen (art: 'szene', Programm szene.js) – Aufbau direkt beim Eintrag beschrieben.
   Fachbegriffe nach Pflegias Band 2 (S. 793–794, 801–803, 811, 822, 825, 831).
   ========================================================================== */

var INHALTE = {

  allgemein: {
    kopfzeile: 'KB I – Notfallsituationen',
    merksatzUeberschrift: 'Das Wichtigste in Kürze',
    // {x} und {y} werden automatisch durch Zahlen ersetzt.
    fortschritt: '{x} von {y} richtig',
    ersterVersuch: 'Beim ersten Versuch richtig: {x} von {y}',
    nochEinmal: 'Noch einmal üben',
    richtigText: 'Richtig!',
    falschText: 'Noch nicht richtig – versuchen Sie es noch einmal.',
    tippVorwort: 'Tipp:',
    // {x} = beim ersten Versuch richtig, {y} = Anzahl Karten, {z} = nötige Mindestzahl
    durchklickenTitel: 'Hey, nicht einfach durchklicken!',
    durchklickenText: 'Beim ersten Versuch richtig: {x} von {y} – nötig sind mindestens {z}. Lesen Sie jede Karte genau und überlegen Sie, bevor Sie antworten.',
    durchklickenKnopf: 'Übung neu starten',
    // Sperre nach einer falschen Antwort ({x} = Sekunden)
    sperreText: 'Lesen Sie den Tipp – weiter in {x} s',
    // Neustart, wenn in kurzer Zeit zu viele falsche Antworten kommen
    zuSchnellTitel: 'Zu schnell geklickt!',
    zuSchnellText: 'Sie haben in kurzer Zeit mehrere falsche Antworten gegeben. Lesen Sie jede Karte in Ruhe – die Übung beginnt von vorn.',
    // Überschrift nach dem Lösen ({x} = „Übung 1“ usw. – der Teil des Titels vor dem Doppelpunkt)
    fertigTitel: '{x} abgeschlossen!',

    // Namenseingabe (nur wenn die Fortschrittsanzeige eingerichtet ist, siehe einstellungen.js)
    nameTitel: 'Wer sind Sie?',
    nameText: 'Geben Sie Ihren **Vornamen** und den **ersten Buchstaben Ihres Nachnamens** ein und wählen Sie Ihre **Klasse**. Ihre Lehrkraft sieht auf dem Beamer, wie weit die Klasse ist.',
    nameBeispiel: 'z. B. Lena K.',
    klasseFrage: 'Ihre Klasse:',
    klasseFehler: 'Bitte wählen Sie Ihre Klasse.',
    nameKnopf: 'Los geht’s',
    nameFehler: 'Bitte so eingeben: Vorname, Leerzeichen, erster Buchstabe des Nachnamens – z. B. „Lena K.“',
    nameDatenschutz: 'Gespeichert werden nur Ihr Name, Ihre Klasse, Ihr Fortschritt und bei welchen Karten der erste Versuch falsch war (die Lehrkraft sieht das nur zusammengefasst für die Klasse). Alles wird nach spätestens 12 Stunden automatisch gelöscht.',
    nameAnzeige: 'Angemeldet als {x} · {y}',
    nameAendern: 'ändern'
  },

  /* ========================================================================
     Woche 1 · Schock: Schockspirale und Schockzeichen
     ======================================================================== */
  kb1ab02: {
    ab: 'Schockspirale und Schockzeichen',
    raum: 'kb1w1',
    titel: 'Übung: Früh- oder Spätzeichen?',
    anweisung: 'Zeigt der Befund die **Frühphase** (der Körper gleicht noch aus) oder die **Spätphase** (der Ausgleich reicht nicht mehr) eines Schocks?',
    knoepfe: [
      { kuerzel: 'F', text: 'Frühphase' },
      { kuerzel: 'S', text: 'Spätphase' }
    ],
    hilfe: {
      titel: 'Hilfe: Woran erkenne ich die Phase?',
      punkte: [
        '**Frühphase:** Puls über 100/min, Blutdruck noch normal, Haut blass, kühl, feucht, unruhig, ängstlich, Urin 20–30 ml pro Stunde, Frieren',
        '**Spätphase:** Puls über 120/min und schwach, Blutdruck unter 100 mmHg, Zyanose, klebriger Schweiß, benommen bis bewusstlos, kaum oder kein Urin'
      ]
    },
    mindestens: 8,
    karten: [
      { nummer: 1, text: 'Puls 108/min, Blutdruck 125/80 mmHg.', richtig: 'F',
        erklaerung: '**Frühphase:** Der Puls ist schon schnell, der Blutdruck noch normal – der Körper gleicht aus (Kompensation).', tipp: 'Ist der Blutdruck schon gefallen?' },
      { nummer: 2, text: 'Der Blutdruck liegt bei 85/50 mmHg und fällt weiter.', richtig: 'S',
        erklaerung: '**Spätphase:** Der Blutdruck fällt erst, wenn der Ausgleich nicht mehr reicht.', tipp: 'Wann fällt der Blutdruck bei einem Schock?' },
      { nummer: 3, text: 'Die Haut ist blass, kühl und feucht.', richtig: 'F',
        erklaerung: '**Frühphase:** Die Gefäße der Haut werden eng (Zentralisation). Das Blut geht zu Gehirn, Herz und Lunge.', tipp: 'Woran erkennt man die Zentralisation zuerst?' },
      { nummer: 4, text: 'Die Lippen und Finger sind bläulich, der Schweiß ist klebrig.', richtig: 'S',
        erklaerung: '**Spätphase:** Zyanose zeigt starken Sauerstoffmangel.', tipp: 'Bläuliche Farbe – wie viel Sauerstoff fehlt?' },
      { nummer: 5, text: 'Die Patientin ist unruhig und ängstlich.', richtig: 'F',
        erklaerung: '**Frühphase:** Unruhe und Angst sind frühe Zeichen – wie bei Frau Maler um 11 Uhr.', tipp: 'Wie wirkte Frau Maler um 11 Uhr?' },
      { nummer: 6, text: 'Der Patient reagiert kaum noch und ist benommen.', richtig: 'S',
        erklaerung: '**Spätphase:** Das Gehirn bekommt zu wenig Sauerstoff. Das Bewusstsein schwindet.', tipp: 'Wie gut arbeitet das Gehirn noch?' },
      { nummer: 7, text: 'Im Urinbeutel sind in einer Stunde 25 ml.', richtig: 'F',
        erklaerung: '**Frühphase:** Etwas weniger Urin (20–30 ml pro Stunde), weil die Nieren weniger durchblutet werden.', tipp: 'Kommt noch Urin – oder gar keiner mehr?' },
      { nummer: 8, text: 'Seit drei Stunden ist kein Urin mehr gekommen.', richtig: 'S',
        erklaerung: '**Spätphase:** Kein Urin (Anurie) – die Nieren versagen. Die Schockspirale ist weit fortgeschritten.', tipp: 'Was sagt „gar kein Urin“ über die Nieren?' },
      { nummer: 9, text: 'Puls 136/min, kaum tastbar.', richtig: 'S',
        erklaerung: '**Spätphase:** Sehr schneller (über 120/min) und schwacher Puls.', tipp: 'Über oder unter 120/min? Gut oder schwach tastbar?' },
      { nummer: 10, text: 'Die Patientin friert und zittert.', richtig: 'F',
        erklaerung: '**Frühphase:** Frieren und Frösteln gehören zu den frühen Zeichen.', tipp: 'Ein frühes oder spätes Zeichen in der Tabelle?' }
    ],
    merksatz: 'In der **Frühphase** gleicht der Körper aus: **Puls schnell**, **Blutdruck noch normal**, Haut **blass, kühl, feucht**, **unruhig**. In der **Spätphase** reicht der Ausgleich nicht mehr: **Blutdruck unter 100**, **Zyanose**, **benommen**, **kaum Urin**. Der Blutdruck fällt erst **spät** – ein normaler Blutdruck schließt einen Schock **nicht** aus!',
    danach: 'Prüfen Sie jetzt noch einmal Aufgabe 2 auf dem Arbeitsblatt!'
  },

  /* ========================================================================
     Woche 1 · Schockformen und Lagerung nach Leitsymptom
     ======================================================================== */
  kb1ab03: {
    ab: 'Schockformen und Lagerung nach Leitsymptom',
    raum: 'kb1w1',
    titel: 'Übung: Welche Lagerung passt?',
    anweisung: 'Lesen Sie den kurzen Notfall. Welche Lagerung passt? Achten Sie auf das **Leitsymptom**.',
    knoepfe: [
      { kuerzel: 'SL', text: 'Beine hoch (Schocklagerung)' },
      { kuerzel: 'OK', text: 'Oberkörper hoch' },
      { kuerzel: 'SSL', text: 'stabile Seitenlage' },
      { kuerzel: 'REA', text: 'flach, harte Unterlage: Reanimation' }
    ],
    hilfe: {
      titel: 'Hilfe: Lagerung nach Leitsymptom',
      punkte: [
        'Schockzeichen **ohne** Atemnot → Beine ca. 30° hoch',
        '**Atemnot** oder Verdacht auf kardiogenen Schock → Oberkörper hoch',
        'bewusstlos, normale Atmung → stabile Seitenlage · keine normale Atmung → Reanimation'
      ]
    },
    mindestens: 6,
    karten: [
      { nummer: 1, text: 'Starke Blutung am Unterarm. Der Mann ist blass, Puls 120/min, ansprechbar, keine Atemnot.', richtig: 'SL',
        erklaerung: '**Schocklagerung:** Volumenmangel ohne Atemnot – Beine ca. 30° hoch, damit mehr Blut zum Herzen fließt. Und natürlich: Blutung stillen!', tipp: 'Hat er Atemnot? Ist er bei Bewusstsein?' },
      { nummer: 2, text: 'Plötzlich starke Brustschmerzen, Atemnot, gestaute Halsvenen, Puls 124/min.', richtig: 'OK',
        erklaerung: '**Oberkörper hoch:** Verdacht auf kardiogenen Schock (Herzinfarkt). Beine hoch würde das schwache Herz zusätzlich belasten.', tipp: 'Welches Organ pumpt hier zu schwach?' },
      { nummer: 3, text: 'Nach einem Sturz ist die Bewohnerin bewusstlos, sie atmet normal.', richtig: 'SSL',
        erklaerung: '**Stabile Seitenlage:** So bleiben die Atemwege frei.', tipp: 'Bewusstlos – aber atmet sie?' },
      { nummer: 4, text: 'Der Patient reagiert nicht und atmet nicht normal (nur vereinzelte Schnappatmung).', richtig: 'REA',
        erklaerung: '**Reanimation:** Keine normale Atmung = Kreislaufstillstand. Flach auf eine harte Unterlage, Hilfe rufen, Herzdruckmassage.', tipp: 'Ist Schnappatmung eine normale Atmung?' },
      { nummer: 5, text: 'Frau Maler um 11 Uhr: unruhig, schnelle Atmung, Luftnot, blass, Puls 118/min.', richtig: 'OK',
        erklaerung: '**Oberkörper hoch:** Leitsymptom ist die **Atemnot** – deshalb keine Schocklagerung.', tipp: 'Was ist bei Frau Maler das wichtigste Zeichen?' },
      { nummer: 6, text: 'Seit zwei Tagen Erbrechen, die Bewohnerin trinkt kaum. Puls 115/min, Blutdruck 95/60 mmHg, Atmung ruhig.', richtig: 'SL',
        erklaerung: '**Schocklagerung:** Volumenmangelschock durch Flüssigkeitsverlust, keine Atemnot.', tipp: 'Welche Schockform? Gibt es Atemnot?' },
      { nummer: 7, text: 'Nach einem Wespenstich: Quaddeln, pfeifende Atmung, Atemnot.', richtig: 'OK',
        erklaerung: '**Oberkörper hoch:** Anaphylaxie mit Atemnot – Lagerung nach Symptomen. (Bei Schwindel ohne Atemnot: flach, Beine hoch.)', tipp: 'Welches Symptom steht im Vordergrund?' },
      { nummer: 8, text: 'Harnwegsinfekt, Fieber 39,5 °C, verwirrt, Blutdruck 85/50 mmHg, keine Atemnot.', richtig: 'SL',
        erklaerung: '**Schocklagerung:** Septischer Schock (weite Gefäße), keine Atemnot – Beine hoch ist erlaubt. Sofort Ärztin bzw. Notruf!', tipp: 'Gibt es einen Grund gegen die Schocklagerung?' }
    ],
    merksatz: 'Das **Leitsymptom** entscheidet: Schockzeichen **ohne Atemnot** → **Beine ca. 30° hoch**. **Atemnot** oder **kardiogener Schock** → **Oberkörper hoch** – **keine** Schocklagerung! Bewusstlos mit normaler Atmung → **stabile Seitenlage**. Keine normale Atmung → **Reanimation**.',
    danach: 'Prüfen Sie jetzt noch einmal Aufgabe 1 auf dem Arbeitsblatt!'
  },

  /* ========================================================================
     Woche 1 · Anaphylaktischer Schock
     ======================================================================== */
  kb1ab04: {
    ab: 'Anaphylaktischer Schock',
    raum: 'kb1w1',
    titel: 'Übung: Anaphylaxie – was tun Sie?',
    anweisung: 'Herr Kowalski hat nach der Antibiotika-Infusion eine Anaphylaxie. Ist die Maßnahme **richtig**, **falsch** – oder darf sie die Pflegefachperson **nur nach ärztlicher Anordnung** durchführen?',
    knoepfe: [
      { kuerzel: 'R', text: 'richtig' },
      { kuerzel: 'F', text: 'falsch' },
      { kuerzel: 'A', text: 'nur nach ärztlicher Anordnung' }
    ],
    mindestens: 6,
    karten: [
      { nummer: 1, text: 'Die Infusion sofort stoppen.', richtig: 'R',
        erklaerung: '**Richtig:** Zuerst das Allergen stoppen.', tipp: 'Läuft das Allergen gerade noch in den Körper?' },
      { nummer: 2, text: 'Den venösen Zugang sofort herausziehen.', richtig: 'F',
        erklaerung: '**Falsch:** Den Zugang **liegen lassen** – die Ärztin braucht ihn für Notfallmedikamente.', tipp: 'Wofür braucht die Ärztin gleich einen Zugang?' },
      { nummer: 3, text: 'Adrenalin aus dem Notfallset spritzen.', richtig: 'A',
        erklaerung: '**Nur nach ärztlicher Anordnung:** Adrenalin ist das wichtigste Notfallmedikament – aber Medikamente geben Pflegende nur auf Anordnung (Ausnahme: eigener Autoinjektor der Person mit Notfallplan).', tipp: 'Wer entscheidet über Medikamente?' },
      { nummer: 4, text: 'Beim Patienten bleiben und Hilfe rufen.', richtig: 'R',
        erklaerung: '**Richtig:** Notruf bzw. Ärztin rufen – und Herrn Kowalski nicht allein lassen.', tipp: 'Darf man ihn jetzt allein lassen?' },
      { nummer: 5, text: 'Er hat Atemnot: den Oberkörper hochlagern.', richtig: 'R',
        erklaerung: '**Richtig:** Lagerung nach Symptomen – bei Atemnot Oberkörper hoch.', tipp: 'Welche Lagerung erleichtert das Atmen?' },
      { nummer: 6, text: 'Ein Antihistaminikum geben.', richtig: 'A',
        erklaerung: '**Nur nach ärztlicher Anordnung:** Antihistaminikum und Glukokortikoid gehören ins Notfallset – gegeben werden sie auf Anordnung.', tipp: 'Ist das ein Medikament?' },
      { nummer: 7, text: 'Die Quaddeln eincremen und eine halbe Stunde abwarten.', richtig: 'F',
        erklaerung: '**Falsch:** Quaddeln + Atemnot + Blutdruckabfall = Anaphylaxie, **Lebensgefahr**. Sofort handeln!', tipp: 'Sind nur die Haut-Zeichen wichtig?' },
      { nummer: 8, text: 'Er wird bewusstlos, atmet aber normal: stabile Seitenlage.', richtig: 'R',
        erklaerung: '**Richtig:** Bewusstlos mit normaler Atmung → stabile Seitenlage, Atmung weiter überwachen.', tipp: 'Bewusstlos – atmet er?' }
    ],
    merksatz: 'Anaphylaxie: **Allergen stoppen** (Infusion aus, **Zugang liegen lassen**) · **Notruf**, **beim Betroffenen bleiben** · **Lagerung nach Symptomen** · **Vitalzeichen engmaschig**. Notfallmedikamente (**Adrenalin**, Antihistaminikum, Glukokortikoid) **nur nach ärztlicher Anordnung**.',
    danach: 'Prüfen Sie jetzt noch einmal Aufgabe 2 auf dem Arbeitsblatt!'
  },

  /* ========================================================================
     Woche 2 · Starke Blutung stillen – Notfall-Szene „Notfall in der Werkstatt“ (art: 'szene', siehe szene.js)
     ======================================================================== */
  kb1ab05: {
    // Notfall-Szene statt Richtig-falsch-Karten (Programm: szene.js, Gestaltung: szene.css).
    // Jede „Karte“ ist eine Entscheidung mit eigenen Antworten (kuerzel: GROSSBUCHSTABEN, höchstens 6 Zeichen).
    // warum = Erklärung, wenn diese falsche Antwort gewählt wird · erklaerung = Erklärung nach der richtigen Antwort
    // blutung = so viele Prozent Blutverlust pro Sekunde, solange die Entscheidung offen ist · stopp = danach steht die Blutung
    art: 'szene',
    ab: 'Starke Blutung stillen',
    raum: 'kb1w2',
    titel: 'Notfall in der Werkstatt',
    anweisung: 'Sie kommen als Erste oder Erster zu einem Unfall. Entscheiden Sie richtig – **jede Sekunde zählt**.',
    regeln: [
      '**❤️❤️ Zwei Herzen:** Bei einem Fehler verlieren Sie ein Herz. Sind beide weg, bricht der Patient zusammen – der Fall beginnt von vorn.',
      '**🩸 Blutverlust:** Der rote Balken wächst, solange Sie überlegen. Richtige Maßnahmen bremsen ihn. Ist er voll, bricht der Patient zusammen.',
      'Die Zeit läuft erst, wenn Sie den Fall gelesen haben und auf **„Los“** tippen. Beim Lesen der Erklärungen steht sie still.'
    ],
    bilder: 'bilder/blutung/',
    herzen: 2,
    fehlerBlut: 10, // so viele Prozent Blutverlust kostet eine falsche Antwort
    faelle: [
      {
        titel: 'Fall 1 · In der Werkstatt',
        patient: 'Herr Weber',
        bild: '01-start',
        start: 5,
        text: 'Sie hören einen Schrei aus der Werkstatt. **Die Kreissäge läuft noch.** Der Haustechniker Herr Weber sitzt am Boden und hält seinen linken Unterarm. **Hellrotes Blut spritzt** im Takt des Herzschlags. Sein Kollege Herr Aydin steht daneben und zittert.',
        zusammenbruch: 'Herr Weber hat zu viel Blut verloren. Er wird bewusstlos. Der Rettungsdienst übernimmt.',
        zusammenbruchBild: '11-schock',
        ende: 'Der Rettungsdienst ist da. Sie übergeben: was passiert ist, was Sie getan haben und **seit wann das Tourniquet liegt**. Herr Weber kommt stabil in die Klinik.',
        endeBild: '08-uebergabe'
      },
      {
        titel: 'Fall 2 · Im Flur',
        patient: 'Frau Novak',
        bild: '13-flur',
        start: 30,
        text: 'Ein paar Tage später: Die Reinigungskraft Frau Novak ist in eine Glastür gestürzt. Aus ihrem **rechten Oberschenkel spritzt hellrotes Blut**. Eine Kollegin hat den Notruf abgesetzt und drückt auf die Wunde – **der Druck reicht nicht**. Sie haben das Tourniquet in der Hand.',
        zusammenbruch: 'Frau Novak hat zu viel Blut verloren. Sie wird bewusstlos. Der Rettungsdienst übernimmt.',
        zusammenbruchBild: '13-flur',
        ende: 'Die Blutung steht. Sie notieren die Uhrzeit und bleiben bei Frau Novak, bis der Rettungsdienst kommt.',
        endeBild: '14-oberschenkel'
      },
      {
        titel: 'Fall 3 · In der Küche',
        patient: 'Herr Petrović',
        bild: '15-kueche',
        start: 5,
        text: 'In der Küche ist eine Glasschüssel zerbrochen. Bei der Küchenhilfe Herrn Petrović **steckt ein großer Glassplitter im Unterarm**. Es blutet. Er will den Splitter herausziehen.',
        zusammenbruch: 'Jetzt blutet es stark aus der Wunde. Herr Petrović wird blass und schwindelig. Der Rettungsdienst übernimmt.',
        zusammenbruchBild: '15-kueche',
        ende: 'Herr Petrović ist versorgt. Der Splitter wird erst in der Klinik entfernt.',
        endeBild: '16-splitter'
      }
    ],
    karten: [
      { nummer: 1, fall: 1, bild: '01-start', blutung: 1.0,
        text: 'Die Säge läuft, Blut spritzt. **Was tun Sie zuerst?**',
        antworten: [
          { kuerzel: 'SICHER', text: 'Säge ausschalten, Handschuhe an, laut um Hilfe rufen' },
          { kuerzel: 'DRUCK', text: 'Sofort mit bloßen Händen auf die Wunde drücken',
            warum: 'Die Säge läuft noch, und Sie tragen keine Handschuhe. Wer sich selbst verletzt, kann nicht mehr helfen.' },
          { kuerzel: 'MESSEN', text: 'Zuerst Puls und Blutdruck messen',
            warum: 'Das kostet wertvolle Zeit – Herr Weber verliert weiter Blut. Erst die Gefahr beseitigen, dann die Blutung stoppen.' }
        ],
        richtig: 'SICHER',
        erklaerung: '**Nicht selbst verletzen:** Säge aus, Stecker raus, Einmalhandschuhe an. Sie rufen laut: „Herr Aydin, rufen Sie die 112!“',
        bildDanach: '02-not-aus' },
      { nummer: 2, fall: 1, bild: '09-schmerz', blutung: 1.0,
        text: 'Die Säge ist aus. Blut spritzt weiter aus dem Unterarm. **Was tun Sie jetzt?**',
        antworten: [
          { kuerzel: 'DRUCK', text: 'Sofort fest auf die Wunde drücken' },
          { kuerzel: 'HOLEN', text: 'Erst den Verbandkasten holen gehen',
            warum: 'Dann blutet Herr Weber weiter – und er ist allein. Drücken Sie sofort, notfalls mit einem sauberen Tuch. Den Verbandkasten kann Herr Aydin holen.' },
          { kuerzel: 'SPUELE', text: 'Die Wunde erst mit Wasser ausspülen',
            warum: 'Das kostet Zeit und Blut. Bei einer starken Blutung zählt nur eins: sofort fest auf die Wunde drücken.' }
        ],
        richtig: 'DRUCK',
        erklaerung: '**Auf die Wunde drücken:** Druck stoppt die Blutung am schnellsten – notfalls mit einem sauberen Tuch. Herr Weber bleibt sitzen, so kann er nicht stürzen. Herr Aydin bringt den Verbandkasten.',
        bildDanach: '03-druck' },
      { nummer: 3, fall: 1, bild: '03-druck', blutung: 0.3,
        text: 'Sie drücken eine Kompresse auf die Wunde. Ihre Hände sollen wieder frei werden. **Wie legen Sie den Druckverband an?**',
        antworten: [
          { kuerzel: 'VERB', text: 'Wundauflage, Druckpolster darauf, fest rundherum wickeln' },
          { kuerzel: 'PFLAST', text: 'Ein großes Pflaster aufkleben',
            warum: 'Ein Pflaster drückt nicht auf die Blutung. Druckverband: sterile Wundauflage – darauf ein Druckpolster – fest rundherum (zirkulär) wickeln.' },
          { kuerzel: 'LOCKER', text: 'Eine Binde ohne Polster locker wickeln',
            warum: 'Ohne Druckpolster und locker gewickelt drückt der Verband nicht. Das Druckpolster liegt genau über der Wunde.' }
        ],
        richtig: 'VERB',
        erklaerung: '**Druckverband:** Der Druck bleibt auf der Wunde, auch wenn Ihre Hände frei sind.',
        bildDanach: '04-druckverband' },
      { nummer: 4, fall: 1, bild: '04-druckverband', blutung: 0.3,
        text: 'Der Druckverband sitzt. **Was prüfen Sie jetzt?**',
        antworten: [
          { kuerzel: 'NAGEL', text: 'Nagelbettprobe: Wird der Fingernagel wieder rosa?' },
          { kuerzel: 'RR', text: 'Den Blutdruck am verletzten Arm messen',
            warum: 'Die Manschette würde den verletzten Arm zusätzlich abdrücken. Prüfen Sie mit der Nagelbettprobe, ob der Verband zu fest ist.' },
          { kuerzel: 'OFFEN', text: 'Den Verband kurz öffnen und nachsehen',
            warum: 'Nicht öffnen – dann blutet es sofort wieder. Prüfen Sie mit der Nagelbettprobe, ob der Verband zu fest ist.' }
        ],
        richtig: 'NAGEL',
        erklaerung: '**Nagelbettprobe:** Sie drücken kurz auf einen Fingernagel. Wird er in unter 2 Sekunden wieder rosa (Rekapillarisierungszeit), ist der Verband nicht zu fest.' },
      { nummer: 5, fall: 1, bild: '10-blass', blutung: 0.5,
        text: 'Kurz darauf ist der Verband **rot durchgeblutet**. Herr Weber wird blass. **Was tun Sie?**',
        antworten: [
          { kuerzel: 'ZWEIT', text: 'Zweites Druckpolster darüber, ersten Verband lassen' },
          { kuerzel: 'NEU', text: 'Den Verband abnehmen und neu wickeln',
            warum: 'Beim Abnehmen reißt die Wunde wieder auf – es blutet noch stärker. Den ersten Verband nie abnehmen, ein zweites Druckpolster kommt darüber.' },
          { kuerzel: 'WARTEN', text: 'Abwarten, bis der Rettungsdienst kommt',
            warum: 'Herr Weber verliert weiter Blut. Handeln Sie jetzt: ein zweites Druckpolster fest darüber.' }
        ],
        richtig: 'ZWEIT',
        erklaerung: 'Der erste Verband bleibt drauf. Ein **zweites Druckpolster** kommt fest darüber.' },
      { nummer: 6, fall: 1, bild: '10-blass', blutung: 0.6,
        text: 'Auch das zweite Polster wird sofort rot. Blut läuft am Arm herunter. **Was jetzt?**',
        antworten: [
          { kuerzel: 'TQ', text: 'Abbinden: ein Tourniquet anlegen' },
          { kuerzel: 'POLST', text: 'Ein drittes und viertes Polster wickeln',
            warum: 'Druck reicht hier nicht. Bei einer lebensbedrohlichen Blutung an Arm oder Bein binden Sie ab – so früh wie möglich.' },
          { kuerzel: 'KUEHL', text: 'Den Arm mit Eis kühlen',
            warum: 'Kühlen stoppt keine spritzende Blutung. Wenn Druck nicht reicht: ein Tourniquet anlegen.' }
        ],
        richtig: 'TQ',
        erklaerung: '**Abbinden** nicht bei jeder Blutung – aber wenn Druck nicht reicht und die Blutung an Arm oder Bein lebensbedrohlich ist: **so früh wie möglich**.' },
      { nummer: 7, fall: 1, bild: '04-druckverband', blutung: 0.6, stopp: true,
        text: 'Sie holen das Tourniquet aus dem Notfallkoffer. **Wo legen Sie es an?**',
        antworten: [
          { kuerzel: 'OBEN', text: '5–7 cm oberhalb der Wunde, nicht auf einem Gelenk' },
          { kuerzel: 'GELENK', text: 'Direkt auf den Ellenbogen',
            warum: 'Auf einem Gelenk drückt das Tourniquet die Schlagader nicht zu. Es kommt 5–7 cm oberhalb der Wunde, nicht auf ein Gelenk.' },
          { kuerzel: 'WUNDE', text: 'Direkt auf die Wunde',
            warum: 'Das Tourniquet muss zwischen Wunde und Herz liegen: 5–7 cm oberhalb der Wunde, nicht auf einem Gelenk.' }
        ],
        richtig: 'OBEN',
        erklaerung: 'Sie ziehen es fest, **bis die Blutung steht**. Am Handgelenk ist dann kein Puls mehr zu tasten – so soll es sein.',
        bildDanach: '05-tourniquet' },
      { nummer: 8, fall: 1, bild: '05-tourniquet', blutung: 0, zusammenbruchBild: '12-bewusstlos',
        text: 'Die Blutung steht. Herr Weber stöhnt: „Das tut so weh! Machen Sie es lockerer!“ **Was tun Sie?**',
        antworten: [
          { kuerzel: 'FEST', text: 'Fest lassen, Uhrzeit notieren, ihn beruhigen' },
          { kuerzel: 'LOCKER', text: 'Das Tourniquet ein bisschen lockern',
            warum: 'Dann blutet es sofort weiter. Ein Tourniquet tut sehr weh – das heißt nicht, dass es falsch sitzt. Es wird nicht gelockert.' },
          { kuerzel: 'ZEHN', text: 'Nach 10 Minuten kurz lockern',
            warum: 'Ein Tourniquet wird nicht gelockert – das macht erst die Klinik. Notieren Sie die Uhrzeit.' }
        ],
        richtig: 'FEST',
        erklaerung: 'Ein Tourniquet tut sehr weh – das heißt nicht, dass es falsch sitzt. **Notieren:** Die Uhrzeit kommt aufs Etikett. Die Klinik muss wissen, wie lange der Arm ohne Blut war.',
        bildDanach: '06-uhrzeit' },
      { nummer: 9, fall: 1, bild: '11-schock', blutung: 0, zusammenbruchBild: '12-bewusstlos',
        text: 'Herr Weber ist **sehr blass, kalt und schweißig**. Er hat große Angst. **Was tun Sie?**',
        antworten: [
          { kuerzel: 'BLEIB', text: 'Bei ihm bleiben, zudecken, beruhigen, beobachten' },
          { kuerzel: 'TRINK', text: 'Ihm schnell ein Glas Wasser holen',
            warum: 'Sie lassen ihn allein – und im Schock soll er nichts trinken. Bleiben Sie bei ihm, decken Sie ihn zu, beruhigen und beobachten Sie ihn.' },
          { kuerzel: 'TUER', text: 'Zum Eingang laufen, den Rettungsdienst holen',
            warum: 'Lassen Sie ihn nicht allein – es droht ein Schock. Den Rettungsdienst kann Herr Aydin am Eingang abholen.' }
        ],
        richtig: 'BLEIB',
        erklaerung: '**Nicht allein lassen:** Das sind Schockzeichen. Sie bleiben bei ihm, decken ihn mit der Rettungsdecke zu, sprechen ruhig mit ihm und beobachten ihn.',
        bildDanach: '07-rettungsdecke' },
      { nummer: 10, fall: 2, bild: '13-flur', blutung: 1.0,
        text: 'Frau Novak blutet stark aus dem rechten Oberschenkel. **Wo legen Sie das Tourniquet an?**',
        antworten: [
          { kuerzel: 'OBEN', text: 'Am Oberschenkel, 5–7 cm oberhalb der Wunde' },
          { kuerzel: 'KNIE', text: 'Direkt auf das Knie',
            warum: 'Auf einem Gelenk wirkt das Tourniquet nicht. Die Wunde ist am Oberschenkel – das Tourniquet kommt 5–7 cm oberhalb der Wunde.' },
          { kuerzel: 'UNTEN', text: 'Am Unterschenkel, unterhalb der Wunde',
            warum: 'Unterhalb der Wunde stoppt es kein Blut. Das Tourniquet liegt immer zwischen Wunde und Herz, also oberhalb der Wunde.' }
        ],
        richtig: 'OBEN',
        erklaerung: '5–7 cm oberhalb der Wunde, nicht auf einem Gelenk – das gilt am Arm und am Bein.',
        bildDanach: '14-oberschenkel' },
      { nummer: 11, fall: 2, bild: '14-oberschenkel', blutung: 1.0, stopp: true,
        text: 'Das Tourniquet liegt an der richtigen Stelle. **Wie fest ziehen Sie es zu?**',
        antworten: [
          { kuerzel: 'STEHT', text: 'So fest, bis die Blutung steht' },
          { kuerzel: 'PULS', text: 'Nur so fest, dass der Puls am Fuß bleibt',
            warum: 'Dann fließt noch Blut ins Bein – und aus der Wunde. Ziehen Sie fest, bis die Blutung steht. Kein Puls am Fuß ist dann richtig.' },
          { kuerzel: 'SANFT', text: 'Nur leicht, damit es nicht wehtut',
            warum: 'Ein lockeres Tourniquet stoppt die Blutung nicht. Es tut weh, wenn es richtig sitzt – trotzdem fest zuziehen.' }
        ],
        richtig: 'STEHT',
        erklaerung: 'Fest zuziehen, **bis die Blutung steht**. Dann die Uhrzeit notieren und das Tourniquet nicht mehr lockern.' },
      { nummer: 12, fall: 3, bild: '15-kueche', blutung: 0.3, stopp: true,
        text: 'Ein Glassplitter steckt im Unterarm. **Was machen Sie mit dem Splitter?**',
        antworten: [
          { kuerzel: 'DRIN', text: 'Drinlassen, rundherum abpolstern, festmachen' },
          { kuerzel: 'RAUS', text: 'Den Splitter vorsichtig herausziehen',
            warum: 'Der Splitter verschließt die Wunde gerade zum Teil. Ziehen Sie ihn heraus, kann es stark bluten. Er bleibt drin.' },
          { kuerzel: 'DRUCK', text: 'Fest direkt auf den Splitter drücken',
            warum: 'Dann drücken Sie den Splitter tiefer hinein. Polstern Sie rund um den Splitter ab – nicht auf ihn drücken.' }
        ],
        richtig: 'DRIN',
        erklaerung: 'Ein **Fremdkörper bleibt in der Wunde**. Sie legen Polster (z. B. Mullbinden) rund um den Splitter und befestigen sie mit einer Binde.',
        bildDanach: '16-splitter' }
    ],
    merkwort: [
      { b: 'N', wort: 'Nicht selbst verletzen', text: 'Gefahr beseitigen, Handschuhe an, laut um Hilfe rufen – 112' },
      { b: 'A', wort: 'Auf die Wunde drücken', text: 'hinsetzen oder hinlegen, sofort fest drücken' },
      { b: 'D', wort: 'Druckverband', text: 'Wundauflage, Druckpolster, zirkulär · durchgeblutet: zweites Polster darüber · Nagelbettprobe' },
      { b: 'A', wort: 'Abbinden', text: 'wenn Druck nicht reicht: so früh wie möglich, 5–7 cm oberhalb der Wunde, nicht auf einem Gelenk, fest bis die Blutung steht' },
      { b: 'N', wort: 'Notieren', text: 'Uhrzeit aufschreiben, Tourniquet nicht lockern, an den Rettungsdienst übergeben' },
      { b: 'N', wort: 'Nicht allein lassen', text: 'Schockzeichen beobachten, zudecken, beruhigen' }
    ],
    merksatz: 'Starke Blutung: **NA DANN** – **N**icht selbst verletzen · **A**uf die Wunde drücken · **D**ruckverband · **A**bbinden, wenn Druck nicht reicht · **N**otieren · **N**icht allein lassen. Ein **Fremdkörper bleibt in der Wunde**.',
    danach: 'Weiter auf dem Arbeitsblatt mit **Aufgabe 2: Das Tourniquet**.',
    // Beschriftungen der Szene ({x}, {y}, {a}, {b} werden automatisch ersetzt)
    texte: {
      regelnTitel: 'So geht’s',
      startKnopf: 'Fall 1 starten',
      losKnopf: 'Los – ich helfe!',
      weiterKnopf: 'Weiter',
      naechsterFall: 'Weiter zu Fall {x}',
      ergebnisKnopf: 'Zum Ergebnis',
      fortschritt: 'Fall {x} von {y} · Entscheidung {a} von {b}',
      blutLabel: 'Blutverlust',
      gestopptLabel: 'Blutung steht',
      ohneZeitLabel: 'ohne Zeitdruck',
      richtigText: 'Richtig!',
      falschText: 'Falsch – ein Herz weniger.',
      sperreText: 'Lesen Sie die Erklärung – weiter in {x} s',
      fallGeschafft: 'Geschafft!',
      zusammenbruchTitel: 'Zusammenbruch!',
      ursacheFehler: 'Zwei Fehler – keine Herzen mehr.',
      ursacheZeit: 'Das hat zu lange gedauert. {x} hat zu viel Blut verloren.',
      nochmalFall: 'Fall {x} noch einmal',
      ohneZeitKnopf: 'Noch einmal – ohne Zeitdruck',
      ohneZeitHinweis: 'Ohne Zeitdruck können Sie in Ruhe lesen. Die Herzen zählen weiter.',
      fertigTitel: 'Alle drei Notfälle gemeistert!',
      merkwortTitel: 'Das Merkwort: NA DANN',
      ersterVersuch: 'Beim ersten Versuch richtig: {x} von {y} Entscheidungen',
      nochmalAlles: 'Noch einmal von vorn spielen'
    }
  },

  /* ========================================================================
     Woche 2 · Offene Fraktur und Amputationsverletzung – Szene „Die Fingerspitze retten“ (art: 'szene', ohne Zeitdruck)
     ======================================================================== */
  kb1ab06: {
    // Notfall-Szene ohne Zeitdruck (szene.js): erst den Stumpf versorgen, dann den Replantatbeutel packen.
    // kacheln: true = Antworten als Kacheln mit Bild (icon = Datei in bilder/amputat/)
    // ohneHerz: true = nur zu früh gewählt (falsche Reihenfolge) → Hinweis, kein Herz weg
    art: 'szene',
    zeitdruck: false,
    ab: 'Offene Fraktur und Amputationsverletzung',
    raum: 'kb1w2',
    titel: 'Die Fingerspitze retten',
    anweisung: 'Der Gärtner hat sich mit der Astschere die **Spitze des Zeigefingers abgetrennt**. Versorgen Sie ihn – und packen Sie die Fingerspitze so, dass sie in der Klinik wieder angenäht werden kann.',
    regeln: [
      '**❤️❤️ Zwei Herzen:** Ein Fehler kostet ein Herz. Sind beide weg, ist die Fingerspitze nicht mehr zu retten – Sie beginnen von vorn.',
      '**⏳ Reihenfolge:** Tippen Sie die Dinge in der richtigen Reihenfolge an. Wählen Sie etwas nur **zu früh**, bekommen Sie einen Hinweis – ohne Herzverlust.',
      'Hier gibt es **keinen Zeitdruck**. Lesen Sie in Ruhe.'
    ],
    bilder: 'bilder/amputat/',
    herzen: 2,
    faelle: [
      {
        titel: 'Unfall im Garten',
        patient: 'der Gärtner',
        bild: 'garten.svg',
        text: 'Kurz nach Herrn Wolfs Sturz ruft der Gärtner um Hilfe: Er hat sich mit der Astschere die **Spitze des Zeigefingers abgetrennt**. Aus dem Finger blutet es stark. Die Fingerspitze liegt im Gras. Eine Kollegin setzt den Notruf ab.',
        zusammenbruch: 'So kann die Fingerspitze nicht mehr angenäht werden. Versuchen Sie es noch einmal von vorn.',
        zusammenbruchBild: 'garten.svg',
        ende: 'Der Rettungsdienst nimmt den Gärtner **und** den Beutel mit. In der Klinik kann die Fingerspitze wieder angenäht werden.',
        endeBild: 'krankenwagen.svg'
      }
    ],
    karten: [
      { nummer: 1, fall: 1, bild: 'garten.svg',
        text: 'Der Finger blutet stark, die Fingerspitze liegt im Gras. **Was tun Sie zuerst?**',
        antworten: [
          { kuerzel: 'STUMPF', text: 'Die Hand versorgen: fest drücken, Druckverband' },
          { kuerzel: 'SUCHEN', text: 'Zuerst die Fingerspitze holen und kühlen',
            warum: 'Die Blutung am Finger (Stumpf) ist wichtiger. Zuerst wird der Mensch versorgt, dann die Fingerspitze.' },
          { kuerzel: 'SPUELE', text: 'Den Finger unter Wasser ausspülen',
            warum: 'Das kostet Zeit, und es blutet weiter. Fest drücken und einen Stumpfverband mit Druckpolster anlegen.' }
        ],
        richtig: 'STUMPF',
        erklaerung: '**Zuerst der Stumpf:** fest drücken, Stumpfverband mit Druckpolster. Bei lebensbedrohlicher Blutung: Tourniquet.',
        bildDanach: 'hand-verband.svg' },
      { nummer: 2, fall: 1, bild: 'hand-verband.svg', kacheln: true,
        text: 'Die Hand ist versorgt. Jetzt packen Sie die Fingerspitze für die Klinik. **Was nehmen Sie zuerst?**',
        antworten: [
          { kuerzel: 'KOMPR', icon: 'kompresse.svg', text: 'Sterile Kompressen' },
          { kuerzel: 'BEUTEL', icon: 'beutel.svg', text: 'Wasser­dichter Beutel', ohneHerz: true,
            warum: 'Noch nicht – zuerst wird die Fingerspitze in sterile Kompressen eingewickelt.' },
          { kuerzel: 'EISW', icon: 'eiswasser.svg', text: 'Beutel mit Eiswasser', ohneHerz: true,
            warum: 'Noch nicht – die Fingerspitze darf nicht direkt ins Wasser. Zuerst sterile Kompressen.' },
          { kuerzel: 'WASSER', icon: 'wasserhahn.svg', text: 'Wasserhahn',
            warum: 'Nicht reinigen! Wasser weicht das Gewebe auf – dann lässt es sich schlechter annähen.' },
          { kuerzel: 'DESI', icon: 'desinfektion.svg', text: 'Desinfektion',
            warum: 'Kein Desinfektionsmittel – es schädigt das Gewebe. Das Amputat wird nicht gereinigt.' },
          { kuerzel: 'TUCH', icon: 'taschentuch.svg', text: 'Papier­taschentuch',
            warum: 'Ein Taschentuch ist nicht steril und klebt an der Wunde fest. Nehmen Sie sterile Kompressen.' }
        ],
        richtig: 'KOMPR',
        erklaerung: 'Die Fingerspitze wird **nicht gereinigt** und in **sterile Kompressen** eingewickelt – so bleibt sie keimarm.',
        bildDanach: 'paket-1.svg' },
      { nummer: 3, fall: 1, bild: 'paket-1.svg', kacheln: true,
        text: 'Die Fingerspitze ist in sterile Kompressen gewickelt. **Was kommt jetzt?**',
        antworten: [
          { kuerzel: 'BEUTEL', icon: 'beutel.svg', text: 'Wasser­dichter Beutel' },
          { kuerzel: 'EISW', icon: 'eiswasser.svg', text: 'Beutel mit Eiswasser', ohneHerz: true,
            warum: 'Noch nicht – erst kommt die Fingerspitze in einen eigenen, wasserdichten Beutel. Sonst wird sie nass.' },
          { kuerzel: 'ETIK', icon: 'etikett.svg', text: 'Etikett und Stift', ohneHerz: true,
            warum: 'Noch nicht – erst wird alles fertig verpackt, dann beschriftet.' },
          { kuerzel: 'EIS', icon: 'eiswuerfel.svg', text: 'Eiswürfel',
            warum: 'Nie direkt auf Eis – das Gewebe erfriert und kann nicht mehr angenäht werden.' },
          { kuerzel: 'FROST', icon: 'gefrierfach.svg', text: 'Gefrierfach',
            warum: 'Einfrieren zerstört das Gewebe. Die Fingerspitze wird nur gekühlt (ca. 4 °C), nicht gefroren.' },
          { kuerzel: 'WASSER', icon: 'wasserhahn.svg', text: 'Wasserhahn',
            warum: 'Nicht abspülen! Wasser weicht das Gewebe auf.' }
        ],
        richtig: 'BEUTEL',
        erklaerung: 'Ein **wasserdichter Beutel** schützt die Fingerspitze vor Nässe. Den Beutel gut verschließen.',
        bildDanach: 'paket-2.svg' },
      { nummer: 4, fall: 1, bild: 'paket-2.svg', kacheln: true,
        text: 'Der Beutel ist zu. **Wie kühlen Sie die Fingerspitze?**',
        antworten: [
          { kuerzel: 'EISW', icon: 'eiswasser.svg', text: 'Zweiter Beutel mit Eiswasser' },
          { kuerzel: 'EIS', icon: 'eiswuerfel.svg', text: 'Auf Eiswürfel legen',
            warum: 'Direkt auf Eis kann das Gewebe erfrieren. Eiswasser kühlt gleichmäßig auf etwa 4 °C.' },
          { kuerzel: 'FROST', icon: 'gefrierfach.svg', text: 'Ins Gefrierfach legen',
            warum: 'Einfrieren zerstört das Gewebe – dann kann die Fingerspitze nicht mehr angenäht werden.' }
        ],
        richtig: 'EISW',
        erklaerung: 'Den Beutel in einen **zweiten Beutel mit Eiswasser** (ca. 4 °C) legen – kühl, aber nicht gefroren.',
        bildDanach: 'paket-3.svg' },
      { nummer: 5, fall: 1, bild: 'paket-3.svg', kacheln: true,
        text: 'Fast fertig! **Was fehlt noch?**',
        antworten: [
          { kuerzel: 'ETIK', icon: 'etikett.svg', text: 'Etikett: Name und Uhrzeit' },
          { kuerzel: 'DESI', icon: 'desinfektion.svg', text: 'Desinfektion',
            warum: 'Nein – das Amputat wird nicht gereinigt oder desinfiziert. Es fehlt nur noch die Beschriftung.' },
          { kuerzel: 'TUCH', icon: 'taschentuch.svg', text: 'Papier­taschentuch',
            warum: 'Nein – das Taschentuch ist nicht steril und wird nicht gebraucht. Es fehlt nur noch die Beschriftung.' }
        ],
        richtig: 'ETIK',
        erklaerung: 'Den Beutel mit **Name und Uhrzeit** beschriften. So weiß die Klinik, wem die Fingerspitze gehört und wie alt die Verletzung ist.',
        bildDanach: 'paket-4.svg' },
      { nummer: 6, fall: 1, bild: 'paket-4.svg',
        text: 'Der Rettungsdienst ist da. **Wohin kommt der Beutel?**',
        antworten: [
          { kuerzel: 'MIT', text: 'Mit dem Verletzten in dieselbe Klinik' },
          { kuerzel: 'KUEHL', text: 'In den Kühlschrank, bis die Klinik anruft',
            warum: 'Die Fingerspitze wird dort gebraucht, wo der Gärtner operiert wird. Jede Stunde zählt.' },
          { kuerzel: 'SPAET', text: 'Die Familie bringt ihn später in die Klinik',
            warum: 'Das dauert zu lange. Der Beutel fährt sofort mit dem Verletzten mit.' }
        ],
        richtig: 'MIT',
        erklaerung: 'Das Amputat kommt **mit dem Verletzten** in dieselbe Klinik – dort wird es wieder angenäht.',
        bildDanach: 'krankenwagen.svg' }
    ],
    merkwort: [
      { b: '1', wort: 'Zuerst der Stumpf', text: 'fest drücken, Stumpfverband mit Druckpolster' },
      { b: '2', wort: 'Nicht reinigen', text: 'kein Wasser, kein Desinfektionsmittel' },
      { b: '3', wort: 'Sterile Kompressen', text: 'die Fingerspitze darin einwickeln' },
      { b: '4', wort: 'Wasserdichter Beutel', text: 'gut verschließen' },
      { b: '5', wort: 'Zweiter Beutel mit Eiswasser', text: 'ca. 4 °C – nie direkt auf Eis, nicht einfrieren' },
      { b: '6', wort: 'Beschriften und mitgeben', text: 'Name und Uhrzeit – mit dem Verletzten in die Klinik' }
    ],
    merksatz: '**Amputat:** zuerst den **Stumpf** versorgen · Amputat **nicht reinigen** · in **sterile Kompressen** · **wasserdichter Beutel** · in einen **zweiten Beutel mit Eiswasser** (ca. 4 °C) – **nie direkt auf Eis** · **beschriften** · **mit dem Verletzten** in die Klinik.',
    danach: 'Weiter auf dem Arbeitsblatt mit **Aufgabe 2: Drei Fehler im Bericht**.',
    texte: {
      regelnTitel: 'So geht’s',
      startKnopf: 'Los geht’s',
      losKnopf: 'Ich helfe!',
      weiterKnopf: 'Weiter',
      naechsterFall: 'Weiter',
      ergebnisKnopf: 'Zum Ergebnis',
      fortschritt: 'Schritt {a} von {b}',
      blutLabel: '',
      gestopptLabel: '',
      ohneZeitLabel: '',
      richtigText: 'Richtig!',
      falschText: 'Falsch – ein Herz weniger.',
      nochNichtText: 'Noch nicht – kein Herz weg.',
      sperreText: 'Lesen Sie den Hinweis – weiter in {x} s',
      fallGeschafft: 'Geschafft!',
      zusammenbruchTitel: 'Nicht mehr zu retten!',
      ursacheFehler: 'Zwei Fehler – keine Herzen mehr.',
      ursacheZeit: '',
      nochmalFall: 'Noch einmal von vorn',
      ohneZeitKnopf: '',
      ohneZeitHinweis: '',
      fertigTitel: 'Die Fingerspitze ist auf dem Weg in die Klinik!',
      merkwortTitel: 'So kommt ein Amputat in die Klinik',
      ersterVersuch: 'Beim ersten Versuch richtig: {x} von {y} Schritten',
      nochmalAlles: 'Noch einmal von vorn spielen'
    }
  },

  /* ========================================================================
     Woche 2 · Vom Auffinden bis zum Eintreffen des Rettungsdienstes
     ======================================================================== */
  kb1ab07: {
    ab: 'Vom Auffinden bis zum Eintreffen des Rettungsdienstes',
    raum: 'kb1w2',
    titel: 'Übung: A, B, C, D oder E?',
    anweisung: 'Zu welchem Buchstaben im **ABCDE-Schema** gehört die Prüfung oder Maßnahme?',
    knoepfe: [
      { kuerzel: 'A', text: 'A – Atemwege' },
      { kuerzel: 'B', text: 'B – Atmung' },
      { kuerzel: 'C', text: 'C – Kreislauf' },
      { kuerzel: 'D', text: 'D – Bewusstsein' },
      { kuerzel: 'E', text: 'E – ganzer Körper' }
    ],
    hilfe: {
      titel: 'Hilfe: Was gehört zu welchem Buchstaben?',
      punkte: [
        '**A – Airway:** Sind die Atemwege frei? (auch an die Halswirbelsäule denken)',
        '**B – Breathing:** Atmet die Person normal? Wie schnell?',
        '**C – Circulation:** Puls, Blutdruck, Hautfarbe, starke Blutung stoppen',
        '**D – Disability:** Bewusstsein (AVPU), Pupillen, Lähmungen',
        '**E – Exposure:** ganzen Körper ansehen, Verletzungen suchen, Wärme erhalten'
      ]
    },
    mindestens: 8,
    karten: [
      { nummer: 1, text: 'In den Mund schauen: Ist da etwas, das die Atmung behindert?', richtig: 'A',
        erklaerung: '**A – Atemwege:** Erst müssen die Atemwege frei sein.', tipp: 'Geht es um den Weg der Luft?' },
      { nummer: 2, text: 'Sehen, hören, fühlen – höchstens 10 Sekunden.', richtig: 'B',
        erklaerung: '**B – Atmung:** So prüfen Sie, ob die Person normal atmet.', tipp: 'Was prüfen Sie mit Sehen, Hören, Fühlen?' },
      { nummer: 3, text: 'Die Atemzüge in einer Minute zählen.', richtig: 'B',
        erklaerung: '**B – Atmung:** Atemfrequenz.', tipp: 'Herz oder Lunge?' },
      { nummer: 4, text: 'Puls fühlen und Blutdruck messen.', richtig: 'C',
        erklaerung: '**C – Kreislauf.**', tipp: 'Herz oder Lunge?' },
      { nummer: 5, text: 'Eine stark blutende Wunde am Bein stillen.', richtig: 'C',
        erklaerung: '**C – Kreislauf:** Eine starke Blutung bedroht den Kreislauf und wird sofort gestoppt.', tipp: 'Was verliert der Körper bei einer Blutung?' },
      { nummer: 6, text: 'Prüfen: wach – reagiert auf Ansprache – reagiert auf Schmerz – reagiert nicht.', richtig: 'D',
        erklaerung: '**D – Bewusstsein:** Das ist das AVPU-Schema.', tipp: 'Wie wach ist die Person?' },
      { nummer: 7, text: 'Die Pupillen mit einer Taschenlampe prüfen.', richtig: 'D',
        erklaerung: '**D – Neurologie:** Pupillen gehören zur Prüfung des Gehirns.', tipp: 'Welches Organ prüfen Sie über die Augen?' },
      { nummer: 8, text: 'Den ganzen Körper nach weiteren Verletzungen absuchen.', richtig: 'E',
        erklaerung: '**E – Exposure:** von Kopf bis Fuß ansehen (Bodycheck).', tipp: 'Geht es um ein Organ oder um den ganzen Körper?' },
      { nummer: 9, text: 'Die Person zudecken, damit sie nicht auskühlt.', richtig: 'E',
        erklaerung: '**E – Wärme erhalten:** Auskühlen verschlechtert den Zustand.', tipp: 'Am Ende des Schemas: ganzer Körper und …?' },
      { nummer: 10, text: 'Nach einem Sturz auf den Kopf: an eine Verletzung der Halswirbelsäule denken.', richtig: 'A',
        erklaerung: '**A – Atemwege mit Schutz der Halswirbelsäule:** Den Kopf nur so viel bewegen, wie es für freie Atemwege nötig ist.', tipp: 'Bei welchem Buchstaben bewegen Sie den Kopf?' }
    ],
    merksatz: 'Vorgehen im Notfall: **Situation einschätzen, Eigenschutz** · **ansprechen, anfassen** · **Hilfe rufen, Notruf 112** · **ABCDE** – Atemwege, Atmung, Kreislauf, Bewusstsein, ganzer Körper · **handeln nach Befund** (Reanimation, stabile Seitenlage, Lagerung nach Leitsymptom) · **überwachen und betreuen** · **SAMPLER** · **Übergabe vorbereiten** und dokumentieren.',
    danach: 'Prüfen Sie jetzt noch einmal Aufgabe 1 auf dem Arbeitsblatt!'
  },

  /* ========================================================================
     Woche 3 · Fremdkörperaspiration bei Erwachsenen, Kindern und Säuglingen
     ======================================================================== */
  kb1ab08: {
    ab: 'Fremdkörperaspiration bei Erwachsenen, Kindern und Säuglingen',
    raum: 'kb1w3',
    titel: 'Übung: Was tun Sie jetzt?',
    anweisung: 'Jemand hat sich beim Essen verschluckt. Was tun Sie **als Nächstes**?',
    knoepfe: [
      { kuerzel: 'HU', text: 'zum Husten ermutigen' },
      { kuerzel: 'RS', text: '5 Rückenschläge' },
      { kuerzel: 'HG', text: 'Heimlich-Handgriff' },
      { kuerzel: 'TK', text: '5 Thoraxkompressionen' },
      { kuerzel: 'REA', text: 'Notruf, Wiederbelebung' }
    ],
    hilfe: {
      titel: 'Hilfe: Der Ablauf',
      punkte: [
        '**Hustet kräftig, kann sprechen** (leicht): zum Husten ermutigen, dabeibleiben',
        '**Schwer, über 1 Jahr:** 5 Rückenschläge → 5 Oberbauchkompressionen (Heimlich) → im Wechsel',
        '**Schwer, Säugling:** 5 Rückenschläge → 5 Thoraxkompressionen → im Wechsel (kein Heimlich!)',
        '**Bewusstlos:** Notruf, Wiederbelebung'
      ]
    },
    mindestens: 8,
    karten: [
      { nummer: 1, text: 'Frau Maler verschluckt sich am Kaffee und hustet kräftig.', richtig: 'HU',
        erklaerung: '**Zum Husten ermutigen:** Kräftiges Husten ist die beste Hilfe. Dabeibleiben und beobachten.', tipp: 'Kann sie noch kräftig husten?' },
      { nummer: 2, text: 'Herr Lange, 79, kann nicht mehr sprechen und greift sich an den Hals. Sie haben noch nichts getan.', richtig: 'RS',
        erklaerung: '**Zuerst bis zu 5 Rückenschläge** zwischen die Schulterblätter – Oberkörper nach vorne gebeugt.', tipp: 'Was kommt bei schwerer Verlegung zuerst?' },
      { nummer: 3, text: 'Herr Lange: 5 Rückenschläge haben nicht geholfen. Er ist noch wach.', richtig: 'HG',
        erklaerung: '**Bis zu 5 Oberbauchkompressionen** (Heimlich-Handgriff): Faust auf den Oberbauch, ruckartig nach innen und oben.', tipp: 'Was folgt nach den Rückenschlägen bei Erwachsenen?' },
      { nummer: 4, text: 'Herr Lange: Auch 5 Oberbauchkompressionen haben nicht geholfen. Er ist noch wach.', richtig: 'RS',
        erklaerung: '**Im Wechsel:** wieder 5 Rückenschläge, dann wieder 5 Oberbauchkompressionen.', tipp: 'Wie geht der Wechsel weiter?' },
      { nummer: 5, text: 'Paul, 8 Monate, hustet nicht mehr und läuft blau an. Er ist wach.', richtig: 'RS',
        erklaerung: '**5 Rückenschläge:** bäuchlings auf den Unterarm, Kopf tiefer als der Körper.', tipp: 'Auch beim Säugling: Womit beginnt man?' },
      { nummer: 6, text: 'Paul, 8 Monate: 5 Rückenschläge haben nicht geholfen.', richtig: 'TK',
        erklaerung: '**5 Thoraxkompressionen:** auf den Rücken drehen, Kopf tiefer, Druck auf die untere Hälfte des Brustbeins. **Kein Heimlich-Handgriff beim Säugling!**', tipp: 'Darf man bei einem Säugling auf den Bauch drücken?' },
      { nummer: 7, text: 'Mia, 4 Jahre: 5 Rückenschläge haben nicht geholfen. Sie ist wach.', richtig: 'HG',
        erklaerung: '**Oberbauchkompressionen:** Bei Kindern über 1 Jahr wie bei Erwachsenen.', tipp: 'Ist Mia älter als 1 Jahr?' },
      { nummer: 8, text: 'Herr Lange sackt zusammen und reagiert nicht mehr.', richtig: 'REA',
        erklaerung: '**Bewusstlos:** hinlegen, Notruf, Wiederbelebung beginnen (Erwachsene 30 : 2).', tipp: 'Kann er noch mitarbeiten?' },
      { nummer: 9, text: 'Eine Bewohnerin sagt hustend: „Ich hab mich verschluckt.“', richtig: 'HU',
        erklaerung: '**Sie kann sprechen** – leichte Verlegung: zum Husten ermutigen, nicht klopfen.', tipp: 'Wer sprechen kann, bekommt Luft.' },
      { nummer: 10, text: 'Ein Besucher hustet immer leiser, kann nicht sprechen, die Lippen werden bläulich.', richtig: 'RS',
        erklaerung: '**Schwere Verlegung:** sofort handeln – zuerst bis zu 5 Rückenschläge.', tipp: 'Leise Husten, bläulich: leicht oder schwer?' }
    ],
    merksatz: '**Leicht** (hustet kräftig, kann sprechen): zum **Husten ermutigen**. **Schwer** (kann nicht sprechen, leiser Husten, blau): **5 Rückenschläge** → **5 Oberbauchkompressionen** (Heimlich) im Wechsel; **Säugling:** 5 Rückenschläge → **5 Thoraxkompressionen**, **kein Heimlich**. **Bewusstlos:** Notruf, **Wiederbelebung**. Danach immer **ärztlich untersuchen** lassen.',
    danach: 'Prüfen Sie jetzt noch einmal Aufgabe 2 auf dem Arbeitsblatt!'
  },

  /* ========================================================================
     Woche 3 · Frakturzeichen und Sofortmaßnahmen nach einem Sturz
     ======================================================================== */
  kb1ab09: {
    ab: 'Frakturzeichen und Sofortmaßnahmen nach einem Sturz',
    raum: 'kb1w3',
    titel: 'Übung: Sicher oder unsicher?',
    anweisung: 'Ist der Befund ein **sicheres** oder ein **unsicheres** Frakturzeichen?',
    knoepfe: [
      { kuerzel: 'S', text: 'sicheres Frakturzeichen' },
      { kuerzel: 'U', text: 'unsicheres Frakturzeichen' }
    ],
    mindestens: 8,
    karten: [
      { nummer: 1, text: 'Das Bein ist verkürzt und nach außen gedreht.', richtig: 'S',
        erklaerung: '**Sicher: Fehlstellung.** So lag Frau Maler nach ihrem Sturz.', tipp: 'Sieht man einen Bruch direkt an der Form?' },
      { nummer: 2, text: 'Die Hüfte tut sehr weh.', richtig: 'U',
        erklaerung: '**Unsicher: Schmerzen** – gibt es auch bei Prellungen.', tipp: 'Tut eine Prellung auch weh?' },
      { nummer: 3, text: 'Aus einer Wunde am Unterschenkel ragt ein Knochenstück.', richtig: 'S',
        erklaerung: '**Sicher: sichtbare Knochenfragmente** – eine offene Fraktur.', tipp: 'Sieht man den Knochen?' },
      { nummer: 4, text: 'Am Handgelenk bildet sich ein Bluterguss.', richtig: 'U',
        erklaerung: '**Unsicher: Hämatombildung** – auch bei Prellungen.', tipp: 'Gibt es einen Bluterguss nur beim Bruch?' },
      { nummer: 5, text: 'Der Unterarm lässt sich an einer Stelle bewegen, wo kein Gelenk ist.', richtig: 'S',
        erklaerung: '**Sicher: abnorme Beweglichkeit.** Nicht absichtlich prüfen!', tipp: 'Gibt es dort ein Gelenk?' },
      { nummer: 6, text: 'Der Knöchel ist dick geworden.', richtig: 'U',
        erklaerung: '**Unsicher: Schwellung** – auch bei Verstauchungen.', tipp: 'Schwillt eine Verstauchung auch an?' },
      { nummer: 7, text: 'Sie hält den Arm an den Körper gedrückt, weil es so weniger wehtut.', richtig: 'U',
        erklaerung: '**Unsicher: Schonhaltung.** Diese Haltung wird unterstützt (z. B. Dreiecktuch).', tipp: 'Warum hält sie den Arm so?' },
      { nummer: 8, text: 'Beim Bewegen hört man ein Knirschen am Knochen.', richtig: 'S',
        erklaerung: '**Sicher: Knochenreiben (Krepitation).** Wird **nicht** geprüft – sehr schmerzhaft!', tipp: 'Woher kommt das Knirschen?' },
      { nummer: 9, text: 'Er kann das Bein nicht mehr belasten.', richtig: 'U',
        erklaerung: '**Unsicher: eingeschränkte Belastbarkeit.**', tipp: 'Kann man auch mit einer Prellung schlecht auftreten?' },
      { nummer: 10, text: 'Sie kann den Arm kaum bewegen.', richtig: 'U',
        erklaerung: '**Unsicher: Bewegungseinschränkung.**', tipp: 'Ist das nur beim Bruch so?' }
    ],
    merksatz: '**Sichere Frakturzeichen:** sichtbare Knochenfragmente, **Fehlstellung**, abnorme Beweglichkeit, Knochenreiben (**nicht prüfen!**). **Unsichere:** Schmerzen, Schwellung, Bewegungseinschränkung, eingeschränkte Belastbarkeit, Schonhaltung, Hämatom. Nach einem Sturz: **nicht sofort aufhelfen**, erst prüfen; bei Verdacht ruhigstellen, Schonhaltung unterstützen, Notruf.',
    danach: 'Prüfen Sie jetzt noch einmal Aufgabe 1 auf dem Arbeitsblatt!'
  },

  /* ========================================================================
     Woche 3 · DMS-Kontrolle und Alarmzeichen
     ======================================================================== */
  kb1ab10: {
    ab: 'DMS-Kontrolle und Alarmzeichen',
    raum: 'kb1w3',
    titel: 'Übung: Normal oder Alarmzeichen?',
    anweisung: 'Sie kontrollieren **Durchblutung, Motorik und Sensibilität** bei einem Menschen mit Gips oder nach einer Operation. Ist der Befund **normal** oder ein **Alarmzeichen**?',
    knoepfe: [
      { kuerzel: 'N', text: 'normal' },
      { kuerzel: 'A', text: 'Alarmzeichen – sofort melden' }
    ],
    mindestens: 8,
    karten: [
      { nummer: 1, text: 'Die Zehen sind rosig und warm – wie auf der gesunden Seite.', richtig: 'N',
        erklaerung: '**Normal:** Die Durchblutung ist gut.', tipp: 'Wie sieht gut durchblutete Haut aus?' },
      { nummer: 2, text: 'Die Finger sind blass und kälter als auf der anderen Seite.', richtig: 'A',
        erklaerung: '**Alarmzeichen:** Störung der Durchblutung – vielleicht ist der Gips zu eng.', tipp: 'Seitenvergleich: gleich oder anders?' },
      { nummer: 3, text: 'Nach Druck auf den Nagel ist er nach 2 Sekunden wieder rosa.', richtig: 'N',
        erklaerung: '**Normal:** Nagelbettprobe in Ordnung.', tipp: 'Wie schnell soll der Nagel wieder rosa werden?' },
      { nummer: 4, text: '„Meine Finger sind wie eingeschlafen.“', richtig: 'A',
        erklaerung: '**Alarmzeichen:** Kribbeln und Taubheit zeigen eine Störung der Sensibilität (Nerv abgedrückt?).', tipp: 'Was bedeutet „eingeschlafen“?' },
      { nummer: 5, text: 'Er kann die Zehen heben und senken.', richtig: 'N',
        erklaerung: '**Normal:** Die Motorik ist erhalten.', tipp: 'Bewegen sich die Zehen?' },
      { nummer: 6, text: 'Sie kann die Zehen am operierten Bein kaum bewegen.', richtig: 'A',
        erklaerung: '**Alarmzeichen:** Bewegungsstörung – sofort melden.', tipp: 'Kann sie die Zehen bewegen wie auf der anderen Seite?' },
      { nummer: 7, text: 'Die Schmerzen werden trotz Schmerzmittel immer stärker, der Gips drückt.', richtig: 'A',
        erklaerung: '**Alarmzeichen:** zunehmende Schmerzen und Druck – Schwellung unter dem Gips?', tipp: 'Werden die Schmerzen besser oder schlimmer?' },
      { nummer: 8, text: 'Er spürt die Berührung an allen Zehen.', richtig: 'N',
        erklaerung: '**Normal:** Die Sensibilität ist erhalten.', tipp: 'Spürt er alles?' },
      { nummer: 9, text: 'Die Finger sind bläulich verfärbt.', richtig: 'A',
        erklaerung: '**Alarmzeichen:** Durchblutungsstörung.', tipp: 'Welche Farbe ist normal?' },
      { nummer: 10, text: 'Die Wade am operierten Bein ist seit gestern dick und tut beim Auftreten weh.', richtig: 'A',
        erklaerung: '**Alarmzeichen:** Veränderungen nach einer Operation werden immer gemeldet – hier Verdacht auf Thrombose (Woche 4).', tipp: 'Was hätte Christin tun müssen?' }
    ],
    merksatz: '**DMS:** **D**urchblutung (Farbe, Temperatur, Puls, Nagelbettprobe), **M**otorik (Finger/Zehen bewegen), **S**ensibilität (Berührung spüren, Kribbeln?) – immer **im Seitenvergleich** und **dokumentieren**. **Alarmzeichen** (blass, bläulich, kalt, Kribbeln, Taubheit, kaum Bewegung, zunehmende Schmerzen, Schwellung): **sofort melden** – nicht abwarten!',
    danach: 'Prüfen Sie jetzt noch einmal Aufgabe 1 auf dem Arbeitsblatt!'
  },
  kb1ab11: {
    ab: 'Schenkelhalsfraktur und Komplikationen nach Hüft-TEP',
    raum: 'kb1w4',
    titel: 'Übung: Welche Komplikation?',
    anweisung: 'Alle Personen haben eine **Hüft-TEP**. Welche **Komplikation** zeigt die Beobachtung?',
    knoepfe: [
      { kuerzel: 'LUX', text: 'Luxation' },
      { kuerzel: 'THR', text: 'Thrombose' },
      { kuerzel: 'LE', text: 'Lungenembolie' },
      { kuerzel: 'NB', text: 'Nachblutung' },
      { kuerzel: 'INF', text: 'Wundinfektion' }
    ],
    hilfe: {
      titel: 'Hilfe: Die wichtigsten Zeichen',
      punkte: [
        '**Luxation:** plötzlicher starker Schmerz, Bein verkürzt und verdreht, kann nicht bewegt werden',
        '**Thrombose:** Wade/Bein dick, warm, rot-bläulich, ziehender Schmerz',
        '**Lungenembolie:** plötzlich Atemnot, Brustschmerz, schneller Puls, blaue Lippen',
        '**Nachblutung:** Verband durchgeblutet, Schockzeichen',
        '**Wundinfektion:** Wunde rot, warm, geschwollen, Fieber'
      ]
    },
    mindestens: 8,
    karten: [
      { nummer: 1, text: 'Herr Ott bückt sich weit nach vorne. Plötzlich schreit er auf, sein Bein ist verkürzt und verdreht.', richtig: 'LUX',
        erklaerung: '**Luxation:** Die Hüfte wurde über 90° gebeugt – der künstliche Hüftkopf ist aus der Pfanne gesprungen. Nicht bewegen, sofort Ärztin.', tipp: 'Was passiert, wenn man sich mit einer neuen Hüfte zu weit bückt?' },
      { nummer: 2, text: 'Die rechte Wade ist seit gestern dick und tut beim Auftreten weh.', richtig: 'THR',
        erklaerung: '**Thrombose:** dicke, schmerzhafte Wade – genau wie bei Frau Maler. Sofort melden!', tipp: 'Erinnern Sie sich an Frau Malers Wade.' },
      { nummer: 3, text: 'Frau Seidel ringt plötzlich nach Luft, hat Schmerzen in der Brust, Puls 124/min.', richtig: 'LE',
        erklaerung: '**Lungenembolie:** Notruf 112, Oberkörper hoch, nicht allein lassen.', tipp: 'Wo ist das Problem – im Bein oder in der Lunge?' },
      { nummer: 4, text: 'Am Abend des OP-Tages ist der Verband durchgeblutet. Er ist blass, Puls 112/min.', richtig: 'NB',
        erklaerung: '**Nachblutung:** Blut im Verband und Schockzeichen – sofort melden, Vitalzeichen überwachen.', tipp: 'Was sieht man am Verband?' },
      { nummer: 5, text: 'Am 5. Tag ist die Wunde gerötet und warm. Temperatur 38,7 °C.', richtig: 'INF',
        erklaerung: '**Wundinfektion:** Rötung, Wärme und Fieber – melden.', tipp: 'Rot, warm, Fieber – woran denken Sie?' },
      { nummer: 6, text: 'Das Bein ist warm, geschwollen und rot-bläulich, es spannt.', richtig: 'THR',
        erklaerung: '**Thrombose:** Schwellung, Überwärmung, Verfärbung, Spannungsgefühl.', tipp: 'Betrifft es das ganze Bein oder nur die Wunde?' },
      { nummer: 7, text: 'Beim Umsetzen schlägt sie die Beine übereinander. Danach starker Schmerz in der Leiste, sie kann das Bein nicht bewegen.', richtig: 'LUX',
        erklaerung: '**Luxation:** Überkreuzen der Beine ist nach Hüft-TEP verboten (Keilkissen!).', tipp: 'Welche Bewegung ist nach einer Hüft-TEP verboten?' },
      { nummer: 8, text: 'Er ist unruhig, atmet sehr schnell und hat bläuliche Lippen. Vor zwei Tagen war seine Wade dick.', richtig: 'LE',
        erklaerung: '**Lungenembolie:** Das Gerinnsel aus der Wade ist in die Lunge gewandert.', tipp: 'Was kann aus einer Thrombose werden?' },
      { nummer: 9, text: 'In der Drainage ist in kurzer Zeit sehr viel Blut. Die Haut ist kalt und feucht.', richtig: 'NB',
        erklaerung: '**Nachblutung** mit Schockzeichen – sofort melden.', tipp: 'Woher kommt das Blut?' },
      { nummer: 10, text: 'Aus der Wunde tritt gelbliche Flüssigkeit aus, die Wundränder sind geschwollen.', richtig: 'INF',
        erklaerung: '**Wundinfektion:** Eiter und Schwellung – melden, Verband nur keimfrei nach Anordnung wechseln.', tipp: 'Ist das Blut – oder etwas anderes?' }
    ],
    merksatz: '**Luxation** (Schmerz, Bein verkürzt/verdreht) · **Thrombose** (Wade dick, warm, Schmerz) · **Lungenembolie** (plötzlich Atemnot, Brustschmerz) · **Nachblutung** (Verband durchgeblutet, Schock) · **Wundinfektion** (rot, warm, Fieber). **Immer sofort melden.** Vorbeugen: Bewegungsregeln (nicht über 90° beugen, Beine nicht überkreuzen) – und **bewegen statt liegen**.',
    danach: 'Prüfen Sie jetzt noch einmal Aufgabe 2 auf dem Arbeitsblatt!'
  },
  kb1ab12: {
    ab: 'Fast-Track nach Hüft-TEP',
    raum: 'kb1w4',
    titel: 'Übung: Fast-Track oder nicht?',
    anweisung: 'Passt die Situation zur **Fast-Track-Rehabilitation**?',
    knoepfe: [
      { kuerzel: 'J', text: 'passt zu Fast-Track' },
      { kuerzel: 'N', text: 'passt nicht' }
    ],
    mindestens: 8,
    karten: [
      { nummer: 1, text: 'Herr Brandl steht schon am Abend des OP-Tages mit der Physiotherapeutin auf.', richtig: 'J',
        erklaerung: '**Passt:** frühzeitige Mobilisation – schon am OP-Tag oder am 1. Tag.', tipp: 'Wie früh soll man aufstehen?' },
      { nummer: 2, text: 'Frau Maler kommt wegen der Redon-Drainage zwei Tage nicht aus dem Bett.', richtig: 'N',
        erklaerung: '**Passt nicht:** Fast-Track verzichtet möglichst auf Drainagen und mobilisiert früh.', tipp: 'Was sagt Fast-Track zu Schläuchen?' },
      { nummer: 3, text: 'Vor der OP übt Frau Yilmaz das Gehen mit Unterarmgehstützen.', richtig: 'J',
        erklaerung: '**Passt:** Aufklärung und Übung vor der OP – sie fühlt sich danach sicherer.', tipp: 'Hilft es, vorher zu üben?' },
      { nummer: 4, text: 'Er bekommt erst ein Schmerzmittel, wenn er nach dem Gehen über starke Schmerzen klagt.', richtig: 'N',
        erklaerung: '**Passt nicht:** Schmerzmittel nach Anordnung **vor** der Mobilisation geben.', tipp: 'Wann ist das Schmerzmittel am hilfreichsten?' },
      { nummer: 5, text: 'Die Pflegende erfasst den Schmerz regelmäßig mit einer Skala von 0 bis 10.', richtig: 'J',
        erklaerung: '**Passt:** effektives Schmerzmanagement beginnt mit der Schmerzerfassung.', tipp: 'Wie misst man Schmerz?' },
      { nummer: 6, text: 'Nach der OP darf er drei Tage nichts essen.', richtig: 'N',
        erklaerung: '**Passt nicht:** schneller Kostaufbau – bald wieder trinken und essen.', tipp: 'Woher kommt die Kraft für die Mobilisation?' },
      { nummer: 7, text: 'Ärztin, Pflege und Physiotherapie arbeiten nach einem gemeinsamen Plan.', richtig: 'J',
        erklaerung: '**Passt:** Fast-Track ist Teamarbeit mit festen Abläufen.', tipp: 'Wer gehört zum Team?' },
      { nummer: 8, text: 'Er bekommt einen Blasenkatheter für eine Woche, damit er nicht aufstehen muss.', richtig: 'N',
        erklaerung: '**Passt nicht:** möglichst keine Sonden und Katheter – sie hindern am Aufstehen und erhöhen das Infektionsrisiko.', tipp: 'Soll er liegen bleiben?' },
      { nummer: 9, text: 'Die Pflegende nimmt Herrn Brandls Angst ernst, erklärt ihm die Bewegungsregeln und begleitet ihn beim Aufstehen.', richtig: 'J',
        erklaerung: '**Passt:** Aufklärung und Begleitung nehmen die Angst – so klappt die Mobilisation.', tipp: 'Was hilft gegen Angst?' },
      { nummer: 10, text: 'Seit der Entlassung ins Pflegeheim bleibt sie meist im Bett – „sie soll sich schonen“.', richtig: 'N',
        erklaerung: '**Passt nicht:** Die Mobilisation muss nach der Entlassung weitergehen – sonst droht eine Thrombose.', tipp: 'Endet Fast-Track an der Kliniktür?' }
    ],
    merksatz: '**Fast-Track-Rehabilitation:** angemessene **Aufklärung**, effektives **Schmerzmanagement**, **frühzeitige Mobilisation**, **schneller Kostaufbau**, möglichst **keine Sonden und Drainagen**. Nutzen: weniger Thrombose, Pneumonie, Dekubitus und Muskelabbau – schneller wieder selbstständig.',
    danach: 'Prüfen Sie jetzt noch einmal Aufgabe 1 auf dem Arbeitsblatt!'
  },
  kb1ab13: {
    ab: 'Übung im Examensstil',
    raum: 'kb1w4',
    titel: 'Übung: Welcher Operator?',
    anweisung: 'Lesen Sie die Antwort einer Auszubildenden. **Welchen Operator** erfüllt sie am besten?',
    knoepfe: [
      { kuerzel: 'NE', text: 'nennen' },
      { kuerzel: 'BS', text: 'beschreiben' },
      { kuerzel: 'ER', text: 'erläutern' },
      { kuerzel: 'BG', text: 'begründen' },
      { kuerzel: 'BU', text: 'beurteilen' }
    ],
    hilfe: {
      titel: 'Hilfe: Die Operatoren',
      punkte: [
        '**nennen:** aufzählen, ohne Erklärung',
        '**beschreiben:** geordnet in Fachsprache darstellen (z. B. Schritte)',
        '**erläutern:** erklären und mit einem Beispiel aus dem Fall zeigen',
        '**begründen:** mit Argumenten stützen („…, weil …“)',
        '**beurteilen:** prüfen, ob etwas richtig ist, und Stellung nehmen'
      ]
    },
    mindestens: 8,
    karten: [
      { nummer: 1, text: '„Luxation, Thrombose, Wundinfektion.“', richtig: 'NE',
        erklaerung: '**Nennen:** nur aufzählen – keine Erklärung nötig.', tipp: 'Gibt es eine Erklärung?' },
      { nummer: 2, text: '„Zuerst rufe ich Hilfe. Dann lagere ich den Oberkörper hoch. Danach kontrolliere ich Puls und Atmung.“', richtig: 'BS',
        erklaerung: '**Beschreiben:** geordnet, Schritt für Schritt, in Fachsprache.', tipp: 'Es ist eine Reihenfolge.' },
      { nummer: 3, text: '„Ein Gerinnsel kann sich aus der Beinvene lösen und in die Lunge wandern. So war es wohl bei Frau Maler: erst die dicke Wade, dann um 11 Uhr die Atemnot.“', richtig: 'ER',
        erklaerung: '**Erläutern:** Zusammenhang erklären **und** am Fall zeigen.', tipp: 'Gibt es eine Erklärung und ein Beispiel aus dem Fall?' },
      { nummer: 4, text: '„Ich lagere den Oberkörper hoch, weil Atemnot das Leitsymptom ist.“', richtig: 'BG',
        erklaerung: '**Begründen:** Maßnahme + „weil“ + Argument.', tipp: 'Achten Sie auf das Wort „weil“.' },
      { nummer: 5, text: '„Die Aussage der Kollegin ist falsch. Eine dicke Wade nach einer OP ist nicht normal, sondern ein Alarmzeichen. Ich melde es sofort.“', richtig: 'BU',
        erklaerung: '**Beurteilen:** Stellung nehmen (falsch), begründen und eine Folgerung ziehen.', tipp: 'Wird hier eine Aussage bewertet?' },
      { nummer: 6, text: '„Aufklärung, Schmerzmanagement, frühe Mobilisation.“', richtig: 'NE',
        erklaerung: '**Nennen:** drei Fast-Track-Maßnahmen, ohne Erklärung.', tipp: 'Ganze Sätze oder nur Stichworte?' },
      { nummer: 7, text: '„Ich spreche Frau Maler an, prüfe Bewusstsein und Atmung, setze den Notruf ab und beginne mit der Reanimation.“', richtig: 'BS',
        erklaerung: '**Beschreiben:** das Vorgehen geordnet darstellen.', tipp: 'Wird erklärt – oder nur der Ablauf dargestellt?' },
      { nummer: 8, text: '„Frühe Mobilisation beugt einer Thrombose vor: Die Muskelpumpe bringt das Blut zurück zum Herzen. Bei Herrn Brandl heißt das: schon heute an die Bettkante.“', richtig: 'ER',
        erklaerung: '**Erläutern:** Wirkung erklären und auf den Fall übertragen.', tipp: 'Erklärung plus Fallbeispiel?' },
      { nummer: 9, text: '„Herr Keller ist im Schock, weil sein Puls 124/min beträgt und seine Haut blass und kaltschweißig ist.“', richtig: 'BG',
        erklaerung: '**Begründen:** Behauptung (Schock) mit Befunden stützen.', tipp: 'Wird eine Behauptung mit Befunden gestützt?' },
      { nummer: 10, text: '„Herrn Hartmanns Satz stimmt nicht. Liegen schützt nicht vor einer Luxation – die Bewegungsregeln tun das. Liegen erhöht das Thromboserisiko.“', richtig: 'BU',
        erklaerung: '**Beurteilen:** prüfen, ob die Aussage stimmt, und begründet Stellung nehmen.', tipp: 'Wird eine Aussage geprüft?' }
    ],
    merksatz: '**Nennen** = aufzählen · **Beschreiben** = geordnet darstellen · **Erläutern** = erklären + Beispiel aus dem Fall · **Begründen** = „…, weil …“ · **Beurteilen** = prüfen und begründet Stellung nehmen. Mengenangaben beachten und immer mit **Fallbezug** antworten.',
    danach: 'Prüfen Sie jetzt noch einmal Ihre Antworten auf dem Arbeitsblatt: Passt jede Antwort zum Operator?'
  }
};

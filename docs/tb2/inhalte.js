/* ==========================================================================
   INHALTE – KB I · Notfallsituationen (3BFP2) · TB 2 neu ab KW 49 (Klassenarbeit am 12.01.2027)
   Woche 1 (raum 'kb1w1'): „Schock: Schockspirale und Schockzeichen“, „Schockformen und Lagerung nach
   Leitsymptom“, „Anaphylaktischer Schock“ – je eine Übung „Für die Schnellen“ (freiwillig).
   ==========================================================================

   Gleicher Aufbau wie im Repository 3BFP2_KB2_Notfall (docs/inhalte.js) – dort steht die ausführliche
   Anleitung. Kurz: Nur Text ZWISCHEN den Hochkommas ' … ' ändern; **fett** ist erlaubt.
     raum        – Woche ('kb1w1', später 'kb1w2' …) → Lehrerseite lehrer-3bfp2-1-kb1w1.html usw.
     knoepfe     – Antwortknöpfe (kuerzel nur GROSSBUCHSTABEN, höchstens 6 Zeichen)
     mindestens  – so viele Karten müssen beim ERSTEN Versuch richtig sein
     karten      – nummer, text, richtig, erklaerung, tipp
   Fachbegriffe nach Pflegias Band 2 (S. 801, 811, 831).
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
  }
};

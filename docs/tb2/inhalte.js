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
     Woche 2 · Starke Blutung stillen
     ======================================================================== */
  kb1ab05: {
    ab: 'Starke Blutung stillen',
    raum: 'kb1w2',
    titel: 'Übung: Blutung stoppen – was ist richtig?',
    anweisung: 'Ein Mitarbeiter hat sich tief in den Unterarm geschnitten, hellrotes Blut spritzt. Ist die Maßnahme **richtig** oder **falsch**?',
    knoepfe: [
      { kuerzel: 'R', text: 'richtig' },
      { kuerzel: 'F', text: 'falsch' }
    ],
    mindestens: 8,
    karten: [
      { nummer: 1, text: 'Einmalhandschuhe anziehen und fest direkt auf die Wunde drücken.', richtig: 'R',
        erklaerung: '**Richtig:** Eigenschutz – und Druck auf die Wunde ist die wichtigste Maßnahme.', tipp: 'Was stoppt eine Blutung am schnellsten?' },
      { nummer: 2, text: 'Den verletzten Arm hochhalten.', richtig: 'R',
        erklaerung: '**Richtig:** Hochhalten (Hochlagern) unterstützt die Blutstillung. Der Verletzte kann mithelfen.', tipp: 'Fließt Blut leichter nach oben oder nach unten?' },
      { nummer: 3, text: 'Ein Messer, das in der Wunde steckt, schnell herausziehen.', richtig: 'F',
        erklaerung: '**Falsch:** Fremdkörper **bleiben in der Wunde**. Abpolstern und festmachen – sonst kann es stärker bluten.', tipp: 'Was verschließt die Wunde gerade teilweise?' },
      { nummer: 4, text: 'Druckverband: sterile Wundauflage, darauf ein Druckpolster, rundherum befestigen.', richtig: 'R',
        erklaerung: '**Richtig:** So bleibt der Druck auf der Wunde, auch wenn die Hände frei werden.', tipp: 'Woraus besteht ein Druckverband?' },
      { nummer: 5, text: 'Der Verband ist durchgeblutet: Verband abnehmen und neu wickeln.', richtig: 'F',
        erklaerung: '**Falsch:** Den Verband **nicht abnehmen** – ein **zweites Druckpolster** darüber legen.', tipp: 'Was passiert mit der Wunde, wenn man den Verband abreißt?' },
      { nummer: 6, text: 'Bei jeder starken Blutung sofort abbinden.', richtig: 'F',
        erklaerung: '**Falsch:** Zuerst Druck und Druckverband. Abbinden nur, wenn das bei lebensbedrohlicher Blutung an Arm oder Bein nicht hilft.', tipp: 'Ist Abbinden die erste oder die letzte Möglichkeit?' },
      { nummer: 7, text: 'Abbinden: 5–7 cm oberhalb der Wunde, nicht über einem Gelenk.', richtig: 'R',
        erklaerung: '**Richtig:** Über einem Gelenk drückt die Abbindung die Schlagader nicht sicher ab.', tipp: 'Wo liegt die Schlagader gut zwischen Knochen und Haut?' },
      { nummer: 8, text: 'Die Uhrzeit des Abbindens notieren.', richtig: 'R',
        erklaerung: '**Richtig:** Die Klinik muss wissen, wie lange der Arm nicht durchblutet war.', tipp: 'Was muss die Ärztin später wissen?' },
      { nummer: 9, text: 'Nach 10 Minuten die Abbindung kurz lösen, damit der Arm Blut bekommt.', richtig: 'F',
        erklaerung: '**Falsch:** Eine Abbindung wird **nicht gelöst** – das macht nur die Ärztin oder der Notarzt.', tipp: 'Wer darf die Abbindung lösen?' },
      { nummer: 10, text: 'Nach dem Druckverband die Nagelbettprobe an den Fingern machen.', richtig: 'R',
        erklaerung: '**Richtig:** So prüfen Sie, ob der Verband zu fest ist. Der Nagel muss schnell wieder rosa werden.', tipp: 'Wie prüfen Sie die Durchblutung der Hand?' }
    ],
    merksatz: 'Starke Blutung: **Eigenschutz**, **Hilfe rufen** · **hinlegen/hinsetzen**, Arm **hoch**, **fest auf die Wunde drücken** · **Druckverband** (Wundauflage, Druckpolster, zirkulär) – blutet es durch: **zweites Polster darüber** · nur wenn nötig **abbinden**: 5–7 cm oberhalb, **Uhrzeit notieren**, **nicht lösen** · **Nagelbettprobe**, Schockzeichen beobachten. Fremdkörper **drin lassen**.',
    danach: 'Prüfen Sie jetzt noch einmal Aufgabe 1 auf dem Arbeitsblatt!'
  },

  /* ========================================================================
     Woche 2 · Offene Fraktur und Amputationsverletzung
     ======================================================================== */
  kb1ab06: {
    ab: 'Offene Fraktur und Amputationsverletzung',
    raum: 'kb1w2',
    titel: 'Übung: Offene Fraktur und Amputat',
    anweisung: 'Herr Wolf hat eine **offene Unterschenkelfraktur**, der Gärtner hat sich eine **Fingerspitze abgetrennt**. Ist das Vorgehen **richtig** oder **falsch**?',
    knoepfe: [
      { kuerzel: 'R', text: 'richtig' },
      { kuerzel: 'F', text: 'falsch' }
    ],
    mindestens: 6,
    karten: [
      { nummer: 1, text: 'Die Wunde über dem Bruch mit einer sterilen Kompresse abdecken.', richtig: 'R',
        erklaerung: '**Richtig:** Bei einer offenen Fraktur können Keime in die Wunde kommen – steril abdecken.', tipp: 'Was kann durch eine offene Wunde in den Knochen gelangen?' },
      { nummer: 2, text: 'Den Knochen vorsichtig zurückschieben.', richtig: 'F',
        erklaerung: '**Falsch:** Nicht einrichten! Das macht die Klinik. Sonst mehr Verletzung und Infektionsgefahr.', tipp: 'Wer richtet einen Bruch ein?' },
      { nummer: 3, text: 'Das Bein in der vorgefundenen Lage mit zusammengerollten Decken polstern.', richtig: 'R',
        erklaerung: '**Richtig:** Ruhigstellen und die Schonhaltung unterstützen.', tipp: 'Soll das Bein bewegt werden?' },
      { nummer: 4, text: 'Herrn Wolf aufhelfen, damit er auf einer Bank sitzen kann.', richtig: 'F',
        erklaerung: '**Falsch:** Nicht bewegen, nicht aufstehen lassen – bis der Rettungsdienst da ist.', tipp: 'Kann er mit dem Bruch stehen?' },
      { nummer: 5, text: 'Die abgetrennte Fingerspitze unter fließendem Wasser sauber spülen.', richtig: 'F',
        erklaerung: '**Falsch:** Das Amputat **nicht reinigen** und nicht in Wasser legen – das Gewebe wird geschädigt.', tipp: 'Was macht Wasser mit dem Gewebe?' },
      { nummer: 6, text: 'Fingerspitze in sterile Kompressen und einen Beutel – diesen in einen zweiten Beutel mit Eiswasser.', richtig: 'R',
        erklaerung: '**Richtig:** So bleibt das Amputat keimarm und kühl (ca. 4 °C).', tipp: 'Wozu sind zwei Beutel gut?' },
      { nummer: 7, text: 'Die Fingerspitze direkt auf Eiswürfel legen.', richtig: 'F',
        erklaerung: '**Falsch:** Direkter Kontakt mit Eis führt zu **Erfrierung** – das Gewebe kann dann nicht mehr angenäht werden.', tipp: 'Kühlen ja – aber wie?' },
      { nummer: 8, text: 'Den Beutel beschriften und mit dem Verletzten in die Klinik geben.', richtig: 'R',
        erklaerung: '**Richtig:** Das Amputat wird dort gebraucht, wo der Verletzte operiert wird.', tipp: 'Wo wird der Finger wieder angenäht?' }
    ],
    merksatz: '**Offene Fraktur:** Blutung stillen, Wunde **steril abdecken**, **nicht einrichten**, in der vorgefundenen Lage **ruhigstellen**, nicht bewegen, Schockzeichen beobachten. **Amputat:** nicht reinigen, in **sterile Kompressen** und einen Beutel, dann in einen **zweiten Beutel mit Eiswasser** – **nie direkt auf Eis**; beschriften, **mit dem Verletzten** in die Klinik.',
    danach: 'Prüfen Sie jetzt noch einmal Aufgabe 2 auf dem Arbeitsblatt!'
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
  }
};

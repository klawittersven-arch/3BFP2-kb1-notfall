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
     mindestens  – nur ohne Herzen (einstellungen.js: herzen: 0): so viele Karten müssen beim ERSTEN Versuch richtig sein
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
    // Nur wenn in einstellungen.js „herzen: 0“ steht (sonst schützen die Herzen):
    // {x} = beim ersten Versuch richtig, {y} = Anzahl Karten, {z} = nötige Mindestzahl
    durchklickenTitel: 'Hey, nicht einfach durchklicken!',
    durchklickenText: 'Beim ersten Versuch richtig: {x} von {y} – nötig sind mindestens {z}. Lesen Sie jede Karte genau und überlegen Sie, bevor Sie antworten.',
    durchklickenKnopf: 'Übung neu starten',
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
    nameDatenschutz: 'Gespeichert werden nur Ihr Name, Ihre Klasse, Ihr Fortschritt und bei welchen Karten der erste Versuch falsch war (die Lehrkraft sieht das nur zusammengefasst für die Klasse). Alles wird nach spätestens 12 Stunden automatisch gelöscht – nur Name und Punkte der Wochen-Challenge bleiben für die Siegerehrung bis zu 10 Tage.',
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

/* ==========================================================================================
   ERWEITERUNGEN für den Kartenstapel (seit 26.11.2026) – alle neuen Texte stehen hier:
   schritt2  = zweiter Schritt einer Karte (nach der richtigen ersten Antwort): Was ist stattdessen richtig?
               optionen: Liste, richtig: Nummer der richtigen Option (ab 0; die Reihenfolge mischt das Handy).
   aufwaermen = vor den Karten die Schritte in die richtige Reihenfolge tippen (ohne Herzen).
   bonus     = freiwilliger Bonus-Fall nach der Zusammenfassung (ohne Herzen): je Schritt drei Möglichkeiten,
               jede mit einer Reaktion.
   Fachlich: Pflegias Bd. 2 S. 793–795 (ABCDE), 802–805 (Blutstillung, Amputat, Atemwegsverlegung), 825 (Frakturen),
   831 (Anaphylaxie); ERC 2025 (Atemwegsverlegung: keine blinde Fingersuche).
   ========================================================================================== */
(function (I) {
  function schritt2(uid, nummer, s) { I[uid].karten.filter(function (k) { return k.nummer === nummer; })[0].schritt2 = s; }
  var STATT = 'Und was ist **stattdessen** richtig?';

  // ---------- Blutung stoppen: nach „falsch“ das richtige Vorgehen wählen ----------
  schritt2('kb1ab05', 3, { frage: STATT, richtig: 0,
    optionen: ['Das Messer in der Wunde lassen, abpolstern und festmachen.',
      'Das Messer vorsichtig drehen und dann ganz langsam herausziehen.',
      'Das Messer herausziehen und danach sofort fest auf die Wunde drücken.'],
    tipp: 'Der Fremdkörper verschließt die Wunde gerade teilweise.' });
  schritt2('kb1ab05', 5, { frage: STATT, richtig: 0,
    optionen: ['Den Verband lassen und ein zweites Druckpolster darüber legen.',
      'Den Verband abnehmen und die Wunde zuerst mit Wasser ausspülen.',
      'Den Verband etwas lockern, damit das Blut besser abfließen kann.'],
    tipp: 'Jedes Abnehmen reißt die Wunde wieder auf.' });
  schritt2('kb1ab05', 6, { frage: STATT, richtig: 0,
    optionen: ['Zuerst fest auf die Wunde drücken, dann einen Druckverband anlegen.',
      'Zuerst die Wunde gründlich reinigen und dann ein Pflaster aufkleben.',
      'Zuerst die Ärztin holen und bis dahin die Wunde nicht berühren.'],
    tipp: 'Was stoppt eine Blutung am schnellsten?' });
  schritt2('kb1ab05', 9, { frage: STATT, richtig: 0,
    optionen: ['Die Abbindung bleibt – lösen dürfen sie nur Ärztin oder Notarzt.',
      'Die Abbindung alle 30 Minuten für eine Minute kurz lösen, damit der Arm Blut bekommt.',
      'Die Abbindung lösen, sobald die Wunde nicht mehr blutet.'],
    tipp: 'Wer darf eine Abbindung lösen?' });

  // ---------- Offene Fraktur und Amputat ----------
  schritt2('kb1ab06', 2, { frage: STATT, richtig: 0,
    optionen: ['Nicht einrichten: die Wunde steril abdecken und das Bein ruhigstellen.',
      'Den Knochen zurückschieben und die Wunde danach mit Wasser spülen.',
      'Vorsichtig am Bein ziehen, bis es wieder ganz gerade liegt.'],
    tipp: 'Einrichten macht die Klinik.' });
  schritt2('kb1ab06', 4, { frage: STATT, richtig: 0,
    optionen: ['Liegen lassen, ruhigstellen und bis zum Rettungsdienst bei ihm bleiben.',
      'Ihn langsam aufstehen lassen, wenn er sagt, dass es nicht so wehtut.',
      'Ihn zu zweit vorsichtig zur Bank tragen, damit er bequemer sitzen kann.'],
    tipp: 'Jede Bewegung kann die Verletzung schlimmer machen.' });
  schritt2('kb1ab06', 5, { frage: STATT, richtig: 0,
    optionen: ['Nicht reinigen: trocken in sterile Kompressen und einen Beutel legen.',
      'Mit Desinfektionsmittel abwischen und dann in ein Glas Wasser legen.',
      'Kurz mit kaltem Wasser abspülen und danach direkt auf Eis legen.'],
    tipp: 'Wasser und Reinigung schädigen das Gewebe.' });
  schritt2('kb1ab06', 7, { frage: STATT, richtig: 0,
    optionen: ['Den Beutel mit dem Amputat in einen zweiten Beutel mit Eiswasser legen.',
      'Die Fingerspitze in ein Glas mit kaltem Leitungswasser legen und abdecken.',
      'Die Fingerspitze bis zur Abfahrt in das Gefrierfach legen.'],
    tipp: 'Kühlen ja – aber ohne direkten Kontakt mit Eis.' });

  // ---------- ABCDE: Aufwärmen ----------
  I.kb1ab07.aufwaermen = {
    titel: 'Zum Aufwärmen: die Reihenfolge',
    anweisung: 'In welcher **Reihenfolge** prüfen Sie im Notfall? Tippen Sie die Schritte nacheinander an.',
    schritte: ['Atemwege: Ist der Weg für die Luft frei?',
      'Atmung: Atmet die Person normal? Wie schnell?',
      'Kreislauf: Puls, Blutdruck, Haut, starke Blutung',
      'Bewusstsein: Wie wach ist die Person? Pupillen?',
      'ganzer Körper: Verletzungen suchen, Wärme erhalten'],
    tipp: 'Ohne freie Atemwege nützt keine Atmung – und ohne Atmung kein Kreislauf.',
    fertig: 'Genau: **A**temwege – **B**reathing (Atmung) – **C**irculation (Kreislauf) – **D**isability (Bewusstsein) – **E**xposure (ganzer Körper).'
  };

  // ---------- Anaphylaxie: Bonus-Fall ----------
  I.kb1ab04.bonus = {
    titel: 'Der Wespenstich beim Sommerfest',
    einleitung: 'Sommerfest im Pflegeheim. Eine Wespe sticht Frau Brandt (81) in den Unterarm. Wenige Minuten später juckt ihr ganzer Körper, am Hals sind Quaddeln, und sie sagt heiser: „Ich bekomme schlecht Luft.“',
    schritte: [
      { text: 'Sie sind als Erste bei Frau Brandt.', frage: 'Was tun Sie zuerst?', optionen: [
        { richtig: true, text: 'Hilfe und Notruf rufen lassen und bei Frau Brandt bleiben.', reaktion: 'Richtig. Ihre Kollegin setzt den Notruf ab und bringt das Notfallset. Sie bleiben bei Frau Brandt.' },
        { text: 'Erst einmal abwarten – vielleicht ist es nur eine starke Rötung.', reaktion: 'Frau Brandt bekommt immer schlechter Luft. Haut + Atemnot nach einem Stich = Anaphylaxie. Jede Minute zählt.' },
        { text: 'Frau Brandt in ihr Zimmer begleiten, damit sie sich hinlegt.', reaktion: 'Auf dem Weg wird ihr schwindelig. Laufen belastet den Kreislauf – erst Hilfe holen und bei ihr bleiben.' }] },
      { text: 'Frau Brandt sitzt im Rollstuhl. Sie atmet schnell und pfeifend, Puls 118/min.', frage: 'Wie lagern Sie Frau Brandt?', optionen: [
        { richtig: true, text: 'Oberkörper hoch – sie bleibt aufrecht sitzen.', reaktion: 'Richtig: Atemnot ist das Leitsymptom → Oberkörper hoch.' },
        { text: 'Flach auf den Boden legen und die Beine hoch.', reaktion: 'Im Liegen bekommt Frau Brandt noch schlechter Luft. Bei Atemnot: Oberkörper hoch.' },
        { text: 'In die stabile Seitenlage bringen.', reaktion: 'Frau Brandt ist wach. Die stabile Seitenlage ist für Bewusstlose, die normal atmen.' }] },
      { text: 'Im Notfallset liegt ein Adrenalin-Autoinjektor. Er gehört nicht Frau Brandt.', frage: 'Was machen Sie damit?', optionen: [
        { richtig: true, text: 'Ich gebe kein Medikament ohne ärztliche Anordnung und überwache weiter.', reaktion: 'Richtig. Notfallmedikamente nur nach ärztlicher Anordnung (Notfallstandard der Einrichtung beachten).' },
        { text: 'Ich spritze das Adrenalin sofort in ihren Oberschenkel.', reaktion: 'Nur nach ärztlicher Anordnung. Hätte Frau Brandt einen **eigenen** Autoinjektor mit Notfallplan, würden Sie ihr bei der Anwendung helfen.' },
        { text: 'Ich gebe ihr eine Allergie-Tablette aus ihrem Medikamentenfach.', reaktion: 'Medikamente nur nach Anordnung – und eine Tablette wirkt viel zu langsam.' }] },
      { text: 'Der Rettungsdienst ist in etwa 8 Minuten da.', frage: 'Was tun Sie bis dahin?', optionen: [
        { richtig: true, text: 'Atmung, Puls, Blutdruck und Bewusstsein engmaschig kontrollieren und ruhig sprechen.', reaktion: 'Richtig. So merken Sie sofort, wenn es Frau Brandt schlechter geht.' },
        { text: 'Kurz die anderen Bewohnerinnen beruhigen und dann wieder nach ihr sehen.', reaktion: 'Frau Brandt darf nicht allein bleiben – ihr Zustand kann sich jede Minute verschlechtern.' },
        { text: 'Die Einstichstelle mit einer kühlenden Salbe gut einreiben.', reaktion: 'Das hilft nicht gegen die Reaktion im ganzen Körper. Jetzt zählt: überwachen.' }] }
    ],
    schluss: 'Der Rettungsdienst übernimmt. Sie übergeben: Wespenstich, Zeichen, Vitalzeichen, Lagerung. Danach dokumentieren Sie die Allergie gut sichtbar.'
  };

  // ---------- Fremdkörperaspiration: Bonus-Fall ----------
  I.kb1ab08.bonus = {
    titel: 'Herr Lang beim Mittagessen',
    einleitung: 'Mittagessen im Pflegeheim. Herr Lang (76) isst Braten. Plötzlich hustet er und greift sich an den Hals.',
    schritte: [
      { text: 'Herr Lang hustet kräftig und sagt: „Geht schon …“', frage: 'Was tun Sie?', optionen: [
        { richtig: true, text: 'Ihn zum Husten ermutigen und bei ihm bleiben.', reaktion: 'Richtig. Solange er kräftig hustet, löst sich der Fremdkörper oft von selbst.' },
        { text: 'Sofort fest auf seinen Rücken schlagen.', reaktion: 'Noch nicht: Er hustet kräftig. Ermutigen Sie ihn zu husten und bleiben Sie bei ihm.' },
        { text: 'Ihm schnell ein Glas Wasser geben.', reaktion: 'Trinken kann das Verschlucken schlimmer machen. Ermutigen Sie ihn zu husten.' }] },
      { text: 'Der Husten wird schwach. Herr Lang kann nicht mehr sprechen, seine Lippen werden blau.', frage: 'Was tun Sie jetzt?', optionen: [
        { richtig: true, text: 'Hilfe rufen und bis zu 5 Schläge zwischen die Schulterblätter geben.', reaktion: 'Richtig. Oberkörper nach vorne beugen und mit der flachen Hand kräftig zwischen die Schulterblätter schlagen.' },
        { text: 'Mit den Fingern im Mund nach dem Stück Fleisch suchen.', reaktion: 'Keine blinde Fingersuche – Sie können das Stück tiefer schieben.' },
        { text: 'Ihn auf den Boden legen und mit der Herzdruckmassage beginnen.', reaktion: 'Er ist noch wach. Mit der Wiederbelebung beginnen Sie erst, wenn er bewusstlos wird.' }] },
      { text: 'Die 5 Rückenschläge haben nicht geholfen.', frage: 'Was kommt jetzt?', optionen: [
        { richtig: true, text: 'Bis zu 5 Oberbauchkompressionen (Heimlich-Handgriff).', reaktion: 'Richtig. Danach im Wechsel: 5 Rückenschläge, 5 Oberbauchkompressionen.' },
        { text: '5 Thoraxkompressionen wie bei einem Säugling.', reaktion: 'Thoraxkompressionen statt Heimlich gibt es beim Säugling. Bei Erwachsenen: Heimlich-Handgriff.' },
        { text: 'Noch einmal 20 Rückenschläge hintereinander.', reaktion: 'Nach 5 Rückenschlägen kommen 5 Oberbauchkompressionen – im Wechsel.' }] },
      { text: 'Herr Lang sackt zusammen. Er reagiert nicht und atmet nicht normal.', frage: 'Was tun Sie?', optionen: [
        { richtig: true, text: 'Notruf 112 und sofort mit der Wiederbelebung beginnen (30 : 2).', reaktion: 'Richtig. Die Herzdruckmassage kann den Fremdkörper zusätzlich lösen.' },
        { text: 'Herrn Lang vorsichtig in die stabile Seitenlage bringen und abwarten.', reaktion: 'Er atmet nicht normal – die stabile Seitenlage ist nur für Bewusstlose mit normaler Atmung.' },
        { text: 'Im Liegen einfach weiter Oberbauchkompressionen geben.', reaktion: 'Bei Bewusstlosigkeit gilt: Notruf und Wiederbelebung.' }] }
    ],
    schluss: 'Gut gemacht. Auch wenn der Fremdkörper herauskommt: Danach muss Herr Lang immer ärztlich untersucht werden.'
  };
})(INHALTE);

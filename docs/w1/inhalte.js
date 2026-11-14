/* ==========================================================================
   INHALTE – KB I Notfallsituationen · Themenblock 2 · Woche 1 (3BFP2)
   „Wenn der Kreislauf kämpft – vom Ausgleich zur Schockspirale“
   ==========================================================================

   In dieser Datei stehen die Texte der Übungen von Woche 1. Sie können die Texte
   hier ändern, ohne etwas vom Programm zu verstehen.

   So ändern Sie einen Text sicher:
   - Ändern Sie nur, was ZWISCHEN den einfachen Hochkommas ' … ' steht.
   - Die Hochkommas selbst, die Kommas am Zeilenende und die Klammern
     { } [ ] müssen stehen bleiben.
   - Deutsche Anführungszeichen „ … “ dürfen Sie im Text frei verwenden.
     Ein einfaches Hochkomma (') im Text müssen Sie als \' schreiben.
   - **Wort** wird fett gedruckt, \n beginnt eine neue Zeile.
   - Die Kennungen (id: 'rs2', 'k3' …) nicht ändern – der Beamer zählt damit die häufigsten Fehler.

   Wichtig: Merksätze und Einstiegsfragen stehen auch im Arbeitsblatt
   (werkzeuge/ab_w1_texte.js). Wenn Sie sie hier ändern, ändern Sie sie dort
   ebenso – der Test tests/w1.test.js meldet Abweichungen.
   Der Falltext von Frau Maler (AA1) ist wörtlich aus dem Fallbeispiel – bitte nicht ändern.
   ========================================================================== */

var INHALTE = {

  allgemein: {
    kopfzeile: 'KB I – Notfallsituationen · Woche 1 · 3BFP2',
    merksatzUeberschrift: 'Ihr Merksatz',
    merksatzHinweis: 'Geschafft! Diesen Merksatz finden Sie auch auf Ihrem Arbeitsblatt im Kasten „{titel}“.',
    fortschritt: '{x} von {y} gelöst',
    ersterVersuch: 'Beim ersten Versuch richtig: {x} von {y}',
    nochEinmal: 'Noch einmal üben',
    richtigText: 'Richtig!',
    falschText: 'Noch nicht richtig – versuchen Sie es noch einmal.',
    tippVorwort: 'Tipp:',
    weiter: 'Weiter',
    zurueck: 'Zurück',
    durchklickenTitel: 'Hey, nicht einfach durchklicken!',
    durchklickenText: 'Beim ersten Versuch richtig: {x} von {y} – nötig sind mindestens {z}. Lesen Sie jede Aufgabe genau und überlegen Sie, bevor Sie tippen. Dann erhalten Sie auch Ihren Merksatz.',
    durchklickenKnopf: 'Aufgabe neu starten'
  },

  start: {
    titel: 'Wenn der Kreislauf kämpft',
    einleitung: 'Die Stunde läuft über den QR-Code am Beamer: scannen, Vornamen eingeben – Ihr Handy wechselt dann automatisch mit.'
  },

  /* ------------------------------------------------------------------------
     MERKSÄTZE – erscheinen am Ende einer Übung und stehen fertig auf dem AB.
     { l: '…' } = Schlüsselwort (auf dem AB fett, am Beamer hervorgehoben)
     ------------------------------------------------------------------------ */
  merksaetze: {
    aa1: ['Frühzeichen eines Schocks finde ich im Fall an drei Stellen: ', { l: 'Aussagen und Verhalten' }, ', ', { l: 'Beobachtungen' }, ' und ', { l: 'Messwerte' }, '. Werte lese ich immer mit ', { l: 'Uhrzeit' }, ' und ', { l: 'Vorwert' }, ' – wichtig ist der ', { l: 'Verlauf' }, '.'],
    aa2: ['Fällt der Blutdruck, melden das die ', { l: 'Barorezeptoren' }, '. Der ', { l: 'Sympathikus' }, ' lässt das Herz schneller schlagen und macht die Gefäße eng (', { l: 'Zentralisation' }, '). ', { l: 'RAAS' }, ' und ', { l: 'ADH' }, ' halten Wasser zurück. So bleibt der Blutdruck zuerst fast normal: ', { l: 'Kompensation' }, '.'],
    aa3: ['Reicht der Ausgleich nicht mehr, entsteht im Gewebe ohne Sauerstoff ', { l: 'Laktat' }, ', das Blut wird sauer (', { l: 'Laktatazidose' }, '). Die Gefäße werden weit, das Blut ', { l: 'versackt' }, ', der Blutdruck fällt (', { l: 'Dekompensation' }, '), die Organe ', { l: 'versagen' }, ': ein Teufelskreis – die Schockspirale.'],
    aa4: ['Frühzeichen eines Schocks sind ', { l: 'Tachykardie' }, ', schnelle Atmung, ', { l: 'Unruhe' }, ', Blässe und kalter Schweiß. Der Blutdruck fällt erst ', { l: 'spät' }, '. ', { l: 'Schockindex' }, ' = Puls : systolischer Blutdruck (normal ca. 0,5) – über ', { l: '1' }, ' spricht für einen Schock.']
  },

  melden: {
    fehlerNameLaenge: 'Bitte geben Sie Ihren Vornamen ein (2 bis 20 Zeichen).',
    fehlerNameZeichen: 'Bitte nur Buchstaben, Ziffern, Leerzeichen und Bindestrich verwenden.',
    fehlerNameWort: 'Bitte wählen Sie einen anderen Namen.'
  },

  /* ------------------------------------------------------------------------
     EINSTIEG & CHECK-OUT: drei Fragen zu Frau Maler um 11 Uhr
     Runde 1 (Einstieg): nur das Ergebnis; Runde 2 (Check-out): Auflösung mit Erklärung.
     Gleiche Fragen wie im Arbeitsblatt (werkzeuge/ab_w1_texte.js → ENTSCHEIDUNG)
     ------------------------------------------------------------------------ */
  entscheidung: {
    fragen: [
      { nr: 'E1', frage: 'Frau Maler um 11 Uhr: Puls 118/min, Blutdruck 105/70 mmHg. Ist ihr Kreislauf in Ordnung?', optionen: ['A Ja – der Blutdruck ist fast normal.', 'B Nein – sie kann trotzdem in Lebensgefahr sein.'], richtig: 'B', erklaerung: 'Der Körper hält den Blutdruck durch Ausgleich (Kompensation). Puls 118/min, Blässe und kalter Schweiß zeigen: Der Kreislauf arbeitet hart. Schockindex 118 : 105 ≈ 1,1 → Schockgefahr.' },
      { nr: 'E2', frage: 'Der Blutdruck droht zu fallen. Was macht der Körper zuerst?', optionen: ['A Das Herz schlägt langsamer, damit es Kraft spart.', 'B Die Niere scheidet mehr Urin aus.', 'C Das Herz schlägt schneller und die Gefäße werden eng.'], richtig: 'C', erklaerung: 'Die Barorezeptoren melden den Druckabfall. Der Sympathikus macht das Herz schneller und die Gefäße eng. Die Niere hält Wasser zurück – es gibt weniger Urin.' },
      { nr: 'E3', frage: 'Warum ist Frau Maler blass und hat kalten Schweiß auf der Stirn?', optionen: ['A Die Gefäße in der Haut sind eng – das Blut fließt zu Herz und Gehirn.', 'B Sie friert, weil das Zimmer kalt ist.', 'C Sie ist nur aufgeregt, weil alles neu ist.'], richtig: 'A', erklaerung: 'Zentralisation: Der Sympathikus macht die Gefäße in Haut, Muskeln und Darm eng. Herz und Gehirn werden weiter versorgt. Der Sympathikus regt auch die Schweißdrüsen an.' }
    ]
  },

  /* ------------------------------------------------------------------------
     AA1: FRÜHZEICHEN FINDEN – Befunde im Bericht von Christin markieren
     Text in '…' ist nicht antippbar, { t: '…', k: '…', w: '…' } ist antippbar.
       k: 'verhalten'   = Aussage oder Verhalten
       k: 'beobachtung' = Beobachtung
       k: 'messwert'    = Messwert
       k: ''            = gehört nicht dazu (Ablenker)
       w                = Erklärung nach dem Prüfen
     ------------------------------------------------------------------------ */
  markieren: {
    seite: 'w1-befunde',
    titel: 'AA1 · Frühzeichen finden',
    anweisung: 'Lesen Sie Christins Bericht. Tippen Sie **alle Stellen** an, die zeigen, dass sich **Kreislauf oder Atmung** verändern. Noch einmal tippen = Markierung weg. Dann: „Prüfen“.',
    ohneQr: 'Diese Übung kommt automatisch, wenn die Folie am Beamer erscheint.',
    pruefen: 'Prüfen',
    kategorien: { verhalten: 'Aussage oder Verhalten', beobachtung: 'Beobachtung', messwert: 'Messwert', '': 'gehört nicht dazu' },
    legende: 'Grün = richtig markiert · Orange gestrichelt = übersehen · Grau durchgestrichen = gehört nicht dazu',
    ergebnis: 'Gefunden: {x} von {y} Befunden. Falsch markiert: {f}.',
    pflicht: 'messwert',
    fehltPflicht: 'Achtung: Sie haben noch keinen Messwert markiert. Schauen Sie auf Puls und Blutdruck!',
    weiterSuchen: 'Suchen Sie die übersehenen Stellen (orange gestrichelt) und entfernen Sie falsche Markierungen. Dann noch einmal prüfen.',
    geschafft: 'Alle Frühzeichen gefunden – stark! Tragen Sie sie jetzt in die Tabelle auf Ihrem Arbeitsblatt ein.',
    hoechstensFalsch: 2,
    ratenTitel: 'Bitte nicht raten!',
    ratenText: 'Sie haben {f} Sätze markiert, die nichts mit Kreislauf oder Atmung zu tun haben. Ihre Markierungen wurden gelöscht. Lesen Sie den Bericht in Ruhe noch einmal und markieren Sie nur, was wirklich ein Befund ist.',
    merksatz: 'aa1',
    merksatzTitel: 'Merksatz AA1',
    faelle: {
      maler: {
        titel: 'Christin berichtet über Frau Maler',
        teile: [
          '„[…] ',
          { t: 'Am Morgen des besagten Tages unterstützte ich sie bei der Körperpflege an der Bettkante.', k: '', w: 'Eine Pflegehandlung – kein Befund zu Kreislauf oder Atmung.' }, ' ',
          { t: 'Dabei klagte sie, ihre rechte Wade sei seit gestern dick und tue beim Auftreten weh.', k: '', w: 'Kein Schockzeichen. Aber Achtung: Eine dicke, schmerzende Wade muss man immer sofort weitergeben!' }, ' ',
          { t: 'Ich dachte, das komme von der Operation, und habe es nicht weitergegeben.', k: '', w: 'Christins Gedanke – kein Befund.' }, ' ',
          { t: 'Beim Frühstück verschluckte sie sich am Kaffee und hustete kräftig.', k: '', w: 'Sie hustet kräftig und danach ist alles gut – kein Schockzeichen.' }, ' ',
          { t: 'Ich ließ sie husten, und nach kurzer Zeit war alles wieder gut.', k: '', w: 'Alles wieder gut – kein Befund.' }, ' ',
          { t: 'Ich war noch drei- bis viermal wegen anderer Pflegehandlungen bei ihr im Zimmer, worüber sie sich sichtlich freute.', k: '', w: 'Sie freut sich – kein Befund.' }, '\n',
          'Gegen elf Uhr ',
          { t: 'wirkte sie unruhig,', k: 'verhalten', w: 'Unruhe: Der Sympathikus ist aktiv, das Gehirn bekommt vielleicht schon weniger Sauerstoff.' }, ' ',
          { t: 'atmete schnell', k: 'beobachtung', w: 'Schnelle Atmung: ein Frühzeichen.' }, ' ',
          { t: 'und sagte, sie bekomme schlecht Luft.', k: 'verhalten', w: 'Luftnot: Frau Maler sagt es selbst – eine wichtige Aussage.' }, ' ',
          { t: 'Sie war blass,', k: 'beobachtung', w: 'Blässe: Die Gefäße der Haut sind eng (Zentralisation).' }, ' ',
          { t: 'hatte kalten Schweiß auf der Stirn,', k: 'beobachtung', w: 'Kalter Schweiß: Der Sympathikus regt die Schweißdrüsen an.' }, ' ',
          { t: 'ihr Puls lag bei 118/min', k: 'messwert', w: 'Tachykardie: Das Herz schlägt schneller, damit der Blutdruck gehalten wird.' }, ' ',
          { t: 'und der Blutdruck bei 105/70 mmHg.', k: 'messwert', w: 'Der Blutdruck ist noch fast normal – der Körper gleicht aus (Kompensation).' }, ' ',
          { t: 'Ich dachte, sie sei nur aufgeregt, weil alles neu für sie ist.', k: '', w: 'Christins Vermutung – ein Fehlurteil: Aufregung erklärt Blässe, kalten Schweiß und Luftnot nicht.' },
          ' […]“'
        ]
      }
    }
  },

  /* ------------------------------------------------------------------------
     KETTE BAUEN: AA2 a Regelkreis · AA3 Schockspirale
     schritte: in der richtigen Reihenfolge (der erste steht fest).
     ablenker: Fehlerkarten; bei = bei welchen Schritten (0 = erster Schritt) sie zur Wahl stehen.
     ------------------------------------------------------------------------ */
  kette: {
    titel: 'Kette bauen',
    ohneKette: 'Diese Übung kommt automatisch, wenn die Folie am Beamer erscheint.',
    ketteTitel: 'Ihre Kette',
    frage: 'Schritt {n}: Was passiert als Nächstes?',
    richtig: 'Richtig!',
    fehlerkarte: 'Diese Karte ist falsch.',
    zuFrueh: 'Das passiert erst später.',
    tippVorwort: 'Tipp:',
    warten: 'Warten Sie, bis es vorne weitergeht.',
    durchklickenText: 'Beim ersten Versuch richtig: {x} von {y} – nötig sind mindestens {z}. Lesen Sie die Karten genau und schauen Sie in den Informationstext, bevor Sie tippen.',
    ketten: {
      regelkreis: {
        seite: 'w1-regelkreis',
        titel: 'AA2 a · Regelkreis: So hält der Körper den Blutdruck',
        anweisung: 'Bauen Sie den **Regelkreis**: Was passiert, wenn der Blutdruck fällt? Tippen Sie immer den **nächsten Schritt** an. Hilfe: **Informationstext 1** auf Ihrem Arbeitsblatt.',
        ketteTitel: 'Der Regelkreis',
        mindestensErsterVersuch: 3,
        merksatz: 'aa2',
        merksatzTitel: 'Merksatz AA2',
        ende: '↑ Zurück zu Schritt 2: Die Barorezeptoren messen immer weiter. Ist der Druck noch zu niedrig, bleibt der Sympathikus aktiv. So entsteht ein **Regelkreis**.',
        schritte: [
          { id: 'rs1', text: 'Der **Blutdruck fällt**.' },
          { id: 'rs2', text: 'Die **Barorezeptoren** in der Aorta und in der Halsschlagader melden: „Der Druck sinkt.“', tipp: 'Wer merkt zuerst, dass der Druck sinkt?' },
          { id: 'rs3', text: 'Das Kreislaufzentrum im Gehirn macht den **Sympathikus** aktiv (Adrenalin, Noradrenalin).', tipp: 'Wer gibt jetzt den Befehl an Herz und Gefäße?' },
          { id: 'rs4', text: 'Das **Herz schlägt schneller** und kräftiger → das Herzzeitvolumen steigt.', tipp: 'Was macht das Herz, wenn der Sympathikus aktiv ist?' },
          { id: 'rs5', text: 'Die **Gefäße** in Haut, Muskeln, Niere und Darm werden **eng** → **Zentralisation**: Das Blut fließt zu Herz und Gehirn.', tipp: 'Was passiert mit den Gefäßen der Haut?' },
          { id: 'rs6', text: '**RAAS** und **ADH** halten Wasser und Natrium zurück → Durst, wenig Urin.', tipp: 'Wie hilft die Niere – über Minuten bis Stunden?' },
          { id: 'rs7', text: 'Der Blutdruck bleibt **fast normal** → **Kompensation**.', tipp: 'Was ist das Ergebnis des Ausgleichs?' }
        ],
        ablenker: [
          { id: 'rf1', text: 'Der Körper merkt nichts – der Blutdruck bleibt einfach niedrig.', warum: 'Falsch: Druckfühler (**Barorezeptoren**) melden den Abfall sofort. Der Körper steuert dagegen.', bei: [1] },
          { id: 'rf2', text: 'Das Herz schlägt langsamer, damit es Kraft spart.', warum: 'Falsch: Der Sympathikus macht das Herz **schneller**. So pumpt es mehr Blut pro Minute.', bei: [2, 3] },
          { id: 'rf3', text: 'Die Gefäße in der Haut werden weit, damit die Haut warm bleibt.', warum: 'Falsch: Die Hautgefäße werden **eng**. Deshalb ist die Haut blass und kalt – das Blut geht zu Herz und Gehirn.', bei: [4] },
          { id: 'rf4', text: 'Die Niere scheidet mehr Wasser aus.', warum: 'Falsch: Die Niere **hält Wasser zurück** (RAAS, ADH). Es gibt weniger Urin.', bei: [5] },
          { id: 'rf5', text: 'Der Blutdruck steigt dauerhaft weit über den Normalwert.', warum: 'Falsch: Der Körper **hält** den Blutdruck nur. Er bleibt fast normal – nicht zu hoch.', bei: [6] }
        ]
      },
      spirale: {
        seite: 'w1-spirale',
        titel: 'AA3 · Die Schockspirale',
        anweisung: 'Was passiert, wenn der Ausgleich **nicht mehr reicht**? Bauen Sie die **Schockspirale**: Tippen Sie immer den **nächsten Schritt** an. Achtung: Es gibt **Fehlerkarten**! Hilfe: **Informationstext 2**.',
        ketteTitel: 'Die Schockspirale',
        mindestensErsterVersuch: 3,
        merksatz: 'aa3',
        merksatzTitel: 'Merksatz AA3',
        ende: '↻ Jede Folge verstärkt die Ursache: ein **Teufelskreis** – die **Schockspirale**.',
        schritte: [
          { id: 'ss1', text: 'Volumenmangel oder Kreislaufstörung: Der **Blutdruck droht zu fallen**.' },
          { id: 'ss2', text: '**Kompensation**: Puls ↑, die Gefäße in Haut, Muskeln und Darm werden eng (**Zentralisation**).', warum: 'Herz und Gehirn bleiben versorgt. Die Haut wird blass, kalt und schweißig.', tipp: 'Was tut der Körper zuerst?' },
          { id: 'ss3', text: 'Das schlecht durchblutete Gewebe bekommt **zu wenig Sauerstoff**.', tipp: 'Was fehlt dem Gewebe, wenn es wenig Blut bekommt?' },
          { id: 'ss4', text: 'Es gewinnt Energie ohne Sauerstoff → **Laktat** entsteht → das Blut wird sauer (**Laktatazidose**).', tipp: 'Was entsteht ohne Sauerstoff?' },
          { id: 'ss5', text: 'Die Azidose lähmt die Gefäßmuskeln: Die Gefäße werden **weit und durchlässig**, das Blut **versackt**.', tipp: 'Was macht das saure Blut mit den Gefäßen?' },
          { id: 'ss6', text: 'Weniger Blut fließt zum Herzen → der **Blutdruck fällt** (**Dekompensation**).', warum: 'Erst jetzt fällt der Blutdruck deutlich – ein Spätzeichen.', tipp: 'Was passiert jetzt mit dem Blutdruck?' },
          { id: 'ss7', text: 'Die **Organe versagen** (Niere, Lunge, Gehirn) → ohne Behandlung Tod.', tipp: 'Was ist das Ende der Spirale?' }
        ],
        ablenker: [
          { id: 'sf1', text: 'Die Gefäße in Haut und Darm werden weit, damit die Organe besser versorgt werden.', warum: 'Falsch: Bei der Kompensation werden diese Gefäße **eng** (Zentralisation) – nicht weit.', bei: [1] },
          { id: 'sf2', text: 'Der Sympathikus hebt den Blutdruck dauerhaft über den Normalwert.', warum: 'Falsch: Der Sympathikus **hält** den Blutdruck nur. Er bleibt anfangs fast normal.', bei: [2] },
          { id: 'sf3', text: 'Laktat gibt den Zellen neue Kraft – der Kreislauf erholt sich.', warum: 'Falsch: Laktat macht das Blut **sauer**. Das schadet den Gefäßen und dem Herzen.', bei: [3, 4] },
          { id: 'sf4', text: 'Die Gefäße werden noch enger – der Blutdruck steigt wieder.', warum: 'Falsch: Die Azidose **lähmt** die Gefäßmuskeln. Die Gefäße werden weit, das Blut versackt.', bei: [5] },
          { id: 'sf5', text: 'Die Niere scheidet jetzt besonders viel Urin aus.', warum: 'Falsch: Die Niere wird schlecht durchblutet. Es kommt **kaum noch Urin** – später versagt die Niere.', bei: [6] }
        ]
      }
    }
  },

  /* ------------------------------------------------------------------------
     KARTEN-QUIZ: AA4 Frühzeichen oder Spätzeichen? (nach Pflegias Band 2, S. 801, Tab. 1)
     richtig: Kürzel einer Option (F oder S)
     ------------------------------------------------------------------------ */
  karten: {
    titel: 'Karten-Quiz',
    ohneQuiz: 'Diese Übung kommt automatisch, wenn die Folie am Beamer erscheint.',
    karteVon: 'Karte {n} von {y}',
    richtig: 'Richtig!',
    falsch: 'Nicht ganz – richtig ist: {a}',
    naechste: 'Nächste Karte',
    auswerten: 'Auswerten',
    warten: 'Warten Sie, bis es vorne weitergeht.',
    durchklickenText: 'Beim ersten Versuch richtig: {x} von {y} – nötig sind mindestens {z}. Schauen Sie in die Tabelle „Frühzeichen und Spätzeichen“ auf Ihrem Arbeitsblatt und versuchen Sie es noch einmal.',
    quiz: {
      frueh: {
        seite: 'w1-frueh',
        titel: 'AA4 · Frühzeichen oder Spätzeichen?',
        anweisung: 'Ist das ein **Frühzeichen** (der Körper gleicht noch aus) oder ein **Spätzeichen** (der Ausgleich reicht nicht mehr)? Tippen Sie an.',
        optionen: [{ k: 'F', text: '🟡 Frühzeichen' }, { k: 'S', text: '🔴 Spätzeichen' }],
        mindestensErsterVersuch: 6,
        merksatz: 'aa4',
        merksatzTitel: 'Merksatz AA4',
        karten: [
          { id: 'k1', text: 'Puls 108/min, schnell und schwach', richtig: 'F', warum: 'Frühzeichen: Der Puls steigt früh (über 100/min). So hält das Herz den Blutdruck.' },
          { id: 'k2', text: 'Blutdruck 82/50 mmHg (systolisch unter 100)', richtig: 'S', warum: 'Spätzeichen: Der Blutdruck fällt erst, wenn der Ausgleich nicht mehr reicht (Dekompensation).' },
          { id: 'k3', text: 'Haut blass, kühl und feucht', richtig: 'F', warum: 'Frühzeichen: Zentralisation – die Hautgefäße sind eng, der Sympathikus macht Schweiß.' },
          { id: 'k4', text: 'Ängstlich und unruhig', richtig: 'F', warum: 'Frühzeichen: Stresshormone und weniger Sauerstoff im Gehirn machen unruhig.' },
          { id: 'k5', text: 'Teilnahmslos und benommen', richtig: 'S', warum: 'Spätzeichen: Das Gehirn bekommt zu wenig Sauerstoff, das Bewusstsein nimmt ab.' },
          { id: 'k6', text: 'Atmet schneller als sonst', richtig: 'F', warum: 'Frühzeichen: Die Atmung wird früh schneller.' },
          { id: 'k7', text: 'Blutdruck 118/80 mmHg – aber Puls 112/min', richtig: 'F', warum: 'Frühzeichen! Der Blutdruck ist noch normal, der Puls ist schnell: Der Körper gleicht aus.' },
          { id: 'k8', text: 'Kaum noch Urin', richtig: 'S', warum: 'Spätzeichen: Die Niere wird kaum noch durchblutet.' },
          { id: 'k9', text: 'Lippen bläulich (Zyanose), klebriger Schweiß', richtig: 'S', warum: 'Spätzeichen: starker Sauerstoffmangel.' }
        ]
      }
    }
  },

  /* ------------------------------------------------------------------------
     AA5: BEWERTUNGSRASTER (Peer-Korrektur des Transferfalls)
     punkte: je Kriterium; max: Höchstpunktzahl der Gruppe; pflicht: ohne dieses Kriterium höchstens max − 1;
     fehler: ein angehakter Fehler setzt die genannten Kriterien auf 0 (sperrt).
     ------------------------------------------------------------------------ */
  raster: {
    titel: 'AA5 · Bewertungsraster',
    anweisung: 'Lesen Sie die Lösung Ihrer Partnerin oder Ihres Partners. **Haken Sie an, was dort steht.** Die App zählt die Punkte.',
    speicher: 'kb1nf_w1_raster',
    gesamt: 'Punkte: {x} von {y}',
    rueckmeldung: 'Geben Sie jetzt eine Rückmeldung in einem Satz: Was ist gut gelungen – was fehlt noch?',
    fehlerTitel: 'Fehler, die Punkte kosten:',
    gesperrt: 'zählt nicht (Fehler angehakt)',
    zuruecksetzen: 'Alles zurücksetzen',
    gruppen: [
      { titel: '5.1 Befunde (je Befund 0,5 P., höchstens 2 P.)', max: 2, kriterien: [
        { id: 'angst', text: 'Verhalten: ängstlich, „Mir ist so komisch.“', punkte: 0.5 },
        { id: 'durst', text: 'Durst: fragt mehrmals, ob sie etwas trinken darf', punkte: 0.5 },
        { id: 'haut', text: 'Haut blass und feucht, Hände kalt', punkte: 0.5 },
        { id: 'puls', text: 'Puls von 84 auf 118/min gestiegen (mit Vorwert)', punkte: 0.5 },
        { id: 'rr', text: 'Blutdruck von 135/80 auf 112/90 mmHg gefallen (mit Vorwert)', punkte: 0.5 },
        { id: 'af', text: 'Atemfrequenz 24/min (schnell)', punkte: 0.5 }
      ] },
      { titel: '5.2 Kompensation (je Aspekt 1 P., höchstens 3 P.)', max: 3, pflicht: 'spaet',
        pflichtHinweis: 'Ohne die Begründung „Der Blutdruck fällt erst spät“ höchstens 2 Punkte.',
        kriterien: [
          { id: 'baro', text: 'Barorezeptoren melden den Druckabfall → der Sympathikus wird aktiv', punkte: 1 },
          { id: 'zentral', text: 'Puls ↑ (118/min) und Gefäße eng = Zentralisation (blasse, kalte, feuchte Haut)', punkte: 1 },
          { id: 'raas', text: 'RAAS und ADH halten Wasser und Natrium zurück (Durst)', punkte: 1 },
          { id: 'spaet', text: 'Begründung: Durch die Kompensation bleibt der Blutdruck anfangs fast normal, er fällt erst spät.', punkte: 1 }
        ] },
      { titel: '5.3 Schockindex (2 P.)', max: 2, kriterien: [
        { id: 'rechnung', text: 'Rechnung: 118 : 112 ≈ 1,05', punkte: 1 },
        { id: 'bewertung', text: 'Bewertung: über 1 (normal ca. 0,5) → spricht für einen Schock', punkte: 1 }
      ] }
    ],
    fehler: [
      { id: 'normal', text: '„Der Blutdruck ist normal, also liegt kein Schock vor.“', sperrt: ['spaet', 'bewertung'] }
    ]
  }
};

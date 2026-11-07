/* ==========================================================================
   INHALTE – KB I Notfallsituationen · Themenblock 2 · Woche 2 (3BFP2)
   „Schock ist nicht gleich Schock – vergleichen und nach Leitsymptom handeln“
   ==========================================================================

   In dieser Datei stehen die Texte der Übungen. Sie können die Texte hier ändern,
   ohne etwas vom Programm zu verstehen.

   So ändern Sie einen Text sicher:
   - Ändern Sie nur, was ZWISCHEN den einfachen Hochkommas ' … ' steht.
   - Die Hochkommas selbst, die Kommas am Zeilenende und die Klammern
     { } [ ] müssen stehen bleiben.
   - Deutsche Anführungszeichen „ … “ dürfen Sie im Text frei verwenden.
     Ein einfaches Hochkomma (') im Text müssen Sie als \' schreiben.
   - **Wort** wird fett gedruckt, \n beginnt eine neue Zeile.
   - Nach dem Speichern die Seite im Browser neu laden und kurz prüfen.

   Wichtig: Merksätze, Entscheidungsfragen und Lagerungskarten stehen auch im
   Arbeitsblatt (werkzeuge/ab_w2_texte.js). Wenn Sie sie hier ändern, ändern
   Sie sie dort ebenso – der Test tests/inhalte.test.js meldet Abweichungen.
   ========================================================================== */

var INHALTE = {

  /* ------------------------------------------------------------------------
     Texte, die auf allen Seiten gleich sind
     ------------------------------------------------------------------------ */
  allgemein: {
    kopfzeile: 'KB I – Notfallsituationen · Woche 2 · 3BFP2',
    merksatzUeberschrift: 'Ihr Merksatz',
    // {titel} = Name des Kastens auf dem Arbeitsblatt, z. B. „Merksatz AA1“ (dort steht der Merksatz fertig)
    merksatzHinweis: 'Geschafft! Diesen Merksatz finden Sie auch auf Ihrem Arbeitsblatt im Kasten „{titel}“.',
    fortschritt: '{x} von {y} gelöst',
    ersterVersuch: 'Beim ersten Versuch richtig: {x} von {y}',
    nochEinmal: 'Noch einmal üben',
    richtigText: 'Richtig!',
    falschText: 'Noch nicht richtig – versuchen Sie es noch einmal.',
    tippVorwort: 'Tipp:',
    weiter: 'Weiter',
    zurueck: 'Zurück',
    // {x} = beim ersten Versuch richtig, {y} = Anzahl, {z} = nötige Mindestzahl
    durchklickenTitel: 'Hey, nicht einfach durchklicken!',
    durchklickenText: 'Beim ersten Versuch richtig: {x} von {y} – nötig sind mindestens {z}. Lesen Sie jede Aufgabe genau und überlegen Sie, bevor Sie tippen. Dann erhalten Sie auch Ihren Merksatz.',
    durchklickenKnopf: 'Aufgabe neu starten'
  },

  /* ------------------------------------------------------------------------
     STARTSEITE (index.html) und Spalten der Beamer-Seite
     ------------------------------------------------------------------------ */
  // Die Startseite zeigt bewusst KEINE Links: Die SuS kommen nur über die QR-Codes
  // auf dem Arbeitsblatt zu den Übungen (Adressen der Übungen: siehe README).
  start: {
    titel: 'Schock ist nicht gleich Schock',
    einleitung: 'Die Stunde läuft über den QR-Code am Beamer: scannen, Vornamen eingeben – Ihr Handy wechselt dann automatisch mit. Zum Nachlesen nach der Stunde gibt es einen eigenen QR-Code auf der letzten Seite des Arbeitsblatts.'
  },

  /* ------------------------------------------------------------------------
     MERKSÄTZE – erscheinen am Ende einer Übung. { l: '…' } = Schlüsselwort (auf dem AB fett, am Beamer hervorgehoben)
     ------------------------------------------------------------------------ */
  merksaetze: {
    aa1: ['Ein Schock zeigt sich an den Zeichen des ', { l: 'Kreislaufs' }, ': Puls, Blutdruck, Haut und Bewusstsein. Die Schockform erkenne ich an der ', { l: 'Ursache' }, ' und an den ', { l: 'Begleitzeichen' }, ', z. B. Quaddeln oder Lähmungen.'],
    aa3: ['Die Lagerung richtet sich nach dem ', { l: 'Leitsymptom' }, ', nicht nach der Schockform: Atemnot → ', { l: 'Oberkörper hoch' }, '; Schockzeichen ohne Atemnot → ', { l: 'flach, Beine hoch' }, '; bewusstlos mit normaler Atmung → ', { l: 'stabile Seitenlage' }, '; Verdacht auf Wirbelsäulenverletzung → ', { l: 'nicht bewegen' }, '.'],
    aa4: ['Anaphylaxie: Allergen ', { l: 'stoppen' }, ', Hilfe holen, lagern nach ', { l: 'Leitsymptom' }, ', ', { l: 'Adrenalin' }, ' i. m. nach Anordnung oder SOP, überwachen und ', { l: 'dokumentieren' }, '.']
  },

  /* ------------------------------------------------------------------------
     ANMELDUNG in der Stunden-App (w2.html) – Prüfung des Vornamens
     (alle übrigen Texte der Stunde: inhalte_stunde.js)
     ------------------------------------------------------------------------ */
  melden: {
    fehlerNameLaenge: 'Bitte geben Sie Ihren Vornamen ein (2 bis 20 Zeichen).',
    fehlerNameZeichen: 'Bitte nur Buchstaben, Ziffern, Leerzeichen und Bindestrich verwenden.',
    fehlerNameWort: 'Bitte wählen Sie einen anderen Namen.'
  },

  /* ------------------------------------------------------------------------
     EINSTIEG & CHECK-OUT: „Wie hätten Sie gehandelt?“
     Die Lehrkraft zeigt die Notfälle nacheinander am Beamer, die Klasse stimmt am Handy ab
     (Texte der Folien und Handy-Bildschirme: inhalte_stunde.js). Runde 1 (Einstieg): nur das
     Ergebnis; Runde 2 (Check-out): Auflösung mit Erklärung.
     Gleiche Fragen wie im Arbeitsblatt (werkzeuge/ab_w2_texte.js → ENTSCHEIDUNG)
     ------------------------------------------------------------------------ */
  entscheidung: {
    fragen: [
      { nr: 'E1', frage: 'Frau K. hat nach einer Infusion Quaddeln, ringt nach Luft und hat einen Blutdruck von 85/50 mmHg. Wie lagern Sie sie?', optionen: ['A flach, Beine hoch', 'B Oberkörper hoch', 'C stabile Seitenlage'], richtig: 'B', erklaerung: 'Atemnot ist das Leitsymptom → Oberkörper hoch. Beine hoch würde die Atmung erschweren.' },
      { nr: 'E2', frage: 'Welches Medikament ist beim anaphylaktischen Schock das Mittel der ersten Wahl?', optionen: ['A Antihistaminikum', 'B Adrenalin i. m.', 'C Kortison i. v.'], richtig: 'B', erklaerung: 'Adrenalin wirkt am schnellsten auf Kreislauf, Schleimhäute und Bronchien. Antihistaminikum und Kortison kommen danach.' },
      { nr: 'E3', frage: 'Herr T. kann nach einem Kopfsprung die Beine nicht bewegen. Puls 54/min, Haut warm und rosig, Blutdruck 85/50 mmHg. Ist er stabil?', optionen: ['A Ja – Puls ruhig, Haut gut durchblutet', 'B Nein – das kann ein Schock sein'], richtig: 'B', erklaerung: 'Neurogener Schock: Der Sympathikus fällt aus – kein Pulsanstieg, keine Zentralisation, aber der Blutdruck ist niedrig.' },
      { nr: 'E4', frage: 'Frau Maler (Leitfall) um 11 Uhr: Sie ist unruhig, atmet schnell und bekommt schlecht Luft, ist blass und kaltschweißig. Puls 118/min, Blutdruck 105/70 mmHg. Wie lagern Sie sie?', optionen: ['A flach, Beine hoch', 'B Oberkörper hoch', 'C aufstehen lassen – ans offene Fenster'], richtig: 'B', erklaerung: 'Die Luftnot steht im Vordergrund → Oberkörper hoch, trotz Schockzeichen keine Schocklage. Nicht aufstehen lassen (Lungenembolie: weitere Gerinnsel können sich lösen), nicht allein lassen, sofort Hilfe holen.' }
    ]
  },

  /* ------------------------------------------------------------------------
     AA1: BEFUNDE MARKIEREN (w2-markieren.html?fall=a|b|c)
     Ein Fall besteht aus Teilen: Text in '…' ist nicht antippbar,
     { t: '…', k: '…', w: '…' } ist antippbar.
       k: 'schock'  = Schockzeichen (Kreislauf, Haut, Bewusstsein, Atmung)
       k: 'begleit' = Begleitzeichen, das auf die Schockform hinweist
       k: 'ursache' = Hinweis auf die Ursache
       k: ''        = gehört nicht dazu (Ablenker)
       w            = Erklärung nach dem Prüfen
     ------------------------------------------------------------------------ */
  markieren: {
    titel: 'AA1 · Expertenteam: Infotext und Fall',
    anweisung: 'Tippen Sie im Fall **alle Stellen** an, die auf einen Schock oder seine Ursache hinweisen. Tippen Sie noch einmal, um eine Markierung zu entfernen. Dann: „Prüfen“.',
    // Der Fall kommt nur aus dem QR-Code des Expertenblatts (?fall=a, ?fall=b, ?fall=c)
    ohneQr: 'Bitte scannen Sie den QR-Code auf Ihrem Expertenblatt (A, B oder C).',
    pruefen: 'Prüfen',
    kategorien: { schock: 'Schockzeichen', begleit: 'Begleitzeichen', ursache: 'Hinweis auf die Ursache', '': 'gehört nicht dazu' },
    legende: 'Grün = richtig markiert · Orange gestrichelt = übersehen · Grau durchgestrichen = gehört nicht dazu',
    // {x} gefunden, {y} gesamt, {f} falsch markiert
    ergebnis: 'Gefunden: {x} von {y} Hinweisen. Falsch markiert: {f}.',
    fehltKreislauf: 'Achtung: Sie haben noch kein Zeichen des Kreislaufs markiert (Puls, Blutdruck, Haut, Bewusstsein). Ohne Kreislaufzeichen ist es kein Schock!',
    weiterSuchen: 'Suchen Sie die übersehenen Stellen (orange gestrichelt) und entfernen Sie falsche Markierungen. Dann noch einmal prüfen.',
    geschafft: 'Alle Hinweise gefunden – stark!',
    // Schutz gegen Raten: Sind beim Prüfen mehr Sätze falsch markiert als erlaubt, werden alle
    // Markierungen gelöscht – ohne zu verraten, welche gestimmt hätten – und es geht von vorn los.
    hoechstensFalsch: 2,
    ratenTitel: 'Bitte nicht raten!',
    // {f} = falsch markierte Sätze
    ratenText: 'Sie haben {f} Sätze markiert, die nichts mit dem Schock oder seiner Ursache zu tun haben. Ihre Markierungen wurden gelöscht. Lesen Sie den Fall in Ruhe noch einmal und markieren Sie nur, was wirklich ein Hinweis ist.',
    faelle: {
      a: {
        titel: 'Expertenblatt A · Herr Albrecht (81)',
        teile: [
          { t: 'Herr Gerhard Albrecht (81) lebt seit vier Jahren im Pflegeheim „Am Kocherufer“.', k: '', w: 'Alter und Wohnort allein sind kein Hinweis auf einen Schock.' }, ' ',
          { t: 'Wegen eines Vorhofflimmerns nimmt er einen Gerinnungshemmer.', k: 'ursache', w: 'Gerinnungshemmer erhöhen das Blutungsrisiko.' }, ' ',
          { t: 'Am Vormittag hatte er schwarzen, klebrigen Stuhlgang.', k: 'ursache', w: 'Teerstuhl: Hinweis auf eine Blutung im Magen oder Zwölffingerdarm.' }, ' ',
          { t: 'Danach hat er mit seinem Zimmernachbarn Karten gespielt.', k: '', w: 'Eine Freizeitbeschäftigung – kein Hinweis.' }, '\n',
          'Als Sie ihn um 11:30 Uhr zum Mittagessen an die Bettkante setzen wollen, sagt er: ',
          { t: '„Mir wird ganz schwarz vor Augen.“', k: 'schock', w: 'Schwindel: Das Gehirn wird beim Aufsetzen schlechter durchblutet.' }, ' ',
          { t: 'Er ist blass,', k: 'schock', w: 'Blässe: Zentralisation – die Hautgefäße sind eng.' }, ' ',
          { t: 'seine Stirn ist kalt und feucht.', k: 'schock', w: 'Kalter Schweiß: Der Sympathikus ist aktiviert.' }, ' ',
          { t: 'Mehrmals bittet er um etwas zu trinken.', k: 'begleit', w: 'Durst: typisch für Volumenmangel (hypovolämischer Schock).' }, ' ',
          { t: 'Er wirkt unruhig und fragt, wo seine Frau sei, obwohl er sonst gut orientiert ist.', k: 'schock', w: 'Unruhe und neue Verwirrtheit: Das Gehirn ist schlechter versorgt.' }, ' Sie messen: ',
          { t: 'Puls 116/min,', k: 'schock', w: 'Tachykardie – der Puls ist von 78 auf 116/min gestiegen.' }, ' ',
          { t: 'Blutdruck 98/72 mmHg,', k: 'schock', w: 'Blutdruck gefallen, kleine Amplitude; Schockindex 116 : 98 ≈ 1,2.' }, ' ',
          { t: 'Atemfrequenz 24/min.', k: 'schock', w: 'Schnelle Atmung – ein Frühzeichen des Schocks.' }, ' ',
          { t: 'Bei der Morgenrunde lagen die Werte bei Puls 78/min und Blutdruck 145/85 mmHg.', k: 'schock', w: 'Die Vorwerte zeigen den Trend: Erst der Vergleich macht die Veränderung sichtbar.' }, ' ',
          { t: 'Seine Tochter hat sich für den Nachmittag zum Besuch angemeldet.', k: '', w: 'Ein geplanter Besuch ist kein Hinweis.' }
        ]
      },
      b: {
        titel: 'Expertenblatt B · Mia (19)',
        teile: [
          { t: 'Mia (19) ist Auszubildende im ersten Ausbildungsdrittel und mit Ihnen auf einer internistischen Station eingesetzt.', k: '', w: 'Beruf und Einsatzort sind kein Hinweis.' }, ' ',
          { t: 'In der Pause isst sie ein Stück Geburtstagskuchen, das Haselnüsse enthält.', k: 'ursache', w: 'Möglicher Auslöser: Nahrungsmittelallergie (Haselnuss).' }, ' ',
          { t: 'Dabei erzählt sie von ihrem Wochenende im Kletterpark.', k: '', w: 'Freizeit am Wochenende – kein Hinweis.' }, ' ',
          { t: 'Mia erwähnt, dass es bei Nüssen „schon mal im Mund gekribbelt“ habe.', k: 'ursache', w: 'Hinweis auf eine bekannte Überempfindlichkeit gegen Nüsse.' }, '\n',
          'Zehn Minuten später ',
          { t: 'kratzt sie sich an Hals und Händen, auf Hals und Brust bilden sich Quaddeln.', k: 'begleit', w: 'Hautzeichen der allergischen Reaktion (Histamin).' }, ' ',
          { t: 'Ihre Lippen und Augenlider schwellen an.', k: 'begleit', w: 'Schwellung durch durchlässige Gefäße (Angioödem).' }, ' ',
          { t: 'Mit heiserer Stimme', k: 'begleit', w: 'Heiserkeit: Die Kehlkopfschleimhaut schwillt an – Gefahr für die Atemwege!' }, ' sagt sie: ',
          { t: '„Mir ist schlecht, und mir ist so schwindelig.“', k: 'schock', w: 'Schwindel: Der Kreislauf ist beteiligt; Übelkeit ist ein Begleitzeichen.' }, ' ',
          { t: 'Sie hat Bauchkrämpfe.', k: 'begleit', w: 'Magen-Darm-Beteiligung bei Anaphylaxie.' }, ' Ihre Kollegin misst: ',
          { t: 'Puls 128/min,', k: 'schock', w: 'Tachykardie: Das Herz versucht auszugleichen.' }, ' ',
          { t: 'Blutdruck 88/50 mmHg,', k: 'schock', w: 'Blutdruckabfall durch weite Gefäße (relativer Volumenmangel).' }, ' ',
          { t: 'Atemfrequenz 26/min, Sauerstoffsättigung 93 %.', k: 'schock', w: 'Atemnot und Sauerstoffmangel.' }, ' ',
          { t: 'Sie notiert die Werte auf einem Zettel.', k: '', w: 'Das Notieren ist richtig, aber kein Hinweis auf den Schock.' }, ' ',
          { t: 'Mia sagt, ihr Blutdruck sei sonst „immer so 120 zu 70“.', k: 'schock', w: 'Vorwert: Der Blutdruck ist deutlich gefallen.' }
        ]
      },
      c: {
        titel: 'Expertenblatt C · Herr Weber (24)',
        teile: [
          { t: 'An einem Sonntagnachmittag sind Sie privat mit Freunden am Baggersee.', k: '', w: 'Ort und Tag sind kein Hinweis.' }, ' ',
          { t: 'Tobias Weber (24) springt kopfüber vom Steg ins Wasser – an einer Stelle, an der das Wasser nur hüfttief ist.', k: 'ursache', w: 'Kopfsprung in flaches Wasser: typischer Unfallhergang für eine Verletzung der Halswirbelsäule.' }, ' ',
          'Seine Freunde ziehen ihn sofort ans Ufer. ',
          { t: 'Kurz vorher hatte er sich noch mit Sonnencreme eingecremt.', k: '', w: 'Sonnencreme hat mit dem Notfall nichts zu tun.' }, '\n',
          'Herr Weber ist wach und sagt: ',
          { t: '„Ich spür meine Beine nicht. Und meine Hände kribbeln.“', k: 'begleit', w: 'Gefühlsstörungen: Das Rückenmark ist verletzt.' }, ' ',
          { t: 'Er klagt über starke Nackenschmerzen.', k: 'ursache', w: 'Hinweis auf eine Verletzung der Halswirbelsäule.' }, ' ',
          { t: 'Arme und Beine kann er kaum bewegen.', k: 'begleit', w: 'Lähmungen unterhalb der Verletzung.' }, ' ',
          { t: 'Seine Atmung ist flach.', k: 'schock', w: 'Bei hoher Verletzung kann auch die Atmung gestört sein.' }, ' ',
          { t: 'Sie tasten einen langsamen Puls von 52/min.', k: 'schock', w: 'Langsamer Puls trotz Schock: Der Sympathikus fällt aus.' }, ' ',
          { t: 'Die Haut an seinen Beinen ist warm, trocken und rosig.', k: 'schock', w: 'Keine Zentralisation – die Gefäße sind weit. Trügerisch: Er wirkt „gut durchblutet“.' }, ' ',
          { t: 'Er fragt, ob jemand sein Handy gesehen hat.', k: '', w: 'Eine Alltagsfrage – kein Hinweis.' }, ' ',
          { t: 'Der Rettungsdienst misst später einen Blutdruck von 82/45 mmHg.', k: 'schock', w: 'Niedriger Blutdruck: Das Blut versackt in den weiten Gefäßen.' }
        ]
      }
    }
  },

  /* ------------------------------------------------------------------------
     AA2: SCHOCKFORM-DETEKTIV (w2-detektiv.html)
     teile: wie bei AA1; b: 'beleg' = passt nur zu dieser Schockform,
            b: 'schock' = zeigt einen Schock, aber nicht welche Form,
            b: '' = gehört nicht dazu
     ------------------------------------------------------------------------ */
  detektiv: {
    titel: 'AA2 · Schockform-Detektiv',
    anweisung: 'Lesen Sie jeden Fall genau. Tippen Sie die **zwei Befunde** an, die die Schockform belegen, und wählen Sie die **Schockform** – in beliebiger Reihenfolge. Dann: **„Prüfen“**.',
    formen: [
      { kuerzel: 'H', text: 'hypovolämisch' },
      { kuerzel: 'A', text: 'anaphylaktisch' },
      { kuerzel: 'N', text: 'neurogen' }
    ],
    formFrage: 'Welche Schockform liegt vor?',
    belegFrage: 'Tippen Sie im Fall die zwei Befunde an, die genau diese Schockform belegen.',
    pruefen: 'Prüfen',
    auswahlFehlt: 'Wählen Sie die Schockform und genau zwei Befunde – dann „Prüfen“.',
    // Schutz gegen Raten: Prüfen erst nach so vielen Sekunden Lesezeit, höchstens zwei Versuche je Fall
    mindestLeseSekunden: 6,
    zuSchnell: 'Das ging zu schnell – lesen Sie den Fall erst in Ruhe ganz durch.',
    formFalsch: 'Die Schockform stimmt noch nicht.',
    zweiterVersuch: 'Sie haben noch einen Versuch.',
    loesungGezeigt: 'Das war der zweite Versuch – hier ist die Lösung:',
    belegRichtig: 'Richtig belegt!',
    belegSchock: 'Das zeigt, dass ein Schock vorliegt – aber nicht, welche Form.',
    belegLeer: 'Das gehört nicht zum Notfall.',
    fallTitel: 'Fall {n} von {y}',
    mindestensErsterVersuch: 3,
    geschafftTitel: 'Geschafft! 🔍',
    geschafftText: 'Sie erkennen die Schockform an der **Ursache** und an den **Begleitzeichen**. Warten Sie, bis es vorne weitergeht.',
    durchklickenText: 'Beim ersten Versuch richtig: {x} von {y} – nötig sind mindestens {z}. Lesen Sie jeden Fall genau und überlegen Sie, bevor Sie tippen.',
    faelle: [
      { form: 'H', tipp: 'Woher kommt der Volumenmangel? Achten Sie auf die Drainage.', teile: [
        'Frau Hartmann (67) liegt am zweiten Tag nach einer Darmoperation auf der chirurgischen Station. ',
        { t: 'Sie liest gern Krimis.', b: '' }, ' ',
        { t: 'Die Drainage hat sich in einer Stunde mit 400 ml hellrotem Blut gefüllt.', b: 'beleg' }, ' ',
        { t: 'Sie ist blass und kaltschweißig.', b: 'beleg' }, ' ',
        { t: 'Puls 124/min, Blutdruck 95/60 mmHg.', b: 'schock' }
      ], erklaerung: 'Blutverlust über die Drainage → Volumenmangel; Blässe und kalter Schweiß zeigen die Zentralisation.' },
      { form: 'A', tipp: 'Was hat Herr Ivanov kurz vorher eingenommen – und was zeigt die Haut?', teile: [
        { t: 'Herr Ivanov (45) hat vor 20 Minuten zum ersten Mal eine Schmerztablette (Ibuprofen) genommen.', b: 'beleg' }, ' ',
        { t: 'In seiner Freizeit spielt er Fußball.', b: '' }, ' ',
        { t: 'Sein Gesicht ist gerötet, am Oberkörper bilden sich Quaddeln.', b: 'beleg' }, ' ',
        { t: 'Er sagt: „Mein Hals wird so eng.“', b: 'beleg' }, ' ',
        { t: 'Puls 130/min, Blutdruck 80/45 mmHg.', b: 'schock' }
      ], erklaerung: 'Zeitlicher Zusammenhang mit einem Medikament, Haut- und Atemwegszeichen → anaphylaktischer Schock.' },
      { form: 'N', tipp: 'Schauen Sie auf Puls und Haut – und auf den Unfallhergang.', teile: [
        { t: 'Herr Schulze (34) ist mit dem Motorrad gestürzt und liegt auf dem Rücken.', b: 'beleg' }, ' ',
        { t: 'Sein Motorrad ist neu.', b: '' }, ' ',
        { t: 'Er kann seine Beine nicht bewegen und spürt sie nicht.', b: 'beleg' }, ' ',
        { t: 'Puls 50/min.', b: 'beleg' }, ' ',
        { t: 'Blutdruck 85/50 mmHg.', b: 'schock' }, ' ',
        { t: 'Die Haut an den Beinen ist warm und trocken.', b: 'beleg' }
      ], erklaerung: 'Lähmung nach Unfall, langsamer Puls und warme Haut trotz niedrigem Blutdruck → neurogener Schock.' },
      { form: 'H', tipp: 'Wie viel Flüssigkeit hat Frau Kaya verloren – und wie viel getrunken?', teile: [
        { t: 'Frau Kaya (78) hat seit drei Tagen Brechdurchfall und trinkt kaum.', b: 'beleg' }, ' ',
        { t: 'Ihre Mundschleimhaut ist trocken, eine Hautfalte am Handrücken bleibt stehen.', b: 'beleg' }, ' ',
        { t: 'Sie strickt gern für ihre Enkel.', b: '' }, ' ',
        { t: 'Sie ist verwirrt.', b: 'schock' }, ' ',
        { t: 'Puls 110/min, Blutdruck 100/65 mmHg.', b: 'schock' }
      ], erklaerung: 'Flüssigkeitsverlust und zu wenig Trinken → Volumenmangel (hypovolämischer Schock ohne Blutung).' }
    ]
  },

  /* ------------------------------------------------------------------------
     AA3: LAGERUNGS-QUIZ (w2-lagerung.html)
     Gleiche Karten wie im Arbeitsblatt (werkzeuge/ab_w2_texte.js → LAGERUNGSKARTEN)
     richtig: OK = Oberkörper hoch, BH = flach, Beine hoch, SSL = stabile Seitenlage,
              NB = nicht bewegen, AND = etwas anderes
     ------------------------------------------------------------------------ */
  lagerung: {
    titel: 'AA3 · Lagerungs-Quiz',
    anweisung: 'Lesen Sie die Situation. Überlegen Sie: Was ist das **Leitsymptom**? Tippen Sie an, wie Sie lagern, und decken Sie auf.',
    wahlFrage: 'Wie lagern Sie?',
    optionen: [
      { kuerzel: 'OK', text: 'Oberkörper hoch' },
      { kuerzel: 'BH', text: 'Flach, Beine hoch' },
      { kuerzel: 'SSL', text: 'Stabile Seitenlage' },
      { kuerzel: 'NB', text: 'Nicht bewegen, Kopf halten' },
      { kuerzel: 'REA', text: 'Reanimation beginnen' }
    ],
    aufdecken: 'Aufdecken',
    loesung: 'Lösung:',
    warum: 'Warum?',
    richtigGewaehlt: '✓ Richtig gelagert!',
    falschGewaehlt: '✗ Nicht ganz – lesen Sie die Begründung.',
    naechste: 'Nächste Situation',
    karteVon: 'Situation {n} von {y}',
    profi: 'Profi-Karte',
    bilderTitel: '📄 Hilfe: die vier Lagerungen mit Bildern',
    bilderHinweis: 'Dieselben Bilder finden Sie auf Ihrem Arbeitsblatt (Seite 3).',
    bilder: [
      { bild: 'bilder/lagerung_oberkoerper_hoch.svg', titel: 'Oberkörper hoch (halbsitzend)', wann: 'Atemnot steht im Vordergrund.' },
      { bild: 'bilder/lagerung_beine_hoch.svg', titel: 'Flach, Beine hoch (Schocklage)', wann: 'Schockzeichen ohne Atemnot.' },
      { bild: 'bilder/lagerung_seitenlage.svg', titel: 'Stabile Seitenlage', wann: 'Bewusstlos, Atmung normal.' },
      { bild: 'bilder/lagerung_nicht_bewegen.svg', titel: 'Nicht bewegen, Kopf halten', wann: 'Verdacht auf Wirbelsäulenverletzung.' }
    ],
    mindestensErsterVersuch: 5,
    karten: [
      { titel: 'Herr Bauer (70)', text: 'Nach einem Bienenstich ist ihm schwindelig. Puls 120/min, Blutdruck 85/50 mmHg. Er atmet ruhig und ist ansprechbar.', richtig: 'BH', loesung: 'flach, Beine hoch', warum: 'Schockzeichen ohne Atemnot: Blut aus den Beinen fließt zum Herzen.' },
      { titel: 'Frau Carla Yıldız (55)', text: 'Nach Kontrastmittel ist sie heiser und atmet pfeifend, 30 Atemzüge/min. Blutdruck 90/55 mmHg.', richtig: 'OK', loesung: 'Oberkörper hoch', warum: 'Atemnot ist das Leitsymptom – trotz niedrigem Blutdruck. Beine hoch würde die Atmung erschweren.' },
      { titel: 'Herr Demir (40)', text: 'Sturz von einer 4 m hohen Leiter. Er klagt über Nackenschmerzen und Kribbeln in beiden Händen.', richtig: 'NB', loesung: 'nicht bewegen, Kopf halten', warum: 'Verdacht auf Wirbelsäulenverletzung: Jede Bewegung kann das Rückenmark weiter schädigen.' },
      { titel: 'Frau Engel (63)', text: 'Nach einem Wespenstich reagiert sie nicht mehr auf Ansprache. Sie atmet normal.', richtig: 'SSL', loesung: 'stabile Seitenlage', warum: 'Bewusstlos mit normaler Atmung: Die Atemwege bleiben frei, Erbrochenes kann abfließen.' },
      { titel: 'Herr Fuchs (81)', text: 'Teerstuhl seit dem Morgen. Er ist blass und kaltschweißig, Puls 116/min, Blutdruck 98/72 mmHg, keine Atemnot.', richtig: 'BH', loesung: 'flach, Beine hoch', warum: 'Hypovolämischer Schock ohne Atemnot. Nicht aufsetzen – Kollapsgefahr.' },
      { titel: 'Frau Graf (35)', text: 'Sie hat eine Nussallergie und Quaddeln am Hals: „Ich krieg so schlecht Luft.“ Blutdruck 120/80 mmHg.', richtig: 'OK', loesung: 'Oberkörper hoch', warum: 'Atemnot steht im Vordergrund, der Kreislauf ist noch stabil. Nicht aufstehen lassen.' },
      { titel: 'Herr Ivo (66)', text: 'Nach einem Wespenstich ist er bewusstlos und atmet nicht normal.', richtig: 'REA', loesung: 'Reanimation beginnen (KB III)', warum: 'Keine normale Atmung = Kreislaufstillstand. Lagerung: Rückenlage auf harter Unterlage.' }
    ]
  },

  /* ------------------------------------------------------------------------
     AA5 und Hausaufgabe: BEWERTUNGSRASTER (w2-raster.html, w2-transfer.html)
     punkte: je Kriterium; max: Höchstpunktzahl der Gruppe;
     fehler: ein angehakter Fehler setzt die genannten Kriterien auf 0 (sperrt).
     erstSchreiben: true = die Musterlösung erscheint erst nach Bestätigung.
     ------------------------------------------------------------------------ */
  raster: {
    titel: 'AA5 · Bewertungsraster',
    anweisung: 'Lesen Sie die Lösung Ihrer Partnerin oder Ihres Partners. **Haken Sie an, was dort steht.** Die App zählt die Punkte.',
    gesamt: 'Punkte: {x} von {y}',
    rueckmeldung: 'Geben Sie jetzt eine Rückmeldung in einem Satz: Was ist gut gelungen – was fehlt noch?',
    fehlerTitel: 'Fehler, die Punkte kosten:',
    gesperrt: 'zählt nicht (Fehler angehakt)',
    zuruecksetzen: 'Alles zurücksetzen',
    gruppen: [
      { titel: '5.1 Sofortmaßnahmen (je 1 P., höchstens 5 P.)', max: 5, kriterien: [
        { id: 'hilfe', text: 'Hilfe holen: Notruf 112 / Notärztin, Herrn Martens nicht allein lassen', punkte: 1 },
        { id: 'ok', text: 'Oberkörper hoch (halbsitzend) lagern', punkte: 1 },
        { id: 'vital', text: 'Atmung, Puls, Blutdruck, Bewusstsein (SpO₂) engmaschig überwachen', punkte: 1 },
        { id: 'kleidung', text: 'Beengende Kleidung am Hals öffnen / Einstichstelle zusätzlich kühlen', punkte: 1 },
        { id: 'nuechtern', text: 'Nichts essen oder trinken lassen', punkte: 1 },
        { id: 'adrenalin', text: 'Adrenalin i. m. – nur n. ä. A. bzw. durch die Notärztin', punkte: 1 },
        { id: 'o2', text: 'Sauerstoff – n. ä. A.', punkte: 1 },
        { id: 'doku', text: 'Uhrzeit, Werte und Maßnahmen notieren', punkte: 1 },
        { id: 'andere', text: 'andere fachlich richtige Maßnahme (z. B. bei Bewusstlosigkeit stabile Seitenlage)', punkte: 1 }
      ] },
      { titel: '5.1 Begründung der Positionierung (1 P.)', max: 1, kriterien: [
        { id: 'begruendung', text: 'Positionierung mit der Atemnot begründet (Atemhilfsmuskulatur, Zwerchfell)', punkte: 1 }
      ] },
      { titel: '5.2 Kennzeichnung (1 P.)', max: 1, kriterien: [
        { id: 'naea', text: 'Alle Medikamenten- und Sauerstoff-Maßnahmen sind mit „n. ä. A.“ gekennzeichnet', punkte: 1 }
      ] }
    ],
    fehler: [
      { id: 'schocklage', text: 'Schocklage / Beine hoch trotz Atemnot', sperrt: ['ok', 'begruendung'] },
      { id: 'antihist', text: 'Antihistaminikum statt Adrenalin', sperrt: ['adrenalin'] }
    ]
  },

  transfer: {
    titel: 'Hausaufgabe · Selbstkontrolle',
    anweisung: 'Bearbeiten Sie zuerst alle Aufgaben auf dem Papier. Öffnen Sie dann die Lösung Aufgabe für Aufgabe und **haken Sie ehrlich an**, was in Ihrer Antwort steht.',
    erstSchreiben: 'Meine Antwort steht auf dem Papier – Lösung zeigen',
    musterTitel: 'Musterlösung',
    gesamt: 'Meine Punkte: {x} von {y}',
    rueckmeldung: 'Notieren Sie auf dem Arbeitsblatt: Das muss ich noch üben.',
    zuruecksetzen: 'Alles zurücksetzen',
    aufgaben: [
      { nr: '1.1', titel: 'Anaphylaktischen Schock begründen (4 P.)', max: 4,
        // pflicht: ohne dieses Kriterium höchstens max − 1 Punkte (wie im Erwartungshorizont der KA)
        pflicht: 'kreislauf',
        pflichtHinweis: 'Ohne Kreislaufzeichen höchstens 3 Punkte – ein Schock zeigt sich immer am Kreislauf.',
        muster: 'z. B. (je Symptom mit Zuordnung 1 P.):\nzeitlicher Zusammenhang – Beginn 15 Min. nach dem Essen mit Fischsauce bei bekannter Fischallergie\nHaut – Juckreiz an Händen und Kopfhaut, Quaddeln am Bauch\nKreislauf – Puls 124/min, Blutdruckabfall von 128/78 auf 86/52 mmHg, Blässe, Schwindel\nMagen-Darm – Übelkeit\nGehirn – Unruhe (Minderdurchblutung)\nFür die volle Punktzahl muss die Kreislaufbeteiligung genannt sein.',
        kriterien: [
          { id: 'zeit', text: 'Zeitlicher Zusammenhang mit dem Allergen (Fischsauce, bekannte Allergie)', punkte: 1 },
          { id: 'haut', text: 'Haut: Juckreiz, Quaddeln – zugeordnet', punkte: 1 },
          { id: 'kreislauf', text: 'Kreislauf: Puls ↑, Blutdruck ↓ (mit Vorwert), Blässe oder Schwindel – zugeordnet', punkte: 1 },
          { id: 'magen', text: 'Magen-Darm: Übelkeit – zugeordnet', punkte: 1 },
          { id: 'unruhe', text: 'Unruhe als Zeichen der Minderdurchblutung des Gehirns', punkte: 1 }
        ] },
      { nr: '2.1', titel: 'Sofortmaßnahmen und Positionierung (7 P.)', max: 7,
        muster: 'z. B.: nicht weiteressen (Allergen stoppen) · Stationsärztin bzw. Notfallteam alarmieren, nicht allein lassen · flach lagern, Beine hoch, weil Kreislaufzeichen ohne Atemnot im Vordergrund stehen (mehr Blut zum Herzen); nicht aufsetzen · Adrenalin i. m. nach Notfall-SOP bzw. Anordnung (Außenseite Oberschenkel) · Zugang und Volumengabe n. ä. A. vorbereiten · Sauerstoff n. ä. A./SOP · Puls, Blutdruck, Atmung, SpO₂, Bewusstsein engmaschig · Uhrzeit und Maßnahmen dokumentieren.',
        kriterien: [
          { id: 'm1', text: 'Allergen stoppen (nicht weiteressen)', punkte: 1 },
          { id: 'm2', text: 'Hilfe holen (Ärztin/Notfallteam), nicht allein lassen', punkte: 1 },
          { id: 'm3', text: 'Flach lagern, Beine hoch; nicht aufsetzen', punkte: 1 },
          { id: 'm4', text: 'Adrenalin i. m. nach SOP bzw. Anordnung', punkte: 1 },
          { id: 'm5', text: 'Zugang/Volumen oder Sauerstoff n. ä. A. vorbereiten', punkte: 1 },
          { id: 'm6', text: 'Vitalzeichen engmaschig überwachen', punkte: 1 },
          { id: 'm7', text: 'Dokumentieren (Uhrzeit, Symptome, Maßnahmen)', punkte: 1 },
          { id: 'mb', text: 'Positionierung begründet (Kreislauf ohne Atemnot → mehr Blut zum Herzen)', punkte: 1, extra: true }
        ], maxMassnahmen: 6 },
      { nr: '2.2', titel: 'Positionierung nach Situationswechsel (2 P.)', max: 2,
        muster: 'Jetzt Oberkörper hoch (halbsitzend), weil die Atemnot im Vordergrund steht (Heiserkeit = Schleimhautschwellung, SpO₂ 90 %): Die Atemhilfsmuskulatur kann arbeiten. Nicht auf die Bettkante setzen oder aufstehen lassen; Kreislauf weiter überwachen, Ärztin informieren.',
        kriterien: [
          { id: 'p', text: 'Oberkörper hoch', punkte: 1 },
          { id: 'b', text: 'Begründet mit der Atemnot (Heiserkeit, SpO₂ 90 %)', punkte: 1 }
        ] }
    ]
  }
};

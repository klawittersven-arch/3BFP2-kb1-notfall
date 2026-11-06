/* ==========================================================================
   INHALTE – KB I Notfallsituationen · Themenblock 2 · Woche 2 (3BFP2)
   „Schock ist nicht gleich Schock – vergleichen und nach Leitsymptom handeln“
   ==========================================================================

   In dieser Datei stehen die Texte der Übungen (die Simulation hat ihre
   eigene Datei: inhalte_simulation.js). Sie können die Texte hier ändern,
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
    // {titel} = Name des Kastens auf dem Arbeitsblatt, z. B. „Merksatz AA2“
    merksatzHinweis: 'Jetzt aufs Arbeitsblatt: Ergänzen Sie die Lücken im Kasten „{titel}“!',
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
  start: {
    titel: 'Schock ist nicht gleich Schock – Übungen',
    einleitung: 'Scannen Sie den QR-Code bei der Aufgabe auf Ihrem Arbeitsblatt – oder wählen Sie hier die Übung aus.',
    links: [
      { seite: 'w2-entscheidung', text: 'Einstieg & Check-out · Ihre Entscheidung, bitte!' },
      { seite: 'w2-markieren', text: 'AA1 · Befunde markieren (Expertenblatt A, B oder C)' },
      { seite: 'w2-detektiv', text: 'AA2 · Schockform-Detektiv' },
      { seite: 'w2-lagerung', text: 'AA3 · Lagerungsparcours' },
      { seite: 'w2-simulation', text: 'AA4 · Notfall-Simulation' },
      { seite: 'w2-raster', text: 'AA6 · Bewertungsraster (Peer-Korrektur)' },
      { seite: 'w2-transfer', text: 'Hausaufgabe · Selbstkontrolle Transferfall' }
    ],
    // Spalten der Fortschrittsanzeige am Beamer (kurz = Spaltenbeschriftung)
    spalten: [
      { seite: 'w2-markieren', kurz: 'AA1' },
      { seite: 'w2-detektiv', kurz: 'AA2' },
      { seite: 'w2-lagerung', kurz: 'AA3' },
      { seite: 'w2-simulation', kurz: 'AA4' }
    ]
  },

  /* ------------------------------------------------------------------------
     MERKSÄTZE – erscheinen am Ende einer Übung. { l: '…' } = Lücke auf dem AB
     ------------------------------------------------------------------------ */
  merksaetze: {
    aa1: ['Ein Schock zeigt sich an den Zeichen des ', { l: 'Kreislaufs' }, ': Puls, Blutdruck, Haut und Bewusstsein. Die Schockform erkenne ich an der ', { l: 'Ursache' }, ' und an den ', { l: 'Begleitzeichen' }, ', z. B. Quaddeln oder Lähmungen.'],
    aa2: ['Bei allen drei Schockformen ', { l: 'fällt' }, ' der Blutdruck, und die Organe werden schlecht durchblutet. Beim neurogenen Schock fällt der ', { l: 'Sympathikus' }, ' aus: Der Puls ist ', { l: 'langsam' }, ' oder normal, und die Haut ist ', { l: 'warm' }, ' und trocken.'],
    aa3: ['Die Lagerung richtet sich nach dem ', { l: 'Leitsymptom' }, ', nicht nach der Schockform: Atemnot → ', { l: 'Oberkörper hoch' }, '; Schockzeichen ohne Atemnot → ', { l: 'flach, Beine hoch' }, '; bewusstlos mit normaler Atmung → ', { l: 'stabile Seitenlage' }, '; Verdacht auf Wirbelsäulenverletzung → ', { l: 'nicht bewegen' }, '.'],
    aa4: ['Anaphylaxie: Allergen ', { l: 'stoppen' }, ', Hilfe holen, lagern nach ', { l: 'Leitsymptom' }, ', ', { l: 'Adrenalin' }, ' i. m. nach Anordnung oder SOP, überwachen und ', { l: 'dokumentieren' }, '.']
  },

  /* ------------------------------------------------------------------------
     FORTSCHRITT AM BEAMER – Anmeldung auf dem Handy (oben in jeder Übung)
     ------------------------------------------------------------------------ */
  melden: {
    titel: '📺 Fortschritt am Beamer',
    text: 'Geben Sie Ihren Vornamen und den Raumcode vom Beamer ein. Dann sieht Ihre Lehrkraft, wie weit Sie sind – nur „x von y gelöst“, keine einzelnen Antworten.',
    nameLabel: 'Vorname',
    raumLabel: 'Raumcode (4 Ziffern, steht am Beamer)',
    mitmachen: 'Mitmachen',
    ohne: 'Ohne Anzeige weiter',
    dochMitmachen: '📺 Beim Beamer-Fortschritt mitmachen',
    angemeldet: 'Angemeldet als {name} · Raum {raum}',
    aendern: 'ändern',
    gesendet: '✓ Stand übertragen',
    sendet: 'Stand wird übertragen …',
    offline: 'Gerade keine Verbindung – der Stand wird nachgereicht.',
    fehlerNameLaenge: 'Bitte geben Sie Ihren Vornamen ein (2 bis 20 Zeichen).',
    fehlerNameZeichen: 'Bitte nur Buchstaben, Ziffern, Leerzeichen und Bindestrich verwenden.',
    fehlerNameWort: 'Bitte wählen Sie einen anderen Namen.',
    fehlerRaum: 'Der Raumcode hat genau 4 Ziffern.',
    fehlerUnbekannt: 'Diesen Raumcode gibt es nicht (mehr). Bitte schauen Sie am Beamer nach.',
    fehlerVoll: 'Der Raum ist voll. Bitte sagen Sie Ihrer Lehrkraft Bescheid.',
    fehlerEntfernt: 'Ihr Eintrag wurde von der Lehrkraft entfernt. Sie können sich neu anmelden.'
  },

  /* ------------------------------------------------------------------------
     FORTSCHRITT AM BEAMER – Seite für die Lehrkraft (fortschritt.html)
     ------------------------------------------------------------------------ */
  beamer: {
    titel: 'Fortschritt · Schock ist nicht gleich Schock',
    startTitel: 'Fortschritt am Beamer',
    startText: 'Starten Sie einen Raum und zeigen Sie den Raumcode. Die Schülerinnen und Schüler geben in der Übung ihren Vornamen und den Code ein. Angezeigt werden nur „x von y gelöst“ je Übung und – unter „Abstimmung“ – die Ergebnisse der Entscheidungsfragen ohne Namen. Nach 6 Stunden wird alles automatisch gelöscht.',
    starten: 'Neuen Raum starten',
    nichtEingerichtet: 'Die Fortschrittsanzeige ist noch nicht eingerichtet: In docs/config.js fehlt FORTSCHRITT_URL. Siehe README, Abschnitt „Fortschritt am Beamer“.',
    startFehler: 'Der Raum konnte nicht gestartet werden. Bitte prüfen Sie die Internetverbindung und versuchen Sie es noch einmal.',
    raumcode: 'Raumcode',
    raumHinweis: 'In der Übung: Vorname + Raumcode',
    warten: 'Warten auf die ersten Anmeldungen …',
    angemeldet: '{n} angemeldet',
    fertigZahl: '{kurz} fertig: {x}',
    legendeFertig: '✓ Merksatz erreicht',
    legendeDurch: '⚠ zu viel geraten',
    aktualisiert: 'aktualisiert {uhr} Uhr',
    getrennt: 'keine Verbindung – neuer Versuch läuft …',
    namenVerbergen: 'Namen verbergen',
    namenZeigen: 'Namen zeigen',
    person: 'Person {n}',
    vollbild: 'Vollbild',
    vollbildAus: 'Vollbild beenden',
    leeren: 'Liste leeren',
    leerenFrage: 'Alle Einträge entfernen? Handys, die weiterarbeiten, erscheinen beim nächsten gelösten Schritt wieder. Die Abstimmung bleibt erhalten.',
    neuerRaum: 'Neuer Raum',
    neuerRaumFrage: 'Neuen Raum starten? Alle müssen dann den neuen Code eingeben.',
    entfernenFrage: '„{name}“ entfernen? Das Handy kann sich danach neu anmelden.',
    entfernen: 'Entfernen',
    abbrechen: 'Abbrechen',
    ja: 'Ja',
    abgelaufen: 'Der Raum ist abgelaufen. Bitte starten Sie einen neuen Raum.',
    demo: 'Probeansicht mit erfundenen Namen',

    // Umschalten zwischen Fortschritt und Abstimmung
    ansichtFortschritt: 'Fortschritt',
    ansichtAbstimmung: 'Abstimmung',
    loesungZeigen: 'Lösung zeigen',
    loesungVerbergen: 'Lösung verbergen',
    runde1: 'Runde 1 (Beginn)',
    runde2: 'Runde 2 (Ende)',
    stimmenZahl: 'Runde 1: {a} Stimmen · Runde 2: {b} Stimmen',
    keineStimmen: 'Noch keine Stimmen – die Klasse stimmt über „Ihre Entscheidung, bitte!“ ab.',
    sicherAnteil: 'davon sicher: {n}',

    anweisungen: [
      { knopf: 'Einstieg', text: 'Ihre Entscheidung, bitte! – Runde 1: Scannen Sie den QR-Code auf Seite 1.' },
      { knopf: 'AA1–AA2', text: 'Expertenrunde (AA1) → danach in die Stammgruppe (AA2).' },
      { knopf: 'AA3', text: 'Lagerungsparcours: Partnerarbeit auf der Yogamatte (AA3).' },
      { knopf: 'AA4', text: 'Notfall-Simulation in der Stammgruppe (AA4) – Rollen nach jeder Runde wechseln!' },
      { knopf: 'Check-out', text: 'Ihre Entscheidung, bitte! – Runde 2: Stimmen Sie noch einmal ab.' }
    ],
    anweisungTipp: 'Anweisung groß einblenden – noch einmal klicken blendet sie wieder aus'
  },

  /* ------------------------------------------------------------------------
     EINSTIEG & CHECK-OUT: „Ihre Entscheidung, bitte!“ (w2-entscheidung.html)
     Gleiche Fragen wie im Arbeitsblatt (werkzeuge/ab_w2_texte.js → ENTSCHEIDUNG)
     ------------------------------------------------------------------------ */
  entscheidung: {
    titel: 'Ihre Entscheidung, bitte!',
    anweisung: 'Fünf kurze Notfälle: Entscheiden Sie, was Sie tun würden, und geben Sie an, wie sicher Sie sind. Am Beamer erscheint nur, wie die Klasse entschieden hat – ohne Namen.',
    rundeFrage: 'Welche Runde?',
    runde1: 'Runde 1 – Stundenbeginn',
    runde2: 'Runde 2 – Stundenende',
    sicherFrage: 'Wie sicher sind Sie?',
    sicher: 'sicher',
    unsicher: 'unsicher',
    abschicken: 'Abstimmung abschicken',
    nochOffen: 'Bitte beantworten Sie alle fünf Fragen (Antwort und Sicherheit).',
    danke1: 'Danke! Ihre Stimmen sind am Beamer. Die Auflösung gibt es am Ende der Stunde – in Runde 2.',
    danke2: 'Danke! Hier ist die Auflösung. Vergleichen Sie mit Ihrer Entscheidung aus Runde 1.',
    ohneRaum: 'Hinweis: Sie sind nicht mit einem Raumcode angemeldet – Ihre Stimmen erscheinen deshalb nicht am Beamer.',
    gesendet: '✓ am Beamer angekommen',
    nichtGesendet: 'Gerade keine Verbindung – Ihre Stimmen werden nachgereicht.',
    ihreRunde1: 'Runde 1: {a}',
    ihreRunde2: 'Runde 2: {a}',
    richtig: 'richtig',
    neu: 'Antworten ändern',
    fragen: [
      { nr: 'E1', frage: 'Frau K. hat nach einer Infusion Quaddeln, ringt nach Luft und hat einen Blutdruck von 85/50 mmHg. Wie lagern Sie sie?', optionen: ['A flach, Beine hoch', 'B Oberkörper hoch', 'C stabile Seitenlage'], richtig: 'B', erklaerung: 'Atemnot ist das Leitsymptom → Oberkörper hoch. Beine hoch würde die Atmung erschweren.' },
      { nr: 'E2', frage: 'Welches Medikament ist beim anaphylaktischen Schock das Mittel der ersten Wahl?', optionen: ['A Antihistaminikum', 'B Adrenalin i. m.', 'C Kortison i. v.'], richtig: 'B', erklaerung: 'Adrenalin wirkt am schnellsten auf Kreislauf, Schleimhäute und Bronchien. Antihistaminikum und Kortison kommen danach.' },
      { nr: 'E3', frage: 'Herr T. kann nach einem Kopfsprung die Beine nicht bewegen. Puls 54/min, Haut warm und rosig, Blutdruck 85/50 mmHg. Ist er stabil?', optionen: ['A Ja – Puls ruhig, Haut gut durchblutet', 'B Nein – das kann ein Schock sein'], richtig: 'B', erklaerung: 'Neurogener Schock: Der Sympathikus fällt aus – kein Pulsanstieg, keine Zentralisation, aber der Blutdruck ist niedrig.' },
      { nr: 'E4', frage: 'Während einer Kurzinfusion bekommt Herr M. Juckreiz und Atemnot. Was tun Sie mit der Infusion?', optionen: ['A langsamer laufen lassen', 'B stoppen und den Zugang entfernen', 'C stoppen, Zugang liegen lassen'], richtig: 'C', erklaerung: 'Allergen sofort stoppen – den venösen Zugang braucht das Notfallteam für Medikamente und Volumen.' },
      { nr: 'E5', frage: 'Frau K. ringt nach Luft. Dürfen Sie ihr ohne ärztliche Anordnung oder SOP Sauerstoff geben?', optionen: ['A Ja, im Notfall immer', 'B Nein, nur nach Anordnung oder SOP'], richtig: 'B', erklaerung: 'Sauerstoff ist ein Arzneimittel. Eigenverantwortlich: erkennen, Hilfe holen, lagern, überwachen.' }
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
    titel: 'AA1 · Befunde markieren',
    anweisung: 'Tippen Sie im Fall **alle Stellen** an, die auf einen Schock oder seine Ursache hinweisen. Tippen Sie noch einmal, um eine Markierung zu entfernen. Dann: „Prüfen“.',
    wahl: 'Welcher Fall steht auf Ihrem Expertenblatt?',
    pruefen: 'Prüfen',
    andererFall: 'Anderen Fall wählen',
    kategorien: { schock: 'Schockzeichen', begleit: 'Begleitzeichen', ursache: 'Hinweis auf die Ursache', '': 'gehört nicht dazu' },
    legende: 'Grün = richtig markiert · Orange gestrichelt = übersehen · Grau durchgestrichen = gehört nicht dazu',
    // {x} gefunden, {y} gesamt, {f} falsch markiert
    ergebnis: 'Gefunden: {x} von {y} Hinweisen. Falsch markiert: {f}.',
    fehltKreislauf: 'Achtung: Sie haben noch kein Zeichen des Kreislaufs markiert (Puls, Blutdruck, Haut, Bewusstsein). Ohne Kreislaufzeichen ist es kein Schock!',
    weiterSuchen: 'Suchen Sie die übersehenen Stellen (orange gestrichelt) und entfernen Sie falsche Markierungen. Dann noch einmal prüfen.',
    geschafft: 'Alle Hinweise gefunden – stark!',
    // Durchklicken: beim ersten Prüfen höchstens so viele falsche Markierungen
    hoechstensFalschErsterVersuch: 3,
    // {x} = falsch markiert beim ersten Prüfen, {z} = erlaubt
    durchklickenText: 'Beim ersten Prüfen waren {x} Stellen falsch markiert – erlaubt sind höchstens {z}. Lesen Sie den Fall genau und markieren Sie nur, was wirklich auf einen Schock hinweist.',
    faelle: {
      a: {
        titel: 'Expertenblatt A · Herr Albrecht (81)',
        teile: [
          { t: 'Herr Gerhard Albrecht (81) lebt seit vier Jahren im Pflegeheim „Am Kocherufer“.', k: '', w: 'Alter und Wohnort allein sind kein Hinweis auf einen Schock.' }, ' ',
          { t: 'Wegen eines Vorhofflimmerns nimmt er einen Gerinnungshemmer.', k: 'ursache', w: 'Gerinnungshemmer erhöhen das Blutungsrisiko.' }, ' ',
          { t: 'Er hört schlecht und trägt deshalb zwei Hörgeräte.', k: '', w: 'Hörgeräte haben mit dem Kreislauf nichts zu tun.' }, ' ',
          { t: 'Am Vormittag hatte er schwarzen, klebrigen Stuhlgang.', k: 'ursache', w: 'Teerstuhl: Hinweis auf eine Blutung im Magen oder Zwölffingerdarm.' }, '\n',
          'Als Sie ihn um 11:30 Uhr zum Mittagessen an die Bettkante setzen wollen, sagt er: ',
          { t: '„Mir wird ganz schwarz vor Augen.“', k: 'schock', w: 'Schwindel: Das Gehirn wird beim Aufsetzen schlechter durchblutet.' }, ' ',
          { t: 'Er ist blass,', k: 'schock', w: 'Blässe: Zentralisation – die Hautgefäße sind eng.' }, ' ',
          { t: 'seine Stirn ist kalt und feucht.', k: 'schock', w: 'Kalter Schweiß: Der Sympathikus ist aktiviert.' }, ' ',
          { t: 'Mehrmals bittet er um etwas zu trinken.', k: 'begleit', w: 'Durst: typisch für Volumenmangel (hypovolämischer Schock).' }, ' ',
          { t: 'Er wirkt unruhig und fragt, wo seine Frau sei, obwohl er sonst gut orientiert ist.', k: 'schock', w: 'Unruhe und neue Verwirrtheit: Das Gehirn ist schlechter versorgt.' }, ' Sie messen: ',
          { t: 'Puls 116/min,', k: 'schock', w: 'Tachykardie – der Puls ist von 78 auf 116/min gestiegen.' }, ' ',
          { t: 'Blutdruck 98/72 mmHg,', k: 'schock', w: 'Blutdruck gefallen, kleine Amplitude; Schockindex 116 : 98 ≈ 1,2.' }, ' ',
          { t: 'Atemfrequenz 24/min.', k: 'schock', w: 'Schnelle Atmung – ein Frühzeichen des Schocks.' }, ' ',
          { t: 'Bei der Morgenrunde lagen die Werte bei Puls 78/min und Blutdruck 145/85 mmHg.', k: 'schock', w: 'Die Vorwerte zeigen den Trend: Erst der Vergleich macht die Veränderung sichtbar.' }
        ]
      },
      b: {
        titel: 'Expertenblatt B · Mia (19)',
        teile: [
          { t: 'Mia (19) ist Auszubildende im ersten Ausbildungsdrittel und mit Ihnen auf einer internistischen Station eingesetzt.', k: '', w: 'Beruf und Einsatzort sind kein Hinweis.' }, ' ',
          { t: 'In der Pause isst sie ein Stück Geburtstagskuchen, das Haselnüsse enthält.', k: 'ursache', w: 'Möglicher Auslöser: Nahrungsmittelallergie (Haselnuss).' }, ' ',
          { t: 'Mia erzählt, dass es bei Nüssen „schon mal im Mund gekribbelt“ habe.', k: 'ursache', w: 'Hinweis auf eine bekannte Überempfindlichkeit gegen Nüsse.' }, ' ',
          { t: 'Es ist ihr dritter Tag auf der Station.', k: '', w: 'Hat mit dem Notfall nichts zu tun.' }, '\n',
          'Zehn Minuten später ',
          { t: 'kratzt sie sich an Hals und Händen, auf Hals und Brust bilden sich Quaddeln.', k: 'begleit', w: 'Hautzeichen der allergischen Reaktion (Histamin).' }, ' ',
          { t: 'Ihre Lippen und Augenlider schwellen an.', k: 'begleit', w: 'Schwellung durch durchlässige Gefäße (Angioödem).' }, ' ',
          { t: 'Mit heiserer Stimme', k: 'begleit', w: 'Heiserkeit: Die Kehlkopfschleimhaut schwillt an – Gefahr für die Atemwege!' }, ' sagt sie: ',
          { t: '„Mir ist schlecht, und mir ist so schwindelig.“', k: 'schock', w: 'Schwindel: Der Kreislauf ist beteiligt; Übelkeit ist ein Begleitzeichen.' }, ' ',
          { t: 'Sie hat Bauchkrämpfe.', k: 'begleit', w: 'Magen-Darm-Beteiligung bei Anaphylaxie.' }, ' Ihre Kollegin misst: ',
          { t: 'Puls 128/min,', k: 'schock', w: 'Tachykardie: Das Herz versucht auszugleichen.' }, ' ',
          { t: 'Blutdruck 88/50 mmHg,', k: 'schock', w: 'Blutdruckabfall durch weite Gefäße (relativer Volumenmangel).' }, ' ',
          { t: 'Atemfrequenz 26/min, Sauerstoffsättigung 93 %.', k: 'schock', w: 'Atemnot und Sauerstoffmangel.' }, ' ',
          { t: 'Mia sagt, ihr Blutdruck sei sonst „immer so 120 zu 70“.', k: 'schock', w: 'Vorwert: Der Blutdruck ist deutlich gefallen.' }
        ]
      },
      c: {
        titel: 'Expertenblatt C · Herr Weber (24)',
        teile: [
          'An einem Sonntagnachmittag sind Sie privat mit Freunden am Baggersee. ',
          { t: 'Tobias Weber (24) springt kopfüber vom Steg ins Wasser – an einer Stelle, an der das Wasser nur hüfttief ist.', k: 'ursache', w: 'Kopfsprung in flaches Wasser: typischer Unfallhergang für eine Verletzung der Halswirbelsäule.' }, ' ',
          { t: 'Kurz vorher hatte er sich noch mit Sonnencreme eingecremt.', k: '', w: 'Sonnencreme hat mit dem Notfall nichts zu tun.' }, '\n',
          'Herr Weber ist wach und sagt: ',
          { t: '„Ich spür meine Beine nicht. Und meine Hände kribbeln.“', k: 'begleit', w: 'Gefühlsstörungen: Das Rückenmark ist verletzt.' }, ' ',
          { t: 'Er klagt über starke Nackenschmerzen.', k: 'ursache', w: 'Hinweis auf eine Verletzung der Halswirbelsäule.' }, ' ',
          { t: 'Arme und Beine kann er kaum bewegen.', k: 'begleit', w: 'Lähmungen unterhalb der Verletzung.' }, ' ',
          { t: 'Seine Atmung ist flach.', k: 'schock', w: 'Bei hoher Verletzung kann auch die Atmung gestört sein.' }, ' ',
          { t: 'Sie tasten einen langsamen Puls von 52/min.', k: 'schock', w: 'Langsamer Puls trotz Schock: Der Sympathikus fällt aus.' }, ' ',
          { t: 'Die Haut an seinen Beinen ist warm, trocken und rosig.', k: 'schock', w: 'Keine Zentralisation – die Gefäße sind weit. Trügerisch: Er wirkt „gut durchblutet“.' }, ' ',
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
    anweisung: 'Bestimmen Sie bei jedem Fall die **Schockform**. Markieren Sie danach die **zwei Befunde**, die Ihre Entscheidung belegen. Zum Schluss: der Monitorvergleich.',
    formen: [
      { kuerzel: 'H', text: 'hypovolämisch' },
      { kuerzel: 'A', text: 'anaphylaktisch' },
      { kuerzel: 'N', text: 'neurogen' }
    ],
    formFrage: 'Welche Schockform liegt vor?',
    belegFrage: 'Tippen Sie die zwei Befunde an, die genau diese Schockform belegen.',
    belegRichtig: 'Richtig belegt!',
    belegSchock: 'Das zeigt, dass ein Schock vorliegt – aber nicht, welche Form.',
    belegLeer: 'Das gehört nicht zum Notfall.',
    fallTitel: 'Fall {n} von {y}',
    mindestensErsterVersuch: 4,
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
      { form: 'H', tipp: 'Wie viel Flüssigkeit hat Frau Demir verloren – und wie viel getrunken?', teile: [
        { t: 'Frau Demir (78) hat seit drei Tagen Brechdurchfall und trinkt kaum.', b: 'beleg' }, ' ',
        { t: 'Ihre Mundschleimhaut ist trocken, eine Hautfalte am Handrücken bleibt stehen.', b: 'beleg' }, ' ',
        { t: 'Sie strickt gern für ihre Enkel.', b: '' }, ' ',
        { t: 'Sie ist verwirrt.', b: 'schock' }, ' ',
        { t: 'Puls 110/min, Blutdruck 100/65 mmHg.', b: 'schock' }
      ], erklaerung: 'Flüssigkeitsverlust und zu wenig Trinken → Volumenmangel (hypovolämischer Schock ohne Blutung).' },
      { form: 'A', tipp: 'Was ist bei der Gartenarbeit passiert?', teile: [
        { t: 'Herr Lang (52) wird bei der Gartenarbeit von einer Wespe in den Unterarm gestochen.', b: 'beleg' }, ' ',
        { t: 'Die Hecke ist frisch geschnitten.', b: '' }, ' ',
        { t: 'Nach zehn Minuten hat er am ganzen Körper Quaddeln und Juckreiz.', b: 'beleg' }, ' ',
        { t: 'Ihm ist schwindelig.', b: 'schock' }, ' ',
        { t: 'Puls 118/min, Blutdruck 90/55 mmHg.', b: 'schock' }
      ], erklaerung: 'Insektenstich und Hautzeichen am ganzen Körper → anaphylaktischer Schock.' },
      { form: 'A', tipp: 'Auch wenn die Haut blass ist: Was hat Frau Novak gegessen, und was passiert mit ihrer Stimme?', teile: [
        { t: 'Frau Novak (29) hat im Restaurant Garnelen gegessen.', b: 'beleg' }, ' ',
        { t: 'Es ist ihr Geburtstag.', b: '' }, ' ',
        { t: 'Sie kratzt sich an den Armen.', b: 'beleg' }, ' ',
        { t: 'Ihre Stimme wird heiser, sie muss erbrechen.', b: 'beleg' }, ' ',
        { t: 'Ihr Freund sagt: „Sie ist ganz weiß im Gesicht.“', b: 'schock' }, ' ',
        { t: 'Puls 132/min.', b: 'schock' }
      ], erklaerung: 'Nahrungsmittel, Juckreiz, Heiserkeit und Erbrechen → anaphylaktischer Schock. Die Haut kann auch blass sein.' }
    ],
    monitor: {
      titel: 'Monitorvergleich',
      text: 'Beide Patienten sind nach einem Unfall im Schock. **Tippen Sie die zwei Zeilen an**, an denen Sie die beiden Schockformen am sichersten unterscheiden.',
      links: 'Herr P. – Oberschenkelbruch, starker Blutverlust',
      rechts: 'Herr Q. – Sturz von der Leiter, Lähmung beider Beine',
      zeilen: [
        { name: 'Puls', l: '128/min', r: '52/min', richtig: true, w: 'Blutverlust: Puls schnell. Rückenmarksverletzung: Der Sympathikus fällt aus – kein Pulsanstieg.' },
        { name: 'Blutdruck', l: '88/56 mmHg', r: '84/50 mmHg', richtig: false, w: 'Bei beiden niedrig – der Blutdruck unterscheidet die Formen nicht.' },
        { name: 'Haut', l: 'blass, kalt, schweißig', r: 'warm, trocken, rosig', richtig: true, w: 'Zentralisation beim Blutverlust – keine Zentralisation beim neurogenen Schock.' },
        { name: 'Atmung', l: '26/min', r: '16/min, flach', richtig: false, w: 'Unterscheidet sich hier, ist aber kein sicheres Merkmal der Schockform.' },
        { name: 'Bewusstsein', l: 'wach, unruhig', r: 'wach', richtig: false, w: 'Kein sicheres Unterscheidungsmerkmal.' }
      ],
      fertig: 'Genau: Puls und Haut verraten den neurogenen Schock.'
    }
  },

  /* ------------------------------------------------------------------------
     AA3: LAGERUNGSPARCOURS (w2-lagerung.html)
     Gleiche Karten wie im Arbeitsblatt (werkzeuge/ab_w2_texte.js → LAGERUNGSKARTEN)
     richtig: OK = Oberkörper hoch, BH = flach, Beine hoch, SSL = stabile Seitenlage,
              NB = nicht bewegen, AND = etwas anderes
     ------------------------------------------------------------------------ */
  lagerung: {
    titel: 'AA3 · Lagerungsparcours',
    anweisung: 'Person A lagert Person B auf der Matte und begründet: „Ich lagere …, weil …“. Tippen Sie dann an, welche Lagerung Sie gewählt haben, und decken Sie auf. **Nach jeder Karte Rollen tauschen!**',
    timerStart: '60 Sekunden starten',
    timerLaeuft: 'noch {s} s',
    timerEnde: 'Zeit! Begründen Sie jetzt Ihre Lagerung.',
    wahlFrage: 'Welche Lagerung haben Sie gewählt?',
    optionen: [
      { kuerzel: 'OK', text: 'Oberkörper hoch' },
      { kuerzel: 'BH', text: 'Flach, Beine hoch' },
      { kuerzel: 'SSL', text: 'Stabile Seitenlage' },
      { kuerzel: 'NB', text: 'Nicht bewegen, Kopf halten' },
      { kuerzel: 'AND', text: 'Etwas anderes' }
    ],
    aufdecken: 'Aufdecken',
    loesung: 'Lösung:',
    warum: 'Warum?',
    richtigGewaehlt: '✓ Richtig gelagert!',
    falschGewaehlt: '✗ Nicht ganz – lesen Sie die Begründung.',
    naechste: 'Nächste Karte – Rollen tauschen!',
    karteVon: 'Karte {n} von {y}',
    profi: 'Profi-Karte',
    mindestensErsterVersuch: 5,
    karten: [
      { titel: 'Herr Bauer (70)', text: 'Nach einem Bienenstich ist ihm schwindelig. Puls 120/min, Blutdruck 85/50 mmHg. Er atmet ruhig und ist ansprechbar.', richtig: 'BH', loesung: 'flach, Beine hoch', warum: 'Schockzeichen ohne Atemnot: Blut aus den Beinen fließt zum Herzen.' },
      { titel: 'Frau Carla Yıldız (55)', text: 'Nach Kontrastmittel ist sie heiser und atmet pfeifend, 30 Atemzüge/min. Blutdruck 90/55 mmHg.', richtig: 'OK', loesung: 'Oberkörper hoch', warum: 'Atemnot ist das Leitsymptom – trotz niedrigem Blutdruck. Beine hoch würde die Atmung erschweren.' },
      { titel: 'Herr Demir (40)', text: 'Sturz von einer 4 m hohen Leiter. Er klagt über Nackenschmerzen und Kribbeln in beiden Händen.', richtig: 'NB', loesung: 'nicht bewegen, Kopf halten', warum: 'Verdacht auf Wirbelsäulenverletzung: Jede Bewegung kann das Rückenmark weiter schädigen.' },
      { titel: 'Frau Engel (63)', text: 'Nach einem Wespenstich reagiert sie nicht mehr auf Ansprache. Sie atmet normal.', richtig: 'SSL', loesung: 'stabile Seitenlage', warum: 'Bewusstlos mit normaler Atmung: Die Atemwege bleiben frei, Erbrochenes kann abfließen.' },
      { titel: 'Herr Fuchs (81)', text: 'Teerstuhl seit dem Morgen. Er ist blass und kaltschweißig, Puls 116/min, Blutdruck 98/72 mmHg, keine Atemnot.', richtig: 'BH', loesung: 'flach, Beine hoch', warum: 'Hypovolämischer Schock ohne Atemnot. Nicht aufsetzen – Kollapsgefahr.' },
      { titel: 'Frau Graf (35)', text: 'Sie hat eine Nussallergie und Quaddeln am Hals: „Ich krieg so schlecht Luft.“ Blutdruck 120/80 mmHg.', richtig: 'OK', loesung: 'Oberkörper hoch', warum: 'Atemnot steht im Vordergrund, der Kreislauf ist noch stabil. Nicht aufstehen lassen.' },
      { titel: 'Herr Hahn (28)', text: 'Sturz mit dem Fahrrad, offener Unterschenkelbruch. Er ist blass, Puls 120/min. Keine Nacken- oder Rückenschmerzen.', richtig: 'AND', loesung: 'flach, verletztes Bein nicht anheben', warum: 'Keine Schocklage bei Verletzungen an Bein oder Becken: Bein in der vorgefundenen Lage ruhigstellen (Woche 3).', profi: true },
      { titel: 'Herr Ivo (66)', text: 'Nach einem Wespenstich ist er bewusstlos und atmet nicht normal.', richtig: 'AND', loesung: 'Reanimation beginnen (KB III)', warum: 'Keine normale Atmung = Kreislaufstillstand. Lagerung: Rückenlage auf harter Unterlage.' },
      { titel: 'Profi-Karte: Frau Jäger (74)', text: 'Plötzlich peitschenartiger Schmerz im linken Bein. Das Bein ist blass und kalt, am Fuß ist kein Puls tastbar.', richtig: 'AND', loesung: 'Bein tief lagern, polstern', warum: 'Verdacht auf akuten Arterienverschluss: Tieflagern verbessert die Durchblutung (Examen Mai 2024). Die Lagerung richtet sich immer nach dem Problem.', profi: true }
    ]
  },

  /* ------------------------------------------------------------------------
     AA6 und Hausaufgabe: BEWERTUNGSRASTER (w2-raster.html, w2-transfer.html)
     punkte: je Kriterium; max: Höchstpunktzahl der Gruppe;
     fehler: ein angehakter Fehler setzt die genannten Kriterien auf 0 (sperrt).
     erstSchreiben: true = die Musterlösung erscheint erst nach Bestätigung.
     ------------------------------------------------------------------------ */
  raster: {
    titel: 'AA6 · Bewertungsraster',
    anweisung: 'Lesen Sie die Lösung Ihrer Partnerin oder Ihres Partners. **Haken Sie an, was dort steht.** Die App zählt die Punkte wie im Erwartungshorizont.',
    gesamt: 'Punkte: {x} von {y}',
    rueckmeldung: 'Geben Sie jetzt eine Rückmeldung in einem Satz: Was ist gut gelungen – was fehlt noch?',
    fehlerTitel: 'Fehler, die Punkte kosten:',
    gesperrt: 'zählt nicht (Fehler angehakt)',
    zuruecksetzen: 'Alles zurücksetzen',
    gruppen: [
      { titel: '6.1 Sofortmaßnahmen (je 1 P., höchstens 5 P.)', max: 5, kriterien: [
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
      { titel: '6.1 Begründung der Positionierung (1 P.)', max: 1, kriterien: [
        { id: 'begruendung', text: 'Positionierung mit der Atemnot begründet (Atemhilfsmuskulatur, Zwerchfell)', punkte: 1 }
      ] },
      { titel: '6.2 Kennzeichnung (1 P.)', max: 1, kriterien: [
        { id: 'naea', text: 'Alle Medikamenten- und Sauerstoff-Maßnahmen sind mit „n. ä. A.“ gekennzeichnet', punkte: 1 }
      ] },
      { titel: '6.3 Dokumentation (je 0,5 P., höchstens 3 P.)', max: 3, kriterien: [
        { id: 'd1', text: 'Uhrzeit des Stichs und Beginn der Beschwerden', punkte: 0.5 },
        { id: 'd2', text: 'Auslöser (Wespenstich in die Oberlippe)', punkte: 0.5 },
        { id: 'd3', text: 'Symptome (Schwellung, Quaddeln, Kloßgefühl, pfeifende Atmung)', punkte: 0.5 },
        { id: 'd4', text: 'Vitalwerte mit Uhrzeit (und Vorwert)', punkte: 0.5 },
        { id: 'd5', text: 'Maßnahmen mit Uhrzeit und Namenskürzel', punkte: 0.5 },
        { id: 'd6', text: 'Übergabe an den Rettungsdienst (Uhrzeit, Zielklinik)', punkte: 0.5 },
        { id: 'd7', text: 'Information von Angehörigen bzw. Hausärztin', punkte: 0.5 },
        { id: 'd8', text: 'Insektengiftallergie in der Akte vermerken', punkte: 0.5 }
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
      { nr: '1.1', titel: 'Messdaten beurteilen (4 P.)', max: 4,
        muster: 'a) Puls 124/min: deutlich erhöht, Anstieg von 72/min – der Kreislauf gleicht aus.\nb) Blutdruck 86/52 mmHg: zu niedrig, deutlicher Abfall vom Vorwert 128/78; Schockindex 124 : 86 ≈ 1,4 (über 1) → Schock.\nc) Atemfrequenz 20/min, SpO₂ 96 %: noch im Normbereich – die Atmung steht nicht im Vordergrund, aber engmaschig überwachen.',
        kriterien: [
          { id: 'a', text: 'a) Puls als erhöht beurteilt, mit Vergleich zum Vorwert', punkte: 1.5 },
          { id: 'b', text: 'b) Blutdruck als zu niedrig beurteilt, Vorwert oder Schockindex genannt', punkte: 1.5 },
          { id: 'c', text: 'c) Atmung und SpO₂ als (noch) normal beurteilt, Überwachung genannt', punkte: 1 }
        ] },
      { nr: '1.2', titel: 'Notfall erläutern (3 P.)', max: 3,
        muster: 'Anaphylaktischer Schock: bekannte Fischallergie, Beginn 15 Minuten nach dem Essen mit Fischsauce; Haut (Juckreiz, Quaddeln), Magen-Darm (Übelkeit) und Kreislauf (Schwindel, Blässe, Unruhe, Puls ↑, Blutdruck ↓) sind beteiligt. Histamin macht die Gefäße weit und durchlässig → relativer Volumenmangel → Blutdruckabfall.',
        kriterien: [
          { id: 'name', text: 'Anaphylaktischer Schock benannt', punkte: 1 },
          { id: 'fall', text: 'Mit Befunden aus dem Fall begründet (Allergie, zeitlicher Zusammenhang, Haut, Kreislauf)', punkte: 1 },
          { id: 'entstehung', text: 'Entstehung kurz erklärt (Histamin → Gefäße weit → Blutdruck fällt)', punkte: 1 }
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
        ] },
      { nr: '3.1', titel: 'Pflegeproblem im PESR-Format (4 P.)', max: 4,
        muster: 'P: Gefahr einer erneuten anaphylaktischen Reaktion bis hin zum Schock (zweigipfliger Verlauf möglich).\nE: Fischallergie; anaphylaktischer Schock um 12:35 Uhr nach Fischsauce; Notfallset nicht vorhanden.\nS: (Risiko – darauf wird geachtet) Juckreiz, Quaddeln, Heiserkeit, Atemnot, Schwindel, Puls ↑, Blutdruck ↓.\nR: kennt ihre Allergie und hat einen Allergiepass; ist wach und kann Beschwerden sofort mitteilen.',
        kriterien: [
          { id: 'P', text: 'P – Problem passend formuliert', punkte: 1 },
          { id: 'E', text: 'E – Einflussfaktoren/Ursachen aus dem Fall', punkte: 1 },
          { id: 'S', text: 'S – Symptome bzw. Anzeichen, auf die geachtet wird', punkte: 1 },
          { id: 'R', text: 'R – Ressource von Frau Lorenz', punkte: 1 }
        ] }
    ]
  }
};

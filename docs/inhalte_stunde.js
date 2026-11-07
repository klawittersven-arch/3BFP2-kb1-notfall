/* ==========================================================================
   TEXTE DER BEAMER-STUNDE · Woche 2 „Schock ist nicht gleich Schock“
   ==========================================================================
   Hier stehen alle Folien (Beamer) und die passenden Bildschirme der Handys.

   So ändern Sie einen Text sicher:
   - Nur den Text ZWISCHEN den Hochkommas '…' ändern.
   - **Wort** = fett. Ein Apostroph im Text: ’ (typografisch) verwenden.
   - Reihenfolge der Folien = Reihenfolge in der Liste „folien“.
   - Die Kennungen (id: 'aa1' …) nicht ändern – der Worker und die Handys erkennen
     die Folien daran ('aa1' → 'aa1-merksatz' wechselt automatisch, 'ende' gibt die Nachlese frei).

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
    A: { form: 'Hypovolämischer Schock', kurz: 'hypovolämisch', adjektiv: 'hypovolämischer', person: 'Herr Albrecht', personDativ: 'Herrn Albrecht', fall: 'a' },
    B: { form: 'Anaphylaktischer Schock', kurz: 'anaphylaktisch', adjektiv: 'anaphylaktischer', person: 'Mia', personDativ: 'Mia', fall: 'b' },
    C: { form: 'Neurogener Schock', kurz: 'neurogen', adjektiv: 'neurogener', person: 'Herr Weber', personDativ: 'Herrn Weber', fall: 'c' }
  },

  /* ---------- Folien ----------
     typ (Beamer): start, fall, abstimmung, ergebnis, murmeln, fahrplan, puzzle, experten, stamm, tabelle,
                   info, fortschritt, papier, loesung, impuls, aufstellung, dialog, kausalkette, ende,
                   merksatz (Lesefolie: ganzer Merksatz wie auf dem AB, Schlüsselwörter hervorgehoben), lagerung (Bild + Wann/Warum/So geht’s),
                   aufgabe (Aufgabe wie im AB; „Weiter“ blendet „Bearbeiten Sie jetzt …“ und die Uhr ein),
                   blatt (Austeilen: „Sie erhalten jetzt Blatt …“ – Überschrift und Punkte wie im Arbeitsblatt)
                   (tabelle, loesung, aufgabe: Inhalte aus inhalte_nachlesen.js, also wie im Arbeitsblatt)
     handy.typ:    vorne, bild, entscheidung, murmeln, gruppe, experte, stamm, modul, papier, faelle, aufstellung, ende
                   (bei typ aufgabe zeigt das Handy erst „Schauen Sie nach vorne“, nach „Weiter“ den handy-Bildschirm)
     uhr:          Abschnitte der Uhr (Sekunden). autoUhr: true = startet beim Öffnen der Folie. */
  folien: [
    {
      id: 'start', abschnitt: 'Ankommen', kurz: 'Willkommen', typ: 'start',
      titel: 'Willkommen!',
      schritte: ['Scannen Sie den QR-Code.', 'Geben Sie Ihren **Vornamen** ein.', 'Fertig – Ihr Handy wechselt ab jetzt **automatisch mit dem Beamer**.'],
      handy: { typ: 'vorne', titel: 'Sie sind dabei, {name}!', text: 'Ihr Handy wechselt ab jetzt automatisch mit dem Beamer. Schauen Sie nach vorne.' }
    },
    {
      id: 'blatt1', abschnitt: 'Ankommen', kurz: 'Blatt 1 austeilen', typ: 'blatt', nr: 1, von: 3, seiten: 'Seite 1 und 2',
      titel: 'Sie erhalten jetzt Blatt 1',
      ueberschrift: 'Einstieg und Gruppenpuzzle',
      punkte: [
        '**Seite 1:** Frau Maler und die Leitfrage – die Antwort ergänzen Sie am Ende der Stunde',
        '**Einstieg:** Wie hätten Sie gehandelt? (am Handy)',
        '**Seite 2:** Gruppenpuzzle – Expertenteam (AA1), Merksatz AA1, Vergleichstabelle',
        'Stammgruppe (AA2 a) und Schockform-Detektiv (AA2 b)'
      ],
      handy: { typ: 'vorne', titel: 'Blatt 1 von 3', text: 'Sie erhalten jetzt **Blatt 1: Einstieg und Gruppenpuzzle**. Schauen Sie nach vorne.' }
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
      punkte: ['Vier kurze Notfälle – der letzte ist **Frau Maler um 11 Uhr**. Sie kommen **nacheinander** an den Beamer.', 'Tippen Sie am Handy Ihre Vermutung an – und ob Sie sich **sicher** sind oder **nur vermuten**.', 'Danach sehen Sie, wie die Klasse abgestimmt hat. **Aufgelöst wird erst am Ende der Stunde.**', '**Falsch liegen ist ausdrücklich erlaubt:** Genau diese Entscheidungen lernen Sie heute.'],
      handy: { typ: 'abstimmung', titel: 'Wie hätten Sie gehandelt?', start: 'Gleich zeigt Ihre Lehrkraft den ersten Notfall am Beamer. Dann tippen Sie hier Ihre Vermutung an.' }
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
        { emoji: '🧩', text: 'Gruppenpuzzle: drei Schockformen', zeit: '48 min' },
        { emoji: '🧘', text: 'Lagerung nach Leitsymptom', zeit: '18 min' },
        { emoji: '⚖️', text: 'Wer darf was? Adrenalin oder Antihistaminikum?', zeit: '13 min' },
        { emoji: '📝', text: 'Transferfall: Wissen anwenden', zeit: '13 min' },
        { emoji: '🔎', text: 'Zurück zu Frau Maler', zeit: '5 min' },
        { emoji: '✅', text: 'Hätten Sie richtig gehandelt?', zeit: '10 min' }
      ],
      handy: { typ: 'vorne', titel: 'Heute: Schock ist nicht gleich Schock', text: 'Schauen Sie nach vorne – gleich geht es mit dem Gruppenpuzzle los.' }
    },
    {
      id: 'puzzle', abschnitt: 'Gruppenpuzzle', kurz: 'Gruppen einteilen', typ: 'puzzle',
      titel: 'Gruppenpuzzle: Drei Wege in den Schock',
      schritte: [
        { emoji: '👥', titel: '1 · Expertenteam', text: 'Alle mit **demselben Buchstaben**: Infotext lesen, Fall markieren, **Ihre Spalte** der Tabelle ausfüllen.', zeit: '15 min' },
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
      auftraege: ['**Infotext** lesen (Handy oder Papier am Pult)', '**Fall markieren** (Handy) – der Infotext hilft', 'Experten-Check (Handy)', 'Gemeinsam die **Spalte** der Tabelle (AB) → „Unsere Spalte ist fertig“'],
      uhr: [{ label: 'Expertenrunde', sek: 900 }],
      alleFertig: 'Alle Expertenteams fertig – gleich lesen wir den Merksatz AA1, dann geht es in die Stammgruppen.',
      handy: { typ: 'experte' }
    },
    {
      id: 'aa1-merksatz', abschnitt: 'Gruppenpuzzle', kurz: 'Merksatz AA1 lesen', typ: 'merksatz', merksatz: 'aa1',
      titel: 'Merksatz AA1',
      text: 'Lesen Sie mit – der Merksatz steht auf Ihrem Arbeitsblatt (Seite 2).',
      tipp: 'Merksatz anklicken = groß',
      handy: { typ: 'vorne', titel: 'Merksatz AA1', text: 'Lesen Sie mit: **Merksatz AA1** auf Ihrem Arbeitsblatt (Seite 2).' }
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
      id: 'aa2a-sichern-a', abschnitt: 'Gruppenpuzzle', kurz: 'Tabelle sichern: A hypovolämisch', typ: 'tabelle', spalte: 'A',
      titel: 'Vergleichstabelle sichern',
      text: 'Vergleichen Sie mit Ihrer Tabelle – ergänzen und verbessern Sie Ihre Einträge.',
      tipp: 'Zelle anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Tabelle vergleichen: Spalte A', text: 'Vergleichen Sie die Spalte **A – hypovolämisch** auf Ihrem Arbeitsblatt mit der Musterlösung vorne am Beamer. Ergänzen und verbessern Sie Ihre Einträge.' }
    },
    {
      id: 'aa2a-sichern-b', abschnitt: 'Gruppenpuzzle', kurz: 'Tabelle sichern: B anaphylaktisch', typ: 'tabelle', spalte: 'B',
      titel: 'Vergleichstabelle sichern',
      text: 'Vergleichen Sie mit Ihrer Tabelle – ergänzen und verbessern Sie Ihre Einträge.',
      tipp: 'Zelle anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Tabelle vergleichen: Spalte B', text: 'Vergleichen Sie die Spalte **B – anaphylaktisch** auf Ihrem Arbeitsblatt mit der Musterlösung vorne am Beamer. Ergänzen und verbessern Sie Ihre Einträge.' }
    },
    {
      id: 'aa2a-sichern-c', abschnitt: 'Gruppenpuzzle', kurz: 'Tabelle sichern: C neurogen', typ: 'tabelle', spalte: 'C', gemeinsamkeit: true,
      titel: 'Vergleichstabelle sichern',
      text: 'Vergleichen Sie mit Ihrer Tabelle – ergänzen und verbessern Sie Ihre Einträge.',
      tipp: 'Zelle anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Tabelle vergleichen: Spalte C', text: 'Vergleichen Sie die Spalte **C – neurogen** auf Ihrem Arbeitsblatt mit der Musterlösung vorne am Beamer. Ergänzen und verbessern Sie Ihre Einträge.' }
    },
    {
      id: 'aa2b-intro', abschnitt: 'Gruppenpuzzle', kurz: 'Was ist der Schockform-Detektiv?', typ: 'info', emoji: '🔍',
      titel: 'Als Nächstes: Schockform-Detektiv',
      unter: 'Aus Befunden auf die Schockform schließen',
      punkte: [
        '**Vier kurze Fälle** am Handy – jede Person für sich.',
        'Bestimmen Sie die **Schockform** und tippen Sie die **zwei Befunde** an, die sie belegen. Befund = was Sie beobachten oder messen.',
        'Erst wählen, dann **„Prüfen“**. Fertig sind Sie erst, wenn genug Fälle beim ersten Versuch stimmen.'
      ],
      warumTitel: 'Warum brauche ich das als Pflegefachperson?',
      warum: [
        'Im Notfall sehen Sie zuerst nur Befunde – eine Diagnose gibt es noch nicht. Trotzdem müssen Sie sofort richtig handeln.',
        'Von der Schockform hängt ab, was Sie zuerst tun: **Allergen stoppen** und an Adrenalin nach SOP denken (anaphylaktisch), **Blutungsquelle suchen** (hypovolämisch), **nicht bewegen** (neurogen).'
      ],
      handy: { typ: 'vorne', titel: 'Gleich: Schockform-Detektiv', text: 'Schauen Sie nach vorne – gleich geht es am Handy los.' }
    },
    {
      id: 'aa2b', abschnitt: 'Gruppenpuzzle', kurz: 'Schockform-Detektiv (AA2b)', typ: 'fortschritt', seite: 'w2-detektiv', jeGruppe: true,
      titel: 'AA2b · Schockform-Detektiv',
      text: 'Vier kurze Fälle: **Schockform bestimmen** und die **zwei Befunde** markieren, die sie belegen. Jede Person am eigenen Handy – sitzen bleiben in der Stammgruppe.',
      handy: { typ: 'modul', modul: 'detektiv', gruppeZeigen: true }
    },
    {
      id: 'blatt2', abschnitt: 'Gruppenpuzzle', kurz: 'Blatt 2 austeilen', typ: 'blatt', nr: 2, von: 3, seiten: 'Seite 3 und 4',
      titel: 'Sie erhalten jetzt Blatt 2',
      ueberschrift: 'Lagerung nach Leitsymptom – wer darf was?',
      punkte: [
        '**Seite 3:** Schreibaufgaben 2.1 und 2.2 (AA2 c)',
        'Lagerung nach Leitsymptom (AA3): Bilder der vier Lagerungen, Lagerungs-Quiz, Merksatz AA3',
        '**Seite 4:** Schreibaufgaben 3.1 und 3.2',
        'Wer darf was? (AA4 a) und Merksatz AA4'
      ],
      handy: { typ: 'vorne', titel: 'Blatt 2 von 3', text: 'Sie erhalten jetzt **Blatt 2: Lagerung nach Leitsymptom – wer darf was?** Schauen Sie nach vorne.' }
    },
    {
      id: 'aa2c', abschnitt: 'Gruppenpuzzle', kurz: 'Schreibaufgaben 2.1/2.2', typ: 'aufgabe',
      titel: 'AA2c · Schreibaufgaben',
      bloecke: [{ art: 'aufgaben', nrs: ['2.1', '2.2'] }],
      los: '✍️ Bearbeiten Sie jetzt **2.1 und 2.2** allein auf dem Arbeitsblatt.',
      losPunkte: ['📱 Die Fälle von **Mia**, **Herrn Weber** und **Herrn Albrecht** können Sie auf Ihrem Handy nachlesen.', 'Danach vergleichen wir mit der Musterlösung.'],
      uhr: [{ label: 'Schreiben', sek: 300 }],
      handy: {
        typ: 'faelle', titel: 'Schreibaufgaben 2.1 und 2.2', text: 'Schreiben Sie allein auf dem Arbeitsblatt. Hier können Sie die Fälle nachlesen:',
        aufgaben: [
          { nr: '2.1', text: 'Erläutern Sie, wie es bei Mia zum Schock kommt.', faelle: ['b'] },
          { nr: '2.2', text: 'Nennen Sie 1 Befund, der bei Herrn Weber anders ist als bei Herrn Albrecht. Begründen Sie den Unterschied.', faelle: ['c', 'a'] }
        ]
      }
    },
    {
      id: 'aa2c-loesung', abschnitt: 'Gruppenpuzzle', kurz: 'Musterlösung 2.1/2.2', typ: 'loesung',
      titel: 'Musterlösung 2.1 und 2.2',
      aufgaben: ['2.1', '2.2'],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Musterlösung vorne', text: 'Vergleichen Sie Ihre Antworten mit der Musterlösung am Beamer. Verbessern oder ergänzen Sie auf dem Arbeitsblatt – am besten in einer anderen Farbe.' }
    },
    {
      id: 'aa3-impuls', abschnitt: 'Lagerung', kurz: 'Schock → Beine hoch?', typ: 'impuls',
      titel: '„Bei einem Schock legt man immer die Beine hoch.“',
      text: 'So lernt man es im Erste-Hilfe-Kurs. **Stimmt das immer?**',
      handy: { typ: 'vorne', titel: 'Stimmt das?', text: '„Bei einem Schock legt man immer die Beine hoch.“' }
    },
    {
      id: 'lagerung-1', abschnitt: 'Lagerung', kurz: 'Lagerung 1: Oberkörper hoch', typ: 'lagerung', nr: 1,
      ueber: '4 wichtige Lagerungen bei Schock',
      titel: 'Oberkörper hoch (halbsitzend)',
      bild: 'bilder/lagerung_oberkoerper_hoch.svg',
      wann: ['**Atemnot** steht im Vordergrund', 'z. B. Heiserkeit, pfeifende Atmung, Schwellung im Hals'],
      warum: ['Die **Atemhilfsmuskulatur** kann besser arbeiten', 'Die Bauchorgane drücken nicht gegen das **Zwerchfell**'],
      so: ['Kopfteil hochstellen oder Rücken mit Kissen abstützen', 'Knie leicht unterpolstern', 'Bei Anaphylaxie: **nicht aufstehen** oder gehen lassen'],
      handy: { typ: 'bild', titel: 'Oberkörper hoch (halbsitzend)', bild: 'bilder/lagerung_oberkoerper_hoch.svg', text: 'Wann? **Atemnot** steht im Vordergrund.' }
    },
    {
      id: 'lagerung-2', abschnitt: 'Lagerung', kurz: 'Lagerung 2: Flach, Beine hoch', typ: 'lagerung', nr: 2,
      ueber: '4 wichtige Lagerungen bei Schock',
      titel: 'Flach, Beine hoch (Schocklage)',
      bild: 'bilder/lagerung_beine_hoch.svg',
      wann: ['**Schockzeichen ohne Atemnot**', 'z. B. Puls schnell, Blutdruck niedrig, blass, kalter Schweiß'],
      warum: ['Blut aus den Beinen fließt zum **Körperstamm**', 'Das Herz bekommt mehr Blut – Gehirn und Organe werden besser versorgt'],
      so: ['Flach auf den Rücken legen', 'Beine erhöht lagern, z. B. auf Kissen oder einer zusammengelegten Decke', '**Nicht** bei Atemnot und **nicht** bei Verletzungen an Beinen, Becken oder Wirbelsäule'],
      handy: { typ: 'bild', titel: 'Flach, Beine hoch (Schocklage)', bild: 'bilder/lagerung_beine_hoch.svg', text: 'Wann? **Schockzeichen ohne Atemnot.**' }
    },
    {
      id: 'lagerung-3', abschnitt: 'Lagerung', kurz: 'Lagerung 3: Stabile Seitenlage', typ: 'lagerung', nr: 3,
      ueber: '4 wichtige Lagerungen bei Schock',
      titel: 'Stabile Seitenlage',
      bild: 'bilder/lagerung_seitenlage.svg',
      wann: ['**Bewusstlos**, aber die **Atmung ist normal**'],
      warum: ['Die **Atemwege bleiben frei** – die Zunge fällt nicht nach hinten', 'Erbrochenes und Speichel können aus dem Mund **abfließen**'],
      so: ['Kopf überstreckt, der **Mund ist der tiefste Punkt**', 'Obere Hand unter der Wange, oberes Bein in Hüfte und Knie angewinkelt', 'Atmung ständig kontrollieren – **atmet die Person nicht normal → Reanimation** (KB III)', 'Nach einem Unfall nur **achsengerecht** drehen'],
      handy: { typ: 'bild', titel: 'Stabile Seitenlage', bild: 'bilder/lagerung_seitenlage.svg', text: 'Wann? **Bewusstlos**, aber die **Atmung ist normal**.' }
    },
    {
      id: 'lagerung-4', abschnitt: 'Lagerung', kurz: 'Lagerung 4: Nicht bewegen', typ: 'lagerung', nr: 4,
      ueber: '4 wichtige Lagerungen bei Schock',
      titel: 'Nicht bewegen – Kopf halten',
      bild: 'bilder/lagerung_nicht_bewegen.svg',
      wann: ['Verdacht auf **Wirbelsäulenverletzung**', 'z. B. Sturz aus der Höhe, Kopfsprung; Nackenschmerz, Kribbeln, Lähmung'],
      warum: ['Jede Bewegung kann das **Rückenmark** weiter schädigen'],
      so: ['In der vorgefundenen Lage lassen', '**Kopf mit beiden Händen** halten', 'Die Person bitten, sich nicht zu bewegen'],
      handy: { typ: 'bild', titel: 'Nicht bewegen – Kopf halten', bild: 'bilder/lagerung_nicht_bewegen.svg', text: 'Wann? Verdacht auf **Wirbelsäulenverletzung**.' }
    },
    {
      id: 'aa3', abschnitt: 'Lagerung', kurz: 'Lagerungs-Quiz (AA3)', typ: 'fortschritt', seite: 'w2-lagerung',
      titel: 'AA3 a) · Lagerungs-Quiz',
      punkte: ['Jede Person für sich am Handy: **kurze Situationen**.', 'Was ist das **Leitsymptom**? Tippen Sie an, wie Sie lagern – dann **Aufdecken** und die Begründung lesen.', 'Hilfe: die **Bilder der vier Lagerungen** auf dem Arbeitsblatt (S. 3) und am Handy.', 'Am Ende zeigt das Handy den **Merksatz AA3** – er steht auch auf dem Arbeitsblatt.'],
      handy: { typ: 'modul', modul: 'lagerung' }
    },
    {
      id: 'aa3-merksatz', abschnitt: 'Lagerung', kurz: 'Merksatz AA3 lesen', typ: 'merksatz', merksatz: 'aa3',
      titel: 'Merksatz AA3',
      text: 'Lesen Sie mit – der Merksatz steht auf Ihrem Arbeitsblatt (Seite 3).',
      tipp: 'Merksatz anklicken = groß',
      handy: { typ: 'vorne', titel: 'Merksatz AA3', text: 'Lesen Sie mit: **Merksatz AA3** auf Ihrem Arbeitsblatt (Seite 3).' }
    },
    {
      id: 'aa3b', abschnitt: 'Lagerung', kurz: 'Schreibaufgaben 3.1/3.2', typ: 'aufgabe',
      titel: 'AA3 b) · Schreibaufgaben',
      bloecke: [{ art: 'aufgaben', nrs: ['3.1', '3.2'] }],
      los: '✍️ Bearbeiten Sie jetzt **3.1 und 3.2** allein auf dem Arbeitsblatt.',
      losPunkte: ['Hilfe: die Bilder der vier Lagerungen und der **Merksatz AA3**.', 'Danach vergleichen wir mit der Musterlösung.'],
      uhr: [{ label: 'Schreiben', sek: 300 }],
      handy: { typ: 'papier', titel: 'Schreibaufgaben 3.1 und 3.2', text: 'Bearbeiten Sie jetzt die Aufgaben **3.1 und 3.2** allein auf dem Arbeitsblatt. Die Zeit läuft vorne.' }
    },
    {
      id: 'aa3b-loesung', abschnitt: 'Lagerung', kurz: 'Musterlösung 3.1/3.2', typ: 'loesung',
      titel: 'Musterlösung 3.1 und 3.2',
      aufgaben: ['3.1', '3.2'],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Musterlösung vorne', text: 'Vergleichen Sie Ihre Antworten mit der Musterlösung am Beamer. Verbessern oder ergänzen Sie auf dem Arbeitsblatt – am besten in einer anderen Farbe.' }
    },
    {
      id: 'aa4a', abschnitt: 'Verantwortung', kurz: 'Wer darf was? (AA4a)', typ: 'aufstellung', runde: 3,
      titel: 'AA4a · Wer darf was?',
      text: 'Stimmen Sie **am Handy** ab: Wer darf die Maßnahme durchführen? Nach jeder Lösung: Maßnahme in die **Tabelle** (AB) eintragen.',
      ecken: [
        { emoji: '🟢', text: 'mache ich selbst' },
        { emoji: '🟡', text: 'nur n. ä. A. oder SOP' },
        { emoji: '🔴', text: 'ärztliche Aufgabe' }
      ],
      massnahmen: [
        { text: 'Infusion stoppen, Zugang belassen', ecke: 0, warum: 'Allergen sofort stoppen – den Zugang braucht das Notfallteam.' },
        { text: 'Adrenalin i. m. geben', ecke: 1, warum: 'Medikament: nur nach ärztlicher Anordnung oder Notfall-SOP – dann aber sofort.' },
        { text: 'Nach Leitsymptom lagern', ecke: 0, warum: 'Lagern gehört zu den Sofortmaßnahmen, die Sie selbst verantworten.' },
        { text: 'Sauerstoff geben', ecke: 1, warum: 'Sauerstoff ist ein Arzneimittel: nur nach Anordnung oder SOP.' },
        { text: 'Antihistaminikum geben', ecke: 1, warum: 'Medikament: nur nach Anordnung oder SOP – und erst nach Adrenalin.' },
        { text: 'Diagnose „anaphylaktischer Schock“ stellen', ecke: 2, warum: 'Diagnosen stellt die Ärztin oder der Arzt.' }
      ],
      zeigen: 'Lösung zeigen',
      naechste: 'Nächste Maßnahme',
      handy: { typ: 'aufstellung', titel: 'Wer darf was?', start: 'Gleich zeigt Ihre Lehrkraft Maßnahmen am Beamer. Tippen Sie dann hier an, wer sie durchführen darf. Nach jeder Lösung: Maßnahme in die Tabelle auf dem Arbeitsblatt eintragen.' }
    },
    {
      id: 'aa4-merksatz', abschnitt: 'Verantwortung', kurz: 'Merksatz AA4 lesen', typ: 'merksatz', merksatz: 'aa4',
      titel: 'Merksatz AA4',
      text: 'Lesen Sie mit – der Merksatz steht auf Ihrem Arbeitsblatt (Seite 4).',
      tipp: 'Merksatz anklicken = groß',
      handy: { typ: 'vorne', titel: 'Merksatz AA4', text: 'Lesen Sie mit: **Merksatz AA4** auf Ihrem Arbeitsblatt (Seite 4).' }
    },
    {
      id: 'blatt3', abschnitt: 'Anwenden', kurz: 'Blatt 3 austeilen', typ: 'blatt', nr: 3, von: 3, seiten: 'Seite 5 und 6',
      titel: 'Sie erhalten jetzt Blatt 3',
      ueberschrift: 'Wissen anwenden',
      punkte: [
        '**Seite 5:** Adrenalin oder Antihistaminikum? – Schreibaufgabe 4.1 (AA4 b)',
        'Transferfall: ein neuer Fall – 5.1 und 5.2 (AA5)',
        '**Seite 6:** Hausaufgabe mit QR-Code zur Selbstkontrolle',
        'QR-Code zum Nachlesen – erst nach der Stunde'
      ],
      handy: { typ: 'vorne', titel: 'Blatt 3 von 3', text: 'Sie erhalten jetzt **Blatt 3: Wissen anwenden**. Schauen Sie nach vorne.' }
    },
    {
      id: 'aa4b', abschnitt: 'Verantwortung', kurz: 'Adrenalin oder Antihistaminikum? (AA4b)', typ: 'aufgabe',
      titel: 'AA4b · Wer hat recht?',
      bloecke: [{ art: 'dialog' }, { art: 'aufgaben', nrs: ['4.1'] }],
      sprecher: [
        { wer: 'Herr Brandt, Pflegefachkraft', text: '„Geben Sie ihr erst mal das Antihistaminikum aus dem Notfallkoffer. Adrenalin ist mir zu heftig.“' },
        { wer: 'Lina, Auszubildende', text: '„Aber in unserer Notfall-SOP steht Adrenalin ganz oben …“' }
      ],
      los: '✍️ Bearbeiten Sie jetzt **4.1** auf dem Arbeitsblatt.',
      losPunkte: ['**Think** (2,5 Min.): allein schreiben – die zwei Sätze zu Adrenalin helfen.', '**Pair** (1,5 Min.): zu zweit vergleichen und ergänzen.', 'Danach: Musterlösung.'],
      uhr: [{ label: 'Think', sek: 150 }, { label: 'Pair', sek: 90 }],
      handy: { typ: 'papier', titel: 'Wer hat recht? – 4.1', text: '**Think:** Schreiben Sie Ihre Stellungnahme zu 4.1 allein auf das Arbeitsblatt. **Pair:** Vergleichen und ergänzen Sie zu zweit. Die Zeit läuft vorne.' }
    },
    {
      id: 'aa4b-loesung', abschnitt: 'Verantwortung', kurz: 'Musterlösung 4.1', typ: 'loesung',
      titel: 'Musterlösung 4.1',
      aufgaben: ['4.1'],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Musterlösung vorne', text: 'Vergleichen Sie Ihre Antwort mit der Musterlösung am Beamer. Verbessern oder ergänzen Sie auf dem Arbeitsblatt – am besten in einer anderen Farbe.' }
    },
    {
      id: 'aa5', abschnitt: 'Anwenden', kurz: 'Transferfall (AA5)', typ: 'aufgabe',
      titel: 'AA5 · Transferfall: Wissen anwenden',
      bloecke: [{ art: 'fall', schluessel: 'transferfall', titel: 'Fallsituation' }, { art: 'aufgaben', nrs: ['5.1', '5.2'] }],
      los: '✍️ Bearbeiten Sie jetzt **5.1 und 5.2** – **allein und ohne Unterlagen**.',
      losPunkte: ['Legen Sie das Handy umgedreht hin – die Zeit läuft vorne.', 'Danach: Peer-Korrektur mit einer Person aus einer **anderen Stammgruppe**.'],
      uhr: [{ label: 'Schreiben', sek: 480 }],
      handy: { typ: 'papier', titel: 'Transferfall: 5.1 und 5.2', text: 'Allein und ohne Unterlagen. Legen Sie das Handy umgedreht hin – die Zeit läuft vorne.' }
    },
    {
      id: 'aa5-peer', abschnitt: 'Anwenden', kurz: 'Peer-Korrektur (AA5)', typ: 'loesung',
      titel: 'AA5 · Peer-Korrektur mit Musterlösung',
      punkte: ['Tauschen Sie mit einer Person aus einer **anderen Stammgruppe**.', 'Haken Sie im **Bewertungsraster am Handy** ab – die App zählt die Punkte.', 'Rückmeldung in **einem Satz**.'],
      aufgaben: [{ nrs: ['5.1', '5.2'], loesung: '5.1 und 5.2' }],
      uhr: [{ label: 'Peer-Korrektur', sek: 240 }],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'modul', modul: 'raster' }
    },
    {
      id: 'aufloesung', abschnitt: 'Frau Maler', kurz: 'Zurück zu Frau Maler (AA6)', typ: 'kausalkette',
      titel: 'AA6 · Woher kam Frau Malers Luftnot?',
      text: 'Was kommt als Nächstes? Ergänzen Sie die Kausalkette auf **Seite 1** des Arbeitsblatts.',
      kette: [
        { titel: 'Immobilität', text: 'Nach der Hüft-TEP liegt sie aus Angst vor einer Luxation fast nur im Bett.' },
        { titel: 'Tiefe Beinvenenthrombose', text: 'Morgens: rechte Wade dick, Schmerz beim Auftreten.' },
        { titel: 'Lungenembolie', text: 'Ein Teil des Gerinnsels gelangt über das rechte Herz in die Lungenarterie.' },
        { titel: 'Obstruktiver Schock', text: '11 Uhr: Luftnot, Puls 118/min, blass, kalter Schweiß, Unruhe (Schockindex ≈ 1,1).' },
        { titel: 'Kreislaufstillstand', text: 'Mittag: zyanotisch, keine Reaktion, kein Puls.' }
      ],
      antwortTitel: 'Antwort auf die Leitfrage',
      antwort: 'Die Luftnot kam von einer **Lungenembolie**. Um 11 Uhr: **Oberkörper hoch** (Luftnot steht im Vordergrund), **nicht mobilisieren**, nicht allein lassen, **sofort Hilfe holen** und engmaschig überwachen.',
      aufdecken: 'Nächstes Glied',
      tipp: 'Aufgedecktes Glied anklicken = groß',
      handy: { typ: 'vorne', titel: 'Zurück zu Frau Maler', text: 'Ergänzen Sie die **Kausalkette** und die Antwort auf die Leitfrage auf **Seite 1** des Arbeitsblatts, während vorne Schritt für Schritt aufgedeckt wird.' }
    },
    {
      id: 'checkout-intro', abschnitt: 'Abschluss', kurz: 'Was haben wir heute gelernt?', typ: 'info', emoji: '🎯',
      titel: 'Was haben wir heute gelernt?',
      unter: 'Können Sie jetzt besser einschätzen, was in den Notfällen zu tun ist?',
      punkte: [
        'Zu Beginn der Stunde haben Sie bei **vier Notfällen** vermutet, wie Sie handeln würden – ohne Auflösung.',
        'Jetzt lösen Sie **dieselben Notfälle** noch einmal – mit Ihrem **neuen Fachwissen**.',
        'Nach jedem Notfall gibt es die **Auflösung** – und Sie sehen, wie die Klasse **am Anfang** und **jetzt** abgestimmt hat.'
      ],
      warumTitel: 'Heute neu gelernt',
      warum: [
        '**Drei Schockformen** im Vergleich: hypovolämisch, anaphylaktisch, neurogen',
        '**Lagerung nach dem Leitsymptom** – nicht immer „Beine hoch“',
        '**Wer darf was?** Selbst handeln – oder nur nach Anordnung bzw. SOP',
        '**Adrenalin i. m.** ist bei Anaphylaxie das Mittel der ersten Wahl'
      ],
      handy: { typ: 'vorne', titel: 'Was haben wir heute gelernt?', text: 'Gleich lösen Sie die vier Notfälle vom Stundenbeginn noch einmal – mit Ihrem neuen Fachwissen.' }
    },
    {
      id: 'checkout', abschnitt: 'Abschluss', kurz: 'Hätten Sie richtig gehandelt?', typ: 'abstimmung', runde: 2,
      titel: 'Hätten Sie richtig gehandelt?',
      unter: 'Prüfen Sie Ihre Vermutungen',
      punkte: ['Jetzt wissen Sie mehr: Entscheiden Sie **dieselben vier Notfälle** noch einmal – Notfall für Notfall am Handy.', 'Nach jedem Notfall: die **Auflösung** – und wie die Klasse **am Anfang** und **jetzt** abgestimmt hat.'],
      handy: { typ: 'abstimmung', titel: 'Hätten Sie richtig gehandelt?', start: 'Gleich zeigt Ihre Lehrkraft den ersten Notfall noch einmal. Entscheiden Sie jetzt mit Ihrem neuen Fachwissen.' }
    },
    {
      id: 'checkout-ergebnis', abschnitt: 'Abschluss', kurz: 'Vorher – nachher', typ: 'ergebnis', runde: 2, loesung: true,
      titel: 'Vorher – nachher',
      unter: 'Karte anklicken = groß, mit Erklärung · Bei welchem Notfall hat sich die Klasse am stärksten verändert?',
      handy: { typ: 'bilanz', titel: 'Ihre Bilanz', text: 'Vergleichen Sie am Beamer: Bei welchem Notfall hat sich die Klasse am stärksten verändert?' }
    },
    {
      id: 'ende', abschnitt: 'Abschluss', kurz: 'Hausaufgabe und Nachlesen', typ: 'ende',
      titel: 'Hausaufgabe und Nachlesen',
      punkte: ['**Hausaufgabe:** ein neuer Fall mit Schreibaufgaben (13 Punkte) – Selbstkontrolle über den QR-Code im Arbeitsblatt.', '**Nachlesen:** Alles aus dieser Stunde über den QR-Code auf der letzten Seite des Arbeitsblatts.'],
      frei: '📖 Die Nachlese-Seite ist jetzt freigeschaltet.',
      handy: { typ: 'ende', titel: 'Die Stunde ist beendet', text: '**Hausaufgabe:** ein neuer Fall – Selbstkontrolle über den QR-Code im Arbeitsblatt. Alles aus dieser Stunde können Sie jetzt nachlesen: QR-Code auf der letzten Seite des Arbeitsblatts.' }
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
    alleAufdecken: 'Alle aufdecken',
    alleVerdecken: 'Alle verdecken',
    verdeckt: '?',
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
    teamFertig: 'Tabelle fertig!',
    stimmenZahl: '{n} Stimmen',
    stimmeEins: '1 Stimme',
    abgestimmt: '{x} von {y} haben abgestimmt',
    richtigGelegen: '✓ Das hatten {x} von {y} richtig!',
    losKnopf: 'Jetzt bearbeiten',
    ersterNotfall: 'Erster Notfall',
    naechsterNotfall: 'Nächster Notfall',
    ergebnisseZeigen: 'Ergebnisse anzeigen',
    aufloesungZeigen: 'Auflösung zeigen',
    notfallNr: 'Notfall {n} von {y}',
    aufloesungSpaeter: 'Die Auflösung gibt es am Ende der Stunde.',
    gemeinsamkeitTitel: 'Gemeinsamkeit aller drei',
    loesungZu: 'Musterlösung {nr}',
    gliedNr: 'Glied {n} von {y}',
    wannTitel: 'Wann?',
    warumTitel: 'Warum?',
    soTitel: 'So geht’s',
    lagerungNr: '{n} von 4',
    blattWort: 'Blatt',
    blattVon: 'von {y}',
    blattDarauf: 'Darauf finden Sie:',
    gruppeFertig: 'Tabelle vollständig!',
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
    aufgabeVorne: 'Ihre Lehrkraft erklärt gleich die Aufgabe – Sie finden sie auf Ihrem Arbeitsblatt.',
    ihreGruppe: 'Ihre Stammgruppe',
    expertin: 'Expertin/Experte {b}',
    noch: 'noch {zeit}',
    zeitUm: 'Zeit ist um',
    papier: '✍️ Auf Papier',
    // Expertenteam (AA1)
    expTitel: 'Ihr Expertenteam {team}',
    expSetzen: '🚶 **Setzen Sie sich mit {namen} an einen Tisch.**',
    expAllein: '🚶 Sie sind allein in Ihrem Team – arbeiten Sie die Aufträge allein durch.',
    expAuftraege: ['**a)** Infotext lesen.', '**b)** Fall markieren – der Infotext hilft Ihnen.', '**c)** Experten-Check.', '**d)** Gemeinsam **Ihre Spalte {b}** der Vergleichstabelle ausfüllen – dann „Unsere Spalte ist fertig“.'],
    expWeiter: '⬇ Fall fertig markiert? Dann geht es hier weiter: **c)** Experten-Check.',
    expFallHilfe: 'Lesen Sie zuerst oben den Infotext. Dann markieren Sie im Fall alle Hinweise – den Infotext können Sie dabei jederzeit aufklappen.',
    expTabelleTitel: 'd) Jetzt gemeinsam: Ihre Spalte der Vergleichstabelle',
    expTabelleText: 'Füllen Sie mit Ihrem Expertenteam die Spalte **{b} – {kurz}** der Vergleichstabelle auf dem Arbeitsblatt aus, alle sechs Zeilen: **Ursache · Entstehung (kurz) · Puls · Haut · weitere typische Zeichen · Darauf achte ich besonders**. Die Informationen stehen alle im Infotext!',
    expTabelleFertig: 'Wenn die Spalte bei allen im Team fertig ausgefüllt ist: „Unsere Spalte ist fertig“ drücken.',
    expFall: 'b) Fall: {person}',
    expInfo: 'a) Infotext: {form}',
    expWoerter: 'Wörterhilfe',
    expPapier: 'Lieber auf Papier? Bitten Sie Ihre Lehrkraft am Pult um das Expertenblatt „{b} · {form}“.',
    checkTitel: 'c) Experten-Check',
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

    stammAuftrag: 'Erklären Sie sich reihum Ihre Schockform (**A → B → C**, je 3 Minuten). Die anderen füllen ihre Spalten der Tabelle aus. Zum Schluss gemeinsam: Gemeinsamkeit.',
    stammDran: 'Sie sind dran: Erklären Sie Ihre Schockform!',
    stammJetzt: 'Jetzt erklärt: {wer}',
    fertigStamm: 'Unsere Tabelle ist vollständig',
    stammFertigText: '✓ Gemeldet! Ihre Gruppe: {x} von {y} fertig.',
    mitglied: '{name} · {b} {form}',
    du: '(Sie)',
    gruppeFertig: '✓ Ihre ganze Gruppe ist fertig.',
    notfallNr: 'Notfall {n} von {y}',
    abstFrage1: 'Tippen Sie Ihre Vermutung an – und ob Sie sich sicher sind.',
    abstFrage2: 'Tippen Sie Ihre Entscheidung an – und ob Sie sich sicher sind.',
    abstSicherFrage: 'Wie sicher sind Sie?',
    abstSicher: 'Ich bin mir sicher',
    abstUnsicher: 'Ich vermute nur',
    abstAngekommen: 'Ihre Wahl ist angekommen. Bis zum Ergebnis können Sie sie noch ändern.',
    abstIhre: 'Ihre Vermutung: {a} ({s})',
    sicherKurz: 'sicher',
    unsicherKurz: 'nur vermutet',
    abstKeine: 'Sie haben bei diesem Notfall nicht abgestimmt.',
    abstErgebnis: 'Das Ergebnis steht vorne. **Die Auflösung gibt es am Ende der Stunde.**',
    abstRichtigIst: 'Richtig ist: {a}',
    abstBeginn: 'Ihre Vermutung zu Beginn: {a}',
    abstEnde: 'Ihre Entscheidung jetzt: {a}',
    abstBeginnKeine: 'Zu Beginn haben Sie nicht abgestimmt.',
    abstEndeKeine: 'Jetzt haben Sie nicht abgestimmt.',
    bilanz: 'Richtig zu Beginn: {a} von {y} · jetzt: {e} von {y}',
    bilanzBeginn: 'Beginn',
    bilanzEnde: 'jetzt',
    aufstellungNr: 'Maßnahme {n} von {y}',
    aufstellungFrage: 'Wer darf diese Maßnahme durchführen? Tippen Sie an.',
    aufstellungGewaehlt: 'Ihre Wahl ist angekommen. Bis zur Lösung können Sie sie noch ändern.',
    aufstellungRichtig: '✓ Richtig – das hatten Sie!',
    aufstellungFalsch: '✗ Nicht ganz. Richtig ist: {ecke}',
    aufstellungKeine: 'Sie haben nicht abgestimmt. Richtig ist: {ecke}',
    aufstellungEintragen: '✍️ Tragen Sie die Maßnahme jetzt in die Tabelle auf dem Arbeitsblatt ein.',
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

  /* ---------- Expertentexte (gleich wie im Arbeitsblatt: werkzeuge/ab_w2_texte.js → EXPERTEN) ----------
     info: Infotext ohne Überschriften, bewusst nicht in der Reihenfolge der Vergleichstabelle.
*/
  experten: {
    a: {
      info: [
        'Bei einem hypovolämischen Schock ist der Puls schnell und schwach. Die Haut ist blass, kalt und schweißig. Viele Menschen haben großen Durst, sind unruhig oder verwirrt und atmen schnell. Der Blutdruck fällt oft erst spät. Wichtig ist der Vergleich mit dem Vorwert (Schockindex).',
        'Pflegefachpersonen achten darauf, wo Blut verloren geht: Stuhl, Erbrochenes, Verband, Drainage. Sie kontrollieren Puls, Blutdruck, Bewusstsein und Urin im Verlauf.',
        'Ausgelöst wird er durch einen Verlust von Blut oder Flüssigkeit: eine Blutung nach außen oder im Körper, z. B. im Magen-Darm-Trakt, oder starker Durchfall und Erbrechen. Gerinnungshemmer erhöhen das Blutungsrisiko. Schwarzer, klebriger Stuhl (Teerstuhl) zeigt eine Blutung im Magen oder Zwölffingerdarm.',
        'Im Notfall: Hilfe holen. Flach lagern, Beine hoch (ohne Atemnot). Nicht aufsetzen. Wärme erhalten, überwachen.',
        'Im Körper: weniger Volumen → weniger Blut fließt zum Herzen → der Blutdruck droht zu fallen. Der Sympathikus steuert gegen: Der Puls steigt, und die Gefäße in Haut, Niere und Darm werden eng (Zentralisation, siehe Woche 1).'
      ],
      woerter: 'hypovolämisch = mit zu wenig Volumen | Teerstuhl = schwarzer Stuhl durch verdautes Blut | Zentralisation = Umverteilung des Blutes zu Gehirn und Herz'
    },
    b: {
      info: [
        'Bei Kontakt mit dem Allergen setzen Mastzellen schlagartig Histamin frei. Die Gefäße werden weit und durchlässig. Flüssigkeit tritt ins Gewebe aus (Quaddeln, Schwellungen). Im Gefäßsystem fehlt dann Volumen → der Blutdruck fällt. Die Schleimhäute schwellen an, die Bronchien werden eng → Atemnot. Der Puls wird schnell.',
        'Im Notfall: Allergen stoppen, Hilfe holen, nach Leitsymptom lagern. Adrenalin i. m. nach Anordnung oder SOP ist das Mittel der ersten Wahl.',
        'Oft sind mehrere Organe betroffen: Haut (Juckreiz, Quaddeln, Schwellungen), Atemwege (Heiserkeit, pfeifende Atmung, Atemnot), Kreislauf (schneller Puls, niedriger Blutdruck, Schwindel) und Magen-Darm (Übelkeit, Bauchkrämpfe). Achtung: Die Haut kann auch blass sein.',
        'Der anaphylaktische Schock ist eine schwere allergische Sofortreaktion, z. B. auf Medikamente, Insektengift oder Nüsse. Sie beginnt Sekunden bis Minuten nach dem Kontakt.',
        'Pflegefachpersonen beobachten vor allem Atmung (Heiserkeit, Atemfrequenz, Sauerstoffsättigung) und Kreislauf. Nach Stunden kann eine zweite Reaktion folgen (zweigipfliger Verlauf). Deshalb ist eine Nachbeobachtung nötig.'
      ],
      woerter: 'Allergen = Auslöser einer Allergie | Mastzellen = Abwehrzellen im Gewebe, die Histamin speichern | Quaddeln = juckende, erhabene Hautschwellungen | anaphylaktisch = durch eine schwere allergische Reaktion'
    },
    c: {
      info: [
        'Beim neurogenen Schock ist der Blutdruck niedrig, aber der Puls langsam oder normal. Unterhalb der Verletzung ist die Haut warm, trocken und rosig. Dort bestehen Lähmungen und Gefühlsstörungen (Kribbeln). Oft hat die Person Nackenschmerzen. Bei hoher Verletzung ist auch die Atmung gestört. Achtung: Die Person wirkt „stabil“, ist aber im Schock.',
        'Pflegefachpersonen kontrollieren vor allem Atmung, Blutdruck, Puls, Körpertemperatur (Auskühlung) und Lähmungen im Verlauf.',
        'Im Rückenmark verlaufen Nervenbahnen des Sympathikus. Sind sie unterbrochen, werden die Gefäße unterhalb der Verletzung weit. Das Blut „versackt“ → der Blutdruck fällt. Der Puls steigt nicht, und es gibt keine Zentralisation.',
        'Im Notfall: Notruf. Den Kopf mit beiden Händen in der vorgefundenen Lage halten, nicht bewegen. Wärme erhalten, Atmung und Puls überwachen.',
        'Auslöser ist eine Verletzung des Rückenmarks, meist an der Halswirbelsäule – z. B. nach einem Kopfsprung in flaches Wasser oder einem Sturz aus der Höhe.'
      ],
      woerter: 'neurogen = vom Nervensystem ausgehend | Rückenmark = Nervenstrang im Wirbelkanal | Sympathikus = Teil des Nervensystems, der Puls und Gefäßspannung steigert'
    }
  }
};

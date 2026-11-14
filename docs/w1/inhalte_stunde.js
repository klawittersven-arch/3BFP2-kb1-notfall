/* ==========================================================================
   TEXTE DER BEAMER-STUNDE · Woche 1 „Wenn der Kreislauf kämpft – vom Ausgleich zur Schockspirale“
   ==========================================================================
   Hier stehen alle Folien (Beamer: beamer-w1.html) und die passenden Bildschirme der Handys (w1.html).

   So ändern Sie einen Text sicher:
   - Nur den Text ZWISCHEN den Hochkommas '…' ändern.
   - **Wort** = fett. Ein Apostroph im Text: ’ (typografisch) verwenden.
   - Reihenfolge der Folien = Reihenfolge in der Liste „folien“.
   - Die Kennungen (id: 'w1-aa1' …) nicht ändern. Woche 1 benutzt bewusst NICHT die Kennung 'aa1'
     (der Worker wechselt dort im Gruppenpuzzle von Woche 2 automatisch weiter).
   - Fortschrittsfolien: seite = Kennung der Übung, gesamt = Anzahl der Schritte (für die Probeansicht),
     fehlerArt/fall/kette/quiz = woher die Texte der „Häufigen Fehler“ kommen (w1/inhalte.js),
     fehlerAnzahl = wie viele Fehler der Beamer höchstens zeigt (ohne Angabe 4).
   ========================================================================== */

var STUNDE = {

  titel: 'Wenn der Kreislauf kämpft',
  untertitel: 'KB I · Woche 1 · Notfallsituationen',
  kopfzeile: 'KB I · Notfallsituationen',
  handySeite: 'w1.html',      // Adresse hinter dem QR-Code am Beamer
  speicher: 'w1',             // der Laptop merkt sich den Raum von Woche 1 getrennt von Woche 2

  /* ---------- Gruppenfarben (nur für die Bedienung; Woche 1 hat kein Gruppenpuzzle) ---------- */
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

  /* ---------- Folien ----------
     typ und handy.typ: siehe docs/inhalte_stunde.js (Woche 2). Neu in Woche 1: handy.params für die Übungen. */
  folien: [
    {
      id: 'start', abschnitt: 'Ankommen', kurz: 'Willkommen', typ: 'start',
      titel: 'Willkommen!',
      schritte: ['Scannen Sie den QR-Code.', 'Geben Sie Ihren **Vornamen** ein.', 'Fertig – Ihr Handy wechselt ab jetzt **automatisch mit dem Beamer**.'],
      handy: { typ: 'vorne', titel: 'Sie sind dabei, {name}!', text: 'Ihr Handy wechselt ab jetzt automatisch mit dem Beamer. Schauen Sie nach vorne.' }
    },
    {
      id: 'blatt1', abschnitt: 'Ankommen', kurz: 'Blatt 1 austeilen', typ: 'blatt', nr: 1, von: 2,
      titel: 'Weiter mit Arbeitsblatt 1',
      ueberschrift: 'Wie der Körper den Blutdruck hält',
      punkte: [
        'Frau Maler um 11 Uhr und die Leitfrage – die Antwort schreiben Sie am Ende',
        '**Einstieg:** drei Fragen am Handy',
        'AA1: Frühzeichen finden (Handy) und in die Tabelle eintragen',
        'AA2: Regelkreis – so hält der Körper den Blutdruck'
      ],
      handy: { typ: 'vorne', titel: 'Weiter mit Arbeitsblatt 1', text: 'Weiter mit **Arbeitsblatt 1: Wie der Körper den Blutdruck hält**. Schauen Sie nach vorne.' }
    },
    {
      id: 'fall', abschnitt: 'Einstieg', kurz: 'Frau Maler, 11 Uhr', typ: 'fall',
      titel: 'Reanimation – und nicht nur ich war hilflos',
      einleitung: 'Frau Maler, 71 Jahre, ist seit gestern neu im Pflegeheim. Vor drei Wochen erhielt sie nach einer Schenkelhalsfraktur eine Hüft-TEP. Seit der Entlassung liegt sie die meiste Zeit im Bett.',
      zitat: '„Gegen elf Uhr wirkte sie unruhig, atmete schnell und sagte, sie bekomme schlecht Luft. Sie war blass, hatte kalten Schweiß auf der Stirn, ihr Puls lag bei 118/min und der Blutdruck bei 105/70 mmHg. Ich dachte, sie sei nur aufgeregt, weil alles neu für sie ist.“',
      zitatWer: 'Schülerin Christin',
      leitfrage: 'Der Blutdruck ist doch fast normal. Warum ist Frau Maler trotzdem in Gefahr?',
      handy: { typ: 'vorne', titel: 'Frau Maler, 11 Uhr', text: '**Leitfrage:** Der Blutdruck ist doch fast normal. Warum ist Frau Maler trotzdem in Gefahr?' }
    },
    {
      id: 'einstieg', abschnitt: 'Einstieg', kurz: 'Was meinen Sie?', typ: 'abstimmung', runde: 1,
      titel: 'Was meinen Sie?',
      unter: 'Ihre Vermutungen, bitte!',
      punkte: ['**Drei kurze Fragen** zu Frau Maler – sie kommen **nacheinander** an den Beamer.', 'Tippen Sie am Handy Ihre Vermutung an – und ob Sie sich **sicher** sind oder **nur vermuten**.', '**Falsch liegen ist erlaubt!** Aufgelöst wird am Ende der Stunde.'],
      handy: { typ: 'abstimmung', titel: 'Was meinen Sie?', start: 'Gleich zeigt Ihre Lehrkraft die erste Frage am Beamer. Dann tippen Sie hier Ihre Vermutung an.' }
    },
    {
      id: 'einstieg-ergebnis', abschnitt: 'Einstieg', kurz: 'Ergebnis', typ: 'ergebnis', runde: 1,
      titel: 'So hat die Klasse vermutet',
      unter: 'Karte anklicken = groß · ★ = größte Uneinigkeit',
      handy: { typ: 'vorne', titel: 'Das Ergebnis steht vorne', text: 'Noch keine Auflösung – ob Sie richtig lagen, prüfen Sie am Ende der Stunde.' }
    },
    {
      id: 'ziel', abschnitt: 'Einstieg', kurz: 'Lernziel', typ: 'fahrplan',
      titel: 'Wenn der Kreislauf kämpft',
      impuls: '„Der Blutdruck ist fast normal – also alles gut?“',
      lernziel: 'Sie erklären, wie der Körper den Blutdruck hält (Kompensation) und was passiert, wenn das nicht mehr reicht (Dekompensation, Schockspirale). Sie erkennen Frühzeichen eines Schocks im Fall – auch bei fast normalem Blutdruck – und bewerten den Schockindex.',
      plan: [
        { emoji: '🔍', text: 'Frühzeichen im Fall finden', zeit: '10 min' },
        { emoji: '🔁', text: 'Regelkreis: So hält der Körper den Blutdruck', zeit: '17 min' },
        { emoji: '🌀', text: 'Schockformen und Schockspirale', zeit: '17 min' },
        { emoji: '⏱️', text: 'Früh- oder Spätzeichen? Schockindex', zeit: '9 min' },
        { emoji: '📝', text: 'Ein neuer Fall: Wissen anwenden', zeit: '14 min' },
        { emoji: '✅', text: 'Hatten Sie recht?', zeit: '5 min' }
      ],
      handy: { typ: 'vorne', titel: 'Heute: Wenn der Kreislauf kämpft', text: 'Schauen Sie nach vorne – gleich geht es am Handy los.' }
    },
    {
      id: 'w1-aa1', abschnitt: 'Frühzeichen', kurz: 'Frühzeichen finden (AA1)', typ: 'fortschritt', seite: 'w1-befunde', gesamt: 7,
      fehlerArt: 'markieren', fall: 'maler',
      titel: 'AA1 · Frühzeichen finden',
      text: 'Lesen Sie **Christins Bericht** am Handy. Tippen Sie alle Stellen an, die zeigen: **Kreislauf oder Atmung verändern sich.** Dann „Prüfen“.',
      punkte: ['Danach: die Befunde in die **Tabelle AA1** eintragen (Arbeitsblatt).'],
      uhr: [{ label: 'Frühzeichen finden', sek: 360 }],
      handy: { typ: 'modul', modul: 'markieren', params: { fall: 'maler' } }
    },
    {
      id: 'w1-aa1-loesung', abschnitt: 'Frühzeichen', kurz: 'Tabelle AA1 sichern', typ: 'loesung',
      titel: 'Tabelle AA1 sichern',
      aufgaben: ['AA1'],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Tabelle AA1 vergleichen', text: 'Vergleichen Sie Ihre Tabelle **AA1** mit der Lösung am Beamer. Ergänzen Sie fehlende Befunde – am besten in einer anderen Farbe.' }
    },
    {
      id: 'w1-aa1-merksatz', abschnitt: 'Frühzeichen', kurz: 'Merksatz AA1 lesen', typ: 'merksatz', merksatz: 'aa1',
      titel: 'Merksatz AA1',
      text: 'Lesen Sie mit – der Merksatz steht auf Ihrem Arbeitsblatt.',
      tipp: 'Merksatz anklicken = groß',
      handy: { typ: 'vorne', titel: 'Merksatz AA1', text: 'Lesen Sie mit: **Merksatz AA1** auf Ihrem Arbeitsblatt.' }
    },
    {
      id: 'w1-info1', abschnitt: 'Regelkreis', kurz: 'Informationstext 1 lesen', typ: 'papier',
      titel: 'Wie hält der Körper den Blutdruck?',
      punkte: ['Lesen Sie **Informationstext 1** auf Ihrem Arbeitsblatt – zu zweit, abwechselnd laut.', 'Klären Sie unbekannte Wörter mit der **Wörterhilfe**.', 'Unterstreichen Sie: **Barorezeptoren, Sympathikus, Zentralisation, RAAS, ADH, Kompensation**.'],
      uhr: [{ label: 'Lesen', sek: 240 }],
      handy: { typ: 'papier', titel: 'Informationstext 1 lesen', text: 'Lesen Sie **Informationstext 1** auf Ihrem Arbeitsblatt – zu zweit, abwechselnd laut. Unterstreichen Sie die fett gedruckten Fachwörter.' }
    },
    {
      id: 'w1-aa2a', abschnitt: 'Regelkreis', kurz: 'Regelkreis bauen (AA2 a)', typ: 'fortschritt', seite: 'w1-regelkreis', gesamt: 6,
      fehlerArt: 'kette', kette: 'regelkreis', fehlerAnzahl: 3,
      titel: 'AA2 a · Regelkreis bauen',
      text: 'Was passiert, wenn der **Blutdruck fällt**? Tippen Sie am Handy immer den **nächsten Schritt** an. Hilfe: **Informationstext 1**.',
      punkte: ['Danach: die Lücken im **Regelkreis** auf dem Arbeitsblatt ausfüllen (Wortspeicher).'],
      uhr: [{ label: 'Regelkreis bauen', sek: 300 }],
      handy: { typ: 'modul', modul: 'kette', params: { kette: 'regelkreis' } }
    },
    {
      id: 'w1-aa2a-loesung', abschnitt: 'Regelkreis', kurz: 'Regelkreis sichern', typ: 'loesung',
      titel: 'Regelkreis sichern',
      aufgaben: ['AA2 a'],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Regelkreis vergleichen', text: 'Füllen Sie die Lücken im **Regelkreis** auf dem Arbeitsblatt aus (Wortspeicher) und vergleichen Sie mit der Lösung am Beamer.' }
    },
    {
      id: 'w1-aa2b', abschnitt: 'Regelkreis', kurz: 'Befunde erklären (AA2 b)', typ: 'aufgabe',
      titel: 'AA2 b · Befunde erklären',
      bloecke: [{ art: 'aufgaben', nrs: ['AA2 b'] }],
      los: '✍️ Ordnen Sie zu: Schreiben Sie zu jedem Befund von Frau Maler den **Buchstaben** der passenden Erklärung.',
      losPunkte: ['Hilfe: Ihr **Regelkreis** und **Informationstext 1**.', 'Danach: Lösung am Beamer.'],
      uhr: [{ label: 'Zuordnen', sek: 150 }],
      handy: { typ: 'papier', titel: 'Befunde erklären (AA2 b)', text: 'Ordnen Sie auf dem Arbeitsblatt jedem Befund von Frau Maler die passende Erklärung zu (Buchstaben A–E). Die Zeit läuft vorne.' }
    },
    {
      id: 'w1-aa2b-loesung', abschnitt: 'Regelkreis', kurz: 'Lösung AA2 b', typ: 'loesung',
      titel: 'Lösung AA2 b',
      aufgaben: ['AA2 b'],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Lösung vorne', text: 'Vergleichen Sie Ihre Buchstaben mit der Lösung am Beamer und verbessern Sie – am besten in einer anderen Farbe.' }
    },
    {
      id: 'w1-aa2-merksatz', abschnitt: 'Regelkreis', kurz: 'Merksatz AA2 lesen', typ: 'merksatz', merksatz: 'aa2',
      titel: 'Merksatz AA2',
      text: 'Lesen Sie mit – der Merksatz steht auf Ihrem Arbeitsblatt.',
      tipp: 'Merksatz anklicken = groß',
      handy: { typ: 'vorne', titel: 'Merksatz AA2', text: 'Lesen Sie mit: **Merksatz AA2** auf Ihrem Arbeitsblatt.' }
    },
    {
      id: 'blatt2', abschnitt: 'Schockspirale', kurz: 'Blatt 2 austeilen', typ: 'blatt', nr: 2, von: 2,
      titel: 'Weiter mit Arbeitsblatt 2',
      ueberschrift: 'Wenn der Ausgleich nicht mehr reicht',
      punkte: [
        'Informationstext 2: Schock und Schockformen',
        'AA3: die Schockspirale (Handy und Papier)',
        'AA4: Frühzeichen oder Spätzeichen? Der Schockindex',
        'AA5: ein neuer Fall – 5.1 bis 5.3'
      ],
      handy: { typ: 'vorne', titel: 'Weiter mit Arbeitsblatt 2', text: 'Weiter mit **Arbeitsblatt 2: Wenn der Ausgleich nicht mehr reicht**. Schauen Sie nach vorne.' }
    },
    {
      id: 'w1-info2', abschnitt: 'Schockspirale', kurz: 'Informationstext 2 lesen', typ: 'papier',
      titel: 'Was ist ein Schock?',
      punkte: ['Lesen Sie **Informationstext 2** – zu zweit, abwechselnd laut.', 'Füllen Sie in der Tabelle die **Namen der vier Schockformen** aus. Die **Wörterhilfe** verrät Ihnen, welcher Name passt.'],
      uhr: [{ label: 'Lesen und ausfüllen', sek: 300 }],
      handy: { typ: 'papier', titel: 'Informationstext 2 lesen', text: 'Lesen Sie **Informationstext 2** zu zweit. Füllen Sie in der Tabelle die Namen der **vier Schockformen** aus – die Wörterhilfe hilft.' }
    },
    {
      id: 'w1-formen-loesung', abschnitt: 'Schockspirale', kurz: 'Lösung Schockformen', typ: 'loesung',
      titel: 'Die vier Schockformen',
      aufgaben: ['Schockformen'],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Lösung vorne', text: 'Vergleichen Sie die vier Schockformen mit der Lösung am Beamer.' }
    },
    {
      id: 'w1-aa3', abschnitt: 'Schockspirale', kurz: 'Schockspirale bauen (AA3)', typ: 'fortschritt', seite: 'w1-spirale', gesamt: 6,
      fehlerArt: 'kette', kette: 'spirale', fehlerAnzahl: 3,
      titel: 'AA3 · Die Schockspirale',
      text: 'Was passiert, wenn der Ausgleich **nicht mehr reicht**? Tippen Sie am Handy immer den **nächsten Schritt** an. **Achtung: Fehlerkarten!**',
      punkte: ['Danach: die Lücken in der **Schockspirale** auf dem Arbeitsblatt ausfüllen (Wortspeicher).'],
      uhr: [{ label: 'Schockspirale bauen', sek: 360 }],
      handy: { typ: 'modul', modul: 'kette', params: { kette: 'spirale' } }
    },
    {
      id: 'w1-aa3-loesung', abschnitt: 'Schockspirale', kurz: 'Schockspirale sichern', typ: 'loesung',
      titel: 'Schockspirale sichern',
      aufgaben: ['AA3'],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Schockspirale vergleichen', text: 'Füllen Sie die Lücken in der **Schockspirale** auf dem Arbeitsblatt aus (Wortspeicher) und vergleichen Sie mit der Lösung am Beamer.' }
    },
    {
      id: 'w1-aa3-merksatz', abschnitt: 'Schockspirale', kurz: 'Merksatz AA3 lesen', typ: 'merksatz', merksatz: 'aa3',
      titel: 'Merksatz AA3',
      text: 'Lesen Sie mit – der Merksatz steht auf Ihrem Arbeitsblatt.',
      tipp: 'Merksatz anklicken = groß',
      handy: { typ: 'vorne', titel: 'Merksatz AA3', text: 'Lesen Sie mit: **Merksatz AA3** auf Ihrem Arbeitsblatt.' }
    },
    {
      id: 'w1-aa4', abschnitt: 'Frühzeichen', kurz: 'Früh- oder Spätzeichen? (AA4 a)', typ: 'fortschritt', seite: 'w1-frueh', gesamt: 9,
      fehlerArt: 'karten', quiz: 'frueh',
      titel: 'AA4 a · Frühzeichen oder Spätzeichen?',
      text: 'Neun Karten am Handy: **Frühzeichen** (der Körper gleicht noch aus) oder **Spätzeichen** (der Ausgleich reicht nicht mehr)? Hilfe: die **Tabelle** auf Ihrem Arbeitsblatt.',
      uhr: [{ label: 'Quiz', sek: 240 }],
      handy: { typ: 'modul', modul: 'karten', params: { quiz: 'frueh' } }
    },
    {
      id: 'w1-aa4-merksatz', abschnitt: 'Frühzeichen', kurz: 'Merksatz AA4 lesen', typ: 'merksatz', merksatz: 'aa4',
      titel: 'Merksatz AA4',
      text: 'Lesen Sie mit – der Merksatz steht auf Ihrem Arbeitsblatt.',
      tipp: 'Merksatz anklicken = groß',
      handy: { typ: 'vorne', titel: 'Merksatz AA4', text: 'Lesen Sie mit: **Merksatz AA4** auf Ihrem Arbeitsblatt.' }
    },
    {
      id: 'w1-aa4b', abschnitt: 'Frühzeichen', kurz: 'Schockindex und Leitfrage (AA4 b)', typ: 'aufgabe',
      titel: 'AA4 b · Schockindex – und die Leitfrage',
      bloecke: [{ art: 'aufgaben', nrs: ['AA4 b', 'Leitfrage'] }],
      los: '✍️ Berechnen Sie den **Schockindex** von Frau Maler. Dann beantworten Sie die **Leitfrage**: Lückensatz unter der Leitfrage auf **Arbeitsblatt 1**.',
      losPunkte: ['Hilfe: **Merksatz AA4**.', 'Danach: Lösung am Beamer.'],
      uhr: [{ label: 'Schreiben', sek: 180 }],
      handy: { typ: 'papier', titel: 'Schockindex und Leitfrage', text: 'Berechnen Sie den **Schockindex** von Frau Maler (AA4 b). Dann ergänzen Sie die **Antwort auf die Leitfrage** unter der Leitfrage auf **Arbeitsblatt 1**. Die Zeit läuft vorne.' }
    },
    {
      id: 'w1-aa4b-loesung', abschnitt: 'Frühzeichen', kurz: 'Lösung Schockindex', typ: 'loesung',
      titel: 'Lösung AA4 b – Schockindex',
      aufgaben: ['AA4 b'],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Lösung vorne', text: 'Vergleichen Sie mit der Lösung am Beamer und verbessern Sie – am besten in einer anderen Farbe.' }
    },
    {
      id: 'w1-leitfrage', abschnitt: 'Frühzeichen', kurz: 'Antwort auf die Leitfrage', typ: 'loesung',
      titel: 'Antwort auf die Leitfrage',
      aufgaben: ['Leitfrage'],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'papier', titel: 'Antwort auf die Leitfrage', text: 'Vergleichen Sie Ihre Antwort auf die Leitfrage (Arbeitsblatt 1) mit der Lösung am Beamer.' }
    },
    {
      id: 'w1-aa5', abschnitt: 'Anwenden', kurz: 'Ein neuer Fall (AA5)', typ: 'aufgabe',
      titel: 'AA5 · Ein neuer Fall: Wissen anwenden',
      bloecke: [{ art: 'fall', schluessel: 'transferfall', titel: 'Fallsituation' }, { art: 'aufgaben', nrs: ['5.1', '5.2', '5.3'] }],
      los: '✍️ Bearbeiten Sie jetzt **5.1 bis 5.3** – **allein**. Hilfe: nur die **Merksätze AA2 und AA4**.',
      losPunkte: ['Legen Sie das Handy umgedreht hin – die Zeit läuft vorne.', 'Danach: Peer-Korrektur zu zweit.'],
      uhr: [{ label: 'Schreiben', sek: 540 }],
      handy: { typ: 'papier', titel: 'Ein neuer Fall: 5.1 bis 5.3', text: 'Allein. Hilfe: nur **Merksatz AA2** und **Merksatz AA4** auf dem Arbeitsblatt. Legen Sie das Handy umgedreht hin – die Zeit läuft vorne.' }
    },
    {
      id: 'w1-aa5-peer', abschnitt: 'Anwenden', kurz: 'Peer-Korrektur (AA5) – 5.1 und 5.2', typ: 'loesung',
      titel: 'AA5 · Peer-Korrektur: 5.1 und 5.2',
      punkte: ['Tauschen Sie mit Ihrer **Nachbarin** oder Ihrem **Nachbarn**.', 'Haken Sie im **Bewertungsraster am Handy** ab – die App zählt die Punkte.', 'Rückmeldung in **einem Satz**.'],
      aufgaben: [{ nrs: ['5.1', '5.2'], loesung: '5.1 und 5.2' }],
      uhr: [{ label: 'Peer-Korrektur', sek: 300 }],
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß',
      handy: { typ: 'modul', modul: 'raster' }
    },
    {
      id: 'w1-aa5-peer-2', abschnitt: 'Anwenden', kurz: 'Peer-Korrektur (AA5) – 5.3', typ: 'loesung',
      titel: 'AA5 · Peer-Korrektur: 5.3',
      aufgaben: ['5.3'],
      uhr: [{ label: 'Peer-Korrektur', sek: 300 }], uhrVon: 'w1-aa5-peer',
      tipp: 'Zeile anklicken = aufdecken · noch einmal = groß · die Uhr läuft weiter',
      handy: { typ: 'modul', modul: 'raster' }
    },
    {
      id: 'checkout-intro', abschnitt: 'Abschluss', kurz: 'Was haben wir heute gelernt?', typ: 'info', emoji: '🎯',
      titel: 'Was haben wir heute gelernt?',
      unter: 'Hatten Sie am Anfang recht?',
      punkte: [
        'Zu Beginn der Stunde haben Sie bei **drei Fragen** vermutet – ohne Auflösung.',
        'Jetzt beantworten Sie **dieselben Fragen** noch einmal – mit Ihrem **neuen Fachwissen**.',
        'Nach jeder Frage gibt es die **Auflösung** – und Sie sehen, wie die Klasse **am Anfang** und **jetzt** abgestimmt hat.'
      ],
      warumTitel: 'Heute neu gelernt',
      warum: [
        '**Regelkreis:** Barorezeptoren → Sympathikus → Puls ↑, Gefäße eng (Zentralisation); RAAS und ADH',
        '**Kompensation:** Der Blutdruck bleibt lange fast normal – er fällt **spät**.',
        '**Schockspirale:** Laktat, weite Gefäße, Blutdruck fällt, Organe versagen',
        '**Schockindex** = Puls : systolischer Blutdruck – über 1 spricht für einen Schock'
      ],
      handy: { typ: 'vorne', titel: 'Was haben wir heute gelernt?', text: 'Gleich beantworten Sie die drei Fragen vom Stundenbeginn noch einmal – mit Ihrem neuen Fachwissen.' }
    },
    {
      id: 'checkout', abschnitt: 'Abschluss', kurz: 'Hatten Sie recht?', typ: 'abstimmung', runde: 2,
      titel: 'Hatten Sie recht?',
      unter: 'Prüfen Sie Ihre Vermutungen',
      punkte: ['Jetzt wissen Sie mehr: Beantworten Sie **dieselben drei Fragen** noch einmal – Frage für Frage am Handy.', 'Nach jeder Frage: die **Auflösung** – und wie die Klasse **am Anfang** und **jetzt** abgestimmt hat.'],
      handy: { typ: 'abstimmung', titel: 'Hatten Sie recht?', start: 'Gleich zeigt Ihre Lehrkraft die erste Frage noch einmal. Entscheiden Sie jetzt mit Ihrem neuen Fachwissen.' }
    },
    {
      id: 'checkout-ergebnis', abschnitt: 'Abschluss', kurz: 'Vorher – nachher', typ: 'ergebnis', runde: 2, loesung: true,
      titel: 'Vorher – nachher',
      unter: 'Karte anklicken = groß, mit Erklärung · Bei welcher Frage hat sich die Klasse am stärksten verändert?',
      handy: { typ: 'bilanz', titel: 'Ihre Bilanz', text: 'Vergleichen Sie am Beamer: Bei welcher Frage hat sich die Klasse am stärksten verändert?' }
    },
    {
      id: 'ende', abschnitt: 'Abschluss', kurz: 'Ende der Stunde', typ: 'ende',
      titel: 'Gut gemacht!',
      punkte: ['**Zum Wiederholen:** die Merksätze **AA1 bis AA4** und die Tabelle „Frühzeichen und Spätzeichen“ auf Ihrem Arbeitsblatt.', 'Üben Sie zu zweit: Erklären Sie in **einer Minute**, warum ein fast normaler Blutdruck einen Schock **nicht** ausschließt.'],
      handy: { typ: 'ende', titel: 'Die Stunde ist beendet', text: '**Zum Wiederholen:** die Merksätze AA1 bis AA4 und die Tabelle „Frühzeichen und Spätzeichen“ auf Ihrem Arbeitsblatt.' }
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
    ersterNotfall: 'Erste Frage',
    naechsterNotfall: 'Nächste Frage',
    ergebnisseZeigen: 'Ergebnisse anzeigen',
    aufloesungZeigen: 'Auflösung zeigen',
    notfallNr: 'Frage {n} von {y}',
    aufloesungSpaeter: 'Die Auflösung gibt es am Ende der Stunde.',
    gemeinsamkeitTitel: 'Gemeinsamkeit aller drei',
    loesungZu: 'Musterlösung {nr}',
    loesungWeiter: 'Fortsetzung',
    gliedNr: 'Glied {n} von {y}',
    wannTitel: 'Wann?',
    warumTitel: 'Warum?',
    soTitel: 'So geht’s',
    lagerungNr: '{n} von 4',
    blattKurz: 'AB{n}',
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
    demo: 'Probeansicht mit erfundenen Namen',
    // Woche 1: „Häufige Fehler“ auf den Fortschrittsfolien ({t} = Text der Karte bzw. Stelle, {n} = Anzahl)
    fehlerTitel: 'Häufige Fehler (erster Versuch)',
    fehlerKeine: 'Noch keine Fehler gemeldet.',
    fehlerAnzahl: '{n}×',
    fehlerMarkiert: 'markiert, gehört aber nicht dazu: „{t}“',
    fehlerUebersehen: 'übersehen: „{t}“',
    fehlerZuFrueh: 'zu früh gewählt: „{t}“',
    fehlerKarte: 'Fehlerkarte gewählt: „{t}“',
    fehlerQuiz: 'falsch zugeordnet: „{t}“',
    // Menü „Angemeldete verwalten“ (Woche 1 hat keine Gruppenfolie)
    ohneHandyKnopf: '+ Person ohne Handy',
    ohneHandyFrage: 'Vorname der Person ohne Handy:'
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
    notfallNr: 'Frage {n} von {y}',
    abstFrage1: 'Tippen Sie Ihre Vermutung an – und ob Sie sich sicher sind.',
    abstFrage2: 'Tippen Sie Ihre Entscheidung an – und ob Sie sich sicher sind.',
    abstSicherFrage: 'Wie sicher sind Sie?',
    abstSicher: 'Ich bin mir sicher',
    abstUnsicher: 'Ich vermute nur',
    abstAngekommen: 'Ihre Wahl ist angekommen. Bis zum Ergebnis können Sie sie noch ändern.',
    abstIhre: 'Ihre Vermutung: {a} ({s})',
    sicherKurz: 'sicher',
    unsicherKurz: 'nur vermutet',
    abstKeine: 'Sie haben bei dieser Frage nicht abgestimmt.',
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
    nichtEingeteilt: 'Sie sind noch keiner Gruppe zugeteilt. Bitte melden Sie sich bei Ihrer Lehrkraft.'
  }
};

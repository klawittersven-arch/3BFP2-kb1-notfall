/* ==========================================================================
   INHALTE – AA4 Notfall-Simulation „Anaphylaxie“ (KB I · Woche 2 · 3BFP2)
   ==========================================================================

   In dieser Datei stehen ALLE Texte und Zahlen der Simulation (w2-simulation.html).
   Sie wird NACH inhalte.js geladen und ergänzt INHALTE um den Bereich „simulation“.

   So ändern Sie einen Text sicher:
   - Ändern Sie nur, was ZWISCHEN den einfachen Hochkommas ' … ' steht.
   - Die Hochkommas selbst, die Kommas am Zeilenende und die Klammern
     { } [ ] müssen stehen bleiben.
   - Deutsche Anführungszeichen „ … “ dürfen Sie im Text frei verwenden.
     Ein einfaches Hochkomma (') im Text müssen Sie als \' schreiben.
   - **Wort** wird fett gedruckt, \n beginnt eine neue Zeile.
   - Zahlen (Zeiten in Sekunden, Messwerte) ohne Hochkommas eintragen.
   - Nach dem Speichern die Seite im Browser neu laden und eine Variante kurz durchspielen.

   Aufbau einer Variante:
     start        – Messwerte und Zustand zu Beginn (hf = Puls, sys/dia = Blutdruck,
                    af = Atemfrequenz, spo2 = Sauerstoffsättigung, bew = Bewusstsein,
                    lage = Lagerung zu Beginn)
     werteSichtbar – true: Monitor läuft von Anfang an; false: Werte erst nach „messen“
     atemweg      – true: Atemnot ist zu Beginn das Leitsymptom
     lageZiel     – welche Lagerung zu welchem Leitsymptom passt
     verlauf      – Veränderung je 30 Sekunden ohne Adrenalin
     aussagen, haut, atmung – Listen mit Bedingungen (wenn: …); die ERSTE passende Zeile gilt
     aktionen     – die Handlungsknöpfe:
        gruppe     hilfe | allergen | lagerung | medikamente | ueberwachung | doku
        dauer      Simulationszeit in Sekunden, die die Handlung kostet
        bewertung  gut | neutral | unguenstig | gefaehrlich | verboten
                   (verboten = wird NICHT ausgeführt, nur Rückmeldung)
        kuerzel    E = eigenverantwortlich · A = nach ärztlicher Anordnung ·
                   S = nach Notfall-SOP · X = ohne Anordnung nicht erlaubt
        rueck      Rückmeldung in einem Satz
        faelle     abweichende Bewertung je nach Zustand (die erste passende gilt)
        wirkung    was im Körper/Ablauf passiert (lage, adrenalin, sauerstoff,
                   messen, hilfe = Sekunden bis zur Ankunft, kollaps, setzt = Merker)
        wiederholbar – true: Knopf bleibt nutzbar
     checkliste   – was in der Nachbesprechung abgehakt wird
   Bedingungen (wenn): bew, lage, atemnot, adrenalin, adrenalinWirkt, kollaps,
     spo2Unter, sysUnter, merker, ohneMerker
   ========================================================================== */

INHALTE.simulation = {
  titel: 'AA4 · Notfall-Simulation Anaphylaxie',
  anweisung: 'Spielen Sie die drei Varianten in Ihrer Stammgruppe – in beliebiger Reihenfolge – und **wechseln Sie nach jeder Runde die Rollen**. Was Sie tun, verändert die Werte.',

  rollen: [
    { symbol: '🩺', titel: 'Pflegefachperson', text: 'entscheidet, tippt die Handlungen an und sagt laut, was sie tut und warum.' },
    { symbol: '📟', titel: 'Monitor & Stimme', text: 'liest die Aussagen der Person, die Beobachtungen und die Werte laut vor.' },
    { symbol: '📝', titel: 'Protokoll', text: 'führt das Notfallprotokoll auf Papier: Uhrzeit, Werte, Maßnahme, Grundlage (E/A/S).' }
  ],

  texte: {
    rollenTitel: 'Rollen in Ihrer Gruppe',
    variantenTitel: 'Wählen Sie eine Variante',
    starten: 'Variante {id} starten',
    nochmal: 'Variante {id} noch einmal spielen',
    geschafft: '✓ geschafft',
    offen: 'noch offen',
    alleFertig: 'Alle drei Varianten geschafft! Vergleichen Sie: Warum war die Lagerung jedes Mal anders?',
    zuruecksetzen: 'Alle Varianten zurücksetzen',
    zuruecksetzenFrage: 'Wirklich alle drei Varianten zurücksetzen?',
    ausgangslage: 'Ausgangslage',
    uhr: 'Simulationszeit',
    monitor: 'Werte',
    monitorLaeuft: 'Monitor läuft',
    nichtGemessen: 'noch nicht gemessen – tippen Sie auf „messen“',
    gemessenUm: 'gemessen um {zeit}',
    hf: 'Puls',
    rr: 'Blutdruck',
    af: 'Atemfrequenz',
    spo2: 'SpO₂',
    einheitHf: '/min',
    einheitRr: 'mmHg',
    einheitAf: '/min',
    einheitSpo2: '%',
    leer: '–',
    personTitel: 'Das sehen und hören Sie',
    bewusstsein: 'Bewusstsein',
    haut: 'Haut',
    atmung: 'Atmung',
    lage: 'Lagerung',
    rueckTitel: 'Rückmeldung',
    handlungenTitel: 'Was tun Sie jetzt?',
    gruppen: {
      hilfe: 'Hilfe',
      allergen: 'Allergen',
      lagerung: 'Lagerung',
      medikamente: 'Medikamente',
      ueberwachung: 'Überwachung',
      doku: 'Dokumentation'
    },
    bewertung: {
      gut: '✓ sinnvoll',
      neutral: '○ möglich',
      unguenstig: '⚠ ungünstig',
      gefaehrlich: '✗ gefährlich',
      verboten: '✗ nicht erlaubt'
    },
    kuerzel: {
      E: 'E · eigenverantwortlich',
      A: 'A · nach ärztlicher Anordnung',
      S: 'S · nach Notfall-SOP',
      X: '✗ · ohne Anordnung nicht erlaubt'
    },
    legende: 'E = eigenverantwortlich · A = nach ärztlicher Anordnung · S = nach Notfall-SOP · ✗ = ohne Anordnung nicht erlaubt',
    ereignis: 'Achtung',
    nachbesprechung: 'Nachbesprechung · {titel}',
    endeHilfe: 'Ende der Simulation um {zeit}.',
    endeZeit: 'Die Simulationszeit (12 Minuten) ist abgelaufen.',
    endwerte: 'Werte am Ende: Puls {hf}/min · Blutdruck {sys}/{dia} mmHg · Atemfrequenz {af}/min · SpO₂ {spo2} % · {bew}',
    zeitstrahl: 'Zeitstrahl',
    zeit: 'Zeit',
    handlung: 'Handlung',
    bewertungSpalte: 'Bewertung',
    grundlage: 'Grundlage',
    checkliste: 'Checkliste',
    erledigt: '✓ erledigt',
    fehlt: '✗ fehlt',
    entfaellt: '– entfällt',
    zusatz: '(Zusatz)',
    lagerungTitel: 'Lagerung nach Leitsymptom',
    lageQuote: 'Ihre Lagerung passte in {x} von {y} Abschnitten (je 30 Sekunden) zum Leitsymptom.',
    protokollHinweis: 'Vergleichen Sie den Zeitstrahl mit Ihrem Notfallprotokoll. Gehören Allergie-Vermerk und Nachbeobachtung dazu?',
    wiederholen: 'Variante wiederholen',
    zurUebersicht: 'Zur Übersicht',
    rollenwechsel: 'Nächste Runde: Wechseln Sie jetzt die Rollen!',
    durchklickenTitel: 'Hey, nicht einfach durchklicken!',
    durchklickenText: 'In dieser Runde gab es {n} gefährliche oder nicht erlaubte Handlungen. Lesen Sie die Rückmeldungen im Zeitstrahl und spielen Sie die Variante noch einmal – dann zählt sie.',
    lagen: {
      flach: 'flach auf dem Rücken',
      oberkoerper: 'Oberkörper hoch (halbsitzend)',
      beine: 'flach, Beine hoch',
      seite: 'stabile Seitenlage',
      sitzend: 'sitzt aufrecht',
      stehend: 'steht bzw. geht'
    },
    bewusstseinsstufen: {
      wach: 'wach, ansprechbar',
      unruhig: 'wach, unruhig',
      benommen: 'benommen, reagiert verzögert',
      bewusstlos: 'bewusstlos – reagiert nicht auf Ansprache'
    }
  },

  /* So wirkt Adrenalin (für alle Varianten): Zielwerte und Schritt je 30 Sekunden */
  adrenalin: {
    ab: 30,             // Sekunden bis zur ersten Wirkung
    atemnotWegNach: 90, // Sekunden nach der Gabe: Atemnot ist nicht mehr Leitsymptom
    ziel: { hf: 100, sys: 122, dia: 76, af: 18, spo2: 96 },
    schritt: { hf: 5, sys: 9, dia: 5, af: 2, spo2: 2 }
  },
  sauerstoff: { schritt: 2, max: 99 },

  varianten: [
    /* ======================================================================
       VARIANTE A – Klinik
       ====================================================================== */
    {
      id: 'A',
      titel: 'Variante A – Klinik',
      kurz: 'Herr Kaiser (58), Eisen-Kurzinfusion',
      situation: 'Internistische Station, 10:05 Uhr. Herr Peter Kaiser (58) erhält nach ärztlicher Anordnung eine **Eisen-Kurzinfusion**. Nach etwa fünf Minuten klingelt er: Er kratzt sich, an Hals und Armen bilden sich Quaddeln, seine Stimme ist heiser. Er liegt flach im Bett, das Pulsoximeter ist angelegt.\nAuf der Station gibt es eine **Notfall-SOP Anaphylaxie**: Pflegefachpersonen dürfen danach Adrenalin 0,5 mg i. m. und Sauerstoff geben.',
      start: { hf: 118, sys: 100, dia: 60, af: 26, spo2: 92, bew: 'unruhig', lage: 'flach' },
      werteSichtbar: true,
      atemweg: true,
      allergenMerker: 'infusionStopp',            // solange dieser Merker fehlt, läuft das Allergen weiter
      allergenExtra: { sys: -2, spo2: -1 },
      lageZiel: { bewusstlos: ['seite'], atemnot: ['oberkoerper', 'sitzend'], kreislauf: ['beine', 'flach'] },
      verlauf: { sys: -2, dia: -1, hf: 2, af: 1, spo2: -1 },
      beineBonus: 2,
      sitzMalus: 0,
      maxZeit: 720,
      endeHilfe: 'Das Notfallteam trifft ein und übernimmt. Die Ärztin ordnet die weitere Therapie und eine Überwachung über 24 Stunden an – eine zweite Reaktion ist möglich.',
      endeOhneAdrenalin: 'Das Notfallteam gibt jetzt Adrenalin i. m. – nach der SOP hätten Sie es bereits früher geben dürfen.',
      lageErklaerung: 'Leitsymptom bei Herrn Kaiser: **Atemnot** (Heiserkeit, pfeifende Atmung, SpO₂ ↓) → **Oberkörper hoch**. Die Schocklage hätte die Atmung verschlechtert.',
      aussagen: [
        { wenn: { bew: 'bewusstlos' }, text: '(reagiert nicht – atmet)' },
        { wenn: { adrenalinWirkt: true }, text: '„Es wird besser … ich krieg wieder Luft.“' },
        { wenn: { spo2Unter: 88 }, text: '„Ich … krieg … keine Luft!“ (spricht nur noch einzelne Wörter)' },
        { wenn: { lage: ['flach', 'beine'] }, text: '„Ich muss hoch … im Liegen krieg ich keine Luft!“' },
        { wenn: {}, text: '„Mir wird so eng im Hals … und alles juckt!“' }
      ],
      haut: [
        { wenn: { adrenalinWirkt: true }, text: 'Quaddeln blassen ab, Gesicht noch gerötet' },
        { wenn: {}, text: 'Quaddeln an Hals und Armen, Gesicht gerötet, Juckreiz' }
      ],
      atmung: [
        { wenn: { spo2Unter: 88 }, text: 'pfeifend und stark angestrengt, Lippen bläulich' },
        { wenn: { adrenalinWirkt: true }, text: 'ruhiger, kaum noch pfeifend' },
        { wenn: {}, text: 'schnell, pfeifendes Geräusch beim Atmen, heisere Stimme' }
      ],
      aktionen: [
        { id: 'a_hilfe', gruppe: 'hilfe', text: 'Notfallteam rufen (Notrufnummer der Klinik) – bei Herrn Kaiser bleiben', dauer: 30, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Hilfe holen, ohne die Person allein zu lassen (Klingel, Telefon, Kollegin).', wirkung: { hilfe: 180, setzt: ['hilfe'] } },
        { id: 'a_weg', gruppe: 'hilfe', text: 'Selbst losgehen und den Notfallwagen holen', dauer: 60, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Herr Kaiser ist in dieser Zeit allein. Rufen Sie Hilfe, ohne das Zimmer zu verlassen.', wirkung: { setzt: ['alleinGelassen'] } },
        { id: 'a_stopp', gruppe: 'allergen', text: 'Infusion sofort stoppen, venösen Zugang belassen', dauer: 15, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Allergenzufuhr sofort stoppen. Den Zugang braucht das Notfallteam für Medikamente und Volumen.', wirkung: { setzt: ['infusionStopp'] } },
        { id: 'a_ziehen', gruppe: 'allergen', text: 'Infusion stoppen und den Zugang entfernen', dauer: 30, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Das Allergen ist gestoppt, aber der Zugang fehlt jetzt für Notfallmedikamente und Volumen.', wirkung: { setzt: ['infusionStopp', 'zugangWeg'] } },
        { id: 'a_langsam', gruppe: 'allergen', text: 'Infusion langsamer laufen lassen', dauer: 15, bewertung: 'gefaehrlich', kuerzel: 'E', rueck: 'Gefährlich: Das Allergen fließt weiter. Bei Anaphylaxie die Zufuhr sofort ganz stoppen.', wirkung: {} },
        { id: 'a_ok', gruppe: 'lagerung', text: 'Oberkörper hoch lagern (Kopfteil hochstellen)', dauer: 15, wiederholbar: true, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Atemnot ist das Leitsymptom – die Atemhilfsmuskulatur kann besser arbeiten.', faelle: [{ wenn: { bew: 'bewusstlos' }, bewertung: 'gefaehrlich', rueck: 'Gefährlich: Herr Kaiser ist bewusstlos – die Atemwege sind so nicht geschützt. Stabile Seitenlage!' }], wirkung: { lage: 'oberkoerper' } },
        { id: 'a_beine', gruppe: 'lagerung', text: 'Flach lagern, Beine hoch (Schocklage)', dauer: 15, wiederholbar: true, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Herr Kaiser hat noch Atembeschwerden – Oberkörper hoch bleibt besser.', faelle: [{ wenn: { atemnot: true }, bewertung: 'gefaehrlich', rueck: 'Gefährlich: Bei führender Atemnot erschwert die Schocklage das Atmen – die Sättigung fällt.' }, { wenn: { bew: 'bewusstlos' }, bewertung: 'unguenstig', rueck: 'Ungünstig: Bewusstlos mit normaler Atmung → stabile Seitenlage.' }], wirkung: { lage: 'beine' } },
        { id: 'a_seite', gruppe: 'lagerung', text: 'Stabile Seitenlage', dauer: 30, wiederholbar: true, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Herr Kaiser ist wach. Die stabile Seitenlage ist für Bewusstlose mit normaler Atmung.', faelle: [{ wenn: { bew: 'bewusstlos' }, bewertung: 'gut', rueck: 'Richtig: bewusstlos mit normaler Atmung – Atemwege freihalten, Atmung ständig kontrollieren.' }], wirkung: { lage: 'seite' } },
        { id: 'a_sitzen', gruppe: 'lagerung', text: 'Aufsetzen, Beine aus dem Bett hängen lassen', dauer: 15, wiederholbar: true, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Abruptes Aufsetzen mit hängenden Beinen lässt Blut in die Beine versacken. Besser: halbsitzend im Bett.', wirkung: { lage: 'sitzend', sys: -10, dia: -5 } },
        { id: 'a_adrenalin', gruppe: 'medikamente', text: 'Adrenalin 0,5 mg i. m. nach Notfall-SOP (Außenseite Oberschenkel)', dauer: 45, bewertung: 'gut', kuerzel: 'S', rueck: 'Richtig: Adrenalin ist das Mittel der ersten Wahl. Die SOP erlaubt Ihnen die Gabe. Nach 5–10 Minuten kann wiederholt werden.', wirkung: { adrenalin: true, setzt: ['adrenalin'] } },
        { id: 'a_antihist', gruppe: 'medikamente', text: 'Antihistaminikum i. v. geben', dauer: 30, bewertung: 'verboten', kuerzel: 'X', rueck: 'Nicht erlaubt: Die SOP sieht für Pflegefachpersonen Adrenalin und Sauerstoff vor. Antihistaminika ordnet die Ärztin an – sie wirken zudem langsamer und ersetzen Adrenalin nicht.', wirkung: {} },
        { id: 'a_sauerstoff', gruppe: 'medikamente', text: 'Sauerstoff nach SOP (Maske mit Reservoir, hoher Fluss)', dauer: 30, bewertung: 'gut', kuerzel: 'S', rueck: 'Richtig: Sauerstoff ist ein Arzneimittel – hier erlaubt die SOP die Gabe.', wirkung: { sauerstoff: true, setzt: ['sauerstoff'] } },
        { id: 'a_messen', gruppe: 'ueberwachung', text: 'Blutdruck messen, Monitorwerte und Bewusstsein prüfen', dauer: 30, wiederholbar: true, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: engmaschig überwachen – Werte immer im Verlauf vergleichen.', wirkung: { messen: true } },
        { id: 'a_warten', gruppe: 'ueberwachung', text: '1 Minute beobachten (bei Herrn Kaiser bleiben)', dauer: 60, wiederholbar: true, bewertung: 'neutral', kuerzel: 'E', rueck: 'Sie bleiben bei Herrn Kaiser und beobachten.', wirkung: {} },
        { id: 'a_doku', gruppe: 'doku', text: 'Uhrzeit, Werte und Maßnahmen notieren', dauer: 15, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Uhrzeit, Auslöser, Symptome und Maßnahmen gehören ins Protokoll – das Notfallteam braucht sie.', wirkung: { setzt: ['doku'] } }
      ],
      checkliste: [
        { text: 'Infusion gestoppt, venösen Zugang belassen', merker: 'infusionStopp', ohneMerker: 'zugangWeg' },
        { text: 'Notfallteam gerufen, ohne Herrn Kaiser allein zu lassen', merker: 'hilfe' },
        { text: 'Oberkörper hoch gelagert (Leitsymptom Atemnot)', typ: 'lage' },
        { text: 'Adrenalin i. m. nach Notfall-SOP gegeben', merker: 'adrenalin' },
        { text: 'Werte und Bewusstsein überwacht', messMin: 1 },
        { text: 'Uhrzeit, Werte und Maßnahmen dokumentiert', merker: 'doku' },
        { text: 'Sauerstoff nach SOP gegeben', merker: 'sauerstoff', zusatz: true }
      ]
    },

    /* ======================================================================
       VARIANTE B – Pflegeheim
       ====================================================================== */
    {
      id: 'B',
      titel: 'Variante B – Pflegeheim',
      kurz: 'Frau Gruber (84), neues Schmerzmittel',
      situation: 'Seniorenzentrum „Am Mühlbach“, 8:20 Uhr. Frau Erna Gruber (84) hat um 8 Uhr nach ärztlicher Anordnung **zum ersten Mal ein neues Schmerzmittel** (Metamizol-Tablette) erhalten. Jetzt sitzt sie im Sessel: An den Armen bilden sich Quaddeln, es juckt. Sie ist blass. Ihre Stimme ist normal, Atemnot hat sie nicht.\n**Keine Ärztin im Haus, keine Notfall-SOP, kein Notfallset** für Frau Gruber.',
      start: { hf: 122, sys: 82, dia: 48, af: 20, spo2: 96, bew: 'wach', lage: 'sitzend' },
      werteSichtbar: false,
      atemweg: false,
      lageZiel: { bewusstlos: ['seite', 'beine'], atemnot: ['oberkoerper', 'sitzend'], kreislauf: ['beine'] },
      verlauf: { sys: -2, dia: -1, hf: 2, af: 0, spo2: 0 },
      beineBonus: 3,
      beineMax: 98,
      sitzMalus: 3,
      maxZeit: 720,
      erholungMitLage: true,
      endeHilfe: 'Die Notärztin trifft ein, gibt Adrenalin i. m. und übernimmt. Frau Gruber wird zur Überwachung ins Krankenhaus gebracht – eine zweite Reaktion ist möglich.',
      lageErklaerung: 'Leitsymptom bei Frau Gruber: **Kreislauf** (Schwindel, Blutdruck ↓, Puls ↑) ohne Atemnot → **flach, Beine hoch**. Aufsetzen oder Aufstehen lässt das Blut versacken.',
      aussagen: [
        { wenn: { bew: 'bewusstlos' }, text: '(reagiert nicht – atmet ruhig)' },
        { wenn: { bew: 'benommen' }, text: '„Was … was ist passiert?“' },
        { wenn: { lage: 'beine' }, text: '„So ist es besser … nicht mehr ganz so schwindelig.“' },
        { wenn: { sysUnter: 75 }, text: '„Mir wird schwarz vor Augen …“' },
        { wenn: {}, text: '„Mir ist so schwindelig und übel … und das juckt so.“' }
      ],
      haut: [
        { wenn: { bew: 'bewusstlos' }, text: 'blass, kaltschweißig, Quaddeln an den Armen' },
        { wenn: {}, text: 'Quaddeln an den Armen, Juckreiz, blass' }
      ],
      atmung: [
        { wenn: { bew: 'bewusstlos' }, text: 'atmet ruhig und regelmäßig' },
        { wenn: {}, text: 'ruhig, keine Atemnot, Stimme normal' }
      ],
      aktionen: [
        { id: 'b_hilfe', gruppe: 'hilfe', text: 'Pflegefachkraft rufen und Notruf 112 veranlassen – bei Frau Gruber bleiben', dauer: 30, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Ohne Ärztin im Haus sofort Notruf 112 – und Frau Gruber nicht allein lassen.', wirkung: { hilfe: 480, setzt: ['hilfe'] } },
        { id: 'b_hausarzt', gruppe: 'hilfe', text: 'Hausärztin anrufen und auf ihren Rückruf warten', dauer: 120, bewertung: 'gefaehrlich', kuerzel: 'E', rueck: 'Gefährlich: Zeitverlust. Bei Schockzeichen sofort Notruf 112.', wirkung: {} },
        { id: 'b_weg', gruppe: 'hilfe', text: 'Selbst zum Dienstzimmer laufen und den Notfallkoffer holen', dauer: 60, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Frau Gruber ist allein. Rufen Sie Hilfe, ohne zu gehen (Rufanlage, Telefon).', wirkung: { setzt: ['alleinGelassen'] } },
        { id: 'b_plan', gruppe: 'allergen', text: 'Keine weitere Tablette; Packung und Medikamentenplan für die Notärztin bereitlegen', dauer: 15, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Der Auslöser ist wichtig für Notärztin und Dokumentation.', wirkung: { setzt: ['medplan'] } },
        { id: 'b_beine', gruppe: 'lagerung', text: 'Hinlegen: flach, Beine hoch (Schocklage)', dauer: 30, wiederholbar: true, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Kreislaufzeichen ohne Atemnot – das Blut aus den Beinen fließt zum Herzen.', wirkung: { lage: 'beine' } },
        { id: 'b_ok', gruppe: 'lagerung', text: 'Oberkörper hoch lagern', dauer: 15, wiederholbar: true, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Frau Gruber hat keine Atemnot. Mit erhöhtem Oberkörper versackt mehr Blut – Schwindel und Blutdruck werden schlechter.', faelle: [{ wenn: { bew: 'bewusstlos' }, bewertung: 'gefaehrlich', rueck: 'Gefährlich: Frau Gruber ist bewusstlos – so sind die Atemwege nicht geschützt.' }], wirkung: { lage: 'oberkoerper' } },
        { id: 'b_seite', gruppe: 'lagerung', text: 'Stabile Seitenlage', dauer: 30, wiederholbar: true, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Frau Gruber ist wach. Bei Kreislaufzeichen ohne Atemnot: flach, Beine hoch.', faelle: [{ wenn: { bew: 'bewusstlos' }, bewertung: 'gut', rueck: 'Richtig: bewusstlos mit normaler Atmung – Atemwege freihalten. Auch flach mit Beinen hoch hilft hier dem Kreislauf.' }], wirkung: { lage: 'seite' } },
        { id: 'b_sitzen', gruppe: 'lagerung', text: 'Im Sessel sitzen lassen', dauer: 15, wiederholbar: true, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Im Sitzen versackt das Blut in den Beinen. Bei Schockzeichen ohne Atemnot flach lagern, Beine hoch.', wirkung: { lage: 'sitzend' } },
        { id: 'b_toilette', gruppe: 'lagerung', text: 'Zur Toilette begleiten – ihr ist übel', dauer: 30, bewertung: 'gefaehrlich', kuerzel: 'E', rueck: 'Gefährlich: Beim Aufstehen versackt das Blut in den Beinen. Frau Gruber kollabiert! Legen Sie sie sofort hin.', wirkung: { lage: 'flach', kollaps: true, sys: -25, dia: -12, setzt: ['aufgestanden'] } },
        { id: 'b_adrenalin', gruppe: 'medikamente', text: 'Adrenalin aus dem Notfallkoffer des Wohnbereichs spritzen', dauer: 15, bewertung: 'verboten', kuerzel: 'X', rueck: 'Nicht erlaubt: Es gibt keine ärztliche Anordnung und keine Notfall-SOP. Adrenalin gibt die Notärztin. Ihre Aufgabe: Notruf, lagern, überwachen.', wirkung: {} },
        { id: 'b_antihist', gruppe: 'medikamente', text: 'Antihistaminikum-Tropfen aus dem Bedarfsschrank geben', dauer: 15, bewertung: 'verboten', kuerzel: 'X', rueck: 'Nicht erlaubt: Für Frau Gruber gibt es dafür keine Anordnung. Außerdem ersetzt ein Antihistaminikum kein Adrenalin.', wirkung: {} },
        { id: 'b_wasser', gruppe: 'medikamente', text: 'Ein Glas Wasser geben – ihr ist übel', dauer: 30, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Bei Übelkeit und drohender Bewusstseinsstörung besteht Aspirationsgefahr – nichts zu trinken geben.', wirkung: {} },
        { id: 'b_messen', gruppe: 'ueberwachung', text: 'Puls, Blutdruck, Atemfrequenz und SpO₂ messen', dauer: 45, wiederholbar: true, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Werte messen und im Verlauf vergleichen (Schockindex!).', wirkung: { messen: true } },
        { id: 'b_warten', gruppe: 'ueberwachung', text: '1 Minute beobachten (bei Frau Gruber bleiben)', dauer: 60, wiederholbar: true, bewertung: 'neutral', kuerzel: 'E', rueck: 'Sie bleiben bei Frau Gruber und beobachten.', wirkung: {} },
        { id: 'b_doku', gruppe: 'doku', text: 'Uhrzeit, Werte, Symptome und Maßnahmen notieren', dauer: 15, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Die Notärztin braucht Uhrzeit, Auslöser, Symptome, Werte und Maßnahmen.', wirkung: { setzt: ['doku'] } }
      ],
      checkliste: [
        { text: 'Pflegefachkraft gerufen und Notruf 112 veranlasst', merker: 'hilfe' },
        { text: 'Flach gelagert, Beine hoch (Leitsymptom Kreislauf)', typ: 'lage' },
        { text: 'Nicht aufstehen lassen', ohneMerker: 'aufgestanden' },
        { text: 'Keine Medikamente ohne ärztliche Anordnung', ohneMerker: 'verboten' },
        { text: 'Werte mehrmals gemessen', messMin: 2 },
        { text: 'Uhrzeit, Werte, Symptome und Maßnahmen dokumentiert', merker: 'doku' },
        { text: 'Packung und Medikamentenplan für die Notärztin bereitgelegt', merker: 'medplan', zusatz: true }
      ]
    },

    /* ======================================================================
       VARIANTE C – Ambulante Pflege
       ====================================================================== */
    {
      id: 'C',
      titel: 'Variante C – ambulante Pflege',
      kurz: 'Herr Hager (66), Bienenstich, eigenes Notfallset',
      situation: 'Ambulanter Pflegedienst. Sie sind bei Herrn Josef Hager (66), Hobby-Imker mit **bekannter Bienengiftallergie**. Im Garten wird er in den Hals gestochen – der Stachel steckt noch. Er setzt sich auf die Gartenbank, kratzt sich, Quaddeln breiten sich aus, seine Stimme wird heiser.\nIm Küchenschrank liegt sein **Notfallset mit ärztlichem Anaphylaxie-Notfallplan**: Adrenalin-Autoinjektor 0,3 mg, Antihistaminikum-Tropfen, Kortison-Saft. Pulsoximeter und Blutdruckgerät haben Sie in der Pflegetasche.',
      start: { hf: 124, sys: 92, dia: 58, af: 24, spo2: 93, bew: 'unruhig', lage: 'sitzend' },
      werteSichtbar: false,
      atemweg: true,
      lageZiel: { bewusstlos: ['seite'], atemnot: ['oberkoerper', 'sitzend'], kreislauf: ['beine', 'flach'] },
      verlauf: { sys: -2, dia: -1, hf: 2, af: 1, spo2: -1 },
      beineBonus: 2,
      sitzMalus: 0,
      maxZeit: 720,
      kollapsOhneAdrenalinAb: 120,   // ohne Adrenalin wird Herr Hager nach 2 Minuten bewusstlos
      kollapsText: 'Herr Hager sackt auf der Bank zur Seite und reagiert nicht mehr. Er atmet normal. Prüfen Sie die Lagerung!',
      erholungBrauchtAdrenalin: true,
      endeHilfe: 'Der Notarzt trifft ein und übernimmt. Herr Hager kommt zur Überwachung ins Krankenhaus – eine zweite Reaktion ist möglich.',
      endeOhneAdrenalin: 'Der Notarzt gibt jetzt Adrenalin – der Autoinjektor nach dem Notfallplan hätte Zeit gewonnen.',
      lageErklaerung: 'Leitsymptom bei Herrn Hager zuerst: **Atemnot** (Heiserkeit, Kloßgefühl) → **halbsitzend** lassen. Wird er **bewusstlos mit normaler Atmung** → **stabile Seitenlage**. Die Lagerung muss sich dem Zustand anpassen.',
      aussagen: [
        { wenn: { bew: 'bewusstlos' }, text: '(reagiert nicht – atmet normal)' },
        { wenn: { bew: 'benommen' }, text: '„Was … war ich weg?“' },
        { wenn: { adrenalinWirkt: true }, text: '„Puh … es wird leichter. Das Kratzen im Hals lässt nach.“' },
        { wenn: { lage: ['flach', 'beine'] }, text: '„Ich krieg … im Liegen … schlecht Luft!“' },
        { wenn: {}, text: '„Mein Hals … wie ein Kloß. Meine Stimme … ganz heiser.“' }
      ],
      haut: [
        { wenn: { adrenalinWirkt: true }, text: 'Quaddeln blassen ab, Einstichstelle am Hals geschwollen' },
        { wenn: { bew: 'bewusstlos' }, text: 'blass, Quaddeln am ganzen Körper' },
        { wenn: {}, text: 'Quaddeln an Hals und Brust, Einstichstelle am Hals geschwollen' }
      ],
      atmung: [
        { wenn: { bew: 'bewusstlos' }, text: 'atmet normal und regelmäßig' },
        { wenn: { adrenalinWirkt: true }, text: 'ruhiger, Stimme noch etwas heiser' },
        { wenn: {}, text: 'schnell, Kloßgefühl, heisere Stimme' }
      ],
      aktionen: [
        { id: 'c_hilfe', gruppe: 'hilfe', text: 'Notruf 112 – bei Herrn Hager bleiben (Handy auf Lautsprecher)', dauer: 30, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Sofort Notruf 112 – und dabei bei Herrn Hager bleiben.', wirkung: { hilfe: 480, setzt: ['hilfe'] } },
        { id: 'c_weg', gruppe: 'hilfe', text: 'Zur Nachbarin laufen und Hilfe holen', dauer: 90, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Herr Hager ist allein, und der Rettungsdienst ist noch nicht alarmiert. Rufen Sie 112 vom Handy.', wirkung: { setzt: ['alleinGelassen'] } },
        { id: 'c_stachel', gruppe: 'allergen', text: 'Stachel sofort abstreifen (mit Fingernagel oder Karte)', dauer: 15, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Der Bienenstachel gibt weiter Gift ab – schnell abstreifen, nicht mit den Fingern quetschen.', wirkung: { setzt: ['stachel'] } },
        { id: 'c_kuehlen', gruppe: 'allergen', text: 'Einstichstelle kühlen', dauer: 30, bewertung: 'neutral', kuerzel: 'E', rueck: 'Möglich, aber nicht vorrangig – Notruf und Adrenalin gehen vor.', wirkung: {} },
        { id: 'c_ok', gruppe: 'lagerung', text: 'Halbsitzend auf der Bank lassen, Oberkörper anlehnen', dauer: 15, wiederholbar: true, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Atemnot ist das Leitsymptom – halbsitzend kann er besser atmen. Nicht aufstehen lassen.', faelle: [{ wenn: { bew: 'bewusstlos' }, bewertung: 'gefaehrlich', rueck: 'Gefährlich: Er ist bewusstlos – so sind die Atemwege nicht geschützt. Stabile Seitenlage!' }], wirkung: { lage: 'oberkoerper' } },
        { id: 'c_beine', gruppe: 'lagerung', text: 'Flach hinlegen, Beine hoch', dauer: 30, wiederholbar: true, bewertung: 'neutral', kuerzel: 'E', rueck: 'Möglich, wenn keine Atemnot mehr besteht.', faelle: [{ wenn: { bew: 'bewusstlos' }, bewertung: 'unguenstig', rueck: 'Ungünstig: Bewusstlos mit normaler Atmung → stabile Seitenlage. In Rückenlage droht Aspiration.' }, { wenn: { atemnot: true }, bewertung: 'gefaehrlich', rueck: 'Gefährlich: Er hat Atemnot (Heiserkeit, Kloßgefühl) – flach mit Beinen hoch verschlechtert die Atmung.' }], wirkung: { lage: 'beine' } },
        { id: 'c_seite', gruppe: 'lagerung', text: 'Stabile Seitenlage (auf dem Rasen)', dauer: 30, wiederholbar: true, bewertung: 'unguenstig', kuerzel: 'E', rueck: 'Ungünstig: Herr Hager ist wach und hat Atemnot – halbsitzend ist besser.', faelle: [{ wenn: { bew: 'bewusstlos' }, bewertung: 'gut', rueck: 'Richtig: bewusstlos mit normaler Atmung – Atemwege freihalten, Atmung ständig kontrollieren.' }], wirkung: { lage: 'seite' } },
        { id: 'c_sofa', gruppe: 'lagerung', text: 'Aufhelfen und ins Haus zum Sofa begleiten', dauer: 45, bewertung: 'gefaehrlich', kuerzel: 'E', rueck: 'Gefährlich: Aufstehen und Gehen lassen das Blut versacken – Herr Hager kollabiert! Bleiben Sie, wo Sie sind.', wirkung: { lage: 'flach', kollaps: true, sys: -20, dia: -10, setzt: ['aufgestanden'] } },
        { id: 'c_autoinjektor', gruppe: 'medikamente', text: 'Adrenalin-Autoinjektor aus dem Notfallset in die Außenseite des Oberschenkels (laut Notfallplan)', dauer: 45, bewertung: 'gut', kuerzel: 'A', rueck: 'Richtig: Der ärztliche Notfallplan ist die Anordnung für Herrn Hager. Adrenalin wirkt am schnellsten. Uhrzeit merken – nach 5–10 Minuten kann ein zweiter Injektor nötig sein.', wirkung: { adrenalin: true, setzt: ['adrenalin'] } },
        { id: 'c_tropfen', gruppe: 'medikamente', text: 'Antihistaminikum-Tropfen aus dem Notfallset geben', dauer: 30, bewertung: 'neutral', kuerzel: 'A', rueck: 'Laut Notfallplan nach Adrenalin möglich – nur, wenn er wach ist und sicher schlucken kann.', faelle: [{ wenn: { bew: 'bewusstlos' }, bewertung: 'gefaehrlich', rueck: 'Gefährlich: Einem Bewusstlosen nie etwas in den Mund geben – Aspirationsgefahr!' }, { wenn: { adrenalin: false }, bewertung: 'gefaehrlich', rueck: 'Gefährlich: Die Tropfen ersetzen kein Adrenalin und verzögern es. Bei Schwellung im Hals droht außerdem Aspiration.' }], wirkung: {} },
        { id: 'c_messen', gruppe: 'ueberwachung', text: 'Puls, Blutdruck, Atemfrequenz und SpO₂ messen', dauer: 45, wiederholbar: true, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Werte messen und im Verlauf vergleichen.', wirkung: { messen: true } },
        { id: 'c_warten', gruppe: 'ueberwachung', text: '1 Minute beobachten (bei Herrn Hager bleiben)', dauer: 60, wiederholbar: true, bewertung: 'neutral', kuerzel: 'E', rueck: 'Sie bleiben bei Herrn Hager und beobachten.', wirkung: {} },
        { id: 'c_doku', gruppe: 'doku', text: 'Uhrzeit des Stichs und der Adrenalingabe notieren', dauer: 15, bewertung: 'gut', kuerzel: 'E', rueck: 'Richtig: Der Notarzt muss wissen, wann gestochen und wann Adrenalin gegeben wurde.', wirkung: { setzt: ['doku'] } }
      ],
      checkliste: [
        { text: 'Notruf 112 abgesetzt, Herrn Hager nicht allein gelassen', merker: 'hilfe' },
        { text: 'Adrenalin-Autoinjektor nach dem Notfallplan angewendet', merker: 'adrenalin' },
        { text: 'Stachel entfernt', merker: 'stachel' },
        { text: 'Lagerung passend zum Leitsymptom (halbsitzend bei Atemnot)', typ: 'lage' },
        { text: 'Bei Bewusstlosigkeit: stabile Seitenlage', typ: 'seiteWennBewusstlos' },
        { text: 'Werte gemessen', messMin: 1 },
        { text: 'Uhrzeiten notiert', merker: 'doku' }
      ]
    }
  ]
};

/* KB I · Woche 4 (SW 9) – Inhalte der Handy-Übungen.
   Diese Datei ist die einzige Quelle für Messkarten, Simulationsszenen und Übungskarten:
   Die Handy-Seiten (docs/w4/*.html) lesen sie direkt, das Arbeitsblatt-Werkzeug (werkzeuge/ab_w4.js)
   übernimmt daraus die Messungen für Blatt 2 und den Lesetext von Blatt 3 (analoge Fassung).
   Texte ändern: nur zwischen den Hochkommas; **Wort** = fett. Kennungen (id, typ, richtig) nicht ändern. */
var W4 = {
  kopfzeile: 'KB I · Notfallsituationen · 3BFP2',
  basis: 'https://klawittersven-arch.github.io/3BFP2-kb1-notfall/w4/',

  /* Ampel für den Live-Verlauf (Blatt 2) */
  ampel: {
    gruen: { zeichen: '🟢', kurz: 'weiter wie geplant', lang: 'Weiter wie geplant – nächste Kontrolle nach Plan', analog: 'sitzen bleiben' },
    gelb: { zeichen: '🟡', kurz: 'genauer hinsehen', lang: 'Genauer hinsehen – bald nachmessen, Pflegefachkraft informieren', analog: 'Hand heben' },
    rot: { zeichen: '🔴', kurz: 'Notfall melden', lang: 'Notfall – Ärztin sofort rufen, nicht allein lassen', analog: 'aufstehen' }
  },

  /* ---------- Blatt 2 · Live-Verlauf „Frühdienst – drei Patienten, eine Ampel“ ---------- */
  verlauf: {
    titel: 'Frühdienst: drei Patienten, eine Ampel',
    einleitung: 'Sie betreuen im Frühdienst drei Patienten. Vielleicht ist keiner ein Notfall – vielleicht mehrere. Bei jeder Messkarte entscheiden Sie: 🟢, 🟡 oder 🔴.',
    regel: 'Gewonnen: Sie melden Finn rechtzeitig als Notfall – und geben höchstens einen Fehlalarm (🔴 ohne Notfall).',
    sekunden: 40,           // Zeit je Karte am Handy (Lesen und Entscheiden)
    patienten: [
      { id: 'finn', name: 'Finn Albers (17)', kurz: 'Fahrradsturz gestern Abend, Lenker in den linken Oberbauch, zur Beobachtung' },
      { id: 'jana', name: 'Jana Kraus (24)', kurz: 'gestern am rechten Unterarm operiert' },
      { id: 'kurz', name: 'Herr Bernd Kurz (45)', kurz: 'Sprunggelenk-OP vor zwei Tagen, geht mit Unterarmgehstützen' }
    ],
    karten: [
      {
        nr: 1, zeit: '06:00', wer: 'finn', puls: 76, rr: [124, 78], af: 16, vorwert: null,
        beobachtung: 'Haut rosig und warm.',
        aussage: '„Mir geht’s gut. Nur die Prellung tut weh, wenn ich mich bewege.“',
        richtig: 'gruen',
        begruendung: 'Alle Werte sind normal (Schockindex 0,6). Schmerz an der Prellung ist nach dem Sturz zu erwarten. Wer jetzt 🔴 wählt, meldet zu früh.'
      },
      {
        nr: 2, zeit: '06:10', wer: 'jana', puls: 70, rr: [96, 58], af: 14, vorwert: 'gestern 18 Uhr: Puls 72/min, RR 98/60 mmHg',
        beobachtung: 'Haut warm und rosig.',
        aussage: '„Mir geht’s gut. Mein Blutdruck ist immer so niedrig.“',
        richtig: 'gruen',
        begruendung: 'Der Blutdruck ist niedrig, aber stabil wie gestern. Puls ruhig, Haut warm und rosig, Schockindex 0,7, keine Beschwerden. Ein einzelner niedriger Wert ist noch kein Schock.'
      },
      {
        nr: 3, zeit: '06:30', wer: 'kurz', puls: 112, rr: [142, 86], af: 22, vorwert: '06:00 Uhr: Puls 80/min, RR 135/85 mmHg',
        beobachtung: 'Er kommt gerade mit den Unterarmgehstützen von der Toilette (50 m). Er schwitzt leicht.',
        aussage: '„Puh, das ist anstrengend!“',
        richtig: 'gelb',
        begruendung: 'Puls und Atmung sind direkt nach der Anstrengung erhöht – das ist erklärbar. Richtig: nach 5 Minuten Ruhe nachmessen. Sofort einen Notfall zu melden wäre ein Fehlalarm.'
      },
      {
        nr: 4, zeit: '06:40', wer: 'kurz', puls: 84, rr: [134, 84], af: 16, vorwert: '06:30 Uhr direkt nach dem Gehen: Puls 112/min',
        beobachtung: 'Nach 5 Minuten Ruhe im Bett. Haut trocken.',
        aussage: '„Jetzt geht’s wieder.“',
        richtig: 'gruen',
        begruendung: 'In Ruhe sind die Werte wieder normal (Schockindex 0,6). Die Anstrengung erklärt den hohen Puls von vorhin.'
      },
      {
        nr: 5, zeit: '07:00', wer: 'finn', puls: 88, rr: [122, 82], af: 18, vorwert: '06:00 Uhr: Puls 76/min, RR 124/78 mmHg',
        beobachtung: 'Haut rosig.',
        aussage: '„Wann gibt’s Frühstück?“',
        richtig: 'gelb',
        begruendung: 'Alle Werte liegen noch im Normbereich (Schockindex 0,7). Aber: Der Puls ist in einer Stunde um 12 gestiegen, der Abstand zwischen oberem und unterem Blutdruckwert ist kleiner geworden. Richtig: in 15–20 Minuten nachmessen, Pflegefachkraft informieren, noch nichts essen lassen. Ein Notfall ist es noch nicht.'
      },
      {
        nr: 6, zeit: '07:20', wer: 'finn', puls: 104, rr: [118, 88], af: 22, vorwert: '07:00 Uhr: Puls 88/min, RR 122/82 mmHg',
        beobachtung: 'Er ist blass, die Hände sind kühl.',
        aussage: '„Ich hab so Durst. Und meine linke Schulter tut komisch weh.“',
        richtig: 'rot',
        begruendung: 'Der Puls steigt weiter (76 → 88 → 104), der Abstand zwischen den Blutdruckwerten wird immer kleiner (46 → 40 → 30). Dazu Blässe, kühle Hände, Durst und Schmerz in der linken Schulter (Hinweis auf eine Milzverletzung). Das ist ein Notfall – auch wenn der Schockindex erst 0,9 ist!'
      }
    ],
    aufloesung: {
      zeit: '08:00', titel: 'So wäre es um 8 Uhr gewesen – wenn niemand Alarm gegeben hätte',
      puls: 124, rr: [102, 86], af: 26,
      beobachtung: 'Finn ist kaltschweißig und unruhig.',
      aussage: '„Mir ist so schwindelig.“',
      text: 'Schockindex 1,2. Der Ultraschall zeigt jetzt Blut im Bauch: Die Milz ist eingerissen. Finn muss notfallmäßig operiert werden – und hat schon viel Blut verloren.',
      gerettet: 'Weil Sie um 07:20 Uhr Alarm gegeben haben, kommt die Ärztin sofort. Der Ultraschall zeigt eine Blutung aus der Milz. Finn wird rechtzeitig operiert.'
    },
    ergebnis: {
      gewonnen: 'Gewonnen! Sie haben Finn rechtzeitig gemeldet und keinen unnötigen Alarm gegeben.',
      fehlalarme: 'Nicht gewonnen: zu viele Fehlalarme. Die Ärztin wurde mehrmals umsonst gerufen – in dieser Zeit fehlte sie bei anderen Kranken.',
      uebersehen: 'Nicht gewonnen: Finns Notfall wurde zu spät erkannt.'
    }
  },

  /* ---------- Blatt 3 · Simulation „Notfall-Ampel im Speisesaal“ ---------- */
  speisesaal: {
    titel: 'Notfall-Ampel im Speisesaal',
    einleitung: 'Sechs kurze Szenen. Entscheiden Sie schnell – aber richtig. Bei einer schweren Verlegung sinkt die Sauerstoffsättigung, solange Sie zögern. Bei einer leichten Verlegung ist ein Notruf ein Fehlalarm.',
    regel: 'Bestanden: Alle schweren Verlegungen rechtzeitig erkannt (niemand wird bewusstlos) – und höchstens ein Fehlalarm.',
    hinweisSpO2: 'Die Sauerstoffsättigung (SpO₂) zeigen wir nur in der Simulation – beim Essen misst sie niemand.',
    lesezeit: 6,             // Sekunden zum Lesen, bevor die Sättigung bei einer schweren Verlegung sinkt
    abfallProSekunde: 1.5,   // so viele Prozentpunkte sinkt die SpO₂ pro Sekunde (schwere Verlegung)
    abfallFehler: 10,        // zusätzlicher Abfall bei falscher Wahl (schwere Verlegung)
    bewusstlosUnter: 60,
    sekundenLeicht: 25,      // Zeit bei leichter Verlegung (läuft ab, ohne dass die SpO₂ sinkt)
    feste: 3,                // die ersten 3 Szenen in fester Reihenfolge, dann gemischt
    optionen: {
      husten: { text: 'Zum Husten auffordern, bei ihr/ihm bleiben und beobachten', kurz: 'zum Husten auffordern' },
      hilfe: { text: 'Laut um Hilfe rufen, Notruf veranlassen, bleiben und sofort handeln', kurz: 'Hilfe rufen – Notfall' },
      wasser: { text: 'Schnell ein Glas Wasser zum Trinken geben', kurz: 'Wasser geben' },
      ruecken: { text: 'Kräftig auf den Rücken klopfen', kurz: 'auf den Rücken klopfen' },
      mund: { text: 'Mit dem Finger im Mund nach dem Bissen suchen', kurz: 'im Mund suchen' },
      hinlegen: { text: 'Hinlegen lassen, damit sie/er sich ausruht', kurz: 'hinlegen' },
      warten: { text: 'Abwarten – das wird gleich von allein besser', kurz: 'abwarten' }
    },
    szenen: [
      {
        id: 'maler', person: 'Frau Maler (71)', ort: 'Frühstück im Zimmer', schwer: false, spo2: 95, leitfall: true,
        text: 'Frau Maler trinkt Kaffee. Plötzlich verschluckt sie sich. Sie hustet kräftig, ihr Gesicht wird rot. Zwischen zwei Hustenstößen sagt sie: „Oh je … geht gleich.“',
        wahl: ['wasser', 'husten', 'hilfe', 'ruecken'],
        richtig: 'husten',
        rueckmeldung: {
          husten: 'Richtig – so hat Christin es gemacht. Frau Maler hustet kräftig und kann sprechen: eine leichte Verlegung. Kräftiger Husten ist die beste Hilfe. Nach kurzer Zeit ist alles wieder gut.',
          wasser: 'Nicht jetzt: Beim Trinken verschluckt sie sich gleich noch einmal.',
          ruecken: 'Nicht nötig: Sie hustet kräftig – das wirkt am besten. Klopfen stört den Husten.',
          hilfe: 'Fehlalarm: Frau Maler hustet kräftig und kann sprechen. Das ist eine leichte Verlegung.'
        }
      },
      {
        id: 'roth1', person: 'Herr Roth (80)', ort: 'Abendessen in der Wohngruppe', schwer: false, spo2: 96,
        text: 'Herr Roth isst ein Wurstbrot und erzählt dabei lebhaft. Plötzlich hustet er kräftig und laut. Er hebt die Hand: „Geht schon …“',
        wahl: ['ruecken', 'hilfe', 'husten', 'wasser'],
        richtig: 'husten',
        rueckmeldung: {
          husten: 'Richtig: kräftiger Husten, er kann sprechen – leichte Verlegung. Bleiben Sie bei ihm und beobachten Sie genau.',
          ruecken: 'Nicht nötig: Er hustet kräftig – das wirkt am besten. Klopfen stört den Husten.',
          hilfe: 'Fehlalarm: Herr Roth hustet kräftig und spricht. Noch ist es eine leichte Verlegung.',
          wasser: 'Nicht jetzt: Beim Trinken kann er sich noch einmal verschlucken.'
        }
      },
      {
        id: 'roth2', person: 'Herr Roth (80)', ort: '20 Sekunden später', schwer: true, spo2: 89,
        text: 'Der Husten von Herrn Roth wird leise und kraftlos. Er kann nicht mehr sprechen. Er greift sich mit beiden Händen an den Hals. Seine Lippen werden bläulich.',
        wahl: ['husten', 'hilfe', 'mund', 'wasser'],
        richtig: 'hilfe',
        rueckmeldung: {
          hilfe: 'Richtig: schwacher Husten, kann nicht sprechen, Griff an den Hals, Zyanose – eine schwere Verlegung. Eine Kollegin setzt den Notruf ab, die Pflegefachkraft kommt sofort und löst den Bissen. Herr Roth atmet wieder.',
          husten: 'Zu spät: Sein Husten wirkt nicht mehr. Jetzt zählt jede Sekunde!',
          mund: 'Gefährlich: Blind im Mund suchen kann den Bissen tiefer schieben.',
          wasser: 'Gefährlich: Er kann nicht schlucken – das Wasser läuft in die Atemwege.'
        }
      },
      {
        id: 'brueckner', person: 'Frau Brückner (88)', ort: 'Mittagessen', schwer: false, spo2: 95,
        text: 'Frau Brückner hat sich an einer Erbse verschluckt. Sie hustet kräftig und ruft laut: „Hilfe! Ich ersticke!“ Ihr Gesicht ist rot.',
        wahl: ['hilfe', 'hinlegen', 'husten', 'ruecken'],
        richtig: 'husten',
        rueckmeldung: {
          husten: 'Richtig: Wer laut rufen kann, bekommt Luft. Leichte Verlegung: beruhigen, zum Husten auffordern, bleiben.',
          hilfe: 'Fehlalarm: Sie ruft laut und hustet kräftig – also strömt Luft. Das ist eine leichte Verlegung.',
          hinlegen: 'Nicht hinlegen: Im Sitzen hustet sie besser.',
          ruecken: 'Nicht nötig: Sie hustet kräftig – das wirkt am besten. Klopfen stört den Husten.'
        }
      },
      {
        id: 'vogt', person: 'Herr Vogt (75)', ort: 'Mittagessen', schwer: true, spo2: 93,
        text: 'Herr Vogt isst ein Stück Fleisch. Plötzlich hört er auf zu essen. Er sitzt still, beide Hände am Hals. Er macht keinen Ton und hustet nicht. Er schaut Sie erschrocken an. Seine Lippen sind noch rosig.',
        wahl: ['warten', 'husten', 'wasser', 'hilfe'],
        richtig: 'hilfe',
        rueckmeldung: {
          hilfe: 'Richtig: kein Husten, kein Ton, Griff an den Hals – eine schwere Verlegung. Nicht warten, bis die Lippen blau sind! Die Pflegefachkraft kommt sofort, der Bissen löst sich.',
          warten: 'Zu spät: Er bekommt keine Luft. Die Lippen werden erst blau, wenn schon viel Sauerstoff fehlt.',
          husten: 'Er kann nicht husten – Auffordern hilft nicht mehr.',
          wasser: 'Gefährlich: Er kann nicht schlucken – das Wasser läuft in die Atemwege.'
        }
      },
      {
        id: 'lenz', person: 'Frau Lenz (82)', ort: 'Kaffee und Kuchen', schwer: true, spo2: 91,
        text: 'Frau Lenz hat sich an einem Stück Kuchen verschluckt. Sie hustet nur noch schwach. Beim Einatmen hört man ein Pfeifen. Sie kann nur einzelne Wörter sagen: „Ich … keine …“',
        wahl: ['husten', 'hinlegen', 'hilfe', 'wasser'],
        richtig: 'hilfe',
        rueckmeldung: {
          hilfe: 'Richtig: Der Husten ist schwach und unwirksam, sie bekommt kaum Luft – eine schwere Verlegung. Die Pflegefachkraft kommt sofort, der Bissen löst sich.',
          husten: 'Zu spät: Sie hustet zwar noch, aber schwach und unwirksam. Das reicht nicht.',
          hinlegen: 'Gefährlich: Im Liegen bekommt sie noch schlechter Luft.',
          wasser: 'Gefährlich: Sie kann nicht richtig schlucken – das Wasser läuft in die Atemwege.'
        }
      }
    ],
    ergebnis: {
      bestanden: 'Bestanden! Sie haben jede schwere Verlegung rechtzeitig erkannt und höchstens einmal unnötig Alarm gegeben.',
      bewusstlos: 'Nicht bestanden: Eine Person ist bewusstlos geworden. Bei einer schweren Verlegung zählt jede Sekunde.',
      fehlalarme: 'Nicht bestanden: zu viele Fehlalarme. Wer kräftig hustet oder laut rufen kann, bekommt Luft.'
    }
  },

  /* ---------- Blatt 1 · Schon fertig? „Rückenmark-Check“ ---------- */
  rueckenmark: {
    titel: 'Rückenmark-Check',
    einleitung: 'Acht kurze Fälle. Tippen Sie die richtige Antwort an. Sie sehen sofort, ob es stimmt.',
    karten: [
      { typ: 'hoehe', text: 'Herr Lux (19) ist kopfüber ins flache Wasser gesprungen. Er kann Arme und Beine nicht bewegen. Er atmet selbst.', richtig: 'hws', erklaerung: 'Arme und Beine betroffen → Halswirbelsäule (Tetraplegie). Er atmet selbst, also liegt die Verletzung unterhalb der Nerven für das Zwerchfell.' },
      { typ: 'hoehe', text: 'Frau Sander (30) ist vom Pferd gestürzt. Sie kann die Beine nicht bewegen. Arme und Hände funktionieren.', richtig: 'bws', erklaerung: 'Nur die Beine betroffen → Brust- oder Lendenwirbelsäule (Paraplegie).' },
      { typ: 'hoehe', text: 'Nach einem Motorradunfall kann Herr Kaiser (40) nicht mehr selbst atmen. Arme und Beine sind gelähmt.', richtig: 'hoch', erklaerung: 'Auch die Atmung fällt aus → sehr hohe Verletzung der Halswirbelsäule. Hier gehen die Nerven für das Zwerchfell ab.' },
      { typ: 'hoehe', text: 'Herr Bach (55) ist vom Dach gefallen. Ab dem Bauchnabel abwärts spürt er nichts. Die Arme kann er normal bewegen.', richtig: 'bws', erklaerung: 'Gefühl erst ab dem Bauch gestört, Arme normal → Brustwirbelsäule.' },
      { typ: 'wahl', text: 'Frau Ott (68) ist auf der Treppe gestürzt. Sie hat Nackenschmerzen und sagt: „Helfen Sie mir hoch!“ Was tun Sie?', optionen: ['Ihr vorsichtig auf einen Stuhl helfen', 'Kopf mit beiden Händen halten, sie bitten, still zu liegen', 'Ein Kissen unter den Kopf legen'], richtig: 1, erklaerung: 'Nackenschmerz nach einem Sturz = Verdacht auf Wirbelsäulenverletzung. Nicht aufsetzen, Kopf in der vorgefundenen Lage halten.' },
      { typ: 'wahl', text: 'Ein Mann mit Verdacht auf Wirbelsäulenverletzung muss sich übergeben. Was tun Sie?', optionen: ['Allein schnell auf die Seite drehen', 'Mit mehreren Helfenden achsengerecht auf die Seite drehen – der Kopf wird gehalten', 'Auf dem Rücken liegen lassen'], richtig: 1, erklaerung: 'Jetzt ist der Lagewechsel unvermeidbar (Gefahr des Erstickens). Dann achsengerecht: Kopf, Schultern und Hüfte drehen gleichzeitig.' },
      { typ: 'wahl', text: 'Nach einem Sturz vom Gerüst kann Herr Böhm alle Finger und Zehen bewegen. Er hat starke Rückenschmerzen. Eine Kollegin sagt: „Dann ist die Wirbelsäule nicht verletzt.“', optionen: ['Stimmt – wer sich bewegen kann, hat keine Verletzung', 'Stimmt nicht – ein instabiler Wirbelbruch ist trotzdem möglich'], richtig: 1, erklaerung: 'Hergang (Sturz aus der Höhe) und Rückenschmerz reichen für den Verdacht. Ein instabiler Bruch kann das Rückenmark erst bei Bewegung verletzen.' },
      { typ: 'wahl', text: 'Herr Neumann hat eine Verletzung der Halswirbelsäule. Puls 52/min, Blutdruck 85/50 mmHg, die Haut an den Beinen ist warm und rosig. Woran denken Sie?', optionen: ['Er ist stabil – der Puls ist ja ruhig', 'Neurogener Schock: Der Sympathikus fällt aus', 'Hypovolämischer Schock durch eine Blutung'], richtig: 1, erklaerung: 'Niedriger Blutdruck, langsamer Puls, warme Haut unterhalb der Verletzung: neurogener Schock. Der Körper kann nicht gegensteuern.' }
    ],
    hoehen: {
      hoch: 'HWS – sehr hoch',
      hws: 'Halswirbelsäule (HWS)',
      bws: 'Brust- oder Lendenwirbelsäule (BWS/LWS)'
    }
  },

  /* ---------- Blatt 2 · Schon fertig? „Trend-Detektiv“ ---------- */
  trend: {
    titel: 'Trend-Detektiv',
    einleitung: 'Fünf Patientinnen und Patienten, je drei Messungen. Lesen Sie den Verlauf. Entscheiden Sie mit der Ampel.',
    reihen: [
      { name: 'Herr Ludwig (60)', info: 'zwei Tage nach einer Knie-OP', zeiten: ['08:00', '10:00', '12:00'], puls: [72, 76, 74], rr: ['135/80', '132/82', '134/80'], zusatz: 'liest Zeitung, keine Beschwerden', richtig: 'gruen', erklaerung: 'Alle Werte stabil und normal. Kein Trend → weiter wie geplant.' },
      { name: 'Frau Pohl (34)', info: 'Beckenprellung nach einem Autounfall', zeiten: ['08:00', '08:30', '09:00'], puls: [80, 96, 112], rr: ['120/80', '116/84', '108/88'], zusatz: 'jetzt blass, sagt: „Mir ist komisch.“', richtig: 'rot', erklaerung: 'Puls steigt schnell, der Abstand der Blutdruckwerte wird kleiner, dazu Blässe und Unwohlsein: Verdacht auf eine innere Blutung → Notfall.' },
      { name: 'Herr Sen (22)', info: 'Fußballer, Kreuzband-OP gestern', zeiten: ['06:00', '10:00', '14:00'], puls: [52, 54, 52], rr: ['110/65', '112/66', '110/64'], zusatz: 'fühlt sich gut, rosig', richtig: 'gruen', erklaerung: 'Langsamer Puls und niedriger Blutdruck sind bei Sportlern normal – und die Werte sind stabil.' },
      { name: 'Frau Weil (70)', info: 'vier Tage nach einer Bauch-OP', zeiten: ['06:00', '10:00', '14:00'], puls: [84, 92, 102], rr: ['130/80', '128/78', '130/80'], zusatz: 'Temperatur 38,9 °C, Haut heiß, friert', richtig: 'gelb', erklaerung: 'Das Fieber erklärt den höheren Puls, der Blutdruck ist stabil. Melden (Pflegefachkraft, Ärztin informieren) – aber kein Schock-Notfall.' },
      { name: 'Herr Neumann (50)', info: 'Wirbelbruch der Halswirbelsäule nach einem Sturz', zeiten: ['08:00', '08:15', '08:30'], puls: [64, 58, 52], rr: ['110/70', '96/58', '84/50'], zusatz: 'Haut an den Beinen warm, trocken, rosig', richtig: 'rot', erklaerung: 'Der Blutdruck fällt, der Puls wird sogar langsamer: neurogener Schock. Nicht vom ruhigen Puls täuschen lassen → Notfall.' }
    ]
  },

  /* ---------- Blatt 3 · AA1 Informationstext „Atemwege und Ventilation“ ----------
     Analog: Text mit fetten Fachwörtern. Digital: dieselben Fachwörter sind Lücken; die Wörter bekommen die SuS
     am Handy (anatomie.html), sobald sie alle Teile im Bild richtig angetippt haben. **Wort** = Lücke bzw. fett. */
  atemwegeText: {
    kopf: 'Informationstext: Atemwege und Ventilation',
    absaetze: [
      'Die Luft strömt durch Nase oder Mund in den **Rachen**. Hier kreuzen sich Luftweg und Speiseweg. Beim Schlucken hebt sich der **Kehlkopf**, der **Kehldeckel** verschließt die **Luftröhre** – die Nahrung rutscht in die Speiseröhre. Gerät doch etwas in den Kehlkopf, muss man kräftig husten (**Hustenreflex**).',
      'Die Luftröhre teilt sich in zwei Hauptbronchien, einen rechten und einen linken. Der **rechte Hauptbronchus** ist kürzer, weiter und verläuft steiler. In den **Lungenbläschen** geht Sauerstoff ins Blut. Das Ein- und Ausatmen heißt **Ventilation**.'
    ]
  },

  /* ---------- Blatt 3 · AA1 digital: „Wo ist was?“ – Teile der Atemwege im Bild antippen ----------
     Fragen in zufälliger Reihenfolge, je Frage „sekunden“ Zeit; bei einem Fehler oder abgelaufener Zeit beginnt die Übung von vorn. Danach: Wörter für den Lückentext
     (alle **Wörter** aus atemwegeText, alphabetisch). Bild: atemwege_bild.js */
  anatomie: {
    titel: 'Wo ist was? Die Atemwege',
    // Zeit je Frage in Sekunden (kurze Frage lesen ≈ 1,5 s, im Bild finden 1–2 s, tippen). Abgelaufen = von vorn.
    sekunden: 5,
    einleitung: 'Sie sehen die Atemwege von vorn. Tippen Sie bei jeder Frage auf den richtigen Teil im Bild – Sie haben dafür nur **{sekunden} Sekunden**. **Achtung:** Bei einem Fehler oder wenn die Zeit abläuft, beginnen Sie wieder von vorn. Wenn alles richtig ist, bekommen Sie die Wörter für den Lückentext auf dem Arbeitsblatt.',
    teile: [
      { id: 'kehldeckel', name: 'Kehldeckel', frage: 'Wo ist der **Kehldeckel**?' },
      { id: 'kehlkopf', name: 'Kehlkopf', frage: 'Wo ist der **Kehlkopf**?' },
      { id: 'luftroehre', name: 'Luftröhre', frage: 'Wo ist die **Luftröhre**?' },
      { id: 'bronchus_re', name: 'rechter Hauptbronchus', frage: 'Wo ist der **rechte Hauptbronchus**?' },
      { id: 'bronchus_li', name: 'linker Hauptbronchus', frage: 'Wo ist der **linke Hauptbronchus**?' },
      { id: 'blaeschen', name: 'Lungenbläschen', frage: 'Wo sind die **Lungenbläschen**?' }
    ],
    tippRechtsLinks: 'Rechts und links gelten von der Person aus – nicht von Ihnen aus.',
    geschafft: 'Geschafft – alles richtig!',
    woerterKopf: 'Ihre Wörter für den Lückentext:',
    auftrag: '✍️ Tragen Sie diese Wörter in die Lücken im „Informationstext: Atemwege und Ventilation“ auf dem Arbeitsblatt ein.'
  },

  /* ---------- Blatt 3 · AA2 Lesetext „leicht oder schwer?“ ----------
     Analog steht der Text auf dem Arbeitsblatt, digital auf w4/verlegung.html (QR-Code, mit Bildern).
     Bewusst NICHT in der Reihenfolge der Tabelle (Husten · Sprechen und Atmen · weitere Zeichen · So handle ich)
     und mit Angaben, die nicht in die Tabelle gehören (Absatz 1). */
  verlegung: {
    titel: 'Wenn etwas im Hals stecken bleibt',
    absaetze: [
      'Beim Essen und Trinken kann sich jeder Mensch verschlucken. Ältere Menschen verschlucken sich öfter – zum Beispiel bei einer Parkinson-Krankheit, nach einem Schlaganfall oder mit einer schlecht sitzenden Zahnprothese. Auch wer beim Essen spricht oder lacht, verschluckt sich leichter. Man unterscheidet eine leichte und eine schwere Verlegung der Atemwege.',
      'Kann die Person nicht mehr sprechen, ist der Atemweg fast ganz oder ganz verschlossen. Das ist eine **schwere Verlegung**. Rufen Sie dann sofort laut um Hilfe und lassen Sie einen Notruf absetzen. Bleiben Sie bei der Person und handeln Sie sofort. Viele Betroffene greifen sich mit beiden Händen an den Hals. Sie atmen kaum noch – manchmal hört man nur ein leises Pfeifen. Ihr Husten wird schwach und leise oder hört ganz auf.',
      'Bei einer **leichten Verlegung** bekommt die Person noch Luft. Ihr Gesicht ist vom Husten oft rot. Sie kann sprechen, zum Beispiel: „Geht schon!“ Sie hustet kräftig und laut. Kräftiges Husten ist das beste Mittel, um den Fremdkörper herauszubringen. Fordern Sie die Person deshalb auf, weiter zu husten. Bleiben Sie bei ihr und beobachten Sie sie genau. Geben Sie nichts zu trinken und klopfen Sie nicht auf den Rücken – das stört den Husten.',
      'Eine leichte Verlegung kann schnell zu einer schweren werden, zum Beispiel wenn der Husten schwächer wird. Achten Sie deshalb die ganze Zeit auf Husten, Sprechen und Atmung. Blaue Lippen (Zyanose) zeigen sich erst spät, wenn schon viel Sauerstoff fehlt. Warten Sie nicht darauf! Ohne Hilfe wird die Person nach wenigen Minuten bewusstlos.'
    ],
    // Bilder nur auf der Handy-Seite: nach Absatz (Index) → Bild
    bilder: [
      { nach: 1, bild: 'schwer', text: 'Kann nicht sprechen, greift sich an den Hals' },
      { nach: 2, bild: 'leicht', text: 'Hustet kräftig und sagt: „Geht schon!“' },
      { nach: 3, bild: 'lippen', text: 'Die Lippen werden erst spät blau.' }
    ],
    auftrag: '✍️ Tragen Sie die Informationen in Stichworten in die Tabelle auf dem Arbeitsblatt ein. Achtung: Nicht alles im Text gehört in die Tabelle.'
  },

  /* ---------- Blatt 3 · Schon fertig? „Atemweg-Check“ ---------- */
  atemweg: {
    titel: 'Atemweg-Check',
    einleitung: 'Sechs kurze Fragen zu Atemwegen und Sauerstoffmangel. Tippen Sie an – Sie sehen sofort, ob es stimmt.',
    karten: [
      { typ: 'reihe', text: 'Tippen Sie den Weg der Luft in der richtigen Reihenfolge an.', teile: ['Nase oder Mund', 'Rachen', 'Kehlkopf', 'Luftröhre', 'Hauptbronchus', 'Lungenbläschen'], erklaerung: 'Nase oder Mund → Rachen → Kehlkopf → Luftröhre → Hauptbronchus → Bronchien → Lungenbläschen (Gasaustausch).' },
      { typ: 'wahl', text: 'Was verschließt beim Schlucken die Luftröhre?', optionen: ['die Zunge', 'der Kehldeckel', 'das Zwerchfell'], richtig: 1, erklaerung: 'Beim Schlucken hebt sich der Kehlkopf, der Kehldeckel legt sich über den Eingang der Luftröhre.' },
      { typ: 'wahl', text: 'Bei Erwachsenen rutschen Fremdkörper häufiger in den …', optionen: ['rechten Hauptbronchus', 'linken Hauptbronchus'], richtig: 0, erklaerung: 'Der rechte Hauptbronchus ist kürzer, weiter und verläuft steiler.' },
      { typ: 'reihe', text: 'Die Atemwege sind ganz verlegt. Was passiert? Tippen Sie in der richtigen Reihenfolge.', teile: ['keine Luft in die Lunge', 'Sauerstoff im Blut sinkt', 'Bewusstlosigkeit', 'Kreislaufstillstand'], erklaerung: 'Ohne Ventilation kein Sauerstoff im Blut (Hypoxie) → das Gehirn versagt zuerst (Bewusstlosigkeit) → Kreislaufstillstand – innerhalb weniger Minuten.' },
      { typ: 'wahl', text: 'Welches Organ ist bei Sauerstoffmangel am empfindlichsten?', optionen: ['die Haut', 'die Muskeln', 'das Gehirn'], richtig: 2, erklaerung: 'Gehirnzellen können schon nach wenigen Minuten ohne Sauerstoff bleibend geschädigt werden.' },
      { typ: 'wahl', text: 'Woran erkennen Sie sicher, dass noch Luft durch die Atemwege strömt?', optionen: ['Die Person kann sprechen oder kräftig husten', 'Die Lippen sind noch rosig', 'Die Person sitzt aufrecht'], richtig: 0, erklaerung: 'Sprechen und kräftiges Husten gehen nur mit Luft. Rosige Lippen schließen eine schwere Verlegung nicht aus – die Zyanose kommt erst später.' }
    ]
  }
};

if (typeof module !== 'undefined') module.exports = W4;

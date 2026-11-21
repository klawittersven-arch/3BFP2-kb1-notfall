/* Texte der Arbeitsblätter KB I, Woche 4 (SW 9): Wirbelsäulenverletzung, innere Blutung, Atemwege.
   Layout und Lehrerversion: werkzeuge/ab_w4.js. Messkarten, Simulationsszenen und Handy-Übungen: docs/w4/inhalte.js.
   **Wort** = fett. In Merksätzen: { l: 'Wort' } = fett gedrucktes Schlüsselwort. */
'use strict';

const LINK_BASIS = 'klawittersven-arch.github.io/3BFP2-kb1-notfall/';
const FUSS = 'KB I · Woche 4 · Was man nicht sieht';
const THEMA = 'Themenblock 2 - Thema: Wirbelsäule, innere Blutung, Atemwege';

/* ===================== Blatt 1 ===================== */
const B1 = {
  kopf: 'Wirbelsäulenverletzung: nicht bewegen – aber richtig',
  lernziel: 'Sie erkennen Hinweise auf eine Wirbelsäulenverletzung, begründen, warum die Person nicht bewegt wird, und erklären, wie die Höhe der Verletzung die Ausfälle bestimmt.',
  fall: [
    'Sie sind Auszubildende bzw. Auszubildender im Seniorenzentrum „Am Schlossberg“. Herr Ernst Pfeiffer ist 79 Jahre alt. Er hat einen Diabetes mellitus Typ 2 und trägt eine Brille. Um 11:40 Uhr hören Sie im Treppenhaus einen lauten Schlag. Herr Pfeiffer liegt auf dem Rücken am Fuß der Treppe. Er ist rückwärts sechs Stufen hinuntergestürzt und mit dem Kopf gegen die Wand geprallt. Seine Brille ist zerbrochen. Am linken Ellenbogen hat er eine kleine Schürfwunde.',
    'Herr Pfeiffer ist wach und weiß, wo er ist. Er sagt: „Mein Nacken tut so weh. Und meine Hände kribbeln, beide.“ Die Finger der rechten Hand kann er kaum bewegen. Seine Beine kann er bewegen. Dann ruft er: „Helfen Sie mir hoch, ich muss zum Mittagessen!“ Eine Kollegin holt die Pflegefachkraft und setzt den Notruf ab.'
  ],
  aa1: {
    text: 'Lesen Sie den Fall. Unterstreichen Sie alle **Hinweise auf eine Wirbelsäulenverletzung**. Tragen Sie sie mit Zeilennummer in die Tabelle ein. Achtung: Nicht alles im Fall ist ein Hinweis!',
    // Spalten bewusst NICHT in der Reihenfolge des Falls (dort: Unfallhergang → Schmerzen → Ausfälle),
    // damit die SuS jede Information selbst zuordnen müssen.
    spalten: ['Ausfälle (Gefühl und Bewegung)', 'Unfallhergang', 'Schmerzen'],
    // Lösung je Spalte: [Text, Suchwort für die Zeilennummer]
    loesung: [
      [['Kribbeln in beiden Händen', 'Hände kribbeln'], ['Finger der rechten Hand kaum beweglich', 'Finger der rechten']],
      [['rückwärts sechs Stufen hinuntergestürzt', 'sechs Stufen'], ['mit dem Kopf gegen die Wand geprallt', 'gegen die Wand']],
      [['„Mein Nacken tut so weh.“', 'Nacken tut']]
    ],
    hinweis: 'Kein Hinweis (Ablenker): Diabetes, Brille, Schürfwunde, Mittagessen. Dass er die Beine bewegen kann, schließt eine Verletzung nicht aus.'
  },
  info: {
    kopf: 'Informationstext: Rückenmark und Höhe der Verletzung',
    absaetze: [
      'Die Wirbelsäule schützt das **Rückenmark**. Es leitet Signale zwischen Gehirn und Körper. Auf jeder Höhe gehen Nerven ab: für Atmung, Arme, Rumpf und Beine (Bild unten). Wird das Rückenmark verletzt, fallen **unterhalb der Verletzung** Bewegung und Gefühl aus: Lähmung, Kribbeln, Taubheit. **Je höher die Verletzung, desto mehr fällt aus.** Ist es nur **teilweise** verletzt, fällt nicht alles aus. Für die Höhe zählt die **höchste betroffene Stelle**: Hände betroffen → HWS.',
      'Ein **instabiler** Wirbelbruch kann das Rückenmark bei jeder Bewegung quetschen – zum Beispiel beim Aufsetzen oder Kopfdrehen. Die Folge: eine bleibende **Querschnittlähmung**. Auch wer Arme und Beine bewegen kann, kann so einen Bruch haben.',
      'Bei hohen Verletzungen fällt oft der **Sympathikus** aus: **neurogener Schock** (Blutdruck niedrig, Puls langsam, Haut warm).'
    ],
    quelle: 'Quelle: nach MSD Manual Profi-Ausgabe: Rückenmarkverletzungen; ERC-Leitlinien 2025, Erste Hilfe; sprachlich vereinfacht.',
    woerter: 'Wörterhilfe: HWS = Halswirbelsäule, BWS = Brustwirbelsäule, LWS = Lendenwirbelsäule · Rückenmark = Nervenstrang im Wirbelkanal · instabil = nicht fest · Querschnittlähmung = Lähmung unterhalb der Verletzung · Quelle: nach MSD Manual, ERC 2025, vereinfacht'
  },
  aa2: {
    text: 'Welche Höhe passt zu A, B und C? Buchstaben in die Tabelle schreiben.',
    faelle: [
      ['A', 'Frau Sander (30) ist vom Pferd gestürzt. Sie kann die Beine nicht bewegen. Arme und Hände funktionieren.'],
      ['B', 'Herr Lux (19) ist kopfüber ins flache Wasser gesprungen. Er kann Arme und Beine nicht bewegen. Er atmet selbst.'],
      ['C', 'Herr Kaiser (40) hatte einen Motorradunfall. Arme und Beine sind gelähmt. Er kann nicht selbst atmen.']
    ],
    hoehen: [
      ['HWS, sehr hoch', 'Arme, Beine **und die Atmung**', 'Tetraplegie mit Atemlähmung', 'C'],
      ['HWS', 'Arme, Hände – meist auch Beine', 'Tetraplegie', 'B'],
      ['BWS oder LWS', 'Beine (und Rumpf) – die Arme funktionieren', 'Paraplegie', 'A']
    ],
    pfeiffer: 'Und bei Herrn Pfeiffer? Höhe:',
    pfeifferLoesung: 'HWS – seine Hände sind betroffen, deren Nerven kommen aus dem Halsmark. Die Beine funktionieren noch, weil das Rückenmark nur teilweise verletzt ist.'
  },
  merksatz: [['Hinweise auf eine Wirbelsäulenverletzung: ', { l: 'Unfallhergang' }, ' (Sturz aus der Höhe, Kopfsprung, Verkehrsunfall), ', { l: 'Schmerzen in Nacken oder Rücken' }, ', ', { l: 'Kribbeln, Taubheit, Lähmung' }, '. Dann: ', { l: 'nicht bewegen' }, ', Person bitten, still zu liegen, ', { l: 'Kopf mit beiden Händen in der vorgefundenen Lage halten' }, ', nicht aufsetzen – sonst droht eine ', { l: 'Querschnittlähmung' }, ' (bei sehr hoher Verletzung auch Atemlähmung). Drehen nur, wenn es sein muss (z. B. Erbrechen): ', { l: 'achsengerecht mit mehreren Helfenden' }, '.']],
  aa3: {
    fortsetzung: 'Herr Pfeiffer sagt: „Mir ist so übel. Ich muss mich übergeben.“ Er muss auf die Seite gedreht werden – sonst kann er ersticken.',
    text: 'Herr Pfeiffer muss sich übergeben und auf die Seite gedreht werden – sonst kann er ersticken. Üben Sie **vier Runden** auf dem Boden oder auf der Isomatte (falls vorhanden), dann Rollen tauschen.',
    rollen: [
      ['① Patient/in', 'liegt auf dem Rücken, bleibt locker, hilft nicht mit.'],
      ['② Kopf', 'hält den Kopf mit beiden Händen seitlich fest. Kommando: „Auf drei: eins – zwei – drei.“'],
      ['③ Helfer/in', 'kniet seitlich, fasst Schulter und Hüfte, dreht auf Kommando langsam zu sich.'],
      ['④ Beobachter/in', 'prüft mit der Checkliste und gibt danach eine Rückmeldung.']
    ],
    checkliste: [
      'Kopf die ganze Zeit gehalten, ein Kommando',
      'alles dreht gleichzeitig (Baumstamm)',
      'Nacken nicht verdreht (Nase – Bauchnabel)',
      'Person angesprochen'
    ],
    sicherheit: 'Langsam und ohne Kraft üben. Wer Nacken- oder Rückenbeschwerden hat, übernimmt nicht die Rolle der liegenden Person.'
  },
  rahmen: 'Pflegefachpersonen leiten in lebensbedrohlichen Situationen Sofortmaßnahmen ein.',
  aufgaben: [
    {
      nr: '4.1', punkte: 2, zeilen: 9,
      text: 'Begründen Sie, warum Herr Pfeiffer möglichst nicht bewegt werden soll, und beschreiben Sie eine Maßnahme dazu.',
      hinweis: '(Hinweis: Beschreiben Sie, was Sie tun, statt Herrn Pfeiffer zu bewegen: Wie schützen Sie ihn in dieser Situation? Schreiben Sie genau, wie Sie es machen.)',
      loesung: [
        'Begründung: Der Sturz rückwärts von der Treppe mit Kopfanprall, die Nackenschmerzen und das Kribbeln in beiden Händen weisen auf eine Verletzung der Halswirbelsäule mit Beteiligung des Rückenmarks hin. Jede Bewegung (z. B. Aufsetzen, Kopf drehen) kann das Rückenmark (weiter) schädigen → bleibende Querschnittlähmung, bei hoher Verletzung Atemlähmung. (1 P.)',
        'Maßnahme, z. B.: Kopf mit beiden Händen in der vorgefundenen Lage halten; Herrn Pfeiffer bitten, still zu liegen, nicht aufsetzen oder aufstehen lassen; ansprechen und erklären. Lagewechsel nur, wenn unvermeidbar (z. B. Erbrechen), dann achsengerecht mit mehreren Helfenden. (1 P.; eine HWS-Orthese wird nicht erwartet)'
      ]
    }
  ],
  fertig: {
    digital: '**Schon fertig?** Rückenmark-Check: acht kurze Fälle am Handy – mit Rückmeldung.',
    analog: {
      frage: '**Schon fertig?** Herr Lux (19) aus AA2 hat einen Blutdruck von 85/50 mmHg und einen Puls von 52/min. Die Haut an seinen Beinen ist warm. Welcher Schock liegt vor? Erklären Sie den langsamen Puls.',
      loesung: 'Neurogener Schock: Durch die Verletzung des Rückenmarks fällt der Sympathikus aus. Die Gefäße werden weit, der Blutdruck fällt – und der Puls kann nicht steigen, er bleibt langsam.'
    }
  }
};

/* ===================== Blatt 2 ===================== */
const B2 = {
  kopf: 'Innere Blutung: den Verlauf im Blick',
  lernziel: 'Sie erkennen eine innere Blutung am Verlauf der Vitalzeichen. Sie entscheiden begründet, wann Sie weiter beobachten, nachmessen oder einen Notfall melden.',
  fall: [
    'Sie sind im Frühdienst auf der unfallchirurgischen Station eingesetzt und betreuen heute drei Patientinnen und Patienten.',
    'Finn Albers (17) ist gestern Abend mit dem Fahrrad gestürzt. Dabei hat ihn der Lenker in den linken Oberbauch getroffen. Dort hat er eine Prellmarke. Röntgen und Ultraschall in der Notaufnahme waren unauffällig. Er bleibt zur Beobachtung. Angeordnet ist: Vitalzeichen jede Stunde.',
    'Jana Kraus (24) wurde gestern am rechten Unterarm operiert.',
    'Herr Bernd Kurz (45) wurde vor zwei Tagen am Sprunggelenk operiert. Er geht mit Unterarmgehstützen und darf das Bein nicht belasten.'
  ],
  vielleicht: 'Vielleicht ist keiner ein Notfall – vielleicht mehrere.',
  aa1: {
    text: {
      analog: 'Allein (8 Minuten). Kreuzen Sie bei jeder Messung an, was Sie tun. Tragen Sie danach **Finns** Puls und Blutdruck in die Kurve ein.',
      digital: 'Scannen Sie den QR-Code. Am Handy kommen nacheinander **Messkarten**: Wählen Sie bei jeder Karte die Ampel. Bei **Finn**: Puls und Blutdruck in die Kurve eintragen. Am Ende: Ergebnis in die Tabelle übertragen.'
    },
    // Analoge Fassung: Ankreuz-Tabelle mit diesen Messkarten aus docs/w4/inhalte.js (Jana fehlt bewusst – sie kommt in 2.3)
    karten: [1, 3, 5, 6],
    loesungAnalog: [
      '**06:00 Finn: 🟢** – alle Werte normal (Schockindex 0,6); Schmerz an der Prellung ist nach dem Sturz zu erwarten. 🔴 wäre zu früh.',
      '**06:30 Herr Kurz: 🟡** – Puls und Atmung sind direkt nach dem Gehen erhöht, das ist erklärbar: nach 5 Minuten Ruhe nachmessen (dann Puls 84/min, alles normal). 🔴 wäre ein Fehlalarm.',
      '**07:00 Finn: 🟡** – Werte noch im Normbereich, aber der Puls ist in einer Stunde um 12 gestiegen und der Abstand der Blutdruckwerte ist kleiner geworden: in 15–20 Minuten nachmessen, Pflegefachkraft informieren, noch nichts essen lassen. 🔴 wäre zu früh.',
      '**07:20 Finn: 🔴** – Puls steigt weiter (76 → 88 → 104/min), Abstand der Blutdruckwerte 46 → 40 → 30 mmHg, dazu blass, kühle Hände, Durst und Schmerz in der linken Schulter (Milz). Notfall – obwohl der Schockindex erst 0,9 ist.'
    ],
    regel: '🏆 **Gewonnen:** Finn rechtzeitig gemeldet **und** höchstens **ein Fehlalarm** (🔴 ohne Notfall).',
    handy: '**Frühdienst mit Ampel:** QR-Code scannen und starten. Am Ende sehen Sie, ob Sie gewonnen haben.'
  },
  merksatz: [['Eine innere Blutung ist ', { l: 'nicht sichtbar' }, '. Ich achte auf den ', { l: 'Verlauf' }, ': Der ', { l: 'Puls steigt' }, ', der ', { l: 'Abstand zwischen oberem und unterem Blutdruckwert wird kleiner' }, ', dazu ', { l: 'Blässe, Durst, Unruhe, Bauchschmerz' }, ' – bei einer Milzverletzung oft ', { l: 'Schmerz in der linken Schulter' }, '. Junge Menschen ', { l: 'gleichen lange aus' }, ': Der Blutdruck fällt erst spät. Ein einzelner Wert sagt wenig – ', { l: 'Vorwert, Ursache und Beschwerden' }, ' gehören dazu. Einen Notfall melde ich ', { l: 'sofort' }, ' – nicht erst bei einem Schockindex über 1.']],
  woerter: 'Wörterhilfe: Milz = Organ im linken Oberbauch; sie blutet stark, wenn sie verletzt ist. Eine verletzte Milz kann auch erst Stunden oder Tage nach dem Unfall reißen · Prellmarke = Abdruck oder Bluterguss auf der Haut · Fehlalarm = Notfall gemeldet, obwohl keiner vorliegt',
  rahmen: 'Pflegefachpersonen schätzen akute Situationen anhand von Beobachtungen und Messwerten ein.',
  aufgaben: [
    {
      nr: '2.1', punkte: 3, zeilen: 4,
      vorsatz: 'Um 07:20 Uhr erheben Sie bei Finn: Puls 104/min (07:00 Uhr: 88/min; 06:00 Uhr: 76/min) · Blutdruck 118/88 mmHg (07:00 Uhr: 122/82; 06:00 Uhr: 124/78) · Atemfrequenz 22/min (06:00 Uhr: 16/min) · SpO₂ 98 % · Temperatur 36,8 °C · Blutzucker 96 mg/dl. Er ist blass, die Hände sind kühl. Am rechten Knie hat er eine kleine, trockene Schürfwunde. Er sagt: „Ich hab so Durst. Und meine linke Schulter tut komisch weh. Kann ich meine Mutter anrufen?“',
      text: 'Identifizieren Sie drei Befunde, die bei Finn auf eine innere Blutung hinweisen.',
      loesung: [
        'z. B. (je Befund 1 P., max. 3 P.; wer den Verlauf mit dem Vorwert nennt, zeigt das Verständnis am besten): Puls steigt von 76 über 88 auf 104/min (Kompensation durch den Sympathikus) · Abstand der Blutdruckwerte wird kleiner: 46 → 40 → 30 mmHg (systolisch sinkt, diastolisch steigt – die Gefäße werden eng) · Atemfrequenz steigt von 16 auf 22/min · blass, kühle Hände (Zentralisation) · Durst (Volumenmangel) · Schmerz in der linken Schulter (Hinweis auf Milzverletzung: Blut reizt das Zwerchfell) · Schockindex steigt von 0,6 auf 0,9.',
        'Kein Hinweis auf eine innere Blutung (0 P.): SpO₂ 98 %, Temperatur 36,8 °C und Blutzucker 96 mg/dl sind normal; die kleine, trockene Schürfwunde am Knie blutet nicht und erklärt keinen Volumenmangel; der Wunsch, die Mutter anzurufen, ist kein Krankheitszeichen.'
      ]
    },
    {
      nr: '2.2', punkte: 2, zeilen: 3,
      text: 'Begründen Sie, warum eine innere Blutung bei jungen Menschen oft erst spät erkannt wird.',
      loesung: [
        'Das Blut sammelt sich im Bauch und ist nicht sichtbar. (1 P.)',
        'Junge Menschen gleichen einen Blutverlust lange aus (Sympathikus: Puls ↑, Gefäße eng) – der Blutdruck bleibt fast normal und fällt erst spät (etwa ab 30 % Blutverlust). Außerdem kann eine verletzte Milz erst Stunden oder Tage später reißen. (1 P.)'
      ]
    },
    {
      nr: '2.3', punkte: 2, zeilen: 3,
      vorsatz: 'Jana Kraus um 06:10 Uhr: Puls 70/min, Blutdruck 96/58 mmHg (gestern 18 Uhr: 72/min, 98/60 mmHg). Ihre Haut ist warm und rosig. Sie fühlt sich wohl.',
      text: 'Beurteilen Sie, ob bei Jana Kraus ein Schock vorliegt.',
      hinweis: '(Beurteilen heißt: Liegt ein Schock vor – ja oder nein? Begründen Sie Ihre Antwort.)',
      loesung: [
        'Es liegt kein Schock vor. (1 P.)',
        'Begründung: Puls ruhig, Schockindex 70 : 96 ≈ 0,7, die Werte sind stabil wie gestern, die Haut ist warm und rosig, sie hat keine Beschwerden. Ein niedriger Blutdruck allein ist noch kein Schock – entscheidend sind Verlauf und Zeichen der Minderdurchblutung. (1 P.)'
      ]
    },
    {
      nr: '2.4', punkte: 1, zeilen: 2,
      text: 'Nennen Sie einen Befund, der bei einem neurogenen Schock anders wäre als bei Finn.',
      loesung: [
        'z. B. Puls langsam oder normal statt schnell (der Sympathikus fällt aus) · Haut unterhalb der Verletzung warm, trocken und rosig statt blass und kühl. (1 P.)'
      ]
    }
  ],
  fertig: {
    digital: '**Schon fertig?** Trend-Detektiv: fünf Verläufe am Handy lesen und mit der Ampel entscheiden.',
    analog: {
      frage: '**Schon fertig?** Frau Pohl (34) hat eine Beckenprellung. 08:00 Uhr: Puls 80/min, RR 120/80 mmHg · 08:30 Uhr: Puls 96/min, RR 116/84 mmHg · 09:00 Uhr: Puls 112/min, RR 108/88 mmHg, sie ist blass. Welche Ampel wählen Sie um 09:00 Uhr? Begründen Sie mit dem Verlauf.',
      loesung: '🔴 Notfall: Der Puls steigt schnell (80 → 96 → 112/min), der Abstand der Blutdruckwerte wird kleiner (40 → 32 → 20 mmHg), dazu Blässe → Verdacht auf eine innere Blutung; Schockindex 112 : 108 ≈ 1,0.'
    }
  }
};

/* ===================== Blatt 3 ===================== */
const B3 = {
  kopf: 'Atemwege: wenn etwas im Hals stecken bleibt',
  lernziel: 'Sie beschreiben den Weg der Luft und erklären, warum eine Verlegung der Atemwege lebensbedrohlich ist. Sie unterscheiden eine leichte von einer schweren Atemwegsverlegung.',
  leitfall: [
    'Frau Maler (71) ist seit gestern neu im Pflegeheim. Schülerin Christin berichtet: ',
    '„Beim Frühstück verschluckte sie sich am Kaffee und hustete kräftig. Ich ließ sie husten, und nach kurzer Zeit war alles wieder gut.“'
  ],
  leitfrage: 'War es richtig, Frau Maler einfach husten zu lassen?',
  leitfrageLoesung: 'Ja. Frau Maler hustete kräftig – eine leichte Verlegung. Richtig ist dann: zum Husten auffordern, bei ihr bleiben und beobachten. Nichts zu trinken geben, nicht auf den Rücken klopfen. Wäre der Husten schwach geworden, hätte Christin sofort Hilfe holen müssen.',
  aa1: {
    text: {
      analog: '**a) Selbstversuch:** Finger vorn auf den Hals legen und schlucken. Was spüren Sie? Geht schlucken und einatmen gleichzeitig? **b)** Text lesen, Bild beschriften.',
      digital: '**a) Selbstversuch:** Finger vorn auf den Hals legen und schlucken. Was spüren Sie? Geht schlucken und einatmen gleichzeitig? **b)** Scannen Sie den QR-Code und tippen Sie die Teile der Atemwege im Bild an. Bei einem Fehler beginnen Sie von vorn. **c)** Wenn alles richtig ist, bekommen Sie Wörter: Tragen Sie sie in die Lücken im Text ein.'
    },
    // Informationstext: docs/w4/inhalte.js (W4.atemwegeText) – analog mit fetten Fachwörtern, digital als Lückentext
    handy: '**Wo ist was? Die Atemwege:** sechs Fragen – tippen Sie die Teile im Bild an. Alles richtig → Sie bekommen die Wörter für den Lückentext.',
    // Reihenfolge bewusst gemischt: kein Begriff steht an der Stelle seiner Nummer im Bild
    wortspeicher: 'Wortspeicher: Lungenbläschen · linker Hauptbronchus · Kehlkopf · Luftröhre · Kehldeckel · rechter Hauptbronchus',
    begriffe: ['Kehldeckel', 'Kehlkopf', 'Luftröhre', 'rechter Hauptbronchus', 'linker Hauptbronchus', 'Lungenbläschen'],
    frageC: '**c)** Bei Erwachsenen rutschen Fremdkörper häufiger in den rechten Hauptbronchus. Warum?',
    loesungC: 'Der rechte Hauptbronchus ist kürzer, weiter und verläuft steiler – fast in Verlängerung der Luftröhre.',
    selbstversuch: 'Selbstversuch: Der Kehlkopf geht beim Schlucken nach oben, der Kehldeckel verschließt die Luftröhre. Schlucken und Einatmen gleichzeitig geht nicht.'
  },
  merksatz1: [['Beim Schlucken verschließt der ', { l: 'Kehldeckel' }, ' die Luftröhre. Fremdkörper rutschen eher in den ', { l: 'rechten Hauptbronchus' }, '. Atemweg verlegt → keine Luft in die ', { l: 'Lungenbläschen' }, ' → ', { l: 'Sauerstoffmangel (Hypoxie)' }, ': Zyanose, ', { l: 'Bewusstlosigkeit' }, ', ', { l: 'Kreislaufstillstand' }, ' – in ', { l: 'wenigen Minuten' }, '. Das ', { l: 'Gehirn' }, ' ist am empfindlichsten.']],
  aa2: {
    // Lesetext: docs/w4/inhalte.js (W4.verlegung) – analog auf dem Blatt, digital über QR-Code (w4/verlegung.html, mit Bildern).
    // Einen Merksatz 2 gibt es bewusst nicht mehr: Die gesicherte Tabelle ist die Zusammenfassung (sonst wird nur abgeschrieben).
    text: {
      analog: 'Allein (8 Minuten). Lesen Sie den Text. Tragen Sie die Informationen in Stichworten in die Tabelle ein. Achtung: Nicht alles im Text gehört in die Tabelle.',
      digital: 'Allein (8 Minuten). Scannen Sie den QR-Code und lesen Sie den Text am Handy. Tragen Sie die Informationen in Stichworten in die Tabelle ein. Achtung: Nicht alles im Text gehört in die Tabelle.'
    },
    handy: '**Text: Wenn etwas im Hals stecken bleibt** – mit Bildern. Lesen Sie in Ruhe (ein Handy für zwei reicht).',
    // Zeile: [Merkmal, leichte Verlegung, schwere Verlegung] – Lösung (Stichworte aus dem Text)
    zeilen: [
      ['Husten', 'kräftig und laut', 'schwach und leise oder hört ganz auf'],
      ['Sprechen und Atmen', 'kann sprechen („Geht schon!“), bekommt Luft', 'kann nicht sprechen, atmet kaum, evtl. leises Pfeifen'],
      ['weitere Zeichen', 'Gesicht vom Husten oft rot', 'greift sich mit beiden Händen an den Hals; spät: blaue Lippen (Zyanose), dann bewusstlos'],
      ['So handle ich', 'zum Husten auffordern, bleiben, genau beobachten; nichts zu trinken geben, nicht auf den Rücken klopfen', 'sofort laut um Hilfe rufen, Notruf absetzen lassen, bei der Person bleiben, sofort handeln']
    ],
    ergaenzung: 'Gehört nicht in die Tabelle: Absatz 1 (wer sich öfter verschluckt: Parkinson, Schlaganfall, Zahnprothese, Sprechen oder Lachen beim Essen). Kernsatz für die Sicherung: „Wer laut rufen kann, bekommt Luft. Nicht auf blaue Lippen warten!“'
  },
  fall: [
    'Sie sind Auszubildende bzw. Auszubildender in der Seniorenwohngruppe „Kastanienhof“. Herr Walter Roth (80) hat eine Parkinson-Krankheit; seine Hände zittern leicht, wie immer. Er trägt eine Brille. Beim Abendessen sitzt er am Tisch, trinkt Pfefferminztee und isst ein Wurstbrot. Am Nachbartisch lacht jemand laut. Plötzlich hustet Herr Roth kräftig und laut. Er hebt die Hand und sagt: „Geht schon …“ Nach etwa 20 Sekunden wird sein Husten leise und kraftlos. Herr Roth kann nicht mehr sprechen. Er greift sich mit beiden Händen an den Hals. Seine Lippen werden bläulich.'
  ],
  rahmen: 'Pflegefachpersonen erkennen Notfallsituationen und schätzen sie ein.',
  aufgaben: [
    {
      nr: '3.1', punkte: 2, zeilen: 8,
      text: 'Unterscheiden Sie anhand der Situation eine leichte von einer schweren Atemwegsverlegung.',
      loesung: [
        'Leichte Verlegung: kräftiger, wirksamer Husten, er kann sprechen und atmen – das trifft auf Herrn Roth zu Beginn zu (hustet kräftig und laut, sagt „Geht schon …“, Z. {Geht schon}). (1 P.)',
        'Schwere Verlegung: Husten leise und kraftlos, kann nicht sprechen, greift sich an den Hals, Lippen bläulich – das trifft nach etwa 20 Sekunden zu (Z. {kraftlos}–{bläulich}). (1 P.)',
        'Kein Merkmal einer Atemwegsverlegung (0 P.): Zittern der Hände (Parkinson, „wie immer“), Brille, Pfefferminztee, lautes Lachen am Nachbartisch. Hinweis: Die Parkinson-Krankheit erhöht das Risiko, sich zu verschlucken – sie ist aber kein Zeichen dafür, ob die Verlegung leicht oder schwer ist.'
      ]
    }
  ],
  // Für die Schnellen (ersetzt „Schon fertig?“ auf Blatt 3): Antworten auf ein Extrablatt
  schnelle: {
    kopf: '**Für die Schnellen** ✍️ Schreiben Sie Ihre Antworten auf ein Extrablatt.',
    aufgaben: [
    {
      nr: '3.2', punkte: 2, zeilen: 3,
      text: 'Erklären Sie, warum Herr Roth ohne Hilfe innerhalb weniger Minuten bewusstlos werden kann.',
      loesung: [
        'Der Bissen verlegt die Atemwege: Es kommt keine Luft mehr in die Lungenbläschen, kein Sauerstoff gelangt ins Blut (Hypoxie, Zyanose). (1 P.)',
        'Das Gehirn reagiert am empfindlichsten auf Sauerstoffmangel → Bewusstlosigkeit, danach Kreislaufstillstand – innerhalb weniger Minuten. (1 P.)'
      ]
    },
    {
      nr: '3.3', punkte: 2, zeilen: 3,
      text: 'Eine Pflegehelferin sagt: „Solange die Lippen nicht blau sind, ist es nicht schlimm.“ Beurteilen Sie die Aussage.',
      hinweis: '(Beurteilen heißt: Stimmt die Aussage oder stimmt sie nicht? Begründen Sie Ihre Antwort.)',
      loesung: [
        'Die Aussage ist falsch. (1 P.)',
        'Entscheidend sind Husten, Sprechen und Atmung: Kann die Person nicht mehr sprechen oder wirksam husten, ist es eine schwere Verlegung – auch mit rosigen Lippen. Die Zyanose ist ein spätes Zeichen; dann fehlt schon viel Sauerstoff. Deshalb sofort handeln. (1 P.)'
      ]
    },
      {
        nr: '3.4', nurAnalog: true,
        text: 'Warum soll man einer Person, die kräftig hustet, nichts zu trinken geben und nicht auf den Rücken klopfen? Begründen Sie.',
        loesung: ['Kräftiger Husten ist am wirksamsten – Klopfen stört ihn. Beim Trinken kann sich die Person noch einmal verschlucken, Flüssigkeit kann in die Atemwege gelangen. Richtig: zum Husten auffordern, bleiben, beobachten.']
      }
    ],
    // nur digitale Fassung: zwei Handy-Übungen
    atemweg: '**Atemweg-Check:** sechs kurze Fragen am Handy – mit Rückmeldung.',
    speisesaal: '**Notfall-Ampel im Speisesaal** (zu zweit): sechs Szenen. **Bestanden:** niemand bewusstlos, höchstens **ein Fehlalarm**.'
  }
};

module.exports = { LINK_BASIS, FUSS, THEMA, B1, B2, B3 };

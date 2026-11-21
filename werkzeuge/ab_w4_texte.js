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
    spalten: ['Unfallhergang', 'Schmerzen', 'Ausfälle (Gefühl und Bewegung)'],
    // Lösung: [Text, Suchwort für die Zeilennummer]
    loesung: [
      [['rückwärts sechs Stufen hinuntergestürzt', 'sechs Stufen'], ['mit dem Kopf gegen die Wand geprallt', 'gegen die Wand']],
      [['„Mein Nacken tut so weh.“', 'Nacken tut']],
      [['Kribbeln in beiden Händen', 'Hände kribbeln'], ['Finger der rechten Hand kaum beweglich', 'Finger der rechten']]
    ],
    hinweis: 'Kein Hinweis (Ablenker): Diabetes, Brille, Schürfwunde, Mittagessen. Dass er die Beine bewegen kann, schließt eine Verletzung nicht aus.'
  },
  info: {
    kopf: 'Informationstext: Rückenmark und Höhe der Verletzung',
    absaetze: [
      'Die Wirbelsäule schützt das **Rückenmark**. Es leitet Signale zwischen Gehirn und Körper. Auf jeder Höhe gehen Nerven ab: für Atmung, Arme, Rumpf und Beine (Bild unten). Wird das Rückenmark verletzt, fallen **unterhalb der Verletzung** Bewegung und Gefühl aus: Lähmung, Kribbeln, Taubheit. **Je höher die Verletzung, desto mehr fällt aus.**',
      'Ein **instabiler** Wirbelbruch kann das Rückenmark bei jeder Bewegung quetschen – zum Beispiel beim Aufsetzen oder Kopfdrehen. Die Folge: eine bleibende **Querschnittlähmung**. Auch wer Arme und Beine bewegen kann, kann so einen Bruch haben.',
      'Bei hohen Verletzungen fällt oft der **Sympathikus** aus: **neurogener Schock** (Blutdruck niedrig, Puls langsam, Haut warm).'
    ],
    quelle: 'Quelle: nach MSD Manual Profi-Ausgabe: Rückenmarkverletzungen; ERC-Leitlinien 2025, Erste Hilfe; sprachlich vereinfacht.',
    woerter: 'Wörterhilfe: HWS = Halswirbelsäule, BWS = Brustwirbelsäule, LWS = Lendenwirbelsäule · Rückenmark = Nervenstrang im Wirbelkanal · instabil = nicht fest, kann sich verschieben · Querschnittlähmung = Lähmung unterhalb der Verletzung · Quelle: nach MSD Manual, ERC 2025, vereinfacht'
  },
  aa2: {
    text: 'Welche Höhe passt zu A, B und C? Schreiben Sie den Buchstaben in die Tabelle.',
    faelle: [
      ['A', 'Frau Sander (30) ist vom Pferd gestürzt. Sie kann die Beine nicht bewegen. Arme und Hände funktionieren.'],
      ['B', 'Herr Lux (19) ist kopfüber ins flache Wasser gesprungen. Er kann Arme und Beine nicht bewegen. Er atmet selbst.'],
      ['C', 'Herr Kaiser (40) hatte einen Motorradunfall. Arme und Beine sind gelähmt. Er kann nicht selbst atmen.']
    ],
    hoehen: [
      ['HWS, sehr hoch', 'Arme, Beine **und die Atmung**', 'Tetraplegie mit Atemlähmung', 'C'],
      ['HWS', 'Arme (ganz oder teilweise) und Beine', 'Tetraplegie', 'B'],
      ['BWS oder LWS', 'Beine (und Rumpf) – die Arme funktionieren', 'Paraplegie', 'A']
    ],
    pfeiffer: 'Und bei Herrn Pfeiffer? Höhe:',
    pfeifferLoesung: 'HWS'
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
      nr: '4.1', punkte: 2, zeilen: 4,
      text: 'Begründen Sie, warum Herr Pfeiffer möglichst nicht bewegt werden soll, und beschreiben Sie eine Maßnahme dazu.',
      loesung: [
        'Begründung: Der Sturz rückwärts von der Treppe mit Kopfanprall, die Nackenschmerzen und das Kribbeln in beiden Händen weisen auf eine Verletzung der Halswirbelsäule mit Beteiligung des Rückenmarks hin. Jede Bewegung (z. B. Aufsetzen, Kopf drehen) kann das Rückenmark (weiter) schädigen → bleibende Querschnittlähmung, bei hoher Verletzung Atemlähmung. (1 P.)',
        'Maßnahme, z. B.: Kopf mit beiden Händen in der vorgefundenen Lage halten; Herrn Pfeiffer bitten, still zu liegen, nicht aufsetzen oder aufstehen lassen; ansprechen und erklären. Lagewechsel nur, wenn unvermeidbar (z. B. Erbrechen), dann achsengerecht mit mehreren Helfenden. (1 P.; eine HWS-Orthese wird nicht erwartet)'
      ]
    },
    {
      nr: '4.2', punkte: 2, zeilen: 3,
      text: 'Ihre Kollegin sagt: „Er kann doch die Beine bewegen. Dann ist die Wirbelsäule nicht verletzt.“ Beurteilen Sie die Aussage.',
      loesung: [
        'Die Aussage ist falsch. (1 P.)',
        'Unfallhergang und Nackenschmerz reichen für den Verdacht. Ein instabiler Wirbelbruch kann das Rückenmark erst bei einer Bewegung verletzen. Außerdem zeigen die Hände schon Ausfälle (Kribbeln, Schwäche). Deshalb trotzdem nicht bewegen. (1 P.)'
      ]
    }
  ],
  fertig: '**Schon fertig?** Rückenmark-Check: acht kurze Fälle am Handy – mit Rückmeldung.'
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
    text: 'Ihre Lehrkraft zeigt **Messkarten** – oder Sie spielen am **Handy** (QR-Code unten). Bei jeder Karte: **1.** Werte lesen und mit dem Vorwert vergleichen. **2.** Schockindex rechnen (Puls : systolischer Blutdruck). **3.** Ampel wählen und in die Tabelle schreiben. Bei **Finn**: Puls und Blutdruck in die Kurve eintragen.',
    regel: '🏆 **Gewonnen:** Finn rechtzeitig gemeldet **und** höchstens **ein Fehlalarm** (🔴 ohne Notfall).',
    handy: '**Handy-Fassung** (nur wenn Ihre Lehrkraft es sagt): QR-Code scannen. Die Karten kommen von selbst – 40 Sekunden pro Karte.'
  },
  merksatz: [['Eine innere Blutung ist ', { l: 'nicht sichtbar' }, '. Ich achte auf den ', { l: 'Verlauf' }, ': Der ', { l: 'Puls steigt' }, ', der ', { l: 'Abstand zwischen oberem und unterem Blutdruckwert wird kleiner' }, ', dazu ', { l: 'Blässe, Durst, Unruhe, Bauchschmerz' }, ' – bei einer Milzverletzung oft ', { l: 'Schmerz in der linken Schulter' }, '. Junge Menschen ', { l: 'gleichen lange aus' }, ': Der Blutdruck fällt erst spät. Ein einzelner Wert sagt wenig – ', { l: 'Vorwert, Ursache und Beschwerden' }, ' gehören dazu. Einen Notfall melde ich ', { l: 'sofort' }, ' – nicht erst bei einem Schockindex über 1.']],
  woerter: 'Wörterhilfe: Milz = Organ im linken Oberbauch; sie blutet stark, wenn sie verletzt ist. Eine verletzte Milz kann auch erst Stunden oder Tage nach dem Unfall reißen · Prellmarke = Abdruck oder Bluterguss auf der Haut · Fehlalarm = Notfall gemeldet, obwohl keiner vorliegt',
  rahmen: 'Pflegefachpersonen schätzen akute Situationen anhand von Beobachtungen und Messwerten ein.',
  aufgaben: [
    {
      nr: '2.1', punkte: 3, zeilen: 4,
      vorsatz: 'Um 07:20 Uhr messen Sie bei Finn: Puls 104/min, Blutdruck 118/88 mmHg (07:00 Uhr: 88/min, 122/82 mmHg; 06:00 Uhr: 76/min, 124/78 mmHg). Er ist blass, die Hände sind kühl. Er sagt: „Ich hab so Durst. Und meine linke Schulter tut komisch weh.“',
      text: 'Identifizieren Sie drei Befunde, die bei Finn auf eine innere Blutung hinweisen. Berücksichtigen Sie die Vorwerte.',
      loesung: [
        'z. B. (je Befund mit Vorwert bzw. Zuordnung 1 P., max. 3 P.): Puls steigt von 76 über 88 auf 104/min (Kompensation durch den Sympathikus) · Abstand der Blutdruckwerte wird kleiner: 46 → 40 → 30 mmHg (systolisch sinkt, diastolisch steigt – die Gefäße werden eng) · blass, kühle Hände (Zentralisation) · Durst (Volumenmangel) · Schmerz in der linken Schulter (Hinweis auf Milzverletzung: Blut reizt das Zwerchfell) · Schockindex steigt von 0,6 auf 0,9.'
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
  fertig: '**Schon fertig?** Trend-Detektiv: fünf Verläufe am Handy lesen und mit der Ampel entscheiden.'
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
    text: '**a) Selbstversuch:** Finger vorn auf den Hals legen und schlucken. Was spüren Sie? Geht schlucken und einatmen gleichzeitig? **b)** Text lesen, Bild beschriften.',
    info: [
      'Die Luft strömt durch Nase oder Mund in den **Rachen**. Hier kreuzen sich Luftweg und Speiseweg. Beim Schlucken hebt sich der **Kehlkopf**, der **Kehldeckel** verschließt die **Luftröhre** – die Nahrung rutscht in die Speiseröhre. Gerät doch etwas in den Kehlkopf, muss man kräftig husten (**Hustenreflex**).',
      'Die Luftröhre teilt sich in den **rechten** und den **linken Hauptbronchus**. Der rechte ist kürzer, weiter und verläuft steiler. In den **Lungenbläschen** geht Sauerstoff ins Blut. Das Ein- und Ausatmen heißt **Ventilation**.'
    ],
    wortspeicher: 'Wortspeicher: Kehldeckel · Kehlkopf · Luftröhre · rechter Hauptbronchus · linker Hauptbronchus · Lungenbläschen',
    begriffe: ['Kehldeckel', 'Kehlkopf', 'Luftröhre', 'rechter Hauptbronchus', 'linker Hauptbronchus', 'Lungenbläschen'],
    frageC: '**c)** Bei Erwachsenen rutschen Fremdkörper häufiger in den rechten Hauptbronchus. Warum?',
    loesungC: 'Der rechte Hauptbronchus ist kürzer, weiter und verläuft steiler – fast in Verlängerung der Luftröhre.',
    selbstversuch: 'Selbstversuch: Der Kehlkopf geht beim Schlucken nach oben, der Kehldeckel verschließt die Luftröhre. Schlucken und Einatmen gleichzeitig geht nicht.'
  },
  merksatz1: [['Beim Schlucken verschließt der ', { l: 'Kehldeckel' }, ' die Luftröhre. Fremdkörper rutschen eher in den ', { l: 'rechten Hauptbronchus' }, '. Atemweg verlegt → keine Luft in die ', { l: 'Lungenbläschen' }, ' → ', { l: 'Sauerstoffmangel (Hypoxie)' }, ': Zyanose, ', { l: 'Bewusstlosigkeit' }, ', ', { l: 'Kreislaufstillstand' }, ' – in ', { l: 'wenigen Minuten' }, '. Das ', { l: 'Gehirn' }, ' ist am empfindlichsten.']],
  aa2: {
    text: 'Ein Handy für zwei. **Danach:** Füllen Sie die Tabelle aus.',
    handy: 'Sechs Szenen. **Bestanden:** niemand bewusstlos, höchstens **ein Fehlalarm**. **Ohne Handy:** Ihre Lehrkraft liest vor, Sie zeigen 1–4 Finger.',
    zeilen: [
      ['Husten', 'kräftig, wirksam', 'schwach, leise, unwirksam – oder gar kein Husten'],
      ['Sprechen und Atmen', 'kann sprechen (auch rufen) und atmen', 'kann nicht oder nur einzelne Wörter sprechen; kaum oder keine Atmung, evtl. Pfeifen'],
      ['weitere Zeichen', 'Gesicht oft rot', 'Griff an den Hals, Angst; später Zyanose, dann Bewusstlosigkeit'],
      ['So handle ich', 'zum Husten auffordern, bleiben, beobachten – nichts zu trinken geben, nicht klopfen', 'sofort laut Hilfe rufen, Notruf veranlassen, nicht allein lassen, sofort handeln']
    ]
  },
  merksatz2: [[{ l: 'Leichte Verlegung' }, ': ', { l: 'kräftiger, wirksamer Husten' }, ', kann ', { l: 'sprechen und atmen' }, ' → ', { l: 'zum Husten auffordern' }, ', bleiben, beobachten. ', { l: 'Schwere Verlegung' }, ': Husten ', { l: 'schwach oder fehlt' }, ', ', { l: 'kann nicht sprechen' }, ', kaum Atmung, Griff an den Hals, später Zyanose → ', { l: 'sofort Hilfe rufen und handeln' }, '. Nicht auf ', { l: 'blaue Lippen' }, ' warten! Wer laut rufen kann, bekommt Luft.']],
  fall: [
    'Sie sind Auszubildende bzw. Auszubildender in der Seniorenwohngruppe „Kastanienhof“. Herr Walter Roth (80) sitzt beim Abendessen am Tisch und isst ein Wurstbrot. Plötzlich hustet er kräftig und laut. Er hebt die Hand und sagt: „Geht schon …“ Nach etwa 20 Sekunden wird sein Husten leise und kraftlos. Herr Roth kann nicht mehr sprechen. Er greift sich mit beiden Händen an den Hals. Seine Lippen werden bläulich.'
  ],
  rahmen: 'Pflegefachpersonen erkennen Notfallsituationen und schätzen sie ein.',
  aufgaben: [
    {
      nr: '3.1', punkte: 2, zeilen: 3,
      text: 'Unterscheiden Sie anhand der Situation eine leichte von einer schweren Atemwegsverlegung.',
      loesung: [
        'Leichte Verlegung: kräftiger, wirksamer Husten, er kann sprechen und atmen – das trifft auf Herrn Roth zu Beginn zu (hustet kräftig und laut, sagt „Geht schon …“, Z. {Geht schon}). (1 P.)',
        'Schwere Verlegung: Husten leise und kraftlos, kann nicht sprechen, greift sich an den Hals, Lippen bläulich – das trifft nach etwa 20 Sekunden zu (Z. {kraftlos}–{bläulich}). (1 P.)'
      ]
    },
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
      loesung: [
        'Die Aussage ist falsch. (1 P.)',
        'Entscheidend sind Husten, Sprechen und Atmung: Kann die Person nicht mehr sprechen oder wirksam husten, ist es eine schwere Verlegung – auch mit rosigen Lippen. Die Zyanose ist ein spätes Zeichen; dann fehlt schon viel Sauerstoff. Deshalb sofort handeln. (1 P.)'
      ]
    }
  ],
  fertig: '**Schon fertig?** Atemweg-Check: sechs kurze Fragen am Handy – mit Rückmeldung.'
};

module.exports = { LINK_BASIS, FUSS, THEMA, B1, B2, B3 };

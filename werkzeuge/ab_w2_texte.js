/* Woche 2 (SW 7) – gemeinsame Texte für Arbeitsblatt, Anlagen und Lehrerversion.
   Die Merksätze stehen auch in docs/inhalte.js (App); tests/inhalte.test.js prüft, dass beide übereinstimmen.
   Schreibweise: **fett**; Lücken im Merksatz als { l: 'Lösung' }. */
'use strict';

const LINK_BASIS = 'klawittersven-arch.github.io/3BFP2-kb1-notfall/';

// Nur noch drei QR-Codes im Arbeitsblatt: Stunden-App (Seite 1, Ersatz für den QR-Code am Beamer),
// Hausaufgabe (Selbstkontrolle) und Nachlesen (letzte Seite, während der Stunde gesperrt).
const SEITEN = {
  stunde: 'w2.html',
  transfer: 'w2-transfer.html',
  nachlesen: 'w2-nachlesen.html'
};

const MERKSAETZE = {
  aa1: ['Ein Schock zeigt sich an den Zeichen des ', { l: 'Kreislaufs' }, ': Puls, Blutdruck, Haut und Bewusstsein. Die Schockform erkenne ich an der ', { l: 'Ursache' }, ' und an den ', { l: 'Begleitzeichen' }, ', z. B. Quaddeln oder Lähmungen.'],
  aa2: ['Bei allen drei Schockformen ', { l: 'fällt' }, ' der Blutdruck, und die Organe werden schlecht durchblutet. Beim neurogenen Schock fällt der ', { l: 'Sympathikus' }, ' aus: Der Puls ist ', { l: 'langsam' }, ' oder normal, und die Haut ist ', { l: 'warm' }, ' und trocken.'],
  aa3: ['Die Lagerung richtet sich nach dem ', { l: 'Leitsymptom' }, ', nicht nach der Schockform: Atemnot → ', { l: 'Oberkörper hoch' }, '; Schockzeichen ohne Atemnot → ', { l: 'flach, Beine hoch' }, '; bewusstlos mit normaler Atmung → ', { l: 'stabile Seitenlage' }, '; Verdacht auf Wirbelsäulenverletzung → ', { l: 'nicht bewegen' }, '.'],
  aa4: ['Anaphylaxie: Allergen ', { l: 'stoppen' }, ', Hilfe holen, lagern nach ', { l: 'Leitsymptom' }, ', ', { l: 'Adrenalin' }, ' i. m. nach Anordnung oder SOP, überwachen und ', { l: 'dokumentieren' }, '.']
};

/* ---------- Fallbeispiele der Expertengruppen (Klausurstil: Fließtext, Werte mit Vorwert) ---------- */
const EXPERTEN = {
  a: {
    buchstabe: 'A',
    form: 'Hypovolämischer Schock',
    person: 'Herrn Albrecht',
    fall: [
      'Herr Gerhard Albrecht (81) lebt seit vier Jahren im Pflegeheim „Am Kocherufer“. Wegen eines Vorhofflimmerns nimmt er einen Gerinnungshemmer. Er hört schlecht und trägt deshalb zwei Hörgeräte. Am Vormittag hatte er schwarzen, klebrigen Stuhlgang. Danach hat er mit seinem Zimmernachbarn Karten gespielt.',
      'Als Sie ihn um 11:30 Uhr zum Mittagessen an die Bettkante setzen wollen, sagt er: „Mir wird ganz schwarz vor Augen.“ Er ist blass, seine Stirn ist kalt und feucht. Auf seinem Nachttisch steht ein Foto seiner Enkelin. Mehrmals bittet er um etwas zu trinken. Er wirkt unruhig und fragt, wo seine Frau sei, obwohl er sonst gut orientiert ist. Sie messen: Puls 116/min, Blutdruck 98/72 mmHg, Atemfrequenz 24/min. Bei der Morgenrunde lagen die Werte bei Puls 78/min und Blutdruck 145/85 mmHg. Seine Tochter hat sich für den Nachmittag zum Besuch angemeldet.'
    ],
    // Ohne Überschriften und nicht in der Reihenfolge der Vergleichstabelle: Die SuS ordnen selbst zu.
    info: [
      'Bei einem hypovolämischen Schock hat die Person meist einen schnellen, schwachen Puls und eine blasse, kalte, schweißige Haut. Viele haben großen Durst, sind unruhig, ängstlich oder plötzlich verwirrt, atmen schnell und scheiden wenig Urin aus. Der Blutdruck fällt oft erst spät – aussagekräftig ist der Vergleich mit dem Vorwert (Schockindex).',
      'Pflegefachpersonen behalten vor allem im Blick, wo Blut verloren gehen könnte (Stuhl, Erbrochenes, Verband, Drainage). Sie kontrollieren Puls und Blutdruck im Verlauf, das Bewusstsein und die Urinausscheidung.',
      'Ausgelöst wird der hypovolämische Schock durch einen Verlust von Blut oder Flüssigkeit: durch eine Blutung – sichtbar nach außen oder verborgen im Körper wie bei einer Magen-Darm-Blutung –, durch Verbrennungen oder durch starken Durchfall und Erbrechen. Gerinnungshemmer erhöhen das Blutungsrisiko. Schwarzer, klebriger Stuhl (Teerstuhl) weist auf eine Blutung im Magen oder Zwölffingerdarm hin.',
      'Im Notfall: Hilfe holen, Ärztin oder Arzt informieren; die Person nicht aufsetzen oder aufstehen lassen; flach lagern, Beine hoch (wenn keine Atemnot); Wärme erhalten; nichts essen oder trinken lassen (mögliche Untersuchung oder Operation); engmaschig überwachen. Volumen gibt es nur nach ärztlicher Anordnung.',
      'Im Körper läuft dabei eine Kette ab: Weniger Volumen → weniger Blut fließt zum Herzen zurück → das Herz kann weniger auswerfen (das Schlagvolumen sinkt) → der Blutdruck droht zu fallen. Der Sympathikus gleicht aus: Der Puls steigt, die Gefäße in Haut, Muskeln, Niere und Darm verengen sich (Zentralisation, siehe Woche 1). Hält der Verlust an, gerät der Körper in die Schockspirale.'
    ],
    woerter: 'hypovolämisch = mit zu wenig Volumen | Teerstuhl = schwarzer Stuhl durch verdautes Blut | Zentralisation = Umverteilung des Blutes zu Gehirn und Herz',
    adjektiv: 'hypovolämischer',
    karte: {
      ursache: 'Blutverlust: Magen-Darm-Blutung (Teerstuhl) unter Gerinnungshemmer',
      entstehung: 'Volumen ↓ → Rückstrom zum Herzen ↓ → Schlagvolumen und Blutdruck ↓ → Sympathikus: Puls ↑, Zentralisation',
      zeichen: 'Puls schnell (116/min) · Haut blass, kalt, schweißig · Durst, Unruhe, Verwirrtheit, schnelle Atmung, Schwindel',
      nur: 'sichtbarer oder verborgener Blutverlust (hier Teerstuhl); starker Durst',
      achten: 'Blutungsquelle, Puls und Blutdruck im Verlauf (Schockindex ≈ 1,2), Bewusstsein, Urin',
      erstes: 'Hilfe holen, Ärztin informieren; flach, Beine hoch (keine Atemnot); nicht aufsetzen; Wärme; nüchtern lassen; überwachen'
    }
  },
  b: {
    buchstabe: 'B',
    form: 'Anaphylaktischer Schock',
    person: 'Mia',
    fall: [
      'Mia (19) ist Auszubildende im ersten Ausbildungsdrittel und mit Ihnen auf einer internistischen Station eingesetzt. Es ist ihr dritter Tag auf der Station. In der Pause isst sie ein Stück Geburtstagskuchen, das Haselnüsse enthält. Dabei erzählt sie von ihrem Wochenende im Kletterpark. Mia erwähnt, dass es bei Nüssen „schon mal im Mund gekribbelt“ habe.',
      'Zehn Minuten später kratzt sie sich an Hals und Händen, auf Hals und Brust bilden sich Quaddeln. Ihre Lippen und Augenlider schwellen an. Auf dem Stationsflur ist es gerade ruhig. Mit heiserer Stimme sagt sie: „Mir ist schlecht, und mir ist so schwindelig.“ Sie hat Bauchkrämpfe. Ihre Kollegin misst: Puls 128/min, Blutdruck 88/50 mmHg, Atemfrequenz 26/min, Sauerstoffsättigung 93 %. Sie notiert die Werte auf einem Zettel. Mia sagt, ihr Blutdruck sei sonst „immer so 120 zu 70“.'
    ],
    // Ohne Überschriften und nicht in der Reihenfolge der Vergleichstabelle: Die SuS ordnen selbst zu.
    info: [
      'Kommt der Körper mit dem Allergen in Kontakt, setzen Mastzellen schlagartig Histamin und weitere Botenstoffe frei. Die Gefäße werden weit und durchlässig: Flüssigkeit tritt ins Gewebe aus (Quaddeln, Schwellungen), im Gefäßsystem fehlt Volumen (relativer Volumenmangel) → der Blutdruck fällt. Gleichzeitig schwellen die Schleimhäute an (z. B. im Kehlkopf) und die Bronchien verengen sich → Atemnot und Sauerstoffmangel. Das Herz versucht, mit einem schnellen Puls auszugleichen.',
      'Im Notfall: Allergen stoppen, Hilfe holen, nach Leitsymptom lagern, Adrenalin i. m. nach Anordnung oder SOP geben (Mittel der ersten Wahl), überwachen, dokumentieren – mehr dazu in AA3 bis AA5.',
      'Die Beschwerden betreffen oft mehrere Organe gleichzeitig: Juckreiz, Rötung, Quaddeln und Schwellungen der Haut; Heiserkeit, Kloßgefühl, pfeifende Atmung, Atemnot und sinkende Sauerstoffsättigung; ein schneller Puls, Blutdruckabfall, Schwindel und Bewusstseinsstörungen; Übelkeit, Erbrechen und Bauchkrämpfe. Achtung: Die Haut kann auch blass sein – die Veränderungen an der Haut sind nicht immer deutlich.',
      'Der anaphylaktische Schock ist eine allergische Sofortreaktion des Immunsystems auf einen eigentlich harmlosen Stoff (Allergen), z. B. Medikamente, Insektengift (Wespe, Biene) oder Nahrungsmittel (Nüsse, Erdnüsse, Sellerie, Fisch). Die Reaktion beginnt Sekunden bis Minuten nach dem Kontakt.',
      'Pflegefachpersonen beobachten vor allem die Atemwege und die Atmung (Heiserkeit, Atemfrequenz, Sauerstoffsättigung) sowie den Kreislauf. Nach Stunden kann eine zweite Reaktion folgen (zweigipfliger Verlauf) – deshalb ist eine Nachbeobachtung nötig.'
    ],
    woerter: 'Allergen = Auslöser einer Allergie | Mastzellen = Abwehrzellen im Gewebe, die Histamin speichern | Quaddeln = juckende, erhabene Hautschwellungen | anaphylaktisch = durch eine schwere allergische Reaktion',
    adjektiv: 'anaphylaktischer',
    karte: {
      ursache: 'Allergie: Haselnüsse im Kuchen (Nahrungsmittel)',
      entstehung: 'Allergen → Mastzellen setzen Histamin frei → Gefäße weit und durchlässig → relativer Volumenmangel → Blutdruck ↓; Schleimhaut ↑, Bronchien eng → Atemnot',
      zeichen: 'Puls schnell (128/min) · Haut: Juckreiz, Quaddeln, Schwellungen · Heiserkeit, Atemnot, Übelkeit, Bauchkrämpfe, Schwindel',
      nur: 'Haut- und Schleimhautzeichen (Quaddeln, Schwellungen), Atemwegszeichen; zeitlicher Zusammenhang mit einem Allergen',
      achten: 'Atemwege und Atmung (Heiserkeit, SpO₂), Kreislauf; zweite Reaktion nach Stunden möglich',
      erstes: 'Allergen stoppen, Hilfe holen, lagern nach Leitsymptom, Adrenalin i. m. nach Anordnung/SOP'
    }
  },
  c: {
    buchstabe: 'C',
    form: 'Neurogener Schock',
    person: 'Herrn Weber',
    fall: [
      'An einem Sonntagnachmittag sind Sie privat mit Freunden am Baggersee. Tobias Weber (24) springt kopfüber vom Steg ins Wasser – an einer Stelle, an der das Wasser nur hüfttief ist. Seine Freunde ziehen ihn sofort ans Ufer. Kurz vorher hatte er sich noch mit Sonnencreme eingecremt. Er studiert Sport und spielt in einem Volleyballverein.',
      'Herr Weber ist wach und sagt: „Ich spür meine Beine nicht. Und meine Hände kribbeln.“ Er klagt über starke Nackenschmerzen. Am Steg läuft laute Musik. Arme und Beine kann er kaum bewegen. Seine Atmung ist flach. Sie tasten einen langsamen Puls von 52/min. Die Haut an seinen Beinen ist warm, trocken und rosig. Er fragt, ob jemand sein Handy gesehen hat. Der Rettungsdienst misst später einen Blutdruck von 82/45 mmHg.'
    ],
    // Ohne Überschriften und nicht in der Reihenfolge der Vergleichstabelle: Die SuS ordnen selbst zu.
    info: [
      'Den neurogenen Schock erkennt man an einem niedrigen Blutdruck bei langsamem oder normalem Puls. Unterhalb der Verletzung ist die Haut warm, trocken und rosig; dort bestehen Lähmungen und Gefühlsstörungen (Kribbeln, Taubheit). Oft klagt die Person über Nacken- oder Rückenschmerzen, der Körper kühlt leicht aus, und bei sehr hoher Verletzung ist auch die Atmung gestört. Achtung: Die Person wirkt „stabil“ – ruhiger Puls, rosige Haut –, ist aber im Schock.',
      'Pflegefachpersonen kontrollieren vor allem die Atmung, Blutdruck und Puls im Verlauf, die Körpertemperatur sowie Lähmungen und Gefühl im Verlauf. Nach einem Unfall kann zusätzlich eine Blutung vorliegen.',
      'Im Rückenmark verlaufen auch die Nervenbahnen des Sympathikus. Sind sie unterbrochen, fehlt den Gefäßen unterhalb der Verletzung die Spannung: Sie werden weit, das Blut „versackt“, es kommt zu einem relativen Volumenmangel → der Blutdruck fällt. Weil der Sympathikus ausfällt, kann der Körper nicht gegensteuern: Der Puls steigt nicht an (oft ist er sogar langsam), und es gibt keine Zentralisation.',
      'Im Notfall: Notruf veranlassen; den Kopf mit beiden Händen in der vorgefundenen Lage halten; nicht aufsetzen, nicht bewegen; Wärme erhalten; Atmung und Puls überwachen.',
      'Der neurogene Schock folgt auf eine Verletzung des Rückenmarks, meist im Bereich der Halswirbelsäule oder der oberen Brustwirbelsäule – z. B. nach einem Kopfsprung in flaches Wasser, einem Sturz aus der Höhe oder einem Verkehrsunfall.'
    ],
    woerter: 'neurogen = vom Nervensystem ausgehend | Rückenmark = Nervenstrang im Wirbelkanal | Sympathikus = Teil des Nervensystems, der Puls und Gefäßspannung steigert',
    adjektiv: 'neurogener',
    karte: {
      ursache: 'Rückenmarksverletzung an der Halswirbelsäule (Kopfsprung in flaches Wasser)',
      entstehung: 'Sympathikus fällt aus → Gefäße weit, Blut versackt → relativer Volumenmangel → Blutdruck ↓; keine Gegenregulation',
      zeichen: 'Puls langsam (52/min) · Haut warm, trocken, rosig · Lähmungen, Kribbeln, Nackenschmerz, flache Atmung',
      nur: 'langsamer Puls und warme, rosige Haut trotz Schock; Lähmungen und Gefühlsstörungen',
      achten: 'Atmung, Blutdruck und Puls, Temperatur (Auskühlung), Lähmungen im Verlauf',
      erstes: 'Notruf; Kopf mit beiden Händen halten, nicht bewegen; Wärme erhalten; Atmung und Puls überwachen'
    }
  }
};

/* ---------- Einstieg und Check-out „Wie hätten Sie gehandelt?“ (auch in docs/inhalte.js) ---------- */
const ENTSCHEIDUNG = [
  { nr: 'E1', frage: 'Frau K. hat nach einer Infusion Quaddeln, ringt nach Luft und hat einen Blutdruck von 85/50 mmHg. Wie lagern Sie sie?', optionen: ['A flach, Beine hoch', 'B Oberkörper hoch', 'C stabile Seitenlage'], richtig: 'B', erklaerung: 'Atemnot ist das Leitsymptom → Oberkörper hoch. Beine hoch würde die Atmung erschweren.' },
  { nr: 'E2', frage: 'Welches Medikament ist beim anaphylaktischen Schock das Mittel der ersten Wahl?', optionen: ['A Antihistaminikum', 'B Adrenalin i. m.', 'C Kortison i. v.'], richtig: 'B', erklaerung: 'Adrenalin wirkt am schnellsten auf Kreislauf, Schleimhäute und Bronchien. Antihistaminikum und Kortison kommen danach.' },
  { nr: 'E3', frage: 'Herr T. kann nach einem Kopfsprung die Beine nicht bewegen. Puls 54/min, Haut warm und rosig, Blutdruck 85/50 mmHg. Ist er stabil?', optionen: ['A Ja – Puls ruhig, Haut gut durchblutet', 'B Nein – das kann ein Schock sein'], richtig: 'B', erklaerung: 'Neurogener Schock: Der Sympathikus fällt aus – kein Pulsanstieg, keine Zentralisation, aber der Blutdruck ist niedrig.' },
  { nr: 'E4', frage: 'Während einer Kurzinfusion bekommt Herr M. Juckreiz und Atemnot. Was tun Sie mit der Infusion?', optionen: ['A langsamer laufen lassen', 'B stoppen und den Zugang entfernen', 'C stoppen, Zugang liegen lassen'], richtig: 'C', erklaerung: 'Allergen sofort stoppen – den venösen Zugang braucht das Notfallteam für Medikamente und Volumen.' },
  { nr: 'E5', frage: 'Frau K. ringt nach Luft. Dürfen Sie ihr ohne ärztliche Anordnung oder SOP Sauerstoff geben?', optionen: ['A Ja, im Notfall immer', 'B Nein, nur nach Anordnung oder SOP'], richtig: 'B', erklaerung: 'Sauerstoff ist ein Arzneimittel. Eigenverantwortlich: erkennen, Hilfe holen, lagern, überwachen.' },
  { nr: 'E6', frage: 'Frau Maler (Leitfall) um 11 Uhr: Sie ist unruhig, atmet schnell und bekommt schlecht Luft, ist blass und kaltschweißig. Puls 118/min, Blutdruck 105/70 mmHg. Wie lagern Sie sie?', optionen: ['A flach, Beine hoch', 'B Oberkörper hoch', 'C aufstehen lassen – ans offene Fenster'], richtig: 'B', erklaerung: 'Die Luftnot steht im Vordergrund → Oberkörper hoch, trotz Schockzeichen keine Schocklage. Nicht aufstehen lassen (Lungenembolie: weitere Gerinnsel können sich lösen), nicht allein lassen, sofort Hilfe holen.' }
];

/* ---------- Lagerungskarten (auch in docs/inhalte.js) ---------- */
const LAGERUNGSKARTEN = [
  { titel: 'Herr Bauer (70)', text: 'Nach einem Bienenstich ist ihm schwindelig. Puls 120/min, Blutdruck 85/50 mmHg. Er atmet ruhig und ist ansprechbar.', loesung: 'flach, Beine hoch', warum: 'Schockzeichen ohne Atemnot: Blut aus den Beinen fließt zum Herzen.' },
  { titel: 'Frau Carla Yıldız (55)', text: 'Nach Kontrastmittel ist sie heiser und atmet pfeifend, 30 Atemzüge/min. Blutdruck 90/55 mmHg.', loesung: 'Oberkörper hoch', warum: 'Atemnot ist das Leitsymptom – trotz niedrigem Blutdruck. Beine hoch würde die Atmung erschweren.', dilemma: true },
  { titel: 'Herr Demir (40)', text: 'Sturz von einer 4 m hohen Leiter. Er klagt über Nackenschmerzen und Kribbeln in beiden Händen.', loesung: 'nicht bewegen, Kopf halten', warum: 'Verdacht auf Wirbelsäulenverletzung: Jede Bewegung kann das Rückenmark weiter schädigen.' },
  { titel: 'Frau Engel (63)', text: 'Nach einem Wespenstich reagiert sie nicht mehr auf Ansprache. Sie atmet normal.', loesung: 'stabile Seitenlage', warum: 'Bewusstlos mit normaler Atmung: Die Atemwege bleiben frei, Erbrochenes kann abfließen.' },
  { titel: 'Herr Fuchs (81)', text: 'Teerstuhl seit dem Morgen. Er ist blass und kaltschweißig, Puls 116/min, Blutdruck 98/72 mmHg, keine Atemnot.', loesung: 'flach, Beine hoch', warum: 'Hypovolämischer Schock ohne Atemnot. Nicht aufsetzen – Kollapsgefahr.' },
  { titel: 'Frau Graf (35)', text: 'Sie hat eine Nussallergie und Quaddeln am Hals: „Ich krieg so schlecht Luft.“ Blutdruck 120/80 mmHg.', loesung: 'Oberkörper hoch', warum: 'Atemnot steht im Vordergrund, der Kreislauf ist noch stabil. Nicht aufstehen lassen.' },
  { titel: 'Herr Ivo (66)', text: 'Nach einem Wespenstich ist er bewusstlos und atmet nicht normal.', loesung: 'Reanimation beginnen (KB III)', warum: 'Keine normale Atmung = Kreislaufstillstand. Lagerung: Rückenlage auf harter Unterlage.' }
];

module.exports = { LINK_BASIS, SEITEN, MERKSAETZE, EXPERTEN, ENTSCHEIDUNG, LAGERUNGSKARTEN };

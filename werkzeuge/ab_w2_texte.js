/* Woche 2 (SW 7) – gemeinsame Texte für Arbeitsblatt, Anlagen und Lehrerversion.
   Die Merksätze stehen auch in docs/inhalte.js (App); tests/inhalte.test.js prüft, dass beide übereinstimmen.
   Schreibweise: **fett**; Lücken im Merksatz als { l: 'Lösung' }. */
'use strict';

const LINK_BASIS = 'klawittersven-arch.github.io/3BFP2-kb1-notfall/';

const SEITEN = {
  entscheidung: 'w2-entscheidung.html',
  markierenA: 'w2-markieren.html?fall=a',
  markierenB: 'w2-markieren.html?fall=b',
  markierenC: 'w2-markieren.html?fall=c',
  detektiv: 'w2-detektiv.html',
  lagerung: 'w2-lagerung.html',
  simulation: 'w2-simulation.html',
  raster: 'w2-raster.html',
  transfer: 'w2-transfer.html'
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
      'Herr Gerhard Albrecht (81) lebt seit vier Jahren im Pflegeheim „Am Kocherufer“. Wegen eines Vorhofflimmerns nimmt er einen Gerinnungshemmer. Er hört schlecht und trägt deshalb zwei Hörgeräte. Am Vormittag hatte er schwarzen, klebrigen Stuhlgang.',
      'Als Sie ihn um 11:30 Uhr zum Mittagessen an die Bettkante setzen wollen, sagt er: „Mir wird ganz schwarz vor Augen.“ Er ist blass, seine Stirn ist kalt und feucht. Mehrmals bittet er um etwas zu trinken. Er wirkt unruhig und fragt, wo seine Frau sei, obwohl er sonst gut orientiert ist. Sie messen: Puls 116/min, Blutdruck 98/72 mmHg, Atemfrequenz 24/min. Bei der Morgenrunde lagen die Werte bei Puls 78/min und Blutdruck 145/85 mmHg.'
    ],
    info: [
      '**Ursache:** Dem Gefäßsystem fehlt Volumen, weil Blut oder Flüssigkeit verloren geht, z. B. durch eine Blutung (sichtbar nach außen oder verborgen im Körper wie bei einer Magen-Darm-Blutung), durch Verbrennungen oder durch starken Durchfall und Erbrechen. Gerinnungshemmer erhöhen das Blutungsrisiko. Schwarzer, klebriger Stuhl (Teerstuhl) ist ein Hinweis auf eine Blutung im Magen oder Zwölffingerdarm.',
      '**Entstehung:** Weniger Volumen → weniger Blut fließt zum Herzen zurück → das Herz kann weniger auswerfen (Schlagvolumen sinkt) → der Blutdruck droht zu fallen. Der Sympathikus gleicht aus: Der Puls steigt, die Gefäße in Haut, Muskeln, Niere und Darm verengen sich (Zentralisation, siehe Woche 1). Hält der Verlust an, gerät der Körper in die Schockspirale.',
      '**Typische Zeichen:** schneller, schwacher Puls; blasse, kalte, schweißige Haut; Durst; Unruhe, Angst, Verwirrtheit; schnelle Atmung; wenig Urin. Der Blutdruck fällt erst spät – entscheidend ist der Vergleich mit dem Vorwert (Schockindex).',
      '**Darauf achte ich besonders:** Blutungsquelle (Stuhl, Erbrochenes, Verband, Drainage), Puls und Blutdruck im Verlauf, Bewusstsein, Urinausscheidung.',
      '**Erste Schritte:** Hilfe holen, Ärztin oder Arzt informieren; nicht aufsetzen oder aufstehen lassen; flach lagern, Beine hoch (wenn keine Atemnot); Wärme erhalten; nichts essen oder trinken lassen (mögliche Untersuchung oder Operation); engmaschig überwachen; Volumengabe nur nach ärztlicher Anordnung.'
    ],
    woerter: 'hypovolämisch = mit zu wenig Volumen | Teerstuhl = schwarzer Stuhl durch verdautes Blut | Zentralisation = Umverteilung des Blutes zu Gehirn und Herz',
    nennen: ['blass; Stirn kalt und feucht (kaltschweißig)', 'Puls 116/min – Anstieg von 78/min (Tachykardie)', 'Blutdruck 98/72 mmHg – Abfall von 145/85 mmHg, kleine Blutdruckamplitude; Schockindex 116 : 98 ≈ 1,2', 'Durst (bittet mehrmals um etwas zu trinken)', 'Unruhe und neu aufgetretene Verwirrtheit', '„Mir wird ganz schwarz vor Augen.“ (Schwindel beim Aufsetzen)', 'Atemfrequenz 24/min (erhöht)'],
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
      'Mia (19) ist Auszubildende im ersten Ausbildungsdrittel und mit Ihnen auf einer internistischen Station eingesetzt. In der Pause isst sie ein Stück Geburtstagskuchen, das eine Kollegin mitgebracht hat. Der Kuchen enthält Haselnüsse. Mia erzählt, dass es bei Nüssen „schon mal im Mund gekribbelt“ habe. Es ist ihr dritter Tag auf der Station.',
      'Zehn Minuten später kratzt sie sich an Hals und Händen, auf Hals und Brust bilden sich Quaddeln. Ihre Lippen und Augenlider schwellen an. Mit heiserer Stimme sagt sie: „Mir ist schlecht, und mir ist so schwindelig.“ Sie hat Bauchkrämpfe. Ihre Kollegin misst: Puls 128/min, Blutdruck 88/50 mmHg, Atemfrequenz 26/min, Sauerstoffsättigung 93 %. Mia sagt, ihr Blutdruck sei sonst „immer so 120 zu 70“.'
    ],
    info: [
      '**Ursache:** Allergische Sofortreaktion des Immunsystems auf einen eigentlich harmlosen Stoff (Allergen), z. B. Medikamente, Insektengift (Wespe, Biene) oder Nahrungsmittel (Nüsse, Erdnüsse, Sellerie, Fisch). Die Reaktion beginnt Sekunden bis Minuten nach dem Kontakt.',
      '**Entstehung:** Das Allergen bringt Mastzellen dazu, schlagartig Histamin und weitere Botenstoffe freizusetzen. Die Gefäße werden weit und durchlässig: Flüssigkeit tritt ins Gewebe aus (Quaddeln, Schwellungen), im Gefäßsystem fehlt Volumen (relativer Volumenmangel) → der Blutdruck fällt. Gleichzeitig schwellen die Schleimhäute an (z. B. im Kehlkopf) und die Bronchien verengen sich → Atemnot und Sauerstoffmangel. Das Herz versucht mit einem schnellen Puls auszugleichen.',
      '**Typische Zeichen** – oft an mehreren Organen gleichzeitig: Haut (Juckreiz, Rötung, Quaddeln, Schwellungen); Atemwege (Heiserkeit, Kloßgefühl, pfeifende Atmung, Atemnot, sinkende Sauerstoffsättigung); Kreislauf (schneller Puls, Blutdruckabfall, Schwindel, Bewusstseinsstörung); Magen-Darm (Übelkeit, Erbrechen, Bauchkrämpfe). Achtung: Die Haut kann auch blass sein – Hautzeichen sind nicht immer deutlich.',
      '**Darauf achte ich besonders:** Atemwege und Atmung (Heiserkeit, Atemfrequenz, Sauerstoffsättigung), Kreislauf. Nach Stunden kann eine zweite Reaktion folgen (zweigipfliger Verlauf) – deshalb Nachbeobachtung.',
      '**Erste Schritte:** Allergen stoppen, Hilfe holen, lagern nach Leitsymptom, Adrenalin i. m. nach Anordnung oder SOP (Mittel der ersten Wahl), überwachen, dokumentieren – mehr dazu in AA3 bis AA5.'
    ],
    woerter: 'Allergen = Auslöser einer Allergie | Mastzellen = Abwehrzellen im Gewebe, die Histamin speichern | Quaddeln = juckende, erhabene Hautschwellungen | anaphylaktisch = durch eine schwere allergische Reaktion',
    nennen: ['Juckreiz und Quaddeln an Hals und Brust', 'Schwellung von Lippen und Augenlidern', 'heisere Stimme (Schwellung der Kehlkopfschleimhaut)', 'Atemfrequenz 26/min, Sauerstoffsättigung 93 %', 'Puls 128/min (Tachykardie)', 'Blutdruck 88/50 mmHg – deutlich unter ihrem üblichen Wert (120/70)', 'Schwindel, Übelkeit, Bauchkrämpfe'],
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
      'An einem Sonntagnachmittag sind Sie privat mit Freunden am Baggersee. Tobias Weber (24) springt kopfüber vom Steg ins Wasser – an einer Stelle, an der das Wasser nur hüfttief ist. Seine Freunde ziehen ihn sofort ans Ufer. Kurz vorher hatte er sich noch mit Sonnencreme eingecremt.',
      'Herr Weber ist wach und sagt: „Ich spür meine Beine nicht. Und meine Hände kribbeln.“ Er klagt über starke Nackenschmerzen. Arme und Beine kann er kaum bewegen. Seine Atmung ist flach. Sie tasten einen langsamen Puls von 52/min. Die Haut an seinen Beinen ist warm, trocken und rosig. Der Rettungsdienst misst später einen Blutdruck von 82/45 mmHg.'
    ],
    info: [
      '**Ursache:** Verletzung des Rückenmarks, meist im Bereich der Halswirbelsäule oder der oberen Brustwirbelsäule, z. B. durch einen Kopfsprung in flaches Wasser, einen Sturz aus der Höhe oder einen Verkehrsunfall.',
      '**Entstehung:** Im Rückenmark verlaufen auch die Nervenbahnen des Sympathikus. Sind sie unterbrochen, fehlt den Gefäßen unterhalb der Verletzung die Spannung: Sie werden weit, das Blut „versackt“, es entsteht ein relativer Volumenmangel → der Blutdruck fällt. Weil der Sympathikus ausfällt, kann der Körper nicht gegensteuern: Der Puls steigt nicht an (oft ist er sogar langsam), und es gibt keine Zentralisation.',
      '**Typische Zeichen:** niedriger Blutdruck bei langsamem oder normalem Puls; Haut unterhalb der Verletzung warm, trocken und rosig; Lähmungen und Gefühlsstörungen (Kribbeln, Taubheit) unterhalb der Verletzung; Nacken- oder Rückenschmerzen; der Körper kühlt leicht aus; bei sehr hoher Verletzung ist auch die Atmung gestört. Achtung: Die Person wirkt „stabil“ – ruhiger Puls, rosige Haut –, ist aber im Schock.',
      '**Darauf achte ich besonders:** Atmung, Blutdruck und Puls im Verlauf, Körpertemperatur, Lähmungen und Gefühl im Verlauf. Nach einem Unfall kann zusätzlich eine Blutung vorliegen.',
      '**Erste Schritte:** Notruf veranlassen; den Kopf mit beiden Händen in der vorgefundenen Lage halten; nicht aufsetzen, nicht bewegen; Wärme erhalten; Atmung und Puls überwachen (mehr in Woche 4).'
    ],
    woerter: 'neurogen = vom Nervensystem ausgehend | Rückenmark = Nervenstrang im Wirbelkanal | Sympathikus = Teil des Nervensystems, der Puls und Gefäßspannung steigert',
    nennen: ['Blutdruck 82/45 mmHg (niedrig)', 'langsamer Puls 52/min trotz niedrigem Blutdruck', 'Haut an den Beinen warm, trocken, rosig (keine Zentralisation)', 'flache Atmung', 'Lähmungen: kann Arme und Beine kaum bewegen; „Ich spür meine Beine nicht“', 'Kribbeln in den Händen, starke Nackenschmerzen (Hinweis auf Halswirbelsäule)'],
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

/* ---------- Einstieg „Ihre Entscheidung, bitte!“ (auch in docs/inhalte.js) ---------- */
const ENTSCHEIDUNG = [
  { nr: 'E1', frage: 'Frau K. hat nach einer Infusion Quaddeln, ringt nach Luft und hat einen Blutdruck von 85/50 mmHg. Wie lagern Sie sie?', optionen: ['A flach, Beine hoch', 'B Oberkörper hoch', 'C stabile Seitenlage'], richtig: 'B', erklaerung: 'Atemnot ist das Leitsymptom → Oberkörper hoch. Beine hoch würde die Atmung erschweren.' },
  { nr: 'E2', frage: 'Welches Medikament ist beim anaphylaktischen Schock das Mittel der ersten Wahl?', optionen: ['A Antihistaminikum', 'B Adrenalin i. m.', 'C Kortison i. v.'], richtig: 'B', erklaerung: 'Adrenalin wirkt am schnellsten auf Kreislauf, Schleimhäute und Bronchien. Antihistaminikum und Kortison kommen danach.' },
  { nr: 'E3', frage: 'Herr T. kann nach einem Kopfsprung die Beine nicht bewegen. Puls 54/min, Haut warm und rosig, Blutdruck 85/50 mmHg. Ist er stabil?', optionen: ['A Ja – Puls ruhig, Haut gut durchblutet', 'B Nein – das kann ein Schock sein'], richtig: 'B', erklaerung: 'Neurogener Schock: Der Sympathikus fällt aus – kein Pulsanstieg, keine Zentralisation, aber der Blutdruck ist niedrig.' },
  { nr: 'E4', frage: 'Während einer Kurzinfusion bekommt Herr M. Juckreiz und Atemnot. Was tun Sie mit der Infusion?', optionen: ['A langsamer laufen lassen', 'B stoppen und den Zugang entfernen', 'C stoppen, Zugang liegen lassen'], richtig: 'C', erklaerung: 'Allergen sofort stoppen – den venösen Zugang braucht das Notfallteam für Medikamente und Volumen.' },
  { nr: 'E5', frage: 'Frau K. ringt nach Luft. Dürfen Sie ihr ohne ärztliche Anordnung oder SOP Sauerstoff geben?', optionen: ['A Ja, im Notfall immer', 'B Nein, nur nach Anordnung oder SOP'], richtig: 'B', erklaerung: 'Sauerstoff ist ein Arzneimittel. Eigenverantwortlich: erkennen, Hilfe holen, lagern, überwachen.' }
];

/* ---------- Lagerungskarten (auch in docs/inhalte.js) ---------- */
const LAGERUNGSKARTEN = [
  { titel: 'Herr Bauer (70)', text: 'Nach einem Bienenstich ist ihm schwindelig. Puls 120/min, Blutdruck 85/50 mmHg. Er atmet ruhig und ist ansprechbar.', loesung: 'flach, Beine hoch', warum: 'Schockzeichen ohne Atemnot: Blut aus den Beinen fließt zum Herzen.' },
  { titel: 'Frau Carla Yıldız (55)', text: 'Nach Kontrastmittel ist sie heiser und atmet pfeifend, 30 Atemzüge/min. Blutdruck 90/55 mmHg.', loesung: 'Oberkörper hoch', warum: 'Atemnot ist das Leitsymptom – trotz niedrigem Blutdruck. Beine hoch würde die Atmung erschweren.', dilemma: true },
  { titel: 'Herr Demir (40)', text: 'Sturz von einer 4 m hohen Leiter. Er klagt über Nackenschmerzen und Kribbeln in beiden Händen.', loesung: 'nicht bewegen, Kopf halten', warum: 'Verdacht auf Wirbelsäulenverletzung: Jede Bewegung kann das Rückenmark weiter schädigen.' },
  { titel: 'Frau Engel (63)', text: 'Nach einem Wespenstich reagiert sie nicht mehr auf Ansprache. Sie atmet normal.', loesung: 'stabile Seitenlage', warum: 'Bewusstlos mit normaler Atmung: Die Atemwege bleiben frei, Erbrochenes kann abfließen.' },
  { titel: 'Herr Fuchs (81)', text: 'Teerstuhl seit dem Morgen. Er ist blass und kaltschweißig, Puls 116/min, Blutdruck 98/72 mmHg, keine Atemnot.', loesung: 'flach, Beine hoch', warum: 'Hypovolämischer Schock ohne Atemnot. Nicht aufsetzen – Kollapsgefahr.' },
  { titel: 'Frau Graf (35)', text: 'Sie hat eine Nussallergie und Quaddeln am Hals: „Ich krieg so schlecht Luft.“ Blutdruck 120/80 mmHg.', loesung: 'Oberkörper hoch', warum: 'Atemnot steht im Vordergrund, der Kreislauf ist noch stabil. Nicht aufstehen lassen.' },
  { titel: 'Herr Hahn (28)', text: 'Sturz mit dem Fahrrad, offener Unterschenkelbruch. Er ist blass, Puls 120/min. Keine Nacken- oder Rückenschmerzen.', loesung: 'flach, verletztes Bein nicht anheben', warum: 'Keine Schocklage bei Verletzungen an Bein oder Becken: Bein in der vorgefundenen Lage ruhigstellen (Woche 3).', profi: true },
  { titel: 'Herr Ivo (66)', text: 'Nach einem Wespenstich ist er bewusstlos und atmet nicht normal.', loesung: 'Reanimation beginnen (KB III)', warum: 'Keine normale Atmung = Kreislaufstillstand. Lagerung: Rückenlage auf harter Unterlage.' },
  { titel: 'Profi-Karte: Frau Jäger (74)', text: 'Plötzlich peitschenartiger Schmerz im linken Bein. Das Bein ist blass und kalt, am Fuß ist kein Puls tastbar.', loesung: 'Bein tief lagern, polstern', warum: 'Verdacht auf akuten Arterienverschluss: Tieflagern verbessert die Durchblutung (Examen Mai 2024). Die Lagerung richtet sich immer nach dem Problem.', profi: true }
];

module.exports = { LINK_BASIS, SEITEN, MERKSAETZE, EXPERTEN, ENTSCHEIDUNG, LAGERUNGSKARTEN };

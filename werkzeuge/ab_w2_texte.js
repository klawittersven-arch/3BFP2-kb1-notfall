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
      'Herr Gerhard Albrecht (81) lebt seit vier Jahren im Pflegeheim „Am Kocherufer“. Wegen eines Vorhofflimmerns nimmt er einen Gerinnungshemmer. Am Vormittag hatte er schwarzen, klebrigen Stuhlgang. Danach hat er mit seinem Zimmernachbarn Karten gespielt.',
      'Als Sie ihn um 11:30 Uhr zum Mittagessen an die Bettkante setzen wollen, sagt er: „Mir wird ganz schwarz vor Augen.“ Er ist blass, seine Stirn ist kalt und feucht. Mehrmals bittet er um etwas zu trinken. Er wirkt unruhig und fragt, wo seine Frau sei, obwohl er sonst gut orientiert ist. Sie messen: Puls 116/min, Blutdruck 98/72 mmHg, Atemfrequenz 24/min. Bei der Morgenrunde lagen die Werte bei Puls 78/min und Blutdruck 145/85 mmHg. Seine Tochter hat sich für den Nachmittag zum Besuch angemeldet.'
    ],
    // Ohne Überschriften und nicht in der Reihenfolge der Vergleichstabelle: Die SuS ordnen selbst zu.
    info: [
      'Bei einem hypovolämischen Schock ist der Puls schnell und schwach. Die Haut ist blass, kalt und schweißig. Viele Menschen haben großen Durst, sind unruhig oder verwirrt und atmen schnell. Der Blutdruck fällt oft erst spät. Wichtig ist der Vergleich mit dem Vorwert (Schockindex).',
      'Pflegefachpersonen achten darauf, wo Blut verloren geht: Stuhl, Erbrochenes, Verband, Drainage. Sie kontrollieren Puls, Blutdruck, Bewusstsein und Urin im Verlauf.',
      'Ausgelöst wird er durch einen Verlust von Blut oder Flüssigkeit: eine Blutung nach außen oder im Körper, z. B. im Magen-Darm-Trakt, oder starker Durchfall und Erbrechen. Gerinnungshemmer erhöhen das Blutungsrisiko. Schwarzer, klebriger Stuhl (Teerstuhl) zeigt eine Blutung im Magen oder Zwölffingerdarm.',
      'Im Notfall: Hilfe holen. Flach lagern, Beine hoch (ohne Atemnot). Nicht aufsetzen. Wärme erhalten, überwachen.',
      'Im Körper: weniger Volumen → weniger Blut fließt zum Herzen → der Blutdruck droht zu fallen. Der Sympathikus steuert gegen: Der Puls steigt, und die Gefäße in Haut, Niere und Darm werden eng (Zentralisation, siehe Woche 1).'
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
      'Mia (19) ist Auszubildende im ersten Ausbildungsdrittel und mit Ihnen auf einer internistischen Station eingesetzt. In der Pause isst sie ein Stück Geburtstagskuchen, das Haselnüsse enthält. Dabei erzählt sie von ihrem Wochenende im Kletterpark. Mia erwähnt, dass es bei Nüssen „schon mal im Mund gekribbelt“ habe.',
      'Zehn Minuten später kratzt sie sich an Hals und Händen, auf Hals und Brust bilden sich Quaddeln. Ihre Lippen und Augenlider schwellen an. Mit heiserer Stimme sagt sie: „Mir ist schlecht, und mir ist so schwindelig.“ Sie hat Bauchkrämpfe. Ihre Kollegin misst: Puls 128/min, Blutdruck 88/50 mmHg, Atemfrequenz 26/min, Sauerstoffsättigung 93 %. Sie notiert die Werte auf einem Zettel. Mia sagt, ihr Blutdruck sei sonst „immer so 120 zu 70“.'
    ],
    // Ohne Überschriften und nicht in der Reihenfolge der Vergleichstabelle: Die SuS ordnen selbst zu.
    info: [
      'Bei Kontakt mit dem Allergen setzen Mastzellen schlagartig Histamin frei. Die Gefäße werden weit und durchlässig. Flüssigkeit tritt ins Gewebe aus (Quaddeln, Schwellungen). Im Gefäßsystem fehlt dann Volumen → der Blutdruck fällt. Die Schleimhäute schwellen an, die Bronchien werden eng → Atemnot. Der Puls wird schnell.',
      'Im Notfall: Allergen stoppen, Hilfe holen, nach Leitsymptom lagern. Adrenalin i. m. nach Anordnung oder SOP ist das Mittel der ersten Wahl.',
      'Oft sind mehrere Organe betroffen: Haut (Juckreiz, Quaddeln, Schwellungen), Atemwege (Heiserkeit, pfeifende Atmung, Atemnot), Kreislauf (schneller Puls, niedriger Blutdruck, Schwindel) und Magen-Darm (Übelkeit, Bauchkrämpfe). Achtung: Die Haut kann auch blass sein.',
      'Der anaphylaktische Schock ist eine schwere allergische Sofortreaktion, z. B. auf Medikamente, Insektengift oder Nüsse. Sie beginnt Sekunden bis Minuten nach dem Kontakt.',
      'Pflegefachpersonen beobachten vor allem Atmung (Heiserkeit, Atemfrequenz, Sauerstoffsättigung) und Kreislauf. Nach Stunden kann eine zweite Reaktion folgen (zweigipfliger Verlauf). Deshalb ist eine Nachbeobachtung nötig.'
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
      'An einem Sonntagnachmittag sind Sie privat mit Freunden am Baggersee. Tobias Weber (24) springt kopfüber vom Steg ins Wasser – an einer Stelle, an der das Wasser nur hüfttief ist. Seine Freunde ziehen ihn sofort ans Ufer. Kurz vorher hatte er sich noch mit Sonnencreme eingecremt.',
      'Herr Weber ist wach und sagt: „Ich spür meine Beine nicht. Und meine Hände kribbeln.“ Er klagt über starke Nackenschmerzen. Arme und Beine kann er kaum bewegen. Seine Atmung ist flach. Sie tasten einen langsamen Puls von 52/min. Die Haut an seinen Beinen ist warm, trocken und rosig. Er fragt, ob jemand sein Handy gesehen hat. Der Rettungsdienst misst später einen Blutdruck von 82/45 mmHg.'
    ],
    // Ohne Überschriften und nicht in der Reihenfolge der Vergleichstabelle: Die SuS ordnen selbst zu.
    info: [
      'Beim neurogenen Schock ist der Blutdruck niedrig, aber der Puls langsam oder normal. Unterhalb der Verletzung ist die Haut warm, trocken und rosig. Dort bestehen Lähmungen und Gefühlsstörungen (Kribbeln). Oft hat die Person Nackenschmerzen. Bei hoher Verletzung ist auch die Atmung gestört. Achtung: Die Person wirkt „stabil“, ist aber im Schock.',
      'Pflegefachpersonen kontrollieren vor allem Atmung, Blutdruck, Puls, Körpertemperatur (Auskühlung) und Lähmungen im Verlauf.',
      'Im Rückenmark verlaufen Nervenbahnen des Sympathikus. Sind sie unterbrochen, werden die Gefäße unterhalb der Verletzung weit. Das Blut „versackt“ → der Blutdruck fällt. Der Puls steigt nicht, und es gibt keine Zentralisation.',
      'Im Notfall: Notruf. Den Kopf mit beiden Händen in der vorgefundenen Lage halten, nicht bewegen. Wärme erhalten, Atmung und Puls überwachen.',
      'Auslöser ist eine Verletzung des Rückenmarks, meist an der Halswirbelsäule – z. B. nach einem Kopfsprung in flaches Wasser oder einem Sturz aus der Höhe.'
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
  { nr: 'E4', frage: 'Frau Maler (Leitfall) um 11 Uhr: Sie ist unruhig, atmet schnell und bekommt schlecht Luft, ist blass und kaltschweißig. Puls 118/min, Blutdruck 105/70 mmHg. Wie lagern Sie sie?', optionen: ['A flach, Beine hoch', 'B Oberkörper hoch', 'C aufstehen lassen – ans offene Fenster'], richtig: 'B', erklaerung: 'Die Luftnot steht im Vordergrund → Oberkörper hoch, trotz Schockzeichen keine Schocklage. Nicht aufstehen lassen (Lungenembolie: weitere Gerinnsel können sich lösen), nicht allein lassen, sofort Hilfe holen.' }
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

/* =====================================================================
   Inhalte des Arbeitsblatts – gemeinsam für die digitale Fassung (ab_w2.js)
   und die analoge Fassung ohne Handys (ab_w2_analog.js). Was hier steht,
   ist in beiden Fassungen wortgleich.
   loesung: Erwartungshorizont der Lehrerversion (mit Punkten); für Folien,
   Nachlese und Lösungskarten werden die Punkte-Hinweise entfernt.
   ===================================================================== */
const LERNZIEL = 'Sie vergleichen den hypovolämischen, den anaphylaktischen und den neurogenen Schock und begründen Sofortmaßnahmen und Lagerung (Positionierung) anhand des Leitsymptoms. Sie unterscheiden, was Sie selbst tun dürfen und was nur nach ärztlicher Anordnung.';

const FALLBEZUG = {
  kopf: 'Fallbezug: „Reanimation – und nicht nur ich war hilflos“ (Auszug)',
  absaetze: [
    'Frau Maler (71) ist seit gestern neu im Pflegeheim. Vor drei Wochen bekam sie nach einem Oberschenkelhalsbruch eine Hüft-TEP. Seitdem liegt sie fast nur im Bett.',
    'Schülerin Christin berichtet: „Gegen elf Uhr war sie unruhig, atmete schnell und bekam schlecht Luft. Sie war blass und hatte kalten Schweiß auf der Stirn. Puls 118/min, Blutdruck 105/70 mmHg. Ich dachte, sie sei nur aufgeregt.“'
  ]
};
const LEITFRAGE = 'Woher kommt Frau Malers Luftnot – und wie hätte man sie um 11 Uhr lagern müssen?';
const KETTE = 'Immobilität → tiefe Beinvenenthrombose → Lungenembolie → obstruktiver Schock → Kreislaufstillstand';
const LEITFRAGE_ANTWORT = 'Die Luftnot kommt von einer Lungenembolie: Ein Gerinnsel aus der Beinvene hat die Lungenstrombahn verlegt → obstruktiver Schock. Um 11 Uhr: Oberkörper hoch (Luftnot im Vordergrund), nicht mobilisieren, nicht allein lassen, sofort Hilfe holen und engmaschig überwachen.';

// Vergleichstabelle: Zeile, A hypovolämisch, B anaphylaktisch, C neurogen
const VERGLEICH = [
  ['Ursache', 'Blut- oder Flüssigkeitsverlust (Blutung, z. B. Magen-Darm-Blutung; Verbrennung; Durchfall, Erbrechen)', 'allergische Sofortreaktion auf Medikament, Insektengift oder Nahrungsmittel', 'Verletzung des Rückenmarks (meist Halswirbelsäule), z. B. Kopfsprung, Sturz aus der Höhe'],
  ['Entstehung (kurz)', 'Volumen ↓ → Rückstrom zum Herzen ↓ → Blutdruck ↓; Sympathikus gleicht aus: Puls ↑, Zentralisation', 'Histamin → Gefäße weit und durchlässig → relativer Volumenmangel → Blutdruck ↓; Bronchien eng', 'Sympathikus fällt aus → Gefäße weit, Blut versackt → Blutdruck ↓; keine Gegenregulation (Puls steigt nicht)'],
  ['Puls', 'schnell, schwach', 'schnell', 'langsam oder normal'],
  ['Haut', 'blass, kalt, schweißig (Zentralisation)', 'Juckreiz, Rötung, Quaddeln, Schwellungen (kann auch blass sein)', 'unterhalb der Verletzung warm, trocken, rosig'],
  ['weitere typische Zeichen', 'Durst, Unruhe, schnelle Atmung, wenig Urin; ggf. sichtbares Blut, Teerstuhl', 'Heiserkeit, Atemnot, Übelkeit, Erbrechen, Bauchkrämpfe, Schwindel', 'Lähmungen, Kribbeln, Taubheit, Nacken-/Rückenschmerz, flache Atmung, Auskühlung'],
  ['Darauf achte ich besonders', 'Blutungsquelle; Puls und Blutdruck im Verlauf (Schockindex); Bewusstsein; Urin', 'Atemwege und Atmung (Heiserkeit, SpO₂); Kreislauf; zweite Reaktion nach Stunden möglich', 'Atmung; Blutdruck und Puls; Temperatur; nicht bewegen']
];
const GEMEINSAMKEIT = 'Bei allen drei Formen fällt der Blutdruck, die Organe werden schlecht durchblutet → Sauerstoffmangel → Lebensgefahr. Anaphylaktischer und neurogener Schock sind distributive Schockformen: Die Gefäße sind weit gestellt (relativer Volumenmangel).';

// Die vier Lagerungen: Bild, Titel, Wann?, Warum?
const PIKTO = [
  ['lagerung_oberkoerper_hoch.png', 'Oberkörper hoch (halbsitzend)', '**Wann?** Atemnot steht im Vordergrund.', '**Warum?** Die Atemhilfsmuskulatur kann besser arbeiten.'],
  ['lagerung_beine_hoch.png', 'Flach, Beine hoch (Schocklage)', '**Wann?** Schockzeichen ohne Atemnot.', '**Warum?** Blut aus den Beinen fließt zum Herzen. Nicht bei Atemnot oder Verletzungen an Beinen, Becken, Wirbelsäule.'],
  ['lagerung_seitenlage.png', 'Stabile Seitenlage', '**Wann?** Bewusstlos, Atmung normal.', '**Warum?** Die Atemwege bleiben frei, Erbrochenes kann abfließen.'],
  ['lagerung_nicht_bewegen.png', 'Nicht bewegen', '**Wann?** Verdacht auf Wirbelsäulenverletzung.', '**Warum?** Jede Bewegung kann das Rückenmark schädigen. Kopf mit beiden Händen halten.']
];
const ANAPHYLAXIE_LAGERUNG = '**Bei Anaphylaxie:** nicht aufsetzen oder aufstehen lassen. **Atmet die Person nicht normal → Reanimation** (KB III).';

// Wer darf was? – fertig ausgefüllt (🟢 selbst · 🟡 n. ä. A. oder SOP · 🔴 ärztlich)
const WER_DARF_WAS = [
  ['Gefahr erkennen', 'Hilfe holen', 'Allergen stoppen (z. B. Infusion stoppen, Zugang belassen)', 'nach Leitsymptom lagern', 'überwachen', 'dokumentieren'],
  ['Medikamente: **Adrenalin i. m.**, Antihistaminikum', 'Sauerstoff', 'Infusionen', '**SOP** = schriftliche, ärztlich freigegebene Notfall-Anweisung'],
  ['Medikamente anordnen (Wirkstoff, Dosis, Weg)', 'Notfall-SOP schriftlich freigeben', 'Weiterbehandlung festlegen, z. B. Intensivstation', 'Diagnose stellen, z. B. „anaphylaktischer Schock“']
];
const WER_DARF_WAS_KOPF = ['🟢 mache ich selbst (eigenverantwortlich)', '🟡 nur nach ärztlicher Anordnung (n. ä. A.) oder SOP', '🔴 ärztliche Aufgabe'];
const AZUBI = '**Als Auszubildende/r:** unter Anleitung handeln und sofort eine Pflegefachperson holen.';
const ADRENALIN_TEXT = [
  '**Adrenalin i. m.** ist das Mittel der ersten Wahl: Es wirkt am schnellsten, stellt die Gefäße eng (Blutdruck ↑), lässt Schleimhäute abschwellen, weitet die Bronchien.',
  '**Antihistaminika** und **Kortison** wirken langsamer und zu schwach – sie kommen erst **nach** Adrenalin.'
];
const DIALOG = [
  { wer: '💬 Herr Brandt, Pflegefachkraft:', text: '„Geben Sie ihr erst mal das Antihistaminikum aus dem Notfallkoffer. Adrenalin ist mir zu heftig.“' },
  { wer: '💬 Lina, Auszubildende:', text: '„Aber in unserer Notfall-SOP steht Adrenalin ganz oben …“' }
];
const TRANSFERFALL = [
  'Sie sind in der Tagespflege „Sonnenhof“ eingesetzt. Herr Klaus Martens (74) hat einen Diabetes mellitus Typ 2 und eine Herzinsuffizienz. Gegen 14:15 Uhr sitzt er mit anderen Gästen auf der Terrasse beim Kaffee. Plötzlich schreit er auf: Eine Wespe hat ihn in die Oberlippe gestochen.',
  'Nach etwa fünf Minuten ist seine Oberlippe stark geschwollen, am Hals bilden sich Quaddeln. Mit kloßiger Stimme sagt er: „Mir ist so eng im Hals.“ Beim Einatmen hören Sie ein pfeifendes Geräusch. Sie messen: Atemfrequenz 28/min, Puls 124/min, Blutdruck 92/60 mmHg (am Morgen: 150/85 mmHg). In der Tagespflege ist keine Ärztin anwesend. Ein Notfallset hat Herr Martens nicht dabei.'
];
const TRANSFER_RAHMEN = 'Pflegefachpersonen leiten in lebensbedrohlichen Situationen lebenserhaltende Sofortmaßnahmen ein.';

// Schreibaufgaben im Klausurformat (Nr. · Aufgabe · Punkte) mit Erwartungshorizont
const AUFGABEN = {
  '2.1': { nr: '2.1', text: 'Erläutern Sie, wie es bei Mia zum Schock kommt. Nutzen Sie die Vergleichstabelle (Seite 2, Spalte?, Zeile „Entstehung“). Nennen Sie dazu passende Befunde aus Mias Fall.', punkte: 3,
    loesung: ['Die Haselnuss (Allergen) löst eine allergische Sofortreaktion aus: Mastzellen setzen Histamin und weitere Botenstoffe frei.', 'Die Gefäße werden weit und durchlässig: Flüssigkeit tritt ins Gewebe (Quaddeln, Schwellung von Lippen und Lidern), im Gefäßsystem fehlt Volumen → der Blutdruck fällt (88/50 mmHg), das Herz gleicht mit 128/min aus.', 'Zusätzlich schwellen die Schleimhäute an (Heiserkeit) und die Bronchien verengen sich → Atemnot, Sauerstoffmangel (SpO₂ 93 %).', '(je schlüssiger Schritt 1 P.)'] },
  '2.2': { nr: '2.2', text: 'Herr Albrecht hat einen schnellen Puls (116/min), Herr Weber einen langsamen Puls (52/min). Erklären Sie diesen Unterschied.', punkte: 2,
    loesung: ['Herr Albrecht verliert Blut (Volumenmangel). Der Sympathikus wird aktiviert und steigert den Puls, um den Blutdruck zu halten (Ausgleich). (1 P.)', 'Bei Herrn Weber ist das Rückenmark verletzt, der Sympathikus fällt aus. Der Körper kann nicht gegensteuern: Der Puls steigt nicht, er ist sogar langsam. (1 P.)'] },
  '3.1': { nr: '3.1', vorsatz: 'Frau Carla Yıldız (55) hat in der Radiologie Kontrastmittel erhalten. Sie ist heiser und atmet pfeifend mit 30 Atemzügen pro Minute. Ihr Blutdruck liegt bei 90/55 mmHg.', text: 'Begründen Sie, warum Sie Frau Yıldız trotz des niedrigen Blutdrucks mit erhöhtem Oberkörper lagern.', punkte: 2,
    loesung: ['Bei Frau Yıldız steht die Atemnot im Vordergrund (Heiserkeit, pfeifende Atmung, 30/min). Mit erhöhtem Oberkörper kann sie die Atemhilfsmuskulatur einsetzen, die Bauchorgane drücken nicht gegen das Zwerchfell.', 'Flach mit Beinen hoch würde die Atemnot verstärken. Nicht aufsetzen oder aufstehen lassen, Kreislauf engmaschig überwachen. (je schlüssiges Argument 1 P.)'] },
  '3.2': { nr: '3.2', text: 'Nehmen Sie Stellung zu der Aussage: „Bei einem Schock legt man immer die Beine hoch.“', punkte: 2,
    loesung: ['Die Aussage ist falsch. Die Schocklage hilft nur bei Schockzeichen ohne Atemnot, weil Blut aus den Beinen zum Herzen fließt.', 'Entscheidend ist das Leitsymptom: bei Atemnot Oberkörper hoch, bei Bewusstlosigkeit mit normaler Atmung stabile Seitenlage, bei Verdacht auf Wirbelsäulenverletzung nicht bewegen; bei Verletzungen an Beinen oder Becken keine Schocklage. (Beurteilung 1 P., Begründung mit Gegenbeispiel 1 P.)'] },
  '4.1': { nr: '4.1', text: 'Nehmen Sie Stellung zu der Aussage von Herrn Brandt.', punkte: 3,
    loesung: ['Die Aussage ist fachlich falsch. Beim anaphylaktischen Schock ist Adrenalin i. m. das Mittel der ersten Wahl (nach SOP bzw. ärztlicher Anordnung): Es stellt die Gefäße eng und hebt den Blutdruck, lässt die Schleimhäute abschwellen, weitet die Bronchien und wirkt am schnellsten.', 'Ein Antihistaminikum blockiert nur Histamin, wirkt langsamer und hebt weder den Blutdruck noch weitet es die Bronchien. Es darf Adrenalin nicht verzögern und kann danach gegeben werden.', 'Lina sollte die SOP ansprechen und sofort das Notfallteam bzw. die Ärztin einbeziehen. (Beurteilung 1 P., je fachliches Argument 1 P., max. 3 P.)'] },
  '5.1': { nr: '5.1', text: 'Beschreiben Sie stichwortartig 5 Sofortmaßnahmen, die Sie bei Herrn Martens bis zum Eintreffen des Rettungsdienstes einleiten. Begründen Sie dabei die Positionierung von Herrn Martens.', punkte: 6 },
  '5.2': { nr: '5.2', text: 'Kennzeichnen Sie in Ihrer Antwort zu 5.1 jede Maßnahme, die Sie nur nach ärztlicher Anordnung durchführen dürfen, mit „n. ä. A.“.', punkte: 1 }
};
// 5.1 und 5.2 haben einen gemeinsamen Erwartungshorizont
const LOESUNG_5 = [
  'z. B.: Hilfe holen: eine Kollegin setzt den Notruf 112 ab (Notärztin nötig); Herrn Martens nicht allein lassen.',
  'Oberkörper hoch (halbsitzend), weil Atemnot und Schwellung im Vordergrund stehen (Kloßgefühl, pfeifende Einatmung, 28/min): Die Atemhilfsmuskulatur kann arbeiten. Keine Schocklage – auch wegen der Herzinsuffizienz. Nicht aufstehen oder gehen lassen.',
  'Vitalzeichen engmaschig überwachen: Atmung, Puls, Blutdruck, Bewusstsein, wenn vorhanden SpO₂ (Schockindex 124 : 92 ≈ 1,3).',
  'Beengende Kleidung am Hals öffnen; Einstichstelle zusätzlich kühlen (Kühlpack in ein Tuch gewickelt).',
  'Nichts zu essen oder zu trinken geben (Schwellung, Aspirationsgefahr).',
  'Adrenalin i. m. (n. ä. A.) – gibt hier die Notärztin, da keine Anordnung und kein Notfallset vorliegen; Sauerstoff (n. ä. A.).',
  'Uhrzeit, Werte und Maßnahmen notieren; bei Bewusstlosigkeit mit normaler Atmung stabile Seitenlage, ohne normale Atmung Reanimation (KB III).',
  '5.1: je beschriebene Maßnahme 1 P. (max. 5), Begründung der Positionierung 1 P.; Schocklage trotz Atemnot oder Antihistaminikum statt Adrenalin wird nicht gewertet. 5.2: 1 P., wenn alle Medikamenten- und Sauerstoff-Maßnahmen mit „n. ä. A.“ gekennzeichnet sind.'
];

// Hausaufgabe: ein neuer Fall im Prüfungsformat (13 Punkte)
const HAUSAUFGABE = {
  titel: 'Hausaufgabe · Ein neuer Fall (ca. 17 Minuten · 13 Punkte)',
  hinweis: 'Lesen Sie vorher die **Merksätze AA1, AA3 und AA4**. Dann schreiben Sie ohne Hilfsmittel.',
  situation: [
    'Sie sind Auszubildende bzw. Auszubildender in der Rehaklinik „Talblick“. Frau Sabine Lorenz (52) ist seit einer Woche nach einer Bandscheibenoperation bei Ihnen. In ihrem Allergiepass steht eine Fischallergie.',
    'Um 12:20 Uhr isst sie Gemüsecurry mit Fischsauce. Um 12:35 Uhr klingelt sie. Sie kratzt sich an den Händen und an der Kopfhaut, am Bauch sind Quaddeln. „Mir ist so schwindelig und übel.“ Sie ist blass und unruhig. Puls 124/min, Blutdruck 86/52 mmHg (am Morgen: Puls 72/min, Blutdruck 128/78 mmHg), Atemfrequenz 20/min, Sauerstoffsättigung 96 %. Ihre Stimme klingt normal, sie hat keine Atemnot. Die Stationsärztin ist im Haus; es gibt eine Notfall-SOP für allergische Notfälle.'
  ],
  rahmen1: 'Pflegefachpersonen schätzen akute Situationen anhand von Beobachtungen und Messwerten ein.',
  aufgabe1: { nr: '1.1', text: 'Begründen Sie anhand von 4 Symptomen aus der Situation, welche Schockform bei Frau Lorenz vorliegt.', punkte: 4 },
  loesung1: [
    'Anaphylaktischer Schock. Begründung z. B. (je Symptom mit Zuordnung 1 P.): zeitlicher Zusammenhang – Beginn 15 Min. nach dem Essen mit Fischsauce bei bekannter Fischallergie · Haut – Juckreiz an Händen und Kopfhaut, Quaddeln am Bauch · Kreislauf – Puls 124/min, Blutdruckabfall von 128/78 auf 86/52 mmHg, Blässe, Schwindel · Magen-Darm – Übelkeit · Gehirn – Unruhe (Minderdurchblutung).',
    'Für die volle Punktzahl muss die Kreislaufbeteiligung genannt sein – ein Schock zeigt sich immer am Kreislauf.'
  ],
  rahmen2: 'Pflegefachpersonen leiten in lebensbedrohlichen Situationen Sofortmaßnahmen ein.',
  aufgaben2: [
    { nr: '2.1', text: 'Beschreiben Sie stichwortartig 6 Sofortmaßnahmen, die Sie bei Frau Lorenz einleiten. Begründen Sie die Positionierung.', punkte: 7 },
    { nr: '2.2', vorsatz: 'Fünf Minuten später ist Frau Lorenz heiser und sagt: „Ich krieg so schlecht Luft.“ Die Sauerstoffsättigung sinkt auf 90 %.', text: 'Begründen Sie, wie Sie Frau Lorenz jetzt positionieren.', punkte: 2 }
  ],
  loesung2: [
    '2.1 z. B.: nicht weiteressen (Allergen stoppen) · Hilfe holen: Stationsärztin bzw. Notfallteam alarmieren, Frau Lorenz nicht allein lassen · flach lagern, Beine hoch, weil Kreislaufzeichen ohne Atemnot im Vordergrund stehen → mehr Blut zum Herzen; nicht aufsetzen oder aufstehen lassen · Adrenalin i. m. nach Notfall-SOP bzw. ärztlicher Anordnung vorbereiten/verabreichen (Außenseite Oberschenkel) · venösen Zugang und Volumengabe n. ä. A. vorbereiten · Sauerstoff n. ä. A./SOP · Vitalzeichen engmaschig (Puls, Blutdruck, Atmung, SpO₂, Bewusstsein) · Uhrzeit, Symptome und Maßnahmen dokumentieren.',
    '(je Maßnahme 1 P., max. 6 P.; Begründung der Positionierung 1 P.; Antihistaminikum statt Adrenalin wird nicht gewertet)',
    '2.2 Jetzt Oberkörper hoch (halbsitzend), weil die Atemnot im Vordergrund steht (Heiserkeit = Schleimhautschwellung, SpO₂ 90 %): Die Atemhilfsmuskulatur kann arbeiten. Trotzdem nicht auf die Bettkante setzen oder aufstehen lassen; Kreislauf weiter überwachen und die Ärztin über die Verschlechterung informieren. (Positionierung 1 P., Begründung 1 P.)'
  ]
};

// Inhaltliche Hinweise für die Lehrerversion (digitale und analoge Fassung)
const LV_HINWEISE = {
  leitlinie: 'Die Lagerungsempfehlungen folgen der S2k-Leitlinie Anaphylaxie (AWMF 061-025, 2021): symptomorientiert; Flachlagerung und Vermeiden abrupter Lageveränderungen (Aufsitzen, Aufstehen) als Grundstrategie; bei führender Atemnot (halb-)sitzend; bei eingeschränktem Bewusstsein und intaktem Kreislauf stabile Seitenlage; zur Kreislaufverbesserung Beine hoch.',
  adrenalin: 'Adrenalin i. m. laut Leitlinie 0,15–0,6 mg in die Außenseite des Oberschenkels, Autoinjektoren 0,15/0,3/0,5 mg, Wiederholung nach ca. 5–10 min. Antihistaminika: langsamerer Wirkungseintritt, Wirkung auf Kreislauf und Bronchokonstriktion nicht belegt, lebensrettende Sofortmaßnahmen dürfen nicht verzögert werden. Glukokortikoide: untergeordnete Rolle in der Akutphase. Die KA-Lösung nennt „Erwachsene 0,5 mg“ – das liegt in diesem Bereich.',
  leitfall: 'Der Leitfall ist belastend (Christin, Reanimation). AA6 bleibt bewusst fachlich (Kausalkette, verpasste Chancen) und bewertet Christin nicht; Erleben, Hilflosigkeit und Verarbeitung sind Thema in KB II und KB V.',
  uebungsfaelle: 'Die Übungsfälle vermeiden bewusst die Personen und Auslöser der Klassenarbeit (Frau Sommer, Herr Brenner, Antibiotika-Kurzinfusion), damit die KA den Transfer prüft.',
  nichtEnthalten: 'KB II: psychologische Erste Hilfe, Beruhigen, Notfalleinwilligung, SPIKES/NURSE, SAfE · KB III: Reanimation, ABCDE-Schema, Notaufnahme/Triage, PTBS (nur Verweise) · KB IV: Delegationsrecht, Haftung, unterlassene Hilfeleistung, Ersthelferschutz, Patientenverfügung · KB V: eigene Überforderung · Deutsch: Notruf absetzen, SBAR · Pädiatrie (3. AJ): Anaphylaxie bei Kindern · Anatomie: Pathophysiologie der Lungenembolie (1. AJ, nur aktiviert).',
  quellen: 'S2k-Leitlinie Akuttherapie und Management der Anaphylaxie, AWMF 061-025, Update 2021 (Ring et al., Allergo J Int 2021;30:1–25) · MSD Manual Profi-Ausgabe: Schock · Landeslehrplan Berufsfachschule Pflege BW, CE 06 · BW-Abschlussprüfungen Mai 2023–Mai 2026 (Operatoren, Aufgabenformat)'
};

module.exports = {
  LINK_BASIS, SEITEN, MERKSAETZE, EXPERTEN, ENTSCHEIDUNG, LAGERUNGSKARTEN,
  LERNZIEL, FALLBEZUG, LEITFRAGE, KETTE, LEITFRAGE_ANTWORT, VERGLEICH, GEMEINSAMKEIT, PIKTO, ANAPHYLAXIE_LAGERUNG,
  WER_DARF_WAS, WER_DARF_WAS_KOPF, AZUBI, ADRENALIN_TEXT, DIALOG, TRANSFERFALL, TRANSFER_RAHMEN, AUFGABEN, LOESUNG_5, HAUSAUFGABE, LV_HINWEISE
};

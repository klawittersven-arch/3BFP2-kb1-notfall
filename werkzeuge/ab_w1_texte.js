/* Woche 1 (SW 6) – gemeinsame Texte für Arbeitsblatt und Lehrerversion.
   Merksätze und Einstiegsfragen stehen auch in docs/w1/inhalte.js (App); tests/w1.test.js prüft, dass beide übereinstimmen.
   Schreibweise: **fett**; Schlüsselwörter im Merksatz als { l: 'Wort' }. */
'use strict';

const LINK_BASIS = 'klawittersven-arch.github.io/3BFP2-kb1-notfall/';
const SEITEN = { stunde: 'w1.html' };

const MERKSAETZE = {
  aa1: ['Frühzeichen eines Schocks finde ich im Fall an drei Stellen: ', { l: 'Aussagen und Verhalten' }, ', ', { l: 'Beobachtungen' }, ' und ', { l: 'Messwerte' }, '. Werte lese ich immer mit ', { l: 'Uhrzeit' }, ' und ', { l: 'Vorwert' }, ' – wichtig ist der ', { l: 'Verlauf' }, '.'],
  aa2: ['Fällt der Blutdruck, melden das die ', { l: 'Barorezeptoren' }, '. Der ', { l: 'Sympathikus' }, ' lässt das Herz schneller schlagen und macht die Gefäße eng (', { l: 'Zentralisation' }, '). ', { l: 'RAAS' }, ' und ', { l: 'ADH' }, ' halten Wasser zurück. So bleibt der Blutdruck zuerst fast normal: ', { l: 'Kompensation' }, '.'],
  aa3: ['Reicht der Ausgleich nicht mehr, entsteht im Gewebe ohne Sauerstoff ', { l: 'Laktat' }, ', das Blut wird sauer (', { l: 'Laktatazidose' }, '). Die Gefäße werden weit, das Blut ', { l: 'versackt' }, ', der Blutdruck fällt (', { l: 'Dekompensation' }, '), die Organe ', { l: 'versagen' }, ': ein Teufelskreis – die Schockspirale.'],
  aa4: ['Frühzeichen eines Schocks sind ', { l: 'Tachykardie' }, ', schnelle Atmung, ', { l: 'Unruhe' }, ', Blässe und kalter Schweiß. Der Blutdruck fällt erst ', { l: 'spät' }, '. ', { l: 'Schockindex' }, ' = Puls : systolischer Blutdruck (normal ca. 0,5) – über ', { l: '1' }, ' spricht für einen Schock.']
};

const ENTSCHEIDUNG = [
  { nr: 'E1', frage: 'Frau Maler um 11 Uhr: Puls 118/min, Blutdruck 105/70 mmHg. Ist ihr Kreislauf in Ordnung?', optionen: ['A Ja – der Blutdruck ist fast normal.', 'B Nein – sie kann trotzdem in Lebensgefahr sein.'], richtig: 'B', erklaerung: 'Der Körper hält den Blutdruck durch Ausgleich (Kompensation). Puls 118/min, Blässe und kalter Schweiß zeigen: Der Kreislauf arbeitet hart. Schockindex 118 : 105 ≈ 1,1 → Schockgefahr.' },
  { nr: 'E2', frage: 'Der Blutdruck droht zu fallen. Was macht der Körper zuerst?', optionen: ['A Das Herz schlägt langsamer, damit es Kraft spart.', 'B Die Niere scheidet mehr Urin aus.', 'C Das Herz schlägt schneller und die Gefäße werden eng.'], richtig: 'C', erklaerung: 'Die Barorezeptoren melden den Druckabfall. Der Sympathikus macht das Herz schneller und die Gefäße eng. Die Niere hält Wasser zurück – es gibt weniger Urin.' },
  { nr: 'E3', frage: 'Warum ist Frau Maler blass und hat kalten Schweiß auf der Stirn?', optionen: ['A Die Gefäße in der Haut sind eng – das Blut fließt zu Herz und Gehirn.', 'B Sie friert, weil das Zimmer kalt ist.', 'C Sie ist nur aufgeregt, weil alles neu ist.'], richtig: 'A', erklaerung: 'Zentralisation: Der Sympathikus macht die Gefäße in Haut, Muskeln und Darm eng. Herz und Gehirn werden weiter versorgt. Der Sympathikus regt auch die Schweißdrüsen an.' }
];

/* Fallbezug: wörtlich aus dem Fallbeispiel „Reanimation – und nicht nur ich war hilflos“ (nicht ändern) */
const FALL = {
  einleitung: 'Frau Maler, 71 Jahre, ist seit gestern neu im Pflegeheim. Vor drei Wochen erhielt sie nach einer Schenkelhalsfraktur eine Hüft-TEP. Seit der Entlassung liegt sie die meiste Zeit im Bett.',
  zitat: '„Gegen elf Uhr wirkte sie unruhig, atmete schnell und sagte, sie bekomme schlecht Luft. Sie war blass, hatte kalten Schweiß auf der Stirn, ihr Puls lag bei 118/min und der Blutdruck bei 105/70 mmHg. Ich dachte, sie sei nur aufgeregt, weil alles neu für sie ist.“'
};
const LEITFRAGE = 'Der Blutdruck ist doch fast normal. Warum ist Frau Maler trotzdem in Gefahr?';

const INFO1 = [
  'Die Organe brauchen Sauerstoff. Dafür muss das Blut mit genug Druck durch die Gefäße fließen. Der Blutdruck hängt ab vom **Herzzeitvolumen** (**HZV = Schlagvolumen × Herzfrequenz**) und vom **Widerstand der Gefäße**: Enge Gefäße → höherer Druck.',
  '**Fällt der Blutdruck**, merken das Druckfühler in der Aorta und in der Halsschlagader: die **Barorezeptoren**. Sie melden es dem Kreislaufzentrum im Gehirn. In Sekunden wird der **Sympathikus** aktiv. Die Nebennieren geben Adrenalin und Noradrenalin ins Blut. Die Folgen:',
  '• Das Herz schlägt **schneller** und kräftiger → das HZV steigt.',
  '• Die Gefäße in **Haut, Muskeln, Niere und Darm** werden **eng**. Das Blut fließt vor allem zu **Herz und Gehirn**: **Zentralisation**. Die Haut wird **blass und kalt**, der Sympathikus macht **kalten Schweiß**.',
  'In Minuten bis Stunden hilft die **Niere**: Das **Renin-Angiotensin-Aldosteron-System (RAAS)** macht die Gefäße eng und hält **Wasser und Natrium** zurück. Das Hormon **ADH** hält zusätzlich Wasser zurück. Die Person hat **Durst** und scheidet **wenig Urin** aus.',
  'Die Barorezeptoren **messen immer weiter**: Ist der Druck noch zu niedrig, bleibt der Sympathikus aktiv. So entsteht ein **Regelkreis**. Reicht dieser Ausgleich, bleibt der Blutdruck **fast normal**: **Kompensation**. Ein fast normaler Blutdruck heißt also **nicht**, dass alles in Ordnung ist!'
];
const WOERTER1 = 'Barorezeptoren = Druckfühler in der Gefäßwand · Sympathikus = Teil des Nervensystems für Leistung und Gefahr · Zentralisation = das Blut fließt vor allem zu Herz und Gehirn · Kompensation = Ausgleich · ADH = Hormon, das Wasser im Körper hält';

const INFO2 = [
  'Ein **Schock** ist ein **akutes Kreislaufversagen**: Die Organe bekommen **nicht genug Sauerstoff**. Es besteht **Lebensgefahr**! Nach der Ursache gibt es **vier Schockformen** (Tabelle unten).',
  'Zu Beginn gleicht der Körper aus: **kompensierter Schock** (Arbeitsblatt „Schock: Wie der Körper den Blutdruck hält“). Hält die Ursache an, reicht der Ausgleich nicht mehr: **dekompensierter Schock**. Ohne Sauerstoff entsteht im Gewebe **Laktat**, das Blut wird **sauer**, die Gefäße werden **weit**, der **Blutdruck fällt**, die **Organe versagen**. Ein **Teufelskreis**: die **Schockspirale** (AA2).'
];
const WOERTER2 = 'hypovolämisch = zu wenig Volumen · distributiv = falsch verteilt · kardiogen = vom Herzen aus · obstruktiv = durch ein Hindernis · Laktat = Milchsäure · Azidose = Blut zu sauer';

const SCHOCKFORMEN = [
  ['hypovolämisch', 'zu wenig Volumen', 'starke Blutung, Verbrennung, Durchfall, Erbrechen'],
  ['distributiv', 'Gefäße zu weit, Blut falsch verteilt', 'anaphylaktisch (Allergie), neurogen (Rückenmark), septisch (Infektion)'],
  ['kardiogen', 'das Herz pumpt nicht genug', 'Herzinfarkt'],
  ['obstruktiv', 'der Blutfluss ist behindert', 'Lungenembolie']
];

/* Frühzeichen und Spätzeichen (nach Pflegias Band 2, S. 801, Tab. 1 „Typische Symptome bei Schock“, Erwachsene) */
const FRUEH_SPAET = [
  ['Puls', 'schnell (über 100/min), schwach', 'sehr schnell (über 120/min)'],
  ['Blutdruck (systolisch)', 'normal', 'unter 100 mmHg'],
  ['Haut', 'blass, kühl, feucht', 'klebriger Schweiß, Zyanose'],
  ['Atmung', 'schneller', 'sehr schnell (Hyperventilation)'],
  ['Bewusstsein', 'ängstlich, unruhig', 'teilnahmslos, benommen'],
  ['Urin', 'weniger', 'kaum oder kein Urin']
];

const TRANSFERFALL = [
  'Sie sind Auszubildende bzw. Auszubildender auf einer chirurgischen Station. Frau Monika Berger (58) wurde gestern an der Gallenblase operiert. Morgenrunde um 8 Uhr: Puls 84/min, Blutdruck 135/80 mmHg. Frau Berger frühstückt, liest Zeitung und sagt, es gehe ihr „eigentlich ganz gut“.',
  'Um 10:30 Uhr klingelt Frau Berger. Sie wirkt ängstlich und fragt mehrmals, ob sie etwas trinken darf. Sie sagt: „Mir ist so komisch.“ Ihre Haut ist blass und feucht, die Hände sind kalt. Sie messen: Puls 118/min, Blutdruck 112/90 mmHg, Atemfrequenz 24/min.'
];

module.exports = { LINK_BASIS, SEITEN, MERKSAETZE, ENTSCHEIDUNG, FALL, LEITFRAGE, INFO1, WOERTER1, INFO2, WOERTER2, SCHOCKFORMEN, FRUEH_SPAET, TRANSFERFALL };

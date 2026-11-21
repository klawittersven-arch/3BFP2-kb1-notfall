/* Präsentationen Woche 4 (KB I · Notfallsituationen · 3BFP2): je eine kurze Folienreihe vor jedem Arbeitsblatt.
     1  Stundeneinstieg  → Blatt 1 „Wirbelsäulenverletzung: nicht bewegen – aber richtig“
     2  Gelenkstelle     → Blatt 2 „Innere Blutung: den Verlauf im Blick“
     3  Gelenkstelle     → Blatt 3 „Atemwege: wenn etwas im Hals stecken bleibt“
   Texte kommen aus derselben Quelle wie die Arbeitsblätter (werkzeuge/ab_w4_texte.js, docs/w4/inhalte.js).
   Digitale Fassung (Handy-Übungen). Ablauf und Lehrerhandeln stehen in den Notizen jeder Folie.

   Aufruf (im Hauptverzeichnis), einmalig Pakete in einen Werkzeugordner installieren:
     npm install --prefix /tmp/praes pptxgenjs react react-dom react-icons sharp
     NODE_PATH=/tmp/praes/node_modules node werkzeuge/praes_w4.js [pfad/zu/apply_theme.js]
   Ausgabe: arbeitsblatt/KB1_W4_Praesentation_{1,2,3}_*.pptx */
'use strict';
const path = require('path');
const fs = require('fs');
const pptxgen = require('pptxgenjs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const sharp = require('sharp');
const fa = require('react-icons/fa');
const md = require('react-icons/md');
const T = require('./ab_w4_texte.js');
const W4 = require('../docs/w4/inhalte.js');

const AUS = path.join(__dirname, '..', 'arbeitsblatt');
const BILD = (n) => path.join(__dirname, 'bilder', n);
const THEMA_SKRIPT = process.argv[2];

// Farben wie auf den Arbeitsblättern und am Handy: Petrol (Kopf), Lachs (Kästen), Orange (Akzent), Ampel
const THEME = {
  name: 'KB1 Woche 4 – Was man nicht sieht',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '1F2D33', lt1: 'FFFFFF', dk2: '25434B', lt2: 'F2F5F6',
    accent1: 'C55A11', accent2: 'F1A983', accent3: '2E75B6', accent4: '2E8B57', accent5: 'C98A00', accent6: 'C0392B',
    hlink: '2E75B6', folHlink: '6B4F8F'
  }
};
const HEX = { petrol: '25434B', lachs: 'F1A983', orange: 'C55A11', gruen: '2E8B57', gelb: 'C98A00', rot: 'C0392B', grau: '6B7A80', weiss: 'FFFFFF', tinte: '1F2D33' };
const W = 13.333, H = 7.5;
const FUSS = 'KB I · Woche 4 · Was man nicht sieht';

/* ---------- Icons (react-icons → PNG) ---------- */
const iconCache = new Map();
async function icon(name, farbe, groesse = 256) {
  const k = name + farbe;
  if (iconCache.has(k)) return iconCache.get(k);
  const Comp = fa[name] || md[name];
  if (!Comp) throw new Error('Icon fehlt: ' + name);
  const svg = renderToStaticMarkup(React.createElement(Comp, { color: '#' + farbe, size: groesse }));
  const png = await sharp(Buffer.from(svg)).resize(groesse, groesse, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const data = 'image/png;base64,' + png.toString('base64');
  iconCache.set(k, data);
  return data;
}

/* ---------- Ein Foliensatz ---------- */
async function foliensatz(datei, titelDerDatei, bau) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = titelDerDatei;
  pres.author = 'KB I · 3BFP2';
  pres.company = 'Karoline-Breitinger-Schule Künzelsau';
  const C = pres.SchemeColor;

  // Layout „Titel“ (dunkel): Logo auf weißem Chip, Kicker, Titel, Untertitel
  pres.defineSlideMaster({
    title: 'W4 Titel',
    background: { color: HEX.petrol },
    objects: [
      { rect: { x: 0.6, y: 0.45, w: 2.35, h: 0.78, fill: { color: HEX.weiss }, rectRadius: 0.12, shape: pres.ShapeType.roundRect } },
      { image: { x: 0.72, y: 0.55, w: 2.1, h: 0.55, path: BILD('logo_kbs.png') } },
      { placeholder: { options: { name: 'kicker', type: 'body', x: 0.6, y: 1.75, w: 12.1, h: 0.5, fontSize: 18, bold: true, color: C.accent2, margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 2.25, w: 12.1, h: 1.35, fontSize: 42, bold: true, color: C.background1, margin: 0, valign: 'top', align: 'left' }, text: '' } },
      { placeholder: { options: { name: 'unter', type: 'body', x: 0.6, y: 3.6, w: 12.1, h: 0.8, fontSize: 22, color: C.background1, margin: 0, valign: 'top' }, text: '' } }
    ]
  });
  // Layout „Inhalt“ (hell): Titel oben, Logo oben rechts, Fußzeile und Foliennummer
  pres.defineSlideMaster({
    title: 'W4 Inhalt',
    background: { color: HEX.weiss },
    objects: [
      { image: { x: 11.05, y: 0.42, w: 1.75, h: 0.46, path: BILD('logo_kbs.png') } },
      { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.35, w: 10.2, h: 0.95, fontSize: 32, bold: true, color: C.text2, margin: 0, valign: 'middle', align: 'left' }, text: '' } },
      { text: { text: FUSS, options: { x: 0.6, y: 6.95, w: 8, h: 0.35, fontSize: 11, color: HEX.grau, margin: 0 } } }
    ],
    slideNumber: { x: 12.2, y: 6.95, w: 0.6, h: 0.35, fontSize: 11, color: HEX.grau, align: 'right' }
  });
  // Layout „Zitat“ (dunkel): großes Zitat und Quelle
  pres.defineSlideMaster({
    title: 'W4 Zitat',
    background: { color: HEX.petrol },
    objects: [
      { text: { text: '„', options: { x: 0.55, y: 0.35, w: 1.6, h: 1.8, fontSize: 140, bold: true, color: HEX.lachs, margin: 0, fontFace: 'Calibri' } } },
      { placeholder: { options: { name: 'zitat', type: 'body', x: 1.4, y: 1.55, w: 10.6, h: 2.9, fontSize: 34, italic: true, color: C.background1, margin: 0, valign: 'middle' }, text: '' } },
      { placeholder: { options: { name: 'quelle', type: 'body', x: 1.4, y: 4.55, w: 10.6, h: 0.9, fontSize: 20, color: C.accent2, margin: 0, valign: 'top' }, text: '' } },
      { text: { text: FUSS, options: { x: 0.6, y: 6.95, w: 8, h: 0.35, fontSize: 11, color: 'B8C7CC', margin: 0 } } }
    ]
  });

  const h = { pres, C, icon, karte: null, abschnitt: (t) => pres.addSection({ title: t }) };

  // Karte mit Icon im Kreis, Überschrift und Text
  h.karte = async (slide, o) => {
    const { x, y, w, hh, iconName, iconFarbe = HEX.weiss, kreis = C.accent1, kopf, text, fill = C.background2, kopfFarbe = C.text2, textSize = 20, name } = o;
    slide.addShape(pres.ShapeType.roundRect, { x, y, w, h: hh, fill: { color: fill }, line: { color: fill, width: 0 }, rectRadius: 0.15, objectName: name + ' Karte' });
    slide.addShape(pres.ShapeType.ellipse, { x: x + 0.3, y: y + 0.3, w: 0.8, h: 0.8, fill: { color: kreis }, line: { color: kreis, width: 0 }, objectName: name + ' Kreis' });
    slide.addImage({ data: await icon(iconName, iconFarbe), x: x + 0.47, y: y + 0.47, w: 0.46, h: 0.46, altText: kopf, objectName: name + ' Icon' });
    slide.addText(kopf, { x: x + 0.3, y: y + 1.25, w: w - 0.6, h: 0.75, fontSize: 22, bold: true, color: kopfFarbe, margin: 0, valign: 'top', isTextBox: true, objectName: name + ' Kopf' });
    if (text) slide.addText(text, { x: x + 0.3, y: y + 1.95, w: w - 0.6, h: hh - 2.15, fontSize: textSize, color: C.text1, margin: 0, valign: 'top', isTextBox: true, objectName: name + ' Text' });
  };

  // Kennzeichnung unter dem Folientitel: „Arbeitsblatt n: „Titel““ – so wissen die SuS auch in einer Folgewoche, welches Blatt gemeint ist
  h.ab = async (slide, n) => {
    const titel = AB_TITEL[n], w = Math.min(12.13, 0.8 + (16 + titel.length) * 0.125);
    slide.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 1.32, w, h: 0.46, fill: { color: C.accent2, transparency: 65 }, line: { color: HEX.lachs, width: 0 }, rectRadius: 0.1, objectName: 'Arbeitsblatt Kennung' });
    slide.addImage({ data: await icon('FaFileAlt', HEX.orange), x: 0.74, y: 1.39, w: 0.32, h: 0.32, altText: 'Arbeitsblatt', objectName: 'Arbeitsblatt Icon' });
    slide.addText([{ text: `Arbeitsblatt ${n}: `, options: { bold: true } }, { text: `„${titel}“` }], { x: 1.16, y: 1.32, w: w - 0.65, h: 0.46, fontSize: 17, color: C.text2, valign: 'middle', margin: 0, isTextBox: true, objectName: 'Arbeitsblatt Name' });
  };

  // Fahrplan: drei Notfälle der Stunde (= drei Arbeitsblätter) – erledigt (grün, Haken), aktuell (lachs), kommt noch (Umriss)
  h.fahrplan = async (slide, aktiv) => {
    const namen = ['Wirbelsäule', 'Innere Blutung', 'Atemwege'];
    const mitten = [2.9, 6.67, 10.43], yK = 5.05, d = 0.9;
    slide.addShape(pres.ShapeType.line, { x: mitten[0], y: yK + d / 2, w: mitten[2] - mitten[0], h: 0, line: { color: '7F959C', width: 2, dashType: 'dash' }, objectName: 'Fahrplan Linie' });
    for (let i = 0; i < 3; i++) {
      const nr = i + 1, erledigt = nr < aktiv, jetzt = nr === aktiv;
      const fill = erledigt ? C.accent4 : (jetzt ? C.accent2 : C.text2);
      slide.addShape(pres.ShapeType.ellipse, { x: mitten[i] - d / 2, y: yK, w: d, h: d, fill: { color: fill }, line: { color: jetzt ? HEX.lachs : (erledigt ? HEX.gruen : 'B8C7CC'), width: 2 }, objectName: 'Fahrplan ' + nr });
      if (erledigt) slide.addImage({ data: await icon('FaCheck', HEX.weiss), x: mitten[i] - 0.24, y: yK + 0.21, w: 0.48, h: 0.48, altText: 'erledigt', objectName: 'Fahrplan Haken ' + nr });
      else slide.addText(String(nr), { x: mitten[i] - d / 2, y: yK, w: d, h: d, fontSize: 28, bold: true, align: 'center', valign: 'middle', color: jetzt ? C.text2 : 'B8C7CC', margin: 0, isTextBox: true, objectName: 'Fahrplan Zahl ' + nr });
      slide.addText([{ text: 'Arbeitsblatt ' + nr, options: { fontSize: 14, breakLine: true } }, { text: namen[i], options: { fontSize: 18, bold: jetzt } }], { x: mitten[i] - 1.6, y: yK + d + 0.1, w: 3.2, h: 0.8, align: 'center', valign: 'top', color: jetzt ? HEX.lachs : 'DCE5E8', margin: 0, isTextBox: true, objectName: 'Fahrplan Name ' + nr });
    }
  };

  // Arbeitsschritte eines Blatts als Reihe von Karten (Nummer, Überschrift, Text, Sozialform)
  h.schritte = async (slide, liste, o = {}) => {
    const x0 = o.x0 ?? 0.6, breite = o.breite ?? 12.13, y = o.y ?? 1.65, hh = o.hh ?? 4.85, abstand = 0.3;
    const w = (breite - abstand * (liste.length - 1)) / liste.length;
    for (let i = 0; i < liste.length; i++) {
      const s = liste[i], x = x0 + i * (w + abstand);
      slide.addShape(pres.ShapeType.roundRect, { x, y, w, h: hh, fill: { color: s.fill || C.background2 }, line: { color: s.fill || C.background2, width: 0 }, rectRadius: 0.15, objectName: s.nr + ' Karte' });
      slide.addShape(pres.ShapeType.ellipse, { x: x + 0.3, y: y + 0.3, w: 0.8, h: 0.8, fill: { color: s.kreis || C.accent1 }, line: { color: s.kreis || C.accent1, width: 0 }, objectName: s.nr + ' Kreis' });
      slide.addImage({ data: await icon(s.icon, HEX.weiss), x: x + 0.47, y: y + 0.47, w: 0.46, h: 0.46, altText: s.kopf, objectName: s.nr + ' Icon' });
      slide.addText(s.nr, { x: x + 1.25, y: y + 0.3, w: w - 1.45, h: 0.8, fontSize: 22, bold: true, color: C.accent1, valign: 'middle', margin: 0, isTextBox: true, objectName: s.nr + ' Nummer' });
      slide.addText(s.kopf, { x: x + 0.3, y: y + 1.3, w: w - 0.6, h: 0.95, fontSize: 21, bold: true, color: C.text2, valign: 'top', margin: 0, isTextBox: true, objectName: s.nr + ' Kopf' });
      slide.addText(s.text, { x: x + 0.3, y: y + 2.3, w: w - 0.6, h: hh - 3.1, fontSize: o.textSize ?? 18, color: C.text1, valign: 'top', margin: 0, isTextBox: true, objectName: s.nr + ' Text' });
      slide.addText(s.form, { x: x + 0.3, y: y + hh - 0.75, w: w - 0.6, h: 0.5, fontSize: 15, bold: true, color: HEX.grau, valign: 'middle', margin: 0, isTextBox: true, objectName: s.nr + ' Sozialform' });
    }
  };

  await bau(h);
  const ziel = path.join(AUS, datei);
  await pres.writeFile({ fileName: ziel });
  if (THEMA_SKRIPT && fs.existsSync(THEMA_SKRIPT)) await require(THEMA_SKRIPT).applyTheme(ziel, THEME);
  else console.warn('Hinweis: apply_theme.js nicht angegeben – Theme-Farben bleiben Office-Standard (Folien sehen trotzdem gleich aus).');
  console.log('geschrieben:', ziel);
}

const lz = (s) => s.replace(/\*\*/g, '');
const AB_TITEL = { 1: T.B1.kopf, 2: T.B2.kopf, 3: T.B3.kopf };

/* =====================================================================
   1 · Stundeneinstieg → Blatt 1
   ===================================================================== */
async function praes1() {
  await foliensatz('KB1_W4_Praesentation_1_Einstieg_Wirbelsaeule.pptx', 'Woche 4 · Einstieg · Arbeitsblatt 1 Wirbelsäulenverletzung', async ({ pres, C, karte, fahrplan, schritte, abschnitt, ab }) => {
    abschnitt('Einstieg');
    let s = pres.addSlide({ masterName: 'W4 Titel', sectionTitle: 'Einstieg' });
    s.addText('KB I · Notfallsituationen · Woche 4', { placeholder: 'kicker' });
    s.addText('Was man nicht sieht', { placeholder: 'title' });
    s.addText('Drei Notfälle, die man nicht auf den ersten Blick erkennt', { placeholder: 'unter' });
    await fahrplan(s, 1);
    s.addNotes('Stundeneinstieg (0–4 min). Arbeitsblatt 1 noch NICHT austeilen. Kurz den Fahrplan zeigen: drei Notfälle, die man nicht sieht – heute beginnen wir mit Notfall 1. Dann die Szene spielen (nächste Folie).');

    s = pres.addSlide({ masterName: 'W4 Zitat', sectionTitle: 'Einstieg' });
    s.addText('Helfen Sie mir hoch, ich muss zum Mittagessen!', { placeholder: 'zitat' });
    s.addText('Herr Pfeiffer (79) ist im Treppenhaus rückwärts sechs Stufen hinuntergestürzt.', { placeholder: 'quelle' });
    s.addText('Was tun Sie?', { x: 1.4, y: 5.55, w: 10.6, h: 0.8, fontSize: 30, bold: true, color: HEX.lachs, margin: 0, isTextBox: true, objectName: 'Frage' });
    s.addNotes('Szenischer Einstieg: Sie liegen auf dem Boden und spielen Herrn Pfeiffer („Ich bin Herr Pfeiffer, 79. Ich bin die Treppe runtergefallen. Helfen Sie mir hoch, ich muss zum Mittagessen!“). Wer kommt? Reaktionen sammeln (hochhelfen? festhalten?), NICHT auflösen. Ziel: kognitiver Konflikt „helfen = hochhelfen?“; Vorwissen aus Woche 2 (Lagerung „nicht bewegen“) aktivieren.');

    abschnitt('Leitfrage und Ziel');
    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Leitfrage und Ziel' });
    s.addText('Darf Herr Pfeiffer aufstehen?', { placeholder: 'title' });
    s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 1.65, w: 7.6, h: 4.85, fill: { color: C.accent2, transparency: 65 }, line: { color: HEX.lachs, width: 0 }, rectRadius: 0.15, objectName: 'Leitfrage Karte' });
    s.addText([
      { text: 'Herr Pfeiffer will aufstehen. Darf er das?', options: { bold: true, fontSize: 30, color: C.text2, breakLine: true } },
      { text: ' ', options: { fontSize: 14, breakLine: true } },
      { text: 'Woran erkennen Sie, dass es gefährlich sein könnte?', options: { fontSize: 24, color: C.text1 } }
    ], { x: 1.0, y: 2.0, w: 6.8, h: 3.0, margin: 0, valign: 'top', isTextBox: true, objectName: 'Leitfrage' });
    s.addText('Sammeln Sie Vermutungen. Die Antwort finden Sie auf Arbeitsblatt 1.', { x: 1.0, y: 5.4, w: 6.8, h: 0.7, fontSize: 16, italic: true, color: HEX.grau, margin: 0, isTextBox: true, objectName: 'Hinweis' });
    s.addShape(pres.ShapeType.ellipse, { x: 9.3, y: 2.05, w: 2.9, h: 2.9, fill: { color: C.text2 }, line: { color: HEX.petrol, width: 0 }, objectName: 'Icon Kreis' });
    s.addImage({ data: await icon('MdStairs', HEX.lachs), x: 9.95, y: 2.7, w: 1.6, h: 1.6, altText: 'Treppe', objectName: 'Icon Treppe' });
    s.addText('Sturz rückwärts, Kopf an die Wand', { x: 8.7, y: 5.2, w: 4.1, h: 0.6, fontSize: 16, align: 'center', color: HEX.grau, margin: 0, isTextBox: true, objectName: 'Bildunterschrift' });
    s.addNotes('Leitfrage stehen lassen – die SuS beantworten sie mit Arbeitsblatt 1 (AA1 Hinweise im Fall, Merksatz, AA4). Am Ende von Arbeitsblatt 1 auf die Folie zurückkommen.');

    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Leitfrage und Ziel' });
    s.addText('Ihr Ziel für Arbeitsblatt 1', { placeholder: 'title' });
    await ab(s, 1);
    await karte(s, { x: 0.6, y: 1.95, w: 8.6, hh: 4.55, iconName: 'FaUserInjured', kopf: 'Lernziel', text: T.B1.lernziel, textSize: 28, name: 'Ziel' });
    s.addImage({ path: BILD('w4_wirbelsaeule.png'), x: 10.05, y: 1.85, w: 2.5, h: 3.67, altText: 'Wirbelsäule mit HWS, BWS und LWS', objectName: 'Bild Wirbelsäule' });
    s.addText('HWS · BWS · LWS', { x: 9.6, y: 5.6, w: 3.4, h: 0.5, fontSize: 16, align: 'center', color: HEX.grau, margin: 0, isTextBox: true, objectName: 'Bildunterschrift' });
    s.addNotes('Lernziel vorlesen lassen. Fachwörter kurz klären: HWS = Halswirbelsäule, BWS = Brustwirbelsäule, LWS = Lendenwirbelsäule (stehen auch in der Wörterhilfe).');

    abschnitt('Ablauf Arbeitsblatt 1');
    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Ablauf Arbeitsblatt 1' });
    s.addText('So geht es auf Arbeitsblatt 1', { placeholder: 'title' });
    await ab(s, 1);
    await schritte(s, [
      { nr: 'AA1', icon: 'FaBookOpen', kopf: 'Hinweise finden', text: 'Fall lesen, Hinweise unterstreichen und mit Zeilennummer in die Tabelle eintragen.', form: 'allein' },
      { nr: 'AA2', icon: 'FaMobileAlt', kopf: 'Höhe und Ausfälle', text: 'Infotext lesen. Am Handy: Rückenmark-Check mit acht kurzen Fällen.', form: 'zu zweit · Handy' },
      { nr: 'AA3', icon: 'FaUsers', kopf: 'Üben: Kopf halten und drehen', text: 'Kopf halten und achsengerecht auf die Seite drehen – auf dem Boden oder auf der Isomatte.', form: 'zu viert' },
      { nr: 'AA4', icon: 'FaPen', kopf: 'Wissen anwenden', text: 'Begründen und beschreiben: Warum soll Herr Pfeiffer nicht bewegt werden?', form: 'allein' }
    ], { y: 1.95, hh: 4.55 });
    s.addNotes('Arbeitsblatt 1 jetzt austeilen. Ablauf laut Verlaufsplan: AA1 (4–12 min), AA2 mit Infotext und Merksatz (12–21), AA3 Übung in Vierergruppen (21–35), AA4 (35–45).');

    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Ablauf Arbeitsblatt 1' });
    s.addText('Start: AA1 – Hinweise finden', { placeholder: 'title' });
    await ab(s, 1);
    s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 1.95, w: 8.4, h: 4.55, fill: { color: C.background2 }, line: { color: 'F2F5F6', width: 0 }, rectRadius: 0.15, objectName: 'Auftrag Karte' });
    s.addText([
      { text: 'Lesen Sie den Fall.', options: { bullet: true, breakLine: true } },
      { text: 'Unterstreichen Sie alle Hinweise auf eine Wirbelsäulenverletzung.', options: { bullet: true, breakLine: true } },
      { text: 'Tragen Sie sie mit Zeilennummer in die Tabelle ein.', options: { bullet: true } }
    ], { x: 1.0, y: 2.3, w: 7.6, h: 3.6, fontSize: 24, color: C.text1, paraSpaceAfter: 14, margin: 0, valign: 'top', isTextBox: true, objectName: 'Auftrag' });
    s.addShape(pres.ShapeType.ellipse, { x: 9.75, y: 2.2, w: 2.4, h: 2.4, fill: { color: C.accent1 }, line: { color: HEX.orange, width: 0 }, objectName: 'Uhr Kreis' });
    s.addImage({ data: await icon('FaClock', HEX.weiss), x: 10.35, y: 2.8, w: 1.2, h: 1.2, altText: 'Uhr', objectName: 'Uhr Icon' });
    s.addText([{ text: 'allein', options: { bold: true, breakLine: true } }, { text: 'ca. 4 Minuten' }], { x: 9.3, y: 4.85, w: 3.3, h: 1.0, fontSize: 22, align: 'center', color: C.text2, margin: 0, isTextBox: true, objectName: 'Zeit' });
    s.addNotes('Fall vorlesen lassen; Uhr 4 min. Danach Tabelle im Plenum sichern (Zeilennummern nennen lassen). Ablenker ansprechen: Diabetes, Brille, Schürfwunde, Mittagessen. „Er kann die Beine bewegen“ schließt nichts aus.');
  });
}

/* =====================================================================
   2 · Gelenkstelle → Blatt 2
   ===================================================================== */
async function praes2() {
  const pat = W4.verlauf.patienten;
  await foliensatz('KB1_W4_Praesentation_2_Gelenkstelle_Innere_Blutung.pptx', 'Woche 4 · Gelenkstelle · Arbeitsblatt 2 Innere Blutung', async ({ pres, C, karte, fahrplan, schritte, abschnitt, ab }) => {
    abschnitt('Rückblick');
    let s = pres.addSlide({ masterName: 'W4 Titel', sectionTitle: 'Rückblick' });
    s.addText('Weiter geht es · Arbeitsblatt 2', { placeholder: 'kicker' });
    s.addText(T.B2.kopf, { placeholder: 'title' });
    s.addText('Rückblick auf Arbeitsblatt 1 – und was jetzt kommt', { placeholder: 'unter' });
    await fahrplan(s, 2);
    s.addNotes('Gelenkstelle (45–50 min). Notfall 1 ist geschafft (grüner Haken). Kurz zurückblicken, dann zu Notfall 2 überleiten.');

    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Rückblick' });
    s.addText('Das nehmen wir aus Arbeitsblatt 1 mit', { placeholder: 'title' });
    await ab(s, 1);
    const w3 = (12.13 - 0.6) / 3;
    await karte(s, { x: 0.6, y: 1.95, w: w3, hh: 4.55, iconName: 'FaHandPaper', kreis: C.accent4, kopf: 'Nicht bewegen', text: 'Person ansprechen, beruhigen und bitten, still zu liegen. Nicht aufsetzen – sonst droht eine Querschnittlähmung.', name: 'Merke 1' });
    await karte(s, { x: 0.6 + w3 + 0.3, y: 1.95, w: w3, hh: 4.55, iconName: 'FaHandsHelping', kreis: C.accent4, kopf: 'Kopf halten', text: 'Mit beiden Händen in der vorgefundenen Lage halten.', name: 'Merke 2' });
    await karte(s, { x: 0.6 + 2 * (w3 + 0.3), y: 1.95, w: w3, hh: 4.55, iconName: 'FaUsers', kreis: C.accent4, kopf: 'Drehen nur, wenn nötig', text: 'Zum Beispiel beim Erbrechen: achsengerecht mit mehreren Helfenden.', name: 'Merke 3' });
    s.addNotes('Leitfrage von Arbeitsblatt 1 beantworten lassen: Darf Herr Pfeiffer aufstehen? Nein – Hinweise auf eine Verletzung der Halswirbelsäule (Sturz, Nackenschmerz, Kribbeln in den Händen). Die drei Karten sind der Merksatz von Arbeitsblatt 1 in Kurzform.');

    abschnitt('Überleitung');
    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Überleitung' });
    s.addText('Eine Blutung, die man nicht sieht', { placeholder: 'title' });
    const wh = (12.13 - 0.3) / 2;
    await karte(s, { x: 0.6, y: 1.65, w: wh, hh: 3.6, iconName: 'FaTint', kreis: C.accent6, kopf: 'Letzte Woche', text: 'Blutungen, die man sieht.', textSize: 26, name: 'Sichtbar' });
    await karte(s, { x: 0.6 + wh + 0.3, y: 1.65, w: wh, hh: 3.6, iconName: 'FaEyeSlash', kreis: C.text2, kopf: 'Heute', text: 'Eine Blutung, die man nicht sieht.', textSize: 26, fill: C.accent2, name: 'Unsichtbar' });
    s.addText('Woran merken Sie, dass jemand innerlich blutet?', { x: 0.6, y: 5.6, w: 12.13, h: 0.8, fontSize: 26, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: 'Impuls' });
    s.addNotes('„Letzte Woche: Blutungen, die man sieht. Heute: eine Blutung, die man nicht sieht.“ Vermutungen sammeln (Puls, Blutdruck, Blässe …), nicht auflösen – Arbeitsblatt 2 klärt es.');

    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Überleitung' });
    s.addText('Frühdienst: drei Patienten', { placeholder: 'title' });
    await ab(s, 2);
    const kartenP = [
      { p: pat[0], icon: 'FaBicycle', text: 'Gestern Abend mit dem Fahrrad gestürzt, Lenker in den linken Oberbauch. Zur Beobachtung.' },
      { p: pat[1], icon: 'FaBandAid', text: 'Gestern am rechten Unterarm operiert.' },
      { p: pat[2], icon: 'FaCrutch', text: 'Sprunggelenk-OP vor zwei Tagen. Geht mit Unterarmgehstützen.' }
    ];
    for (let i = 0; i < 3; i++) await karte(s, { x: 0.6 + i * (w3 + 0.3), y: 1.95, w: w3, hh: 3.6, iconName: kartenP[i].icon, kopf: kartenP[i].p.name, text: kartenP[i].text, name: 'Patient ' + (i + 1) });
    s.addText(T.B2.vielleicht, { x: 0.6, y: 5.75, w: 12.13, h: 0.7, fontSize: 24, bold: true, italic: true, color: C.accent1, margin: 0, isTextBox: true, objectName: 'Satz' });
    s.addNotes('Arbeitsblatt 2 austeilen. Ausgangssituation vorlesen lassen, die drei Patienten benennen. Neugier wecken: „Wer von den dreien ist ein Notfall?“');

    abschnitt('Ablauf Arbeitsblatt 2');
    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Ablauf Arbeitsblatt 2' });
    s.addText('Ihr Ziel für Arbeitsblatt 2 – und die Ampel', { placeholder: 'title' });
    await ab(s, 2);
    s.addText(T.B2.lernziel, { x: 0.6, y: 1.95, w: 12.13, h: 0.95, fontSize: 20, color: C.text1, margin: 0, valign: 'top', isTextBox: true, objectName: 'Lernziel' });
    const A = W4.ampel, amp = [['gruen', C.accent4, 'FaCheck'], ['gelb', C.accent5, 'FaEye'], ['rot', C.accent6, 'FaHeartbeat']];
    for (let i = 0; i < 3; i++) {
      const [k, farbe, ic] = amp[i], teile = A[k].lang.split(' – ');
      await karte(s, { x: 0.6 + i * (w3 + 0.3), y: 3.0, w: w3, hh: 3.5, iconName: ic, kreis: farbe, kopf: teile[0], text: (teile[1] || '').replace('Pflegefachkraft', 'Pflegefachkraft (PFK)'), name: 'Ampel ' + k });
    }
    s.addNotes('Die Ampel erklären – sie ist die Entscheidung bei jeder Messkarte am Handy (Frühdienst mit Ampel). Wichtig: Zu früh melden (Fehlalarm) und zu spät melden sind beide Fehler.');

    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Ablauf Arbeitsblatt 2' });
    s.addText('So geht es auf Arbeitsblatt 2', { placeholder: 'title' });
    await ab(s, 2);
    await schritte(s, [
      { nr: 'AA1', icon: 'FaMobileAlt', kopf: 'Frühdienst mit Ampel', text: 'QR-Code scannen. Bei jeder Messkarte die Ampel wählen.', form: 'allein oder zu zweit · Handy' },
      { nr: 'Kurve', icon: 'FaHeartbeat', kopf: 'Finns Verlauf', text: 'Puls und Blutdruck in die Kurve eintragen – auch 08:00 Uhr. Was fällt Ihnen auf?', form: 'allein' },
      { nr: 'AA2', icon: 'FaPen', kopf: 'Wissen anwenden', text: 'Aufgaben 2.1 bis 2.4 schriftlich beantworten. Hilfe: Merksatz und Kurve.', form: 'allein · 10 Minuten' }
    ], { breite: 8.2, textSize: 16, y: 1.95, hh: 4.55 });
    s.addImage({ path: BILD('w4_kurve_leer.png'), x: 9.1, y: 2.45, w: 3.65, h: 2.48, altText: 'Leere Kurve für Finn', objectName: 'Bild Kurve' });
    s.addText('Finns Kurve auf dem Arbeitsblatt', { x: 9.1, y: 5.0, w: 3.65, h: 0.5, fontSize: 15, align: 'center', color: HEX.grau, margin: 0, isTextBox: true, objectName: 'Bildunterschrift' });
    s.addText('Schnell fertig? „Schon fertig?“ unten auf Arbeitsblatt 2: Trend-Detektiv am Handy.', { x: 9.1, y: 5.5, w: 3.65, h: 1.0, fontSize: 15, align: 'center', color: HEX.grau, margin: 0, isTextBox: true, objectName: 'Schon fertig' });
    s.addNotes('Frühdienst mit Ampel am Handy, allein oder zu zweit (ca. 8 min, 40 s je Karte), danach im Plenum besprechen (ca. 5 min; w4/lehrer.html → „Messkarten groß“). Sicherung: Finns Kurve – Puls und oberer Blutdruckwert laufen wie eine Schere aufeinander zu. Dann AA2 (10 min).');
  });
}

/* =====================================================================
   3 · Gelenkstelle → Blatt 3
   ===================================================================== */
async function praes3() {
  await foliensatz('KB1_W4_Praesentation_3_Gelenkstelle_Atemwege.pptx', 'Woche 4 · Gelenkstelle · Arbeitsblatt 3 Atemwege', async ({ pres, C, karte, fahrplan, schritte, abschnitt, ab }) => {
    abschnitt('Rückblick');
    let s = pres.addSlide({ masterName: 'W4 Titel', sectionTitle: 'Rückblick' });
    s.addText('Weiter geht es · Arbeitsblatt 3', { placeholder: 'kicker' });
    s.addText(T.B3.kopf, { placeholder: 'title' });
    s.addText('Rückblick auf Arbeitsblatt 2 – und was jetzt kommt', { placeholder: 'unter' });
    await fahrplan(s, 3);
    s.addNotes('Gelenkstelle (81–84 min, ggf. nach der Pause). Notfall 1 und 2 sind geschafft.');

    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Rückblick' });
    s.addText('Das nehmen wir aus Arbeitsblatt 2 mit', { placeholder: 'title' });
    await ab(s, 2);
    s.addImage({ path: BILD('w4_kurve_lsg.png'), x: 0.6, y: 2.0, w: 6.4, h: 4.34, altText: 'Finns Kurve mit allen Werten', objectName: 'Bild Kurve' });
    const punkte = [['FaHeartbeat', 'Der Puls steigt.'], ['FaArrowRight', 'Der Abstand zwischen oberem und unterem Blutdruckwert wird kleiner.'], ['FaClock', 'Einen Notfall melde ich sofort – ich warte nicht, bis der Blutdruck fällt.']];
    for (let i = 0; i < 3; i++) {
      const y = 2.05 + i * 1.45;
      s.addShape(pres.ShapeType.ellipse, { x: 7.5, y, w: 0.8, h: 0.8, fill: { color: C.accent6 }, line: { color: HEX.rot, width: 0 }, objectName: 'Punkt ' + (i + 1) + ' Kreis' });
      s.addImage({ data: await icon(punkte[i][0], HEX.weiss), x: 7.67, y: y + 0.17, w: 0.46, h: 0.46, altText: '', objectName: 'Punkt ' + (i + 1) + ' Icon' });
      s.addText(punkte[i][1], { x: 8.55, y: y - 0.05, w: 4.2, h: 1.2, fontSize: 19, color: C.text1, margin: 0, valign: 'top', isTextBox: true, objectName: 'Punkt ' + (i + 1) });
    }
    s.addNotes('Kurze Rückschau auf Finns Kurve (die „Schere“). Der Merksatz von Arbeitsblatt 2 in drei Punkten.');

    abschnitt('Leitfall');
    s = pres.addSlide({ masterName: 'W4 Zitat', sectionTitle: 'Leitfall' });
    s.addText(T.B3.leitfall[1].replace(/^„|“$/g, ''), { placeholder: 'zitat' });
    s.addText('Schülerin Christin über Frau Maler (71), seit gestern neu im Pflegeheim', { placeholder: 'quelle' });
    s.addNotes('Arbeitsblatt 3 austeilen. Leitfall vorlesen (steht auch oben auf Arbeitsblatt 3).');

    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Leitfall' });
    s.addText('Leitfrage', { placeholder: 'title' });
    await ab(s, 3);
    s.addText(T.B3.leitfrage, { x: 0.6, y: 2.0, w: 12.13, h: 1.3, fontSize: 34, bold: true, color: C.text2, margin: 0, valign: 'top', isTextBox: true, objectName: 'Leitfrage' });
    const wh = (12.13 - 0.3) / 2;
    await karte(s, { x: 0.6, y: 3.4, w: wh, hh: 2.25, iconName: 'FaThumbsUp', kreis: C.accent4, kopf: 'Daumen hoch: richtig', name: 'Daumen hoch' });
    await karte(s, { x: 0.6 + wh + 0.3, y: 3.4, w: wh, hh: 2.25, iconName: 'FaThumbsDown', kreis: C.accent6, kopf: 'Daumen runter: falsch', name: 'Daumen runter' });
    s.addText('Ihre Vermutung jetzt – die Antwort am Ende der Stunde.', { x: 0.6, y: 6.0, w: 12.13, h: 0.6, fontSize: 18, italic: true, color: HEX.grau, margin: 0, isTextBox: true, objectName: 'Hinweis' });
    s.addNotes('Alle zeigen gleichzeitig Daumen hoch oder runter. Kurz begründen lassen, NICHT auflösen. Am Ende der Stunde beantworten die SuS die Leitfrage schriftlich (Arbeitsblatt 3).');

    abschnitt('Ablauf Arbeitsblatt 3');
    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Ablauf Arbeitsblatt 3' });
    s.addText('Selbstversuch: 30 Sekunden', { placeholder: 'title' });
    await ab(s, 3);
    s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 1.95, w: 8.4, h: 4.55, fill: { color: C.accent2, transparency: 65 }, line: { color: HEX.lachs, width: 0 }, rectRadius: 0.15, objectName: 'Auftrag Karte' });
    s.addText([
      { text: 'Legen Sie einen Finger vorn auf den Hals und schlucken Sie.', options: { bullet: true, breakLine: true } },
      { text: 'Was spüren Sie?', options: { bullet: true, breakLine: true } },
      { text: 'Geht Schlucken und Einatmen gleichzeitig?', options: { bullet: true } }
    ], { x: 1.0, y: 2.3, w: 7.6, h: 4.0, fontSize: 26, color: C.text1, paraSpaceAfter: 16, margin: 0, valign: 'top', isTextBox: true, objectName: 'Selbstversuch' });
    s.addShape(pres.ShapeType.ellipse, { x: 9.75, y: 2.25, w: 2.4, h: 2.4, fill: { color: C.text2 }, line: { color: HEX.petrol, width: 0 }, objectName: 'Icon Kreis' });
    s.addImage({ data: await icon('FaLungs', HEX.lachs), x: 10.35, y: 2.85, w: 1.2, h: 1.2, altText: 'Lunge', objectName: 'Icon Lunge' });
    s.addText('AA1 a)', { x: 9.3, y: 4.9, w: 3.3, h: 0.6, fontSize: 22, bold: true, align: 'center', color: C.text2, margin: 0, isTextBox: true, objectName: 'Aufgabe' });
    s.addNotes('Selbstversuch anleiten (30 s). Auflösung: Der Kehlkopf geht beim Schlucken nach oben, der Kehldeckel verschließt die Luftröhre. Schlucken und Einatmen gleichzeitig geht nicht.');

    s = pres.addSlide({ masterName: 'W4 Inhalt', sectionTitle: 'Ablauf Arbeitsblatt 3' });
    s.addText('So geht es auf Arbeitsblatt 3', { placeholder: 'title' });
    await ab(s, 3);
    await schritte(s, [
      { nr: 'AA1', icon: 'FaMobileAlt', kopf: 'Der Weg der Luft', text: '„Wo ist was?“ am Handy: Teile antippen – 3 Sekunden je Frage. Die Wörter kommen in den Lückentext.', form: 'allein · Handy' },
      { nr: 'AA2', icon: 'FaBookOpen', kopf: 'Leicht oder schwer?', text: 'Text am Handy lesen. Die Zeichen in Stichworten in die Tabelle eintragen.', form: 'allein · Handy' },
      { nr: 'AA3', icon: 'FaPen', kopf: 'Wissen anwenden', text: 'Aufgaben 3.1 und 3.2 schriftlich beantworten. Hilfe: Tabelle und Merksatz.', form: 'allein · 8 Minuten' }
    ], { breite: 8.9, textSize: 16, y: 1.95, hh: 4.55 });
    s.addImage({ path: BILD('w4_atemwege.png'), x: 9.8, y: 2.05, w: 2.95, h: 2.95, altText: 'Atemwege von vorn', objectName: 'Bild Atemwege' });
    s.addText('Schnell fertig? „Für die Schnellen“ unten auf Arbeitsblatt 3.', { x: 9.6, y: 5.2, w: 3.3, h: 1.3, fontSize: 15, align: 'center', color: HEX.grau, margin: 0, isTextBox: true, objectName: 'Für die Schnellen' });
    s.addNotes('AA1: „Wo ist was?“ (bei einem Fehler oder abgelaufener Zeit von vorn), dann Lückentext sichern, Merksatz. AA2: Lesetext am Handy, Tabelle sichern (Kernsatz: „Wer laut rufen kann, bekommt Luft. Nicht auf blaue Lippen warten!“). AA3: 3.1 und 3.2 (8 min), Musterlösung. Abschluss: Leitfrage beantworten.');
  });
}

(async () => {
  await praes1();
  await praes2();
  await praes3();
})().catch((e) => { console.error(e); process.exit(1); });

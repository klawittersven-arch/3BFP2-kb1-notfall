/* Erstellt die Unterlagen für KB I, Themenblock 2, Woche 4 (SW 9):
   je Fassung „analog“ (ganz ohne Smartphone) und „digital“ (mit Smartphone):
     arbeitsblatt/KB1_W4_Wirbelsaeule_Blutung_<fassung>_SV.docx       Schülerversion: 3 Blätter (digital 6 Seiten, analog 7 – Blatt 3 mit Lesetext)
     arbeitsblatt/KB1_W4_Wirbelsaeule_Blutung_<fassung>_LV_LSG.docx   Lehrerversion: Verlaufsplan, Hinweise, Lösungen
   Aufruf (im Hauptverzeichnis): node werkzeuge/w4_bilder.js && node werkzeuge/qr_w4.js && node werkzeuge/ab_w4.js
   Gemeinsame Bausteine (werkzeuge/ab_bausteine.js) werden nur benutzt, nicht verändert. */
'use strict';
const fs = require('fs');
const path = require('path');
const D = require('docx');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType, VerticalAlign, TableLayoutType, BorderStyle } = D;
const { bausteine, kopf, fuss, bild, F, SEITE_HOCH, SEITE_QUER, STILE, WURZEL, rahmen, linie, keinRand } = require('./ab_bausteine');
const T = require('./ab_w4_texte');
const W4 = require('../docs/w4/inhalte.js');

const AUS = process.argv[2] || path.join(WURZEL, 'arbeitsblatt');
const NAME = 'KB1_W4_Wirbelsaeule_Blutung';
const BREITE_HOCH = 11906 - 2 * 1134;   // 9638
const BREITE_QUER = 16838 - 2 * 1134;   // 14570
const QR = (n) => path.join(WURZEL, 'qr', `qr_w4_${n}.png`);
const BILD = (n) => path.join(__dirname, 'bilder', n);
const IC = { lesen: 'icon_lesen.png', markieren: 'icon_markieren.png', schreiben: 'icon_schreiben.png', handy: 'icon_handy.png', stift: 'icon_stift.png', beurteilen: 'icon_beurteilen.png', checkout: 'icon_checkout.png' };
const AMP_FARBE = { gruen: 'E2F0D9', gelb: 'FFF2CC', rot: 'F8D7D3' };
// Fassung: 'analog' (ganz ohne Smartphone) oder 'digital' (Live-Verlauf, Simulation und „Schon fertig?“ am Smartphone).
// Wird in main() je Dokument gesetzt; die Aufgaben im KA-Format sind in beiden Fassungen gleich.
let MODUS = 'analog';
const DIGITAL = () => MODUS === 'digital';
const je = (analog, digital) => (DIGITAL() ? digital : analog);
// Ansichtsexemplar mit Textmarker (nicht zum Austeilen): gelb = direkt klausurrelevant, pink = könnte gestrichen werden
let MARKIERT = false;
const MARKE = {
  b1aa1: 'y', b1merk: 'y', '4.1': 'y', '2.1': 'y', '2.2': 'y', '2.4': 'y', b3aa2: 'y', b3tab: 'y', '3.1': 'y', '3.2': 'y', b3merk1: 'y',
  b1aa2: 'p', b2aa1: 'p', '2.3': 'p', b3aa1: 'p', '3.4': 'p', fertig: 'p', schnelle: 'p', leitfrage: 'p'
};
const hl = (key) => (MARKIERT && MARKE[key] ? { y: 'yellow', p: 'magenta' }[MARKE[key]] : undefined);
const mitHl = (key, o = {}) => (hl(key) ? { ...o, highlight: hl(key) } : o);

/* ---------- eigene Bausteine für Woche 4 (ab_bausteine.js bleibt unverändert) ---------- */
function blattKopf(B, text, o = {}) {
  return new Paragraph({
    keepNext: true, spacing: { before: 0, after: 80 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: '2E75B6' },
    children: [B.emoji(' 📄 ', { size: 24 }), B.b(text, { size: 25, color: 'FFFFFF' })],
    ...o
  });
}
function lernziel(B, text) {
  return new Paragraph({ spacing: { after: 80, line: 252 }, children: [B.emoji('🎯 '), B.b('Lernziel: ', { size: 20 }), ...B.runs(text, { size: 20 })] });
}
// Leerer Abstand mit fester Höhe (in Word sonst so hoch wie eine 11-pt-Zeile)
const leer = (twip = 60) => new Paragraph({ spacing: { before: 0, after: 0, line: Math.max(20, twip), lineRule: D.LineRuleType.EXACT }, children: [] });
// Seitenwechsel ohne Leerzeile oben (winziger Absatz mit „Seitenumbruch oberhalb“)
const seitenumbruch = () => new Paragraph({ pageBreakBefore: true, spacing: { before: 0, after: 0, line: 20, lineRule: D.LineRuleType.EXACT }, children: [] });
// wie B.runs, zusätzlich ++Wort++ = fett und unterstrichen (nur Woche 4; ab_bausteine.js bleibt unverändert)
const runsU = (B, text, o = {}) => String(text).split(/(\+\+[^+]+\+\+)/g).filter(Boolean).flatMap((t) => (t.startsWith('++') ? [B.t(t.slice(2, -2), { bold: true, underline: {}, ...o })] : B.runs(t, o)));
const klein = (B, text, o = {}) => new Paragraph({ spacing: { before: 40, after: 60, line: 240 }, children: B.runs(text, { size: 17, color: F.GRAU_T, italics: true }), ...o });

// Text in Zeilen fester Länge umbrechen (gleiche Umbrüche in Word und LibreOffice → Zeilennummern stimmen)
function umbrechen(absaetze, zeichen) {
  const zeilen = [];
  absaetze.forEach((abs, ai) => {
    let z = '';
    for (const wort of abs.split(' ')) {
      if (z && (z + ' ' + wort).length > zeichen) { zeilen.push({ text: z, absatz: ai }); z = wort; } else z = z ? z + ' ' + wort : wort;
    }
    if (z) zeilen.push({ text: z, absatz: ai, ende: true });
  });
  return zeilen;
}
// Fallsituation mit Zeilennummern (wie in der Abschlussprüfung). Rückgabe: Tabelle + Suche „in welcher Zeile steht …?“
function fallKasten(B, titel, absaetze, { zeichen = 100, schrift = 20 } = {}) {
  const zeilen = umbrechen(absaetze, zeichen);
  const wNr = 480, wText = B.breite - wNr;
  const grau = { type: ShadingType.CLEAR, color: 'auto', fill: F.GRAU_HELL };
  const r = linie(F.GRAU_R, 6);
  const zelle = (kinder, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 90, right: 90 }, shading: grau, children: kinder, ...o });
  const rows = [new TableRow({ cantSplit: true, children: [zelle([new Paragraph({ spacing: { before: 40, after: 40 }, keepNext: true, children: [B.b(titel, { size: 20 })] })], B.breite, { columnSpan: 2, borders: { top: r, left: r, right: r, bottom: keinRand } })] })];
  zeilen.forEach((z, i) => {
    const letzte = i === zeilen.length - 1;
    const rand = { top: keinRand, bottom: letzte ? r : keinRand };
    rows.push(new TableRow({ cantSplit: true, children: [
      zelle([new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0, line: 250 }, children: [B.t(String(i + 1), { size: 15, color: F.GRAU_T })] })], wNr, { borders: { ...rand, left: r, right: keinRand } }),
      zelle([new Paragraph({ spacing: { after: z.ende && !letzte ? 50 : 0, line: 250 }, children: [B.t(z.text, { size: schrift })] })], wText, { borders: { ...rand, left: keinRand, right: r } })
    ] }));
  });
  const tabelle = new Table({ width: { size: B.breite, type: WidthType.DXA }, columnWidths: [wNr, wText], layout: TableLayoutType.FIXED, rows });
  // Zeile, in der ein Suchwort beginnt (auch wenn es über einen Zeilenumbruch reicht)
  const starts = []; let gesamt = '';
  zeilen.forEach((z) => { starts.push(gesamt.length); gesamt += z.text + ' '; });
  const zeile = (wort) => { const idx = gesamt.indexOf(wort); if (idx < 0) throw new Error('Wort nicht im Fall: ' + wort); let i = 0; while (i + 1 < starts.length && starts[i + 1] <= idx) i++; return i + 1; };
  return { tabelle, zeile, zeilen };
}
// Kompakter QR-Kasten (Text links, QR rechts)
const qrKasten = (B, seite, absaetze, qrCm = 1.45) => B.handy(`w4/${seite}.html`, absaetze, { linkBasis: T.LINK_BASIS, qrDatei: QR(seite), qrCm });
const kl = (B, text, o = {}) => new Paragraph({ spacing: { after: 30, line: 245 }, children: B.runs(text, { size: 19, ...o }) });
// Schreiblinien (0,72 cm), in der LSG die Lösung gelb
function linien(B, anzahl, loesung = [], breite = B.breite) {
  if (B.lsg && loesung.length) return B.kasten(loesung.map((z) => new Paragraph({ spacing: { after: 40, line: 245 }, children: B.runs(z, { size: 19, highlight: 'yellow' }) })), { fill: 'FFFFFF', rand: F.GRAU_R });
  const rl = { style: BorderStyle.SINGLE, size: 4, color: '8C8C8C' };
  return new Table({
    width: { size: breite, type: WidthType.DXA }, columnWidths: [breite], layout: TableLayoutType.FIXED,
    rows: Array.from({ length: anzahl }, () => new TableRow({ height: { value: 410, rule: D.HeightRule.EXACT }, children: [new TableCell({ width: { size: breite, type: WidthType.DXA }, borders: { top: keinRand, left: keinRand, right: keinRand, bottom: rl }, children: [new Paragraph({ children: [] })] })] }))
  });
}
// „Schon fertig?“: digital mit QR-Code, analog als kurze Zusatzaufgabe (Antwort auf ein Extrablatt; LSG: Lösung gelb)
function fertigKasten(B, seite, f) {
  if (DIGITAL() && typeof f.digital === 'string') return qrKasten(B, seite, [kl(B, f.digital, mitHl('fertig'))]);
  const a = DIGITAL() ? f.digital : f.analog;
  // Antwort auf ein Extrablatt – so braucht der Kasten keine Schreiblinien
  return B.kasten([kl(B, a.frage + ' ✍️ **Schreiben Sie Ihre Antwort auf ein Extrablatt.**', mitHl('fertig')),
    B.lsg ? new Paragraph({ spacing: { before: 30, after: 0, line: 245 }, children: B.runs(a.loesung, { size: 19, highlight: 'yellow' }) }) : null].filter(Boolean),
  { fill: F.BLAU_HELL, rand: '2E75B6' });
}
// „Für die Schnellen“ (Blatt 3): Aufgaben ohne Schreiblinien – Antworten auf ein Extrablatt; digital dazu zwei Handy-Übungen nebeneinander
function schnelleKasten(B, f, ersetze = (s) => s) {
  const liste = f.aufgaben.filter((a) => !a.nurAnalog || !DIGITAL());
  // eine Aufgabe → „Ihre Antwort“, mehrere → „Ihre Antworten“
  const absaetze = [kl(B, liste.length === 1 ? f.kopf.replace('Ihre Antworten', 'Ihre Antwort') : f.kopf, { size: 19 })];
  liste.forEach((a) => {
    absaetze.push(new Paragraph({ spacing: { before: 40, after: 0, line: 245 }, children: [B.b(a.nr + '  ', { size: 19 }), ...B.runs(a.text, mitHl(a.nr, { size: 19 }))] }));
    if (a.hinweis) absaetze.push(new Paragraph({ spacing: { after: 0, line: 240 }, children: B.runs(a.hinweis, { size: 17, italics: true, color: F.GRAU_T }) }));
    if (B.lsg) a.loesung.forEach((z) => absaetze.push(new Paragraph({ spacing: { after: 0, line: 245 }, children: B.runs(ersetze(z), { size: 18, highlight: 'yellow' }) })));
  });
  const out = [B.kasten(absaetze, { fill: F.BLAU_HELL, rand: '2E75B6' })];
  if (DIGITAL()) {
    const halb = Math.floor((B.breite - 120) / 2);
    const H = bausteine({ lsg: B.lsg, breite: halb });
    const box = (seite, text, key) => H.handy(`w4/${seite}.html`, [new Paragraph({ spacing: { after: 0, line: 240 }, children: H.runs(text, mitHl(key, { size: 18 })) })], { linkBasis: T.LINK_BASIS, qrDatei: QR(seite), qrCm: 1.15 });
    // zwei Kästen nebeneinander, oben bündig; in Word muss jede Zelle mit einem Absatz enden
    const nb = { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand };
    const zelleOben = (inhalt, w) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: nb, verticalAlign: VerticalAlign.TOP, children: [inhalt, leer(20)] });
    out.push(leer(60), new Table({ width: { size: B.breite, type: WidthType.DXA }, columnWidths: [halb + 120, B.breite - halb - 120], layout: TableLayoutType.FIXED,
      borders: { ...nb, insideHorizontal: keinRand, insideVertical: keinRand },
      rows: [new TableRow({ cantSplit: true, children: [zelleOben(box('atemweg', f.atemweg, 'fertig'), halb + 120), zelleOben(box('speisesaal', f.speisesaal, 'schnelle'), B.breite - halb - 120)] })] }));
  }
  return out;
}
// Aufgaben im KA-Format: Kopfzeile nur einmal je Block, darunter die Schreiblinien.
// Punkte nur in der Lehrerversion – auf dem AB sollen die SuS nicht erkennen, welche Aufgaben KA-Muster sind.
function aufgabenListe(B, liste, ersetze = (s) => s, { ohneNr = false } = {}) {
  const w1 = ohneNr ? 0 : 600, w3 = B.lsg ? 1000 : 0, w2 = B.breite - w1 - w3;
  const r = rahmen('000000', 4);
  const z = (kinder, w, fill) => B.zelle(kinder, w, { borders: r, shading: fill ? { type: ShadingType.CLEAR, color: 'auto', fill } : undefined });
  const pa = (runs, o = {}) => new Paragraph({ keepNext: true, spacing: { after: 0, line: 245 }, children: runs, ...o });
  const out = [];
  liste.forEach((a, i) => {
    const rows = [];
    if (i === 0) rows.push(new TableRow({ cantSplit: true, children: [ohneNr ? null : z([pa([B.b('Nr.', { size: 19 })])], w1, F.LACHS_KOPF), z([pa([B.b('Aufgabe', { size: 19 })])], w2, F.LACHS_KOPF), B.lsg ? z([pa([B.b('Punkte', { size: 19 })])], w3, F.LACHS_KOPF) : null].filter(Boolean) }));
    rows.push(new TableRow({ cantSplit: true, children: [
      ohneNr ? null : z([pa([B.b(a.nr, { size: 19 })])], w1),
      z([a.vorsatz ? pa(B.runs(a.vorsatz, mitHl(a.nr, { size: 19, italics: true })), { spacing: { after: 30, line: 245 } }) : null, pa(B.runs(a.text, mitHl(a.nr, { size: 19 }))),
        a.hinweis ? pa(B.runs(a.hinweis, { size: 17, italics: true, color: F.GRAU_T }), { spacing: { before: 30, after: 0, line: 240 } }) : null].filter(Boolean), w2),
      B.lsg ? z([pa([B.t(`${a.punkte} P.`, { size: 19 })])], w3) : null
    ].filter(Boolean) }));
    out.push(new Table({ width: { size: B.breite, type: WidthType.DXA }, columnWidths: [w1, w2, w3].filter((w) => w > 0), layout: TableLayoutType.FIXED, rows }));
    out.push(linien(B, a.zeilen, B.lsg ? a.loesung.map(ersetze) : []));
  });
  return out;
}
// Arbeitsauftrag mit kleinen Symbolen
const aa = (B, symbole, kopf, text, key) => (hl(key)
  ? new Paragraph({ keepNext: true, spacing: { before: 100, after: 50, line: 250 }, children: [...symbole.flatMap((x) => [bild(x, 0.6, 0.6), B.t(' ')]), ...B.runs(`**${kopf}** ${text}`, { highlight: hl(key) })] })
  : B.teil(symbole, `**${kopf}** ${text}`, { spacing: { before: 100, after: 50, line: 250 } }));
// Merksatz (wie B.merksatz), im Ansichtsexemplar mit Textmarker
const merksatz = (B, zeilen, key) => (hl(key)
  ? B.kasten(zeilen.map((teile) => new Paragraph({ spacing: { after: 100, line: 300 }, children: teile.flatMap((x) => (typeof x === 'string' ? B.runs(x, { highlight: hl(key) }) : [B.b(x.l, { highlight: hl(key) })])) })), { kopf: 'Merksatz', fill: 'FFFFFF', kopfFill: F.BLAU_HELL, rand: '2E75B6' })
  : B.merksatz('Merksatz', zeilen));
// Legende im Ansichtsexemplar
const legende = (B) => (MARKIERT ? new Paragraph({ spacing: { after: 60 }, children: [B.b('Ansichtsexemplar (nicht austeilen): ', { size: 17 }), B.t('direkt klausurrelevant', { size: 17, highlight: 'yellow' }), B.t('  ·  ', { size: 17 }), B.t('könnte gestrichen werden', { size: 17, highlight: 'magenta' }), B.t('  ·  ohne Markierung = unterstützend', { size: 17 })] }) : null);
const zelleFarbig = (B, kinder, w, fill, o = {}) => B.zelle(kinder, w, { borders: rahmen('000000', 4), shading: fill ? { type: ShadingType.CLEAR, color: 'auto', fill } : undefined, ...o });

/* =====================================================================
   ARBEITSBLÄTTER (Schülerversion; mit lsg = true der Lösungsteil der Lehrerversion)
   ===================================================================== */
function blatt1(B) {
  const k = []; const push = (...x) => k.push(...x.filter(Boolean));
  const t = T.B1;
  const fall = fallKasten(B, 'Fallsituation', t.fall);
  push(
    blattKopf(B, t.kopf),
    legende(B),
    lernziel(B, t.lernziel),
    fall.tabelle,
    aa(B, [IC.lesen, IC.markieren], 'AA1: Identifizieren – Hinweise finden:', t.aa1.text, 'b1aa1'),
    B.meta('8 min · Einzelarbeit → Plenum · AFB I · IKL W4 Nr. 1 · KA-Bezug KB 1, Aufg. 5.3 (Hinweise im Fall erkennen = Begründungsteil) · ' + t.aa1.hinweis)
  );
  const w3 = Math.floor(B.breite / 3);
  const lsgZelle = (liste) => ({ lsg: liste.map(([text, wort]) => `${text} (Z. ${fall.zeile(wort)})`).join('; ') });
  push(B.tabelle(t.aa1.spalten.map((s) => ({ text: s, w: /^Ausfälle/.test(s) ? B.breite - 2 * w3 : w3 })), [t.aa1.loesung.map(lsgZelle)], { hoehe: 820, schrift: 19 }));
  push(
    leer(80),
    B.kasten([...t.info.absaetze.map((a) => new Paragraph({ spacing: { after: 50, line: 250 }, children: runsU(B, a.replace(/\*\*([^*]*)\+\+([^+]+)\+\+([^*]*)\+\+([^+]+)\+\+([^*]*)\*\*/, '**$1**++$2++**$3**++$4++**$5**'), { size: 20 }) }))], { kopf: t.info.kopf }),
    klein(B, t.info.woerter),
    aa(B, je([IC.lesen, IC.schreiben], [IC.handy, IC.schreiben]), 'AA2: Erklären – Höhe und Ausfälle:', je(t.aa2.text.analog, t.aa2.text.digital), 'b1aa2'),
    B.meta(je('9 min (mit Infotext und Merksatz) · Partnerarbeit (lesen) → Einzelarbeit → Plenum', '9 min (mit Infotext und Merksatz) · Partnerarbeit (lesen) → Rückenmark-Check am Handy (EA, ca. 4 min) → Plenum') + ' · AFB I–II · IKL W4 Nr. 2 · Brücke zu Woche 2 (neurogener Schock) und KA KB 1, Aufg. 5.5')
  );
  // analog: Fälle A–C auf dem Blatt und Spalte „Fall“; digital: die Fälle kommen am Handy (Rückenmark-Check) – Tabelle und Bild bleiben als Hilfe
  if (DIGITAL()) push(qrKasten(B, 'rueckenmark', [kl(B, t.aa2.handy)], 1.25), leer(40));
  else push(...t.aa2.faelle.map(([b, text]) => new Paragraph({ spacing: { after: 20, line: 240 }, indent: { left: 260, hanging: 260 }, children: [B.b(b + '  ', { size: 19 }), ...B.runs(text, { size: 19 })] })), leer(40));
  const wBild = 1700, wTab = B.breite - wBild;
  const sp = [{ text: 'Höhe der Verletzung', w: 1500 }, { text: 'Was fällt aus?', w: 3100 }, { text: 'Fachwort', w: 0 }].concat(DIGITAL() ? [] : [{ text: 'Fall', w: 600 }]);
  sp[2].w = wTab - 1500 - 3100 - (DIGITAL() ? 0 : 600) - 80;
  const FARBE_HOEHE = ['F8D7D3', 'FCE4C8', 'DDEBF7'];   // wie im Bild: rot = HWS sehr hoch, orange = HWS, blau = BWS/LWS
  const hoehenTab = B.tabelle(sp, t.aa2.hoehen.map((h, i) => [{ text: `**${h[0]}**`, fill: FARBE_HOEHE[i] }, h[1], h[2]].concat(DIGITAL() ? [] : [{ lsg: h[3] }])), { hoehe: 420, schrift: 18 });
  push(B.zweiSpaltig(
    [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [bild(BILD('w4_wirbelsaeule.png'), 1.84, 2.7)] })],
    [hoehenTab,
      // Fassung der Lehrkraft: keine Schreibzeile zu Herrn Pfeiffer – in der LV als mündliche Frage
      B.lsg ? new Paragraph({ spacing: { before: 60, after: 0 }, children: [B.loes('Mündlich fragen: Welche Höhe hat die Verletzung bei Herrn Pfeiffer? → ' + t.aa2.pfeifferLoesung, { size: 18 })] }) : null],
    wBild
  ));
  push(leer(60), merksatz(B, t.merksatz, 'b1merk'));
  // AA3 Praxisübung
  push(
    aa(B, [IC.checkout], 'AA3: Üben – Kopf halten und achsengerecht drehen 👥', t.aa3.text),
    B.meta('14 min (3 min Vorzeigen, 4 Runden à ca. 2 min, 2 min Auswertung) · Gruppenarbeit (4) auf dem Boden oder auf Isomatten · AFB II · Methodenwechsel: erst erleben, dann in AA4 begründen und aufschreiben')
  );
  const wH = Math.floor(B.breite / 2);
  const rolle = ([r, text], w) => zelleFarbig(B, [kl(B, `**${r}:** ${text}`)], w);
  const rollen = new Table({
    width: { size: B.breite, type: WidthType.DXA }, columnWidths: [wH, B.breite - wH], layout: TableLayoutType.FIXED,
    rows: [0, 2].map((i) => new TableRow({ cantSplit: true, children: [rolle(t.aa3.rollen[i], wH), rolle(t.aa3.rollen[i + 1], B.breite - wH)] }))
  });
  const check = B.kasten([new Paragraph({ spacing: { after: 0, line: 245 }, children: [B.b('Checkliste (Beobachter/in, jede Runde): ', { size: 18 }), ...t.aa3.checkliste.flatMap((c) => [B.t('☐ ', { size: 18 }), ...B.runs(c + '   ', { size: 18 })])] })], { fill: 'FFFFFF', rand: F.GRAU_R });
  push(rollen, leer(40), check,
    new Paragraph({ spacing: { before: 50, after: 40 }, children: [B.emoji('⚠️ '), ...B.runs(t.aa3.sicherheit, { size: 17 })] }));
  // AA4 im KA-Format
  push(
    aa(B, [IC.schreiben], 'AA4: Wissen anwenden:', 'Allein, 6 Minuten.'),
    B.meta('10 min (6 min schreiben, 4 min Musterlösung und Partnercheck) · EA → PA · AFB II–III · AA4 fast wortgleich mit KA KB 1, Aufg. 5.3 (anderer Fall) · Examensvorbild: Mai 2024 Tag 3, Aufg. 8.2 (EH: „… sich nicht unnötig bewegt“); Mai 2024 Tag 2, Aufg. 3.2 (LWS-Fraktur: „keine Drehbewegungen“)'),
    new Paragraph({ spacing: { after: 60 }, keepNext: true, children: [B.i(t.rahmen, { size: 19 })] })
  );
  push(...aufgabenListe(B, t.aufgaben, undefined, { ohneNr: true }));   // Fassung der Lehrkraft: ohne Nummer
  push(leer(80), fertigKasten(B, 'rueckenmark', t.fertig));
  return k;
}

function blatt2(B) {
  const k = []; const push = (...x) => k.push(...x.filter(Boolean));
  const t = T.B2, V = W4.verlauf, AMP = W4.ampel;
  const fall = fallKasten(B, 'Ausgangssituation', t.fall);
  push(
    blattKopf(B, t.kopf, { pageBreakBefore: true }),
    legende(B),
    lernziel(B, t.lernziel),
    fall.tabelle,
    DIGITAL() ? null : klein(B, t.woerter.replace(/ · Fehlalarm = [^·]*$/, '')),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 0 }, children: [B.b(t.vielleicht, { size: 21 })] }),
    aa(B, je([IC.stift], [IC.handy, IC.stift]), 'AA1: Entscheiden – Frühdienst mit Ampel:', je(t.aa1.text.analog, t.aa1.text.digital), 'b2aa1'),
    B.meta(je('15 min (8 min ankreuzen und Kurve zeichnen, 7 min Besprechung) · EA → Plenum · AFB II–III · IKL W4 Nr. 3',
      '15 min · verlauf.html allein oder zu zweit (ca. 8 min), dann Besprechung im Plenum · EA/PA (Handy) → Plenum · AFB II–III · Methodenwechsel (Smartphone) · IKL W4 Nr. 3')),
    DIGITAL() ? qrKasten(B, 'verlauf', [kl(B, t.aa1.handy)]) : null,
    DIGITAL() ? leer(60) : null
  );
  const w3 = Math.floor(B.breite / 3);
  const ampelZelle = (s, w) => zelleFarbig(B, [
    new Paragraph({ spacing: { after: 20 }, children: [B.emoji(AMP[s].zeichen + ' ', { size: 22 }), B.b(AMP[s].lang.split(' – ')[0], { size: 19 })] }),
    new Paragraph({ spacing: { after: 0, line: 240 }, children: B.runs((AMP[s].lang.split(' – ')[1] || '').replace('Pflegefachkraft', 'PFK'), { size: 18 }) })
  ], w, AMP_FARBE[s]);
  if (DIGITAL()) push(new Table({ width: { size: B.breite, type: WidthType.DXA }, columnWidths: [w3, w3, B.breite - 2 * w3], layout: TableLayoutType.FIXED,
    rows: [new TableRow({ cantSplit: true, children: [ampelZelle('gruen', w3), ampelZelle('gelb', w3), ampelZelle('rot', B.breite - 2 * w3)] })] }));
  else push(new Paragraph({ spacing: { before: 40, after: 60, line: 245 }, children: B.runs(['gelb', 'rot'].map((s) => `${AMP[s].zeichen} **${AMP[s].kurz}** = ${AMP[s].lang.split(' – ')[1].replace(', nicht allein lassen', '')}`).join('  ·  '), { size: 18 }) }));
  const wer = (id) => ({ finn: 'Finn', jana: 'Jana', kurz: 'Herr Kurz' }[id]);
  // 08:00-Werte (W4.verlauf.aufloesung) auf dem Blatt, damit die Kurve vollständig ausgefüllt werden kann
  const AU = V.aufloesung;
  // BB = Bausteine in passender Breite (analog: neben der Kurve, digital: volle Breite, kompakt)
  const achtUhr = (BB, kompakt) => BB.kasten(kompakt
    ? [new Paragraph({ spacing: { after: 0, line: 245 }, children: [BB.emoji('🕗 ', { size: 18 }), ...BB.runs(`**${AU.titel}:** Finn: Puls **${AU.puls}**/min · Blutdruck **${AU.rr[0]}/${AU.rr[1]}** mmHg · Atemzüge ${AU.af}/min. ${AU.beobachtung} ✍️ **Tragen Sie auch diese Werte in die Kurve ein (08:00).**`, { size: 18 })] })]
    : [new Paragraph({ spacing: { after: 40, line: 245 }, children: [BB.emoji('🕗 ', { size: 19 }), BB.b(AU.titel + ':', { size: 19 })] }),
      new Paragraph({ spacing: { after: 40, line: 245 }, children: BB.runs(`Finn: Puls **${AU.puls}**/min · Blutdruck **${AU.rr[0]}/${AU.rr[1]}** mmHg · Atemzüge ${AU.af}/min. ${AU.beobachtung} ${AU.aussage}`, { size: 19 }) }),
      new Paragraph({ spacing: { after: 0, line: 245 }, children: BB.runs('✍️ Tragen Sie auch diese Werte in die Kurve ein (Spalte 08:00).', { size: 19, bold: true }) })],
  { fill: F.GRAU_HELL, rand: F.GRAU_R });
  const kurve = (mitte) => [new Paragraph({ alignment: mitte ? AlignmentType.CENTER : undefined, keepNext: true, spacing: { after: 0 }, children: [B.b('Finns Kurve', { size: 18 })] }), new Paragraph({ alignment: mitte ? AlignmentType.CENTER : undefined, spacing: { after: 0 }, children: [bild(BILD(B.lsg ? 'w4_kurve_lsg.png' : 'w4_kurve_leer.png'), je(7.9, 10.4), je(5.36, 7.05))] })];
  if (!DIGITAL()) {
    // Analog: konventionelle Ankreuz-Aufgabe (Einzelarbeit), danach Finns Kurve
    const karten = t.aa1.messungen.map((m) => (m.karte ? V.karten.find((kk) => kk.nr === m.karte) : m));
    const wK = 1150, wZ = 1250;
    const sp = [{ text: 'Uhrzeit · Wer?', w: wZ }, { text: 'Messung', w: B.breite - wZ - 3 * wK }, ...['gruen', 'gelb', 'rot'].map((s) => ({ text: AMP[s].zeichen + ' ' + AMP[s].kurz, w: wK }))];
    const kreuz = (kk, s) => ({ mitte: true, fill: AMP_FARBE[s], absaetze: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.lsg && kk.richtig === s ? B.t('☒', { size: 30, bold: true, highlight: 'yellow' }) : B.t('☐', { size: 30 })] })] });
    const messung = (kk, i) => {
      const frueher = karten.slice(0, i).some((x) => x.wer === kk.wer);
      return `Puls **${kk.puls}**/min · Blutdruck **${kk.rr[0]}/${kk.rr[1]}** mmHg · Atemzüge ${kk.af}/min` + (kk.vorwert && !frueher ? ` (Vorwert ${kk.vorwert})` : '') + `. ${kk.beobachtung} ${kk.aussage}`;
    };
    push(B.tabelle(sp, karten.map((kk, i) => [{ absaetze: [new Paragraph({ spacing: { after: 0 }, children: [B.b(kk.zeit + ' Uhr', { size: 18 })] }), new Paragraph({ spacing: { after: 0 }, children: [B.t(wer(kk.wer), { size: 18 })] })] }, messung(kk, i), kreuz(kk, 'gruen'), kreuz(kk, 'gelb'), kreuz(kk, 'rot')]), { schrift: 18 }));
    if (B.lsg) push(...t.aa1.loesungAnalog.map((z, i) => B.lp(z, { spacing: { before: i ? 0 : 40, after: 20 } })));
    push(leer(60), B.zweiSpaltig(kurve(false), [achtUhr(bausteine({ lsg: B.lsg, breite: B.breite - 5150 - 60 }), false), leer(20)], 5150));
  } else {
    push(leer(60));   // Fassung der Lehrkraft: ohne „Gewonnen“-Zeile (das Handy zeigt die Regel)
    // große Kurve links (keine Ergebnistabelle – das Ergebnis zeigt das Handy), 08:00-Kasten rechts daneben
    const wK = 6050;
    push(B.zweiSpaltig(kurve(false), [achtUhr(bausteine({ lsg: B.lsg, breite: B.breite - wK - 60 }), false), leer(20)], wK));
    if (B.lsg) push(B.lp('Auflösung: Karte 1 🟢 (zu früh, wer 🔴 wählt) · 2 🟢 (Falle: niedriger, aber stabiler Blutdruck – Schockindex 0,7) · 3 🟡 (nach Belastung nachmessen; 🔴 = Fehlalarm) · 4 🟢 · 5 🟡 (Puls +12, Abstand kleiner – nachmessen, Pflegefachkraft informieren; 🔴 = zu früh) · 6 🔴 (Trend, Blässe, Durst, Schulterschmerz links – Schockindex erst 0,9!). Gewonnen: Karte 6 = 🔴 und höchstens 1 Fehlalarm.', { spacing: { before: 40, after: 40 } }));
  }
  push(leer(80), merksatz(B, t.merksatz), DIGITAL() ? klein(B, t.woerter) : null);
  push(
    aa(B, [IC.schreiben], 'AA2: Wissen anwenden:', 'Allein (10 Minuten). Hilfe: Merksatz und Ihre Kurve.'),
    B.meta('13 min (10 min schreiben, 3 min Musterlösung) · EA → Plenum · AFB I–III · 2.1 Befunde mit Vorwerten (Muster KA KB 1, Aufg. 5.4 und W1 4.1) · 2.3 Beurteilen (AFB III) · 2.4 = KA KB 1, Aufg. 5.5 · Examensvorbild: Mai 2026 Tag 1, Aufg. 1.3–1.5 (Nachblutung, „hämorrhagischer Schock“, Vitalzeichen); Jan 2026 Tag 2, Aufg. 1.4 („Blutdruckabfall oder Pulserhöhung rechtzeitig erkannt“)'),
    new Paragraph({ spacing: { after: 60 }, keepNext: true, children: [B.i(t.rahmen, { size: 19 })] })
  );
  push(...aufgabenListe(B, t.aufgaben));
  push(leer(80), fertigKasten(B, 'trend', t.fertig));
  return k;
}

function blatt3(B) {
  const k = []; const push = (...x) => k.push(...x.filter(Boolean));
  const t = T.B3;
  push(
    blattKopf(B, t.kopf, { pageBreakBefore: true }),
    legende(B),
    lernziel(B, t.lernziel),
    B.kasten([
      new Paragraph({ spacing: { after: 0, line: 250 }, children: [...B.runs(t.leitfall[0], { size: 20 }), ...B.runs(t.leitfall[1], { size: 20, italics: true })] })
      , new Paragraph({ spacing: { before: 40, after: 0 }, children: [B.emoji('💬 '), B.b('Leitfrage: ', mitHl('leitfrage', { size: 20 })), B.i(t.leitfrage, mitHl('leitfrage', { size: 20 }))] }),
      new Paragraph({ spacing: { before: 30, after: 0 }, children: [B.b('Antwort am Ende der Stunde:', { size: 18 })] }),
      ...(B.lsg ? [new Paragraph({ spacing: { after: 0, line: 245 }, children: B.runs(t.leitfrageLoesung, { size: 19, highlight: 'yellow' }) })]
        : [linien(B, 2, [], B.breite - 240)])
    ], { kopf: 'Fallbezug: „Reanimation – und nicht nur ich war hilflos“ (Auszug)', fill: 'FFFFFF', kopfFill: 'FFFFFF', rand: '000000' }),
    aa(B, je([IC.lesen, IC.schreiben], [IC.handy, IC.schreiben]), 'AA1: Beschreiben – Der Weg der Luft:', je(t.aa1.text.analog, t.aa1.text.digital), 'b3aa1'),
    B.meta(je('9 min · Selbstversuch (30 s) → EA/PA → Plenum · AFB I–II · IKL Fremdkörperaspiration Nr. 1 (Atemwegsanatomie, Ventilation, Folgen der Hypoxie)',
      '9 min · Selbstversuch (30 s) → Handy: anatomie.html (sechs Teile antippen, bei einem Fehler von vorn) → Lückentext → Plenum · AFB I–II · IKL Fremdkörperaspiration Nr. 1 (Atemwegsanatomie, Ventilation, Folgen der Hypoxie)')),
    B.lp(t.aa1.selbstversuch)
  );
  // Informationstext (eine Quelle: W4.atemwegeText): analog mit fetten Fachwörtern, digital als Lückentext (Wörter gibt es am Handy)
  const AT = W4.atemwegeText;
  const lueckentext = (a) => a.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((x) => (x.startsWith('**')
    ? (B.lsg ? B.t(x.slice(2, -2), { size: 20, bold: true, highlight: 'yellow' }) : B.t('_'.repeat(18), { size: 32 }))
    : B.t(x, { size: 20 })));
  const infoKasten = B.kasten(AT.absaetze.map((a) => new Paragraph({ spacing: { after: 40, line: DIGITAL() ? 300 : 250 }, children: DIGITAL() ? lueckentext(a) : B.runs(a, { size: 20 }) })), { kopf: AT.kopf + (DIGITAL() ? ' – Lückentext' : '') });
  if (DIGITAL()) {
    push(qrKasten(B, 'anatomie', [kl(B, t.aa1.handy)]), leer(60), infoKasten);
  } else {
    push(infoKasten);
    const wBild = 4300;
    const zeile = (n) => new Paragraph({ spacing: { before: 20, after: 20 }, children: [B.b(n + '  ', { size: 20 }), B.lsg ? B.loes(t.aa1.begriffe[n - 1], { size: 20 }) : B.t('_'.repeat(30), { size: 20 })] });
    push(B.zweiSpaltig(
      [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [bild(BILD('w4_atemwege.png'), 5.4, 5.4)] })],
      [kl(B, t.aa1.wortspeicher, { italics: true }), ...[1, 2, 3, 4, 5, 6].map(zeile)],
      wBild
    ));
  }
  push(leer(60), merksatz(B, t.merksatz1, 'b3merk1'));
  // AA2: Informationen aus einem längeren Lesetext in die Tabelle (Text nicht in Tabellenreihenfolge, mit Ablenkern).
  // Analog steht der Text auf dem Blatt, digital führt ein QR-Code zur Leseseite mit Bildern. Kein Merksatz danach (sonst wird abgeschrieben).
  const L = W4.verlegung;
  push(
    DIGITAL() || B.lsg ? null : seitenumbruch(),
    aa(B, je([IC.lesen, IC.stift], [IC.handy, IC.stift]), 'AA2: Unterscheiden – leicht oder schwer?', je(t.aa2.text.analog, t.aa2.text.digital), 'b3aa2'),
    B.meta('12 min (8 min lesen und eintragen, 4 min sichern) · EA → Plenum · AFB I–II · IKL Fremdkörperaspiration Nr. 2 · KA KB 1, Aufg. 4.1 (Merkmale leicht/schwer) · ' + je('Lesetext aus docs/w4/inhalte.js', 'Lesetext am Handy: w4/verlegung.html (mit Bildern)')),
    DIGITAL() ? qrKasten(B, 'verlegung', [kl(B, t.aa2.handy)]) : B.kasten(L.absaetze.map((a) => new Paragraph({ spacing: { after: 60, line: 255 }, children: B.runs(a, { size: 20 }) })), { kopf: 'Informationstext: ' + L.titel }),
    leer(60)
  );
  const w1 = 1800, w2 = Math.floor((B.breite - w1) / 2);
  push(B.tabelle([{ text: '', w: w1 }, { text: 'leichte Verlegung', w: w2 }, { text: 'schwere Verlegung', w: B.breite - w1 - w2 }],
    t.aa2.zeilen.map((z) => [{ text: `**${z[0]}**`, fill: F.LACHS, o: mitHl('b3tab') }, { lsg: z[1] }, { lsg: z[2] }]), { hoehe: je(1250, 800), schrift: 18 }));
  if (B.lsg) push(B.lp(t.aa2.ergaenzung, { spacing: { before: 40, after: 20 } }));
  // AA3 im KA-Format: 3.1 (mit viel Schreibraum) und 3.2 (Hypoxie erklären, IKL Fremdkörperaspiration Nr. 1)
  const fall = fallKasten(B, 'Fallsituation', t.fall);
  const ersetze = (s) => s.replace(/\{([^}]+)\}/g, (_, w) => String(fall.zeile(w)));
  push(
    DIGITAL() || B.lsg ? leer(80) : seitenumbruch(),
    aa(B, [IC.schreiben], 'AA3: Wissen anwenden:', 'Allein (8 Minuten). Hilfe: Ihre Tabelle und der Merksatz.'),
    B.meta('10 min (8 min schreiben, 2 min Musterlösung) · EA → Plenum · AFB II · 3.1 = Muster KA KB 1, Aufg. 4.1 (gleicher Operator, beide Phasen im Fall) · 3.2 = IKL Fremdkörperaspiration Nr. 1 (erklären, warum eine Verlegung lebensbedrohlich ist; Hilfe: Merksatz) · Examensvorbild: Mai 2023 Tag 3, Aufg. 4.2 („Nennen Sie vier in der Fallsituation beschriebene Symptome, die auf eine akute Atemstörung hinweisen“, 0,5 P. je Symptom)'),
    fall.tabelle,
    new Paragraph({ spacing: { before: 60, after: 60 }, keepNext: true, children: [B.i(t.rahmen, { size: 19 })] })
  );
  push(...aufgabenListe(B, t.aufgaben, ersetze));
  push(leer(je(80, 40)), ...schnelleKasten(B, t.schnelle, ersetze));
  return k;
}

/* =====================================================================
   LEHRERVERSION: Verlaufsplan, Hinweise, Anhänge
   ===================================================================== */
function verlaufsplan(B) {
  const k = []; const push = (...x) => k.push(...x.filter(Boolean));
  push(
    B.titel('Was man nicht sieht: Wirbelsäulenverletzung, innere Blutung, Atemwege – ' + je('analoge Fassung', 'digitale Fassung')),
    new Paragraph({ spacing: { after: 80 }, children: [B.emoji('🎯 '), B.b('Lernziel (Planung): '), ...B.runs('Die Lernenden erkennen Hinweise auf eine Wirbelsäulenverletzung und begründen die Bewegungsminimierung. Sie überwachen Vitalzeichen im Verlauf und erkennen eine verzögerte innere Blutung. Sie unterscheiden eine leichte von einer schweren Atemwegsverlegung.')] }),
    B.p('**Rahmen:** KB I · Woche 4 (SW 9) · 3 UStd. (135 min): 2 UStd. Wirbelsäulenverletzung und innere Blutung, 1 UStd. Fremdkörperaspiration Teil 1 · Leitfall „Frau Maler“ (verschluckt sich am Kaffee) · Fall „17-Jähriger nach Fahrradsturz“ (Finn) · Vorwissen: Woche 1 (Kompensation, Schockindex), Woche 2 (Schockformen, neurogener Schock, Lagerung „nicht bewegen“), Woche 3 laut Planung (sichtbare Blutung, Abgrenzung Erste Hilfe – pflegerische Sofortmaßnahme – ärztliche Maßnahme) · Ich-kann-Liste KB I: Woche 4 Nr. 1–3, Fremdkörperaspiration Nr. 1–2 · KA-Bezug: KB 1, Aufg. 5.3 und 4.1 (dazu 5.5, 5.4 als Wiederholung) · ' + je('AB: 3 Blätter, 7 Seiten (Blatt 3 mit Lesetext: S. 5–7), nacheinander austeilen', 'AB: 3 Blätter je 2 Seiten (6 Seiten), nacheinander austeilen') + ' · ' + je('**Analoge Fassung:** ganz ohne Smartphone (Ankreuz- und Zuordnungsaufgaben, „Schon fertig?“ als Zusatzaufgabe – Antwort auf ein Extrablatt).', '**Digitale Fassung:** Live-Verlauf am Smartphone; „Schon fertig?“ und die Simulation „Notfall-Ampel im Speisesaal“ als Zusatz für Schnelle (ein Handy pro Paar reicht, ohne Anmeldung, ohne Beamer).')),
    B.p('**Kompetenzbezug:** Anlage 1 PflAPrV I.4.a, I.4.c (wie Woche 2) · Landeslehrplan CE 06 „In Akutsituationen sicher handeln“ · Methodenwechsel: szenischer Einstieg, Einzelarbeit, Partnerarbeit, Gruppenübung auf dem Boden oder auf Isomatten, ' + je('Ankreuz- und Zuordnungsaufgaben', 'Live-Verlauf am Smartphone') + ', Peer-Korrektur'),
    B.p('**Methodenwechsel** („erst erleben, dann begründen und aufschreiben“): ① Praxisübung „Kopf halten und achsengerecht drehen“ → AA4 (Muster KA 5.3) · ' + je('Blatt 2 und 3 sind bewusst ruhige Einzelarbeit (ankreuzen, Kurve zeichnen, zuordnen).', '② Live-Verlauf „Frühdienst – drei Patienten, eine Ampel“ (am Smartphone) → AA2. Blatt 3 ist ruhige Einzelarbeit (zuordnen); die Simulation „Notfall-Ampel im Speisesaal“ steht unten auf Blatt 3 als Zusatz „Für die Schnellen“.'))
  );
  const sp = [
    { text: 'Zeit', w: 850 }, { text: 'Phase', w: 1650 }, { text: 'Lehrerhandeln', w: 3600 }, { text: 'Schülerhandeln', w: 2700 },
    { text: 'Sozialform', w: 1250 }, { text: 'Material', w: 1400 }, { text: 'Didaktische Funktion', w: 0 }
  ];
  sp[6].w = BREITE_QUER - sp.slice(0, 6).reduce((s, x) => s + x.w, 0);
  const z = (zeit, phase, l, s, soz, mat, fkt) => [zeit, `**${phase}**`, l, s, soz, mat, fkt];
  const ueber = (text) => [{ colSpan: 7, text, fill: F.GRAU_HELL, o: { italics: true } }];
  const zeilen = [
    z('vor der Stunde', 'Vorbereitung', 'Blatt 1–3 **einzeln** (je beidseitig) kopieren, getrennt bereitlegen. **Platz auf dem Boden** (Tische an die Seite), wenn vorhanden **6 Isomatten** – sonst Jacken oder Decken unterlegen. ' + je('Extrablätter für „Schon fertig?“ bereitlegen.', 'Prüfen, ob die SuS ins WLAN kommen (ein Handy pro Paar reicht). Optional: w4/lehrer.html offen lassen – zeigt ohne Raumcode und ohne Namen, wie weit die Handys sind (letzte 45 Minuten).'), '–', '–', je('Blatt 1–3, ggf. Isomatten', 'Blatt 1–3, ggf. Isomatten, Handys'), 'Ablauf ohne Umbaupausen'),
    z('0–4', 'Szenischer Einstieg', 'Sie liegen auf dem Boden: „Ich bin Herr Pfeiffer, 79. Ich bin die Treppe runtergefallen. Helfen Sie mir hoch, ich muss zum Mittagessen!“ Wer kommt? Reaktionen sammeln, **nicht auflösen**. Dann **Blatt 1 austeilen**, Lernziel und Fahrplan: drei Notfälle, die man nicht sieht.', 'reagieren spontan (helfen hoch? halten fest?), äußern Vermutungen', 'Plenum', 'Blatt 1', 'Betroffenheit, kognitiver Konflikt („helfen = hochhelfen?“); Vorwissen aus Woche 2 (Lagerung „nicht bewegen“) aktivieren. AFB I'),
    ueber('„Herr Pfeiffer will aufstehen. Darf er das? Woran erkennen Sie, dass es gefährlich sein könnte?“'),
    z('4–12', 'Erarbeitung I: Hinweise finden (AA1)', 'Fall vorlesen lassen; Uhr 4 min; Tabelle im Plenum sichern (Zeilennummern nennen lassen); Ablenker ansprechen: Diabetes, Brille, Schürfwunde; „Er kann die Beine bewegen“ schließt nichts aus.', 'lesen, unterstreichen, Hinweise mit Zeilennummer eintragen', 'EA → Plenum', 'Blatt 1 S. 1', 'Befunde im Fließtext identifizieren – Begründungsteil von KA 5.3. AFB I'),
    z('12–21', 'Erarbeitung II: Rückenmark und Höhe (AA2, Merksatz)', je('Infotext zu zweit lesen lassen (4 min); Zuordnung A/B/C und Herrn Pfeiffers Höhe sichern; neurogenen Schock kurz an Woche 2 anbinden; Merksatz vorlesen lassen.', 'Infotext zu zweit lesen lassen (4 min); Rückenmark-Check am Handy (ca. 4 min, die Höhen-Tabelle hilft); mündlich fragen: Welche Höhe bei Herrn Pfeiffer? (HWS – Hände betroffen); neurogenen Schock kurz an Woche 2 anbinden; Merksatz vorlesen lassen.'), je('lesen, Fachwörter mit Wörterhilfe klären, zuordnen', 'lesen, Fachwörter mit Wörterhilfe klären, acht Fälle am Handy lösen, Herrn Pfeiffers Höhe eintragen'), je('PA → EA → Plenum', 'PA → EA (Handy) → Plenum'), je('Blatt 1 S. 1–2', 'Blatt 1 S. 1–2, Handy'), 'Läsionshöhe → Ausfälle (IKL W4 Nr. 2); Brücke zu KA 5.5. AFB I–II'),
    z('21–35', 'Übung: Kopf halten und achsengerecht drehen (AA3)', 'Vierergruppen abzählen, Platz auf dem Boden schaffen (Isomatten, falls vorhanden). Mit zwei SuS einmal vormachen (3 min): Kopf seitlich mit beiden Händen halten, Kommando „auf drei“, drehen wie ein Baumstamm. **4 Runden à ca. 2 min**, Rollen wechseln (Uhr). Herumgehen, korrigieren (Nacken nicht beugen!). Abschluss: „Was war schwierig?“', 'üben in Rollen (Patient/in, Kopf, Helfer/in, Beobachter/in); Checkliste ausfüllen, Rückmeldung geben', 'GA (4)', 'Boden bzw. Isomatten, Blatt 1 S. 2', 'erleben, dann begründen: Kommando, Achse, Sicherheit beim unvermeidbaren Lagewechsel; Grundlage für AA4 (Maßnahme beschreiben). AFB II'),
    ueber('„Sie haben gespürt, wie schwer es ist, den Kopf ruhig zu halten. Schreiben Sie jetzt auf, warum das so wichtig ist.“'),
    z('35–45', 'Sicherung: Wissen anwenden (AA4)', 'Uhr 6 min; dann Musterlösung (Lösungsteil Blatt 1) vorlesen oder zeigen – **ohne Punkte zu nennen**; Partnercheck: Was fehlt?', 'AA4 allein schreiben; Lösung der Partnerin/des Partners mit der Musterlösung vergleichen und ergänzen', 'EA → PA', 'Blatt 1 S. 2', 'Transfer im KA-Format: AA4 fast wortgleich mit KA 5.3 (anderer Fall). AFB II–III'),
    z('45–48', 'Überleitung (Blatt 2)', '**Blatt 2 austeilen.** „Letzte Woche: Blutungen, die man sieht. Heute: eine Blutung, die man nicht sieht.“ Ausgangssituation vorlesen; drei Patienten benennen.', 'lesen, zuhören', 'Plenum', 'Blatt 2', 'Anknüpfung an Woche 3 (laut Planung), Neugier'),
    z('48–63', je('Frühdienst mit Ampel: ankreuzen und Kurve (AA1)', 'Live-Verlauf „Frühdienst – drei Patienten, eine Ampel“ (AA1)'), je('Uhr 8 min: allein ankreuzen, danach Finns Puls und Blutdruck in die Kurve eintragen. Besprechung Zeile für Zeile (ca. 7 min, Lösung im Lösungsteil): Handzeichen „Wer hat grün, gelb, rot angekreuzt?“, 1–2 begründen lassen. Zwei Fehler benennen: 🔴 bei Herrn Kurz = **Fehlalarm** (Ursache: Anstrengung → nachmessen), 🔴 erst später bei Finn = **zu spät**. Zum Schluss den 08:00-Kasten besprechen („Was wäre, wenn …“) und die Folgen ergänzen (Hinweise).', 'QR-Code scannen lassen, allein oder zu zweit (ca. 8 min); die Karten kommen am Handy von selbst (40 s je Karte). Danach dieselben Karten kurz im Plenum besprechen (Lösung, Auflösungskarte 08:00, „Wer hat gewonnen?“); w4/lehrer.html → „Messkarten groß“ hilft dabei.'), je('Messungen lesen und mit dem Vorwert vergleichen, ankreuzen, Finns Kurve zeichnen, Entscheidung begründen', 'Werte mit Vorwert vergleichen, Finns Kurve zeichnen, Ampel festlegen, Ergebnis übertragen, begründen'), je('EA → Plenum', 'EA/PA (Handy) → Plenum'), je('Blatt 2 S. 1', 'Blatt 2 S. 1, Handy'), je('Trendüberwachung; Fehlalarm **und** „zu spät“ sind beide Fehler; Fehlvorstellung „erst ab Schockindex 1 melden“ wird sichtbar. AFB II–III', 'Trendüberwachung; Fehlalarm **und** „zu spät“ sind Fehler (Gewinnbedingung); Fehlvorstellungen „unter 100 mmHg = Schock“ und „erst ab Schockindex 1 melden“ werden sichtbar. AFB II–III')),
    z('63–68', 'Sicherung: Kurve und Merksatz', 'Finns Kurve: Puls und systolischer Wert laufen wie eine **Schere** aufeinander zu; Abstand der Blutdruckwerte wird kleiner. Merksatz vorlesen lassen.', 'Kurve deuten, Merksatz lesen', 'Plenum', 'Blatt 2 S. 1–2', 'Zeichen der inneren Blutung, warum verzögert (IKL W4 Nr. 3)'),
    z('68–81', 'Wissen anwenden (AA2)', 'Uhr 10 min; Musterlösung (3 min), bei 2.3 Diskussion zulassen (Einzelwert vs. Gesamtbild).', '2.1–2.4 allein schreiben, mit Musterlösung verbessern', 'EA → Plenum', 'Blatt 2 S. 2', 'Befunde mit Vorwerten (KA 5.4), Beurteilen (AFB III), KA 5.5'),
    ueber('Pause, falls im Stundenraster vorgesehen. – „Frau Maler hat sich beim Frühstück am Kaffee verschluckt. Christin hat sie einfach husten lassen. War das richtig?“'),
    z('81–84', 'Blatt 3: Leitfall', '**Blatt 3 austeilen.** Leitfall vorlesen; Leitfrage: Daumen hoch (richtig) / runter (falsch) – Vermutung, nicht auflösen.', 'vermuten, begründen', 'Plenum', 'Blatt 3', 'Anknüpfung Leitfall; kognitiver Konflikt'),
    z('84–93', 'Erarbeitung: Weg der Luft (AA1)', je('Selbstversuch anleiten (30 s: Finger auf den Kehlkopf, schlucken; schlucken und einatmen gleichzeitig?). Infotext lesen lassen, Beschriftung sichern, Merksatz.', 'Selbstversuch anleiten (30 s: Finger auf den Kehlkopf, schlucken; schlucken und einatmen gleichzeitig?). QR-Code „Wo ist was?“: sechs Teile im Bild antippen, je Frage ' + W4.anatomie.sekunden + ' Sekunden – bei einem Fehler oder abgelaufener Zeit beginnt die Übung von vorn; wer alles richtig hat, bekommt die acht Wörter für den Lückentext (ca. 5 min). Lückentext sichern, Merksatz.'), je('Selbstversuch, lesen, beschriften, Merksatz mitlesen', 'Selbstversuch, Teile am Handy antippen, Lückentext ausfüllen, Merksatz mitlesen'), je('EA/PA → Plenum', 'EA (Handy) → Plenum'), je('Blatt 3 S. 1', 'Blatt 3 S. 1, Handy'), 'Atemwegsanatomie, Ventilation, Folgen der Hypoxie (IKL Fremdkörperaspiration Nr. 1). AFB I–II'),
    z('93–105', 'Leicht oder schwer? Lesetext (AA2)', je('Uhr 8 min: Text lesen, Tabelle in Stichworten ausfüllen.', 'QR-Code scannen lassen (ein Handy für zwei reicht), Text mit Bildern am Handy lesen; Uhr 8 min, Tabelle in Stichworten ausfüllen.') + ' Sichern Zeile für Zeile; fragen: „Was steht im Text, gehört aber nicht in die Tabelle?“ (Absatz 1: wer sich öfter verschluckt). Kernsatz an die Tafel: „Wer laut rufen kann, bekommt Luft. Nicht auf blaue Lippen warten!“', 'Text lesen, Informationen suchen und in Stichworten eintragen', 'EA → Plenum', je('Blatt 3 S. 1–2', 'Blatt 3 S. 1–2, Handy'), 'Informationen aus einem Text entnehmen und ordnen (Reihenfolge anders als in der Tabelle, Ablenker); Merkmale leicht/schwer – Grundlage für 3.1 (Muster KA 4.1); Fehlvorstellung „erst bei blauen Lippen handeln“. AFB I–II'),
    z('105–115', 'Wissen anwenden (AA3)', 'Uhr 8 min, dann Musterlösung (2 min) – ohne Punkte zu nennen.', '3.1 und 3.2 allein schreiben, mit Musterlösung verbessern', 'EA → Plenum', 'Blatt 3', '3.1 = Muster KA 4.1; 3.2 = Folgen der Hypoxie erklären (IKL Fremdkörperaspiration Nr. 1). AFB II'),
    z('115–120', 'Abschluss', 'Leitfrage beantworten lassen (2 Zeilen). Bogen zum Einstieg: „Was tun Sie jetzt, wenn Herr Pfeiffer sagt: Helfen Sie mir hoch?“ Blitzlicht: Drei Notfälle, die man nicht sieht – woran erkennen Sie sie?', 'Leitfrage schriftlich beantworten, Blitzlicht', 'EA → Plenum', 'Blatt 3', 'Leitfall abschließen, Lernzuwachs sichtbar machen'),
    z('120–135', 'Puffer (ca. 15 min)', 'Reserve für langsames Lesen und Schreiben, Übung und Musterlösungen. Schnelle SuS: ' + je('„Schon fertig?“ auf Blatt 1 und 2, „Für die Schnellen“ auf Blatt 3 (3.3, 3.4) – Antworten auf ein Extrablatt (Blätter bereitlegen).', '„Schon fertig?“ auf Blatt 1 (Zusatzfrage, Antwort auf ein Extrablatt) und Blatt 2 (Trend-Detektiv) und „Für die Schnellen“ auf Blatt 3: 3.3 auf ein Extrablatt, Atemweg-Check, Simulation „Notfall-Ampel im Speisesaal“ (zu zweit).'), '–', '–', '–', 'Zeitreserve; 3.3 (Beurteilen) vertiefen'),
  ];
  push(planTabelle(B, sp, zeilen, 17));
  return k;
}

// Tabelle für den Verlaufsplan: Zeilen dürfen über den Seitenumbruch laufen (sonst bleibt viel Weißraum), Kopfzeile wiederholt sich
function planTabelle(B, spalten, zeilen, schrift) {
  const r = rahmen('000000', 4);
  const zelle = (kinder, w, o = {}) => B.zelle(kinder, w, { borders: r, ...o });
  const pa = (text, o = {}) => new Paragraph({ spacing: { after: 0, line: 245 }, children: B.runs(text, { size: schrift, ...o }) });
  const kopfZeile = new TableRow({ tableHeader: true, cantSplit: true, children: spalten.map((x) => zelle([pa(x.text, { bold: true })], x.w, { shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS_KOPF } })) });
  const rows = zeilen.map((z) => new TableRow({ cantSplit: false, children: (() => {
    const out = []; let col = 0;
    for (const c of z) {
      const span = (c && c.colSpan) || 1;
      const w = spalten.slice(col, col + span).reduce((x, y) => x + y.w, 0);
      col += span;
      const text = typeof c === 'string' ? c : (c.text || '');
      out.push(zelle([pa(text, (c && c.o) || {})], w, { columnSpan: span > 1 ? span : undefined, shading: c && c.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: c.fill } : undefined }));
    }
    return out;
  })() }));
  return new Table({ width: { size: spalten.reduce((x, y) => x + y.w, 0), type: WidthType.DXA }, columnWidths: spalten.map((x) => x.w), layout: TableLayoutType.FIXED, rows: [kopfZeile, ...rows] });
}

function hinweise(B) {
  const k = []; const push = (...x) => k.push(...x.filter(Boolean));
  const V = W4.verlauf, AMP = W4.ampel;
  const p = (t) => B.p(t, { spacing: { after: 70, line: 252 } });
  push(B.abschnitt('Vorbereitung und Hinweise', { pageBreakBefore: true }));
  push(B.zwischen('Material und Gruppen'));
  push(p('**Kopien:** Blatt 1 (S. 1–2), Blatt 2 (S. 3–4), ' + je('Blatt 3 (S. 5–7: S. 5/6 beidseitig, S. 7 einzeln)', 'Blatt 3 (S. 5–6)') + ' je beidseitig, getrennt austeilen. **Isomatten:** 6 Stück, falls vorhanden – sonst auf dem sauberen Boden üben, Jacken oder Decken unter Kopf und Rücken. **Praxisübung:** 3BFP2.1 (23 SuS) = 5 Vierergruppen + 1 Dreiergruppe (dort beobachten Sie selbst oder die Rolle Beobachter/in entfällt); 3BFP2.2 (20 SuS) = 5 Vierergruppen. ' + je('**Kein Smartphone nötig.**', '**Handys:** ein Handy pro Paar reicht; WLAN vorher prüfen. Fällt es aus: die analoge Fassung kopieren (KB1_W4_Wirbelsaeule_Blutung_analog_SV) – sie enthält dieselben Aufgaben.')));
  push(B.zwischen(je('Vorbereitung auf die Klassenarbeit – alles auf Papier', 'Vorbereitung auf die Klassenarbeit – hängt an keiner Handy-Übung')));
  push(p('Alle Inhalte und Aufgaben, die die KA verlangt, stehen auf Papier: Infotexte, fertige Merksätze und Aufgaben im KA-Format mit Musterlösung. ' + je('', 'Die Smartphone-Übungen sind nur der Weg dorthin (Rückenmark-Check, Live-Verlauf, Wo ist was?) oder Zusatz für Schnelle („Schon fertig?“, Simulation). Die analoge Fassung hat dieselben Aufgaben. ') + '**Punkte stehen nur in der Lehrerversion:** Auf dem Arbeitsblatt sollen die SuS nicht erkennen, welche Aufgaben KA-Muster sind (KA-Aufgaben und andere Aufgaben stehen gemischt in derselben Tabelle). Deshalb bei der Musterlösung keine Punkte nennen.'));
  const spKA = [{ text: 'KA KB 1', w: 2300 }, { text: 'Erwartung laut Erwartungshorizont', w: 4200 }, { text: 'Vermittelt auf Papier', w: 4000 }, { text: 'Schriftlich geübt (KA-Format)', w: 0 }];
  spKA[3].w = B.breite - spKA.slice(0, 3).reduce((x, y) => x + y.w, 0);
  push(B.tabelle(spKA, [
    ['**5.3** (2 P.) Begründen, warum nicht bewegen + eine Maßnahme', 'Hinweise (Sturz aus der Höhe, Nackenschmerz, Kribbeln) → HWS/Rückenmark; Bewegung kann das Rückenmark weiter schädigen → Querschnittlähmung, bei hoher Läsion Atemstörung · Kopf mit beiden Händen in der vorgefundenen Lage halten, bitten, sich nicht zu bewegen, nicht aufsetzen; Lagewechsel nur wenn unvermeidbar, dann achsengerecht mit mehreren', 'Blatt 1: AA1 (Hinweise im Fall), Infotext (instabil, Querschnittlähmung), Höhen-Tabelle (HWS sehr hoch → Atmung), **Merksatz** (alle Elemente), AA3 Übung auf dem Boden oder auf Isomatten (ohne Handy)', 'Blatt 1, **AA4** (fast wortgleich, anderer Fall)'],
    ['**4.1** (2 P.) leichte und schwere Atemwegsverlegung anhand der Situation unterscheiden', 'leicht: kräftig und wirksam husten, sprechen und atmen (Beginn) · schwer: Husten schwach und unwirksam, kann nicht sprechen, kaum atmen, Griff an den Hals, Zyanose (jetzt) – je Form mit Fallbezug', 'Blatt 3: Leitfall Frau Maler, AA2 (**Lesetext** mit allen Merkmalen → Tabelle leicht/schwer)' + je('', '; Simulation als Zusatz für Schnelle'), 'Blatt 3, **3.1** (gleicher Operator, Fall mit beiden Phasen wie in der KA), Leitfrage; 3.3 für Schnelle'],
    ['**5.5** (1 P.) Befund beim neurogenen Schock', 'Bradykardie bzw. fehlende Tachykardie; warme, trockene Haut unterhalb der Verletzung', 'Blatt 1: Infotext (neurogener Schock); Woche 2 (Vergleichstabelle)', 'Blatt 2, **2.4**'],
    ['**5.4** (3 P., Wiederholung aus Woche 1) Kompensation, fast normaler Blutdruck', 'Barorezeptoren, Sympathikus, Zentralisation, RAAS/ADH; Blutdruck fällt spät; Schockindex', je('Blatt 2: AA1 (ankreuzen, Kurve), ', 'Blatt 2: Live-Verlauf, Kurve, ') + '**Merksatz** (Puls steigt, Abstand kleiner, gleichen lange aus, Blutdruck fällt spät)', 'Blatt 2, **2.1** (Befunde mit Vorwerten), **2.2**, 2.3']
  ], { schrift: 17 }));
  push(p('Nicht in Woche 4 (laut Planung Woche 5): **KA 4.2** (Vorgehen nach ERC/GRC 2025: Rückenschläge, Oberbauchkompressionen, Bewusstlosigkeit, ärztliche Kontrolle) und **4.3** (Aspirationsprophylaxe). Diese 6 Punkte müssen in Woche 5 sicher vorkommen – bitte mit K. Lohner abstimmen.'));
  push(B.zwischen('Methodenwechsel 1: Praxisübung'));
  push(p('Sicherheit: langsam, ohne Kraft, nicht ruckartig. Wer Nacken- oder Rückenbeschwerden hat, liegt nicht. Die liegende Person bleibt locker. Der Kopf wird seitlich mit beiden Händen gehalten (nicht am Hals ziehen, nicht anheben). Es gibt keine Rolle „HWS-Orthese anlegen“ – das ist nach den Erste-Hilfe-Leitlinien nicht Aufgabe von Ersthelfenden und wird in der KA nicht erwartet.'));
  push(B.zwischen(je('Blatt 2, AA1: Frühdienst mit Ampel (ankreuzen)', 'Methodenwechsel 2: Live-Verlauf am Smartphone')));
  push(p(je('Einzelarbeit ohne Spiel: Die SuS lesen fünf Messungen (Herr Kurz um 05:50 Uhr direkt nach dem Gehen und um 07:10 Uhr in Ruhe, Finn um 06:00, 07:00 und 07:20 Uhr), kreuzen je eine Ampel an und tragen Finns Werte in die Kurve ein. Die Reihenfolge ist bewusst keine Treppe (🟡 – 🟢 – 🟡 – 🟢 – 🔴): Herr Kurz steht am Anfang, und direkt vor Finns Notfall ist noch einmal „weiter wie geplant“ richtig. Jana fehlt bewusst – sie kommt in Aufgabe 2.3. Der Schockindex muss nicht gerechnet werden (Vorwissen Woche 1); er kommt nur in der Besprechung vor („Finn ist bei 0,9 schon ein Notfall“). **08:00-Kasten (auf dem Blatt):** Die Werte ohne Alarm vervollständigen die Kurve. Im Gespräch ergänzen: „' + V.aufloesung.text + '“', 'w4/verlauf.html (QR-Code auf Blatt 2): 40 Sekunden je Karte, Zeit abgelaufen = 🟢; sofortige Rückmeldung, am Ende Gewonnen/Nicht gewonnen und Finns Kurve. Danach die Karten kurz im Plenum besprechen (w4/lehrer.html → „Messkarten groß“, Taste L = Lösung).')));
  if (DIGITAL()) push(p('**Wertung:** genau richtig = 1 Punkt. 🔴 ohne Notfall = **Fehlalarm**. Eine Stufe zu vorsichtig (🟡 statt 🟢) = kein Punkt, aber kein Fehlalarm. **Gewonnen:** Karte 6 = 🔴 **und** höchstens 1 Fehlalarm. Wer immer 🔴 wählt, hat 5 Fehlalarme; wer nie 🔴 wählt, übersieht Finn – beide verlieren.'));
  const spK = [{ text: je('Zeit', 'Karte'), w: 700 }, { text: 'Person, Werte', w: 4000 }, { text: 'SI', w: 650 }, { text: 'richtig', w: 1300 }, { text: 'Begründung und typischer Fehler', w: 0 }];
  spK[4].w = B.breite - spK.slice(0, 4).reduce((s, x) => s + x.w, 0);
  const pers = (id) => V.patienten.find((x) => x.id === id).name;
  const kartenLV = DIGITAL() ? V.karten : T.B2.aa1.messungen.map((m) => (m.karte ? V.karten.find((kk) => kk.nr === m.karte) : m));
  push(B.tabelle(spK, kartenLV.map((kk) => [DIGITAL() ? `**${kk.nr}** · ${kk.zeit}` : `**${kk.zeit}**`, `${pers(kk.wer)}: Puls ${kk.puls}, RR ${kk.rr[0]}/${kk.rr[1]}, AF ${kk.af}${kk.vorwert ? ' (Vorwert ' + kk.vorwert + ')' : ''}. ${kk.beobachtung} ${kk.aussage}`, (kk.puls / kk.rr[0]).toFixed(2).replace('.', ','), { lsg: AMP[kk.richtig].kurz }, kk.begruendung]).concat([[`**08:00**`, `Auflösung: Puls ${V.aufloesung.puls}, RR ${V.aufloesung.rr[0]}/${V.aufloesung.rr[1]}, AF ${V.aufloesung.af}. ${V.aufloesung.beobachtung} ${V.aufloesung.aussage}`, (V.aufloesung.puls / V.aufloesung.rr[0]).toFixed(2).replace('.', ','), '–', V.aufloesung.text]]), { schrift: 17 }));
  push(p('Hinweis: Die Ampel ist ein didaktisches Hilfsmittel, kein validierter Frühwarnscore (z. B. NEWS2). In der Praxis gilt: im Zweifel melden. Deshalb zählt 🟡 (Pflegefachkraft informieren) nie als Fehlalarm.' + je(' Wer bei Finn um 06:00 Uhr 🟡 ankreuzt, liegt „zu vorsichtig“, nicht falsch.', ' Bei Jana würde NEWS2 den systolischen Wert 91–100 mmHg mit 2 Punkten werten – wer hier 🟡 wählt, liegt „zu vorsichtig“, nicht falsch; das ist ein guter Anlass zur Diskussion „Einzelwert oder Gesamtbild?“.')));
  if (DIGITAL()) push(B.zwischen('Blatt 3, AA1: „Wo ist was?“ am Handy und Lückentext'));
  if (DIGITAL()) push(p('w4/anatomie.html (QR-Code auf Blatt 3): sechs Fragen „Wo ist …?“ in zufälliger Reihenfolge – Kehldeckel, Kehlkopf, Luftröhre, rechter und linker Hauptbronchus, Lungenbläschen. Je Frage ' + W4.anatomie.sekunden + ' Sekunden. Ein falscher Tipp (rot/grün markiert) oder abgelaufene Zeit (gesuchter Teil grün) → die Übung beginnt von vorn (Falle: rechts und links gelten von der Person aus). Ein Tipp daneben zählt nicht als Fehler. Wer alles richtig hat, sieht das beschriftete Bild und die acht Lückenwörter in alphabetischer Reihenfolge (alle fett gedruckten Fachwörter des Informationstexts). Die Lehreransicht zeigt nur anonym, wie viele Fragen ein Handy geschafft hat.'));
  push(B.zwischen('Blatt 3, AA2: leicht oder schwer? (Lesetext)'));
  push(p('Die SuS entnehmen die Merkmale einem längeren Text (' + je('auf dem Arbeitsblatt', 'am Handy: w4/verlegung.html, mit drei Bildern') + '). Die Reihenfolge im Text ist bewusst anders als in der Tabelle (erst schwer, dann leicht; das Handeln steht einmal vorn, einmal hinten; die Zyanose erst im letzten Absatz), Absatz 1 gehört nicht in die Tabelle. Einen Merksatz gibt es hier bewusst nicht: Die gesicherte Tabelle ist die Zusammenfassung – mit einem kurzen Merksatz daneben würden die SuS nur abschreiben. **Für die Schnellen** (unten auf Blatt 3): 3.3' + je(' und 3.4', '') + ' ohne Schreiblinien, Antworten auf ein Extrablatt' + je('.', '; dazu Atemweg-Check und Simulation am Handy.')));
  if (DIGITAL()) push(B.zwischen('Für die Schnellen am Handy: Notfall-Ampel im Speisesaal (Simulation)'));
  if (DIGITAL()) push(p('Zusatz ganz unten auf Blatt 3, nur für Schnelle – nicht nötig für die KA. w4/speisesaal.html: 6 Szenen, die ersten drei fest (Frau Maler wie im Leitfall, Herr Roth leicht, Herr Roth schwer), die letzten drei gemischt (Frau Brückner: leicht, ruft „Ich ersticke!“ – Falle für Fehlalarm; Herr Vogt: stille, schwere Verlegung mit noch rosigen Lippen – Falle „abwarten“; Frau Lenz: schwacher Husten, Pfeifen – Falle „sie hustet doch“). **Schwere Verlegung:** Nach 6 s Lesezeit sinkt die SpO₂ um 1,5 % pro Sekunde, jede falsche Wahl kostet 10 %; unter 60 % wird die Person bewusstlos (Szene verloren). **Leichte Verlegung:** kein Abfall; Notruf = Fehlalarm. 2 Punkte beim ersten, 1 Punkt beim zweiten Versuch. **Bestanden:** niemand bewusstlos und höchstens 1 Fehlalarm.'));
  push(p('Leitlinien: Nach ERC/GRC 2025 bei leichter Verlegung zum Husten auffordern und beobachten. Den Ablauf bei schwerer Verlegung (Rückenschläge, Oberbauchkompressionen, Bewusstlosigkeit → Reanimation, ärztliche Kontrolle) behandelt laut Planung **Woche 5** (Phantomtraining). Deshalb heißt es bei schwerer Verlegung in Woche 4 (Tabelle in AA2, 3.1) nur „sofort laut Hilfe rufen, Notruf veranlassen, nicht allein lassen“.' + je('', ' In der Simulation erscheint „auf den Rücken klopfen“ nur in leichten Szenen als falsche Wahl (stört den wirksamen Husten) – nie in schweren, damit nichts den Leitlinien widerspricht.')));
  if (DIGITAL()) push(B.zwischen('Freiwillige Lehreransicht: Fortschritt ohne Raumcode (eigener Worker, ohne Woche 2)'));
  if (DIGITAL()) push(p('w4/lehrer.html → „Fortschritt (letzte 45 Minuten)“: **ohne Raumcode und ohne Namen.** Für jede Handy-Übung zeigt die Seite einen Balken pro Handy, das die Übung in den letzten 45 Minuten geöffnet hat (gelb = Schritt x von n, grün = fertig), dazu „✓ x fertig · y in Arbeit“. Sie aktualisiert sich alle 10 Sekunden; „Messkarten groß“ hilft bei der Besprechung von Blatt 2. **Datenschutz:** Die Handys senden nur eine zufällige Geräte-ID, die Übung, den Schritt und „fertig“ – keine Namen, keine Antworten. Die Geräte-ID wird nie angezeigt; 60 Minuten nach der letzten Meldung löscht der Worker den Eintrag. Ohne Internet oder ohne eingerichteten Worker laufen die Übungen ganz normal. **Hinweis:** Gezählt werden alle Handys, die die Adresse in dieser Zeit genutzt haben – arbeitet gleichzeitig eine andere Klasse damit, erscheint sie mit. Probeansicht: lehrer.html?demo=1.'));
  push(B.zwischen('Fachliche Hinweise'));
  push(p('**Wirbelsäule:** Ersthelfende minimieren Bewegung und halten den Kopf manuell in der vorgefundenen Lage; keine Zervikalstütze durch Laien (ERC-Leitlinien Erste Hilfe). Lagewechsel nur, wenn unvermeidbar (Erbrechen, Atemwege, Gefahr am Ort), dann achsengerecht. Bei älteren Menschen reicht oft ein Sturz aus geringer Höhe; inkomplette Halsmarkverletzungen betreffen häufig die Arme stärker als die Beine – das passt zu Herrn Pfeiffer (Hände betroffen, Beine beweglich). Läsionshöhe vereinfacht: C3–C5 Zwerchfell, C5–Th1 Arme und Hände; Tetraplegie bei HWS, Paraplegie bei BWS/LWS; neurogener Schock vor allem bei Verletzungen oberhalb von etwa Th6.'));
  push(p('**Innere Blutung:** zweizeitige Milzruptur (Stunden bis Tage nach dem Trauma); Schmerz in der linken Schulter (Kehr-Zeichen) durch Zwerchfellreizung; junge Menschen kompensieren bis etwa 30 % Blutverlust ohne deutlichen Blutdruckabfall (vgl. EH KA 5.4); kleiner werdende Blutdruckamplitude; Schockindex normal ca. 0,5, über 1 spricht für Schock – Finn ist bei 0,9 schon ein Notfall. Polytrauma und Notaufnahme nur als Querverweis.'));
  push(p('**Atemwege:** Der rechte Hauptbronchus ist kürzer, weiter und steiler. Hypoxie: Bewusstlosigkeit und Kreislaufstillstand innerhalb weniger Minuten; Gehirnzellen können nach etwa 3–5 Minuten ohne Sauerstoff bleibend geschädigt werden.' + je('', ' Die SpO₂ in der Simulation ist bewusst als „nur in der Simulation“ gekennzeichnet.')));
  push(B.zwischen('Bezug zur Klassenarbeit und zum Examen (nur für Lehrkräfte)'));
  push(p('**KA KB 1, Aufg. 5.3** („Begründen Sie, warum Herr Brenner möglichst nicht bewegt werden soll, und beschreiben Sie eine Maßnahme dazu.“) → Blatt 1, AA1 (Hinweise im Fall), AA3 (Maßnahme erlebt), **AA4** (fast wortgleich, anderer Fall: Herr Pfeiffer). **KA 4.1** („Unterscheiden Sie anhand der Situation eine leichte von einer schweren Atemwegsverlegung.“) → Blatt 3, AA2 (Lesetext, Tabelle leicht/schwer), **AA3 3.1** (gleicher Operator, Fall mit beiden Phasen). **KA 5.5** → Blatt 2, 2.4 und Infotext Blatt 1. **KA 5.4** (Kompensation, fast normaler Blutdruck) → Blatt 2 (' + je('AA1', 'Live-Verlauf') + ', 2.1, 2.2) als Wiederholung. KA 4.2/4.3 (Vorgehen nach ERC, Prophylaxe) sind laut Planung Woche 5. Der KA-Fall (Herr Brenner, Frau Sommer) wird nicht vorweggenommen.'));
  push(p('**Examensvorbilder** (BW, Ordner „Pflegeexamen KBS“; ein direktes Original zu den drei Themen gibt es nicht – genutzt wurden Format und Operatoren): Mai 2024 Tag 3, Aufg. 8.1/8.2 (Notfall erläutern 4 P. + sechs Sofortmaßnahmen stichwortartig 6 P.; EH: „… sich nicht unnötig bewegt“) · Mai 2024 Tag 2, Aufg. 1.1 und 3.2 (Marlene Hofer, LWK-Fraktur; „keine Drehbewegungen“, Bedarf 3 P. + Begründung 3 P.) · Juli 2024 Tag 1, Aufg. 2.2 (Th10-Läsion, Kontext Querschnitt) · Mai 2026 Tag 1, Aufg. 1.3–1.5 (Nachblutung, „hämorrhagischer Schock“, Vitalzeichen) · Jan 2026 Tag 2, Aufg. 1.4/1.5 („Blutdruckabfall oder Pulserhöhung rechtzeitig erkannt“) · Mai 2023 Tag 3, Aufg. 4.2 („Nennen Sie vier in der Fallsituation beschriebene Symptome, die auf eine akute Atemstörung hinweisen“, 0,5 P. je Symptom). Fallsituationen mit Zeilennummern und Rahmensätze wie im Formmuster.'));
  push(B.zwischen('Ich-kann-Liste (wird nicht ausgeteilt)'));
  push(p('**Woche 4 Nr. 1** (Hinweise, Bewegungsminimierung, Maßnahmen) → Blatt 1 AA1, AA3, AA4 · **Nr. 2** (Läsionshöhe, neurogener Schock) → Blatt 1 Infotext, AA2 (mit Herrn Pfeiffers Höhe); Blatt 2, 2.4 · **Nr. 3** (innere Blutung, verzögert, Verlauf; Beispiel 17-Jähriger) → Blatt 2 (Merksatz mit allen Zeichen der Ich-kann-Liste, u. a. Abwehrspannung und zunehmender Bauchumfang) · **Fremdkörperaspiration Nr. 1** (Hypoxie, rechter Hauptbronchus) → Blatt 3 AA1 (Lückentext), Merksatz, **3.2** · **Nr. 2** (leicht/schwer, Frau Maler) → Blatt 3 AA2 (Lesetext, Tabelle), 3.1, Leitfrage; 3.3 für Schnelle. Nr. 3–5 (Vorgehen ERC, Prophylaxe, Ingestion) → Woche 5.'));
  push(B.zwischen('Nicht enthalten'));
  push(p('Vorgehen bei schwerer Atemwegsverlegung (Rückenschläge, Oberbauchkompressionen), Kinder und Säuglinge, Phantomtraining, Dysphagie-Prävention, Ingestion → Woche 5 · Reanimation, ABCDE, Notaufnahme/Polytrauma → KB III bzw. nur Querverweis · psychologische Erste Hilfe → KB II · Notruf absetzen, SBAR → Deutsch.'));
  push(B.zwischen('Quellen'));
  push(p('ERC Guidelines 2025: Basic Life Support (Fremdkörperverlegung der Atemwege) und First Aid; deutsche Fassung GRC · MSD Manual Profi-Ausgabe: Rückenmarkverletzungen; Milzverletzungen; Schock · Planungstabelle KB 1 (Lohner/Klawitter) · Ich-kann-Liste KB I · KA 2 KB 1/KB 2 mit Erwartungshorizont · Leitfall „Reanimation – und nicht nur ich war hilflos“ · BW-Abschlussprüfungen 2023–2026 · Entwurf Anforderungsniveau mit Operatoren (2021) · Formmuster schriftliche Prüfung (2022).'));
  return k;
}

/* =====================================================================
   DOKUMENTE
   ===================================================================== */
// Zwei Tabellen direkt hintereinander verschmelzen in Word/LibreOffice zu einer – deshalb ein kleiner Absatz dazwischen.
function trenne(children) {
  const out = [];
  for (const c of children) {
    if (c instanceof Table && out.length && out[out.length - 1] instanceof Table) out.push(leer(40));
    out.push(c);
  }
  return out;
}
// Etwas knappere Ränder als Woche 2 (Kopf- und Fußzeile näher am Rand) – eigene Kopie, ab_bausteine.js bleibt unverändert
const SEITE_W4 = { size: SEITE_HOCH.size, margin: { top: 1300, right: 1134, bottom: 1000, left: 1134, header: 400, footer: 400 } };
const sektionHoch = (children, fussText = T.FUSS) => ({ properties: { page: SEITE_W4 }, headers: { default: kopf(BREITE_HOCH, { thema: T.THEMA }) }, footers: { default: fuss(fussText) }, children: trenne(children) });

async function speichern(doc, name) {
  const buf = await Packer.toBuffer(doc);
  fs.mkdirSync(AUS, { recursive: true });
  fs.writeFileSync(path.join(AUS, name), buf);
  console.log('geschrieben:', path.join(AUS, name));
}

const alleBlaetter = (B) => [...blatt1(B), ...blatt2(B), ...blatt3(B)];

async function main() {
  for (const modus of ['analog', 'digital']) {
    MODUS = modus;
    const name = `${NAME}_${modus}`;
    const fassung = modus === 'analog' ? 'analoge Fassung' : 'digitale Fassung';
    const SV = bausteine({ lsg: false, breite: BREITE_HOCH });
    await speichern(new Document({ creator: 'KB I · 3BFP2', title: `KB1 W4 Wirbelsäule, innere Blutung, Atemwege – Schülerversion (${fassung})`, styles: STILE, sections: [sektionHoch(alleBlaetter(SV))] }), name + '_SV.docx');
    MARKIERT = true;
    const SVM = bausteine({ lsg: false, breite: BREITE_HOCH });
    await speichern(new Document({ creator: 'KB I · 3BFP2', title: `KB1 W4 – Schülerversion (${fassung}), Ansichtsexemplar mit Markierungen`, styles: STILE, sections: [sektionHoch(alleBlaetter(SVM), T.FUSS + ' · Ansichtsexemplar mit Markierungen')] }), name + '_SV_markiert.docx');
    MARKIERT = false;
    const LQ = bausteine({ lsg: true, breite: BREITE_QUER });
    const LH = bausteine({ lsg: true, breite: BREITE_HOCH });
    const sektionen = [
      { properties: { page: SEITE_QUER }, headers: { default: kopf(BREITE_QUER, { thema: T.THEMA }) }, footers: { default: fuss(T.FUSS + ' · Lehrerversion (' + fassung + ')') }, children: trenne([...verlaufsplan(LQ), ...hinweise(LQ)]) },
      sektionHoch([B_LSG_TITEL(LH), ...alleBlaetter(LH)], T.FUSS + ' · Lehrerversion (' + fassung + ')')
    ];
    await speichern(new Document({ creator: 'KB I · 3BFP2', title: `KB1 W4 Wirbelsäule, innere Blutung, Atemwege – Lehrerversion mit Lösungen (${fassung})`, styles: STILE, sections: sektionen }), name + '_LV_LSG.docx');
  }
}
const B_LSG_TITEL = (B) => new Paragraph({ spacing: { after: 120 }, children: [B.b('Lösungen und Zeitangaben zu den drei Arbeitsblättern (' + je('analoge', 'digitale') + ' Fassung) ', { size: 24 }), B.loes('[LSG]', { bold: true, size: 24 })] });

if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
module.exports = { umbrechen };

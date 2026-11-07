/* Gestaltungsbausteine für die Arbeitsblätter des Themenblocks 2 (KB I · 3BFP2).
   Optik wie Woche 1 (Lohner): Schulkopf mit Logo, lachsfarbene Infokästen, Tabellenkopf in Lachs,
   Symbole vor den Arbeitsaufträgen, Lösungen gelb markiert. Dazu die Handy-Kästen mit QR-Code
   aus „03_Regelkreis“ (Klawitter).
   Wird von ab_w2.js benutzt – hier stehen keine Inhalte. */
'use strict';
const fs = require('fs');
const path = require('path');
const D = require('docx');
const {
  Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  AlignmentType, VerticalAlign, TabStopType, Tab, TableLayoutType, HeightRule, Header, Footer,
  PageNumber, PageBreak
} = D;

const BILD_ORDNER = path.join(__dirname, 'bilder');
const WURZEL = path.resolve(__dirname, '..');

const F = {
  LACHS_KOPF: 'F1A983',   // Kopfzeile von Tabellen / Kastenüberschrift
  LACHS: 'FAE2D5',        // Infokasten
  LACHS_HELL: 'FCE4D6',   // Leitfrage
  ROSE: 'F6C5AC',
  BLAU_HELL: 'DDEBF7',    // Handy-Kasten
  GRAU_HELL: 'F1F3F3',    // Bausteine / Fallsituation
  GELB_HELL: 'FFF2CC',    // Hinweis für Lehrkräfte
  BLAU_D: '1F4E78',       // Kopf Verlaufsplan
  ORANGE_D: 'C55A11',     // Rahmen
  GRAU_T: '595959',
  GRAU_R: 'A6A6A6'
};

const SCHRIFT = 'Calibri';
const TITELSCHRIFT = 'Calibri Light';
const EMOJI = 'Segoe UI Emoji';

const keinRand = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const ohneRaender = { top: keinRand, bottom: keinRand, left: keinRand, right: keinRand, insideHorizontal: keinRand, insideVertical: keinRand };
const linie = (farbe = '000000', staerke = 4) => ({ style: BorderStyle.SINGLE, size: staerke, color: farbe });
const rahmen = (farbe = '000000', staerke = 4) => ({ top: linie(farbe, staerke), bottom: linie(farbe, staerke), left: linie(farbe, staerke), right: linie(farbe, staerke) });

const PX = (cm) => Math.round(cm * 37.795);

function bild(datei, wCm, hCm) {
  const daten = Buffer.isBuffer(datei) ? datei : fs.readFileSync(path.isAbsolute(datei) ? datei : path.join(BILD_ORDNER, datei));
  return new ImageRun({ type: 'png', data: daten, transformation: { width: PX(wCm), height: PX(hCm) } });
}

/* Erzeugt alle Bausteine für ein Dokument. lsg = true → Lösungen werden gelb markiert eingeblendet. */
function bausteine({ lsg = false, breite = 9072 } = {}) {
  const B = {};
  B.breite = breite;
  B.lsg = lsg;

  /* ---------- Text ---------- */
  // Kurzschreibweise: Strings mit **fett** werden zerlegt.
  B.runs = (text, o = {}) => {
    if (Array.isArray(text)) return text.flatMap((x) => (typeof x === 'string' ? B.runs(x, o) : [x]));
    const teile = String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return teile.map((t) => (t.startsWith('**') ? new TextRun({ text: t.slice(2, -2), bold: true, font: SCHRIFT, ...o }) : new TextRun({ text: t, font: SCHRIFT, ...o })));
  };
  B.t = (text, o = {}) => new TextRun({ text, font: SCHRIFT, ...o });
  B.b = (text, o = {}) => new TextRun({ text, bold: true, font: SCHRIFT, ...o });
  B.i = (text, o = {}) => new TextRun({ text, italics: true, font: SCHRIFT, ...o });
  B.emoji = (z, o = {}) => new TextRun({ text: z, font: EMOJI, ...o });
  B.loes = (text, o = {}) => new TextRun({ text, font: SCHRIFT, highlight: 'yellow', ...o });
  B.p = (inhalt, o = {}) => new Paragraph({ children: B.runs(inhalt), spacing: { after: 80, line: 264 }, ...o });
  B.leer = (nach = 0) => new Paragraph({ children: [], spacing: { after: nach } });
  B.umbruch = () => new Paragraph({ children: [new PageBreak()] });

  // Lösungsabsatz (nur in der LSG sichtbar). In der SV: nichts (oder Platzhalter).
  B.lp = (inhalt, o = {}) => (lsg ? new Paragraph({ children: B.runs(inhalt, { highlight: 'yellow' }), spacing: { after: 60, line: 252 }, ...o }) : null);
  // Lücke im Merksatz/Lückentext
  B.luecke = (wort, zeichen = 14) => (lsg ? B.loes(wort, { bold: true }) : B.t('_'.repeat(zeichen)));

  // Zeile „⏱ 10 min · Einzelarbeit · AFB I · KA-Bezug …“ (nur LSG)
  B.meta = (text) => (lsg ? new Paragraph({ children: [B.emoji('⏱ ', { size: 17, color: F.GRAU_T }), B.i(text, { size: 17, color: F.GRAU_T })], spacing: { after: 60 } }) : null);

  /* ---------- Titel und Überschriften ---------- */
  B.titel = (text, zusatz) => new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 160 },
    children: [new TextRun({ text, font: TITELSCHRIFT, bold: true, size: 32 }), ...(zusatz ? [new TextRun({ text: ' ' + zusatz, font: TITELSCHRIFT, bold: true, size: 32, highlight: 'yellow' })] : [])]
  });
  B.abschnitt = (text, o = {}) => new Paragraph({
    children: [new TextRun({ text, font: SCHRIFT, bold: true, size: 24 })],
    spacing: { before: 240, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: F.GRAU_R, space: 2 } },
    keepNext: true,
    ...o
  });
  B.zwischen = (text) => new Paragraph({ children: [B.b(text, { size: 22 })], spacing: { before: 160, after: 60 }, keepNext: true });

  // Arbeitsauftrag: Symbol(e) + „AA1: Operator – Titel:“ + Text
  B.aa = (symbole, kopf, text, o = {}) => new Paragraph({
    keepNext: true,
    spacing: { before: 200, after: 80, line: 264 },
    children: [
      ...symbole.flatMap((s) => [bild(s, 0.75, 0.75), B.t(' ')]),
      B.b(kopf + ' '),
      ...B.runs(text)
    ],
    ...o
  });
  // Teilaufgabe a), b) …
  B.teil = (symbole, text, o = {}) => new Paragraph({
    keepNext: true,
    spacing: { before: 120, after: 60, line: 264 },
    children: [...symbole.flatMap((s) => [bild(s, 0.6, 0.6), B.t(' ')]), ...B.runs(text)],
    ...o
  });

  /* ---------- Kästen ---------- */
  const zelle = (children, w, o = {}) => new TableCell({
    width: { size: w, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 110, right: 110 },
    children: children.filter(Boolean),
    ...o
  });
  B.zelle = zelle;

  // Kasten mit optionaler Kopfzeile (wie Informationstext in W1)
  B.kasten = (absaetze, { kopf, fill = F.LACHS, kopfFill = F.LACHS_KOPF, rand = F.ORANGE_D, breite: w = breite } = {}) => {
    const r = rahmen(rand, 6);
    const rows = [];
    if (kopf) rows.push(new TableRow({ cantSplit: true, children: [zelle([new Paragraph({ children: B.runs(kopf, { bold: true }), spacing: { after: 0 }, keepNext: true })], w, { borders: r, shading: { type: ShadingType.CLEAR, color: 'auto', fill: kopfFill } })] }));
    rows.push(new TableRow({ cantSplit: true, children: [zelle(absaetze, w, { borders: r, shading: { type: ShadingType.CLEAR, color: 'auto', fill } })] }));
    return new Table({ width: { size: w, type: WidthType.DXA }, columnWidths: [w], layout: TableLayoutType.FIXED, rows });
  };

  // Leitfrage-Sprechblase (zentriert, schmaler)
  B.leitfrage = (text) => {
    const w = Math.round(breite * 0.62);
    const r = rahmen(F.ORANGE_D, 6);
    return new Table({
      width: { size: w, type: WidthType.DXA }, columnWidths: [w], layout: TableLayoutType.FIXED, alignment: AlignmentType.CENTER,
      rows: [new TableRow({ cantSplit: true, children: [zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.emoji('💬 '), B.i(text)] })], w, { borders: r, shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.LACHS_HELL } })] })]
    });
  };

  // Handy-Kasten: Text links, QR rechts, darunter Link (wie 03_Regelkreis)
  B.handy = (seite, absaetze, { linkBasis, qrDatei, fill = F.BLAU_HELL, qrCm = 2.6 } = {}) => {
    const qrW = Math.round(1750 * qrCm / 2.6);
    const r = rahmen('2E75B6', 6);
    const qr = qrDatei && fs.existsSync(qrDatei) ? bild(qrDatei, qrCm, qrCm) : B.t('[QR]', { color: F.GRAU_T });
    return new Table({
      width: { size: breite, type: WidthType.DXA }, columnWidths: [breite - qrW, qrW], layout: TableLayoutType.FIXED,
      rows: [new TableRow({ cantSplit: true, children: [
        zelle([...absaetze, new Paragraph({ spacing: { before: 40, after: 0 }, children: [B.t('Kein QR-Scanner? Link: ', { size: 16, color: F.GRAU_T }), B.t(`${linkBasis}${seite}`, { size: 16, color: F.GRAU_T })] })], breite - qrW, { borders: { top: linie('2E75B6', 6), bottom: linie('2E75B6', 6), left: linie('2E75B6', 6), right: keinRand }, shading: { type: ShadingType.CLEAR, color: 'auto', fill }, verticalAlign: VerticalAlign.CENTER }),
        zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [qr] })], qrW, { borders: { top: linie('2E75B6', 6), bottom: linie('2E75B6', 6), right: linie('2E75B6', 6), left: keinRand }, shading: { type: ShadingType.CLEAR, color: 'auto', fill }, verticalAlign: VerticalAlign.CENTER })
      ] })]
    });
  };

  // App-Kasten ohne QR-Code: Die Übung erscheint in der Stunden-App automatisch, sobald die Folie am Beamer kommt.
  B.app = (absaetze, { fill = F.BLAU_HELL } = {}) => new Table({
    width: { size: breite, type: WidthType.DXA }, columnWidths: [breite], layout: TableLayoutType.FIXED,
    rows: [new TableRow({ cantSplit: true, children: [
      zelle([
        new Paragraph({ spacing: { after: 40 }, children: [B.emoji('📱 '), B.i('In der Stunden-App – erscheint automatisch mit der Folie am Beamer', { size: 16, color: F.GRAU_T })] }),
        ...absaetze
      ], breite, { borders: rahmen('2E75B6', 6), shading: { type: ShadingType.CLEAR, color: 'auto', fill } })
    ] })]
  });

  // Merksatz-Kasten mit Lücken. teile: Strings und { l: 'Lösung', n: Zeichenzahl }
  B.merksatz = (titel, zeilen) => B.kasten(
    zeilen.map((teile) => new Paragraph({ spacing: { after: 100, line: 300 }, children: teile.flatMap((x) => (typeof x === 'string' ? B.runs(x) : [B.luecke(x.l, x.n || 14)])) })),
    { kopf: titel, fill: 'FFFFFF', kopfFill: F.BLAU_HELL, rand: '2E75B6' }
  );

  /* ---------- Tabellen ---------- */
  // spalten: [{ text, w }], zeilen: [[zelle, …]] – zelle = String | Paragraph[] | { text, lsg, fill, colSpan, hoehe }
  B.tabelle = (spalten, zeilen, { kopfFill = F.LACHS_KOPF, hoehe, rand = '000000', schrift = 20, kopfFarbe } = {}) => {
    const r = rahmen(rand, 4);
    const kopfZeile = new TableRow({
      tableHeader: true, cantSplit: true,
      children: spalten.map((s) => zelle([new Paragraph({ spacing: { after: 0 }, children: B.runs(s.text, { bold: true, size: schrift, color: kopfFarbe }) })], s.w, { borders: r, shading: { type: ShadingType.CLEAR, color: 'auto', fill: kopfFill } }))
    });
    const body = zeilen.map((z) => new TableRow({
      cantSplit: true,
      height: hoehe ? { value: hoehe, rule: HeightRule.ATLEAST } : undefined,
      children: (() => {
        const out = []; let col = 0;
        for (const c of z) {
          const span = (c && c.colSpan) || 1;
          const w = spalten.slice(col, col + span).reduce((s, x) => s + x.w, 0);
          col += span;
          let kinder;
          if (c === null || c === undefined || c === '') kinder = [new Paragraph({ spacing: { after: 0 }, children: [] })];
          else if (typeof c === 'string') kinder = [new Paragraph({ spacing: { after: 0, line: 252 }, children: B.runs(c, { size: schrift }) })];
          else if (Array.isArray(c)) kinder = c.filter(Boolean);
          else if (c.lsg !== undefined) kinder = [new Paragraph({ spacing: { after: 0, line: 252 }, children: lsg ? B.runs(c.lsg, { size: schrift, highlight: 'yellow' }) : (c.text ? B.runs(c.text, { size: schrift }) : []) })];
          else if (c.absaetze) kinder = c.absaetze.filter(Boolean);
          else kinder = [new Paragraph({ spacing: { after: 0, line: 252 }, children: B.runs(c.text || '', { size: schrift, ...(c.o || {}) }) })];
          out.push(zelle(kinder, w, { borders: r, columnSpan: span > 1 ? span : undefined, shading: c && c.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: c.fill } : undefined, verticalAlign: c && c.mitte ? VerticalAlign.CENTER : undefined }));
        }
        return out;
      })()
    }));
    return new Table({ width: { size: spalten.reduce((s, x) => s + x.w, 0), type: WidthType.DXA }, columnWidths: spalten.map((s) => s.w), layout: TableLayoutType.FIXED, rows: [kopfZeile, ...body] });
  };

  // Aufgabentabelle im KA-Format: Nr. | Aufgabe | Punkte
  B.aufgaben = (liste) => {
    const w1 = 620, w3 = 1150, w2 = breite - w1 - w3;
    return B.tabelle(
      [{ text: 'Nr.', w: w1 }, { text: 'Aufgabe', w: w2 }, { text: 'Punkte', w: w3 }],
      liste.map((a) => [{ text: `**${a.nr}**` }, a.vorsatz ? { absaetze: [new Paragraph({ spacing: { after: 40 }, children: B.runs(a.vorsatz, { size: 20, italics: true }) }), new Paragraph({ spacing: { after: 0 }, children: B.runs(a.text, { size: 20 }) })] } : a.text, `___ / ${a.punkte}`]),
      { kopfFill: F.LACHS_KOPF }
    );
  };

  // Schreiblinien (Tabelle ohne Seitenränder). loesung: Array von Strings (nur LSG)
  B.linien = (anzahl, loesung = []) => {
    const rl = { style: BorderStyle.SINGLE, size: 4, color: '8C8C8C' };
    if (lsg && loesung.length) {
      return B.kasten(loesung.map((z) => new Paragraph({ spacing: { after: 50, line: 252 }, children: B.runs(z, { size: 20, highlight: 'yellow' }) })), { fill: 'FFFFFF', rand: F.GRAU_R });
    }
    return new Table({
      width: { size: breite, type: WidthType.DXA }, columnWidths: [breite], layout: TableLayoutType.FIXED, borders: ohneRaender,
      rows: Array.from({ length: anzahl }, () => new TableRow({ height: { value: 440, rule: HeightRule.EXACT }, children: [new TableCell({ width: { size: breite, type: WidthType.DXA }, borders: { top: keinRand, left: keinRand, right: keinRand, bottom: rl }, children: [new Paragraph({ children: [] })] })] }))
    });
  };

  B.punktezeile = (max) => new Paragraph({ spacing: { before: 140, after: 80 }, children: [B.b(`Meine Punkte: ____ / ${max}   ·   Das muss ich noch üben: `), B.t('_'.repeat(48))] });

  // Zwei Spalten ohne Rahmen
  B.zweiSpaltig = (links, rechts, wLinks) => new Table({
    width: { size: breite, type: WidthType.DXA }, columnWidths: [wLinks, breite - wLinks], layout: TableLayoutType.FIXED, borders: ohneRaender,
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: wLinks, type: WidthType.DXA }, borders: ohneRaender, verticalAlign: VerticalAlign.CENTER, children: links.filter(Boolean) }),
      new TableCell({ width: { size: breite - wLinks, type: WidthType.DXA }, borders: ohneRaender, verticalAlign: VerticalAlign.CENTER, children: rechts.filter(Boolean) })
    ] })]
  });

  return B;
}

/* ---------- Schulkopf (wie Woche 1) ---------- */
function kopf(breite, { thema = 'Themenblock 2 - Thema: Schock', lehrkraft = 'Lo / Kl' } = {}) {
  const r = rahmen('000000', 4);
  const wLogo = 2300, wDatum = 2400, wName = breite - wLogo - wDatum;
  const zp = (runs) => new Paragraph({ spacing: { after: 0 }, children: runs });
  const z = (children, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: r, margins: { left: 70, right: 70, top: 10, bottom: 10 }, verticalAlign: VerticalAlign.CENTER, children, ...o });
  return new Header({
    children: [
      new Table({
        width: { size: breite, type: WidthType.DXA }, columnWidths: [wLogo, wName, wDatum], layout: TableLayoutType.FIXED,
        rows: [
          new TableRow({ children: [
            z([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [bild('logo_kbs.png', 3.6, 0.94)] })], wLogo, { rowSpan: 3 }),
            z([zp([new TextRun({ text: 'Name:', font: SCHRIFT, size: 16 })])], wName),
            z([zp([new TextRun({ text: 'Datum:', font: SCHRIFT, size: 16 })])], wDatum)
          ] }),
          new TableRow({ children: [z([zp([new TextRun({ text: `Klasse | Fach | Lehrer*in: 3BFP2 | KB I | ${lehrkraft}`, font: SCHRIFT, size: 16 })])], wName + wDatum, { columnSpan: 2 })] }),
          new TableRow({ children: [z([zp([new TextRun({ text: thema, font: SCHRIFT, size: 16, bold: true })])], wName + wDatum, { columnSpan: 2 })] })
        ]
      }),
      new Paragraph({ spacing: { after: 0 }, children: [] })
    ]
  });
}

function fuss(text) {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0 }, children: [new TextRun({ text: text + ' · Seite ', font: SCHRIFT, size: 16, color: F.GRAU_T }), new TextRun({ children: [PageNumber.CURRENT], font: SCHRIFT, size: 16, color: F.GRAU_T })] })] });
}

const SEITE_HOCH = { size: { width: 11906, height: 16838 }, margin: { top: 1417, right: 1134, bottom: 1134, left: 1134, header: 500, footer: 500 } };
const SEITE_QUER = { size: { width: 11906, height: 16838, orientation: D.PageOrientation.LANDSCAPE }, margin: { top: 1300, right: 1134, bottom: 1000, left: 1134, header: 500, footer: 500 } };

const STILE = {
  default: { document: { run: { font: SCHRIFT, size: 22 }, paragraph: { spacing: { after: 80 } } } }
};

module.exports = { bausteine, kopf, fuss, bild, F, SEITE_HOCH, SEITE_QUER, STILE, WURZEL, rahmen, linie, keinRand, ohneRaender };

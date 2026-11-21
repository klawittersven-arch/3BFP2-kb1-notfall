/* Erstellt die Unterlagen für KB I, Themenblock 2, Woche 4 (SW 9):
     arbeitsblatt/KB1_W4_Wirbelsaeule_Blutung_SV.docx       Schülerversion: 3 Blätter je 2 Seiten (6 Seiten)
     arbeitsblatt/KB1_W4_Wirbelsaeule_Blutung_LV_LSG.docx   Lehrerversion: Verlaufsplan, Hinweise, Lösungen,
                                                            Anhang A Messkarten, Anhang B Simulation ohne Handy
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
const AMP_NAME = { gruen: 'grün', gelb: 'gelb', rot: 'rot' };

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
// Aufgaben im KA-Format (Nr. | Aufgabe | Punkte): Kopfzeile nur einmal je Block, darunter die Schreiblinien
function aufgabenListe(B, liste, ersetze = (s) => s) {
  const w1 = 600, w3 = 1000, w2 = B.breite - w1 - w3;
  const r = rahmen('000000', 4);
  const z = (kinder, w, fill) => B.zelle(kinder, w, { borders: r, shading: fill ? { type: ShadingType.CLEAR, color: 'auto', fill } : undefined });
  const pa = (runs, o = {}) => new Paragraph({ keepNext: true, spacing: { after: 0, line: 245 }, children: runs, ...o });
  const out = [];
  liste.forEach((a, i) => {
    const rows = [];
    if (i === 0) rows.push(new TableRow({ cantSplit: true, children: [z([pa([B.b('Nr.', { size: 19 })])], w1, F.LACHS_KOPF), z([pa([B.b('Aufgabe', { size: 19 })])], w2, F.LACHS_KOPF), z([pa([B.b('Punkte', { size: 19 })])], w3, F.LACHS_KOPF)] }));
    rows.push(new TableRow({ cantSplit: true, children: [
      z([pa([B.b(a.nr, { size: 19 })])], w1),
      z([a.vorsatz ? pa(B.runs(a.vorsatz, { size: 19, italics: true }), { spacing: { after: 30, line: 245 } }) : null, pa(B.runs(a.text, { size: 19 }))].filter(Boolean), w2),
      z([pa([B.t(`___ / ${a.punkte}`, { size: 19 })])], w3)
    ] }));
    out.push(new Table({ width: { size: B.breite, type: WidthType.DXA }, columnWidths: [w1, w2, w3], layout: TableLayoutType.FIXED, rows }));
    out.push(linien(B, a.zeilen, B.lsg ? a.loesung.map(ersetze) : []));
  });
  return out;
}
// Arbeitsauftrag mit kleinen Symbolen
const aa = (B, symbole, kopf, text) => B.teil(symbole, `**${kopf}** ${text}`, { spacing: { before: 100, after: 50, line: 250 } });
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
    lernziel(B, t.lernziel),
    fall.tabelle,
    aa(B, [IC.lesen, IC.markieren], 'AA1: Identifizieren – Hinweise finden:', t.aa1.text),
    B.meta('8 min · Einzelarbeit → Plenum · AFB I · IKL W4 Nr. 1 · KA-Bezug KB 1, Aufg. 5.3 (Hinweise im Fall erkennen = Begründungsteil) · ' + t.aa1.hinweis)
  );
  const w3 = Math.floor(B.breite / 3);
  const lsgZelle = (liste) => ({ lsg: liste.map(([text, wort]) => `${text} (Z. ${fall.zeile(wort)})`).join('; ') });
  push(B.tabelle(t.aa1.spalten.map((s, i) => ({ text: s, w: i < 2 ? w3 : B.breite - 2 * w3 })), [t.aa1.loesung.map(lsgZelle)], { hoehe: 900, schrift: 19 }));
  push(
    leer(80),
    B.kasten([...t.info.absaetze.map((a) => new Paragraph({ spacing: { after: 50, line: 250 }, children: B.runs(a, { size: 20 }) }))], { kopf: t.info.kopf }),
    klein(B, t.info.woerter),
    aa(B, [IC.lesen, IC.schreiben], 'AA2: Erklären – Höhe und Ausfälle:', t.aa2.text),
    B.meta('9 min (mit Infotext und Merksatz) · Partnerarbeit (lesen) → Einzelarbeit → Plenum · AFB I–II · IKL W4 Nr. 2 · Brücke zu Woche 2 (neurogener Schock) und KA KB 1, Aufg. 5.5')
  );
  push(...t.aa2.faelle.map(([b, text]) => new Paragraph({ spacing: { after: 20, line: 240 }, indent: { left: 260, hanging: 260 }, children: [B.b(b + '  ', { size: 19 }), ...B.runs(text, { size: 19 })] })), leer(40));
  const wBild = 1700, wTab = B.breite - wBild;
  const sp = [{ text: 'Höhe der Verletzung', w: 1500 }, { text: 'Was fällt aus?', w: 3100 }, { text: 'Fachwort', w: 0 }, { text: 'Fall', w: 600 }];
  sp[2].w = wTab - 1500 - 3100 - 600 - 80;
  const FARBE_HOEHE = ['F8D7D3', 'FCE4C8', 'DDEBF7'];   // wie im Bild: rot = HWS sehr hoch, orange = HWS, blau = BWS/LWS
  const hoehenTab = B.tabelle(sp, t.aa2.hoehen.map((h, i) => [{ text: `**${h[0]}**`, fill: FARBE_HOEHE[i] }, h[1], h[2], { lsg: h[3] }]), { hoehe: 420, schrift: 18 });
  push(B.zweiSpaltig(
    [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [bild(BILD('w4_wirbelsaeule.png'), 2.1, 3.1)] })],
    [hoehenTab,
      new Paragraph({ spacing: { before: 60, after: 0 }, children: [...B.runs(t.aa2.pfeiffer, { size: 18 }), B.t(' '), B.lsg ? B.loes(t.aa2.pfeifferLoesung, { bold: true, size: 18 }) : B.t('_'.repeat(14), { size: 18 })] })],
    wBild
  ));
  push(leer(60), B.merksatz('Merksatz', t.merksatz));
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
    aa(B, [IC.schreiben], 'AA4: Wissen anwenden – Aufgaben mit Punkten:', 'Allein, 6 Minuten.'),
    B.meta('10 min (6 min schreiben, 4 min Musterlösung und Partnercheck mit Punkten) · EA → PA · AFB II–III · 4.1 fast wortgleich mit KA KB 1, Aufg. 5.3 (anderer Fall); 4.2 Fehlvorstellung „bewegt die Beine = keine Verletzung“ · Examensvorbild: Mai 2024 Tag 3, Aufg. 8.2 (EH: „… sich nicht unnötig bewegt“); Mai 2024 Tag 2, Aufg. 3.2 (LWS-Fraktur: „keine Drehbewegungen“)'),
    new Paragraph({ spacing: { after: 60 }, keepNext: true, children: [B.i(t.rahmen, { size: 19 })] })
  );
  push(...aufgabenListe(B, t.aufgaben));
  push(leer(80), qrKasten(B, 'rueckenmark', [kl(B, t.fertig)]));
  return k;
}

function blatt2(B) {
  const k = []; const push = (...x) => k.push(...x.filter(Boolean));
  const t = T.B2, V = W4.verlauf, AMP = W4.ampel;
  const fall = fallKasten(B, 'Ausgangssituation', t.fall);
  push(
    blattKopf(B, t.kopf, { pageBreakBefore: true }),
    lernziel(B, t.lernziel),
    fall.tabelle,
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 0 }, children: [B.b(t.vielleicht, { size: 21 })] }),
    aa(B, [IC.handy, IC.stift], 'AA1: Entscheiden – Frühdienst mit Ampel:', t.aa1.text),
    B.meta('15 min · analog: Messkarten (Anhang A oder lehrer.html „Messkarten groß“) – sitzen 🟢 / Hand heben 🟡 / aufstehen 🔴; Handy: verlauf.html, dann Besprechung im Plenum · EA + Bewegung → Plenum · AFB II–III · Methodenwechsel (Bewegung bzw. Handy) · IKL W4 Nr. 3')
  );
  const w3 = Math.floor(B.breite / 3);
  const ampelZelle = (s, w) => zelleFarbig(B, [
    new Paragraph({ spacing: { after: 20 }, children: [B.emoji(AMP[s].zeichen + ' ', { size: 22 }), B.b(AMP[s].lang.split(' – ')[0], { size: 19 }), B.i('  (' + AMP[s].analog + ')', { size: 17, color: F.GRAU_T })] }),
    new Paragraph({ spacing: { after: 0, line: 240 }, children: B.runs(AMP[s].lang.split(' – ')[1] || '', { size: 18 }) })
  ], w, AMP_FARBE[s]);
  push(new Table({ width: { size: B.breite, type: WidthType.DXA }, columnWidths: [w3, w3, B.breite - 2 * w3], layout: TableLayoutType.FIXED,
    rows: [new TableRow({ cantSplit: true, children: [ampelZelle('gruen', w3), ampelZelle('gelb', w3), ampelZelle('rot', B.breite - 2 * w3)] })] }));
  push(new Paragraph({ spacing: { before: 60, after: 60 }, children: B.runs(t.aa1.regel, { size: 19 }) }));
  // Kurve links, Entscheidungstabelle rechts
  const wK = 5150, wT = B.breite - wK;
  const sp = [{ text: 'Nr.', w: 560 }, { text: 'Wer?', w: 1110 }, { text: 'Schock­index', w: 950 }, { text: 'Ampel', w: 0 }, { text: '✓', w: 380 }];
  sp[3].w = wT - 80 - sp.reduce((s, x) => s + x.w, 0);
  const wer = (id) => ({ finn: 'Finn', jana: 'Jana', kurz: 'Herr Kurz' }[id]);
  const si = (kk) => (kk.puls / kk.rr[0]).toFixed(1).replace('.', ',');
  const entscheidung = B.tabelle(sp, V.karten.map((kk) => [`**${kk.nr}**`, { lsg: wer(kk.wer) }, { lsg: si(kk) }, { lsg: AMP_NAME[kk.richtig] + (kk.richtig === 'gelb' ? ' (nachmessen)' : kk.richtig === 'rot' ? ' (Notfall)' : '') }, '']), { hoehe: 470, schrift: 18 });
  push(B.zweiSpaltig(
    [new Paragraph({ spacing: { after: 0 }, children: [B.b('Finns Kurve', { size: 18 })] }), new Paragraph({ spacing: { after: 0 }, children: [bild(BILD(B.lsg ? 'w4_kurve_lsg.png' : 'w4_kurve_leer.png'), 8.3, 5.63)] })],
    [entscheidung, new Paragraph({ spacing: { before: 60, after: 0 }, children: B.runs('Meine Punkte: ____ / 6   ·   Fehlalarme: ____', { size: 18, bold: true }) })],
    wK
  ));
  if (B.lsg) push(B.lp('Auflösung: Karte 1 🟢 (zu früh, wer aufsteht) · 2 🟢 (Falle: niedriger, aber stabiler Blutdruck – Schockindex 0,7) · 3 🟡 (nach Belastung nachmessen; 🔴 = Fehlalarm) · 4 🟢 · 5 🟡 (Puls +12, Abstand kleiner – nachmessen, Pflegefachkraft informieren; 🔴 = zu früh) · 6 🔴 (Trend, Blässe, Durst, Schulterschmerz links – Schockindex erst 0,9!). Gewonnen: Karte 6 = 🔴 und höchstens 1 Fehlalarm.', { spacing: { before: 40, after: 40 } }));
  push(leer(60), qrKasten(B, 'verlauf', [kl(B, t.aa1.handy)]));
  push(leer(80), B.merksatz('Merksatz', t.merksatz), klein(B, t.woerter));
  push(
    aa(B, [IC.schreiben], 'AA2: Wissen anwenden – Aufgaben mit Punkten:', 'Allein (10 Minuten). Hilfe: Merksatz und Ihre Kurve.'),
    B.meta('13 min (10 min schreiben, 3 min Musterlösung) · EA → Plenum · AFB I–III · 2.1 Befunde mit Vorwerten (Muster KA KB 1, Aufg. 5.4 und W1 4.1) · 2.3 Beurteilen (AFB III) · 2.4 = KA KB 1, Aufg. 5.5 · Examensvorbild: Mai 2026 Tag 1, Aufg. 1.3–1.5 (Nachblutung, „hämorrhagischer Schock“, Vitalzeichen); Jan 2026 Tag 2, Aufg. 1.4 („Blutdruckabfall oder Pulserhöhung rechtzeitig erkannt“)'),
    new Paragraph({ spacing: { after: 60 }, keepNext: true, children: [B.i(t.rahmen, { size: 19 })] })
  );
  push(...aufgabenListe(B, t.aufgaben));
  push(leer(80), qrKasten(B, 'trend', [kl(B, t.fertig)]));
  return k;
}

function blatt3(B) {
  const k = []; const push = (...x) => k.push(...x.filter(Boolean));
  const t = T.B3;
  push(
    blattKopf(B, t.kopf, { pageBreakBefore: true }),
    lernziel(B, t.lernziel),
    B.kasten([
      new Paragraph({ spacing: { after: 0, line: 250 }, children: [...B.runs(t.leitfall[0], { size: 20 }), ...B.runs(t.leitfall[1], { size: 20, italics: true })] })
      , new Paragraph({ spacing: { before: 40, after: 0 }, children: [B.emoji('💬 '), B.b('Leitfrage: ', { size: 20 }), B.i(t.leitfrage, { size: 20 })] }),
      new Paragraph({ spacing: { before: 30, after: 0 }, children: [B.b('Antwort am Ende der Stunde:', { size: 18 })] }),
      ...(B.lsg ? [new Paragraph({ spacing: { after: 0, line: 245 }, children: B.runs(t.leitfrageLoesung, { size: 19, highlight: 'yellow' }) })]
        : [linien(B, 2, [], B.breite - 240)])
    ], { kopf: 'Fallbezug: „Reanimation – und nicht nur ich war hilflos“ (Auszug)', fill: 'FFFFFF', kopfFill: 'FFFFFF', rand: '000000' }),
    aa(B, [IC.lesen, IC.schreiben], 'AA1: Beschreiben – Der Weg der Luft:', t.aa1.text),
    B.meta('9 min · Selbstversuch (30 s) → EA/PA → Plenum · AFB I–II · IKL Fremdkörperaspiration Nr. 1 (Atemwegsanatomie, Ventilation, Folgen der Hypoxie)'),
    B.lp(t.aa1.selbstversuch),
    B.kasten(t.aa1.info.map((a) => new Paragraph({ spacing: { after: 40, line: 250 }, children: B.runs(a, { size: 20 }) })), { kopf: 'Informationstext: Atemwege und Ventilation' })
  );
  const wBild = 3500, wRechts = B.breite - wBild;
  const zeile = (n) => new Paragraph({ spacing: { before: 20, after: 20 }, children: [B.b(n + '  ', { size: 20 }), B.lsg ? B.loes(t.aa1.begriffe[n - 1], { size: 20 }) : B.t('_'.repeat(30), { size: 20 })] });
  push(B.zweiSpaltig(
    [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [bild(BILD('w4_atemwege.png'), 3.9, 3.9)] })],
    [kl(B, t.aa1.wortspeicher, { italics: true }), ...[1, 2, 3, 4, 5, 6].map(zeile)],
    wBild
  ));
  push(leer(60), B.merksatz('Merksatz', t.merksatz1));
  // AA2 Simulation
  push(
    aa(B, [IC.handy, IC.stift], 'AA2: Unterscheiden – Notfall-Ampel im Speisesaal (zu zweit):', t.aa2.text),
    B.meta('12 min (6 min Simulation, 4 min Tabelle, 2 min Auswertung) · PA (ein Handy pro Paar) bzw. Plenumsspiel mit Handzeichen (Anhang B) → EA · AFB II · Methodenwechsel (Simulation) · IKL Fremdkörperaspiration Nr. 2 · KA KB 1, Aufg. 4.1'),
    qrKasten(B, 'speisesaal', [kl(B, t.aa2.handy)]),
    leer(60)
  );
  const w1 = 1800, w2 = Math.floor((B.breite - w1) / 2);
  push(B.tabelle([{ text: '', w: w1 }, { text: 'leichte Verlegung', w: w2 }, { text: 'schwere Verlegung', w: B.breite - w1 - w2 }],
    t.aa2.zeilen.map((z) => [{ text: `**${z[0]}**`, fill: F.LACHS }, { lsg: z[1] }, { lsg: z[2] }]), { hoehe: 600, schrift: 18 }));
  push(leer(60), B.merksatz('Merksatz', t.merksatz2));
  // AA3 im KA-Format
  const fall = fallKasten(B, 'Fallsituation', t.fall);
  const ersetze = (s) => s.replace(/\{([^}]+)\}/g, (_, w) => String(fall.zeile(w)));
  push(
    aa(B, [IC.schreiben], 'AA3: Wissen anwenden – Aufgaben mit Punkten:', 'Allein (9 Minuten). Hilfe: Merksätze und Tabelle.'),
    B.meta('12 min (9 min schreiben, 3 min Musterlösung) · EA → Plenum · AFB II–III · 3.1 = Muster KA KB 1, Aufg. 4.1 (gleicher Operator, beide Phasen im Fall) · Examensvorbild: Mai 2023 Tag 3, Aufg. 4.2 („Nennen Sie vier in der Fallsituation beschriebene Symptome, die auf eine akute Atemstörung hinweisen“, 0,5 P. je Symptom)'),
    fall.tabelle,
    new Paragraph({ spacing: { before: 60, after: 60 }, keepNext: true, children: [B.i(t.rahmen, { size: 19 })] })
  );
  push(...aufgabenListe(B, t.aufgaben, ersetze));
  push(
    leer(80), qrKasten(B, 'atemweg', [kl(B, t.fertig)])
  );
  return k;
}

/* =====================================================================
   LEHRERVERSION: Verlaufsplan, Hinweise, Anhänge
   ===================================================================== */
function verlaufsplan(B) {
  const k = []; const push = (...x) => k.push(...x.filter(Boolean));
  push(
    B.titel('Was man nicht sieht: Wirbelsäulenverletzung, innere Blutung, Atemwege'),
    new Paragraph({ spacing: { after: 80 }, children: [B.emoji('🎯 '), B.b('Lernziel (Planung): '), ...B.runs('Die Lernenden erkennen Hinweise auf eine Wirbelsäulenverletzung und begründen die Bewegungsminimierung. Sie überwachen Vitalzeichen im Verlauf und erkennen eine verzögerte innere Blutung. Sie unterscheiden eine leichte von einer schweren Atemwegsverlegung.')] }),
    B.p('**Rahmen:** KB I · Woche 4 (SW 9) · 3 UStd. (135 min): 2 UStd. Wirbelsäulenverletzung und innere Blutung, 1 UStd. Fremdkörperaspiration Teil 1 · Leitfall „Frau Maler“ (verschluckt sich am Kaffee) · Fall „17-Jähriger nach Fahrradsturz“ (Finn) · Vorwissen: Woche 1 (Kompensation, Schockindex), Woche 2 (Schockformen, neurogener Schock, Lagerung „nicht bewegen“), Woche 3 laut Planung (sichtbare Blutung, Abgrenzung Erste Hilfe – pflegerische Sofortmaßnahme – ärztliche Maßnahme) · Ich-kann-Liste KB I: Woche 4 Nr. 1–3, Fremdkörperaspiration Nr. 1–2 · KA-Bezug: KB 1, Aufg. 5.3 und 4.1 (dazu 5.5, 5.4 als Wiederholung) · AB: 3 Blätter je 2 Seiten (6 Seiten), nacheinander austeilen'),
    B.p('**Kompetenzbezug:** Anlage 1 PflAPrV I.4.a, I.4.c (wie Woche 2) · Landeslehrplan CE 06 „In Akutsituationen sicher handeln“ · Methodenwechsel: szenischer Einstieg, Einzelarbeit, Partnerarbeit, Gruppenübung auf dem Boden oder auf Isomatten, Bewegungsspiel (Ampel), Handy-Simulation, Peer-Korrektur'),
    B.p('**Methodenwechsel** („erst erleben, dann begründen und aufschreiben“): ① Praxisübung „Kopf halten und achsengerecht drehen“ → AA4 (Muster KA 5.3) · ② Live-Verlauf „Frühdienst – drei Patienten, eine Ampel“ (analog mit Aufstehen oder am Handy – freie Wahl) → AA2 · ③ Handy-Simulation „Notfall-Ampel im Speisesaal“ (ohne Handy: Plenumsspiel) → AA3 (Muster KA 4.1).')
  );
  const sp = [
    { text: 'Zeit', w: 850 }, { text: 'Phase', w: 1650 }, { text: 'Lehrerhandeln', w: 3600 }, { text: 'Schülerhandeln', w: 2700 },
    { text: 'Sozialform', w: 1250 }, { text: 'Material', w: 1400 }, { text: 'Didaktische Funktion', w: 0 }
  ];
  sp[6].w = BREITE_QUER - sp.slice(0, 6).reduce((s, x) => s + x.w, 0);
  const z = (zeit, phase, l, s, soz, mat, fkt) => [zeit, `**${phase}**`, l, s, soz, mat, fkt];
  const ueber = (text) => [{ colSpan: 7, text, fill: F.GRAU_HELL, o: { italics: true } }];
  const zeilen = [
    z('vor der Stunde', 'Vorbereitung', 'Blatt 1–3 **einzeln** (je beidseitig) kopieren, getrennt bereitlegen. **Platz auf dem Boden** (Tische an die Seite), wenn vorhanden **6 Isomatten** – sonst Jacken oder Decken unterlegen. **Live-Verlauf:** Fassung wählen – analog (Messkarten aus Anhang A ausdrucken oder w4/lehrer.html → „Messkarten groß“ auf Tablet/Beamer) oder Handy. Optional: w4/lehrer.html → „Neuen Raum starten“.', '–', '–', 'Blatt 1–3, ggf. Isomatten, Messkarten', 'Ablauf ohne Umbaupausen; die Stunde funktioniert vollständig auf Papier'),
    z('0–4', 'Szenischer Einstieg', 'Sie liegen auf dem Boden: „Ich bin Herr Pfeiffer, 79. Ich bin die Treppe runtergefallen. Helfen Sie mir hoch, ich muss zum Mittagessen!“ Wer kommt? Reaktionen sammeln, **nicht auflösen**. Dann **Blatt 1 austeilen**, Lernziel und Fahrplan: drei Notfälle, die man nicht sieht.', 'reagieren spontan (helfen hoch? halten fest?), äußern Vermutungen', 'Plenum', 'Blatt 1', 'Betroffenheit, kognitiver Konflikt („helfen = hochhelfen?“); Vorwissen aus Woche 2 (Lagerung „nicht bewegen“) aktivieren. AFB I'),
    ueber('„Herr Pfeiffer will aufstehen. Darf er das? Woran erkennen Sie, dass es gefährlich sein könnte?“'),
    z('4–12', 'Erarbeitung I: Hinweise finden (AA1)', 'Fall vorlesen lassen; Uhr 4 min; Tabelle im Plenum sichern (Zeilennummern nennen lassen); Ablenker ansprechen: Diabetes, Brille, Schürfwunde; „Er kann die Beine bewegen“ schließt nichts aus.', 'lesen, unterstreichen, Hinweise mit Zeilennummer eintragen', 'EA → Plenum', 'Blatt 1 S. 1', 'Befunde im Fließtext identifizieren – Begründungsteil von KA 5.3. AFB I'),
    z('12–21', 'Erarbeitung II: Rückenmark und Höhe (AA2, Merksatz)', 'Infotext zu zweit lesen lassen (4 min); Zuordnung A/B/C und Herrn Pfeiffers Höhe sichern; neurogenen Schock kurz an Woche 2 anbinden; Merksatz vorlesen lassen.', 'lesen, Fachwörter mit Wörterhilfe klären, zuordnen', 'PA → EA → Plenum', 'Blatt 1 S. 1–2', 'Läsionshöhe → Ausfälle (IKL W4 Nr. 2); Brücke zu KA 5.5. AFB I–II'),
    z('21–35', 'Übung: Kopf halten und achsengerecht drehen (AA3)', 'Vierergruppen abzählen, Platz auf dem Boden schaffen (Isomatten, falls vorhanden). Mit zwei SuS einmal vormachen (3 min): Kopf seitlich mit beiden Händen halten, Kommando „auf drei“, drehen wie ein Baumstamm. **4 Runden à ca. 2 min**, Rollen wechseln (Uhr). Herumgehen, korrigieren (Nacken nicht beugen!). Abschluss: „Was war schwierig?“', 'üben in Rollen (Patient/in, Kopf, Helfer/in, Beobachter/in); Checkliste ausfüllen, Rückmeldung geben', 'GA (4)', 'Boden bzw. Isomatten, Blatt 1 S. 2', 'erleben, dann begründen: Kommando, Achse, Sicherheit beim unvermeidbaren Lagewechsel; Grundlage für 4.1 (Maßnahme beschreiben). AFB II'),
    ueber('„Sie haben gespürt, wie schwer es ist, den Kopf ruhig zu halten. Schreiben Sie jetzt auf, warum das so wichtig ist – mit Punkten.“'),
    z('35–45', 'Sicherung: Aufgaben mit Punkten (AA4)', 'Uhr 6 min; dann Musterlösung (Lösungsteil Blatt 1) vorlesen oder zeigen; Partnercheck mit Punkten.', '4.1 und 4.2 allein schreiben; Lösung der Partnerin/des Partners mit Punkten bewerten', 'EA → PA', 'Blatt 1 S. 2', 'Transfer im KA-Format: 4.1 fast wortgleich mit KA 5.3 (anderer Fall); 4.2 Fehlvorstellung „bewegt Beine = keine Verletzung“. AFB II–III'),
    z('45–48', 'Überleitung (Blatt 2)', '**Blatt 2 austeilen.** „Letzte Woche: Blutungen, die man sieht. Heute: eine Blutung, die man nicht sieht.“ Ausgangssituation vorlesen; drei Patienten benennen.', 'lesen, zuhören', 'Plenum', 'Blatt 2', 'Anknüpfung an Woche 3 (laut Planung), Neugier'),
    z('48–63', 'Live-Verlauf „Frühdienst – drei Patienten, eine Ampel“ (AA1)', '**Analog:** Messkarte 1–6 nacheinander zeigen (je ca. 2 min): lesen lassen, alle tragen Schockindex und Ampel **zuerst in die Tabelle** ein, dann „3-2-1“: **sitzen bleiben 🟢 · Hand heben 🟡 · aufstehen 🔴** – alle gleichzeitig. 1–2 begründen lassen, Lösung nennen (Tabelle in den Hinweisen), wer steht, setzt sich wieder. Nach Karte 6: Auflösungskarte 08:00 („Was wäre, wenn …“). **Handy:** QR-Code, allein oder zu zweit (ca. 8 min), danach dieselben Karten kurz im Plenum (Lösung, „Wer hat gewonnen?“).', 'Werte mit Vorwert vergleichen, Schockindex rechnen, Finns Kurve zeichnen, Ampel festlegen, begründen, Punkte und Fehlalarme zählen', 'EA + Bewegung → Plenum (Handy: EA/PA)', 'Blatt 2 S. 1, Messkarten oder Handy', 'Trendüberwachung; Fehlalarm **und** „zu spät“ sind Fehler (Gewinnbedingung); Fehlvorstellungen „unter 100 mmHg = Schock“ und „erst ab Schockindex 1 melden“ werden sichtbar. AFB II–III'),
    z('63–68', 'Sicherung: Kurve und Merksatz', 'Finns Kurve: Puls und systolischer Wert laufen wie eine **Schere** aufeinander zu; Abstand der Blutdruckwerte wird kleiner. Merksatz vorlesen lassen.', 'Kurve deuten, Merksatz lesen', 'Plenum', 'Blatt 2 S. 1–2', 'Zeichen der inneren Blutung, warum verzögert (IKL W4 Nr. 3)'),
    z('68–81', 'Aufgaben mit Punkten (AA2)', 'Uhr 10 min; Musterlösung (3 min), bei 2.3 Diskussion zulassen (Einzelwert vs. Gesamtbild).', '2.1–2.4 allein schreiben, mit Musterlösung verbessern', 'EA → Plenum', 'Blatt 2 S. 2', 'Befunde mit Vorwerten (KA 5.4), Beurteilen (AFB III), KA 5.5'),
    ueber('Pause, falls im Stundenraster vorgesehen. – „Frau Maler hat sich beim Frühstück am Kaffee verschluckt. Christin hat sie einfach husten lassen. War das richtig?“'),
    z('81–84', 'Blatt 3: Leitfall', '**Blatt 3 austeilen.** Leitfall vorlesen; Leitfrage: Daumen hoch (richtig) / runter (falsch) – Vermutung, nicht auflösen.', 'vermuten, begründen', 'Plenum', 'Blatt 3', 'Anknüpfung Leitfall; kognitiver Konflikt'),
    z('84–93', 'Erarbeitung: Weg der Luft (AA1)', 'Selbstversuch anleiten (30 s: Finger auf den Kehlkopf, schlucken; schlucken und einatmen gleichzeitig?). Infotext lesen lassen, Beschriftung und c) sichern, Merksatz.', 'Selbstversuch, lesen, beschriften, Merksatz mitlesen', 'EA/PA → Plenum', 'Blatt 3 S. 1', 'Atemwegsanatomie, Ventilation, Folgen der Hypoxie (IKL Fremdkörperaspiration Nr. 1). AFB I–II'),
    z('93–105', 'Notfall-Ampel im Speisesaal (AA2)', '**Handy:** Paare scannen den QR-Code (ein Handy pro Paar), ca. 6 min; wer früh fertig ist: neue Reihenfolge. **Ohne Handy:** Szenen aus Anhang B vorlesen, Paare zeigen 1–4 Finger, 10 s herunterzählen, Folgen vorlesen, Fehlalarme/„bewusstlos“ an der Tafel zählen. Dann Tabelle (4 min), Auswertung: „Wo waren die Fallen?“ (Frau Brückner, Herr Vogt), Merksatz.', 'unter Zeitdruck entscheiden, Tabelle leicht/schwer ausfüllen', 'PA (Handy) bzw. Plenum → EA', 'Handy oder Anhang B, Blatt 3 S. 2', 'erleben, dann aufschreiben; Fehlvorstellungen „erst bei blauen Lippen handeln“ und „wer schreit, erstickt“. AFB II'),
    z('105–117', 'Aufgaben mit Punkten (AA3)', 'Uhr 9 min, dann Musterlösung (3 min).', '3.1–3.3 allein schreiben, mit Musterlösung verbessern', 'EA → Plenum', 'Blatt 3 S. 2', '3.1 = Muster KA 4.1; 3.3 Beurteilen (AFB III)'),
    z('117–122', 'Abschluss', 'Leitfrage beantworten lassen (2 Zeilen). Bogen zum Einstieg: „Was tun Sie jetzt, wenn Herr Pfeiffer sagt: Helfen Sie mir hoch?“ Blitzlicht: Drei Notfälle, die man nicht sieht – woran erkennen Sie sie?', 'Leitfrage schriftlich beantworten, Blitzlicht', 'EA → Plenum', 'Blatt 3', 'Leitfall abschließen, Lernzuwachs sichtbar machen'),
    z('122–135', 'Puffer (ca. 13 min)', 'Reserve für langsames Lesen und Schreiben, Übung und Musterlösungen. Schnelle SuS: QR-Kästen „Schon fertig?“ (Rückenmark-Check, Trend-Detektiv, Atemweg-Check).', '–', '–', '–', 'Zeitreserve, kein neuer Inhalt')
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
  push(p('**Kopien:** Blatt 1 (S. 1–2), Blatt 2 (S. 3–4), Blatt 3 (S. 5–6) je beidseitig, getrennt austeilen. **Isomatten:** 6 Stück, falls vorhanden – sonst auf dem sauberen Boden üben, Jacken oder Decken unter Kopf und Rücken. **Praxisübung:** 3BFP2.1 (23 SuS) = 5 Vierergruppen + 1 Dreiergruppe (dort beobachten Sie selbst oder die Rolle Beobachter/in entfällt); 3BFP2.2 (20 SuS) = 5 Vierergruppen. **Handys:** freiwillig, ein Handy pro Paar reicht; die Stunde funktioniert vollständig auf Papier.'));
  push(B.zwischen('Ganz ohne Handy: Ist die Vorbereitung auf die Klassenarbeit trotzdem vollständig?'));
  push(p('**Ja.** Alle Inhalte und Aufgaben, die die KA verlangt, stehen auf Papier (Infotexte, fertige Merksätze, Aufgaben im KA-Format mit Musterlösung). Die Handy-Übungen sind nur ein zweiter Weg (Methodenwechsel 2 und 3) oder Zusatz für Schnelle („Schon fertig?“). Ohne Handy: Blatt 1 bleibt gleich, „Schon fertig?“ entfällt · Blatt 2: analoge Fassung mit Messkarten (Anhang A) · Blatt 3: Plenumsspiel (Anhang B).'));
  const spKA = [{ text: 'KA KB 1', w: 2300 }, { text: 'Erwartung laut Erwartungshorizont', w: 4200 }, { text: 'Vermittelt auf Papier', w: 4000 }, { text: 'Schriftlich geübt (KA-Format)', w: 0 }];
  spKA[3].w = B.breite - spKA.slice(0, 3).reduce((x, y) => x + y.w, 0);
  push(B.tabelle(spKA, [
    ['**5.3** (2 P.) Begründen, warum nicht bewegen + eine Maßnahme', 'Hinweise (Sturz aus der Höhe, Nackenschmerz, Kribbeln) → HWS/Rückenmark; Bewegung kann das Rückenmark weiter schädigen → Querschnittlähmung, bei hoher Läsion Atemstörung · Kopf mit beiden Händen in der vorgefundenen Lage halten, bitten, sich nicht zu bewegen, nicht aufsetzen; Lagewechsel nur wenn unvermeidbar, dann achsengerecht mit mehreren', 'Blatt 1: AA1 (Hinweise im Fall), Infotext (instabil, Querschnittlähmung), Höhen-Tabelle (HWS sehr hoch → Atmung), **Merksatz** (alle Elemente), AA3 Übung auf dem Boden oder auf Isomatten (ohne Handy)', 'Blatt 1, **4.1** (fast wortgleich, anderer Fall), 4.2 (Fehlvorstellung „bewegt die Beine“)'],
    ['**4.1** (2 P.) leichte und schwere Atemwegsverlegung anhand der Situation unterscheiden', 'leicht: kräftig und wirksam husten, sprechen und atmen (Beginn) · schwer: Husten schwach und unwirksam, kann nicht sprechen, kaum atmen, Griff an den Hals, Zyanose (jetzt) – je Form mit Fallbezug', 'Blatt 3: Leitfall Frau Maler, AA2 Tabelle leicht/schwer, **Merksatz** (alle Merkmale); Simulation am Handy **oder** Plenumsspiel (Anhang B)', 'Blatt 3, **3.1** (gleicher Operator, Fall mit beiden Phasen wie in der KA), 3.3, Leitfrage'],
    ['**5.5** (1 P.) Befund beim neurogenen Schock', 'Bradykardie bzw. fehlende Tachykardie; warme, trockene Haut unterhalb der Verletzung', 'Blatt 1: Infotext (neurogener Schock); Woche 2 (Vergleichstabelle)', 'Blatt 2, **2.4**'],
    ['**5.4** (3 P., Wiederholung aus Woche 1) Kompensation, fast normaler Blutdruck', 'Barorezeptoren, Sympathikus, Zentralisation, RAAS/ADH; Blutdruck fällt spät; Schockindex', 'Blatt 2: Live-Verlauf (analog), Kurve, **Merksatz** (Puls steigt, Abstand kleiner, gleichen lange aus, Blutdruck fällt spät)', 'Blatt 2, **2.1** (Befunde mit Vorwerten), **2.2**, 2.3']
  ], { schrift: 17 }));
  push(p('Nicht in Woche 4 (laut Planung Woche 5): **KA 4.2** (Vorgehen nach ERC/GRC 2025: Rückenschläge, Oberbauchkompressionen, Bewusstlosigkeit, ärztliche Kontrolle) und **4.3** (Aspirationsprophylaxe). Diese 6 Punkte müssen in Woche 5 sicher vorkommen – bitte mit K. Lohner abstimmen.'));
  push(B.zwischen('Methodenwechsel 1: Praxisübung'));
  push(p('Sicherheit: langsam, ohne Kraft, nicht ruckartig. Wer Nacken- oder Rückenbeschwerden hat, liegt nicht. Die liegende Person bleibt locker. Der Kopf wird seitlich mit beiden Händen gehalten (nicht am Hals ziehen, nicht anheben). Es gibt keine Rolle „HWS-Orthese anlegen“ – das ist nach den Erste-Hilfe-Leitlinien nicht Aufgabe von Ersthelfenden und wird in der KA nicht erwartet.'));
  push(B.zwischen('Methodenwechsel 2: Live-Verlauf – analog oder am Handy (freie Wahl)'));
  push(p('**Analog:** Messkarten (Anhang A) nacheinander zeigen – an die Tafel heften, vorlesen oder groß über w4/lehrer.html → „Messkarten groß“ (Taste L = Lösung). Alle schreiben die Ampel **zuerst** in die Tabelle (Festlegen verhindert Abschauen), dann zeigen alle gleichzeitig: **sitzen bleiben 🟢 · Hand heben 🟡 · aufstehen 🔴**. **Handy:** w4/verlauf.html (QR-Code auf Blatt 2): 40 Sekunden je Karte, Zeit abgelaufen = 🟢; sofortige Rückmeldung, am Ende Gewonnen/Nicht gewonnen und Finns Kurve. Danach die Karten kurz im Plenum besprechen.'));
  push(p('**Wertung (beide Fassungen gleich):** genau richtig = 1 Punkt. 🔴 ohne Notfall = **Fehlalarm**. Eine Stufe zu vorsichtig (🟡 statt 🟢) = kein Punkt, aber kein Fehlalarm. **Gewonnen:** Karte 6 = 🔴 **und** höchstens 1 Fehlalarm. Wer bei jeder Karte aufsteht, hat 4 Fehlalarme; wer nie aufsteht, übersieht Finn – beide verlieren.'));
  const spK = [{ text: 'Karte', w: 700 }, { text: 'Person, Werte', w: 4000 }, { text: 'SI', w: 650 }, { text: 'richtig', w: 1300 }, { text: 'Begründung und typischer Fehler', w: 0 }];
  spK[4].w = B.breite - spK.slice(0, 4).reduce((s, x) => s + x.w, 0);
  const pers = (id) => V.patienten.find((x) => x.id === id).name;
  push(B.tabelle(spK, V.karten.map((kk) => [`**${kk.nr}** · ${kk.zeit}`, `${pers(kk.wer)}: Puls ${kk.puls}, RR ${kk.rr[0]}/${kk.rr[1]}, AF ${kk.af}${kk.vorwert ? ' (Vorwert ' + kk.vorwert + ')' : ''}. ${kk.beobachtung} ${kk.aussage}`, (kk.puls / kk.rr[0]).toFixed(2).replace('.', ','), { lsg: AMP[kk.richtig].kurz }, kk.begruendung]).concat([[`**08:00**`, `Auflösung: Puls ${V.aufloesung.puls}, RR ${V.aufloesung.rr[0]}/${V.aufloesung.rr[1]}, AF ${V.aufloesung.af}. ${V.aufloesung.beobachtung} ${V.aufloesung.aussage}`, (V.aufloesung.puls / V.aufloesung.rr[0]).toFixed(2).replace('.', ','), '–', V.aufloesung.text]]), { schrift: 17 }));
  push(p('Hinweis: Die Ampel ist ein didaktisches Hilfsmittel, kein validierter Frühwarnscore (z. B. NEWS2). In der Praxis gilt: im Zweifel melden. Deshalb zählt 🟡 (Pflegefachkraft informieren) nie als Fehlalarm. Bei Jana würde NEWS2 den systolischen Wert 91–100 mmHg mit 2 Punkten werten – wer hier 🟡 wählt, liegt „zu vorsichtig“, nicht falsch; das ist ein guter Anlass zur Diskussion „Einzelwert oder Gesamtbild?“.'));
  push(B.zwischen('Methodenwechsel 3: Notfall-Ampel im Speisesaal'));
  push(p('w4/speisesaal.html (QR-Code auf Blatt 3): 6 Szenen, die ersten drei fest (Frau Maler wie im Leitfall, Herr Roth leicht, Herr Roth schwer), die letzten drei gemischt (Frau Brückner: leicht, ruft „Ich ersticke!“ – Falle für Fehlalarm; Herr Vogt: stille, schwere Verlegung mit noch rosigen Lippen – Falle „abwarten“; Frau Lenz: schwacher Husten, Pfeifen – Falle „sie hustet doch“). **Schwere Verlegung:** Nach 6 s Lesezeit sinkt die SpO₂ um 1,5 % pro Sekunde, jede falsche Wahl kostet 10 %; unter 60 % wird die Person bewusstlos (Szene verloren). **Leichte Verlegung:** kein Abfall; Notruf = Fehlalarm. 2 Punkte beim ersten, 1 Punkt beim zweiten Versuch. **Bestanden:** niemand bewusstlos und höchstens 1 Fehlalarm. Ohne Handy: Anhang B (Plenumsspiel).'));
  push(p('Leitlinien: Nach ERC/GRC 2025 bei leichter Verlegung zum Husten auffordern und beobachten. Den Ablauf bei schwerer Verlegung (Rückenschläge, Oberbauchkompressionen, Bewusstlosigkeit → Reanimation, ärztliche Kontrolle) behandelt laut Planung **Woche 5** (Phantomtraining). Deshalb heißt die richtige Wahl bei schwerer Verlegung hier nur „laut um Hilfe rufen, Notruf veranlassen, bleiben und sofort handeln“; „auf den Rücken klopfen“ erscheint nur in leichten Szenen als falsche Wahl (stört den wirksamen Husten) – nie in schweren, damit nichts den Leitlinien widerspricht.'));
  push(B.zwischen('Optionale Lehreransicht (eigener Worker, ohne Woche 2)'));
  push(p('w4/lehrer.html → „Neuen Raum starten“ zeigt einen 4-stelligen Code. Die SuS tippen ihn **freiwillig** auf dem Startbildschirm der Übung ein (aufklappbar) und wählen einen Gruppennamen (z. B. „Tisch 3“ – kein echter Name nötig). Die Ansicht zeigt je Gruppe Punkte, 🏆/✗, Fehlalarme, „Finn übersehen“ bzw. „bewusstlos“ und die **häufigsten Fehlentscheidungen** – ideal für die Auswertung. Probeansicht ohne Internet: w4/lehrer.html?demo=1. Ohne Code oder ohne Netz laufen alle Übungen vollständig allein. Einrichtung des Workers: README_W4.md. Datenschutz: Zufalls-Geräte-ID, freiwilliger Gruppenname, Punkte; nach 6 Stunden wird der Raum gelöscht; keine Cookies, keine fremden Skripte.'));
  push(B.zwischen('Fachliche Hinweise'));
  push(p('**Wirbelsäule:** Ersthelfende minimieren Bewegung und halten den Kopf manuell in der vorgefundenen Lage; keine Zervikalstütze durch Laien (ERC-Leitlinien Erste Hilfe). Lagewechsel nur, wenn unvermeidbar (Erbrechen, Atemwege, Gefahr am Ort), dann achsengerecht. Bei älteren Menschen reicht oft ein Sturz aus geringer Höhe; inkomplette Halsmarkverletzungen betreffen häufig die Arme stärker als die Beine – das passt zu Herrn Pfeiffer (Hände betroffen, Beine beweglich). Läsionshöhe vereinfacht: C3–C5 Zwerchfell, C5–Th1 Arme und Hände; Tetraplegie bei HWS, Paraplegie bei BWS/LWS; neurogener Schock vor allem bei Verletzungen oberhalb von etwa Th6.'));
  push(p('**Innere Blutung:** zweizeitige Milzruptur (Stunden bis Tage nach dem Trauma); Schmerz in der linken Schulter (Kehr-Zeichen) durch Zwerchfellreizung; junge Menschen kompensieren bis etwa 30 % Blutverlust ohne deutlichen Blutdruckabfall (vgl. EH KA 5.4); kleiner werdende Blutdruckamplitude; Schockindex normal ca. 0,5, über 1 spricht für Schock – Finn ist bei 0,9 schon ein Notfall. Polytrauma und Notaufnahme nur als Querverweis.'));
  push(p('**Atemwege:** Der rechte Hauptbronchus ist kürzer, weiter und steiler. Hypoxie: Bewusstlosigkeit und Kreislaufstillstand innerhalb weniger Minuten; Gehirnzellen können nach etwa 3–5 Minuten ohne Sauerstoff bleibend geschädigt werden. Die SpO₂ in der Simulation ist bewusst als „nur in der Simulation“ gekennzeichnet.'));
  push(B.zwischen('Bezug zur Klassenarbeit und zum Examen (nur für Lehrkräfte)'));
  push(p('**KA KB 1, Aufg. 5.3** („Begründen Sie, warum Herr Brenner möglichst nicht bewegt werden soll, und beschreiben Sie eine Maßnahme dazu.“) → Blatt 1, AA1 (Hinweise im Fall), AA3 (Maßnahme erlebt), **AA4 4.1** (fast wortgleich, anderer Fall: Herr Pfeiffer), 4.2 (Fehlvorstellung). **KA 4.1** („Unterscheiden Sie anhand der Situation eine leichte von einer schweren Atemwegsverlegung.“) → Blatt 3, AA2 (Simulation, Tabelle), **AA3 3.1** (gleicher Operator, Fall mit beiden Phasen). **KA 5.5** → Blatt 2, 2.4 und Infotext Blatt 1. **KA 5.4** (Kompensation, fast normaler Blutdruck) → Blatt 2 (Live-Verlauf, 2.1, 2.2) als Wiederholung. KA 4.2/4.3 (Vorgehen nach ERC, Prophylaxe) sind laut Planung Woche 5. Der KA-Fall (Herr Brenner, Frau Sommer) wird nicht vorweggenommen.'));
  push(p('**Examensvorbilder** (BW, Ordner „Pflegeexamen KBS“; ein direktes Original zu den drei Themen gibt es nicht – genutzt wurden Format und Operatoren): Mai 2024 Tag 3, Aufg. 8.1/8.2 (Notfall erläutern 4 P. + sechs Sofortmaßnahmen stichwortartig 6 P.; EH: „… sich nicht unnötig bewegt“) · Mai 2024 Tag 2, Aufg. 1.1 und 3.2 (Marlene Hofer, LWK-Fraktur; „keine Drehbewegungen“, Bedarf 3 P. + Begründung 3 P.) · Juli 2024 Tag 1, Aufg. 2.2 (Th10-Läsion, Kontext Querschnitt) · Mai 2026 Tag 1, Aufg. 1.3–1.5 (Nachblutung, „hämorrhagischer Schock“, Vitalzeichen) · Jan 2026 Tag 2, Aufg. 1.4/1.5 („Blutdruckabfall oder Pulserhöhung rechtzeitig erkannt“) · Mai 2023 Tag 3, Aufg. 4.2 („Nennen Sie vier in der Fallsituation beschriebene Symptome, die auf eine akute Atemstörung hinweisen“, 0,5 P. je Symptom). Fallsituationen mit Zeilennummern und Rahmensätze wie im Formmuster.'));
  push(B.zwischen('Ich-kann-Liste (wird nicht ausgeteilt)'));
  push(p('**Woche 4 Nr. 1** (Hinweise, Bewegungsminimierung, Maßnahmen) → Blatt 1 AA1, AA3, AA4 · **Nr. 2** (Läsionshöhe, neurogener Schock) → Blatt 1 Infotext, AA2 (mit Herrn Pfeiffers Höhe); Blatt 2, 2.4 · **Nr. 3** (innere Blutung, verzögert, Verlauf; Beispiel 17-Jähriger) → Blatt 2 · **Fremdkörperaspiration Nr. 1** (Hypoxie, rechter Hauptbronchus) → Blatt 3 AA1, 3.2 · **Nr. 2** (leicht/schwer, Frau Maler) → Blatt 3 AA2, 3.1, 3.3, Leitfrage. Nr. 3–5 (Vorgehen ERC, Prophylaxe, Ingestion) → Woche 5.'));
  push(B.zwischen('Nicht enthalten'));
  push(p('Vorgehen bei schwerer Atemwegsverlegung (Rückenschläge, Oberbauchkompressionen), Kinder und Säuglinge, Phantomtraining, Dysphagie-Prävention, Ingestion → Woche 5 · Reanimation, ABCDE, Notaufnahme/Polytrauma → KB III bzw. nur Querverweis · psychologische Erste Hilfe → KB II · Notruf absetzen, SBAR → Deutsch.'));
  push(B.zwischen('Quellen'));
  push(p('ERC Guidelines 2025: Basic Life Support (Fremdkörperverlegung der Atemwege) und First Aid; deutsche Fassung GRC · MSD Manual Profi-Ausgabe: Rückenmarkverletzungen; Milzverletzungen; Schock · Planungstabelle KB 1 (Lohner/Klawitter) · Ich-kann-Liste KB I · KA 2 KB 1/KB 2 mit Erwartungshorizont · Leitfall „Reanimation – und nicht nur ich war hilflos“ · BW-Abschlussprüfungen 2023–2026 · Entwurf Anforderungsniveau mit Operatoren (2021) · Formmuster schriftliche Prüfung (2022).'));
  return k;
}

// Anhang A: Messkarten zum Zeigen (2 je Seite)
function messkarten(B) {
  const k = []; const V = W4.verlauf;
  const pers = (id) => V.patienten.find((x) => x.id === id);
  const karte = (titel, name, info, puls, rr, af, vorwert, beob, aussage) => {
    const w = B.breite, w3 = Math.floor(w / 3);
    const wert = (zahl, einheit) => B.zelle([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.b(zahl, { size: 64 })] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [B.t(einheit, { size: 24, color: F.GRAU_T })] })], w3, { borders: rahmen(F.GRAU_R, 4), shading: { type: ShadingType.CLEAR, color: 'auto', fill: F.GRAU_HELL } });
    return [
      new Table({ width: { size: w, type: WidthType.DXA }, columnWidths: [w], layout: TableLayoutType.FIXED, rows: [new TableRow({ cantSplit: true, children: [B.zelle([
        new Paragraph({ spacing: { after: 40 }, children: [B.b(titel, { size: 44 })] }),
        new Paragraph({ spacing: { after: 20 }, children: [B.b(name, { size: 36 })] }),
        new Paragraph({ spacing: { after: 100 }, children: [B.t(info, { size: 24, color: F.GRAU_T })] }),
        new Table({ width: { size: 3 * w3, type: WidthType.DXA }, columnWidths: [w3, w3, w3], layout: TableLayoutType.FIXED, rows: [new TableRow({ children: [wert(String(puls), 'Puls /min'), wert(rr, 'Blutdruck mmHg'), wert(String(af), 'Atemzüge /min')] })] }),
        vorwert ? new Paragraph({ spacing: { before: 100, after: 0 }, children: [B.t('Vorwert: ' + vorwert, { size: 26 })] }) : null,
        new Paragraph({ spacing: { before: 100, after: 0 }, children: [B.t(beob, { size: 30 })] }),
        new Paragraph({ spacing: { before: 80, after: 60 }, children: [B.i(aussage, { size: 30 })] })
      ].filter(Boolean), w, { borders: rahmen('2E75B6', 18) })] })] })
    ];
  };
  k.push(B.abschnitt('Anhang A · Messkarten für den Live-Verlauf (analoge Fassung) – zum Zeigen oder an die Tafel heften', { pageBreakBefore: true }));
  V.karten.forEach((kk, i) => {
    const p = pers(kk.wer);
    if (i && i % 2 === 0) k.push(B.umbruch());
    k.push(...karte(`Messkarte ${kk.nr} · ${kk.zeit} Uhr`, p.name, p.kurz, kk.puls, `${kk.rr[0]}/${kk.rr[1]}`, kk.af, kk.vorwert, kk.beobachtung, kk.aussage), leer(300));
  });
  const a = V.aufloesung;
  k.push(...karte(`${a.zeit} Uhr · Auflösung`, 'Finn Albers (17) – wenn niemand Alarm gegeben hätte', 'nur zeigen, wenn Finn nicht rechtzeitig gemeldet wurde – sonst vorlesen: „' + a.gerettet + '“', a.puls, `${a.rr[0]}/${a.rr[1]}`, a.af, null, a.beobachtung + ' ' + a.text, a.aussage));
  return k;
}

// Anhang B: Simulation als Plenumsspiel (ohne Handy)
function skript(B) {
  const k = []; const S = W4.speisesaal;
  k.push(B.abschnitt('Anhang B · Notfall-Ampel im Speisesaal ohne Handy (Plenumsspiel)', { pageBreakBefore: true }));
  k.push(B.p('**Ablauf:** Szene vorlesen → Antworten 1–4 vorlesen → **10 Sekunden** herunterzählen → Paare zeigen 1–4 Finger. Richtig beim ersten Mal = 2 P., beim zweiten = 1 P. Bei schweren Verlegungen: Zögern oder falsche Wahl → „Die Lippen werden blauer …“; bei der zweiten falschen Wahl ist die Person **bewusstlos** (Szene verloren). Bei leichten Verlegungen: Antwort „Hilfe rufen“ = **Fehlalarm** (an der Tafel zählen). **Bestanden:** niemand bewusstlos, höchstens 1 Fehlalarm. Reihenfolge: Szenen 1–3 fest, 4–6 beliebig.', { spacing: { after: 100, line: 252 } }));
  const sp = [{ text: 'Szene', w: 1900 }, { text: 'Vorlesen', w: 3100 }, { text: 'Antworten', w: 0 }];
  sp[2].w = B.breite - 5000;
  S.szenen.forEach((z, i) => {
    const antworten = z.wahl.map((o, j) => new Paragraph({ spacing: { after: 30, line: 240 }, children: [B.b(`${j + 1}  `, { size: 17 }), ...(o === z.richtig ? [B.loes(S.optionen[o].text.replace('ihr/ihm', 'ihr/ihm'), { size: 17, bold: true })] : [B.t(S.optionen[o].text, { size: 17 })]), B.t(' → ' + z.rueckmeldung[o], { size: 16, color: F.GRAU_T })] }));
    k.push(B.tabelle(sp, [[`**${i + 1} · ${z.person}**\n`, z.text, { absaetze: antworten }]].map((r) => [{ absaetze: [new Paragraph({ spacing: { after: 20 }, children: [B.b(`${i + 1} · ${z.person}`, { size: 18 })] }), new Paragraph({ spacing: { after: 0 }, children: [B.t(z.ort + ' · ' + (z.schwer ? 'schwer' : 'leicht'), { size: 16, color: F.GRAU_T })] })] }, { text: r[1] }, r[2]]), { schrift: 17 }));
    k.push(leer(80));
  });
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
  const SV = bausteine({ lsg: false, breite: BREITE_HOCH });
  await speichern(new Document({ creator: 'KB I · 3BFP2', title: 'KB1 W4 Wirbelsäule, innere Blutung, Atemwege – Schülerversion', styles: STILE, sections: [sektionHoch(alleBlaetter(SV))] }), NAME + '_SV.docx');
  const LQ = bausteine({ lsg: true, breite: BREITE_QUER });
  const LH = bausteine({ lsg: true, breite: BREITE_HOCH });
  await speichern(new Document({
    creator: 'KB I · 3BFP2', title: 'KB1 W4 Wirbelsäule, innere Blutung, Atemwege – Lehrerversion mit Lösungen', styles: STILE,
    sections: [
      { properties: { page: SEITE_QUER }, headers: { default: kopf(BREITE_QUER, { thema: T.THEMA }) }, footers: { default: fuss(T.FUSS + ' · Lehrerversion') }, children: trenne([...verlaufsplan(LQ), ...hinweise(LQ)]) },
      sektionHoch([B_LSG_TITEL(LH), ...alleBlaetter(LH)], T.FUSS + ' · Lehrerversion'),
      sektionHoch([...messkarten(LH), ...skript(LH)], T.FUSS + ' · Lehrerversion · Anhang')
    ]
  }), NAME + '_LV_LSG.docx');
}
const B_LSG_TITEL = (B) => new Paragraph({ spacing: { after: 120 }, children: [B.b('Lösungen und Zeitangaben zu den drei Arbeitsblättern ', { size: 24 }), B.loes('[LSG]', { bold: true, size: 24 })] });

if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
module.exports = { umbrechen };

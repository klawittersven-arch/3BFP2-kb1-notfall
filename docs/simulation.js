/* AA4 Notfall-Simulation „Anaphylaxie“ – Programmlogik (Texte und Zahlen stehen in inhalte_simulation.js).
 *
 * Ablauf
 *   Übersicht: drei Varianten (A Klinik, B Pflegeheim, C ambulant), beliebige Reihenfolge.
 *   Spiel:     Simulationsuhr ab 00:00. Zeit vergeht nur durch Handlungen (jede kostet Sekunden)
 *              und durch „1 Minute beobachten“. Alle 30 Sekunden ändern sich die Werte nach Regeln.
 *   Ende:      wenn die Hilfe eintrifft oder nach 12 Minuten → Nachbesprechung mit Zeitstrahl,
 *              Checkliste und Satz zur Lagerung.
 *   Fortschritt: geschaffte Varianten (sessionStorage) → Balken oben und Beamer-Anzeige.
 */
(function () {
  'use strict';

  var K = window.KB1;
  var el = K.element;
  var S = K.seiteVorbereiten('simulation');
  var T = S.texte;
  var A = INHALTE.allgemein || {};
  var SEITE = 'w2-simulation';
  var SCHL_FERTIG = 'kb1nf_sim_fertig';
  var TAKT = 30; // Sekunden je Rechenschritt
  var FEHLER_GRENZE = 3;

  var platz = document.getElementById('uebung');
  var zustand = null;     // laufende Variante
  var variante = null;

  /* ---------- Speicher: geschaffte Varianten ---------- */
  function fertigListe() {
    var l = K.Speicher.sitzung.lesen(SCHL_FERTIG);
    return Array.isArray(l) ? l.filter(function (id) { return S.varianten.some(function (v) { return v.id === id; }); }) : [];
  }
  function fertigMerken(id) {
    var l = fertigListe();
    if (l.indexOf(id) === -1) l.push(id);
    K.Speicher.sitzung.schreiben(SCHL_FERTIG, l);
  }
  function fortschrittMelden() {
    var n = fertigListe().length;
    var gesamt = S.varianten.length;
    K.fortschrittSetzen(n, gesamt);
    K.melden(SEITE, n, gesamt, n >= gesamt ? 'fertig' : 'arbeitet');
    if (n >= gesamt) K.Erledigt.merken(SEITE);
  }

  /* ---------- kleine Helfer ---------- */
  function uhr(sek) {
    var m = Math.floor(sek / 60), s = sek % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }
  function begrenzen(w, min, max) { return Math.max(min, Math.min(max, Math.round(w))); }
  function leeren(e) { while (e.firstChild) e.removeChild(e.firstChild); }
  function liste(w) { return Array.isArray(w) ? w : [w]; }

  /* Prüft eine Bedingung „wenn: { … }“ gegen den Zustand. Alle angegebenen Schlüssel müssen passen. */
  function passt(wenn, z) {
    if (!wenn) return true;
    for (var k in wenn) {
      if (!Object.prototype.hasOwnProperty.call(wenn, k)) continue;
      var w = wenn[k];
      switch (k) {
        case 'bew': if (liste(w).indexOf(z.bew) === -1) return false; break;
        case 'lage': if (liste(w).indexOf(z.lage) === -1) return false; break;
        case 'atemnot': if (!!z.atemnot !== !!w) return false; break;
        case 'adrenalin': if ((z.adrenalinUm !== null) !== !!w) return false; break;
        case 'adrenalinWirkt': if (adrenalinWirkt(z) !== !!w) return false; break;
        case 'kollaps': if (!!z.kollaps !== !!w) return false; break;
        case 'spo2Unter': if (!(z.spo2 < w)) return false; break;
        case 'sysUnter': if (!(z.sys < w)) return false; break;
        case 'merker': if (!z.merker[w]) return false; break;
        case 'ohneMerker': if (z.merker[w]) return false; break;
        default: break;
      }
    }
    return true;
  }
  function erstePassende(listeBed, z) {
    for (var i = 0; i < (listeBed || []).length; i++) if (passt(listeBed[i].wenn, z)) return listeBed[i];
    return null;
  }
  function adrenalinWirkt(z) {
    return z.adrenalinUm !== null && z.t - z.adrenalinUm >= S.adrenalin.ab;
  }

  /* Welche Lagerungen passen gerade zum Leitsymptom? */
  function leitsymptom(z) {
    if (z.bew === 'bewusstlos') return 'bewusstlos';
    if (z.atemnot) return 'atemnot';
    // nach wirksamer Behandlung: Kreislauf stabil – jede ruhige Lagerung passt (nur nicht stehen/gehen)
    if (adrenalinWirkt(z) && z.sys >= 90) return 'stabil';
    return 'kreislauf';
  }
  function lagePasst(v, z) {
    var l = leitsymptom(z);
    if (l === 'stabil') return z.lage !== 'stehend';
    return (v.lageZiel[l] || []).indexOf(z.lage) !== -1;
  }

  /* ---------- Zustand ---------- */
  function neuerZustand(v) {
    var s = v.start;
    return {
      t: 0, naechsterTakt: TAKT,
      hf: s.hf, sys: s.sys, dia: s.dia, af: s.af, spo2: s.spo2,
      bew: s.bew, lage: s.lage, atemnot: !!v.atemweg,
      merker: {}, benutzt: {},
      adrenalinUm: null, sauerstoff: false,
      kollaps: false, kollapsErholt: false, erholTakte: 0, wachTakte: 0,
      hilfeUm: null,
      anzeige: v.werteSichtbar ? null : { gemessen: false },
      messAnzahl: 0,
      takte: 0, takteGeeignet: 0, warBewusstlos: false,
      protokoll: [], fehler: 0, rueck: null, ereignisse: [], ende: null
    };
  }

  function ereignis(z, text) {
    z.ereignisse.push(text);
    z.protokoll.push({ t: z.t, text: text, bewertung: 'ereignis', kuerzel: '' });
  }

  /* Ein Rechenschritt (30 Sekunden Simulationszeit) */
  function takt(v, z) {
    var vorher = z.bew;
    z.takte++;
    if (lagePasst(v, z)) z.takteGeeignet++;

    var wirkt = adrenalinWirkt(z);
    // Atemnot klingt nach der Adrenalingabe ab
    if (z.atemnot && z.adrenalinUm !== null && z.t - z.adrenalinUm >= S.adrenalin.atemnotWegNach) z.atemnot = false;

    // Verlauf ohne Behandlung
    if (!wirkt) {
      z.sys += v.verlauf.sys; z.dia += v.verlauf.dia; z.hf += v.verlauf.hf;
      if (z.atemnot) { z.af += v.verlauf.af; z.spo2 += v.verlauf.spo2; }
    }
    // Allergen läuft weiter (z. B. Infusion nicht gestoppt)
    if (v.allergenMerker && !z.merker[v.allergenMerker]) {
      z.sys += v.allergenExtra.sys || 0;
      z.spo2 += v.allergenExtra.spo2 || 0;
    }
    // Lagerung
    if (z.atemnot && (z.lage === 'flach' || z.lage === 'beine')) { z.spo2 -= 2; z.af += 2; }
    if (!z.atemnot && z.bew !== 'bewusstlos' && v.sitzMalus && (z.lage === 'sitzend' || z.lage === 'oberkoerper' || z.lage === 'stehend')) z.sys -= v.sitzMalus;
    if (!z.atemnot && z.lage === 'beine' && !wirkt && z.sys < (v.beineMax || 100)) { z.sys += v.beineBonus || 0; z.dia += 1; z.hf -= 1; }
    // Adrenalin bringt die Werte Schritt für Schritt zum Ziel
    if (wirkt) {
      var ziel = S.adrenalin.ziel, schritt = S.adrenalin.schritt;
      ['hf', 'sys', 'dia', 'af', 'spo2'].forEach(function (k) {
        if (z[k] < ziel[k]) z[k] = Math.min(ziel[k], z[k] + schritt[k]);
        else if (z[k] > ziel[k]) z[k] = Math.max(ziel[k], z[k] - schritt[k]);
      });
    }
    // Sauerstoff
    if (z.sauerstoff && z.spo2 < S.sauerstoff.max) z.spo2 = Math.min(S.sauerstoff.max, z.spo2 + S.sauerstoff.schritt);

    // Variante C: ohne Adrenalin wird die Person nach einer festen Zeit bewusstlos
    var kollapsMeldung = false;
    if (v.kollapsOhneAdrenalinAb && z.adrenalinUm === null && !z.kollaps && z.t >= v.kollapsOhneAdrenalinAb) {
      z.kollaps = true;
      z.sys = Math.min(z.sys, 78);
      ereignis(z, v.kollapsText);
      kollapsMeldung = true;
    }
    // Erholung nach einem Kollaps
    if (z.kollaps && !z.kollapsErholt) {
      var darf = v.erholungBrauchtAdrenalin ? wirkt : true;
      if (darf && (v.lageZiel.bewusstlos || []).indexOf(z.lage) !== -1) z.erholTakte++;
      if (darf && v.erholungBrauchtAdrenalin && z.adrenalinUm !== null && z.t - z.adrenalinUm >= 60) z.erholTakte++;
      if (z.erholTakte >= 2) z.kollapsErholt = true;
    }
    if (z.kollapsErholt) z.wachTakte++;

    // Werte begrenzen
    z.hf = begrenzen(z.hf, 40, 175); z.sys = begrenzen(z.sys, 45, 180); z.dia = begrenzen(z.dia, 25, 110);
    z.af = begrenzen(z.af, 8, 44); z.spo2 = begrenzen(z.spo2, 62, 100);

    // Bewusstsein
    if ((z.kollaps && !z.kollapsErholt) || z.sys < 65 || z.spo2 < 70) z.bew = 'bewusstlos';
    else if (z.sys < 75 || (z.kollapsErholt && z.wachTakte < 3)) z.bew = 'benommen';
    else if (wirkt || z.kollapsErholt) z.bew = 'wach';
    else z.bew = v.start.bew;

    // Wechsel des Bewusstseins als Ereignis melden (der Kollaps hat schon eine eigene Meldung)
    if (z.bew === 'bewusstlos') {
      z.warBewusstlos = true;
      if (z.lage === 'seite') z.merker.seiteBeiBewusstlos = true;
      if (vorher !== 'bewusstlos' && !kollapsMeldung) ereignis(z, T.bewusstseinsstufen.bewusstlos);
    } else if (vorher === 'bewusstlos') {
      ereignis(z, T.bewusstseinsstufen[z.bew] || z.bew);
    }
  }

  function vorruecken(v, z, sekunden) {
    z.t += sekunden;
    while (z.t >= z.naechsterTakt) { takt(v, z); z.naechsterTakt += TAKT; }
    if (z.hilfeUm !== null && z.t >= z.hilfeUm) z.ende = 'hilfe';
    else if (z.t >= v.maxZeit) z.ende = 'zeit';
  }

  /* ---------- Handlung ausführen ---------- */
  function bewertungFuer(a, z) {
    var f = erstePassende(a.faelle, z) || {};
    return {
      bewertung: f.bewertung || a.bewertung,
      kuerzel: f.kuerzel || a.kuerzel,
      rueck: f.rueck || a.rueck
    };
  }

  function handeln(a) {
    var v = variante, z = zustand;
    if (!z || z.ende) return;
    var b = bewertungFuer(a, z);
    z.ereignisse = [];
    var start = z.t;
    if (b.bewertung === 'verboten') {
      // wird nicht ausgeführt – nur Rückmeldung, kostet etwas Zeit
      z.fehler++;
      z.merker.verboten = true;
      z.benutzt[a.id] = true;
      z.protokoll.push({ t: start, text: a.text, bewertung: 'verboten', kuerzel: 'X' });
      z.rueck = { bewertung: 'verboten', kuerzel: 'X', text: b.rueck, handlung: a.text };
      vorruecken(v, z, Math.min(a.dauer || 15, 15));
      zeichnen(true);
      return;
    }
    var w = a.wirkung || {};
    if (b.bewertung === 'gefaehrlich') z.fehler++;
    if (w.setzt) w.setzt.forEach(function (m) { z.merker[m] = true; });
    if (w.lage) z.lage = w.lage;
    if (a.gruppe === 'lagerung' && b.bewertung === 'gut') z.merker.lageOk = true;
    if (w.sys) z.sys += w.sys;
    if (w.dia) z.dia += w.dia;
    if (w.kollaps && !z.kollaps) { z.kollaps = true; z.kollapsErholt = false; z.erholTakte = 0; z.wachTakte = 0; z.bew = 'bewusstlos'; z.warBewusstlos = true; }
    else if (w.kollaps) { z.kollapsErholt = false; z.erholTakte = 0; z.bew = 'bewusstlos'; }
    if (w.adrenalin && z.adrenalinUm === null) z.adrenalinUm = start + (a.dauer || 0);
    if (w.sauerstoff) z.sauerstoff = true;
    if (w.hilfe && z.hilfeUm === null) z.hilfeUm = start + (a.dauer || 0) + w.hilfe;
    if (!a.wiederholbar) z.benutzt[a.id] = true;
    z.protokoll.push({ t: start, text: a.text, bewertung: b.bewertung, kuerzel: b.kuerzel });
    z.rueck = { bewertung: b.bewertung, kuerzel: b.kuerzel, text: b.rueck, handlung: a.text };
    vorruecken(v, z, a.dauer || 0);
    if (w.messen) {
      z.messAnzahl++;
      z.merker.gemessen = true;
      z.anzeige = { gemessen: true, um: z.t, hf: z.hf, sys: z.sys, dia: z.dia, af: z.af, spo2: z.spo2 };
    }
    zeichnen(true);
  }

  /* ---------- Anzeige: Übersicht ---------- */
  function uebersicht() {
    zustand = null; variante = null;
    leeren(platz);
    fortschrittMelden();
    var fertig = fertigListe();

    var rollen = el('section', 'sim-rollen');
    rollen.appendChild(el('h2', null, T.rollenTitel));
    var ul = el('ul', 'sim-rollen-liste');
    S.rollen.forEach(function (r) {
      var li = el('li');
      li.appendChild(el('span', 'sim-rolle-symbol', r.symbol));
      var tx = el('span');
      tx.appendChild(el('strong', null, r.titel + ': '));
      tx.appendChild(document.createTextNode(r.text));
      li.appendChild(tx);
      ul.appendChild(li);
    });
    rollen.appendChild(ul);
    rollen.appendChild(el('p', 'sim-legende', T.legende));
    platz.appendChild(rollen);

    if (fertig.length >= S.varianten.length) {
      platz.appendChild(el('p', 'sim-alle-fertig', T.alleFertig));
      platz.appendChild(K.merksatzElement('aa4', 'Merksatz AA4'));
    }

    platz.appendChild(el('h2', 'sim-h2', T.variantenTitel));
    var karten = el('div', 'sim-varianten');
    S.varianten.forEach(function (v) {
      var istFertig = fertig.indexOf(v.id) !== -1;
      var karte = el('article', 'sim-variante' + (istFertig ? ' ist-fertig' : ''));
      karte.setAttribute('data-variante', v.id);
      var kopf = el('div', 'sim-variante-kopf');
      kopf.appendChild(el('span', 'sim-variante-id', v.id));
      var titel = el('div');
      titel.appendChild(el('h3', null, v.titel));
      titel.appendChild(el('p', 'sim-variante-kurz', v.kurz));
      kopf.appendChild(titel);
      kopf.appendChild(el('span', 'sim-status' + (istFertig ? ' fertig' : ''), istFertig ? T.geschafft : T.offen));
      karte.appendChild(kopf);
      karte.appendChild(K.knopf(K.ersetzen(istFertig ? T.nochmal : T.starten, { id: v.id }), istFertig ? 'knopf-zweit' : 'sim-start', function () { starten(v); }));
      karten.appendChild(karte);
    });
    platz.appendChild(karten);

    if (fertig.length) {
      var fuss = el('div', 'fuss');
      var zur = el('button', 'textknopf', T.zuruecksetzen);
      zur.type = 'button';
      zur.addEventListener('click', function () {
        if (window.confirm(T.zuruecksetzenFrage)) {
          K.Speicher.sitzung.schreiben(SCHL_FERTIG, []);
          uebersicht();
        }
      });
      fuss.appendChild(zur);
      platz.appendChild(fuss);
    }
  }

  function starten(v) {
    variante = v;
    zustand = neuerZustand(v);
    zeichnen(false);
    K.scrollen(document.getElementById('titel') || platz);
  }

  /* ---------- Anzeige: laufende Simulation ---------- */
  function wertZeile(label, wert, einheit, klasse) {
    var d = el('div', 'sim-wert ' + klasse);
    d.appendChild(el('span', 'sim-wert-label', label));
    var z = el('span', 'sim-wert-zahl', wert);
    d.appendChild(z);
    if (wert !== T.leer) d.appendChild(el('span', 'sim-wert-einheit', einheit));
    return d;
  }

  function monitor(v, z) {
    var m = el('section', 'sim-monitor');
    m.setAttribute('aria-label', T.monitor);
    var kopf = el('div', 'sim-monitor-kopf');
    kopf.appendChild(el('span', 'sim-monitor-titel', T.monitor));
    var u = el('span', 'sim-uhr');
    u.appendChild(el('span', 'sim-uhr-label', T.uhr + ' '));
    u.appendChild(el('strong', 'sim-uhr-zeit', uhr(z.t)));
    kopf.appendChild(u);
    m.appendChild(kopf);

    var w = v.werteSichtbar ? { hf: z.hf, sys: z.sys, dia: z.dia, af: z.af, spo2: z.spo2 } : (z.anzeige && z.anzeige.gemessen ? z.anzeige : null);
    var raster = el('div', 'sim-werte');
    raster.appendChild(wertZeile(T.hf, w ? String(w.hf) : T.leer, T.einheitHf, 'hf'));
    raster.appendChild(wertZeile(T.rr, w ? w.sys + '/' + w.dia : T.leer, T.einheitRr, 'rr'));
    raster.appendChild(wertZeile(T.af, w ? String(w.af) : T.leer, T.einheitAf, 'af'));
    raster.appendChild(wertZeile(T.spo2, w ? String(w.spo2) : T.leer, T.einheitSpo2, 'spo2'));
    m.appendChild(raster);
    var fuss = v.werteSichtbar ? T.monitorLaeuft : (w ? K.ersetzen(T.gemessenUm, { zeit: uhr(w.um) }) : T.nichtGemessen);
    m.appendChild(el('p', 'sim-monitor-fuss', fuss));
    return m;
  }

  function person(v, z) {
    var p = el('section', 'sim-person');
    p.appendChild(el('h2', null, T.personTitel));
    var aus = erstePassende(v.aussagen, z);
    if (aus) p.appendChild(K.formatiert('p', 'sim-sprechblase', aus.text));
    var dl = el('dl', 'sim-beobachtung');
    function zeile(dt, dd) { dl.appendChild(el('dt', null, dt)); dl.appendChild(el('dd', null, dd)); }
    zeile(T.bewusstsein, T.bewusstseinsstufen[z.bew] || z.bew);
    var haut = erstePassende(v.haut, z); if (haut) zeile(T.haut, haut.text);
    var atm = erstePassende(v.atmung, z); if (atm) zeile(T.atmung, atm.text);
    zeile(T.lage, T.lagen[z.lage] || z.lage);
    p.appendChild(dl);
    return p;
  }

  function rueckmeldung(z) {
    var box = el('section', 'sim-rueck');
    box.setAttribute('aria-live', 'polite');
    z.ereignisse.forEach(function (e) {
      var ev = el('p', 'sim-ereignis');
      ev.appendChild(el('strong', null, '⚠ ' + T.ereignis + ': '));
      ev.appendChild(document.createTextNode(e));
      box.appendChild(ev);
    });
    if (z.rueck) {
      var r = el('div', 'sim-rueck-karte bew-' + z.rueck.bewertung);
      var kopf = el('p', 'sim-rueck-kopf');
      kopf.appendChild(el('span', 'sim-bewertung', T.bewertung[z.rueck.bewertung] || ''));
      kopf.appendChild(el('span', 'sim-kuerzel k-' + z.rueck.kuerzel, T.kuerzel[z.rueck.kuerzel] || z.rueck.kuerzel));
      r.appendChild(kopf);
      r.appendChild(el('p', 'sim-rueck-handlung', z.rueck.handlung));
      r.appendChild(el('p', 'sim-rueck-text', z.rueck.text));
      box.appendChild(r);
    }
    return box;
  }

  function handlungen(v, z) {
    var sek = el('section', 'sim-handlungen');
    sek.appendChild(el('h2', null, T.handlungenTitel));
    var gruppen = ['hilfe', 'allergen', 'lagerung', 'medikamente', 'ueberwachung', 'doku'];
    gruppen.forEach(function (g) {
      var akt = v.aktionen.filter(function (a) { return a.gruppe === g; });
      if (!akt.length) return;
      var gr = el('div', 'sim-gruppe');
      gr.appendChild(el('h3', null, T.gruppen[g] || g));
      var kn = el('div', 'sim-knoepfe');
      akt.forEach(function (a) {
        var b = el('button', 'sim-aktion', a.text);
        b.type = 'button';
        b.setAttribute('data-aktion', a.id);
        if (z.benutzt[a.id]) {
          b.disabled = true;
          var eintrag = z.protokoll.filter(function (p) { return p.text === a.text; })[0];
          if (eintrag) b.classList.add('benutzt-' + eintrag.bewertung);
        }
        if (a.gruppe === 'lagerung' && a.wirkung && a.wirkung.lage === z.lage && a.wiederholbar) b.classList.add('aktuell');
        b.addEventListener('click', function () { handeln(a); });
        kn.appendChild(b);
      });
      gr.appendChild(kn);
      sek.appendChild(gr);
    });
    return sek;
  }

  function zeichnen(nachHandlung) {
    var v = variante, z = zustand;
    if (z.ende) { nachbesprechung(); return; }
    leeren(platz);
    var kopf = el('div', 'sim-kopf');
    kopf.appendChild(el('h2', 'sim-titel', v.titel));
    var zur = el('button', 'textknopf', T.zurUebersicht);
    zur.type = 'button';
    zur.addEventListener('click', uebersicht);
    kopf.appendChild(zur);
    platz.appendChild(kopf);

    var lage = el('details', 'info sim-situation');
    if (!nachHandlung && !z.protokoll.length) lage.open = true;
    lage.appendChild(el('summary', null, T.ausgangslage));
    var inn = el('div', 'info-inhalt');
    inn.appendChild(K.formatiert('p', null, v.situation));
    lage.appendChild(inn);
    platz.appendChild(lage);

    var status = el('div', 'sim-status-bereich');
    status.id = 'sim-status';
    status.appendChild(monitor(v, z));
    status.appendChild(person(v, z));
    status.appendChild(rueckmeldung(z));
    platz.appendChild(status);
    platz.appendChild(handlungen(v, z));
    if (nachHandlung) K.scrollen(status);
  }

  /* ---------- Nachbesprechung ---------- */
  function checkErgebnis(v, z, c) {
    if (c.typ === 'lage') return z.takte > 0 && z.takteGeeignet / z.takte >= 0.6 ? 'ja' : 'nein';
    if (c.typ === 'seiteWennBewusstlos') return !z.warBewusstlos ? 'entfaellt' : (z.merker.seiteBeiBewusstlos ? 'ja' : 'nein');
    var ok = true;
    if (c.merker && !z.merker[c.merker]) ok = false;
    if (c.ohneMerker && z.merker[c.ohneMerker]) ok = false;
    if (c.messMin && z.messAnzahl < c.messMin) ok = false;
    return ok ? 'ja' : 'nein';
  }

  function nachbesprechung() {
    var v = variante, z = zustand;
    leeren(platz);
    var durchgeklickt = z.fehler >= FEHLER_GRENZE;
    if (!durchgeklickt) fertigMerken(v.id);
    fortschrittMelden();

    var sek = el('section', 'sim-nachbesprechung');
    sek.appendChild(el('h2', 'sim-titel', K.ersetzen(T.nachbesprechung, { titel: v.titel })));

    if (durchgeklickt) {
      var dk = el('section', 'durchklicken');
      dk.setAttribute('role', 'alert');
      dk.appendChild(el('h2', null, T.durchklickenTitel));
      dk.appendChild(el('p', null, K.ersetzen(T.durchklickenText, { n: z.fehler })));
      dk.appendChild(K.knopf(T.wiederholen, 'durchklicken-knopf', function () { starten(v); }));
      sek.appendChild(dk);
    }

    var ende = el('div', 'sim-ende');
    if (z.ende === 'hilfe') {
      ende.appendChild(el('p', 'sim-ende-zeit', K.ersetzen(T.endeHilfe, { zeit: uhr(z.t) })));
      ende.appendChild(K.formatiert('p', null, v.endeHilfe));
      if (z.adrenalinUm === null && v.endeOhneAdrenalin) ende.appendChild(K.formatiert('p', 'sim-hinweis', v.endeOhneAdrenalin));
    } else {
      ende.appendChild(el('p', 'sim-ende-zeit', T.endeZeit));
    }
    ende.appendChild(el('p', 'sim-endwerte', K.ersetzen(T.endwerte, { hf: z.hf, sys: z.sys, dia: z.dia, af: z.af, spo2: z.spo2, bew: T.bewusstseinsstufen[z.bew] || z.bew })));
    sek.appendChild(ende);

    // Checkliste
    sek.appendChild(el('h3', null, T.checkliste));
    var cl = el('ul', 'sim-checkliste');
    v.checkliste.forEach(function (c) {
      var erg = checkErgebnis(v, z, c);
      var li = el('li', 'check-' + erg + (c.zusatz ? ' zusatz' : ''));
      li.appendChild(el('span', 'check-marke', erg === 'ja' ? T.erledigt : erg === 'entfaellt' ? T.entfaellt : T.fehlt));
      li.appendChild(el('span', 'check-text', c.text + (c.zusatz ? ' ' + T.zusatz : '')));
      cl.appendChild(li);
    });
    sek.appendChild(cl);

    // Lagerung
    sek.appendChild(el('h3', null, T.lagerungTitel));
    sek.appendChild(K.formatiert('p', null, v.lageErklaerung));
    sek.appendChild(el('p', 'sim-lagequote', K.ersetzen(T.lageQuote, { x: z.takteGeeignet, y: z.takte })));

    // Zeitstrahl
    sek.appendChild(el('h3', null, T.zeitstrahl));
    sek.appendChild(el('p', 'sim-legende', T.legende));
    var tab = el('table', 'sim-zeitstrahl');
    var thead = el('thead');
    var trh = el('tr');
    [T.zeit, T.handlung, T.bewertungSpalte, T.grundlage].forEach(function (h) { trh.appendChild(el('th', null, h)); });
    thead.appendChild(trh);
    tab.appendChild(thead);
    var tb = el('tbody');
    z.protokoll.forEach(function (p) {
      var tr = el('tr', 'bew-' + p.bewertung);
      tr.appendChild(el('td', 'zs-zeit', uhr(p.t)));
      tr.appendChild(el('td', 'zs-text', p.text));
      tr.appendChild(el('td', 'zs-bew', p.bewertung === 'ereignis' ? '⚠' : (T.bewertung[p.bewertung] || '')));
      tr.appendChild(el('td', 'zs-k', p.kuerzel === 'X' ? '✗' : p.kuerzel));
      tb.appendChild(tr);
    });
    tab.appendChild(tb);
    var huelle = el('div', 'sim-tabelle-huelle');
    huelle.appendChild(tab);
    sek.appendChild(huelle);

    sek.appendChild(el('p', 'sim-protokoll-hinweis', T.protokollHinweis));
    if (!durchgeklickt && fertigListe().length < S.varianten.length) sek.appendChild(el('p', 'sim-rollenwechsel', T.rollenwechsel));
    var kn = el('div', 'sim-ende-knoepfe');
    kn.appendChild(K.knopf(T.wiederholen, 'knopf-zweit', function () { starten(v); }));
    kn.appendChild(K.knopf(T.zurUebersicht, 'sim-start', uebersicht));
    sek.appendChild(kn);
    platz.appendChild(sek);
    K.scrollen(sek);
  }

  uebersicht();
})();

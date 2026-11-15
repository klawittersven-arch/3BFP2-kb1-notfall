/* Gemeinsame Hilfsfunktionen für alle Seiten (Programmlogik – Texte stehen in inhalte.js). */
(function () {
  'use strict';

  /* ---------- Speicher: jeder Zugriff abgesichert, Seite läuft auch ohne ---------- */
  function lager(art) {
    try {
      var s = window[art];
      var probe = '__kb1nf_probe__';
      s.setItem(probe, '1');
      s.removeItem(probe);
      return s;
    } catch (e) {
      return null;
    }
  }

  function lesen(s, schluessel) {
    if (!s) return null;
    try {
      var roh = s.getItem(schluessel);
      return roh === null ? null : JSON.parse(roh);
    } catch (e) {
      return null;
    }
  }

  function schreiben(s, schluessel, wert) {
    if (!s) return false;
    try {
      if (wert === null || wert === undefined) s.removeItem(schluessel);
      else s.setItem(schluessel, JSON.stringify(wert));
      return true;
    } catch (e) {
      return false;
    }
  }

  var sitzungLager = lager('sessionStorage');
  var dauerLager = lager('localStorage');

  var Speicher = {
    // Nur für diesen Tab (übersteht Neuladen)
    sitzung: {
      lesen: function (k) { return lesen(sitzungLager, k); },
      schreiben: function (k, w) { return schreiben(sitzungLager, k, w); }
    },
    // Dauerhaft auf dem Gerät; ohne localStorage Ausweichen auf sessionStorage
    dauer: {
      lesen: function (k) {
        var w = lesen(dauerLager, k);
        return w !== null ? w : lesen(sitzungLager, k);
      },
      schreiben: function (k, w) {
        return schreiben(dauerLager, k, w) || schreiben(sitzungLager, k, w);
      }
    }
  };

  /* ---------- „Erledigt“-Haken auf der Startseite (gilt 12 Stunden) ---------- */
  var ERLEDIGT_GUELTIG_MS = 12 * 3600000;
  var Erledigt = {
    merken: function (seite) { Speicher.dauer.schreiben('kb1nf_erledigt_' + seite, Date.now()); },
    zuruecknehmen: function (seite) { Speicher.dauer.schreiben('kb1nf_erledigt_' + seite, null); },
    ist: function (seite) {
      var um = Speicher.dauer.lesen('kb1nf_erledigt_' + seite);
      return typeof um === 'number' && um <= Date.now() + 60000 && Date.now() - um < ERLEDIGT_GUELTIG_MS;
    }
  };

  /* ---------- Kleine Helfer ---------- */
  function element(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }

  function ersetzen(vorlage, werte) {
    return String(vorlage).replace(/\{(\w+)\}/g, function (_, k) {
      return werte[k] !== undefined ? werte[k] : '';
    });
  }

  // Text mit **fett** und \n (Zeilenumbruch) in ein Element schreiben – ohne innerHTML
  function formatiert(tag, klasse, text) {
    var e = element(tag, klasse);
    String(text).split('\n').forEach(function (zeile, z) {
      if (z > 0) e.appendChild(document.createElement('br'));
      zeile.split('**').forEach(function (teil, i) {
        if (!teil) return;
        e.appendChild(i % 2 ? element('strong', 'betont', teil) : document.createTextNode(teil));
      });
    });
    return e;
  }

  function ruhig() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* ---------- Vornamen prüfen (Handy) ---------- */
  var ERLAUBT = /^[A-Za-z0-9ÄÖÜäöüßÀ-ÖØ-öø-ÿ _-]+$/;
  var ERSATZ = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '@': 'a', '$': 's' };

  function normalisieren(text) {
    var t = String(text).toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
    var aus = '';
    for (var i = 0; i < t.length; i++) {
      var z = ERSATZ[t[i]] || t[i];
      if (z >= 'a' && z <= 'z') aus += z;
    }
    return aus.replace(/(.)\1+/g, '$1'); // doppelte Buchstaben zusammenziehen
  }

  // Ergebnis: '' (in Ordnung), 'laenge', 'zeichen' oder 'wort'
  function namePruefen(name) {
    if (typeof name !== 'string') return 'zeichen';
    var n = name.trim().replace(/\s+/g, ' ');
    if (n.length < 2 || n.length > 20) return 'laenge';
    if (!ERLAUBT.test(n)) return 'zeichen';
    var norm = normalisieren(n);
    var liste = (window.CONFIG && window.CONFIG.SPERRWOERTER) || [];
    for (var i = 0; i < liste.length; i++) {
      var wort = normalisieren(liste[i]);
      if (wort && norm.indexOf(wort) !== -1) return 'wort';
    }
    return '';
  }

  function zufallsId(laenge) {
    var zeichen = 'abcdefghijkmnpqrstuvwxyz23456789';
    var aus = '';
    var zahlen = new Uint8Array(laenge);
    (window.crypto || window.msCrypto).getRandomValues(zahlen);
    for (var i = 0; i < laenge; i++) aus += zeichen[zahlen[i] % zeichen.length];
    return aus;
  }


  /* ---------- Bausteine für die Übungsseiten ---------- */
  var A = (window.INHALTE && INHALTE.allgemein) || {};

  // Kopf, Titel und Anweisung aus INHALTE[bereich] setzen
  function seiteVorbereiten(bereich) {
    var T = INHALTE[bereich];
    var kz = document.getElementById('kopfzeile');
    var h1 = document.getElementById('titel');
    var an = document.getElementById('anweisung');
    if (kz) kz.textContent = A.kopfzeile;
    if (h1) h1.textContent = T.titel;
    if (an && T.anweisung) { an.textContent = ''; an.appendChild(formatiert('span', null, T.anweisung)); }
    document.title = T.titel + ' – ' + A.kopfzeile;
    return T;
  }

  function fortschrittSetzen(x, y) {
    var t = document.getElementById('fortschritt-text');
    var b = document.getElementById('fortschritt-balken');
    if (t) t.textContent = ersetzen(A.fortschritt, { x: x, y: y });
    if (b) b.style.width = (y ? Math.round(100 * x / y) : 0) + '%';
  }

  function knopf(text, klasse, aktion) {
    var b = element('button', 'knopf' + (klasse ? ' ' + klasse : ''), text);
    b.type = 'button';
    if (aktion) b.addEventListener('click', aktion);
    return b;
  }

  // Merksatz aus INHALTE.merksaetze[key]: Teile sind Strings oder { l: 'Lösungswort' }
  // hinweis (optional): eigener Satz über dem Merksatz, sonst „Geschafft! … auf Ihrem Arbeitsblatt“
  function merksatzElement(key, titel, hinweis) {
    var box = element('section', 'merksatz');
    box.setAttribute('aria-live', 'polite');
    box.appendChild(element('p', 'merksatz-hinweis', hinweis || ersetzen(A.merksatzHinweis, { titel: titel })));
    box.appendChild(element('h2', null, A.merksatzUeberschrift + ' · ' + titel));
    var p = element('p', 'merksatz-text');
    (INHALTE.merksaetze[key] || []).forEach(function (teil) {
      if (typeof teil === 'string') p.appendChild(document.createTextNode(teil));
      else p.appendChild(element('mark', 'luecke', teil.l));
    });
    box.appendChild(p);
    return box;
  }

  // „Nicht einfach durchklicken“: x von y beim ersten Versuch richtig, nötig z
  // eigenerText (optional) ersetzt den Standardtext aus INHALTE.allgemein.durchklickenText
  function durchklickenElement(x, y, z, neuStarten, eigenerText) {
    var box = element('section', 'durchklicken');
    box.setAttribute('role', 'alert');
    box.appendChild(element('h2', null, A.durchklickenTitel));
    box.appendChild(element('p', null, ersetzen(eigenerText || A.durchklickenText, { x: x, y: y, z: z })));
    box.appendChild(knopf(A.durchklickenKnopf, 'knopf-zweit', neuStarten));
    return box;
  }

  /* ---------- Schutz gegen Raten (wie im ILS): Leben ❤️ und Lesetempo ----------
     Aktiv nur, wenn die Texte INHALTE.allgemein.schutz haben (Woche 1) – sonst null, die Übung läuft wie bisher.
     holen(): liefert den aktuellen Zustand der Übung (dort steht der Schutz unter .s), speichern(): sichert ihn.
     - Leben: C.leben Fehler sind erlaubt. Beim nächsten Fehler → Lesepause (C.fehlerPauseSek), danach von vorn.
     - Lesetempo: Antwort früher als die Lesezeit (Wörter × Zeit, höchstens maxMs) → zählt nicht, Warnung.
       Nach C.warnungenMax Warnungen → kurze Lesepause (C.tempoPauseSek), danach an derselben Stelle weiter.
     window.KB1_ZEITFAKTOR (nur in den Tests) verkürzt alle Zeiten, z. B. 0 = sofort. */
  function schutz(holen, speichern, optionen) {
    var C = A.schutz;
    if (!C) return null;
    optionen = optionen || {};
    var faktor = typeof window.KB1_ZEITFAKTOR === 'number' ? window.KB1_ZEITFAKTOR : 1;
    var leseStart = 0, leseNoetig = 0;
    function st() {
      var z = holen();
      if (!z.s || typeof z.s.fehler !== 'number') z.s = { fehler: 0, warnungen: 0, grund: '', pauseBis: 0, neustarts: 0 };
      return z.s;
    }
    function woerter(t) {
      return String(t || '').replace(/<[^>]+>|\*\*/g, ' ').split(/\s+/).filter(Boolean).length;
    }
    function pauseStarten(grund, sek) {
      var s = st();
      s.grund = grund;
      s.pauseBis = Date.now() + faktor * sek * 1000;
      s.warnungen = 0;
      if (grund === 'fehler') { s.fehler = 0; s.neustarts++; }
      speichern();
    }
    return {
      // ❤️❤️🤍 – übrige Leben
      herzen: function () {
        var rest = Math.max(0, C.leben - st().fehler);
        var e = element('span', 'herzen', new Array(rest + 1).join('❤️') + new Array(C.leben - rest + 1).join('🤍'));
        e.title = ersetzen(C.herzenTitel, { n: rest });
        e.setAttribute('aria-label', e.title);
        return e;
      },
      // Kopfzeile einer Aufgabe: links ein Text (z. B. „Karte 2 von 9“), rechts die Herzen
      kopf: function (links) {
        var k = element('div', 'schutz-kopf');
        k.appendChild(element('span', null, links || ''));
        k.appendChild(this.herzen());
        return k;
      },
      regel: function () { return formatiert('p', 'schutz-regel', ersetzen(C.regel, { n: C.leben, m: C.leben + 1 })); },
      // Lesezeit starten; folge = nur eine Rückmeldung/ein Rest lesen (kürzer)
      lesen: function () {
        var teile = Array.prototype.slice.call(arguments);
        var folge = teile.length && teile[teile.length - 1] === true;
        if (folge) teile.pop();
        var w = woerter(teile.join(' '));
        leseStart = Date.now();
        leseNoetig = faktor * (folge ? C.folgeBasisMs + w * C.folgeProWortMs
          : Math.min(optionen.maxMs || C.lesenMaxMs, C.lesenBasisMs + w * C.lesenProWortMs));
      },
      // Vor jeder Antwort fragen: true = zu schnell (die Antwort zählt nicht; Warnung oder Lesepause)
      zuSchnell: function () {
        if (Date.now() - leseStart >= leseNoetig) return false;
        var s = st();
        s.warnungen++;
        if (s.warnungen >= C.warnungenMax) pauseStarten('tempo', C.tempoPauseSek);
        else speichern();
        return true;
      },
      warnungElement: function () {
        var r = element('div', 'rueckmeldung ist-falsch schutz-warnung');
        r.setAttribute('role', 'alert');
        r.appendChild(element('p', 'rueck-titel', ersetzen(C.zuSchnell, { n: st().warnungen, m: C.warnungenMax })));
        return r;
      },
      // Nach einer falschen Antwort: true = alle Leben verbraucht → Lesepause, danach beginnt die Aufgabe von vorn
      fehler: function () {
        var s = st();
        s.fehler++;
        if (s.fehler > C.leben) { pauseStarten('fehler', C.fehlerPauseSek); return true; }
        speichern();
        return false;
      },
      inPause: function () { return !!st().grund; },
      grund: function () { return st().grund; },
      neustarts: function () { return st().neustarts; },
      // Lesepause mit Countdown; danach Knopf „Weiter“ bzw. „Von vorn beginnen“
      pauseElement: function (hilfe, danach) {
        var s = st();
        var tempo = s.grund === 'tempo';
        var box = element('section', 'karte schutz-pause');
        box.setAttribute('role', 'alert');
        box.appendChild(element('h2', null, tempo ? C.tempoTitel : C.fehlerTitel));
        box.appendChild(formatiert('p', null, tempo ? C.tempoText : ersetzen(C.fehlerText, { hilfe: hilfe || '' })));
        var anzeige = element('p', 'schutz-countdown');
        anzeige.setAttribute('aria-live', 'polite');
        box.appendChild(anzeige);
        var b = knopf(tempo ? C.weiterTempo : C.weiterFehler, 'knopf-breit', function () {
          if (Date.now() < s.pauseBis) return;
          s.grund = '';
          s.pauseBis = 0;
          speichern();
          clearInterval(uhr);
          danach();
        });
        box.appendChild(b);
        function ticken() {
          var rest = Math.ceil((s.pauseBis - Date.now()) / 1000);
          if (rest > 0) { anzeige.textContent = ersetzen(C.pauseNoch, { s: rest }); b.disabled = true; }
          else { anzeige.textContent = C.pauseVorbei; b.disabled = false; clearInterval(uhr); }
        }
        var uhr = setInterval(ticken, 250);
        ticken();
        return box;
      },
      // Nach einem Fehler: Knopf ein paar Sekunden sperren („Erklärung lesen … 4“)
      sperren: function (b) {
        var rest = Math.round(faktor * C.weiterNachFehlerSek);
        if (rest <= 0) return;
        var text = b.textContent;
        b.disabled = true;
        b.textContent = ersetzen(C.erklaerungLesen, { s: rest });
        var t = setInterval(function () {
          rest--;
          if (rest <= 0) { clearInterval(t); b.disabled = false; b.textContent = text; }
          else b.textContent = ersetzen(C.erklaerungLesen, { s: rest });
        }, 1000);
      }
    };
  }

  // fehler (optional): Kennungen der Fehler beim ersten Versuch – der Beamer zeigt daraus die häufigsten Fehler
  function melden(seite, geloest, gesamt, status, fehler) {
    if (window.KB1Melden) window.KB1Melden.stand(seite, geloest, gesamt, status, fehler);
  }

  // In der Beamer-Stunde (w1.html, w2.html) setzt die App die Werte selbst (window.KB1_PARAMS), sonst die Adresse
  function urlParam(name) {
    if (window.KB1_PARAMS && Object.prototype.hasOwnProperty.call(window.KB1_PARAMS, name)) return String(window.KB1_PARAMS[name]);
    try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; }
  }

  function mischen(liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function scrollen(el) {
    if (!el || !el.scrollIntoView) return;
    try { el.scrollIntoView({ behavior: ruhig() ? 'auto' : 'smooth', block: 'start' }); } catch (e) { el.scrollIntoView(); }
  }

  /* ---------- Offline-Fähigkeit: Service Worker anmelden ---------- */
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* ohne Offline-Modus weiter */ });
    });
  }

  window.KB1 = {
    Speicher: Speicher,
    Erledigt: Erledigt,
    element: element,
    ersetzen: ersetzen,
    formatiert: formatiert,
    ruhig: ruhig,
    namePruefen: namePruefen,
    zufallsId: zufallsId,
    seiteVorbereiten: seiteVorbereiten,
    fortschrittSetzen: fortschrittSetzen,
    knopf: knopf,
    merksatzElement: merksatzElement,
    durchklickenElement: durchklickenElement,
    schutz: schutz,
    melden: melden,
    urlParam: urlParam,
    mischen: mischen,
    scrollen: scrollen
  };
})();

/* Befunde markieren (Programmlogik – Texte in inhalte.js → markieren; Woche 1: w1/inhalte.js).
   Woche 2: AA1 im Expertenteam · Woche 1: AA1 „Frühzeichen finden“ (Fall Frau Maler).
   Einstellbar in den Texten: seite (Kennung für den Beamer), merksatz/merksatzTitel, pflicht/fehltPflicht.
   Ablauf: Fall (in der Stunden-App aus der Gruppeneinteilung) → Textstellen antippen → „Prüfen“ →
   Rückmeldung (gefunden / übersehen / falsch) → so lange verbessern, bis alles stimmt → Merksatz AA1.
   Schutz gegen Raten: Mehr als T.hoechstensFalsch falsche Markierungen → alles gelöscht, nichts verraten.
   Bewusst KEINE Fallauswahl in der App: Die SuS kommen nur über den QR-Code ihres Expertenblatts zum Fall.
   Woche 1 zusätzlich (K.schutz, wie im ILS): Jedes „Prüfen“ mit Fehlern kostet ein Leben ❤️; sind alle verbraucht →
   Lesepause, danach von vorn. „Prüfen“, bevor man den Text lesen konnte → Warnung, es wird nicht geprüft. */
(function () {
  'use strict';
  var K = window.KB1;
  var el = K.element;
  var T = K.seiteVorbereiten('markieren');
  var SEITE = T.seite || 'w2-markieren';
  var PFLICHT = T.pflicht || 'schock';                       // ohne diese Kategorie: Hinweis beim Prüfen
  var PFLICHT_TEXT = T.fehltPflicht || T.fehltKreislauf;
  var platz = document.getElementById('uebung');

  var fallId = K.urlParam('fall');
  if (!T.faelle[fallId]) fallId = null;

  /* ---------- Zustand je Fall (übersteht Neuladen) ---------- */
  function schluessel() { return 'kb1nf_markieren_' + fallId; }
  function leer(fall) {
    return { gewaehlt: fall.teile.map(function () { return false; }), geprueft: false, versuche: 0, ersteFalsch: null, ersteFehler: null, fertig: false };
  }
  function laden(fall) {
    var z = K.Speicher.sitzung.lesen(schluessel());
    if (!z || !Array.isArray(z.gewaehlt) || z.gewaehlt.length !== fall.teile.length) return leer(fall);
    return z;
  }
  function speichern(z) { K.Speicher.sitzung.schreiben(schluessel(), z); }

  function istTipp(teil) { return teil && typeof teil === 'object'; }
  function istHinweis(teil) { return istTipp(teil) && !!teil.k; }

  /* ---------- Ohne Fall in der Adresse: nur Hinweis auf den QR-Code ---------- */
  function ohneQr() {
    platz.textContent = '';
    var box = el('section', 'karte');
    box.appendChild(el('p', null, T.ohneQr));
    platz.appendChild(box);
    K.fortschrittSetzen(0, 1);
  }

  /* ---------- Fall ---------- */
  function fallZeigen() {
    var fall = T.faelle[fallId];
    var z = laden(fall);
    var hinweise = fall.teile.filter(istHinweis).length;
    var SCH = K.schutz(function () { return z; }, function () { speichern(z); }, { maxMs: 15000 });
    platz.textContent = '';
    if (SCH && SCH.inPause()) {
      platz.appendChild(SCH.pauseElement(T.hilfe, function () { fallZeigen(); K.scrollen(document.querySelector('.inhalt')); }));
      K.fortschrittSetzen(0, hinweise);
      return;
    }
    // von vorn: Markierungen weg; Fehler für den Beamer und der Stand des Schutzes bleiben
    function vonVorn() { var n = leer(fall); n.ersteFehler = z.ersteFehler; n.ersteFalsch = z.ersteFalsch; if (z.s) n.s = z.s; z = n; speichern(z); }
    if (SCH && !z.fertig) platz.appendChild(SCH.regel());

    var karte = el('section', 'karte');
    karte.appendChild(el('h2', null, fall.titel));
    var text = el('p', 'markiertext');
    var knoepfe = [];
    fall.teile.forEach(function (teil, i) {
      if (!istTipp(teil)) {
        String(teil).split('\n').forEach(function (stueck, j) {
          if (j > 0) { text.appendChild(document.createElement('br')); text.appendChild(document.createElement('br')); }
          if (stueck) text.appendChild(document.createTextNode(stueck));
        });
        knoepfe.push(null);
        return;
      }
      var b = el('button', 'markierbar', teil.t);
      b.type = 'button';
      b.setAttribute('aria-pressed', z.gewaehlt[i] ? 'true' : 'false');
      b.addEventListener('click', function () {
        if (z.fertig) return;
        geraten = 0;
        z.gewaehlt[i] = !z.gewaehlt[i];
        z.geprueft = false;
        speichern(z);
        darstellen();
      });
      text.appendChild(b);
      knoepfe.push(b);
    });
    karte.appendChild(text);
    platz.appendChild(karte);

    var legende = el('p', 'klein', T.legende);
    legende.hidden = true;
    platz.appendChild(legende);
    var rueck = el('div', 'rueckmeldung-bereich');
    rueck.setAttribute('aria-live', 'polite');
    platz.appendChild(rueck);
    var erklaerungen = el('ul', 'erklaerliste');
    platz.appendChild(erklaerungen);
    var herzPlatz = el('div');
    platz.appendChild(herzPlatz);
    var pruefKnopf = K.knopf(T.pruefen, '', pruefen);
    platz.appendChild(pruefKnopf);
    var ende = el('div');
    platz.appendChild(ende);
    var unten = el('p', 'klein');
    unten.appendChild(K.knopf(INHALTE.allgemein.nochEinmal, 'knopf-leise', function () { vonVorn(); fallZeigen(); }));
    platz.appendChild(unten);
    if (SCH) SCH.lesen(text.textContent);

    function zaehlen() {
      var gefunden = 0, falsch = 0, kreislauf = false;
      fall.teile.forEach(function (teil, i) {
        if (!istTipp(teil) || !z.gewaehlt[i]) return;
        if (teil.k) { gefunden++; if (teil.k === PFLICHT) kreislauf = true; } else falsch++;
      });
      return { gefunden: gefunden, falsch: falsch, kreislauf: kreislauf };
    }

    var geraten = 0;   // > 0: gerade wegen Ratens zurückgesetzt (Anzahl falscher Markierungen)
    function pausePruefen() {
      if (!SCH.inPause()) return false;
      fallZeigen();
      K.melden(SEITE, 0, hinweise, SCH.grund() === 'fehler' ? 'durchklicken' : 'arbeitet', z.ersteFehler);
      return true;
    }
    function pruefen() {
      if (SCH && SCH.zuSchnell()) {                         // „Prüfen“, bevor man lesen konnte: nicht prüfen
        if (pausePruefen()) return;
        rueck.textContent = '';
        var w = SCH.warnungElement();
        rueck.appendChild(w);
        K.scrollen(w);
        return;
      }
      var e = zaehlen();
      // Schutz gegen Raten: zu viele falsche Markierungen → alles löschen, nichts verraten, von vorn
      if (e.falsch > T.hoechstensFalsch) {
        if (SCH && SCH.fehler()) { vonVorn(); pausePruefen(); return; }   // alle Leben verbraucht
        geraten = e.falsch;
        z.gewaehlt = z.gewaehlt.map(function () { return false; });
        z.geprueft = false;
        speichern(z);
        darstellen(false);
        K.melden(SEITE, 0, hinweise, 'arbeitet', z.ersteFehler);
        K.scrollen(rueck);
        return;
      }
      geraten = 0;
      z.geprueft = true;
      z.versuche++;
      if (z.ersteFalsch === null) z.ersteFalsch = e.falsch;
      // Fehler beim ersten Prüfen (für „Häufige Fehler“ am Beamer): x = falsch markiert, u = übersehen
      if (!Array.isArray(z.ersteFehler)) {
        z.ersteFehler = [];
        fall.teile.forEach(function (teil, i) {
          if (!istTipp(teil)) return;
          if (z.gewaehlt[i] && !teil.k) z.ersteFehler.push('x' + i);
          if (!z.gewaehlt[i] && teil.k) z.ersteFehler.push('u' + i);
        });
      }
      if (e.gefunden === hinweise && e.falsch === 0) z.fertig = true;
      speichern(z);
      if (!z.fertig && SCH && SCH.fehler()) { vonVorn(); pausePruefen(); return; }   // alle Leben verbraucht
      darstellen(true);
      if (SCH && !z.fertig) SCH.lesen(rueck.textContent + ' ' + erklaerungen.textContent, true);   // erst die Rückmeldung lesen
    }

    function darstellen(nachPruefen) {
      var e = zaehlen();
      knoepfe.forEach(function (b, i) {
        if (!b) return;
        var teil = fall.teile[i];
        b.className = 'markierbar';
        b.setAttribute('aria-pressed', z.gewaehlt[i] ? 'true' : 'false');
        if (z.gewaehlt[i]) b.classList.add('gewaehlt');
        if (z.geprueft || z.fertig) {
          if (z.gewaehlt[i] && teil.k) b.classList.add('ok');
          else if (z.gewaehlt[i] && !teil.k) b.classList.add('falsch');
          else if (!z.gewaehlt[i] && teil.k) b.classList.add('fehlt');
        }
        b.disabled = z.fertig;
      });
      legende.hidden = !(z.geprueft || z.fertig);
      rueck.textContent = '';
      erklaerungen.textContent = '';
      ende.textContent = '';
      pruefKnopf.hidden = z.fertig;
      herzPlatz.textContent = '';
      if (SCH && !z.fertig) herzPlatz.appendChild(SCH.kopf(''));
      unten.hidden = !!SCH && !z.fertig;      // mit Leben: kein „Noch einmal“ mitten in der Aufgabe
      K.fortschrittSetzen(e.gefunden, hinweise);

      if (geraten) {
        var r = el('div', 'rueckmeldung falsch');
        r.appendChild(el('p', 'rueck-titel', '✋ ' + T.ratenTitel));
        r.appendChild(el('p', null, K.ersetzen(T.ratenText, { f: geraten })));
        rueck.appendChild(r);
      }
      if (z.geprueft || z.fertig) {
        rueck.appendChild(el('p', 'rueckmeldung ' + (z.fertig ? 'richtig' : 'falsch'), K.ersetzen(T.ergebnis, { x: e.gefunden, y: hinweise, f: e.falsch })));
        if (!z.fertig && !e.kreislauf && PFLICHT_TEXT) rueck.appendChild(el('p', 'rueckmeldung falsch', PFLICHT_TEXT));
        if (!z.fertig) rueck.appendChild(el('p', null, T.weiterSuchen));
        // Erklärungen zu markierten Stellen (richtig und falsch)
        fall.teile.forEach(function (teil, i) {
          if (!istTipp(teil) || !z.gewaehlt[i]) return;
          var li = el('li', teil.k ? 'ok' : 'falsch');
          li.appendChild(el('strong', null, (teil.k ? '✓ ' + T.kategorien[teil.k] : '✗ ' + T.kategorien['']) + ': '));
          li.appendChild(document.createTextNode(teil.w));
          erklaerungen.appendChild(li);
        });
      }
      if (z.fertig) {
        ende.appendChild(el('p', 'rueckmeldung richtig', T.geschafft));
        var m = K.merksatzElement(T.merksatz || 'aa1', T.merksatzTitel || 'Merksatz AA1');
        ende.appendChild(m);
        K.Erledigt.merken(SEITE);
        K.melden(SEITE, hinweise, hinweise, 'fertig', z.ersteFehler);
        if (nachPruefen) setTimeout(function () { K.scrollen(m); }, 50);
      } else if (nachPruefen) {
        K.melden(SEITE, e.gefunden, hinweise, 'arbeitet', z.ersteFehler);
        K.scrollen(rueck);
      }
    }
    darstellen(false);
  }

  if (fallId) fallZeigen(); else ohneQr();
})();

/* AA2 · Schockform-Detektiv (Programmlogik – Texte in inhalte.js → detektiv).
   Je Fall: Schockform wählen (Tipp bei Fehler) → zwei Belege antippen → weiter.
   Danach Monitorvergleich: zwei Zeilen wählen, die die Formen unterscheiden → Merksatz AA2. */
(function () {
  'use strict';
  var K = window.KB1;
  var el = K.element;
  var T = K.seiteVorbereiten('detektiv');
  var SEITE = 'w2-detektiv';
  var SCHL = 'kb1nf_detektiv';
  var platz = document.getElementById('uebung');
  var N = T.faelle.length;
  var GESAMT = N + 1; // Fälle + Monitorvergleich

  function leer() {
    return {
      fall: 0,
      faelle: T.faelle.map(function () { return { falscheFormen: [], formOk: false, belege: [], belegOk: false }; }),
      monitor: { gewaehlt: [], ok: false, falsch: [] }
    };
  }
  var z = K.Speicher.sitzung.lesen(SCHL);
  if (!z || !Array.isArray(z.faelle) || z.faelle.length !== N) z = leer();
  function speichern() { K.Speicher.sitzung.schreiben(SCHL, z); }

  function geloest() {
    var n = z.faelle.filter(function (f) { return f.formOk && f.belegOk; }).length;
    return n + (z.monitor.ok ? 1 : 0);
  }
  function ersterVersuch() {
    return z.faelle.filter(function (f) { return f.formOk && f.falscheFormen.length === 0; }).length;
  }
  function stand() {
    var g = geloest();
    K.fortschrittSetzen(g, GESAMT);
    var fertig = g === GESAMT;
    var status = fertig ? (ersterVersuch() >= T.mindestensErsterVersuch ? 'fertig' : 'durchklicken') : 'arbeitet';
    K.melden(SEITE, g, GESAMT, status);
  }
  function formText(k) { return T.formen.filter(function (f) { return f.kuerzel === k; })[0].text; }

  /* ---------- Ein Fall ---------- */
  function fallZeigen() {
    platz.textContent = '';
    var i = z.fall;
    var fall = T.faelle[i];
    var fz = z.faelle[i];
    var karte = el('section', 'karte');
    karte.appendChild(el('p', 'klein', K.ersetzen(T.fallTitel, { n: i + 1, y: N })));
    var text = el('p', 'markiertext');
    var knoepfe = [];
    fall.teile.forEach(function (teil, j) {
      if (typeof teil === 'string') { text.appendChild(document.createTextNode(teil)); knoepfe.push(null); return; }
      var b = el('button', 'markierbar', teil.t);
      b.type = 'button';
      b.addEventListener('click', function () { belegTippen(j); });
      text.appendChild(b);
      knoepfe.push(b);
    });
    karte.appendChild(text);
    platz.appendChild(karte);

    var formBox = el('section', 'karte');
    formBox.appendChild(el('h2', null, T.formFrage));
    var formKnoepfe = el('div', 'antworten');
    T.formen.forEach(function (f) {
      var b = K.knopf(f.text, 'antwort', function () { formWaehlen(f.kuerzel); });
      b.dataset.kuerzel = f.kuerzel;
      formKnoepfe.appendChild(b);
    });
    formBox.appendChild(formKnoepfe);
    var formRueck = el('div');
    formRueck.setAttribute('aria-live', 'polite');
    formBox.appendChild(formRueck);
    platz.appendChild(formBox);

    var belegBox = el('section', 'karte');
    belegBox.appendChild(el('h2', null, T.belegFrage));
    var belegRueck = el('div');
    belegRueck.setAttribute('aria-live', 'polite');
    belegBox.appendChild(belegRueck);
    platz.appendChild(belegBox);
    var weiter = K.knopf(INHALTE.allgemein.weiter + ' →', '', function () {
      z.fall = i + 1;
      speichern();
      if (z.fall < N) fallZeigen(); else monitorZeigen();
      K.scrollen(document.querySelector('.inhalt'));
    });
    platz.appendChild(weiter);

    function formWaehlen(k) {
      if (fz.formOk) return;
      if (k === fall.form) fz.formOk = true;
      else if (fz.falscheFormen.indexOf(k) === -1) fz.falscheFormen.push(k);
      speichern();
      darstellen();
      stand();
    }
    function belegTippen(j) {
      if (!fz.formOk || fz.belegOk) return;
      var pos = fz.belege.indexOf(j);
      if (pos >= 0) fz.belege.splice(pos, 1); else if (fz.belege.length < 2) fz.belege.push(j);
      fz.letzteFalsch = [];
      if (fz.belege.length === 2) {
        var falsche = fz.belege.filter(function (x) { return fall.teile[x].b !== 'beleg'; });
        if (!falsche.length) fz.belegOk = true;
        else { fz.letzteFalsch = falsche; fz.belege = fz.belege.filter(function (x) { return falsche.indexOf(x) === -1; }); }
      }
      speichern();
      darstellen();
      stand();
    }
    function darstellen() {
      Array.prototype.forEach.call(formKnoepfe.children, function (b) {
        var k = b.dataset.kuerzel;
        b.className = 'knopf antwort';
        if (fz.formOk && k === fall.form) b.classList.add('richtig');
        if (fz.falscheFormen.indexOf(k) >= 0) b.classList.add('falsch');
        b.disabled = fz.formOk || fz.falscheFormen.indexOf(k) >= 0;
      });
      formRueck.textContent = '';
      if (fz.formOk) formRueck.appendChild(el('p', 'rueckmeldung richtig', '✓ ' + INHALTE.allgemein.richtigText + ' ' + formText(fall.form) + '.'));
      else if (fz.falscheFormen.length) {
        var p = el('p', 'rueckmeldung falsch');
        p.appendChild(el('strong', null, '✗ ' + INHALTE.allgemein.tippVorwort + ' '));
        p.appendChild(document.createTextNode(fall.tipp));
        formRueck.appendChild(p);
      }
      belegBox.hidden = !fz.formOk;
      knoepfe.forEach(function (b, j) {
        if (!b) return;
        b.className = 'markierbar';
        b.disabled = !fz.formOk || fz.belegOk;
        if (fz.belege.indexOf(j) >= 0) b.classList.add(fz.belegOk ? 'ok' : 'gewaehlt');
        if ((fz.letzteFalsch || []).indexOf(j) >= 0) b.classList.add('falsch');
      });
      belegRueck.textContent = '';
      (fz.letzteFalsch || []).forEach(function (j) {
        belegRueck.appendChild(el('p', 'rueckmeldung falsch', '„' + fall.teile[j].t + '“ – ' + (fall.teile[j].b === 'schock' ? T.belegSchock : T.belegLeer)));
      });
      if (fz.belegOk) {
        belegRueck.appendChild(el('p', 'rueckmeldung richtig', '✓ ' + T.belegRichtig));
        belegRueck.appendChild(el('p', null, fall.erklaerung));
      }
      weiter.hidden = !(fz.formOk && fz.belegOk);
    }
    darstellen();
  }

  /* ---------- Monitorvergleich ---------- */
  function monitorZeigen() {
    platz.textContent = '';
    var M = T.monitor;
    var mz = z.monitor;
    var box = el('section', 'karte');
    box.appendChild(el('h2', null, M.titel));
    box.appendChild(K.formatiert('p', null, M.text));
    var tab = el('div', 'monitorvergleich');
    var kopf = el('div', 'mv-zeile mv-kopf');
    kopf.appendChild(el('span', null, ''));
    kopf.appendChild(el('span', null, M.links));
    kopf.appendChild(el('span', null, M.rechts));
    tab.appendChild(kopf);
    var zeilen = M.zeilen.map(function (zz, i) {
      var b = el('button', 'mv-zeile');
      b.type = 'button';
      b.appendChild(el('strong', null, zz.name));
      b.appendChild(el('span', null, zz.l));
      b.appendChild(el('span', null, zz.r));
      b.addEventListener('click', function () { tippen(i); });
      tab.appendChild(b);
      return b;
    });
    box.appendChild(tab);
    var rueck = el('div');
    rueck.setAttribute('aria-live', 'polite');
    box.appendChild(rueck);
    platz.appendChild(box);
    var ende = el('div');
    platz.appendChild(ende);
    platz.appendChild(K.knopf(INHALTE.allgemein.nochEinmal, 'knopf-leise', function () { z = leer(); speichern(); stand(); fallZeigen(); }));

    function tippen(i) {
      if (mz.ok) return;
      var pos = mz.gewaehlt.indexOf(i);
      if (pos >= 0) mz.gewaehlt.splice(pos, 1); else if (mz.gewaehlt.length < 2) mz.gewaehlt.push(i);
      mz.falsch = [];
      if (mz.gewaehlt.length === 2) {
        var falsche = mz.gewaehlt.filter(function (x) { return !M.zeilen[x].richtig; });
        if (!falsche.length) mz.ok = true;
        else { mz.falsch = falsche; mz.gewaehlt = mz.gewaehlt.filter(function (x) { return falsche.indexOf(x) === -1; }); }
      }
      speichern();
      darstellen(true);
      stand();
    }
    function darstellen(gerade) {
      zeilen.forEach(function (b, i) {
        b.className = 'mv-zeile';
        if (mz.gewaehlt.indexOf(i) >= 0) b.classList.add(mz.ok ? 'ok' : 'gewaehlt');
        if (mz.falsch.indexOf(i) >= 0) b.classList.add('falsch');
        b.disabled = mz.ok;
      });
      rueck.textContent = '';
      mz.falsch.forEach(function (i) { rueck.appendChild(el('p', 'rueckmeldung falsch', M.zeilen[i].name + ': ' + M.zeilen[i].w)); });
      ende.textContent = '';
      if (mz.ok) {
        rueck.appendChild(el('p', 'rueckmeldung richtig', '✓ ' + M.fertig));
        M.zeilen.filter(function (x) { return x.richtig; }).forEach(function (x) { rueck.appendChild(el('p', null, x.name + ': ' + x.w)); });
        if (ersterVersuch() >= T.mindestensErsterVersuch) {
          var m = K.merksatzElement('aa2', 'Merksatz AA2');
          ende.appendChild(m);
          K.Erledigt.merken(SEITE);
          if (gerade) setTimeout(function () { K.scrollen(m); }, 50);
        } else {
          ende.appendChild(K.durchklickenElement(ersterVersuch(), N, T.mindestensErsterVersuch, function () { z = leer(); speichern(); stand(); fallZeigen(); }));
        }
      }
    }
    darstellen(false);
  }

  stand();
  if (z.fall < N) fallZeigen(); else monitorZeigen();
})();

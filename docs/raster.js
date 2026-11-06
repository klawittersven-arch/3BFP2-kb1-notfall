/* AA6 · Bewertungsraster (w2-raster.html) und Hausaufgabe · Selbstkontrolle (w2-transfer.html)
   (Programmlogik – Texte in inhalte.js → raster bzw. transfer).
   Kriterien abhaken → die App zählt Punkte wie im Erwartungshorizont (Obergrenzen, Fehler sperren Kriterien).
   Bei der Hausaufgabe erscheint die Musterlösung je Aufgabe erst nach „Meine Antwort steht auf dem Papier“. */
(function () {
  'use strict';
  var K = window.KB1;
  var el = K.element;
  var istTransfer = document.body.getAttribute('data-seite') === 'w2-transfer';
  var T = K.seiteVorbereiten(istTransfer ? 'transfer' : 'raster');
  var SCHL = istTransfer ? 'kb1nf_transfer' : 'kb1nf_raster';
  var platz = document.getElementById('uebung');

  var z = K.Speicher.sitzung.lesen(SCHL);
  if (!z || typeof z !== 'object' || !z.haken) z = { haken: {}, fehler: {}, offen: {} };
  function speichern() { K.Speicher.sitzung.schreiben(SCHL, z); }

  var gruppen = istTransfer ? T.aufgaben : T.gruppen;
  function gid(g, i) { return istTransfer ? g.nr : 'g' + i; }
  function gesperrt() {
    var s = {};
    (T.fehler || []).forEach(function (f) { if (z.fehler[f.id]) f.sperrt.forEach(function (id) { s[id] = true; }); });
    return s;
  }
  function punkteGruppe(g, i) {
    var sperre = gesperrt();
    var normal = 0, extra = 0;
    g.kriterien.forEach(function (k) {
      if (!z.haken[gid(g, i) + ':' + k.id] || sperre[k.id]) return;
      if (k.extra) extra += k.punkte; else normal += k.punkte;
    });
    if (g.maxMassnahmen) normal = Math.min(normal, g.maxMassnahmen);
    return Math.min(normal + extra, g.max);
  }
  function summe() { return gruppen.reduce(function (s, g, i) { return s + punkteGruppe(g, i); }, 0); }
  function maximum() { return gruppen.reduce(function (s, g) { return s + g.max; }, 0); }
  function zahl(x) { return String(Math.round(x * 10) / 10).replace('.', ','); }

  var gesamtAnzeige = el('p', 'gesamtpunkte');
  gesamtAnzeige.setAttribute('aria-live', 'polite');

  function aufbauen() {
    platz.textContent = '';
    var anzeigen = [];
    gruppen.forEach(function (g, i) {
      var box = el('section', 'karte raster');
      box.appendChild(el('h2', null, istTransfer ? g.nr + ' · ' + g.titel : g.titel));
      var liste = el('div', 'kriterien');
      var gp = el('p', 'gruppenpunkte');

      if (istTransfer && !z.offen[g.nr]) {
        box.appendChild(K.knopf(T.erstSchreiben, 'knopf-zweit knopf-breit', function () { z.offen[g.nr] = true; speichern(); aufbauen(); }));
        platz.appendChild(box);
        return;
      }
      if (istTransfer) {
        var muster = el('div', 'muster');
        muster.appendChild(el('h3', null, T.musterTitel));
        muster.appendChild(K.formatiert('p', null, g.muster));
        box.appendChild(muster);
      }
      g.kriterien.forEach(function (k) {
        var id = gid(g, i) + ':' + k.id;
        var lab = el('label', 'kriterium');
        var cb = el('input');
        cb.type = 'checkbox';
        cb.checked = !!z.haken[id];
        cb.addEventListener('change', function () { z.haken[id] = cb.checked; speichern(); aktualisieren(); });
        lab.appendChild(cb);
        lab.appendChild(el('span', 'kriterium-text', k.text));
        lab.appendChild(el('span', 'kriterium-punkte', '+' + zahl(k.punkte)));
        lab.dataset.kid = k.id;
        liste.appendChild(lab);
      });
      box.appendChild(liste);
      box.appendChild(gp);
      platz.appendChild(box);
      anzeigen.push({ g: g, i: i, gp: gp, liste: liste });
    });

    if (T.fehler && T.fehler.length) {
      var fbox = el('section', 'karte raster fehlerbox');
      fbox.appendChild(el('h2', null, T.fehlerTitel));
      T.fehler.forEach(function (f) {
        var lab = el('label', 'kriterium');
        var cb = el('input');
        cb.type = 'checkbox';
        cb.checked = !!z.fehler[f.id];
        cb.addEventListener('change', function () { z.fehler[f.id] = cb.checked; speichern(); aktualisieren(); });
        lab.appendChild(cb);
        lab.appendChild(el('span', 'kriterium-text', f.text));
        fbox.appendChild(lab);
      });
      platz.appendChild(fbox);
    }

    var unten = el('section', 'karte summe');
    unten.appendChild(gesamtAnzeige);
    unten.appendChild(el('p', null, T.rueckmeldung));
    unten.appendChild(K.knopf(T.zuruecksetzen, 'knopf-leise', function () { z = { haken: {}, fehler: {}, offen: {} }; speichern(); aufbauen(); }));
    platz.appendChild(unten);

    function aktualisieren() {
      var sperre = gesperrt();
      anzeigen.forEach(function (a) {
        a.gp.textContent = zahl(punkteGruppe(a.g, a.i)) + ' / ' + zahl(a.g.max) + ' P.';
        Array.prototype.forEach.call(a.liste.children, function (lab) {
          var aus = !!sperre[lab.dataset.kid];
          lab.classList.toggle('gesperrt', aus);
          var hinweis = lab.querySelector('.gesperrt-hinweis');
          if (aus && !hinweis) lab.appendChild(el('span', 'gesperrt-hinweis', T.gesperrt));
          if (!aus && hinweis) hinweis.remove();
        });
      });
      gesamtAnzeige.textContent = K.ersetzen(T.gesamt, { x: zahl(summe()), y: zahl(maximum()) });
      var geoeffnet = istTransfer ? gruppen.filter(function (g) { return z.offen[g.nr]; }).length : gruppen.length;
      K.fortschrittSetzen(geoeffnet, gruppen.length);
    }
    aktualisieren();
  }
  aufbauen();
})();

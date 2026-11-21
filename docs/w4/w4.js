/* KB I · Woche 4 – gemeinsame Hilfen der Handy-Übungen (unabhängig von Woche 2).
   - Bausteine für die Oberfläche, Uhr, Fortschritt
   - optionaler Raumcode für die Lehreransicht (eigener Worker, siehe config.js).
     Ohne Code oder ohne Netz laufen alle Übungen vollständig allein. */
'use strict';
var A = (function () {
  var CFG = window.W4_CONFIG || { WORKER_URL: '', RAUMCODE_GUELTIG_STUNDEN: 3, SPERRWOERTER: [] };

  /* ---------- Oberfläche ---------- */
  function el(tag, attrs) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'fett') e.appendChild(fett(attrs[k]));
      else if (k === 'klasse') e.className = attrs[k];
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    for (var i = 2; i < arguments.length; i++) {
      var k2 = arguments[i];
      if (k2 === null || k2 === undefined || k2 === false) continue;
      if (Array.isArray(k2)) k2.forEach(function (x) { if (x) e.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); });
      else e.appendChild(typeof k2 === 'string' ? document.createTextNode(k2) : k2);
    }
    return e;
  }
  // **fett** → <strong>
  function fett(text) {
    var f = document.createDocumentFragment();
    String(text).split(/(\*\*[^*]+\*\*)/g).forEach(function (t) {
      if (!t) return;
      if (t.indexOf('**') === 0) f.appendChild(el('strong', { text: t.slice(2, -2) }));
      else f.appendChild(document.createTextNode(t));
    });
    return f;
  }
  function leeren(e) { while (e.firstChild) e.removeChild(e.firstChild); return e; }
  function mischen(a) {
    var b = a.slice();
    for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = b[i]; b[i] = b[j]; b[j] = t; }
    return b;
  }
  function kopf(titel) {
    document.title = titel + ' – KB I Notfallsituationen';
    document.getElementById('kopfzeile').textContent = W4.kopfzeile;
    document.getElementById('titel').textContent = titel;
  }
  function haupt() { return leeren(document.getElementById('haupt')); }
  function fortschritt(nr, gesamt) {
    return el('div', { klasse: 'fortschritt', role: 'status' },
      el('span', { text: nr + ' / ' + gesamt }),
      el('span', { klasse: 'spur' }, el('span', { klasse: 'balken', style: 'width:' + Math.round(100 * nr / gesamt) + '%' })));
  }
  // Zählt herunter; onTick(rest) jede Sekunde, onEnde() bei 0. Rückgabe: { stop }
  function uhr(sekunden, onTick, onEnde) {
    var rest = sekunden, aus = false;
    var t = setInterval(function () {
      if (aus) return;
      rest--;
      if (onTick) onTick(rest);
      if (rest <= 0) { aus = true; clearInterval(t); if (onEnde) onEnde(); }
    }, 1000);
    if (onTick) onTick(rest);
    return { stop: function () { aus = true; clearInterval(t); } };
  }
  function uhrAnzeige(sekunden) {
    var rest = el('span', { klasse: 'rest' });
    var zahl = el('span', { text: sekunden + ' s' });
    var box = el('div', { klasse: 'uhr', 'aria-live': 'off' }, el('span', { text: '⏱' }), el('span', { klasse: 'spur' }, rest), zahl);
    return { box: box, setzen: function (r) { zahl.textContent = Math.max(0, r) + ' s'; rest.style.width = Math.max(0, 100 * r / sekunden) + '%'; } };
  }

  /* ---------- Speicher (freiwillig, nur Bequemlichkeit) ---------- */
  function lesen(k) { try { return JSON.parse(localStorage.getItem('w4-' + k)); } catch (e) { return null; } }
  function schreiben(k, v) { try { localStorage.setItem('w4-' + k, JSON.stringify(v)); } catch (e) { /* ohne Speicher weiter */ } }
  function geraetId() {
    var id = lesen('geraet');
    if (!id || !/^[a-z0-9]{10,40}$/.test(id)) {
      id = ''; var z = 'abcdefghijkmnpqrstuvwxyz23456789';
      for (var i = 0; i < 16; i++) id += z[Math.floor(Math.random() * z.length)];
      schreiben('geraet', id);
    }
    return id;
  }

  /* ---------- Raumcode (freiwillig) ---------- */
  var raum = { code: '', gruppe: '', aktiv: false };
  (function () {
    var r = lesen('raum');
    if (r && r.bis > Date.now()) { raum.code = r.code || ''; raum.gruppe = r.gruppe || ''; }
    var q = new URLSearchParams(location.search).get('raum');
    if (q && /^\d{4}$/.test(q)) raum.code = q;
  })();
  function gruppeOk(name) {
    if (!name) return true;
    if (!/^[A-Za-z0-9ÄÖÜäöüß .\-]{1,20}$/.test(name)) return false;
    var n = name.toLowerCase().replace(/[^a-zäöüß]/g, '').replace(/4/g, 'a');
    return !(CFG.SPERRWOERTER || []).some(function (w) { return n.indexOf(w) >= 0; });
  }
  function mitZeitlimit(p, ms) {
    return Promise.race([p, new Promise(function (_, nein) { setTimeout(function () { nein(new Error('zeit')); }, ms); })]);
  }
  function raumPruefen(code) {
    if (!CFG.WORKER_URL || !/^\d{4}$/.test(code)) return Promise.resolve(false);
    return mitZeitlimit(fetch(CFG.WORKER_URL + '/api/pruefen?raum=' + code, { cache: 'no-store' }).then(function (r) { return r.json(); }), 4000)
      .then(function (d) { return !!(d && d.ok); }).catch(function () { return false; });
  }
  // Baut den aufklappbaren Bereich „Raumcode (freiwillig)“ für den Startbildschirm
  function raumFeld() {
    var code = el('input', { inputmode: 'numeric', maxlength: '4', autocomplete: 'off', placeholder: 'z. B. 4821', id: 'raumcode' });
    code.value = raum.code;
    var gruppe = el('input', { maxlength: '20', autocomplete: 'off', placeholder: 'z. B. Tisch 3', id: 'gruppe' });
    gruppe.value = raum.gruppe;
    var meldung = el('div', { klasse: 'meldung leise' });
    var box = el('details', { klasse: 'raum' },
      el('summary', { text: 'Ihre Lehrkraft zeigt einen Raumcode? (freiwillig)' }),
      el('p', { klasse: 'leise', text: 'Nur ausfüllen, wenn Ihre Lehrkraft einen Code zeigt. Sonst einfach starten – die Übung läuft auch ohne Code.' }),
      el('label', { for: 'raumcode', text: 'Raumcode (4 Ziffern)' }), code,
      el('label', { for: 'gruppe', text: 'Gruppenname (kein echter Name nötig, z. B. „Tisch 3“)' }), gruppe,
      meldung);
    if (raum.code) box.setAttribute('open', '');
    return {
      box: box,
      // prüft und übernimmt die Angaben; ok() wird immer aufgerufen – auch ohne Code
      uebernehmen: function (ok) {
        var c = code.value.trim(), g = gruppe.value.trim();
        if (!c) { raum.code = ''; raum.aktiv = false; ok(); return; }
        if (!/^\d{4}$/.test(c)) { meldung.textContent = 'Der Raumcode hat 4 Ziffern. Oder Feld leer lassen.'; return; }
        if (!gruppeOk(g)) { meldung.textContent = 'Bitte einen anderen Gruppennamen wählen (Buchstaben und Zahlen, höchstens 20 Zeichen).'; return; }
        meldung.textContent = 'Raumcode wird geprüft …';
        raumPruefen(c).then(function (gut) {
          raum.code = c; raum.gruppe = g; raum.aktiv = gut;
          if (gut) schreiben('raum', { code: c, gruppe: g, bis: Date.now() + (CFG.RAUMCODE_GUELTIG_STUNDEN || 3) * 3600000 });
          else { meldung.textContent = 'Raumcode nicht gefunden – die Übung läuft trotzdem.'; }
          setTimeout(ok, gut ? 0 : 1200);
        });
      }
    };
  }
  // Meldet den Stand an die Lehreransicht (nur mit gültigem Raumcode; Fehler werden ignoriert)
  function melden(uebung, daten) {
    if (!raum.aktiv || !CFG.WORKER_URL) return;
    var body = { raum: raum.code, geraet: geraetId(), gruppe: raum.gruppe || '', uebung: uebung };
    Object.keys(daten).forEach(function (k) { body[k] = daten[k]; });
    try {
      fetch(CFG.WORKER_URL + '/api/melden', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true })
        .catch(function () { /* egal */ });
    } catch (e) { /* egal */ }
  }

  /* ---------- Startbildschirm ---------- */
  function start(o) {
    kopf(o.titel);
    var h = haupt();
    var rf = raumFeld();
    var knopf = el('button', { klasse: 'knopf', type: 'button', text: o.knopf || 'Los geht’s' });
    knopf.addEventListener('click', function () { knopf.disabled = true; rf.uebernehmen(function () { o.los(); }); setTimeout(function () { knopf.disabled = false; }, 1500); });
    h.appendChild(el('section', { klasse: 'karte' },
      el('h2', { text: o.titel }),
      (o.absaetze || []).map(function (t) { return typeof t === 'string' ? el('p', { fett: t }) : t; }),
      o.regel ? el('div', { klasse: 'hinweis', fett: o.regel }) : null,
      knopf,
      rf.box));
  }

  /* ---------- Quiz mit Karten (Schon fertig?) ----------
     o.karten: Liste; o.zeigen(karte, box, fertig) baut die Karte und ruft fertig(richtig, erklaerung) auf. */
  function quiz(o) {
    var reihenfolge = o.mischen ? mischen(o.karten) : o.karten.slice();
    var punkte = 0, i = 0, fehler = [];
    function weiter() {
      var h = haupt();
      if (i >= reihenfolge.length) return ende();
      var karte = reihenfolge[i];
      var box = el('section', { klasse: 'karte' });
      h.appendChild(fortschritt(i + 1, reihenfolge.length));
      h.appendChild(box);
      o.zeigen(karte, box, function (richtig, erklaerung) {
        if (richtig) punkte++; else fehler.push(o.kennung ? o.kennung(karte) : String(i + 1));
        box.appendChild(el('div', { klasse: 'rueck ' + (richtig ? 'ok' : 'nein') },
          el('strong', { text: richtig ? '✓ Richtig' : '✗ Leider nicht richtig' }), el('span', { fett: erklaerung || '' })));
        var k = el('button', { klasse: 'knopf', type: 'button', text: i + 1 < reihenfolge.length ? 'Weiter' : 'Ergebnis' });
        k.addEventListener('click', function () { i++; weiter(); window.scrollTo(0, 0); });
        box.appendChild(k);
        k.focus();
        melden(o.uebung, { punkte: punkte, max: reihenfolge.length, fertig: false, fehler: fehler.slice(0, 20) });
      });
    }
    function ende() {
      var h = haupt();
      var gut = punkte >= Math.ceil(reihenfolge.length * 0.75);
      melden(o.uebung, { punkte: punkte, max: reihenfolge.length, fertig: true, gewonnen: gut, fehler: fehler.slice(0, 20) });
      h.appendChild(el('section', { klasse: 'karte ergebnis' },
        el('h2', { text: 'Ergebnis' }),
        el('div', { klasse: 'gross ' + (gut ? 'sieg' : 'niederlage'), text: punkte + ' / ' + reihenfolge.length }),
        el('p', { text: gut ? 'Sehr gut! Das sitzt.' : 'Lesen Sie die Erklärungen und den Merksatz noch einmal – dann neu starten.' }),
        el('button', { klasse: 'knopf', type: 'button', text: 'Noch einmal', onclick: function () { reihenfolge = o.mischen ? mischen(o.karten) : o.karten.slice(); punkte = 0; i = 0; fehler = []; weiter(); } })));
    }
    start({ titel: o.titel, absaetze: [o.einleitung], los: weiter, knopf: 'Start' });
  }

  return { el: el, fett: fett, leeren: leeren, mischen: mischen, kopf: kopf, haupt: haupt, fortschritt: fortschritt, uhr: uhr, uhrAnzeige: uhrAnzeige, start: start, quiz: quiz, melden: melden, raum: raum, lesen: lesen, schreiben: schreiben, geraetId: geraetId, gruppeOk: gruppeOk, CFG: CFG };
})();

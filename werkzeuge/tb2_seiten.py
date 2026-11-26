"""KB I · TB 2 neu ab KW 49: erzeugt die Handy-Übungen docs/tb2/kb1ab02.html … und die Lehrerseiten je Klasse und Woche
(docs/tb2/lehrer-3bfp2-1-kb1w1.html …). Technik und Vorlagen wie im Repository 3BFP2_KB2_Notfall (werkzeuge/seiten_erzeugen.py).
Aufruf (im Hauptverzeichnis): python3 werkzeuge/tb2_seiten.py   (nur nötig, wenn eine Übung oder Woche dazukommt)"""
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / "docs" / "tb2"
IDS = ["kb1ab02", "kb1ab03", "kb1ab04", "kb1ab05", "kb1ab06", "kb1ab07", "kb1ab08", "kb1ab09", "kb1ab10", "kb1ab11", "kb1ab12", "kb1ab13"]
WOCHEN = {"kb1w1": "KB I · TB 2 neu · Woche 1 – Schock: Schockspirale · Schockformen und Lagerung · Anaphylaxie",
          "kb1w2": "KB I · TB 2 neu · Woche 2 – Starke Blutung · Offene Fraktur und Amputat · Vom Auffinden bis zum Rettungsdienst",
          "kb1w3": "KB I · TB 2 neu · Woche 3 – Fremdkörperaspiration · Frakturzeichen nach Sturz · DMS-Kontrolle",
          "kb1w4": "KB I · TB 2 neu · Woche 4 – Komplikationen nach Hüft-TEP · Fast-Track · Übung im Examensstil"}
KLASSEN = {"k1": ("3BFP2/1", "3bfp2-1"), "k2": ("3BFP2/2", "3bfp2-2")}

VORLAGE = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#25434B">
<meta name="referrer" content="no-referrer">
<title>KB I – Notfallsituationen</title>
<link rel="stylesheet" href="style.css">
</head>
<body data-uebung="{id}">
<header class="kopf">
  <p class="kopfzeile" id="kopfzeile"></p>
  <h1 id="titel"></h1>
</header>
<div class="fortschritt" role="status">
  <span id="fortschritt-text"></span>
  <span class="fortschritt-spur" aria-hidden="true"><span class="fortschritt-balken" id="fortschritt-balken"></span></span>
</div>
<main class="inhalt">
  <div id="name-bereich" class="name-bereich" hidden></div>
  <div id="uebung-teil">
    <p class="name-zeile" id="name-zeile" hidden></p>
    <p class="anweisung" id="anweisung"></p>
    <div id="hilfe-platz"></div>
    <div id="karten"></div>
    <div id="merksatz-bereich" hidden></div>
    <button type="button" class="knopf knopf-zweit" id="noch-einmal"></button>
  </div>
</main>
<noscript><p class="inhalt">Bitte aktivieren Sie JavaScript, um die Übung zu bearbeiten.</p></noscript>
<script src="einstellungen.js"></script>
<script src="inhalte.js"></script>
<script src="app.js"></script>
</body>
</html>
"""

LEHRER = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<meta name="robots" content="noindex">
<title>{titel} · Fortschritt</title>
<link rel="stylesheet" href="lehrer.css">
</head>
<body data-raum="{raum}">
<header class="l-kopf">
  <h1>{titel}</h1>
  <p id="l-status" class="l-status" role="status"></p>
</header>
<main id="l-inhalt" class="l-inhalt"></main>
<footer class="l-fuss" id="l-fuss"></footer>
<script src="einstellungen.js"></script>
<script src="inhalte.js"></script>
<script src="lehrer.js"></script>
</body>
</html>
"""

for i in IDS:
    (DOCS / f"{i}.html").write_text(VORLAGE.replace("{id}", i), encoding="utf-8")
lehrerseiten = []
for kk, (kname, kdatei) in KLASSEN.items():
    for woche, titel in WOCHEN.items():
        datei = f"lehrer-{kdatei}-{woche}.html"
        (DOCS / datei).write_text(LEHRER.replace("{raum}", f"{kk}-{woche}").replace("{titel}", f"{kname} · {titel}"), encoding="utf-8")
        lehrerseiten.append(datei)
print("ok:", ", ".join(IDS), "+ Lehrerseiten", ", ".join(lehrerseiten))

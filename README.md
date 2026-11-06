# KB I – Notfallsituationen · Themenblock 2 (3BFP2)

Arbeitsblätter und Smartphone-Übungen für den Themenblock 2 „Notfallsituationen“ im Fach KB I
(generalistische Pflegeausbildung, 2. Ausbildungsjahr, Leitfall „Reanimation – und nicht nur ich war hilflos“).
Die Arbeitsblätter entstehen im Wechsel (Lohner / Klawitter); dieses Repository enthält bisher
**Woche 2 (SW 7): „Schock ist nicht gleich Schock – vergleichen und nach Leitsymptom handeln“**
(3 UStd. am Stück). Weitere Wochen können hier ergänzt werden (Seiten mit Präfix `w3-`, `w4-` …).

## Woche 2 auf einen Blick

| Min. | Aufgabe | Wo? | Sozialform | Examens-/KA-Bezug |
|---|---|---|---|---|
| 0–8 | Einstieg „Ihre Entscheidung, bitte!“ (Runde 1) | 📱 `w2-entscheidung.html?runde=1` | EA → Plenum | Fehlvorstellungen sichtbar machen |
| 8–23 | AA1 Expertenrunde: Befunde markieren, Schockform anhand von 4 Symptomen begründen | 📱 `w2-markieren.html?fall=a/b/c` + Expertenblatt | Gruppenpuzzle (Experten) | KA 3.1 (Wortlaut) |
| 23–43 | AA2 Stammgruppe: Vergleichstabelle, Schockform-Detektiv, Klausurtraining | 📱 `w2-detektiv.html` + ✍️ | Gruppenpuzzle (Stamm) | KA 3.2, 5.5 |
| 43–63 | AA3 Lagerungsparcours auf Yogamatten, Entscheidungsweg | 📱 `w2-lagerung.html` + ✍️ | PA → EA | KA 3.3 (Lagerung begründen) |
| 63–88 | AA4 Notfall-Simulation Anaphylaxie (3 Varianten, Rollen, Protokoll), 4.1 Vergleich Klinik – Pflegeheim | 📱 `w2-simulation.html` + ✍️ | GA (3–4) | Lehrplan CE 06, I.4.a; KA 3.3 |
| 88–100 | AA5 Aufstellung „Wer darf was?“, Stellungnahme Adrenalin | ✍️ + Schilder | Plenum → EA → PA | III.2.b, KA 3.3 |
| 100–115 | AA6 Klausurtraining Transferfall + Peer-Korrektur | ✍️ + 📱 `w2-raster.html` | EA → PA | Examen Mai 2024 T3 8.2 |
| 115–130 | AA7 Placemat „Zurück zu Frau Maler“ (Kausalkette) | ✍️ Placemat A3 | GA (4) | IKL W2 Nr. 5 |
| 130–135 | Check-out: Abstimmung Runde 2, Ich-kann-Liste | 📱 `w2-entscheidung.html?runde=2` | Plenum | – |
| HA | Mini-Examen (20 P., ca. 26 min) mit Selbstkontrolle | ✍️ + 📱 `w2-transfer.html` | EA | Examensformat |

**Nur über QR-Codes:** Jede Übung öffnet sich nur über ihren eigenen QR-Code. Es gibt keine Links zwischen den
Übungen, keine Startseite mit Übersicht, keine Rundenauswahl (Runde 1 und 2 haben je einen QR-Code) und keine
Fallauswahl in AA1 (jedes Expertenblatt hat seinen QR-Code). Ohne Parameter zeigen die Seiten nur „Bitte QR-Code scannen“.

## Dateien

```
arbeitsblatt/
  KB1_W2_Schockformen_SV.docx        Schülerversion (AA1–AA7, Check-out, Hausaufgabe)
  KB1_W2_Schockformen_Anlagen.docx   Expertenblätter A/B/C, Notfallprotokoll, Placemat (A3), 3 Schilder
  KB1_W2_Schockformen_LV_LSG.docx    Lehrerversion: Verlaufsplan, Hinweise, Gruppeneinteilung, Lösungen
  (+ PDF-Fassungen)
docs/                ← alles, was GitHub Pages veröffentlicht (die Web-App)
  inhalte.js           ALLE Texte der Übungen (außer Simulation)
  inhalte_simulation.js  Texte, Werte und Regeln der Notfall-Simulation
  config.js            Adresse des Cloudflare-Workers, Sperrwörter für Vornamen
  index.html (nur Hinweis „QR-Code scannen“, ohne Links), w2-*.html, fortschritt.html (Beamer, nirgends verlinkt)
  *.js, *.css, sw.js   Programmlogik, Gestaltung, Offline-Speicher
worker/src/index.js  ← Cloudflare-Worker: Fortschritt und anonyme Abstimmung am Beamer
wrangler.jsonc       ← Cloudflare-Konfiguration (Projekt „kb1-notfall“)
qr/                  ← QR-Codes für alle Smartphone-Aufgaben
werkzeuge/
  ab_w2.js, ab_w2_texte.js, ab_bausteine.js   erzeugen die drei Word-Dateien
  qr_erzeugen.py, piktogramme.py              QR-Codes und Lagerungs-Piktogramme
  bilder/                                     Schullogo, Symbole (wie Woche 1), Piktogramme
tests/               ← automatische Tests (Playwright, lokaler Worker), Ergebnisse in tests/ergebnisse/
```

## GitHub Pages einschalten (einmalig, ca. 2 Minuten)

1. Auf GitHub im Repository **Settings → Pages** öffnen.
2. „Build and deployment“ → Source: **Deploy from a branch** → Branch: der Branch mit diesen Dateien
   (nach dem Zusammenführen **main**), Ordner **/docs** → **Save**.
3. Nach 1–5 Minuten sind die Seiten erreichbar, z. B.
   https://klawittersven-arch.github.io/3BFP2-kb1-notfall/ – die QR-Codes zeigen bereits auf diese
   Adressen (Groß-/Kleinschreibung wie der Repository-Name).

## Fortschritt und Abstimmung am Beamer

### Einrichtung (einmalig, ca. 5 Minuten – wie bei kb1-diabetes)

Der Verbindungsdienst läuft als Cloudflare-Worker **`kb1-notfall`** unter
**https://kb1-notfall.klawittersven.workers.dev** (steht schon in `docs/config.js`).

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Import a repository**.
2. GitHub-Konto **klawittersven-arch**, Repository **3BFP2-kb1-notfall** wählen (fehlt es: über
   „Configure GitHub App“ der Cloudflare-App Zugriff geben).
3. **Project name `kb1-notfall`** (genau so), Build command leer, Deploy command `npx wrangler deploy`,
   Root directory `/` → **Deploy**.
4. Nach ca. 1 Minute zeigt https://kb1-notfall.klawittersven.workers.dev
   `{"dienst":"KB1 Notfallsituationen (3BFP2) – Fortschritt und Abstimmung","ok":true}`.

### Im Unterricht

1. Am Laptop `…/3BFP2-kb1-notfall/fortschritt.html` öffnen → **„Neuen Raum starten“**. Der Raumcode
   steht groß oben rechts; die SuS geben ihn mit ihrem Vornamen ein (das Handy merkt sich beides 3 Stunden).
2. **Fortschritt** (Spalten AA1–AA4): je Person „x von y gelöst“, ✓ = Merksatz erreicht, ⚠ = zu viel geraten.
3. **Abstimmung** (Knopf unten): „Ihre Entscheidung, bitte!“ – Runde 1 und Runde 2 nebeneinander,
   **ohne Namen**; der helle Teil des Balkens = „sicher“. **Lösung zeigen** markiert die richtigen
   Antworten und blendet die Erklärung ein – erst beim Check-out drücken.
4. Unten: Anweisungen groß einblenden (Einstieg, AA1–AA2, AA3, AA4, Check-out), **Namen verbergen**,
   **Vollbild**, **Liste leeren** (Abstimmung bleibt), **Neuer Raum** (für die Parallelklasse).
5. **Probeansicht ohne Internet:** `…/fortschritt.html?demo=1` (erfundene Namen und Stimmen).

### Datenschutz

- Übungen: Das Handy sendet nur nach Anmeldung `{ Raumcode, Zufalls-Geräte-ID, Vorname, Übung, x, y, Status }`.
- Abstimmung: `{ Raumcode, Zufalls-Geräte-ID, Runde, Antwortbuchstaben, sicher/unsicher }` – **ohne Namen**;
  der Beamer erhält nur die ausgezählten Summen.
- Lesen kann nur der Laptop, der den Raum gestartet hat (geheimer Schlüssel). Nach 6 Stunden löscht der
  Worker den Raum vollständig. Keine Cookies, keine Analyse, keine fremden Schriften oder Skripte;
  Cloudflare-Protokolle sind abgeschaltet. Ohne Anmeldung oder ohne Netz funktionieren alle Übungen normal.

## Texte ändern

- **Übungen:** `docs/inhalte.js` auf GitHub mit dem Stift bearbeiten → „Commit changes“ → nach 1–2 Minuten online.
  Nur Text **zwischen den Hochkommas** ändern; `**Wort**` = fett, `\n` = neue Zeile.
- **Simulation:** `docs/inhalte_simulation.js` (Texte, Startwerte, Verlauf, Bewertungen, Checklisten – im Dateikopf erklärt).
- **Merksätze, Entscheidungsfragen und Lagerungskarten** stehen auch im Arbeitsblatt
  (`werkzeuge/ab_w2_texte.js`). Bei Änderungen beide Stellen anpassen; `tests/inhalte.test.js` meldet Abweichungen.
- **Schutz gegen Durchklicken:** `mindestensErsterVersuch` bzw. `hoechstensFalschErsterVersuch` in `docs/inhalte.js`.
- Nach größeren Änderungen in `docs/sw.js` `VERSION` erhöhen (Offline-Speicher).

## Arbeitsblätter neu erzeugen

```
pip install segno zxing-cpp pillow
python werkzeuge/qr_erzeugen.py
python werkzeuge/piktogramme.py
node werkzeuge/ab_w2.js
soffice --headless --convert-to pdf --outdir arbeitsblatt arbeitsblatt/*.docx
```

## Tests

```
cd worker && npm install && cd ..
cd tests
node inhalte.test.js       # Arbeitsblatt ↔ App, Offline-Liste, QR-Codes (ohne Browser)
node uebungen.test.js      # alle Übungen in Handygröße 390 × 844
node simulation.test.js    # Notfall-Simulation: drei Varianten, Fehlerpfade, Merksatz
node fortschritt.test.js   # Beamer: Raum, Anmeldung, Fortschritt, Abstimmung (lokaler Worker)
```
Playwright und Chromium sind in der Testumgebung vorinstalliert; sonst `npm install` und `npx playwright install chromium`.

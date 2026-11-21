# KB I · Woche 4 (SW 9): Wirbelsäulenverletzung, innere Blutung, Atemwege

Eigene Dateien für Woche 4 – **Woche 1 und 2 bleiben unverändert** (keine Änderung an `docs/*.html`, `docs/sw.js`,
`docs/gemeinsam.js`, `worker/`, `wrangler.jsonc`, `werkzeuge/ab_w2*.js`, `werkzeuge/ab_bausteine.js`, `analog/`).

**Die Stunde funktioniert vollständig auf Papier.** Die Handy-Übungen starten die SuS selbst über die QR-Codes auf dem
Arbeitsblatt – ohne Beamer, ohne Anmeldung. Eine Lehreransicht ist freiwillig.

## Arbeitsblätter

| Datei | Inhalt |
|---|---|
| `arbeitsblatt/KB1_W4_Wirbelsaeule_Blutung_SV.docx/.pdf` | Schülerversion: 3 Blätter je 2 Seiten (6 Seiten), beidseitig kopieren, nacheinander austeilen |
| `arbeitsblatt/KB1_W4_Wirbelsaeule_Blutung_LV_LSG.docx/.pdf` | Lehrerversion: Verlaufsplan (135 min), Hinweise, Klausur- und Examensbezug, Lösungen (gelb), **Anhang A** Messkarten, **Anhang B** Simulation ohne Handy |

- **Blatt 1 – Wirbelsäulenverletzung: nicht bewegen – aber richtig** · Methodenwechsel: Übung „Kopf halten und achsengerecht drehen“ (Vierergruppen, auf dem Boden oder auf Isomatten) → AA4 (Muster KA 5.3)
- **Blatt 2 – Innere Blutung: den Verlauf im Blick** · Methodenwechsel: Live-Verlauf „Frühdienst – drei Patienten, eine Ampel“ – **analog** (Messkarten; sitzen 🟢 / Hand heben 🟡 / aufstehen 🔴) **oder am Handy** (`w4/verlauf.html`), freie Wahl der Lehrkraft → AA2
- **Blatt 3 – Atemwege: wenn etwas im Hals stecken bleibt** · Methodenwechsel: Handy-Simulation „Notfall-Ampel im Speisesaal“ (ohne Handy: Plenumsspiel, Anhang B) → AA3 (Muster KA 4.1)

## Adressen (nach dem Zusammenführen in `main` über GitHub Pages online)

| Adresse | wofür |
|---|---|
| …/3BFP2-kb1-notfall/w4/verlauf.html | Blatt 2: Live-Verlauf am Handy (Gewinnen: Finn rechtzeitig gemeldet, höchstens 1 Fehlalarm) |
| …/w4/speisesaal.html | Blatt 3: Simulation (Bestanden: niemand bewusstlos, höchstens 1 Fehlalarm) |
| …/w4/rueckenmark.html · trend.html · atemweg.html | „Schon fertig?“ am Ende von Blatt 1, 2 und 3 |
| …/w4/lehrer.html | Lehreransicht (freiwillig): Raum starten, Ergebnisse je Gruppe, häufige Fehlentscheidungen; „Messkarten groß“ (ohne Server) |
| …/w4/lehrer.html?demo=1 | Probeansicht mit erfundenen Gruppen (ohne Internet) |

Alle Seiten der Woche 4 liegen im Unterordner `docs/w4/`. So bleibt `docs/sw.js` (Offline-Speicher der Woche 2)
unverändert, und die Tests der Woche 2 laufen weiter.

## Lehreransicht einrichten (einmalig, ca. 10 Minuten)

Die Lehreransicht braucht einen **eigenen** kleinen Cloudflare-Worker `kb1-notfall-w4` (Dateien `worker-w4/`,
`wrangler-w4.jsonc`). Der Worker der Woche 2 (`kb1-notfall`, `wrangler.jsonc`) bleibt unverändert und unberührt.

1. Zuerst den Branch in `main` zusammenführen.
2. Cloudflare-Dashboard → **Workers & Pages** → **Erstellen** → **Repository importieren** (GitHub) → dieses Repository wählen.
3. Projektname: `kb1-notfall-w4` · Produktionszweig: `main` · Build-Befehl: leer lassen ·
   **Deploy-Befehl: `npx wrangler deploy --config wrangler-w4.jsonc`** · Stammverzeichnis: `/`.
4. Speichern und bereitstellen. Die Adresse lautet dann `https://kb1-notfall-w4.<Ihr-Konto>.workers.dev`.
   Steht dort nicht `klawittersven`, die Adresse in `docs/w4/config.js` (`WORKER_URL`) anpassen.
5. Test: `…/w4/lehrer.html` öffnen → „Neuen Raum starten“ → Code erscheint.

Alternativ von einem Rechner aus: `cd worker && npm install && npx wrangler login && npx wrangler deploy --config ../wrangler-w4.jsonc`.

Ohne eingerichteten Worker passiert nichts Schlimmes: Der Raumcode ist auf den Handys nur ein aufklappbares, freiwilliges
Feld; bei einem unbekannten Code läuft die Übung trotzdem.

**Datenschutz:** Zufalls-Geräte-ID, freiwilliger Gruppenname (kein echter Name nötig, Sperrwörter-Filter), Punkte,
Fehlalarme und Kennungen falscher Entscheidungen (z. B. `k5-rot`). Nach 6 Stunden löscht der Worker den Raum. Keine
Cookies, keine fremden Skripte oder Schriften, Cloudflare-Protokolle aus.

## Texte ändern und neu erzeugen

- **Messkarten, Simulationsszenen, Handy-Übungen:** `docs/w4/inhalte.js` (eine Quelle für Handy, Lehreransicht und die Anhänge der Lehrerversion)
- **Arbeitsblatt-Texte, Aufgaben, Lösungen:** `werkzeuge/ab_w4_texte.js` · Layout, Verlaufsplan, Hinweise: `werkzeuge/ab_w4.js`

```
node werkzeuge/w4_bilder.js      # Kurve, Wirbelsäule, Atemwege (PNG)
node werkzeuge/qr_w4.js          # QR-Codes qr/qr_w4_*.png
node werkzeuge/ab_w4.js          # SV und LV_LSG (.docx)
soffice --headless --convert-to pdf --outdir arbeitsblatt arbeitsblatt/KB1_W4_*.docx
```

Nach Textänderungen die Seitenzahl prüfen: Die Schülerversion muss bei 6 Seiten bleiben (jedes Blatt beginnt auf S. 1, 3, 5).

## Tests

```
cd worker && npm install && cd ..
cd tests && node w4.test.js
```

Prüft u. a.: Messkarten und Szenen (Gewinn- und Verlustbedingungen), keine Wörter wie „Klausur“ oder „Examen“ in Texten für die SuS,
Lösungen nur in der Lehrerversion, 6 Seiten, QR-Codes, dass nur Dateien der Woche 4 geändert sind, alle Übungen in Handygröße
(gewinnen, verlieren, Zeit abgelaufen, Sättigung sinkt, bewusstlos) und die Lehreransicht mit lokalem Worker.

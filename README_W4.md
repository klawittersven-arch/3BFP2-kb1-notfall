# KB I · Woche 4 (SW 9): Wirbelsäulenverletzung, innere Blutung, Atemwege

Eigene Dateien für Woche 4 – **Woche 1 und 2 bleiben unverändert** (keine Änderung an `docs/*.html`, `docs/sw.js`,
`docs/gemeinsam.js`, `worker/`, `wrangler.jsonc`, `werkzeuge/ab_w2*.js`, `werkzeuge/ab_bausteine.js`, `analog/`).

**Die Stunde funktioniert vollständig auf Papier.** Die Handy-Übungen starten die SuS selbst über die QR-Codes auf dem
Arbeitsblatt – ohne Beamer, ohne Anmeldung. Eine Lehreransicht ist freiwillig.

## Arbeitsblätter

Es gibt **zwei Fassungen** mit denselben Aufgaben im KA-Format – die Lehrkraft wählt:

| Datei | Inhalt |
|---|---|
| `arbeitsblatt/KB1_W4_Wirbelsaeule_Blutung_analog_SV.docx/.pdf` | **Analog**, ganz ohne Smartphone: Blatt 2 als Ankreuz-Aufgabe (fünf Messungen, Finns Kurve), Blatt 3 mit Lesetext „Wenn etwas im Hals stecken bleibt“ auf dem Blatt; „Schon fertig?“ bzw. „Für die Schnellen“ als Zusatzaufgaben (Antworten auf ein Extrablatt). 3 Blätter, **7 Seiten** (Blatt 3: S. 5–7) |
| `arbeitsblatt/KB1_W4_Wirbelsaeule_Blutung_analog_LV_LSG.docx/.pdf` | Lehrerversion analog: Verlaufsplan (135 min), Hinweise, Klausur- und Examensbezug, Lösungen (gelb) (Punkte stehen nur hier, nicht auf dem Arbeitsblatt) |
| `arbeitsblatt/KB1_W4_Wirbelsaeule_Blutung_digital_SV.docx/.pdf` | **Digital**: Live-Verlauf am Smartphone; Blatt 3: „Wo ist was?“ am Handy (Teile antippen) liefert die Wörter für den Infotext als Lückentext, Lesetext per QR-Code (mit Bildern); „Schon fertig?“ mit QR-Code, unten auf Blatt 3 „Für die Schnellen“ (3.2, 3.3, Atemweg-Check, Simulation); keine analogen Alternativen auf dem Blatt. 6 Seiten |
| `arbeitsblatt/KB1_W4_Wirbelsaeule_Blutung_digital_LV_LSG.docx/.pdf` | Lehrerversion digital: Verlaufsplan, Hinweise (u. a. freiwillige Lehreransicht ohne Raumcode), Lösungen |
| `arbeitsblatt/KB1_W4_Wirbelsaeule_Blutung_{analog,digital}_SV_markiert.docx/.pdf` | **Ansichtsexemplar für die Lehrkraft (nicht austeilen):** Schülerversion mit Textmarker – **gelb** = direkt klausurrelevant, **pink** = könnte gestrichen werden, ohne Markierung = unterstützend. Zuordnung in `werkzeuge/ab_w4.js` (`MARKE`) |

- **Blatt 1 – Wirbelsäulenverletzung: nicht bewegen – aber richtig** · Methodenwechsel: Übung „Kopf halten und achsengerecht drehen“ (Vierergruppen, auf dem Boden oder auf Isomatten) → AA4 (Muster KA 5.3) · AA2: analog Fälle A–C zuordnen, digital Rückenmark-Check am Handy (`w4/rueckenmark.html`) mit der Höhen-Tabelle als Hilfe auf dem Blatt
- **Blatt 2 – Innere Blutung: den Verlauf im Blick** · AA1 „Frühdienst mit Ampel“ – analog als Ankreuz-Aufgabe in Einzelarbeit (fünf Messungen in gemischter Dringlichkeit, dann Finns Kurve), digital als Live-Verlauf am Handy (`w4/verlauf.html`) → AA2
- **Blatt 3 – Atemwege: wenn etwas im Hals stecken bleibt** · AA1: analog Bild beschriften (Wortspeicher); digital „Wo ist was?“ am Handy (`w4/anatomie.html`) → die Lösungswörter kommen in den Infotext als Lückentext · AA2 „leicht oder schwer?“: Informationen aus einem längeren Lesetext (nicht in Tabellenreihenfolge, mit Ablenkern) in die Tabelle – analog auf dem Blatt, digital am Handy (`w4/verlegung.html`); kein Merksatz dazu (sonst würde nur abgeschrieben) → AA3 nur 3.1 (Muster KA 4.1) mit viel Schreibraum · „Für die Schnellen“: 3.2, 3.3 (analog dazu 3.4) auf ein Extrablatt, digital zusätzlich Atemweg-Check und Simulation „Notfall-Ampel im Speisesaal“

## Adressen (nach dem Zusammenführen in `main` über GitHub Pages online)

| Adresse | wofür |
|---|---|
| …/3BFP2-kb1-notfall/w4/verlauf.html | Blatt 2: Live-Verlauf am Handy (Gewinnen: Finn rechtzeitig gemeldet, höchstens 1 Fehlalarm) |
| …/w4/anatomie.html | Blatt 3, AA1 (digital): „Wo ist was?“ – Teile der Atemwege antippen, bei einem Fehler von vorn; alles richtig → Wörter für den Lückentext |
| …/w4/verlegung.html | Blatt 3, AA2: Lesetext „Wenn etwas im Hals stecken bleibt“ mit drei Bildern (digitale Fassung) |
| …/w4/speisesaal.html | Blatt 3, „Für die Schnellen“: Simulation (Bestanden: niemand bewusstlos, höchstens 1 Fehlalarm) |
| …/w4/rueckenmark.html | Blatt 1, AA2 (digital): Rückenmark-Check – acht kurze Fälle |
| …/w4/trend.html · atemweg.html | „Schon fertig?“ am Ende von Blatt 2, Atemweg-Check bei „Für die Schnellen“ auf Blatt 3 |
| …/w4/lehrer.html | Lehreransicht (freiwillig): **Fortschritt der letzten 45 Minuten – ohne Raumcode, ohne Namen** (je Übung ein Balken pro Handy, grün = fertig); „Messkarten groß“ für die Besprechung (ohne Server) |
| …/w4/lehrer.html?demo=1 | Probeansicht mit erfundenen Gruppen (ohne Internet) |

Alle Seiten der Woche 4 liegen im Unterordner `docs/w4/`. So bleibt `docs/sw.js` (Offline-Speicher der Woche 2)
unverändert, und die Tests der Woche 2 laufen weiter.

## Lehreransicht einrichten (einmalig, ca. 10 Minuten)

Die Lehreransicht braucht einen **eigenen** kleinen Cloudflare-Worker `kb1-notfall-w4`. Er liegt mit eigener
Konfiguration im Ordner `worker-w4/` (`worker-w4/wrangler.jsonc`, `worker-w4/src/index.js`). Der Worker der Woche 2
(`kb1-notfall`, `wrangler.jsonc` im Hauptordner) bleibt unverändert und unberührt.

Voraussetzung: Der Ordner `worker-w4/` ist in `main` (Branch zusammengeführt).

1. Cloudflare-Dashboard → **Workers & Pages** → **Create application**.
2. **GitHub** wählen (das Konto ist schon verbunden, weil der Worker der Woche 2 aus diesem Repository gebaut wird)
   und das Repository **3BFP2-kb1-notfall** auswählen.
3. Einstellungen:
   - **Name des Workers: `kb1-notfall-w4`** – genau so, sonst bricht der Build ab
     („The name in your Wrangler configuration file … must match the name of your Worker“).
   - **Git branch** (Produktionszweig): `main`
   - **Build command:** leer lassen
   - **Deploy command:** `npx wrangler deploy` (Standard lassen)
   - **Root directory: `/worker-w4`** (steht ggf. unter den erweiterten Einstellungen)
4. **Save and Deploy** und warten, bis der Build grün ist (1–2 Minuten).
5. Test: `https://kb1-notfall-w4.klawittersven.workers.dev` öffnen → Antwort
   `{"dienst":"KB1 Woche 4 (3BFP2) – Lehreransicht","ok":true}`.
   Steht in der Adresse statt `klawittersven` etwas anderes, die Adresse in `docs/w4/config.js` (`WORKER_URL`) anpassen.
6. `…/w4/lehrer.html` öffnen → „Wer ist wie weit?“ erscheint (zuerst „noch niemand“). Sobald ein Handy eine Übung startet, kommt ein Balken dazu.

Ab dann baut Cloudflare beide Worker bei jeder Änderung in `main` neu – das ist normal und ändert an Woche 2 nichts.

Alternativ von einem Rechner mit Node.js aus: `cd worker-w4 && npx wrangler login && npx wrangler deploy`.

Ohne eingerichteten Worker passiert nichts Schlimmes: Die Übungen laufen ganz normal, die Lehreransicht zeigt dann nur „Dienst nicht erreichbar“.

**Datenschutz:** Kein Raumcode, keine Namen. Die Handys senden nur eine zufällige Geräte-ID, die Übung, „Schritt x von n“ und „fertig“ – keine Antworten, keine Punkte. Die Geräte-ID wird nie angezeigt; 60 Minuten nach der letzten Meldung löscht der Worker den Eintrag (`LOESCHEN_NACH_MINUTEN` in `worker-w4/wrangler.jsonc`). Keine Cookies, keine fremden Skripte oder Schriften, Cloudflare-Protokolle aus. Gezählt wird jedes Handy, das die Adresse in dieser Zeit nutzt – auch aus einer anderen Klasse.

War der Worker schon mit der früheren Raumcode-Fassung eingerichtet: einfach neu bauen lassen (Zusammenführen in `main` genügt). Die Migration `v2` benennt den Speicher um; alte Räume verschwinden.

## Texte ändern und neu erzeugen

- **Messkarten, Texte von Blatt 3 (Infotext/Lückentext, Lesetext), Simulationsszenen, Handy-Übungen:** `docs/w4/inhalte.js` (eine Quelle für Handy, Lehreransicht und Arbeitsblatt)
- **Bild der Atemwege:** `docs/w4/atemwege_bild.js` (eine Quelle für das Arbeitsblatt-Bild und „Wo ist was?“)
- **Arbeitsblatt-Texte, Aufgaben, Lösungen:** `werkzeuge/ab_w4_texte.js` · Layout, Verlaufsplan, Hinweise: `werkzeuge/ab_w4.js`

```
node werkzeuge/w4_bilder.js      # Kurve, Wirbelsäule, Atemwege (PNG)
node werkzeuge/qr_w4.js          # QR-Codes qr/qr_w4_*.png
node werkzeuge/ab_w4.js          # SV und LV_LSG (.docx)
soffice --headless --convert-to pdf --outdir arbeitsblatt arbeitsblatt/KB1_W4_*.docx   # erzeugt analog und digital
```

Nach Textänderungen die Seitenzahl prüfen: digital 6 Seiten, analog 7 Seiten (jedes Blatt beginnt auf S. 1, 3, 5).

## Tests

```
cd worker && npm install && cd ..
cd tests && node w4.test.js
```

Prüft u. a.: Messkarten und Szenen (Gewinn- und Verlustbedingungen), keine Wörter wie „Klausur“ oder „Examen“ in Texten für die SuS,
Lösungen und Punkte nur in der Lehrerversion, 6 bzw. 7 Seiten, QR-Codes, dass nur Dateien der Woche 4 geändert sind, alle Übungen in Handygröße
(gewinnen, verlieren, Zeit abgelaufen, Sättigung sinkt, bewusstlos) und die Lehreransicht mit lokalem Worker.

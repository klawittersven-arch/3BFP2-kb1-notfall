# Papierfassung ohne Handys und Beamer – KB I, Woche 2 „Schock ist nicht gleich Schock“

Eigenständiges Projekt: Die Stunde komplett auf Papier, als Option für Kolleginnen und Kollegen, die nicht
nebenher den Beamer steuern und die Handys im Blick behalten wollen.

**Unabhängig von der digitalen Fassung:** Dieser Ordner nutzt keine Datei außerhalb von `analog/`. Texte,
Übungsdaten, Layout-Bausteine und Bilder sind Kopien vom 7.11.2026. Änderungen hier wirken nicht auf die
digitale Stunde (Beamer, Handy, Arbeitsblatt in `arbeitsblatt/`) – und Änderungen dort nicht auf diese Fassung.
GitHub Pages veröffentlicht nur `docs/`; dieser Ordner wird nicht veröffentlicht.

## Dateien

```
arbeitsblatt/
  KB1_W2_Schockformen_analog_SV.docx        Arbeitsblatt (12 Seiten): AB1 S. 1–4, AB2 S. 5–8, AB3 S. 9–10, Korrekturbogen S. 11–12
  KB1_W2_Schockformen_analog_Anlagen.docx   Expertenblätter, Kontrollkarten, Lösungskarten 1–4, Loskarten, Tischschilder
  KB1_W2_Schockformen_analog_LV_LSG.docx    Lehrerversion: Verlaufsplan, Tafelbild, Kopierliste, Lösungen fürs Plenum, AB mit Lösungen
  (+ PDF-Fassungen)
daten/       texte.js (Fälle, Aufgaben, Lösungen, Merksätze), inhalte.js und inhalte_stunde.js (Übungsdaten)
werkzeuge/   ab_w2_analog.js (erzeugt die drei Dokumente), bausteine.js (Layout)
bilder/      Logo, Symbole, Lagerungsbilder
tests/       analog.test.js
```

## Was in der digitalen Fassung Handy und Beamer machen – hier auf Papier

| Digital | Papier |
|---|---|
| Abstimmen am Handy (Einstieg, Check-out, Wer darf was?) | Ankreuzen auf dem AB, Handzeichen, Strichliste an der Tafel |
| Gruppen per Knopfdruck | Loskarten (fertig eingeteilt für 3BFP2.1 und 3BFP2.2) und Tischschilder |
| Fall markieren, Experten-Check am Handy | Expertenblatt: unterstreichen und ankreuzen, dann Kontrollkarte auf dem Tisch |
| Detektiv, Lagerungs-Quiz am Handy | Ankreuzen auf dem AB, Auflösung im Plenum (Lösungen in der LV) |
| Musterlösungen am Beamer | Lösungskarten 1–4, eine pro Stammgruppe |
| Bewertungsraster, Selbstkontrolle am Handy | Korrekturbogen (Rückseite: Selbstkontrolle der Hausaufgabe) |
| Kausalkette am Beamer | an der Tafel entwickeln (Tafelbild in der LV) |

Zeitplan: 0–12 Einstieg · 12–31 Expertenteams · 31–48 Stammgruppen · 48–64 Detektiv und 2.1/2.2 · 64–85 Lagerung ·
85–99 AA4 · 99–113 AA5 · 113–119 AA6 · 119–127 Puffer · 127–135 Check-out.
Nicht fertig geworden? In der Folgewoche einfach mit dem nächsten Arbeitsblatt weitermachen.

## Neu erzeugen und testen

```
cd analog
node werkzeuge/ab_w2_analog.js
soffice --headless --convert-to pdf --outdir arbeitsblatt arbeitsblatt/*.docx
cd tests && node analog.test.js
```

# KB I · TB 2 neu ab KW 49 – Handy-Übungen „Für die Schnellen“

Neuplanung des Themenblocks 2 (Klassenarbeit am **Di 12.01.2027**): kurze Arbeitsblätter (je 45 min, 3 pro Woche).
Auf jedem Blatt steht unten ein QR-Kasten **„Für die Schnellen (freiwillig)“**. Das Papier allein bereitet vollständig
auf die Klassenarbeit vor – der Kasten darf also auch gelöscht werden.

- Die SuS starten die Übung **selbst** über den QR-Code – kein Raumcode, kein Beamer-Start.
- Beim ersten Öffnen: **Vorname + Anfangsbuchstabe** und **Klasse** (3BFP2/1 oder 3BFP2/2). Das Handy merkt sich beides –
  **auch für die KB-II-Übungen** (gleiche Adresse `klawittersven-arch.github.io`, gleicher Speicher-Schlüssel).
- Technik: Kopie der KB-II-Übungen (Repository `3BFP2_KB2_Notfall`, `docs/app.js`, `lehrer.js`, CSS) in `docs/tb2/`.
  Fortschritt geht an **denselben Worker** wie KB II (`kb2-notfall-fortschritt`, Räume `k1-kb1w1` … `k2-kb1w4`).
  Dafür muss in `3BFP2_KB2_Notfall` der Branch `tb2-neu-kw49` (erweitertes Raummuster) in `main` gemergt sein.
  Bis dahin laufen die Übungen trotzdem – nur die Lehrerseite zeigt keine Namen.
- Datenschutz wie bei KB II: Name, Klasse, Fortschritt, falsche Erstversuche; Löschung nach 12 Stunden oder „Liste leeren“.

## Woche 1 (Mo 30.11.2026)

| Arbeitsblatt | Übung | Adresse (QR-Code in `qr/`) |
|---|---|---|
| Schock: Schockspirale und Schockzeichen | Früh- oder Spätzeichen? | https://klawittersven-arch.github.io/3BFP2-kb1-notfall/tb2/kb1ab02.html |
| Schockformen und Lagerung nach Leitsymptom | Welche Lagerung passt? | …/tb2/kb1ab03.html |
| Anaphylaktischer Schock | Anaphylaxie – was tun Sie? | …/tb2/kb1ab04.html |

**Lehrerseiten Woche 1** (alle drei Übungen auf einer Seite, ohne Kennwort, `noindex`):
- 3BFP2/1: https://klawittersven-arch.github.io/3BFP2-kb1-notfall/tb2/lehrer-3bfp2-1-kb1w1.html
- 3BFP2/2: https://klawittersven-arch.github.io/3BFP2-kb1-notfall/tb2/lehrer-3bfp2-2-kb1w1.html

## Neue Woche ergänzen

1. Übungen in `docs/tb2/inhalte.js` mit `raum: 'kb1w2'` usw. eintragen (Aufbau wie in der Datei beschrieben).
2. Kennungen und Woche in `werkzeuge/tb2_seiten.py` (`IDS`, `WOCHEN`) ergänzen → `python3 werkzeuge/tb2_seiten.py`.
3. QR-Codes: Adresse in `werkzeuge/tb2_qr.js` ergänzen → `node werkzeuge/tb2_qr.js`.
4. Test: `node tests/tb2.test.js` (IDS dort ergänzen).

Die Wochen 1–4 der bisherigen Stunden-App (Beamer-Räume, `docs/w1`, `docs/w4`) bleiben unverändert.

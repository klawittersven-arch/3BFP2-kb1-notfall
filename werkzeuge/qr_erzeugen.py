"""QR-Codes für die Smartphone-Übungen (Themenblock 2) erzeugen und prüfen.

Aufruf (im Hauptverzeichnis des Repositorys):
    pip install segno zxing-cpp pillow
    python werkzeuge/qr_erzeugen.py

- Basisadresse: https://klawittersven-arch.github.io/3BFP2-kb1-notfall/
  (Groß-/Kleinschreibung genau wie der Repository-Name auf GitHub).
- Erzeugt für jede Seite in SEITEN qr/qr_<name>.png (Fehlerkorrektur M,
  Ruhezone 4 Module, mindestens 600 × 600 px) und prüft, dass sie sich
  dekodieren lassen.
"""
import sys
from pathlib import Path

import segno

WURZEL = Path(__file__).resolve().parent.parent
QR_ORDNER = WURZEL / "qr"
BASIS = "https://klawittersven-arch.github.io/3BFP2-kb1-notfall"
# Dateiname → Seite (Woche 2). Die Namen verwendet werkzeuge/ab_w2.js.
SEITEN = {
    "w2_entscheidung_1": "w2-entscheidung.html?runde=1",
    "w2_entscheidung_2": "w2-entscheidung.html?runde=2",
    "w2_markieren_a": "w2-markieren.html?fall=a",
    "w2_markieren_b": "w2-markieren.html?fall=b",
    "w2_markieren_c": "w2-markieren.html?fall=c",
    "w2_detektiv": "w2-detektiv.html",
    "w2_lagerung": "w2-lagerung.html",
    "w2_simulation": "w2-simulation.html",
    "w2_raster": "w2-raster.html",
    "w2_transfer": "w2-transfer.html",
}


def adressen():
    return {name: f"{BASIS}/{seite}" for name, seite in SEITEN.items()}


def qr_erzeugen(adresse, datei):
    qr = segno.make(adresse, error="m", micro=False)
    breite_module = qr.symbol_size(scale=1, border=4)[0]
    massstab = -(-600 // breite_module)  # aufrunden, damit mindestens 600 px
    qr.save(str(datei), kind="png", scale=massstab, border=4, dark="#000000", light="#FFFFFF")


def qr_pruefen(datei, erwartet):
    try:
        import zxingcpp
        from PIL import Image
    except ImportError:
        print("  (zxing-cpp/Pillow nicht installiert – Dekodierprüfung übersprungen)")
        return
    bild = Image.open(datei)
    ergebnisse = zxingcpp.read_barcodes(bild)
    texte = [e.text for e in ergebnisse]
    if texte != [erwartet]:
        sys.exit(f"QR-Prüfung fehlgeschlagen für {datei}: {texte}")
    print(f"  {datei.name}: {texte[0]}  ({bild.size[0]} × {bild.size[1]} px, Fehlerkorrektur {ergebnisse[0].ec_level})")


def main():
    QR_ORDNER.mkdir(exist_ok=True)
    for name, adresse in adressen().items():
        datei = QR_ORDNER / f"qr_{name}.png"
        qr_erzeugen(adresse, datei)
        qr_pruefen(datei, adresse)


if __name__ == "__main__":
    main()

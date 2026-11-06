"""Zeichnet die vier Lagerungs-Piktogramme für AA3 (Woche 2) als PNG.
Aufruf: python werkzeuge/piktogramme.py  → werkzeuge/bilder/lagerung_*.png
Einfache Strichfiguren, damit sie auch in Schwarz-Weiß-Kopien gut erkennbar bleiben."""
from pathlib import Path
from PIL import Image, ImageDraw

ZIEL = Path(__file__).parent / 'bilder'
W, H = 600, 340          # doppelte Auflösung, wird im Dokument verkleinert
FIG = (197, 90, 17)      # C55A11
BODEN = (120, 120, 120)
POLSTER = (241, 169, 131)
S = 16                   # Strichstärke


def neu():
    im = Image.new('RGB', (W, H), 'white')
    d = ImageDraw.Draw(im)
    d.line([(20, 290), (W - 20, 290)], fill=BODEN, width=8)
    return im, d


def kopf(d, x, y, r=34):
    d.ellipse([x - r, y - r, x + r, y + r], outline=FIG, width=S)


def strich(d, punkte):
    d.line(punkte, fill=FIG, width=S, joint='curve')
    for x, y in punkte:
        d.ellipse([x - S / 2, y - S / 2, x + S / 2, y + S / 2], fill=FIG)


def oberkoerper_hoch():
    im, d = neu()
    # Rückenteil (Kissen/Lehne)
    d.polygon([(285, 290), (215, 290), (112, 172), (150, 138)], fill=POLSTER)   # Rückenteil unter dem Rumpf
    strich(d, [(250, 262), (150, 150)])            # Rumpf schräg
    kopf(d, 124, 110)
    strich(d, [(250, 262), (420, 262), (540, 262)])  # Beine flach
    strich(d, [(185, 195), (250, 225)])            # Arm
    return im


def beine_hoch():
    im, d = neu()
    d.rectangle([420, 200, 560, 290], fill=POLSTER)  # Polster unter den Beinen
    kopf(d, 70, 250)
    strich(d, [(110, 262), (300, 262)])              # Rumpf flach
    strich(d, [(300, 262), (430, 196), (550, 186)])  # Beine erhöht
    strich(d, [(170, 262), (240, 245)])              # Arm
    return im


def seitenlage():
    im, d = neu()
    kopf(d, 80, 248)
    strich(d, [(116, 250), (300, 252)])              # Rumpf (Seitenlage)
    strich(d, [(300, 252), (530, 266)])              # unteres Bein gestreckt
    strich(d, [(300, 252), (400, 200), (420, 268)])  # oberes Bein: Knie nach vorn angewinkelt
    strich(d, [(150, 250), (185, 205), (225, 255)])  # oberer Arm vor dem Körper
    strich(d, [(60, 276), (112, 262)])               # Hand unter der Wange
    return im


def nicht_bewegen():
    im, d = neu()
    kopf(d, 110, 252)
    strich(d, [(146, 256), (340, 262)])              # Rumpf flach
    strich(d, [(340, 262), (560, 262)])              # Beine flach
    # zwei Hände halten den Kopf
    for dx in (-62, 62):
        d.rounded_rectangle([110 + dx - 18, 205, 110 + dx + 18, 285], radius=16, outline=(46, 117, 182), width=12)
    # Warnzeichen
    d.polygon([(430, 70), (500, 190), (360, 190)], outline=(192, 0, 0), width=12)
    d.line([(430, 110), (430, 150)], fill=(192, 0, 0), width=14)
    d.ellipse([422, 162, 438, 178], fill=(192, 0, 0))
    return im


if __name__ == '__main__':
    ZIEL.mkdir(exist_ok=True)
    for name, fn in [('oberkoerper_hoch', oberkoerper_hoch), ('beine_hoch', beine_hoch), ('seitenlage', seitenlage), ('nicht_bewegen', nicht_bewegen)]:
        fn().save(ZIEL / f'lagerung_{name}.png', optimize=True)
        print('geschrieben:', name)

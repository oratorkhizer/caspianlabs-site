#!/usr/bin/env python3
"""Draw the WhatsApp catalog cards: catalog-img/<slug>.png (1024x1024) for every item in
/api/whatsapp-catalog, plus catalog-img/_generic.png (no price), and write api/_catalog-img.js
(the price each card was drawn with, so the feed never shows a card with an old price).

Run from the repo root after any price or name change:   python3 scripts/catalog-images.py
Needs: node (reads the feed items from api/whatsapp-catalog.js), Pillow, the Inter font.
Not part of the Vercel build: the PNGs are committed.
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "catalog-img")
FONT_DIRS = ["/usr/share/fonts/opentype/inter", os.path.expanduser("~/.fonts"), "/Library/Fonts"]

BLUE, BLUE_DARK, CORAL, INK, MUTED, SOFT, LINE = "#0A5C9E", "#08487d", "#F25C54", "#152b3c", "#5b6b7a", "#eaf3fb", "#d7e6f3"
S = 1024
FOOT1 = "Caspian Diagnostic Centre"
FOOT2 = "Vijaynagar Colony, open 24x7"

FAST = {
    "yes": "8–12 hours fasting",
    "no": "No fasting needed",
    "morning": "Morning sample, no fasting",
    "cycle": "Day 2–5 of period, no fasting",
    "depends": "Fasting or 2 hrs after food",
    "confirm": "We will confirm fasting",
}


def font(weight, size):
    for d in FONT_DIRS:
        p = os.path.join(d, "Inter-%s.otf" % weight)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    sys.exit("Inter font not found")


def kind_label(it):
    if it["kind"] == "package":
        return "HEALTH PACKAGE"
    s, n = it["sample"].lower(), it["title"].lower()
    if "x-ray" in n:
        return "X-RAY"
    if "ecg" in n or "echo" in n:
        return "HEART TEST"
    if "scan" in s or "composition" in n:
        return "BODY SCAN"
    if s.startswith("urine"):
        return "URINE TEST"
    if s.startswith("stool"):
        return "STOOL TEST"
    return "BLOOD TEST"


def wrap(draw, text, f, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=f) <= width:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def fit_title(draw, text, width, height=248, max_lines=3):
    for size in range(96, 46, -2):
        f = font("ExtraBold", size)
        lines = wrap(draw, text, f, width)
        lh = round(size * 1.12)
        if len(lines) <= max_lines and lh * len(lines) <= height and all(draw.textlength(l, font=f) <= width for l in lines):
            return f, lines, size
    f = font("ExtraBold", 48)
    return f, wrap(draw, text, f, width)[:max_lines], 48


def base_card():
    im = Image.new("RGB", (S, S), "white")
    d = ImageDraw.Draw(im)
    # top logo panel
    d.rectangle([0, 0, S, 236], fill=SOFT)
    logo = Image.open(os.path.join(ROOT, "logo.webp")).convert("RGBA")
    lw = 540
    logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    im.paste(logo, ((S - lw) // 2, (236 - logo.height) // 2), logo)
    # footer band
    d.rectangle([0, S - 168, S, S], fill=BLUE)
    f1, f2 = font("Bold", 44), font("Medium", 36)
    d.text((S // 2, S - 116), FOOT1, font=f1, fill="white", anchor="mm")
    d.text((S // 2, S - 60), FOOT2, font=f2, fill="#dbeafa", anchor="mm", features=["-calt"])  # keep "24x7", not Inter's 24×7
    return im, d


def pill(d, cx, y, text, fill):
    f = font("Bold", 30)
    w = d.textlength(text, font=f) + 56
    d.rounded_rectangle([cx - w / 2, y, cx + w / 2, y + 58], radius=29, fill=fill)
    d.text((cx, y + 29), text, font=f, fill="white", anchor="mm")


def card(it):
    im, d = base_card()
    cx = S // 2
    pill(d, cx, 276, kind_label(it), CORAL)
    f, lines, size = fit_title(d, it["title"], 900)
    lh = round(size * 1.12)
    # title block centred in the band between the pill and the price
    top, bottom = 352, 600
    block = lh * len(lines)
    y = top + max(0, (bottom - top - block) // 2)
    for l in lines:
        d.text((cx, y + lh // 2), l, font=f, fill=INK, anchor="mm")
        y += lh
    # price
    price = "₹" + format(int(it["price"]), ",") if float(it["price"]).is_integer() else "₹%.2f" % it["price"]
    d.text((cx, 682), price, font=font("ExtraBold", 132), fill=BLUE, anchor="mm")
    # fasting line
    d.text((cx, 788), FAST.get(it["fasting"], FAST["confirm"]), font=font("SemiBold", 38), fill=MUTED, anchor="mm")
    return im


def generic():
    im, d = base_card()
    cx = S // 2
    pill(d, cx, 300, "LAB TESTS AND HEALTH PACKAGES", CORAL)
    f = font("ExtraBold", 84)
    for i, l in enumerate(["Reports on", "WhatsApp"]):
        d.text((cx, 480 + i * 96), l, font=f, fill=INK, anchor="mm")
    d.text((cx, 700), "Home collection in Hyderabad", font=font("SemiBold", 42), fill=MUTED, anchor="mm")
    return im


def main():
    js = "import('%s').then(m=>process.stdout.write(JSON.stringify(m.buildItems())))" % os.path.join(ROOT, "api", "whatsapp-catalog.js").replace("\\", "/")
    items = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", js], cwd=ROOT))
    os.makedirs(OUT, exist_ok=True)
    prices = {}
    for it in items:
        card(it).save(os.path.join(OUT, it["id"] + ".png"), optimize=True)
        prices[it["id"]] = it["price"]
    generic().save(os.path.join(OUT, "_generic.png"), optimize=True)
    with open(os.path.join(ROOT, "api", "_catalog-img.js"), "w") as fh:
        fh.write("// Written by scripts/catalog-images.py: the price printed on each catalog-img/<slug>.png card.\n")
        fh.write("// /api/whatsapp-catalog uses the plain _generic.png card for any item whose page price differs.\n")
        fh.write("export const IMG_PRICES = " + json.dumps(prices, indent=1) + ";\n")
    print("catalog-images: %d cards + _generic.png" % len(items))


if __name__ == "__main__":
    main()

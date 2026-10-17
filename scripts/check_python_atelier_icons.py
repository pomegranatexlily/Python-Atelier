#!/usr/bin/env python3
"""Validate the shipped Python Atelier PWA icon pack and both entrypoints."""
from pathlib import Path
from PIL import Image
import json
import re

ROOT = Path(__file__).resolve().parent.parent
sizes = {
    "favicon-32.png": (32,32),
    "apple-touch-icon.png": (180,180),
    "icon-192.png": (192,192),
    "icon-512.png": (512,512),
    "icon-maskable-512.png": (512,512),
}
for name,size in sizes.items():
    path=ROOT/name
    assert path.exists(), f"Missing {name}"
    with Image.open(path) as im:
        im.verify()
    with Image.open(path) as im:
        assert im.size==size, f"Wrong dimensions for {name}: {im.size}"
        assert im.format=="PNG", f"Wrong format for {name}"
manifest=json.loads((ROOT/"manifest.webmanifest").read_text())
assert manifest["start_url"]=="./app/"
for icon in manifest["icons"]:
    asset=icon["src"].split("?",1)[0]
    assert (ROOT/asset).exists(), f"Missing manifest icon {asset}"
assert any(i["purpose"]=="maskable" and "maskable" in i["src"] for i in manifest["icons"])
for entry in ("index.html","app/index.html"):
    html=(ROOT/entry).read_text()
    assert "snake-lily-20261017" in html, f"Cache-bust missing in {entry}"
    assert "icon-192.png" in html and "apple-touch-icon.png" in html
    assert "<img " in html
app=(ROOT/"app/index.html").read_text()
assert "function showSeal()" in app and "i.src='../icon-192.png?v=snake-lily-20261017'" in app
assert "if(seal)" in app, "Custom seal preference must remain supported"
print("Icon QC passed: 5 PNG sizes, PWA manifest and both entrypoints.")

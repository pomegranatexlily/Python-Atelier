#!/usr/bin/env python3
"""Build exact approved Python Atelier poster-icon crops; do not redraw artwork.

The source is the snake, fountain pen, and white lily tile isolated from
POM × LILY's October 2026 ecosystem poster. Since the source is 256 pixels
square, resizing to 512 does not create new image detail.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets/python-atelier-poster-icon-source.jpg"
OUTPUTS = {
    "favicon-32.png": 32,
    "apple-touch-icon.png": 180,
    "icon-192.png": 192,
    "icon-512.png": 512,
}

with Image.open(SOURCE) as original:
    original.load()
    if original.size != (256, 256):
        raise ValueError(f"Unexpected approved icon dimensions: {original.size}")
    source = original.convert("RGB")
    for name, size in OUTPUTS.items():
        out = source.resize((size, size), Image.Resampling.LANCZOS)
        out.save(ROOT / name, format="PNG", optimize=True)
        with Image.open(ROOT / name) as check:
            if check.size != (size, size) or check.format != "PNG":
                raise RuntimeError(f"Failed to verify {name}")
        print(f"Built {name}: {size}×{size}")

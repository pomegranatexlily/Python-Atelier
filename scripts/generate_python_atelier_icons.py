#!/usr/bin/env python3
"""Build Python Atelier's approved ecosystem-poster snake/pen/lily app icons.

Source: founder-supplied POM × LILY ecosystem artwork, cropped to the
Python Atelier square icon. The art is embedded to make builds reproducible
with no network requests. Only Pillow is needed.
"""
from pathlib import Path
from io import BytesIO
from base64 import b64decode
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE_B64 = (
    "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"
)

def build(root=ROOT):
    base=Image.open(BytesIO(b64decode(SOURCE_B64))).convert("RGB")
    if base.size != (192,192):
        raise RuntimeError("Icon source dimensions unexpectedly changed")
    for size, name in ((32,"favicon-32.png"),(180,"apple-touch-icon.png"),
                       (192,"icon-192.png"),(512,"icon-512.png")):
        # Do not add iOS corner clipping; iOS applies its own icon mask.
        img=base.resize((size,size),Image.Resampling.LANCZOS)
        img.save(root/name,"PNG",optimize=True)
        print(name, (root/name).stat().st_size)
    # Maskable artwork sits in a safe region for Android icon crops.
    background=(4,14,24)
    icon=Image.new("RGB",(512,512),background)
    inner=base.resize((394,394),Image.Resampling.LANCZOS)
    icon.paste(inner,((512-394)//2,(512-394)//2))
    icon.save(root/"icon-maskable-512.png","PNG",optimize=True)
    print("icon-maskable-512.png",(root/"icon-maskable-512.png").stat().st_size)

if __name__=="__main__":
    build()
"""Offline media preparation; never runs in the app/build.

Requires ffmpeg and Python packages rembg[cpu], opencv-python-headless, Pillow.
See docs/aquarium-hero.md for source, license and invocation.
"""
import argparse
import os
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

parser = argparse.ArgumentParser()
parser.add_argument("source", type=Path)
parser.add_argument("--workdir", type=Path, default=Path(".gstack/aquarium"))
args = parser.parse_args()
frames_dir = args.workdir / "frames"
frames_dir.mkdir(parents=True, exist_ok=True)
os.environ["U2NET_HOME"] = str((args.workdir / "models").resolve())
session = new_session("u2net")
cap = cv2.VideoCapture(str(args.source))
frames = []
fps = 15
for index in range(120):
    target = frames_dir / f"{index:04d}.png"
    if target.exists():
        frames.append(Image.open(target).convert("RGBA"))
        continue
    cap.set(cv2.CAP_PROP_POS_MSEC, index * 1000 / fps)
    ok, frame = cap.read()
    if not ok:
        raise RuntimeError(f"Missing source frame {index}")
    frame = cv2.resize(frame, (768, 432))
    rgba = np.array(remove(Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)), session=session))
    # Retain the main fish, removing unrelated small background detections.
    count, labels, stats, _ = cv2.connectedComponentsWithStats((rgba[:, :, 3] > 64).astype(np.uint8))
    component = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    mask = cv2.dilate((labels == component).astype(np.uint8), np.ones((5, 5), np.uint8))
    rgba[:, :, 3] *= mask
    fish = Image.fromarray(rgba)
    bounds = fish.getbbox()
    fish = fish.crop(bounds)
    # Constant scale preserves the fish's natural turns; only its position is stabilized.
    fish = fish.resize((round(fish.width * .85), round(fish.height * .85)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (384, 256))
    canvas.paste(fish, ((384 - fish.width) // 2, (256 - fish.height) // 2))
    canvas.save(target)
    frames.append(canvas)
    if index % 15 == 0:
        print(f"Segmented {index + 1}/120 frames", flush=True)
cap.release()
out = Path("public/videos")
frames[30].save(out / "fish-poster.webp", quality=90)
frames[0].save(out / "fish-fallback.webp", save_all=True, append_images=frames[1:], duration=133, loop=0, quality=78, method=4)
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-framerate", str(fps), "-i", str(frames_dir / "%04d.png"), "-frames:v", "120", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "32", "-auto-alt-ref", "0", "-an", "-y", str(out / "fish-alpha.webm")], check=True)
# A tiny fully transparent video lets the browser test actual decoded alpha support.
probe = args.workdir / "alpha-probe.png"
Image.new("RGBA", (16, 16)).save(probe)
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-loop", "1", "-i", str(probe), "-t", "0.2", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0", "-an", "-y", str(out / "alpha-probe.webm")], check=True)
print("Prepared alpha WebM, animated WebP fallback and static poster.", flush=True)

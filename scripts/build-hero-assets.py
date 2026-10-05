#!/usr/bin/env python3
"""
build-hero-assets.py — turn the raw intro video into a seamless, looping hero clip.

Outputs (into public/):
  hero/hero.mp4        H.264 yuv420p, CRF 24, preset slow, AAC 96k, +faststart
  hero/hero.webm       VP9 CRF 36, Opus 80k
  hero/poster.webp     first frame of the loop (video poster)
  portrait-bust.webp   480x600 head-to-shirt crop (from --photo if given, else clearest frame)
  og.jpg               1200x630 social card

Pipeline
  1. Detect the person (dark-on-light mask against a per-row border background estimate),
     union the bounding box over frames and crop head-to-toe, centred. Pass --crop W:H:X:Y to override.
  2. Whiten the backdrop with colorlevels (imax derived from the measured backdrop, clamped).
  3. Seamless loop: the clip's last FADE seconds are cross-faded into its first FADE seconds
     (video: ffmpeg xfade; audio: equal-power cross-fade done sample-accurately in numpy).
     Nothing is stretched or retimed, so lips stay in sync.

Requirements: ffmpeg (libx264, libvpx-vp9, libopus) and numpy. WebP: ffmpeg libwebp, cwebp or Pillow.

Usage:
  python3 scripts/build-hero-assets.py [--src intro.mp4] [--photo IMG_1237.JPG]
                                       [--seconds 10] [--fade 0.5] [--crop W:H:X:Y]
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT_W, OUT_H = 768, 960          # hero aspect 768/960 = 0.8
PAPER = (0xF4, 0xF2, 0xEE)


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    print("  $", " ".join(str(c) for c in cmd[:6]), "…" if len(cmd) > 6 else "")
    return subprocess.run(cmd, check=True, **kw)


def probe(src: Path) -> dict:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(src)],
        check=True, capture_output=True, text=True,
    ).stdout
    info = json.loads(out)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    a = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    num, den = (int(x) for x in v["r_frame_rate"].split("/"))
    return {
        "w": int(v["width"]), "h": int(v["height"]), "fps": num / den, "fps_str": v["r_frame_rate"],
        "dur": float(info["format"]["duration"]),
        "sr": int(a["sample_rate"]) if a else None, "ch": int(a["channels"]) if a else 0,
    }


def frames_rgb(src: Path, w: int, h: int, every: float, seconds: float) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-t", str(seconds), "-i", str(src),
         "-vf", f"fps=1/{every},scale={w}:{h}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(np.float32)


def image_rgb(path: Path) -> np.ndarray:
    w, h = (int(x) for x in subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
         "-of", "csv=p=0", str(path)], check=True, capture_output=True, text=True).stdout.strip().split(","))
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(h, w, 3).astype(np.float32)


def person_mask(img: np.ndarray, thresh: float = 28.0) -> tuple[np.ndarray, np.ndarray]:
    """Return (mask, per-row background luminance). Background is estimated from the
    brightest of the two border strips per row, so vignetting on one side doesn't leak in."""
    lum = img @ np.array([0.299, 0.587, 0.114], np.float32)
    h, w = lum.shape
    strip = max(2, w // 24)
    bg_rows = np.maximum(lum[:, :strip].mean(1), lum[:, -strip:].mean(1))
    # Smooth along y so a dark object touching an edge doesn't drag the estimate down.
    k = max(3, h // 40)
    bg_rows = np.convolve(np.pad(bg_rows, k, mode="edge"), np.ones(2 * k + 1) / (2 * k + 1), "valid")
    mask = (bg_rows[:, None] - lum) > thresh
    # Also catch saturated (coloured) pixels such as a skin tone close to the backdrop luminance.
    sat = img.max(-1) - img.min(-1)
    mask |= sat > 32
    return mask, bg_rows


def backdrop_levels(img: np.ndarray, mask: np.ndarray) -> float:
    """Luminance (0–1) that the backdrop should be lifted from: a low percentile of all
    non-person pixels, so vignettes and floor shadow also land on white."""
    lum = img @ np.array([0.299, 0.587, 0.114], np.float32)
    grown = mask.copy()
    for ax in (0, 1):  # dilate the person mask a little so edge halos don't count as backdrop
        for sh in (-3, -2, -1, 1, 2, 3):
            grown |= np.roll(mask, sh, axis=ax)
    bg = lum[~grown]
    return float(np.percentile(bg, 6) / 255.0) if bg.size else 0.98


def bbox(mask: np.ndarray, min_frac: float = 0.02) -> tuple[int, int, int, int]:
    h, w = mask.shape
    cols = np.where(mask.sum(0) > h * min_frac * 0.25)[0]
    rows = np.where(mask.sum(1) > w * min_frac)[0]
    if not len(cols) or not len(rows):
        raise RuntimeError("person not found — pass --crop W:H:X:Y")
    return int(cols[0]), int(rows[0]), int(cols[-1]), int(rows[-1])


def detect_crop(src: Path, meta: dict, seconds: float) -> tuple[tuple[int, int, int, int], float]:
    """Union of per-frame person boxes → padded, centred crop in source pixels.
    Returns (crop W,H,X,Y) and the colorlevels imax for the backdrop."""
    sw, sh = meta["w"], meta["h"]
    scale = 360 / max(sw, sh)
    dw, dh = max(2, int(sw * scale) // 2 * 2), max(2, int(sh * scale) // 2 * 2)
    fr = frames_rgb(src, dw, dh, 0.5, seconds)
    boxes, bgs = [], []
    for f in fr:
        m, _ = person_mask(f)
        boxes.append(bbox(m))
        bgs.append(backdrop_levels(f, m))
    b = np.array(boxes)
    x0, y0 = np.percentile(b[:, 0], 5), np.percentile(b[:, 1], 5)
    x1, y1 = np.percentile(b[:, 2], 95), np.percentile(b[:, 3], 95)
    # back to source pixels, with head-room / foot-room
    x0, x1, y0, y1 = x0 / scale, x1 / scale, y0 / scale, y1 / scale
    ph = y1 - y0
    pad_top, pad_bot = 0.06 * ph, 0.03 * ph
    cy0 = max(0, y0 - pad_top)
    cy1 = min(sh, y1 + pad_bot)
    ch = cy1 - cy0
    cw = min(sw, ch * OUT_W / OUT_H)
    cx = (x0 + x1) / 2
    cx0 = min(max(0, cx - cw / 2), sw - cw)
    crop = (int(cw) // 2 * 2, int(ch) // 2 * 2, int(cx0), int(cy0))
    # imax: map the darker end of the backdrop to pure white (so multiply-blend vanishes)
    imax = float(np.clip(np.median(bgs) - 0.01, 0.82, 0.98))
    return crop, imax


def loop_audio(src: Path, meta: dict, seconds: float, fade: float, out_wav: Path) -> None:
    sr, ch = meta["sr"], meta["ch"]
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(src), "-t", str(seconds), "-vn",
         "-f", "f32le", "-acodec", "pcm_f32le", "-ar", str(sr), "-ac", str(ch), "-"],
        check=True, capture_output=True,
    ).stdout
    a = np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
    n = int(round(seconds * sr))
    if len(a) < n:  # pad with silence if the stream is a hair short
        a = np.vstack([a, np.zeros((n - len(a), ch), np.float32)])
    a = a[:n]
    f = int(round(fade * sr))
    t = np.linspace(0, 1, f, endpoint=False, dtype=np.float32)[:, None]
    fin, fout = np.sin(t * np.pi / 2), np.cos(t * np.pi / 2)        # equal-power
    head, tail = a[:f], a[n - f:]
    out = np.vstack([tail * fout + head * fin, a[f:n - f]])          # length n - f
    out = np.clip(out, -1, 1)
    pcm = (out * 32767).astype("<i2").tobytes()
    run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(sr), "-ac", str(ch), "-i", "-", str(out_wav)],
        input=pcm)


def build_video(src: Path, meta: dict, seconds: float, fade: float, crop, imax: float,
                wav: Path | None, out_dir: Path) -> None:
    fps = meta["fps"]
    nfr = int(round(seconds * fps))
    ffr = int(round(fade * fps))
    fade_s = ffr / fps
    cw, ch, cx, cy = crop
    lv = f"{imax:.3f}"
    # Scale so the crop fills the height, then pad to 768x960 with white (blends into the paper).
    # The source edges are feathered into white so no seam shows where the padding starts.
    sw = int(round(cw * OUT_H / ch / 2)) * 2
    l = max(0.0, (OUT_W - sw) / 2 / OUT_W)
    r = 1 - l
    f = 0.07  # feather width, fraction of output width
    e = f"clip(max(({l + f:.4f}-X/W)/{f},(X/W-{r - f:.4f})/{f}),0,1)"
    post = (f"crop={cw}:{ch}:{cx}:{cy},scale=-2:{OUT_H}:flags=lanczos,"
            f"pad={OUT_W}:{OUT_H}:(ow-iw)/2:0:color=white,"
            f"colorlevels=rimax={lv}:gimax={lv}:bimax={lv},format=yuv420p,"
            f"geq=lum='p(X,Y)+(255-p(X,Y))*{e}':cb='p(X,Y)+(128-p(X,Y))*{e}':cr='p(X,Y)+(128-p(X,Y))*{e}'")
    fc = (f"[0:v]trim=start_frame={nfr - ffr}:end_frame={nfr},setpts=PTS-STARTPTS[tail];"
          f"[0:v]trim=start_frame=0:end_frame={nfr - ffr},setpts=PTS-STARTPTS[body];"
          f"[tail][body]xfade=transition=fade:duration={fade_s:.4f}:offset=0,{post}[v]")
    base = ["ffmpeg", "-v", "error", "-y", "-i", str(src)]
    amap: list[str] = []
    if wav:
        base += ["-i", str(wav)]
        amap = ["-map", "1:a"]
    total = (nfr - ffr) / fps
    common = ["-filter_complex", fc, "-map", "[v]", *amap, "-t", f"{total:.4f}", "-r", meta["fps_str"]]
    print(f"• encoding hero.mp4  ({total:.2f}s loop, crop {cw}x{ch}+{cx}+{cy}, levels {lv})")
    run(base + common + ["-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
                         "-profile:v", "high", "-movflags", "+faststart",
                         *(["-c:a", "aac", "-b:a", "96k"] if wav else ["-an"]),
                         str(out_dir / "hero.mp4")])
    print("• encoding hero.webm")
    run(base + common + ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-deadline", "good",
                         "-cpu-used", "2", "-pix_fmt", "yuv420p",
                         *(["-c:a", "libopus", "-b:a", "80k"] if wav else ["-an"]),
                         str(out_dir / "hero.webm")])


def sharpest_frame_time(src: Path, seconds: float) -> float:
    fr = frames_rgb(src, 180, 320, 0.25, seconds)
    lum = fr @ np.array([0.299, 0.587, 0.114], np.float32)
    # Laplacian variance on the top third (face region) as a sharpness score
    top = lum[:, : lum.shape[1] // 3]
    lap = (np.roll(top, 1, 1) + np.roll(top, -1, 1) + np.roll(top, 1, 2) + np.roll(top, -1, 2) - 4 * top)
    return float(np.argmax(lap.var(axis=(1, 2))) * 0.25)


def bust_crop(img: np.ndarray) -> tuple[int, int, int, int]:
    """Head-to-shirt crop (4:5) from a full-body still."""
    h, w, _ = img.shape
    m, _ = person_mask(img)
    x0, y0, x1, y1 = bbox(m)
    ph = y1 - y0
    top = max(0, int(y0 - 0.04 * ph))
    ch = int(0.40 * ph)
    head = m[y0: y0 + int(0.12 * ph)]
    xs = np.where(head.any(0))[0]
    cx = (xs[0] + xs[-1]) / 2 if len(xs) else (x0 + x1) / 2
    cw = int(ch * 0.8)
    cx0 = int(min(max(0, cx - cw / 2), w - cw))
    return cw // 2 * 2, min(ch, h - top) // 2 * 2, cx0, top


def to_webp(png: Path, dst: Path, quality: int = 82) -> None:
    """ffmpeg builds often lack libwebp: try it, then cwebp, then Pillow, then macOS sips."""
    tries = [
        lambda: run(["ffmpeg", "-v", "error", "-y", "-i", str(png), "-c:v", "libwebp", "-quality", str(quality), str(dst)],
                    capture_output=True),
        lambda: run(["cwebp", "-quiet", "-q", str(quality), str(png), "-o", str(dst)]),
        lambda: __import__("PIL.Image", fromlist=["Image"]).open(png).save(dst, "WEBP", quality=quality, method=6),
        lambda: run(["sips", "-s", "format", "webp", str(png), "--out", str(dst)], capture_output=True),
    ]
    for t in tries:
        try:
            t()
            if dst.exists() and dst.stat().st_size:
                return
        except Exception:
            continue
    sys.exit("no WebP encoder found (install ffmpeg with libwebp, cwebp, or `pip install pillow`)")


def build_stills(src: Path, photo: Path | None, seconds: float, imax: float, out_pub: Path, tmp: Path) -> None:
    if photo and photo.exists():
        still = photo
        print(f"• portrait from photo {photo.name}")
    else:
        t = sharpest_frame_time(src, seconds)
        still = tmp / "still.png"
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", str(src), "-frames:v", "1", str(still)])
        print(f"• portrait from frame @ {t:.2f}s")
    img = image_rgb(still)
    lv = f"{float(np.clip(backdrop_levels(img, person_mask(img)[0]) - 0.01, 0.82, 0.99)):.3f}"
    cw, ch, cx, cy = bust_crop(img)
    bust_png = tmp / "bust.png"
    run(["ffmpeg", "-v", "error", "-y", "-i", str(still),
         "-vf", f"crop={cw}:{ch}:{cx}:{cy},scale=480:600:flags=lanczos,colorlevels=rimax={lv}:gimax={lv}:bimax={lv}",
         str(bust_png)])
    to_webp(bust_png, out_pub / "portrait-bust.webp")

    # OG card: full-body still multiplied onto paper, placed right of centre.
    paper = "0x%02x%02x%02x" % PAPER
    m, _ = person_mask(img)
    x0, y0, x1, y1 = bbox(m)
    ph = y1 - y0
    fy0 = max(0, int(y0 - 0.05 * ph))
    fh = min(img.shape[0] - fy0, int(ph * 1.08)) // 2 * 2
    fw = min(img.shape[1], int(fh * 0.8)) // 2 * 2
    fx0 = int(min(max(0, (x0 + x1) / 2 - fw / 2), img.shape[1] - fw))
    # blend needs equal sizes, so pad the portrait to 1200x630 on white first.
    run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c={paper}:s=1200x630", "-i", str(still),
         "-filter_complex",
         f"[1:v]crop={fw}:{fh}:{fx0}:{fy0},scale=-2:600:flags=lanczos,"
         f"colorlevels=rimax={lv}:gimax={lv}:bimax={lv},pad=1200:630:(ow-iw)/2:30:color=white,format=gbrp[p];"
         f"[0:v]format=gbrp[bg];[bg][p]blend=all_mode=multiply[x];[x]format=yuvj420p[o]",
         "-map", "[o]", "-frames:v", "1", "-q:v", "3", str(out_pub / "og.jpg")])


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--src", default=str(ROOT / "intro.mp4"))
    ap.add_argument("--photo", default=str(ROOT / "IMG_1237.JPG"), help="optional still for the ID card bust")
    ap.add_argument("--seconds", type=float, default=10.0)
    ap.add_argument("--fade", type=float, default=0.5)
    ap.add_argument("--crop", help="override detection: W:H:X:Y in source pixels")
    ap.add_argument("--levels", type=float, help="override colorlevels imax (0.8–1.0)")
    args = ap.parse_args()

    src = Path(args.src)
    if not src.exists():
        alt = src.with_suffix(".mov")
        if alt.exists():
            src = alt
        else:
            sys.exit(f"source video not found: {src}")
    meta = probe(src)
    seconds = min(args.seconds, meta["dur"] - 1 / meta["fps"])
    print(f"source {src.name}: {meta['w']}x{meta['h']} @ {meta['fps']:.3f}fps, {meta['dur']:.2f}s, "
          f"audio {meta['sr']}Hz x{meta['ch']} → using first {seconds:.2f}s")

    crop, imax = detect_crop(src, meta, seconds)
    if args.crop:
        crop = tuple(int(x) for x in args.crop.split(":"))  # type: ignore[assignment]
    if args.levels:
        imax = args.levels
    print(f"• person crop {crop}  backdrop imax {imax:.3f}")

    hero_dir = ROOT / "public" / "hero"
    hero_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        wav = None
        if meta["sr"]:
            # snap the loop length to whole video frames so audio and picture wrap together
            nfr = int(round(seconds * meta["fps"]))
            seconds_fr = nfr / meta["fps"]
            fade_fr = int(round(args.fade * meta["fps"])) / meta["fps"]
            wav = tmp / "loop.wav"
            print(f"• audio cross-fade ({fade_fr:.3f}s, equal-power, numpy)")
            loop_audio(src, meta, seconds_fr, fade_fr, wav)
        build_video(src, meta, seconds, args.fade, crop, imax, wav, hero_dir)
        # poster = first frame of the finished loop (shown before the video can play)
        poster_png = tmp / "poster.png"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(hero_dir / "hero.mp4"), "-frames:v", "1", str(poster_png)])
        to_webp(poster_png, hero_dir / "poster.webp", quality=72)
        photo = Path(args.photo) if args.photo else None
        build_stills(src, photo, seconds, imax, ROOT / "public", tmp)

    for p in [hero_dir / "hero.mp4", hero_dir / "hero.webm", hero_dir / "poster.webp", ROOT / "public/portrait-bust.webp", ROOT / "public/og.jpg"]:
        print(f"  {p.relative_to(ROOT)}  {p.stat().st_size / 1024:.0f} kB")


if __name__ == "__main__":
    main()

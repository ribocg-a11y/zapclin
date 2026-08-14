#!/usr/bin/env python3
"""ZapClin Reel #02 — odor / motoboy (9:16 20s)."""
from __future__ import annotations

import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

W, H = 1080, 1920
FPS = 30
DURATION = 20.0
NFRAMES = int(FPS * DURATION)

ROOT = Path("/workspace")
ASSETS = ROOT / "site/assets"
OUT_DIR = Path("/opt/cursor/artifacts/zapclin-reel-02")
REPO_OUT = ROOT / "docs/ativos/marketing-ig"
OUT_DIR.mkdir(parents=True, exist_ok=True)
REPO_OUT.mkdir(parents=True, exist_ok=True)

FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
FONT_SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"

CYAN = (92, 255, 215)
CYAN_DEEP = (0, 200, 224)
WHITE = (244, 247, 255)
MUTED = (170, 180, 210)
GOLD = (240, 193, 75)
DARK = (7, 11, 26)
RED_ACCENT = (255, 93, 108)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def ease_out_cubic(t: str | float) -> float:
    t = float(t)
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def ease_in_out(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 3 * t * t - 2 * t * t * t


def clamp01(t: float) -> float:
    return max(0.0, min(1.0, t))


def scene_progress(t: float, start: float, end: float) -> float:
    if t < start:
        return 0.0
    if t >= end:
        return 1.0
    return (t - start) / (end - start)


def load_cover(path: Path, scale: float = 1.15) -> Image.Image:
    im = Image.open(path).convert("RGB")
    # cover 1080x1920
    tw, th = int(W * scale), int(H * scale)
    ratio = max(tw / im.width, th / im.height)
    nw, nh = int(im.width * ratio), int(im.height * ratio)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return im.crop((left, top, left + tw, top + th))


def darken(im: Image.Image, factor: float = 0.45) -> Image.Image:
    return ImageEnhance.Brightness(im).enhance(factor)


def gradient_overlay(alpha_top: int = 200, alpha_bot: int = 230) -> Image.Image:
    g = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = g.load()
    for y in range(H):
        # vignette-ish vertical
        p = y / (H - 1)
        a = int(alpha_top * (1 - p) + alpha_bot * p)
        a = int(a * (0.55 + 0.45 * abs(p - 0.5) * 2))
        for x in range(W):
            # side vignette
            sx = abs(x - W / 2) / (W / 2)
            aa = min(255, int(a + sx * 40))
            px[x, y] = (7, 11, 26, aa)
    return g


def draw_text_shadow(
    draw: ImageDraw.ImageDraw,
    xy: tuple[float, float],
    text: str,
    fnt: ImageFont.FreeTypeFont,
    fill,
    shadow=(0, 0, 0, 180),
    offset=4,
):
    x, y = xy
    draw.text((x + offset, y + offset), text, font=fnt, fill=shadow)
    draw.text((x, y), text, font=fnt, fill=fill)


def text_size(fnt: ImageFont.FreeTypeFont, text: str) -> tuple[int, int]:
    bbox = fnt.getbbox(text)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def centered_x(fnt: ImageFont.FreeTypeFont, text: str) -> int:
    tw, _ = text_size(fnt, text)
    return (W - tw) // 2


def wrap_lines(text: str, fnt: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if text_size(fnt, trial)[0] <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def paste_rgba(base: Image.Image, overlay: Image.Image, xy=(0, 0), opacity=1.0):
    if opacity >= 0.999:
        base.alpha_composite(overlay, dest=xy)
        return
    ov = overlay.copy()
    a = ov.split()[-1].point(lambda p: int(p * opacity))
    ov.putalpha(a)
    base.alpha_composite(ov, dest=xy)


def make_logo(max_w=420) -> Image.Image:
    logo = Image.open(ASSETS / "logo-oficial-transp.png").convert("RGBA")
    ratio = max_w / logo.width
    logo = logo.resize((int(logo.width * ratio), int(logo.height * ratio)), Image.Resampling.LANCZOS)
    return logo


HERO = darken(load_cover(ASSETS / "hero-loja.jpg", 1.18), 0.42)
CHUVA = darken(load_cover(ASSETS / "extra-chuva.jpg", 1.22), 0.38)
LOGO = make_logo(460)
GRAD = gradient_overlay(160, 210)


def bg_at(t: float) -> Image.Image:
    # Ken Burns on hero / switch to chuva mid
    if t < 11.5:
        src = HERO
        zoom = 1.0 + 0.08 * ease_in_out(t / 11.5)
        pan_y = int((src.height - H) * (0.15 + 0.25 * (t / 11.5)))
    else:
        src = CHUVA
        local = (t - 11.5) / 8.5
        zoom = 1.0 + 0.06 * ease_in_out(local)
        pan_y = int((src.height - H) * (0.35 - 0.1 * local))
    zw, zh = int(W * zoom), int(H * zoom)
    # src is already larger than W,H
    crop_w, crop_h = min(zw, src.width), min(zh, src.height)
    left = (src.width - crop_w) // 2
    top = max(0, min(src.height - crop_h, pan_y))
    frame = src.crop((left, top, left + crop_w, top + crop_h)).resize((W, H), Image.Resampling.LANCZOS)
    out = frame.convert("RGBA")
    paste_rgba(out, GRAD)
    return out


def neon_bar(draw, y, progress, width=720):
    p = ease_out_cubic(progress)
    w = int(width * p)
    x0 = (W - w) // 2
    draw.rounded_rectangle([x0, y, x0 + w, y + 8], radius=4, fill=CYAN + (230,))


def render_frame(i: int) -> Image.Image:
    t = i / FPS
    base = bg_at(t)
    draw = ImageDraw.Draw(base, "RGBA")
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer, "RGBA")

    # ----- Scene 1: HOOK 0–3.2s -----
    if t < 3.4:
        p = scene_progress(t, 0.0, 0.55)
        fade = 1.0 if t < 2.7 else clamp01(1 - (t - 2.7) / 0.7)
        y_off = int((1 - ease_out_cubic(p)) * 80)
        f1 = font(FONT_BOLD, 78)
        f2 = font(FONT_BOLD, 92)
        line1 = "CHEIRO DE"
        line2 = "SUOR?"
        c1 = (*WHITE, int(255 * fade))
        c2 = (*RED_ACCENT, int(255 * fade))  # accent
        x1 = centered_x(f1, line1)
        x2 = centered_x(f2, line2)
        draw_text_shadow(ld, (x1, 620 + y_off), line1, f1, c1, offset=5)
        draw_text_shadow(ld, (x2, 720 + y_off), line2, f2, c2, offset=5)
        sub = font(FONT_REG, 40)
        s = "São Luís · Golden Shopping Calhau"
        if t > 0.8:
            sp = ease_out_cubic(scene_progress(t, 0.8, 1.5))
            draw_text_shadow(
                ld,
                (centered_x(sub, s), 860 + int((1 - sp) * 30)),
                s,
                sub,
                (*MUTED, int(230 * fade * sp)),
                offset=3,
            )
        neon_bar(ld, 940, scene_progress(t, 1.2, 2.0) * fade)

    # ----- Scene 2: PROMISE 3.0–7.0 -----
    if 2.9 < t < 7.2:
        local_t = t - 2.9
        fade_in = ease_out_cubic(clamp01(local_t / 0.45))
        fade_out = 1.0 if t < 6.5 else clamp01(1 - (t - 6.5) / 0.7)
        fade = fade_in * fade_out
        fbig = font(FONT_BOLD, 64)
        lines = ["Motoboy SLZ", "higieniza em", "8 MINUTOS"]
        colors = [WHITE, WHITE, CYAN]
        sizes = [64, 64, 96]
        y = 560
        for idx, (txt, col) in enumerate(zip(lines, colors)):
            fnt = font(FONT_BOLD, sizes[idx])
            delay = idx * 0.18
            p = ease_out_cubic(clamp01((local_t - delay) / 0.4))
            x = centered_x(fnt, txt) + int((1 - p) * 120 * (1 if idx % 2 == 0 else -1))
            alpha = int(255 * fade * p)
            draw_text_shadow(ld, (x, y), txt, fnt, (*col, alpha), offset=5)
            y += sizes[idx] + 18
        pill = "Odor no forro ≠ limpeza na casca"
        fp = font(FONT_REG, 34)
        if local_t > 1.1:
            pp = ease_out_cubic(clamp01((local_t - 1.1) / 0.4))
            # pill bg
            tw, th = text_size(fp, pill)
            pad_x, pad_y = 36, 18
            bx = (W - tw) // 2 - pad_x
            by = y + 30
            ld.rounded_rectangle(
                [bx, by, bx + tw + 2 * pad_x, by + th + 2 * pad_y],
                radius=40,
                fill=(15, 23, 48, int(200 * fade * pp)),
                outline=(*CYAN, int(200 * fade * pp)),
                width=3,
            )
            draw_text_shadow(
                ld,
                (bx + pad_x, by + pad_y - 2),
                pill,
                fp,
                (*WHITE, int(255 * fade * pp)),
                offset=2,
            )

    # ----- Scene 3: PRICE IMPACT 6.8–11.2 -----
    if 6.8 < t < 11.4:
        local_t = t - 6.8
        fade_in = ease_out_cubic(clamp01(local_t / 0.4))
        fade_out = 1.0 if t < 10.7 else clamp01(1 - (t - 10.7) / 0.7)
        fade = fade_in * fade_out
        # pulse scale on price
        pulse = 1.0 + 0.04 * math.sin(local_t * 6.0)
        price = "R$ 15"
        fprice = font(FONT_BOLD, int(140 * pulse))
        tw, th = text_size(fprice, price)
        # glow circle
        cx, cy = W // 2, 780
        glow_r = int(220 + 30 * math.sin(local_t * 4))
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        gd.ellipse(
            [cx - glow_r, cy - glow_r // 2, cx + glow_r, cy + glow_r // 2],
            fill=(*CYAN_DEEP, int(55 * fade)),
        )
        glow = glow.filter(ImageFilter.GaussianBlur(40))
        paste_rgba(layer, glow, opacity=fade)
        draw_text_shadow(
            ld,
            ((W - tw) // 2, cy - th // 2 - 40),
            price,
            fprice,
            (*CYAN, int(255 * fade)),
            offset=6,
        )
        fsub = font(FONT_BOLD, 48)
        line = "Higienização Rápida"
        draw_text_shadow(
            ld,
            (centered_x(fsub, line), cy + 90),
            line,
            fsub,
            (*WHITE, int(255 * fade)),
            offset=4,
        )
        fsmall = font(FONT_REG, 36)
        bits = ["8 min", "Remove odor", "Anti-germes"]
        bx = 120
        by = cy + 180
        for bi, bit in enumerate(bits):
            pp = ease_out_cubic(clamp01((local_t - 0.5 - bi * 0.2) / 0.35))
            chip = f"  {bit}  "
            cw, ch = text_size(fsmall, chip)
            x = bx + bi * 280
            if x + cw > W - 80:
                continue
            ld.rounded_rectangle(
                [x, by, x + cw, by + ch + 24],
                radius=24,
                fill=(15, 23, 48, int(210 * fade * pp)),
                outline=(*GOLD, int(180 * fade * pp)),
                width=2,
            )
            draw_text_shadow(
                ld,
                (x + 4, by + 10),
                chip,
                fsmall,
                (*WHITE, int(255 * fade * pp)),
                offset=2,
            )
        # table tease
        more = "De R$ 15 a R$ 70 · cardápio completo"
        if local_t > 1.6:
            mp = ease_out_cubic(clamp01((local_t - 1.6) / 0.4))
            fm = font(FONT_REG, 32)
            draw_text_shadow(
                ld,
                (centered_x(fm, more), by + 100),
                more,
                fm,
                (*MUTED, int(240 * fade * mp)),
                offset=2,
            )

    # ----- Scene 4: LOCAL + BENEFIT 11.0–15.5 -----
    if 10.9 < t < 15.7:
        local_t = t - 10.9
        fade_in = ease_out_cubic(clamp01(local_t / 0.4))
        fade_out = 1.0 if t < 15.0 else clamp01(1 - (t - 15.0) / 0.7)
        fade = fade_in * fade_out
        ftitle = font(FONT_BOLD, 56)
        t1 = "Golden Shopping Calhau"
        t2 = "Quiosque 01 · Calhau"
        draw_text_shadow(
            ld,
            (centered_x(ftitle, t1), 520 + int((1 - fade_in) * 40)),
            t1,
            ftitle,
            (*WHITE, int(255 * fade)),
            offset=4,
        )
        f2 = font(FONT_BOLD, 44)
        draw_text_shadow(
            ld,
            (centered_x(f2, t2), 600),
            t2,
            f2,
            (*CYAN, int(255 * fade)),
            offset=3,
        )
        benefits = [
            ("✓", "Elimina germes e bactérias"),
            ("✓", "Tira odor de suor do forro"),
            ("✓", "Deixa no quiosque e volta depois"),
            ("✓", "Não é só máquina automática"),
        ]
        fy = 720
        fb = font(FONT_BOLD, 38)
        for bi, (mark, txt) in enumerate(benefits):
            pp = ease_out_cubic(clamp01((local_t - 0.35 - bi * 0.22) / 0.35))
            x = 110 + int((1 - pp) * 100)
            row = f"{mark}  {txt}"
            # card
            tw, th = text_size(fb, row)
            ld.rounded_rectangle(
                [x - 20, fy - 8, min(W - 80, x + tw + 40), fy + th + 20],
                radius=18,
                fill=(10, 16, 36, int(200 * fade * pp)),
                outline=(*CYAN, int(90 * fade * pp)),
                width=2,
            )
            draw_text_shadow(
                ld,
                (x, fy),
                row,
                fb,
                (*WHITE, int(255 * fade * pp)),
                offset=3,
            )
            fy += 110

    # ----- Scene 5: CTA 15.2–20 -----
    if t >= 15.0:
        local_t = t - 15.0
        fade = ease_out_cubic(clamp01(local_t / 0.45))
        # logo
        lw, lh = LOGO.size
        ly = 420 + int((1 - fade) * 50)
        paste_rgba(layer, LOGO, ((W - lw) // 2, ly), opacity=fade)
        fcta = font(FONT_BOLD, 52)
        cta1 = "Pronto pra higienizar?"
        draw_text_shadow(
            ld,
            (centered_x(fcta, cta1), ly + lh + 40),
            cta1,
            fcta,
            (*WHITE, int(255 * fade)),
            offset=4,
        )
        # WhatsApp button pulse
        pulse = 1.0 + 0.03 * math.sin(local_t * 8)
        btn = "WhatsApp 98 98147-9616"
        fbtn = font(FONT_BOLD, int(40 * pulse))
        tw, th = text_size(fbtn, btn)
        pad_x, pad_y = 48, 28
        bw = int((tw + 2 * pad_x) * pulse)
        bh = th + 2 * pad_y
        bx = (W - bw) // 2
        by = ly + lh + 130
        ld.rounded_rectangle(
            [bx, by, bx + bw, by + bh],
            radius=bh // 2,
            fill=(37, 211, 102, int(230 * fade)),
        )
        draw_text_shadow(
            ld,
            (bx + (bw - tw) // 2, by + pad_y - 4),
            btn,
            fbtn,
            (*WHITE, int(255 * fade)),
            offset=2,
        )
        fsite = font(FONT_BOLD, 36)
        site = "zapclinslz.com"
        draw_text_shadow(
            ld,
            (centered_x(fsite, site), by + bh + 50),
            site,
            fsite,
            (*CYAN, int(255 * fade)),
            offset=3,
        )
        fhandle = font(FONT_REG, 34)
        handle = "@zapclinhigienizacao"
        draw_text_shadow(
            ld,
            (centered_x(fhandle, handle), by + bh + 110),
            handle,
            fhandle,
            (*MUTED, int(240 * fade)),
            offset=2,
        )
        tag = "Higienização de capacetes em São Luís / MA"
        ftag = font(FONT_BOLD, 30)
        draw_text_shadow(
            ld,
            (centered_x(ftag, tag), H - 220),
            tag,
            ftag,
            (*GOLD, int(255 * fade)),
            offset=2,
        )

    # top brand chip always subtle after 0.3s
    if t > 0.25:
        op = min(1.0, (t - 0.25) / 0.5) * (0.85 if t < 15 else 0.35)
        chip = "ZapClin"
        fc = font(FONT_BOLD, 34)
        tw, th = text_size(fc, chip)
        ld.rounded_rectangle(
            [48, 64, 48 + tw + 40, 64 + th + 22],
            radius=20,
            fill=(10, 16, 36, int(180 * op)),
            outline=(*CYAN, int(160 * op)),
            width=2,
        )
        draw_text_shadow(ld, (68, 72), chip, fc, (*CYAN, int(255 * op)), offset=2)

    paste_rgba(base, layer)
    # slight sharpen
    rgb = base.convert("RGB")
    return rgb


def main():
    out_mp4 = OUT_DIR / "zapclin-reel-02-8min-9x16.mp4"
    out_mp4_repo = REPO_OUT / "zapclin-reel-02-8min-9x16.mp4"
    caption_path = OUT_DIR / "zapclin-reel-02-legenda.txt"
    caption_repo = REPO_OUT / "zapclin-reel-02-legenda.txt"

    caption = """Pano em casa não tira cheiro de suor do forro.

Em São Luís, a ZapClin higieniza de verdade — a partir de R$ 15 · ~8 min no Golden Shopping Calhau (Quiosque 01).
Ideal pra motoboy e quem vive na rua.

Não é só máquina. É processo profissional.

📍 Calhau · Golden Shopping Calhau
🌐 https://www.zapclinslz.com/
WhatsApp: 98 98147-9616

Salva e manda pro parceiro que tá com o capacete pesado 👇
Link na bio.

#ZapClin #HigienizacaoDeCapacete #SaoLuis #Calhau #GoldenShoppingCalhau #MotoboySLZ #OdorCapacete #Maranhao
"""
    caption_path.write_text(caption, encoding="utf-8")
    caption_repo.write_text(caption, encoding="utf-8")

    print(f"Rendering {NFRAMES} frames @ {FPS}fps…", flush=True)
    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "rawvideo",
        "-vcodec",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{W}x{H}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-t",
        str(DURATION),
        str(out_mp4),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    assert proc.stdin is not None
    try:
        for i in range(NFRAMES):
            frame = render_frame(i)
            proc.stdin.write(frame.tobytes())
            if i % 30 == 0:
                print(f"  {i}/{NFRAMES} ({100*i/NFRAMES:.0f}%)", flush=True)
        proc.stdin.close()
        err = proc.stderr.read().decode("utf-8", errors="replace") if proc.stderr else ""
        rc = proc.wait()
        if rc != 0:
            raise RuntimeError(f"ffmpeg failed {rc}\n{err[-2000:]}")
    except BrokenPipeError as e:
        err = proc.stderr.read().decode("utf-8", errors="replace") if proc.stderr else ""
        raise RuntimeError(err[-2000:]) from e

    # copy to repo for GitHub download
    out_mp4_repo.write_bytes(out_mp4.read_bytes())
    # also write a poster frame
    poster = render_frame(int(4.5 * FPS))
    poster.save(OUT_DIR / "zapclin-reel-02-poster.jpg", quality=92)
    poster.save(REPO_OUT / "zapclin-reel-02-poster.jpg", quality=92)

    print("OK", out_mp4, out_mp4.stat().st_size)
    print("OK", caption_path)


if __name__ == "__main__":
    main()

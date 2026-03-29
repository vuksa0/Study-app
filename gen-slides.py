from PIL import Image, ImageDraw, ImageFont
import os, math, re, urllib.request

OUT = r"C:\Users\vukzi\Downloads\tiktok-slides"
os.makedirs(OUT, exist_ok=True)

W, H   = 1080, 1080
BLACK  = (0, 0, 0)
WHITE  = (255, 255, 255)
GRAY   = (140, 140, 140)
LGRAY  = (210, 210, 210)

FONT_IMPACT = r"C:\Windows\Fonts\impact.ttf"
FONT_LATO_B = r"C:\Windows\Fonts\LatoWeb-Bold.ttf"
FONT_ARIAL  = r"C:\Windows\Fonts\arialbd.ttf"

def f(path, size):
    try:    return ImageFont.truetype(path, size)
    except: return ImageFont.truetype(FONT_ARIAL, size)

def center_x(draw, text, font, y, img_w=W):
    w = draw.textlength(text, font=font)
    return (img_w - w) / 2

def draw_text_centered(draw, text, font, y, color=WHITE):
    x = center_x(draw, text, font, y)
    draw.text((x, y), text, font=font, fill=color)

def draw_sparkle(draw, cx, cy, size, color=WHITE):
    s = size / 32
    def cubic(p0, p1, p2, p3, n=80):
        pts = []
        for i in range(n + 1):
            t = i / n
            mt = 1 - t
            x = mt**3*p0[0] + 3*mt**2*t*p1[0] + 3*mt*t**2*p2[0] + t**3*p3[0]
            y = mt**3*p0[1] + 3*mt**2*t*p1[1] + 3*mt*t**2*p2[1] + t**3*p3[1]
            pts.append((cx + (x-16)*s, cy + (y-16)*s))
        return pts
    pts  = cubic((16,4),(16.5,13),(19,15.5),(28,16))
    pts += cubic((28,16),(19,16.5),(16.5,19),(16,28))
    pts += cubic((16,28),(15.5,19),(13,16.5),(4,16))
    pts += cubic((4,16),(13,15.5),(15.5,13),(16,4))
    draw.polygon(pts, fill=color)

def get_appstore_badge(target_w=400):
    """Download and render the official App Store badge, return as PIL Image."""
    badge_cache = os.path.join(OUT, "_appstore-badge.png")
    if not os.path.exists(badge_cache):
        # Download official SVG from Apple
        url = "https://tools.applemediaservices.com/api/badges/download-on-the-app-store/white/en-us"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as r:
            svg = r.read().decode("utf-8")
        # Scale SVG to target width maintaining ~3:1 aspect ratio
        h = target_w // 3
        svg = re.sub(r"<svg ", f'<svg width="{target_w}" height="{h}" ', svg, count=1)
        html = f'<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000">{svg}</body></html>'
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": target_w + 10, "height": h + 10})
            page.set_content(html)
            page.screenshot(path=badge_cache, clip={"x": 0, "y": 0, "width": target_w, "height": h})
            browser.close()
    return Image.open(badge_cache).convert("RGB")


def paste_appstore_badge(img, cx, center_y, w=400):
    badge = get_appstore_badge(w)
    x = cx - badge.width // 2
    y = center_y - badge.height // 2
    img.paste(badge, (x, y))

# ── Slide data ────────────────────────────────────────────────────────────────
slides = [
    ("cover", {}),
    ("tip", {"n":"01", "head":"STUDY IN\nBLOCKS",   "body":"25 min on · 5 min off · no phone"}),
    ("tip", {"n":"02", "head":"REVIEW\nSAME DAY",    "body":"Don't wait until the night before"}),
    ("tip", {"n":"03", "head":"TEST\nYOURSELF",      "body":"Flashcards beat re-reading every time"}),
    ("tip", {"n":"04", "head":"SLEEP\n8 HOURS",      "body":"Your brain stores memories while you sleep"}),
    ("tip", {"n":"05", "head":"ASK\nQUESTIONS",      "body":"If you're lost, so is everyone else"}),
    ("tip", {"n":"06", "head":"ACTIVE\nRECALL",       "body":"Close the book. Write what you remember."}),
    ("cta",  {}),
]

for i, (kind, data) in enumerate(slides):
    img  = Image.new("RGB", (W, H), BLACK)
    draw = ImageDraw.Draw(img)

    PAD = 80

    # ── COVER ─────────────────────────────────────────────────────────────────
    if kind == "cover":
        f_big  = f(FONT_IMPACT, 148)
        f_mid  = f(FONT_IMPACT, 148)
        f_sub  = f(FONT_LATO_B, 46)
        f_tiny = f(FONT_LATO_B, 28)

        # Top label
        label = "STUDY TIPS"
        lw = draw.textlength(label, font=f_tiny)
        draw.text(((W-lw)/2, PAD + 10), label, font=f_tiny, fill=GRAY)

        # Thin rule
        draw.line([(W//2-80, PAD+58), (W//2+80, PAD+58)], fill=GRAY, width=1)

        # Main text block
        line1 = "HOW TO GET"
        line2 = "BETTER"
        line3 = "GRADES"
        y = 220
        for line, fnt in [(line1, f_big),(line2, f_mid),(line3, f_mid)]:
            draw_text_centered(draw, line, fnt, y)
            y += 160

        # Subtitle
        sub = "7 tips that actually work"
        draw_text_centered(draw, sub, f_sub, y + 20, GRAY)

        # Bottom progress dots (8 total, first filled)
        dot_y = H - PAD - 14
        total = len(slides)
        dot_gap = 22
        start_x = W//2 - (total * dot_gap)//2
        for d in range(total):
            cx = start_x + d * dot_gap + dot_gap//2
            if d == i:
                draw.ellipse([cx-7, dot_y-7, cx+7, dot_y+7], fill=WHITE)
            else:
                draw.ellipse([cx-5, dot_y-5, cx+5, dot_y+5], fill=(*GRAY,))

    # ── TIP ───────────────────────────────────────────────────────────────────
    elif kind == "tip":
        f_num  = f(FONT_LATO_B, 26)
        f_head = f(FONT_IMPACT, 154)
        f_body = f(FONT_LATO_B, 42)
        f_tiny = f(FONT_LATO_B, 26)

        # Slide number top-left
        draw.text((PAD, PAD), data["n"], font=f_num, fill=GRAY)

        # Thin vertical accent line left
        draw.line([(PAD - 24, PAD + 4), (PAD - 24, PAD + 36)], fill=WHITE, width=3)

        # Headline — left aligned, big
        hy = 200
        for line in data["head"].split("\n"):
            draw.text((PAD, hy), line, font=f_head, fill=WHITE)
            hy += 170

        # Thin rule
        draw.line([(PAD, hy + 10), (PAD + 100, hy + 10)], fill=GRAY, width=1)
        hy += 50

        # Body text
        draw.text((PAD, hy), data["body"], font=f_body, fill=LGRAY)

        # Progress dots
        dot_y = H - PAD - 14
        total = len(slides)
        dot_gap = 22
        start_x = W//2 - (total * dot_gap)//2
        for d in range(total):
            cx = start_x + d * dot_gap + dot_gap//2
            if d == i:
                draw.ellipse([cx-7, dot_y-7, cx+7, dot_y+7], fill=WHITE)
            else:
                draw.ellipse([cx-5, dot_y-5, cx+5, dot_y+5], fill=(*GRAY,))

    # ── CTA ───────────────────────────────────────────────────────────────────
    elif kind == "cta":
        f_brand   = f(FONT_IMPACT, 100)
        f_tag     = f(FONT_LATO_B, 42)
        f_url     = f(FONT_LATO_B, 36)
        f_tiny    = f(FONT_LATO_B, 26)

        # Top label
        label = "STUDY SMARTER"
        lw = draw.textlength(label, font=f_tiny)
        draw.text(((W-lw)/2, PAD + 10), label, font=f_tiny, fill=GRAY)
        draw.line([(W//2-80, PAD+58), (W//2+80, PAD+58)], fill=GRAY, width=1)

        # Sparkle logo
        draw_sparkle(draw, W//2, 320, 160, WHITE)

        # Brand name
        bw = draw.textlength("Thinkio", font=f_brand)
        draw.text(((W-bw)/2, 420), "Thinkio", font=f_brand, fill=WHITE)

        # Tagline
        tag1 = "AI quizzes, flashcards & lessons"
        tag2 = "from your notes. Instantly."
        draw_text_centered(draw, tag1, f_tag, 545, LGRAY)
        draw_text_centered(draw, tag2, f_tag, 598, LGRAY)

        # App Store badge (real badge composited onto image)
        paste_appstore_badge(img, W//2, 730, w=440)

        # URL
        uw = draw.textlength("thinkio.app", font=f_url)
        draw.text(((W-uw)/2, 822), "thinkio.app", font=f_url, fill=GRAY)

        # Progress dots
        dot_y = H - PAD - 14
        total = len(slides)
        dot_gap = 22
        start_x = W//2 - (total * dot_gap)//2
        for d in range(total):
            cx = start_x + d * dot_gap + dot_gap//2
            if d == i:
                draw.ellipse([cx-7, dot_y-7, cx+7, dot_y+7], fill=WHITE)
            else:
                draw.ellipse([cx-5, dot_y-5, cx+5, dot_y+5], fill=(*GRAY,))

    out_path = os.path.join(OUT, f"slide-{i+1:02d}.png")
    img.save(out_path)
    print(f"Saved: {out_path}")

print("\nDone →", OUT)

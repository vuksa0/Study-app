from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops, ImageOps
import os, re, urllib.request, urllib.parse, io

BASE    = r"C:\Users\vukzi\Downloads"   # cache files stay here
OUT_DIR = r"C:\Users\vukzi\OneDrive\Desktop\tiktoks"
W, H    = 1080, 1080
BLACK   = (0, 0, 0)
WHITE   = (255, 255, 255)
GRAY    = (160, 160, 160)
LGRAY   = (220, 220, 220)
DGRAY   = (60,  60,  60)
MGRAY   = (100, 100, 100)

FONT_IMPACT = r"C:\Windows\Fonts\impact.ttf"
FONT_LATO_B = r"C:\Windows\Fonts\LatoWeb-Bold.ttf"
FONT_ARIAL  = r"C:\Windows\Fonts\arialbd.ttf"
FONT_SEG_SB = r"C:\Windows\Fonts\seguisb.ttf"
FONT_SEG_BL = r"C:\Windows\Fonts\seguibl.ttf"

BADGE_CACHE       = os.path.join(BASE, "_badge-white-t.png")
BADGE_BLACK_CACHE = os.path.join(BASE, "_badge-black-t.png")
PHONE_IMG         = os.path.join(BASE, "IMG_9294.jpeg")
PHOTO_CACHE       = os.path.join(BASE, "_photo_cache")

def f(path, size):
    try:    return ImageFont.truetype(path, size)
    except: return ImageFont.truetype(FONT_ARIAL, size)

def draw_text_centered(draw, text, font, y, color=WHITE):
    w = draw.textlength(text, font=font)
    draw.text(((W - w) / 2, y), text, font=font, fill=color)

def draw_sparkle(draw, cx, cy, size, color=WHITE):
    s = size / 32
    def cubic(p0, p1, p2, p3, n=80):
        pts = []
        for i in range(n + 1):
            t = i / n; mt = 1 - t
            x = mt**3*p0[0]+3*mt**2*t*p1[0]+3*mt*t**2*p2[0]+t**3*p3[0]
            y = mt**3*p0[1]+3*mt**2*t*p1[1]+3*mt*t**2*p2[1]+t**3*p3[1]
            pts.append((cx+(x-16)*s, cy+(y-16)*s))
        return pts
    pts  = cubic((16,4),(16.5,13),(19,15.5),(28,16))
    pts += cubic((28,16),(19,16.5),(16.5,19),(16,28))
    pts += cubic((16,28),(15.5,19),(13,16.5),(4,16))
    pts += cubic((4,16),(13,15.5),(15.5,13),(16,4))
    draw.polygon(pts, fill=color)

def get_badge(w=440):
    if not os.path.exists(BADGE_CACHE):
        url = "https://tools.applemediaservices.com/api/badges/download-on-the-app-store/white/en-us"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as r:
            svg = r.read().decode("utf-8")
        h = w // 3
        svg = re.sub(r"<svg ", f'<svg width="{w}" height="{h}" ', svg, count=1)
        html = f'<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent">{svg}</body></html>'
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": w+10, "height": h+10})
            page.set_content(html)
            page.screenshot(path=BADGE_CACHE, clip={"x":0,"y":0,"width":w,"height":h}, omit_background=True)
            browser.close()
    return Image.open(BADGE_CACHE).convert("RGBA")

def get_badge_black(w=440):
    if not os.path.exists(BADGE_BLACK_CACHE):
        url = "https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as r:
            svg = r.read().decode("utf-8")
        h = w // 3
        svg = re.sub(r"<svg ", f'<svg width="{w}" height="{h}" ', svg, count=1)
        html = f'<!DOCTYPE html><html><body style="margin:0;padding:0;background:#fff">{svg}</body></html>'
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": w+10, "height": h+10})
            page.set_content(html)
            page.screenshot(path=BADGE_BLACK_CACHE, clip={"x":0,"y":0,"width":w,"height":h})
            browser.close()
    return Image.open(BADGE_BLACK_CACHE).convert("RGB")

def fetch_photo(photo_id):
    """Download a curated Unsplash photo by ID, cached globally."""
    os.makedirs(PHOTO_CACHE, exist_ok=True)
    cache_path = os.path.join(PHOTO_CACHE, f"{photo_id}.jpg")
    if os.path.exists(cache_path):
        return Image.open(cache_path).convert("RGB")
    url = f"https://images.unsplash.com/photo-{photo_id}?w=1080&h=1080&fit=crop&q=80"
    print(f"  Downloading photo {photo_id}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    img = Image.open(io.BytesIO(data)).convert("RGB")
    img = img.resize((W, H), 1)  # 1 = LANCZOS
    img.save(cache_path)
    return img

def add_overlay(img, strength=0.55):
    """Add dark gradient overlay from bottom for text readability."""
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Full dark at bottom, fading to transparent at top
    for y in range(H):
        t = y / H  # 0 = top, 1 = bottom
        alpha = int(max(0, (t - 0.1)) * strength * 255 * 1.4)
        alpha = min(alpha, int(strength * 255))
        draw.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))
    # Also darken top slightly for number badge
    for y in range(180):
        t = 1 - (y / 180)
        alpha = int(t * 120)
        draw.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

APP_SCREENSHOT = r"C:\Users\vukzi\Downloads\IMG_9288.jpeg"

def draw_phone_screenshot(img, px, py, pw, ph):
    """Black iPhone 15 Pro style mockup — Apple website proportions."""
    B, R = 12, 54

    # ── Drop shadow ──
    shadow = Image.new("RGBA", (img.width, img.height), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [px + 10, py + 24, px + pw + 10, py + ph + 24], radius=R, fill=(0, 0, 0, 80)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=32))
    composite = Image.alpha_composite(img.convert("RGBA"), shadow).convert("RGB")
    img.paste(composite)

    draw = ImageDraw.Draw(img)
    FRAME = (26, 26, 28)
    BTN   = (44, 44, 46)

    # ── Apple-website-style buttons ──
    draw.rounded_rectangle([px - 5, py + int(ph*0.115), px + 2, py + int(ph*0.135)], radius=3, fill=BTN)  # action
    draw.rounded_rectangle([px - 5, py + int(ph*0.180), px + 2, py + int(ph*0.245)], radius=3, fill=BTN)  # vol+
    draw.rounded_rectangle([px - 5, py + int(ph*0.268), px + 2, py + int(ph*0.333)], radius=3, fill=BTN)  # vol-
    draw.rounded_rectangle([px + pw - 2, py + int(ph*0.195), px + pw + 5, py + int(ph*0.345)], radius=3, fill=BTN)

    # ── Phone frame ──
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=R, fill=FRAME)

    # ── Screen ──
    sx = px + B;  sy = py + B
    sw = pw - 2 * B;  sh = ph - 2 * B

    raw = Image.open(APP_SCREENSHOT).convert("RGB")
    raw = raw.rotate(270, expand=True)
    raw = raw.crop((1050, 1680, 3160, 5650))
    scale = sw / raw.width
    new_h = int(raw.height * scale)
    raw = raw.resize((sw, new_h), Image.LANCZOS)
    if new_h > sh:
        raw = raw.crop((0, 0, sw, sh))

    # ── Patch name: replace entire "Good afternoon, vuk!" line ──
    _sc   = sw / 336
    _fn_p = f(FONT_LATO_B, max(9, round(11 * _sc)))
    _dp   = ImageDraw.Draw(raw)
    _bg_p = raw.getpixel((int(sw * 0.80), round(113 * _sc)))
    _py0  = round(103 * _sc);  _py1 = round(126 * _sc)
    _dp.rectangle([9, _py0, round(sw * 0.67), _py1], fill=_bg_p)
    _dp.text((12, _py0 + 1), "Good afternoon, User!", font=_fn_p, fill=(5, 5, 5))

    screen = Image.new("RGB", (sw, sh), (245, 245, 248))
    screen.paste(raw, (0, 0))

    mask = Image.new("L", (sw, sh), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, sw - 1, sh - 1], radius=max(1, R - B - 2), fill=255)
    img.paste(screen, (sx, sy), mask=mask)

    # ── Dynamic Island ──
    di_w = int(sw * 0.30);  di_h = int(sw * 0.065)
    di_x = sx + (sw - di_w) // 2;  di_y = sy + 7
    draw.rounded_rectangle([di_x, di_y, di_x + di_w, di_y + di_h], radius=di_h // 2, fill=(10, 10, 10))

    # ── Frame edge highlight ──
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=R, outline=(52, 52, 56), width=1)


def draw_phone_quiz(img, px, py, pw, ph, accent=(16, 185, 129)):
    """Draw a phone mockup with a sample Biology quiz UI."""
    draw = ImageDraw.Draw(img)
    B, R = 10, 34

    draw.rounded_rectangle([px, py, px+pw, py+ph], radius=R, fill=(28,28,28), outline=(58,58,58), width=B)
    sx = px + B + 3;  sy = py + B + 3
    sw = pw - 2*(B+3); sh = ph - 2*(B+3)
    draw.rectangle([sx, sy, sx+sw, sy+sh], fill=(9, 9, 17))

    # Dynamic island
    ni_w, ni_h = 58, 14
    draw.rounded_rectangle([sx+sw//2-ni_w//2, sy+7, sx+sw//2+ni_w//2, sy+7+ni_h], radius=7, fill=(28,28,28))
    draw.text((sx+10, sy+7), "9:41", font=f(FONT_LATO_B, 13), fill=(160,160,160))

    # Header bar
    hy = sy + 30
    draw.rectangle([sx, hy, sx+sw, hy+34], fill=(13,13,23))
    draw.text((sx+10, hy+8), "Biology  \u2022  Quiz", font=f(FONT_LATO_B, 15), fill=accent)

    # Question count
    qy = hy + 42
    draw.text((sx+10, qy), "Question 3 of 10", font=f(FONT_LATO_B, 11), fill=(75,75,100))

    # Question text
    qy += 18
    for line in ["What is the", "powerhouse of the cell?"]:
        draw.text((sx+10, qy), line, font=f(FONT_LATO_B, 17), fill=WHITE)
        qy += 24

    # Answer options
    opts = [("Nucleus", False), ("Mitochondria", True), ("Ribosome", False), ("Golgi Body", False)]
    oy = qy + 10
    f_opt = f(FONT_LATO_B, 15)
    OPT_H = 36
    for opt_text, selected in opts:
        obg = accent if selected else (17,17,29)
        obd = accent if selected else (42,42,60)
        ofg = WHITE   if selected else (130,130,155)
        draw.rounded_rectangle([sx+7, oy, sx+sw-7, oy+OPT_H], radius=9, fill=obg, outline=obd, width=1)
        rcy = oy + OPT_H // 2
        if selected:
            draw.ellipse([sx+17, rcy-5, sx+27, rcy+5], fill=WHITE)
        else:
            draw.ellipse([sx+17, rcy-5, sx+27, rcy+5], outline=obd, width=2)
        draw.text((sx+34, oy+OPT_H//2-8), opt_text, font=f_opt, fill=ofg)
        oy += OPT_H + 9

    # Next button
    nb_y = oy + 6
    draw.rounded_rectangle([sx+7, nb_y, sx+sw-7, nb_y+38], radius=10, fill=accent)
    btn_txt = "Next Question"
    f_btn = f(FONT_LATO_B, 15)
    btw = int(draw.textlength(btn_txt, font=f_btn))
    draw.text((sx+(sw-btw)//2, nb_y+11), btn_txt, font=f_btn, fill=WHITE)


def render_photo_cover(photo_id, cover_label, lines, subtitle, accent):
    img = fetch_photo(photo_id)
    img = add_overlay(img, strength=0.65)
    draw = ImageDraw.Draw(img)
    PAD = 80

    f_tiny = f(FONT_LATO_B, 28)
    lw = draw.textlength(cover_label, font=f_tiny)
    draw.text(((W-lw)/2, PAD+10), cover_label, font=f_tiny, fill=accent)
    draw.line([(W//2-80, PAD+58),(W//2+80, PAD+58)], fill=accent, width=1)

    y = 220
    for text, size in lines:
        fnt = f(FONT_IMPACT, size)
        draw_text_centered(draw, text, fnt, y)
        y += size + 12

    f_sub = f(FONT_LATO_B, 44)
    draw_text_centered(draw, subtitle, f_sub, y + 30, accent)
    return img

def render_photo_tip(photo_id, n, head, body, accent):
    img = fetch_photo(photo_id)
    img = add_overlay(img, strength=0.6)
    draw = ImageDraw.Draw(img)
    PAD = 80

    f_num  = f(FONT_LATO_B, 26)
    f_head = f(FONT_IMPACT, 154)
    f_body = f(FONT_LATO_B, 42)

    draw.text((PAD, PAD), f"{n:02d}", font=f_num, fill=accent)
    draw.line([(PAD-24, PAD+4),(PAD-24, PAD+36)], fill=accent, width=3)

    hy = 200
    for line in head.split("\n"):
        draw.text((PAD, hy), line, font=f_head, fill=WHITE)
        hy += 170

    draw.line([(PAD, hy+10),(PAD+100, hy+10)], fill=accent, width=2)
    hy += 50
    draw.text((PAD, hy), body, font=f_body, fill=LGRAY)
    return img

def _photo_gradient_stops():
    """Per-row bg colors sampled from phone photo at the exact scale it appears on the slide."""
    _img = Image.open(PHONE_IMG).convert("RGB")
    _img = ImageOps.exif_transpose(_img)
    # Resize to the exact dimensions used when pasting
    pw = 520
    ph = int(pw * _img.height / _img.width)
    phone = _img.resize((pw, ph), Image.LANCZOS)
    py = H - ph  # top y of phone on slide

    EDGE = 30  # pixels to average from each edge strip
    stops = []
    for slide_y in range(H):
        phone_row = max(0, min(ph - 1, slide_y - py))
        l = [phone.getpixel((x, phone_row)) for x in range(EDGE)]
        r = [phone.getpixel((pw - 1 - x, phone_row)) for x in range(EDGE)]
        lr = l + r
        stops.append((
            sum(p[0] for p in lr) // len(lr),
            sum(p[1] for p in lr) // len(lr),
            sum(p[2] for p in lr) // len(lr),
        ))
    return stops

_BG_STOPS = _photo_gradient_stops()

def render_cta():
    # 50-stop gradient sampled from all colours in the photo
    img = Image.new("RGB", (W, H))
    draw_bg = ImageDraw.Draw(img)
    n = len(_BG_STOPS)
    for y in range(H):
        pos = y / (H - 1) * (n - 1)
        i = min(int(pos), n - 2)
        t = pos - i
        a, b = _BG_STOPS[i], _BG_STOPS[i + 1]
        draw_bg.line([(0, y), (W, y)], fill=(
            int(a[0] + (b[0] - a[0]) * t),
            int(a[1] + (b[1] - a[1]) * t),
            int(a[2] + (b[2] - a[2]) * t),
        ))

    # ── Phone photo — rotate upright, no color changes ──
    phone = Image.open(PHONE_IMG).convert("RGB")
    phone = ImageOps.exif_transpose(phone)  # apply EXIF orientation (portrait upright)
    pw_target = 520
    ph_target = int(pw_target * phone.height / phone.width)
    phone = phone.resize((pw_target, ph_target), Image.LANCZOS)

    # Bottom flush with slide bottom
    py = H - ph_target
    px = (W - pw_target) // 2

    # Feathered mask: fade left/right and top edges so photo blends into gradient
    fade_x = int(pw_target * 0.20)
    fade_y = int(ph_target * 0.08)
    smask = Image.new("L", (pw_target, ph_target), 255)
    sd = ImageDraw.Draw(smask)
    for x in range(fade_x):
        a = int(x * 255 / fade_x)
        sd.line([(x, 0), (x, ph_target - 1)], fill=a)
        sd.line([(pw_target - 1 - x, 0), (pw_target - 1 - x, ph_target - 1)], fill=a)
    tmask = Image.new("L", (pw_target, ph_target), 255)
    td = ImageDraw.Draw(tmask)
    for y in range(fade_y):
        a = int(y * 255 / fade_y)
        td.line([(0, y), (pw_target - 1, y)], fill=a)
    mask = ImageChops.darker(smask, tmask)
    img.paste(phone, (px, py), mask=mask)

    # ── Text and badge on top ──
    draw = ImageDraw.Draw(img)
    f_tiny  = f(FONT_LATO_B, 20)
    f_brand = f(FONT_IMPACT, 78)
    f_tag   = f(FONT_LATO_B, 30)

    # App icon: black rounded square with white sparkle inside
    icon_size = 140
    icon_x = W // 2 - icon_size // 2
    icon_y = 44
    draw.rounded_rectangle([icon_x, icon_y, icon_x + icon_size, icon_y + icon_size], radius=32, fill=BLACK)
    draw_sparkle(draw, W // 2, icon_y + icon_size // 2, 90, WHITE)

    bw = draw.textlength("Thinkio", font=f_brand)
    draw.text(((W - bw) / 2, icon_y + icon_size + 14), "Thinkio", font=f_brand, fill=WHITE)

    draw_text_centered(draw, "Join the waitlist and get", f_tag, 320, WHITE)
    draw_text_centered(draw, "notified when we launch!", f_tag, 358, WHITE)

    badge = get_badge(340)
    bx, by = W//2 - badge.width//2, 465 - badge.height//2
    img.paste(badge, (bx, by), mask=badge.split()[3])
    return img

# ── Verified Unsplash photo IDs — 17 unique photos ────────────────────────────
DESK       = "1434030216411-0b793f4b4173"  # student at desk reading
COFFEE     = "1488190211105-8b0e65b80b4e"  # cozy study with coffee
CONFIDENT  = "1454165804606-c3d57bc86b40"  # confident studying
WRITING    = "1606326608606-aa0b62935f2b"  # student writing focused
BOOKS      = "1516979187457-637abb4f9353"  # books / knowledge
LIBRARY    = "1513258496099-48168024aec0"  # student in library
HEADPHONES = "1507003211169-0a1dd7228f2d"  # student with headphones
BOOKSHELF  = "1456406644174-8ddd4cd52a06"  # books on shelf
CAMPUS     = "1427504494785-3a9ca7044f45"  # university campus
NOTESWRIT  = "1550399105-c4db5fb85c18"     # notes writing
ONLINE     = "1571260899304-425eee4c7efc"  # online learning
NOTEBOOK   = "1503676260728-1c00da094a0b"  # open notebook flat lay
STUDYHOME  = "1588196749597-9ff075ee6b5b"  # studying at home
CLASSROOM  = "1580582932707-520aed937b7b"  # classroom
NOTETABLE  = "1517971053567-8bde93bc6a58"  # notes on table
DESKLAMP   = "1509281373149-e957c6296406"  # desk with lamp
READING    = "1532012197267-da84d127e765"  # reading a book

# ── Slideshow definitions ──────────────────────────────────────────────────────

slideshows = [

    ("01-tiktok-photo-study-effortlessly", "STUDY TIPS", [
        ("STUDY", 148),
        ("EFFORT-", 148),
        ("LESSLY", 148),
    ], "here's how the top students do it", [DESK,HEADPHONES,STUDYHOME,CONFIDENT,CAMPUS,NOTETABLE], (59, 130, 246), [
        (1, "ACTIVE\nRECALL",    "Close the book. Write what you remember."),
        (2, "25 MIN\nBLOCKS",    "Focus in short bursts. No phone allowed."),
        (3, "REVIEW\nSAME DAY",  "10 min after class beats 3 hours cramming."),
        (4, "QUIZ\nYOURSELF",    "Test before you feel ready. That's the point."),
        (5, "USE\nTHINKIO",      "Your notes become quizzes in seconds."),
    ]),

    ("02-tiktok-photo-ace-exam", "EXAM TIPS", [
        ("HOW TO", 148),
        ("ACE ANY", 148),
        ("EXAM", 148),
    ], "5 habits that actually work", [COFFEE,BOOKSHELF,CLASSROOM,WRITING,ONLINE,DESKLAMP], (16, 185, 129), [
        (1, "PAST\nPAPERS",      "Old exams are the closest thing to a cheat code."),
        (2, "TEACH\nIT BACK",    "If you can explain it simply, you know it."),
        (3, "FIX YOUR\nMISTAKES","Every wrong answer is your next study session."),
        (4, "SLEEP\nBEFORE",     "Your brain locks in memories while you sleep."),
        (5, "USE\nTHINKIO",      "AI quizzes & flashcards from your notes. Instantly."),
    ]),

    ("03-tiktok-photo-remember", "MEMORY TIPS", [
        ("HOW TO", 148),
        ("REMEMBER", 130),
        ("EVERYTHING", 110),
    ], "you study — actually", [CONFIDENT,CAMPUS,NOTETABLE,BOOKS,NOTEBOOK,READING], (245, 158, 11), [
        (1, "DON'T\nREREAD",     "Rereading feels productive. It's not."),
        (2, "SPACED\nREPETITION","Review again in 1 day, 3 days, 1 week."),
        (3, "TEACH\nIT OUT LOUD","Say it out loud. Your brain remembers more."),
        (4, "WRITE\nIT DOWN",    "Handwriting beats typing for memory retention."),
        (5, "USE\nTHINKIO",      "Upload your notes. Get a full quiz in seconds."),
    ]),

    ("04-tiktok-photo-focus-tips", "FOCUS TIPS", [
        ("HOW TO", 148),
        ("ACTUALLY", 130),
        ("FOCUS", 148),
    ], "when your brain won't cooperate", [WRITING,ONLINE,DESKLAMP,LIBRARY,STUDYHOME,DESK], (59, 130, 246), [
        (1, "PHONE\nAWAY",       "Not face-down. In another room. Seriously."),
        (2, "25 MIN\nTIMER",     "Set a timer. Work until it rings. Take a real break."),
        (3, "ONE\nTAB ONLY",     "Tab switching destroys deep focus. Close everything."),
        (4, "WRITE\nIT DOWN",    "Brain-dump distractions so your mind can let go."),
        (5, "USE\nTHINKIO",      "Study material ready in seconds. Less setup = more focus."),
    ]),

    ("05-tiktok-photo-night-before", "EXAM TIPS", [
        ("THE NIGHT", 130),
        ("BEFORE", 148),
        ("THE EXAM", 120),
    ], "what to actually do", [BOOKS,NOTEBOOK,READING,HEADPHONES,CLASSROOM,COFFEE], (16, 185, 129), [
        (1, "NO NEW\nSTUFF",     "Don't learn anything new. Review only what you know."),
        (2, "LIGHT\nREVIEW",     "Skim flashcards once. Cramming adds anxiety, not marks."),
        (3, "SLEEP\nBY 10PM",    "One hour more sleep beats two hours more studying."),
        (4, "PREP\nYOUR BAG",    "Lay everything out. Morning-you will be grateful."),
        (5, "USE\nTHINKIO",      "Review your AI flashcards one last time. You're ready."),
    ]),

    ("06-tiktok-photo-why-sessions-fail", "STUDY TIPS", [
        ("WHY YOUR", 130),
        ("STUDY", 148),
        ("FAILS", 148),
    ], "and exactly how to fix it", [LIBRARY,STUDYHOME,DESK,BOOKSHELF,NOTETABLE,CAMPUS], (249, 115, 22), [
        (1, "NO CLEAR\nGOAL",    "\"Study for exam\" is not a goal. \"Finish chapter 3\" is."),
        (2, "STARTING\nTOO LATE","3 days before the exam = anxiety, not learning."),
        (3, "RE-READING\nNOTES", "Feels productive. Proven not to work. Test yourself."),
        (4, "NO BREAKS\nPLANNED","2 hours straight kills quality. Schedule your breaks."),
        (5, "USE\nTHINKIO",      "Turn your notes into quizzes. Study smarter, not longer."),
    ]),

    ("07-tiktok-photo-best-time-study", "STUDY TIPS", [
        ("BEST TIME", 130),
        ("TO STUDY", 130),
        ("REVEALED", 120),
    ], "based on how your brain actually works", [HEADPHONES,CLASSROOM,COFFEE,NOTESWRIT,DESKLAMP,WRITING], (245, 158, 11), [
        (1, "MORNING\nWINS",     "Cortisol peaks keep you sharp and alert. Use it."),
        (2, "AFTER\nA BREAK",    "Post-exercise or post-nap your brain absorbs more."),
        (3, "AVOID\nMIDNIGHT",   "Tired brain = shallow learning. It won't stick."),
        (4, "SAME TIME\nDAILY",  "Your brain prepares to focus when it expects to."),
        (5, "USE\nTHINKIO",      "Generate your quiz any time. Study when you're sharp."),
    ]),

    ("08-tiktok-photo-learn-fast", "SPEED TIPS", [
        ("LEARN ANY", 130),
        ("SUBJECT", 148),
        ("IN A WEEK", 120),
    ], "the fast-track method", [BOOKSHELF,NOTETABLE,CONFIDENT,ONLINE,READING,BOOKS], (6, 182, 212), [
        (1, "GET THE\nOVERVIEW", "Read the syllabus first. Know the shape before details."),
        (2, "DAILY\n30 MINS",    "30 min every day beats a 4-hour session on Friday."),
        (3, "QUIZ\nEARLY",       "Test yourself on day 2. Don't wait to feel ready."),
        (4, "TEACH\nOUT LOUD",   "Explain it like you're teaching a 10-year-old."),
        (5, "USE\nTHINKIO",      "Upload your notes. Get quizzes and flashcards instantly."),
    ]),

    ("09-tiktok-photo-reading-vs-testing", "STUDY SCIENCE", [
        ("READING", 148),
        ("VS", 148),
        ("TESTING", 148),
    ], "one of these actually works", [CAMPUS,DESKLAMP,WRITING,NOTEBOOK,DESK,LIBRARY], (239, 68, 68), [
        (1, "RE-READING\nFEELS GOOD", "Familiarity tricks you into thinking you know it."),
        (2, "TESTING\nIS HARDER",     "Struggling to recall = your brain actually learning."),
        (3, "THE\nVERDICT",           "Testing outperforms re-reading by 2x in every study."),
        (4, "DO IT\nDAILY",           "Even 5 questions a day compounds over a semester."),
        (5, "USE\nTHINKIO",           "Your notes become a quiz in seconds. Test, don't reread."),
    ]),

    ("10-tiktok-photo-adhd-study", "FOCUS TIPS", [
        ("STUDYING", 148),
        ("WITH ADHD", 110),
    ], "tips that actually help", [NOTESWRIT,READING,BOOKS,CLASSROOM,COFFEE,HEADPHONES], (59, 130, 246), [
        (1, "BODY\nDOUBLE",      "Study near someone else. Presence alone boosts focus."),
        (2, "SHORT\nSESSIONS",   "15 mins on, 5 off. Repeat. Don't push through fatigue."),
        (3, "MOVE\nFIRST",       "10 min walk before studying = significantly better focus."),
        (4, "SPEAK\nIT ALOUD",   "Read notes out loud. It activates more of your brain."),
        (5, "USE\nTHINKIO",      "Bite-sized flashcards fit your brain. No wall of text."),
    ]),

    ("11-tiktok-photo-study-schedule", "SCHEDULE TIPS", [
        ("THE PERFECT", 120),
        ("STUDY", 148),
        ("SCHEDULE", 130),
    ], "for students who want results", [ONLINE,DESK,LIBRARY,STUDYHOME,BOOKSHELF,CAMPUS], (16, 185, 129), [
        (1, "REVIEW\nDAILY",     "10 min after every class. Before you forget anything."),
        (2, "DEEP WORK\nBLOCKS", "2–3 hour focused blocks, 3x per week. No multitasking."),
        (3, "ROTATE\nSUBJECTS",  "Don't do one subject every day. Rotation builds memory."),
        (4, "BUFFER\nDAYS",      "Keep one day free. Life happens. Buffer days save you."),
        (5, "USE\nTHINKIO",      "Your study material is always ready. Open and review."),
    ]),

    ("12-tiktok-photo-habits-stick", "HABIT TIPS", [
        ("STUDY HABITS", 120),
        ("THAT", 148),
        ("STICK", 148),
    ], "backed by science", [NOTEBOOK,COFFEE,HEADPHONES,NOTETABLE,WRITING,NOTESWRIT], (245, 158, 11), [
        (1, "START\nSMALL",      "5 minutes a day beats 2 hours you'll skip. Start tiny."),
        (2, "SAME\nTRIGGER",     "Study after the same event every day. Brain learns cues."),
        (3, "TRACK\nYOUR WINS",  "Check off every session. Streaks become addictive."),
        (4, "REWARD\nYOURSELF",  "Small rewards after sessions reinforce the habit loop."),
        (5, "USE\nTHINKIO",      "Open the app. That's your daily trigger. Just open it."),
    ]),

    ("13-tiktok-photo-stop-wasting-time", "TIME TIPS", [
        ("STOP", 148),
        ("WASTING", 130),
        ("STUDY TIME", 110),
    ], "mistakes students make every day", [STUDYHOME,BOOKS,CAMPUS,DESKLAMP,CONFIDENT,ONLINE], (6, 182, 212), [
        (1, "REWRITING\nNOTES",  "Looks productive. Barely moves the needle."),
        (2, "STUDYING\nHUNGRY",  "Low blood sugar kills focus. Eat before you sit down."),
        (3, "NO CLEAR\nEND TIME","Open-ended sessions drag. Set a stop time."),
        (4, "WAITING TO\nFEEL READY","You never will. Start messy. Momentum builds."),
        (5, "USE\nTHINKIO",      "No setup, no excuses. Upload notes, get questions instantly."),
    ]),
]

# ── Generate ───────────────────────────────────────────────────────────────────

print("Generating photo slideshows...\n")

os.makedirs(OUT_DIR, exist_ok=True)
for folder, label, cover_lines, cover_sub, photos, accent, tips in slideshows:
    out = os.path.join(OUT_DIR, folder)
    os.makedirs(out, exist_ok=True)
    print(f"Slideshow: {folder}")

    slides = []
    # cover
    slides.append(("cover", None))
    for t in tips:
        slides.append(("tip", t))
    slides.append(("cta", None))

    for i, (kind, data) in enumerate(slides):
        photo_idx = min(i, len(photos) - 1)

        if kind == "cover":
            img = render_photo_cover(photos[photo_idx], label, cover_lines, cover_sub, accent)
        elif kind == "tip":
            img = render_photo_tip(photos[photo_idx], data[0], data[1], data[2], accent)
        else:
            img = render_cta()

        path = os.path.join(out, f"slide-{i+1:02d}.png")
        img.save(path)
        print(f"  slide-{i+1:02d}.png")

    print(f"Done: {out}\n")

print("All done.")

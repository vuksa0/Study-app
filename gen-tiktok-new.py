from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops, ImageOps
import os, re, urllib.request, urllib.parse, io

BASE    = r"C:\Users\vukzi\Downloads"
OUT_DIR = r"C:\Users\vukzi\OneDrive\Desktop\Content\tiktoks"
W, H    = 1080, 1920   # 9:16 TikTok format
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

PHOTO_CACHE = os.path.join(BASE, "_photo_cache_tiktok")

def f(path, size):
    try:    return ImageFont.truetype(path, size)
    except: return ImageFont.truetype(FONT_ARIAL, size)

def draw_text_centered(draw, text, font, y, color=WHITE, w=W):
    tw = draw.textlength(text, font=font)
    draw.text(((w - tw) / 2, y), text, font=font, fill=color)

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

def fetch_photo(photo_id, w=W, h=H):
    os.makedirs(PHOTO_CACHE, exist_ok=True)
    key = f"{photo_id}_{w}x{h}"
    cache_path = os.path.join(PHOTO_CACHE, f"{key}.jpg")
    if os.path.exists(cache_path):
        return Image.open(cache_path).convert("RGB")
    url = f"https://images.unsplash.com/photo-{photo_id}?w={w}&h={h}&fit=crop&q=80"
    print(f"  Downloading photo {photo_id}...")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        img = img.resize((w, h), Image.LANCZOS)
        img.save(cache_path)
        return img
    except Exception as e:
        print(f"  WARNING: Could not download {photo_id} ({e}) — using dark fallback")
        fallback = Image.new("RGB", (w, h), (18, 18, 22))
        return fallback

def add_overlay(img, strength=0.70, style="bottom"):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    if style == "bottom":
        # Heavy bottom gradient for text
        for y in range(H):
            t = y / H
            alpha = int(max(0, (t - 0.2)) * strength * 255 * 1.6)
            alpha = min(alpha, int(strength * 255))
            draw.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))
        # Light top darkening
        for y in range(300):
            t = 1 - (y / 300)
            alpha = int(t * 140)
            draw.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))
    elif style == "full":
        # Full dark overlay
        for y in range(H):
            alpha = int(strength * 200)
            draw.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))
    elif style == "center":
        # Darker in center-bottom area
        for y in range(H):
            t = y / H
            if t > 0.3:
                alpha = int((t - 0.3) * strength * 255 * 1.8)
                alpha = min(alpha, int(strength * 255))
            else:
                alpha = int((1 - t/0.3) * 120)
            draw.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

def add_color_tint(img, color, alpha=40):
    """Add a subtle color tint to the image."""
    tint = Image.new("RGBA", (W, H), (*color, alpha))
    return Image.alpha_composite(img.convert("RGBA"), tint).convert("RGB")

def wrapped_lines(draw, text, font, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=font) <= max_w:
            cur = test
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

# ── Slide renderers ────────────────────────────────────────────────────────────

def render_cover(photo_id, label, hook, subtitle, accent, overlay_style="bottom"):
    """Cover slide: hook question is the big main text."""
    img = fetch_photo(photo_id)
    img = add_overlay(img, strength=0.72, style=overlay_style)
    draw = ImageDraw.Draw(img)
    PAD = 90

    # Top label
    f_label = f(FONT_LATO_B, 32)
    lw = draw.textlength(label, font=f_label)
    draw.text(((W-lw)/2, PAD+12), label, font=f_label, fill=accent)
    draw.line([(W//2-90, PAD+66),(W//2+90, PAD+66)], fill=accent, width=2)

    # Hook question — big centered main text
    f_hook = f(FONT_LATO_B, 88)
    hook_lines = wrapped_lines(draw, hook, f_hook, W - 2 * PAD)
    total_h = len(hook_lines) * 108
    hy = H // 2 - total_h // 2 - 50
    for line in hook_lines:
        draw_text_centered(draw, line, f_hook, hy, WHITE)
        hy += 108

    # Subtitle
    f_sub = f(FONT_LATO_B, 48)
    draw_text_centered(draw, subtitle, f_sub, hy + 40, accent)

    # Swipe indicator at bottom
    f_swipe = f(FONT_LATO_B, 28)
    draw_text_centered(draw, "swipe →", f_swipe, H - 120, (180, 180, 180))

    return img


def render_headline(photo_id, label, title_lines, subtitle, accent, overlay_style="bottom"):
    """Second slide: bold Impact headline (old cover content)."""
    img = fetch_photo(photo_id)
    img = add_overlay(img, strength=0.72, style=overlay_style)
    draw = ImageDraw.Draw(img)
    PAD = 90

    # Top label
    f_label = f(FONT_LATO_B, 32)
    lw = draw.textlength(label, font=f_label)
    draw.text(((W-lw)/2, PAD+12), label, font=f_label, fill=accent)
    draw.line([(W//2-90, PAD+66),(W//2+90, PAD+66)], fill=accent, width=2)

    # Title — centered, large Impact
    y = H // 2 - 200
    for text, size in title_lines:
        fnt = f(FONT_IMPACT, size)
        draw_text_centered(draw, text, fnt, y)
        y += size + 16

    # Subtitle
    f_sub = f(FONT_LATO_B, 48)
    draw_text_centered(draw, subtitle, f_sub, y + 40, accent)

    # Swipe indicator at bottom
    f_swipe = f(FONT_LATO_B, 28)
    draw_text_centered(draw, "swipe →", f_swipe, H - 120, (180, 180, 180))

    return img

def render_tip(photo_id, n, head, body, accent, overlay_style="bottom"):
    img = fetch_photo(photo_id)
    img = add_overlay(img, strength=0.68, style=overlay_style)
    draw = ImageDraw.Draw(img)
    PAD = 90

    # Number badge top-left
    f_num  = f(FONT_LATO_B, 30)
    draw.text((PAD, PAD + 10), f"{n:02d}", font=f_num, fill=accent)
    draw.line([(PAD-28, PAD+12),(PAD-28, PAD+50)], fill=accent, width=4)

    # Thinkio sparkle top-right
    draw_sparkle(draw, W - PAD - 20, PAD + 35, 52, WHITE)

    # Big headline in lower half
    f_head = f(FONT_IMPACT, 170)
    hy = H // 2 + 60
    for line in head.split("\n"):
        lw = draw.textlength(line, font=f_head)
        draw.text(((W - lw) / 2, hy), line, font=f_head, fill=WHITE)
        hy += 185

    # Body text
    f_body = f(FONT_LATO_B, 46)
    body_lines = wrapped_lines(draw, body, f_body, W - 2 * PAD)
    by = hy + 30
    for line in body_lines:
        lw = draw.textlength(line, font=f_body)
        draw.text(((W - lw) / 2, by), line, font=f_body, fill=LGRAY)
        by += 62

    # Accent line under headline
    draw.line([(W//2 - 80, hy - 20),(W//2 + 80, hy - 20)], fill=accent, width=3)

    return img

def render_stat(photo_id, stat_big, stat_label, body, accent):
    """Special slide for big statistics."""
    img = fetch_photo(photo_id)
    img = add_overlay(img, strength=0.80, style="full")
    img = add_color_tint(img, (0, 0, 0), 60)
    draw = ImageDraw.Draw(img)
    PAD = 90

    draw_sparkle(draw, W//2, PAD + 60, 80, accent)

    f_stat = f(FONT_IMPACT, 220)
    sw = draw.textlength(stat_big, font=f_stat)
    draw.text(((W - sw) / 2, H//2 - 260), stat_big, font=f_stat, fill=WHITE)

    f_label = f(FONT_IMPACT, 80)
    lw = draw.textlength(stat_label, font=f_label)
    draw.text(((W - lw) / 2, H//2 - 260 + 235), stat_label, font=f_label, fill=accent)

    f_body = f(FONT_LATO_B, 48)
    body_lines = wrapped_lines(draw, body, f_body, W - 2 * PAD)
    by = H//2 + 60
    for line in body_lines:
        lw = draw.textlength(line, font=f_body)
        draw.text(((W - lw) / 2, by), line, font=f_body, fill=LGRAY)
        by += 65

    return img

PHONE_IMG = r"C:\Users\vukzi\Downloads\IMG_9294.jpeg"
# Phone display width — large enough to fill bottom portion of 9:16 canvas
_CTA_PW = 960

def _cta_bg_stops():
    try:
        _img = Image.open(PHONE_IMG).convert("RGB")
        _img = ImageOps.exif_transpose(_img)
        ph = int(_CTA_PW * _img.height / _img.width)
        phone = _img.resize((_CTA_PW, ph), Image.LANCZOS)
        py = H - ph
        EDGE = 30
        stops = []
        for slide_y in range(H):
            phone_row = max(0, min(ph - 1, slide_y - py))
            l = [phone.getpixel((x, phone_row)) for x in range(EDGE)]
            r = [phone.getpixel((_CTA_PW - 1 - x, phone_row)) for x in range(EDGE)]
            lr = l + r
            stops.append((
                sum(p[0] for p in lr) // len(lr),
                sum(p[1] for p in lr) // len(lr),
                sum(p[2] for p in lr) // len(lr),
            ))
        return stops
    except Exception:
        return [(18, 18, 22)] * H

_BG_STOPS = _cta_bg_stops()

def render_cta(photo_id, accent):
    # Gradient background sampled from phone photo edges (same as old script)
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

    # Phone photo — measure first so we can position text right above it
    phone_top = H // 2  # fallback
    try:
        phone = Image.open(PHONE_IMG).convert("RGB")
        phone = ImageOps.exif_transpose(phone)
        ph_target = int(_CTA_PW * phone.height / phone.width)
        phone = phone.resize((_CTA_PW, ph_target), Image.LANCZOS)
        phone_top = H - ph_target
        px = (W - _CTA_PW) // 2
        fade_x = int(_CTA_PW * 0.20)
        fade_y = int(ph_target * 0.08)
        smask = Image.new("L", (_CTA_PW, ph_target), 255)
        sd = ImageDraw.Draw(smask)
        for x in range(fade_x):
            a = int(x * 255 / fade_x)
            sd.line([(x, 0), (x, ph_target - 1)], fill=a)
            sd.line([(_CTA_PW - 1 - x, 0), (_CTA_PW - 1 - x, ph_target - 1)], fill=a)
        tmask = Image.new("L", (_CTA_PW, ph_target), 255)
        td = ImageDraw.Draw(tmask)
        for y in range(fade_y):
            a = int(y * 255 / fade_y)
            td.line([(0, y), (_CTA_PW - 1, y)], fill=a)
        mask = ImageChops.darker(smask, tmask)
        img.paste(phone, (px, phone_top), mask=mask)
    except Exception:
        pass

    draw = ImageDraw.Draw(img)

    # Text block — vertically centered in the space above the phone
    icon_size = 140
    f_brand  = f(FONT_IMPACT, 78)
    f_tag    = f(FONT_LATO_B, 36)
    block_h  = icon_size + 14 + 90 + 24 + 44 + 24 + 44  # approx total height
    icon_y   = max(30, (phone_top - block_h) // 2)

    icon_x = W // 2 - icon_size // 2
    draw.rounded_rectangle([icon_x, icon_y, icon_x + icon_size, icon_y + icon_size], radius=32, fill=BLACK)
    draw_sparkle(draw, W // 2, icon_y + icon_size // 2, 90, WHITE)

    y_cursor = icon_y + icon_size + 14
    bw = draw.textlength("Thinkio", font=f_brand)
    draw.text(((W - bw) / 2, y_cursor), "Thinkio", font=f_brand, fill=WHITE)

    y_cursor += 90 + 24
    draw_text_centered(draw, "Try our app, link in bio!", f_tag, y_cursor, WHITE)
    y_cursor += 44 + 24
    draw_text_centered(draw, "Quizzes, flashcards & AI lessons", f_tag, y_cursor, LGRAY)
    y_cursor += 44
    draw_text_centered(draw, "from your notes. Free to try.", f_tag, y_cursor, LGRAY)

    return img

# ── NEW Photo IDs (all different from previous script) ──────────────────────────

NIGHT    = "1519501025264-65ba15a82390"  # dark moody desk at night
LAPTOP   = "1461749280684-dccba630e2f6"  # open laptop white
MORNING  = "1495474472287-4d71bcdd2085"  # bright morning coffee
CAFETBL  = "1554118811-1e0d58224f24"     # cafe table minimalist
JOURNAL  = "1455390582262-044cdead277a"  # journal pencil writing
PLANNER  = "1506784365847-bbad939e9335"  # planner/organizer desk
AERIAL   = "1550645612-83f5345afa55"     # aerial flat lay desk
WINDOW   = "1558021212-51b6ecfa0db9"     # student studying by window
TEAMSTD  = "1522202176988-66273c14fd0a"  # group of students studying
PLANT    = "1593642632559-0c6d3fc62b89"  # clean minimal desk plant
FOCUSED2 = "1484377170983-de731d8e9a14"  # focused student close up
SUNRISE  = "1470252649378-9c29740c9fa8"  # sunrise window warm light
NBFLAT   = "1486312338219-ce68d2c6f44d"  # notebook flat lay
LIBRARY2 = "1558618666-fcd25c85cd64"     # library shelves books
CHALK    = "1503428593586-e225b39bae48"  # whiteboard/chalkboard
PENCILS  = "1484788984921-03950022c9ef"  # pencils and tools
OUTDOOR  = "1523240795612-9a054b0db644"  # studying outdoors
NEON     = "1521737711867-e3b97375f902"  # city night neon vibes
COFFEE2  = "1510972074648-a28fb674cebe"  # dark coffee mug moody
IPHONE   = "1512941937669-90a1b58e7e9c"  # phone scrolling hand

# ── 20 Slideshow Definitions ────────────────────────────────────────────────────

slideshows = [

    # 01 – POV: Upload
    ("01-upload-pov", "UPLOAD HACK", [
        ("UPLOAD.", 180),
        ("GET QUIZ.", 180),
        ("10 SECS.", 160),
    ], "no cap.", "How to turn your notes into a quiz instantly?", [LAPTOP, NIGHT, AERIAL, NBFLAT, FOCUSED2, LAPTOP], (59, 130, 246), [
        (1, "OPEN\nTHINKIO",   "Go to thinkio.app. Takes 5 seconds."),
        (2, "DROP\nYOUR FILE", "PDF, photo of notes, Word doc — anything."),
        (3, "PICK\nYOUR MODE", "Quiz, flashcards, lesson, or problems."),
        (4, "CLICK\nGENERATE", "AI reads your notes. Builds your quiz."),
        (5, "START\nSTUDYING", "Done. That's the whole process."),
    ]),

    # 02 – Telefon u šaci
    ("02-phone-away", "FOCUS HACK", [
        ("PHONE", 180),
        ("IN ANOTHER", 140),
        ("ROOM.", 180),
    ], "this is the only thing that works.", "How to eliminate distractions while studying?", [MORNING, WINDOW, PLANT, CAFETBL, SUNRISE, MORNING], (16, 185, 129), [
        (1, "NOT\nFACE DOWN", "Face-down doesn't count. Out of sight only."),
        (2, "DOPAMINE\nTRICK",  "Your brain checks phone to get dopamine hits."),
        (3, "DISTANCE\nWORKS",  "Even 3 meters away = 26% better focus. Proven."),
        (4, "AIRPLANE\nMODE",   "If you must have it: airplane mode. No ping."),
        (5, "USE\nTHINKIO",     "Study on desktop. Phone stays in the other room."),
    ]),

    # 03 – Before/After beleške
    ("03-notes-before-after", "NOTES HACK", [
        ("YOUR", 180),
        ("NOTES →", 160),
        ("QUIZ", 180),
    ], "before vs after Thinkio.", "How to make your messy notes actually useful?", [JOURNAL, NBFLAT, AERIAL, PENCILS, PLANNER, JOURNAL], (245, 158, 11), [
        (1, "YOUR\nNOTES",     "Messy, confusing, hard to review. We know."),
        (2, "UPLOAD\nTHEM",    "Photo or PDF. Any format. Thinkio reads it all."),
        (3, "AI\nPROCESSES",   "Extracts the key concepts in seconds."),
        (4, "FLASHCARDS\nOUT", "Clean, structured, ready to flip and memorize."),
        (5, "TEST\nYOURSELF",  "Same material. 10x easier to actually learn."),
    ]),

    # 04 – Noć pre ispita
    ("04-night-before-exam", "EXAM EVE", [
        ("NIGHT", 180),
        ("BEFORE", 180),
        ("EXAM.", 180),
    ], "here's what you actually do.", "What should you do the night before an exam?", [NIGHT, COFFEE2, NEON, FOCUSED2, WINDOW, NIGHT], (239, 68, 68), [
        (1, "CLOSE\nTHE BOOKS", "No new information tonight. Review only."),
        (2, "10 MIN\nFLASHCARDS","Quick pass through your Thinkio flashcards."),
        (3, "EAT\nSOMETHING",   "Blood sugar low = brain fog. Eat real food."),
        (4, "SLEEP\nBY 10PM",   "Memory consolidates during sleep. Not cramming."),
        (5, "YOU'RE\nREADY",    "If you've been using Thinkio, you're prepared."),
    ]),

    # 05 – Statistika
    ("05-statistic-punch", "STUDY SCIENCE", [
        ("THE", 160),
        ("NUMBER", 160),
        ("DOESN'T LIE.", 120),
    ], "active recall works.", "Why do students who quiz themselves score 50% higher?", [CHALK, LIBRARY2, TEAMSTD, AERIAL, LAPTOP, CHALK], (6, 182, 212), [
        (1, "50%\nHIGHER",     "Students who quiz themselves score 50% better."),
        (2, "NOT\nSTUDY TIME", "Longer sessions don't predict better grades."),
        (3, "NOT\nRE-READING", "Passive review fools your brain into fake confidence."),
        (4, "TESTING\nWINS",   "The struggle to recall = your brain learning."),
        (5, "USE\nTHINKIO",    "Quiz yourself daily. Watch grades change."),
    ]),

    # 06 – Zašto sam pao
    ("06-why-i-failed", "REAL TALK", [
        ("I STUDIED", 150),
        ("6 HOURS.", 180),
        ("FAILED.", 180),
    ], "here's exactly why.", "Why do students fail even after studying for hours?", [OUTDOOR, MORNING, WINDOW, PLANT, FOCUSED2, OUTDOOR], (249, 115, 22), [
        (1, "PASSIVE\nLEARNING", "Reading = familiarity. Testing = actual knowledge."),
        (2, "NO\nACTIVE RECALL","I never made myself retrieve the information."),
        (3, "TOO MUCH\nAT ONCE", "Cramming 6 hours straight. Brain was overloaded."),
        (4, "ZERO\nPRACTICE",   "I read the textbook. Never did a single practice question."),
        (5, "SWITCH\nMETHODS",  "Upload notes to Thinkio. Start testing yourself daily."),
    ]),

    # 07 – App demo
    ("07-app-saves-semester", "APP DEMO", [
        ("THIS APP", 160),
        ("SAVED MY", 160),
        ("SEMESTER.", 140),
    ], "not clickbait.", "Which app actually helps you study smarter?", [IPHONE, LAPTOP, NIGHT, AERIAL, CAFETBL, IPHONE], (16, 185, 129), [
        (1, "PICK\nSUBJECT",   "Choose from built-in subjects or add your own."),
        (2, "OR\nUPLOAD",      "Drop your lecture PDF. Thinkio reads it instantly."),
        (3, "GET\nLESSON",     "Full AI lesson covering every key topic."),
        (4, "THEN\nFLASHCARDS","Review the key terms. Flip until you know them."),
        (5, "THEN\nQUIZ",      "Test yourself. See your weak spots. Fix them."),
    ]),

    # 08 – Kriva zaboravljanja
    ("08-forgetting-curve", "BRAIN SCIENCE", [
        ("YOUR BRAIN", 140),
        ("FORGETS", 160),
        ("70% TODAY.", 130),
    ], "unless you do this.", "Why does your brain forget 70% of what you studied?", [CHALK, LIBRARY2, OUTDOOR, TEAMSTD, FOCUSED2, CHALK], (245, 158, 11), [
        (1, "THE\nCURVE",      "You forget 50% within 1 hour. 70% within 24h."),
        (2, "RE-READ\nFAILS",  "Rereading slows the curve but doesn't stop it."),
        (3, "RETRIEVAL\nWORKS","Forcing recall after forgetting = long-term memory."),
        (4, "SPACE\nIT OUT",   "Review at: 1 day, 3 days, 7 days, 21 days."),
        (5, "USE\nTHINKIO",    "Daily flashcards beat the forgetting curve automatically."),
    ]),

    # 09 – Relatable fail
    ("09-studied-nothing-left", "RELATABLE", [
        ("STUDIED", 180),
        ("5 HOURS.", 160),
        ("NOTHING.", 180),
    ], "this is why.", "Why do you study for hours but remember nothing?", [MORNING, JOURNAL, PLANNER, CAFETBL, SUNRISE, MORNING], (59, 130, 246), [
        (1, "DAY 1\nYOU READ",  "Read chapter 4. Feel productive. Close the book."),
        (2, "DAY 2\nYOU FORGET","72 hours later: it's gone. Brain didn't encode it."),
        (3, "THE\nMISTAKE",    "Reading without testing = passive, not learning."),
        (4, "THE\nFIX",        "After every chapter: write 5 questions. Answer them."),
        (5, "USE\nTHINKIO",    "It generates the questions for you. Just do the reps."),
    ]),

    # 10 – AI Tutor
    ("10-ai-tutor-2am", "AI TUTOR", [
        ("AI TUTOR", 160),
        ("AT 2AM.", 180),
        ("ZERO COST.", 140),
    ], "ask anything, anytime.", "What if you had a free AI tutor available 24/7?", [NIGHT, COFFEE2, NEON, IPHONE, FOCUSED2, NIGHT], (6, 182, 212), [
        (1, "ASK\nANYTHING",   "\"Explain integrals by parts\" — step by step."),
        (2, "ANY\nSUBJECT",    "Math, physics, history, coding — all of it."),
        (3, "NO\nJUDGEMENT",   "Ask the dumb question. The AI doesn't care."),
        (4, "AVAILABLE\n24/7", "3am panic before exam? Tutor is right there."),
        (5, "IN\nTHINKIO",     "AI Tutor tab. Free. Always ready. Just ask."),
    ]),

    # 11 – Pomodoro
    ("11-pomodoro-thinkio", "FOCUS FORMULA", [
        ("25 MIN", 180),
        ("FOCUS +", 160),
        ("THINKIO.", 160),
    ], "= the GPA you want.", "How to combine Pomodoro and Thinkio for maximum focus?", [PLANNER, AERIAL, LAPTOP, MORNING, PLANT, PLANNER], (16, 185, 129), [
        (1, "SET\nTIMER",      "25 minutes. One topic. No switching tabs."),
        (2, "WORK\nSESSION",   "Focus until the timer rings. No phone. No social."),
        (3, "THINKIO\nQUIZ",   "5 min break: 10 quick flashcards on Thinkio."),
        (4, "SHORT\nBREAK",    "Stand up. Walk. Get water. Real break only."),
        (5, "REPEAT\n4 TIMES", "After 4 rounds: longer break. You earned it."),
    ]),

    # 12 – Math problems
    ("12-math-problems", "MATH HACK", [
        ("YOU STUDY", 140),
        ("MATH", 180),
        ("WRONG.", 180),
    ], "here's what actually works.", "Why do most students study math the wrong way?", [PENCILS, CHALK, NBFLAT, AERIAL, LAPTOP, PENCILS], (239, 68, 68), [
        (1, "READING\nTHEORY",  "You can read a proof 10 times and still fail."),
        (2, "DO\nPROBLEMS",     "Solving, not reading, is how math enters your brain."),
        (3, "CHECK\nMISTAKES",  "Wrong answer = your next 10 min study topic."),
        (4, "STEP\nBY STEP",    "Show every step. Skipping steps = hidden gaps."),
        (5, "USE\nTHINKIO",     "Get unlimited math problems with full worked solutions."),
    ]),

    # 13 – Sleep vs cramming
    ("13-sleep-beats-cramming", "SLEEP SCIENCE", [
        ("SLEEP", 180),
        ("BEATS", 180),
        ("CRAMMING.", 140),
    ], "this is not optional advice.", "Does sleeping beat cramming the night before an exam?", [SUNRISE, WINDOW, MORNING, OUTDOOR, PLANT, SUNRISE], (59, 130, 246), [
        (1, "WHAT\nSLEEP DOES", "Brain replays and stores everything you learned."),
        (2, "WHAT\nCRAMMING DOES","Overloads working memory. 80% gone by morning."),
        (3, "REM\nSLEEP",       "This is when procedural and concept memory locks in."),
        (4, "AIM FOR\n8 HOURS", "Non-negotiable during exam week. Not 5. Eight."),
        (5, "USE\nTHINKIO",     "Review at 9pm. Sleep at 10. Wake up knowing it."),
    ]),

    # 14 – Custom subject
    ("14-custom-subject", "HIDDEN FEATURE", [
        ("YOUR", 180),
        ("SUBJECT.", 180),
        ("YOUR RULES.", 120),
    ], "Thinkio works for everything.", "Can Thinkio handle subjects outside STEM?", [NBFLAT, JOURNAL, LAPTOP, PLANNER, AERIAL, NBFLAT], (245, 158, 11), [
        (1, "NOT JUST\nSTEM",   "History, law, anatomy, literature — all supported."),
        (2, "ADD\nYOUR TOPIC",  "Create a custom subject in 30 seconds."),
        (3, "AI\nGENERATES",   "Full quiz and flashcards for your exact content."),
        (4, "OR\nUPLOAD",      "Drop your lecture notes. AI handles the rest."),
        (5, "ANY\nSUBJECT",    "If you study it, Thinkio can quiz you on it."),
    ]),

    # 15 – Knjiga vs Thinkio
    ("15-book-vs-thinkio", "TIME HACK", [
        ("400 PAGES", 140),
        ("VS", 180),
        ("10 MINUTES.", 130),
    ], "you already know who wins.", "Is reading a 400-page textbook really necessary?", [LIBRARY2, TEAMSTD, CHALK, OUTDOOR, CAFETBL, LIBRARY2], (6, 182, 212), [
        (1, "400\nPAGES",      "Nobody has time. Nobody reads it all. Be honest."),
        (2, "UPLOAD\nTHE PDF", "Drop the textbook chapter into Thinkio."),
        (3, "AI\nSUMMARIZES",  "Key concepts extracted. Fluff removed."),
        (4, "QUIZ\nGENERATED", "20 questions covering the entire chapter."),
        (5, "10 MIN\nFLASHCARDS","That's your entire study session for that chapter."),
    ]),

    # 16 – Essay practice
    ("16-essay-graded-by-ai", "ESSAY HACK", [
        ("AI GRADES", 150),
        ("YOUR", 180),
        ("ESSAY.", 180),
    ], "like having a 24/7 teacher.", "Can AI actually grade your essays like a real teacher?", [JOURNAL, PENCILS, NBFLAT, WINDOW, MORNING, JOURNAL], (249, 115, 22), [
        (1, "PICK\nA TOPIC",   "Any subject: literature, history, philosophy."),
        (2, "AI\nPROMPTS YOU", "Real essay question, just like your exam."),
        (3, "WRITE\nIT",       "Full response. No shortcuts. Treat it like the real thing."),
        (4, "AI\nGRADES IT",   "Scores your analysis, structure, and clarity."),
        (5, "IMPROVE\nIT",     "See exactly where you lost marks. Fix those spots."),
    ]),

    # 17 – Coding
    ("17-coding-thinkio", "DEV STUDY", [
        ("LEARN TO", 150),
        ("CODE", 180),
        ("FASTER.", 180),
    ], "practice problems beat tutorials.", "What is the fastest way to actually learn to code?", [LAPTOP, NIGHT, NEON, IPHONE, FOCUSED2, LAPTOP], (16, 185, 129), [
        (1, "TUTORIALS\nTRAP",  "Watching tutorials ≠ knowing how to code."),
        (2, "SOLVE\nPROBLEMS",  "Struggling through a problem = actual learning."),
        (3, "AI\nCHALLENGE",   "Thinkio generates coding tasks at your level."),
        (4, "AI\nCHECKS CODE", "Submit your solution. Get feedback instantly."),
        (5, "LEVEL\nUP DAILY",  "One problem a day. You'll be shocked in 30 days."),
    ]),

    # 18 – Upload foto
    ("18-photo-to-quiz", "PHOTO HACK", [
        ("PHOTO", 180),
        ("OF NOTES", 160),
        ("→ QUIZ.", 180),
    ], "in 10 seconds.", "Can a phone photo of your notes really become a quiz?", [IPHONE, AERIAL, CAFETBL, MORNING, PLANT, IPHONE], (59, 130, 246), [
        (1, "IN\nCLASS",       "Professor writes something important on the board."),
        (2, "SNAP\nA PHOTO",   "Take the photo. Don't transcribe. Save time."),
        (3, "UPLOAD\nLATER",   "After class: drop the photo into Thinkio."),
        (4, "AI\nREADS IT",    "Handwriting, diagrams, formulas — all recognized."),
        (5, "GET\nA QUIZ",     "10 seconds. Quiz from your own classroom notes."),
    ]),

    # 19 – Anksioznost
    ("19-exam-anxiety-fix", "ANXIETY HACK", [
        ("EXAM", 180),
        ("ANXIETY", 160),
        ("FIXED.", 180),
    ], "one root cause. one fix.", "What is the real cause of exam anxiety — and how to fix it?", [SUNRISE, WINDOW, OUTDOOR, PLANT, MORNING, SUNRISE], (6, 182, 212), [
        (1, "THE\nREAL CAUSE",  "Anxiety = uncertainty. You don't know what you know."),
        (2, "NOT\nMORE STUDY",  "More hours won't fix it. Testing yourself will."),
        (3, "QUIZ\nYOURSELF",  "Simulate the exam before the exam. Daily."),
        (4, "CONFIDENCE\nGROWS","Each correct answer reduces fear. This is science."),
        (5, "USE\nTHINKIO",    "Test yourself until you stop feeling scared. It works."),
    ]),

    # 20 – Challenge
    ("20-daily-challenge", "THE CHALLENGE", [
        ("15 MINUTES", 130),
        ("PER DAY.", 160),
        ("365 DAYS.", 160),
    ], "call me in a year.", "What happens if you study just 15 minutes a day for a year?", [TEAMSTD, OUTDOOR, MORNING, FOCUSED2, WINDOW, TEAMSTD], (249, 115, 22), [
        (1, "DAY 1\nSTARTS",    "15 minutes on Thinkio. Flashcards or a quiz."),
        (2, "DAY 30\nNOTICE",   "You'll notice you remember things you used to forget."),
        (3, "DAY 90\nSHIFT",    "Studying feels automatic. The habit is locked in."),
        (4, "DAY 365\nRESULTS", "Look at your grades vs. a year ago. Then tell me."),
        (5, "START\nTODAY",     "Open Thinkio. 15 minutes. That's the whole challenge."),
    ]),

]

# ── Generate ────────────────────────────────────────────────────────────────────

print("Generating TikTok photo slideshows (9:16 format)...\n")
os.makedirs(OUT_DIR, exist_ok=True)

for folder, label, cover_lines, cover_sub, hook, photos, accent, tips in slideshows:
    out = os.path.join(OUT_DIR, folder)
    os.makedirs(out, exist_ok=True)
    print(f">> {folder}")

    slides = [("cover", None), ("headline", None)] + [("tip", t) for t in tips] + [("cta", None)]

    for i, (kind, data) in enumerate(slides):
        photo_idx = i % len(photos)
        pid = photos[photo_idx]

        if kind == "cover":
            img = render_cover(pid, label, hook, cover_sub, accent)
        elif kind == "headline":
            img = render_headline(pid, label, cover_lines, cover_sub, accent)
        elif kind == "tip":
            img = render_tip(pid, data[0], data[1], data[2], accent)
        else:
            img = render_cta(pid, accent)

        path = os.path.join(out, f"slide-{i+1:02d}.png")
        img.save(path)
        print(f"  slide-{i+1:02d}.png ok")

    print(f"  → {out}\n")

print("All 20 slideshows done.")

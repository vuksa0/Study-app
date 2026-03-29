from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops, ImageOps
import os, re, urllib.request

BASE    = r"C:\Users\vukzi\Downloads"   # cache files stay here
OUT_DIR = r"C:\Users\vukzi\OneDrive\Desktop\tiktoks"
W, H  = 1080, 1080
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GRAY  = (140, 140, 140)
LGRAY = (210, 210, 210)
DGRAY = (60,  60,  60)   # dark body text for white bg
MGRAY = (100, 100, 100)  # medium label for white bg

FONT_IMPACT = r"C:\Windows\Fonts\impact.ttf"
FONT_LATO_B = r"C:\Windows\Fonts\LatoWeb-Bold.ttf"
FONT_ARIAL  = r"C:\Windows\Fonts\arialbd.ttf"
FONT_SEG_SB = r"C:\Windows\Fonts\seguisb.ttf"
FONT_SEG_BL = r"C:\Windows\Fonts\seguibl.ttf"

BADGE_WHITE = os.path.join(BASE, "_badge-white-t.png")  # transparent bg
BADGE_BLACK = os.path.join(BASE, "_badge-black-t.png")  # transparent bg
PHONE_IMG   = os.path.join(BASE, "IMG_9294.jpeg")

# Colors from the Thinkio web app subject cards
BLUE   = (59,  130, 246)
AMBER  = (245, 158,  11)
CYAN   = (6,   182, 212)
GREEN  = (16,  185, 129)
ORANGE = (249, 115,  22)
RED    = (239,  68,  68)

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

def _render_badge(cache_path, variant, w=440):
    if not os.path.exists(cache_path):
        url = f"https://tools.applemediaservices.com/api/badges/download-on-the-app-store/{variant}/en-us"
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
            page.screenshot(path=cache_path, clip={"x":0,"y":0,"width":w,"height":h}, omit_background=True)
            browser.close()

def paste_badge(img, cx, center_y, dark_bg=True, w=440):
    cache = BADGE_WHITE if dark_bg else BADGE_BLACK
    variant = "white" if dark_bg else "black"
    _render_badge(cache, variant, w)
    badge = Image.open(cache).convert("RGBA")
    bx, by = cx - badge.width//2, center_y - badge.height//2
    img.paste(badge, (bx, by), mask=badge.split()[3])

APP_SCREENSHOT = r"C:\Users\vukzi\Downloads\IMG_9288.jpeg"

def draw_phone_screenshot(img, px, py, pw, ph):
    """Black iPhone 15 Pro style mockup — Apple website proportions."""
    B, R = 12, 54  # bezel thickness, corner radius

    # ── Drop shadow (soft, centered) ──
    shadow = Image.new("RGBA", (img.width, img.height), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [px + 10, py + 24, px + pw + 10, py + ph + 24], radius=R, fill=(0, 0, 0, 80)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=32))
    composite = Image.alpha_composite(img.convert("RGBA"), shadow).convert("RGB")
    img.paste(composite)

    draw = ImageDraw.Draw(img)
    FRAME = (26, 26, 28)    # titanium black
    BTN   = (44, 44, 46)    # buttons: same finish, barely lighter

    # ──────────────────────────────────────────────────────────────
    # Apple-website-style buttons (drawn before frame so frame
    # covers their inner half — only protrusion stays visible)
    # Proportions based on iPhone 15 Pro physical dimensions.
    # ──────────────────────────────────────────────────────────────
    # Left side — action button (top), volume up, volume down
    draw.rounded_rectangle([px - 5, py + int(ph*0.115), px + 2, py + int(ph*0.135)], radius=3, fill=BTN)  # action
    draw.rounded_rectangle([px - 5, py + int(ph*0.180), px + 2, py + int(ph*0.245)], radius=3, fill=BTN)  # vol+
    draw.rounded_rectangle([px - 5, py + int(ph*0.268), px + 2, py + int(ph*0.333)], radius=3, fill=BTN)  # vol-
    # Right side — side/power button
    draw.rounded_rectangle([px + pw - 2, py + int(ph*0.195), px + pw + 5, py + int(ph*0.345)], radius=3, fill=BTN)

    # ── Phone frame ──
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=R, fill=FRAME)

    # ── Screen area ──
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

    # ── Dynamic Island (black pill centered at top of screen) ──
    di_w = int(sw * 0.30);  di_h = int(sw * 0.065)
    di_x = sx + (sw - di_w) // 2;  di_y = sy + 7
    draw.rounded_rectangle([di_x, di_y, di_x + di_w, di_y + di_h], radius=di_h // 2, fill=(10, 10, 10))

    # ── Frame edge highlight (1px lighter rim for depth) ──
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=R, outline=(52, 52, 56), width=1)


# ── Slide renderers ────────────────────────────────────────────────────────────

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


def render_cover(cover_label, cover_lines, cover_sub, accent, dark=True):
    bg     = BLACK if dark else WHITE
    fg     = WHITE if dark else BLACK
    sub_c  = accent
    label_c= accent
    img  = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img)
    PAD  = 80

    f_tiny = f(FONT_LATO_B, 28)
    lw = draw.textlength(cover_label, font=f_tiny)
    draw.text(((W-lw)/2, PAD+10), cover_label, font=f_tiny, fill=label_c)
    draw.line([(W//2-80, PAD+58),(W//2+80, PAD+58)], fill=accent, width=1)

    y = 200
    for text, size in cover_lines:
        fnt = f(FONT_IMPACT, size)
        draw_text_centered(draw, text, fnt, y, fg)
        y += size + 12

    f_sub = f(FONT_LATO_B, 44)
    draw_text_centered(draw, cover_sub, f_sub, y + 30, sub_c)
    return img

def render_tip(n, head, body, accent, dark=True):
    bg      = BLACK if dark else WHITE
    fg      = WHITE if dark else BLACK
    body_c  = LGRAY if dark else DGRAY
    img  = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img)
    PAD  = 80

    f_num  = f(FONT_LATO_B, 26)
    f_head = f(FONT_IMPACT, 154)
    f_body = f(FONT_LATO_B, 42)

    draw.text((PAD, PAD), f"{n:02d}", font=f_num, fill=accent)
    draw.line([(PAD-24, PAD+4),(PAD-24, PAD+36)], fill=accent, width=3)

    hy = 200
    for line in head.split("\n"):
        draw.text((PAD, hy), line, font=f_head, fill=fg)
        hy += 170

    draw.line([(PAD, hy+10),(PAD+100, hy+10)], fill=accent, width=2)
    hy += 50
    draw.text((PAD, hy), body, font=f_body, fill=body_c)
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
        # average left-edge strip and right-edge strip
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

def render_cta(dark=True):
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

    paste_badge(img, W//2, 465, dark_bg=True, w=340)
    return img

def save_slideshow(folder_name, cover_label, cover_lines, cover_sub, tips, accent, dark=True):
    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, folder_name)
    os.makedirs(out, exist_ok=True)

    slides = [("cover", None)] + [("tip", t) for t in tips] + [("cta", None)]
    for i, (kind, data) in enumerate(slides):
        if kind == "cover":
            img = render_cover(cover_label, cover_lines, cover_sub, accent, dark)
        elif kind == "tip":
            img = render_tip(data[0], data[1], data[2], accent, dark)
        else:
            img = render_cta(dark)
        path = os.path.join(out, f"slide-{i+1:02d}.png")
        img.save(path)
        print(f"  {path}")
    print(f"Done: {out}\n")

# ── Slideshow definitions ──────────────────────────────────────────────────────
# Each entry: (folder, label, cover_lines, subtitle, tips, accent, dark)
# Tips: 4 → 6 slides total | 5 → 7 slides total

slideshows = [

    # 7 slides, DARK, blue
    ("01-tiktok-ace-any-exam", "EXAM TIPS", [
        ("HOW TO", 148),
        ("ACE ANY", 148),
        ("EXAM", 148),
    ], "5 study habits that actually work", [
        (1, "ACTIVE\nRECALL",     "Close the book. Write what you remember. Repeat."),
        (2, "TEST\nYOURSELF",     "Flashcards beat re-reading every time."),
        (3, "SPACE\nIT OUT",      "Study a little every day. Not all the night before."),
        (4, "TEACH\nIT BACK",     "If you can explain it simply, you know it."),
        (5, "USE\nTHINKIO",       "AI quizzes & flashcards from your notes. Instantly."),
    ], BLUE, True),

    # 6 slides, LIGHT, cyan
    ("02-tiktok-remember-everything", "MEMORY TIPS", [
        ("HOW TO", 148),
        ("REMEMBER", 130),
        ("EVERYTHING", 110),
    ], "you study — actually", [
        (1, "DON'T\nREREAD",      "Rereading feels productive. It's not."),
        (2, "SPACED\nREPETITION", "Review again in 1 day, 3 days, 1 week."),
        (3, "QUIZ\nYOURSELF",     "Test before you feel ready. That's the point."),
        (4, "USE\nTHINKIO",       "Upload your notes. Get a full quiz in seconds."),
    ], CYAN, False),

    # 7 slides, DARK, amber
    ("03-tiktok-stop-cramming", "STUDY SMARTER", [
        ("STOP", 148),
        ("CRAMMING", 130),
        ("FOREVER", 130),
    ], "do this instead", [
        (1, "REVIEW\nSAME DAY",   "10 min after class beats 3 hours the night before."),
        (2, "STUDY IN\nBLOCKS",   "25 min on. 5 min off. No phone."),
        (3, "MAKE\nFLASHCARDS",   "Turn your notes into questions the same day."),
        (4, "QUIZ\nDAILY",        "5 min a day > 5 hours before the exam."),
        (5, "USE\nTHINKIO",       "Your notes become flashcards & quizzes instantly."),
    ], AMBER, True),

    # 6 slides, LIGHT, green
    ("04-tiktok-better-notes", "NOTE TIPS", [
        ("HOW TO", 148),
        ("TAKE BETTER", 110),
        ("NOTES", 148),
    ], "so studying actually works", [
        (1, "WRITE\nLESS",        "Summarize. Don't transcribe word for word."),
        (2, "YOUR OWN\nWORDS",    "If you can't rephrase it, you don't get it yet."),
        (3, "REVIEW\nSAME DAY",   "10 min after class locks everything in."),
        (4, "USE\nTHINKIO",       "Thinkio turns your notes into flashcards for you."),
    ], GREEN, False),

    # 7 slides, DARK, orange
    ("05-tiktok-study-smarter", "STUDY TIPS", [
        ("STUDY", 148),
        ("SMARTER,", 130),
        ("NOT MORE", 110),
    ], "the habits top students actually use", [
        (1, "ACTIVE\nNOT PASSIVE","Reading = passive. Testing yourself = active."),
        (2, "QUESTIONS\nFIRST",   "Read the questions before you read the chapter."),
        (3, "ONE\nSUBJECT",       "Context switching kills deep understanding."),
        (4, "TRACK\nMISTAKES",    "Keep a list of wrong answers. That list = your exam."),
        (5, "USE\nTHINKIO",       "Notes in. Quizzes, flashcards & lessons out."),
    ], ORANGE, True),

    # 6 slides, LIGHT, red
    ("06-tiktok-get-an-a", "GRADE TIPS", [
        ("HOW TO", 148),
        ("GET AN", 148),
        ("A", 148),
    ], "no shortcuts, just what works", [
        (1, "GO TO\nCLASS",       "Half the exam is hinted at during lectures."),
        (2, "DO PAST\nPAPERS",    "Old exams are the closest thing to a cheat code."),
        (3, "ASK\nQUESTIONS",     "If you're confused, so is everyone else in the room."),
        (4, "USE\nTHINKIO",       "AI turns your lecture notes into a full quiz."),
    ], RED, False),

    # 7 slides, DARK, blue — AI + studying
    ("07-tiktok-ai-study-future", "AI + STUDY", [
        ("AI IS", 148),
        ("CHANGING", 130),
        ("STUDYING", 120),
    ], "here's what that means for you", [
        (1, "AI CAN\nQUIZ YOU",    "20 questions from your notes in under 10 seconds."),
        (2, "INSTANT\nFLASHCARDS", "Any topic, any format. Ready in seconds, not hours."),
        (3, "CUSTOM\nLESSONS",     "A full lesson built from your exact notes and gaps."),
        (4, "FASTER\nRETENTION",   "Smart repetition + AI quizzes = less time, better grades."),
        (5, "USE\nTHINKIO",        "Upload your notes. Let AI do the heavy lifting for you."),
    ], BLUE, True),

    # 6 slides, LIGHT, cyan — top student habits
    ("08-tiktok-top-students", "TOP HABITS", [
        ("WHAT TOP", 148),
        ("STUDENTS", 130),
        ("DO DAILY", 130),
    ], "copy these habits starting today", [
        (1, "REVIEW\nTHAT DAY",  "Same-day review is 4x more effective than next-day."),
        (2, "QUIZ\nBEFORE BED",  "Testing before sleep locks memories in overnight."),
        (3, "WEEKLY\nREVIEW",    "30 min on Sunday reviewing the week. Non-negotiable."),
        (4, "USE\nTHINKIO",      "Track your streak. Build the habit. Stay consistent."),
    ], CYAN, False),

    # 7 slides, DARK, green — consistency
    ("09-tiktok-consistency-wins", "STUDY TRUTH", [
        ("CONSISTENCY", 120),
        ("BEATS", 148),
        ("CRAMMING", 120),
    ], "every single time", [
        (1, "CRAMMING\nFADES",    "Info crammed disappears within 72 hours. Science."),
        (2, "DAILY BEATS\nWEEKLY","20 min every day > 2 hours every Sunday. Always."),
        (3, "THE\nCOMPOUND",      "Consistent review means you never start from zero."),
        (4, "LOW EFFORT\nHIGH YIELD","You don't need motivation. You need a system."),
        (5, "USE\nTHINKIO",       "Open it daily. 5 questions. That's your system."),
    ], GREEN, True),

    # 6 slides, LIGHT, amber — pass any test
    ("10-tiktok-pass-any-test", "EXAM SYSTEM", [
        ("HOW TO", 148),
        ("PASS", 148),
        ("ANY TEST", 130),
    ], "a repeatable system that works", [
        (1, "GET THE\nSYLLABUS",  "The teacher told you what's on the exam. Use it."),
        (2, "PRACTICE\nPAPERS",   "Do at least 2 past papers under exam conditions."),
        (3, "MARK\nYOURSELF",     "Grade your own work. Know where you lost marks."),
        (4, "USE\nTHINKIO",       "AI identifies your weak spots and drills them for you."),
    ], AMBER, False),

    # 7 slides, DARK, orange — 10x study speed
    ("11-tiktok-10x-study", "SPEED TIPS", [
        ("10X YOUR", 130),
        ("STUDY", 148),
        ("SPEED", 148),
    ], "without sacrificing retention", [
        (1, "SKIM FIRST\nTHEN READ","1 min overview before reading improves recall 10x."),
        (2, "QUESTIONS\nFIRST",    "Write questions you expect before reading the chapter."),
        (3, "RECORD &\nPLAY BACK", "Explain the topic aloud. Listen while commuting."),
        (4, "USE AI\nFOR SETUP",   "Let AI prep your quiz so you go straight to learning."),
        (5, "USE\nTHINKIO",        "Notes in. Quizzes, flashcards, lessons out. Instantly."),
    ], ORANGE, True),
]

print("Generating slideshows...\n")
for args in slideshows:
    save_slideshow(*args)
print("All done.")

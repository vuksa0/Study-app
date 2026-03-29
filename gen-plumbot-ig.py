from PIL import Image, ImageDraw, ImageFont
import os, io, urllib.request

OUT_DIR    = r"C:\Users\vukzi\OneDrive\Desktop\Content\tiktoks"
CACHE_DIR  = r"C:\Users\vukzi\Downloads\_photo_cache_plumbot"
W, H       = 1080, 1080

WHITE  = (255, 255, 255)
BLACK  = (0,   0,   0)
LGRAY  = (210, 210, 210)
MGRAY  = (130, 130, 130)
VIOLET = (124, 58,  237)   # PlumBOT brand
RED    = (239, 68,  68)

FONT_IMPACT = r"C:\Windows\Fonts\impact.ttf"
FONT_LATO_B = r"C:\Windows\Fonts\LatoWeb-Bold.ttf"
FONT_ARIAL  = r"C:\Windows\Fonts\arialbd.ttf"

def f(path, size):
    try:    return ImageFont.truetype(path, size)
    except: return ImageFont.truetype(FONT_ARIAL, size)

def fetch(photo_id):
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache = os.path.join(CACHE_DIR, f"{photo_id}.jpg")
    if os.path.exists(cache):
        return Image.open(cache).convert("RGB")
    url = f"https://images.unsplash.com/photo-{photo_id}?w={W}&h={H}&fit=crop&q=80"
    print(f"  Downloading {photo_id}...")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        img = Image.open(io.BytesIO(data)).convert("RGB").resize((W, H), Image.LANCZOS)
        img.save(cache)
        return img
    except Exception as e:
        print(f"  WARNING: {e} — using dark fallback")
        return Image.new("RGB", (W, H), (14, 10, 28))

def overlay(img, alpha=0.72):
    ov = Image.new("RGBA", (W, H), (0, 0, 0, int(255 * alpha)))
    return Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")

def wrap(draw, text, font, max_w):
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

def centered(draw, text, font, y, color=WHITE):
    tw = draw.textlength(text, font=font)
    draw.text(((W - tw) / 2, y), text, font=font, fill=color)

def render_post(photo_id, label, problem_lines, solution_lines, accent=VIOLET):
    img  = fetch(photo_id)
    img  = overlay(img, alpha=0.78)
    draw = ImageDraw.Draw(img)
    PAD  = 72

    # ── Top label badge ────────────────────────────────────────────
    f_lbl = f(FONT_LATO_B, 26)
    lbl_w = draw.textlength(label, font=f_lbl)
    badge_pad = 20
    bx = (W - lbl_w - badge_pad * 2) // 2
    draw.rounded_rectangle([bx, 54, bx + lbl_w + badge_pad * 2, 100], radius=8, fill=accent)
    draw.text((bx + badge_pad, 60), label, font=f_lbl, fill=WHITE)

    # ── PROBLEM section ────────────────────────────────────────────
    f_tag   = f(FONT_LATO_B, 28)
    f_prob  = f(FONT_IMPACT, 110)
    f_sol   = f(FONT_IMPACT, 80)
    f_body  = f(FONT_LATO_B, 38)

    y = 148
    draw.text((PAD, y), "THE PROBLEM", font=f_tag, fill=RED)
    draw.line([(PAD, y + 40), (W - PAD, y + 40)], fill=(80, 20, 20), width=1)

    y += 60
    for line in problem_lines:
        lw = draw.textlength(line[0], font=f(FONT_IMPACT, line[1]))
        draw.text(((W - lw) / 2, y), line[0], font=f(FONT_IMPACT, line[1]), fill=WHITE)
        y += line[1] + 10

    # ── Divider ────────────────────────────────────────────────────
    y += 28
    draw.line([(PAD, y), (W - PAD, y)], fill=(60, 60, 70), width=1)
    y += 36

    # ── SOLUTION section ───────────────────────────────────────────
    draw.text((PAD, y), "THE SOLUTION", font=f_tag, fill=accent)
    draw.line([(PAD, y + 40), (W - PAD, y + 40)], fill=(40, 20, 80), width=1)

    y += 60
    for line in solution_lines:
        lw = draw.textlength(line[0], font=f(FONT_IMPACT, line[1]))
        draw.text(((W - lw) / 2, y), line[0], font=f(FONT_IMPACT, line[1]), fill=WHITE)
        y += line[1] + 10

    # ── PlumBOT brand footer ───────────────────────────────────────
    f_brand = f(FONT_LATO_B, 28)
    draw.line([(PAD, H - 90), (W - PAD, H - 90)], fill=(50, 50, 60), width=1)
    centered(draw, "plumbot.agency", f_brand, H - 72, MGRAY)

    return img


# ── Post definitions ───────────────────────────────────────────────────────────

# Unsplash photo IDs
PHONE_CALL  = "1521737711867-e3b97375f902"  # neon dark tech
TEAM_LAPTOP = "1461749280684-dccba630e2f6"  # laptop work
DARK_OFFICE = "1519501025264-65ba15a82390"  # dark moody office night
IPHONE_DESK = "1512941937669-90a1b58e7e9c"  # iPhone on desk
INBOX_EMAIL = "1554118811-1e0d58224f24"     # coffee work table

POSTS = [
    {
        "folder": "pb-01-missed-calls",
        "photo":  PHONE_CALL,
        "label":  "AI VOICE AGENT",
        "problem": [
            ("EVERY MISSED", 90),
            ("CALL IS A", 90),
            ("MISSED SALE.", 80),
        ],
        "solution": [
            ("AI ANSWERS", 90),
            ("24/7.", 110),
            ("YOU NEVER MISS.", 72),
        ],
    },
    {
        "folder": "pb-02-manual-work",
        "photo":  DARK_OFFICE,
        "label":  "WORKFLOW AUTOMATION",
        "problem": [
            ("YOUR TEAM WASTES", 76),
            ("3 HOURS/DAY", 100),
            ("ON COPY-PASTE.", 76),
        ],
        "solution": [
            ("AUTOMATE IT.", 100),
            ("DONE IN", 80),
            ("ONE CLICK.", 90),
        ],
    },
    {
        "folder": "pb-03-leads-sleeping",
        "photo":  IPHONE_DESK,
        "label":  "AI CHATBOT",
        "problem": [
            ("YOU LOSE LEADS", 80),
            ("WHILE YOU", 100),
            ("SLEEP.", 130),
        ],
        "solution": [
            ("AI CHATBOT", 90),
            ("QUALIFIES THEM", 78),
            ("AT 3AM.", 100),
        ],
    },
    {
        "folder": "pb-04-booking-chaos",
        "photo":  TEAM_LAPTOP,
        "label":  "AI BOOKING AGENT",
        "problem": [
            ("BOOKING A MEETING", 72),
            ("TAKES 20", 100),
            ("BACK-AND-FORTH EMAILS.", 56),
        ],
        "solution": [
            ("AI BOOKS IT", 88),
            ("IN 30", 110),
            ("SECONDS.", 100),
        ],
    },
    {
        "folder": "pb-05-support-inbox",
        "photo":  INBOX_EMAIL,
        "label":  "AI CUSTOMER SUPPORT",
        "problem": [
            ("YOUR INBOX IS", 82),
            ("DROWNING", 110),
            ("YOUR BUSINESS.", 72),
        ],
        "solution": [
            ("AI RESOLVES", 90),
            ("80% OF QUERIES", 76),
            ("INSTANTLY.", 96),
        ],
    },
]


# ── Generate ───────────────────────────────────────────────────────────────────

os.makedirs(OUT_DIR, exist_ok=True)
print(f"Generating {len(POSTS)} PlumBOT IG posts -> {OUT_DIR}\n")

for post in POSTS:
    out = os.path.join(OUT_DIR, post["folder"])
    os.makedirs(out, exist_ok=True)
    print(f">> {post['folder']}")
    img = render_post(post["photo"], post["label"], post["problem"], post["solution"])
    img.save(os.path.join(out, "post.png"))
    print(f"  post.png ok\n")

print("All 5 posts done.")

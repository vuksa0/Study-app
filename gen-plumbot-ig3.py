from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

OUT_DIR = r"C:\Users\vukzi\OneDrive\Desktop\Content\tiktoks"
W, H    = 1080, 1350

BG     = (8,   6,  18)
CARD   = (16, 14, 32)
WHITE  = (255, 255, 255)
OFF_W  = (230, 228, 245)
LGRAY  = (160, 158, 185)
MGRAY  = (90,  88, 115)
DGRAY  = (36,  34,  58)
VIOLET = (124, 58, 237)
VDIM   = (70,  28, 148)
RED    = (210, 48,  48)
GREEN  = (34, 197, 94)
AMBER  = (240, 155, 10)

FONT_B = r"C:\Windows\Fonts\LatoWeb-Bold.ttf"
FONT_I = r"C:\Windows\Fonts\impact.ttf"
FONT_A = r"C:\Windows\Fonts\arialbd.ttf"

def f(path, size):
    try:    return ImageFont.truetype(path, size)
    except:
        try: return ImageFont.truetype(FONT_B, size)
        except: return ImageFont.truetype(FONT_A, size)

# ── Background ────────────────────────────────────────────────────────────────
def make_bg():
    img = Image.new("RGB", (W, H), BG)
    # Violet radial glow — top center
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = W // 2, -60
    for r in range(600, 0, -5):
        a = int(45 * (1 - r / 600) ** 1.8)
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(100, 35, 210, a))
    glow = glow.filter(ImageFilter.GaussianBlur(32))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    # Dot grid
    draw = ImageDraw.Draw(img)
    for x in range(54, W, 54):
        for y in range(54, H, 54):
            draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=(28, 24, 56))
    return img

# ── Helpers ───────────────────────────────────────────────────────────────────
def centered_text(draw, text, fnt, y, color=WHITE):
    tw = draw.textlength(text, font=fnt)
    draw.text(((W - tw) // 2, y), text, font=fnt, fill=color)
    return y + int(fnt.size * 1.15)

def pill(draw, text, y, color=VIOLET, text_color=WHITE, outline_only=False):
    fb = f(FONT_B, 24)
    tw = draw.textlength(text, font=fb)
    px, py = 28, 10
    x1 = (W - tw - px * 2) // 2
    x2 = x1 + tw + px * 2
    if outline_only:
        draw.rounded_rectangle([x1, y, x2, y + 44], radius=22, outline=MGRAY, width=1, fill=BG)
        draw.text((x1 + px, y + py), text, font=fb, fill=LGRAY)
    else:
        draw.rounded_rectangle([x1, y, x2, y + 44], radius=22, fill=color)
        draw.text((x1 + px, y + py), text, font=fb, fill=text_color)
    return y + 60

def brand_footer(draw):
    fb = f(FONT_B, 26)
    draw.line([(80, H - 80), (W - 80, H - 80)], fill=DGRAY, width=1)
    tw = draw.textlength("plumbot.agency", font=fb)
    draw.text(((W - tw) // 2, H - 62), "plumbot.agency", font=fb, fill=MGRAY)

def divider(draw, y, color=DGRAY):
    draw.line([(80, y), (W - 80, y)], fill=color, width=1)

def wrap(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def centered_wrap(draw, text, fnt, y, color, max_w=W - 120):
    for line in wrap(draw, text, fnt, max_w):
        lw = draw.textlength(line, font=fnt)
        draw.text(((W - lw) // 2, y), line, font=fnt, fill=color)
        y += int(fnt.size * 1.2)
    return y

def save_dots(draw, total, current):
    r, sp = 6, 20
    total_w = total * r * 2 + (total - 1) * (sp - r * 2)
    sx = (W - total_w) // 2
    for i in range(total):
        x = sx + i * sp
        col = WHITE if i == current else MGRAY
        draw.ellipse([x, H - 36 - r, x + r * 2, H - 36 + r], fill=col)


# ── POST 1 — Voice Agent (4 slides) ──────────────────────────────────────────
# "Your phone rings at 8pm. Nobody answers. That lead just chose your competitor."

def p1_cover():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 90
    y = pill(draw, "AI VOICE AGENT", y, outline_only=True)
    y += 30
    fi = f(FONT_I, 130)
    fb = f(FONT_B, 44)
    fm = f(FONT_B, 36)
    y = centered_text(draw, "YOUR PHONE", fi, y)
    y = centered_text(draw, "RINGS AT 8PM.", fi, y - 10)
    y += 20
    divider(draw, y); y += 30
    y = centered_wrap(draw, "Nobody answers. That lead just chose your competitor.", fb, y, LGRAY)
    # Card
    y += 40
    draw.rounded_rectangle([60, y, W - 60, y + 380], radius=24, fill=CARD, outline=DGRAY, width=1)
    items = [
        ("After-hours calls missed",   "~40% of total leads"),
        ("Leads that don't call back",  "75% — gone forever"),
        ("Cost per missed lead",        "$200 – $500"),
    ]
    frow = f(FONT_B, 34); fval = f(FONT_B, 34)
    ry = y + 40
    for label, val in items:
        lw = draw.textlength(label, font=frow)
        vw = draw.textlength(val, font=fval)
        draw.text(((W - lw) // 2 - 180, ry), label, font=frow, fill=LGRAY)
        draw.text(((W - vw) // 2 + 200, ry), val, font=fval, fill=RED)
        ry += 72
        divider(draw, ry - 16)
    brand_footer(draw); save_dots(draw, 4, 0)
    return img

def p1_s2():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 90
    y = pill(draw, "AI VOICE AGENT", y, outline_only=True)
    y += 30
    fi = f(FONT_I, 110); fb = f(FONT_B, 40); fm = f(FONT_B, 32)
    y = centered_text(draw, "WHAT HAPPENS", fi, y)
    y = centered_text(draw, "WHEN AI ANSWERS", fi, y - 10)
    y += 24; divider(draw, y); y += 36
    y = centered_wrap(draw, "Every call handled. Every lead captured. No staff needed.", fb, y, LGRAY)
    y += 44
    steps = [
        (VIOLET, "Call comes in",      "Any hour. Any volume."),
        (VIOLET, "AI greets caller",   "Sounds natural. Knows your business."),
        (VIOLET, "Qualifies the lead", "Captures name, need, urgency."),
        (GREEN,  "Books appointment",  "Syncs directly to your calendar."),
    ]
    draw.rounded_rectangle([60, y, W - 60, y + 420], radius=24, fill=CARD, outline=DGRAY, width=1)
    fh = f(FONT_B, 36); fs = f(FONT_B, 28); sy = y + 36
    for i, (col, head, body) in enumerate(steps):
        cx_dot = 110
        draw.ellipse([cx_dot - 10, sy + 8, cx_dot + 10, sy + 28], fill=col)
        draw.text((132, sy), head, font=fh, fill=WHITE)
        draw.text((132, sy + 42), body, font=fs, fill=LGRAY)
        if i < len(steps) - 1:
            draw.line([(cx_dot, sy + 32), (cx_dot, sy + 70)], fill=DGRAY, width=2)
        sy += 94
    brand_footer(draw); save_dots(draw, 4, 1)
    return img

def p1_s3():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 90
    y = pill(draw, "AI VOICE AGENT", y, outline_only=True)
    y += 50
    fi = f(FONT_I, 120); fb = f(FONT_B, 42); fm = f(FONT_B, 32)
    stat = "24 / 7"
    sw = draw.textlength(stat, font=fi)
    draw.text(((W - sw) // 2, y), stat, font=fi, fill=VIOLET)
    y += 140
    divider(draw, y); y += 30
    y = centered_wrap(draw, "Available. Never sick. Never late.", fb, y, WHITE)
    y += 10
    y = centered_wrap(draw, "Books appointments while you sleep.", fm, y, LGRAY)
    y += 50
    rows = [
        ("Human receptionist",  "$36,000 / yr",  RED),
        ("PlumBOT Voice Agent", "$297 / mo",      GREEN),
    ]
    draw.rounded_rectangle([80, y, W - 80, y + 230], radius=20, fill=CARD, outline=DGRAY, width=1)
    frow = f(FONT_B, 36); ry = y + 30
    for label, val, col in rows:
        lw = draw.textlength(label, font=frow); vw = draw.textlength(val, font=frow)
        draw.text(((W - lw) // 2 - 160, ry), label, font=frow, fill=LGRAY)
        draw.text(((W - vw) // 2 + 180, ry), val, font=frow, fill=col)
        ry += 72; divider(draw, ry - 16)
    brand_footer(draw); save_dots(draw, 4, 2)
    return img

def p1_cta():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 100
    y = pill(draw, "AI VOICE AGENT", y, outline_only=True)
    y += 60
    fi = f(FONT_I, 116); fb = f(FONT_B, 44); fm = f(FONT_B, 34)
    y = centered_text(draw, "READY TO STOP", fi, y)
    y = centered_text(draw, "MISSING CALLS?", fi, y - 10)
    y += 24; divider(draw, y); y += 36
    y = centered_wrap(draw, "We build your AI Voice Agent in 5 days.", fb, y, LGRAY)
    y += 60
    # CTA button
    btxt = "DM US  ' VOICE '"
    fw = f(FONT_B, 40)
    bw = draw.textlength(btxt, font=fw) + 80
    bx = (W - bw) // 2
    draw.rounded_rectangle([bx, y, bx + bw, y + 72], radius=36, fill=VIOLET)
    tw = draw.textlength(btxt, font=fw)
    draw.text(((W - tw) // 2, y + 16), btxt, font=fw, fill=WHITE)
    y += 100
    fn = f(FONT_B, 30)
    y = centered_wrap(draw, "Free 20-min strategy call included.", fn, y, MGRAY)
    brand_footer(draw); save_dots(draw, 4, 3)
    return img


# ── POST 2 — Chatbot SINGLE ───────────────────────────────────────────────────
# Stat-driven single image

def p2_single():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 90
    y = pill(draw, "AI CHATBOT", y, outline_only=True)
    y += 50
    fi = f(FONT_I, 160); fb = f(FONT_B, 46); fm = f(FONT_B, 34)
    stat = "98%"
    sw = draw.textlength(stat, font=fi)
    draw.text(((W - sw) // 2, y), stat, font=fi, fill=RED)
    y += 190
    divider(draw, y); y += 32
    y = centered_wrap(draw, "of website visitors leave without", fb, y, WHITE)
    y = centered_wrap(draw, "ever talking to you.", fb, y - 8, WHITE)
    y += 16
    y = centered_wrap(draw, "Not because they weren't interested —", fm, y, LGRAY)
    y = centered_wrap(draw, "because nobody was there to talk to them.", fm, y - 4, LGRAY)
    y += 60
    # Chat mockup card
    draw.rounded_rectangle([60, y, W - 60, y + 380], radius=24, fill=CARD, outline=DGRAY, width=1)
    msgs = [
        (False, "Hi! What can I help you with?"),
        (True,  "Do you work with small businesses?"),
        (False, "Yes — what's your main challenge?"),
        (True,  "Following up with leads manually."),
        (False, "We can automate that. Want a demo?"),
    ]
    fmsg = f(FONT_B, 29); my = y + 30
    for is_user, msg in msgs:
        tw = draw.textlength(msg, font=fmsg)
        pad = 20; mx = (W - tw - pad * 2) // 2
        if is_user:
            draw.rounded_rectangle([mx, my, mx + tw + pad * 2, my + 42], radius=12, fill=VDIM)
        else:
            draw.rounded_rectangle([mx, my, mx + tw + pad * 2, my + 42], radius=12, fill=(30, 28, 54), outline=DGRAY, width=1)
        draw.text((mx + pad, my + 10), msg, font=fmsg, fill=WHITE)
        my += 62
    brand_footer(draw)
    return img


# ── POST 3 — Workflow Automation (3 slides) ───────────────────────────────────

def p3_cover():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 90
    y = pill(draw, "WORKFLOW AUTOMATION", y, outline_only=True)
    y += 30
    fi = f(FONT_I, 120); fb = f(FONT_B, 42); fm = f(FONT_B, 34)
    y = centered_text(draw, "YOUR TEAM IS", fi, y)
    y = centered_text(draw, "DOING A ROBOT'S JOB.", fi, y - 10)
    y += 24; divider(draw, y); y += 32
    y = centered_wrap(draw, "Manual tasks your team does every day — that should be automated.", fb, y, LGRAY)
    y += 44
    tasks = [
        ("Copy CRM data to sheet",    "45 min / day"),
        ("Send follow-up emails",     "30 min / day"),
        ("Update 3 tools manually",   "25 min / day"),
        ("Move leads between apps",   "20 min / day"),
    ]
    draw.rounded_rectangle([60, y, W - 60, y + 380], radius=24, fill=CARD, outline=DGRAY, width=1)
    frow = f(FONT_B, 33); ry = y + 32
    for task, time in tasks:
        lw = draw.textlength(task, font=frow); vw = draw.textlength(time, font=frow)
        draw.text(((W - lw) // 2 - 170, ry), task, font=frow, fill=LGRAY)
        draw.text(((W - vw) // 2 + 200, ry), time, font=frow, fill=RED)
        ry += 66; divider(draw, ry - 16)
    fbot = f(FONT_B, 34)
    total = "Total: ~2 hrs wasted / day / person"
    tw = draw.textlength(total, font=fbot)
    draw.text(((W - tw) // 2, ry + 4), total, font=fbot, fill=AMBER)
    brand_footer(draw); save_dots(draw, 3, 0)
    return img

def p3_s2():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 90
    y = pill(draw, "WORKFLOW AUTOMATION", y, outline_only=True)
    y += 30
    fi = f(FONT_I, 114); fb = f(FONT_B, 40); fm = f(FONT_B, 32)
    y = centered_text(draw, "THE SAME FLOW,", fi, y)
    y = centered_text(draw, "AUTOMATED.", fi, y - 10)
    y += 24; divider(draw, y); y += 32
    y = centered_wrap(draw, "One setup. Runs perfectly every single time.", fb, y, LGRAY)
    y += 40
    steps = [
        (VIOLET, "Lead submits form"),
        (GREEN,  "CRM updated instantly"),
        (GREEN,  "Personalised email sent"),
        (GREEN,  "Slack alert to your team"),
        (GREEN,  "Follow-up scheduled"),
    ]
    draw.rounded_rectangle([60, y, W - 60, y + 440], radius=24, fill=CARD, outline=DGRAY, width=1)
    fh = f(FONT_B, 38); cx_dot = W // 2 - 160; sy = y + 40
    for i, (col, label) in enumerate(steps):
        draw.ellipse([cx_dot - 10, sy + 6, cx_dot + 10, sy + 26], fill=col)
        lw = draw.textlength(label, font=fh)
        draw.text(((W - lw) // 2 + 20, sy), label, font=fh, fill=WHITE)
        if i < len(steps) - 1:
            draw.line([(cx_dot, sy + 30), (cx_dot, sy + 68)], fill=DGRAY, width=2)
        sy += 78
    brand_footer(draw); save_dots(draw, 3, 1)
    return img

def p3_cta():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 100
    y = pill(draw, "WORKFLOW AUTOMATION", y, outline_only=True)
    y += 60
    fi = f(FONT_I, 120); fb = f(FONT_B, 44); fm = f(FONT_B, 34)
    stat = "10 HRS / WEEK"
    sw = draw.textlength(stat, font=fi)
    draw.text(((W - sw) // 2, y), stat, font=fi, fill=GREEN)
    y += 150; divider(draw, y); y += 32
    y = centered_wrap(draw, "Given back to every person on your team.", fb, y, WHITE)
    y += 12
    y = centered_wrap(draw, "That's 40 hours a month. Per employee.", fm, y, LGRAY)
    y += 60
    btxt = "DM US  ' AUTOMATE '"
    fw = f(FONT_B, 38)
    bw = draw.textlength(btxt, font=fw) + 80
    bx = (W - bw) // 2
    draw.rounded_rectangle([bx, y, bx + bw, y + 72], radius=36, fill=VIOLET)
    tw = draw.textlength(btxt, font=fw)
    draw.text(((W - tw) // 2, y + 16), btxt, font=fw, fill=WHITE)
    y += 100
    fn = f(FONT_B, 30)
    y = centered_wrap(draw, "Free workflow audit — no commitment.", fn, y, MGRAY)
    brand_footer(draw); save_dots(draw, 3, 2)
    return img


# ── POST 4 — Voice Agent SINGLE ───────────────────────────────────────────────

def p4_single():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 90
    y = pill(draw, "AI VOICE AGENT", y, outline_only=True)
    y += 50
    fi = f(FONT_I, 170); fb = f(FONT_B, 46); fm = f(FONT_B, 34)
    stat = "75%"
    sw = draw.textlength(stat, font=fi)
    draw.text(((W - sw) // 2, y), stat, font=fi, fill=RED)
    y += 200; divider(draw, y); y += 32
    y = centered_wrap(draw, "of callers who can't reach you", fb, y, WHITE)
    y = centered_wrap(draw, "on the first try never call back.", fb, y - 8, WHITE)
    y += 20
    y = centered_wrap(draw, "They don't leave a voicemail.\nThey call your competitor.", fm, y, LGRAY)
    y += 60
    rows = [
        ("Missed call",       "Lost lead",       RED),
        ("Lost lead",         "Lost revenue",    RED),
        ("AI Voice Agent",    "Zero missed calls", GREEN),
    ]
    draw.rounded_rectangle([60, y, W - 60, y + 280], radius=24, fill=CARD, outline=DGRAY, width=1)
    frow = f(FONT_B, 34); ry = y + 28
    for left, right, col in rows:
        lw = draw.textlength(left, font=frow); rw = draw.textlength(right, font=frow)
        aw = draw.textlength("→", font=frow)
        draw.text(((W - lw) // 2 - 210, ry), left, font=frow, fill=LGRAY)
        draw.text(((W - aw) // 2, ry), "→", font=frow, fill=MGRAY)
        draw.text(((W - rw) // 2 + 210, ry), right, font=frow, fill=col)
        ry += 72; divider(draw, ry - 20)
    brand_footer(draw)
    return img


# ── POST 5 — Chatbot leads (3 slides) ────────────────────────────────────────

def p5_cover():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 90
    y = pill(draw, "AI CHATBOT", y, outline_only=True)
    y += 30
    fi = f(FONT_I, 116); fb = f(FONT_B, 42); fm = f(FONT_B, 34)
    y = centered_text(draw, "YOUR BEST LEADS", fi, y)
    y = centered_text(draw, "GO COLD.", fi, y - 10)
    y += 24; divider(draw, y); y += 32
    y = centered_wrap(draw, "Speed to lead is the single biggest factor in closing deals.", fb, y, LGRAY)
    y += 44
    data = [
        ("Reply in 5 min",    "21x more likely to close",  GREEN),
        ("Reply in 1 hour",   "7x more likely to close",   AMBER),
        ("Reply in 24 hours", "Probably already gone",     RED),
        ("No reply",          "Lead is dead. Full stop.",  RED),
    ]
    draw.rounded_rectangle([60, y, W - 60, y + 360], radius=24, fill=CARD, outline=DGRAY, width=1)
    ft = f(FONT_B, 30); fv = f(FONT_B, 30); ry = y + 30
    for time, result, col in data:
        lw = draw.textlength(time, font=ft); rw = draw.textlength(result, font=fv)
        draw.text(((W - lw) // 2 - 160, ry), time, font=ft, fill=LGRAY)
        draw.text(((W - rw) // 2 + 140, ry), result, font=fv, fill=col)
        ry += 66; divider(draw, ry - 16)
    brand_footer(draw); save_dots(draw, 3, 0)
    return img

def p5_s2():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 90
    y = pill(draw, "AI CHATBOT", y, outline_only=True)
    y += 30
    fi = f(FONT_I, 110); fb = f(FONT_B, 40); fm = f(FONT_B, 32)
    y = centered_text(draw, "PLUMBOT RESPONDS", fi, y)
    y = centered_text(draw, "IN 3 SECONDS.", fi, y - 10)
    y += 24; divider(draw, y); y += 32
    y = centered_wrap(draw, "While your team sleeps, eats, or is in meetings.", fb, y, LGRAY)
    y += 44
    feats = [
        ("Instant reply",         "No waiting. No missed windows."),
        ("Qualifies leads",       "Asks the right questions first."),
        ("Books to your calendar","No human confirmation needed."),
        ("Works in any language", "Global reach. Zero extra cost."),
    ]
    draw.rounded_rectangle([60, y, W - 60, y + 400], radius=24, fill=CARD, outline=DGRAY, width=1)
    fh = f(FONT_B, 34); fs = f(FONT_B, 27); sy = y + 36
    for head, body in feats:
        hw = draw.textlength(head, font=fh)
        draw.ellipse([(W - hw) // 2 - 28, sy + 6, (W - hw) // 2 - 8, sy + 26], fill=GREEN)
        draw.text(((W - hw) // 2, sy), head, font=fh, fill=WHITE)
        bw = draw.textlength(body, font=fs)
        draw.text(((W - bw) // 2, sy + 42), body, font=fs, fill=LGRAY)
        sy += 94
        divider(draw, sy - 8)
    brand_footer(draw); save_dots(draw, 3, 1)
    return img

def p5_cta():
    img = make_bg(); draw = ImageDraw.Draw(img)
    y = 100
    y = pill(draw, "AI CHATBOT", y, outline_only=True)
    y += 60
    fi = f(FONT_I, 110); fb = f(FONT_B, 44); fm = f(FONT_B, 34)
    y = centered_text(draw, "YOUR COMPETITORS", fi, y)
    y = centered_text(draw, "TAKE 47 HRS.", fi, y - 10)
    y += 24; divider(draw, y); y += 32
    y = centered_wrap(draw, "That's the average response time for a new lead.", fb, y, LGRAY)
    y += 12
    y = centered_wrap(draw, "You'll respond in 3 seconds.", fm, y, WHITE)
    y += 60
    btxt = "DM US  ' CHATBOT '"
    fw = f(FONT_B, 38)
    bw = draw.textlength(btxt, font=fw) + 80
    bx = (W - bw) // 2
    draw.rounded_rectangle([bx, y, bx + bw, y + 72], radius=36, fill=VIOLET)
    tw = draw.textlength(btxt, font=fw)
    draw.text(((W - tw) // 2, y + 16), btxt, font=fw, fill=WHITE)
    y += 100
    fn = f(FONT_B, 30)
    y = centered_wrap(draw, "We build it. You get the leads.", fn, y, MGRAY)
    brand_footer(draw); save_dots(draw, 3, 2)
    return img


# ── Generate ──────────────────────────────────────────────────────────────────

POSTS = [
    ("pb3-01-voice-agent",    [p1_cover, p1_s2, p1_s3, p1_cta]),
    ("pb3-02-chatbot-single", [p2_single]),
    ("pb3-03-automation",     [p3_cover, p3_s2, p3_cta]),
    ("pb3-04-voice-single",   [p4_single]),
    ("pb3-05-chatbot-leads",  [p5_cover, p5_s2, p5_cta]),
]

os.makedirs(OUT_DIR, exist_ok=True)
print(f"Generating PlumBOT premium posts -> {OUT_DIR}\n")
for folder, slides in POSTS:
    out = os.path.join(OUT_DIR, folder)
    os.makedirs(out, exist_ok=True)
    print(f">> {folder}")
    for i, fn in enumerate(slides):
        img = fn()
        img.save(os.path.join(out, f"slide-{i+1:02d}.png"))
        print(f"  slide-{i+1:02d}.png ok")
    print()
print("All done.")

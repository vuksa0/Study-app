from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, math

OUT_DIR = r"C:\Users\vukzi\OneDrive\Desktop\Content\tiktoks"
W, H    = 1080, 1350   # 4:5 Instagram

# Colors
BG      = (6,   5,  16)
CARD    = (18, 16, 36)
CARD2   = (26, 24, 50)
WHITE   = (255, 255, 255)
LGRAY   = (190, 188, 210)
MGRAY   = (110, 108, 135)
DGRAY   = (40,  38,  60)
VIOLET  = (124, 58, 237)
VDIM    = (72,  30, 148)
VGLOW   = (124, 58, 237, 60)
RED     = (220, 50,  50)
GREEN   = (34, 197, 94)
AMBER   = (245, 158, 11)

FONT_B  = r"C:\Windows\Fonts\LatoWeb-Bold.ttf"
FONT_R  = r"C:\Windows\Fonts\LatoWeb-Regular.ttf"
FONT_I  = r"C:\Windows\Fonts\impact.ttf"
FONT_A  = r"C:\Windows\Fonts\arialbd.ttf"

def f(path, size):
    try:    return ImageFont.truetype(path, size)
    except:
        try: return ImageFont.truetype(FONT_B, size)
        except: return ImageFont.truetype(FONT_A, size)

def base():
    # Deep dark base
    img = Image.new("RGB", (W, H), BG)

    # Radial violet glow — top-right corner
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = int(W * 0.80), int(H * 0.08)
    for r in range(420, 0, -4):
        alpha = int(38 * (1 - r / 420) ** 1.6)
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(110, 40, 220, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(28))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")

    # Secondary faint glow — bottom-left
    glow2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd2 = ImageDraw.Draw(glow2)
    cx2, cy2 = int(W * 0.15), int(H * 0.88)
    for r in range(300, 0, -4):
        alpha = int(22 * (1 - r / 300) ** 1.8)
        gd2.ellipse([cx2 - r, cy2 - r, cx2 + r, cy2 + r], fill=(60, 20, 160, alpha))
    glow2 = glow2.filter(ImageFilter.GaussianBlur(20))
    img = Image.alpha_composite(img.convert("RGBA"), glow2).convert("RGB")

    # Subtle dot-grid (much finer and softer than lines)
    draw = ImageDraw.Draw(img)
    for x in range(54, W, 54):
        for y in range(54, H, 54):
            draw.ellipse([x-1, y-1, x+1, y+1], fill=(30, 26, 62))

    return img, draw

def logo(draw, brand="PlumBOT"):
    fb = f(FONT_B, 27)
    # Small violet square mark
    draw.rounded_rectangle([36, 34, 56, 54], radius=5, fill=VIOLET)
    draw.text((66, 34), brand, font=fb, fill=WHITE)

def tag(draw, text):
    fb = f(FONT_B, 22)
    tw = draw.textlength(text, font=fb)
    px, py = 16, 8
    rx1 = W - tw - px * 2 - 44
    draw.rounded_rectangle([rx1, 28, W - 40, 68], radius=20,
                            outline=(60, 50, 100), width=1, fill=(18, 15, 38))
    draw.text((rx1 + px, 36), text, font=fb, fill=(160, 140, 200))

def wrap(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=fnt) <= max_w:
            cur = test
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def header_block(draw, title, body, ty=110):
    ft = f(FONT_B, 58)
    fb = f(FONT_B, 34)
    PAD = 44
    y = ty
    for line in wrap(draw, title, ft, W - PAD * 2):
        draw.text((PAD, y), line, font=ft, fill=WHITE)
        y += 70
    y += 10
    for line in wrap(draw, body, fb, W - PAD * 2):
        draw.text((PAD, y), line, font=fb, fill=LGRAY)
        y += 46
    return y

def card_rect(draw, y_top, y_bot=None, pad=32):
    if y_bot is None: y_bot = H - 44
    draw.rounded_rectangle([pad, y_top, W - pad, y_bot], radius=24, fill=CARD, outline=(45, 38, 80), width=1)
    return y_top, y_bot

def save_dots(draw, total, current, y=H - 28):
    r = 7
    spacing = 22
    total_w = total * r * 2 + (total - 1) * (spacing - r * 2)
    sx = (W - total_w) // 2
    for i in range(total):
        x = sx + i * spacing
        color = WHITE if i == current else MGRAY
        draw.ellipse([x, y - r, x + r * 2, y + r], fill=color)


# ─────────────────────────────────────────────────────────────────────────────
# POST 1 — Voice Agent carousel (4 slides)
# "You're paying someone to answer the same 5 questions. Every. Single. Day."
# ─────────────────────────────────────────────────────────────────────────────

def p1_s1():
    img, draw = base()
    logo(draw); tag(draw, "Voice Agent")
    header_block(draw,
        "You're Paying Someone to Answer the Same 5 Questions Every Day.",
        "Most inbound calls are repetitive. Your staff's time is worth more than that.")
    cx, cy1 = W // 2, 700
    draw.rounded_rectangle([80, 590, W - 80, 920], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    questions = [
        "What are your hours?",
        "Do you take walk-ins?",
        "What's the price?",
        "Where are you located?",
        "Can I book an appointment?",
    ]
    fq = f(FONT_B, 32)
    y = 620
    for i, q in enumerate(questions):
        color = LGRAY if i < 4 else RED
        draw.text((120, y), f"— {q}", font=fq, fill=color)
        y += 56
    fm = f(FONT_B, 28)
    draw.text((120, y + 10), "...every single day. Repeated.", font=fm, fill=MGRAY)
    save_dots(draw, 4, 0)
    return img

def p1_s2():
    img, draw = base()
    logo(draw); tag(draw, "Voice Agent")
    header_block(draw,
        "The Real Cost of a Human Receptionist",
        "Salary, sick days, missed calls after hours — it adds up fast.")
    draw.rounded_rectangle([60, 560, W - 60, 1000], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    rows = [
        ("Average receptionist salary", "$36,000 / yr", WHITE),
        ("Calls missed after hours", "~40% of leads", RED),
        ("Cost per missed lead",       "$200–$500",     RED),
        ("Avg calls/day (repetitive)", "60–80%",        AMBER),
        ("AI Voice Agent cost",        "$297 / mo",     GREEN),
    ]
    fb = f(FONT_B, 34)
    fs = f(FONT_B, 30)
    y = 590
    for label, val, col in rows:
        draw.text((100, y), label, font=fs, fill=LGRAY)
        vw = draw.textlength(val, font=fb)
        draw.text((W - 100 - vw, y), val, font=fb, fill=col)
        y += 72
        draw.line([(100, y - 18), (W - 100, y - 18)], fill=DGRAY, width=1)
    save_dots(draw, 4, 1)
    return img

def p1_s3():
    img, draw = base()
    logo(draw); tag(draw, "Voice Agent")
    header_block(draw,
        "How PlumBOT Voice Agent Works",
        "A caller reaches your business. Here's what happens next.")
    draw.rounded_rectangle([60, 560, W - 60, 1020], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    steps = [
        (VIOLET, "Call comes in",     "Any time, any day, any volume."),
        (VIOLET, "AI answers",        "Sounds natural. Knows your business."),
        (VIOLET, "Qualifies caller",  "Captures name, need, urgency."),
        (GREEN,  "Books appointment", "Syncs directly to your calendar."),
    ]
    fb = f(FONT_B, 36)
    fs = f(FONT_B, 28)
    y = 590
    for color, head, body in steps:
        draw.ellipse([100, y + 4, 124, y + 28], fill=color)
        draw.text((144, y), head, font=fb, fill=WHITE)
        draw.text((144, y + 44), body, font=fs, fill=LGRAY)
        if color != GREEN:
            draw.line([(112, y + 32), (112, y + 68)], fill=DGRAY, width=2)
        y += 96
    save_dots(draw, 4, 2)
    return img

def p1_s4():
    img, draw = base()
    logo(draw); tag(draw, "Voice Agent")
    draw.rounded_rectangle([60, 120, W - 60, 680], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    ft = f(FONT_I, 110)
    fs = f(FONT_B, 42)
    fm = f(FONT_B, 34)
    stat = "24/7"
    sw = draw.textlength(stat, font=ft)
    draw.text(((W - sw) // 2, 160), stat, font=ft, fill=VIOLET)
    sub = "Available. Never complains."
    sw2 = draw.textlength(sub, font=fs)
    draw.text(((W - sw2) // 2, 310), sub, font=fs, fill=WHITE)
    lines2 = ["Books appointments, answers questions,", "qualifies leads — while you sleep."]
    y2 = 390
    for l in lines2:
        lw = draw.textlength(l, font=fm)
        draw.text(((W - lw) // 2, y2), l, font=fm, fill=LGRAY)
        y2 += 50
    draw.rounded_rectangle([200, 720, W - 200, 800], radius=14, fill=VIOLET)
    cta = "DM us  'VOICE'"
    fw = f(FONT_B, 36)
    cw = draw.textlength(cta, font=fw)
    draw.text(((W - cw) // 2, 738), cta, font=fw, fill=WHITE)
    fn = f(FONT_B, 30)
    note = "Get a free demo call set up."
    nw = draw.textlength(note, font=fn)
    draw.text(((W - nw) // 2, 830), note, font=fn, fill=MGRAY)
    save_dots(draw, 4, 3)
    return img


# ─────────────────────────────────────────────────────────────────────────────
# POST 2 — Chatbot SINGLE
# "Your website gets 500 visitors. 498 leave without saying a word."
# ─────────────────────────────────────────────────────────────────────────────

def p2_single():
    img, draw = base()
    logo(draw); tag(draw, "AI Chatbot")
    ft = f(FONT_I, 130)
    fb = f(FONT_B, 48)
    fm = f(FONT_B, 36)
    fs = f(FONT_B, 30)
    # Big stat
    draw.rounded_rectangle([60, 130, W - 60, 480], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    stat = "98%"
    sw = draw.textlength(stat, font=ft)
    draw.text(((W - sw) // 2, 150), stat, font=ft, fill=RED)
    sub = "of website visitors leave without"
    sub2 = "ever talking to you."
    s1w = draw.textlength(sub,  font=fb)
    s2w = draw.textlength(sub2, font=fb)
    draw.text(((W - s1w) // 2, 320), sub,  font=fb, fill=WHITE)
    draw.text(((W - s2w) // 2, 375), sub2, font=fb, fill=WHITE)
    # Chat mockup
    draw.rounded_rectangle([60, 520, W - 60, 1000], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    messages = [
        (False, "Hi! How can I help you today?"),
        (True,  "Do you work with e-commerce brands?"),
        (False, "Yes! We automate lead capture & support."),
        (True,  "Interesting — can we book a call?"),
        (False, "Sure! Click here to pick a time. ✓"),
    ]
    fmsg = f(FONT_B, 30)
    y = 550
    for is_user, msg in messages:
        lines = wrap(draw, msg, fmsg, 520)
        line_h = len(lines) * 40 + 24
        if is_user:
            bx = W - 120
            for l in reversed(lines): bx = min(bx, W - 120 - int(draw.textlength(l, font=fmsg)))
            draw.rounded_rectangle([bx - 20, y - 8, W - 100, y + line_h], radius=12, fill=VDIM)
            for l in lines:
                draw.text((bx, y), l, font=fmsg, fill=WHITE)
                y += 40
        else:
            draw.rounded_rectangle([100, y - 8, 680, y + line_h], radius=12, fill=CARD2)
            for l in lines:
                draw.text((120, y), l, font=fmsg, fill=WHITE)
                y += 40
        y += 28
    fn = f(FONT_B, 28)
    note = "This is what PlumBOT Chatbot does — all day, all night."
    nw = draw.textlength(note, font=fn)
    draw.text(((W - nw) // 2, H - 70), note, font=fn, fill=MGRAY)
    return img


# ─────────────────────────────────────────────────────────────────────────────
# POST 3 — Workflow Automation carousel (3 slides)
# "Your team is doing a robot's job."
# ─────────────────────────────────────────────────────────────────────────────

def p3_s1():
    img, draw = base()
    logo(draw); tag(draw, "Automation")
    header_block(draw,
        "Your Team Is Doing a Robot's Job.",
        "Manual data entry, copy-paste between tools, repetitive emails — it's invisible waste.")
    draw.rounded_rectangle([60, 580, W - 60, 1000], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    items = [
        ("Copy CRM data into spreadsheet",     "~45 min/day"),
        ("Send follow-up emails manually",      "~30 min/day"),
        ("Move leads between tools",            "~20 min/day"),
        ("Update project status in 3 apps",     "~25 min/day"),
    ]
    fb = f(FONT_B, 34)
    fs = f(FONT_B, 28)
    y = 610
    total_label = "Total time wasted:"
    draw.text((100, y), "Task", font=fs, fill=MGRAY)
    draw.text((W - 280, y), "Time lost", font=fs, fill=MGRAY)
    y += 50
    for task, time in items:
        for l in wrap(draw, task, fb, 560):
            draw.text((100, y), l, font=fb, fill=WHITE)
            y += 42
        tw = draw.textlength(time, font=fb)
        draw.text((W - 100 - tw, y - 42), time, font=fb, fill=RED)
        draw.line([(100, y), (W - 100, y)], fill=DGRAY, width=1)
        y += 18
    draw.text((100, y + 10), total_label, font=fs, fill=MGRAY)
    tw = draw.textlength("~2 hrs/day per person", font=fb)
    draw.text((W - 100 - tw, y + 10), "~2 hrs/day per person", font=fb, fill=AMBER)
    save_dots(draw, 3, 0)
    return img

def p3_s2():
    img, draw = base()
    logo(draw); tag(draw, "Automation")
    header_block(draw,
        "The Same Workflow, Automated.",
        "One setup. Zero manual steps. Runs every time, exactly right.")
    draw.rounded_rectangle([60, 560, W - 60, 1040], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    steps = [
        ("New lead fills form",      "Trigger",  VIOLET),
        ("CRM updated automatically","Step 1",   GREEN),
        ("Personalised email sent",  "Step 2",   GREEN),
        ("Slack notification fired", "Step 3",   GREEN),
        ("Task created in Notion",   "Step 4",   GREEN),
        ("Follow-up scheduled",      "Done",     GREEN),
    ]
    fb = f(FONT_B, 36)
    fs = f(FONT_B, 26)
    y = 590
    for label, badge, col in steps:
        bw = draw.textlength(badge, font=fs) + 24
        draw.rounded_rectangle([100, y, 100 + bw, y + 36], radius=8, fill=col)
        draw.text((112, y + 6), badge, font=fs, fill=WHITE)
        draw.text((100 + bw + 20, y + 2), label, font=fb, fill=WHITE)
        if steps.index((label, badge, col)) < len(steps) - 1:
            draw.line([(100 + bw // 2, y + 40), (100 + bw // 2, y + 72)], fill=DGRAY, width=2)
        y += 76
    save_dots(draw, 3, 1)
    return img

def p3_s3():
    img, draw = base()
    logo(draw); tag(draw, "Automation")
    draw.rounded_rectangle([60, 120, W - 60, 680], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    ft = f(FONT_I, 96)
    fb = f(FONT_B, 44)
    fm = f(FONT_B, 34)
    stat = "10 hrs/week"
    sw = draw.textlength(stat, font=ft)
    draw.text(((W - sw) // 2, 155), stat, font=ft, fill=GREEN)
    sub = "given back to every employee"
    sub2 = "who was doing manual work."
    s1w = draw.textlength(sub, font=fb)
    s2w = draw.textlength(sub2, font=fb)
    draw.text(((W - s1w) // 2, 300), sub, font=fb, fill=WHITE)
    draw.text(((W - s2w) // 2, 355), sub2, font=fb, fill=WHITE)
    note = "That's 40 hrs/month. What would your\nteam build with that time?"
    y2 = 440
    for l in note.split("\n"):
        lw = draw.textlength(l, font=fm)
        draw.text(((W - lw) // 2, y2), l, font=fm, fill=LGRAY)
        y2 += 50
    draw.rounded_rectangle([200, 720, W - 200, 800], radius=14, fill=VIOLET)
    cta = "DM us  'AUTOMATE'"
    fw = f(FONT_B, 36)
    cw = draw.textlength(cta, font=fw)
    draw.text(((W - cw) // 2, 738), cta, font=fw, fill=WHITE)
    fn = f(FONT_B, 30)
    note2 = "Free workflow audit — no commitment."
    nw = draw.textlength(note2, font=fn)
    draw.text(((W - nw) // 2, 830), note2, font=fn, fill=MGRAY)
    save_dots(draw, 3, 2)
    return img


# ─────────────────────────────────────────────────────────────────────────────
# POST 4 — Voice Agent SINGLE
# "75% of callers who can't reach you on the first try never call back."
# ─────────────────────────────────────────────────────────────────────────────

def p4_single():
    img, draw = base()
    logo(draw); tag(draw, "Voice Agent")
    draw.rounded_rectangle([60, 130, W - 60, 560], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    ft = f(FONT_I, 160)
    fb = f(FONT_B, 48)
    fm = f(FONT_B, 36)
    stat = "75%"
    sw = draw.textlength(stat, font=ft)
    draw.text(((W - sw) // 2, 145), stat, font=ft, fill=RED)
    lines = [
        "of callers who can't reach you",
        "on the first try never call back.",
    ]
    y = 360
    for l in lines:
        lw = draw.textlength(l, font=fb)
        draw.text(((W - lw) // 2, y), l, font=fb, fill=WHITE)
        y += 60
    draw.rounded_rectangle([60, 600, W - 60, 1020], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    rows = [
        ("Missed call",      "→",  "Lost lead"),
        ("Lost lead",        "→",  "Lost revenue"),
        ("Repeated 10x/day", "→",  "Business bleeding"),
        ("AI Voice Agent",   "→",  "Every call answered"),
    ]
    frow = f(FONT_B, 38)
    yarr = f(FONT_B, 38)
    y2 = 630
    for left, arrow, right in rows:
        color = GREEN if left == "AI Voice Agent" else WHITE
        rc = GREEN if left == "AI Voice Agent" else RED
        draw.text((100, y2), left, font=frow, fill=color)
        aw = draw.textlength(arrow, font=yarr)
        draw.text(((W - aw) // 2, y2), arrow, font=yarr, fill=MGRAY)
        rw = draw.textlength(right, font=frow)
        draw.text((W - 100 - rw, y2), right, font=frow, fill=rc)
        y2 += 76
        if left != "AI Voice Agent":
            draw.line([(100, y2 - 26), (W - 100, y2 - 26)], fill=DGRAY, width=1)
    fn = f(FONT_B, 28)
    note = "Source: research on inbound sales call behaviour"
    nw = draw.textlength(note, font=fn)
    draw.text(((W - nw) // 2, H - 68), note, font=fn, fill=MGRAY)
    return img


# ─────────────────────────────────────────────────────────────────────────────
# POST 5 — Chatbot carousel (3 slides)
# "Your best leads go cold because no one followed up fast enough."
# ─────────────────────────────────────────────────────────────────────────────

def p5_s1():
    img, draw = base()
    logo(draw); tag(draw, "AI Chatbot")
    header_block(draw,
        "Your Best Leads Go Cold. Here's Why.",
        "Speed to lead matters more than most businesses realise.")
    draw.rounded_rectangle([60, 580, W - 60, 1020], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    data = [
        ("Reply within 5 min",  "21x more likely to qualify",  GREEN),
        ("Reply within 1 hour", "7x more likely to qualify",   AMBER),
        ("Reply within 24 hrs", "Likely already gone",         RED),
        ("No reply at all",     "Lead is dead. Full stop.",    RED),
    ]
    fb = f(FONT_B, 34)
    fs = f(FONT_B, 28)
    y = 610
    for time, result, col in data:
        draw.text((100, y), time, font=fs, fill=LGRAY)
        for l in wrap(draw, result, fb, 560):
            draw.text((100, y + 36), l, font=fb, fill=col)
        y += 100
        draw.line([(100, y - 8), (W - 100, y - 8)], fill=DGRAY, width=1)
    save_dots(draw, 3, 0)
    return img

def p5_s2():
    img, draw = base()
    logo(draw); tag(draw, "AI Chatbot")
    header_block(draw,
        "PlumBOT Chatbot Responds in Under 3 Seconds.",
        "While your team sleeps, travels, or eats lunch.")
    draw.rounded_rectangle([60, 560, W - 60, 1040], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    features = [
        ("Instant response",        "No waiting. No missed windows."),
        ("Qualifies automatically", "Asks the right questions first."),
        ("Books straight to calendar","No human needed to confirm."),
        ("Handles objections",      "Trained on your business context."),
        ("Works in any language",   "Global reach, zero extra cost."),
    ]
    fb = f(FONT_B, 34)
    fs = f(FONT_B, 28)
    y = 590
    for head, body in features:
        draw.ellipse([100, y + 6, 118, y + 24], fill=GREEN)
        draw.text((134, y), head, font=fb, fill=WHITE)
        draw.text((134, y + 42), body, font=fs, fill=LGRAY)
        y += 96
        draw.line([(100, y - 8), (W - 100, y - 8)], fill=DGRAY, width=1)
    save_dots(draw, 3, 1)
    return img

def p5_s3():
    img, draw = base()
    logo(draw); tag(draw, "AI Chatbot")
    draw.rounded_rectangle([60, 120, W - 60, 700], radius=20, fill=CARD, outline=(45, 38, 80), width=1)
    ft = f(FONT_I, 90)
    fb = f(FONT_B, 44)
    fm = f(FONT_B, 34)
    stat = "3 seconds."
    sw = draw.textlength(stat, font=ft)
    draw.text(((W - sw) // 2, 155), stat, font=ft, fill=VIOLET)
    lines2 = [
        "That's how fast your chatbot",
        "responds to every lead.",
        "Day or night. Forever.",
    ]
    y2 = 295
    for l in lines2:
        lw = draw.textlength(l, font=fb)
        draw.text(((W - lw) // 2, y2), l, font=fb, fill=WHITE)
        y2 += 62
    note = "Your competitors take 47 hours on average."
    nw = draw.textlength(note, font=fm)
    draw.text(((W - nw) // 2, y2 + 10), note, font=fm, fill=RED)
    draw.rounded_rectangle([200, 750, W - 200, 830], radius=14, fill=VIOLET)
    cta = "DM us  'CHATBOT'"
    fw = f(FONT_B, 36)
    cw = draw.textlength(cta, font=fw)
    draw.text(((W - cw) // 2, 768), cta, font=fw, fill=WHITE)
    fn = f(FONT_B, 30)
    note2 = "We build it. You get the leads."
    nw2 = draw.textlength(note2, font=fn)
    draw.text(((W - nw2) // 2, 870), note2, font=fn, fill=MGRAY)
    save_dots(draw, 3, 2)
    return img


# ─────────────────────────────────────────────────────────────────────────────
# Generate all
# ─────────────────────────────────────────────────────────────────────────────

POSTS = [
    ("pb2-01-voice-agent",    [p1_s1, p1_s2, p1_s3, p1_s4]),
    ("pb2-02-chatbot-single", [p2_single]),
    ("pb2-03-automation",     [p3_s1, p3_s2, p3_s3]),
    ("pb2-04-voice-single",   [p4_single]),
    ("pb2-05-chatbot-leads",  [p5_s1, p5_s2, p5_s3]),
]

os.makedirs(OUT_DIR, exist_ok=True)
print(f"Generating PlumBOT posts -> {OUT_DIR}\n")

for folder, slides in POSTS:
    out = os.path.join(OUT_DIR, folder)
    os.makedirs(out, exist_ok=True)
    print(f">> {folder}")
    for i, fn in enumerate(slides):
        img = fn()
        path = os.path.join(out, f"slide-{i+1:02d}.png")
        img.save(path)
        print(f"  slide-{i+1:02d}.png ok")
    print()

print("All done.")

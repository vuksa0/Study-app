from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, math, random

OUT = r"C:\Users\vukzi\OneDrive\Desktop\Content\thinkio-instagram"
W, H = 1080, 1350

BG     = (5,   4,  14)
CARD   = (14, 12, 28)
CARD_T = (20, 18, 38)   # card top (gradient illusion)
WHITE  = (255, 255, 255)
LGRAY  = (175, 172, 200)
MGRAY  = (85,  82, 112)
DGRAY  = (30,  28,  52)
VIOLET = (124, 58, 237)
CYAN   = (34, 211, 238)
RED    = (220, 50,  50)
GREEN  = (34, 197, 94)
AMBER  = (240, 155, 10)

FL  = r"C:\Windows\Fonts\segoeui.ttf"     # light body
FB  = r"C:\Windows\Fonts\LatoWeb-Bold.ttf"
FI  = r"C:\Windows\Fonts\impact.ttf"
FA  = r"C:\Windows\Fonts\arialbd.ttf"

def f(p, s):
    try:    return ImageFont.truetype(p, s)
    except:
        try: return ImageFont.truetype(FB, s)
        except: return ImageFont.truetype(FA, s)

# ── Premium background ─────────────────────────────────────────────────────────
def make_bg():
    img = Image.new("RGB", (W, H), BG)
    rgba = img.convert("RGBA")

    # 1. Large violet bloom — top-right
    g1 = Image.new("RGBA", (W, H), (0,0,0,0))
    d1 = ImageDraw.Draw(g1)
    for r in range(700, 0, -6):
        a = int(38 * (1 - r/700)**2.0)
        d1.ellipse([W-r+120, -r+80, W+r+120, r+80], fill=(108, 32, 220, a))
    g1 = g1.filter(ImageFilter.GaussianBlur(40))
    rgba = Image.alpha_composite(rgba, g1)

    # 2. Faint cyan bloom — bottom-left
    g2 = Image.new("RGBA", (W, H), (0,0,0,0))
    d2 = ImageDraw.Draw(g2)
    for r in range(380, 0, -5):
        a = int(18 * (1 - r/380)**2.2)
        d2.ellipse([-r+60, H-r+60, r+60, H+r+60], fill=(20, 180, 220, a))
    g2 = g2.filter(ImageFilter.GaussianBlur(30))
    rgba = Image.alpha_composite(rgba, g2)

    img = rgba.convert("RGB")

    # 3. Diagonal scan lines (premium texture)
    scan = Image.new("RGBA", (W, H), (0,0,0,0))
    sd = ImageDraw.Draw(scan)
    step = 18
    for i in range(-H, W + H, step):
        sd.line([(i, 0), (i + H, H)], fill=(255, 255, 255, 5), width=1)
    img = Image.alpha_composite(img.convert("RGBA"), scan).convert("RGB")

    # 4. Vignette edges
    vig = Image.new("RGBA", (W, H), (0,0,0,0))
    vd = ImageDraw.Draw(vig)
    for i in range(120):
        a = int(80 * (1 - i/120)**1.4)
        vd.rectangle([i, i, W-i, H-i], outline=(0,0,0,a))
    img = Image.alpha_composite(img.convert("RGBA"), vig).convert("RGB")

    # 5. Thin violet hairline — 1px top edge accent
    d = ImageDraw.Draw(img)
    for x in range(W):
        t = x / W
        r2 = int(VIOLET[0] * t + 20 * (1-t))
        g3 = int(VIOLET[1] * t + 10 * (1-t))
        b2 = int(VIOLET[2] * t + 80 * (1-t))
        d.point((x, 0), fill=(r2, g3, b2))
        d.point((x, 1), fill=(r2//2, g3//2, b2//2))

    return img

# ── Gradient card ──────────────────────────────────────────────────────────────
def grad_card(img, x1, y1, x2, y2, radius=22):
    """Draw a card with subtle top→bottom gradient and violet inner glow."""
    card_layer = Image.new("RGBA", (W, H), (0,0,0,0))
    cd = ImageDraw.Draw(card_layer)

    # Fill gradient: draw horizontal strips
    ch = y2 - y1
    for i in range(ch):
        t = i / ch
        r2 = int(CARD_T[0] * (1-t) + CARD[0] * t)
        g2 = int(CARD_T[1] * (1-t) + CARD[1] * t)
        b2 = int(CARD_T[2] * (1-t) + CARD[2] * t)
        # clip to rounded corners (approximate)
        margin = 0
        if i < radius:
            margin = int(radius - math.sqrt(max(0, radius**2 - (radius-i)**2)))
        elif i > ch - radius:
            margin = int(radius - math.sqrt(max(0, radius**2 - (i-(ch-radius))**2)))
        cd.line([(x1+margin, y1+i), (x2-margin, y1+i)], fill=(r2, g2, b2, 245))

    # Glow border — violet inner rim
    for pw in range(3, 0, -1):
        a = [30, 55, 90][3-pw]
        cd.rounded_rectangle([x1+pw, y1+pw, x2-pw, y2-pw],
                              radius=max(4, radius-pw),
                              outline=(VIOLET[0], VIOLET[1], VIOLET[2], a), width=1)

    # Outer hairline
    cd.rounded_rectangle([x1, y1, x2, y2], radius=radius,
                          outline=(60, 48, 90, 180), width=1)

    return Image.alpha_composite(img.convert("RGBA"), card_layer).convert("RGB")

# ── Helpers ────────────────────────────────────────────────────────────────────
def ct(draw, text, fnt, y, color=WHITE):
    tw = draw.textlength(text, font=fnt)
    draw.text(((W - tw)//2, y), text, font=fnt, fill=color)
    return y + int(fnt.size * 1.15)

def pill(draw, text, y):
    """Refined hairline pill — small diamond accent + letter-spaced label."""
    fb = f(FB, 21)
    tw = draw.textlength(text, font=fb)
    pad = 24
    x1 = (W - tw - pad*2 - 24) // 2
    x2 = x1 + tw + pad*2 + 24
    # hairline border
    draw.rounded_rectangle([x1, y, x2, y+38], radius=19,
                            outline=(70, 58, 110, 255), width=1, fill=(10, 8, 22, 230))
    # small diamond accent left
    cx = x1 + 20; cy = y + 19
    draw.polygon([(cx, cy-5), (cx+5, cy), (cx, cy+5), (cx-5, cy)], fill=VIOLET)
    draw.text((x1 + pad + 14, y + 9), text, font=fb, fill=(170, 162, 210))
    return y + 54

def wrap(draw, text, fnt, mw):
    words = text.split(); lines = []; cur = ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= mw: cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def cw(draw, text, fnt, y, color, mw=W-120):
    for line in wrap(draw, text, fnt, mw):
        lw = draw.textlength(line, font=fnt)
        draw.text(((W-lw)//2, y), line, font=fnt, fill=color)
        y += int(fnt.size * 1.2)
    return y

def div(draw, y, fade=True):
    if fade:
        for x in range(80, W-80):
            t = (x - 80) / (W - 160)
            a = int(255 * (1 - abs(t*2 - 1)**2))
            draw.point((x, y), fill=(50, 44, 80, a) if a > 0 else DGRAY)
    else:
        draw.line([(80, y), (W-80, y)], fill=DGRAY, width=1)

def accent_cross(draw, cx, cy, size=10, color=VIOLET):
    """Small + cross accent marker."""
    draw.line([(cx-size, cy), (cx+size, cy)], fill=color, width=1)
    draw.line([(cx, cy-size), (cx, cy+size)], fill=color, width=1)
    draw.ellipse([cx-2, cy-2, cx+2, cy+2], fill=color)

def footer(draw):
    # Gradient rule
    for x in range(80, W-80):
        t = (x - 80) / (W - 160)
        a = int(200 * (1 - abs(t*2 - 1)**1.5))
        draw.point((x, H-82), fill=(VIOLET[0], VIOLET[1], VIOLET[2]))
    # Spaced label
    brand = "T H I N K I O . A P P"
    fb = f(FL, 22)
    tw = draw.textlength(brand, font=fb)
    draw.text(((W-tw)//2, H-64), brand, font=fb, fill=(100, 96, 140))

def dots(draw, total, cur):
    r, sp = 5, 18
    tw = total*r*2 + (total-1)*(sp-r*2)
    sx = (W-tw)//2
    for i in range(total):
        x = sx + i*sp
        if i == cur:
            draw.rounded_rectangle([x-1, H-38-r, x+r*2+1, H-38+r+2], radius=4, fill=WHITE)
        else:
            draw.ellipse([x, H-38-r, x+r*2, H-38+r], fill=(55, 50, 85))

def cta_btn(draw, text, y):
    fw = f(FB, 36)
    bw = int(draw.textlength(text, font=fw)) + 90
    bx = (W - bw) // 2
    # Violet fill with subtle top highlight
    draw.rounded_rectangle([bx, y, bx+bw, y+68], radius=34, fill=VIOLET)
    draw.rounded_rectangle([bx+2, y+2, bx+bw-2, y+30], radius=32,
                            fill=(145, 80, 255, 60) if True else VIOLET)
    tw = draw.textlength(text, font=fw)
    draw.text(((W-tw)//2, y+15), text, font=fw, fill=WHITE)
    return y + 86


# ── POST 1 — Carousel: "Why Re-Reading Fails" (6 slides) ─────────────────────

def p1_s1():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "STUDY HACK", 90)
    y += 20
    fi = f(FI, 130); fb = f(FB, 42)
    y = ct(d, "YOU'VE BEEN", fi, y)
    y = ct(d, "STUDYING", fi, y-10)
    y = ct(d, "WRONG.", fi, y-10)
    accent_cross(d, W//2, y+16, 8)
    y += 36; div(d, y); y += 30
    y = cw(d, "Re-reading feels productive. It's not.", f(FL, 38), y, LGRAY)
    y += 40
    cy1 = y; cy2 = y+210
    img = grad_card(img, 80, cy1, W-80, cy2)
    d = ImageDraw.Draw(img)
    fs = f(FB, 34)
    cw(d, "Students who re-read score NO better", fs, cy1+28, WHITE)
    cw(d, "than students who read once.", fs, cy1+76, WHITE)
    cw(d, "— Roediger & Butler, 2011", f(FL, 26), cy1+148, (100, 96, 140))
    footer(d); dots(d, 6, 0)
    return img

def p1_s2():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "STUDY HACK", 90)
    y += 30
    fi = f(FI, 120); fb = f(FB, 40); fm = f(FB, 34)
    y = ct(d, "WHY IT FEELS", fi, y)
    y = ct(d, "LIKE IT WORKS", fi, y-10)
    accent_cross(d, W//2, y+14, 8)
    y += 34; div(d, y); y += 32
    y = cw(d, "Re-reading makes the material feel familiar.", f(FL, 36), y, LGRAY)
    y = cw(d, "But familiar isn't the same as remembered.", f(FL, 36), y-4, LGRAY)
    y += 40
    cy1 = y; cy2 = y+270
    img = grad_card(img, 60, cy1, W-60, cy2)
    d = ImageDraw.Draw(img)
    rows = [("Familiarity", "Feels like knowledge", AMBER), ("Recognition", "Not the same as recall", RED), ("Actual recall", "Effort + struggle", GREEN)]
    ry = cy1 + 30
    for left, right, col in rows:
        lw = d.textlength(left, font=fm); rw = d.textlength(right, font=fm)
        d.text(((W-lw)//2 - 200, ry), left, font=fm, fill=LGRAY)
        d.text(((W-rw)//2 + 160, ry), right, font=fm, fill=col)
        ry += 72; div(d, ry-16)
    footer(d); dots(d, 6, 1)
    return img

def p1_s3():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "STUDY HACK", 90)
    y += 30
    fi = f(FI, 114); fb = f(FB, 40); fm = f(FB, 34)
    y = ct(d, "WHAT ACTUALLY", fi, y)
    y = ct(d, "WORKS.", fi, y-10)
    y += 24; div(d, y); y += 32
    y = cw(d, "Active recall — forcing your brain to retrieve information — beats re-reading by 2x.", fb, y, LGRAY)
    y += 40
    steps = [("Close the book", "Stop looking at it. What do you remember?"), ("Write it down", "Retrieve on paper. The struggle = learning."), ("Check & fix", "Only look back to correct mistakes.")]
    d.rounded_rectangle([60, y, W-60, y+320], radius=20, fill=CARD, outline=DGRAY, width=1)
    fh = f(FB, 36); fs = f(FB, 28); sy = y+30
    for i, (head, body) in enumerate(steps):
        d.ellipse([(W//2)-200, sy+6, (W//2)-180, sy+26], fill=VIOLET)
        hw = d.textlength(head, font=fh)
        d.text(((W-hw)//2+10, sy), head, font=fh, fill=WHITE)
        bw = d.textlength(body, font=fs)
        d.text(((W-bw)//2, sy+42), body, font=fs, fill=LGRAY)
        sy += 96
        if i < 2: div(d, sy-8)
    footer(d); dots(d, 6, 2)
    return img

def p1_s4():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "STUDY HACK", 90)
    y += 30
    fi = f(FI, 120); fb = f(FB, 40); fm = f(FB, 34)
    y = ct(d, "THE 5-MINUTE", fi, y)
    y = ct(d, "RECALL TRICK", fi, y-10)
    y += 24; div(d, y); y += 32
    y = cw(d, "After every class or study session, do this before you close your notes.", fb, y, LGRAY)
    y += 40
    d.rounded_rectangle([60, y, W-60, y+340], radius=20, fill=CARD, outline=DGRAY, width=1)
    items = [("1.", "Close everything"), ("2.", "Write every key point you remember"), ("3.", "Open notes — check what you missed"), ("4.", "Those gaps = what to study next")]
    fh = f(FB, 36); fs = f(FB, 30); ry = y+30
    for num, text in items:
        nw = d.textlength(num, font=fh)
        d.text(((W-nw)//2 - 240, ry), num, font=fh, fill=VIOLET)
        tw2 = d.textlength(text, font=fs)
        d.text(((W-tw2)//2 + 20, ry), text, font=fs, fill=WHITE)
        ry += 72
        div(d, ry-16)
    footer(d); dots(d, 6, 3)
    return img

def p1_s5():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "STUDY HACK", 90)
    y += 30
    fi = f(FI, 120); fb = f(FB, 40)
    y = ct(d, "USE THINKIO", fi, y)
    y = ct(d, "TO DO THIS.", fi, y-10)
    y += 24; div(d, y); y += 32
    y = cw(d, "Upload your notes or PDF. Thinkio generates quiz questions instantly — no effort required.", fb, y, LGRAY)
    y += 50
    d.rounded_rectangle([60, y, W-60, y+280], radius=20, fill=CARD, outline=DGRAY, width=1)
    feats = [("Upload notes", "PDF, photo, Word — any format"), ("Get a quiz", "10–20 questions in seconds"), ("Test yourself", "Active recall, automated")]
    fh = f(FB, 36); fs = f(FB, 28); sy = y+30
    for head, body in feats:
        d.ellipse([(W//2)-210, sy+6, (W//2)-190, sy+26], fill=GREEN)
        hw = d.textlength(head, font=fh)
        d.text(((W-hw)//2+10, sy), head, font=fh, fill=WHITE)
        bw = d.textlength(body, font=fs)
        d.text(((W-bw)//2, sy+42), body, font=fs, fill=LGRAY)
        sy += 84
        div(d, sy-8)
    footer(d); dots(d, 6, 4)
    return img

def p1_s6():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "STUDY HACK", 90)
    y += 60
    fi = f(FI, 110); fb = f(FB, 42); fm = f(FB, 34)
    y = ct(d, "STOP RE-READING.", fi, y)
    y = ct(d, "START RECALLING.", fi, y-10)
    y += 30; div(d, y); y += 36
    y = cw(d, "Your notes → quiz in 10 seconds.", fb, y, WHITE)
    y += 10
    y = cw(d, "Try it free.", fm, y, LGRAY)
    y += 60
    y = cta_btn(d, "Try Thinkio free", y)
    fn = f(FB, 30)
    y = cw(d, "link in bio", fn, y+10, MGRAY)
    footer(d); dots(d, 6, 5)
    return img


# ── POST 2 — Single: "Your brain forgets 70% today" ──────────────────────────

def p2_single():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "BRAIN SCIENCE", 90)
    y += 40
    fi = f(FI, 180); fb = f(FB, 46); fm = f(FB, 34)
    y = ct(d, "70%", fi, y, RED)
    y += 10; div(d, y); y += 30
    y = cw(d, "of everything you studied today", fb, y, WHITE)
    y = cw(d, "will be gone by tomorrow.", fb, y-8, WHITE)
    y += 20
    y = cw(d, "This is called the Forgetting Curve.", fm, y, LGRAY)
    y = cw(d, "Hermann Ebbinghaus discovered it in 1885.", fm, y-4, LGRAY)
    y += 50
    d.rounded_rectangle([60, y, W-60, y+300], radius=20, fill=CARD, outline=DGRAY, width=1)
    rows = [("After 1 hour", "50% forgotten", RED), ("After 24 hours", "70% forgotten", RED), ("After 1 week", "90% forgotten", RED), ("With daily review", "90% retained", GREEN)]
    fh = f(FB, 34); ry = y+28
    for label, val, col in rows:
        lw = d.textlength(label, font=fh); rw = d.textlength(val, font=fh)
        d.text(((W-lw)//2-180, ry), label, font=fh, fill=LGRAY)
        d.text(((W-rw)//2+180, ry), val, font=fh, fill=col)
        ry += 62; div(d, ry-14)
    y += 330
    y = cw(d, "Thinkio daily flashcards beat the curve automatically.", f(FB, 34), y+20, LGRAY)
    footer(d)
    return img


# ── POST 3 — Carousel: "Active Recall Method" (5 slides) ─────────────────────

def p3_s1():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "ACTIVE RECALL", 90)
    y += 20
    fi = f(FI, 130); fb = f(FB, 42)
    y = ct(d, "THE ONLY", fi, y)
    y = ct(d, "STUDY METHOD", fi, y-10)
    y = ct(d, "THAT WORKS.", fi, y-10)
    y += 20; div(d, y); y += 30
    y = cw(d, "Backed by 100+ studies. Used by top students. Still ignored by most.", fb, y, LGRAY)
    y += 40
    d.rounded_rectangle([80, y, W-80, y+200], radius=20, fill=CARD, outline=DGRAY, width=1)
    fs = f(FB, 36)
    cw(d, "Active recall students score", fs, y+30, WHITE)
    cw(d, "50% higher on tests", f(FI, 70), y+80, VIOLET)
    cw(d, "vs students who only re-read.", f(FB, 30), y+160, LGRAY)
    footer(d); dots(d, 5, 0)
    return img

def p3_s2():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "ACTIVE RECALL", 90)
    y += 30
    fi = f(FI, 120); fb = f(FB, 40); fm = f(FB, 34)
    y = ct(d, "HOW TO", fi, y)
    y = ct(d, "DO IT.", fi, y-10)
    y += 24; div(d, y); y += 32
    y = cw(d, "It's simple. Just uncomfortable. That discomfort IS the learning.", fb, y, LGRAY)
    y += 40
    steps = [("Read a section", "Just once. Don't highlight everything."), ("Close the book", "No peeking. This is the key step."), ("Write what you know", "Bullet points. No judgment."), ("Check & correct", "Gaps you find = your study list.")]
    d.rounded_rectangle([60, y, W-60, y+380], radius=20, fill=CARD, outline=DGRAY, width=1)
    fh = f(FB, 34); fs = f(FB, 27); sy = y+28
    for i, (head, body) in enumerate(steps):
        d.ellipse([(W//2)-210, sy+6, (W//2)-190, sy+26], fill=VIOLET)
        hw = d.textlength(head, font=fh)
        d.text(((W-hw)//2+10, sy), head, font=fh, fill=WHITE)
        bw = d.textlength(body, font=fs)
        d.text(((W-bw)//2, sy+40), body, font=fs, fill=LGRAY)
        sy += 88
        if i < 3: div(d, sy-8)
    footer(d); dots(d, 5, 1)
    return img

def p3_s3():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "ACTIVE RECALL", 90)
    y += 30
    fi = f(FI, 120); fb = f(FB, 40); fm = f(FB, 34)
    y = ct(d, "WHY STUDENTS", fi, y)
    y = ct(d, "AVOID IT.", fi, y-10)
    y += 24; div(d, y); y += 32
    y = cw(d, "It feels harder. Because it is. And that's exactly the point.", fb, y, LGRAY)
    y += 40
    d.rounded_rectangle([60, y, W-60, y+280], radius=20, fill=CARD, outline=DGRAY, width=1)
    rows = [("Re-reading", "Easy, comfortable", RED), ("Highlighting", "Feels productive, isn't", RED), ("Active recall", "Hard, uncomfortable", GREEN), ("Active recall result", "Actual memory", GREEN)]
    fh = f(FB, 32); ry = y+28
    for label, val, col in rows:
        lw = d.textlength(label, font=fh); rw = d.textlength(val, font=fh)
        d.text(((W-lw)//2-170, ry), label, font=fh, fill=LGRAY)
        d.text(((W-rw)//2+140, ry), val, font=fh, fill=col)
        ry += 60; div(d, ry-12)
    footer(d); dots(d, 5, 2)
    return img

def p3_s4():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "ACTIVE RECALL", 90)
    y += 30
    fi = f(FI, 120); fb = f(FB, 40)
    y = ct(d, "THINKIO DOES", fi, y)
    y = ct(d, "IT FOR YOU.", fi, y-10)
    y += 24; div(d, y); y += 32
    y = cw(d, "You upload. It quizzes you. You recall. Repeat daily.", fb, y, LGRAY)
    y += 44
    feats = [("Upload notes", "Any format — PDF, photo, Word"), ("AI generates quiz", "10–20 questions per upload"), ("You answer", "Active recall, zero prep"), ("Daily habit", "5 min/day builds long-term memory")]
    d.rounded_rectangle([60, y, W-60, y+360], radius=20, fill=CARD, outline=DGRAY, width=1)
    fh = f(FB, 34); fs = f(FB, 27); sy = y+28
    for head, body in feats:
        d.ellipse([(W//2)-210, sy+6, (W//2)-190, sy+26], fill=GREEN)
        hw = d.textlength(head, font=fh)
        d.text(((W-hw)//2+10, sy), head, font=fh, fill=WHITE)
        bw = d.textlength(body, font=fs)
        d.text(((W-bw)//2, sy+40), body, font=fs, fill=LGRAY)
        sy += 82
        div(d, sy-8)
    footer(d); dots(d, 5, 3)
    return img

def p3_s5():
    img = make_bg(); d = ImageDraw.Draw(img)
    y = pill(d, "ACTIVE RECALL", 90)
    y += 60
    fi = f(FI, 110); fb = f(FB, 42); fm = f(FB, 34)
    y = ct(d, "STUDY SMARTER.", fi, y)
    y = ct(d, "NOT LONGER.", fi, y-10)
    y += 30; div(d, y); y += 36
    y = cw(d, "5 minutes of active recall > 2 hours of re-reading.", fb, y, WHITE)
    y += 10
    y = cw(d, "Try it free — link in bio.", fm, y, LGRAY)
    y += 60
    y = cta_btn(d, "Try Thinkio free", y)
    footer(d); dots(d, 5, 4)
    return img


# ── Run ───────────────────────────────────────────────────────────────────────

POSTS = [
    ("01-rereading-fails",   [p1_s1, p1_s2, p1_s3, p1_s4, p1_s5, p1_s6]),
    ("02-forgetting-curve",  [p2_single]),
    ("03-active-recall",     [p3_s1, p3_s2, p3_s3, p3_s4, p3_s5]),
]

os.makedirs(OUT, exist_ok=True)
print(f"Generating Thinkio IG posts -> {OUT}\n")
for folder, slides in POSTS:
    out = os.path.join(OUT, folder)
    os.makedirs(out, exist_ok=True)
    print(f">> {folder}")
    for i, fn in enumerate(slides):
        img = fn()
        img.save(os.path.join(out, f"slide-{i+1:02d}.png"))
        print(f"  slide-{i+1:02d}.png ok")
    print()
print("Done.")

from PIL import Image, ImageDraw, ImageFont
import os, io, json, time, hashlib, urllib.request

KIE_KEY  = "711434298fc382897de00dabcab775be"
KIE_BASE = "https://api.kie.ai/api/v1"
BASE     = r"C:\Users\vukzi\Downloads"
OUT_DIR  = r"C:\Users\vukzi\OneDrive\Desktop\Instagram posts"
BG_CACHE = os.path.join(BASE, "_ig_bg_cache")

CW, CH = 1080, 1350   # carousel 4:5
QW, QH = 1080, 1080   # square single post
RW, RH = 1080, 1920   # reel thumbnail 9:16

WHITE = (255,255,255); BLACK = (0,0,0); LGRAY = (220,220,220)
MGRAY = (140,140,140); DGRAY = (60,60,60)

FONT_IMPACT = r"C:\Windows\Fonts\impact.ttf"
FONT_LATO_B = r"C:\Windows\Fonts\LatoWeb-Bold.ttf"
FONT_ARIAL  = r"C:\Windows\Fonts\arialbd.ttf"


def f(path, size):
    try:    return ImageFont.truetype(path, size)
    except: return ImageFont.truetype(FONT_ARIAL, size)


def draw_centered(draw, text, font, y, W, color=WHITE):
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


def add_overlay(img, strength=0.6, W=CW, H=CH):
    ov = Image.new("RGBA", (W, H), (0,0,0,0))
    d  = ImageDraw.Draw(ov)
    for y in range(H):
        t = y / H
        a = int(max(0, t - 0.1) * strength * 255 * 1.4)
        a = min(a, int(strength * 255))
        d.line([(0,y),(W,y)], fill=(0,0,0,a))
    top = int(H * 0.18)
    for y in range(top):
        a = int((1 - y / top) * 110)
        d.line([(0,y),(W,y)], fill=(0,0,0,a))
    return Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")


def add_dim(img, alpha=0.55, W=QW, H=QH):
    ov = Image.new("RGBA", (W, H), (0, 0, 0, int(255 * alpha)))
    return Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")


def wrap_lines(draw, text, font, max_w):
    words = text.split()
    lines, cur = [], ""
    for word in words:
        test = (cur + " " + word).strip()
        if draw.textlength(test, font=font) <= max_w:
            cur = test
        else:
            if cur: lines.append(cur)
            cur = word
    if cur: lines.append(cur)
    return lines


def fetch_bg(prompt, ratio, tw, th):
    os.makedirs(BG_CACHE, exist_ok=True)
    key   = hashlib.md5(f"{prompt}|{ratio}".encode()).hexdigest()[:14]
    cache = os.path.join(BG_CACHE, f"{key}.jpg")

    if os.path.exists(cache):
        img = Image.open(cache).convert("RGB")
    else:
        print(f"    Generating AI bg ({ratio}): {prompt[:60]}...")
        payload = json.dumps({
            "prompt": prompt,
            "aspectRatio": ratio,
            "model": "flux-kontext-pro",
            "outputFormat": "jpeg"
        }).encode()
        req = urllib.request.Request(
            f"{KIE_BASE}/flux/kontext/generate", data=payload,
            headers={"Authorization": f"Bearer {KIE_KEY}", "Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=30) as r:
            resp = json.loads(r.read())

        task_id = resp["data"]["taskId"]
        print(f"    taskId: {task_id} — polling...")

        poll_url = f"{KIE_BASE}/flux/kontext/record-info?taskId={task_id}"
        poll_req = urllib.request.Request(poll_url, headers={"Authorization": f"Bearer {KIE_KEY}"})
        img_url = None
        for attempt in range(50):
            time.sleep(4)
            with urllib.request.urlopen(poll_req, timeout=30) as r:
                data = json.loads(r.read()).get("data", {})
            flag = data.get("successFlag", 0)
            if attempt % 5 == 0:
                print(f"    [{attempt+1}] flag={flag}")
            if flag == 1:
                img_url = data.get("response", {}).get("resultImageUrl", "")
                break
            if flag in (2, 3):
                raise RuntimeError(f"kie.ai generation failed: {data}")
        if not img_url:
            raise TimeoutError(f"kie.ai timed out for task {task_id}")

        dl = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(dl, timeout=60) as r:
            img = Image.open(io.BytesIO(r.read())).convert("RGB")
        img.save(cache)
        print(f"    Cached: {os.path.basename(cache)}")

    sc = max(tw / img.width, th / img.height)
    nw, nh = int(img.width * sc), int(img.height * sc)
    img = img.resize((nw, nh), Image.LANCZOS)
    l, t = (nw - tw) // 2, (nh - th) // 2
    return img.crop((l, t, l + tw, t + th))


# ── Renderers ──────────────────────────────────────────────────────────────────

def render_cover(bg_prompt, label, title_lines, subtitle):
    img  = fetch_bg(bg_prompt, "3:4", CW, CH)
    img  = add_overlay(img, strength=0.65)
    draw = ImageDraw.Draw(img)
    PAD  = 80

    f_lbl = f(FONT_LATO_B, 28)
    lw = draw.textlength(label, font=f_lbl)
    draw.text(((CW - lw) / 2, PAD + 10), label, font=f_lbl, fill=MGRAY)
    draw.line([(CW//2 - 80, PAD + 56), (CW//2 + 80, PAD + 56)], fill=MGRAY, width=1)

    y = 270
    for text, size in title_lines:
        fn   = f(FONT_IMPACT, size)
        tw_px = draw.textlength(text, font=fn)
        draw.text(((CW - tw_px) / 2, y), text, font=fn, fill=WHITE)
        y += size + 16

    f_sub = f(FONT_LATO_B, 42)
    sw = draw.textlength(subtitle, font=f_sub)
    draw.text(((CW - sw) / 2, y + 30), subtitle, font=f_sub, fill=LGRAY)
    return img


def render_tip(bg_prompt, n, total, head, body):
    img  = fetch_bg(bg_prompt, "3:4", CW, CH)
    img  = add_overlay(img, strength=0.60)
    draw = ImageDraw.Draw(img)
    PAD  = 80

    f_num = f(FONT_LATO_B, 26)
    draw.text((PAD, PAD), f"{n:02d} / {total:02d}", font=f_num, fill=MGRAY)
    draw.line([(PAD - 24, PAD + 4), (PAD - 24, PAD + 36)], fill=WHITE, width=3)

    f_head = f(FONT_IMPACT, 148)
    hy = 230
    for line in head.split("\n"):
        lw = draw.textlength(line, font=f_head)
        draw.text(((CW - lw) / 2, hy), line, font=f_head, fill=WHITE)
        hy += 168

    draw.line([(PAD, hy + 16), (PAD + 100, hy + 16)], fill=WHITE, width=2)

    f_body = f(FONT_LATO_B, 44)
    by = hy + 55
    for line in wrap_lines(draw, body, f_body, CW - PAD * 2):
        draw.text((PAD, by), line, font=f_body, fill=LGRAY)
        by += 58
    return img


def render_cta_slide():
    img  = Image.new("RGB", (CW, CH), BLACK)
    draw = ImageDraw.Draw(img)

    icon_size = 140
    ix = CW // 2 - icon_size // 2
    iy = 240
    draw.rounded_rectangle([ix, iy, ix + icon_size, iy + icon_size], radius=32, fill=WHITE)
    draw_sparkle(draw, CW // 2, iy + icon_size // 2, 90, BLACK)

    f_brand = f(FONT_IMPACT, 86)
    bw = draw.textlength("Thinkio", font=f_brand)
    draw.text(((CW - bw) / 2, iy + icon_size + 22), "Thinkio", font=f_brand, fill=WHITE)

    f_tag = f(FONT_LATO_B, 38)
    ty = iy + icon_size + 150
    draw_centered(draw, "Think smarter, not harder.", f_tag, ty,       CW, LGRAY)
    draw_centered(draw, "Try it free — link in bio.",  f_tag, ty + 58, CW, WHITE)

    draw.line([(CW//2 - 110, ty + 130), (CW//2 + 110, ty + 130)], fill=DGRAY, width=1)
    f_save = f(FONT_LATO_B, 30)
    draw_centered(draw, "v  Save this for later", f_save, ty + 154, CW, MGRAY)
    return img


def render_single(bg_prompt, headline, body):
    W, H = QW, QH
    img  = fetch_bg(bg_prompt, "1:1", W, H)
    img  = add_dim(img, alpha=0.55, W=W, H=H)
    draw = ImageDraw.Draw(img)
    PAD  = 80

    draw_sparkle(draw, 68, 68, 48, WHITE)

    f_head = f(FONT_IMPACT, 90)
    head_lines = wrap_lines(draw, headline, f_head, W - PAD * 2)
    hy = H // 2 - (len(head_lines) * 104) // 2 - 60
    for line in head_lines:
        draw.text((PAD, hy), line, font=f_head, fill=WHITE)
        hy += 104

    draw.line([(PAD, hy + 10), (PAD + 80, hy + 10)], fill=WHITE, width=2)

    f_body = f(FONT_LATO_B, 40)
    by = hy + 36
    for line in wrap_lines(draw, body, f_body, W - PAD * 2):
        draw.text((PAD, by), line, font=f_body, fill=LGRAY)
        by += 52
    return img


def render_reel(bg_prompt, line1, line2=None):
    W, H = RW, RH
    img  = fetch_bg(bg_prompt, "9:16", W, H)
    img  = add_dim(img, alpha=0.45, W=W, H=H)
    draw = ImageDraw.Draw(img)

    draw_sparkle(draw, 68, 88, 52, WHITE)
    f_logo = f(FONT_LATO_B, 26)
    draw.text((106, 74), "thinkio", font=f_logo, fill=LGRAY)

    f_hook = f(FONT_IMPACT, 116)
    lines  = [line1] + ([line2] if line2 else [])
    total  = len(lines) * 132
    sy     = H // 2 - total // 2
    for line in lines:
        lw = draw.textlength(line, font=f_hook)
        draw.text(((W - lw) / 2, sy), line, font=f_hook, fill=WHITE)
        sy += 132

    f_swipe = f(FONT_LATO_B, 30)
    draw_centered(draw, "watch for the full guide →", f_swipe, H - 110, W, MGRAY)
    return img


# ── Post definitions ──────────────────────────────────────────────────────────

POSTS = [

    # ── CAROUSELS ──────────────────────────────────────────────────────────────

    {"type": "carousel", "folder": "01-ace-any-exam",
     "bg": "open textbook on wooden desk, warm lamp light, soft bokeh, dark moody, photorealistic, 4K",
     "label": "EXAM TIPS",
     "title": [("HOW TO", 148), ("ACE ANY", 148), ("EXAM", 148)],
     "sub": "5 habits that actually work",
     "tips": [
         (1, "PAST\nPAPERS",    "Old exams are the closest thing to a cheat code."),
         (2, "TEACH\nIT BACK",  "If you can explain it simply, you know it."),
         (3, "FIX YOUR\nERRORS","Every wrong answer = your next study session."),
         (4, "SLEEP\nBEFORE",   "Your brain locks memories while you sleep."),
         (5, "USE\nTHINKIO",    "AI quizzes from your notes. Instantly."),
     ]},

    {"type": "carousel", "folder": "02-why-rereading-fails",
     "bg": "sticky notes on glass window, evening light, dark background, study aesthetic, photorealistic, 4K",
     "label": "STUDY SCIENCE",
     "title": [("WHY", 148), ("RE-READING", 110), ("FAILS", 148)],
     "sub": "and what to do instead",
     "tips": [
         (1, "FEELS\nFAMILIAR",  "Familiarity tricks your brain into thinking you know it."),
         (2, "ZERO\nSTRUGGLE",   "Passive reading = zero memory encoding. You need effort."),
         (3, "ACTIVE\nRECALL",   "Close the book. Try to remember. That's real learning."),
         (4, "TEST DON'T\nREAD", "Quizzing yourself beats re-reading by 2x in every study."),
         (5, "USE\nTHINKIO",     "Turn your notes into quizzes in seconds. Test, don't reread."),
     ]},

    {"type": "carousel", "folder": "03-active-recall",
     "bg": "flashcards spread on dark wooden desk, pen, focused student hands, moody warm light, photorealistic, 4K",
     "label": "STUDY METHOD",
     "title": [("ACTIVE", 148), ("RECALL", 148), ("METHOD", 130)],
     "sub": "the #1 technique backed by science",
     "tips": [
         (1, "CLOSE\nTHE BOOK", "Stop reading. Cover it. What do you actually remember?"),
         (2, "WRITE\nIT DOWN",  "Retrieve on paper. The struggle is the learning."),
         (3, "CHECK &\nCORRECT","Review what you got wrong. That's where growth happens."),
         (4, "REPEAT\nDAILY",   "5 min of recall beats 3 hours cramming once."),
         (5, "USE\nTHINKIO",    "Upload notes → instant quiz. Active recall, zero effort."),
     ]},

    {"type": "carousel", "folder": "04-pomodoro",
     "bg": "timer and coffee mug on minimal dark desk, notebook open, soft warm light, photorealistic, 4K",
     "label": "FOCUS METHOD",
     "title": [("THE", 148), ("POMODORO", 110), ("TECHNIQUE", 110)],
     "sub": "study 25 min, rest 5. repeat.",
     "tips": [
         (1, "25 MIN\nFOCUS",    "One task. Full focus. Phone off. Just 25 minutes."),
         (2, "5 MIN\nBREAK",     "Step away. Stretch. Don't open social media."),
         (3, "4 ROUNDS\n= DONE", "After 4 pomodoros, take a longer 20-min break."),
         (4, "TRACK\nYOUR SETS", "Count your sessions. 6–8 per day = elite output."),
         (5, "USE\nTHINKIO",     "Generate material fast. Spend your 25 min actually learning."),
     ]},

    {"type": "carousel", "folder": "05-night-before-exam",
     "bg": "late night desk setup, single lamp glowing, dark room, exam papers and notebook, cinematic, photorealistic, 4K",
     "label": "EXAM NIGHT",
     "title": [("THE NIGHT", 130), ("BEFORE", 148), ("THE EXAM", 120)],
     "sub": "what top students actually do",
     "tips": [
         (1, "NO NEW\nSTUFF",    "Don't learn anything new. Review only what you know."),
         (2, "LIGHT\nREVIEW",    "Skim flashcards once. Cramming adds anxiety, not marks."),
         (3, "SLEEP BY\n10PM",   "One more hour of sleep beats two hours of cramming."),
         (4, "PREP YOUR\nBAG",   "Lay everything out. Morning-you will thank you."),
         (5, "USE\nTHINKIO",     "Review your AI flashcards once. Then close the app."),
     ]},

    {"type": "carousel", "folder": "06-note-taking",
     "bg": "handwritten notes close-up, pen in hand, warm desk lamp, dark background, photorealistic, 4K",
     "label": "NOTE TIPS",
     "title": [("NOTE-TAKING", 100), ("THAT", 148), ("WORKS", 148)],
     "sub": "you're probably doing it wrong",
     "tips": [
         (1, "DON'T\nCOPY ALL",  "Writing everything = remembering nothing. Be selective."),
         (2, "USE YOUR\nOWN WORDS","Paraphrase it. If you can't, you don't understand it yet."),
         (3, "LEAVE\nGAPS",      "Leave space to add to notes after class. Then do it."),
         (4, "REVIEW\nIN 24HRS", "Same-day review cements 70% more into long-term memory."),
         (5, "USE\nTHINKIO",     "Upload your notes. AI turns them into quiz questions instantly."),
     ]},

    {"type": "carousel", "folder": "07-focus-no-phone",
     "bg": "phone face-down on clean dark minimal desk, single lamp, no distractions, photorealistic, 4K",
     "label": "FOCUS TIPS",
     "title": [("FOCUS", 148), ("WITHOUT", 130), ("YOUR PHONE", 100)],
     "sub": "harder than it sounds. here's how.",
     "tips": [
         (1, "PHONE\nOUT",       "Not face-down. In another room. Non-negotiable."),
         (2, "ONE TAB\nONLY",    "Every open tab costs you 5 minutes of recovery focus."),
         (3, "WHITE\nNOISE",     "Lo-fi or rain sounds block distraction better than silence."),
         (4, "WRITE IT\nDOWN",   "Brain-dump distractions on paper. Your mind can let go."),
         (5, "USE\nTHINKIO",     "Study material ready in 10 seconds. Less setup, more focus."),
     ]},

    {"type": "carousel", "folder": "08-study-schedule",
     "bg": "weekly planner open on dark wood desk, pen, minimal clean setup, photorealistic, 4K",
     "label": "PLANNING TIPS",
     "title": [("BUILD A", 130), ("STUDY", 148), ("SCHEDULE", 120)],
     "sub": "that you'll actually follow",
     "tips": [
         (1, "REVIEW\nDAILY",    "10 min after every class. Before you forget anything."),
         (2, "DEEP WORK\nBLOCKS","2–3 hour focused blocks, 3x per week. No multitasking."),
         (3, "ROTATE\nSUBJECTS", "Don't study one subject every day. Rotation builds memory."),
         (4, "BUFFER\nDAYS",     "Keep one day free. Life happens. Buffer days save you."),
         (5, "USE\nTHINKIO",     "Your study material is always ready. Open and review."),
     ]},

    {"type": "carousel", "folder": "09-exam-anxiety",
     "bg": "calm student at desk, deep breath, warm bokeh light, peaceful, soft focus, photorealistic, 4K",
     "label": "MENTAL HEALTH",
     "title": [("BEATING", 130), ("EXAM", 148), ("ANXIETY", 130)],
     "sub": "what's causing it — and how to fix it",
     "tips": [
         (1, "IT'S\nNORMAL",     "A little anxiety = your brain taking the exam seriously."),
         (2, "PREP IS\nTHE CURE","The #1 cause of exam anxiety is under-preparation. Period."),
         (3, "BREATHE\nBOX",     "4 in, 4 hold, 4 out, 4 hold. Repeat 3 times. It works."),
         (4, "VISUALIZE\nSUCCESS","60 seconds imagining yourself doing well. Science-backed."),
         (5, "USE\nTHINKIO",     "Know the material cold. Confidence kills anxiety."),
     ]},

    {"type": "carousel", "folder": "10-ai-study-tools",
     "bg": "laptop with glowing screen on dark minimal desk, tech aesthetic, dark room, photorealistic, 4K",
     "label": "AI TOOLS 2025",
     "title": [("AI TOOLS", 130), ("THAT HELP", 120), ("YOU STUDY", 110)],
     "sub": "the ones actually worth using",
     "tips": [
         (1, "NOTE\nSUMMARY",   "AI summarizes your notes — skip the fluff, keep the facts."),
         (2, "QUIZ\nGENERATOR", "Instant test questions from your uploaded notes."),
         (3, "FLASH-\nCARDS",   "Auto-generated spaced-repetition cards. Saves hours."),
         (4, "STUDY\nCHAT",     "Ask your AI tutor anything — like a teacher at 2am."),
         (5, "USE\nTHINKIO",    "All of the above. One app. Upload notes. Start learning."),
     ]},

    # ── SINGLE POSTS ─────────────────────────────────────────────────────────

    {"type": "single", "folder": "11-quote-study-less",
     "bg": "abstract very dark background, subtle light bokeh, minimalist, elegant, dark, photorealistic",
     "headline": "The goal isn't to study more.",
     "body": "It's to forget less. Most students waste hours re-reading. The ones who actually improve test themselves — over and over."},

    {"type": "single", "folder": "12-stat-testing",
     "bg": "dark background with soft glowing light particles, abstract, minimal, deep dark, photorealistic",
     "headline": "Students who test themselves score 50% higher.",
     "body": "Not students who study longer. Not students who re-read. The ones who quiz themselves. That's it. That's the secret."},

    {"type": "single", "folder": "13-relatable-2hrs",
     "bg": "chaotic student desk with snacks and open laptop, dark moody, slightly messy, photorealistic",
     "headline": "Me: I'll study for 2 hours.",
     "body": "Also me: 4 hours later, still on slide 3, somehow watching a documentary about ancient Rome. We've all been there."},

    {"type": "single", "folder": "14-sleep-tip",
     "bg": "person sleeping peacefully at cozy desk, soft warm lamp, dark room, photorealistic",
     "headline": "Sleep beats cramming. Every time.",
     "body": "Your brain locks in memories during deep sleep. Pulling an all-nighter before an exam actively hurts your recall. Go to sleep."},

    {"type": "single", "folder": "15-thinkio-cta",
     "bg": "clean minimal white desk with phone, coffee cup, open notebook, bright flat lay, photorealistic",
     "headline": "Your notes → quizzes, flashcards & lessons.",
     "body": "In 10 seconds. No typing. No formatting. Just upload and start learning. That's what Thinkio does. Link in bio."},

    # ── REEL THUMBNAILS ───────────────────────────────────────────────────────

    {"type": "reel", "folder": "16-reel-active-recall",
     "bg": "POV overhead desk view, hand reaching for pen, open notebook, dark aesthetic, cinematic, photorealistic",
     "line1": "POV: YOU JUST", "line2": "FOUND ACTIVE RECALL"},

    {"type": "reel", "folder": "17-reel-gpa-glow-up",
     "bg": "before and after student desk, messy vs clean minimal, dark cinematic contrast, photorealistic",
     "line1": "HOW I WENT FROM", "line2": "FAILING TO A's"},

    {"type": "reel", "folder": "18-reel-app-demo",
     "bg": "hand holding phone with bright glowing app screen, dark minimal background, photorealistic",
     "line1": "I TURNED MY NOTES", "line2": "INTO A QUIZ IN 10s"},

    {"type": "reel", "folder": "19-reel-relatable",
     "bg": "student asleep on open textbooks at desk, dark humor, moody warm light, photorealistic",
     "line1": "STUDIED 5 HOURS.", "line2": "REMEMBERED NOTHING."},

    {"type": "reel", "folder": "20-reel-exam-tip",
     "bg": "student at desk very late at night, single lamp, exam papers scattered, dark cinematic, photorealistic",
     "line1": "DO THIS THE", "line2": "NIGHT BEFORE EVERY EXAM"},
]


# ── Generate ──────────────────────────────────────────────────────────────────

os.makedirs(OUT_DIR, exist_ok=True)
print(f"Generating {len(POSTS)} Instagram posts -> {OUT_DIR}\n")

for post in POSTS:
    out = os.path.join(OUT_DIR, post["folder"])
    os.makedirs(out, exist_ok=True)
    print(f"[{post['folder']}]")

    if post["type"] == "carousel":
        tips   = post["tips"]
        total  = len(tips)
        slides = [render_cover(post["bg"], post["label"], post["title"], post["sub"])]
        for n, head, body in tips:
            slides.append(render_tip(post["bg"], n, total, head, body))
        slides.append(render_cta_slide())
        for i, img in enumerate(slides):
            path = os.path.join(out, f"slide-{i+1:02d}.png")
            img.save(path)
            print(f"  slide-{i+1:02d}.png")

    elif post["type"] == "single":
        img = render_single(post["bg"], post["headline"], post["body"])
        img.save(os.path.join(out, "post.png"))
        print(f"  post.png")

    elif post["type"] == "reel":
        img = render_reel(post["bg"], post["line1"], post.get("line2"))
        img.save(os.path.join(out, "thumbnail.png"))
        print(f"  thumbnail.png")

    print(f"  done\n")

print("All done!")

import os, io, json, time, urllib.request

KIE_KEY  = "711434298fc382897de00dabcab775be"
KIE_BASE = "https://api.kie.ai/api/v1"
OUT_DIR  = r"C:\Users\vukzi\OneDrive\Desktop\Instagram posts"


def veo_generate(prompt):
    payload = json.dumps({
        "prompt": prompt,
        "model": "veo3_fast",
        "generationType": "TEXT_2_VIDEO",
        "aspect_ratio": "9:16",
    }).encode()
    req = urllib.request.Request(
        f"{KIE_BASE}/veo/generate", data=payload,
        headers={"Authorization": f"Bearer {KIE_KEY}", "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        resp = json.loads(r.read())
    print(f"  Response: {resp}")
    return resp["data"]["taskId"]


def veo_poll(task_id, max_attempts=80):
    url = f"{KIE_BASE}/veo/record-info?taskId={task_id}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {KIE_KEY}"})
    for attempt in range(max_attempts):
        time.sleep(5)
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read()).get("data", {})
        flag = data.get("successFlag", 0)
        if attempt % 6 == 0:
            print(f"  [{attempt+1}] flag={flag}")
        if flag == 1:
            resp = data.get("response", {})
            # Try common field names for video URL
            url = (resp.get("resultVideoUrl") or resp.get("videoUrl")
                   or resp.get("url") or resp.get("outputUrl") or "")
            if not url:
                print(f"  Full data: {data}")
            return url
        if flag in (2, 3):
            raise RuntimeError(f"Veo generation failed: {data}")
    raise TimeoutError(f"Veo timed out for task {task_id}")


def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        with open(path, "wb") as f:
            f.write(r.read())


REELS = [
    {
        "folder": "16-reel-active-recall",
        "prompt": (
            "Cinematic vertical video 9:16. A student's hand slowly opens a notebook on a dark minimal desk, "
            "picks up a pen, and starts writing notes from memory — no book open. Warm lamp light. "
            "Moody, focused atmosphere. Slow motion close-up. Photorealistic, cinematic depth of field."
        ),
    },
    {
        "folder": "17-reel-gpa-glow-up",
        "prompt": (
            "Cinematic vertical video 9:16. Time-lapse of a messy chaotic student desk — papers everywhere, "
            "snacks, phone — transforming into a clean minimal focused study setup with one open notebook and a lamp. "
            "Moody dark aesthetic. Satisfying transformation. Photorealistic."
        ),
    },
    {
        "folder": "18-reel-app-demo",
        "prompt": (
            "Cinematic vertical video 9:16. Close-up of hands photographing handwritten notes with a phone. "
            "Then the phone screen lights up showing a clean quiz app interface. Dark background, minimal desk. "
            "Smooth camera movement. Modern tech aesthetic. Photorealistic."
        ),
    },
    {
        "folder": "19-reel-relatable",
        "prompt": (
            "Cinematic vertical video 9:16. A student slowly falls asleep on top of a thick open textbook at their desk. "
            "Lamp light dims. Stack of books beside them. Empty coffee cup. Dark cozy room. "
            "Slightly comedic but cinematic. Slow motion. Photorealistic."
        ),
    },
    {
        "folder": "20-reel-exam-tip",
        "prompt": (
            "Cinematic vertical video 9:16. A student at a desk late at night calmly packs their school bag — "
            "placing a pencil case, water bottle, and ID card inside. Then closes the laptop, turns off the desk lamp, "
            "and the room goes dark. Peaceful, prepared atmosphere. Cinematic depth of field. Photorealistic."
        ),
    },
]


os.makedirs(OUT_DIR, exist_ok=True)
print(f"Generating {len(REELS)} Veo 3.1 reels...\n")

for reel in REELS:
    out = os.path.join(OUT_DIR, reel["folder"])
    os.makedirs(out, exist_ok=True)
    video_path = os.path.join(out, "reel.mp4")

    if os.path.exists(video_path):
        print(f"[{reel['folder']}] already exists, skipping\n")
        continue

    print(f"[{reel['folder']}]")
    print(f"  Generating video...")
    task_id = veo_generate(reel["prompt"])
    print(f"  taskId: {task_id} — polling...")
    video_url = veo_poll(task_id)

    if video_url:
        print(f"  Downloading...")
        download(video_url, video_path)
        print(f"  Saved: reel.mp4\n")
    else:
        print(f"  ERROR: no video URL in response\n")

print("All done!")

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const maxDuration = 60;

const LIMITS = {
  free: { count: 3, hours: 168 },   // 3 per week
  plus: { count: 20, hours: 168 },  // 20 per week
};

async function checkRateLimit(userId: string, plan: string): Promise<{ allowed: boolean; remaining: number }> {
  const limit = plan === "plus" ? LIMITS.plus : LIMITS.free;
  const supabase = getSupabaseAdmin();
  const windowStart = new Date(Date.now() - limit.hours * 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("upload_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", windowStart);

  const used = count ?? 0;
  if (used >= limit.count) return { allowed: false, remaining: 0 };

  await supabase.from("upload_logs").insert({ user_id: userId });
  return { allowed: true, remaining: limit.count - used - 1 };
}

const client = new Anthropic();

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
type ImageMediaType = (typeof IMAGE_TYPES)[number];

function isImageType(mime: string): mime is ImageMediaType {
  return IMAGE_TYPES.includes(mime as ImageMediaType);
}

function isPdfType(mime: string): boolean {
  return mime === "application/pdf";
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const plan = (user.publicMetadata as { plan?: string })?.plan ?? "free";
  const isPro = plan === "pro";

  if (!isPro) {
    const { allowed } = await checkRateLimit(userId, plan);
    if (!allowed) {
      const limit = plan === "plus" ? LIMITS.plus : LIMITS.free;
      return NextResponse.json(
        { error: `Upload limit reached. You can make ${limit.count} uploads per week on the ${plan} plan. Upgrade for more uploads.` },
        { status: 429 }
      );
    }
  }

  const formData = await req.formData();
  const mode = formData.get("mode") as string;
  const rawCount = parseInt((formData.get("count") as string) || "10", 10);
  const maxCount = isPro ? 50 : 20;
  const count = Math.min(rawCount, maxCount);
  const subject = (formData.get("subject") as string) || null;
  const topics = (formData.get("topics") as string) || null;
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }
  if (!["quiz", "flashcards", "lesson", "problems"].includes(mode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  // Build Anthropic message content
  const contentBlocks: Anthropic.MessageParam["content"] = [];
  const fileNames: string[] = [];

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const mime = file.type || "application/octet-stream";
    fileNames.push(file.name);

    if (isImageType(mime)) {
      // Send image as base64 for vision
      const base64 = Buffer.from(buffer).toString("base64");
      contentBlocks.push({
        type: "image",
        source: { type: "base64", media_type: mime, data: base64 },
      });
    } else if (isPdfType(mime)) {
      // Send PDF as native document — Anthropic parses it directly
      const base64 = Buffer.from(buffer).toString("base64");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (contentBlocks as any[]).push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: base64 },
      });
    } else if (file.name.endsWith(".docx") || mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // Word document — extract plain text via mammoth
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      const text = result.value;
      const truncated = text.length > 15000 ? text.slice(0, 15000) + "\n...[truncated]" : text;
      contentBlocks.push({
        type: "text",
        text: `=== File: ${file.name} ===\n${truncated}`,
      });
    } else {
      // Text / code file — decode and embed inline
      const text = new TextDecoder("utf-8").decode(buffer);
      const truncated = text.length > 15000 ? text.slice(0, 15000) + "\n...[truncated]" : text;
      contentBlocks.push({
        type: "text",
        text: `=== File: ${file.name} ===\n${truncated}`,
      });
    }
  }

  // Instruction block appended last
  const subjectCtx = subject
    ? ` The subject is "${subject}"${topics ? ` — focus specifically on these topics: ${topics}` : " — focus questions on that domain"}.`
    : "";
  let instruction = "";

  if (mode === "quiz") {
    instruction = `Based on the content above (${fileNames.join(", ")}), create exactly ${count} quiz questions.${subjectCtx}

Return ONLY valid JSON, no markdown, no explanation:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["A) option 1", "B) option 2", "C) option 3", "D) option 4"],
      "answer": 0,
      "explanation": "Brief explanation."
    }
  ]
}

Rules:
- Base questions ONLY on the provided content
- Exactly 4 options per question (A, B, C, D)
- "answer" is the 0-based index of the correct option
- Vary difficulty from easy to hard
- Write in English`;
  } else if (mode === "flashcards") {
    instruction = `Based on the content above (${fileNames.join(", ")}), create exactly ${count} flash cards.

Return ONLY valid JSON, no markdown, no explanation:
{
  "flashcards": [
    {
      "front": "Term or question from the material",
      "back": "Definition or answer"
    }
  ]
}

Rules:
- Front: a key term, concept, or question from the actual content
- Back: concise definition, explanation, or answer
- Cover the most important concepts
- Write in English`;
  } else if (mode === "problems") {
    instruction = `Look at the problems, exercises, and tasks in the content above (${fileNames.join(", ")}). Generate exactly ${count} NEW problems that are similar in style, difficulty, and topic to the ones found in the material — but with different numbers, variables, or scenarios.${subjectCtx}

Return ONLY valid JSON, no markdown, no explanation:
{
  "problems": [
    {
      "problem": "Full problem statement with all necessary data",
      "hint": "A helpful hint without giving away the answer",
      "answer": "The exact correct answer",
      "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
    }
  ]
}

Rules:
- Study the existing problems/exercises in the file and generate SIMILAR ones (same type, same difficulty range)
- Do NOT copy problems directly — create new ones inspired by the material
- Each problem must be fully solvable with clear steps
- steps should be 3-6 clear steps showing the full solution
- Vary difficulty slightly across the set
- Write in English`;
  } else {
    instruction = `Based on the content above (${fileNames.join(", ")}), write a clear, well-structured lesson.

Return ONLY valid JSON, no markdown, no explanation:
{
  "lesson": {
    "title": "Lesson title",
    "intro": "1-2 sentence introduction.",
    "sections": [
      { "heading": "Section heading", "content": "Section content." }
    ],
    "summary": "Key takeaways.",
    "keyTerms": [
      { "term": "Term", "definition": "Short definition" }
    ]
  }
}

Rules:
- 4-6 sections covering the main concepts from the content
- Each section 3-5 clear sentences
- Include 5-8 key terms from the material
- Write in English`;
  }

  contentBlocks.push({ type: "text", text: instruction });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: contentBlocks }],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "";

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("No JSON found in response:", rawText.slice(0, 300));
      return NextResponse.json({ error: "AI returned an invalid response" }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("generate-from-file error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { guardAI } from "@/lib/ai-guard";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Thinkio's support assistant. Answer only Thinkio-related questions. Be concise.

Thinkio: AI study platform — quizzes, flashcards, lessons, practice problems from any subject or uploaded file.
File types: PDF, Word (.docx), images (JPG/PNG), plain text. Works on all devices.
Generated content auto-saves to Library.
Subjects: Mathematics, Physics, Chemistry, History, Biology, Literature, Economics, Computer Science.

Flashcards: Basic (Still Learning/Got It). Advanced (Again/Hard/Easy with re-queue) — Plus & Pro only.

Plans:
- Free: 3 uploads/week, 1 subject, basic flashcards, quiz & lesson generation
- Plus $9/mo or $86/yr: 20 uploads/week, all 8 subjects, advanced flashcards, up to 20 questions/gen
- Pro $25/mo or $240/yr: unlimited uploads, all subjects, advanced flashcards, up to 50 questions/gen, export as .txt

Getting started: sign up at thinkio.app, pick a subject or upload notes, choose a study mode, generate content in seconds.

Rules: NEVER share user data, emails, API keys, or internal details. NEVER discuss other users. Decline off-topic requests politely. For billing/account issues or unknowns → vukxzivanovic@gmail.com`;

export async function POST(req: NextRequest) {
  const guard = await guardAI();
  if (guard) return guard;

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Keep last 10 messages to avoid token bloat
    const trimmed = messages.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: String(m.content).slice(0, 300), // cap per message
    }));

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: trimmed,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply: text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

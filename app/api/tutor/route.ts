import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { guardAI } from "@/lib/ai-guard";

export const maxDuration = 60;

const client = new Anthropic();

const SYSTEM = `You are an expert AI tutor for students. Your job is to help students learn and understand academic subjects.

You help with: mathematics, physics, chemistry, biology, history, geography, computer science, English literature, economics, philosophy, and any other academic/school subject.

When helping:
- Explain concepts clearly with examples
- Show step-by-step solutions for math/science problems
- Use LaTeX notation for math when helpful: $inline$ or $$block$$
- Be encouraging, patient, and thorough
- If a student is confused, rephrase and try a different approach
- Point out common mistakes to avoid

If asked about something completely unrelated to education or academics (e.g. entertainment, social media drama, personal dating advice), politely redirect: "I'm here to help with school and academics! Ask me anything school-related."

Never do homework for students without explaining the concept — always teach, don't just give answers.`;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
type ImageMediaType = typeof IMAGE_TYPES[number];

export async function POST(req: NextRequest) {
  const guard = await guardAI();
  if (guard) return guard;

  try {
    const body = await req.json();
    const { messages, subjectName, imageBase64, imageType } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      subjectName?: string;
      imageBase64?: string;
      imageType?: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const system = subjectName
      ? `${SYSTEM}\n\nThe student is currently studying: ${subjectName}. Prioritize questions and examples from this subject.`
      : SYSTEM;

    // Build message list — last user message may include an image
    const trimmed = messages.slice(-20);
    const anthropicMessages: Anthropic.MessageParam[] = trimmed.map((m, idx) => {
      // Attach image to the last user message if provided
      if (idx === trimmed.length - 1 && m.role === "user" && imageBase64 && imageType && IMAGE_TYPES.includes(imageType as ImageMediaType)) {
        return {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: imageType as ImageMediaType, data: imageBase64 },
            },
            { type: "text", text: m.content || "Please help me with this." },
          ],
        };
      }
      return { role: m.role, content: m.content };
    });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system,
      messages: anthropicMessages,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply: text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
type ImageMediaType = (typeof IMAGE_TYPES)[number];

function isImageType(mime: string): mime is ImageMediaType {
  return IMAGE_TYPES.includes(mime as ImageMediaType);
}

export async function POST(req: NextRequest) {
  const { problem, userAnswer, imageBase64, imageType } = await req.json();

  if (!problem) {
    return NextResponse.json({ error: "Missing problem" }, { status: 400 });
  }

  const hasImage = imageBase64 && imageType && isImageType(imageType);
  const hasText = userAnswer && String(userAnswer).trim().length > 0;

  if (!hasImage && !hasText) {
    return NextResponse.json(
      { error: "Please provide an answer (typed or as a photo)" },
      { status: 400 }
    );
  }

  const instruction = `You are an encouraging tutor. Evaluate the student's answer to the following problem.

Problem:
${problem}

${hasText ? `Student's written answer: "${userAnswer}"` : ""}${hasImage ? (hasText ? "\nThe student also uploaded a photo of their handwritten work (see image above)." : "The student submitted a photo of their handwritten work (see image above). Evaluate what is written/drawn in the photo.") : ""}

Return ONLY valid JSON, no markdown fences, in this exact format:
{
  "correct": true,
  "feedback": "Warm, specific feedback. Acknowledge what they did right. If wrong, explain the mistake clearly and constructively.",
  "correctAnswer": "The concise correct answer.",
  "steps": [
    "Step 1: ...",
    "Step 2: ...",
    "Final answer: ..."
  ]
}

Rules:
- correct is true only if their answer is mathematically/factually correct (allow minor notation differences)
- feedback should mention their specific answer — make it personal, not generic
- steps must show the full worked solution regardless of whether they were correct
- 3-6 steps is ideal; be thorough but not verbose
- correctAnswer should be concise (just the final result)`;

  try {
    const content: Anthropic.MessageParam["content"] = hasImage
      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: imageType as ImageMediaType,
              data: imageBase64,
            },
          },
          { type: "text", text: instruction },
        ]
      : instruction;

    const message = await client.messages.create({
      model: hasImage ? "claude-haiku-4-5-20251001" : "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI returned an invalid response" }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to check answer" }, { status: 500 });
  }
}

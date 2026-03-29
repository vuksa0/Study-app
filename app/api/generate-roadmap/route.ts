import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { guardAI } from "@/lib/ai-guard";

export const maxDuration = 60;

const client = new Anthropic();

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
type ImageMediaType = (typeof IMAGE_TYPES)[number];
function isImageType(mime: string): mime is ImageMediaType {
  return IMAGE_TYPES.includes(mime as ImageMediaType);
}

export async function POST(req: NextRequest) {
  const guard = await guardAI();
  if (guard) return guard;

  const formData = await req.formData();
  const subjectId = formData.get("subjectId") as string;
  const subjectName = formData.get("subjectName") as string;
  const examDate = formData.get("examDate") as string;
  const files = formData.getAll("files") as File[];

  if (!subjectId || !subjectName || !examDate) {
    return NextResponse.json(
      { error: "Missing required fields: subjectId, subjectName, examDate" },
      { status: 400 }
    );
  }

  const examDateTime = new Date(examDate);
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilExam = Math.max(
    1,
    Math.ceil((examDateTime.getTime() - now.getTime()) / msPerDay)
  );
  const planDays = Math.min(daysUntilExam, 14);

  // Build content blocks from uploaded files
  const contentBlocks: Anthropic.MessageParam["content"] = [];

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const mime = file.type || "application/octet-stream";

    if (isImageType(mime)) {
      const base64 = Buffer.from(buffer).toString("base64");
      contentBlocks.push({ type: "image", source: { type: "base64", media_type: mime, data: base64 } });
    } else if (mime === "application/pdf") {
      const base64 = Buffer.from(buffer).toString("base64");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (contentBlocks as any[]).push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } });
    } else if (file.name.endsWith(".docx") || mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      const text = result.value.slice(0, 15000);
      contentBlocks.push({ type: "text", text: `=== Notes: ${file.name} ===\n${text}` });
    } else {
      const text = new TextDecoder("utf-8").decode(buffer).slice(0, 15000);
      contentBlocks.push({ type: "text", text: `=== Notes: ${file.name} ===\n${text}` });
    }
  }

  const hasFiles = contentBlocks.length > 0;

  const prompt = `You are a study coach.${hasFiles ? " The student has uploaded their notes/materials above — use them to identify weak spots, specific topics they're studying, and tailor the roadmap to their actual content." : ""}

Create a detailed ${planDays}-day exam prep roadmap for a student studying ${subjectName}.
Exam date: ${examDate} (${daysUntilExam} days from today)

Generate a JSON roadmap with exactly ${planDays} days in dailyPlan. Return ONLY valid JSON, no markdown fences:

{
  "roadmap": {
    "subject": "${subjectName}",
    "daysUntilExam": ${daysUntilExam},
    "overview": "A 2-sentence overview of the study plan strategy${hasFiles ? ", referencing the specific content from the uploaded notes" : ""}",
    "dailyPlan": [
      {
        "day": 1,
        "dayLabel": "Day 1",
        "focus": "Specific topic focus for this day${hasFiles ? " (based on the uploaded material)" : ""}",
        "activities": [
          { "type": "lesson", "title": "Specific lesson title", "duration": "20 min" },
          { "type": "quiz", "title": "Specific quiz title", "duration": "15 min" },
          { "type": "flashcards", "title": "Specific flashcard deck title", "duration": "10 min" }
        ],
        "totalTime": "45 min"
      }
    ],
    "keyAreas": ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5"],
    "tip": "A personalized, actionable study tip${hasFiles ? " based on the uploaded notes" : " for this specific subject and exam timeline"}"
  }
}

Rules:
- Each day should have 2-3 activities with realistic durations
- Progress logically through the subject matter over the days
- The last 1-2 days should focus on review and practice tests
- keyAreas should be the most important topics to master for this exam${hasFiles ? " — extract them from the uploaded notes" : ""}
- Make titles specific and actionable, not generic
- totalTime should be the sum of all activity durations for that day`;

  contentBlocks.push({ type: "text", text: prompt });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: contentBlocks }],
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
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { subjectId, subjectName, examDate, focusAreas } = await req.json();

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

  const prompt = `You are a study coach. Create a detailed ${planDays}-day exam prep roadmap for a student studying ${subjectName}.

Exam date: ${examDate} (${daysUntilExam} days from today)
${focusAreas ? `Student's focus areas / weak spots: ${focusAreas}` : ""}

Generate a JSON roadmap with exactly ${planDays} days in dailyPlan. Return ONLY valid JSON, no markdown fences:

{
  "roadmap": {
    "subject": "${subjectName}",
    "daysUntilExam": ${daysUntilExam},
    "overview": "A 2-sentence overview of the study plan strategy",
    "dailyPlan": [
      {
        "day": 1,
        "dayLabel": "Day 1",
        "focus": "Topic focus for this day",
        "activities": [
          { "type": "lesson", "title": "Specific lesson title", "duration": "20 min" },
          { "type": "quiz", "title": "Specific quiz title", "duration": "15 min" },
          { "type": "flashcards", "title": "Specific flashcard deck title", "duration": "10 min" }
        ],
        "totalTime": "45 min"
      }
    ],
    "keyAreas": ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5"],
    "tip": "A personalized, actionable study tip for this specific subject and exam timeline"
  }
}

Rules:
- Each day should have 2-3 activities with realistic durations
- Progress logically through the subject matter over the days
- The last 1-2 days should focus on review and practice tests
- keyAreas should be the most important topics to master for this exam
- Make titles specific and actionable, not generic
- totalTime should be the sum of all activity durations for that day`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "";
    const cleaned = raw
      .replace(/^```(?:json)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI returned an invalid response" },
        { status: 500 }
      );
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}

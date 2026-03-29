import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";
import { getSubject, getTopic } from "@/lib/subjects";
import { urgencyPrompt } from "@/lib/test-date";
import type { TestDate } from "@/lib/test-date";
import { guardAI } from "@/lib/ai-guard";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const guard = await guardAI();
  if (guard) return guard;

  const { subjectId, topicId, count = 5, subjectName, topicName, topicDescription, testDate, language = "English" } = await req.json();
  const urgency = urgencyPrompt(testDate as TestDate | null);

  let resolvedSubjectName: string;
  let resolvedTopicName: string | null = null;
  let resolvedTopicDesc: string | null = null;

  const builtin = getSubject(subjectId);
  if (builtin) {
    resolvedSubjectName = builtin.name;
    if (topicId) {
      const t = getTopic(subjectId, topicId);
      resolvedTopicName = t?.name ?? null;
      resolvedTopicDesc = t?.description ?? null;
    }
  } else if (subjectName) {
    resolvedSubjectName = subjectName;
    resolvedTopicName = topicName ?? null;
    resolvedTopicDesc = topicDescription ?? null;
  } else {
    return NextResponse.json({ error: "Subject not found" }, { status: 400 });
  }

  const topicPart = resolvedTopicName
    ? `, topic: "${resolvedTopicName}"${resolvedTopicDesc ? ` (${resolvedTopicDesc})` : ""}`
    : "";

  const isMath = resolvedSubjectName.toLowerCase().includes("math");

  const mathExtraRules = isMath ? `
- Keep questions accessible: use specific numbers, not abstract symbols alone
- Avoid overly complex multi-step problems; test one concept at a time
- Wrong answer options (distractors) should be common mistakes, not random numbers
- Explanations must be step-by-step, showing the full working (e.g. "Step 1: ..., Step 2: ..., Answer: ...")
- For geometry or trig, state the relevant formula before applying it
- Use plain language to describe what the question is asking before showing any formula` : "";

  const prompt = `Create ${count} quiz questions for the subject "${resolvedSubjectName}"${topicPart}.

Return ONLY valid JSON without any explanation, in this format:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["A) option 1", "B) option 2", "C) option 3", "D) option 4"],
      "answer": 0,
      "explanation": "Brief explanation of why this is correct."
    }
  ]
}

Rules:
- Questions must be clear and precise
- Each question has exactly 4 options (A, B, C, D)
- "answer" is the index of the correct option (0-3)
- Questions should vary in difficulty
- Write in ${language}${mathExtraRules}${urgency ? `\n\n${urgency}` : ""}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI returned an invalid response" }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}

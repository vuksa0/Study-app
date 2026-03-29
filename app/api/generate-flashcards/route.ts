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

  const { subjectId, topicId, count = 10, subjectName, topicName, topicDescription, testDate, language = "English" } = await req.json();
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

  const prompt = `Create ${count} flash cards for the subject "${resolvedSubjectName}"${topicPart}.

Return ONLY valid JSON without any explanation, in this format:
{
  "flashcards": [
    {
      "front": "Term or question on the front of the card",
      "back": "Definition or answer on the back of the card"
    }
  ]
}

Rules:
- Front side: a term, concept, or question
- Back side: the definition, explanation, or answer
- Keep each side concise and clear
- Cover the most important concepts from the topic
- Write in ${language}${urgency ? `\n\n${urgency}` : ""}`;

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
    return NextResponse.json({ error: "Failed to generate flash cards" }, { status: 500 });
  }
}

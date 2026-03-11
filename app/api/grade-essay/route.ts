import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { text, prompt: essayPrompt } = await req.json();

  if (!text || String(text).trim().length < 20) {
    return NextResponse.json(
      { error: "Please provide a text to grade (at least 20 characters)" },
      { status: 400 }
    );
  }

  const promptContext = essayPrompt
    ? `The student was given this task/prompt: "${essayPrompt}"\n\n`
    : "";

  const instruction = `You are an expert English teacher and examiner. Grade the following student text thoroughly and constructively.

${promptContext}Student text:
"""
${text}
"""

Return ONLY valid JSON, no markdown fences, in this exact format:
{
  "grade": "B+",
  "score": 78,
  "summary": "2-3 sentence overall assessment of the writing.",
  "categories": {
    "grammar": { "score": 75, "comment": "Specific observation about grammar." },
    "vocabulary": { "score": 80, "comment": "Specific observation about word choice." },
    "structure": { "score": 82, "comment": "Specific observation about organisation and flow." },
    "clarity": { "score": 78, "comment": "Specific observation about how clearly ideas are expressed." },
    "argumentation": { "score": 70, "comment": "Specific observation about how well ideas are developed and supported." }
  },
  "strengths": [
    "Specific strength 1",
    "Specific strength 2",
    "Specific strength 3"
  ],
  "improvements": [
    "Specific, actionable improvement 1",
    "Specific, actionable improvement 2",
    "Specific, actionable improvement 3"
  ],
  "corrections": [
    { "original": "exact phrase from text", "corrected": "improved version", "explanation": "why this is better" }
  ]
}

Rules:
- score is 0-100; grade maps to score: A+ ≥93, A ≥90, A- ≥87, B+ ≥83, B ≥80, B- ≥77, C+ ≥73, C ≥70, C- ≥67, D ≥60, F <60
- category scores should be consistent with the overall score
- corrections: include up to 5 of the most important errors with exact quotes from the text
- comments and feedback must be specific to THIS text, not generic
- be constructive and encouraging even when pointing out weaknesses`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: instruction }],
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
    return NextResponse.json({ error: "Failed to grade text" }, { status: 500 });
  }
}

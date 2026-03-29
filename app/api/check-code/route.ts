import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";
import { guardAI } from "@/lib/ai-guard";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const guard = await guardAI();
  if (guard) return guard;

  const { problem, code, language } = await req.json();

  if (!problem || !code || !String(code).trim()) {
    return NextResponse.json({ error: "Missing problem or code" }, { status: 400 });
  }

  const prompt = `You are an expert ${language} programmer and computer science teacher. Evaluate the student's code solution.

Problem:
${problem}

Student's ${language} code:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Return ONLY valid JSON, no markdown fences, in this exact format:
{
  "correct": true,
  "feedback": "Warm, specific overall assessment. Mention what they did well and what needs work.",
  "issues": [
    "Issue 1: specific bug or logical error with explanation",
    "Issue 2: ..."
  ],
  "improvements": [
    "Improvement 1: style, efficiency, or edge case to consider",
    "Improvement 2: ..."
  ],
  "timeComplexity": "O(n) — brief explanation of why",
  "spaceComplexity": "O(1) — brief explanation of why",
  "solution": "Complete, well-commented working solution in ${language}."
}

Rules:
- correct is true if the logic is correct and handles all stated cases (minor style issues don't make it wrong)
- issues: list actual bugs or logic errors only; use empty array [] if there are none
- improvements: suggest even for correct solutions (edge cases, readability, efficiency)
- timeComplexity and spaceComplexity refer to the student's submitted code (or the optimal if student code is empty/trivial)
- solution must be a complete, runnable ${language} program/function with inline comments
- be encouraging — celebrate correct thinking even if the final code has bugs`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
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
    return NextResponse.json({ error: "Failed to evaluate code" }, { status: 500 });
  }
}

import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";
import { getSubject, getTopic } from "@/lib/subjects";
import { urgencyPrompt } from "@/lib/test-date";
import type { TestDate } from "@/lib/test-date";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { subjectId, topicId, subjectName, topicName, topicDescription, difficulty = "medium", testDate, language = "English" } = await req.json();
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
    ? ` on the topic "${resolvedTopicName}"${resolvedTopicDesc ? ` (${resolvedTopicDesc})` : ""}`
    : "";

  const isMath = resolvedSubjectName.toLowerCase().includes("math");
  const isScience = ["physics", "chemistry", "biology"].some((s) =>
    resolvedSubjectName.toLowerCase().includes(s)
  );

  const domainNotes = isMath
    ? "Use specific numbers. The problem should involve a clear calculation or reasoning step."
    : isScience
    ? "The problem can involve calculations, definitions, processes, or explain-the-concept questions appropriate to the subject."
    : "Create a thoughtful problem appropriate to the subject.";

  const difficultyNote =
    difficulty === "easy"
      ? "Make it straightforward — test one basic concept, suitable for a beginner."
      : difficulty === "hard"
      ? "Make it challenging — multi-step reasoning, requires solid understanding."
      : "Moderate difficulty — one or two steps, tests solid understanding of the concept.";

  const prompt = `Generate exactly one ${difficulty} problem for ${resolvedSubjectName}${topicPart}.

${domainNotes}
${difficultyNote}

Return ONLY valid JSON, no markdown fences, in this exact format:
{
  "problem": "Full problem statement. Wrap ALL math in LaTeX delimiters: $inline$ or $$block$$. Use \\frac{a}{b} for fractions, x^{2} for exponents, \\sqrt{x} for roots, \\cdot for multiply. Example: Find the value of $\\frac{3}{4} + \\frac{1}{2}$.",
  "hint": "A helpful nudge. Wrap math in $...$.",
  "answer": "Concise correct answer. Wrap math in $...$.",
  "steps": [
    "Step 1: State what we know. Wrap math in $...$.",
    "Step 2: ...",
    "Final answer: ..."
  ]
}

Rules:
- steps must show the complete worked solution from beginning to end (3-6 steps)
- problem must be self-contained — include all values, units, and context needed
- ALWAYS use \\frac{}{} for fractions — NEVER write 1/5 as plain text
- ALWAYS use x^{n} for exponents — NEVER write x**2 or x^2 without braces
- answer should be the final result only, concise${urgency ? `\n\n${urgency}` : ""}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
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
    return NextResponse.json({ error: "Failed to generate problem" }, { status: 500 });
  }
}

import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";
import { getSubject, getTopic } from "@/lib/subjects";

const client = new Anthropic();

const LANGUAGES = ["Python", "JavaScript", "C++", "Java"] as const;

export async function POST(req: NextRequest) {
  const { subjectId, topicId, language = "Python", difficulty = "medium" } = await req.json();

  const lang = LANGUAGES.includes(language) ? language : "Python";

  let resolvedTopicName: string | null = null;
  let resolvedTopicDesc: string | null = null;

  const builtin = getSubject(subjectId);
  if (builtin && topicId) {
    const t = getTopic(subjectId, topicId);
    resolvedTopicName = t?.name ?? null;
    resolvedTopicDesc = t?.description ?? null;
  }

  const topicPart = resolvedTopicName
    ? ` related to "${resolvedTopicName}"${resolvedTopicDesc ? ` (${resolvedTopicDesc})` : ""}`
    : "";

  const difficultyNote =
    difficulty === "easy"
      ? "Easy: simple loops, basic conditionals, or string manipulation. Suitable for a beginner."
      : difficulty === "hard"
      ? "Hard: requires solid algorithm knowledge (sorting, recursion, dynamic programming, graphs, etc.)."
      : "Medium: requires understanding of data structures or multiple logical steps.";

  const starterMap: Record<string, string> = {
    Python: "def solution():\n    # your code here\n    pass",
    JavaScript: "function solution() {\n    // your code here\n}",
    "C++": "#include <iostream>\nusing namespace std;\n\nint solution() {\n    // your code here\n    return 0;\n}",
    Java: "public class Solution {\n    public static void solution() {\n        // your code here\n    }\n}",
  };

  const prompt = `Generate one ${difficulty} programming problem${topicPart} to be solved in ${lang}.

${difficultyNote}

Return ONLY valid JSON, no markdown fences, in this exact format:
{
  "title": "Short descriptive title (5-8 words)",
  "difficulty": "${difficulty}",
  "description": "Clear problem statement. Explain exactly what the function/program should do, what input it receives, and what it must return/output.",
  "examples": [
    { "input": "example input value(s)", "output": "expected output", "explanation": "Why this is the output." },
    { "input": "another input", "output": "expected output", "explanation": "Why this is the output." }
  ],
  "constraints": [
    "Constraint about input size or type",
    "Another constraint"
  ],
  "hints": [
    "High-level hint about the approach",
    "More specific hint if needed"
  ],
  "starterCode": "${starterMap[lang].replace(/\n/g, "\\n").replace(/"/g, '\\"')}",
  "solution": "Complete, well-commented ${lang} solution that correctly solves the problem."
}

Rules:
- description must be unambiguous — a student should know exactly what to write
- 2-3 examples covering normal cases and edge cases
- starterCode must have the correct function signature for the problem
- solution must be complete working ${lang} code with inline comments explaining the key logic
- constraints should be realistic (e.g. input is always a positive integer, list length 1-100)`;

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
    return NextResponse.json({ error: "Failed to generate coding problem" }, { status: 500 });
  }
}

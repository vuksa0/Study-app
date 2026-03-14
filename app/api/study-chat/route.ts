import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

const client = new Anthropic();

export async function POST(req: NextRequest) {

  try {
    const { messages, subjectName } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const system = subjectName
      ? `You are Thinkio, a friendly study buddy specializing in ${subjectName}. Help students understand concepts, explain problems step by step, and answer any questions. Also help with questions about the Thinkio app itself (quizzes, flashcards, lessons). Be warm, concise, and encouraging.`
      : `You are Thinkio, a friendly study buddy and customer support assistant for the Thinkio app. Help students with any subject, explain concepts, and answer questions about using Thinkio (generating quizzes, flashcards, lessons from notes, uploading files). Be warm, concise, and encouraging.`;

    const trimmed = messages.slice(-20).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: String(m.content).slice(0, 2000),
    }));

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system,
      messages: trimmed,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply: text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

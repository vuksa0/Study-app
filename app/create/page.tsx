"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveCustomSubject, slugify, COLOR_OPTIONS } from "@/lib/custom-subjects";
import type { Topic } from "@/lib/subjects";

const EMOJI_OPTIONS = ["📚", "🎓", "🔬", "🎨", "🎵", "🏛️", "⚽", "🍎", "🌿", "🧠", "🔭", "🗺️", "✏️", "🎭", "💡", "🏺", "🌐", "🧩"];

export default function CreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📚");
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [topics, setTopics] = useState<Topic[]>([{ id: "", name: "", description: "" }]);
  const [error, setError] = useState("");

  function updateTopic(idx: number, field: keyof Topic, value: string) {
    setTopics((prev) => prev.map((t, i) =>
      i === idx ? { ...t, [field]: value, id: field === "name" ? slugify(value) : t.id } : t
    ));
  }
  function addTopic() { setTopics((p) => [...p, { id: "", name: "", description: "" }]); }
  function removeTopic(idx: number) { setTopics((p) => p.filter((_, i) => i !== idx)); }

  function handleSave() {
    if (!name.trim()) { setError("Please enter a subject name."); return; }
    const validTopics = topics.filter((t) => t.name.trim());
    if (!validTopics.length) { setError("Add at least one topic."); return; }
    const subject = {
      id: slugify(name) || `custom-${Date.now()}`,
      name: name.trim(), emoji, color,
      topics: validTopics.map((t) => ({
        id: t.id || slugify(t.name) || `topic-${Date.now()}`,
        name: t.name.trim(),
        description: t.description.trim(),
      })),
    };
    saveCustomSubject(subject);
    router.push(`/${subject.id}`);
  }

  const validCount = topics.filter((t) => t.name).length;

  return (
    <main className="relative min-h-screen">
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-30" />
      <div className="orb w-[400px] h-[400px] top-0 left-1/2 -translate-x-1/2 opacity-40"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)" }} />

      <div className="relative max-w-2xl mx-auto px-5 py-14">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          All Subjects
        </Link>

        <h1 className="text-2xl font-bold text-white/90 mb-1">New Subject</h1>
        <p className="text-sm mb-10" style={{ color: "rgba(255,255,255,0.35)" }}>
          Add your own subject and topics — AI will generate quizzes, flash cards & lessons from them
        </p>

        <div className="space-y-8">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
              Subject Name
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Music Theory" className="input" />
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button key={e} onClick={() => setEmoji(e)}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                  style={{
                    border: "1px solid",
                    borderColor: emoji === e ? "rgba(139,92,246,0.5)" : "var(--border)",
                    background: emoji === e ? "rgba(139,92,246,0.12)" : "var(--surface-2)",
                  }}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button key={c.value} onClick={() => setColor(c.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r ${c.value} transition-all`}
                  style={{ opacity: color === c.value ? 1 : 0.45, outline: color === c.value ? "2px solid rgba(255,255,255,0.2)" : "none", outlineOffset: 2 }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
              Card Preview
            </label>
            <div className="card-glow rounded-2xl p-5 w-44" style={{ background: "var(--surface)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                {emoji}
              </div>
              <p className="font-semibold text-sm text-white/80">{name || "Subject Name"}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{validCount} topics</p>
            </div>
          </div>

          {/* Topics */}
          <div>
            <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
              Topics
            </label>
            <div className="space-y-2.5">
              {topics.map((topic, idx) => (
                <div key={idx} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={topic.name} onChange={(e) => updateTopic(idx, "name", e.target.value)}
                      placeholder="Topic name" className="input" style={{ padding: "8px 12px", fontSize: 13 }} />
                    {topics.length > 1 && (
                      <button onClick={() => removeTopic(idx)}
                        className="px-3 rounded-lg text-sm transition-colors shrink-0"
                        style={{ border: "1px solid var(--border)", color: "rgba(255,255,255,0.25)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"; }}>
                        ✕
                      </button>
                    )}
                  </div>
                  <input type="text" value={topic.description} onChange={(e) => updateTopic(idx, "description", e.target.value)}
                    placeholder="Short description (optional)" className="input" style={{ padding: "8px 12px", fontSize: 12 }} />
                </div>
              ))}
            </div>
            <button onClick={addTopic} className="mt-3 text-sm flex items-center gap-1.5 transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#c4b5fd"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
              + Add Topic
            </button>
          </div>

          {error && <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>}

          <button onClick={handleSave} className="btn-primary w-full">
            Save Subject
          </button>
        </div>
      </div>
    </main>
  );
}

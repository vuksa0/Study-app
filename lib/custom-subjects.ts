import type { Subject } from "./subjects";

const STORAGE_KEY = "learnai-custom-subjects";

export function getCustomSubjects(): Subject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomSubject(subject: Subject): void {
  const existing = getCustomSubjects();
  const idx = existing.findIndex((s) => s.id === subject.id);
  if (idx >= 0) {
    existing[idx] = subject;
  } else {
    existing.push(subject);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function deleteCustomSubject(id: string): void {
  const existing = getCustomSubjects().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const COLOR_OPTIONS = [
  { label: "Blue", value: "from-blue-600 to-blue-400" },
  { label: "Purple", value: "from-purple-600 to-purple-400" },
  { label: "Green", value: "from-green-600 to-green-400" },
  { label: "Orange", value: "from-orange-600 to-orange-400" },
  { label: "Pink", value: "from-pink-600 to-pink-400" },
  { label: "Red", value: "from-red-600 to-red-400" },
  { label: "Cyan", value: "from-cyan-600 to-cyan-400" },
  { label: "Yellow", value: "from-yellow-600 to-yellow-400" },
];

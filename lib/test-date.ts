export type TestDate = "today" | "tomorrow" | "this_week" | "next_week" | "later";

export const TEST_DATE_OPTIONS: { value: TestDate; label: string; emoji: string }[] = [
  { value: "today",     label: "Today",     emoji: "🚨" },
  { value: "tomorrow",  label: "Tomorrow",  emoji: "⚡" },
  { value: "this_week", label: "This week", emoji: "📅" },
  { value: "next_week", label: "Next week", emoji: "🗓️" },
  { value: "later",     label: "Not soon",  emoji: "😌" },
];

export function getTestDate(subjectId: string): TestDate | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(`testDate_${subjectId}`) as TestDate) ?? null;
}

export function setTestDate(subjectId: string, value: TestDate) {
  localStorage.setItem(`testDate_${subjectId}`, value);
}

export function urgencyPrompt(testDate: TestDate | null): string {
  switch (testDate) {
    case "today":
      return "CRITICAL: The student's test is TODAY. Focus only on the most important, high-yield concepts. Be concise and exam-focused. Prioritize what is most likely to appear on the test.";
    case "tomorrow":
      return "IMPORTANT: The student's test is TOMORROW. Prioritize key concepts and the most common exam questions. Keep explanations clear and direct.";
    case "this_week":
      return "NOTE: The student's test is this week. Balance depth with broad coverage of the topic.";
    case "next_week":
      return "NOTE: The student's test is next week. Provide thorough, well-rounded coverage.";
    default:
      return "";
  }
}

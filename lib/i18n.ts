export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English",    flag: "🇬🇧" },
  { code: "nb", name: "Norsk",      flag: "🇳🇴" },
  { code: "sr", name: "Srpski",     flag: "🇷🇸" },
  { code: "hr", name: "Hrvatski",   flag: "🇭🇷" },
  { code: "de", name: "Deutsch",    flag: "🇩🇪" },
  { code: "fr", name: "Français",   flag: "🇫🇷" },
  { code: "es", name: "Español",    flag: "🇪🇸" },
  { code: "it", name: "Italiano",   flag: "🇮🇹" },
  { code: "pt", name: "Português",  flag: "🇧🇷" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polski",     flag: "🇵🇱" },
  { code: "sv", name: "Svenska",    flag: "🇸🇪" },
  { code: "da", name: "Dansk",      flag: "🇩🇰" },
  { code: "fi", name: "Suomi",      flag: "🇫🇮" },
  { code: "tr", name: "Türkçe",     flag: "🇹🇷" },
  { code: "ru", name: "Русский",    flag: "🇷🇺" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "ar", name: "العربية",    flag: "🇸🇦" },
  { code: "zh", name: "中文",        flag: "🇨🇳" },
  { code: "ja", name: "日本語",      flag: "🇯🇵" },
  { code: "ko", name: "한국어",      flag: "🇰🇷" },
  { code: "hi", name: "हिंदी",       flag: "🇮🇳" },
] as const;

export type LangCode = typeof SUPPORTED_LANGUAGES[number]["code"];

// Norwegian locale → NOK, everything else → USD
export const NORWEGIAN_LOCALES = ["nb", "nn", "no"];

export function isNorwegian(lang: string) {
  return NORWEGIAN_LOCALES.includes(lang.split("-")[0]);
}

export function detectBrowserLanguage(): LangCode {
  if (typeof navigator === "undefined") return "en";
  const nav = navigator.language || "en";
  const base = nav.split("-")[0].toLowerCase();
  const match = SUPPORTED_LANGUAGES.find((l) => l.code === base);
  return (match?.code ?? "en") as LangCode;
}

export function getLanguageName(code: LangCode): string {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name ?? "English";
}

export function getLanguageFlag(code: LangCode): string {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.flag ?? "🇬🇧";
}

/** Full language name for AI prompts */
export const LANG_NAMES: Record<LangCode, string> = {
  en: "English",
  nb: "Norwegian Bokmål",
  sr: "Serbian",
  hr: "Croatian",
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  pl: "Polish",
  sv: "Swedish",
  da: "Danish",
  fi: "Finnish",
  tr: "Turkish",
  ru: "Russian",
  uk: "Ukrainian",
  ar: "Arabic",
  zh: "Simplified Chinese",
  ja: "Japanese",
  ko: "Korean",
  hi: "Hindi",
};

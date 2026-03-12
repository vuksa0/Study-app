"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { detectBrowserLanguage, isNorwegian, type LangCode } from "@/lib/i18n";

interface LocaleCtx {
  language: LangCode;
  setLanguage: (l: LangCode) => void;
  currency: "USD" | "NOK";
  formatPrice: (usd: number, nok: number) => string;
}

const Ctx = createContext<LocaleCtx>({
  language: "en",
  setLanguage: () => {},
  currency: "USD",
  formatPrice: (usd) => `$${usd}`,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("thinkio_lang") as LangCode | null;
    setLanguageState(saved ?? detectBrowserLanguage());
  }, []);

  function setLanguage(l: LangCode) {
    setLanguageState(l);
    localStorage.setItem("thinkio_lang", l);
  }

  const currency: "USD" | "NOK" = isNorwegian(language) ? "NOK" : "USD";

  function formatPrice(usd: number, nok: number) {
    if (currency === "NOK") return `${nok} kr`;
    return `$${usd}`;
  }

  return <Ctx.Provider value={{ language, setLanguage, currency, formatPrice }}>{children}</Ctx.Provider>;
}

export function useLocale() {
  return useContext(Ctx);
}

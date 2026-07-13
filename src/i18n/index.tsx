"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang, L10n } from "./types";

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("imsuya-lang");
      if (saved === "ms" || saved === "en") {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem("imsuya-lang", l);
    } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);

/** Returns a picker: t({ en, ms }) → the active language's string. */
export function useT() {
  const { lang } = useLang();
  return (l: L10n) => l[lang];
}

export type { Lang, L10n };

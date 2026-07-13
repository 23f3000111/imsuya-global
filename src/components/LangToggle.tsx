"use client";

import { useLang, type Lang } from "@/i18n";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ms", label: "BM" },
];

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={`flex items-center gap-1 font-mono text-[11px] tracking-[0.2em] ${className}`}
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((o, i) => (
        <span key={o.value} className="flex items-center gap-1">
          {i > 0 && <span className="text-soft">/</span>}
          <button
            onClick={() => setLang(o.value)}
            aria-pressed={lang === o.value}
            className={`px-1 py-0.5 transition-colors duration-300 ${
              lang === o.value ? "text-coral" : "text-soft hover:text-paper"
            }`}
          >
            {o.label}
          </button>
        </span>
      ))}
    </div>
  );
}

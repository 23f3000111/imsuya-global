"use client";

import { useState } from "react";
import { faqs } from "@/data/faqs";
import { useT } from "@/i18n";

/**
 * Accordion of the standing questions. `limit` trims the list for the footer,
 * where only the top few earn the space.
 */
export function FaqList({ limit, tone = "light" }: { limit?: number; tone?: "light" | "dark" }) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);
  const items = limit ? faqs.slice(0, limit) : faqs;

  const rule = tone === "dark" ? "border-white/15" : "border-paper/[0.1]";
  const question = tone === "dark" ? "text-white" : "text-paper";
  const answer = tone === "dark" ? "text-white/70" : "text-muted";

  return (
    <div className="flex flex-col">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q.en} className={`border-b ${rule}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-4 text-left"
            >
              <span className={`text-sm font-bold leading-snug ${question}`}>{t(f.q)}</span>
              <span
                aria-hidden
                className={`shrink-0 text-lg leading-none text-coral transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            {/* Grid trick: animates to the answer's natural height, no JS measuring. */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className={`pb-5 pr-10 text-[13px] leading-relaxed ${answer}`}>{t(f.a)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useRef, type MouseEvent } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { PixelGlyph } from "@/components/ui/PixelGlyph";
import { useLang } from "@/i18n";
import type { L10n } from "@/i18n/types";

const REASONS: { title: L10n; body: L10n; glyph: "a" | "b" | "c" | "d" }[] = [
  {
    title: { en: "Proven Industry Experience", ms: "Pengalaman Industri Terbukti" },
    body: {
      en: "Barbershops to logistics fleets, cafés to oil brands. We have shipped across industries and markets.",
      ms: "Dari kedai gunting hingga armada logistik, kafe hingga jenama minyak. Kami telah menyiapkan projek merentas industri dan pasaran.",
    },
    glyph: "a",
  },
  {
    title: { en: "End-to-End Development Team", ms: "Pasukan Pembangunan Hujung ke Hujung" },
    body: {
      en: "Strategy, design, engineering and growth under one roof. No handoffs, no lost context.",
      ms: "Strategi, reka bentuk, kejuruteraan dan pertumbuhan di bawah satu bumbung. Tiada serahan tugas, tiada konteks hilang.",
    },
    glyph: "b",
  },
  {
    title: { en: "Business-Focused Solutions", ms: "Penyelesaian Fokus Perniagaan" },
    body: {
      en: "We measure work by revenue, bookings and leads, not by how it looks in a case study.",
      ms: "Kami mengukur kerja dengan hasil, tempahan dan lead, bukan rupa dalam kajian kes.",
    },
    glyph: "c",
  },
  {
    title: { en: "Transparent Communication", ms: "Komunikasi Telus" },
    body: {
      en: "Clear scopes, honest timelines and progress you can see. You always know where things stand.",
      ms: "Skop jelas, garis masa jujur dan progres yang boleh dilihat. Anda sentiasa tahu kedudukan projek.",
    },
    glyph: "d",
  },
  {
    title: { en: "Fast Turnaround & Scalability", ms: "Pantas & Boleh Berskala" },
    body: {
      en: "Lean process, senior hands. We ship fast, and what we ship is built to grow with you.",
      ms: "Proses ringkas, tangan berpengalaman. Kami siapkan cepat, dan apa yang kami bina sedia berkembang bersama anda.",
    },
    glyph: "a",
  },
  {
    title: { en: "Long-Term Partnership", ms: "Perkongsian Jangka Panjang" },
    body: {
      en: "Launch is the start, not the end. We stay on for iterations, support and what's next.",
      ms: "Pelancaran adalah permulaan, bukan penghujung. Kami kekal untuk penambahbaikan, sokongan dan langkah seterusnya.",
    },
    glyph: "b",
  },
];

const COPY = {
  en: {
    eyebrow: "Why Imsuya / 004",
    lines: ["The reasons our", "partners trust us."],
    sub: "Six reasons companies stop hiring vendors and start working with us.",
  },
  ms: {
    eyebrow: "Kenapa Imsuya / 004",
    lines: ["Sebab rakan kami", "mempercayai kami."],
    sub: "Enam sebab syarikat berhenti mengupah vendor dan mula bekerjasama dengan kami.",
  },
};

export function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const copy = COPY[lang];

  // Coral glow follows the pointer inside each card.
  const onCardMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  };

  return (
    <section ref={ref} className="relative bg-void py-32 lg:py-44">
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
        <Eyebrow variant="d" className="mb-4">
          {copy.eyebrow}
        </Eyebrow>
        <div className="mb-20 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <RevealLines
            key={lang}
            lines={copy.lines}
            className="text-display text-4xl uppercase lg:text-6xl"
          />
          <p className="max-w-sm text-base leading-relaxed text-muted">{copy.sub}</p>
        </div>

        <Reveal stagger={0.09} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <div
              key={r.title.en}
              onMouseMove={onCardMove}
              className="card group relative overflow-hidden border border-paper/[0.08] bg-gradient-to-b from-navy-deep/60 to-transparent p-8 transition-colors duration-500 hover:border-coral/40 lg:p-10"
            >
              {/* pointer-tracked glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(220px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,78,69,0.1), transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <div className="mb-10 flex items-center justify-between">
                  <PixelGlyph
                    variant={r.glyph}
                    className="scale-150 opacity-80 transition-transform duration-500 group-hover:rotate-90"
                  />
                  <span className="font-mono text-xs text-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight lg:text-2xl">
                  {r.title[lang]}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{r.body[lang]}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
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
    title: { en: "End to End Development Team", ms: "Pasukan Pembangunan Lengkap" },
    body: {
      en: "Strategy, design, engineering and growth under one roof. No handoffs, no lost context.",
      ms: "Strategi, reka bentuk, kejuruteraan dan pertumbuhan di bawah satu bumbung. Tiada serahan tugas, tiada konteks hilang.",
    },
    glyph: "b",
  },
  {
    title: { en: "Business Focused Solutions", ms: "Penyelesaian Fokus Perniagaan" },
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
    title: { en: "Long Term Partnership", ms: "Perkongsian Jangka Panjang" },
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

  return (
    <section ref={ref} className="relative bg-void pb-20 pt-12 lg:pb-24 lg:pt-16">
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
        <Eyebrow variant="d" className="mb-4">
          {copy.eyebrow}
        </Eyebrow>
        <div className="mb-10 flex flex-col justify-between gap-6 lg:mb-12 lg:flex-row lg:items-end">
          <RevealLines
            key={lang}
            lines={copy.lines}
            className="text-display text-3xl uppercase lg:text-5xl"
          />
          <p className="max-w-sm text-sm leading-relaxed text-muted">{copy.sub}</p>
        </div>

        {/* Compact enough that all six read as one board rather than a scroll. */}
        <Reveal stagger={0.07} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <div
              key={r.title.en}
              className="reason-card group border border-paper/[0.08] p-6 lg:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <PixelGlyph
                  variant={r.glyph}
                  className="opacity-80 transition-transform duration-500 group-hover:rotate-90"
                />
                <span className="font-mono text-[11px] text-soft transition-colors duration-500 group-hover:text-white/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-base font-black uppercase leading-tight tracking-tight text-coral transition-colors duration-500 lg:text-lg">
                {r.title[lang]}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-navy transition-colors duration-500 group-hover:text-white/85">
                {r.body[lang]}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

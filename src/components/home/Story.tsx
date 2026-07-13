"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COPY = {
  en: {
    eyebrow: "The Agency — 001",
    statement:
      "We don't just build websites. We build systems, brands, software and growth engines — the digital infrastructure behind ambitious businesses.",
    accent: new Set(["systems,", "brands,", "software", "growth"]),
    body: "Imsuya Global is a full-service digital and AI agency. One team covering strategy, design, engineering and growth — so nothing is lost between agencies, freelancers and handoffs.",
    photoAlt: "Imsuya Global — design work in progress at the studio",
    stats: [
      { value: "15+", label: "Projects shipped" },
      { value: "09", label: "Service lines" },
      { value: "03", label: "Countries served" },
      { value: "100%", label: "In-house team" },
    ],
  },
  ms: {
    eyebrow: "Agensi — 001",
    statement:
      "Kami bukan sekadar membina laman web. Kami membina sistem, jenama, perisian dan enjin pertumbuhan — infrastruktur digital di sebalik perniagaan berwawasan.",
    accent: new Set(["sistem,", "jenama,", "perisian", "pertumbuhan"]),
    body: "Imsuya Global ialah agensi digital dan AI serba lengkap. Satu pasukan merangkumi strategi, reka bentuk, kejuruteraan dan pertumbuhan — tiada apa yang hilang antara agensi, freelancer dan serahan tugas.",
    photoAlt: "Imsuya Global — kerja reka bentuk sedang berjalan di studio",
    stats: [
      { value: "15+", label: "Projek disiapkan" },
      { value: "09", label: "Barisan perkhidmatan" },
      { value: "03", label: "Negara dilayani" },
      { value: "100%", label: "Pasukan dalaman" },
    ],
  },
};

export function Story() {
  const ref = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const copy = COPY[lang];

  useGSAP(
    () => {
      // Words ignite as you read — a scrubbed focus sweep.
      gsap.fromTo(
        ".story-word",
        { opacity: 0.13 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: ".story-statement",
            start: "top 78%",
            end: "bottom 45%",
            scrub: 0.4,
          },
        }
      );

      // Parallax on the pixel cluster.
      gsap.fromTo(
        ".story-pixels",
        { y: 80 },
        {
          y: -80,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      // Studio photo: clip-path curtain reveal, then a slow parallax drift.
      gsap.fromTo(
        ".story-photo",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ".story-photo", start: "top 80%", once: true },
        }
      );
      gsap.fromTo(
        ".story-photo img",
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 8,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: ".story-photo", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: ref, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section ref={ref} className="relative bg-void py-32 lg:py-44">
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
        <Eyebrow variant="a" className="mb-12">
          {copy.eyebrow}
        </Eyebrow>

        <p className="story-statement max-w-5xl text-[clamp(1.75rem,4.2vw,3.75rem)] font-bold leading-[1.15] tracking-tight">
          {copy.statement.split(" ").map((word, i) => (
            <span
              key={`${lang}-${i}`}
              className={`story-word inline-block ${copy.accent.has(word) ? "text-coral" : ""}`}
            >
              {word}&nbsp;
            </span>
          ))}
        </p>

        <div className="mt-24 grid gap-16 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-5" y={40}>
            <p className="max-w-md text-base leading-relaxed text-muted">{copy.body}</p>
          </Reveal>

          {/* the studio, mid-work — with the pixel motif dissolving beside it */}
          <div className="relative lg:col-span-7">
            <div className="story-photo img-veil card relative z-[1] aspect-[16/10] overflow-hidden border border-paper/[0.1]">
              <Image
                src="/about/studio.png"
                alt={copy.photoAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="img-cinematic object-cover"
              />
            </div>
            <div
              aria-hidden
              className="story-pixels absolute -right-6 -top-10 z-0 grid w-40 grid-cols-6 gap-2 opacity-90"
            >
              {Array.from({ length: 24 }).map((_, i) => {
                const r = (i * 2654435761) % 100;
                const cls =
                  r < 16
                    ? "bg-coral"
                    : r < 42
                      ? "bg-navy"
                      : r < 58
                        ? "bg-navy/20"
                        : "bg-transparent";
                return <span key={i} className={`aspect-square ${cls}`} />;
              })}
            </div>
          </div>
        </div>

        <Reveal stagger={0.1} className="mt-28 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-paper/[0.08] pt-12 lg:grid-cols-4">
          {copy.stats.map((s) => (
            <div key={s.label}>
              <p className="text-display text-5xl lg:text-6xl">{s.value}</p>
              <p className="text-eyebrow mt-3 text-soft">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

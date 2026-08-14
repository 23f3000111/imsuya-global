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
    eyebrow: "The Agency / 001",
    statement:
      "We don't just build websites. We build systems, brands, software and growth engines.",
    accent: new Set(["systems,", "brands,", "software", "growth"]),
    body: "Imsuya Global is a boutique creative digital design and smart website development studio. We have experts covering every aspect of the company from strategy, design, engineering, production, development and more.",
    photoAlt: "The Imsuya Global studio in Kuala Lumpur",
    stats: [
      { value: "15+", label: "Projects shipped" },
      { value: "09", label: "Service lines" },
      { value: "03", label: "Countries served" },
      { value: "100%", label: "In house team" },
    ],
  },
  ms: {
    eyebrow: "Agensi / 001",
    statement:
      "Kami bukan sekadar membina laman web. Kami membina sistem, jenama, perisian dan enjin pertumbuhan.",
    accent: new Set(["sistem,", "jenama,", "perisian", "pertumbuhan"]),
    body: "Imsuya Global ialah studio butik reka bentuk digital kreatif dan pembangunan laman web pintar. Kami mempunyai pakar merangkumi setiap aspek syarikat dari strategi, reka bentuk, kejuruteraan, produksi, pembangunan dan banyak lagi.",
    photoAlt: "Studio Imsuya Global di Kuala Lumpur",
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
            start: "top 82%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        }
      );

      // Parallax on the pixel cluster.
      gsap.fromTo(
        ".story-pixels",
        { y: 60 },
        {
          y: -60,
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
          scrollTrigger: { trigger: ".story-photo", start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        ".story-photo img",
        { yPercent: -6, scale: 1.1 },
        {
          yPercent: 6,
          scale: 1.1,
          ease: "none",
          scrollTrigger: { trigger: ".story-photo", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: ref, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section ref={ref} className="relative bg-void py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
        <Eyebrow variant="a" className="mb-10">
          {copy.eyebrow}
        </Eyebrow>

        <p className="story-statement max-w-5xl text-[clamp(1.75rem,4.2vw,3.5rem)] font-bold leading-[1.15] tracking-tight">
          {copy.statement.split(" ").map((word, i) => (
            <span
              key={`${lang}-${i}`}
              className={`story-word inline-block ${copy.accent.has(word) ? "text-coral" : ""}`}
            >
              {word}&nbsp;
            </span>
          ))}
        </p>

        {/*
          The copy column carries the paragraph AND the numbers so it stands as
          tall as the photo beside it. Previously the text sat alone at the
          bottom and left a dead block of paper above it.
        */}
        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <Reveal className="flex flex-col justify-between gap-10 lg:col-span-5" y={40}>
            <p className="max-w-md text-base leading-relaxed text-muted">{copy.body}</p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-paper/[0.08] pt-8">
              {copy.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-display text-4xl lg:text-5xl">{s.value}</p>
                  <p className="text-eyebrow mt-2 text-soft">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* the studio, mid work — with the pixel motif dissolving beside it */}
          <div className="relative lg:col-span-7">
            <div className="story-photo img-veil card relative z-[1] aspect-[16/10] overflow-hidden border border-paper/[0.1]">
              <Image
                src="/about/studio.jpg"
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
      </div>
    </section>
  );
}

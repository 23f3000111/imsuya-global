"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitChars } from "@/components/ui/SplitChars";
import { PixelGlyph } from "@/components/ui/PixelGlyph";
import { useLang } from "@/i18n";

gsap.registerPlugin(useGSAP);

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false }
);

const COPY = {
  en: {
    h1: "Creative digital design & smart website development studio in Malaysia",
    weBuild: "WE BUILD",
    phrases: [
      "DIGITAL FUTURES",
      "CREATIVE DESIGNS",
      "CUSTOM AI PROGRAMS",
      "CUSTOM AI SOFTWARES",
    ],
    sub: "We pride ourselves to be the dream team that takes an idea and converts it into your digital reality. Based in Malaysia, servicing a global audience. We are Imsuya Global.",
    scroll: "SCROLL",
  },
  ms: {
    h1: "Studio reka bentuk digital kreatif & pembangunan laman web pintar di Malaysia",
    weBuild: "KAMI MEMBINA",
    phrases: [
      "MASA DEPAN DIGITAL",
      "REKA BENTUK KREATIF",
      "PROGRAM AI TERSUAI",
      "PERISIAN AI TERSUAI",
    ],
    sub: "Kami berbangga menjadi pasukan idaman yang mengambil idea dan menjadikannya realiti digital anda. Berpangkalan di Malaysia, melayani audiens global. Kami Imsuya Global.",
    scroll: "SKROL",
  },
};

// Seconds each headline holds before the next one takes over.
const HOLD = 2.4;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const copy = COPY[lang];

  useGSAP(
    () => {
      const section = sectionRef.current!;
      const phrases = gsap.utils.toArray<HTMLElement>(".hero-phrase");
      const markers = gsap.utils.toArray<HTMLElement>(".hero-marker");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const chars0 = section.querySelectorAll(".hero-static .char");
      const firstChars = phrases[0].querySelectorAll(".char");

      // Everything after the first headline waits below the mask line.
      phrases.forEach((p, i) => {
        if (i > 0) gsap.set(p.querySelectorAll(".char"), { yPercent: 120 });
      });

      const markerRest =
        markers.length > 1 ? getComputedStyle(markers[1]).backgroundColor : "rgba(13,18,36,0.2)";
      gsap.set(markers[0], { backgroundColor: "#ff4e45" });

      if (reduced) {
        // Hold on the first headline; no looping motion.
        gsap.set([".hero-canvas", ".hero-fade-in"], { opacity: 1 });
        return;
      }

      // --- entrance, timed to the preloader curtain lifting ---
      gsap
        .timeline({ delay: 1.0, defaults: { ease: "expo.out" } })
        .fromTo(".hero-canvas", { opacity: 0 }, { opacity: 1, duration: 2 }, 0)
        .fromTo(chars0, { yPercent: 120 }, { yPercent: 0, duration: 1.2, stagger: 0.035 }, 0.3)
        .fromTo(firstChars, { yPercent: 120 }, { yPercent: 0, duration: 1.2, stagger: 0.025 }, 0.55)
        .fromTo(
          ".hero-fade-in",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.12 },
          1
        );

      // --- the headline carousel, running on its own clock ---
      // Each pass hands off to the next phrase; the final pass returns to the
      // first, which leaves the timeline in its start state so it can repeat.
      const loop = gsap.timeline({ repeat: -1, delay: 2.6 });

      copy.phrases.forEach((_, i) => {
        const next = (i + 1) % copy.phrases.length;
        const label = `swap${i}`;

        loop.addLabel(label, i === 0 ? 0 : `+=${HOLD}`);
        // Exit as one block: staggering here strands the last letter alone.
        loop.to(
          phrases[i].querySelectorAll(".char"),
          { yPercent: -120, duration: 0.5, ease: "power3.in" },
          label
        );
        loop.fromTo(
          phrases[next].querySelectorAll(".char"),
          { yPercent: 120 },
          { yPercent: 0, duration: 0.6, stagger: 0.02, ease: "power3.out" },
          `${label}+=0.34`
        );
        loop.to(markers[i], { backgroundColor: markerRest, duration: 0.25 }, label);
        loop.to(markers[next], { backgroundColor: "#ff4e45", duration: 0.25 }, label);
      });

      // Let the last headline breathe before the loop restarts.
      loop.to({}, { duration: HOLD });
    },
    { scope: sectionRef, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh flex-col justify-center overflow-hidden bg-void"
    >
      {/* decorative layers, all beneath the copy */}
      <div className="blueprint" aria-hidden />

      {/* The motion lives on the right half only. The mask dissolves it before
          it can reach the headline column, so no pixel ever crosses the type. */}
      <div className="hero-canvas hero-motion absolute inset-y-0 right-0 z-0 w-full lg:w-[58%]">
        <ParticleField />
      </div>

      {/* Solid paper under the nav and the copy column; clear glass on the right. */}
      <div className="motion-scrim" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        {/*
          The page's one real heading. The rotating slab below is the hero
          visually, but as a heading it was four brand slogans stacked into a
          single run-on string with no subject and no place in it. This line
          carries the primary topic; it uses the same eyebrow treatment every
          other section on the site opens with, so it reads as part of the
          system rather than as an SEO bolt-on.
        */}
        <h1 className="hero-fade-in text-eyebrow mb-6 flex max-w-lg items-start gap-3 text-muted lg:mb-8 lg:max-w-none lg:items-center">
          <PixelGlyph variant="a" />
          {copy.h1}
        </h1>

        {/* No max-width here: the rotating band below clips overflow on both
            axes, so a narrower block would shear the longest headline. */}
        <p className="text-display text-[clamp(1.5rem,5.6vw,5.6rem)] uppercase">
          <span className="hero-static text-outline block whitespace-nowrap">
            <SplitChars text={copy.weBuild} />
          </span>
          {/* No accent block after the phrase any more: against the dark blue
              H1 it just read as a stray orange dot. */}
          {/*
            All four headlines live in the DOM at once so the carousel can hand
            off between them. Only the first is exposed to assistive tech —
            otherwise the slab is announced as four unrelated slogans run
            together into one sentence.
          */}
          <span className="relative block h-[1.05em] overflow-hidden">
            {copy.phrases.map((phrase, i) => (
              <span
                key={phrase}
                aria-hidden={i > 0 || undefined}
                className="hero-phrase absolute inset-x-0 top-0 whitespace-nowrap"
              >
                <SplitChars text={phrase} />
              </span>
            ))}
          </span>
        </p>

        <p className="hero-fade-in mt-10 max-w-xl text-base leading-relaxed text-muted lg:text-lg">
          {copy.sub}
        </p>
      </div>

      {/* story progress rail */}
      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex xl:right-[3vw]">
        {copy.phrases.map((p) => (
          <span key={p} className="hero-marker size-2 bg-paper/20 transition-colors" />
        ))}
      </div>

      <div className="hero-fade-in absolute inset-x-0 bottom-8 z-10 flex items-end justify-end px-6 lg:px-12">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.25em] text-soft">{copy.scroll}</span>
          <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-coral to-transparent" />
        </div>
      </div>
    </section>
  );
}

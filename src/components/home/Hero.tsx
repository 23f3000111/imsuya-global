"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SplitChars } from "@/components/ui/SplitChars";
import { PixelCore } from "./PixelCore";
import { useLang } from "@/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false }
);

const COPY = {
  en: {
    eyebrow: "Imsuya Global — Full-Service Digital & AI Agency",
    weBuild: "WE BUILD",
    phrases: ["DIGITAL FUTURES", "AI SYSTEMS", "CUSTOM SOFTWARE", "BUSINESS GROWTH"],
    sub: "Websites, software, AI systems and brands — engineered for businesses that intend to lead.",
    location: "KUALA LUMPUR — WORLDWIDE",
    scroll: "SCROLL",
    // sized so the longest phrase never wraps (wrapped chars ride exit
    // animations back into view as stray letters)
    sizeClass: "text-[clamp(2.1rem,8.4vw,8.5rem)]",
  },
  ms: {
    eyebrow: "Imsuya Global — Agensi Digital & AI Serba Lengkap",
    weBuild: "KAMI MEMBINA",
    phrases: ["MASA DEPAN DIGITAL", "SISTEM AI", "PERISIAN TERSUAI", "PERTUMBUHAN BISNES"],
    sub: "Laman web, perisian, sistem AI dan jenama — direka untuk perniagaan yang mahu mendahului.",
    location: "KUALA LUMPUR — SELURUH DUNIA",
    scroll: "SKROL",
    sizeClass: "text-[clamp(1.9rem,6.9vw,7.2rem)]",
  },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const { lang } = useLang();
  const copy = COPY[lang];

  useGSAP(
    () => {
      const section = sectionRef.current!;
      const phrases = gsap.utils.toArray<HTMLElement>(".hero-phrase");
      const markers = gsap.utils.toArray<HTMLElement>(".hero-marker");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // --- entrance ---
      const chars0 = section.querySelectorAll(".hero-static .char");
      const firstChars = phrases[0].querySelectorAll(".char");
      phrases.forEach((p, i) => {
        if (i > 0) gsap.set(p.querySelectorAll(".char"), { yPercent: 120 });
      });

      if (!reduced) {
        // Delayed so the reveal plays as the preloader curtain lifts.
        gsap
          .timeline({ delay: 1.0, defaults: { ease: "expo.out" } })
          .fromTo(".hero-canvas", { opacity: 0 }, { opacity: 1, duration: 2 }, 0)
          .fromTo(
            chars0,
            { yPercent: 120 },
            { yPercent: 0, duration: 1.2, stagger: 0.035 },
            0.3
          )
          .fromTo(
            firstChars,
            { yPercent: 120 },
            { yPercent: 0, duration: 1.2, stagger: 0.025 },
            0.55
          )
          .fromTo(
            ".hero-fade-in",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.12 },
            1
          );
      }

      if (reduced) return;

      // --- pinned scroll story ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            scrollRef.current = self.progress;
          },
        },
      });

      const markerRest =
        markers.length > 1 ? getComputedStyle(markers[1]).backgroundColor : "rgba(13,18,36,0.2)";
      gsap.set(markers[0], { backgroundColor: "#ff4e45" });

      copy.phrases.forEach((_, i) => {
        if (i === copy.phrases.length - 1) return;
        const label = `swap${i}`;
        tl.addLabel(label, i * 1.4 + 0.6);
        // Exit as one block — a char stagger here strands the last letter
        // mid-scrub, floating on its own.
        tl.to(
          phrases[i].querySelectorAll(".char"),
          { yPercent: -120, duration: 0.55, ease: "power3.in" },
          label
        );
        tl.to(
          phrases[i + 1].querySelectorAll(".char"),
          { yPercent: 0, duration: 0.65, stagger: 0.022, ease: "power3.out" },
          `${label}+=0.45`
        );
        tl.to(markers[i], { backgroundColor: markerRest, duration: 0.2 }, label);
        tl.to(markers[i + 1], { backgroundColor: "#ff4e45", duration: 0.2 }, label);
      });

      // Fade the scroll cue away once the story starts.
      tl.to(".hero-cue", { opacity: 0, duration: 0.3 }, 0.4);
    },
    { scope: sectionRef, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh flex-col justify-center overflow-hidden bg-void"
    >
      {/* decorative layers — always below text (z-0 vs z-10) */}
      <div className="blueprint" aria-hidden />
      <div className="glow-field" aria-hidden />
      <div className="hero-canvas absolute inset-0 z-0">
        <ParticleField scrollRef={scrollRef} />
      </div>

      {/* the Pixel Core — brand mark, alive (below text) */}
      <div className="hero-fade-in absolute right-[5vw] top-1/2 z-[5] hidden w-[clamp(240px,22vw,330px)] -translate-y-1/2 xl:block">
        <PixelCore />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        <p className="hero-fade-in text-eyebrow mb-8 text-muted">{copy.eyebrow}</p>

        <h1 className={`text-display whitespace-nowrap uppercase ${copy.sizeClass}`}>
          <span className="hero-static text-outline block">
            <SplitChars text={copy.weBuild} />
          </span>
          <span className="relative block h-[1.05em] overflow-hidden">
            {copy.phrases.map((phrase) => (
              <span key={phrase} className="hero-phrase absolute inset-x-0 top-0 whitespace-nowrap">
                <SplitChars text={phrase} />
                <span
                  aria-hidden
                  className="ml-[0.08em] inline-block size-[0.14em] animate-pulse bg-coral"
                />
              </span>
            ))}
          </span>
        </h1>

        <p className="hero-fade-in mt-10 max-w-md text-base leading-relaxed text-muted">
          {copy.sub}
        </p>
      </div>

      {/* story progress rail */}
      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex xl:right-[2vw]">
        {copy.phrases.map((p) => (
          <span key={p} className="hero-marker size-2 bg-paper/20 transition-colors" />
        ))}
      </div>

      <div className="hero-fade-in absolute inset-x-0 bottom-8 z-10 flex items-end justify-between px-6 lg:px-12">
        <p className="font-mono text-[11px] tracking-[0.25em] text-soft">{copy.location}</p>
        <div className="hero-cue flex flex-col items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.25em] text-soft">{copy.scroll}</span>
          <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-coral to-transparent" />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SplitChars } from "@/components/ui/SplitChars";
import { useLang } from "@/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false }
);

const COPY = {
  en: {
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
      // Long pin + wide dwell between swaps so each headline can be read.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=620%",
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

      const DWELL = 2.6; // scroll units each headline holds before swapping
      copy.phrases.forEach((_, i) => {
        if (i === copy.phrases.length - 1) return;
        const label = `swap${i}`;
        tl.addLabel(label, i * DWELL + 1.6);
        // Exit as one block: a char stagger here strands the last letter
        // mid-scrub, floating on its own.
        tl.to(
          phrases[i].querySelectorAll(".char"),
          { yPercent: -120, duration: 0.5, ease: "power3.in" },
          label
        );
        tl.to(
          phrases[i + 1].querySelectorAll(".char"),
          { yPercent: 0, duration: 0.6, stagger: 0.02, ease: "power3.out" },
          `${label}+=0.42`
        );
        tl.to(markers[i], { backgroundColor: markerRest, duration: 0.2 }, label);
        tl.to(markers[i + 1], { backgroundColor: "#ff4e45", duration: 0.2 }, label);
      });

      // Hold on the final headline before the pin releases.
      tl.to({}, { duration: 0.01 }, copy.phrases.length * DWELL + 1.2);

      // Fade the scroll cue away once the story starts.
      tl.to(".hero-cue", { opacity: 0, duration: 0.3 }, 0.5);
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
      <div className="hero-canvas absolute inset-0 z-0">
        <ParticleField scrollRef={scrollRef} />
      </div>
      {/* navy veil over the motion so the words stay stark against it */}
      <div className="motion-scrim" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        <h1 className="text-display whitespace-nowrap text-[clamp(1.5rem,6.6vw,6.9rem)] uppercase">
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

        <p className="hero-fade-in mt-12 max-w-xl text-base leading-relaxed text-muted lg:text-lg">
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
        <div className="hero-cue flex flex-col items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.25em] text-soft">{copy.scroll}</span>
          <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-coral to-transparent" />
        </div>
      </div>
    </section>
  );
}

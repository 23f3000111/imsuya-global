"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitChars } from "@/components/ui/SplitChars";
import { PixelGlyph } from "@/components/ui/PixelGlyph";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { onPreloaderLift } from "@/lib/preloader";
import { useLang } from "@/i18n";

gsap.registerPlugin(useGSAP);

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false }
);

const COPY = {
  en: {
    h1: "AI creative agency & website development studio in Malaysia",
    weBuild: "WE BUILD",
    phrases: [
      "DIGITAL FUTURES",
      "CREATIVE DESIGNS",
      "CUSTOM AI PROGRAMS",
      "CUSTOM AI SOFTWARES",
    ],
    sub: "We pride ourselves to be the dream team that takes an idea and converts it into your digital reality. Based in Malaysia, servicing a global audience. We are Imsuya Global.",
    start: "Start a project",
    work: "See our work",
    base: "Petaling Jaya, Malaysia · Working worldwide",
    scroll: "SCROLL",
  },
  ms: {
    h1: "Agensi kreatif AI & studio pembangunan laman web di Malaysia",
    weBuild: "KAMI MEMBINA",
    phrases: [
      "MASA DEPAN DIGITAL",
      "REKA BENTUK KREATIF",
      "PROGRAM AI TERSUAI",
      "PERISIAN AI TERSUAI",
    ],
    sub: "Kami berbangga menjadi pasukan idaman yang mengambil idea dan menjadikannya realiti digital anda. Berpangkalan di Malaysia, melayani audiens global. Kami Imsuya Global.",
    start: "Mulakan projek",
    work: "Lihat kerja kami",
    base: "Petaling Jaya, Malaysia · Bekerja di seluruh dunia",
    scroll: "SKROL",
  },
};

// Seconds each headline holds before the next one takes over.
const HOLD = 2.4;

/**
 * Splits a headline so its final word can carry the brand orange — the same
 * rule every page hero follows. Both halves are SplitChars, so the carousel
 * still finds every `.char` in the phrase and animates it as one line.
 */
function Phrase({ text }: { text: string }) {
  const cut = text.lastIndexOf(" ");
  if (cut === -1) return <SplitChars text={text} className="text-coral" />;
  return (
    <>
      <SplitChars text={text.slice(0, cut + 1)} />
      <SplitChars text={text.slice(cut + 1)} className="text-coral" />
    </>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const copy = COPY[lang];

  useGSAP(
    (_, contextSafe) => {
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
        markers.length > 1 ? getComputedStyle(markers[1]).backgroundColor : "rgba(8,29,56,0.2)";
      gsap.set(markers[0], { backgroundColor: "#f04e23" });

      if (reduced) {
        // Hold on the first headline; no looping motion.
        gsap.set([".hero-canvas", ".hero-fade-in"], { opacity: 1 });
        return;
      }

      // --- entrance, held until the loader curtain starts to lift ---
      // fromTo renders its start state at once, so the copy is already tucked
      // below its mask while the loader is still on screen.
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .fromTo(".hero-canvas", { opacity: 0 }, { opacity: 1, duration: 2 }, 0)
        .fromTo(chars0, { yPercent: 120 }, { yPercent: 0, duration: 1.2, stagger: 0.035 }, 0.3)
        .fromTo(firstChars, { yPercent: 120 }, { yPercent: 0, duration: 1.2, stagger: 0.025 }, 0.55)
        .fromTo(
          ".hero-fade-in",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
          0.9
        );

      // --- the headline carousel, running on its own clock ---
      // Each pass hands off to the next phrase; the final pass returns to the
      // first, which leaves the timeline in its start state so it can repeat.
      const loop = gsap.timeline({ repeat: -1, paused: true });

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
        loop.to(markers[next], { backgroundColor: "#f04e23", duration: 0.25 }, label);
      });

      // Let the last headline breathe before the loop restarts.
      loop.to({}, { duration: HOLD });

      // contextSafe, so the delayed calls belong to this context and are
      // cleaned up with it — on unmount, and on a language switch.
      const start = contextSafe!(() => {
        gsap.delayedCall(0.15, () => intro.play());
        gsap.delayedCall(1.75, () => loop.play());
      });

      return onPreloaderLift(start);
    },
    { scope: sectionRef, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh min-h-[640px] flex-col justify-center overflow-hidden bg-void"
    >
      {/* decorative layers, all beneath the copy */}
      {/* The motion lives on the right of the frame. Wide on purpose — at 58%
          the network was squeezed into the corner. The mask dissolves it before
          it can reach the headline column, so no pixel ever crosses the type. */}
      <div className="hero-canvas hero-motion absolute inset-y-0 right-0 z-0 w-full lg:w-[64%]">
        <ParticleField />
      </div>

      {/* Solid paper under the nav and the copy column; clear glass on the right. */}
      <div className="motion-scrim" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        {/*
          The page's one real heading. The rotating slab below is the hero
          visually, but as a heading it was four brand slogans stacked into a
          single run-on string with no subject and no place in it. This line
          carries the primary topic — the searches the studio wants to be
          found for — in the eyebrow treatment every other section opens with.
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
          {/*
            All four headlines live in the DOM at once so the carousel can hand
            off between them. Only the first is exposed to assistive tech —
            otherwise the slab is announced as four unrelated slogans run
            together into one sentence. Each one ends on a word in orange.
          */}
          <span className="relative block h-[1.05em] overflow-hidden">
            {copy.phrases.map((phrase, i) => (
              <span
                key={phrase}
                aria-hidden={i > 0 || undefined}
                className="hero-phrase absolute inset-x-0 top-0 whitespace-nowrap"
              >
                <Phrase text={phrase} />
              </span>
            ))}
          </span>
        </p>

        <p className="hero-fade-in mt-8 max-w-xl text-base leading-relaxed text-muted lg:mt-10 lg:text-lg">
          {copy.sub}
        </p>

        {/* The next step, in the hero rather than three sections down. */}
        <div className="hero-fade-in mt-8 flex flex-wrap items-center gap-3 lg:mt-10 lg:gap-4">
          <MagneticButton href="/contact">
            {copy.start}
            <span aria-hidden>→</span>
          </MagneticButton>
          <MagneticButton href="/portfolio" variant="ghost">
            {copy.work}
          </MagneticButton>
        </div>
      </div>

      {/* story progress rail */}
      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex xl:right-[3vw]">
        {copy.phrases.map((p) => (
          <span key={p} className="hero-marker size-2 bg-paper/20 transition-colors" />
        ))}
      </div>

      <div className="hero-fade-in absolute inset-x-0 bottom-8 z-10 flex items-end px-6 lg:px-12">
        {/* Wraps before it can reach the scroll cue in the middle. */}
        <p className="hidden max-w-[calc(50%-4.5rem)] items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-soft sm:flex">
          <span aria-hidden className="block size-1.5 shrink-0 bg-coral" />
          {copy.base.toUpperCase()}
        </p>
        {/* Centred: the bottom-right corner belongs to the assistant's launcher. */}
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.25em] text-soft">{copy.scroll}</span>
          <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-coral to-transparent" />
        </div>
      </div>
    </section>
  );
}

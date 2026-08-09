"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLang } from "@/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Ambient pixels that drift upward — the logo dissolving into what's next.
const PIXELS = [
  { left: "8%", top: "22%", size: 10, delay: 0, color: "bg-coral" },
  { left: "16%", top: "68%", size: 6, delay: 1.2, color: "bg-navy/30" },
  { left: "28%", top: "35%", size: 8, delay: 2.1, color: "bg-navy" },
  { left: "72%", top: "28%", size: 7, delay: 0.6, color: "bg-navy/40" },
  { left: "84%", top: "60%", size: 12, delay: 1.7, color: "bg-coral" },
  { left: "91%", top: "34%", size: 6, delay: 2.6, color: "bg-navy" },
  { left: "62%", top: "75%", size: 9, delay: 0.9, color: "bg-navy/25" },
];

const COPY = {
  en: {
    eyebrow: "Your move / 006",
    line1: "Let's build",
    line2: "what's",
    accent: "next.",
    sub: "Tell us where your business should be. We'll engineer the way there.",
    cta: "Start your project",
  },
  ms: {
    eyebrow: "Giliran anda / 006",
    line1: "Mari bina",
    line2: "langkah",
    accent: "seterusnya.",
    sub: "Beritahu kami ke mana perniagaan anda patut pergi. Kami rekakan laluannya.",
    cta: "Mulakan projek anda",
  },
};

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const copy = COPY[lang];

  useGSAP(
    () => {
      gsap.fromTo(
        ".cta-line .line-inner",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.3,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
        }
      );
      gsap.fromTo(
        ".cta-after",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.5,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
        }
      );
    },
    { scope: ref, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-void py-32 text-center"
    >
      {/* decorative layers — always below text */}
      <div
        aria-hidden
        className="navy-wash absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_120%,#1e2852_0%,transparent_60%)]"
      />
      <div className="glow-field" aria-hidden />
      {PIXELS.map((p, i) => (
        <span
          key={i}
          aria-hidden
          className={`absolute z-0 ${p.color}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `pixel-drift ${5 + i * 0.7}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative z-10 px-6">
        <p className="text-eyebrow mb-10 text-soft">{copy.eyebrow}</p>
        <h2 className="cta-line text-display text-[clamp(2.6rem,9vw,9rem)] uppercase">
          <span className="block overflow-hidden">
            <span className="line-inner block">{copy.line1}</span>
          </span>
          <span className="block overflow-hidden">
            <span className="line-inner block">
              {copy.line2} <span className="text-coral">{copy.accent}</span>
            </span>
          </span>
        </h2>
        <p className="cta-after mx-auto mt-8 max-w-md text-base leading-relaxed text-muted">
          {copy.sub}
        </p>
        <div className="cta-after mt-12">
          <MagneticButton href="/contact">{copy.cta}</MagneticButton>
        </div>
      </div>
    </section>
  );
}

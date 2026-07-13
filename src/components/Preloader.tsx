"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// The logo's pixel-dissolve mark, assembling on arrival. ~1.4s, then lifts.
const GRID = 5;
const CELLS = Array.from({ length: GRID * GRID }, (_, i) => {
  const r = (i * 2654435761) % 100;
  return r < 18 ? "bg-coral" : r < 48 ? "bg-navy" : r < 72 ? "bg-paper/30" : "bg-transparent";
});

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setGone(true);
        return;
      }
      gsap
        .timeline({ onComplete: () => setGone(true) })
        .fromTo(
          ".pre-pixel",
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.4, stagger: { each: 0.02, from: "random" }, ease: "power2.out" },
          0.1
        )
        .fromTo(
          ".pre-word",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" },
          0.45
        )
        .to(ref.current, { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, 1.05);
    },
    { scope: ref }
  );

  if (gone) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-8 bg-void"
    >
      <div className="grid grid-cols-5 gap-1.5">
        {CELLS.map((cls, i) => (
          <span key={i} className={`pre-pixel size-3 ${cls}`} />
        ))}
      </div>
      <Image
        src="/brand/logo.png"
        alt="Imsuya Global"
        width={220}
        height={49}
        priority
        className="pre-word h-8 w-auto"
      />
    </div>
  );
}

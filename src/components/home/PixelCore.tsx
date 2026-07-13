"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * The Pixel Core — the brand's "G" mark rendered as a live pixel matrix,
 * continuously dissolving and reassembling (the logo motif, animated).
 * Framed by slow-rotating drafting squares. Decorative: sits below text (z).
 */

const G_BITMAP = [
  ".XXXXXXX.",
  "XX.....XX",
  "X........",
  "X........",
  "X...CCCCC",
  "X.......X",
  "X.......X",
  "XX.....XX",
  ".XXXXXXX.",
];

type Cell = { on: boolean; coral: boolean };

const CELLS: Cell[] = G_BITMAP.flatMap((row) =>
  row.split("").map((ch) => ({ on: ch !== ".", coral: ch === "C" }))
);

export function PixelCore({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Each pixel flickers out and back on its own clock — perpetual dissolve.
      gsap.utils.toArray<HTMLElement>(".core-px").forEach((px, i) => {
        gsap.to(px, {
          opacity: 0.1,
          duration: 0.35,
          ease: "steps(2)",
          yoyo: true,
          repeat: -1,
          repeatDelay: 2.5 + ((i * 7919) % 100) / 18,
          delay: ((i * 104729) % 100) / 22,
        });
      });

      // The whole core breathes.
      gsap.to(".core-inner", {
        y: -14,
        duration: 4.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Drafting frames rotate at survey speed.
      gsap.to(".core-frame-a", { rotation: 360, duration: 60, ease: "none", repeat: -1 });
      gsap.to(".core-frame-b", { rotation: -360, duration: 90, ease: "none", repeat: -1 });

      // A scanline sweeps the matrix.
      gsap.fromTo(
        ".core-scan",
        { top: "-4%" },
        { top: "102%", duration: 3.6, ease: "none", repeat: -1, repeatDelay: 1.4 }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`pointer-events-none select-none ${className}`} aria-hidden>
      <div className="core-inner relative aspect-square w-full">
        {/* rotating drafting frames */}
        <div className="core-frame-a absolute inset-[-12%] border border-navy/15" />
        <div className="core-frame-b absolute inset-[-24%] rotate-45 border border-navy/10" />
        {/* corner ticks */}
        {[
          "left-0 top-0 border-l border-t",
          "right-0 top-0 border-r border-t",
          "bottom-0 left-0 border-b border-l",
          "bottom-0 right-0 border-b border-r",
        ].map((pos) => (
          <span key={pos} className={`absolute size-4 border-coral/60 ${pos}`} />
        ))}

        {/* the pixel G matrix */}
        <div className="absolute inset-[9%] grid grid-cols-9 grid-rows-9 gap-[6%] overflow-hidden">
          {CELLS.map((cell, i) => (
            <span
              key={i}
              className={`core-px ${
                cell.on ? (cell.coral ? "bg-coral" : "bg-navy/80") : "bg-navy/[0.06]"
              }`}
            />
          ))}
          {/* scanline */}
          <span className="core-scan absolute left-0 h-px w-full bg-coral/50" />
        </div>
      </div>

      <p className="mt-6 text-center font-mono text-[10px] tracking-[0.3em] text-soft">
        IG://CORE — SYS.09
      </p>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LOGO_ASPECT, LOGO_PARTS, type LogoPart } from "@/components/loader/logoParts";
import { markPreloaderLifted } from "@/lib/preloader";

gsap.registerPlugin(useGSAP);

/**
 * Stray pixels that stream in and are absorbed into the G's dissolving edge
 * before the real squares land. Home positions are hashed from the index so
 * the server and the client render the same markup.
 */
const DEBRIS = Array.from({ length: 26 }, (_, i) => {
  const h = (n: number) => ((i + 1) * 2654435761 * (n + 3)) % 1000 / 1000;
  return {
    x: 15 + h(1) * 9, // the G's pixel fringe, as % of the logo width
    y: 4 + h(2) * 78,
    s: 0.7 + h(3) * 1.3, // edge, as % of the logo width
    navy: h(4) < 0.28,
  };
});

/** Initial state, written inline so the server HTML never flashes the finished logo. */
const HIDDEN: Record<LogoPart["kind"], React.CSSProperties> = {
  bracket: { transform: "scaleY(0)" },
  g: { clipPath: "inset(0 100% 0 0)" },
  pixel: { opacity: 0 },
  letter: { transform: "translateY(115%)" },
  rule: { transform: "scaleX(0)" },
};

function maskStyle(src: string): React.CSSProperties {
  return {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };
}

const fill = (p: LogoPart) => (p.color === "navy" ? "var(--paper)" : "var(--coral)");

/**
 * The loader: the Imsuya Global logo, assembled from its own parts.
 *
 * The old loader showed a random 5x5 scatter of pixels over a flat logo image,
 * and the scatter did not look like the mark at all — the client's note. This
 * one is built out of the real artwork, split into its shapes (see
 * logoParts.ts), and it plays the mark's own idea in reverse: pixels stream
 * in and are absorbed, the bracket draws, the G sweeps round, the seven
 * detached squares land in their places, then IMSUYA rises and GLOBAL opens
 * out between its rules. A progress line and counter run underneath, and the
 * whole panel lifts away on an orange edge.
 *
 * About 2.5s end to end. It only runs on a full page load, it is skipped
 * entirely under reduced motion, and a CSS failsafe clears it if the script
 * never runs so the site can never be left behind a white screen.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        markPreloaderLifted();
        setGone(true);
        return;
      }

      const counter = ref.current!.querySelector<HTMLElement>(".pre-count");
      const progress = { v: 0 };

      const tl = gsap.timeline({ onComplete: () => setGone(true) });

      tl
        // Pixels stream in from all round the frame and dissolve into the G.
        .fromTo(
          ".pre-debris",
          {
            x: () => gsap.utils.random(-0.55, 0.55) * window.innerWidth,
            y: () => gsap.utils.random(-0.45, 0.45) * window.innerHeight,
            rotate: () => gsap.utils.random(-180, 180),
            scale: () => gsap.utils.random(1.2, 2.6),
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: "power3.inOut",
            stagger: 0.018,
          },
          0
        )
        // Same stagger, offset by the flight time, so each pixel dissolves the
        // moment it lands. Two overlapping tweens on one opacity — which is
        // what a random-order fade gave — left late arrivals stuck on screen.
        .to(".pre-debris", { opacity: 0, scale: 0.2, duration: 0.22, stagger: 0.018 }, 0.75)

        // The bracket draws from its centre; the G sweeps in behind it.
        .fromTo(".pre-bracket", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "expo.out" }, 0.1)
        .fromTo(
          ".pre-g",
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power3.inOut" },
          0.2
        )

        // The seven real squares land in their places with a little overshoot.
        .fromTo(
          ".pre-pixel",
          {
            x: () => gsap.utils.random(120, 320),
            y: () => gsap.utils.random(-160, 160),
            rotate: () => gsap.utils.random(-120, 120),
            scale: 0.4,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 0.65,
            ease: "back.out(1.7)",
            stagger: 0.055,
          },
          0.55
        )

        // IMSUYA rises out of its baseline, letter by letter. The from-state
        // is spelled out (y: 0 as well as yPercent) so GSAP never adds its own
        // reading of the inline transform on top of the percentage.
        .fromTo(
          ".pre-letter-navy",
          { y: 0, yPercent: 115 },
          { yPercent: 0, duration: 0.7, ease: "expo.out", stagger: 0.05 },
          0.8
        )
        // The rules open out from GLOBAL, and GLOBAL rises between them.
        .fromTo(".pre-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "expo.out" }, 1.0)
        .fromTo(
          ".pre-letter-coral",
          { y: 0, yPercent: 115 },
          { yPercent: 0, duration: 0.6, ease: "expo.out", stagger: 0.04 },
          1.05
        )
        .fromTo(".pre-tagline", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 1.1)

        // Progress runs the length of the build.
        .to(
          progress,
          {
            v: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter) counter.textContent = String(Math.round(progress.v)).padStart(3, "0");
            },
          },
          0
        )
        .fromTo(".pre-bar", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)

        // Hold a beat on the finished logo, then lift the whole panel away.
        // The logo rides the curtain up a little faster than the panel, so it
        // leaves the frame first and the edge reads as a sweep, not a slide.
        .add(() => markPreloaderLifted(), 2.0)
        .to(ref.current, { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, 1.95)
        .to(".pre-stage", { y: -140, duration: 0.85, ease: "expo.inOut" }, 1.95);
    },
    { scope: ref }
  );

  if (gone) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="preloader fixed inset-0 z-[300] flex items-center justify-center bg-void"
    >
      {/* A soft warm glow behind the mark — atmosphere, not a panel. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_36%_at_50%_46%,rgba(240,78,35,0.07),transparent_70%)]" />

      <div className="pre-stage relative flex flex-col items-center">
        <div
          className="relative"
          style={{ width: "clamp(260px, 34vw, 500px)", aspectRatio: String(LOGO_ASPECT) }}
        >
          {/*
            A ghost of the whole logo, drawn from the same parts at a whisper
            of ink. It is what the first frame shows before the script runs —
            on a slow phone that can be a second — and the build then fills it
            in, so the mark is on screen from the very start.
          */}
          {LOGO_PARTS.map((p) => (
            <span
              key={`ghost-${p.id}`}
              className="absolute block"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.w}%`,
                height: `${p.h}%`,
                background: "var(--paper)",
                opacity: 0.07,
                ...(p.src ? maskStyle(p.src) : {}),
              }}
            />
          ))}

          {DEBRIS.map((d, i) => (
            <span
              key={`d${i}`}
              className="pre-debris absolute block"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: `${d.s}%`,
                aspectRatio: "1",
                background: d.navy ? "var(--paper)" : "var(--coral)",
                opacity: 0,
              }}
            />
          ))}

          {LOGO_PARTS.map((p) => {
            const box: React.CSSProperties = {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.w}%`,
              height: `${p.h}%`,
            };

            // Letters and rules rise or open inside their own clipping box.
            if (p.kind === "letter" || p.kind === "rule") {
              return (
                <span key={p.id} className="absolute block overflow-hidden" style={box}>
                  <span
                    className={`block h-full w-full ${
                      p.kind === "rule"
                        ? "pre-rule"
                        : p.color === "navy"
                          ? "pre-letter-navy"
                          : "pre-letter-coral"
                    }`}
                    style={{
                      background: fill(p),
                      ...maskStyle(p.src!),
                      ...HIDDEN[p.kind],
                      // The left rule opens toward GLOBAL, the right one away from it.
                      transformOrigin: p.id === "ruleL" ? "100% 50%" : "0% 50%",
                    }}
                  />
                </span>
              );
            }

            return (
              <span
                key={p.id}
                className={`pre-${p.kind} absolute block`}
                style={{
                  ...box,
                  background: fill(p),
                  ...(p.src ? maskStyle(p.src) : {}),
                  ...HIDDEN[p.kind],
                }}
              />
            );
          })}
        </div>

        {/* Progress: a hairline the width of the logo, and a counter. */}
        <div className="mt-10 flex w-[clamp(260px,34vw,500px)] items-center gap-4">
          <span className="relative block h-px flex-1 overflow-hidden bg-paper/10">
            <span className="pre-bar absolute inset-0 origin-left bg-coral" style={{ transform: "scaleX(0)" }} />
          </span>
          <span className="pre-count font-mono text-[11px] tabular-nums tracking-[0.2em] text-soft">000</span>
        </div>
        <p className="pre-tagline mt-4 font-mono text-[10px] tracking-[0.32em] text-soft" style={{ opacity: 0 }}>
          BUILDING YOUR DIGITAL FUTURE
        </p>
      </div>

      {/* The orange edge that leads the panel off the top of the screen. */}
      <span className="absolute inset-x-0 bottom-0 block h-[3px] bg-coral" />
    </div>
  );
}

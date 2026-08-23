import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { RevealLines } from "./Reveal";

export function PageHero({
  eyebrow,
  lines,
  intro,
  accent,
  visual,
}: {
  eyebrow: string;
  lines: string[];
  intro?: string;
  /** Words in the headline to set in the brand coral. */
  accent?: string[];
  /**
   * Optional ornament for the right of the frame — the CSS cube pieces on
   * /portfolio and /services. It shares the row with the headline on desktop
   * and drops under the copy on a phone, where the type needs the full width.
   */
  visual?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-void px-6 pb-20 pt-44 lg:px-12 lg:pb-28 lg:pt-56">
      <div
        aria-hidden
        className="navy-wash absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,#1e2852_0%,transparent_55%)] opacity-60"
      />
      <div className="blueprint" aria-hidden />
      <div className="glow-field" aria-hidden />
      <div className="relative mx-auto max-w-[1600px]">
        <div className={visual ? "lg:flex lg:items-center lg:gap-12" : undefined}>
          <div className={visual ? "min-w-0 lg:flex-1" : undefined}>
            <Eyebrow className="mb-8">{eyebrow}</Eyebrow>
            <RevealLines
              as="h1"
              lines={lines}
              accent={accent}
              className={`text-display uppercase ${
                visual
                  ? "max-w-3xl text-[clamp(2.6rem,6.4vw,6rem)]"
                  : "max-w-6xl text-[clamp(2.8rem,8vw,7.5rem)]"
              }`}
            />
            {intro && (
              <p className="mt-10 max-w-lg text-lg leading-relaxed text-muted">{intro}</p>
            )}
          </div>

          {visual && (
            <div className="mt-14 flex justify-center lg:mt-0 lg:w-[38%] lg:shrink-0">
              {visual}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

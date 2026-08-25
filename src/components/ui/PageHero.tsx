import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { RevealLines } from "./Reveal";

export function PageHero({
  eyebrow,
  lines,
  intro,
  accent,
  visual,
  inset = false,
}: {
  eyebrow: string;
  lines: string[];
  intro?: string;
  /**
   * Words in the headline to set in the brand orange. Leave it off and the
   * headline lights its final word instead — the house rule the client asked
   * for ("…actually REACH.", "…you're BUILDING."). Pages that were signed off
   * with a different word carrying the colour pass it here and keep it.
   */
  accent?: string[];
  /**
   * Optional ornament for the right of the frame — the CSS cube pieces on
   * /portfolio and /services. It shares the row with the headline on desktop
   * and drops under the copy on a phone, where the type needs the full width.
   */
  visual?: ReactNode;
  /**
   * Leave room down the left for the floating service rail. The inset is on
   * the content, never on the section, so the background still runs edge to
   * edge — pushing the whole section over left a pale unpainted strip up the
   * side of the window that ran straight past the logo.
   */
  inset?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-void px-6 pb-20 pt-44 lg:px-12 lg:pb-28 lg:pt-56">
      {/*
        A whisper of brand warmth in the top right and nothing else. The navy
        plate that used to sit under the headline column has gone: on a plain
        white page it read as a grey box rather than as atmosphere.
      */}
      <div className="glow-field fade-out-bottom" aria-hidden />
      <div className={`relative mx-auto max-w-[1600px] ${inset ? "xl:pl-24" : ""}`}>
        <div className={visual ? "lg:flex lg:items-center lg:gap-12" : undefined}>
          <div className={visual ? "min-w-0 lg:flex-1" : undefined}>
            <Eyebrow className="mb-8">{eyebrow}</Eyebrow>
            <RevealLines
              as="h1"
              lines={lines}
              accent={accent}
              accentLast
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
            <div className="mt-14 flex justify-center lg:mt-0 lg:w-[44%] lg:shrink-0">
              {visual}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

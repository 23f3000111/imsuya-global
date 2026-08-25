"use client";

import { process } from "@/data/services";
import { Reveal } from "./Reveal";
import { useT } from "@/i18n";
import type { L10n } from "@/i18n/types";

/**
 * "How we run it, and what you get", drawn as a diagram instead of listed as
 * a grid of cards.
 *
 * One DOM, two shapes. Up to xl it is a vertical timeline — spine down the
 * left, numbered nodes on it, stage cards to the right. From xl it turns
 * ninety degrees: the spine runs across the page and the six stages hang off
 * it alternately above and below, which is the shape the client's reference
 * infographics use and keeps the whole run of six visible at once.
 *
 * The switch is done by dropping each <li> to `display: contents` at xl (see
 * `.flow-item` in globals.css) so its two children — the card and the node —
 * become cells of the parent grid and can be placed on different rows. That
 * is what avoids shipping the six stages twice, once per breakpoint.
 */
export function ProcessFlow({
  /** Which stage (0-based) hands over which deliverable, or undefined. */
  deliverableFor,
  youGetLabel,
}: {
  deliverableFor: (stage: number) => { name: L10n; detail: L10n } | undefined;
  youGetLabel: string;
}) {
  const t = useT();
  const last = process.length - 1;

  return (
    <Reveal y={50} className="relative">
      {/* The spine, vertical shape only. It fades out under the final card
          rather than stopping dead against it. */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-7 w-px -translate-x-1/2 bg-gradient-to-b from-paper/20 via-paper/20 to-transparent xl:hidden"
      />

      <ol role="list" className="flex flex-col gap-10 xl:grid xl:grid-cols-6 xl:gap-0">
        {process.map((p, i) => {
          const gain = deliverableFor(i);
          const above = i % 2 === 0;

          return (
            <li key={p.step.en} className="group relative pl-20 xl:pl-0 flow-item">
              {/* ---- the stage card ---- */}
              <div
                className={`xl:flex xl:flex-col xl:px-2 ${
                  above ? "xl:row-start-1 xl:justify-end" : "xl:row-start-3"
                }`}
                style={{ gridColumn: i + 1 }}
              >
                {/* Tick joining the card to the spine. Below the card when the
                    card sits above the line, above it when it hangs under. */}
                {!above && (
                  <span aria-hidden className="hidden h-7 w-px self-center bg-paper/20 xl:block" />
                )}

                <div className="card border border-paper/[0.08] p-5 transition-transform duration-500 xl:p-4 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-1">
                  <h3 className="text-base font-black uppercase leading-tight tracking-tight xl:text-sm">
                    {t(p.step)}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{t(p.detail)}</p>

                  {gain && (
                    <div className="mt-4 border-l-2 border-coral pl-3">
                      <p className="text-eyebrow text-coral">{youGetLabel}</p>
                      <p className="mt-1.5 text-[13px] font-bold leading-snug tracking-tight">
                        {t(gain.name)}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{t(gain.detail)}</p>
                    </div>
                  )}
                </div>

                {above && (
                  <span aria-hidden className="hidden h-7 w-px self-center bg-paper/20 xl:block" />
                )}
              </div>

              {/* ---- the node on the spine ---- */}
              <div
                className="absolute left-0 top-0 xl:relative xl:row-start-2 xl:flex xl:items-center xl:justify-center xl:py-3"
                style={{ gridColumn: i + 1 }}
              >
                {/* Horizontal spine, drawn per cell so it never crosses a gap.
                    The run stops at the first and last node rather than
                    trailing off the ends of the diagram. */}
                <span
                  aria-hidden
                  className={`absolute top-1/2 hidden h-px -translate-y-1/2 bg-paper/20 xl:block ${
                    i === 0 ? "left-1/2 right-0" : i === last ? "left-0 right-1/2" : "inset-x-0"
                  }`}
                />
                <span
                  className={`relative flex size-14 items-center justify-center rounded-full font-mono text-sm font-bold ring-8 ring-void transition-colors duration-500 ${
                    i === last
                      ? "bg-coral text-white"
                      : "bg-paper text-void group-hover:bg-coral"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}

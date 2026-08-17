"use client";

import Link from "next/link";
import { services } from "@/data/services";
import { ServiceIcon } from "./ServiceIcon";
import { useT } from "@/i18n";

/**
 * Fixed rail down the left edge of a service page, so you can jump straight
 * from one discipline to another without going back to the services list.
 * The service you are on burns orange; the rest sit navy but lit, not faded
 * to the point of looking disabled.
 *
 * Two things it has to do that it previously did not:
 *   - say that it is a run of nine you can travel, which the coral spine and
 *     the sweep that repeatedly falls down it now do, and
 *   - stay out of the header. It is centred in the space *below* the navbar,
 *     not in the viewport, so its panel can never sit behind the logo.
 */
export function ServiceRail({ activeSlug }: { activeSlug: string }) {
  const t = useT();
  const activeIndex = Math.max(
    0,
    services.findIndex((s) => s.slug === activeSlug)
  );

  return (
    <nav
      aria-label="Services"
      /* top-[calc(50%+3rem)] centres the rail in the page area under the 96px
         navbar rather than in the whole window. */
      className="fixed left-2 top-[calc(50%+3rem)] z-40 hidden -translate-y-1/2 xl:block"
    >
      {/* On a short window the rail scrolls inside itself rather than growing
          up into the header — which is what used to put a pale panel behind
          the logo. */}
      <div className="relative max-h-[calc(100vh-11rem)] overflow-y-auto overscroll-contain border border-paper/[0.08] bg-void/70 p-2 shadow-[0_18px_44px_-30px_rgba(30,40,82,0.55)] backdrop-blur-md [scrollbar-width:none]">
        {/* Spine: the full run, with the part you have reached burning coral. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-2 left-0 w-px overflow-hidden bg-paper/10"
        >
          <span
            className="block w-px bg-coral/70 transition-[height] duration-500 [transition-timing-function:var(--ease-out-expo)]"
            style={{ height: `${((activeIndex + 1) / services.length) * 100}%` }}
          />
        </span>

        {/* A highlight that keeps falling down the stack, so the rail reads as
            something you move through rather than a static row of icons. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-2 h-10 overflow-hidden"
        >
          <span className="rail-sweep block h-10 w-full bg-[linear-gradient(to_bottom,transparent,rgba(255,78,69,0.16),transparent)]" />
        </span>

        <ul className="relative flex flex-col gap-1">
          {services.map((s) => {
            const active = s.slug === activeSlug;
            return (
              <li key={s.slug} className="group/rail relative">
                <Link
                  href={`/services/${s.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-center p-2 transition-colors duration-300 ${
                    active ? "bg-coral/10" : "hover:bg-navy/[0.06]"
                  }`}
                >
                  <ServiceIcon
                    slug={s.slug}
                    className={`size-6 transition-all duration-300 ${
                      active
                        ? "text-coral opacity-100"
                        : "text-navy opacity-60 group-hover/rail:text-coral group-hover/rail:opacity-100"
                    }`}
                  />
                  <span className="sr-only">{t(s.title)}</span>
                </Link>

                {/* Label on hover, so the icons are never a guessing game. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-full top-1/2 ml-2 hidden -translate-y-1/2 whitespace-nowrap border border-paper/10 bg-void px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-paper shadow-lg group-hover/rail:block"
                >
                  {s.index} · {t(s.short).toUpperCase()}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Count plus a nudging arrow: nine of these, and they carry on down. */}
        <span
          aria-hidden
          className="mt-1 flex flex-col items-center gap-0.5 border-t border-paper/[0.08] pt-1.5 font-mono text-[9px] tracking-[0.12em] text-soft"
        >
          {String(activeIndex + 1).padStart(2, "0")}/{String(services.length).padStart(2, "0")}
          <span className="rail-nudge block text-coral">↓</span>
        </span>
      </div>
    </nav>
  );
}

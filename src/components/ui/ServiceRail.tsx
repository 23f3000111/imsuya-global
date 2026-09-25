"use client";

import Link from "next/link";
import { services } from "@/data/services";
import { ServiceIcon } from "./ServiceIcon";
import { useT } from "@/i18n";

/**
 * Floating rail down the left edge of a service page, so you can jump straight
 * from one discipline to another without going back a page.
 *
 * Rebuilt from the client's reference: a soft, rounded, glass panel rather
 * than a square bordered box, with the service you are on carried on a filled
 * coral disc. Three things it has to do that the old one did not:
 *
 *   - open on hover and name every discipline in place, instead of flashing a
 *     tooltip beside one icon at a time,
 *   - clear the header. It is centred in the page area *below* the 96px
 *     navbar, and with four services it is short enough that its panel can
 *     never reach up behind the logo, and
 *   - keep its distance from the left edge, so nothing about it reads as
 *     stuck to the side of the window.
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
      /* top-[calc(50%+3rem)] centres the rail in the page area under the
         navbar rather than in the whole window. */
      className="group fixed left-4 top-[calc(50%+3rem)] z-40 hidden -translate-y-1/2 xl:block"
    >
      <div className="max-h-[calc(100vh-11rem)] overflow-y-auto overscroll-contain rounded-[30px] border border-white/70 bg-white/65 p-2.5 shadow-[0_28px_70px_-30px_rgba(8,29,56,0.55)] backdrop-blur-xl [scrollbar-width:none]">
        <ul className="flex flex-col gap-1.5">
          {services.map((s) => {
            const active = s.slug === activeSlug;
            return (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  aria-current={active ? "page" : undefined}
                  className="flex items-center rounded-full transition-colors duration-300"
                >
                  {/*
                    The disc is the whole control at rest. Coral and lifted for
                    the page you are on, quiet navy for the rest — the same
                    treatment the reference gives its selected item.
                  */}
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-full transition-all duration-300 [transition-timing-function:var(--ease-out-expo)] ${
                      active
                        ? "bg-coral text-white shadow-[0_12px_26px_-10px_rgba(240,78,35,0.95)]"
                        : "bg-white/0 text-navy/70 hover:bg-white hover:text-coral hover:shadow-[0_12px_26px_-14px_rgba(8,29,56,0.5)]"
                    }`}
                  >
                    <ServiceIcon slug={s.slug} className="size-6" />
                  </span>

                  {/*
                    The name, revealed when the rail opens. `max-w` rather than
                    `width` so the label can size itself to the longest
                    translation instead of to a number picked by hand.
                  */}
                  <span
                    className={`max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold tracking-tight opacity-0 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:max-w-[230px] group-hover:pl-3 group-hover:pr-4 group-hover:opacity-100 group-focus-within:max-w-[230px] group-focus-within:pl-3 group-focus-within:pr-4 group-focus-within:opacity-100 ${
                      active ? "text-coral" : "text-paper"
                    }`}
                  >
                    {t(s.short)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Where you are in the run of four. */}
        <p
          aria-hidden
          className="mt-2 border-t border-paper/[0.08] pt-2 text-center font-mono text-[9px] tracking-[0.12em] text-soft"
        >
          {String(activeIndex + 1).padStart(2, "0")}/{String(services.length).padStart(2, "0")}
        </p>
      </div>
    </nav>
  );
}

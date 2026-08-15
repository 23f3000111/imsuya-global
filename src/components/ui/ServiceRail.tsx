"use client";

import Link from "next/link";
import { services } from "@/data/services";
import { ServiceIcon } from "./ServiceIcon";
import { useT } from "@/i18n";

/**
 * Fixed rail down the left edge of a service page, so you can jump straight
 * from one discipline to another without going back to the services list.
 * The service you are on burns orange; the rest sit navy at low opacity.
 */
export function ServiceRail({ activeSlug }: { activeSlug: string }) {
  const t = useT();

  return (
    <nav
      aria-label="Services"
      className="fixed left-2 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="flex flex-col gap-1 border border-paper/[0.08] bg-void/85 p-2 backdrop-blur-sm">
        {services.map((s) => {
          const active = s.slug === activeSlug;
          return (
            <li key={s.slug} className="group/rail relative">
              <Link
                href={`/services/${s.slug}`}
                aria-current={active ? "page" : undefined}
                className="flex items-center justify-center p-2"
              >
                <ServiceIcon
                  slug={s.slug}
                  className={`size-6 transition-all duration-300 ${
                    active
                      ? "text-coral opacity-100"
                      : "text-navy opacity-30 group-hover/rail:opacity-70"
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
    </nav>
  );
}

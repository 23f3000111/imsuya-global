"use client";

import Image from "next/image";
import { clients, logoBox } from "@/data/clients";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useLang } from "@/i18n";

const COPY = {
  en: {
    eyebrow: (n: string) => `Trusted by / ${n} brands`,
    line: "From Kuala Lumpur to Mombasa — brands we have designed, built and produced for.",
    list: "Brands Imsuya Global has worked with",
  },
  ms: {
    eyebrow: (n: string) => `Dipercayai oleh / ${n} jenama`,
    line: "Dari Kuala Lumpur ke Mombasa — jenama yang telah kami reka, bina dan hasilkan.",
    list: "Jenama yang pernah bekerja dengan Imsuya Global",
  },
};

/**
 * The logo band: every brand the studio has worked with, running as a slow
 * marquee. Logos sit in a darkened monochrome at rest so ten different
 * palettes read as one quiet row, and take their own colour back under the
 * pointer (see .client-logo).
 *
 * The list is rendered twice so the loop has no seam; the second copy is
 * hidden from assistive tech. Under reduced motion there is no loop at all —
 * a single copy wraps onto as many centred rows as it needs.
 */
export function ClientLogos({ className = "" }: { className?: string }) {
  const { lang } = useLang();
  const copy = COPY[lang];
  const count = String(clients.length).padStart(2, "0");

  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : copy.list}
      className={`flex shrink-0 items-center gap-14 pr-14 lg:gap-20 lg:pr-20 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-10 motion-reduce:pr-0 ${
        hidden ? "motion-reduce:hidden" : ""
      }`}
    >
      {clients.map((c) => {
        const box = logoBox(c);
        return (
          <li key={c.slug} className="flex shrink-0 items-center">
            <Image
              src={`/clients/${c.slug}.${c.ext ?? "png"}`}
              alt={hidden ? "" : c.name}
              width={box.width}
              height={box.height}
              sizes={`${box.width * 2}px`}
              className="client-logo object-contain"
              style={{ width: box.width, height: box.height }}
            />
          </li>
        );
      })}
    </ul>
  );

  return (
    <section className={`relative border-y border-paper/[0.07] bg-void py-12 lg:py-14 ${className}`}>
      <div className="mx-auto mb-9 flex max-w-[1600px] flex-col gap-3 px-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <Eyebrow variant="b">{copy.eyebrow(count)}</Eyebrow>
        <p className="max-w-md text-sm leading-relaxed text-muted">{copy.line}</p>
      </div>

      {/* Feathered at both ends so logos slide in and out rather than being
          cut off by the edge of the window. */}
      <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:[mask-image:none]">
        <div className="flex w-max motion-safe:animate-[marquee_48s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:justify-center motion-reduce:px-6">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}

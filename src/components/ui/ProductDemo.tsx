"use client";

import { useState } from "react";
import Image from "next/image";
import type { AiProduct } from "@/data/aiProducts";
import { useT } from "@/i18n";

const COPY = {
  en: { play: "Play the demo", live: "See it live", loading: "Loading demo…" },
  ms: { play: "Main demo", live: "Lihat secara langsung", loading: "Memuatkan demo…" },
};

/**
 * A shipped AI product, shown as the thing itself rather than as a claim: the
 * still of the running product, the recording of it working where we have one,
 * and a link straight to the live site so it can be checked.
 *
 * The recording is never fetched until it is asked for — these sit below the
 * fold and a pair of autoplaying videos would cost more than the page they are
 * on.
 */
export function ProductDemo({
  product,
  lang,
}: {
  product: AiProduct;
  lang: "en" | "ms";
}) {
  const t = useT();
  const [playing, setPlaying] = useState(false);
  const copy = COPY[lang];

  return (
    <article className="card group flex flex-col overflow-hidden border border-paper/[0.08] transition-colors duration-500 hover:border-coral/50">
      <div className="panel-navy relative aspect-[16/9] w-full overflow-hidden">
        {product.video && playing ? (
          <video
            src={product.video}
            poster={product.poster}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            {copy.loading}
          </video>
        ) : (
          <>
            {/* Contained, not cropped: the two captures have different
                proportions and the chatbot and the booking form both live at
                the edges, which is exactly what a cover crop cuts off. */}
            <Image
              src={product.poster}
              alt={`${product.name} — ${t(product.kind)} built by Imsuya Global`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
            {product.video ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-void/0 transition-colors duration-500 hover:bg-navy/25"
              >
                <span className="flex items-center gap-3 bg-coral px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black">
                  ▶ {copy.play}
                </span>
              </button>
            ) : (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-end justify-end p-5 opacity-0 transition-opacity duration-500 focus-visible:opacity-100 group-hover:opacity-100"
              >
                <span className="flex items-center gap-2 bg-coral px-5 py-3 text-xs font-bold uppercase tracking-wide text-black">
                  {copy.live} ↗
                </span>
              </a>
            )}
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 lg:p-8">
        <p className="text-eyebrow text-coral">{t(product.kind)}</p>
        <h3 className="text-display mt-3 text-2xl uppercase lg:text-3xl">{product.name}</h3>
        <p className="mt-4 text-sm leading-relaxed text-muted">{t(product.summary)}</p>

        <ul className="mt-6 flex flex-col gap-2">
          {product.highlights.map((h) => (
            <li key={h.en} className="flex items-start gap-3 text-sm text-muted">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 bg-coral" />
              {t(h)}
            </li>
          ))}
        </ul>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex w-fit items-center gap-3 border-b border-coral/40 pb-1 text-sm font-bold uppercase tracking-widest text-coral transition-colors duration-300 hover:border-coral"
        >
          {copy.live}
          <span className="sr-only"> — {product.name}</span>
          <span aria-hidden>↗</span>
        </a>
      </div>
    </article>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { merchandise } from "@/data/merchandise";
import { Reveal } from "@/components/ui/Reveal";
import { setScrollLocked } from "@/components/providers/SmoothScroll";
import { useT } from "@/i18n";

const COPY = {
  en: {
    open: "Open",
    close: "Close",
    prev: "Previous board",
    next: "Next board",
    produced: "What we produced",
    hint: "Click a board to open it at full size",
  },
  ms: {
    open: "Buka",
    close: "Tutup",
    prev: "Papan sebelumnya",
    next: "Papan seterusnya",
    produced: "Apa yang kami hasilkan",
    hint: "Klik papan untuk membukanya pada saiz penuh",
  },
} as const;

/**
 * The merchandise boards, and a lightbox that enlarges one with its
 * description beside it — the client's note was that the presentation boards
 * are unreadable at card size.
 *
 * The dialog is deliberately hand-rolled rather than a <dialog>: the site runs
 * Lenis smooth scrolling, and the native top layer scrolls the page behind it
 * on every wheel event. Escape, arrow keys, the scroll lock and a focus return
 * to the card that opened it are all wired up by hand for the same reason.
 *
 * It is also portalled to <body>. Rendered where it sits in the tree it lives
 * inside <main>, and the fixed navbar and the service rail paint straight over
 * the top of it.
 */
export function MerchandiseGallery({ lang }: { lang: "en" | "ms" }) {
  const t = useT();
  const copy = COPY[lang];
  const [open, setOpen] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const step = useCallback((delta: number) => {
    setOpen((i) => (i === null ? i : (i + delta + merchandise.length) % merchandise.length));
  }, []);

  useEffect(() => {
    if (open === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };

    // The page must not scroll underneath the overlay — both the document and
    // the smooth scroller that animates it.
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setScrollLocked(true);
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.documentElement.style.overflow = previous;
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  // Send focus back to the card that was opened, not to the top of the page.
  useEffect(() => {
    if (open === null) openerRef.current?.focus();
  }, [open]);

  const current = open === null ? null : { index: open, ...merchandise[open] };

  const dialog = current && (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.name}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-paper/85 p-4 backdrop-blur-sm lg:p-8"
      onClick={() => setOpen(null)}
    >
      <div
        className="relative flex max-h-full w-full max-w-[1500px] flex-col overflow-hidden bg-void shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)] lg:h-[min(88vh,900px)] lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* The board, as big as the window allows. */}
        <div className="panel-navy relative min-h-[42vh] flex-1 lg:min-h-0">
          <Image
            src={current.image}
            alt={`${current.name} merchandise designed by Imsuya Global`}
            fill
            sizes="(max-width: 1024px) 100vw, 68vw"
            className="object-contain"
            priority
          />
        </div>

        {/* The short description, on the right. */}
        <div className="flex shrink-0 flex-col overflow-y-auto border-t border-paper/[0.08] p-6 lg:w-[380px] lg:border-l lg:border-t-0 lg:p-9">
          <p className="text-eyebrow mb-4 text-coral">
            {String(current.index + 1).padStart(2, "0")} /{" "}
            {String(merchandise.length).padStart(2, "0")}
          </p>
          <h3 className="text-display text-2xl uppercase lg:text-3xl">{current.name}</h3>
          <p className="mt-2 font-mono text-xs tracking-[0.14em] text-soft">{t(current.kind)}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted lg:text-base">
            {t(current.blurb)}
          </p>

          <div className="mt-8 border-t border-paper/[0.08] pt-6">
            <p className="text-eyebrow mb-3 text-soft">{copy.produced}</p>
            <ul className="flex flex-col gap-2">
              {current.items.map((item) => (
                <li key={item.en} className="flex gap-3 text-sm text-muted">
                  <span aria-hidden className="mt-[7px] size-1.5 shrink-0 bg-coral" />
                  {t(item)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex items-center gap-2 pt-8">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={copy.prev}
              className="flex size-10 items-center justify-center border border-paper/15 text-lg transition-colors hover:border-coral hover:text-coral"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={copy.next}
              className="flex size-10 items-center justify-center border border-paper/15 text-lg transition-colors hover:border-coral hover:text-coral"
            >
              →
            </button>
          </div>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={() => setOpen(null)}
          aria-label={copy.close}
          className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center bg-void/90 text-xl text-paper shadow-lg transition-colors hover:bg-coral hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Reveal stagger={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {merchandise.map((m, i) => (
          <button
            key={m.name}
            type="button"
            onClick={(e) => {
              openerRef.current = e.currentTarget;
              setOpen(i);
            }}
            aria-haspopup="dialog"
            className="card group block overflow-hidden border border-paper/[0.08] text-left transition-colors duration-500 hover:border-coral/50"
            data-cursor
          >
            {/* Letterboxed, not cropped: these are full presentation boards
                and the edges carry the detail. */}
            <span className="panel-navy relative block aspect-[3/2] overflow-hidden">
              <Image
                src={m.image}
                alt={`${m.name} merchandise designed by Imsuya Global`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="bg-coral px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
                  {copy.open}
                </span>
              </span>
            </span>
            {/* Spans, not paragraphs: a button only takes phrasing content. */}
            <span className="block px-5 py-4">
              <span className="block text-base font-bold tracking-tight">{m.name}</span>
              <span className="block font-mono text-xs text-soft">{t(m.kind)}</span>
            </span>
          </button>
        ))}
      </Reveal>

      <p className="mt-5 font-mono text-[11px] tracking-[0.18em] text-soft">{copy.hint}</p>

      {/* `dialog` is null until a card is clicked, so document.body is only
          ever touched on the client. */}
      {dialog && createPortal(dialog, document.body)}
    </>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Generic scroll reveal. Children rise and fade in when the block enters the
 * viewport. Set `stagger` to cascade direct children instead of the wrapper.
 */
export function Reveal({
  children,
  className = "",
  stagger = 0,
  delay = 0,
  y = 48,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const targets = stagger > 0 ? Array.from(el.children) : el;
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          delay,
          stagger,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Headline reveal: each line rises out of an overflow-clipped mask, like a
 * curtain lift. Wrap each visual line in its own <RevealLines> child.
 */
export function RevealLines({
  lines,
  className = "",
  lineClassName = "",
  accent,
  accentLast = false,
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  /** Words inside `lines` to set in the brand coral. Matched whole word,
   *  case insensitively, ignoring surrounding punctuation. */
  accent?: string[];
  /**
   * Set the final word of the final line in the brand orange, by position
   * rather than by spelling. Word matching would light every copy of that
   * word in the headline; the client asked for the one it ends on.
   * Ignored when `accent` names words explicitly.
   */
  accentLast?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const wanted = accent?.length
    ? new Set(accent.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase()))
    : null;
  // Index of the last line that actually carries a word. A trailing empty
  // string would otherwise claim the accent and nothing would light up.
  const lastLine =
    accentLast && !wanted ? lines.reduce((last, l, i) => (l.trim() ? i : last), -1) : -1;

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current!.querySelectorAll(".line-inner"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref}>
      <Tag className={className}>
        {lines.map((line, i) => {
          // Only the lines that need per-word spans get split; the rest stay a
          // single text node so the reveal mask has nothing extra to composite.
          const split = Boolean(wanted) || i === lastLine;
          return (
            <span key={i} className="block overflow-hidden">
              {/* A real space between lines. They are block spans, so it never
                  shows — but without it the heading's text runs the lines
                  together ("AI Services& Programme") for search engines and
                  screen readers. */}
              {i > 0 ? " " : null}
              <span className={`line-inner block will-change-transform ${lineClassName}`}>
                {split
                  ? line.split(" ").map((word, w, all) => {
                      const bare = word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
                      const lit = wanted ? wanted.has(bare) : w === all.length - 1;
                      return (
                        <span key={w} className={lit ? "text-coral" : undefined}>
                          {word}
                          {w < all.length - 1 ? " " : ""}
                        </span>
                      );
                    })
                  : line}
              </span>
            </span>
          );
        })}
      </Tag>
    </div>
  );
}

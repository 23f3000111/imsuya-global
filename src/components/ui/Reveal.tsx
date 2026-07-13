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
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const ref = useRef<HTMLDivElement>(null);

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
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden">
            <span className={`line-inner block will-change-transform ${lineClassName}`}>{line}</span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

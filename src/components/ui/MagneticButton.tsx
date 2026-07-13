"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import gsap from "gsap";
import Link from "next/link";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "coral" | "ghost";
  className?: string;
  external?: boolean;
};

export function MagneticButton({ href, children, variant = "coral", className = "", external }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.3, y: y * 0.35, duration: 0.5, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  const styles =
    variant === "coral"
      ? "bg-coral text-black hover:bg-paper hover:text-void"
      : "border border-paper/25 text-paper hover:border-coral hover:text-coral";

  const inner = (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-wide uppercase transition-colors duration-300 ${styles} ${className}`}
    >
      {children}
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className="inline-block">
      {inner}
    </Link>
  );
}

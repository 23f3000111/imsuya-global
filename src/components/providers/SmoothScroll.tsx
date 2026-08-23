"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Held at module scope so the nav can jump the page home without threading a
// context through every layer.
let instance: Lenis | null = null;

/**
 * Freeze and release the smooth scroller. An overlay that hides the page
 * behind it has to stop Lenis as well as the document: `overflow: hidden` on
 * <html> does not reach a scroller that is animating the page itself.
 */
export function setScrollLocked(locked: boolean) {
  if (!instance) return;
  if (locked) instance.stop();
  else instance.start();
}

/** Snap to the very top. Used by the HOME button and on route changes. */
export function scrollToTop(immediate = true) {
  if (instance) {
    instance.scrollTo(0, { immediate });
    return;
  }
  window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return <>{children}</>;
}

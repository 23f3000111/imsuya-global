"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToTop } from "./SmoothScroll";

/**
 * Every route lands at the top.
 *
 * Next only scrolls up when it judges the incoming page to be out of view, and
 * Lenis owns the scroll position regardless — so a link clicked from halfway
 * down one page used to drop you halfway down the next. The HOME button and the
 * logo were each patching this by hand; this puts it in one place for every
 * link, button and programmatic push on the site.
 */
export function ScrollReset() {
  useEffect(() => {
    // Otherwise the browser re-applies a remembered offset after we have
    // already gone home, on reload and on back/forward alike.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    // A hash target owns the scroll position: /contact#faq still lands on the
    // FAQ rather than at the top of the page.
    if (window.location.hash) return;
    scrollToTop();
  }, [pathname]);

  return null;
}

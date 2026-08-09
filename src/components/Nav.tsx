"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LangToggle } from "./LangToggle";
import { useLang } from "@/i18n";

const LINKS = {
  en: [
    { href: "/portfolio", label: "Work" },
    { href: "/services", label: "Services" },
    { href: "/team", label: "Team" },
    { href: "/contact", label: "Contact" },
  ],
  ms: [
    { href: "/portfolio", label: "Kerja" },
    { href: "/services", label: "Perkhidmatan" },
    { href: "/team", label: "Pasukan" },
    { href: "/contact", label: "Hubungi" },
  ],
};

const CTA = { en: "Start a project", ms: "Mulakan projek" };

const TAGLINE = {
  en: "Creative Digital Design and Smart Website Development Boutique Studio",
  ms: "Studio Butik Reka Bentuk Digital Kreatif dan Pembangunan Laman Web Pintar",
};

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { lang } = useLang();
  const links = LINKS[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 ${
          scrolled && !open
            ? "border-b border-paper/[0.06] bg-void/80 shadow-[0_10px_40px_-20px_rgba(30,40,82,0.2)] backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[80px] max-w-[1600px] items-center justify-between px-6 lg:h-[96px] lg:px-12">
          <Link
            href="/"
            className="flex flex-col justify-center gap-1.5"
            aria-label="Imsuya Global"
          >
            <Image
              src="/brand/logo.png"
              alt="Imsuya Global"
              width={240}
              height={54}
              priority
              className="h-9 w-auto lg:h-[42px]"
            />
            <span className="hidden font-mono text-[9px] font-medium leading-none tracking-[0.1em] text-soft xl:block">
              {TAGLINE[lang]}
            </span>
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-eyebrow transition-colors duration-300 hover:text-coral ${
                  pathname.startsWith(l.href) ? "text-coral" : "text-muted"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <LangToggle />
            <Link
              href="/contact"
              className="border border-paper/20 px-5 py-2.5 text-eyebrow text-paper transition-all duration-300 hover:border-coral hover:bg-coral hover:text-black"
            >
              {CTA[lang]}
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className={`h-px w-6 bg-paper transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-paper transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[99] flex flex-col justify-center bg-void px-8 lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={l.href} className="text-display block py-3 text-5xl uppercase">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mt-8 flex items-center gap-8"
              >
                <Link
                  href="/contact"
                  className="bg-coral px-8 py-4 text-sm font-bold uppercase tracking-wide text-black"
                >
                  {CTA[lang]}
                </Link>
                <LangToggle />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-10 max-w-xs font-mono text-[10px] leading-relaxed tracking-[0.1em] text-soft"
              >
                {TAGLINE[lang]}
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

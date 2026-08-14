"use client";

import Link from "next/link";
import Image from "next/image";
import { site, socials, office, whatsappLink } from "@/data/site";
import { FaqList } from "@/components/ui/FaqList";
import { scrollToTop } from "./providers/SmoothScroll";
import { useLang } from "@/i18n";

const COPY = {
  en: {
    tagline: "Digital transformation partners.",
    whatsapp: "Hi Imsuya Global, I'd like to talk about a project.",
    menu: "Menu",
    faqLabel: "Questions we get asked",
    faqAll: "Read all the answers",
    followLabel: "Follow",
    visitLabel: "Visit us",
    links: [
      { href: "/", label: "Home" },
      { href: "/portfolio", label: "Work" },
      { href: "/services", label: "Services" },
      { href: "/team", label: "Team" },
      { href: "/contact", label: "Contact" },
    ],
    rights: "All rights reserved.",
    strap: "Creative Digital Design & Smart Website Development Studio",
  },
  ms: {
    tagline: "Rakan transformasi digital.",
    whatsapp: "Hai Imsuya Global, saya ingin berbincang tentang satu projek.",
    menu: "Menu",
    faqLabel: "Soalan yang sering ditanya",
    faqAll: "Baca semua jawapan",
    followLabel: "Ikuti",
    visitLabel: "Lawati kami",
    links: [
      { href: "/", label: "Laman Utama" },
      { href: "/portfolio", label: "Kerja" },
      { href: "/services", label: "Perkhidmatan" },
      { href: "/team", label: "Pasukan" },
      { href: "/contact", label: "Hubungi" },
    ],
    rights: "Hak cipta terpelihara.",
    strap: "Studio Reka Bentuk Digital Kreatif & Pembangunan Laman Web Pintar",
  },
};

export function Footer() {
  const { lang } = useLang();
  const copy = COPY[lang];

  return (
    <footer className="relative overflow-hidden border-t border-paper/[0.06] bg-void">
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Image
              src="/brand/logo.png"
              alt="Imsuya Global"
              width={450}
              height={100}
              className="mb-7 h-9 w-auto"
            />
            <p className="text-display max-w-sm text-2xl uppercase lg:text-3xl">{copy.tagline}</p>

            <div className="mt-7 flex flex-col gap-2 font-mono text-sm text-muted">
              <a href={`mailto:${site.email}`} className="w-fit transition-colors hover:text-coral">
                {site.email}
              </a>
              <a
                href={whatsappLink(copy.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition-colors hover:text-coral"
              >
                WhatsApp {site.whatsappDisplay} ↗
              </a>
            </div>

            <p className="text-eyebrow mb-3 mt-8 text-soft">{copy.visitLabel}</p>
            <address className="not-italic font-mono text-xs leading-relaxed text-muted">
              {office.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>

            <p className="text-eyebrow mb-3 mt-8 text-soft">{copy.followLabel}</p>
            <ul className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex border border-paper/15 px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-muted transition-colors duration-300 hover:border-coral hover:text-coral"
                  >
                    {s.name.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/*
            The old Services column repeated the Services page link by link, so
            it went. Menu is the only navigation the footer needs.
          */}
          <div className="lg:col-span-3">
            <p className="text-eyebrow mb-6 text-soft">{copy.menu}</p>
            <ul className="flex flex-col gap-3 text-sm text-paper/70">
              {copy.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={l.href === "/" ? () => scrollToTop() : undefined}
                    className="transition-colors hover:text-coral"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <p className="text-eyebrow mb-4 text-soft">{copy.faqLabel}</p>
            <FaqList limit={4} />
            <Link
              href="/contact#faq"
              className="mt-5 inline-flex items-center gap-3 font-mono text-xs tracking-[0.15em] text-coral transition-opacity hover:opacity-70"
            >
              {copy.faqAll.toUpperCase()}
              <span className="inline-block size-1.5 bg-coral" />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-paper/[0.06] pt-7 font-mono text-xs text-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Imsuya Global. {copy.rights}
          </p>
          <p>{copy.strap}</p>
        </div>
      </div>

      {/*
        Giant ghost wordmark. textLength pins it to the viewBox width, so the
        final L can never fall off the edge whatever the viewport does.
      */}
      <svg
        aria-hidden
        viewBox="0 0 1000 108"
        preserveAspectRatio="xMidYMax meet"
        className="ghost-text pointer-events-none relative z-0 block w-full select-none"
      >
        <text
          x="0"
          y="100"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fill="currentColor"
          style={{
            fontFamily: "var(--font-satoshi), system-ui, sans-serif",
            fontSize: "116px",
            fontWeight: 900,
          }}
        >
          IMSUYA GLOBAL
        </text>
      </svg>
    </footer>
  );
}

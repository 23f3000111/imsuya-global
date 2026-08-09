"use client";

import Link from "next/link";
import Image from "next/image";
import { site, whatsappLink } from "@/data/site";
import { services } from "@/data/services";
import { useLang, useT } from "@/i18n";

const COPY = {
  en: {
    tagline: "Digital transformation partners.",
    whatsapp: "Hi Imsuya Global, I'd like to talk about a project.",
    menu: "Menu",
    servicesLabel: "Services",
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
    servicesLabel: "Perkhidmatan",
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
  const t = useT();
  const copy = COPY[lang];

  return (
    <footer className="relative overflow-hidden border-t border-paper/[0.06] bg-void">
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-20 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Image
              src="/brand/logo.png"
              alt="Imsuya Global"
              width={200}
              height={45}
              className="mb-8 h-9 w-auto"
            />
            <p className="text-display max-w-sm text-3xl uppercase">{copy.tagline}</p>
            <div className="mt-8 flex flex-col gap-2 font-mono text-sm text-muted">
              <a href={`mailto:${site.email}`} className="w-fit transition-colors hover:text-coral">
                {site.email}
              </a>
              <a
                href={whatsappLink(copy.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit transition-colors hover:text-coral"
              >
                WhatsApp ↗
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-eyebrow mb-6 text-soft">{copy.menu}</p>
            <ul className="flex flex-col gap-3 text-sm text-paper/70">
              {copy.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-coral">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-eyebrow mb-6 text-soft">{copy.servicesLabel}</p>
            <ul className="grid grid-cols-1 gap-3 text-sm text-paper/70 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="transition-colors hover:text-coral">
                    {t(s.short)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-paper/[0.06] pt-8 font-mono text-xs text-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Imsuya Global. {copy.rights}
          </p>
          <p>{copy.strap}</p>
        </div>
      </div>

      {/* Giant ghost wordmark — decorative, below content */}
      <p
        aria-hidden
        className="ghost-text text-display pointer-events-none relative z-0 select-none whitespace-nowrap text-center text-[13.5vw] leading-none"
      >
        IMSUYA GLOBAL
      </p>
    </footer>
  );
}

"use client";

import dynamic from "next/dynamic";
import { PageHero } from "@/components/ui/PageHero";
import { ConversationalForm } from "@/components/contact/ConversationalForm";
import { FaqList } from "@/components/ui/FaqList";
import { site, socials, office, whatsappLink } from "@/data/site";
import { SOCIAL_ICONS, WhatsAppIcon, MailIcon } from "@/components/ui/Icons";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useLang } from "@/i18n";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false }
);

// WebGL, and several kilobytes of baked land data: client only, and only on
// this page. The placeholder holds the square so nothing jumps when it lands.
const Globe = dynamic(() => import("@/components/three/Globe").then((m) => m.Globe), {
  ssr: false,
  loading: () => <div className="aspect-square w-full" />,
});

const COPY = {
  en: {
    eyebrow: "Contact / replies within 1 business day",
    lines: ["Tell us what", "you're building."],
    intro: "Four questions, sixty seconds. Your brief lands directly on our phone.",
    direct: "Prefer it direct?",
    whatsapp: "WhatsApp us",
    email: "Email us",
    waMessage: "Hi Imsuya Global, I'd like to talk about a project.",
    location: "Kuala Lumpur, working worldwide",
    hours: "Monday to Friday, 9am to 6pm MYT",
    followLabel: "Find us online",
    mapEyebrow: "The studio / find us",
    mapHeading: "Come and say hello.",
    mapTitle: "Map to the Imsuya Global office in Damansara Perdana",
    directions: "Open in Google Maps ↗",
    faqEyebrow: "Questions / answered",
    faqHeading: "Everything clients ask before we start.",
    outro: "We build digital futures.",
    globeHq: "Kuala Lumpur · HQ",
    globeReach: "Where our work runs",
    globeHint: "Drag to spin",
  },
  ms: {
    eyebrow: "Hubungi / balasan dalam 1 hari bekerja",
    lines: ["Ceritakan apa", "yang anda bina."],
    intro: "Empat soalan, enam puluh saat. Brief anda terus sampai ke telefon kami.",
    direct: "Mahu terus berhubung?",
    whatsapp: "WhatsApp kami",
    email: "Emel kami",
    waMessage: "Hai Imsuya Global, saya ingin berbincang tentang satu projek.",
    location: "Kuala Lumpur, bekerja di seluruh dunia",
    hours: "Isnin hingga Jumaat, 9 pagi hingga 6 petang MYT",
    followLabel: "Cari kami di talian",
    mapEyebrow: "Studio / cari kami",
    mapHeading: "Datang dan sapa kami.",
    mapTitle: "Peta ke pejabat Imsuya Global di Damansara Perdana",
    directions: "Buka dalam Google Maps ↗",
    faqEyebrow: "Soalan / dijawab",
    faqHeading: "Semua yang pelanggan tanya sebelum kami mula.",
    outro: "Kami bina masa depan digital.",
    globeHq: "Kuala Lumpur · Ibu pejabat",
    globeReach: "Di mana kerja kami berjalan",
    globeHint: "Seret untuk pusing",
  },
};

export function ContactBody() {
  const { lang } = useLang();
  const copy = COPY[lang];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        lines={copy.lines}
        intro={copy.intro}
        visual={
          <div className="w-full max-w-[560px]">
            <Globe />
            {/* The key, and the one instruction the globe needs. */}
            <p className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
              <span className="flex items-center gap-2">
                <span aria-hidden className="block size-2 bg-coral" />
                {copy.globeHq}
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden className="block h-px w-5 bg-coral/60" />
                {copy.globeReach}
              </span>
              <span className="text-paper/40">{copy.globeHint}</span>
            </p>
          </div>
        }
      />

      <section className="bg-void px-6 pb-20 lg:px-12 lg:pb-24">
        <div className="relative z-10 mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ConversationalForm />
          </div>

          <aside className="flex flex-col gap-10 lg:col-span-4">
            <div>
              <Eyebrow variant="b" className="mb-5">
                {copy.direct}
              </Eyebrow>
              <div className="flex flex-col gap-3">
                <a
                  href={whatsappLink(copy.waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group flex items-center justify-between gap-4 border border-paper/15 px-6 py-5 transition-colors duration-300 hover:border-coral"
                >
                  <span className="flex items-center gap-3.5">
                    <WhatsAppIcon className="size-5 text-[#25D366]" />
                    <span className="text-sm font-bold uppercase tracking-widest">
                      {copy.whatsapp}
                    </span>
                  </span>
                  <span className="text-coral transition-transform duration-300 group-hover:translate-x-1">↗</span>
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="card group flex items-center justify-between gap-4 border border-paper/15 px-6 py-5 transition-colors duration-300 hover:border-coral"
                >
                  <span className="flex items-center gap-3.5">
                    <MailIcon className="size-5 text-navy" />
                    <span className="text-sm font-bold uppercase tracking-widest">
                      {copy.email}
                    </span>
                  </span>
                  <span className="text-coral transition-transform duration-300 group-hover:translate-x-1">↗</span>
                </a>
              </div>
            </div>

            <div>
              <Eyebrow variant="c" className="mb-5">
                {copy.followLabel}
              </Eyebrow>
              <ul className="flex flex-wrap gap-3">
                {socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.name];
                  return (
                    <li key={s.name}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 border border-paper/15 px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] text-muted transition-colors duration-300 hover:border-coral hover:text-coral"
                      >
                        {Icon && <Icon className="size-3.5" />}
                        {s.name.toUpperCase()}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-paper/[0.08] pt-8 font-mono text-xs leading-loose text-soft">
              <p>{site.email}</p>
              <p>{site.whatsappDisplay}</p>
              <address className="not-italic">
                {office.lines.map((line) => (
                  <span key={line} className="mt-1 block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-3">{copy.location}</p>
              <p className="mt-1">{copy.hours}</p>
            </div>
          </aside>
        </div>
      </section>

      {/* --- the office, on the map --- */}
      <section className="border-t border-paper/[0.06] bg-void px-6 py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1600px]">
          <Eyebrow variant="a" className="mb-4">
            {copy.mapEyebrow}
          </Eyebrow>
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="text-display text-3xl uppercase lg:text-5xl">{copy.mapHeading}</h2>
            <address className="not-italic font-mono text-xs leading-relaxed text-muted">
              {office.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <div className="card relative aspect-[16/10] w-full overflow-hidden border border-paper/[0.1] lg:aspect-[21/8]">
            <iframe
              src={office.mapEmbed}
              title={copy.mapTitle}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </section>

      {/* --- standing questions --- */}
      <section
        id="faq"
        className="scroll-mt-32 border-t border-paper/[0.06] bg-void px-6 py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow variant="d" className="mb-4">
              {copy.faqEyebrow}
            </Eyebrow>
            <h2 className="text-display max-w-md text-3xl uppercase lg:text-5xl">
              {copy.faqHeading}
            </h2>
          </div>
          <div className="lg:col-span-7">
            {/* Cost, timeline, ownership, what happens after launch. The
                "what do you actually do" set lives on /services, so the two
                pages never carry the same FAQ rich result. */}
            <FaqList topic="engagement" />
          </div>
        </div>
      </section>

      {/*
        Closing band: the brand pixel network in three dimensions, drifting
        under the wordmark. It runs edge to edge across the whole band rather
        than fading into a vignette, and a click anywhere on it blows the
        pixels apart from the point you hit. Decorative only, so it is hidden
        from assistive tech.
      */}
      <section className="panel-navy relative h-[42vh] min-h-[280px] overflow-hidden border-t border-paper/[0.06]">
        <ParticleField tone="dark" coverage="full" />
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <p className="text-display text-center text-[clamp(1.5rem,4vw,3.4rem)] uppercase text-white/90 [text-shadow:0_2px_24px_rgba(11,17,40,0.85)]">
            {copy.outro}
          </p>
        </div>
      </section>
    </>
  );
}

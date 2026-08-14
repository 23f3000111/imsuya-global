"use client";

import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLang } from "@/i18n";
import type { L10n } from "@/i18n/types";

// Running order set by the client: Founder, then CTO, then Director.
const MEMBERS: {
  name: string;
  role: L10n;
  focus: L10n;
  years: L10n;
  image: string;
  position: string;
  bio: L10n;
}[] = [
  {
    name: "Imran",
    role: { en: "Founder", ms: "Pengasas" },
    focus: { en: "Vision & Strategy", ms: "Visi & Strategi" },
    years: { en: "16 years in the creative industry", ms: "16 tahun dalam industri kreatif" },
    image: "/team/founder.jpg",
    position: "object-[50%_25%]",
    bio: {
      en: "Sixteen years in the creative industry, known for the strategic vision behind every engagement. Imran sets the direction: which businesses we partner with, what we build for them, and the standard every project has to clear before it ships. He stays close to the work, so the person shaping your strategy is the same person you brief on day one.",
      ms: "Enam belas tahun dalam industri kreatif, dikenali dengan visi strategik di sebalik setiap projek. Imran menetapkan hala tuju: perniagaan mana kami jadikan rakan, apa yang kami bina untuk mereka, dan piawaian yang mesti dicapai setiap projek sebelum dilancarkan. Beliau sentiasa rapat dengan kerja, jadi orang yang membentuk strategi anda adalah orang yang sama yang anda hubungi pada hari pertama.",
    },
  },
  {
    name: "Rishikesh",
    role: { en: "CTO", ms: "CTO" },
    focus: { en: "Engineering & Systems", ms: "Kejuruteraan & Sistem" },
    years: { en: "9 years in IT and project management", ms: "9 tahun dalam IT dan pengurusan projek" },
    image: "/team/developer.png",
    position: "object-[50%_15%]",
    bio: {
      en: "Nine years as an IT expert in project management, having run multiple technical campaigns from brief to launch. Rishikesh turns ambition into working software: websites, platforms and AI systems engineered to hold up long after launch day. Architecture, security and delivery timelines are his call, and the reason our builds scale instead of stall.",
      ms: "Sembilan tahun sebagai pakar IT dalam pengurusan projek, setelah mengendalikan pelbagai kempen teknikal dari taklimat sehingga pelancaran. Rishikesh menukar cita cita kepada perisian yang berfungsi: laman web, platform dan sistem AI yang kekal kukuh lama selepas hari pelancaran. Seni bina, keselamatan dan garis masa penyampaian adalah tanggungjawab beliau, dan sebab binaan kami berkembang dan bukan tersekat.",
    },
  },
  {
    name: "Sumaiya",
    role: { en: "Director", ms: "Pengarah" },
    focus: { en: "Operations & Delivery", ms: "Operasi & Penyampaian" },
    years: {
      en: "8 years in corporate administration",
      ms: "8 tahun dalam pentadbiran korporat",
    },
    image: "/team/director.png",
    position: "object-[50%_15%]",
    bio: {
      en: "Eight years of experience in corporate administration and the daily task flows that keep delivery moving. Sumaiya owns the promise: scopes, timelines and communication are the reason clients always know what is happening and when it lands. Nothing slips, because she is already tracking it before anyone has to ask.",
      ms: "Lapan tahun pengalaman dalam pentadbiran korporat dan aliran tugas harian yang memastikan penyampaian bergerak. Sumaiya memegang janji: skop, garis masa dan komunikasi adalah sebab pelanggan sentiasa tahu apa yang berlaku dan bila ia siap. Tiada apa yang terlepas, kerana beliau sudah menjejakinya sebelum sesiapa perlu bertanya.",
    },
  },
];

const COPY = {
  en: {
    eyebrow: "The team / 03 people",
    lines: ["People you can", "actually reach."],
    intro:
      "No account managers between you and the people doing the work. When you work with Imsuya Global, you work with us directly.",
    want: "Want us on your project?",
    cta: "Work with the team",
  },
  ms: {
    eyebrow: "Pasukan / 03 insan",
    lines: ["Insan yang benar benar", "boleh dihubungi."],
    intro:
      "Tiada pengurus akaun antara anda dan orang yang membuat kerja. Bila anda bekerja dengan Imsuya Global, anda bekerja terus dengan kami.",
    want: "Mahu kami dalam projek anda?",
    cta: "Bekerja dengan pasukan",
  },
};

export function TeamBody() {
  const { lang } = useLang();
  const copy = COPY[lang];

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} lines={copy.lines} intro={copy.intro} />

      <section className="bg-void px-6 pb-20 lg:px-12 lg:pb-24">
        <div className="relative z-10 mx-auto max-w-[1600px]">
          {MEMBERS.map((m, i) => (
            <Reveal
              key={m.name}
              className="border-t border-paper/[0.08] py-12 last:border-b lg:py-14"
            >
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                <div className={`lg:col-span-4 ${i % 2 === 1 ? "lg:order-2 lg:col-start-9" : ""}`}>
                  <div className="img-veil card relative aspect-[4/5] w-full max-w-[340px] overflow-hidden border border-paper/[0.1]">
                    <Image
                      src={m.image}
                      alt={`${m.name}, ${m.role[lang]} of Imsuya Global`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 340px"
                      className={`img-cinematic object-cover ${m.position}`}
                    />
                    {/* pixel corner accent */}
                    <span className="absolute right-4 top-4 z-10 grid grid-cols-2 gap-1">
                      {[0, 1, 2].map((n) => (
                        <span key={n} className={`size-1.5 ${n === 0 ? "bg-coral" : "bg-white/40"}`} />
                      ))}
                    </span>
                  </div>
                </div>
                <div
                  className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1 lg:col-start-1" : "lg:col-start-6"}`}
                >
                  <Eyebrow className="mb-5">{`0${i + 1} / ${m.focus[lang]}`}</Eyebrow>
                  <h2 className="text-display text-3xl uppercase lg:text-5xl">{m.name}</h2>
                  <p className="mt-3 font-mono text-xs tracking-[0.2em] text-coral">
                    {m.role[lang].toUpperCase()} · {m.years[lang]}
                  </p>
                  <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
                    {m.bio[lang]}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}

          <div className="mt-16 text-center lg:mt-20">
            <p className="text-eyebrow mb-6 text-soft">{copy.want}</p>
            <MagneticButton href="/contact">{copy.cta}</MagneticButton>
          </div>
        </div>
      </section>
    </>
  );
}

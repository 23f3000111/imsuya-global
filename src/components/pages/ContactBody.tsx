"use client";

import { PageHero } from "@/components/ui/PageHero";
import { ConversationalForm } from "@/components/contact/ConversationalForm";
import { site, whatsappLink } from "@/data/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useLang } from "@/i18n";

const COPY = {
  en: {
    eyebrow: "Contact — replies within 1 business day",
    lines: ["Tell us what", "you're building."],
    intro: "Four questions, sixty seconds. Your brief lands directly on our phone.",
    direct: "Prefer it direct?",
    whatsapp: "WhatsApp us",
    email: "Email us",
    waMessage: "Hi Imsuya Global — I'd like to talk about a project.",
    location: "Kuala Lumpur — working worldwide",
    hours: "Mon–Fri, 9am–6pm MYT",
  },
  ms: {
    eyebrow: "Hubungi — balasan dalam 1 hari bekerja",
    lines: ["Ceritakan apa", "yang anda bina."],
    intro: "Empat soalan, enam puluh saat. Brief anda terus sampai ke telefon kami.",
    direct: "Mahu terus berhubung?",
    whatsapp: "WhatsApp kami",
    email: "E-mel kami",
    waMessage: "Hai Imsuya Global — saya ingin berbincang tentang satu projek.",
    location: "Kuala Lumpur — bekerja di seluruh dunia",
    hours: "Isnin–Jumaat, 9 pagi–6 petang MYT",
  },
};

export function ContactBody() {
  const { lang } = useLang();
  const copy = COPY[lang];

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} lines={copy.lines} intro={copy.intro} />

      <section className="bg-void px-6 pb-32 lg:px-12">
        <div className="relative z-10 mx-auto grid max-w-[1600px] gap-20 lg:grid-cols-12">
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
                  className="card group flex items-center justify-between border border-paper/15 px-6 py-5 transition-colors duration-300 hover:border-coral"
                >
                  <span className="text-sm font-bold uppercase tracking-widest">{copy.whatsapp}</span>
                  <span className="text-coral transition-transform duration-300 group-hover:translate-x-1">↗</span>
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="card group flex items-center justify-between border border-paper/15 px-6 py-5 transition-colors duration-300 hover:border-coral"
                >
                  <span className="text-sm font-bold uppercase tracking-widest">{copy.email}</span>
                  <span className="text-coral transition-transform duration-300 group-hover:translate-x-1">↗</span>
                </a>
              </div>
            </div>

            <div className="border-t border-paper/[0.08] pt-8 font-mono text-xs leading-loose text-soft">
              <p>{site.email}</p>
              <p className="mt-1">{copy.location}</p>
              <p className="mt-1">{copy.hours}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

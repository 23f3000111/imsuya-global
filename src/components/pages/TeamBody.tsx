"use client";

import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { CubeAssembly } from "@/components/ui/Cubes";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLang } from "@/i18n";
import { team } from "@/data/team";



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
      <PageHero
        eyebrow={copy.eyebrow}
        lines={copy.lines}
        intro={copy.intro}
        visual={<CubeAssembly className="w-full" />}
      />

      <section className="bg-void px-6 pb-20 lg:px-12 lg:pb-24">
        <div className="relative z-10 mx-auto max-w-[1600px]">
          {team.map((m, i) => (
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

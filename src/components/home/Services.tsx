"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { services, serviceImage, serviceAccent } from "@/data/services";
import { PixelGlyph } from "@/components/ui/PixelGlyph";
import { useLang, useT } from "@/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COPY = {
  en: {
    eyebrow: "What we do / 002",
    heading: "Nine disciplines.",
    headingSoft: "One team.",
    cue: "Scroll to explore →",
    explore: "Explore",
    of: "of",
  },
  ms: {
    eyebrow: "Apa kami buat / 002",
    heading: "Sembilan disiplin.",
    headingSoft: "Satu pasukan.",
    cue: "Skrol untuk terokai →",
    explore: "Terokai",
    of: "daripada",
  },
};

/**
 * Renders a heading with the service's key words in the brand orange.
 * An ampersand is bound to the word that follows it, so a heading can never
 * wrap with a lone "&" left hanging at the end of a line.
 */
function AccentTitle({ text, accent }: { text: string; accent: string[] }) {
  const wanted = new Set(accent.map((w) => w.toLowerCase()));
  const words = text.split(" ");

  const groups: string[][] = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i] === "&" && words[i + 1]) {
      groups.push([words[i], words[i + 1]]);
      i++;
    } else {
      groups.push([words[i]]);
    }
  }

  return (
    <>
      {groups.map((group, gi) => (
        <span key={gi} className="whitespace-nowrap">
          {group.map((word, wi) => {
            const bare = word.replace(/[^\p{L}]/gu, "").toLowerCase();
            return (
              <span key={wi} className={wanted.has(bare) ? "text-coral" : undefined}>
                {word}
                {wi < group.length - 1 ? " " : ""}
              </span>
            );
          })}
          {gi < groups.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const t = useT();
  const copy = COPY[lang];
  const total = String(services.length).padStart(2, "0");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const getDistance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        // Progress bar synced to the horizontal journey.
        gsap.fromTo(
          ".services-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${getDistance()}`,
              scrub: 0.7,
            },
          }
        );

        // Each panel's copy lifts in as the panel reaches the middle of the
        // viewport, so the information arrives with the panel rather than
        // having already played off screen.
        gsap.utils.toArray<HTMLElement>(".panel-copy").forEach((copyBlock) => {
          gsap.fromTo(
            copyBlock.children,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.06,
              ease: "expo.out",
              scrollTrigger: {
                trigger: copyBlock,
                containerAnimation: tween,
                start: "left 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // Visuals drift gently against the horizontal motion.
        gsap.utils.toArray<HTMLElement>(".panel-visual").forEach((visual) => {
          gsap.fromTo(
            visual,
            { xPercent: 4 },
            {
              xPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: visual,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section
      ref={sectionRef}
      className="panel-navy relative overflow-hidden text-white lg:flex lg:h-screen lg:flex-col"
    >
      {/*
        Header sits in flow so panels can never collide with it. The section
        pins to the top of the window, so it also has to clear the fixed navbar
        (96px on desktop) or the heading slides underneath it. The track below
        takes the rest of the height, which is what centres each panel with
        equal space above and below.
      */}
      <div className="relative z-20 mx-auto w-full max-w-[1600px] shrink-0 px-6 pt-24 lg:flex lg:items-end lg:px-12 lg:pt-0">
        <div className="flex w-full items-end justify-between lg:h-[172px] lg:pb-5 lg:pt-[96px]">
          <div>
            <p className="text-eyebrow mb-4 flex items-center gap-3 text-coral">
              <PixelGlyph variant="b" />
              {copy.eyebrow}
            </p>
            <h2 className="text-display text-3xl uppercase lg:text-5xl">
              {copy.heading} <span className="text-white/40">{copy.headingSoft}</span>
            </h2>
          </div>
          <p className="text-eyebrow hidden text-white/45 lg:block">{copy.cue}</p>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex flex-col lg:h-full lg:w-max lg:flex-row lg:items-stretch"
      >
        {services.map((s, i) => (
          <article
            key={s.slug}
            className={`panel-grid relative flex h-full w-full flex-col justify-center gap-10 border-b border-white/10 px-6 py-16 lg:w-[78vw] lg:flex-row lg:items-center lg:gap-[3vw] lg:border-b-0 lg:border-r-2 lg:border-r-white/15 lg:px-[4vw] lg:py-10 ${
              i % 2 === 0 ? "panel-navy" : "panel-navy-alt"
            }`}
          >
            {/* The running number, moved off the image to the top of the panel */}
            <span
              aria-hidden
              className="pointer-events-none absolute right-[4vw] top-8 z-[2] hidden font-mono text-[11px] tracking-[0.3em] text-white/35 lg:block"
            >
              {s.index} / {total}
            </span>

            {/* copy column — always the first thing that reaches the eye */}
            <div className="panel-copy relative z-10 flex-1 lg:max-w-[36vw]">
              <p className="text-eyebrow mb-5 text-coral">
                {s.index} / {t(s.short)}
              </p>
              <h3 className="text-display text-[clamp(1.6rem,2.7vw,2.7rem)] uppercase">
                <AccentTitle
                  text={t(s.title)}
                  accent={serviceAccent[s.slug]?.[lang] ?? []}
                />
              </h3>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 lg:text-lg">
                {t(s.tagline)}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {s.features.slice(0, 4).map((f) => (
                  <span
                    key={f.name.en}
                    className="border border-white/20 px-3.5 py-1.5 font-mono text-[11px] text-white/75"
                  >
                    {t(f.name)}
                  </span>
                ))}
              </div>
              <Link
                href={`/services/${s.slug}`}
                className="group mt-9 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-coral"
              >
                {copy.explore}
                <span className="inline-block size-2 bg-coral transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>

            {/*
              Bigger, and dissolved into the navy at its edges rather than sat
              in a hard frame. Previously the framed box read as an image
              hanging on the panel instead of belonging to it.
            */}
            <div className="panel-visual relative z-[1] w-full lg:w-[36vw]">
              <div className="panel-image relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={serviceImage(s.slug)}
                  alt={`${t(s.title)} · Imsuya Global`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="img-cinematic object-cover"
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* progress bar */}
      <div className="absolute bottom-0 left-0 z-20 hidden h-px w-full bg-white/15 lg:block">
        <div className="services-progress h-full w-full origin-left bg-coral" />
      </div>
    </section>
  );
}

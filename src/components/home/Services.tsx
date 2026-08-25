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
    heading: "Four disciplines.",
    headingSoft: "One team.",
    cue: "Scroll to explore →",
    explore: "Explore",
    of: "of",
  },
  ms: {
    eyebrow: "Apa kami buat / 002",
    heading: "Empat disiplin.",
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
        <span key={gi}>
          {/*
            The separating space between groups lives *outside* the nowrap
            span. While it was inside, every space in the heading became
            unbreakable, so the whole title was one atomic line that overflowed
            its column and ran across the panel image beside it.
          */}
          <span className="whitespace-nowrap">
          {group.map((word, wi) => {
            const bare = word.replace(/[^\p{L}]/gu, "").toLowerCase();
            return (
              <span key={wi} className={wanted.has(bare) ? "text-coral" : undefined}>
                {word}
                {wi < group.length - 1 ? " " : ""}
              </span>
            );
          })}
          </span>
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
        //
        // The first panel is deliberately left alone. Its left edge is already
        // at the left of the window the moment the section pins, so "left 85%"
        // is a threshold it can only cross going backwards — the trigger never
        // fired and the copy sat at opacity 0, which meant the section took
        // over the screen showing a panel with no words on it.
        gsap.utils.toArray<HTMLElement>(".panel-copy").forEach((copyBlock, i) => {
          if (i === 0) return;
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
      className="panel-navy-live relative overflow-hidden text-white lg:flex lg:h-[100svh] lg:flex-col"
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

      {/*
        `flex-1` and not `h-full`: `h-full` resolved against the pinned
        section's own height, so the track was a full viewport tall *below* a
        172px header. Everything inside it centred around a midpoint that sat
        well under the middle of the screen, which is why the panels never
        looked centred at 100% zoom. `flex-1 min-h-0` takes the space the
        header leaves instead, and the panels centre in the real gap.
      */}
      <div
        ref={trackRef}
        className="flex flex-col lg:min-h-0 lg:w-max lg:flex-1 lg:flex-row lg:items-stretch"
      >
        {services.map((s) => (
          <article
            key={s.slug}
            className="relative flex h-full w-full flex-col justify-center gap-10 border-b border-white/10 px-6 py-16 lg:w-[78vw] lg:flex-row lg:items-stretch lg:gap-[3vw] lg:border-b-0 lg:border-r-2 lg:border-r-white/15 lg:px-[4vw] lg:py-8"
          >
            {/* The running number, moved off the image to the top of the panel */}
            <span
              aria-hidden
              className="pointer-events-none absolute right-[4vw] top-6 z-[2] hidden font-mono text-[13px] font-medium tracking-[0.3em] text-white/65 lg:block"
            >
              <span className="text-coral">{s.index}</span> / {total}
            </span>

            {/*
              Copy column — always the first thing that reaches the eye. The
              two columns plus the gap now add up to exactly the 70vw the
              panel leaves after its padding (32 + 3 + 35), so neither can
              spill over the other.
            */}
            <div className="panel-copy relative z-10 w-full min-w-0 shrink-0 lg:w-[32vw] lg:self-center">
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
              {/*
                The anchor names its destination. "Explore" on its own told a
                crawler — and a screen reader running a link list — nothing
                about where four identical links each went.
              */}
              <Link
                href={`/services/${s.slug}`}
                className="group mt-9 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-coral"
              >
                {copy.explore}
                <span className="sr-only"> {t(s.title)}</span>
                <span className="inline-block size-2 bg-coral transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>

            {/*
              Big enough to hold the space it is given: the visual runs the
              height of the panel rather than sitting in a squat 4:3 box, and
              gradients carry it into the navy at every edge instead of a hard
              frame that read as an image hung on the panel.
            */}
            <div className="panel-visual relative z-[1] w-full lg:w-[35vw] lg:self-stretch">
              <div className="panel-image relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-full">
                <Image
                  src={serviceImage(s.slug)}
                  alt={`${t(s.title)} · Imsuya Global`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 35vw"
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

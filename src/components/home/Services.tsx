"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { services, featuredSlugs, serviceImage } from "@/data/services";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useLang, useT } from "@/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const featured = featuredSlugs
  .map((slug) => services.find((s) => s.slug === slug)!)
  .filter(Boolean);

const rest = services.filter((s) => !featuredSlugs.includes(s.slug));

const COPY = {
  en: {
    eyebrow: "What we do / 002",
    heading: "Nine disciplines.",
    headingSoft: "One team.",
    cue: "Scroll to explore →",
    explore: "Explore",
    closingEyebrow: "Everything else we do",
    closingTitle: "Social. Merchandise. Corporate Gifts.",
    viewAll: "View all services",
  },
  ms: {
    eyebrow: "Apa kami buat / 002",
    heading: "Sembilan disiplin.",
    headingSoft: "Satu pasukan.",
    cue: "Skrol untuk terokai →",
    explore: "Terokai",
    closingEyebrow: "Segala yang lain kami buat",
    closingTitle: "Sosial. Barangan. Hadiah Korporat.",
    viewAll: "Lihat semua perkhidmatan",
  },
};

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const t = useT();
  const copy = COPY[lang];

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

        // Ghost numbers drift slower than their panels — depth.
        gsap.utils.toArray<HTMLElement>(".panel-ghost").forEach((ghost) => {
          gsap.fromTo(
            ghost,
            { xPercent: 12 },
            {
              xPercent: -12,
              ease: "none",
              scrollTrigger: {
                trigger: ghost,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });

        // Panel visuals parallax against the horizontal motion.
        gsap.utils.toArray<HTMLElement>(".panel-visual").forEach((visual) => {
          gsap.fromTo(
            visual,
            { xPercent: 6, yPercent: 3 },
            {
              xPercent: -6,
              yPercent: 0,
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
    <section ref={sectionRef} className="relative overflow-hidden bg-void lg:h-screen">
      {/* header sits in flow — panels can never collide with it */}
      <div className="relative z-20 mx-auto w-full max-w-[1600px] px-6 pt-24 lg:flex lg:items-end lg:px-12 lg:pt-0">
        <div className="flex w-full items-end justify-between lg:h-[150px] lg:pb-4">
          <div>
            <Eyebrow variant="b" className="mb-4">
              {copy.eyebrow}
            </Eyebrow>
            <h2 className="text-display text-4xl uppercase lg:text-5xl">
              {copy.heading} <span className="text-soft">{copy.headingSoft}</span>
            </h2>
          </div>
          <p className="text-eyebrow hidden text-soft lg:block">{copy.cue}</p>
        </div>
      </div>

      <div ref={trackRef} className="flex flex-col lg:w-max lg:flex-row lg:items-stretch">
        {featured.map((s, i) => (
          <article
            key={s.slug}
            className="relative flex min-h-[70vh] w-full flex-col justify-end border-b border-paper/[0.06] px-6 py-16 lg:h-[calc(100vh-150px)] lg:min-h-0 lg:w-screen lg:justify-center lg:border-b-0 lg:border-r lg:px-12 lg:pb-16 lg:pt-0"
          >
            {/* ghost index — decorative, below everything */}
            <span
              aria-hidden
              className="panel-ghost ghost-text text-display pointer-events-none absolute right-0 top-1/2 z-0 -translate-y-1/2 text-[34vh] leading-none lg:text-[48vh]"
            >
              {s.index}
            </span>

            {/* navy depth gradient, alternating direction */}
            <div
              aria-hidden
              className={`navy-wash absolute inset-0 z-0 ${
                i % 2 === 0
                  ? "bg-[radial-gradient(ellipse_at_20%_80%,#1e2852_0%,transparent_55%)]"
                  : "bg-[radial-gradient(ellipse_at_80%_20%,#1e2852_0%,transparent_55%)]"
              }`}
            />

            {/* cinematic visual — framed, parallaxed */}
            <div className="panel-visual img-veil card relative z-[1] mb-10 aspect-[16/10] w-full max-w-xl overflow-hidden border border-paper/[0.1] lg:absolute lg:right-[7vw] lg:top-1/2 lg:mb-0 lg:w-[34vw] lg:max-w-none lg:-translate-y-1/2">
              <Image
                src={serviceImage(s.slug)}
                alt={`${t(s.title)} · Imsuya Global`}
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                className="img-cinematic object-cover"
              />
              <span className="absolute left-4 top-4 z-10 font-mono text-[10px] tracking-[0.25em] text-white/70">
                {s.index} / IMSUYA
              </span>
            </div>

            <div className="relative z-10 max-w-3xl lg:max-w-[50vw]">
              <p className="text-eyebrow mb-6 text-coral">
                {s.index} / {t(s.short)}
              </p>
              <h3 className="text-display text-[clamp(1.9rem,4vw,3.9rem)] uppercase">
                {t(s.short)}
              </h3>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t(s.tagline)}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {s.features.slice(0, 4).map((f) => (
                  <span
                    key={f.name.en}
                    className="border border-paper/15 bg-void/60 px-4 py-2 font-mono text-xs text-muted"
                  >
                    {t(f.name)}
                  </span>
                ))}
              </div>
              <Link
                href={`/services/${s.slug}`}
                className="group mt-10 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-paper"
              >
                {copy.explore}
                <span className="inline-block size-2 bg-coral transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </article>
        ))}

        {/* closing panel — the rest of the offering */}
        <article className="relative flex min-h-[70vh] w-full flex-col items-start justify-center bg-navy-deep/50 px-6 py-16 lg:min-h-0 lg:w-screen lg:px-12 lg:h-[calc(100vh-150px)]">
          <p className="text-eyebrow relative z-10 mb-6 text-coral">{copy.closingEyebrow}</p>
          <h3 className="text-display relative z-10 max-w-4xl text-[clamp(2rem,4.4vw,4.4rem)] uppercase">
            {copy.closingTitle}
          </h3>
          <ul className="relative z-10 mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {rest.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="font-mono text-sm text-muted transition-colors hover:text-coral"
                >
                  {s.index} / {t(s.short)}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/services"
            className="relative z-10 mt-14 inline-flex items-center gap-3 bg-coral px-8 py-4 text-sm font-bold uppercase tracking-wide text-black transition-colors duration-300 hover:bg-paper hover:text-void"
          >
            {copy.viewAll}
          </Link>
        </article>
      </div>

      {/* progress bar */}
      <div className="absolute bottom-0 left-0 z-20 hidden h-px w-full bg-paper/10 lg:block">
        <div className="services-progress h-full w-full origin-left bg-coral" />
      </div>
    </section>
  );
}

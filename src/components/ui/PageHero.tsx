import { Eyebrow } from "./Eyebrow";
import { RevealLines } from "./Reveal";

export function PageHero({
  eyebrow,
  lines,
  intro,
}: {
  eyebrow: string;
  lines: string[];
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-void px-6 pb-20 pt-44 lg:px-12 lg:pb-28 lg:pt-56">
      <div
        aria-hidden
        className="navy-wash absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,#1e2852_0%,transparent_55%)] opacity-60"
      />
      <div className="blueprint" aria-hidden />
      <div className="glow-field" aria-hidden />
      <div className="relative mx-auto max-w-[1600px]">
        <Eyebrow className="mb-8">{eyebrow}</Eyebrow>
        <RevealLines
          as="h1"
          lines={lines}
          className="text-display max-w-6xl text-[clamp(2.8rem,8vw,7.5rem)] uppercase"
        />
        {intro && (
          <p className="mt-10 max-w-lg text-lg leading-relaxed text-muted">{intro}</p>
        )}
      </div>
    </section>
  );
}

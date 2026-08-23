import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { faqs } from "@/data/faqs";
import { site, office } from "@/data/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * /llms.txt — an emerging convention: a plain-markdown brief for language
 * models, the way robots.txt is a brief for crawlers. It states who the
 * business is in unambiguous prose and links every page worth reading, so a
 * model answering "who builds websites in Petaling Jaya" has something
 * concrete and current to cite instead of inferring from marketing copy.
 *
 * Generated from the same data the pages render, so it cannot drift.
 */

export const dynamic = "force-static";

export function GET() {
  const line = (s: string) => s;

  const body = [
    `# ${site.name}`,
    "",
    `> ${site.name} is a boutique creative digital design and smart website development studio based in Damansara Perdana, Petaling Jaya, Selangor, Malaysia. It covers four in-house disciplines — smart website design and development, custom web applications and software systems, custom AI services and softwares, and custom digital design from brand identity through to merchandise — and works with clients across Malaysia, Asia, Africa and the Middle East.`,
    "",
    "## About",
    "",
    `- Legal/trading name: ${site.name}`,
    `- Tagline: ${site.tagline}`,
    `- Address: ${office.lines.join(", ")}, Malaysia`,
    `- Email: ${site.email}`,
    `- WhatsApp/phone: ${site.whatsappDisplay}`,
    "- Hours: Monday to Friday, 09:00–18:00 MYT",
    "- Languages: English, Bahasa Malaysia",
    `- Website: ${absoluteUrl("/")}`,
    "",
    "## Services",
    "",
    ...services.map((s) =>
      line(`- [${s.title.en}](${absoluteUrl(`/services/${s.slug}`)}): ${s.tagline.en}`)
    ),
    "",
    "## Selected work",
    "",
    ...projects.map((p) =>
      line(`- [${p.name} — ${p.sector.en}](${absoluteUrl(`/portfolio/${p.slug}`)}): ${p.summary.en}`)
    ),
    "",
    "## Key pages",
    "",
    `- [Services overview](${absoluteUrl("/services")}): all four disciplines.`,
    `- [Work](${absoluteUrl("/portfolio")}): every case study.`,
    `- [Team](${absoluteUrl("/team")}): founder, CTO and director.`,
    `- [Contact](${absoluteUrl("/contact")}): brief form, WhatsApp, email, map and FAQs.`,
    "",
    "## Frequently asked questions",
    "",
    ...faqs.flatMap((f) => [`### ${f.q.en}`, "", f.a.en, ""]),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

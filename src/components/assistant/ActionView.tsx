import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon, MailIcon } from "@/components/ui/Icons";
import type { AssistantAction } from "@/lib/assistant/protocol";
import type { Lang } from "@/i18n/types";

const COPY = {
  en: {
    caseStudy: "Case study",
    whatsapp: "Chat on WhatsApp",
    email: "Email the team",
    prefilled: "Ready to send",
    sentTitle: "Brief sent to the team",
    sentBody: "It's in the studio's inbox. They'll reply within one business day.",
    notSentTitle: "Send your brief",
    notSentBody: "It's already filled in — tap one to send it.",
  },
  ms: {
    caseStudy: "Kajian kes",
    whatsapp: "Sembang di WhatsApp",
    email: "E-mel pasukan",
    prefilled: "Sedia dihantar",
    sentTitle: "Taklimat dihantar kepada pasukan",
    sentBody: "Ia sudah berada dalam peti masuk studio. Mereka akan membalas dalam satu hari bekerja.",
    notSentTitle: "Hantar taklimat anda",
    notSentBody: "Semuanya sudah diisi — tekan salah satu untuk menghantar.",
  },
} as const;

/** A WhatsApp hand-off: the office chat opens with the message typed in. */
export function WhatsAppButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 bg-paper px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-[#0d2a4f]"
    >
      <span className="flex items-center gap-2.5">
        <WhatsAppIcon className="size-4 text-[#25D366]" />
        {label}
      </span>
      <span aria-hidden className="text-coral transition-transform duration-300 group-hover:translate-x-1">
        ↗
      </span>
    </a>
  );
}

export function EmailButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-3 border border-paper/15 bg-void px-4 py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors duration-300 hover:border-coral hover:text-coral"
    >
      <span className="flex items-center gap-2.5">
        <MailIcon className="size-4 text-navy" />
        {label}
      </span>
      <span aria-hidden className="text-coral">
        ↗
      </span>
    </a>
  );
}

export function ActionView({ action, lang }: { action: AssistantAction; lang: Lang }) {
  const copy = COPY[lang];

  if (action.kind === "work") {
    return (
      <ul className="grid gap-2">
        {action.projects.map((p) => (
          <li key={p.slug}>
            <Link
              href={p.href}
              className="group flex items-stretch gap-3 border border-paper/[0.08] bg-void transition-colors duration-300 hover:border-coral/50"
            >
              <span className="panel-navy relative block aspect-[16/10] w-28 shrink-0 overflow-hidden">
                {p.image && (
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover object-top transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col justify-center py-2 pr-3">
                <span className="truncate text-sm font-bold tracking-tight text-paper">{p.name}</span>
                <span className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-soft">{p.sector}</span>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-coral">
                  {copy.caseStudy} →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  if (action.kind === "links") {
    return (
      <div className="flex flex-wrap gap-2">
        {action.links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group inline-flex items-center gap-2 border border-paper/15 bg-void px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-paper transition-colors duration-300 hover:border-coral hover:text-coral"
          >
            {l.label}
            <span aria-hidden className="text-coral transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        ))}
      </div>
    );
  }

  if (action.kind === "whatsapp") {
    return (
      <div className="space-y-2">
        <WhatsAppButton href={action.href} label={copy.whatsapp} />
        <p className="whitespace-pre-line border-l-2 border-coral/60 pl-3 text-[13px] leading-relaxed text-muted">
          <span className="mb-0.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-soft">{copy.prefilled}</span>
          {action.message}
        </p>
      </div>
    );
  }

  if (action.kind === "contact") {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        <WhatsAppButton href={action.whatsappHref} label={copy.whatsapp} />
        <EmailButton href={action.mailtoHref} label={copy.email} />
      </div>
    );
  }

  // The brief, read back before it goes anywhere.
  if (action.kind === "brief") {
    return (
      <dl className="divide-y divide-paper/[0.08] border border-paper/[0.12] bg-navy-deep/40">
        {action.rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[92px_1fr] gap-3 px-3.5 py-2.5">
            <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-soft">{row.label}</dt>
            <dd className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-paper">{row.value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  // Enquiry
  if (action.status === "sent") {
    return (
      <div className="flex gap-3 border border-coral/30 bg-coral/[0.06] p-3.5">
        <span aria-hidden className="flex size-7 shrink-0 items-center justify-center bg-coral text-sm font-bold text-white">
          ✓
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-tight text-paper">{copy.sentTitle}</p>
          <p className="mt-0.5 text-[13px] text-muted">{copy.sentBody}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2 border border-paper/[0.08] bg-void p-3.5">
      <p className="text-sm font-bold tracking-tight text-paper">{copy.notSentTitle}</p>
      <p className="text-[13px] text-muted">{copy.notSentBody}</p>
      <WhatsAppButton href={action.whatsappHref} label={copy.whatsapp} />
      <EmailButton href={action.mailtoHref} label={copy.email} />
    </div>
  );
}

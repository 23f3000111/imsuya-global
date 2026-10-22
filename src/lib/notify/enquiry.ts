import { services } from "@/data/services";
import type { Lang } from "@/i18n/types";

/** A project brief on its way to the studio, from either entry point. */
export type Enquiry = {
  source: "assistant" | "contact-form";
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  /** A service slug, or "not-sure". */
  service?: string;
  summary: string;
  timeline?: string;
  budget?: string;
  preferredContact?: "email" | "whatsapp" | "phone";
  language: Lang;
  page?: string;
  /** The chat that led to it, oldest first — assistant enquiries only. */
  transcript?: { role: "visitor" | "assistant"; text: string }[];
};

const SOURCE_LABEL: Record<Enquiry["source"], string> = {
  assistant: "Website assistant",
  "contact-form": "Contact page brief",
};

export function serviceLabel(slug?: string, lang: Lang = "en"): string {
  if (!slug || slug === "not-sure") return lang === "ms" ? "Belum pasti" : "Not sure yet";
  return services.find((s) => s.slug === slug)?.title[lang] ?? slug;
}

export function contactLine(e: Enquiry): string {
  return [e.email, e.phone].filter(Boolean).join(" · ") || "no contact details given";
}

export function enquirySubject(e: Enquiry): string {
  const who = e.company ? `${e.name} (${e.company})` : e.name;
  return `New enquiry: ${who} · ${serviceLabel(e.service)}`;
}

function rows(e: Enquiry): [string, string][] {
  const r: [string, string][] = [
    ["Name", e.name],
    ["Email", e.email ?? ""],
    ["WhatsApp / phone", e.phone ?? ""],
    ["Company", e.company ?? ""],
    ["Service", serviceLabel(e.service)],
    ["Timeline", e.timeline ?? ""],
    ["Budget", e.budget ?? ""],
    ["Prefers", e.preferredContact ?? ""],
    ["Language", e.language === "ms" ? "Bahasa Malaysia" : "English"],
    ["Came from", `${SOURCE_LABEL[e.source]}${e.page ? ` (${e.page})` : ""}`],
  ];
  return r.filter(([, v]) => v);
}

/** The closing line: how to answer, and for a contact-page brief, what it is. */
function footer(e: Enquiry): string {
  const reply = e.email
    ? "Reply to this email to answer them directly."
    : e.phone
      ? "Reply on WhatsApp or by phone."
      : "No contact details came with this brief.";
  return e.source === "contact-form"
    ? `${reply} Sent when the visitor finished the brief on the contact page; they were then offered WhatsApp and email to send it themselves, so it may arrive there too.`
    : reply;
}

export function enquiryText(e: Enquiry): string {
  const lines = rows(e).map(([k, v]) => `${k}: ${v}`);
  lines.push("", "What they need:", e.summary);
  if (e.transcript?.length) {
    lines.push("", "Conversation:");
    for (const t of e.transcript) lines.push(`${t.role === "visitor" ? "Visitor" : "Assistant"}: ${t.text}`);
  }
  lines.push("", footer(e));
  return lines.join("\n");
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Everything the visitor typed is escaped: this is untrusted input in an inbox. */
export function enquiryHtml(e: Enquiry): string {
  const table = rows(e)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:4px 0;color:#081d38">${esc(v)}</td></tr>`
    )
    .join("");
  const chat = e.transcript?.length
    ? `<h3 style="margin:28px 0 8px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#6b7280">Conversation</h3>` +
      e.transcript
        .map(
          (t) =>
            `<p style="margin:0 0 10px;padding:10px 12px;background:${t.role === "visitor" ? "#eef1f8" : "#ffffff"};border:1px solid #e5e7eb;white-space:pre-wrap"><strong>${t.role === "visitor" ? "Visitor" : "Assistant"}:</strong> ${esc(t.text)}</p>`
        )
        .join("")
    : "";
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#081d38;max-width:640px">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#f04e23">New enquiry · ${esc(SOURCE_LABEL[e.source])}</p>
<h2 style="margin:0 0 16px;font-size:20px">${esc(e.name)}${e.company ? ` · ${esc(e.company)}` : ""}</h2>
<table style="border-collapse:collapse;margin-bottom:20px">${table}</table>
<h3 style="margin:0 0 8px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#6b7280">What they need</h3>
<p style="margin:0;white-space:pre-wrap">${esc(e.summary)}</p>
${chat}
<p style="margin:28px 0 0;color:#6b7280;font-size:12px">${esc(footer(e))}</p>
</div>`;
}

/** The same brief as a pre-filled WhatsApp or email message from the visitor. */
export function visitorMessage(e: Pick<Enquiry, "name" | "company" | "service" | "summary" | "language">): string {
  const ms = e.language === "ms";
  const lines = [
    ms ? "Hai Imsuya Global!" : "Hi Imsuya Global!",
    "",
    `${ms ? "Nama" : "Name"}: ${e.name}`,
  ];
  if (e.company) lines.push(`${ms ? "Syarikat" : "Company"}: ${e.company}`);
  lines.push(`${ms ? "Berminat dengan" : "Interested in"}: ${serviceLabel(e.service, e.language)}`, "", e.summary);
  return lines.join("\n");
}

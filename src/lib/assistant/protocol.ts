import type { Lang } from "@/i18n/types";

/*
 * Shapes shared by the chat widget, its reply engine (brain.ts) and the brief
 * endpoint (/api/contact). Types and limits only, so the browser and the
 * server can both import it.
 */

export type WorkCard = {
  slug: string;
  name: string;
  sector: string;
  image: string | null;
  href: string;
};

export type LinkChip = { href: string; label: string };

/** Something the assistant puts on screen besides its words. */
export type AssistantAction =
  | { kind: "work"; projects: WorkCard[] }
  | { kind: "links"; links: LinkChip[] }
  /** A WhatsApp hand-off with the visitor's message already typed in. */
  | { kind: "whatsapp"; href: string; message: string }
  /** WhatsApp and email, side by side. */
  | { kind: "contact"; whatsappHref: string; mailtoHref: string }
  /** The brief, read back for the visitor to check before it is sent. */
  | { kind: "brief"; rows: { label: string; value: string }[] }
  /**
   * How sending it went. "not_sent" means email isn't set up or failed, so
   * the visitor gets WhatsApp and email buttons with the brief filled in.
   */
  | { kind: "enquiry"; status: "sent" | "not_sent"; whatsappHref: string; mailtoHref: string };

/**
 * A tap-to-answer button under the latest reply. The engine acts on `value`;
 * the visitor sees `label`, and so does their side of the chat.
 */
export type Choice = { label: string; value: string };

export type Part = { type: "text"; text: string } | { type: "action"; action: AssistantAction };

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; lang: Lang; parts: Part[]; choices?: Choice[] };

/** What the widget posts to /api/contact once a visitor confirms a brief. */
export type AssistantBrief = {
  source: "assistant";
  name: string;
  email?: string;
  phone?: string;
  /** A service slug, or "not-sure". */
  service: string;
  details: string;
  lang: Lang;
  page: string;
  /** The chat that led to it, oldest first. */
  transcript: { role: "visitor" | "assistant"; text: string }[];
};

export const LIMITS = {
  /** Characters in one visitor message. */
  userChars: 1500,
  /** Messages of the chat that travel with a brief. */
  transcriptTurns: 16,
  /** Characters per message in that transcript. */
  transcriptChars: 1000,
} as const;

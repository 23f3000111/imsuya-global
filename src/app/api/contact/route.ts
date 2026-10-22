import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { services } from "@/data/services";
import { deliverEnquiry } from "@/lib/notify";
import { allow, isDuplicateEnquiry, rememberEnquiry } from "@/lib/rateLimit";

/**
 * Project briefs, emailed to the studio's inbox — see src/lib/notify.
 *
 * Two senders. The contact page's conversational form posts here when the
 * visitor finishes it, then offers WhatsApp and email so they can send the
 * brief themselves. The website assistant posts here when a visitor confirms
 * the brief it collected, with a way to reply and the chat that led to it.
 * Until SMTP is configured this returns delivered: false, and both fall back
 * to WhatsApp and email buttons with the brief filled in.
 */
export const runtime = "nodejs";

const HOUR = 60 * 60 * 1000;

/** Only plain site paths are recorded as where a brief came from. */
const SAFE_PATH = /^\/[A-Za-z0-9\-_/]{0,120}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const Body = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(120).optional(),
  service: z.string().trim().max(120).optional(),
  details: z.string().trim().min(1).max(3000),
  lang: z.enum(["en", "ms"]).optional(),
  // From the website assistant.
  source: z.enum(["assistant", "contact-form"]).optional(),
  email: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  page: z.string().max(200).optional(),
  transcript: z
    .array(z.object({ role: z.enum(["visitor", "assistant"]), text: z.string().max(1000) }))
    .max(16)
    .optional(),
});

/** The form sends the service's display name and the assistant its slug. */
const serviceSlug = (label?: string) =>
  services.find((s) => s.short.en === label || s.short.ms === label)?.slug ?? label;

export async function POST(request: Request) {
  // Same-origin only: other sites can't post briefs from their pages.
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get("host")) {
        return NextResponse.json({ ok: false }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  let data: z.infer<typeof Body>;
  try {
    const parsed = Body.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    data = parsed.data;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const fromAssistant = data.source === "assistant";
  const email = data.email && EMAIL.test(data.email) ? data.email : undefined;
  const digits = data.phone?.replace(/\D/g, "").length ?? 0;
  const phone = data.phone && digits >= 7 && digits <= 15 ? data.phone : undefined;
  // The assistant always collects a way to reply; a brief without one can't be answered.
  if (fromAssistant && !email && !phone) {
    return NextResponse.json({ ok: false, error: "No way to reply" }, { status: 400 });
  }

  // The client address as the platform sees it. On Vercel x-real-ip is set at
  // the edge and a visitor can't supply it (x-forwarded-for is overwritten
  // too); elsewhere, fall back to the first forwarded hop.
  const ip =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const fingerprint = createHash("sha256")
    .update(`${ip}|${data.name.toLowerCase()}|${data.details.toLowerCase()}`)
    .digest("hex");
  if (isDuplicateEnquiry(fingerprint)) return NextResponse.json({ ok: true, delivered: true });

  // Per visitor, plus a daily ceiling for the whole site so a flood can't fill
  // the inbox or trip the mailbox's sending limits. Hitting either shuts no
  // one out: the visitor gets WhatsApp and email buttons with the brief
  // filled in, the same as when email isn't configured.
  if (!allow(`contact:${ip}`, 5, HOUR) || !allow("contact:day:all", 100, 24 * HOUR)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  const delivery = await deliverEnquiry({
    source: fromAssistant ? "assistant" : "contact-form",
    name: data.name,
    email,
    phone,
    company: data.company || undefined,
    service: serviceSlug(data.service),
    summary: data.details,
    preferredContact: fromAssistant ? (email ? "email" : "whatsapp") : undefined,
    language: data.lang ?? "en",
    page: fromAssistant && data.page && SAFE_PATH.test(data.page) ? data.page : "/contact",
    transcript: fromAssistant ? data.transcript : undefined,
  });
  if (delivery.email) rememberEnquiry(fingerprint);

  return NextResponse.json({ ok: true, delivered: delivery.email });
}

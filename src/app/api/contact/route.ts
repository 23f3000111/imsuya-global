import { NextResponse } from "next/server";

/**
 * Contact notification endpoint.
 *
 * Wire this to your email provider before launch — e.g. Resend:
 *   npm i resend, set RESEND_API_KEY, then send the enquiry to your inbox here.
 * WhatsApp notifications are handled client-side via the wa.me deep link;
 * for automated WhatsApp delivery, connect the WhatsApp Business Cloud API.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, company, service, details } = data ?? {};

    if (!name || !details) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    console.log("[contact enquiry]", { name, company, service, details });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

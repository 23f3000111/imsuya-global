import nodemailer from "nodemailer";
import { site } from "@/data/site";
import { enquiryHtml, enquirySubject, enquiryText, type Enquiry } from "./enquiry";

/*
 * Enquiry email, sent through the studio's own mailbox.
 *
 * imsuyaglobal.com's mail is hosted by Hostinger (MX mx1/mx2.hostinger.com)
 * and its SPF record authorises Hostinger's servers, so sending as
 * info@imsuyaglobal.com through smtp.hostinger.com lands in inboxes rather
 * than spam, with no third-party email service to sign up for. Only the
 * mailbox password has to be supplied:
 *
 *   SMTP_USER=info@imsuyaglobal.com
 *   SMTP_PASS=<that mailbox's password>
 *
 * Optional: SMTP_HOST (default smtp.hostinger.com), SMTP_PORT (default 465,
 * implicit TLS; 587 uses STARTTLS), MAIL_TO (default the studio's address).
 */

export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransport() {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.hostinger.com",
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      // A visitor is waiting on the chat while this runs: fail fast rather
      // than hold the reply for nodemailer's default two-minute timeouts.
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 15_000,
    });
  }
  return transport;
}

/** True when the server accepted the message for delivery. */
export async function sendEnquiryEmail(e: Enquiry): Promise<boolean> {
  if (!mailConfigured()) return false;
  try {
    await getTransport().sendMail({
      // The authenticated mailbox has to be the sender, or the host rejects
      // it; the visitor goes in Reply-To so answering reaches them directly.
      from: { name: "Imsuya Global website", address: process.env.SMTP_USER! },
      to: process.env.MAIL_TO ?? site.email,
      replyTo: e.email ? { name: e.name, address: e.email } : undefined,
      subject: enquirySubject(e),
      text: enquiryText(e),
      html: enquiryHtml(e),
    });
    return true;
  } catch (err) {
    console.error("[notify] enquiry email failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

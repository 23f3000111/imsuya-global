import { mailConfigured, sendEnquiryEmail } from "./mail";
import type { Enquiry } from "./enquiry";

export type Delivery = {
  email: boolean;
  /** Email is set up, whether or not it worked this time. */
  configured: boolean;
};

/**
 * Sends an enquiry to the studio's inbox. Never throws — the caller reports
 * the result, and the visitor is offered WhatsApp and email when it fails.
 */
export async function deliverEnquiry(e: Enquiry): Promise<Delivery> {
  return { email: await sendEnquiryEmail(e), configured: mailConfigured() };
}

export type { Enquiry } from "./enquiry";

import type { L10n } from "@/i18n/types";

export type AiProduct = {
  slug: string;
  name: string;
  /** The live product, so the claim can be checked in one click. */
  url: string;
  /** What was actually built — the chatbot, the booking flow. */
  kind: L10n;
  summary: L10n;
  /** Still of the product, shown until the recording is played. */
  poster: string;
  /**
   * Screen recording of the product in use. Drop an .mp4 into
   * /public/services/demos and set the path here to turn the card into a
   * player; until then the card shows the still and links to the live site.
   */
  video?: string;
  highlights: L10n[];
};

/**
 * Shipped AI work, shown on /services/ai-products. These are the two the
 * client asked to lead with: the Safeeds support chatbot and the GigYard
 * booking flow.
 */
export const aiProducts: AiProduct[] = [
  {
    slug: "safeeds-auto-transport",
    name: "Safeeds Auto Transport",
    url: "https://safeedsautotransport.com/",
    kind: { en: "AI chatbot", ms: "Chatbot AI" },
    summary: {
      en: "A support assistant for a US vehicle shipping company, trained on its carriers, routes and pricing rules. It answers shipping questions in the customer's own words and hands over a qualified quote request instead of a raw enquiry.",
      ms: "Pembantu sokongan untuk syarikat penghantaran kenderaan di Amerika Syarikat, dilatih dengan data pembawa, laluan dan peraturan harga syarikat. Ia menjawab soalan penghantaran dalam bahasa pelanggan sendiri dan menyerahkan permintaan sebut harga yang layak, bukan sekadar pertanyaan mentah.",
    },
    poster: "/services/demos/safeeds-auto-transport.jpg",
    highlights: [
      { en: "Trained on live carrier and route data", ms: "Dilatih dengan data pembawa dan laluan langsung" },
      { en: "Instant quote in under 30 seconds", ms: "Sebut harga segera dalam bawah 30 saat" },
      { en: "Escalates to a human on request", ms: "Diserahkan kepada manusia atas permintaan" },
    ],
  },
  {
    slug: "gigyard",
    name: "GigYard",
    url: "https://gigyard.com.au/",
    kind: { en: "AI booking form", ms: "Borang tempahan AI" },
    summary: {
      en: "Australia's live music marketplace. The booking form reads a venue's state, date, genre, event type and budget, then matches and ranks available bands — turning a week of back-and-forth into a booking made in minutes.",
      ms: "Pasaran muzik langsung Australia. Borang tempahan membaca negeri, tarikh, genre, jenis acara dan bajet sesuatu tempat, kemudian memadan dan menyusun kumpulan yang tersedia — menukar seminggu perbincangan kepada tempahan dalam beberapa minit.",
    },
    poster: "/services/demos/gigyard.jpg",
    highlights: [
      { en: "Six-field match on state, date, genre and budget", ms: "Padanan enam medan: negeri, tarikh, genre dan bajet" },
      { en: "Ranked availability, not a directory", ms: "Ketersediaan disusun, bukan sekadar direktori" },
      { en: "Stripe payments, quote to booking", ms: "Pembayaran Stripe, sebut harga ke tempahan" },
    ],
  },
];

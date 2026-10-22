import { services } from "@/data/services";
import { projects, type Project } from "@/data/projects";
import { faqs, type Faq } from "@/data/faqs";
import type { L10n, Lang } from "@/i18n/types";
import type { LinkChip, WorkCard } from "./protocol";

/*
 * What the assistant knows, and how it tells what a visitor is asking.
 *
 * Every answer is built from the data modules the pages render — services,
 * projects, FAQs, the team — so when one of those changes, the assistant
 * changes with it. Recognition is plain pattern matching over English and
 * Malay. There is no model and no API behind it: it runs in the visitor's
 * browser, costs nothing per message, and nothing leaves the page until the
 * visitor chooses to send a brief.
 */

/** Pages the assistant links to, with their labels in both languages. */
export const PAGES: { path: string; label: L10n }[] = [
  { path: "/", label: { en: "Home", ms: "Laman Utama" } },
  { path: "/services", label: { en: "All services", ms: "Semua perkhidmatan" } },
  ...services.map((s) => ({ path: `/services/${s.slug}`, label: s.short })),
  { path: "/portfolio", label: { en: "Our work", ms: "Kerja kami" } },
  { path: "/team", label: { en: "The team", ms: "Pasukan" } },
  { path: "/contact", label: { en: "Contact", ms: "Hubungi" } },
  { path: "/contact#faq", label: { en: "FAQs", ms: "Soalan lazim" } },
];

export function pageLink(path: string, lang: Lang): LinkChip {
  return { href: path, label: PAGES.find((p) => p.path === path)?.label[lang] ?? path };
}

/**
 * Lower case, accents and apostrophes off, and everything that isn't a letter
 * or a digit turned into a space, so "What's", "whats" and "WHATS?" all read
 * the same to the patterns below.
 */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’`]/g, "")
    .replace(/&/g, " & ")
    .replace(/[^a-z0-9&\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* -------------------------------------------------------------------------- */
/* Services                                                                    */
/* -------------------------------------------------------------------------- */

/** Words that point at each service, with how strongly. */
const SERVICE_RULES: [slug: string, pattern: RegExp, weight: number][] = [
  [
    "website-design-development",
    /\b(websites?|web ?sites?|web ?pages?|landing pages?|home ?page|e ?commerce|online (store|shop)|kedai (online|dalam talian)|laman( web)?|lamanweb|wordpress|wix|shopify)\b/,
    3,
  ],
  ["website-design-development", /\bweb\b/, 1],
  [
    "custom-web-applications",
    /\b(web ?apps?|web applications?|applications?|apps?|software|systems?|dashboards?|portals?|booking (system|engine|platform|form|site)|online booking|appointments?|reservations?|erp|crm|pos|inventory|internal tools?|platforms?|marketplaces?|membership|sistem|perisian|aplikasi|tempahan|papan pemuka)\b/,
    3,
  ],
  [
    "ai-products",
    /\b(ai|a i|artificial intelligence|chat ?bots?|chatgpt|gpt|llms?|automations?|automate|automated|automating|agents?|copilots?|machine learning|kecerdasan buatan|automasi|bots?)\b/,
    3,
  ],
  [
    "custom-digital-design",
    /\b(graphics?|logos?|brand(ing|s)?|identity|ui|ux|posters?|banners?|flyers?|brochures?|social media (posts?|visuals?|designs?|content)|merch|merchandise|apparel|packaging|grafik|jenama|penjenamaan|identiti|risalah|brosur|barangan|pembungkusan)\b/,
    3,
  ],
  ["custom-digital-design", /\b(design|designs|designer|designers|reka|rekaan)\b/, 1],
];

/** Tie-break order: the more specific need first. */
const SERVICE_ORDER = ["ai-products", "custom-web-applications", "custom-digital-design", "website-design-development"];

/** Services a message mentions, strongest first. */
export function servicesIn(text: string): { slug: string; score: number }[] {
  const scores = new Map<string, number>();
  for (const [slug, pattern, weight] of SERVICE_RULES) {
    if (pattern.test(text)) scores.set(slug, (scores.get(slug) ?? 0) + weight);
  }
  return [...scores]
    .map(([slug, score]) => ({ slug, score }))
    .filter((s) => s.score >= 2)
    .sort((a, b) => b.score - a.score || SERVICE_ORDER.indexOf(a.slug) - SERVICE_ORDER.indexOf(b.slug));
}

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/* -------------------------------------------------------------------------- */
/* Work                                                                        */
/* -------------------------------------------------------------------------- */

/** Industries a visitor might name, and the case studies that answer them. */
export const SECTORS: { key: string; label: L10n; pattern: RegExp; projects: string[] }[] = [
  {
    key: "fnb",
    label: { en: "Food & beverage", ms: "Makanan & minuman" },
    pattern:
      /\b(food|f & b|f and b|fnb|restaurants?|cafes?|coffee|bakery|bakeries|bistro|catering|kitchen|eatery|desserts?|makanan|minuman|restoran|kafe|kedai makan|roti|kek|katering)\b/,
    projects: ["toastful", "mojo-momo-crav", "my-french-factory-b"],
  },
  {
    key: "education",
    label: { en: "Education", ms: "Pendidikan" },
    pattern:
      /\b(education|educational|schools?|preschools?|kindergartens?|daycares?|childcare|nursery|kids|children|tuition|academy|learning (centre|center)|pendidikan|sekolah|prasekolah|tadika|taska|kanak kanak|tuisyen|akademi)\b/,
    projects: ["twinkle-kidz", "victoriashire-three", "cyw-art-craft"],
  },
  {
    key: "automotive",
    label: { en: "Automotive", ms: "Automotif" },
    pattern:
      /\b(automotive|cars?|vehicles?|motorsports?|racing|lubricants?|oils?|workshops?|car wraps?|wrapping|detailing|kereta|kenderaan|bengkel|pelincir|automotif)\b/,
    projects: ["px98", "prince-lubricants", "wrap-district"],
  },
  {
    key: "property",
    label: { en: "Property", ms: "Hartanah" },
    pattern:
      /\b(property|properties|real estate|realtors?|realty|industrial|factory|factories|warehouses?|hartanah|kilang|gudang|ejen hartanah)\b/,
    projects: ["mir"],
  },
  {
    key: "logistics",
    label: { en: "Logistics", ms: "Logistik" },
    pattern:
      /\b(logistics|transport|transportation|shipping|freight|fleet|trucks?|trucking|haulage|courier|logistik|pengangkutan|lori)\b/,
    projects: ["roadtainers"],
  },
  {
    key: "retail",
    label: { en: "Retail & beauty", ms: "Runcit & kecantikan" },
    pattern:
      /\b(retail|perfumes?|fragrances?|cosmetics?|beauty|fashion|boutiques?|barbers?|barbershops?|salons?|grooming|spa|minyak wangi|wangian|kosmetik|kecantikan|fesyen|butik|gunting rambut|kedai gunting|salun|runcit)\b/,
    projects: ["legendary", "balrcutz"],
  },
];

export const sectorIn = (text: string) => SECTORS.find((s) => s.pattern.test(text));

const PROJECT_NAMES: [RegExp, string][] = [
  [/\broadtainers?\b/, "roadtainers"],
  [/\btwinkle( kidz| kids)?\b/, "twinkle-kidz"],
  [/\b(m i r|mir|my industrial realtors)\b/, "mir"],
  [/\blegendary\b/, "legendary"],
  [/\bprince( lubricants?)?\b/, "prince-lubricants"],
  [/\bpx ?98\b/, "px98"],
  [/\bmojo( momo)?\b/, "mojo-momo-crav"],
  [/\btoastful\b/, "toastful"],
  [/\b(balrcutz|baler ?cutz|balr cutz)\b/, "balrcutz"],
  [/\bcyw\b/, "cyw-art-craft"],
  [/\bvictoriashire\b/, "victoriashire-three"],
  [/\bwrap district\b/, "wrap-district"],
  [/\b(my )?french factory\b/, "my-french-factory-b"],
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

/** A case study the visitor named outright. */
export function projectIn(text: string): Project | undefined {
  const hit = PROJECT_NAMES.find(([pattern]) => pattern.test(text));
  return hit ? projectBySlug(hit[1]) : undefined;
}

export function card(p: Project, lang: Lang): WorkCard {
  return { slug: p.slug, name: p.name, sector: p.sector[lang], image: p.image, href: `/portfolio/${p.slug}` };
}

/* -------------------------------------------------------------------------- */
/* FAQ search                                                                  */
/* -------------------------------------------------------------------------- */

/*
 * The long tail. When nothing more specific matches, a message is scored
 * against every FAQ: a word that appears in a question counts three times as
 * much as one that only appears in an answer. Below the threshold the
 * assistant says it doesn't know rather than guess.
 */

const STOP = new Set(
  `a an the and or but if of to in on at for from by with about as is are was were be been being do does did can could would should will may might must i me my we our us you your it its this that these those what which who whom how why when where there here than then so very just also too not no yes please hi hello hey get got have has had make made want need like know tell show give any some much many more most other such own same each every all both into over again only imsuya global
  yang dan atau di ke dari daripada pada untuk dengan ini itu ia saya anda awak kamu kami kita mereka dia apa apakah bagaimana berapa siapa bila mana kenapa mengapa adakah boleh akan sudah telah belum masih juga sahaja saja lagi pun kah lah tak tidak bukan ada nak mahu hendak ingin sebuah seorang satu tentang oleh kepada dalam`.split(/\s+/)
);

/** Plurals off, so "websites" finds "website". Malay is left whole. */
const stem = (w: string) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);

const terms = (s: string) =>
  normalize(s)
    .split(" ")
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);

let index: { faq: Faq; q: Set<string>; a: Set<string> }[] | null = null;

export function searchFaq(text: string): Faq | undefined {
  const words = [...new Set(terms(text))];
  if (!words.length) return undefined;
  index ??= faqs.map((faq) => ({
    faq,
    q: new Set([...terms(faq.q.en), ...terms(faq.q.ms)]),
    a: new Set([...terms(faq.a.en), ...terms(faq.a.ms)]),
  }));

  let best: { faq: Faq; score: number } | undefined;
  for (const item of index) {
    let score = 0;
    let inQuestion = 0;
    for (const w of words) {
      if (item.q.has(w)) {
        score += 3;
        inQuestion++;
      } else if (item.a.has(w)) {
        score += 1;
      }
    }
    score /= words.length + 1;
    if (inQuestion && (!best || score > best.score)) best = { faq: item.faq, score };
  }
  return best && best.score >= 1.2 ? best.faq : undefined;
}

/** An FAQ by the start of its English question; undefined if it is reworded. */
export const faqStarting = (prefix: string) => faqs.find((f) => f.q.en.startsWith(prefix));

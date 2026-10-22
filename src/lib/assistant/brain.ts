import { office, site, whatsappLink } from "@/data/site";
import { process, services } from "@/data/services";
import { projects, type Project } from "@/data/projects";
import { aiProducts } from "@/data/aiProducts";
import { clients } from "@/data/clients";
import { merchandise } from "@/data/merchandise";
import { team } from "@/data/team";
import type { Faq } from "@/data/faqs";
import type { Lang } from "@/i18n/types";
import { visitorMessage } from "@/lib/notify/enquiry";
import {
  LIMITS,
  type AssistantAction,
  type AssistantBrief,
  type ChatMessage,
  type Choice,
  type Part,
} from "./protocol";
import {
  SECTORS,
  card,
  faqStarting,
  normalize,
  pageLink,
  projectBySlug,
  projectIn,
  searchFaq,
  sectorIn,
  serviceBySlug,
  servicesIn,
} from "./knowledge";

/*
 * The website assistant's reply engine. Given the conversation so far and the
 * visitor's latest message — typed, or a tapped choice — it works out what
 * they're after and answers from the site's own content: services, work,
 * pricing and timelines, the team, the office. It also runs the brief: a
 * name, a way to reply, the service and what they need, read back and sent
 * only once the visitor says so.
 *
 * It is deterministic and self-contained: it runs in the browser, loaded the
 * first time the chat opens, with no model or API behind it. Whatever it
 * can't answer goes to the team on WhatsApp with the question already typed.
 */

/* -------------------------------------------------------------------------- */
/* State                                                                       */
/* -------------------------------------------------------------------------- */

type Step = "name" | "contact" | "service" | "details" | "confirm" | "edit";

type Draft = { name?: string; email?: string; phone?: string; service?: string; details?: string };

export type BrainState = {
  /** The language the visitor writes in, once there's enough to tell. */
  lang?: Lang;
  /** The site language when `lang` was set: switching the site resets it. */
  langSite?: Lang;
  /** The service in the conversation, for follow-ups like "how much is it?". */
  topic?: string;
  /** The last reply asked whether to start a brief, so "yes" can start one. */
  offer?: "brief";
  /** The brief being collected, and the question it is waiting on. */
  flow?: { step: Step; draft: Draft };
  /** Case studies already shown, so "show me more" moves on. */
  seen: string[];
  /** Replies in a row that found no answer. */
  misses: number;
  greeted?: boolean;
  /** The visitor's name, if they gave it before starting a brief. */
  knownName?: string;
  /** Briefs sent this session, by name and details, so none goes twice. */
  sent: string[];
};

export const initialState = (): BrainState => ({ seen: [], misses: 0, sent: [] });

export type Reply = Extract<ChatMessage, { role: "assistant" }>;

/** The reply to show, the state to keep, and a brief to post if one is ready. */
export type Outcome = { reply?: Reply; state: BrainState; brief?: AssistantBrief };

export type Context = { siteLang: Lang; page: string; history: ChatMessage[] };

/* -------------------------------------------------------------------------- */
/* Words                                                                       */
/* -------------------------------------------------------------------------- */

const join = (items: string[], and: string) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;

const firstSentence = (s: string) => s.match(/^[^.!?]*[.!?]/)?.[0] ?? s;

const en = {
  chip: {
    services: "Our services",
    work: "See our work",
    pricing: "Pricing",
    start: "Start a project",
    quote: "Get a quote",
    whatsapp: "Chat on WhatsApp",
    timeline: "How long does it take?",
    process: "How does it work?",
    cost: "How much does it cost?",
    more: "Show me more",
    examples: "See examples",
    team: "Meet the team",
    send: "Send to the team",
    edit: "Change something",
    cancel: "Cancel",
    notSure: "Not sure yet",
    fieldName: "Name",
    fieldContact: "Email or WhatsApp",
    fieldService: "Service",
    fieldDetails: "Details",
  },
  and: "and",
  greet:
    "Hi! I'm the Imsuya Global assistant. I can walk you through our services, show you our work, explain how pricing and timelines work, or send your project brief straight to the team. What are you working on?",
  greetAgain: "Hi again! What can I help with?",
  greetOnService: (svc: string) =>
    `Hi! You're looking at **${svc}** — I can tell you what's included, show you examples, or send your brief to the team.`,
  meet: (name: string) =>
    `Nice to meet you, ${name}! I can walk you through our services, show you our work, or send your project brief straight to the team. What are you working on?`,
  servicesIntro: "We're one in-house team with four services:",
  servicesAsk: "Which one would you like to know more about?",
  serviceYes: (title: string) => `Yes — that's our **${title}** service.`,
  included: "What's included:",
  briefOffer: "Want me to put a brief together for the team?",
  serviceMix: (a: string, b: string) =>
    `That sounds like a mix of **${a}** and **${b}** — we do both in-house, so it can be one project. Which would you like to hear about first?`,
  workIntro: "Here are a few of our recent builds — tap one for the full case study.",
  workMore: "Here are a few more:",
  workAll: "That's everything — the portfolio page has all of it in one place.",
  workSector: (sector: string) => `Here's what we've built in ${sector}:`,
  workWebsite: "A few websites we've designed and built:",
  workSoftware: "Live software we've shipped:",
  workAi: "AI we've shipped, live today:",
  workDesign: "Brand and design work we've done:",
  crm: "**Legendary Retail CRM** — a retail operations CRM built for Legendary's store network.",
  merchLine: (names: string) => `We also design and produce merchandise, for brands like ${names}.`,
  pricing:
    "We quote every project on its scope rather than a fixed package — the price depends on the features, pages, integrations and design work involved. You get a written proposal with a clear price and timeline before any work starts, with no obligation.",
  pricingOffer: "Want a quote? Tell me a little about the project and I'll send it to the team.",
  timeline:
    "A focused marketing website usually takes **four to six weeks**. Web apps and AI systems take longer depending on scope — you'll get a milestone plan with dates before the project starts.",
  processIntro: "Every project runs in six steps:",
  processOutro: "You'll have the scope, price and dates in writing before anything is built.",
  ownership:
    "You own everything after launch — the domain, the hosting account and the full source code. We hand over complete access with a walkthrough, so your team can edit content without calling a developer.",
  support:
    "Launch is the starting point, not the end. We stay on for iterations, monitoring and support, and most clients continue on a monthly retainer for content, iterations and new features.",
  contact: `You can reach the team directly:\n- **WhatsApp:** ${site.whatsappDisplay}\n- **Email:** ${site.email}\n- **Hours:** Monday to Friday, 9am to 6pm (Malaysia time)\n\nThey reply within one business day.`,
  location: `Our studio is in **Damansara Perdana, Petaling Jaya**:\n${office.lines.join("\n")}\n\nWe also work remotely with clients across Asia, Africa and the Middle East, with check-ins in your time zone. There's a map on our contact page.`,
  abroad:
    "Yes — we work with clients across Asia, Africa and the Middle East. Projects run remotely, with check-ins scheduled in your time zone. The studio itself is in Damansara Perdana, Petaling Jaya, Malaysia.",
  hours:
    "We're open **Monday to Friday, 9am to 6pm** Malaysia time. Anything that comes in after hours is answered the next business day — and I'm here around the clock in the meantime.",
  teamIntro: "Imsuya Global is led by:",
  teamOutro: "Strategy, engineering and delivery all stay in-house.",
  about:
    "Imsuya Global is an AI creative agency and website development studio in Petaling Jaya, Malaysia. One in-house team covers strategy, design, engineering and production across four services — websites, web apps and software, AI, and digital design through to merchandise — for businesses in Malaysia and abroad.",
  industries: (brands: string) =>
    `We've delivered projects across logistics, early education, industrial property, perfume, lubricants and automotive, F&B and premium barbershops. Brands we've worked with include ${brands}.\n\nWhat industry are you in?`,
  merch: (work: string) =>
    `Yes — merchandise is part of our **Digital Design** service: apparel, team kits, venue branding and packaging, designed and produced in-house. Recent work includes ${work}.`,
  seo: "Yes — SEO is built into every website we make, not sold as an extra: structured data, clean URLs, sitemaps, fast performance and answer-shaped content, so you're found on Google and in AI tools like ChatGPT and Google AI Overviews.",
  bot: "I'm Imsuya Global's automated website assistant, not a person. I can answer common questions and pass your brief to the team. If you'd rather talk to someone, WhatsApp the team — a person will reply.",
  thanks: "You're welcome! Anything else I can help with?",
  bye: "Thanks for stopping by! Whenever you're ready, the team is one WhatsApp message away.",
  ack: "Great! What would you like to do next?",
  decline: "No problem. Is there anything else you'd like to know?",
  want: "Happy to help — what would you like to build?",
  switched: "Sure — I'll carry on in English. What can I help with?",
  fallback:
    "I don't have an answer for that one. I can help with our services, our work, pricing and timelines — or you can send the question straight to the team on WhatsApp:",
  fallbackAgain: "Sorry, I'm still not sure. The quickest way is to ask the team directly:",
  sensitive: "Please don't share passwords, card numbers or IC details here — I don't need them.",
  waDefault: "Hi Imsuya Global, I'd like to talk about a project.",
  waTopic: (svc: string) => `Hi Imsuya Global, I'd like to talk about ${svc}.`,
  waQuestion: (q: string) => `Hi Imsuya Global, I have a question: ${q}`,
  mailSubject: "Project enquiry",
  // The brief
  flowStart: "Great — I'll put together a quick brief for the team. It takes about a minute.",
  flowStartService: (svc: string) =>
    `Great — I'll put together a quick brief for the team about **${svc}**. It takes about a minute.`,
  flowStartDescribed: (svc?: string) =>
    svc
      ? `Sounds like a **${svc}** project — I'll put a brief together for the team, with your description already in.`
      : "Sounds like something we can help with — I'll put a brief together for the team, with your description already in.",
  waNamed: (name: string, svc?: string) =>
    `Hi Imsuya Global, I'm ${name} — I'd like to talk about ${svc ?? "a project"}.`,
  askName: "First, what's your name?",
  askNameAgain: "Just your name is fine — what should the team call you?",
  resumeName: "What's your name?",
  resumeContact: "What's the best **email or WhatsApp number** for the team to reply on?",
  resumeDetails: "In a sentence or two, what do you need?",
  askContact: (name: string) => `Thanks, ${name}! What's the best **email or WhatsApp number** for the team to reply on?`,
  askContactAgain:
    "That doesn't look like an email address or a phone number. Could you type it again? For example name@company.com or 012-345 6789.",
  askPhone: "Sure — what's your WhatsApp number? Add the country code if you're outside Malaysia.",
  whyContact: "It's only so the team can reply with next steps and a proposal — it isn't used for anything else.",
  noContact: "No problem — you can send the brief yourself on WhatsApp instead. It's already written:",
  askService: "Which service fits best?",
  askServiceAgain: "Pick one of these, or choose “Not sure yet” — the team will help you decide.",
  askDetails: "Last one: in a sentence or two, what do you need? A deadline or budget helps if you have one.",
  askDetailsAgain: "Could you add a little more? Even one sentence about what you'd like built helps the team.",
  confirm: "Here's your brief. Shall I send it to the team?",
  confirmHint: "Tap **Send to the team** when it looks right, or tell me what to change.",
  editWhat: "What would you like to change?",
  editName: "What name should the team use?",
  editContact: "What's the right email or WhatsApp number?",
  editDetails: "What should the brief say?",
  back: "Back to your brief:",
  cancelled: "No problem — I've cancelled that brief. Anything else I can help with?",
  sent: "Done! Your brief is with the team — they'll reply within one business day.",
  notSent:
    "I couldn't send it automatically just now, but it's ready to go — tap WhatsApp or Email below and it's already filled in.",
  alreadySent: "That brief is already with the team, so I haven't sent it twice. They'll reply within one business day.",
  rows: { name: "Name", contact: "Contact", service: "Service", details: "Details" },
  subject: (who: string) => `Project enquiry: ${who}`,
  notSure: "Not sure yet",
};

type Copy = typeof en;

const ms: Copy = {
  chip: {
    services: "Perkhidmatan kami",
    work: "Lihat kerja kami",
    pricing: "Harga",
    start: "Mulakan projek",
    quote: "Dapatkan sebut harga",
    whatsapp: "Sembang di WhatsApp",
    timeline: "Berapa lama masa diambil?",
    process: "Bagaimana prosesnya?",
    cost: "Berapa kosnya?",
    more: "Tunjuk lagi",
    examples: "Lihat contoh",
    team: "Kenali pasukan",
    send: "Hantar kepada pasukan",
    edit: "Ubah sesuatu",
    cancel: "Batal",
    notSure: "Belum pasti",
    fieldName: "Nama",
    fieldContact: "E-mel atau WhatsApp",
    fieldService: "Perkhidmatan",
    fieldDetails: "Butiran",
  },
  and: "dan",
  greet:
    "Hai! Saya pembantu Imsuya Global. Saya boleh terangkan perkhidmatan kami, tunjukkan kerja kami, jelaskan cara harga dan tempoh projek, atau hantar taklimat projek anda terus kepada pasukan. Apa yang anda sedang rancang?",
  greetAgain: "Hai lagi! Apa yang boleh saya bantu?",
  greetOnService: (svc) =>
    `Hai! Anda sedang melihat **${svc}** — saya boleh terangkan apa yang termasuk, tunjukkan contoh, atau hantar taklimat anda kepada pasukan.`,
  meet: (name) =>
    `Selamat berkenalan, ${name}! Saya boleh terangkan perkhidmatan kami, tunjukkan kerja kami, atau hantar taklimat projek anda terus kepada pasukan. Apa yang anda sedang rancang?`,
  servicesIntro: "Kami satu pasukan dalaman dengan empat perkhidmatan:",
  servicesAsk: "Yang mana satu anda mahu tahu dengan lebih lanjut?",
  serviceYes: (title) => `Ya — itu perkhidmatan **${title}** kami.`,
  included: "Termasuk:",
  briefOffer: "Mahu saya sediakan taklimat untuk pasukan?",
  serviceMix: (a, b) =>
    `Itu kedengaran seperti gabungan **${a}** dan **${b}** — kami buat kedua-duanya secara dalaman, jadi ia boleh jadi satu projek. Yang mana anda mahu dengar dahulu?`,
  workIntro: "Ini antara projek terbaru kami — tekan untuk kajian kes penuh.",
  workMore: "Ini beberapa lagi:",
  workAll: "Itu semuanya — halaman portfolio memaparkan semua kerja kami di satu tempat.",
  workSector: (sector) => `Ini kerja kami dalam bidang ${sector}:`,
  workWebsite: "Beberapa laman web yang kami reka dan bina:",
  workSoftware: "Perisian yang sudah kami lancarkan:",
  workAi: "AI yang sudah kami lancarkan dan beroperasi hari ini:",
  workDesign: "Kerja jenama dan reka bentuk kami:",
  crm: "**Legendary Retail CRM** — CRM operasi runcit yang dibina untuk rangkaian kedai Legendary.",
  merchLine: (names) => `Kami juga mereka dan menghasilkan barangan, untuk jenama seperti ${names}.`,
  pricing:
    "Kami menyebut harga setiap projek mengikut skop, bukan pakej tetap — harga bergantung pada ciri, bilangan halaman, integrasi dan kerja reka bentuk. Anda menerima cadangan bertulis dengan harga dan garis masa yang jelas sebelum kerja bermula, tanpa sebarang ikatan.",
  pricingOffer: "Mahu sebut harga? Ceritakan sedikit tentang projek anda dan saya akan hantar kepada pasukan.",
  timeline:
    "Laman web pemasaran yang fokus biasanya mengambil masa **empat hingga enam minggu**. Aplikasi web dan sistem AI mengambil masa lebih lama bergantung pada skop — anda akan menerima pelan pencapaian bertarikh sebelum projek bermula.",
  processIntro: "Setiap projek melalui enam langkah:",
  processOutro: "Anda akan menerima skop, harga dan tarikh secara bertulis sebelum apa-apa dibina.",
  ownership:
    "Anda memiliki segalanya selepas pelancaran — domain, akaun hosting dan kod sumber penuh. Kami serahkan akses lengkap berserta panduan, supaya pasukan anda boleh mengubah kandungan tanpa memanggil pembangun.",
  support:
    "Pelancaran ialah permulaan, bukan penamat. Kami kekal untuk penambahbaikan, pemantauan dan sokongan, dan kebanyakan pelanggan meneruskan secara bulanan untuk kandungan, penambahbaikan dan ciri baharu.",
  contact: `Anda boleh hubungi pasukan secara terus:\n- **WhatsApp:** ${site.whatsappDisplay}\n- **E-mel:** ${site.email}\n- **Waktu:** Isnin hingga Jumaat, 9 pagi hingga 6 petang (waktu Malaysia)\n\nMereka membalas dalam satu hari bekerja.`,
  location: `Studio kami di **Damansara Perdana, Petaling Jaya**:\n${office.lines.join("\n")}\n\nKami juga bekerja secara jarak jauh dengan pelanggan di seluruh Asia, Afrika dan Timur Tengah, dengan sesi semakan mengikut zon masa anda. Peta ada di halaman hubungi kami.`,
  abroad:
    "Ya — kami bekerja dengan pelanggan di seluruh Asia, Afrika dan Timur Tengah. Projek dijalankan secara jarak jauh, dengan sesi semakan dijadualkan mengikut zon masa anda. Studio kami terletak di Damansara Perdana, Petaling Jaya, Malaysia.",
  hours:
    "Kami beroperasi **Isnin hingga Jumaat, 9 pagi hingga 6 petang** waktu Malaysia. Mesej di luar waktu pejabat dibalas pada hari bekerja berikutnya — dan saya sedia membantu sepanjang masa.",
  teamIntro: "Imsuya Global diterajui oleh:",
  teamOutro: "Strategi, kejuruteraan dan penyampaian semuanya dikendalikan secara dalaman.",
  about:
    "Imsuya Global ialah agensi kreatif AI dan studio pembangunan laman web di Petaling Jaya, Malaysia. Satu pasukan dalaman mengendalikan strategi, reka bentuk, kejuruteraan dan produksi merentas empat perkhidmatan — laman web, aplikasi web dan perisian, AI, serta reka bentuk digital hingga barangan — untuk perniagaan di Malaysia dan luar negara.",
  industries: (brands) =>
    `Kami telah menyiapkan projek dalam bidang logistik, pendidikan awal, hartanah industri, minyak wangi, pelincir dan automotif, makanan dan minuman serta kedai gunting premium. Antara jenama yang pernah bekerjasama dengan kami: ${brands}.\n\nAnda dalam industri apa?`,
  merch: (work) =>
    `Ya — barangan ialah sebahagian daripada perkhidmatan **Reka Bentuk Digital** kami: pakaian, kit pasukan, penjenamaan premis dan pembungkusan, direka dan dihasilkan secara dalaman. Antara kerja terkini: ${work}.`,
  seo: "Ya — SEO dibina dalam setiap laman web kami, bukan dijual sebagai tambahan: data berstruktur, URL yang kemas, peta laman, prestasi pantas dan kandungan berbentuk jawapan, supaya anda ditemui di Google dan dalam alat AI seperti ChatGPT dan Google AI Overviews.",
  bot: "Saya pembantu laman web automatik Imsuya Global, bukan manusia. Saya boleh menjawab soalan lazim dan menghantar taklimat anda kepada pasukan. Jika anda mahu bercakap dengan seseorang, WhatsApp pasukan kami — seorang ahli pasukan akan membalas.",
  thanks: "Sama-sama! Ada apa-apa lagi yang boleh saya bantu?",
  bye: "Terima kasih kerana singgah! Bila-bila masa anda bersedia, pasukan kami hanya satu mesej WhatsApp sahaja.",
  ack: "Baik! Apa yang anda mahu buat seterusnya?",
  decline: "Tiada masalah. Ada apa-apa lagi yang anda ingin tahu?",
  want: "Dengan senang hati — apa yang anda mahu bina?",
  switched: "Boleh! Saya akan teruskan dalam Bahasa Malaysia. Apa yang boleh saya bantu?",
  fallback:
    "Saya tiada jawapan untuk soalan itu. Saya boleh bantu tentang perkhidmatan, kerja kami, harga dan tempoh — atau anda boleh hantar soalan itu terus kepada pasukan di WhatsApp:",
  fallbackAgain: "Maaf, saya masih kurang pasti. Cara paling cepat ialah bertanya terus kepada pasukan:",
  sensitive: "Jangan kongsi kata laluan, nombor kad atau butiran IC di sini — saya tidak memerlukannya.",
  waDefault: "Hai Imsuya Global, saya ingin berbincang tentang satu projek.",
  waTopic: (svc) => `Hai Imsuya Global, saya ingin berbincang tentang ${svc}.`,
  waQuestion: (q) => `Hai Imsuya Global, saya ada soalan: ${q}`,
  mailSubject: "Pertanyaan projek",
  flowStart: "Bagus — saya akan sediakan taklimat ringkas untuk pasukan. Ia hanya mengambil masa kira-kira seminit.",
  flowStartService: (svc) =>
    `Bagus — saya akan sediakan taklimat ringkas untuk pasukan tentang **${svc}**. Ia hanya mengambil masa kira-kira seminit.`,
  flowStartDescribed: (svc) =>
    svc
      ? `Kedengaran seperti projek **${svc}** — saya akan sediakan taklimat untuk pasukan, dengan penerangan anda sudah dimasukkan.`
      : "Kedengaran seperti sesuatu yang boleh kami bantu — saya akan sediakan taklimat untuk pasukan, dengan penerangan anda sudah dimasukkan.",
  waNamed: (name, svc) => `Hai Imsuya Global, saya ${name} — saya ingin berbincang tentang ${svc ?? "satu projek"}.`,
  askName: "Pertama, siapa nama anda?",
  askNameAgain: "Nama sahaja sudah memadai — pasukan patut panggil anda apa?",
  resumeName: "Siapa nama anda?",
  resumeContact: "Apakah **e-mel atau nombor WhatsApp** terbaik untuk pasukan membalas?",
  resumeDetails: "Dalam satu atau dua ayat, apa yang anda perlukan?",
  askContact: (name) => `Terima kasih, ${name}! Apakah **e-mel atau nombor WhatsApp** terbaik untuk pasukan membalas?`,
  askContactAgain:
    "Itu tidak kelihatan seperti alamat e-mel atau nombor telefon. Boleh taip semula? Contohnya nama@syarikat.com atau 012-345 6789.",
  askPhone: "Boleh — apakah nombor WhatsApp anda? Tambah kod negara jika anda di luar Malaysia.",
  whyContact:
    "Ia hanya supaya pasukan boleh membalas dengan langkah seterusnya dan cadangan — ia tidak digunakan untuk tujuan lain.",
  noContact: "Tiada masalah — anda boleh hantar taklimat ini sendiri melalui WhatsApp. Ia sudah ditulis:",
  askService: "Perkhidmatan mana yang paling sesuai?",
  askServiceAgain: "Pilih salah satu, atau pilih “Belum pasti” — pasukan akan bantu anda memilih.",
  askDetails:
    "Akhir sekali: dalam satu atau dua ayat, apa yang anda perlukan? Tarikh akhir atau bajet membantu jika ada.",
  askDetailsAgain: "Boleh tambah sedikit lagi? Satu ayat tentang apa yang anda mahu bina pun sudah membantu pasukan.",
  confirm: "Ini taklimat anda. Boleh saya hantar kepada pasukan?",
  confirmHint: "Tekan **Hantar kepada pasukan** jika semuanya betul, atau beritahu saya apa yang perlu diubah.",
  editWhat: "Apa yang anda mahu ubah?",
  editName: "Nama apa yang patut digunakan oleh pasukan?",
  editContact: "Apakah e-mel atau nombor WhatsApp yang betul?",
  editDetails: "Apa yang patut dinyatakan dalam taklimat ini?",
  back: "Kembali kepada taklimat anda:",
  cancelled: "Tiada masalah — taklimat itu telah dibatalkan. Ada apa-apa lagi yang boleh saya bantu?",
  sent: "Siap! Taklimat anda sudah sampai kepada pasukan — mereka akan membalas dalam satu hari bekerja.",
  notSent:
    "Saya tidak dapat menghantarnya secara automatik sekarang, tetapi ia sudah sedia — tekan WhatsApp atau E-mel di bawah, semuanya sudah diisi.",
  alreadySent:
    "Taklimat itu sudah sampai kepada pasukan, jadi saya tidak menghantarnya dua kali. Mereka akan membalas dalam satu hari bekerja.",
  rows: { name: "Nama", contact: "Hubungan", service: "Perkhidmatan", details: "Butiran" },
  subject: (who) => `Pertanyaan projek: ${who}`,
  notSure: "Belum pasti",
};

const T: Record<Lang, Copy> = { en, ms };

/* -------------------------------------------------------------------------- */
/* Reading a message                                                           */
/* -------------------------------------------------------------------------- */

type Intent =
  | "greet"
  | "thanks"
  | "bye"
  | "yes"
  | "no"
  | "cancel"
  | "lang_ms"
  | "lang_en"
  | "bot"
  | "services"
  | "work"
  | "pricing"
  | "timeline"
  | "process"
  | "ownership"
  | "support"
  | "contact"
  | "location"
  | "hours"
  | "team"
  | "about"
  | "industries"
  | "merch"
  | "seo"
  | "start"
  | "want";

const GREETING =
  /^(hi+|hello+|hey+|hai+|helo+|hallo|hiya|howdy|yo|salam|assalamualaikum|assalammualaikum|asalamualaikum|selamat (pagi|petang|malam|tengah hari|tengahari|sejahtera)|good (morning|afternoon|evening|day))\b( there| team| imsuya)?/;

/** Patterns over normalized text, each adding its weight to an intent. */
const RULES: [Intent, RegExp, number][] = [
  ["greet", GREETING, 2],
  ["thanks", /\b(thanks?|thank (you|u)|thx|tq|tqvm|ty|terima kasih|trima kasih|appreciate (it|that)|cheers)\b/, 3],
  ["bye", /\b(bye+|goodbye|good bye|see (you|ya)|jumpa lagi|selamat tinggal|(chat|talk) later|thats all|that is all|itu (sahaja|saja|je)|tu je)\b/, 3],
  [
    "yes",
    /^(yes+|yeah|yea|yep|yup|ya+|ye|sure|alright|confirm(ed)?|correct|go ahead|please do|do it|sounds good|lets (do it|go)|setuju|haah|of course|definitely|absolutely)\b/,
    3,
  ],
  // "boleh" and "ok" open plenty of questions ("boleh buat logo?"), so on
  // their own only.
  ["yes", /^(ok+|okay|okey|boleh|baik|betul)( (je|lah|sahaja|saja|please|thanks|thank you|terima kasih|sure))?$/, 3],
  ["no", /^(no+|nope|nah|not (now|yet|really)|maybe later|later|tak+|tidak|tak nak|tidak mahu|bukan|nanti( dulu)?|lain kali)\b/, 3],
  ["cancel", /\b(cancel|batal(kan)?|never ?mind|forget (it|about it)|tak jadi|start (over|again)|restart)\b/, 4],
  [
    "lang_ms",
    /\b((speak|talk|chat|reply|write|answer|continue) (in )?(malay|bahasa|bm)|in (malay|bahasa melayu|bahasa malaysia|bm)|bahasa (melayu|malaysia)|cakap melayu|guna bahasa)\b/,
    6,
  ],
  [
    "lang_en",
    /\b((speak|talk|chat|reply|write|answer|continue) (in )?english|in english|english please|bahasa inggeris|cakap (english|inggeris)|guna (english|bahasa inggeris))\b/,
    6,
  ],
  [
    "bot",
    /\b(are (you|u) (a |an )?(bot|robot|human|real|real person|person|ai|machine|chatbot)|(am i|are we) (talking|speaking|chatting) (to|with)|is this (a )?(bot|human|real person|chatbot|live chat)|(anda|awak) (bot|robot|manusia)|(ni|ini) bot|bot ke)\b/,
    5,
  ],
  [
    "services",
    /\b(services?|what (do|can) (you|u|imsuya)( guys)? (do|build|make|offer|provide)|what (you|u) (do|build|offer)|what does imsuya( global)? do|offerings?|perkhidmatan|servis|apa (yang )?(anda|awak|korang|kamu|you) (buat|bina|tawarkan|sediakan|boleh buat)|apa (servis|perkhidmatan))\b/,
    3,
  ],
  [
    "work",
    /\b(portfolios?|case stud(y|ies)|examples?|samples?|(past|previous|recent|your) (work|projects?|clients)|show (me )?(your |some |more )?(work|projects?|examples?|portfolio)|what have you (built|done|made)|contoh|hasil kerja|kerja (anda|kamu|awak|lepas|terdahulu|kami)|projek (lepas|terdahulu|anda|kamu)|tunjuk(kan)? (kerja|projek|contoh))\b|^(work|projects?|kerja|projek)$/,
    3,
  ],
  ["work", /\b(work|projects?|kerja|projek)\b/, 1],
  [
    "pricing",
    /\b(price|prices|pricing|cost|costs|costing|how much|budget|rates?|fees?|charges?|packages?|expensive|cheap|affordable|harga|kos|bajet|caj|pakej|murah|mahal|rm ?\d+)\b/,
    3,
  ],
  ["pricing", /\b(quote|quotation|sebut harga|berapa)\b/, 2],
  [
    "timeline",
    /\b(how long|how many (weeks|months|days)|timeline|time ?frame|turnaround|duration|deadline|lead time|how (fast|quickly|soon)|when (can|will|would) (you|it|we) (start|be ready|be done|launch|finish|deliver)|berapa lama|tempoh|jangka masa|bila (boleh )?siap|berapa (minggu|bulan|hari)|cepat siap)\b/,
    4,
  ],
  ["timeline", /\b(\d+ (weeks?|days?|months?|minggu|hari|bulan)|urgent|urgently|asap|rush|segera)\b/, 3],
  [
    "process",
    /\b(process|how (does it|do you|will it|would it|does this) work|steps?|workflow|methodology|your approach|proses|langkah|cara (kerja|anda bekerja)|macam mana (anda|korang) (buat|kerja)|bagaimana (ia|anda) (bekerja|berfungsi))\b/,
    3,
  ],
  [
    "ownership",
    /\b(who owns|ownership|own the (code|site|website|design)|source code|the code|hosting|domain|hand ?over|handover|pemilikan|kod sumber|siapa (yang )?(punya|milik))\b/,
    4,
  ],
  [
    "support",
    /\b(support|maintenance|maintain|after (launch|the launch|go live|going live|it launches)|retainer|bug fix(es)?|ongoing|sokongan|penyelenggaraan|selenggara|selepas pelancaran|lepas siap)\b/,
    3,
  ],
  [
    "contact",
    /\b(contact|reach (you|the team|someone|a person)|get in touch|talk to|speak (to|with)|call (you|me|back)|phone|whatsapp|whats app|wasap|wassap|watsapp|wsap|email|e mail|emel|e mel|human|real person|a person|someone|representative|customer service|hubungi|telefon|nombor|bercakap|cakap dengan|orang sebenar|manusia)\b/,
    3,
  ],
  [
    "location",
    /\b(where are (you|u)|where is (your|the) (office|studio)|location|located|address|your office|office|based (in|at)|where (are )?(you|u) based|visit (you|your)|map|directions|overseas|abroad|international|outside malaysia|other countries|lokasi|alamat|pejabat|di ?mana|kat mana|luar negara)\b/,
    3,
  ],
  [
    "hours",
    /\b(opening hours|office hours|business hours|working hours|hours|open (on|today|now|at|during)|are (you|u) open|closed|weekends?|saturday|sunday|public holidays?|waktu (operasi|pejabat|kerja|perniagaan)|buka|tutup|hari (sabtu|ahad|minggu))\b/,
    3,
  ],
  [
    "team",
    /\b(team|who (is|are) (behind|running|in charge)|founders?|owner|ceo|cto|director|staff|employees|people behind|imran|rishikesh|sumaiya|pasukan|pengasas|pengarah|pemilik|kakitangan)\b/,
    3,
  ],
  [
    "about",
    /\b(about (you|imsuya|the company|your company)|who are (you|u)|what is imsuya|tell me about (you|yourselves|imsuya|the company)|company profile|tentang (anda|imsuya|syarikat)|siapa (anda|imsuya)|imsuya ni)\b/,
    3,
  ],
  [
    "industries",
    /\b(industr(y|ies)|sectors?|niches?|what kind of (clients|businesses|companies)|which (clients|businesses|companies|brands)|(clients|customers|brands) (you|youve|you have)|who (have you|do you) (work(ed)? (with|for))|worked with|bidang|industri|sektor|jenis perniagaan|pelanggan|jenama (yang|apa))\b/,
    3,
  ],
  [
    "merch",
    /\b(merch|merchandise|apparel|t ?shirts?|tshirts?|tees|jerseys?|uniforms?|caps|hoodies?|packaging|souvenirs?|corporate gifts?|barangan|baju|pakaian|cenderamata|pembungkusan|hadiah korporat)\b/,
    3,
  ],
  ["seo", /\b(seo|geo|aeo|search engines?|google (ranking|search|results?)|rank(ing)? on google|found on google|ai overviews?)\b/, 3],
  [
    "start",
    /\b(start(ing)? a project|get started|kick ?off|hire (you|your team|imsuya)|work with (you|imsuya)|book a (call|meeting|consultation)|(get|need|want|request|send|give)( me)? (a |an )?(quote|quotation|proposal|estimate)|how (do|can) (i|we) (start|begin|get started|hire|engage)|lets (start|begin|work)|mulakan( projek)?|mula projek|minta sebut harga|dapatkan sebut harga)\b/,
    4,
  ],
  [
    "want",
    /\b((i|we) (want|need|would like|wanna|am looking for|are looking for|m looking for|re looking for|am interested in|are interested in)|im (looking for|interested in)|looking for (a|an|someone)|interested in (a|an|getting|building|your)|nak (buat|bina|start)|(saya|kami) (mahu|nak|ingin|perlukan|perlu|berminat|cari)|berminat (untuk|dengan)|tempah)\b/,
    2,
  ],
];

/** Which intent wins a tie: the more specific question first. */
const PRIORITY: Intent[] = [
  "lang_ms",
  "lang_en",
  "bot",
  "cancel",
  "seo",
  "timeline",
  "pricing",
  "ownership",
  "process",
  "support",
  "hours",
  "location",
  "team",
  "merch",
  "industries",
  "contact",
  "work",
  "start",
  "services",
  "about",
  "want",
  "thanks",
  "bye",
  "yes",
  "no",
  "greet",
];

/** Intents that can be answered in the middle of a brief without losing it. */
const INFO = new Set<Intent>([
  "services",
  "work",
  "pricing",
  "timeline",
  "process",
  "ownership",
  "support",
  "contact",
  "location",
  "hours",
  "team",
  "about",
  "industries",
  "merch",
  "seo",
  "bot",
]);

function intentOf(text: string): Intent | undefined {
  const scores = new Map<Intent, number>();
  for (const [intent, pattern, weight] of RULES) {
    if (pattern.test(text)) scores.set(intent, (scores.get(intent) ?? 0) + weight);
  }
  let best: Intent | undefined;
  let bestScore = 1;
  for (const intent of PRIORITY) {
    const score = scores.get(intent) ?? 0;
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  return best;
}

/** "Can you…?", "Do you…?" — asked first thing, so the answer opens with a yes. */
const CAPABILITY =
  /^(can (you|u|imsuya)|could (you|u)|do (you|u)( guys)?|are (you|u) able|is it possible|boleh (tak|ke|anda|awak|korang|buat|bina|reka)|adakah anda|(anda|awak|korang) (buat|boleh))\b/;
/** A visitor saying who they are, outside the brief. */
const INTRODUCES = /^(my name is|my names|my name s|name is|nama saya|call me|panggil saya)\b/;
/** "I'm Aisyah" — over the raw text, so the name has to be capitalised to count. */
const INTRODUCES_SHORT = /^(?:[Ii]['’]?m|[Ii] am|[Tt]his is|[Ss]aya)\s+\p{Lu}[\p{L}'-]*(?:\s\p{Lu}[\p{L}'-]*)?[.!]?$/u;
/** "What is AI automation?" is a definition, which the FAQs give better than a service page. */
const DEFINES = /^(what is|whats|what are|what does .+ mean|apa itu|apakah|maksud)\b/;
/** "Do you have…", "any…": asking about past work rather than the service. */
const ASKS_FOR_WORK = /\b(have you|do you have|any|ever|done|built|made|worked|pernah|ada)\b/;
const ABROAD = /\b(overseas|abroad|international|outside malaysia|other countries|remote(ly)?|luar negara)\b/;
const QUESTION =
  /^(what|whats|how|why|when|where|who|which|can|could|do|does|is|are|will|would|apa|apakah|bagaimana|macam mana|berapa|bila|siapa|kenapa|mengapa|boleh|adakah|di mana)\b/;
const NOT_SURE =
  /\b(not sure|unsure|dont know|do not know|no idea|any|either|both|all of (them|it)|tak pasti|belum pasti|tidak pasti|tak tahu|tidak tahu|semua)\b/;
const CHANGE = /\b(change|edit|wrong|update|fix|correct|ubah|tukar|salah|betulkan|kemas kini)\b/;
const SEND = /\b(send|submit|hantar|go ahead|confirm)\b/;
const WHY = /\b(why|what for|kenapa|mengapa|untuk apa)\b/;
const WANTS_PHONE = /\b(whatsapp|wasap|phone|number|nombor|telefon)\b/;
const DESCRIBES =
  /\b(we|our|my|i|kami|saya)\b.*\b(want|need|looking|build|create|develop|make|launch|redesign|revamp|upgrade|sell|customers?|clients?|patients?|students?|booking|online|mahu|nak|perlukan|perlu|bina|buat|jual|pelanggan)\b/;
const SENSITIVE = /\b(?:\d[ -]?){13,19}\b|\b(password|passcode|kata laluan|cvv|nric|mykad|ic number|nombor ic|passport number)\b/i;

const words = (text: string) => (text ? text.split(" ").length : 0);
const isQuestion = (raw: string, text: string) => /\?\s*$/.test(raw) || QUESTION.test(text);

/* Telling which language a message is in. Words both languages share, and
   names and addresses, count for neither. */
const MS_WORDS = new Set(
  "saya anda awak kamu korang kami kita apa apakah bagaimana macam berapa boleh nak mahu hendak ingin tak tidak tiada ada untuk dengan yang ini itu dan atau juga sahaja saja harga kos laman buat bina membina reka projek perkhidmatan hubungi terima kasih selamat pagi petang malam hai helo salam assalamualaikum ya tolong sila lama siapa pasukan contoh kerja syarikat perniagaan kedai minggu bulan bajet nombor emel nama sebut berminat mula mulakan perlu perlukan cari dah sudah belum lagi pun ke di dari pada bila kenapa mengapa baik betul tahu faham mana punya sikit banyak sistem aplikasi perisian jenama pejabat alamat bagi dapat mohon tunjuk tunjukkan lihat je ni tu kat".split(
    " "
  )
);
const EN_WORDS = new Set(
  "i you your we what how much many can could would do does did the is are my me want need website websites price cost project projects show work please hello hi hey thanks thank team who where when long time design app help get make build looking for about with have has this that it of to in and or examples services office quote".split(
    " "
  )
);

const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE = /(?:\+|\b)\d[\d\s().-]{5,18}\d\b/;

/**
 * The language a message is written in, if it gives one away. Addresses and
 * numbers are taken out first — the ".my" of a Malaysian email reads as the
 * English "my" — and a longer message needs two telltale words, not one.
 */
function detectLang(raw: string): Lang | undefined {
  const words = normalize(
    raw
      .replace(new RegExp(EMAIL.source, "gi"), " ")
      .replace(new RegExp(PHONE.source, "g"), " ")
      .replace(/https?:\/\/\S+|www\.\S+/gi, " ")
  )
    .split(" ")
    .filter(Boolean);
  let m = 0;
  let e = 0;
  for (const w of words) {
    if (MS_WORDS.has(w)) m++;
    else if (EN_WORDS.has(w)) e++;
  }
  const enough = (n: number) => n >= 2 || (n === 1 && words.length <= 3);
  if (m > e && enough(m)) return "ms";
  if (e > m && enough(e)) return "en";
  return undefined;
}

function parseContact(raw: string): { email?: string; phone?: string } {
  const email = raw.match(EMAIL)?.[0];
  const candidate = raw.replace(EMAIL, " ").match(PHONE)?.[0]?.trim();
  const digits = candidate?.replace(/\D/g, "").length ?? 0;
  return { email, phone: candidate && digits >= 7 && digits <= 15 ? candidate : undefined };
}

/** "my name is aisyah from Kedai Roti" -> "Aisyah". Null when it isn't a name. */
function parseName(raw: string): string | null {
  let t = raw
    .replace(EMAIL, " ")
    .replace(PHONE, " ")
    .trim()
    .replace(/^(hi|hello|hey|hai|helo|salam)[\s,!.]+/i, "")
    .replace(/^(my name is|my name's|my names|name is|name's|i am|i'm|im|this is|it's|its|call me|nama saya|saya|panggil saya|nama)\s+/i, "")
    .replace(/[\s.!?,;:]+$/g, "")
    .trim();
  const cut = t.search(/\s(from|at|dari|daripada|of|here)\b/i);
  if (cut > 0) t = t.slice(0, cut).trim();
  t = t.replace(/[\s,;:]+$/g, "");
  if (!t || t.length > 60 || /\d|@/.test(t) || !/\p{L}/u.test(t)) return null;
  const parts = t.split(/\s+/);
  if (parts.length > 5) return null;
  return t === t.toLowerCase() ? parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : t;
}

/** Control characters out, runs of spaces and blank lines tidied, length capped. */
const clean = (s: string, max = 2000) =>
  s
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);

/** Card numbers never travel with a brief, even if a visitor types one. */
const scrub = (s: string) => s.replace(/\b(?:\d[ -]?){13,19}\b/g, "[removed]");

/* -------------------------------------------------------------------------- */
/* Writing a reply                                                             */
/* -------------------------------------------------------------------------- */

const uid = () => Math.random().toString(36).slice(2, 10);
const chip = (label: string, value: string): Choice => ({ label, value });

function compose(lang: Lang) {
  const parts: Part[] = [];
  let choices: Choice[] = [];
  const self = {
    lang,
    say(text: string) {
      parts.push({ type: "text", text });
      return self;
    },
    show(action: AssistantAction) {
      parts.push({ type: "action", action });
      return self;
    },
    chips(list: Choice[]) {
      choices = list;
      return self;
    },
    reply(): Reply {
      return { id: uid(), role: "assistant", lang, parts, ...(choices.length ? { choices } : {}) };
    },
  };
  return self;
}

type Composer = ReturnType<typeof compose>;

const svcShort = (slug: string, lang: Lang) =>
  slug === "not-sure" ? T[lang].notSure : (serviceBySlug(slug)?.short[lang] ?? slug);

const serviceOnPage = (page: string) => {
  const slug = page.match(/^\/services\/([a-z0-9-]+)/)?.[1];
  return slug && serviceBySlug(slug) ? slug : undefined;
};

const mailto = (subject: string, body: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const basics = (lang: Lang): Choice[] => {
  const c = T[lang].chip;
  return [chip(c.services, "intent:services"), chip(c.work, "intent:work"), chip(c.pricing, "intent:pricing"), chip(c.start, "intent:start")];
};

const sectorChips = (lang: Lang) => SECTORS.slice(0, 4).map((x) => chip(x.label[lang], `work:${x.key}`));

const contactAction = (lang: Lang, topic?: string): AssistantAction => {
  const c = T[lang];
  const message = topic ? c.waTopic(svcShort(topic, lang)) : c.waDefault;
  return { kind: "contact", whatsappHref: whatsappLink(message), mailtoHref: mailto(c.mailSubject, message) };
};

/* -------------------------------------------------------------------------- */
/* Answers                                                                     */
/* -------------------------------------------------------------------------- */

function greet(r: Composer, s: BrainState, ctx: Context) {
  const c = T[r.lang];
  const onPage = serviceOnPage(ctx.page);
  if (s.greeted) r.say(c.greetAgain).chips(basics(r.lang));
  else if (onPage) {
    s.topic = onPage;
    r.say(c.greetOnService(svcShort(onPage, r.lang))).chips([
      chip(c.chip.examples, `swork:${onPage}`),
      chip(c.chip.cost, "intent:pricing"),
      chip(c.chip.start, `start:${onPage}`),
    ]);
  } else r.say(c.greet).chips(basics(r.lang));
  s.greeted = true;
}

function servicesOverview(r: Composer) {
  const c = T[r.lang];
  const lines = services.map((s) => `- **${s.short[r.lang]}** — ${s.tagline[r.lang]}`);
  r.say(`${c.servicesIntro}\n${lines.join("\n")}\n\n${c.servicesAsk}`)
    .show({ kind: "links", links: [pageLink("/services", r.lang)] })
    .chips([...services.map((s) => chip(s.short[r.lang], `svc:${s.slug}`)), chip(c.chip.start, "intent:start")]);
}

function serviceDetail(r: Composer, s: BrainState, slug: string, yes = false) {
  const svc = serviceBySlug(slug);
  if (!svc) return servicesOverview(r);
  const c = T[r.lang];
  const lead = yes ? c.serviceYes(svc.title[r.lang]) : `**${svc.title[r.lang]}**`;
  const features = svc.features.map((f) => `- **${f.name[r.lang]}** — ${f.detail[r.lang]}`).join("\n");
  r.say(`${lead}\n${svc.description[r.lang]}\n\n${c.included}\n${features}\n\n${c.briefOffer}`)
    .show({ kind: "links", links: [pageLink(`/services/${slug}`, r.lang)] })
    .chips([
      chip(c.chip.examples, `swork:${slug}`),
      chip(c.chip.cost, "intent:pricing"),
      chip(c.chip.start, `start:${slug}`),
    ]);
  s.topic = slug;
  s.offer = "brief";
}

function serviceMix(r: Composer, a: string, b: string) {
  const c = T[r.lang];
  r.say(c.serviceMix(svcShort(a, r.lang), svcShort(b, r.lang))).chips([
    chip(svcShort(a, r.lang), `svc:${a}`),
    chip(svcShort(b, r.lang), `svc:${b}`),
    chip(c.chip.start, "intent:start"),
  ]);
}

const SHOWCASE = projects.filter((p) => p.image).map((p) => p.slug);

/** Up to three case studies the visitor hasn't seen yet, preferred ones first. */
function freshProjects(s: BrainState, prefer: string[] = []): Project[] {
  return [...new Set([...prefer, ...SHOWCASE])]
    .filter((slug) => !s.seen.includes(slug))
    .slice(0, 3)
    .map(projectBySlug)
    .filter((p): p is Project => Boolean(p));
}

function showProjects(r: Composer, s: BrainState, picks: Project[]) {
  s.seen.push(...picks.map((p) => p.slug).filter((slug) => !s.seen.includes(slug)));
  r.show({ kind: "work", projects: picks.map((p) => card(p, r.lang)) });
}

function work(r: Composer, s: BrainState, ctx: Context) {
  const c = T[r.lang];
  const onPage = serviceOnPage(ctx.page);
  const picks = freshProjects(s, onPage ? serviceBySlug(onPage)?.related : []);
  if (!picks.length) {
    s.seen = [];
    r.say(c.workAll)
      .show({ kind: "links", links: [pageLink("/portfolio", r.lang)] })
      .chips([...sectorChips(r.lang), chip(c.chip.start, "intent:start")]);
    return;
  }
  r.say(s.seen.length ? c.workMore : c.workIntro);
  showProjects(r, s, picks);
  r.show({ kind: "links", links: [pageLink("/portfolio", r.lang)] }).chips([
    chip(c.chip.more, "more:"),
    ...sectorChips(r.lang).slice(0, 3),
    chip(c.chip.start, "intent:start"),
  ]);
}

function sectorWork(r: Composer, s: BrainState, key: string) {
  const sector = SECTORS.find((x) => x.key === key);
  if (!sector) return;
  const c = T[r.lang];
  const picks = sector.projects.map(projectBySlug).filter((p): p is Project => Boolean(p));
  r.say(c.workSector(sector.label[r.lang].toLowerCase()));
  showProjects(r, s, picks.slice(0, 3));
  r.chips([
    chip(c.chip.more, "more:"),
    ...sectorChips(r.lang).filter((x) => x.value !== `work:${key}`).slice(0, 2),
    chip(c.chip.start, "intent:start"),
  ]);
}

/** One line per live build: name, what it is, what it does. */
const liveBuilds = (lang: Lang) =>
  aiProducts.map((a) => `- **${a.name}** (${a.kind[lang]}) — ${firstSentence(a.summary[lang])}`);

function serviceWork(r: Composer, s: BrainState, slug: string) {
  const c = T[r.lang];
  const svc = serviceBySlug(slug);
  if (!svc) return;
  if (slug === "ai-products") {
    r.say(`${c.workAi}\n${[...liveBuilds(r.lang), `- ${c.crm}`].join("\n")}`).show({
      kind: "links",
      links: [pageLink("/services/ai-products", r.lang), pageLink("/services/custom-web-applications", r.lang)],
    });
  } else if (slug === "custom-web-applications") {
    r.say(`${c.workSoftware}\n${liveBuilds(r.lang).join("\n")}`);
    showProjects(r, s, svc.related.map(projectBySlug).filter((p): p is Project => Boolean(p)));
    r.show({ kind: "links", links: [pageLink(`/services/${slug}`, r.lang)] });
  } else if (slug === "custom-digital-design") {
    r.say(c.workDesign);
    showProjects(r, s, svc.related.map(projectBySlug).filter((p): p is Project => Boolean(p)));
    r.say(c.merchLine(join(merchandise.slice(0, 3).map((m) => m.name), c.and))).show({
      kind: "links",
      links: [pageLink(`/services/${slug}`, r.lang)],
    });
  } else {
    r.say(c.workWebsite);
    showProjects(r, s, freshProjects({ ...s, seen: [] }, svc.related));
    r.show({ kind: "links", links: [pageLink("/portfolio", r.lang)] });
  }
  r.say(c.briefOffer).chips([chip(c.chip.cost, "intent:pricing"), chip(c.chip.start, `start:${slug}`)]);
  s.topic = slug;
  s.offer = "brief";
}

function projectDetail(r: Composer, s: BrainState, p: Project) {
  const c = T[r.lang];
  r.say(`**${p.name}** — ${p.sector[r.lang]}. ${p.summary[r.lang]}`);
  showProjects(r, s, [p]);
  r.chips([chip(c.chip.more, "more:"), chip(c.chip.start, "intent:start")]);
}

function pricing(r: Composer, s: BrainState) {
  const c = T[r.lang];
  // Mid-brief, the visitor is already doing what the offer would ask.
  r.say(s.flow ? c.pricing : `${c.pricing}\n\n${c.pricingOffer}`).chips([
    chip(c.chip.quote, s.topic ? `start:${s.topic}` : "intent:start"),
    chip(c.chip.whatsapp, "intent:contact"),
    chip(c.chip.timeline, "intent:timeline"),
  ]);
  if (!s.flow) s.offer = "brief";
}

function processSteps(r: Composer) {
  const c = T[r.lang];
  const steps = process.map((p, i) => `${i + 1}. **${p.step[r.lang]}** — ${p.detail[r.lang]}`).join("\n");
  r.say(`${c.processIntro}\n${steps}\n\n${c.processOutro}`).chips([
    chip(c.chip.timeline, "intent:timeline"),
    chip(c.chip.cost, "intent:pricing"),
    chip(c.chip.start, "intent:start"),
  ]);
}

function teamReply(r: Composer) {
  const c = T[r.lang];
  const lines = team.map((m) => `- **${m.name}** — ${m.role[r.lang]} · ${m.years[r.lang]}`).join("\n");
  r.say(`${c.teamIntro}\n${lines}\n\n${c.teamOutro}`)
    .show({ kind: "links", links: [pageLink("/team", r.lang)] })
    .chips(basics(r.lang));
}

function seo(r: Composer, s: BrainState, text: string) {
  const c = T[r.lang];
  const versus = /\b(geo|aeo|difference|differ|beza|perbezaan)\b/.test(text) && faqStarting("What is the difference between SEO");
  r.say(versus ? versus.a[r.lang] : c.seo).chips([
    chip(svcShort("website-design-development", r.lang), "svc:website-design-development"),
    chip(c.chip.start, "start:website-design-development"),
  ]);
  s.topic = "website-design-development";
}

function faqAnswer(r: Composer, faq: Faq) {
  r.say(faq.a[r.lang])
    .show({ kind: "links", links: [pageLink("/contact#faq", r.lang)] })
    .chips(basics(r.lang));
}

function fallback(r: Composer, s: BrainState, raw: string, missesBefore: number) {
  const c = T[r.lang];
  const message = c.waQuestion(scrub(clean(raw, 300)));
  s.misses = missesBefore + 1;
  r.say(s.misses > 1 ? c.fallbackAgain : c.fallback)
    .show({ kind: "whatsapp", href: whatsappLink(message), message })
    .chips(basics(r.lang));
}

/** The answer to a question that has a set reply. */
function answer(intent: Intent, r: Composer, s: BrainState, ctx: Context, text: string) {
  const c = T[r.lang];
  switch (intent) {
    case "services":
      servicesOverview(r);
      break;
    case "work":
      work(r, s, ctx);
      break;
    case "pricing":
      pricing(r, s);
      break;
    case "timeline":
      r.say(c.timeline).chips([
        chip(c.chip.cost, "intent:pricing"),
        chip(c.chip.process, "intent:process"),
        chip(c.chip.start, "intent:start"),
      ]);
      break;
    case "process":
      processSteps(r);
      break;
    case "ownership":
      r.say(c.ownership).chips(basics(r.lang));
      break;
    case "support":
      r.say(c.support).chips(basics(r.lang));
      break;
    case "contact":
      r.say(c.contact).show(contactAction(r.lang, s.topic)).chips([chip(c.chip.start, "intent:start")]);
      break;
    case "location":
      r.say(ABROAD.test(text) ? c.abroad : c.location)
        .show({ kind: "links", links: [pageLink("/contact", r.lang)] })
        .chips([chip(c.chip.whatsapp, "intent:contact"), chip(c.chip.start, "intent:start")]);
      break;
    case "hours":
      r.say(c.hours).chips([chip(c.chip.whatsapp, "intent:contact"), chip(c.chip.start, "intent:start")]);
      break;
    case "team":
      teamReply(r);
      break;
    case "about":
      r.say(c.about).chips([
        chip(c.chip.services, "intent:services"),
        chip(c.chip.work, "intent:work"),
        chip(c.chip.team, "intent:team"),
        chip(c.chip.start, "intent:start"),
      ]);
      break;
    case "industries":
      r.say(c.industries(join(clients.slice(0, 6).map((x) => x.name), c.and))).chips([
        ...sectorChips(r.lang),
        chip(c.chip.start, "intent:start"),
      ]);
      break;
    case "merch": {
      const made = merchandise.slice(0, 4).map((m) => `${m.name} (${m.kind[r.lang].toLowerCase()})`);
      r.say(c.merch(join(made, c.and)))
        .show({ kind: "links", links: [pageLink("/services/custom-digital-design", r.lang)] })
        .chips([chip(c.chip.examples, "swork:custom-digital-design"), chip(c.chip.start, "start:custom-digital-design")]);
      s.topic = "custom-digital-design";
      break;
    }
    case "seo":
      seo(r, s, text);
      break;
    case "bot":
      r.say(c.bot).show(contactAction(r.lang)).chips(basics(r.lang));
      break;
    case "thanks":
      r.say(c.thanks).chips(basics(r.lang));
      break;
    case "bye":
      r.say(c.bye);
      break;
    case "yes":
      r.say(c.ack).chips(basics(r.lang));
      break;
    case "no":
    case "cancel":
      r.say(c.decline).chips(basics(r.lang));
      break;
    case "greet":
      greet(r, s, ctx);
      break;
    default:
      // "I need help", "I'm looking for something": ask what, with the four answers.
      r.say(c.want).chips([...services.map((x) => chip(x.short[r.lang], `svc:${x.slug}`)), chip(c.chip.start, "intent:start")]);
  }
}

/* -------------------------------------------------------------------------- */
/* The brief                                                                   */
/* -------------------------------------------------------------------------- */

function nextStep(d: Draft): Step {
  if (!d.name) return "name";
  if (!d.email && !d.phone) return "contact";
  if (!d.service) return "service";
  if (!d.details) return "details";
  return "confirm";
}

/**
 * Asks the question the brief is waiting on: first time, again after an
 * answer that didn't fit, as an edit, or resumed after a side question.
 */
function prompt(r: Composer, s: BrainState, mode: "ask" | "again" | "edit" | "resume" = "ask") {
  const c = T[r.lang];
  const flow = s.flow;
  if (!flow) return;
  const d = flow.draft;
  const pick = (variants: Record<typeof mode, string>) => variants[mode];
  switch (flow.step) {
    case "name":
      r.say(pick({ ask: c.askName, again: c.askNameAgain, edit: c.editName, resume: c.resumeName }));
      break;
    case "contact":
      r.say(
        pick({ ask: c.askContact(d.name ?? ""), again: c.askContactAgain, edit: c.editContact, resume: c.resumeContact })
      );
      break;
    case "service":
      r.say(mode === "again" ? c.askServiceAgain : c.askService).chips([
        ...services.map((x) => chip(x.short[r.lang], `pick:${x.slug}`)),
        chip(c.chip.notSure, "pick:not-sure"),
      ]);
      break;
    case "details":
      r.say(pick({ ask: c.askDetails, again: c.askDetailsAgain, edit: c.editDetails, resume: c.resumeDetails }));
      break;
    case "confirm":
      r.say(mode === "again" ? c.confirmHint : c.confirm)
        .show({
          kind: "brief",
          rows: [
            { label: c.rows.name, value: d.name ?? "" },
            { label: c.rows.contact, value: [d.email, d.phone].filter(Boolean).join(" · ") },
            { label: c.rows.service, value: svcShort(d.service ?? "not-sure", r.lang) },
            { label: c.rows.details, value: d.details ?? "" },
          ],
        })
        .chips([chip(c.chip.send, "flow:send"), chip(c.chip.edit, "flow:edit"), chip(c.chip.cancel, "flow:cancel")]);
      break;
    case "edit":
      r.say(c.editWhat).chips([
        chip(c.chip.fieldName, "edit:name"),
        chip(c.chip.fieldContact, "edit:contact"),
        chip(c.chip.fieldService, "edit:service"),
        chip(c.chip.fieldDetails, "edit:details"),
      ]);
      break;
  }
}

function advance(r: Composer, s: BrainState) {
  if (!s.flow) return;
  s.flow.step = nextStep(s.flow.draft);
  prompt(r, s);
}

function startFlow(s: BrainState, ctx: Context, lang: Lang, service?: string, description?: string): Outcome {
  const c = T[lang];
  const draft: Draft = {};
  // An email the visitor already typed earlier in the chat. Phone numbers are
  // left alone: any long number in a message would look like one.
  for (const m of ctx.history) {
    const email = m.role === "user" ? parseContact(m.text).email : undefined;
    if (email) draft.email = email;
  }
  if (s.knownName) draft.name = s.knownName;
  if (service && serviceBySlug(service)) draft.service = service;
  if (description) draft.details = clean(description);
  s.flow = { step: nextStep(draft), draft };
  s.offer = undefined;

  const r = compose(lang);
  const svc = draft.service ? svcShort(draft.service, lang) : undefined;
  r.say(description ? c.flowStartDescribed(svc) : svc ? c.flowStartService(svc) : c.flowStart);
  prompt(r, s);
  return { reply: r.reply(), state: s };
}

function cancelFlow(s: BrainState, lang: Lang): Outcome {
  s.flow = undefined;
  return { reply: compose(lang).say(T[lang].cancelled).chips(basics(lang)).reply(), state: s };
}

function fieldIn(text: string): Step | undefined {
  if (/\b(name|nama)\b/.test(text)) return "name";
  if (/\b(email|e mail|emel|e mel|phone|number|contact|whatsapp|nombor|telefon|hubungan)\b/.test(text)) return "contact";
  if (/\b(service|perkhidmatan|servis)\b/.test(text)) return "service";
  if (/\b(details?|description|brief|message|need|requirements?|butiran|keperluan|penerangan|mesej)\b/.test(text)) {
    return "details";
  }
  return undefined;
}

function transcript(history: ChatMessage[]): AssistantBrief["transcript"] {
  return history
    .slice(-LIMITS.transcriptTurns)
    .map((m) => ({
      role: m.role === "user" ? ("visitor" as const) : ("assistant" as const),
      // The inbox gets plain text: no ** from the chat's bold.
      text: scrub(
        m.role === "user" ? m.text : m.parts.flatMap((p) => (p.type === "text" ? [p.text.replace(/\*\*/g, "")] : [])).join("\n\n")
      ).slice(0, LIMITS.transcriptChars),
    }))
    .filter((t) => t.text);
}

const briefKey = (d: { name?: string; details?: string }) => `${d.name}|${d.details}`.toLowerCase();

function sendBrief(s: BrainState, ctx: Context, lang: Lang): Outcome {
  const d = s.flow?.draft;
  if (!s.flow || !d) return cancelFlow(s, lang);
  if (nextStep(d) !== "confirm") {
    const r = compose(lang);
    advance(r, s);
    return { reply: r.reply(), state: s };
  }
  if (s.sent.includes(briefKey(d))) {
    s.flow = undefined;
    return { reply: compose(lang).say(T[lang].alreadySent).chips(basics(lang)).reply(), state: s };
  }
  const brief: AssistantBrief = {
    source: "assistant",
    name: d.name ?? "",
    ...(d.email ? { email: d.email } : {}),
    ...(d.phone ? { phone: d.phone } : {}),
    service: d.service ?? "not-sure",
    details: d.details ?? "",
    lang,
    page: ctx.page,
    transcript: transcript(ctx.history),
  };
  return { state: s, brief };
}

/** The reply once the widget has posted the brief. */
export function afterSend(state: BrainState, brief: AssistantBrief, delivered: boolean): Outcome {
  const lang = brief.lang;
  const c = T[lang];
  const s: BrainState = { ...state, flow: undefined, offer: undefined, sent: [...state.sent] };
  const message = visitorMessage({ name: brief.name, service: brief.service, summary: brief.details, language: lang });
  const links = { whatsappHref: whatsappLink(message), mailtoHref: mailto(c.subject(brief.name), message) };
  const r = compose(lang);
  if (delivered) {
    s.sent.push(briefKey({ name: brief.name, details: brief.details }));
    r.say(c.sent)
      .show({ kind: "enquiry", status: "sent", ...links })
      .chips([chip(c.chip.whatsapp, "intent:contact"), chip(c.chip.work, "intent:work")]);
  } else {
    r.say(c.notSent).show({ kind: "enquiry", status: "not_sent", ...links });
  }
  return { reply: r.reply(), state: s };
}

function onFlow(raw: string, text: string, s: BrainState, ctx: Context, lang: Lang): Outcome {
  const flow = s.flow;
  if (!flow) return onText(raw, text, s, ctx, lang, 0);
  const c = T[lang];
  const d = flow.draft;
  const intent = intentOf(text);
  const r = compose(lang);
  const done = (): Outcome => ({ reply: r.reply(), state: s });

  if (intent === "cancel") return cancelFlow(s, lang);

  // A question in the middle of the brief: answer it, then pick the brief up.
  // The answer's own buttons go — one of them could start the brief over.
  if (intent && INFO.has(intent) && isQuestion(raw, text) && flow.step !== "confirm") {
    answer(intent, r, s, ctx, text);
    r.chips([]).say(c.back);
    prompt(r, s, "resume");
    return done();
  }

  switch (flow.step) {
    case "name": {
      // "ok", "yes", "thanks" are answers, not names.
      const name = intent && ["yes", "no", "thanks", "bye", "greet"].includes(intent) ? null : parseName(raw);
      if (!name) {
        // A plain "no" before anything is written down means no brief.
        if (intent === "no" && !d.email && !d.details) return cancelFlow(s, lang);
        prompt(r, s, "again");
        break;
      }
      d.name = name;
      const found = parseContact(raw);
      if (found.email) d.email = found.email;
      if (found.phone) d.phone = found.phone;
      advance(r, s);
      break;
    }
    case "contact": {
      const found = parseContact(raw);
      if (found.email || found.phone) {
        // A new answer replaces the old one rather than adding to it.
        d.email = found.email;
        d.phone = found.phone;
        advance(r, s);
      } else if (WHY.test(text)) {
        r.say(c.whyContact);
        prompt(r, s, "resume");
      } else if (intent === "no") {
        // They'd rather not leave details: hand them the brief to send themselves.
        const known = d.service && d.service !== "not-sure" ? svcShort(d.service, lang) : undefined;
        const message = d.details
          ? visitorMessage({ name: d.name ?? "", service: d.service, summary: d.details, language: lang })
          : c.waNamed(d.name ?? "", known);
        r.say(c.noContact).show({ kind: "whatsapp", href: whatsappLink(message), message }).chips(basics(lang));
        s.flow = undefined;
      } else if (WANTS_PHONE.test(text)) {
        r.say(c.askPhone);
      } else {
        prompt(r, s, "again");
      }
      break;
    }
    case "service": {
      const ranked = servicesIn(text);
      if (ranked.length) d.service = ranked[0].slug;
      else if (NOT_SURE.test(text)) d.service = "not-sure";
      else if (raw.length >= 15 && !d.details) {
        // They skipped the choices and described the project instead.
        d.service = "not-sure";
        d.details = clean(raw);
      } else {
        prompt(r, s, "again");
        break;
      }
      advance(r, s);
      break;
    }
    case "details": {
      if (words(text) < 3 || raw.length < 12) {
        prompt(r, s, "again");
        break;
      }
      d.details = clean(raw);
      if (d.service === "not-sure") d.service = servicesIn(text)[0]?.slug ?? "not-sure";
      advance(r, s);
      break;
    }
    case "confirm": {
      if (intent === "yes" || SEND.test(text)) return sendBrief(s, ctx, lang);
      if (intent === "no") return cancelFlow(s, lang);
      const found = parseContact(raw);
      if (found.email || found.phone) {
        d.email = found.email;
        d.phone = found.phone;
        prompt(r, s);
        break;
      }
      // "Change the service to AI": make the change and read it back.
      const named = CHANGE.test(text) ? servicesIn(text)[0]?.slug : undefined;
      if (named) {
        d.service = named;
        prompt(r, s);
        break;
      }
      const field = fieldIn(text);
      if (field) {
        flow.step = field;
        prompt(r, s, "edit");
      } else if (CHANGE.test(text)) {
        flow.step = "edit";
        prompt(r, s);
      } else if (words(text) >= 4) {
        // More about the project: it belongs in the brief, so add it and read back.
        d.details = clean(`${d.details ?? ""}\n${raw}`);
        prompt(r, s);
      } else {
        prompt(r, s, "again");
      }
      break;
    }
    case "edit": {
      const found = parseContact(raw);
      if (found.email || found.phone) {
        d.email = found.email;
        d.phone = found.phone;
        flow.step = "confirm";
        prompt(r, s);
        break;
      }
      const field = fieldIn(text);
      if (field) {
        flow.step = field;
        prompt(r, s, "edit");
      } else if (intent === "no") {
        flow.step = "confirm";
        prompt(r, s);
      } else {
        prompt(r, s);
      }
      break;
    }
  }
  return done();
}

/* -------------------------------------------------------------------------- */
/* Free text and taps                                                          */
/* -------------------------------------------------------------------------- */

function onText(raw: string, text: string, s: BrainState, ctx: Context, lang: Lang, missesBefore: number, offered?: "brief"): Outcome {
  const r = compose(lang);
  const done = (): Outcome => ({ reply: r.reply(), state: s });

  // "Hi, do you do logos?" is a question about logos, not a hello.
  const rest = text.replace(GREETING, "").trim();
  const body = rest && intentOf(text) === "greet" ? rest : text;
  const intent = intentOf(body);

  if (intent === "lang_ms" || intent === "lang_en") {
    const to: Lang = intent === "lang_ms" ? "ms" : "en";
    s.lang = to;
    s.langSite = ctx.siteLang;
    return { reply: compose(to).say(T[to].switched).chips(basics(to)).reply(), state: s };
  }

  // A short yes or no answers the question the last reply asked.
  if (offered === "brief" && (intent === "yes" || intent === "no") && words(body) <= 4) {
    if (intent === "yes") return startFlow(s, ctx, lang, s.topic);
    answer("no", r, s, ctx, body);
    return done();
  }

  const ranked = servicesIn(body);
  const svc = ranked[0]?.slug;
  const sector = sectorIn(body);
  const project = projectIn(body);
  const describes = words(body) >= 8 && DESCRIBES.test(body);

  if (intent === "start") return startFlow(s, ctx, lang, svc ?? s.topic);
  if (intent === "want") {
    if (describes) return startFlow(s, ctx, lang, svc, raw);
    if (svc) return startFlow(s, ctx, lang, svc);
    answer("want", r, s, ctx, body);
    return done();
  }

  if (intent === "work") {
    if (project) projectDetail(r, s, project);
    else if (svc) serviceWork(r, s, svc);
    else if (sector) sectorWork(r, s, sector.key);
    else work(r, s, ctx);
    return done();
  }
  if (intent === "industries" && sector) {
    sectorWork(r, s, sector.key);
    return done();
  }
  if (intent === "services" && svc && ranked.length === 1) {
    serviceDetail(r, s, svc, CAPABILITY.test(body));
    return done();
  }
  if (intent) {
    if (svc && (intent === "pricing" || intent === "timeline")) s.topic = svc;
    answer(intent, r, s, ctx, body);
    return done();
  }

  const defined = DEFINES.test(body) ? searchFaq(raw) : undefined;
  if (project) projectDetail(r, s, project);
  else if (defined) faqAnswer(r, defined);
  // Someone describing their project rather than asking: start the brief with it.
  else if (describes && !isQuestion(raw, body)) return startFlow(s, ctx, lang, svc, raw);
  else if (ranked.length > 1 && ranked[0].score === ranked[1].score && /\b(and|&|plus|with|dan|serta|dengan)\b/.test(body)) {
    serviceMix(r, ranked[0].slug, ranked[1].slug);
  } else if (sector && (!svc || svc === "website-design-development" || ASKS_FOR_WORK.test(body))) {
    sectorWork(r, s, sector.key);
  } else if (svc) serviceDetail(r, s, svc, CAPABILITY.test(body));
  else if (INTRODUCES.test(body) || INTRODUCES_SHORT.test(raw.replace(/^(hi|hello|hey|hai|helo)[\s,!.]+/i, ""))) {
    const name = parseName(raw);
    if (name) {
      s.knownName = name;
      s.greeted = true;
      r.say(T[lang].meet(name)).chips(basics(lang));
    } else fallback(r, s, raw, missesBefore);
  } else {
    const faq = searchFaq(raw);
    if (faq) faqAnswer(r, faq);
    else fallback(r, s, raw, missesBefore);
  }
  return done();
}

function onChoice(value: string, s: BrainState, ctx: Context, lang: Lang): Outcome {
  const [kind, arg = ""] = value.split(":");
  const r = compose(lang);
  const done = (): Outcome => ({ reply: r.reply(), state: s });
  const flow = s.flow;

  switch (kind) {
    case "intent":
      if (arg === "start") return startFlow(s, ctx, lang, s.topic);
      answer(arg as Intent, r, s, ctx, "");
      return done();
    case "svc":
      serviceDetail(r, s, arg);
      return done();
    case "swork":
      serviceWork(r, s, arg);
      return done();
    case "work":
      sectorWork(r, s, arg);
      return done();
    case "more":
      work(r, s, ctx);
      return done();
    case "start":
      return startFlow(s, ctx, lang, arg || s.topic);
    case "pick":
      if (!flow) {
        serviceDetail(r, s, arg);
        return done();
      }
      flow.draft.service = arg;
      advance(r, s);
      return done();
    case "flow":
      if (!flow) break;
      if (arg === "send") return sendBrief(s, ctx, lang);
      if (arg === "cancel") return cancelFlow(s, lang);
      flow.step = "edit";
      prompt(r, s);
      return done();
    case "edit":
      if (!flow) break;
      flow.step = (["name", "contact", "service", "details"] as Step[]).includes(arg as Step) ? (arg as Step) : "edit";
      prompt(r, s, "edit");
      return done();
  }
  r.say(T[lang].ack).chips(basics(lang));
  return done();
}

/* -------------------------------------------------------------------------- */
/* Entry points                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The reply to one visitor message. `choice` is set when they tapped a button
 * rather than typed; `ctx.history` already ends with their message.
 */
export function respond(state: BrainState, input: { text: string; choice?: string }, ctx: Context): Outcome {
  const raw = input.text.trim().slice(0, LIMITS.userChars);
  const text = normalize(raw);
  const s: BrainState = {
    ...state,
    seen: [...state.seen],
    sent: [...state.sent],
    offer: undefined,
    misses: 0,
    flow: state.flow && { step: state.flow.step, draft: { ...state.flow.draft } },
  };

  // Switching the site's language is the visitor choosing one: it beats what
  // was guessed from their typing.
  if (s.lang && s.langSite !== ctx.siteLang) s.lang = undefined;
  if (!input.choice) {
    const spoken = detectLang(raw);
    if (spoken) {
      s.lang = spoken;
      s.langSite = ctx.siteLang;
    }
  }
  const lang = s.lang ?? ctx.siteLang;

  const out = input.choice
    ? onChoice(input.choice, s, ctx, lang)
    : s.flow
      ? onFlow(raw, text, s, ctx, lang)
      : onText(raw, text, s, ctx, lang, state.misses, state.offer);

  if (out.reply && SENSITIVE.test(raw)) out.reply.parts.unshift({ type: "text", text: T[out.reply.lang].sensitive });
  return out;
}

/** How long the typing dots show before a reply: longer replies, a little longer. */
export function typingDelay(reply?: Reply): number {
  const chars = reply?.parts.reduce((n, p) => n + (p.type === "text" ? p.text.length : 60), 0) ?? 0;
  return Math.round(Math.min(1100, 350 + chars * 2.5));
}

import type { L10n } from "@/i18n/types";

export type Service = {
  slug: string;
  index: string;
  title: L10n;
  short: L10n;
  tagline: L10n;
  description: L10n;
  features: { name: L10n; detail: L10n }[];
  related: string[]; // project slugs
};

// Every service has a visual at /services/<slug>.jpg
export const serviceImage = (slug: string) => `/services/${slug}.jpg`;

export const process: { step: L10n; detail: L10n }[] = [
  {
    step: { en: "Discovery", ms: "Penerokaan" },
    detail: {
      en: "We map your business, market and goals before a single pixel moves.",
      ms: "Kami memahami perniagaan, pasaran dan matlamat anda sebelum satu piksel pun bergerak.",
    },
  },
  {
    step: { en: "Strategy", ms: "Strategi" },
    detail: {
      en: "A clear plan: scope, architecture, milestones and success metrics.",
      ms: "Pelan yang jelas: skop, seni bina, pencapaian dan metrik kejayaan.",
    },
  },
  {
    step: { en: "Design", ms: "Reka Bentuk" },
    detail: {
      en: "Interface, motion and brand direction designed around your users.",
      ms: "Antara muka, animasi dan hala tuju jenama direka berdasarkan pengguna anda.",
    },
  },
  {
    step: { en: "Development", ms: "Pembangunan" },
    detail: {
      en: "Engineered with modern stacks. Fast, secure and maintainable.",
      ms: "Dibina dengan teknologi moden. Pantas, selamat dan mudah diselenggara.",
    },
  },
  {
    step: { en: "Testing", ms: "Pengujian" },
    detail: {
      en: "Devices, browsers, load and edge cases. Nothing ships untested.",
      ms: "Peranti, pelayar, beban dan kes tepi. Tiada apa dilancarkan tanpa ujian.",
    },
  },
  {
    step: { en: "Launch", ms: "Pelancaran" },
    detail: {
      en: "Deployment, monitoring and a partner who stays after you go live.",
      ms: "Pelancaran, pemantauan dan rakan yang kekal selepas laman anda hidup.",
    },
  },
];

/**
 * The four disciplines the studio sells. It ran nine until the offer was
 * consolidated: AI automation folded into AI services, merchandise folded into
 * digital design, and marketing, social media and corporate gifts came off the
 * menu. next.config.ts redirects the retired URLs so nothing that was already
 * indexed lands on a 404.
 */
export const services: Service[] = [
  {
    slug: "website-design-development",
    index: "01",
    title: {
      en: "Smart Website Design & Development",
      ms: "Reka Bentuk & Pembangunan Laman Web Pintar",
    },
    short: { en: "Website Design & Development", ms: "Reka Bentuk & Pembangunan Web" },
    tagline: {
      en: "Websites engineered to convert, not just exist.",
      ms: "Laman web direka untuk menukar pelawat kepada pelanggan.",
    },
    description: {
      en: "Flagship marketing sites, ecommerce and landing experiences built on modern frameworks, designed to feel premium and measured by the business they generate.",
      ms: "Laman pemasaran utama, edagang dan halaman pendaratan dibina atas rangka kerja moden, direka untuk terasa premium dan diukur dengan hasil perniagaan.",
    },
    features: [
      {
        name: { en: "Conversion first design", ms: "Reka bentuk fokus penukaran" },
        detail: {
          en: "Every section is built around a user decision, not decoration.",
          ms: "Setiap bahagian dibina sekitar keputusan pengguna, bukan hiasan.",
        },
      },
      {
        name: { en: "Motion & interaction", ms: "Animasi & interaksi" },
        detail: {
          en: "Studio grade animation that makes brands feel expensive.",
          ms: "Animasi bertaraf studio yang menjadikan jenama terasa mewah.",
        },
      },
      {
        name: { en: "Performance obsessed", ms: "Prestasi diutamakan" },
        detail: {
          en: "Core Web Vitals in the green. Speed is part of the design.",
          ms: "Core Web Vitals sentiasa hijau. Kelajuan sebahagian daripada reka bentuk.",
        },
      },
      {
        name: { en: "CMS & ownership", ms: "CMS & pemilikan" },
        detail: {
          en: "Content you can edit without calling a developer.",
          ms: "Kandungan yang anda boleh ubah tanpa memanggil pembangun.",
        },
      },
    ],
    related: ["roadtainers", "twinkle-kidz"],
  },
  {
    slug: "custom-web-applications",
    index: "02",
    title: {
      en: "Custom Web Application & Software Systems",
      ms: "Aplikasi Web & Sistem Perisian Tersuai",
    },
    short: { en: "Web Apps & Software Systems", ms: "Aplikasi Web & Sistem Perisian" },
    tagline: {
      en: "Operational software shaped exactly to your business.",
      ms: "Perisian operasi dibentuk tepat mengikut perniagaan anda.",
    },
    description: {
      en: "Dashboards, portals, booking engines, ERPs and internal tools. Custom systems that remove manual work and scale with your operation.",
      ms: "Papan pemuka, portal, enjin tempahan, ERP dan alat dalaman. Sistem tersuai yang menghapuskan kerja manual dan berkembang bersama operasi anda.",
    },
    features: [
      {
        name: { en: "Process automation", ms: "Automasi proses" },
        detail: {
          en: "Workflows that run themselves instead of running your team.",
          ms: "Aliran kerja yang berjalan sendiri, bukan membebankan pasukan anda.",
        },
      },
      {
        name: { en: "Integrations", ms: "Integrasi" },
        detail: {
          en: "Payments, CRMs, APIs and legacy systems, connected cleanly.",
          ms: "Pembayaran, CRM, API dan sistem lama, disambung dengan kemas.",
        },
      },
      {
        name: { en: "Secure architecture", ms: "Seni bina selamat" },
        detail: {
          en: "Role based access, audit trails and best practice security.",
          ms: "Akses berperanan, jejak audit dan keselamatan amalan terbaik.",
        },
      },
      {
        name: { en: "Built to scale", ms: "Dibina untuk berskala" },
        detail: {
          en: "From 10 users to 10,000 without a rewrite.",
          ms: "Daripada 10 pengguna ke 10,000 tanpa perlu ditulis semula.",
        },
      },
    ],
    related: ["roadtainers", "prince-lubricants"],
  },
  {
    /*
     * Automation and AI products used to be two separate lines. They are one
     * offer now, and the slug stays `ai-products` so the URL the studio has
     * already been handing out keeps resolving.
     */
    slug: "ai-products",
    index: "03",
    title: { en: "Custom AI Services & Softwares", ms: "Perkhidmatan & Perisian AI Tersuai" },
    short: { en: "AI Services & Softwares", ms: "Perkhidmatan & Perisian AI" },
    tagline: {
      en: "Your data, your workflows, with intelligence built in.",
      ms: "Data anda, aliran kerja anda, dengan kecerdasan terbina.",
    },
    description: {
      en: "Chatbots, copilots, knowledge systems and automated workflows. AI designed, trained and shipped as real software your customers use and your team runs on, so the repetitive work runs itself and the hours go where they actually count.",
      ms: "Chatbot, copilot, sistem pengetahuan dan aliran kerja automatik. AI direka, dilatih dan dilancarkan sebagai perisian sebenar yang digunakan pelanggan anda dan dijalankan pasukan anda, supaya kerja berulang berjalan sendiri dan masa ditumpukan pada perkara yang benar benar penting.",
    },
    features: [
      {
        name: { en: "AI assistants & chatbots", ms: "Pembantu & chatbot AI" },
        detail: {
          en: "Customer facing bots trained on your knowledge.",
          ms: "Bot pelanggan dilatih dengan pengetahuan anda.",
        },
      },
      {
        name: { en: "Workflow automation", ms: "Automasi aliran kerja" },
        detail: {
          en: "Agents that read, sort, reply and route on your behalf.",
          ms: "Ejen yang membaca, menyusun, membalas dan menghala bagi pihak anda.",
        },
      },
      {
        name: { en: "Knowledge systems", ms: "Sistem pengetahuan" },
        detail: {
          en: "Answers grounded in your documents, not invented.",
          ms: "Jawapan berasaskan dokumen anda, bukan rekaan.",
        },
      },
      {
        name: { en: "Models & integrations", ms: "Model & integrasi" },
        detail: {
          en: "The right model for the job, wired into the tools you already run.",
          ms: "Model yang tepat untuk tugasan, disambung ke alat yang anda sudah guna.",
        },
      },
    ],
    related: [],
  },
  {
    slug: "custom-digital-design",
    index: "04",
    title: {
      en: "Custom Digital Design (Graphic Design)",
      ms: "Reka Bentuk Digital Tersuai (Reka Grafik)",
    },
    short: { en: "Digital Design", ms: "Reka Bentuk Digital" },
    tagline: {
      en: "Identity systems that make businesses look like leaders.",
      ms: "Sistem identiti yang menjadikan perniagaan kelihatan seperti peneraju.",
    },
    description: {
      en: "Logos, brand systems, UI design, campaign visuals and the physical merchandise that carries them. One consistent visual language across everything you ship, on screen and in the hand.",
      ms: "Logo, sistem jenama, reka bentuk UI, visual kempen dan barangan fizikal yang membawanya. Satu bahasa visual yang konsisten merentas semua yang anda hasilkan, di skrin dan di tangan.",
    },
    features: [
      {
        name: { en: "Brand identity", ms: "Identiti jenama" },
        detail: {
          en: "Logo, palette, typography and voice built as one system.",
          ms: "Logo, warna, tipografi dan suara dibina sebagai satu sistem.",
        },
      },
      {
        name: { en: "UI/UX design", ms: "Reka bentuk UI/UX" },
        detail: {
          en: "Product interfaces designed for clarity and delight.",
          ms: "Antara muka produk direka untuk kejelasan dan keseronokan.",
        },
      },
      {
        name: { en: "Campaign creative", ms: "Kreatif kempen" },
        detail: {
          en: "Ads, banners and social visuals that stay on brand.",
          ms: "Iklan, sepanduk dan visual sosial yang kekal dengan jenama.",
        },
      },
      {
        name: { en: "Merchandise & apparel", ms: "Barangan & pakaian" },
        detail: {
          en: "Kits, packaging and branded goods, designed and produced.",
          ms: "Kit, pembungkusan dan barangan berjenama, direka dan dihasilkan.",
        },
      },
    ],
    related: ["legendary", "cyw-art-craft"],
  },
];

/**
 * Words inside a service heading that carry the brand orange. Matching is done
 * on the whole word, case insensitively, against the full `title`.
 */
export const serviceAccent: Record<string, { en: string[]; ms: string[] }> = {
  "website-design-development": { en: ["Development"], ms: ["Pembangunan"] },
  "custom-web-applications": { en: ["Software"], ms: ["Perisian"] },
  "ai-products": { en: ["Softwares"], ms: ["Perisian"] },
  "custom-digital-design": { en: ["Design"], ms: ["Digital"] },
};

// The homepage horizontal experience runs the full four, in list order.
export const featuredSlugs = services.map((s) => s.slug);

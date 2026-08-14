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
    related: ["toastful", "wrap-district", "cyw-art-craft"],
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
    slug: "ai-automation",
    index: "03",
    title: { en: "Custom AI Automation", ms: "Automasi AI Tersuai" },
    short: { en: "AI Automation", ms: "Automasi AI" },
    tagline: {
      en: "Put the repetitive work on autopilot.",
      ms: "Letakkan kerja berulang pada autopilot.",
    },
    description: {
      en: "AI agents and automated workflows wired into your business, so the repetitive work runs itself and your team spends its hours where they actually count.",
      ms: "Ejen AI dan aliran kerja automatik disambung ke dalam perniagaan anda, supaya kerja berulang berjalan sendiri dan pasukan anda menumpukan masa pada perkara yang benar benar penting.",
    },
    features: [
      {
        name: { en: "Workflow automation", ms: "Automasi aliran kerja" },
        detail: {
          en: "The busywork your team should never have been doing.",
          ms: "Kerja rutin yang sepatutnya tidak pernah dibuat pasukan anda.",
        },
      },
      {
        name: { en: "AI agents", ms: "Ejen AI" },
        detail: {
          en: "Agents that read, sort, reply and route on your behalf.",
          ms: "Ejen yang membaca, menyusun, membalas dan menghala bagi pihak anda.",
        },
      },
      {
        name: { en: "System integrations", ms: "Integrasi sistem" },
        detail: {
          en: "Connected to the tools you already run your business on.",
          ms: "Disambung kepada alat yang anda sudah gunakan setiap hari.",
        },
      },
      {
        name: { en: "Human oversight", ms: "Pengawasan manusia" },
        detail: {
          en: "Clear checkpoints, so automation never runs unwatched.",
          ms: "Titik semakan jelas, supaya automasi tidak pernah berjalan tanpa pengawasan.",
        },
      },
    ],
    related: ["roadtainers", "mir"],
  },
  {
    slug: "ai-products",
    index: "04",
    title: { en: "Custom AI Products & Softwares", ms: "Produk & Perisian AI Tersuai" },
    short: { en: "AI Products & Softwares", ms: "Produk & Perisian AI" },
    tagline: {
      en: "Your data, your workflows, with intelligence built in.",
      ms: "Data anda, aliran kerja anda, dengan kecerdasan terbina.",
    },
    description: {
      en: "Chatbots, copilots, knowledge systems and AI powered platforms. Designed, trained and shipped as real products your customers use.",
      ms: "Chatbot, copilot, sistem pengetahuan dan platform berkuasa AI. Direka, dilatih dan dilancarkan sebagai produk sebenar yang digunakan pelanggan anda.",
    },
    features: [
      {
        name: { en: "AI assistants", ms: "Pembantu AI" },
        detail: {
          en: "Customer facing bots trained on your knowledge.",
          ms: "Bot pelanggan dilatih dengan pengetahuan anda.",
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
        name: { en: "Custom models & pipelines", ms: "Model & saluran tersuai" },
        detail: {
          en: "The right model for the job, integrated properly.",
          ms: "Model yang tepat untuk tugasan, diintegrasi dengan betul.",
        },
      },
      {
        name: { en: "AI product strategy", ms: "Strategi produk AI" },
        detail: {
          en: "From idea to shipped product, with honest feasibility.",
          ms: "Dari idea ke produk siap, dengan penilaian jujur.",
        },
      },
    ],
    related: ["prince-lubricants", "cyw-art-craft"],
  },
  {
    slug: "custom-digital-design",
    index: "05",
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
      en: "Logos, brand systems, UI design, pitch decks and campaign visuals. A consistent visual language across everything you ship.",
      ms: "Logo, sistem jenama, reka bentuk UI, dek pembentangan dan visual kempen. Bahasa visual yang konsisten merentas semua yang anda hasilkan.",
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
        name: { en: "Design systems", ms: "Sistem reka bentuk" },
        detail: {
          en: "Reusable components so quality never drifts.",
          ms: "Komponen boleh guna semula supaya kualiti tidak tergelincir.",
        },
      },
    ],
    related: ["cyw-art-craft", "wrap-district"],
  },
  {
    slug: "digital-marketing",
    index: "06",
    title: {
      en: "Digital Marketing Management (SEO, GEO and AEO)",
      ms: "Pengurusan Pemasaran Digital (SEO, GEO dan AEO)",
    },
    short: { en: "Digital Marketing", ms: "Pemasaran Digital" },
    tagline: {
      en: "Be the answer, then be the campaign people remember.",
      ms: "Jadilah jawapan, kemudian jadilah kempen yang diingati.",
    },
    description: {
      en: "Search visibility and paid media under one roof. SEO for search engines, AEO for answer engines, GEO for generative results, plus the campaigns and reporting that turn attention into revenue.",
      ms: "Keterlihatan carian dan media berbayar di bawah satu bumbung. SEO untuk enjin carian, AEO untuk enjin jawapan, GEO untuk hasil generatif, serta kempen dan laporan yang menukar perhatian kepada hasil.",
    },
    features: [
      {
        name: { en: "SEO", ms: "SEO" },
        detail: {
          en: "Technical and content SEO that compounds over time.",
          ms: "SEO teknikal dan kandungan yang berganda dari masa ke masa.",
        },
      },
      {
        name: { en: "AEO & GEO", ms: "AEO & GEO" },
        detail: {
          en: "Structured so AI assistants cite you as the answer.",
          ms: "Distruktur supaya pembantu AI memetik anda sebagai jawapan.",
        },
      },
      {
        name: { en: "Paid campaigns", ms: "Kempen berbayar" },
        detail: {
          en: "Meta, Google and platform ads tuned for return, not reach.",
          ms: "Iklan Meta, Google dan platform ditala untuk pulangan, bukan capaian.",
        },
      },
      {
        name: { en: "Analytics & reporting", ms: "Analitik & laporan" },
        detail: {
          en: "Dashboards that show money, not vanity metrics.",
          ms: "Papan pemuka yang menunjukkan hasil, bukan metrik kosong.",
        },
      },
    ],
    related: ["prince-lubricants", "toastful"],
  },
  {
    slug: "social-media-management",
    index: "07",
    title: { en: "Social Media Management", ms: "Pengurusan Media Sosial" },
    short: { en: "Social Media", ms: "Media Sosial" },
    tagline: {
      en: "A feed that looks as serious as your business is.",
      ms: "Feed yang kelihatan seserius perniagaan anda.",
    },
    description: {
      en: "Content calendars, production, publishing and community management. A consistent, premium presence across every platform you appear on.",
      ms: "Kalendar kandungan, penghasilan, penerbitan dan pengurusan komuniti. Kehadiran premium yang konsisten merentas setiap platform anda.",
    },
    features: [
      {
        name: { en: "Content strategy", ms: "Strategi kandungan" },
        detail: {
          en: "Pillars and calendars mapped to business goals.",
          ms: "Tonggak dan kalendar dipetakan kepada matlamat perniagaan.",
        },
      },
      {
        name: { en: "Design & production", ms: "Reka bentuk & penghasilan" },
        detail: {
          en: "Posts, reels and stories produced in house.",
          ms: "Post, reel dan story dihasilkan secara dalaman.",
        },
      },
      {
        name: { en: "Publishing & community", ms: "Penerbitan & komuniti" },
        detail: {
          en: "Scheduled, posted, answered, every single day.",
          ms: "Dijadualkan, diterbitkan, dijawab, setiap hari.",
        },
      },
      {
        name: { en: "Growth reporting", ms: "Laporan pertumbuhan" },
        detail: {
          en: "Monthly reports on reach, growth and conversions.",
          ms: "Laporan bulanan tentang capaian, pertumbuhan dan penukaran.",
        },
      },
    ],
    related: ["toastful", "mojo-momo-kingdom"],
  },
  {
    slug: "merchandise-design",
    index: "08",
    title: { en: "Custom Merchandise Design", ms: "Reka Bentuk Barangan Tersuai" },
    short: { en: "Merchandise Design", ms: "Reka Bentuk Barangan" },
    tagline: {
      en: "Physical brand touchpoints, designed and delivered.",
      ms: "Sentuhan jenama fizikal, direka dan dihantar.",
    },
    description: {
      en: "Apparel, packaging and branded goods. Designed in house and produced through a vetted procurement network, so what arrives matches what we drew.",
      ms: "Pakaian, pembungkusan dan barangan berjenama. Direka secara dalaman dan dihasilkan melalui rangkaian perolehan yang disahkan, supaya apa yang tiba sepadan dengan apa yang kami lukis.",
    },
    features: [
      {
        name: { en: "Product design", ms: "Reka bentuk produk" },
        detail: {
          en: "Merchandise people actually want to keep.",
          ms: "Barangan yang orang benar benar mahu simpan.",
        },
      },
      {
        name: { en: "Sourcing & QC", ms: "Sumber & kawalan kualiti" },
        detail: {
          en: "Vetted manufacturers, checked samples, reliable timelines.",
          ms: "Pengilang disahkan, sampel disemak, garis masa boleh dipercayai.",
        },
      },
      {
        name: { en: "End to end delivery", ms: "Penghantaran menyeluruh" },
        detail: {
          en: "From artwork to doorstep, managed for you.",
          ms: "Dari lakaran hingga ke depan pintu, diuruskan untuk anda.",
        },
      },
      {
        name: { en: "Brand consistency", ms: "Konsistensi jenama" },
        detail: {
          en: "Physical goods that match your digital identity.",
          ms: "Barangan fizikal yang sepadan dengan identiti digital anda.",
        },
      },
    ],
    related: ["wrap-district", "legendary"],
  },
  {
    slug: "corporate-gifts",
    index: "09",
    title: { en: "Custom Corporate Gift Solutions", ms: "Penyelesaian Hadiah Korporat Tersuai" },
    short: { en: "Corporate Gifts", ms: "Hadiah Korporat" },
    tagline: {
      en: "Gifts that make your company unforgettable.",
      ms: "Hadiah yang menjadikan syarikat anda tidak dilupakan.",
    },
    description: {
      en: "Curated corporate gifting programs for clients, partners and teams. Premium, personalised and handled from selection through to delivery.",
      ms: "Program hadiah korporat terpilih untuk pelanggan, rakan kongsi dan pasukan. Premium, diperibadikan dan diuruskan dari pemilihan sehingga penghantaran.",
    },
    features: [
      {
        name: { en: "Curated catalogues", ms: "Katalog terpilih" },
        detail: {
          en: "Gift selections matched to your brand and budget.",
          ms: "Pilihan hadiah sepadan dengan jenama dan bajet anda.",
        },
      },
      {
        name: { en: "Personalisation", ms: "Pemperibadian" },
        detail: {
          en: "Custom branding on every item, done tastefully.",
          ms: "Penjenamaan tersuai pada setiap item, dilakukan dengan citarasa.",
        },
      },
      {
        name: { en: "Bulk fulfilment", ms: "Pemenuhan pukal" },
        detail: {
          en: "Ordering, packing and delivery at company scale.",
          ms: "Tempahan, pembungkusan dan penghantaran pada skala syarikat.",
        },
      },
      {
        name: { en: "Seasonal programs", ms: "Program bermusim" },
        detail: {
          en: "Festive and event gifting, planned well ahead.",
          ms: "Hadiah perayaan dan acara, dirancang lebih awal.",
        },
      },
    ],
    related: ["cyw-art-craft"],
  },
];

/**
 * Words inside a service heading that carry the brand orange. Matching is done
 * on the whole word, case insensitively, against the full `title`.
 */
export const serviceAccent: Record<string, { en: string[]; ms: string[] }> = {
  "website-design-development": { en: ["Development"], ms: ["Pembangunan"] },
  "custom-web-applications": { en: ["Software"], ms: ["Perisian"] },
  "ai-automation": { en: ["Automation"], ms: ["Automasi"] },
  "ai-products": { en: ["Softwares"], ms: ["Perisian"] },
  "custom-digital-design": { en: ["Design"], ms: ["Digital"] },
  "digital-marketing": { en: ["Marketing"], ms: ["Pemasaran"] },
  "social-media-management": { en: ["Media"], ms: ["Sosial"] },
  "merchandise-design": { en: ["Design"], ms: ["Barangan"] },
  "corporate-gifts": { en: ["Gift"], ms: ["Hadiah"] },
};

// The homepage horizontal experience runs the full nine, in list order.
export const featuredSlugs = services.map((s) => s.slug);

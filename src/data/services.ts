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

// Every service has a visual at /services/<slug>.png
export const serviceImage = (slug: string) => `/services/${slug}.png`;

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
      en: "Engineered with modern stacks — fast, secure and maintainable.",
      ms: "Dibina dengan teknologi moden — pantas, selamat dan mudah diselenggara.",
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
      en: "Deployment, monitoring and a partner who stays after go-live.",
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
    short: { en: "Web Experiences", ms: "Pengalaman Web" },
    tagline: {
      en: "Websites engineered to convert, not just exist.",
      ms: "Laman web direka untuk menukar pelawat kepada pelanggan.",
    },
    description: {
      en: "Flagship marketing sites, e-commerce and landing experiences built on modern frameworks — designed to feel premium and measured by the business they generate.",
      ms: "Laman pemasaran utama, e-dagang dan halaman pendaratan dibina atas rangka kerja moden — direka untuk terasa premium dan diukur dengan hasil perniagaan.",
    },
    features: [
      {
        name: { en: "Conversion-first design", ms: "Reka bentuk fokus penukaran" },
        detail: {
          en: "Every section is built around a user decision, not decoration.",
          ms: "Setiap bahagian dibina sekitar keputusan pengguna, bukan hiasan.",
        },
      },
      {
        name: { en: "Motion & interaction", ms: "Animasi & interaksi" },
        detail: {
          en: "GSAP-grade animation that makes brands feel expensive.",
          ms: "Animasi bertaraf GSAP yang menjadikan jenama terasa mewah.",
        },
      },
      {
        name: { en: "Performance obsessed", ms: "Prestasi diutamakan" },
        detail: {
          en: "Core Web Vitals in the green — speed is part of the design.",
          ms: "Core Web Vitals sentiasa hijau — kelajuan sebahagian daripada reka bentuk.",
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
    related: ["balrcutz", "toastful", "mohd-shah-dolah"],
  },
  {
    slug: "custom-web-applications",
    index: "02",
    title: {
      en: "Custom Web Applications & Software Systems",
      ms: "Aplikasi Web & Sistem Perisian Tersuai",
    },
    short: { en: "Software Systems", ms: "Sistem Perisian" },
    tagline: {
      en: "Operational software shaped exactly to your business.",
      ms: "Perisian operasi dibentuk tepat mengikut perniagaan anda.",
    },
    description: {
      en: "Dashboards, portals, booking engines, ERPs and internal tools — custom systems that remove manual work and scale with your operation.",
      ms: "Papan pemuka, portal, enjin tempahan, ERP dan alat dalaman — sistem tersuai yang menghapuskan kerja manual dan berkembang bersama operasi anda.",
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
          en: "Role-based access, audit trails and best-practice security.",
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
    slug: "custom-digital-design",
    index: "03",
    title: { en: "Custom Digital Design", ms: "Reka Bentuk Digital Tersuai" },
    short: { en: "Brand & Design", ms: "Jenama & Reka Bentuk" },
    tagline: {
      en: "Identity systems that make businesses look like leaders.",
      ms: "Sistem identiti yang menjadikan perniagaan kelihatan seperti peneraju.",
    },
    description: {
      en: "Logos, brand systems, UI design, pitch decks and campaign visuals — a consistent visual language across everything you ship.",
      ms: "Logo, sistem jenama, reka bentuk UI, dek pembentangan dan visual kempen — bahasa visual yang konsisten merentas semua yang anda hasilkan.",
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
    index: "04",
    title: { en: "Digital Marketing Management", ms: "Pengurusan Pemasaran Digital" },
    short: { en: "Growth Marketing", ms: "Pemasaran Pertumbuhan" },
    tagline: {
      en: "Campaigns run like engineering: measured, iterated, scaled.",
      ms: "Kempen diurus seperti kejuruteraan: diukur, ditambah baik, diskalakan.",
    },
    description: {
      en: "Paid media, funnels, analytics and creative — managed end-to-end with reporting you can actually read.",
      ms: "Media berbayar, corong jualan, analitik dan kreatif — diurus hujung ke hujung dengan laporan yang benar-benar boleh difahami.",
    },
    features: [
      {
        name: { en: "Paid campaigns", ms: "Kempen berbayar" },
        detail: {
          en: "Meta, Google and platform ads tuned for return, not reach.",
          ms: "Iklan Meta, Google dan platform ditala untuk pulangan, bukan capaian.",
        },
      },
      {
        name: { en: "Funnel strategy", ms: "Strategi corong" },
        detail: {
          en: "From first click to closed deal, every step designed.",
          ms: "Dari klik pertama hingga urus niaga selesai, setiap langkah direka.",
        },
      },
      {
        name: { en: "Analytics & reporting", ms: "Analitik & laporan" },
        detail: {
          en: "Dashboards that show money, not vanity metrics.",
          ms: "Papan pemuka yang menunjukkan hasil, bukan metrik kosong.",
        },
      },
      {
        name: { en: "Creative production", ms: "Penghasilan kreatif" },
        detail: {
          en: "Ad creative shipped fast and tested faster.",
          ms: "Kreatif iklan dihasilkan pantas dan diuji lebih pantas.",
        },
      },
    ],
    related: ["prince-lubricants", "toastful"],
  },
  {
    slug: "merchandise-design",
    index: "05",
    title: {
      en: "Custom Merchandise Design & Procurement",
      ms: "Reka Bentuk & Perolehan Barangan Tersuai",
    },
    short: { en: "Merchandise", ms: "Barangan" },
    tagline: {
      en: "Physical brand touchpoints, designed and delivered.",
      ms: "Sentuhan jenama fizikal, direka dan dihantar.",
    },
    description: {
      en: "Apparel, packaging and branded goods — designed in-house and produced through a vetted procurement network.",
      ms: "Pakaian, pembungkusan dan barangan berjenama — direka secara dalaman dan dihasilkan melalui rangkaian perolehan yang disahkan.",
    },
    features: [
      {
        name: { en: "Product design", ms: "Reka bentuk produk" },
        detail: {
          en: "Merchandise people actually want to keep.",
          ms: "Barangan yang orang benar-benar mahu simpan.",
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
        name: { en: "End-to-end delivery", ms: "Penghantaran hujung ke hujung" },
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
    related: ["wrap-district", "balrcutz"],
  },
  {
    slug: "corporate-gifts",
    index: "06",
    title: { en: "Custom Corporate Gift Solutions", ms: "Penyelesaian Hadiah Korporat Tersuai" },
    short: { en: "Corporate Gifts", ms: "Hadiah Korporat" },
    tagline: {
      en: "Gifts that make your company unforgettable.",
      ms: "Hadiah yang menjadikan syarikat anda tidak dilupakan.",
    },
    description: {
      en: "Curated corporate gifting programs for clients, partners and teams — premium, personalised and handled end-to-end.",
      ms: "Program hadiah korporat terpilih untuk pelanggan, rakan kongsi dan pasukan — premium, diperibadikan dan diurus sepenuhnya.",
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
          en: "Festive and event gifting, planned ahead.",
          ms: "Hadiah perayaan dan acara, dirancang awal.",
        },
      },
    ],
    related: ["cyw-art-craft"],
  },
  {
    slug: "ai-automation",
    index: "07",
    title: { en: "AI Automation — SEO · AEO · GEO", ms: "Automasi AI — SEO · AEO · GEO" },
    short: { en: "AI Automation", ms: "Automasi AI" },
    tagline: {
      en: "Be the answer when machines answer for you.",
      ms: "Jadilah jawapan apabila mesin menjawab bagi pihak anda.",
    },
    description: {
      en: "Search engine, answer engine and generative engine optimisation — plus AI workflow automation that removes repetitive work from your business.",
      ms: "Pengoptimuman enjin carian, enjin jawapan dan enjin generatif — serta automasi aliran kerja AI yang menghapuskan kerja berulang daripada perniagaan anda.",
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
        name: { en: "AEO", ms: "AEO" },
        detail: {
          en: "Structured so AI assistants cite you as the answer.",
          ms: "Distruktur supaya pembantu AI memetik anda sebagai jawapan.",
        },
      },
      {
        name: { en: "GEO", ms: "GEO" },
        detail: {
          en: "Visibility inside generative results, not just blue links.",
          ms: "Keterlihatan dalam hasil generatif, bukan sekadar pautan biru.",
        },
      },
      {
        name: { en: "Workflow automation", ms: "Automasi aliran kerja" },
        detail: {
          en: "AI agents handling the busywork your team shouldn't.",
          ms: "Ejen AI menguruskan kerja rutin yang tidak patut dibuat pasukan anda.",
        },
      },
    ],
    related: ["roadtainers", "mohd-shah-dolah"],
  },
  {
    slug: "ai-products",
    index: "08",
    title: { en: "Custom AI Products & Software", ms: "Produk & Perisian AI Tersuai" },
    short: { en: "AI Products", ms: "Produk AI" },
    tagline: {
      en: "Your data, your workflows — with intelligence built in.",
      ms: "Data anda, aliran kerja anda — dengan kecerdasan terbina.",
    },
    description: {
      en: "Chatbots, copilots, RAG systems and AI-powered platforms — designed, trained and shipped as real products.",
      ms: "Chatbot, copilot, sistem RAG dan platform berkuasa AI — direka, dilatih dan dilancarkan sebagai produk sebenar.",
    },
    features: [
      {
        name: { en: "AI assistants", ms: "Pembantu AI" },
        detail: {
          en: "Customer-facing bots trained on your knowledge.",
          ms: "Bot pelanggan dilatih dengan pengetahuan anda.",
        },
      },
      {
        name: { en: "RAG systems", ms: "Sistem RAG" },
        detail: {
          en: "Answers grounded in your documents, not hallucinations.",
          ms: "Jawapan berasaskan dokumen anda, bukan halusinasi.",
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
    slug: "social-media-management",
    index: "09",
    title: { en: "Social Media Management", ms: "Pengurusan Media Sosial" },
    short: { en: "Social Media", ms: "Media Sosial" },
    tagline: {
      en: "A feed that looks as serious as your business is.",
      ms: "Feed yang kelihatan seserius perniagaan anda.",
    },
    description: {
      en: "Content calendars, production, publishing and community management — a consistent, premium presence across platforms.",
      ms: "Kalendar kandungan, penghasilan, penerbitan dan pengurusan komuniti — kehadiran premium yang konsisten merentas platform.",
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
          en: "Posts, reels and stories produced in-house.",
          ms: "Post, reel dan story dihasilkan secara dalaman.",
        },
      },
      {
        name: { en: "Publishing & community", ms: "Penerbitan & komuniti" },
        detail: {
          en: "Scheduled, posted, answered — every day.",
          ms: "Dijadualkan, diterbitkan, dijawab — setiap hari.",
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
    related: ["toastful", "balrcutz"],
  },
];

// The six services featured in the homepage horizontal experience.
export const featuredSlugs = [
  "website-design-development",
  "custom-web-applications",
  "ai-automation",
  "ai-products",
  "custom-digital-design",
  "digital-marketing",
];

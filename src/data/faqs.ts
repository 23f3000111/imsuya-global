import type { L10n } from "@/i18n/types";

/**
 * Which page a question earns its place on. Each question appears — and is
 * marked up as FAQPage — on exactly one page, so no two URLs ship the same
 * rich result and compete with each other.
 *
 * "services" answers what we do and how it works; "engagement" answers what it
 * costs, how long it takes and what happens after launch.
 */
export type FaqTopic = "services" | "engagement";

export type Faq = { q: L10n; a: L10n; topic: FaqTopic };

/**
 * Written answer-first: the opening sentence names the entity and answers the
 * question on its own, because that is the sentence an answer engine lifts and
 * quotes. The rest carries the detail in the studio's own voice.
 */
export const faqs: Faq[] = [
  /* ---------------- what we do ---------------- */
  {
    topic: "services",
    q: {
      en: "What is an AI creative agency?",
      ms: "Apakah itu agensi kreatif AI?",
    },
    a: {
      en: "An AI creative agency puts creative work — brand, website and graphic design — and AI products and automation under one roof. Imsuya Global is an AI creative agency in Malaysia: the same in-house team designs the brand and the website and builds the AI systems that run behind them, so nothing is handed between vendors.",
      ms: "Agensi kreatif AI menggabungkan kerja kreatif — reka bentuk jenama, laman web dan grafik — dengan produk AI dan automasi di bawah satu bumbung. Imsuya Global ialah agensi kreatif AI di Malaysia: pasukan dalaman yang sama mereka jenama dan laman web serta membina sistem AI di sebaliknya, jadi tiada apa diserahkan antara vendor.",
    },
  },
  {
    topic: "services",
    q: {
      en: "Is Imsuya Global a website development studio in Malaysia?",
      ms: "Adakah Imsuya Global sebuah studio pembangunan laman web di Malaysia?",
    },
    a: {
      en: "Yes. Imsuya Global is a custom website development studio based in Petaling Jaya, Malaysia, working as website designer and website developer in one team. Every site is designed and built from scratch rather than from a template, with performance and technical SEO built in, for businesses in Malaysia and abroad.",
      ms: "Ya. Imsuya Global ialah studio pembangunan laman web tersuai yang berpangkalan di Petaling Jaya, Malaysia, bekerja sebagai pereka dan pembangun laman web dalam satu pasukan. Setiap laman direka dan dibina dari awal, bukan dari templat, dengan prestasi dan SEO teknikal terbina, untuk perniagaan di Malaysia dan luar negara.",
    },
  },
  {
    topic: "services",
    q: {
      en: "Is Imsuya Global an AI agency in Malaysia?",
      ms: "Adakah Imsuya Global sebuah agensi AI di Malaysia?",
    },
    a: {
      en: "Yes. Imsuya Global is an AI agency in Malaysia that designs, trains and ships AI products and systems: chatbots and AI assistants, AI agents and automated workflows, and custom business programmes. AI work sits alongside website design, custom web applications and digital design, so an AI product arrives with the interface and brand it needs.",
      ms: "Ya. Imsuya Global ialah agensi AI di Malaysia yang mereka, melatih dan melancarkan produk dan sistem AI: chatbot dan pembantu AI, ejen AI dan aliran kerja automatik, serta program perniagaan tersuai. Kerja AI berjalan seiring reka bentuk laman web, aplikasi web tersuai dan reka bentuk digital, jadi produk AI hadir bersama antara muka dan jenama yang diperlukannya.",
    },
  },
  {
    topic: "services",
    q: {
      en: "What does Imsuya Global do?",
      ms: "Apa yang Imsuya Global lakukan?",
    },
    a: {
      en: "Imsuya Global is an AI creative agency and website development studio based in Petaling Jaya, Malaysia, offering four in-house disciplines: website design and development, custom web applications and software systems, AI services and programmes, and custom digital design covering brand identity through to merchandise. Strategy, design, engineering and production all sit under one roof.",
      ms: "Imsuya Global ialah agensi kreatif AI dan studio pembangunan laman web yang berpangkalan di Petaling Jaya, Malaysia, menawarkan empat disiplin dalaman: reka bentuk dan pembangunan laman web, aplikasi web dan sistem perisian tersuai, perkhidmatan dan program AI, serta reka bentuk digital tersuai dari identiti jenama hingga barangan. Strategi, reka bentuk, kejuruteraan dan produksi semuanya di bawah satu bumbung.",
    },
  },
  {
    topic: "services",
    q: {
      en: "Is Imsuya Global a web design agency or a full digital agency?",
      ms: "Adakah Imsuya Global agensi reka bentuk web atau agensi digital penuh?",
    },
    a: {
      en: "Imsuya Global is a full service digital agency, not only a web design studio. Alongside websites, the in-house team builds custom software systems, AI products and programmes, and digital design from brand identity through to merchandise, so you can launch and grow with one team instead of coordinating several vendors.",
      ms: "Imsuya Global ialah agensi digital perkhidmatan penuh, bukan sekadar studio reka bentuk web. Selain laman web, pasukan dalaman kami membina perisian tersuai, automasi AI dan produk AI, identiti jenama serta pemasaran berterusan, jadi anda boleh melancar dan berkembang dengan satu pasukan tanpa perlu menyelaras beberapa vendor.",
    },
  },
  {
    topic: "services",
    q: {
      en: "What is AI automation and how can it help my business?",
      ms: "Apakah automasi AI dan bagaimana ia membantu perniagaan saya?",
    },
    a: {
      en: "AI automation uses software and AI agents to handle repetitive manual tasks such as data entry, lead follow up and reporting, freeing staff time and reducing errors. Imsuya Global designs custom automation workflows around the tools you already run on, with human checkpoints built in so nothing important runs unwatched.",
      ms: "Automasi AI menggunakan perisian dan ejen AI untuk mengendalikan tugas manual berulang seperti kemasukan data, susulan prospek dan pelaporan, membebaskan masa kakitangan dan mengurangkan kesilapan. Imsuya Global mereka aliran kerja automasi tersuai berdasarkan alat yang anda sudah gunakan, dengan titik semakan manusia terbina supaya tiada perkara penting berjalan tanpa pengawasan.",
    },
  },
  {
    topic: "services",
    q: {
      en: "Does Imsuya Global build custom software, or only websites?",
      ms: "Adakah Imsuya Global membina perisian tersuai, atau laman web sahaja?",
    },
    a: {
      en: "Imsuya Global builds custom web applications and software systems as well as websites, covering process automation, integrations, secure role based architecture and systems designed to scale from ten users to ten thousand. These are engineered builds, not template sites.",
      ms: "Imsuya Global membina aplikasi web dan sistem perisian tersuai selain laman web, merangkumi automasi proses, integrasi, seni bina selamat berasaskan peranan dan sistem yang direka untuk berkembang daripada sepuluh pengguna kepada sepuluh ribu. Ini binaan kejuruteraan, bukan laman templat.",
    },
  },
  {
    topic: "services",
    q: {
      en: "Does Imsuya Global build AI products, like AI assistants or internal tools?",
      ms: "Adakah Imsuya Global membina produk AI seperti pembantu AI atau alat dalaman?",
    },
    a: {
      en: "Yes. Imsuya Global builds AI products and systems in Malaysia through its AI Services & Programme line: custom AI assistants, knowledge systems, automated workflows and business programmes trained on a client's own material and shipped as real software. Live work includes a support chatbot for Safeeds Auto Transport, an intelligent booking flow for GigYard and a retail operations CRM for Legendary.",
      ms: "Ya. Imsuya Global membina produk dan sistem AI di Malaysia melalui barisan Perkhidmatan & Program AI: pembantu AI tersuai, sistem pengetahuan, aliran kerja automatik dan program perniagaan yang dilatih dengan bahan pelanggan sendiri dan dilancarkan sebagai perisian sebenar. Kerja yang sudah beroperasi termasuk chatbot sokongan untuk Safeeds Auto Transport, aliran tempahan pintar untuk GigYard dan CRM operasi runcit untuk Legendary.",
    },
  },
  {
    topic: "services",
    q: {
      en: "What is the difference between SEO, GEO and AEO?",
      ms: "Apakah perbezaan antara SEO, GEO dan AEO?",
    },
    a: {
      en: "SEO improves rankings in traditional search results like Google. AEO targets direct answer boxes and featured snippets. GEO focuses on being found, understood and cited by AI tools such as ChatGPT, Perplexity and Google AI Overviews. Imsuya Global builds for all three at once — structured data, answer-shaped content and clean technical foundations go into every site it ships, rather than being sold as a separate product afterwards.",
      ms: "SEO meningkatkan kedudukan dalam hasil carian tradisional seperti Google. AEO menyasarkan kotak jawapan terus dan petikan pilihan. GEO memberi tumpuan supaya perniagaan ditemui, difahami dan dipetik oleh alat AI seperti ChatGPT, Perplexity dan Google AI Overviews. Imsuya Global membina untuk ketiga tiganya serentak — data berstruktur, kandungan berbentuk jawapan dan asas teknikal yang bersih dimasukkan ke dalam setiap laman, bukan dijual sebagai produk berasingan selepas itu.",
    },
  },
  {
    topic: "services",
    q: {
      en: "Is SEO handled when Imsuya Global builds a website?",
      ms: "Adakah SEO diuruskan apabila Imsuya Global membina laman web?",
    },
    a: {
      en: "Yes. Technical SEO, AEO and GEO groundwork is part of Smart Website Design and Development, not an upsell: structured data, canonical URLs, sitemaps, performance budgets and answer-shaped content ship with the site. Imsuya Global also stays on after launch for monitoring, iterations and new features.",
      ms: "Ya. Asas SEO teknikal, AEO dan GEO adalah sebahagian daripada Reka Bentuk & Pembangunan Laman Web Pintar, bukan tambahan berbayar: data berstruktur, URL kanonik, peta laman, bajet prestasi dan kandungan berbentuk jawapan dihantar bersama laman. Imsuya Global juga kekal selepas pelancaran untuk pemantauan, penambahbaikan dan ciri baharu.",
    },
  },
  {
    topic: "services",
    q: {
      en: "Can Imsuya Global design a brand identity, not just a website?",
      ms: "Bolehkah Imsuya Global mereka identiti jenama, bukan sekadar laman web?",
    },
    a: {
      en: "Yes. Custom Digital Design is a dedicated service line covering brand identity, UI and UX design, campaign creative and full design systems, produced by the same in-house team handling the website or software, so the physical and digital work never drift apart.",
      ms: "Ya. Reka Bentuk Digital Tersuai ialah barisan perkhidmatan khusus yang merangkumi identiti jenama, reka bentuk UI dan UX, kreatif kempen dan sistem reka bentuk penuh, dihasilkan oleh pasukan dalaman yang sama mengendalikan laman web atau perisian, supaya kerja fizikal dan digital tidak pernah terpisah.",
    },
  },

  /* ---------------- working with us ---------------- */
  {
    topic: "engagement",
    q: {
      en: "Where is Imsuya Global located, and does it work outside Malaysia?",
      ms: "Di manakah Imsuya Global dan adakah ia bekerja di luar Malaysia?",
    },
    a: {
      en: "Imsuya Global is based in Damansara Perdana, Petaling Jaya, Selangor, Malaysia, and works with clients across Asia, Africa and the Middle East. Engagements run remotely with scheduled check ins in your own time zone.",
      ms: "Imsuya Global berpangkalan di Damansara Perdana, Petaling Jaya, Selangor, Malaysia, dan bekerja dengan pelanggan di seluruh Asia, Afrika dan Timur Tengah. Projek dijalankan secara jarak jauh dengan sesi semakan berjadual mengikut zon masa anda.",
    },
  },
  {
    topic: "engagement",
    q: {
      en: "How much does a custom website cost with Imsuya Global?",
      ms: "Berapakah kos laman web tersuai dengan Imsuya Global?",
    },
    a: {
      en: "Imsuya Global quotes every project on scope rather than a fixed package price, because cost depends on features, pages, integrations and design complexity. You receive a written proposal with a clear price and timeline before any work begins, with no obligation.",
      ms: "Imsuya Global menyebut harga setiap projek mengikut skop, bukan pakej harga tetap, kerana kos bergantung pada ciri, bilangan halaman, integrasi dan kerumitan reka bentuk. Anda menerima cadangan bertulis dengan harga dan garis masa yang jelas sebelum kerja bermula, tanpa sebarang ikatan.",
    },
  },
  {
    topic: "engagement",
    q: {
      en: "How long does it take to build a website or web app?",
      ms: "Berapa lama masa diambil untuk membina laman web atau aplikasi web?",
    },
    a: {
      en: "A focused marketing website typically takes four to six weeks with Imsuya Global. Web applications and AI systems take longer depending on scope, and you receive a milestone plan with dates before the project starts.",
      ms: "Laman pemasaran yang fokus biasanya mengambil empat hingga enam minggu dengan Imsuya Global. Aplikasi web dan sistem AI mengambil masa lebih lama bergantung pada skop, dan anda menerima pelan pencapaian bertarikh sebelum projek bermula.",
    },
  },
  {
    topic: "engagement",
    q: {
      en: "Who owns the code and design after launch?",
      ms: "Siapa memiliki kod dan reka bentuk selepas pelancaran?",
    },
    a: {
      en: "The client owns everything after launch: the domain, the hosting account and the full source code. Imsuya Global hands over complete access along with a walkthrough, so your team can edit content without calling a developer.",
      ms: "Pelanggan memiliki segalanya selepas pelancaran: domain, akaun hosting dan kod sumber penuh. Imsuya Global menyerahkan akses lengkap berserta panduan, supaya pasukan anda boleh mengubah kandungan tanpa memanggil pembangun.",
    },
  },
  {
    topic: "engagement",
    q: {
      en: "What happens after my website or software launches?",
      ms: "Apa yang berlaku selepas laman web atau perisian saya dilancarkan?",
    },
    a: {
      en: "Launch is treated as the starting point, not the end. Imsuya Global stays on for iterations, monitoring and support, and most clients continue on a monthly retainer for content, iterations and new features.",
      ms: "Pelancaran dianggap sebagai permulaan, bukan penamat. Imsuya Global kekal bersama untuk penambahbaikan, pemantauan dan sokongan, dan kebanyakan pelanggan meneruskan secara bulanan untuk pemasaran, kandungan dan ciri baharu.",
    },
  },
  {
    topic: "engagement",
    q: {
      en: "What industries has Imsuya Global worked with?",
      ms: "Industri apakah yang pernah dikendalikan Imsuya Global?",
    },
    a: {
      en: "Imsuya Global has delivered projects across logistics, early childhood education, industrial property, perfume and fragrance retail, industrial lubricants, automotive, F&B and premium barbershops, with fifteen live projects shipped to date.",
      ms: "Imsuya Global telah menyiapkan projek dalam bidang logistik, pendidikan awal kanak kanak, hartanah industri, runcit minyak wangi, pelincir industri, automotif, makanan dan minuman serta kedai gunting premium, dengan lima belas projek sudah beroperasi setakat ini.",
    },
  },
  {
    topic: "engagement",
    q: {
      en: "How do I start a project with Imsuya Global?",
      ms: "Bagaimana saya memulakan projek dengan Imsuya Global?",
    },
    a: {
      en: "Projects start with a sixty second brief on the contact page, a direct WhatsApp message, or an email to info@imsuyaglobal.com. Imsuya Global replies within one business day with next steps and, where the scope is clear, a written proposal.",
      ms: "Projek bermula dengan taklimat enam puluh saat di halaman hubungi, mesej WhatsApp terus, atau emel ke info@imsuyaglobal.com. Imsuya Global membalas dalam satu hari bekerja dengan langkah seterusnya dan, jika skop sudah jelas, cadangan bertulis.",
    },
  },
];

/** The questions that belong on one page, in the order they were written. */
export const faqsFor = (topic: FaqTopic): Faq[] => faqs.filter((f) => f.topic === topic);

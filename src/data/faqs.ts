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
      en: "What does Imsuya Global do?",
      ms: "Apa yang Imsuya Global lakukan?",
    },
    a: {
      en: "Imsuya Global is a boutique creative digital agency based in Petaling Jaya, Malaysia, offering nine in-house disciplines: website design and development, custom web applications, AI automation, AI products, digital design, digital marketing (SEO, GEO and AEO), social media management, merchandise design and corporate gifts. Strategy, design, engineering and growth all sit under one roof.",
      ms: "Imsuya Global ialah agensi digital kreatif butik yang berpangkalan di Petaling Jaya, Malaysia, menawarkan sembilan disiplin dalaman: reka bentuk dan pembangunan laman web, aplikasi web tersuai, automasi AI, produk AI, reka bentuk digital, pemasaran digital (SEO, GEO dan AEO), pengurusan media sosial, reka bentuk barangan dan hadiah korporat. Strategi, reka bentuk, kejuruteraan dan pertumbuhan semuanya di bawah satu bumbung.",
    },
  },
  {
    topic: "services",
    q: {
      en: "Is Imsuya Global a web design agency or a full digital agency?",
      ms: "Adakah Imsuya Global agensi reka bentuk web atau agensi digital penuh?",
    },
    a: {
      en: "Imsuya Global is a full service digital agency, not only a web design studio. Alongside websites, the in-house team builds custom software, AI automation and AI products, brand identity and ongoing marketing, so you can launch and grow with one team instead of coordinating several vendors.",
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
      en: "Yes. Imsuya Global's AI Products & Softwares line builds custom AI assistants, knowledge systems and data pipelines trained on a client's own material, shipped as real products their customers use. Two are live now: a support chatbot for Safeeds Auto Transport and an intelligent booking flow for GigYard.",
      ms: "Ya. Barisan Produk & Perisian AI Imsuya Global membina pembantu AI tersuai, sistem pengetahuan dan saluran data yang dilatih dengan bahan pelanggan sendiri, dilancarkan sebagai produk sebenar yang digunakan pelanggan mereka. Dua sudah beroperasi: chatbot sokongan untuk Safeeds Auto Transport dan aliran tempahan pintar untuk GigYard.",
    },
  },
  {
    topic: "services",
    q: {
      en: "What is the difference between SEO, GEO and AEO?",
      ms: "Apakah perbezaan antara SEO, GEO dan AEO?",
    },
    a: {
      en: "SEO improves rankings in traditional search results like Google. AEO targets direct answer boxes and featured snippets. GEO focuses on being found, understood and cited by AI tools such as ChatGPT, Perplexity and Google AI Overviews. Imsuya Global's digital marketing service covers all three under one strategy rather than treating them as separate products.",
      ms: "SEO meningkatkan kedudukan dalam hasil carian tradisional seperti Google. AEO menyasarkan kotak jawapan terus dan petikan pilihan. GEO memberi tumpuan supaya perniagaan ditemui, difahami dan dipetik oleh alat AI seperti ChatGPT, Perplexity dan Google AI Overviews. Perkhidmatan pemasaran digital Imsuya Global merangkumi ketiga tiganya dalam satu strategi, bukan sebagai produk berasingan.",
    },
  },
  {
    topic: "services",
    q: {
      en: "Does Imsuya Global offer ongoing marketing and SEO after building a website?",
      ms: "Adakah Imsuya Global menawarkan pemasaran dan SEO berterusan selepas membina laman web?",
    },
    a: {
      en: "Yes. Digital Marketing Management is one of Imsuya Global's nine service lines, covering SEO, GEO and AEO, paid campaigns on Meta and Google, and analytics and reporting. A site's performance is actively managed after launch rather than left to sit.",
      ms: "Ya. Pengurusan Pemasaran Digital ialah satu daripada sembilan barisan perkhidmatan Imsuya Global, merangkumi SEO, GEO dan AEO, kempen berbayar di Meta dan Google, serta analitik dan laporan. Prestasi laman diurus secara aktif selepas pelancaran, bukan dibiarkan begitu sahaja.",
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
      en: "Launch is treated as the starting point, not the end. Imsuya Global stays on for iterations, monitoring and support, and most clients continue on a monthly retainer for marketing, content and new features.",
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
      en: "Projects start with a sixty second brief on the contact page, a direct WhatsApp message, or an email to hello@imsuyaglobal.com. Imsuya Global replies within one business day with next steps and, where the scope is clear, a written proposal.",
      ms: "Projek bermula dengan taklimat enam puluh saat di halaman hubungi, mesej WhatsApp terus, atau emel ke hello@imsuyaglobal.com. Imsuya Global membalas dalam satu hari bekerja dengan langkah seterusnya dan, jika skop sudah jelas, cadangan bertulis.",
    },
  },
];

/** The questions that belong on one page, in the order they were written. */
export const faqsFor = (topic: FaqTopic): Faq[] => faqs.filter((f) => f.topic === topic);

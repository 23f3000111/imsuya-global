import type { L10n } from "@/i18n/types";

export type Faq = { q: L10n; a: L10n };

export const faqs: Faq[] = [
  {
    q: {
      en: "What does Imsuya Global actually do?",
      ms: "Apa sebenarnya yang Imsuya Global lakukan?",
    },
    a: {
      en: "We are a boutique studio covering nine disciplines: smart websites, custom web applications and software, AI automation, AI products, digital design, digital marketing, social media, merchandise and corporate gifts. Strategy, design, engineering and growth all sit under one roof.",
      ms: "Kami studio butik yang merangkumi sembilan disiplin: laman web pintar, aplikasi web dan perisian tersuai, automasi AI, produk AI, reka bentuk digital, pemasaran digital, media sosial, barangan dan hadiah korporat. Strategi, reka bentuk, kejuruteraan dan pertumbuhan semuanya di bawah satu bumbung.",
    },
  },
  {
    q: { en: "How long does a project take?", ms: "Berapa lama sesuatu projek mengambil masa?" },
    a: {
      en: "A focused marketing site typically runs four to six weeks. Web applications and AI systems depend on scope, so we give you a milestone plan with dates before anything starts.",
      ms: "Laman pemasaran yang fokus biasanya mengambil empat hingga enam minggu. Aplikasi web dan sistem AI bergantung pada skop, jadi kami berikan pelan pencapaian bertarikh sebelum apa apa bermula.",
    },
  },
  {
    q: { en: "How much does it cost?", ms: "Berapakah kosnya?" },
    a: {
      en: "Every build is quoted on scope rather than a fixed menu. Tell us what you need and you will have a written proposal with a clear price and timeline, no obligation.",
      ms: "Setiap binaan disebut harga mengikut skop, bukan menu tetap. Beritahu kami keperluan anda dan anda akan menerima cadangan bertulis dengan harga dan garis masa yang jelas, tanpa sebarang ikatan.",
    },
  },
  {
    q: {
      en: "Do you work with businesses outside Malaysia?",
      ms: "Adakah anda bekerja dengan perniagaan di luar Malaysia?",
    },
    a: {
      en: "Yes. We are based in Petaling Jaya and deliver for clients across Asia, Africa and the Middle East. Everything runs remotely with scheduled check ins in your time zone.",
      ms: "Ya. Kami berpangkalan di Petaling Jaya dan menyampaikan kerja untuk pelanggan di seluruh Asia, Afrika dan Timur Tengah. Semuanya berjalan secara jarak jauh dengan sesi semakan mengikut zon masa anda.",
    },
  },
  {
    q: { en: "Do I own the website when it launches?", ms: "Adakah laman web itu milik saya selepas dilancarkan?" },
    a: {
      en: "You do. The domain, the hosting account and the code are yours. We hand over full access and a walkthrough so your team can edit content without calling a developer.",
      ms: "Ya. Domain, akaun hosting dan kod adalah milik anda. Kami serahkan akses penuh berserta panduan supaya pasukan anda boleh mengubah kandungan tanpa memanggil pembangun.",
    },
  },
  {
    q: { en: "What happens after launch?", ms: "Apa yang berlaku selepas pelancaran?" },
    a: {
      en: "Launch is the start. We stay on for iterations, monitoring and support, and most clients keep us on a monthly retainer for marketing, content and new features.",
      ms: "Pelancaran adalah permulaan. Kami kekal untuk penambahbaikan, pemantauan dan sokongan, dan kebanyakan pelanggan mengekalkan kami secara bulanan untuk pemasaran, kandungan dan ciri baharu.",
    },
  },
];

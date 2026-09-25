import type { ShowcaseItem } from "@/components/ui/ShowcaseGallery";

/**
 * Legendary Retail CRM — the programme shown on the AI Services & Programme
 * page. Four screens, in the order a visitor should meet them: the managing
 * director's morning view first, the sign-in last.
 *
 * The captures are cropped to a common 1365x600 frame. That also trims the
 * browser status bar that had been caught along the bottom of the overview
 * screen, which was printing the staging URL.
 */
export const legendaryCrm: ShowcaseItem[] = [
  {
    name: "Group overview",
    kind: { en: "The managing director's morning", ms: "Pagi pengarah urusan" },
    image: "/services/crm/crm-overview.png",
    blurb: {
      en: "The first screen head office sees. Yesterday's takings from the three stores that get checked first, rolling 30-day revenue, units sold, orders in flight and a short list of what needs attention — across the whole store network on one page.",
      ms: "Skrin pertama yang dilihat ibu pejabat. Jualan semalam dari tiga kedai yang disemak dahulu, hasil 30 hari bergulir, unit terjual, pesanan dalam proses dan senarai ringkas perkara yang perlu diberi perhatian — merentas seluruh rangkaian kedai dalam satu halaman.",
    },
    items: [
      { en: "Priority stores flagged when a day is not filed", ms: "Kedai keutamaan ditanda jika hari tidak difailkan" },
      { en: "Revenue, units and orders at a glance", ms: "Hasil, unit dan pesanan sepintas lalu" },
      { en: "A running list of what needs you first", ms: "Senarai perkara yang perlu anda uruskan dahulu" },
    ],
  },
  {
    name: "Store estate",
    kind: { en: "Every outlet, one table", ms: "Setiap cawangan, satu jadual" },
    image: "/services/crm/crm-stores.png",
    blurb: {
      en: "Main stores, dealers and consignment partners, each reporting on its own rhythm — daily with country data, daily with products, or monthly with margin. Month-to-date sales, units and target pace per store, with missing filings called out before anyone has to chase them.",
      ms: "Kedai utama, pengedar dan rakan konsainan, masing masing melapor mengikut rentak sendiri — harian dengan data negara, harian dengan produk, atau bulanan dengan margin. Jualan bulan semasa, unit dan kadar sasaran setiap kedai, dengan laporan yang tertinggal ditonjolkan sebelum sesiapa perlu mengejarnya.",
    },
    items: [
      { en: "Three channel types, three reporting rhythms", ms: "Tiga jenis saluran, tiga rentak laporan" },
      { en: "Target pace tracked store by store", ms: "Kadar sasaran dijejak kedai demi kedai" },
      { en: "Search, filter and export the estate", ms: "Cari, tapis dan eksport senarai kedai" },
    ],
  },
  {
    name: "Store today",
    kind: { en: "The promoter's day on the floor", ms: "Hari promoter di lantai jualan" },
    image: "/services/crm/crm-store-today.png",
    blurb: {
      en: "What a store promoter works from. Record a sale, close the day, check stock and orders; takings so far against the monthly target, items below reorder level, and — for an airport store — which countries bought today.",
      ms: "Apa yang digunakan promoter kedai. Rekod jualan, tutup hari, semak stok dan pesanan; jualan setakat ini berbanding sasaran bulanan, item di bawah paras pesanan semula, dan — untuk kedai di lapangan terbang — negara mana yang membeli hari ini.",
    },
    items: [
      { en: "Record a sale and close the day from one screen", ms: "Rekod jualan dan tutup hari dari satu skrin" },
      { en: "Items below reorder level shown up front", ms: "Item di bawah paras pesanan semula dipaparkan di hadapan" },
      { en: "Buyers by country, for the tourist trade", ms: "Pembeli mengikut negara, untuk pasaran pelancong" },
    ],
  },
  {
    name: "Sign in",
    kind: { en: "One login per person", ms: "Satu log masuk setiap orang" },
    image: "/services/crm/crm-sign-in.png",
    blurb: {
      en: "Accounts are issued by head office, not self-registered, and each role lands on its own view: directors on the group overview, promoters on their store's day, each with the screens that job needs.",
      ms: "Akaun dikeluarkan oleh ibu pejabat, bukan didaftar sendiri, dan setiap peranan mendarat di paparan sendiri: pengarah di gambaran keseluruhan kumpulan, promoter di hari kedai mereka, masing masing dengan skrin yang diperlukan tugas itu.",
    },
    items: [
      { en: "Accounts issued by head office", ms: "Akaun dikeluarkan oleh ibu pejabat" },
      { en: "Role-based landing and permissions", ms: "Halaman dan kebenaran mengikut peranan" },
      { en: "Built as a web app — no install on store devices", ms: "Dibina sebagai aplikasi web — tiada pemasangan pada peranti kedai" },
    ],
  },
];

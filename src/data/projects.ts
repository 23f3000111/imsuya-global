import type { L10n } from "@/i18n/types";

export type Project = {
  slug: string;
  name: string;
  /** Set where a brand has more than one site, to tell the versions apart. */
  variant?: L10n;
  sector: L10n;
  summary: L10n;
  /** Capture under /work, sized 1600x748 so every card frames identically. */
  image: string | null;
  /** Live site or mockup. "#" falls back to the internal case study. */
  url: string;
};

export const projects: Project[] = [
  {
    slug: "roadtainers",
    name: "Roadtainers",
    sector: { en: "Logistics", ms: "Logistik" },
    summary: {
      en: "Logistics built for scale. A fleet and network site for East Africa's most demanding corridors.",
      ms: "Logistik dibina untuk skala. Laman armada dan rangkaian untuk koridor paling mencabar di Afrika Timur.",
    },
    image: "/work/roadtainers.jpg",
    url: "https://www.roadtainers.co.ke/",
  },
  {
    slug: "twinkle-kidz",
    name: "Twinkle Kidz",
    sector: { en: "Early Education", ms: "Pendidikan Awal" },
    summary: {
      en: "A joyful preschool and daycare in Taman Tun Dr Ismail, where little stars learn and shine.",
      ms: "Prasekolah dan taska ceria di Taman Tun Dr Ismail, tempat bintang kecil belajar dan bersinar.",
    },
    image: "/work/twinkle-kidz.jpg",
    url: "https://www.twinklekidzttdi.com/",
  },
  {
    slug: "mir",
    name: "M.I.R",
    sector: { en: "Industrial Property", ms: "Hartanah Industri" },
    summary: {
      en: "Factories, warehouses, hotels and industrial land across Malaysia, handled by one dedicated negotiator.",
      ms: "Kilang, gudang, hotel dan tanah industri di seluruh Malaysia, dikendalikan oleh seorang perunding khusus.",
    },
    image: "/work/mir.jpg",
    url: "https://www.myindustrialrealtors.com/",
  },
  {
    slug: "legendary",
    name: "Legendary",
    sector: { en: "Perfume House", ms: "Rumah Minyak Wangi" },
    summary: {
      en: "A Malaysian perfume house bottling the landscapes, culture and soul of the country.",
      ms: "Rumah minyak wangi Malaysia yang membotolkan landskap, budaya dan jiwa negara.",
    },
    image: "/work/legendary.jpg",
    url: "https://23f3000111.github.io/legendary-perfume-v2/",
  },
  {
    slug: "prince-lubricants",
    name: "Prince Lubricants",
    sector: { en: "Industrial", ms: "Industri" },
    summary: {
      en: "High voltage product platform for an oil brand shipping to 25 countries and beyond.",
      ms: "Platform produk bertenaga tinggi untuk jenama minyak yang menghantar ke lebih 25 negara.",
    },
    image: "/work/prince-lubricants.jpg",
    url: "https://23f3000111.github.io/IMSUYA_GLOBAL/Prince%20Lubricants/index.html",
  },
  {
    slug: "wrap-district",
    name: "Wrap District",
    sector: { en: "Automotive Studio", ms: "Studio Automotif" },
    summary: {
      en: "Dark, exclusive brand site for an automotive design and wrapping boutique.",
      ms: "Laman jenama gelap dan eksklusif untuk butik reka bentuk dan balutan kereta.",
    },
    image: "/work/wrap-district.jpg",
    url: "https://23f3000111.github.io/IMSUYA_GLOBAL/Wrap%20District/index.html",
  },
  {
    slug: "toastful",
    name: "Toastful",
    sector: { en: "F&B", ms: "Makanan & Minuman" },
    summary: {
      en: "A warm brand site built around appetite for a sourdough toastie café in Damansara Uptown.",
      ms: "Laman jenama hangat yang membangkitkan selera untuk kafe roti sourdough di Damansara Uptown.",
    },
    image: "/work/toastful.jpg",
    url: "https://imsuya-global-y9lo.vercel.app/",
  },
  {
    slug: "summer-academy-sunshine",
    name: "Summer Academy",
    variant: { en: "Sunshine", ms: "Sunshine" },
    sector: { en: "Education", ms: "Pendidikan" },
    summary: {
      en: "Big ideas start small. A bright, playful route for a Dutch inspired creative primary school.",
      ms: "Idea besar bermula kecil. Hala tuju cerah dan ceria untuk sekolah rendah kreatif berinspirasikan Belanda.",
    },
    image: "/work/summer-academy-sunshine.jpg",
    url: "https://23f3000111.github.io/summer-academy-mockups/site-sunshine/",
  },
  {
    slug: "balrcutz",
    name: "Balrcutz",
    sector: { en: "Premium Barbershop", ms: "Kedai Gunting Premium" },
    summary: {
      en: "Cinematic booking experience for a sports inspired barbershop in Petaling Jaya and Kuala Lumpur.",
      ms: "Pengalaman tempahan sinematik untuk kedai gunting bertema sukan di Petaling Jaya dan Kuala Lumpur.",
    },
    image: "/work/balrcutz.jpg",
    url: "https://23f3000111.github.io/IMSUYA_GLOBAL/BalerCutz/BalerCutz-V1.html",
  },
  {
    slug: "summer-academy-nova",
    name: "Summer Academy",
    variant: { en: "Nova", ms: "Nova" },
    sector: { en: "Education", ms: "Pendidikan" },
    summary: {
      en: "Where bright minds rise. A darker, cosmic route for the same school, built to feel premium.",
      ms: "Tempat minda cerah menyerlah. Hala tuju kosmik yang lebih gelap untuk sekolah sama, dibina agar terasa premium.",
    },
    image: "/work/summer-academy-nova.jpg",
    url: "https://23f3000111.github.io/summer-academy-mockups/site-nova/index.html",
  },
  {
    slug: "mojo-momo-crav",
    name: "Mojo Momo",
    sector: { en: "F&B", ms: "Makanan & Minuman" },
    summary: {
      en: "He lands with the first basket. A craving driven route built around the hero product.",
      ms: "Dia tiba dengan bakul pertama. Hala tuju berteraskan keinginan yang dibina sekitar produk utama.",
    },
    image: "/work/mojo-momo-crav.jpg",
    url: "https://23f3000111.github.io/mojo-momo-mockups/site2-crav/",
  },
  {
    slug: "cyw-art-craft",
    name: "CYW Art & Craft",
    sector: { en: "Education", ms: "Pendidikan" },
    summary: {
      en: "Playful, award winning art school site where young artists bloom, in person and online.",
      ms: "Laman sekolah seni ceria dan memenangi anugerah, tempat seniman muda berkembang, secara bersemuka dan dalam talian.",
    },
    image: "/work/cyw-art-craft.jpg",
    url: "https://23f3000111.github.io/IMSUYA_GLOBAL/CYW%20Art%20%26%20Craft/CYW_ArtCraft.html",
  },
  {
    slug: "victoriashire-one",
    name: "Victoriashire",
    variant: { en: "Concept One", ms: "Konsep Satu" },
    sector: { en: "Early Education", ms: "Pendidikan Awal" },
    summary: {
      en: "Raising confident, independent thinkers. A calm, Montessori inspired route for a Puchong preschool.",
      ms: "Membentuk pemikir yang yakin dan berdikari. Hala tuju tenang berinspirasikan Montessori untuk prasekolah di Puchong.",
    },
    image: "/work/victoriashire-one.jpg",
    url: "https://23f3000111.github.io/victoriashire/mockup-1-html/index.html",
  },
  {
    slug: "victoriashire-three",
    name: "Victoriashire",
    variant: { en: "Concept Three", ms: "Konsep Tiga" },
    sector: { en: "Early Education", ms: "Pendidikan Awal" },
    summary: {
      en: "Make the most of every early year. A warmer, photographic route for the same preschool and music school.",
      ms: "Manfaatkan setiap tahun awal. Hala tuju lebih hangat dan fotografik untuk prasekolah dan sekolah muzik yang sama.",
    },
    image: "/work/victoriashire-three.jpg",
    url: "https://23f3000111.github.io/victoriashire/mockup-3-html/",
  },
  {
    slug: "px98",
    name: "PX98",
    sector: { en: "Automotive Lubricants", ms: "Pelincir Automotif" },
    summary: {
      en: "Precision in every revolution. A premium automotive lubricant brand, another brand by Prince.",
      ms: "Ketepatan dalam setiap pusingan. Jenama pelincir automotif premium, satu lagi jenama oleh Prince.",
    },
    image: "/work/px98.jpg",
    url: "https://23f3000111.github.io/px98-website/index.html",
  },
  {
    slug: "my-french-factory-b",
    name: "My French Factory",
    sector: { en: "F&B", ms: "Makanan & Minuman" },
    summary: {
      en: "Hello, Langkawi. A louder, poster led route for the same crêperie.",
      ms: "Helo, Langkawi. Hala tuju lebih lantang bergaya poster untuk kreperi yang sama.",
    },
    image: "/work/my-french-factory-b.jpg",
    url: "https://23f3000111.github.io/myfrenchfactory-website/option-b/",
  },
];

/** Homepage shows five, reshuffled on every visit. */
export const HOMEPAGE_PICKS = 5;

function shuffled(list: Project[]): Project[] {
  const pool = [...list];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

/**
 * Projects that already have a capture go into the hat first, so the homepage
 * never fills up with holding frames.
 */
export function pickProjects(count: number, from: Project[] = projects): Project[] {
  return [...shuffled(from.filter((p) => p.image)), ...shuffled(from.filter((p) => !p.image))]
    .slice(0, count);
}

/** Stable server side selection, matched on the first client render. */
export const defaultPicks: Project[] = [
  ...projects.filter((p) => p.image),
  ...projects.filter((p) => !p.image),
].slice(0, HOMEPAGE_PICKS);

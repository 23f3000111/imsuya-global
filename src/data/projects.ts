import type { L10n } from "@/i18n/types";

export type Project = {
  slug: string;
  name: string;
  sector: L10n;
  summary: L10n;
  image: string;
  url: string; // TODO: replace "#" with each live site URL
};

export const projects: Project[] = [
  {
    slug: "balrcutz",
    name: "Balrcutz",
    sector: { en: "Premium Barbershop", ms: "Kedai Gunting Premium" },
    summary: {
      en: "Cinematic booking experience for a sports-inspired barbershop in Kuala Lumpur.",
      ms: "Pengalaman tempahan sinematik untuk kedai gunting bertema sukan di Kuala Lumpur.",
    },
    image: "/work/balercutz.png",
    url: "#",
  },
  {
    slug: "mohd-shah-dolah",
    name: "Mohd Shah Dolah",
    sector: { en: "Real Estate", ms: "Hartanah" },
    summary: {
      en: "An editorial, deliberate property portfolio for a Kuala Lumpur estate agent.",
      ms: "Portfolio hartanah bergaya editorial untuk ejen hartanah Kuala Lumpur.",
    },
    image: "/work/mohd-shah-dolah.png",
    url: "#",
  },
  {
    slug: "wrap-district",
    name: "Wrap District",
    sector: { en: "Automotive Studio", ms: "Studio Automotif" },
    summary: {
      en: "Dark, exclusive brand site for an automotive design and wrapping boutique.",
      ms: "Laman jenama gelap dan eksklusif untuk butik reka bentuk dan balutan kereta.",
    },
    image: "/work/wrap-district.png",
    url: "#",
  },
  {
    slug: "prince-lubricants",
    name: "Prince Lubricants",
    sector: { en: "Industrial", ms: "Industri" },
    summary: {
      en: "High-voltage product platform for an oil brand in 25+ countries.",
      ms: "Platform produk bertenaga tinggi untuk jenama minyak di 25+ negara.",
    },
    image: "/work/prince-lubricants.png",
    url: "#",
  },
  {
    slug: "roadtainers",
    name: "Roadtainers",
    sector: { en: "Logistics", ms: "Logistik" },
    summary: {
      en: "Logistics built for scale — a fleet and network site for East Africa's corridors.",
      ms: "Logistik dibina untuk skala — laman armada dan rangkaian untuk koridor Afrika Timur.",
    },
    image: "/work/roadtainers.png",
    url: "#",
  },
  {
    slug: "toastful",
    name: "Toastful",
    sector: { en: "F&B", ms: "Makanan & Minuman" },
    summary: {
      en: "A warm, appetite-driven brand site for a sourdough toastie café.",
      ms: "Laman jenama hangat yang membangkitkan selera untuk kafe roti sourdough.",
    },
    image: "/work/toastful.png",
    url: "#",
  },
  {
    slug: "cyw-art-craft",
    name: "CYW Art & Craft",
    sector: { en: "Education", ms: "Pendidikan" },
    summary: {
      en: "Playful, award-winning art school site where young artists bloom.",
      ms: "Laman sekolah seni ceria dan memenangi anugerah, tempat seniman muda berkembang.",
    },
    image: "/work/cyw-art-craft.png",
    url: "#",
  },
];

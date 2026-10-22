import type { L10n } from "@/i18n/types";

export type TeamMember = {
  name: string;
  role: L10n;
  /** The job title as it goes into the Person structured data on /team. */
  schemaRole: string;
  focus: L10n;
  years: L10n;
  image: string;
  /** Tailwind object-position for the 4:5 portrait frame. */
  position: string;
  bio: L10n;
};

/**
 * The studio's people, in the running order the client set: Founder, then
 * CTO, then Director. One list for the /team page, its structured data and the
 * website assistant, so a change of title or photo lands everywhere at once.
 *
 * Rishikesh's portrait is the real photograph supplied in the October review,
 * under a new file name: the old /team/developer.png URL was a stock
 * placeholder, and a fresh URL means no CDN or browser can keep serving it.
 */
export const team: TeamMember[] = [
  {
    name: "Imran",
    schemaRole: "Founder",
    role: { en: "Founder", ms: "Pengasas" },
    focus: { en: "Vision & Strategy", ms: "Visi & Strategi" },
    years: { en: "16 years in the creative industry", ms: "16 tahun dalam industri kreatif" },
    image: "/team/founder.jpg",
    position: "object-[50%_25%]",
    bio: {
      en: "Sixteen years in the creative industry, known for the strategic vision behind every engagement. Imran sets the direction: which businesses we partner with, what we build for them, and the standard every project has to clear before it ships. He stays close to the work, so the person shaping your strategy is the same person you brief on day one.",
      ms: "Enam belas tahun dalam industri kreatif, dikenali dengan visi strategik di sebalik setiap projek. Imran menetapkan hala tuju: perniagaan mana kami jadikan rakan, apa yang kami bina untuk mereka, dan piawaian yang mesti dicapai setiap projek sebelum dilancarkan. Beliau sentiasa rapat dengan kerja, jadi orang yang membentuk strategi anda adalah orang yang sama yang anda hubungi pada hari pertama.",
    },
  },
  {
    name: "Rishikesh",
    schemaRole: "Chief Technology Officer",
    role: { en: "CTO", ms: "CTO" },
    focus: { en: "Engineering & Systems", ms: "Kejuruteraan & Sistem" },
    years: { en: "9 years in IT and project management", ms: "9 tahun dalam IT dan pengurusan projek" },
    image: "/team/rishikesh.jpg",
    position: "object-[50%_30%]",
    bio: {
      en: "Nine years as an IT expert in project management, having run multiple technical campaigns from brief to launch. Rishikesh turns ambition into working software: websites, platforms and AI systems engineered to hold up long after launch day. Architecture, security and delivery timelines are his call, and the reason our builds scale instead of stall.",
      ms: "Sembilan tahun sebagai pakar IT dalam pengurusan projek, setelah mengendalikan pelbagai kempen teknikal dari taklimat sehingga pelancaran. Rishikesh menukar cita cita kepada perisian yang berfungsi: laman web, platform dan sistem AI yang kekal kukuh lama selepas hari pelancaran. Seni bina, keselamatan dan garis masa penyampaian adalah tanggungjawab beliau, dan sebab binaan kami berkembang dan bukan tersekat.",
    },
  },
  {
    name: "Sumaiya",
    schemaRole: "Director",
    role: { en: "Director", ms: "Pengarah" },
    focus: { en: "Operations & Delivery", ms: "Operasi & Penyampaian" },
    years: {
      en: "8 years in corporate administration",
      ms: "8 tahun dalam pentadbiran korporat",
    },
    image: "/team/director.png",
    position: "object-[50%_15%]",
    bio: {
      en: "Eight years of experience in corporate administration and the daily task flows that keep delivery moving. Sumaiya owns the promise: scopes, timelines and communication are the reason clients always know what is happening and when it lands. Nothing slips, because she is already tracking it before anyone has to ask.",
      ms: "Lapan tahun pengalaman dalam pentadbiran korporat dan aliran tugas harian yang memastikan penyampaian bergerak. Sumaiya memegang janji: skop, garis masa dan komunikasi adalah sebab pelanggan sentiasa tahu apa yang berlaku dan bila ia siap. Tiada apa yang terlepas, kerana beliau sudah menjejakinya sebelum sesiapa perlu bertanya.",
    },
  },
];

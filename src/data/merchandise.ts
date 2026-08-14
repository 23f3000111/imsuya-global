import type { L10n } from "@/i18n/types";

/** Brands we have designed and produced physical merchandise for. */
export const merchandise: { name: string; kind: L10n; image: string }[] = [
  {
    name: "Rotax Max Challenge Asia",
    kind: { en: "Race Series Apparel", ms: "Pakaian Siri Perlumbaan" },
    image: "/merchandise/rotax-max-challenge-asia.jpg",
  },
  {
    name: "SWS Sprint Cup",
    kind: { en: "Team Kit", ms: "Kit Pasukan" },
    image: "/merchandise/sws-sprint-cup.jpg",
  },
  {
    name: "Evas Racing Team",
    kind: { en: "Motorsport Merchandise", ms: "Barangan Sukan Motor" },
    image: "/merchandise/evas-racing-team.jpg",
  },
  {
    name: "Legion Tactical",
    kind: { en: "Tactical Apparel", ms: "Pakaian Taktikal" },
    image: "/merchandise/legion-tactical.jpg",
  },
  {
    name: "Resto Sports Hub",
    kind: { en: "Venue Branding", ms: "Penjenamaan Premis" },
    image: "/merchandise/resto-sports-hub.jpg",
  },
  {
    name: "House of Pickle",
    kind: { en: "Brand Packaging", ms: "Pembungkusan Jenama" },
    image: "/merchandise/house-of-pickle.jpg",
  },
];

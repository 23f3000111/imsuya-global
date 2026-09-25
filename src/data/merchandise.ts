import type { ShowcaseItem } from "@/components/ui/ShowcaseGallery";

/** A board in the merchandise gallery; `items` is what was actually produced. */
export type Merchandise = ShowcaseItem;

/** Brands we have designed and produced physical merchandise for. */
export const merchandise: Merchandise[] = [
  {
    name: "Rotax Max Challenge Asia",
    kind: { en: "Race Series Apparel", ms: "Pakaian Siri Perlumbaan" },
    image: "/merchandise/rotax-max-challenge-asia.jpg",
    blurb: {
      en: "The official collection for Asia's flagship karting series. One identity carried across race wear, paddock wear and spectator merchandise, built to hold up under heat, travel and a full festival weekend.",
      ms: "Koleksi rasmi untuk siri karting utama Asia. Satu identiti dibawa merentas pakaian perlumbaan, pakaian padok dan barangan penonton, dibina untuk bertahan dalam kepanasan, perjalanan dan hujung minggu festival penuh.",
    },
    items: [
      { en: "Racing jacket and jersey", ms: "Jaket dan jersi perlumbaan" },
      { en: "Baseball cap and bucket hat", ms: "Topi besbol dan topi bucket" },
      { en: "Round neck tee and official shirt", ms: "Kemeja-T bulat dan kemeja rasmi" },
      { en: "Sponsor lock-up and colour palette", ms: "Susunan logo penaja dan palet warna" },
    ],
  },
  {
    name: "SWS Sprint Cup",
    kind: { en: "Team Kit", ms: "Kit Pasukan" },
    image: "/merchandise/sws-sprint-cup.jpg",
    blurb: {
      en: "A full team kit for the SWS Malaysia sprint championship. Sublimated panels, a restrained navy and red palette and a spec sheet the manufacturer could work straight from.",
      ms: "Kit pasukan lengkap untuk kejohanan sprint SWS Malaysia. Panel sublimasi, palet biru gelap dan merah yang terkawal serta helaian spesifikasi yang boleh terus digunakan pengilang.",
    },
    items: [
      { en: "Team jersey and jacket", ms: "Jersi dan jaket pasukan" },
      { en: "Cap, tee and official shirt", ms: "Topi, kemeja-T dan kemeja rasmi" },
      { en: "Brand and typography guide", ms: "Panduan jenama dan tipografi" },
    ],
  },
  {
    name: "Evas Racing Team",
    kind: { en: "Motorsport Merchandise", ms: "Barangan Sukan Motor" },
    image: "/merchandise/evas-racing-team.jpg",
    blurb: {
      en: "A louder, purple and green race identity for a private motorsport team, designed to be recognisable at speed and photographed well in the paddock.",
      ms: "Identiti perlumbaan ungu dan hijau yang lebih lantang untuk pasukan sukan motor persendirian, direka agar mudah dikenali dalam kelajuan dan menarik difoto di padok.",
    },
    items: [
      { en: "Race suit and team jersey", ms: "Sut perlumbaan dan jersi pasukan" },
      { en: "Sublimation artwork", ms: "Karya seni sublimasi" },
      { en: "Front, back and sleeve placements", ms: "Penempatan depan, belakang dan lengan" },
    ],
  },
  {
    name: "Legion Tactical",
    kind: { en: "Tactical Apparel", ms: "Pakaian Taktikal" },
    image: "/merchandise/legion-tactical.jpg",
    blurb: {
      en: "Field apparel for a tactical and outdoor brand. A red and black camouflage worked up from scratch, then applied across a range that has to look right on a range day and in a photograph.",
      ms: "Pakaian lapangan untuk jenama taktikal dan luaran. Corak samaran merah dan hitam dibina dari awal, kemudian digunakan merentas rangkaian yang perlu kelihatan baik di lapangan dan dalam foto.",
    },
    items: [
      { en: "Custom camouflage pattern", ms: "Corak samaran tersuai" },
      { en: "Field shirt and tee", ms: "Kemeja lapangan dan kemeja-T" },
      { en: "Badging and patch system", ms: "Sistem lencana dan tampalan" },
    ],
  },
  {
    name: "Resto Sports Hub",
    kind: { en: "Venue Branding", ms: "Penjenamaan Premis" },
    image: "/merchandise/resto-sports-hub.jpg",
    blurb: {
      en: "One venue, five sports. A colour-coded apparel system that keeps football, tennis, pickleball, rugby and netball visibly part of the same house.",
      ms: "Satu premis, lima sukan. Sistem pakaian berkod warna yang mengekalkan bola sepak, tenis, pickleball, ragbi dan bola jaring sebagai sebahagian daripada satu rumah yang sama.",
    },
    items: [
      { en: "Per-sport kit colourways", ms: "Warna kit mengikut sukan" },
      { en: "Jersey, skort and shorts", ms: "Jersi, skort dan seluar pendek" },
      { en: "Visor and accessories", ms: "Visor dan aksesori" },
    ],
  },
  {
    name: "House of Pickle",
    kind: { en: "Brand Packaging", ms: "Pembungkusan Jenama" },
    image: "/merchandise/house-of-pickle.jpg",
    blurb: {
      en: "Kit and court-side branding for a pickleball club, built around a botanical print that reads as clearly on a shirt as it does on a banner.",
      ms: "Kit dan penjenamaan tepi gelanggang untuk kelab pickleball, dibina sekitar cetakan botani yang jelas pada kemeja mahupun pada sepanduk.",
    },
    items: [
      { en: "Signature print and palette", ms: "Cetakan dan palet tandatangan" },
      { en: "Club jersey and skort", ms: "Jersi dan skort kelab" },
      { en: "Front and back artwork", ms: "Karya seni depan dan belakang" },
    ],
  },
];

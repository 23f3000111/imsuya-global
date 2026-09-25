/**
 * Brands the studio has designed, built or produced for, shown in the logo
 * band. Files live in /public/clients, trimmed to their ink and capped in size.
 *
 * Roadtainers and PX98 had white lettering drawn for a dark ground, which
 * vanished on the white page; that lettering is repainted in the brand blue.
 * RC Tank Biathlon is left as supplied — its white type sits on its own black
 * silhouette and reads as intended.
 *
 * Legendary is an SVG. The supplied file was a 352x52 strip that went soft on
 * a sharp screen, and no vector original exists — Legendary's own site ships a
 * 1400px raster — so that larger file was traced into clean curves. It stays
 * sharp at any size.
 *
 * `w` and `h` are the artwork's size, used for the aspect ratio only.
 */
export type Client = { slug: string; name: string; w: number; h: number; ext?: "png" | "svg" };

export const clients: Client[] = [
  { slug: "roadtainers", name: "Roadtainers Mombasa", w: 720, h: 218 },
  { slug: "legendary", name: "Legendary", w: 1400, h: 206, ext: "svg" },
  { slug: "px98", name: "PX98", w: 325, h: 260 },
  { slug: "rotax", name: "Rotax RMC International Trophy Asia", w: 618, h: 260 },
  { slug: "twinkle-kidz", name: "Twinkle Kidz", w: 632, h: 260 },
  { slug: "sws", name: "SWS Sodi World Series", w: 720, h: 129 },
  { slug: "swisseye", name: "Swisseye", w: 720, h: 109 },
  { slug: "sodi", name: "Sodi Kart Racing", w: 720, h: 144 },
  { slug: "rc-tank-biathlon", name: "RC Tank Biathlon Malaysia", w: 465, h: 260 },
  { slug: "rc-tank-legion", name: "RC Tank Legion Shop", w: 260, h: 260 },
];

/**
 * Display size by optical area rather than by height. At one shared height a
 * 7:1 wordmark reads as a thin sliver beside a square badge; giving every
 * logo roughly the same area of ink makes the row look evenly weighted.
 */
export function logoBox(c: Client, area = 6400): { width: number; height: number } {
  const ratio = c.w / c.h;
  let height = Math.min(72, Math.max(30, Math.sqrt(area / ratio)));
  let width = height * ratio;
  if (width > 200) {
    width = 200;
    height = width / ratio;
  }
  return { width: Math.round(width), height: Math.round(height) };
}

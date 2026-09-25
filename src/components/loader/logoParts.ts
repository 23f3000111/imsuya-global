/**
 * The Imsuya Global logo, taken apart for the loader. Generated from
 * /public/brand/logo.png: every part is a connected shape of the artwork,
 * placed as a percentage of the whole logo so the loader can put it back
 * together at any size. Masks are filled with the brand colours at runtime.
 *
 *   bracket  the navy "[" of the mark
 *   g        the orange G, with its white knockout squares
 *   pixel    the seven detached squares of the pixel dissolve (no file —
 *            they are true squares, drawn as plain boxes)
 *   letter   IMSUYA in navy, GLOBAL in orange, one part per letter
 *   rule     the two orange rules either side of GLOBAL
 */
export type LogoPart = {
  id: string;
  kind: "bracket" | "g" | "pixel" | "letter" | "rule";
  color: "navy" | "coral";
  src?: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

/** Width over height of the whole logo. */
export const LOGO_ASPECT = 5.16167;

export const LOGO_PARTS: LogoPart[] = [
  { id: "bracket", kind: "bracket", color: "navy", src: "/brand/loader/bracket.png", x: -0.0338, y: -0.1742, w: 5.7918, h: 87.2822 },
  { id: "g", kind: "g", color: "coral", src: "/brand/loader/g.png", x: 5.6501, y: 0.2091, w: 16.9502, h: 86.7944 },
  { id: "px0", kind: "pixel", color: "coral", x: 18.9348, y: 0.3833, w: 1.6336, h: 8.4321 },
  { id: "px1", kind: "pixel", color: "coral", x: 20.1296, y: 10.9059, w: 2.1399, h: 11.0453 },
  { id: "px2", kind: "pixel", color: "coral", x: 22.7285, y: 19.6864, w: 1.4041, h: 7.2474 },
  { id: "px3", kind: "pixel", color: "coral", x: 18.3273, y: 27.7003, w: 0.9181, h: 4.7387 },
  { id: "px4", kind: "pixel", color: "coral", x: 21.4662, y: 30.0697, w: 1.5998, h: 8.223 },
  { id: "px5", kind: "pixel", color: "coral", x: 22.7285, y: 53.5192, w: 1.8699, h: 9.6167 },
  { id: "px6", kind: "pixel", color: "coral", x: 21.4999, y: 69.0592, w: 1.8091, h: 9.3031 },
  { id: "im0", kind: "letter", color: "navy", src: "/brand/loader/im0.png", x: 29.1076, y: 13.3449, w: 3.1794, h: 54.5296 },
  { id: "im1", kind: "letter", color: "navy", src: "/brand/loader/im1.png", x: 34.2986, y: 13.3101, w: 14.2095, h: 54.5645 },
  { id: "im2", kind: "letter", color: "navy", src: "/brand/loader/im2.png", x: 50.1688, y: 13.3101, w: 11.7591, h: 54.5645 },
  { id: "im3", kind: "letter", color: "navy", src: "/brand/loader/im3.png", x: 63.3252, y: 13.2753, w: 11.5701, h: 54.6341 },
  { id: "im4", kind: "letter", color: "navy", src: "/brand/loader/im4.png", x: 76.0902, y: 13.3101, w: 12.8932, h: 54.5645 },
  { id: "im5", kind: "letter", color: "navy", src: "/brand/loader/im5.png", x: 86.128, y: 13.3449, w: 13.818, h: 54.5645 },
  { id: "ruleL", kind: "rule", color: "coral", src: "/brand/loader/ruleL.png", x: 29.1279, y: 87.2474, w: 8.5865, h: 2.6829 },
  { id: "gl0", kind: "letter", color: "coral", src: "/brand/loader/gl0.png", x: 40.995, y: 76.5854, w: 5.7581, h: 23.554 },
  { id: "gl1", kind: "letter", color: "coral", src: "/brand/loader/gl1.png", x: 49.5612, y: 76.4808, w: 4.5565, h: 23.5889 },
  { id: "gl2", kind: "letter", color: "coral", src: "/brand/loader/gl2.png", x: 56.9259, y: 76.5505, w: 6.0146, h: 23.6237 },
  { id: "gl3", kind: "letter", color: "coral", src: "/brand/loader/gl3.png", x: 65.9376, y: 76.6551, w: 5.6771, h: 23.2404 },
  { id: "gl4", kind: "letter", color: "coral", src: "/brand/loader/gl4.png", x: 74.3823, y: 76.6551, w: 6.4264, h: 23.2404 },
  { id: "gl5", kind: "letter", color: "coral", src: "/brand/loader/gl5.png", x: 83.7586, y: 76.4808, w: 4.5633, h: 23.5889 },
  { id: "ruleR", kind: "rule", color: "coral", src: "/brand/loader/ruleR.png", x: 91.3933, y: 87.2822, w: 8.6405, h: 2.6481 },
];

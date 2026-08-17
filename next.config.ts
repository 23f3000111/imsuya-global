import type { NextConfig } from "next";

/**
 * Security response headers. The audit found none of these set.
 *
 * There is deliberately no Content-Security-Policy here: the app inlines
 * styles through Tailwind and framer-motion and embeds a Google Maps iframe,
 * so a CSP has to be authored and tested against a real deployment rather
 * than guessed at. Shipping a broken one would take the map and the contact
 * flow down with it. The headers below are the ones that are safe to set
 * blind, and they cover clickjacking, MIME sniffing, referrer leakage and
 * unrequested device access.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Belt and braces with frame-ancestors for browsers that predate CSP3.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    // Nothing on the site asks for any of these.
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  // One canonical shape per URL: no trailing slash, so /services and
  // /services/ cannot both be indexed.
  trailingSlash: false,
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async redirects() {
    return [
      // The light-ground Victoriashire concept was withdrawn. Send its URL to
      // the surviving case study rather than leaving a 404 behind.
      {
        source: "/portfolio/victoriashire-one",
        destination: "/portfolio/victoriashire-three",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

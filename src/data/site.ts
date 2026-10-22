// Central place for contact details. Everything that shows or sends to the
// studio's inbox reads `site.email`, so this is the one line to change.
export const site = {
  name: "Imsuya Global",
  tagline: "Building Your Digital Future",
  email: "info@imsuyaglobal.com",
  whatsapp: "60122357927", // +60 12 235 7927
  whatsappDisplay: "+60 12 235 7927",
  url: "https://imsuyaglobal.com",
};

// The registered office. Kept exactly as issued, including the unit number
// punctuation, so post and map lookups both resolve.
export const office = {
  lines: [
    "Suite 12 19-2, Jalan PJU 8/3B",
    "Perdana Business Centre, Damansara Perdana",
    "47820 Petaling Jaya, Selangor",
  ],
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.4690676959694!2d101.6071013!3d3.1643698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4ff5eba8f8a3%3A0x2c92331753e288e!2sImsuya%20Global%20Sdn%20Bhd!5e1!3m2!1sen!2smy!4v1786636945793!5m2!1sen!2smy",
  directions: "https://maps.app.goo.gl/",
};

export const socials = [
  { name: "Facebook", href: "https://www.facebook.com/imsuyaglobal" },
  { name: "Instagram", href: "https://www.instagram.com/imsuyaglobal/" },
  { name: "TikTok", href: "https://www.tiktok.com/@imsuyaglobal" },
];

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

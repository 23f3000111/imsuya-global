// Central place for contact details. Replace the placeholders before launch.
export const site = {
  name: "Imsuya Global",
  tagline: "Full-Service Digital & AI Agency",
  email: "hello@imsuyaglobal.com", // TODO: replace with the real inbox
  whatsapp: "60123456789", // TODO: replace with the real number (country code, digits only)
  url: "https://imsuyaglobal.com",
};

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

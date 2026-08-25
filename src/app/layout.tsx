import type { Metadata } from "next";
import { JetBrains_Mono, Rubik } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ScrollReset } from "@/components/providers/ScrollReset";
import { CustomCursor } from "@/components/CustomCursor";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, graph, organizationSchema, websiteSchema } from "@/lib/seo";

/*
 * Rubik is Imsuya Global's official typeface, so it carries everything on the
 * site that is not a technical label. The variable cut covers 300–900, which
 * the display slabs need at the top end and the body copy at the bottom;
 * asking for a weight list here would ship several static files instead.
 * It replaces Satoshi, which was a stand-in.
 */
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const TITLE =
  "Imsuya Global · Creative Digital Design and Smart Website Development Boutique Studio";
const DESCRIPTION =
  "Imsuya Global is a boutique digital studio in Petaling Jaya, Malaysia. Smart websites, custom web applications and software systems, custom AI services and softwares, and digital design from brand identity to merchandise, for businesses in Malaysia and worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Every page sets its own canonical; this is the fallback for anything that
  // does not, so no URL can ship without one.
  alternates: { canonical: "/" },
  title: { default: TITLE, template: "%s · Imsuya Global" },
  description: DESCRIPTION,
  applicationName: "Imsuya Global",
  authors: [{ name: "Imsuya Global", url: SITE_URL }],
  creator: "Imsuya Global",
  publisher: "Imsuya Global",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    siteName: "Imsuya Global",
    locale: "en_MY",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/brand/og-default.png",
        width: 1200,
        height: 630,
        alt: "Imsuya Global — building your digital future",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      { url: "/brand/og-default.png", alt: "Imsuya Global — building your digital future" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-MY" className={`${rubik.variable} ${jetbrains.variable} antialiased`}>
      <body className="bg-void text-paper">
        {/* The studio as an entity, declared once for every page. */}
        <JsonLd json={graph([organizationSchema(), websiteSchema()])} />
        <LanguageProvider>
          <SmoothScroll>
            <ScrollReset />
            <Preloader />
            <CustomCursor />
            <Nav />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}

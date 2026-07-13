import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Imsuya Global — Full-Service Digital & AI Agency",
  description:
    "We build digital futures. Websites, custom software, AI systems, branding and growth engines for ambitious businesses.",
  metadataBase: new URL("https://imsuyaglobal.com"),
  openGraph: {
    title: "Imsuya Global — Full-Service Digital & AI Agency",
    description:
      "We build digital futures. Websites, custom software, AI systems, branding and growth engines for ambitious businesses.",
    images: ["/brand/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} ${jetbrains.variable} antialiased`}>
      <body className="grain bg-void text-paper">
        <LanguageProvider>
          <SmoothScroll>
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

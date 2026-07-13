"use client";

import Link from "next/link";
import { ConversationalForm } from "@/components/contact/ConversationalForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useLang } from "@/i18n";

const COPY = {
  en: {
    eyebrow: "Say hello — 007",
    heading: "No forms.",
    headingSoft: "Just a conversation.",
    before: "Four quick questions, then it lands directly on our phone — ",
    link: "or visit the contact page",
  },
  ms: {
    eyebrow: "Tegur kami — 007",
    heading: "Tiada borang.",
    headingSoft: "Hanya perbualan.",
    before: "Empat soalan ringkas, terus sampai ke telefon kami — ",
    link: "atau lawati halaman hubungi",
  },
};

export function ContactSection() {
  const { lang } = useLang();
  const copy = COPY[lang];

  return (
    <section className="relative border-t border-paper/[0.06] bg-void py-32 lg:py-44">
      <div className="relative z-10 mx-auto grid max-w-[1600px] gap-16 px-6 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-4">
          <Eyebrow variant="c" className="mb-4">
            {copy.eyebrow}
          </Eyebrow>
          <h2 className="text-display text-4xl uppercase lg:text-5xl">
            {copy.heading} <span className="text-soft">{copy.headingSoft}</span>
          </h2>
          <p className="mt-6 max-w-xs text-muted">
            {copy.before}
            <Link href="/contact" className="text-coral underline-offset-4 hover:underline">
              {copy.link}
            </Link>
            .
          </p>
        </div>
        <div className="lg:col-span-8">
          <ConversationalForm />
        </div>
      </div>
    </section>
  );
}

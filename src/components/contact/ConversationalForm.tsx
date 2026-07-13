"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "@/data/services";
import { site, whatsappLink } from "@/data/site";
import { useLang, useT } from "@/i18n";

type Answers = {
  name: string;
  company: string;
  service: string;
  details: string;
};

const COPY = {
  en: {
    steps: [
      { key: "name", question: "What's your name?", placeholder: "Jane Tan", type: "text" },
      { key: "company", question: "What's your company?", placeholder: "Acme Sdn Bhd", type: "text" },
      { key: "service", question: "What are you interested in?", type: "chips" },
      {
        key: "details",
        question: "Tell us about your project.",
        placeholder: "Goals, timeline, anything that matters…",
        type: "textarea",
      },
    ],
    next: "Next",
    finish: "Finish",
    pressEnter: "press",
    back: "← back",
    lastStep: "One last step",
    thanks: (name: string) => `Thanks, ${name}. Send it our way.`,
    ready:
      "Your brief is ready — deliver it on whichever channel you prefer. We reply within one business day.",
    whatsapp: "Send via WhatsApp",
    email: "Send via Email",
    restart: "← start over",
    waIntro: "Hi Imsuya Global!",
    waName: "Name",
    waCompany: "Company",
    waInterest: "Interested in",
    waProject: "Project",
    mailSubject: (who: string) => `Project enquiry — ${who}`,
  },
  ms: {
    steps: [
      { key: "name", question: "Siapa nama anda?", placeholder: "Jane Tan", type: "text" },
      { key: "company", question: "Apakah syarikat anda?", placeholder: "Acme Sdn Bhd", type: "text" },
      { key: "service", question: "Apa yang anda minati?", type: "chips" },
      {
        key: "details",
        question: "Ceritakan tentang projek anda.",
        placeholder: "Matlamat, garis masa, apa sahaja yang penting…",
        type: "textarea",
      },
    ],
    next: "Seterusnya",
    finish: "Selesai",
    pressEnter: "tekan",
    back: "← kembali",
    lastStep: "Satu langkah terakhir",
    thanks: (name: string) => `Terima kasih, ${name}. Hantarkan kepada kami.`,
    ready:
      "Brief anda sedia — hantar melalui saluran pilihan anda. Kami balas dalam satu hari bekerja.",
    whatsapp: "Hantar melalui WhatsApp",
    email: "Hantar melalui E-mel",
    restart: "← mula semula",
    waIntro: "Hai Imsuya Global!",
    waName: "Nama",
    waCompany: "Syarikat",
    waInterest: "Berminat dengan",
    waProject: "Projek",
    mailSubject: (who: string) => `Pertanyaan projek — ${who}`,
  },
} as const;

const slide = {
  initial: { opacity: 0, y: 46 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -46 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
};

export function ConversationalForm() {
  const { lang } = useLang();
  const t = useT();
  const copy = COPY[lang];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ name: "", company: "", service: "", details: "" });
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const mounted = useRef(false);

  // Focus follows the conversation — but never steal scroll on page load.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    inputRef.current?.focus();
  }, [step]);

  const current = copy.steps[step];
  const value = answers[current?.key as keyof Answers] ?? "";
  const canAdvance = value.trim().length > 0;

  const next = () => {
    if (!canAdvance) return;
    if (step < copy.steps.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
      // Fire-and-forget notification; WhatsApp/email buttons are the primary path.
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      }).catch(() => {});
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    next();
  };

  const summary = `${copy.waIntro}\n\n${copy.waName}: ${answers.name}\n${copy.waCompany}: ${answers.company}\n${copy.waInterest}: ${answers.service}\n\n${copy.waProject}: ${answers.details}`;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    copy.mailSubject(answers.company || answers.name)
  )}&body=${encodeURIComponent(summary)}`;

  return (
    <div className="relative min-h-[480px] w-full max-w-3xl">
      {/* progress */}
      <div className="mb-14 flex items-center gap-4">
        <span className="font-mono text-xs text-coral">
          {String(Math.min(step + 1, copy.steps.length)).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 bg-paper/10">
          <div
            className="h-full bg-coral transition-all duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${(done ? copy.steps.length : step) * (100 / copy.steps.length)}%` }}
          />
        </div>
        <span className="font-mono text-xs text-soft">
          {String(copy.steps.length).padStart(2, "0")}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.form key={`${lang}-${step}`} onSubmit={onSubmit} {...slide}>
            <label className="text-display block text-3xl uppercase lg:text-5xl" htmlFor="cf-input">
              {current.question}
            </label>

            {current.type === "chips" ? (
              <div className="mt-10 flex flex-wrap gap-3">
                {services.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => {
                      setAnswers({ ...answers, service: t(s.short) });
                      setTimeout(() => setStep(step + 1), 280);
                    }}
                    className={`border px-5 py-3 font-mono text-sm transition-all duration-300 ${
                      answers.service === t(s.short)
                        ? "border-coral bg-coral text-black"
                        : "border-paper/20 text-paper/70 hover:border-coral hover:text-coral"
                    }`}
                  >
                    {t(s.short)}
                  </button>
                ))}
              </div>
            ) : current.type === "textarea" ? (
              <textarea
                id="cf-input"
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={value}
                onChange={(e) => setAnswers({ ...answers, [current.key]: e.target.value })}
                placeholder={"placeholder" in current ? current.placeholder : ""}
                rows={4}
                className="mt-10 w-full resize-none border-b-2 border-paper/20 bg-transparent pb-4 text-xl text-paper outline-none transition-colors duration-300 placeholder:text-soft/60 focus:border-coral lg:text-2xl"
              />
            ) : (
              <input
                id="cf-input"
                ref={inputRef as React.RefObject<HTMLInputElement>}
                value={value}
                onChange={(e) => setAnswers({ ...answers, [current.key]: e.target.value })}
                placeholder={"placeholder" in current ? current.placeholder : ""}
                className="mt-10 w-full border-b-2 border-paper/20 bg-transparent pb-4 text-2xl text-paper outline-none transition-colors duration-300 placeholder:text-soft/60 focus:border-coral lg:text-4xl"
              />
            )}

            {current.type !== "chips" && (
              <div className="mt-10 flex items-center gap-6">
                <button
                  type="submit"
                  disabled={!canAdvance}
                  className="bg-coral px-8 py-4 text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 hover:bg-paper hover:text-void disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {step === copy.steps.length - 1 ? copy.finish : copy.next}
                </button>
                <span className="font-mono text-xs text-soft">
                  {copy.pressEnter} <span className="text-muted">Enter ↵</span>
                </span>
              </div>
            )}

            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="mt-8 font-mono text-xs text-soft transition-colors hover:text-coral"
              >
                {copy.back}
              </button>
            )}
          </motion.form>
        ) : (
          <motion.div key="done" {...slide}>
            <p className="text-eyebrow mb-6 text-coral">{copy.lastStep}</p>
            <h3 className="text-display text-3xl uppercase lg:text-5xl">
              {copy.thanks(answers.name.split(" ")[0])}
            </h3>
            <p className="mt-6 max-w-md text-muted">{copy.ready}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={whatsappLink(summary)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-coral px-8 py-4 text-sm font-bold uppercase tracking-wide text-black transition-colors duration-300 hover:bg-paper hover:text-void"
              >
                {copy.whatsapp}
              </a>
              <a
                href={mailto}
                className="border border-paper/25 px-8 py-4 text-sm font-bold uppercase tracking-wide text-paper transition-colors duration-300 hover:border-coral hover:text-coral"
              >
                {copy.email}
              </a>
            </div>
            <button
              onClick={() => {
                setDone(false);
                setStep(0);
                setAnswers({ name: "", company: "", service: "", details: "" });
              }}
              className="mt-10 font-mono text-xs text-soft transition-colors hover:text-coral"
            >
              {copy.restart}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site, whatsappLink } from "@/data/site";
import { useLang } from "@/i18n";
import type { Lang } from "@/i18n/types";
import { LIMITS, type ChatMessage, type Choice } from "@/lib/assistant/protocol";
import { setScrollLocked } from "@/components/providers/SmoothScroll";
import { ActionView, EmailButton, WhatsAppButton } from "./ActionView";
import { MessageText } from "./MessageText";
import { loadBrain, useAssistant } from "./useAssistant";

const COPY = {
  en: {
    launcher: "Ask Imsuya",
    open: "Open the Imsuya Global assistant",
    close: "Close",
    title: "Imsuya Assistant",
    status: "Instant answers · 24/7",
    newChat: "New chat",
    label: "Imsuya · Assistant",
    you: "You",
    welcomeTitle: "Hi — how can we help?",
    welcomeBody:
      "Ask about websites, web apps, AI systems or design. Tell me what you're building and I'll send it straight to the team.",
    suggestions: [
      { label: "What do you build?", value: "intent:services" },
      { label: "Show me your work", value: "intent:work" },
      { label: "How much does a website cost?", value: "intent:pricing" },
      { label: "I want to start a project", value: "intent:start" },
    ],
    direct: "Or reach the team directly",
    whatsapp: "WhatsApp",
    email: "Email",
    waDefault: "Hi Imsuya Global, I'd like to talk about a project.",
    placeholder: "Type your message…",
    inputLabel: "Message the assistant",
    send: "Send",
    hint: "Enter to send · Shift + Enter for a new line",
    fine: "Automated assistant — anything it can't answer, the team replies to on WhatsApp. Please don't share passwords or payment details.",
    thinking: "Writing a reply…",
    teaser: "Planning a website or an AI system? Ask me anything.",
    dismiss: "Dismiss",
  },
  ms: {
    launcher: "Tanya Imsuya",
    open: "Buka pembantu Imsuya Global",
    close: "Tutup",
    title: "Pembantu Imsuya",
    status: "Jawapan segera",
    newChat: "Sembang baharu",
    label: "Imsuya · Pembantu",
    you: "Anda",
    welcomeTitle: "Hai — apa yang boleh kami bantu?",
    welcomeBody:
      "Tanya tentang laman web, aplikasi web, sistem AI atau reka bentuk. Ceritakan apa yang anda bina dan saya akan hantar terus kepada pasukan.",
    suggestions: [
      { label: "Apa yang anda bina?", value: "intent:services" },
      { label: "Tunjukkan kerja anda", value: "intent:work" },
      { label: "Berapa kos sebuah laman web?", value: "intent:pricing" },
      { label: "Saya mahu mulakan projek", value: "intent:start" },
    ],
    direct: "Atau hubungi pasukan terus",
    whatsapp: "WhatsApp",
    email: "E-mel",
    waDefault: "Hai Imsuya Global, saya ingin berbincang tentang satu projek.",
    placeholder: "Taip mesej anda…",
    inputLabel: "Hantar mesej kepada pembantu",
    send: "Hantar",
    hint: "Enter untuk hantar · Shift + Enter untuk baris baharu",
    fine: "Pembantu automatik — soalan yang tidak dapat dijawabnya akan dibalas oleh pasukan di WhatsApp. Jangan kongsi kata laluan atau butiran pembayaran.",
    thinking: "Sedang menulis balasan…",
    teaser: "Merancang laman web atau sistem AI? Tanya saya apa sahaja.",
    dismiss: "Tutup",
  },
};

const TEASED_KEY = "imsuya-assistant-teased";

/** A speech bubble drawn in the brand's square pixels. The coral one blinks
 *  while a reply is being written, so a minimised chat still shows it. */
function ChatGlyph({ busy = false }: { busy?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6" shapeRendering="crispEdges">
      <path d="M2 3h19v13H11v2H9v2H6v-4H2z" className="fill-white" />
      <rect x="5" y="8" width="3" height="3" className="fill-paper" />
      <rect x="10" y="8" width="3" height="3" className="fill-paper" />
      <rect x="15" y="8" width="3" height="3" className={`fill-coral ${busy ? "assistant-blink" : ""}`} />
    </svg>
  );
}

function Typing({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 py-1">
      <span className="sr-only">{label}</span>
      {[0, 1, 2].map((i) => (
        <span key={i} aria-hidden className="assistant-dot block size-1.5 bg-paper/60" style={{ animationDelay: `${i * 0.16}s` }} />
      ))}
    </span>
  );
}

function SpeakerLabel({ text }: { text: string }) {
  return (
    <p aria-hidden className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-soft">
      <span className="block size-1.5 bg-coral" />
      {text}
    </p>
  );
}

/** Tap-to-answer buttons under the latest reply. Sending the brief is the one
 *  that matters, so it is the solid one. */
function Choices({ choices, onChoice }: { choices: Choice[]; onChoice: (choice: Choice) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-0.5">
      {choices.map((c, i) => (
        <button
          key={`${c.value}-${i}`}
          type="button"
          onClick={() => onChoice(c)}
          className={`border px-3 py-1.5 text-left text-[13px] leading-snug transition-colors duration-300 ${
            c.value === "flow:send"
              ? "border-coral bg-coral font-bold text-white hover:border-paper hover:bg-paper"
              : "border-coral/40 bg-coral/[0.05] text-paper hover:border-coral hover:bg-coral hover:text-white"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

function Bubble({
  message,
  lang,
  live,
  onChoice,
}: {
  message: ChatMessage;
  lang: Lang;
  /** The latest message while nothing is pending: its choices can be tapped. */
  live: boolean;
  onChoice: (choice: Choice) => void;
}) {
  const copy = COPY[lang];
  if (message.role === "user") {
    return (
      <li className="flex justify-end">
        <p className="max-w-[86%] whitespace-pre-wrap break-words bg-paper px-3.5 py-2.5 text-[14px] leading-relaxed text-white">
          <span className="sr-only">{copy.you}: </span>
          {message.text}
        </p>
      </li>
    );
  }

  return (
    <li className="max-w-[94%] space-y-2.5">
      <SpeakerLabel text={copy.label} />
      {message.parts.map((p, i) =>
        p.type === "text" ? (
          <div key={i} className="break-words text-[14px] leading-relaxed text-paper/90">
            <MessageText text={p.text} />
          </div>
        ) : (
          // Cards keep the language the reply was written in.
          <ActionView key={i} action={p.action} lang={message.lang} />
        )
      )}
      {live && message.choices?.length ? <Choices choices={message.choices} onChoice={onChoice} /> : null}
    </li>
  );
}

/**
 * The website assistant: a launcher in the corner and a chat panel — a
 * floating window on desktop, a full-screen sheet on phones. The conversation
 * survives page changes (the widget lives in the root layout) and reloads
 * (sessionStorage). Replies come from a rules engine that runs in the browser
 * on the site's own content, with no API behind it; a confirmed brief is the
 * only thing that is sent anywhere, by email through /api/contact.
 */
export function Assistant() {
  const { lang } = useLang();
  const copy = COPY[lang];
  const pathname = usePathname() || "/";
  const reduce = useReducedMotion();
  const { messages, busy, send, reset } = useAssistant();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [teaser, setTeaser] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const returnFocus = useRef(false);

  const close = useCallback(() => {
    returnFocus.current = true;
    setOpen(false);
  }, []);

  // Focus goes back to the launcher once it is on screen again — on a phone it
  // is hidden while the sheet is open.
  useEffect(() => {
    if (open || !returnFocus.current) return;
    returnFocus.current = false;
    launcherRef.current?.focus();
  }, [open]);

  // Fetch the engine as the panel opens, so the first answer doesn't wait on it.
  useEffect(() => {
    if (open) void loadBrain().catch(() => {});
  }, [open]);

  // One gentle nudge per session on desktop, if the visitor hasn't opened it.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    try {
      if (sessionStorage.getItem(TEASED_KEY)) return;
    } catch {
      return;
    }
    const show = window.setTimeout(() => {
      setTeaser(true);
      try {
        sessionStorage.setItem(TEASED_KEY, "1");
      } catch {}
    }, 9000);
    const hide = window.setTimeout(() => setTeaser(false), 21000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  // On a phone the sheet covers the page; hold the page still beneath it.
  useEffect(() => {
    if (!open || window.matchMedia("(min-width: 1024px)").matches) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setScrollLocked(true);
    return () => {
      document.documentElement.style.overflow = previous;
      setScrollLocked(false);
    };
  }, [open]);

  // Escape closes. Opening focuses the composer on desktop; on a phone that
  // would raise the keyboard over the welcome screen, so the sheet itself
  // takes focus there.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      if (window.matchMedia("(min-width: 1024px)").matches) inputRef.current?.focus();
      else panelRef.current?.focus();
    }, 60);
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Follow the conversation down unless the visitor has scrolled up to read.
  useEffect(() => {
    const el = listRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  const onScroll = () => {
    const el = listRef.current;
    if (el) stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  // On a phone the sheet would hide the page a card or chip just opened, so
  // following one of the site's own links puts the chat away. The desktop
  // window stays open beside the new page.
  const onLogClick = (e: MouseEvent<HTMLDivElement>) => {
    const link = (e.target as HTMLElement).closest("a");
    if (link?.getAttribute("href")?.startsWith("/") && !window.matchMedia("(min-width: 1024px)").matches) {
      setOpen(false);
    }
  };

  // The composer grows with its text, up to a few lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [draft, open]);

  const submit = (text: string, choice?: string) => {
    if (!text.trim() || busy) return;
    stick.current = true;
    if (!choice) setDraft("");
    void send(text, choice, pathname, lang);
  };

  /** A tapped suggestion or choice; on desktop the composer stays ready to type. */
  const pick = (c: Choice) => {
    submit(c.label, c.value);
    if (window.matchMedia("(min-width: 1024px)").matches) inputRef.current?.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(draft);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit(draft);
    }
  };

  const remaining = LIMITS.userChars - draft.length;

  return (
    <>
      <AnimatePresence>
        {teaser && !open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[104px] right-8 z-[140] hidden w-[264px] lg:block"
          >
            <div className="card relative border border-paper/[0.08] bg-void p-4 pr-9">
              <button
                type="button"
                onClick={() => {
                  setTeaser(false);
                  setOpen(true);
                }}
                className="text-left text-sm leading-relaxed text-paper"
              >
                {copy.teaser}
              </button>
              <button
                type="button"
                onClick={() => setTeaser(false)}
                aria-label={copy.dismiss}
                className="absolute right-2 top-2 flex size-6 items-center justify-center text-soft transition-colors hover:text-coral"
              >
                ×
              </button>
              <span aria-hidden className="absolute -bottom-[7px] right-9 block size-3 rotate-45 border-b border-r border-paper/[0.08] bg-void" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        onClick={() => {
          setTeaser(false);
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-controls="imsuya-assistant"
        aria-label={open ? copy.close : copy.open}
        className={`fixed bottom-5 right-5 z-[140] h-14 items-center gap-3 bg-paper pl-2 pr-2 text-white shadow-[0_18px_44px_-14px_rgba(8,29,56,0.65)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#0d2a4f] lg:bottom-8 lg:right-8 lg:pr-5 ${
          open ? "hidden lg:flex" : "flex"
        }`}
      >
        <span className="flex size-10 items-center justify-center bg-white/[0.07]">
          {open ? <span className="text-xl leading-none text-white">×</span> : <ChatGlyph busy={busy} />}
        </span>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] lg:block">
          {open ? copy.close : copy.launcher}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="imsuya-assistant"
            role="dialog"
            aria-labelledby="imsuya-assistant-title"
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "bottom right" }}
            // The page's smooth scroller leaves wheel and touch inside the
            // panel alone, so the conversation and the composer scroll natively.
            data-lenis-prevent
            className="fixed inset-0 z-[145] flex h-[100dvh] flex-col bg-void outline-none lg:inset-auto lg:bottom-[104px] lg:right-8 lg:h-[min(660px,calc(100svh-140px))] lg:w-[408px] lg:border lg:border-paper/[0.1] lg:shadow-[0_40px_110px_-30px_rgba(8,29,56,0.5)]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 bg-paper px-4 py-3 text-white pt-[max(0.75rem,env(safe-area-inset-top))]">
              <span className="flex size-9 shrink-0 items-center justify-center bg-white">
                <Image src="/brand/icon.png" alt="" width={28} height={28} className="h-auto w-7" />
              </span>
              <div className="min-w-0">
                <p id="imsuya-assistant-title" className="truncate text-[15px] font-bold tracking-tight">
                  {copy.title}
                </p>
                <p className="flex min-w-0 items-center gap-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-white/60 lg:tracking-[0.2em]">
                  <span aria-hidden className={`block size-1.5 shrink-0 bg-coral ${busy ? "assistant-blink" : ""}`} />
                  <span className="truncate">{copy.status}</span>
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="whitespace-nowrap px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/70 transition-colors hover:text-coral lg:px-2.5 lg:tracking-[0.16em]"
                  >
                    {copy.newChat}
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label={copy.close}
                  className="flex size-9 items-center justify-center text-2xl leading-none text-white/80 transition-colors hover:text-coral"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Conversation */}
            <div
              ref={listRef}
              onScroll={onScroll}
              onClick={onLogClick}
              role="log"
              aria-live="polite"
              aria-busy={busy}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 [scrollbar-width:thin]"
            >
              {messages.length === 0 ? (
                <div>
                  <p className="text-display text-[1.7rem] uppercase leading-[0.95] text-paper">{copy.welcomeTitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{copy.welcomeBody}</p>
                  <ul className="mt-4 grid gap-1.5">
                    {copy.suggestions.map((s) => (
                      <li key={s.value}>
                        <button
                          type="button"
                          onClick={() => pick(s)}
                          className="group flex w-full items-center justify-between gap-3 border border-paper/[0.1] bg-void px-3.5 py-2 text-left text-sm text-paper transition-colors duration-300 hover:border-coral hover:text-coral"
                        >
                          {s.label}
                          <span aria-hidden className="text-coral transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
                    <span aria-hidden className="block size-1.5 bg-coral" />
                    {copy.direct}
                  </p>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <WhatsAppButton href={whatsappLink(copy.waDefault)} label={copy.whatsapp} />
                    <EmailButton href={`mailto:${site.email}`} label={copy.email} />
                  </div>
                </div>
              ) : (
                <ul className="space-y-5">
                  {messages.map((m, i) => (
                    <Bubble
                      key={m.id}
                      message={m}
                      lang={lang}
                      live={!busy && i === messages.length - 1}
                      onChoice={pick}
                    />
                  ))}
                  {busy && (
                    <li className="space-y-1.5">
                      <SpeakerLabel text={copy.label} />
                      <Typing label={copy.thinking} />
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={onSubmit}
              className="shrink-0 border-t border-paper/[0.08] bg-void px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
            >
              <label htmlFor="imsuya-assistant-input" className="sr-only">
                {copy.inputLabel}
              </label>
              <div className="flex items-end gap-2">
                <textarea
                  id="imsuya-assistant-input"
                  ref={inputRef}
                  rows={1}
                  value={draft}
                  maxLength={LIMITS.userChars}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={copy.placeholder}
                  className="assistant-input max-h-32 min-h-11 flex-1 resize-none border border-paper/15 bg-void px-3 py-2.5 text-[15px] leading-snug text-paper outline-none transition-colors placeholder:text-soft focus:border-coral"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || busy}
                  aria-label={copy.send}
                  className="flex size-11 shrink-0 items-center justify-center bg-coral text-lg font-bold text-black transition-colors hover:bg-paper hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  ↑
                </button>
              </div>
              <p className="mt-2 flex items-start justify-between gap-3 font-mono text-[9px] leading-relaxed tracking-[0.06em] text-soft">
                <span>{copy.fine}</span>
                {remaining < 200 && <span className="shrink-0 tabular-nums text-coral">{remaining}</span>}
              </p>
              <p className="sr-only">{copy.hint}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

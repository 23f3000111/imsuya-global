"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site, whatsappLink } from "@/data/site";
import type { Lang } from "@/i18n/types";
import { LIMITS, type AssistantBrief, type ChatMessage } from "@/lib/assistant/protocol";
import type { BrainState } from "@/lib/assistant/brain";

type Brain = typeof import("@/lib/assistant/brain");

let brain: Promise<Brain> | null = null;

/**
 * The reply engine and the site content it answers from, fetched the first
 * time the chat opens rather than with every page.
 */
export const loadBrain = () => (brain ??= import("@/lib/assistant/brain"));

const STORAGE_KEY = "imsuya-assistant-v2";

type Chat = { messages: ChatMessage[]; state: BrainState };

const empty = (): Chat => ({ messages: [], state: { seen: [], misses: 0, sent: [] } });

/**
 * The saved chat, read synchronously as the first state. Safe to differ from
 * the server render: nothing about the closed widget depends on it, and the
 * panel only opens on a click, long after hydration.
 */
function restore(): Chat {
  if (typeof window === "undefined") return empty();
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
    return saved && Array.isArray(saved.messages) && saved.state ? (saved as Chat) : empty();
  } catch {
    return empty();
  }
}

const uid = () => Math.random().toString(36).slice(2, 10);
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** True when the brief reached the studio's inbox. */
async function postBrief(brief: AssistantBrief): Promise<boolean> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brief),
    });
    if (!res.ok) return false;
    const data: { delivered?: boolean } = await res.json();
    return Boolean(data.delivered);
  } catch {
    return false;
  }
}

const OFFLINE = {
  en: {
    text: "Sorry — the assistant didn't load. You can still reach the team directly:",
    message: "Hi Imsuya Global, I'd like to talk about a project.",
    subject: "Project enquiry",
  },
  ms: {
    text: "Maaf — pembantu tidak dapat dimuatkan. Anda masih boleh hubungi pasukan secara terus:",
    message: "Hai Imsuya Global, saya ingin berbincang tentang satu projek.",
    subject: "Pertanyaan projek",
  },
};

/** What to show when the engine itself couldn't be fetched — say, a page left open across a deploy. */
function offline(lang: Lang): ChatMessage {
  const c = OFFLINE[lang];
  return {
    id: uid(),
    role: "assistant",
    lang,
    parts: [
      { type: "text", text: c.text },
      {
        type: "action",
        action: {
          kind: "contact",
          whatsappHref: whatsappLink(c.message),
          mailtoHref: `mailto:${site.email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.message)}`,
        },
      },
    ],
  };
}

/**
 * The conversation: what is on screen, what the engine remembers about it,
 * and a copy of both in sessionStorage so a reload or a page change doesn't
 * lose the chat. Storage is best-effort — private windows can refuse it, and
 * the chat still works. Nothing goes over the network except a brief the
 * visitor has confirmed.
 */
export function useAssistant() {
  const [chat, setChat] = useState<Chat>(restore);
  const [busy, setBusy] = useState(false);
  /** Bumped by "New chat", so a reply still on its way to the old chat is dropped. */
  const generation = useRef(0);

  useEffect(() => {
    try {
      if (chat.messages.length) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: chat.messages.slice(-60), state: chat.state }));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [chat]);

  /** One visitor message — typed, or a tapped choice with its value. */
  const send = useCallback(
    async (text: string, choice: string | undefined, page: string, siteLang: Lang) => {
      const body = text.trim().slice(0, LIMITS.userChars);
      if (!body || busy) return;
      const gen = generation.current;
      const history: ChatMessage[] = [...chat.messages, { id: uid(), role: "user", text: body }];
      setChat({ messages: history, state: chat.state });
      setBusy(true);

      try {
        const engine = await loadBrain();
        const out = engine.respond(chat.state, { text: body, choice }, { siteLang, page, history });
        let messages = history;
        if (out.reply) {
          // A beat of typing dots: an instant wall of text reads as a form, not a chat.
          await pause(engine.typingDelay(out.reply));
          if (gen !== generation.current) return;
          messages = [...messages, out.reply];
        }
        setChat({ messages, state: out.state });

        if (out.brief) {
          const delivered = await postBrief(out.brief);
          if (gen !== generation.current) return;
          const result = engine.afterSend(out.state, out.brief, delivered);
          setChat({ messages: result.reply ? [...messages, result.reply] : messages, state: result.state });
        }
      } catch {
        brain = null; // try fetching it again next time
        if (gen !== generation.current) return;
        setChat((current) => ({ ...current, messages: [...current.messages, offline(siteLang)] }));
      } finally {
        if (gen === generation.current) setBusy(false);
      }
    },
    [busy, chat]
  );

  const reset = useCallback(() => {
    generation.current++;
    setBusy(false);
    setChat(empty());
  }, []);

  return { messages: chat.messages, busy, send, reset };
}

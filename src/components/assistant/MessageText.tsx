import Link from "next/link";
import type { ReactNode } from "react";

/*
 * Renders an assistant reply: paragraphs, "- " and "1. " lists, **bold**, and
 * links. Everything becomes React elements — model output is never handed to
 * the DOM as HTML — and only links the site would itself make are clickable:
 * pages on this site, the studio's WhatsApp and email, and its social
 * profiles. Anything else stays as text.
 */

const LINK_HOSTS = new Set([
  "imsuyaglobal.com",
  "www.imsuyaglobal.com",
  "wa.me",
  "api.whatsapp.com",
  "facebook.com",
  "www.facebook.com",
  "instagram.com",
  "www.instagram.com",
  "tiktok.com",
  "www.tiktok.com",
]);

const INLINE = /(\*\*[^*\n]+\*\*|\[[^\]\n]+\]\([^)\s]+\)|https?:\/\/[^\s<>()]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function safeHref(href: string): { href: string; internal: boolean } | null {
  if (href.startsWith("/") && !href.startsWith("//")) return { href, internal: true };
  if (href.startsWith("mailto:")) return { href, internal: false };
  try {
    const url = new URL(href);
    if (url.protocol === "https:" && LINK_HOSTS.has(url.hostname)) {
      if (url.hostname.endsWith("imsuyaglobal.com")) return { href: url.pathname + url.hash || "/", internal: true };
      return { href: url.toString(), internal: false };
    }
  } catch {}
  return null;
}

function A({ href, children }: { href: string; children: ReactNode }) {
  const safe = safeHref(href);
  if (!safe) return <>{children}</>;
  const cls = "font-medium text-coral underline decoration-coral/40 underline-offset-2 hover:decoration-coral";
  if (safe.internal) {
    return (
      <Link href={safe.href} className={cls}>
        {children}
      </Link>
    );
  }
  // An email link opens the mail app; a new tab would be left blank behind it.
  return safe.href.startsWith("mailto:") ? (
    <a href={safe.href} className={cls}>
      {children}
    </a>
  ) : (
    <a href={safe.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  );
}

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const token = m[0];
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const key = `${keyBase}-${i++}`;
    if (token.startsWith("**")) {
      out.push(
        <strong key={key} className="font-bold text-paper">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("[")) {
      const label = token.slice(1, token.indexOf("]("));
      const href = token.slice(token.indexOf("](") + 2, -1);
      out.push(
        <A key={key} href={href}>
          {label}
        </A>
      );
    } else if (token.startsWith("http")) {
      // Trailing punctuation belongs to the sentence, not the address.
      const trimmed = token.replace(/[.,;:!?]+$/, "");
      out.push(
        <A key={key} href={trimmed}>
          {trimmed}
        </A>
      );
      if (trimmed.length < token.length) out.push(token.slice(trimmed.length));
    } else {
      out.push(
        <A key={key} href={`mailto:${token}`}>
          {token}
        </A>
      );
    }
    last = at + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const BULLET = /^\s*[-•*]\s+/;
const NUMBER = /^\s*\d+[.)]\s+/;

type Run = { kind: "ul" | "ol" | "p"; lines: string[] };

/** Consecutive lines of the same kind, so "Here's what's included:" followed
 *  by bullets on the next lines renders as a sentence and then a list. */
function runs(text: string): Run[] {
  const out: Run[] = [];
  for (const block of text.replace(/\r/g, "").split(/\n{2,}/)) {
    let current: Run | null = null;
    for (const line of block.split("\n")) {
      if (!line.trim()) continue;
      const kind: Run["kind"] = BULLET.test(line) ? "ul" : NUMBER.test(line) ? "ol" : "p";
      if (!current || current.kind !== kind) {
        current = { kind, lines: [] };
        out.push(current);
      }
      current.lines.push(line);
    }
  }
  return out;
}

export function MessageText({ text }: { text: string }) {
  return (
    <>
      {runs(text).map((run, ri) => {
        if (run.kind === "ul") {
          return (
            <ul key={ri} className="my-1.5 space-y-1 first:mt-0 last:mb-0">
              {run.lines.map((l, li) => (
                <li key={li} className="flex gap-2.5">
                  <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 bg-coral" />
                  <span>{inline(l.replace(BULLET, ""), `${ri}-${li}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (run.kind === "ol") {
          return (
            <ol
              key={ri}
              className="my-1.5 list-decimal space-y-1 pl-5 first:mt-0 last:mb-0 marker:font-mono marker:text-xs marker:text-coral"
            >
              {run.lines.map((l, li) => (
                <li key={li}>{inline(l.replace(NUMBER, ""), `${ri}-${li}`)}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={ri} className="my-1.5 first:mt-0 last:mb-0">
            {run.lines.map((l, li) => (
              <span key={li}>
                {li > 0 && <br />}
                {inline(l, `${ri}-${li}`)}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

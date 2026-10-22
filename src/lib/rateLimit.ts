/*
 * Sliding-window limits, held in memory.
 *
 * On Vercel each running instance keeps its own counts, so these are a brake,
 * not an exact quota: they stop one visitor or one script from flooding the
 * studio's inbox. For hard global limits, put the same calls in front of a
 * shared store (Upstash Redis, Vercel KV) instead.
 */

const hits = new Map<string, number[]>();

/** Records a hit and says whether it is within `limit` per `windowMs`. */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5_000) {
    for (const [k, ts] of hits) {
      if (!ts.length || now - ts[ts.length - 1] > 24 * 60 * 60 * 1000) hits.delete(k);
    }
  }
  return true;
}

const HOUR = 60 * 60 * 1000;

/**
 * Briefs already delivered in the last two hours, by fingerprint, so a double
 * tap or a resend lands in the inbox once. Recorded only after a delivery
 * succeeds, so a failed send can be retried.
 */
const delivered = new Map<string, number>();

export function isDuplicateEnquiry(fingerprint: string): boolean {
  const now = Date.now();
  for (const [k, t] of delivered) if (now - t > 2 * HOUR) delivered.delete(k);
  return delivered.has(fingerprint);
}

export function rememberEnquiry(fingerprint: string): void {
  delivered.set(fingerprint, Date.now());
}

/**
 * One signal: "the loader curtain has started to lift". The hero waits on it
 * so its entrance plays into the reveal instead of guessing at a delay — the
 * old hard-coded 1s was right for the old loader and wrong for any other.
 *
 * The loader only runs on a full page load. On a client-side navigation it is
 * long gone, the signal has already fired, and anything that asks for it runs
 * straight away.
 */

let lifted = false;
const waiting = new Set<() => void>();

/** Called by the loader as its curtain starts to move, or at once if it skips. */
export function markPreloaderLifted() {
  if (lifted) return;
  lifted = true;
  waiting.forEach((run) => run());
  waiting.clear();
}

/**
 * Run `callback` when the curtain lifts, or now if it already has. If the
 * loader never reports — it failed to mount, or threw — the callback runs
 * after `failsafeMs` anyway, so the page can never be left waiting on it.
 * Returns an unsubscribe for effect cleanup.
 */
export function onPreloaderLift(callback: () => void, failsafeMs = 4500): () => void {
  if (lifted) {
    callback();
    return () => {};
  }

  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    waiting.delete(run);
    callback();
  };
  const timer = window.setTimeout(run, failsafeMs);
  waiting.add(run);

  return () => {
    done = true;
    window.clearTimeout(timer);
    waiting.delete(run);
  };
}

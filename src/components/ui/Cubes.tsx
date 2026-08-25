"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * The two cube pieces the client selected from freefrontend.com's css-cubes
 * collection. The geometry and the motion live in globals.css under
 * "css cubes". Both are marked `aria-hidden`: they are ornament, and a screen
 * reader should never have to walk a bag of empty divs.
 */

/** How many cubes a side. 5x5 — the field used to be 4x4. */
const N = 5;
/** Cubes that are orange at rest, as flat indices into the 5x5 run. */
const ACCENTS = new Set([3, 11, 19]);
/** How far from a cube the pointer still reaches, in cube widths. */
const REACH = 2.2;
/** How fast the click ripple travels outward, in px per millisecond. */
const RIPPLE_SPEED = 0.8;
/** How long one cube stays up as the ripple passes through it. */
const RIPPLE_MS = 560;

/**
 * "Cube Grid (Pure CSS)" — an isometric field rising in a diagonal wave, in
 * the /portfolio header.
 *
 * The client asked for it bigger and for it to respond, so on top of the
 * original's idle wave it now does two things:
 *
 *   - follows the pointer. The whole field tips a few degrees toward the
 *     cursor, and every cube lifts and warms toward brand orange in
 *     proportion to how close the cursor is to it.
 *   - fires on click. The wave restarts in sync from the top-left and a
 *     ripple runs outward from the point that was clicked, each cube popping
 *     as the front reaches it.
 *
 * All of it is written as custom properties on the existing elements — no
 * per-frame style recalculation beyond two numbers per cube — and the whole
 * behaviour is skipped under `prefers-reduced-motion`.
 */
export function CubeGrid({ className = "" }: { className?: string }) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Everything the animation loop owns. Kept in a ref so a pointer moving
  // across the field never triggers a React render.
  const anim = useRef({
    cubes: [] as HTMLElement[],
    centres: [] as { x: number; y: number }[],
    /** eased pointer proximity, 0..1 per cube */
    near: [] as number[],
    /** the moment each cube's click-ripple pop begins, in rAF time */
    popAt: [] as number[],
    pointer: null as { x: number; y: number } | null,
    frame: 0,
  });

  /** Cube centres are read from the rendered boxes, so the 3D rotation is
   *  already baked in. Re-read whenever the field could have moved. */
  const measure = useCallback(() => {
    const a = anim.current;
    a.centres = a.cubes.map((c) => {
      const r = c.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const a = anim.current;
    a.cubes = Array.from(grid.querySelectorAll<HTMLElement>(".cube"));
    a.near = a.cubes.map(() => 0);
    a.popAt = a.cubes.map(() => Infinity);
    measure();

    const cubePx = a.cubes[0]?.getBoundingClientRect().width || 48;
    const reach = cubePx * REACH;

    let measuredAt = 0;

    const tick = (now: number) => {
      let busy = false;

      // Re-read positions a few times a second while the pointer is in the
      // field, which covers scrolling mid-hover. Measuring every frame would
      // force a layout every frame, and measuring never would leave the hot
      // spot behind once the page moves.
      if (a.pointer && now - measuredAt > 220) {
        measure();
        measuredAt = now;
      }

      for (let i = 0; i < a.cubes.length; i++) {
        const c = a.centres[i];
        let target = 0;
        if (a.pointer && c) {
          const d = Math.hypot(a.pointer.x - c.x, a.pointer.y - c.y);
          target = Math.max(0, 1 - d / reach);
          target *= target; // falls off faster than linear — a tighter pool
        }
        // Ease toward the target rather than snapping, so a fast pointer
        // leaves a wake instead of a hard edge.
        a.near[i] += (target - a.near[i]) * 0.14;
        if (a.near[i] > 0.002 || target > 0) busy = true;
        else a.near[i] = 0;

        let pop = 0;
        const started = now - a.popAt[i];
        if (started >= 0 && started < RIPPLE_MS) {
          pop = Math.sin((started / RIPPLE_MS) * Math.PI);
          busy = true;
        } else if (started >= RIPPLE_MS) {
          a.popAt[i] = Infinity;
        } else if (a.popAt[i] !== Infinity) {
          busy = true; // queued, front has not arrived yet
        }

        const lift = Math.max(a.near[i] * 0.55, pop);
        const heat = Math.max(a.near[i] * 0.7, pop * 0.9);
        a.cubes[i].style.setProperty("--lift", lift.toFixed(3));
        a.cubes[i].style.setProperty("--heat", heat.toFixed(3));
      }

      a.frame = busy ? requestAnimationFrame(tick) : 0;
    };

    const wake = () => {
      if (!a.frame) a.frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      a.pointer = { x: e.clientX, y: e.clientY };
      const r = grid.getBoundingClientRect();
      // -1..1 across the field, turned into a few degrees of tip each way.
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      grid.style.setProperty("--tilt-x", `${(-dy * 7).toFixed(2)}deg`);
      grid.style.setProperty("--tilt-z", `${(dx * 9).toFixed(2)}deg`);
      wake();
    };

    const onLeave = () => {
      a.pointer = null;
      grid.style.setProperty("--tilt-x", "0deg");
      grid.style.setProperty("--tilt-z", "0deg");
      wake();
    };

    const onDown = (e: PointerEvent) => {
      measure();
      const now = performance.now();
      a.centres.forEach((c, i) => {
        const d = Math.hypot(e.clientX - c.x, e.clientY - c.y);
        a.popAt[i] = now + d / RIPPLE_SPEED;
      });
      // Restart every cube's idle wave from zero, so the diagonal run reads as
      // being launched by the click rather than carrying on mid-stride.
      a.cubes.forEach((c) => {
        c.style.animation = "none";
      });
      void grid.offsetWidth; // force the restart before the value goes back
      a.cubes.forEach((c) => {
        c.style.animation = "";
      });
      wake();
    };

    const onEnter = () => measure();

    // The field is the hit area; leaving it settles everything back down.
    grid.addEventListener("pointerenter", onEnter, { passive: true });
    grid.addEventListener("pointermove", onMove, { passive: true });
    grid.addEventListener("pointerleave", onLeave, { passive: true });
    grid.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      grid.removeEventListener("pointerenter", onEnter);
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
      grid.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", measure);
      if (a.frame) cancelAnimationFrame(a.frame);
      a.frame = 0;
    };
  }, [measure]);

  return (
    <div className={`grid place-items-center ${className}`}>
      <div ref={gridRef} aria-hidden data-cursor className="cube-grid cursor-pointer">
        {Array.from({ length: N * N }).map((_, k) => (
          <div
            key={k}
            className={`cube${ACCENTS.has(k) ? " is-accent" : ""}`}
            style={
              {
                "--i": String(k % N),
                "--j": String(Math.floor(k / N)),
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

/**
 * "CSS Only Cubes Hover Effects" — three offset columns of isometric cubes
 * that light orange under the pointer and cool back down slowly behind it.
 *
 * The nested loop mirrors the original pen: three groups, each of three
 * columns placed at x = -1, 0, 1, each holding three stacked faces whose
 * `--i` sets their stacking order so a lit cube reads in front of its
 * neighbours rather than behind them. No JavaScript — this one is hover only.
 */
export function CubeStack({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`grid place-items-center ${className}`}>
      <div className="cube-stack-frame">
        <div className="cube-stack">
          {[0, 1, 2].map((group) => (
            <div key={group} className="cube-col">
              {[-1, 0, 1].map((x) => (
                <div key={x} style={{ "--x": x, "--y": 0 } as React.CSSProperties}>
                  {[3, 2, 1].map((i) => (
                    <span
                      key={i}
                      className="cube-face"
                      style={{ "--i": i } as React.CSSProperties}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

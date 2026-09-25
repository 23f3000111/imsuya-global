"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

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
 * "Cube Grid (Pure CSS)" — an isometric field of solid cubes in the
 * /portfolio header.
 *
 * The original pen ran an idle diagonal wave. It is gone: that wave flattened
 * each cube to nothing for most of its cycle, so the field kept half
 * vanishing off the page. The cubes now sit solid and permanent, and every
 * bit of movement is something the visitor caused:
 *
 *   - hover. The whole field tips a few degrees toward the cursor, and every
 *     cube lifts and warms toward brand orange in proportion to how close the
 *     cursor is to it.
 *   - click. A ripple runs outward from the point that was clicked and each
 *     cube jumps as the front reaches it.
 *
 * All of it is written as custom properties on the existing elements — no
 * per-frame style recalculation beyond two numbers per cube — the loop parks
 * itself the moment nothing is moving, and the whole behaviour is skipped
 * under `prefers-reduced-motion`, where the cubes simply stay put.
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

/** Edge positions along one axis of the 3x3x3 block. */
const AXIS = [0, 1, 2] as const;

/**
 * The 19 cubes that make up the core and edges: every cell of the 3x3x3 block
 * except the eight corners. The original Sass looped i, j, k over 0..2 and
 * skipped a cell when all three were even (i % 2 + j % 2 + k % 2 === 0).
 */
const CORE = AXIS.flatMap((i) =>
  AXIS.flatMap((j) =>
    AXIS.filter((k) => (i % 2) + (j % 2) + (k % 2) > 0).map((k) => ({
      key: `${i}${j}${k}`,
      x: i - 1,
      y: j - 1,
      z: k - 1,
    }))
  )
);

/**
 * The eight corners. Each sits in a frame mirrored into its own octant —
 * scale3d(±1, ±1, ±1) — so one set of keyframes carries every corner
 * outward, whichever way it faces.
 */
const CORNERS = [0, 2].flatMap((i) =>
  [0, 2].flatMap((j) =>
    [0, 2].map((k) => ({
      key: `${i}${j}${k}`,
      sx: i === 0 ? 1 : -1,
      sy: j === 0 ? 1 : -1,
      sz: k === 0 ? 1 : -1,
    }))
  )
);

function Cube({ className = "" }: { className?: string }) {
  return (
    <div className={`ca-cube ${className}`}>
      {Array.from({ length: 6 }).map((_, f) => (
        <div key={f} className="ca-face" />
      ))}
    </div>
  );
}

/**
 * "Pure CSS 3D Cube Assembly Animation" — the third piece the client picked
 * from freefrontend's css-cubes, in the /team header. A 3x3x3 block: the
 * eight orange corner cubes break away along the edges and re-seat while the
 * white core turns half a revolution, on a loop. Every cube is on screen the
 * whole time; nothing flattens or fades out.
 *
 * On top of the original it answers the pointer — the block tips toward the
 * cursor — and a click bursts it: the corners fly further out, the core
 * spreads, and the whole thing springs back together. The geometry and the
 * loop live in globals.css under "cube assembly"; this component only writes
 * three custom properties (--tilt-x, --tilt-y, --burst).
 */
export function CubeAssembly({ className = "" }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let burst: gsap.core.Timeline | null = null;

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      stage.style.setProperty("--tilt-y", `${(dx * 22).toFixed(2)}deg`);
      stage.style.setProperty("--tilt-x", `${(-dy * 16).toFixed(2)}deg`);
    };

    const onLeave = () => {
      stage.style.setProperty("--tilt-x", "0deg");
      stage.style.setProperty("--tilt-y", "0deg");
    };

    const onDown = () => {
      burst?.kill();
      burst = gsap
        .timeline()
        .to(stage, { "--burst": 0.9, duration: 0.22, ease: "power3.out" })
        .to(stage, { "--burst": 0, duration: 1.1, ease: "elastic.out(1, 0.42)" });
    };

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave, { passive: true });
    stage.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerdown", onDown);
      burst?.kill();
    };
  }, []);

  return (
    <div className={`grid place-items-center ${className}`}>
      <div ref={stageRef} aria-hidden data-cursor className="ca-stage cursor-pointer">
        <div className="ca-assembly">
          {/* the core and edges */}
          <div className="ca-comp ca-comp--i">
            {CORE.map((c) => (
              <div
                key={c.key}
                className="ca-slot"
                style={{ "--cx": c.x, "--cy": c.y, "--cz": c.z } as React.CSSProperties}
              >
                <Cube />
              </div>
            ))}
          </div>
          {/* the eight corners */}
          <div className="ca-comp ca-comp--o">
            {CORNERS.map((c) => (
              <div
                key={c.key}
                className="ca-pos"
                style={{ "--sx": c.sx, "--sy": c.sy, "--sz": c.sz } as React.CSSProperties}
              >
                <Cube className="ca-corner" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

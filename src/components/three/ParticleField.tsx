"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The brand network: square particles (echoing the logo's pixel-dissolve
 * mark) loosely connected into a blueprint diagram. Square sprites are
 * deliberate — PointsMaterial without a texture renders squares, not dots.
 * Always rendered behind content (z-0 wrapper; text sits at z-10).
 *
 * Two behaviours the client asked for drive the design here:
 *   1. the field tracks the cursor, and
 *   2. clicking blows the pixels apart from the point you clicked.
 * Both are wired to `window` rather than to the canvas, so the wrapper can
 * stay `pointer-events: none` and never swallow a click meant for the page
 * underneath it. The old build listened on the canvas, which — being
 * pointer-events:none — received no events at all, which is why the field
 * never appeared to follow the mouse.
 */

const ACCENT = new THREE.Color("#ff4e45");

// On paper the network reads as navy ink; on a navy ground it has to invert
// or the particles simply vanish into the background.
const PALETTE = {
  light: {
    secondary: new THREE.Color("#6d7cad"),
    primary: new THREE.Color("#2c365e"),
    line: "#7d8cba",
    lineOpacity: 0.45,
  },
  dark: {
    secondary: new THREE.Color("#93a3d6"),
    primary: new THREE.Color("#e8ecf8"),
    line: "#8fa0d4",
    lineOpacity: 0.28,
  },
} as const;

/** Depth of the cloud. Wide and shallow, like pixels mid-dissolve. */
const SPREAD_Z = 12;
/** How far past the visible frame the cloud runs, so edges never show. */
const OVERSCAN = 1.2;
/** Particles per square world unit of visible frame. */
const DENSITY = 4;
/** Blast radius of a click, in world units. */
const BURST_RADIUS = 4.6;
const BURST_FORCE = 20;
/** How hard a displaced pixel is pulled back to where it belongs. */
const SPRING = 6.5;
/** Velocity retained per 1/60s. */
const DAMPING = 0.87;
/** How long the simulation keeps running after the last click. */
const SETTLE_SECONDS = 4;

type Cloud = {
  count: number;
  base: Float32Array;
  positions: Float32Array;
  colors: Float32Array;
  linePositions: Float32Array;
  /** Particle index pairs behind each line segment, so lines follow a blast. */
  pairs: Int32Array;
};

/**
 * The blast simulation's scratch state. Kept in a ref and out of the memo
 * above: the memo describes the cloud's resting shape and is read-only, while
 * these are written on every frame of an explosion. The live position and line
 * buffers are not held here either — those are reached through the geometry
 * refs, because Three.js owns them once they are attached.
 */
type Sim = { base: Float32Array; velocities: Float32Array };

function buildCloud(
  spreadX: number,
  spreadY: number,
  count: number,
  palette: (typeof PALETTE)[keyof typeof PALETTE]
): Cloud {
  const base = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const pts: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * spreadX;
    const z = (Math.random() - 0.5) * SPREAD_Z;
    const y = (Math.random() - 0.5) * spreadY + Math.sin(x * 0.4) * (spreadY * 0.12);
    base.set([x, y, z], i * 3);
    pts.push(new THREE.Vector3(x, y, z));

    const r = Math.random();
    const c = r < 0.07 ? ACCENT : r < 0.4 ? palette.secondary : palette.primary;
    col.set([c.r, c.g, c.b], i * 3);
  }

  // Connect near neighbours — capped so the network stays sparse. The
  // threshold tracks the actual density, so a wide contact band gets the same
  // visual weight of wiring as the tall hero does.
  const threshold = 1.3 * Math.cbrt((spreadX * spreadY * SPREAD_Z) / count);
  const MAX_SEGS = 700;
  const pairList: number[] = [];

  outer: for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      if (pts[i].distanceTo(pts[j]) < threshold) {
        pairList.push(i, j);
        if (pairList.length / 2 >= MAX_SEGS) break outer;
      }
    }
  }

  const pairs = Int32Array.from(pairList);
  const linePositions = new Float32Array(pairs.length * 3);
  for (let s = 0; s < pairs.length; s++) {
    linePositions.set(base.subarray(pairs[s] * 3, pairs[s] * 3 + 3), s * 3);
  }

  return {
    count,
    base,
    positions: base.slice(),
    colors: col,
    linePositions,
    pairs,
  };
}

function Field({
  scrollRef,
  tone,
  mobile,
}: {
  scrollRef?: MutableRefObject<number>;
  tone: "light" | "dark";
  mobile: boolean;
}) {
  const palette = PALETTE[tone];
  const group = useRef<THREE.Group>(null);
  const pointGeo = useRef<THREE.BufferGeometry>(null);
  const lineGeo = useRef<THREE.BufferGeometry>(null);

  const gl = useThree((s) => s.gl);
  const viewW = useThree((s) => s.viewport.width);
  const viewH = useThree((s) => s.viewport.height);

  // Quantised to even world units so a one-pixel resize can't rebuild the
  // whole cloud (the neighbour search is O(n²) and not free).
  const spreadX = Math.max(12, Math.round((viewW * OVERSCAN) / 2) * 2);
  const spreadY = Math.max(10, Math.round((viewH * OVERSCAN) / 2) * 2);

  const cloud = useMemo(() => {
    const cap = mobile ? 520 : 1500;
    const count = Math.min(cap, Math.max(320, Math.round(spreadX * spreadY * DENSITY)));
    return buildCloud(spreadX, spreadY, count, palette);
  }, [spreadX, spreadY, palette, mobile]);

  // Scratch buffers for the blast, re-allocated whenever the cloud is rebuilt.
  const sim = useRef<Sim | null>(null);
  useEffect(() => {
    sim.current = {
      base: cloud.base.slice(),
      velocities: new Float32Array(cloud.count * 3),
    };
    return () => {
      sim.current = null;
    };
  }, [cloud]);

  // Cursor, in normalised device coords relative to *this* canvas.
  const pointer = useRef({ x: 0, y: 0 });
  const smoothed = useRef({ x: 0, y: 0 });
  // Wall-clock deadline: while it's in the future the blast simulation runs.
  const activeUntil = useRef(0);
  const settled = useRef(true);
  // Whole-field kick, so a click also punches the camera and the group scale.
  const burst = useRef(0);
  const blast = useRef(new THREE.Vector3());
  const pendingBlast = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;

    const toNdc = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return null;
      return {
        x: ((e.clientX - r.left) / r.width) * 2 - 1,
        y: -((e.clientY - r.top) / r.height) * 2 + 1,
        inside:
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom,
      };
    };

    const onMove = (e: PointerEvent) => {
      const n = toNdc(e);
      if (!n) return;
      // Clamped rather than dropped: the field still leans toward a cursor
      // that has wandered off the canvas, which is what makes it feel alive.
      pointer.current.x = THREE.MathUtils.clamp(n.x, -1.6, 1.6);
      pointer.current.y = THREE.MathUtils.clamp(n.y, -1.6, 1.6);
    };

    // Only a click *on* the field detonates it — otherwise a click on the
    // footer would silently blow up a hero nobody is looking at.
    const onDown = (e: PointerEvent) => {
      const n = toNdc(e);
      if (!n || !n.inside) return;
      pointer.current.x = n.x;
      pointer.current.y = n.y;
      burst.current = 1;
      pendingBlast.current = true;
      activeUntil.current = performance.now() / 1000 + SETTLE_SECONDS;
      settled.current = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [gl]);

  useFrame(({ clock, camera }, delta) => {
    const t = clock.getElapsedTime();
    // Clamp: a backgrounded tab hands back a delta of several seconds, which
    // would fire the whole cloud into the distance in one step.
    const dt = Math.min(delta, 1 / 30);

    smoothed.current.x = THREE.MathUtils.lerp(smoothed.current.x, pointer.current.x, 0.09);
    smoothed.current.y = THREE.MathUtils.lerp(smoothed.current.y, pointer.current.y, 0.09);

    burst.current = Math.max(0, burst.current - dt * 1.6);
    const kick = burst.current * burst.current; // ease out — hardest on impact

    const g = group.current;
    if (g) {
      // Follow the pointer: move right and the field swings right with you.
      g.rotation.y = t * 0.02 + smoothed.current.x * 0.42;
      g.rotation.x = Math.sin(t * 0.08) * 0.04 + smoothed.current.y * 0.24;
      g.position.x = smoothed.current.x * 0.9;
      g.position.y = Math.sin(t * 0.25) * 0.35 - smoothed.current.y * 0.5;
      g.scale.setScalar(1 + kick * 0.1);
      g.updateMatrixWorld();
    }

    // The live buffers belong to Three.js once they are attached, so they are
    // read back off the geometry rather than out of the memo the JSX was built
    // from — the memo describes the resting cloud and stays read-only.
    const state = sim.current;
    const posAttr = pointGeo.current?.attributes.position as THREE.BufferAttribute | undefined;
    const lineAttr = lineGeo.current?.attributes.position as THREE.BufferAttribute | undefined;
    const positions = posAttr?.array as Float32Array | undefined;
    const linePositions = lineAttr?.array as Float32Array | undefined;

    // A queued click becomes an impulse here, where the group's matrix for
    // this frame is already up to date.
    if (pendingBlast.current && g && state && positions) {
      pendingBlast.current = false;
      const ndc = new THREE.Vector3(pointer.current.x, pointer.current.y, 0.5).unproject(camera);
      const dir = ndc.sub(camera.position).normalize();
      // Where the ray crosses the z = 0 plane, then into the group's own space.
      const hit = camera.position
        .clone()
        .add(dir.multiplyScalar(dir.z !== 0 ? -camera.position.z / dir.z : 0));
      blast.current.copy(g.worldToLocal(hit));

      const velocities = state.velocities;
      const b = blast.current;
      for (let i = 0; i < cloud.count; i++) {
        const ix = i * 3;
        const dx = positions[ix] - b.x;
        const dy = positions[ix + 1] - b.y;
        const dz = positions[ix + 2] - b.z;
        const dist = Math.hypot(dx, dy, dz);
        if (dist > BURST_RADIUS) continue;
        // Squared falloff, and a floor on the distance so a direct hit doesn't
        // divide by ~zero and launch one pixel into orbit.
        const falloff = 1 - dist / BURST_RADIUS;
        const d = Math.max(dist, 0.35);
        const force = (BURST_FORCE * falloff * falloff) / d;
        velocities[ix] += dx * force;
        velocities[ix + 1] += dy * force;
        velocities[ix + 2] += dz * force;
      }
    }

    // Integrate the blast: spring back to the resting shape, damped.
    if (!settled.current && state && positions && linePositions) {
      const running = performance.now() / 1000 < activeUntil.current;
      const { base, velocities } = state;
      const damp = Math.pow(DAMPING, dt * 60);
      let maxOffset = 0;

      for (let i = 0; i < cloud.count * 3; i++) {
        const home = base[i] - positions[i];
        velocities[i] = (velocities[i] + home * SPRING * dt) * damp;
        positions[i] += velocities[i] * dt;
        const off = Math.abs(home);
        if (off > maxOffset) maxOffset = off;
      }

      // Below a fortieth of a world unit nobody can see the difference, so
      // snap home and stop paying for the simulation.
      if (!running || maxOffset < 0.025) {
        positions.set(base);
        velocities.fill(0);
        settled.current = true;
      }

      const pairs = cloud.pairs;
      for (let s = 0; s < pairs.length; s++) {
        const p = pairs[s] * 3;
        linePositions[s * 3] = positions[p];
        linePositions[s * 3 + 1] = positions[p + 1];
        linePositions[s * 3 + 2] = positions[p + 2];
      }

      if (posAttr) posAttr.needsUpdate = true;
      if (lineAttr) lineAttr.needsUpdate = true;
    }

    // Pull the camera back gently as the hero story progresses, and punch it
    // on click so the pixels visibly jump.
    const progress = scrollRef?.current ?? 0;
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      11 + progress * 4 - kick * 1.4,
      0.06
    );
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry ref={pointGeo}>
          <bufferAttribute attach="attributes-position" args={[cloud.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[cloud.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={1}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <bufferGeometry ref={lineGeo}>
          <bufferAttribute attach="attributes-position" args={[cloud.linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={palette.line}
          transparent
          opacity={palette.lineOpacity}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

/**
 * Static stand-in for reduced-motion users. Same ink, same pixel language,
 * no canvas, no WebGL context and no per-frame cost.
 */
function StaticField({ tone }: { tone: "light" | "dark" }) {
  const dot = tone === "dark" ? "rgba(147,163,214,0.55)" : "rgba(109,124,173,0.5)";
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(${dot} 1px, transparent 1px), radial-gradient(rgba(255,78,69,0.35) 1px, transparent 1px)`,
        backgroundSize: "34px 34px, 119px 119px",
        backgroundPosition: "0 0, 17px 17px",
        maskImage: "radial-gradient(ellipse at center, black 20%, transparent 78%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 78%)",
      }}
    />
  );
}

export function ParticleField({
  scrollRef,
  className = "",
  tone = "light",
  /**
   * "vignette" fades the field out toward the edges so type always wins.
   * "full" lets it run edge to edge — used on the contact band, where the
   * network *is* the content.
   */
  coverage = "vignette",
}: {
  scrollRef?: MutableRefObject<number>;
  className?: string;
  /** Which ground the field is sitting on, so fog and vignette match it. */
  tone?: "light" | "dark";
  coverage?: "vignette" | "full";
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const ground = tone === "dark" ? "#0b1128" : "#f7f8fb";

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      setReduced(motion.matches);
      setMobile(small.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    small.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      small.removeEventListener("change", sync);
    };
  }, []);

  // Off-screen fields stop rendering entirely. The homepage carries two of
  // them and paying for both at all times is what made the hero expensive.
  useEffect(() => {
    const el = wrapper.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={wrapper}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      aria-hidden
    >
      {reduced ? (
        <StaticField tone={tone} />
      ) : (
        <Canvas
          camera={{ position: [0, 0, 11], fov: 58 }}
          dpr={[1, 1.5]}
          frameloop={visible ? "always" : "never"}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <fog attach="fog" args={[ground, 9, 20]} />
          <Field scrollRef={scrollRef} tone={tone} mobile={mobile} />
        </Canvas>
      )}

      {/* Vignette so type always wins over the scene. Skipped where the field
          is meant to reach the edges of its band. How wide the clear core runs
          is left to CSS via --field-core: the hero opens it up on desktop, where
          a 30% core left the network reading as a small ellipse in the corner
          rather than a field filling its band. It stays tight on phones, where
          the copy spans the full width and has nowhere to get out of the way. */}
      {coverage === "vignette" && (
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `radial-gradient(ellipse at center, transparent var(--field-core, 30%), ${ground} 100%)`,
          }}
        />
      )}
    </div>
  );
}

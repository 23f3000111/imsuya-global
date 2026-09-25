"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { decodeLandDots } from "@/data/landDots";
import { onPreloaderLift } from "@/lib/preloader";

const NAVY = new THREE.Color("#081d38");
const ORANGE = new THREE.Color("#f04e23");
const BODY = new THREE.Color("#eef2f9");

/** The studio. */
const HQ = { lat: 3.139, lon: 101.687 };

/**
 * Where arcs run to. The client asked for the globe to cover Malaysia and
 * Kenya only, so there is one: Mombasa, home of Roadtainers.
 */
const REACH = [
  { lat: -4.04, lon: 39.67 }, // Mombasa, Kenya
];

const R = 1;

function toVec(lat: number, lon: number, r = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

const ARC_SEGMENTS = 72;
/** How many points of an arc the travelling head lights at once. */
const HEAD = 18;

/**
 * A great-circle arc between two surface points, lifted off the globe by a
 * sine bump that grows with the distance, so long hops arch higher.
 */
function arcPoints(a: THREE.Vector3, b: THREE.Vector3) {
  const from = a.clone().normalize();
  const to = b.clone().normalize();
  const turn = new THREE.Quaternion().setFromUnitVectors(from, to);
  // Kept low enough that even the longest hop stays inside the frame.
  const lift = 0.08 + from.angleTo(to) * 0.12;
  const step = new THREE.Quaternion();
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= ARC_SEGMENTS; i++) {
    const t = i / ARC_SEGMENTS;
    step.identity().slerp(turn, t);
    pts.push(from.clone().applyQuaternion(step).multiplyScalar(R + Math.sin(Math.PI * t) * lift));
  }
  return pts;
}

type Spin = {
  rotX: number;
  rotY: number;
  velX: number;
  velY: number;
  dragging: boolean;
  lastInput: number;
};

/** Moves the globe on by one frame and returns where it now points. */
type Advance = (dt: number) => { x: number; y: number };

/** Start with Kuala Lumpur facing the viewer, the tilt favouring the north. */
function initialSpin(): Spin {
  const v = toVec(HQ.lat, HQ.lon);
  return {
    rotX: 0.32,
    rotY: Math.atan2(-v.x, v.z),
    velX: 0,
    velY: 0,
    dragging: false,
    // Held until the loader lifts — see the effect below.
    lastInput: Number.POSITIVE_INFINITY,
  };
}

function World({ advance, reduced }: { advance: Advance; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);

  // Land dots, decoded once. Antarctica is dropped: at the bottom of a tilted
  // globe it only ever reads as a smear of dots along the rim.
  const land = useMemo(() => {
    const raw = decodeLandDots();
    const pos: number[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      if (raw[i] < -60) continue;
      const v = toVec(raw[i], raw[i + 1], R * 1.002);
      pos.push(v.x, v.y, v.z);
    }
    return new Float32Array(pos);
  }, []);

  const hq = useMemo(() => toVec(HQ.lat, HQ.lon, R * 1.004), []);
  const hqPosition = useMemo(() => new Float32Array([hq.x, hq.y, hq.z]), [hq]);
  const reach = useMemo(() => REACH.map((p) => toVec(p.lat, p.lon, R * 1.004)), []);

  // Each arc is a faint track plus a copy of it whose draw range is moved
  // along every frame, so a bright head appears to travel out from the studio.
  // Built as plain three.js objects: R3F's <line> collides with the SVG
  // element of the same name in the JSX types.
  const arcs = useMemo(
    () =>
      reach.map((to) => {
        const pts = arcPoints(hq, to);
        const track = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.35 })
        );
        const head = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: ORANGE })
        );
        head.geometry.setDrawRange(0, 0);
        return { track, head };
      }),
    [hq, reach]
  );

  useEffect(
    () => () =>
      arcs.forEach(({ track, head }) => {
        [track, head].forEach((l) => {
          l.geometry.dispose();
          (l.material as THREE.Material).dispose();
        });
      }),
    [arcs]
  );

  const reachPositions = useMemo(() => {
    const a = new Float32Array(reach.length * 3);
    reach.forEach((v, i) => a.set([v.x, v.y, v.z], i * 3));
    return a;
  }, [reach]);

  // The pulse ring lies flat on the surface at the studio.
  const ringQuat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), hq.clone().normalize()),
    [hq]
  );

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = clock.getElapsedTime();

    const rot = advance(dt);
    const g = group.current;
    if (g) {
      g.rotation.x = rot.x;
      g.rotation.y = rot.y;
    }

    if (pulse.current && !reduced) {
      const k = (t * 0.7) % 1;
      pulse.current.scale.setScalar(1 + k * 3.2);
      (pulse.current.material as THREE.MeshBasicMaterial).opacity = 0.75 * (1 - k);
    }

    // A bright head travels each arc, staggered so they never fire together,
    // with a pause at the far end before the next one leaves.
    const total = ARC_SEGMENTS + 1;
    arcs.forEach(({ head }, i) => {
      const k = ((t * 0.32 + i / arcs.length) % 1.3) / 1.3;
      const tip = Math.floor(k * (total + HEAD));
      const start = Math.max(0, tip - HEAD);
      head.geometry.setDrawRange(start, Math.max(0, Math.min(total, tip) - start));
    });
  });

  return (
    <group ref={group}>
      {/* The body: pale, so the navy land reads and the far side stays hidden. */}
      <mesh>
        <sphereGeometry args={[R * 0.995, 64, 64]} />
        <meshBasicMaterial color={BODY} />
      </mesh>

      {/* Land, as square pixels — the brand's own unit. */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[land, 3]} />
        </bufferGeometry>
        <pointsMaterial color={NAVY} size={0.022} sizeAttenuation />
      </points>

      {/* Arcs out from the studio: a faint track and a travelling head. */}
      {arcs.map(({ track, head }, i) => (
        <group key={i}>
          <primitive object={track} />
          <primitive object={head} />
        </group>
      ))}

      {/* Client locations. */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[reachPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={ORANGE} size={0.05} sizeAttenuation />
      </points>

      {/* The studio: a solid square and a ring pulsing out from it. */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[hqPosition, 3]} />
        </bufferGeometry>
        <pointsMaterial color={ORANGE} size={0.075} sizeAttenuation />
      </points>
      <mesh ref={pulse} position={hq} quaternion={ringQuat}>
        <ringGeometry args={[0.03, 0.038, 4, 1, Math.PI / 4]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.7} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * The contact-page globe: the world as a field of square pixels in brand navy,
 * Kuala Lumpur pulsing in orange, and an arc running out to Mombasa in Kenya.
 *
 * Drag it — it spins with the hand and carries on after a throw, then settles
 * back into a slow drift. Touch keeps vertical swipes for the page
 * (touch-action: pan-y), so the globe never traps someone scrolling past it.
 * It stops rendering when it is off screen, and under reduced motion it holds
 * still until it is dragged.
 */
export function Globe({ className = "" }: { className?: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const spin = useRef<Spin>(initialSpin());
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hold Kuala Lumpur front and centre until the loader has lifted, so the
  // first thing a visitor sees is the studio, not wherever the drift had got
  // to underneath the loader.
  useEffect(
    () =>
      onPreloaderLift(() => {
        spin.current.lastInput = performance.now() + 1200;
      }),
    []
  );

  // Drag to spin, with the throw carried on as inertia.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    let last: { x: number; y: number } | null = null;

    const down = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      spin.current.dragging = true;
      spin.current.velX = spin.current.velY = 0;
      // Capture can refuse a pointer it does not recognise (a pen lifted
      // mid-gesture, a synthetic event); dragging still works without it.
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
      setGrabbing(true);
    };
    const move = (e: PointerEvent) => {
      if (!last) return;
      const size = el.clientWidth || 1;
      const dx = ((e.clientX - last.x) / size) * Math.PI;
      const dy = ((e.clientY - last.y) / size) * Math.PI;
      last = { x: e.clientX, y: e.clientY };
      const s = spin.current;
      s.rotY += dx;
      s.rotX += dy;
      s.velY = dx;
      s.velX = dy;
      s.lastInput = performance.now();
    };
    const up = (e: PointerEvent) => {
      last = null;
      spin.current.dragging = false;
      spin.current.lastInput = performance.now();
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      setGrabbing(false);
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  // One frame of motion: inertia after a throw, then a slow drift once the
  // hand has left, and the tilt easing back toward a northern view.
  const advance = useCallback<Advance>(
    (dt) => {
      const s = spin.current;
      if (!s.dragging) {
        const damp = Math.pow(0.9, dt * 60);
        s.velX *= damp;
        s.velY *= damp;
        s.rotX += s.velX;
        s.rotY += s.velY;
        const idle = performance.now() - s.lastInput > 1600;
        if (idle && !reduced) s.rotY += dt * 0.07;
        if (idle) s.rotX += (0.32 - s.rotX) * Math.min(1, dt * 0.8);
      }
      s.rotX = THREE.MathUtils.clamp(s.rotX, -1.1, 1.1);
      return { x: s.rotX, y: s.rotY };
    },
    [reduced]
  );

  return (
    <div
      ref={wrapper}
      aria-hidden
      data-cursor
      className={`relative aspect-square w-full select-none [touch-action:pan-y] ${
        grabbing ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
    >
      {/* flat: no tone mapping, so the navy and orange land on the brand hex
          values instead of being pushed through a filmic curve. */}
      <Canvas
        flat
        camera={{ position: [0, 0, 3.1], fov: 38 }}
        dpr={[1, 2]}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, alpha: true }}
      >
        <World advance={advance} reduced={reduced} />
      </Canvas>
    </div>
  );
}

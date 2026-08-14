"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The brand network: square particles (echoing the logo's pixel-dissolve
 * mark) loosely connected into a blueprint diagram. Square sprites are
 * deliberate — PointsMaterial without a texture renders squares, not dots.
 * Always rendered behind content (z-0 wrapper; text sits at z-10).
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

function Field({
  count,
  scrollRef,
  tone,
}: {
  count: number;
  scrollRef?: MutableRefObject<number>;
  tone: "light" | "dark";
}) {
  const palette = PALETTE[tone];
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { positions, colors, linePositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const pts: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      // A wide, shallow cloud with a wave bias — like pixels mid-dissolve.
      const x = (Math.random() - 0.5) * 26;
      const z = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 11 + Math.sin(x * 0.4) * 1.4;
      pos.set([x, y, z], i * 3);
      pts.push(new THREE.Vector3(x, y, z));

      const r = Math.random();
      const c = r < 0.07 ? ACCENT : r < 0.4 ? palette.secondary : palette.primary;
      col.set([c.r, c.g, c.b], i * 3);
    }

    // Connect near neighbours — capped so the network stays sparse.
    const segs: number[] = [];
    const MAX_SEGS = 620;
    const THRESHOLD = 1.9;
    outer: for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (pts[i].distanceTo(pts[j]) < THRESHOLD) {
          segs.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          if (segs.length / 6 >= MAX_SEGS) break outer;
        }
      }
    }

    return {
      positions: pos,
      colors: col,
      linePositions: new Float32Array(segs),
    };
  }, [count, palette]);

  useFrame(({ clock, camera, pointer }) => {
    const t = clock.getElapsedTime();
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, pointer.x, 0.04);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, pointer.y, 0.04);

    const g = group.current;
    if (g) {
      g.rotation.y = t * 0.02 + mouse.current.x * 0.12;
      g.rotation.x = Math.sin(t * 0.08) * 0.04 + mouse.current.y * 0.08;
      g.position.y = Math.sin(t * 0.25) * 0.35;
    }

    // Pull the camera back gently as the hero story progresses.
    const progress = scrollRef?.current ?? 0;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 11 + progress * 4, 0.06);
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
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
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
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

export function ParticleField({
  scrollRef,
  className = "",
  tone = "light",
}: {
  scrollRef?: MutableRefObject<number>;
  className?: string;
  /** Which ground the field is sitting on, so fog and vignette match it. */
  tone?: "light" | "dark";
}) {
  const count =
    typeof window !== "undefined" && window.innerWidth < 768 ? 450 : 1100;
  const ground = tone === "dark" ? "#0b1128" : "#f7f8fb";

  return (
    <div className={`pointer-events-none absolute inset-0 z-0 ${className}`} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 11], fov: 58 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={[ground, 9, 20]} />
        <Field count={count} scrollRef={scrollRef} tone={tone} />
      </Canvas>
      {/* Vignette so type always wins over the scene */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, ${ground} 100%)`,
        }}
      />
    </div>
  );
}

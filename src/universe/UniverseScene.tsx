import { useEffect, useMemo, useRef } from 'react';
import { Canvas, addEffect, useStore } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SHELL_RADIUS, shellTilt, type OrbitNode } from './model';

/** Shared by every node — one geometry instead of one per sphere. */
const NODE_GEOMETRY = new THREE.SphereGeometry(0.11, 14, 14);
/** "Current focus" technologies (not demonstrated by this site) are drawn as outlines. */
const FOCUS_GEOMETRY = new THREE.SphereGeometry(0.14, 8, 6);

/** Soft radial sprite texture used for the additive glow halo around each node. */
function makeHaloTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  g.addColorStop(0.35, 'rgba(255, 255, 255, 0.28)');
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

interface SceneProps {
  nodes: OrbitNode[];
  lit: ReadonlySet<string>;
  activeId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  progress: { current: number };
  /** Small / touch device: cheaper renderer, labels only for the active node. */
  compact: boolean;
  reduced: boolean;
  /** False while the universe section is off-screen: the loop skips its work. */
  active: boolean;
  /**
   * The element that receives pointer events. The scene is a fixed backdrop
   * beneath the page content, so the canvas itself never gets a pointer —
   * events are read from this section instead.
   */
  eventSource: HTMLElement;
  /**
   * Fixed-position container for the drei Html tech labels. Without this the
   * labels are appended to the eventSource section and their viewport-based
   * coordinates drift by the scroll offset, detaching them from their nodes.
   */
  labelPortal: React.RefObject<HTMLElement | null>;
}

function Starfield({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.55;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#7dd3fc"
        size={0.045}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Universe({
  nodes,
  lit,
  activeId,
  onHover,
  onSelect,
  progress,
  compact,
  reduced,
  labelPortal,
}: Omit<SceneProps, 'eventSource' | 'active'>) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const refs = useRef<(THREE.Group | null)[]>([]);
  const target = useMemo(() => new THREE.Vector3(), []);
  const haloTexture = useMemo(makeHaloTexture, []);
  const store = useStore();

  /**
   * All per-frame scene motion — node orbits, group rotation, core pulse and
   * the scroll-driven camera rig — runs in addEffect, which R3F executes BEFORE
   * every useFrame subscriber. drei's Html labels position themselves in
   * useFrame, and React subscribes those bottom-up, so the labels' useFrame
   * used to run before this scene's own useFrame: labels were projected from
   * last frame's node positions and camera while the balls rendered with this
   * frame's, and on slower devices the labels visibly detached from their
   * balls whenever the camera moved (scrolling). With the motion applied here
   * first, the labels project from this frame's state and stay glued on.
   */
  useEffect(() => {
    let last = performance.now();
    return addEffect(() => {
      const { camera, size, clock } = store.getState();
      const now = performance.now();
      const dt = Math.min(0.064, Math.max(0, (now - last) / 1000));
      last = now;

      // Under reduced motion the scene is static: time never advances.
      // (When `active` is false the Canvas switches to on-demand rendering, so
      // this callback simply stops being called and the last frame persists.)
      const t = reduced ? 0 : clock.elapsedTime;

      if (group.current) {
        group.current.rotation.y = t * 0.035 + progress.current * 1.1;
        group.current.rotation.x = 0.18 + Math.sin(t * 0.12) * 0.04;
      }
      if (core.current) {
        core.current.rotation.y = -t * 0.16;
        core.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.02);
      }

      nodes.forEach((n, i) => {
        const obj = refs.current[i];
        if (!obj) return;
        const a = n.phase + t * n.speed;
        obj.position.set(
          Math.cos(a) * n.radius,
          Math.sin(a) * Math.sin(n.tilt) * n.radius,
          Math.sin(a) * n.radius * Math.cos(n.tilt),
        );
        const on = lit.size === 0 || lit.has(n.id);
        target.setScalar(n.id === activeId ? 1.6 : on ? 1 : 0.55);
        if (reduced) obj.scale.copy(target);
        else obj.scale.lerp(target, Math.min(1, dt * 8));
      });

      // Scroll flies the camera outward; portrait screens back off further so
      // the shells fit. The camera matrix is refreshed here so the Html labels
      // (which project in useFrame, right after this) see this frame's camera.
      const p = progress.current;
      const aspect = size.width / Math.max(1, size.height);
      const fit = Math.min(2.2, Math.max(1, 1.1 / aspect));
      const z = (10 + p * 5) * fit;
      const y = 1.2 + p * 2.4;
      const k = Math.min(1, dt * 2.4);
      camera.position.z += (z - camera.position.z) * k;
      camera.position.y += (y - camera.position.y) * k;
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
    });
  }, [store, nodes, lit, activeId, progress, reduced, target]);

  return (
    <group>
      <Starfield count={compact ? 220 : 520} />
      <group ref={group}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshBasicMaterial color="#7dd3fc" wireframe transparent opacity={0.42} />
        </mesh>
        <mesh rotation={[0.6, 0.2, 0]}>
          <icosahedronGeometry args={[1.45, 1]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.14} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.95, 3]} />
          <meshBasicMaterial color="#05070c" />
        </mesh>

        {Object.values(SHELL_RADIUS).map((r) => (
          <mesh key={r} rotation={[Math.PI / 2 + shellTilt(r), 0, 0]}>
            <torusGeometry args={[r, 0.004, 3, compact ? 64 : 128]} />
            <meshBasicMaterial color="#7dd3fc" transparent opacity={0.12} />
          </mesh>
        ))}

        {nodes.map((n, i) => {
          const on = lit.size === 0 || lit.has(n.id);
          const showLabel = compact ? n.id === activeId : on;
          const isActive = n.id === activeId;
          return (
            <group
              key={n.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
            >
              <sprite scale={[isActive ? 1.1 : 0.75, isActive ? 1.1 : 0.75, 1]}>
                <spriteMaterial
                  map={haloTexture}
                  color={n.color}
                  transparent
                  opacity={isActive ? 0.85 : on ? 0.4 : 0.1}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </sprite>
              <mesh
                geometry={n.basis === 'focus' ? FOCUS_GEOMETRY : NODE_GEOMETRY}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  onHover(n.id);
                }}
                onPointerOut={() => onHover(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(n.id);
                }}
              >
                <meshBasicMaterial
                  color={n.color}
                  wireframe={n.basis === 'focus'}
                  transparent
                  opacity={on ? 1 : 0.3}
                />
              </mesh>
              {showLabel && (
                <Html
                  center
                  distanceFactor={22}
                  zIndexRange={[10, 0]}
                  style={{ pointerEvents: 'none' }}
                  portal={labelPortal as React.RefObject<HTMLElement>}
                >
                  <span className={`scene-label${lit.has(n.id) ? ' is-lit' : ''}`}>{n.name}</span>
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}

export default function UniverseScene({ eventSource, compact, active, ...props }: SceneProps) {
  return (
    <Canvas
      dpr={compact ? [1, 1.25] : [1, 1.6]}
      camera={{ position: [0, 1.2, 10], fov: 45 }}
      gl={{ antialias: !compact, powerPreference: compact ? 'default' : 'high-performance' }}
      // Off-screen the loop goes on-demand: the last frame stays up as a static
      // backdrop and the GPU idles instead of rendering 60fps nobody looks at.
      frameloop={active ? 'always' : 'demand'}
      eventSource={eventSource}
      eventPrefix="client"
    >
      <color attach="background" args={['#05070c']} />
      <Universe compact={compact} {...props} />
    </Canvas>
  );
}

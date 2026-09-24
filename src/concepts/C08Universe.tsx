import { Suspense, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { gsap, ScrollTrigger, useConceptScope, useLenis } from '../lib/motion';
import { education, profile, projects, roles, skills } from '../data/content';
import './c08.css';

/**
 * 08 — Technology Universe.
 *
 * One explorable 3D system carries the whole portfolio. Technologies orbit a
 * core on three shells; hovering a technology lights every project that uses
 * it, and hovering a project lights its technologies back. Scroll is camera
 * travel outward through the layers. Heavy 3D, by design — this concept exists
 * to answer whether you want that.
 */

const GROUP_COLOR: Record<string, string> = {
  Frontend: '#7dd3fc',
  Backend: '#f0f4f8',
  Data: '#9aa7bd',
  Applications: '#c9b4ff',
};

const SHELL: Record<string, number> = {
  Frontend: 3.0,
  Backend: 4.2,
  Data: 5.3,
  Applications: 6.4,
};

interface Node {
  name: string;
  group: string;
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  color: string;
}

function useNodes(): Node[] {
  return useMemo(
    () =>
      skills.map((s, i) => ({
        name: s.name,
        group: s.group,
        radius: SHELL[s.group] ?? 4,
        speed: 0.1 - (SHELL[s.group] ?? 4) * 0.008,
        phase: (i / skills.length) * Math.PI * 2 * 3,
        tilt: ((SHELL[s.group] ?? 4) - 4.2) * 0.22,
        color: GROUP_COLOR[s.group] ?? '#ffffff',
      })),
    [],
  );
}

/** Which technologies each project draws on — from the project's own stack. */
function projectTech(stack: string[]): string[] {
  const names = skills.map((s) => s.name);
  return stack.flatMap((t) =>
    names.filter((n) => n.toLowerCase().includes(t.toLowerCase().split(' ')[0])),
  );
}

const TMP = new THREE.Vector3();

function Universe({
  nodes,
  lit,
  onHover,
  progress,
}: {
  nodes: Node[];
  lit: Set<string>;
  onHover: (n: string | null) => void;
  progress: MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;

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
      const on = lit.size === 0 || lit.has(n.name);
      TMP.setScalar(on ? 1 : 0.55);
      obj.scale.lerp(TMP, Math.min(1, dt * 8));
    });
  });

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#7dd3fc" wireframe transparent opacity={0.42} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.95, 3]} />
        <meshBasicMaterial color="#05070c" />
      </mesh>
      <Html center distanceFactor={16} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <span className="u8__core-label">{profile.last.toUpperCase()}</span>
      </Html>

      {Object.values(SHELL).map((r) => (
        <mesh key={r} rotation={[Math.PI / 2 + (r - 4.2) * 0.22, 0, 0]}>
          <torusGeometry args={[r, 0.004, 3, 128]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.12} />
        </mesh>
      ))}

      {nodes.map((n, i) => {
        const on = lit.size === 0 || lit.has(n.name);
        return (
          <group
            key={n.name}
            ref={(el) => {
              refs.current[i] = el;
            }}
          >
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                onHover(n.name);
              }}
              onPointerOut={() => onHover(null)}
            >
              <sphereGeometry args={[0.11, 14, 14]} />
              <meshBasicMaterial color={n.color} transparent opacity={on ? 1 : 0.3} />
            </mesh>
            {on && (
              <Html center distanceFactor={22} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
                <span className={`u8__node-label ${lit.has(n.name) ? 'is-lit' : ''}`}>{n.name}</span>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

function Rig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera } = useThree();
  useFrame((_, dt) => {
    // Scroll flies the camera outward through the shells, then back in.
    const p = progress.current;
    const z = 9 + p * 9;
    const y = 1.2 + p * 3.4;
    camera.position.z += (z - camera.position.z) * Math.min(1, dt * 2.4);
    camera.position.y += (y - camera.position.y) * Math.min(1, dt * 2.4);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function C08Universe() {
  const nodes = useNodes();
  const progress = useRef(0);
  const [hoverTech, setHoverTech] = useState<string | null>(null);
  const [hoverProject, setHoverProject] = useState<string | null>(null);
  useLenis(true);

  const lit = useMemo(() => {
    if (hoverTech) return new Set([hoverTech]);
    if (hoverProject) {
      const p = projects.find((x) => x.id === hoverProject);
      return new Set(p ? projectTech(p.stack) : []);
    }
    return new Set<string>();
  }, [hoverTech, hoverProject]);

  const relatedProjects = hoverTech
    ? projects.filter((p) => projectTech(p.stack).includes(hoverTech))
    : [];

  const root = useConceptScope(() => {
    ScrollTrigger.create({
      trigger: '.u8',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    gsap.from('[data-u8-hero] > *', {
      opacity: 0,
      y: 26,
      duration: 0.9,
      stagger: 0.09,
      ease: 'power3.out',
    });

    gsap.utils.toArray<HTMLElement>('[data-u8-in]').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 34,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
      });
    });

    // Panels dim as they leave so the 3D stays the primary subject.
    gsap.utils.toArray<HTMLElement>('.u8__panel').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0.25 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: 0.5 },
        },
      );
    });
  });

  return (
    <div className="u8" ref={root}>
      <div className="u8__scene" aria-hidden>
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 1.6]}
            camera={{ position: [0, 1.2, 9], fov: 45 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <color attach="background" args={['#05070c']} />
            <Universe nodes={nodes} lit={lit} onHover={setHoverTech} progress={progress} />
            <Rig progress={progress} />
          </Canvas>
        </Suspense>
      </div>

      <nav className="u8__nav">
        <span className="u8__nav-id">{profile.name}</span>
        <span className="u8__nav-hint">Hover the system · scroll to travel</span>
      </nav>

      <header className="u8__hero">
        <div data-u8-hero>
          <span className="u8__eyebrow">{profile.titleAlt}</span>
          <h1>An explorable system</h1>
          <p>
            Nineteen technologies on four shells around one core. Hover any node to see which
            projects use it — or hover a project to light up what it is made of.
          </p>
        </div>
      </header>

      <section className="u8__panel u8__inspector-wrap">
        <aside className="u8__inspector" data-u8-in>
          <span className="u8__panel-tag">Inspector</span>
          {hoverTech ? (
            <>
              <h2>{hoverTech}</h2>
              <p className="u8__inspector-meta">
                {skills.find((s) => s.name === hoverTech)?.group} ·{' '}
                {skills.find((s) => s.name === hoverTech)?.level}
              </p>
              <p className="u8__inspector-body">
                {relatedProjects.length
                  ? `Used in ${relatedProjects.length} project${relatedProjects.length > 1 ? 's' : ''}: ${relatedProjects
                      .map((p) => p.name)
                      .join(', ')}.`
                  : 'Part of the toolkit, not tied to a listed project.'}
              </p>
            </>
          ) : (
            <>
              <h2>The core</h2>
              <p className="u8__inspector-meta">{profile.title}</p>
              <p className="u8__inspector-body">
                {profile.statementShort} Move over a node in the system to inspect it.
              </p>
            </>
          )}
        </aside>
      </section>

      <section className="u8__panel">
        <div className="u8__panel-inner" data-u8-in>
          <span className="u8__panel-tag">Projects</span>
          <h2>Connections</h2>
          {projects.length > 0 ? (
            <>
              <p className="u8__panel-lede">
                Hover a project to light the technologies it draws on inside the system.
              </p>
              <ul className="u8__projects">
                {projects.map((p) => (
                  <li
                    key={p.id}
                    onMouseEnter={() => setHoverProject(p.id)}
                    onMouseLeave={() => setHoverProject(null)}
                    className={hoverProject === p.id ? 'is-on' : ''}
                  >
                    <div>
                      <h3>{p.name}</h3>
                      <span>{p.kind}</span>
                    </div>
                    <p>{p.blurb}</p>
                    <ul>
                      {p.stack.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="u8__panel-lede">Project work is being added here soon.</p>
          )}
        </div>
      </section>

      <section className="u8__panel">
        <div className="u8__panel-inner" data-u8-in>
          <span className="u8__panel-tag">Trajectory</span>
          <h2>Where the system came from</h2>
          <ol className="u8__roles">
            {roles.map((r) => (
              <li key={r.id}>
                <span>{r.period}</span>
                <div>
                  <h3>{r.role}</h3>
                  <p>{r.org}</p>
                  <p className="u8__role-blurb">{r.blurb}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="u8__edu">
            {education.degree} · {education.org} · {education.period}
          </p>
        </div>
      </section>

      <footer className="u8__panel u8__contact">
        <div className="u8__panel-inner" data-u8-in>
          <span className="u8__panel-tag">Signal</span>
          <h2>Get in touch</h2>
          <div className="u8__contact-links">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer noopener">
              LinkedIn ↗
            </a>
            <span>{profile.location}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

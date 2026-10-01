import { technologies, type TechBasis, type TechGroupId } from '../data';

/** Orbit radius per group. Groups come from the technology registry, not from this file. */
export const SHELL_RADIUS: Record<TechGroupId, number> = {
  frontend: 2.8,
  backend: 3.7,
  database: 4.6,
  creative: 5.5,
  tooling: 6.3,
};

export const SHELL_COLOR: Record<TechGroupId, string> = {
  frontend: '#7dd3fc',
  backend: '#f0f4f8',
  database: '#9aa7bd',
  creative: '#c9b4ff',
  tooling: '#7b879c',
};

export const shellTilt = (radius: number) => (radius - 4.6) * 0.22;

export interface OrbitNode {
  id: string;
  name: string;
  group: TechGroupId;
  basis: TechBasis;
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  color: string;
}

/** One node per technology, spread evenly around its own shell. */
export function buildNodes(): OrbitNode[] {
  const total = new Map<TechGroupId, number>();
  technologies.forEach((t) => total.set(t.group, (total.get(t.group) ?? 0) + 1));

  const seen = new Map<TechGroupId, number>();
  return technologies.map((t) => {
    const index = seen.get(t.group) ?? 0;
    seen.set(t.group, index + 1);
    const radius = SHELL_RADIUS[t.group];
    return {
      id: t.id,
      name: t.name,
      group: t.group,
      basis: t.basis,
      radius,
      speed: 0.1 - radius * 0.008,
      phase: (index / (total.get(t.group) ?? 1)) * Math.PI * 2 + radius,
      tilt: shellTilt(radius),
      color: SHELL_COLOR[t.group],
    };
  });
}

/** A technology plus everything it works with (in either direction). */
export function litFor(id: string): Set<string> {
  const out = new Set<string>([id]);
  technologies.find((t) => t.id === id)?.pairsWith.forEach((p) => out.add(p));
  technologies.forEach((t) => {
    if (t.pairsWith.includes(id)) out.add(t.id);
  });
  return out;
}

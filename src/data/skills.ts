/**
 * Technology registry — drives the Expertise section AND the 3D universe.
 *
 * Every entry carries its provenance in `basis`:
 *   'site'  — used in this repository (verifiable from package.json / source / workflow).
 *   'focus' — Muhammad's stated development direction (MERN back end). Real, but this
 *             repository does NOT demonstrate it, and the UI says so.
 *
 * Nothing is rated: no percentages, no years, no levels. Add a technology only if it
 * is genuinely part of the stack; if it is not yet in a finished project, use 'focus'.
 */

export type TechGroupId = 'frontend' | 'backend' | 'database' | 'creative' | 'tooling';
export type TechBasis = 'site' | 'focus';

export interface TechGroup {
  id: TechGroupId;
  label: string;
  blurb: string;
}

export interface Technology {
  id: string;
  name: string;
  group: TechGroupId;
  basis: TechBasis;
  /** One plain sentence: what it is here, and how it is used (or not). */
  note: string;
  /** Technologies it directly works with (rendered as neighbours in the universe). */
  pairsWith: string[];
}

export const basisLabel: Record<TechBasis, string> = {
  site: 'Used in this site',
  focus: 'Current focus',
};

export const techGroups: TechGroup[] = [
  { id: 'frontend', label: 'Frontend', blurb: 'Interface and application architecture.' },
  { id: 'backend', label: 'Backend', blurb: 'Server-side runtime and API layer.' },
  { id: 'database', label: 'Database', blurb: 'Data storage.' },
  { id: 'creative', label: 'Creative / Interactive', blurb: 'Motion, scroll and real-time 3D.' },
  { id: 'tooling', label: 'Tooling / Workflow', blurb: 'Build and deployment.' },
];

export const technologies: Technology[] = [
  // — Frontend —
  {
    id: 'react',
    name: 'React',
    group: 'frontend',
    basis: 'site',
    note: 'The whole interface: function components and hooks.',
    pairsWith: ['typescript', 'r3f', 'vite', 'express'],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    group: 'frontend',
    basis: 'site',
    note: 'Strict mode across the app and the typed content layer.',
    pairsWith: ['react', 'vite', 'node'],
  },
  {
    id: 'html-css',
    name: 'HTML & CSS',
    group: 'frontend',
    basis: 'site',
    note: 'Semantic landmarks and hand-written CSS built on design tokens.',
    pairsWith: ['react'],
  },

  // — Backend (MERN focus) —
  {
    id: 'node',
    name: 'Node.js',
    group: 'backend',
    basis: 'focus',
    note: 'The server-side runtime of the MERN stack. This site is a static front end and does not use it at runtime.',
    pairsWith: ['express', 'mongodb', 'typescript'],
  },
  {
    id: 'express',
    name: 'Express',
    group: 'backend',
    basis: 'focus',
    note: 'The API layer of the MERN stack, connecting a React client to the database. Not used by this site.',
    pairsWith: ['node', 'mongodb', 'react'],
  },

  // — Database (MERN focus) —
  {
    id: 'mongodb',
    name: 'MongoDB',
    group: 'database',
    basis: 'focus',
    note: 'The document database of the MERN stack. Not used by this site.',
    pairsWith: ['express', 'node'],
  },

  // — Creative / Interactive —
  {
    id: 'gsap',
    name: 'GSAP',
    group: 'creative',
    basis: 'site',
    note: 'Entrance and reveal animation, scoped and cleaned up per mount.',
    pairsWith: ['scrolltrigger', 'lenis'],
  },
  {
    id: 'scrolltrigger',
    name: 'ScrollTrigger',
    group: 'creative',
    basis: 'site',
    note: 'Maps page scroll to camera travel through the 3D scene.',
    pairsWith: ['gsap', 'lenis', 'threejs'],
  },
  {
    id: 'lenis',
    name: 'Lenis',
    group: 'creative',
    basis: 'site',
    note: 'Smooth scrolling, driven by the GSAP ticker so both share one clock.',
    pairsWith: ['gsap', 'scrolltrigger'],
  },
  {
    id: 'threejs',
    name: 'Three.js',
    group: 'creative',
    basis: 'site',
    note: 'The 3D engine behind the technology universe.',
    pairsWith: ['r3f', 'drei', 'scrolltrigger'],
  },
  {
    id: 'r3f',
    name: 'React Three Fiber',
    group: 'creative',
    basis: 'site',
    note: 'The scene is declarative React components rather than imperative Three.js.',
    pairsWith: ['threejs', 'react', 'drei'],
  },
  {
    id: 'drei',
    name: 'Drei',
    group: 'creative',
    basis: 'site',
    note: 'Scene helpers — used here for in-scene HTML labels.',
    pairsWith: ['r3f', 'threejs'],
  },

  // — Tooling / Workflow —
  {
    id: 'vite',
    name: 'Vite',
    group: 'tooling',
    basis: 'site',
    note: 'Dev server, bundling and code-splitting of the 3D scene.',
    pairsWith: ['react', 'typescript', 'github-actions'],
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    group: 'tooling',
    basis: 'site',
    note: 'deploy.yml checks the content and publishes the site on every push to main.',
    pairsWith: ['github-pages', 'vite'],
  },
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    group: 'tooling',
    basis: 'site',
    note: 'Hosts the production site.',
    pairsWith: ['github-actions'],
  },
];

export const techById = (id: string) => technologies.find((t) => t.id === id);
export const groupById = (id: TechGroupId) => techGroups.find((g) => g.id === id);

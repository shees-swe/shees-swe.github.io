/**
 * Identity. Only facts Muhammad supplied. No seniority, no years of experience,
 * no employers, no client work — none of that is claimed anywhere on the site.
 */
export const profile = {
  name: 'Muhammad Shees',
  first: 'Muhammad',
  last: 'Shees',
  role: 'Full-Stack Developer',
  location: 'Karachi, Pakistan',
  siteUrl: 'https://shees-swe.github.io/',

  /** Short scannable line under the role. */
  tagline: 'Full-stack · Creative frontend',

  /** Hero lede: direction and interest, stated as such — not as a track record. */
  lede: 'Full-stack developer with a strong interest in creative frontend work — interaction, motion and 3D.',

  about: [
    'I’m a full-stack developer based in Karachi, Pakistan, building web applications end to end — React frontends, Node.js APIs, and MongoDB and SQL databases. I completed the Advanced Diploma in Software Engineering (ADSE) at Aptech and I’m now studying for a BS in Software Engineering at the Virtual University of Pakistan.',
    'I’m also drawn to the creative end of the frontend: interaction, motion and real-time 3D. This site is where I practise it — the content is typed data, the interface reads from it, and the 3D map is generated from the same technology list.',
  ],
} as const;

/** Hero stack rows. `tech` holds technology ids from skills.ts. */
export const heroHighlights = [
  { label: 'Core stack', tech: ['mongodb', 'express', 'react', 'node'] },
  { label: 'Interactive', tech: ['typescript', 'gsap', 'threejs'] },
] as const;

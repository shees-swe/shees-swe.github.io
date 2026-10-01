/**
 * Projects.
 *
 * Intentionally EMPTY. Muhammad has no finished projects to present yet, and nothing
 * here is invented. The Projects section shows a designed "in progress" state while
 * this array is empty, and switches to real project cards the moment a project is added.
 *
 * To add one, push an object of this shape. `stack` holds technology ids from skills.ts.
 */

export interface Project {
  id: string;
  name: string;
  kind: string;
  year: string | null;
  summary: string;
  problem: string | null;
  solution: string | null;
  role: string | null;
  stack: string[];
  features: string[];
  /** Technical decisions — the "why", not the "what". */
  decisions: string[];
  challenges: string | null;
  outcome: string | null;
  liveUrl: string | null;
  sourceUrl: string | null;
}

export const projects: Project[] = [];

/** Copy for the empty state. */
export const projectsStatus = {
  label: 'In progress',
  heading: 'Selected work is on the way.',
  body: 'I’m building MERN applications, and each one will appear here once it’s finished — with the problem it solves, the approach, the technical decisions behind it and the outcome. Nothing is listed until it’s real.',
};

/** The structure every future project will follow — describes the format, not fake content. */
export const caseStudyFormat = [
  { label: 'Problem', text: 'What needed solving, and for whom.' },
  { label: 'Approach', text: 'How the solution was designed.' },
  { label: 'Stack', text: 'The technologies used, and why.' },
  { label: 'Decisions', text: 'The technical trade-offs behind it.' },
  { label: 'Outcome', text: 'What shipped and what I learned.' },
  { label: 'Links', text: 'Live demo and source code.' },
];

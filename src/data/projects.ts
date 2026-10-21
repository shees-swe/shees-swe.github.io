/**
 * Projects.
 *
 * EduPredict is the first project listed here. The Projects section renders real
 * project cards whenever this array is non-empty; the designed "in progress" empty
 * state below only shows while the array is empty.
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

export const projects: Project[] = [
  {
    id: 'edupredict',
    name: 'EduPredict',
    kind: 'Full-Stack Web Application',
    year: '2026',
    summary:
      'Student dropout risk and academic analytics platform. It predicts which students are at risk of dropping out and gives admins, teachers, analysts and students their own dashboards.',
    problem:
      'Institutes notice struggling students too late. Attendance and grade data sits in spreadsheets until a student has already disengaged or dropped out.',
    solution:
      'A role-based platform that ingests student records in bulk, scores dropout risk with a trained machine-learning model, raises real-time alerts, and visualizes cohort health — feature correlations, risk trends and side-by-side cohort comparison.',
    role: 'Sole developer — designed, built, secured and deployed end to end.',
    stack: ['react', 'vite', 'mongodb', 'github-actions'],
    features: [
      'ML dropout-risk predictions with real-time alerts (Server-Sent Events)',
      'Four role dashboards: Admin, Teacher, Analyst, Student',
      'Batch CSV ingest — 5,000 student records in a single upload',
      'In-app student record management (edit and delete with cascade)',
      'Pathway predictors: study field, university and next-semester GPA',
      'TOTP two-factor authentication and staff access scoping by school and class',
    ],
    decisions: [
      'Python (Flask) API with MongoDB, so student records with varying fields stay flexible',
      'Batch writes for ingestion after single-row upserts timed out on large uploads',
      'TOTP secrets and password-reset tokens encrypted at rest with a server-side key',
      'GitHub Actions CI running the backend tests and the production build on every pull request',
    ],
    challenges:
      'A 5,000-row CSV upload originally died on a 120-second server timeout because rows were written one by one; switching to ordered batch upserts fixed it. A full security audit (4 critical and 18 major findings) was then worked through fix by fix, including staff data scoping and encrypted secret storage.',
    outcome:
      'Live in production with a 5,000-student cohort loaded, 34 backend tests passing and CI green — shipped through 30 reviewed and merged pull requests.',
    liveUrl: 'https://edupredict-blue.vercel.app',
    sourceUrl: 'https://github.com/shees-swe/edupredict',
  },
];

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

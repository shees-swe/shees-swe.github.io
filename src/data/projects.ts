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
      'GitHub Actions CI running the backend tests and the production build',
    ],
    challenges:
      'A 5,000-row CSV upload originally died on a 120-second server timeout because rows were written one by one; switching to ordered batch upserts fixed it. A full security audit (4 critical and 18 major findings) was then worked through fix by fix, including staff data scoping and encrypted secret storage.',
    outcome:
      'Live in production with a 5,000-student cohort loaded, 34 backend tests passing and CI green.',
    liveUrl: 'https://edupredict-blue.vercel.app',
    sourceUrl: 'https://github.com/shees-swe/edupredict',
  },
  {
    id: 'eventsphere',
    name: 'EventSphere',
    kind: 'Full-Stack Web Application',
    year: '2026',
    summary:
      'Expo and trade show management platform. Organizers publish expos and interactive floor plans, exhibitors claim booths and manage staff and compliance documents, and attendees discover events, sessions and exhibitors.',
    problem:
      'Expos run on paper registers, spreadsheets and WhatsApp bookings — booths get promised to two exhibitors at once, and nobody has a live picture of the floor.',
    solution:
      'One platform with three role portals: organizers build the booth inventory and floor plan first, exhibitors claim booths atomically (first claim wins) through an organizer approval queue, and attendees browse a live directory, schedules and exhibitor profiles.',
    role: 'Sole developer — designed, built, secured and deployed end to end.',
    stack: ['react', 'vite', 'node', 'express', 'mongodb'],
    features: [
      'Atomic booth claiming with an organizer approval queue — no double-booking',
      'Interactive colour-coded floor plan: 50 booths per expo, live status',
      'Three role portals: Admin, Exhibitor, Attendee',
      'Compliance documents served privately — only the owner and admins can open them',
      'Live public directory: 10 real Pakistani expos, 500 booths, 140 exhibitors',
      'Sessions, workshops, tickets, staff management and exhibitor inquiries',
    ],
    decisions: [
      'Inventory-first booth model: organizers create the booths, exhibitors claim them — a claim is a single conditional update that only succeeds while the booth is unclaimed',
      'Public directory endpoints with a strict field allowlist, so the landing page shows real data without exposing exhibitor contact details',
      'Private document storage behind authenticated, ownership-checked downloads instead of public upload URLs',
    ],
    challenges:
      'A full security and correctness audit (44 findings) was worked through fix by fix — mass-assignment guards, role scoping, validation on every route — and a screen-by-screen QA pass over the live dashboards was closed out the same way, finding by finding.',
    outcome:
      'Live in production with 10 expos, 500 booths and 442 seeded accounts across the three roles — 39 backend test suites passing.',
    liveUrl: 'https://eventsphere-frontend-eight.vercel.app',
    sourceUrl: null,
  },
];

/** Copy for the empty state. */
export const projectsStatus = {
  label: 'In progress',
  heading: 'Selected work is on the way.',
  body: 'I’m building full-stack applications, and each one will appear here once it’s finished — with the problem it solves, the approach, the technical decisions behind it and the outcome. Nothing is listed until it’s real.',
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

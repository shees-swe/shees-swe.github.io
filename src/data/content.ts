/**
 * Real content, shared by all ten concepts so the comparison is about design.
 * Sourced from Muhammad's CV and the previous portfolio. Nothing invented:
 * no GitHub anywhere, no project URLs, LinkedIn exactly as given.
 */

export const profile = {
  name: 'Muhammad Shees',
  first: 'Muhammad',
  last: 'Shees',
  title: 'Full-Stack Web Developer',
  titleAlt: 'Full-Stack Web Developer / Software Developer',
  location: 'Islamabad, Pakistan',
  email: 'shees.swe@gmail.com',
  linkedin: 'https://www.linkedin.com/in/muhammad-shees-0815a5423/',
  linkedinLabel: 'linkedin.com/in/muhammad-shees-0815a5423',
  statement:
    'I build software organisations depend on. Currently consulting on software development at Welthungerhilfe, building FIRMS — the financial management and reporting system behind their budget control, fund requests and voucher workflows.',
  statementShort:
    'Full-stack web developer in Islamabad. Currently building FIRMS, the financial management system at Welthungerhilfe.',
  available: 'Consulting at Welthungerhilfe · Islamabad',
};

export interface Role {
  id: string;
  role: string;
  org: string;
  period: string;
  from: string;
  to: string;
  current?: boolean;
  kind: 'software' | 'operations';
  blurb: string;
  points: string[];
  tags: string[];
}

export const roles: Role[] = [
  {
    id: 'whh-consultant',
    role: 'Individual Consultant — Software Development',
    org: 'Welthungerhilfe (WHH)',
    period: 'Feb 2026 — Present',
    from: '2026',
    to: 'Now',
    current: true,
    kind: 'software',
    blurb: 'Building FIRMS, the financial management and reporting system used to run WHH’s financial operations.',
    points: [
      'Developing FIRMS across the organisation’s financial operations.',
      'Budget control, fund request and voucher management workflows.',
      'Reporting workflows that keep financial data organised and reviewable.',
    ],
    tags: ['Financial systems', 'Reporting', 'Software development'],
  },
  {
    id: 'whh-logistics',
    role: 'Logistics Intern',
    org: 'Welthungerhilfe (WHH)',
    period: 'Nov 2024 — Nov 2025',
    from: '2024',
    to: '2025',
    kind: 'operations',
    blurb: 'A year inside the operational side of an international NGO — the context that later informed the financial system.',
    points: [
      'Supported logistics operations at the Islamabad country office.',
      'Completed Welthungerhilfe logistics training workshops.',
    ],
    tags: ['Logistics operations'],
  },
  {
    id: 'aiodock',
    role: 'Junior Software Developer',
    org: 'AioDock (Private) Ltd.',
    period: 'Aug 2023 — Feb 2024',
    from: '2023',
    to: '2024',
    kind: 'software',
    blurb: 'First full-time engineering role — building and maintaining production software with the development team.',
    points: [
      'Contributed to development and maintenance of software applications.',
      'Architected, implemented and tested solutions with the team.',
      'Debugged defects and participated in code reviews.',
    ],
    tags: ['React.js', 'JavaScript', 'Material UI'],
  },
  {
    id: 'digital-applications',
    role: 'Frontend Web Developer Intern',
    org: 'Digital Applications',
    period: 'Aug 2022 — Oct 2022',
    from: '2022',
    to: '2022',
    kind: 'software',
    blurb: 'Where the professional work started — building and improving client-facing web interfaces.',
    points: [
      'Developed web applications with HTML, CSS, JavaScript and React.js.',
      'Implemented responsive, user-friendly interfaces with the team.',
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'React.js'],
  },
];

export const education = {
  degree: 'BS Computer Science',
  org: 'SZABIST, Islamabad',
  period: '2019 — 2023',
  result: 'CGPA 3.22 / 4.00',
};

export type Level = 'primary' | 'proficient' | 'working' | 'beginner';

export const levelLabel: Record<Level, string> = {
  primary: 'Primary',
  proficient: 'Proficient',
  working: 'Working',
  beginner: 'Beginner',
};

export interface Skill {
  name: string;
  level: Level;
  group: string;
}

/** Levels straight from the CV — beginner stays beginner. */
export const skills: Skill[] = [
  { name: 'Android', level: 'primary', group: 'Frontend' },
  { name: 'JavaScript', level: 'primary', group: 'Frontend' },
  { name: 'HTML5', level: 'primary', group: 'Frontend' },
  { name: 'CSS3', level: 'primary', group: 'Frontend' },
  { name: 'TypeScript', level: 'proficient', group: 'Frontend' },
  { name: 'Redux', level: 'proficient', group: 'Frontend' },
  { name: 'Material UI', level: 'proficient', group: 'Frontend' },
  { name: 'Bootstrap', level: 'proficient', group: 'Frontend' },
  { name: 'Node.js', level: 'beginner', group: 'Backend' },
  { name: 'Express.js', level: 'beginner', group: 'Backend' },
  { name: 'Firebase', level: 'working', group: 'Data' },
  { name: 'PostgreSQL', level: 'beginner', group: 'Data' },
  { name: 'MySQL', level: 'beginner', group: 'Data' },
  { name: 'Java', level: 'working', group: 'Applications' },
  { name: 'React.js', level: 'working', group: 'Applications' },
  { name: 'Python', level: 'working', group: 'Applications' },
  { name: 'C++', level: 'working', group: 'Applications' },
  { name: 'Unity 3D', level: 'working', group: 'Applications' },
  { name: 'C#', level: 'working', group: 'Applications' },
];

export const skillGroups = ['Frontend', 'Backend', 'Data', 'Applications'];

export interface Project {
  id: string;
  name: string;
  kind: string;
  year: string;
  blurb: string;
  detail: string;
  stack: string[];
  /** Absent where no screenshot exists — concepts draw a diagram instead. */
  image?: string;
  accentPair: [string, string];
}

export const projects: Project[] = [];

export const stats = [
  { value: '04', label: 'Engagements' },
  { value: '12', label: 'Projects' },
  { value: '2023', label: 'BSCS, SZABIST' },
];

export const navSections = ['Home', 'About', 'Experience', 'Skills', 'Work', 'Contact'];

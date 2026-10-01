/**
 * Education — only what Muhammad supplied. Dates are unknown, so none are shown.
 * Private institutional details are never included.
 */
export interface EducationEntry {
  id: string;
  credential: string;
  institution: string;
  /** 'current' renders a "Currently studying" tag. */
  status: 'current' | null;
}

export const education: EducationEntry[] = [
  {
    id: 'aptech-adse',
    credential: 'Advanced Diploma in Software Engineering (ADSE)',
    institution: 'Aptech',
    status: null,
  },
  {
    id: 'vu-bsse',
    credential: 'Bachelor of Science in Software Engineering',
    institution: 'Virtual University of Pakistan',
    status: 'current',
  },
];

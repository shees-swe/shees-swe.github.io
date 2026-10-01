export { profile, heroHighlights } from './profile';
export { projects, projectsStatus, caseStudyFormat, type Project } from './projects';
export {
  technologies,
  techGroups,
  basisLabel,
  techById,
  groupById,
  type Technology,
  type TechGroup,
  type TechGroupId,
  type TechBasis,
} from './skills';
export { education, type EducationEntry } from './education';
export { contactChannels, links, type ContactChannel } from './links';

export const navSections = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'universe', label: 'Universe' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;

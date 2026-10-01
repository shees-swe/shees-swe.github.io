export interface ContactChannel {
  id: 'email' | 'linkedin' | 'github';
  label: string;
  href: string;
  /** Clean label shown instead of the raw URL. */
  display: string;
  /** Screen-reader name for the link. */
  aria: string;
}

export const links = {
  email: {
    id: 'email',
    label: 'Email',
    href: 'mailto:shees.swe@gmail.com',
    display: 'shees.swe@gmail.com',
    aria: 'Email Muhammad Shees',
  },
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/muhammad-shees-0815a5423/',
    display: 'Muhammad Shees',
    aria: 'Muhammad Shees on LinkedIn',
  },
  github: {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/shees-swe',
    display: 'shees-swe',
    aria: 'shees-swe on GitHub',
  },
} satisfies Record<string, ContactChannel>;

export const contactChannels: ContactChannel[] = [links.email, links.github, links.linkedin];

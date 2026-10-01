import type { ReactNode } from 'react';

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

/**
 * Link to somewhere else. http(s) links open in a new tab with `noopener noreferrer`
 * and announce that to screen readers; mailto: links stay in-page.
 */
export default function OutboundLink({ href, children, className, 'aria-label': ariaLabel }: Props) {
  const external = /^https?:/i.test(href);
  return (
    <a
      className={className}
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

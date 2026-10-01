import OutboundLink from './OutboundLink';
import { links, profile } from '../data';
import { scrollToId } from '../lib/motion';
import type { MouseEvent } from 'react';

export default function Footer() {
  const top = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToId('top');
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__id">
          <span className="meta">{profile.name}</span>
          <span className="footer__loc">{profile.location}</span>
        </p>
        <p className="footer__built">
          Built with React · Three.js · GSAP — content is typed data, the 3D map is generated from it.
        </p>
        <div className="footer__links">
          <OutboundLink href={links.github.href} aria-label={links.github.aria}>
            GitHub ↗
          </OutboundLink>
          <OutboundLink href={links.linkedin.href} aria-label={links.linkedin.aria}>
            LinkedIn ↗
          </OutboundLink>
          <a href="#top" onClick={top}>
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

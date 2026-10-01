import type { MouseEvent } from 'react';
import OutboundLink from '../components/OutboundLink';
import { heroHighlights, links, profile, techById } from '../data';
import { scrollToId, useMagnetic } from '../lib/motion';

export default function Hero() {
  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToId(id);
  };

  const magnetic = useMagnetic<HTMLAnchorElement>();

  return (
    <section id="top" className="hero" tabIndex={-1} aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__body" data-hero>
        <p className="hero__status">
          <span className="pulse" aria-hidden="true" />
          Open to opportunities
        </p>
        <p className="eyebrow">{profile.location}</p>
        <h1 id="hero-title" aria-label={`${profile.name} — ${profile.role}`}>
          <span className="hero__name" aria-hidden="true">
            {profile.name.split('').map((ch, i) => (
              <span key={i} className="hero__char">
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </span>
          <span className="hero__role">{profile.role}</span>
        </h1>
        <p className="hero__tagline">{profile.tagline}</p>
        <p className="hero__lede">{profile.lede}</p>

        <div className="stackrows">
          {heroHighlights.map((row) => (
            <div key={row.label} className="stackrow">
              <span className="meta">{row.label}</span>
              <ul className="chips" aria-label={row.label}>
                {row.tech.map((id) => (
                  <li key={id}>{techById(id)?.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hero__actions">
          <a ref={magnetic} className="btn btn--primary" href="#contact" onClick={go('contact')}>
            Get in touch
          </a>
          <a className="btn" href="#universe" onClick={go('universe')}>
            Explore the stack
          </a>
          <OutboundLink className="hero__link" href={links.github.href} aria-label={links.github.aria}>
            GitHub ↗
          </OutboundLink>
          <OutboundLink className="hero__link" href={links.linkedin.href} aria-label={links.linkedin.aria}>
            LinkedIn ↗
          </OutboundLink>
        </div>
      </div>
    </section>
  );
}

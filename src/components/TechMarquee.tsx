import { technologies } from '../data';

/**
 * An infinite mono ticker of the technology registry, placed between the hero
 * and the about section. Decorative: the same list is fully readable in the
 * Expertise and Universe sections, so this is hidden from assistive tech.
 */
export default function TechMarquee() {
  const names = technologies.map((t) => t.name);
  const row = [...names, ...names];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {row.map((name, i) => (
          <span key={i} className="marquee__item">
            {name}
            <i className="marquee__dot">✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

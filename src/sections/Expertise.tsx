import { basisLabel, techGroups, technologies } from '../data';

export default function Expertise() {
  return (
    <section id="expertise" className="section" tabIndex={-1} aria-labelledby="expertise-title">
      <div className="panel" data-reveal>
        <p className="eyebrow">Technical expertise</p>
        <h2 id="expertise-title">The stack, and where it shows up</h2>
        <p className="lede">
          My direction is MERN. Each technology is marked by whether this site actually uses it or
          whether it is my current focus. No percentages, no self-ratings.
        </p>

        <div className="groups">
          {techGroups.map((g) => (
            <section key={g.id} className="group" aria-labelledby={`grp-${g.id}`}>
              <h3 id={`grp-${g.id}`}>{g.label}</h3>
              <p className="meta">{g.blurb}</p>
              <ul>
                {technologies
                  .filter((t) => t.group === g.id)
                  .map((t) => (
                    <li key={t.id}>
                      <span className="group__name">
                        <strong>{t.name}</strong>
                        <span className={`tag tag--${t.basis}`}>{basisLabel[t.basis]}</span>
                      </span>
                      <span>{t.note}</span>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

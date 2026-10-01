import { education } from '../data';

export default function Education() {
  return (
    <section id="education" className="section" tabIndex={-1} aria-labelledby="education-title">
      <div className="panel" data-reveal>
        <p className="eyebrow">Education</p>
        <h2 id="education-title">Where I studied</h2>
        <ul className="edu">
          {education.map((e) => (
            <li key={e.id}>
              <h3>{e.credential}</h3>
              <p>{e.institution}</p>
              {e.status === 'current' && <p className="meta">Currently studying</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

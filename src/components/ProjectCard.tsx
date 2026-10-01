import { techById, type Project } from '../data';
import OutboundLink from './OutboundLink';

interface Props {
  project: Project;
  onHover: (id: string | null) => void;
}

/** Case-study card. Unused until a real project is added to src/data/projects.ts. */
export default function ProjectCard({ project: p, onHover }: Props) {
  return (
    <article
      className="project"
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(p.id)}
      onBlur={() => onHover(null)}
    >
      <header className="project__head">
        <h3>{p.name}</h3>
        <p className="meta">
          {p.kind}
          {p.year ? ` · ${p.year}` : ''}
        </p>
      </header>

      <p className="project__summary">{p.summary}</p>

      <dl className="project__facts">
        {p.problem && (
          <div>
            <dt>Problem</dt>
            <dd>{p.problem}</dd>
          </div>
        )}
        {p.solution && (
          <div>
            <dt>Approach</dt>
            <dd>{p.solution}</dd>
          </div>
        )}
        {p.role && (
          <div>
            <dt>Role</dt>
            <dd>{p.role}</dd>
          </div>
        )}
      </dl>

      {p.decisions.length > 0 && (
        <>
          <h4>Technical decisions</h4>
          <ul className="bullets">
            {p.decisions.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </>
      )}

      {p.features.length > 0 && (
        <>
          <h4>Key features</h4>
          <ul className="bullets">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </>
      )}

      {p.challenges && (
        <>
          <h4>Challenges</h4>
          <p className="project__text">{p.challenges}</p>
        </>
      )}
      {p.outcome && (
        <>
          <h4>Outcome</h4>
          <p className="project__text">{p.outcome}</p>
        </>
      )}

      <ul className="chips" aria-label={`${p.name} stack`}>
        {p.stack.map((id) => (
          <li key={id}>{techById(id)?.name ?? id}</li>
        ))}
      </ul>

      {(p.liveUrl || p.sourceUrl) && (
        <p className="project__links">
          {p.liveUrl && <OutboundLink href={p.liveUrl}>Live site ↗</OutboundLink>}
          {p.sourceUrl && <OutboundLink href={p.sourceUrl}>Source ↗</OutboundLink>}
        </p>
      )}
    </article>
  );
}

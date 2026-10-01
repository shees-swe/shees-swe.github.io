import { caseStudyFormat, links, projectsStatus } from '../data';
import OutboundLink from './OutboundLink';

/**
 * Shown while `projects` is empty. It is a designed state, not a placeholder:
 * it says plainly that work is in progress and shows the format every project will follow.
 * Nothing here pretends to be a project.
 */
export default function ProjectsEmpty() {
  return (
    <div className="empty">
      <div className="empty__lead">
        <p className="status">
          <span className="status__dot" aria-hidden="true" />
          {projectsStatus.label}
        </p>
        <h3 className="empty__title">{projectsStatus.heading}</h3>
        <p className="lede">{projectsStatus.body}</p>
        <OutboundLink className="btn" href={links.github.href}>
          Follow progress on GitHub ↗
        </OutboundLink>
      </div>

      <div className="empty__format">
        <h3 className="meta">How each project will be presented</h3>
        <ol>
          {caseStudyFormat.map((f, i) => (
            <li key={f.label}>
              <span className="num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="empty__step">
                <strong>{f.label}</strong>
                <span>{f.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

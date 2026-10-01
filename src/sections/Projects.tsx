import ProjectCard from '../components/ProjectCard';
import ProjectsEmpty from '../components/ProjectsEmpty';
import { projects } from '../data';

interface Props {
  onHoverProject: (id: string | null) => void;
}

export default function Projects({ onHoverProject }: Props) {
  return (
    <section id="projects" className="section" tabIndex={-1} aria-labelledby="projects-title">
      <div className="panel" data-reveal>
        <p className="eyebrow">Selected work</p>
        <h2 id="projects-title">Projects</h2>

        {projects.length === 0 ? (
          <ProjectsEmpty />
        ) : (
          <div className="projects">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onHover={onHoverProject} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

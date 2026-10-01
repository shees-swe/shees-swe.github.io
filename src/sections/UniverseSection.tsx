import { basisLabel, groupById, projects, techById, techGroups, technologies } from '../data';

interface Props {
  /** Callback ref: the section is the pointer-event source for the 3D scene. */
  stageRef: (el: HTMLElement | null) => void;
  activeId: string | null;
  selectedId: string | null;
  onPreview: (id: string | null) => void;
  onSelect: (id: string) => void;
}

/**
 * The accessible face of the 3D universe. Everything the scene can show —
 * inspecting a technology and seeing what it works with — is reachable here
 * with a keyboard, a screen reader or a touch screen.
 */
export default function UniverseSection({ stageRef, activeId, selectedId, onPreview, onSelect }: Props) {
  const active = activeId ? techById(activeId) : undefined;
  const usedIn = active ? projects.filter((p) => p.stack.includes(active.id)) : [];
  const partners = active
    ? technologies.filter(
        (t) => t.id !== active.id && (active.pairsWith.includes(t.id) || t.pairsWith.includes(active.id)),
      )
    : [];

  return (
    <section
      id="universe"
      ref={stageRef}
      className="section universe"
      tabIndex={-1}
      aria-labelledby="universe-title"
    >
      <div className="universe__intro panel" data-reveal>
        <p className="eyebrow">Technology universe</p>
        <h2 id="universe-title">A map of the stack</h2>
        <p className="lede">
          {technologies.length} technologies on {techGroups.length} shells, generated from the same list
          as the section above. Move over a node, tap it, or pick one here to see what it works with.
        </p>

        <p className="legend" aria-label="Legend">
          <span>
            <i className="dot dot--solid" aria-hidden="true" /> Used in this site
          </span>
          <span>
            <i className="dot dot--outline" aria-hidden="true" /> Current focus
          </span>
        </p>

        {techGroups.map((g) => (
          <div key={g.id} className="picker">
            <h3 className="meta">{g.label}</h3>
            <ul>
              {technologies
                .filter((t) => t.group === g.id)
                .map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      className={t.basis === 'focus' ? 'is-focus' : undefined}
                      aria-pressed={selectedId === t.id}
                      onMouseEnter={() => onPreview(t.id)}
                      onMouseLeave={() => onPreview(null)}
                      onFocus={() => onPreview(t.id)}
                      onBlur={() => onPreview(null)}
                      onClick={() => onSelect(t.id)}
                    >
                      {t.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <aside className="universe__inspector panel" data-reveal aria-live="polite" aria-label="Inspector">
        <p className="eyebrow">Inspector</p>
        {active ? (
          <>
            <h3>{active.name}</h3>
            <p className="meta">
              {groupById(active.group)?.label} · {basisLabel[active.basis]}
            </p>
            <p>{active.note}</p>
            {partners.length > 0 && (
              <p>
                <span className="meta">Works with</span>
                <br />
                {partners.map((t) => t.name).join(' · ')}
              </p>
            )}
            {projects.length > 0 && (
              <p>
                <span className="meta">Used in</span>
                <br />
                {usedIn.length ? usedIn.map((p) => p.name).join(' · ') : 'No listed project yet.'}
              </p>
            )}
          </>
        ) : (
          <>
            <h3>The core</h3>
            <p className="meta">Muhammad Shees</p>
            <p>Select a technology to inspect it. Related technologies stay lit; the rest fade back.</p>
          </>
        )}
      </aside>
    </section>
  );
}

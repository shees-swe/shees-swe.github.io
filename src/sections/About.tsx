import { profile } from '../data';

export default function About() {
  return (
    <section id="about" className="section" tabIndex={-1} aria-labelledby="about-title">
      <div className="panel" data-reveal>
        <p className="eyebrow">About</p>
        <h2 id="about-title">Developer identity</h2>
        <div className="prose">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

import OutboundLink from '../components/OutboundLink';
import { contactChannels, links, profile } from '../data';

export default function Contact() {
  const others = contactChannels.filter((c) => c.id !== 'email');

  return (
    <section id="contact" className="section section--last" tabIndex={-1} aria-labelledby="contact-title">
      <div className="panel" data-reveal>
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title">Get in touch</h2>
        <p className="lede">
          I’m based in {profile.location}. Email is the quickest way to reach me — my inbox is open.
        </p>

        <OutboundLink
          className="contact__giant"
          href={links.email.href}
          aria-label={links.email.aria}
        >
          <span aria-hidden="true">→</span> {links.email.display}
        </OutboundLink>

        <ul className="contact">
          {others.map((c) => (
            <li key={c.id}>
              <OutboundLink className="contact__row" href={c.href} aria-label={c.aria}>
                <span className="meta">{c.label}</span>
                <span className="contact__value">{c.display}</span>
                <span className="contact__arrow" aria-hidden="true">
                  ↗
                </span>
              </OutboundLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { navSections, profile } from '../data';
import { pauseScroll, resumeScroll, scrollToId } from '../lib/motion';

/**
 * Desktop: inline links. Mobile: a "Menu" button opening a full-screen native <dialog>.
 * showModal() gives us, with no dependency: a focus trap, Escape-to-close, an inert page
 * behind it, and focus restoration to the button. We add scroll locking (Lenis + overflow).
 */
export default function SiteNav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const openMenu = () => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    d.showModal();
    pauseScroll();
    setOpen(true);
  };

  const closeMenu = useCallback(() => {
    const d = dialogRef.current;
    if (d?.open) d.close();
  }, []);

  // Fires for Escape, the close button and programmatic close() alike.
  const onDialogClose = () => {
    setOpen(false);
    resumeScroll();
  };

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    return () => document.documentElement.classList.remove('menu-open');
  }, [open]);

  // If the viewport grows past the mobile breakpoint while the menu is open, close it.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 721px)');
    const onChange = () => mq.matches && closeMenu();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [closeMenu]);

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToId(id);
  };

  const goFromMenu = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMenu();
    resumeScroll(); // Lenis ignores scrollTo() while stopped, so release it first
    scrollToId(id);
  };

  return (
    <header className="site-nav">
      <span className="nav-progress" aria-hidden="true" />
      <a className="site-nav__id" href="#top" onClick={go('top')}>
        {profile.name}
      </a>

      <nav className="site-nav__links" aria-label="Primary">
        <ul>
          {navSections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={go(s.id)}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="site-nav__menu-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={openMenu}
      >
        Menu
      </button>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        className="menu"
        aria-label="Site menu"
        onClose={onDialogClose}
      >
        <div className="menu__inner">
          <div className="menu__top">
            <span className="site-nav__id">{profile.name}</span>
            <button type="button" className="site-nav__menu-btn" onClick={closeMenu}>
              Close
            </button>
          </div>
          <nav aria-label="Mobile">
            <ul className="menu__list">
              {navSections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={goFromMenu(s.id)}>
                    <span className="num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </header>
  );
}

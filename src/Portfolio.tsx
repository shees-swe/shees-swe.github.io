import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import SiteNav from './components/SiteNav';
import CursorGlow from './components/CursorGlow';
import Footer from './components/Footer';
import TechMarquee from './components/TechMarquee';
import About from './sections/About';
import Contact from './sections/Contact';
import Education from './sections/Education';
import Expertise from './sections/Expertise';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import UniverseSection from './sections/UniverseSection';
import { projects } from './data';
import { gsap, isCompact, reducedMotion, ScrollTrigger, useLenis, usePageScope, useSceneFocus } from './lib/motion';
import SceneBoundary from './universe/SceneBoundary';
import { buildNodes, litFor } from './universe/model';

// The 3D scene (three + fiber + drei) is the heaviest code on the site. Loading it
// lazily lets all text content paint first and keeps it out of the initial bundle.
const UniverseScene = lazy(() => import('./universe/UniverseScene'));

export default function Portfolio() {
  const nodes = useMemo(buildNodes, []);
  const progress = useRef(0);
  const compact = useMemo(isCompact, []);
  const reduced = useMemo(reducedMotion, []);

  const [stageEl, setStageEl] = useState<HTMLElement | null>(null);
  const [hoverTech, setHoverTech] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [hoverProject, setHoverProject] = useState<string | null>(null);
  /**
   * The WebGL loop advances while the hero or the universe section is on screen
   * — the two places where the 3D backdrop is the focus and the tech nodes must
   * keep orbiting. Everywhere else the scene rests on a static frame so the GPU
   * idles and scrolling stays smooth. (The scene is a fixed fullscreen backdrop,
   * so gating the loop on the universe section alone froze the orbit animation
   * behind the hero.)
   */
  const [backdropActive, setBackdropActive] = useState(false);
  /**
   * The 3D scene (three + fiber + drei, ~925KB) only starts downloading when the
   * browser is idle or once the universe section is actually on screen and the
   * scroll has settled. Downloading + parsing ~1MB of JS mid-scroll is what
   * froze the page while scrolling down, so the scene never loads 1200px early
   * or on a forced timer while the user is flicking through the page.
   */
  const [sceneAllowed, setSceneAllowed] = useState(false);

  useLenis();

  useEffect(() => {
    const el = document.getElementById('universe');
    if (!el) return;

    let allowed = false;
    const allow = () => {
      if (allowed) return;
      allowed = true;
      setSceneAllowed(true);
    };

    // One observer drives three things: the render loop (while the hero or the
    // universe section — the two places the 3D backdrop is the focus — is
    // visible) and scene loading (once the universe section is visible, after
    // the scroll settles).
    let settleId: number | undefined;
    const visibleSections = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.add(entry.target.id);
          else visibleSections.delete(entry.target.id);
        });
        setBackdropActive(visibleSections.size > 0);
        const universeHere = visibleSections.has('universe');
        if (universeHere) {
          if (!allowed && settleId === undefined) settleId = window.setTimeout(allow, 800);
        } else if (settleId !== undefined) {
          window.clearTimeout(settleId);
          settleId = undefined;
        }
      },
      { threshold: 0 },
    );
    const top = document.getElementById('top');
    if (top) io.observe(top);
    io.observe(el);

    // Otherwise wait until the browser is idle — the safest moment to parse.
    // The long timeout is only a backstop for a main thread that never idles.
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let fallbackId: number | undefined;
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(allow, { timeout: 12000 });
    } else {
      // Safari and older browsers have no idle callbacks.
      fallbackId = window.setTimeout(allow, 6000);
    }

    return () => {
      io.disconnect();
      if (settleId !== undefined) window.clearTimeout(settleId);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (fallbackId !== undefined) window.clearTimeout(fallbackId);
    };
  }, []);

  // Hover/focus previews; a click or tap pins the selection so touch users can inspect too.
  const activeId = hoverTech ?? selectedTech;

  const lit = useMemo(() => {
    if (activeId) return litFor(activeId);
    if (hoverProject) return new Set(projects.find((p) => p.id === hoverProject)?.stack ?? []);
    return new Set<string>();
  }, [activeId, hoverProject]);

  const root = usePageScope(() => {
    // Scroll drives camera travel through the scene.
    ScrollTrigger.create({
      trigger: '.site',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    // Scroll progress bar in the nav.
    gsap.fromTo(
      '.nav-progress',
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.site', start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      },
    );

    // Hero: the name rises character by character, then the rest follows.
    gsap.from('.hero__char', {
      yPercent: 115,
      duration: 0.9,
      stagger: 0.032,
      ease: 'power4.out',
    });
    gsap.from('.hero__role', {
      opacity: 0,
      y: 18,
      duration: 0.8,
      delay: 0.45,
      ease: 'power3.out',
    });
    gsap.from('[data-hero] > *:not(h1)', {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.08,
      delay: 0.25,
      ease: 'power3.out',
    });

    // Reveal once and stay — content never re-hides when scrolling back up.
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    // Eyebrow rule lines draw in as each section arrives.
    gsap.utils.toArray<HTMLElement>('.eyebrow').forEach((el) => {
      gsap.fromTo(
        el,
        { '--rule-scale': 0 },
        {
          '--rule-scale': 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
    });
  });

  useSceneFocus(root, ['top', 'universe']);

  return (
    <div className="site" ref={root} data-scene="ambient">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <CursorGlow />

      <div className="scene" aria-hidden="true">
        <SceneBoundary>
          <Suspense fallback={null}>
            {stageEl && sceneAllowed && (
              <UniverseScene
                nodes={nodes}
                lit={lit}
                activeId={activeId}
                onHover={setHoverTech}
                onSelect={(id) => setSelectedTech((cur) => (cur === id ? null : id))}
                progress={progress}
                compact={compact}
                reduced={reduced}
                active={backdropActive}
                eventSource={stageEl}
              />
            )}
          </Suspense>
        </SceneBoundary>
      </div>

      <SiteNav />

      <main id="main" tabIndex={-1}>
        <Hero />
        <TechMarquee />
        <About />
        <Projects onHoverProject={setHoverProject} />
        <Expertise />
        <UniverseSection
          stageRef={setStageEl}
          activeId={activeId}
          selectedId={selectedTech}
          onPreview={setHoverTech}
          onSelect={(id) => setSelectedTech((cur) => (cur === id ? null : id))}
        />
        <Education />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

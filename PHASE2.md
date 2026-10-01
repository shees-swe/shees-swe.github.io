# Phase 2 report

Read this first: **`npm install`, the real `npm run typecheck`, and the real `vite build` were NOT run.**
The sandbox's network allowlist blocks every package host (`x-deny-reason: host_not_allowed` from
registry.npmjs.org, yarnpkg, jsdelivr, unpkg, esm.sh, github, pypi). That is an **environment failure, not a
project failure**. Everything below states exactly what was and was not verified.

## Verification (actual results)

| Check | Result |
|---|---|
| **INSTALL** (`npm install`) | ✘ **Not run** — registry blocked (403 host_not_allowed). Lockfile not regenerated. |
| **TYPECHECK** (`npm run typecheck`) | ✘ **Not run.** Substitute: all 24 `src/**/*.ts(x)` files checked with `tsc` 6.0.3 at `--strict --noUnusedLocals --noUnusedParameters` against hand-written type shims for React/GSAP/Lenis/Three/R3F. **Passes (exit 0).** A deliberately injected typo was caught, so the checker is live. Third-party API usage is *not* type-verified. |
| **CONTENT GUARD** (`npm run check:content`) | ✔ **Run, passes.** Verified it fails (exit 1) on `Islamabad`, `Senior Developer`, `3 years of experience`, `Student ID …`. |
| **BUILD** (`vite build`) | ✘ **Not run.** Substitute: the real `src/` bundled with esbuild + real React 19.2.5 (compiles, code-splits). Not a Vite build. |
| **BROWSER — desktop 1440px** | ✔ Real Chromium, **partial harness** (see below). |
| **BROWSER — mobile 390px** | ✔ Same. |
| **ACCESSIBILITY** | ✔ Landmarks, heading order, skip link, Tab order, focus ring, focus trap, Escape, contrast (all 32 text styles ≥ 4.5:1), 12px text floor, 44px touch targets, link safety. Not run: a screen reader, axe-core. |
| **REDUCED MOTION** | ✔ Chromium `reducedMotion: reduce`: Lenis not created, animation setup skipped, content visible, transitions collapsed, nav + inspector still work. |
| **CONSOLE / RUNTIME** | ✔ Zero errors, warnings or failed requests on desktop, mobile and reduced-motion (harness). |

**Harness result: 68 / 68 checks pass** (scripted Playwright + Chromium, run outside the repo).

### What the harness is, and is not
It bundles the *real* app code and drives it in real Chromium, but **GSAP, ScrollTrigger, Lenis and the R3F scene
are stubs** (not installed, not downloadable). Consequently these are **UNVERIFIED**:
- the actual 3D scene: rendering, node hover/click, the hover fix, outline nodes, labels, frame rate, mobile GPU load
- real GSAP entrance/reveal animation and real Lenis smoothing
- real web fonts (Space Grotesk / IBM Plex Mono are unreachable offline; fallback fonts were used, so text widths differ slightly)
- a real device, real touch scrolling, real Safari/Firefox (Chromium only)

## 1. Identity
Only the supplied identity is present: Muhammad Shees · Karachi, Pakistan · ADSE (Aptech) · BS Software Engineering,
Virtual University of Pakistan (current) · GitHub `shees-swe` · LinkedIn `muhammad-shees-0815a5423` ·
`shees.swe@gmail.com`. All are wired into the site, JSON-LD (`sameAs`, `email`) and the no-JS fallback.
No dates, student IDs or private details. OG image regenerated. The content guard now also blocks private-identifier
patterns and unsupported claims (seniority words, "N years").

## 2. Positioning
"Full-Stack Developer" in the `<h1>`; "MERN-focused · Creative frontend" beneath. Copy states **direction and interest**
("focused on the MERN stack", "I enjoy working with…"), never a track record. No Senior/Expert/Lead, no years.
Each technology is tagged **Used in this site** (verifiable in this repo) or **Current focus** (Node.js, Express,
MongoDB — your stated direction, *not* demonstrated by this static site, and the UI says so). In the 3D universe,
"current focus" nodes render as outlines and "used" nodes as solids.

## 3. Projects
**No fake projects or experience were added.** `projects` is `[]`. The section shows a designed in-progress state
(status marker, honest copy, GitHub link, and the six-part case-study format as an outline — a description of the
format, not sample content). The schema and `ProjectCard` are ready; a throwaway fixture (harness-only, not in the
repo) proved a card renders, wraps long strings on mobile, and uses safe links.

## 4. Architecture
Preserved: `data/ sections/ components/ universe/ lib/`, lazy 3D scene, centralized motion, typed relationships,
accessible alternative to the canvas, reduced-motion and compact-device modes. Changes: 3 → **15** technologies /
3 → **5** shells (Frontend, Backend, Database, Creative/Interactive, Tooling) generated from one registry;
`ProjectCard`, `ProjectsEmpty`, `OutboundLink` extracted; dead code removed (`Placeholder`, `config.ts`,
`pendingGroups`).

## 5. UI foundation — Tailwind / shadcn / Radix: **not adopted this pass**
Stated plainly, two reasons: (1) they **cannot be installed or built here** (Tailwind v4, the shadcn CLI and Radix all
need the blocked registry), so adding them would ship unverified code into a working site; (2) the one real
primitive need — an accessible modal mobile menu — is fully covered by the native `<dialog>` element
(`showModal()`): focus trap, Escape, inert background, focus restoration, all **tested in Chromium**, zero
dependencies. There are no forms, tooltips, tabs or accordions that need a library. This falls short of the
"introduce Tailwind/shadcn/Radix" goal; if you want them anyway, do it locally where I can't (steps below).

## 6. Dependency resolution
`@react-three/fiber@9.7.0` declares `react/react-dom >=19 <19.3`; the project had `19.3.0`. Read from
`package-lock.json` metadata: drei 10.7.8 needs `react ^19`; lenis `>=17`; plugin-react needs `vite ^8`. Decision:
**keep R3F 9.7.0, pin `react` and `react-dom` to `~19.2.5`** (>=19.2.5 <19.3.0). Checked with `semver`: satisfies every
peer range; the old 19.3.0 does not. I could not check whether a newer fiber supports 19.3.
**Not done, because it can't be done here:** the lockfile is **not regenerated** (still records 19.3.0) and CI **still
uses `npm install --legacy-peer-deps`** — switching to `npm ci` against a stale lockfile would break the deploy.

## 8. Remaining work (genuine)
1. **Regenerate the lockfile and confirm a clean install** — `rm -rf node_modules package-lock.json && npm install`
   (must show no ERESOLVE/peer warnings), then `npm run typecheck && npm run build`, commit the lockfile, then change CI to
   `npm ci`. If `npm install` reports another conflict, the pin decision needs revisiting.
2. **Look at the real 3D scene** in a browser: node hover/click (the event-source fix), outline vs solid nodes, label
   density, and smoothness on a real phone. This is the biggest thing I could not verify.
3. Optional: Tailwind + shadcn/Radix, if you want them for future work (e.g. a project-detail dialog). Use the
   PostCSS plugin (`@tailwindcss/postcss`) rather than the Vite plugin to avoid another Vite-8 peer question.
4. Self-host the fonts; pause the WebGL loop when the scene is not the focus (not done — no evidence it's needed).
5. Add real projects to `src/data/projects.ts` when finished.

## Bugs found and fixed during verification
- Mobile menu links rendered as a clipped horizontal strip (CSS specificity leak from the desktop nav) — caught only by
  screenshot, then guarded with a layout assertion.
- Project cards widened the page on mobile with a long unbroken string.
- Mobile Universe: tapping a technology showed its result ~1000px off-screen → inspector now sticks to the viewport.
- Hero name wrapped; nav text showed through the fading header; 20px-tall nav link; 11.5px tags; a dead backdrop-click handler.

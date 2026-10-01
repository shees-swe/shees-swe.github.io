# Portfolio audit — Muhammad Shees

> **Superseded in part by [`PHASE2.md`](PHASE2.md)** — the data, MERN positioning, mobile menu and dependency decisions below were updated in Phase 2. This file is kept as the original audit record.

Audit of the repository as received, followed by what has been implemented and what remains.
Findings come from reading the code. Nothing was run in a browser, and the sandbox had no npm
access, so **no build was executed** — see "Verification status" at the end.

Priority tags: **CRITICAL** must fix · **HIGH** strongly improves the site · **ENH** useful, not essential.

---

## 1. Current state (before changes)

**Architecture.** Vite + React 19 + TypeScript. The whole site was one 376-line component
(`C08Universe.tsx`) mixing data wiring, the 3D scene, the page layout and animation setup. `motion.ts`
still carried "ten concepts" scaffolding (`useConceptScope`, `.concept-root`, unused `splitWords` /
`splitChars`). Content lived in one file, `content.ts`.

**Dependencies.** react/react-dom 19.3.0, three 0.186, @react-three/fiber 9.7.0, drei 10.7.8,
gsap 3.15, lenis 1.3.26, vite 8.3, typescript 5.7. No lint, typecheck or test script.

**Styling.** Two plain CSS files; BEM-like `.u8__*` classes. **Tailwind, shadcn/ui and Radix: none present.**

**Visual identity (keep).** Near-black `#05070c`, cyan accent, IBM Plex Mono + Space Grotesk. Coherent,
technical, restrained. This is the strongest asset and was preserved.

**UX strengths.** The "3D map of the stack" idea is genuinely on-brand; project ↔ technology
cross-highlighting is a good way to show relationships instead of listing logos.

**UX weaknesses.**
- **CRITICAL** The `<h1>` was "An explorable system". Name and role appeared only in a small eyebrow.
- **CRITICAL** The `<nav>` contained no links and had `pointer-events: none`. No landmarks, no skip link, no way to jump to a section.
- **CRITICAL** The core interaction (inspect a technology) was hover-only: unusable by keyboard, touch or screen reader; the canvas was `aria-hidden` with no alternative.
- **HIGH** Projects list was empty; the page said "being added soon".
- **HIGH** Scrollbar hidden on every browser (`scrollbar-width: none`) — removes the position cue.

---

## 2. Findings by area

### 3D
Strengths: light geometry, no textures, `meshBasicMaterial` only, DPR capped at 1.6.
Weaknesses:
- **CRITICAL (by code reading — please confirm in a browser)** Node hover likely never fired. R3F listens on the canvas's parent (`.u8__scene`), but every page section sits above it as a *sibling* (the hero is `100svh`), so pointer events never reach the canvas or bubble to it. Fixed by passing an `eventSource`.
- **HIGH** 19 always-on `<Html>` overlays reprojected every frame: the real mobile bottleneck, not the geometry.
- **HIGH** `projectTech()` matched by substring (`"Java"` would light `JavaScript`). Replaced by explicit technology ids.
- **HIGH** Scene ran continuously under `prefers-reduced-motion`.
- **ENH** A new `SphereGeometry` per node; no WebGL-failure fallback; scene bundled into the initial chunk.

### Lenis
Correctly driven from `gsap.ticker` with `lagSmoothing(0)` and `ScrollTrigger.update` — the architecture was sound and was kept. Gaps: no exposed instance for anchor scrolling; no `lagSmoothing` restore on cleanup; no `ignoreMobileResize`. Touch scrolling is native (good). Reduced motion correctly disables it.

### GSAP / ScrollTrigger

| Animation | Verdict | Action |
|---|---|---|
| Scroll progress → camera/rotation | KEEP | Tempered amplitude so the scene stays legible |
| Hero stagger-in | KEEP | — |
| `data-u8-in` reveals with `reverse` | IMPROVE | Now `once: true`; content never re-hides |
| Panel opacity scrub (0.25 → 1) | REMOVE | Double-faded content and dropped text contrast mid-scroll |
| 19 `<Html>` node labels | REPLACE | Compact mode labels only the active node |
| Hover-only inspector | REPLACE | Click/tap/focus selection + accessible technology list |
| `ScrollTrigger.getAll().forEach(kill)` | REMOVE | `ctx.revert()` already cleans up; the global kill was redundant |

### Accessibility
- **CRITICAL** Muted text `#5a6478` on `#05070c` is **3.4 : 1** (needs 4.5) and was set at **10 px**. Now `#8894a8` at **6.6 : 1**, minimum 12 px.
- **CRITICAL** No `<main>`, skip link, heading hierarchy, or section focus management.
- **HIGH** Touch targets under 44 px; body font `DM Sans` was never loaded (fell back silently).

### Mobile
- **HIGH** Same scene and `high-performance` GPU hint on phones; portrait aspect clipped the outer shell. Now: compact mode (lower DPR, no MSAA, default power preference, fewer torus segments, active-only labels) and a camera that backs off in portrait.

### Performance
- **HIGH** three + fiber + drei in the initial bundle → scene is now `React.lazy` code-split; all text paints first.
- **HIGH** Render-blocking Google Fonts stylesheet (mitigated by `preconnect` + `display=swap`; self-hosting would remove it).
- **ENH** Scene renders every frame even when the universe section is off-screen. Dimmed but not paused.

### Dependency conflict — **HIGH**
`@react-three/fiber@9.7.0` declares `react >=19 <19.3`, but the project installs `react@19.3.0`. This is why CI needs `npm install --legacy-peer-deps`. Fix by pinning `react`/`react-dom` to `~19.2.x` (or upgrading fiber when it supports 19.3), then switching CI to `npm ci`. **Not changed here** because it needs a lockfile regeneration I could not run.

---

## 3. Incorrect personal data found — **CRITICAL** (all removed)

| Location | Legacy content |
|---|---|
| `content.ts` | Islamabad; WHH consultant + logistics-intern roles; AioDock; Digital Applications; SZABIST BS CS, CGPA 3.22; all 19 skill levels; "12 projects / 04 engagements" stats; email; LinkedIn handle; the "Sourced from Muhammad's CV" claim |
| `index.html` | description, `og:description`, `twitter:description` (Islamabad, FIRMS, Welthungerhilfe); JSON-LD `addressLocality: Islamabad` and `sameAs` LinkedIn |
| `public/og-image.png` | Text baked into pixels: "Building FIRMS… Welthungerhilfe · Islamabad" → **regenerated** |
| `C08Universe.tsx` | Rendered the legacy email, LinkedIn and education |

`scripts/check-content.mjs` (`npm run check:content`, also run in CI) now fails the build if any of
these strings reappear in a text file. It cannot read text inside images.

**Not carried over, deliberately:** the legacy skill list (Node, Express, PostgreSQL, MySQL, Firebase, Java,
Python, C++, C#, Unity, Android, Redux, Material UI, Bootstrap, React "working"…). Nothing in this
repository demonstrates them, and the levels were another person's. Add any that are genuinely yours
to `src/data/skills.ts` with evidence.

## 4. Missing full-stack evidence — **CRITICAL for positioning**

The repository proves frontend and creative development, plus CI/CD. It contains **no backend, database
or API code**. The site claims "Full-Stack Developer" as your stated identity, but nothing on it can yet
back that up. Backend, Databases and APIs & services render as visible placeholders until you supply real
entries. The most credible fix is one real full-stack project with a written case study.

---

## 5. Recommended architecture and roadmap

**Information architecture (implemented):** Hero → About → Projects → Expertise → Technology Universe → Education → Contact.

**Structure (implemented):**
```
src/data/       profile · projects · skills · education · links · config   (content, no JSX)
src/sections/   Hero · About · Projects · Expertise · UniverseSection · Education · Contact
src/components/ SiteNav · Placeholder
src/universe/   model.ts · UniverseScene.tsx (lazy) · SceneBoundary.tsx
src/lib/        motion.ts (Lenis + GSAP + scene-focus + anchor scroll)
```

| Phase | Status |
|---|---|
| 1 Identity & data cleanup | **Done** |
| 2 Content architecture | **Done** (typed modules + guard script) |
| 3 Information architecture | **Done** |
| 6 Hero & core sections | **Done** (developer-first hero; name + role in `<h1>`) |
| 7 Projects | **Partly** — schema + one real project (this site). Needs your real projects |
| 8 Technology Universe | **Done** — generated from the registry; relationships; accessible list; compact/reduced modes |
| 9 Motion & scroll | **Done** for the issues listed above |
| 10 SEO | **Done** — title, description, OG/Twitter, JSON-LD (Karachi, Aptech), noscript fallback |
| 4–5 Tailwind + shadcn/ui + Radix | **Not done — see below** |
| 10 Responsive/a11y/perf verification | **Needs a browser pass** |

### Why Tailwind / shadcn / Radix were not added
1. The sandbox blocked the npm registry, so nothing could be installed or built. Adding three unverifiable dependency layers to a working site would have been reckless.
2. Peer-dependency risk: the project already needs `--legacy-peer-deps` (fiber vs React 19.3) on Vite 8. Tailwind's Vite plugin needs its peer range checked against Vite 8 before committing to it.
3. The current custom CSS (≈ 500 lines, token-based) is coherent. The genuine wins from the new stack are narrow, and that is where to spend it:
   - **Radix Dialog / Sheet** — mobile navigation, and a project case-study dialog (focus trap, scroll lock — call `lenis.stop()` / `start()` while open).
   - **Radix Tabs / Tooltip** — Expertise grouping and universe hints.
   - **Tailwind** — new components; leave the universe and hero CSS as-is.

### Next steps (in order)
1. Fill every `TODO(content)` (`npm run check:content` lists them). **CRITICAL**
2. Run `npm install && npm run typecheck && npm run build` and click through desktop + a phone. **CRITICAL**
3. Add one real full-stack project with problem / approach / decisions / outcome. **HIGH**
4. Resolve the fiber ↔ React 19.3 peer conflict; switch CI to `npm ci`. **HIGH**
5. Introduce Tailwind + Radix for nav sheet and project dialog. **HIGH**
6. Self-host fonts; pause the scene when off-screen. **ENH**

---

## Verification status

| Check | Result |
|---|---|
| `src/data/*` and `src/universe/model.ts` strict TypeScript | ✔ passes |
| Every `pairsWith` / project `stack` id resolves | ✔ 12 technologies, no dangling refs |
| Legacy-data guard | ✔ passes clean; ✔ verified it fails when `Islamabad` is reintroduced |
| React / Three / GSAP files typecheck | ✘ **not run** — dependencies could not be installed |
| `vite build` | ✘ **not run** |
| Visual / browser behaviour (hover fix, layout, mobile) | ✘ **not run** |

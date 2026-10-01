# Muhammad Shees — portfolio

Full-stack developer (MERN-focused) with a creative-frontend layer.
React 19 · TypeScript · Vite · GSAP + ScrollTrigger · Lenis · Three.js / React Three Fiber.
Deployed to GitHub Pages by `.github/workflows/deploy.yml`.

```bash
npm install
npm run dev              # http://localhost:5174
npm run typecheck
npm run check:content    # fails on legacy data, private identifiers, unsupported claims
npm run build
```

## Install

`react` / `react-dom` are pinned to `~19.2.5` because `@react-three/fiber@9.7.0` declares
`react >=19 <19.3`. The lockfile is regenerated against that pin and CI installs with `npm ci`,
so a plain `npm install` finishes with no ERESOLVE / peer warnings.

## What's in this pass

**Fixed (verified for real — install, typecheck, production build and the content guard all run green):**
- Clean `npm install` with zero peer-dependency conflicts; lockfile regenerated.
- `tsc --noEmit` passes; `vite build` passes (3D scene stays code-split in its own chunk).
- CI switched from `npm install --legacy-peer-deps` to `npm ci`.
- Fonts are self-hosted (`public/fonts`, preloaded in `index.html`) — no render-blocking
  Google Fonts request.

**Elevated:**
- Hero: character-by-character name entrance, availability badge, magnetic primary CTA,
  ambient grid + glow backdrop.
- Scroll progress bar in the nav; eyebrow rule lines that draw in per section.
- Infinite technology ticker between hero and about; cursor glow on fine-pointer devices;
  subtle film grain over the page; button shine sweep.
- 3D universe: starfield, additive glow halos on nodes, second wireframe shell — and the
  render loop now idles (`frameloop="demand"`) while the universe section is off-screen.
- Contact: giant email link. New footer with back-to-top.

All motion respects `prefers-reduced-motion`; the 3D scene keeps its compact mode on
small / touch devices.

## Editing content

Everything lives in `src/data/` — no JSX to touch.

| File | What it holds |
|---|---|
| `profile.ts` | name, role, location, hero copy, about text |
| `skills.ts` | technology registry — drives Expertise **and** the 3D universe. Each entry is `site` (used in this repo) or `focus` (stated direction) |
| `projects.ts` | project case studies. **Empty on purpose** — add real ones only; the empty state disappears automatically |
| `education.ts` | education entries |
| `links.ts` | email / GitHub / LinkedIn |

There are no skill levels, percentages or years anywhere; `npm run check:content` enforces that.

# Muhammad Shees — Portfolio

A cinematic, responsive portfolio for Muhammad Shees, Full-Stack Developer in Karachi, Pakistan.
The complete page is authored in `index.html` with inline HTML, CSS and JavaScript. It uses
Google Fonts and Lenis from CDNs; the hero video and its WebP poster are stored in `public/assets/`.

The existing Vite scripts provide local preview and the GitHub Pages deployment artifact. The
site itself does not use a JavaScript framework or app bundle.

## Preview and checks

```bash
npm install
npm run dev
npm run check:content
npm run typecheck
npm run build
```

Open the local URL printed by Vite (by default `http://localhost:5174/`). The production build
writes the static site to `dist/`; the GitHub Pages workflow deploys that directory.

## Content

The portfolio lists the live EduPredict and EventSphere projects, Muhammad’s email and social
profiles, education, and areas of focus. Project outcome figures are attributed to the project
they describe. No testimonial quotes or personal impact claims are included.

The ZIP supplied for the hero contained three MP4 encodes and no WebP. The 1080p video was
extracted as `public/assets/rose-covered-figure.mp4`; a WebP poster was generated from a video
frame at `public/assets/rose-covered-figure.webp`.

/**
 * restore-binaries.mjs
 *
 * The binary assets for public/ (self-hosted fonts, og image) are stored in
 * the repository as base64 text under bin-assets/ (`.b64` sidecars) so the
 * whole project stays text-pushable. This script decodes them back to real
 * binary files under public/ before the Vite build runs. It is wired as the
 * `prebuild` step in package.json, so both local `npm run build` and the
 * GitHub Pages workflow pick it up.
 *
 * It is idempotent: decoding the same `.b64` twice yields identical files.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const srcDir = join(root, '..', 'bin-assets');
const outDir = join(root, '..', 'public');

async function collect(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await collect(full, out);
    else if (entry.name.endsWith('.b64')) out.push(full);
  }
  return out;
}

const files = await collect(srcDir);
if (files.length === 0) {
  console.log('[restore-binaries] no .b64 sidecars found, nothing to do.');
} else {
  for (const b64path of files) {
    // bin-assets/fonts/a.woff2.b64 -> public/fonts/a.woff2
    const target = join(outDir, relative(srcDir, b64path).slice(0, -4));
    await mkdir(dirname(target), { recursive: true });
    const text = await readFile(b64path, 'utf8');
    await writeFile(target, Buffer.from(text.trim(), 'base64'));
    console.log(`[restore-binaries] restored ${relative(join(root, '..'), target)}`);
  }
}

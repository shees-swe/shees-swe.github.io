#!/usr/bin/env node
/**
 * Content guard — run with `npm run check:content` (also runs in CI before the build).
 *
 * FAILS (exit 1) if it finds:
 *   1. Legacy data from the portfolio this project was forked from (wrong city, university,
 *      employers, contact details).
 *   2. Private institutional identifiers (student / registration / form numbers).
 *   3. Unsupported claims: seniority ("Senior", "Expert", "Lead"…) or "N years" of experience.
 *
 * REPORTS (exit 0) any `TODO(content)` markers.
 *
 * Scope: source, HTML, public assets, README, workflow and — when present — the built `dist/`
 * output, so what actually deploys is checked too. Text inside images (og-image.png) cannot
 * be scanned; look at those by eye.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');

/** Applied to every scanned file, including dist/. */
const EVERYWHERE = [
  { label: 'legacy city: Islamabad', re: /islamabad/i },
  { label: 'legacy university: SZABIST', re: /szabist/i },
  { label: 'legacy employer: Welthungerhilfe / WHH', re: /welthungerhilfe|\bWHH\b/i },
  { label: 'legacy project: FIRMS', re: /\bFIRMS\b/ },
  { label: 'legacy employer: AioDock', re: /aiodock/i },
  { label: 'legacy employer: Digital Applications', re: /digital applications/i },
  { label: 'legacy CGPA', re: /3\.22\s*\/\s*4/ },
  { label: 'legacy degree: BSCS', re: /BS Computer Science|BSCS/ },
  { label: 'legacy "sourced from CV" claim', re: /sourced from muhammad/i },
  { label: 'private identifier (student/registration/form no.)', re: /student\s*(id|number|no\b)|registration\s*(no|number|#)|form\s*(no|number)\b/i },
  { label: 'private institutional email (vu.edu.pk)', re: /@vu\.edu\.pk|@student\.vu/i },
];

/** Applied to authored files only (not minified dist/ or third-party code). */
const CLAIMS = [
  { label: 'unsupported seniority claim', re: /\b(senior|expert|principal|architect)\b/i },
  { label: 'unsupported "N years" of experience claim', re: /\b\d+\+?\s*(years?|yrs?)\b/i },
];

const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts']);
const TEXT_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.css', '.html', '.md', '.txt', '.xml', '.svg', '.yml', '.yaml']);
/** Docs that describe the removed data / discuss these words on purpose. */
const DOC_EXEMPT = new Set(['AUDIT.md', 'PHASE2.md', 'package-lock.json']);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (TEXT_EXT.has(extname(name)) && !DOC_EXEMPT.has(name)) yield full;
  }
}

const violations = [];
const todos = [];

for (const file of walk(root)) {
  const rel = relative(root, file).split(sep).join('/');
  const inDist = rel.startsWith('dist/');
  const rules = inDist ? EVERYWHERE : [...EVERYWHERE, ...CLAIMS];
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const { label, re } of rules) {
        if (re.test(line)) violations.push(`${rel}:${i + 1}  [${label}]  ${line.trim().slice(0, 90)}`);
      }
      const m = line.match(/TODO\(content\):?\s*(.*)$/);
      if (m && !inDist) todos.push(`${rel}:${i + 1}  ${m[1].trim() || '(unspecified)'}`);
    });
}

console.log(existsSync(join(root, 'dist')) ? 'Scanned source and dist/.' : 'Scanned source (no dist/ present).');

if (todos.length) {
  console.log(`\nContent still to be supplied (${todos.length}):`);
  todos.forEach((t) => console.log(`  • ${t}`));
} else {
  console.log('No TODO(content) markers.');
}

if (violations.length) {
  console.error(`\n✖ ${violations.length} problem(s) found:`);
  violations.forEach((v) => console.error(`  ${v}`));
  process.exit(1);
}
console.log('\n✔ No legacy personal data, private identifiers or unsupported claims found.');

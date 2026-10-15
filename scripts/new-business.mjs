import fs from 'node:fs/promises';
import path from 'node:path';
import { root, slugPattern } from './validate.mjs';
const slug = process.argv[2];
if (!slug || !slugPattern.test(slug) || ['shared', 'assets'].includes(slug)) {
  console.error('Usage: npm run new -- business-slug (lowercase English letters/numbers and hyphens; shared/assets are reserved)');
  process.exit(1);
}
const directory = path.join(root, 'businesses', slug);
try {
  // Exclusive creation prevents accidental overwrite of an existing business.
  await fs.mkdir(directory);
  await fs.cp(path.join(root, 'templates/business'), directory, {recursive: true});
  const instructions = await fs.readFile(path.join(directory, 'instructions.md'), 'utf8');
  await fs.writeFile(path.join(directory, 'instructions.md'), instructions.replaceAll('business-slug', slug));
  console.log(`Created businesses/${slug}/. Fill instructions.md and menu.json before publishing.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }

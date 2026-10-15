import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

export const root = fileURLToPath(new URL('../', import.meta.url));
const schema = JSON.parse(await fs.readFile(path.join(root, 'schemas/menu.schema.json'), 'utf8'));
const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export async function validateMenu(menu, directory) {
  const errors = [];
  if (!validate(menu)) return validate.errors.map(e => `${e.instancePath || '/'} ${e.message}`);
  if (!menu.languages.includes(menu.defaultLanguage)) errors.push('defaultLanguage must be in languages');
  const checkText = (value, label) => {
    if (value && !value[menu.defaultLanguage]) errors.push(`${label}: missing default language ${menu.defaultLanguage}`);
    if (value) for (const lang of Object.keys(value)) if (!menu.languages.includes(lang)) errors.push(`${label}: ${lang} is not in languages`);
  };
  checkText(menu.identity.name, 'identity.name');
  checkText(menu.identity.tagline, 'identity.tagline');
  checkText(menu.priceNote, 'priceNote');
  checkText(menu.contact?.address, 'contact.address');
  checkText(menu.contact?.hours, 'contact.hours');
  const ids = new Set();
  const addId = id => { if (ids.has(id)) errors.push(`Duplicate ID: ${id}`); ids.add(id); };
  const assets = [menu.branding.logo];
  for (const cat of menu.categories) {
    addId(cat.id); checkText(cat.name, cat.id); checkText(cat.description, cat.id);
    for (const item of cat.items) {
      addId(item.id); checkText(item.name, item.id); checkText(item.description, item.id); assets.push(item.image);
      for (const label of item.labels || []) checkText(label, `${item.id} label`);
      for (const option of [...item.variants || [], ...item.extras || []]) { addId(option.id); checkText(option.name, option.id); }
    }
  }
  for (const asset of assets.filter(Boolean)) {
    try {
      const resolved = await fs.realpath(path.join(directory, asset));
      const base = await fs.realpath(path.join(directory, 'assets'));
      if (!resolved.startsWith(base + path.sep)) throw new Error('outside assets');
      if (!(await fs.stat(resolved)).isFile()) throw new Error('not a file');
    } catch { errors.push(`Missing or unsafe asset: ${asset}`); }
  }
  return errors;
}
export async function loadBusinesses() {
  const businesses = [];
  for (const entry of await fs.readdir(path.join(root, 'businesses'), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!slugPattern.test(entry.name) || ['shared', 'assets'].includes(entry.name)) throw new Error(`Invalid or reserved business slug: ${entry.name}`);
    const directory = path.join(root, 'businesses', entry.name);
    const menu = JSON.parse(await fs.readFile(path.join(directory, 'menu.json'), 'utf8'));
    const errors = await validateMenu(menu, directory);
    if (errors.length) throw new Error(`${entry.name}:\n${errors.join('\n')}`);
    businesses.push({ slug: entry.name, menu, directory });
  }
  return businesses;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { console.log(`Validated ${(await loadBusinesses()).length} business(es).`); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}

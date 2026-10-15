import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { root, validateMenu } from './validate.mjs';
import { build } from './build.mjs';
import { menuContent } from '../src/components/menu.mjs';

const directory = path.join(root, 'businesses/example-cafe');
const original = JSON.parse(await fs.readFile(path.join(directory,'menu.json'), 'utf8'));
const clone = () => structuredClone(original);
test('data contract rejects invalid prices, duplicate IDs, missing/unsafe assets and language errors', async () => {
  assert.deepEqual(await validateMenu(original, directory), []);
  for (const invalid of [-1, '2500', null]) {
    const menu = clone(); menu.categories[0].items[0].price = invalid;
    assert.ok((await validateMenu(menu, directory)).length, `reject ${invalid}`);
  }
  const duplicate = clone(); duplicate.categories[1].items[0].id = 'espresso';
  assert.match((await validateMenu(duplicate, directory)).join(), /Duplicate ID/);
  const missing = clone(); missing.branding.logo = 'assets/nonexistent.png';
  assert.match((await validateMenu(missing, directory)).join(), /Missing/);
  const unsafe = clone(); unsafe.branding.logo = 'assets/../source/private.png';
  assert.ok((await validateMenu(unsafe, directory)).length);
  const mixed = clone(); mixed.categories[0].items[0].variants = [{id:'bad', name:{ar:'عادي'}, price:1}];
  assert.ok((await validateMenu(mixed, directory)).length);
  const language = clone(); language.languages = ['en'];
  assert.ok((await validateMenu(language, directory)).length);
  const text = clone(); text.categories[0].items[0].name = {en:'Espresso'};
  assert.match((await validateMenu(text, directory)).join(), /missing default language/);
});
test('project-path deployment prefixes internal links and assets without changing external URLs', async () => {
  try {
    await build({basePath:'/holool-menu'});
    for (const relative of ['index.html','404.html','example-cafe/index.html','example-cafe/en/index.html']) {
      const html = await fs.readFile(path.join(root,'dist',relative),'utf8');
      const localURLs = [...html.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)].map(match => match[1]);
      assert.ok(localURLs.length);
      assert.ok(localURLs.every(url => url.startsWith('/holool-menu/')));
      assert.match(html, /href="https:\/\/holoolsoftware.com"/);
    }
    await assert.rejects(build({basePath:'https://unsafe.example'}), /BASE_PATH/);
  } finally { await build({basePath:''}); }
});
test('renderer preserves zero, missing prices, fallbacks, hidden content, empty state and escaping', () => {
  const menu = clone();
  menu.categories[0].items[0].price = 0;
  delete menu.categories[0].items[1].price;
  menu.categories[0].items[2].visible = false;
  menu.categories[0].items[3].name = {ar:'قهوة <script>'};
  const html = menuContent(menu, 'en', {});
  assert.match(html, />0 <small>SDG/);
  assert.match(html, /Price not listed/);
  assert.doesNotMatch(html, /Cappuccino/);
  assert.match(html, /lang="ar" dir="rtl">قهوة &lt;script&gt;/);
  assert.doesNotMatch(html, /class="contact"/);
  menu.categories = [];
  assert.match(menuContent(menu, 'en', {}), /There are no items/);
});
async function filesSnapshot(dir) {
  const map = {};
  async function visit(current, prefix = '') {
    for (const entry of await fs.readdir(current, {withFileTypes:true})) {
      const relative = prefix + entry.name;
      if (entry.isDirectory()) await visit(path.join(current,entry.name), relative + '/');
      else map[relative] = createHash('sha256').update(await fs.readFile(path.join(current,entry.name))).digest('hex');
    }
  }
  await visit(dir); return map;
}
test('static output has direct RTL/LTR pages and no originals; adding another business preserves the first', async () => {
  await build();
  const dist = path.join(root,'dist');
  const ar = await fs.readFile(path.join(dist,'example-cafe/index.html'),'utf8');
  const en = await fs.readFile(path.join(dist,'example-cafe/en/index.html'),'utf8');
  assert.match(ar, /<html lang="ar" dir="rtl">/);
  assert.match(en, /<html lang="en" dir="ltr">/);
  assert.match(ar, /href="\/example-cafe\/en\/"/);
  assert.match(en, /href="\/example-cafe\/"/);
  const outputBefore = await filesSnapshot(path.join(dist,'example-cafe'));
  const sourceBefore = await filesSnapshot(directory);
  assert.ok(!Object.keys(outputBefore).some(f => /source|instructions|menu\.json/.test(f)));
  assert.ok(Object.keys(outputBefore).some(f => f.endsWith('.webp')));
  assert.doesNotMatch(await fs.readFile(path.join(dist,'index.html'),'utf8'), /example-cafe|Ghusn/);
  // Exclusive temporary slug prevents touching any existing business.
  const slug = `verification-${process.pid}`;
  const target = path.join(root,'businesses',slug);
  let created = false;
  try {
    execFileSync(process.execPath, [path.join(root,'scripts/new-business.mjs'),slug], {cwd:root});
    created = true;
    const menu = JSON.parse(await fs.readFile(path.join(target,'menu.json'),'utf8'));
    menu.identity = {name:{en:'Second fictional business'}, type:'salon'};
    menu.languages = ['en','ar']; menu.defaultLanguage = 'en';
    await fs.writeFile(path.join(target,'menu.json'),JSON.stringify(menu));
    await fs.writeFile(path.join(target,'source','private.txt'),'MUST NOT PUBLISH');
    await build();
    assert.deepEqual(await filesSnapshot(path.join(dist,'example-cafe')), outputBefore);
    assert.deepEqual(await filesSnapshot(directory), sourceBefore);
    assert.match(await fs.readFile(path.join(dist,slug,'index.html'),'utf8'), /lang="en" dir="ltr"/);
    assert.match(await fs.readFile(path.join(dist,slug,'ar/index.html'),'utf8'), new RegExp(`href="/${slug}/"`));
    await assert.rejects(fs.access(path.join(dist,slug,'source/private.txt')));
    // Test duplicate folder protection via the actual onboarding command.
    assert.throws(() => execFileSync(process.execPath,[path.join(root,'scripts/new-business.mjs'),slug],{cwd:root,stdio:'pipe'}));
  } finally {
    // Only this exclusively created fixture is removed.
    if (created) await fs.rm(target,{recursive:true,force:true});
    await build();
  }
});

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { root, loadBusinesses } from './validate.mjs';
import { menuContent } from '../src/components/menu.mjs';
import { page } from '../src/layouts/page.mjs';

export async function build({basePath = process.env.BASE_PATH || ''} = {}) {
  const render = options => page({...options, basePath});
  // Check deployment configuration before replacing existing output.
  render({title: '', content: ''});
  // Validate before replacing any previously successful output.
  const businesses = await loadBusinesses();
  const dist = path.join(root, 'dist');
  await fs.rm(dist, { recursive: true, force: true });
  await fs.mkdir(path.join(dist, 'shared'), { recursive: true });
  await fs.copyFile(path.join(root, 'src/styles/styles.css'), path.join(dist, 'shared/styles.css'));
  await fs.copyFile(path.join(root, 'src/menu.js'), path.join(dist, 'shared/menu.js'));
  for (const { slug, menu, directory } of businesses) {
    const target = path.join(dist, slug);
    await fs.mkdir(target, { recursive: true });
    // Only referenced, visible published images are copied. Sources and briefs never leave businesses/.
    const assets = new Set([menu.branding.logo, ...menu.categories.filter(c => c.visible !== false).flatMap(c => c.items.filter(i => i.visible !== false).map(i => i.image))].filter(Boolean));
    const images = {};
    for (const asset of assets) {
      const optimized = asset.replace(/\.[^.]+$/, '.webp');
      // Keep the full original filename to avoid collisions (photo.png vs photo.jpg).
      const relative = optimized.replace(/\.webp$/, `-${path.extname(asset).slice(1)}.webp`);
      const destination = path.join(target, relative);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await sharp(path.join(directory, asset)).rotate().resize({ width: asset === menu.branding.logo ? 240 : 480, height: asset === menu.branding.logo ? 240 : 480, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(destination);
      images[asset] = `/${slug}/${relative}`;
    }
    for (const lang of menu.languages) {
      const langDir = lang === menu.defaultLanguage ? target : path.join(target, lang);
      await fs.mkdir(langDir, { recursive: true });
      const style = Object.entries(menu.branding).filter(([key]) => ['primary', 'background', 'accent'].includes(key)).map(([key, value]) => `--${key}:${value}`).join(';');
      let content = menuContent(menu, lang, images);
      // Language destinations follow defaultLanguage, including English-first menus.
      const alternate = menu.languages.find(l => l !== lang);
      if (alternate) {
        const href = alternate === menu.defaultLanguage ? `/${slug}/` : `/${slug}/${alternate}/`;
        content = content.replace(/class="language" href="[^"]*"/, `class="language" href="${href}"`);
      }
      const title = menu.identity.name[lang] || menu.identity.name[menu.defaultLanguage];
      await fs.writeFile(path.join(langDir, 'index.html'), render({title, lang, content, style, script: true}));
    }
  }
  const content = `<header class="topbar"><a class="wordmark" href="/" aria-label="Holool Software"><span class="holool-icon">h</span> holool<span class="software">software</span></a></header><main class="landing"><h1>قائمتك، أقرب إلى عملائك.</h1><p>قوائم رقمية من حلول للبرمجيات. افتح رابط المنشأة أو امسح رمز QR للاطلاع على قائمتها.</p><p lang="en" dir="ltr">Digital menus by Holool Software. Scan a business’s QR code or open its direct link to explore its menu.</p><a class="landing-link" href="https://holoolsoftware.com">Holool Software</a></main><footer>Powered by <a href="https://holoolsoftware.com">Holool</a></footer>`;
  await fs.writeFile(path.join(dist, 'index.html'), render({title: 'Holool Software | قوائم رقمية', content}));
  await fs.writeFile(path.join(dist, '404.html'), render({title: 'Page not found | الصفحة غير موجودة', content: '<main class="landing"><h1>الصفحة غير موجودة</h1><p>تحقق من رابط القائمة أو امسح رمز QR مرة أخرى.</p><p lang="en" dir="ltr">Menu not found. Check the link or scan the QR code again.</p><a href="/">Holool Software</a></main>'}));
  await fs.writeFile(path.join(dist, '.nojekyll'), '');
  await fs.writeFile(path.join(dist, 'CNAME'), 'menu.holoolsoftware.com\n');
  console.log(`Built ${businesses.length} business(es) into dist/.`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { await build(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}

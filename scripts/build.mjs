import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { root, loadBusinesses } from './validate.mjs';
import { menuContent } from '../src/components/menu.mjs';
import { page } from '../src/layouts/page.mjs';
import { homeContent } from '../src/components/home.mjs';

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
  await fs.copyFile(path.join(root, 'src/styles/ornate.css'), path.join(dist, 'shared/ornate.css'));
  await fs.copyFile(path.join(root, 'src/menu.js'), path.join(dist, 'shared/menu.js'));
  await fs.copyFile(path.join(root, 'src/styles/home.css'), path.join(dist, 'shared/home.css'));
  await fs.mkdir(path.join(dist, 'shared/brand'), {recursive:true});
  await sharp(path.join(root,'src/assets/holool-logo.png')).resize({width:960,withoutEnlargement:true}).webp({quality:88}).toFile(path.join(dist,'shared/brand/logo.webp'));
  await sharp(path.join(root,'src/assets/holool-icon.png')).resize({width:128,withoutEnlargement:true}).webp({quality:88}).toFile(path.join(dist,'shared/brand/icon.webp'));
  await sharp(path.join(root,'src/assets/holool-icon.png')).resize(48,48,{fit:'contain',background:'#ffffff'}).png().toFile(path.join(dist,'shared/brand/favicon.png'));
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
    // Only businesses explicitly supplying an icon receive these generated assets.
    let favicon = '';
    let touchIcon = '';
    if (menu.branding.icon) {
      for (const [name, size] of [['favicon', 48], ['apple-touch-icon', 180]]) {
        await sharp(path.join(directory, menu.branding.icon)).rotate()
          .resize(size, size, {fit: 'contain', background: '#ffffff'})
          .png().toFile(path.join(target, `${name}.png`));
      }
      favicon = `/${slug}/favicon.png`;
      touchIcon = `/${slug}/apple-touch-icon.png`;
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
      await fs.writeFile(path.join(langDir, 'index.html'), render({title, lang, content, style, script: true, themeColor: menu.branding.primary, extraStylesheet: menu.branding.theme === 'ornate' ? '/shared/ornate.css' : '', favicon, touchIcon}));
    }
  }
  for (const lang of ['ar','en']) {
    const directory = lang === 'ar' ? dist : path.join(dist,'en');
    await fs.mkdir(directory,{recursive:true});
    await fs.writeFile(path.join(directory,'index.html'),render({
      title:lang === 'ar' ? 'حلول التقنية | مواقع للشركات والأفراد والمشاريع' : 'Holool | Websites for businesses, people & projects',
      description:lang === 'ar' ? 'مواقع تعريفية وصفحات هبوط ومعارض أعمال وكتالوجات خدمات بهوية مشروعك. مواقع ثابتة من حلول التقنية.' : 'Company websites, landing pages, portfolios, and service catalogs shaped around your identity. Static websites by Holool.',
      lang,content:homeContent(lang),stylesheet:'/shared/home.css',favicon:'/shared/brand/favicon.png',themeColor:'#062652'
    }));
  }
  await fs.writeFile(path.join(dist, '404.html'), render({title: 'Page not found | الصفحة غير موجودة', stylesheet:'/shared/home.css', favicon:'/shared/brand/favicon.png', themeColor:'#062652', content: '<main class="site-hero site-width"><div class="site-hero-copy"><h1>الصفحة غير موجودة</h1><p>تحقق من الرابط أو عُد إلى الصفحة الرئيسية.</p><p lang="en" dir="ltr">Page not found. Check the link or return to the homepage.</p><div class="site-actions"><a class="site-button" href="/">الصفحة الرئيسية</a><a class="site-text-link" href="/en/" lang="en">English homepage</a></div></div><figure class="site-identity"><img src="/shared/brand/logo.webp" alt="حلول التقنية" width="640" height="557"></figure></main>'}));
  await fs.writeFile(path.join(dist, '.nojekyll'), '');
  await fs.writeFile(path.join(dist, 'CNAME'), 'menu.holoolsoftware.com\n');
  console.log(`Built ${businesses.length} business(es) into dist/.`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { await build(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}

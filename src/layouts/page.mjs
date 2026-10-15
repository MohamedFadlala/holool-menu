import { escape } from '../components/menu.mjs';
export function page({title, lang = 'ar', content, style = '', script = false, description = ''}) {
  return `<!doctype html><html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escape(description || title)}"><meta name="theme-color" content="#164e48"><title>${escape(title)}</title><link rel="stylesheet" href="/shared/styles.css">${style ? `<style>:root{${style}}</style>` : ''}${script ? '<script src="/shared/menu.js" defer></script>' : ''}</head><body>${content}</body></html>`;
}

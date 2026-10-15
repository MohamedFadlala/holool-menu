# Holool menu repository

1. Read this file and the target business's `instructions.md` before making changes.
2. Inspect that business's existing `menu.json`, assets, and supplied files in `source/`.
3. For a new business, run `npm run new -- business-slug` to copy the starter, then create its data and assets.
4. For an existing business, update only requested content. Preserve stable item/category/option IDs and the permanent folder slug/URL. Never rename a slug without an explicit request.
5. `menu.json` is the published content source. Explicit change requests in `instructions.md` are editing directions; reconcile them into JSON.
6. If sources conflict or prices are unclear, report the exact ambiguity. Never invent prices, items, translations, contact details, or claims. Missing prices may be omitted and will read “Price not listed”; zero means an explicit zero price. Omit unprovided translations.
7. Keep unrelated businesses unchanged. Do not publish `instructions.md`, original `source/` files, or unreferenced assets.
8. Prefer shared components and branding settings over copying page code. Shared changes affect all businesses: make them only when required and check the impact.
9. Validate data and run the production build after changes: `npm run validate` and `npm run build`. For renderer/schema/tool changes also run `npm test` and check Arabic/English mobile views.
10. Report the changed business, affected files, and any unresolved content.

## Conventions

- Lowercase, hyphen-separated English slugs. `shared` and `assets` are reserved.
- Category/item/variant/extra IDs are globally unique within one business. Preserve IDs across edits.
- Array order determines category and item order. `visible: false` removes content from HTML. `available: false` retains it with an unavailable label.
- Every supplied text object needs the default language. Other supported-language fields are optional: a missing translation displays the original text with its own `lang` and direction.
- Keep public raster images under that business's `assets/`. Use relative paths beginning `assets/`; no remote image dependencies or SVG uploads. Build compresses referenced images to WebP.
- Branding colors accept six-digit hex. Use a dark primary color (white text), a light background/accent (dark text), and verify contrast after branding changes.
- No backend, ordering, accounts, payments, or administrative UI. Keep client JavaScript small and optional.
- `dist/`, `node_modules/`, and generated `output/` QR files are ignored. Only deploy `dist/`.
- Root URL is a private-client-neutral Holool service page. Do not add a client directory without an explicit request.
- CI checks `main` and uploads a static artifact. GitHub Pages deployment runs only with repository Actions variable `ENABLE_PAGES=true`; Pages and domain ownership must be configured per README. Do not change repository visibility without the owner's explicit authorization.

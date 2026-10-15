# Holool digital menus

Mobile-first, Arabic-first static menus for multiple businesses. A small Node generator renders real HTML files using one shared renderer; no framework runtime or backend is needed. Each menu works without JavaScript. The ~2 KB client script adds search and category filters. JSON Schema (Ajv) checks data, Sharp compresses images to WebP, and QRCode produces print-ready codes.

The only included business, **Ghusn Café / مقهى غصن**, is entirely fictional. The root service page does not list businesses.

Repository: [MohamedFadlala/holool-menu](https://github.com/MohamedFadlala/holool-menu) is public with the owner's authorization. The site is hosted at [GitHub Pages](https://mohamedfadlala.github.io/holool-menu/), with the demo at [example-cafe](https://mohamedfadlala.github.io/holool-menu/example-cafe/). CI validates, tests, builds, and deploys on pushes to `main`; the repository Actions variable `ENABLE_PAGES=true` enables deployment. All tracked briefs and original sources are publicly readable in GitHub even though the website excludes them: do not commit confidential source files. The intended permanent domain `menu.holoolsoftware.com` still needs DNS configuration.

## Run locally

Install Node.js 22 or newer, then:

```sh
npm ci
npm run validate
npm test
npm run dev
```

Open `http://127.0.0.1:4321/example-cafe/` for Arabic or `/example-cafe/en/` for English. `npm run dev` builds once and serves `dist/`; restart it after editing files. Set `PORT` to change the default port. `npm run build` produces deployable `dist/` with no server routing requirements. `npm run preview` is an alias of dev.

## Add a business

```sh
npm run new -- business-slug
```

1. Fill `businesses/business-slug/instructions.md` with the owner's directions. The template marks required and optional fields and includes a fictional example.
2. Place originals in `source/`, and public raster images in `assets/` (PNG, JPEG, WebP, or AVIF). Sources and instructions never publish.
3. Replace the starter name in `menu.json` and transcribe supplied data. Set languages, defaultLanguage, currency, and branding. Empty categories are valid and produce a useful empty state.
4. Validate and build. Review that business's permanent direct URL and language versions before committing.

The lowercase folder slug determines `https://menu.holoolsoftware.com/business-slug/`. Never rename a live folder without an explicit request. `shared` and `assets` are reserved. Do not put secrets in repository briefs; excluding them from the website does not make a public GitHub repository private.

## Update content

Read root `AGENTS.md`, the target brief, and source documents first. Edit only that business. `menu.json` is canonical; instructions contain editing directions. Preserve stable category, item, variant, and extra IDs. IDs must be unique throughout that business. Arrays determine display order.

- **Prices:** edit an item's `price` or its `variants[].price`; never both. Numbers must be finite and nonnegative. `0` is displayed; an omitted price says “Price not listed”. Extras also have names and numeric prices.
- **Translations:** each text field is an object such as `{"ar":"إسبريسو","en":"Espresso"}`. Default-language text is required; other translations are optional and fall back to correctly directed original text. Add `en` to languages only when English content is supplied. English-first and single-language businesses are supported.
- **Images:** reference `assets/logo.png` or `assets/items/espresso.png`. Replace the file or change the path, then build. Referenced images are resized (240 px logo / 480 px item), orientation-corrected, metadata-stripped, and compressed to WebP. Images are optional; broken client image loads are removed, and absent references leave no placeholders. No source files or unreferenced images are copied.
- **Visibility:** `visible: false` on a category or item excludes it from HTML; `available: false` displays the item as unavailable. No ordering controls exist.
- **Contact:** optional `phone`, international digits-only `whatsapp`, localized `address` and `hours`, and HTTPS `map`. Omit absent values. No demo contact details are invented.
- **Claims/fees:** use `labels` and `priceNote` only when explicitly supplied. Never infer allergens or tax inclusion.
- **Branding:** six-digit `primary`, `background`, `accent` colors. Keep primary dark for white text and background/accent light for dark text; check contrast and mobile readability when changing them. Text uses local Tahoma/Segoe UI/Arial with Arabic support, avoiding external font requests.

See `schemas/menu.schema.json` and `businesses/example-cafe/menu.json` for the complete data shape. `npm run validate` catches schema errors, duplicate IDs, invalid prices, language mismatches, unsafe paths, and missing assets. Build also rejects unreadable image data. Never invent content to fix validation: report the exact ambiguity to the owner.

## QR codes

```sh
npm run qr -- example-cafe
npm run qr -- example-cafe https://another-domain.example/
```

This writes downloadable `output/example-cafe-qr.png` (1200 px) and `.svg`, encoding the permanent business URL with a trailing slash. Use the SVG for printing. Verify the encoded domain and scan a printed sample before distribution. QR output stays local and is not included in deployment.

## Deploy on GitHub Pages

1. Push this project and `package-lock.json` to a GitHub repository on `main`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**. In **Settings → Secrets and variables → Actions → Variables**, create `ENABLE_PAGES` with value `true`. The included workflow installs dependencies, validates/tests, builds, and deploys only `dist/`. If Pages is unavailable for the repository's visibility and plan, leave this variable disabled; CI still checks the project and uploads the static artifact.
3. In **Settings → Pages → Custom domain**, enter `menu.holoolsoftware.com` and save.
4. At the DNS provider, create a **CNAME** record: name `menu`, target `<github-owner>.github.io` (no scheme or repository path). Remove conflicting A/AAAA records for this subdomain. Verify domain ownership in GitHub using its displayed TXT record where applicable.
5. Wait for DNS and GitHub's certificate, then enable **Enforce HTTPS**. Check `/example-cafe/` and `/example-cafe/en/` directly and after refresh.

The build writes `dist/CNAME` and `.nojekyll`. GitHub Actions deployments configure the domain through repository Settings; GitHub ignores the CNAME file for this deployment method. See [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). No fallback rewrite to index.html is needed: each business and language has its own `index.html`. The workflow reads the Pages base path automatically, so links and assets work at `/holool-menu/` now and at `/` after configuring the custom domain and rerunning the workflow. Local builds default to the domain root; set `BASE_PATH=/holool-menu` for a manual project-path build (PowerShell: `$env:BASE_PATH='/holool-menu'; npm run build`; clear it afterward with `Remove-Item Env:BASE_PATH`).

Subsequent menu edits deploy after pushing to `main`. A validation or build failure prevents a new deployment. Keep this repository private if business originals are private, and select a GitHub plan supporting Pages for private repositories, or use another static host. Publicly deployed menu URLs remain accessible to anyone with their link; they are not access-controlled.

## Portable hosting

Any host serving directory indexes can serve `dist/`: build command `npm ci && npm run build`, publish directory `dist`. Set the same custom-domain DNS using that host's instructions. No runtime Node process is needed. Remove/change `CNAME` in `scripts/build.mjs` if changing domains, and regenerate QR codes only when the permanent domain or slug changes. Do not deploy the repository root.

## Structure and verification

- `src/components`, `src/layouts`, `src/styles`: shared rendering and visual system.
- `schemas`: content contract; `templates/business`: reusable starter.
- `businesses/<slug>`: isolated brief, canonical JSON, public assets, private originals.
- `scripts`: scaffolding, validation, build, preview, QR, and regression checks.

`npm test` checks invalid data and asset paths, static Arabic/English output, privacy/visibility, zero vs missing prices, and a second business built in isolation without changing the first business's source or output. Browser checks should cover 390 px Arabic/English, search by either supplied item name, category filters, empty search, keyboard focus, and a direct URL refresh. No backend, database, accounts, orders, payments, or dashboard is included.

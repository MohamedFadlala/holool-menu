# Business brief

Fill this before asking an AI agent to add or change the menu. Required fields are marked **Required**. Do not guess missing content. Keep original PDFs/images/notes in `source/`. This file is private to the repository and is never published.

## Identity and presentation

- **Required:** Business name in its default language: [owner-provided name]
- **Optional:** Arabic business name: [only if supplied]
- **Optional:** English business name: [only if supplied]
- **Required:** Business type: [restaurant / café / salon / other]
- **Required:** Permanent URL slug: `business-slug` (do not rename after printing QR codes)
- **Required:** Default language: `ar`
- **Required:** Supported languages: `ar` [add `en` only when content exists]
- **Required:** Currency: `SDG` (default; change if supplied)
- **Optional:** Logo path: [e.g. `assets/logo.png`; omit if absent]
- **Optional:** Brand colors: dark primary [#164e48], light background [#f5f9f7], light accent [#dceee5]
- **Optional:** Preferred visual style: [owner's description]
- **Optional:** Layout preferences and references: [links/files; describe what to adopt]

## Menu content

- **Required:** Content or source locations: [inline text or `source/menu.pdf`]
- **Required:** Category order: [ordered list, or order in supplied menu]
- **Required:** Prices and sizes/variants: [exact amounts and currency; call out uncertainties]
- **Optional:** Priced extras: [exact names and amounts; explicit zero if free]
- **Optional:** Descriptions, photos, dietary/allergen labels: [only supplied facts]
- **Optional:** Tax/fee treatment: [included / excluded with precise terms / unknown; omit the published note if unknown]
- **Optional:** Visibility or availability changes: [IDs and requested state]
- **Optional:** Phone, WhatsApp (international digits only), address, opening hours, HTTPS map link: [omit absent fields]

## Requested changes to an existing menu

- **Required for edits:** Exact requested changes: [item IDs, revised prices/content, additions/removals]
- **Optional:** Unresolved content: [exact ambiguity and source locations]
- Keep existing stable IDs, unrelated content, and URL. `menu.json` is canonical after transcription.
- Starter JSON contains a placeholder identity and no items. Replace the identity before publishing; do not publish invented content.

## Fictional filled example (reference only; do not copy into a real business)

- Arabic name: مقهى غصن
- English name: Ghusn Café
- Type: café. Slug: example-cafe.
- Default language: ar. Supported: ar, en. Currency: SDG.
- Logo: assets/logo.png. Primary #164e48, background #f5f9f7, accent #dceee5.
- Style: calm botanical café, teal header, simple menu rows. Layout: categories above a two-column desktop / one-column mobile menu; no external reference.
- Content source: owner-approved fictional demo data in menu.json. Source folder has no originals.
- Category order: Hot coffee, Cold drinks, From the bakery.
- Espresso: 2500 SDG; Americano: regular 3000, large 3500. Latte extra shot: 1000. Water: explicitly 0 SDG.
- All displayed demo prices include fees. No contact information supplied.
- Change request: none. Every name, translation, price, and claim in this example is fictional.

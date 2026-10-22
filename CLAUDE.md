# CLAUDE.md

Single static landing page (Bahasa Indonesia) selling licensed Scopus accounts under the brand **CumaDisini**. No framework, no build step — plain HTML/CSS/JS served as static files (Cloudflare Pages style: `_headers`, `_redirects`).

## Structure

- `index.html` — the whole page. Section order: topbar, hero (+ ticker), §01 Masalah (versus), §02 Definisi + Akses (doors), §03 Bukti (testimonials), §04 Harga (ledger + lifetime group promo + bonus footnote), §05 Untuk siapa, §06 Manfaat, §07 Tanya (FAQ accordion), penutup, footer, mobile dock.
- `public/css/style.css` — all styling in `====` banner blocks mirroring the sections. Design tokens live in `:root`: `--paper`, `--paper-2`, `--card`, `--ink`, `--ink-2`, `--line`, `--red` (fills), `--red-ink` (text-safe red), `--hl` (highlighter yellow); fonts `--serif` (Fraunces, display), `--sans` (Geist, body), `--mono` (IBM Plex Mono, labels).
- `public/js/head.js` adds `js` to `<html>`; `public/js/main.js` runs reveals, count-up, the hero sheet animation, topbar hairline and the mobile dock.
- Logo: `[•]` bracket mark ("di sini"). `public/favicon.svg`, the inline `.logo__mark` SVG, and the `.end__mark` SVG in `index.html` are the same artwork — edit together. `public/og-image.png` (1200×630) and `public/apple-touch-icon.png` (180×180) were rendered from HTML with headless Chrome; regenerate rather than hand-edit.

## Conventions

- Signature element is the highlighter: wrap a phrase in `<span class="mark">` and the IntersectionObserver draws it in. Use sparingly (one per section at most).
- Reveal classes: `.lift` (hero cascade, with `--d` delay), `.rise` (whole block), `.stagger` (children). `data-count` / `data-suffix` for animated numbers. Respect `prefers-reduced-motion` in both CSS and `main.js`.
- BEM-ish naming (`.row--pick`, `.door__n`).

## Content / SEO

- Checkout is WhatsApp: every CTA is `https://wa.me/628134135560?text=...` naming the package and price. When a price changes, update the `text=` payload, the visible ledger row, and the JSON-LD `Offer` together. Encode `+` as `%2B`.
- JSON-LD `FAQPage` mirrors the `.qa` accordion; keep them in sync.
- Domain placeholder `https://cumadisini.my.id/` is hardcoded in `<head>`, JSON-LD, `robots.txt`, `sitemap.xml` — replace all together once the real domain is known.

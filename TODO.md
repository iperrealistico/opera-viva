# TODO.md

## 1. Repo Understanding
- **Pages**: Single page with hash-based routing (`#/`, `#/tecniche`, `#/contatti`, `#/cosa`).
- **Assets**: `img/` directory for images, `eventi.md` for dynamic content.
- **Entrypoints**: `index.html` (contains CSS, JS, and HTML templates).
- **Shared Sections**: Header and Footer are shared.
- **Bilingual Logic**: `lang` attributes on spans/elements, toggled by JS and stored in `localStorage`.

## 2. Risk List
- **Visual Parity**: Moving CSS into separate files or using a CSS-in-JS solution might cause subtle changes. I will keep the existing CSS as-is.
- **Routing**: Converting hash-routes to Next.js routes (`/`, `/en`, `/en/tecniche`, etc.) must be handled carefully to avoid broken links.
- **Asset Paths**: Relative paths in `index.html` must be preserved or adjusted for Next.js static export.
- **SEO**: Meta tags and hreflang must be correctly implemented for the new bilingual structure.
- **JS Behavior**: Custom logic for hero videos, scroll reveals, and carousels must be ported to React components while maintaining the same behavior.

## 3. Touch List
- `package.json`: [NEW] Project dependencies and scripts.
- `next.config.js`: [NEW] Static export configuration.
- `content/site.json`: [NEW] Source of truth for all content.
- `app/`: [NEW] Next.js App Router structure.
- `public/`: [MODIFY] Move existing assets here.
- `api/`: [NEW] Vercel Functions for the admin back end.
- `components/`: [NEW] React components for shared sections and views.

## 4. Steps
1. [ ] Create `TODO.md` (done)
2. [ ] Initialize Next.js project and dependencies
3. [ ] Extract `content/site.json` from `index.html`
4. [ ] Implement content loader
5. [ ] Create layout and base components (Header, Footer)
6. [ ] Implement Home, Tecniche, Contatti, and Offer pages
7. [ ] Setup bilingual routing and language switcher
8. [ ] Implement SEO metadata and hreflang
9. [ ] Create Admin UI (`/__manage`)
10. [ ] Implement Admin API (Auth, JSON edit, GitHub Commit, Uploads)
11. [ ] Verification and parity checks

## 5. Verification Commands
- `npm run build`
- `scripts/verify-parity` (to be created)
- `scripts/smoke` (to be created)

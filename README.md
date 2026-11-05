# SleepOutside

Responsive outdoor-gear storefront. The site includes product discovery, search suggestions, product detail pages, a persistent shopping cart, and checkout.

## Requirements

- Node.js (LTS recommended)
- npm

## Run locally

```bash
npm install
npm run start
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## Build for production

```bash
npm run build
```

Vite writes the production site to `dist/`. For a Render Static Site, use `npm run build` as the build command and `dist` as the publish directory. The Vite base path is relative so the built site can also be hosted from a project subpath.

## Data and services

The frontend requests product and product-detail data from `https://wdd330-backend.onrender.com/` and submits checkout orders to that service. This repository does not configure or include a database for that backend, so its persistence technology cannot be determined here.

The cart is stored in the browser, not in a database. Product JSON snapshots are also present in `src/public/json/`; the current storefront loads its catalog through the backend API.

## Project layout

- `src/index.html` — storefront home page.
- `src/product_listing/` — category and search results.
- `src/product_pages/` — product detail pages.
- `src/cart/` — shopping cart.
- `src/checkout/` — checkout and order confirmation.
- `src/js/` — API access, catalog rendering, search, cart, and checkout logic.
- `src/css/style.css` — shared responsive styles.
- `src/public/partials/` — shared header and footer.
- `src/images/` — product, brand, placeholder, and 3D category artwork.

## Useful commands

- `npm run start` — start Vite in development mode.
- `npm run build` — generate the production site in `dist/`.
- `npm run lint` — run ESLint.
- `npm run format` — format supported project files with Prettier.
- `npm test` — run Jest tests.

---

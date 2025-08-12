# CEL Developer Docs (Fumadocs + Next.js)

Clean documentation site built with Next.js App Router, Fumadocs, TypeScript, and Tailwind CSS v4.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 (falls back to 3001 if 3000 is busy).

## Requirements

- Node.js 18+ (Node 20+ recommended for search engine packages)
- npm (or pnpm/yarn)

## Project structure

```
app/
  global.css           # Tailwind v4 + Fumadocs UI styles
  layout.tsx           # RootProvider wrapper
  layout.config.tsx    # Shared nav/links config (baseOptions)
  (home)/              # Home layout & page
  docs/                # Docs layout and route
content/
  docs/*.mdx           # Your documentation content
lib/
  source.ts            # Fumadocs source configuration
source.config.ts       # MDX source generation config
```

## Styling (Tailwind v4)

- app/global.css (order matters):
  - `@import "tailwindcss";`
  - `@import 'fumadocs-ui/style.css';`
- tailwind.config.js: minimal v4 config (theme.extend only)
- postcss.config.js: autoprefixer only (no tailwind plugin in v4)

## Fumadocs layouts and navigation

- Root provider: `app/layout.tsx` uses `RootProvider` from `fumadocs-ui/provider`.
- Home page: `app/(home)/layout.tsx` uses `HomeLayout`.
- Navigation links and title: edit `app/layout.config.tsx` (`baseOptions`).

## Writing docs

- Add/modify MDX files under `content/docs/` (e.g., `index.mdx`, `report.mdx`).
- Types are generated via `postinstall: fumadocs-mdx`.
- Docs route is available under `/docs`.

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm start` – start production server

## Troubleshooting

- Tailwind error about `@layer base`: ensure `app/global.css` imports Tailwind first, then `fumadocs-ui/style.css`.
- Node engine warnings: upgrade to Node 20+ for best compatibility (e.g., search engine packages).
- Port 3000 in use: Next.js will automatically use 3001.

## Learn more

- Next.js – https://nextjs.org/docs
- Fumadocs – https://fumadocs.vercel.app

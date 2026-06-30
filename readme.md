# Book Explorer

Book Explorer is a small React app for searching books through the [Google Books API](https://developers.google.com/books), opening a detail page for any title, and saving favorites with your own notes and tags.

I built it as a take-home project based on the [Coding Challenge React.js](https://github.com/bhargavjoshi/Coding-Challenge-React.js) brief.

## What you can do

Search by title, author, or genre. You only need to fill in one field — the form will tell you if you try to search with everything empty.

When results come back, click a book to see more info on its own page. From there, or straight from the search results, you can add books to your favorites list. Favorites stay saved in your browser, and you can add a personal note or tags on the detail page.

There are three main routes:

- `/` — search
- `/book/:id` — book details
- `/favorites` — saved books

## Tech used

- React 19 + TypeScript
- Webpack + Babel for bundling and transpilation
- React Router for navigation
- Redux Toolkit for favorites state
- Material UI for the UI
- SCSS for custom styling
- Vitest and React Testing Library for tests

## Getting started

You’ll need Node.js 18 or newer and npm.

Clone the repo, then install dependencies:

```bash
npm install
```

### API key (recommended)

Google Books works without a key, but you’ll hit rate limits quickly. For a smoother experience:

1. Copy `.env.example` to `.env`
2. Add your Google Books API key as `VITE_GOOGLE_BOOKS_API_KEY`
3. Restart the dev server

### Run the app

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
npm run build    # production build
npm run preview  # preview the production build locally
npm test         # run tests once
npm run test:watch  # run tests in watch mode
npm run lint     # run oxlint
```

## Project layout

```
src/
├── api/         # API calls to Google Books
├── utils/       # Shared helpers (API endpoints, etc.)
├── components/  # Reusable UI pieces
├── pages/       # Search, details, and favorites screens
├── store/       # Redux store and favorites logic
├── styles/      # Global SCSS
├── theme/       # MUI theme setup
├── types/       # TypeScript interfaces
└── test/        # Test setup and routing tests
```

## How it’s put together

**Routing** — React Router handles page changes. The book details page is lazy-loaded so the first load stays lighter.

**State** — Favorites live in Redux Toolkit and sync to `localStorage`. Components use a `useFavorites` hook so the API stays simple.

**Search** — The form uses MUI field validation. Queries are sent to Google Books using `intitle:`, `inauthor:`, and `subject:` filters depending on what you filled in.

**Styling** — MUI covers most of the UI. SCSS handles layout and the extra polish on top.

**Performance** — Memoized list items, lazy-loaded details route, and a “Load more” button for pagination instead of loading everything at once.

## Decisions / trade-offs

- I used **Redux Toolkit** for favorites because the requirement asked for a global state solution, and it keeps updates predictable as the app grows.
- Favorites are stored in **`localStorage`** (not a backend) because it’s simple and works offline, but it’s limited to the current browser/device.
- The Google Books requests go through a **dev-server proxy** (`/api/books`) to avoid CORS headaches in development.
- I kept tests focused on **user flows** (routing, form validation, favorites) instead of trying to unit-test everything.

## Webpack / Babel configuration

The app is bundled with **Webpack 5** and transpiled with **Babel** (not Vite for dev/build).

| File | Purpose |
|------|---------|
| `webpack.config.cjs` | Entry, loaders, dev server, API proxy, env injection |
| `babel.config.cjs` | `@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript` |

**Loaders**
- `babel-loader` — TypeScript + JSX → JavaScript
- `sass-loader` / `css-loader` / `style-loader` — SCSS and CSS

**Dev server** (`npm run dev`)
- Host: `127.0.0.1:3000`
- Proxies `/api/books` → Google Books API (same as before)
- `historyApiFallback` for React Router

**Environment variables** — `.env` values are injected via `webpack.DefinePlugin` so existing `import.meta.env.VITE_*` usage still works.

**Tests** — Vitest still uses `vite.config.ts` only for the test runner.

## API

The app talks to Google Books like this:

```
GET https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=20&startIndex=0
```

In development, requests go through a Webpack dev-server proxy at `/api/books` to avoid CORS issues.

## License

MIT

# Family Movie Night Concierge

Pick tonight's family movie in under 60 seconds: choose who's watching, pick a mood, language, and optional runtime, get 3 personalized picks, spin a wheel to decide, and go watch. The app learns preferences over time from natural-language feedback.

## Architecture

A fully static Progressive Web App — no backend, no login, no database server. Everything runs in the browser and deploys for free on GitHub Pages. See `docs/adr/` for the reasoning behind each major decision:

- [ADR-001](docs/adr/ADR-001-pwa-vs-native.md) — PWA instead of a native app
- [ADR-002](docs/adr/ADR-002-no-backend-static-architecture.md) — no backend, fully static
- [ADR-003](docs/adr/ADR-003-deepseek-client-side-ai.md) — DeepSeek as the client-side AI provider
- [ADR-004](docs/adr/ADR-004-tmdb-build-time-plus-manual-catalog.md) — TMDB at build time + hand-curated catalog
- [ADR-005](docs/adr/ADR-005-browser-only-storage.md) — browser-only storage, no sync

## Tech stack

React + Vite + TypeScript + Tailwind CSS + `vite-plugin-pwa`, deployed via GitHub Actions to GitHub Pages.

## Cost

Designed to be entirely free to run:

- **Hosting**: GitHub Pages + GitHub Actions — free and unlimited for a public repo.
- **Movie metadata**: TMDB API — free, used only in a local dev script at catalog-authoring time, never at runtime.
- **AI**: DeepSeek API — pay-per-token (not free-tier), using a small existing balance; every AI call is optional and the app works fully with no key configured (see ADR-003).

No API key of any kind is ever committed to this repo or bundled into the deployed app. See the security notes below.

## Local development

```bash
npm install
npm run dev      # start the dev server
npm test         # run the engine/storage unit tests
npm run lint      # eslint
npm run build     # type-check + production build
```

## Security notes

- The DeepSeek API key is entered by the user into the in-app Settings screen and stored only in the browser's `localStorage`. It is never read from an environment variable, never logged, and never included in the built bundle.
- The TMDB API key is only used by `scripts/fetchTmdbData.ts`, a manual dev-only script, via a local `.env` file (see `.env.example`). That file is gitignored and never referenced by any code that ships to production.
- There is no authentication. Anyone with access to the device/browser can view or edit family profiles and history — an accepted tradeoff for a private household device (see ADR-005).

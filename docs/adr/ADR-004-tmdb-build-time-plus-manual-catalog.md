# ADR-004: TMDB used only at build/curation time, plus a hand-curated streaming catalog

## Decision

Use the free TMDB API only inside a local, dev-only script (`scripts/fetchTmdbData.ts`) to fetch poster/runtime/language/rating metadata while authoring the movie catalog. The output is committed as a static `src/data/catalog.seed.json`. Streaming-platform availability (Netflix/JioHotstar/Prime/Sun NXT/YouTube) is hand-tagged in that same file, since no reliable free "where to stream in India" API exists. The deployed app never calls TMDB at runtime and never ships a TMDB key.

## Reason

- TMDB is free and easy to use for metadata, but there's no need to call it live in production — the family's catalog is a small, slow-changing list (~30-50 movies), not a live-updating database.
- Doing enrichment once at curation time means the production bundle has zero external runtime dependency for its core catalog, works fully offline after first load, and has no TMDB-key-exposure question to resolve (it never leaves the developer's machine).
- No free/reliable India-specific "streaming availability" API exists, so this data has to be maintained by hand regardless of how metadata is sourced.

## Alternatives Considered

- **Live runtime TMDB calls** — would allow a larger/dynamic catalog without re-running a script, but adds an unnecessary runtime dependency and network requirement for what is, at family scale, a small and infrequently-changing list.
- **JustWatch-style scraping for availability** — fragile, likely against terms of service, and overkill for a household app. Rejected.
- **Fully manual entry with no TMDB at all** — avoids any API dependency but means hand-typing posters/runtimes/ratings for every movie, which TMDB provides for free with far less effort.

## Consequences

- Adding new movies later means re-running `scripts/fetchTmdbData.ts` (with a local, gitignored `.env` TMDB key) or hand-editing the JSON — not something end users do from within the deployed app.
- Streaming availability will drift over time (platforms rotate catalogs) and needs periodic manual review; this is a known, accepted limitation, not a bug.

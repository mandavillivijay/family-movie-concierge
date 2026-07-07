# ADR-005: Browser-only storage, no cross-device sync

## Decision

Store all family profiles, movie-night history, feedback, and settings (including the DeepSeek API key) in the browser only — IndexedDB (via `idb-keyval`, wrapped in repository modules under `src/storage/`) for structured records, and `localStorage` for settings. There is no server-side database and no sync between devices in Phase 1.

## Reason

- Matches the no-backend, no-login constraints (ADR-002): there is nowhere else to put the data without introducing a server or a third-party cloud database.
- Sufficient for the primary use case: one or two shared household devices/phones used for movie-night decisions.
- Repository modules isolate all storage access behind a small interface, so the underlying mechanism (or a future sync layer) can change without touching calling code.

## Alternatives Considered

- **Firebase/Supabase free tier for cross-device sync** — would let every family member's phone share the same history/preferences, but reintroduces an external backend dependency and an account to manage, explicitly deferred rather than adopted now.

## Consequences

- History and preferences are per-device: if movie nights are logged from different phones, each phone builds its own picture. Using one "family device" (e.g. the living room tablet/phone) for the wizard and feedback avoids fragmentation.
- Clearing browser data/storage or switching devices loses all history/preferences with no built-in recovery. An export/import feature is a reasonable Phase 2 addition if this becomes a pain point.
- No authentication also means anyone with access to the device can view or edit family profiles and history — an accepted tradeoff for a private household device.

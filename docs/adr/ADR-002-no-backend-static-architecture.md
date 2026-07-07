# ADR-002: No backend — fully static architecture

## Decision

Ship the entire application as static files (HTML/CSS/JS) hosted on GitHub Pages. There is no server component. The recommendation engine, filtering, and spinner all run client-side in the browser.

## Reason

- GitHub Pages only serves static files, and the goal is zero-cost, independently-hosted deployment.
- A family of 3-5 users doesn't need server-side compute; all recommendation logic is cheap enough to run entirely in the browser.
- Removes an entire category of maintenance: no server to deploy, patch, monitor, or pay for (even free tiers like Render/Fly.io cold-start or expire).

## Alternatives Considered

- **FastAPI on a free-tier host (Render/Fly.io/Railway)** — still free, but adds a second deployment target, cold-start latency on free tiers, and an extra moving part for no functional gain at this scale.
- **Serverless functions to proxy AI/API calls** — would let us hide API keys server-side, but reintroduces infrastructure to manage and contradicts the "entirely free, independently hosted on GitHub Pages" goal.

## Consequences

- Any third-party API used at runtime (AI provider) must support direct browser calls (CORS), which constrains provider choice — see ADR-003.
- API keys for user-facing runtime features must be handled client-side (user-supplied, stored locally) rather than hidden behind a server — see ADR-003 and the security notes in the README.
- No cross-device data sync in Phase 1 — see ADR-005.

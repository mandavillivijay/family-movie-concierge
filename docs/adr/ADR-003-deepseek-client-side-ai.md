# ADR-003: DeepSeek as the client-side AI provider, behind an abstraction

## Decision

Use the DeepSeek API (OpenAI-compatible `chat/completions` endpoint) as the AI layer, called directly from the browser using an API key the user enters into the in-app Settings screen. The integration lives entirely behind an `AIProvider` interface (`src/ai/AIProvider.ts`) with a `NullAIProvider` fallback, so the app is fully usable with zero AI configured and so the concrete provider can be swapped later without touching any calling code.

## Reason

- No backend (ADR-002) means any AI calls must happen directly from the browser, which requires the provider to support CORS for arbitrary origins. This was verified empirically: an `OPTIONS` preflight against `https://api.deepseek.com/chat/completions` returns `access-control-allow-origin` reflecting whatever `Origin` is sent, confirming direct browser calls work without a proxy.
- The user already holds a small DeepSeek balance (~$2) they'd rather use than start a new Gemini account, and DeepSeek's OpenAI-compatible API is simple to call directly.
- Family-scale usage (a handful of AI calls per movie night for one-line explanations, plus occasional feedback parsing) is tiny relative to that balance.
- Per the PRD's "AI as a recommendation layer, not a database" principle, no core functionality (filtering, ranking, spinner) depends on AI — only supplementary explanations and preference-parsing do, so a missing/expired key or an AI outage never breaks the app.

## Alternatives Considered

- **Google Gemini free tier** — originally planned; genuinely free with a generous rate limit and documented client-side/browser usage, but the user prefers to spend down an existing DeepSeek balance instead. The `AIProvider` abstraction keeps this available as a drop-in alternative if the DeepSeek balance runs out.
- **OpenAI API** — also OpenAI-compatible, but does not enable CORS for direct browser calls in the general case (designed for server-side use), which would force a backend proxy and contradict ADR-002.
- **A backend proxy to hide the key** — would allow using any AI provider (CORS-restricted or not) but reintroduces a server, contradicting ADR-002.

## Consequences

- No free tier: this is pay-per-token. It is the only "genuinely free forever" property the app gives up (see the README's cost notes). Usage is expected to stay well within the existing balance for years of family use.
- The DeepSeek API key must never be committed to the repo or shipped in the built bundle — it is entered by the user at runtime and stored only in the browser's `localStorage`. See `docs/adr/ADR-002` and the project's security notes.
- If DeepSeek ever tightens its CORS policy or the balance is exhausted, the app degrades to `NullAIProvider` (templated explanations, no-op feedback parsing) rather than breaking, and a new provider can be added behind the same interface.

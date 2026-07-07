# ADR-001: Progressive Web App instead of a native app

## Decision

Build Family Movie Night Concierge as a Progressive Web App (PWA), installable from the browser on Android Chrome, iPhone Safari, and iPad Safari.

## Reason

- One codebase covers every device in the family, which run a mix of Android and iOS.
- Installable home-screen icon and app-like experience without an app store.
- Deployable for free on GitHub Pages.
- No build/signing pipeline or store review process to maintain.

## Alternatives Considered

- **React Native** — shares more logic with a hypothetical future native app, but adds a second toolchain, native build/signing, and app-store distribution for no benefit at family scale.
- **Flutter** — same tradeoff as React Native, plus a different language/ecosystem than the rest of the stack.

## Consequences

- No native device integrations (e.g. web push notifications are unavailable on iOS PWAs) — the Phase 2 "Telegram reminders" idea should use its own bot/channel rather than push notifications.
- Add-to-Home-Screen on iOS has no automatic install prompt; the app needs `apple-mobile-web-app-capable` meta tags and must document the manual "Share → Add to Home Screen" step.

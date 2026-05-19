# Phase 0: Research — 007 Stag Do Website

All NEEDS CLARIFICATION items from the Technical Context have been resolved below. The spec's clarification session already pinned the user-visible behaviour; this document pins the technical-stack choices that were left open.

## R1: Frontend framework pairing for TanStack Router

**Decision**: React 18 + TypeScript

**Rationale**: TanStack Router's React adapter (`@tanstack/react-router`) is the most mature and best-documented binding. The spec mandates TanStack Router (FR-007) but is silent on the framework; React is the conventional pairing in 2026 and offers the largest pool of examples, type definitions, and matching tooling.

**Alternatives considered**:
- Solid + `@tanstack/solid-router` — viable but smaller community and less example code; no upside for a disposable single-event site.
- Vue + `@tanstack/vue-router` — TanStack Router's Vue adapter is less mature than the React one.

## R2: Build tool

**Decision**: Vite 5

**Rationale**: TanStack Router ships an official Vite plugin (`@tanstack/router-plugin/vite`) that generates `routeTree.gen.ts` from the file-based routes. Vite gives instant HMR, fast cold starts, and produces a static `dist/` directory that drops directly onto any static host. No SSR is required (FR-006), so we use Vite's plain SPA template, not TanStack Start.

**Alternatives considered**:
- TanStack Start — overkill (it's an SSR/full-stack framework; spec explicitly says no SSR).
- Webpack / Parcel — no advantage; Vite is faster and the official plugin path.

## R3: Routing mode (file-based vs code-based)

**Decision**: File-based routing

**Rationale**: The routing tree is shallow (one root layout, one index, one dynamic day route). File-based routing keeps the route tree self-evident from the directory layout and auto-generates type-safe route definitions. The Vite plugin watches `src/routes/` and regenerates `routeTree.gen.ts` on save.

**Alternatives considered**:
- Code-based routing — fine but adds boilerplate; nothing in this app benefits from runtime route construction.

## R4: PDF → WebP conversion

**Decision**: One-time, out-of-band conversion using a system CLI (e.g., `pdftoppm` from poppler-utils, then `cwebp`; or `magick` from ImageMagick). The result is committed as `src/assets/background.webp`. The conversion command is documented in `quickstart.md` for repeatability but is **not** part of the build pipeline.

**Rationale**: The asset will not change during development. Adding a build-time converter (sharp, vite-imagetools) introduces a dependency and a native-binary risk for a single conversion that takes seconds. Committing the optimised WebP is simpler and ensures every dev/CI build sees the same bytes.

**Alternatives considered**:
- Build-step conversion via `sharp` or `vite-imagetools` — unnecessary indirection for a single static asset.
- Keep the PDF and render at runtime via PDF.js — heavy, slow, and the spec already required converting to a web image format.

## R5: YouTube embed approach

**Decision**: Plain `<iframe>` pointing at `https://www.youtube-nocookie.com/embed/{VIDEO_ID}`, rendered inside the fade-in container. No `react-youtube` or `react-player` dependency. Use the privacy-enhanced `youtube-nocookie.com` host to avoid the third-party-cookie consent dance.

**Rationale**: The spec specifies "default controls visible, sound on, no extra params beyond the video ID". A plain iframe is one tag with zero JS dependencies, matches the requirement exactly, and gives YouTube's native "Video unavailable" message for free (FR-005b).

**Alternatives considered**:
- `react-youtube` / `react-player` — adds JS to wire up player events we don't need.
- YouTube IFrame Player API — required only for programmatic playback control; we don't need any (no autoplay, no event hooks).

## R6: Fade-in animation

**Decision**: Pure CSS transition on `opacity` (and `visibility` for accessibility — hidden until reveal). One boolean state in `DelayedVideo.tsx` flips after a `setTimeout(…, 5000)` inside `useEffect`. Transition duration ~600 ms.

**Rationale**: One state variable, one effect, one CSS rule — no animation library, no `framer-motion`. Easy to reason about and trivially testable with Vitest's fake timers.

**Alternatives considered**:
- `framer-motion` — extra ~30 KB for a single fade.
- Web Animations API — fine but more verbose than two CSS lines.

## R7: Day-name → video map shape

**Decision**: A single `const` TypeScript object literal in `src/config/days.ts`:

```ts
export const DAY_VIDEOS = {
  one: 'YOUTUBE_VIDEO_ID_HERE',
  two: 'YOUTUBE_VIDEO_ID_HERE',
} as const satisfies Record<string, string>

export type DayName = keyof typeof DAY_VIDEOS
```

The dynamic route resolves the `dayName` URL segment against `DAY_VIDEOS`; if the segment isn't a key, the route's `beforeLoad` redirects to `/day-one` (FR-008).

**Rationale**: `as const satisfies Record<string, string>` is idiomatic for a typed lookup map: literal-key inference (so `DayName` is a precise union) plus structural validation that every value is a string. This is `as const` on a literal, not a cast away from `unknown`, so it complies with the user's TS rule against unsafe `as` casts.

**Alternatives considered**:
- `Record<string, string>`-typed variable — loses the literal union for `DayName`.
- A runtime `Map` — no TypeScript benefit, more boilerplate.
- A JSON file — explicitly ruled out by the clarification session.

## R8: Routing for unknown days

**Decision**: Inside the dynamic route's `beforeLoad`, look up `params.dayName` in `DAY_VIDEOS`; if absent, throw `redirect({ to: '/day-$dayName', params: { dayName: 'one' } })`. Same pattern in the index route (`/`) for the bare-host case. The root `__root.tsx` defines a `notFound` component that also redirects to `/day-one`, covering arbitrary non-day URLs (e.g., `/foo`).

**Rationale**: TanStack Router's `redirect` thrown in `beforeLoad` runs before the component mounts, so the user never sees a flash of an empty state. Centralising the fallback in `beforeLoad` plus a top-level `notFound` covers every "invalid URL" path with the same behaviour.

**Alternatives considered**:
- A catch-all `splat` route + redirect — works, but the dynamic-route-level check is more direct and pairs naturally with the existing URL pattern.

## R9: Testing strategy

**Decision**:
- **Vitest unit test for `days.ts`**: assert each value in `DAY_VIDEOS` matches the YouTube video ID regex `^[A-Za-z0-9_-]{11}$`. Real value: catches typos at commit time.
- **Vitest + React Testing Library component test for `DelayedVideo.tsx`**: with `vi.useFakeTimers()`, assert the YouTube iframe is absent from the DOM (or the container has `visibility: hidden`) initially, then advance timers by 5000 ms and assert the iframe is rendered/visible. Real value: catches a regression where someone removes the timeout, hardcodes the wrong delay, or mounts the iframe immediately.
- **No test for the route file itself**: it's pure glue (parse param → look up map → render or redirect), already covered by the config test and the component test.
- **No E2E (Playwright) framework**: the only behaviour beyond what unit tests cover is "the WebP loads" and "the YouTube iframe loads", both obvious in any manual browser check and not worth the install + CI minutes for a one-weekend disposable site.

**Rationale**: Per the user's TDD principle: "consider its utility — if the only thing left under test is trivial orchestration, skip the test". Two tests, each with concrete real-world value; no mock-heavy ceremony.

**Alternatives considered**:
- Full Playwright E2E — disproportionate for a one-weekend site.
- Snapshot tests — brittle and add no behavioural value.

## R10: Static hosting choice

**Decision**: Defer the choice between Vercel, Netlify, and GitHub Pages until deployment time; the build output is a generic static `dist/` folder that any of them serve unchanged. `quickstart.md` documents the GitHub Pages route since the project already lives on GitHub.

**Rationale**: All three hosts accept the same static bundle and switching is trivial. No need to lock in now; locking in would add config (e.g., `vercel.json`) that we'd discard if the user picked another host.

**Alternatives considered**: N/A — explicitly chose to defer.

## R11: Package manager

**Decision**: npm (recorded via `package.json#packageManager`)

**Rationale**: Universally available, no extra install step, and the dependency tree is tiny (~6 direct deps). No monorepo means no benefit from pnpm's workspace or hardlink savings. Pinning `packageManager` ensures CI uses the same version.

**Alternatives considered**:
- pnpm — faster and stricter, but adds an install step for marginal gain at this scope.
- yarn — no advantage over npm for this scope.

## R12: SPA routing on static hosts (404 → index.html)

**Decision**: Configure each potential host (or document the config) so that any unknown path falls back to `index.html` and is then handled by TanStack Router.
- **Vercel**: framework auto-detects SPA; no extra config.
- **Netlify**: `_redirects` file with `/* /index.html 200`.
- **GitHub Pages**: copy `dist/index.html` to `dist/404.html` as part of the build (one-line postbuild script).

**Rationale**: All client-side routers need this fallback or direct loads of `/day-one` will 404 from the host. Documenting per-host config in `quickstart.md` keeps the choice deferred (R10) without surprises at deploy time.

**Alternatives considered**:
- Use `HashHistory` (`/#/day-one`) — uglier URLs, ruled out as visibly worse for a shareable prank link.

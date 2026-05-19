# Data Model — 007 Stag Do Website

The application has no persistent storage and no remote data. The only "data" is build-time configuration compiled into the bundle plus the in-memory state of the video-reveal animation.

## Entities

### Day Page

A configured day route presenting a single YouTube video over the shared background.

| Field      | Type     | Source / Validation                                                          |
|------------|----------|------------------------------------------------------------------------------|
| `name`     | `string` | URL segment after `/day-`; must match a key of `DAY_VIDEOS` (`DayName`)      |
| `videoId`  | `string` | YouTube 11-character video ID, regex `^[A-Za-z0-9_-]{11}$`                   |

**Lifecycle**: Static. Adding a new day = add an entry to `src/config/days.ts` and ship a new build.

**Validation rules**:
- The set of valid `name` values is exactly the keys of `DAY_VIDEOS` at compile time.
- Any URL segment not in that set causes a load-time redirect to `/day-one` (handled inside the route's `beforeLoad`, FR-008).
- Each `videoId` is validated at unit-test time by `tests/unit/days.test.ts` against the YouTube ID regex.

### Video Reveal

The timed UI sequence shown on every Day Page.

| Field          | Type     | Value  | Source                                                  |
|----------------|----------|--------|---------------------------------------------------------|
| `delayMs`      | `number` | `5000` | FR-003 (≈5 s delay before fade)                         |
| `transitionMs` | `number` | `600`  | Decision in research.md R6 (smooth half-second fade)    |

**Lifecycle**:
1. Component mounts → container is `opacity: 0; visibility: hidden`.
2. After `delayMs`, state flips → container becomes `opacity: 1; visibility: visible`, transitioning over `transitionMs`.
3. User clicks YouTube's native play button (no autoplay, FR-002).

These constants live as `const`s inside `src/components/DelayedVideo.tsx`. Promote to `src/config/days.ts` only if a second component ever needs them.

## Relationships

`Day Page` 1—1 `Video Reveal` — every day route renders the same video-reveal mechanism around a different YouTube video ID.

## Out of scope

- No user model (no auth, "anyone with the link can view").
- No analytics / event log.
- No remote / runtime configuration.
- No per-day overrides of `delayMs` or `transitionMs`.

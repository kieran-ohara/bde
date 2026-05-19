# Contract: Day Configuration Map

The `src/config/days.ts` module exports the canonical day-name → YouTube video ID mapping.

## Exports

```ts
export const DAY_VIDEOS: Readonly<Record<string, string>>

export type DayName = keyof typeof DAY_VIDEOS
```

The runtime shape is a plain `const` object literal declared with `as const satisfies Record<string, string>` so that `DayName` is a precise string-literal union (e.g., `'one' | 'two'`), not just `string`.

## Shape requirements

- `DAY_VIDEOS` MUST be declared with `as const satisfies Record<string, string>` so that:
  - `DayName` is a precise string-literal union.
  - The compiler enforces every value is a string.
- Keys MUST be lowercase ASCII words used in the URL: `/day-{key}`. Permitted character set: `[a-z]+` (e.g., `one`, `two`, `final`).
- Values MUST be YouTube 11-character video IDs (regex `^[A-Za-z0-9_-]{11}$`), not full URLs. The iframe URL is constructed in the component (`https://www.youtube-nocookie.com/embed/{id}`).

## Consumer contract

The dynamic route file `src/routes/day.$dayName.tsx` MUST:

1. Read `params.dayName` from TanStack Router.
2. In `beforeLoad`, if `params.dayName` is not a key of `DAY_VIDEOS`, throw:
   ```ts
   throw redirect({ to: '/day-$dayName', params: { dayName: 'one' } })
   ```
3. Otherwise, render `<DelayedVideo videoId={DAY_VIDEOS[dayName]} />` over the background.

## Test contract (`tests/unit/days.test.ts`)

- For every entry in `DAY_VIDEOS`:
  - The **key** MUST match `/^[a-z]+$/` (lowercase ASCII per the shape requirements above).
  - The **value** MUST match `/^[A-Za-z0-9_-]{11}$/` (YouTube video ID).
- The test MUST iterate dynamically over `Object.entries(DAY_VIDEOS)` so that adding a new day automatically extends test coverage without an edit to the test file.

## Non-goals

- No runtime validation of `videoId` shape (the unit test catches typos at commit time; runtime checks would add dead code).
- No fallback to a default video when an entry is missing (the contract is "key present or redirect", not "key present or default").

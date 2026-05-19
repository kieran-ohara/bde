# Contract: URL Routes

Defined by TanStack Router file-based routing under `src/routes/`. The Vite plugin generates `src/routeTree.gen.ts` from these files; do not hand-edit the generated file.

| Path             | File                          | Behaviour                                                                                          |
|------------------|-------------------------------|----------------------------------------------------------------------------------------------------|
| `/`              | `src/routes/index.tsx`        | `beforeLoad` throws `redirect({ to: '/day-$dayName', params: { dayName: 'one' } })`                |
| `/day-{name}`    | `src/routes/day.$dayName.tsx` | If `name` is a key of `DAY_VIDEOS`: render shared layout. Otherwise: redirect to `/day-one`.       |
| any other path   | `notFound` in `__root.tsx`    | The root `notFound` handler redirects to `/day-one` (covers e.g. `/foo`, `/about`, etc.).          |

## URL pattern

- The literal `day-` prefix is part of the route file name (`day.$dayName.tsx`), so TanStack Router resolves the URL `/day-one` to `params.dayName === 'one'`.
- Casing: the URL segment is treated as case-sensitive against the (lowercase) keys of `DAY_VIDEOS`. Uppercase or mixed-case input falls through to the redirect.

## Behaviour contract

- All redirects MUST happen in `beforeLoad` (or `loader`) so the browser never paints an empty or wrong page.
- The shared layout (`__root.tsx`) MUST render `<BackgroundImage />` regardless of route, so the WebP background is visible even during a brief redirect.
- The root `<Outlet />` is the only place day-specific content (`<DelayedVideo>`) is rendered.

## Static-host fallback

For SPAs on static hosts, every unknown URL must serve `index.html` so the client router can run. Per research.md R12:

- **Vercel**: auto-detected; no extra config.
- **Netlify**: include a `public/_redirects` with `/* /index.html 200`.
- **GitHub Pages**: copy `dist/index.html` to `dist/404.html` as a postbuild step.

## Non-goals

- No nested routes (no `/day-one/extras`, no `/admin`, etc.).
- No query-parameter-driven behaviour.
- No route-level data fetching beyond the synchronous `DAY_VIDEOS` lookup.

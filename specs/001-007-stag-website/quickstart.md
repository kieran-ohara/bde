# Quickstart — 007 Stag Do Website

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+
- A CLI for the one-time PDF → WebP conversion. Either:
  - `poppler-utils` (`brew install poppler`) for `pdftoppm`, plus `cwebp` from `webp` (`brew install webp`), OR
  - `imagemagick` (`brew install imagemagick`) for `magick` (which can write WebP directly when built with the WebP delegate).

## One-time asset preparation

Convert the source PDF to an optimised WebP that lives in the bundle.

Using poppler + cwebp (recommended for quality control):

```bash
pdftoppm -png -r 200 gh-compressed.pdf /tmp/bg
cwebp -q 80 /tmp/bg-1.png -o src/assets/background.webp
```

Using ImageMagick (single command, slightly less control):

```bash
magick gh-compressed.pdf[0] -density 200 -quality 80 src/assets/background.webp
```

Commit `src/assets/background.webp`. The `gh-compressed.pdf` source stays at the repo root as the canonical original (already tracked).

## Install

```bash
npm install
```

## Develop

```bash
npm run dev
```

Open `http://localhost:5173/day-one` in a browser. You should see:

1. The 007 background image immediately.
2. After ~5 seconds, the YouTube video container fades in over the centre.
3. Clicking play starts the video with sound on.

## Test

```bash
npm test
```

Runs Vitest. Two tests:

- `tests/unit/days.test.ts` — validates each `DAY_VIDEOS` entry is a valid YouTube video ID.
- `tests/unit/DelayedVideo.test.tsx` — validates the container is hidden initially and visible after the 5-second delay (uses `vi.useFakeTimers()`).

## Add a new day

1. Edit `src/config/days.ts`:
   ```ts
   export const DAY_VIDEOS = {
     one: 'dQw4w9WgXcQ',
     two: 'NEW_VIDEO_ID', // ← 11-character YouTube video ID
   } as const satisfies Record<string, string>
   ```
2. Run `npm test` to confirm the ID is valid.
3. Commit. The route `/day-two` is now live; `/day-foo` still redirects to `/day-one`.

## Build

```bash
npm run build
```

Produces a static `dist/` directory.

## Deploy

The build output is host-agnostic. Pick one:

- **Vercel** — `vercel deploy --prebuilt` after `vercel build`. SPA fallback is auto-detected; no extra config.
- **Netlify** — `netlify deploy --dir=dist --prod`. Add a `public/_redirects` file with `/* /index.html 200` so deep links work.
- **GitHub Pages** — easiest if the repo is already on GitHub. Add a postbuild step that copies `dist/index.html` to `dist/404.html` (so the SPA-fallback works), then deploy `dist/` via the `actions/deploy-pages` workflow.

## Verify before sharing the link

- [ ] `/day-one` shows the background and the video fades in at ~5 s.
- [ ] Each configured day URL plays its intended video.
- [ ] An unconfigured URL (e.g., `/day-unknown` or `/foo`) redirects to `/day-one`.
- [ ] On a phone, the layout is the same — the video container scales down with the viewport.
- [ ] `npm test` is green.

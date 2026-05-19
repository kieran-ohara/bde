# 007 Stag Do Website

A 007-themed prank site for a stag weekend. Each `/day-{name}` URL shows a full-screen background; after ~5 seconds a YouTube video container fades in.

See [specs/001-007-stag-website/quickstart.md](./specs/001-007-stag-website/quickstart.md) for setup, asset prep, dev, test, build, and deploy instructions.

```bash
npm install
npm run dev    # http://localhost:5173/day-one
npm test
npm run build  # → dist/
```

To add a day, edit `src/config/days.ts`. Routes that aren't in `DAY_VIDEOS` redirect to `/day-one`.

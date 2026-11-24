# hashimaziz46.github.io

Portfolio of Hashim Aziz, Project Manager & Scrum Master. Live at https://hashimaziz46.github.io.

Built with [Astro](https://astro.build), React and Tailwind CSS, starting from a free template by shadcn/studio (see `LICENSE.md`).

## Run locally

Needs Node 22.12 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

The site runs at http://localhost:4321.

## Publish

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`.

## Booking

The "Book a Call" card opens a Google Calendar appointment schedule. Change the link in `GOOGLE_BOOKING_PAGE` in `src/consts.ts`.

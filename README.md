# Work Flow — Task Organizer

[![Deploy to GitHub Pages](https://github.com/Rintu-chowdory/workflow-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/Rintu-chowdory/workflow-app/actions/workflows/deploy.yml)
[![Live App](https://img.shields.io/badge/live-rintu--chowdory.github.io-6366f1)](https://rintu-chowdory.github.io/workflow-app/)

A minimal task organizer with a dashboard, analytics, and persistent storage —
built with **React 18, Vite, Tailwind CSS and Supabase**, deployed
automatically to GitHub Pages on every push to `main`.

**Live:** https://rintu-chowdory.github.io/workflow-app/

## Features

- 📊 **Dashboard** — completion rate, priority split and *real* last-7-days
  activity computed from your tasks (no mock data)
- ☑️ **Tasks** — create, edit, delete, filter and search; overdue and
  due-today highlighting
- 📈 **Analytics** — weekly activity, 6-month trend, category breakdown,
  all from live Supabase data
- 🌙 **Dark mode** — toggle in the sidebar, persisted in localStorage,
  respects your system preference on first visit
- 🇩🇪 **Datenschutz & Impressum** — German legal pages with real contact data

## Tech

| Layer | Choice |
|---|---|
| UI | React 18 + React Router 6 |
| Build | Vite 4, Tailwind CSS 3 |
| Charts | Recharts |
| Storage | Supabase (Postgres) — `tasks` table |
| Deploy | GitHub Actions → GitHub Pages |

## Develop

```bash
npm ci
npm run dev       # local dev server
npm run build     # production build to dist/
```

The Supabase project and `tasks` table are already wired up in
`src/lib/supabase.js`. Status values are `todo` | `in-progress` | `completed`.

## License

MIT © Rintu Chowdory

# Neptune dashboard

The web dashboard for Neptune, built with Vite, React, TypeScript and Tailwind CSS.

**Status: foundation only.** The navigation, layout, design system and routes
exist. Nothing is connected to a backend yet, so there is no sign-in, no real
server data and nothing to save. See [Current limitations](#current-limitations).

## Requirements

- Node.js 22.22.2 or newer (the test tooling needs it)
- npm (a `package-lock.json` is committed; use `npm ci` for reproducible installs)

## Quick start

```bash
cd dashboard
npm install
npm run dev
```

The dev server prints a local address (usually http://localhost:5173).

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check, then create the production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint, including accessibility rules |
| `npm run typecheck` | Run the TypeScript compiler without producing output |
| `npm test` | Run the tests once |
| `npm run test:watch` | Run the tests and re-run on changes |

## Environment variables

Copy `.env.example` to `.env.local` and edit it. Real `.env` files are ignored by Git.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | No | Base URL of the Neptune backend, without a trailing slash. Leave empty until the backend exists. |
| `VITE_AUTH_START_URL` | No | Where "Continue with Discord" sends the browser. The backend defines it (name still to be agreed). Leave empty until then and the button stays inactive. `https` only, except `localhost`. |

> **Everything prefixed `VITE_` is bundled into the page and visible to every
> visitor.** Never put a Discord client secret, a bot token or any other secret
> in the dashboard. Those belong to the backend and the bot only.

An invalid value (for example, one that isn't an `http(s)` URL) shows a clear
"misconfigured" screen instead of the app.

## Routes

| Route | Page |
|-------|------|
| `/` | Redirects to `/login` |
| `/login` | Sign-in screen (button inactive until the backend provides a sign-in address; see [`docs/sign-in.md`](../docs/sign-in.md)) |
| `/servers` | Server selection (currently Coming soon) |
| `/g/:guildId/overview` | Server overview |
| `/g/:guildId/utilities` | Utilities (Coming soon) |
| `/g/:guildId/configuration` | Configuration (Coming soon) |
| `/g/:guildId/automation` | Automation (Coming soon) |
| `/g/:guildId/information` | Information (Coming soon) |
| `/g/:guildId/integrations` | Integrations (Coming soon) |
| `/me/personalisation` | Personal preferences, across all servers (Coming soon) |

Server settings live under `/g/:guildId/`. Personal settings live under `/me/`,
so the two can't be confused.

## Current limitations

These are deliberate. The backend is developed separately, and nothing here
pretends otherwise.

- **No working authentication.** The login screen is built, but sign-in is not. Discord sign-in will be handled entirely by the backend
  (OAuth2 authorisation code flow, secure HTTP-only session cookie). The
  dashboard never talks to Discord's OAuth endpoints, never handles tokens and
  never stores credentials in `localStorage`. Until the backend exists, every
  app page shows a "Preview" notice.
- **Route guards are not security.** `RequireSession` only decides what to show.
  The backend must verify the session and the person's server permissions
  (Manage Server or Administrator, and that Neptune is in the server) on every
  protected request.
- **No API endpoints.** `src/shared/api/client.ts` is a small, tested request
  helper (base URL from the environment, cookies included, typed errors). It
  contains no endpoint paths or response shapes. The backend owns the contract
  and will publish an OpenAPI schema into `../shared/contract/`; types are
  generated from that. See [`../docs/contract-workflow.md`](../docs/contract-workflow.md).
- **No CSRF scheme yet.** Cookie-authenticated writes will need the backend's
  CSRF protection. `apiRequest` accepts extra headers for it once defined.
- **No mock data.** There are no fake settings, statistics or API responses in
  the app. Tests use test-only fakes, which are never shipped.
- **No server selection.** `/servers` explains that selection will become
  available once Discord authentication and the backend are implemented. It
  has no controls. While the app is a preview, server pages can only be
  reached by typing their address, for example `/g/<server ID>/overview`.
- **Server IDs are only format-checked.** A well-formed ID in the address
  doesn't mean the person manages that server.
- **React Hook Form and `@hookform/resolvers`** are installed but not used by
  any page yet. They are there for the settings forms that come with the
  backend.

## Project structure

```
dashboard/
├─ index.html
├─ vite.config.ts         # Vite, Tailwind and Vitest configuration
├─ vercel.json            # SPA rewrite and basic security headers
├─ eslint.config.js
├─ .env.example
├─ public/
└─ src/
   ├─ main.tsx
   ├─ app/                # Application wiring
   │  ├─ App.tsx
   │  ├─ router.tsx       # The route table (lazy-loaded pages)
   │  ├─ queryClient.ts   # TanStack Query defaults
   │  └─ layouts/         # AppShell, Navigation, MobileNav, StandaloneLayout
   ├─ features/           # One folder per area of the product
   │  ├─ auth/            # Session state, route guard, login page
   │  ├─ guilds/          # Server list, server layout, server ID validation
   │  ├─ overview/  utilities/  configuration/
   │  ├─ automation/  information/  integrations/
   │  └─ personalisation/
   ├─ shared/
   │  ├─ api/             # Request helper and error types (no endpoints)
   │  ├─ config/          # env.ts and sections.ts (the section registry)
   │  ├─ hooks/  lib/
   │  └─ ui/              # Reusable components
   ├─ styles/index.css    # Tailwind and the design tokens
   └─ test/               # Test setup and helpers (not shipped)
```

## Reusable components (`src/shared/ui`)

`Button`, `ButtonLink`, `PageHeader`, `SectionHeading`, `SettingsRow`, `Switch`,
`TextField`, `ComingSoon`, `LoadingState` and `ErrorState`. The application
shell, sidebar and mobile drawer are in `src/app/layouts`.

`Switch` and `SettingsRow` aren't used by any page yet, because no setting
exists yet. They are tested and ready for the first real settings.

## Adding or enabling a section

1. Add or edit the entry in `src/shared/config/sections.ts`. Navigation and the Overview list read from it.
2. Add its page loader to `pages` in `src/app/router.tsx`.
3. Create the page in `src/features/<name>/`, exporting a `Component`.
4. Only set `status: 'available'` once the page does something real.

## Design system

Colours, fonts and animation are defined once in `src/styles/index.css` (Tailwind v4 `@theme`):
dark navy surfaces, with cyan reserved for active navigation, focus and primary
actions. The font is Geist, self-hosted through npm (no external font requests).

Text and control colours were checked against WCAG AA: 4.5:1 for text, 3:1 for
control borders and focus rings. Automated tests (axe-core) check the rendered
pages for accessibility problems, but can't measure colour contrast in a test
environment, so contrast was checked against the tokens directly. If you change
a colour token, check its contrast again.

Motion is limited, and `prefers-reduced-motion` is respected.

## Deploying to Vercel

Not yet done or tested. When you do:

- Set **Root Directory** to `dashboard`.
- Framework preset **Vite**, build command `npm run build`, output directory `dist`.
- Use Node.js 22.x.
- Set `VITE_API_BASE_URL` in the project's environment variables once a backend exists.
- `vercel.json` rewrites every path to `index.html`, so opening a nested route directly works.
- Discord OAuth redirect URIs must match exactly, so sign-in cannot work on
  Vercel preview URLs, which change on every deployment.

## Dependency notes

Some packages are intentionally not on their very latest major version:

- **TypeScript 6**, not 7: `typescript-eslint` doesn't yet support TypeScript 7.
- **ESLint 9**, not 10: `eslint-plugin-jsx-a11y` (accessibility linting) doesn't yet support ESLint 10. ESLint 9 is
  reported as no longer supported by its maintainers, so revisit this when the plugin supports ESLint 10.
- **React Router 7**, not 8: version 8 needs a newer Node and has API changes that haven't been evaluated.
- **`axe-core` directly**, not `vitest-axe`, which hasn't been updated for the current Vitest.

# Sign-in with Discord

Status: **the sign-in screen is built; sign-in itself does not work yet.** It needs
the backend, which does not exist. Nothing here is fake: no mock endpoints, no
simulated sessions, no stored credentials.

## What the dashboard implements today

- `/login` shows "Welcome to Neptune", a short explanation and a
  **Continue with Discord** button.
- The button has two honest states:
  - **Not configured** (today): it is visible but inert (`aria-disabled`), and a
    note says sign-in isn't available yet. Clicking does nothing.
  - **Configured** (`VITE_AUTH_START_URL` set): it is a plain link, so the browser
    makes a full-page navigation to that address. After the click it shows
    "Redirecting to Discord…".
- Fixed-wording notices for two outcomes: access wasn't granted, and sign-in
  failed. Nothing from the URL or the backend is ever displayed.
- A loading state ("Checking your session") when the session is being checked.
- Signed-out visitors to any app page are sent to `/login`, and the page they
  wanted is kept in router state (`from`). Someone already signed in who opens
  `/login` goes to `/servers`.
- While the backend isn't connected, the page offers "Browse the preview", which
  leads to the unprotected layout preview.
- The Discord logo is **not** drawn in code. The button uses a neutral sign-in
  icon. To use Discord's official mark, save it as `src/assets/discord-mark.svg`
  and it is picked up automatically. Follow Discord's brand guidelines.

## What is deliberately not implemented

- The OAuth flow. The dashboard never contacts Discord's OAuth endpoints, never
  builds an authorisation URL, never sees a client ID, secret, code or token, and
  never uses `localStorage`, `sessionStorage`, IndexedDB or cookies for
  credentials. A test scans the source to keep it that way.
- Reading the session. The shipped app's session state is always `unavailable`
  until the backend can say who is signed in.
- Returning to the page someone originally wanted after sign-in (see open decisions).

The route guard is a user-experience convenience only. The backend must enforce
access on every request.

## Intended flow

1. Someone selects **Continue with Discord**.
2. The browser navigates to the backend's authorisation endpoint.
3. The backend sends the browser to Discord with the `identify` and `guilds` scopes.
4. Discord redirects to the backend's callback.
5. The backend validates the response and establishes a session.
6. The backend redirects the browser to `/servers`.

## What the backend must provide

- **An authorisation endpoint** that starts the flow: generates and stores a
  single-use `state` (bound to the browser, for example in a short-lived cookie
  or server-side record), then redirects to Discord with scopes `identify guilds`.
- **A callback** that:
  - validates `state` and rejects missing, reused or expired values;
  - exchanges the code for tokens server-side with the client secret;
  - fetches the user and their servers, and keeps Discord tokens on the server
    only (never in the browser);
  - creates a server-side session and sets a `Secure`, `HttpOnly`, `SameSite`
    cookie;
  - redirects to `/servers` on success;
  - redirects to `/login` with an error on failure (see open decisions), without
    leaking details.
- **Session lookup** so the dashboard can tell signed-in, signed-out and loading
  (contract request 1 in [`contract-workflow.md`](contract-workflow.md)) and sign out.
- **CSRF protection** for cookie-authenticated writes (contract request 8).
- **Authorisation on every server-scoped request**: membership and administrator
  permission are checked by the backend, using the Discord permission data, not
  by the dashboard.

## Scopes

- `identify`: who the person is.
- `guilds`: which servers they are in, and their permissions there.

No other scopes are requested, and there are no other sign-in providers.

## Environment variables

| Variable | Where | Status |
|----------|-------|--------|
| `VITE_AUTH_START_URL` | Dashboard | **Proposed name, not agreed with the backend.** The full address the button links to. Optional. Must be `https` (plain `http` only for `localhost`). |
| Discord client ID and secret, redirect URI, session secret | Backend only | Backend's decision. Never in the dashboard. |

`VITE_` values are public. The dashboard's value is only an address; it contains
no secret.

## Unresolved decisions

These are for the backend (coordinated with Codex) to decide. The dashboard has
not invented answers.

1. **The authorisation endpoint's address**, and whether it is on the same site as
   the dashboard. Same-site makes `SameSite` cookies simpler; a different domain
   needs a CORS and cookie strategy. Hosting is undecided.
2. **The name of `VITE_AUTH_START_URL`** and whether the dashboard should read the
   address from configuration at all, or from the OpenAPI contract.
3. **How failures reach the login page.** The dashboard currently reads an
   `error` query parameter on `/login`, using the standard OAuth code
   `access_denied` for "declined" and treating every other value as a generic
   failure. This is an assumption in `src/features/auth/signInOutcome.ts` and is
   the single place to change.
4. **Returning to the intended page.** The dashboard remembers the wanted page in
   router state, which does not survive a full-page redirect to Discord. If the
   backend should send people back to it, the backend must define how that
   destination is passed and validated (it must only accept same-site paths, to
   avoid open redirects).
5. **Redirect URIs.** Discord requires an exact match, so changing preview URLs
   will not work for sign-in.
6. **Sign-out and session expiry behaviour.**

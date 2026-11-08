# Architecture

This document records the decisions made so far. Nothing described as
"planned" exists yet. Only the bot foundation (`/ping` and `/tools` with
placeholder categories) is implemented.

## Components

| Component | Technology | Hosting | Status |
|-----------|------------|---------|--------|
| Bot (`bot/`) | Python, discord.py, slash commands | Quaxly | Foundation implemented |
| Dashboard (`dashboard/`) | Vite, React, TypeScript, Tailwind CSS, npm | Vercel | Foundation implemented (layout and navigation only; no backend connection) |
| Backend (`backend/`) | FastAPI, developed separately | Not decided | Planned |
| Database | PostgreSQL, shared by the bot and the backend | Not decided | Planned |

The backend owns the database schema and migrations. The bot and the backend
should use a consistent data-access approach. How that is shared between them
is not yet decided (see "Open items").

## Authentication and permissions

- Discord OAuth2, handled entirely by the backend. The dashboard's sign-in screen
  is built and waits for the backend; see [`sign-in.md`](sign-in.md).
- All authentication and server-permission checks happen on the backend.
  Anything the dashboard hides or disables is a convenience only, never
  access control.
- The client secret and the bot token exist only on the backend and the bot.
  The dashboard may only be given public values (anything prefixed `VITE_` is
  visible to every visitor).

## Dashboard sections

All seven sections remain part of the navigation. Sections without working
functionality are shown as "coming soon", with no placeholder settings and no
simulated behaviour.

| Section | Scope | First release |
|---------|-------|---------------|
| Overview | Per server | Yes |
| Utilities | Per server | Yes |
| Configuration | Per server | Yes |
| Personalisation | Per user | Yes |
| Automation | Per server | Coming soon |
| Information | Per server | Coming soon |
| Integrations | Per server | Coming soon |

Personalisation is per user, so it sits outside the server-scoped routes.

## Configuration source

Two layers are kept separate:

- **Catalogue:** which tools and categories exist. Static and versioned with
  the code. Today this is `bot/utils/categories.py`.
- **Configuration:** per-server and per-user values. Stored in PostgreSQL, with
  the schema owned by the backend. The bot and the dashboard must eventually
  read the same source.

## Approved first vertical slice (not yet implemented)

A small end-to-end slice so the first dashboard settings change real bot
behaviour:

1. Per-server enabling and disabling of tool categories.
2. A per-user private reply preference.
3. `/tools` respects the categories enabled for the server.
4. `/ping` and `/tools` respect the user's private reply preference.

### Private replies: slash commands versus prefix commands

Discord only supports private ("ephemeral") responses for interactions, which
includes slash commands and component interactions such as buttons and select
menus. Responses to traditional prefix commands are ordinary channel messages
and cannot be ephemeral. Neptune is slash-command only today, so the
preference can be honoured everywhere. If prefix commands are ever added, the
behaviour of the preference for them (for example ignoring it, or replying by
direct message) must be decided explicitly before implementation.

## Open items

- Backend and database hosting providers.
- How the bot and backend share data-access code, and whether that works with
  the bot's host. No GitHub-URL dependency will be introduced until the shared
  package structure is established and deployment compatibility is verified.
- The exact settings in Configuration beyond the vertical slice.
- Whether a host working directory of `bot/` is supported by the bot's host.

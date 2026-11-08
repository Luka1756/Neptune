# Neptune
Neptune is a multipurpose Discord utility bot built to bring a collection of useful tools into one place. From Discord utilities and text tools to converters, information lookups, and other handy features, Neptune is designed to make everyday tasks quicker and easier without unnecessary complexity.

## Repository layout

This is a monorepo. Each part is developed and deployed independently.

| Path | Purpose | Status |
|------|---------|--------|
| `bot/` | The Discord bot (Python, discord.py) | Working foundation: `/ping` and `/tools` |
| `dashboard/` | Web dashboard (Vite, React, TypeScript, Tailwind CSS) | Foundation: layout and navigation only, no backend yet |
| `backend/` | API (FastAPI) and database schema (PostgreSQL), developed separately | Planned |
| `shared/` | API contract snapshot and, later, shared definitions | Placeholder |
| `docs/` | Architecture notes and the API contract workflow | In progress |
| `scripts/` | Repository-level helper scripts, such as the CI smoke test | In use |

## Running the bot

The bot must be started from inside `bot/`:

```bash
cd bot
pip install -r requirements.txt
cp .env.example .env      # then add your bot token
python bot.py
```

See [`bot/README.md`](bot/README.md) for the full setup guide. If you deploy
the bot to a host, set its working directory (or start command) to `bot/`,
for example `cd bot && python bot.py`.

## Running the dashboard

```bash
cd dashboard
npm install
npm run dev
```

The dashboard is a layout preview for now: the sign-in screen is built, but
signing in and server data need the backend, which doesn't exist yet
(see [`docs/sign-in.md`](docs/sign-in.md)). See [`dashboard/README.md`](dashboard/README.md)
for scripts, environment variables and current limitations.

## Further reading

- [`docs/architecture.md`](docs/architecture.md): the planned architecture and decisions so far
- [`docs/contract-workflow.md`](docs/contract-workflow.md): how the dashboard and backend agree on the API

# Neptune

Neptune is a multipurpose Discord utility toolbox. It isn't a moderation,
music, economy, or AI bot -- its job is to provide a growing collection of
genuinely useful, focused tools, all accessible through Discord slash
commands.

This is the **foundation**: project structure, the bot itself, a `/ping`
health check, and an interactive `/tools` menu with placeholder categories.
Actual tools get added incrementally on top of this.

## Project structure

```
neptune/
├── bot.py                 # Entry point: creates the bot, loads cogs, syncs commands
├── config.py               # Loads settings from environment variables / .env
├── requirements.txt
├── .env.example             # Copy to .env and fill in your token
├── cogs/                    # Each file is a self-contained group of commands
│   ├── general.py            # /ping
│   └── tools.py               # /tools (the interactive menu)
└── utils/                   # Shared helpers used across cogs
    ├── categories.py          # The list of tool categories + placeholder tools
    └── embeds.py               # Consistent embed styling
```

To add a new tool later, create a new file under `cogs/` (e.g.
`cogs/timestamp.py`) with its own `Cog` class and `setup()` function, then
add its module path to the `INITIAL_COGS` list in `bot.py`. Keeping each
tool in its own file means the project stays easy to navigate as it grows.

## Setup

### 1. Create a Discord application and bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application**, name it (e.g. "Neptune"), and create it.
3. Go to the **Bot** tab, click **Reset Token** to reveal/generate your bot token, and copy it. Keep this secret.
4. Under **Installation** (or **OAuth2 → URL Generator**), select the `bot` and `applications.commands` scopes, then whatever permissions you want Neptune to have, and use the generated URL to invite it to your server.

### 2. Install dependencies

Requires Python 3.11+.

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure your token

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
DISCORD_TOKEN=your-bot-token-here
GUILD_ID=your-server-id-here     # optional, see below
```

**About `GUILD_ID`:** Slash commands synced globally can take up to an hour
to show up everywhere. If you set `GUILD_ID` to your test server's ID,
commands sync to that one server instantly, which is much faster while
developing. Leave it blank when you're ready to deploy globally.

(To get a server ID: enable Developer Mode in Discord's Settings →
Advanced, then right-click your server icon → Copy Server ID.)

### 4. Run the bot

```bash
python bot.py
```

You should see log lines confirming Neptune loaded its cogs, synced its
commands, and logged in. Then in Discord, try `/ping` and `/tools`.

## Configuration reference

| Variable       | Required | Description                                              |
|----------------|----------|------------------------------------------------------------|
| `DISCORD_TOKEN` | Yes      | Your bot's token from the Developer Portal.                |
| `GUILD_ID`      | No       | Server ID to sync commands to instantly during development.|

Secrets are **never** hard-coded -- they're always read from environment
variables via `.env` (loaded by `config.py`), and `.env` is excluded from
version control via `.gitignore`.

## Commands so far

- `/ping` -- confirms Neptune is online and shows latency.
- `/tools` -- opens the interactive toolbox menu. Pick a category from the
  dropdown to see the tools planned for it (currently placeholders marked
  "coming soon").

## Current categories

- **Discord** -- Snowflake decoder, permission calculator, embed builder, invite lookup
- **Text** -- Markdown formatter, ANSI color text, case converter, Unicode styler
- **Converters** -- Timestamp generator, color converter, number base converter
- **Information** -- Server/user/channel info
- **Miscellaneous** -- Minecraft server lookup, and whatever else doesn't fit elsewhere

To edit these, update `utils/categories.py`.

## Troubleshooting

- **`DISCORD_TOKEN is not set`** -- you haven't created `.env` yet, or it's empty. See step 3 above.
- **Slash commands don't show up** -- if you didn't set `GUILD_ID`, global syncs can take up to an hour. Set `GUILD_ID` in `.env` for instant syncing to one server while developing.
- **`Missing Access` / commands fail in a server** -- make sure Neptune was invited with the `applications.commands` scope (see step 1).

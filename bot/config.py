"""
Loads configuration from environment variables (and a local .env file, if present).

Never hard-code secrets in this file or anywhere else in the codebase.
Copy .env.example to .env and fill in your own values.
"""

import os

from dotenv import load_dotenv

load_dotenv()

# Required: your bot's token from the Discord Developer Portal.
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")

# Optional: a single guild (server) ID to sync slash commands to instantly,
# which is very useful during development since global syncs can take up to
# an hour to show up. Leave blank in .env to sync globally instead.
_guild_id_raw = os.getenv("GUILD_ID")
GUILD_ID = int(_guild_id_raw) if _guild_id_raw else None

"""
Neptune - a multipurpose Discord utility toolbox.

This is the entry point. It creates the bot, loads all cogs (tool modules)
from the cogs/ folder, and syncs slash commands with Discord on startup.

Run with:  python bot.py
"""

import asyncio
import logging

import discord
from discord.ext import commands

from config import DISCORD_TOKEN, GUILD_ID

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(name)s: %(message)s",
)
log = logging.getLogger("neptune")

# Neptune only uses slash commands, so we don't need privileged intents
# (message content, members, etc.) for the foundation. Add intents here
# later if a specific tool needs them.
INTENTS = discord.Intents.default()

# Every cog (tool module) that should be loaded on startup.
# Add new cogs here as you build more tools.
INITIAL_COGS = [
    "cogs.general",
    "cogs.tools",
]


class Neptune(commands.Bot):
    def __init__(self):
        super().__init__(
            # command_prefix is required by discord.py but unused, since
            # Neptune is a slash-command-only bot.
            command_prefix="!",
            intents=INTENTS,
            help_command=None,
        )

    async def setup_hook(self):
        """Called once, before the bot logs in. Loads cogs and syncs commands."""
        for cog in INITIAL_COGS:
            try:
                await self.load_extension(cog)
                log.info("Loaded cog: %s", cog)
            except Exception:
                log.exception("Failed to load cog: %s", cog)

        await self._sync_commands()

        @self.tree.error
        async def on_app_command_error(
            interaction: discord.Interaction, error: discord.app_commands.AppCommandError
        ):
            log.exception("Error while running /%s", interaction.command.name if interaction.command else "?",
                          exc_info=error)
            message = "Something went wrong while running that command. Please try again."
            try:
                if interaction.response.is_done():
                    await interaction.followup.send(message, ephemeral=True)
                else:
                    await interaction.response.send_message(message, ephemeral=True)
            except discord.HTTPException:
                # Interaction likely already expired or was responded to; nothing more we can do.
                pass

    async def _sync_commands(self):
        """
        Syncs slash commands with Discord.

        If GUILD_ID is set in .env, commands sync instantly to that one
        server, which is much faster for development. Otherwise, they sync
        globally (can take up to an hour to appear everywhere).
        """
        if GUILD_ID:
            guild = discord.Object(id=GUILD_ID)
            self.tree.copy_global_to(guild=guild)
            synced = await self.tree.sync(guild=guild)
            log.info("Synced %d command(s) to guild %s", len(synced), GUILD_ID)
        else:
            synced = await self.tree.sync()
            log.info("Synced %d command(s) globally", len(synced))

    async def on_ready(self):
        log.info("Logged in as %s (ID: %s)", self.user, self.user.id)
        log.info("Neptune is online.")


async def main():
    if not DISCORD_TOKEN:
        raise SystemExit(
            "DISCORD_TOKEN is not set.\n"
            "Copy .env.example to .env and add your bot token, then try again."
        )

    bot = Neptune()
    async with bot:
        await bot.start(DISCORD_TOKEN)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        log.info("Shutting down.")

"""
General-purpose commands that don't belong to a specific tool category.
"""

import discord
from discord import app_commands
from discord.ext import commands

from utils.embeds import base_embed


class General(commands.Cog):
    """Basic, always-available commands."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="ping", description="Check whether Neptune is online and see its latency.")
    async def ping(self, interaction: discord.Interaction):
        latency_ms = round(self.bot.latency * 1000)
        embed = base_embed(title="Pong!", description=f"Latency: **{latency_ms}ms**")
        await interaction.response.send_message(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(General(bot))

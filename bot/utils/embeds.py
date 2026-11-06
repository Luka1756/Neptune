"""
Shared helpers for building embeds with Neptune's look.

Keeping this in one place means every tool gets the same clean,
understated style without having to repeat itself.
"""

import discord

# Discord's standard blurple. Neutral and clean rather than themed.
BRAND_COLOR = discord.Color.blurple()


def base_embed(title: str | None = None, description: str | None = None) -> discord.Embed:
    """Create an embed with Neptune's default styling."""
    embed = discord.Embed(title=title, description=description, color=BRAND_COLOR)
    embed.set_footer(text="Neptune")
    return embed

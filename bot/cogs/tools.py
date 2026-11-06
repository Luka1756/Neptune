"""
The /tools command: Neptune's interactive toolbox menu.

This is the front door to every tool Neptune offers. Right now the
categories only show placeholder tool lists -- once a tool is actually
built, you can hook its command up wherever this file currently shows
"(coming soon)".
"""

import discord
from discord import app_commands
from discord.ext import commands

from utils.categories import TOOL_CATEGORIES
from utils.embeds import base_embed


def overview_embed() -> discord.Embed:
    """The embed shown when /tools is first opened: one field per category."""
    embed = base_embed(
        title="Neptune Toolbox",
        description="Pick a category below to see what's available.",
    )
    for name, data in TOOL_CATEGORIES.items():
        count = len(data["tools"])
        embed.add_field(
            name=f"{data['emoji']} {name}",
            value=f"{count} tool{'s' if count != 1 else ''}",
            inline=True,
        )
    return embed


def category_embed(category_name: str) -> discord.Embed:
    """The embed shown after picking a category: its tool list."""
    data = TOOL_CATEGORIES[category_name]
    embed = base_embed(
        title=f"{data['emoji']} {category_name}",
        description=data["description"],
    )
    tool_lines = [f"• {tool} *(coming soon)*" for tool in data["tools"]]
    embed.add_field(
        name="Tools",
        value="\n".join(tool_lines) if tool_lines else "No tools yet.",
        inline=False,
    )
    return embed


class CategorySelect(discord.ui.Select):
    """Dropdown listing every tool category."""

    def __init__(self):
        options = [
            discord.SelectOption(
                label=name,
                description=data["description"][:100],
                emoji=data["emoji"],
            )
            for name, data in TOOL_CATEGORIES.items()
        ]
        super().__init__(placeholder="Choose a category...", options=options, min_values=1, max_values=1)

    async def callback(self, interaction: discord.Interaction):
        category_name = self.values[0]
        await interaction.response.edit_message(embed=category_embed(category_name), view=ToolsView())


class BackButton(discord.ui.Button):
    """Returns from a category view back to the overview."""

    def __init__(self):
        super().__init__(label="Back", style=discord.ButtonStyle.secondary, row=1)

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.edit_message(embed=overview_embed(), view=ToolsView())


class ToolsView(discord.ui.View):
    """The view (dropdown + back button) attached to the /tools message."""

    def __init__(self):
        super().__init__(timeout=180)
        self.add_item(CategorySelect())
        self.add_item(BackButton())

    async def on_timeout(self):
        for item in self.children:
            item.disabled = True


class Tools(commands.Cog):
    """The /tools command and its interactive menu."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="tools", description="Open Neptune's interactive tool menu.")
    async def tools(self, interaction: discord.Interaction):
        await interaction.response.send_message(embed=overview_embed(), view=ToolsView())


async def setup(bot: commands.Bot):
    await bot.add_cog(Tools(bot))

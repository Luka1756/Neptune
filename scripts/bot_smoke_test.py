"""
Offline smoke test for the Neptune bot.

Checks that the bot's code loads and that the existing behaviour is intact,
WITHOUT connecting to Discord and without a bot token:

  - bot.py imports and the Neptune class can be created
  - every cog listed in INITIAL_COGS loads
  - exactly the two expected slash commands (/ping and /tools) are registered
  - the /tools menu builds its overview embed and view with the five categories

This does not prove the bot can log in to Discord. That still needs a real
token (see bot/README.md).

Run from anywhere:  python scripts/bot_smoke_test.py
"""

import asyncio
import importlib.util
import sys
from pathlib import Path

BOT_DIR = Path(__file__).resolve().parent.parent / "bot"
EXPECTED_COMMANDS = ["ping", "tools"]
EXPECTED_CATEGORIES = ["Discord", "Text", "Converters", "Information", "Miscellaneous"]


def load_bot_module():
    # The bot expects to run from inside bot/, so make its modules importable.
    sys.path.insert(0, str(BOT_DIR))
    spec = importlib.util.spec_from_file_location("neptune_entrypoint", BOT_DIR / "bot.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


async def run_checks(entry) -> None:
    bot = entry.Neptune()
    try:
        # setup_hook() is deliberately not called: it would sync commands with Discord.
        for cog in entry.INITIAL_COGS:
            await bot.load_extension(cog)

        commands = sorted(command.name for command in bot.tree.get_commands())
        assert commands == EXPECTED_COMMANDS, f"unexpected commands: {commands}"

        from cogs.tools import ToolsView, overview_embed

        embed = overview_embed()
        categories = [field.name.split(" ", 1)[1] for field in embed.fields]
        assert categories == EXPECTED_CATEGORIES, f"unexpected categories: {categories}"

        view = ToolsView()
        select = view.children[0]
        assert len(select.options) == len(EXPECTED_CATEGORIES), "category select is wrong"
    finally:
        await bot.close()


def main() -> None:
    entry = load_bot_module()
    asyncio.run(run_checks(entry))
    print("Smoke test passed: cogs load, /ping and /tools are registered, /tools menu builds.")


if __name__ == "__main__":
    main()

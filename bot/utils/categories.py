"""
Central registry of Neptune's tool categories.

This is the single place that defines what shows up in the /tools menu.
Each category has a display emoji, a short description, and a list of
tool names. Right now the tools listed are placeholders -- as real tools
get implemented (their own cog + command), you can update this file and
wire the /tools menu buttons to actually launch them.

To add a new category or tool for now, just edit the dictionary below.
"""

TOOL_CATEGORIES: dict[str, dict] = {
    "Discord": {
        "emoji": "🔧",
        "description": "Tools for working with Discord itself.",
        "tools": [
            "Snowflake Decoder",
            "Permission Calculator",
            "Embed Builder",
            "Invite Lookup",
        ],
    },
    "Text": {
        "emoji": "📝",
        "description": "Text formatting and manipulation tools.",
        "tools": [
            "Markdown Formatter",
            "ANSI Color Text",
            "Text Case Converter",
            "Unicode Styler",
        ],
    },
    "Converters": {
        "emoji": "🔄",
        "description": "Convert values between different formats.",
        "tools": [
            "Timestamp Generator",
            "Color Converter",
            "Number Base Converter",
        ],
    },
    "Information": {
        "emoji": "ℹ️",
        "description": "Look up information about servers, users, and channels.",
        "tools": [
            "Server Info",
            "User Info",
            "Channel Info",
        ],
    },
    "Miscellaneous": {
        "emoji": "🧩",
        "description": "Everything that doesn't fit elsewhere.",
        "tools": [
            "Minecraft Server Lookup",
        ],
    },
}

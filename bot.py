#!/usr/bin/env python3
"""
KoKoroMichi Discord RPG Bot - Main Entry Point
Advanced Discord bot with comprehensive waifu collection and battle system
"""

import discord
from discord.ext import commands
import asyncio
import logging
import sys
import os
from pathlib import Path

# Setup logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Bot configuration
BOT_NAME = "KoKoroMichi"
BOT_VERSION = "3.1.1"
COMMAND_PREFIX = "!"
EMBED_COLOR = 0xFF69B4

# Channel restrictions mapping for commands
CHANNEL_RESTRICTIONS = {
    # Battle commands
    'battle': ['combat-calls', 'duel-zone'],
    'duel': ['combat-calls', 'duel-zone'],
    'combat': ['combat-calls', 'duel-zone'],

    # Arena commands
    'arena': ['arena-hub', 'coliseum'],
    'tournament': ['arena-hub', 'coliseum'],

    # Intimate commands
    'intimate': ['lust-chamber'],
    'affection': ['lust-chamber'],
    'romance': ['lust-chamber'],

    # Forge/crafting commands
    'forge': ['forging-hall'],
    'craft': ['forging-hall'],
    'alchemy': ['forging-hall'],
    'upgrade': ['forging-hall'],

    # Mini-game commands
    'blackjack': ['mini-games'],
    'slots': ['mini-games'],
    'lottery': ['mini-games'],
    'roulette': ['mini-games'],
    'trivia': ['mini-games'],

    # Guild commands
    'guild': ['guild-hall', 'guild-chronicles'],
    'gcreate': ['guild-hall', 'guild-chronicles'],
    'gjoin': ['guild-hall', 'guild-chronicles'],
    'gleave': ['guild-hall', 'guild-chronicles'],
    'ginfo': ['guild-hall', 'guild-chronicles'],

    # Pet commands
    'pets': ['pet-corner'],
    'pet': ['pet-corner'],
    'feed': ['pet-corner'],
    'play': ['pet-corner'],

    # Dream commands
    'dreams': ['dream-realm'],
    'dream': ['dream-realm'],
    'nightmare': ['dream-realm'],

    # Event commands
    'events': ['events'],
    'event': ['events'],
    'seasonal': ['events']
}


class EmbedBuilder:
    """Simple embed builder for bot responses"""

    def create_embed(self, title="", description="", color=0xFF69B4):
        return discord.Embed(title=title, description=description, color=color)

    def error_embed(self, title, desc):
        return discord.Embed(title=title, description=desc, color=0xff0000)

    def warning_embed(self, title, desc):
        return discord.Embed(title=title, description=desc, color=0xffa500)

    def info_embed(self, title, desc):
        return discord.Embed(title=title, description=desc, color=0x0099ff)


def check_channel_match(channel_name: str, required_channels: list) -> bool:
    """Smart channel matching with emoji awareness"""
    current_clean = ''.join(c for c in channel_name.lower() if c.isalnum())

    for required in required_channels:
        required_clean = ''.join(c for c in required.replace('-', '')
                                 if c.isalnum())
        if (required in channel_name.lower()
                or required.replace('-', '') in current_clean
                or required_clean in current_clean):
            return True
    return False


async def check_command_channel(ctx, command_name: str, bot_instance) -> bool:
    """Check if command is being used in correct channel"""
    if command_name not in CHANNEL_RESTRICTIONS:
        return True  # No restrictions for this command

    required_channels = CHANNEL_RESTRICTIONS[command_name]

    # Check if current channel matches
    if check_channel_match(ctx.channel.name, required_channels):
        return True

    # Find existing matching channels
    found_channels = []
    for channel in ctx.guild.text_channels:
        if check_channel_match(channel.name, required_channels):
            found_channels.append(channel.mention)

    embed_builder = EmbedBuilder()

    if found_channels:
        embed = embed_builder.warning_embed(
            "⚠️ Wrong Channel!",
            f"The `{COMMAND_PREFIX}{command_name}` command can only be used in specific channels:"
        )
        embed.add_field(name="📍 Use These Channels",
                        value="\n".join(
                            [f"• {ch}" for ch in found_channels[:5]]),
                        inline=False)
        await ctx.send(embed=embed, delete_after=15)
        return False
    else:
        # Create missing channels
        try:
            created = []
            for channel_name in required_channels[:2]:  # Limit to 2 channels
                emoji = get_channel_emoji(channel_name)
                new_ch = await ctx.guild.create_text_channel(
                    f"{emoji}-{channel_name}",
                    topic=
                    f"Channel for {channel_name.replace('-', ' ')} commands")
                created.append(new_ch.mention)

            embed = embed_builder.create_embed(
                title="✅ Channels Created!",
                description="I've created the required channels for you:",
                color=0x00ff00)
            embed.add_field(
                name="📍 New Channels",
                value="\n".join([f"• {ch}" for ch in created]) +
                f"\n\n**Please use `{COMMAND_PREFIX}{command_name}` in these channels!**",
                inline=False)
            await ctx.send(embed=embed)

            # Send welcome message to new channels
            for ch_mention in created:
                try:
                    ch_id = int(ch_mention.strip('<>#'))
                    channel = ctx.guild.get_channel(ch_id)
                    if channel:
                        await send_channel_welcome(channel)
                except:
                    pass

            return False
        except discord.Forbidden:
            embed = embed_builder.error_embed(
                "❌ Permission Error", "I need permission to create channels.")
            embed.add_field(
                name="💡 Ask an Admin",
                value=f"Please ask an admin to create these channels:\n" +
                "\n".join([f"• #{ch}" for ch in required_channels]),
                inline=False)
            await ctx.send(embed=embed, delete_after=30)
            return False


def get_channel_emoji(channel_name: str) -> str:
    """Get appropriate emoji for channel type"""
    if any(keyword in channel_name for keyword in ['combat', 'duel']):
        return "⚔️"
    elif any(keyword in channel_name for keyword in ['arena', 'coliseum']):
        return "🏟️"
    elif 'lust' in channel_name:
        return "🌹"
    elif any(keyword in channel_name for keyword in ['forg', 'craft']):
        return "🔨"
    elif 'game' in channel_name:
        return "🎮"
    elif 'guild' in channel_name:
        return "🏰"
    elif 'pet' in channel_name:
        return "🐾"
    elif 'dream' in channel_name:
        return "🌙"
    elif 'event' in channel_name:
        return "🎉"
    else:
        return "📍"


async def send_channel_welcome(channel):
    """Send welcome message with commands for specific channels"""
    channel_name = channel.name.lower()
    embed_builder = EmbedBuilder()

    if any(keyword in channel_name for keyword in ['combat', 'duel']):
        embed = embed_builder.create_embed(
            title="⚔️ Welcome to the Combat Zone!",
            description="Ready for epic battles with your characters!",
            color=0xff0000)
        embed.add_field(
            name="🎯 Available Commands",
            value=
            "• `!battle [character]` - Fight NPCs\n• `!duel @user` - Challenge other players\n• `!combat [character]` - Quick battle",
            inline=False)
        embed.add_field(
            name="💡 Pro Tips",
            value=
            "• Use your strongest characters for tough fights\n• Level up characters to increase battle power\n• Check `!profile` to see your collection",
            inline=False)

    elif any(keyword in channel_name for keyword in ['arena', 'coliseum']):
        embed = embed_builder.create_embed(
            title="🏟️ Welcome to the Arena!",
            description="Compete in tournaments and special events!",
            color=0xffd700)
        embed.add_field(
            name="🎯 Available Commands",
            value=
            "• `!arena` - Join arena matches\n• `!tournament` - View tournaments\n• `!leaderboard` - Check rankings",
            inline=False)

    elif 'lust' in channel_name:
        embed = embed_builder.create_embed(
            title="🌹 Welcome to the Intimate Chamber",
            description="Deepen your bonds with your characters...",
            color=0xff69b4)
        embed.add_field(
            name="🎯 Available Commands",
            value=
            "• `!intimate [character]` - Intimate interactions\n• `!affection [character]` - Check relationship\n• `!romance` - Romance options",
            inline=False)

    elif any(keyword in channel_name for keyword in ['forg', 'craft']):
        embed = embed_builder.create_embed(
            title="🔨 Welcome to the Forge!",
            description=
            "Craft weapons, upgrade equipment, and enhance your characters!",
            color=0x8b4513)
        embed.add_field(
            name="🎯 Available Commands",
            value=
            "• `!forge` - Access forge menu\n• `!craft [item]` - Craft items\n• `!upgrade [character]` - Upgrade characters",
            inline=False)

    elif 'game' in channel_name:
        embed = embed_builder.create_embed(
            title="🎮 Welcome to Mini-Games!",
            description="Play fun games and earn rewards!",
            color=0x00ff00)
        embed.add_field(
            name="🎯 Available Commands",
            value=
            "• `!blackjack` - Card game\n• `!slots` - Slot machine\n• `!lottery` - Lottery tickets\n• `!trivia` - Knowledge quiz",
            inline=False)

    elif 'guild' in channel_name:
        embed = embed_builder.create_embed(
            title="🏰 Welcome to the Guild Hall!",
            description="Manage your guild and collaborate with members!",
            color=0x4169e1)
        embed.add_field(
            name="🎯 Available Commands",
            value=
            "• `!guild` - Guild information\n• `!gjoin [guild]` - Join a guild\n• `!gcreate [name]` - Create guild",
            inline=False)

    elif 'pet' in channel_name:
        embed = embed_builder.create_embed(
            title="🐾 Welcome to the Pet Corner!",
            description="Care for your adorable companions!",
            color=0x90ee90)
        embed.add_field(
            name="🎯 Available Commands",
            value=
            "• `!pets` - View your pets\n• `!feed [pet]` - Feed your pets\n• `!play [pet]` - Play with pets",
            inline=False)

    elif 'dream' in channel_name:
        embed = embed_builder.create_embed(
            title="🌙 Welcome to the Dream Realm!",
            description="Experience mystical dreams and special events!",
            color=0x9370db)
        embed.add_field(
            name="🎯 Available Commands",
            value=
            "• `!dreams` - View dream events\n• `!dream` - Enter dream state\n• `!nightmare` - Face challenges",
            inline=False)

    elif 'event' in channel_name:
        embed = embed_builder.create_embed(
            title="🎉 Welcome to Events!",
            description=
            "Participate in seasonal events and special celebrations!",
            color=0xff4500)
        embed.add_field(
            name="🎯 Available Commands",
            value=
            "• `!events` - View active events\n• `!seasonal` - Seasonal activities\n• `!participate` - Join events",
            inline=False)
    else:
        return  # Don't send welcome for other channels

    embed.set_footer(text=f"Use {COMMAND_PREFIX}help for all commands")
    await channel.send(embed=embed)


class KoKoroMichiBot(commands.Bot):
    """Main bot class with enhanced features"""

    def __init__(self):
        # Configure bot intents
        intents = discord.Intents.default()
        intents.message_content = True
        intents.members = True
        intents.guilds = True

        super().__init__(
            command_prefix=COMMAND_PREFIX,
            intents=intents,
            help_command=None,  # We'll implement custom help
            case_insensitive=True)

        self.embed_builder = EmbedBuilder()

        # Override command processing to add channel restrictions
        self.before_invoke(self.check_channel_restrictions)

    async def check_channel_restrictions(self, ctx):
        """Check channel restrictions before command execution"""
        command_name = ctx.command.name if ctx.command else ""

        # Skip check for admin commands (work in DM)
        if command_name.startswith('admin') and isinstance(
                ctx.channel, discord.DMChannel):
            return

        # Check channel restrictions
        if not await check_command_channel(ctx, command_name, self):
            raise commands.CheckFailure("Channel restriction failed")

    async def setup_hook(self):
        """Load all command modules"""
        try:
            logger.info(f"Starting {BOT_NAME} {BOT_VERSION}")

            # Ensure we're in the correct directory
            original_cwd = os.getcwd()
            base_path = Path(__file__).parent
            if not (base_path / "commands").exists():
                # Try to find the correct path
                for potential_path in [base_path, base_path.parent]:
                    if (potential_path / "commands").exists():
                        base_path = potential_path
                        break
            
            # Change to the base directory containing commands
            os.chdir(base_path)

            # List of all command modules to load
            command_modules = [
                'commands.achievements', 'commands.admin', 'commands.arena',
                'commands.battle', 'commands.crafting', 'commands.daily',
                'commands.dreams', 'commands.economy', 'commands.events',
                'commands.fan_clubs', 'commands.gallery', 'commands.guild',
                'commands.help', 'commands.inspect', 'commands.intimate',
                'commands.inventory', 'commands.mini_games', 'commands.misc',
                'commands.mishaps', 'commands.pets', 'commands.profile',
                'commands.pvp_bosses', 'commands.quests', 'commands.relics',
                'commands.seasonal_events', 'commands.server_config',
                'commands.server_setup', 'commands.store', 'commands.summon',
                'commands.traits', 'commands.upgrade', 'commands.contests',
                'commands.lore'
            ]

            # Load each command module
            loaded_modules = 0
            for module in command_modules:
                try:
                    await self.load_extension(module)
                    loaded_modules += 1
                    logger.info(f"✅ Loaded {module}")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to load {module}: {e}")

            logger.info(
                f"🎉 Successfully loaded {loaded_modules}/{len(command_modules)} command modules"
            )

            # Restore original working directory
            os.chdir(original_cwd)

        except Exception as e:
            logger.error(f"Error in setup_hook: {e}")

    async def on_ready(self):
        """Called when bot is ready"""
        logger.info(f"🤖 {self.user} is online!")
        logger.info(f"📊 Connected to {len(self.guilds)} guilds")
        total_members = sum(guild.member_count or 0 for guild in self.guilds)
        logger.info(f"👥 Serving {total_members} members")

        # Set bot status
        activity = discord.Game(
            name=f"{COMMAND_PREFIX}help | {BOT_NAME} {BOT_VERSION}")
        await self.change_presence(activity=activity)

        # Create required channels in all guilds and send welcome messages
        for guild in self.guilds:
            await self.setup_guild_channels(guild)
            # Send welcome messages to all existing channels on restart
            await self.send_welcome_to_existing_channels(guild)

    async def setup_guild_channels(self, guild):
        """Create required channels for bot functionality"""
        try:
            required_channels = [
                ('combat-calls', '⚔️',
                 'Battle commands and combat interactions'),
                ('duel-zone', '🗡️', 'PvP duels and competitive battles'),
                ('arena-hub', '🏟️', 'Arena tournaments and competitions'),
                ('coliseum', '🏛️', 'Grand arena battles and events'),
                ('lust-chamber', '🌹', 'Intimate character interactions'),
                ('forging-hall', '🔨',
                 'Crafting, upgrading, and item creation'),
                ('mini-games', '🎮', 'Fun games and activities'),
                ('guild-hall', '🏰', 'Guild management and discussion'),
                ('guild-chronicles', '📜', 'Guild history and records'),
                ('pet-corner', '🐾', 'Pet care and interactions'),
                ('dream-realm', '🌙', 'Dream events and special activities'),
                ('events', '🎉', 'Seasonal events and celebrations')
            ]

            existing_channels = [ch.name.lower() for ch in guild.text_channels]

            for channel_name, emoji, description in required_channels:
                # Check if channel already exists (with emoji-aware matching)
                channel_exists = any(
                    check_channel_match(existing, [channel_name])
                    for existing in existing_channels)

                if not channel_exists:
                    try:
                        new_channel = await guild.create_text_channel(
                            f"{emoji}-{channel_name}", topic=description)
                        logger.info(
                            f"Created channel #{emoji}-{channel_name} in {guild.name}"
                        )

                        # Send welcome message to new channel
                        await send_channel_welcome(new_channel)

                    except discord.Forbidden:
                        logger.warning(
                            f"No permission to create channels in {guild.name}"
                        )
                        break
                    except Exception as e:
                        logger.error(
                            f"Error creating channel in {guild.name}: {e}")

        except Exception as e:
            logger.error(
                f"Error setting up channels in guild {guild.name}: {e}")

    async def on_command_error(self, ctx, error):
        """Global error handler"""
        if isinstance(error, commands.CommandNotFound):
            return  # Ignore unknown commands
        elif isinstance(error, commands.CheckFailure):
            return  # Channel restriction already handled
        elif isinstance(error, commands.MissingPermissions):
            embed = self.embed_builder.error_embed(
                "Missing Permissions",
                "You don't have permission to use this command.")
            await ctx.send(embed=embed, delete_after=10)
        elif isinstance(error, commands.CommandOnCooldown):
            embed = self.embed_builder.warning_embed(
                "Command Cooldown",
                f"Please wait {error.retry_after:.1f} seconds before using this command again."
            )
            await ctx.send(embed=embed, delete_after=10)
        else:
            logger.error(f"Unhandled error in {ctx.command}: {error}")
            embed = self.embed_builder.error_embed(
                "Something went wrong",
                "Please try again later or contact support.")
            await ctx.send(embed=embed, delete_after=10)

    async def on_guild_join(self, guild):
        """Setup channels when joining new guild"""
        logger.info(f"Joined guild: {guild.name}")
        await self.setup_guild_channels(guild)
        
    async def send_welcome_to_existing_channels(self, guild):
        """Send welcome messages to all existing compatible channels"""
        try:
            for channel in guild.text_channels:
                # Check if this channel should have a welcome message
                channel_types = [
                    ('combat', 'duel'), ('arena', 'coliseum'), ('lust',), 
                    ('forg', 'craft'), ('game',), ('guild',), 
                    ('pet',), ('dream',), ('event',)
                ]
                
                channel_name_lower = channel.name.lower()
                should_send_welcome = False
                
                for keywords in channel_types:
                    if any(keyword in channel_name_lower for keyword in keywords):
                        should_send_welcome = True
                        break
                
                if should_send_welcome:
                    await send_channel_welcome(channel)
                    logger.info(f"Sent welcome message to #{channel.name} in {guild.name}")
                    
        except Exception as e:
            logger.error(f"Error sending welcome messages in guild {guild.name}: {e}")


# Main bot instance
bot = KoKoroMichiBot()


@bot.event
async def on_message(message):
    """Process messages and handle special cases"""
    if message.author.bot:
        return

    await bot.process_commands(message)


async def main():
    """Main function to run the bot"""
    try:
        # Get Discord token from environment
        token = os.getenv('DISCORD_TOKEN')
        
        if not token:
            logger.error("❌ DISCORD_TOKEN environment variable not found!")
            logger.info("💡 Please add your Discord bot token to start the bot")
            logger.info(
                "💡 You can get a token from https://discord.com/developers/applications"
            )
            return

        # Start the bot
        async with bot:
            await bot.start(token)

    except KeyboardInterrupt:
        logger.info("Bot shutdown requested")
    except Exception as e:
        logger.error(f"Fatal error: {e}")


if __name__ == "__main__":
    # Run the bot
    asyncio.run(main())

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
            description="🔥 **The ultimate battlefield where legends are born!** 🔥\n\nEngage in thrilling combat with your favorite characters against NPCs and other players. Every battle brings experience, rewards, and glory!",
            color=0xff0000)
        embed.add_field(
            name="🎯 Core Battle Commands",
            value=
            "• `!battle [character]` - Fight computer-controlled enemies\n• `!duel @user` - Challenge another player to PvP combat\n• `!combat [character]` - Quick battle for fast rewards\n• `!arena` - Enter competitive arena tournaments",
            inline=False)
        embed.add_field(
            name="💡 Battle Strategy Tips",
            value=
            "• **Character Level**: Higher level = stronger stats and abilities\n• **Rarity Matters**: Mythic and LR characters have powerful skills\n• **Elemental Advantage**: Check character affinities before battle\n• **Equipment**: Upgrade weapons and relics for bonus power\n• **Training**: Use `!train` to boost your character's stats",
            inline=False)
        embed.add_field(
            name="🏆 Rewards & Progression",
            value=
            "• **XP & Gold**: Every battle grants experience and currency\n• **Rare Drops**: Defeat bosses for special equipment\n• **Battle Rankings**: Climb the leaderboards for prestige\n• **Guild Bonuses**: Join a guild for team battle advantages",
            inline=False)

    elif any(keyword in channel_name for keyword in ['arena', 'coliseum']):
        embed = embed_builder.create_embed(
            title="🏟️ Welcome to the Grand Arena!",
            description="🏆 **Where champions rise and legends are forged!** 🏆\n\nThe most prestigious battleground in KoKoroMichi. Face the greatest challenges, compete in tournaments, and claim your place among the elite warriors!",
            color=0xffd700)
        embed.add_field(
            name="🎯 Arena Commands",
            value=
            "• `!arena` - Enter ranked arena battles for glory\n• `!tournament` - View active tournaments and events\n• `!leaderboard` - Check current rankings and standings\n• `!pvpboss` - Challenge legendary boss encounters",
            inline=False)
        embed.add_field(
            name="🏅 Tournament System",
            value=
            "• **Seasonal Events**: Special limited-time competitions\n• **Ranking Rewards**: Higher ranks give better prizes\n• **Entry Requirements**: Some tournaments need specific levels\n• **Team Battles**: Form alliances for group tournaments",
            inline=False)

    elif 'lust' in channel_name:
        embed = embed_builder.create_embed(
            title="🌹 Welcome to the Intimate Chamber",
            description="💕 **A place where hearts connect and bonds grow stronger** 💕\n\nBuild meaningful relationships with your characters through intimate interactions, romantic adventures, and heartfelt moments that unlock special abilities and bonuses.",
            color=0xff69b4)
        embed.add_field(
            name="🎯 Relationship Commands",
            value=
            "• `!intimate [character]` - Deep personal interactions\n• `!affection [character]` - View relationship status and level\n• `!romance` - Romantic storylines and special events\n• `!kiss [character]` - Express affection for relationship growth",
            inline=False)
        embed.add_field(
            name="💝 Relationship Benefits",
            value=
            "• **Combat Bonuses**: Higher affection = stronger battle performance\n• **Special Abilities**: Unlock unique skills through deep bonds\n• **Exclusive Content**: Access character-specific storylines\n• **Daily Rewards**: Loving characters give daily gifts",
            inline=False)

    elif any(keyword in channel_name for keyword in ['forg', 'craft']):
        embed = embed_builder.create_embed(
            title="🔨 Welcome to the Master Forge!",
            description=
            "⚒️ **The heart of creation and enhancement!** ⚒️\n\nTransform raw materials into legendary equipment, upgrade your characters to new heights, and craft powerful items that will give you the edge in any battle!",
            color=0x8b4513)
        embed.add_field(
            name="🎯 Crafting Commands",
            value=
            "• `!forge` - Access the main forge interface\n• `!craft [item]` - Create weapons, armor, and tools\n• `!upgrade [character]` - Enhance character abilities\n• `!alchemy` - Brew potions and enhancement items",
            inline=False)
        embed.add_field(
            name="⚡ Enhancement System",
            value=
            "• **Weapon Crafting**: Create powerful weapons from rare materials\n• **Character Upgrades**: Boost stats, skills, and special abilities\n• **Relic Enhancement**: Improve ancient artifacts for massive bonuses\n• **Material Gathering**: Collect resources through battles and quests",
            inline=False)

    elif 'game' in channel_name:
        embed = embed_builder.create_embed(
            title="🎮 Welcome to the Gaming Paradise!",
            description="🎲 **Fun, rewards, and endless entertainment await!** 🎲\n\nTake a break from intense battles and enjoy a variety of mini-games that offer great rewards, daily bonuses, and pure entertainment value!",
            color=0x00ff00)
        embed.add_field(
            name="🎯 Mini-Game Commands",
            value=
            "• `!blackjack` - Classic card game for gold rewards\n• `!slots` - Lucky slot machine with jackpots\n• `!lottery` - Buy tickets for massive prize pools\n• `!trivia` - Test your knowledge for gem rewards\n• `!roulette` - Spin the wheel of fortune",
            inline=False)
        embed.add_field(
            name="🎁 Gaming Rewards",
            value=
            "• **Daily Bonuses**: Play every day for escalating rewards\n• **Jackpot System**: Hit the big wins for massive payouts\n• **Achievement Unlocks**: Complete challenges for special prizes\n• **Streak Bonuses**: Consecutive wins multiply your earnings",
            inline=False)

    elif 'guild' in channel_name:
        embed = embed_builder.create_embed(
            title="🏰 Welcome to the Guild Hall!",
            description="⚔️ **United we stand, divided we fall!** ⚔️\n\nJoin forces with like-minded adventurers, create powerful alliances, and unlock the true potential of teamwork through guild bonuses, collaborative events, and shared victories!",
            color=0x4169e1)
        embed.add_field(
            name="🎯 Guild Commands",
            value=
            "• `!guild` - View guild information and member status\n• `!gjoin [guild]` - Request to join an existing guild\n• `!gcreate [name]` - Establish your own guild\n• `!gwar` - Participate in guild vs guild warfare",
            inline=False)
        embed.add_field(
            name="🤝 Guild Benefits",
            value=
            "• **Stat Bonuses**: Guild members get combat advantages\n• **Shared Resources**: Pool materials for massive upgrades\n• **Group Events**: Exclusive guild-only tournaments and raids\n• **Leadership Roles**: Become an officer or guild master\n• **Guild Quests**: Collaborative missions with epic rewards",
            inline=False)

    elif 'pet' in channel_name:
        embed = embed_builder.create_embed(
            title="🐾 Welcome to the Pet Sanctuary!",
            description="🦄 **Where magical companions await your care!** 🦄\n\nAdorable pets that are more than just companions - they're loyal battle partners, resource gatherers, and sources of daily joy and valuable bonuses!",
            color=0x90ee90)
        embed.add_field(
            name="🎯 Pet Care Commands",
            value=
            "• `!pets` - View all your adorable companions\n• `!feed [pet]` - Keep your pets happy and healthy\n• `!play [pet]` - Bond through fun activities\n• `!petstats [pet]` - Check pet abilities and growth",
            inline=False)
        embed.add_field(
            name="✨ Pet Abilities",
            value=
            "• **Battle Support**: Pets assist in combat with special skills\n• **Resource Collection**: Pets gather materials while you're away\n• **Mood Bonuses**: Happy pets boost your overall performance\n• **Evolution System**: Train pets to unlock new forms and abilities\n• **Breeding Program**: Create unique pet combinations",
            inline=False)

    elif 'dream' in channel_name:
        embed = embed_builder.create_embed(
            title="🌙 Welcome to the Mystical Dream Realm!",
            description="✨ **Where reality bends and impossible becomes possible** ✨\n\nEnter a world beyond the physical realm where your characters experience supernatural adventures, gain mystical powers, and encounter otherworldly challenges!",
            color=0x9370db)
        embed.add_field(
            name="🎯 Dream Commands",
            value=
            "• `!dreams` - View active dream sequences and events\n• `!dream` - Enter deep meditation and dream states\n• `!nightmare` - Brave terrifying challenges for great rewards\n• `!lucid` - Control your dreams for special bonuses",
            inline=False)
        embed.add_field(
            name="🔮 Mystical Benefits",
            value=
            "• **Dream Buffs**: Temporary but powerful ability enhancements\n• **Subconscious Training**: Characters learn skills while sleeping\n• **Prophetic Visions**: Get hints about future events and opportunities\n• **Nightmare Rewards**: Face fears to unlock unique achievements\n• **Astral Projection**: Explore hidden realms for rare treasures",
            inline=False)

    elif 'event' in channel_name:
        embed = embed_builder.create_embed(
            title="🎉 Welcome to the Festival Grounds!",
            description=
            "🎊 **Where celebration never ends and rewards flow freely!** 🎊\n\nJoin spectacular seasonal events, limited-time celebrations, and special occasions that bring the entire community together for unforgettable experiences and exclusive rewards!",
            color=0xff4500)
        embed.add_field(
            name="🎯 Event Commands",
            value=
            "• `!events` - Browse all active events and celebrations\n• `!seasonal` - Access seasonal activities and themed content\n• `!participate` - Join ongoing events and competitions\n• `!contest` - Enter special contests for amazing prizes",
            inline=False)
        embed.add_field(
            name="🏆 Event Rewards",
            value=
            "• **Exclusive Characters**: Limited-edition waifus only available during events\n• **Special Equipment**: Event-themed gear with unique properties\n• **Massive Bonuses**: Double XP, increased drop rates, and more\n• **Community Goals**: Work together to unlock server-wide rewards\n• **Commemorative Items**: Collect rare mementos from each celebration",
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

        # Create required channels in all guilds (without automatic welcome messages)
        for guild in self.guilds:
            await self.setup_guild_channels(guild)

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

                        # Channel created - welcome messages can be sent manually using !admin welcome

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
        
    async def send_welcome_to_channels(self, guild, send_to_all=False):
        """Send welcome messages to channels - called by admin command"""
        try:
            sent_count = 0
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
                
                if should_send_welcome or send_to_all:
                    await send_channel_welcome(channel)
                    sent_count += 1
                    logger.info(f"Sent welcome message to #{channel.name} in {guild.name}")
            
            return sent_count
                    
        except Exception as e:
            logger.error(f"Error sending welcome messages in guild {guild.name}: {e}")
            return 0


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
        token = os.getenv('DISCORD_BOT_TOKEN')
        
        if not token:
            logger.error("❌ DISCORD_BOT_TOKEN environment variable not found!")
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

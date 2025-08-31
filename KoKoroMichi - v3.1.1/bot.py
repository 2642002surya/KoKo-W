#!/usr/bin/env python3
"""
KoKoroMichi Advanced Bot - Version 3.0.0
Professional Discord RPG Bot with comprehensive waifu collection and battle system
"""

import discord
from discord.ext import commands
import asyncio
import os
import sys
from pathlib import Path
import logging

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from core.config import BOT_NAME, BOT_VERSION, COMMAND_PREFIX, FEATURES, ADMIN_USER_ID
from core.data_manager import data_manager
from core.embed_utils import EmbedBuilder
from utils.channel_manager import ChannelManager

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('bot.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class KoKoroMichiBot(commands.Bot):
    """Advanced KoKoroMichi Bot with enhanced features"""
    
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.guilds = True
        intents.guild_messages = True
        intents.reactions = True
        
        super().__init__(
            command_prefix=COMMAND_PREFIX,
            intents=intents,
            help_command=None,
            description=f"{BOT_NAME} {BOT_VERSION} - Advanced Discord RPG Bot"
        )
        
        self.embed_builder = EmbedBuilder()
        self.channel_manager = ChannelManager()
        
        # Channel configuration with exact names
        self.required_channels = {
            "combat-calls": {"emoji": "⚔️", "commands": ["battle", "fight"], "tips": "Battle NPCs for XP and gold"},
            "duel-zone": {"emoji": "⚔️", "commands": ["battle", "fight", "duel"], "tips": "PvP battles and duels"},
            "arena-hub": {"emoji": "🏟️", "commands": ["arena", "coliseum"], "tips": "Ranked competitive battles"},
            "coliseum": {"emoji": "🏟️", "commands": ["arena", "coliseum"], "tips": "Arena tournaments"},
            "lust-chamber": {"emoji": "💕", "commands": ["intimate", "interact", "affection"], "tips": "Build relationships with characters"},
            "forging-hall": {"emoji": "🔨", "commands": ["craft", "forge", "materials"], "tips": "Craft items and equipment"},
            "mini-games": {"emoji": "🎮", "commands": ["8ball", "roll", "choose", "trivia", "lottery", "slots"], "tips": "Fun games and entertainment"},
            "guild-hall": {"emoji": "🏰", "commands": ["guild", "faction", "guild_battle"], "tips": "Guild management and faction wars"},
            "guild-chronicles": {"emoji": "🏰", "commands": ["guild", "faction", "guild_battle"], "tips": "Guild management and faction wars"},
            "pet-corner": {"emoji": "🐾", "commands": ["pet", "feed", "pet_battle"], "tips": "Care for companions and pets"},
            "dream-realm": {"emoji": "🌙", "commands": ["dream", "dreamquest"], "tips": "Mystical dream events"},
            "events": {"emoji": "🎉", "commands": ["events", "dailyquest", "seasonal"], "tips": "Special events and daily activities"}
        }
    
    def extract_channel_name(self, channel_name: str) -> str:
        """Extract clean channel name without emojis"""
        import re
        # Remove emoji pattern and extra spaces
        clean_name = re.sub(r'[^\w\s-]', '', channel_name.lower()).strip()
        # Replace multiple spaces with single space, then replace spaces with hyphens
        clean_name = re.sub(r'\s+', '-', clean_name)
        return clean_name
    
    def find_channel_by_name(self, guild, target_name: str):
        """Find channel by name, ignoring emojis"""
        clean_target = self.extract_channel_name(target_name)
        for channel in guild.text_channels:
            clean_channel_name = self.extract_channel_name(channel.name)
            if clean_channel_name == clean_target:
                return channel
        return None
    
    async def setup_hook(self):
        """Setup hook called when bot starts"""
        logger.info(f"Setting up {BOT_NAME} {BOT_VERSION}...")
        
        # Load all command modules
        command_modules = [
            'commands.achievements',
            'commands.admin', 
            'commands.arena',
            'commands.battle',
            'commands.crafting',
            'commands.daily',
            'commands.dreams',
            'commands.economy',
            'commands.events',
            'commands.fan_clubs',
            'commands.gallery',
            'commands.guild',
            'commands.help',
            'commands.inspect',
            'commands.intimate',
            'commands.inventory',
            'commands.mini_games',
            'commands.misc',
            'commands.mishaps',
            'commands.pets',
            'commands.profile',
            'commands.pvp_bosses',
            'commands.quests',
            'commands.relics',
            'commands.seasonal_events',
            'commands.server_setup',
            'commands.server_config',
            'commands.store',
            'commands.summon',
            'commands.traits',
            'commands.upgrade'
        ]
        
        loaded_count = 0
        for module in command_modules:
            try:
                await self.load_extension(module)
                loaded_count += 1
                logger.info(f"Loaded: {module}")
            except Exception as e:
                logger.warning(f"Failed to load {module}: {e}")
        
        logger.info(f"Loaded {loaded_count}/{len(command_modules)} command modules")
    
    async def create_required_channels(self, guild):
        """Create required channels if they don't exist"""
        for channel_name, channel_info in self.required_channels.items():
            existing_channel = self.find_channel_by_name(guild, channel_name)
            
            if not existing_channel:
                try:
                    # Create the channel
                    overwrites = {
                        guild.default_role: discord.PermissionOverwrite(read_messages=True, send_messages=True),
                        guild.me: discord.PermissionOverwrite(read_messages=True, send_messages=True)
                    }
                    
                    new_channel = await guild.create_text_channel(
                        channel_name,
                        topic=f"{channel_info['emoji']} Channel for {', '.join(channel_info['commands'])} commands",
                        overwrites=overwrites
                    )
                    
                    logger.info(f"Created channel #{channel_name} in {guild.name}")
                    await asyncio.sleep(0.5)  # Rate limit protection
                    
                except Exception as e:
                    logger.error(f"Failed to create channel #{channel_name} in {guild.name}: {e}")
    
    async def send_channel_guides(self, guild):
        """Send welcome embeds to all required channels"""
        for channel_name, channel_info in self.required_channels.items():
            try:
                channel = self.find_channel_by_name(guild, channel_name)
                if channel:
                    # Create welcome embed
                    embed = self.embed_builder.create_embed(
                        title=f"Welcome to {channel_info['emoji']}{channel.name}! {channel_info['tips']}",
                        color=0x00BFFF
                    )
                    
                    # Add commands
                    commands_list = "\n".join([f"• !{cmd}" for cmd in channel_info["commands"]])
                    embed.add_field(
                        name="🎮 Available Commands",
                        value=commands_list,
                        inline=False
                    )
                    
                    embed.add_field(
                        name="💡 Tips",
                        value=channel_info["tips"],
                        inline=False
                    )
                    
                    embed.add_field(
                        name="📖 Need Help?",
                        value="Use !help for all commands or !help <command> for specific help",
                        inline=False
                    )
                    
                    embed.set_footer(text="KoKoroMichi 3.0.0 Advanced • Enjoy your adventure!")
                    
                    await channel.send(embed=embed)
                    await asyncio.sleep(0.5)  # Rate limit protection
                    
            except Exception as e:
                logger.error(f"Failed to send guide to #{channel_name}: {e}")
    
    async def on_ready(self):
        """Called when bot is ready"""
        logger.info(f'{BOT_NAME} {BOT_VERSION} is online!')
        logger.info(f'Bot user: {self.user} (ID: {self.user.id})')
        logger.info(f'Connected to {len(self.guilds)} guilds')
        
        # Set activity status
        activity = discord.Activity(
            type=discord.ActivityType.playing,
            name=f"{BOT_NAME} {BOT_VERSION} | !help"
        )
        await self.change_presence(activity=activity)
        
        # Setup required channels and send guides for all guilds
        for guild in self.guilds:
            try:
                await self.create_required_channels(guild)
                await self.send_channel_guides(guild)
            except Exception as e:
                logger.error(f"Failed to setup channels for {guild.name}: {e}")
    
    async def on_command_error(self, ctx, error):
        """Handle command errors gracefully"""
        if isinstance(error, commands.CommandNotFound):
            return  # Ignore unknown commands
        
        elif isinstance(error, commands.MissingRequiredArgument):
            embed = self.embed_builder.error_embed(
                "Missing Argument",
                f"Please provide all required arguments. Use `!help {ctx.command}` for details."
            )
            await ctx.send(embed=embed)
        
        elif isinstance(error, commands.BadArgument):
            embed = self.embed_builder.error_embed(
                "Invalid Argument",
                "Please check your input and try again."
            )
            await ctx.send(embed=embed)
        
        elif isinstance(error, commands.CommandOnCooldown):
            embed = self.embed_builder.warning_embed(
                "Command Cooldown",
                f"Please wait {error.retry_after:.1f} seconds before using this command again."
            )
            await ctx.send(embed=embed)
        
        else:
            # Log unexpected errors
            logger.error(f"Command error in {ctx.command}: {error}")
            embed = self.embed_builder.error_embed(
                "Unexpected Error",
                "Something went wrong. Please try again later."
            )
            await ctx.send(embed=embed)

def main():
    """Main function to run the bot"""
    # Get bot token from environment
    token = os.getenv('DISCORD_BOT_TOKEN')
    if not token:
        logger.error("DISCORD_BOT_TOKEN environment variable not found!")
        logger.info("Please set your Discord bot token as an environment variable.")
        return
    
    # Create and run bot
    bot = KoKoroMichiBot()
    
    try:
        bot.run(token)
    except discord.LoginFailure:
        logger.error("Invalid bot token! Please check your DISCORD_BOT_TOKEN.")
    except Exception as e:
        logger.error(f"Error starting bot: {e}")

if __name__ == "__main__":
    main()
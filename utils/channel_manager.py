# Channel Management and Restrictions for KoKoroMichi Advanced Bot
import discord
from discord.ext import commands
from typing import Dict, List, Optional
import logging
import re

logger = logging.getLogger(__name__)

class ChannelManager:
    """Manages channel restrictions and automatic channel creation"""
    
    def __init__(self):
        # Define channel restrictions for commands (only restricted commands listed)
        self.channel_restrictions = {
            # Battle commands - RESTRICTED
            "battle": {"allowed_channels": ["combat-calls", "duel-zone", "battle-arena"], "log_channel": "battle-history"},
            "fight": {"allowed_channels": ["combat-calls", "duel-zone", "battle-arena"], "log_channel": "battle-history"},
            "duel": {"allowed_channels": ["combat-calls", "duel-zone", "battle-arena"], "log_channel": "battle-history"},
            
            # Arena commands - RESTRICTED
            "arena": {"allowed_channels": ["arena-hub", "coliseum", "arena-battles"], "log_channel": "arena-history"},
            "coliseum": {"allowed_channels": ["arena-hub", "coliseum", "arena-battles"], "log_channel": "arena-history"},
            
            # Pet commands - RESTRICTED
            "pet": {"allowed_channels": ["pet-corner", "companion-hub", "pets"], "log_channel": None},
            "feed": {"allowed_channels": ["pet-corner", "companion-hub", "pets"], "log_channel": None},
            "pet_battle": {"allowed_channels": ["pet-corner", "companion-hub", "pets"], "log_channel": None},
            
            # Guild commands - RESTRICTED
            "guild": {"allowed_channels": ["guild-chronicles", "guild-hall", "faction-hub"], "log_channel": None},
            "faction": {"allowed_channels": ["guild-chronicles", "guild-hall", "faction-hub"], "log_channel": None},
            "guild_battle": {"allowed_channels": ["guild-chronicles", "guild-hall", "faction-hub"], "log_channel": None},
            
            # Crafting commands - RESTRICTED
            "craft": {"allowed_channels": ["forging-hall", "workshop", "crafting-zone"], "log_channel": "forge-reports"},
            "forge": {"allowed_channels": ["forging-hall", "workshop", "crafting-zone"], "log_channel": "forge-reports"},
            "materials": {"allowed_channels": ["forging-hall", "workshop", "crafting-zone"], "log_channel": "forge-reports"},
            "gather": {"allowed_channels": ["forging-hall", "workshop", "crafting-zone"], "log_channel": "forge-reports"},
            
            # Intimate commands - RESTRICTED
            "intimate": {"allowed_channels": ["lust-chamber", "intimate-moments", "private-room"], "log_channel": None},
            "interact": {"allowed_channels": ["lust-chamber", "intimate-moments", "private-room"], "log_channel": None},
            "affection": {"allowed_channels": ["lust-chamber", "intimate-moments", "private-room"], "log_channel": None},
            
            # Events commands - RESTRICTED
            "events": {"allowed_channels": ["events", "event-hub", "special-events"], "log_channel": "events"},
            "dailyquest": {"allowed_channels": ["events", "event-hub", "special-events"], "log_channel": "events"},
            "seasonal": {"allowed_channels": ["events", "event-hub", "special-events"], "log_channel": "events"},
            
            # Mini-games commands - RESTRICTED
            "8ball": {"allowed_channels": ["mini-games", "fun-zone", "games"], "log_channel": None},
            "roll": {"allowed_channels": ["mini-games", "fun-zone", "games"], "log_channel": None},
            "choose": {"allowed_channels": ["mini-games", "fun-zone", "games"], "log_channel": None},
            "trivia": {"allowed_channels": ["mini-games", "fun-zone", "games"], "log_channel": None},
            "lottery": {"allowed_channels": ["mini-games", "fun-zone", "games"], "log_channel": None},
            
            # Dream commands - RESTRICTED
            "dream": {"allowed_channels": ["dream-realm", "mystical-dreams", "visions"], "log_channel": "dream-realm"},
            "dreamquest": {"allowed_channels": ["dream-realm", "mystical-dreams", "visions"], "log_channel": "dream-realm"}
        }
        
        # Special logging requirements for rare summons
        self.rare_summon_rarities = ["SSR", "UR", "LR", "Mythic"]
    
    def extract_channel_name(self, channel_name: str) -> str:
        """Extract clean channel name without emojis and special characters"""
        # Enhanced emoji removal pattern to cover all Unicode emoji ranges
        emoji_pattern = re.compile("["
                                 u"\U0001F600-\U0001F64F"  # emoticons
                                 u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                                 u"\U0001F680-\U0001F6FF"  # transport & map symbols
                                 u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                                 u"\U00002500-\U00002BEF"  # chinese char
                                 u"\U00002702-\U000027B0"
                                 u"\U00002702-\U000027B0"
                                 u"\U000024C2-\U0001F251"
                                 u"\U0001f926-\U0001f937"
                                 u"\U00010000-\U0010ffff"
                                 u"\u2640-\u2642"
                                 u"\u2600-\u2B55"
                                 u"\u200d"
                                 u"\u23cf"
                                 u"\u23e9"
                                 u"\u231a"
                                 u"\ufe0f"  # dingbats
                                 u"\u3030"
                                 "]+", flags=re.UNICODE)
        
        # Remove emojis first
        clean_name = emoji_pattern.sub('', channel_name).strip()
        
        # Remove extra spaces and hyphens at the beginning/end
        clean_name = clean_name.strip('-').strip()
        
        # Convert to lowercase for comparison
        clean_name = clean_name.lower()
        
        # Keep hyphens and underscores for proper channel name matching
        return clean_name

    async def check_channel_restriction(self, ctx, command_name: str) -> bool:
        """Check if command can be used in current channel, create channels if needed"""
        if command_name not in self.channel_restrictions:
            return True  # No restrictions for this command
        
        restriction_data = self.channel_restrictions[command_name]
        allowed_channels = restriction_data["allowed_channels"]
        current_channel = ctx.channel.name.lower()
        
        # Check if current channel is allowed using consecutive word matching
        clean_current_channel = self.extract_channel_name(current_channel)
        current_words = clean_current_channel.replace('-', ' ').replace('_', ' ').split()
        
        for allowed_channel in allowed_channels:
            clean_allowed = self.extract_channel_name(allowed_channel)
            allowed_words = clean_allowed.replace('-', ' ').replace('_', ' ').split()
            
            # Check if allowed words appear consecutively in current channel
            if self._words_match_consecutively(allowed_words, current_words):
                return True
        
        # Channel not allowed, try to create the primary channel
        primary_channel_name = allowed_channels[0]
        
        try:
            # Check if the primary channel exists (ignoring emojis)
            existing_channel = self.find_channel_by_name(ctx.guild, primary_channel_name)
            
            if not existing_channel:
                # Create the channel
                overwrites = {
                    ctx.guild.default_role: discord.PermissionOverwrite(read_messages=True, send_messages=True),
                    ctx.guild.me: discord.PermissionOverwrite(read_messages=True, send_messages=True)
                }
                
                new_channel = await ctx.guild.create_text_channel(
                    primary_channel_name,
                    topic=f"🎮 Channel for {command_name} commands",
                    overwrites=overwrites
                )
                
                embed = discord.Embed(
                    title="🔧 Channel Created!",
                    description=f"Created **#{primary_channel_name}** for `{command_name}` commands!",
                    color=0x00FF00
                )
                embed.add_field(
                    name="✨ Usage",
                    value=f"Please use `!{command_name}` commands in {new_channel.mention} from now on.",
                    inline=False
                )
                await ctx.send(embed=embed)
                
                logger.info(f"Created channel #{primary_channel_name} for {command_name} commands in {ctx.guild.name}")
                return False
            else:
                # Channel exists, direct user to it and send command guide
                embed = discord.Embed(
                    title="🚫 Wrong Channel",
                    description=f"The `{command_name}` command can only be used in specific channels.",
                    color=0xFF4500
                )
                embed.add_field(
                    name="📍 Allowed Channels",
                    value=" • ".join([f"#{channel}" for channel in allowed_channels]),
                    inline=False
                )
                embed.add_field(
                    name="🎯 Quick Access",
                    value=f"Please use {existing_channel.mention} for `{command_name}` commands.",
                    inline=False
                )
                await ctx.send(embed=embed)
                
                # Send command guide to the appropriate channel
                await self.send_command_guide_to_channel(ctx.guild, command_name, existing_channel)
                return False
                
        except discord.Forbidden:
            embed = discord.Embed(
                title="❌ Permission Error",
                description="I don't have permission to create channels.",
                color=0xFF0000
            )
            embed.add_field(
                name="💡 Solution",
                value=f"Please ask an admin to create **#{primary_channel_name}** or give me channel creation permissions.",
                inline=False
            )
            await ctx.send(embed=embed)
            return False
            
        except Exception as e:
            logger.error(f"Error creating channel {primary_channel_name}: {e}")
            return False
    
    async def log_command_usage(self, ctx, command_name: str, details: str = ""):
        """Log command usage to appropriate channel with professional formatting"""
        try:
            # Get the general history channel first
            history_channel = discord.utils.get(ctx.guild.text_channels, name='history')
            
            if history_channel:
                # Create professional log embed
                embed = discord.Embed(
                    title="📊 Command Activity Log",
                    color=0x4169E1
                )
                
                embed.add_field(
                    name="👤 User",
                    value=f"{ctx.author.mention}\n({ctx.author.display_name})",
                    inline=True
                )
                
                embed.add_field(
                    name="⚡ Command",
                    value=f"`{command_name}`",
                    inline=True
                )
                
                embed.add_field(
                    name="📍 Channel",
                    value=f"{ctx.channel.mention}\n(#{ctx.channel.name})",
                    inline=True
                )
                
                if details:
                    embed.add_field(
                        name="📝 Details",
                        value=details,
                        inline=False
                    )
                
                embed.timestamp = ctx.message.created_at
                embed.set_footer(text="KoKoroMichi Activity Tracker")
                
                await history_channel.send(embed=embed)
        
        except Exception as e:
            logger.error(f"Error logging command usage: {e}")
    
    async def log_special_event(self, ctx, event_type: str, data: dict):
        """Log special events to designated channels"""
        try:
            guild = ctx.guild
            channel_name = None
            
            # Determine log channel based on event type
            if event_type == "rare_summon":
                channel_name = "lucky-summons"
                embed = self.create_rare_summon_log(ctx, data)
            elif event_type == "battle_result":
                channel_name = "battle-history"
                embed = self.create_battle_log(ctx, data)
            elif event_type == "arena_result":
                channel_name = "arena-history"
                embed = self.create_arena_log(ctx, data)
            elif event_type == "crafting_success":
                channel_name = "forge-reports"
                embed = self.create_crafting_log(ctx, data)
            else:
                return
            
            if not channel_name:
                return
            
            # Find or create the log channel (ignoring emojis)
            log_channel = self.find_channel_by_name(guild, channel_name)
            
            if not log_channel:
                # Create the log channel
                overwrites = {
                    guild.default_role: discord.PermissionOverwrite(send_messages=False, read_messages=True),
                    guild.me: discord.PermissionOverwrite(send_messages=True, read_messages=True)
                }
                
                log_channel = await guild.create_text_channel(
                    channel_name,
                    topic=f"📋 Automated logs for {event_type.replace('_', ' ')} events",
                    overwrites=overwrites
                )
            
            if log_channel and embed:
                await log_channel.send(embed=embed)
                
        except Exception as e:
            logger.error(f"Error logging special event {event_type}: {e}")
    
    def create_rare_summon_log(self, ctx, data: dict) -> discord.Embed:
        """Create embed for rare summon logging"""
        character = data.get("character", {})
        rarity = character.get("rarity", "Unknown")
        name = character.get("name", "Unknown Character")
        
        embed = discord.Embed(
            title="🌟 LEGENDARY SUMMON ALERT! 🌟",
            description=f"**{ctx.author.display_name}** has summoned an incredible character!",
            color=0xFF0080
        )
        
        embed.add_field(
            name="✨ Character",
            value=f"**{name}**\n{rarity}",
            inline=True
        )
        
        embed.add_field(
            name="🎯 Stats",
            value=f"❤️ HP: {character.get('hp', 0)}\n⚔️ ATK: {character.get('atk', 0)}\n🛡️ DEF: {character.get('def', 0)}",
            inline=True
        )
        
        embed.add_field(
            name="🔮 Potential",
            value=f"{character.get('potential', 0):,}",
            inline=True
        )
        
        embed.set_footer(text=f"Summoned by {ctx.author.display_name}")
        embed.timestamp = ctx.message.created_at
        
        return embed
    
    def create_battle_log(self, ctx, data: dict) -> discord.Embed:
        """Create embed for battle logging"""
        result = data.get("result", "Unknown")
        opponent = data.get("opponent", "Unknown")
        
        color = 0x00FF00 if result == "victory" else 0xFF0000
        
        embed = discord.Embed(
            title="⚔️ Battle Report",
            description=f"**{ctx.author.display_name}** has completed a battle!",
            color=color
        )
        
        embed.add_field(
            name="🎯 Result",
            value=f"**{result.title()}**",
            inline=True
        )
        
        embed.add_field(
            name="👹 Opponent",
            value=opponent,
            inline=True
        )
        
        if "rewards" in data:
            embed.add_field(
                name="🎁 Rewards",
                value=data["rewards"],
                inline=False
            )
        
        embed.timestamp = ctx.message.created_at
        return embed
    
    def create_arena_log(self, ctx, data: dict) -> discord.Embed:
        """Create embed for arena logging"""
        return self.create_battle_log(ctx, data)  # Similar structure
    
    def create_crafting_log(self, ctx, data: dict) -> discord.Embed:
        """Create embed for crafting logging"""
        item_name = data.get("item_name", "Unknown Item")
        materials_used = data.get("materials", [])
        
        embed = discord.Embed(
            title="🔨 Forge Report",
            description=f"**{ctx.author.display_name}** has successfully crafted an item!",
            color=0xFF8C00
        )
        
        embed.add_field(
            name="🛠️ Item Crafted",
            value=f"**{item_name}**",
            inline=True
        )
        
        if materials_used:
            embed.add_field(
                name="📦 Materials Used",
                value=" • ".join(materials_used[:5]),  # Limit to 5 materials
                inline=True
            )
        
        embed.timestamp = ctx.message.created_at
        return embed
    
    def find_channel_by_name(self, guild, target_name: str) -> Optional[discord.TextChannel]:
        """Find a channel by name using consecutive word matching, ignoring emojis"""
        clean_target = self.extract_channel_name(target_name)
        target_words = clean_target.replace('-', ' ').replace('_', ' ').split()
        
        for channel in guild.text_channels:
            clean_channel_name = self.extract_channel_name(channel.name)
            channel_words = clean_channel_name.replace('-', ' ').replace('_', ' ').split()
            
            # Check if target words appear consecutively in channel words
            if self._words_match_consecutively(target_words, channel_words):
                return channel
        return None
    
    def _words_match_consecutively(self, target_words: List[str], channel_words: List[str]) -> bool:
        """Check if target words appear consecutively in channel words"""
        if not target_words or not channel_words:
            return False
            
        target_len = len(target_words)
        channel_len = len(channel_words)
        
        # If target is longer than channel, no match possible
        if target_len > channel_len:
            return False
            
        # Check each possible position in channel_words
        for i in range(channel_len - target_len + 1):
            match = True
            for j in range(target_len):
                if channel_words[i + j] != target_words[j]:
                    match = False
                    break
            if match:
                return True
                
        return False
    
    async def send_command_guide_to_channel(self, guild, command_name: str, target_channel):
        """Send command guide embed to the target channel when a restricted command is used incorrectly"""
        try:
            # Define command guides for each category
            command_guides = {
                # Battle commands
                "battle": {
                    "title": "⚔️ Battle Commands Guide",
                    "description": "Master the art of combat with these battle commands!",
                    "commands": [
                        ("`!battle <enemy>`", "Fight against various enemies and monsters"),
                        ("`!fight <character>`", "Duel against your own characters"),
                        ("`!duel <@user>`", "Challenge another player to combat"),
                        ("`!combat_stats`", "View your combat statistics"),
                        ("`!battle_log`", "Check your recent battle history")
                    ],
                    "color": 0xFF4500
                },
                
                # Arena commands  
                "arena": {
                    "title": "🏛️ Arena Commands Guide", 
                    "description": "Enter the arena for glory and rewards!",
                    "commands": [
                        ("`!arena`", "View arena status and rankings"),
                        ("`!arena fight`", "Fight in the arena for ranking"),
                        ("`!arena top`", "View top arena fighters"),
                        ("`!coliseum`", "Access special coliseum battles"),
                        ("`!arena rewards`", "Check available arena rewards")
                    ],
                    "color": 0x8B4513
                },
                
                # Events commands
                "events": {
                    "title": "🎪 Events Commands Guide",
                    "description": "Join seasonal events and special activities!",
                    "commands": [
                        ("`!events`", "View current seasonal events"),
                        ("`!events participate <activity>`", "Join event activities"),
                        ("`!dailyquest`", "Get your daily quest"),
                        ("`!seasonal`", "Check seasonal bonuses"),
                        ("`!event_rewards`", "View event reward status")
                    ],
                    "color": 0xFF1493
                },
                
                # Mini-games commands
                "8ball": {
                    "title": "🎮 Mini-Games Commands Guide",
                    "description": "Play fun games and earn rewards!",
                    "commands": [
                        ("`!games`", "View all available mini-games"),
                        ("`!8ball <question>`", "Ask the magic 8-ball"),
                        ("`!roll <dice>`", "Roll dice (e.g., 2d6, 1d20)"),
                        ("`!rps <choice>`", "Play Rock Paper Scissors"),
                        ("`!trivia`", "Answer trivia questions"),
                        ("`!guess_number`", "Play number guessing game"),
                        ("`!slots <bet>`", "Try the slot machine"),
                        ("`!choose <options>`", "Random choice picker")
                    ],
                    "color": 0x9370DB
                },
                
                # Dreams commands
                "dreams": {
                    "title": "🌙 Dreams Commands Guide",
                    "description": "Explore mystical dream events and buffs!",
                    "commands": [
                        ("`!dreams`", "View active dream events"),
                        ("`!complete_dream <id>`", "Collect dream rewards"),
                        ("`!dream_buffs`", "View active dream buffs"),
                        ("`!dream_status`", "Check dream realm status")
                    ],
                    "color": 0x9932CC
                },
                
                # Pet commands
                "pet": {
                    "title": "🐾 Pet Commands Guide",
                    "description": "Care for and train your companions!",
                    "commands": [
                        ("`!pets`", "View your pet collection"),
                        ("`!pet <name>`", "Interact with a specific pet"),
                        ("`!feed <pet>`", "Feed your pet"),
                        ("`!pet_battle`", "Battle with your pets"),
                        ("`!pet_train`", "Train your pets")
                    ],
                    "color": 0x32CD32
                },
                
                # Guild commands
                "guild": {
                    "title": "🏰 Guild Commands Guide",
                    "description": "Manage your guild and participate in activities!",
                    "commands": [
                        ("`!guild`", "View guild information"),
                        ("`!guild join <name>`", "Join a guild"),
                        ("`!guild create <name>`", "Create a new guild"),
                        ("`!guild_battle`", "Participate in guild battles"),
                        ("`!guild_quests`", "View guild quests")
                    ],
                    "color": 0x4169E1
                },
                
                # Crafting commands
                "craft": {
                    "title": "🔨 Crafting Commands Guide",
                    "description": "Forge weapons, craft items, and gather materials!",
                    "commands": [
                        ("`!craft <item>`", "Craft items and equipment"),
                        ("`!forge <weapon>`", "Forge powerful weapons"),
                        ("`!materials`", "View your crafting materials"),
                        ("`!gather`", "Gather crafting resources"),
                        ("`!recipes`", "View available crafting recipes")
                    ],
                    "color": 0xFF8C00
                },
                
                # Intimate commands
                "intimate": {
                    "title": "💕 Intimate Commands Guide",
                    "description": "Build relationships with your characters!",
                    "commands": [
                        ("`!intimate <character>`", "Interact with a character"),
                        ("`!affection <character>`", "Check affection levels"),
                        ("`!interact <character> <action>`", "Specific interactions"),
                        ("`!relationship_status`", "View all relationships")
                    ],
                    "color": 0xFF69B4
                }
            }
            
            # Map command names to their guide categories
            command_mapping = {
                # Battle
                "battle": "battle", "fight": "battle", "duel": "battle",
                # Arena  
                "arena": "arena", "coliseum": "arena",
                # Events
                "events": "events", "dailyquest": "events", "seasonal": "events",
                # Mini-games
                "8ball": "8ball", "roll": "8ball", "rps": "8ball", "trivia": "8ball",
                "guess_number": "8ball", "slots": "8ball", "choose": "8ball", "games": "8ball",
                # Dreams
                "dreams": "dreams", "complete_dream": "dreams", "dream_buffs": "dreams",
                # Pets
                "pet": "pet", "feed": "pet", "pet_battle": "pet",
                # Guild
                "guild": "guild", "faction": "guild", "guild_battle": "guild",
                # Crafting  
                "craft": "craft", "forge": "craft", "materials": "craft", "gather": "craft",
                # Intimate
                "intimate": "intimate", "interact": "intimate", "affection": "intimate"
            }
            
            guide_key = command_mapping.get(command_name)
            if not guide_key or guide_key not in command_guides:
                return
                
            guide_data = command_guides[guide_key]
            
            embed = discord.Embed(
                title=guide_data["title"],
                description=guide_data["description"],
                color=guide_data["color"]
            )
            
            commands_text = ""
            for cmd, desc in guide_data["commands"]:
                commands_text += f"**{cmd}**\n*{desc}*\n\n"
            
            embed.add_field(
                name="📖 Available Commands",
                value=commands_text,
                inline=False
            )
            
            embed.add_field(
                name="💡 Tips",
                value="Use these commands here to get the most out of your gaming experience!\n"
                      "Commands are organized by channel to keep things neat and easy to find.",
                inline=False
            )
            
            embed.set_footer(text="KoKoroMichi Command Guide • Use !help for more info")
            
            await target_channel.send(embed=embed)
            
        except Exception as e:
            logger.error(f"Error sending command guide: {e}")

# Global instance
channel_manager = ChannelManager()

def check_channel_restriction():
    """Decorator to check channel restrictions"""
    def decorator(command_func):
        async def wrapper(self, ctx, *args, **kwargs):
            command_name = ctx.command.name
            
            # Check if channel restriction applies
            if await channel_manager.check_channel_restriction(ctx, command_name):
                # Log command usage
                await channel_manager.log_command_usage(ctx, command_name)
                # Execute the command
                return await command_func(self, ctx, *args, **kwargs)
            # If channel restriction failed, command won't execute
            
        wrapper.__name__ = command_func.__name__
        wrapper.__doc__ = command_func.__doc__
        return wrapper
    return decorator
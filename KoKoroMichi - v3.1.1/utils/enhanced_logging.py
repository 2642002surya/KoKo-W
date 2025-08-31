"""
Enhanced logging system for the KoKoroMichi bot with channel-specific event handling,
SSR announcements, dramatic effects, and beautiful UI enhancements.
"""

import discord
import json
import random
import asyncio
from datetime import datetime
from typing import Optional, Dict, Any

class EnhancedLogger:
    def __init__(self, bot):
        self.bot = bot
        
        # Channel configurations with emoji names
        self.channels = {
            "history": "📖-history",
            "market_updates": "💰-market-updates",
            "achievements": "🏆-achievements",
            "legendary_summons": "⭐-legendary-summons",
            "seasonal_chronicles": "🎭-seasonal-chronicles",
            "guild_chronicles": "⚜️-guild-chronicles",
            "dream_realm": "🌙-dream-realm",
            "daily_treasures": "🎁-daily-treasures",
            "pet_corner": "🐾-pet-corner",
            "events": "🎪-events",
            "contests": "🏆-contests",
            "mini_games": "🎮-mini-games",
            "arena_history": "⚔️-arena-history",
            "battle_history": "🗡️-battle-history",
            "forge_reports": "🔨-forge-reports",
            "lust_chamber": "🌹・lust-chamber"
        }
        
        # Dramatic effect templates
        self.dramatic_templates = {
            "legendary_summon": {
                "title": "🌟✨ LEGENDARY SUMMON ALERT! ✨🌟",
                "color": 0xFFD700,
                "animation": ["⭐", "🌟", "✨", "💫", "🌈", "⚡", "🔥", "💎"],
                "border": "✨" + "━" * 80 + "✨"
            },
            "mythic_summon": {
                "title": "🌈✨ MYTHIC AWAKENING! ✨🌈", 
                "color": 0xFF00FF,
                "animation": ["🌈", "✨", "⚡", "💎", "🌟", "💫", "🔮", "👑"],
                "border": "🌈" + "━" * 80 + "🌈"
            },
            "arena_victory": {
                "title": "⚔️ ARENA CHAMPION! ⚔️",
                "color": 0xFF4500,
                "animation": ["⚔️", "🏆", "👑", "🥇", "🎯", "💥", "🔥", "⭐"],
                "border": "⚔️" + "━" * 80 + "⚔️"
            },
            "battle_victory": {
                "title": "🗡️ COMBAT MASTER! 🗡️",
                "color": 0x8B0000,
                "animation": ["🗡️", "🛡️", "⚡", "💥", "🔥", "👑", "🎖️", "⭐"],
                "border": "🗡️" + "━" * 80 + "🗡️"
            },
            "achievement_unlock": {
                "title": "🏆 ACHIEVEMENT UNLOCKED! 🏆",
                "color": 0x32CD32,
                "animation": ["🏆", "🎖️", "🥇", "⭐", "✨", "👑", "🎉", "💎"],
                "border": "🏆" + "━" * 80 + "🏆"
            },
            "guild_event": {
                "title": "⚜️ GUILD CHRONICLES ⚜️",
                "color": 0x4B0082,
                "animation": ["⚜️", "👑", "🏰", "⚔️", "🛡️", "✨", "🌟", "💎"],
                "border": "⚜️" + "━" * 80 + "⚜️"
            }
        }
        
        # Rarity configurations for summon announcements
        self.rarity_configs = {
            "Mythic": {"announce": True, "threshold": 7000, "emoji": "🌈✨", "color": 0xFF00FF},
            "LR": {"announce": True, "threshold": 6000, "emoji": "⚡💎", "color": 0xFFD700},
            "UR": {"announce": True, "threshold": 5500, "emoji": "🌟💫", "color": 0xFF69B4},
            "SSR": {"announce": True, "threshold": 5000, "emoji": "✨🌟", "color": 0x00BFFF},
            "SR": {"announce": False, "threshold": 4000, "emoji": "🔥", "color": 0xFF4500},
            "R": {"announce": False, "threshold": 3000, "emoji": "🔧", "color": 0x32CD32},
            "N": {"announce": False, "threshold": 0, "emoji": "🌿", "color": 0x808080}
        }

    async def initialize_all_channels(self, guild: discord.Guild):
        """Create all necessary channels when bot starts"""
        required_channels = [
            ("history", "📖 General bot command history and activity logs"),
            ("market_updates", "💰 Economy events, market fluctuations, and investment updates"),
            ("achievements", "🏆 Achievement unlocks and milestone celebrations"),
            ("legendary_summons", "⭐ SSR+ summon announcements and legendary celebrations"),
            ("seasonal_chronicles", "🎭 Seasonal events and festival announcements"),
            ("guild_chronicles", "⚜️ Guild activities and faction events"),
            ("dream_realm", "🌙 Dream events and mystical happenings"),
            ("daily_treasures", "🎁 Daily reward claims and treasure logs"),
            ("pet_corner", "🐾 Pet activities and companion adventures"),
            ("events", "🎪 General events and announcements"),
            ("contests", "🏆 Contest events and competition results"),
            ("mini_games", "🎮 Mini-game activities and results"),
            ("arena_history", "⚔️ Arena battle results and leaderboard updates"),
            ("battle_history", "🗡️ Regular battle logs and combat history"),
            ("forge_reports", "🔨 Crafting activities and forge results"),
            ("lust_chamber", "🌹 Intimate interactions and affection activities")
        ]
        
        created_channels = []
        for channel_type, description in required_channels:
            try:
                channel = await self.get_or_create_channel(guild, channel_type)
                if channel:
                    created_channels.append(self.channels.get(channel_type, channel_type))
            except Exception as e:
                print(f"Failed to create channel {channel_type}: {e}")
        
        return created_channels

    async def check_channel_permissions(self, ctx, required_channels: list) -> bool:
        """Check if command is being run in correct channel, auto-create if needed"""
        if not required_channels:
            return True  # No restrictions
            
        current_channel = ctx.channel.name.lower()
        
        # Check if current channel matches any required channel
        for channel_type in required_channels:
            required_name = self.channels.get(channel_type, f"🤖-{channel_type}").lower()
            if current_channel == required_name:
                return True
        
        # If not in correct channel, create it and inform user
        guild = ctx.guild
        created_channels = []
        
        for channel_type in required_channels:
            channel = await self.get_or_create_channel(guild, channel_type)
            if channel:
                created_channels.append(channel.mention)
        
        if created_channels:
            embed = discord.Embed(
                title="⚠️ Wrong Channel!",
                description=f"This command can only be used in: {', '.join(created_channels)}",
                color=0xFF6B6B
            )
            embed.add_field(
                name="📍 Available Channels", 
                value="\n".join([f"• {ch}" for ch in created_channels]),
                inline=False
            )
            await ctx.send(embed=embed, delete_after=10)
        
        return False

    async def get_or_create_channel(self, guild: discord.Guild, channel_type: str) -> Optional[discord.TextChannel]:
        """Get or create a specialized logging channel"""
        channel_name = self.channels.get(channel_type, f"🤖-{channel_type}")
        
        # Try to find existing channel
        existing_channel = discord.utils.get(guild.text_channels, name=channel_name)
        if existing_channel:
            return existing_channel
        
        # Create new channel if bot has permissions
        try:
            if guild.me.guild_permissions.manage_channels:
                channel = await guild.create_text_channel(
                    name=channel_name,
                    topic=f"Automated logging for {channel_type.replace('_', ' ').title()} events - KoKoroMichi"
                )
                
                # Send a welcome message with dramatic effect
                if channel_type == "summon_announcements":
                    welcome_embed = discord.Embed(
                        title="🌟 Legendary Summons Channel Created! 🌟",
                        description="This channel will showcase all SSR+ summons with epic announcements!",
                        color=0xFFD700
                    )
                    welcome_embed.add_field(
                        name="✨ What gets announced:",
                        value="🌈 **Mythic** - Ultimate tier waifus\n⚡ **LR** - Legendary rare waifus\n🌟 **UR** - Ultra rare waifus\n✨ **SSR** - Super special rare waifus",
                        inline=False
                    )
                    await channel.send(embed=welcome_embed)
                
                return channel
            else:
                # Return general channel if can't create
                return discord.utils.get(guild.text_channels, name="general") or guild.text_channels[0]
        except Exception as e:
            print(f"Error creating channel {channel_name}: {e}")
            return discord.utils.get(guild.text_channels, name="general") or guild.text_channels[0]

    async def log_legendary_summon(self, guild: discord.Guild, user: discord.Member, waifu_data: Dict[str, Any]):
        """Log legendary summon announcements (SSR and above)"""
        rarity = waifu_data.get("rarity", "N").split()[0]  # Extract rarity from "SSR ✨🌟" format
        
        if rarity not in self.rarity_configs or not self.rarity_configs[rarity]["announce"]:
            return
        
        channel = await self.get_or_create_channel(guild, "summon_announcements")
        if not channel:
            return
        
        config = self.rarity_configs[rarity]
        template = self.dramatic_templates["mythic_summon"] if rarity == "Mythic" else self.dramatic_templates["legendary_summon"]
        
        # Create dramatic announcement
        embed = discord.Embed(
            title=template["title"],
            color=config["color"],
            timestamp=datetime.now()
        )
        
        # Add dramatic border
        embed.add_field(
            name=f"{template['border']}",
            value="",
            inline=False
        )
        
        # Main announcement
        embed.add_field(
            name=f"{config['emoji']} LEGENDARY SUMMONER {config['emoji']}",
            value=f"**{user.display_name}** has summoned a **{rarity}** tier waifu!",
            inline=False
        )
        
        # Waifu details with enhanced formatting
        waifu_info = f"**Name:** {waifu_data.get('name', 'Unknown')}\n"
        waifu_info += f"**Rarity:** {waifu_data.get('rarity', 'Unknown')}\n"
        waifu_info += f"**Element:** {waifu_data.get('element', 'Neutral')}\n"
        waifu_info += f"**Power Level:** {waifu_data.get('potential', 0):,}\n"
        waifu_info += f"**HP:** {waifu_data.get('hp', 0)} | **ATK:** {waifu_data.get('atk', 0)} | **DEF:** {waifu_data.get('def', 0)}"
        
        embed.add_field(
            name="🎭 Summoned Character",
            value=waifu_info,
            inline=False
        )
        
        # Add congratulatory message
        congratulations = [
            f"🎉 Congratulations {user.display_name}! The legends speak of this moment!",
            f"✨ {user.display_name} has achieved the impossible! Ancient magic responds!",
            f"🌟 Behold! {user.display_name} has summoned a being of immense power!",
            f"👑 {user.display_name} now commands forces beyond mortal comprehension!"
        ]
        
        embed.add_field(
            name="🎊 Celebration",
            value=random.choice(congratulations),
            inline=False
        )
        
        # Add bottom border
        embed.add_field(
            name=f"{template['border']}",
            value="",
            inline=False
        )
        
        # Send with reaction animation
        message = await channel.send(embed=embed)
        
        # Add reactions for celebration
        reactions = template["animation"][:6]  # Limit to 6 reactions
        for emoji in reactions:
            try:
                await message.add_reaction(emoji)
                await asyncio.sleep(0.3)
            except:
                pass

    async def log_arena_battle(self, guild: discord.Guild, winner: discord.Member, loser_name: str, battle_details: Dict[str, Any]):
        """Log arena battle results with dramatic effects"""
        channel = await self.get_or_create_channel(guild, "arena_history")
        if not channel:
            return
        
        template = self.dramatic_templates["arena_victory"]
        
        embed = discord.Embed(
            title=template["title"],
            color=template["color"],
            timestamp=datetime.now()
        )
        
        # Battle summary
        battle_info = f"**Victor:** {winner.display_name}\n"
        battle_info += f"**Opponent:** {loser_name}\n"
        battle_info += f"**Arena Rank:** {battle_details.get('rank_change', 'Unknown')}\n"
        battle_info += f"**Damage Dealt:** {battle_details.get('damage_dealt', 0):,}\n"
        battle_info += f"**Rounds:** {battle_details.get('rounds', 1)}"
        
        embed.add_field(name="⚔️ Battle Results", value=battle_info, inline=False)
        
        # Add motivational message
        victory_messages = [
            f"🏆 {winner.display_name} proves their might in the arena!",
            f"⚡ Another victory etched into {winner.display_name}'s legend!",
            f"🌟 {winner.display_name}'s tactical prowess shines through!",
            f"👑 {winner.display_name} continues their reign of dominance!"
        ]
        
        embed.add_field(
            name="🎉 Glory",
            value=random.choice(victory_messages),
            inline=False
        )
        
        await channel.send(embed=embed)

    async def log_battle_history(self, guild: discord.Guild, winner: discord.Member, opponent_name: str, battle_data: Dict[str, Any]):
        """Log regular battle results"""
        channel = await self.get_or_create_channel(guild, "battle_history")
        if not channel:
            return
        
        template = self.dramatic_templates["battle_victory"]
        
        embed = discord.Embed(
            title="🗡️ Combat Victory! 🗡️",
            color=template["color"],
            timestamp=datetime.now()
        )
        
        battle_summary = f"**Champion:** {winner.display_name}\n"
        battle_summary += f"**Defeated:** {opponent_name}\n"
        battle_summary += f"**XP Gained:** {battle_data.get('xp_gained', 0)}\n"
        battle_summary += f"**Gold Earned:** {battle_data.get('gold_earned', 0)}\n"
        battle_summary += f"**Battle Duration:** {battle_data.get('duration', 'Quick')}"
        
        embed.add_field(name="⚔️ Combat Summary", value=battle_summary, inline=False)
        
        await channel.send(embed=embed)

    async def log_achievement(self, guild: discord.Guild, user: discord.Member, achievement_data: Dict[str, Any]):
        """Log achievement unlocks with celebration"""
        channel = await self.get_or_create_channel(guild, "achievements")
        if not channel:
            return
        
        template = self.dramatic_templates["achievement_unlock"]
        
        embed = discord.Embed(
            title=template["title"],
            color=template["color"],
            timestamp=datetime.now()
        )
        
        achievement_info = f"**Achiever:** {user.display_name}\n"
        achievement_info += f"**Achievement:** {achievement_data.get('name', 'Unknown')}\n"
        achievement_info += f"**Description:** {achievement_data.get('description', 'No description')}\n"
        achievement_info += f"**Rarity:** {achievement_data.get('rarity', 'Common')}\n"
        achievement_info += f"**Reward:** {achievement_data.get('reward', 'Honor')}"
        
        embed.add_field(name="🏆 Achievement Details", value=achievement_info, inline=False)
        
        # Add celebration message
        celebration_messages = [
            f"🎊 {user.display_name} has reached new heights of greatness!",
            f"✨ Another milestone conquered by {user.display_name}!",
            f"🌟 {user.display_name}'s dedication bears magnificent fruit!",
            f"👑 {user.display_name} continues their path to legend!"
        ]
        
        embed.add_field(
            name="🎉 Congratulations",
            value=random.choice(celebration_messages),
            inline=False
        )
        
        message = await channel.send(embed=embed)
        
        # Add celebration reactions
        for emoji in template["animation"][:4]:
            try:
                await message.add_reaction(emoji)
            except:
                pass

    async def log_guild_event(self, guild: discord.Guild, event_type: str, event_data: Dict[str, Any]):
        """Log guild-related events"""
        channel = await self.get_or_create_channel(guild, "guild_events")
        if not channel:
            return
        
        template = self.dramatic_templates["guild_event"]
        
        embed = discord.Embed(
            title=f"⚜️ {event_type.upper().replace('_', ' ')} ⚜️",
            color=template["color"],
            timestamp=datetime.now()
        )
        
        # Format event data based on type
        if event_type == "member_join":
            embed.add_field(
                name="🎊 New Guild Member",
                value=f"Welcome {event_data.get('member_name', 'Unknown')} to the guild!\n"
                      f"Guild Level: {event_data.get('guild_level', 1)}\n"
                      f"Member Count: {event_data.get('member_count', 0)}",
                inline=False
            )
        elif event_type == "level_up":
            embed.add_field(
                name="📈 Guild Level Up",
                value=f"Guild has reached level {event_data.get('new_level', 1)}!\n"
                      f"New Bonuses Unlocked: {event_data.get('bonuses', 'None')}\n"
                      f"Celebration Time! 🎉",
                inline=False
            )
        
        await channel.send(embed=embed)

    async def add_dramatic_effects(self, embed: discord.Embed, effect_type: str = "general"):
        """Add dramatic visual effects to embeds"""
        if effect_type in self.dramatic_templates:
            template = self.dramatic_templates[effect_type]
            
            # Add animated emojis to description
            current_desc = embed.description or ""
            animation_line = " ".join(template["animation"][:5])
            embed.description = f"{animation_line}\n{current_desc}\n{animation_line}"
            
            # Add dramatic footer
            embed.set_footer(text="✨ KoKoroMichi - Where Legends Are Born ✨")
        
        return embed

    async def log_command_usage(self, guild: discord.Guild, user: discord.Member, command_name: str, channel_name: str, extra_info: str = ""):
        """Universal command logging for all commands"""
        try:
            # Use general history or create it
            history_channel = discord.utils.get(guild.text_channels, name="📝-history")
            if not history_channel:
                try:
                    history_channel = await guild.create_text_channel(
                        "📝-history",
                        topic="📝 Command usage history and general logs for the KoKoroMichi bot"
                    )
                    await history_channel.send("📝 **Command History Channel Created!** All command usage will be logged here.")
                except:
                    history_channel = discord.utils.get(guild.text_channels, name="general") or guild.text_channels[0]
            
            if not history_channel:
                return
            
            # Command-specific emojis
            command_emojis = {
                "profile": "👀", "battle": "⚔️", "arena": "🏟️", "daily": "🎁",
                "summon": "🎉", "gallery": "🖼️", "inventory": "🎒", "store": "🛒",
                "craft": "🔨", "guild": "⚜️", "achievements": "🏆", "quests": "📜",
                "pets": "🐾", "intimate": "💕", "dreams": "🌙", "seasonal": "🎭",
                "help": "❓", "admin": "🔧", "inspect": "🔍", "upgrade": "⬆️"
            }
            
            emoji = command_emojis.get(command_name, "📝")
            
            log_message = f"📝 **{user}** used **{command_name}** command in **#{channel_name}** {emoji}"
            if extra_info:
                log_message += f"\n{extra_info}"
                
            await history_channel.send(log_message)
            
        except Exception as e:
            print(f"Error in command logging: {e}")

# Global instance for easy access
enhanced_logger = None

def initialize_logger(bot):
    global enhanced_logger
    enhanced_logger = EnhancedLogger(bot)
    return enhanced_logger

def get_logger():
    global enhanced_logger
    return enhanced_logger
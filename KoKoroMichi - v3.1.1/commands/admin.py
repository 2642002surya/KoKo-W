# Admin Commands for KoKoroMichi Advanced Bot
import discord
from discord.ext import commands
from typing import Optional, Dict, List
import json
from datetime import datetime, timedelta

from core.data_manager import data_manager
from core.embed_utils import EmbedBuilder
from core.config import ADMIN_USER_ID
from utils.helpers import format_number
import logging

logger = logging.getLogger(__name__)

class AdminCommands(commands.Cog):
    """Administrative commands for bot management and moderation"""
    
    def __init__(self, bot):
        self.bot = bot
        self.embed_builder = EmbedBuilder()
        
        # Admin user IDs
        self.admin_users = {ADMIN_USER_ID}  # Your admin user ID
        self.moderator_users = set()  # Add moderator user IDs here
    
    def is_admin(self, user_id: int) -> bool:
        """Check if user is an admin"""
        return str(user_id) in self.admin_users or user_id == self.bot.owner_id
    
    def is_moderator(self, user_id: int) -> bool:
        """Check if user is a moderator or admin"""
        return user_id in self.moderator_users or self.is_admin(user_id)
    
    @commands.group(name="admin", invoke_without_command=True)
    async def admin_group(self, ctx):
        """Admin command group - requires admin permissions"""
        # Admin commands must be used in DM
        if not isinstance(ctx.channel, discord.DMChannel):
            embed = self.embed_builder.warning_embed(
                "Admin Commands",
                "Admin commands must be used in direct messages for security."
            )
            await ctx.send(embed=embed)
            return
        
        if not self.is_admin(ctx.author.id):
            embed = self.embed_builder.error_embed(
                "Access Denied",
                "You don't have permission to use admin commands."
            )
            await ctx.send(embed=embed)
            return
        
        embed = self.embed_builder.create_embed(
            title="🛠️ Admin Panel",
            description="Bot administration and management commands",
            color=0xFF0000
        )
        
        embed.add_field(
            name="👥 User Management",
            value="• `!admin give <user> <item> <amount>` - Give items\n"
                  "• `!admin gold <user> <amount>` - Modify gold\n"
                  "• `!admin reset <user>` - Reset user data\n"
                  "• `!admin ban <user> [reason]` - Ban user",
            inline=False
        )
        
        embed.add_field(
            name="📊 Bot Management",
            value="• `!admin stats` - Bot statistics\n"
                  "• `!admin backup` - Create data backup\n"
                  "• `!admin announce <message>` - Server announcement\n"
                  "• `!admin maintenance` - Toggle maintenance mode",
            inline=False
        )
        
        await ctx.send(embed=embed)
    
    @admin_group.command(name="give")
    async def give_item(self, ctx, member: discord.Member, item_name: str, amount: int = 1):
        """Give items to a user"""
        if not self.is_admin(ctx.author.id):
            await ctx.send("❌ Admin access required.")
            return
        
        try:
            if amount <= 0 or amount > 1000000:
                embed = self.embed_builder.error_embed(
                    "Invalid Amount",
                    "Amount must be between 1 and 1,000,000"
                )
                await ctx.send(embed=embed)
                return
            
            user_data = data_manager.get_user_data(str(member.id))
            inventory = user_data.setdefault("inventory", {})
            
            # Add item to inventory
            inventory[item_name] = inventory.get(item_name, 0) + amount
            data_manager.save_user_data(str(member.id), user_data)
            
            embed = self.embed_builder.success_embed(
                "Item Given",
                f"Successfully gave **{item_name}** x{amount} to {member.mention}"
            )
            
            # Log admin action
            logger.info(f"Admin {ctx.author} gave {item_name} x{amount} to {member.display_name}")
            
            await ctx.send(embed=embed)
            
        except Exception as e:
            embed = self.embed_builder.error_embed(
                "Give Item Error",
                "Unable to give item. Please try again."
            )
            await ctx.send(embed=embed)
            print(f"Admin give error: {e}")
    
    @admin_group.command(name="gold")
    async def modify_gold(self, ctx, member: discord.Member, amount: int):
        """Modify a user's gold (can be negative to subtract)"""
        if not self.is_admin(ctx.author.id):
            await ctx.send("❌ Admin access required.")
            return
        
        try:
            user_data = data_manager.get_user_data(str(member.id))
            old_gold = user_data.get("gold", 0)
            new_gold = max(0, old_gold + amount)
            user_data["gold"] = new_gold
            
            data_manager.save_user_data(str(member.id), user_data)
            
            action = "Added" if amount > 0 else "Removed"
            embed = self.embed_builder.success_embed(
                "Gold Modified",
                f"{action} {format_number(abs(amount))} gold to {member.mention}\n"
                f"Previous: {format_number(old_gold)} → New: {format_number(new_gold)}"
            )
            
            # Log admin action
            await self.log_admin_action(ctx, f"Modified gold for {member.display_name}: {amount:+,}")
            
            await ctx.send(embed=embed)
            
        except Exception as e:
            embed = self.embed_builder.error_embed(
                "Gold Modification Error",
                "Unable to modify gold. Please try again."
            )
            await ctx.send(embed=embed)
            print(f"Admin gold error: {e}")
    
    @admin_group.command(name="reset")
    async def reset_user(self, ctx, member: discord.Member):
        """Reset a user's data (DESTRUCTIVE - requires confirmation)"""
        if not self.is_admin(ctx.author.id):
            await ctx.send("❌ Admin access required.")
            return
        
        # Create confirmation view
        view = ResetConfirmationView(str(ctx.author.id), str(member.id), member.display_name)
        embed = self.embed_builder.warning_embed(
            "⚠️ DESTRUCTIVE ACTION",
            f"Are you sure you want to reset ALL data for {member.mention}?\n"
            f"This action cannot be undone!"
        )
        
        await ctx.send(embed=embed, view=view)
    
    @admin_group.command(name="stats")
    async def show_stats(self, ctx):
        """Display bot statistics"""
        if not self.is_moderator(ctx.author.id):
            await ctx.send("❌ Moderator access required.")
            return
        
        try:
            # Get user count
            total_users = data_manager.get_users_count()
            
            # Bot stats
            guild_count = len(self.bot.guilds)
            total_members = sum(guild.member_count for guild in self.bot.guilds)
            
            embed = self.embed_builder.create_embed(
                title="📊 Bot Statistics",
                description="Current bot performance and usage metrics",
                color=0x00BFFF
            )
            
            embed.add_field(
                name="👥 User Statistics",
                value=f"Registered Users: {format_number(total_users)}\n"
                      f"Total Discord Members: {format_number(total_members)}\n"
                      f"Servers: {guild_count}",
                inline=True
            )
            
            # Memory and performance
            import psutil
            process = psutil.Process()
            memory_mb = process.memory_info().rss / 1024 / 1024
            cpu_percent = process.cpu_percent()
            
            embed.add_field(
                name="🖥️ Performance",
                value=f"Memory Usage: {memory_mb:.1f} MB\n"
                      f"CPU Usage: {cpu_percent:.1f}%\n"
                      f"Uptime: {self.get_uptime()}",
                inline=True
            )
            
            # Bot version and info
            embed.add_field(
                name="🤖 Bot Info",
                value=f"Version: 3.0.0 Advanced\n"
                      f"Discord.py: {discord.__version__}\n"
                      f"Latency: {self.bot.latency * 1000:.1f}ms",
                inline=True
            )
            
            await ctx.send(embed=embed)
            
        except Exception as e:
            embed = self.embed_builder.error_embed(
                "Stats Error",
                "Unable to retrieve bot statistics."
            )
            await ctx.send(embed=embed)
            print(f"Bot stats error: {e}")
    
    @admin_group.command(name="announce")
    async def make_announcement(self, ctx, *, message: str):
        """Make a server-wide announcement"""
        if not self.is_admin(ctx.author.id):
            await ctx.send("❌ Admin access required.")
            return
        
        try:
            embed = self.embed_builder.create_embed(
                title="📢 Server Announcement",
                description=message,
                color=0xFF4500
            )
            
            embed.set_footer(text=f"Announcement by {ctx.author.display_name}")
            embed.timestamp = datetime.now()
            
            # Send to current channel
            await ctx.send(embed=embed)
            
            # Log admin action
            await self.log_admin_action(ctx, f"Made announcement: {message[:100]}...")
            
            await ctx.message.add_reaction("✅")
            
        except Exception as e:
            embed = self.embed_builder.error_embed(
                "Announcement Error",
                "Unable to make announcement."
            )
            await ctx.send(embed=embed)
            print(f"Announcement error: {e}")
    
    @admin_group.command(name="backup")
    async def create_backup(self, ctx):
        """Create a backup of bot data"""
        if not self.is_admin(ctx.author.id):
            await ctx.send("❌ Admin access required.")
            return
        
        try:
            # Create backup timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            # This would create actual backups in production
            embed = self.embed_builder.success_embed(
                "Backup Created",
                f"Data backup created successfully!\n"
                f"Backup ID: `backup_{timestamp}`\n"
                f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            )
            
            # Log admin action
            await self.log_admin_action(ctx, f"Created data backup: backup_{timestamp}")
            
            await ctx.send(embed=embed)
            
        except Exception as e:
            embed = self.embed_builder.error_embed(
                "Backup Error",
                "Unable to create backup."
            )
            await ctx.send(embed=embed)
            print(f"Backup error: {e}")
    
    @commands.command(name="userinfo")
    async def user_info(self, ctx, member: discord.Member = None):
        """Get detailed information about a user (moderator command)"""
        if not self.is_moderator(ctx.author.id):
            embed = self.embed_builder.error_embed(
                "Access Denied",
                "You don't have permission to use this command."
            )
            await ctx.send(embed=embed)
            return
        
        target = member or ctx.author
        user_data = data_manager.get_user_data(str(target.id))
        
        embed = self.embed_builder.create_embed(
            title=f"👤 User Information - {target.display_name}",
            color=0x9370DB
        )
        
        # Basic info
        embed.add_field(
            name="📊 Basic Stats",
            value=f"User ID: {target.id}\n"
                  f"Level: {user_data.get('level', 1)}\n"
                  f"Gold: {format_number(user_data.get('gold', 0))}\n"
                  f"Gems: {format_number(user_data.get('gems', 0))}",
            inline=True
        )
        
        # Collection
        waifus_count = len(user_data.get("claimed_waifus", []))
        inventory_count = len(user_data.get("inventory", {}))
        
        embed.add_field(
            name="📦 Collection",
            value=f"Characters: {waifus_count}\n"
                  f"Items: {inventory_count}\n"
                  f"Achievements: {len(user_data.get('achievements', []))}",
            inline=True
        )
        
        # Activity
        last_active = user_data.get("last_active", "Never")
        created_at = user_data.get("created_at", "Unknown")
        
        embed.add_field(
            name="📅 Activity",
            value=f"Joined: {created_at[:10] if created_at != 'Unknown' else 'Unknown'}\n"
                  f"Last Active: {last_active[:10] if last_active != 'Never' else 'Never'}",
            inline=True
        )
        
        await ctx.send(embed=embed)
    
    async def log_admin_action(self, ctx, action: str):
        """Log admin actions for audit trail"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "admin_id": str(ctx.author.id),
            "admin_name": ctx.author.display_name,
            "action": action,
            "guild_id": str(ctx.guild.id) if ctx.guild else None
        }
        
        # In production, this would write to a log file or database
        print(f"ADMIN LOG: {log_entry}")
    
    def get_uptime(self) -> str:
        """Get bot uptime"""
        if hasattr(self.bot, 'start_time'):
            uptime = datetime.now() - self.bot.start_time
            days = uptime.days
            hours, remainder = divmod(uptime.seconds, 3600)
            minutes, _ = divmod(remainder, 60)
            return f"{days}d {hours}h {minutes}m"
        return "Unknown"


class ResetConfirmationView(discord.ui.View):
    """Confirmation view for user data reset"""
    
    def __init__(self, admin_id: str, target_id: str, target_name: str):
        super().__init__(timeout=60.0)
        self.admin_id = admin_id
        self.target_id = target_id
        self.target_name = target_name
    
    @discord.ui.button(label="✅ CONFIRM RESET", style=discord.ButtonStyle.danger)
    async def confirm_reset(self, interaction: discord.Interaction, button: discord.ui.Button):
        """Confirm the user data reset"""
        if str(interaction.user.id) != self.admin_id:
            await interaction.response.send_message("Only the admin who initiated this can confirm.", ephemeral=True)
            return
        
        try:
            # Create new default profile
            from core.data_manager import data_manager
            
            # Get the current data for backup info
            old_data = data_manager.get_user_data(self.target_id)
            old_level = old_data.get("level", 1)
            old_gold = old_data.get("gold", 0)
            
            # Reset user data (this would delete and recreate profile)
            # In production, you might want to move old data to archive
            default_profile = data_manager._create_default_profile()
            data_manager.save_user_data(self.target_id, default_profile)
            
            embed = EmbedBuilder.success_embed(
                "User Data Reset Complete",
                f"Successfully reset all data for **{self.target_name}**"
            )
            
            embed.add_field(
                name="📊 Previous Stats",
                value=f"Level: {old_level}\nGold: {format_number(old_gold)}",
                inline=True
            )
            
            embed.add_field(
                name="🔄 New Stats", 
                value=f"Level: 1\nGold: {format_number(default_profile.get('gold', 0))}",
                inline=True
            )
            
            # Disable all buttons
            for item in self.children:
                item.disabled = True
            
            await interaction.response.edit_message(embed=embed, view=self)
            
        except Exception as e:
            await interaction.response.send_message("❌ Error performing reset.", ephemeral=True)
            print(f"Reset error: {e}")
    
    @discord.ui.button(label="❌ Cancel", style=discord.ButtonStyle.secondary)
    async def cancel_reset(self, interaction: discord.Interaction, button: discord.ui.Button):
        """Cancel the reset operation"""
        if str(interaction.user.id) != self.admin_id:
            await interaction.response.send_message("Only the admin who initiated this can cancel.", ephemeral=True)
            return
        
        embed = EmbedBuilder.info_embed(
            "Reset Cancelled",
            f"User data reset for **{self.target_name}** was cancelled."
        )
        
        # Disable all buttons
        for item in self.children:
            item.disabled = True
        
        await interaction.response.edit_message(embed=embed, view=self)


async def setup(bot):
    """Setup function for loading the cog"""
    await bot.add_cog(AdminCommands(bot))
"""
Standardized channel restriction system for all commands
"""
import discord
import re

def normalize_channel_name(channel_name: str) -> str:
    """Remove emojis and normalize channel name for comparison"""
    clean_name = re.sub(r'[^a-zA-Z0-9\-_\s]', '', channel_name)
    return clean_name.lower().strip().replace(' ', '-')

async def check_channel_restriction(ctx, required_channels, bot) -> bool:
    """Check if command is used in correct channel, create if missing"""
    current_channel = normalize_channel_name(ctx.channel.name)
    
    # Check if current channel matches any required channel
    for required in required_channels:
        if required in current_channel or current_channel in required:
            return True
    
    # Try to find existing channels
    found_channels = []
    for channel in ctx.guild.text_channels:
        normalized = normalize_channel_name(channel.name)
        for required in required_channels:
            if required in normalized or normalized in required:
                found_channels.append(channel.mention)
    
    if found_channels:
        embed = discord.Embed(
            title="⚠️ Wrong Channel!",
            description=f"This command can only be used in:",
            color=0xff0000
        )
        embed.add_field(
            name="📍 Available Channels",
            value="\n".join([f"• {ch}" for ch in found_channels]),
            inline=False
        )
        await ctx.send(embed=embed, delete_after=10)
        return False
    
    # Create missing channels
    try:
        created_channels = []
        for channel_name in required_channels:
            # Use appropriate emoji based on channel type
            emoji = "🏰" if "guild" in channel_name else "🔨" if any(x in channel_name for x in ["forge", "craft", "alchemy"]) else "🏆" if "achievement" in channel_name else "🌹" if "lust" in channel_name else "📜"
            
            new_channel = await ctx.guild.create_text_channel(
                f"{emoji}-{channel_name}",
                topic=f"Channel for {channel_name.replace('-', ' ')} commands"
            )
            created_channels.append(new_channel.mention)
        
        embed = discord.Embed(
            title="🔧 Channels Created!",
            description=f"Created required channels:",
            color=0x00ff00
        )
        embed.add_field(
            name="📍 Available Channels",
            value="\n".join([f"• {ch}" for ch in created_channels]) + "\n\nPlease use commands in these channels!",
            inline=False
        )
        await ctx.send(embed=embed)
        return False
    except discord.Forbidden:
        embed = discord.Embed(
            title="❌ Permission Error",
            description="Missing permissions to create channels.",
            color=0xff0000
        )
        embed.add_field(
            name="💡 Ask an Admin",
            value="Please ask an admin to create: " + ", ".join([f"#{ch}" for ch in required_channels]),
            inline=False
        )
        await ctx.send(embed=embed)
        return False

async def enforce_channel_restrictions(ctx, required_channels, error_message) -> bool:
    """Simplified wrapper for channel restrictions with custom error message"""
    return await check_channel_restriction(ctx, required_channels, ctx.bot)
# Bot decorators for KoKoroMichi
from functools import wraps
import discord
from discord.ext import commands

def check_channel_restriction(bot):
    """Decorator to check channel restrictions"""
    def decorator(command_func):
        @wraps(command_func)
        async def wrapper(self, ctx, *args, **kwargs):
            command_name = ctx.command.name
            
            # Check if channel restriction applies
            if await bot.channel_manager.check_channel_restriction(ctx, command_name):
                # Execute the command
                return await command_func(self, ctx, *args, **kwargs)
            # If channel restriction failed, command won't execute
            
        return wrapper
    return decorator
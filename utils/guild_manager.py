import json
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

class GuildManager:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), '../data/guilds.json')
        self.user_guilds_file = os.path.join(os.path.dirname(__file__), '../data/user_guilds.json')
        self.guild_data = self.load_guild_data()
        self.user_guilds = self.load_user_guilds()
    
    def load_guild_data(self) -> Dict:
        """Load guild configuration and templates"""
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"guild_settings": {}, "guild_bonuses": {}, "guild_roles": {}}
    
    def load_user_guilds(self) -> Dict:
        """Load user guild memberships and guild data"""
        try:
            with open(self.user_guilds_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"guilds": {}, "memberships": {}, "guild_activities": {}}
    
    def save_user_guilds(self):
        """Save guild data to file"""
        with open(self.user_guilds_file, 'w') as f:
            json.dump(self.user_guilds, f, indent=2)
    
    def create_guild(self, user_id: str, guild_name: str, faction: str) -> Tuple[bool, str, Dict]:
        """Create a new guild"""
        settings = self.guild_data["guild_settings"]
        
        # Validate guild name
        if len(guild_name) > settings.get("max_guild_name_length", 30):
            return False, f"Guild name too long! Max {settings['max_guild_name_length']} characters.", {}
        
        # Check if guild name already exists
        for guild_id, guild_info in self.user_guilds["guilds"].items():
            if guild_info["name"].lower() == guild_name.lower():
                return False, "A guild with this name already exists!", {}
        
        # Check if user is already in a guild
        if user_id in self.user_guilds["memberships"]:
            return False, "You're already in a guild! Leave your current guild first.", {}
        
        # Create guild
        guild_id = f"guild_{len(self.user_guilds['guilds'])}_{datetime.now().timestamp()}"
        
        guild_info = {
            "name": guild_name,
            "leader": user_id,
            "faction": faction,
            "members": {user_id: {"role": "leader", "joined_date": datetime.now().isoformat()}},
            "creation_date": datetime.now().isoformat(),
            "gold": 0,
            "xp": 0,
            "level": 1,
            "activities_completed": 0,
            "reputation": 100
        }
        
        self.user_guilds["guilds"][guild_id] = guild_info
        self.user_guilds["memberships"][user_id] = guild_id
        
        self.save_user_guilds()
        
        return True, f"Guild '{guild_name}' created successfully!", {
            "guild_id": guild_id,
            "guild_info": guild_info
        }
    
    def join_guild(self, user_id: str, guild_id: str) -> Tuple[bool, str, Dict]:
        """Join an existing guild"""
        if user_id in self.user_guilds["memberships"]:
            return False, "You're already in a guild!", {}
        
        if guild_id not in self.user_guilds["guilds"]:
            return False, "Guild not found!", {}
        
        guild = self.user_guilds["guilds"][guild_id]
        settings = self.guild_data["guild_settings"]
        
        if len(guild["members"]) >= settings.get("max_members", 20):
            return False, "Guild is full!", {}
        
        # Add member
        guild["members"][user_id] = {
            "role": "member",
            "joined_date": datetime.now().isoformat()
        }
        
        self.user_guilds["memberships"][user_id] = guild_id
        self.save_user_guilds()
        
        return True, f"Successfully joined guild '{guild['name']}'!", {
            "guild_info": guild
        }
    
    def leave_guild(self, user_id: str) -> Tuple[bool, str]:
        """Leave current guild"""
        if user_id not in self.user_guilds["memberships"]:
            return False, "You're not in a guild!"
        
        guild_id = self.user_guilds["memberships"][user_id]
        guild = self.user_guilds["guilds"][guild_id]
        
        # Check if user is leader
        if guild["leader"] == user_id:
            if len(guild["members"]) > 1:
                return False, "Transfer leadership before leaving the guild!"
            else:
                # Disband guild if leader is last member
                del self.user_guilds["guilds"][guild_id]
        
        # Remove member
        del guild["members"][user_id]
        del self.user_guilds["memberships"][user_id]
        
        self.save_user_guilds()
        return True, f"Left guild '{guild['name']}' successfully!"
    
    def get_guild_bonuses(self, user_id: str) -> Dict:
        """Get bonuses for user's guild"""
        if user_id not in self.user_guilds["memberships"]:
            return {}
        
        guild_id = self.user_guilds["memberships"][user_id]
        guild = self.user_guilds["guilds"][guild_id]
        member_count = len(guild["members"])
        user_role = guild["members"][user_id]["role"]
        
        # Determine guild size category
        size_category = "small_guild"
        for category, info in self.guild_data["guild_bonuses"].items():
            range_min, range_max = info["member_range"]
            if range_min <= member_count <= range_max:
                size_category = category
                break
        
        # Get base bonuses
        bonuses = self.guild_data["guild_bonuses"][size_category]["bonuses"].copy()
        
        # Apply role multiplier
        role_multiplier = self.guild_data["guild_roles"][user_role]["bonus_multiplier"]
        for bonus_type in bonuses:
            bonuses[bonus_type] *= role_multiplier
        
        # Apply faction bonuses
        faction = guild.get("faction")
        if faction and faction in self.guild_data["faction_system"]:
            faction_bonuses = self.guild_data["faction_system"][faction]["bonuses"]
            bonuses.update(faction_bonuses)
        
        return bonuses
    
    def start_guild_activity(self, user_id: str, activity_name: str) -> Tuple[bool, str, Dict]:
        """Start a guild activity"""
        if user_id not in self.user_guilds["memberships"]:
            return False, "You're not in a guild!", {}
        
        guild_id = self.user_guilds["memberships"][user_id]
        guild = self.user_guilds["guilds"][guild_id]
        
        # Find activity
        activity_data = None
        for activity in self.guild_data["guild_activities"]:
            if activity["name"] == activity_name:
                activity_data = activity
                break
        
        if not activity_data:
            return False, "Activity not found!", {}
        
        # Check participant requirements
        if len(guild["members"]) < activity_data["min_participants"]:
            return False, f"Need at least {activity_data['min_participants']} guild members!", {}
        
        # Start activity
        activity_id = f"{guild_id}_{activity_name}_{datetime.now().timestamp()}"
        
        activity_instance = {
            "activity_name": activity_name,
            "guild_id": guild_id,
            "start_time": datetime.now().isoformat(),
            "end_time": (datetime.now() + timedelta(hours=activity_data["duration_hours"])).isoformat(),
            "participants": [user_id],
            "status": "active",
            "progress": {}
        }
        
        self.user_guilds["guild_activities"][activity_id] = activity_instance
        self.save_user_guilds()
        
        return True, f"Started guild activity: {activity_name}", {
            "activity_id": activity_id,
            "activity": activity_instance
        }
    
    def participate_in_activity(self, user_id: str, activity_id: str) -> Tuple[bool, str]:
        """Join an ongoing guild activity"""
        if activity_id not in self.user_guilds["guild_activities"]:
            return False, "Activity not found!"
        
        activity = self.user_guilds["guild_activities"][activity_id]
        
        if user_id in activity["participants"]:
            return False, "You're already participating!"
        
        # Check if activity is still active
        end_time = datetime.fromisoformat(activity["end_time"])
        if datetime.now() > end_time:
            return False, "Activity has ended!"
        
        # Check guild membership
        if user_id not in self.user_guilds["memberships"]:
            return False, "You're not in a guild!"
        
        guild_id = self.user_guilds["memberships"][user_id]
        if guild_id != activity["guild_id"]:
            return False, "This activity is for a different guild!"
        
        activity["participants"].append(user_id)
        self.save_user_guilds()
        
        return True, "Successfully joined the guild activity!"
    
    def get_guild_info(self, guild_id: str) -> Optional[Dict]:
        """Get detailed guild information"""
        if guild_id not in self.user_guilds["guilds"]:
            return None
        
        guild = self.user_guilds["guilds"][guild_id]
        member_count = len(guild["members"])
        
        # Calculate guild bonuses
        size_category = "small_guild"
        for category, info in self.guild_data["guild_bonuses"].items():
            range_min, range_max = info["member_range"]
            if range_min <= member_count <= range_max:
                size_category = category
                break
        
        bonuses = self.guild_data["guild_bonuses"][size_category]["bonuses"]
        
        return {
            "guild_info": guild,
            "member_count": member_count,
            "size_category": size_category,
            "bonuses": bonuses,
            "faction_info": self.guild_data["faction_system"].get(guild.get("faction", ""), {})
        }
    
    def list_available_guilds(self, user_id: str) -> List[Dict]:
        """List guilds that user can join"""
        available = []
        settings = self.guild_data["guild_settings"]
        
        for guild_id, guild in self.user_guilds["guilds"].items():
            if len(guild["members"]) < settings.get("max_members", 20):
                available.append({
                    "guild_id": guild_id,
                    "name": guild["name"],
                    "faction": guild.get("faction", "None"),
                    "member_count": len(guild["members"]),
                    "level": guild.get("level", 1),
                    "reputation": guild.get("reputation", 100)
                })
        
        return available
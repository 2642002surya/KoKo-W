import json
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

class MishapManager:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), '../data/waifu_mishaps.json')
        self.user_data_file = os.path.join(os.path.dirname(__file__), '../data/user_mishaps.json')
        
        self.mishap_data = self.load_mishap_data()
        self.user_mishaps = self.load_user_data()
    
    def load_mishap_data(self) -> Dict:
        """Load mishap event definitions"""
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"mishap_settings": {}, "mood_messages": {}, "mishap_events": []}
    
    def load_user_data(self) -> Dict:
        """Load user mishap data"""
        try:
            with open(self.user_data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"active_moods": {}, "mishap_history": {}, "waifu_personalities": {}}
    
    def save_user_data(self):
        """Save user mishap data"""
        with open(self.user_data_file, 'w') as f:
            json.dump(self.user_mishaps, f, indent=2)
    
    def trigger_random_mood_message(self, user_id: str, command_context: str = "general") -> Tuple[bool, str]:
        """Trigger a random waifu mood message"""
        trigger_chance = self.mishap_data["mishap_settings"].get("trigger_chance", 0.10)
        
        if random.random() > trigger_chance:
            return False, ""
        
        # Get user's waifus and select one
        from .fileManager import load_users
        users = load_users()
        
        if user_id not in users or not users[user_id].get("claimed_waifus"):
            return False, ""
        
        # Get waifu name properly from the waifu data structure
        claimed_waifus = users[user_id]["claimed_waifus"]
        if claimed_waifus and isinstance(claimed_waifus[0], dict):
            # If waifus are stored as objects, extract names
            waifu_data = random.choice(claimed_waifus)
            waifu_name = waifu_data.get('name', 'Unknown Waifu')
        else:
            # If waifus are stored as names
            waifu_name = random.choice(claimed_waifus) if claimed_waifus else "Unknown Waifu"
        
        # Determine current mood or assign random one
        current_mood = self.get_waifu_mood(user_id, waifu_name)
        
        # Get mood messages
        mood_messages = self.mishap_data["mood_messages"].get(current_mood, [])
        if not mood_messages:
            mood_messages = self.mishap_data["mood_messages"].get("playful", [])
        
        if mood_messages:
            message = random.choice(mood_messages)
            message = f"**{waifu_name}**: {message}"
            return True, message
        
        return False, ""
    
    def get_waifu_mood(self, user_id: str, waifu_name: str) -> str:
        """Get or assign a waifu's current mood"""
        # Check active moods first
        active_moods = self.user_mishaps.get("active_moods", {})
        mood_key = f"{user_id}_{waifu_name}"
        
        if mood_key in active_moods:
            mood_data = active_moods[mood_key]
            expiry = datetime.fromisoformat(mood_data["expires"])
            
            if datetime.now() < expiry:
                return mood_data["mood"]
            else:
                # Mood expired, remove it
                del active_moods[mood_key]
                self.save_user_data()
        
        # Assign new random mood
        moods = list(self.mishap_data["mood_messages"].keys())
        new_mood = random.choice(moods)
        
        # Set mood with duration
        duration_hours = self.mishap_data["mishap_settings"].get("mood_duration_hours", 6)
        expiry_time = datetime.now() + timedelta(hours=duration_hours)
        
        if "active_moods" not in self.user_mishaps:
            self.user_mishaps["active_moods"] = {}
        
        self.user_mishaps["active_moods"][mood_key] = {
            "mood": new_mood,
            "expires": expiry_time.isoformat(),
            "assigned": datetime.now().isoformat()
        }
        
        self.save_user_data()
        return new_mood
    
    def trigger_mishap_event(self, user_id: str) -> Tuple[bool, str, Dict]:
        """Trigger a random mishap event"""
        from .fileManager import load_users, save_users
        users = load_users()
        
        if user_id not in users or not users[user_id].get("claimed_waifus"):
            return False, "No waifus available for mishaps!", {}
        
        # Select random mishap
        mishap_events = self.mishap_data.get("mishap_events", [])
        if not mishap_events:
            return False, "No mishap events available!", {}
        
        mishap = random.choice(mishap_events)
        
        # Get waifu name properly from the waifu data structure
        claimed_waifus = users[user_id]["claimed_waifus"]
        if claimed_waifus and isinstance(claimed_waifus[0], dict):
            # If waifus are stored as objects, extract names
            waifu_data = random.choice(claimed_waifus)
            waifu_name = waifu_data.get('name', 'Unknown Waifu')
        else:
            # If waifus are stored as names
            waifu_name = random.choice(claimed_waifus) if claimed_waifus else "Unknown Waifu"
        
        # Apply effects
        effects = mishap.get("effects", {})
        user_data = users[user_id]
        
        results = {
            "mishap_name": mishap["name"],
            "waifu_involved": waifu_name,
            "description": mishap["description"],
            "effects_applied": {}
        }
        
        # Gold changes
        if "gold_loss" in effects:
            gold_lost = min(effects["gold_loss"], user_data.get("gold", 0))
            user_data["gold"] = user_data.get("gold", 0) - gold_lost
            results["effects_applied"]["gold_lost"] = gold_lost
        
        # XP gains
        if "xp_gained" in effects:
            xp_gain = effects["xp_gained"]
            user_data["xp"] = user_data.get("xp", 0) + xp_gain
            results["effects_applied"]["xp_gained"] = xp_gain
        
        # Item gains
        if "items_gained" in effects:
            if "inventory" not in user_data:
                user_data["inventory"] = {}
            
            for item in effects["items_gained"]:
                user_data["inventory"][item] = user_data["inventory"].get(item, 0) + 1
            
            results["effects_applied"]["items_gained"] = effects["items_gained"]
        
        # Affinity changes
        if "affinity_change" in effects:
            # Update affinity (would need affinity manager integration)
            results["effects_applied"]["affinity_change"] = effects["affinity_change"]
        
        # Set mood
        mood_change = mishap.get("mood_change", "neutral")
        self.set_waifu_mood(user_id, waifu_name, mood_change)
        
        # Save user data
        save_users(users)
        
        # Record in history
        if "mishap_history" not in self.user_mishaps:
            self.user_mishaps["mishap_history"] = {}
        if user_id not in self.user_mishaps["mishap_history"]:
            self.user_mishaps["mishap_history"][user_id] = []
        
        history_entry = {
            "mishap_id": mishap["id"],
            "mishap_name": mishap["name"],
            "waifu_name": waifu_name,
            "timestamp": datetime.now().isoformat(),
            "effects": results["effects_applied"]
        }
        
        self.user_mishaps["mishap_history"][user_id].append(history_entry)
        self.save_user_data()
        
        return True, f"Mishap occurred: {mishap['name']}", results
    
    def set_waifu_mood(self, user_id: str, waifu_name: str, mood: str):
        """Set a specific waifu's mood"""
        duration_hours = self.mishap_data["mishap_settings"].get("mood_duration_hours", 6)
        expiry_time = datetime.now() + timedelta(hours=duration_hours)
        
        mood_key = f"{user_id}_{waifu_name}"
        
        if "active_moods" not in self.user_mishaps:
            self.user_mishaps["active_moods"] = {}
        
        self.user_mishaps["active_moods"][mood_key] = {
            "mood": mood,
            "expires": expiry_time.isoformat(),
            "assigned": datetime.now().isoformat()
        }
        
        self.save_user_data()
    
    def get_user_waifu_moods(self, user_id: str) -> Dict[str, str]:
        """Get all waifu moods for a user"""
        from .fileManager import load_users
        users = load_users()
        
        if user_id not in users:
            return {}
        
        waifu_moods = {}
        active_moods = self.user_mishaps.get("active_moods", {})
        
        for waifu_name in users[user_id].get("claimed_waifus", []):
            mood_key = f"{user_id}_{waifu_name}"
            
            if mood_key in active_moods:
                mood_data = active_moods[mood_key]
                expiry = datetime.fromisoformat(mood_data["expires"])
                
                if datetime.now() < expiry:
                    waifu_moods[waifu_name] = mood_data["mood"]
                else:
                    # Mood expired
                    waifu_moods[waifu_name] = "neutral"
            else:
                waifu_moods[waifu_name] = "neutral"
        
        return waifu_moods
    
    def get_mishap_history(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get user's recent mishap history"""
        history = self.user_mishaps.get("mishap_history", {}).get(user_id, [])
        return history[-limit:] if history else []
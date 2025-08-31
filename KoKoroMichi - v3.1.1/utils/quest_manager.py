"""
Dynamic Waifu Quest System Manager
Handles quest creation, execution, and rewards
"""

import json
import os
import random
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional, Any
from .affinity_manager import AffinityManager

class QuestManager:
    def __init__(self, quest_file: str = "data/quests.json", users_file: str = "data/users.json"):
        self.quest_file = quest_file
        self.users_file = users_file
        self.data = self.load_quest_data()
        self.affinity_manager = AffinityManager()
        self.active_quests = self.data.get("active_quests", {})
    
    def load_quest_data(self) -> dict:
        """Load quest data from JSON file"""
        if os.path.exists(self.quest_file):
            try:
                with open(self.quest_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading quest data: {e}")
        
        return {"quest_types": {"common": [], "rare": [], "legendary": []}, "active_quests": {}}
    
    def save_quest_data(self):
        """Save quest data to JSON file"""
        try:
            self.data["active_quests"] = self.active_quests
            with open(self.quest_file, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving quest data: {e}")
    
    def load_users(self) -> dict:
        """Load user data"""
        if os.path.exists(self.users_file):
            try:
                with open(self.users_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return {}
        return {}
    
    def save_users(self, users_data: dict):
        """Save user data"""
        try:
            with open(self.users_file, 'w', encoding='utf-8') as f:
                json.dump(users_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving user data: {e}")
    
    def get_user_waifus(self, user_id: str) -> List[str]:
        """Get list of user's waifu names"""
        users = self.load_users()
        user_data = users.get(str(user_id), {})
        claimed_waifus = user_data.get("claimed_waifus", [])
        return [waifu.get("name", "Unknown") for waifu in claimed_waifus]
    
    def is_waifu_available(self, user_id: str, waifu_name: str) -> bool:
        """Check if waifu is available for quest (not already on one)"""
        user_id = str(user_id)
        quest_key = f"{user_id}_{waifu_name}"
        return quest_key not in self.active_quests
    
    def select_quest_type(self, user_id: str, participating_waifus: List[str]) -> str:
        """Select quest difficulty based on number of waifus and their levels"""
        waifu_count = len(participating_waifus)
        
        # Get bonuses from quest mechanics
        multi_bonuses = self.data.get("quest_mechanics", {}).get("multi_waifu_bonuses", {})
        
        # Base probabilities
        common_chance = 0.70
        rare_chance = 0.25
        legendary_chance = 0.05
        
        # Apply multi-waifu bonuses
        if waifu_count >= 4:
            bonus_data = multi_bonuses.get("4_plus_waifus", {})
            rare_chance = bonus_data.get("rare_quest_chance", 0.35)
            legendary_chance = bonus_data.get("legendary_quest_chance", 0.10)
            common_chance = 1.0 - rare_chance - legendary_chance
        elif waifu_count == 3:
            bonus_data = multi_bonuses.get("3_waifus", {})
            rare_chance = bonus_data.get("rare_quest_chance", 0.25)
            legendary_chance = bonus_data.get("legendary_quest_chance", 0.05)
            common_chance = 1.0 - rare_chance - legendary_chance
        elif waifu_count == 2:
            bonus_data = multi_bonuses.get("2_waifus", {})
            rare_chance = bonus_data.get("rare_quest_chance", 0.15)
            common_chance = 1.0 - rare_chance - legendary_chance
        
        # Random selection
        roll = random.random()
        if roll < legendary_chance:
            return "legendary"
        elif roll < legendary_chance + rare_chance:
            return "rare"
        else:
            return "common"
    
    def select_quest(self, quest_type: str, user_waifus: List[str]) -> Optional[dict]:
        """Select a random quest from the specified type"""
        quest_types = self.data.get("quest_types", {})
        available_quests = quest_types.get(quest_type, [])
        
        if not available_quests:
            return None
        
        # Filter quests by level requirements
        users = self.load_users()
        suitable_quests = []
        
        for quest in available_quests:
            required_level = quest.get("requires_level", 1)
            
            # Check if any participating waifu meets level requirement
            level_met = True  # Assume level met for now (would need user data integration)
            
            if level_met:
                suitable_quests.append(quest)
        
        if not suitable_quests:
            suitable_quests = available_quests  # Fallback to all quests
        
        return random.choice(suitable_quests)
    
    def start_quest(self, user_id: str, waifu_names: List[str]) -> Tuple[bool, str, Optional[dict]]:
        """Start a quest with specified waifus"""
        user_id = str(user_id)
        user_waifus = self.get_user_waifus(user_id)
        
        # Validate waifus
        for waifu_name in waifu_names:
            if waifu_name not in user_waifus:
                return False, f"You don't own {waifu_name}!", None
            
            if not self.is_waifu_available(user_id, waifu_name):
                return False, f"{waifu_name} is already on a quest!", None
        
        # Select quest type and quest
        quest_type = self.select_quest_type(user_id, waifu_names)
        quest_data = self.select_quest(quest_type, user_waifus)
        
        if not quest_data:
            return False, "No suitable quests available!", None
        
        # Calculate quest parameters
        base_duration = quest_data.get("duration", 3600)
        base_success_rate = quest_data.get("success_rate", 0.75)
        
        # Apply multi-waifu bonuses
        waifu_count = len(waifu_names)
        multi_bonuses = self.data.get("quest_mechanics", {}).get("multi_waifu_bonuses", {})
        
        success_bonus = 0.0
        if waifu_count >= 4:
            success_bonus = multi_bonuses.get("4_plus_waifus", {}).get("success_rate_bonus", 0.30)
        elif waifu_count == 3:
            success_bonus = multi_bonuses.get("3_waifus", {}).get("success_rate_bonus", 0.20)
        elif waifu_count == 2:
            success_bonus = multi_bonuses.get("2_waifus", {}).get("success_rate_bonus", 0.10)
        
        # Apply affinity bonuses
        affinity_modifiers = self.affinity_manager.get_quest_modifier(user_id, waifu_names)
        success_bonus += affinity_modifiers.get("success_bonus", 0.0)
        reward_multiplier = affinity_modifiers.get("reward_multiplier", 1.0)
        
        final_success_rate = min(0.95, base_success_rate + success_bonus)
        
        # Create quest instance
        quest_instance = {
            "quest_data": quest_data.copy(),
            "user_id": user_id,
            "waifu_names": waifu_names,
            "start_time": datetime.now().isoformat(),
            "end_time": (datetime.now() + timedelta(seconds=base_duration)).isoformat(),
            "success_rate": final_success_rate,
            "reward_multiplier": reward_multiplier,
            "quest_type": quest_type
        }
        
        # Add to active quests
        for waifu_name in waifu_names:
            quest_key = f"{user_id}_{waifu_name}"
            self.active_quests[quest_key] = quest_instance
        
        self.save_quest_data()
        
        # Generate start message
        duration_hours = base_duration // 3600
        duration_minutes = (base_duration % 3600) // 60
        duration_str = f"{duration_hours}h {duration_minutes}m" if duration_hours > 0 else f"{duration_minutes}m"
        
        waifu_list = ", ".join(waifu_names)
        start_message = (f"🗡️ **Quest Started!**\n"
                        f"**Participants:** {waifu_list}\n"
                        f"**Quest:** {quest_data['name']}\n"
                        f"**Description:** {quest_data['description']}\n"
                        f"**Duration:** {duration_str}\n"
                        f"**Success Rate:** {final_success_rate*100:.1f}%\n"
                        f"**Difficulty:** {quest_type.title()}")
        
        if affinity_modifiers.get("description"):
            start_message += f"\n**Team Synergy:** {affinity_modifiers['description']}"
        
        return True, start_message, quest_instance
    
    def check_quest_completion(self, user_id: str, waifu_name: str) -> Tuple[bool, Optional[dict]]:
        """Check if a quest is completed"""
        quest_key = f"{str(user_id)}_{waifu_name}"
        
        if quest_key not in self.active_quests:
            return False, None
        
        quest_instance = self.active_quests[quest_key]
        end_time = datetime.fromisoformat(quest_instance["end_time"])
        
        if datetime.now() >= end_time:
            return True, quest_instance
        
        return False, None
    
    def complete_quest(self, quest_instance: dict) -> Tuple[bool, str, Dict[str, Any]]:
        """Complete a quest and determine rewards"""
        success_rate = quest_instance["success_rate"]
        reward_multiplier = quest_instance["reward_multiplier"]
        quest_data = quest_instance["quest_data"]
        waifu_names = quest_instance["waifu_names"]
        user_id = quest_instance["user_id"]
        
        # Determine success
        success = random.random() < success_rate
        
        rewards = {"success": success, "items": {}}
        
        if success:
            # Calculate rewards based on quest type
            reward_type = quest_data.get("reward_type")
            
            if reward_type == "gold":
                min_gold = int(quest_data.get("min_reward", 100) * reward_multiplier)
                max_gold = int(quest_data.get("max_reward", 500) * reward_multiplier)
                gold_reward = random.randint(min_gold, max_gold)
                rewards["items"]["gold"] = gold_reward
                
            elif reward_type == "xp":
                min_xp = int(quest_data.get("min_reward", 50) * reward_multiplier)
                max_xp = int(quest_data.get("max_reward", 200) * reward_multiplier)
                xp_reward = random.randint(min_xp, max_xp)
                rewards["items"]["xp"] = xp_reward
                
            elif reward_type == "item":
                reward_items = quest_data.get("reward_items", ["Health Potion"])
                item_reward = random.choice(reward_items)
                rewards["items"]["item"] = item_reward
                
            elif reward_type == "relic":
                relic_options = quest_data.get("relic_options", ["Basic Relic"])
                relic_reward = random.choice(relic_options)
                rewards["items"]["relic"] = relic_reward
                
            elif reward_type == "multiple":
                multi_rewards = quest_data.get("rewards", {})
                for reward_category, reward_range in multi_rewards.items():
                    if reward_category == "item":
                        rewards["items"]["item"] = random.choice(reward_range)
                    else:
                        min_val, max_val = reward_range
                        rewards["items"][reward_category] = int(random.randint(min_val, max_val) * reward_multiplier)
        
        # Update affinity between participating waifus
        if len(waifu_names) > 1:
            for i, waifu_a in enumerate(waifu_names):
                for waifu_b in waifu_names[i+1:]:
                    event_type = "quest_together" if success else "quest_failure"
                    self.affinity_manager.trigger_relationship_event(user_id, waifu_a, waifu_b, event_type)
        
        # Remove from active quests
        for waifu_name in waifu_names:
            quest_key = f"{user_id}_{waifu_name}"
            if quest_key in self.active_quests:
                del self.active_quests[quest_key]
        
        self.save_quest_data()
        
        # Generate completion message
        story_outcomes = quest_data.get("story_outcomes", [])
        if story_outcomes and success:
            story_template = random.choice(story_outcomes)
            waifu_list = ", ".join(waifu_names)
            story_message = story_template.format(waifu=waifu_list, reward="their rewards")
        else:
            waifu_list = ", ".join(waifu_names)
            if success:
                story_message = f"{waifu_list} successfully completed the quest!"
            else:
                story_message = f"{waifu_list} encountered difficulties and couldn't complete the quest."
        
        return success, story_message, rewards
    
    def get_active_quests_for_user(self, user_id: str) -> Dict[str, dict]:
        """Get all active quests for a user"""
        user_id = str(user_id)
        user_quests = {}
        
        for quest_key, quest_instance in self.active_quests.items():
            if quest_instance["user_id"] == user_id:
                user_quests[quest_key] = quest_instance
        
        return user_quests
    
    def cancel_quest(self, user_id: str, waifu_name: str) -> Tuple[bool, str]:
        """Cancel an active quest"""
        quest_key = f"{str(user_id)}_{waifu_name}"
        
        if quest_key not in self.active_quests:
            return False, f"{waifu_name} is not on any quest!"
        
        quest_instance = self.active_quests[quest_key]
        waifu_names = quest_instance["waifu_names"]
        
        # Remove all participants from active quests
        for waifu in waifu_names:
            key = f"{user_id}_{waifu}"
            if key in self.active_quests:
                del self.active_quests[key]
        
        self.save_quest_data()
        
        waifu_list = ", ".join(waifu_names)
        return True, f"Quest cancelled. {waifu_list} have returned from their mission."
    
    async def auto_complete_quests(self):
        """Background task to auto-complete finished quests"""
        completed_quests = []
        
        for quest_key, quest_instance in self.active_quests.items():
            end_time = datetime.fromisoformat(quest_instance["end_time"])
            if datetime.now() >= end_time:
                completed_quests.append((quest_key, quest_instance))
        
        for quest_key, quest_instance in completed_quests:
            success, story, rewards = self.complete_quest(quest_instance)
            # Here you could send notifications to users about completed quests
            print(f"Quest auto-completed: {story}")
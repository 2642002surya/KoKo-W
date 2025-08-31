"""
Waifu Relationship System - Affinity Manager
Handles affinity tracking, relationship events, and bonuses/penalties
"""

import json
import os
import random
from typing import Dict, List, Tuple, Optional, Any
from datetime import datetime

class AffinityManager:
    def __init__(self, affinity_file: str = "data/affinity.json"):
        self.affinity_file = affinity_file
        self.data = self.load_affinity_data()
    
    def load_affinity_data(self) -> dict:
        """Load affinity data from JSON file"""
        if os.path.exists(self.affinity_file):
            try:
                with open(self.affinity_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading affinity data: {e}")
        
        # Return default structure if file doesn't exist
        return {
            "relationships": {},
            "global_events": {},
            "relationship_events": [],
            "story_templates": {}
        }
    
    def save_affinity_data(self):
        """Save affinity data to JSON file"""
        try:
            os.makedirs(os.path.dirname(self.affinity_file), exist_ok=True)
            with open(self.affinity_file, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving affinity data: {e}")
    
    def get_affinity(self, user_id: str, waifu_a: str, waifu_b: str) -> int:
        """Get affinity between two waifus for a user (0-100)"""
        user_id = str(user_id)
        relationships = self.data["relationships"].get(user_id, {})
        
        if waifu_a in relationships and waifu_b in relationships[waifu_a]:
            return relationships[waifu_a][waifu_b]
        
        # Default neutral affinity for new relationships
        return 50
    
    def set_affinity(self, user_id: str, waifu_a: str, waifu_b: str, value: int):
        """Set affinity between two waifus (bidirectional)"""
        user_id = str(user_id)
        value = max(0, min(100, value))  # Clamp between 0-100
        
        # Initialize user relationships if not exists
        if user_id not in self.data["relationships"]:
            self.data["relationships"][user_id] = {}
        
        relationships = self.data["relationships"][user_id]
        
        # Initialize waifu relationships if not exists
        if waifu_a not in relationships:
            relationships[waifu_a] = {}
        if waifu_b not in relationships:
            relationships[waifu_b] = {}
        
        # Set bidirectional relationship
        relationships[waifu_a][waifu_b] = value
        relationships[waifu_b][waifu_a] = value
        
        self.save_affinity_data()
    
    def modify_affinity(self, user_id: str, waifu_a: str, waifu_b: str, change: int, event_type: str = "generic") -> Tuple[int, str]:
        """Modify affinity and return new value with story message"""
        current_affinity = self.get_affinity(user_id, waifu_a, waifu_b)
        new_affinity = max(0, min(100, current_affinity + change))
        
        self.set_affinity(user_id, waifu_a, waifu_b, new_affinity)
        
        # Generate story message
        story_message = self.generate_story_message(waifu_a, waifu_b, new_affinity, event_type)
        
        return new_affinity, story_message
    
    def generate_story_message(self, waifu_a: str, waifu_b: str, affinity: int, event_type: str = "generic") -> str:
        """Generate a story message based on affinity level"""
        templates = self.data.get("story_templates", {})
        
        if affinity >= 80:
            category = "friendship"
        elif affinity <= 20:
            category = "rivalry"
        else:
            category = "neutral"
        
        category_templates = templates.get(category, [])
        if category_templates:
            template = random.choice(category_templates)
            return template.format(waifu_a=waifu_a, waifu_b=waifu_b)
        
        # Fallback messages
        if affinity >= 80:
            return f"{waifu_a} and {waifu_b} have grown closer together!"
        elif affinity <= 20:
            return f"{waifu_a} and {waifu_b} seem to be at odds with each other."
        else:
            return f"{waifu_a} and {waifu_b} had a neutral interaction."
    
    def get_relationship_type(self, affinity: int) -> str:
        """Get relationship type based on affinity value"""
        if affinity >= 80:
            return "Strong Friendship"
        elif affinity >= 60:
            return "Good Friends"
        elif affinity >= 40:
            return "Neutral"
        elif affinity >= 21:
            return "Mild Rivalry"
        else:
            return "Strong Rivalry"
    
    def get_battle_modifier(self, user_id: str, waifu_a: str, waifu_b: str) -> Dict[str, Any]:
        """Get battle modifiers based on affinity between waifus"""
        affinity = self.get_affinity(user_id, waifu_a, waifu_b)
        modifiers: Dict[str, Any] = {
            "attack_bonus": 0.0,
            "defense_bonus": 0.0,
            "xp_multiplier": 1.0,
            "description": ""
        }
        
        global_events = self.data.get("global_events", {})
        
        if affinity >= 80:
            friendship_bonus = global_events.get("friendship_bonuses", {}).get("80-100", {})
            modifiers["attack_bonus"] = friendship_bonus.get("battle_bonus", 0.05)
            modifiers["xp_multiplier"] = 1.0 + friendship_bonus.get("xp_bonus", 0.10)
            modifiers["description"] = "Fighting together as close friends!"
        elif affinity >= 60:
            friendship_bonus = global_events.get("friendship_bonuses", {}).get("60-79", {})
            modifiers["attack_bonus"] = friendship_bonus.get("battle_bonus", 0.02)
            modifiers["xp_multiplier"] = 1.0 + friendship_bonus.get("xp_bonus", 0.05)
            modifiers["description"] = "Good teamwork between friends!"
        elif affinity <= 20:
            rivalry_penalty = global_events.get("rivalry_effects", {}).get("0-20", {})
            modifiers["attack_bonus"] = rivalry_penalty.get("battle_penalty", -0.03)
            modifiers["defense_bonus"] = rivalry_penalty.get("defense_penalty", -0.05)
            modifiers["xp_multiplier"] = 1.0  # No XP penalty
            modifiers["description"] = "Discord between rivals affecting performance!"
        elif affinity <= 39:
            rivalry_penalty = global_events.get("rivalry_effects", {}).get("21-39", {})
            modifiers["attack_bonus"] = rivalry_penalty.get("battle_penalty", -0.01)
            modifiers["defense_bonus"] = rivalry_penalty.get("defense_penalty", -0.02)
            modifiers["description"] = "Minor tension affecting coordination."
        
        return modifiers
    
    def trigger_relationship_event(self, user_id: str, waifu_a: str, waifu_b: str, event_type: str) -> Tuple[int, str]:
        """Trigger a relationship event and return new affinity with message"""
        events = self.data.get("relationship_events", [])
        
        # Find matching event
        event_data = None
        for event in events:
            if event["type"] == event_type:
                event_data = event
                break
        
        if not event_data:
            return self.get_affinity(user_id, waifu_a, waifu_b), "No event occurred."
        
        change = event_data.get("affinity_change", 0)
        description = event_data.get("description", "had an interaction")
        
        new_affinity, story_message = self.modify_affinity(user_id, waifu_a, waifu_b, change, event_type)
        
        full_message = f"{waifu_a} and {waifu_b} {description}. {story_message}"
        return new_affinity, full_message
    
    def get_user_relationships_summary(self, user_id: str) -> Dict[str, Dict[str, int]]:
        """Get all relationships for a user"""
        user_id = str(user_id)
        return self.data["relationships"].get(user_id, {})
    
    def initialize_waifu_relationships(self, user_id: str, new_waifu: str, existing_waifus: List[str]):
        """Initialize relationships for a newly summoned waifu"""
        user_id = str(user_id)
        
        for existing_waifu in existing_waifus:
            if existing_waifu != new_waifu:
                # Set random neutral affinity (45-55) for new relationships
                initial_affinity = random.randint(45, 55)
                self.set_affinity(user_id, new_waifu, existing_waifu, initial_affinity)
    
    def get_quest_modifier(self, user_id: str, participating_waifus: List[str]) -> Dict[str, Any]:
        """Get quest success modifiers based on waifu relationships"""
        if len(participating_waifus) < 2:
            return {"success_bonus": 0.0, "reward_multiplier": 1.0, "description": ""}
        
        total_affinity = 0
        relationship_count = 0
        
        # Calculate average affinity between all participating waifus
        for i, waifu_a in enumerate(participating_waifus):
            for waifu_b in participating_waifus[i+1:]:
                affinity = self.get_affinity(user_id, waifu_a, waifu_b)
                total_affinity += affinity
                relationship_count += 1
        
        if relationship_count == 0:
            return {"success_bonus": 0.0, "reward_multiplier": 1.0, "description": ""}
        
        avg_affinity = total_affinity / relationship_count
        
        modifiers: Dict[str, Any] = {"success_bonus": 0.0, "reward_multiplier": 1.0, "description": ""}
        
        affinity_effects = self.data.get("quest_mechanics", {}).get("affinity_effects", {})
        
        if avg_affinity >= 80:
            high_bonus = affinity_effects.get("high_affinity_bonus", {})
            modifiers["success_bonus"] = high_bonus.get("success_rate_bonus", 0.15)
            modifiers["reward_multiplier"] = high_bonus.get("reward_multiplier", 1.2)
            modifiers["description"] = "Great teamwork between close friends!"
        elif avg_affinity <= 20:
            low_penalty = affinity_effects.get("low_affinity_penalty", {})
            modifiers["success_bonus"] = -low_penalty.get("success_rate_penalty", 0.10)
            modifiers["reward_multiplier"] = low_penalty.get("reward_multiplier", 0.8)
            modifiers["description"] = "Poor cooperation due to rivalries."
        
        return modifiers
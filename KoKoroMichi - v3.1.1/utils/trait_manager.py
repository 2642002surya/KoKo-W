import json
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

class TraitManager:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), '../data/traits.json')
        self.user_traits_file = os.path.join(os.path.dirname(__file__), '../data/user_traits.json')
        self.trait_data = self.load_trait_data()
        self.user_traits = self.load_user_traits()
    
    def load_trait_data(self) -> Dict:
        """Load trait definitions and mood system"""
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"trait_categories": {}, "evolution_paths": {}, "mood_system": {}}
    
    def load_user_traits(self) -> Dict:
        """Load user waifu traits and moods"""
        try:
            with open(self.user_traits_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"waifu_traits": {}, "waifu_moods": {}, "evolution_progress": {}}
    
    def save_user_traits(self):
        """Save user trait data"""
        with open(self.user_traits_file, 'w') as f:
            json.dump(self.user_traits, f, indent=2)
    
    def check_trait_unlock(self, user_id: str, waifu_name: str, waifu_stats: Dict) -> List[Dict]:
        """Check if waifu has unlocked any new traits"""
        unlocked_traits = []
        waifu_key = f"{user_id}_{waifu_name}"
        
        if waifu_key not in self.user_traits["waifu_traits"]:
            self.user_traits["waifu_traits"][waifu_key] = []
        
        current_traits = self.user_traits["waifu_traits"][waifu_key]
        
        # Check each trait category
        for category, traits in self.trait_data["trait_categories"].items():
            for trait in traits:
                # Skip if already unlocked
                if trait["name"] in [t["name"] for t in current_traits]:
                    continue
                
                # Check unlock conditions
                if self.meets_trait_conditions(trait["unlock_conditions"], waifu_stats, user_id, waifu_name):
                    trait_info = {
                        "name": trait["name"],
                        "category": category,
                        "description": trait["description"],
                        "effects": trait["effects"],
                        "unlock_date": datetime.now().isoformat()
                    }
                    
                    current_traits.append(trait_info)
                    unlocked_traits.append(trait_info)
        
        if unlocked_traits:
            self.save_user_traits()
        
        return unlocked_traits
    
    def meets_trait_conditions(self, conditions: Dict, waifu_stats: Dict, user_id: str, waifu_name: str) -> bool:
        """Check if conditions are met for trait unlock"""
        for condition_type, required_value in conditions.items():
            if condition_type == "battles_won":
                if waifu_stats.get("battles_won", 0) < required_value:
                    return False
            elif condition_type == "min_level":
                if waifu_stats.get("level", 1) < required_value:
                    return False
            elif condition_type == "intimate_sessions":
                if waifu_stats.get("intimate_count", 0) < required_value:
                    return False
            elif condition_type == "min_affinity":
                if waifu_stats.get("affinity", 0) < required_value:
                    return False
            elif condition_type == "quests_completed":
                if waifu_stats.get("quests_completed", 0) < required_value:
                    return False
            elif condition_type == "days_owned":
                # Calculate days since acquisition
                if "acquired_date" in waifu_stats:
                    acquired = datetime.fromisoformat(waifu_stats["acquired_date"])
                    days_owned = (datetime.now() - acquired).days
                    if days_owned < required_value:
                        return False
            elif condition_type == "random_chance":
                if random.random() > required_value:
                    return False
        
        return True
    
    def get_waifu_traits(self, user_id: str, waifu_name: str) -> List[Dict]:
        """Get all traits for a specific waifu"""
        waifu_key = f"{user_id}_{waifu_name}"
        return self.user_traits["waifu_traits"].get(waifu_key, [])
    
    def calculate_trait_bonuses(self, user_id: str, waifu_name: str) -> Dict:
        """Calculate combined bonuses from all traits"""
        traits = self.get_waifu_traits(user_id, waifu_name)
        
        combined_bonuses = {}
        
        for trait in traits:
            effects = trait.get("effects", {})
            for effect_type, value in effects.items():
                if effect_type in combined_bonuses:
                    combined_bonuses[effect_type] += value
                else:
                    combined_bonuses[effect_type] = value
        
        return combined_bonuses
    
    def update_waifu_mood(self, user_id: str, waifu_name: str, trigger: str) -> Optional[Dict]:
        """Update waifu mood based on trigger"""
        waifu_key = f"{user_id}_{waifu_name}"
        
        # Find applicable moods
        applicable_moods = []
        for mood in self.trait_data["mood_system"]["moods"]:
            if trigger in mood["triggers"]:
                applicable_moods.append(mood)
        
        if not applicable_moods:
            return None
        
        # Select random mood from applicable ones
        selected_mood = random.choice(applicable_moods)
        
        # Set new mood
        mood_info = {
            "mood": selected_mood["name"],
            "description": selected_mood["description"],
            "effects": selected_mood["effects"],
            "start_time": datetime.now().isoformat(),
            "end_time": (datetime.now() + timedelta(hours=selected_mood["duration_hours"])).isoformat()
        }
        
        self.user_traits["waifu_moods"][waifu_key] = mood_info
        self.save_user_traits()
        
        return mood_info
    
    def get_current_mood(self, user_id: str, waifu_name: str) -> Optional[Dict]:
        """Get current mood for waifu if active"""
        waifu_key = f"{user_id}_{waifu_name}"
        
        if waifu_key not in self.user_traits["waifu_moods"]:
            return None
        
        mood_info = self.user_traits["waifu_moods"][waifu_key]
        end_time = datetime.fromisoformat(mood_info["end_time"])
        
        if datetime.now() > end_time:
            # Mood expired
            del self.user_traits["waifu_moods"][waifu_key]
            self.save_user_traits()
            return None
        
        return mood_info
    
    def check_evolution_progress(self, user_id: str, waifu_name: str, waifu_stats: Dict) -> Optional[Dict]:
        """Check if waifu can evolve to next stage"""
        waifu_key = f"{user_id}_{waifu_name}"
        
        if waifu_key not in self.user_traits["evolution_progress"]:
            self.user_traits["evolution_progress"][waifu_key] = {
                "combat_stage": 0,
                "affinity_stage": 0
            }
        
        progress = self.user_traits["evolution_progress"][waifu_key]
        evolution_available = {}
        
        # Check combat evolution
        combat_stages = self.trait_data["evolution_paths"]["combat_evolution"]["stages"]
        current_combat_stage = progress["combat_stage"]
        
        if current_combat_stage < len(combat_stages) - 1:
            next_stage = combat_stages[current_combat_stage + 1]
            if self.meets_evolution_requirements(next_stage["requirements"], waifu_stats):
                evolution_available["combat"] = {
                    "current_stage": combat_stages[current_combat_stage]["name"],
                    "next_stage": next_stage["name"],
                    "bonuses": next_stage["stat_bonuses"],
                    "abilities": next_stage.get("special_abilities", [])
                }
        
        # Check affinity evolution
        affinity_stages = self.trait_data["evolution_paths"]["affinity_evolution"]["stages"]
        current_affinity_stage = progress["affinity_stage"]
        
        if current_affinity_stage < len(affinity_stages) - 1:
            next_stage = affinity_stages[current_affinity_stage + 1]
            if self.meets_evolution_requirements(next_stage["requirements"], waifu_stats):
                evolution_available["affinity"] = {
                    "current_stage": affinity_stages[current_affinity_stage]["name"],
                    "next_stage": next_stage["name"],
                    "bonuses": next_stage["bonuses"],
                    "abilities": next_stage.get("special_abilities", [])
                }
        
        return evolution_available if evolution_available else None
    
    def meets_evolution_requirements(self, requirements: Dict, waifu_stats: Dict) -> bool:
        """Check if evolution requirements are met"""
        for req_type, req_value in requirements.items():
            if req_type == "level":
                if waifu_stats.get("level", 1) < req_value:
                    return False
            elif req_type == "battles_won":
                if waifu_stats.get("battles_won", 0) < req_value:
                    return False
            elif req_type == "affinity":
                if waifu_stats.get("affinity", 0) < req_value:
                    return False
            elif req_type == "intimate_sessions":
                if waifu_stats.get("intimate_count", 0) < req_value:
                    return False
            elif req_type == "arena_victories":
                if waifu_stats.get("arena_wins", 0) < req_value:
                    return False
            elif req_type == "days_together":
                if "acquired_date" in waifu_stats:
                    acquired = datetime.fromisoformat(waifu_stats["acquired_date"])
                    days = (datetime.now() - acquired).days
                    if days < req_value:
                        return False
        
        return True
    
    def evolve_waifu(self, user_id: str, waifu_name: str, evolution_type: str) -> Tuple[bool, str, Dict]:
        """Evolve waifu to next stage"""
        waifu_key = f"{user_id}_{waifu_name}"
        
        if waifu_key not in self.user_traits["evolution_progress"]:
            return False, "No evolution data found!", {}
        
        progress = self.user_traits["evolution_progress"][waifu_key]
        
        if evolution_type == "combat":
            stages = self.trait_data["evolution_paths"]["combat_evolution"]["stages"]
            current_stage = progress["combat_stage"]
            
            if current_stage >= len(stages) - 1:
                return False, "Already at maximum combat evolution!", {}
            
            progress["combat_stage"] += 1
            new_stage = stages[progress["combat_stage"]]
            
        elif evolution_type == "affinity":
            stages = self.trait_data["evolution_paths"]["affinity_evolution"]["stages"]
            current_stage = progress["affinity_stage"]
            
            if current_stage >= len(stages) - 1:
                return False, "Already at maximum affinity evolution!", {}
            
            progress["affinity_stage"] += 1
            new_stage = stages[progress["affinity_stage"]]
        
        else:
            return False, "Invalid evolution type!", {}
        
        self.save_user_traits()
        
        return True, f"Evolution successful! {waifu_name} is now {new_stage['name']}!", {
            "new_stage": new_stage,
            "bonuses": new_stage.get("stat_bonuses", new_stage.get("bonuses", {})),
            "abilities": new_stage.get("special_abilities", [])
        }
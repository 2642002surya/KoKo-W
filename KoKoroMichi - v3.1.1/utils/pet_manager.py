import json
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

class PetManager:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), '../data/pets_companions.json')
        self.user_pets_file = os.path.join(os.path.dirname(__file__), '../data/user_pets.json')
        
        self.pet_data = self.load_pet_data()
        self.user_pets = self.load_user_pets_data()
    
    def load_pet_data(self) -> Dict:
        """Load pet species and activity data"""
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"pet_settings": {}, "pet_species": [], "pet_activities": [], "pet_foods": []}
    
    def load_user_pets_data(self) -> Dict:
        """Load user pet collections and data"""
        try:
            with open(self.user_pets_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"user_pets": {}, "pet_stats": {}, "active_pets": {}, "feeding_cooldowns": {}}
    
    def save_user_pets_data(self):
        """Save user pet data"""
        with open(self.user_pets_file, 'w') as f:
            json.dump(self.user_pets, f, indent=2)
    
    def adopt_pet(self, user_id: str, species_name: str) -> Tuple[bool, str, Dict]:
        """Adopt a new pet companion"""
        # Find species
        species = None
        for s in self.pet_data["pet_species"]:
            if s["name"] == species_name:
                species = s
                break
        
        if not species:
            return False, "Pet species not found!", {}
        
        # Check user pet limit
        user_pets = self.user_pets.get("user_pets", {}).get(user_id, [])
        max_pets = 10  # Could be configurable
        
        if len(user_pets) >= max_pets:
            return False, f"Maximum {max_pets} pets allowed!", {}
        
        # Create pet instance
        pet_id = f"pet_{user_id}_{species_name.replace(' ', '_')}_{datetime.now().timestamp()}"
        
        pet_instance = {
            "pet_id": pet_id,
            "species": species_name,
            "name": species_name,  # Default name, can be changed
            "level": 1,
            "xp": 0,
            "stats": species["base_stats"].copy(),
            "mood": "neutral",
            "mood_expires": None,
            "adoption_date": datetime.now().isoformat(),
            "last_fed": None,
            "last_activity": None,
            "evolution_stage": "base",
            "unlocked_abilities": [species["abilities"][0]["name"]] if species["abilities"] else []
        }
        
        # Add to user's collection
        if "user_pets" not in self.user_pets:
            self.user_pets["user_pets"] = {}
        if user_id not in self.user_pets["user_pets"]:
            self.user_pets["user_pets"][user_id] = []
        
        self.user_pets["user_pets"][user_id].append(pet_id)
        
        # Store pet stats
        if "pet_stats" not in self.user_pets:
            self.user_pets["pet_stats"] = {}
        self.user_pets["pet_stats"][pet_id] = pet_instance
        
        self.save_user_pets_data()
        
        return True, f"Successfully adopted {species_name}!", pet_instance
    
    def get_user_pets(self, user_id: str) -> List[Dict]:
        """Get all pets owned by user"""
        pet_ids = self.user_pets.get("user_pets", {}).get(user_id, [])
        pets = []
        
        for pet_id in pet_ids:
            pet_data = self.user_pets.get("pet_stats", {}).get(pet_id, {})
            if pet_data:
                # Update mood status
                pet_data = self.update_pet_mood(pet_id, pet_data)
                pets.append(pet_data)
        
        return pets
    
    def get_pet(self, user_id: str, pet_id: str) -> Optional[Dict]:
        """Get specific pet data"""
        user_pets = self.user_pets.get("user_pets", {}).get(user_id, [])
        
        if pet_id not in user_pets:
            return None
        
        pet_data = self.user_pets.get("pet_stats", {}).get(pet_id, {})
        if pet_data:
            pet_data = self.update_pet_mood(pet_id, pet_data)
        
        return pet_data
    
    def feed_pet(self, user_id: str, pet_id: str, food_name: str, user_gold: int) -> Tuple[bool, str, Dict]:
        """Feed a pet to improve its stats"""
        pet = self.get_pet(user_id, pet_id)
        if not pet:
            return False, "Pet not found!", {}
        
        # Check feeding cooldown
        cooldown_key = f"{user_id}_{pet_id}"
        if cooldown_key in self.user_pets.get("feeding_cooldowns", {}):
            last_fed = datetime.fromisoformat(self.user_pets["feeding_cooldowns"][cooldown_key])
            cooldown_hours = self.pet_data["pet_settings"].get("feeding_cooldown_hours", 8)
            
            if datetime.now() - last_fed < timedelta(hours=cooldown_hours):
                time_left = cooldown_hours - (datetime.now() - last_fed).total_seconds() / 3600
                return False, f"Pet isn't hungry yet! Wait {int(time_left)} hours.", {}
        
        # Find food
        food = None
        for f in self.pet_data["pet_foods"]:
            if f["name"] == food_name:
                food = f
                break
        
        if not food:
            return False, "Food not found!", {}
        
        # Check cost
        if user_gold < food["cost"]:
            return False, f"Not enough gold! Need {food['cost']}, have {user_gold}", {}
        
        # Apply food effects
        effects = food["effects"].copy()
        
        # Species bonus
        species_name = pet["species"]
        if food.get("species_bonus") and species_name in food["species_bonus"]:
            # Double the effects for preferred food
            for effect, value in effects.items():
                effects[effect] = int(value * 1.5)
        
        # Update pet stats
        for stat, bonus in effects.items():
            if stat in pet["stats"]:
                pet["stats"][stat] = min(100, pet["stats"][stat] + bonus)
        
        # Set feeding cooldown
        if "feeding_cooldowns" not in self.user_pets:
            self.user_pets["feeding_cooldowns"] = {}
        self.user_pets["feeding_cooldowns"][cooldown_key] = datetime.now().isoformat()
        
        # Update mood
        self.trigger_pet_mood(pet_id, "feeding")
        
        # Save changes
        self.user_pets["pet_stats"][pet_id] = pet
        self.save_user_pets_data()
        
        return True, f"Fed {pet['name']} with {food_name}!", {
            "food_cost": food["cost"],
            "effects_applied": effects,
            "new_stats": pet["stats"]
        }
    
    def start_pet_activity(self, user_id: str, pet_id: str, activity_name: str) -> Tuple[bool, str, Dict]:
        """Start an activity with a pet"""
        pet = self.get_pet(user_id, pet_id)
        if not pet:
            return False, "Pet not found!", {}
        
        # Find activity
        activity = None
        for a in self.pet_data["pet_activities"]:
            if a["name"] == activity_name:
                activity = a
                break
        
        if not activity:
            return False, "Activity not found!", {}
        
        # Check requirements
        requirements = activity.get("requirements", {})
        for req_type, req_value in requirements.items():
            if req_type == "pet_energy":
                if pet["stats"].get("energy", 0) < req_value:
                    return False, f"Pet needs {req_value} energy for this activity!", {}
            elif req_type == "pet_happiness":
                if pet["stats"].get("happiness", 0) < req_value:
                    return False, f"Pet needs {req_value} happiness for this activity!", {}
            elif req_type == "pet_level":
                if pet.get("level", 1) < req_value:
                    return False, f"Pet needs to be level {req_value} for this activity!", {}
            elif req_type == "owner_level":
                # Would need to check user level from users.json
                pass
        
        # Consume energy
        if "pet_energy" in requirements:
            pet["stats"]["energy"] -= requirements["pet_energy"]
        
        # Start activity
        activity_id = f"activity_{pet_id}_{activity_name}_{datetime.now().timestamp()}"
        duration_minutes = activity.get("duration_minutes", 30)
        
        activity_instance = {
            "activity_id": activity_id,
            "pet_id": pet_id,
            "activity_name": activity_name,
            "start_time": datetime.now().isoformat(),
            "completion_time": (datetime.now() + timedelta(minutes=duration_minutes)).isoformat(),
            "rewards": activity.get("rewards", {}),
            "status": "in_progress"
        }
        
        # Store active activity
        if "active_activities" not in self.user_pets:
            self.user_pets["active_activities"] = {}
        self.user_pets["active_activities"][activity_id] = activity_instance
        
        # Update pet
        pet["last_activity"] = datetime.now().isoformat()
        self.user_pets["pet_stats"][pet_id] = pet
        self.save_user_pets_data()
        
        return True, f"Started {activity_name} with {pet['name']}!", {
            "activity_id": activity_id,
            "duration_minutes": duration_minutes,
            "completion_time": activity_instance["completion_time"]
        }
    
    def complete_pet_activity(self, user_id: str, activity_id: str) -> Tuple[bool, str, Dict]:
        """Complete a finished pet activity"""
        if activity_id not in self.user_pets.get("active_activities", {}):
            return False, "Activity not found!", {}
        
        activity = self.user_pets["active_activities"][activity_id]
        completion_time = datetime.fromisoformat(activity["completion_time"])
        
        if datetime.now() < completion_time:
            time_left = (completion_time - datetime.now()).total_seconds() / 60
            return False, f"Activity not ready! {int(time_left)} minutes remaining.", {}
        
        pet_id = activity["pet_id"]
        pet = self.user_pets["pet_stats"].get(pet_id, {})
        
        if not pet:
            return False, "Pet not found!", {}
        
        # Apply rewards
        rewards = activity["rewards"]
        result = {"rewards": {}}
        
        # Pet XP and stats
        if "pet_xp" in rewards:
            pet["xp"] = pet.get("xp", 0) + rewards["pet_xp"]
            result["rewards"]["pet_xp"] = rewards["pet_xp"]
            
            # Check for level up
            xp_needed = pet["level"] * 100  # Simple XP formula
            if pet["xp"] >= xp_needed:
                pet["level"] += 1
                pet["xp"] -= xp_needed
                result["level_up"] = True
                result["new_level"] = pet["level"]
        
        # Happiness, loyalty, etc.
        for stat in ["happiness", "loyalty", "energy"]:
            if stat in rewards:
                pet["stats"][stat] = min(100, pet["stats"].get(stat, 0) + rewards[stat])
                result["rewards"][f"pet_{stat}"] = rewards[stat]
        
        # Owner rewards
        owner_rewards = {}
        if "owner_xp" in rewards:
            owner_rewards["xp"] = rewards["owner_xp"]
        if "gold" in rewards:
            owner_rewards["gold"] = rewards["gold"]
        if "items" in rewards:
            owner_rewards["items"] = rewards["items"]
        
        result["owner_rewards"] = owner_rewards
        
        # Check for mood triggers
        activity_name = activity["activity_name"]
        if activity_name == "Training Session":
            self.trigger_pet_mood(pet_id, "training")
        elif activity_name == "Bonding Time":
            self.trigger_pet_mood(pet_id, "bonding_time")
        elif activity_name == "Exploration Adventure":
            self.trigger_pet_mood(pet_id, "exploration")
        
        # Clean up
        del self.user_pets["active_activities"][activity_id]
        self.user_pets["pet_stats"][pet_id] = pet
        self.save_user_pets_data()
        
        return True, "Activity completed!", result
    
    def trigger_pet_mood(self, pet_id: str, trigger: str):
        """Trigger a mood change for a pet"""
        applicable_moods = []
        
        for mood in self.pet_data["pet_moods"]:
            if trigger in mood["triggers"]:
                applicable_moods.append(mood)
        
        if not applicable_moods:
            return
        
        selected_mood = random.choice(applicable_moods)
        pet = self.user_pets["pet_stats"][pet_id]
        
        pet["mood"] = selected_mood["name"]
        duration = selected_mood["duration_hours"]
        pet["mood_expires"] = (datetime.now() + timedelta(hours=duration)).isoformat()
        
        self.user_pets["pet_stats"][pet_id] = pet
    
    def update_pet_mood(self, pet_id: str, pet_data: Dict) -> Dict:
        """Check and update pet mood status"""
        if pet_data.get("mood_expires"):
            expires = datetime.fromisoformat(pet_data["mood_expires"])
            
            if datetime.now() > expires:
                pet_data["mood"] = "neutral"
                pet_data["mood_expires"] = None
                self.user_pets["pet_stats"][pet_id] = pet_data
        
        return pet_data
    
    def get_pet_bonuses(self, user_id: str, context: str = "general") -> Dict:
        """Get combined bonuses from all active pets"""
        active_pets = self.user_pets.get("active_pets", {}).get(user_id, [])
        combined_bonuses = {}
        
        for pet_id in active_pets:
            pet = self.get_pet(user_id, pet_id)
            if not pet:
                continue
            
            # Get species data
            species = None
            for s in self.pet_data["pet_species"]:
                if s["name"] == pet["species"]:
                    species = s
                    break
            
            if not species:
                continue
            
            # Apply pet abilities based on level
            for ability in species["abilities"]:
                if pet["level"] >= ability["unlock_level"] and ability["name"] in pet["unlocked_abilities"]:
                    effect = ability.get("effect", {})
                    
                    # Context filtering
                    if context == "combat" and ability["type"] in ["combat", "passive"]:
                        for bonus_type, value in effect.items():
                            combined_bonuses[bonus_type] = combined_bonuses.get(bonus_type, 0) + value
                    elif context == "quest" and ability["type"] in ["passive"]:
                        for bonus_type, value in effect.items():
                            combined_bonuses[bonus_type] = combined_bonuses.get(bonus_type, 0) + value
                    elif context == "general":
                        for bonus_type, value in effect.items():
                            combined_bonuses[bonus_type] = combined_bonuses.get(bonus_type, 0) + value
            
            # Apply mood bonuses
            if pet.get("mood") != "neutral":
                mood_data = None
                for mood in self.pet_data["pet_moods"]:
                    if mood["name"] == pet["mood"]:
                        mood_data = mood
                        break
                
                if mood_data:
                    mood_effects = mood_data.get("effects", {})
                    for bonus_type, multiplier in mood_effects.items():
                        if bonus_type in combined_bonuses:
                            combined_bonuses[bonus_type] *= multiplier
        
        return combined_bonuses
    
    def set_active_pets(self, user_id: str, pet_ids: List[str]) -> Tuple[bool, str]:
        """Set which pets are actively providing bonuses"""
        max_active = self.pet_data["pet_settings"].get("max_active_pets", 3)
        
        if len(pet_ids) > max_active:
            return False, f"Maximum {max_active} active pets allowed!"
        
        # Verify user owns these pets
        user_pets = self.user_pets.get("user_pets", {}).get(user_id, [])
        for pet_id in pet_ids:
            if pet_id not in user_pets:
                return False, f"You don't own pet {pet_id}!"
        
        # Set active pets
        if "active_pets" not in self.user_pets:
            self.user_pets["active_pets"] = {}
        
        self.user_pets["active_pets"][user_id] = pet_ids
        self.save_user_pets_data()
        
        return True, f"Set {len(pet_ids)} pets as active!"
    
    def get_available_species(self) -> List[Dict]:
        """Get all available pet species for adoption"""
        species_list = []
        
        for species in self.pet_data["pet_species"]:
            species_info = {
                "name": species["name"],
                "description": species["description"],
                "rarity": species["rarity"],
                "abilities": [a["description"] for a in species["abilities"][:3]]  # Show first 3
            }
            species_list.append(species_info)
        
        return species_list
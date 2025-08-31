import json
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

class CraftingManager:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), '../data/crafting_recipes.json')
        self.user_crafting_file = os.path.join(os.path.dirname(__file__), '../data/user_crafting.json')
        
        self.crafting_data = self.load_crafting_data()
        self.user_crafting = self.load_user_crafting_data()
    
    def load_crafting_data(self) -> Dict:
        """Load crafting recipes and settings"""
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"crafting_settings": {}, "recipe_categories": {}, "crafting_stations": []}
    
    def load_user_crafting_data(self) -> Dict:
        """Load user crafting progress and active crafts"""
        try:
            with open(self.user_crafting_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"user_levels": {}, "active_crafts": {}, "owned_stations": {}, "discovered_recipes": {}}
    
    def save_user_crafting_data(self):
        """Save user crafting data"""
        with open(self.user_crafting_file, 'w') as f:
            json.dump(self.user_crafting, f, indent=2)
    
    def get_user_crafting_level(self, user_id: str) -> int:
        """Get user's crafting level"""
        return self.user_crafting.get("user_levels", {}).get(user_id, 1)
    
    def get_available_recipes(self, user_id: str, category: Optional[str] = None) -> List[Dict]:
        """Get recipes available to the user"""
        user_level = self.get_user_crafting_level(user_id)
        discovered = self.user_crafting.get("discovered_recipes", {}).get(user_id, [])
        
        available_recipes = []
        categories = [category] if category else self.crafting_data["recipe_categories"].keys()
        
        for cat_name in categories:
            if cat_name not in self.crafting_data["recipe_categories"]:
                continue
                
            category_data = self.crafting_data["recipe_categories"][cat_name]
            
            # Check if category is unlocked
            if user_level < category_data.get("unlock_level", 1):
                continue
            
            for recipe in category_data.get("recipes", []):
                # Check level requirement
                if user_level >= recipe.get("required_level", 1):
                    recipe_info = recipe.copy()
                    recipe_info["category"] = cat_name
                    recipe_info["discovered"] = recipe["name"] in discovered
                    available_recipes.append(recipe_info)
        
        return available_recipes
    
    def check_recipe_requirements(self, user_id: str, recipe: Dict, user_inventory: Dict) -> Tuple[bool, List[str]]:
        """Check if user has required materials"""
        missing_items = []
        
        for ingredient in recipe["ingredients"]:
            required_item = ingredient["item"]
            required_quantity = ingredient["quantity"]
            
            # Handle special item types
            if required_item.startswith("any_"):
                # Special handling for "any_weapon_relic", etc.
                item_type = required_item.replace("any_", "")
                found_suitable = False
                
                for inv_item, inv_quantity in user_inventory.items():
                    if item_type in inv_item.lower() and inv_quantity >= required_quantity:
                        found_suitable = True
                        break
                
                if not found_suitable:
                    missing_items.append(f"{required_quantity}x {required_item}")
            else:
                # Regular item check
                if user_inventory.get(required_item, 0) < required_quantity:
                    have = user_inventory.get(required_item, 0)
                    missing_items.append(f"{required_item} (have {have}, need {required_quantity})")
        
        return len(missing_items) == 0, missing_items
    
    def start_crafting(self, user_id: str, recipe_name: str, user_inventory: Dict) -> Tuple[bool, str, Dict]:
        """Start a crafting process"""
        # Find the recipe
        recipe = None
        for category in self.crafting_data["recipe_categories"].values():
            for r in category.get("recipes", []):
                if r["name"] == recipe_name:
                    recipe = r
                    break
            if recipe:
                break
        
        if not recipe:
            return False, "Recipe not found!", {}
        
        # Check user level
        user_level = self.get_user_crafting_level(user_id)
        if user_level < recipe.get("required_level", 1):
            return False, f"Crafting level too low! Need level {recipe['required_level']}", {}
        
        # Check materials
        can_craft, missing = self.check_recipe_requirements(user_id, recipe, user_inventory)
        if not can_craft:
            return False, f"Missing materials: {', '.join(missing)}", {}
        
        # Check active craft limit
        active_crafts = self.user_crafting.get("active_crafts", {}).get(user_id, {})
        max_crafts = self.crafting_data["crafting_settings"].get("max_concurrent_crafts", 5)
        
        if len(active_crafts) >= max_crafts:
            return False, f"Maximum {max_crafts} concurrent crafts allowed!", {}
        
        # Calculate success rate with bonuses
        base_success = recipe.get("success_rate", self.crafting_data["crafting_settings"].get("base_success_rate", 0.75))
        station_bonus = self.get_station_bonus(user_id, recipe)
        final_success_rate = min(0.95, base_success + station_bonus)
        
        # Create craft instance
        craft_id = f"craft_{user_id}_{recipe_name}_{datetime.now().timestamp()}"
        craft_time = recipe.get("crafting_time_minutes", 30)
        
        craft_instance = {
            "craft_id": craft_id,
            "recipe_name": recipe_name,
            "recipe": recipe,
            "start_time": datetime.now().isoformat(),
            "completion_time": (datetime.now() + timedelta(minutes=craft_time)).isoformat(),
            "success_rate": final_success_rate,
            "status": "in_progress"
        }
        
        # Initialize user's active crafts if needed
        if user_id not in self.user_crafting.get("active_crafts", {}):
            if "active_crafts" not in self.user_crafting:
                self.user_crafting["active_crafts"] = {}
            self.user_crafting["active_crafts"][user_id] = {}
        
        self.user_crafting["active_crafts"][user_id][craft_id] = craft_instance
        self.save_user_crafting_data()
        
        return True, f"Started crafting {recipe_name}! Complete in {craft_time} minutes.", {
            "craft_id": craft_id,
            "completion_time": craft_instance["completion_time"],
            "success_rate": int(final_success_rate * 100)
        }
    
    def complete_crafting(self, user_id: str, craft_id: str) -> Tuple[bool, str, Dict]:
        """Complete a finished craft"""
        active_crafts = self.user_crafting.get("active_crafts", {}).get(user_id, {})
        
        if craft_id not in active_crafts:
            return False, "Craft not found!", {}
        
        craft = active_crafts[craft_id]
        completion_time = datetime.fromisoformat(craft["completion_time"])
        
        if datetime.now() < completion_time:
            time_left = (completion_time - datetime.now()).total_seconds() / 60
            return False, f"Craft not ready! {int(time_left)} minutes remaining.", {}
        
        # Determine success
        success_roll = random.random()
        critical_roll = random.random()
        
        success_rate = craft["success_rate"]
        critical_chance = self.crafting_data["crafting_settings"].get("critical_craft_chance", 0.15)
        
        result = {
            "recipe_name": craft["recipe_name"],
            "success": success_roll < success_rate,
            "critical": critical_roll < critical_chance,
            "xp_gained": craft["recipe"].get("xp_reward", 10)
        }
        
        if result["success"]:
            # Successful craft
            recipe_result = craft["recipe"]["result"]
            result["item_created"] = recipe_result["item"]
            result["quantity"] = recipe_result["quantity"]
            
            if result["critical"]:
                # Critical success - double output or bonus stats
                result["quantity"] *= 2
                result["xp_gained"] = int(result["xp_gained"] * 1.5)
                result["bonus"] = "Critical success! Double output!"
        else:
            # Failed craft
            failure_destroy = random.random() < self.crafting_data["crafting_settings"].get("failure_destroy_chance", 0.1)
            result["materials_lost"] = failure_destroy
            result["xp_gained"] = int(result["xp_gained"] * 0.3)  # Reduced XP on failure
        
        # Award XP
        self.award_crafting_xp(user_id, result["xp_gained"])
        
        # Remove completed craft
        del active_crafts[craft_id]
        self.save_user_crafting_data()
        
        return True, "Craft completed!", result
    
    def get_station_bonus(self, user_id: str, recipe: Dict) -> float:
        """Get crafting station bonuses"""
        owned_stations = self.user_crafting.get("owned_stations", {}).get(user_id, [])
        total_bonus = 0.0
        
        for station_name in owned_stations:
            for station in self.crafting_data["crafting_stations"]:
                if station["name"] == station_name:
                    bonuses = station.get("bonuses", {})
                    
                    # Apply category-specific bonuses
                    if "consumables_success_bonus" in bonuses and "consumables" in recipe.get("category", ""):
                        total_bonus += bonuses["consumables_success_bonus"]
                    elif "equipment_success_bonus" in bonuses and "equipment" in recipe.get("category", ""):
                        total_bonus += bonuses["equipment_success_bonus"]
                    elif "special_success_bonus" in bonuses and "special" in recipe.get("category", ""):
                        total_bonus += bonuses["special_success_bonus"]
                    
                    break
        
        return total_bonus
    
    def award_crafting_xp(self, user_id: str, xp_amount: int):
        """Award crafting XP and check for level ups"""
        if "user_levels" not in self.user_crafting:
            self.user_crafting["user_levels"] = {}
        
        current_level = self.get_user_crafting_level(user_id)
        current_xp = self.user_crafting.get("user_xp", {}).get(user_id, 0)
        
        new_xp = current_xp + xp_amount
        xp_per_level = self.crafting_data["crafting_settings"].get("crafting_xp_per_level", 100)
        new_level = max(1, new_xp // xp_per_level)
        
        if "user_xp" not in self.user_crafting:
            self.user_crafting["user_xp"] = {}
        
        self.user_crafting["user_xp"][user_id] = new_xp
        self.user_crafting["user_levels"][user_id] = new_level
        
        return new_level > current_level, new_level
    
    def purchase_crafting_station(self, user_id: str, station_name: str, user_gold: int) -> Tuple[bool, str, int]:
        """Purchase a crafting station"""
        station = None
        for s in self.crafting_data["crafting_stations"]:
            if s["name"] == station_name:
                station = s
                break
        
        if not station:
            return False, "Crafting station not found!", 0
        
        user_level = self.get_user_crafting_level(user_id)
        if user_level < station.get("level_requirement", 1):
            return False, f"Crafting level too low! Need level {station['level_requirement']}", 0
        
        cost = station["cost"]
        if user_gold < cost:
            return False, f"Not enough gold! Need {cost}, have {user_gold}", 0
        
        # Check if already owned
        owned = self.user_crafting.get("owned_stations", {}).get(user_id, [])
        if station_name in owned:
            return False, "You already own this crafting station!", 0
        
        # Purchase station
        if "owned_stations" not in self.user_crafting:
            self.user_crafting["owned_stations"] = {}
        if user_id not in self.user_crafting["owned_stations"]:
            self.user_crafting["owned_stations"][user_id] = []
        
        self.user_crafting["owned_stations"][user_id].append(station_name)
        self.save_user_crafting_data()
        
        return True, f"Successfully purchased {station_name}!", cost
    
    def get_active_crafts(self, user_id: str) -> List[Dict]:
        """Get user's active crafting processes"""
        active_crafts = self.user_crafting.get("active_crafts", {}).get(user_id, {})
        
        crafts_info = []
        current_time = datetime.now()
        
        for craft_id, craft in active_crafts.items():
            completion_time = datetime.fromisoformat(craft["completion_time"])
            time_remaining = completion_time - current_time
            
            craft_info = {
                "craft_id": craft_id,
                "recipe_name": craft["recipe_name"],
                "completion_time": craft["completion_time"],
                "time_remaining_minutes": max(0, int(time_remaining.total_seconds() / 60)),
                "success_rate": int(craft["success_rate"] * 100),
                "status": "ready" if time_remaining.total_seconds() <= 0 else "in_progress"
            }
            
            crafts_info.append(craft_info)
        
        return crafts_info
    
    def discover_recipe(self, user_id: str, recipe_name: str):
        """Mark a recipe as discovered by the user"""
        if "discovered_recipes" not in self.user_crafting:
            self.user_crafting["discovered_recipes"] = {}
        
        if user_id not in self.user_crafting["discovered_recipes"]:
            self.user_crafting["discovered_recipes"][user_id] = []
        
        if recipe_name not in self.user_crafting["discovered_recipes"][user_id]:
            self.user_crafting["discovered_recipes"][user_id].append(recipe_name)
            self.save_user_crafting_data()
            return True
        
        return False
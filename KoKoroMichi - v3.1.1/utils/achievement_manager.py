import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Tuple

class AchievementManager:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), '../data/lore_achievements.json')
        self.user_data_file = os.path.join(os.path.dirname(__file__), '../data/user_achievements.json')
        
        self.achievement_data = self.load_achievement_data()
        self.user_achievements = self.load_user_data()
    
    def load_achievement_data(self) -> Dict:
        """Load lore and achievement definitions"""
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"lore_settings": {}, "lore_books": [], "achievements": []}
    
    def load_user_data(self) -> Dict:
        """Load user achievement data"""
        try:
            with open(self.user_data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"unlocked_achievements": {}, "progress_tracking": {}, "unlocked_lore": {}, "user_titles": {}}
    
    def save_user_data(self):
        """Save user achievement data"""
        with open(self.user_data_file, 'w') as f:
            json.dump(self.user_achievements, f, indent=2)
    
    def check_achievement_progress(self, user_id: str, user_stats: Dict) -> List[Dict]:
        """Check and update achievement progress, return newly unlocked achievements"""
        newly_unlocked = []
        
        # Initialize user tracking if needed
        if "progress_tracking" not in self.user_achievements:
            self.user_achievements["progress_tracking"] = {}
        if user_id not in self.user_achievements["progress_tracking"]:
            self.user_achievements["progress_tracking"][user_id] = {}
        
        if "unlocked_achievements" not in self.user_achievements:
            self.user_achievements["unlocked_achievements"] = {}
        if user_id not in self.user_achievements["unlocked_achievements"]:
            self.user_achievements["unlocked_achievements"][user_id] = []
        
        user_progress = self.user_achievements["progress_tracking"][user_id]
        unlocked_achievements = self.user_achievements["unlocked_achievements"][user_id]
        
        # Check each achievement
        for achievement in self.achievement_data["achievements"]:
            achievement_id = achievement["id"]
            
            # Skip if already unlocked
            if achievement_id in unlocked_achievements:
                continue
            
            # Check requirements
            requirements = achievement["requirement"]
            progress_met = True
            
            for req_type, req_value in requirements.items():
                current_value = user_stats.get(req_type, 0)
                
                # Handle special requirement types
                if req_type == "unique_waifus":
                    current_value = len(set(user_stats.get("claimed_waifus", [])))
                elif req_type == "waifus_summoned":
                    current_value = len(user_stats.get("claimed_waifus", []))
                elif req_type == "max_affinity_waifus":
                    # Would need to check affinity data - placeholder for now
                    current_value = user_stats.get(req_type, 0)
                elif req_type == "lore_books_completed":
                    current_value = len(self.user_achievements.get("unlocked_lore", {}).get(user_id, []))
                elif req_type == "legendary_waifus":
                    # Count legendary rarity waifus - would need character data integration
                    current_value = user_stats.get(req_type, 0)
                
                # Update progress tracking
                user_progress[f"{achievement_id}_{req_type}"] = current_value
                
                if current_value < req_value:
                    progress_met = False
                    break
            
            # Unlock achievement if requirements met
            if progress_met:
                unlocked_achievements.append(achievement_id)
                
                unlock_data = {
                    "achievement_id": achievement_id,
                    "name": achievement["name"],
                    "description": achievement["description"],
                    "rarity": achievement["rarity"],
                    "rewards": achievement["rewards"],
                    "unlocked_time": datetime.now().isoformat()
                }
                newly_unlocked.append(unlock_data)
                
                # Apply rewards
                self.apply_achievement_rewards(user_id, achievement["rewards"])
        
        if newly_unlocked:
            self.save_user_data()
        
        return newly_unlocked
    
    def apply_achievement_rewards(self, user_id: str, rewards: Dict):
        """Apply achievement rewards to user"""
        from .fileManager import load_users, save_users
        users = load_users()
        
        if user_id not in users:
            return
        
        user_data = users[user_id]
        
        # Apply gold rewards
        if "gold" in rewards:
            user_data["gold"] = user_data.get("gold", 0) + rewards["gold"]
        
        # Apply inventory slots
        if "inventory_slot" in rewards:
            user_data["inventory_slots"] = user_data.get("inventory_slots", 20) + rewards["inventory_slot"]
        
        # Apply permanent bonuses
        if "permanent_attack_boost" in rewards:
            if "permanent_bonuses" not in user_data:
                user_data["permanent_bonuses"] = {}
            current_bonus = user_data["permanent_bonuses"].get("attack_boost", 0)
            user_data["permanent_bonuses"]["attack_boost"] = current_bonus + rewards["permanent_attack_boost"]
        
        if "permanent_battle_bonus" in rewards:
            if "permanent_bonuses" not in user_data:
                user_data["permanent_bonuses"] = {}
            current_bonus = user_data["permanent_bonuses"].get("battle_bonus", 0)
            user_data["permanent_bonuses"]["battle_bonus"] = current_bonus + rewards["permanent_battle_bonus"]
        
        # Apply titles
        if "title" in rewards:
            if "user_titles" not in self.user_achievements:
                self.user_achievements["user_titles"] = {}
            if user_id not in self.user_achievements["user_titles"]:
                self.user_achievements["user_titles"][user_id] = []
            
            if rewards["title"] not in self.user_achievements["user_titles"][user_id]:
                self.user_achievements["user_titles"][user_id].append(rewards["title"])
        
        save_users(users)
    
    def get_user_achievements(self, user_id: str) -> Dict:
        """Get user's achievement summary"""
        unlocked = self.user_achievements.get("unlocked_achievements", {}).get(user_id, [])
        progress = self.user_achievements.get("progress_tracking", {}).get(user_id, {})
        titles = self.user_achievements.get("user_titles", {}).get(user_id, [])
        
        # Calculate achievement stats by rarity
        rarity_counts = {"common": 0, "uncommon": 0, "rare": 0, "epic": 0, "legendary": 0}
        
        for achievement in self.achievement_data["achievements"]:
            if achievement["id"] in unlocked:
                rarity = achievement.get("rarity", "common")
                rarity_counts[rarity] += 1
        
        return {
            "total_unlocked": len(unlocked),
            "total_available": len(self.achievement_data["achievements"]),
            "completion_percentage": (len(unlocked) / len(self.achievement_data["achievements"])) * 100 if self.achievement_data["achievements"] else 0,
            "rarity_breakdown": rarity_counts,
            "unlocked_titles": titles,
            "recent_achievements": unlocked[-5:] if unlocked else []
        }
    
    def get_available_achievements(self, user_id: str) -> List[Dict]:
        """Get achievements with progress information"""
        unlocked = self.user_achievements.get("unlocked_achievements", {}).get(user_id, [])
        progress = self.user_achievements.get("progress_tracking", {}).get(user_id, {})
        
        achievement_list = []
        
        for achievement in self.achievement_data["achievements"]:
            achievement_info = {
                "id": achievement["id"],
                "name": achievement["name"],
                "description": achievement["description"],
                "rarity": achievement["rarity"],
                "rewards": achievement["rewards"],
                "unlocked": achievement["id"] in unlocked,
                "requirements": achievement["requirement"],
                "progress": {}
            }
            
            # Add progress information
            for req_type, req_value in achievement["requirement"].items():
                progress_key = f"{achievement['id']}_{req_type}"
                current_progress = progress.get(progress_key, 0)
                achievement_info["progress"][req_type] = {
                    "current": current_progress,
                    "required": req_value,
                    "percentage": (current_progress / req_value) * 100 if req_value > 0 else 100
                }
            
            achievement_list.append(achievement_info)
        
        return achievement_list
    
    def unlock_lore_book(self, user_id: str, book_id: str, user_stats: Dict) -> Tuple[bool, str, Dict]:
        """Attempt to unlock a lore book"""
        # Find the book
        book = None
        for lore_book in self.achievement_data["lore_books"]:
            if lore_book["id"] == book_id:
                book = lore_book
                break
        
        if not book:
            return False, "Lore book not found!", {}
        
        # Check if already unlocked
        unlocked_lore = self.user_achievements.get("unlocked_lore", {}).get(user_id, [])
        if book_id in unlocked_lore:
            return False, "This lore book is already unlocked!", {}
        
        # Check requirements
        unlock_req = book["unlock_requirement"]
        requirements = self.achievement_data["lore_settings"]["unlock_requirements"].get(unlock_req, {})
        
        for req_type, req_value in requirements.items():
            current_value = user_stats.get(req_type, 0)
            
            # Handle special requirement types
            if req_type == "affinity":
                # Check if user has any waifu with required affinity
                max_affinity = max(user_stats.get("waifu_affinities", {}).values()) if user_stats.get("waifu_affinities") else 0
                current_value = max_affinity
            elif req_type == "rare_waifus_owned":
                # Count rare waifus - would need character data integration
                current_value = user_stats.get(req_type, 0)
            
            if current_value < req_value:
                return False, f"Requirements not met! Need {req_type}: {req_value} (you have {current_value})", {}
        
        # Unlock the book
        if "unlocked_lore" not in self.user_achievements:
            self.user_achievements["unlocked_lore"] = {}
        if user_id not in self.user_achievements["unlocked_lore"]:
            self.user_achievements["unlocked_lore"][user_id] = []
        
        self.user_achievements["unlocked_lore"][user_id].append(book_id)
        
        # Apply rewards
        self.apply_achievement_rewards(user_id, book["rewards"])
        
        self.save_user_data()
        
        return True, f"Lore book '{book['title']}' unlocked!", {
            "book_title": book["title"],
            "description": book["description"],
            "chapters": book["chapters"],
            "rewards": book["rewards"],
            "unlock_time": datetime.now().isoformat()
        }
    
    def get_available_lore_books(self, user_id: str, user_stats: Dict) -> List[Dict]:
        """Get lore books with availability status"""
        unlocked_lore = self.user_achievements.get("unlocked_lore", {}).get(user_id, [])
        
        lore_list = []
        
        for book in self.achievement_data["lore_books"]:
            book_info = {
                "id": book["id"],
                "title": book["title"],
                "description": book["description"],
                "chapters": book["chapters"],
                "rewards": book["rewards"],
                "unlocked": book["id"] in unlocked_lore,
                "can_unlock": False,
                "requirements": {}
            }
            
            # Check if can be unlocked
            unlock_req = book["unlock_requirement"]
            requirements = self.achievement_data["lore_settings"]["unlock_requirements"].get(unlock_req, {})
            
            can_unlock = True
            for req_type, req_value in requirements.items():
                current_value = user_stats.get(req_type, 0)
                
                # Handle special requirement types  
                if req_type == "affinity":
                    max_affinity = max(user_stats.get("waifu_affinities", {}).values()) if user_stats.get("waifu_affinities") else 0
                    current_value = max_affinity
                elif req_type == "rare_waifus_owned":
                    current_value = user_stats.get(req_type, 0)
                
                book_info["requirements"][req_type] = {
                    "current": current_value,
                    "required": req_value,
                    "met": current_value >= req_value
                }
                
                if current_value < req_value:
                    can_unlock = False
            
            book_info["can_unlock"] = can_unlock and book["id"] not in unlocked_lore
            lore_list.append(book_info)
        
        return lore_list
    
    def get_user_titles(self, user_id: str) -> List[str]:
        """Get user's unlocked titles"""
        return self.user_achievements.get("user_titles", {}).get(user_id, [])
    
    def set_active_title(self, user_id: str, title: str) -> Tuple[bool, str]:
        """Set user's active display title"""
        user_titles = self.get_user_titles(user_id)
        
        if title not in user_titles:
            return False, "You haven't unlocked this title!"
        
        from .fileManager import load_users, save_users
        users = load_users()
        
        if user_id not in users:
            return False, "User not found!"
        
        users[user_id]["active_title"] = title
        save_users(users)
        
        return True, f"Active title set to: {title}"
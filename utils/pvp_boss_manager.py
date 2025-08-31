import json
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

class PvPBossManager:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), '../data/pvp_bosses.json')
        self.user_pvp_file = os.path.join(os.path.dirname(__file__), '../data/user_pvp_data.json')
        self.active_bosses_file = os.path.join(os.path.dirname(__file__), '../data/active_bosses.json')
        
        self.pvp_data = self.load_pvp_data()
        self.user_pvp = self.load_user_pvp_data()
        self.active_bosses = self.load_active_bosses()
    
    def load_pvp_data(self) -> Dict:
        """Load PvP and boss configuration"""
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"duel_settings": {}, "rare_bosses": {}, "duel_arenas": [], "pvp_ranks": []}
    
    def load_user_pvp_data(self) -> Dict:
        """Load user PvP ratings and statistics"""
        try:
            with open(self.user_pvp_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"user_ratings": {}, "duel_history": {}, "boss_defeats": {}}
    
    def load_active_bosses(self) -> Dict:
        """Load currently spawned bosses"""
        try:
            with open(self.active_bosses_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"spawned_bosses": {}, "last_spawn_check": datetime.now().isoformat()}
    
    def save_user_pvp_data(self):
        """Save user PvP data"""
        with open(self.user_pvp_file, 'w') as f:
            json.dump(self.user_pvp, f, indent=2)
    
    def save_active_bosses(self):
        """Save active boss data"""
        with open(self.active_bosses_file, 'w') as f:
            json.dump(self.active_bosses, f, indent=2)
    
    def initiate_duel(self, challenger_id: str, opponent_id: str, stakes: int) -> Tuple[bool, str, Dict]:
        """Initiate a PvP duel between two players"""
        settings = self.pvp_data["duel_settings"]
        
        # Check cooldowns
        if challenger_id in self.user_pvp.get("duel_cooldowns", {}):
            cooldown_end = datetime.fromisoformat(self.user_pvp["duel_cooldowns"][challenger_id])
            if datetime.now() < cooldown_end:
                time_left = (cooldown_end - datetime.now()).total_seconds() / 60
                return False, f"You're on cooldown! Wait {int(time_left)} minutes.", {}
        
        # Validate stakes
        if stakes > settings.get("max_stakes", 10000):
            return False, f"Maximum stakes: {settings['max_stakes']} gold!", {}
        
        stake_amount = int(stakes * settings.get("stake_percentage", 0.1))
        
        # Check ratings for fair matchmaking
        challenger_rating = self.get_user_rating(challenger_id)
        opponent_rating = self.get_user_rating(opponent_id)
        
        rating_diff = abs(challenger_rating - opponent_rating)
        max_diff = settings.get("min_level_difference", 5) * 50  # 50 rating per level
        
        if rating_diff > max_diff:
            return False, f"Rating difference too large! Find someone closer to your skill level.", {}
        
        # Create duel
        duel_id = f"duel_{challenger_id}_{opponent_id}_{datetime.now().timestamp()}"
        
        duel_data = {
            "duel_id": duel_id,
            "challenger": challenger_id,
            "opponent": opponent_id,
            "stakes": stakes,
            "stake_amount": stake_amount,
            "status": "pending",
            "created_time": datetime.now().isoformat(),
            "arena": random.choice(self.pvp_data["duel_arenas"])
        }
        
        return True, "Duel initiated! Waiting for opponent to accept.", duel_data
    
    def accept_duel(self, duel_id: str, opponent_id: str) -> Tuple[bool, str, Dict]:
        """Accept a pending duel"""
        # Implementation for accepting duels
        return True, "Duel accepted! Battle begins now!", {}
    
    def check_boss_spawns(self) -> List[Dict]:
        """Check if new rare bosses should spawn"""
        spawn_settings = self.pvp_data["rare_bosses"]["spawn_settings"]
        current_time = datetime.now()
        
        # Check time since last spawn
        last_check = datetime.fromisoformat(self.active_bosses.get("last_spawn_check", current_time.isoformat()))
        hours_passed = (current_time - last_check).total_seconds() / 3600
        
        if hours_passed < spawn_settings.get("spawn_interval_hours", 2):
            return []
        
        # Check current active boss count
        active_count = len([b for b in self.active_bosses.get("spawned_bosses", {}).values() 
                           if b.get("status") == "active"])
        
        if active_count >= spawn_settings.get("max_active_bosses", 3):
            return []
        
        # Try to spawn bosses
        spawned_bosses = []
        base_chance = spawn_settings.get("base_spawn_chance", 0.08)
        
        for boss_template in self.pvp_data["rare_bosses"]["boss_types"]:
            if random.random() < boss_template["spawn_chance"] * base_chance:
                boss = self.spawn_boss(boss_template)
                if boss:
                    spawned_bosses.append(boss)
        
        self.active_bosses["last_spawn_check"] = current_time.isoformat()
        self.save_active_bosses()
        
        return spawned_bosses
    
    def spawn_boss(self, boss_template: Dict) -> Optional[Dict]:
        """Spawn a specific boss from template"""
        boss_id = f"boss_{boss_template['name'].replace(' ', '_')}_{datetime.now().timestamp()}"
        
        # Calculate boss stats
        level = random.randint(boss_template["level_range"][0], boss_template["level_range"][1])
        base_hp = level * 100
        base_damage = level * 10
        
        boss_instance = {
            "boss_id": boss_id,
            "name": boss_template["name"],
            "description": boss_template["description"],
            "rarity": boss_template["rarity"],
            "level": level,
            "current_hp": int(base_hp * boss_template["hp_multiplier"]),
            "max_hp": int(base_hp * boss_template["hp_multiplier"]),
            "damage": int(base_damage * boss_template["damage_multiplier"]),
            "special_abilities": boss_template["special_abilities"],
            "rewards": boss_template["rewards"],
            "weaknesses": boss_template.get("weaknesses", []),
            "resistances": boss_template.get("resistances", []),
            "spawn_time": datetime.now().isoformat(),
            "despawn_time": (datetime.now() + timedelta(minutes=45)).isoformat(),
            "status": "active",
            "participants": [],
            "damage_dealt": {}
        }
        
        self.active_bosses["spawned_bosses"][boss_id] = boss_instance
        return boss_instance
    
    def get_active_bosses(self) -> List[Dict]:
        """Get all currently active bosses"""
        current_time = datetime.now()
        active = []
        
        for boss_id, boss in self.active_bosses.get("spawned_bosses", {}).items():
            despawn_time = datetime.fromisoformat(boss["despawn_time"])
            
            if current_time < despawn_time and boss["status"] == "active":
                active.append(boss)
            elif current_time >= despawn_time:
                # Boss expired
                boss["status"] = "expired"
        
        self.save_active_bosses()
        return active
    
    def attack_boss(self, user_id: str, boss_id: str, damage_dealt: int) -> Tuple[bool, str, Dict]:
        """Player attacks a boss"""
        if boss_id not in self.active_bosses.get("spawned_bosses", {}):
            return False, "Boss not found!", {}
        
        boss = self.active_bosses["spawned_bosses"][boss_id]
        
        if boss["status"] != "active":
            return False, "Boss is no longer active!", {}
        
        # Add participant
        if user_id not in boss["participants"]:
            boss["participants"].append(user_id)
        
        # Track damage dealt
        if user_id not in boss["damage_dealt"]:
            boss["damage_dealt"][user_id] = 0
        
        boss["damage_dealt"][user_id] += damage_dealt
        boss["current_hp"] -= damage_dealt
        
        result = {
            "damage_dealt": damage_dealt,
            "boss_hp_remaining": boss["current_hp"],
            "boss_max_hp": boss["max_hp"]
        }
        
        # Check if boss is defeated
        if boss["current_hp"] <= 0:
            boss["status"] = "defeated"
            boss["defeat_time"] = datetime.now().isoformat()
            
            # Distribute rewards
            rewards = self.distribute_boss_rewards(boss_id)
            result["boss_defeated"] = True
            result["rewards"] = rewards
        else:
            result["boss_defeated"] = False
        
        self.save_active_bosses()
        return True, "Attack successful!", result
    
    def distribute_boss_rewards(self, boss_id: str) -> Dict:
        """Distribute rewards to all participants"""
        boss = self.active_bosses["spawned_bosses"][boss_id]
        rewards_template = boss["rewards"]
        total_damage = sum(boss["damage_dealt"].values())
        
        participant_rewards = {}
        
        for user_id, damage in boss["damage_dealt"].items():
            contribution = damage / total_damage if total_damage > 0 else 1.0 / len(boss["participants"])
            
            user_rewards = {
                "xp": int(rewards_template["base_xp"] * contribution),
                "gold": int(rewards_template["base_gold"] * contribution),
                "guaranteed_items": [],
                "rare_drops": []
            }
            
            # Guaranteed items based on contribution
            if contribution >= 0.1:  # 10% contribution minimum
                user_rewards["guaranteed_items"] = rewards_template.get("guaranteed_items", [])
            
            # Rare drops with scaled chances
            for rare_drop in rewards_template.get("rare_drops", []):
                roll = random.random()
                scaled_chance = rare_drop["chance"] * (0.5 + contribution)  # Bonus for high contributors
                
                if roll < scaled_chance:
                    user_rewards["rare_drops"].append(rare_drop["item"])
            
            participant_rewards[user_id] = user_rewards
        
        return participant_rewards
    
    def get_user_rating(self, user_id: str) -> int:
        """Get user's PvP rating"""
        return self.user_pvp.get("user_ratings", {}).get(user_id, 1000)
    
    def update_rating(self, winner_id: str, loser_id: str, stakes: int):
        """Update PvP ratings after a duel"""
        winner_rating = self.get_user_rating(winner_id)
        loser_rating = self.get_user_rating(loser_id)
        
        # Calculate rating changes (simplified ELO)
        expected_winner = 1 / (1 + 10**((loser_rating - winner_rating) / 400))
        expected_loser = 1 - expected_winner
        
        k_factor = 32 + (stakes // 1000)  # Higher stakes = more rating change
        
        winner_change = int(k_factor * (1 - expected_winner))
        loser_change = int(k_factor * (0 - expected_loser))
        
        # Update ratings
        if "user_ratings" not in self.user_pvp:
            self.user_pvp["user_ratings"] = {}
        
        self.user_pvp["user_ratings"][winner_id] = max(0, winner_rating + winner_change)
        self.user_pvp["user_ratings"][loser_id] = max(0, loser_rating + loser_change)
        
        self.save_user_pvp_data()
        
        return winner_change, abs(loser_change)
    
    def get_user_rank(self, user_id: str) -> Dict:
        """Get user's current PvP rank and rewards"""
        rating = self.get_user_rating(user_id)
        
        for rank_info in self.pvp_data["pvp_ranks"]:
            if rank_info["min_rating"] <= rating <= rank_info["max_rating"]:
                return rank_info
        
        # Default to lowest rank
        return self.pvp_data["pvp_ranks"][0] if self.pvp_data["pvp_ranks"] else {}
    
    def cleanup_expired_bosses(self):
        """Remove expired bosses from active list"""
        current_time = datetime.now()
        
        for boss_id, boss in list(self.active_bosses.get("spawned_bosses", {}).items()):
            despawn_time = datetime.fromisoformat(boss["despawn_time"])
            
            if current_time >= despawn_time and boss["status"] != "defeated":
                del self.active_bosses["spawned_bosses"][boss_id]
        
        self.save_active_bosses()
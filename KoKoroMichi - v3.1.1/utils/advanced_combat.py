# Advanced Combat System for KoKoroMichi Bot
import random
import math
from typing import Dict, List, Tuple, Optional, Any
from datetime import datetime
import logging

from core.data_manager import data_manager
from core.config import (
    BATTLE_ROUNDS_MAX, CRIT_BASE_MULTIPLIER, LEVEL_STAT_GROWTH, 
    RARITY_WEIGHTS
)

logger = logging.getLogger(__name__)

class BattleEngine:
    """Advanced battle system with comprehensive mechanics"""
    
    def __init__(self):
        self.element_chart = {
            "Fire": {"strong": ["Earth", "Ice"], "weak": ["Water", "Lightning"]},
            "Water": {"strong": ["Fire", "Earth"], "weak": ["Lightning", "Ice"]},
            "Earth": {"strong": ["Lightning", "Fire"], "weak": ["Ice", "Water"]},
            "Lightning": {"strong": ["Water", "Ice"], "weak": ["Earth", "Fire"]},
            "Ice": {"strong": ["Earth", "Lightning"], "weak": ["Fire", "Water"]},
            "Light": {"strong": ["Dark"], "weak": ["Dark"]},
            "Dark": {"strong": ["Light"], "weak": ["Light"]},
            "Neutral": {"strong": [], "weak": []}
        }
        
    def calculate_battle_stats(self, waifu: Dict[str, Any]) -> Dict[str, float]:
        """Calculate comprehensive battle stats for a waifu"""
        base_stats = {
            "hp": waifu.get("hp", 500),
            "atk": waifu.get("atk", 50),
            "def": waifu.get("def", 25),
            "crit": waifu.get("crit", 5),
            "speed": waifu.get("speed", 50),
            "magic": waifu.get("magic", 30),
            "resistance": waifu.get("resistance", 20)
        }
        
        # Apply level scaling
        level = waifu.get("level", 1)
        if level > 1:
            base_stats["hp"] += (level - 1) * LEVEL_STAT_GROWTH["hp"]
            base_stats["atk"] += (level - 1) * LEVEL_STAT_GROWTH["atk"]
            base_stats["def"] += (level - 1) * LEVEL_STAT_GROWTH["def"]
            base_stats["crit"] += (level - 1) * LEVEL_STAT_GROWTH["crit"]
            
        # Apply relic bonuses
        battle_stats = self._apply_relic_bonuses(waifu, base_stats)
        
        # Apply trait bonuses
        battle_stats = self._apply_trait_bonuses(waifu, battle_stats)
        
        # Apply temporary buffs
        battle_stats = self._apply_temporary_buffs(waifu, battle_stats)
        
        # Convert crit to percentage (0-1 range)
        battle_stats["crit"] = min(battle_stats["crit"] / 100.0, 0.95)  # Cap at 95%
        
        return battle_stats
        
    def _apply_relic_bonuses(self, waifu: Dict[str, Any], stats: Dict[str, float]) -> Dict[str, float]:
        """Apply relic bonuses to stats"""
        equipped_relic = waifu.get("relic") or waifu.get("equipped_relic")
        exclusive_relic = waifu.get("exclusive_relic")
        
        if not equipped_relic or not exclusive_relic:
            return stats
            
        # Check if equipped relic matches exclusive relic
        if equipped_relic.get("name") != exclusive_relic:
            return stats
            
        # Calculate relic multiplier based on potential
        potential = equipped_relic.get("potential", 0)
        multiplier = self._get_relic_multiplier(potential)
        
        # Apply multiplier to relevant stats
        boosted_stats = stats.copy()
        boosted_stats["atk"] = int(stats["atk"] * multiplier)
        boosted_stats["hp"] = int(stats["hp"] * multiplier)
        boosted_stats["def"] = int(stats["def"] * multiplier)
        boosted_stats["magic"] = int(stats["magic"] * multiplier)
        
        return boosted_stats
        
    def _get_relic_multiplier(self, potential: int) -> float:
        """Get relic multiplier based on potential"""
        rarity_tiers = [
            {"min_potential": 7000, "multiplier": 3.0},  # Mythic
            {"min_potential": 6000, "multiplier": 2.8},  # LR
            {"min_potential": 5500, "multiplier": 2.5},  # UR
            {"min_potential": 5000, "multiplier": 2.2},  # SSR
            {"min_potential": 4000, "multiplier": 1.8},  # SR
            {"min_potential": 3000, "multiplier": 1.5},  # R
            {"min_potential": 0, "multiplier": 1.2},     # N
        ]
        
        for tier in rarity_tiers:
            if potential >= tier["min_potential"]:
                return tier["multiplier"]
        return 1.0
        
    def _apply_trait_bonuses(self, waifu: Dict[str, Any], stats: Dict[str, float]) -> Dict[str, float]:
        """Apply trait bonuses to stats"""
        traits = waifu.get("traits", [])
        if not traits:
            return stats
            
        boosted_stats = stats.copy()
        
        # Get trait data
        trait_data = data_manager.get_game_data("traits")
        
        for trait_name in traits:
            # Search for trait in all categories
            trait_info = None
            for category, trait_list in trait_data.get("trait_categories", {}).items():
                for trait in trait_list:
                    if trait.get("name") == trait_name:
                        trait_info = trait
                        break
                if trait_info:
                    break
                    
            if trait_info:
                effects = trait_info.get("effects", {})
                for effect_name, effect_value in effects.items():
                    if effect_name == "damage_bonus":
                        boosted_stats["atk"] = int(boosted_stats["atk"] * (1 + effect_value))
                    elif effect_name == "defense_bonus":
                        boosted_stats["def"] = int(boosted_stats["def"] * (1 + effect_value))
                    elif effect_name == "crit_chance":
                        boosted_stats["crit"] += effect_value * 100  # Convert to percentage
                    elif effect_name == "healing_bonus":
                        boosted_stats["hp"] = int(boosted_stats["hp"] * (1 + effect_value))
                        
        return boosted_stats
        
    def _apply_temporary_buffs(self, waifu: Dict[str, Any], stats: Dict[str, float]) -> Dict[str, float]:
        """Apply temporary buffs from dreams, items, etc."""
        buffs = waifu.get("temporary_buffs", {})
        if not buffs:
            return stats
            
        boosted_stats = stats.copy()
        
        for buff_name, buff_data in buffs.items():
            if isinstance(buff_data, dict):
                buff_type = buff_data.get("type")
                buff_value = buff_data.get("value", 0)
                expires_at = buff_data.get("expires_at")
                
                # Check if buff is still active
                if expires_at:
                    try:
                        expire_time = datetime.fromisoformat(expires_at)
                        if datetime.now() > expire_time:
                            continue  # Skip expired buff
                    except:
                        continue
                        
                # Apply buff based on type
                if buff_type == "attack_boost":
                    boosted_stats["atk"] = int(boosted_stats["atk"] * (1 + buff_value))
                elif buff_type == "defense_boost":
                    boosted_stats["def"] = int(boosted_stats["def"] * (1 + buff_value))
                elif buff_type == "hp_boost":
                    boosted_stats["hp"] = int(boosted_stats["hp"] * (1 + buff_value))
                elif buff_type == "crit_boost":
                    boosted_stats["crit"] += buff_value
                    
        return boosted_stats
        
    def calculate_damage(self, attacker_stats: Dict[str, float], 
                        defender_stats: Dict[str, float],
                        skill_modifiers: Dict[str, float] = None) -> Tuple[int, bool, List[str]]:
        """Calculate damage with advanced mechanics"""
        base_attack = attacker_stats["atk"]
        defense = defender_stats["def"]
        crit_chance = attacker_stats["crit"]
        
        # Apply skill modifiers
        if skill_modifiers:
            base_attack *= skill_modifiers.get("damage_multiplier", 1.0)
            crit_chance += skill_modifiers.get("crit_bonus", 0)
            
        # Calculate base damage with some randomness
        damage_variance = random.uniform(0.85, 1.15)
        base_damage = base_attack * damage_variance
        
        # Apply defense reduction
        defense_reduction = defense / (defense + 100)  # Soft cap for defense
        final_damage = base_damage * (1 - defense_reduction)
        
        # Check for critical hit
        is_critical = random.random() < crit_chance
        if is_critical:
            final_damage *= CRIT_BASE_MULTIPLIER
            
        # Apply elemental effectiveness
        attacker_element = attacker_stats.get("element", "Neutral")
        defender_element = defender_stats.get("element", "Neutral")
        elemental_modifier, elemental_text = self._calculate_elemental_effectiveness(
            attacker_element, defender_element)
        final_damage *= elemental_modifier
        
        # Ensure minimum damage
        final_damage = max(1, int(final_damage))
        
        # Combat log messages
        combat_log = []
        if is_critical:
            combat_log.append("💥 Critical hit!")
        if elemental_text:
            combat_log.append(elemental_text)
            
        return final_damage, is_critical, combat_log
        
    def _calculate_elemental_effectiveness(self, attacker_element: str, 
                                         defender_element: str) -> Tuple[float, str]:
        """Calculate elemental effectiveness and return modifier with description"""
        if attacker_element not in self.element_chart:
            return 1.0, ""
            
        element_data = self.element_chart[attacker_element]
        
        if defender_element in element_data["strong"]:
            return 1.25, f"🔥 {attacker_element} is super effective against {defender_element}!"
        elif defender_element in element_data["weak"]:
            return 0.8, f"💧 {attacker_element} is not very effective against {defender_element}..."
        else:
            return 1.0, ""
            
    def process_skills(self, waifu: Dict[str, Any], 
                      battle_context: Dict[str, Any]) -> Tuple[Dict[str, float], List[str]]:
        """Process waifu skills and return modifiers with descriptions"""
        skills = waifu.get("skills", [])
        if not skills:
            return {}, []
            
        skill_modifiers = {
            "damage_multiplier": 1.0,
            "healing_amount": 0,
            "crit_bonus": 0,
            "defense_boost": 0
        }
        skill_log = []
        
        for skill in skills:
            skill_name = skill.get("name", "Unknown Skill")
            effect = skill.get("effect", "").lower()
            rarity = skill.get("rarity", "common")
            
            # Calculate skill activation chance based on rarity
            activation_chance = {
                "common": 0.3,
                "uncommon": 0.4,
                "rare": 0.5,
                "epic": 0.6,
                "legendary": 0.7,
                "mythical": 0.8
            }.get(rarity, 0.3)
            
            if random.random() < activation_chance:
                # Parse skill effects
                if "damage" in effect:
                    damage_boost = self._extract_number_from_effect(effect, default=0.2)
                    skill_modifiers["damage_multiplier"] += damage_boost
                    skill_log.append(f"⚔️ {skill_name} activated! (+{int(damage_boost*100)}% damage)")
                    
                elif "heal" in effect:
                    healing = self._extract_number_from_effect(effect, default=100)
                    skill_modifiers["healing_amount"] += healing
                    skill_log.append(f"💚 {skill_name} activated! (+{healing} HP)")
                    
                elif "crit" in effect:
                    crit_boost = self._extract_number_from_effect(effect, default=0.1)
                    skill_modifiers["crit_bonus"] += crit_boost
                    skill_log.append(f"✨ {skill_name} activated! (+{int(crit_boost*100)}% crit chance)")
                    
                elif "defense" in effect or "shield" in effect:
                    defense_boost = self._extract_number_from_effect(effect, default=0.15)
                    skill_modifiers["defense_boost"] += defense_boost
                    skill_log.append(f"🛡️ {skill_name} activated! (+{int(defense_boost*100)}% defense)")
                    
        return skill_modifiers, skill_log
        
    def _extract_number_from_effect(self, effect_text: str, default: float) -> float:
        """Extract numerical values from skill effect descriptions"""
        import re
        
        # Look for percentage values
        percent_match = re.search(r'(\d+)%', effect_text)
        if percent_match:
            return float(percent_match.group(1)) / 100.0
            
        # Look for raw numbers
        number_match = re.search(r'(\d+)', effect_text)
        if number_match:
            value = float(number_match.group(1))
            # Assume values over 10 are absolute, others are multipliers
            if value > 10:
                return value
            else:
                return value / 100.0
                
        return default
        
    def simulate_battle(self, waifu1: Dict[str, Any], waifu2: Dict[str, Any],
                       max_rounds: int = None) -> Dict[str, Any]:
        """Simulate a complete battle between two waifus"""
        max_rounds = max_rounds or BATTLE_ROUNDS_MAX
        
        # Calculate battle stats
        stats1 = self.calculate_battle_stats(waifu1)
        stats2 = self.calculate_battle_stats(waifu2)
        
        # Initialize battle state
        current_hp1 = stats1["hp"]
        current_hp2 = stats2["hp"]
        
        battle_log = []
        round_details = []
        
        battle_log.append(f"🏟️ **Battle begins between {waifu1.get('name', 'Fighter 1')} and {waifu2.get('name', 'Fighter 2')}!**")
        battle_log.append(f"❤️ {waifu1.get('name')}: {current_hp1} HP | {waifu2.get('name')}: {current_hp2} HP")
        battle_log.append("")
        
        for round_num in range(1, max_rounds + 1):
            round_log = [f"🎯 **Round {round_num}**"]
            
            # Determine turn order based on speed
            if stats1["speed"] >= stats2["speed"]:
                first_attacker, first_defender = (waifu1, stats1, "current_hp1"), (waifu2, stats2, "current_hp2")
                second_attacker, second_defender = (waifu2, stats2, "current_hp2"), (waifu1, stats1, "current_hp1")
            else:
                first_attacker, first_defender = (waifu2, stats2, "current_hp2"), (waifu1, stats1, "current_hp1")
                second_attacker, second_defender = (waifu1, stats1, "current_hp1"), (waifu2, stats2, "current_hp2")
                
            # First attacker's turn
            damage1, crit1, combat_log1, heal1 = self._process_turn(
                first_attacker[0], first_attacker[1], first_defender[1])
                
            if first_attacker[2] == "current_hp1":
                current_hp2 = max(0, current_hp2 - damage1)
                current_hp1 = min(stats1["hp"], current_hp1 + heal1)
            else:
                current_hp1 = max(0, current_hp1 - damage1)
                current_hp2 = min(stats2["hp"], current_hp2 + heal1)
                
            round_log.extend(combat_log1)
            
            # Check if battle ended
            if current_hp1 <= 0 or current_hp2 <= 0:
                round_details.append("\n".join(round_log))
                break
                
            # Second attacker's turn
            damage2, crit2, combat_log2, heal2 = self._process_turn(
                second_attacker[0], second_attacker[1], second_defender[1])
                
            if second_attacker[2] == "current_hp1":
                current_hp2 = max(0, current_hp2 - damage2)
                current_hp1 = min(stats1["hp"], current_hp1 + heal2)
            else:
                current_hp1 = max(0, current_hp1 - damage2)
                current_hp2 = min(stats2["hp"], current_hp2 + heal2)
                
            round_log.extend(combat_log2)
            
            # Add HP status
            round_log.append(f"❤️ {waifu1.get('name')}: {self._create_hp_bar(current_hp1, stats1['hp'])}")
            round_log.append(f"❤️ {waifu2.get('name')}: {self._create_hp_bar(current_hp2, stats2['hp'])}")
            
            round_details.append("\n".join(round_log))
            
            # Check if battle ended
            if current_hp1 <= 0 or current_hp2 <= 0:
                break
                
        # Determine winner
        if current_hp1 > current_hp2:
            winner = waifu1.get("name", "Fighter 1")
            winner_id = 1
        elif current_hp2 > current_hp1:
            winner = waifu2.get("name", "Fighter 2")
            winner_id = 2
        else:
            winner = "Draw"
            winner_id = 0
            
        # Battle results
        results = {
            "winner": winner,
            "winner_id": winner_id,
            "final_hp": {"fighter1": current_hp1, "fighter2": current_hp2},
            "total_rounds": round_num,
            "battle_log": battle_log,
            "round_details": round_details,
            "stats": {"fighter1": stats1, "fighter2": stats2}
        }
        
        return results
        
    def _process_turn(self, attacker: Dict[str, Any], attacker_stats: Dict[str, float],
                     defender_stats: Dict[str, float]) -> Tuple[int, bool, List[str], int]:
        """Process a single turn for an attacker"""
        combat_log = []
        
        # Process skills
        skill_modifiers, skill_log = self.process_skills(attacker, {})
        combat_log.extend(skill_log)
        
        # Calculate damage
        damage, is_critical, damage_log = self.calculate_damage(
            attacker_stats, defender_stats, skill_modifiers)
        combat_log.extend(damage_log)
        
        # Add damage message
        attacker_name = attacker.get("name", "Unknown")
        damage_text = f"💥 {attacker_name} deals **{damage}** damage!"
        if is_critical:
            damage_text += " 💥"
        combat_log.append(damage_text)
        
        # Calculate healing
        healing = skill_modifiers.get("healing_amount", 0)
        if healing > 0:
            combat_log.append(f"💚 {attacker_name} recovers **{healing}** HP!")
            
        return damage, is_critical, combat_log, healing
        
    def _create_hp_bar(self, current_hp: float, max_hp: float, length: int = 20) -> str:
        """Create a visual HP bar"""
        if max_hp <= 0:
            return "[" + "." * length + f"] 0/{int(max_hp)}"
            
        filled = int((current_hp / max_hp) * length)
        filled = max(0, min(filled, length))
        
        bar = "█" * filled + "." * (length - filled)
        return f"[{bar}] {int(current_hp)}/{int(max_hp)}"

# Global battle engine instance
battle_engine = BattleEngine()
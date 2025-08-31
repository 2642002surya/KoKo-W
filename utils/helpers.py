# Utility helper functions for KoKoroMichi Advanced Bot
import random
import re
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta

def format_number(number: int) -> str:
    """Format large numbers with commas"""
    return f"{number:,}"

def normalize_name(name: str) -> str:
    """Normalize a name for comparison (lowercase, no spaces)"""
    return re.sub(r'[^a-zA-Z0-9]', '', name.lower())

def find_character_by_name(characters: List[Dict], search_name: str) -> Optional[Dict]:
    """Find a character by name (fuzzy matching)"""
    search_name = normalize_name(search_name)
    
    # First try exact match
    for char in characters:
        char_name = normalize_name(char.get('name', ''))
        if char_name == search_name:
            return char
    
    # Then try partial match
    for char in characters:
        char_name = normalize_name(char.get('name', ''))
        if search_name in char_name or char_name in search_name:
            return char
    
    return None

def calculate_level_from_xp(xp: int) -> int:
    """Calculate level based on XP"""
    if xp <= 0:
        return 1
    
    # XP formula: level = sqrt(xp/100) + 1
    import math
    level = int(math.sqrt(xp / 100)) + 1
    return min(level, 100)  # Cap at level 100

def calculate_xp_for_level(level: int) -> int:
    """Calculate XP needed for a specific level"""
    if level <= 1:
        return 0
    return (level - 1) ** 2 * 100

def get_rarity_tier(potential: int) -> str:
    """Determine rarity tier based on potential"""
    if potential >= 7000:
        return "Mythic"
    elif potential >= 6000:
        return "LR"
    elif potential >= 5500:
        return "UR"
    elif potential >= 5000:
        return "SSR"
    elif potential >= 4000:
        return "SR"
    elif potential >= 3000:
        return "R"
    else:
        return "N"

def calculate_battle_power(hp: int, atk: int, defense: int, level: int = 1) -> int:
    """Calculate total battle power"""
    base_power = hp + (atk * 2) + defense
    level_multiplier = 1 + (level - 1) * 0.1
    return int(base_power * level_multiplier)

def get_random_element() -> str:
    """Get a random element type"""
    elements = ["Fire", "Water", "Earth", "Air", "Light", "Dark", "Neutral"]
    return random.choice(elements)

def check_elemental_advantage(attacker_element: str, defender_element: str) -> float:
    """Check elemental advantage and return damage multiplier"""
    advantages = {
        "Fire": ["Earth", "Air"],
        "Water": ["Fire", "Light"],
        "Earth": ["Water", "Dark"],
        "Air": ["Earth", "Water"],
        "Light": ["Dark", "Air"],
        "Dark": ["Light", "Fire"]
    }
    
    if defender_element in advantages.get(attacker_element, []):
        return 1.25  # 25% damage bonus
    elif attacker_element in advantages.get(defender_element, []):
        return 0.8   # 20% damage penalty
    else:
        return 1.0   # No advantage

def generate_random_stats(rarity_tier: str) -> Dict[str, int]:
    """Generate random stats based on rarity tier"""
    base_stats = {
        "Mythic": {"hp": (180, 220), "atk": (90, 110), "def": (80, 100)},
        "LR": {"hp": (160, 200), "atk": (80, 100), "def": (70, 90)},
        "UR": {"hp": (140, 180), "atk": (70, 90), "def": (60, 80)},
        "SSR": {"hp": (120, 160), "atk": (60, 80), "def": (50, 70)},
        "SR": {"hp": (100, 140), "atk": (50, 70), "def": (40, 60)},
        "R": {"hp": (80, 120), "atk": (40, 60), "def": (30, 50)},
        "N": {"hp": (60, 100), "atk": (30, 50), "def": (20, 40)}
    }
    
    stats_range = base_stats.get(rarity_tier, base_stats["N"])
    
    return {
        "hp": random.randint(*stats_range["hp"]),
        "atk": random.randint(*stats_range["atk"]),
        "def": random.randint(*stats_range["def"])
    }

def create_progress_bar(current: int, maximum: int, length: int = 10) -> str:
    """Create a text progress bar"""
    if maximum <= 0:
        return "▱" * length
    
    progress = min(current / maximum, 1.0)
    filled = int(progress * length)
    empty = length - filled
    
    return "▰" * filled + "▱" * empty

def is_on_cooldown(last_used: str, cooldown_hours: int) -> Tuple[bool, int]:
    """Check if an action is on cooldown"""
    if not last_used:
        return False, 0
    
    try:
        last_time = datetime.fromisoformat(last_used)
        current_time = datetime.now()
        time_diff = current_time - last_time
        
        cooldown_duration = timedelta(hours=cooldown_hours)
        
        if time_diff < cooldown_duration:
            remaining = cooldown_duration - time_diff
            remaining_hours = int(remaining.total_seconds() / 3600)
            return True, remaining_hours
        else:
            return False, 0
    except:
        return False, 0

def validate_amount(amount_str: str, max_amount: int = None) -> Tuple[bool, int, str]:
    """Validate an amount input"""
    try:
        # Handle special cases
        if amount_str.lower() == "all" and max_amount is not None:
            return True, max_amount, ""
        
        amount = int(amount_str)
        
        if amount <= 0:
            return False, 0, "Amount must be positive"
        
        if max_amount is not None and amount > max_amount:
            return False, 0, f"Amount cannot exceed {format_number(max_amount)}"
        
        return True, amount, ""
    except ValueError:
        return False, 0, "Please provide a valid number"

def truncate_text(text: str, max_length: int = 1000) -> str:
    """Truncate text to fit Discord embed limits"""
    if len(text) <= max_length:
        return text
    
    return text[:max_length - 3] + "..."

def get_user_mention_id(mention: str) -> Optional[str]:
    """Extract user ID from a mention string"""
    # Match patterns like <@123456789> or <@!123456789>
    match = re.match(r'<@!?(\d+)>', mention)
    if match:
        return match.group(1)
    
    # Try direct number
    if mention.isdigit():
        return mention
    
    return None

def calculate_investment_return(investment_amount: int, days: int, return_rate: float = 0.02) -> int:
    """Calculate investment returns"""
    # Compound daily interest
    total_return = investment_amount * ((1 + return_rate) ** days)
    return int(total_return - investment_amount)

def generate_unique_id(prefix: str = "") -> str:
    """Generate a unique ID"""
    import uuid
    unique_part = str(uuid.uuid4())[:8]
    timestamp = int(datetime.now().timestamp())
    return f"{prefix}{timestamp}_{unique_part}"

def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    """Safely divide two numbers"""
    try:
        if denominator == 0:
            return default
        return numerator / denominator
    except:
        return default

def parse_time_string(time_str: str) -> Optional[timedelta]:
    """Parse time strings like '1h', '30m', '2d'"""
    try:
        time_str = time_str.lower().strip()
        
        if time_str.endswith('s'):
            return timedelta(seconds=int(time_str[:-1]))
        elif time_str.endswith('m'):
            return timedelta(minutes=int(time_str[:-1]))
        elif time_str.endswith('h'):
            return timedelta(hours=int(time_str[:-1]))
        elif time_str.endswith('d'):
            return timedelta(days=int(time_str[:-1]))
        else:
            # Assume minutes if no unit
            return timedelta(minutes=int(time_str))
    except:
        return None

def weighted_random_choice(items: List[Tuple[Any, float]]) -> Any:
    """Make a weighted random choice from list of (item, weight) tuples"""
    if not items:
        return None
    
    total_weight = sum(weight for item, weight in items)
    if total_weight <= 0:
        return items[0][0]  # Return first item if no weights
    
    rand_value = random.uniform(0, total_weight)
    current_weight = 0
    
    for item, weight in items:
        current_weight += weight
        if rand_value <= current_weight:
            return item
    
    return items[-1][0]  # Fallback to last item
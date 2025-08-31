"""
Rarity-based stat calculation system for Discord bot
"""

def get_rarity_stats(rarity):
    """Return base stats for each rarity level"""
    rarity_stats = {
        "N": {"hp": 500, "atk": 50, "def": 25},
        "R": {"hp": 800, "atk": 80, "def": 40},
        "SR": {"hp": 1200, "atk": 120, "def": 60},
        "SSR": {"hp": 1800, "atk": 180, "def": 90},
        "UR": {"hp": 2800, "atk": 280, "def": 140},
        "LR": {"hp": 4200, "atk": 420, "def": 210},
        "Mythic": {"hp": 6500, "atk": 650, "def": 325}
    }
    
    # Extract base rarity (remove emojis)
    base_rarity = rarity.split()[0] if ' ' in rarity else rarity
    
    return rarity_stats.get(base_rarity, rarity_stats["N"])

def calculate_power_level(hp, atk, def_stat):
    """Calculate power level based on stats"""
    return int(hp * 0.3 + atk * 8 + def_stat * 4)
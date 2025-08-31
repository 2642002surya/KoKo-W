# utils/combact.py
import os
import json
import random
from datetime import datetime
from discord import File, Embed

CHARACTERS_DIR = os.path.join(os.path.dirname(__file__), '../characters')
USERS_FILE = os.path.join(os.path.dirname(__file__), '../data/users.json')

# -------------------
# RARITY TIERS FOR RELIC BOOSTS
# -------------------
RARITY_TIERS = [
    {
        "name": "Mythic 🌈✨✨",
        "min_potential": 7000,
        "multiplier": 3.0
    },
    {
        "name": "LR ⚡",
        "min_potential": 6000,
        "multiplier": 2.8
    },
    {
        "name": "UR 🌟",
        "min_potential": 5500,
        "multiplier": 2.5
    },
    {
        "name": "SSR 🌈✨",
        "min_potential": 5000,
        "multiplier": 2.2
    },
    {
        "name": "SR 🔥",
        "min_potential": 4000,
        "multiplier": 1.8
    },
    {
        "name": "R 🔧",
        "min_potential": 3000,
        "multiplier": 1.5
    },
    {
        "name": "N 🌿",
        "min_potential": 0,
        "multiplier": 1.2
    },
]


# -------------------
# DAMAGE & COMBAT
# -------------------
def calculate_damage(atk, crit_chance, multiplier=1.0):
    dmg = int(random.uniform(0.8, 1.2) * atk * multiplier)
    if random.random() < crit_chance:
        dmg = int(dmg * 1.5)
    return dmg


def apply_elemental_bonus(dmg, attacker_element, defender_element):
    chart = {
        "Fire": "Earth",
        "Water": "Fire",
        "Earth": "Lightning",
        "Lightning": "Water",
        "Light": "Dark",
        "Dark": "Light"
    }
    if attacker_element == chart.get(defender_element):
        dmg = int(dmg * 0.9)
    elif chart.get(attacker_element) == defender_element:
        dmg = int(dmg * 1.1)
    return dmg


def health_bar(hp, max_hp, total=20):
    filled = int((hp / max_hp) * total)
    return f"[{'█' * filled}{'.' * (total - filled)}] {int(hp)}/{int(max_hp)}"


# -------------------
# WAIFU & USER HELPERS
# -------------------
def normalize_name(name: str) -> str:
    """Lowercase and remove non-alphanumeric for robust matching."""
    return ''.join(c.lower() for c in name if c.isalnum())


def load_character(name: str):
    """Load a character JSON file by name with normalization."""
    target = normalize_name(name)
    for file in os.listdir(CHARACTERS_DIR):
        if file.endswith('.json'):
            file_base = normalize_name(os.path.splitext(file)[0])
            if target == file_base or target.startswith(
                    file_base) or file_base.startswith(target):
                with open(os.path.join(CHARACTERS_DIR, file),
                          'r',
                          encoding='utf-8') as f:
                    return json.load(f)
    return None


def get_best_waifu(user):
    if not user.get("claimed_waifus"):
        return None
    return max(user["claimed_waifus"], key=lambda w: w.get("level", 1))


def get_waifu_by_name(user, name):
    if not name:
        return None
    target = normalize_name(name)
    for w in user.get("claimed_waifus", []):
        if normalize_name(w.get("name", "")) == target:
            return w
    return None


def random_bot_waifu(users, exclude_id):
    candidates = []
    for uid, data in users.items():
        if uid == exclude_id:
            continue
        for w in data.get("claimed_waifus", []):
            candidates.append(w)
    return random.choice(candidates) if candidates else None


# -------------------
# XP & LEVEL
# -------------------
def award_xp(waifu, xp):
    leveled_up = False
    waifu['exp'] = waifu.get('exp', 0) + xp
    while waifu['exp'] >= waifu.get('level', 1) * 100 and waifu.get(
            'level', 1) < 100:
        waifu['exp'] -= waifu['level'] * 100
        waifu['level'] = waifu.get('level', 1) + 1
        waifu['atk'] = waifu.get('atk', 50) + 5
        waifu['hp'] = waifu.get('hp', 500) + 25
        waifu['crit'] = waifu.get('crit', 5) + 1
        leveled_up = True
    return leveled_up, waifu['level']


def award_gold(user, amount):
    user['gold'] = user.get('gold', 0) + amount


def award_affection(waifu, points):
    waifu['affection'] = waifu.get('affection', 0) + points


# -------------------
# BATTLE LOGGING
# -------------------
def log_battle(users, attacker_id, defender_id, attacker_waifu, defender_waifu,
               winner_id):
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    results = []
    for uid, w, opp in [(attacker_id, attacker_waifu, defender_waifu),
                        (defender_id, defender_waifu, attacker_waifu)]:
        if uid and uid in users:
            won = uid == winner_id
            users[uid].setdefault("battle_history", []).append({
                "waifu":
                w['name'],
                "opponent":
                opp['name'],
                "result":
                "win" if won else "lose",
                "timestamp":
                timestamp
            })
            users[uid]["battle_history"] = users[uid]["battle_history"][-10:]
            results.append((uid, w['name'], won))
    return results


# -------------------
# RELIC & STAT BOOSTS
# -------------------
def get_relic_multiplier(waifu):
    """
    Return damage multiplier if equipped relic matches exclusive_relic.
    """
    equipped = waifu.get("relic") or {}
    exclusive = waifu.get("exclusive_relic")

    if not equipped or not exclusive:
        return 1.0

    if equipped.get("name") != exclusive:
        return 1.0

    # Use potential to find multiplier tier
    potential = equipped.get("potential", 0)
    for tier in RARITY_TIERS:
        if potential >= tier["min_potential"]:
            return tier["multiplier"]
    return 1.0


def apply_relic_boosts(waifu):
    """
    Returns boosted stats dict using base stats and relic multiplier
    only if relic matches exclusive_relic.
    """
    multiplier = get_relic_multiplier(waifu)
    boosted = {
        "atk": int(waifu.get("atk", 50) * multiplier),
        "hp": int(waifu.get("hp", 500) * multiplier),
        "crit": min(waifu.get("crit", 5) * multiplier / 100, 1.0)
    }
    return boosted


# -------------------
# SKILL EFFECT PARSING
# -------------------
def parse_skill_effects(waifu):
    effects = []
    for skill in waifu.get('skills', []):
        effects.append({
            'name': skill.get('name', 'Unnamed'),
            'effect': skill.get('effect', ''),
            'rarity': skill.get('rarity', 'Normal')
        })
    return effects


# -------------------
# RANDOM SUGGESTIONS / EVENTS
# -------------------
def suggest_battle_tip(waifu):
    tips = []
    if waifu.get('crit', 0) > 10:
        tips.append("High crit! Try aggressive attacks.")
    if waifu.get('hp', 0) < 300:
        tips.append("Low HP! Consider healing skills first.")
    if waifu.get('level', 0) < 5:
        tips.append("Level is low. Farming XP first might help.")
    if not tips:
        tips.append("Your waifu is ready for battle!")
    return random.choice(tips)


def suggest_relic_use(waifu, relic_stats):
    if relic_stats.get('atk', 0) > 20:
        return "Equip high ATK relic to maximize damage."
    if relic_stats.get('hp', 0) > 100:
        return "Equip HP relic for survivability."
    return "No optimal relic detected."


# -------------------
# SIMULATION HELPERS (ENHANCED)
# -------------------
def simulate_round(attacker,
                   defender,
                   include_skills=True,
                   include_relics=True):
    atk_stats = apply_relic_boosts(attacker) if include_relics else {
        "atk": attacker.get("atk", 50),
        "hp": attacker.get("hp", 500),
        "crit": min(attacker.get("crit", 5) / 100, 1.0)
    }
    def_stats = apply_relic_boosts(defender) if include_relics else {
        "atk": defender.get("atk", 50),
        "hp": defender.get("hp", 500),
        "crit": min(defender.get("crit", 5) / 100, 1.0)
    }

    # Base damage
    dmg1 = calculate_damage(atk_stats['atk'], atk_stats['crit'])
    dmg2 = calculate_damage(def_stats['atk'], def_stats['crit'])

    # Track HP changes for logs
    hp1_change = 0
    hp2_change = 0

    attacker_skill_log = []
    if include_skills:
        for skill in attacker.get('skills', []):
            effect_text = skill.get('effect', '').lower()
            skill_name = skill.get('name', 'Unnamed')
            if 'damage' in effect_text:
                extra = int(atk_stats['atk'] * random.uniform(0.03, 0.08))
                dmg1 += extra
                attacker_skill_log.append(
                    f"{attacker['name']} used {skill_name} (+{extra} dmg)")
            if 'heal' in effect_text:
                heal = int(atk_stats['hp'] * random.uniform(0.05, 0.12))
                hp1_change += heal
                attacker_skill_log.append(
                    f"{attacker['name']} used {skill_name} (+{heal} HP)")
            if 'buff' in effect_text:
                buff = int(atk_stats['atk'] * random.uniform(0.05, 0.10))
                dmg1 += buff
                attacker_skill_log.append(
                    f"{attacker['name']} used {skill_name} (buff +{buff} dmg)")

    defender_skill_log = []
    if include_skills:
        for skill in defender.get('skills', []):
            effect_text = skill.get('effect', '').lower()
            skill_name = skill.get('name', 'Unnamed')
            if 'damage' in effect_text:
                extra = int(def_stats['atk'] * random.uniform(0.03, 0.08))
                dmg2 += extra
                defender_skill_log.append(
                    f"{defender['name']} used {skill_name} (+{extra} dmg)")
            if 'heal' in effect_text:
                heal = int(def_stats['hp'] * random.uniform(0.05, 0.12))
                hp2_change += heal
                defender_skill_log.append(
                    f"{defender['name']} used {skill_name} (+{heal} HP)")
            if 'buff' in effect_text:
                buff = int(def_stats['atk'] * random.uniform(0.05, 0.10))
                dmg2 += buff
                defender_skill_log.append(
                    f"{defender['name']} used {skill_name} (buff +{buff} dmg)")

    return dmg1, dmg2, hp1_change, hp2_change, attacker_skill_log, defender_skill_log


def simulate_battle(waifu1,
                    waifu2,
                    rounds=10,
                    forced_outcome=None,
                    include_skills=True,
                    include_relics=True):
    if forced_outcome in ("win", "lose", "draw"):
        log = [f"Forced outcome applied: {forced_outcome.upper()}"]
        if forced_outcome == "win":
            return log, waifu1['name']
        elif forced_outcome == "lose":
            return log, waifu2['name']
        else:
            return log, "draw"

    hp1, hp2 = waifu1['hp'], waifu2['hp']
    log = []

    for round_num in range(1, rounds + 1):
        dmg1, dmg2, hp1_change, hp2_change, atk_log, def_log = simulate_round(
            waifu1,
            waifu2,
            include_skills=include_skills,
            include_relics=include_relics)
        hp2 = max(0, hp2 - dmg1 + hp2_change)
        hp1 = max(0, hp1 - dmg2 + hp1_change)

        # Enhanced dramatic round description
        round_text = f"🎯 **Round {round_num}:**\n"
        
        # Add skill usage details
        if atk_log:
            round_text += "⚔️ " + " | ".join(atk_log) + "\n"
        if def_log:
            round_text += "🛡️ " + " | ".join(def_log) + "\n"
            
        # Add damage and health changes with dramatic flair
        round_text += f"💥 {waifu1['name']} strikes for **{dmg1} damage**!\n"
        round_text += f"💥 {waifu2['name']} retaliates with **{dmg2} damage**!\n"
        
        if hp1_change > 0:
            round_text += f"💚 {waifu1['name']} heals for **{hp1_change} HP**!\n"
        if hp2_change > 0:
            round_text += f"💚 {waifu2['name']} heals for **{hp2_change} HP**!\n"
            
        # Show current health status
        round_text += f"❤️ {waifu1['name']}: {health_bar(hp1, waifu1['hp'])}\n"
        round_text += f"❤️ {waifu2['name']}: {health_bar(hp2, waifu2['hp'])}"

        log.append(round_text)

        if hp1 <= 0 or hp2 <= 0:
            break

    if hp1 > hp2:
        winner = waifu1['name']
    elif hp2 > hp1:
        winner = waifu2['name']
    else:
        winner = 'draw'

    return log, winner

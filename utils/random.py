# utils/random.py
import os
import json
import random
from utils.fileManager import load_users, update_user_profile
from utils.history import add_summon
import discord
from utils.template import create_waifu_template

from core.config import CHARACTERS_DIR
CHARACTERS_FOLDER = str(CHARACTERS_DIR)

PITY_LIMIT = 20
SSR_CHANCE = 0.03
SR_CHANCE = 0.12
R_CHANCE = 0.35
N_CHANCE = 0.50
DUPLICATE_XP = 50
DUPLICATE_ATK = 10
DUPLICATE_HP = 100
DUPLICATE_CRIT = 1

RARITY_TIERS = [
    {
        "name": "Mythic 🌈✨✨",
        "min_potential": 7000
    },
    {
        "name": "LR ⚡",
        "min_potential": 6000
    },
    {
        "name": "UR 🌟",
        "min_potential": 5500
    },
    {
        "name": "SSR 🌈✨",
        "min_potential": 5000
    },
    {
        "name": "SR 🔥",
        "min_potential": 4000
    },
    {
        "name": "R 🔧",
        "min_potential": 3000
    },
    {
        "name": "N 🌿",
        "min_potential": 0
    },
]


def extract_potential_value(potential):
    if isinstance(potential, dict):
        return int(next(iter(potential.values())))
    return int(potential)


def get_gold_reward_by_potential(potential) -> int:
    potential = extract_potential_value(potential)
    if potential >= 5200: return 1500
    elif potential >= 5000: return 1200
    elif potential >= 4500: return 920
    elif potential >= 4000: return 780
    elif potential >= 3500: return 650
    elif potential >= 3000: return 500
    elif potential >= 2500: return 300
    elif potential >= 2000: return 200
    else: return 100


def get_rarity(potential) -> str:
    potential = extract_potential_value(potential)
    for tier in RARITY_TIERS:
        if potential >= tier["min_potential"]:
            return tier["name"]
    return "N 🌿"


def load_all_characters():
    chars = []
    for f in os.listdir(CHARACTERS_FOLDER):
        if f.endswith(".json"):
            with open(os.path.join(CHARACTERS_FOLDER, f),
                      'r',
                      encoding='utf-8') as file:
                try:
                    chars.append(json.load(file))
                except json.JSONDecodeError:
                    pass
    return chars


def pick_character():
    characters = load_all_characters()
    roll = random.random()
    if roll < 0.005: rarity = "Mythic 🌈✨✨"
    elif roll < 0.015: rarity = "LR ⚡"
    elif roll < 0.03: rarity = "UR 🌟"
    elif roll < SSR_CHANCE + 0.03: rarity = "SSR 🌈✨"
    elif roll < SSR_CHANCE + SR_CHANCE + 0.03: rarity = "SR 🔥"
    elif roll < SSR_CHANCE + SR_CHANCE + R_CHANCE + 0.03: rarity = "R 🔧"
    else: rarity = "N 🌿"
    pool = [c for c in characters if get_rarity(c["potential"]) == rarity]
    if not pool: pool = characters
    return random.choice(pool)


def format_skills(waifu):
    """Combine active + passive skills and add type field"""
    skills = []
    for sk in waifu.get("active_skills", []):
        sk_copy = sk.copy()
        sk_copy["type"] = "active"
        skills.append(sk_copy)
    for sk in waifu.get("passive_skills", []):
        sk_copy = sk.copy()
        sk_copy["type"] = "passive"
        skills.append(sk_copy)
    return skills


def summon_waifu(user_id: str, username: str) -> dict:
    users = load_users()
    profile = users.get(
        user_id, {
            "username": username,
            "claimed_waifus": [],
            "gold": 500,
            "gems": 50,
            "waifu_stats": {},
            "summon_count": 0,
            "pity_counter": 0,
            "level": 1,
            "xp": 0,
            "affection": 0
        })

    if "waifu_stats" not in profile: profile["waifu_stats"] = {}

    characters = load_all_characters()
    force_ssr = profile.get("pity_counter", 0) >= PITY_LIMIT - 1

    if force_ssr:
        pool = [
            c for c in characters if get_rarity(c["potential"]) in
            ["SSR 🌈✨", "UR 🌟", "LR ⚡", "Mythic 🌈✨✨"]
        ]
        waifu = random.choice(pool) if pool else random.choice(characters)
        profile["pity_counter"] = 0
    else:
        waifu = pick_character()
        if get_rarity(waifu["potential"]) in [
                "SSR 🌈✨", "UR 🌟", "LR ⚡", "Mythic 🌈✨✨"
        ]:
            profile["pity_counter"] = 0
        else:
            profile["pity_counter"] = profile.get("pity_counter", 0) + 1

    waifu_name = waifu["name"]

    # Duplicate check
    already_owned = any(w['name'] == waifu_name
                        for w in profile["claimed_waifus"])

    # Initialize waifu_stats if new
    if waifu_name not in profile["waifu_stats"]:
        base_potential = extract_potential_value(waifu.get("potential", 0))
        profile["waifu_stats"][waifu_name] = create_waifu_template(
            waifu_name=waifu_name,
            rarity=get_rarity(base_potential),
            main_attribute=waifu.get("main_attribute", "N/A"),
            exclusive_relic=waifu.get("exclusive_relic", "N/A"),
            temple_description=waifu.get("temple_description", ""),
            atk=max(50, int(base_potential * 0.01)),
            hp=max(500, int(base_potential * 0.1)),
            crit=min(5 + base_potential // 1000, 20),
            skills=format_skills(waifu),
            fate=waifu.get("fate", []),
            gallery=waifu.get("gallery", []),
            categories=waifu.get("categories", []))

    # Add to claimed_waifus if not present
    if not already_owned:
        profile["claimed_waifus"].append({"name": waifu_name})

    # Duplicate rewards
    gold_reward = 0
    if already_owned:
        gold_reward = get_gold_reward_by_potential(waifu["potential"]) // 2
        profile["gold"] += gold_reward
        stats = profile["waifu_stats"][waifu_name]
        stats["atk"] += DUPLICATE_ATK
        stats["hp"] += DUPLICATE_HP
        stats["crit"] = min(stats.get("crit", 5) + DUPLICATE_CRIT, 20)
        stats["exp"] += DUPLICATE_XP

        # ----------------- Skill increment logic -----------------
        for skill in stats["skills"]:
            # Increment numerical values in effect string if any
            if "damage" in skill:
                try:
                    if "%" in skill["damage"]:
                        value = float(skill["damage"].replace("% P.DMG",
                                                              "").strip())
                        increment = 0.05 + (extract_potential_value(
                            waifu["potential"]) / 10000)
                        value += increment
                        skill["damage"] = f"{round(value, 2)}% P.DMG"
                    else:
                        value = float(skill["damage"])
                        increment = 0.05 + (extract_potential_value(
                            waifu["potential"]) / 10000)
                        skill["damage"] = str(round(value + increment, 2))
                except (ValueError, TypeError):
                    pass
            if "effect" in skill:
                import re

                def increase_percent(match):
                    val = float(match.group(1))
                    increment = 0.05 + (
                        extract_potential_value(waifu["potential"]) / 10000)
                    return f"{round(val + increment,2)}%"

                skill["effect"] = re.sub(r'(\d+(\.\d+)?)%', increase_percent,
                                         skill["effect"])
        # --------------------------------------------------------

    # Increment summon count
    profile["summon_count"] += 1

    # Select image
    image_choices = [
        f for f in os.listdir(CHARACTERS_FOLDER)
        if f.startswith(f"{waifu_name} - ") and f.endswith(('.webp', '.png',
                                                            '.jpg'))
    ]
    image_file = f"{waifu_name} - 1.webp"
    image_url = f"attachment://{image_file}"

    # Save history & profile
    add_summon(user_id, waifu_name, get_rarity(waifu["potential"]))
    update_user_profile(user_id, profile)

    result_type = "duplicate" if already_owned else "new"

    return {
        "type": result_type,
        "waifu": waifu,
        "gold_reward": gold_reward,
        "image": image_file,
        "image_url": image_url
    }

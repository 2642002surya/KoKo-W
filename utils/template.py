def create_waifu_template(waifu_name: str,
                           rarity: str = "N 🌿",
                           main_attribute: str = "N/A",
                           exclusive_relic: str = "N/A",
                           temple_description: str = "",
                           atk: int = 50,
                           hp: int = 500,
                           crit: int = 5,
                           skills: list = None,
                           fate: list = None,
                           gallery: list = None,
                           categories: list = None) -> dict:
    """
    Returns a structured waifu dictionary to store in users.json.
    """
    if skills is None:
        skills = []
    if fate is None:
        fate = []
    if gallery is None:
        gallery = []
    if categories is None:
        categories = []

    return {
        "name": waifu_name,
        "rarity": rarity,
        "main_attribute": main_attribute,
        "exclusive_relic": exclusive_relic,
        "temple_description": temple_description,
        "level": 1,
        "atk": atk,
        "hp": hp,
        "crit": crit,
        "exp": 0,
        "affection": 0,
        "pity_counter": 0,
        "skills": skills,
        "fate": fate,
        "gallery": gallery,
        "categories": categories
    }

import json, os, datetime

HISTORY_FILE = os.path.join(os.path.dirname(__file__), '..', 'data',
                            'history.json')


def add_summon(user_id, waifu_name, rarity, timestamp=None):
    if timestamp is None:
        timestamp = datetime.datetime.now().isoformat()

    # Load existing history
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            try:
                history = json.load(f)
            except json.JSONDecodeError:
                history = []
    else:
        history = []

    # Append new summon entry
    history.append({
        "user_id": user_id,
        "waifu_name": waifu_name,
        "rarity": rarity,
        "timestamp": timestamp
    })

    # Save back to file
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=4, ensure_ascii=False)

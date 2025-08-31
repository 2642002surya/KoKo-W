import os
import json

USERS_FILE = os.path.join(os.path.dirname(__file__), '..', 'data',
                          'users.json')


def load_users():
    """Load all user data with error handling."""
    if not os.path.exists(USERS_FILE):
        os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
        with open(USERS_FILE, 'w') as f:
            json.dump({}, f)

    try:
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        print(f"❌ Failed to parse users.json: {e}")
        with open(USERS_FILE, 'w') as f:
            json.dump({}, f)
        return {}


def save_users(users):
    """Save all user data to file."""
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2)


def get_user_profile(user_id, username="Unknown"):
    """Get user profile or create a default one if not exists."""
    users = load_users()
    if user_id not in users:
        users[user_id] = {
            "username": username,
            "claimed_waifus": [],
            "gold": 500,
            "gems": 50,
            "waifu_stats": {},
            "inventory": {},
            "cooldowns": {},
            "affection": {}
        }
        save_users(users)
    return users[user_id]


def update_user_profile(user_id, profile):
    """Update a single user's profile by merging with existing data."""
    users = load_users()
    existing = users.get(user_id, {})
    existing.update(profile)  # merge instead of overwrite
    users[user_id] = existing
    save_users(users)


# Optional: Utility to reset all users
def reset_users():
    with open(USERS_FILE, 'w') as f:
        json.dump({}, f)

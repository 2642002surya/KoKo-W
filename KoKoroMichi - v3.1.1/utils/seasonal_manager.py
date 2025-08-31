import json
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

class SeasonalManager:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), '../data/seasonal_events.json')
        self.user_events_file = os.path.join(os.path.dirname(__file__), '../data/user_seasonal_events.json')
        self.seasonal_data = self.load_seasonal_data()
        self.user_events = self.load_user_events()
    
    def load_seasonal_data(self) -> Dict:
        """Load seasonal events and story data from JSON"""
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"seasons": {}, "story_events": [], "limited_events": []}
    
    def load_user_events(self) -> Dict:
        """Load user's active seasonal events"""
        try:
            with open(self.user_events_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"active_events": {}, "completed_events": {}, "seasonal_bonuses": {}}
    
    def save_user_events(self):
        """Save user events data"""
        with open(self.user_events_file, 'w') as f:
            json.dump(self.user_events, f, indent=2)
    
    def get_current_season(self) -> str:
        """Determine current season based on date"""
        month = datetime.now().month
        if month in [3, 4, 5]:
            return "spring"
        elif month in [6, 7, 8]:
            return "summer"
        elif month in [9, 10, 11]:
            return "autumn"
        else:
            return "winter"
    
    def get_active_season_bonuses(self, user_id: str) -> Dict:
        """Get bonuses for current season"""
        current_season = self.get_current_season()
        if current_season in self.seasonal_data["seasons"]:
            season_data = self.seasonal_data["seasons"][current_season]
            return season_data.get("bonuses", {})
        return {}
    
    def start_story_event(self, user_id: str, event_name: str, waifus: List[str]) -> Tuple[bool, str, Dict]:
        """Start a story event with selected waifus"""
        # Find the event
        event_data = None
        for event in self.seasonal_data["story_events"]:
            if event["name"] == event_name:
                event_data = event
                break
        
        if not event_data:
            return False, "Event not found!", {}
        
        # Check requirements
        requirements = event_data["requirements"]
        if len(waifus) < requirements.get("required_waifus", 1):
            return False, f"You need at least {requirements['required_waifus']} waifus for this event!", {}
        
        # Initialize event progress
        event_id = f"{user_id}_{event_name}_{datetime.now().timestamp()}"
        self.user_events["active_events"][event_id] = {
            "event_name": event_name,
            "user_id": user_id,
            "participating_waifus": waifus,
            "current_chapter": 0,
            "choices_made": [],
            "start_time": datetime.now().isoformat(),
            "total_bonus": 1.0
        }
        
        self.save_user_events()
        
        # Return first chapter
        first_chapter = event_data["chapters"][0]
        return True, "Event started successfully!", {
            "event_id": event_id,
            "chapter": first_chapter,
            "waifus": waifus
        }
    
    def make_story_choice(self, event_id: str, choice: str) -> Tuple[bool, str, Dict]:
        """Make a choice in an active story event"""
        if event_id not in self.user_events["active_events"]:
            return False, "Event not found or already completed!", {}
        
        event_progress = self.user_events["active_events"][event_id]
        event_name = event_progress["event_name"]
        
        # Find event data
        event_data = None
        for event in self.seasonal_data["story_events"]:
            if event["name"] == event_name:
                event_data = event
                break
        
        if not event_data:
            return False, "Event data corrupted!", {}
        
        current_chapter_idx = event_progress["current_chapter"]
        current_chapter = event_data["chapters"][current_chapter_idx]
        
        # Validate choice
        if choice not in current_chapter["choices"]:
            return False, f"Invalid choice! Available: {', '.join(current_chapter['choices'])}", {}
        
        # Record choice and apply outcome
        event_progress["choices_made"].append(choice)
        outcome = current_chapter["outcomes"][choice]
        event_progress["total_bonus"] *= outcome["reward_bonus"]
        
        # Move to next chapter or complete
        event_progress["current_chapter"] += 1
        
        if event_progress["current_chapter"] >= len(event_data["chapters"]):
            # Event completed
            return self.complete_story_event(event_id, event_data, event_progress)
        else:
            # Next chapter
            next_chapter = event_data["chapters"][event_progress["current_chapter"]]
            self.save_user_events()
            return True, f"Choice made: {choice}", {
                "outcome": outcome,
                "next_chapter": next_chapter,
                "progress": f"Chapter {event_progress['current_chapter'] + 1}/{len(event_data['chapters'])}"
            }
    
    def complete_story_event(self, event_id: str, event_data: Dict, event_progress: Dict) -> Tuple[bool, str, Dict]:
        """Complete a story event and give rewards"""
        rewards = event_data["rewards"]
        bonus_multiplier = event_progress["total_bonus"]
        
        final_rewards = {
            "xp": int(rewards["base_xp"] * bonus_multiplier),
            "gold": int(rewards["base_gold"] * bonus_multiplier),
            "special_items": random.sample(rewards["special_items"], 
                                         min(2, len(rewards["special_items"])))
        }
        
        # Move to completed events
        self.user_events["completed_events"][event_id] = {
            **event_progress,
            "completion_time": datetime.now().isoformat(),
            "rewards": final_rewards
        }
        
        # Remove from active events
        del self.user_events["active_events"][event_id]
        self.save_user_events()
        
        return True, "Story event completed!", final_rewards
    
    def spawn_limited_event(self) -> Optional[Dict]:
        """Try to spawn a limited-time event"""
        for event in self.seasonal_data["limited_events"]:
            if random.random() < event["spawn_chance"]:
                event_id = f"limited_{event['name']}_{datetime.now().timestamp()}"
                expires_at = datetime.now() + timedelta(hours=event["duration_hours"])
                
                active_event = {
                    "event_id": event_id,
                    "name": event["name"],
                    "description": event["description"],
                    "expires_at": expires_at.isoformat(),
                    "rewards": event["rewards"],
                    "participants": []
                }
                
                return active_event
        
        return None
    
    def get_available_story_events(self, user_level: int, user_waifus: int, user_affinity: int) -> List[Dict]:
        """Get story events available to the user"""
        available = []
        
        for event in self.seasonal_data["story_events"]:
            requirements = event["requirements"]
            
            if (user_level >= requirements.get("min_level", 0) and
                user_waifus >= requirements.get("required_waifus", 1) and
                user_affinity >= requirements.get("min_affinity", 0)):
                
                available.append({
                    "name": event["name"],
                    "description": event["description"],
                    "requirements": requirements,
                    "chapters": len(event["chapters"])
                })
        
        return available
    
    def apply_seasonal_bonuses(self, base_value: int, bonus_type: str, user_id: str) -> int:
        """Apply seasonal bonuses to values"""
        bonuses = self.get_active_season_bonuses(user_id)
        
        multiplier = 1.0
        if bonus_type == "xp" and "xp_multiplier" in bonuses:
            multiplier = bonuses["xp_multiplier"]
        elif bonus_type == "gold" and "gold_multiplier" in bonuses:
            multiplier = bonuses["gold_multiplier"]
        elif bonus_type == "affinity" and "affinity_multiplier" in bonuses:
            multiplier = bonuses["affinity_multiplier"]
        
        return int(base_value * multiplier)
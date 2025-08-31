import json
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

class DreamManager:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), '../data/dream_events.json')
        self.user_data_file = os.path.join(os.path.dirname(__file__), '../data/user_dream_events.json')
        
        self.dream_data = self.load_dream_data()
        self.user_dreams = self.load_user_data()
    
    def load_dream_data(self) -> Dict:
        """Load dream event definitions"""
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"event_settings": {}, "dream_events": []}
    
    def load_user_data(self) -> Dict:
        """Load user dream event data"""
        try:
            with open(self.user_data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"active_dream_events": {}, "user_dream_history": {}, "daily_event_counts": {}, "dream_buffs": {}}
    
    def save_user_data(self):
        """Save user dream data"""
        with open(self.user_data_file, 'w') as f:
            json.dump(self.user_dreams, f, indent=2)
    
    def check_dream_event_trigger(self, user_id: str) -> Tuple[bool, Dict]:
        """Check if a dream event should trigger for user"""
        settings = self.dream_data["event_settings"]
        trigger_chance = settings.get("trigger_chance", 0.15)
        
        # Check daily limit
        today = datetime.now().strftime("%Y-%m-%d")
        daily_counts = self.user_dreams.get("daily_event_counts", {})
        user_daily_count = daily_counts.get(user_id, {}).get(today, 0)
        max_daily = settings.get("max_daily_events", 5)
        
        if user_daily_count >= max_daily:
            return False, {}
        
        # Check cooldown
        if self.is_user_on_cooldown(user_id):
            return False, {}
        
        # Random trigger check
        if random.random() > trigger_chance:
            return False, {}
        
        # Select random event
        available_events = self.dream_data["dream_events"]
        if not available_events:
            return False, {}
        
        weights = {"common": 60, "uncommon": 25, "rare": 12, "legendary": 3}
        rarity_pool = []
        
        for event in available_events:
            rarity = event.get("rarity", "common")
            weight = weights.get(rarity, 10)
            rarity_pool.extend([event] * weight)
        
        selected_event = random.choice(rarity_pool)
        return True, selected_event
    
    def is_user_on_cooldown(self, user_id: str) -> bool:
        """Check if user is on dream event cooldown"""
        user_history = self.user_dreams.get("user_dream_history", {}).get(user_id, [])
        if not user_history:
            return False
        
        last_event = user_history[-1]
        last_time = datetime.fromisoformat(last_event["timestamp"])
        cooldown_hours = self.dream_data["event_settings"].get("cooldown_hours", 2)
        
        return datetime.now() < last_time + timedelta(hours=cooldown_hours)
    
    def start_dream_event(self, user_id: str, event: Dict) -> Tuple[bool, str, Dict]:
        """Start a dream event for user"""
        # Generate unique event ID with more variety
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        random_suffix = random.randint(10000, 99999)
        event_id = f"{user_id}_{timestamp}_{random_suffix}"
        
        completion_time = datetime.now() + timedelta(minutes=event["duration_minutes"])
        
        active_event = {
            "event_id": event_id,
            "user_id": user_id,
            "event_data": event,
            "start_time": datetime.now().isoformat(),
            "completion_time": completion_time.isoformat(),
            "status": "active"
        }
        
        # Add to active events
        if "active_dream_events" not in self.user_dreams:
            self.user_dreams["active_dream_events"] = {}
        
        self.user_dreams["active_dream_events"][event_id] = active_event
        
        # Update daily count
        today = datetime.now().strftime("%Y-%m-%d")
        if "daily_event_counts" not in self.user_dreams:
            self.user_dreams["daily_event_counts"] = {}
        if user_id not in self.user_dreams["daily_event_counts"]:
            self.user_dreams["daily_event_counts"][user_id] = {}
        
        current_count = self.user_dreams["daily_event_counts"][user_id].get(today, 0)
        self.user_dreams["daily_event_counts"][user_id][today] = current_count + 1
        
        # Add to history
        if "user_dream_history" not in self.user_dreams:
            self.user_dreams["user_dream_history"] = {}
        if user_id not in self.user_dreams["user_dream_history"]:
            self.user_dreams["user_dream_history"][user_id] = []
        
        history_entry = {
            "event_id": event_id,
            "event_name": event["name"],
            "timestamp": datetime.now().isoformat(),
            "status": "started"
        }
        self.user_dreams["user_dream_history"][user_id].append(history_entry)
        
        self.save_user_data()
        
        return True, f"Dream event '{event['name']}' has begun!", active_event
    
    def get_active_dream_events(self, user_id: str) -> List[Dict]:
        """Get user's active dream events"""
        active_events = self.user_dreams.get("active_dream_events", {})
        user_events = []
        
        for event_id, event_data in active_events.items():
            if event_data["user_id"] == user_id and event_data["status"] == "active":
                # Check if event is ready
                completion_time = datetime.fromisoformat(event_data["completion_time"])
                if datetime.now() >= completion_time:
                    event_data["status"] = "ready"
                
                user_events.append(event_data)
        
        return user_events
    
    def complete_dream_event(self, user_id: str, event_id: str) -> Tuple[bool, str, Dict]:
        """Complete a dream event and collect rewards"""
        active_events = self.user_dreams.get("active_dream_events", {})
        
        if event_id not in active_events:
            return False, "Dream event not found!", {}
        
        event_data = active_events[event_id]
        
        if event_data["user_id"] != user_id:
            return False, "This dream event doesn't belong to you!", {}
        
        if event_data["status"] != "ready":
            completion_time = datetime.fromisoformat(event_data["completion_time"])
            if datetime.now() < completion_time:
                time_left = completion_time - datetime.now()
                minutes_left = int(time_left.total_seconds() / 60)
                return False, f"Dream event not ready yet! {minutes_left} minutes remaining.", {}
        
        # Process rewards
        event_info = event_data["event_data"]
        rewards = event_info.get("rewards", {})
        
        result = {
            "event_name": event_info["name"],
            "rewards_received": rewards,
            "event_rarity": event_info.get("rarity", "common")
        }
        
        # Apply temporary buffs if any
        if "temporary_buff" in rewards:
            buff = rewards["temporary_buff"]
            if "dream_buffs" not in self.user_dreams:
                self.user_dreams["dream_buffs"] = {}
            if user_id not in self.user_dreams["dream_buffs"]:
                self.user_dreams["dream_buffs"][user_id] = []
            
            buff_data = {
                "type": buff["type"],
                "value": buff["value"],
                "expires": (datetime.now() + timedelta(hours=buff["duration_hours"])).isoformat(),
                "source": event_info["name"]
            }
            self.user_dreams["dream_buffs"][user_id].append(buff_data)
        
        # Mark event as completed
        event_data["status"] = "completed"
        event_data["completion_timestamp"] = datetime.now().isoformat()
        
        # Update history
        for history_entry in self.user_dreams["user_dream_history"].get(user_id, []):
            if history_entry["event_id"] == event_id:
                history_entry["status"] = "completed"
                history_entry["completion_time"] = datetime.now().isoformat()
                break
        
        self.save_user_data()
        
        return True, f"Dream event '{event_info['name']}' completed successfully!", result
    
    def get_user_dream_buffs(self, user_id: str) -> List[Dict]:
        """Get user's active dream buffs"""
        buffs = self.user_dreams.get("dream_buffs", {}).get(user_id, [])
        active_buffs = []
        
        now = datetime.now()
        for buff in buffs:
            expiry = datetime.fromisoformat(buff["expires"])
            if now < expiry:
                buff["time_remaining_hours"] = int((expiry - now).total_seconds() / 3600)
                active_buffs.append(buff)
        
        # Clean up expired buffs
        self.user_dreams["dream_buffs"][user_id] = active_buffs
        if not active_buffs and user_id in self.user_dreams["dream_buffs"]:
            del self.user_dreams["dream_buffs"][user_id]
        
        return active_buffs
    
    def get_user_dream_summary(self, user_id: str) -> Dict:
        """Get user's dream event summary"""
        active_events = self.get_active_dream_events(user_id)
        active_buffs = self.get_user_dream_buffs(user_id)
        
        today = datetime.now().strftime("%Y-%m-%d")
        daily_count = self.user_dreams.get("daily_event_counts", {}).get(user_id, {}).get(today, 0)
        max_daily = self.dream_data["event_settings"].get("max_daily_events", 5)
        
        total_events = len(self.user_dreams.get("user_dream_history", {}).get(user_id, []))
        
        return {
            "active_events": active_events,
            "active_buffs": active_buffs,
            "daily_events": daily_count,
            "max_daily_events": max_daily,
            "total_dream_events": total_events,
            "on_cooldown": self.is_user_on_cooldown(user_id)
        }
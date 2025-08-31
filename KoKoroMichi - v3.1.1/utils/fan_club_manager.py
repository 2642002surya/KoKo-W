import json
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

class FanClubManager:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), '../data/fan_clubs.json')
        self.user_data_file = os.path.join(os.path.dirname(__file__), '../data/user_fan_clubs.json')
        
        self.club_data = self.load_club_data()
        self.user_clubs = self.load_user_data()
    
    def load_club_data(self) -> Dict:
        """Load fan club definitions"""
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"club_settings": {}, "active_polls": {}, "fan_clubs": {}, "voting_categories": []}
    
    def load_user_data(self) -> Dict:
        """Load user fan club data"""
        try:
            with open(self.user_data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"user_memberships": {}, "user_votes": {}, "club_contributions": {}}
    
    def save_club_data(self):
        """Save club data"""
        with open(self.data_file, 'w') as f:
            json.dump(self.club_data, f, indent=2)
    
    def save_user_data(self):
        """Save user club data"""
        with open(self.user_data_file, 'w') as f:
            json.dump(self.user_clubs, f, indent=2)
    
    def join_fan_club(self, user_id: str, club_id: str) -> Tuple[bool, str, Dict]:
        """Join a fan club"""
        if club_id not in self.club_data["fan_clubs"]:
            return False, "Fan club not found!", {}
        
        # Check max clubs per user
        user_memberships = self.user_clubs.get("user_memberships", {}).get(user_id, [])
        max_clubs = self.club_data["club_settings"].get("max_clubs_per_user", 3)
        
        if len(user_memberships) >= max_clubs:
            return False, f"You can only join {max_clubs} fan clubs!", {}
        
        if club_id in user_memberships:
            return False, "You're already a member of this fan club!", {}
        
        # Add user to club
        club = self.club_data["fan_clubs"][club_id]
        if user_id not in club["members"]:
            club["members"].append(user_id)
        
        # Add club to user's memberships
        if "user_memberships" not in self.user_clubs:
            self.user_clubs["user_memberships"] = {}
        if user_id not in self.user_clubs["user_memberships"]:
            self.user_clubs["user_memberships"][user_id] = []
        
        self.user_clubs["user_memberships"][user_id].append(club_id)
        
        # Save changes
        self.save_club_data()
        self.save_user_data()
        
        return True, f"Successfully joined {club['name']}!", {
            "club_name": club["name"],
            "club_description": club["description"],
            "member_count": len(club["members"]),
            "weekly_rewards": club["weekly_rewards"]
        }
    
    def leave_fan_club(self, user_id: str, club_id: str) -> Tuple[bool, str]:
        """Leave a fan club"""
        user_memberships = self.user_clubs.get("user_memberships", {}).get(user_id, [])
        
        if club_id not in user_memberships:
            return False, "You're not a member of this fan club!"
        
        # Remove from club
        if club_id in self.club_data["fan_clubs"]:
            club = self.club_data["fan_clubs"][club_id]
            if user_id in club["members"]:
                club["members"].remove(user_id)
        
        # Remove from user's memberships
        self.user_clubs["user_memberships"][user_id].remove(club_id)
        
        self.save_club_data()
        self.save_user_data()
        
        return True, f"Left the fan club successfully!"
    
    def get_available_clubs(self) -> List[Dict]:
        """Get all available fan clubs"""
        clubs = []
        
        for club_id, club_data in self.club_data["fan_clubs"].items():
            club_info = {
                "club_id": club_id,
                "name": club_data["name"],
                "description": club_data["description"],
                "waifu_focus": club_data.get("waifu_focus", "general"),
                "member_count": len(club_data.get("members", [])),
                "club_level": club_data.get("club_level", 1),
                "weekly_rewards": club_data.get("weekly_rewards", {})
            }
            clubs.append(club_info)
        
        return clubs
    
    def get_user_clubs(self, user_id: str) -> List[Dict]:
        """Get user's fan club memberships"""
        user_memberships = self.user_clubs.get("user_memberships", {}).get(user_id, [])
        user_club_data = []
        
        for club_id in user_memberships:
            if club_id in self.club_data["fan_clubs"]:
                club = self.club_data["fan_clubs"][club_id]
                club_info = {
                    "club_id": club_id,
                    "name": club["name"],
                    "description": club["description"],
                    "waifu_focus": club.get("waifu_focus", "general"),
                    "member_count": len(club.get("members", [])),
                    "club_level": club.get("club_level", 1),
                    "weekly_rewards": club.get("weekly_rewards", {}),
                    "contribution_level": self.get_user_contribution_level(user_id, club_id)
                }
                user_club_data.append(club_info)
        
        return user_club_data
    
    def contribute_to_club(self, user_id: str, club_id: str, contribution_type: str, amount: int) -> Tuple[bool, str, Dict]:
        """Make a contribution to a fan club"""
        user_memberships = self.user_clubs.get("user_memberships", {}).get(user_id, [])
        
        if club_id not in user_memberships:
            return False, "You must be a member to contribute to this club!", {}
        
        if club_id not in self.club_data["fan_clubs"]:
            return False, "Fan club not found!", {}
        
        club = self.club_data["fan_clubs"][club_id]
        
        # Track user contributions
        if "club_contributions" not in self.user_clubs:
            self.user_clubs["club_contributions"] = {}
        if user_id not in self.user_clubs["club_contributions"]:
            self.user_clubs["club_contributions"][user_id] = {}
        if club_id not in self.user_clubs["club_contributions"][user_id]:
            self.user_clubs["club_contributions"][user_id][club_id] = {
                "total_contributed": 0,
                "contribution_history": []
            }
        
        # Add contribution
        contribution_entry = {
            "type": contribution_type,
            "amount": amount,
            "timestamp": datetime.now().isoformat()
        }
        
        self.user_clubs["club_contributions"][user_id][club_id]["contribution_history"].append(contribution_entry)
        self.user_clubs["club_contributions"][user_id][club_id]["total_contributed"] += amount
        
        # Update club totals
        club["total_contributions"] = club.get("total_contributions", 0) + amount
        
        # Check for level up
        level_up_threshold = 10000 * club["club_level"]
        if club["total_contributions"] >= level_up_threshold:
            club["club_level"] += 1
            level_up = True
        else:
            level_up = False
        
        self.save_club_data()
        self.save_user_data()
        
        result = {
            "contribution_amount": amount,
            "contribution_type": contribution_type,
            "club_total": club["total_contributions"],
            "club_level": club["club_level"],
            "level_up": level_up
        }
        
        return True, f"Contributed {amount} {contribution_type} to {club['name']}!", result
    
    def get_user_contribution_level(self, user_id: str, club_id: str) -> str:
        """Get user's contribution level in a club"""
        contributions = self.user_clubs.get("club_contributions", {}).get(user_id, {}).get(club_id, {})
        total = contributions.get("total_contributed", 0)
        
        if total >= 10000:
            return "legend"
        elif total >= 5000:
            return "champion"
        elif total >= 1000:
            return "supporter"
        elif total >= 100:
            return "member"
        else:
            return "newcomer"
    
    def create_community_poll(self, poll_category: str, question: str, options: List[str], duration_hours: int = 48) -> Tuple[bool, str, Dict]:
        """Create a community voting poll"""
        # Find category
        category_data = None
        for category in self.club_data["voting_categories"]:
            if category["id"] == poll_category:
                category_data = category
                break
        
        if not category_data:
            return False, "Invalid poll category!", {}
        
        poll_id = f"{poll_category}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        poll_data = {
            "poll_id": poll_id,
            "category": poll_category,
            "question": question,
            "options": options,
            "votes": {option: 0 for option in options},
            "voters": [],
            "created_time": datetime.now().isoformat(),
            "end_time": (datetime.now() + timedelta(hours=duration_hours)).isoformat(),
            "status": "active"
        }
        
        self.club_data["active_polls"][poll_id] = poll_data
        self.save_club_data()
        
        return True, f"Community poll created: {question}", poll_data
    
    def vote_in_poll(self, user_id: str, poll_id: str, option: str) -> Tuple[bool, str, Dict]:
        """Cast a vote in a community poll"""
        if poll_id not in self.club_data["active_polls"]:
            return False, "Poll not found!", {}
        
        poll = self.club_data["active_polls"][poll_id]
        
        # Check if poll is still active
        end_time = datetime.fromisoformat(poll["end_time"])
        if datetime.now() > end_time:
            poll["status"] = "ended"
            return False, "This poll has ended!", {}
        
        # Check if user already voted
        if user_id in poll["voters"]:
            return False, "You have already voted in this poll!", {}
        
        # Check if option is valid
        if option not in poll["options"]:
            return False, f"Invalid option! Choose from: {', '.join(poll['options'])}", {}
        
        # Cast vote
        poll["votes"][option] += 1
        poll["voters"].append(user_id)
        
        # Track user vote
        if "user_votes" not in self.user_clubs:
            self.user_clubs["user_votes"] = {}
        if user_id not in self.user_clubs["user_votes"]:
            self.user_clubs["user_votes"][user_id] = []
        
        vote_record = {
            "poll_id": poll_id,
            "option": option,
            "timestamp": datetime.now().isoformat()
        }
        self.user_clubs["user_votes"][user_id].append(vote_record)
        
        self.save_club_data()
        self.save_user_data()
        
        result = {
            "poll_question": poll["question"],
            "voted_option": option,
            "current_votes": dict(poll["votes"]),
            "total_voters": len(poll["voters"])
        }
        
        return True, f"Vote cast for '{option}'!", result
    
    def get_active_polls(self) -> List[Dict]:
        """Get all active community polls"""
        active_polls = []
        
        for poll_id, poll_data in self.club_data["active_polls"].items():
            end_time = datetime.fromisoformat(poll_data["end_time"])
            
            if datetime.now() <= end_time and poll_data["status"] == "active":
                poll_info = {
                    "poll_id": poll_id,
                    "question": poll_data["question"],
                    "options": poll_data["options"],
                    "votes": dict(poll_data["votes"]),
                    "total_voters": len(poll_data["voters"]),
                    "time_remaining_hours": int((end_time - datetime.now()).total_seconds() / 3600),
                    "category": poll_data["category"]
                }
                active_polls.append(poll_info)
            elif poll_data["status"] == "active":
                # Mark as ended
                poll_data["status"] = "ended"
        
        # Save any status changes
        self.save_club_data()
        
        return active_polls
    
    def collect_weekly_rewards(self, user_id: str) -> Tuple[bool, str, Dict]:
        """Collect weekly rewards from fan clubs"""
        user_memberships = self.user_clubs.get("user_memberships", {}).get(user_id, [])
        
        if not user_memberships:
            return False, "You're not a member of any fan clubs!", {}
        
        total_rewards = {"gold": 0, "items": []}
        
        for club_id in user_memberships:
            if club_id in self.club_data["fan_clubs"]:
                club = self.club_data["fan_clubs"][club_id]
                weekly_rewards = club.get("weekly_rewards", {})
                
                if "gold" in weekly_rewards:
                    total_rewards["gold"] += weekly_rewards["gold"]
                
                if "items" in weekly_rewards:
                    total_rewards["items"].extend(weekly_rewards["items"])
        
        if total_rewards["gold"] == 0 and not total_rewards["items"]:
            return False, "No rewards available this week!", {}
        
        return True, "Weekly fan club rewards collected!", total_rewards
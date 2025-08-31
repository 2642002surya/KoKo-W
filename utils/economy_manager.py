import json
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

class EconomyManager:
    def __init__(self):
        self.investments_file = os.path.join(os.path.dirname(__file__), '../data/investments.json')
        self.auctions_file = os.path.join(os.path.dirname(__file__), '../data/auctions.json')
        self.user_investments_file = os.path.join(os.path.dirname(__file__), '../data/user_investments.json')
        self.user_auctions_file = os.path.join(os.path.dirname(__file__), '../data/user_auctions.json')
        
        self.investment_data = self.load_investment_data()
        self.auction_data = self.load_auction_data()
        self.user_investments = self.load_user_investments()
        self.user_auctions = self.load_user_auctions()
    
    def load_investment_data(self) -> Dict:
        """Load investment types and business events"""
        try:
            with open(self.investments_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"investment_types": {}, "business_events": []}
    
    def load_auction_data(self) -> Dict:
        """Load auction settings and item data"""
        try:
            with open(self.auctions_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"auction_settings": {}, "auctionable_items": {}}
    
    def load_user_investments(self) -> Dict:
        """Load user investment portfolios"""
        try:
            with open(self.user_investments_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"user_businesses": {}, "daily_income": {}, "business_events": {}}
    
    def load_user_auctions(self) -> Dict:
        """Load active auctions and user auction history"""
        try:
            with open(self.user_auctions_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"active_auctions": {}, "auction_history": {}, "user_bids": {}}
    
    def save_user_investments(self):
        """Save investment data"""
        with open(self.user_investments_file, 'w') as f:
            json.dump(self.user_investments, f, indent=2)
    
    def save_user_auctions(self):
        """Save auction data"""
        with open(self.user_auctions_file, 'w') as f:
            json.dump(self.user_auctions, f, indent=2)
    
    def purchase_business(self, user_id: str, business_type: str, user_gold: int, user_stats: Dict) -> Tuple[bool, str, Dict]:
        """Purchase a new business investment"""
        if business_type not in self.investment_data["investment_types"]:
            return False, "Invalid business type!", {}
        
        business_info = self.investment_data["investment_types"][business_type]
        
        # Check requirements
        requirements = business_info.get("requirements", {})
        if not self.meets_business_requirements(requirements, user_stats):
            return False, f"You don't meet the requirements for {business_info['name']}!", requirements
        
        # Check cost
        if user_gold < business_info["initial_cost"]:
            return False, f"Not enough gold! Need {business_info['initial_cost']}, have {user_gold}", {}
        
        # Check if user already owns this type
        if user_id not in self.user_investments["user_businesses"]:
            self.user_investments["user_businesses"][user_id] = {}
        
        if business_type in self.user_investments["user_businesses"][user_id]:
            return False, "You already own this type of business!", {}
        
        # Purchase business
        business_instance = {
            "type": business_type,
            "name": business_info["name"],
            "level": 1,
            "purchase_date": datetime.now().isoformat(),
            "total_income": 0,
            "daily_income": business_info["daily_income"],
            "special_bonuses": business_info.get("special_bonus", {}),
            "last_collected": datetime.now().isoformat(),
            "active_events": []
        }
        
        self.user_investments["user_businesses"][user_id][business_type] = business_instance
        self.save_user_investments()
        
        return True, f"Successfully purchased {business_info['name']}!", {
            "business": business_instance,
            "cost": business_info["initial_cost"]
        }
    
    def meets_business_requirements(self, requirements: Dict, user_stats: Dict) -> bool:
        """Check if user meets business purchase requirements"""
        for req_type, req_value in requirements.items():
            if req_type == "min_waifus":
                if len(user_stats.get("claimed_waifus", [])) < req_value:
                    return False
            elif req_type == "min_affinity_total":
                total_affinity = sum(user_stats.get("waifu_stats", {}).values())
                if total_affinity < req_value:
                    return False
            elif req_type == "min_battle_wins":
                if user_stats.get("battles_won", 0) < req_value:
                    return False
            elif req_type == "min_level_total":
                total_level = sum(w.get("level", 1) for w in user_stats.get("waifu_stats", {}).values())
                if total_level < req_value:
                    return False
        
        return True
    
    def collect_business_income(self, user_id: str) -> Tuple[int, List[str]]:
        """Collect accumulated income from all businesses"""
        if user_id not in self.user_investments["user_businesses"]:
            return 0, []
        
        total_income = 0
        income_details = []
        
        for business_type, business in self.user_investments["user_businesses"][user_id].items():
            # Calculate time since last collection
            last_collected = datetime.fromisoformat(business["last_collected"])
            hours_passed = (datetime.now() - last_collected).total_seconds() / 3600
            
            # Calculate income (max 24 hours)
            hours_to_collect = min(hours_passed, 24)
            daily_income = business["daily_income"]
            income_amount = int((daily_income / 24) * hours_to_collect)
            
            # Apply business events
            event_multiplier = self.get_business_event_multiplier(user_id, business_type)
            income_amount = int(income_amount * event_multiplier)
            
            total_income += income_amount
            business["total_income"] += income_amount
            business["last_collected"] = datetime.now().isoformat()
            
            income_details.append(f"{business['name']}: {income_amount} gold")
        
        self.save_user_investments()
        return total_income, income_details
    
    def get_business_event_multiplier(self, user_id: str, business_type: str) -> float:
        """Get active event multiplier for business"""
        business = self.user_investments["user_businesses"][user_id][business_type]
        
        multiplier = 1.0
        active_events = business.get("active_events", [])
        
        for event in active_events:
            end_time = datetime.fromisoformat(event["end_time"])
            if datetime.now() <= end_time:
                multiplier *= event.get("income_multiplier", 1.0)
            else:
                # Remove expired event
                active_events.remove(event)
        
        return multiplier
    
    def trigger_business_events(self) -> List[Dict]:
        """Check for and trigger random business events"""
        triggered_events = []
        
        for event_template in self.investment_data["business_events"]:
            if random.random() < event_template["chance"]:
                # Event triggered - apply to random users
                for user_id, businesses in self.user_investments["user_businesses"].items():
                    for business_type, business in businesses.items():
                        event_instance = {
                            "name": event_template["name"],
                            "description": event_template["description"],
                            "start_time": datetime.now().isoformat(),
                            "end_time": (datetime.now() + timedelta(days=event_template["duration_days"])).isoformat(),
                            "effects": event_template["effects"]
                        }
                        
                        business.setdefault("active_events", []).append(event_instance)
                        triggered_events.append({
                            "event": event_template,
                            "affected_users": len(self.user_investments["user_businesses"])
                        })
        
        if triggered_events:
            self.save_user_investments()
        
        return triggered_events
    
    def create_auction(self, user_id: str, item_type: str, item_name: str, starting_bid: int, duration_hours: int = 24) -> Tuple[bool, str, Dict]:
        """Create a new auction listing"""
        settings = self.auction_data["auction_settings"]
        
        # Validate starting bid
        if starting_bid < settings.get("min_bid", 100):
            return False, f"Starting bid too low! Minimum: {settings['min_bid']}", {}
        
        # Check user's active auction limit
        user_auctions = [a for a in self.user_auctions["active_auctions"].values() if a["seller_id"] == user_id]
        if len(user_auctions) >= settings.get("max_active_auctions", 5):
            return False, f"Maximum {settings['max_active_auctions']} active auctions allowed!", {}
        
        # Create auction
        auction_id = f"auction_{len(self.user_auctions['active_auctions'])}_{datetime.now().timestamp()}"
        
        auction = {
            "auction_id": auction_id,
            "seller_id": user_id,
            "item_type": item_type,
            "item_name": item_name,
            "starting_bid": starting_bid,
            "current_bid": starting_bid,
            "current_bidder": None,
            "bid_history": [],
            "start_time": datetime.now().isoformat(),
            "end_time": (datetime.now() + timedelta(hours=duration_hours)).isoformat(),
            "status": "active"
        }
        
        self.user_auctions["active_auctions"][auction_id] = auction
        self.save_user_auctions()
        
        return True, f"Auction created for {item_name}!", {"auction_id": auction_id, "auction": auction}
    
    def place_bid(self, user_id: str, auction_id: str, bid_amount: int) -> Tuple[bool, str, Dict]:
        """Place a bid on an auction"""
        if auction_id not in self.user_auctions["active_auctions"]:
            return False, "Auction not found!", {}
        
        auction = self.user_auctions["active_auctions"][auction_id]
        
        # Check if auction is still active
        end_time = datetime.fromisoformat(auction["end_time"])
        if datetime.now() > end_time:
            return False, "Auction has ended!", {}
        
        # Check if user is the seller
        if auction["seller_id"] == user_id:
            return False, "You can't bid on your own auction!", {}
        
        # Check bid amount
        settings = self.auction_data["auction_settings"]
        min_bid = auction["current_bid"] + settings.get("bid_increment", 50)
        
        if bid_amount < min_bid:
            return False, f"Bid too low! Minimum: {min_bid}", {}
        
        # Place bid
        previous_bidder = auction["current_bidder"]
        auction["current_bid"] = bid_amount
        auction["current_bidder"] = user_id
        auction["bid_history"].append({
            "bidder_id": user_id,
            "amount": bid_amount,
            "timestamp": datetime.now().isoformat()
        })
        
        # Auto-extend if bid placed near end
        time_remaining = (end_time - datetime.now()).total_seconds() / 60
        auto_extend_minutes = settings.get("auto_extend_minutes", 10)
        
        if time_remaining < auto_extend_minutes:
            new_end_time = datetime.now() + timedelta(minutes=auto_extend_minutes)
            auction["end_time"] = new_end_time.isoformat()
        
        self.save_user_auctions()
        
        return True, f"Bid placed successfully! Current bid: {bid_amount}", {
            "previous_bidder": previous_bidder,
            "new_bid": bid_amount,
            "time_remaining": int(time_remaining)
        }
    
    def complete_auction(self, auction_id: str) -> Tuple[bool, str, Dict]:
        """Complete an auction and transfer items"""
        if auction_id not in self.user_auctions["active_auctions"]:
            return False, "Auction not found!", {}
        
        auction = self.user_auctions["active_auctions"][auction_id]
        
        # Check if auction has ended
        end_time = datetime.fromisoformat(auction["end_time"])
        if datetime.now() <= end_time:
            return False, "Auction is still active!", {}
        
        # Complete auction
        auction["status"] = "completed"
        auction["completion_time"] = datetime.now().isoformat()
        
        result = {
            "seller_id": auction["seller_id"],
            "winner_id": auction["current_bidder"],
            "final_price": auction["current_bid"],
            "item": auction["item_name"]
        }
        
        # Move to history
        if auction_id not in self.user_auctions["auction_history"]:
            self.user_auctions["auction_history"][auction_id] = auction
        
        # Remove from active auctions
        del self.user_auctions["active_auctions"][auction_id]
        self.save_user_auctions()
        
        return True, "Auction completed!", result
    
    def get_user_business_summary(self, user_id: str) -> Dict:
        """Get summary of user's business investments"""
        if user_id not in self.user_investments["user_businesses"]:
            return {"businesses": [], "total_daily_income": 0, "total_income_earned": 0}
        
        businesses = []
        total_daily = 0
        total_earned = 0
        
        for business_type, business in self.user_investments["user_businesses"][user_id].items():
            businesses.append({
                "name": business["name"],
                "type": business_type,
                "level": business["level"],
                "daily_income": business["daily_income"],
                "total_earned": business["total_income"],
                "active_events": len(business.get("active_events", []))
            })
            
            total_daily += business["daily_income"]
            total_earned += business["total_income"]
        
        return {
            "businesses": businesses,
            "total_daily_income": total_daily,
            "total_income_earned": total_earned
        }
"""
Enhanced Store Manager with Dynamic Pricing, VIP System, and Limited-Time Items
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any

class EnhancedStoreManager:
    def __init__(self, store_file: str = "store/store_items.json", users_file: str = "data/users.json"):
        self.store_file = store_file
        self.users_file = users_file
        self.store_data = self.load_store_data()
        self.daily_purchases = {}  # Track daily purchases for dynamic pricing
        
    def load_store_data(self) -> dict:
        """Load store data from JSON file"""
        if os.path.exists(self.store_file):
            try:
                with open(self.store_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading store data: {e}")
        return {"items": [], "price_mechanics": {}, "vip_system": {}, "auction_system": {}}
    
    def save_store_data(self):
        """Save store data to JSON file"""
        try:
            with open(self.store_file, 'w', encoding='utf-8') as f:
                json.dump(self.store_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving store data: {e}")
    
    def load_users(self) -> dict:
        """Load user data"""
        if os.path.exists(self.users_file):
            try:
                with open(self.users_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return {}
        return {}
    
    def save_users(self, users_data: dict):
        """Save user data"""
        try:
            with open(self.users_file, 'w', encoding='utf-8') as f:
                json.dump(users_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving user data: {e}")
    
    def is_user_vip(self, user_id: str) -> bool:
        """Check if user has VIP status"""
        users = self.load_users()
        user_data = users.get(str(user_id), {})
        return user_data.get("vip", False)
    
    def get_current_price(self, item_name: str, user_id: Optional[str] = None) -> Tuple[int, str]:
        """Get current price for an item with dynamic pricing and VIP discounts"""
        items = self.store_data.get("items", [])
        item_data = None
        
        for item in items:
            if item["name"] == item_name:
                item_data = item
                break
        
        if not item_data:
            return 0, "Item not found"
        
        base_price = item_data["base_price"]
        
        # Apply dynamic pricing based on daily purchases
        price_mechanics = self.store_data.get("price_mechanics", {})
        if price_mechanics.get("dynamic_pricing", True):
            daily_purchases = self.daily_purchases.get(item_name, 0)
            increase_per_purchase = price_mechanics.get("base_increase_per_purchase", 0.05)
            max_multiplier = price_mechanics.get("max_price_multiplier", 3.0)
            
            price_multiplier = min(max_multiplier, 1.0 + (daily_purchases * increase_per_purchase))
            current_price = int(base_price * price_multiplier)
        else:
            current_price = base_price
        
        # Apply VIP discount
        vip_discount = 0.0
        if user_id and self.is_user_vip(user_id):
            vip_discount = item_data.get("vip_discount", 0.0)
            current_price = int(current_price * (1.0 - vip_discount))
        
        price_info = f"Base: {base_price:,}"
        if vip_discount > 0:
            price_info += f" (VIP -{vip_discount*100:.0f}%)"
        
        return current_price, price_info
    
    def is_item_available(self, item_name: str) -> Tuple[bool, str]:
        """Check if item is currently available (stock and time limits)"""
        items = self.store_data.get("items", [])
        item_data = None
        
        for item in items:
            if item["name"] == item_name:
                item_data = item
                break
        
        if not item_data:
            return False, "Item not found"
        
        # Check stock
        stock = item_data.get("stock", -1)
        if stock == 0:
            return False, "Out of stock"
        
        # Check time limits
        if item_data.get("limited_time", False):
            now = datetime.now()
            spawn_start = item_data.get("spawn_start")
            spawn_end = item_data.get("spawn_end")
            
            if spawn_start:
                start_time = datetime.fromisoformat(spawn_start)
                if now < start_time:
                    return False, f"Not available until {start_time.strftime('%Y-%m-%d %H:%M')}"
            
            if spawn_end:
                end_time = datetime.fromisoformat(spawn_end)
                if now > end_time:
                    return False, "Limited-time offer has expired"
        
        return True, "Available"
    
    def get_available_items(self, user_id: Optional[str] = None, include_vip_only: bool = False) -> List[Dict[str, Any]]:
        """Get all currently available items with pricing"""
        available_items = []
        is_vip = user_id and self.is_user_vip(user_id)
        
        for item in self.store_data.get("items", []):
            available, reason = self.is_item_available(item["name"])
            
            if not available:
                continue
            
            # Check VIP exclusive items
            if item.get("vip_only", False) and not is_vip:
                continue
            
            current_price, price_info = self.get_current_price(item["name"], user_id)
            
            item_info = item.copy()
            item_info["current_price"] = current_price
            item_info["price_info"] = price_info
            item_info["is_vip"] = is_vip
            
            # Add time remaining for limited items
            if item.get("limited_time", False):
                spawn_end = item.get("spawn_end")
                if spawn_end:
                    end_time = datetime.fromisoformat(spawn_end)
                    time_remaining = end_time - datetime.now()
                    if time_remaining.total_seconds() > 0:
                        hours = int(time_remaining.total_seconds() // 3600)
                        minutes = int((time_remaining.total_seconds() % 3600) // 60)
                        item_info["time_remaining"] = f"{hours}h {minutes}m"
            
            available_items.append(item_info)
        
        return available_items
    
    def purchase_item(self, user_id: str, item_name: str, quantity: int = 1) -> Tuple[bool, str, Dict[str, Any]]:
        """Attempt to purchase an item"""
        user_id = str(user_id)
        
        # Check if item is available
        available, reason = self.is_item_available(item_name)
        if not available:
            return False, reason, {}
        
        # Get current price
        current_price, price_info = self.get_current_price(item_name, user_id)
        total_cost = current_price * quantity
        
        # Load user data
        users = self.load_users()
        user_data = users.get(user_id, {})
        user_gold = user_data.get("gold", 0)
        
        if user_gold < total_cost:
            return False, f"Insufficient gold! Need {total_cost:,}, have {user_gold:,}", {}
        
        # Find item data
        items = self.store_data.get("items", [])
        item_data = None
        for item in items:
            if item["name"] == item_name:
                item_data = item
                break
        
        if not item_data:
            return False, "Item not found in store data", {}
        
        # Check and update stock
        stock = item_data.get("stock", -1)
        if stock > 0:
            if stock < quantity:
                return False, f"Insufficient stock! Only {stock} available", {}
            item_data["stock"] = stock - quantity
        
        # Update user gold
        user_data["gold"] = user_gold - total_cost
        users[user_id] = user_data
        self.save_users(users)
        
        # Update daily purchases for dynamic pricing
        self.daily_purchases[item_name] = self.daily_purchases.get(item_name, 0) + quantity
        
        # Add item to user inventory (this would need inventory system integration)
        purchase_info = {
            "item_name": item_name,
            "quantity": quantity,
            "unit_price": current_price,
            "total_cost": total_cost,
            "remaining_gold": user_data["gold"],
            "item_type": item_data["type"],
            "description": item_data["description"]
        }
        
        # Save updated store data
        self.save_store_data()
        
        return True, f"Successfully purchased {quantity}x {item_name} for {total_cost:,} gold!", purchase_info
    
    def reset_daily_prices(self):
        """Reset daily purchases (called at daily reset time)"""
        self.daily_purchases = {}
        
        # Reset limited stock items if configured
        reset_time = self.store_data.get("price_mechanics", {}).get("daily_reset_time", "05:30:00")
        print(f"Daily store reset completed at {datetime.now().strftime('%H:%M:%S')}")
    
    def add_limited_time_item(self, item_data: dict) -> bool:
        """Add a new limited-time item to the store"""
        try:
            items = self.store_data.get("items", [])
            
            # Check if item already exists
            for existing_item in items:
                if existing_item["name"] == item_data["name"]:
                    # Update existing item
                    existing_item.update(item_data)
                    self.save_store_data()
                    return True
            
            # Add new item
            items.append(item_data)
            self.store_data["items"] = items
            self.save_store_data()
            return True
            
        except Exception as e:
            print(f"Error adding limited-time item: {e}")
            return False
    
    def remove_expired_items(self):
        """Remove expired limited-time items"""
        items = self.store_data.get("items", [])
        current_items = []
        removed_count = 0
        
        for item in items:
            if item.get("limited_time", False):
                spawn_end = item.get("spawn_end")
                if spawn_end:
                    end_time = datetime.fromisoformat(spawn_end)
                    if datetime.now() > end_time:
                        removed_count += 1
                        continue
            
            current_items.append(item)
        
        if removed_count > 0:
            self.store_data["items"] = current_items
            self.save_store_data()
            print(f"Removed {removed_count} expired items from store")
    
    def get_store_statistics(self) -> Dict[str, Any]:
        """Get store statistics for admin/debugging"""
        stats = {
            "total_items": len(self.store_data.get("items", [])),
            "limited_time_items": 0,
            "out_of_stock_items": 0,
            "daily_purchases": self.daily_purchases.copy(),
            "vip_enabled": self.store_data.get("vip_system", {}).get("enabled", False)
        }
        
        for item in self.store_data.get("items", []):
            if item.get("limited_time", False):
                stats["limited_time_items"] += 1
            
            stock = item.get("stock", -1)
            if stock == 0:
                stats["out_of_stock_items"] += 1
        
        return stats
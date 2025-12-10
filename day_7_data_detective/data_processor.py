#!/usr/bin/env python3
"""
Lost & Found Data Detective - Data Processor
Transforms chaotic lost & found data into organized, structured JSON
"""

import re
import json
from datetime import datetime
from typing import List, Dict, Any
from difflib import SequenceMatcher

class LostFoundDetective:
    def __init__(self):
        self.categories = {
            'Electronics': ['iphone', 'phone', 'macbook', 'laptop', 'ipad', 'tablet', 'airpods', 'headphones', 
                          'charger', 'camera', 'fitbit', 'watch'],
            'Keys & Wallets': ['keys', 'key', 'wallet', 'purse'],
            'Clothing': ['scarf', 'mitten', 'mittens', 'glove', 'gloves', 'hat', 'beanie', 'jacket', 'coat', 'boots'],
            'Accessories': ['glasses', 'sunglasses', 'bracelet', 'ring', 'bag', 'backpack', 'umbrella'],
            'Personal Items': ['teddy', 'stuffed', 'water bottle'],
            'Other': []
        }
        
        self.urgency_keywords = {
            'high': ['urgent', 'keys', 'wallet', 'phone', 'iphone', 'macbook', 'laptop', 'ipad', 'camera', 'id'],
            'medium': ['glasses', 'ring', 'bracelet', 'watch'],
            'low': ['scarf', 'hat', 'mitten', 'glove', 'jacket']
        }
        
        self.location_map = {
            'ice rink': 'Ice Skating Area',
            'ice skating area': 'Ice Skating Area', 
            'skating rink': 'Ice Skating Area',
            'skating area': 'Ice Skating Area',
            'hot cocoa stand': 'Hot Cocoa Stand',
            'cocoa booth': 'Hot Cocoa Stand',
            'cocoa stand': 'Hot Cocoa Stand',
            'storytelling tent': 'Storytelling Tent',
            'story tent': 'Storytelling Tent',
            'story area': 'Storytelling Tent',
            'fortune teller tent': 'Fortune Teller Tent',
            'fortune tent': 'Fortune Teller Tent',
            'fortune ten': 'Fortune Teller Tent',  # typo in data
            'parking lot': 'Parking Area',
            'parking area': 'Parking Area',
            'parking': 'Parking Area'
        }

    def normalize_location(self, location: str) -> str:
        """Standardize location names"""
        location_lower = location.lower().strip()
        return self.location_map.get(location_lower, location.title())

    def categorize_item(self, item_description: str) -> str:
        """Categorize items based on keywords"""
        item_lower = item_description.lower()
        
        for category, keywords in self.categories.items():
            if any(keyword in item_lower for keyword in keywords):
                return category
        
        return 'Other'

    def assess_urgency(self, item_description: str, original_text: str = "") -> str:
        """Assess urgency level based on item type and keywords"""
        text = (item_description + " " + original_text).lower()
        
        # Check for explicit urgency markers
        if any(marker in text for marker in ['urgent', 'very urgent']):
            return 'high'
        
        # Check urgency by item type
        for urgency, keywords in self.urgency_keywords.items():
            if any(keyword in text for keyword in keywords):
                return urgency
        
        return 'low'

    def extract_time(self, text: str) -> str:
        """Extract time information from text"""
        time_patterns = [
            r'(\d{1,2}:\d{2}[ap]m)',
            r'(\d{1,2}[ap]m)',
            r'around (\d{1,2}:\d{2})',
            r'(\d{1,2}:\d{2})'
        ]
        
        for pattern in time_patterns:
            match = re.search(pattern, text.lower())
            if match:
                return match.group(1)
        
        return ""

    def clean_item_description(self, text: str) -> tuple:
        """Clean and extract structured information from raw text"""
        # Remove urgency markers
        text = re.sub(r'\s*-\s*(URGENT|VERY URGENT)!*', '', text, flags=re.IGNORECASE)
        
        # Extract time
        time_found = self.extract_time(text)
        
        # Split on common delimiters
        parts = re.split(r'[,-]|\s+at\s+|\s+near\s+', text)
        parts = [p.strip() for p in parts if p.strip()]
        
        if len(parts) >= 2:
            item = parts[0].strip()
            location = parts[1].strip() if len(parts) > 1 else ""
            
            # Clean up the item description
            item = re.sub(r'\s*\([^)]*\)', '', item)  # Remove parentheses content
            item = re.sub(r'\s+', ' ', item).strip()
            
            return item, location, time_found
        
        return text.strip(), "", time_found

    def similarity(self, a: str, b: str) -> float:
        """Calculate similarity between two strings"""
        return SequenceMatcher(None, a.lower(), b.lower()).ratio()

    def find_potential_matches(self, items: List[Dict]) -> Dict[str, List[str]]:
        """Find potential matches between lost and found items"""
        matches = {}
        
        for i, item1 in enumerate(items):
            potential_matches = []
            
            for j, item2 in enumerate(items):
                if i != j:
                    # Check item similarity
                    item_sim = self.similarity(item1['item'], item2['item'])
                    desc_sim = self.similarity(item1['description'], item2['description'])
                    
                    # Check if locations are the same or nearby
                    location_match = item1['location'] == item2['location']
                    
                    # Higher threshold for matches
                    if (item_sim > 0.7 or desc_sim > 0.6) and location_match:
                        confidence = max(item_sim, desc_sim)
                        if location_match:
                            confidence += 0.2
                        
                        potential_matches.append({
                            'id': item2['id'],
                            'confidence': round(confidence, 2)
                        })
            
            if potential_matches:
                # Sort by confidence and take top matches
                potential_matches.sort(key=lambda x: x['confidence'], reverse=True)
                matches[item1['id']] = [m['id'] for m in potential_matches[:3]]
        
        return matches

    def process_data(self, file_path: str) -> Dict[str, Any]:
        """Process the raw lost & found data file"""
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Split into days
        days = re.split(r'Day \d+ Data:', content)[1:]  # Skip first empty split
        
        all_items = []
        item_id = 1
        
        for day_num, day_content in enumerate(days, 1):
            lines = day_content.strip().split('\n')
            day_title = lines[0] if lines else f"Day {day_num}"
            
            # Skip metadata lines and process actual items
            for line in lines[2:]:  # Skip title and description
                line = line.strip()
                if not line or line.startswith('Day ') or '(' in line and 'items)' in line:
                    continue
                
                # Clean and extract item information
                item, location, time_found = self.clean_item_description(line)
                
                if item:  # Only process if we have a valid item
                    normalized_location = self.normalize_location(location) if location else "Unknown"
                    category = self.categorize_item(item)
                    urgency = self.assess_urgency(item, line)
                    
                    item_data = {
                        'id': f"item_{item_id:03d}",
                        'type': 'found',  # All items in this data are found items
                        'item': item.title(),
                        'description': line.strip(),
                        'category': category,
                        'urgency': urgency,
                        'location': normalized_location,
                        'date': f"Day {day_num}",
                        'time': time_found,
                        'contact': "",
                        'day_title': day_title.strip(),
                        'original_entry': line.strip()
                    }
                    
                    all_items.append(item_data)
                    item_id += 1
        
        # Find potential matches
        potential_matches = self.find_potential_matches(all_items)
        
        # Add potential matches to items
        for item in all_items:
            item['potential_matches'] = potential_matches.get(item['id'], [])
        
        # Generate metadata
        category_counts = {}
        urgency_counts = {'high': 0, 'medium': 0, 'low': 0}
        location_counts = {}
        
        for item in all_items:
            category_counts[item['category']] = category_counts.get(item['category'], 0) + 1
            urgency_counts[item['urgency']] += 1
            location_counts[item['location']] = location_counts.get(item['location'], 0) + 1
        
        return {
            'metadata': {
                'processed_date': datetime.now().isoformat(),
                'total_items': len(all_items),
                'categories': category_counts,
                'urgency_counts': urgency_counts,
                'location_counts': location_counts,
                'potential_matches_found': len([i for i in all_items if i['potential_matches']])
            },
            'items': all_items
        }

def main():
    """Main processing function"""
    detective = LostFoundDetective()
    
    # Process the data file
    input_file = '/Users/fafamodey/fafacodes/projects/advent_of_ai/day_7_data_detective/day1-opening.txt'
    output_file = '/Users/fafamodey/fafacodes/projects/advent_of_ai/day_7_data_detective/lost_and_found_app/data.json'
    
    print("🕵️‍♀️ Lost & Found Data Detective - Processing...")
    
    try:
        processed_data = detective.process_data(input_file)
        
        # Save processed data
        with open(output_file, 'w') as file:
            json.dump(processed_data, file, indent=2)
        
        # Print summary
        metadata = processed_data['metadata']
        print(f"\n✅ Data Processing Complete!")
        print(f"📊 Total Items: {metadata['total_items']}")
        print(f"🏷️  Categories: {', '.join(metadata['categories'].keys())}")
        print(f"🚨 Urgency Breakdown:")
        for urgency, count in metadata['urgency_counts'].items():
            print(f"   {urgency.title()}: {count}")
        print(f"🔗 Potential Matches Found: {metadata['potential_matches_found']}")
        print(f"💾 Data saved to: {output_file}")
        
    except Exception as e:
        print(f"❌ Error processing data: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main()

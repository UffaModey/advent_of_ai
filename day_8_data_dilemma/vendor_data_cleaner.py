#!/usr/bin/env python3
"""
Dmitri's Data Rescue Tool
Transforms hot-cocoa-stained napkin notes into pristine JSON data!
"""

import json
import re
import sys

def clean_vendor_data(input_file):
    """
    Parse the messy vendor list and return clean, structured data
    """
    vendors = []
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the actual vendor lines (skip the decorative box)
    lines = content.split('\n')
    vendor_lines = []
    
    # Find lines that contain vendor data (between the box borders)
    for line in lines:
        # Skip empty lines, box characters, and the stain note
        if (line.strip() and 
            not line.startswith('╔') and 
            not line.startswith('╚') and 
            not line.startswith('╠') and 
            not line.startswith('║  DMITRI') and
            not line.startswith('      ☕') and
            '║' in line):
            
            # Extract content between the box borders
            cleaned_line = line.split('║')[1].strip()
            if cleaned_line and not cleaned_line.startswith('DMITRI'):
                vendor_lines.append(cleaned_line)
    
    # Parse each vendor line
    for line in vendor_lines:
        vendor = parse_vendor_line(line)
        if vendor:
            vendors.append(vendor)
    
    return vendors

def parse_vendor_line(line):
    """
    Parse a single vendor line to extract name, location, and food type
    """
    # Clean up the line
    line = line.strip()
    if not line:
        return None
    
    # Different parsing patterns based on the messy format
    vendor = {
        "id": None,
        "name": "",
        "location": "",
        "food_type": "",
        "description": ""
    }
    
    # Remove extra punctuation and normalize
    line = re.sub(r'[!]{3,}', '!', line)  # Reduce multiple exclamation marks
    line = re.sub(r'\s+', ' ', line)      # Normalize spaces
    
    # Special case for taco truck pattern
    if 'TACO TRUCK DEL FUEGO' in line.upper():
        vendor["name"] = "Taco Truck Del Fuego!"
        vendor["location"] = "north entrance"
        vendor["food_type"] = "Mexican"
    
    # Special case for curry in a hurry
    elif 'curry in a hurry' in line.lower():
        vendor["name"] = "Curry in a Hurry"
        vendor["location"] = "mobile cart (roams around)"
        vendor["food_type"] = "Indian"
    
    # Try to identify patterns in the messy data
    elif ' - ' in line:
        # Pattern: "Name - Location - Food type" or "Name - Location food type"
        parts = line.split(' - ')
        vendor["name"] = clean_name(parts[0])
        
        if len(parts) >= 2:
            # Check if location and food type are combined
            location_food = parts[1]
            if len(parts) == 3:
                vendor["location"] = clean_location(location_food)
                vendor["food_type"] = clean_food_type(parts[2])
            else:
                # Try to split location and food type
                vendor["location"], vendor["food_type"] = split_location_food(location_food)
    
    elif ', ' in line:
        # Pattern with commas
        parts = line.split(', ')
        vendor["name"] = clean_name(parts[0])
        if len(parts) > 1:
            # Everything else is location/food description
            rest = ', '.join(parts[1:])
            vendor["location"], vendor["food_type"] = split_location_food(rest)
    
    else:
        # Single line with embedded info - try to parse
        vendor["name"], vendor["location"], vendor["food_type"] = parse_embedded_info(line)
    
    # Generate a simple ID
    vendor["id"] = generate_vendor_id(vendor["name"])
    
    # Create a nice description
    vendor["description"] = f"{vendor['food_type']} at {vendor['location']}"
    
    return vendor

def clean_name(name):
    """Clean up vendor name"""
    name = name.strip()
    # Title case for consistency, but preserve some character
    if name.isupper() and len(name) > 10:
        name = name.title()
    return name

def clean_location(location):
    """Clean up location description"""
    location = location.strip()
    # Remove food type info if it leaked in
    food_keywords = ['hot drinks', 'mexican food', 'cookies', 'polish food', 'waffles', 'italian', 'pretzels', 'sushi', 'pizza']
    for keyword in food_keywords:
        location = location.replace(keyword, '').strip()
    return location.strip(' .,')

def clean_food_type(food_type):
    """Clean up food type description"""
    food_type = food_type.strip()
    # Normalize common food types
    food_map = {
        'hot drinks & pastries': 'Hot Drinks & Pastries',
        'mexican food': 'Mexican',
        'cookies': 'Cookies & Sweets',
        'polish food': 'Polish',
        'waffles': 'Waffles',
        'italian': 'Italian',
        'pretzels': 'Pretzels',
        'sushi': 'Sushi',
        'pizza slices': 'Pizza'
    }
    
    food_lower = food_type.lower()
    for key, value in food_map.items():
        if key in food_lower:
            return value
    
    return food_type.title()

def split_location_food(text):
    """Try to intelligently split location and food type info"""
    text = text.strip()
    
    # Common food type indicators
    food_indicators = [
        'hot drinks', 'mexican', 'cookies', 'polish', 'waffles', 
        'italian', 'pretzels', 'sushi', 'pizza', 'curry'
    ]
    
    location = ""
    food_type = ""
    
    text_lower = text.lower()
    
    # Look for food indicators
    for indicator in food_indicators:
        if indicator in text_lower:
            # Split at the food indicator
            idx = text_lower.find(indicator)
            if idx > 0:
                location = text[:idx].strip(' .,')
                food_type = text[idx:].strip()
            else:
                food_type = text
            break
    
    if not food_type:
        # If no food type found, treat whole thing as location
        location = text
    
    return clean_location(location), clean_food_type(food_type) if food_type else "Food & Beverages"

def parse_embedded_info(line):
    """Parse lines where all info is embedded together"""
    # This is for tricky cases like "Waffle Wonderland next to storytelling tent WAFFLES"
    
    # Look for all caps words at the end (likely food type)
    words = line.split()
    food_type = ""
    
    # Check if last word is all caps (food type indicator)
    if words and words[-1].isupper() and len(words[-1]) > 3:
        food_type = words[-1]
        line = ' '.join(words[:-1])
    
    # Split remaining into name and location
    # Look for location indicators
    location_indicators = ['next to', 'near', 'at', 'by', 'mobile cart']
    
    name = line
    location = ""
    
    for indicator in location_indicators:
        if indicator in line.lower():
            parts = line.lower().split(indicator, 1)
            name = parts[0].strip()
            location = indicator + ' ' + parts[1].strip() if len(parts) > 1 else ""
            break
    
    return clean_name(name), clean_location(location), clean_food_type(food_type) if food_type else "Food & Beverages"

def generate_vendor_id(name):
    """Generate a simple vendor ID from the name"""
    # Remove special characters and make lowercase
    vendor_id = re.sub(r'[^a-zA-Z0-9\s]', '', name.lower())
    vendor_id = re.sub(r'\s+', '_', vendor_id.strip())
    return vendor_id

def main():
    input_file = 'messy_vendor_list.txt'
    output_file = 'dmitris-definitely-not-a-disaster.json'
    
    print("🚨 DMITRI'S DATA RESCUE OPERATION IN PROGRESS...")
    print("☕ Removing hot cocoa stains...")
    print("📝 Smoothing out napkin wrinkles...")
    print("🧹 Cleaning up the mess...")
    
    try:
        vendors = clean_vendor_data(input_file)
        
        # Create the final data structure
        vendor_data = {
            "metadata": {
                "source": "Dmitri's Napkin Notes (Stain-Free Version)",
                "total_vendors": len(vendors),
                "last_updated": "2025-12-11",
                "status": "Hot cocoa stains successfully removed!"
            },
            "vendors": vendors
        }
        
        # Save to JSON file with silly name
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(vendor_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ SUCCESS! Clean data saved to: {output_file}")
        print(f"🎉 Found {len(vendors)} vendors")
        print("\n📋 Vendor Summary:")
        
        for vendor in vendors:
            print(f"  • {vendor['name']} | {vendor['location']} | {vendor['food_type']}")
        
        return vendor_data
        
    except Exception as e:
        print(f"💥 ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

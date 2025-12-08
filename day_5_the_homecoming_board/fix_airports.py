#!/usr/bin/env python3
"""
Fix airport references in API file
"""

import re

# Read the file
with open('js/utils/api.js', 'r') as f:
    content = f.read()

# Replace the pattern
old_pattern = r"this\.airports\[airportCode\]\?\.name \|\| 'Unknown Airport'"
new_pattern = "this.getAirportInfo(airportCode).name || 'Unknown Airport'"

content = re.sub(old_pattern, new_pattern, content)

# Write the file back
with open('js/utils/api.js', 'w') as f:
    f.write(content)

print("Fixed all airport references!")

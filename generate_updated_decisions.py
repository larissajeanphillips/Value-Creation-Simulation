import json
import re

# Load the Excel data
with open('decisions_full.json', 'r', encoding='utf-8') as f:
    excel_decisions = json.load(f)

# Create a lookup by name
excel_by_name = {}
for d in excel_decisions:
    if d['name']:
        excel_by_name[d['name'].lower().strip()] = d

# Read the current decisions.ts file
with open('backend/config/decisions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# For each decision in the Excel, update the narrative in the TypeScript file
updates_made = 0
for excel_d in excel_decisions:
    name = excel_d['name']
    description = excel_d['description']
    subcategory = excel_d['subcategory']
    
    if not name or not description:
        continue
    
    # Escape special characters for regex
    name_escaped = re.escape(name)
    
    # Pattern to find the decision block by name
    # Looking for: name: 'Decision Name',
    pattern = rf"(name: ')({name_escaped})(',)"
    
    if re.search(pattern, content):
        # Find the narrative for this decision and replace it
        # The narrative comes after the name in the structure
        # We need to find the narrative line that belongs to this decision
        
        # Find position of this name
        name_match = re.search(pattern, content)
        if name_match:
            start_pos = name_match.start()
            # Find the narrative line after this name (within reasonable distance)
            section = content[start_pos:start_pos+2000]
            
            # Find the narrative line
            narrative_pattern = r"(narrative: ')(.*?)(',)"
            narrative_match = re.search(narrative_pattern, section, re.DOTALL)
            
            if narrative_match:
                old_narrative = narrative_match.group(2)
                # Escape single quotes in the new description
                new_description = description.replace("'", "\\'")
                
                # Replace in the section
                new_section = section[:narrative_match.start(2)] + new_description + section[narrative_match.end(2):]
                
                # Update content
                content = content[:start_pos] + new_section + content[start_pos+2000:]
                updates_made += 1
                print(f"Updated: {name}")

print(f"\nTotal updates made: {updates_made}")

# Write the updated file
with open('backend/config/decisions_updated.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved to backend/config/decisions_updated.ts")

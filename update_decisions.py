from openpyxl import load_workbook
import json
import re

file_path = r'C:\Users\Larissa Phillips\Desktop\260127 TSR decisions_v2.8.xlsx'
wb = load_workbook(file_path, data_only=True)
sheet = wb['Decisions']

decisions = []
for row in range(5, 80):  # Rows 5-79 for 75 decisions
    decision_num = sheet[f'U{row}'].value
    if decision_num is None or not isinstance(decision_num, (int, float)):
        continue
    
    lever = sheet[f'V{row}'].value
    value_driver_type = sheet[f'W{row}'].value
    lesson = sheet[f'X{row}'].value
    category = sheet[f'Y{row}'].value
    name = sheet[f'Z{row}'].value
    description = sheet[f'AA{row}'].value
    round_num = sheet[f'AB{row}'].value
    
    decisions.append({
        'excel_id': int(decision_num),
        'lever': lever.lower() if lever else None,
        'value_driver_type': value_driver_type,
        'lesson': lesson,
        'subcategory': category,
        'name': name,
        'description': description,
        'round': int(round_num) if round_num else None
    })

# Print all decisions with full descriptions
print(f"Total decisions: {len(decisions)}\n")
for d in decisions:
    print(f"Decision {d['excel_id']}:")
    print(f"  Lever: {d['lever']}")
    print(f"  Subcategory: {d['subcategory']}")
    print(f"  Name: {d['name']}")
    print(f"  Description: {d['description']}")
    print(f"  Round: {d['round']}")
    print()

# Save full data to JSON
with open('decisions_full.json', 'w', encoding='utf-8') as f:
    json.dump(decisions, f, indent=2, ensure_ascii=False)
print("Saved to decisions_full.json")

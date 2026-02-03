from openpyxl import load_workbook
import json

file_path = r'C:\Users\Larissa Phillips\Desktop\260127 TSR decisions_v2.8.xlsx'
wb = load_workbook(file_path, data_only=True)
sheet = wb['Decisions']

decisions = []
for row in range(5, 80):  # Rows 5-79 for 75 decisions
    decision_num = sheet[f'U{row}'].value
    if decision_num is None or not isinstance(decision_num, (int, float)):
        continue
    
    decisions.append({
        'id': int(decision_num),
        'lever': sheet[f'V{row}'].value,
        'type': sheet[f'W{row}'].value,
        'lesson': sheet[f'X{row}'].value,
        'category': sheet[f'Y{row}'].value,
        'name': sheet[f'Z{row}'].value,
        'description': sheet[f'AA{row}'].value,
        'round': sheet[f'AB{row}'].value
    })

print(f'Total decisions found: {len(decisions)}')
print()
print('=== All decisions ===')
for d in decisions:
    name = d['name'][:50] if d['name'] else 'N/A'
    print(f"{d['id']:2}. [{d['lever']:8}] {name}")

# Save to JSON for later use
with open('decisions_from_excel.json', 'w') as f:
    json.dump(decisions, f, indent=2)
print()
print('Saved to decisions_from_excel.json')

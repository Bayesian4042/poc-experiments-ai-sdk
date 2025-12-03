#!/usr/bin/env python3
"""
Parse Shark Tank India CSV data and generate TypeScript constants
"""

import csv
import json
from collections import defaultdict

# Read the CSV file
csv_file = '/Users/abhilasha/Downloads/Shark Tank India.csv'

# Dictionary to store investments by shark
shark_investments = {
    'anupam-mittal': {'name': 'Anupam Mittal', 'role': 'Founder and CEO of Shaadi.com', 'image': 'https://images.financialexpressdigital.com/2024/02/Anupam-Mittal.jpg', 'investments': []},
    'aman-gupta': {'name': 'Aman Gupta', 'role': 'Co-founder and CMO of boAt', 'image': 'https://www.livemint.com/lm-img/img/2024/12/29/optimize/Aman_Gupta_1735448892089_1735448902978.jpg', 'investments': []},
    'namita-thapar': {'name': 'Namita Thapar', 'role': 'Executive Director of Emcure Pharmaceuticals', 'image': 'https://img.etimg.com/thumb/width-1200,height-1200,imgsize-28506,resizemode-75,msid-118027212/magazines/panache/shark-tank-india-4-namita-thapar-rejects-gift-from-pitchers-chides-them-for-doing-too-much.jpg', 'investments': []},
    'vineeta-singh': {'name': 'Vineeta Singh', 'role': 'Co-founder and CEO of SUGAR Cosmetics', 'image': 'https://c.ndtvimg.com/2024-04/cuhn5gno_vineeta-singh_625x300_20_April_24.jpg', 'investments': []},
    'peyush-bansal': {'name': 'Peyush Bansal', 'role': 'Co-founder and CEO of Lenskart.com', 'image': 'https://mxp-media.ilnmedia.com/media/content/2022/Jan/Headerthumb_Sony-Pictures-television_61f3ce2de3500.png', 'investments': []},
    'ghazal-alagh': {'name': 'Ghazal Alagh', 'role': 'Co-founder of Mamaearth', 'image': 'https://images.ottplay.com/images/shark-tank-india-ghazal-alagh-1643892567.jpg', 'investments': []},
    'amit-jain': {'name': 'Amit Jain', 'role': 'CEO and Co-founder of CarDekho', 'image': 'https://images.hindustantimes.com/img/2022/11/02/550x309/amit_jain_shark_tank_1667382519477_1667382519625_1667382519625.png', 'investments': []},
    'ashneer-grover': {'name': 'Ashneer Grover', 'role': 'Co-founder and Former MD of BharatPe', 'image': 'https://m.media-amazon.com/images/M/MV5BN2YyMjNhZDctNTRlOC00MTExLThmYTUtN2QyNjU5NDBkMDFmXkEyXkFqcGc@._V1_.jpg', 'investments': []},
}

# Map of column names to shark slugs
shark_mapping = {
    'Namita': 'namita-thapar',
    'Vineeta': 'vineeta-singh',
    'Anupam': 'anupam-mittal',
    'Aman': 'aman-gupta',
    'Peyush': 'peyush-bansal',
    'Amit': 'amit-jain',
    'Guest': None  # We'll handle guests separately
}

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    for row in reader:
        startup_name = row['Startup Name']
        accepted_offer = row['Accepted Offer']
        
        # Only process deals that were accepted
        if accepted_offer != '1':
            continue
        
        # Check each shark's investment
        for shark_name, shark_slug in shark_mapping.items():
            if shark_slug is None:
                continue
                
            investment_amount = row.get(f'{shark_name} Investment Amount', '')
            investment_equity = row.get(f'{shark_name} Investment Equity', '')
            
            # If shark invested (has amount)
            if investment_amount and investment_amount.strip():
                try:
                    amount = float(investment_amount)
                    if amount > 0:
                        # Format the investment
                        if amount >= 100:  # Crores
                            formatted_amount = f"₹{amount/100:.1f} Cr"
                        else:  # Lakhs
                            formatted_amount = f"₹{amount} Lakhs"
                        
                        formatted_equity = f"{investment_equity}%" if investment_equity else "Undisclosed"
                        
                        investment = {
                            'company': startup_name,
                            'amount': formatted_amount,
                            'equity': formatted_equity
                        }
                        
                        shark_investments[shark_slug]['investments'].append(investment)
                except ValueError:
                    # Skip if amount can't be converted to float
                    pass
        
        # Check for Ashneer Grover as a guest
        invested_guest_name = row.get('Invested Guest Name', '')
        if 'Ashneer' in invested_guest_name:
            guest_investment_amount = row.get('Guest Investment Amount', '')
            guest_investment_equity = row.get('Guest Investment Equity', '')
            
            if guest_investment_amount and guest_investment_amount.strip():
                try:
                    amount = float(guest_investment_amount)
                    if amount > 0:
                        # Format the investment
                        if amount >= 100:  # Crores
                            formatted_amount = f"₹{amount/100:.1f} Cr"
                        else:  # Lakhs
                            formatted_amount = f"₹{amount} Lakhs"
                        
                        formatted_equity = f"{guest_investment_equity}%" if guest_investment_equity else "Undisclosed"
                        
                        investment = {
                            'company': startup_name,
                            'amount': formatted_amount,
                            'equity': formatted_equity
                        }
                        
                        shark_investments['ashneer-grover']['investments'].append(investment)
                except ValueError:
                    pass

# Generate TypeScript file
output = 'export const sharkInvestments = {\n'

for slug, data in shark_investments.items():
    output += f'  "{slug}": {{\n'
    output += f'    name: "{data["name"]}",\n'
    output += f'    role: "{data["role"]}",\n'
    output += f'    image: "{data["image"]}",\n'
    output += f'    investments: [\n'
    
    for inv in data['investments']:
        output += f'      {{ company: "{inv["company"]}", amount: "{inv["amount"]}", equity: "{inv["equity"]}" }},\n'
    
    output += f'    ],\n'
    output += f'  }},\n'

output += '};\n'

# Write to file
with open('app/constants/shark-data.ts', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"✅ Generated shark-data.ts with actual CSV data!")
print(f"\nInvestment counts:")
for slug, data in shark_investments.items():
    print(f"  {data['name']}: {len(data['investments'])} investments")


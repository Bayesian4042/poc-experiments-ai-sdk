#!/usr/bin/env python3
"""
Parse Shark Tank India CSV data and generate TypeScript constants with enhanced data
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
    'ritesh-agarwal': {'name': 'Ritesh Agarwal', 'role': 'Founder and CEO of OYO Rooms', 'image': 'https://images.indianexpress.com/2024/02/Shark-Tank-Indias-Ritesh-Agarwal-on-his-journey-with-OYO-Rooms.jpg', 'investments': []},
    'kunal-bahl': {'name': 'Kunal Bahl', 'role': 'Co-founder and CEO of Snapdeal', 'image': 'https://img.etimg.com/thumb/width-420,height-315,imgsize-62190,resizemode-75,msid-118867594/magazines/panache/shark-tank-india-4-kunal-bahl-gets-emotional-over-64-year-old-entrepreneurs-pitch-says-you-remind-me-of-my-mother/kunal-bahl-2.jpg', 'investments': []},
}

# Map of column names to shark slugs
shark_mapping = {
    'Namita': 'namita-thapar',
    'Vineeta': 'vineeta-singh',
    'Anupam': 'anupam-mittal',
    'Aman': 'aman-gupta',
    'Peyush': 'peyush-bansal',
    'Amit': 'amit-jain',
    'Ritesh': 'ritesh-agarwal',
}

def format_currency(value):
    """Format currency values"""
    if not value or value.strip() == '':
        return 'N/A'
    try:
        num = float(value)
        if num >= 100:
            return f"₹{num/100:.1f} Cr"
        else:
            return f"₹{num} L"
    except:
        return value

def safe_get(row, key, default='N/A'):
    """Safely get a value from row"""
    val = row.get(key, '')
    return val.strip() if val.strip() else default

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    for row in reader:
        startup_name = row['Startup Name']
        accepted_offer = row['Accepted Offer']
        
        # Only process deals that were accepted
        if accepted_offer != '1':
            continue
        
        # Get common deal data
        industry = safe_get(row, 'Industry')
        season = safe_get(row, 'Season Number')
        deal_valuation = format_currency(safe_get(row, 'Deal Valuation', ''))
        yearly_revenue = format_currency(safe_get(row, 'Yearly Revenue', ''))
        started_in = safe_get(row, 'Started in')
        city = safe_get(row, 'Pitchers City')
        state = safe_get(row, 'Pitchers State')
        original_ask = format_currency(safe_get(row, 'Original Ask Amount', ''))
        
        # Check each shark's investment
        for shark_name, shark_slug in shark_mapping.items():
            investment_amount = row.get(f'{shark_name} Investment Amount', '')
            investment_equity = row.get(f'{shark_name} Investment Equity', '')
            investment_debt = row.get(f'{shark_name} Debt Amount', '')
            
            # If shark invested (has amount)
            if investment_amount and investment_amount.strip():
                try:
                    amount = float(investment_amount)
                    if amount > 0:
                        formatted_amount = format_currency(str(amount))
                        formatted_equity = f"{investment_equity}%" if investment_equity else "N/A"
                        formatted_debt = format_currency(investment_debt) if investment_debt else "₹0"
                        
                        investment = {
                            'company': startup_name,
                            'industry': industry,
                            'season': season,
                            'amount': formatted_amount,
                            'equity': formatted_equity,
                            'debt': formatted_debt,
                            'dealValuation': deal_valuation,
                            'yearlyRevenue': yearly_revenue,
                            'startedIn': started_in,
                            'location': f"{city}, {state}" if city != 'N/A' and state != 'N/A' else 'N/A',
                            'originalAsk': original_ask,
                        }
                        
                        shark_investments[shark_slug]['investments'].append(investment)
                except ValueError:
                    pass
        
        # Check for special guest investors
        invested_guest_name = row.get('Invested Guest Name', '')
        for guest_key, guest_slug in [('Ashneer', 'ashneer-grover'), ('Kunal', 'kunal-bahl')]:
            if guest_key in invested_guest_name:
                guest_investment_amount = row.get('Guest Investment Amount', '')
                guest_investment_equity = row.get('Guest Investment Equity', '')
                guest_investment_debt = row.get('Guest Debt Amount', '')
                
                if guest_investment_amount and guest_investment_amount.strip():
                    try:
                        amount = float(guest_investment_amount)
                        if amount > 0:
                            formatted_amount = format_currency(str(amount))
                            formatted_equity = f"{guest_investment_equity}%" if guest_investment_equity else "N/A"
                            formatted_debt = format_currency(guest_investment_debt) if guest_investment_debt else "₹0"
                            
                            investment = {
                                'company': startup_name,
                                'industry': industry,
                                'season': season,
                                'amount': formatted_amount,
                                'equity': formatted_equity,
                                'debt': formatted_debt,
                                'dealValuation': deal_valuation,
                                'yearlyRevenue': yearly_revenue,
                                'startedIn': started_in,
                                'location': f"{city}, {state}" if city != 'N/A' and state != 'N/A' else 'N/A',
                                'originalAsk': original_ask,
                            }
                            
                            shark_investments[guest_slug]['investments'].append(investment)
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
        output += f'      {{\n'
        output += f'        company: "{inv["company"]}",\n'
        output += f'        industry: "{inv["industry"]}",\n'
        output += f'        season: "{inv["season"]}",\n'
        output += f'        amount: "{inv["amount"]}",\n'
        output += f'        equity: "{inv["equity"]}",\n'
        output += f'        debt: "{inv["debt"]}",\n'
        output += f'        dealValuation: "{inv["dealValuation"]}",\n'
        output += f'        yearlyRevenue: "{inv["yearlyRevenue"]}",\n'
        output += f'        startedIn: "{inv["startedIn"]}",\n'
        output += f'        location: "{inv["location"]}",\n'
        output += f'        originalAsk: "{inv["originalAsk"]}",\n'
        output += f'      }},\n'
    
    output += f'    ],\n'
    output += f'  }},\n'

output += '};\n'

# Write to file
with open('app/constants/shark-data.ts', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"✅ Generated enhanced shark-data.ts with detailed CSV data!")
print(f"\nInvestment counts:")
for slug, data in shark_investments.items():
    print(f"  {data['name']}: {len(data['investments'])} investments")
print(f"\n📊 Additional data included:")
print(f"  - Industry/Sector")
print(f"  - Season Number")
print(f"  - Deal Valuation")
print(f"  - Yearly Revenue")
print(f"  - Company Founded Year")
print(f"  - Location")
print(f"  - Original Ask Amount")
print(f"  - Debt Component")


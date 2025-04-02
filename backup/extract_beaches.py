import re
from bs4 import BeautifulSoup
import json
import os

# Create directory for extracted data
os.makedirs('extracted_data', exist_ok=True)

# Process Blue Flag beaches data
print('Processing Blue Flag beaches...')
with open('south_africa_blue_flag.html', 'r', encoding='utf-8') as f:
    blue_flag_content = f.read()

blue_flag_soup = BeautifulSoup(blue_flag_content, 'html.parser')
beach_data = []

# Extract beach data from Blue Flag beaches
article_content = blue_flag_soup.find('div', class_='article-wrapper')
if article_content:
    # Find all beach names and provinces
    headings = article_content.find_all(['h2', 'h3'])
    paragraphs = article_content.find_all('p')
    images = article_content.find_all('img')
    
    current_province = None
    
    for heading in headings:
        text = heading.get_text().strip()
        
        # Find province headers
        if 'Province' in text or 'Cape' in text or 'Natal' in text:
            current_province = text.replace('Province', '').strip()
            print(f'Found province: {current_province}')
        # Find beach names
        elif text and len(text) > 3 and not 'South Africa' in text and not 'Blue Flag' in text:
            beach_name = text.strip()
            print(f'Found Blue Flag beach: {beach_name} in {current_province}')
            
            # Find description in nearby paragraphs
            description = f"A Blue Flag beach in {current_province}, South Africa."
            for p in paragraphs:
                if beach_name in p.get_text():
                    description = p.get_text().strip()
                    break
            
            # Find image for this beach
            beach_img = None
            for img in images:
                img_alt = img.get('alt', '').lower()
                img_src = img.get('src', '')
                if beach_name.lower() in img_alt and img_src and not img_src.endswith('.svg'):
                    # Make sure we have an absolute URL
                    if not img_src.startswith('http'):
                        img_src = 'https://www.southafrica.net' + img_src
                    beach_img = img_src
                    break
            
            if beach_img:
                beach_data.append({
                    'name': beach_name,
                    'province': current_province,
                    'location': current_province,
                    'description': description,
                    'imageUrl': beach_img,
                    'source': 'Blue Flag beaches'
                })

# Process Wikipedia beaches data
print('Processing Wikipedia beaches...')
with open('south_africa_wiki_beaches.html', 'r', encoding='utf-8') as f:
    wiki_content = f.read()

wiki_soup = BeautifulSoup(wiki_content, 'html.parser')

# Extract beach data from Wikipedia tables
wiki_tables = wiki_soup.find_all('table', class_='wikitable')
for table in wiki_tables:
    rows = table.find_all('tr')
    # Skip header row
    for row in rows[1:]:
        cells = row.find_all(['td', 'th'])
        if len(cells) >= 3:
            beach_name = cells[0].get_text().strip()
            province = cells[1].get_text().strip()
            location = cells[2].get_text().strip()
            
            # Skip if this beach is already in our list
            if not any(b['name'] == beach_name for b in beach_data):
                # See if there's an image in any of the cells
                image_url = None
                for cell in cells:
                    img = cell.find('img')
                    if img and 'src' in img.attrs:
                        img_src = img['src']
                        if img_src and not img_src.startswith('data:'):
                            if not img_src.startswith('http'):
                                img_src = 'https:' + img_src
                            image_url = img_src
                            break
                
                # If no specific image found, use a default South African beach image
                if not image_url:
                    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Cape_Town_Beaches.jpg/640px-Cape_Town_Beaches.jpg'
                
                beach_data.append({
                    'name': beach_name,
                    'province': province,
                    'location': location,
                    'description': f'A beautiful beach located in {location}, {province}, South Africa.',
                    'imageUrl': image_url,
                    'source': 'Wikipedia'
                })
                print(f'Found Wikipedia beach: {beach_name}, {province}')

# Process Stray Along The Way beaches data
print('Processing Stray Along The Way beaches...')
with open('south_africa_stray_beaches.html', 'r', encoding='utf-8') as f:
    stray_content = f.read()

stray_soup = BeautifulSoup(stray_content, 'html.parser')

# Find beach sections with headers and images
beach_headers = stray_soup.find_all(['h2', 'h3'])
for header in beach_headers:
    # Skip non-beach headers
    heading_text = header.get_text().strip()
    if 'Best Beaches' in heading_text or 'Map of' in heading_text or 'About' in heading_text:
        continue
    
    # Extract beach name, removing any numbering (like "1. Beach Name")
    beach_name = re.sub(r'^\d+\.\s+', '', heading_text).strip()
    beach_name = re.sub(r'\s+–\s+.*$', '', beach_name).strip()
    
    # Skip if this beach is already in our list
    if any(b['name'] == beach_name for b in beach_data):
        continue
    
    # Determine province based on context
    province = 'Unknown'
    if 'Cape Town' in heading_text or 'Western Cape' in heading_text:
        province = 'Western Cape'
    elif 'KZN' in heading_text or 'Durban' in heading_text or 'KwaZulu' in heading_text:
        province = 'KwaZulu-Natal'
    elif 'Eastern Cape' in heading_text:
        province = 'Eastern Cape'
    
    # Try to find an image in the next siblings
    image_url = None
    description = f"A top-rated beach in {province}, South Africa."
    
    # Look for an image in a figure element after this header
    next_elem = header.find_next()
    while next_elem and next_elem.name != 'h2' and next_elem.name != 'h3':
        if next_elem.name == 'figure':
            img = next_elem.find('img')
            if img and 'src' in img.attrs:
                img_src = img['src']
                if img_src and not img_src.startswith('data:'):
                    image_url = img_src
                
                # Check for a description in the figcaption
                figcaption = next_elem.find('figcaption')
                if figcaption:
                    caption_text = figcaption.get_text().strip()
                    if caption_text:
                        description = caption_text
                break
        # Also look for a description in paragraphs
        elif next_elem.name == 'p' and not description:
            p_text = next_elem.get_text().strip()
            if len(p_text) > 30:  # Only use substantial paragraphs
                description = p_text
        
        next_elem = next_elem.find_next()
    
    if image_url:
        beach_data.append({
            'name': beach_name,
            'province': province,
            'location': province,
            'description': description,
            'imageUrl': image_url,
            'source': 'Stray Along The Way'
        })
        print(f'Found Stray beach: {beach_name}, {province}')

# Clean up and deduplicate the data
cleaned_data = []
seen_names = set()

for beach in beach_data:
    # Normalize beach name for deduplication
    normalized_name = beach['name'].lower().strip()
    
    # Skip beaches without images or with duplicate names
    if beach['imageUrl'] and normalized_name not in seen_names:
        seen_names.add(normalized_name)
        cleaned_data.append(beach)

# Sort by province and then by name
cleaned_data.sort(key=lambda x: (x['province'], x['name']))

# Print summary
print(f'\nExtracted {len(cleaned_data)} unique beaches with images')
for province, count in sorted({b['province']: sum(1 for p in cleaned_data if p['province'] == b['province']) for b in cleaned_data}.items()):
    print(f'  {province}: {count} beaches')

# Save the extracted data to a JSON file
with open('extracted_data/beaches.json', 'w', encoding='utf-8') as f:
    json.dump(cleaned_data, f, indent=2)

print(f'\nBeach data saved to extracted_data/beaches.json')
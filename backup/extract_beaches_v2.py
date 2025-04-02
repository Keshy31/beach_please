import re
from bs4 import BeautifulSoup
import json
import os
from urllib.parse import urljoin

# Create directory for extracted data
os.makedirs('extracted_data', exist_ok=True)

# Global beach data
beach_data = []
image_urls = {}

def clean_text(text):
    """Clean and normalize text"""
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# ======================
# PROCESS SA VENUES DATA
# ======================
print('Processing SA-Venues beaches...')
with open('sa_venues_beaches.html', 'r', encoding='utf-8', errors='replace') as f:
    sa_venues_content = f.read()

sa_venues_soup = BeautifulSoup(sa_venues_content, 'html.parser')

# Extract beach data from SA-Venues
content_div = sa_venues_soup.find('div', id='content')
if content_div:
    beach_headings = content_div.find_all(['h2', 'h3'])
    
    for heading in beach_headings:
        # Skip non-beach headers
        text = heading.get_text().strip()
        
        # Skip irrelevant headers
        if not text or "beaches" in text.lower() or "cape" in text.lower() or "featured" in text.lower():
            continue
            
        # Extract beach name
        beach_name = text.strip()
        
        # Set default province based on the page (Western Cape)
        province = "Western Cape"
        
        # Find description - next paragraph after heading
        description = ""
        next_elem = heading.find_next()
        while next_elem and next_elem.name != 'h2' and next_elem.name != 'h3':
            if next_elem.name == 'p':
                para_text = clean_text(next_elem.get_text())
                if para_text and len(para_text) > 30:
                    description = para_text
                    break
            next_elem = next_elem.find_next()
        
        # Find image
        image_url = None
        img_container = heading.find_next('div', class_='img-container')
        if img_container:
            img = img_container.find('img')
            if img and 'src' in img.attrs:
                img_src = img['src']
                if img_src and not img_src.startswith('data:'):
                    if not img_src.startswith('http'):
                        img_src = urljoin('https://www.sa-venues.com/', img_src)
                    image_url = img_src
        
        if beach_name and image_url:
            image_urls[beach_name.lower()] = image_url
            beach_data.append({
                'name': beach_name,
                'province': province,
                'location': province,
                'description': description or f'A beautiful beach in the {province} of South Africa.',
                'imageUrl': image_url,
                'source': 'SA-Venues'
            })
            print(f'Found SA-Venues beach: {beach_name}, {province}')

# ======================
# PROCESS STRAY DATA
# ======================
print('\nProcessing Stray Along The Way beaches...')
with open('stray_beaches_better.html', 'r', encoding='utf-8', errors='replace') as f:
    stray_content = f.read()

stray_soup = BeautifulSoup(stray_content, 'html.parser')

# Find all article content
article_content = stray_soup.find('article')
if article_content:
    beach_headers = article_content.find_all(['h2', 'h3'])
    
    current_province = None
    
    for header in beach_headers:
        heading_text = header.get_text().strip()
        
        # Skip non-beach headers
        if 'best beaches' in heading_text.lower() or 'map of' in heading_text.lower() or 'about' in heading_text.lower():
            continue
        
        # Extract beach name, removing any numbering (like "1. Beach Name")
        raw_beach_name = heading_text
        beach_name = re.sub(r'^\d+\.\s+', '', raw_beach_name).strip()
        
        # Further clean up names with dashes or hyphens, keeping just the first part
        if ' – ' in beach_name:
            beach_name = beach_name.split(' – ')[0].strip()
        elif ' - ' in beach_name:
            beach_name = beach_name.split(' - ')[0].strip()
        
        # Determine province
        province = 'Unknown'
        location = beach_name
        
        # Set province based on context
        if 'cape town' in raw_beach_name.lower() or 'western cape' in raw_beach_name.lower():
            province = 'Western Cape'
        elif 'kzn' in raw_beach_name.lower() or 'durban' in raw_beach_name.lower() or 'kwazulu' in raw_beach_name.lower():
            province = 'KwaZulu-Natal'
        elif 'eastern cape' in raw_beach_name.lower():
            province = 'Eastern Cape'
        
        if ' – ' in raw_beach_name:
            location_part = raw_beach_name.split(' – ')[1].strip()
            if location_part:
                location = location_part
        
        # Find images and description
        image_url = None
        description = f"A top-rated beach in {province}, South Africa."
        
        # Look at elements after the header until we find an image or next header
        next_elem = header.find_next()
        while next_elem and next_elem.name not in ['h2', 'h3']:
            # Look for figures with images
            if next_elem.name == 'figure':
                img = next_elem.find('img')
                if img and 'src' in img.attrs:
                    img_src = img['src']
                    if img_src and not img_src.startswith('data:'):
                        image_url = img_src
                
                # Look for description in figcaption
                figcaption = next_elem.find('figcaption')
                if figcaption:
                    caption_text = clean_text(figcaption.get_text())
                    if caption_text and len(caption_text) > 10:
                        description = caption_text
                break
            
            # Also look for paragraphs with descriptions
            elif next_elem.name == 'p':
                p_text = clean_text(next_elem.get_text())
                if p_text and len(p_text) > 40:  # Only use substantial paragraphs
                    description = p_text
            
            next_elem = next_elem.find_next()
        
        if beach_name and image_url:
            image_urls[beach_name.lower()] = image_url
            beach_data.append({
                'name': beach_name,
                'province': province,
                'location': location,
                'description': description,
                'imageUrl': image_url,
                'source': 'Stray Along The Way'
            })
            print(f'Found Stray beach: {beach_name}, {province}')

# ======================
# PROCESS BLUE FLAG DATA
# ======================
print('\nProcessing Blue Flag beaches...')
with open('south_africa_blue_flag.html', 'r', encoding='utf-8', errors='replace') as f:
    blue_flag_content = f.read()

blue_flag_soup = BeautifulSoup(blue_flag_content, 'html.parser')

# Extract beach data from Blue Flag beaches
article_content = blue_flag_soup.find('div', class_='article-wrapper')
if article_content:
    # Find all images
    all_images = article_content.find_all('img')
    image_src_map = {}
    
    # Map images to potential beach names based on alt text
    for img in all_images:
        alt_text = img.get('alt', '').lower()
        img_src = img.get('src', '')
        
        if img_src and not img_src.endswith(('.svg', '.gif')):
            if not img_src.startswith('http'):
                img_src = urljoin('https://www.southafrica.net/', img_src)
            
            # Store this image indexed by potential beach names in its alt text
            for word in alt_text.split():
                if word and len(word) > 3 and word not in ['south', 'africa', 'beach', 'province', 'flag', 'blue']:
                    image_src_map[word] = img_src
    
    # Find all headers that might be beach names
    headings = article_content.find_all(['h2', 'h3', 'h4', 'strong'])
    paragraphs = article_content.find_all('p')
    
    current_province = "Unknown"
    
    for heading in headings:
        text = heading.get_text().strip()
        
        # Skip empty headers
        if not text or len(text) < 4:
            continue
        
        # Check if this is a province header
        if 'province' in text.lower() or 'eastern cape' in text.lower() or 'western cape' in text.lower() or 'kwazulu' in text.lower():
            current_province = text.replace('Province', '').strip()
            continue
        
        # Skip if this heading has standard non-beach keywords
        if 'south africa' in text.lower() or 'blue flag' in text.lower() or 'province' in text.lower():
            continue
        
        # This might be a beach name
        beach_name = text.strip()
        
        # Find description in nearby paragraphs
        description = f"A Blue Flag beach in {current_province}, certified for excellence in safety, amenities, cleanliness and environmental standards."
        for p in paragraphs:
            p_text = p.get_text().strip()
            if beach_name in p_text and len(p_text) > 50:
                description = p_text
                break
        
        # Find an image for this beach
        image_url = None
        
        # Try to match beach name in image alt text map
        beach_name_lower = beach_name.lower()
        for word in beach_name_lower.split():
            if word in image_src_map:
                image_url = image_src_map[word]
                break
        
        # If no image found but we have a previous match for this beach, use that
        if not image_url and beach_name_lower in image_urls:
            image_url = image_urls[beach_name_lower]
        
        # Only add beaches with images
        if beach_name and image_url:
            beach_data.append({
                'name': beach_name,
                'province': current_province,
                'location': current_province,
                'description': description,
                'imageUrl': image_url,
                'source': 'Blue Flag beaches'
            })
            print(f'Found Blue Flag beach: {beach_name}, {current_province}')

# ======================
# PROCESS WIKIPEDIA DATA
# ======================
print('\nProcessing Wikipedia beaches...')
with open('south_africa_wiki_beaches.html', 'r', encoding='utf-8', errors='replace') as f:
    wiki_content = f.read()

wiki_soup = BeautifulSoup(wiki_content, 'html.parser')

# Define some good beach images to use if we don't find specific ones
default_beach_images = {
    'Western Cape': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Camps_Bay_Cape_Town.jpg/800px-Camps_Bay_Cape_Town.jpg',
    'Eastern Cape': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jeffrey%27s_Bay_South_Africa.jpg/800px-Jeffrey%27s_Bay_South_Africa.jpg',
    'KwaZulu-Natal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Durban_beach_front.jpg/800px-Durban_beach_front.jpg',
    'Unknown': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Cape_Town_Beaches.jpg/640px-Cape_Town_Beaches.jpg'
}

# Extract beach data from Wikipedia tables
wiki_tables = wiki_soup.find_all('table', class_='wikitable')
for table in wiki_tables:
    rows = table.find_all('tr')
    
    # Skip header row
    for row in rows[1:]:
        cells = row.find_all(['td', 'th'])
        if len(cells) >= 3:
            beach_name = clean_text(cells[0].get_text())
            province = clean_text(cells[1].get_text())
            location = clean_text(cells[2].get_text())
            
            # Skip empty or invalid data
            if not beach_name or not province:
                continue
                
            # Find an image in any of the cells
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
            
            # If no image found but we have a previous match for this beach, use that
            if not image_url and beach_name.lower() in image_urls:
                image_url = image_urls[beach_name.lower()]
            
            # If still no image, use province default
            if not image_url:
                image_url = default_beach_images.get(province, default_beach_images['Unknown'])
                
            # Add this beach
            beach_data.append({
                'name': beach_name,
                'province': province,
                'location': location,
                'description': f'A beautiful beach located in {location}, {province}, South Africa.',
                'imageUrl': image_url,
                'source': 'Wikipedia'
            })
            print(f'Found Wikipedia beach: {beach_name}, {province}')

# ======================
# CLEAN UP DATA
# ======================
print('\nCleaning and deduplicating data...')

# Clean up and deduplicate the data
cleaned_data = []
seen_names = set()

for beach in beach_data:
    # Skip beaches without images
    if not beach['imageUrl']:
        continue
        
    # Normalize beach name to prevent duplicates
    normalized_name = beach['name'].lower().strip()
    
    # Skip if we've already seen this beach
    if normalized_name in seen_names:
        continue
        
    # Clean up province names
    if 'kwazulu' in beach['province'].lower() or 'kzn' in beach['province'].lower():
        beach['province'] = 'KwaZulu-Natal'
    elif 'western' in beach['province'].lower():
        beach['province'] = 'Western Cape'
    elif 'eastern' in beach['province'].lower():
        beach['province'] = 'Eastern Cape'
    
    # Add to our cleaned list
    cleaned_data.append(beach)
    seen_names.add(normalized_name)

# Sort by province and then by name
cleaned_data.sort(key=lambda x: (x['province'], x['name']))

# Print summary
print(f'\nExtracted {len(cleaned_data)} unique beaches with images')
province_counts = {}
for beach in cleaned_data:
    province = beach['province']
    province_counts[province] = province_counts.get(province, 0) + 1

for province, count in sorted(province_counts.items()):
    print(f'  {province}: {count} beaches')

# Save the extracted data to a JSON file
with open('extracted_data/beaches_enriched.json', 'w', encoding='utf-8') as f:
    json.dump(cleaned_data, f, indent=2)

print(f'\nEnriched beach data saved to extracted_data/beaches_enriched.json')
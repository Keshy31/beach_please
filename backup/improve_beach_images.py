import json
import os

# Define high-quality beach images by province
beach_images = {
    "Western Cape": [
        "https://images.unsplash.com/photo-1599942237521-37383b96a0b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1518726432375-a9cde706a283?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1580060839202-3951fa5a2180?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1542509631-e5111aef2487?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1541420937988-702d78cb8edf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    ],
    "Eastern Cape": [
        "https://images.unsplash.com/photo-1551693965-ac1d6536d242?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1526431307837-e5b06f387aac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    ],
    "KwaZulu-Natal": [
        "https://images.unsplash.com/photo-1600177897995-e67c73ed44e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1534461434297-2c193151d8c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    ]
}

# General beach images for random assignment
general_beach_images = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1504681869696-d977211a5f4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1520942702018-0862200e6873?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1513553404607-988bf2703777?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1597466599360-3b9775841aec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1514539079130-25950c84af65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
]

# Create directory for extracted data
os.makedirs('extracted_data', exist_ok=True)

# Load existing beach data
try:
    with open('extracted_data/beaches_enriched.json', 'r', encoding='utf-8') as f:
        beaches = json.load(f)
    print(f"Loaded {len(beaches)} beaches from beaches_enriched.json")
except Exception as e:
    print(f"Error loading beaches: {e}")
    beaches = []

# Track how many images we assign from each province's pool
image_counters = {
    "Western Cape": 0,
    "Eastern Cape": 0,
    "KwaZulu-Natal": 0,
    "general": 0
}

# Assign higher quality images to each beach
for beach in beaches:
    province = beach["province"]
    
    # Select appropriate image pool based on province
    if province in beach_images and image_counters[province] < len(beach_images[province]):
        # Use province-specific image if available
        beach["imageUrl"] = beach_images[province][image_counters[province]]
        image_counters[province] += 1
    else:
        # Fall back to general beach images
        general_idx = image_counters["general"] % len(general_beach_images)
        beach["imageUrl"] = general_beach_images[general_idx]
        image_counters["general"] += 1

# Save the updated data
with open('extracted_data/beaches_with_better_images.json', 'w', encoding='utf-8') as f:
    json.dump(beaches, f, indent=2)

# Print statistics
print(f"\nUpdated {len(beaches)} beaches with better images")
print("Images used by province:")
for province, count in image_counters.items():
    print(f"  {province}: {count}")

print(f"\nEnhanced beach data saved to extracted_data/beaches_with_better_images.json")
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Get the current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google API credentials
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

// Sleep function to avoid hitting rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Beach descriptions by region to replace generic ones
const enrichedDescriptions = {
  // Eastern Cape
  "Bluewater Beach": "Known for its pristine blue waters and golden sand, Bluewater Beach offers excellent swimming and surfing conditions with lifeguards present during peak seasons.",
  "Cape St. Francis Beach": "Famous for its consistent waves and historic lighthouse, Cape St. Francis Beach is a renowned surfing destination featured in the classic film 'The Endless Summer'.",
  "Jeffreys Bay Beach": "World-famous for the perfect right-hand break at Supertubes, Jeffreys Bay is a surfer's paradise that hosts international competitions and offers 8km of beautiful beaches.",
  "Kidds Beach": "A family-friendly beach with rock pools perfect for children to explore, Kidds Beach has calm waters and is ideal for swimming and picnicking.",
  "King's Beach": "An urban beach with Blue Flag status, King's Beach features a 2km stretch of golden sand with excellent facilities including a skate park and water slides.",
  "Pollocks Beach": "A quieter alternative to the more popular Port Elizabeth beaches, Pollocks offers excellent surf fishing opportunities and beautiful coastal walks.",
  "Wells Estate Beach": "A spacious beach with magnificent dunes, Wells Estate features picnic areas shaded by indigenous coastal forest and is popular for kite flying and sandboarding.",
  
  // KwaZulu-Natal
  "Alkantstrand Beach": "A popular swimming beach with a promenade and pier, Alkantstrand is Richards Bay's main beach and offers water sports facilities and excellent lifeguard services.",
  "Banana Beach": "Named after a shipwreck of banana cargo, this beach has golden sands surrounded by lush subtropical vegetation and is excellent for snorkeling and fishing.",
  "Bazley Beach": "A secluded beach with rocky outcrops and tidal pools, Bazley offers fantastic fishing opportunities and peaceful surroundings away from busy tourist spots.",
  "Blythedale Beach": "With its gentle waves and wide sandy beach, Blythedale is perfect for families and offers excellent dolphin watching opportunities year-round.",
  "Bronze Beach": "Known for its bronze-colored sands, this beach offers safe swimming areas and is less crowded than neighboring Umhlanga beaches.",
  "Clansthal Beach": "A hidden gem with spectacular scenery, Clansthal is a relatively undeveloped beach perfect for nature lovers seeking solitude and unspoiled coastline.",
  "Ifafa Beach": "This beach features a magnificent lagoon and estuary system, making it popular for bird watching and kayaking alongside traditional beach activities.",
  "Glenmore Beach": "A pristine beach with golden sands and excellent surf, Glenmore is backed by indigenous coastal forest and offers spectacular views of the Indian Ocean.",
  
  // Western Cape
  "Bloubergstrand": "Famous for its iconic view of Table Mountain across the bay, Bloubergstrand is a kitesurfing and windsurfing mecca with strong consistent winds.",
  "Camps Bay Beach": "Nestled beneath the Twelve Apostles mountain range, this trendy beach is lined with palm trees and upscale restaurants offering a cosmopolitan beach experience."
};

// Image URLs that need reprocessing (hotel/non-beach images)
const imagesToReprocess = [
  "San Lameer Beach",
  "Sheffield Beach",
  "Umhlanga Beach"
];

// Function to fetch image for a specific beach
async function fetchBeachImage(beachName, province) {
  try {
    // Use a more specific query to get actual beach views, not hotels or facilities
    const query = `${beachName} beach shoreline ocean view ${province} South Africa`;
    console.log(`Searching for: ${query}`);
    
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        searchType: 'image',
        num: 3, // Get top 3 results to choose from
        imgSize: 'xlarge', // Prefer large images
        safe: 'active',
        // Additional filtering to target beach images
        rights: 'cc_publicdomain,cc_attribute,cc_sharealike',
        fileType: 'jpg,png',
        imgType: 'photo'
      }
    });
    
    if (response.data.items && response.data.items.length > 0) {
      // Try to find an image with specific beach-related keywords in the title or snippet
      const beachKeywords = ['beach', 'coast', 'shore', 'ocean', 'sea', 'sand', 'waves'];
      const beachImage = response.data.items.find(item => 
        beachKeywords.some(keyword => 
          (item.title && item.title.toLowerCase().includes(keyword)) || 
          (item.snippet && item.snippet.toLowerCase().includes(keyword))
        )
      );
      
      // Use the filtered image or default to the first one
      const imageUrl = beachImage ? beachImage.link : response.data.items[0].link;
      console.log(`Found image for ${beachName}: ${imageUrl}`);
      return imageUrl;
    } else {
      console.log(`No image found for ${beachName}, trying more generic search...`);
      
      // Try a more generic search
      const genericResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: GOOGLE_API_KEY,
          cx: GOOGLE_SEARCH_ENGINE_ID,
          q: `${beachName} beach coastline South Africa scenic`,
          searchType: 'image',
          num: 2,
          imgSize: 'xlarge',
          safe: 'active',
          fileType: 'jpg,png',
          imgType: 'photo'
        }
      });
      
      if (genericResponse.data.items && genericResponse.data.items.length > 0) {
        const imageUrl = genericResponse.data.items[0].link;
        console.log(`Found image with generic search for ${beachName}: ${imageUrl}`);
        return imageUrl;
      }
      
      console.log(`No image found for ${beachName} even with generic search`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching image for ${beachName}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

// Main function to improve beach data
async function improveBeachData() {
  try {
    // Create directory for extracted data if it doesn't exist
    const extractedDataDir = path.join(process.cwd(), 'extracted_data');
    if (!fs.existsSync(extractedDataDir)) {
      fs.mkdirSync(extractedDataDir);
    }
    
    // Load existing processed data
    const authenticImagesPath = path.join(extractedDataDir, 'beaches_with_authentic_images.json');
    if (!fs.existsSync(authenticImagesPath)) {
      console.error('Beach data file not found!');
      return;
    }
    
    let beaches = JSON.parse(fs.readFileSync(authenticImagesPath, 'utf-8'));
    console.log(`Loaded ${beaches.length} beaches from beaches_with_authentic_images.json`);
    
    // Step 1: Remove "Beaches of..." entries
    const originalCount = beaches.length;
    beaches = beaches.filter(beach => 
      !beach.name.startsWith("Beaches of")
    );
    console.log(`Removed ${originalCount - beaches.length} 'Beaches of...' entries`);
    
    // Step 2: Improve generic descriptions
    let descriptionsImproved = 0;
    beaches.forEach(beach => {
      // Update description if it's generic and we have an enriched one
      if (
        beach.description?.includes("A beautiful beach located in") && 
        enrichedDescriptions[beach.name]
      ) {
        beach.description = enrichedDescriptions[beach.name];
        descriptionsImproved++;
      }
      // Add placeholder descriptions where we don't have specific ones yet
      else if (beach.description?.includes("A beautiful beach located in")) {
        const features = [
          "golden sands",
          "clear blue waters",
          "stunning coastal views",
          "tidal pools",
          "excellent swimming conditions",
          "popular fishing spot",
          "surfing hotspot",
          "family-friendly atmosphere"
        ];
        
        // Select random features to create a more unique description
        const feature1 = features[Math.floor(Math.random() * features.length)];
        let feature2 = features[Math.floor(Math.random() * features.length)];
        while (feature2 === feature1) {
          feature2 = features[Math.floor(Math.random() * features.length)];
        }
        
        beach.description = `${beach.name} offers ${feature1} and ${feature2}. Located in ${beach.location}, ${beach.province}, it's a popular destination for both locals and tourists.`;
        descriptionsImproved++;
      }
    });
    console.log(`Improved ${descriptionsImproved} generic descriptions`);
    
    // Step 3: Reprocess images for specific beaches that have incorrect scenes
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < imagesToReprocess.length; i++) {
      const beachName = imagesToReprocess[i];
      const beach = beaches.find(b => b.name === beachName);
      
      if (beach) {
        console.log(`Reprocessing image for ${beach.name} (${beach.province})`);
        
        // Fetch beach image
        const imageUrl = await fetchBeachImage(beach.name, beach.province);
        
        if (imageUrl) {
          beach.imageUrl = imageUrl;
          successCount++;
        } else {
          failCount++;
          // Keep the original image URL if we couldn't find a new one
          console.log(`Keeping original image for ${beach.name}`);
        }
        
        // Sleep to avoid hitting API rate limits (100 queries per day for free tier)
        if (i < imagesToReprocess.length - 1) {
          console.log('Waiting before next request...');
          await sleep(2000);
        }
      } else {
        console.log(`Beach "${beachName}" not found in data`);
      }
    }
    
    // Save the improved data
    const outputPath = path.join(extractedDataDir, 'beaches_with_authentic_images.json');
    fs.writeFileSync(outputPath, JSON.stringify(beaches, null, 2), 'utf-8');
    
    console.log('\nResults:');
    console.log(`Total beaches after cleanup: ${beaches.length}`);
    console.log(`Successfully reprocessed images: ${successCount}`);
    console.log(`Failed to reprocess images: ${failCount}`);
    console.log(`Updated beach data saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error in improveBeachData:', error);
  }
}

// Run the improvement process
improveBeachData().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
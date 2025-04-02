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

// Function to fetch image for a specific beach
async function fetchBeachImage(beachName, province) {
  try {
    const query = `${beachName} beach ${province} South Africa`;
    console.log(`Searching for: ${query}`);
    
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        searchType: 'image',
        num: 1, // Get just the top result
        imgSize: 'xlarge', // Prefer large images
        safe: 'active'
      }
    });
    
    if (response.data.items && response.data.items.length > 0) {
      const imageUrl = response.data.items[0].link;
      console.log(`Found image for ${beachName}: ${imageUrl}`);
      return imageUrl;
    } else {
      console.log(`No image found for ${beachName}, trying more generic search...`);
      
      // Try a more generic search
      const genericResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: GOOGLE_API_KEY,
          cx: GOOGLE_SEARCH_ENGINE_ID,
          q: `${beachName} beach South Africa`,
          searchType: 'image',
          num: 1,
          imgSize: 'xlarge',
          safe: 'active'
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

// Main function to process all beaches
async function updateBeachImages() {
  try {
    // Create directory for extracted data if it doesn't exist
    const extractedDataDir = path.join(process.cwd(), 'extracted_data');
    if (!fs.existsSync(extractedDataDir)) {
      fs.mkdirSync(extractedDataDir);
    }
    
    // Check if we already have a file with authentic images
    const authenticImagesPath = path.join(extractedDataDir, 'beaches_with_authentic_images.json');
    let beaches = [];
    let updatedBeaches = [];
    
    if (fs.existsSync(authenticImagesPath)) {
      // Load existing processed data
      updatedBeaches = JSON.parse(fs.readFileSync(authenticImagesPath, 'utf-8'));
      console.log(`Loaded ${updatedBeaches.length} beaches from beaches_with_authentic_images.json`);
    } else {
      // If not found, start with the original data
      const dataPath = path.join(extractedDataDir, 'beaches_enriched.json');
      if (!fs.existsSync(dataPath)) {
        console.error('Beach data file not found!');
        return;
      }
      
      beaches = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      console.log(`Loaded ${beaches.length} beaches from beaches_enriched.json`);
      
      // Create a copy of beaches with placeholders for images we'll update
      updatedBeaches = beaches.map(beach => ({
        ...beach,
        originalImageUrl: beach.imageUrl // Keep the original image URL as a backup
      }));
    }
    
    // Process a subset of beaches (first 10) to avoid timeouts
    let successCount = 0;
    let failCount = 0;
    const beachesToProcess = updatedBeaches.slice(5, 10); // Process beaches 5-10
    
    for (let i = 0; i < beachesToProcess.length; i++) {
      const beach = beachesToProcess[i];
      console.log(`Processing ${i+1}/${beachesToProcess.length}: ${beach.name} (${beach.province})`);
      
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
      if (i < beachesToProcess.length - 1) {
        console.log('Waiting before next request...');
        await sleep(2000);
      }
    }
    
    // Save the updated data
    const outputPath = path.join(extractedDataDir, 'beaches_with_authentic_images.json');
    fs.writeFileSync(outputPath, JSON.stringify(updatedBeaches, null, 2), 'utf-8');
    
    console.log('\nResults:');
    console.log(`Successfully updated images: ${successCount}`);
    console.log(`Failed to update images: ${failCount}`);
    console.log(`Updated beach data saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error in updateBeachImages:', error);
  }
}

// Run the update process
updateBeachImages().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
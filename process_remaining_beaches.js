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

// Function to process a batch of beaches
async function processBatch(beaches, startIndex, batchSize) {
  // Find all beaches that need processing (have Wikipedia images)
  const wikipediaBeaches = beaches.filter(beach => 
    beach.imageUrl && beach.imageUrl.includes('wikipedia')
  );
  
  if (wikipediaBeaches.length === 0) {
    console.log("No beaches with Wikipedia images found - all beaches have been processed!");
    return { successCount: 0, failCount: 0, nextIndex: beaches.length };
  }
  
  console.log(`Found ${wikipediaBeaches.length} beaches with Wikipedia images that need processing`);
  
  // Use startIndex within the filtered list
  const filteredStartIndex = Math.min(startIndex, wikipediaBeaches.length - 1);
  const filteredEndIndex = Math.min(filteredStartIndex + batchSize, wikipediaBeaches.length);
  const beachesToProcess = wikipediaBeaches.slice(filteredStartIndex, filteredEndIndex);
  
  // Find the actual indices in the full beaches array for these filtered beaches
  const originalIndices = beachesToProcess.map(beach => beaches.findIndex(b => b.name === beach.name));
  const endIndex = Math.max(...originalIndices) + 1;
  
  console.log(`\nProcessing batch from filtered indices ${filteredStartIndex} to ${filteredEndIndex - 1}`);
  console.log(`These correspond to original indices: ${originalIndices.join(', ')}`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < beachesToProcess.length; i++) {
    const beach = beachesToProcess[i];
    console.log(`Processing ${i+1}/${beachesToProcess.length}: ${beach.name} (${beach.province})`);
    
    // Only process beaches that have Wikipedia URLs
    const needsProcessing = beach.imageUrl && beach.imageUrl.includes('wikipedia');
      
    if (!needsProcessing) {
      console.log(`Skipping ${beach.name} as it already has a good image`);
      continue;
    }
    
    // Fetch beach image
    const imageUrl = await fetchBeachImage(beach.name, beach.province);
    
    if (imageUrl) {
      // Find the beach in the original array and update it
      const originalIndex = beaches.findIndex(b => b.name === beach.name);
      if (originalIndex !== -1) {
        beaches[originalIndex].imageUrl = imageUrl;
        console.log(`Updated image for ${beach.name} in original array at index ${originalIndex}`);
        successCount++;
      } else {
        console.error(`Could not find ${beach.name} in the original array!`);
        failCount++;
      }
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
  
  return { successCount, failCount, nextIndex: endIndex };
}

// Main function to process all beaches in batches
async function processAllBeaches() {
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
    
    // Get the starting point for this run
    const batchInfoPath = path.join(extractedDataDir, 'batch_info.json');
    let startIndex = 0;
    if (fs.existsSync(batchInfoPath)) {
      try {
        const batchInfo = JSON.parse(fs.readFileSync(batchInfoPath, 'utf-8'));
        startIndex = batchInfo.nextIndex || 0;
      } catch (error) {
        console.error('Error reading batch info, starting from index 0:', error);
      }
    }
    
    if (startIndex >= beaches.length) {
      console.log('All beaches have been processed!');
      return;
    }
    
    console.log(`Starting from beach index ${startIndex}`);
    
    // Process a single batch (3 beaches) at a time to avoid timeouts
    const batchSize = 3;
    const { successCount, failCount, nextIndex } = await processBatch(beaches, startIndex, batchSize);
    
    // Save the updated data
    const outputPath = path.join(extractedDataDir, 'beaches_with_authentic_images.json');
    fs.writeFileSync(outputPath, JSON.stringify(beaches, null, 2), 'utf-8');
    
    // Save the next batch starting point
    fs.writeFileSync(batchInfoPath, JSON.stringify({ nextIndex }), 'utf-8');
    
    console.log('\nResults:');
    console.log(`Successfully updated images: ${successCount}`);
    console.log(`Failed to update images: ${failCount}`);
    console.log(`Updated beach data saved to: ${outputPath}`);
    console.log(`Next batch will start from index ${nextIndex}`);
    
    const remainingBeaches = beaches.length - nextIndex;
    if (remainingBeaches > 0) {
      console.log(`${remainingBeaches} beaches remaining to process`);
    } else {
      console.log('All beaches have been processed!');
    }
    
  } catch (error) {
    console.error('Error in processAllBeaches:', error);
  }
}

// Run the process
processAllBeaches().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
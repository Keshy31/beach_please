import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchBeachImage(beachName, province) {
  try {
    // Create a more specific query for South African beaches
    // Include "Port Edward" for Portobello Beach which is in Port Edward
    let query = '';
    if (beachName === 'Portobello Beach') {
      query = `${beachName} Port Edward South Africa coastal`;
    } else {
      query = `${beachName} beach ${province} South Africa coastal view`;
    }
    console.log(`Searching for: ${query}`);
    
    const searchUrl = 'https://www.googleapis.com/customsearch/v1';
    const params = new URLSearchParams({
      key: process.env.GOOGLE_API_KEY,
      cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
      q: query,
      searchType: 'image',
      num: 5,  // Get 5 results to choose from
      rights: 'cc_publicdomain cc_attribute cc_sharealike' // Prefer Creative Commons images
    });
    
    const response = await fetch(`${searchUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error('No image results found');
    }
    
    // Log all results for examination
    console.log('Found image results:');
    data.items.forEach((item, i) => {
      console.log(`${i+1}: ${item.link}`);
      if (item.image && item.image.contextLink) {
        console.log(`   Source: ${item.image.contextLink}`);
      }
    });
    
    // For Portobello Beach, use the second result which appears to be from KZN South Coast
    if (beachName === 'Portobello Beach' && data.items.length > 1) {
      return data.items[1].link;
    }
    
    // For other beaches, return the first result
    return data.items[0].link;
  } catch (error) {
    console.error(`Error fetching image for ${beachName}:`, error.message);
    return null;
  }
}

async function updateBeachImage(beachName, province) {
  try {
    // Load beaches data
    const dataPath = path.join(__dirname, 'extracted_data', 'beaches_with_authentic_images.json');
    const beaches = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Find the beach to update
    const beachIndex = beaches.findIndex(b => b.name === beachName && b.province === province);
    if (beachIndex === -1) {
      console.error(`Beach not found: ${beachName} (${province})`);
      return;
    }
    
    // Fetch a new image
    const imageUrl = await fetchBeachImage(beachName, province);
    if (!imageUrl) {
      console.error(`Failed to find new image for ${beachName}`);
      return;
    }
    
    // Update the beach data
    const oldImageUrl = beaches[beachIndex].imageUrl;
    beaches[beachIndex].imageUrl = imageUrl;
    
    // Save updated data
    fs.writeFileSync(dataPath, JSON.stringify(beaches, null, 2));
    
    console.log(`Successfully updated image for ${beachName}`);
    console.log(`Old: ${oldImageUrl}`);
    console.log(`New: ${imageUrl}`);
  } catch (error) {
    console.error('Error updating beach image:', error);
  }
}

// Execute for Portobello Beach
updateBeachImage('Portobello Beach', 'KwaZulu-Natal');
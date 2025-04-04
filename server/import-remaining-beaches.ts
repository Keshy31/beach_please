import fs from 'fs';
import path from 'path';
import { db } from './db';
import { beaches } from '../shared/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * Import remaining beaches that were skipped due to null image_url
 */
async function importRemainingBeaches() {
  try {
    console.log('Starting remaining beaches import process...');
    
    // Read beach data from JSON file
    const dataPath = path.join(process.cwd(), 'data', 'beaches.json');
    
    if (!fs.existsSync(dataPath)) {
      console.error('Beach data file not found at', dataPath);
      return;
    }
    
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    const beachData = JSON.parse(jsonData);
    
    console.log(`Found ${beachData.length} beaches in JSON file.`);
    
    // Get existing beach names
    const existingBeaches = await db.select({ name: beaches.name }).from(beaches);
    const existingBeachNames = existingBeaches.map(b => b.name);
    console.log(`Found ${existingBeachNames.length} existing beaches to skip.`);
    
    // Find beaches that are in JSON but not in database
    const missingBeaches = beachData.filter(beach => !existingBeachNames.includes(beach.name));
    console.log(`Found ${missingBeaches.length} missing beaches to import.`);
    
    // Import each missing beach
    let imported = 0;
    let errors = 0;
    
    for (const beach of missingBeaches) {
      try {
        // Insert the beach using Drizzle ORM
        await db.insert(beaches).values({
          name: beach.name,
          location: beach.location,
          province: beach.province,
          description: beach.description,
          imageUrl: beach.imageUrl || '', // Use empty string if null
          rating: 1500,
          previousRating: 1500,
          previousRank: 0,
          isSwimming: beach.isSwimming || 0,
          isSurfing: beach.isSurfing || 0,
          isBlueFlag: beach.isBlueFlag || 0,
          isFishing: beach.isFishing || 0,
          hasLifeguards: beach.hasLifeguards || 0,
          hasFacilities: beach.hasFacilities || 0
        });
        
        console.log(`Successfully imported ${beach.name}`);
        imported++;
      } catch (error) {
        console.error(`Error importing beach ${beach.name}:`, error);
        errors++;
      }
    }
    
    console.log(`Beach import completed. Imported ${imported} missing beaches. ${errors} errors.`);
    
    // Verify the final count
    const finalResult = await db.select({ count: sql`count(*)` }).from(beaches);
    const finalCount = Number(finalResult[0].count);
    console.log(`Total beaches in database: ${finalCount}`);
    
  } catch (error) {
    console.error('Error importing beaches:', error);
  }
}

// Run the import
importRemainingBeaches().catch(console.error);
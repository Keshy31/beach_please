import fs from 'fs';
import path from 'path';
import { db } from './db';
import { beaches } from '../shared/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * Import beaches from data/beaches.json to the database
 */
async function importBeaches() {
  try {
    console.log('Starting beach import process...');
    
    // Read beach data from JSON file
    const dataPath = path.join(process.cwd(), 'data', 'beaches.json');
    
    if (!fs.existsSync(dataPath)) {
      console.error('Beach data file not found at', dataPath);
      return;
    }
    
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    const beachData = JSON.parse(jsonData);
    
    console.log(`Found ${beachData.length} beaches in JSON file. Beginning import...`);
    
    // Count existing beaches
    const countResult = await db.select({ count: sql`count(*)` }).from(beaches);
    const currentCount = Number(countResult[0].count);
    console.log(`Current beach count in database: ${currentCount}`);
    
    // If we already have most beaches, we can skip
    if (currentCount >= 90) {
      console.log('Database already has sufficient beaches. Skipping import.');
      return;
    }
    
    // Get existing beach names to avoid duplicates
    const existingBeaches = await db.select({ name: beaches.name }).from(beaches);
    const existingBeachNames = existingBeaches.map(b => b.name);
    console.log(`Found ${existingBeachNames.length} existing beaches to skip.`);
    
    // Import each beach that doesn't already exist
    let imported = 0;
    let skipped = 0;
    
    for (const beach of beachData) {
      if (existingBeachNames.includes(beach.name)) {
        skipped++;
        continue;
      }
      
      try {
        // Insert the beach using Drizzle ORM
        await db.insert(beaches).values({
          name: beach.name,
          location: beach.location,
          province: beach.province,
          description: beach.description,
          imageUrl: beach.imageUrl,
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
        
        imported++;
        
        // Log progress periodically
        if (imported % 10 === 0) {
          console.log(`Imported ${imported} beaches so far...`);
        }
      } catch (error) {
        console.error(`Error importing beach ${beach.name}:`, error);
      }
    }
    
    console.log(`Beach import completed. Imported ${imported} new beaches. Skipped ${skipped} existing beaches.`);
    
    // Verify the final count
    const finalResult = await db.select({ count: sql`count(*)` }).from(beaches);
    const finalCount = Number(finalResult[0].count);
    console.log(`Total beaches in database: ${finalCount}`);
    
  } catch (error) {
    console.error('Error importing beaches:', error);
  }
}

// Run the import
importBeaches().catch(console.error);
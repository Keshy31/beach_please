import fs from 'fs';
import path from 'path';
import { db } from './db';
import { beaches } from '../shared/schema';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';

/**
 * Import beaches from data/beaches.json to the database
 */
async function importBeaches() {
  try {
    // Create a direct connection to Postgres for raw queries
    const sql = postgres(process.env.DATABASE_URL || '');
    
    // Count existing beaches
    const countResult = await sql`SELECT COUNT(*) as count FROM beaches`;
    const beachCount = Number(countResult[0].count);
    
    console.log(`Current number of beaches in database: ${beachCount}`);
    
    // If we already have most of the beaches, we can skip
    if (beachCount >= 90) {
      console.log('Database already has sufficient beaches. Skipping import.');
      return;
    }
    
    // Read beach data from JSON file
    const dataPath = path.join(process.cwd(), 'data', 'beaches.json');
    
    if (!fs.existsSync(dataPath)) {
      console.error('Beach data file not found at', dataPath);
      return;
    }
    
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    let beachData = JSON.parse(jsonData);
    
    console.log(`Found ${beachData.length} beaches in JSON file. Beginning import...`);
    
    // Import each beach one at a time
    for (let i = 0; i < beachData.length; i++) {
      const beach = beachData[i];
      
      // Process boolean values
      const processedBeach = {
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
      };
      
      // Check if beach already exists
      const existing = await db.select()
        .from(beaches)
        .where(eq(beaches.name, beach.name))
        .limit(1);
      
      if (existing.length > 0) {
        console.log(`Beach already exists: ${beach.name}`);
        continue;
      }
      
      // Insert the beach
      await db.insert(beaches).values(processedBeach);
      
      // Log progress periodically
      if (i % 10 === 0) {
        console.log(`Imported ${i} of ${beachData.length} beaches...`);
      }
    }
    
    console.log('Beach import completed successfully!');
    
    // Verify the final count
    const finalCount = await sql`SELECT COUNT(*) as count FROM beaches`;
    console.log(`Total beaches in database: ${finalCount[0].count}`);
    
    // Close the SQL connection
    await sql.end();
    
  } catch (error) {
    console.error('Error importing beaches:', error);
  }
}

// Run the import
importBeaches().catch(console.error);
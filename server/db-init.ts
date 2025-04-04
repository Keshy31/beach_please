import { db } from './db';
import { beaches, votes } from '../shared/schema';
import { MemStorage } from './storage';
import { sql } from 'drizzle-orm';

/**
 * Initialize the database by creating tables and migrating data from the in-memory storage
 */
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Check if beaches table exists
    const tablesExist = await checkTablesExist();
    
    if (!tablesExist) {
      console.log('Creating database tables...');
      await createTables();
      console.log('Tables created successfully');
      
      // Migrate data from in-memory storage
      await migrateData();
    } else {
      console.log('Database tables already exist');
    }
    
    console.log('Database initialization complete');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

/**
 * Check if the database tables already exist
 */
async function checkTablesExist(): Promise<boolean> {
  try {
    // Try to query the beaches table - if it exists, this will succeed
    await db.select({ count: sql`count(*)` }).from(beaches);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Create the database tables
 */
async function createTables() {
  // Create beaches table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "beaches" (
      "id" SERIAL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "location" TEXT NOT NULL,
      "province" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "image_url" TEXT NOT NULL,
      "rating" INTEGER NOT NULL DEFAULT 1500,
      "previous_rating" INTEGER,
      "previous_rank" INTEGER,
      "is_swimming" INTEGER DEFAULT 0,
      "is_surfing" INTEGER DEFAULT 0,
      "is_blue_flag" INTEGER DEFAULT 0,
      "is_fishing" INTEGER DEFAULT 0,
      "has_lifeguards" INTEGER DEFAULT 0,
      "has_facilities" INTEGER DEFAULT 0
    )
  `);
  
  // Create votes table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "votes" (
      "id" SERIAL PRIMARY KEY,
      "winner_beach_id" INTEGER NOT NULL,
      "loser_beach_id" INTEGER NOT NULL,
      "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "voter_name" TEXT DEFAULT 'Anonymous',
      "winner_rating_change" INTEGER,
      "loser_rating_change" INTEGER,
      "winner_previous_rating" INTEGER,
      "loser_previous_rating" INTEGER
    )
  `);
}

/**
 * Migrate data from in-memory storage to the database
 */
async function migrateData() {
  console.log('Migrating data from in-memory storage to database...');
  
  // Create a temporary in-memory storage instance to get its sample data
  const memStorage = new MemStorage();
  
  // Get all beaches from in-memory storage
  const allBeaches = await memStorage.getAllBeaches();
  
  if (allBeaches.length > 0) {
    console.log(`Migrating ${allBeaches.length} beaches...`);
    
    // Insert each beach into the database
    for (const beach of allBeaches) {
      await db.insert(beaches).values(beach);
    }
    
    console.log('Beach data migration complete');
  } else {
    console.log('No beaches to migrate');
  }
  
  // Get all votes from in-memory storage
  const allVotes = await memStorage.getRecentVotes(999);
  
  if (allVotes.length > 0) {
    console.log(`Migrating ${allVotes.length} votes...`);
    
    // Insert each vote into the database
    for (const vote of allVotes) {
      await db.insert(votes).values(vote);
    }
    
    console.log('Vote data migration complete');
  } else {
    console.log('No votes to migrate');
  }
}
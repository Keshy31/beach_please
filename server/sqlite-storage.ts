import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';
import { Beach, InsertBeach, Beach as BeachType, Vote, InsertVote } from "@shared/schema";
import { IStorage } from './storage';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { beaches, votes } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { calculateEloRatings } from '../client/src/lib/elo';

export class SQLiteStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private sqlite: Database.Database;

  constructor() {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Initialize SQLite database
    const dbPath = path.join(dataDir, 'beaches.sqlite');
    console.log(`Using SQLite database at: ${dbPath}`);
    
    this.sqlite = new Database(dbPath);
    this.db = drizzle(this.sqlite);
    
    // Initialize database (create tables)
    this.initializeDatabase();
    
    // Import initial data if database is empty
    this.importInitialData();
  }

  private initializeDatabase() {
    // Create tables if they don't exist
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS beaches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        province TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 1500,
        previous_rating INTEGER,
        previous_rank INTEGER,
        is_swimming INTEGER DEFAULT 0,
        is_surfing INTEGER DEFAULT 0,
        is_blue_flag INTEGER DEFAULT 0,
        is_fishing INTEGER DEFAULT 0,
        has_lifeguards INTEGER DEFAULT 0,
        has_facilities INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        winner_beach_id INTEGER NOT NULL,
        loser_beach_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        voter_name TEXT DEFAULT 'Anonymous',
        winner_rating_change INTEGER,
        loser_rating_change INTEGER,
        winner_previous_rating INTEGER,
        loser_previous_rating INTEGER
      );
    `);
  }

  private async importInitialData() {
    // Check if beaches table is empty
    const beachCount = this.sqlite.prepare('SELECT COUNT(*) as count FROM beaches').get() as { count: number };
    
    if (beachCount.count === 0) {
      try {
        // Try to load beaches from the JSON file
        const dataFilePath = path.join(process.cwd(), 'data', 'beaches.json');
        
        if (fs.existsSync(dataFilePath)) {
          const beachesData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
          console.log(`Loaded ${beachesData.length} beaches from data/beaches.json`);
          
          // Insert beaches from JSON
          const insertBeach = this.sqlite.prepare(`
            INSERT INTO beaches (
              name, location, province, description, image_url, rating, 
              is_swimming, is_surfing, is_blue_flag, is_fishing, has_lifeguards, has_facilities
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          
          const insertMany = this.sqlite.transaction((beaches) => {
            for (const beach of beaches) {
              insertBeach.run(
                beach.name,
                beach.location,
                beach.province,
                beach.description,
                beach.imageUrl,
                beach.rating || 1500,
                beach.isSwimming || 0,
                beach.isSurfing || 0,
                beach.isBlueFlag || 0,
                beach.isFishing || 0,
                beach.hasLifeguards || 0,
                beach.hasFacilities || 0
              );
            }
          });
          
          insertMany(beachesData);
        } else {
          // Insert sample beaches
          const sampleBeaches = this.getSampleBeaches();
          for (const beach of sampleBeaches) {
            await this.createBeach(beach);
          }
          console.log(`Created ${sampleBeaches.length} sample beaches`);
        }
      } catch (error) {
        console.error("Error importing initial data:", error);
        
        // Insert sample beaches as fallback
        const sampleBeaches = this.getSampleBeaches();
        for (const beach of sampleBeaches) {
          await this.createBeach(beach);
        }
        console.log(`Created ${sampleBeaches.length} sample beaches`);
      }
    }
  }

  private getSampleBeaches(): InsertBeach[] {
    return [
      {
        name: "Clifton Beach",
        location: "Cape Town",
        province: "Western Cape",
        description: "A beautiful beach known for crystal clear water and white sand",
        imageUrl: "https://images.unsplash.com/photo-1597552661163-6c6df637aece",
        isSwimming: 1,
        isSurfing: 1,
        isBlueFlag: 1,
        isFishing: 0,
        hasLifeguards: 1,
        hasFacilities: 1
      },
      {
        name: "Muizenberg Beach",
        location: "Cape Town",
        province: "Western Cape",
        description: "Popular for surfing and colorful beach huts",
        imageUrl: "https://images.unsplash.com/photo-1614505896356-4dfbdc0524d6",
        isSwimming: 1,
        isSurfing: 1,
        isBlueFlag: 0,
        isFishing: 0,
        hasLifeguards: 1,
        hasFacilities: 1
      },
      {
        name: "Umhlanga Rocks",
        location: "Durban",
        province: "KwaZulu-Natal",
        description: "Golden sands and warm waters of the Indian Ocean",
        imageUrl: "https://images.unsplash.com/photo-1549554307-96e97fdef321",
        isSwimming: 1,
        isSurfing: 0,
        isBlueFlag: 1,
        isFishing: 1,
        hasLifeguards: 1,
        hasFacilities: 1
      }
    ];
  }

  async getAllBeaches(): Promise<BeachType[]> {
    return await this.db.select().from(beaches);
  }

  async getBeachById(id: number): Promise<BeachType | undefined> {
    const results = await this.db.select().from(beaches).where(eq(beaches.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getRandomBeachPair(): Promise<[BeachType, BeachType]> {
    // Get random pair of beaches (ensure they are different)
    const allBeaches = await this.getAllBeaches();
    
    if (allBeaches.length < 2) {
      throw new Error("Not enough beaches to create a pair");
    }
    
    const shuffled = [...allBeaches].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }

  async createBeach(beach: InsertBeach): Promise<BeachType> {
    const result = await this.db.insert(beaches).values(beach).returning();
    return result[0];
  }

  async updateBeach(beach: BeachType): Promise<BeachType> {
    await this.db.update(beaches).set(beach).where(eq(beaches.id, beach.id));
    return beach;
  }

  async recordVote(vote: InsertVote): Promise<Vote> {
    // Get the beaches
    const winner = await this.getBeachById(vote.winnerBeachId);
    const loser = await this.getBeachById(vote.loserBeachId);
    
    if (!winner || !loser) {
      throw new Error("Beach not found");
    }
    
    // Calculate new ELO ratings
    const { winner: newWinnerRating, loser: newLoserRating } = calculateEloRatings(
      winner.rating,
      loser.rating,
      32 // K-factor determines how much ratings can change
    );
    
    // Calculate rating changes
    const winnerRatingChange = newWinnerRating - winner.rating;
    const loserRatingChange = newLoserRating - loser.rating;
    
    // Save previous ratings
    const winnerPreviousRating = winner.rating;
    const loserPreviousRating = loser.rating;
    
    // Use direct SQL insert to avoid type issues
    const stmt = this.sqlite.prepare(`
      INSERT INTO votes (
        winner_beach_id, loser_beach_id, created_at, voter_name,
        winner_rating_change, loser_rating_change,
        winner_previous_rating, loser_previous_rating
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const now = new Date().toISOString();
    const result = stmt.run(
      vote.winnerBeachId,
      vote.loserBeachId,
      now,
      vote.voterName || 'Anonymous',
      winnerRatingChange,
      loserRatingChange,
      winnerPreviousRating,
      loserPreviousRating
    );
    
    // Update beach ratings
    await this.db.update(beaches)
      .set({ 
        rating: newWinnerRating,
        previousRating: winnerPreviousRating
      })
      .where(eq(beaches.id, winner.id));
    
    await this.db.update(beaches)
      .set({ 
        rating: newLoserRating,
        previousRating: loserPreviousRating
      })
      .where(eq(beaches.id, loser.id));
    
    // Update rankings
    await this.updateRankings();
    
    // Fetch the inserted vote
    const insertedVote = this.sqlite.prepare(`
      SELECT * FROM votes WHERE id = ?
    `).get(result.lastInsertRowid) as Vote;
    
    return insertedVote;
  }

  async getRecentVotes(limit: number): Promise<Vote[]> {
    // Get votes sorted by creation time (most recent first)
    // Use raw SQL sort for date strings
    const result = this.sqlite.prepare(`
      SELECT * FROM votes ORDER BY created_at DESC LIMIT ?
    `).all(limit);
    return result as Vote[];
  }

  async getRankedBeaches(): Promise<BeachType[]> {
    // Return beaches sorted by rating (highest first)
    return await this.db.select().from(beaches).orderBy(desc(beaches.rating));
  }

  async updateRankings(): Promise<void> {
    const rankedBeaches = await this.getRankedBeaches();
    
    // Update previous rank for each beach
    for (let i = 0; i < rankedBeaches.length; i++) {
      const beach = rankedBeaches[i];
      const previousRank = beach.previousRank || i + 1;
      
      await this.db.update(beaches)
        .set({ previousRank })
        .where(eq(beaches.id, beach.id));
    }
  }
}

export const sqliteStorage = new SQLiteStorage();
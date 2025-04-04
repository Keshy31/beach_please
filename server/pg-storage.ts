import { eq, desc, asc } from "drizzle-orm";
import { db } from "./db";
import { beaches, votes } from "../shared/schema";
import { Beach as BeachType, Vote, InsertBeach, InsertVote } from "../shared/schema";
import { IStorage } from "./storage";

export class PgStorage implements IStorage {
  
  constructor() {
    console.log("PostgreSQL storage initialized");
  }

  // Beach operations
  async getAllBeaches(): Promise<BeachType[]> {
    return await db.select().from(beaches);
  }

  async getBeachById(id: number): Promise<BeachType | undefined> {
    const result = await db.select().from(beaches).where(eq(beaches.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getRandomBeachPair(): Promise<[BeachType, BeachType]> {
    const allBeaches = await this.getAllBeaches();
    
    // Ensure we have at least 2 beaches
    if (allBeaches.length < 2) {
      throw new Error("Not enough beaches in the database");
    }
    
    // Select two random beaches
    let index1 = Math.floor(Math.random() * allBeaches.length);
    let index2 = Math.floor(Math.random() * allBeaches.length);
    
    // Make sure they're different
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * allBeaches.length);
    }
    
    return [allBeaches[index1], allBeaches[index2]];
  }

  async createBeach(beach: InsertBeach): Promise<BeachType> {
    const insertData = {
      ...beach,
      rating: 1500,
      previousRating: 1500,
      previousRank: 0
    };
    
    const [result] = await db.insert(beaches).values(insertData).returning();
    return result;
  }

  async updateBeach(beach: BeachType): Promise<BeachType> {
    const [result] = await db
      .update(beaches)
      .set(beach)
      .where(eq(beaches.id, beach.id))
      .returning();
    
    return result;
  }
  
  // Vote operations
  async recordVote(vote: InsertVote): Promise<Vote> {
    // Get beaches
    const winnerBeach = await this.getBeachById(vote.winnerBeachId);
    const loserBeach = await this.getBeachById(vote.loserBeachId);
    
    if (!winnerBeach || !loserBeach) {
      throw new Error("Invalid beach IDs in vote");
    }
    
    // Recalculate ratings using ELO algorithm
    // K-factor of 32 is commonly used for ELO systems
    const K = 32;
    
    // Store previous ratings
    const winnerPreviousRating = winnerBeach.rating;
    const loserPreviousRating = loserBeach.rating;
    
    // Calculate expected outcomes
    const expectedWinner = 1 / (1 + Math.pow(10, (loserBeach.rating - winnerBeach.rating) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerBeach.rating - loserBeach.rating) / 400));
    
    // Calculate new ratings
    const newWinnerRating = Math.round(winnerBeach.rating + K * (1 - expectedWinner));
    const newLoserRating = Math.round(loserBeach.rating + K * (0 - expectedLoser));
    
    // Calculate rating changes
    const winnerRatingChange = newWinnerRating - winnerPreviousRating;
    const loserRatingChange = newLoserRating - loserPreviousRating;
    
    // Create vote with rating changes
    const voteData = {
      winnerBeachId: vote.winnerBeachId,
      loserBeachId: vote.loserBeachId,
      voterName: vote.voterName || 'Anonymous',
      winnerRatingChange: winnerRatingChange,
      loserRatingChange: loserRatingChange,
      winnerPreviousRating: winnerPreviousRating,
      loserPreviousRating: loserPreviousRating,
    };
    
    // Insert vote into database
    const [newVote] = await db.insert(votes).values(voteData).returning();
    
    // Update beach ratings
    winnerBeach.previousRating = winnerPreviousRating;
    loserBeach.previousRating = loserPreviousRating;
    winnerBeach.rating = newWinnerRating;
    loserBeach.rating = newLoserRating;
    
    // Update beaches
    await this.updateBeach(winnerBeach);
    await this.updateBeach(loserBeach);
    
    // Update rankings
    await this.updateRankings();
    
    return newVote;
  }

  async getRecentVotes(limit: number): Promise<Vote[]> {
    return await db
      .select()
      .from(votes)
      .orderBy(desc(votes.createdAt))
      .limit(limit);
  }
  
  // Ranking operations
  async getRankedBeaches(): Promise<BeachType[]> {
    return await db
      .select()
      .from(beaches)
      .orderBy(desc(beaches.rating));
  }

  async updateRankings(): Promise<void> {
    const rankedBeaches = await this.getRankedBeaches();
    
    // Update previous rank for each beach
    for (let i = 0; i < rankedBeaches.length; i++) {
      const beach = rankedBeaches[i];
      beach.previousRank = beach.previousRank || i + 1;
      await this.updateBeach(beach);
    }
    
    // Get fresh ranked list and update current ranks
    const freshRankedBeaches = await this.getRankedBeaches();
    
    for (let i = 0; i < freshRankedBeaches.length; i++) {
      const beach = freshRankedBeaches[i];
      const currentRank = i + 1;
      const updatedBeach = { ...beach, previousRank: beach.previousRank || currentRank };
      await this.updateBeach(updatedBeach);
    }
  }
}
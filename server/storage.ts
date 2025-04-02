import { Beach, InsertBeach, Beach as BeachType, Vote, InsertVote } from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';

export interface IStorage {
  // Beach operations
  getAllBeaches(): Promise<BeachType[]>;
  getBeachById(id: number): Promise<BeachType | undefined>;
  getRandomBeachPair(): Promise<[BeachType, BeachType]>;
  createBeach(beach: InsertBeach): Promise<BeachType>;
  updateBeach(beach: BeachType): Promise<BeachType>;
  
  // Vote operations
  recordVote(vote: InsertVote): Promise<Vote>;
  getRecentVotes(limit: number): Promise<Vote[]>;
  
  // Ranking operations
  getRankedBeaches(): Promise<BeachType[]>;
  updateRankings(): Promise<void>;
}

export class MemStorage implements IStorage {
  private beaches: Map<number, BeachType>;
  private votes: Map<number, Vote>;
  private beachIdCounter: number;
  private voteIdCounter: number;

  constructor() {
    this.beaches = new Map();
    this.votes = new Map();
    this.beachIdCounter = 1;
    this.voteIdCounter = 1;
    
    // Initialize with beaches from our extracted data
    this.initializeBeaches();
  }

  private initializeBeaches() {
    let beachData: InsertBeach[] = [];
    
    try {
      // Try to load from extracted_data/beaches_with_authentic_images.json first
      const authenticPath = path.join(process.cwd(), 'extracted_data', 'beaches_with_authentic_images.json');
      if (fs.existsSync(authenticPath)) {
        const jsonData = fs.readFileSync(authenticPath, 'utf-8');
        beachData = JSON.parse(jsonData);
        console.log(`Loaded ${beachData.length} beaches from beaches_with_authentic_images.json`);
      } else {
        // Fallback to beaches_with_better_images.json if authentic images don't exist
        const betterImagesPath = path.join(process.cwd(), 'extracted_data', 'beaches_with_better_images.json');
        if (fs.existsSync(betterImagesPath)) {
          const jsonData = fs.readFileSync(betterImagesPath, 'utf-8');
          beachData = JSON.parse(jsonData);
          console.log(`Loaded ${beachData.length} beaches from beaches_with_better_images.json`);
        } else {
          // Fallback to enriched data if better images file doesn't exist
          const fallbackPath = path.join(process.cwd(), 'extracted_data', 'beaches_enriched.json');
          if (fs.existsSync(fallbackPath)) {
            const jsonData = fs.readFileSync(fallbackPath, 'utf-8');
            beachData = JSON.parse(jsonData);
            console.log(`Loaded ${beachData.length} beaches from beaches_enriched.json`);
          } else {
            // Fallback to sample data if no beach data files exist
            console.log('Beach data files not found, using sample beaches');
            beachData = this.getSampleBeaches();
          }
        }
      }
    } catch (error) {
      console.error('Error loading beach data:', error);
      // Fallback to sample data if there's an error
      beachData = this.getSampleBeaches();
    }

    // Initialize with random ratings between 1450-1550 to create some initial variety
    beachData.forEach(beach => {
      const initialRating = Math.floor(1450 + Math.random() * 100);
      const newBeach: BeachType = {
        id: this.beachIdCounter++,
        ...beach,
        rating: initialRating,
        previousRating: initialRating,
        previousRank: 0 // Will be updated on first ranking calculation
      };
      this.beaches.set(newBeach.id, newBeach);
    });
    
    // Set initial rankings
    this.updateRankings();
  }
  
  private getSampleBeaches(): InsertBeach[] {
    return [
      {
        name: "Clifton 4th Beach",
        location: "Cape Town",
        province: "Western Cape",
        description: "One of Cape Town's most fashionable beaches, known for crystal-clear water, white sand, and spectacular mountain views.",
        imageUrl: "https://images.unsplash.com/photo-1599942237521-37383b96a0b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      },
      {
        name: "Camps Bay Beach",
        location: "Cape Town",
        province: "Western Cape",
        description: "A trendy beach with palm trees, white sand and a vibrant atmosphere. Popular with locals and tourists alike.",
        imageUrl: "https://images.unsplash.com/photo-1518726432375-a9cde706a283?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      },
      {
        name: "Boulders Beach",
        location: "Simon's Town",
        province: "Western Cape",
        description: "Famous for its colony of African penguins, Boulders Beach offers sheltered coves and beautiful swimming areas.",
        imageUrl: "https://images.unsplash.com/photo-1580060839202-3951fa5a2180?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      },
      {
        name: "Llandudno Beach",
        location: "Cape Town",
        province: "Western Cape",
        description: "A picturesque beach surrounded by mountains and large granite boulders, popular with surfers and sunbathers.",
        imageUrl: "https://images.unsplash.com/photo-1542509631-e5111aef2487?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      },
      {
        name: "Coffee Bay",
        location: "Wild Coast",
        province: "Eastern Cape",
        description: "A stunning rural beach with dramatic cliffs, offering beautiful views of the famous Hole in the Wall rock formation.",
        imageUrl: "https://images.unsplash.com/photo-1551693965-ac1d6536d242?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      },
      {
        name: "Umhlanga Rocks",
        location: "Durban",
        province: "KwaZulu-Natal",
        description: "A popular beach destination with golden sands, warm waters, and the iconic red and white lighthouse.",
        imageUrl: "https://images.unsplash.com/photo-1600177897995-e67c73ed44e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      },
      {
        name: "Sodwana Bay",
        location: "iSimangaliso Wetland Park",
        province: "KwaZulu-Natal",
        description: "A premier diving destination with spectacular coral reefs and a wide variety of marine life.",
        imageUrl: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      },
      {
        name: "Cape Vidal",
        location: "iSimangaliso Wetland Park",
        province: "KwaZulu-Natal",
        description: "A beautiful beach in iSimangaliso Wetland Park, known for its pristine waters and coral reefs perfect for snorkeling.",
        imageUrl: "https://images.unsplash.com/photo-1534461434297-2c193151d8c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      },
      {
        name: "Jeffreys Bay",
        location: "Jeffreys Bay",
        province: "Eastern Cape",
        description: "World-renowned for its perfect waves, J-Bay is a surfer's paradise and host to international surfing competitions.",
        imageUrl: "https://images.unsplash.com/photo-1526431307837-e5b06f387aac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      },
      {
        name: "Muizenberg Beach",
        location: "Cape Town",
        province: "Western Cape",
        description: "Famous for its colorful beach huts and gentle waves, making it perfect for beginner surfers.",
        imageUrl: "https://images.unsplash.com/photo-1541420937988-702d78cb8edf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      },
      {
        name: "Nahoon Beach",
        location: "East London",
        province: "Eastern Cape",
        description: "A long stretch of pristine sand and great waves, popular with surfers and swimmers alike.",
        imageUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      },
      {
        name: "Humewood Beach",
        location: "Port Elizabeth",
        province: "Eastern Cape",
        description: "One of South Africa's oldest Blue Flag beaches with excellent swimming conditions and facilities.",
        imageUrl: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
      }
    ];
  }

  async getAllBeaches(): Promise<BeachType[]> {
    return Array.from(this.beaches.values());
  }

  async getBeachById(id: number): Promise<BeachType | undefined> {
    return this.beaches.get(id);
  }

  async getRandomBeachPair(): Promise<[BeachType, BeachType]> {
    const beaches = Array.from(this.beaches.values());
    
    // Ensure we have at least 2 beaches
    if (beaches.length < 2) {
      throw new Error("Not enough beaches in the database");
    }
    
    // Select two random beaches
    let index1 = Math.floor(Math.random() * beaches.length);
    let index2 = Math.floor(Math.random() * beaches.length);
    
    // Make sure they're different
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * beaches.length);
    }
    
    return [beaches[index1], beaches[index2]];
  }

  async createBeach(beach: InsertBeach): Promise<BeachType> {
    const newBeach: BeachType = {
      id: this.beachIdCounter++,
      ...beach,
      rating: 1500,
      previousRating: 1500,
      previousRank: 0
    };
    
    this.beaches.set(newBeach.id, newBeach);
    return newBeach;
  }

  async updateBeach(beach: BeachType): Promise<BeachType> {
    this.beaches.set(beach.id, beach);
    return beach;
  }

  async recordVote(vote: InsertVote): Promise<Vote> {
    // Get beaches
    const winnerBeach = await this.getBeachById(vote.winnerBeachId);
    const loserBeach = await this.getBeachById(vote.loserBeachId);
    
    if (!winnerBeach || !loserBeach) {
      throw new Error("Invalid beach IDs in vote");
    }
    
    // Create new vote record
    const newVote: Vote = {
      id: this.voteIdCounter++,
      winnerBeachId: vote.winnerBeachId,
      loserBeachId: vote.loserBeachId,
      voterName: vote.voterName || 'Anonymous',
      createdAt: new Date()
    };
    
    this.votes.set(newVote.id, newVote);
    
    // Recalculate ratings using ELO algorithm
    // K-factor of 32 is commonly used for ELO systems
    const K = 32;
    
    // Calculate expected outcomes
    const expectedWinner = 1 / (1 + Math.pow(10, (loserBeach.rating - winnerBeach.rating) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerBeach.rating - loserBeach.rating) / 400));
    
    // Store previous ratings
    winnerBeach.previousRating = winnerBeach.rating;
    loserBeach.previousRating = loserBeach.rating;
    
    // Calculate new ratings
    winnerBeach.rating = Math.round(winnerBeach.rating + K * (1 - expectedWinner));
    loserBeach.rating = Math.round(loserBeach.rating + K * (0 - expectedLoser));
    
    // Update beaches
    await this.updateBeach(winnerBeach);
    await this.updateBeach(loserBeach);
    
    // Update rankings
    await this.updateRankings();
    
    return newVote;
  }

  async getRecentVotes(limit: number): Promise<Vote[]> {
    // Get all votes sorted by creation time (most recent first)
    const allVotes = Array.from(this.votes.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return allVotes.slice(0, limit);
  }

  async getRankedBeaches(): Promise<BeachType[]> {
    // Return beaches sorted by rating (highest first)
    return Array.from(this.beaches.values())
      .sort((a, b) => b.rating - a.rating);
  }

  async updateRankings(): Promise<void> {
    const rankedBeaches = await this.getRankedBeaches();
    
    // Update previous rank for each beach
    rankedBeaches.forEach((beach, index) => {
      beach.previousRank = beach.previousRank || index + 1;
      const updatedBeach = { ...beach, previousRank: beach.previousRank };
      this.beaches.set(beach.id, updatedBeach);
    });
    
    // Get fresh ranked list and update current ranks
    const freshRankedBeaches = await this.getRankedBeaches();
    freshRankedBeaches.forEach((beach, index) => {
      const currentRank = index + 1;
      const updatedBeach = { ...beach, previousRank: beach.previousRank || currentRank };
      this.beaches.set(beach.id, updatedBeach);
    });
  }
}

export const storage = new MemStorage();

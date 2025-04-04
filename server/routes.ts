import type { Express } from "express";
import { createServer, type Server } from "http";
import { sqliteStorage as storage } from "./sqlite-storage";
import { insertVoteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Get all beaches
  app.get("/api/beaches", async (_req, res) => {
    try {
      const beaches = await storage.getAllBeaches();
      res.json(beaches);
    } catch (error) {
      console.error("Error fetching beaches:", error);
      res.status(500).json({ message: "Failed to fetch beaches" });
    }
  });
  
  // Get a random pair of beaches for voting
  app.get("/api/beaches/pair", async (_req, res) => {
    try {
      const pair = await storage.getRandomBeachPair();
      res.json(pair);
    } catch (error) {
      console.error("Error fetching beach pair:", error);
      res.status(500).json({ message: "Failed to fetch beach pair" });
    }
  });
  
  // Get beach by ID
  app.get("/api/beaches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid beach ID" });
      }
      
      const beach = await storage.getBeachById(id);
      if (!beach) {
        return res.status(404).json({ message: "Beach not found" });
      }
      
      res.json(beach);
    } catch (error) {
      console.error("Error fetching beach:", error);
      res.status(500).json({ message: "Failed to fetch beach" });
    }
  });
  
  // Get ranked beaches
  app.get("/api/rankings", async (_req, res) => {
    try {
      const rankedBeaches = await storage.getRankedBeaches();
      res.json(rankedBeaches);
    } catch (error) {
      console.error("Error fetching rankings:", error);
      res.status(500).json({ message: "Failed to fetch rankings" });
    }
  });
  
  // Record a vote
  app.post("/api/votes", async (req, res) => {
    try {
      const vote = req.body;
      
      // Validate vote data
      const result = insertVoteSchema.safeParse(vote);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid vote data", 
          errors: result.error.errors 
        });
      }
      
      // Check if winner and loser are different
      if (vote.winnerBeachId === vote.loserBeachId) {
        return res.status(400).json({ 
          message: "Winner and loser beaches must be different" 
        });
      }
      
      // Record the vote
      const newVote = await storage.recordVote(vote);
      
      // Get updated rankings
      const rankings = await storage.getRankedBeaches();
      
      res.status(201).json({ vote: newVote, rankings });
    } catch (error) {
      console.error("Error recording vote:", error);
      res.status(500).json({ message: "Failed to record vote" });
    }
  });
  
  // Get recent votes
  app.get("/api/votes/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentVotes = await storage.getRecentVotes(limit);
      
      // Get all beaches to find ranks
      const rankedBeaches = await storage.getRankedBeaches();
      const beachRanks = new Map<number, number>();
      
      // Create a map of beach IDs to current ranks
      rankedBeaches.forEach((beach, index) => {
        beachRanks.set(beach.id, index + 1);
      });
      
      // Enhance vote data with beach names, images, and rating changes
      const enhancedVotes = await Promise.all(
        recentVotes.map(async (vote) => {
          const winner = await storage.getBeachById(vote.winnerBeachId);
          const loser = await storage.getBeachById(vote.loserBeachId);
          
          // Calculate current ranks
          const winnerCurrentRank = beachRanks.get(vote.winnerBeachId) || 0;
          const loserCurrentRank = beachRanks.get(vote.loserBeachId) || 0;
          
          return {
            ...vote,
            winnerName: winner?.name || "Unknown Beach",
            winnerProvince: winner?.province || "Unknown Province",
            loserName: loser?.name || "Unknown Beach",
            loserProvince: loser?.province || "Unknown Province",
            winnerImageUrl: winner?.imageUrl || "",
            loserImageUrl: loser?.imageUrl || "",
            // Add rank information
            winnerPreviousRank: winner?.previousRank || 0,
            winnerCurrentRank,
            loserPreviousRank: loser?.previousRank || 0,
            loserCurrentRank
          };
        })
      );
      
      res.json(enhancedVotes);
    } catch (error) {
      console.error("Error fetching recent votes:", error);
      res.status(500).json({ message: "Failed to fetch recent votes" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

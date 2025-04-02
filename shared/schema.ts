import { pgTable, text, serial, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Beach model
export const beaches = pgTable("beaches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  province: text("province").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: integer("rating").notNull().default(1500), // ELO rating starts at 1500
  previousRating: integer("previous_rating"), // For tracking changes
  previousRank: integer("previous_rank"), // For tracking rank changes
});

export const insertBeachSchema = createInsertSchema(beaches).omit({
  id: true,
  rating: true,
  previousRating: true,
  previousRank: true
});

// Vote model
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  winnerBeachId: integer("winner_beach_id").notNull(),
  loserBeachId: integer("loser_beach_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  voterName: text("voter_name").default("Anonymous"),
  winnerRatingChange: integer("winner_rating_change"),
  loserRatingChange: integer("loser_rating_change"),
  winnerPreviousRating: integer("winner_previous_rating"),
  loserPreviousRating: integer("loser_previous_rating"),
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
  winnerRatingChange: true,
  loserRatingChange: true,
  winnerPreviousRating: true,
  loserPreviousRating: true
});

// Types
export type Beach = typeof beaches.$inferSelect;
export type InsertBeach = z.infer<typeof insertBeachSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;

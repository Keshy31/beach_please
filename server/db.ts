import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";

// Get the database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a postgres connection
const queryClient = postgres(connectionString);

// Create a Drizzle ORM instance
export const db = drizzle(queryClient, { schema });
import type { Config } from "drizzle-kit";

import * as dotenv from "dotenv";
dotenv.config();

// This configuration works both locally and on Vercel
export default {
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // Ensure database URL is never undefined (empty string fallback)
    url: process.env.DATABASE_URL || "",
  },
  // Match all tables
  tablesFilter: ["*"],
} as Config;

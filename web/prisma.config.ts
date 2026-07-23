import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Runs on `prisma db seed` and after `prisma migrate dev`.
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations & seeding use a DIRECT connection (Supabase port 5432).
    // Falls back to DATABASE_URL for local / single-URL setups.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});

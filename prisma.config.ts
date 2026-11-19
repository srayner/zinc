// Prisma CLI config (Prisma 7): schema, migrations, seed and the database URL.
// Prisma 7 no longer loads environment files itself, so dotenv does it here for local CLI
// runs. In Docker, DATABASE_URL comes from the container's environment instead.
import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // process.env rather than Prisma's env(), which throws when the variable is missing:
    // `prisma generate` (in the Docker build) needs no database, while commands that do
    // connect still fail without a URL.
    url: process.env.DATABASE_URL,
  },
})

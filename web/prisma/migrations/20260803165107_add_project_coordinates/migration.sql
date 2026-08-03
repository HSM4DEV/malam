-- AlterTable
-- (Prisma's auto-diff also emitted a spurious "DROP INDEX
-- Project_searchVector_idx" / "ALTER COLUMN searchVector DROP DEFAULT" here,
-- since it doesn't understand the Unsupported("tsvector") column is a real
-- Postgres GENERATED column — that combination isn't valid DDL and the first
-- attempt at this migration failed partway through, after the DROP INDEX had
-- already committed against the real dev DB. That index was restored directly
-- against the real DB, outside this migration — it already exists on a
-- shadow/fresh DB via the original add_project_search_vector migration, so
-- this file only needs the actual new columns.)
ALTER TABLE "Project" ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION;

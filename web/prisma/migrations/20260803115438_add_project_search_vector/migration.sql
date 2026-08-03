-- to_tsvector(regconfig, text) is only STABLE (config lookup can theoretically
-- change), so Postgres rejects it directly inside a generated column. Pin it
-- behind our own IMMUTABLE wrapper — safe since the config ('simple') is a
-- hardcoded constant here, never looked up dynamically.
CREATE FUNCTION project_search_vector_immutable(
  project_name text,
  project_city text,
  project_district text,
  project_type text,
  project_tag text,
  project_blurb text,
  project_amenities text[]
) RETURNS tsvector AS $$
  SELECT
    setweight(to_tsvector('simple', coalesce(project_name, '')), 'A') ||
    setweight(to_tsvector('simple',
      coalesce(project_city, '') || ' ' || coalesce(project_district, '') || ' ' ||
      coalesce(project_type, '') || ' ' || coalesce(project_tag, '')
    ), 'B') ||
    setweight(to_tsvector('simple',
      coalesce(project_blurb, '') || ' ' || array_to_string(project_amenities, ' ')
    ), 'C')
$$ LANGUAGE sql IMMUTABLE;

-- AlterTable: weighted, Postgres-generated full-text search column.
ALTER TABLE "Project" ADD COLUMN "searchVector" tsvector
GENERATED ALWAYS AS (
  project_search_vector_immutable("name", "city", "district", "type", "tag", "blurb", "amenities")
) STORED;

-- CreateIndex
CREATE INDEX "Project_searchVector_idx" ON "Project" USING GIN ("searchVector");

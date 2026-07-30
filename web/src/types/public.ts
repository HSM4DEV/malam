/**
 * Shape of the data the public-facing site renders. Mirrors the decoupled
 * style of types/dashboard.ts — components depend on this contract, not on
 * Prisma models directly.
 */

export interface PublicProjectCard {
  slug: string;
  name: string;
  city: string;
  cityLabel: string;
  tag: string;
  imageSeed: string;
  imageAlt: string;
  imageUrl: string | null;
  bedsRangeLabel: string;
  bathsLabel: string;
  areaRangeLabel: string;
  priceLabel: string;
}

export interface PublicProjectListItem extends PublicProjectCard {
  district: string;
  type: string;
  priceFromMillions: number;
  minBeds: number;
  blurb: string | null;
}

export interface PublicProjectFilters {
  q?: string;
  city?: string;
  type?: string;
  minBeds?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc";
}

export interface PlatformStats {
  projectsLabel: string;
  unitsLabel: string;
  citiesLabel: string;
}

export interface PublicUnitType {
  typeName: string;
  areaSqm: number;
  beds: number;
  baths: number;
  floorLabel: string;
  priceMillions: number;
  status: "available" | "reserved" | "sold";
  count: number;
}

export interface PublicProjectDetails {
  id: string;
  slug: string;
  name: string;
  city: string;
  district: string;
  type: string;
  tag: string;
  blurb: string | null;
  amenities: string[];
  imageSeed: string;
  imageAlt: string;
  imageUrl: string | null;
  priceFromMillions: number;
  priceLabel: string;
  totalUnits: number;
  unitTypes: PublicUnitType[];
  company: {
    slug: string;
    name: string;
    logoUrl: string | null;
    avatarSeed: string | null;
    bio: string | null;
    city: string | null;
    foundedYearsAgo: number | null;
    publishedProjectsCount: number;
    contactName: string | null;
    contactTitle: string | null;
  };
}

export interface DeveloperProfile {
  slug: string;
  name: string;
  logoUrl: string | null;
  avatarSeed: string | null;
  bio: string | null;
  city: string | null;
  foundedYearsAgo: number | null;
  projects: PublicProjectCard[];
}

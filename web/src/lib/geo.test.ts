import { describe, expect, it } from "vitest";
import { haversineDistanceKm, osmEmbedUrl, googleMapsUrl } from "./geo";

describe("haversineDistanceKm", () => {
  it("returns zero for identical points", () => {
    const point = { lat: 24.7136, lng: 46.6753 };
    expect(haversineDistanceKm(point, point)).toBe(0);
  });

  it("is symmetric", () => {
    const a = { lat: 24.7635, lng: 46.6412 };
    const b = { lat: 24.9578, lng: 46.6989 };
    expect(haversineDistanceKm(a, b)).toBeCloseTo(haversineDistanceKm(b, a), 10);
  });

  it("matches the known ~111.19km distance for one degree of longitude at the equator", () => {
    const a = { lat: 0, lng: 0 };
    const b = { lat: 0, lng: 1 };
    expect(haversineDistanceKm(a, b)).toBeCloseTo(111.19, 1);
  });

  it("matches the known ~111.19km distance for one degree of latitude", () => {
    const a = { lat: 0, lng: 0 };
    const b = { lat: 1, lng: 0 };
    expect(haversineDistanceKm(a, b)).toBeCloseTo(111.19, 1);
  });
});

describe("osmEmbedUrl", () => {
  it("builds a bbox around the point using the default delta", () => {
    const url = osmEmbedUrl(24.7477, 46.5719);
    expect(url).toBe(
      "https://www.openstreetmap.org/export/embed.html?bbox=46.5619,24.737699999999997,46.5819,24.7577&layer=mapnik&marker=24.7477,46.5719",
    );
  });

  it("respects a custom delta", () => {
    const url = osmEmbedUrl(0, 0, 1);
    expect(url).toContain("bbox=-1,-1,1,1");
    expect(url).toContain("marker=0,0");
  });
});

describe("googleMapsUrl", () => {
  it("builds a plain lat,lng query link", () => {
    expect(googleMapsUrl(24.7477, 46.5719)).toBe("https://www.google.com/maps?q=24.7477,46.5719");
  });
});

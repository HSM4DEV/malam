import { describe, expect, it } from "vitest";
import { slugify } from "./utils";

describe("slugify", () => {
  it("lowercases and hyphenates a Latin name", () => {
    expect(slugify("Vision Group Realty")).toBe("vision-group-realty");
  });

  it("collapses non-alphanumeric runs to a single hyphen", () => {
    expect(slugify("Al-Shammari  &  Co.")).toBe("al-shammari-co");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("  --Leading and Trailing--  ")).toBe("leading-and-trailing");
  });

  it("collapses a purely Arabic (non-Latin) name to an empty string — callers must handle this", () => {
    // Documented behavior in utils.ts: this transliteration-free slugify
    // can't represent Arabic names, so every character gets stripped.
    // uniqueCompanySlug() in lib/data/admin-applications.ts relies on this
    // exact empty-string outcome to fall back to a random slug instead.
    expect(slugify("مجموعة فيجن العقارية")).toBe("");
  });

  it("preserves digits", () => {
    expect(slugify("Project 42")).toBe("project-42");
  });
});

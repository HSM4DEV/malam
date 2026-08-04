import { describe, expect, it } from "vitest";
import { projectSchema } from "./project";

const BASE = {
  name: "فلل الياسمين",
  city: "الرياض",
  district: "الياسمين",
  type: "فيلا",
  status: "PUBLISHED" as const,
  priceFromMillions: "4.8",
  tag: "حصري",
  blurb: "",
  amenities: "",
};

describe("projectSchema — latitude/longitude", () => {
  it("leaves latitude/longitude undefined when the fields are blank (not 0)", () => {
    const result = projectSchema.parse({ ...BASE, latitude: "", longitude: "" });
    expect(result.latitude).toBeUndefined();
    expect(result.longitude).toBeUndefined();
  });

  it("leaves latitude/longitude undefined when the fields are missing entirely", () => {
    // BASE itself never sets latitude/longitude — this is that case directly.
    const result = projectSchema.parse(BASE);
    expect(result.latitude).toBeUndefined();
    expect(result.longitude).toBeUndefined();
  });

  it("coerces a real numeric string to a number", () => {
    const result = projectSchema.parse({ ...BASE, latitude: "24.7477", longitude: "46.5719" });
    expect(result.latitude).toBe(24.7477);
    expect(result.longitude).toBe(46.5719);
  });

  it.each([
    ["-90", true],
    ["90", true],
    ["-90.1", false],
    ["90.1", false],
  ])("latitude=%s valid=%s", (value, valid) => {
    const result = projectSchema.safeParse({ ...BASE, latitude: value, longitude: "0" });
    expect(result.success).toBe(valid);
  });

  it.each([
    ["-180", true],
    ["180", true],
    ["-180.1", false],
    ["180.1", false],
  ])("longitude=%s valid=%s", (value, valid) => {
    const result = projectSchema.safeParse({ ...BASE, latitude: "0", longitude: value });
    expect(result.success).toBe(valid);
  });
});

describe("projectSchema — amenities transform", () => {
  it("splits newline-delimited text into a trimmed, filtered array", () => {
    const result = projectSchema.parse({
      ...BASE,
      amenities: "مسبح خاص\n  حديقة خاصة  \n\nأمن على مدار الساعة\n",
    });
    expect(result.amenities).toEqual(["مسبح خاص", "حديقة خاصة", "أمن على مدار الساعة"]);
  });

  it("returns an empty array for blank input", () => {
    const result = projectSchema.parse({ ...BASE, amenities: "" });
    expect(result.amenities).toEqual([]);
  });
});

describe("projectSchema — required fields", () => {
  it("rejects a missing name", () => {
    const result = projectSchema.safeParse({ ...BASE, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid status", () => {
    const result = projectSchema.safeParse({ ...BASE, status: "PENDING" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive price", () => {
    const result = projectSchema.safeParse({ ...BASE, priceFromMillions: "0" });
    expect(result.success).toBe(false);
  });

  it("accepts the full valid shape", () => {
    const result = projectSchema.safeParse(BASE);
    expect(result.success).toBe(true);
  });
});

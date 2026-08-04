import { describe, expect, it } from "vitest";
import { unitSchema } from "./unit";

const BASE = {
  projectId: "proj_1",
  code: "NL-1204",
  typeName: "شقة بثلاث غرف",
  areaSqm: "240",
  floorLabel: "الطابق ١٢",
  beds: "3",
  baths: "3",
  priceMillions: "4.8",
  status: "AVAILABLE" as const,
};

describe("unitSchema", () => {
  it("coerces numeric FormData strings to numbers", () => {
    const result = unitSchema.parse(BASE);
    expect(result.areaSqm).toBe(240);
    expect(result.beds).toBe(3);
    expect(result.baths).toBe(3);
    expect(result.priceMillions).toBe(4.8);
  });

  it("rejects a non-integer area", () => {
    const result = unitSchema.safeParse({ ...BASE, areaSqm: "240.5" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive area", () => {
    const result = unitSchema.safeParse({ ...BASE, areaSqm: "0" });
    expect(result.success).toBe(false);
  });

  it("allows zero beds/baths (nonnegative, not positive)", () => {
    const result = unitSchema.safeParse({ ...BASE, beds: "0", baths: "0" });
    expect(result.success).toBe(true);
  });

  it("rejects negative beds/baths", () => {
    expect(unitSchema.safeParse({ ...BASE, beds: "-1" }).success).toBe(false);
    expect(unitSchema.safeParse({ ...BASE, baths: "-1" }).success).toBe(false);
  });

  it("rejects a non-positive price", () => {
    const result = unitSchema.safeParse({ ...BASE, priceMillions: "0" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid status", () => {
    const result = unitSchema.safeParse({ ...BASE, status: "PENDING" });
    expect(result.success).toBe(false);
  });
});

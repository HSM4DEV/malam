import { describe, expect, it } from "vitest";
import { dealValueSchema, commissionRateSchema } from "./commission";

describe("dealValueSchema", () => {
  it("coerces a FormData-style numeric string", () => {
    const result = dealValueSchema.parse({ id: "abc123", dealValueMillions: "4.8" });
    expect(result.dealValueMillions).toBe(4.8);
  });

  it("rejects zero or negative deal values", () => {
    expect(dealValueSchema.safeParse({ id: "abc123", dealValueMillions: "0" }).success).toBe(false);
    expect(dealValueSchema.safeParse({ id: "abc123", dealValueMillions: "-1" }).success).toBe(false);
  });

  it("rejects a missing id", () => {
    const result = dealValueSchema.safeParse({ id: "", dealValueMillions: "4.8" });
    expect(result.success).toBe(false);
  });
});

describe("commissionRateSchema", () => {
  it("coerces a FormData-style numeric string", () => {
    const result = commissionRateSchema.parse({ commissionRatePercent: "2.5" });
    expect(result.commissionRatePercent).toBe(2.5);
  });

  it.each([
    ["0", true],
    ["100", true],
    ["-0.1", false],
    ["100.1", false],
  ])("commissionRatePercent=%s valid=%s", (value, valid) => {
    const result = commissionRateSchema.safeParse({ commissionRatePercent: value });
    expect(result.success).toBe(valid);
  });
});

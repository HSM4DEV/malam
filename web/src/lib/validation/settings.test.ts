import { describe, expect, it } from "vitest";
import { changePasswordSchema, profileSchema, companySchema } from "./settings";

describe("changePasswordSchema", () => {
  it("accepts matching next/confirm passwords", () => {
    const result = changePasswordSchema.safeParse({
      current: "OldPassword1!",
      next: "NewPassword1!",
      confirm: "NewPassword1!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched next/confirm passwords, attaching the error to confirm", () => {
    const result = changePasswordSchema.safeParse({
      current: "OldPassword1!",
      next: "NewPassword1!",
      confirm: "SomethingElse1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirm"]);
      expect(result.error.issues[0].message).toBe("كلمتا المرور غير متطابقتين");
    }
  });

  it("rejects a next password under 8 characters even if it matches confirm", () => {
    const result = changePasswordSchema.safeParse({
      current: "OldPassword1!",
      next: "short",
      confirm: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a blank current password", () => {
    const result = changePasswordSchema.safeParse({
      current: "",
      next: "NewPassword1!",
      confirm: "NewPassword1!",
    });
    expect(result.success).toBe(false);
  });
});

describe("profileSchema", () => {
  it("requires a valid email", () => {
    const result = profileSchema.safeParse({ fullName: "سلمان الراجحي", email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("allows jobTitle/phone to be omitted", () => {
    const result = profileSchema.safeParse({ fullName: "سلمان الراجحي", email: "a@b.com" });
    expect(result.success).toBe(true);
  });
});

describe("companySchema", () => {
  it("only requires companyName", () => {
    const result = companySchema.safeParse({ companyName: "مجموعة فيجن العقارية" });
    expect(result.success).toBe(true);
  });

  it("rejects a blank companyName", () => {
    const result = companySchema.safeParse({ companyName: "" });
    expect(result.success).toBe(false);
  });
});

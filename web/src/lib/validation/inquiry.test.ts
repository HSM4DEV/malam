import { describe, expect, it } from "vitest";
import { inquirySchema } from "./inquiry";

describe("inquirySchema — discriminated union", () => {
  it("validates a CONTACT inquiry, where phone is optional", () => {
    const result = inquirySchema.safeParse({
      type: "CONTACT",
      name: "منيرة الحربي",
      email: "a@b.com",
      message: "أرغب في الاستفسار.",
    });
    expect(result.success).toBe(true);
  });

  it("validates a DEVELOPER_APPLICATION inquiry, requiring phone/companyName/companyType", () => {
    const result = inquirySchema.safeParse({
      type: "DEVELOPER_APPLICATION",
      name: "سلمان الراجحي",
      email: "a@b.com",
      phone: "0551234567",
      companyName: "مجموعة فيجن العقارية",
      companyType: "DEVELOPER",
      message: "نرغب بالانضمام كمطوّر.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a DEVELOPER_APPLICATION missing phone, even though CONTACT would allow it", () => {
    const result = inquirySchema.safeParse({
      type: "DEVELOPER_APPLICATION",
      name: "سلمان الراجحي",
      email: "a@b.com",
      companyName: "مجموعة فيجن العقارية",
      companyType: "DEVELOPER",
      message: "نرغب بالانضمام كمطوّر.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unrecognized type discriminator", () => {
    const result = inquirySchema.safeParse({
      type: "SOMETHING_ELSE",
      name: "x",
      email: "a@b.com",
      message: "x",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid companyType on DEVELOPER_APPLICATION", () => {
    const result = inquirySchema.safeParse({
      type: "DEVELOPER_APPLICATION",
      name: "سلمان الراجحي",
      email: "a@b.com",
      phone: "0551234567",
      companyName: "مجموعة فيجن العقارية",
      companyType: "LANDLORD",
      message: "نرغب بالانضمام.",
    });
    expect(result.success).toBe(false);
  });
});

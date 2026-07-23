import { z } from "zod";

export const contactInquirySchema = z.object({
  type: z.literal("CONTACT"),
  name: z.string().min(1, "أدخل اسمك الكامل"),
  email: z.string().email("أدخل بريداً إلكترونياً صحيحاً"),
  phone: z.string().optional(),
  role: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "أدخل رسالتك"),
});

export const developerApplicationSchema = z.object({
  type: z.literal("DEVELOPER_APPLICATION"),
  name: z.string().min(1, "أدخل اسمك الكامل"),
  email: z.string().email("أدخل بريداً إلكترونياً صحيحاً"),
  phone: z.string().min(1, "أدخل رقم جوالك"),
  companyName: z.string().min(1, "أدخل اسم الشركة"),
  message: z.string().min(1, "أخبرنا عن مشروعك"),
});

export const inquirySchema = z.discriminatedUnion("type", [
  contactInquirySchema,
  developerApplicationSchema,
]);

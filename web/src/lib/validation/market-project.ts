import { z } from "zod";

export const marketProjectSchema = z.object({
  name: z.string().min(1, "أدخل اسمك الكامل"),
  companyName: z.string().min(1, "أدخل اسم الشركة"),
  email: z.string().email("أدخل بريداً إلكترونياً صحيحاً"),
  phone: z.string().min(1, "أدخل رقم جوالك"),
  city: z.string().optional(),
  projectType: z.string().optional(),
  unitCount: z.string().optional(),
  priceRange: z.string().optional(),
  blurb: z.string().optional(),
});

export type MarketProjectInput = z.infer<typeof marketProjectSchema>;

export interface MarketProjectState {
  success?: boolean;
  error?: string;
}

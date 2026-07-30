import { z } from "zod";

export const unitSchema = z.object({
  projectId: z.string().min(1, "اختر المشروع"),
  code: z.string().min(1, "أدخل رقم الوحدة"),
  typeName: z.string().min(1, "أدخل نوع الوحدة"),
  areaSqm: z.coerce.number({ message: "أدخل المساحة" }).int().positive("أدخل مساحة صحيحة"),
  floorLabel: z.string().min(1, "أدخل الطابق"),
  beds: z.coerce.number({ message: "أدخل عدد الغرف" }).int().nonnegative("أدخل عدد غرف صحيح"),
  baths: z.coerce.number({ message: "أدخل عدد دورات المياه" }).int().nonnegative("أدخل عدداً صحيحاً"),
  priceMillions: z.coerce.number({ message: "أدخل السعر" }).positive("أدخل سعراً صحيحاً"),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD"], {
    message: "اختر حالة الوحدة",
  }),
});

export type UnitInput = z.infer<typeof unitSchema>;

export interface UnitFormState {
  error?: string;
}

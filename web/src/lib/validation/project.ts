import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "أدخل اسم المشروع"),
  city: z.string().min(1, "أدخل المدينة"),
  district: z.string().min(1, "أدخل الحي"),
  type: z.string().min(1, "أدخل نوع العقار"),
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED"], {
    message: "اختر حالة المشروع",
  }),
  priceFromMillions: z.coerce.number({ message: "أدخل السعر" }).positive("أدخل سعراً صحيحاً"),
  tag: z.string().min(1, "أدخل وسم المشروع"),
  blurb: z.string().optional(),
  amenities: z
    .string()
    .optional()
    .transform((value) =>
      (value ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    ),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export interface ProjectFormState {
  error?: string;
}

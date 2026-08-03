import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "أدخل اسم المشروع"),
  city: z.string().min(1, "أدخل المدينة"),
  district: z.string().min(1, "أدخل الحي"),
  // formData sends "" for an untouched number input, and z.coerce.number()
  // coerces "" to 0 (not NaN) — preprocess blank/missing to undefined first
  // so an empty field stays unset instead of silently saving (0, 0).
  latitude: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce.number().min(-90, "خط عرض غير صحيح").max(90, "خط عرض غير صحيح").optional(),
  ),
  longitude: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce.number().min(-180, "خط طول غير صحيح").max(180, "خط طول غير صحيح").optional(),
  ),
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

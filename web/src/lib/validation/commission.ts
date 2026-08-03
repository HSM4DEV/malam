import { z } from "zod";

export const dealValueSchema = z.object({
  id: z.string().min(1),
  dealValueMillions: z.coerce.number({ message: "أدخل قيمة الصفقة" }).positive("أدخل قيمة صحيحة"),
});

export const commissionRateSchema = z.object({
  commissionRatePercent: z.coerce
    .number({ message: "أدخل نسبة العمولة" })
    .min(0, "أدخل نسبة صحيحة")
    .max(100, "أدخل نسبة صحيحة"),
});

export interface CommissionFormState {
  error?: string;
}

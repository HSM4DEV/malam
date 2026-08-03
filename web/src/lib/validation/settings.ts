import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(1, "أدخل الاسم الكامل"),
  jobTitle: z.string().optional(),
  email: z.string().email("أدخل بريداً إلكترونياً صحيحاً"),
  phone: z.string().optional(),
});

export const companySchema = z.object({
  companyName: z.string().min(1, "أدخل اسم الشركة"),
  license: z.string().optional(),
  city: z.string().optional(),
  website: z.string().optional(),
  bio: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    current: z.string().min(1, "أدخل كلمة المرور الحالية"),
    next: z.string().min(8, "كلمة المرور ٨ أحرف على الأقل"),
    confirm: z.string().min(1, "أكّد كلمة المرور الجديدة"),
  })
  .refine((data) => data.next === data.confirm, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirm"],
  });

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

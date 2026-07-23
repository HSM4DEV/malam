import { z } from "zod";

export const bookingSchema = z.object({
  projectId: z.string().min(1),
  buyerName: z.string().min(1, "أدخل اسمك الكامل"),
  phone: z.string().min(8, "أدخل رقم جوالٍ صحيح"),
  unitLabel: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  visitType: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

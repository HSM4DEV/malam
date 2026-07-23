"use server";

import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validation/inquiry";

export interface InquiryState {
  success?: boolean;
  error?: string;
}

export async function submitInquiryAction(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }

  const data = parsed.data;
  await prisma.inquiry.create({
    data: {
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      role: data.type === "CONTACT" ? data.role || null : null,
      subject: data.type === "CONTACT" ? data.subject || null : null,
      companyName: data.type === "DEVELOPER_APPLICATION" ? data.companyName : null,
      message: data.message,
    },
  });

  return { success: true };
}

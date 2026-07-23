"use server";

import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation/booking";

export interface BookingState {
  success?: boolean;
  error?: string;
}

export async function submitBookingAction(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const parsed = bookingSchema.safeParse({
    projectId: formData.get("projectId"),
    buyerName: formData.get("buyerName"),
    phone: formData.get("phone"),
    unitLabel: formData.get("unitLabel") || undefined,
    preferredDate: formData.get("preferredDate") || undefined,
    preferredTime: formData.get("preferredTime") || undefined,
    visitType: formData.get("visitType") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }

  const project = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
    select: { id: true, companyId: true, status: true },
  });
  if (!project || project.status !== "PUBLISHED") {
    return { error: "تعذّر العثور على هذا المشروع" };
  }

  await prisma.lead.create({
    data: {
      companyId: project.companyId,
      projectId: project.id,
      buyerName: parsed.data.buyerName,
      phone: parsed.data.phone,
      source: "WEBSITE",
      unitLabel: parsed.data.unitLabel || null,
      preferredDate: parsed.data.preferredDate ? new Date(parsed.data.preferredDate) : null,
      preferredTime: parsed.data.preferredTime || null,
      visitType: parsed.data.visitType || null,
    },
  });

  return { success: true };
}

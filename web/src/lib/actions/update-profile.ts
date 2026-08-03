"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normalizePhoneDigits } from "@/lib/format";
import { profileSchema, type SettingsFormState } from "@/lib/validation/settings";

export async function updateProfileAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    jobTitle: formData.get("jobTitle") || undefined,
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { error: "تعذّر التحقق من الجلسة. سجّل الدخول مرة أخرى." };
  }

  const { fullName, jobTitle, email, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== userId) {
    return { error: "هذا البريد الإلكتروني مستخدم بالفعل" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: fullName,
      jobTitle: jobTitle ?? null,
      email,
      phone: phone ? normalizePhoneDigits(phone) : null,
    },
  });

  revalidatePath("/dashboard/broker/settings");
  revalidatePath("/dashboard/developer/settings");
  return { success: true };
}

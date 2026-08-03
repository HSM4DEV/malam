"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { changePasswordSchema, type SettingsFormState } from "@/lib/validation/settings";

export async function changePasswordAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const parsed = changePasswordSchema.safeParse({
    current: formData.get("current"),
    next: formData.get("next"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { error: "تعذّر التحقق من الجلسة. سجّل الدخول مرة أخرى." };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.passwordHash) {
    return { error: "لا يمكن تغيير كلمة المرور لهذا الحساب." };
  }

  const isCurrentValid = await verifyPassword(parsed.data.current, user.passwordHash);
  if (!isCurrentValid) {
    return { error: "كلمة المرور الحالية غير صحيحة" };
  }

  const passwordHash = await hashPassword(parsed.data.next);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return { success: true };
}

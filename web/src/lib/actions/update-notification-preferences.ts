"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NOTIFICATION_COPY } from "@/lib/data/developer-settings";
import type { SettingsFormState } from "@/lib/validation/settings";

export async function updateNotificationPreferencesAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { error: "تعذّر التحقق من الجلسة. سجّل الدخول مرة أخرى." };
  }

  await Promise.all(
    NOTIFICATION_COPY.map((item) =>
      prisma.notificationPreference.upsert({
        where: { userId_key: { userId, key: item.name } },
        create: { userId, key: item.name, enabled: formData.get(item.name) === "true" },
        update: { enabled: formData.get(item.name) === "true" },
      }),
    ),
  );

  revalidatePath("/dashboard/broker/settings");
  revalidatePath("/dashboard/developer/settings");
  return { success: true };
}

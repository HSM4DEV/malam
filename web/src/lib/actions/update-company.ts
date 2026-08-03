"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompanyId } from "@/lib/data/company";
import { companySchema, type SettingsFormState } from "@/lib/validation/settings";

export async function updateCompanyAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const parsed = companySchema.safeParse({
    companyName: formData.get("companyName"),
    license: formData.get("license") || undefined,
    city: formData.get("city") || undefined,
    website: formData.get("website") || undefined,
    bio: formData.get("bio") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }

  const companyId = await getDeveloperCompanyId();
  const { companyName, license, city, website, bio } = parsed.data;

  await prisma.company.update({
    where: { id: companyId },
    data: {
      name: companyName,
      licenseNumber: license ?? null,
      city: city ?? null,
      website: website ?? null,
      bio: bio ?? null,
    },
  });

  revalidatePath("/dashboard/broker/settings");
  revalidatePath("/dashboard/developer/settings");
  return { success: true };
}

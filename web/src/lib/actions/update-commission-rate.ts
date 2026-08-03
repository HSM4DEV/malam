"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompanyId } from "@/lib/data/company";
import { commissionRateSchema, type CommissionFormState } from "@/lib/validation/commission";

export async function updateCommissionRateAction(
  _prev: CommissionFormState,
  formData: FormData,
): Promise<CommissionFormState> {
  const parsed = commissionRateSchema.safeParse({
    commissionRatePercent: formData.get("commissionRatePercent"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }

  const companyId = await getDeveloperCompanyId();
  await prisma.company.update({
    where: { id: companyId },
    data: { commissionRatePercent: parsed.data.commissionRatePercent },
  });

  revalidatePath("/dashboard/broker/commissions");
  revalidatePath("/dashboard/broker");
  return {};
}

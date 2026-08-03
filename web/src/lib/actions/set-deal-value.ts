"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompanyId } from "@/lib/data/company";
import { dealValueSchema, type CommissionFormState } from "@/lib/validation/commission";

export async function setDealValueAction(
  _prev: CommissionFormState,
  formData: FormData,
): Promise<CommissionFormState> {
  const parsed = dealValueSchema.safeParse({
    id: formData.get("id"),
    dealValueMillions: formData.get("dealValueMillions"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }

  const companyId = await getDeveloperCompanyId();
  // Only ever settable on a WON lead — extra guard beyond plain companyId scoping.
  const { count } = await prisma.lead.updateMany({
    where: { id: parsed.data.id, companyId, stage: "WON" },
    data: { dealValueMillions: parsed.data.dealValueMillions },
  });
  if (count === 0) {
    return { error: "تعذّر العثور على هذه الصفقة." };
  }

  revalidatePath("/dashboard/broker/commissions");
  revalidatePath("/dashboard/broker");
  return {};
}

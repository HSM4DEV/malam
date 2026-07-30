"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompanyId } from "@/lib/data/company";
import { uploadProjectImage } from "@/lib/actions/upload-image";
import { unitSchema, type UnitFormState } from "@/lib/validation/unit";

export async function updateUnitAction(
  _prev: UnitFormState,
  formData: FormData,
): Promise<UnitFormState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "وحدة غير صالحة." };
  }

  const parsed = unitSchema.safeParse({
    projectId: formData.get("projectId"),
    code: formData.get("code"),
    typeName: formData.get("typeName"),
    areaSqm: formData.get("areaSqm"),
    floorLabel: formData.get("floorLabel"),
    beds: formData.get("beds"),
    baths: formData.get("baths"),
    priceMillions: formData.get("priceMillions"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }

  const companyId = await getDeveloperCompanyId();

  let imageUrl: string | undefined;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = (await uploadProjectImage(formData)).url;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "تعذّر رفع الصورة" };
    }
  }

  try {
    const { count } = await prisma.unit.updateMany({
      where: { id, project: { companyId } },
      data: {
        code: parsed.data.code,
        typeName: parsed.data.typeName,
        areaSqm: parsed.data.areaSqm,
        floorLabel: parsed.data.floorLabel,
        beds: parsed.data.beds,
        baths: parsed.data.baths,
        priceMillions: parsed.data.priceMillions,
        status: parsed.data.status,
        ...(imageUrl ? { imageUrl } : {}),
      },
    });
    if (count === 0) {
      return { error: "تعذّر العثور على هذه الوحدة." };
    }
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return { error: "رقم الوحدة هذا مستخدم بالفعل." };
    }
    throw error;
  }

  revalidatePath("/dashboard/developer/units");
  revalidatePath("/dashboard/broker/listings");

  const returnTo = formData.get("returnTo");
  redirect(typeof returnTo === "string" && returnTo ? returnTo : "/dashboard/developer/units");
}

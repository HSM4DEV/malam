"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompanyId } from "@/lib/data/company";
import { uploadProjectImage } from "@/lib/actions/upload-image";
import { projectSchema, type ProjectFormState } from "@/lib/validation/project";

export async function updateProjectAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "مشروع غير صالح." };
  }

  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city"),
    district: formData.get("district"),
    type: formData.get("type"),
    status: formData.get("status"),
    priceFromMillions: formData.get("priceFromMillions"),
    tag: formData.get("tag"),
    blurb: formData.get("blurb"),
    amenities: formData.get("amenities"),
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

  const { count } = await prisma.project.updateMany({
    where: { id, companyId },
    data: {
      name: parsed.data.name,
      city: parsed.data.city,
      district: parsed.data.district,
      type: parsed.data.type,
      status: parsed.data.status,
      priceFromMillions: parsed.data.priceFromMillions,
      tag: parsed.data.tag,
      blurb: parsed.data.blurb || null,
      amenities: parsed.data.amenities,
      ...(imageUrl ? { imageUrl } : {}),
    },
  });
  if (count === 0) {
    return { error: "تعذّر العثور على هذا المشروع." };
  }

  revalidatePath("/dashboard/developer/projects");
  revalidatePath("/dashboard/broker/projects");
  // Public pages: cached (revalidate = 300) — refresh immediately so an edit
  // doesn't wait out the window on the pages that surface this project.
  revalidatePath("/");
  revalidatePath("/about");
  const project = await prisma.project.findUnique({
    where: { id },
    select: { slug: true, company: { select: { slug: true } } },
  });
  if (project) {
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath(`/developers/${project.company.slug}`);
  }

  const returnTo = formData.get("returnTo");
  redirect(typeof returnTo === "string" && returnTo ? returnTo : "/dashboard/developer/projects");
}

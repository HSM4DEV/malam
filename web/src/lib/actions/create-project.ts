"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompanyId } from "@/lib/data/company";
import { uniqueProjectSlug } from "@/lib/data/developer-projects";
import { uploadProjectImage } from "@/lib/actions/upload-image";
import { projectSchema, type ProjectFormState } from "@/lib/validation/project";

export async function createProjectAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
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
  const slug = await uniqueProjectSlug(parsed.data.name);

  let imageUrl: string | null = null;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = (await uploadProjectImage(formData)).url;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "تعذّر رفع الصورة" };
    }
  }

  await prisma.project.create({
    data: {
      companyId,
      slug,
      name: parsed.data.name,
      city: parsed.data.city,
      district: parsed.data.district,
      type: parsed.data.type,
      status: parsed.data.status,
      priceFromMillions: parsed.data.priceFromMillions,
      tag: parsed.data.tag,
      blurb: parsed.data.blurb || null,
      amenities: parsed.data.amenities,
      imageSeed: slug,
      imageAlt: parsed.data.name,
      imageUrl,
    },
  });

  revalidatePath("/dashboard/developer/projects");
  revalidatePath("/dashboard/broker/projects");

  const returnTo = formData.get("returnTo");
  redirect(typeof returnTo === "string" && returnTo ? returnTo : "/dashboard/developer/projects");
}

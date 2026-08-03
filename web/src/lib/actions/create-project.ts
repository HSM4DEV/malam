"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompany } from "@/lib/data/company";
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

  const company = await getDeveloperCompany();
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
      companyId: company.id,
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
  // Public pages: cached (revalidate = 300) — refresh immediately so the new
  // project doesn't wait out the window on the pages that list/count it.
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath(`/developers/${company.slug}`);

  const returnTo = formData.get("returnTo");
  redirect(typeof returnTo === "string" && returnTo ? returnTo : "/dashboard/developer/projects");
}

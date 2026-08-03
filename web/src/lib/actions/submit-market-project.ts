"use server";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { marketProjectSchema, type MarketProjectState } from "@/lib/validation/market-project";

function composeMessage(fields: {
  city?: string;
  projectType?: string;
  unitCount?: string;
  priceRange?: string;
  blurb?: string;
}): string {
  const lines: string[] = [];
  if (fields.city) lines.push(`المدينة: ${fields.city}`);
  if (fields.projectType) lines.push(`نوع المشروع: ${fields.projectType}`);
  if (fields.unitCount) lines.push(`عدد الوحدات: ${fields.unitCount}`);
  if (fields.priceRange) lines.push(`نطاق السعر التقديري: ${fields.priceRange}`);
  if (fields.blurb) lines.push(lines.length > 0 ? `\n${fields.blurb}` : fields.blurb);

  return lines.length > 0 ? lines.join("\n") : "لم تُقدَّم تفاصيل إضافية.";
}

export async function submitMarketProjectAction(
  _prev: MarketProjectState,
  formData: FormData,
): Promise<MarketProjectState> {
  const ip = await getClientIp();
  const allowed = await checkRateLimit({
    key: `market-your-project:ip:${ip}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  // formData.get() returns null (not undefined) for a missing field, which
  // z.string().optional() rejects — normalize null/empty to undefined so
  // blank optional selects/inputs validate cleanly either way.
  const orUndefined = (v: FormDataEntryValue | null) => (v ? v : undefined);

  const parsed = marketProjectSchema.safeParse({
    name: formData.get("name"),
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: orUndefined(formData.get("city")),
    projectType: orUndefined(formData.get("projectType")),
    unitCount: orUndefined(formData.get("unitCount")),
    priceRange: orUndefined(formData.get("priceRange")),
    blurb: orUndefined(formData.get("blurb")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }

  const { name, companyName, email, phone, ...detailFields } = parsed.data;

  await prisma.inquiry.create({
    data: {
      type: "DEVELOPER_APPLICATION",
      name,
      email,
      phone,
      companyName,
      companyType: "DEVELOPER",
      message: composeMessage(detailFields),
    },
  });

  return { success: true };
}

import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { formatPhone } from "@/lib/format";
import { getDeveloperCompany } from "@/lib/data/company";
import type { DeveloperSettingsData, SettingsToggle } from "@/types/dashboard";

// Display copy for notification keys (data stores only the key + enabled flag).
const NOTIFICATION_COPY: Array<Pick<SettingsToggle, "name" | "label" | "description">> = [
  { name: "newLeads", label: "طلبات جديدة", description: "إشعار فوري عند وصول طلب جديد من عميل." },
  { name: "messages", label: "الرسائل", description: "تنبيه عند استلام رسالة في صندوق الوارد." },
  { name: "weeklyReport", label: "التقرير الأسبوعي", description: "ملخّص أداء المحفظة كل يوم أحد." },
  { name: "marketing", label: "تحديثات مَعلم", description: "أخبار المنصّة والميزات الجديدة." },
];

export const getDeveloperSettings = cache(
  async (): Promise<DeveloperSettingsData> => {
    const company = await getDeveloperCompany();
    const user = company.members[0];

    const prefs = user
      ? await prisma.notificationPreference.findMany({ where: { userId: user.id } })
      : [];
    const enabledByKey = new Map(prefs.map((p) => [p.key, p.enabled]));

    return {
      profileFields: [
        { name: "fullName", label: "الاسم الكامل", value: user?.name ?? "" },
        { name: "jobTitle", label: "المسمّى الوظيفي", value: user?.jobTitle ?? "" },
        { name: "email", label: "البريد الإلكتروني", value: user?.email ?? "", type: "email" },
        { name: "phone", label: "رقم الجوال", value: user?.phone ? formatPhone(user.phone) : "", type: "tel" },
      ],
      companyFields: [
        { name: "companyName", label: "اسم الشركة", value: company.name },
        { name: "license", label: "رقم الترخيص (فال)", value: company.licenseNumber ?? "" },
        { name: "city", label: "المدينة", value: company.city ?? "" },
        { name: "website", label: "الموقع الإلكتروني", value: company.website ?? "" },
        { name: "bio", label: "نبذة عن الشركة", value: company.bio ?? "", type: "textarea", full: true },
      ],
      notifications: NOTIFICATION_COPY.map((copy) => ({
        ...copy,
        enabled: enabledByKey.get(copy.name) ?? true,
      })),
    };
  },
);

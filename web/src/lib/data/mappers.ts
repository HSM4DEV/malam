import "server-only";

import type {
  LeadSource,
  LeadStage as DbLeadStage,
  ProjectStatus as DbProjectStatus,
  UnitStatus as DbUnitStatus,
} from "@/generated/prisma/enums";
import type {
  LeadStage as UiLeadStage,
  ProjectStatus as UiProjectStatus,
  UnitStatus as UiUnitStatus,
} from "@/types/dashboard";

export function projectStatusToUi(status: DbProjectStatus): UiProjectStatus {
  switch (status) {
    case "PUBLISHED":
      return "published";
    case "IN_REVIEW":
      return "review";
    case "DRAFT":
      return "draft";
  }
}

export function unitStatusToUi(status: DbUnitStatus): UiUnitStatus {
  switch (status) {
    case "AVAILABLE":
      return "available";
    case "RESERVED":
      return "reserved";
    case "SOLD":
      return "sold";
  }
}

export function leadStageToUi(stage: DbLeadStage): UiLeadStage {
  switch (stage) {
    case "NEW":
      return "new";
    case "CONTACTED":
      return "contacted";
    case "VIEWING":
      return "viewing";
    case "NEGOTIATING":
      return "negotiating";
    case "WON":
      return "won";
    // LOST is filtered out of the developer pipeline views; fall back defensively.
    case "LOST":
      return "won";
  }
}

const LEAD_SOURCE_AR: Record<LeadSource, string> = {
  WEBSITE: "الموقع",
  AD: "إعلان",
  REFERRAL: "إحالة",
  WHATSAPP: "واتساب",
  EXHIBITION: "معرض",
};

export function leadSourceToAr(source: LeadSource): string {
  return LEAD_SOURCE_AR[source];
}

/** Static developer sidebar nav (presentation, not persisted). */
export const DEVELOPER_NAV = [
  { key: "overview", label: "نظرة عامة", icon: "◫", href: "/dashboard/developer" },
  { key: "projects", label: "مشاريعي", icon: "▤", href: "/dashboard/developer/projects" },
  { key: "units", label: "الوحدات", icon: "▦", href: "/dashboard/developer/units" },
  { key: "leads", label: "الطلبات", icon: "✉", href: "/dashboard/developer/leads" },
  { key: "analytics", label: "التحليلات", icon: "◔", href: "/dashboard/developer/analytics" },
  { key: "messages", label: "الرسائل", icon: "❏", href: "/dashboard/developer/messages" },
  { key: "settings", label: "الإعدادات", icon: "⚙", href: "/dashboard/developer/settings" },
] as const;

/** Static broker sidebar nav (presentation, not persisted). */
export const BROKER_NAV = [
  { key: "overview", label: "نظرة عامة", icon: "◫", href: "/dashboard/broker" },
  { key: "listings", label: "قوائمي", icon: "▤", href: "/dashboard/broker/listings" },
  { key: "clients", label: "العملاء", icon: "☺", href: "/dashboard/broker/clients" },
  { key: "deals", label: "الصفقات", icon: "⇄", href: "/dashboard/broker/deals" },
  { key: "commissions", label: "العمولات", icon: "◈", href: "/dashboard/broker/commissions" },
  { key: "messages", label: "الرسائل", icon: "❏", href: "/dashboard/broker/messages" },
  { key: "settings", label: "الإعدادات", icon: "⚙", href: "/dashboard/broker/settings" },
] as const;

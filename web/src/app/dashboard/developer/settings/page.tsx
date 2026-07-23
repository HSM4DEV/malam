import type { Metadata } from "next";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { getDeveloperSettings } from "@/lib/data/developer-settings";

export const metadata: Metadata = {
  title: "الإعدادات · لوحة تحكم المطوّر · مَعلم",
};

export default async function DeveloperSettingsPage() {
  const settings = await getDeveloperSettings();

  return (
    <>
      <DeveloperTopbar eyebrow="الحساب" title="الإعدادات" searchPlaceholder="بحث…" />

      <div className="mx-auto w-full max-w-4xl px-8 py-7">
        <SettingsForm {...settings} />
      </div>
    </>
  );
}

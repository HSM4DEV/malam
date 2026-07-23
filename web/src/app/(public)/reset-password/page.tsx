import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { AuthShell } from "@/components/site/auth-shell";
import { ResetPasswordForm } from "@/components/site/reset-password-form";
import { isResetTokenValid } from "@/lib/auth/reset-token";

export const metadata: Metadata = { title: "تعيين كلمة مرور جديدة — مَعلم" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const valid = token ? await isResetTokenValid(token) : false;

  return (
    <AuthShell>
      {valid && token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="rev text-center">
          <AlertTriangle className="mx-auto mb-4 size-10 text-clay" aria-hidden="true" />
          <h1 className="mb-2 font-serif text-[28px] font-semibold">الرابط غير صالح</h1>
          <p className="text-[15px] leading-[1.7] font-light text-muted-strong">
            انتهت صلاحية رابط إعادة التعيين أو أنه غير صحيح.
          </p>
          <Link href="/forgot-password" className="mt-6 inline-block text-sm font-semibold text-pine">
            طلب رابطٍ جديد
          </Link>
        </div>
      )}
    </AuthShell>
  );
}

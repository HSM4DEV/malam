import type { Metadata } from "next";

import { AuthShell } from "@/components/site/auth-shell";
import { ForgotPasswordForm } from "@/components/site/forgot-password-form";

export const metadata: Metadata = { title: "استعادة كلمة المرور — مَعلم" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}

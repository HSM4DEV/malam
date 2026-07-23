import type { Metadata } from "next";

import { AuthShell } from "@/components/site/auth-shell";
import { RegisterForm } from "@/components/site/register-form";

export const metadata: Metadata = { title: "إنشاء حساب — مَعلم" };

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}

import type { Metadata } from "next";

import { AuthShell } from "@/components/site/auth-shell";
import { LoginForm } from "@/components/site/login-form";

export const metadata: Metadata = { title: "تسجيل الدخول — مَعلم" };

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}

import "server-only";
import { Resend } from "resend";

/**
 * Transactional email (password reset). Mirrors storage.ts's config-guard
 * pattern: a missing RESEND_API_KEY doesn't crash the forgot-password flow —
 * the reset token is still generated, only the send is skipped.
 */
let cached: Resend | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Resend is not configured. Set RESEND_API_KEY in your environment.");
  }
  cached ??= new Resend(apiKey);
  return cached;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping password-reset email to ${to}. Reset link: ${resetUrl}`,
    );
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  await getClient().emails.send({
    from: `مَعلم <${from}>`,
    to,
    subject: "إعادة تعيين كلمة المرور — مَعلم",
    html: `
      <div dir="rtl" style="font-family: 'IBM Plex Sans Arabic', sans-serif; color:#17181A; max-width:480px; margin:0 auto; padding:32px 24px;">
        <h1 style="font-size:22px; margin-bottom:16px;">إعادة تعيين كلمة المرور</h1>
        <p style="font-size:15px; line-height:1.7; color:#5C5850;">
          وصلنا طلبٌ لإعادة تعيين كلمة المرور الخاصة بحسابك في مَعلم. اضغط على الزر أدناه لتعيين كلمة مرور جديدة. الرابط صالحٌ لمدة ساعة واحدة.
        </p>
        <a href="${resetUrl}" style="display:inline-block; margin-top:20px; background:#14453C; color:#F6F3EC; padding:14px 28px; border-radius:12px; text-decoration:none; font-weight:600;">
          إعادة تعيين كلمة المرور
        </a>
        <p style="font-size:13px; color:#8A857A; margin-top:24px;">
          إن لم تطلب هذا، يمكنك تجاهل هذه الرسالة بأمان.
        </p>
      </div>
    `,
  });
}

export async function sendAccountInviteEmail(
  to: string,
  companyName: string,
  setupUrl: string,
): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping account-invite email to ${to}. Setup link: ${setupUrl}`,
    );
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  await getClient().emails.send({
    from: `مَعلم <${from}>`,
    to,
    subject: "تمت الموافقة على طلبك — أنشئ كلمة مرورك",
    html: `
      <div dir="rtl" style="font-family: 'IBM Plex Sans Arabic', sans-serif; color:#17181A; max-width:480px; margin:0 auto; padding:32px 24px;">
        <h1 style="font-size:22px; margin-bottom:16px;">أهلاً بك في مَعلم</h1>
        <p style="font-size:15px; line-height:1.7; color:#5C5850;">
          تمّت الموافقة على طلب انضمام <strong>${companyName}</strong>. اضغط على الزر أدناه لتعيين
          كلمة مرورك والدخول إلى لوحة تحكّمك. الرابط صالحٌ لمدة ٧ أيام.
        </p>
        <a href="${setupUrl}" style="display:inline-block; margin-top:20px; background:#14453C; color:#F6F3EC; padding:14px 28px; border-radius:12px; text-decoration:none; font-weight:600;">
          تعيين كلمة المرور
        </a>
      </div>
    `,
  });
}

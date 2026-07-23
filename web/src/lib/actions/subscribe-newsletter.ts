"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email("أدخل بريداً إلكترونياً صحيحاً") });

export interface NewsletterState {
  success?: boolean;
  error?: string;
}

export async function subscribeNewsletterAction(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "أدخل بريداً صحيحاً" };
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    create: { email: parsed.data.email },
    update: {},
  });

  return { success: true };
}

import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import {
  formatClockArabic,
  formatMessageTimestamp,
  initialOf,
  toneFromString,
} from "@/lib/format";
import { getDeveloperCompany } from "@/lib/data/company";
import type { DeveloperMessagesData } from "@/types/dashboard";

export const getDeveloperMessages = cache(
  async (): Promise<DeveloperMessagesData> => {
    const company = await getDeveloperCompany();

    const conversations = await prisma.conversation.findMany({
      where: { companyId: company.id },
      orderBy: { lastMessageAt: "desc" },
      include: {
        project: { select: { name: true } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    return {
      conversations: conversations.map((conversation) => {
        const last = conversation.messages[conversation.messages.length - 1];
        const unread = conversation.messages.filter(
          (m) => m.sender === "CONTACT" && !m.readByCompany,
        ).length;

        return {
          id: conversation.id,
          name: conversation.contactName,
          initials: initialOf(conversation.contactName),
          tone: toneFromString(conversation.contactName),
          project: conversation.project?.name ?? "",
          preview: last?.body ?? "",
          time: formatMessageTimestamp(conversation.lastMessageAt),
          unread,
          online: conversation.online,
          messages: conversation.messages.map((message) => ({
            id: message.id,
            fromMe: message.sender === "COMPANY",
            body: message.body,
            time: formatClockArabic(message.createdAt),
          })),
        };
      }),
    };
  },
);

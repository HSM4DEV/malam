import type { Metadata } from "next";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { MessagesInbox } from "@/components/dashboard/messages-inbox";
import { getDeveloperMessages } from "@/lib/data/developer-messages";

export const metadata: Metadata = {
  title: "الرسائل · لوحة تحكم المطوّر · مَعلم",
};

export default async function DeveloperMessagesPage() {
  const { conversations } = await getDeveloperMessages();

  return (
    <>
      <DeveloperTopbar
        eyebrow="المحادثات"
        title="الرسائل"
        searchPlaceholder="ابحث في المحادثات…"
      />

      <div className="px-8 py-7">
        <MessagesInbox conversations={conversations} />
      </div>
    </>
  );
}

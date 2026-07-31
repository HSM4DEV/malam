"use client";

import { useState } from "react";
import { ArrowRight, Send } from "lucide-react";

import { toArabicDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/dashboard";

export function MessagesInbox({ conversations }: { conversations: Conversation[] }) {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id);
  const [openedOnMobile, setOpenedOnMobile] = useState(false);

  const active = conversations.find((c) => c.id === selectedId) ?? conversations[0];

  return (
    <div className="flex h-[calc(100vh-137px)] min-h-[520px] overflow-hidden rounded-2xl border border-foreground/9 bg-surface">
      {/* List */}
      <div
        className={cn(
          "w-full flex-col border-e border-foreground/9 dash:flex dash:w-[340px]",
          openedOnMobile ? "hidden" : "flex",
        )}
      >
        <div className="border-b border-foreground/9 px-5 py-[18px]">
          <div className="font-serif text-xl font-semibold">المحادثات</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => {
            const isActive = conversation.id === active?.id;
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => {
                  setSelectedId(conversation.id);
                  setOpenedOnMobile(true);
                }}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-foreground/6 px-5 py-4 text-start transition-colors",
                  isActive ? "bg-cream" : "hover:bg-cream/60",
                )}
              >
                <Avatar conversation={conversation} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{conversation.name}</span>
                    <span className="shrink-0 text-[11px] text-muted-light">{conversation.time}</span>
                  </div>
                  <div className="mt-0.5 truncate text-[12px] text-pine">{conversation.project}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="truncate text-[12.5px] text-muted">{conversation.preview}</span>
                    {conversation.unread > 0 ? (
                      <span className="ms-auto flex size-[18px] shrink-0 items-center justify-center rounded-full bg-clay text-[10px] font-bold text-cream">
                        {toArabicDigits(conversation.unread)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Thread */}
      <div
        className={cn(
          "w-full flex-col dash:flex",
          openedOnMobile ? "flex" : "hidden dash:flex",
        )}
      >
        {active ? (
          <>
            <div className="flex items-center gap-3 border-b border-foreground/9 px-6 py-[14px]">
              <button
                type="button"
                onClick={() => setOpenedOnMobile(false)}
                className="text-muted-dark dash:hidden"
                aria-label="رجوع"
              >
                <ArrowRight className="size-5" />
              </button>
              <Avatar conversation={active} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{active.name}</div>
                <div className="text-[12px] text-muted">
                  {active.online ? (
                    <span className="text-pine">متصل الآن</span>
                  ) : (
                    active.project
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-background/40 px-6 py-6">
              {active.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col",
                    message.fromMe ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed",
                      message.fromMe
                        ? "rounded-es-md bg-pine text-cream"
                        : "rounded-ss-md border border-foreground/8 bg-surface text-foreground",
                    )}
                  >
                    {message.body}
                  </div>
                  <span className="mt-1 px-1 text-[10.5px] text-muted-light">{message.time}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 border-t border-foreground/9 px-6 py-4">
              <input
                type="text"
                disabled
                placeholder="اكتب رسالة… (قريبًا)"
                className="h-11 flex-1 rounded-[11px] border border-input bg-background px-4 text-sm outline-none placeholder:text-muted focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                disabled
                title="إرسال (قريبًا)"
                className="flex size-11 shrink-0 items-center justify-center rounded-[11px] bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted">
            لا توجد محادثات بعد.
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ conversation }: { conversation: Conversation }) {
  return (
    <span className="relative shrink-0">
      <span
        className={cn(
          "flex size-[42px] items-center justify-center rounded-full text-sm font-semibold",
          conversation.tone === "pine" ? "bg-sage text-pine" : "bg-clay-soft text-clay",
        )}
      >
        {conversation.initials}
      </span>
      {conversation.online ? (
        <span className="absolute end-0 bottom-0 size-3 rounded-full border-2 border-surface bg-pine-mist" />
      ) : null}
    </span>
  );
}

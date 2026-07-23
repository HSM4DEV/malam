import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <a
      href="#book"
      title="تواصل عبر واتساب"
      className="fixed bottom-6 start-6 z-40 flex size-[58px] items-center justify-center rounded-full bg-pine text-cream shadow-[0_16px_34px_-12px_rgba(14,51,44,.7)] transition-colors hover:bg-pine-dark"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}

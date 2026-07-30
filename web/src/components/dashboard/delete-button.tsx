"use client";

import { useRef } from "react";
import { Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function DeleteButton({
  id,
  action,
  confirmMessage,
  className,
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
  confirmMessage: string;
  className?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="button"
        title="حذف"
        onClick={() => {
          if (window.confirm(confirmMessage)) {
            formRef.current?.requestSubmit();
          }
        }}
        className={cn(
          "flex size-9 items-center justify-center rounded-[9px] text-muted-light transition-colors hover:bg-clay-soft hover:text-clay",
          className,
        )}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}

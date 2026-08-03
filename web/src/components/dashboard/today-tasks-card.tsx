"use client";

import { useActionState, useRef } from "react";
import { Plus } from "lucide-react";

import { DeleteButton } from "@/components/dashboard/delete-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTaskAction } from "@/lib/actions/create-task";
import { deleteTaskAction } from "@/lib/actions/delete-task";
import { toggleTaskAction } from "@/lib/actions/toggle-task";
import { cn } from "@/lib/utils";
import type { TaskFormState } from "@/lib/validation/task";
import type { TaskItem } from "@/types/dashboard";

const initialState: TaskFormState = {};

export function TodayTasksCard({ tasks }: { tasks: TaskItem[] }) {
  const [state, formAction, pending] = useActionState(createTaskAction, initialState);

  return (
    <div className="animate-fade-up flex flex-col rounded-2xl border border-foreground/9 bg-surface px-[26px] py-6">
      <div className="mb-[18px] font-serif text-xl font-semibold">مهام اليوم</div>

      <div className="flex flex-1 flex-col gap-2">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
        {tasks.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted">لا توجد مهام بعد.</p>
        ) : null}
      </div>

      <form action={formAction} className="mt-4 flex flex-col gap-2 border-t border-foreground/9 pt-4">
        <div className="flex gap-2">
          <Input name="title" placeholder="عنوان المهمة" required className="flex-1" />
          <Input name="dueLabel" placeholder="الموعد (مثال: اليوم · ٢:٠٠م)" required className="w-[180px]" />
        </div>
        {state.error ? <p className="text-[13px] text-clay">{state.error}</p> : null}
        <Button type="submit" disabled={pending} variant="outline" className="w-full">
          <Plus className="size-4" aria-hidden="true" />
          {pending ? "جارٍ الإضافة…" : "إضافة مهمة"}
        </Button>
      </form>
    </div>
  );
}

function TaskRow({ task }: { task: TaskItem }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex items-center gap-2 rounded-[10px] px-2 py-2 transition-colors hover:bg-cream">
      <form ref={formRef} action={toggleTaskAction} className="flex flex-1 items-center gap-3">
        <input type="hidden" name="id" value={task.id} />
        <input type="hidden" name="completed" value={String(!task.completed)} />
        <label className="flex flex-1 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            defaultChecked={task.completed}
            onChange={() => formRef.current?.requestSubmit()}
            className="size-4 shrink-0 accent-pine"
          />
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "truncate text-sm font-medium",
                task.completed ? "text-muted-light line-through" : "text-foreground",
              )}
            >
              {task.title}
            </div>
            <div className="text-xs text-muted">{task.dueLabel}</div>
          </div>
        </label>
      </form>
      <DeleteButton
        id={task.id}
        action={deleteTaskAction}
        confirmMessage="هل تريد حذف هذه المهمة؟"
        className="size-8"
      />
    </div>
  );
}

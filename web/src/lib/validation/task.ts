import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "أدخل عنوان المهمة"),
  dueLabel: z.string().min(1, "أدخل موعد المهمة"),
});

export type TaskInput = z.infer<typeof taskSchema>;

export interface TaskFormState {
  error?: string;
}

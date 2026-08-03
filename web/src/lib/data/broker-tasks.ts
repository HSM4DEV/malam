import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompanyId } from "@/lib/data/company";
import type { TaskItem } from "@/types/dashboard";

export const getBrokerTasks = cache(async (): Promise<TaskItem[]> => {
  const companyId = await getDeveloperCompanyId();
  const tasks = await prisma.task.findMany({
    where: { companyId },
    orderBy: [{ completed: "asc" }, { createdAt: "asc" }],
  });

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    dueLabel: task.dueLabel,
    completed: task.completed,
  }));
});

import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200),
  description: z.string().max(1000).optional(),
  status: z
    .enum(["BACKLOG", "TODO", "IN_PROGRESS", "TESTING", "COMPILED"])
    .default("BACKLOG"),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .default("LOW")
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z
    .enum(["BACKLOG", "TODO", "IN_PROGRESS", "TESTING", "COMPILED"])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

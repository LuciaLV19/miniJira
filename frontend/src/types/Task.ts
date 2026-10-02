import type { User } from "./User";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type Status = "BACKLOG" | "TODO" |"IN_PROGRESS" | "TESTING" | "COMPILED";
export type Task = {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  commentsCount: number;
  category?: string;
  dueDate?: string;
  assignee?: User | string | null;
  assignedTo?: User | string | null;
};
import type { Task } from "./Task";

export type Project = {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  createdAt: string;
  key?: string;
  isFavorite: boolean;
  tasks: Task[];
};


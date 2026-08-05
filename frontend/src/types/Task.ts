export type Priority = "low" | "medium" | "high";
export type Status = "backlog" | "todo" |"in_progress" | "testing" | "compiled";
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
  assignee?: {
    id?: string;
    _id?: string;
    name: string;
    initials: string;
  };
};
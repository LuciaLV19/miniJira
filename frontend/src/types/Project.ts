import type { Task } from "./Task";

export type PendingInvitation = {
  email: string;
  status?: "pending" | "accepted";
  permission?: "edit" | "view";
  invitedBy?: string;
  invitedAt?: string;
};

export type MemberPermission = {
  user: string | ProjectMember;
  permission: "edit" | "view";
};

export type ProjectMember = {
  _id?: string;
  id?: string;
  username?: string;
  email?: string;
  permission?: "edit" | "view";
};

export type Project = {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  createdAt: string;
  key?: string;
  isFavorite: boolean;
  tasks: Task[];
  createdBy?: ProjectMember | string;
  members?: Array<ProjectMember | string>;
  memberPermissions?: MemberPermission[];
  pendingInvitations?: PendingInvitation[];
};


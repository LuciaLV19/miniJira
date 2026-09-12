import api from "../api/axios";
import type { Project } from "../types/Project";
import type { Task } from "../types/Task";
import type { CreateTaskInput } from "../store/useProjectStore";

// --- Project API Requests ---


export const fetchProjectsApi = async (): Promise<Project[]> => {
  const response = await api.get("/projects");
  return response.data;
};

export const createProjectApi = async (name: string, description: string): Promise<Project> => {
  const response = await api.post("/projects", { name, description });
  return response.data;
};

export const deleteProjectApi = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

export const updateProjectApi = async (projectId: string, data: Partial<Project>): Promise<void> => {
  await api.put(`/projects/${projectId}`, data);
};

// --- Task API Requests ---

export const createTaskApi = async (projectId: string, task: CreateTaskInput): Promise<Task> => {
  const response = await api.post(`/projects/${projectId}/tasks`, task);
  return response.data;
};

export const deleteTaskApi = async (projectId: string, taskId: string): Promise<void> => {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
};

export const updateTaskApi = async (projectId: string, taskId: string, data: Partial<Task>): Promise<void> => {
  await api.put(`/projects/${projectId}/tasks/${taskId}`, data);
};

// --- Member API Requests ---

export const getProjectMembersApi = async (projectId: string): Promise<{_id: string; username: string; email: string }[]> => {
  const response = await api.get(`/projects/${projectId}/members`);
  return response.data;
}

export const inviteMemberApi = async (projectId: string, email: string): Promise<{ message: string }> => {
  const response = await api.post(`/projects/${projectId}/members`, { email });
  return response.data;
}
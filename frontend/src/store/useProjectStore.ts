import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "../types/Project";
import type { Priority, Task } from "../types/Task";
import { toast } from "sonner";
import * as projectApi from "../services/projectService";

const normalizeTask = (task: Task): Task => ({
  ...task,
  id: task._id || task.id || "",
  _id: task._id,
});

const normalizeProject = (project: Project): Project => ({
  ...project,
  id: project._id || project.id || "",
  _id: project._id,
  tasks: (project.tasks || []).map(normalizeTask),
});

export interface CreateTaskInput {
  title: string;
  description: string;
  status: string;
  priority: Priority;
  dueDate: string;
  category: string;
  assignee?: { id?: string; _id?: string; name: string; initials: string };
}

interface ProjectState {
  projects: Project[];
  isOpenModalProject: boolean;
  isOpenModalTask: boolean;
  projectToEdit: Project | undefined;
  taskToEdit: Task | undefined;
  activeProjectId: string | undefined;
  loading: boolean;
  error: string | null;

  // Project management actions
  createProject: (name: string, description: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (projectId: string, data: Partial<Project>) => Promise<void>;
  editProject: (project: Project) => void;
  toggleFavoriteProject: (id: string) => void;
  setActiveProjectId: (id: string) => void;

  // Modal control actions
  openProjectModal: () => void;
  closeProjectModal: () => void;
  openTaskModal: () => void;
  closeTaskModal: () => void;

  // Task management actions
  createTask: (projectId: string, task: CreateTaskInput) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
  updateTask: (projectId: string, taskId: string, data: Partial<Task>) => Promise<void>;
  editTask: (task: Task) => void;
  fetchProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      // Initial state variables
      projects: [],
      isOpenModalProject: false,
      isOpenModalTask: false,
      projectToEdit: undefined,
      taskToEdit: undefined,
      activeProjectId: undefined,
      loading: false,
      error: null,

      fetchProjects: async () => {
        set({ loading: true, error: null });
        try {
          const rawProjects = await projectApi.fetchProjectsApi();
          set({
            projects: rawProjects.map(normalizeProject),
            loading: false,
          });
        } catch (error: unknown) {
          console.error("Error fetching projects:", error);
          set({ error: "An error occurred", loading: false });
        }
      },

      // Active Project Selection
      setActiveProjectId: (id) =>
        set((state) => ({
          activeProjectId: state.activeProjectId === id ? undefined : id,
        })),

      // Project Modals
      openProjectModal: () =>
        set({ isOpenModalProject: true, projectToEdit: undefined }),
      closeProjectModal: () =>
        set({ isOpenModalProject: false, projectToEdit: undefined }),
      editProject: (project) =>
        set({ isOpenModalProject: true, projectToEdit: project }),

      // Task Modals
      openTaskModal: () => set({ isOpenModalTask: true }),
      closeTaskModal: () =>
        set({ isOpenModalTask: false, taskToEdit: undefined }),
      editTask: (task) => set({ isOpenModalTask: true, taskToEdit: task }),

      // Project CRUD Operations
      createProject: async (name, description) => {
        try {
          const rawProject = await projectApi.createProjectApi(name, description);
          const newProjectFromDB = normalizeProject(rawProject);

          set((state) => ({
            projects: [...state.projects, newProjectFromDB],
            activeProjectId: newProjectFromDB.id,
          }));
          toast.success("[ SYSTEM_LOG: PROJECT_CREATED ]", {
            description: "The project has been created.",
          });
        } catch (error: unknown) {
          console.error("Error creating project:", error);
          toast.error("[ SYSTEM_LOG: PROJECT_CREATION_FAILED ]", {
            description: "The project could not be created.",
          });
        }
      },

      deleteProject: async (id) => {
        try {
          await projectApi.deleteProjectApi(id);

          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            activeProjectId:
              state.activeProjectId === id ? undefined : state.activeProjectId,
          }));
          toast.error("[ SYSTEM_LOG: PROJECT_DELETED ]", {
            description: "The project has been deleted.",
          });
        } catch (error: unknown) {
          console.error("Error deleting project:", error);
          toast.error("[SYSTEM_LOG: PROJECT_DELETED_FAILED]", {
            description: "The project could not be deleted.",
          });
        }
      },

      updateProject: async (projectId, data) => {
        try {
          await projectApi.updateProjectApi(projectId, data);
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId || p._id === projectId ? normalizeProject({ ...p, ...data }) : p
            ),
          }));
          toast.success("[ SYSTEM_LOG: PROJECT_UPDATED ]", {
            description: "The project has been updated.",
          });
        } catch (error: unknown) {
          console.error("Error updating project:", error);
          toast.error("[ SYSTEM_LOG: PROJECT_UPDATE_FAILED ]", {
            description: "The project could not be updated.",
          });
        }
      },

      toggleFavoriteProject: (id) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
          ),
        }));
      },

      // Task CRUD Operations
      createTask: async (projectId, task: CreateTaskInput) => {
        try {
          const rawTask = await projectApi.createTaskApi(projectId, task);
          const newTask = normalizeTask(rawTask);

          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId || p._id === projectId
                ? { ...p, tasks: [...(p.tasks || []), newTask] }
                : p
            ),
          }));
          toast.success("[ SYSTEM_LOG: TASK_CREATED ]", {
            description: "The task has been created.",
          });
        } catch (error: unknown) {
          console.error("Error creating task:", error);
          toast.error("[ SYSTEM_LOG: TASK_CREATION_FAILED ]", {
            description: "The task could not be created.",
          });
        }
      },

      deleteTask: async (projectId, taskId) => {
        try {
          await projectApi.deleteTaskApi(projectId, taskId);
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId || p._id === projectId
                ? { ...p, tasks: (p.tasks || []).filter((t) => t.id !== taskId && t._id !== taskId) }
                : p
            ),
          }));
          toast.success("[ SYSTEM_LOG: TASK_DELETED ]", {
            description: "The task has been deleted.",
          });
        } catch (error: unknown) {
          console.error("Error deleting task:", error);
          toast.error("[ SYSTEM_LOG: TASK_DELETION_FAILED ]", {
            description: "The task could not be deleted.",
          });
        }
      },

      updateTask: async (projectId, taskId, data) => {
        try {
          await projectApi.updateTaskApi(projectId, taskId, data);
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId || p._id === projectId
                ? {
                    ...p,
                    tasks: (p.tasks || []).map((t) =>
                      t.id === taskId || t._id === taskId ? normalizeTask({ ...t, ...data }) : t
                    ),
                  }
                : p
            ),
          }));
          toast.success("[ SYSTEM_LOG: TASK_UPDATED ]", {
            description: "The task has been updated.",
          });
        } catch (error: unknown) {
          console.error("Error updating task:", error);
          toast.error("[ SYSTEM_LOG: TASK_UPDATE_FAILED ]", {
            description: "The task could not be updated.",
          });
        }
      },
    }),
    {
      name: "project-storage",
      partialize: (state) => ({ activeProjectId: state.activeProjectId }),
    }
  )
);
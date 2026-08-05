import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "../types/Project";
import type { Task, Status } from "../types/Task";
import { toast } from "sonner";
import api from "../api/axios";

/**
 * State interface defining state properties and state modification actions
 * for project and task lifecycle management.
 */
interface ProjectState {
  // State variables
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
  createTask: (projectId: string, task: Task) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
  updateTask: (projectId: string, taskId: string, data: Partial<Task>) => Promise<void>;
  editTask: (task: Task) => void;
  updateColumn: (taskId: string, status: Status) => Promise<void>;

  fetchProjects: () => Promise<void>;
}

/**
 * Zustand global store for managing projects, active selection, tasks,
 * and modal view states with persistent local storage.
 */
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
          const response = await api.get("/projects");
          set({ projects: response.data, loading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || "An error occurred", loading: false });
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
        const response = await api.post("/projects", { name, description });
        const newProjectFromDB = response.data;

        set((state) => ({
          projects: [...state.projects, newProjectFromDB],
          activeProjectId: newProjectFromDB._id || newProjectFromDB.id, // Auto-select created project
        }));
        toast.success("[ SYSTEM_LOG: PROJECT_CREATED ]", {
          description: "The project has been created.",
        });
      } catch (error: any) {
        toast.error("[ SYSTEM_LOG: PROJECT_CREATION_FAILED ]", {
          description: "The project could not be created.",
        });
      }
    },

      deleteProject: async (id) => {
        try{
        await api.delete(`/projects/${id}`);

        set((state) => ({
          projects: state.projects.filter((p) => (p._id || p.id) !== id),
          activeProjectId:
            state.activeProjectId === id ? undefined : state.activeProjectId,
        }));
        toast.error("[ SYSTEM_LOG: PROJECT_DELETED ]", {
          description: "The project has been deleted.",
        });
        } catch (error: any){
          toast.error("[SYSTEM_LOG: PROJECT_DELETED_FAILED]", {
          description: "The project could not be deleted."
          });
        }
      },

      updateProject: async (projectId, data) => {
        try {
          await api.put(`/projects/${projectId}`, data);
          set((state) => ({
          projects: state.projects.map((p) =>
            (p._id || p.id) === projectId ? { ...p, ...data } : p,
          ),
        }));
        toast.success("[ SYSTEM_LOG: PROJECT_UPDATED ]", {
          description: "The project has been updated.",
        });
        }        
         catch (error: any) {
          toast.error("[ SYSTEM_LOG: PROJECT_UPDATE_FAILED ]", {
            description: "The project could not be updated.",
          });
        }
      },

      toggleFavoriteProject: (id) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            (p._id || p.id) === id ? { ...p, isFavorite: !p.isFavorite } : p,
          ),
        }));
      },

      // Task CRUD Operations
      createTask: async (projectId, task) => {
        try {
          const response = await api.post(`/projects/${projectId}/tasks`, task);
          const newTask = response.data;

          set((state) => ({
          projects: state.projects.map((p) =>
            (p._id || p.id) === projectId ? 
          { ...p, tasks: [...(p.tasks || []), newTask] }
          : p,
          ),
        }));
        toast.success("[ SYSTEM_LOG: TASK_CREATED ]", {
          description: "The task has been created.",
        });
        } catch (error: any) {
          toast.error("[ SYSTEM_LOG: TASK_CREATION_FAILED ]", {
            description: "The task could not be created.",
          });
        }
      },

      deleteTask: async (projectId, taskId) => {
        try {
          await api.delete(`/projects/${projectId}/tasks/${taskId}`);
          set((state) => ({
          projects: state.projects.map((p) =>
            (p._id || p.id) === projectId
              ? { ...p, tasks: (p.tasks || []).filter((t) => (t._id || t.id) !== taskId) }
              : p,
          ),
        }));
        } catch (error: any) {
          toast.error("[ SYSTEM_LOG: TASK_DELETION_FAILED ]", {
            description: "The task could not be deleted.",
          });
        }
      },

      updateTask: async (projectId, taskId, data) => {
        try {
          await api.put(`/projects/${projectId}/tasks/${taskId}`, data);
          set((state) => ({
            projects: state.projects.map((p) =>
              (p._id || p.id) === projectId
                ? {
                    ...p,
                    tasks: (p.tasks || []).map((t) =>
                      (t._id || t.id) === taskId ? { ...t, ...data } : t,
                    ),
                  }
                : p,
            ),
          }));
        } catch (error: any) {
          toast.error("[ SYSTEM_LOG: TASK_UPDATE_FAILED ]", {
            description: "The task could not be updated.",
          });
        }
      },

      updateColumn: async (taskId, status) => {
      set((state) => ({
        projects: state.projects.map((p) => ({
          ...p,
          tasks: (p.tasks || []).map((t) =>
            (t._id || t.id) === taskId ? { ...t, status } : t
          ),
        })),
      }));

      try {
        await api.put(`/tasks/${taskId}`, { status });
      } catch (error: any) {
        toast.error("[ SYSTEM_LOG: TASK_MOVE_FAILED ]", {
          description: "Could not update task status on the server.",
        });
      }
    },
    }),
    {
      name: "project-storage",
    },
  ),
);
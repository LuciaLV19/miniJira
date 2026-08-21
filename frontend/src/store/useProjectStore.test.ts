import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useProjectStore } from "./useProjectStore";
import api from "../api/axios";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useProjectStore", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    useProjectStore.setState({
      projects: [],
      activeProjectId: undefined,
      loading: false,
      error: null,
      isOpenModalProject: false,
      isOpenModalTask: false,
      projectToEdit: undefined,
      taskToEdit: undefined,
    });

    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("createProject", () => {
    it("debería crear un proyecto y añadirlo al estado", async () => {
      vi.mocked(api.post).mockResolvedValue({
        data: {
          _id: "project-123",
          name: "Mi proyecto",
          description: "Proyecto de prueba",
          createdBy: "user-123",
          tasks: [],
        },
      });

      await useProjectStore
        .getState()
        .createProject("Mi proyecto", "Proyecto de prueba");

      const { projects, activeProjectId } = useProjectStore.getState();

      expect(api.post).toHaveBeenCalledWith("/projects", {
        name: "Mi proyecto",
        description: "Proyecto de prueba",
      });

      expect(projects).toHaveLength(1);
      expect(projects[0].id).toBe("project-123");
      expect(projects[0].name).toBe("Mi proyecto");
      expect(activeProjectId).toBe("project-123");
    });

    it("no debería añadir el proyecto si la API falla", async () => {
      vi.mocked(api.post).mockRejectedValue(new Error("Server error"));

      await useProjectStore
        .getState()
        .createProject("Proyecto fallido", "Este proyecto no debería crearse");

      const { projects, activeProjectId } = useProjectStore.getState();

      expect(projects).toHaveLength(0);
      expect(activeProjectId).toBeUndefined();
    });
  });

  describe("Modal controls", () => {
    it("debería abrir y cerrar el modal de proyecto", () => {
      let state = useProjectStore.getState();
      expect(state.isOpenModalProject).toBe(false);

      useProjectStore.getState().openProjectModal();
      state = useProjectStore.getState();
      expect(state.isOpenModalProject).toBe(true);

      useProjectStore.getState().closeProjectModal();
      state = useProjectStore.getState();
      expect(state.isOpenModalProject).toBe(false);
    });

    it("debería abrir y cerrar el modal de tarea", () => {
      let state = useProjectStore.getState();
      expect(state.isOpenModalTask).toBe(false);

      useProjectStore.getState().openTaskModal();
      state = useProjectStore.getState();
      expect(state.isOpenModalTask).toBe(true);

      useProjectStore.getState().closeTaskModal();
      state = useProjectStore.getState();
      expect(state.isOpenModalTask).toBe(false);
    });
  });

  describe("Project selection", () => {
    it("debería establecer el proyecto activo", () => {
      useProjectStore.getState().setActiveProjectId("project-456");

      const { activeProjectId } = useProjectStore.getState();
      expect(activeProjectId).toBe("project-456");
    });
  });
});
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as taskController from "../controllers/taskController.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

vi.mock("../models/Task.js");
vi.mock("../models/Project.js");

describe("taskController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { _id: "user-123" },
      params: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe("createTask", () => {
    it("debería crear una tarea correctamente", async () => {
      req.body = {
        title: "Nueva Tarea",
        description: "Descripción de la tarea",
        status: "TODO",
      };
      req.params.projectId = "proj-123";

      const newTask = {
        _id: "task-123",
        title: "Nueva Tarea",
        description: "Descripción de la tarea",
        status: "TODO",
        projectId: "proj-123",
        save: vi.fn().mockResolvedValue(this),
      };

      vi.mocked(Task).mockImplementation(() => newTask);
      newTask.save.mockResolvedValue(newTask);
      vi.mocked(Project.findByIdAndUpdate).mockResolvedValue({});

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it("debería retornar error si falta el título", async () => {
      req.body = {
        description: "Sin título",
      };
      req.params.projectId = "proj-123";

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getTasks", () => {
    it("debería obtener todas las tareas del proyecto", async () => {
      req.params.projectId = "proj-123";

      const tasks = [
        { _id: "task-1", title: "Tarea 1", status: "TODO" },
        { _id: "task-2", title: "Tarea 2", status: "IN_PROGRESS" },
      ];

      vi.mocked(Task.find).mockResolvedValue(tasks);

      await taskController.getTasks(req, res);

      expect(Task.find).toHaveBeenCalledWith({ projectId: "proj-123" });
      expect(res.json).toHaveBeenCalledWith(tasks);
    });
  });

  describe("updateTask", () => {
    it("debería actualizar una tarea", async () => {
      req.params.taskId = "task-123";
      req.body = {
        title: "Título actualizado",
        status: "DONE",
      };

      const updatedTask = {
        _id: "task-123",
        title: "Título actualizado",
        status: "DONE",
      };

      vi.mocked(Task.findByIdAndUpdate).mockResolvedValue(updatedTask);

      await taskController.updateTask(req, res);

      expect(Task.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it("debería retornar error si la tarea no existe", async () => {
      req.params.taskId = "nonexistent";
      req.body = {};

      vi.mocked(Task.findByIdAndUpdate).mockResolvedValue(null);

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteTask", () => {
    it("debería eliminar una tarea", async () => {
      req.params.taskId = "task-123";
      req.params.projectId = "proj-123";

      vi.mocked(Task.findByIdAndDelete).mockResolvedValue({ _id: "task-123" });
      vi.mocked(Project.findByIdAndUpdate).mockResolvedValue({});

      await taskController.deleteTask(req, res);

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith("task-123");
      expect(res.json).toHaveBeenCalled();
    });
  });
});

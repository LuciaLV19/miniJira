import { describe, it, expect, vi, beforeEach } from "vitest";
import * as projectController from "../controllers/projectController.js";
import Project from "../models/Project.js";

vi.mock("../models/Project.js");

describe("projectController", () => {
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

  describe("getProjects", () => {
    it("debería obtener todos los proyectos del usuario", async () => {
      const projects = [
        { _id: "proj-1", name: "Proyecto 1", createdBy: "user-123" },
        { _id: "proj-2", name: "Proyecto 2", createdBy: "user-123" },
      ];

      vi.mocked(Project.find).mockReturnValue({
        sort: vi.fn().mockResolvedValue(projects),
      });

      await projectController.getProjects(req, res);

      expect(Project.find).toHaveBeenCalledWith({ createdBy: "user-123" });
      expect(res.json).toHaveBeenCalledWith(projects);
    });

    it("debería retornar error si hay problema con la BD", async () => {
      vi.mocked(Project.find).mockReturnValue({
        sort: vi.fn().mockRejectedValue(new Error("DB Error")),
      });

      await projectController.getProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to fetch projects",
        }),
      );
    });
  });

  describe("createProject", () => {
    it("debería crear un proyecto correctamente", async () => {
      req.body = {
        name: "Nuevo Proyecto",
        description: "Descripción",
      };

      const newProject = {
        _id: "proj-123",
        name: "Nuevo Proyecto",
        description: "Descripción",
        createdBy: "user-123",
        save: vi.fn().mockResolvedValue(this),
      };

      vi.mocked(Project).mockImplementation(() => newProject);
      newProject.save.mockResolvedValue(newProject);

      await projectController.createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newProject);
    });

    it("debería retornar error si falta el nombre", async () => {
      req.body = {
        description: "Descripción sin nombre",
      };

      await projectController.createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Project name is required",
      });
    });
  });
});

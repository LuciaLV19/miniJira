import { describe, it, expect, vi, beforeEach } from "vitest";
import * as projectController from "../controllers/projectController.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

vi.mock("../models/Project.js");
vi.mock("../models/User.js");

describe("projectController", () => {
  let req, res, next;

  beforeEach(() => {
    vi.restoreAllMocks();
    req = {
      body: {},
      user: { _id: "user-123", id: "user-123" },
      params: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  describe("getProjects", () => {
    it("debería obtener todos los proyectos del usuario", async () => {
      const projects = [
        { _id: "proj-1", name: "Proyecto 1", createdBy: "user-123" },
        { _id: "proj-2", name: "Proyecto 2", createdBy: "user-123" },
      ];

      const query = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue(projects),
      };
      vi.mocked(Project.find).mockReturnValue(query);

      await projectController.getProjects(req, res, next);

      expect(query.populate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            path: "createdBy",
            select: "_id username email",
          }),
          expect.objectContaining({
            path: "members",
            select: "_id username email",
          }),
        ]),
      );
      expect(res.json).toHaveBeenCalledWith(projects);
    });

    it("debería retornar error si hay problema con la BD", async () => {
      vi.mocked(Project.find).mockReturnValue({
        sort: vi.fn().mockRejectedValue(new Error("DB Error")),
      });

      await projectController.getProjects(req, res, next);

      if (res.status.mock.calls.length > 0) {
        expect(res.status).toHaveBeenCalledWith(500);
      } else {
        expect(next).toHaveBeenCalledWith(expect.any(Error));
      }
    });
  });

  describe("createProject", () => {
    it("debería crear un proyecto correctamente", async () => {
      req.body = {
        name: "Nuevo Proyecto",
        description: "Descripción",
      };

      const savedProject = {
        _id: "proj-123",
        name: "Nuevo Proyecto",
        description: "Descripción",
        createdBy: "user-123",
      };

      vi.spyOn(Project.prototype, "save").mockResolvedValue(savedProject);

      await projectController.createProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("debería retornar error si falta el nombre", async () => {
      req.body = {
        description: "Descripción sin nombre",
      };

      await projectController.createProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Project name is required",
      });
    });
  });

  describe("inviteMember", () => {
    it("debería registrar la invitación como pendiente y mostrarla en la UI", async () => {
      req.params = { projectId: "proj-123" };
      req.body = { email: "nuevo@correo.com" };

      const project = {
        _id: "proj-123",
        createdBy: { toString: () => "user-123" },
        members: [],
        pendingInvitations: [],
        save: vi.fn().mockResolvedValue(true),
      };

      vi.mocked(Project.findById).mockResolvedValue(project);
      vi.mocked(User.findOne).mockResolvedValue({
        _id: "user-456",
        username: "Nuevo Usuario",
        email: "nuevo@correo.com",
      });
      vi.mocked(User.findById).mockReturnValue({
        select: vi.fn().mockResolvedValue({
          _id: "user-123",
          username: "Owner",
          email: "owner@correo.com",
        }),
      });

      await projectController.inviteMember(req, res);

      expect(project.pendingInvitations).toContainEqual(
        expect.objectContaining({
          email: "nuevo@correo.com",
          status: "pending",
        }),
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Invitation sent successfully"),
          invitation: expect.objectContaining({
            email: "nuevo@correo.com",
            status: "pending",
          }),
        }),
      );
    });
  });
});

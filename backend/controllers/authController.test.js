import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as authController from "../controllers/authController.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

vi.mock("../models/User.js");
vi.mock("jsonwebtoken");

describe("authController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    it("debería registrar un nuevo usuario correctamente", async () => {
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const newUser = {
        _id: "user-123",
        username: "testuser",
        email: "test@example.com",
      };

      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(User.create).mockResolvedValue(newUser);
      vi.mocked(jwt.sign).mockReturnValue("test-token");

      await authController.registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: "user-123",
          username: "testuser",
          email: "test@example.com",
          token: "test-token",
        }),
      );
    });

    it("debería retornar error si el usuario ya existe", async () => {
      req.body = {
        username: "testuser",
        email: "existing@example.com",
        password: "password123",
      };

      vi.mocked(User.findOne).mockResolvedValue({
        email: "existing@example.com",
      });

      await authController.registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User already exists",
      });
    });

    it("debería retornar error si faltan campos", async () => {
      req.body = {
        username: "testuser",
      };

      await authController.registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please fill in all fields",
      });
    });
  });

  describe("loginUser", () => {
    it("debería hacer login correctamente con credenciales válidas", async () => {
      req.body = {
        email: "test@example.com",
        password: "password123",
      };

      const user = {
        _id: "user-123",
        username: "testuser",
        email: "test@example.com",
        comparePassword: vi.fn().mockResolvedValue(true),
      };

      vi.mocked(User.findOne).mockResolvedValue(user);
      vi.mocked(jwt.sign).mockReturnValue("test-token");

      await authController.loginUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: "user-123",
          username: "testuser",
          email: "test@example.com",
          token: "test-token",
        }),
      );
    });

    it("debería retornar error con credenciales inválidas", async () => {
      req.body = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      vi.mocked(User.findOne).mockResolvedValue(null);

      await authController.loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
    });
  });
});

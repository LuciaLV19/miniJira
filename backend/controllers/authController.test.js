import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as authController from "../controllers/authController.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "../services/emailService.js";

vi.mock("../models/User.js");
vi.mock("jsonwebtoken");
vi.mock("../services/emailService.js", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

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
        confirmPassword: "password123",
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
        confirmPassword: "password123",
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

    it("debería retornar error si las contrasenas no coinciden", async () => {
      req.body = {
        email: "test@example.com",
        password: "wrongpassword",
        confirmPassword: "differentpassword",
      };

      vi.mocked(User.findOne).mockResolvedValue(null);

      await authController.loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
    });

    it("debería retornar error si el email ya existe", async () => {
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      };

      vi.mocked(User.findOne).mockResolvedValue({
        _id: "existing_id",
        email: "test@example.com",
      });

      await authController.registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User already exists",
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

  describe("requestPasswordReset", () => {
    it("debería crear el enlace usando la URL del frontend origin en lugar de la API", async () => {
      req = {
        body: { email: "test@example.com" },
        headers: { origin: "http://localhost:5173" },
      };

      const user = {
        email: "test@example.com",
        username: "testuser",
        passwordResetToken: null,
        passwordResetExpires: null,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.stubEnv("CLIENT_URL", "http://localhost:3000");
      vi.mocked(User.findOne).mockResolvedValue(user);

      await authController.requestPasswordReset(req, res, next);

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          username: "testuser",
          resetUrl: expect.stringContaining(
            "http://localhost:5173/reset-password/",
          ),
        }),
      );
      expect(res.json).toHaveBeenCalledWith({
        message:
          "If an account exists for that email, reset instructions have been sent.",
      });
    });
  });
});

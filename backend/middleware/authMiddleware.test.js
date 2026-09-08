import { describe, it, expect, vi, beforeEach } from "vitest";
import { protect } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

vi.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe("protect middleware", () => {
    it("debería permitir acceso con un token válido", async () => {
      req.headers.authorization = "Bearer valid-token";

      vi.mocked(jwt.verify).mockReturnValue({ id: "user-123" });

      await protect(req, res, next);

      expect(req.user).toEqual({ id: "user-123" });
      expect(next).toHaveBeenCalled();
    });

    it("debería rechazar solicitud sin token", async () => {
      req.headers.authorization = undefined;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining("token"),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("debería rechazar token inválido", async () => {
      req.headers.authorization = "Bearer invalid-token";

      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it("debería extraer correctamente el token del header", async () => {
      req.headers.authorization = "Bearer some-token";

      vi.mocked(jwt.verify).mockReturnValue({ id: "user-123" });

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        "some-token",
        process.env.JWT_SECRET,
      );
    });

    it("debería rechazar token sin prefijo Bearer", async () => {
      req.headers.authorization = "some-token";

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
});

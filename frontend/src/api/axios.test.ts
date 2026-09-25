import { describe, it, expect, vi, afterEach } from "vitest";
import api from "./axios";
import { useAuthStore } from "../store/useAuthStore";

describe("API Axios Client", () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("Base Configuration", () => {
    it("debería tener la URL base configurada correctamente", () => {
      expect(api.defaults.baseURL).toBe("http://localhost:3000/api");
    });

    it("debería tener el header Content-Type correcto", () => {
      expect(api.defaults.headers["Content-Type"]).toBe("application/json");
    });

    it("debería tener todos los métodos HTTP disponibles", () => {
      expect(api.get).toBeDefined();
      expect(api.post).toBeDefined();
      expect(api.put).toBeDefined();
      expect(api.delete).toBeDefined();
      expect(typeof api.get).toBe("function");
      expect(typeof api.post).toBe("function");
      expect(typeof api.put).toBe("function");
      expect(typeof api.delete).toBe("function");
    });
  });

  describe("Interceptors Configuration", () => {
    it("debería tener interceptores de request y response definidos", () => {
      expect(api.interceptors).toBeDefined();
      expect(api.interceptors.request).toBeDefined();
      expect(api.interceptors.response).toBeDefined();
    });

    it("debería tener métodos para registrar interceptores", () => {
      expect(api.interceptors.request.use).toBeDefined();
      expect(api.interceptors.response.use).toBeDefined();
      expect(typeof api.interceptors.request.use).toBe("function");
      expect(typeof api.interceptors.response.use).toBe("function");
    });
  });

  describe("Token Handling", () => {
    it("debería poder guardar un token en localStorage", () => {
      const token = "test-token-123";
      localStorage.setItem("token", token);
      expect(localStorage.getItem("token")).toBe(token);
    });

    it("debería tener token nulo si no se ha guardado", () => {
      localStorage.clear();
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("debería usar el token del store cuando localStorage está vacío", () => {
      localStorage.clear();
      useAuthStore.setState({ token: "store-token-123" });

      const config = api.interceptors.request.handlers[0].fulfilled({
        headers: {},
      });

      expect(config.headers.Authorization).toBe("Bearer store-token-123");
    });
  });
});

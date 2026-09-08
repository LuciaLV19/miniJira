import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "./LoginForm";
import api from "../../api/axios";

vi.mock("../../api/axios");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("LoginForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.post).mockClear();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>,
    );
  };

  it("debería renderizar el formulario de login", () => {
    renderComponent();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("debería actualizar los inputs cuando se escribe", () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("debería hacer login con credenciales válidas", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        token: "test-token",
        user: { id: "user-123", email: "test@example.com" },
      },
    });

    const localStorageSpy = vi.spyOn(Storage.prototype, "setItem");

    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login|sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@example.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(localStorageSpy).toHaveBeenCalledWith("token", "test-token");
    });

    localStorageSpy.mockRestore();
  });

  it("no debería enviar el formulario si está vacío", () => {
    renderComponent();

    const submitButton = screen.getByRole("button", { name: /login|sign in/i });

    fireEvent.click(submitButton);

    expect(api.post).not.toHaveBeenCalled();
  });

  it("debería mostrar/ocultar la contraseña", () => {
    renderComponent();

    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;
    const toggleButton = screen.getByRole("button", {
      name: /show|hide|toggle/i,
    });

    expect(passwordInput.type).toBe("password");

    fireEvent.click(toggleButton);

    expect(passwordInput.type).toBe("text");
  });
});

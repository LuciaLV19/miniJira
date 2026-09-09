import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ProjectList from "../components/projects/ProjectList";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import * as authService from "../services/authService";
import * as projectService from "../services/projectService";

vi.mock("../services/authService", () => ({
  loginApi: vi.fn(),
  registerApi: vi.fn(),
  updateProfileApi: vi.fn(),
  changePasswordApi: vi.fn(),
}));

vi.mock("../services/projectService", () => ({
  createTaskApi: vi.fn(),
  fetchProjectsApi: vi.fn(),
  createProjectApi: vi.fn(),
  deleteProjectApi: vi.fn(),
  updateProjectApi: vi.fn(),
  deleteTaskApi: vi.fn(),
  updateTaskApi: vi.fn(),
}));

const renderInRouter = (ui: React.ReactNode) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe("critical user flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null });
    useProjectStore.setState({
      projects: [],
      activeProjectId: undefined,
      isOpenModalTask: false,
      taskToEdit: undefined,
      loading: false,
      error: null,
    });
  });

  it("shows validation feedback and a loading state while signing in", async () => {
    const user = userEvent.setup();
    const loginPromise = new Promise<{
      token: string;
      user: { email: string };
    }>(() => {});
    vi.mocked(authService.loginApi).mockReturnValue(loginPromise);
    renderInRouter(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email/i), "qa@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(authService.loginApi).toHaveBeenCalledWith({
      email: "qa@example.com",
      password: "secret123",
    });
    expect(screen.getByRole("button", { name: "" })).toBeDisabled();
  });

  it("registers a user and sends the entered credentials to the API", async () => {
    const user = userEvent.setup();
    vi.mocked(authService.registerApi).mockResolvedValue({
      token: "register-token",
      username: "Ada",
      email: "ada@example.com",
    });
    renderInRouter(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), "Ada");
    await user.type(screen.getByLabelText(/^email$/i), "ada@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(authService.registerApi).toHaveBeenCalledWith({
        username: "Ada",
        email: "ada@example.com",
        password: "secret123",
      });
    });
  });

  it("renders projects and filters them using the visible search result", () => {
    useProjectStore.setState({
      projects: [
        {
          id: "p-1",
          name: "Website redesign",
          description: "Public site",
          key: "WEB",
          tasks: [],
        },
        {
          id: "p-2",
          name: "Mobile app",
          description: "iOS and Android",
          key: "APP",
          tasks: [],
        },
      ],
    });

    render(<ProjectList searchQuery="mobile" />);

    expect(screen.getByText("Mobile app")).toBeInTheDocument();
    expect(screen.queryByText("Website redesign")).not.toBeInTheDocument();
  });

  it("validates and creates a task from the task modal", async () => {
    const user = userEvent.setup();
    vi.mocked(projectService.createTaskApi).mockResolvedValue({
      _id: "task-1",
      title: "Fix navigation",
      description: "Repair the menu",
      status: "BACKLOG",
      priority: "HIGH",
    });
    useProjectStore.setState({
      isOpenModalTask: true,
      activeProjectId: "p-1",
    });
    renderInRouter(<CreateTaskModal />);

    await user.click(screen.getByRole("button", { name: /^save$/i }));
    expect(screen.getByText("Task name is required")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/task name/i), "Fix navigation");
    await user.type(
      screen.getByLabelText(/task description/i),
      "Repair the menu",
    );
    await user.selectOptions(screen.getByLabelText(/task priority/i), "HIGH");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(projectService.createTaskApi).toHaveBeenCalledWith("p-1", {
        title: "Fix navigation",
        description: "Repair the menu",
        status: "BACKLOG",
        priority: "HIGH",
        category: "",
        dueDate: "",
        assignee: undefined,
      });
    });
  });
});

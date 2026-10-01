import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import swal from "sweetalert2";
import ProjectCards from "./ProjectCards";
import { useProjectStore } from "../../store/useProjectStore";
import { useAuthStore } from "../../store/useAuthStore";
import * as projectService from "../../services/projectService";
import type { Project } from "../../types/Project";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe("ProjectCards", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.setState({
      user: { _id: "owner-1", username: "Owner", email: "owner@example.com" },
    });
    useProjectStore.setState({
      activeProjectId: undefined,
      projects: [],
    });
  });

  const project: Project = {
    id: "project-1",
    name: "Project Alpha",
    description: "Project for testing",
    createdAt: "2026-09-29",
    createdBy: { _id: "owner-1", username: "Owner" },
    isFavorite: false,
    tasks: [],
  };

  it("debería mantener visibles los botones de editar y eliminar en móvil", () => {
    render(<ProjectCards project={project} />);

    const actionsContainer = screen
      .getByRole("button", { name: /\[edit\]/i })
      .closest("div");

    expect(actionsContainer).toHaveClass("opacity-100");
    expect(actionsContainer).toHaveClass("md:opacity-0");
  });

  it("confirma la salida y abandona el proyecto si el usuario no es el propietario", async () => {
    useAuthStore.setState({
      user: {
        _id: "member-1",
        username: "Member",
        email: "member@example.com",
      },
    });
    vi.mocked(swal.fire).mockResolvedValue({ isConfirmed: true } as never);
    const leaveProject = vi
      .spyOn(projectService, "leaveProjectApi")
      .mockResolvedValue();

    render(
      <ProjectCards
        project={{
          ...project,
          createdBy: { _id: "owner-1", username: "Owner" },
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /\[exit\]/i }));

    await waitFor(() => {
      expect(swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "¿Deseas abandonar el proyecto [Project Alpha]?",
        }),
      );
      expect(leaveProject).toHaveBeenCalledWith("project-1");
    });
  });
});

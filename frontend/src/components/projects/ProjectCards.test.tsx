import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectCards from "./ProjectCards";
import { useProjectStore } from "../../store/useProjectStore";
import type { Project } from "../../types/Project";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe("ProjectCards", () => {
  beforeEach(() => {
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
});

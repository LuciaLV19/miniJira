import { describe, it, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProjectView from "./ProjectView";
import { useProjectStore } from "../../store/useProjectStore";
import { useAuthStore } from "../../store/useAuthStore";

describe("ProjectView", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { _id: "owner-1", username: "Owner", email: "owner@example.com" },
    });
    useProjectStore.setState({
      activeProjectId: "project-1",
      projects: [
        {
          id: "project-1",
          name: "Project Alpha",
          description: "Example project",
          createdAt: "2026-09-29",
          createdBy: {
            _id: "owner-1",
            username: "Owner",
            email: "owner@example.com",
          },
          members: [
            {
              _id: "member-1",
              username: "Member One",
              email: "member@example.com",
            },
          ],
          pendingInvitations: [],
          tasks: [],
          isFavorite: false,
        },
      ],
      taskToEdit: undefined,
      isOpenModalTask: false,
    });
  });

  it("no debería mostrar al creador en la lista de miembros 'Joined' ni como email invitado", () => {
    render(
      <MemoryRouter initialEntries={["/projects/project-1"]}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectView />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /invite member/i }));

    expect(screen.queryByText(/owner@example.com/i)).not.toBeInTheDocument();
    expect(screen.getByText(/member@example.com/i)).toBeInTheDocument();
  });

  it("oculta las acciones de edición para miembros de solo lectura", () => {
    useAuthStore.setState({
      user: {
        _id: "member-1",
        username: "Member One",
        email: "member@example.com",
      },
    });
    useProjectStore.setState((state) => ({
      projects: state.projects.map((project) => ({
        ...project,
        memberPermissions: [{ user: "member-1", permission: "view" }],
      })),
    }));

    render(
      <MemoryRouter initialEntries={["/projects/project-1"]}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectView />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole("button", { name: /invite member/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /create new task/i }),
    ).not.toBeInTheDocument();
  });
});

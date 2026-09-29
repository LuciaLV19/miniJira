import { describe, it, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProjectView from "./ProjectView";
import { useProjectStore } from "../../store/useProjectStore";

describe("ProjectView", () => {
  beforeEach(() => {
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
});

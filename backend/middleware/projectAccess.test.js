import { describe, expect, it, vi, beforeEach } from "vitest";
import Project from "../models/Project.js";
import { requireProjectPermission } from "./projectAccess.js";

vi.mock("../models/Project.js");

describe("requireProjectPermission", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    vi.resetAllMocks();
    req = {
      params: { projectId: "project-1" },
      user: { _id: "member-1" },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  it("allows view-only members to read a project", async () => {
    vi.mocked(Project.findById).mockResolvedValue({
      _id: "project-1",
      createdBy: "owner-1",
      members: ["member-1"],
      memberPermissions: [{ user: "member-1", permission: "view" }],
    });

    await requireProjectPermission("view")(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.project._id).toBe("project-1");
  });

  it("rejects view-only members from editing", async () => {
    vi.mocked(Project.findById).mockResolvedValue({
      _id: "project-1",
      createdBy: "owner-1",
      members: ["member-1"],
      memberPermissions: [{ user: "member-1", permission: "view" }],
    });

    await requireProjectPermission("edit")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

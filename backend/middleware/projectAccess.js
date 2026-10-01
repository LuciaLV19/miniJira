import Project from "../models/Project.js";

export const requireProjectPermission =
  (requiredPermission = "view") =>
  async (req, res, next) => {
    try {
      const projectId = req.params.projectId;
      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const userId = req.user._id.toString();
      if (project.createdBy.toString() === userId) {
        req.project = project;
        return next();
      }

      const isMember = (project.members || []).some(
        (member) => (member._id || member).toString() === userId,
      );
      if (!isMember) {
        return res
          .status(403)
          .json({ message: "Not authorized to access this project" });
      }

      const permissionEntry = (project.memberPermissions || []).find(
        (entry) => (entry.user?._id || entry.user)?.toString() === userId,
      );
      const permission = permissionEntry?.permission || "edit";
      if (requiredPermission === "edit" && permission !== "edit") {
        return res
          .status(403)
          .json({ message: "View-only access to this project" });
      }

      req.project = project;
      return next();
    } catch (error) {
      return next(error);
    }
  };

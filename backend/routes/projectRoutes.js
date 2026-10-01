import express from "express";
import { validate } from "../middleware/validate.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../schemas/projectSchema.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireProjectPermission } from "../middleware/projectAccess.js";
import taskRoutes from "./taskRoutes.js";

import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
  getProjectMembers,
  inviteMember,
  acceptProjectInvitation,
  leaveProject,
} from "../controllers/projectController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getProjects)
  .post(protect, validate(createProjectSchema), createProject);

router
  .route("/:projectId")
  .delete(protect, deleteProject)
  .put(protect, validate(updateProjectSchema), updateProject);

router
  .route("/:projectId/members")
  .get(protect, requireProjectPermission("view"), getProjectMembers)
  .post(protect, inviteMember);

router.post("/:projectId/members/accept", protect, acceptProjectInvitation);
router.delete("/:projectId/members/leave", protect, leaveProject);

router.use(
  "/:projectId/tasks",
  protect,
  requireProjectPermission("view"),
  taskRoutes,
);
export default router;

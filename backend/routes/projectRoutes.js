import express from "express";
import { validate } from "../middleware/validate.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../schemas/projectSchema.js";
import { protect } from "../middleware/authMiddleware.js";
import taskRoutes from "./taskRoutes.js";

import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
  getProjectMembers,
  inviteMember,
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
  .get(protect, getProjectMembers)
  .post(protect, inviteMember);

router.use("/:projectId/tasks", taskRoutes);
export default router;

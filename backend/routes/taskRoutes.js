import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { requireProjectPermission } from "../middleware/projectAccess.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/taskSchema.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getTasks)
  .post(
    protect,
    requireProjectPermission("edit"),
    validate(createTaskSchema),
    createTask,
  );

router
  .route("/:taskId")
  .put(
    protect,
    requireProjectPermission("edit"),
    validate(updateTaskSchema),
    updateTask,
  )
  .delete(protect, requireProjectPermission("edit"), deleteTask);

export default router;

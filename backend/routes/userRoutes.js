import express from "express";
import {
  getUser,
  updateUser,
  updatePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  updateUserSchema,
  updatePasswordSchema,
} from "../schemas/userSchema.js";

const router = express.Router();

router
  .route("/profile")
  .get(protect, getUser)
  .put(protect, validate(updateUserSchema), updateUser);

router.route("/password").put(protect, updatePassword);

export default router;

import { z } from "zod";

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required")
    .min(8, "Current password must be at least 8 characters"),
  newPassword: z
    .string()
    .min(1, "New password is required")
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New password must contain at least one lowercase letter")
    .regex(/[0-9]/, "New password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "New password must contain at least one special character",
    ),
});

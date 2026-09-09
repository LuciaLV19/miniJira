import { ZodError } from "zod";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const bodyToValidate = req.body || {};

      req.body = schema.parse(bodyToValidate);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues,
        });
      }

      return res
        .status(400)
        .json({ message: "Invalid payload request", error: error.message });
    }
  };
};

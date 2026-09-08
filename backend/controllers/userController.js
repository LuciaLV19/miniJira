import User from "../models/User.js";
import { updatePasswordSchema } from "../schemas/userSchema.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error getting user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error updating profile" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    console.log("currentPassword:", currentPassword);
    console.log("newPassword:", newPassword);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const validation = updatePasswordSchema.safeParse({
      currentPassword,
      newPassword,
    });

    if (!validation.success) {
      return res.status(400).json({ message: validation.error.message });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error updating password" });
  }
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id || decoded._id;

      let user = null;
      try {
        user = await User.findById(userId).select("_id username email");
      } catch (error) {
        user = null;
      }

      req.user = {
        ...decoded,
        _id: userId,
        id: userId,
        ...(user
          ? {
              username: user.username,
              email: user.email,
            }
          : {}),
      };
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};

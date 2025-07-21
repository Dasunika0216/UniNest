import jwt from "jsonwebtoken";
import Host from "../models/host.model.js";

const adminAuth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized, Login again!",
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Host.findById(token_decode.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    req.user = user;
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default adminAuth;

import { Router } from "express";
import {
  signUp,
  signIn,
  fetchHostData,
  getAdminStatistics,
  checkUserRole,
  testAuth,
} from "../controllers/auth.controller.js";
import authorize from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/refresh-token", (req, res) =>
  res.send({ message: "Refresh token" })
);
authRouter.post("/host-profile", authorize, fetchHostData);
authRouter.get("/admin/statistics", authorize, getAdminStatistics);
authRouter.get("/check-role", authorize, checkUserRole);
authRouter.get("/test-auth", authorize, testAuth);

export default authRouter;

import { Router } from "express";
import {
  signUp,
  signIn,
  fetchHostData,
} from "../controllers/auth.controller.js";
import authorize from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/refresh-token", (req, res) =>
  res.send({ message: "Refresh token" })
);
authRouter.post("/host-profile", authorize, fetchHostData);

export default authRouter;

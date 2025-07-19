import { Router } from "express";
import {
  getAllHosts,
  getHostById,
  getPendingHosts,
  updateHostStatus,
} from "../controllers/host.controller.js";
import authorize from "../middleware/auth.middleware.js";
import adminAuth from "../middleware/admin.middleware.js";

const hostRouter = Router();

// Admin-protected routes
hostRouter.get("/", adminAuth, getAllHosts);
hostRouter.get("/pending", adminAuth, getPendingHosts);
hostRouter.put("/:id/status", adminAuth, updateHostStatus);

hostRouter.get("/:id", authorize, getHostById);

hostRouter.post("/", (req, res) => res.send({ message: "CREATE new host" }));

hostRouter.put("/:id", (req, res) =>
  res.send({ message: `UPDATE host with id ${req.params.id}` })
);

hostRouter.delete("/:id", (req, res) =>
  res.send({ message: `DELETE host with id ${req.params.id}` })
);

export default hostRouter;

import express from "express";
import {
  addBoarding,
  listBoarding,
  deleteBoarding,
  updateBoarding,
  filterBoarding,
} from "../controllers/boarding.controller.js";
import upload from "../middleware/upload.middleware.js";

const boardingRouter = express.Router();

// Create
boardingRouter.post("/add-boarding", upload.array("images"), addBoarding);

// Read
boardingRouter.get("/list-boarding", listBoarding);

//Public filter/search endpoint
boardingRouter.get("/filter-boarding", filterBoarding);

// 🆕 Update
boardingRouter.put("/:id", updateBoarding); // PUT /api/boarding/:id

// 🆕 Delete
boardingRouter.delete("/:id", deleteBoarding); // DELETE /api/boarding/:id

export default boardingRouter;

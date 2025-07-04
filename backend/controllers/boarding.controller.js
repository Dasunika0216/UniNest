import boardingModel from "../models/boarding.model.js";
import jwt from "jsonwebtoken";

const addBoarding = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);
    console.log("BODY RECEIVED:", req.body);

    // Authorization check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized! Login again" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized! Login again" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const hostId = decoded.id;

    // Destructuring the request body for boarding details
    const {
      address,
      cost,
      type,
      availableCount,
      description,
      facilities,
    } = req.body;

    // Handle images from the request body (as URLs)
    let images = req.body["images[]"] || req.body.images || [];

    if (!Array.isArray(images)) {
      images = [images]; // Convert to array if only one image was sent
    }

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: "No images provided" });
    }


    // Create the boarding details object
    const boardingDetails = {
      hostId,
      address,
      cost,
      type,
      availableCount,
      description,
      facilities,
      images,
    };

    // Create and save the new boarding instance to the database
    const newBoarding = new boardingModel(boardingDetails);
    await newBoarding.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Boarding place added successfully",
      data: newBoarding,
    });

  } catch (error) {
    console.error("Error adding boarding:", error);
    console.error("Stack Trace:", error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default addBoarding;


const listBoarding = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized! Login again" });
    }
    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const hostId = decoded.id;

    const boardings = await boardingModel.find({ hostId });

    if (boardings.length === 0) {
      return res.json({ success: false, message: "No boardings found" });
    }

    res.json({ success: true, data: boardings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// DELETE a boarding
const deleteBoarding = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await boardingModel.findByIdAndDelete(id);


    if (!deleted) {
      return res.status(404).json({ success: false, message: "Boarding not found" });
    }

    res.status(200).json({ success: true, message: "Boarding deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// UPDATE a boarding
const updateBoarding = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      address,
      cost,
      type,
      availableCount,
      description,
      facilities,
      newImages = [],
      removedImages = []
    } = req.body;

    // Fetch existing document
    const boarding = await boardingModel.findById(id);
    if (!boarding) {
      return res.status(404).json({ success: false, message: "Boarding not found" });
    }

    // Remove images from DB
    if (Array.isArray(removedImages)) {
      boarding.images = boarding.images.filter(img => !removedImages.includes(img));
    }

    // Add new images (Cloudinary URLs)
    if (Array.isArray(newImages)) {
      boarding.images.push(...newImages);
    }

    // Update other fields
    if (address !== undefined) boarding.address = address;
    if (cost !== undefined) boarding.cost = cost;
    if (type !== undefined) boarding.type = type;
    if (availableCount !== undefined) boarding.availableCount = availableCount;
    if (description !== undefined) boarding.description = description;
    if (facilities !== undefined) boarding.facilities = facilities;

    await boarding.save();

    res.status(200).json({ success: true, message: "Boarding updated", data: boarding });

  } catch (err) {
    console.error("Error updating boarding:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


export { addBoarding, listBoarding, deleteBoarding, updateBoarding, };

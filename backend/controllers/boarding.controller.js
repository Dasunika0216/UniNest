import boardingModel from "../models/boarding.model.js";
import jwt from "jsonwebtoken";

const addBoarding = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);
    console.log("BODY RECEIVED:", req.body);

    // Authorization check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized! Login again" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized! Login again" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const hostId = decoded.id;

    // Destructuring the request body for boarding details
    const { address, gender, cost, type, availableCount, description } = req.body;

    // Validate gender - only allow "Girls" or "Boys"
    if (!gender || (gender !== "Girls" && gender !== "Boys")) {
      return res
        .status(400)
        .json({ success: false, message: "Gender must be either 'Girls' or 'Boys'" });
    }

    // Handle facilities as array
    let facilities = req.body.facilities;
    if (typeof facilities === 'string') {
      facilities = [facilities];
    } else if (!Array.isArray(facilities)) {
      facilities = [];
    }

    // Handle images from the request body (as URLs)
    let images = req.body["images[]"] || req.body.images || [];

    if (!Array.isArray(images)) {
      images = [images]; // Convert to array if only one image was sent
    }

    if (images.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images provided" });
    }

    // Create the boarding details object
    const boardingDetails = {
      hostId,
      address,
      gender,
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
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized! Login again" });
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
      return res
        .status(404)
        .json({ success: false, message: "Boarding not found" });
    }

    res.status(200).json({ success: true, message: "Boarding deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// UPDATE a boarding
const updateBoarding = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, cost, type, availableCount, description, facilities, removedImages, newImages } = req.body;

    console.log("Update request for ID:", id);
    console.log("Request body:", req.body);

    // Find the boarding first
    const boarding = await boardingModel.findById(id);
    
    if (!boarding) {
      console.log("Boarding not found for ID:", id);
      return res.status(404).json({ success: false, message: "Boarding not found" });
    }

    console.log("Found boarding:", boarding);

    // Update basic fields (note: gender is not included as it shouldn't be changed)
    const updateData = {};
    if (address !== undefined) updateData.address = address;
    if (cost !== undefined) updateData.cost = cost;
    if (type !== undefined) updateData.type = type;
    if (availableCount !== undefined) updateData.availableCount = availableCount;
    if (description !== undefined) updateData.description = description;
    if (facilities !== undefined) {
      // Handle facilities as array
      if (typeof facilities === 'string') {
        updateData.facilities = [facilities];
      } else if (Array.isArray(facilities)) {
        updateData.facilities = facilities;
      }
    }

    // Handle image updates - only if boarding has images or we're adding new ones
    if (boarding.images || (newImages && newImages.length > 0)) {
      let updatedImages = [...(boarding.images || [])];
      
      // Remove images if specified
      if (removedImages && Array.isArray(removedImages)) {
        updatedImages = updatedImages.filter(img => !removedImages.includes(img));
      }
      
      // Add new images if specified (these should be Cloudinary URLs from frontend)
      if (newImages && Array.isArray(newImages)) {
        updatedImages.push(...newImages);
      }
      
      updateData.images = updatedImages;
    }

    console.log("Update data:", updateData);

    // Update the boarding
    const updatedBoarding = await boardingModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );

    console.log("Updated boarding:", updatedBoarding);

    res.status(200).json({ 
      success: true, 
      message: "Boarding updated successfully", 
      data: updatedBoarding 
    });

  } catch (err) {
    console.error("Error updating boarding:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: err.message 
    });
  }
};

const filterBoarding = async (req, res) => {
  try {
    const filter = {};

    //filter by type if provided
    if (req.query.type) {
      filter.type = req.query.type;
    }

    //filter by facilities if provided
    if (req.query.facilities) {
      const facilitiesArray = req.query.facilities.split(",");

      // Create case-insensitive regex patterns for each facility
      const facilityRegexes = facilitiesArray.map((facility) => {
        // Trim whitespace and escape special regex characters
        const cleanFacility = facility
          .trim()
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`^${cleanFacility}$`, "i");
      });

      filter.facilities = { $all: facilityRegexes };
    }

    //filter by gender if provided
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }

    //filter by cost range if provided
    if (req.query.minCost || req.query.maxCost) {
      filter.cost = {};
      if (req.query.minCost) {
        const minCost = Number(req.query.minCost);
        if (!isNaN(minCost)) {
          filter.cost.$gte = minCost;
        }
      }
      if (req.query.maxCost) {
        const maxCost = Number(req.query.maxCost);
        if (!isNaN(maxCost)) {
          filter.cost.$lte = maxCost;
        }
      }
    }

    const boardings = await boardingModel.find(filter);

    res.json({ success: true, data: boardings });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addBoarding,
  listBoarding,
  deleteBoarding,
  updateBoarding,
  filterBoarding,
};

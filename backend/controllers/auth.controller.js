import mongoose from "mongoose";
import Host from "../models/host.model.js";
import boardingModel from "../models/boarding.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      username,
      email,
      password,
      fullName,
      phone,
      city,
      postalCode,
      boardingAddressForApproval,
      propertyType,
      description,
      boardingImageForApproval,
    } = req.body;

    // Check if the user already exists
    const existingUser = await Host.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already exists!"
            : "Username already exists!",
      });
    } // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new host
    const newHosts = await Host.create(
      [
        {
          username,
          role: "user",
          email,
          password: hashedPassword,
          fullName,
          phone,
          city,
          postalCode,
          boardingAddressForApproval,
          propertyType,
          description,
          boardingImageForApproval,
          status: "pending",
          emailVerified: true, // Skip email verification for now
          profileCompleted: true, // Since all required info is provided
        },
      ],
      { session }
    );

    const token = createToken(newHosts[0]._id);

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: "Host created successfully. Awaiting admin approval.",
      data: {
        token,
        host: {
          ...newHosts[0].toObject(),
          password: undefined, // Don't send password back
        },
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Signup error:", error);
    return res.json({
      success: false,
      message: error.message || "Registration failed. Please try again.",
    });
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the host exists
    const host = await Host.findOne({ email });

    if (!host) {
      return res.json({ success: false, message: "User not found!" });
    }

    // If not admin, check approval status
    if (host.role !== "admin") {
      if (host.status !== "approved") {
        return res.json({ success: false, message: "Host not approved yet!" });
      }
      if (host.status === "rejected") {
        return res.json({
          success: false,
          message: "Host application was rejected!",
        });
      }
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, host.password);

    // If the password is incorrect
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials!" });
    }

    // Generate a JWT token
    const token = createToken(host._id);

    return res.json({
      success: true,
      message: "Logged in successfully!",
      data: {
        token,
        host: {
          ...host.toObject(),
          password: undefined,
          emailVerificationToken: undefined,
          phoneVerificationToken: undefined,
        },
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

const fetchHostData = async (req, res) => {
  try {
    const token = req.headers.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const hostData = await Host.findById(userId); // Or use Host.findOne({_id: userId}) if needed

    if (!hostData) {
      return res.json({ success: false, message: "Host not found" });
    }

    res.json({ success: true, data: hostData });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Server error" });
  }
};

// Admin statistics endpoint
const getAdminStatistics = async (req, res) => {
  try {
    console.log("Admin statistics endpoint called");
    console.log("Request headers:", req.headers);
    console.log("Request body userId:", req.body.userId);

    // Get the user ID from the middleware
    const userId = req.body.userId;

    if (!userId) {
      console.log("No userId found in request body");
      return res.status(401).json({
        success: false,
        message: "User ID not found. Please login again.",
      });
    }

    // Verify that the user is an admin
    const user = await Host.findById(userId);
    console.log(
      "User found:",
      user ? { id: user._id, role: user.role, status: user.status } : "null"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
        userRole: user.role,
      });
    }

    // Get approved hosts count
    const approvedHostsCount = await Host.countDocuments({
      status: "approved",
    });

    // Get pending hosts count
    const pendingHostsCount = await Host.countDocuments({ status: "pending" });

    // Debug: Check what boardings exist in the database
    const allBoardings = await boardingModel.find({}).limit(10);
    console.log("All boardings in database:", allBoardings.length);
    console.log(
      "Sample boarding data:",
      allBoardings.length > 0 ? allBoardings[0] : "No boardings found"
    );

    // Debug: Check distinct types in boarding collection
    const distinctTypes = await boardingModel.distinct("type");
    console.log("Distinct boarding types in DB:", distinctTypes);

    // Get approved boardings count by type
    // All boardings in the boarding collection are already approved boardings
    // Note: Database stores types with capital letters: "Hostel", "Homestay", "Annex"
    const approvedHostels = await boardingModel.countDocuments({
      type: "Hostel",
    });
    const approvedAnnexes = await boardingModel.countDocuments({
      type: "Annex",
    });
    const approvedHomestays = await boardingModel.countDocuments({
      type: "Homestay",
    });

    console.log("Boarding counts:", {
      approvedHostels,
      approvedAnnexes,
      approvedHomestays,
    });

    const totalApprovedBoardings =
      approvedHostels + approvedAnnexes + approvedHomestays;

    const statistics = {
      hosts: {
        approved: approvedHostsCount,
        pending: pendingHostsCount,
        total: approvedHostsCount + pendingHostsCount,
      },
      boardings: {
        hostel: approvedHostels,
        annex: approvedAnnexes,
        homestay: approvedHomestays,
        total: totalApprovedBoardings,
      },
    };

    res.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error("Admin statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
};

const checkUserRole = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log("Checking user role for userId:", userId);

    if (!userId) {
      return res.json({
        success: false,
        message: "No user ID found",
      });
    }

    const user = await Host.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        userId: user._id,
        role: user.role,
        status: user.status,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Check user role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check user role",
    });
  }
};

const testAuth = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log("Test auth - userId:", userId);

    if (!userId) {
      return res.json({
        success: false,
        message: "No user ID found - token issue",
      });
    }

    const user = await Host.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found in database",
      });
    }

    res.json({
      success: true,
      message: "Authentication working",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Test auth error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export {
  signIn,
  signUp,
  fetchHostData,
  getAdminStatistics,
  checkUserRole,
  testAuth,
};

import mongoose from "mongoose";
import Host from "../models/host.model.js";
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

    // Check if the host is approved
    if (host.status !== "approved") {
      return res.json({ success: false, message: "Host not approved yet!" });
    }

    // Check if the host is rejected
    if (host.status === "rejected") {
      return res.json({
        success: false,
        message: "Host application was rejected!",
      });
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

export { signIn, signUp, fetchHostData };

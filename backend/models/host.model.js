import mongoose from "mongoose";

const hostSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, "Username must be at least 3 characters long"],
      maxLength: [30, "Username must be at most 30 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minLength: [2, "Full name must be at least 2 characters long"],
      maxLength: [100, "Full name must be at most 100 characters long"],
    },
    
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [
        /^\+947\d{8}$/,
        "Please enter a valid Sri Lankan mobile number (07XXXXXXXX)",
      ],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minLength: [2, "City must be at least 2 characters long"],
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
    },
    boardingAddressForApproval: {
      type: String,
      required: [true, "Boarding address is required"],
      trim: true,
      minLength: [5, "Boarding address must be at least 5 characters long"],
    },
    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: ["homestay", "annex", "hostel"],
    },
    description: {
      type: String,
      required: [true, "Property description is required"],
      trim: true,
      minLength: [20, "Description must be at least 20 characters long"],
      maxLength: [1000, "Description must be at most 1000 characters long"],
    },
    boardingImageForApproval: {
      type: String, // URI from Cloudinary
      required: [true, "Boarding image is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerificationToken: {
      type: String,
      default: null,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Host = mongoose.model("Host", hostSchema);

export default Host;

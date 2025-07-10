import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    boardingAddressForApproval: "",
    city: "",
    postalCode: "",
    propertyType: "",
    description: "",
    boardingImageForApproval: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
    };
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^07\d{8}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.username) newErrors.username = "Username is required";
      else if (formData.username.length < 3)
        newErrors.username = "Username must be at least 3 characters";

      if (!formData.email) newErrors.email = "Email is required";
      else if (!validateEmail(formData.email))
        newErrors.email = "Please enter a valid email";

      if (!formData.password) newErrors.password = "Password is required";
      else if (!validatePassword(formData.password).isValid)
        newErrors.password =
          "Password must be at least 8 characters with uppercase, lowercase, number and special character";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (step === 2) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      else if (!validatePhone(formData.phone))
        newErrors.phone =
          "Please enter a valid Sri Lankan mobile number (07XXXXXXXX)";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.postalCode)
        newErrors.postalCode = "Postal code is required";
    }

    if (step === 3) {
      if (!formData.boardingAddressForApproval)
        newErrors.boardingAddressForApproval = "Property address is required";
      if (!formData.propertyType)
        newErrors.propertyType = "Property type is required";
      if (!formData.description)
        newErrors.description = "Property description is required";
      else if (formData.description.length < 20)
        newErrors.description = "Description must be at least 20 characters";
    }

    if (step === 4) {
      if (!imageFile) newErrors.image = "Property image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (isSubmitted) return; // Prevent going back after successful submission
    setCurrentStep((prev) => prev - 1);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImageToCloudinary = async () => {
    setUploading(true);
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "imagesPendingApproval");
    data.append("folder", "imagesPendingApproval");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dnykpks6n/image/upload",
        data
      );
      setUploading(false);
      return res.data.secure_url;
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploading(false);
      return null;
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    console.log("handleSignUp called", { isSubmitted, uploading, currentStep }); // Debug log

    // Prevent double submission only if already submitted successfully
    if (isSubmitted) {
      console.log("Preventing submission - already submitted");
      return;
    }

    // Prevent submission if currently uploading
    if (uploading) {
      console.log("Preventing submission - currently uploading");
      return;
    }

    // Validate final step
    if (!validateStep(4)) {
      console.log("Validation failed for step 4");
      return;
    }

    if (!imageFile) {
      setMessage("Please select an image to upload.");
      return;
    }

    console.log("Starting image upload...");
    const uploadedImageUrl = await uploadImageToCloudinary();
    if (!uploadedImageUrl) {
      setMessage("Image upload failed. Try again.");
      return;
    }

    console.log("Image uploaded successfully, submitting form...");
    const updatedFormData = {
      ...formData,
      boardingImageForApproval: uploadedImageUrl,
    };

    try {
      const res = await axios.post(
        "http://localhost:5500/api/v1/auth/sign-up",
        updatedFormData
      );
      console.log("API response:", res.data);

      if (res.data.success) {
        setIsSubmitted(true); // Mark as successfully submitted
        toast.success(
          "Sign-up successful! Your application is now pending approval."
        );
        setMessage(
          "Sign-up successful! Your application is now pending approval."
        );
      } else {
        toast.error(res.data.message);
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error("API error:", err);
      const errorMessage = err.response?.data?.message || "Sign up failed!";
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Progress indicator component
  const ProgressIndicator = () => (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          display: "flex",
           alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
          position: "relative",
        }}
      >
        {[1, 2, 3, 4].map((step, index) => (
          <React.Fragment key={step}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: currentStep >= step ? "#222" : "#ccc",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.9rem",
                fontWeight: "bold",
                zIndex: 2,
                position: "relative",
                transition: "all 0.3s ease",
                boxShadow:
                  currentStep >= step
                    ? "0 2px 8px rgba(34, 34, 34, 0.3)"
                    : "none",
              }}
            >
              {currentStep > step ? "✓" : step}
            </div>
            {index < 3 && (
              <div
                style={{
                  flex: 1,
                  height: "3px",
                  backgroundColor: currentStep > step + 1 ? "#222" : "#e0e0e0",
                  margin: "0 10px",
                  borderRadius: "2px",
                  transition: "background-color 0.3s ease",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.8rem",
          color: "#666",
          fontWeight: "500",
        }}
      >
        <span style={{ color: currentStep >= 1 ? "#222" : "#666" }}>
          Account
        </span>
        <span style={{ color: currentStep >= 2 ? "#222" : "#666" }}>
          Contact
        </span>
        <span style={{ color: currentStep >= 3 ? "#222" : "#666" }}>
          Property
        </span>
        <span style={{ color: currentStep >= 4 ? "#222" : "#666" }}>
          Upload
        </span>
      </div>
    </div>
  );

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 style={{ marginBottom: "1rem", color: "#2d2d2d" }}>
              Account Information
            </h3>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                ...sharedInputStyle,
                borderColor: errors.username ? "#e74c3c" : "#ccc",
              }}
            />
            {errors.username && <p style={errorStyle}>{errors.username}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                ...sharedInputStyle,
                borderColor: errors.email ? "#e74c3c" : "#ccc",
              }}
            />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                ...sharedInputStyle,
                borderColor: errors.password ? "#e74c3c" : "#ccc",
              }}
            />
            {errors.password && <p style={errorStyle}>{errors.password}</p>}

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                ...sharedInputStyle,
                borderColor: errors.confirmPassword ? "#e74c3c" : "#ccc",
              }}
            />
            {errors.confirmPassword && (
              <p style={errorStyle}>{errors.confirmPassword}</p>
            )}
          </>
        );

      case 2:
        return (
          <>
            <h3 style={{ marginBottom: "1rem", color: "#2d2d2d" }}>
              Contact Information
            </h3>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={{
                ...sharedInputStyle,
                borderColor: errors.fullName ? "#e74c3c" : "#ccc",
              }}
            />
            {errors.fullName && <p style={errorStyle}>{errors.fullName}</p>}

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (07XXXXXXXX)"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{
                ...sharedInputStyle,
                borderColor: errors.phone ? "#e74c3c" : "#ccc",
              }}
            />
            {errors.phone && <p style={errorStyle}>{errors.phone}</p>}

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              style={{
                ...sharedInputStyle,
                borderColor: errors.city ? "#e74c3c" : "#ccc",
              }}
            />
            {errors.city && <p style={errorStyle}>{errors.city}</p>}

            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              required
              style={{
                ...sharedInputStyle,
                borderColor: errors.postalCode ? "#e74c3c" : "#ccc",
              }}
            />
            {errors.postalCode && <p style={errorStyle}>{errors.postalCode}</p>}
          </>
        );

      case 3:
        return (
          <>
            <h3 style={{ marginBottom: "1rem", color: "#2d2d2d" }}>
              Property Details
            </h3>
            <input
              type="text"
              name="boardingAddressForApproval"
              placeholder="Property Address"
              value={formData.boardingAddressForApproval}
              onChange={handleChange}
              required
              style={{
                ...sharedInputStyle,
                borderColor: errors.boardingAddressForApproval
                  ? "#e74c3c"
                  : "#ccc",
              }}
            />
            {errors.boardingAddressForApproval && (
              <p style={errorStyle}>{errors.boardingAddressForApproval}</p>
            )}

            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
                style={{
                  ...sharedInputStyle,
                  borderColor: errors.propertyType ? "#e74c3c" : "#ddd",
                  backgroundColor: "#ffffff",
                  color: formData.propertyType ? "#333333" : "#999",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  backgroundImage:
                    'url(\'data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8"><path fill="%23666" d="M6 8L0 2h12z"/></svg>\')',
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "12px 8px",
                  paddingRight: "3rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  border: `2px solid ${
                    errors.propertyType ? "#e74c3c" : "#ddd"
                  }`,
                  borderRadius: "8px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#222";
                  e.target.style.boxShadow = "0 0 0 3px rgba(34, 34, 34, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.propertyType
                    ? "#e74c3c"
                    : "#ddd";
                  e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                }}
              >
                <option
                  value=""
                  style={{ backgroundColor: "#ffffff", color: "#999999" }}
                >
                  Select Property Type
                </option>
                <option
                  value="homestay"
                  style={{ backgroundColor: "#ffffff", color: "#333333" }}
                >
                  HomeStay
                </option>
                <option
                  value="annex"
                  style={{ backgroundColor: "#ffffff", color: "#333333" }}
                >
                  Annex
                </option>
                <option
                  value="hostel"
                  style={{ backgroundColor: "#ffffff", color: "#333333" }}
                >
                  Hostel
                </option>
              </select>
            </div>
            {errors.propertyType && (
              <p style={errorStyle}>{errors.propertyType}</p>
            )}

            <textarea
              name="description"
              placeholder="Property Description (minimum 20 characters)"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              style={{
                ...sharedInputStyle,
                borderColor: errors.description ? "#e74c3c" : "#ccc",
                resize: "vertical",
              }}
            />
            {errors.description && (
              <p style={errorStyle}>{errors.description}</p>
            )}
          </>
        );

      case 4:
        return (
          <>
            <h3 style={{ marginBottom: "1rem", color: "#2d2d2d" }}>
              Property Image
            </h3>

            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={{
                  position: "absolute",
                  opacity: 0,
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                style={{
                  ...sharedInputStyle,
                  borderColor: errors.image ? "#e74c3c" : "#ccc",
                  backgroundColor: "#f8f9fa",
                  border: `2px dashed ${errors.image ? "#e74c3c" : "#ccc"}`,
                  textAlign: "center",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "100px",
                  transition: "all 0.3s ease",
                  color: "#666",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f0f1f2";
                  e.target.style.borderColor = "#999";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#f8f9fa";
                  e.target.style.borderColor = errors.image
                    ? "#e74c3c"
                    : "#ccc";
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  📁
                </div>
                <div style={{ fontWeight: "500", marginBottom: "0.25rem" }}>
                  {imageFile ? "Change Image" : "Choose Property Image"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#999" }}>
                  Click here or drag and drop your image
                </div>
              </label>
            </div>
            {errors.image && <p style={errorStyle}>{errors.image}</p>}

            {imageFile && (
              <div style={{ marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>
                  Selected: {imageFile.name}
                </p>
              </div>
            )}

            {uploading && (
              <p style={{ marginBottom: "1rem", color: "#444" }}>
                Uploading image...
              </p>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const sharedInputStyle = {
    width: "100%",
    marginBottom: "1rem",
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    transition: "border 0.3s",
  };

  const sharedButtonStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#222",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const errorStyle = {
    color: "#e74c3c",
    fontSize: "0.8rem",
    marginTop: "-0.5rem",
    marginBottom: "0.5rem",
  };

  const secondaryButtonStyle = {
    ...sharedButtonStyle,
    backgroundColor: "#666",
    marginRight: "0.5rem",
    width: "48%",
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#d4bf95",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#2d2d2d",
          marginBottom: "1.5rem",
        }}
      >
        Host Sign Up
      </h2>

      <ProgressIndicator />

      <form onSubmit={handleSignUp}>
        {renderStepContent()}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1.5rem",
          }}
        >
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isSubmitted}
              style={{
                ...secondaryButtonStyle,
                backgroundColor: isSubmitted ? "#ccc" : "#666",
                cursor: isSubmitted ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) =>
                !isSubmitted && (e.target.style.backgroundColor = "#888")
              }
              onMouseLeave={(e) =>
                !isSubmitted && (e.target.style.backgroundColor = "#666")
              }
            >
              Previous
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                ...sharedButtonStyle,
                width: currentStep > 1 ? "48%" : "100%",
                marginLeft: currentStep > 1 ? "0.5rem" : "0",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#444")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#222")}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={uploading || isSubmitted}
              style={{
                ...sharedButtonStyle,
                width: "48%",
                marginLeft: "0.5rem",
                backgroundColor: uploading || isSubmitted ? "#ccc" : "#222",
                cursor: uploading || isSubmitted ? "not-allowed" : "pointer",
                opacity: uploading || isSubmitted ? 0.6 : 1,
              }}
              onMouseEnter={(e) =>
                !uploading &&
                !isSubmitted &&
                (e.target.style.backgroundColor = "#444")
              }
              onMouseLeave={(e) =>
                !uploading &&
                !isSubmitted &&
                (e.target.style.backgroundColor = "#222")
              }
              onClick={(e) => {
                console.log("Button clicked", { isSubmitted, uploading });
                if (uploading || isSubmitted) {
                  e.preventDefault();
                  console.log("Click prevented due to state");
                }
              }}
            >
              {uploading
                ? "Uploading..."
                : isSubmitted
                ? "Submitted Successfully"
                : "Complete Sign Up"}
            </button>
          )}
        </div>
      </form>

      {message && (
        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: message.includes("successful") ? "#27ae60" : "#e74c3c",
            fontSize: "0.9rem",
          }}
        >
          {message}
        </p>
      )}

      <p
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.95rem",
        }}
      >
        Already have an account?{" "}
        <Link
          to="/sign-in"
          style={{
            color: "#222",
            textDecoration: "underline",
            fontWeight: "500",
            transition: "color 0.3s ease",
          }}
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}

export default SignUp;

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
    phone: "+94", // Set default to +94
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
    // Accepts +94 followed by 7XXXXXXXX (no leading 0 after +94)
    return /^\+947\d{8}$/.test(phone);
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
          "Please enter a valid Sri Lankan mobile number (+94 7XXXXXXXX, no leading 0 after +94)";
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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2 relative">
        {[1, 2, 3, 4].map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 relative transition-all shadow ${currentStep >= step ? 'bg-sand text-white' : 'bg-latte text-black'}`}
            >
              {currentStep > step ? "✓" : step}
            </div>
            {index < 3 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${currentStep > step ? 'bg-sand' : 'bg-latte'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between text-xs font-medium text-black">
        <span className={currentStep >= 1 ? "text-black" : "text-latte"}>Account</span>
        <span className={currentStep >= 2 ? "text-black" : "text-latte"}>Contact</span>
        <span className={currentStep >= 3 ? "text-black" : "text-latte"}>Property</span>
        <span className={currentStep >= 4 ? "text-black" : "text-latte"}>Upload</span>
      </div>
    </div>
  );

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="mb-4 text-lg font-semibold text-black">Account Information</h3>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className={`w-full mb-4 px-4 py-3 border rounded-lg text-base bg-linen placeholder-black/70 text-black transition focus:outline-none ${errors.username ? 'border-red-500' : 'border-latte'}`}
            />
            {errors.username && <p className="text-red-500 text-xs mb-2 -mt-3">{errors.username}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full mb-4 px-4 py-3 border rounded-lg text-base bg-linen placeholder-black/70 text-black transition focus:outline-none ${errors.email ? 'border-red-500' : 'border-latte'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mb-2 -mt-3">{errors.email}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full mb-4 px-4 py-3 border rounded-lg text-base bg-linen placeholder-black/70 text-black transition focus:outline-none ${errors.password ? 'border-red-500' : 'border-latte'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mb-2 -mt-3">{errors.password}</p>}

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full mb-4 px-4 py-3 border rounded-lg text-base bg-linen placeholder-black/70 text-black transition focus:outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-latte'}`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mb-2 -mt-3">{errors.confirmPassword}</p>
            )}
          </>
        );
      case 2:
        return (
          <>
            <h3 className="mb-4 text-lg font-semibold text-black">Contact Information</h3>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className={`w-full mb-4 px-4 py-3 border rounded-lg text-base bg-linen placeholder-black/70 text-black transition focus:outline-none ${errors.fullName ? 'border-red-500' : 'border-latte'}`}
            />
            {errors.fullName && <p className="text-red-500 text-xs mb-2 -mt-3">{errors.fullName}</p>}

            <div className="flex items-center mb-4">
              <span className={`px-4 py-3 bg-cream border ${errors.phone ? 'border-red-500' : 'border-latte'} rounded-l-lg text-base text-black`}>+94</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone.replace(/^\+94/, "")}
                onChange={e => {
                  let value = e.target.value.replace(/^0+/, "");
                  setFormData(prev => ({ ...prev, phone: "+94" + value }));
                }}
                required
                className={`w-full px-4 py-3 border rounded-r-lg text-base bg-linen placeholder-black/70 text-black transition focus:outline-none border-l-0 ${errors.phone ? 'border-red-500' : 'border-latte'}`}
                placeholder="7XXXXXXXX"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mb-2 -mt-3">{errors.phone}</p>}

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className={`w-full mb-4 px-4 py-3 border rounded-lg text-base bg-linen placeholder-black/70 text-black transition focus:outline-none ${errors.city ? 'border-red-500' : 'border-latte'}`}
            />
            {errors.city && <p className="text-red-500 text-xs mb-2 -mt-3">{errors.city}</p>}

            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              required
              className={`w-full mb-4 px-4 py-3 border rounded-lg text-base bg-linen placeholder-black/70 text-black transition focus:outline-none ${errors.postalCode ? 'border-red-500' : 'border-latte'}`}
            />
            {errors.postalCode && <p className="text-red-500 text-xs mb-2 -mt-3">{errors.postalCode}</p>}
          </>
        );
      case 3:
        return (
          <>
            <h3 className="mb-4 text-lg font-semibold text-black">Property Details</h3>
            <input
              type="text"
              name="boardingAddressForApproval"
              placeholder="Property Address"
              value={formData.boardingAddressForApproval}
              onChange={handleChange}
              required
              className={`w-full mb-4 px-4 py-3 border rounded-lg text-base bg-linen placeholder-black/70 text-black transition focus:outline-none ${errors.boardingAddressForApproval ? 'border-red-500' : 'border-latte'}`}
            />
            {errors.boardingAddressForApproval && (
              <p className="text-red-500 text-xs mb-2 -mt-3">{errors.boardingAddressForApproval}</p>
            )}

            <div className="relative mb-4">
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg text-base bg-linen text-black transition focus:outline-none appearance-none ${errors.propertyType ? 'border-red-500' : 'border-latte'}`}
              >
                <option value="" className="bg-white text-black">Select Property Type</option>
                <option value="homestay" className="bg-white text-black">HomeStay</option>
                <option value="annex" className="bg-white text-black">Annex</option>
                <option value="hostel" className="bg-white text-black">Hostel</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            {errors.propertyType && (
              <p className="text-red-500 text-xs mb-2 -mt-3">{errors.propertyType}</p>
            )}

            <textarea
              name="description"
              placeholder="Property Description (minimum 20 characters)"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className={`w-full mb-4 px-4 py-3 border rounded-lg text-base bg-linen placeholder-black/70 text-black transition focus:outline-none resize-vertical ${errors.description ? 'border-red-500' : 'border-latte'}`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mb-2 -mt-3">{errors.description}</p>
            )}
          </>
        );
      case 4:
        return (
          <>
            <h3 className="mb-4 text-lg font-semibold text-black">Property Image</h3>
            <div className="relative mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="absolute opacity-0 w-full h-full cursor-pointer"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`w-full flex flex-col items-center justify-center min-h-[100px] px-4 py-6 border-2 rounded-lg cursor-pointer transition-all text-black bg-cream border-dashed ${errors.image ? 'border-red-500' : 'border-latte'} text-center`}
              >
                <div className="text-2xl mb-2">📁</div>
                <div className="font-medium mb-1">{imageFile ? "Change Image" : "Choose Property Image"}</div>
                <div className="text-xs text-black/60">Click here or drag and drop your image</div>
              </label>
            </div>
            {errors.image && <p className="text-red-500 text-xs mb-2 -mt-3">{errors.image}</p>}
            {imageFile && (
              <div className="mb-4">
                <p className="text-sm text-black">Selected: {imageFile.name}</p>
              </div>
            )}
            {uploading && (
              <p className="mb-4 text-black">Uploading image...</p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sand via-latte to-linen">
      <div className="w-full max-w-lg p-8 bg-cream rounded-2xl shadow-2xl font-sans transition-all border border-latte">
        <h2 className="text-center text-2xl font-bold text-black mb-6">Host Sign Up</h2>
        <ProgressIndicator />
        <form onSubmit={handleSignUp}>
          {renderStepContent()}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                disabled={isSubmitted}
                className={`w-[48%] py-3 rounded-lg text-base font-bold transition ${isSubmitted ? 'bg-latte text-black cursor-not-allowed opacity-60' : 'bg-latte text-black hover:bg-sand hover:text-white cursor-pointer'}`}
              >
                Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className={`w-full py-3 rounded-lg text-base font-bold transition bg-sand text-white hover:bg-latte hover:text-black ${currentStep > 1 ? 'ml-2 w-[48%]' : ''}`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={uploading || isSubmitted}
                className={`w-[48%] py-3 rounded-lg text-base font-bold transition ${uploading || isSubmitted ? 'bg-latte text-black cursor-not-allowed opacity-60' : 'bg-sand text-white hover:bg-latte hover:text-black cursor-pointer ml-2'}`}
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
          <p className={`text-center mt-4 text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
        )}
        <p className="text-center mt-6 text-sm text-black">
          Already have an account?{' '}
          <Link
            to="/sign-in"
            className="text-black underline font-medium transition"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;

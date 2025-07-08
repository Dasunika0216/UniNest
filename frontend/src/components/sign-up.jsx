import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    boardingAddressForApproval: "",
    boardingImageForApproval: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

    if (!imageFile) {
      setMessage("Please select an image to upload.");
      return;
    }

    const uploadedImageUrl = await uploadImageToCloudinary();
    if (!uploadedImageUrl) {
      setMessage("Image upload failed. Try again.");
      return;
    }

    const updatedFormData = {
      ...formData,
      boardingImageForApproval: uploadedImageUrl,
    };

    try {
      const res = await axios.post(
        "http://localhost:5500/api/v1/auth/sign-up",
        updatedFormData
      );
      if (res.data.success) {
        toast.success("Sign-up successful!");
        setMessage("Sign-up successful!");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Sign up failed!");
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

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "5rem auto",
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
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          style={sharedInputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={sharedInputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={sharedInputStyle}
        />
        <input
          type="text"
          name="boardingAddressForApproval"
          placeholder="Boarding Address"
          onChange={handleChange}
          required
          style={sharedInputStyle}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          style={sharedInputStyle}
        />

        {uploading && (
          <p style={{ marginBottom: "1rem", color: "#444" }}>
            Uploading image...
          </p>
        )}

        <button
          type="submit"
          disabled={uploading}
          style={sharedButtonStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#444")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#222")}
        >
          Sign Up
        </button>
      </form>

      {message && (
        <p style={{ textAlign: "center", marginTop: "1rem", color: "#e74c3c" }}>
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

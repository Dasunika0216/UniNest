import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddBoarding = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("");
  const [step, setStep] = useState(1); // 1: type select, 2: form
  const [formData, setFormData] = useState({
    address: "",
    cost: "",
    availableCount: "",
    facilities: "",
    description: "",
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleTypeSelect = (e) => {
    setType(e.target.value);
    setFormData({
      address: "",
      cost: "",
      availableCount: "",
      facilities: "",
      description: "",
      images: [],
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const validImages = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      setImageFiles(validImages); // Save all selected image files
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Upload each image to Cloudinary and return the URL
  const uploadImagesToCloudinary = async () => {
    setUploading(true);
    const uploadedUrls = [];
    for (const file of imageFiles) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "boardingimages");
      data.append("folder", "boardingimages");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dnykpks6n/image/upload",
          data
        );
        uploadedUrls.push(res.data.secure_url); // Save each image URL
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Image upload failed. Please try again.");
        setUploading(false);
        return null;
      }
    }
    setUploading(false);
    return uploadedUrls; // Return all image URLs
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Token:", localStorage.getItem("token"));

    const data = new FormData();
    data.append("type", type);
    data.append("address", formData.address);
    data.append("cost", formData.cost);
    data.append("availableCount", formData.availableCount);
    data.append("description", formData.description);
    formData.facilities
      .split(",")
      .map((facility) => facility.trim())
      .forEach((f) => data.append("facilities", f));

    // Handle image uploads to Cloudinary
    if (imageFiles.length > 0) {
      const imageUrls = await uploadImagesToCloudinary();
      if (imageUrls) {
        imageUrls.forEach((url) => data.append("images[]", url)); // ✅
      } else {
        toast.error("Image upload failed. Please try again.");
        return;
      }
    }

    try {
      for (let pair of data.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axios.post(
        "http://localhost:5500/api/v1/boardings/add-boarding",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);

      if (response.data.success) {
        toast.success("Boarding place added successfully!");
        setShowForm(false);
        setType("");

        console.log("📢 Dispatching 'boardingAdded' event");

        const event = new Event("boardingAdded");
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error("Error adding boarding:", error);
      if (error.response) {
        console.error("Backend responded with:", error.response.data);
        toast.error(error.response.data.message || "Failed to add boarding.");
      } else {
        toast.error("Failed to add boarding. Please try again.");
      }
    }
  };

  return (
    <>
      <button
        onClick={toggleForm}
        style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: isHovered ? "#c5ab6f" : "#d4bf95",
          color: "black",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
          marginBottom: "1rem",
          transition:
            "background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: isHovered
            ? "0px 4px 12px rgba(0, 0, 0, 0.2)"
            : "0px 4px 8px rgba(0, 0, 0, 0.1)",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Add Boarding Places
      </button>

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(220, 220, 220, 0.25)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: "linear-gradient(135deg, #fffbe6 0%, #f7f8fa 100%)",
              padding: "2.8rem 2.8rem 2.2rem 2.8rem",
              width: "99%",
              maxWidth: "1100px",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              boxShadow: "0 12px 48px 0 rgba(180,160,80,0.18), 0 2px 8px 0 rgba(0,0,0,0.08)",
              border: "1.5px solid #f3e7c9",
              borderRadius: "38px",
              fontFamily: "'Segoe UI', Arial, sans-serif",
            }}
          >
            <h2 style={{ textAlign: "center", color: "#333", fontWeight: 700, fontSize: "2rem", letterSpacing: "-1px" }}>
              What kind of place will you host?
            </h2>

            {step === 1 && (
              <>
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "2.5rem",
                  margin: "2.5rem 0 1.5rem 0",
                  width: "100%",
                  maxWidth: "900px",
                  alignSelf: "center",
                }}>
                  {[
                    { name: "Annex", img: "/annex.jpg" },
                    { name: "Homestay", img: "/homestay.jpg" },
                    { name: "Hotel", img: "/hotel.jpg" },
                  ].map((option) => {
                    const isSelected = type === option.name;
                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setType(option.name)}
                        style={{
                          flex: 1,
                          minWidth: "210px",
                          maxWidth: "250px",
                          minHeight: "320px",
                          background: isSelected ? "#fdf7ea" : "#f7f8fa",
                          border: isSelected ? "3px solid #d4bf95" : "2px solid #e0e0e0",
                          borderRadius: "22px",
                          color: "#222",
                          fontWeight: 700,
                          fontSize: "1.18rem",
                          boxShadow: isSelected ? "0 8px 32px rgba(212,191,149,0.13)" : "0 2px 12px rgba(0,0,0,0.06)",
                          cursor: "pointer",
                          transition: "all 0.22s cubic-bezier(.4,2,.6,1)",
                          outline: isSelected ? "2px solid #d4bf95" : "none",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "1.3rem",
                          padding: "2.2rem 1.2rem 1.2rem 1.2rem",
                          transform: isSelected ? "scale(1.06)" : "scale(1)",
                          boxSizing: "border-box",
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) e.currentTarget.style.transform = "scale(1.04)";
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <img src={option.img} alt={option.name} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "50%", boxShadow: "0 4px 18px rgba(0,0,0,0.13)", marginBottom: "0.7rem", border: isSelected ? "3px solid #d4bf95" : "2px solid #e0e0e0", background: "#fff" }} />
                        <span style={{ fontWeight: 700, fontSize: "1.18rem", letterSpacing: "-0.5px" }}>{option.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "2.5rem",
                  marginTop: "2.2rem",
                }}>
                  <button
                    type="button"
                    disabled={!type}
                    onClick={() => setStep(2)}
                    style={{
                      padding: "0.9rem 3.2rem",
                      backgroundColor: type ? "#d4bf95" : "#e0e0e0",
                      color: type ? "#222" : "#888",
                      border: "none",
                      borderRadius: "16px",
                      fontWeight: 700,
                      fontSize: "1.18rem",
                      cursor: type ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                      minWidth: "180px",
                      boxShadow: type ? "0 2px 12px rgba(212,191,149,0.13)" : "none",
                    }}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setType("");
                      setStep(1);
                    }}
                    style={{
                      padding: "0.9rem 3.2rem",
                      backgroundColor: "#bdc3c7",
                      color: "#2c3e50",
                      border: "none",
                      borderRadius: "16px",
                      fontWeight: 700,
                      fontSize: "1.18rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      minWidth: "180px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <input
                  type="text"
                  name="address"
                  placeholder="Boarding Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
                <input
                  type="number"
                  name="cost"
                  placeholder={
                    type === "Annex" ? "Cost per Annex" : "Cost per Bed"
                  }
                  value={formData.cost}
                  onChange={handleChange}
                  required
                  min="0"
                  style={inputStyle}
                />
                <input
                  type="number"
                  name="availableCount"
                  placeholder="Number of Beds"
                  value={formData.availableCount}
                  onChange={handleChange}
                  required
                  min="0"
                  style={inputStyle}
                />
                <textarea
                  name="facilities"
                  placeholder="Facilities (comma-separated)"
                  value={formData.facilities}
                  onChange={handleChange}
                  rows="2"
                  required
                  style={{ ...inputStyle, resize: "vertical" }}
                ></textarea>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  style={{ ...inputStyle, resize: "vertical" }}
                ></textarea>

                {/* Image upload section */}
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleChange}
                  style={inputStyle}
                />

                {uploading && <p>Uploading images...</p>}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <button
                    type="submit"
                    style={submitButtonStyle}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#bfae7f";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#d4bf95";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    Submit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setType("");
                      setStep(1);
                    }}
                    style={cancelButtonStyle}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#95a5a6";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#bdc3c7";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
};

const inputStyle = {
  padding: "0.8rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  outline: "none",
  width: "100%",
};

const submitButtonStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#d4bf95",
  color: "#000",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  minWidth: "140px",
};

const cancelButtonStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#bdc3c7",
  color: "#2c3e50",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  minWidth: "140px",
};

export default AddBoarding;

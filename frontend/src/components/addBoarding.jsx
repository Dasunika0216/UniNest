import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddBoarding = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("");
  const [formData, setFormData] = useState({
    address: "",
    cost: "",
    availableCount: "",
    facilities: "",
    description: "",
    images: []
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
      images: []
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
        console.log(pair[0]+ ': ' + pair[1]);
      }
      
      const response = await axios.post(
        "http://localhost:5500/api/boarding/add-boarding",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      console.log(response.data);

      if (response.data.success) {
        toast.success("Boarding place added successfully!");
        setShowForm(false);
        setType("");
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
          transition: "background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: isHovered ? "0px 4px 12px rgba(0, 0, 0, 0.2)" : "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: "#fefefe",
              padding: "2rem",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <h2 style={{ textAlign: "center", color: "#333" }}>Add Boarding Place</h2>

            {!type ? (
              <select value={type} onChange={handleTypeSelect} required style={inputStyle}>
                <option value="">Select Type</option>
                <option value="Annex">Annex</option>
                <option value="Homestay">Homestay</option>
                <option value="Hostel">Hostel</option>
              </select>
            ) : (
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
                  placeholder={type === "Annex" ? "Cost per Annex" : "Cost per Bed"}
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

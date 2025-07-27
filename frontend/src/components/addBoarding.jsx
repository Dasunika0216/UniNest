import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import GoogleMapPicker from "./GoogleMapPicker"; // Import the GoogleMapPicker component

const AddBoarding = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("");
  const [step, setStep] = useState(1); // 1: type select, 2: form
  const [formData, setFormData] = useState({
    address: "",
    gender: "",
    cost: "",
    availableCount: "",
    facilities: [],
    description: "",
    images: [],
    lat: null,
    lng: null,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const toggleForm = () => {
    if (showForm) {
      // Reset form when closing
      setFormData({
        address: "",
        gender: "",
        cost: "",
        availableCount: "",
        facilities: [],
        description: "",
        images: [],
        lat: null,
        lng: null,
      });
      setImageFiles([]);
      setType("");
      setStep(1);
    }
    setShowForm(!showForm);
  };

  const handleTypeSelect = (e) => {
    setType(e.target.value);
    setFormData({
      address: "",
      gender: "",
      cost: "",
      availableCount: "",
      facilities: [],
      description: "",
      images: [],
      lat: null,
      lng: null,
    });
    setImageFiles([]);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const validImages = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      setImageFiles((prev) => [...prev, ...validImages]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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
        uploadedUrls.push(res.data.secure_url);
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Image upload failed. Please try again.");
        setUploading(false);
        return null;
      }
    }
    setUploading(false);
    return uploadedUrls;
  };

  const facilityOptions = [
    { label: "WiFi", img: "/wifi.jpg" },
    { label: "AC", img: "/ac.jpg" },
    { label: "Laundry", img: "/laundry.jpg" },
    { label: "Parking", img: "/parking.jpg" },
    { label: "Meals", img: "/meals.jpg" },
    { label: "Kitchen", img: "/kitchen.jpg" },
    { label: "Study Area", img: "/study.jpg" },
  ];

  const handleFacilityChange = (facility) => {
    setFormData((prev) => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  // Remove image by index
  const handleRemoveImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("type", type);
    data.append("address", formData.address);
    data.append("gender", formData.gender);
    data.append("cost", formData.cost);
    data.append("availableCount", formData.availableCount);
    data.append("description", formData.description);
    formData.facilities.forEach((f) => data.append("facilities", f));
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);

    if (imageFiles.length > 0) {
      const imageUrls = await uploadImagesToCloudinary();
      if (imageUrls) {
        imageUrls.forEach((url) => data.append("images[]", url));
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

      if (response.data.success) {
        toast.success("Boarding place added successfully!");
        setShowForm(false);
        setType("");
        setImageFiles([]);

        const event = new Event("boardingAdded");
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error("Error adding boarding:", error);
      if (error.response) {
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
          borderRadius: "9999px",
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
        <>
          <style>{`
            @media (max-width: 700px) {
              .responsive-modal {
                max-width: 98vw !important;
                width: 99vw !important;
                padding: 1.1rem 0.3rem 1.1rem 0.3rem !important;
                border-radius: 18px !important;
                margin: 1.2rem !important;
                box-shadow: 0 6px 32px 0 rgba(180,160,80,0.13), 0 1px 4px 0 rgba(0,0,0,0.10) !important;
                background: linear-gradient(135deg, #fffbe6 0%, #f7f8fa 100%) !important;
              }
              .responsive-card-row {
                flex-direction: column !important;
                gap: 1.2rem !important;
                align-items: stretch !important;
              }
              .responsive-card-row button {
                min-width: 0 !important;
                max-width: 100% !important;
                min-height: 120px !important;
                padding: 0.8rem 0.5rem 0.8rem 0.5rem !important;
                border-radius: 22px !important;
                box-shadow: 0 2px 12px rgba(180,160,80,0.10), 0 1px 4px rgba(0,0,0,0.08) !important;
                margin-bottom: 0.7rem !important;
                border: 1.5px solid #e0e0e0 !important;
              }
              .responsive-card-row img {
                width: 60px !important;
                height: 60px !important;
                border-radius: 50% !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.10) !important;
              }
              .responsive-card-row span {
                font-size: 1.08rem !important;
                font-weight: 600 !important;
                margin-top: 0.2rem !important;
              }
              .responsive-modal .button-row {
                flex-direction: column !important;
                gap: 0.8rem !important;
                align-items: center !important;
              }
              .responsive-modal .button-row button {
                width: 90vw !important;
                max-width: 340px !important;
                font-size: 1.08rem !important;
                padding: 1.1rem 0 !important;
                border-radius: 14px !important;
              }
              .responsive-card-row {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          `}</style>
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
              className="responsive-modal"
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
              {step === 1 && (
                <>
                  <h2 style={{ textAlign: "center", color: "#333", fontWeight: 700, fontSize: "2rem", letterSpacing: "-1px" }}>
                    What kind of place will you host?
            </h2>

                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "2.5rem",
                    margin: "2.5rem 0 1.5rem 0",
                    width: "100%",
                    maxWidth: "900px",
                    alignSelf: "center",
                  }}
                  className="responsive-card-row"
                  >
                    {[
                      { name: "Annex", img: "/annex.jpg" },
                      { name: "Homestay", img: "/homestay.jpg" },
                      { name: "Hostel", img: "/hotel.jpg" },
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
                  }}
                  className="button-row"
                  >
                    <button
                      type="button"
                      disabled={!type}
                      onClick={() => setStep(2)}
                      style={{
                        padding: "0.9rem 3.2rem",
                        backgroundColor: type ? "#d4bf95" : "#e0e0e0",
                        color: type ? "#222" : "#888",
                        border: "none",
                        borderRadius: "9999px",
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
                        borderRadius: "9999px",
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
                <h2 style={{ textAlign: "center", color: "#333", fontWeight: 700, fontSize: "1.3rem", letterSpacing: "-1px", marginBottom: "1.2rem" }}>
                  Enter Boarding Details
                </h2>
                <input
                  type="text"
                  name="address"
                  placeholder="Boarding Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  style={{
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    outline: "none",
                    width: "100%",
                    marginBottom: "1.2rem",
                  }}
                />
                {/* Google Map Picker */}
                {/* <div style={{ height: 300, marginBottom: 16 }}>
                  <GoogleMapPicker
                    lat={formData.lat}
                    lng={formData.lng}
                    setLatLng={(lat, lng) => setFormData(prev => ({ ...prev, lat, lng }))}
                  />
                </div> */}
                 <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  style={{
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    outline: "none",
                    width: "100%",
                    marginBottom: "1.2rem",
                  }}
                >
                  <option value="">Select Gender Preference</option>
                  <option value="Girls">Girls Only</option>
                  <option value="Boys">Boys Only</option>
                </select>
                <input
                  type="number"
                  name="cost"
                  placeholder={type === "Annex" ? "Cost per month (Rs.)" : "Cost per bed per month (Rs.)"}
                  value={formData.cost}
                  onChange={handleChange}
                  required
                  min="0"
                  style={{
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    outline: "none",
                    width: "100%",
                    marginBottom: "1.2rem",
                  }}
                />
                <input
                  type="number"
                  name="availableCount"
                  placeholder="Number of Available Beds"
                  value={formData.availableCount}
                  onChange={handleChange}
                  required
                  min="1"
                  style={{
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    outline: "none",
                    width: "100%",
                    marginBottom: "1.2rem",
                  }}
                />
                <div className="button-row" style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginTop: "1.2rem" }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      padding: "0.9rem 3.2rem",
                      backgroundColor: "#bdc3c7",
                      color: "#2c3e50",
                      border: "none",
                      borderRadius: "9999px",
                      fontWeight: 700,
                      fontSize: "1.18rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      minWidth: "180px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!(formData.gender && formData.address && formData.cost && formData.availableCount)}
                    style={{
                      padding: "0.9rem 3.2rem",
                      backgroundColor: formData.gender && formData.address && formData.cost && formData.availableCount ? "#d4bf95" : "#e0e0e0",
                      color: formData.gender && formData.address && formData.cost && formData.availableCount ? "#222" : "#888",
                      border: "none",
                      borderRadius: "9999px",
                      fontWeight: 700,
                      fontSize: "1.18rem",
                      cursor: formData.gender && formData.address && formData.cost && formData.availableCount ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                      minWidth: "180px",
                      boxShadow: formData.gender && formData.address && formData.cost && formData.availableCount ? "0 2px 12px rgba(212,191,149,0.13)" : "none",
                    }}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h2 style={{ textAlign: "center", color: "#333", fontWeight: 700, fontSize: "1.3rem", letterSpacing: "-1px", marginBottom: "1.2rem" }}>
                  Add facilities available at your place
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "2.2rem",
                    margin: "1.5rem auto",
                    justifyItems: "center",
                    width: "95%",
                    maxWidth: "900px",
                    maxHeight: "340px",
                    overflowY: "auto",
                  }}
                >
                  {facilityOptions.map((facility) => {
                    const selected = formData.facilities.includes(facility.label);
                    return (
                      <button
                        key={facility.label}
                        type="button"
                        onClick={() => handleFacilityChange(facility.label)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "1.5rem 0.7rem 1.1rem 0.7rem",
                          borderRadius: "22px",
                          border: selected ? "3px solid #d4bf95" : "2px solid #e0e0e0",
                          background: selected
                            ? "linear-gradient(135deg, #fffbe6 0%, #f7f8fa 100%)"
                            : "linear-gradient(135deg, #f7f8fa 0%, #fff 100%)",
                          boxShadow: selected
                            ? "0 8px 32px 0 rgba(180,160,80,0.13), 0 2px 8px 0 rgba(0,0,0,0.08)"
                            : "0 2px 8px 0 rgba(0,0,0,0.06)",
                          cursor: "pointer",
                          transition: "all 0.22s cubic-bezier(.4,2,.6,1)",
                          outline: selected ? "2px solid #d4bf95" : "none",
                          minHeight: "220px",
                          minWidth: "140px",
                          maxWidth: "210px",
                          margin: "0 auto",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "scale(1.07)";
                          e.currentTarget.style.boxShadow = "0 12px 32px 0 rgba(180,160,80,0.18), 0 2px 8px 0 rgba(0,0,0,0.10)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = selected
                            ? "0 8px 32px 0 rgba(180,160,80,0.13), 0 2px 8px 0 rgba(0,0,0,0.08)"
                            : "0 2px 8px 0 rgba(0,0,0,0.06)";
                        }}
                      >
                        <img
                          src={facility.img}
                          alt={facility.label}
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "18px",
                            marginBottom: "0.9rem",
                            border: selected ? "3px solid #d4bf95" : "2px solid #e0e0e0",
                            background: "#fff",
                            boxShadow: selected ? "0 2px 12px #d4bf95" : "0 1px 4px rgba(0,0,0,0.07)",
                          }}
                        />
                        <span style={{ fontWeight: 600, fontSize: "1.13rem", color: selected ? "#bfae7f" : "#222", marginTop: "0.3rem" }}>{facility.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="button-row" style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginTop: "1.2rem" }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      padding: "0.9rem 3.2rem",
                      backgroundColor: "#bdc3c7",
                      color: "#2c3e50",
                      border: "none",
                      borderRadius: "9999px",
                      fontWeight: 700,
                      fontSize: "1.18rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      minWidth: "180px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    style={{
                      padding: "0.9rem 3.2rem",
                      backgroundColor: "#d4bf95",
                      color: "#222",
                      border: "none",
                      borderRadius: "9999px",
                      fontWeight: 700,
                      fontSize: "1.18rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      minWidth: "180px",
                      boxShadow: "0 2px 12px rgba(212,191,149,0.13)",
                    }}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <h2 style={{ textAlign: "center", color: "#333", fontWeight: 700, fontSize: "1.3rem", letterSpacing: "-1px", marginBottom: "1.2rem" }}>
                  Add a description and images
                </h2>
                <textarea
                  name="description"
                  placeholder="Add a short description about your boarding place..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  style={{
                    padding: "0.9rem",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    fontSize: "1.08rem",
                    outline: "none",
                    width: "100%",
                    marginBottom: "1.5rem",
                    resize: "vertical",
                  }}
                />
                {/* Image previews with remove option */}
                {imageFiles.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.2rem" }}>
                    {imageFiles.map((file, idx) => (
                      <div key={idx} style={{ position: "relative", width: 90, height: 90, borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.10)", background: "#f7f7f7" }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${idx}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          style={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            background: "rgba(255,255,255,0.85)",
                            border: "none",
                            borderRadius: "50%",
                            width: 22,
                            height: 22,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 16,
                            color: "#c0392b",
                            cursor: "pointer",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                          }}
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleChange}
                  style={{
                    marginBottom: "1.5rem",
                  }}
                />
                <div className="button-row" style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginTop: "1.2rem" }}>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    style={{
                      padding: "0.9rem 3.2rem",
                      backgroundColor: "#bdc3c7",
                      color: "#2c3e50",
                      border: "none",
                      borderRadius: "9999px",
                      fontWeight: 700,
                      fontSize: "1.18rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      minWidth: "180px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !(formData.description && imageFiles.length > 0)}
                    style={{
                      padding: "0.9rem 3.2rem",
                      backgroundColor: uploading
                        ? "#e0e0e0"
                        : formData.description && imageFiles.length > 0
                        ? "#d4bf95"
                        : "#e0e0e0",
                      color: uploading
                        ? "#888"
                        : formData.description && imageFiles.length > 0
                        ? "#222"
                        : "#888",
                      border: "none",
                      borderRadius: "9999px",
                      fontWeight: 700,
                      fontSize: "1.18rem",
                      cursor: uploading
                        ? "not-allowed"
                        : formData.description && imageFiles.length > 0
                        ? "pointer"
                        : "not-allowed",
                      transition: "all 0.2s",
                      minWidth: "180px",
                      boxShadow: formData.description && imageFiles.length > 0 ? "0 2px 12px rgba(212,191,149,0.13)" : "none",
                    }}
                  >
                    {uploading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
        </>
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


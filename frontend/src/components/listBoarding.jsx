import React, { useEffect, useState } from "react";
import axios from "axios";
import GoogleMapPicker from "./GoogleMapPicker";

const ListBoarding = () => {
  const [boardings, setBoardings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [editLocation, setEditLocation] = useState({ lat: null, lng: null });
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    currentIndex: 0,
    images: [],
    title: "",
  });
  const [imageFileInput, setImageFileInput] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);

  // SVG Icons as components
  const HomeIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );

  const UserGroupIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const CurrencyIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );

  const BedIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
    </svg>
  );

  const DocumentIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );

  const ToolIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );

  const MapPinIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const CameraIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );

  const EditIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );

  const SaveIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17,21 17,13 7,13 7,21" />
      <polyline points="7,3 7,8 15,8" />
    </svg>
  );

  const CancelIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const ClockIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );

  const fetchBoarding = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5500/api/v1/boardings/list-boarding",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Fetched boardings:", response.data.data);
        setBoardings(response.data.data);
      }
    } catch (error) {
      console.log("Error in fetching the boarding data", error);
    }
  };

  useEffect(() => {
    fetchBoarding();
    const handleBoardingAdded = () => {
      fetchBoarding();
    };
    window.addEventListener("boardingAdded", handleBoardingAdded);
    return () => {
      window.removeEventListener("boardingAdded", handleBoardingAdded);
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this boarding place?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5500/api/v1/boardings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setBoardings((prev) => prev.filter((b) => b._id !== id));

        // Dispatch event to notify other components
        const event = new Event("boardingDeleted");
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.log("Error deleting boarding:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const openLocationModal = () => {
    setPendingLocation(
      editData.lat && editData.lng
        ? { lat: editData.lat, lng: editData.lng }
        : null
    );
    setShowLocationModal(true);
  };
  const handleLocationChange = (lat, lng) => {
    setPendingLocation({ lat, lng });
  };
  const confirmLocation = () => {
    if (pendingLocation) {
      setEditLocation(pendingLocation);
      setEditData((prev) => ({
        ...prev,
        lat: pendingLocation.lat,
        lng: pendingLocation.lng,
      }));
    }
    setShowLocationModal(false);
  };
  const cancelLocation = () => {
    setShowLocationModal(false);
  };

  const handleEditSubmit = async (id) => {
    // Basic validation
    if (!editData.address || !editData.cost || !editData.availableCount) {
      alert(
        "Please fill in all required fields (Address, Cost, and Available Beds)"
      );
      return;
    }

    setIsUploading(true);

    // Upload new images to Cloudinary first
    let uploadedImageUrls = [];
    if (newImages.length > 0) {
      try {
        for (const file of newImages) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "boardingimages");
          formData.append("folder", "boardingimages");

          const uploadResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/dnykpks6n/image/upload",
            formData
          );
          uploadedImageUrls.push(uploadResponse.data.secure_url);
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        alert("Failed to upload images. Please try again.");
        setIsUploading(false);
        return;
      }
    }

    const requestData = {
      address: editData.address || "",
      cost: editData.cost || "",
      availableCount: editData.availableCount || "",
      description: editData.description || "",
      facilities: editData.facilities || [],
      lat: editData.lat || null,
      lng: editData.lng || null,
      removedImages: removedImages,
      newImages: uploadedImageUrls,
    };

    console.log("Sending update request for ID:", id);
    console.log("Request data:", requestData);

    try {
      const response = await axios.put(
        `http://localhost:5500/api/v1/boardings/${id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response.data);

      if (response.data.success) {
        setEditingId(null);
        setEditData({});
        setNewImages([]);
        setRemovedImages([]);
        fetchBoarding(); // Refresh the list
        alert("Boarding updated successfully!");

        // Dispatch event to notify other components
        const event = new Event("boardingUpdated");
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error("Error updating boarding:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Failed to update boarding: ${error.response.data.message}`);
      } else {
        alert("Failed to update boarding. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const predefinedFacilities = [
    "WiFi",
    "Parking",
    "Laundry",
    "Air Conditioning",
    "Kitchen",
    "Gym",
    "Swimming Pool",
    "Pet Friendly",
    "Security",
    "Hot Water",
  ];

  // Helper function to handle facilities display (works with both string and array)
  const getFacilitiesDisplay = (facilities) => {
    if (!facilities) return "Not Given";
    if (typeof facilities === "string") return facilities;
    if (Array.isArray(facilities)) {
      return facilities.length > 0 ? facilities.join(", ") : "Not Given";
    }
    return "Not Given";
  };

  // Image viewer functions
  const openImageViewer = (images, title) => {
    setImageViewer({
      isOpen: true,
      currentIndex: 0,
      images: images,
      title: title,
    });
  };

  const closeImageViewer = () => {
    setImageViewer({
      isOpen: false,
      currentIndex: 0,
      images: [],
      title: "",
    });
  };

  const nextImage = () => {
    setImageViewer((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
  };

  const prevImage = () => {
    setImageViewer((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === 0
          ? prev.images.length - 1
          : prev.currentIndex - 1,
    }));
  };

  // Image editing functions
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    setNewImages((prev) => [...prev, ...validImages]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl) => {
    setRemovedImages((prev) => [...prev, imageUrl]);
  };

  // Handle keyboard events for image viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imageViewer.isOpen) return;

      switch (e.key) {
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "Escape":
          closeImageViewer();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageViewer.isOpen]);

  return (
    <div className="boarding-container">
      <h2 className="boarding-heading">Your Boarding List</h2>
      {boardings.length === 0 ? (
        <p className="boarding-empty">No boarding places found.</p>
      ) : (
        <div className="boarding-grid">
          {boardings.map((boarding) => {
            console.log("Rendering boarding:", boarding);
            return (
              <div key={boarding._id} className="boarding-card">
                {editingId === boarding._id ? (
                  <>
                    <input
                      className="boarding-input"
                      name="address"
                      value={editData.address || ""}
                      onChange={handleEditChange}
                      placeholder="Address *"
                      required
                    />
                    <input
                      className="boarding-input"
                      name="cost"
                      value={editData.cost || ""}
                      onChange={handleEditChange}
                      placeholder="Cost *"
                      type="number"
                      required
                    />
                    <input
                      className="boarding-input"
                      name="availableCount"
                      value={editData.availableCount || ""}
                      onChange={handleEditChange}
                      placeholder="Available Beds *"
                      type="number"
                      required
                    />
                    <textarea
                      className="boarding-input"
                      name="description"
                      value={editData.description || ""}
                      onChange={handleEditChange}
                      placeholder="Description"
                      rows="3"
                      style={{ resize: "vertical" }}
                    />

                    {/* Location Edit Button */}
                    <div style={{ marginBottom: "15px" }}>
                      <h4
                        style={{
                          marginBottom: "10px",
                          color: "#333",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <MapPinIcon />
                        Location
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <span>
                          {editData.lat && editData.lng
                            ? `Selected: ${Number(editData.lat).toFixed(
                                5
                              )}, ${Number(editData.lng).toFixed(5)}`
                            : "No location set"}
                        </span>
                        <button
                          type="button"
                          onClick={openLocationModal}
                          style={{
                            padding: "0.5rem 1.2rem",
                            backgroundColor: "#e74c3c",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: "0.95rem",
                          }}
                        >
                          Edit Location
                        </button>
                      </div>
                    </div>
                    {/* Fullscreen Location Modal */}
                    {showLocationModal && (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100vw",
                          height: "100vh",
                          background: "rgba(0,0,0,0.7)",
                          zIndex: 9999,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            background: "white",
                            borderRadius: "18px",
                            padding: "2rem",
                            maxWidth: "700px",
                            width: "95vw",
                            maxHeight: "90vh",
                            overflow: "auto",
                            position: "relative",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <button
                            onClick={cancelLocation}
                            style={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              background: "#e74c3c",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: 36,
                              height: 36,
                              fontSize: 22,
                              fontWeight: 700,
                              cursor: "pointer",
                              zIndex: 2,
                            }}
                            aria-label="Close"
                          >
                            ×
                          </button>
                          <h2
                            style={{
                              textAlign: "center",
                              marginBottom: "1rem",
                              color: "#e74c3c",
                            }}
                          >
                            Pick Boarding Location
                          </h2>
                          <GoogleMapPicker
                            lat={pendingLocation?.lat}
                            lng={pendingLocation?.lng}
                            setLatLng={handleLocationChange}
                          />
                          <div
                            style={{
                              textAlign: "center",
                              marginTop: "1rem",
                              color: "#888",
                            }}
                          >
                            Click on the map to select a new location. The red
                            marker shows your pick.
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "1.5rem",
                              marginTop: "2rem",
                            }}
                          >
                            <button
                              onClick={confirmLocation}
                              style={{
                                padding: "0.7rem 2.2rem",
                                backgroundColor: "#27ae60",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                cursor: pendingLocation
                                  ? "pointer"
                                  : "not-allowed",
                                opacity: pendingLocation ? 1 : 0.6,
                              }}
                              disabled={!pendingLocation}
                            >
                              Confirm Location
                            </button>
                            <button
                              onClick={cancelLocation}
                              style={{
                                padding: "0.7rem 2.2rem",
                                backgroundColor: "#bdc3c7",
                                color: "#2c3e50",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Management Section */}
                    <div style={{ marginBottom: "15px" }}>
                      <h4
                        style={{
                          marginBottom: "10px",
                          color: "#333",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <CameraIcon />
                        Images
                      </h4>

                      {/* Existing Images */}
                      {editData.images && editData.images.length > 0 && (
                        <div style={{ marginBottom: "15px" }}>
                          <h5 style={{ marginBottom: "8px", color: "#666" }}>
                            Current Images:
                          </h5>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "10px",
                            }}
                          >
                            {editData.images
                              .filter((img) => !removedImages.includes(img))
                              .map((image, index) => (
                                <div
                                  key={index}
                                  style={{ position: "relative" }}
                                >
                                  <img
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      openImageViewer(
                                        editData.images,
                                        "Current Images"
                                      )
                                    }
                                  />
                                  <button
                                    onClick={() => removeExistingImage(image)}
                                    style={{
                                      position: "absolute",
                                      top: "-5px",
                                      right: "-5px",
                                      background: "#e74c3c",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "50%",
                                      width: 20,
                                      height: 20,
                                      cursor: "pointer",
                                      fontSize: "12px",
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* New Images */}
                      {newImages.length > 0 && (
                        <div style={{ marginBottom: "15px" }}>
                          <h5 style={{ marginBottom: "8px", color: "#666" }}>
                            New Images:
                          </h5>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "10px",
                            }}
                          >
                            {newImages.map((file, index) => (
                              <div key={index} style={{ position: "relative" }}>
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`New image ${index + 1}`}
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                />
                                <button
                                  onClick={() => removeNewImage(index)}
                                  style={{
                                    position: "absolute",
                                    top: "-5px",
                                    right: "-5px",
                                    background: "#e74c3c",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: 20,
                                    height: 20,
                                    cursor: "pointer",
                                    fontSize: "12px",
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add New Images */}
                      <div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: "none" }}
                          ref={setImageFileInput}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            imageFileInput && imageFileInput.click()
                          }
                          style={{
                            padding: "8px 16px",
                            background: "#3498db",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <CameraIcon />
                          Add Images
                        </button>
                      </div>
                    </div>
                    {/* Facilities Dropdown and Tags (no Add button, add on select) */}
                    <div style={{ marginBottom: "10px" }}>
                      <select
                        className="boarding-input"
                        value=""
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value &&
                            !(editData.facilities || []).includes(value)
                          ) {
                            setEditData((prev) => ({
                              ...prev,
                              facilities: [...(prev.facilities || []), value],
                            }));
                          }
                          // Reset dropdown
                          e.target.value = "";
                        }}
                      >
                        <option value="">Select a facility</option>
                        {predefinedFacilities
                          .filter(
                            (fac) => !(editData.facilities || []).includes(fac)
                          )
                          .map((fac) => (
                            <option key={fac} value={fac}>
                              {fac}
                            </option>
                          ))}
                      </select>
                      {/* Show selected facilities as tags with remove option */}
                      <div style={{ marginTop: "8px" }}>
                        {(editData.facilities || []).map((fac) => (
                          <span
                            key={fac}
                            style={{
                              display: "inline-block",
                              background: "#B0B3B8",
                              color: "#000957",
                              borderRadius: "8px",
                              padding: "4px 10px",
                              margin: "0 6px 6px 0",
                              fontSize: "0.9rem",
                            }}
                          >
                            {fac}
                            <button
                              style={{
                                marginLeft: "6px",
                                background: "none",
                                border: "none",
                                color: "#e74c3c",
                                cursor: "pointer",
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                              }}
                              onClick={() => {
                                setEditData((prev) => ({
                                  ...prev,
                                  facilities: (prev.facilities || []).filter(
                                    (f) => f !== fac
                                  ),
                                }));
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "15px",
                      }}
                    >
                      <button
                        className="boarding-btn btn-save"
                        onClick={() => handleEditSubmit(boarding._id)}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          minWidth: "120px",
                          height: "36px",
                        }}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <ClockIcon />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <SaveIcon />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        className="boarding-btn btn-cancel"
                        onClick={() => {
                          setEditingId(null);
                          setEditData({});
                          setNewImages([]);
                          setRemovedImages([]);
                        }}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          minWidth: "120px",
                          height: "36px",
                        }}
                        disabled={isUploading}
                      >
                        <CancelIcon />
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="boarding-type">{boarding.type}</h3>

                    {/* Display images if available */}
                    {boarding.images && boarding.images.length > 0 && (
                      <div className="boarding-images">
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={boarding.images[0]}
                            alt="Main boarding image"
                            className="boarding-img"
                            style={{
                              width: "200px",
                              height: "150px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              openImageViewer(
                                boarding.images,
                                `${boarding.type} - ${boarding.address}`
                              )
                            }
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          {boarding.images.length > 1 && (
                            <button
                              onClick={() =>
                                openImageViewer(
                                  boarding.images,
                                  `${boarding.type} - ${boarding.address}`
                                )
                              }
                              style={{
                                position: "absolute",
                                bottom: "5px",
                                right: "5px",
                                background: "rgba(0, 0, 0, 0.7)",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                fontSize: "11px",
                                cursor: "pointer",
                                backdropFilter: "blur(2px)",
                              }}
                            >
                              View All ({boarding.images.length})
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <HomeIcon />
                      <strong>Address:</strong> {boarding.address}
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <UserGroupIcon />
                      <strong>Gender:</strong> For {boarding.gender}
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <CurrencyIcon />
                      <strong>Cost:</strong> Rs. {boarding.cost}
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <BedIcon />
                      <strong>Available Beds:</strong> {boarding.availableCount}
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <DocumentIcon />
                      <span>
                        <strong>Description:</strong> {boarding.description}
                      </span>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <ToolIcon />
                      <span>
                        <strong>Facilities:</strong>{" "}
                        {getFacilitiesDisplay(boarding.facilities)}
                      </span>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "16px",
                      }}
                    >
                      <MapPinIcon />
                      <strong>Location:</strong>{" "}
                      {boarding.lat && boarding.lng ? (
                        <span style={{ color: "#27ae60", fontWeight: "600" }}>
                          Available ({boarding.lat.toFixed(4)},{" "}
                          {boarding.lng.toFixed(4)})
                        </span>
                      ) : (
                        <span style={{ color: "#e74c3c", fontWeight: "600" }}>
                          Not set
                        </span>
                      )}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "15px",
                      }}
                    >
                      <button
                        className="boarding-btn btn-edit"
                        onClick={() => {
                          setEditingId(boarding._id);
                          setEditData(boarding);
                          setEditLocation({
                            lat: boarding.lat,
                            lng: boarding.lng,
                          });
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          minWidth: "80px",
                          height: "36px",
                        }}
                      >
                        <EditIcon />
                        Edit
                      </button>
                      <button
                        className="boarding-btn btn-delete"
                        onClick={() => handleDelete(boarding._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          minWidth: "80px",
                          height: "36px",
                        }}
                      >
                        <DeleteIcon />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .boarding-container {
          padding: 2rem;
          font-family: 'Segoe UI', sans-serif;
          color: #000957;
        }

        .boarding-heading {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #000957;
          font-weight: bold;
        }

        .boarding-empty {
          text-align: center;
          font-size: 1.1rem;
          color: #000957;
          opacity: 0.7;
        }

        .boarding-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .boarding-card {
          border: 1px solid #B0B3B8;
          border-radius: 12px;
          padding: 1.5rem;
          background-color: #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .boarding-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }

        .boarding-type {
          font-size: 1.25rem;
          font-weight: 600;
          color: #000957;
          margin-bottom: 0.5rem;
        }

        .boarding-img {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          margin-bottom: 0.5rem;
          border-radius: 8px;
        }

        .boarding-images {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
        }

        .boarding-input {
          width: 100%;
          padding: 8px 12px;
          margin-bottom: 10px;
          border-radius: 8px;
          border: 1px solid #B0B3B8;
          font-size: 0.95rem;
          transition: border-color 0.2s ease;
          color: #000957;
          box-sizing: border-box;
        }

        .boarding-input:focus {
          outline: none;
          border-color: #000957;
          box-shadow: 0 0 0 2px rgba(0, 9, 87, 0.2);
        }

        .boarding-input[required] {
          border-left: 3px solid #e74c3c;
        }

        .boarding-btn {
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .btn-edit {
          background-color: #000957;
          color: #fff;
        }

        .btn-edit:hover {
          background-color: rgba(0, 9, 87, 0.9);
          transform: translateY(-1px);
        }

        .btn-save {
          background-color: #2ecc71;
          color: #fff;
        }

        .btn-save:hover {
          background-color: #27ae60;
          transform: translateY(-1px);
        }

        .btn-cancel {
          background-color: #B0B3B8;
          color: #000957;
        }

        .btn-cancel:hover {
          background-color: rgba(176, 179, 184, 0.8);
          transform: translateY(-1px);
        }

        .btn-delete {
          background-color: #e74c3c;
          color: #fff;
        }

        .btn-delete:hover {
          background-color: #c0392b;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Image Viewer Modal */}
      {imageViewer.isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            color: "white",
          }}
          onClick={closeImageViewer}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                position: "absolute",
                top: "-60px",
                left: 0,
                right: 0,
                textAlign: "center",
                zIndex: 1,
              }}
            >
              <h3 style={{ margin: 0, color: "white" }}>{imageViewer.title}</h3>
              <p style={{ margin: "5px 0 0 0", color: "#ccc" }}>
                {imageViewer.currentIndex + 1} of {imageViewer.images.length}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={closeImageViewer}
              style={{
                position: "absolute",
                top: "-70px",
                right: "0px",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
                zIndex: 1,
              }}
            >
              ×
            </button>

            {/* Main image */}
            <img
              src={imageViewer.images[imageViewer.currentIndex]}
              alt={`Image ${imageViewer.currentIndex + 1}`}
              style={{
                maxWidth: "90vw",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
              }}
            />

            {/* Navigation buttons */}
            {imageViewer.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.6)",
                    border: "none",
                    color: "white",
                    fontSize: "28px",
                    padding: "15px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(5px)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(0, 0, 0, 0.8)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "rgba(0, 0, 0, 0.6)")
                  }
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.6)",
                    border: "none",
                    color: "white",
                    fontSize: "28px",
                    padding: "15px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(5px)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(0, 0, 0, 0.8)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "rgba(0, 0, 0, 0.6)")
                  }
                >
                  ›
                </button>
              </>
            )}

            {/* Thumbnail navigation */}
            {imageViewer.images.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                  overflowX: "auto",
                  padding: "10px",
                }}
              >
                {imageViewer.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: "60px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      cursor: "pointer",
                      border:
                        index === imageViewer.currentIndex
                          ? "2px solid #3498db"
                          : "2px solid transparent",
                      opacity: index === imageViewer.currentIndex ? 1 : 0.7,
                    }}
                    onClick={() =>
                      setImageViewer((prev) => ({
                        ...prev,
                        currentIndex: index,
                      }))
                    }
                  />
                ))}
              </div>
            )}

            {/* Instructions */}
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                left: 0,
                right: 0,
                textAlign: "center",
                color: "#ccc",
                fontSize: "12px",
              }}
            >
              Use arrow keys to navigate • Press ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListBoarding;

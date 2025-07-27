import React, { useEffect, useState } from "react";
import axios from "axios";

const ListBoarding = () => {
  const [boardings, setBoardings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    currentIndex: 0,
    images: [],
    title: ''
  });
  const [imageFileInput, setImageFileInput] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleEditSubmit = async (id) => {
    // Basic validation
    if (!editData.address || !editData.cost || !editData.availableCount) {
      alert('Please fill in all required fields (Address, Cost, and Available Beds)');
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
        alert('Failed to upload images. Please try again.');
        setIsUploading(false);
        return;
      }
    }

    const requestData = {
      address: editData.address || '',
      cost: editData.cost || '',
      availableCount: editData.availableCount || '',
      description: editData.description || '',
      facilities: editData.facilities || [],
      removedImages: removedImages,
      newImages: uploadedImageUrls
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
            'Content-Type': 'application/json'
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
        alert('Boarding updated successfully!');
        
        // Dispatch event to notify other components
        const event = new Event("boardingUpdated");
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error("Error updating boarding:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Failed to update boarding: ${error.response.data.message}`);
      } else {
        alert('Failed to update boarding. Please try again.');
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
    "Hot Water"
  ];

  // Helper function to handle facilities display (works with both string and array)
  const getFacilitiesDisplay = (facilities) => {
    if (!facilities) return "Not Given";
    if (typeof facilities === 'string') return facilities;
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
      title: title
    });
  };

  const closeImageViewer = () => {
    setImageViewer({
      isOpen: false,
      currentIndex: 0,
      images: [],
      title: ''
    });
  };

  const nextImage = () => {
    setImageViewer(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = () => {
    setImageViewer(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  };

  // Image editing functions
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.startsWith('image/'));
    setNewImages(prev => [...prev, ...validImages]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl) => {
    setRemovedImages(prev => [...prev, imageUrl]);
  };

  // Handle keyboard events for image viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imageViewer.isOpen) return;
      
      switch(e.key) {
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'Escape':
          closeImageViewer();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
                      value={editData.address || ''}
                      onChange={handleEditChange}
                      placeholder="Address *"
                      required
                    />
                    <input
                      className="boarding-input"
                      name="cost"
                      value={editData.cost || ''}
                      onChange={handleEditChange}
                      placeholder="Cost *"
                      type="number"
                      required
                    />
                    <input
                      className="boarding-input"
                      name="availableCount"
                      value={editData.availableCount || ''}
                      onChange={handleEditChange}
                      placeholder="Available Beds *"
                      type="number"
                      required
                    />
                    <textarea
                      className="boarding-input"
                      name="description"
                      value={editData.description || ''}
                      onChange={handleEditChange}
                      placeholder="Description"
                      rows="3"
                      style={{ resize: 'vertical' }}
                    />
                    
                    {/* Image Management Section */}
                    <div style={{ marginBottom: '15px' }}>
                      <h4 style={{ marginBottom: '10px', color: '#333' }}>📸 Images</h4>
                      
                      {/* Existing Images */}
                      {editData.images && editData.images.length > 0 && (
                        <div style={{ marginBottom: '15px' }}>
                          <h5 style={{ marginBottom: '8px', color: '#666' }}>Current Images:</h5>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {editData.images
                              .filter(img => !removedImages.includes(img))
                              .map((image, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                  <img
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    style={{
                                      width: '80px',
                                      height: '80px',
                                      objectFit: 'cover',
                                      borderRadius: '8px',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => openImageViewer(editData.images, 'Current Images')}
                                  />
                                  <button
                                    onClick={() => removeExistingImage(image)}
                                    style={{
                                      position: 'absolute',
                                      top: '-5px',
                                      right: '-5px',
                                      background: '#e74c3c',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '20px',
                                      height: '20px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
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
                        <div style={{ marginBottom: '15px' }}>
                          <h5 style={{ marginBottom: '8px', color: '#666' }}>New Images:</h5>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {newImages.map((file, index) => (
                              <div key={index} style={{ position: 'relative' }}>
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`New image ${index + 1}`}
                                  style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                  }}
                                />
                                <button
                                  onClick={() => removeNewImage(index)}
                                  style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
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
                          style={{ display: 'none' }}
                          ref={setImageFileInput}
                        />
                        <button
                          type="button"
                          onClick={() => imageFileInput && imageFileInput.click()}
                          style={{
                            padding: '8px 16px',
                            background: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          📷 Add Images
                        </button>
                      </div>
                    </div>
                    {/* Facilities Dropdown and Tags (no Add button, add on select) */}
                    <div style={{ marginBottom: '10px' }}>
                      <select
                        className="boarding-input"
                        value=""
                        onChange={e => {
                          const value = e.target.value;
                          if (value && !(editData.facilities || []).includes(value)) {
                            setEditData(prev => ({
                              ...prev,
                              facilities: [...(prev.facilities || []), value]
                            }));
                          }
                          // Reset dropdown
                          e.target.value = '';
                        }}
                      >
                        <option value="">Select a facility</option>
                        {predefinedFacilities
                          .filter(fac => !(editData.facilities || []).includes(fac))
                          .map(fac => (
                            <option key={fac} value={fac}>{fac}</option>
                          ))}
                      </select>
                      {/* Show selected facilities as tags with remove option */}
                      <div style={{ marginTop: "8px" }}>
                        {(editData.facilities || []).map(fac => (
                          <span
                            key={fac}
                            style={{
                              display: "inline-block",
                              background: "#B0B3B8",
                              color: "#000957",
                              borderRadius: "8px",
                              padding: "4px 10px",
                              margin: "0 6px 6px 0",
                              fontSize: "0.9rem"
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
                                fontWeight: "bold"
                              }}
                              onClick={() => {
                                setEditData(prev => ({
                                  ...prev,
                                  facilities: (prev.facilities || []).filter(f => f !== fac)
                                }));
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button
                        className="boarding-btn btn-save"
                        onClick={() => handleEditSubmit(boarding._id)}
                        style={{ flex: 1 }}
                        disabled={isUploading}
                      >
                        {isUploading ? '⏳ Uploading...' : '💾 Save Changes'}
                      </button>
                      <button
                        className="boarding-btn btn-cancel"
                        onClick={() => {
                          setEditingId(null);
                          setEditData({});
                          setNewImages([]);
                          setRemovedImages([]);
                        }}
                        style={{ flex: 1 }}
                        disabled={isUploading}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="boarding-type">{boarding.type}</h3>
                    
                    {/* Display images if available */}
                    {boarding.images && boarding.images.length > 0 && (
                      <div className="boarding-images">
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <img
                            src={boarding.images[0]}
                            alt="Main boarding image"
                            className="boarding-img"
                            style={{
                              width: '200px',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                            onClick={() => openImageViewer(boarding.images, `${boarding.type} - ${boarding.address}`)}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          {boarding.images.length > 1 && (
                            <button
                              onClick={() => openImageViewer(boarding.images, `${boarding.type} - ${boarding.address}`)}
                              style={{
                                position: 'absolute',
                                bottom: '5px',
                                right: '5px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                backdropFilter: 'blur(2px)'
                              }}
                            >
                              View All ({boarding.images.length})
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <p>
                      <strong>🏠 Address:</strong> {boarding.address}
                    </p>
                    <p>
                      <strong>🚻 Gender:</strong> For {boarding.gender}
                    </p>
                    <p>
                      <strong>💰 Cost:</strong> Rs. {boarding.cost}
                    </p>
                    <p>
                      <strong>🛏️ Available Beds:</strong>{" "}
                      {boarding.availableCount}
                    </p>
                    <p>
                      <strong>📝 Description:</strong> {boarding.description}
                    </p>
                    <p>
                      <strong>🧰 Facilities:</strong>{" "}
                      {getFacilitiesDisplay(boarding.facilities)}
                    </p>
                    <button
                      className="boarding-btn btn-edit"
                      onClick={() => {
                        setEditingId(boarding._id);
                        setEditData(boarding);
                      }}
                    >
                       Edit
                    </button>
                    <button
                      className="boarding-btn btn-delete"
                      onClick={() => handleDelete(boarding._id)}
                    >
                       Delete
                    </button>
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
          margin-right: 0.5rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
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
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            color: 'white'
          }}
          onClick={closeImageViewer}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              left: 0,
              right: 0,
              textAlign: 'center',
              zIndex: 1
            }}>
              <h3 style={{ margin: 0, color: 'white' }}>{imageViewer.title}</h3>
              <p style={{ margin: '5px 0 0 0', color: '#ccc' }}>
                {imageViewer.currentIndex + 1} of {imageViewer.images.length}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={closeImageViewer}
              style={{
                position: 'absolute',
                top: '-70px',
                right: '0px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 1
              }}
            >
              ×
            </button>

            {/* Main image */}
            <img
              src={imageViewer.images[imageViewer.currentIndex]}
              alt={`Image ${imageViewer.currentIndex + 1}`}
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.4)'
              }}
            />

            {/* Navigation buttons */}
            {imageViewer.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: 'none',
                    color: 'white',
                    fontSize: '28px',
                    padding: '15px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.8)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.6)'}
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: 'none',
                    color: 'white',
                    fontSize: '28px',
                    padding: '15px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.8)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.6)'}
                >
                  ›
                </button>
              </>
            )}

            {/* Thumbnail navigation */}
            {imageViewer.images.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
                overflowX: 'auto',
                padding: '10px'
              }}>
                {imageViewer.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '60px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: index === imageViewer.currentIndex ? '2px solid #3498db' : '2px solid transparent',
                      opacity: index === imageViewer.currentIndex ? 1 : 0.7
                    }}
                    onClick={() => setImageViewer(prev => ({ ...prev, currentIndex: index }))}
                  />
                ))}
              </div>
            )}

            {/* Instructions */}
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: 0,
              right: 0,
              textAlign: 'center',
              color: '#ccc',
              fontSize: '12px'
            }}>
              Use arrow keys to navigate • Press ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListBoarding;

import React, { useEffect, useState } from "react";
import axios from "axios";

const ListBoarding = () => {
  const [boardings, setBoardings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

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

    const requestData = {
      address: editData.address || '',
      cost: editData.cost || '',
      availableCount: editData.availableCount || '',
      description: editData.description || '',
      facilities: editData.facilities || [],
      removedImages: removedImages,
      newImages: newImages
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
      }
    } catch (error) {
      console.error("Error updating boarding:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Failed to update boarding: ${error.response.data.message}`);
      } else {
        alert('Failed to update boarding. Please try again.');
      }
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

  return (
    <div className="boarding-container">
      <h2 className="boarding-heading">Your Boarding List</h2>
      {boardings.length === 0 ? (
        <p className="boarding-empty">No boarding places found.</p>
      ) : (
        <div className="boarding-grid">
          {boardings.map((boarding) => (
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
                            background: "#eee",
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
                    >
                      💾 Save Changes
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
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="boarding-type">{boarding.type}</h3>
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
                    {boarding.facilities && boarding.facilities.length > 0 ? boarding.facilities.join(", ") : "Not Given"}
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
          ))}
        </div>
      )}

      <style>{`
        .boarding-container {
          padding: 2rem;
          font-family: 'Segoe UI', sans-serif;
          color: #333;
        }

        .boarding-heading {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #222;
        }

        .boarding-empty {
          text-align: center;
          font-size: 1.1rem;
          color: #888;
        }

        .boarding-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .boarding-card {
          border: 1px solid #eee;
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
          color: #a17f1a;
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
          border: 1px solid #ccc;
          font-size: 0.95rem;
          transition: border-color 0.2s ease;
        }

        .boarding-input:focus {
          outline: none;
          border-color: #f1c40f;
          box-shadow: 0 0 0 2px rgba(241, 196, 15, 0.2);
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
          background-color: #f1c40f;
          color: #fff;
        }

        .btn-edit:hover {
          background-color: #d4ac0d;
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
          background-color: #95a5a6;
          color: #fff;
        }

        .btn-cancel:hover {
          background-color: #7f8c8d;
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
    </div>
  );
};

export default ListBoarding;

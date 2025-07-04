import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListBoarding = () => {
  const [boardings, setBoardings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const fetchBoarding = async () => {
    try {
      const response = await axios.get("http://localhost:5500/api/boarding/list-boarding", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
    const confirmDelete = window.confirm("Are you sure you want to remove this boarding place?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5500/api/boarding/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
    const formData = new FormData();
    formData.append('address', editData.address || '');
    formData.append('cost', editData.cost || '');
    formData.append('availableCount', editData.availableCount || '');
    formData.append('description', editData.description || '');
    formData.append('facilities', editData.facilities || '');
    formData.append('removedImages', JSON.stringify(removedImages));

    newImages.forEach((file) => {
      formData.append('newImages', file);
    });

    try {
      const response = await axios.put(`http://localhost:5500/api/boarding/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setEditingId(null);
        setNewImages([]);
        setRemovedImages([]);
        fetchBoarding();
      }
    } catch (error) {
      console.log("Error updating boarding:", error);
    }
  };

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
                  <input name="address" className="boarding-input" value={editData.address || ''} onChange={handleEditChange} placeholder="Address" />
                  <input name="cost" className="boarding-input" value={editData.cost || ''} onChange={handleEditChange} placeholder="Cost" />
                  <input name="availableCount" className="boarding-input" value={editData.availableCount || ''} onChange={handleEditChange} placeholder="Available Beds" />
                  <input name="description" className="boarding-input" value={editData.description || ''} onChange={handleEditChange} placeholder="Description" />
                  <input name="facilities" className="boarding-input" value={editData.facilities || ''} onChange={handleEditChange} placeholder="Facilities" />

                  <div className="boarding-images">
                    {editData.images?.map((img, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={img} alt={`Boarding ${i}`} className="boarding-img" />
                        <button
                          style={{
                            position: 'absolute', top: 5, right: 5,
                            backgroundColor: 'red', color: 'white',
                            border: 'none', borderRadius: '50%',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setEditData(prev => ({
                              ...prev,
                              images: prev.images.filter(image => image !== img)
                            }));
                            setRemovedImages(prev => [...prev, img]);
                          }}
                        >✖</button>
                      </div>
                    ))}
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setNewImages(Array.from(e.target.files))}
                  />

                  <button className="boarding-btn btn-save" onClick={() => handleEditSubmit(boarding._id)}>💾 Save</button>
                  <button className="boarding-btn btn-cancel" onClick={() => setEditingId(null)}>❌ Cancel</button>
                </>
              ) : (
                <>
                  <h3 className="boarding-type">{boarding.type}</h3>
                  <div className="boarding-images">
                    {boarding.images?.map((img, i) => (
                      <img key={i} src={img} alt={`Boarding ${i}`} className="boarding-img" />
                    ))}
                  </div>
                  <p><strong>🏠 Address:</strong> {boarding.address}</p>
                  <p><strong>💰 Cost:</strong> Rs. {boarding.cost}</p>
                  <p><strong>🛏️ Available Beds:</strong> {boarding.availableCount}</p>
                  <p><strong>📝 Description:</strong> {boarding.description}</p>
                  <p><strong>🧰 Facilities:</strong> {boarding.facilities}</p>
                  <button className="boarding-btn btn-edit" onClick={() => {
                    setEditingId(boarding._id);
                    setEditData({
                      address: boarding.address || '',
                      cost: boarding.cost || '',
                      availableCount: boarding.availableCount || '',
                      description: boarding.description || '',
                      facilities: boarding.facilities || '',
                      images: boarding.images || []
                    });
                    setNewImages([]);
                    setRemovedImages([]);
                  }}>Edit</button>
                  <button className="boarding-btn btn-delete" onClick={() => handleDelete(boarding._id)}>Delete</button>
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
        }

        .boarding-btn {
          padding: 8px 14px;
          margin-right: 0.5rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-edit {
          background-color: #f1c40f;
          color: #fff;
        }

        .btn-edit:hover {
          background-color: #d4ac0d;
        }

        .btn-save {
          background-color: #2ecc71;
          color: #fff;
        }

        .btn-save:hover {
          background-color: #27ae60;
        }

        .btn-cancel {
          background-color: #95a5a6;
          color: #fff;
        }

        .btn-cancel:hover {
          background-color: #7f8c8d;
        }

        .btn-delete {
          background-color: #e74c3c;
          color: #fff;
        }

        .btn-delete:hover {
          background-color: #c0392b;
        }
      `}</style>
    </div>
  );
};

export default ListBoarding;

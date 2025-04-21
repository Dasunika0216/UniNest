import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListBoarding = () => {
  const [boardings, setBoardings] = useState([]);

  const fetchBoarding = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5500/api/boarding/list-boarding",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      

      console.log(response.data);

      if (response.data.success) {
        setBoardings(response.data.data);
      }
    } catch (error) {
      console.log("Error in fetching the boarding data", error);
    }
  };

  useEffect(() => {
    fetchBoarding(); // initial fetch
  
    const handleBoardingAdded = () => {
      console.log("📥 'boardingAdded' event received – fetching new data");
      fetchBoarding(); // re-fetch when boarding is added
    };
  
    // 👂 Listen to event
    window.addEventListener("boardingAdded", handleBoardingAdded);
  
    // ✅ Clean up listener when component unmounts
    return () => {
      window.removeEventListener("boardingAdded", handleBoardingAdded);
    };
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Boarding List</h2>
      {boardings.length === 0 ? (
        <p style={styles.emptyText}>No boarding places found.</p>
      ) : (
        <div style={styles.cardGrid}>
          {boardings.map((boarding, index) => (
            <div key={index} className="boarding-card" style={styles.card}>
              <h3 style={styles.type}>{boarding.type}</h3>
              <p><strong>🏠 Address:</strong> {boarding.address}</p>
              <p><strong>💰 Cost:</strong> Rs. {boarding.cost}</p>
              <p><strong>🛏️ Available Beds:</strong> {boarding.availableCount}</p>
              <p><strong>📝 Description:</strong> {boarding.description}</p>
              <p><strong>📝 Facilities:</strong> {boarding.facilities}</p>
            </div>
          ))}
        </div>
      )}
      
      <style>
        {`
          .boarding-card {
            border: 1px solid #d4bf95;
            border-radius: 12px;
            background-color: #fefefe;
            padding: 1.5rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .boarding-card:hover {
            transform: scale(1.03);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    color: '#000',
  },
  heading: {
    textAlign: 'center',
    color: '#000',
    fontSize: '2rem',
    marginBottom: '2rem',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#999',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    // base style handled by className for hover
  },
  type: {
    color: '#d4bf95',
    marginBottom: '0.5rem',
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
};

export default ListBoarding;
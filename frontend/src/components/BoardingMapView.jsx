import React, { useState } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const libraries = [];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
  border: "1px solid #e0e0e0",
};

const center = {
  lat: 6.9271, // Colombo, Sri Lanka
  lng: 79.8612,
};

const BoardingMapView = ({ boardings }) => {
  const [showMap, setShowMap] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Filter boardings that have valid coordinates
  const validBoardings = boardings.filter(boarding => 
    boarding.lat && boarding.lng && 
    !isNaN(Number(boarding.lat)) && !isNaN(Number(boarding.lng))
  );

  if (loadError) {
    return (
      <div style={{
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        backgroundColor: "#f8d7da",
        color: "#721c24",
        textAlign: "center",
        fontSize: "0.9rem"
      }}>
        ❌ Maps unavailable. Please check your API settings.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        backgroundColor: "#d1ecf1",
        color: "#0c5460",
      }}>
        🗺️ Loading map...
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {/* Map Toggle Button */}
      <button
        onClick={() => setShowMap(!showMap)}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: showMap ? "#e9ecef" : "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          fontSize: "0.9rem",
          fontWeight: "500",
          color: "#495057",
          transition: "all 0.2s",
          marginBottom: "1rem"
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = showMap ? "#dee2e6" : "#e9ecef")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = showMap ? "#e9ecef" : "#f8f9fa")}
      >
        {showMap ? "🗺️ Hide Map View" : "🗺️ Show Map View"}
        {validBoardings.length > 0 && (
          <span style={{
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "12px",
            padding: "2px 8px",
            fontSize: "0.75rem",
            marginLeft: "0.5rem"
          }}>
            {validBoardings.length}
          </span>
        )}
      </button>

      {/* Map Display */}
      {showMap && (
        <div style={{ marginTop: "1rem" }}>
          {validBoardings.length > 0 ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={10}
              center={center}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                gestureHandling: "greedy",
                clickableIcons: false,
              }}
            >
              {/* Render markers for each boarding */}
              {validBoardings.map((boarding, index) => (
                <div
                  key={boarding._id}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#e74c3c",
                    border: "2px solid white",
                    borderRadius: "50%",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    zIndex: 1,
                    cursor: "pointer"
                  }}
                  title={`${boarding.type} - ${boarding.address} - Rs. ${boarding.cost}/month`}
                />
              ))}
            </GoogleMap>
          ) : (
            <div style={{
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              backgroundColor: "#f8f9fa",
              color: "#6c757d",
              textAlign: "center",
              fontSize: "0.9rem"
            }}>
              📍 No boarding locations with coordinates available
            </div>
          )}
          
          {/* Map Legend */}
          {validBoardings.length > 0 && (
            <div style={{
              marginTop: "0.5rem",
              padding: "0.5rem",
              backgroundColor: "#f8f9fa",
              border: "1px solid #e9ecef",
              borderRadius: "6px",
              fontSize: "0.8rem",
              color: "#6c757d"
            }}>
              📍 Showing {validBoardings.length} boarding location{validBoardings.length !== 1 ? 's' : ''} on map
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardingMapView; 
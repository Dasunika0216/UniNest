import React, { useState } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const libraries = [];
const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
  border: "1px solid #e0e0e0",
};

const center = {
  lat: 6.9271, // Colombo, Sri Lanka
  lng: 79.8612,
};

const ViewBoardingMap = ({ lat, lng, address }) => {
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState(
    lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : center
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleViewOnGoogleMaps = () => {
    if (lat && lng) {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

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
      {/* Location Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
        padding: "0.75rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e9ecef"
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600", color: "#333" }}>
            📍 Location
          </h3>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: "#666" }}>
            {address || "Address not available"}
          </p>
        </div>
        
        {/* Google Maps Button */}
        {lat && lng && (
          <button
            onClick={handleViewOnGoogleMaps}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "500",
              transition: "background-color 0.2s",
              boxShadow: "0 2px 4px rgba(66, 133, 244, 0.2)"
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#3367d6")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4285f4")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            View on Google Maps
          </button>
        )}
      </div>

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
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = showMap ? "#dee2e6" : "#e9ecef")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = showMap ? "#e9ecef" : "#f8f9fa")}
      >
        {showMap ? "🗺️ Hide Map" : "🗺️ Show Map"}
      </button>

      {/* Map Display */}
      {showMap && (
        <div style={{ marginTop: "1rem" }}>
          {lat && lng ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={15}
              center={mapCenter}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                gestureHandling: "greedy",
                clickableIcons: false,
              }}
            >
              {/* Marker */}
              <div
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
                  zIndex: 1
                }}
              />
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
              📍 Location coordinates not available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewBoardingMap;
import React from "react";

const ViewBoardingMap = ({ lat, lng, address }) => {
  const handleViewOnGoogleMaps = () => {
    if (lat && lng) {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div style={{ marginBottom: "1.5rem" }}>
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
            onMouseEnter={e => (e.target.style.backgroundColor = "#3367d6")}
            onMouseLeave={e => (e.target.style.backgroundColor = "#4285f4")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            View on Google Maps
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewBoardingMap;
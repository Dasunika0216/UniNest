import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// Remove 'places' from libraries since we don't need search
const libraries = [];
const mapContainerStyle = {
  width: "100%",
  height: "200px", // Compact height
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const center = {
  lat: 6.9271, // Colombo, Sri Lanka
  lng: 79.8612,
};

const GoogleMapPicker = ({ lat, lng, setLatLng }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [selectedPosition, setSelectedPosition] = useState(
    lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : center
  );

  const mapRef = useRef(null);

  // Handle map click to pick exact location
  const onMapClick = useCallback(
    (event) => {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();

      setSelectedPosition({ lat: newLat, lng: newLng });
      setLatLng(newLat, newLng);
    },
    [setLatLng]
  );

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;

          setSelectedPosition({ lat: newLat, lng: newLng });
          setLatLng(newLat, newLng);

          // Center map on current location
          if (mapRef.current) {
            mapRef.current.panTo({ lat: newLat, lng: newLng });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your current location. Please click on the map to set location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (loadError) {
    return (
      <div style={{
        height: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f8d7da",
        color: "#721c24",
        textAlign: "center",
        marginBottom: "0.8rem",
        fontSize: "0.9rem"
      }}>
        ❌ Maps unavailable. Please check your API settings.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{
        height: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#d1ecf1",
        color: "#0c5460",
        marginBottom: "0.8rem",
      }}>
        🗺️ Loading map...
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "0.8rem" }}>
      <p style={{
        marginBottom: "0.5rem",
        fontSize: "0.9rem",
        color: "#333",
        fontWeight: "600",
      }}>
        📍 Click on the map to select your boarding location
      </p>

      {/* Current Location Button */}
      <div style={{ marginBottom: "0.5rem" }}>
        <button
          type="button"
          onClick={getCurrentLocation}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
        >
          📍 Use My Current Location
        </button>
      </div>

      {/* Instructions */}
      <div style={{
        marginBottom: "0.5rem",
        padding: "0.4rem",
        backgroundColor: "#e8f4fd",
        border: "1px solid #bee5eb",
        borderRadius: "4px",
        fontSize: "0.75rem",
        color: "#0c5460",
      }}>
        💡 Click anywhere on the map to set your exact boarding location
      </div>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={selectedPosition}
        onClick={onMapClick}
        onLoad={(map) => (mapRef.current = map)}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          gestureHandling: "greedy",
          clickableIcons: false,
        }}
      >
        <Marker
          position={selectedPosition}
          animation={window.google?.maps?.Animation?.DROP}
          title="Click to set exact location"
        />
      </GoogleMap>

      {/* Selected Location Display */}
      {selectedPosition && (
        <div style={{
          marginTop: "0.5rem",
          padding: "0.5rem",
          backgroundColor: "#d4edda",
          border: "1px solid #c3e6cb",
          borderRadius: "4px",
          fontSize: "0.8rem",
          color: "#155724",
        }}>
          ✅ Selected: {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default GoogleMapPicker;
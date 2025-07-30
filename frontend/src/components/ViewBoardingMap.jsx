import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const libraries = [];
const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const ViewBoardingMap = ({
  lat,
  lng,
  address,
  title = "Boarding Location",
  editable = false,
  onLocationChange,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Parse coordinates or use default (Colombo)
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  const hasValidCoords = !isNaN(parsedLat) && !isNaN(parsedLng);

  const position = hasValidCoords
    ? { lat: parsedLat, lng: parsedLng }
    : { lat: 6.9271, lng: 79.8612 };

  if (loadError) {
    return (
      <div style={{
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f8d7da",
        color: "#721c24",
        textAlign: "center",
        fontSize: "0.9rem",
        flexDirection: "column",
        gap: "8px"
      }}>
        <div>❌ Unable to load map</div>
        <div style={{ fontSize: "0.8rem" }}>
          Location: {address || `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`}
        </div>
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
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#d1ecf1",
        color: "#0c5460",
      }}>
        🗺️ Loading map...
      </div>
    );
  }

  // Only allow dragging if editable
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h4 style={{
        marginBottom: "0.5rem",
        fontSize: "1rem",
        color: "#333",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        📍 {title}
      </h4>

      {/* Address Display */}
      {address && (
        <div style={{
          marginBottom: "0.5rem",
          padding: "0.5rem",
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          fontSize: "0.9rem",
          color: "#495057",
        }}>
          🏠 {address}
        </div>
      )}

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={position}
        options={{
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: true,
          gestureHandling: "greedy",
          clickableIcons: true,
        }}
        onClick={editable ? (e) => {
          if (onLocationChange && e.latLng) {
            onLocationChange({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
          }
        } : undefined}
      >
        <Marker
          position={position}
          title={title}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }}
          draggable={editable}
          onDragEnd={editable ? (e) => {
            if (onLocationChange && e.latLng) {
              onLocationChange({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              });
            }
          } : undefined}
        />
      </GoogleMap>

      {/* Coordinates Display */}
      <div style={{
        marginTop: "0.5rem",
        padding: "0.4rem",
        backgroundColor: "#e8f5e8",
        border: "1px solid #c3e6cb",
        borderRadius: "4px",
        fontSize: "0.8rem",
        color: "#155724",
        textAlign: "center"
      }}>
        📍 Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
      </div>

      {/* Open in Google Maps Link */}
      <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
        <a
          href={`https://www.google.com/maps?q=${position.lat},${position.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "0.4rem 0.8rem",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "0.85rem",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          🗺️ Open in Google Maps
        </a>
      </div>
    </div>
  );
};

export default ViewBoardingMap;
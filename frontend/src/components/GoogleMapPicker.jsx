import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const AddBoarding = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const defaultCenter = { lat: 7.8731, lng: 80.7718 }; // Sri Lanka center

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={defaultCenter}
      zoom={7}
    >
      {/* Additional components like markers can be added here */}
    </GoogleMap>
  );
};

export default AddBoarding;
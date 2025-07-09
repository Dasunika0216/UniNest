import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ViewBoarding = () => {
  const location = useLocation();
  const boarding = location.state?.boarding;

  if (!boarding) {
    return (
      <div className="min-h-screen bg-[#fdfde3]">
        <Navbar />
        <div className="p-8 text-center text-gray-500">
          No boarding details found.
        </div>
        <Footer />
      </div>
    );
  }

  // Images logic
  const images = boarding.images || [];
  const mainImage = images[0];
  const sideImages = images.slice(1, 5); // up to 4
  const extraCount = images.length - 5;

  return (
    <div className="min-h-screen bg-[#fdfde3]">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        {/* Images display */}
        {images.length <= 1 ? (
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-2xl aspect-[4/3] rounded overflow-hidden bg-gray-200">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Main Boarding"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-4 mb-6">
            {/* Main image */}
            <div className="relative flex-1 min-w-0 aspect-[4/3] rounded overflow-hidden bg-gray-200">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Main Boarding"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            {/* Side images grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-2 w-64 min-w-64">
              {sideImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded overflow-hidden bg-gray-200"
                >
                  <img
                    src={img}
                    alt={`Boarding ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay for extra images */}
                  {idx === 3 && extraCount > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-lg font-bold">
                      +{extraCount}{" "}
                      <span className="text-sm font-normal">More\nPhotos</span>
                    </div>
                  )}
                </div>
              ))}
              {/* If less than 4 side images, fill empty spots */}
              {Array.from({ length: Math.max(0, 4 - sideImages.length) }).map(
                (_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="aspect-square rounded bg-gray-100"
                  />
                )
              )}
            </div>
          </div>
        )}
        {/* Type and Cost */}
        <div className="flex justify-between items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
            {boarding.type}
          </span>
          <span className="text-lg font-bold text-green-600">
            Rs. {boarding.cost?.toLocaleString()}/month
          </span>
        </div>
        {/* Address */}
        <h2 className="text-2xl font-bold mb-2">{boarding.address}</h2>
        {/* Description */}
        <p className="text-gray-700 mb-4">{boarding.description}</p>
        {/* Available Count */}
        <div className="mb-2">
          <span className="font-semibold">Available:</span>{" "}
          {boarding.availableCount}{" "}
          {boarding.availableCount === 1 ? "bed" : "beds"}
        </div>
        {/* Facilities */}
        {boarding.facilities && boarding.facilities.length > 0 && (
          <div className="mb-2">
            <span className="font-semibold">Facilities:</span>
            <ul className="list-disc list-inside ml-4">
              {boarding.facilities.map((facility, idx) => (
                <li key={idx}>{facility}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ViewBoarding;

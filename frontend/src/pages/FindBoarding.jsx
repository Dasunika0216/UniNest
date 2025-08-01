import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import BoardingMapView from "../components/BoardingMapView";

const FindBoarding = () => {
  const [type, setType] = useState("Annex");
  const typeOptions = [
    { label: "Annexes", value: "Annex" },
    { label: "Hostels", value: "Hostel" },
    { label: "Homestays", value: "Homestay" },
  ];
  const [facilities, setFacilities] = useState([]);
  const allFacilities = [
    "WiFi",
    "AC",
    "Laundry",
    "Parking",
    "Meals",
    "Kitchen",
    "Study Area",
  ];
  const [gender, setGender] = useState("");
  const genderOptions = [
    { label: "All", value: "" },
    { label: "Girls Only", value: "Girls" },
    { label: "Boys Only", value: "Boys" },
  ];
  const [costRange, setCostRange] = useState("");
  const costRangeOptions = [
    { label: "Any Budget", value: "", min: null, max: null },
    { label: "Under Rs. 5,000", value: "under-5000", min: 0, max: 4999 },
    { label: "Rs. 5,000 - 10,000", value: "5000-10000", min: 5000, max: 10000 },
    { label: "Rs. 10,000 - 15,000", value: "10000-15000", min: 10000, max: 15000 },
    { label: "Rs. 15,000 - 20,000", value: "15000-20000", min: 15000, max: 20000 },
    { label: "Above Rs. 20,000", value: "above-20000", min: 20001, max: null },
  ];
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFacilityChange = (facility) => {
    setFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  useEffect(() => {
    setLoading(true);
    const params = { type };
    if (facilities.length > 0) {
      params.facilities = facilities.join(",");
    }
    if (gender) {
      params.gender = gender;
    }
    if (costRange) {
      const selectedRange = costRangeOptions.find(option => option.value === costRange);
      if (selectedRange) {
        if (selectedRange.min !== null) {
          params.minCost = selectedRange.min;
        }
        if (selectedRange.max !== null) {
          params.maxCost = selectedRange.max;
        }
      }
    }
    
    axios
      .get("http://localhost:5500/api/v1/boardings/filter-boarding", {
        params,
      })
      .then((res) => setBoardings(res.data?.data || []))
      .finally(() => setLoading(false));
  }, [type, facilities, gender, costRange]);

  // Listen for boarding updates
  useEffect(() => {
    const handleBoardingUpdate = () => {
      setLoading(true);
      const params = { type };
      if (facilities.length > 0) {
        params.facilities = facilities.join(",");
      }
      if (gender) {
        params.gender = gender;
      }
      if (costRange) {
        const selectedRange = costRangeOptions.find(option => option.value === costRange);
        if (selectedRange) {
          if (selectedRange.min !== null) {
            params.minCost = selectedRange.min;
          }
          if (selectedRange.max !== null) {
            params.maxCost = selectedRange.max;
          }
        }
      }
      axios
        .get("http://localhost:5500/api/v1/boardings/filter-boarding", {
          params,
        })
        .then((res) => setBoardings(res.data?.data || []))
        .finally(() => setLoading(false));
    };

    // Listen for boarding updates
    window.addEventListener("boardingAdded", handleBoardingUpdate);
    window.addEventListener("boardingUpdated", handleBoardingUpdate);
    window.addEventListener("boardingDeleted", handleBoardingUpdate);

    return () => {
      window.removeEventListener("boardingAdded", handleBoardingUpdate);
      window.removeEventListener("boardingUpdated", handleBoardingUpdate);
      window.removeEventListener("boardingDeleted", handleBoardingUpdate);
    };
  }, [type, facilities, gender, costRange]);

  // Periodic refresh every 30 seconds as backup
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        const params = { type };
        if (facilities.length > 0) {
          params.facilities = facilities.join(",");
        }
        if (gender) {
          params.gender = gender;
        }
        if (costRange) {
          const selectedRange = costRangeOptions.find(option => option.value === costRange);
          if (selectedRange) {
            if (selectedRange.min !== null) {
              params.minCost = selectedRange.min;
            }
            if (selectedRange.max !== null) {
              params.maxCost = selectedRange.max;
            }
          }
        }
        axios
          .get("http://localhost:5500/api/v1/boardings/filter-boarding", {
            params,
          })
          .then((res) => {
            const newData = res.data?.data || [];
            // Only update if data has actually changed
            if (JSON.stringify(newData) !== JSON.stringify(boardings)) {
              setBoardings(newData);
            }
          })
          .catch(console.error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [type, facilities, gender, costRange, boardings, loading]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="p-6">
        {/* Horizontal filter bar - centered */}
        <div className="flex justify-center">
          <div className="flex space-x-8 mb-8 border-b border-ash pb-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                className={
                  type === opt.value
                    ? "font-bold border-b-2 border-navy text-navy"
                    : "text-ash hover:text-navy transition"
                }
                onClick={() => setType(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content: vertical filter + boardings */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Vertical filter bar - left side */}
          <div className="w-full lg:w-64 flex-shrink-0 bg-ash p-6 rounded-xl shadow h-fit mb-8 lg:mb-0">
            {/* Gender Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 text-navy text-base">Gender</h3>
              <div className="flex flex-col gap-3">
                {genderOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 text-navy text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={gender === option.value}
                      onChange={(e) => setGender(e.target.value)}
                      className="accent-navy"
                    />
                    <span className="whitespace-nowrap">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cost Range Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 text-navy text-base">Budget Range</h3>
              <div className="flex flex-col gap-3">
                {costRangeOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 text-navy text-sm">
                    <input
                      type="radio"
                      name="costRange"
                      value={option.value}
                      checked={costRange === option.value}
                      onChange={(e) => setCostRange(e.target.value)}
                      className="accent-navy"
                    />
                    <span className="whitespace-nowrap">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Facilities Filter */}
            <div>
              <h3 className="font-semibold mb-4 text-navy text-base">Facilities</h3>
              <div className="flex flex-col gap-3">
                {allFacilities.map((facility) => (
                  <label key={facility} className="flex items-center gap-3 text-navy text-sm">
                    <input
                      type="checkbox"
                      checked={facilities.includes(facility)}
                      onChange={() => handleFacilityChange(facility)}
                      className="accent-navy"
                    />
                    <span className="whitespace-nowrap">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-6">
              <button
                onClick={() => {
                  setGender("");
                  setCostRange("");
                  setFacilities([]);
                }}
                className="w-full bg-navy/10 text-navy py-2 px-4 rounded-md hover:bg-navy/20 transition-colors duration-200 text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Boardings grid */}
          <div className="flex-1">
            {/* Map View removed */}
            {/* Applied Filters Summary */}
            {(gender || costRange || facilities.length > 0) && (
              <div className="mb-4 p-3 bg-navy/5 rounded-lg">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-navy">Active filters:</span>
                  {gender && (
                    <span className="bg-navy text-white text-xs px-2 py-1 rounded">
                      Gender: {gender}
                    </span>
                  )}
                  {costRange && (
                    <span className="bg-navy text-white text-xs px-2 py-1 rounded">
                      {costRangeOptions.find(option => option.value === costRange)?.label}
                    </span>
                  )}
                  {facilities.length > 0 && (
                    <span className="bg-navy text-white text-xs px-2 py-1 rounded">
                      {facilities.length} Facilities
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="flex justify-center items-center p-8 col-span-full">
                  <div className="text-lg text-navy">Loading...</div>
                </div>
              ) : Array.isArray(boardings) && boardings.length > 0 ? (
                boardings.map((boarding) => (
                  <div
                    key={boarding._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-ash"
                  >
                    {/* Image */}
                    {boarding.images && boarding.images.length > 0 ? (
                      <img
                        src={boarding.images[0]}
                        alt={`${boarding.type} at ${boarding.address}`}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Fallback for no image or failed to load */}
                    <div
                      className={`w-full h-48 bg-ash flex items-center justify-center ${
                        boarding.images && boarding.images.length > 0
                          ? "hidden"
                          : "flex"
                      }`}
                    >
                      <div className="text-center text-navy/40">
                        <svg
                          className="mx-auto h-12 w-12 text-navy/20 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">{boarding.images && boarding.images.length > 0 ? "Image failed to load" : "No Image"}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Type and Cost */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-navy text-white text-xs font-semibold px-2 py-1 rounded">
                          {boarding.type}
                        </span>
                        <span className="text-lg font-bold text-navy">
                          Rs. {boarding.cost.toLocaleString()}/month
                        </span>
                      </div>

                      {/* Address */}
                      <h3
                        className="font-semibold text-navy mb-2 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {boarding.address}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-ash text-sm mb-3 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {boarding.description}
                      </p>

                      {/* Available Count */}
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-ash">
                          Available: {" "}
                        </span>
                        <span className="text-sm font-semibold text-navy ml-1">
                          {boarding.availableCount} {boarding.availableCount === 1 ? "bed" : "beds"}
                        </span>
                      </div>

                      {/* Gender */}
                      <div className="flex items-center mb-3">
                        <span className="text-sm text-ash">
                          For: {" "}
                        </span>
                        <span className="text-sm font-semibold text-navy ml-1">
                          {boarding.gender}
                        </span>
                      </div>

                      {/* Location Indicator */}
                      {boarding.lat && boarding.lng && (
                        <div className="flex items-center mb-3">
                          <span className="text-sm text-ash">
                            📍 Location: {" "}
                          </span>
                          <span className="text-sm font-semibold text-green-600 ml-1">
                            Available
                          </span>
                        </div>
                      )}

                      {/* Facilities */}
                      {boarding.facilities &&
                        boarding.facilities.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {boarding.facilities
                                .slice(0, 3)
                                .map((facility, index) => (
                                  <span
                                    key={index}
                                    className="bg-ash text-navy text-xs px-2 py-1 rounded"
                                  >
                                    {facility}
                                  </span>
                                ))}
                              {boarding.facilities.length > 3 && (
                                <span className="bg-ash text-navy text-xs px-2 py-1 rounded">
                                  +{boarding.facilities.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Action Button */}
                      <button
                        className="w-full bg-navy text-white py-2 px-4 rounded hover:bg-white hover:text-navy hover:border-navy border-2 border-navy transition-colors duration-200 font-semibold"
                        onClick={() =>
                          navigate("/view-boarding", { state: { boarding } })
                        }
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <div className="text-navy text-lg">
                    No boardings found.
                  </div>
                  <div className="text-ash text-sm mt-2">
                    Try adjusting your filters
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindBoarding;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    axios
      .get("http://localhost:5500/api/v1/boardings/filter-boarding", {
        params,
      })
      .then((res) => setBoardings(res.data?.data || []))
      .finally(() => setLoading(false));
  }, [type, facilities]);

  return (
    <div className="p-6 bg-[#fdfde3] min-h-screen">
      {/* Top bar with Become a Host button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-green-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-green-700 transition-colors duration-200"
          onClick={() => navigate('/sign-up')}
        >
          Become a Host
        </button>
      </div>
      {/* Horizontal filter bar - centered */}
      <div className="flex justify-center">
        <div className="flex space-x-8 mb-8 border-b pb-2">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              className={
                type === opt.value
                  ? "font-bold border-b-2 border-black"
                  : "text-gray-500"
              }
              onClick={() => setType(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content: vertical filter + boardings */}
      <div className="flex gap-8">
        {/* Vertical filter bar - left side */}
        <div className="w-48 flex-shrink-0 bg-white p-4 rounded shadow h-fit">
          <h3 className="font-semibold mb-4">Facilities</h3>
          <div className="flex flex-col gap-2">
            {allFacilities.map((facility) => (
              <label key={facility} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={facilities.includes(facility)}
                  onChange={() => handleFacilityChange(facility)}
                />
                {facility}
              </label>
            ))}
          </div>
        </div>

        {/* Boardings grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-lg">Loading...</div>
              </div>
            ) : Array.isArray(boardings) && boardings.length > 0 ? (
              boardings.map((boarding) => (
                <div
                  key={boarding._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
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
                    className={`w-full h-48 bg-gray-200 flex items-center justify-center ${
                      boarding.images && boarding.images.length > 0
                        ? "hidden"
                        : "flex"
                    }`}
                  >
                    <div className="text-center text-gray-500">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-2"
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
                      <span className="text-sm">
                        {boarding.images && boarding.images.length > 0
                          ? "Image failed to load"
                          : "No Image"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Type and Cost */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {boarding.type}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        Rs. {boarding.cost.toLocaleString()}/month
                      </span>
                    </div>

                    {/* Address */}
                    <h3
                      className="font-semibold text-gray-800 mb-2 overflow-hidden"
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
                      className="text-gray-600 text-sm mb-3 overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {boarding.description}
                    </p>

                    {/* Available Count */}
                    <div className="flex items-center mb-3">
                      <span className="text-sm text-gray-500">Available: </span>
                      <span className="text-sm font-semibold text-gray-700 ml-1">
                        {boarding.availableCount}{" "}
                        {boarding.availableCount === 1 ? "room" : "rooms"}
                      </span>
                    </div>

                    {/* Facilities */}
                    {boarding.facilities && boarding.facilities.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {boarding.facilities
                            .slice(0, 3)
                            .map((facility, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                              >
                                {facility}
                              </span>
                            ))}
                          {boarding.facilities.length > 3 && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              +{boarding.facilities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="text-gray-500 text-lg">No boardings found.</div>
                <div className="text-gray-400 text-sm mt-2">
                  Try adjusting your filters
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindBoarding;

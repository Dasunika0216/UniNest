import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddBoarding from "../components/addBoarding";
import ListBoarding from "../components/listBoarding";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HostProfile = () => {
  // Add state for all fields
  const [profile, setProfile] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    city: "",
    postalCode: "",
    propertyType: "",
    boardingAddressForApproval: "",
    description: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [showSignOutPrompt, setShowSignOutPrompt] = useState(false);
  const navigate = useNavigate();

  // Fetch all fields on mount
  useEffect(() => {
    const fetchHostProfile = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5500/api/v1/auth/host-profile",
          {},
          { headers: { token: localStorage.getItem("token") } }
        );

        if (response.data.success) {
          setProfile({ ...response.data.data });
        } else {
          toast.error(response.data.message);
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    };
    fetchHostProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSave = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5500/api/v1/auth/update-host-profile",
        profile,
        { headers: { token: localStorage.getItem("token") } }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setEditMode(false);
      } else {
        toast.error(response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleSignOut = () => {
    setShowSignOutPrompt(true);
  };

  const confirmSignOut = () => {
    localStorage.removeItem("token");
    toast.success("Signed out successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col lg:flex-row items-start justify-center px-4 md:px-12 py-12 font-sans gap-8">
        {/* Left - Profile Info */}
        <div className="flex-1 max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-ash">
            <div className="text-center mb-6">
              <img
                src="https://i.pravatar.cc/200?img=12"
                alt="Host Avatar"
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg border-4 border-ash"
              />
              <h3 className="text-xl font-bold text-navy">{profile.fullName || "Your Name"}</h3>
              <p className="text-navy/70">{profile.email || "your@email.com"}</p>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Username</label>
                {editMode ? (
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                ) : (
                  <p className="px-3 py-2 bg-ash/20 rounded-lg text-navy">{profile.username || "Not provided"}</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Full Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                ) : (
                  <p className="px-3 py-2 bg-ash/20 rounded-lg text-navy">{profile.fullName || "Not provided"}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Email</label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                ) : (
                  <p className="px-3 py-2 bg-ash/20 rounded-lg text-navy">{profile.email || "Not provided"}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Phone Number</label>
                {editMode ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                ) : (
                  <p className="px-3 py-2 bg-ash/20 rounded-lg text-navy">{profile.phone || "Not provided"}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">City</label>
                {editMode ? (
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                ) : (
                  <p className="px-3 py-2 bg-ash/20 rounded-lg text-navy">{profile.city || "Not provided"}</p>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Postal Code</label>
                {editMode ? (
                  <input
                    type="text"
                    name="postalCode"
                    value={profile.postalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                ) : (
                  <p className="px-3 py-2 bg-ash/20 rounded-lg text-navy">{profile.postalCode || "Not provided"}</p>
                )}
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Property Type</label>
                {editMode ? (
                  <select
                    name="propertyType"
                    value={profile.propertyType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  >
                    <option value="">Select Property Type</option>
                    <option value="Annex">Annex</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Homestay">Homestay</option>
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-ash/20 rounded-lg text-navy">{profile.propertyType || "Not provided"}</p>
                )}
              </div>

              {/* Boarding Address */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Boarding Address</label>
                {editMode ? (
                  <textarea
                    name="boardingAddressForApproval"
                    value={profile.boardingAddressForApproval}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy resize-none"
                  />
                ) : (
                  <p className="px-3 py-2 bg-ash/20 rounded-lg text-navy">{profile.boardingAddressForApproval || "Not provided"}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Description</label>
                {editMode ? (
                  <textarea
                    name="description"
                    value={profile.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-ash rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy resize-none"
                  />
                ) : (
                  <p className="px-3 py-2 bg-ash/20 rounded-lg text-navy">{profile.description || "Not provided"}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {editMode ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-navy text-white rounded-lg font-semibold shadow hover:bg-navy/90 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 px-4 py-2 bg-ash text-navy rounded-lg font-semibold shadow hover:bg-ash/80 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full px-4 py-2 bg-navy text-white rounded-lg font-semibold shadow hover:bg-navy/90 transition"
                >
                  Edit Profile
                </button>
              )}

              {localStorage.getItem("token") ? (
                <>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 bg-ash text-navy rounded-lg font-semibold shadow hover:bg-ash/80 transition"
                  >
                    Sign Out
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="w-full px-4 py-2 bg-navy/10 text-navy rounded-lg font-semibold shadow hover:bg-navy/20 transition border border-navy"
                  >
                    Go to Home Page
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/sign-in")}
                  className="w-full px-4 py-2 bg-ash text-navy rounded-lg font-semibold shadow hover:bg-navy hover:text-white transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right - AddBoarding */}
        <div className="flex-2 w-full lg:w-2/3">
          <h2 className="mb-4 text-2xl font-bold text-navy">Your Boarding Details</h2>
          <div className="bg-white rounded-xl shadow p-6 mb-6 border border-ash">
            <AddBoarding />
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-ash">
            <ListBoarding />
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center border border-ash">
            <h3 className="mb-4 text-lg font-semibold text-navy">Sign Out?</h3>
            <p className="mb-6 text-navy/70">Are you sure you want to sign out?</p>
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={confirmSignOut}
                className="flex-1 px-4 py-2 bg-ash text-navy rounded hover:bg-ash/80 hover:text-navy font-bold transition border border-ash"
              >
                Yes
              </button>
              <button
                onClick={() => setShowSignOutPrompt(false)}
                className="flex-1 px-4 py-2 bg-navy text-white rounded hover:bg-navy/90 hover:text-white font-bold transition border border-navy"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default HostProfile;

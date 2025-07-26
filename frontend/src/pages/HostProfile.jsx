import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddBoarding from "../components/addBoarding";
import ListBoarding from "../components/listBoarding";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HostProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showSignOutPrompt, setShowSignOutPrompt] = useState(false);
  const navigate = useNavigate();

  const fetchHostProfile = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5500/api/v1/auth/host-profile",
        {},
        { headers: { token: localStorage.getItem("token") } }
      );

      if (response.data.success) {
        setName(response.data.data.username);
        setEmail(response.data.data.email);
      } else {
        toast.error(response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchHostProfile();
  }, []);

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
      <div className="flex flex-col md:flex-row items-start justify-center px-4 md:px-12 py-12 font-sans">
        {/* Left - Profile Info */}
        <div className="flex-1 max-w-xs md:max-w-sm text-center mb-10 md:mb-0 md:mr-12">
          <img
            src="https://i.pravatar.cc/200?img=12"
            alt="Host Avatar"
            className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover mx-auto mb-4 shadow-lg border-4 border-ash"
          />
          <h3 className="mb-1 text-xl font-bold text-navy">{name || "Your Name"}</h3>
          <p className="text-navy/70 mb-4">{email || "your@email.com"}</p>

          {localStorage.getItem("token") ? (
            <>
              <button
                onClick={handleSignOut}
                className="mt-2 px-6 py-2 bg-ash text-navy rounded-lg font-semibold shadow hover:bg-ash/80 hover:text-navy transition mb-2 w-full"
              >
                Sign Out
              </button>
              <button
                onClick={() => navigate("/")}
                className="mt-2 px-6 py-2 bg-navy text-white rounded-lg font-semibold shadow hover:bg-navy/90 hover:text-white transition w-full"
              >
                Go to Home Page
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/sign-in")}
              className="mt-2 px-6 py-2 bg-ash text-navy rounded-lg font-semibold shadow hover:bg-navy hover:text-white transition w-full"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-ash h-[32rem] mx-8"></div>

        {/* Right - AddBoarding */}
        <div className="flex-2 w-full md:w-2/3">
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

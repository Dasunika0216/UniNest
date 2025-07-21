import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [showSignOutPrompt, setShowSignOutPrompt] = useState(false);

  const handleAddBoarding = () => {
    if (token) {
      navigate("/host-profile");
    } else {
      navigate("/sign-in");
    }
  };

  const handleSignOut = () => {
    setShowSignOutPrompt(true);
  };

  const confirmSignOut = () => {
    localStorage.removeItem("token");
    toast.success("Signed out successfully!");
    setShowSignOutPrompt(false);
    navigate("/");
  };

  const cancelSignOut = () => {
    setShowSignOutPrompt(false);
  };

  const isActive = (path) => location.pathname === path;

  // Hide action buttons on host profile page since they're already there
  const shouldShowActionButtons = location.pathname !== "/host-profile";
  const isAdminDashboard = location.pathname === "/admin-dashboard";

  return (
    <>
      <nav className="bg-[#E8D7CC] px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-gray-800">
            <button
              onClick={() => navigate(isAdminDashboard ? "/admin-dashboard" : "/")}
              className="hover:text-gray-600"
            >
              UNINEST
            </button>
          </div>

          {/* Navigation Links */}
          {!isAdminDashboard && (
            <div className="flex space-x-8">
              <button
                onClick={() => navigate("/")}
                className={`text-gray-700 hover:text-gray-900 font-medium ${
                  isActive("/") ? "text-gray-900 font-semibold" : ""
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/about")}
                className={`text-gray-700 hover:text-gray-900 font-medium ${
                  isActive("/about") ? "text-gray-900 font-semibold" : ""
                }`}
              >
                About
              </button>
              <button
                onClick={() => navigate("/contact")}
                className={`text-gray-700 hover:text-gray-900 font-medium ${
                  isActive("/contact") ? "text-gray-900 font-semibold" : ""
                }`}
              >
                Contact Us
              </button>
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {isAdminDashboard ? (
              token && (
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white font-medium px-6 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  Sign Out
                </button>
              )
            ) : (
              shouldShowActionButtons && (
                <>
                  <button
                    onClick={handleAddBoarding}
                    className="bg-gray-800 text-white font-medium px-6 py-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                  >
                    Add boarding
                  </button>
                  {token && (
                    <button
                      onClick={handleSignOut}
                      className="bg-red-500 text-white font-medium px-6 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  )}
                </>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Sign Out Confirmation Modal */}
      {showSignOutPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Sign Out?
            </h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={cancelSignOut}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

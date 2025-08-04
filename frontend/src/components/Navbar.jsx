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
      navigate("/sign-in")
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
      <nav className="bg-navy px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-white">
            <button
              onClick={() => navigate(isAdminDashboard ? "/admin-dashboard" : "/")}
              className="hover:text-ash transition"
            >
              UNINEST
            </button>
          </div>

          {/* Navigation Links */}
          {!isAdminDashboard && (
            <div className="flex space-x-8">
              <button
                onClick={() => navigate("/")}
                className={`text-white hover:text-ash font-medium transition ${isActive("/") ? "underline underline-offset-8 decoration-2 decoration-white" : ""}`}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/about")}
                className={`text-white hover:text-ash font-medium transition ${isActive("/about") ? "underline underline-offset-8 decoration-2 decoration-white" : ""}`}
              >
                About
              </button>
              <button
                onClick={() => navigate("/contact")}
                className={`text-white hover:text-ash font-medium transition ${isActive("/contact") ? "underline underline-offset-8 decoration-2 decoration-white" : ""}`}
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
                  className="bg-navy text-white font-medium px-6 py-2 rounded-full border-2 border-white hover:bg-white hover:text-navy hover:border-white transition-colors duration-200"
                >
                  Sign Out
                </button>
              )
            ) : (
              shouldShowActionButtons && (
                <>
                  <button
                    onClick={handleAddBoarding}
                    className="bg-navy text-white font-medium px-6 py-2 rounded-full border-2 border-white hover:bg-white hover:text-navy hover:border-white transition-colors duration-200"
                  >
                    Add boarding
                  </button>
                  {token && (
                    <button
                      onClick={handleSignOut}
                      className="bg-navy text-white font-medium px-6 py-2 rounded-full border-2 border-white hover:bg-white hover:text-navy hover:border-white transition-colors duration-200"
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center border border-ash">
            <h3 className="text-lg font-semibold mb-2 text-navy">
              Sign Out?
            </h3>
            <p className="mb-4 text-ash">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={cancelSignOut}
                className="bg-ash text-navy px-4 py-2 rounded border-2 border-ash hover:bg-white hover:text-navy hover:border-navy transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOut}
                className="bg-navy text-white px-4 py-2 rounded border-2 border-navy hover:bg-white hover:text-navy hover:border-navy transition-colors duration-200"
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

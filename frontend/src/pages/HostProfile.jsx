import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddBoarding from "../components/addBoarding";
import ListBoarding from "../components/listBoarding";

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
    <>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "3rem 2rem",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        {/* Left - Profile Info */}
        <div
          style={{
            flex: 1,
            paddingRight: "2rem",
            textAlign: "center",
          }}
        >
          <img
            src="https://i.pravatar.cc/200?img=12"
            alt="Host Avatar"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "1rem",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
          <h3 style={{ margin: "0.5rem 0", color: "#2c3e50" }}>
            {name || "Your Name"}
          </h3>
          <p style={{ color: "#7f8c8d" }}>{email || "your@email.com"}</p>

          {localStorage.getItem("token") ? (
            <>
              <button
                onClick={handleSignOut}
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem 1.2rem",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition:
                    "background-color 0.3s, transform 0.3s, box-shadow 0.3s",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#c0392b"; // Darker red
                  e.target.style.transform = "scale(1.05)"; // Slight scaling effect
                  e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.2)"; // Slightly larger shadow
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#e74c3c"; // Original red color
                  e.target.style.transform = "scale(1)"; // Reset to normal size
                  e.target.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)"; // Reset shadow
                }}
              >
                Sign Out
              </button>
              <button
                onClick={() => navigate("/")}
                style={{
                  marginTop: "1rem",
                  marginLeft: "0.75rem",
                  padding: "0.6rem 1.2rem",
                  backgroundColor: "#22c55e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition:
                    "background-color 0.3s, transform 0.3s, box-shadow 0.3s",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#16a34a"; // Darker green
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#22c55e";
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)";
                }}
              >
                Go to Home Page
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/sign-in")}
              style={{
                marginTop: "1rem",
                padding: "0.6rem 1.2rem",
                backgroundColor: "#2ecc71",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                transition:
                  "background-color 0.3s, transform 0.3s, box-shadow 0.3s",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#27ae60"; // Darker green
                e.target.style.transform = "scale(1.05)"; // Slight scaling effect
                e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.2)"; // Slightly larger shadow
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#2ecc71"; // Original green color
                e.target.style.transform = "scale(1)"; // Reset to normal size
                e.target.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)"; // Reset shadow
              }}
            >
              Sign In
            </button>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            width: "2px",
            backgroundColor: "#ccc",
            height: "100vh",
            margin: "0 2rem",
          }}
        ></div>

        {/* Right - AddBoarding */}
        <div style={{ flex: 2 }}>
          <h2 style={{ marginBottom: "1rem", color: "#333" }}>
            Your Boarding Details
          </h2>
          <AddBoarding />
          <ListBoarding />
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutPrompt && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "10px",
              width: "300px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>Sign Out?</h3>
            <p style={{ marginBottom: "1.5rem", color: "#555" }}>
              Are you sure you want to sign out?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={confirmSignOut}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  flex: 1,
                  fontWeight: "bold",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#c0392b";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#e74c3c";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Yes
              </button>

              <button
                onClick={() => setShowSignOutPrompt(false)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#bdc3c7",
                  color: "#2c3e50",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  flex: 1,
                  fontWeight: "bold",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#95a5a6";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#bdc3c7";
                  e.target.style.transform = "scale(1)";
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HostProfile;

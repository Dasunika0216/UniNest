import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function EmailVerification() {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5500/api/v1/auth/verify-email/${token}`
        );

        if (response.data.success) {
          setVerificationStatus("success");
          setMessage(response.data.message);
        } else {
          setVerificationStatus("error");
          setMessage(response.data.message);
        }
      } catch (error) {
        setVerificationStatus("error");
        setMessage(error.response?.data?.message || "Verification failed");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  const containerStyle = {
    maxWidth: "500px",
    margin: "5rem auto",
    padding: "2rem",
    backgroundColor: "#d4bf95",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
    fontFamily: "Segoe UI, sans-serif",
    textAlign: "center",
  };

  const iconStyle = {
    fontSize: "4rem",
    marginBottom: "1rem",
    display: "block",
  };

  const getStatusDisplay = () => {
    switch (verificationStatus) {
      case "verifying":
        return {
          icon: "⏳",
          title: "Verifying Email...",
          color: "#f39c12",
        };
      case "success":
        return {
          icon: "✅",
          title: "Email Verified Successfully!",
          color: "#27ae60",
        };
      case "error":
        return {
          icon: "❌",
          title: "Verification Failed",
          color: "#e74c3c",
        };
      default:
        return {
          icon: "⏳",
          title: "Verifying...",
          color: "#f39c12",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div style={containerStyle}>
      <span style={{ ...iconStyle, color: statusDisplay.color }}>
        {statusDisplay.icon}
      </span>

      <h2 style={{ color: "#2d2d2d", marginBottom: "1rem" }}>
        {statusDisplay.title}
      </h2>

      <p style={{ color: "#555", marginBottom: "2rem", lineHeight: "1.6" }}>
        {message || "Please wait while we verify your email address..."}
      </p>

      {verificationStatus === "success" && (
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              color: "#27ae60",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            🎉 Your email has been verified!
          </p>
          <p style={{ color: "#555", fontSize: "0.9rem" }}>
            Your host application is now pending admin approval. You'll receive
            a notification once your application is reviewed.
          </p>
        </div>
      )}

      <Link
        to={verificationStatus === "success" ? "/sign-in" : "/sign-up"}
        style={{
          display: "inline-block",
          backgroundColor: "#222",
          color: "white",
          padding: "0.75rem 2rem",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#444")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#222")}
      >
        {verificationStatus === "success" ? "Go to Sign In" : "Back to Sign Up"}
      </Link>

      {verificationStatus === "error" && (
        <div style={{ marginTop: "2rem" }}>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Need help?{" "}
            <Link
              to="/contact"
              style={{ color: "#222", textDecoration: "underline" }}
            >
              Contact Support
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default EmailVerification;

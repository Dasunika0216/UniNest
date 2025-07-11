import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5500/api/v1/auth/sign-in",
        {
          email,
          password,
        }
      );

      if (res.data.success) {
        setToken(res.data.data.token);
        localStorage.setItem("token", res.data.data.token);
        toast.success("Sign-in successful!");
        setMessage("Sign-in successful!");
        localStorage.setItem("user", JSON.stringify(res.data.data.host));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      if (err.response) {
        console.error("Server responded with:", err.response.data);
        setMessage(err.response.data.message || "Sign in failed!");
      } else {
        console.error("Error:", err.message);
        setMessage("Network error or server not reachable");
      }
    }
  };

  useEffect(() => {
    if (token) {
      // Get the user/host object from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/host-profile");
      }
    }
  }, [token]);

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "7rem auto",
        padding: "2rem",
        backgroundColor: "#d4bf95",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        fontFamily: "Segoe UI, sans-serif",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#2d2d2d",
          marginBottom: "1.5rem",
        }}
      >
        Hello, Glad to see you again!
      </h2>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: "1rem",
            padding: "0.75rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "1rem",
            transition: "border 0.3s",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.border = "1px solid #222")}
          onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: "1rem",
            padding: "0.75rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "1rem",
            transition: "border 0.3s",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.border = "1px solid #222")}
          onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#222",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#444")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#222")}
        >
          Sign In
        </button>
      </form>
      {message && (
        <p style={{ textAlign: "center", marginTop: "1rem", color: "#e74c3c" }}>
          {message}
        </p>
      )}
      <p
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.95rem",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/sign-up"
          style={{
            color: "#222",
            textDecoration: "underline",
            fontWeight: "500",
            transition: "color 0.3s ease",
          }}
        >
          Sign up here
        </Link>
      </p>
    </div>
  );
}

export default SignIn;

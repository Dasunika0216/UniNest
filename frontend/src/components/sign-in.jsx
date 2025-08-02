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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-ash to-white">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl font-sans transition-all border border-ash">
        <h2 className="text-center text-2xl font-bold text-navy mb-6">
          Hello, Glad to see you again!
        </h2>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 px-4 py-3 border border-ash rounded-lg text-base focus:outline-none focus:border-navy bg-white placeholder-ash text-navy transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-4 px-4 py-3 border border-ash rounded-lg text-base focus:outline-none focus:border-navy bg-white placeholder-ash text-navy transition"
          />
          <button
            type="submit"
            className="w-full py-3 bg-navy text-white rounded-lg text-base font-bold cursor-pointer border-2 border-navy hover:bg-white hover:text-navy hover:border-navy transition"
          >
            Sign In
          </button>
        </form>
        {message && (
          <p className="text-center mt-4 text-red-500">{message}</p>
        )}
        <p className="text-center mt-6 text-sm text-navy">
          Don't have an account?{' '}
          <Link
            to="/sign-up"
            className="text-navy underline font-medium transition hover:text-black"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;

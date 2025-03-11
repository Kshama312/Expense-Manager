import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetMessage, setResetMessage] = useState(""); // Message for forgot password
  const navigate = useNavigate();

  // Handle Email and Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Redirect to Home after login
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home"); // Redirect to Home after Google login
    } catch (error) {
      alert("Google Login Failed: " + error.message);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      setResetMessage("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setResetMessage("Error: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">Login</button>
        </form>

        {/* Forgot Password Link */}
        <button className="forgot-password" onClick={handleForgotPassword}>
          Forgot Password?
        </button>

        {/* Show Reset Password Message */}
        {resetMessage && <p className="reset-message">{resetMessage}</p>}

        <div className="separator">
          <span>OR</span>
        </div>

        {/* Google Login Button */}
        <button className="google-login" onClick={handleGoogleLogin}>
          <FontAwesomeIcon icon={faGoogle} className="google-icon" />
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

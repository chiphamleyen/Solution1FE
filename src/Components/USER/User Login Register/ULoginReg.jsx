import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import axios from "axios";
import "./ULogin-Reg.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const ULoginReg = () => {
  const [action, setAction] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate(); // Use useNavigate here instead of useHistory

  const registerLink = () => {
    setAction("active");
  };

  const loginLink = () => {
    setAction("");
  };

  const resetForm = () => {
    setUserName("");
    setEmail("");
    setPassword("");
    setError(null);
    setLoading(false);
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowSuccessModal(false);
    setShowErrorModal(false);

    try {
      const response = await axios.post(
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/account/signup",
        {
          user_name: userName,
          password: password,
          email: email,
        },
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API response:", response.data);

      if (response.data.error_code === 0) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage("Registration failed. Please try again.");
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error("API request failed:", err);
      setErrorMessage("An error occurred. Please try again.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    setLoading(true);
    setError(null);
    setShowSuccessModal(false);
    setShowErrorModal(false);
  
    try {
      const response = await axios.post(
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/account/user_login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("API response:", response.data);
  
      // Check for success
      if (response.data.error_code === 0) {
        // Success: User logged in
        setShowSuccessModal(true);
        // You can store the access token in localStorage or sessionStorage for use
        localStorage.setItem("user_token", response.data.data.access_token);
        // Optionally redirect the user to a dashboard or home page
        navigate("/UDash");
      } else {
        // If error code is not 0, show the error message
        setErrorMessage("An unexpected error occurred. Please try again.");
        setShowErrorModal(true);
      }
  
    } catch (err) {
      console.error("API request failed:", err);
      // Handle different types of error responses from the API
      if (err.response && err.response.data) {
        if (err.response.data.error === "Wrong email or password") {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      } else {
        setErrorMessage("Network or server error. Please try again later.");
      }
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div className="container-1">
        <h1>USER</h1>
        <div className={`wrapper ${action}`}>
          {/* Login Form */}
          <div className="form-box login">
            <form onSubmit={handleLogin}>
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FaLock className="icon" />
              </div>

              <div className="remember-forget">
                <label>
                  <input type="checkbox" /> Remember Me
                </label>
                <a href="#">Forgot Password?</a>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="register-link">
                <p>
                  Don't have an account?{" "}
                  <a href="#" onClick={registerLink}>
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Registration Form */}
          <div className="form-box register">
            <form onSubmit={handleRegister}>
              <h1>Registration</h1>

              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FaEnvelope className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FaLock className="icon" />
              </div>

              <div className="remember-forget">
                <label>
                  <input type="checkbox" /> I agree to the terms and conditions
                </label>
                <a href="#">Forgot Password?</a>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>

              {error && <p className="error-message">{error}</p>}

              <div className="register-link">
                <p>
                  Already have an account?{" "}
                  <a href="#" onClick={loginLink}>
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        <button className="button-79" role="button">
          <Link to="/LoginReg">Admin Login</Link>
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal">
          <div className="modal-content">
            <h2>Login Successful!</h2>
            <p>Welcome back! You are now logged in.</p>
            <button onClick={() => { setShowSuccessModal(false); resetForm(); }}>Close</button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
  <div className="error-modal">
    <div className="modal-content">
      <h2>Error</h2>
      <p>{errorMessage}</p>
      <button onClick={() => { setShowErrorModal(false); resetForm(); }}>Close</button>
    </div>
  </div>
)}
    </>
  );
};

export default ULoginReg;

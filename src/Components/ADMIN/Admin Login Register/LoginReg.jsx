import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // useNavigate for navigation
import "./Login-Reg.css";
import { FaLock, FaEnvelope } from "react-icons/fa"; // Icon imports

const LoginReg = () => {
  const [action, setAction] = useState(""); // State to toggle between login and register
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  }); // Store input data for login
  const [error, setError] = useState(null); // Error message state
  const [success, setSuccess] = useState(false); // Success message state
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State for error popup visibility
  const navigate = useNavigate(); // Hook for navigation

  // Handle changes in form inputs for login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/account/admin_login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      
      if (response.status === 200) {
        setSuccess(true);
        setError(null);
        
        // Access the token properly from response.data.data
        const token = response.data.data.access_token;
      
        // Check if the token exists before saving it
        if (token) {
          localStorage.setItem("admin_token", token); // Save token in localStorage
          navigate("/ADash"); // Redirect to admin dashboard
        } else {
          console.error("Token not found in the response");
        }
      } else {
        setError(response.data.error || "Login failed!");
        setShowErrorPopup(true); // Show the error popup when login fails
        setSuccess(false);
      }

      setLoginData({
        email: "",
        password: "",
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSuccess(false);
      setShowErrorPopup(true); // Show the error popup in case of network issues or other failures
    }
  };

  // Close the error popup
  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <>
    <div className="container-1">
      <h1>ADMIN</h1>
      <div className={`wrapper ${action}`}>
        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>

            <div className="input-box">
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Email"
                required
              />
              <FaEnvelope className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Password"
                required
              />
              <FaLock className="icon" />
            </div>

            <div className="remember-forget">
              <label>
                <input type="checkbox" /> Remember Me{" "}
              </label>
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      {/* Success and Error Messages */}
      {error && (
        <p className="error-message">{error}</p>
      )}
      {success && <p className="success-message">Operation Successful!</p>}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="error-popup">
          <div className="popup-content">
            <p>{error}</p>
            <button onClick={closeErrorPopup}>Close</button>
          </div>
        </div>
      )}
    </div>
    <button className="button-79" role="button"><Link to="/ULoginReg">User Login </Link> </button>

    </>
  );
};

export default LoginReg;

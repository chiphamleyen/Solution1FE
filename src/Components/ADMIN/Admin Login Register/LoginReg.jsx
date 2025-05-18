import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // useNavigate for navigation
import "./Login-Reg.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa"; // Icon imports

const LoginReg = () => {
  const [action, setAction] = useState(""); // State to toggle between login and register
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  }); // Store input data for both login and registration
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  }); // Store input data for login
  const [error, setError] = useState(null); // Error message state
  const [success, setSuccess] = useState(false); // Success message state
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State for error popup visibility
  const navigate = useNavigate(); // Hook for navigation

  // Switch to registration view
  const registerLink = () => {
    setAction("active");
  };

  // Switch back to login view
  const loginLink = () => {
    setAction("");
  };

  // Handle changes in form inputs for registration
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle changes in form inputs for login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password } = userData;

    if (!username || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlkIjoiNjgyN2VhNWZhYTI5MWYxZDEyY2ZlNDM0IiwiZXhwIjoxNzQ3NjQ3NzUxfQ.3Z5N3J4pGaEElX2QCWEF_kBXyrc9XFTtXU7rNL_vBOc"; // Replace with actual token if needed

    try {
      const response = await axios.post(
        "https://urlclassifier-g5eub3ggf8gkf2fz.australiaeast-01.azurewebsites.net/api/user_management/create_new_admin",
        {
          user_name: username,
          password: password,
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setError(null);
      } else {
        setError(response.data.error || "Registration failed!");
        setSuccess(false);
      }

      setUserData({
        username: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSuccess(false);
    }
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
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                placeholder="Username"
                required
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
              <FaEnvelope className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
              />
              <FaLock className="icon" />
            </div>

            <div className="remember-forget">
              <label>
                <input type="checkbox" /> I agree to the terms and conditions{" "}
              </label>
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit">Register</button>
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
  );
};

export default LoginReg;
import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/api";
import "./LoginPage.css";
import bankingImage from "../assets/images/banking.jpg";


function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "" });

  // 🔔 Show alert when the page first loads
  useEffect(() => {
    alert(
      "👋 Welcome to NED Bank Demo!\n\n" +
      "You can log in with this demo account:\n" +
      "Username: staff1\nPassword: password123\n\n" +
      "Or create your own account — any username and password will work."
    );
  }, []);

  // 🔹 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      onLogin();
    } else {
      setMessage(data.message || "Login failed");
    }
  };

  // 🔹 Handle Signup (auto login after success)
  const handleSignup = async (e) => {
    e.preventDefault();
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(newUser),
    });

    if (data.accessToken) {
      // ✅ Auto login
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setShowSignup(false);
      onLogin();
    } else {
      setMessage(data.message || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Illustration */}
      <div 
        className="login-illustration" 
        style={{
          backgroundImage: `url(${bankingImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h3>Welcome to NED Bank</h3>
        <p>
          Your trusted partner in banking. Manage your accounts, monitor transactions,
          and stay in control of your finances efficiently and securely.
          NED Bank — "Banking Made Simple."
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="login-form-section">
        <h2 className="login-title">Staff Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        {message && <p className="login-message">{message}</p>}

        {/* Signup Button */}
        <button
          onClick={() => setShowSignup(true)}
          className="signup-button"
        >
          Create Account
        </button>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowSignup(false)}
            >
              ✖
            </button>
            <h3>Create Account</h3>
            <form onSubmit={handleSignup} className="login-form">
              <input
                type="text"
                placeholder="Enter username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="login-input"
              />
              <input
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="login-input"
              />
              <button type="submit" className="login-button">
                Sign Up And Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

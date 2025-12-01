import React, { useState } from "react";
import axios from "axios";

const LoginModal = ({ setIsLoggedIn, setUsername, username }) => {
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    try {
      const response = await axios.post("https://fitforgev2.onrender.com/api/login", {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);   // save username
        setIsLoggedIn(true);
      } else {
        alert(response.data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="login-modal">
      <div className="login-box">

        <h1 className="login-title">FITFORGE</h1>

        <form className="login-form" onSubmit={handleLogin}>

          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              placeholder="Enter username"
              style={{ textTransform: "none" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter password"
              style={{ textTransform: "none" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>

        </form>
        <p className="create-account-text">
             Don’t have an account?{" "}
        <a href="/auth" className="create-account-link">Create Account</a>
      </p>
      </div>
    </div>
  );
};

export default LoginModal;
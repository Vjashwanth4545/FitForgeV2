import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const Auth = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "1.2",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "https://fitforgev2.onrender.com/api/login/newuser",
        formData
      );

      if (response.data.success) {
        alert("Account created successfully!");
        window.location.href = "/"; // Go back to login page
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2>Create New Account</h2>
        <p className="subtitle">Join FitForge today</p>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
            />
          </div>

          {/* Passwords Side-by-Side */}
          <div className="row-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
            />
          </div>

          {/* Body Stats Grid */}
          <div className="stats-grid">
            <div className="input-wrapper">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="25"
                required
                onChange={handleChange}
              />
            </div>
            <div className="input-wrapper">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                placeholder="70"
                required
                onChange={handleChange}
              />
            </div>
            <div className="input-wrapper">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                placeholder="175"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Gender & Activity */}
          <div className="select-group">
            <select name="gender" required onChange={handleChange} defaultValue="">
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <select
              name="activityLevel"
              required
              onChange={handleChange}
              defaultValue="1.2"
            >
              <option value="1">Sedentary (Little exercise)</option>
              <option value="2">Lightly active (1-3 days/week)</option>
              <option value="3">Moderately active (3-5 days/week)</option>
              <option value="4">Very active (6-7 days/week)</option>
              <option value="5">Super active</option>
            </select>
          </div>

          <button type="submit" className="signup-btn">
            Create Account
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{" "}
          <a className="link" href="/">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
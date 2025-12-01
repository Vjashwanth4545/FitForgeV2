import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../App.css";

const Profile = ({ username }) => {
  const [userData, setUserData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);

  const navigate = useNavigate();

  // ----------------------------------------------------
  // LOAD PROFILE
  // ----------------------------------------------------
  useEffect(() => {
    axios
      .post("https://fitforgev2.onrender.com/api/user/profile", { username })
      .then((res) => {
        if (res.data.success) {
          // save only user fields
          const userObj = {
            username: res.data.username,
            age: res.data.age,
            weight: res.data.weight,
            height: res.data.height,
            gender: res.data.gender,
            activityLevel: res.data.activityLevel,
          };

          setUserData(userObj);
          setEditableData(userObj);
        } else {
          alert("User not found");
        }
      })
      .catch(() => alert("Failed to load profile"));
  }, [username]);

  // ----------------------------------------------------
  // DETECT CHANGES
  // ----------------------------------------------------
  const handleChange = (e) => {
    const updated = { ...editableData, [e.target.name]: e.target.value };
    setEditableData(updated);
    setIsUpdated(JSON.stringify(updated) !== JSON.stringify(userData));
  };

  // ----------------------------------------------------
  // UPDATE PROFILE
  // ----------------------------------------------------
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5001/api/user/update",
        editableData
      );

      if (res.data.success) {
        alert("Profile updated successfully!");
        navigate("/");    // 🔥 redirect to home page
      }
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  if (!editableData) return <p>Loading...</p>;

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2>Your Profile</h2>

        <input value={editableData.username} disabled />

        <div className="stats-grid">
          <div>
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={editableData.age}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Weight</label>
            <input
              type="number"
              name="weight"
              value={editableData.weight}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Height</label>
            <input
              type="number"
              name="height"
              value={editableData.height}
              onChange={handleChange}
            />
          </div>
        </div>

        <select
          name="gender"
          value={editableData.gender}
          onChange={handleChange}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          name="activityLevel"
          value={editableData.activityLevel}
          onChange={handleChange}
        >
          <option value="1">Sedentary</option>
          <option value="2">Lightly Active</option>
          <option value="3">Moderate</option>
          <option value="4">Very Active</option>
          <option value="5">Super Active</option>
        </select>

        {isUpdated && (
          <button className="signup-btn" onClick={handleUpdate}>
            Update Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
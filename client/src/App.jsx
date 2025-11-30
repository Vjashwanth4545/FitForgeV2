import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import BMI from "./pages/BMI/BMI";
import Workout from "./pages/Workout/Workout";
import Diet from "./pages//Diet/Diet";
import Report from "./pages/Report/Report";
import LoginModal from "./components/LoginModal";
import Auth from "./components/Auth";

import "./pages/Home.css";
import "./App.css";
import Profile from "./components/Profile";

const App = () => {
  const location = useLocation();

  // Read login state once from storage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });

  // Save login state
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("username", username);
  }, [isLoggedIn, username]);

  return (
    <div className="app-container">

      {/* Blur content if not logged in */}
      <div  className={
  isLoggedIn || location.pathname === "/auth"
    ? "content"
    : "content blur"
}>
        <Routes>
          <Route path="/" element={<Home setIsLoggedIn={setIsLoggedIn} username={username} />} />
          <Route path="/bmi" element={<BMI username={username} />} />
          <Route path="/workout" element={<Workout username={username}/>} />
          <Route path="/diet" element={<Diet username={username}/>} />
          <Route path="/report" element={<Report username={username}/>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile username={username}/>} />
        </Routes>
      </div>

      {/* Show LoginModal ONLY if user is not logged in AND not on signup page */}
      {!isLoggedIn && location.pathname !== "/auth" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
          <LoginModal
            setIsLoggedIn={setIsLoggedIn}
            setUsername={setUsername}
            username={username}
          />
        </div>
      )}
    </div>
  );
};

export default App;
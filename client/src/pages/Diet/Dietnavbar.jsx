import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSun, faMoon, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const DietNavbar = () => {

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <nav className="bmi-navbar">

      {/* LEFT */}
      <div className="left">
        <p className="brand">FITFORGE</p>
      </div>

      {/* CENTER */}
      <div className="center">
        <p className="page-title">DIET PLANNER</p>
      </div>

      {/* RIGHT */}
      <div className="right">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/contact" className="nav-item">Contact Us</Link>

        <FontAwesomeIcon
          icon={theme === "light" ? faMoon : faSun}
          size="lg"
          className="nav-icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        />

        <FontAwesomeIcon icon={faUser} size="lg" className="nav-icon" />

        <FontAwesomeIcon
          icon={faRightFromBracket}
          size="lg"
          className="nav-icon logout"
          onClick={() => {
            localStorage.setItem("isLoggedIn", "false");
            window.location.reload();
          }}
        />

      </div>

    </nav>
  );
};

export default DietNavbar;
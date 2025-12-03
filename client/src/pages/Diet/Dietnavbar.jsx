import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSun, faMoon, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "./Diet.css"

const DietNavbar = () => {

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <nav className="diet-navbar">

      {/* LEFT */}
      <div className="diet-left">
        <p className="diet-brand">FITFORGE</p>
      </div>

      {/* CENTER */}
      <div className="diet-center">
        <p className="diet-title">DIET PLANNER</p>
      </div>

      {/* RIGHT */}
      <div className="diet-right">

        <Link to="/" className="diet-nav-item">Home</Link>
        <Link to="/contact" className="diet-nav-item">Contact Us</Link>

       
        <FontAwesomeIcon
          icon={theme === "light" ? faMoon : faSun}
          size="lg"
          className="nav-icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        />
        <FontAwesomeIcon icon={faUser} size="lg" className="diet-icon" />

       

      </div>

    </nav>
  );
};

export default DietNavbar;
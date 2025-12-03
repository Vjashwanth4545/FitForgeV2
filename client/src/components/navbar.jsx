import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ setIsLoggedIn }) => {  // ✅ now received
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="navbar">
      <div className="title"><p>FitForge</p></div>

      <div className="left-navbar">
      <a
  style={{
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  }}
>
  Home
</a><a
  style={{
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    textDecoration:"none",
    color:"inherit"
  }}
  href='/contract'
  
>
  Contact Us
</a>
       
          

        <FontAwesomeIcon
          key={theme}
          icon={theme === "light" ? faMoon : faSun}
          size="2x"
          className="theme-toggle"
          onClick={toggleTheme}
        />

<FontAwesomeIcon
  className="profile"
  icon={faUser}
  size="3x"
  onClick={() => (window.location.href = "/profile")}
/>
        

  <div className="logout-wrapper">
  <FontAwesomeIcon 
    icon={faRightFromBracket} 
    size="2x" 
    className="logout-icon"
    onClick={() => {
      localStorage.setItem("isLoggedIn", "false");
      window.location.reload();  // instantly brings login modal
}}
  />
  <span className="logout-text">Logout</span>
</div>

      </div>
    </div>
  );
};

export default Navbar;
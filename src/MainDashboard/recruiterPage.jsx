import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./recruiterPage.css";

const RecruiterPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = (userType) => {
    navigate(`/login/${userType}`);
  };
  useEffect(() => {
    // Retrieve the saved color from local storage and apply it
    const savedColor = localStorage.getItem("bgColor");
    if (savedColor) {
      applyColor(savedColor);
    }
  }, []);
  const applyColor = (color) => {
    const darkenColor = (color, amount) => {
      let colorInt = parseInt(color.slice(1), 16);
      let r = (colorInt >> 16) + amount;
      let g = ((colorInt >> 8) & 0x00ff) + amount;
      let b = (colorInt & 0x0000ff) + amount;

      r = Math.max(Math.min(255, r), 0);
      g = Math.max(Math.min(255, g), 0);
      b = Math.max(Math.min(255, b), 0);

      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
    };

    const hoverColor = darkenColor(color, -30);

    document.documentElement.style.setProperty("--Bg-color", color);
    document.documentElement.style.setProperty("--button-color", color);
    document.documentElement.style.setProperty("--button-hover-color", hoverColor);
    document.documentElement.style.setProperty("--hover-effect", hoverColor);
    document.documentElement.style.setProperty("--filter-color", color);
  };

  return (
    <div className="recpage-mainDashboard-div">
      <div className="recpage-main-clouds"></div>
      <div className="recpage-pricing-plan">
        <div className="recpage-square-box">
          <div className="recpage-content">
            <h1 style={{color:"#c40b0b"}}>Recruiter</h1>
            <button
              className="recpage-login"
              onClick={() => handleLoginClick("Recruiters")}
            >
              Login
            </button>
          </div>
        </div>
        <div className="recpage-square-box">
          <div className="recpage-content">
            <h1 style={{color:"#c40b0b"}}>Team Leader</h1>
            <button
              className="recpage-login"
              onClick={() => handleLoginClick("TeamLeader")}
            >
              Login
            </button>
          </div>
        </div>
        <div className="recpage-square-box">
          <div className="recpage-content">
            <h1 style={{color:"#c40b0b"}}>Manager</h1>
            <button
              className="recpage-login1"
              onClick={() => handleLoginClick("Manager")}
            >
              Login
            </button>
          </div>
        </div>
        <div className="recpage-square-box">
          <div className="recpage-content">
            <h1 style={{color:"#c40b0b"}}>Super User</h1>
            <button
              className="recpage-login1"
              onClick={() => handleLoginClick("SuperUser")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterPage;

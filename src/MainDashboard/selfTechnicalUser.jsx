import React from "react";
import { useNavigate } from "react-router-dom";
import "./recruiterPage.css";

const selfTechnicalUser = () => {
  const navigate = useNavigate();

  const handleLoginClick = (userType) => {
    navigate(`/login/${userType}`);
  };

  return (
    <div className="recpage-mainDashboard-div">
      <div className="recpage-main-clouds"></div>
      <div className="recpage-pricing-plan">
        <div className="recpage-square-box">
          <div className="recpage-content">
            <h1>Technical User</h1>
            <button
              className="recpage-login"
              onClick={() => handleLoginClick("TechnicalUser")}
            >
              Login
            </button>
          </div>
        </div>
        <div className="recpage-square-box">
          <div className="recpage-content">
            <h1>Manager</h1>
            <button
              className="recpage-login"
              onClick={() => handleLoginClick("Manager")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default selfTechnicalUser;

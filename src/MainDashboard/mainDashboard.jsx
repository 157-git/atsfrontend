
import React, { useEffect } from "react";
import "./mainDashboard.css";
import clouds from '../LogoImages/clouds.png';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleLogin = (userType) => {
    if (userType === "employee") {
      navigate("/employee-login");
    } else if (userType === "client") {
      navigate(`/employee-login/${userType}`);
    }
    else if (userType === "applicant") {
      navigate(`/employee-login/${userType}`);
    }
    else if (userType === "vendor") {
      navigate(`/employee-login/${userType}`);
    }
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
    <div className="mainDashboard-div">
      <div className="main-clouds"></div>
      <div className="pricing-plan">
        {[
          { title: "Client", userType: "client", buttonClass: "login" },
          { title: "Applicant", userType: "applicant", buttonClass: "login" },
          { title: "Employee", userType: "employee", buttonClass: "login1" },
          { title: "Vendor", userType: "vendor", buttonClass: "login1" },
        ].map((section) => (
          <div key={section.title} className="square-box">
            <div className="content">
              <h1>{section.title}</h1>
              <button
                className={section.buttonClass}
                onClick={() => handleLogin(section.userType)}
              >
                Login
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

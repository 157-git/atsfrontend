import React, { useEffect, useState } from "react";
import "../HomePage/homePage.css";
import clouds from "../LogoImages/clouds.png";
import world from "../LogoImages/world-select-new.svg";
import developerjob from "../LogoImages/developerjob.svg";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import ColorPicker from "./ColorPicker";

const HomePage = () => {
  // the showColor implemented instead of choose color by sahil karnekar date 14-11-2024
  const [showColor, setShowColor] = useState(false);
  const [bgColor, setBgColor] = useState("#ffcb9b");

  useEffect(() => {
    // Clear all local storage values
    localStorage.clear();
    console.log("Local storage cleared.");
  }, []);

  useEffect(() => {
    const savedColor = localStorage.getItem("selectedColor");
    if (savedColor) {
      setBgColor(savedColor);
    }
  }, []);

  const handleColorApplied = (color) => {
    setBgColor(color);
    localStorage.setItem("selectedColor", color);
    setShowColor(false); // Close the color picker modal when color is applied
  };

  const handleMouseEnter = () => {
    enterTimeout = setTimeout(() => {
      setShowColor(true);
    }, 300); // Delay in milliseconds
  };

  const handleMouseOut = () => {
    clearTimeout(enterTimeout); // Clear timeout if the mouse leaves before the delay
    setShowColor(false);
  };
  return (
    <div className="bigb">
      <div className="main-homepage-clouds">
        <video src="../"></video>
      </div>
      <div
        style={{
          position: "absolute",
          backgroundColor: `var(--Bg-color)`,
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="landing-content">
          <h1
            style={{
              fontFamily: "sans-serif",
              fontWeight: "700",
              fontSize: "50px",
              marginTop: "140px",
              marginRight: "20px",
            }}
          >
            <span
              style={{
                fontFamily: "inherit",
                fontWeight: "600",
                fontSize: "25px",
                color: "#c40b0b",
              }}
            >
              Sky's the limit, If you have
            </span>
          </h1>
          <div style={{ width: "50%", margin: "auto" }}>
            <h1
              style={{
                fontFamily: "inherit",
                fontWeight: "600",
                fontSize: "70px",
                textAlign: "center",
                color: "#c40b0b",
                zIndex: "1",
              }}
            >
              Recruiter's Gear
            </h1>
            <div
              className="landingbtn"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                paddingLeft: "5px",
                paddingRight: "80px",
                paddingTop: "20px",
              }}
            >
            <Link to="/Main-Dashboard">
                <button className="main-homepage-btn">Let's begin</button>
              </Link>
            </div>
          </div>
          <div
            className="Choose-color-container"
          >
            <button className="Choose-Color-Btn" onClick={()=>setShowColor(true)}>
    <i className="fa-solid fa-chevron-right"></i>
    <span>Choose Color</span>
  </button>
          </div>
        </div>
      </div>
      {showColor && (
        <div
          className="bg-black bg-opacity-50 modal show"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            width: "100%",
            height: "100vh",
          }}
        >
          <Modal.Dialog
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Modal.Body>
              <ColorPicker onColorApplied={handleColorApplied} 
              setShowColor={setShowColor}
              />
            </Modal.Body>
          </Modal.Dialog>
        </div>
      )}
    </div>
  );
};
export default HomePage;

import React, { useEffect, useState } from "react";
import "../HomePage/homePage.css";
// import clouds from "../LogoImages/clouds.png";
import world from "../LogoImages/world-select-new.svg";
import developerjob from "../LogoImages/developerjob.svg";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import ColorPicker from "./ColorPicker";
import siteLogo from "../assets/rgLogo.png";

const HomePage = () => {
  // the showColor implemented instead of choose color by sahil karnekar date 14-11-2024
  const [showColor, setShowColor] = useState(false);
  const [bgColor, setBgColor] = useState("#ffcb9b");

  // commented by sahil karnekar date 23-01-2025
  // useEffect(() => {
  //   // Clear all local storage values
  //   localStorage.clear();
  //   console.log("Local storage cleared.");
  // }, []);

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
          <div className="langingcontentsecond">
            {/* <h1
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
            </h1> */}
            <div className="maindivlandingpage">
              <div className="siteLogoDivFlex">
                <img src={siteLogo} alt="" className="logoimagelandingpage" />
              </div>

              {/* <div
              className="landingbtn"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                paddingLeft: "5px",
                paddingRight: "80px",
                paddingTop: "20px",
              }}
            > */}
              <div className="linkdiv">
                <Link to="/Main-Dashboard">
                  <button className="main-homepage-btn">Let's begin</button>
                </Link>
              </div>
              <div className="tagline">
                <p className="taglineDesc">
                  Like a superhero needs their suit, you need Recruiter’s Gear
                  to boost hiring power!
                </p>
              </div>

              {/* </div> */}
            </div>
          </div>
          <div className="Choose-color-container">
            <button
              className="Choose-Color-Btn"
              onClick={() => setShowColor(true)}
            >
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
              <ColorPicker
                onColorApplied={handleColorApplied}
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

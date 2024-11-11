import React, { useState, useEffect } from "react";
import "./ColorPicker.css";

// SwapnilRokade_ColorPicker_adding_theame_color 11/09
// Utility function to darken or lighten a color
const adjustColorBrightness = (color, amount) => {
  let colorInt = parseInt(color.slice(1), 16);
  let r = (colorInt >> 16) + amount;
  let g = ((colorInt >> 8) & 0x00ff) + amount;
  let b = (colorInt & 0x0000ff) + amount;

  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

const ColorPicker = ({ onColorApplied , setShowColor}) => {
  const [value, setValue] = useState(50);
  const [bgColor, setBgColor] = useState("");
  



  useEffect(() => {
    const savedColor = localStorage.getItem("selectedColor");
    if (savedColor) {
      setBgColor(savedColor);
      applyColor(savedColor);
    }
  }, []);



  const handleColorClick = (color) => {
    localStorage.setItem("selectedColor", color);
    setBgColor(color);
    applyColor(color);
    onColorApplied(color);
    console.log("completed");
    
  };

// Arshad Attar Added This, 29-10-2024
// new function to set defult color
  const handleSetDefaultColor = () => {
    localStorage.removeItem("selectedColor");
    localStorage.removeItem("bgColor");
    localStorage.removeItem("buttonColor");
    localStorage.removeItem("hoverColor");
    localStorage.removeItem("hover-effect");

    document.documentElement.style.setProperty("--Bg-color", "#ffe5b5");
    document.documentElement.style.setProperty("--button-color", "#ffcb9b"); 
    document.documentElement.style.setProperty("--button-hover-color", "white"); 
    document.documentElement.style.setProperty("--text-color", "gray"); 
    document.documentElement.style.setProperty("--text-hover-color", "#ffb281"); 
    document.documentElement.style.setProperty("--heading-text-color", "gray"); 
    document.documentElement.style.setProperty("--button-hover-text-color", "#ffb281"); 
    document.documentElement.style.setProperty("--hover-effect", "#ffcb9b"); 
    document.documentElement.style.setProperty("--filter-color", "#ffcb9b"); 
    document.documentElement.style.setProperty("-dailyWork-btn", "#ffcb9b"); 
    handleClose()

  };
  const applyColor = (color) => {
    const originalColor = color;
    const buttonColor = colorMapping[color][0];
    const hoverColor = colorMapping[color][1];

    document.documentElement.style.setProperty("--Bg-color", originalColor);
    document.documentElement.style.setProperty("--button-color", buttonColor);
    document.documentElement.style.setProperty("--button-hover-color", "white");
    // sidebar hover effect final 
    document.documentElement.style.setProperty("--hover-effect", hoverColor); 
    document.documentElement.style.setProperty("--text-hover-color", originalColor); 
    document.documentElement.style.setProperty("--button-text-color", "white");
    document.documentElement.style.setProperty("--button-border-color", "gray");
    document.documentElement.style.setProperty("--button-bg-hover-color", "white");

    localStorage.setItem("bgColor", originalColor);
    localStorage.setItem("buttonColor", buttonColor);
    localStorage.setItem("hoverColor", "white"); // maybe this is not usefull 
    localStorage.setItem("hover-effect", hoverColor); // sidebar hover effect final 

    setTimeout(() => {

      document.documentElement.style.setProperty("--Bg-color", originalColor);
      document.documentElement.style.setProperty("--button-color", buttonColor);
      document.documentElement.style.setProperty("--button-hover-color", "white");
      // sidebar hover effect final 
      document.documentElement.style.setProperty("--hover-effect", hoverColor); 
      document.documentElement.style.setProperty("--text-hover-color", originalColor); 
      document.documentElement.style.setProperty("--button-text-color", "white");
      document.documentElement.style.setProperty("--button-bg-hover-color", "white");
      document.documentElement.style.setProperty("--button-border-color", "gray");
    }, 10);
    
  };

  const handleClose = () => {
    setShowColor(false); 
  };

  const colorMapping = {
    // color c1  A1          B1         C1          D1          E1
    "#90e0ef": ["#00b4d8", "#48cae4", "#90e0ef", "#ade8f4", "#caf0f8"],
    "#9d4edd": ["#5a189a", "#7b2cbf", "#9d4edd", "#c77dff", "#e0aaff"],
    "#95d5b2": ["#52b788", "#74c69d", "#95d5b2", "#b7e4c7", "#d8f3dc"],
    "#ffb3c6": ["#fb6f92", "#ff8fab", "#ffb3c6", "#ffc2d1", "#ffe5ec"],
    "#f8ad9d": ["#f08080", "#f4978e", "#f8ad9d", "#fbc4ab", "#ffdab9"]
  };
  
  const gridSize = 10;
  const boxSize = 30;

  return (
    <div>
      <div>
        <div
          className="color-picker-main-div"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, ${boxSize}px)`,
          }}
        >
          {Object.keys(colorMapping).map((color, index) => (
            <div
              key={index}
              onClick={() => handleColorClick(color)}
              style={{
                width: boxSize,
                height: boxSize,
                backgroundColor: `${color}`,
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        <div className="defult-color-div">
        <button className="daily-tr-btn" onClick={handleSetDefaultColor}>
        Set Default Color
        </button>
        <button className="daily-tr-btn" onClick={handleClose}>
          Close
        </button>
      </div>
      </div>
    </div>
  );
};

export default ColorPicker;

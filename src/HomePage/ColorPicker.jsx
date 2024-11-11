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

  const applyColor = (color) => {
    const originalColor = color;
    const buttonColor = adjustColorBrightness(color, -30);
    const hoverColor = adjustColorBrightness(color, 50);

    document.documentElement.style.setProperty("--Bg-color", originalColor);
    document.documentElement.style.setProperty("--button-color", buttonColor);
    document.documentElement.style.setProperty(
      "--button-hover-color",
      hoverColor
    );
    document.documentElement.style.setProperty("--hover-effect", hoverColor);

    localStorage.setItem("bgColor", originalColor);
    localStorage.setItem("buttonColor", buttonColor);
    localStorage.setItem("hoverColor", hoverColor);
    localStorage.setItem("hover-effect", hoverColor);
  };

  const handleColorClick = (color) => {
    localStorage.setItem("selectedColor", color);
    setBgColor(color);
    applyColor(color);
    onColorApplied(color);
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

  const handleClose = () => {
    setShowColor(false); 
  };

  const segmentColors = [
    '#ffe5b5', '#f5d0c5', '#f9f1a5', '#d5e1df', '#ffdfba', '#c6e2e9', '#f7c8e0', '#f8c8dc',
    '#e4c2d1', '#ffdac1', '#FFFF9F', '#FECCB1', '#FFB6AD', '#7ECACA', '#FED0AF', '#CDA0CB',
    '#F7E7B3', '#B0CFB0', '#FFD9E4', '#BDC5EA', '#CCEFF1', '#DEEFC2', '#E9BDBE', '#89C8E6',
    '#BBACA5', '#f9d5e5', '#f3e0b0', '#d2c6f2', '#b4e0a4', '#e2b8c5', '#e8f4e6', '#c2d6f9',
    '#f6d6d3', '#c7e6f0', '#e5c1d4', '#e3f5c8', '#f4e2b1', '#d5b5f1', '#f0d8e7', '#c5e0d9',
    '#f2bfc6', '#e4e8f6', '#d7d2e3', '#f1e6b2', '#d4f4e1', '#f5b2d7', '#d6e2c3', '#f8c2e3',
    '#e0f3d5', '#d9c4e8', '#f5d0a8', '#c5e3f2', '#e6c4d7', '#f2e3c7', '#c6d8e3', '#e7c6b1',
    '#f4d2f1', '#c4f0b5', '#f7d4c9', '#d0e6f1', '#f3e1d6', '#d5d4f0', '#e3f2c8', '#c9e6d1',
    '#f1c7b5', '#e0c5f5', '#f5d1c4', '#d2f6c5', '#e4c3d9', '#f7e4b2', '#c9f3d6', '#e8b2c5',
    '#d5e2f0', '#f3d9b4', '#e2c7f4', '#c7e4d9', '#f8d1c8', '#d4f2e6', '#f5e0b3', '#d9c2e4',
    '#e3f4c9', '#f2b5d7', '#c5e1f3', '#f6d0a5', '#e3c6d5', '#d6f1b2', '#e4d9f0', '#c9e6f7',
    '#f5b2e0', '#e8c7f2', '#d5e6c4', '#f3e2b1', '#d9f2d4', '#e1c8f4', '#f4b9d6', '#c5f2e4',
    '#e7d4c3', '#f5c1e3', '#d2e0f5', '#f1d6c9', '#c6f3d7', '#e5c8f1', '#f7d2b4', '#c9e5f0',
    '#e4c5d7', '#f6d8c4', '#d5f3e1', '#e1c7f5', '#f5b9d2', '#d9e6c5', '#f2c1e8', '#c4f0d6',
    '#e7b2f5', '#d5f1c9', '#f4e0b6', '#e3c6d9', '#f6d6d3', '#c7e6f0', '#e5c1d4', '#f9f1a5'
  ];
  
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
          {segmentColors.map((color, index) => (
            <div
              key={index}
              onClick={() => handleColorClick(color)}
              style={{
                width: boxSize,
                height: boxSize,
                backgroundColor: color,
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

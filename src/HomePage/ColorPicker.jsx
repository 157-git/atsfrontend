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

  const colorMapping = {

    // Extra comment by Arshad 12-11-2024


              // A1 - Button Bg color
              // A2 - button border 
              // A3 - button text color
              // A4 - button bg color after hover
              // A5 - button text color after hover

              // A6 - side Bar & header bg color
              // A7 - side Bar & header text color 
              // A8 - side Bar options bg color after hover
              // A9 - side Bar options text color after hover

              // A10 - table heading bg color 
              // A11 - table heading text color
              // A12 - tooltip bg color 
              // A13 - tooltip text color

              // A14 - filter option bg color
              // A15 - filter options text color 
              // A16 - filter options bg color after hover 
              // A17 - filter options text color aftre hover 

              // A18 - jd filter option bg color
              // A19 - jd filter options text color 
              // A20 - jd filter options bg color after hover 
              // A21 - jd filter options text color aftre hover 
              // A23 - jd info card bg color 
              // A24 - jd info card text color  
              // A25 - icon color ( For Dark them )
              // A26 - icon color ( for Light them )


       //c1        //A1        //B1       //c1      //D1        //E1
      "#ffb3e6": ["#ff80cc", "#ff66b3", "#ff3385", "#ff0066", "#e6004c"], // Pastel Pink
      "#c2f0c2": ["#99e699", "#66e066", "#33d633", "#00cc00", "#00b300"], // Pastel Green
      "#cce7ff": ["#99c2ff", "#66b3ff", "#3399ff", "#007fff", "#0066cc"], // Pastel Blue
      "#ffffcc": ["#ffff99", "#ffff66", "#ffff33", "#ffff00", "#e6e600"], // Pastel Yellow
      "#e0ccff": ["#d0aaff", "#b780ff", "#9d56ff", "#7a2eff", "#5a00e6"], // Pastel Lavender
      "#ffcc99": ["#ff9966", "#ff6633", "#ff3300", "#e62e00", "#cc1a00"], // Pastel Peach
      "#ffb3b3": ["#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000"], // Pastel Coral
      "#d9f7ff": ["#99e6ff", "#66d9ff", "#33ccff", "#00b3ff", "#0099e6"], // Pastel Teal
      "#ffffb3": ["#ffff99", "#ffff66", "#ffff33", "#ffff00", "#e6e600"], // Pastel Lemon
      "#d0ffd0": ["#a3f7a3", "#72f472", "#49f049", "#28d828", "#00b300"], // Pastel Mint
      "#f1c6e7": ["#d79ad1", "#bf8cc0", "#a57fae", "#8e73a0", "#775f91"], // Pastel Lilac
      "#ffcc80": ["#ffb366", "#ff9933", "#ff6600", "#e64d00", "#cc3300"], // Pastel Orange
      "#d9b3d9": ["#b38cb3", "#996699", "#804d80", "#663366", "#4d1a4d"], // Pastel Plum
      "#b3f0f0": ["#80e6e6", "#66d9d9", "#33cccc", "#00b3b3", "#009999"], // Pastel Aqua
      "#ff9999": ["#ff6666", "#ff4d4d", "#ff3333", "#ff1a1a", "#e60000"], // Pastel Salmon
      "#b3b3b3": ["#999999", "#808080", "#666666", "#4d4d4d", "#333333"], // Pastel Charcoal
      "#f2c0d0": ["#e6a8b8", "#e08f9f", "#d87786", "#d15e6e", "#c74555"], // Pastel Rose
      "#c0a8b7": ["#a58a99", "#8c6e7a", "#705c5f", "#5c4b4b", "#493838"], // Pastel Brown
      "#f3e1f7": ["#dab9e2", "#d0a0cc", "#b886b7", "#a66da2", "#9c5495"], // Pastel Orchid
      "#d9f2d3": ["#a8e5a2", "#7fd68f", "#5bc47c", "#3bb568", "#20a353"], // Pastel Fern Green
      "#ffecb3": ["#ffd280", "#ffb84d", "#ff9e1a", "#e68a00", "#b37100"], // Pastel Mustard
      "#f6b3b3": ["#f28d8d", "#f26767", "#f14242", "#f01d1d", "#e50000"], // Pastel Salmon Red
      "#b2dff7": ["#80d2f1", "#66c2f1", "#33b9f1", "#009cf1", "#0088e0"], // Pastel Sky Blue
      "#9ee7c0": ["#7fdf97", "#5ada7b", "#3bc85f", "#1dbe44", "#00b52f"], // Pastel Jade Green
      "#dff5f2": ["#a3d8d6", "#7ac0c1", "#4ea9ad", "#2b9399", "#007c84"], // Pastel Cyan
      "#f5d3b2": ["#e6bf94", "#d8ab75", "#ca9e56", "#bc9147", "#b38438"], // Pastel Apricot
      "#d0fff6": ["#9fded8", "#7ec7b9", "#5db09a", "#3d9a7b", "#1c8464"], // Pastel Seafoam
      "#f2e4d5": ["#e6d3b4", "#d9c295", "#cfa376", "#bc9147", "#b38438"], // Pastel Cream
      "#99e6a6": ["#66e59b", "#33e590", "#00e585", "#00cc73", "#00b362"], // Pastel Mint Green
      "#f1c8b2": ["#e8b08e", "#e17a6a", "#d95346", "#d42d22", "#d41100"], // Pastel Sunburst
      "#aad3e6": ["#8ec0d3", "#75b0c2", "#5c99b0", "#46818f", "#316a6f"], // Pastel Ice Blue
      "#f2e5c7": ["#e6d59d", "#d9c273", "#ccaa49", "#bf9f2f", "#b49315"], // Pastel Light Yellow
      "#d6c8ea": ["#b8a8e2", "#9b88da", "#8e6fd2", "#7f4fc2", "#703fcf"], // Pastel Purple
      "#c2e1c2": ["#99d699", "#66cc66", "#33b833", "#00a300", "#008000"], // Pastel Grass Green
      "#f2c6a1": ["#e6af7e", "#d99a5a", "#cc8549", "#bf7038", "#b45b27"], // Pastel Pumpkin
      "#b4e4d5": ["#99d4c8", "#7ab4ba", "#609da7", "#497f93", "#34677f"], // Pastel River Blue
      "#f0dfdf": ["#e3c9c9", "#d5b3b3", "#c79d9d", "#b88888", "#ab7272"], // Pastel Pink-Red
      "#e2f5d0": ["#c8f2a3", "#a2ef7d", "#80ec57", "#5fe431", "#3be20b"], // Pastel Spring Green
      "#f2b6a0": ["#e89c7d", "#e07a5a", "#d85837", "#d13714", "#d11b00"], // Pastel Coral Red
      "#8cc5a1": ["#74b183", "#5a9c66", "#478f4a", "#347a2f", "#216520"], // Pastel Sage Green
      "#f2b8b8": ["#e7a2a2", "#dd8c8c", "#d57676", "#d05f5f", "#cc4949"], // Pastel Rosy Pink
      "#d1e3d8": ["#a2d6bb", "#7dbf9f", "#5ab87c", "#40b05a", "#28a237"], // Pastel Forest Green
      "#c0f0f1": ["#a3e3e6", "#7bd7da", "#53cbd0", "#30c0c6", "#1ea5b9"], // Pastel Arctic Blue
      "#f5ddff": ["#e8c7e6", "#dbadd5", "#d093c4", "#c57baf", "#b5639f"], // Pastel Lavender Pink
      "#e1efb5": ["#b7e58a", "#9de572", "#84df5b", "#6cda44", "#54d42f"], // Pastel Olive Green
      "#d5b2f4": ["#c69ef0", "#b98aed", "#aa76e9", "#9b62e6", "#8d4ee3"], // Pastel Violet
      "#ff8fab": ["#ffe5ec", "#ffc2d1", "#ff8fab", "#ff8fab", "#fb6f92"],
      "#A594F9": ["#F5EFFF", "#E5D9F2", "#CDC1FF"],
      "#A6B37D": ["#FEFAE0", "#A6B37D", "#B99470"],
      "#9CA986": ["#C9DABF", "#9CA986", "#5F6F65"],
      "#31511E": ["#1A1A19", "#859F3D", "#F5F5DC"],
      "#dfc4b2": ["#d7a685", "#d5b7a4", "#dfc4b2", "#fafafa", "#fafafa"],
      "#2874f0": ["#1c5fbb", "#1e6ac4", "#1f76d6", "#1f81e7", "#2076d0"],
      "#db4437": ["#c1342e", "#c14234", "#e72e2c", "#e63d33", "#c6302a"],
      "#00b2e3": ["#00a0c4", "#0092ad", "#00859c", "#00778b", "#006679"],
      "#00a859": ["#008b4a", "#007b42", "#006b3b", "#005b33", "#004a2c"],
      "#ff9900": ["#e68a00", "#d57a00", "#c36b00", "#b25c00", "#a14d00"],
      "#4285f4": ["#357ae8", "#306ac5", "#275ba1", "#1e4d7d", "#153f59"],
      "#0077b5": ["#00679e", "#00578f", "#004780", "#003771", "#002963"],
      "#f5639d": ["#e3568e", "#d84e7e", "#c8486e", "#b5415e", "#a03a4e"]
  };
  
  console.log(colorMapping);
  
  const gridSize = 10;
  const boxSize = 30;

  const handleClose = () => {
    setShowColor(false); 
  };

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

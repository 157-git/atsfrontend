import React, { useState, useEffect } from "react";
import "./ColorPicker.css";
import { WhatsAppOutlined } from "@ant-design/icons";

const ColorPicker = ({ onColorApplied , setShowColor}) => {
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
  // Clear specific items from localStorage
  localStorage.removeItem("selectedColor");
  localStorage.removeItem("bgColor");
  localStorage.removeItem("buttonColor");
  localStorage.removeItem("hoverColor");
  localStorage.removeItem("hover-effect");

  // Array of color variables to clear
  const colors = [
    { variable: "--primary-bg-color" },
    { variable: "--secondary-bg-color" },
    { variable: "--ternary-bg-color" },
    { variable: "--primary-txt-color" },
    { variable: "--secondary-txt-color" },
    { variable: "--disable-txt-color" },
    { variable: "--error-txt-color" },
    { variable: "--success-txt-color" },
    { variable: "--link-txt-color" },
    { variable: "--icon-color" },
    { variable: "--active-icon" },
    { variable: "--disable-icons" },
    { variable: "--primary-button-bg" },
    { variable: "--primary-button-hover" },
    { variable: "--secondary-button-bg" },
    { variable: "--secondary-button-hover" },
    { variable: "--button-txt-color" },
    { variable: "--button-txt-hover-color" },
    { variable: "--table-bg-color" },
    { variable: "--table-header-txt" },
    { variable: "--table-body-txt" },
    { variable: "--table-row-hover" },
    { variable: "--table-row-selected" },
    { variable: "--tooltip-bg" },
    { variable: "--tooltip-txt" },
    { variable: "--sidebar-bg" },
    { variable: "--sidebar-txt" },
    { variable: "--sidebar-txt-hover" },
    { variable: "--sidebar-active-item-bg" },
    { variable: "--sidebar-submenu-bg" },
    { variable: "--icons-txt-hover" },
    { variable: "--card-or-button-hover-bg" },
    { variable: "--primary-border" },
    { variable: "--hover-border" },
    { variable: "--overlay-bg" },
    { variable: "--modal-bg" },
    { variable: "--modal-txt" },
    { variable: "--accent-color-1" },
    { variable: "--accent-color-2" },
    { variable: "--filter-button-txt" },
  ];

  // Loop through and clear localStorage for each variable
  colors.forEach(({ variable }) => {
    localStorage.removeItem(variable);
  });

  localStorage.setItem("--sidebar-bg","#ffe5b5")

  // Set default styles
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


  document.documentElement.style.setProperty("--primary-button-bg", "#ffcb9b");
  document.documentElement.style.setProperty("--primary-button-hover", "white");
  document.documentElement.style.setProperty("--button-txt-color", "white");
  document.documentElement.style.setProperty("--button-txt-hover-color", "#ffb281");
  document.documentElement.style.setProperty("--active-icon", "green");
  document.documentElement.style.setProperty("--table-header-txt", "gray");
  document.documentElement.style.setProperty("--table-body-txt", "gray");
  document.documentElement.style.setProperty("--table-header-txt", "gray");
  document.documentElement.style.setProperty("--table-row-hover", "#e6e6e6");
  document.documentElement.style.setProperty("--tooltip-bg", "#ffe5b5");
  document.documentElement.style.setProperty("--tooltip-txt", "gray");
  document.documentElement.style.setProperty("--sidebar-bg", "#ffe5b5");
  document.documentElement.style.setProperty("--sidebar-txt", "gray");
  document.documentElement.style.setProperty("--sidebar-txt-hover", "gray");
  document.documentElement.style.setProperty("--sidebar-active-item-bg", "#ffcb9b");
  document.documentElement.style.setProperty("--primary-border", "gray");
  document.documentElement.style.setProperty("--filter-button-txt", "#ffe5b5");
  document.documentElement.style.setProperty("--accent-color-2", "#ffe5b5");




  // Close the modal or handle UI update
  handleClose();
};


  const applyColor = (color) => {
    const originalColor = color;

// defining colors here
const primaryBgColor = colorMapping[color][0];
const secondaryBgColor = colorMapping[color][1];
const ternaryBgColor = colorMapping[color][2];
const primaryTxtColor = colorMapping[color][3];
const secondaryTxtColor = colorMapping[color][4];
const desableTxtColor = colorMapping[color][5];
const errorTxtColor = colorMapping[color][6];
const successTxtColor = colorMapping[color][7];
const linkTxtColor = colorMapping[color][8];
const iconColor = colorMapping[color][9];
const activeIcon = colorMapping[color][10];
const desableIcons = colorMapping[color][11];


// primary button 
const primaryButtonBackground = colorMapping[color][12];
const primaryButtonHover = colorMapping[color][13];

// secondary button
const secondaryButtonBackground = colorMapping[color][14];
const secondaryButtonHover = colorMapping[color][15];

// button text color
const buttonTxtColor = colorMapping[color][16];
const buttonTxtHoverColor = colorMapping[color][17];

// tables
const tableBackground = colorMapping[color][18];
const tableHeaderTxt = colorMapping[color][19];
const tableBodyTxt = colorMapping[color][20];
const tableRowHover = colorMapping[color][21];
const tableRowSelected = colorMapping[color][22];
const toolTipBackground = colorMapping[color][23];
const toolTipTxt = colorMapping[color][24];

// sidebar
const sidebarBackground = colorMapping[color][25];
const sidebarTxt = colorMapping[color][26];
const sidebarTxtHover = colorMapping[color][27];
const sidebarActiveItemBackground = colorMapping[color][28];
const sidebarSubmenuBackground = colorMapping[color][29];

// additional
const iconsTxtHover = colorMapping[color][30];
const cardOrButtonOrContainerBackgroundOver = colorMapping[color][31];

// borders
const primaryBorder = colorMapping[color][32];
const hoverBorder = colorMapping[color][33];

// overlay or modals

const overlayBackground = colorMapping[color][34];
const modalBackground = colorMapping[color][35];
const modalTxt = colorMapping[color][36];

// accent colors optional
const accentColor1 = colorMapping[color][37];
const accentColor2 = colorMapping[color][38];

// filters
const filterButtonsTxt = colorMapping[color][39];


    // const mainBg = colorMapping[color][5];
    document.documentElement.style.setProperty("--Bg-color", originalColor);


// implemented by sahil karnekar
// Define your colors here as per your example
console.log(primaryBgColor);

const colors = [
  { variable: "--primary-bg-color", value: primaryBgColor },
  { variable: "--secondary-bg-color", value: secondaryBgColor },
  { variable: "--ternary-bg-color", value: ternaryBgColor },
  { variable: "--primary-txt-color", value: primaryTxtColor },
  { variable: "--secondary-txt-color", value: secondaryTxtColor },
  { variable: "--disable-txt-color", value: desableTxtColor },
  { variable: "--error-txt-color", value: errorTxtColor },
  { variable: "--success-txt-color", value: successTxtColor },
  { variable: "--link-txt-color", value: linkTxtColor },
  { variable: "--icon-color", value: iconColor },
  { variable: "--active-icon", value: activeIcon },
  { variable: "--disable-icons", value: desableIcons },
  { variable: "--primary-button-bg", value: primaryButtonBackground },
  { variable: "--primary-button-hover", value: primaryButtonHover },
  { variable: "--secondary-button-bg", value: secondaryButtonBackground },
  { variable: "--secondary-button-hover", value: secondaryButtonHover },
  { variable: "--button-txt-color", value: buttonTxtColor },
  { variable: "--button-txt-hover-color", value: buttonTxtHoverColor },
  { variable: "--table-bg-color", value: tableBackground },
  { variable: "--table-header-txt", value: tableHeaderTxt },
  { variable: "--table-body-txt", value: tableBodyTxt },
  { variable: "--table-row-hover", value: tableRowHover },
  { variable: "--table-row-selected", value: tableRowSelected },
  { variable: "--tooltip-bg", value: toolTipBackground },
  { variable: "--tooltip-txt", value: toolTipTxt },
  { variable: "--sidebar-bg", value: sidebarBackground },
  { variable: "--sidebar-txt", value: sidebarTxt },
  { variable: "--sidebar-txt-hover", value: sidebarTxtHover },
  { variable: "--sidebar-active-item-bg", value: sidebarActiveItemBackground },
  { variable: "--sidebar-submenu-bg", value: sidebarSubmenuBackground },
  { variable: "--icons-txt-hover", value: iconsTxtHover },
  { variable: "--card-or-button-hover-bg", value: cardOrButtonOrContainerBackgroundOver },
  { variable: "--primary-border", value: primaryBorder },
  { variable: "--hover-border", value: hoverBorder },
  { variable: "--overlay-bg", value: overlayBackground },
  { variable: "--modal-bg", value: modalBackground },
  { variable: "--modal-txt", value: modalTxt },
  { variable: "--accent-color-1", value: accentColor1 },
  { variable: "--accent-color-2", value: accentColor2 },
  { variable: "--filter-button-txt", value: filterButtonsTxt },
];

// Set CSS variables dynamically
colors.forEach(({ variable, value }) => {
  document.documentElement.style.setProperty(variable, value);
  localStorage.setItem(variable, value);
});

    localStorage.setItem("bgColor", originalColor);

    setTimeout(() => {
      document.documentElement.style.setProperty("--Bg-color", originalColor);


      colors.forEach(({ variable, value }) => {
        document.documentElement.style.setProperty(variable, value);
      });
    }, 10);
  };
  const colorMapping = {

    // comments from sahil
    // E1 is Primary Main Color Background
    // E1 is Secondary Background


        //Whatspp       
       "#ece5dd": [
        "#81C784", "#388E3C", "#33d633", "#00cc00", "#00b300", "#99e699", "#66e066", "#33d633", "#00cc00", "#00b300",
        "green", "#66e066", "#f0f2f5", "#ffffff", "#00b300", "#99e699", "#54656f", "#33d633", "#00cc00", "black",
        "gray", "#dcf8c6", "#33d633", "#128c7e", "#ffffff", "#f0f2f5", "black", "#99e699", "#128c7e", "#00b300",
        "#66e066", "#33d633", "#00cc00", "#00b300", "#99e699", "#66e066", "#33d633", "#00b300","#ffffff","#128c7e"
      ],

       "#CDC1FF": [
        "#00b3e6", "#0099cc", "#0080b3", "#474d6a", "#004d80", "#00b3e6", "#0099cc", "#0080b3", "#006699", "#004d80",
        "green", "#0099cc", "#c2b7fb", "#ffffff", "#004d80", "#00b3e6", "#ffffff", "#0080b3", "#006699", "black",
        "gray", "#f1edf8", "#0080b3", "#A594F9", "black", "#CDC1FF", "gray", "black", "#9987f8", "#004d80",
        "#0099cc", "#0080b3", "black", "#004d80", "#00b3e6", "#0099cc", "#0080b3", "#004d80","#CDC1FF","#A594F9"
      ],
      //  "#181818": [
      //   "#007BFF", "#FFFFFF", "#181818", "#B0B0B0", "#121212", "#1E1E1E", "#007BFF", "#FFFFFF", "#181818", "#B0B0B0",
      //   "green", "#1E1E1E", "white", "#FFFFFF", "#181818", "#B0B0B0", "#121212", "#1E1E1E", "#007BFF", "#FFFFFF",
      //   "#181818", "#B0B0B0", "#121212", "#1E1E1E", "#007BFF", "#FFFFFF", "#181818", "#FFFFFF", "#121212", "#1E1E1E",
      //   "#007BFF", "#FFFFFF", "#181818", "#B0B0B0", "#121212", "#1E1E1E", "#007BFF", "#FFFFFF","black","black"
      // ],
      // "#007BFF": [
      //   "#0056b3", "#003d80", "#001f40", "#001020", "#000810", "#0056b3", "#003d80", "#001f40", "#001020", "#000810",
      //   "green", "#003d80", "#001f40", "#001020", "#000810", "#0056b3", "#003d80", "#001f40", "#001020", "#000810",
      //   "#0056b3", "#003d80", "#001f40", "#001020", "#000810", "#007BFF", "#001f40", "#0056b3", "#001020", "#000810",
      //   "#003d80", "#001f40", "#001020", "#000810", "#0056b3", "#003d80", "#001f40", "#000810","black","black"
      // ],
      "gray": [
        "#00b3e6", "#0099cc", "#0080b3", "#006699", "#004d80", "#00b3e6", "#0099cc", "#0080b3", "#006699", "#004d80",
        "green", "#0099cc", "#00b3e6", "#ffffff", "#004d80", "#00b3e6", "#ffffff", "gray", "#006699", "black",
        "gray", "#e6f9ff", "#0080b3", "#006699", "#ffffff", "#181818", "#ffffff", "#ffffff", "#006699", "#004d80",
        "#0099cc", "#0080b3", "black", "#004d80", "#00b3e6", "#0099cc", "#0080b3", "#004d80","gray","black"
      ],

     // pink 
      "#ffb3e6": [
        "#ff80cc", "#ff66b3", "#ff3385", "#ff0066", "#e6004c", "#ff80cc", "#ff66b3", "#ff3385", "#ff0066", "#e6004c",
        "green", "#ff66b3", "#ffffff", "#ffffff", "#e6004c", "#ff80cc", "black", "#ff99dd", "#ff0066", "black",
        "gray", "#ffe6f2", "#ff3385", "#ff99dd", "black", "#ffcce0", "gray", "black", "#ff99dd", "#e6004c",
        "#ff66b3", "#ff3385", "gray", "#e6004c", "#ff80cc", "#ff66b3", "#ff3385", "#e6004c","#ffb3e6","#ff99dd"
      ],
      // blue
      "#cce7ff": [
        "#99c2ff", "#66b3ff", "#3399ff", "#007fff", "#0066cc", "#99c2ff", "#66b3ff", "#3399ff", "#007fff", "#0066cc",
        "green", "#66b3ff", "#ffffff", "#ffffff", "#0066cc", "#99c2ff", "#66b3ff", "black", "#007fff", "black",
        "gray", "#e6f3ff", "#3399ff", "#007fff", "#ffffff", "#cce7ff", "gray", "black", "#dfccff", "#0066cc",
        "#66b3ff", "#3399ff", "#007fff", "#0066cc", "#99c2ff", "#66b3ff", "#3399ff", "#0066cc","#cce7ff","#cce7ff"
      ], 

      // yellow
      // "#ffffcc": [
      //   "#ffff99", "#ffff66", "#ffff33", "#ffff00", "#e6e600", "#ffff99", "#ffff66", "#ffff33", "#ffff00", "#e6e600",
      //   "green", "#ffff66", "#ffff80", "#ffffff", "#e6e600", "#ffff99", "gray", "black", "#ffff00", "black",
      //   "gray", "#ffff66", "#ffff33", "#ffff00", "black", "#ffffcc", "gray", "black", "#ffff80", "#e6e600",
      //   "#ffff66", "#ffff33", "gray", "#e6e600", "#ffff99", "#ffff66", "#ffff33", "#e6e600","#ffffcc","black"
      // ], 
      "#e0ccff": [
        //0            //1     //2          //3        //4        //5        //6        //7        //8        //9
        "#d0aaff", "#b780ff", "#9d56ff", "#7a2eff", "#5a00e6", "#d0aaff", "#b780ff", "#9d56ff", "#7a2eff", "#5a00e6",
        //10        //11        //12     //13      //14      //15        //16        //17      //18        //19
        "green", "#b780ff", "#ffffff", "#c299ff", "#5a00e6", "#d0aaff", "#b780ff", "black", "#7a2eff", "black",
        //20         //21       //22      //23      //24      //25        //26        //27      //28        //29
        "gray", "#efe6ff", "#9d56ff", "#7a2eff", "#ffffff", "#e0ccff", "#9d56ff", "black", "#be99ff", "#5a00e6",
        //30          //31       //32      //33      //34      //35        //36        //37    //38      //39
        "#b780ff", "#9d56ff", "#7a2eff", "#5a00e6", "#d0aaff", "#b780ff", "#9d56ff", "#5a00e6","#e0ccff","black"
      ], 
      // "#ffcc99": [
      //   "#ff9966", "#ff6633", "#ff3300", "#e62e00", "#cc1a00", "#ff9966", "#ff6633", "#ff3300", "#e62e00", "#cc1a00",
      //   "#ffcc99", "#ff6633", "#ff3300", "#e62e00", "#cc1a00", "#ff9966", "#ff6633", "#ff3300", "#e62e00", "#cc1a00",
      //   "#ff9966", "#ff6633", "#ff3300", "#e62e00", "#cc1a00", "#ffcc99", "#ff3300", "#ff9966", "#e62e00", "#cc1a00",
      //   "#ff6633", "#ff3300", "#e62e00", "#cc1a00", "#ff9966", "#ff6633", "#ff3300", "#cc1a00","black","black"
      // ],
      // "#F4C2C2": [
      //   "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
      //   "#ffb3b3", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
      //   "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ffb3b3", "#ff4d4d", "#ff8080", "#ff3333", "#e60000",
      //   "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","black","black"
      // ],
      // "#99ffbb": [
      //   "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
      //   "#ffb3b3", "#ff6666", "#80ff80", "#ffffff", "#e60000", "#ff8080", "#ffffff", "#80ff80", "#99ffbb", "black",
      //   "gray", "#ccffcc", "#ff4d4d", "#99ffbb", "#ffffff", "#99ffbb", "gray", "#ffffff", "#66ff66", "#e60000",
      //   "#ff6666", "#ff4d4d", "gray", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","black","black"
      // ],
    
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
            className="colorpickerthemes"
              key={index}
              onClick={() => handleColorClick(color)}
              style={{
                width: boxSize,
                height: boxSize,
                backgroundColor: `${color}`,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
              }}
              
            >{
              color === "#ece5dd" ? (
<>
<WhatsAppOutlined
style={{
  color:"green",
}}
/>
</>
              ) :(
                null
              )
            }
            
            </div>
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

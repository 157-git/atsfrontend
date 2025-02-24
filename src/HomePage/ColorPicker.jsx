import React, { useState, useEffect } from "react";
import "./ColorPicker.css";
import { WhatsAppOutlined } from "@ant-design/icons";

const ColorPicker = ({ onColorApplied , setShowColor}) => {
  const [bgColor, setBgColor] = useState("");
  const selectedColorHighlight = localStorage.getItem("selectedColor");
  useEffect(() => {
    const savedColor = localStorage.getItem("selectedColor");
    if (savedColor) {
      if (savedColor in colorMapping) {
        setBgColor(savedColor);
        applyColor(savedColor);
      }
   
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
    { variable: "--filter-button-txt" },
    { variable: "--profile-txt" },
    { variable: "--notification-icon-background" },
    { variable: "--notification-badge-background" },
    { variable: "--notification-icon-color" },
    { variable: "--notification-ribben-color" },
    { variable: "--active-button1-bg" },
    { variable: "--selected-form-bg" },
    
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
  document.documentElement.style.setProperty("--table-header-bg", "#ffe5b5");
  document.documentElement.style.setProperty("--profile-txt", "black");
  document.documentElement.style.setProperty("--notification-icon-background", "black");
  document.documentElement.style.setProperty("--notification-badge-background", "red");
  document.documentElement.style.setProperty("--notification-icon-color", "gray");
  document.documentElement.style.setProperty("--notification-ribben-color", "#ffe5b5");
  document.documentElement.style.setProperty("--active-button1-bg", "#ffe5b5");
  document.documentElement.style.setProperty("--selected-form-bg", "#ffe5b5");




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
// table header row bg
const tableHeaderBackground = colorMapping[color][40];
// profile txt
const profileTxt = colorMapping[color][41];

// notification icon background
const notificationIconBackground = colorMapping[color][42];
const notificationBadgeBackground = colorMapping[color][43];
const notificationIconColor = colorMapping[color][44];
const notificationRibbenColor = colorMapping[color][45];
const activeButton1BackgroundColor = colorMapping[color][46];
const selectedComponentFormBackground = colorMapping[color][47];


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
  { variable: "--table-header-bg", value: tableHeaderBackground },
  { variable: "--profile-txt", value: profileTxt },
  { variable: "--notification-icon-background", value: notificationIconBackground },
  { variable: "--notification-badge-background", value: notificationBadgeBackground },
  { variable: "--notification-icon-color", value: notificationIconColor },
  { variable: "--notification-ribben-color", value: notificationRibbenColor },
  { variable: "--active-button1-bg", value: activeButton1BackgroundColor },
  { variable: "--selected-form-bg", value: selectedComponentFormBackground },
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


        
    
      "#27374D": [
        "#27374D", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
        "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "#27374D", "#9DB2BF", "white",
        "gray", "#f0f3f5", "#ff4d4d", "#9db2bf", "#ffffff", "#526D82", "white", "#ffffff", "#27374D", "#e60000",
        "#ff6666", "#ff4d4d", "gray", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#27374D","#27374D",
        "#9DB2BF","white","white","#c80036","#27374D","#27374D","#eef2f6","#eef2f6"
      ],
      // "#3C4B5E": [
      //   "#3C4B5E", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
      //   "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "white",
      //   "gray", "#f0f3f5", "#ff4d4d", "#9db2bf", "#ffffff", "#677382", "white", "#ffffff", "#27374D", "#e60000",
      //   "#ff6666", "#ff4d4d", "gray", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#27374D","#27374D",
      //   "#9DB2BF","white","white","#c80036","#3C4B5E","#3C4B5E"
      // ],
      "#769FCD": [
        "#769FCD", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
        "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
        "gray", "#f0f3f5", "#ff4d4d", "#D6E6F2", "black", "#B9D7EA", "black", "black", "#ffffff", "#e60000",
        "#ff6666", "#ff4d4d", "#769FCD", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#769FCD","#27374D",
        "#D6E6F2", "#ffffff","white","#c80036","#769FCD","#769FCD","#ecf2f8","#dae5f1"
      ],
      "#493628": [
        "#493628", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
        "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
        "gray", "#f6f2ef", "#ff4d4d", "#D6C0B3", "black", "#AB886D", "white", "black", "#ffffff", "#e60000",
        "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#493628","#27374D",
        "#D6C0B3", "#ffffff", "white","#c80036","#493628","#493628","#f6f2ef","#f6f2ef"
      ],
      "#F6BF9F": [
        "#F6BF9F", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
        "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
        "gray", "#f6f2ef", "#ff4d4d", "#FDF2EB", "black", "#FADFCF", "black", "black", "#ffffff", "#e60000",
        "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#F6BF9F","#27374D",
        "#FDF2EB", "black","white","#c80036","#F6BF9F","#F6BF9F","#fdefe8","#fdefe8"
      ],
      "#6F325B": [
        "#6F325B", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
        "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
        "gray", "#f6f2ef", "#ff4d4d", "#C9B2C1", "black", "#936684", "white", "black", "#ffffff", "#e60000",
        "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#936684","#27374D",
        "#C9B2C1", "white","white","#c80036","#6F325B","#6F325B","#f7edf4","#f7edf4"
      ],
      "#191304": [
        "#191304", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
        "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "white",
        "gray", "#f2f2f2", "#ff4d4d", "#7F7F7F", "white", "#323232", "white", "black", "#ffffff", "#e60000",
        "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#323232","#27374D",
        "#7F7F7F", "white","white","#c80036","black","#191304","#fbf6e9","#fbf6e9"
      ],
      // "#4A62BA": [
      //   "#4A62BA", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
      //   "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
      //   "gray", "#f2f2f2", "#ff4d4d", "#CBDCEB", "black", "#608BC1", "white", "black", "#ffffff", "#e60000",
      //   "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#4A62BA","#27374D",
      //   "#CBDCEB", "white","white","#c80036","black","#4A62BA"
      // ],
      "#545F54": [
        "#545F54", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
        "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "white",
        "gray", "#e4e7e4", "#ff4d4d", "#A9BFA8", "white", "#A9BFA8", "white", "black", "#ffffff", "#e60000",
        "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#A9BFA8","#27374D",
        "#A9BFA8", "white","white","#c80036","#545F54","#545F54","#f1f3f1","#f1f3f1"
      ],
      "#413F42": [
        "#413F42", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
        "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
        "gray", "#e6e5e6", "#ff4d4d", "#b3b2b3", "black", "#686469", "white", "black", "#ffffff", "#e60000",
        "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#b3b2b3","#27374D",
        "#b3b2b3", "white","white","#c80036","#413F42","#413F42","#f2f2f3","#e6e5e6"
      ],
      // "#5b585c": [
      //   "#5b585c", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
      //   "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
      //   "gray", "#e6e5e6", "#ff4d4d", "#D9D8D9", "black", "#8D8B8D", "white", "black", "#ffffff", "#e60000",
      //   "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#b3b2b3","#27374D",
      //   "#D9D8D9", "white","white","#c80036","#5b585c","#5b585c"
      // ],
      // "#393e46": [
      //   "#393e46", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
      //   "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
      //   "gray", "#e6e5e6", "#ff4d4d", "#D9D8D9", "black", "#5b6370", "white", "black", "#ffffff", "#e60000",
      //   "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#c3c5c7","#27374D",
      //   "#c3c5c7", "white","white","#c80036","#393e46","#393e46"
      // ],
      // "#4C5158": [
      //   "#4C5158", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
      //   "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
      //   "gray", "#e6e5e6", "#ff4d4d", "#D9D8D9", "black", "#74777D", "white", "black", "#ffffff", "#e60000",
      //   "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#D9D8D9","#27374D",
      //   "#D9D8D9", "white","white","#c80036","#4C5158","#4C5158"
      // ],
      // "#FFE3E3": [
      //   "#FFE3E3", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
      //   "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
      //   "gray", "#e6e5e6", "#ff4d4d", "#ffe3e3", "black", "#FEF9F2", "black", "black", "#ffffff", "#e60000",
      //   "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#ffe3e3","#27374D",
      //   "#ffe3e3", "black","black","#c80036","white","#FFE3E3"
      // ],
      "#1F4529": [
        "#1F4529", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
        "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
        "gray", "#e6e5e6", "#ff4d4d", "#b8d0ae", "black", "#47663B", "white", "black", "#ffffff", "#e60000",
        "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#b8d0ae","#27374D",
        "#b8d0ae", "white","white","#c80036","#1F4529","#1F4529","#edf7f0","#edf7f0"
      ],
      // "#987D9A": [
      //   "#987D9A", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
      //   "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "white",
      //   "gray", "#e6e5e6", "#ff4d4d", "#BB9AB1", "white", "#BB9AB1", "white", "black", "#ffffff", "#e60000",
      //   "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#BB9AB1","#27374D",
      //   "#BB9AB1", "white","white","#c80036","#987D9A","#987D9A"
      // ],
      "#A59D84": [
        "#A59D84", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
        "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
        "gray", "#e6e5e6", "#ff4d4d", "#C1BAA1", "black", "#C1BAA1", "black", "black", "#ffffff", "#e60000",
        "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#C1BAA1","#27374D",
        "#C1BAA1", "white","white","#c80036","#A59D84","#A59D84","#f4f3f0","#e9e7e2"
      ],
      "#A79277": [
        "#A79277", "#ff6666", "#ff4d4d", "#ff3333", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#e60000",
        "#ffb3b3", "#ff6666", "#ffffff", "#ffffff", "#e60000", "#ff8080", "darkgray", "darkgray", "#9DB2BF", "black",
        "gray", "#e6e5e6", "#ff4d4d", "#EAD8C0", "black", "#D1BB9E", "black", "black", "#ffffff", "#e60000",
        "#ff6666", "#ff4d4d", "#493628", "#e60000", "#ff8080", "#ff6666", "#ff4d4d", "#e60000","#EAD8C0","#27374D",
        "#EAD8C0", "white" ,"white","#c80036","#A79277", "#A79277","#f5f3f0","#f5f3f0"
      ],
      // "#e0ccff": [
      //   //0            //1     //2          //3        //4        //5        //6        //7        //8        //9
      //   "#d0aaff", "#b780ff", "#9d56ff", "#7a2eff", "#5a00e6", "#d0aaff", "#b780ff", "#9d56ff", "#7a2eff", "#5a00e6",
      //   //10        //11        //12     //13      //14      //15        //16        //17      //18        //19
      //   "green", "#b780ff", "#ffffff", "#c299ff", "#5a00e6", "#d0aaff", "#b780ff", "black", "#7a2eff", "black",
      //   //20         //21       //22      //23      //24      //25        //26        //27      //28        //29
      //   "gray", "#efe6ff", "#9d56ff", "#7a2eff", "#ffffff", "#e0ccff", "#9d56ff", "black", "#be99ff", "#5a00e6",
      //   //30          //31       //32      //33      //34      //35        //36        //37    //38      //39
      //   "#b780ff", "#9d56ff", "#7a2eff", "#5a00e6", "#d0aaff", "#b780ff", "#9d56ff", "#5a00e6","#e0ccff","black",
      //   "#e0ccff","white","black","#c80036","white","#e0ccff"
      // ], 
      "#ece5dd": [
        "#81C784", "#388E3C", "#33d633", "#00cc00", "#00b300", "#99e699", "#66e066", "#33d633", "#00cc00", "#00b300",
        "green", "#66e066", "#f0f2f5", "#ffffff", "#00b300", "#99e699", "#54656f", "#33d633", "#00cc00", "black",
        "gray", "#dcf8c6", "#33d633", "#128c7e", "#ffffff", "#f0f2f5", "black", "white", "#128c7e", "#00b300",
        "#66e066", "#33d633", "#00cc00", "#00b300", "#99e699", "#66e066", "#33d633", "#00b300","#ffffff","#128c7e",
        "#ece5dd","black","#0b141a1a","#25D366","white","#25d366","#e6ffee","#ece5dd"
      ],
    };
  
  console.log(colorMapping);
  
  const gridSize = 6;
  const boxSize = 40;

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
                display: "grid",
                justifyContent: "center",
                alignContent:"center",
                border :    selectedColorHighlight && selectedColorHighlight === color && "1px solid black"
              }}
              
            >
              {
                selectedColorHighlight && selectedColorHighlight === color && (
                  
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>
                )
              }
              {
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
        <button className="daily-tr-btn" 
        // onClick={handleSetDefaultColor}
        onClick={() => handleColorClick("#27374D")}
        >
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

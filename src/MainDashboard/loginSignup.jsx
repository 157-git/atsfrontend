import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./LoginPage.css";
import LoginImage from "../LogoImages/LoginImge.jpg";
import ForgotPasswordForms from "./empForgotPasswords";
import { API_BASE_URL } from "../api/api";
import axios from "../api/api";



  //  sahil karnekar Worked on : - date 27 sep 2024
// Sahil Karnekar Added line num 8 to line num 77

const LoginSignup = ({ onLogin }) => {
  const { userType } = useParams();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [login, setLogin] = useState("");
  const navigate = useNavigate();

  // only functionality javascript code added by sahil karnekar dont use html code , html code is not styled or not applied any css
// please check the logic once 

// here is getting employeeId from localstorage and initially removing the id if present in localstorage

const localStrId = localStorage.getItem("employeeId");

if (localStrId) {
  localStorage.removeItem("employeeId");
}

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  useEffect(() => {
    const savedColor = localStorage.getItem("selectedColor");
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

  //old logic arshad comment this 03-10-2024
  // useEffect(() => {
  //   if (employeeId && userType) {
  //     fetch(`${API_BASE_URL}/fetch-pass-on-role/${employeeId}/${userType}`
  //     )
  //       .then((response) => response.text())
  //       .then((data) => {
  //         setLogin(data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   }
  // }, [employeeId, userType]);



  // sahil karnekar
// This is same method handlechange as previous just newly added validations from line num 30 to line num 50

const handleChange = (event) => {
  const { name, value } = event.target;

  // applied validations here for max length 20 char's
  if (name === "employeeId") {
    if (value.length > 20) { 
      setError("Username should not exceed 20 characters");
    } else {
      setError("");
      setEmployeeId(value);
    }
  } else if (name === "password") {
    if (value.length > 20) {
      setError("Password should not exceed 8 characters");
    } else {
      setError("");
      setPassword(value);
    }
  }
};


//old logic arshad comment this
// handle submit method for authenticate user by username and password from line num 53 to line num 77
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (!employeeId || !password) {
  //     setError("Please fill in both fields before submitting.");
  //     return;
  //   }

  //   try {
  //     if (login === password) {
  //       localStorage.setItem("employeeId", employeeId);
  //       navigate(`/Dashboard/${employeeId}/${userType}`);
  //       onLogin();
  //     } else {
  //       setError("Invalid login for this user. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching password:", error);
  //     setError("Error occurred. Please try again.");
  //   }
  // };

        
// handle submit method for authenticate user by username and password from line num 53 to line num 77
const handleSubmit = async (event) => {
  event.preventDefault();
  
  if (!employeeId || !password) {
    setError("Please fill in both fields before submitting.");
    return;
  }

  try {
    // statically added base url please change it according to you
    const response = await axios.get(`${API_BASE_URL}/fetch-pass-on-role/${employeeId}/${userType}`);
    const fetchedPassword = response.data;
  
    // authenticate user and navigating on Dashboard page with employeedId added in route
    if (fetchedPassword === password) {
      localStorage.setItem("employeeId", employeeId);
      navigate(`/Dashboard/${employeeId}/${userType}`);
    } else {
      setError("Invalid login for this user. Please try again.");
    }

  } catch (error) {
    console.error("Error during login:", error);
    setError("Error occurred. Please try again.");
  }
};


  return (
    <div className="main-body">
      <div className="main-login-container">
        <div className="main-loginpage-clouds"></div>
        <div
          className={`container22 ${showForgotPassword ? "full-width" : ""}`}
        >
          {!showForgotPassword && (
            <div className="left-panel" data-aos="fade-right">
              <img src={LoginImage} alt="Logo" className="logo" />
            </div>
          )}
          <div
            className={`${showForgotPassword ? "full-width-panel" : "right-panel"
              }`}
            data-aos="fade-left"
          >
            {showForgotPassword ? (
              <ForgotPasswordForms userType={userType} />
            ) : (
              <form onSubmit={handleSubmit}>
                <h2>{userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
                <div className="input-groups">
                  <i className="fas fa-user"></i>
                  <input type="text" id="loginpage-employeeId" name="employeeId"
                  placeholder="Username" className="loginpage-form-control" value={employeeId}
                  onChange={handleChange}  />
                </div>
                <div className="input-groups" hidden>
                  <i className="fas fa-briefcase"></i>
                  <input type="text" id="loginpage-userType" name="userType"
                   placeholder="User Type" className="loginpage-form-control" />
                </div>
                <div className="input-groups">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="loginpage-password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                    className="loginpage-form-control"
                  />
                </div>
                <div className="loginpage-error">{error}</div>
                <button
                  className="login-button"
                  type="submit"
                  data-aos="fade-top"
                >
                  Login  
                </button>
                <div className="acc-create-div">
                  <span
                    className="account-create-span"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password ?
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

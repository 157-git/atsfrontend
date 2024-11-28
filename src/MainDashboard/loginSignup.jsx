import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./LoginPage.css";
import LoginImage from "../LogoImages/LoginImge.jpg";
import ForgotPasswordForms from "./empForgotPasswords";
import { API_BASE_URL } from "../api/api";
import axios from "../api/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
//  sahil karnekar Worked on : - date 27 sep 2024
// Sahil Karnekar Added line num 8 to line num 77

const LoginSignup = ({ onLogin }) => {
  const { userType } = useParams();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); 
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
    document.documentElement.style.setProperty(
      "--button-hover-color",
      hoverColor
    );
    document.documentElement.style.setProperty("--hover-effect", hoverColor);
    document.documentElement.style.setProperty("--filter-color", color);
  };

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

  // handle submit method for authenticate user by username and password from line num 53 to line num 77
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!employeeId || !password) {
      setError("Please fill in both fields before submitting.");
      return;
    }
  
    try {
      const loginResponse = await axios.post(
        `${API_BASE_URL}/user-login-157/${userType}`,
        {
          userName: employeeId,
          employeePassword: password,
          tlPassword: password,
          managerPassword: password,
          superUserPassword: password,
        }
      );
  
      console.log("Response Status:", loginResponse.status);
   
  
      switch (loginResponse.status) {
        case 200:
          console.log("Login successful!");
          setEmployeeId(loginResponse.data.employeeId);
          localStorage.setItem("employeeId", loginResponse.data.employeeId);
          navigate(`/Dashboard/${loginResponse.data.employeeId}/${userType}`);
          break;
  
        case 403:
          console.log("403: Access denied. Invalid credentials.");
          setError("Access denied. Please check your credentials.");
          break;
  
        case 404:
          console.log("404: User not found.");
          setError("User not found. Please try again.");
          break;
  
        case 500:
          console.log("500: Server error.");
          setError("Server error. Please try again later.");
          break;
  
        default:
          console.log(`Unexpected status code: ${loginResponse.status}`);
          setError("Unexpected error. Please try again.");
      }
    } catch (error) {
      console.error("Error during login request:", error);
  

      if (error.response) {
 
        console.log("Error Response Status:", error.response.status);
        switch (error.response.status) {
          case 403:
            setError(`${userType} is already logged in`);
            break;
  
          case 404:
            setError(`${userType} not found. Please try again.`);
            break;
  
          case 500:
            setError("Server error. Please try again later.");
            break;
          
          case 401:
            setError("Invalid Credentials");
            break;

          case 402:
            setError("Payment not done, Please Contact Super User");
            break;
  
          default:
            setError("Unexpected error occurred.");
        }
      } else if (error.request) {

        console.log("No response received from the server.");
        setError("Network error. Please try again.");
      } else {
    
        console.log("Error setting up the request:", error.message);
        setError("An error occurred. Please try again.");
      }
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
            className={`${
              showForgotPassword ? "full-width-panel" : "right-panel"
            }`}
            data-aos="fade-left"
          >
            {showForgotPassword ? (
              <ForgotPasswordForms userType={userType} />
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Arshad Attar  , Added inline CSS For Headers As per requirement on 27-11-2024 */}
                {userType === "Recruiters" && <h2 style={{color:"gray",fontWeight:"bold"}}>Recruiter</h2>}
                {userType === "TeamLeader" && <h2 style={{color:"gray",fontWeight:"bold"}}>Team Leader</h2>}
                {userType === "Manager" && <h2 style={{color:"gray",fontWeight:"bold"}}>Manager</h2>}
                {userType === "SuperUser" && <h2 style={{color:"gray",fontWeight:"bold"}}>Super User</h2>}
                <div className="input-groups">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    id="loginpage-employeeId"
                    name="employeeId"
                    placeholder="User name"
                    className="loginpage-form-control"
                    value={employeeId}
                    onChange={handleChange}
                    style={{paddingLeft:"30px"}}
                  />
                </div>
                <div className="input-groups" hidden>
                  <i className="fas fa-briefcase"></i>
                  <input
                    type="text"
                    id="loginpage-userType"
                    name="userType"
                    placeholder="User Type"
                    className="loginpage-form-control"
                  />
                </div>
                <div className="input-groups">
                  <i className="fas fa-lock"></i>
                  <input
                  type={passwordVisible ? "text" : "password"}
                    id="loginpage-password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                    className="loginpage-form-control"
                    style={{paddingLeft:"30px"}}
                  />
                   <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    onClick={() => setPasswordVisible((prev) => !prev)} 
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color:"gray"
                    }}
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

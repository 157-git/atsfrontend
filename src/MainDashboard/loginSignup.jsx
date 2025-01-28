import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./LoginPage.css";
import LoginImage from "../LogoImages/LoginImge.jpg";
import ForgotPasswordForms from "./empForgotPasswords";
import { API_BASE_URL } from "../api/api";
import axios from "../api/api";
import { getSocket } from "../EmployeeDashboard/socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// added by sahil karnekar date 2-12-2024
import ForceLogout from "../LoginPage/ForceLogout";
import { initializeSocket } from "../EmployeeDashboard/socket";
import { getFormattedDateTime } from "../EmployeeSection/getFormattedDateTime";
//  sahil karnekar Worked on : - date 27 sep 2024
// Sahil Karnekar Added line num 8 to line num 77
const LoginSignup = ({ onLogin }) => {
  const { userType } = useParams();
  const [employeeId, setEmployeeId] = useState("");
  const [socket, setSocket] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  // this state is crearted by sahil karnekar date 29-11-2024 for display payment link
  const [displayPaymentLink, setDisplayPaymentLink] = useState(false);
  // added by sahil karnekar date 2-12-2024
  const [displayForcefullyLogout, setDisplayForcefullyLogout] = useState(false);
  const [displayForcefullyLogoutForm, setDisplayForcefullyLogoutForm] =
    useState(false);

  // only functionality javascript code added by sahil karnekar dont use html code , html code is not styled or not applied any css
  // please check the logic once

  // establishing socket for emmiting event
  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

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
 // CAPTCHA State
 const [captcha, setCaptcha] = useState("");
 const [userCaptcha, setUserCaptcha] = useState("");
 const [captchaError, setCaptchaError] = useState("");

 const canvasRef = useRef(null);

 // Generate a random CAPTCHA
 const generateCaptcha = () => {
   const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();  // Random 6 character string
   setCaptcha(randomString);
   setCaptchaError("");
 };

   //Abhijit Mehakar
 //12/12/2024
 //CAPCHA

 // Draw CAPTCHA on canvas
 const drawCaptcha = () => {
   const canvas = canvasRef.current;
   if (canvas) {
     const ctx = canvas.getContext("2d");
     ctx.clearRect(0, 0, canvas.width, canvas.height); 
     ctx.font = "30px Arial";
     ctx.fillStyle = "#000";
     ctx.fillText(captcha, 10, 30); // Draw CAPTCHA text
   }
 };

 useEffect(() => {
   generateCaptcha(); // Generate a new CAPTCHA on mount or user type change
 }, [userType]);

 useEffect(() => {
   drawCaptcha(); // Redraw CAPTCHA after it changes
 }, [captcha]);
  // handle submit method for authenticate user by username and password from line num 53 to line num 77
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!employeeId || !password) {
      setError("Please fill in both fields before submitting.");
      return;
    }

    if (userCaptcha !== captcha) {
      setCaptchaError("Incorrect CAPTCHA. Please try again.");
      return;
    } else if (userCaptcha === captcha){
      setCaptchaError("");
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
      if (loginResponse.status === 200) {
        console.log(loginResponse);
        if (loginResponse.data.statusCode === "200 OK") {
          // added by sahil karnekar date 2-12-2024
          localStorage.setItem(
            `user_${userType}${loginResponse.data.employeeId}paymentMade`,
            true
          );
          console.log(loginResponse.data.status);
          // Create a unique key for each user based on their userType and employeeId
          const storageKey = `user_${userType}${loginResponse.data.employeeId}`;

          // Store user details in localStorage with the unique key
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              employeeId: loginResponse.data.employeeId.toString(),
              userType: userType,
            })
          );

          setEmployeeId(loginResponse.data.employeeId);
          console.log("Employee Id:", loginResponse.data.employeeId);
          console.log(loginResponse.data);

          const newSocket = initializeSocket(loginResponse.data.employeeId, userType);

          const emitData = {
            employeeName:  loginResponse.data.employeeName,
            loginTime: getFormattedDateTime(),
            employeeId:loginResponse.data.employeeId,
            userType: userType,
          }
          console.log("Emit Data:", emitData);
          newSocket.emit("user_login_event", emitData);

          if (newSocket.connected) {
            newSocket.disconnect();
          }

          // Navigate to the dashboard
          navigate(`/Dashboard/${loginResponse.data.employeeId}/${userType}`);
        } else if (loginResponse.data.statusCode === "401 Unauthorized") {
          setError(loginResponse.data.status);
        } else if (loginResponse.data.statusCode === "402 Payment Required") {
          setError(loginResponse.data.status);
          // this line  151 to 170 added by sahil karnekar on date 29-11-2024
          console.log(loginResponse.data.status);
          // Create a unique key for each user based on their userType and employeeId

          if (userType === "SuperUser") {
            setError("Payment Pending Please Make Payment ASAP");
            const storageKey = `user_${userType}${loginResponse.data.employeeId}`;

            // Store user details in localStorage with the unique key
            localStorage.setItem(
              storageKey,
              JSON.stringify({
                employeeId: loginResponse.data.employeeId.toString(),
                userType: userType,
              })
            );

            setEmployeeId(loginResponse.data.employeeId);
            setDisplayPaymentLink(true);
            // added by sahil karnekar date 2-12-2024
            localStorage.setItem(
              `user_${userType}${loginResponse.data.employeeId}paymentMade`,
              false
            );
          }
        } else if (loginResponse.data.statusCode === "403 Forbidden") {
          setError(loginResponse.data.status);
          // added by sahil karnekar date 2-12-2024
          setDisplayForcefullyLogout(true);
        } else if (loginResponse.data.statusCode === "404 Not Found") {
          setError(loginResponse.data.status);
        }
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
  // line 220 to 229 added by sahil karnekar on date 29-11-2024
  const handleNavigatePaymentLink = () => {
    // Navigate to the payment link
    const storageKey = `user_${userType}${employeeId}`;

    // Retrieve the stored user data from localStorage
    const storedData = JSON.parse(localStorage.getItem(storageKey));

    navigate(`/Dashboard/${storedData.employeeId}/${userType}`);
  };
  // added by sahil karnekar date 2-12-2024
  const handleDisplayForcefullyLogoutForm = () => {
    setDisplayForcefullyLogoutForm(true);
  };

const handleRefreshCaptch = () =>{
  generateCaptcha();
}

  return (
    <div className="main-body">
      <div className="main-login-container">
        <div className="main-loginpage-clouds"></div>
        {/* updated by sahil karnekar date 2-12-2024 */}
        <div
          className={`container22 justify-center align-center ${
            showForgotPassword ? "full-width" : ""
          }`}
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
            ) : // added by sahil karnekar date 2-12-2024
            displayForcefullyLogoutForm ? (
              <ForceLogout userType={userType} />
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Arshad Attar  , Added inline CSS For Headers As per requirement on 27-11-2024 */}
                {userType === "Recruiters" && (
                  <h2 style={{ color: "gray", fontWeight: "bold" }}>
                    Recruiter
                  </h2>
                )}
                {userType === "TeamLeader" && (
                  <h2 style={{ color: "gray", fontWeight: "bold" }}>
                    Team Leader
                  </h2>
                )}
                {userType === "Manager" && (
                  <h2 style={{ color: "gray", fontWeight: "bold" }}>Manager</h2>
                )}
                {userType === "SuperUser" && (
                  <h2 style={{ color: "gray", fontWeight: "bold" }}>
                    Super User
                  </h2>
                )}
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
                    style={{ paddingLeft: "30px" }}
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
                    style={{ paddingLeft: "30px" }}
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
                      color: "gray",
                    }}
                  />
                </div>

                <div className="loginpage-error">{error}</div>

                {displayPaymentLink && (
                  <div className="acc-create-div">
                    <span
                      className="account-create-span"
                      type="button"
                      onClick={handleNavigatePaymentLink}
                    >
                      Payment Link
                    </span>
                  </div>
                )}
                {/* added by sahil karnekar date 2-12-2024 */}
                {displayForcefullyLogout && (
                  <div className="acc-create-div">
                    <span
                      className="account-create-span"
                      type="button"
                      onClick={handleDisplayForcefullyLogoutForm}
                    >
                      Forcefully Logout
                    </span>
                  </div>
                )}


  <div className="input-group">
                  <label className="label">CAPTCHA:</label>
                  <div className="captcha-box">
                    <canvas
                    onClick={handleRefreshCaptch}
                    ref={canvasRef} width="150" height="50" />
                    <input
                    
                      type="text"
                      value={userCaptcha}
                      onChange={(e) => setUserCaptcha(e.target.value)}
                      className="inputForCaptcha"
                required
                    />
                  </div>
                  {captchaError && <p className="error">{captchaError}</p>}
                </div>


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

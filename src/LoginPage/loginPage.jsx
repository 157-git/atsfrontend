import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./loginPage.css";
import LoginImage from "../assets/rgLogo.png";
import { getPasswordFromDB } from "../api/api";
import ForgotPasswordForm from "./ForgotPasswordForm"; // Import the ForgotPasswordForm component
import JobList from "../EmployeeDashboard/JobList";

const LoginSignup = ({ onLogin }) => {
  const { userType } = useParams(); // Get the userType from the URL
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [login, setLogin] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "employeeId") {
      setEmployeeId(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!employeeId || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await getPasswordFromDB(employeeId);
      const fetchedPassword = response.data;
      if (fetchedPassword === password) {
        localStorage.setItem("employeeId", employeeId);
        navigate(`/Dashboard/${employeeId}`);
        onLogin();
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching password:", error);
      setError("Error occurred. Please try again.");
    }
  };

  // const createAccount = () => {
  //   navigate("/createAccount/Vendor");
  // };

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
            className={` ${
              showForgotPassword ? "full-width-panel" : "right-panel"
            }`}
            data-aos="fade-left"
          >
            {showForgotPassword ? (
              <ForgotPasswordForm userType={userType} />
            ) : (
              <form onSubmit={handleSubmit}>
                <h2>{userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>{" "}
                <div className="input-groups">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    id="loginpage-employeeId"
                    name="employeeId"
                    placeholder="Username"
                    value={employeeId}
                    onChange={handleChange}
                    className="loginpage-form-control"
                  />
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
                <button
                  className="login-button"
                  // onClick={createAccount}
                  data-aos="fade-top"
                >
                  Create account 
                </button>
             
                <center>
                  <span
                    className="psw"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </span>
                </center>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginSignup;

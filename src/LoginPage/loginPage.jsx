import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./loginPage.css";
import LoginImage from "../assets/rgLogo.png";
import { getPasswordFromDB } from "../api/api";
import ForgotPasswordForm from "./ForgotPasswordForm"; // Import the ForgotPasswordForm component
import JobList from "../EmployeeDashboard/JobList";



const LoginSignup = () => {
  const { userType } = useParams();
  console.log("➡ userType from URL:", userType);

  const role = userType || "User"; 
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 3000 });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!employeeId || !password) {
      setError("Please fill in both fields.");
      return;
    }
    alert(`Logged in as ${role} with EmployeeId: ${employeeId}`);
    navigate(`/Dashboard/${employeeId}`);
  };

  return (
    <div className="main-body" style={{ background: "yellow", color: "black", minHeight: "100vh" }}>
      <div className="main-login-container">
        <div className="main-loginpage-clouds"></div>
        <div className={`container22 ${showForgotPassword ? "full-width" : ""}`}>
          {!showForgotPassword && (
            <div className="left-panel" data-aos="fade-right">
              <img src={LoginImage} alt="Logo" className="logo" />
            </div>
          )}
          <div
            className={`${showForgotPassword ? "full-width-panel" : "right-panel"}`}
            data-aos="fade-left"
          >
            {showForgotPassword ? (
              <ForgotPasswordForm userType={userType} />
            ) : (
              <form onSubmit={handleSubmit}>
                <h2>{role} Login</h2>

                <div className="input-groups">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    name="employeeId"
                    placeholder="Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="loginpage-form-control"
                  />
                </div>
                <div className="input-groups">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="loginpage-form-control"
                  />
                </div>

                <div className="loginpage-error">{error}</div>

                <button className="login-button" type="submit">
                  Login
                </button>
                <button
                  className="login-button"
                  type="button"
                  onClick={() => alert("Create Account Clicked")}
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

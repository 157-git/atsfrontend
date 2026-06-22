import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./loginPage.css";
import LoginImage from "../assets/rgLogo.png";
import { getPasswordFromDB } from "../api/api";
import ForgotPasswordForm from "./ForgotPasswordForm"; // Import the ForgotPasswordForm component
import JobList from "../EmployeeDashboard/JobList";
import axios from "axios";
import { useLocation } from "react-router-dom";




const LoginSignup = () => {
  console.log("LOGINPAGE COMPONENT LOADED");
  const { userType } = useParams();
  console.log("➡ userType from URL:", userType);

  const role = userType || "User"; 
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
const params = new URLSearchParams(window.location.search);
const candidateIdFromPortal = params.get("candidateId");
const jobIdFromPortal = params.get("jobId");
// useEffect(() => {
//   if (candidateIdFromPortal) {
//     setEmployeeId(candidateIdFromPortal);   // auto fill login field
//     localStorage.setItem("jobId", jobIdFromPortal); // save jobId
//   }
// }, []);
// console.log("CandidateId:", candidateIdFromPortal);
// console.log("JobId:", jobIdFromPortal);
//   useEffect(() => {
//     AOS.init({ duration: 3000 });
//   }, []);

  useEffect(() => {
  if (candidateIdFromPortal) {
    console.log("CandidateId:", candidateIdFromPortal);
    setEmployeeId(candidateIdFromPortal);
  }

  if (jobIdFromPortal) {
    console.log("JobId:", jobIdFromPortal);
    localStorage.setItem("jobId", jobIdFromPortal);
  }
}, [candidateIdFromPortal, jobIdFromPortal]);

  //ORIGINAL CODE COMMENTED BY SAKSHI FOR CHECKING JOB PORTAL INTEGRATION
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   if (!employeeId || !password) {
  //     setError("Please fill in both fields.");
  //     return;
  //   }
  //   alert(`Logged in as ${role} with EmployeeId: ${employeeId}`);
  //   navigate(`/Dashboard/${employeeId}`);
  // };


const handleSubmit = async (event) => {
  event.preventDefault();

  if (!employeeId || !password) {
    setError("Please fill in both fields.");
    return;
  }

  try {
    if (role === "job-portal") {
      // 🔥 Call Job Portal API
      const response = await axios.post(
        "http://93.127.199.85:8087/api/jobportal/loginUser",
        {
          candidateId: employeeId,  // treating employeeId as candidateId
          password: password,
        }
      );

      // ✅ Success handling
      const userData = response.data;

      // store in localStorage (important for next steps)
      localStorage.setItem("candidate", JSON.stringify(userData));

      // navigate to applicant form (or test directly)
      navigate(`/jobportal-test/${employeeId}`);

    } else {
      // existing ATS login logic
      alert(`Logged in as ${role} with EmployeeId: ${employeeId}`);
      navigate(`/candidate-test/${employeeId}`);
    }

  } catch (error) {
    console.error(error);
    setError("Invalid credentials or login failed.");
  }
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

import { useEffect, useState } from "react";
import HomePage from "./HomePage/homePage";
import MainDashboard from "../src/MainDashboard/mainDashboard";
import Login from "./LoginPage/loginPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AfterSelection from "./CandidateSection/afterSelection";
import AdminLogin from "./LoginPage/adminLogin";
import CandidateVerification from "./CandidateSection/candidateVerification";
import Home from "../src/MainDashboard/mainDashboard";
import ForgotPasswordForm from "./LoginPage/ForgotPasswordForm";
import CandidateResumeLink from "./ResumeData/candidateResumeLink";
import CallingTrackerForm from "./EmployeeSection/CallingTrackerForm";
import RecruiterPage from "./MainDashboard/recruiterPage.jsx";
import ForgotPasswordsForm from "./MainDashboard/empForgotPasswords.jsx";
import ApplicantRegistraion from "./Applicant/ApplicantRegistration.jsx";
import SelfTechnicalUser from "./MainDashboard/selfTechnicalUser.jsx";
import { ToastContainer } from "react-toastify";
import AddVendor from "./Vendor/AddVendor.jsx";
import AddEmployee from "./EmployeeSection/addEmployee.jsx";
import LoginSignup from "./MainDashboard/loginSignup.jsx";
import EmpDashboard from "./EmployeeDashboard/empDashboard";
import ProtectedRoute from "./MainDashboard/ProtectedRoute.jsx";
import ApplicantForm from "./Applicant/applicantFrom.jsx";
import ApplicationForm1 from "./Applicant/ApplicationForm1.jsx";


const applySavedColors = () => {
  const bgColor = localStorage.getItem("bgColor");
  const buttonColor = localStorage.getItem("buttonColor");
  const hoverColor = localStorage.getItem("hover-effect");

  if (bgColor) document.documentElement.style.setProperty("--Bg-color", bgColor);
  if (buttonColor) document.documentElement.style.setProperty("--button-color", buttonColor);
  if (hoverColor) document.documentElement.style.setProperty("--hover-effect", hoverColor);
  if (buttonColor) document.documentElement.style.setProperty("--button-hover-color", "white");
  if (bgColor) document.documentElement.style.setProperty("--text-hover-color", bgColor);
  if (bgColor) document.documentElement.style.setProperty("--button-text-color", "white");
  if (bgColor) document.documentElement.style.setProperty("--button-border-color", "gray");
  if (bgColor) document.documentElement.style.setProperty("--button-bg-hover-color", "white");
};


const App = () => {
  const [loginEmployeeName, setLoginEmployeeName] = useState("");

  useEffect(() => {
    applySavedColors();
  }, []);


  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* This is secured route  added by sahil karnekar*/}
          <Route path="/" element={<HomePage />} />
          <Route path="/Main-Dashboard" element={<MainDashboard />} />
          <Route path="/employee-login/:userType" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPasswordForm />} />
          <Route
            path="/Dashboard/:employeeId/:userType"
            element={
              // protected route created for the child or children Dashboard created by sahil karnekar
              // ProtectedRoute is a component
              <ProtectedRoute>
                <EmpDashboard
                  loginEmployeeName={loginEmployeeName}
                  setLoginEmployeeName={setLoginEmployeeName} 
                />
              </ProtectedRoute>
            }
          />

          <Route path="/follow-up/:candidateId" element={<AfterSelection />} />
          <Route
            path="/admin-login"
            element={<AdminLogin></AdminLogin>}
          ></Route>
          <Route
            path="api/ats/157industries/verify"
            element={<CandidateVerification></CandidateVerification>}
          ></Route>
          {/* this is commented by sahil karnekar please verify it at once before deployment */}
          {/* <Route
            path="/callingtracker"
            element={<CallingTrackerForm />}
          ></Route> */}
          <Route path="/employee-login" element={<RecruiterPage />} />
          <Route path="/login/:userType" element={<LoginSignup />} />
          <Route
            path="/forgot-password/:userType"
            element={<ForgotPasswordsForm />}
          />
          <Route path="/createAccount/Vendor" element={<AddVendor />}></Route>
          <Route
            path="/manager/technicalUser"
            element={<SelfTechnicalUser />}
          ></Route>
          <Route
            path="/create-account/:userType"
            element={<AddEmployee />}
          ></Route>
          {/* <Route
            path="/157industries/:employeeId/:userType/candidate-form"
            element={<ApplicantForm loginEmployeeName={loginEmployeeName}  />}
          ></Route> */}
          {/* temporary route for the applicant registration sahil karnekar date 18-11-2024 */}
          <Route
            path="/157industries/:employeeId/:userType/candidate-form"
            element={<ApplicationForm1 loginEmployeeName={loginEmployeeName}  />}
          ></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
};

export default App;

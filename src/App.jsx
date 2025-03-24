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
import ApplicantForm2 from "./Applicant/applicantForm2.jsx";
import ThankYouPage from "./Applicant/applicantThankYou.jsx";
import InterviewForm1 from "./Help/InterviewForm1.jsx";

const applySavedColors = () => {
  const bgColor = localStorage.getItem("bgColor");
  const primaryBgColor = localStorage.getItem("--primary-bg-color");
  const sidebarBg = localStorage.getItem("--sidebar-bg");

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
    { variable: "--table-header-bg" },
    { variable: "--profile-txt" },
    { variable: "--notification-icon-background" },
    { variable: "--notification-badge-background" },
    { variable: "--notification-icon-color" },
    { variable: "--notification-ribben-color" },
    { variable: "--active-button1-bg" },
    { variable: "--selected-form-bg" },
    { variable: "--mainDashboard-card-txt" },
    { variable: "--mainDashboard-card-txt-hover" },
   
  ];

  if (bgColor)
    document.documentElement.style.setProperty("--Bg-color", bgColor);
  if (primaryBgColor) {
    colors.forEach(({ variable }) => {
      const value = localStorage.getItem(variable); // Use the correct property
      if (value) {
        document.documentElement.style.setProperty(variable, value); // Set CSS variable
      }
    });
  }

  if (sidebarBg) {
    document.documentElement.style.setProperty("--sidebar-bg", sidebarBg);
  }
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

          <Route
            path="/applicant-form/:encodedParams"
            element={<ApplicantForm2 loginEmployeeName={loginEmployeeName} />}
          ></Route>

          <Route
            path="/thank-you"
            element={<ThankYouPage></ThankYouPage>}
          ></Route>

          {/* <Route
            path="/157industries/:encodedParams/candidate-form"
            element={<ApplicantForm loginEmployeeName={loginEmployeeName} />}
          ></Route> */}

          {/* temporary route for the applicant registration sahil karnekar date 18-11-2024 */}
          {/* <Route
            path="/157industries/:employeeId/:userType/candidate-form"
            element={<ApplicationForm1 loginEmployeeName={loginEmployeeName}  />}
          ></Route> */}
          {/* <Route
            path="/tempRoute"
            element={<ApplicationForm1></ApplicationForm1>}
          ></Route> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
};

export default App;

import { useState } from "react";
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

const App = () => {
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
                <EmpDashboard />
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
          <Route
            path="/callingtracker"
            element={<CallingTrackerForm />}
          ></Route>
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
            path="/157industries/:employeeId/:userType/candidate-form"
            element={<CandidateResumeLink />}
          ></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
};

export default App;

// complete file updated by sahil karnekar on date 2-12-2024

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Password from "antd/es/input/Password";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { API_BASE_URL } from "../api/api";

const ForgotPasswordForm = () => {
  const { userType } = useParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [checkOtpSendAndChangeState, setCheckOtpSendAndChangeState] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});


  const handleSentOtpAndChangeState = async () => {
    setLoading(true);
    try {
      console.log(email);
      const response = await axios.post(`${API_BASE_URL}/forgot-pass-otp/${email}/${userType}`);
      if (response.status === 200) {
        console.log(response);
        if (response.data === "OTP sent to employee email!") {
          toast.success(response.data)
          setCheckOtpSendAndChangeState(true);
          setLoading(false);
        }else{
          setCheckOtpSendAndChangeState(false);
          toast.info(response.data);
          setLoading(false);
        }
  
      }else{
        setCheckOtpSendAndChangeState(false);
          setLoading(false);
      }

    } catch (error) {
      setCheckOtpSendAndChangeState(false);
      setLoading(false);
      toast.error(error)
    }

    setLoading(false);
  }

  const handleSubmitAndResetPassword = async () => {
    setLoading(true);
const newErrors = {};

// Check each field and assign errors if invalid
if (email.trim() === "") {
  newErrors.email = "Email is required";
}

if (otp.trim() === "") {
  newErrors.otp = "OTP is required";
}

if (password.trim() === "") {
  newErrors.password = "Password is required";
}

// If any field has an error, update only those
if (Object.keys(newErrors).length > 0) {
  setErrors((prevErrors) => ({
    ...prevErrors,
    ...newErrors,
    // Clear errors for fields that are now valid
    ...(email.trim() !== "" ? { email: undefined } : {}),
    ...(otp.trim() !== "" ? { otp: undefined } : {}),
    ...(password.trim() !== "" ? { password: undefined } : {}),
  }));
  setLoading(false);
  return;
}

// If all valid, clear all errors
setErrors({});

  
    try {
      const response = await axios.post(`${API_BASE_URL}/update-password`, {
        email: email,
        otp: otp,
        newPassword: password,
        jobRole: userType,
      });
  
      if (response.status === 200) {
        console.log(response.data)
        const newEmployeeId=response.data.employeeId
        const newUserType=response.data.userType
        toast.success("Password reset successfully!");
        navigate(`/Dashboard/${newEmployeeId}/${newUserType}`);
      }
    } catch (error) {
      toast.error(
        error
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <div className=" flex items-center justify-center align-center bg-white">
        { loading ? (
            <ClipLoader
              color={"#1af7dd"}
              // loading={loading}
              // cssOverride={override}
              size={70}
            // aria-label="Loading Spinner"
            // data-testid="loader"
            />

          ) : (
            <div className="w-full max-w-md p-2 bg-white rounded-md">
              <h1 className="text-xl font-bold text-[#000] text-center mb-2">
                Forgot Password
              </h1>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Email ID
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    value={email.trim()}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 outline-orange-300 rounded-md shadow-sm"
                    placeholder="Enter Email Id"
                    required
                  />
                    {errors.email && (
                      <div className="error-message">{errors.email}</div>
                    )}
                  <div className="col-span-2 w-full flex justify-center items-center">
                    <button
                      className="button-hover lineUp-share-btn"
                      style={{ marginTop: "10px", height:"auto" }}
                      onClick={handleSentOtpAndChangeState}
                    >
                      Send OTP
                    </button>
                  </div>
                </div>
              </div>

              { checkOtpSendAndChangeState && (
                  <div className="space-y-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        name="otpInput"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 outline-orange-300 rounded-md shadow-sm"
                        placeholder="Enter OTP"
                        required
                      />
                      {errors.otp && (
                      <div className="error-message">{errors.otp}</div>
                    )}
                      <label className="block text-sm font-medium text-gray-500">
                        Enter New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 outline-orange-300 rounded-md shadow-sm"
                        placeholder="Enter New Password"
                        required
                      />
                      {errors.password && (
                      <div className="error-message">{errors.password}</div>
                    )}
                      <div className="col-span-2 w-full flex justify-center items-center">
                        <button
                          className="button-hover lineUp-share-btn"
                          style={{ marginTop: "10px", height:"auto" }}
                          onClick={handleSubmitAndResetPassword}
                        >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </>
  );
};

export default ForgotPasswordForm;

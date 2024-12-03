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
  
    try {
      const response = await axios.post(`${API_BASE_URL}/update-password`, {
        email: email,
        otp: otp,
        newPassword: password,
        jobRole: userType,
      });
  
      if (response.status === 200) {
        toast.success(response.data);
        navigate("/employee-login");
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
              <h1 className="text-xl font-bold text-[#ffc48d] text-center mb-2">
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
                  <div className="col-span-2 w-full flex justify-center items-center">
                    <button
                      className="button-hover"
                      style={{ marginTop: "10px" }}
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
                      <div className="col-span-2 w-full flex justify-center items-center">
                        <button
                          className="button-hover"
                          style={{ marginTop: "10px" }}
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

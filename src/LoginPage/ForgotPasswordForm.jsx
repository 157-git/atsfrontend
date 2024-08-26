import React, { useState } from "react";
import axios from "axios";

const ForgotPasswordForm = ({ userType }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    empId: "",
    empName: "",
    emailId: "",
    jobRole: userType.charAt(0).toUpperCase() + userType.slice(1), // Capitalize the userType
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when form data changes
  };

  const handleSendOtp = async () => {
    try {
      console.log(formData);
      await axios.post("http://192.168.1.38:8081/api/auth/forgot-password", null, {
        params: { emailId: formData.emailId, jobRole: formData.jobRole },
      });
      setOtpSent(true);
      setMessage("OTP sent! Please check your email.");
      setTimeout(() => {
        setMessage("");
        setStep(2);
      }, 1000); // Show message for 3 seconds before moving to the next step
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post("http://192.168.1.38:8081/api/auth/validate-otp", null, {
        params: { emailId: formData.emailId, otp: formData.otp },
      });
      setStep(3);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Invalid OTP. Please verify and try again.");
    }
  };

  const handleResetPassword = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }

      await axios.post("http://192.168.1.38:8081/api/auth/reset-password", null, {
        params: {
          empId: formData.empId,
          password: formData.password,
          emailId: formData.emailId,
        },
      });
      setError("");
      setStep(1);
      setOtpSent(false);
      setFormData({
        empId: "",
        empName: "",
        emailId: "",
        jobRole: userType.charAt(0).toUpperCase() + userType.slice(1), // Reset the initial value for jobRole here
        otp: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Failed to reset password. Please try again.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-2/3 p-1 bg-white">
      <h1 className="text-xl font-bold text-[#ffc48d] text-center mb-2">
        Forgot Password
      </h1>
      <div className="space-y-4">
        <div className="col-span-1">
          <label className="block mb-2 text-sm font-medium text-gray-500">
            Email ID
          </label>
          <input
            type="email"
            name="emailId"
            value={formData.emailId}
            onChange={handleChange}
            className="w-full px-3 py-1 border border-gray-300 outline-orange-300 rounded-md shadow-sm"
            required
          />
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="empId"
                  value={formData.empId}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-gray-300 outline-orange-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-500">
                  Employee Name
                </label>
                <input
                  type="text"
                  name="empName"
                  value={formData.empName}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-gray-300 outline-orange-300 rounded-md shadow-sm"
                />
              </div>
              {error && (
                <p className="col-span-2 text-red-500 text-sm">{error}</p>
              )}
              {message && (
                <p className="col-span-2 text-green-500 text-sm">{message}</p>
              )}
              <div className="col-span-2 w-full flex justify-center items-center">
                <button onClick={handleSendOtp} className="button-hover">
                  Send OTP
                </button>
              </div>
            </div>
          )}

          {step === 2 && otpSent && (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-500">
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-gray-300 outline-orange-300 rounded-md shadow-sm"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
              <div className="w-full flex justify-center items-center">
                <button onClick={handleVerifyOtp} className="button-hover mt-1">
                  Verify OTP
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-500">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-1 border border-gray-300 outline-orange-300 rounded-md shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 px-3 py-1"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-500">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-1 border border-gray-300 outline-orange-300 rounded-md shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={toggleShowConfirmPassword}
                    className="absolute inset-y-0 right-0 px-3 py-1 flex items-center"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div>
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>
              </div>
              <div className="w-full flex justify-center items-center">
                <button
                  onClick={handleResetPassword}
                  className="button-hover mt-1"
                >
                  Reset Password
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

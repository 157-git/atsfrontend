// This is done by vaibhavi kawarkhe
//  StartDate: 27-11-2024 EndDate: 28-11-2024
// Task : If the given email status is login then Forcefully update the status from login to logout for the given email by sending and verifying the otp.

import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

function ForcefullyLogoutTask() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const { userType } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Function to handle Send OTP
    const sendOtp = async () => {
        setLoading(true);
        if (!email.trim()) {
            toast.error("Please enter a valid email.");
            setLoading(false);
            return;
            
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/send-logout-Otp/${userType}`, { email });

            // Use response.data.message as the success message
            toast.success(response.data.message);

            // Only set otpSent to true if the request is successful
            setOtpSent(true);
        } catch (error) {
            // Handle error response from backend
            const errorMessage = error.response?.data?.message || "Error sending OTP.";
            toast.error(errorMessage);

            // Reset otpSent state if there's an error (e.g., user already logged out)
            setOtpSent(false);
            setLoading(false);
        }
        setLoading(false);
    };

    // Function to verify OTP and forcefully logout
    const verifyOtpAndLogout = async () => {
        setLoading(true);
        if (!otp.trim()) {
            toast.error("Please enter the OTP.");
            setLoading(false);
            return;
            
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/logout-verify-Otp/${userType}`, { email, otp });

            // Use response.data.message as the success message
            toast.success(response.data.message);

            // Reset form after successful logout
            setEmail("");
            setOtp("");
            setOtpSent(false);
            navigate("/employee-login");
        } catch (error) {
            // Handle error response from backend
            const errorMessage = error.response?.data?.message || "Error verifying OTP.";
            toast.error(errorMessage);
            setLoading(false);
        }
        setLoading(false);
    };

    return (
        <>

{
    loading ? (
        <ClipLoader
        color={"#1af7dd"}
        // loading={loading}
        // cssOverride={override}
        size={70}
        // aria-label="Loading Spinner"
        // data-testid="loader"
      />
    ) :(
        <div className="w-2/3 p-1 bg-white">
        <h1 className="text-xl font-bold text-[#ffc48d] text-center mb-2">
            Force Logout
        </h1>
        <div className="inputGroup">
            <label className="block mb-2 text-sm font-medium text-gray-500">
                Email ID
            </label>
            <input
                type="email"
                name="emailId"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 outline-orange-300 rounded-md shadow-sm"
                required
            />
            <div className="col-span-2 w-full flex justify-center items-center">
                <button onClick={sendOtp} className="button-hover"
                style={{marginTop:"10px"}}
                >
                    Send OTP
                </button>
            </div>
        </div>

        {otpSent && (



            <div className="inputGroup">
                 <label className="block mb-2 text-sm font-medium text-gray-500">
                Enter OTP
            </label>
            <input
                type="email"
                name="emailId"
                value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 outline-orange-300 rounded-md shadow-sm"
                required
            />

<div className="col-span-2 w-full flex justify-center items-center">
                <button onClick={verifyOtpAndLogout} className="button-hover"
                   style={{marginTop:"10px"}}
                >
                    Verify OTP
                </button>
            </div>
            </div>
        )}
    </div>
    )
}

       
        </>
        
    );
}

export default ForcefullyLogoutTask;
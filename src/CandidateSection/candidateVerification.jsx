import React, { useEffect, useState } from "react";
import "../CandidateSection/candidateVerification.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api/api";

function CandidateVerification() {
    const [message, setMessage] = useState("Verifying...");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();
    useEffect(() => {
        console.log(location);
        axios.get(`${API_BASE_URL}/verify${location.search}`);
    }, [location.search]);

    useEffect(() => {
        axios
            .get(
                `${API_BASE_URL}/verify/${location.search.split("email=")[1]
                }`
            )
            .then((resolve) => {
                return resolve.data;
            })
            .then((data) => {
                console.log(data);
                if (data != null) {
                    setData(data);
                    setMessage("Your Registration Completed Successfully");
                } else {
                    setMessage("Invalid Or Token Expired");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setMessage("Error verifying candidate");
                setError(error);
            });
    }, []);

    const getMonthName = (monthNumber) => {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return monthNames[parseInt(monthNumber, 10) - 1];
    };

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split("-");
        const monthName = getMonthName(month);
        return { year, month: monthName, day };
    };

    const formattedDate = data
        ? formatDate(data.lineUp?.availabilityForInterview)
        : null;

    return (
        <div className="main-verification-div">
            <div className="verification-section">
                {data ? (
                    <lord-icon
                        src="https://cdn.lordicon.com/fkmafinl.json"
                        trigger="loop"
                        delay="2000"
                        style={{ width: "100px", height: "100px" }}
                    ></lord-icon>
                ) : (
                    <lord-icon
                        src="https://cdn.lordicon.com/jxzkkoed.json"
                        trigger="loop"
                        delay="2000"
                        style={{ width: "100px", height: "100px" }}
                    ></lord-icon>
                )}
                <h1 className="text-secondary" style={{ textAlign: "center" }}>
                    {message}
                </h1>
            </div>
            {error && <p className="error-message">Error: {error.message}</p>}
            {data && formattedDate && (
                <div className="verification-details">
                    <div className="Calender">
                        <div className="Calender-Month">{formattedDate.month}</div>
                        <div className="Calender-Date">{formattedDate.day}</div>
                    </div>
                    <div className="interview-details">
                        <p className="">
                            <span>
                                Interview Date & Time :{" "}
                                {`${formattedDate.month} ${formattedDate.day}, ${formattedDate.year} ,${data.lineUp?.interviewTime}`}
                            </span>
                            <span>Company Name : {data.requirementCompany} </span>
                            <span>Job Designation : {data.jobDesignation} </span>
                        </p>
                        <p className="verification-paragraph">
                            <span>
                                Please ensure you arrive on time or log in promptly at the
                                provided time for your online interview.
                            </span>
                            <span>
                                If you have any questions or need to reschedule, please contact
                                us.
                            </span>
                            <span>
                                We look forward to meeting you and wish you the best of luck!
                            </span>
                            <span>
                                Warm regards,
                                <br />
                                157 Careers
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CandidateVerification;

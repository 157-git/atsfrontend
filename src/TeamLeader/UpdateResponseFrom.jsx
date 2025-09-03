/* SwapnilRokade_UpdateResponsePage_05/07 */
// Akash_pawar_updateResponse_validation_23/07

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";
import { useParams } from "react-router-dom";
import { getSocket } from "../EmployeeDashboard/socket";
import { getFormattedDateTime } from "../EmployeeSection/getFormattedDateTime";
import { Button, Modal, Popconfirm } from "antd";


const UpdateResponseFrom = ({
  candidateId,
  passedEmployeeId,
  requirementId,
  candidateName,
  employeeName,
  passedJobRole,
  onClose,
}) => {
   console.log("👉 UpdateResponseFrom mounted with props:", candidateId);
  const { employeeId, userType } = useParams();
  const [data, setData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [submited, setSubmited] = useState(false);
  const [errors, setErrors] = useState({});
  const [performanceId, setPerformanceId] = useState();
  const [triggerPopConfirm, setTriggerPopConfirm] = useState(false);
  const [displayEmailConfirm, setDisplayEmailConfirm] = useState(false);
  const [showFinalPopConfirm, setShowFinalPopConfirm] = useState(false);




  const [formData, setFormData] = useState(() => {
    let baseFormData = {
      interviewRound: "",
      interviewResponse: "",
      commentForTl: "",
      responseUpdatedDate: "",
      nextInterviewDate: "",
      nextInterviewTiming: "",
      interviewerName: "",
      requirementId,
      callingTracker: { candidateId: candidateId },
      emailStatus: "No"
    };

    if (passedJobRole === "Recruiters") {
      console.log(" passedJobRole In Recruiters " + passedJobRole);
      baseFormData = {
        ...baseFormData,
        employee: { employeeId: passedEmployeeId },
        teamLeader: null,
        manager: null,
      };
    } else if (passedJobRole === "TeamLeader") {
      console.log(" passedJobRole In TeamLeader " + passedJobRole);
      baseFormData = {
        ...baseFormData,
        teamLeader: { teamLeaderId: passedEmployeeId },
        employee: null,
        manager: null,
      };
    } else if (passedJobRole == "Manager") {
      console.log(" passedJobRole In Manager " + passedJobRole);
      baseFormData = {
        ...baseFormData,
        manager: { managerId: passedEmployeeId },
        teamLeader: null,
        employee: null,
      };
    }
    return baseFormData;
  });
  console.log(formData)
  useEffect(() => {
    // Apply background color when the component mounts
    const style = document.createElement("style");
    style.innerHTML = `
      .ant-popover-inner {
        background-color: #e4e4e4 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup when component unmounts (optional)
      document.head.removeChild(style);
    };
  }, []);

useEffect(() => {
  console.log("useEffect triggered, candidateId:", candidateId);
  if (candidateId) {
    fetchDataToUpdate();
  }
}, [candidateId]);



  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

  

const fetchDataToUpdate = async () => {
  try {
    console.log("👉 fetchDataToUpdate started for candidate:", candidateId);

    // 1️⃣ Fetch candidate responses
    const response = await fetch(
      `${API_BASE_URL}/fetch-specific-response/${candidateId}`
    );
    console.log("👉 fetch-specific-response status:", response.status);

    const responseData = await response.json();
    console.log("👉 fetch-specific-response data:", responseData);
    setData(responseData);

    // 2️⃣ Try fetching performanceId
    try {
      console.log("👉 Now calling fetch-performance-id for candidate:", candidateId);
      const performanceRes = await axios.get(
        `${API_BASE_URL}/fetch-performance-id/${candidateId}`
      );
      console.log("👉 Raw performance API response:", performanceRes.data);

      if (performanceRes.data?.performanceId) {
        setPerformanceId(performanceRes.data.performanceId);
        console.log("✅ Got performanceId (object):", performanceRes.data.performanceId);
      } else {
        setPerformanceId(performanceRes.data);
        console.log("✅ Got performanceId (direct):", performanceRes.data);
      }
    } catch (perfErr) {
      console.warn("⚠️ Could not fetch performanceId for candidate:", candidateId, perfErr);
      setPerformanceId(null);
    }

  } catch (err) {
    console.error("❌ Error fetching UpdateResponse data:", err);
  }
};




const fetchPerformanceId = async () => {
  console.log("Fetching performanceId with candidateId:", candidateId);
  try {
    const performanceRes = await axios.get(
  `${API_BASE_URL}/fetch-performance-id/${candidateId}`
);

if (performanceRes.data?.performanceId) {
  setPerformanceId(performanceRes.data.performanceId);   // ✅ extract number
  console.log("✅ Got performanceId:", performanceRes.data.performanceId);
} else {
  setPerformanceId(performanceRes.data);   // in case backend returns a plain number
  console.log("✅ Got performanceId (direct):", performanceRes.data);
}

  } catch (error) {
    console.error("❌ Error fetching performanceId:", error);
  }
};


const validateForm = () => {
  let errors = {};
  const excludedResponses = ["Back Out", "Selected", "Rejected"];
  const isResponseExcluded = excludedResponses.includes(formData.interviewResponse);

  if (!formData.interviewRound?.trim()) {
    errors.interviewRound = "Interview Round is required";
  }
  if (!formData.responseUpdatedDate?.trim()) {
    errors.responseUpdatedDate = "Update Date is required";
  }
  if (!isResponseExcluded) {
    if (!formData.interviewerName?.trim()) {
      errors.interviewerName = "Interviewer Name is required";
    }
    if (!formData.nextInterviewDate?.trim()) {
      errors.nextInterviewDate = "Interview Date is required";
    }
    if (!formData.nextInterviewTiming?.trim()) {
      errors.nextInterviewTiming = "Interview Time is required";
    }
  }

  return errors;
};



  const formatDateToIST = (date) => {
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  };

  //changes by sakshi kashid on 30-06-2025
const handleSubmit = async (e, status) => {
  if (e && typeof e.preventDefault === "function") e.preventDefault();

  console.log("👉 handleSubmit triggered with performanceId:", performanceId);

  setSubmited(true);
  setDisplayEmailConfirm(false);

  try {
    formData.emailStatus = status === "Yes" ? "Yes" : "No";

    if (data.length === 0 && !formData.interviewResponse) {
      formData.interviewResponse = formData.interviewRound;
    }

    // 1️⃣ Always save response first
    const response = await axios.post(
      `${API_BASE_URL}/save-interview-response/${employeeId}/${userType}`,
      formData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status !== 200) {
      toast.error("Failed to save response");
      return;
    }

    // 2️⃣ Build additionalData for performance update
    const responseUpdatedDateStr = response.data.responseUpdatedDate;
    const responseUpdatedDate = new Date(responseUpdatedDateStr);
    const currentDateTime = new Date();

    const diffMs = Math.abs(currentDateTime - responseUpdatedDate);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const difference = `${days} days, ${hours} hours, and ${minutes} minutes.`;

    const additionalData =
      data.length === 0
        ? {
            mailResponse: currentDateTime,
            interviewRoundsList: [
              {
                interviewRound: formData.interviewRound,
                roundResponse: formData.interviewResponse,
                time: currentDateTime,
                diffBTNRoundToNextRound: 0,
              },
            ],
          }
        : {
            interviewRoundsList: [
              {
                interviewRound: formData.interviewRound,
                roundResponse: formData.interviewResponse,
                time: currentDateTime,
                diffBTNRoundToNextRound: difference,
              },
            ],
          };

    // 3️⃣ Update performance only if id exists
    if (performanceId) {
      console.log("📤 Updating performance with ID:", performanceId);
      const res = await axios.put(
        `${API_BASE_URL}/update-performance/${performanceId}`,
        additionalData
      );
      console.log("✅ Performance update response:", res.data);
    } else {
      console.warn("⏭️ Skipping performance update (no performanceId yet)");
      // toast.warn("Response saved, but performance update skipped.");
    }

    toast.success("Response updated successfully.");
    onClose(true);

  } catch (err) {
    console.error("❌ handleSubmit error:", err);
    toast.error("Failed to Update Response: " + (err?.message || err));
  } finally {
    setSubmited(false);
  }
};




const handleInputChange = (event, index = null) => {
  const { name, value } = event.target;

  setErrors(prev => {
    const cleared = { ...prev, [name]: "" };
    if (["interviewerName", "nextInterviewDate", "nextInterviewTiming"].includes(name)) {
      cleared.nextInterviewDetails = "";
    }
    return cleared;
  });

  if (index !== null) {
    const updatedData = data.map((entry, i) =>
      i === index ? { ...entry, [name]: value } : entry
    );
    setData(updatedData);
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};



  const convertTo12HourFormat = (time) => {
    if (!time) return "";

    let [hourMinute, period] = time.split(" ");
    let [hour, minute] = hourMinute.split(":");

    hour = parseInt(hour, 10);
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return `${String(hour).padStart(2, "0")}:${minute}`;
  };


  // changes by sakshi kashid on 26-08-25
const displayModalForEmailConfirm = (e) => {
  if (e && typeof e.preventDefault === "function") {
    e.preventDefault();
  }

  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setSubmited(false);   // ❌ previously true → caused infinite loader
    return;
  }

  setDisplayEmailConfirm(true); // ✅ open modal only if valid
};








  return (
    <div className="update-response-modal">
      <div
        className="mb-4"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span className="section-title">
          {data.length > 0 ? "Update Interview Response" : "Schedule Interview"}
        </span>

        <div className="candidate">
          Candidate ID: {candidateId} &nbsp;|&nbsp; Name: {candidateName}
        </div>
      </div>


      {/* line 222 to 233 updated by sahil karnekar date 14-11-2024 */}
      <form
        // onSubmit={handleSubmit}
        style={{
          overflowX: "auto",
        }}
      >
        <div
          className="overflow-x-auto"
          style={{
            width: "fit-content",
          }}
        >
          <table className="min-w-full border-collapse table-auto">
            <thead
              className="bg-[#546173] text-gray-500"
              style={{
                backgroundColor: "#546173",
                lineHeight: "1",
                color: "white"
              }}
            >
              <tr>
                <th className="p-2 font-semibold whitespace-nowrap">No.</th>
                <th className="p-2 font-semibold whitespace-nowrap">
                  Interview Round &nbsp;<span style={{ color: "red" }}>*</span>
                </th>
                {data.length > 0 && (
                  <th className="p-2 font-semibold whitespace-nowrap">
                    Interview Response
                  </th>
                )}

                <th className="p-2 font-semibold whitespace-nowrap">
                  Comment for TL
                </th>
                <th className="p-2 font-semibold whitespace-nowrap">
                  Update Date &nbsp;<span style={{ color: "red" }}>*</span>
                </th>
                <th className="p-2 font-semibold whitespace-nowrap">
                  Interviewer Name &nbsp;<span style={{ color: "red" }}>*</span>
                </th>
                <th className="p-2 font-semibold whitespace-nowrap">
                  Interview Date &nbsp;<span style={{ color: "red" }}>*</span>
                </th>
                <th className="p-2 font-semibold whitespace-nowrap">
                  Interview Time &nbsp;<span style={{ color: "red" }}>*</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((response, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 text-xs sm:text-base">{index + 1}</td>
                  <td className="p-2">
                    <select
                      className="form-select w-full  border rounded text-xs sm:text-base"
                      name="interviewRound"
                      value={response.interviewRound}
                      onChange={(e) => handleInputChange(e, index)}
                      disabled={index < data.length - 1}
                      // inline styling for different html tags added by sahil karnekar , for ovveriding the link css properties
                      style={
                        index < data.length - 1
                          ? {
                            backgroundImage: "none",
                            boxShadow: `1px 1px 4px var(--Bg-color)`,
                            lineHeight: "1",
                          }
                          : {
                            boxShadow: `1px 1px 4px var(--Bg-color)`,
                            lineHeight: "1",
                          }
                      }
                    >
                      <option value="">Select Interview</option>
                      <option value="Shortlisted For Hr Round">Hr Round</option>
                      <option value="Shortlisted For Technical Round">
                        Technical Round
                      </option>
                      <option value="Shortlisted For L1 Round">L1 Round</option>
                      <option value="Shortlisted For L2 Round">L2 Round</option>
                      <option value="Shortlisted For L3 Round">L3 Round</option>
                      <option value="Back Out">Back Out</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hold">Hold</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      className="form-select w-full border rounded text-xs sm:text-base"
                      name="interviewResponse"
                      value={
                        response.interviewResponse
                          ? response.interviewResponse
                          : response.interviewRound
                      }
                      onChange={(e) => handleInputChange(e, index)}
                      disabled={index < data.length - 1}
                      style={
                        index < data.length - 1
                          ? {
                            backgroundImage: "none",
                            boxShadow: `1px 1px 4px var(--Bg-color)`,
                            lineHeight: "1",
                          }
                          : {
                            boxShadow: `1px 1px 4px var(--Bg-color)`,
                            lineHeight: "1",
                          }
                      }
                    >
                      <option value="">Choose option</option>
                      <option value="Shortlisted For Hr Round">Hr Round</option>
                      <option value="Shortlisted For Technical Round">
                        Technical Round
                      </option>
                      <option value="Shortlisted For L1 Round">L1 Round</option>
                      <option value="Shortlisted For L2 Round">L2 Round</option>
                      <option value="Shortlisted For L3 Round">L3 Round</option>
                      <option value="Back Out">Back Out</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hold">Hold</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                      type="text"
                      name="commentForTl"
                      value={response.commentForTl}
                      onChange={(e) => handleInputChange(e, index)}
                      placeholder="Enter Comment here..."
                      disabled={index < data.length - 1}
                      style={{
                        boxShadow: `1px 1px 4px var(--Bg-color)`,
                        lineHeight: "1",
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                      type="date"
                      name="responseUpdatedDate"
                      value={response.responseUpdatedDate}
                      onChange={(e) => handleInputChange(e, index)}
                      disabled={index < data.length - 1}
                      style={{
                        boxShadow: `1px 1px 4px var(--Bg-color)`,
                        lineHeight: "1",
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                      type="text"
                      name="interviewerName"
                      placeholder="Enter Name"
                      value={response.interviewerName}
                      onChange={handleInputChange}
                      disabled={index < data.length - 1}
                      style={{
                        boxShadow: `1px 1px 4px var(--Bg-color)`,
                        lineHeight: "1",
                      }}
                    />
                  </td>
                  {/* changes by sakshi kashid on 30-06-2025 */}
                  <td className="p-2">
                    <input
                      className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                      type="date"
                      name="nextInterviewDate"
                      value={response.nextInterviewDate}
                      onChange={(e) => handleInputChange(e, index)}
                      disabled={index < data.length - 1}
                      style={{
                        boxShadow: `1px 1px 4px var(--Bg-color)`,
                        lineHeight: "1",
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                      type="time"
                      name="nextInterviewTiming"
                      value={convertTo12HourFormat(response.nextInterviewTiming)}
                      onChange={(e) => handleInputChange(e, index)}
                      disabled={index < data.length - 1}
                      style={{
                        boxShadow: `1px 1px 4px var(--Bg-color)`,
                        lineHeight: "1",
                      }}
                    />
                  </td>


                </tr>
              ))}
              <tr className="border-b">
                <td className="p-2 text-xs sm:text-base">{data.length + 1}</td>
                {data.length > 0 ? (
                  <td className="p-2">
                    <select
                      className="form-select w-full border rounded text-xs sm:text-base"
                      name="interviewRound"
                      // retriving data added by sahil karnekar
                      value={
                        (formData.interviewRound = data[data.length - 1]
                          .interviewResponse
                          ? data[data.length - 1].interviewResponse
                          : data[data.length - 1].interviewRound)
                      }
                      onChange={handleInputChange}
                      style={{
                        boxShadow: `1px 1px 4px var(--Bg-color)`,
                        lineHeight: "1",
                      }}
                    >
                      <option value="">Select interview Round</option>
                      <option value="Shortlisted For Hr Round">
                        Shortlisted For Hr Round
                      </option>
                      <option value="Shortlisted For Technical Round">
                        Shortlisted For Technical Round
                      </option>
                      <option value="Shortlisted For L1 Round">
                        Shortlisted For L1 Round
                      </option>
                      <option value="Shortlisted For L2 Round">
                        Shortlisted For L2 Round
                      </option>
                      <option value="Shortlisted For L3 Round">
                        Shortlisted For L3 Round
                      </option>
                      <option value="Back Out">Back Out</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hold">Hold</option>
                    </select>
                    {errors.interviewRound && (
                      <div className="error-message">
                        {errors.interviewRound}
                      </div>
                    )}
                  </td>
                ) : (
                  <td className="p-2">
                    <select
                      className="form-select w-full border rounded text-xs sm:text-base"
                      name="interviewRound"
                      value={formData.interviewRound}
                      onChange={handleInputChange}
                      style={{
                        boxShadow: `1px 1px 4px var(--Bg-color)`,
                        lineHeight: "1",
                      }}
                    >
                      <option value="">Select interview Round</option>
                      <option value="Shortlisted For Hr Round">Hr Round</option>
                      <option value="Shortlisted For Technical Round">
                        Technical Round
                      </option>
                      <option value="Shortlisted For L1 Round">L1 Round</option>
                      <option value="Shortlisted For L2 Round">L2 Round</option>
                      <option value="Shortlisted For L3 Round">L3 Round</option>
                      <option value="Back Out">Back Out</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hold">Hold</option>
                    </select>
                    {errors.interviewRound && (
                      <div className="error-message">
                        {errors.interviewRound}
                      </div>
                    )}
                  </td>
                )}
                {data.length > 0 && (
                  <td className="p-2">
                    <select
                      className="form-select w-full border rounded text-xs sm:text-base"
                      name="interviewResponse"
                      value={formData.interviewResponse}
                      onChange={handleInputChange}
                      style={{
                        boxShadow: `1px 1px 4px var(--Bg-color)`,
                        lineHeight: "1",
                      }}
                    >
                      <option value="">Choose option</option>
                      <option value="Shortlisted For Hr Round">
                        Shortlisted For Hr Round
                      </option>
                      <option value="Shortlisted For Technical Round">
                        Shortlisted For Technical Round
                      </option>
                      <option value="Shortlisted For L1 Round">
                        Shortlisted For L1 Round
                      </option>
                      <option value="Shortlisted For L2 Round">
                        Shortlisted For L2 Round
                      </option>
                      <option value="Shortlisted For L3 Round">
                        Shortlisted For L3 Round
                      </option>
                      <option value="Back Out">Back Out</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hold">Hold</option>
                    </select>
                    {errors.interviewResponse && (
                      <div className="error-message">
                        {errors.interviewResponse}
                      </div>
                    )}
                  </td>
                )}
                <td className="p-2">
                  <input
                    className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                    type="text"
                    name="commentForTl"
                    value={formData.commentForTl}
                    onChange={handleInputChange}
                    placeholder="Enter Comment here..."
                    style={{
                      boxShadow: `1px 1px 4px var(--Bg-color)`,
                      lineHeight: "1",
                    }}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                    type="date"
                    name="responseUpdatedDate"
                    value={formData.responseUpdatedDate}
                    onChange={handleInputChange}
                    style={{
                      boxShadow: `1px 1px 4px var(--Bg-color)`,
                      lineHeight: "1",
                    }}
                  />
                  {errors.responseUpdatedDate && (
                    <div className="error-message">
                      {errors.responseUpdatedDate}
                    </div>
                  )}
                </td>
                {/* changes by sakshi kashid on 30-06-2025 */}
                {["Back Out", "Selected", "Rejected"].includes(formData.interviewResponse) ? (
                  <td colSpan={2} className="p-2 text-sm italic text-gray-500 text-center">
                    - No further interview -
                  </td>
                ) : (
                  <>
                    <td className="p-2">
                      <input
                        className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                        type="text"
                        name="interviewerName"
                        value={formData.interviewerName}
                        onChange={handleInputChange}
                        placeholder="Enter Name"
                        style={{
                          boxShadow: `1px 1px 4px var(--Bg-color)`,
                          lineHeight: "1",
                        }}
                      />
                      {errors.interviewerName && (
  <div className="error-message">{errors.interviewerName}</div>
)}
                    </td>
                    <td className="p-2">
                      <input
                        className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                        type="date"
                        name="nextInterviewDate"
                        value={formData.nextInterviewDate}
                        onChange={handleInputChange}
                        style={{
                          boxShadow: `1px 1px 4px var(--Bg-color)`,
                          lineHeight: "1",
                        }}
                      />
                      {errors.nextInterviewDate && (
  <div className="error-message">{errors.nextInterviewDate}</div>
)}
                    </td>
                    <td className="p-2">
                      <input
                        className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                        type="time"
                        name="nextInterviewTiming"
                        value={formData.nextInterviewTiming}
                        onChange={handleInputChange}
                        style={{
                          boxShadow: `1px 1px 4px var(--Bg-color)`,
                          lineHeight: "1",
                        }}
                      />
                      {errors.nextInterviewTiming && (
  <div className="error-message">{errors.nextInterviewTiming}</div>
)}
                    </td>
                  </>
                )}

              </tr>
            </tbody>
          </table>
          {/* Show common error message only if no individual errors are displayed */}
          {submited && (
            <div
              style={{
                color: "red",
                marginTop: "10px",
                fontWeight: "500",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              Please fill all required fields marked with <span style={{ color: "red" }}>*</span>
            </div>
          )}





        </div>

      </form>
      <div className="mt-4 flex gap-2 justify-end custompopconfirmUpdateResp1">

        {/* <button className="btn btn-custom" onClick={displayModalForEmailConfirm}>Update</button> */}
        <Button 
        onClick={displayModalForEmailConfirm}
        // disabled={!performanceId}
        >
          Update</Button>
        <Button onClick={onClose}>Close</Button>

      </div>
      {submited && (
        <div className="SCE_Loading_Animation">
          <Loader size={50} color="#ffb281" />
        </div>
      )}
      {displayEmailConfirm && (
<Modal
  title="Send Email?"
  open={displayEmailConfirm}
  onCancel={() => setDisplayEmailConfirm(false)}
  footer={[
    <Button
      key="no"
      onClick={(e) => handleSubmit(e, "No")}
    >
      No
    </Button>,
    <Popconfirm
      key="yes-pop"
      title="Are you sure you want to update?"
      onConfirm={(e) => handleSubmit(e, "Yes")}
      okText="Yes"
      cancelText="No"
    >
      <Button key="yes" type="primary">
        Yes
      </Button>
    </Popconfirm>
  ]}
/>




      )}

      {triggerPopConfirm && (
        <Popconfirm
          title="Are you sure you want to proceed?"
          open={true}
          onConfirm={(e) => {
            setTriggerPopConfirm(false);
            handleSubmit(e, "Yes");
          }}
          onCancel={() => setTriggerPopConfirm(false)}
          okText="Yes"
          cancelText="No"
        >
          {/* This empty span is just to anchor Popconfirm */}
          <span></span>
        </Popconfirm>
      )}



    </div>
  );
};

export default UpdateResponseFrom;

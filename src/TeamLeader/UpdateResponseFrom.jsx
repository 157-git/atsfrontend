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
import { Popconfirm } from "antd";

// SwapnilRokade_UpdateResponseFrom_addedProcessImprovmentEvaluatorFunctionalityStoringInterviweResponse_08_to_486_29/07/2024
const UpdateResponseFrom = ({
  candidateId,
  passedEmployeeId,
  requirementId,
  candidateName,
  employeeName,
  passedJobRole,
  onClose,
}) => {
  const { employeeId, userType } = useParams();
  const [data, setData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [submited, setSubmited] = useState(false);
  const [errors, setErrors] = useState({});
  const [performanceId, setPerformanceId] = useState();

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
      emailStatus:"No"
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
    fetchDataToUpdate();
  }, []);

  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

  const fetchDataToUpdate = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fetch-specific-response/${candidateId}`
      );
      const responseData = await response.json();
      setData(responseData);
      fetchPerformanceId();
    } catch (err) {
      console.log("Error fetching UpdateResponse data:", err);
    }
  };

  const fetchPerformanceId = async () => {
    console.log("candidateId  " + candidateId);
    
    try {
      const performanceId = await axios.get(
        `${API_BASE_URL}/fetch-performance-id/${candidateId}`
      );
      setPerformanceId(performanceId.data);
      console.log(performanceId.data + "performanceId 0001");
      
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.interviewRound) {
      errors.interviewRound = "Interview Round is required";
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

  const handleSubmit = async (e, status) => {
    setSubmited(true);
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmited(false);
      return;
    }

    if (data.length > 0 && formData.interviewResponse === "") {
      setSubmited(false);
      toast.error("Please select an interview response.");
      return;
    }

    try {
      // added by sahil karnekar date 4-12-2024
      console.log(
        "Final formData being sent to API:",
        JSON.stringify(formData, null, 2)
      );

      if (data.length === 0) {
        if (formData.interviewResponse === "") {
          formData.interviewResponse = formData.interviewRound;
        }
      }

      // Create the new object to emit
      const emitObject = {
        employeeId: employeeId,
        userType: userType,
        interviewRound: formData.interviewRound,
        interviewResponse: formData.interviewResponse || "", // Fallback to empty string if not set
        // we will change this letter
        commentForTl: getFormattedDateTime(),
        responseUpdatedDate:
          formData.responseUpdatedDate || formatDateToIST(new Date()),
        nextInterviewDate: formData.nextInterviewDate || "",
        nextInterviewTiming: formData.nextInterviewTiming || "",
        requirementId: formData.requirementId || "",
        callingTracker: { candidateId: candidateId },
        employee: { employeeId: passedEmployeeId },
        candidateName: candidateName, // Added candidateName from props
        employeeName: employeeName, // Added employeeName from props
      };
formData.emailStatus = status === "Yes" ? "Yes" : "No";
console.log(formData);

      const response = await axios.post(
        `${API_BASE_URL}/save-interview-response/${employeeId}/${userType}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Emit object --- :", emitObject);
        socket.emit("interview_schedule", emitObject);
        const firstResponse = response.data;
        console.log(firstResponse);

        const responseUpdatedDateStr = firstResponse.responseUpdatedDate;
        const responseUpdatedDate = new Date(responseUpdatedDateStr);
        const currentDateTime = new Date(); // Current date and time

        const timeDifference = currentDateTime - responseUpdatedDate;
        const absoluteTimeDifference = Math.abs(timeDifference);

        const daysDifference = Math.floor(
          absoluteTimeDifference / (1000 * 60 * 60 * 24)
        );

        const hoursDifference = Math.floor(
          (absoluteTimeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutesDifference = Math.floor(
          (absoluteTimeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const difference = `${daysDifference} days, ${hoursDifference} hours, and ${minutesDifference} minutes.`;

        if (data.length === 0) {
          console.log(formData.interviewRound);
          console.log(formData.interviewResponse);
          const additionalData = {
            mailResponse: currentDateTime,
            interviewRoundsList: [
              {
                interviewRound: formData.interviewRound,
                roundResponse: formData.interviewResponse,
                time: currentDateTime,
                diffBTNRoundToNextRound: 0,
              },
            ],
          };
          console.log("Sending additional data:", additionalData);
          console.log(performanceId + "performanceId 1111111111");
          try {
            const response1 = await axios.put(
              `${API_BASE_URL}/update-performance/${performanceId}`,
              additionalData
            );
            console.log("Second API Response:", response1.data);
            toast.success("Response updated successfully.");
            setSubmited(false);
            onClose(true);
          } catch (error) {
            console.error("Error updating performance data:", error);
            toast.error("Failed to Update Response line 141" + error);
            setSubmited(false);
          }
        } else {
          console.log(formData.interviewRound);
          console.log(formData.interviewResponse);

          const additionalData = {
            interviewRoundsList: [
              {
                interviewRound: formData.interviewRound,
                roundResponse: formData.interviewResponse,
                time: currentDateTime,
                diffBTNRoundToNextRound: difference,
              },
            ],
          };
          try {
      
            const response1 = await axios.put(
              `${API_BASE_URL}/update-performance/${performanceId}`,
              additionalData
            );
            console.log("Second API Response:", response1.data);
            toast.success("Response updated successfully.");
            setSubmited(false);
            onClose(true);
          } catch (error) {
            console.error("Error updating performance data:", error);
            toast.error("Failed to Update Response line 167" + error);
          }
        }
      } else {
        setSubmited(false);
        toast.error("Failed to Update Response line 172");
      }
      onClose(true);
    } catch (err) {
      setSubmited(false);
      toast.error("Failed to Update Response line 176" + err);
    } finally {
      setSubmited(false);
    }
  };

  const handleInputChange = (event, index = null) => {
    let { name, value } = event.target;
    if (index !== null) {
      const updatedData = data.map((entry, i) =>
        i === index ? { ...entry, [name]: value } : entry
      );
      setData(updatedData);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
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

  return (
    <div className="update-response-modal">
      <div className="mb-4">
        <h6 className="text-lg font-semibold">
          {data.length > 0 ? "Update Interview Response" : "Schedule Interview"}
        </h6>
      </div>
      {/* line 222 to 233 updated by sahil karnekar date 14-11-2024 */}
      <form
        // onSubmit={handleSubmit}
        style={{
          overflowX: "scroll",
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
              className="bg-[#ffcb9b] text-gray-500"
              style={{
                backgroundColor: `var(--Bg-color)`,
                lineHeight: "1",
              }}
            >
              <tr>
                <th className="p-2 font-semibold whitespace-nowrap">No</th>
                <th className="p-2 font-semibold whitespace-nowrap">
                  Interview Round
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
                  Update Date
                </th>
                <th className="p-2 font-semibold whitespace-nowrap">
                  Interviewer Name
                </th>
                <th className="p-2 font-semibold whitespace-nowrap">
                  Interview Date
                </th>
                <th className="p-2 font-semibold whitespace-nowrap">
                  Interview Time
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
                      <option value="">Update Response</option>
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
                       type="text"
                      name="nextInterviewTiming"
                      // value={response.nextInterviewTiming}
                      value={convertTo12HourFormat(response.nextInterviewTiming)}
                      onChange={(e) => handleInputChange(e, index)}
                      disabled={index < data.length - 1}
                      placeholder="HH:MM AM/PM" 
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
                      <option value="">Update Response</option>
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
       
      </form>
      <div className="mt-4 flex gap-2 justify-end custompopconfirmUpdateResp1">
      <Popconfirm
  placement="leftTop"
  title={"Do You Want to Send Email to Candidate?"}
  onConfirm={(e) => handleSubmit(e, "Yes")}  // Calls handleSubmit with "Yes" when clicked
  onCancel={(e) => handleSubmit(e, "No")}    // Calls handleSubmit with "No" when clicked
  okText="Yes"
  cancelText="No"
  className="custompopconfirmUpdateResp"
>
  <button className="lineUp-share-btn">Update</button>
</Popconfirm>


         
          <button className="lineUp-share-btn" onClick={onClose}>
            Close
          </button>
        </div>
      {submited && (
        <div className="SCE_Loading_Animation">
          <Loader size={50} color="#ffb281" />
        </div>
      )}
    </div>
  );
};

export default UpdateResponseFrom;

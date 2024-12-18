/* SwapnilRokade_UpdateResponsePage_05/07 */
// Akash_pawar_updateResponse_validation_23/07

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";

// SwapnilRokade_UpdateResponseFrom_addedProcessImprovmentEvaluatorFunctionalityStoringInterviweResponse_08_to_486_29/07/2024
const UpdateResponseFrom = ({ candidateId, onClose }) => {
  const [data, setData] = useState([]);
  const [submited, setSubmited] = useState(false);
  const [errors, setErrors] = useState({});
  const [performanceId, setPerformanceId] = useState();
  const [formData, setFormData] = useState({
    interviewRound: "",
    interviewResponse: "",
    commentForTl: "",
    responseUpdatedDate: "",
    nextInterviewDate: "",
    nextInterviewTiming: "",
    callingTracker: { candidateId: candidateId },
    requirementInfo: { requirementId: 1 },
    employee: { employeeId: 1 },
  });

  useEffect(() => {
    fetchDataToUpdate();
  }, []);

  const fetchDataToUpdate = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fetch-specific-response/${candidateId}`
      );
      const responseData = await response.json();
      console.log(responseData);
      setData(responseData);
      fetchPerformanceId();
    } catch (err) {
      console.log("Error fetching UpdateResponse data:", err);
    }
  };

  const fetchPerformanceId = async () => {
    try {
      const performanceId = await axios.get(
        `${API_BASE_URL}/fetch-performance-id/${candidateId}`
      );
      setPerformanceId(performanceId.data);
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.interviewRound) {
      errors.interviewRound = "Interview Round is required";
    }
    // this lines commented by sahil karnekar please check them if it is required in my scenario there is no required to updation
    // if (!formData.interviewResponse) {
    //   errors.interviewResponse = "Interview Response is required";
    // }
    // if (!formData.responseUpdatedDate) {
    //   errors.responseUpdatedDate = "Update Date is required";
    // }
    return errors;
  };

  // Define formatDateToIST function
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
  const handleSubmit = async (e) => {
    setSubmited(true);
    e.preventDefault();
    const validationErrors = validateForm();
    console.log(validationErrors);
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
      // Save new interview response
      // added by sahil karnekar date 4-12-2024
      console.log(formData);
      if (data.length === 0) {
  if (formData.interviewResponse === "") {
        formData.interviewResponse = formData.interviewRound;
      }
      }
    
      const response = await axios.post(
        `${API_BASE_URL}/save-interview-response`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        console.log("response received");
        const firstResponse = response.data;
        console.log(firstResponse); // Assuming you want the first response's date

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

        console.log(data.length);

        if (data.length === 0) {
          const additionalData = {
            mailResponse: formatDateToIST(currentDateTime),
            interviewRoundsList: [
              {
                interviewRound: "shortListed For Technical Round",
                roundResponse: "shortListed For Technical Round",
                time: formatDateToIST(currentDateTime),
                diffBTNRoundToNextRound: 0,
              },
            ],
          };
          console.log("Sending additional data:", additionalData);
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
          const additionalData = {
            interviewRoundsList: [
              {
                interviewRound: firstResponse.interviewRound,
                roundResponse: firstResponse.interviewResponse,
                time: currentDateTime,
                diffBTNRoundToNextRound: difference,
              },
            ],
          };
          console.log("2 additional data:", additionalData);
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
    }finally{
      setSubmited(false);
    }
  };

  const handleInputChange = (event, index = null) => {
    const { name, value } = event.target;

    if (index !== null) {
      // Update specific entry in `data` at the given index
      const updatedData = data.map((entry, i) =>
        i === index ? { ...entry, [name]: value } : entry
      );
      setData(updatedData);
    } else {
      // Update `formData` for the new entry row
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  console.log(data);
  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-full">
      <div className="mb-4">
        <h6 className="text-lg font-semibold">{data.length > 0 ? "Update Interview Response" : "Schedule Interview"}</h6>
      </div>
      {/* line 222 to 233 updated by sahil karnekar date 14-11-2024 */}
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto"
        style={{
          width: "fit-content"
        }}
        >
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-[#ffcb9b] text-gray-500"
            style={{
              backgroundColor:`var(--Bg-color)`,
              lineHeight:"1",
            }}
            >
              <tr>
                <th className="p-2 font-semibold text-xs sm:text-base">No</th>
                <th className="p-2 font-semibold text-xs sm:text-base">
                  Interview Round
                </th>
                {data.length > 0 && (
                  <th className="p-2 font-semibold text-xs sm:text-base">
                  Interview Response
                </th>
                )}

                <th className="p-2 font-semibold text-xs sm:text-base">
                  Comment for TL
                </th>
                <th className="p-2 font-semibold text-xs sm:text-base">
                  Update Date
                </th>
                <th className="p-2 font-semibold text-xs sm:text-base">
                  Interview Date
                </th>
                <th className="p-2 font-semibold text-xs sm:text-base">
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
                              lineHeight:"1",
                            }
                          : {boxShadow: `1px 1px 4px var(--Bg-color)`, lineHeight:"1",}
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
                      {/* lines added by sahil karnekar this lines added in all the selectors  */}
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hold">Hold</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      className="form-select w-full border rounded text-xs sm:text-base"
                      name="interviewResponse"
                      value={response.interviewResponse ? response.interviewResponse : response.interviewRound}
                      onChange={(e) => handleInputChange(e, index)}
                      disabled={index < data.length - 1}
                      style={index < data.length - 1
                        ? {
                            backgroundImage: "none",
                            boxShadow: `1px 1px 4px var(--Bg-color)`,
                            lineHeight:"1",
                          }
                        : {boxShadow: `1px 1px 4px var(--Bg-color)`,lineHeight:"1",}}
                    >
                      <option value="">Update Response</option>
                      <option value="Shortlisted For Hr Round">Hr Round</option>
                      <option value="Shortlisted For Technical Round">
                        Technical Round
                      </option>
                      <option value="Shortlisted For L1 Round">L1 Round</option>
                      <option value="Shortlisted For L2 Round">L2 Round</option>
                      <option value="Shortlisted For L3 Round">L3 Round</option>
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
                        lineHeight:"1",
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
                        lineHeight:"1",
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
                        lineHeight:"1",
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                      type="time"
                      name="nextInterviewTiming"
                      value={response.nextInterviewTiming}
                      onChange={(e) => handleInputChange(e, index)}
                      disabled={index < data.length - 1}
                      style={{
                        boxShadow: `1px 1px 4px var(--Bg-color)`,
                        lineHeight:"1",
                      }}
                    />
                  </td>
                </tr>
              ))}
              <tr className="border-b">
                <td className="p-2 text-xs sm:text-base"></td>
                { data.length > 0 ? (
                <td className="p-2">
                  <select
                    className="form-select w-full border rounded text-xs sm:text-base"
                    name="interviewRound"
                    // retriving data added by sahil karnekar
                    value={formData.interviewRound = data[data.length - 1].interviewResponse ? data[data.length - 1].interviewResponse : data[data.length - 1].interviewRound}
                    onChange={handleInputChange}
                    style={{
                      boxShadow: `1px 1px 4px var(--Bg-color)`,
                      lineHeight:"1",
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
                    <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hold">Hold</option>
                  </select>
                  {errors.interviewRound && (
                    <div className="error-message">{errors.interviewRound}</div>
                  )}
                </td>
                ):(
                  <td className="p-2">
                  <select
                    className="form-select w-full border rounded text-xs sm:text-base"
                    name="interviewRound"
                    value={formData.interviewRound}
                    onChange={handleInputChange}
                    style={{
                      boxShadow: `1px 1px 4px var(--Bg-color)`,
                      lineHeight:"1",
                    }}
                  >
                    <option value="">Select interview Round</option>
                    <option value="Shortlisted For Hr Round">
                      Hr Round
                    </option>
                    <option value="Shortlisted For Technical Round">
                      Technical Round
                    </option>
                    <option value="Shortlisted For L1 Round">
                      L1 Round
                    </option>
                    <option value="Shortlisted For L2 Round">
                      L2 Round
                    </option>
                    <option value="Shortlisted For L3 Round">
                      L3 Round
                    </option>
                    <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hold">Hold</option>
                  </select>
                  {errors.interviewRound && (
                    <div className="error-message">{errors.interviewRound}</div>
                  )}
                </td>
                )
              }
                { data.length > 0 && (
                <td className="p-2">
                  <select
                    className="form-select w-full border rounded text-xs sm:text-base"
                    name="interviewResponse"
                    value={formData.interviewResponse}
                    onChange={handleInputChange}
                    style={{
                      boxShadow: `1px 1px 4px var(--Bg-color)`,
                      lineHeight:"1",
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
                )
                }
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
                      lineHeight:"1",
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
                      lineHeight:"1",
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
                    type="date"
                    name="nextInterviewDate"
                    value={formData.nextInterviewDate}
                    onChange={handleInputChange}
                    style={{
                      boxShadow: `1px 1px 4px var(--Bg-color)`,
                      lineHeight:"1",
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
                      lineHeight:"1",
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <button className="lineUp-share-btn" type="submit">
            Update
          </button>
          <button className="lineUp-share-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
      {submited && (
        <div className="SCE_Loading_Animation">
          <Loader size={50} color="#ffb281" />
        </div>
      )}
    </div>
  );
};

export default UpdateResponseFrom;
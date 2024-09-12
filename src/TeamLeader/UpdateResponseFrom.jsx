/* SwapnilRokade_UpdateResponsePage_05/07 */
// Akash_pawar_updateResponse_validation_23/07

import axios from "axios";
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";


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
  }

  const validateForm = () => {
    let errors = {};
    if (!formData.interviewRound) {
      errors.interviewRound = "Interview Round is required";
    }
    if (!formData.interviewResponse) {
      errors.interviewResponse = "Interview Response is required";
    }
    if (!formData.responseUpdatedDate) {
      errors.responseUpdatedDate = "Update Date is required";
    }
    return errors;
  };


  const handleSubmit = async (e) => {
    setSubmited(true);
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      // Save new interview response
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
      if (response) {
        console.log("response received");
        const firstResponse = response.data;
        console.log(firstResponse); // Assuming you want the first response's date

        const responseUpdatedDateStr = firstResponse.responseUpdatedDate;
        const responseUpdatedDate = new Date(responseUpdatedDateStr);
        const currentDateTime = new Date(); // Current date and time

        const timeDifference = currentDateTime - responseUpdatedDate;
        const absoluteTimeDifference = Math.abs(timeDifference);

        const daysDifference = Math.floor(absoluteTimeDifference / (1000 * 60 * 60 * 24));

        const hoursDifference = Math.floor((absoluteTimeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesDifference = Math.floor((absoluteTimeDifference % (1000 * 60 * 60)) / (1000 * 60));
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
                diffBTNRoundToNextRound: 0
              }
            ]
          };
          console.log("Sending additional data:", additionalData);
          try {
            const response1 = await axios.put(
              `${API_BASE_URL}/update-performance/${performanceId}`,
              additionalData
            );
            console.log("Second API Response:", response1.data);
            toast.success("Response updated successfully.");
            setSubmited(false)
            onClose(true);
          } catch (error) {
            console.error("Error updating performance data:", error);
            toast.error("Failed to Update Response");
            setSubmited(false)
          }
        } else {
          const additionalData = {
            interviewRoundsList: [
              {
                interviewRound: firstResponse.interviewRound,
                roundResponse: firstResponse.interviewResponse,
                time: currentDateTime,
                diffBTNRoundToNextRound: difference
              }
            ]
          };
          console.log("2 additional data:", additionalData);
          try {
            const response1 = await axios.put(
              `${API_BASE_URL}/update-performance/${performanceId}`,
              additionalData
            );
            console.log("Second API Response:", response1.data);
            toast.success("Response updated successfully.");
            setSubmited(false)
            onClose(true);
          } catch (error) {
            console.error("Error updating performance data:", error);
            toast.error("Failed to Update Response");
          }
        }
      } else {
        setSubmited(false)
        toast.error("Failed to Update Response");
      }
    } catch (err) {
      setSubmited(false)
      toast.error("Failed to Update Response");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-full">
      <div className="mb-4">
        <h6 className="text-lg font-semibold">Response Update</h6>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-[#ffcb9b] text-gray-500">
              <tr>
                <th className="p-2 font-semibold text-xs sm:text-base">No</th>
                <th className="p-2 font-semibold text-xs sm:text-base">
                  Interview Round
                </th>
                <th className="p-2 font-semibold text-xs sm:text-base">
                  Interview Response
                </th>
                <th className="p-2 font-semibold text-xs sm:text-base">
                  Comment for TL
                </th>
                <th className="p-2 font-semibold text-xs sm:text-base">
                  Update Date
                </th>
                <th className="p-2 font-semibold text-xs sm:text-base">
                  Next Interview Date
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
                      onChange={handleInputChange}
                    >
                      <option value="">Select Interview</option>
                      <option value="Shortlisted For Hr Round">Hr Round</option>
                      <option value="Shortlisted For Technical Round">
                        Technical Round
                      </option>
                      <option value="Shortlisted For L1 Round">L1 Round</option>
                      <option value="Shortlisted For L2 Round">L2 Round</option>
                      <option value="Shortlisted For L3 Round">L3 Round</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      className="form-select w-full border rounded text-xs sm:text-base"
                      name="interviewResponse"
                      value={response.interviewResponse}
                      onChange={handleInputChange}
                    >
                      <option value="">Update Response</option>
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
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                      type="text"
                      name="commentForTl"
                      value={response.commentForTl}
                      onChange={handleInputChange}
                      placeholder="Enter Comment here..."
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                      type="date"
                      name="responseUpdatedDate"
                      value={response.responseUpdatedDate}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                      type="date"
                      name="nextInterviewDate"
                      value={response.nextInterviewDate}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                      type="time"
                      name="nextInterviewTiming"
                      value={response.nextInterviewTiming}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
              ))}
              <tr className="border-b">
                <td className="p-2 text-xs sm:text-base"></td>
                <td className="p-2">
                  <select
                    className="form-select w-full border rounded text-xs sm:text-base"
                    name="interviewRound"
                    value={formData.interviewRound}
                    onChange={handleInputChange}
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
                  </select>
                  {errors.interviewRound && (
                    <div className="error-message">{errors.interviewRound}</div>
                  )}
                </td>
                <td className="p-2">
                  <select
                    className="form-select w-full border rounded text-xs sm:text-base"
                    name="interviewResponse"
                    value={formData.interviewResponse}
                    onChange={handleInputChange}
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
                <td className="p-2">
                  <input
                    className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                    type="text"
                    name="commentForTl"
                    value={formData.commentForTl}
                    onChange={handleInputChange}
                    placeholder="Enter Comment here..."
                  />
                </td>
                <td className="p-2">
                  <input
                    className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                    type="date"
                    name="responseUpdatedDate"
                    value={formData.responseUpdatedDate}
                    onChange={handleInputChange}
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
                  />
                </td>
                <td className="p-2">
                  <input
                    className="w-full px-3 py-1.5 border rounded text-xs sm:text-base"
                    type="time"
                    name="nextInterviewTiming"
                    value={formData.nextInterviewTiming}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <button
            className="lineUp-share-btn"
            type="submit"
          >
            Update
          </button>
          <button className="lineUp-share-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
      {submited && (
        <div className="SCE_Loading_Animation">
          <ClipLoader size={50} color="#ffb281" />
        </div>
      )}
    </div>

  );
};

export default UpdateResponseFrom;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/api";
import "./interviewPreviousQuestion.css";
import { DeleteOutlined, UploadOutlined, EyeOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const InterviewPreviousQuestion = () => {
  const [requirementOptions, setRequirementOptions] = useState([]); // Requirement dropdown options
  const [selectedRequirement, setSelectedRequirement] = useState(""); // Selected RequirementId
  const [interviewDetails, setInterviewDetails] = useState([]); // List of interview details
  const [selectedInterviewDetailsId, setSelectedInterviewDetailsId] =
    useState(""); // Selected InterviewDetailsId
  const [questions, setQuestions] = useState([]); // Interview questions list
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message
  const [interviewForm, setInterviewForm] = useState({
    requirementId: "",
    question: "",
    answer: ""
  });

  useEffect(() => {
    const savedJobId = localStorage.getItem("selectedJobId");
    if (savedJobId) {
      setInterviewForm((prev) => ({
        ...prev,
        requirementId: savedJobId,
      }));
      fetchInterviewDetails(savedJobId); // << fetch interview details here
      setSelectedRequirement(savedJobId); // optional, if you want dropdown to reflect selection
    }
  }, []);



  useEffect(() => {
    fetchRequirementOptions();
  }, []);

  const fetchRequirementOptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company-details`);
      setRequirementOptions(response.data);
      console.log("Requirement options:", response.data);
    } catch (error) {
      console.error("Error fetching requirement options:", error);
    }
  };

  const fetchInterviewDetails = async (requirementId) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/get-interview-details/${requirementId}`
      );
      if (response.status === 200) {
        setInterviewDetails(response.data); // Store interview details

        setQuestions([]); // Clear previous questions
        // when setting state in fetchInterviewDetails
        // setQuestions(
        //   response.data.flatMap(item =>
        //     item.interviewQuestion.map(q => ({
        //       ...q,
        //       questionAttachment: item.questionAttachment, // attach the Base64 here
        //     }))
        //   )
        // );

      } else {
        setError(
          `No interview details found for Requirement ID: ${requirementId}`
        );
        setInterviewDetails([]);
      }
    } catch (error) {
      setError(
        `Error fetching interview details: ${error.response?.data || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };
  console.log(interviewDetails);

  const handleRequirementChange = (e) => {
    const selectedId = e.target.value;
    setSelectedRequirement(selectedId);

    setSelectedInterviewDetailsId("");
    setQuestions([]);

    setInterviewDetails([]);

    if (selectedId) {
      fetchInterviewDetails(selectedId);
    }
  };

  const handleInterviewDetailsChange = (e) => {
    const selectedId = e.target.value;
    setSelectedInterviewDetailsId(selectedId);

    const selectedInterview = interviewDetails.find(
      (item) => item.interviewDetailsId === Number(selectedId)
    );

    if (selectedInterview) {
      // Flatten questions and attach Base64 attachment from the parent
      const qs = (selectedInterview.interviewQuestion || []).map((q) => ({
        ...q,
        questionAttachment: selectedInterview.questionAttachment, // attach here
      }));
      setQuestions(qs);
    } else {
      setQuestions([]);
    }
  };

  const handleDeleteQuestionByQuestionId = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete-interview-questions/${id}`);

      if (response.status === 200) {
        toast.success(response.data.message || "Question deleted successfully!");

        // Assuming you have a state variable like setQuestions to update the UI
        setQuestions((prevQuestions) => prevQuestions.filter((q) => q.questionsId !== id));
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete the question.");
    }
  };

  const handleViewAttachment = (base64Data) => {
    try {
      // Convert Base64 string to byte array
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob (assuming PDF, adjust MIME type if needed)
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Open in new tab
      window.open(url, "_blank");

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Error opening attachment:", error);
    }
  };

  return (
    <div className="previousQuestion">
       <div className="interview-previous-question-main-div">
        <div className="question-form-group">
          <label>Select Job ID</label>
          <select
            id="requirementId"
            name="requirementId"
            value={interviewForm.requirementId}
            onChange={(e) => {
              const value = e.target.value;
              setInterviewForm((prev) => ({
                ...prev,
                requirementId: value,
              }));
              if (value) {
                fetchInterviewDetails(value);
              }
            }}
          >
            <option value="" disabled>
              Select Job Id
            </option>
            {requirementOptions.map((option) => (
              <option key={option.requirementId} value={option.requirementId}>
                {option.requirementId} - {option.designation}
              </option>
            ))}
          </select>


        </div>

        <div className="question-form-group">
          <label>Select Interview Round</label>
          <select
            value={selectedInterviewDetailsId}
            onChange={handleInterviewDetailsChange}
            style={{ width: "100%" }}
          >
            <option value="">Select Interview Round</option>
            {interviewDetails.map((interview) => (
              <option
                key={interview.interviewDetailsId}
                value={interview.interviewDetailsId}
              >
                {interview.interviewRound} ({interview.questionAddedDate})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {selectedInterviewDetailsId && questions.length > 0 && (
        <div className="interview-previous-question-table-main-div">
          <table className="interview-previous-question-table">
            <thead>
              <tr className="interview-previous-question-table-header">
                <th>Question No</th>
                <th>Questions</th>
                <th>Answer Reference</th>
                <th>Delete</th>
                <th>Attachment</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={question.questionsId}>
                  <td>{index + 1}</td>
                  <td>{question.interviewQuestions}</td>
                  <td>{question.questionsReference}</td>
                  <td>
                    <DeleteOutlined
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() =>
                        handleDeleteQuestionByQuestionId(question.questionsId)
                      }
                    />
                  </td>
                  <td>
                    <EyeOutlined
                      style={{
                        color: question.questionAttachment ? "green" : "gray",
                        cursor: question.questionAttachment ? "pointer" : "not-allowed",
                      }}
                      onClick={() => {
                        if (question.questionAttachment) {
                          handleViewAttachment(question.questionAttachment);
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default InterviewPreviousQuestion;

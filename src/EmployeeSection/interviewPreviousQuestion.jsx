import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/api";
import "./interviewPreviousQuestion.css";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const InterviewPreviousQuestion = () => {
  const [requirementOptions, setRequirementOptions] = useState([]); // Requirement dropdown options
  const [selectedRequirement, setSelectedRequirement] = useState(""); // Selected RequirementId
  const [interviewDetails, setInterviewDetails] = useState([]); // List of interview details
  const [selectedInterviewDetailsId, setSelectedInterviewDetailsId] =
    useState(""); // Selected InterviewDetailsId
  const [questions, setQuestions] = useState([]); // Interview questions list
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message

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
      } else {
        setError(
          `No interview details found for Requirement ID: ${requirementId}`
        );
        setInterviewDetails([]);
      }
    } catch (error) {
      setError(
        `Error fetching interview details: ${
          error.response?.data || error.message
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
      setQuestions(selectedInterview.interviewQuestion);
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
  
  return (
    <div className="previousQuestion">
      <div className="Previous-Questions-Header">
        <h5>Previous Questions</h5>
      </div>

      <div className="interview-previous-question-main-div">
        <div className="question-form-group">
          <label>Select Job ID</label>
          <select
            value={selectedRequirement}
            onChange={handleRequirementChange}
            style={{ width: "100%" }}
          >
            <option value="">Select Job Id</option>
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

      {questions.length > 0 && (
        <div className="interview-previous-question-table-main-div">
          <table className="interview-previous-question-table">
            <thead>
              <tr className="interview-previous-question-table-header">
                <th>Question No</th>
                <th>Questions</th>
                <th>Answer Reference</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr
                  key={question.questionsId}
                  className="interview-previous-question-table-row"
                >
                  <td>{index + 1}</td>
                  <td>{question.interviewQuestions}</td>
                  <td>{question.questionsReference}</td>
                  <td><DeleteOutlined onClick={(e)=>handleDeleteQuestionByQuestionId(question.questionsId)} /></td>
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

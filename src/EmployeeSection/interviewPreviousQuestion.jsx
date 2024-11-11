import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/api";

const InterviewPreviousQuestion = () => {
  // State to manage user input and API data
  const [jobId, setJobId] = useState(""); // For storing the entered Job ID
  const [interviewData, setInterviewData] = useState(null); // For storing fetched interview data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch interview data based on jobId
  const fetchInterviewData = async (id) => {
    setLoading(true);
    setError(""); // Reset error state on new fetch

    try {
      const response = await axios.get(
        `${API_BASE_URL}/interview-questions/${id}`
      );
      setInterviewData(response.data); // Set the fetched interview data
    } catch (error) {
      setError("Failed to fetch interview data. Please try again later."); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetch attempt
    }
  };

  // Handle change in jobId input field
  const handleJobIdChange = (e) => {
    const value = e.target.value;
    setJobId(value); // Update the jobId state

    if (value) {
      fetchInterviewData(value); // Fetch data if jobId is entered
    } else {
      setInterviewData(null); // Reset interview data if jobId is cleared
    }
  };

  return (
    <div>
      <div className="previousQuestion">
        <h5>Previous Question</h5>
        <div className="form-group">
          {/* <label htmlFor="jobId">Job Id</label> */}
          <input
            type="text"
            id="jobId"
            className="form-control"
            placeholder="Enter Job Id"
            value={jobId}
            onChange={handleJobIdChange} // Handle jobId change
          />
        </div>

        {/* Display loading state */}
        {loading && <p>Loading...</p>}

        {/* Display error message if there's an error */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Display the interview details if data is available */}
        {interviewData && (
          <>
            <div className="interview-name-div">
              <p className="card-content"><strong>Interviewer : - </strong>{`${interviewData.interviewerName}`}</p>
              <p className="card-content"><strong>Duration :- </strong>{`${interviewData.interviewDuration}`}</p>
            </div>

            {/* Display Asked Questions */}
            <div className="card">
              <h2 className="card-title">Asked Questions</h2>
              {interviewData.askedQuestions && interviewData.askedQuestions.length > 0 ? (
                interviewData.askedQuestions.map((question, index) => (
                  <p key={index} className="card-content">
                    Q.{index + 1}: {question}
                  </p>
                ))
              ) : (
                <p>No asked questions available.</p>
              )}
            </div>

            {/* Display Unanswered Questions */}
            <div className="card">
              <h2 className="card-title">Unanswered Questions</h2>
              {interviewData.unansweredQuestions && interviewData.unansweredQuestions.length > 0 ? (
                interviewData.unansweredQuestions.map((question, index) => (
                  <p key={index} className="card-content">
                    Q.{index + 1}: {question}
                  </p>
                ))
              ) : (
                <p>No unanswered questions available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewPreviousQuestion;

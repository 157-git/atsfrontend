import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/api";

const InterviewPreviousQuestion = () => {
  // State to manage user input and API data
  const [jobId, setJobId] = useState(""); // For storing the entered Job ID
  const [interviewData, setInterviewData] = useState(null); // For storing fetched interview data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  //Arshad Attar Added This New Function On 19-11-2024 According to new Backend Logic, 
  // Fetch interview data based on jobId
  const fetchInterviewData = async (id) => {
    setLoading(true);
    setError(""); 
  
    try {
      const response = await axios.get(`${API_BASE_URL}/interview-questions/${id}`);
  
      if (response.status === 200) {
        // Successfully fetched data
        setInterviewData(response.data); // Set the fetched interview data
      } else if (response.status === 404) {
        // Data not foundIn
        setError(response.data || `Interview Questions not found for Job ID : -  ${id}`);
        setInterviewData([]); // Clear any existing data
      }
    } catch (error) {
      // Handle errors returned by the backend or network errors
      const backendErrorMessage = error.response?.data || `An error occurred while fetching data for Job ID: ${id}`;
      setError(backendErrorMessage);
    } finally {
      setLoading(false); // Ensure loading is stopped after the fetch attempt
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

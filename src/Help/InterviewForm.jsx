// Name : Shubhangi Mahadev Metkari
// Date : 24-10-2024
//Task: save the Interview Form data.
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./InterviewForm.css";
import { API_BASE_URL } from "../api/api";
import { toast } from "react-toastify";
import Loader from "../EmployeeSection/loader";

const InterviewForm = ({ toggleAllInterviewResponse }) => {
  const [formData, setFormData] = useState({
    candidateId: "",
    candidateName: "",
    requirementId: "",
    companyName: "",
    designation: "",
    interviewType: "",
    interviewStatus: "",
    interviewerName: "",
    interviewDuration: "",
    questionsAsked: [""],
    unansweredQuestions: [""],
    comments: "",
    reasonForNotAttend: "",
    requestReschedule: "",
    attendingStatus: "",
    responseGiven: "",
    comment: "",
  });

  const initialInterviewDataState = {
    jobDesignation: "",
    requirementId: "",
    requirementCompany: "",
  };

  const { employeeId } = useParams();
  const [interviewData, setInterviewData] = useState(initialInterviewDataState);
  const [showReminder, setShowReminder] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showNoFields, setShowNoFields] = useState(false);
  const [showYetToBeConfirmedFields, setShowYetToBeConfirmedFields] =
    useState(false);
  const [errors, setErrors] = useState({});

  const [requirementOptions, setRequirementOptions] = useState([]);
  const [candidateData, setCandidateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCandidateData, setNewCandidateData] = useState({
    candidateId: "",
    candidateName: "",
    candidateInterview: "",
    candidateInterviewTime: "",
  });

  useEffect(() => {
    fetchRequirementOptions();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      interviewStatus: value,
    });
    if (value === "Yes") {
      setShowReminder(false);
      setShowAdditionalFields(true);
      setShowNoFields(false);
      setShowYetToBeConfirmedFields(false);
    } else if (value === "NO") {
      setShowReminder(false);
      setShowAdditionalFields(false);
      setShowNoFields(true);
      setShowYetToBeConfirmedFields(false);
    } else if (value === "Yet to be confirmed") {
      setShowReminder(false);
      setShowAdditionalFields(false);
      setShowNoFields(false);
      setShowYetToBeConfirmedFields(true);
    } else {
      setShowReminder(true);
      setShowAdditionalFields(false);
      setShowNoFields(false);
      setShowYetToBeConfirmedFields(false);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      ...newCandidateData,
      ...interviewData,
    }));
    setFormData((prevState) => ({
      ...prevState,
      ...newCandidateData,
      ...interviewData,
    }));

    if (!formData.candidateId || !formData.requirementId) {
      console.error("Candidate ID or Requirement ID is not set.");
      toast.error("Please Select Job Id & Candidate Id");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/save-interview-data`, {
        candidateId: formData.candidateId,
        requirementId: formData.requirementId,
        requirementCompany: formData.companyName,
        jobDesignation: formData.designation,
        candidateName: formData.candidateName,
        interviewType: formData.interviewType,
        interviewStatus: formData.interviewStatus,
        interviewerName: formData.interviewerName,
        interviewDuration: formData.interviewDuration,
        questionsAsked: formData.questionsAsked,
        unansweredQuestions: formData.unansweredQuestions,
        comments: formData.comments,
        reasonForNotAttend: formData.reasonForNotAttend,
        requestReschedule: formData.requestReschedule,
        attendingStatus: formData.attendingStatus,
        responseGiven: formData.responseGiven,
        comment: formData.comment,
      });
      console.log("Response:", response.data);
      setLoading(true);
      toast.success("Interview Question Added Successfully...");

      setFormData({
        candidateId: "",
        candidateName: "",
        requirementId: "",
        companyName: "",
        designation: "",
        interviewType: "",
        interviewStatus: "",
        interviewerName: "",
        interviewDuration: "",
        questionsAsked: [""],
        unansweredQuestions: [""],
        comments: "",
        reasonForNotAttend: "",
        requestReschedule: "",
        attendingStatus: "",
        responseGiven: "",
        comment: "",
      });

      setNewCandidateData({
        candidateId: "",
        candidateName: "",
        candidateInterview: "",
        candidateInterviewTime: "",
      });
      setInterviewData(initialInterviewDataState);
      setShowReminder(false);
      setShowAdditionalFields(false);
      setShowNoFields(false);
      setShowYetToBeConfirmedFields(false);
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("An error occurred: " + error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available job requirements for dropdown
  const fetchRequirementOptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company-details`);
      setRequirementOptions(response.data);
    } catch (error) {
      console.error("Error fetching requirement options:", error);
    }
  };

  // Fetch candidate details based on selected job ID
  const fetchRequirementIdCandidate = async (requirementId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/candidate-details/${requirementId}`
      );
      setCandidateData(response.data);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
    }
  };

  // Handle Job ID selection and fetch company and designation details
  const handleRequirementChange = (e) => {
    const { value } = e.target;
    const selectedRequirement = requirementOptions.find(
      (requirement) => requirement.requirementId === parseInt(value)
    );

    if (selectedRequirement) {
      // Update the form data with selected job details
      setFormData((prevData) => ({
        ...prevData,
        requirementId: selectedRequirement.requirementId,
        companyName: selectedRequirement.companyName,
        designation: selectedRequirement.designation,
      }));

      // Fetch related candidates for the selected job ID
      fetchRequirementIdCandidate(selectedRequirement.requirementId);
    }
  };

  // Handle Candidate ID selection and fetch candidate details
  const handleCandidateChange = (e) => {
    const { value } = e.target;
    const selectedCandidate = candidateData.find(
      (candidate) => candidate[0] === parseInt(value)
    );

    if (selectedCandidate) {
      setFormData((prevData) => ({
        ...prevData,
        candidateId: selectedCandidate[0], // Set the selected candidate ID
        candidateName: selectedCandidate[1],
        candidateInterview: selectedCandidate[2],
        candidateInterviewTime: selectedCandidate[3],
      }));
    }
  };

  // Function to handle input changes
  const handleUnansweredQuestionChange = (index, value) => {
    const updatedQuestions = [...formData.unansweredQuestions];
    updatedQuestions[index] = value; // Update the specific question
    setFormData({
      ...formData,
      unansweredQuestions: updatedQuestions, // Set the updated array
    });
  };

  // Function to handle changes in the question input fields
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...formData.questionsAsked];
    updatedQuestions[index] = value; // Update the specific question
    setFormData({
      ...formData,
      questionsAsked: updatedQuestions, // Set the updated array back to the state
    });
  };

  // Function to add a new input field
  const addNewQuestionField = () => {
    setFormData({
      ...formData,
      questionsAsked: [...formData.questionsAsked, ""],
    });
  };

  const addNewQuestionFieldforunans = () => {
    setFormData({
      ...formData,
      unansweredQuestions: [...formData.unansweredQuestions, ""],
    });
  };

  return (
    <div>
      {loading ? (
        <div className="register">
          <Loader></Loader>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="dhann-container">
              <div className="card left-card">
                <div className="dhansform-group">
                  <div className="dhansform-label-input">
                    <div className="dhansform-label">
                      <label>Job Id</label>
                    </div>

                    <div>
                      <select
                        id="requirementId"
                        name="requirementId"
                        value={formData.requirementId}
                        onChange={handleRequirementChange}
                      >
                        <option value="">Select Job ID</option>
                        {requirementOptions.map((option) => (
                          <option
                            key={option.requirementId}
                            value={option.requirementId}
                          >
                            {option.requirementId} - {option.companyName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="dhansform-group">
                  <div className="dhansform-label-input">
                    <div className="dhansform-label">
                      <label>Company Name : </label>
                    </div>
                    <div className="job-id-side-input">
                      <input
                        type="text"
                        id="requirementCompany"
                        name="requirementCompany"
                        value={formData.companyName}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="dhansform-group">
                  <div className="dhansform-label-input">
                    <div className="dhansform-label">
                      <label>Designation:</label>
                    </div>
                    <div className="job-id-side-input">
                      <input
                        type="text"
                        id="jobDesignation"
                        name="jobDesignation"
                        value={formData.designation}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="dhansform-group">
                  <div className="dhansform-label-input">
                    <div className="dhansform-label">
                      <label>Candidate Id</label>
                    </div>
                    <div>
                      <select
                        id="candidateId"
                        name="candidateId"
                        value={formData.candidateId}
                        onChange={handleCandidateChange}
                      >
                        <option value="">Select Candidate ID</option>
                        {Array.isArray(candidateData) &&
                          candidateData.map((option) => (
                            <option key={option[0]} value={option[0]}>
                              {option[0]} -{option[1]}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="dhansform-group">
                  <div className="dhansform-label-input">
                    <div className="dhansform-label">
                      <label>Candidate Name</label>
                    </div>
                    <div className="job-id-side-input">
                      <input
                        type="text"
                        id="candidateName"
                        name="candidateName"
                        value={formData.candidateName}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="dhansform-group">
                  <div className="dhansform-label-input">
                    <div className="dhansform-label">
                      <label>Interview Schedule Time:</label>
                    </div>
                    <div className="job-id-side-input">
                      <input
                        type="text"
                        id="candidateInterviewTime"
                        name="candidateInterviewTime"
                        value={formData.candidateInterviewTime}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="dhansform-group">
                  <div className="dhansform-label-input">
                    <div className="dhansform-label">
                      <label>Interview Type:</label>
                    </div>
                    <div className="job-id-side-input">
                      <input
                        type="text"
                        id="candidateInterview"
                        name="candidateInterview"
                        value={formData.candidateInterview}
                        readOnly
                      />
                    </div>
                  </div>
                  {/* Arshad Attar Commented This 20-10-2024 */}
                  {/* <div className='interview-question-view-btn'>
                <button className='submit-button' onClick={toggleAllInterviewResponse}>View all Responses</button>
              </div> */}
                </div>
              </div>

              <div className="SampleBhagya">
                <div className="card right-card">
                  <div className="dhansform-group">
                    <div className="dhansform-label-input">
                      <div className="dhansform-label">
                        <label>Interview Status:</label>
                      </div>
                      <div className="dhansform-input">
                        <select
                          name="interviewStatus"
                          value={formData.interviewStatus}
                          onChange={handleStatusChange}
                          className="bhagyainput"
                        >
                          <option value="">Select Status</option>
                          <option value="Yes">Yes</option>
                          <option value="NO">No</option>
                          <option value="Yet to be confirmed">
                            Yet to be confirmed
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {showAdditionalFields && (
                    <div>
                      {/* Additional fields for "Yes" status */}
                      <div className="dhansform-group">
                        <div className="dhansform-label-input">
                          <div className="dhansform-label">
                            <label>Who has taken the interview:</label>
                          </div>
                          <div className="dhansform-input">
                            <input
                              type="text"
                              name="interviewerName"
                              value={formData.interviewerName}
                              onChange={handleChange}
                              placeholder="Name of the interviewer"
                              className="bhagyainput"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="dhansform-group">
                        <div className="dhansform-label-input">
                          <div className="dhansform-label">
                            <label>Duration of the interview:</label>
                          </div>
                          <div className="dhansform-input">
                            <input
                              type="text"
                              name="interviewDuration"
                              value={formData.interviewDuration}
                              onChange={handleChange}
                              placeholder="Enter Duration"
                              className="bhagyainput"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="dhansform-group">
                        <div className="dhansform-label-input">
                          <div className="dhansform-label">
                            <label>Questions asked in the interview:</label>
                          </div>

                          <div className="dhansform-input">
                            {formData.questionsAsked.map((question, index) => (
                              <div key={index}>
                                <input
                                  type="text"
                                  value={question}
                                  onChange={(e) =>
                                    handleQuestionChange(index, e.target.value)
                                  }
                                  placeholder={`Enter Question ${index + 1}`}
                                  className="bhagyainput"
                                />
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={addNewQuestionField}
                              className="submit-button"
                            >
                              Add Answered Question
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* <div className="dhansform-group">
              <div className="dhansform-label-input">
                <div className="dhansform-label">
                  <label>Which questions you answered?</label>
                </div>

                <div className="dhansform-input">
                  <input
                    type="text"
                    name="answersGiven"
                    value={formData.answersGiven}
                    onChange={handleChange}
                    placeholder="Enter Answers Given"
                    className="bhagyainput"
                  />
                </div>
              </div>
            </div> */}

                      <div className="dhansform-group">
                        <div className="dhansform-label-input">
                          <div className="dhansform-label">
                            <label>Unanswered Questions:</label>
                          </div>

                          <div className="dhansform-input">
                            {formData.unansweredQuestions.map(
                              (question, index) => (
                                <div key={index}>
                                  <input
                                    type="text"
                                    value={question}
                                    onChange={(e) =>
                                      handleUnansweredQuestionChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Enter Unanswered Question ${
                                      index + 1
                                    }`}
                                    className="bhagyainput"
                                  />
                                </div>
                              )
                            )}

                            <button
                              type="button"
                              onClick={addNewQuestionFieldforunans}
                              className="submit-button"
                            >
                              Add Unanswered Question
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="dhansform-group">
                        <div className="dhansform-label-input">
                          <div className="dhansform-label">
                            <label>Comment:</label>
                          </div>
                          <div className="dhansform-input">
                            <input
                              type="text"
                              name="comments"
                              value={formData.comments}
                              onChange={handleChange}
                              placeholder="Enter The Comment Below"
                              className="bhagyainput"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {showNoFields && (
                    <div>
                      {/* Fields for "No" status */}
                      <div className="dhansform-group">
                        <div className="dhansform-label-input">
                          <div className="dhansform-label">
                            <label>Request to Reschedule:</label>
                          </div>
                          <div className="dhansform-input">
                            <input
                              type="text"
                              name="requestReschedule"
                              value={formData.requestReschedule}
                              onChange={handleChange}
                              placeholder="Enter Rescheduling Request"
                              className="bhagyainput"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="dhansform-group">
                        <div className="dhansform-label-input">
                          <div className="dhansform-label">
                            <label>
                              Reason for not attending the interview:
                            </label>
                          </div>
                          <div className="dhansform-input">
                            <input
                              type="text"
                              name="reasonForNotAttend"
                              value={formData.reasonForNotAttend}
                              onChange={handleChange}
                              placeholder="Enter Reason"
                              className="bhagyainput"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {showYetToBeConfirmedFields && (
                    <div>
                      {/* Fields for "Yet to be confirmed" status */}
                      <div className="dhansform-group">
                        <div className="dhansform-label-input">
                          <div className="dhansform-label">
                            <label>Attending:</label>
                          </div>
                          <div className="dhansform-input">
                            <input
                              type="text"
                              name="attendingStatus"
                              value={formData.attendingStatus}
                              onChange={handleChange}
                              placeholder="Enter Attending Status"
                              className="bhagyainput"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="dhansform-group">
                        <div className="dhansform-label-input">
                          <div className="dhansform-label">
                            <label>Response Given:</label>
                          </div>
                          <div className="dhansform-input">
                            <input
                              type="text"
                              name="responseGiven"
                              value={formData.responseGiven}
                              onChange={handleChange}
                              placeholder="Enter Response"
                              className="bhagyainput"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="dhansform-group">
                        <div className="dhansform-label-input">
                          <div className="dhansform-label">
                            <label>Comment:</label>
                          </div>
                          <div className="dhansform-input">
                            <input
                              type="text"
                              name="comment"
                              value={formData.comment}
                              onChange={handleChange}
                              placeholder="Enter Comment"
                              className="bhagyainput"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="submit-container">
                    <button type="submit" className="submit-button">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default InterviewForm;

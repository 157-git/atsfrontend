import React, { useState } from 'react';
import './RecruiterReminder.css'; // Import the CSS file
import { API_BASE_URL } from "../api/api";

const InterviewForm = ({toggleAllInterviewResponse}) => {
  const [formData, setFormData] = useState({
    requirementId: '',
    jobDesignation: '',
    requirementCompany: '',
    candidateName: '',
    candidateId: '',
    candidateInterviewTime: '',
    candidateInterview: '',
    interviewStatus: '',
    interviewerName: '',
    interviewDuration: '',
    questionsAsked: '',
    answersGiven: '',
    answersNotGiven: '',
    comments: '',
    requestReschedule: '',
    reasonNotAttending: '',
    attending: '',
    responseGiven: '',
    comments: '',
  });

   const initialInterviewDataState = {
    jobDesignation: "",
    requirementId: "",
    requirementCompany: "",
  };

    const { employeeId } = useParams();

     const [interviewData, setInterviewData] = useState(
    initialInterviewDataState
  );

  const [showReminder, setShowReminder] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showNoFields, setShowNoFields] = useState(false);
  const [showYetToBeConfirmedFields, setShowYetToBeConfirmedFields] = useState(false);


const [requirementOptions, setRequirementOptions] = useState([]);
  const [candidateData,setCandidateData]=useState([]);
  const [newCandidateData, setNewCandidateData] = useState({
    candidateId: '',
    candidateName: '',
    candidateInterview: '',
    candidateInterviewTime: ''
  });  
   const [errors, setErrors] = useState({});

useEffect(() => {
  console.log(formData);
}, [formData]);
   useEffect(() => {
    // fetchRecruiterName();
    fetchRequirementOptions();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      status: value
    });
    if (value === 'Yes') {
      setShowReminder(false);
      setShowAdditionalFields(true);
      setShowNoFields(false);
      setShowYetToBeConfirmedFields(false);
    } else if (value === 'No') {
      setShowReminder(false);
      setShowAdditionalFields(false);
      setShowNoFields(true);
      setShowYetToBeConfirmedFields(false);
    } else if (value === 'Yet to be confirmed') {
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
  e.preventDefault();
      setFormData({...formData,...newCandidateData,...interviewData})
      console.log(formData);
  try {
    let response;
    if (formData.interviewStatus === "Yes") {
      response = await axios.post('http://192.168.1.38:1414/api/interview/details', formData);
      await axios.post('http://192.168.1.38:1414/api/interview/status/yes', formData);
    } else if (formData.interviewStatus === "No") {
      response = await axios.post('http://192.168.1.38:1414/api/interview/details', formData);
      await axios.post('http://192.168.1.38:1414/api/interview/status/no', formData);
    } else if (formData.interviewStatus === "Yet to be confirmed") {
      response = await axios.post('http://192.168.1.38:1414/api/interview/details', formData);
      await axios.post('http://192.168.1.38:1414/api/interview/status/yet-to-be-confirmed', formData);
    }

    if (response.interviewStatus == 200) {
      alert("Data submitted successfully!");
    }
  } catch (error) {
    console.error("Error submitting data:", error);
    alert("There was an error submitting the form. Please try again.");
  }
};
const fetchRequirementIdCandidate = async (requirementId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/candidate-details/${requirementId}`
      );
      const { data } = response;

      setCandidateData(data);
    } catch (error) {
      console.error("Error fetching requirement options:", error);
    }
  };

  const handleRequirementChange = (e) => {
    const { value } = e.target;
    const selectedRequirement = requirementOptions.find(
      (requirement) => requirement.requirementId === parseInt(value)
    );
    if(selectedRequirement){
      fetchRequirementIdCandidate(selectedRequirement.requirementId);
    }

    if (selectedRequirement) {
      setInterviewData((prevState) => ({
        ...prevState,
        requirementId: selectedRequirement.requirementId,
        jobDesignation: selectedRequirement.designation,
        requirementCompany: selectedRequirement.companyName,
      }));
     
      setendPoint(selectedRequirement.detailAddress);
    } else {
      setInterviewData((prevState) => ({
        ...prevState,
        requirementId: value,
        jobDesignation: "",
        requirementCompany: "",
      }));
      
    }
//     setErrors((prevErrors) => ({ ...prevErrors, requirementId: "" }));
  };

  const handleCandidateChange = (e) => {
    const { value } = e.target;
    const selectedCandidate = candidateData.find(
      (candidate) => candidate[0] === parseInt(value)
    );
    if (selectedCandidate) {
      setNewCandidateData({
        candidateId: selectedCandidate[0],
        candidateName: selectedCandidate[1],
        candidateInterview: selectedCandidate[2],
        candidateInterviewTime: selectedCandidate[3]
      });
    } else {
      setNewCandidateData({
        candidateId: value,
        candidateName: "",
        candidateInterview: "",
        candidateInterviewTime: ""
      });
    }
  };

  

const fetchRequirementOptions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/company-details`
      );
      const { data } = response;
      setRequirementOptions(data);
    } catch (error) {
      console.error("Error fetching requirement options:", error);
    }
  };

  return (
    
    <div className="dhann-container">
   
      <div className="card left-card">

      <div className="dhansform-group">
          <div className="dhansform-label-input">
            <div className="dhansform-label">
              <label>Job ID:</label>
            </div>
            <div className="dhanssform-input">
              <select
                name="jobId"
                value={formData.jobId}
                onChange={handleChange}
                 className="bhagyainput"
              >
                <option value="">Select Job ID</option>
                <option value="job1">Java Developer</option>
                <option value="job2">Frontend Developer</option>
                <option value="job3">Backend Developer</option>
              </select>
            </div> 
          </div>
        </div>


        <div className="dhansform-group">
          <div className="dhansform-label-input">
            <div className="dhansform-label">
              <label>Candidate ID:</label>
            </div>
            <div className="dhanssform-input">
              <label>1</label>
            </div> 
          </div>
        </div>
        <div className="dhansform-group">
          <div className="dhansform-label-input">
            <div className="dhansform-label">
              <label>Company Name:</label>
            </div>
            <div className="dhanssform-input">
              <label>Accenture</label>
            </div> 
          </div>
        </div>  



        <div className="dhansform-group">
          <div className="dhansform-label-input">
            <div className="dhansform-label">
              <label>Candidate Name:</label>
            </div>
            <div className="dhanssform-input">
              <select
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                 className="bhagyashreeinput"
              >
                <option value="">Select Candidate Name</option>
                <option value="dhanashree">Dhanashree</option>
                <option value="john">John Doe</option>
                <option value="jane">Jane Smith</option>
              </select>
            </div> 
          </div>
        </div>

       





        <div className="dhansform-group">
          <div className="dhansform-label-input">
            <div className="dhansform-label">
              <label>Designation:</label>
            </div>
            <div className="dhanssform-input">
              <label>Software Engineer</label>
            </div> 
          </div>
        </div>
        <div className="dhansform-group">
          <div className="dhansform-label-input">
            <div className="dhansform-label">
              <label>Interview Schedule Time:</label>
            </div>
            <div className="dhanssform-input">
              <label>1 pm</label>
            </div> 
          </div>
        </div>
        <div className="dhansform-group">
          <div className="dhansform-label-input">
            <div className="dhansform-label">
              <label>Interview Type:</label>
            </div>
            <div className="dhanssform-input">
              <label>L3</label>
            </div> 
          </div>
        </div>
      </div>

<div className='SampleBhagya'>
      <div className="card right-card">
        <div className="dhansform-group">
          <div className="dhansform-label-input">
            <div className="dhansform-label">
              <label>Interview Status:</label>
            </div>
            <div className="dhansform-input">
              <select
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
                className="bhagyainput"
              >
                <option value="">Select Status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Yet to be confirmed">Yet to be confirmed</option>
              </select>
            </div>
          </div>
        </div>

        {showAdditionalFields && (
          <div>
           
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
                  <input
                    type="text"
                    name="questionsAsked"
                    value={formData.questionsAsked}
                    onChange={handleChange}
                    placeholder="Enter Questions Asked"
                     className="bhagyainput"
                  />
                </div>
              </div>
            </div>

            <div className="dhansform-group">
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
            </div>

            <div className="dhansform-group">
              <div className="dhansform-label-input">
                <div className="dhansform-label">
                  <label>Which questions remain unanswered?

</label>
                </div>
                <div className="dhansform-input">
                  <input
                    type="text"
                    name="answersNotGiven"
                    value={formData.answersNotGiven}
                    onChange={handleChange}
                    placeholder="Enter Answers Not Given"
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
            {/* <div className="dhansform-group">
              <div className="dhansform-label-input">
                <div className="dhansform-label">
                  <label>Discussion End:</label>
                </div>
                <div className="dhansform-input">
                  <input
                    type="text"
                    name="discussionEnd"
                    value={formData.discussionEnd}
                    onChange={handleChange}
                    placeholder="Enter Discussion End Time"
                  />
                </div>
              </div>
            </div> */}

            <div className="dhansform-group">
              <div className="dhansform-label-input">
                <div className="dhansform-label">
                  <label>Request to Reschedule:</label>
                </div>
                <div className="dhansform-input">
                  <input
                    type="text"
                    name="requestInterviewSchedule"
                    value={formData.requestInterviewSchedule}
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
                  <label>Reason for not attending the interview:</label>
                </div>
                <div className="dhansform-input">
                  <input
                    type="text"
                    name="reasonNotAttending"
                    value={formData.reasonNotAttending}
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
            <div className="dhansform-group">
              <div className="dhansform-label-input">
                <div className="dhansform-label">
                  <label>Attending:</label>
                </div>
                <div className="dhansform-input">
                  <input
                    type="text"
                    name="attending"
                    value={formData.attending}
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


 <div className="submit-container">
      <button type="submit" onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </div>

      
      </div>


     
</div>


     

    </div>
  );
};

export default InterviewForm;
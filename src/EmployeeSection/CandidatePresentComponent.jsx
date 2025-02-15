// Rajlaxmi Jagadale Create that Duplicate-candidate Date 04-02-2025
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "../EmployeeSection/CandidatePresent.css";
import dummyImage from "../EmployeeSection/dummy.jpg"; 
import warningImg from "../assets/warning.png";

const CandidatePresentComponent = ({ candidateData, onClose }) => {
    const [candidateImage, setCandidateImage] = useState(dummyImage);

    // Update candidate image only when candidateData.photo changes
    useEffect(() => {
      if (candidateData?.photo) {
        setCandidateImage(candidateData.photo);
      }
    }, [candidateData?.photo]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Rejected":
        return "status-red";
      case "Selected":
        return "status-green1";
      case "Hold":
        return "status-orange";
      case "Pending":
        return "status-yellow";
      default:
        return "status-default";
    }
  };

  const getStatusMessage = () => {
    if (!candidateData) return "Loading data...";

    const {
      selectYesOrNo,
      finalStatus,
      recruiterName,
      candidateAddedTime,
    } = candidateData;

    if (selectYesOrNo !== "Interested") {
      return `This candidate already exists in the database. Added by ${recruiterName} on ${candidateAddedTime}.`;
    }

    switch (finalStatus) {
      case "Hold":
        return (
          <span>
            This candidate's application is on Hold. Added by {recruiterName} on {candidateAddedTime}.
          </span>
        );
      case "Rejected":
        return (
          <span>
            This candidate's application was Rejected. Added by {recruiterName} on {candidateAddedTime}.
          </span>
        );
      case "No Response":
        return (
          <span>
            This candidate did not respond to further communication. Added by {recruiterName} on {candidateAddedTime}.
          </span>
        );
      case "Back Out":
        return (
          <span>
            This candidate backed out of the process. Added by {recruiterName} on {candidateAddedTime}.
          </span>
        );
      case "Pending":
        return (
          <span>
            This candidate's application is Pending. Added by {recruiterName} on {candidateAddedTime}.
          </span>
        );
      default:
        return (
          <strong>
            Application status: <span className="status-green1">{finalStatus}</span>. Added by {recruiterName} on {candidateAddedTime}.
          </strong>
        );
    }
  };

  return (
    <div className="candidate-form-container">
     
      <div className="candidate-form">
        
        <div style={{
          width:"100px",
          alignContent:"center"
        }}>
          <img src={candidateImage} alt="Candidate" className="candidate-image"
          style={{
            width:"90px"
          }}
          />
        </div>

        <div className="candidate-details">
          {candidateData ? (
            <div className="candidate-info">
              <h2 className="candidate-name">Name: {candidateData.candidateName}</h2>
              <h4 className="recruiter-name">Recruiter Name: {candidateData.recruiterName}</h4>
              <p className="candidate-description">{getStatusMessage()}</p>
              <div className="job-info">
                <div className="compdesdiv1">
                <p className="paragraphWidth50"><b>Job ID:</b> {candidateData.requirementId}</p>
                <p className="paragraphWidth50"><b>Company:</b> {candidateData.requirementCompany}</p>
             </div>
              </div>
              <div className="compdesdiv1">
              <p className="paragraphWidth50"><b>Designation:</b> {candidateData.jobDesignation}</p>
              <p className={`candidate-status ${getStatusClass(candidateData.finalStatus)} paragraphWidth50`}>
                <b>Final Status:</b> {candidateData.finalStatus}
              </p>
              </div>
            </div>
          ) : (
            <p>Loading Data...</p>
          )}
        </div>
        <button className="close-buttonPresentForm" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="imgandwarningdiv">
        <div className="mainblockdiv">
        <div className="centerdiv">
          <div className="imagedivpresent">
          <img src={warningImg} alt=''/>
          </div>
 
       
        <div>Duplicate Candidate</div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePresentComponent;

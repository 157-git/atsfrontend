// Rajlaxmi Jagadale Create that Duplicate-candidate Date 04-02-2025
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "../EmployeeSection/CandidatePresent.css";
import dummyImage from "../EmployeeSection/dummy.jpg"; 

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
        return "status-green";
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
            Application status: <span className="status-green">{finalStatus}</span>. Added by {recruiterName} on {candidateAddedTime}.
          </strong>
        );
    }
  };

  return (
    <div className="candidate-form-container">
      <div className="candidate-form">
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="candidate-image-container">
          <img src={candidateImage} alt="Candidate" className="candidate-image" />
        </div>

        <div className="candidate-details">
          {candidateData ? (
            <div className="candidate-info">
              <h2 className="candidate-name">Name: {candidateData.candidateName}</h2>
              <h3 className="recruiter-name">Recruiter Name: {candidateData.recruiterName}</h3><br />
              <p className="candidate-description">{getStatusMessage()}</p>
              <div className="job-info">
                <p><b>Job ID:</b> {candidateData.requirementId}</p>
                <p><b>Company:</b> {candidateData.requirementCompany}</p>
                <p><b>Designation:</b> {candidateData.jobDesignation}</p>
              </div>
              <p className={`candidate-status ${getStatusClass(candidateData.finalStatus)}`}>
                <b>Final Status:</b> {candidateData.finalStatus}
              </p>
            </div>
          ) : (
            <p>Loading Data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidatePresentComponent;

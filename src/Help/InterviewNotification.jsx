import React, { useState, useEffect } from 'react';
import './InterviewNotification.css';

const InterviewNotification = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, jobId: 'Java Developer', companyName: 'Accenture', designation: 'Software Engineer', rounds: 'L4', attending: null, interested: null }
  ]);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dhannotification-container">
      {showPopup && (
        <div className="dhann-popup">
          <p className="reminder-text">Reminder!!</p>
          {candidates.map(candidate => (
            <div key={candidate.id} className="dhancandidate">
              <div className="availability-info">
                <p><strong>Candidate Job ID:</strong> {candidate.jobId}</p>
                <p><strong>Candidate Name:</strong> Dhanashree Lokhande</p>
                <p><strong>Candidate ID:</strong> {candidate.id}</p>
                <p><strong>Company Name:</strong> {candidate.companyName}</p>
                <p><strong>Designation:</strong> {candidate.designation}</p>
                <p><strong>Rounds of Interview:</strong> {candidate.rounds}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewNotification;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InterviewTable.css';

const InterviewDataTables = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [details, setDetails] = useState([]);
  const [statusYes, setStatusYes] = useState([]);
  const [statusNo, setStatusNo] = useState([]);
  const [statusYetToBeConfirmed, setStatusYetToBeConfirmed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);
  useEffect(() => {
  console.log(statusYes);
}, [statusYes]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [detailsRes, yesRes, noRes, yetToBeConfirmedRes] = await Promise.all([
        axios.get('http://192.168.1.38:1414/api/interview/details'),
        axios.get('http://192.168.1.38:1414/api/interview/status/yes/All'),
        axios.get('http://192.168.1.38:1414/api/interview/status/no/All'),
        axios.get('http://192.168.1.38:1414/api/interview/status/yet-to-be-confirmed/All')
      ]);
      setDetails(detailsRes.data);
setStatusYes(yesRes.data);
console.log(statusYes)
      setStatusNo(noRes.data);
      // console.log(statusNo)

      setStatusYetToBeConfirmed(yetToBeConfirmedRes.data);
      // console.log(statusYetToBeConfirmed);
      setLoading(false);
    } catch (err) {
      setError('Error fetching interview data');
      setLoading(false);
    }
  };

  if (loading) return <div className="Interviewloading">Loading...</div>;
  if (error) return <div className="Interviewerror">{error}</div>;

  return (
    <div className="interview-data-container">
      <h2>Interview Data</h2>
      <div className="tabs">
        <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>Details</button>
        <button className={activeTab === 'yes' ? 'active' : ''} onClick={() => setActiveTab('yes')}>Status Yes</button>
        <button className={activeTab === 'no' ? 'active' : ''} onClick={() => setActiveTab('no')}>Status No</button>
        <button className={activeTab === 'yetToBeConfirmed' ? 'active' : ''} onClick={() => setActiveTab('yetToBeConfirmed')}>Yet To Be Confirmed</button>
      </div>

      {activeTab === 'details' && (
        <table className="interview-table">
          <thead>
            <tr>
              <th>Job Description</th>
              <th>Designation</th>
              <th>Company Name</th>
              <th>Candidate Name</th>
              <th>Candidate ID</th>
              <th>Interview Time</th>
              <th>Interview Type</th>
            </tr>
          </thead>
          <tbody>
            {details.map((interview) => (
              <tr key={interview.id}>
                <td>{interview.jobDescription}</td>
                <td>{interview.designation}</td>
                <td>{interview.companyName}</td>
                <td>{interview.candidateName}</td>
                <td>{interview.candidateId}</td>
                <td>{new Date(interview.interviewScheduleTime).toLocaleString()}</td>
                <td>{interview.interviewType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'yes' && (
        <table className="interview-table">
          <thead>
            <tr>
              <th>Interviewer Name</th>
              <th>Interview Duration</th>
              <th>Questions Asked</th>
              <th>Answers Given</th>
              <th>Answers Not Given</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(statusYes) && statusYes.map((status) => (
             <tr key={status.id}>
             <td>{status.interviewerName}</td>
             <td>{status.interviewDuration}</td>
             <td>{status.questionsAsked}</td>
             <td>{status.answersGiven}</td>
             <td>{status.answersNotGiven}</td>
             <td>{status.comments}</td>
            </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'no' && (
        <table className="interview-table">
          <thead>
            <tr>
              <th>Request Reschedule</th>
              <th>Reason Not Attending</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(statusNo) && statusNo.map((status) => (
              <tr key={status.id}>
                <td>{status.requestReschedule}</td>
                <td>{status.reasonNotAttending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'yetToBeConfirmed' && (
        <table className="interview-table">
          <thead>
            <tr>
              <th>Attending</th>
              <th>Response Given</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
             {Array.isArray(statusYetToBeConfirmed) && statusYetToBeConfirmed.map((status) => (
      
              <tr key={status.id}>
                <td>{status.attending}</td>
                <td>{status.responseGiven}</td>
                <td>{status.comments}</td>
              </tr>
))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InterviewDataTables;
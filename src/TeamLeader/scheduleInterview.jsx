// neha_schedule_interview_all_page_18_07_

import React, { useState } from "react";
import { RWebShare } from "react-web-share";
import "./scheduleInterview.css";

import googleMeetLogo from "../LogoImages/googlemeet.png";
import microsoftTeamsLogo from "../LogoImages/microsoftteam.jpeg";
import zoomLogo from "../LogoImages/zoom.jpg";
import slack from "../LogoImages/slack.png";

function ScheduleInterview() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [meetingLink, setMeetingLink] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidateContact, setCandidateContact] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [interviewer, setInterviewer] = useState("");

  const platforms = [
    {
      name: "Google Meet",
      logo: googleMeetLogo,
      baseUrl: "https://meet.google.com/new",
    },
    {
      name: "Microsoft Teams",
      logo: microsoftTeamsLogo,
      baseUrl: "https://teams.microsoft.com/",
    },
    { name: "Zoom", logo: zoomLogo, baseUrl: "https://zoom.us/" },
    { name: "Slack", logo: slack, baseUrl: "https://slack.com/intl/en-in" },
  ];

  const jobIds = ["Job1", "Job2", "Job3"]; // Replace with actual job IDs

  const createNewMeeting = () => {
    const platform = platforms.find((p) => p.name === selectedPlatform);
    if (platform) {
      const newLink = platform.baseUrl;
      setMeetingLink(newLink);
    }
  };

  const handleJobIdChange = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);

    // Here you can add logic to fetch and set the client info based on the selected job ID
    if (jobId === "Job1") {
      setClientName("Client 1");
      setClientEmail("client1@example.com");
      setInterviewer("Hr in TCS");
    } else if (jobId === "Job2") {
      setClientName("Client 2");
      setClientEmail("client2@example.com");
      setInterviewer("Hr in Wipro");
    } else if (jobId === "Job3") {
      setClientName("Client 3");
      setClientEmail("client3@example.com");
      setInterviewer("Hr in Infosys");
    } else {
      setClientName("");
      setClientEmail("");
      setInterviewer("");
    }
  };

  return (
    <div className="Interview-App">
      {!selectedPlatform ? (
        <div className="platform-selection">
          <h1 style={{ textDecoration: "underline", fontSize: "18px" }}>
            Select a Platform
          </h1>
          <br />
          <div className="platforms">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="platform-card"
                onClick={() => setSelectedPlatform(platform.name)}
              >
                <img
                  src={platform.logo}
                  alt={`${platform.name} logo`}
                  className="platform-logo"
                />
                <h2>{platform.name}</h2>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form className="interview-form" onSubmit={(e) => e.preventDefault()}>
          <div className="interview-form-header">
            {selectedPlatform} Meeting
          </div>
          <div className="interview-form-content">
            <div className="Interview-form-group">
              <label className="user-type-label">
                Job ID:
                <select value={selectedJobId} onChange={handleJobIdChange}>
                  <option value="">Select Job ID</option>
                  {jobIds.map((jobId) => (
                    <option key={jobId} value={jobId}>
                      {jobId}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div
              className="clientorcandidatesection"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <div
                className="candidatesection"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div className="form-fields">
                  <div
                    className="candidatesectionsubdiv"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <label>Candidate Name:</label>
                    <input
                      style={{}}
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="Candidate Name"
                    />
                  </div>
                  <div
                    className="candidatesectionsubdiv"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <label>Email ID:</label>
                    <input
                      type="email"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="Candidate Email ID"
                    />
                  </div>
                  <div
                    className="candidatesectionsubdiv"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <label>Contact No:</label>
                    <input
                      type="text"
                      value={candidateContact}
                      onChange={(e) => setCandidateContact(e.target.value)}
                      placeholder="Candidate Contact No"
                    />
                  </div>
                </div>
              </div>

              <div className="clientsection">
                <div className="form-fields">
                  <div
                    className="clientsectionsubdiv"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <label>Client Name:</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Client Name"
                    />
                  </div>
                  <div
                    className="clientsectionsubdiv"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <label>Email ID:</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="Client Email ID"
                    />
                  </div>
                  <div
                    className="clientsectionsubdiv"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <label>Interviewer Name:</label>
                    <input
                      type="text"
                      value={interviewer}
                      onChange={(e) => setInterviewer(e.target.value)}
                      placeholder="Interviewer Name"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="interview-button-container">
              <button
                className="interview-form-button"
                type="button"
                onClick={createNewMeeting}
                disabled={!selectedJobId}
              >
                Create New Meeting
              </button>
            </div>
            {meetingLink && (
              <div className="meeting-details">
                <p className="meeting-link">
                  Meeting Link:{" "}
                  <a
                    href={meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {meetingLink}
                  </a>
                </p>
                <div className="share-buttons">
                  <RWebShare
                    data={{
                      title: "Meeting Invitation",
                      text: "Join the meeting using this link:",
                      url: meetingLink,
                    }}
                  >
                    <button className="share-button">Share Link</button>
                  </RWebShare>
                  <button
                    className="share-button"
                    style={{ marginLeft: "10px" }}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default ScheduleInterview;

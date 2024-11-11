import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { RWebShare } from "react-web-share";
import "../ResumeData/shareLink.css";

const ShareLink = ({ toggleResumeLink }) => {
  const { employeeId, userType } = useParams();
  const [copyMessage, setCopyMessage] = useState("");

  // Hardcoded base URL for sharing
  const shareUrl = `http://93.127.199.85/157industries/${employeeId}/${userType}/candidate-form`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopyMessage("The link has been copied to your clipboard.");
        setTimeout(() => setCopyMessage(""), 3000); // Clear message after 3 seconds
      })
      .catch((err) => {
        setCopyMessage("Failed to copy the link. Please try again.");
        console.error("Copy failed: ", err);
      });
  };

  return (
    <div className="shareLink-mainDiv">
      <div className="shareLink-share-btn-Div">
        <h1>Share Link To Candidate</h1>
        <div className="share-copy-div">
          {navigator.share ? (
            <RWebShare
              data={{
                url: shareUrl,
                title: "Share Candidate Form",
                text: "Click the link to fill out the candidate form",
              }}
            >
              <button className="shareLink-share-btn">Share 🔗</button>
            </RWebShare>
          ) : (
            <button className="shareLink-share-btn" onClick={() => alert("Sharing is not supported on this device.")}>
              Share 🔗
            </button>
          )}
          <button className="shareLink-share-btn" onClick={handleCopyLink}>
            Copy Link 🔗
          </button>
        </div>
        <span style={{ color: "black", fontSize: "14px" }}>
          Share this link with the candidate so they can fill in their information through the link.
        </span>
        {copyMessage && (
          <div className="copyMessage">
            <span style={{ color: "green", fontSize: "14px" }}>{copyMessage}</span>
          </div>
        )}
      </div>
      
      <div className="shareLink-view-btn-Div">
        <h1>Resume Builder</h1>
        <button className="shareLink-view-btn" onClick={toggleResumeLink}>
          Create
        </button>
        <span style={{ color: "black", fontSize: "14px" }}>
          If the candidate doesn't have a resume, they can create one here.
        </span>
      </div>
    </div>
  );
};

export default ShareLink;

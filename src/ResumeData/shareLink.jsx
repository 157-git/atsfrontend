import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { RWebShare } from "react-web-share";
import "../ResumeData/shareLink.css";

const ShareLink = ({ toggleResumeLink }) => {
  const { employeeId, userType } = useParams();
  const [copyMessage, setCopyMessage] = useState("");

  // Hardcoded base URL for sharing
  const shareUrl = `http://93.127.199.85/157industries/${employeeId}/${userType}/candidate-form`; // Ensure HTTPS

  const handleFallbackShare = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopyMessage("The link has been copied to your clipboard.");
        setTimeout(() => setCopyMessage(""), 3000); // Clear message after 3 seconds
      })
      .catch(err => {
        setCopyMessage("Failed to copy the link. Please try again.");
        console.error("Copy failed: ", err);
      });
  };

  const handleCopyClick = () => {
    handleFallbackShare(); // Call the same function for copying
  };

  return (
    <div className="shareLink-mainDiv">
      {navigator.share ? (
        <RWebShare
          data={{
            url: shareUrl, // This will be shared and will open directly in the browser when clicked
            title: "Share Candidate Form",
            text: "Click the link to fill out the candidate form",
          }}
        >
          <div className="shareLink-share-btn-Div">
            <h1>Share Link To Candidate</h1>
            <div className="share-copy-div">
              <button className="shareLink-share-btn">Share 🔗</button>
              <button className="shareLink-share-btn" onClick={handleCopyClick}>
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
        </RWebShare>
      ) : (
        <div className="shareLink-share-btn-Div">
          <h1>Share Link To Candidate</h1>
          <button className="shareLink-share-btn" onClick={handleFallbackShare}>
            Copy Link 🔗
          </button>
          <span style={{ color: "black", fontSize: "14px" }}>
            Copy this link and send it to the candidate: {shareUrl}
          </span>
        </div>
      )}
     
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
